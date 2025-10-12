#!/usr/bin/env tsx

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { parseVocabularyIdentifier } from '@/utils/vocabulary-id';

// Load .env.local first (development), then fall back to .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const BATCH_SIZE = Number(process.env.GEM_BACKFILL_BATCH_SIZE ?? '500');
const DRY_RUN = process.argv.includes('--dry-run');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

type WordPerformanceLog = {
  id: string;
  session_id: string;
  vocabulary_id: number | string | null;
  was_correct: boolean;
  response_time_ms: number | null;
  hint_used: boolean | null;
  streak_count: number | null;
  timestamp: string;
};

type BackfillStats = {
  processed: number;
  skipped: number;
  failed: number;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function backfillVocabularyGems(): Promise<void> {
  let cursor: string | null = null;
  const stats: BackfillStats = { processed: 0, skipped: 0, failed: 0 };

  console.log('🚀 Starting vocabulary gem backfill');
  console.log(`📝 Dry run: ${DRY_RUN}, Batch size: ${BATCH_SIZE}`);

  while (true) {
    let query = supabase
      .from('word_performance_logs')
      .select('id, session_id, vocabulary_id, vocabulary_uuid, centralized_vocabulary_id, word_text, translation_text, language, was_correct, response_time_ms, hint_used, streak_count, timestamp')
      .order('timestamp', { ascending: true })
      .limit(BATCH_SIZE);

    if (cursor) {
      query = query.gt('timestamp', cursor);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Failed to fetch word performance logs:', error);
      break;
    }

    if (!data || data.length === 0) {
      console.log('✅ Backfill complete');
      break;
    }

    // Build a session_id -> student_id map for this batch
    const sessionIds = Array.from(new Set((data as any[]).map(r => r.session_id).filter(Boolean)));
    const { data: sessions, error: sessionErr } = await supabase
      .from('enhanced_game_sessions')
      .select('id, student_id')
      .in('id', sessionIds);

    if (sessionErr) {
      console.error('❌ Failed to fetch sessions for batch:', sessionErr);
      break;
    }

    const sessionToStudent = new Map<string, string>();
    for (const s of sessions || []) {
      sessionToStudent.set(s.id as string, s.student_id as string);
    }

    // Build a map of legacy -> uuid for this batch to avoid per-row lookups
    const legacyIds = Array.from(new Set((data as any[])
      .map(r => r.vocabulary_id)
      .filter(v => v !== null && v !== undefined)
      .map((v: any) => v.toString().trim())
      .filter((raw: string) => raw !== '' && !raw.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i))
      .map(Number)
      .filter((n: number) => Number.isFinite(n))));

    const legacyToUuid = new Map<number, string>();
    if (legacyIds.length > 0) {
      const { data: mappings, error: mapErr } = await supabase
        .from('vocabulary_id_mapping')
        .select('legacy_integer_id, centralized_uuid_id')
        .in('legacy_integer_id', legacyIds);
      if (mapErr) {
        console.warn('⚠️ Failed to fetch vocabulary_id_mapping for batch, will fall back per-row:', mapErr);
      } else {
        for (const m of mappings || []) {
          legacyToUuid.set(m.legacy_integer_id as number, m.centralized_uuid_id as string);
        }
      }
    }

    // Build a map of (language, word_text, translation_text) -> uuid for rows still unmapped
    const missingTriples: Array<{ lang: string, word: string, translation: string }> = [];
    const langSet = new Set<string>();
    const wordsSet = new Set<string>();
    const transSet = new Set<string>();
    for (const r of data as any[]) {
      const vocabUuid = (r.vocabulary_uuid || r.centralized_vocabulary_id) as string | null;
      // Include rows with null vocabulary_id if they have word/translation/language
      if (!vocabUuid && r.word_text && r.translation_text && r.language) {
        const lang = (r.language || '').toString().toLowerCase();
        const w = r.word_text.toString().trim().toLowerCase();
        const t = r.translation_text.toString().trim().toLowerCase();
        if (lang && w && t) {
          missingTriples.push({ lang, word: w, translation: t });
          langSet.add(lang);
          wordsSet.add(w);
          transSet.add(t);
        }
      }
    }

    const tripleToUuid = new Map<string, string>();
    if (missingTriples.length > 0) {
      console.log(`🔍 Fetching ${missingTriples.length} triple mappings from centralized_vocabulary...`);
      const { data: cvRows, error: cvErr } = await supabase
        .from('centralized_vocabulary')
        .select('id, language, word, translation')
        .in('language', Array.from(langSet))
        .in('word', Array.from(wordsSet))
        .in('translation', Array.from(transSet));
      if (cvErr) {
        console.warn('⚠️ Failed to fetch centralized_vocabulary for batch triple mapping:', cvErr);
      } else {
        for (const cv of cvRows || []) {
          const key = `${(cv.language || '').toLowerCase()}|${(cv.word || '').toLowerCase()}|${(cv.translation || '').toLowerCase()}`;
          tripleToUuid.set(key, cv.id as string);
        }
        console.log(`✅ Mapped ${tripleToUuid.size} triples to UUIDs`);
      }
    }

    for (const row of data as any[]) {
      cursor = row.timestamp;

      const studentId = sessionToStudent.get(row.session_id);

      if (!studentId) {
        stats.skipped += 1;
        continue;
      }

      // Determine the UUID to use for RPC
      let vocabUuid: string | null = (row as any).vocabulary_uuid || (row as any).centralized_vocabulary_id || null;

      // If no UUID yet, try parsing vocabulary_id
      if (!vocabUuid && row.vocabulary_id !== null && row.vocabulary_id !== undefined) {
        const parsedIdentifier = parseVocabularyIdentifier(row.vocabulary_id);
        if (parsedIdentifier.isValid) {
          if (parsedIdentifier.centralizedVocabularyId) {
            vocabUuid = parsedIdentifier.centralizedVocabularyId;
          } else if (parsedIdentifier.vocabularyItemId !== null) {
            vocabUuid = legacyToUuid.get(parsedIdentifier.vocabularyItemId) || null;
          }
        }
      }

      // Try triple match fallback
      if (!vocabUuid && row.word_text && row.translation_text && row.language) {
        const key = `${row.language.toString().toLowerCase()}|${row.word_text.toString().trim().toLowerCase()}|${row.translation_text.toString().trim().toLowerCase()}`;
        const byTriple = tripleToUuid.get(key) || null;
        if (byTriple) {
          vocabUuid = byTriple;
        }
      }

      if (!vocabUuid) {
        // Cannot resolve mapping; skip
        stats.skipped += 1;
        continue;
      }

      if (DRY_RUN) {
        stats.processed += 1;
        continue;
      }

      const rpcParams: Record<string, any> = {
        p_student_id: studentId,
        p_was_correct: row.was_correct,
        p_centralized_vocabulary_id: vocabUuid,
        p_response_time_ms: row.response_time_ms ?? 0,
        p_hint_used: row.hint_used ?? false,
        p_streak_count: row.streak_count ?? 0
      };

      const { error: rpcError } = await supabase.rpc('update_vocabulary_gem_collection_atomic', rpcParams);

      if (rpcError) {
        stats.failed += 1;
        console.error('❌ RPC error for row:', {
          id: row.id,
          studentId,
          vocabularyId: row.vocabulary_id,
          resolvedUuid: vocabUuid,
          error: rpcError
        });
        // Avoid hammering the database if we hit consecutive failures
        await sleep(50);
        continue;
      }

      stats.processed += 1;
    }

    // Short pause between batches to avoid overwhelming the database
    await sleep(100);
  }

  console.log('📊 Backfill summary:', stats);

  if (stats.failed > 0) {
    console.warn('⚠️ Some rows failed to backfill. Please review the logs above.');
  }

  if (DRY_RUN) {
    console.log('🧪 Dry run completed — no database changes were made.');
  }
}

backfillVocabularyGems().catch(error => {
  console.error('❌ Unexpected backfill error:', error);
  process.exit(1);
});

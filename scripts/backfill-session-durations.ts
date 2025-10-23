/**
 * Backfill missing duration_seconds in enhanced_game_sessions
 * 
 * This script updates all sessions where duration_seconds is 0 or NULL
 * by calculating the duration from started_at and ended_at timestamps.
 * 
 * Run with: npx tsx scripts/backfill-session-durations.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SessionRow {
  id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number;
  student_id: string;
  assignment_id: string;
  game_type: string;
}

async function backfillSessionDurations() {
  console.log('🔍 Starting session duration backfill...\n');

  try {
    // Step 1: Find all sessions with 0 or NULL duration but have ended_at
    console.log('📊 Querying sessions with missing durations...');
    
    const { data: sessionsToUpdate, error: queryError } = await supabase
      .from('enhanced_game_sessions')
      .select('id, started_at, ended_at, duration_seconds, student_id, assignment_id, game_type')
      .not('ended_at', 'is', null)
      .or('duration_seconds.is.null,duration_seconds.eq.0')
      .order('started_at', { ascending: false });

    if (queryError) {
      throw new Error(`Query error: ${queryError.message}`);
    }

    if (!sessionsToUpdate || sessionsToUpdate.length === 0) {
      console.log('✅ No sessions need duration backfill!');
      return;
    }

    console.log(`📈 Found ${sessionsToUpdate.length} sessions to update\n`);

    // Step 2: Calculate durations and prepare updates
    const updates: Array<{ id: string; duration_seconds: number }> = [];
    const stats = {
      total: sessionsToUpdate.length,
      updated: 0,
      skipped: 0,
      errors: 0,
      byGame: new Map<string, { count: number; totalDuration: number }>()
    };

    for (const session of sessionsToUpdate) {
      const startTime = new Date(session.started_at).getTime();
      const endTime = session.ended_at ? new Date(session.ended_at).getTime() : null;

      if (!endTime) {
        console.log(`⚠️  Skipping session ${session.id} - no ended_at timestamp`);
        stats.skipped++;
        continue;
      }

      const calculatedDuration = Math.round((endTime - startTime) / 1000);

      // Sanity check: duration should be positive and less than 4 hours (14400 seconds)
      if (calculatedDuration < 0 || calculatedDuration > 14400) {
        console.log(`⚠️  Skipping session ${session.id} - invalid duration: ${calculatedDuration}s`);
        stats.skipped++;
        continue;
      }

      updates.push({
        id: session.id,
        duration_seconds: calculatedDuration
      });

      // Track stats by game type
      const gameStats = stats.byGame.get(session.game_type) || { count: 0, totalDuration: 0 };
      gameStats.count++;
      gameStats.totalDuration += calculatedDuration;
      stats.byGame.set(session.game_type, gameStats);
    }

    console.log(`\n📝 Prepared ${updates.length} updates`);
    console.log(`⏭️  Skipped ${stats.skipped} invalid sessions\n`);

    // Step 3: Batch update sessions (in chunks of 100)
    const BATCH_SIZE = 100;
    let processedCount = 0;

    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
      const batch = updates.slice(i, i + BATCH_SIZE);
      
      console.log(`🔄 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(updates.length / BATCH_SIZE)} (${batch.length} sessions)...`);

      try {
        // Update each session individually to avoid RLS issues
        for (const update of batch) {
          const { error: updateError } = await supabase
            .from('enhanced_game_sessions')
            .update({ duration_seconds: update.duration_seconds })
            .eq('id', update.id);

          if (updateError) {
            console.error(`   ❌ Error updating session ${update.id}:`, updateError.message);
            stats.errors++;
          } else {
            stats.updated++;
            processedCount++;
            
            // Show progress every 20 updates
            if (processedCount % 20 === 0) {
              console.log(`   ✅ Updated ${processedCount}/${updates.length} sessions...`);
            }
          }
        }

        // Small delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < updates.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (batchError: any) {
        console.error(`   ❌ Batch error:`, batchError.message);
        stats.errors += batch.length;
      }
    }

    // Step 4: Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 BACKFILL SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total sessions found:    ${stats.total}`);
    console.log(`Successfully updated:    ${stats.updated} ✅`);
    console.log(`Skipped (invalid):       ${stats.skipped} ⚠️`);
    console.log(`Errors:                  ${stats.errors} ❌`);
    console.log('');

    if (stats.byGame.size > 0) {
      console.log('📈 Duration statistics by game type:');
      console.log('-'.repeat(60));
      
      const sortedGames = Array.from(stats.byGame.entries())
        .sort((a, b) => b[1].count - a[1].count);
      
      for (const [gameType, gameStats] of sortedGames) {
        const avgDuration = Math.round(gameStats.totalDuration / gameStats.count);
        const avgMinutes = (avgDuration / 60).toFixed(1);
        console.log(`  ${gameType.padEnd(30)} ${gameStats.count.toString().padStart(4)} sessions | Avg: ${avgMinutes} min`);
      }
    }

    console.log('='.repeat(60));
    console.log('\n✅ Backfill complete!');

    // Step 5: Verify a sample of updates
    console.log('\n🔍 Verifying updates...');
    const sampleIds = updates.slice(0, 5).map(u => u.id);
    
    const { data: verifyData, error: verifyError } = await supabase
      .from('enhanced_game_sessions')
      .select('id, game_type, started_at, ended_at, duration_seconds')
      .in('id', sampleIds);

    if (verifyError) {
      console.error('❌ Verification error:', verifyError.message);
    } else if (verifyData) {
      console.log('\n📋 Sample of updated sessions:');
      for (const session of verifyData) {
        const minutes = (session.duration_seconds / 60).toFixed(1);
        console.log(`  ${session.game_type.padEnd(25)} ${session.duration_seconds}s (${minutes} min) ✅`);
      }
    }

  } catch (error: any) {
    console.error('\n❌ Fatal error during backfill:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run the backfill
console.log('🚀 Session Duration Backfill Tool');
console.log('==================================\n');

backfillSessionDurations()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Backfill failed:', error);
    process.exit(1);
  });

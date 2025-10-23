/**
 * Clean up abandoned game sessions
 * 
 * This script finds sessions that were started but never properly ended,
 * and updates them with appropriate ended_at timestamps and durations.
 * 
 * Strategy:
 * 1. Sessions with activity (words_attempted > 0): Mark as completed using last update time
 * 2. Sessions with no activity: Mark as abandoned after 30 seconds
 * 
 * Run with: npx tsx scripts/cleanup-abandoned-sessions.ts
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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AbandonedSession {
  id: string;
  student_id: string;
  assignment_id: string;
  game_type: string;
  started_at: string;
  updated_at: string;
  words_attempted: number;
  words_correct: number;
  completion_status: string;
}

async function cleanupAbandonedSessions(dryRun: boolean = false) {
  console.log('🧹 Starting abandoned session cleanup...');
  console.log(`Mode: ${dryRun ? '🔍 DRY RUN (no changes)' : '✍️  WRITE MODE'}\n`);

  try {
    // Find all sessions without ended_at
    const { data: abandonedSessions, error: queryError } = await supabase
      .from('enhanced_game_sessions')
      .select('id, student_id, assignment_id, game_type, started_at, updated_at, words_attempted, words_correct, completion_status')
      .is('ended_at', null)
      .order('started_at', { ascending: false });

    if (queryError) {
      throw new Error(`Query error: ${queryError.message}`);
    }

    if (!abandonedSessions || abandonedSessions.length === 0) {
      console.log('✅ No abandoned sessions found!');
      return;
    }

    console.log(`📊 Found ${abandonedSessions.length} sessions without ended_at\n`);

    const stats = {
      total: abandonedSessions.length,
      withActivity: 0,
      withoutActivity: 0,
      updated: 0,
      errors: 0,
      byGame: new Map<string, number>()
    };

    const updates: Array<{
      id: string;
      ended_at: string;
      duration_seconds: number;
      completion_status: string;
      reason: string;
    }> = [];

    // Process each abandoned session
    for (const session of abandonedSessions) {
      const startTime = new Date(session.started_at).getTime();
      const lastUpdateTime = new Date(session.updated_at).getTime();
      
      let endTime: number;
      let completionStatus: string;
      let reason: string;

      if (session.words_attempted > 0) {
        // Session has activity - use last update time as end time
        endTime = lastUpdateTime;
        completionStatus = 'completed';
        reason = 'Had activity, using last update time';
        stats.withActivity++;
      } else {
        // Session has no activity - mark as abandoned after 30 seconds
        endTime = startTime + 30000; // 30 seconds
        completionStatus = 'abandoned';
        reason = 'No activity, marking as abandoned';
        stats.withoutActivity++;
      }

      const durationSeconds = Math.round((endTime - startTime) / 1000);

      // Sanity check
      if (durationSeconds < 0 || durationSeconds > 14400) {
        console.log(`⚠️  Skipping ${session.id} - invalid duration: ${durationSeconds}s`);
        continue;
      }

      updates.push({
        id: session.id,
        ended_at: new Date(endTime).toISOString(),
        duration_seconds: durationSeconds,
        completion_status: completionStatus,
        reason
      });

      // Track by game type
      const count = stats.byGame.get(session.game_type) || 0;
      stats.byGame.set(session.game_type, count + 1);
    }

    console.log(`\n📝 Prepared ${updates.length} updates:`);
    console.log(`   ✅ With activity (completed): ${stats.withActivity}`);
    console.log(`   ⏭️  Without activity (abandoned): ${stats.withoutActivity}\n`);

    if (dryRun) {
      console.log('🔍 DRY RUN - Sample updates:');
      console.log('-'.repeat(80));
      updates.slice(0, 10).forEach((update, i) => {
        console.log(`${i + 1}. ${update.id.substring(0, 8)}... | ${update.completion_status.padEnd(10)} | ${update.duration_seconds}s | ${update.reason}`);
      });
      console.log('-'.repeat(80));
      console.log('\n✨ Dry run complete. Run without --dry-run to apply changes.\n');
      return;
    }

    // Apply updates
    console.log('🔄 Applying updates...\n');
    
    const BATCH_SIZE = 50;
    let processedCount = 0;

    for (let i = 0; i < updates.length; i += BATCH_SIZE) {
      const batch = updates.slice(i, i + BATCH_SIZE);
      
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(updates.length / BATCH_SIZE)}...`);

      for (const update of batch) {
        const { error: updateError } = await supabase
          .from('enhanced_game_sessions')
          .update({
            ended_at: update.ended_at,
            duration_seconds: update.duration_seconds,
            completion_status: update.completion_status
          })
          .eq('id', update.id);

        if (updateError) {
          console.error(`   ❌ Error updating ${update.id}:`, updateError.message);
          stats.errors++;
        } else {
          stats.updated++;
          processedCount++;
          
          if (processedCount % 50 === 0) {
            console.log(`   ✅ Updated ${processedCount}/${updates.length}...`);
          }
        }
      }

      // Small delay between batches
      if (i + BATCH_SIZE < updates.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 CLEANUP SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total abandoned sessions:    ${stats.total}`);
    console.log(`  - With activity:           ${stats.withActivity}`);
    console.log(`  - Without activity:        ${stats.withoutActivity}`);
    console.log(`Successfully updated:        ${stats.updated} ✅`);
    console.log(`Errors:                      ${stats.errors} ❌`);
    console.log('');

    if (stats.byGame.size > 0) {
      console.log('📈 Sessions by game type:');
      console.log('-'.repeat(70));
      
      const sortedGames = Array.from(stats.byGame.entries())
        .sort((a, b) => b[1] - a[1]);
      
      for (const [gameType, count] of sortedGames) {
        console.log(`  ${gameType.padEnd(40)} ${count} sessions`);
      }
    }
    
    console.log('='.repeat(70));
    console.log('\n✅ Cleanup complete!\n');

  } catch (error: any) {
    console.error('\n❌ Fatal error during cleanup:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

console.log('🚀 Abandoned Session Cleanup Tool');
console.log('==================================\n');

cleanupAbandonedSessions(dryRun)
  .then(() => {
    console.log('✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Cleanup failed:', error);
    process.exit(1);
  });

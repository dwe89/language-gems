#!/usr/bin/env node
/**
 * Backfill script to populate assessment_types for existing assignments
 * 
 * This script:
 * 1. Fetches all assignments from the database
 * 2. Uses the database function to detect assessment types
 * 3. Updates the assessment_types column for each assignment
 * 
 * Usage:
 *   node scripts/backfill-assessment-types.js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function backfillAssessmentTypes() {
  console.log('🔍 Fetching all assignments...\n');

  // Fetch all assignments that need backfill
  const { data: assignments, error } = await supabase
    .from('assignments')
    .select('id, game_type, type, game_config, assessment_types')
    .or('assessment_types.is.null,assessment_types.eq.[]')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('❌ Error fetching assignments:', error);
    process.exit(1);
  }

  if (!assignments || assignments.length === 0) {
    console.log('✅ No assignments need backfilling');
    return;
  }

  console.log(`📊 Found ${assignments.length} assignments to backfill\n`);

  let updatedCount = 0;
  let errorCount = 0;

  for (const assignment of assignments) {
    try {
      // Use the database function to detect types
      const { data: result, error: detectError } = await supabase
        .rpc('detect_assignment_assessment_types', {
          p_game_type: assignment.game_type,
          p_content_type: assignment.type,
          p_game_config: assignment.game_config || {}
        });

      if (detectError) {
        console.error(`❌ Error detecting types for ${assignment.id}:`, detectError);
        errorCount++;
        continue;
      }

      const detectedTypes = result || [];

      if (detectedTypes.length === 0) {
        console.log(`⚠️  Warning: No types detected for ${assignment.id}`, {
          game_type: assignment.game_type,
          content_type: assignment.type
        });
      }

      // Update the assignment
      const { error: updateError } = await supabase
        .from('assignments')
        .update({ assessment_types: detectedTypes })
        .eq('id', assignment.id);

      if (updateError) {
        console.error(`❌ Error updating ${assignment.id}:`, updateError);
        errorCount++;
      } else {
        console.log(`✅ Updated ${assignment.id}:`, detectedTypes);
        updatedCount++;
      }
    } catch (err) {
      console.error(`❌ Error processing ${assignment.id}:`, err);
      errorCount++;
    }
  }

  console.log('\n📈 Summary:');
  console.log(`   ✅ Updated: ${updatedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📊 Total: ${assignments.length}`);
}

// Run the backfill
backfillAssessmentTypes()
  .then(() => {
    console.log('\n✅ Backfill complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Backfill failed:', error);
    process.exit(1);
  });

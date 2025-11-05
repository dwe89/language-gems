/**
 * Test script to manually trigger assessment completion check
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const assignmentId = '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4';
const studentId = 'cb6f80e4-4ec9-4eb8-99be-1c4dbd6d3ce0';

async function checkAssessmentCompletion() {
  console.log('🔍 Checking assessment completion...\n');

  // 1. Get assignment details
  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .select('game_type, game_config, vocabulary_count')
    .eq('id', assignmentId)
    .single();

  if (assignmentError) {
    console.error('Error fetching assignment:', assignmentError);
    return;
  }

  const selectedAssessments = assignment.game_config?.selectedAssessments || [];

  console.log('Assignment details:', {
    gameType: assignment.game_type,
    assessments: selectedAssessments,
    vocabCount: assignment.vocabulary_count
  });

  // 2. Get sessions for this assessment
  const { data: sessions, error: sessionsError } = await supabase
    .from('enhanced_game_sessions')
    .select('id, completion_percentage, final_score')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .eq('game_type', 'reading-comprehension');

  if (sessionsError) {
    console.error('Error fetching sessions:', sessionsError);
    return;
  }

  console.log('\n📊 Sessions:', sessions);

  // 3. Check if any session has completion_percentage = 100
  const hasCompletedSession = sessions?.some(s => s.completion_percentage >= 100) || false;

  console.log('\n✅ Assessment completed:', hasCompletedSession);

  // 4. Now manually update the enhanced_assignment_progress
  if (hasCompletedSession) {
    const { data: updateResult, error: updateError } = await supabase
      .from('enhanced_assignment_progress')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .select();

    if (updateError) {
      console.error('Error updating progress:', updateError);
      return;
    }

    console.log('\n🎉 Assignment marked as completed:', updateResult);

    // Also update assignment_game_progress
    const { data: gameProgressUpdate, error: gameProgressError } = await supabase
      .from('assignment_game_progress')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .eq('game_id', 'reading-comprehension')
      .select();

    if (gameProgressError) {
      console.error('Error updating game progress:', gameProgressError);
      return;
    }

    console.log('📝 Game progress updated:', gameProgressUpdate);
  }

  // 5. Verify the final state
  const { data: finalProgress } = await supabase
    .from('enhanced_assignment_progress')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId)
    .single();

  console.log('\n📈 Final progress state:', finalProgress);
}

checkAssessmentCompletion().catch(console.error);

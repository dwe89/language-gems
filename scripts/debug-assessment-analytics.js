const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const assignmentId = '401539e9-0860-441a-a0b7-d5b17a887bd2';

async function debugAssessmentAnalytics() {
  console.log('=== DEBUG ASSESSMENT ANALYTICS ===\n');
  
  // 1. Check assignment
  console.log('1. Checking assignment...');
  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .select('id, title, game_type, game_config, class_id')
    .eq('id', assignmentId)
    .single();
  
  if (assignmentError) {
    console.error('Assignment error:', assignmentError);
    return;
  }
  console.log('Assignment:', JSON.stringify(assignment, null, 2));
  console.log('Game type:', assignment.game_type);
  console.log('Is assessment:', assignment.game_type === 'assessment');
  
  // 2. Check reading_comprehension_results directly
  console.log('\n2. Checking reading_comprehension_results...');
  const { data: rcResults, error: rcError } = await supabase
    .from('reading_comprehension_results')
    .select('*')
    .eq('assignment_id', assignmentId);
  
  if (rcError) {
    console.error('RC Results error:', rcError);
  } else {
    console.log('RC Results count:', rcResults?.length || 0);
    if (rcResults && rcResults.length > 0) {
      console.log('RC Results:', JSON.stringify(rcResults, null, 2));
    }
  }
  
  // 3. Check enhanced_game_sessions
  console.log('\n3. Checking enhanced_game_sessions...');
  const { data: sessions, error: sessionError } = await supabase
    .from('enhanced_game_sessions')
    .select('id, student_id, game_type, completion_status, accuracy_percentage, final_score, ended_at')
    .eq('assignment_id', assignmentId);
  
  if (sessionError) {
    console.error('Sessions error:', sessionError);
  } else {
    console.log('Sessions count:', sessions?.length || 0);
    if (sessions && sessions.length > 0) {
      console.log('Sessions:', JSON.stringify(sessions, null, 2));
    }
  }
  
  // 4. Check RPC function
  console.log('\n4. Checking RPC function get_assignment_analytics_sessions...');
  const { data: rpcSessions, error: rpcError } = await supabase
    .rpc('get_assignment_analytics_sessions', {
      p_assignment_id: assignmentId
    });
  
  if (rpcError) {
    console.error('RPC error:', rpcError);
  } else {
    console.log('RPC Sessions count:', rpcSessions?.length || 0);
    if (rpcSessions && rpcSessions.length > 0) {
      console.log('RPC Sessions:', JSON.stringify(rpcSessions, null, 2));
    }
  }
  
  // 5. Check class enrollments
  console.log('\n5. Checking class enrollments...');
  const { data: enrollments, error: enrollError } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .eq('class_id', assignment.class_id)
    .eq('status', 'active');
  
  if (enrollError) {
    console.error('Enrollment error:', enrollError);
  } else {
    console.log('Enrolled students:', enrollments?.length || 0);
    if (enrollments) {
      console.log('Student IDs:', enrollments.map(e => e.student_id));
    }
  }
  
  console.log('\n=== END DEBUG ===');
}

debugAssessmentAnalytics().catch(console.error);

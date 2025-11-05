const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const assignmentId = '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4';
  
  // Check what getAssignmentOverview would query
  const { data: assignment } = await supabase
    .from('assignments')
    .select('class_id, game_type, game_config')
    .eq('id', assignmentId)
    .single();
    
  console.log('Assignment game_type:', assignment.game_type);
  console.log('Has assessmentConfig:', !!assignment.game_config?.assessmentConfig);
  
  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .eq('class_id', assignment.class_id);
    
  console.log('Total enrolled:', enrollments.length);
  
  // Query sessions like getAssignmentOverview does
  let { data: sessions } = await supabase
    .from('enhanced_game_sessions')
    .select('id, student_id, duration_seconds, started_at, ended_at, completion_status, accuracy_percentage')
    .eq('assignment_id', assignmentId)
    .gte('started_at', '2000-01-01T00:00:00Z');
    
  console.log('\nSessions from enhanced_game_sessions:', sessions?.length || 0);
  
  const isAssessmentType = assignment.game_type === 'assessment' || assignment.game_config?.assessmentConfig;
  
  if (isAssessmentType && (!sessions || sessions.length === 0)) {
    console.log('Checking fallback to reading_comprehension_results...');
    const { data: assessmentResults } = await supabase
      .from('reading_comprehension_results')
      .select('*')
      .eq('assignment_id', assignmentId);
    console.log('Results found:', assessmentResults?.length || 0);
    
    if (assessmentResults && assessmentResults.length > 0) {
      sessions = assessmentResults.map((result) => ({
        id: result.id,
        student_id: result.student_id,
        duration_seconds: result.time_spent || 0,
        started_at: result.submitted_at,
        ended_at: result.submitted_at,
        completion_status: 'completed',
        accuracy_percentage: result.score || 0
      }));
    }
  }
  
  console.log('\nFinal sessions count:', sessions?.length || 0);
  
  if (sessions && sessions.length > 0) {
    const completed = sessions.filter(s => s.completion_status === 'completed' || s.ended_at).length;
    console.log('Completed sessions:', completed);
    
    const uniqueStudents = new Set(sessions.map(s => s.student_id));
    console.log('Unique students with sessions:', uniqueStudents.size);
  }
}

check().catch(console.error);

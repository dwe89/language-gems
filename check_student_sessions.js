const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const assignmentId = '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4';
  
  const { data: sessions } = await supabase
    .from('enhanced_game_sessions')
    .select('student_id')
    .eq('assignment_id', assignmentId);
    
  console.log('Session student IDs:');
  const uniqueStudents = [...new Set(sessions?.map(s => s.student_id) || [])];
  uniqueStudents.forEach(id => console.log(`  ${id}`));
  
  console.log('\nEnrolled student IDs:');
  const { data: assignment } = await supabase
    .from('assignments')
    .select('class_id')
    .eq('id', assignmentId)
    .single();
    
  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .eq('class_id', assignment.class_id);
    
  enrollments?.forEach(e => {
    const hasSession = uniqueStudents.includes(e.student_id);
    console.log(`  ${e.student_id} ${hasSession ? '✓ HAS SESSION' : '✗ no session'}`);
  });
}

check().catch(console.error);

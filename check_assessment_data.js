const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const assignmentId = '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4';
  
  const { data: assignment } = await supabase
    .from('assignments')
    .select('class_id')
    .eq('id', assignmentId)
    .single();
  
  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .eq('class_id', assignment.class_id);
  
  console.log('Student IDs:', enrollments.map(e => e.student_id));
  
  const { data: result } = await supabase
    .from('reading_comprehension_results')
    .select('student_id, score, time_spent, submitted_at')
    .eq('assignment_id', assignmentId);
  
  console.log('\nResult student_id:', result?.[0]?.student_id);
  console.log('Result score:', result?.[0]?.score);
}

check().catch(console.error);

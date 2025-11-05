const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const assignmentId = '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4';
  
  const { data: progress } = await supabase
    .from('enhanced_assignment_progress')
    .select('*')
    .eq('assignment_id', assignmentId);
  
  console.log('Total progress rows:', progress?.length);
  console.log('\nProgress:');
  progress?.forEach(p => {
    console.log(`  Student: ${p.student_id?.substring(0, 8)}... Status: ${p.completion_status} Score: ${p.overall_success_score}`);
  });
}

check().catch(console.error);

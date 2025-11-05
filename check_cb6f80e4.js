const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const assignmentId = '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4';
  const studentId = 'cb6f80e4-4ec9-4eb8-99be-1c4dbd6d3ce0';
  
  const { data: sessions } = await supabase
    .from('enhanced_game_sessions')
    .select('*')
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId);
  
  console.log(`Sessions for student cb6f80e4 (${sessions?.length} total):`);
  sessions?.forEach(s => {
    console.log(`  - Game: ${s.game_id}, Status: ${s.completion_status}, Ended: ${s.ended_at}, Accuracy: ${s.accuracy_percentage}%`);
  });
}

check().catch(console.error);

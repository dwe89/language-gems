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
    .select('id, student_id, game_id, completion_status, accuracy_percentage, ended_at')
    .eq('assignment_id', assignmentId);
  
  console.log('Total sessions:', sessions?.length);
  console.log('\nSessions:');
  sessions?.forEach(s => {
    console.log(`  Student: ${s.student_id.substring(0, 8)}... Game: ${s.game_id} Status: ${s.completion_status} Accuracy: ${s.accuracy_percentage}% Ended: ${s.ended_at}`);
  });
}

check().catch(console.error);

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing service role access...');
console.log('URL:', supabaseUrl);
console.log('Service key present:', !!serviceRoleKey);

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testAccess() {
  const assignmentId = '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4';
  
  const { data, error } = await supabase
    .from('enhanced_game_sessions')
    .select('id, student_id, completion_status, ended_at')
    .eq('assignment_id', assignmentId);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('\nSessions found:', data.length);
  console.log('Sessions:', JSON.stringify(data, null, 2));
}

testAccess().catch(console.error);

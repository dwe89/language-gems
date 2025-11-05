require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔑 Service role key present:', !!serviceRoleKey);
console.log('🔑 Service role key length:', serviceRoleKey?.length);
console.log('🔑 Service role key starts with:', serviceRoleKey?.substring(0, 20));

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testQuery() {
  const assignmentId = '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4';
  
  console.log('\n📊 Testing exact query from analytics service...\n');
  
  const { data: sessions, error: sessionError } = await supabase
    .from('enhanced_game_sessions')
    .select('id, student_id, duration_seconds, started_at, ended_at, completion_status')
    .eq('assignment_id', assignmentId)
    .gte('started_at', '2000-01-01T00:00:00Z');
  
  console.log('Error:', sessionError);
  console.log('Sessions found:', sessions?.length);
  console.log('Sessions:', JSON.stringify(sessions?.slice(0, 3), null, 2));
}

testQuery().catch(console.error);

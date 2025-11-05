require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  // Check enhanced_game_sessions table
  const { data: sessions, error: sessionsError } = await supabase
    .from('enhanced_game_sessions')
    .select('*')
    .eq('assignment_id', '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4')
    .limit(5);
  
  console.log('=== ENHANCED_GAME_SESSIONS ===');
  if (sessionsError) {
    console.log('Table Error:', sessionsError.code, sessionsError.message);
  } else {
    console.log(`Found ${sessions?.length || 0} session(s)`);
    if (sessions && sessions.length > 0) {
      console.log(JSON.stringify(sessions, null, 2));
    }
  }
}

checkTables().catch(console.error);

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkReadingSessions() {
  const userId = 'cb6f80e4-4ec9-4eb8-99be-1c4dbd6d3ce0'; // From the log
  const assignmentId = '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4';
  
  console.log(`Checking sessions for user ${userId}...\n`);
  
  // Check enhanced_game_sessions for reading-comprehension
  const { data: sessions, error: sessionsError } = await supabase
    .from('enhanced_game_sessions')
    .select('*')
    .eq('student_id', userId)
    .eq('assignment_id', assignmentId)
    .eq('game_type', 'reading-comprehension');
  
  console.log('=== READING COMPREHENSION SESSIONS ===');
  if (sessionsError) {
    console.log('Error:', sessionsError);
  } else if (!sessions || sessions.length === 0) {
    console.log('No reading comprehension sessions found for this user/assignment');
  } else {
    console.log(`Found ${sessions.length} session(s):`);
    console.log(JSON.stringify(sessions, null, 2));
  }
  
  // Check progress
  console.log('\n=== ASSIGNMENT PROGRESS ===');
  const { data: progress, error: progressError } = await supabase
    .from('enhanced_assignment_progress')
    .select('*')
    .eq('student_id', userId)
    .eq('assignment_id', assignmentId)
    .single();
  
  if (progressError) {
    console.log('Error:', progressError);
  } else {
    console.log('Status:', progress.status);
    console.log('Best Score:', progress.best_score);
    console.log('Best Accuracy:', progress.best_accuracy);
    console.log('Progress Data:', JSON.stringify(progress.progress_data, null, 2));
    console.log('Updated At:', progress.updated_at);
  }
}

checkReadingSessions().catch(console.error);

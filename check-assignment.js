require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAssignment() {
  console.log('Checking assignment 3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4...\n');
  
  // Get assignment
  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4')
    .single();
  
  if (assignmentError) {
    console.log('Assignment Error:', assignmentError);
    return;
  }
  
  console.log('=== ASSIGNMENT ===');
  console.log('ID:', assignment.id);
  console.log('Title:', assignment.title);
  console.log('Type:', assignment.game_type);
  console.log('Status:', assignment.status);
  console.log('Config:', JSON.stringify(assignment.game_config, null, 2));
  console.log('\n');
  
  // Get progress
  const { data: progress, error: progressError } = await supabase
    .from('enhanced_assignment_progress')
    .select('*')
    .eq('assignment_id', '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4');
  
  console.log('=== PROGRESS ===');
  if (progressError) {
    console.log('Progress Error:', progressError);
  } else if (!progress || progress.length === 0) {
    console.log('No progress records found');
  } else {
    progress.forEach(p => {
      console.log('Student ID:', p.student_id);
      console.log('Status:', p.status);
      console.log('Best Score:', p.best_score);
      console.log('Progress Data:', JSON.stringify(p.progress_data, null, 2));
      console.log('---');
    });
  }
  
  // Get game sessions
  const { data: sessions, error: sessionsError } = await supabase
    .from('game_sessions')
    .select('*')
    .eq('assignment_id', '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4')
    .order('created_at', { ascending: false });
  
  console.log('\n=== GAME SESSIONS ===');
  if (sessionsError) {
    console.log('Sessions Error:', sessionsError);
  } else if (!sessions || sessions.length === 0) {
    console.log('No game sessions found');
  } else {
    console.log(`Found ${sessions.length} session(s):`);
    sessions.forEach((s, i) => {
      console.log(`\nSession ${i + 1}:`);
      console.log('ID:', s.id);
      console.log('Student ID:', s.student_id);
      console.log('Game Type:', s.game_type);
      console.log('Session Mode:', s.session_mode);
      console.log('Status:', s.status);
      console.log('Final Score:', s.final_score);
      console.log('Accuracy:', s.accuracy_percentage);
      console.log('Created:', s.created_at);
      console.log('Ended:', s.ended_at);
    });
  }
}

checkAssignment().catch(console.error);

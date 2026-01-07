const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/home/Documents/Projects/language-gems-recovered/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSessionDates() {
  console.log('\n🔍 Checking session date distribution...\n');

  const CLASS_ID = '4e83f9c1-bb86-4ae6-b404-72c0014ff59d';

  // Get the class enrollments first
  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .eq('class_id', CLASS_ID)
    .eq('status', 'active');

  const studentIds = enrollments.map(e => e.student_id);

  // Get ALL sessions without any date filter
  const { data: allSessions } = await supabase
    .from('enhanced_game_sessions')
    .select('created_at, student_id')
    .in('student_id', studentIds)
    .order('created_at', { ascending: false })
    .limit(500);

  if (!allSessions || allSessions.length === 0) {
    console.log('No sessions found');
    return;
  }

  console.log(`Total sessions: ${allSessions.length}`);
  console.log(`\nDate range:`);
  console.log(`  Earliest: ${allSessions[allSessions.length - 1].created_at}`);
  console.log(`  Latest: ${allSessions[0].created_at}`);

  // Group by month
  const byMonth = {};
  allSessions.forEach(s => {
    const date = new Date(s.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    byMonth[key] = (byMonth[key] || 0) + 1;
  });

  console.log('\nSessions by month:');
  Object.entries(byMonth).sort().forEach(([month, count]) => {
    console.log(`  ${month}: ${count} sessions`);
  });

  // Check specifically last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  console.log(`\nThirty days ago (from now): ${thirtyDaysAgo.toISOString()}`);
  
  const recentSessions = allSessions.filter(s => new Date(s.created_at) >= thirtyDaysAgo);
  console.log(`Sessions in last 30 days: ${recentSessions.length}`);

  // What about all_time?
  const allTimeStart = new Date(0);
  console.log(`\nAll time (from 1970): ${allTimeStart.toISOString()}`);
  const allTimeSessions = allSessions.filter(s => new Date(s.created_at) >= allTimeStart);
  console.log(`Sessions all time: ${allTimeSessions.length}`);

  // Check the current term (84 days back)
  const currentTermStart = new Date(Date.now() - 84 * 24 * 60 * 60 * 1000);
  console.log(`\nCurrent term (84 days back): ${currentTermStart.toISOString()}`);
  const termSessions = allSessions.filter(s => new Date(s.created_at) >= currentTermStart);
  console.log(`Sessions in current term: ${termSessions.length}`);
}

checkSessionDates().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});

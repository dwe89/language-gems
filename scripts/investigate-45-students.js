const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/home/Documents/Projects/language-gems-recovered/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TEACHER_ID = '9efcdbe9-7116-4bb7-a696-4afb0fb34e4c';

async function investigateNeverLoggedIn() {
  console.log('\n🔍 INVESTIGATING "NEVER LOGGED IN" CALCULATION\n');

  // Get teacher's classes
  const { data: allClasses } = await supabase
    .from('classes')
    .select('id, name')
    .eq('teacher_id', TEACHER_ID);

  console.log(`\n${'═'.repeat(70)}`);
  console.log('SCENARIO: What if using LAST_30_DAYS instead of ALL_TIME?');
  console.log('═'.repeat(70) + '\n');

  const classIds = allClasses.map(c => c.id);
  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .in('class_id', classIds)
    .eq('status', 'active');

  const studentIds = [...new Set(enrollments.map(e => e.student_id))];

  // Using LAST_30_DAYS filter (like the API does by default)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const { data: sessions_30days } = await supabase
    .from('enhanced_game_sessions')
    .select('student_id, game_type, accuracy_percentage, words_attempted')
    .in('student_id', studentIds)
    .gte('created_at', thirtyDaysAgo.toISOString());

  // Filter out abandoned sessions and memory-game
  const activeSessions = sessions_30days.filter(s =>
    (s.accuracy_percentage > 0 || s.words_attempted > 0) &&
    s.game_type !== 'memory-game'
  );

  const withActiveSession = new Set(activeSessions.map(s => s.student_id));
  const withoutSession = studentIds.filter(id => !withActiveSession.has(id));

  console.log(`Date filter applied: >= ${thirtyDaysAgo.toISOString()}`);
  console.log(`Total students: ${studentIds.length}`);
  console.log(`Sessions found in last 30 days: ${sessions_30days.length}`);
  console.log(`Active sessions (after filtering): ${activeSessions.length}`);
  console.log(`Students WITH active sessions: ${withActiveSession.size}`);
  console.log(`Students WITHOUT any sessions: ${withoutSession.length}\n`);

  if (withoutSession.length === 45) {
    console.log('✅ FOUND IT! With last_30_days filter, we get 45 students without sessions!');
  } else if (withoutSession.length > 40 && withoutSession.length < 50) {
    console.log(`⚠️  Close match: ${withoutSession.length} students (looking for 45)`);
  }

  // Now check with vocab tracking included
  console.log(`\n${'═'.repeat(70)}`);
  console.log('CHECKING: Assignment & Vocab Activity (alternative tracking)');
  console.log('═'.repeat(70) + '\n');

  const { data: vocabProgress } = await supabase
    .from('assignment_vocabulary_progress')
    .select('student_id')
    .in('student_id', studentIds)
    .gte('created_at', thirtyDaysAgo.toISOString());

  const { data: assignmentProgress } = await supabase
    .from('enhanced_assignment_progress')
    .select('student_id')
    .in('student_id', studentIds)
    .gte('created_at', thirtyDaysAgo.toISOString());

  const withVocabActivity = new Set(vocabProgress.map(v => v.student_id));
  const withAssignmentActivity = new Set(assignmentProgress.map(a => a.student_id));

  console.log(`Students with vocab progress (last 30 days): ${withVocabActivity.size}`);
  console.log(`Students with assignment progress (last 30 days): ${withAssignmentActivity.size}`);

  // Check if the students marked as "never logged in" have ANY activity
  const anyActivity = new Set([
    ...withActiveSession,
    ...withVocabActivity,
    ...withAssignmentActivity
  ]);

  const reallyNeverLoggedIn = studentIds.filter(id => !anyActivity.has(id));

  console.log(`\nStudents with ANY activity: ${anyActivity.size}`);
  console.log(`Students with NO activity anywhere: ${reallyNeverLoggedIn.length}\n`);

  if (reallyNeverLoggedIn.length < withoutSession.length) {
    console.log(`📊 KEY FINDING: ${withoutSession.length - reallyNeverLoggedIn.length} students show "never logged in" BUT actually have:`);
    console.log(`   - Assignment or vocab activity`);
    console.log(`   This is a FALSE POSITIVE!\n`);
  }

  // List them to confirm
  console.log(`${'═'.repeat(70)}`);
  console.log(`FALSE POSITIVES: Students showing as "never logged in" (game sessions)`);
  console.log(`but actually have other activity`);
  console.log('═'.repeat(70) + '\n');

  const falsePositives = withoutSession.filter(id => anyActivity.has(id));
  
  if (falsePositives.length > 0 && falsePositives.length <= 50) {
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('user_id, display_name')
      .in('user_id', falsePositives);

    console.log(`Count: ${falsePositives.length}\n`);
    profiles.slice(0, 20).forEach(p => {
      const hasVocab = withVocabActivity.has(p.user_id);
      const hasAssign = withAssignmentActivity.has(p.user_id);
      const type = [hasVocab && '📚 vocab', hasAssign && '✅ assignment'].filter(Boolean).join(' + ');
      console.log(`  ${p.display_name} [${type}]`);
    });
    if (falsePositives.length > 20) {
      console.log(`  ... and ${falsePositives.length - 20} more`);
    }
  }
}

investigateNeverLoggedIn().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});

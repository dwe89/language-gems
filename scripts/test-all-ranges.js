const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/home/Documents/Projects/language-gems-recovered/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TEACHER_ID = '9efcdbe9-7116-4bb7-a696-4afb0fb34e4c';
const CLASS_ID = '4e83f9c1-bb86-4ae6-b404-72c0014ff59d';

// Test all combinations to find which produces 45
const timeRanges = ['last_7_days', 'last_30_days', 'current_term', 'all_time'];

function getDateFilter(timeRange) {
  const now = new Date();
  switch (timeRange) {
    case 'last_7_days':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'last_30_days':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'current_term':
      return new Date(now.getTime() - 84 * 24 * 60 * 60 * 1000);
    case 'all_time':
      return new Date(0);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

async function testAllCombinations() {
  console.log('\n🔍 TESTING ALL TIME RANGE + VIEW COMBINATIONS\n');

  // Get teacher's classes
  const { data: allClasses } = await supabase
    .from('classes')
    .select('id, name')
    .eq('teacher_id', TEACHER_ID);

  const classIds = allClasses.map(c => c.id);

  // Get enrollments for all classes
  const { data: enrollmentsAll } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .in('class_id', classIds)
    .eq('status', 'active');

  const studentIdsAll = [...new Set(enrollmentsAll.map(e => e.student_id))];

  // Get enrollments for single class
  const { data: enrollmentsSingle } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .eq('class_id', CLASS_ID)
    .eq('status', 'active');

  const studentIdsSingle = enrollmentsSingle.map(e => e.student_id);

  console.log(`Testing combinations for 45 students...\n`);
  console.log(`Total students across all classes: ${studentIdsAll.length}`);
  console.log(`Total students in single class (${CLASS_ID}): ${studentIdsSingle.length}\n`);

  // Test each time range
  for (const timeRange of timeRanges) {
    const dateFilter = getDateFilter(timeRange);

    // ALL CLASSES VIEW
    const { data: sessionsAll } = await supabase
      .from('enhanced_game_sessions')
      .select('student_id, game_type, accuracy_percentage, words_attempted')
      .in('student_id', studentIdsAll)
      .gte('created_at', dateFilter.toISOString());

    const activeSessionsAll = sessionsAll.filter(s =>
      (s.accuracy_percentage > 0 || s.words_attempted > 0) &&
      s.game_type !== 'memory-game'
    );

    const withSessionsAll = new Set(activeSessionsAll.map(s => s.student_id));
    const withoutSessionsAll = studentIdsAll.filter(id => !withSessionsAll.has(id));

    // SINGLE CLASS VIEW
    const { data: sessionsSingle } = await supabase
      .from('enhanced_game_sessions')
      .select('student_id, game_type, accuracy_percentage, words_attempted')
      .in('student_id', studentIdsSingle)
      .gte('created_at', dateFilter.toISOString());

    const activeSessionsSingle = sessionsSingle.filter(s =>
      (s.accuracy_percentage > 0 || s.words_attempted > 0) &&
      s.game_type !== 'memory-game'
    );

    const withSessionsSingle = new Set(activeSessionsSingle.map(s => s.student_id));
    const withoutSessionsSingle = studentIdsSingle.filter(id => !withSessionsSingle.has(id));

    console.log(`⏰ TIME RANGE: ${timeRange.toUpperCase()}`);
    console.log(`   Date Filter: >= ${dateFilter.toISOString().split('T')[0]}`);
    console.log(`   All Classes  : ${withoutSessionsAll.length} students without sessions ${withoutSessionsAll.length === 45 ? '✅ BINGO!' : ''}`);
    console.log(`   Single Class : ${withoutSessionsSingle.length} students without sessions`);
    console.log('');
  }

  // Also test with vocab progress included
  console.log(`\n${'═'.repeat(70)}`);
  console.log('INCLUDING VOCAB PROGRESS IN CALCULATION');
  console.log('═'.repeat(70) + '\n');

  for (const timeRange of timeRanges) {
    const dateFilter = getDateFilter(timeRange);

    // Get game sessions
    const { data: sessionsAll } = await supabase
      .from('enhanced_game_sessions')
      .select('student_id')
      .in('student_id', studentIdsAll)
      .gte('created_at', dateFilter.toISOString());

    const activeSessionsAll = sessionsAll.filter(s =>
      (s.accuracy_percentage > 0 || s.words_attempted > 0) &&
      s.game_type !== 'memory-game'
    );

    // Get vocab progress  
    const { data: vocabProgress } = await supabase
      .from('assignment_vocabulary_progress')
      .select('student_id')
      .in('student_id', studentIdsAll)
      .gte('created_at', dateFilter.toISOString());

    // Get assignment progress
    const { data: assignmentProgress } = await supabase
      .from('enhanced_assignment_progress')
      .select('student_id')
      .in('student_id', studentIdsAll)
      .gte('created_at', dateFilter.toISOString());

    const anyActivity = new Set([
      ...activeSessionsAll.map(s => s.student_id),
      ...vocabProgress.map(v => v.student_id),
      ...assignmentProgress.map(a => a.student_id)
    ]);

    const withoutAnyActivity = studentIdsAll.filter(id => !anyActivity.has(id));

    console.log(`⏰ TIME RANGE: ${timeRange.toUpperCase()}`);
    console.log(`   All Classes: ${withoutAnyActivity.length} students with NO activity ${withoutAnyActivity.length === 45 ? '✅ BINGO!' : ''}`);
  }
}

testAllCombinations().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});

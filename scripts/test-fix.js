const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/home/Documents/Projects/language-gems-recovered/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TEACHER_ID = '9efcdbe9-7116-4bb7-a696-4afb0fb34e4c';
const CLASS_ID = '4e83f9c1-bb86-4ae6-b404-72c0014ff59d';

async function testFixedLogic() {
  console.log('\n✅ TESTING THE FIX FOR "NEVER LOGGED IN" CALCULATION\n');
  console.log('This simulates the FIXED code logic...\n');

  // Get enrollments
  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .eq('class_id', CLASS_ID)
    .eq('status', 'active');

  const studentIds = enrollments.map(e => e.student_id);

  // Get profiles
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('user_id, display_name')
    .in('user_id', studentIds);

  const profileMap = new Map(profiles.map(p => [p.user_id, p]));

  // Simulate the fixed queries
  const dateFilter = new Date(0); // All time

  // Get game sessions
  const { data: gameSessions } = await supabase
    .from('enhanced_game_sessions')
    .select('student_id, created_at, accuracy_percentage, words_attempted, game_type')
    .in('student_id', studentIds)
    .gte('created_at', dateFilter.toISOString());

  const activeSessions = gameSessions.filter(s =>
    (s.accuracy_percentage > 0 || s.words_attempted > 0) &&
    s.game_type !== 'memory-game'
  );

  // Get vocab progress - FIXED
  const { data: vocabProgress } = await supabase
    .from('assignment_vocabulary_progress')
    .select('student_id, seen_count, correct_count, last_seen_at, created_at')
    .in('student_id', studentIds)
    .gte('created_at', dateFilter.toISOString());

  // Get assignment progress - NOW INCLUDED (FIX)
  const { data: assignmentProgress } = await supabase
    .from('enhanced_assignment_progress')
    .select('student_id, status, completed_at, created_at')
    .in('student_id', studentIds)
    .gte('created_at', dateFilter.toISOString());

  // Build maps
  const vocabByStudent = new Map();
  vocabProgress.forEach(v => {
    if (!vocabByStudent.has(v.student_id)) vocabByStudent.set(v.student_id, []);
    vocabByStudent.get(v.student_id).push(v);
  });

  const assignByStudent = new Map();
  assignmentProgress.forEach(a => {
    if (!assignByStudent.has(a.student_id)) assignByStudent.set(a.student_id, []);
    assignByStudent.get(a.student_id).push(a);
  });

  const sessionsByStudent = new Map();
  activeSessions.forEach(s => {
    if (!sessionsByStudent.has(s.student_id)) sessionsByStudent.set(s.student_id, []);
    sessionsByStudent.get(s.student_id).push(s);
  });

  // Now calculate "never logged in" with the FIXED logic
  console.log(`Testing ${studentIds.length} students...\n`);

  const testStudents = [
    { id: 'a6231ded-2ab2-4e2f-80e4-87afa725b725', name: 'Huey Anderson' },
    { id: '5fb39b66-1b20-4ad1-a706-0b4379239deb', name: 'Bobby Cripps' },
    { id: '86e4b102-4890-4ca1-a69f-48b838b3632f', name: 'Louix Elsden-Webb' },
    { id: '010a4676-b6d6-4ebe-b291-d184f9396fd0', name: 'Jensen Greenfield' }
  ];

  for (const testStudent of testStudents) {
    const vocabData = vocabByStudent.get(testStudent.id) || [];
    const assignData = assignByStudent.get(testStudent.id) || [];
    const sessionData = sessionsByStudent.get(testStudent.id) || [];

    // Calculate with OLD logic (game sessions only)
    const hasGameSessionOLD = sessionData.length > 0;

    // Calculate with NEW logic (ALL activity sources) - THE FIX
    const totalVocabExposures = vocabData.reduce((sum, v) => sum + (v.seen_count || 0), 0);
    const hasActivityNEW = sessionData.length > 0 || totalVocabExposures > 0 || assignData.length > 0;

    // Calculate lastActive with ALL sources
    let lastActiveDate = null;
    if (sessionData.length > 0) {
      lastActiveDate = new Date(sessionData[0].created_at);
    }
    if (vocabData.length > 0) {
      const vocabDate = new Date(Math.max(...vocabData.map(v => new Date(v.last_seen_at || v.created_at).getTime())));
      if (!lastActiveDate || vocabDate > lastActiveDate) lastActiveDate = vocabDate;
    }
    if (assignData.length > 0) {
      const assignDate = new Date(Math.max(...assignData.map(a => new Date(a.completed_at || a.created_at).getTime())));
      if (!lastActiveDate || assignDate > lastActiveDate) lastActiveDate = assignDate;
    }

    console.log(`📍 ${testStudent.name}`);
    console.log(`   Game Sessions: ${sessionData.length} ❌` + (sessionData.length === 0 ? '' : ' ✅'));
    console.log(`   Vocab Progress: ${totalVocabExposures} exposures`);
    console.log(`   Assignment Progress: ${assignData.length} entries ${assignData.length > 0 ? '✅' : ''}`);
    console.log(`   Last Active (ALL sources): ${lastActiveDate ? lastActiveDate.toISOString().split('T')[0] : 'NEVER'}`);
    console.log(`   OLD LOGIC: "Never logged in" = ${!hasGameSessionOLD ? '❌ YES (FALSE POSITIVE!)' : '✅ NO (correct)'}`);
    console.log(`   NEW LOGIC: "Never logged in" = ${!hasActivityNEW ? '❌ YES' : '✅ NO (FIXED!)'}`);
    console.log('');
  }

  // Calculate summary
  console.log(`${'═'.repeat(70)}`);
  console.log('SUMMARY');
  console.log('═'.repeat(70) + '\n');

  let oldCount = 0;
  let newCount = 0;

  for (const studentId of studentIds) {
    const vocabData = vocabByStudent.get(studentId) || [];
    const assignData = assignByStudent.get(studentId) || [];
    const sessionData = sessionsByStudent.get(studentId) || [];

    const hasGameSessionOLD = sessionData.length > 0;
    const totalVocabExposures = vocabData.reduce((sum, v) => sum + (v.seen_count || 0), 0);
    const hasActivityNEW = sessionData.length > 0 || totalVocabExposures > 0 || assignData.length > 0;

    if (!hasGameSessionOLD) oldCount++;
    if (!hasActivityNEW) newCount++;
  }

  console.log(`OLD LOGIC (game sessions only):`);
  console.log(`  Never logged in: ${oldCount} students`);
  console.log(`  \nNEW LOGIC (all activity included):`);
  console.log(`  Never logged in: ${newCount} students`);
  console.log(`\n🎯 FALSE POSITIVES ELIMINATED: ${oldCount - newCount} students`);
}

testFixedLogic().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});

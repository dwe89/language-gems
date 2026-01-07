const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/home/Documents/Projects/language-gems-recovered/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TEACHER_ID = '9efcdbe9-7116-4bb7-a696-4afb0fb34e4c';
const CLASS_ID = '4e83f9c1-bb86-4ae6-b404-72c0014ff59d';

async function compareQueries() {
  console.log('\n🔍 COMPARING "ALL CLASSES" vs "INDIVIDUAL CLASS" QUERIES\n');

  // Get the teacher's classes
  const { data: allClasses } = await supabase
    .from('classes')
    .select('id, name')
    .eq('teacher_id', TEACHER_ID);

  console.log(`Teacher has ${allClasses.length} classes:\n`);
  allClasses.forEach(c => console.log(`  - ${c.name} (${c.id})`));

  // ==============================
  // QUERY 1: All Classes (no classId filter)
  // ==============================
  console.log(`\n${'═'.repeat(70)}`);
  console.log('QUERY 1: ALL CLASSES (No classId filter)');
  console.log('═'.repeat(70) + '\n');

  const classIds_all = allClasses.map(c => c.id);
  const { data: enrollments_all } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .in('class_id', classIds_all)
    .eq('status', 'active');

  const studentIds_all = [...new Set(enrollments_all.map(e => e.student_id))];

  const { data: sessions_all } = await supabase
    .from('enhanced_game_sessions')
    .select('student_id')
    .in('student_id', studentIds_all);

  const withSessions_all = new Set(sessions_all.map(s => s.student_id));
  const withoutSessions_all = studentIds_all.filter(id => !withSessions_all.has(id));

  console.log(`Total classes: ${classIds_all.length}`);
  console.log(`Total students across all classes: ${studentIds_all.length}`);
  console.log(`Students WITH sessions: ${withSessions_all.size}`);
  console.log(`Students WITHOUT sessions: ${withoutSessions_all.length}`);
  
  // ==============================
  // QUERY 2: Individual Class (with classId filter)
  // ==============================
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`QUERY 2: INDIVIDUAL CLASS (classId = ${CLASS_ID})`);
  console.log('═'.repeat(70) + '\n');

  const { data: enrollments_single } = await supabase
    .from('class_enrollments')
    .select('student_id')
    .eq('class_id', CLASS_ID)
    .eq('status', 'active');

  const studentIds_single = enrollments_single.map(e => e.student_id);

  const { data: sessions_single } = await supabase
    .from('enhanced_game_sessions')
    .select('student_id')
    .in('student_id', studentIds_single);

  const withSessions_single = new Set(sessions_single.map(s => s.student_id));
  const withoutSessions_single = studentIds_single.filter(id => !withSessions_single.has(id));

  console.log(`Students in this class: ${studentIds_single.length}`);
  console.log(`Students WITH sessions: ${withSessions_single.size}`);
  console.log(`Students WITHOUT sessions: ${withoutSessions_single.length}`);

  // ==============================
  // ANALYSIS
  // ==============================
  console.log(`\n${'═'.repeat(70)}`);
  console.log('ANALYSIS');
  console.log('═'.repeat(70) + '\n');

  console.log(`Difference in students without sessions:`);
  console.log(`  All Classes: ${withoutSessions_all.length}`);
  console.log(`  This Class: ${withoutSessions_single.length}`);
  console.log(`  Ratio: ${(withoutSessions_all.length / studentIds_all.length * 100).toFixed(1)}% vs ${(withoutSessions_single.length / studentIds_single.length * 100).toFixed(1)}%\n`);

  if (withoutSessions_all.length === 45) {
    console.log('✅ FOUND THE 45 STUDENTS! They are the ones without sessions in "All Classes"');
  }

  // Check if students without sessions in ALL CLASSES also have no sessions in THIS CLASS
  const studentsInBothQueries = new Set(studentIds_single.filter(id => Array.from(withoutSessions_all).includes(id)));
  const studentsOnlyInAllClasses = Array.from(withoutSessions_all).filter(id => !studentIds_single.includes(id));

  console.log(`\nOverlap analysis:`);
  console.log(`  Students in both queries without sessions: ${studentsInBothQueries.size}`);
  console.log(`  Students in "All Classes" without sessions but NOT in this class: ${studentsOnlyInAllClasses.length}`);

  // ==============================
  // List the students without sessions
  // ==============================
  if (withoutSessions_all.length <= 50) {
    console.log(`\n${'═'.repeat(70)}`);
    console.log(`STUDENTS WITHOUT SESSIONS IN "ALL CLASSES" (${withoutSessions_all.length})`);
    console.log('═'.repeat(70) + '\n');

    // Get their names
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('user_id, display_name')
      .in('user_id', withoutSessions_all.slice(0, 45));

    if (profiles) {
      profiles.forEach(p => console.log(`  ${p.display_name}`));
    }
  }
}

compareQueries().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});

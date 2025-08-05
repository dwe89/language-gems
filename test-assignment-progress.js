// Test script to verify assignment progress functionality
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xetsvpfunazwkontdpdha.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldHN2cGZ1bmF6d2tvbnRkcGRoYSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzI3MjY5OTU5LCJleHAiOjIwNDI4NDU5NTl9.3R8GZyh5TQGEFkBdyO8O0lIJjWWyY8Bf4t-oWoUPeBI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAssignmentProgress() {
  console.log('🧪 Testing Assignment Progress System...\n');

  try {
    // Test 1: Check assignments table
    console.log('1. Testing assignments table...');
    const { data: assignments, error: assignmentsError } = await supabase
      .from('assignments')
      .select('id, title, description, type, time_limit, due_date, points, game_type, max_attempts')
      .limit(3);

    if (assignmentsError) {
      console.error('❌ Assignments query failed:', assignmentsError.message);
      return;
    }

    console.log(`✅ Found ${assignments.length} assignments`);
    assignments.forEach(a => {
      console.log(`   - ${a.title} (${a.type})`);
    });

    // Test 2: Check enhanced_assignment_progress table
    console.log('\n2. Testing enhanced_assignment_progress table...');
    const { data: progress, error: progressError } = await supabase
      .from('enhanced_assignment_progress')
      .select('assignment_id, student_id, status, best_score, best_accuracy, total_time_spent, completed_at')
      .limit(3);

    if (progressError) {
      console.error('❌ Progress query failed:', progressError.message);
      return;
    }

    console.log(`✅ Found ${progress.length} progress records`);
    progress.forEach(p => {
      console.log(`   - Student ${p.student_id.slice(0, 8)}... Assignment ${p.assignment_id.slice(0, 8)}... Status: ${p.status}`);
    });

    // Test 3: Check class enrollments
    console.log('\n3. Testing class enrollments...');
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('class_enrollments')
      .select('student_id, class_id')
      .limit(3);

    if (enrollmentsError) {
      console.error('❌ Enrollments query failed:', enrollmentsError.message);
      return;
    }

    console.log(`✅ Found ${enrollments.length} class enrollments`);

    // Test 4: Simulate student progress query (like AssignmentProgressTracker does)
    if (enrollments.length > 0) {
      const testStudentId = enrollments[0].student_id;
      const classIds = enrollments
        .filter(e => e.student_id === testStudentId)
        .map(e => e.class_id);

      console.log(`\n4. Testing full student progress query for student ${testStudentId.slice(0, 8)}...`);
      
      // Get assignments for student's classes
      const { data: studentAssignments, error: studentAssignmentsError } = await supabase
        .from('assignments')
        .select('id, title, type, time_limit, due_date, points, game_type, max_attempts')
        .in('class_id', classIds);

      if (studentAssignmentsError) {
        console.error('❌ Student assignments query failed:', studentAssignmentsError.message);
        return;
      }

      console.log(`✅ Found ${studentAssignments.length} assignments for student`);

      // Get progress for this student
      const assignmentIds = studentAssignments.map(a => a.id);
      const { data: studentProgress, error: studentProgressError } = await supabase
        .from('enhanced_assignment_progress')
        .select('assignment_id, status, best_score, best_accuracy, total_time_spent, completed_at, updated_at')
        .eq('student_id', testStudentId)
        .in('assignment_id', assignmentIds);

      if (studentProgressError) {
        console.error('❌ Student progress query failed:', studentProgressError.message);
        return;
      }

      console.log(`✅ Found ${studentProgress.length} progress records for student`);

      // Test the data transformation logic
      const progressMap = new Map();
      studentProgress.forEach(p => {
        progressMap.set(p.assignment_id, p);
      });

      const completedProgress = studentAssignments.map(assignment => {
        const progress = progressMap.get(assignment.id);
        return {
          id: progress ? `progress-${assignment.id}` : `not-started-${assignment.id}`,
          assignment_id: assignment.id,
          student_id: testStudentId,
          status: progress?.status || 'not_started',
          score: progress?.best_score || 0,
          accuracy: progress?.best_accuracy || 0,
          time_spent: progress?.total_time_spent || 0,
          completed_at: progress?.completed_at,
          assignment: assignment
        };
      });

      console.log(`\n📊 Final progress data summary:`);
      console.log(`   Total assignments: ${completedProgress.length}`);
      console.log(`   Completed: ${completedProgress.filter(p => p.status === 'completed').length}`);
      console.log(`   In progress: ${completedProgress.filter(p => p.status === 'in_progress').length}`);
      console.log(`   Not started: ${completedProgress.filter(p => p.status === 'not_started').length}`);

      completedProgress.forEach(p => {
        console.log(`   - ${p.assignment.title}: ${p.status} (Score: ${p.score})`);
      });
    }

    console.log('\n🎉 All assignment progress tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAssignmentProgress();

#!/usr/bin/env node

/**
 * Diagnostic Script: Check why a student shows 0% and 0 activities
 * Usage: node scripts/diagnose-student.js "Sofia Welch"
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bymkqixpvgtrsqbkhfxg.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bWtxaXhwdmd0cnNxYmtoZnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI4MTQyMDAsImV4cCI6MjAxODM5MDIwMH0.jZfpXVoU1HdOWYvXS2ZuDfm0qj-FvPYsOq-pLc_x0Jk'
);

async function diagnoseStudent() {
  const studentName = process.argv[2] || 'Sofia Welch';
  
  console.log(`\n🔍 DIAGNOSING: ${studentName}\n`);
  
  // Find student
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('user_id, display_name, created_at')
    .ilike('display_name', `%${studentName}%`)
    .limit(5);
  
  if (profileError || !profiles || profiles.length === 0) {
    console.log('❌ Student not found');
    return;
  }
  
  if (profiles.length > 1) {
    console.log(`Found ${profiles.length} matches:`);
    profiles.forEach((p, i) => console.log(`  ${i + 1}. ${p.display_name}`));
    console.log(`\nUsing first match: ${profiles[0].display_name}\n`);
  }
  
  const student = profiles[0];
  console.log(`✅ Student ID: ${student.user_id}`);
  console.log(`   Created: ${student.created_at}\n`);
  
  // Check all activity sources
  const [
    { data: gameSessions, error: gameError },
    { data: vocabProgress, error: vocabError },
    { data: assignmentProgress, error: assignmentError },
    { data: assignments, error: assignmentListError }
  ] = await Promise.all([
    supabase.from('enhanced_game_sessions').select('*').eq('student_id', student.user_id),
    supabase.from('assignment_vocabulary_progress').select('*').eq('student_id', student.user_id),
    supabase.from('enhanced_assignment_progress').select('*').eq('student_id', student.user_id),
    supabase.from('assignments').select('id, title, class_id').limit(10)
  ]);
  
  console.log(`📊 ACTIVITY SUMMARY:`);
  console.log(`  ├─ Game Sessions: ${gameSessions?.length || 0}`);
  console.log(`  ├─ Vocab Progress: ${vocabProgress?.length || 0}`);
  console.log(`  ├─ Assignment Progress: ${assignmentProgress?.length || 0}`);
  console.log(`  └─ Total Activity: ${(gameSessions?.length || 0) + (vocabProgress?.length || 0) + (assignmentProgress?.length || 0)}\n`);
  
  if (vocabProgress && vocabProgress.length > 0) {
    console.log(`📖 VOCABULARY ASSIGNMENTS (${vocabProgress.length} entries):`);
    const byAssignment = {};
    vocabProgress.forEach(v => {
      if (!byAssignment[v.assignment_id]) {
        byAssignment[v.assignment_id] = [];
      }
      byAssignment[v.assignment_id].push(v);
    });
    
    Object.entries(byAssignment).forEach(([assignId, entries], i) => {
      const totalSeen = entries.reduce((sum, e) => sum + (e.seen_count || 0), 0);
      const totalCorrect = entries.reduce((sum, e) => sum + (e.correct_count || 0), 0);
      const accuracy = totalSeen > 0 ? ((totalCorrect / totalSeen) * 100).toFixed(1) : '0';
      console.log(`  [${i + 1}] Assignment: ${assignId}`);
      console.log(`      └─ ${totalCorrect}/${totalSeen} correct (${accuracy}%)`);
    });
  } else {
    console.log(`❌ NO VOCABULARY PROGRESS FOUND`);
    console.log(`   This is why ${student.display_name} shows 0% accuracy!\n`);
  }
  
  if (assignmentProgress && assignmentProgress.length > 0) {
    console.log(`\n📋 ASSIGNMENT PROGRESS (${assignmentProgress.length} assignments):`);
    assignmentProgress.forEach((a, i) => {
      console.log(`  [${i + 1}] ${a.assignment_id}`);
      console.log(`      └─ Status: ${a.status}, Completed: ${a.completed_at || 'NOT YET'}`);
    });
  }
  
  // Check enrollment
  console.log(`\n👥 ENROLLMENT CHECK:`);
  const { data: enrollments } = await supabase
    .from('class_enrollments')
    .select('class_id, classes(title)')
    .eq('student_id', student.user_id);
  
  if (enrollments && enrollments.length > 0) {
    console.log(`  Classes enrolled: ${enrollments.length}`);
    enrollments.forEach(e => {
      console.log(`    - ${e.classes?.title || e.class_id}`);
    });
  } else {
    console.log(`  ❌ Not enrolled in any classes!`);
  }
  
  console.log(`\n🎯 DIAGNOSIS:\n`);
  
  if ((vocabProgress?.length || 0) === 0 && (gameSessions?.length || 0) === 0) {
    console.log(`  The student has NO activity recorded.`);
    console.log(`  Either:\n`);
    console.log(`  1. They haven't completed any assignments yet`);
    console.log(`  2. Assignments aren't being tracked properly`);
    console.log(`  3. Vocabulary progress isn't being saved\n`);
  } else if ((vocabProgress?.length || 0) === 0 && (gameSessions?.length || 0) > 0) {
    console.log(`  Game sessions ARE recorded, but vocabulary progress is NOT.`);
    console.log(`  This suggests: Assignments without vocabulary tracking\n`);
  }
  
  console.log(`📝 QUESTIONS:`);
  console.log(`  1. Has ${student.display_name} completed any assignments?`);
  console.log(`  2. Should vocabulary be tracked within assignments?`);
  console.log(`  3. Are assignments being marked "complete" in the system?\n`);
}

diagnoseStudent().catch(console.error);

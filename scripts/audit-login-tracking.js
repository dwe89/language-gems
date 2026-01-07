#!/usr/bin/env node

/**
 * COMPREHENSIVE LOGIN TRACKING AUDIT
 * 
 * This script audits all sources of login/activity tracking to identify:
 * 1. Inconsistencies between "all classes" vs individual class views
 * 2. Students incorrectly flagged as never logged in
 * 3. Which tables actually contain session data
 * 4. Data synchronization issues
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '/Users/home/Documents/Projects/language-gems-recovered/.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Specific students to audit
const STUDENTS_TO_AUDIT = [
  'Huey Anderson',
  'Bobby Cripps',
  'Louix Elsden-Webb',
  'Jensen Greenfield'
];

// Class ID from the URL
const CLASS_ID = '4e83f9c1-bb86-4ae6-b404-72c0014ff59d';

async function auditLoginTracking() {
  console.log('\n🔍 ========== COMPREHENSIVE LOGIN TRACKING AUDIT ==========\n');

  try {
    // ==========================================
    // 1. Get the class and its students
    // ==========================================
    console.log('📋 STEP 1: Fetching class and enrollments...\n');

    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id, name, teacher_id')
      .eq('id', CLASS_ID)
      .single();

    if (classError) throw classError;
    console.log(`✅ Class: ${classData.name} (ID: ${classData.id})`);
    console.log(`   Teacher: ${classData.teacher_id}\n`);

    // Get all enrollments
    const { data: enrollments, error: enrollError } = await supabase
      .from('class_enrollments')
      .select('student_id, status')
      .eq('class_id', CLASS_ID)
      .eq('status', 'active');

    if (enrollError) throw enrollError;
    console.log(`✅ Found ${enrollments.length} active student enrollments\n`);

    // Get student profiles
    const studentIds = enrollments.map(e => e.student_id);
    const { data: profiles, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id, display_name, email, created_at')
      .in('user_id', studentIds);

    if (profileError) throw profileError;

    const profileMap = new Map(profiles.map(p => [p.user_id, p]));

    // ==========================================
    // 2. Check ALL tracking tables for data
    // ==========================================
    console.log('📊 STEP 2: Checking all tracking tables...\n');

    // TABLE 1: enhanced_game_sessions
    console.log('--- 🎮 TABLE: enhanced_game_sessions ---');
    const { data: gameSessions, error: gError } = await supabase
      .from('enhanced_game_sessions')
      .select('student_id, game_type, created_at, final_score, accuracy_percentage, ended_at')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false });

    if (gError) throw gError;
    console.log(`Total sessions in this table for class students: ${gameSessions.length}`);

    const sessionsByStudent = new Map();
    gameSessions.forEach(session => {
      if (!sessionsByStudent.has(session.student_id)) {
        sessionsByStudent.set(session.student_id, []);
      }
      sessionsByStudent.get(session.student_id).push(session);
    });

    console.log(`Students with sessions: ${sessionsByStudent.size}`);
    console.log(`Students WITHOUT sessions: ${studentIds.length - sessionsByStudent.size}\n`);

    // TABLE 2: gem_events
    console.log('--- 💎 TABLE: gem_events ---');
    const { data: gemEvents, error: gemError } = await supabase
      .from('gem_events')
      .select('student_id, created_at, gem_type')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false });

    if (gemError) throw gemError;
    console.log(`Total gem events: ${gemEvents.length}`);

    const gemsByStudent = new Map();
    gemEvents.forEach(gem => {
      if (!gemsByStudent.has(gem.student_id)) {
        gemsByStudent.set(gem.student_id, []);
      }
      gemsByStudent.get(gem.student_id).push(gem);
    });
    console.log(`Students with gems: ${gemsByStudent.size}\n`);

    // TABLE 3: assignment_vocabulary_progress
    console.log('--- 📚 TABLE: assignment_vocabulary_progress ---');
    const { data: vocabProgress, error: vocabError } = await supabase
      .from('assignment_vocabulary_progress')
      .select('student_id, created_at, seen_count')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false });

    if (vocabError) throw vocabError;
    console.log(`Total vocab progress entries: ${vocabProgress.length}`);

    const vocabByStudent = new Map();
    vocabProgress.forEach(v => {
      if (!vocabByStudent.has(v.student_id)) {
        vocabByStudent.set(v.student_id, []);
      }
      vocabByStudent.get(v.student_id).push(v);
    });
    console.log(`Students with vocab progress: ${vocabByStudent.size}\n`);

    // TABLE 4: enhanced_assignment_progress
    console.log('--- ✅ TABLE: enhanced_assignment_progress ---');
    const { data: assignmentProgress, error: apError } = await supabase
      .from('enhanced_assignment_progress')
      .select('student_id, assignment_id, status, created_at')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false });

    if (apError) throw apError;
    console.log(`Total assignment progress entries: ${assignmentProgress.length}`);

    const assignByStudent = new Map();
    assignmentProgress.forEach(a => {
      if (!assignByStudent.has(a.student_id)) {
        assignByStudent.set(a.student_id, []);
      }
      assignByStudent.get(a.student_id).push(a);
    });
    console.log(`Students with assignment progress: ${assignByStudent.size}\n`);

    // ==========================================
    // 3. Audit specific students
    // ==========================================
    console.log('🔎 STEP 3: Detailed audit of specific students...\n');

    for (const studentId of studentIds) {
      const profile = profileMap.get(studentId);
      if (!profile) continue;

      const studentName = profile.display_name;
      
      // Only show detailed audit for the students mentioned
      if (!STUDENTS_TO_AUDIT.some(name => studentName.toLowerCase().includes(name.toLowerCase()))) {
        continue;
      }

      console.log(`\n${'═'.repeat(60)}`);
      console.log(`📍 Student: ${studentName} (${studentId})`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Account Created: ${profile.created_at}`);
      console.log(`${'═'.repeat(60)}\n`);

      // Check all sources of activity
      const hasSessions = sessionsByStudent.has(studentId) && sessionsByStudent.get(studentId).length > 0;
      const hasGems = gemsByStudent.has(studentId) && gemsByStudent.get(studentId).length > 0;
      const hasVocab = vocabByStudent.has(studentId) && vocabByStudent.get(studentId).length > 0;
      const hasAssignment = assignByStudent.has(studentId) && assignByStudent.get(studentId).length > 0;

      console.log(`Activity Status:`);
      console.log(`  • Game Sessions (enhanced_game_sessions): ${hasSessions ? '✅ YES' : '❌ NO'}`);
      if (hasSessions) {
        const sessions = sessionsByStudent.get(studentId);
        console.log(`    - Count: ${sessions.length}`);
        console.log(`    - Latest: ${sessions[0].created_at}`);
        console.log(`    - Games: ${[...new Set(sessions.map(s => s.game_type))].join(', ')}`);
      }

      console.log(`  • Gem Events (gem_events): ${hasGems ? '✅ YES' : '❌ NO'}`);
      if (hasGems) {
        const gems = gemsByStudent.get(studentId);
        console.log(`    - Count: ${gems.length}`);
        console.log(`    - Latest: ${gems[0].created_at}`);
      }

      console.log(`  • Vocab Progress (assignment_vocabulary_progress): ${hasVocab ? '✅ YES' : '❌ NO'}`);
      if (hasVocab) {
        const vocab = vocabByStudent.get(studentId);
        console.log(`    - Count: ${vocab.length}`);
        console.log(`    - Latest: ${vocab[0].created_at}`);
      }

      console.log(`  • Assignment Progress (enhanced_assignment_progress): ${hasAssignment ? '✅ YES' : '❌ NO'}`);
      if (hasAssignment) {
        const assign = assignByStudent.get(studentId);
        console.log(`    - Count: ${assign.length}`);
        console.log(`    - Latest: ${assign[0].created_at}`);
      }

      const anyActivity = hasSessions || hasGems || hasVocab || hasAssignment;
      console.log(`\n  Summary: ${anyActivity ? '✅ HAS ACTIVITY' : '❌ NO ACTIVITY ANYWHERE'}\n`);
    }

    // ==========================================
    // 4. Compare "All Classes" vs Individual Class
    // ==========================================
    console.log('\n🔀 STEP 4: Comparing "All Classes" vs Individual Class view...\n');

    // Get teacher
    const { data: teacher, error: teacherError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', classData.teacher_id)
      .single();

    if (teacherError) throw teacherError;

    // Get all classes for this teacher
    const { data: allClasses, error: allClassesError } = await supabase
      .from('classes')
      .select('id')
      .eq('teacher_id', classData.teacher_id);

    if (allClassesError) throw allClassesError;

    // Get all enrollments for all classes
    const { data: allEnrollments, error: allEnrollmentsError } = await supabase
      .from('class_enrollments')
      .select('student_id, class_id')
      .in('class_id', allClasses.map(c => c.id))
      .eq('status', 'active');

    if (allEnrollmentsError) throw allEnrollmentsError;

    const allStudentIds = [...new Set(allEnrollments.map(e => e.student_id))];

    // Get sessions for all students
    const { data: allSessions, error: allSessionsError } = await supabase
      .from('enhanced_game_sessions')
      .select('student_id')
      .in('student_id', allStudentIds);

    if (allSessionsError) throw allSessionsError;

    const studentsWithSessionsAll = new Set(allSessions.map(s => s.student_id));
    const studentsWithoutSessionsAll = allStudentIds.filter(id => !studentsWithSessionsAll.has(id));

    console.log(`All Classes View:`);
    console.log(`  • Total students across all classes: ${allStudentIds.length}`);
    console.log(`  • Students with sessions: ${studentsWithSessionsAll.size}`);
    console.log(`  • Students WITHOUT sessions: ${studentsWithoutSessionsAll.length} ❌\n`);

    console.log(`Individual Class View (${CLASS_ID}):`);
    console.log(`  • Total students in this class: ${studentIds.length}`);
    console.log(`  • Students with sessions: ${sessionsByStudent.size}`);
    console.log(`  • Students WITHOUT sessions: ${studentIds.length - sessionsByStudent.size} ❌\n`);

    // Check if the count matches
    if ((studentIds.length - sessionsByStudent.size) !== 45) {
      console.log(`⚠️  Expected 45 students without sessions, but got ${studentIds.length - sessionsByStudent.size}`);
    }

    // ==========================================
    // 5. Check for filtering issues
    // ==========================================
    console.log('🔧 STEP 5: Check for filtering issues...\n');

    // Get sessions WITH filters (like the API does)
    const dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const { data: filteredSessions, error: filteredError } = await supabase
      .from('enhanced_game_sessions')
      .select('student_id, game_type, accuracy_percentage, words_attempted')
      .in('student_id', studentIds)
      .gte('created_at', dateFilter.toISOString());

    if (filteredError) throw filteredError;

    const filteredSessionsByStudent = new Map();
    filteredSessions.forEach(session => {
      if (!filteredSessionsByStudent.has(session.student_id)) {
        filteredSessionsByStudent.set(session.student_id, []);
      }
      filteredSessionsByStudent.get(session.student_id).push(session);
    });

    // Filter out abandoned sessions (like the API does)
    const activeSessions = filteredSessions.filter(s =>
      (s.accuracy_percentage > 0 || s.words_attempted > 0) &&
      s.game_type !== 'memory-game'
    );

    const activeSessionsByStudent = new Map();
    activeSessions.forEach(session => {
      if (!activeSessionsByStudent.has(session.student_id)) {
        activeSessionsByStudent.set(session.student_id, []);
      }
      activeSessionsByStudent.get(session.student_id).push(session);
    });

    console.log(`Sessions in Last 30 Days:`);
    console.log(`  • Total fetched: ${filteredSessions.length}`);
    console.log(`  • After filtering (active + not memory-game): ${activeSessions.length}`);
    console.log(`  • Students with active sessions: ${activeSessionsByStudent.size}`);
    console.log(`  • Students without active sessions: ${studentIds.length - activeSessionsByStudent.size}\n`);

    // ==========================================
    // 6. Check assignment_vocabulary_progress
    // ==========================================
    console.log('📖 STEP 6: Check assignment_vocabulary_progress (vocab tracking)...\n');

    const { data: allVocabProgress, error: allVocabError } = await supabase
      .from('assignment_vocabulary_progress')
      .select('student_id')
      .in('student_id', studentIds)
      .gte('created_at', dateFilter.toISOString());

    if (allVocabError) throw allVocabError;

    const studentsWithVocabActivity = new Set(allVocabProgress.map(v => v.student_id));

    console.log(`Vocab Progress Tracking:`);
    console.log(`  • Students with vocab activity: ${studentsWithVocabActivity.size}`);
    console.log(`  • Students without vocab activity: ${studentIds.length - studentsWithVocabActivity.size}\n`);

    // ==========================================
    // SUMMARY
    // ==========================================
    console.log('\n' + '═'.repeat(60));
    console.log('📊 AUDIT SUMMARY');
    console.log('═'.repeat(60) + '\n');

    console.log('Key Findings:');
    console.log(`1. Session data IS being recorded in enhanced_game_sessions`);
    console.log(`2. Game sessions count (unfiltered): ${gameSessions.length}`);
    console.log(`3. Game sessions count (last 30 days, filtered): ${activeSessions.length}`);
    console.log(`4. Vocab progress data exists: ${vocabProgress.length > 0 ? 'YES' : 'NO'}`);
    console.log(`\nPossible Issues:`);
    console.log(`- Sessions might be in memory-game (filtered out): ${gameSessions.filter(s => s.game_type === 'memory-game').length}`);
    console.log(`- Sessions with 0% accuracy AND 0 words (abandoned): ${filteredSessions.filter(s => s.accuracy_percentage === 0 && s.words_attempted === 0).length}`);
    console.log(`- Date filter might be excluding old sessions`);
    console.log(`\nRecommendations:`);
    console.log(`- Check if students are ACTUALLY playing OR just enrolling`);
    console.log(`- Verify game tracking code is actually recording sessions`);
    console.log(`- Consider including vocabulary tracking in "never logged in" calculation`);

  } catch (error) {
    console.error('❌ Error during audit:', error.message);
    process.exit(1);
  }
}

auditLoginTracking().then(() => {
  console.log('\n✅ Audit complete!\n');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

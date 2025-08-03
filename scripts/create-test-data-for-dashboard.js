#!/usr/bin/env node

/**
 * Creates comprehensive test data for LanguageGems AI Dashboard
 * Generates realistic students, game sessions, and performance data
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TEACHER_ID = '9efcdbe9-7116-4bb7-a696-4afb0fb34e4c';

// Your existing classes
const CLASSES = [
  { id: '7565cca8-9c14-469f-961e-35decf890563', name: '7F', year_group: 'Year 7' },
  { id: '6a789011-46b7-4460-8d4d-ce01e157dd00', name: '8F/ML', year_group: '8' },
  { id: '947029f7-5c1e-4b30-8133-8bcf712be8c9', name: '10A', year_group: '10' },
  { id: 'bd37e042-f440-4f46-a7db-fb602d0acf72', name: '10B', year_group: '10' },
  { id: '07385e4d-ca61-4549-b9e8-d0432c4df2e4', name: '7E', year_group: '7' },
  { id: '6f8c91cd-6278-420a-a10c-279a57588a77', name: '8R', year_group: '8' }
];

const GAME_TYPES = [
  'vocabulary-mining',
  'sentence-towers',
  'word-towers',
  'memory-match',
  'pirate-ship',
  'space-explorer',
  'lava-temple'
];

const STUDENT_NAMES = [
  'Emma Thompson', 'James Wilson', 'Sophia Miller', 'Alex Johnson', 'Olivia Brown',
  'William Davis', 'Isabella Garcia', 'Benjamin Martinez', 'Charlotte Rodriguez',
  'Lucas Anderson', 'Amelia Taylor', 'Henry Thomas', 'Mia Jackson', 'Alexander White',
  'Harper Lewis', 'Sebastian Hall', 'Evelyn Allen', 'Owen Young', 'Abigail King'
];

async function createTestData() {
  console.log('🚀 Creating comprehensive test data for LanguageGems Dashboard...\n');

  try {
    // Step 1: Create additional students
    console.log('1. Creating additional students...');
    const newStudents = await createStudents();
    console.log(`   ✅ Created ${newStudents.length} new students`);

    // Step 2: Assign students to classes
    console.log('\n2. Assigning students to classes...');
    await assignStudentsToClasses(newStudents);
    console.log('   ✅ Students assigned to classes');

    // Step 3: Generate diverse game sessions
    console.log('\n3. Generating diverse game sessions...');
    const allStudents = [...newStudents, 
      { user_id: 'ec09507e-3777-4108-9a9c-72f6dd7e7fbe', display_name: 'Stephen Smith' },
      { user_id: '1bfacaf7-90a7-4888-a971-2b06b7d7104d', display_name: 'Steve Jobs' }
    ];
    const sessions = await generateGameSessions(allStudents);
    console.log(`   ✅ Generated ${sessions.length} game sessions`);

    // Step 4: Generate word performance logs
    console.log('\n4. Generating word performance data...');
    const wordLogs = await generateWordPerformanceLogs(sessions);
    console.log(`   ✅ Generated ${wordLogs.length} word performance logs`);

    // Step 5: Update analytics cache
    console.log('\n5. Updating analytics cache...');
    await updateAnalyticsCache(allStudents);
    console.log('   ✅ Analytics cache updated');

    console.log('\n🎉 Test data creation complete!');
    console.log('\n📊 Summary:');
    console.log(`- Students: ${allStudents.length} total`);
    console.log(`- Classes: ${CLASSES.length} classes`);
    console.log(`- Game Sessions: ${sessions.length} sessions`);
    console.log(`- Word Logs: ${wordLogs.length} word interactions`);
    console.log(`- Game Types: ${GAME_TYPES.length} different games`);

    return true;

  } catch (error) {
    console.error('❌ Error creating test data:', error);
    return false;
  }
}

async function createStudents() {
  const students = [];
  
  for (let i = 0; i < 15; i++) {
    const name = STUDENT_NAMES[i];
    const email = `${name.toLowerCase().replace(' ', '.')}.test${Date.now()}${i}@student.languagegems.com`;
    
    // Create auth user first (simulated)
    const studentId = `test-student-${Date.now()}-${i}`;
    
    // Create user profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: studentId,
        email: email,
        display_name: name,
        role: 'student',
        teacher_id: TEACHER_ID,
        initial_password: `${name.split(' ')[0].toLowerCase()}gem${Math.floor(Math.random() * 100)}`
      })
      .select()
      .single();

    if (error) {
      console.error(`Error creating student ${name}:`, error);
      continue;
    }

    students.push({
      user_id: studentId,
      display_name: name,
      email: email
    });
  }

  return students;
}

async function assignStudentsToClasses(students) {
  const assignments = [];
  
  students.forEach((student, index) => {
    // Distribute students across classes
    const classIndex = index % CLASSES.length;
    const selectedClass = CLASSES[classIndex];
    
    assignments.push({
      student_id: student.user_id,
      class_id: selectedClass.id,
      enrolled_at: new Date().toISOString()
    });
  });

  // Insert class assignments (assuming class_students table exists)
  const { error } = await supabase
    .from('class_students')
    .insert(assignments);

  if (error && !error.message.includes('does not exist')) {
    console.error('Error assigning students to classes:', error);
  }
}

async function generateGameSessions(students) {
  const sessions = [];
  const now = new Date();
  
  for (const student of students) {
    // Generate 8-15 sessions per student over the last 30 days
    const sessionCount = Math.floor(Math.random() * 8) + 8;
    
    for (let i = 0; i < sessionCount; i++) {
      // Random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const sessionDate = new Date(now);
      sessionDate.setDate(sessionDate.getDate() - daysAgo);
      
      // Random game type
      const gameType = GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)];
      
      // Generate realistic performance metrics
      const baseAccuracy = 60 + Math.random() * 35; // 60-95%
      const accuracy = Math.min(100, Math.max(20, baseAccuracy + (Math.random() - 0.5) * 20));
      const duration = Math.floor(Math.random() * 300) + 60; // 1-6 minutes
      const wordsAttempted = Math.floor(Math.random() * 20) + 10;
      const wordsCorrect = Math.floor((accuracy / 100) * wordsAttempted);
      const xpEarned = Math.floor(wordsCorrect * 10 + (accuracy > 80 ? 50 : 0));
      
      const session = {
        id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        student_id: student.user_id,
        game_type: gameType,
        session_mode: 'practice',
        started_at: sessionDate.toISOString(),
        ended_at: new Date(sessionDate.getTime() + duration * 1000).toISOString(),
        duration_seconds: duration,
        final_score: wordsCorrect,
        max_score_possible: wordsAttempted,
        accuracy_percentage: accuracy,
        completion_percentage: 100,
        level_reached: Math.floor(Math.random() * 5) + 1,
        words_attempted: wordsAttempted,
        words_correct: wordsCorrect,
        unique_words_practiced: Math.floor(wordsAttempted * 0.8),
        average_response_time_ms: Math.floor(Math.random() * 3000) + 1000,
        xp_earned: xpEarned,
        bonus_xp: accuracy > 90 ? Math.floor(Math.random() * 20) : 0,
        created_at: sessionDate.toISOString(),
        updated_at: sessionDate.toISOString()
      };
      
      sessions.push(session);
    }
  }

  // Insert sessions in batches
  const batchSize = 50;
  for (let i = 0; i < sessions.length; i += batchSize) {
    const batch = sessions.slice(i, i + batchSize);
    const { error } = await supabase
      .from('enhanced_game_sessions')
      .insert(batch);
    
    if (error) {
      console.error(`Error inserting session batch ${i / batchSize + 1}:`, error);
    }
  }

  return sessions;
}

async function generateWordPerformanceLogs(sessions) {
  const wordLogs = [];
  const commonWords = [
    'bonjour', 'au revoir', 'merci', 'oui', 'non', 'chat', 'chien', 'maison', 'école', 'livre',
    'rouge', 'bleu', 'vert', 'grand', 'petit', 'manger', 'boire', 'dormir', 'courir', 'parler'
  ];

  for (const session of sessions.slice(0, 100)) { // Limit to avoid too much data
    const wordCount = Math.min(session.words_attempted || 10, 15);
    
    for (let i = 0; i < wordCount; i++) {
      const word = commonWords[Math.floor(Math.random() * commonWords.length)];
      const wasCorrect = Math.random() < (session.accuracy_percentage / 100);
      
      wordLogs.push({
        id: `word-log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        session_id: session.id,
        student_id: session.student_id,
        word_text: word,
        was_correct: wasCorrect,
        response_time_ms: Math.floor(Math.random() * 5000) + 500,
        attempt_number: 1,
        hint_used: Math.random() < 0.1,
        timestamp: session.started_at,
        created_at: session.started_at
      });
    }
  }

  // Insert word logs in batches
  const batchSize = 100;
  for (let i = 0; i < wordLogs.length; i += batchSize) {
    const batch = wordLogs.slice(i, i + batchSize);
    const { error } = await supabase
      .from('word_performance_logs')
      .insert(batch);
    
    if (error) {
      console.error(`Error inserting word log batch ${i / batchSize + 1}:`, error);
    }
  }

  return wordLogs;
}

async function updateAnalyticsCache(students) {
  // Run the analytics cache population script
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    const process = spawn('node', ['scripts/populate-analytics-cache.js'], {
      stdio: 'inherit'
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Analytics cache update failed with code ${code}`));
      }
    });
  });
}

// Run the script
if (require.main === module) {
  createTestData()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createTestData };

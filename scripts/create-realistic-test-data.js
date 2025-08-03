#!/usr/bin/env node

/**
 * Creates realistic test data for dashboard testing
 * Focuses on enhancing existing students with diverse game sessions
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const EXISTING_STUDENTS = [
  'ec09507e-3777-4108-9a9c-72f6dd7e7fbe', // Stephen Smith
  '1bfacaf7-90a7-4888-a971-2b06b7d7104d'  // Steve Jobs
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

const FRENCH_WORDS = [
  'bonjour', 'au revoir', 'merci', 'oui', 'non', 'chat', 'chien', 'maison', 'école', 'livre',
  'rouge', 'bleu', 'vert', 'grand', 'petit', 'manger', 'boire', 'dormir', 'courir', 'parler',
  'famille', 'ami', 'temps', 'jour', 'nuit', 'eau', 'pain', 'fromage', 'voiture', 'train'
];

async function createRealisticTestData() {
  console.log('🚀 Creating realistic test data for existing students...\n');

  try {
    // Step 1: Generate diverse game sessions
    console.log('1. Generating diverse game sessions...');
    const sessions = await generateDiverseGameSessions();
    console.log(`   ✅ Generated ${sessions.length} game sessions`);

    // Step 2: Generate word performance logs
    console.log('\n2. Generating word performance data...');
    const wordLogs = await generateWordPerformanceLogs(sessions);
    console.log(`   ✅ Generated ${wordLogs.length} word performance logs`);

    // Step 3: Update existing sessions with XP
    console.log('\n3. Updating existing sessions with XP...');
    await updateExistingSessionsWithXP();
    console.log('   ✅ Updated existing sessions');

    // Step 4: Populate analytics cache
    console.log('\n4. Populating analytics cache...');
    await populateAnalyticsCache();
    console.log('   ✅ Analytics cache populated');

    // Step 5: Verify data
    console.log('\n5. Verifying test data...');
    await verifyTestData();

    console.log('\n🎉 Realistic test data creation complete!');
    return true;

  } catch (error) {
    console.error('❌ Error creating test data:', error);
    return false;
  }
}

async function generateDiverseGameSessions() {
  const sessions = [];
  const now = new Date();

  for (const studentId of EXISTING_STUDENTS) {
    // Generate 15-20 sessions per student over last 30 days
    const sessionCount = Math.floor(Math.random() * 6) + 15;
    
    for (let i = 0; i < sessionCount; i++) {
      // Random date within last 30 days, weighted toward recent dates
      const daysAgo = Math.floor(Math.pow(Math.random(), 2) * 30); // Weighted toward recent
      const sessionDate = new Date(now);
      sessionDate.setDate(sessionDate.getDate() - daysAgo);
      sessionDate.setHours(Math.floor(Math.random() * 12) + 8); // 8am-8pm
      sessionDate.setMinutes(Math.floor(Math.random() * 60));
      
      // Random game type
      const gameType = GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)];
      
      // Generate realistic performance with some students performing better
      const studentPerformanceBase = studentId === EXISTING_STUDENTS[0] ? 75 : 65; // Stephen performs better
      const accuracy = Math.min(100, Math.max(30, 
        studentPerformanceBase + (Math.random() - 0.5) * 30 + Math.sin(i * 0.5) * 10 // Some improvement over time
      ));
      
      const duration = Math.floor(Math.random() * 400) + 120; // 2-8 minutes
      const wordsAttempted = Math.floor(Math.random() * 25) + 15;
      const wordsCorrect = Math.floor((accuracy / 100) * wordsAttempted);
      const xpBase = wordsCorrect * 8;
      const bonusXP = accuracy > 85 ? Math.floor(Math.random() * 30) + 10 : 0;
      const xpEarned = xpBase + bonusXP;
      
      const session = {
        id: `test-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        student_id: studentId,
        game_type: gameType,
        session_mode: Math.random() < 0.8 ? 'practice' : 'challenge',
        started_at: sessionDate.toISOString(),
        ended_at: new Date(sessionDate.getTime() + duration * 1000).toISOString(),
        duration_seconds: duration,
        final_score: wordsCorrect,
        max_score_possible: wordsAttempted,
        accuracy_percentage: Math.round(accuracy * 100) / 100,
        completion_percentage: Math.min(100, Math.max(60, accuracy + Math.random() * 20)),
        level_reached: Math.min(10, Math.floor(accuracy / 15) + 1),
        words_attempted: wordsAttempted,
        words_correct: wordsCorrect,
        unique_words_practiced: Math.floor(wordsAttempted * (0.7 + Math.random() * 0.2)),
        average_response_time_ms: Math.floor(2000 + Math.random() * 3000 + (100 - accuracy) * 20),
        pause_count: Math.floor(Math.random() * 3),
        hint_requests: Math.floor(Math.random() * Math.max(1, wordsAttempted - wordsCorrect)),
        retry_attempts: Math.floor(Math.random() * Math.max(1, wordsAttempted - wordsCorrect)),
        xp_earned: xpEarned,
        bonus_xp: bonusXP,
        xp_multiplier: accuracy > 90 ? 1.2 : 1.0,
        created_at: sessionDate.toISOString(),
        updated_at: sessionDate.toISOString()
      };
      
      sessions.push(session);
    }
  }

  // Insert sessions in batches
  const batchSize = 20;
  for (let i = 0; i < sessions.length; i += batchSize) {
    const batch = sessions.slice(i, i + batchSize);
    const { error } = await supabase
      .from('enhanced_game_sessions')
      .insert(batch);
    
    if (error) {
      console.error(`Error inserting session batch ${i / batchSize + 1}:`, error);
    } else {
      console.log(`   📝 Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sessions.length / batchSize)}`);
    }
  }

  return sessions;
}

async function generateWordPerformanceLogs(sessions) {
  const wordLogs = [];

  // Generate logs for a subset of sessions to avoid too much data
  const sessionsToProcess = sessions.slice(0, 30);

  for (const session of sessionsToProcess) {
    const wordCount = Math.min(session.words_attempted || 15, 20);
    
    for (let i = 0; i < wordCount; i++) {
      const word = FRENCH_WORDS[Math.floor(Math.random() * FRENCH_WORDS.length)];
      const wasCorrect = Math.random() < (session.accuracy_percentage / 100);
      const responseTime = session.average_response_time_ms + (Math.random() - 0.5) * 1000;
      
      wordLogs.push({
        id: `test-word-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        session_id: session.id,
        student_id: session.student_id,
        word_text: word,
        was_correct: wasCorrect,
        response_time_ms: Math.max(500, Math.floor(responseTime)),
        attempt_number: wasCorrect ? 1 : Math.floor(Math.random() * 3) + 1,
        hint_used: !wasCorrect && Math.random() < 0.3,
        error_type: wasCorrect ? null : ['spelling', 'pronunciation', 'meaning'][Math.floor(Math.random() * 3)],
        timestamp: session.started_at,
        created_at: session.started_at
      });
    }
  }

  // Insert word logs in batches
  const batchSize = 50;
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

async function updateExistingSessionsWithXP() {
  // Update existing sessions that have 0 XP
  const { data: existingSessions, error: fetchError } = await supabase
    .from('enhanced_game_sessions')
    .select('id, accuracy_percentage, words_correct')
    .eq('xp_earned', 0)
    .in('student_id', EXISTING_STUDENTS);

  if (fetchError) {
    console.error('Error fetching existing sessions:', fetchError);
    return;
  }

  for (const session of existingSessions || []) {
    const xpEarned = Math.floor((session.words_correct || 10) * 8 + (session.accuracy_percentage > 80 ? 20 : 0));
    
    const { error } = await supabase
      .from('enhanced_game_sessions')
      .update({ 
        xp_earned: xpEarned,
        bonus_xp: session.accuracy_percentage > 90 ? 15 : 0
      })
      .eq('id', session.id);

    if (error) {
      console.error(`Error updating session ${session.id}:`, error);
    }
  }
}

async function populateAnalyticsCache() {
  // Run the populate analytics cache script
  const { spawn } = require('child_process');
  
  return new Promise((resolve, reject) => {
    const process = spawn('node', ['scripts/populate-analytics-cache.js'], {
      stdio: 'pipe'
    });
    
    let output = '';
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      console.error('Analytics cache error:', data.toString());
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log('   📊 Analytics cache populated successfully');
        resolve();
      } else {
        console.error('Analytics cache population failed');
        reject(new Error(`Analytics cache update failed with code ${code}`));
      }
    });
  });
}

async function verifyTestData() {
  // Verify sessions
  const { data: sessions, error: sessionError } = await supabase
    .from('enhanced_game_sessions')
    .select('student_id, game_type, accuracy_percentage, xp_earned')
    .in('student_id', EXISTING_STUDENTS);

  if (sessionError) {
    console.error('Error verifying sessions:', sessionError);
    return;
  }

  // Verify word logs
  const { data: wordLogs, error: wordError } = await supabase
    .from('word_performance_logs')
    .select('student_id, word_text, was_correct')
    .in('student_id', EXISTING_STUDENTS)
    .limit(10);

  if (wordError) {
    console.error('Error verifying word logs:', wordError);
    return;
  }

  // Verify analytics cache
  const { data: cache, error: cacheError } = await supabase
    .from('student_analytics_cache')
    .select('student_id, metrics_data')
    .limit(5);

  if (cacheError) {
    console.error('Error verifying cache:', cacheError);
    return;
  }

  console.log('\n📊 Verification Results:');
  console.log(`   - Total Sessions: ${sessions?.length || 0}`);
  console.log(`   - Unique Game Types: ${new Set(sessions?.map(s => s.game_type)).size || 0}`);
  console.log(`   - Average Accuracy: ${sessions?.length ? Math.round(sessions.reduce((sum, s) => sum + parseFloat(s.accuracy_percentage || 0), 0) / sessions.length) : 0}%`);
  console.log(`   - Total XP Earned: ${sessions?.reduce((sum, s) => sum + (s.xp_earned || 0), 0) || 0}`);
  console.log(`   - Word Performance Logs: ${wordLogs?.length || 0}`);
  console.log(`   - Analytics Cache Entries: ${cache?.length || 0}`);
}

// Run the script
if (require.main === module) {
  createRealisticTestData()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createRealisticTestData };

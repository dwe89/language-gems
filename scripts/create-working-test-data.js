#!/usr/bin/env node

/**
 * Creates working test data with proper UUIDs and correct schema
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

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

const FRENCH_VOCABULARY = [
  { word: 'bonjour', translation: 'hello', difficulty: 'beginner' },
  { word: 'au revoir', translation: 'goodbye', difficulty: 'beginner' },
  { word: 'merci', translation: 'thank you', difficulty: 'beginner' },
  { word: 'chat', translation: 'cat', difficulty: 'beginner' },
  { word: 'chien', translation: 'dog', difficulty: 'beginner' },
  { word: 'maison', translation: 'house', difficulty: 'intermediate' },
  { word: 'école', translation: 'school', difficulty: 'intermediate' },
  { word: 'livre', translation: 'book', difficulty: 'intermediate' },
  { word: 'famille', translation: 'family', difficulty: 'intermediate' },
  { word: 'voiture', translation: 'car', difficulty: 'advanced' }
];

async function createWorkingTestData() {
  console.log('🚀 Creating working test data with proper schemas...\n');

  try {
    // Step 1: Generate realistic game sessions
    console.log('1. Generating realistic game sessions...');
    const sessions = await generateRealisticSessions();
    console.log(`   ✅ Generated ${sessions.length} game sessions`);

    // Step 2: Generate word performance logs with correct schema
    console.log('\n2. Generating word performance logs...');
    const wordLogs = await generateWordLogs(sessions);
    console.log(`   ✅ Generated ${wordLogs.length} word performance logs`);

    // Step 3: Update existing sessions with XP
    console.log('\n3. Updating existing sessions with XP...');
    await updateExistingSessionsXP();
    console.log('   ✅ Updated existing sessions');

    // Step 4: Populate analytics cache
    console.log('\n4. Populating analytics cache...');
    await populateCache();
    console.log('   ✅ Analytics cache populated');

    // Step 5: Verify final data
    console.log('\n5. Verifying test data...');
    await verifyFinalData();

    console.log('\n🎉 Working test data creation complete!');
    return true;

  } catch (error) {
    console.error('❌ Error creating test data:', error);
    return false;
  }
}

async function generateRealisticSessions() {
  const sessions = [];
  const now = new Date();

  for (const studentId of EXISTING_STUDENTS) {
    // Generate 12-18 sessions per student over last 21 days
    const sessionCount = Math.floor(Math.random() * 7) + 12;
    
    for (let i = 0; i < sessionCount; i++) {
      // Random date within last 21 days
      const daysAgo = Math.floor(Math.random() * 21);
      const sessionDate = new Date(now);
      sessionDate.setDate(sessionDate.getDate() - daysAgo);
      sessionDate.setHours(Math.floor(Math.random() * 10) + 9); // 9am-7pm
      sessionDate.setMinutes(Math.floor(Math.random() * 60));
      
      // Random game type
      const gameType = GAME_TYPES[Math.floor(Math.random() * GAME_TYPES.length)];
      
      // Generate performance with student variation
      const studentBase = studentId === EXISTING_STUDENTS[0] ? 78 : 68; // Stephen performs better
      const accuracy = Math.min(100, Math.max(35, 
        studentBase + (Math.random() - 0.5) * 25 + Math.sin(i * 0.3) * 8 // Gradual improvement
      ));
      
      const duration = Math.floor(Math.random() * 350) + 90; // 1.5-7 minutes
      const wordsAttempted = Math.floor(Math.random() * 20) + 12;
      const wordsCorrect = Math.floor((accuracy / 100) * wordsAttempted);
      const xpBase = wordsCorrect * 7;
      const bonusXP = accuracy > 85 ? Math.floor(Math.random() * 25) + 5 : 0;
      const xpEarned = xpBase + bonusXP;
      
      const session = {
        id: uuidv4(), // Proper UUID
        student_id: studentId,
        game_type: gameType,
        session_mode: Math.random() < 0.75 ? 'practice' : 'challenge',
        started_at: sessionDate.toISOString(),
        ended_at: new Date(sessionDate.getTime() + duration * 1000).toISOString(),
        duration_seconds: duration,
        final_score: wordsCorrect,
        max_score_possible: wordsAttempted,
        accuracy_percentage: Math.round(accuracy * 100) / 100,
        completion_percentage: Math.min(100, Math.max(70, accuracy + Math.random() * 15)),
        level_reached: Math.min(8, Math.floor(accuracy / 18) + 1),
        words_attempted: wordsAttempted,
        words_correct: wordsCorrect,
        unique_words_practiced: Math.floor(wordsAttempted * (0.75 + Math.random() * 0.15)),
        average_response_time_ms: Math.floor(1800 + Math.random() * 2500 + (100 - accuracy) * 15),
        pause_count: Math.floor(Math.random() * 4),
        hint_requests: Math.floor(Math.random() * Math.max(1, wordsAttempted - wordsCorrect + 1)),
        retry_attempts: Math.floor(Math.random() * Math.max(1, wordsAttempted - wordsCorrect + 1)),
        xp_earned: xpEarned,
        bonus_xp: bonusXP,
        xp_multiplier: accuracy > 88 ? 1.15 : 1.0,
        created_at: sessionDate.toISOString(),
        updated_at: sessionDate.toISOString()
      };
      
      sessions.push(session);
    }
  }

  // Insert sessions in smaller batches
  const batchSize = 15;
  let insertedCount = 0;
  
  for (let i = 0; i < sessions.length; i += batchSize) {
    const batch = sessions.slice(i, i + batchSize);
    const { error } = await supabase
      .from('enhanced_game_sessions')
      .insert(batch);
    
    if (error) {
      console.error(`   ❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
    } else {
      insertedCount += batch.length;
      console.log(`   📝 Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sessions.length / batchSize)} (${insertedCount}/${sessions.length})`);
    }
  }

  return sessions.filter((_, index) => index < insertedCount);
}

async function generateWordLogs(sessions) {
  const wordLogs = [];
  
  // Process first 20 sessions to avoid too much data
  const sessionsToProcess = sessions.slice(0, 20);

  for (const session of sessionsToProcess) {
    const wordCount = Math.min(session.words_attempted || 12, 15);
    
    for (let i = 0; i < wordCount; i++) {
      const vocab = FRENCH_VOCABULARY[Math.floor(Math.random() * FRENCH_VOCABULARY.length)];
      const wasCorrect = Math.random() < (session.accuracy_percentage / 100);
      const responseTime = session.average_response_time_ms + (Math.random() - 0.5) * 800;
      
      const wordLog = {
        id: uuidv4(), // Proper UUID
        session_id: session.id,
        word_text: vocab.word,
        translation_text: vocab.translation,
        language_pair: 'fr-en',
        attempt_number: wasCorrect ? 1 : Math.floor(Math.random() * 3) + 1,
        response_time_ms: Math.max(400, Math.floor(responseTime)),
        was_correct: wasCorrect,
        confidence_level: wasCorrect ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 3) + 1,
        difficulty_level: vocab.difficulty,
        hint_used: !wasCorrect && Math.random() < 0.25,
        streak_count: wasCorrect ? Math.floor(Math.random() * 5) : 0,
        previous_attempts: Math.floor(Math.random() * 3),
        mastery_level: Math.floor(Math.random() * 5) + 1,
        timestamp: session.started_at,
        error_type: wasCorrect ? null : ['spelling', 'pronunciation', 'meaning'][Math.floor(Math.random() * 3)],
        grammar_concept: ['vocabulary', 'pronunciation', 'spelling'][Math.floor(Math.random() * 3)]
      };
      
      wordLogs.push(wordLog);
    }
  }

  // Insert word logs in batches
  const batchSize = 25;
  let insertedCount = 0;
  
  for (let i = 0; i < wordLogs.length; i += batchSize) {
    const batch = wordLogs.slice(i, i + batchSize);
    const { error } = await supabase
      .from('word_performance_logs')
      .insert(batch);
    
    if (error) {
      console.error(`   ❌ Error inserting word log batch ${Math.floor(i / batchSize) + 1}:`, error.message);
    } else {
      insertedCount += batch.length;
    }
  }

  return wordLogs.filter((_, index) => index < insertedCount);
}

async function updateExistingSessionsXP() {
  // Update existing sessions that have 0 XP
  const { data: existingSessions, error: fetchError } = await supabase
    .from('enhanced_game_sessions')
    .select('id, accuracy_percentage, words_correct')
    .eq('xp_earned', 0)
    .in('student_id', EXISTING_STUDENTS);

  if (fetchError) {
    console.error('   ❌ Error fetching existing sessions:', fetchError.message);
    return;
  }

  if (!existingSessions || existingSessions.length === 0) {
    console.log('   ℹ️  No existing sessions with 0 XP found');
    return;
  }

  for (const session of existingSessions) {
    const xpEarned = Math.floor((session.words_correct || 8) * 7 + (session.accuracy_percentage > 80 ? 15 : 0));
    
    const { error } = await supabase
      .from('enhanced_game_sessions')
      .update({ 
        xp_earned: xpEarned,
        bonus_xp: session.accuracy_percentage > 90 ? 12 : 0
      })
      .eq('id', session.id);

    if (error) {
      console.error(`   ❌ Error updating session ${session.id}:`, error.message);
    }
  }
  
  console.log(`   ✅ Updated ${existingSessions.length} existing sessions with XP`);
}

async function populateCache() {
  try {
    const { spawn } = require('child_process');
    
    await new Promise((resolve, reject) => {
      const process = spawn('node', ['scripts/populate-analytics-cache.js'], {
        stdio: 'pipe'
      });
      
      process.stdout.on('data', (data) => {
        // Suppress detailed output, just show completion
      });
      
      process.stderr.on('data', (data) => {
        console.error('   ❌ Analytics cache error:', data.toString());
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Analytics cache failed with code ${code}`));
        }
      });
    });
    
    console.log('   ✅ Analytics cache populated successfully');
  } catch (error) {
    console.error('   ❌ Error populating analytics cache:', error.message);
  }
}

async function verifyFinalData() {
  try {
    // Verify sessions
    const { data: sessions, error: sessionError } = await supabase
      .from('enhanced_game_sessions')
      .select('student_id, game_type, accuracy_percentage, xp_earned, created_at')
      .in('student_id', EXISTING_STUDENTS)
      .order('created_at', { ascending: false });

    if (sessionError) {
      console.error('   ❌ Error verifying sessions:', sessionError.message);
      return;
    }

    // Verify word logs
    const { data: wordLogs, error: wordError } = await supabase
      .from('word_performance_logs')
      .select('session_id, word_text, was_correct')
      .limit(10);

    if (wordError) {
      console.error('   ❌ Error verifying word logs:', wordError.message);
      return;
    }

    // Verify analytics cache
    const { data: cache, error: cacheError } = await supabase
      .from('student_analytics_cache')
      .select('student_id, metrics_data')
      .limit(5);

    if (cacheError) {
      console.error('   ❌ Error verifying cache:', cacheError.message);
      return;
    }

    console.log('\n📊 Final Verification Results:');
    console.log(`   - Total Sessions: ${sessions?.length || 0}`);
    console.log(`   - Unique Game Types: ${new Set(sessions?.map(s => s.game_type)).size || 0}`);
    console.log(`   - Average Accuracy: ${sessions?.length ? Math.round(sessions.reduce((sum, s) => sum + parseFloat(s.accuracy_percentage || 0), 0) / sessions.length) : 0}%`);
    console.log(`   - Total XP Earned: ${sessions?.reduce((sum, s) => sum + (s.xp_earned || 0), 0) || 0}`);
    console.log(`   - Word Performance Logs: ${wordLogs?.length || 0} sample entries`);
    console.log(`   - Analytics Cache Entries: ${cache?.length || 0}`);
    
    if (sessions && sessions.length > 0) {
      console.log(`   - Date Range: ${new Date(sessions[sessions.length - 1].created_at).toLocaleDateString()} to ${new Date(sessions[0].created_at).toLocaleDateString()}`);
    }

  } catch (error) {
    console.error('   ❌ Error during verification:', error.message);
  }
}

// Run the script
if (require.main === module) {
  createWorkingTestData()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createWorkingTestData };

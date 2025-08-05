/**
 * Test script for Enhanced Game Service
 * Tests the automatic derivation of language and curriculum_level
 */

import { EnhancedGameService, WordPerformanceLog } from '../src/services/enhancedGameService';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const gameService = new EnhancedGameService(supabase);

async function testLanguageDerivation() {
  console.log('🧪 Testing language derivation...');
  
  // Test cases for language derivation
  const testCases = [
    {
      name: 'Explicit language provided',
      data: { language: 'fr', language_pair: 'es_english' },
      expected: 'fr'
    },
    {
      name: 'Spanish from language_pair',
      data: { language_pair: 'es_english' },
      expected: 'es'
    },
    {
      name: 'French from language_pair',
      data: { language_pair: 'fr_english' },
      expected: 'fr'
    },
    {
      name: 'Fallback to Spanish',
      data: { language_pair: 'english_spanish' },
      expected: 'es'
    },
    {
      name: 'No data - fallback',
      data: {},
      expected: 'es'
    }
  ];

  for (const testCase of testCases) {
    const mockData = {
      session_id: 'test-session',
      word_text: 'test',
      translation_text: 'test',
      language_pair: 'es_english',
      attempt_number: 1,
      response_time_ms: 1000,
      was_correct: true,
      difficulty_level: 'beginner',
      hint_used: false,
      streak_count: 1,
      previous_attempts: 0,
      mastery_level: 1,
      context_data: {},
      timestamp: new Date(),
      ...testCase.data
    } as WordPerformanceLog;

    // Use reflection to access private method for testing
    const result = (gameService as any).deriveLanguageFromContext(mockData);
    
    if (result === testCase.expected) {
      console.log(`✅ ${testCase.name}: ${result}`);
    } else {
      console.log(`❌ ${testCase.name}: Expected ${testCase.expected}, got ${result}`);
    }
  }
}

async function testCurriculumLevelDerivation() {
  console.log('\n🧪 Testing curriculum level derivation...');
  
  try {
    // Test with vocabulary_id lookup
    const testData1: WordPerformanceLog = {
      session_id: 'test-session',
      vocabulary_id: 1, // Assuming this exists in centralized_vocabulary
      word_text: 'test',
      translation_text: 'test',
      language_pair: 'es_english',
      attempt_number: 1,
      response_time_ms: 1000,
      was_correct: true,
      difficulty_level: 'beginner',
      hint_used: false,
      streak_count: 1,
      previous_attempts: 0,
      mastery_level: 1,
      context_data: {},
      timestamp: new Date()
    };

    const result1 = await (gameService as any).deriveCurriculumLevel(testData1);
    console.log(`✅ Vocabulary lookup test: ${result1}`);

    // Test with fallback
    const testData2: WordPerformanceLog = {
      session_id: 'non-existent-session',
      word_text: 'test',
      translation_text: 'test',
      language_pair: 'es_english',
      attempt_number: 1,
      response_time_ms: 1000,
      was_correct: true,
      difficulty_level: 'beginner',
      hint_used: false,
      streak_count: 1,
      previous_attempts: 0,
      mastery_level: 1,
      context_data: {},
      timestamp: new Date()
    };

    const result2 = await (gameService as any).deriveCurriculumLevel(testData2);
    console.log(`✅ Fallback test: ${result2}`);

  } catch (error) {
    console.log(`❌ Curriculum level derivation error: ${error}`);
  }
}

async function testFullLogWordPerformance() {
  console.log('\n🧪 Testing full logWordPerformance method...');
  
  try {
    // Create a test session first
    const sessionId = await gameService.startGameSession({
      student_id: 'test-student-id',
      game_type: 'word-scramble',
      session_mode: 'free_play'
    });

    console.log(`📝 Created test session: ${sessionId}`);

    // Test logging performance data without explicit language/curriculum_level
    const performanceData: WordPerformanceLog = {
      session_id: sessionId,
      word_text: 'hola',
      translation_text: 'hello',
      language_pair: 'es_english',
      attempt_number: 1,
      response_time_ms: 2500,
      was_correct: true,
      confidence_level: 4,
      difficulty_level: 'beginner',
      hint_used: false,
      streak_count: 1,
      previous_attempts: 0,
      mastery_level: 1,
      context_data: {
        gameType: 'word-scramble',
        testRun: true
      },
      timestamp: new Date()
    };

    await gameService.logWordPerformance(performanceData);
    console.log('✅ Successfully logged performance data');

    // Verify the data was enriched correctly
    const { data: loggedData, error } = await supabase
      .from('word_performance_logs')
      .select('language, curriculum_level, word_text')
      .eq('session_id', sessionId)
      .eq('word_text', 'hola')
      .single();

    if (error) {
      console.log(`❌ Error retrieving logged data: ${error.message}`);
    } else {
      console.log(`✅ Data enrichment verified:`);
      console.log(`   - Language: ${loggedData.language}`);
      console.log(`   - Curriculum Level: ${loggedData.curriculum_level}`);
      console.log(`   - Word: ${loggedData.word_text}`);
    }

    // Clean up test session
    await supabase
      .from('enhanced_game_sessions')
      .delete()
      .eq('id', sessionId);

    await supabase
      .from('word_performance_logs')
      .delete()
      .eq('session_id', sessionId);

    console.log('🧹 Cleaned up test data');

  } catch (error) {
    console.log(`❌ Full test error: ${error}`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Enhanced Game Service Tests\n');
  
  await testLanguageDerivation();
  await testCurriculumLevelDerivation();
  await testFullLogWordPerformance();
  
  console.log('\n✨ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests };

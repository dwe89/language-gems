/**
 * Manual Integration Test
 * 
 * Quick test to verify core functionality works without complex test framework
 */

import { createClient } from '@supabase/supabase-js';
import { SentenceGameService } from '../src/services/SentenceGameService';
import { ConjugationDuelService } from '../src/services/ConjugationDuelService';
import { generateTestUUIDs, createSessionId } from '../src/utils/uuidUtils';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testSentenceGameCore() {
  console.log('🎯 Testing Sentence Game Core Functionality...\n');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const sentenceGameService = new SentenceGameService(supabase);
  const testUUIDs = generateTestUUIDs();
  const testSessionId = createSessionId('test');

  try {
    // Test 1: "Me gusta la pizza" → should award 2 gems
    console.log('📝 Test 1: "Me gusta la pizza" vocabulary recognition');
    
    const result = await sentenceGameService.processSentenceAttempt({
      sessionId: testSessionId,
      gameType: 'manual_test',
      originalSentence: 'Me gusta la pizza',
      language: 'es',
      isCorrect: true,
      responseTimeMs: 3000,
      hintUsed: false,
      gameMode: 'translation'
    });

    console.log(`✅ Result: ${result.vocabularyMatches.length} vocabulary matches found`);
    console.log(`💎 Gems awarded: ${result.totalGems}`);
    console.log(`📊 Coverage: ${result.coveragePercentage}%`);
    
    if (result.vocabularyMatches.length >= 2) {
      console.log('✅ SUCCESS: Found expected vocabulary matches');
      result.vocabularyMatches.forEach((match, index) => {
        console.log(`   ${index + 1}. "${match.word}" (${match.is_mwe ? 'MWE' : 'single word'})`);
      });
    } else {
      console.log('❌ ISSUE: Expected at least 2 vocabulary matches');
    }

    if (result.gemsAwarded.length >= 2) {
      console.log('✅ SUCCESS: Awarded expected gems');
      result.gemsAwarded.forEach((gem, index) => {
        console.log(`   ${index + 1}. "${gem.word}" → ${gem.gemRarity} gem`);
      });
    } else {
      console.log('❌ ISSUE: Expected at least 2 gems awarded');
    }

    return result.vocabularyMatches.length >= 2 && result.gemsAwarded.length >= 2;

  } catch (error) {
    console.error('❌ Sentence game test failed:', error);
    return false;
  }
}

async function testConjugationDuelCore() {
  console.log('\n⚔️ Testing Conjugation Duel Core Functionality...\n');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const conjugationService = new ConjugationDuelService(supabase);

  try {
    // Test 1: Verb selection from database
    console.log('📝 Test 1: Spanish verb selection from database');
    
    const verbs = await conjugationService.getAvailableVerbs('es', 'beginner', 5);
    
    console.log(`✅ Found ${verbs.length} Spanish verbs in database`);
    
    if (verbs.length > 0) {
      console.log('✅ SUCCESS: Database contains Spanish verbs');
      verbs.forEach((verb, index) => {
        console.log(`   ${index + 1}. ${verb.infinitive} (${verb.verbType}) - ${verb.translation}`);
      });
    } else {
      console.log('❌ ISSUE: No Spanish verbs found in database');
      return false;
    }

    // Test 2: Conjugation generation
    console.log('\n📝 Test 2: Conjugation generation');
    
    const testVerb = { id: 'test-hablar', infinitive: 'hablar', translation: 'to speak' };
    
    const challenge = await conjugationService.generateChallenge(
      testVerb,
      'es',
      'present',
      0 // yo form
    );

    console.log(`✅ Generated challenge: ${challenge.person} ${challenge.infinitive} → ${challenge.expectedAnswer}`);
    
    if (challenge.expectedAnswer === 'hablo') {
      console.log('✅ SUCCESS: Correct conjugation generated');
    } else {
      console.log(`❌ ISSUE: Expected "hablo", got "${challenge.expectedAnswer}"`);
      return false;
    }

    // Test 3: Answer validation
    console.log('\n📝 Test 3: Answer validation and gem awarding');
    
    const testSessionId = createSessionId('conjugation-test');
    
    const result = await conjugationService.validateAttempt(
      {
        sessionId: 'test-student-session',
        challengeId: challenge.id,
        studentAnswer: 'hablo', // Correct answer
        responseTimeMs: 2500,
        hintUsed: false
      },
      challenge
    );

    console.log(`✅ Answer validation: ${result.isCorrect ? 'Correct' : 'Incorrect'}`);
    
    if (result.isCorrect) {
      console.log('✅ SUCCESS: Correct answer validated');
      if (result.gemAwarded) {
        console.log(`💎 Gem awarded: ${result.gemAwarded.rarity} (+${result.gemAwarded.xpValue} XP)`);
      }
    } else {
      console.log('❌ ISSUE: Correct answer marked as incorrect');
      return false;
    }

    return true;

  } catch (error) {
    console.error('❌ Conjugation duel test failed:', error);
    return false;
  }
}

async function testVocabularyDatabase() {
  console.log('\n📚 Testing Vocabulary Database Quality...\n');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // Test database quality
    const { data: sampleEntries, error } = await supabase
      .from('centralized_vocabulary')
      .select('word, language, is_mwe, should_track_for_fsrs')
      .eq('should_track_for_fsrs', true)
      .limit(10);

    if (error) {
      console.error('❌ Database query failed:', error);
      return false;
    }

    console.log(`✅ Database accessible: ${sampleEntries?.length || 0} sample entries`);
    
    if (sampleEntries && sampleEntries.length > 0) {
      console.log('📊 Sample vocabulary entries:');
      sampleEntries.forEach((entry, index) => {
        console.log(`   ${index + 1}. "${entry.word}" (${entry.language}) ${entry.is_mwe ? '[MWE]' : ''}`);
      });
      
      // Check for specific test vocabulary
      const { data: testVocab, error: testError } = await supabase
        .from('centralized_vocabulary')
        .select('word, language, is_mwe')
        .eq('should_track_for_fsrs', true)
        .in('word', ['me gusta', 'la pizza', 'hablar', 'comer'])
        .limit(10);

      if (!testError && testVocab && testVocab.length > 0) {
        console.log('\n✅ Test vocabulary found in database:');
        testVocab.forEach((entry, index) => {
          console.log(`   ${index + 1}. "${entry.word}" (${entry.language}) ${entry.is_mwe ? '[MWE]' : ''}`);
        });
      }

      return true;
    } else {
      console.log('❌ ISSUE: No vocabulary entries found');
      return false;
    }

  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

async function runManualTests() {
  console.log('🚀 MANUAL INTEGRATION TESTS - CORE FUNCTIONALITY\n');
  console.log('=' .repeat(60) + '\n');

  const results = {
    database: false,
    sentenceGame: false,
    conjugationDuel: false
  };

  // Test 1: Database quality
  results.database = await testVocabularyDatabase();

  // Test 2: Sentence game functionality
  results.sentenceGame = await testSentenceGameCore();

  // Test 3: Conjugation duel functionality
  results.conjugationDuel = await testConjugationDuelCore();

  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 MANUAL TEST RESULTS SUMMARY');
  console.log('=' .repeat(60));

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;

  console.log(`📚 Database Quality: ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🎯 Sentence Games: ${results.sentenceGame ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`⚔️ Conjugation Duel: ${results.conjugationDuel ? '✅ PASS' : '❌ FAIL'}`);

  console.log(`\n📈 Overall: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);

  if (passedTests === totalTests) {
    console.log('\n🎉 ALL CORE FUNCTIONALITY TESTS PASSED!');
    console.log('✅ Integration is successful and ready for production!');
  } else {
    console.log(`\n⚠️ ${totalTests - passedTests} test(s) failed. Review issues above.`);
  }

  console.log('=' .repeat(60));
}

// Run manual tests
if (require.main === module) {
  runManualTests().catch(console.error);
}

export { runManualTests };

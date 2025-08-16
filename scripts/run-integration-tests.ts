/**
 * Integration Test Runner
 * 
 * Runs comprehensive tests for both sentence games and conjugation duel systems.
 * Validates complete integration and provides detailed reporting.
 */

import { createClient } from '@supabase/supabase-js';
import { SentenceGameService } from '../src/services/SentenceGameService';
import { ConjugationDuelService } from '../src/services/ConjugationDuelService';
import { generateTestUUIDs, createSessionId } from '../src/utils/uuidUtils';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  details?: any;
  error?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  passedCount: number;
  failedCount: number;
}

class IntegrationTestRunner {
  private supabase: any;
  private sentenceGameService: SentenceGameService;
  private conjugationService: ConjugationDuelService;
  private testSessionId: string;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    this.sentenceGameService = new SentenceGameService(this.supabase);
    this.conjugationService = new ConjugationDuelService(this.supabase);
    // Generate a proper UUID for test session
    this.testSessionId = createSessionId('integration-test');
  }

  async runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      return {
        name,
        passed: true,
        duration,
        details: result
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        name,
        passed: false,
        duration,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async runSentenceGameTests(): Promise<TestSuite> {
    console.log('🎯 Running Sentence Game Integration Tests...\n');
    
    const tests: TestResult[] = [];

    // Test 1: "Me gusta la pizza" → 2 gems
    tests.push(await this.runTest('Me gusta la pizza vocabulary recognition', async () => {
      const result = await this.sentenceGameService.processSentenceAttempt({
        sessionId: this.testSessionId,
        gameType: 'test_sentence_game',
        originalSentence: 'Me gusta la pizza',
        language: 'es',
        isCorrect: true,
        responseTimeMs: 3000,
        hintUsed: false,
        gameMode: 'translation'
      });

      if (result.totalGems < 2) {
        throw new Error(`Expected at least 2 gems, got ${result.totalGems}`);
      }

      return {
        vocabularyMatches: result.vocabularyMatches.length,
        gemsAwarded: result.totalGems,
        xpEarned: result.totalXP,
        coverage: result.coveragePercentage
      };
    }));

    // Test 2: French MWE recognition
    tests.push(await this.runTest('French MWE recognition', async () => {
      const result = await this.sentenceGameService.processSentenceAttempt({
        sessionId: this.testSessionId,
        gameType: 'test_sentence_game',
        originalSentence: 'Il y a beaucoup de travail',
        language: 'fr',
        isCorrect: true,
        responseTimeMs: 2500,
        hintUsed: false,
        gameMode: 'listening'
      });

      return {
        vocabularyMatches: result.vocabularyMatches.length,
        gemsAwarded: result.totalGems,
        coverage: result.coveragePercentage
      };
    }));

    // Test 3: German sentence processing
    tests.push(await this.runTest('German sentence processing', async () => {
      const result = await this.sentenceGameService.processSentenceAttempt({
        sessionId: this.testSessionId,
        gameType: 'test_sentence_game',
        originalSentence: 'Ich habe Hausaufgaben gemacht',
        language: 'de',
        isCorrect: true,
        responseTimeMs: 4000,
        hintUsed: false,
        gameMode: 'dictation'
      });

      return {
        vocabularyMatches: result.vocabularyMatches.length,
        gemsAwarded: result.totalGems,
        coverage: result.coveragePercentage
      };
    }));

    // Test 4: Batch processing
    tests.push(await this.runTest('Batch sentence processing', async () => {
      const sentences = [
        { sentence: 'Me gusta la pizza', isCorrect: true, responseTimeMs: 3000 },
        { sentence: 'Tengo que estudiar', isCorrect: true, responseTimeMs: 2500 },
        { sentence: 'Por favor ayúdame', isCorrect: true, responseTimeMs: 4000 }
      ];

      const attempts = sentences.map(s => ({
        sessionId: this.testSessionId,
        gameType: 'batch_test',
        originalSentence: s.sentence,
        language: 'es',
        isCorrect: s.isCorrect,
        responseTimeMs: s.responseTimeMs,
        hintUsed: false,
        gameMode: 'translation' as const,
        difficultyLevel: 'intermediate' as const
      }));

      const batchResult = await this.sentenceGameService.processBatchSentences(attempts);

      return {
        sentencesProcessed: batchResult.results.length,
        totalGems: batchResult.summary.totalGems,
        totalXP: batchResult.summary.totalXP,
        uniqueVocabulary: batchResult.summary.uniqueVocabulary
      };
    }));

    // Test 5: Performance test
    tests.push(await this.runTest('Sentence processing performance', async () => {
      const startTime = Date.now();
      
      await this.sentenceGameService.processSentenceAttempt({
        sessionId: this.testSessionId,
        gameType: 'performance_test',
        originalSentence: 'Me gusta la pizza',
        language: 'es',
        isCorrect: true,
        responseTimeMs: 3000,
        hintUsed: false,
        gameMode: 'translation'
      });

      const processingTime = Date.now() - startTime;
      
      if (processingTime > 500) {
        throw new Error(`Processing took ${processingTime}ms, expected <500ms`);
      }

      return { processingTime };
    }));

    const totalDuration = tests.reduce((sum, test) => sum + test.duration, 0);
    const passedCount = tests.filter(test => test.passed).length;
    const failedCount = tests.length - passedCount;

    return {
      name: 'Sentence Games',
      tests,
      totalDuration,
      passedCount,
      failedCount
    };
  }

  async runConjugationDuelTests(): Promise<TestSuite> {
    console.log('⚔️ Running Conjugation Duel Integration Tests...\n');
    
    const tests: TestResult[] = [];

    // Test 1: Verb selection from database
    tests.push(await this.runTest('Spanish verb selection from database', async () => {
      const verbs = await this.conjugationService.getAvailableVerbs('es', 'beginner', 10);
      
      if (verbs.length === 0) {
        throw new Error('No Spanish verbs found in database');
      }

      return {
        verbsFound: verbs.length,
        sampleVerb: verbs[0]?.infinitive,
        verbTypes: [...new Set(verbs.map(v => v.verbType))]
      };
    }));

    // Test 2: Conjugation generation
    tests.push(await this.runTest('Spanish conjugation generation', async () => {
      const testVerb = { id: 'test-hablar', infinitive: 'hablar', translation: 'to speak' };
      
      const challenge = await this.conjugationService.generateChallenge(
        testVerb,
        'es',
        'present',
        0 // yo form
      );

      if (challenge.expectedAnswer !== 'hablo') {
        throw new Error(`Expected "hablo", got "${challenge.expectedAnswer}"`);
      }

      return {
        infinitive: challenge.infinitive,
        person: challenge.person,
        conjugation: challenge.expectedAnswer,
        verbType: challenge.verbType
      };
    }));

    // Test 3: Irregular verb handling
    tests.push(await this.runTest('Irregular verb conjugation', async () => {
      const testVerb = { id: 'test-ser', infinitive: 'ser', translation: 'to be' };
      
      const challenge = await this.conjugationService.generateChallenge(
        testVerb,
        'es',
        'present',
        0 // yo form
      );

      if (challenge.expectedAnswer !== 'soy') {
        throw new Error(`Expected "soy", got "${challenge.expectedAnswer}"`);
      }

      return {
        infinitive: challenge.infinitive,
        conjugation: challenge.expectedAnswer,
        verbType: challenge.verbType,
        difficulty: challenge.difficulty
      };
    }));

    // Test 4: Answer validation and gem awarding
    tests.push(await this.runTest('Answer validation and gem awarding', async () => {
      const testVerb = { id: 'test-comer', infinitive: 'comer', translation: 'to eat' };
      
      const challenge = await this.conjugationService.generateChallenge(
        testVerb,
        'es',
        'present',
        1 // tú form
      );

      const result = await this.conjugationService.validateAttempt(
        {
          sessionId: this.testSessionId,
          challengeId: challenge.id,
          studentAnswer: challenge.expectedAnswer, // Correct answer
          responseTimeMs: 2500,
          hintUsed: false
        },
        challenge
      );

      if (!result.isCorrect) {
        throw new Error('Correct answer was marked as incorrect');
      }

      if (!result.gemAwarded) {
        throw new Error('No gem awarded for correct answer');
      }

      return {
        isCorrect: result.isCorrect,
        gemRarity: result.gemAwarded.rarity,
        xpAwarded: result.gemAwarded.xpValue,
        fsrsUpdated: result.fsrsUpdated
      };
    }));

    // Test 5: Complete duel session
    tests.push(await this.runTest('Complete duel session generation', async () => {
      const config = {
        language: 'es' as const,
        tenses: ['present'],
        difficulty: 'mixed' as const,
        verbTypes: ['regular', 'irregular'] as const,
        challengeCount: 5,
        timeLimit: 15
      };

      const challenges = await this.conjugationService.generateDuelSession(config);

      if (challenges.length !== 5) {
        throw new Error(`Expected 5 challenges, got ${challenges.length}`);
      }

      return {
        challengeCount: challenges.length,
        verbs: challenges.map(c => c.infinitive),
        conjugations: challenges.map(c => `${c.person} → ${c.expectedAnswer}`)
      };
    }));

    // Test 6: Multi-language support
    tests.push(await this.runTest('Multi-language support', async () => {
      const languages = ['es', 'fr', 'de'] as const;
      const results = [];

      for (const language of languages) {
        const verbs = await this.conjugationService.getAvailableVerbs(language, 'beginner', 1);
        
        if (verbs.length > 0) {
          const challenge = await this.conjugationService.generateChallenge(
            verbs[0],
            language,
            'present',
            0
          );

          results.push({
            language,
            verb: challenge.infinitive,
            conjugation: challenge.expectedAnswer
          });
        }
      }

      return { languageResults: results };
    }));

    // Test 7: Performance test
    tests.push(await this.runTest('Conjugation generation performance', async () => {
      const testVerb = { id: 'test-performance', infinitive: 'estudiar', translation: 'to study' };
      const startTime = Date.now();

      await this.conjugationService.generateChallenge(
        testVerb,
        'es',
        'present',
        0
      );

      const generationTime = Date.now() - startTime;

      if (generationTime > 200) {
        throw new Error(`Generation took ${generationTime}ms, expected <200ms`);
      }

      return { generationTime };
    }));

    const totalDuration = tests.reduce((sum, test) => sum + test.duration, 0);
    const passedCount = tests.filter(test => test.passed).length;
    const failedCount = tests.length - passedCount;

    return {
      name: 'Conjugation Duel',
      tests,
      totalDuration,
      passedCount,
      failedCount
    };
  }

  async cleanup(): Promise<void> {
    try {
      await this.supabase
        .from('game_sessions')
        .delete()
        .eq('session_id', this.testSessionId);
    } catch (error) {
      console.warn('Cleanup warning:', error);
    }
  }

  printResults(suites: TestSuite[]): void {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 INTEGRATION TEST RESULTS');
    console.log('='.repeat(80));

    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalDuration = 0;

    suites.forEach(suite => {
      console.log(`\n📊 ${suite.name} Test Suite:`);
      console.log(`   Tests: ${suite.tests.length}`);
      console.log(`   Passed: ${suite.passedCount}`);
      console.log(`   Failed: ${suite.failedCount}`);
      console.log(`   Duration: ${suite.totalDuration}ms`);

      suite.tests.forEach(test => {
        const status = test.passed ? '✅' : '❌';
        console.log(`   ${status} ${test.name} (${test.duration}ms)`);
        
        if (test.passed && test.details) {
          Object.entries(test.details).forEach(([key, value]) => {
            console.log(`      ${key}: ${JSON.stringify(value)}`);
          });
        }
        
        if (!test.passed && test.error) {
          console.log(`      Error: ${test.error}`);
        }
      });

      totalTests += suite.tests.length;
      totalPassed += suite.passedCount;
      totalFailed += suite.failedCount;
      totalDuration += suite.totalDuration;
    });

    console.log('\n' + '='.repeat(80));
    console.log('📈 OVERALL SUMMARY:');
    console.log(`   Total Tests: ${totalTests}`);
    console.log(`   Passed: ${totalPassed} (${Math.round((totalPassed/totalTests)*100)}%)`);
    console.log(`   Failed: ${totalFailed} (${Math.round((totalFailed/totalTests)*100)}%)`);
    console.log(`   Total Duration: ${totalDuration}ms`);
    
    if (totalFailed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! Integration is successful! 🚀');
    } else {
      console.log(`\n⚠️  ${totalFailed} test(s) failed. Please review and fix issues.`);
    }
    
    console.log('='.repeat(80));
  }

  async run(): Promise<void> {
    console.log('🚀 Starting Comprehensive Integration Tests...\n');

    try {
      const sentenceGameSuite = await this.runSentenceGameTests();
      const conjugationDuelSuite = await this.runConjugationDuelTests();

      this.printResults([sentenceGameSuite, conjugationDuelSuite]);

    } catch (error) {
      console.error('❌ Integration test runner failed:', error);
    } finally {
      await this.cleanup();
    }
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  const runner = new IntegrationTestRunner();
  runner.run().catch(console.error);
}

export { IntegrationTestRunner };

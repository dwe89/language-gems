/**
 * Comprehensive Integration Tests - Sentence Games
 * 
 * Tests the complete integration of sentence games with vocabulary tracking:
 * - Case File Translator
 * - Lava Temple Word Restore  
 * - Speed Builder (Sentence Sprint)
 * 
 * Validates that "Me gusta la pizza" awards 2 gems for "me gusta" and "la pizza"
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import { SentenceGameService } from '../../src/services/SentenceGameService';
import { MWEVocabularyTrackingService } from '../../src/services/MWEVocabularyTrackingService';

// Test configuration
const TEST_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const TEST_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

describe('Sentence Games Integration Tests', () => {
  let supabase: any;
  let sentenceGameService: SentenceGameService;
  let mweService: MWEVocabularyTrackingService;
  let testSessionId: string;

  beforeEach(async () => {
    supabase = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);
    sentenceGameService = new SentenceGameService(supabase);
    mweService = new MWEVocabularyTrackingService(supabase);
    testSessionId = `test-session-${Date.now()}`;
  });

  afterEach(async () => {
    // Cleanup test data
    try {
      await supabase
        .from('game_sessions')
        .delete()
        .eq('session_id', testSessionId);
    } catch (error) {
      console.warn('Cleanup warning:', error);
    }
  });

  describe('Core Vocabulary Recognition', () => {
    it('should recognize "Me gusta la pizza" and award 2 gems', async () => {
      const sentence = 'Me gusta la pizza';
      const language = 'es';

      // Process the sentence
      const result = await sentenceGameService.processSentenceAttempt({
        sessionId: testSessionId,
        gameType: 'test_sentence_game',
        originalSentence: sentence,
        language,
        isCorrect: true,
        responseTimeMs: 3000,
        hintUsed: false,
        gameMode: 'translation'
      });

      // Validate results
      expect(result).toBeDefined();
      expect(result.vocabularyMatches.length).toBeGreaterThanOrEqual(2);
      expect(result.gemsAwarded.length).toBeGreaterThanOrEqual(2);
      expect(result.totalGems).toBeGreaterThanOrEqual(2);
      expect(result.totalXP).toBeGreaterThan(0);

      // Check for specific vocabulary matches
      const matchedWords = result.vocabularyMatches.map(m => m.word.toLowerCase());
      expect(matchedWords).toContain('me gusta');
      expect(matchedWords).toContain('la pizza');

      // Validate gem awards
      const awardedWords = result.gemsAwarded.map(g => g.word.toLowerCase());
      expect(awardedWords).toContain('me gusta');
      expect(awardedWords).toContain('la pizza');

      console.log('✅ "Me gusta la pizza" test passed:');
      console.log(`   Vocabulary matches: ${result.vocabularyMatches.length}`);
      console.log(`   Gems awarded: ${result.totalGems}`);
      console.log(`   XP earned: ${result.totalXP}`);
      console.log(`   Coverage: ${result.coveragePercentage}%`);
    });

    it('should handle French MWEs correctly', async () => {
      const sentence = 'Il y a beaucoup de travail';
      const language = 'fr';

      const result = await sentenceGameService.processSentenceAttempt({
        sessionId: testSessionId,
        gameType: 'test_sentence_game',
        originalSentence: sentence,
        language,
        isCorrect: true,
        responseTimeMs: 2500,
        hintUsed: false,
        gameMode: 'listening'
      });

      expect(result).toBeDefined();
      expect(result.vocabularyMatches.length).toBeGreaterThan(0);
      
      // Check for "il y a" MWE
      const matchedWords = result.vocabularyMatches.map(m => m.word.toLowerCase());
      const hasIlYA = matchedWords.some(word => word.includes('il y a'));
      
      if (hasIlYA) {
        expect(result.gemsAwarded.length).toBeGreaterThan(0);
        console.log('✅ French MWE "il y a" recognized and rewarded');
      }

      console.log(`French sentence processed: ${result.vocabularyMatches.length} matches, ${result.totalGems} gems`);
    });

    it('should handle German compound words correctly', async () => {
      const sentence = 'Ich habe Hausaufgaben gemacht';
      const language = 'de';

      const result = await sentenceGameService.processSentenceAttempt({
        sessionId: testSessionId,
        gameType: 'test_sentence_game',
        originalSentence: sentence,
        language,
        isCorrect: true,
        responseTimeMs: 4000,
        hintUsed: false,
        gameMode: 'dictation'
      });

      expect(result).toBeDefined();
      expect(result.vocabularyMatches.length).toBeGreaterThan(0);
      
      console.log(`German sentence processed: ${result.vocabularyMatches.length} matches, ${result.totalGems} gems`);
    });
  });

  describe('Game-Specific Integration', () => {
    it('should process Case File Translator sentences correctly', async () => {
      const sentence = 'Tengo que estudiar mucho';
      
      const result = await sentenceGameService.processSentenceAttempt({
        sessionId: testSessionId,
        gameType: 'case_file_translator',
        originalSentence: sentence,
        language: 'es',
        isCorrect: true,
        responseTimeMs: 5000,
        hintUsed: false,
        gameMode: 'translation',
        difficultyLevel: 'intermediate'
      });

      expect(result).toBeDefined();
      expect(result.vocabularyMatches.length).toBeGreaterThan(0);
      
      // Check for "tengo que" MWE
      const matchedWords = result.vocabularyMatches.map(m => m.word.toLowerCase());
      const hasTengoQue = matchedWords.some(word => word.includes('tengo que'));
      
      if (hasTengoQue) {
        console.log('✅ Case File Translator: "tengo que" MWE recognized');
      }
    });

    it('should process Lava Temple dictation correctly', async () => {
      const sentence = 'Por favor ayúdame';
      
      const result = await sentenceGameService.processSentenceAttempt({
        sessionId: testSessionId,
        gameType: 'lava_temple_word_restore',
        originalSentence: sentence,
        language: 'es',
        isCorrect: true,
        responseTimeMs: 3500,
        hintUsed: true, // Temple context counts as hint
        gameMode: 'dictation',
        difficultyLevel: 'advanced'
      });

      expect(result).toBeDefined();
      expect(result.vocabularyMatches.length).toBeGreaterThan(0);
      
      // Check for "por favor" MWE
      const matchedWords = result.vocabularyMatches.map(m => m.word.toLowerCase());
      const hasPorFavor = matchedWords.some(word => word.includes('por favor'));
      
      if (hasPorFavor) {
        console.log('✅ Lava Temple: "por favor" MWE recognized');
      }
    });

    it('should process Speed Builder sentence completion correctly', async () => {
      const sentence = 'Voy a la escuela';
      
      const result = await sentenceGameService.processSentenceAttempt({
        sessionId: testSessionId,
        gameType: 'sentence_sprint',
        originalSentence: sentence,
        language: 'es',
        isCorrect: true,
        responseTimeMs: 2000, // Fast completion
        hintUsed: false,
        gameMode: 'completion',
        difficultyLevel: 'beginner'
      });

      expect(result).toBeDefined();
      expect(result.vocabularyMatches.length).toBeGreaterThan(0);
      
      // Check for "voy a" MWE
      const matchedWords = result.vocabularyMatches.map(m => m.word.toLowerCase());
      const hasVoyA = matchedWords.some(word => word.includes('voy a'));
      
      if (hasVoyA) {
        console.log('✅ Speed Builder: "voy a" MWE recognized');
      }
    });
  });

  describe('Batch Processing', () => {
    it('should process multiple sentences efficiently', async () => {
      const sentences = [
        { sentence: 'Me gusta la pizza', isCorrect: true, responseTimeMs: 3000 },
        { sentence: 'Tengo que estudiar', isCorrect: true, responseTimeMs: 2500 },
        { sentence: 'Por favor ayúdame', isCorrect: true, responseTimeMs: 4000 },
        { sentence: 'Voy a la escuela', isCorrect: true, responseTimeMs: 2000 }
      ];

      const attempts = sentences.map(s => ({
        sessionId: testSessionId,
        gameType: 'batch_test',
        originalSentence: s.sentence,
        language: 'es',
        isCorrect: s.isCorrect,
        responseTimeMs: s.responseTimeMs,
        hintUsed: false,
        gameMode: 'translation' as const,
        difficultyLevel: 'intermediate' as const
      }));

      const batchResult = await sentenceGameService.processBatchSentences(attempts);

      expect(batchResult).toBeDefined();
      expect(batchResult.results.length).toBe(4);
      expect(batchResult.summary.totalGems).toBeGreaterThan(0);
      expect(batchResult.summary.totalXP).toBeGreaterThan(0);
      expect(batchResult.summary.uniqueVocabulary).toBeGreaterThan(0);

      console.log('✅ Batch processing test passed:');
      console.log(`   Sentences processed: ${batchResult.results.length}`);
      console.log(`   Total gems: ${batchResult.summary.totalGems}`);
      console.log(`   Total XP: ${batchResult.summary.totalXP}`);
      console.log(`   Unique vocabulary: ${batchResult.summary.uniqueVocabulary}`);
      console.log(`   Average coverage: ${Math.round(batchResult.summary.averageCoverage)}%`);
    });
  });

  describe('Performance Tests', () => {
    it('should process sentences within 500ms', async () => {
      const sentence = 'Me gusta la pizza';
      const startTime = Date.now();

      const result = await sentenceGameService.processSentenceAttempt({
        sessionId: testSessionId,
        gameType: 'performance_test',
        originalSentence: sentence,
        language: 'es',
        isCorrect: true,
        responseTimeMs: 3000,
        hintUsed: false,
        gameMode: 'translation'
      });

      const processingTime = Date.now() - startTime;

      expect(result).toBeDefined();
      expect(processingTime).toBeLessThan(500);

      console.log(`✅ Performance test passed: ${processingTime}ms processing time`);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid sentences gracefully', async () => {
      const sentence = ''; // Empty sentence

      const result = await sentenceGameService.processSentenceAttempt({
        sessionId: testSessionId,
        gameType: 'error_test',
        originalSentence: sentence,
        language: 'es',
        isCorrect: false,
        responseTimeMs: 1000,
        hintUsed: false,
        gameMode: 'translation'
      });

      expect(result).toBeDefined();
      expect(result.vocabularyMatches.length).toBe(0);
      expect(result.totalGems).toBe(0);

      console.log('✅ Error handling test passed: empty sentence handled gracefully');
    });

    it('should handle incorrect answers appropriately', async () => {
      const sentence = 'Me gusta la pizza';

      const result = await sentenceGameService.processSentenceAttempt({
        sessionId: testSessionId,
        gameType: 'incorrect_test',
        originalSentence: sentence,
        language: 'es',
        isCorrect: false, // Incorrect answer
        responseTimeMs: 3000,
        hintUsed: false,
        gameMode: 'translation'
      });

      expect(result).toBeDefined();
      // Should still parse vocabulary but not award gems for incorrect answers
      expect(result.totalGems).toBe(0);
      expect(result.gemsAwarded.length).toBe(0);

      console.log('✅ Incorrect answer test passed: no gems awarded for wrong answers');
    });
  });
});

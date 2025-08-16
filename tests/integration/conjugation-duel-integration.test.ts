/**
 * Comprehensive Integration Tests - Conjugation Duel
 * 
 * Tests the complete integration of conjugation duel system:
 * - Verb selection from centralized_vocabulary
 * - Conjugation generation and validation
 * - Gem awarding and FSRS tracking
 * - Multi-language support (Spanish, French, German)
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { createClient } from '@supabase/supabase-js';
import { ConjugationDuelService } from '../../src/services/ConjugationDuelService';

// Test configuration
const TEST_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const TEST_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

describe('Conjugation Duel Integration Tests', () => {
  let supabase: any;
  let conjugationService: ConjugationDuelService;
  let testSessionId: string;

  beforeEach(async () => {
    supabase = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY);
    conjugationService = new ConjugationDuelService(supabase);
    testSessionId = `test-conjugation-${Date.now()}`;
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

  describe('Verb Selection from Database', () => {
    it('should fetch Spanish verbs from centralized_vocabulary', async () => {
      const verbs = await conjugationService.getAvailableVerbs('es', 'beginner', 10);

      expect(verbs).toBeDefined();
      expect(verbs.length).toBeGreaterThan(0);
      expect(verbs.length).toBeLessThanOrEqual(10);

      // Validate verb structure
      verbs.forEach(verb => {
        expect(verb.id).toBeDefined();
        expect(verb.infinitive).toBeDefined();
        expect(verb.translation).toBeDefined();
        expect(verb.verbType).toMatch(/^(regular|irregular|stem_changing)$/);
        expect(verb.difficulty).toMatch(/^(beginner|intermediate|advanced)$/);
        
        // Spanish verbs should end in -ar, -er, or -ir
        expect(verb.infinitive).toMatch(/^.+(ar|er|ir)$/);
      });

      console.log(`✅ Spanish verbs fetched: ${verbs.length} verbs`);
      console.log(`   Sample: ${verbs[0]?.infinitive} (${verbs[0]?.verbType})`);
    });

    it('should fetch French verbs from centralized_vocabulary', async () => {
      const verbs = await conjugationService.getAvailableVerbs('fr', 'intermediate', 10);

      expect(verbs).toBeDefined();
      expect(verbs.length).toBeGreaterThan(0);

      // French verbs should end in -er, -ir, or -re
      verbs.forEach(verb => {
        expect(verb.infinitive).toMatch(/^.+(er|ir|re)$/);
      });

      console.log(`✅ French verbs fetched: ${verbs.length} verbs`);
    });

    it('should fetch German verbs from centralized_vocabulary', async () => {
      const verbs = await conjugationService.getAvailableVerbs('de', 'advanced', 10);

      expect(verbs).toBeDefined();
      expect(verbs.length).toBeGreaterThan(0);

      // German verbs should end in -en
      verbs.forEach(verb => {
        expect(verb.infinitive).toMatch(/^.+en$/);
      });

      console.log(`✅ German verbs fetched: ${verbs.length} verbs`);
    });
  });

  describe('Conjugation Generation', () => {
    it('should generate Spanish present tense conjugations correctly', async () => {
      const testVerb = { id: 'test-hablar', infinitive: 'hablar', translation: 'to speak' };
      
      const challenge = await conjugationService.generateChallenge(
        testVerb,
        'es',
        'present',
        0 // yo form
      );

      expect(challenge).toBeDefined();
      expect(challenge.infinitive).toBe('hablar');
      expect(challenge.language).toBe('es');
      expect(challenge.tense).toBe('present');
      expect(challenge.person).toBe('yo');
      expect(challenge.expectedAnswer).toBe('hablo'); // Regular -ar verb conjugation
      expect(challenge.verbType).toBe('regular');

      console.log(`✅ Spanish conjugation: ${challenge.person} ${challenge.infinitive} → ${challenge.expectedAnswer}`);
    });

    it('should handle irregular Spanish verbs correctly', async () => {
      const testVerb = { id: 'test-ser', infinitive: 'ser', translation: 'to be' };
      
      const challenge = await conjugationService.generateChallenge(
        testVerb,
        'es',
        'present',
        0 // yo form
      );

      expect(challenge).toBeDefined();
      expect(challenge.infinitive).toBe('ser');
      expect(challenge.expectedAnswer).toBe('soy'); // Irregular conjugation
      expect(challenge.verbType).toBe('irregular');
      expect(challenge.difficulty).toBe('advanced');

      console.log(`✅ Spanish irregular: ${challenge.person} ${challenge.infinitive} → ${challenge.expectedAnswer}`);
    });

    it('should generate French present tense conjugations correctly', async () => {
      const testVerb = { id: 'test-parler', infinitive: 'parler', translation: 'to speak' };
      
      const challenge = await conjugationService.generateChallenge(
        testVerb,
        'fr',
        'present',
        0 // je form
      );

      expect(challenge).toBeDefined();
      expect(challenge.infinitive).toBe('parler');
      expect(challenge.language).toBe('fr');
      expect(challenge.person).toBe('je');
      expect(challenge.expectedAnswer).toBe('parle'); // Regular -er verb conjugation

      console.log(`✅ French conjugation: ${challenge.person} ${challenge.infinitive} → ${challenge.expectedAnswer}`);
    });

    it('should generate German present tense conjugations correctly', async () => {
      const testVerb = { id: 'test-sprechen', infinitive: 'sprechen', translation: 'to speak' };
      
      const challenge = await conjugationService.generateChallenge(
        testVerb,
        'de',
        'present',
        0 // ich form
      );

      expect(challenge).toBeDefined();
      expect(challenge.infinitive).toBe('sprechen');
      expect(challenge.language).toBe('de');
      expect(challenge.person).toBe('ich');
      expect(challenge.expectedAnswer).toBe('spreche'); // Regular German conjugation

      console.log(`✅ German conjugation: ${challenge.person} ${challenge.infinitive} → ${challenge.expectedAnswer}`);
    });
  });

  describe('Answer Validation and Gem Awarding', () => {
    it('should validate correct answers and award gems', async () => {
      const testVerb = { id: 'test-comer', infinitive: 'comer', translation: 'to eat' };
      
      const challenge = await conjugationService.generateChallenge(
        testVerb,
        'es',
        'present',
        1 // tú form
      );

      const result = await conjugationService.validateAttempt(
        {
          sessionId: testSessionId,
          challengeId: challenge.id,
          studentAnswer: 'comes', // Correct answer
          responseTimeMs: 2500,
          hintUsed: false
        },
        challenge
      );

      expect(result).toBeDefined();
      expect(result.isCorrect).toBe(true);
      expect(result.expectedAnswer).toBe('comes');
      expect(result.gemAwarded).toBeDefined();
      expect(result.gemAwarded?.rarity).toBeDefined();
      expect(result.gemAwarded?.xpValue).toBeGreaterThan(0);
      expect(result.fsrsUpdated).toBe(true);

      console.log(`✅ Correct answer validated: ${result.gemAwarded?.rarity} gem (+${result.gemAwarded?.xpValue} XP)`);
    });

    it('should handle incorrect answers appropriately', async () => {
      const testVerb = { id: 'test-vivir', infinitive: 'vivir', translation: 'to live' };
      
      const challenge = await conjugationService.generateChallenge(
        testVerb,
        'es',
        'present',
        2 // él/ella form
      );

      const result = await conjugationService.validateAttempt(
        {
          sessionId: testSessionId,
          challengeId: challenge.id,
          studentAnswer: 'vivo', // Incorrect answer (should be 'vive')
          responseTimeMs: 3000,
          hintUsed: false
        },
        challenge
      );

      expect(result).toBeDefined();
      expect(result.isCorrect).toBe(false);
      expect(result.expectedAnswer).toBe('vive');
      expect(result.gemAwarded).toBeUndefined(); // No gem for incorrect answer

      console.log(`✅ Incorrect answer handled: expected "${result.expectedAnswer}", got "vivo"`);
    });

    it('should award higher rarity gems for difficult verbs', async () => {
      const testVerb = { id: 'test-tener', infinitive: 'tener', translation: 'to have' };
      
      const challenge = await conjugationService.generateChallenge(
        testVerb,
        'es',
        'present',
        0 // yo form
      );

      const result = await conjugationService.validateAttempt(
        {
          sessionId: testSessionId,
          challengeId: challenge.id,
          studentAnswer: 'tengo', // Correct irregular conjugation
          responseTimeMs: 1500, // Fast response
          hintUsed: false
        },
        challenge
      );

      expect(result).toBeDefined();
      expect(result.isCorrect).toBe(true);
      expect(result.gemAwarded).toBeDefined();
      
      // Irregular verbs should award higher rarity gems
      const rarity = result.gemAwarded?.rarity;
      expect(['rare', 'epic', 'legendary']).toContain(rarity);

      console.log(`✅ Irregular verb gem: ${rarity} for "tener" conjugation`);
    });
  });

  describe('Complete Duel Session', () => {
    it('should generate a complete duel session', async () => {
      const config = {
        language: 'es' as const,
        tenses: ['present'],
        difficulty: 'mixed' as const,
        verbTypes: ['regular', 'irregular'] as const,
        challengeCount: 5,
        timeLimit: 15
      };

      const challenges = await conjugationService.generateDuelSession(config);

      expect(challenges).toBeDefined();
      expect(challenges.length).toBe(5);

      // Validate each challenge
      challenges.forEach((challenge, index) => {
        expect(challenge.id).toBeDefined();
        expect(challenge.infinitive).toBeDefined();
        expect(challenge.expectedAnswer).toBeDefined();
        expect(challenge.language).toBe('es');
        expect(challenge.tense).toBe('present');
        
        console.log(`   Challenge ${index + 1}: ${challenge.person} ${challenge.infinitive} → ${challenge.expectedAnswer}`);
      });

      console.log(`✅ Complete duel session generated: ${challenges.length} challenges`);
    });
  });

  describe('Performance Tests', () => {
    it('should generate conjugations within 200ms', async () => {
      const testVerb = { id: 'test-performance', infinitive: 'estudiar', translation: 'to study' };
      const startTime = Date.now();

      const challenge = await conjugationService.generateChallenge(
        testVerb,
        'es',
        'present',
        0
      );

      const generationTime = Date.now() - startTime;

      expect(challenge).toBeDefined();
      expect(generationTime).toBeLessThan(200);

      console.log(`✅ Performance test passed: ${generationTime}ms generation time`);
    });

    it('should validate answers within 100ms', async () => {
      const testVerb = { id: 'test-validation', infinitive: 'trabajar', translation: 'to work' };
      
      const challenge = await conjugationService.generateChallenge(
        testVerb,
        'es',
        'present',
        0
      );

      const startTime = Date.now();

      const result = await conjugationService.validateAttempt(
        {
          sessionId: testSessionId,
          challengeId: challenge.id,
          studentAnswer: challenge.expectedAnswer,
          responseTimeMs: 2000,
          hintUsed: false
        },
        challenge
      );

      const validationTime = Date.now() - startTime;

      expect(result).toBeDefined();
      expect(validationTime).toBeLessThan(100);

      console.log(`✅ Validation performance test passed: ${validationTime}ms validation time`);
    });
  });

  describe('Multi-Language Support', () => {
    it('should handle all three languages in one session', async () => {
      const languages = ['es', 'fr', 'de'] as const;
      const results = [];

      for (const language of languages) {
        const verbs = await conjugationService.getAvailableVerbs(language, 'beginner', 1);
        
        if (verbs.length > 0) {
          const challenge = await conjugationService.generateChallenge(
            verbs[0],
            language,
            'present',
            0
          );

          const result = await conjugationService.validateAttempt(
            {
              sessionId: testSessionId,
              challengeId: challenge.id,
              studentAnswer: challenge.expectedAnswer,
              responseTimeMs: 2500,
              hintUsed: false
            },
            challenge
          );

          results.push({
            language,
            verb: challenge.infinitive,
            conjugation: challenge.expectedAnswer,
            correct: result.isCorrect
          });
        }
      }

      expect(results.length).toBeGreaterThan(0);
      results.forEach(result => {
        expect(result.correct).toBe(true);
      });

      console.log('✅ Multi-language test passed:');
      results.forEach(result => {
        console.log(`   ${result.language.toUpperCase()}: ${result.verb} → ${result.conjugation}`);
      });
    });
  });
});

/**
 * Conjugation Duel Service
 * 
 * Complete conjugation game system using our clean infinitive verbs from centralized_vocabulary.
 * Handles verb selection, conjugation generation, answer validation, and gem/FSRS tracking.
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { EnhancedGameSessionService, WordAttempt } from './rewards/EnhancedGameSessionService';
import { FSRSService } from './fsrsService';
import { LemmatizationService } from './LemmatizationService';
import { RewardEngine, GemEvent, PerformanceContext } from './rewards/RewardEngine';

export interface ConjugationChallenge {
  id: string;
  infinitive: string;
  translation: string;
  language: string;
  tense: string;
  person: string;
  number: 'singular' | 'plural';
  expectedAnswer: string;
  alternativeAnswers?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  verbType: 'regular' | 'irregular' | 'stem_changing';
}

export interface ConjugationAttempt {
  sessionId: string;
  challengeId: string;
  studentAnswer: string;
  responseTimeMs: number;
  hintUsed: boolean;
  isCorrect?: boolean; // Will be calculated
}

export interface ConjugationResult {
  isCorrect: boolean;
  expectedAnswer: string;
  alternativeAnswers: string[];
  explanation?: string;
  gemAwarded?: {
    rarity: string;
    xpValue: number;
  };
  fsrsUpdated: boolean;
  streakCount: number;
}

export interface DuelConfiguration {
  language: 'es' | 'fr' | 'de';
  tenses: string[];
  persons?: string[]; // Array of persons to practice (yo, tu, el_ella_usted, etc.)
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  verbTypes: ('regular' | 'irregular' | 'stem_changing')[];
  challengeCount: number;
  timeLimit?: number; // seconds per challenge
  assignmentVocabulary?: { id: string; word: string; translation: string; part_of_speech: string }[]; // Assignment vocabulary with UUIDs
}

export class ConjugationDuelService {
  private supabase: SupabaseClient;
  private sessionService: EnhancedGameSessionService;
  private fsrsService: FSRSService;
  private lemmatizationService: LemmatizationService;

  // Conjugation patterns for each language
  private conjugationPatterns = {
    es: {
      present: {
        regular: {
          ar: ['o', 'as', 'a', 'amos', 'áis', 'an'],
          er: ['o', 'es', 'e', 'emos', 'éis', 'en'],
          ir: ['o', 'es', 'e', 'imos', 'ís', 'en']
        },
        irregular: {
          'ser': ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
          'estar': ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
          'tener': ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'],
          'hacer': ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen'],
          'ir': ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
          'venir': ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen']
        },
        stem_changing: {
          'e_ie': ['prefiero', 'prefieres', 'prefiere', 'preferimos', 'preferís', 'prefieren'], // preferir
          'o_ue': ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden'], // poder
          'e_i': ['pido', 'pides', 'pide', 'pedimos', 'pedís', 'piden'] // pedir
        }
      },
      preterite: {
        regular: {
          ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'],
          er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
          ir: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron']
        },
        irregular: {
          'ser': ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
          'ir': ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
          'tener': ['tuve', 'tuviste', 'tuvo', 'tuvimos', 'tuvisteis', 'tuvieron'],
          'hacer': ['hice', 'hiciste', 'hizo', 'hicimos', 'hicisteis', 'hicieron']
        }
      }
    },
    fr: {
      present: {
        regular: {
          er: ['e', 'es', 'e', 'ons', 'ez', 'ent'],
          ir: ['is', 'is', 'it', 'issons', 'issez', 'issent'],
          re: ['s', 's', '', 'ons', 'ez', 'ent']
        },
        irregular: {
          'être': ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
          'avoir': ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
          'aller': ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
          'faire': ['fais', 'fais', 'fait', 'faisons', 'faites', 'font']
        }
      }
    },
    de: {
      present: {
        regular: {
          en: ['e', 'st', 't', 'en', 't', 'en']
        },
        irregular: {
          'sein': ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'],
          'haben': ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'],
          'werden': ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden']
        }
      }
    }
  };

  private pronouns = {
    es: ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas'],
    fr: ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'],
    de: ['ich', 'du', 'er/sie', 'wir', 'ihr', 'sie']
  };

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.sessionService = new EnhancedGameSessionService(supabase);
    this.fsrsService = new FSRSService(supabase);
    this.lemmatizationService = new LemmatizationService(supabase);
  }

  /**
   * Get available infinitive verbs for conjugation practice
   */
  async getAvailableVerbs(language: string, difficulty?: string, limit: number = 50): Promise<Array<{
    id: string;
    infinitive: string;
    translation: string;
    verbType: 'regular' | 'irregular' | 'stem_changing';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }>> {
    try {
      let query = this.supabase
        .from('centralized_vocabulary')
        .select('id, word, translation, category')
        .eq('language', language)
        .eq('should_track_for_fsrs', true)
        .not('word', 'like', '%(%') // Exclude any remaining complex formatting
        .not('word', 'like', '%;%')
        .not('word', 'like', '%,%')
        .limit(limit);

      // Filter for verbs based on language-specific patterns
      if (language === 'es') {
        query = query.or('word.like.%ar,word.like.%er,word.like.%ir');
      } else if (language === 'fr') {
        query = query.or('word.like.%er,word.like.%ir,word.like.%re');
      } else if (language === 'de') {
        query = query.like('word', '%en');
      }

      const { data: verbs, error } = await query;

      if (error) throw error;

      return (verbs || []).map(verb => ({
        id: verb.id,
        infinitive: verb.word,
        translation: verb.translation || '',
        verbType: this.determineVerbType(verb.word, language),
        difficulty: this.determineDifficulty(verb.word, language)
      }));

    } catch (error) {
      console.error('Error fetching available verbs:', error);
      return [];
    }
  }

  /**
   * Load conjugation from grammar system
   */
  async loadGrammarConjugation(
    verbId: string,
    tense: string,
    person: string
  ): Promise<string | null> {
    try {
      const { data: conjugation, error } = await this.supabase
        .from('grammar_conjugations')
        .select('conjugated_form')
        .eq('verb_id', verbId)
        .eq('tense', tense)
        .eq('person', person)
        .single();

      if (error) {
        console.warn('⚠️ [CONJUGATION DUEL] No conjugation found in grammar system:', { verbId, tense, person });
        return null;
      }

      return conjugation?.conjugated_form || null;
    } catch (error) {
      console.error('❌ [CONJUGATION DUEL] Error loading conjugation:', error);
      return null;
    }
  }

  /**
   * Generate a conjugation challenge using grammar system
   */
  async generateChallenge(
    verb: { id: string; infinitive: string; translation: string },
    language: string,
    tense: string = 'present',
    personIndex?: number,
    persons?: string[]
  ): Promise<ConjugationChallenge> {
    // Map person names to indices for backward compatibility
    const personMap = ['yo', 'tu', 'el_ella_usted', 'nosotros', 'vosotros', 'ellos_ellas_ustedes'];

    // Select person - use provided persons array if available
    let selectedPersonIndex: number;
    let selectedPersonName: string;

    if (persons && persons.length > 0) {
      // Use one of the specified persons
      const randomPersonName = persons[Math.floor(Math.random() * persons.length)];
      selectedPersonIndex = personMap.indexOf(randomPersonName);
      selectedPersonName = randomPersonName;
    } else if (personIndex !== undefined) {
      // Use provided index
      selectedPersonIndex = personIndex;
      selectedPersonName = personMap[personIndex];
    } else {
      // Random selection
      selectedPersonIndex = Math.floor(Math.random() * 6);
      selectedPersonName = personMap[selectedPersonIndex];
    }

    // Load conjugation from grammar system (no fallback)
    let conjugatedForm = await this.loadGrammarConjugation(verb.id, tense, selectedPersonName);

    if (!conjugatedForm) {
      throw new Error(`❌ [CONJUGATION DUEL] No conjugation found for ${verb.infinitive} (${tense}, ${selectedPersonName}). Grammar system incomplete.`);
    }

    const pronoun = this.pronouns[language as keyof typeof this.pronouns][selectedPersonIndex];
    const verbType = this.determineVerbType(verb.infinitive, language);

    console.log('🎯 [CONJUGATION DUEL] Generated challenge:', {
      verb: verb.infinitive,
      tense,
      person: selectedPersonName,
      conjugatedForm,
      usingGrammarSystem: !!conjugatedForm
    });

    return {
      id: `${verb.id}-${tense}-${selectedPersonIndex}`,
      infinitive: verb.infinitive,
      translation: verb.translation,
      language,
      tense,
      person: pronoun,
      number: selectedPersonIndex < 3 ? 'singular' : 'plural',
      expectedAnswer: conjugatedForm,
      alternativeAnswers: this.getAlternativeAnswers(verb.infinitive, language, tense, selectedPersonIndex),
      difficulty: this.determineDifficulty(verb.infinitive, language),
      verbType
    };
  }

  /**
   * Conjugate a verb for the given parameters
   */
  private conjugateVerb(infinitive: string, language: string, tense: string, personIndex: number): string {
    const patterns = this.conjugationPatterns[language as keyof typeof this.conjugationPatterns];
    
    if (!patterns || !patterns[tense as keyof typeof patterns]) {
      return infinitive; // Fallback
    }

    const tensePatterns = patterns[tense as keyof typeof patterns];

    // Check for irregular verbs first
    if (tensePatterns.irregular && tensePatterns.irregular[infinitive]) {
      return tensePatterns.irregular[infinitive][personIndex];
    }

    // Handle regular verbs
    if (tensePatterns.regular) {
      const ending = this.getVerbEnding(infinitive, language);
      const stem = infinitive.slice(0, -ending.length);
      
      if (tensePatterns.regular[ending]) {
        const conjugationEnding = tensePatterns.regular[ending][personIndex];
        return stem + conjugationEnding;
      }
    }

    // Handle stem-changing verbs (Spanish)
    if (language === 'es' && tensePatterns.stem_changing) {
      const stemChangeType = this.getStemChangeType(infinitive);
      if (stemChangeType && tensePatterns.stem_changing[stemChangeType]) {
        return tensePatterns.stem_changing[stemChangeType][personIndex];
      }
    }

    return infinitive; // Fallback
  }

  /**
   * Validate a conjugation attempt
   */
  async validateAttempt(attempt: ConjugationAttempt, challenge: ConjugationChallenge): Promise<ConjugationResult> {
    const normalizedAnswer = attempt.studentAnswer.toLowerCase().trim();
    const expectedAnswer = challenge.expectedAnswer.toLowerCase();
    const alternativeAnswers = (challenge.alternativeAnswers || []).map(a => a.toLowerCase());
    
    const isCorrect = normalizedAnswer === expectedAnswer || alternativeAnswers.includes(normalizedAnswer);
    
    let gemAwarded;
    let fsrsUpdated = false;
    let streakCount = 0;

    if (isCorrect) {
      try {
        // Find corresponding centralized_vocabulary ID for gem awarding
        const { data: centralizedVocab, error: vocabError } = await this.supabase
          .from('centralized_vocabulary')
          .select('id')
          .eq('word', challenge.infinitive)
          .eq('language', challenge.language)
          .eq('should_track_for_fsrs', true)
          .limit(1)
          .single();

        if (centralizedVocab && !vocabError) {
          // Award gem through session service
          const wordAttempt: WordAttempt = {
            vocabularyId: centralizedVocab.id, // Use centralized vocabulary ID
            wordText: challenge.infinitive,
            translationText: challenge.translation,
            responseTimeMs: attempt.responseTimeMs,
            wasCorrect: true,
            hintUsed: attempt.hintUsed,
            streakCount: 0, // Will be calculated
            masteryLevel: this.getMasteryLevel(challenge.difficulty),
            maxGemRarity: this.getMaxGemRarity(challenge.difficulty, challenge.verbType),
            gameMode: 'conjugation',
            difficultyLevel: challenge.difficulty
          };

          const gemEvent = await this.sessionService.recordWordAttempt(
            attempt.sessionId,
            'conjugation_duel',
            wordAttempt
          );

          if (gemEvent) {
            gemAwarded = {
              rarity: gemEvent.rarity,
              xpValue: gemEvent.xp_value
            };
            streakCount = gemEvent.streak_count || 0;
          }

          // Update FSRS
          try {
            await this.fsrsService.updateProgress(
              attempt.sessionId.split('-')[0], // Extract student ID
              centralizedVocab.id, // Use centralized vocabulary ID
              true,
              attempt.responseTimeMs,
              this.calculateConfidence(attempt, challenge)
            );
            fsrsUpdated = true;
          } catch (fsrsError) {
            console.warn('FSRS update failed:', fsrsError);
          }
        } else {
          console.warn('⚠️ [CONJUGATION DUEL] Could not award gem - centralized vocab not found for:', challenge.infinitive);
        }

      } catch (error) {
        console.error('Error processing correct conjugation attempt:', error);
      }
    }

    return {
      isCorrect,
      expectedAnswer: challenge.expectedAnswer,
      alternativeAnswers: challenge.alternativeAnswers || [],
      explanation: this.generateExplanation(challenge),
      gemAwarded,
      fsrsUpdated,
      streakCount
    };
  }

  /**
   * Load grammar assignment configuration from database
   */
  async loadGrammarAssignmentConfig(assignmentId: string): Promise<any | null> {
    try {
      console.log('🎯 [CONJUGATION DUEL] Loading grammar assignment config for:', assignmentId);

      const { data: grammarAssignment, error } = await this.supabase
        .from('grammar_assignments')
        .select('*')
        .eq('assignment_id', assignmentId)
        .single();

      if (error) {
        console.warn('⚠️ [CONJUGATION DUEL] No grammar assignment found:', error.message);
        return null;
      }

      console.log('✅ [CONJUGATION DUEL] Loaded grammar assignment config:', grammarAssignment);
      return grammarAssignment;

    } catch (error) {
      console.error('❌ [CONJUGATION DUEL] Error loading grammar assignment:', error);
      return null;
    }
  }

  /**
   * Load verbs from the new grammar system
   */
  async loadGrammarVerbs(
    language: string,
    difficulty: string,
    verbTypes: string[],
    count: number
  ): Promise<Array<{ id: string; infinitive: string; translation: string }>> {
    try {
      console.log('🎯 [CONJUGATION DUEL] Loading verbs from grammar system:', {
        language, difficulty, verbTypes, count
      });

      const { data: verbs, error } = await this.supabase
        .from('grammar_verbs')
        .select('id, infinitive, translation, verb_type, difficulty')
        .eq('language', language)
        .eq('is_active', true)
        .in('verb_type', verbTypes)
        .in('difficulty', difficulty === 'mixed' ? ['beginner', 'intermediate', 'advanced'] : [difficulty])
        .order('frequency_rank', { ascending: true })
        .limit(count);

      if (error) {
        console.error('❌ [CONJUGATION DUEL] Error loading grammar verbs:', error);
        throw error;
      }

      console.log('✅ [CONJUGATION DUEL] Loaded', verbs?.length || 0, 'verbs from grammar system');

      return verbs?.map(verb => ({
        id: verb.id,
        infinitive: verb.infinitive,
        translation: verb.translation
      })) || [];

    } catch (error) {
      console.error('❌ [CONJUGATION DUEL] Failed to load grammar verbs:', error);
      return [];
    }
  }

  /**
   * Generate a complete duel session using the new grammar system
   */
  async generateDuelSession(config: DuelConfiguration, assignmentId?: string): Promise<ConjugationChallenge[]> {
    let finalConfig = { ...config };

    // If this is an assignment, try to load grammar assignment configuration
    if (assignmentId) {
      const grammarAssignmentConfig = await this.loadGrammarAssignmentConfig(assignmentId);
      if (grammarAssignmentConfig) {
        console.log('🎯 [CONJUGATION DUEL] Using grammar assignment configuration');
        finalConfig = {
          ...finalConfig,
          language: grammarAssignmentConfig.language,
          tenses: grammarAssignmentConfig.tenses,
          persons: grammarAssignmentConfig.persons,
          difficulty: grammarAssignmentConfig.difficulty,
          challengeCount: grammarAssignmentConfig.verb_count,
          verbTypes: grammarAssignmentConfig.verb_types
        };
      }
    }

    let verbs: Array<{ id: string; infinitive: string; translation: string }>;

    // Try to load verbs from the new grammar system first
    try {
      verbs = await this.loadGrammarVerbs(
        finalConfig.language,
        finalConfig.difficulty,
        finalConfig.verbTypes || ['regular', 'irregular', 'stem_changing'],
        finalConfig.challengeCount * 2
      );

      if (verbs.length === 0) {
        throw new Error(`❌ [CONJUGATION DUEL] No verbs found in grammar system for language: ${finalConfig.language}, verb types: ${finalConfig.verbTypes.join(', ')}, difficulty: ${finalConfig.difficulty}. Please check grammar database.`);
      }
    } catch (error) {
      console.error('❌ [CONJUGATION DUEL] Error loading from grammar system:', error);
      throw error; // Re-throw the error instead of using fallback
    }

    const challenges: ConjugationChallenge[] = [];

    // Shuffle verbs for variety
    const shuffledVerbs = verbs.sort(() => 0.5 - Math.random());

    for (let i = 0; i < Math.min(finalConfig.challengeCount, shuffledVerbs.length); i++) {
      const verb = shuffledVerbs[i];
      const randomTense = finalConfig.tenses[Math.floor(Math.random() * finalConfig.tenses.length)];

      const challenge = await this.generateChallenge(
        { id: verb.id, infinitive: verb.infinitive, translation: verb.translation },
        finalConfig.language,
        randomTense,
        undefined, // personIndex - let it be random
        finalConfig.persons // pass persons from config
      );

      challenges.push(challenge);
    }

    console.log('🎯 [CONJUGATION DUEL] Generated', challenges.length, 'challenges using grammar system');

    return challenges;
  }

  /**
   * Process a conjugation attempt and award Grammar Gems
   */
  async processAttempt(
    sessionId: string,
    challenge: ConjugationChallenge,
    attempt: ConjugationAttempt
  ): Promise<ConjugationResult> {
    try {
      console.log('🎯 [CONJUGATION DUEL] Processing attempt:', {
        sessionId,
        challengeId: challenge.id,
        infinitive: challenge.infinitive,
        expectedAnswer: challenge.expectedAnswer,
        studentAnswer: attempt.studentAnswer,
        responseTime: attempt.responseTimeMs
      });

      // Validate the answer
      const isCorrect = this.validateAnswer(attempt.studentAnswer, challenge);
      console.log('✅ [CONJUGATION DUEL] Answer validation result:', isCorrect);

      // Get student ID for database operations
      const studentId = await this.getSessionStudentId(sessionId);
      console.log('👤 [CONJUGATION DUEL] Student ID:', studentId);

      // Record detailed conjugation attempt in database
      const conjugationId = await this.recordConjugationAttempt(
        studentId,
        sessionId,
        challenge,
        attempt,
        isCorrect
      );
      console.log('📝 [CONJUGATION DUEL] Conjugation attempt recorded with ID:', conjugationId);

      // Update FSRS for the base verb using centralized vocabulary ID
      // Find corresponding centralized_vocabulary ID for this grammar verb
      const { data: centralizedVocab, error: vocabError } = await this.supabase
        .from('centralized_vocabulary')
        .select('id')
        .eq('word', challenge.infinitive)
        .eq('language', challenge.language)
        .eq('should_track_for_fsrs', true)
        .limit(1)
        .single();

      if (centralizedVocab && !vocabError) {
        await this.updateVerbFSRS(studentId, centralizedVocab.id, isCorrect, attempt.responseTimeMs);
        console.log('🧠 [CONJUGATION DUEL] FSRS updated for centralized vocab ID:', centralizedVocab.id);
      } else {
        console.warn('⚠️ [CONJUGATION DUEL] Could not update FSRS - centralized vocab not found for:', challenge.infinitive);
      }

      let gemAwarded = null;
      let streakCount = 0;

      // Award Grammar Gems for correct answers
      if (isCorrect) {
        console.log('🏆 [CONJUGATION DUEL] Correct answer - awarding Grammar Gem...');
        const grammarGemResult = await this.awardGrammarGem(
          sessionId,
          studentId,
          challenge,
          attempt,
          conjugationId
        );

        gemAwarded = grammarGemResult.gemEvent;
        streakCount = grammarGemResult.streakCount;
        console.log('💎 [CONJUGATION DUEL] Grammar Gem awarded:', {
          rarity: gemAwarded.rarity,
          xpValue: gemAwarded.xpValue
        });
      } else {
        console.log('❌ [CONJUGATION DUEL] Incorrect answer - no Grammar Gem awarded');
      }

      return {
        isCorrect,
        expectedAnswer: challenge.expectedAnswer,
        alternativeAnswers: challenge.alternativeAnswers || [],
        explanation: this.generateExplanation(challenge),
        gemAwarded: gemAwarded ? {
          rarity: gemAwarded.rarity,
          xpValue: gemAwarded.xpValue
        } : undefined,
        fsrsUpdated: true,
        streakCount
      };

    } catch (error) {
      console.error('Error processing conjugation attempt:', error);
      throw error;
    }
  }

  /**
   * Validate a conjugation answer
   */
  private validateAnswer(studentAnswer: string, challenge: ConjugationChallenge): boolean {
    const normalizedAnswer = studentAnswer.toLowerCase().trim();
    const expectedAnswer = challenge.expectedAnswer.toLowerCase().trim();

    // Check exact match
    if (normalizedAnswer === expectedAnswer) {
      return true;
    }

    // Check alternative answers
    if (challenge.alternativeAnswers) {
      return challenge.alternativeAnswers.some(alt =>
        alt.toLowerCase().trim() === normalizedAnswer
      );
    }

    return false;
  }

  /**
   * Get student ID from session
   */
  private async getSessionStudentId(sessionId: string): Promise<string> {
    const { data, error } = await this.supabase
      .from('enhanced_game_sessions')
      .select('student_id')
      .eq('id', sessionId)
      .single();

    if (error || !data) {
      throw new Error(`Failed to get student ID for session ${sessionId}`);
    }

    return data.student_id;
  }

  /**
   * Record detailed conjugation attempt in database
   */
  private async recordConjugationAttempt(
    studentId: string,
    sessionId: string,
    challenge: ConjugationChallenge,
    attempt: ConjugationAttempt,
    isCorrect: boolean
  ): Promise<string> {
    console.log('📝 [CONJUGATION RECORDING] Starting conjugation recording:', {
      studentId,
      sessionId,
      challengeId: challenge.id,
      infinitive: challenge.infinitive,
      expectedAnswer: challenge.expectedAnswer,
      studentAnswer: attempt.studentAnswer,
      isCorrect
    });

    // Extract grammar verb ID from challenge ID (format: uuid-tense-personIndex)
    const grammarVerbId = challenge.id.split('-').slice(0, 5).join('-');
    console.log('🔍 [CONJUGATION RECORDING] Grammar verb ID:', grammarVerbId);

    // Find corresponding centralized_vocabulary ID for this grammar verb
    const { data: centralizedVocab, error: vocabError } = await this.supabase
      .from('centralized_vocabulary')
      .select('id')
      .eq('word', challenge.infinitive)
      .eq('language', challenge.language)
      .eq('should_track_for_fsrs', true)
      .limit(1)
      .single();

    if (vocabError || !centralizedVocab) {
      console.error('❌ [CONJUGATION RECORDING] Could not find centralized vocabulary for verb:', {
        infinitive: challenge.infinitive,
        language: challenge.language,
        grammarVerbId,
        error: vocabError?.message
      });
      throw new Error(`Failed to find centralized vocabulary for verb: ${challenge.infinitive}`);
    }

    console.log('✅ [CONJUGATION RECORDING] Found centralized vocabulary ID:', centralizedVocab.id);

    const insertData = {
      student_id: studentId,
      game_session_id: sessionId,
      base_verb_id: centralizedVocab.id, // Use centralized_vocabulary ID
      base_verb_infinitive: challenge.infinitive,
      base_verb_translation: challenge.translation,
      conjugated_form: challenge.expectedAnswer,
      expected_answer: challenge.expectedAnswer,
      student_answer: attempt.studentAnswer,
      is_correct: isCorrect,
      language: challenge.language,
      tense: challenge.tense,
      person: challenge.person,
      number: challenge.number,
      verb_type: challenge.verbType,
      response_time_ms: attempt.responseTimeMs,
      hint_used: attempt.hintUsed,
      difficulty_level: challenge.difficulty,
      complexity_score: this.calculateComplexityScore(challenge)
    };

    console.log('📝 [CONJUGATION RECORDING] Insert data:', insertData);

    const { data, error } = await this.supabase
      .from('conjugations')
      .insert(insertData)
      .select('id')
      .single();

    if (error || !data) {
      console.error('❌ [CONJUGATION RECORDING] Failed to record conjugation attempt:', {
        error: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      throw new Error(`Failed to record conjugation attempt: ${error?.message}`);
    }

    console.log('✅ [CONJUGATION RECORDING] Successfully recorded conjugation with ID:', data.id);
    return data.id;
  }

  /**
   * Update FSRS for the base verb
   */
  private async updateVerbFSRS(
    studentId: string,
    verbId: string,
    isCorrect: boolean,
    responseTimeMs: number
  ): Promise<void> {
    try {
      await this.fsrsService.updateProgress(
        studentId,
        verbId,
        isCorrect,
        responseTimeMs,
        this.calculateConfidenceFromResponse(isCorrect, responseTimeMs)
      );
    } catch (error) {
      console.error('Error updating FSRS for verb:', error);
      // Don't throw - FSRS update failure shouldn't break the game
    }
  }

  // Helper methods
  private determineVerbType(infinitive: string, language: string): 'regular' | 'irregular' | 'stem_changing' {
    const patterns = this.conjugationPatterns[language as keyof typeof this.conjugationPatterns];
    
    if (patterns?.present?.irregular && patterns.present.irregular[infinitive]) {
      return 'irregular';
    }
    
    if (language === 'es' && this.getStemChangeType(infinitive)) {
      return 'stem_changing';
    }
    
    return 'regular';
  }

  private determineDifficulty(infinitive: string, language: string): 'beginner' | 'intermediate' | 'advanced' {
    const verbType = this.determineVerbType(infinitive, language);
    
    if (verbType === 'irregular') return 'advanced';
    if (verbType === 'stem_changing') return 'intermediate';
    return 'beginner';
  }

  private getVerbEnding(infinitive: string, language: string): string {
    if (language === 'es') {
      if (infinitive.endsWith('ar')) return 'ar';
      if (infinitive.endsWith('er')) return 'er';
      if (infinitive.endsWith('ir')) return 'ir';
    } else if (language === 'fr') {
      if (infinitive.endsWith('er')) return 'er';
      if (infinitive.endsWith('ir')) return 'ir';
      if (infinitive.endsWith('re')) return 're';
    } else if (language === 'de') {
      return 'en';
    }
    return '';
  }

  private getStemChangeType(infinitive: string): string | null {
    // This would be expanded with actual stem-changing verb patterns
    const stemChangingVerbs: Record<string, string> = {
      'preferir': 'e_ie',
      'poder': 'o_ue',
      'pedir': 'e_i'
    };
    
    return stemChangingVerbs[infinitive] || null;
  }

  private getAlternativeAnswers(infinitive: string, language: string, tense: string, personIndex: number): string[] {
    // Return common alternative spellings or acceptable variations
    return [];
  }

  /**
   * Calculate complexity score for a conjugation challenge
   */
  private calculateComplexityScore(challenge: ConjugationChallenge): number {
    let score = 1; // Base score

    // Verb type complexity
    if (challenge.verbType === 'irregular') score += 2;
    else if (challenge.verbType === 'stem_changing') score += 1;

    // Tense complexity
    const complexTenses = ['preterite', 'imperfect', 'conditional', 'subjunctive', 'future'];
    if (complexTenses.includes(challenge.tense.toLowerCase())) score += 1;

    // Difficulty level
    if (challenge.difficulty === 'advanced') score += 1;
    else if (challenge.difficulty === 'intermediate') score += 0.5;

    return Math.min(5, Math.max(1, Math.round(score)));
  }

  /**
   * Calculate confidence from response performance
   */
  private calculateConfidenceFromResponse(isCorrect: boolean, responseTimeMs: number): number {
    if (!isCorrect) return 0.3; // Low confidence for incorrect answers

    // Base confidence for correct answers
    let confidence = 0.8;

    // Adjust for response time
    if (responseTimeMs < 3000) confidence += 0.1; // Fast response
    else if (responseTimeMs > 10000) confidence -= 0.2; // Slow response

    return Math.max(0.1, Math.min(0.95, confidence));
  }

  /**
   * Award Grammar Gem for correct conjugation
   */
  private async awardGrammarGem(
    sessionId: string,
    studentId: string,
    challenge: ConjugationChallenge,
    attempt: ConjugationAttempt,
    conjugationId: string
  ): Promise<{ gemEvent: GemEvent; streakCount: number }> {
    console.log('🏆 [GRAMMAR GEM] Starting Grammar Gem award process:', {
      sessionId,
      studentId,
      challengeId: challenge.id,
      infinitive: challenge.infinitive,
      conjugationId
    });

    // Extract the grammar verb ID from compound challenge ID (e.g., "uuid-uuid-uuid-uuid-uuid-present-0" -> "uuid-uuid-uuid-uuid-uuid")
    const grammarVerbId = challenge.id.split('-').slice(0, 5).join('-');
    console.log('🔍 [GRAMMAR GEM] Extracted grammar verb ID:', grammarVerbId);

    // Find corresponding centralized_vocabulary ID for this grammar verb
    const { data: centralizedVocab, error: vocabError } = await this.supabase
      .from('centralized_vocabulary')
      .select('id')
      .eq('word', challenge.infinitive)
      .eq('language', challenge.language)
      .eq('should_track_for_fsrs', true)
      .limit(1)
      .single();

    if (vocabError || !centralizedVocab) {
      console.error('❌ [GRAMMAR GEM] Could not find centralized vocabulary for verb:', {
        infinitive: challenge.infinitive,
        language: challenge.language,
        grammarVerbId,
        error: vocabError?.message
      });
      throw new Error(`Failed to find centralized vocabulary for verb: ${challenge.infinitive}`);
    }

    console.log('✅ [GRAMMAR GEM] Found centralized vocabulary ID:', centralizedVocab.id);

    // Check if this is the first time conjugating this verb
    const isFirstTime = await this.isFirstTimeConjugation(studentId, grammarVerbId);
    console.log('🆕 [GRAMMAR GEM] Is first time conjugation:', isFirstTime);

    // Get current streak count for grammar
    const streakCount = await this.getGrammarStreakCount(sessionId);
    console.log('🔥 [GRAMMAR GEM] Current streak count:', streakCount);

    // Create performance context for Grammar Gems
    const context: PerformanceContext = {
      responseTimeMs: attempt.responseTimeMs,
      streakCount,
      hintUsed: attempt.hintUsed,
      isTypingMode: true, // Conjugation is always typing
      isDictationMode: false,
      isFirstTime,
      tense: challenge.tense,
      verbType: challenge.verbType,
      complexityScore: this.calculateComplexityScore(challenge)
    };

    console.log('📊 [GRAMMAR GEM] Performance context:', context);

    // Create Grammar Gem event
    const grammarGemEvent = RewardEngine.createGrammarGemEvent(
      'conjugation-duel',
      context,
      {
        // Don't pass id since it expects number, but we have UUID
        word: challenge.infinitive,
        translation: challenge.translation
      },
      {
        conjugationId,
        baseVerbId: grammarVerbId, // Use extracted grammar verb ID (full UUID)
        tense: challenge.tense,
        person: challenge.person,
        verbType: challenge.verbType
      },
      'conjugation',
      challenge.difficulty
    );

    console.log('💎 [GRAMMAR GEM] Created Grammar Gem event:', {
      rarity: grammarGemEvent.rarity,
      xpValue: grammarGemEvent.xpValue,
      baseVerbId: grammarGemEvent.baseVerbId,
      wordText: grammarGemEvent.wordText
    });

    // Store Grammar Gem in database
    await this.storeGrammarGemEvent(sessionId, studentId, grammarGemEvent, conjugationId, centralizedVocab.id);

    console.log('✅ [GRAMMAR GEM] Grammar Gem awarded successfully!');
    return { gemEvent: grammarGemEvent, streakCount };
  }

  /**
   * Check if this is the first time conjugating this verb
   */
  private async isFirstTimeConjugation(studentId: string, grammarVerbId: string): Promise<boolean> {
    try {
      // First, get the verb infinitive from grammar_verbs table
      const { data: grammarVerb, error: grammarError } = await this.supabase
        .from('grammar_verbs')
        .select('infinitive, language')
        .eq('id', grammarVerbId)
        .single();

      if (grammarError || !grammarVerb) {
        console.error('Error getting grammar verb:', grammarError);
        return false;
      }

      // Find corresponding centralized_vocabulary ID
      const { data: centralizedVocab, error: vocabError } = await this.supabase
        .from('centralized_vocabulary')
        .select('id')
        .eq('word', grammarVerb.infinitive)
        .eq('language', grammarVerb.language)
        .eq('should_track_for_fsrs', true)
        .limit(1)
        .single();

      if (vocabError || !centralizedVocab) {
        console.error('Error finding centralized vocabulary:', vocabError);
        return false;
      }

      // Check if this is the first time conjugating this verb using centralized vocab ID
      const { data, error } = await this.supabase
        .from('conjugations')
        .select('id')
        .eq('student_id', studentId)
        .eq('base_verb_id', centralizedVocab.id)
        .eq('is_correct', true)
        .limit(1);

      if (error) {
        console.error('Error checking first-time conjugation:', error);
        return false;
      }

      return !data || data.length === 0;
    } catch (error) {
      console.error('Error checking first-time conjugation:', error);
      return false;
    }
  }

  /**
   * Get current grammar streak count for session
   */
  private async getGrammarStreakCount(sessionId: string): Promise<number> {
    // Get recent conjugation attempts in this session
    const { data, error } = await this.supabase
      .from('conjugations')
      .select('is_correct, created_at')
      .eq('game_session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !data) {
      return 0;
    }

    // Count consecutive correct answers from the most recent
    let streak = 0;
    for (const attempt of data) {
      if (attempt.is_correct) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Store Grammar Gem event in database
   */
  private async storeGrammarGemEvent(
    sessionId: string,
    studentId: string,
    gemEvent: GemEvent,
    conjugationId: string,
    centralizedVocabularyId: string
  ): Promise<void> {
    const gemEventData = {
      session_id: sessionId,
      student_id: studentId,
      gem_rarity: gemEvent.rarity,
      xp_value: gemEvent.xpValue,
      centralized_vocabulary_id: centralizedVocabularyId, // Use centralized vocabulary ID
      word_text: gemEvent.wordText,
      translation_text: gemEvent.translationText,
      response_time_ms: gemEvent.responseTimeMs,
      streak_count: gemEvent.streakCount,
      hint_used: gemEvent.hintUsed,
      game_type: gemEvent.gameType,
      game_mode: gemEvent.gameMode,
      difficulty_level: gemEvent.difficultyLevel,
      gem_type: 'grammar',
      conjugation_id: conjugationId
    };

    console.log('💾 [GRAMMAR GEM] Storing Grammar Gem event in database:', gemEventData);

    const { error } = await this.supabase
      .from('gem_events')
      .insert(gemEventData);

    if (error) {
      console.error('❌ [GRAMMAR GEM] Error storing Grammar Gem event:', error);
      throw error;
    }

    console.log('✅ [GRAMMAR GEM] Grammar Gem event stored successfully in gem_events table');
  }

  private getMasteryLevel(difficulty: string): number {
    switch (difficulty) {
      case 'beginner': return 1;
      case 'intermediate': return 2;
      case 'advanced': return 3;
      default: return 2;
    }
  }

  private getMaxGemRarity(difficulty: string, verbType: string): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
    if (verbType === 'irregular') return 'epic';
    if (verbType === 'stem_changing') return 'rare';
    if (difficulty === 'advanced') return 'rare';
    if (difficulty === 'intermediate') return 'uncommon';
    return 'common';
  }

  private calculateConfidence(attempt: ConjugationAttempt, challenge: ConjugationChallenge): number {
    let confidence = 0.8; // Base confidence for conjugation

    // Adjust for response time
    if (attempt.responseTimeMs < 3000) confidence += 0.1;
    else if (attempt.responseTimeMs > 10000) confidence -= 0.1;

    // Adjust for hint usage
    if (attempt.hintUsed) confidence -= 0.2;

    // Adjust for difficulty
    if (challenge.difficulty === 'advanced') confidence += 0.1;
    else if (challenge.difficulty === 'beginner') confidence -= 0.05;

    return Math.max(0.1, Math.min(0.95, confidence));
  }

  private generateExplanation(challenge: ConjugationChallenge): string {
    const pronoun = challenge.person;
    const tense = challenge.tense;
    const verbType = challenge.verbType;
    
    let explanation = `${pronoun} + ${challenge.infinitive} (${tense} tense)`;
    
    if (verbType === 'irregular') {
      explanation += ` - This is an irregular verb with a unique conjugation pattern.`;
    } else if (verbType === 'stem_changing') {
      explanation += ` - This is a stem-changing verb where the root changes in certain forms.`;
    } else {
      explanation += ` - This follows the regular ${this.getVerbEnding(challenge.infinitive, challenge.language)} verb pattern.`;
    }
    
    return explanation;
  }

  // Record grammar practice attempt
  async recordGrammarPracticeAttempt(
    studentId: string,
    sessionId: string,
    assignmentId: string | null,
    verbInfinitive: string,
    tense: string,
    person: string,
    userAnswer: string,
    correctAnswer: string,
    isCorrect: boolean,
    responseTimeMs: number,
    language: string = 'spanish'
  ): Promise<void> {
    try {
      const languageCode = this.getLanguageCode(language);

      // First, find the verb ID from the grammar_verbs table
      const { data: verb, error: verbError } = await this.supabase
        .from('grammar_verbs')
        .select('id')
        .eq('infinitive', verbInfinitive)
        .eq('language', languageCode)
        .single();

      if (verbError || !verb) {
        console.warn('⚠️ [GRAMMAR] Could not find verb in grammar_verbs table:', verbInfinitive, verbError);
        return;
      }

      // Record the practice attempt (using correct column names)
      const { error: attemptError } = await this.supabase
        .from('grammar_practice_attempts')
        .insert({
          student_id: studentId,
          session_id: sessionId,
          assignment_id: assignmentId,
          verb_id: verb.id,
          tense: tense,
          person: person,
          student_answer: userAnswer,  // Correct column name
          expected_answer: correctAnswer,  // Correct column name
          is_correct: isCorrect,
          response_time_ms: responseTimeMs,
          created_at: new Date().toISOString()
        });

      if (attemptError) {
        console.error('❌ [GRAMMAR] Error recording grammar practice attempt:', attemptError);
      } else {
        console.log('✅ [GRAMMAR] Recorded practice attempt:', {
          verb: verbInfinitive,
          tense,
          person,
          isCorrect,
          responseTime: responseTimeMs
        });

        // If the answer was correct, create a grammar gem event
        if (isCorrect) {
          const grammarXP = 3; // Standard grammar XP per correct answer

          const { error: gemError } = await this.supabase
            .from('gem_events')
            .insert({
              student_id: studentId,
              session_id: sessionId,
              gem_type: 'grammar',
              gem_rarity: 'common', // Grammar gems are typically common
              xp_value: grammarXP,
              response_time_ms: responseTimeMs,
              word_text: verbInfinitive,
              translation_text: `${tense} ${person}`,
              game_type: 'conjugation-duel',
              game_mode: 'assignment',
              difficulty_level: 'beginner',
              created_at: new Date().toISOString()
            });

          if (gemError) {
            console.error('❌ [GRAMMAR] Error creating grammar gem event:', gemError);
            // Don't throw here - practice attempt was recorded successfully
          } else {
            console.log('✅ [GRAMMAR] Created grammar gem event:', grammarXP, 'XP');
          }
        }
      }
    } catch (error) {
      console.error('❌ [GRAMMAR] Error in recordGrammarPracticeAttempt:', error);
    }
  }

  private getLanguageCode(language: string): string {
    const languageMap: { [key: string]: string } = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de'
    };
    return languageMap[language] || 'es';
  }
}

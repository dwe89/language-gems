/**
 * Enhanced Game Session Service
 * Manages game sessions with integrated gems tracking and SRS updates
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { RewardEngine, type GemEvent, type GemRarity } from './RewardEngine';

export interface GameSessionData {
  student_id: string;
  assignment_id?: string;
  game_type: string;
  session_mode: 'free_play' | 'assignment' | 'practice' | 'challenge' | 'assessment';
  
  // Performance metrics
  final_score: number;
  max_score_possible?: number;
  accuracy_percentage: number;
  completion_percentage: number;
  words_attempted: number;
  words_correct: number;
  unique_words_practiced: number;
  duration_seconds: number;
  average_response_time_ms?: number;
  
  // Legacy XP (will be computed from gems)
  xp_earned?: number;
  bonus_xp?: number;
  
  // Additional session data
  session_data?: any;
}

export interface WordAttempt {
  vocabularyId?: string | number; // Support both UUID (string) and legacy integer IDs
  wordText: string;
  translationText: string;
  responseTimeMs: number;
  wasCorrect: boolean;
  hintUsed: boolean;
  streakCount: number;
  masteryLevel?: number;
  maxGemRarity?: GemRarity;
  gameMode?: string;
  difficultyLevel?: string;
}

export class EnhancedGameSessionService {
  private supabase: SupabaseClient;
  private currentSessionId: string | null = null;
  private gemEvents: GemEvent[] = [];
  
  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }
  
  /**
   * Start a new game session
   */
  async startGameSession(sessionData: Partial<GameSessionData>): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('enhanced_game_sessions')
        .insert({
          student_id: sessionData.student_id,
          assignment_id: sessionData.assignment_id,
          game_type: sessionData.game_type,
          session_mode: sessionData.session_mode || 'free_play',
          started_at: new Date().toISOString(),
          gems_total: 0,
          gems_by_rarity: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
          gem_events_count: 0
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      this.currentSessionId = data.id;
      this.gemEvents = [];
      
      return data.id;
    } catch (error) {
      console.error('Error starting game session:', error);
      throw error;
    }
  }
  
  /**
   * Record a sentence attempt for sentence-based games
   */
  async recordSentenceAttempt(
    sessionId: string,
    gameType: string,
    attempt: {
      sentenceId: string;
      sourceText: string;
      targetText: string;
      responseTimeMs: number;
      wasCorrect: boolean;
      hintUsed: boolean;
      streakCount: number;
      masteryLevel?: number;
      maxGemRarity?: GemRarity;
      gameMode?: string;
      difficultyLevel?: string;
      contextData?: any;
    }
  ): Promise<GemEvent | null> {
    try {
      // Log sentence performance (using sentenceId as vocabularyId for compatibility)
      await this.logWordPerformance(sessionId, {
        vocabularyId: attempt.sentenceId,
        wordText: attempt.sourceText,
        translationText: attempt.targetText,
        responseTimeMs: attempt.responseTimeMs,
        wasCorrect: attempt.wasCorrect,
        hintUsed: attempt.hintUsed,
        streakCount: attempt.streakCount,
        masteryLevel: attempt.masteryLevel || 1,
        maxGemRarity: attempt.maxGemRarity || 'rare',
        gameMode: attempt.gameMode || 'sentence_based',
        difficultyLevel: attempt.difficultyLevel || 'intermediate',
        contextData: attempt.contextData
      });

      // Only award gems for correct answers in non-assessment modes
      if (!attempt.wasCorrect) {
        return null;
      }

      // Create gem event using RewardEngine (same pattern as recordWordAttempt)
      const gemEvent = RewardEngine.createGemEvent(
        gameType,
        {
          responseTimeMs: attempt.responseTimeMs,
          streakCount: attempt.streakCount,
          hintUsed: attempt.hintUsed,
          isTypingMode: attempt.gameMode === 'typing',
          isDictationMode: attempt.gameMode === 'dictation',
          masteryLevel: attempt.masteryLevel || 1,
          maxGemRarity: attempt.maxGemRarity || 'rare'
        },
        {
          id: attempt.sentenceId,
          word: attempt.sourceText,
          translation: attempt.targetText
        },
        attempt.gameMode || 'sentence_based',
        attempt.difficultyLevel || 'intermediate'
      );

      // Store gem event in database (same pattern as recordWordAttempt)
      const insertData: any = {
        session_id: sessionId,
        student_id: (await this.getSessionStudentId(sessionId)),
        gem_rarity: gemEvent.rarity,
        xp_value: gemEvent.xpValue,
        word_text: gemEvent.wordText,
        translation_text: gemEvent.translationText,
        response_time_ms: gemEvent.responseTimeMs,
        streak_count: gemEvent.streakCount,
        hint_used: gemEvent.hintUsed,
        game_type: gemEvent.gameType,
        game_mode: gemEvent.gameMode,
        difficulty_level: gemEvent.difficultyLevel
      };

      // Handle both UUID and integer sentence IDs
      if (typeof gemEvent.vocabularyId === 'string' && gemEvent.vocabularyId.includes('-')) {
        // UUID format - use centralized_vocabulary_id
        insertData.centralized_vocabulary_id = gemEvent.vocabularyId;
      } else if (gemEvent.vocabularyId) {
        // Integer format - use legacy vocabulary_id
        insertData.vocabulary_id = parseInt(gemEvent.vocabularyId.toString());
      }

      await this.supabase
        .from('gem_events')
        .insert(insertData);

      return gemEvent;

      return gemEvent;
    } catch (error) {
      console.error('Error recording sentence attempt:', error);
      return null;
    }
  }

  /**
   * Record a word attempt and award gem if correct
   */
  async recordWordAttempt(
    sessionId: string,
    gameType: string,
    attempt: WordAttempt,
    skipSpacedRepetition: boolean = false
  ): Promise<GemEvent | null> {
    try {
      // Always log the word performance
      await this.logWordPerformance(sessionId, attempt);

      // ✅ UPDATE FSRS FOR ALL ANSWERS (both correct and incorrect)
      if (attempt.vocabularyId && !skipSpacedRepetition) {
        const studentId = await this.getSessionStudentId(sessionId);

        // Update FSRS for vocabulary tracking
        console.log('🔍 [ENHANCED SESSION] FSRS update:', {
          vocabularyId: attempt.vocabularyId,
          wasCorrect: attempt.wasCorrect
        });

        await this.updateVocabularyDirectly(
          studentId,
          attempt.vocabularyId,
          attempt.wasCorrect,
          attempt.responseTimeMs
        );

        console.log('✅ [ENHANCED SESSION] FSRS update completed');
      }

      // Only award gems for correct answers in non-assessment modes
      if (!attempt.wasCorrect) {
        return null;
      }
      
      // Create gem event
      const gemEvent = RewardEngine.createGemEvent(
        gameType,
        {
          responseTimeMs: attempt.responseTimeMs,
          streakCount: attempt.streakCount,
          hintUsed: attempt.hintUsed,
          isTypingMode: attempt.gameMode === 'typing',
          isDictationMode: attempt.gameMode === 'dictation',
          masteryLevel: attempt.masteryLevel,
          maxGemRarity: attempt.maxGemRarity
        },
        {
          id: attempt.vocabularyId,
          word: attempt.wordText,
          translation: attempt.translationText
        },
        attempt.gameMode,
        attempt.difficultyLevel
      );
      
      // Store gem event in database
      const insertData: any = {
        session_id: sessionId,
        student_id: (await this.getSessionStudentId(sessionId)),
        gem_rarity: gemEvent.rarity,
        xp_value: gemEvent.xpValue,
        word_text: gemEvent.wordText,
        translation_text: gemEvent.translationText,
        response_time_ms: gemEvent.responseTimeMs,
        streak_count: gemEvent.streakCount,
        hint_used: gemEvent.hintUsed,
        game_type: gemEvent.gameType,
        game_mode: gemEvent.gameMode,
        difficulty_level: gemEvent.difficultyLevel
      };

      // Handle both UUID and integer vocabulary IDs
      if (typeof gemEvent.vocabularyId === 'string' && gemEvent.vocabularyId.includes('-')) {
        // UUID format - use centralized_vocabulary_id
        insertData.centralized_vocabulary_id = gemEvent.vocabularyId;
      } else if (gemEvent.vocabularyId) {
        // Integer format - use legacy vocabulary_id
        insertData.vocabulary_id = parseInt(gemEvent.vocabularyId.toString());
      }

      await this.supabase
        .from('gem_events')
        .insert(insertData);

      // Cache gem event for session summary
      this.gemEvents.push(gemEvent);

      return gemEvent;
    } catch (error) {
      console.error('Error recording word attempt:', error);
      return null;
    }
  }
  
  /**
   * End game session with final statistics
   */
  async endGameSession(
    sessionId: string,
    finalData: GameSessionData
  ): Promise<void> {
    try {
      // Get current gem totals from database (updated by triggers)
      const { data: sessionData } = await this.supabase
        .from('enhanced_game_sessions')
        .select('gems_total, gems_by_rarity, gem_events_count')
        .eq('id', sessionId)
        .single();
      
      // Calculate XP from gems (overrides any passed XP)
      const totalXP = sessionData?.gems_total ? 
        await this.calculateXPFromGems(sessionId) : 
        finalData.xp_earned || 0;
      
      // Update session with final data
      const { error } = await this.supabase
        .from('enhanced_game_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: finalData.duration_seconds,
          final_score: finalData.final_score,
          max_score_possible: finalData.max_score_possible,
          accuracy_percentage: finalData.accuracy_percentage,
          completion_percentage: finalData.completion_percentage,
          words_attempted: finalData.words_attempted,
          words_correct: finalData.words_correct,
          unique_words_practiced: finalData.unique_words_practiced,
          average_response_time_ms: finalData.average_response_time_ms,
          xp_earned: totalXP,
          bonus_xp: finalData.bonus_xp || 0,
          session_data: finalData.session_data
        })
        .eq('id', sessionId);
      
      if (error) throw error;
      
      // Update student profile XP
      await this.updateStudentProfileXP(finalData.student_id, totalXP);
      
      // Clear session cache
      if (this.currentSessionId === sessionId) {
        this.currentSessionId = null;
        this.gemEvents = [];
      }
    } catch (error) {
      console.error('Error ending game session:', error);
      throw error;
    }
  }
  
  /**
   * Award bonus gems for milestones (quest completion, perfect rounds, etc.)
   */
  async awardBonusGem(
    sessionId: string,
    gameType: string,
    rarity: GemRarity,
    reason: string,
    studentId?: string
  ): Promise<void> {
    try {
      const student_id = studentId || await this.getSessionStudentId(sessionId);
      const xpValue = RewardEngine.getXPValue(rarity);
      
      await this.supabase
        .from('gem_events')
        .insert({
          session_id: sessionId,
          student_id,
          gem_rarity: rarity,
          xp_value: xpValue,
          word_text: `Bonus: ${reason}`,
          response_time_ms: 0,
          streak_count: 0,
          hint_used: false,
          game_type: gameType,
          game_mode: 'bonus'
        });
    } catch (error) {
      console.error('Error awarding bonus gem:', error);
    }
  }
  
  /**
   * Get session statistics including gems
   */
  async getSessionStatistics(sessionId: string): Promise<any> {
    try {
      const { data: session } = await this.supabase
        .from('enhanced_game_sessions')
        .select(`
          *,
          gem_events(count)
        `)
        .eq('id', sessionId)
        .single();
      
      const { data: gemBreakdown } = await this.supabase
        .from('gem_events')
        .select('gem_rarity, xp_value')
        .eq('session_id', sessionId);
      
      return {
        ...session,
        gemBreakdown: RewardEngine.groupGemsByRarity(
          gemBreakdown?.map(g => ({ rarity: g.gem_rarity, xpValue: g.xp_value })) || []
        )
      };
    } catch (error) {
      console.error('Error getting session statistics:', error);
      return null;
    }
  }
  
  /**
   * Private helper methods
   */
  private async getSessionStudentId(sessionId: string): Promise<string> {
    const { data } = await this.supabase
      .from('enhanced_game_sessions')
      .select('student_id')
      .eq('id', sessionId)
      .single();
    
    return data?.student_id || '';
  }
  
  private async calculateXPFromGems(sessionId: string): Promise<number> {
    const { data } = await this.supabase
      .from('gem_events')
      .select('xp_value')
      .eq('session_id', sessionId);
    
    return data?.reduce((total, event) => total + event.xp_value, 0) || 0;
  }
  
  private async logWordPerformance(sessionId: string, attempt: WordAttempt): Promise<void> {
    try {
      // Handle both UUID and integer vocabulary IDs
      let legacyVocabularyId = null;
      let centralizedVocabularyId = null;

      if (attempt.vocabularyId) {
        if (typeof attempt.vocabularyId === 'string') {
          // UUID from centralized_vocabulary
          centralizedVocabularyId = attempt.vocabularyId;
        } else {
          // Integer from legacy vocabulary_items
          legacyVocabularyId = attempt.vocabularyId;
        }
      }

      await this.supabase
        .from('word_performance_logs')
        .insert({
          session_id: sessionId,
          vocabulary_id: legacyVocabularyId, // Legacy integer ID
          centralized_vocabulary_id: centralizedVocabularyId, // New UUID ID
          word_text: attempt.wordText,
          translation_text: attempt.translationText,
          language_pair: 'english_spanish', // TODO: Make dynamic
          attempt_number: 1,
          response_time_ms: attempt.responseTimeMs,
          was_correct: attempt.wasCorrect,
          confidence_level: attempt.responseTimeMs < 2000 ? 5 :
                           attempt.responseTimeMs < 4000 ? 4 :
                           attempt.responseTimeMs < 6000 ? 3 : 2,
          difficulty_level: attempt.difficultyLevel || 'medium',
          hint_used: attempt.hintUsed,
          streak_count: attempt.streakCount,
          previous_attempts: 0,
          mastery_level: attempt.masteryLevel || 0
        });
    } catch (error) {
      console.error('Error logging word performance:', error);
    }
  }
  
  /**
   * ✅ FSRS-AWARE: Direct vocabulary update with time-gated progression
   * This ensures wasCorrect value reaches the database unchanged AND respects FSRS learning/review phases
   */
  private async updateVocabularyDirectly(
    studentId: string,
    vocabularyId: string | number,
    wasCorrect: boolean,
    responseTimeMs: number
  ): Promise<void> {
    try {
      // Convert vocabularyId to appropriate format
      const vocabIdString = vocabularyId?.toString();
      if (!vocabIdString) return;

      // Determine if this is a UUID (centralized) or integer (legacy)
      const isUUID = vocabIdString.includes('-');

      // ✅ FSRS TIME-GATED PROGRESSION: Check if word is due for review
      const canProgress = await this.checkIfWordCanProgress(studentId, vocabIdString, isUUID);

      if (!canProgress.allowed) {
        console.log('⏰ [FSRS GATE] Word not due for review, treating as practice:', {
          vocabularyId: vocabIdString,
          reason: canProgress.reason,
          nextReviewAt: canProgress.nextReviewAt
        });

        // For words not due for review, we can still log the practice but don't update FSRS
        // This prevents "cramming" from accelerating long-term progression
        return;
      }

      console.log('✅ [FSRS GATE] Word is due for review, allowing progression:', {
        vocabularyId: vocabIdString,
        phase: canProgress.phase,
        state: canProgress.state
      });

      // Call atomic function directly with unmodified wasCorrect value
      const { data, error } = await this.supabase.rpc('update_vocabulary_gem_collection_atomic', {
        p_student_id: studentId,
        p_vocabulary_item_id: isUUID ? null : vocabIdString, // UUID format for both
        p_centralized_vocabulary_id: isUUID ? vocabIdString : null,
        p_was_correct: wasCorrect, // ✅ DIRECT: No transformation, no derivation
        p_response_time_ms: responseTimeMs,
        p_hint_used: false,
        p_streak_count: 0
      });

      if (error) {
        console.error('Error in direct vocabulary update:', error);
        throw error;
      }

      console.log('✅ [DIRECT UPDATE] Vocabulary updated successfully:', {
        vocabularyId: vocabIdString,
        wasCorrect,
        studentId,
        phase: canProgress.phase
      });

    } catch (error) {
      console.error('Error updating vocabulary directly:', error);
    }
  }

  /**
   * ✅ FSRS TIME-GATED PROGRESSION: Check if a word can progress based on FSRS rules
   * Learning phase: Rapid progression allowed (short intervals)
   * Review phase: Only when due (respects next_review_at)
   */
  private async checkIfWordCanProgress(
    studentId: string,
    vocabularyId: string,
    isUUID: boolean
  ): Promise<{
    allowed: boolean;
    reason: string;
    phase: 'learning' | 'review' | 'new';
    state: string;
    nextReviewAt?: string;
  }> {
    try {
      // Get current word state
      const { data: wordData, error } = await this.supabase
        .from('vocabulary_gem_collection')
        .select('fsrs_state, next_review_at, fsrs_review_count')
        .eq('student_id', studentId)
        .eq(isUUID ? 'centralized_vocabulary_id' : 'vocabulary_item_id', vocabularyId)
        .single();

      if (error || !wordData) {
        // New word - always allow progression
        return {
          allowed: true,
          reason: 'New word - first encounter',
          phase: 'new',
          state: 'new'
        };
      }

      const now = new Date();
      const nextReview = wordData.next_review_at ? new Date(wordData.next_review_at) : null;
      const state = wordData.fsrs_state || 'new';
      const reviewCount = wordData.fsrs_review_count || 0;

      // LEARNING PHASE: Allow rapid progression (short intervals)
      if (state === 'learning' || state === 'new' || reviewCount < 3) {
        return {
          allowed: true,
          reason: 'Learning phase - rapid progression allowed',
          phase: 'learning',
          state,
          nextReviewAt: wordData.next_review_at
        };
      }

      // RELEARNING PHASE: Allow progression (getting back on track)
      if (state === 'relearning') {
        return {
          allowed: true,
          reason: 'Relearning phase - recovery progression allowed',
          phase: 'learning',
          state,
          nextReviewAt: wordData.next_review_at
        };
      }

      // REVIEW PHASE: Only allow if due for review
      if (state === 'review') {
        if (!nextReview || now >= nextReview) {
          return {
            allowed: true,
            reason: 'Review phase - word is due for review',
            phase: 'review',
            state,
            nextReviewAt: wordData.next_review_at
          };
        } else {
          return {
            allowed: false,
            reason: 'Review phase - word not yet due for review',
            phase: 'review',
            state,
            nextReviewAt: wordData.next_review_at
          };
        }
      }

      // Default: allow progression
      return {
        allowed: true,
        reason: 'Unknown state - allowing progression',
        phase: 'review',
        state,
        nextReviewAt: wordData.next_review_at
      };

    } catch (error) {
      console.error('Error checking word progression eligibility:', error);
      // On error, allow progression to avoid blocking legitimate practice
      return {
        allowed: true,
        reason: 'Error checking eligibility - allowing progression',
        phase: 'review',
        state: 'unknown'
      };
    }
  }

  /**
   * @deprecated Legacy method - replaced by updateVocabularyDirectly
   */
  private async updateSRSProgress(
    studentId: string,
    vocabularyId: string | number,
    wasCorrect: boolean,
    responseTimeMs: number
  ): Promise<void> {
    // Redirect to new direct method
    return this.updateVocabularyDirectly(studentId, vocabularyId, wasCorrect, responseTimeMs);
  }
  
  private async updateStudentProfileXP(studentId: string, xpAmount: number): Promise<void> {
    try {
      // Use existing enhanced game service method
      const { EnhancedGameService } = await import('../enhancedGameService');
      const enhancedGameService = new EnhancedGameService(this.supabase);
      await enhancedGameService.addXPToStudent(studentId, xpAmount);
    } catch (error) {
      console.error('Error updating student profile XP:', error);
    }
  }
}

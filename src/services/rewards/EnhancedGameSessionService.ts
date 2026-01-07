/**
 * Enhanced Game Session Service
 * Manages game sessions with integrated gems tracking and SRS updates
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { RewardEngine, type GemEvent, type GemRarity } from './RewardEngine';
import { parseVocabularyIdentifier } from '@/utils/vocabulary-id';
import { MWEVocabularyTrackingService } from '@/services/MWEVocabularyTrackingService';
import { assignmentExposureService } from '@/services/assignments/AssignmentExposureService';
import { GameCompletionService } from '@/services/assignments/GameCompletionService';

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
  contextData?: Record<string, unknown>;
}

export class EnhancedGameSessionService {
  private supabase: SupabaseClient<any>;
  private currentSessionId: string | null = null;
  private gemEvents: GemEvent[] = [];

  constructor(supabaseClient?: SupabaseClient<any>) {
    this.supabase = supabaseClient || createBrowserClient<any>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }

  /**
   * Start a new game session
   */
  async startGameSession(sessionData: Partial<GameSessionData>): Promise<string> {
    try {
      const startedAt = new Date().toISOString();

      const { data, error } = await this.supabase
        .from('enhanced_game_sessions')
        .insert({
          student_id: sessionData.student_id,
          assignment_id: sessionData.assignment_id,
          game_type: sessionData.game_type,
          session_mode: sessionData.session_mode || 'free_play',
          started_at: startedAt,
          gems_total: 0,
          gems_by_rarity: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
          gem_events_count: 0
        })
        .select('id')
        .single();

      if (error) {
        // Check if it's a duplicate session error (unique constraint violation)
        if (error.code === '23505' && error.message?.includes('unique_game_session_per_student')) {
          console.warn('⚠️ Duplicate session detected, prevented by database constraint:', {
            student_id: sessionData.student_id,
            game_type: sessionData.game_type,
            started_at: startedAt
          });

          // Try to find the existing session instead of creating a duplicate
          const { data: existingSession, error: findError } = await this.supabase
            .from('enhanced_game_sessions')
            .select('id')
            .eq('student_id', sessionData.student_id)
            .eq('game_type', sessionData.game_type)
            .eq('started_at', startedAt)
            .single();

          if (existingSession && !findError) {
            console.log('✅ Using existing session instead:', existingSession.id);
            this.currentSessionId = existingSession.id;
            this.gemEvents = [];
            return existingSession.id;
          }
        }

        throw error;
      }

      this.currentSessionId = data.id;
      this.gemEvents = [];

      return data.id;
    } catch (error) {
      console.error('Error starting game session:', error);
      throw error;
    }
  }

  /**
   * Increment word counts in the session (for progress tracking)
   */
  private async incrementSessionWordCounts(sessionId: string, wasCorrect: boolean): Promise<void> {
    try {
      console.log(`📊 [SESSION COUNTS] Incrementing for session ${sessionId}, wasCorrect: ${wasCorrect}`);

      // Get current counts
      const { data: session, error: fetchError } = await this.supabase
        .from('enhanced_game_sessions')
        .select('words_attempted, words_correct')
        .eq('id', sessionId)
        .single();

      if (fetchError) {
        console.error('❌ [SESSION COUNTS] Failed to fetch session:', fetchError);
        return;
      }

      if (!session) {
        console.warn('⚠️ [SESSION COUNTS] Session not found:', sessionId);
        return;
      }

      const newWordsAttempted = (session.words_attempted || 0) + 1;
      const newWordsCorrect = wasCorrect ? (session.words_correct || 0) + 1 : (session.words_correct || 0);

      console.log(`📊 [SESSION COUNTS] Updating: ${session.words_attempted || 0} → ${newWordsAttempted} attempted, ${session.words_correct || 0} → ${newWordsCorrect} correct`);

      // Increment counts
      const { error } = await this.supabase
        .from('enhanced_game_sessions')
        .update({
          words_attempted: newWordsAttempted,
          words_correct: newWordsCorrect
        })
        .eq('id', sessionId);

      if (error) {
        console.error('❌ [SESSION COUNTS] Failed to update session word counts:', error);
      } else {
        console.log(`✅ [SESSION COUNTS] Successfully updated session ${sessionId}`);
      }
    } catch (error) {
      console.error('❌ [SESSION COUNTS] Error incrementing session word counts:', error);
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
      language?: string; // 🎯 NEW: For vocabulary extraction
      assignmentId?: string; // 🎯 NEW: For Layer 2 exposure tracking
      studentId?: string; // 🎯 NEW: For Layer 2 exposure tracking
    }
  ): Promise<GemEvent | null> {
    try {
      // Update session word counts in real-time
      await this.incrementSessionWordCounts(sessionId, attempt.wasCorrect);

      // Log sentence performance (using sentenceId as vocabularyId for compatibility) - non-blocking
      this.logWordPerformance(sessionId, {
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
      }).catch(error => {
        console.warn('🚨 [SESSION SERVICE] Sentence performance logging failed (non-blocking):', error);
      });

      // Only award gems for correct answers in non-assessment modes
      if (!attempt.wasCorrect) {
        return null;
      }

      const studentId = await this.getSessionStudentId(sessionId);

      // 🎯 DUAL-TRACK SYSTEM: For sentence-based games, award Activity Gems only
      // (Sentences don't use FSRS progression like individual vocabulary words)
      console.log('🎮 [DUAL-TRACK] Awarding Activity Gem for sentence completion');
      const activityGemEvent = RewardEngine.createActivityGemEvent(
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

      // Store Activity Gem in database
      await this.storeGemEvent(sessionId, studentId, activityGemEvent, 'activity');

      // 🎯 LAYER 2: Extract vocabulary from sentence and record exposures for assignment progress
      if (attempt.language && attempt.assignmentId && attempt.studentId && attempt.wasCorrect) {
        try {
          const mweService = new MWEVocabularyTrackingService(this.supabase);
          const parsingResult = await mweService.parseSentenceWithLemmatization(
            attempt.sourceText,
            attempt.language
          );

          if (parsingResult.vocabularyMatches.length > 0) {
            const exposedWordIds = parsingResult.vocabularyMatches
              .filter(match => match.should_track_for_fsrs)
              .map(match => match.id);

            if (exposedWordIds.length > 0) {
              console.log(`📝 [LAYER 2] Recording ${exposedWordIds.length} word exposures from sentence for assignment ${attempt.assignmentId}`);

              // Record exposures (non-blocking)
              assignmentExposureService.recordWordExposures(
                attempt.assignmentId,
                attempt.studentId,
                exposedWordIds
              ).then(result => {
                if (result.success) {
                  console.log(`✅ [LAYER 2] Sentence vocabulary exposures recorded successfully`);
                } else {
                  console.error(`❌ [LAYER 2] Failed to record exposures:`, result.error);
                }
              }).catch(error => {
                console.error(`❌ [LAYER 2] Error recording exposures:`, error);
              });
            }
          }
        } catch (error) {
          console.warn('⚠️ [LAYER 2] Vocabulary extraction from sentence failed (non-blocking):', error);
        }
      }

      return activityGemEvent;
    } catch (error) {
      console.error('Error recording sentence attempt:', error);
      return null;
    }
  }

  /**
   * Record a word attempt and award gems using dual-track system
   * - Activity Gems: Always awarded for correct answers (immediate engagement)
   * - Mastery Gems: Only awarded when FSRS allows progression (vocabulary collection)
   */
  async recordWordAttempt(
    sessionId: string,
    gameType: string,
    attempt: WordAttempt,
    skipSpacedRepetition: boolean = false
  ): Promise<GemEvent | null> {
    const callId = Math.random().toString(36).substr(2, 9);

    // 🔧 FIX: Validate input parameters
    if (!sessionId || !gameType || !attempt) {
      console.error(`🚨 [SESSION SERVICE] Invalid parameters [${callId}]:`, { sessionId, gameType, attempt });
      return null;
    }

    // 🔧 FIX: Sanitize response time to ensure it's a valid number
    if (attempt.responseTimeMs && (isNaN(attempt.responseTimeMs) || attempt.responseTimeMs < 0)) {
      console.warn(`🚨 [SESSION SERVICE] Invalid response time [${callId}]: ${attempt.responseTimeMs}, setting to 0`);
      attempt.responseTimeMs = 0;
    }

    console.log(`🔮 [SESSION SERVICE] recordWordAttempt called [${callId}]:`, {
      sessionId,
      gameType,
      attempt: {
        vocabularyId: attempt.vocabularyId,
        wordText: attempt.wordText,
        wasCorrect: attempt.wasCorrect,
        responseTimeMs: attempt.responseTimeMs
      },
      skipSpacedRepetition
    });

    try {
      // Update session word counts in real-time
      await this.incrementSessionWordCounts(sessionId, attempt.wasCorrect);

      // Always log the word performance (non-blocking)
      console.log(`🔮 [SESSION SERVICE] Logging word performance [${callId}]...`);
      this.logWordPerformance(sessionId, attempt).catch(error => {
        console.warn('🚨 [SESSION SERVICE] Word performance logging failed (non-blocking):', error);
      });

      // ✅ UPDATE FSRS FOR ALL ANSWERS (both correct and incorrect)
      if (attempt.vocabularyId && !skipSpacedRepetition) {
        try {
          const studentId = await this.getSessionStudentId(sessionId);

          // Update FSRS for vocabulary tracking
          console.log('🔍 [ENHANCED SESSION] FSRS update:', {
            vocabularyId: attempt.vocabularyId,
            wasCorrect: attempt.wasCorrect,
            callId
          });

          await this.updateVocabularyDirectly(
            studentId,
            attempt.vocabularyId,
            attempt.wasCorrect,
            attempt.responseTimeMs
          );

          console.log('✅ [ENHANCED SESSION] FSRS update completed successfully');
        } catch (error) {
          // 🚨 CRITICAL: FSRS update failed - this means vocabulary mastery is not being tracked
          console.error('🚨 CRITICAL: FSRS update failed in recordWordAttempt:', {
            error,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            vocabularyId: attempt.vocabularyId,
            wasCorrect: attempt.wasCorrect,
            sessionId,
            callId,
            timestamp: new Date().toISOString()
          });

          // Alert in production
          if (typeof window !== 'undefined' && (window as any).Sentry) {
            (window as any).Sentry.captureException(error, {
              tags: {
                service: 'vocabulary_tracking',
                critical: true,
                function: 'recordWordAttempt'
              },
              extra: {
                vocabularyId: attempt.vocabularyId,
                wasCorrect: attempt.wasCorrect,
                sessionId,
                callId
              }
            });
          }

          // Re-throw to prevent silent data loss
          throw new Error(`FSRS vocabulary tracking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      // Only award gems for correct answers in non-assessment modes
      if (!attempt.wasCorrect) {
        console.log(`🔮 [SESSION SERVICE] Incorrect answer - no gems awarded [${callId}]`);
        return null;
      }

      console.log(`🔮 [SESSION SERVICE] Getting student ID for session [${callId}]...`);
      const studentId = await this.getSessionStudentId(sessionId);
      console.log(`🔮 [SESSION SERVICE] Student ID: ${studentId} [${callId}]`);

      let lastGemEvent: GemEvent | null = null;

      // 🎯 DUAL-TRACK SYSTEM: Always award Activity Gem for correct answers
      console.log(`🎮 [DUAL-TRACK] Awarding Activity Gem for correct answer [${callId}]`);
      const activityGemEvent = RewardEngine.createActivityGemEvent(
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

      console.log(`🔮 [SESSION SERVICE] Activity gem created [${callId}]:`, {
        rarity: activityGemEvent.rarity,
        xpValue: activityGemEvent.xpValue,
        wordText: activityGemEvent.wordText
      });

      // Store Activity Gem in database
      console.log(`🔮 [SESSION SERVICE] Storing Activity Gem in database [${callId}]...`);
      await this.storeGemEvent(sessionId, studentId, activityGemEvent, 'activity');
      lastGemEvent = activityGemEvent;

      // 💎 DUAL-TRACK SYSTEM: Conditionally award Mastery Gem based on FSRS progression
      if (attempt.vocabularyId && !skipSpacedRepetition) {
        const identifiers = parseVocabularyIdentifier(attempt.vocabularyId as any);

        if (!identifiers.isValid || !identifiers.raw) {
          console.error('🚨 [DUAL-TRACK] Invalid vocabularyId detected:', {
            vocabularyId: attempt.vocabularyId,
            parsed: identifiers,
            wordText: attempt.wordText,
            gameType
          });
          return null;
        }

        const columnValue = identifiers.isUUID
          ? identifiers.raw
          : identifiers.vocabularyItemId ?? Number(identifiers.raw);

        const canProgress = await this.checkIfWordCanProgress(
          studentId,
          columnValue,
          identifiers.isUUID
        );

        if (canProgress.allowed) {
          console.log('💎 [DUAL-TRACK] FSRS allows progression - awarding Mastery Gem');
          console.log('🔍 [DEBUG] canProgress data:', canProgress);
          const isFirstTime = canProgress.phase === 'new';
          console.log('🔍 [DEBUG] isFirstTime calculation:', { phase: canProgress.phase, isFirstTime });

          const masteryGemEvent = RewardEngine.createMasteryGemEvent(
            gameType,
            {
              responseTimeMs: attempt.responseTimeMs,
              streakCount: attempt.streakCount,
              hintUsed: attempt.hintUsed,
              isTypingMode: attempt.gameMode === 'typing',
              isDictationMode: attempt.gameMode === 'dictation',
              masteryLevel: attempt.masteryLevel,
              maxGemRarity: attempt.maxGemRarity,
              isFirstTime: isFirstTime // 🆕 DUAL-TRACK: Detect first-time words
            },
            {
              id: attempt.vocabularyId,
              word: attempt.wordText,
              translation: attempt.translationText
            },
            attempt.gameMode,
            attempt.difficultyLevel
          );

          // Store Mastery Gem in database
          await this.storeGemEvent(sessionId, studentId, masteryGemEvent, 'mastery');

          // Return the Mastery Gem as the primary event (for backward compatibility)
          lastGemEvent = masteryGemEvent;
        } else {
          console.log('⏰ [DUAL-TRACK] FSRS blocks progression - only Activity Gem awarded:', canProgress.reason);
        }
      }

      // Cache gem event for session summary (use the last/most important gem event)
      if (lastGemEvent) {
        this.gemEvents.push(lastGemEvent);
        console.log(`🔮 [SESSION SERVICE] Gem event cached for session summary [${callId}]:`, {
          rarity: lastGemEvent.rarity,
          xpValue: lastGemEvent.xpValue
        });
      }

      console.log(`🔮 [SESSION SERVICE] recordWordAttempt completed [${callId}]:`, {
        returnedGemEvent: !!lastGemEvent,
        gemRarity: lastGemEvent?.rarity,
        gemXP: lastGemEvent?.xpValue
      });

      return lastGemEvent;
    } catch (error) {
      console.error(`🔮 [SESSION SERVICE] Error recording word attempt [${callId}]:`, error);
      return null;
    }
  }

  /**
   * Store a gem event in the database with proper gem_type
   */
  private async storeGemEvent(
    sessionId: string,
    studentId: string,
    gemEvent: GemEvent,
    gemType: 'mastery' | 'activity'
  ): Promise<void> {
    const storeId = Math.random().toString(36).substr(2, 9);
    console.log(`💎 [STORE GEM] Starting to store gem event [${storeId}]:`, {
      sessionId,
      studentId,
      gemType,
      gemEvent: {
        vocabularyId: gemEvent.vocabularyId,
        wordText: gemEvent.wordText,
        rarity: gemEvent.rarity,
        xpValue: gemEvent.xpValue
      }
    });

    const insertData: any = {
      session_id: sessionId,
      student_id: studentId,
      gem_rarity: gemEvent.rarity,
      xp_value: gemEvent.xpValue,
      word_text: gemEvent.wordText,
      translation_text: gemEvent.translationText,
      response_time_ms: Math.round(gemEvent.responseTimeMs || 0), // 🔧 FIX: Round to integer for database
      streak_count: gemEvent.streakCount,
      hint_used: gemEvent.hintUsed,
      game_type: gemEvent.gameType,
      game_mode: gemEvent.gameMode,
      difficulty_level: gemEvent.difficultyLevel,
      gem_type: gemType
      // 🔧 FIXED: Use created_at (auto-timestamp) instead of earned_at
    };

    // Handle vocabulary IDs with validation - skip foreign key fields if no valid ID
    // For sentence-based games, don't set centralized_vocabulary_id (sentences table IDs don't exist in centralized_vocabulary)
    const sentenceBasedGames = ['sentence-towers', 'speed-builder', 'case-file-translator', 'lava-temple-word-restore'];
    const isSentenceGame = sentenceBasedGames.includes(gemEvent.gameType);

    if (gemEvent.vocabularyId && !isSentenceGame) {
      if (typeof gemEvent.vocabularyId === 'string') {
        // Check if it's a valid UUID format (contains hyphens and is 36 chars)
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(gemEvent.vocabularyId);

        if (isValidUUID) {
          // Valid UUID format - use centralized_vocabulary_id
          insertData.centralized_vocabulary_id = gemEvent.vocabularyId;
        } else {
          console.warn('🚨 Invalid vocabulary ID format (not a valid UUID):', gemEvent.vocabularyId);
          // Don't include vocabulary ID to avoid foreign key errors
        }
      } else if (!isNaN(Number(gemEvent.vocabularyId))) {
        // Integer format - use legacy vocabulary_id
        insertData.vocabulary_id = parseInt(gemEvent.vocabularyId.toString());
      } else {
        console.warn('🚨 Invalid vocabulary ID format (not UUID or integer):', gemEvent.vocabularyId);
        // Don't include vocabulary ID to avoid foreign key errors
      }
    } else if (isSentenceGame) {
      console.log(`💎 [SENTENCE GAME] Skipping centralized_vocabulary_id for sentence-based game: ${gemEvent.gameType}`);
      // Don't set centralized_vocabulary_id for sentence games - sentences table IDs don't exist in centralized_vocabulary
    } else {
      console.log('💎 No vocabulary ID provided - storing gem without vocabulary reference');
      // This is fine - we can store gems without vocabulary references
    }

    console.log(`💎 [STORE GEM] Inserting into gem_events table [${storeId}]:`, insertData);

    // Try insert into gem_events table
    const { data, error: insertError } = await this.supabase
      .from('gem_events')
      .insert(insertData)
      .select();

    console.log(`💎 [STORE GEM] Database insert result [${storeId}]:`, {
      success: !insertError,
      error: insertError?.message,
      errorCode: insertError?.code,
      insertedData: data
    });

    if (insertError) {
      console.error(`💎 [STORE GEM] Error storing gem event [${storeId}]:`, insertError);
      // Don't throw error - log it but continue
    } else {
      console.log(`💎 [STORE GEM] Successfully stored ${gemType} gem [${storeId}]: ${gemEvent.rarity} (${gemEvent.xpValue} XP) for "${gemEvent.wordText}"`);
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
        .select('gems_total, gems_by_rarity, gem_events_count, assignment_id, student_id, game_type')
        .eq('id', sessionId)
        .single();

      // Calculate XP from gems (overrides any passed XP)
      const totalXP = sessionData?.gems_total ?
        await this.calculateXPFromGems(sessionId) :
        finalData.xp_earned || 0;

      // 🔧 FIX: Auto-calculate accuracy_percentage from words_correct / words_attempted
      // This ensures accuracy is always set correctly, even if games don't pass it explicitly
      const calculatedAccuracy = finalData.words_attempted && finalData.words_attempted > 0
        ? (finalData.words_correct || 0) / finalData.words_attempted * 100
        : 0;
      const accuracyToStore = finalData.accuracy_percentage ?? calculatedAccuracy;

      // Update session with final data
      const { error } = await this.supabase
        .from('enhanced_game_sessions')
        .update({
          ended_at: new Date().toISOString(),
          completion_status: finalData.completion_percentage >= 100 ? 'completed' : 'in_progress',
          duration_seconds: finalData.duration_seconds,
          final_score: finalData.final_score,
          max_score_possible: finalData.max_score_possible,
          accuracy_percentage: accuracyToStore,
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

      // 🎯 NEW: Check and update game completion status (dual-criteria)
      if (sessionData?.assignment_id && sessionData?.student_id && sessionData?.game_type) {
        try {
          const { GameCompletionService } = await import('../assignments/GameCompletionService');
          const gameCompletionService = new GameCompletionService(this.supabase);

          await gameCompletionService.updateGameCompletionStatus(
            sessionData.assignment_id,
            sessionData.student_id,
            sessionData.game_type
          );

          console.log(`✅ [GAME COMPLETION] Checked completion for ${sessionData.game_type}`);

          // 🎯 NEW: Update enhanced_assignment_progress table
          await this.updateAssignmentProgress(
            sessionData.assignment_id,
            sessionData.student_id,
            finalData
          );

          console.log(`✅ [ASSIGNMENT PROGRESS] Updated assignment progress`);
        } catch (completionError) {
          console.error('Error checking game completion:', completionError);
          // Don't throw - this is a non-critical operation
        }
      }

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
    studentId?: string,
    gemType: 'mastery' | 'activity' = 'activity'
  ): Promise<void> {
    try {
      const student_id = studentId || await this.getSessionStudentId(sessionId);
      const xpValue = gemType === 'activity'
        ? RewardEngine.getActivityGemXP(rarity)
        : RewardEngine.getXPValue(rarity);

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
          game_mode: 'bonus',
          gem_type: gemType
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
          (gemBreakdown || []).map(g => ({
            rarity: g.gem_rarity as GemRarity,
            xpValue: g.xp_value ?? 0,
            responseTimeMs: 0,
            streakCount: 0,
            hintUsed: false,
            gameType: 'summary'
          }))
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
          // Validate UUID format
          const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(attempt.vocabularyId);

          if (isValidUUID) {
            // Valid UUID from centralized_vocabulary
            centralizedVocabularyId = attempt.vocabularyId;
          } else {
            console.warn('🚨 Invalid vocabulary ID format in word performance logging:', attempt.vocabularyId);
            // Continue without vocabulary ID to avoid database errors
          }
        } else if (!isNaN(Number(attempt.vocabularyId))) {
          // Integer from legacy vocabulary_items
          legacyVocabularyId = attempt.vocabularyId;
        } else {
          console.warn('🚨 Invalid vocabulary ID format (not UUID or integer):', attempt.vocabularyId);
        }
      } else {
        console.log('📝 No vocabulary ID provided - logging performance without vocabulary reference');
        // This is fine - we can log performance without vocabulary references
      }

      // Try insert first, handle conflicts gracefully
      const logData: any = {
        session_id: sessionId,
        word_text: attempt.wordText,
        translation_text: attempt.translationText,
        language_pair: 'english_spanish', // TODO: Make dynamic
        attempt_number: 1,
        response_time_ms: Math.round(attempt.responseTimeMs || 0), // 🔧 FIX: Round to integer for database
        was_correct: attempt.wasCorrect,
        confidence_level: (attempt.responseTimeMs || 0) < 2000 ? 5 :
          (attempt.responseTimeMs || 0) < 4000 ? 4 :
            (attempt.responseTimeMs || 0) < 6000 ? 3 : 2,
        difficulty_level: attempt.difficultyLevel || 'medium',
        hint_used: attempt.hintUsed,
        streak_count: attempt.streakCount,
        previous_attempts: 0,
        mastery_level: attempt.masteryLevel || 0
      };

      // Only add vocabulary IDs if they're valid to avoid foreign key errors
      if (legacyVocabularyId) {
        logData.vocabulary_id = legacyVocabularyId;
      }
      if (centralizedVocabularyId) {
        logData.centralized_vocabulary_id = centralizedVocabularyId;
      }

      const { error: logError } = await this.supabase
        .from('word_performance_logs')
        .insert(logData);

      if (logError) {
        // If it's a conflict error, try upsert
        if (logError.code === '23505' || logError.message?.includes('duplicate')) {
          console.log('🔄 Word performance log conflict detected, attempting upsert...');
          const { error: upsertError } = await this.supabase
            .from('word_performance_logs')
            .upsert(logData, { onConflict: 'session_id,centralized_vocabulary_id,word_text' });

          if (upsertError) {
            console.warn('🚨 Word performance log upsert also failed:', upsertError);
          }
        } else {
          console.warn('🚨 Word performance log insert failed:', logError);
        }
      }
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
      const identifiers = parseVocabularyIdentifier(vocabularyId as any);

      if (!identifiers.isValid || !identifiers.raw) {
        console.error('🚨 [VOCABULARY UPDATE] Invalid vocabularyId detected:', {
          vocabularyId,
          parsed: identifiers,
          studentId
        });
        return;
      }

      // ✅ FSRS TIME-GATED PROGRESSION: Check if word is due for review
      const lookupValue = identifiers.isUUID
        ? identifiers.raw
        : identifiers.vocabularyItemId ?? Number(identifiers.raw);

      const canProgress = await this.checkIfWordCanProgress(
        studentId,
        lookupValue,
        identifiers.isUUID
      );

      if (!canProgress.allowed) {
        console.log('⏰ [FSRS GATE] Word not due for review, treating as practice:', {
          vocabularyId: identifiers.raw,
          reason: canProgress.reason,
          nextReviewAt: canProgress.nextReviewAt
        });

        // For words not due for review, we can still log the practice but don't update FSRS
        // This prevents "cramming" from accelerating long-term progression
        return;
      }

      console.log('✅ [FSRS GATE] Word is due for review, allowing progression:', {
        vocabularyId: identifiers.raw,
        phase: canProgress.phase,
        state: canProgress.state
      });

      // Call atomic function directly with correct parameter mapping
      // The atomic function expects p_vocabulary_item_id as UUID, not integer
      const { error } = await this.supabase.rpc('update_vocabulary_gem_collection_atomic', {
        p_student_id: studentId,
        p_was_correct: wasCorrect,
        p_centralized_vocabulary_id: identifiers.centralizedVocabularyId,
        p_vocabulary_item_id: identifiers.isUUID ? identifiers.centralizedVocabularyId : null,
        p_response_time_ms: Math.round(responseTimeMs), // 🔧 FIX: Round to prevent floating-point errors
        p_hint_used: false,
        p_streak_count: 0
      });

      if (error) {
        // 🚨 CRITICAL ERROR: Vocabulary tracking failed
        console.error('🚨 CRITICAL: Vocabulary update failed:', {
          error,
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details,
          errorHint: error.hint,
          studentId,
          vocabularyId: identifiers.raw,
          vocabularyItemId: identifiers.vocabularyItemId,
          centralizedVocabularyId: identifiers.centralizedVocabularyId,
          wasCorrect,
          responseTimeMs,
          timestamp: new Date().toISOString(),
          stackTrace: new Error().stack
        });

        // Alert developers in production via Sentry (if available)
        if (typeof window !== 'undefined' && (window as any).Sentry) {
          (window as any).Sentry.captureException(error, {
            tags: {
              service: 'vocabulary_tracking',
              critical: true,
              function: 'updateVocabularyDirectly'
            },
            extra: {
              studentId,
              vocabularyId: identifiers.raw,
              wasCorrect,
              errorCode: error.code
            }
          });
        }

        // Throw error to prevent silent failures
        throw new Error(`Vocabulary tracking failed: ${error.message} (Code: ${error.code})`);
      }

      console.log('✅ [DIRECT UPDATE] Vocabulary updated successfully:', {
        vocabularyId: identifiers.raw,
        wasCorrect,
        studentId,
        phase: canProgress.phase
      });

    } catch (error) {
      console.error('🚨 [VOCABULARY UPDATE] Exception caught:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        studentId,
        vocabularyId,
        timestamp: new Date().toISOString()
      });

      // Re-throw to ensure calling code knows the update failed
      throw error;
    }
  }

  /**
   * ✅ FSRS TIME-GATED PROGRESSION: Check if a word can progress based on FSRS rules
   * Learning phase: Rapid progression allowed (short intervals)
   * Review phase: Only when due (respects next_review_at)
   */
  private async checkIfWordCanProgress(
    studentId: string,
    vocabularyId: string | number,
    isUUID: boolean
  ): Promise<{
    allowed: boolean;
    reason: string;
    phase: 'learning' | 'review' | 'new';
    state: string;
    nextReviewAt?: string;
  }> {
    try {
      // 🔧 FIX: Validate input parameters
      if (!studentId || !vocabularyId) {
        console.error('🚨 [FSRS GATE] Invalid parameters:', { studentId, vocabularyId });
        return {
          allowed: false,
          reason: 'Invalid parameters',
          phase: 'new',
          state: 'error'
        };
      }

      // Get current word state including encounter count
      const { data: wordData, error } = await this.supabase
        .from('vocabulary_gem_collection')
        .select('fsrs_state, next_review_at, fsrs_review_count, total_encounters')
        .eq('student_id', studentId)
        .eq(isUUID ? 'centralized_vocabulary_id' : 'vocabulary_item_id', vocabularyId)
        .maybeSingle(); // Use maybeSingle() since new words won't have records

      if (error) {
        console.error('🚨 [FSRS GATE] Database error:', error);
        // Allow progression on database errors to avoid blocking gameplay
        return {
          allowed: true,
          reason: 'Database error - allowing progression',
          phase: 'new',
          state: 'error'
        };
      }

      if (!wordData) {
        // New word - always allow progression
        return {
          allowed: true,
          reason: 'New word - first encounter',
          phase: 'new',
          state: 'new'
        };
      }

      const safeWordData = wordData as NonNullable<typeof wordData>;

      const now = new Date();
      const nextReview = safeWordData.next_review_at ? new Date(safeWordData.next_review_at) : null;
      const state = safeWordData.fsrs_state || 'new';
      const reviewCount = safeWordData.fsrs_review_count || 0;
      const totalEncounters = safeWordData.total_encounters || 0;

      // 🆕 DUAL-TRACK FIX: Use total_encounters to determine if truly first time
      // Note: total_encounters is incremented BEFORE gem logic, so first encounter = 1
      const isFirstEncounter = totalEncounters === 1;

      // 🆕 DUAL-TRACK FIX: Correct Mastery Gem logic

      // FIRST ENCOUNTER: Always award "New Discovery" Mastery Gem
      if (isFirstEncounter) {
        return {
          allowed: true,
          reason: 'New word - first encounter',
          phase: 'new',
          state,
          nextReviewAt: safeWordData.next_review_at
        };
      }

      // SUBSEQUENT ENCOUNTERS: Only award Mastery Gem if review is due
      if (!nextReview || now >= nextReview) {
        return {
          allowed: true,
          reason: 'Word is due for review',
          phase: state === 'new' || state === 'learning' ? 'learning' : 'review',
          state,
          nextReviewAt: safeWordData.next_review_at
        };
      } else {
        return {
          allowed: false,
          reason: 'Word not yet due for review',
          phase: state === 'new' || state === 'learning' ? 'learning' : 'review',
          state,
          nextReviewAt: safeWordData.next_review_at
        };
      }

      // Note: All other cases are handled above - this should not be reached

      // Default: allow progression
      return {
        allowed: true,
        reason: 'Unknown state - allowing progression',
        phase: 'review',
        state,
        nextReviewAt: safeWordData?.next_review_at
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
      const { data: profile, error: fetchError } = await this.supabase
        .from('student_profiles')
        .select('total_xp')
        .eq('student_id', studentId)
        .single();

      if (fetchError || !profile) {
        console.warn('Student profile not found, skipping XP update');
        return;
      }

      const { error: updateError } = await this.supabase
        .from('student_profiles')
        .update({
          total_xp: (profile.total_xp || 0) + xpAmount
        })
        .eq('student_id', studentId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating student XP:', error);
    }
  }

  /**
   * Update enhanced_assignment_progress table with session results
   */
  private async updateAssignmentProgress(
    assignmentId: string,
    studentId: string,
    finalData: GameSessionData
  ): Promise<void> {
    try {
      // Get current progress
      const { data: currentProgress } = await this.supabase
        .from('enhanced_assignment_progress')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .single();

      // Calculate if this is a better score
      const currentBestScore = currentProgress?.best_score || 0;
      const newScore = finalData.final_score || 0;
      const isBetterScore = newScore > currentBestScore;

      // Get all game sessions for this assignment to calculate total time
      const { data: sessions } = await this.supabase
        .from('enhanced_game_sessions')
        .select('duration_seconds')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      const totalTimeSpent = (sessions || []).reduce((sum, s) => sum + (s.duration_seconds || 0), 0);

      // Use GameCompletionService to check completion status
      const gameCompletionService = new GameCompletionService(this.supabase);

      // Get all games in this assignment
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('game_config, game_type')
        .eq('id', assignmentId)
        .single();

      // Get list of games to check
      const gamesToCheck: string[] = [];

      if (assignment?.game_config?.selectedGames) {
        gamesToCheck.push(...Object.keys(assignment.game_config.selectedGames));
      }

      if (assignment?.game_config?.selectedAssessments) {
        // 🎯 FIX: Use 'id' or 'type' from selectedAssessments, not 'activity_id'
        gamesToCheck.push(...assignment.game_config.selectedAssessments.map((a: any) => a.id || a.type));
      }

      // Check completion for each game
      let allGamesCompleted = gamesToCheck.length > 0;

      for (const gameId of gamesToCheck) {
        const completionStatus = await gameCompletionService.checkGameCompletion(
          assignmentId,
          studentId,
          gameId
        );

        if (!completionStatus.isComplete) {
          allGamesCompleted = false;
          break;
        }
      }

      const status = allGamesCompleted ? 'completed' :
        (currentProgress?.status === 'completed' ? 'completed' :
          (newScore > 0 ? 'in_progress' : 'not_started'));

      // Update the progress
      const updateData: any = {
        assignment_id: assignmentId,
        student_id: studentId,
        status,
        total_time_spent: totalTimeSpent,
        session_count: (currentProgress?.session_count || 0) + 1,
        updated_at: new Date().toISOString()
      };

      // Only update best score/accuracy if this session is better
      if (isBetterScore || !currentProgress) {
        updateData.best_score = newScore;
        // 🔧 FIX: Calculate accuracy from words_correct / words_attempted
        const calculatedAccuracy = finalData.words_attempted && finalData.words_attempted > 0
          ? ((finalData.words_correct || 0) / finalData.words_attempted) * 100
          : 0;
        updateData.best_accuracy = finalData.accuracy_percentage ?? calculatedAccuracy;
      }

      // Mark as completed if all games are done
      if (allGamesCompleted && status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await this.supabase
        .from('enhanced_assignment_progress')
        .upsert(updateData, {
          onConflict: 'assignment_id,student_id'
        });

      if (error) {
        console.error('Error updating assignment progress:', error);
        throw error;
      }

      console.log(`✅ [ASSIGNMENT PROGRESS] Updated:`, {
        assignmentId,
        studentId,
        status,
        bestScore: updateData.best_score || currentBestScore,
        totalTime: totalTimeSpent,
        allGamesCompleted
      });
    } catch (error) {
      console.error('Error in updateAssignmentProgress:', error);
      throw error;
    }
  }
}

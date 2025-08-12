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

      // Award gem for correct sentence
      const gemEvent = await this.rewardEngine.awardGem(
        await this.getSessionStudentId(sessionId),
        gameType,
        {
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
          difficultyLevel: attempt.difficultyLevel || 'intermediate'
        }
      );

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
    attempt: WordAttempt
  ): Promise<GemEvent | null> {
    try {
      // Always log the word performance
      await this.logWordPerformance(sessionId, attempt);
      
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
      
      // Update SRS data if vocabulary ID is available
      if (attempt.vocabularyId) {
        const studentId = await this.getSessionStudentId(sessionId);

        // 🔍 INSTRUMENTATION: Log SRS update details
        console.log('🔍 [SRS UPDATE] Starting SRS progress update:', {
          studentId,
          vocabularyId: attempt.vocabularyId,
          vocabularyIdType: typeof attempt.vocabularyId,
          wasCorrect: attempt.wasCorrect,
          responseTimeMs: attempt.responseTimeMs,
          sessionId
        });

        await this.updateSRSProgress(
          studentId,
          attempt.vocabularyId,
          attempt.wasCorrect,
          attempt.responseTimeMs
        );

        console.log('🔍 [SRS UPDATE] SRS progress update completed successfully');
      } else {
        console.log('🔍 [SRS UPDATE] Skipping SRS update - no vocabularyId provided');
      }
      
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
  
  private async updateSRSProgress(
    studentId: string,
    vocabularyId: string | number,
    wasCorrect: boolean,
    responseTimeMs: number
  ): Promise<void> {
    try {
      // Convert vocabularyId to string for consistency
      const vocabIdString = vocabularyId?.toString();
      if (!vocabIdString) return;

      // Instantiate the SpacedRepetitionService (singleton import was not available)
      const { SpacedRepetitionService } = await import('../spacedRepetitionService');
      const srs = new SpacedRepetitionService(this.supabase);
      await srs.updateProgress(
        studentId,
        vocabIdString,
        wasCorrect,
        responseTimeMs
      );
    } catch (error) {
      console.error('Error updating SRS progress:', error);
    }
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

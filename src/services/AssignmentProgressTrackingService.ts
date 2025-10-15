/**
 * Assignment Progress Tracking Service
 * 
 * Provides enhanced progress tracking for assignments including:
 * - Partial progress calculation based on activity
 * - Word-level mastery tracking
 * - Outstanding word filtering
 * - Session analytics
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface GameActivityMetrics {
  gameId: string;
  gameName: string;
  
  // Completion status
  status: 'not_started' | 'in_progress' | 'completed';
  completed: boolean;
  progressPercentage: number;
  
  // Session metrics
  sessionsStarted: number;
  lastPlayedAt: Date | null;
  totalTimeSpent: number; // seconds
  
  // Word/vocabulary metrics
  wordsAttempted: number;
  wordsCorrect: number;
  uniqueWordsPracticed: number;
  accuracy: number;
  
  // Rewards
  gemsEarned: number;
  
  // Scores
  bestScore: number;
  maxScore: number;
  
  // Completion data
  completedAt: Date | null;
}

export interface WordMasteryStatus {
  vocabularyId: string;
  word: string;
  translation: string;
  
  // Mastery metrics
  totalEncounters: number;
  correctEncounters: number;
  incorrectEncounters: number;
  accuracy: number;
  
  // Status
  isMastered: boolean; // High accuracy + multiple encounters
  needsPractice: boolean; // Low accuracy or few encounters
  lastEncounteredAt: Date | null;
  
  // FSRS data
  masteryLevel: number; // 0-5
  nextReviewAt: Date | null;
}

export interface OutstandingWordsFilter {
  assignmentId: string;
  studentId: string;
  
  // Filter options
  excludeMastered?: boolean; // Exclude words with high mastery
  excludeSeen?: boolean; // Exclude any words that have been seen
  minAccuracyThreshold?: number; // Only include words below this accuracy (default: 80%)
  minEncountersForMastery?: number; // Encounters needed to consider mastered (default: 3)
}

export class AssignmentProgressTrackingService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get enhanced progress metrics for a specific game within an assignment
   */
  async getGameProgress(
    assignmentId: string,
    studentId: string,
    gameId: string
  ): Promise<GameActivityMetrics> {
    try {
      // Get assignment details - we only need vocabulary_count now (not repetitions_required)
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('vocabulary_count')
        .eq('id', assignmentId)
        .single();

      const vocabularyCount = assignment?.vocabulary_count || 10;

      // NEW EXPOSURE-BASED SYSTEM: Total required = vocabulary count (1 exposure per word)
      const totalRequiredExposures = vocabularyCount;

      // Get all sessions for this game (for activity metrics like time, gems, etc.)
      const { data: sessions, error: sessionsError } = await this.supabase
        .from('enhanced_game_sessions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .eq('game_type', gameId)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // NEW: Get unique exposed words count from assignment_word_exposure table
      const { data: exposureData, error: exposureError } = await this.supabase
        .from('assignment_word_exposure')
        .select('centralized_vocabulary_id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      if (exposureError) {
        console.error('Error fetching exposure data:', exposureError);
      }

      const uniqueWordsExposed = exposureData?.length || 0;

      // Get game completion status from assignment_game_progress
      const { data: gameProgress } = await this.supabase
        .from('assignment_game_progress')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .eq('game_id', gameId)
        .maybeSingle();

      // Calculate activity metrics (from sessions)
      const sessionsStarted = sessions?.length || 0;
      const totalTimeSpent = sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0;
      const gemsEarned = sessions?.reduce((sum, s) => sum + (s.gems_total || 0), 0) || 0;
      const wordsAttempted = sessions?.reduce((sum, s) => sum + (s.words_attempted || 0), 0) || 0;
      const wordsCorrect = sessions?.reduce((sum, s) => sum + (s.words_correct || 0), 0) || 0;

      const accuracy = wordsAttempted > 0 ? Math.round((wordsCorrect / wordsAttempted) * 100) : 0;
      const lastPlayedAt = sessions && sessions.length > 0 ? new Date(sessions[0].created_at) : null;

      // Determine completion status
      const completed = gameProgress?.status === 'completed' || gameProgress?.completed === true;
      let status: 'not_started' | 'in_progress' | 'completed';

      if (completed) {
        status = 'completed';
      } else if (sessionsStarted > 0) {
        status = 'in_progress';
      } else {
        status = 'not_started';
      }

      // Calculate progress percentage using EXPOSURE-BASED system
      const progressPercentage = this.calculateProgressPercentage({
        sessionsStarted,
        uniqueWordsExposed,  // NEW: Use exposed words instead of words attempted
        accuracy,
        completed,
        totalTimeSpent,
        totalRequiredExposures
      });

      console.log(`📊 [PROGRESS] Game progress for ${gameId}:`, {
        assignmentId,
        studentId,
        uniqueWordsExposed,
        totalRequiredExposures,
        progressPercentage,
        status
      });

      return {
        gameId,
        gameName: gameId, // Will be mapped to friendly name in UI
        status,
        completed,
        progressPercentage,
        sessionsStarted,
        lastPlayedAt,
        totalTimeSpent,
        wordsAttempted,
        wordsCorrect,
        uniqueWordsPracticed: uniqueWordsExposed, // NEW: Use exposure count
        accuracy,
        gemsEarned,
        bestScore: gameProgress?.score || 0,
        maxScore: 100, // Default, can be customized per game
        completedAt: gameProgress?.completed_at ? new Date(gameProgress.completed_at) : null
      };
    } catch (error) {
      console.error('Error getting game progress:', error);
      throw error;
    }
  }

  /**
   * Calculate progress percentage based on EXPOSURE (not attempts)
   * NEW EXPOSURE-BASED MODEL: Simple, linear progress based on unique words exposed
   * Mastery/quality is tracked separately via Layer 3 (vocabulary_gem_collection)
   */
  private calculateProgressPercentage(metrics: {
    sessionsStarted: number;
    uniqueWordsExposed: number;  // CHANGED: Use exposed words instead of attempts
    accuracy: number;
    completed: boolean;
    totalTimeSpent: number;
    totalRequiredExposures?: number; // Total vocabulary count
  }): number {
    if (metrics.completed) return 100;
    if (metrics.sessionsStarted === 0) return 0;

    // EXPOSURE-BASED PROGRESS: Based purely on unique words exposed
    // Default to 50 words if not specified (backward compatibility)
    const requiredExposures = metrics.totalRequiredExposures || 50;

    // Linear progress: unique_words_exposed / total_vocabulary_count
    const progress = (metrics.uniqueWordsExposed / requiredExposures) * 100;

    // Cap at 99% until actually marked as completed
    return Math.min(Math.round(progress), 99);
  }

  /**
   * Get word-level mastery status for an assignment
   */
  async getWordMasteryStatus(
    assignmentId: string,
    studentId: string
  ): Promise<WordMasteryStatus[]> {
    try {
      // Get all vocabulary items for this student
      const { data: vocabCollection, error } = await this.supabase
        .from('vocabulary_gem_collection')
        .select(`
          id,
          vocabulary_item_id,
          centralized_vocabulary_id,
          total_encounters,
          correct_encounters,
          incorrect_encounters,
          mastery_level,
          last_encountered_at,
          next_review_at,
          centralized_vocabulary:centralized_vocabulary_id (
            id,
            word,
            translation
          )
        `)
        .eq('student_id', studentId);

      if (error) throw error;

      return (vocabCollection || []).map(item => {
        const accuracy = item.total_encounters > 0
          ? Math.round((item.correct_encounters / item.total_encounters) * 100)
          : 0;

        // Mastery criteria: 80%+ accuracy AND 3+ encounters
        const isMastered = accuracy >= 80 && item.total_encounters >= 3;
        const needsPractice = accuracy < 60 || item.total_encounters < 3;

        const vocabData = Array.isArray(item.centralized_vocabulary)
          ? item.centralized_vocabulary[0]
          : item.centralized_vocabulary;

        return {
          vocabularyId: item.centralized_vocabulary_id || item.vocabulary_item_id,
          word: vocabData?.word || 'Unknown',
          translation: vocabData?.translation || 'Unknown',
          totalEncounters: item.total_encounters || 0,
          correctEncounters: item.correct_encounters || 0,
          incorrectEncounters: item.incorrect_encounters || 0,
          accuracy,
          isMastered,
          needsPractice,
          lastEncounteredAt: item.last_encountered_at ? new Date(item.last_encountered_at) : null,
          masteryLevel: item.mastery_level || 0,
          nextReviewAt: item.next_review_at ? new Date(item.next_review_at) : null
        };
      });
    } catch (error) {
      console.error('Error getting word mastery status:', error);
      throw error;
    }
  }

  /**
   * Get outstanding words that need practice
   * Filters out mastered words and returns only those needing attention
   */
  async getOutstandingWords(
    filter: OutstandingWordsFilter
  ): Promise<any[]> {
    try {
      const {
        assignmentId,
        studentId,
        excludeMastered = true,
        excludeSeen = false,
        minAccuracyThreshold = 80,
        minEncountersForMastery = 3
      } = filter;

      // Get assignment vocabulary
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('vocabulary_list_id, vocabulary_criteria')
        .eq('id', assignmentId)
        .single();

      if (!assignment) throw new Error('Assignment not found');

      // Get all vocabulary for this assignment
      let allVocabulary: any[] = [];

      if (assignment.vocabulary_list_id) {
        // Load from vocabulary list
        const { data: listItems } = await this.supabase
          .from('vocabulary_list_items')
          .select(`
            centralized_vocabulary:centralized_vocabulary_id (
              id, word, translation, category, subcategory, audio_url
            )
          `)
          .eq('list_id', assignment.vocabulary_list_id);

        allVocabulary = (listItems || []).map(item => 
          Array.isArray(item.centralized_vocabulary) 
            ? item.centralized_vocabulary[0] 
            : item.centralized_vocabulary
        ).filter(Boolean);
      }

      // Get student's mastery data
      const masteryData = await this.getWordMasteryStatus(assignmentId, studentId);
      const masteryMap = new Map(
        masteryData.map(m => [m.vocabularyId, m])
      );

      // Filter vocabulary based on criteria
      const outstandingWords = allVocabulary.filter(vocab => {
        const mastery = masteryMap.get(vocab.id);

        // If excludeSeen is true, exclude any word that has been encountered
        if (excludeSeen && mastery && mastery.totalEncounters > 0) {
          return false;
        }

        // If excludeMastered is true, exclude mastered words
        if (excludeMastered && mastery) {
          const isMastered = 
            mastery.accuracy >= minAccuracyThreshold && 
            mastery.totalEncounters >= minEncountersForMastery;
          
          if (isMastered) return false;
        }

        return true;
      });

      console.log('📊 Outstanding words filter:', {
        assignmentId,
        totalWords: allVocabulary.length,
        outstandingWords: outstandingWords.length,
        excludeMastered,
        excludeSeen,
        masteredCount: masteryData.filter(m => m.isMastered).length
      });

      return outstandingWords;
    } catch (error) {
      console.error('Error getting outstanding words:', error);
      throw error;
    }
  }
}


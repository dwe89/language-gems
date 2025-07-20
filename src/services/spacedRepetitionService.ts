// Spaced Repetition Service for VocabMaster
// Based on the SuperMemo SM-2 algorithm with optimizations for vocabulary learning

import { SupabaseClient } from '@supabase/supabase-js';

export interface SpacedRepetitionData {
  vocabulary_id: number;
  user_id: string;
  interval: number;
  repetition: number;
  easeFactor: number;
  quality: number;
  nextReview: Date;
  lastReview: Date;
}

export interface ReviewQuality {
  BLACKOUT: 0;
  INCORRECT: 1;
  HARD: 2;
  GOOD: 3;
  EASY: 4;
  PERFECT: 5;
}

export const REVIEW_QUALITY: ReviewQuality = {
  BLACKOUT: 0,
  INCORRECT: 1, 
  HARD: 2,
  GOOD: 3,
  EASY: 4,
  PERFECT: 5
};

export class SpacedRepetitionService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Calculate the next review interval using SuperMemo SM-2 algorithm
   * @param previousData Previous spaced repetition data
   * @param quality Quality of the response (0-5)
   * @returns Updated spaced repetition data
   */
  calculateNextReview(
    previousData: Partial<SpacedRepetitionData>,
    quality: number
  ): SpacedRepetitionData {
    // Initialize default values for new words
    let interval = previousData.interval || 0;
    let repetition = previousData.repetition || 0;
    let easeFactor = previousData.easeFactor || 2.5;

    // Update ease factor
    easeFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    // Calculate new interval
    if (quality < 3) {
      // Reset for poor performance
      repetition = 0;
      interval = 1;
    } else {
      repetition += 1;
      
      if (repetition === 1) {
        interval = 1;
      } else if (repetition === 2) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return {
      vocabulary_id: previousData.vocabulary_id!,
      user_id: previousData.user_id!,
      interval,
      repetition,
      easeFactor,
      quality,
      nextReview,
      lastReview: new Date()
    };
  }

  /**
   * Get words that are due for review
   * @param userId User ID
   * @param limit Maximum number of words to return
   * @returns Array of vocabulary words due for review
   */
  async getWordsForReview(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('vocabulary_gem_collection')
        .select(`
          *,
          vocabulary_items (
            id, spanish, english, theme, topic, part_of_speech,
            image_url, audio_url, example_sentence
          )
        `)
        .eq('student_id', userId)
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching words for review:', error);
      return [];
    }
  }

  /**
   * Get new words for learning
   * @param userId User ID  
   * @param limit Maximum number of words to return
   * @param filters Optional filters (theme, topic, etc.)
   * @returns Array of new vocabulary words
   */
  async getNewWords(
    userId: string, 
    limit: number = 10,
    filters?: { theme?: string; topic?: string; difficulty?: string }
  ): Promise<any[]> {
    try {
      let query = this.supabase
        .from('vocabulary_items')
        .select('*')
        .not('id', 'in', 
          `(SELECT vocabulary_item_id FROM vocabulary_gem_collection WHERE student_id = '${userId}')`
        );

      // Apply filters
      if (filters?.theme) {
        query = query.contains('theme_tags', [filters.theme]);
      }
      if (filters?.topic) {
        query = query.contains('topic_tags', [filters.topic]);
      }

      query = query.order('frequency_score', { ascending: false }).limit(limit);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching new words:', error);
      return [];
    }
  }

  /**
   * Get words the user struggles with most
   * @param userId User ID
   * @param limit Maximum number of words to return
   * @returns Array of difficult vocabulary words
   */
  async getWeakWords(userId: string, limit: number = 15): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('vocabulary_gem_collection')
        .select(`
          *,
          vocabulary_items (
            id, spanish, english, theme, topic, part_of_speech,
            image_url, audio_url, example_sentence
          )
        `)
        .eq('student_id', userId)
        .lt('spaced_repetition_ease_factor', 2.0) // Low ease factor indicates difficulty
        .order('spaced_repetition_ease_factor', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching weak words:', error);
      return [];
    }
  }

  /**
   * Update user progress after a practice session
   * @param userId User ID
   * @param vocabularyId Vocabulary word ID
   * @param quality Quality of the response (0-5)
   * @param responseTime Response time in milliseconds
   */
  async updateProgress(
    userId: string,
    vocabularyId: number,
    quality: number,
    responseTime: number = 0
  ): Promise<void> {
    try {
      // Get existing progress
      const { data: existingData } = await this.supabase
        .from('vocabulary_gem_collection')
        .select('*')
        .eq('student_id', userId)
        .eq('vocabulary_item_id', vocabularyId)
        .single();

      // Calculate new spaced repetition data
      const updatedData = this.calculateNextReview(
        existingData || { 
          vocabulary_id: vocabularyId, 
          user_id: userId,
          interval: 0,
          repetition: 0,
          easeFactor: 2.5
        },
        quality
      );

      // Determine mastery level
      const masteryLevel = this.calculateMasteryLevel(
        existingData?.total_encounters || 0,
        existingData?.correct_encounters || 0,
        quality,
        updatedData.easeFactor
      );

      // Update or insert progress
      await this.supabase
        .from('vocabulary_gem_collection')
        .upsert({
          student_id: userId,
          vocabulary_item_id: vocabularyId,
          total_encounters: (existingData?.total_encounters || 0) + 1,
          correct_encounters: (existingData?.correct_encounters || 0) + (quality >= 3 ? 1 : 0),
          current_streak: quality >= 3 ? (existingData?.current_streak || 0) + 1 : 0,
          best_streak: quality >= 3 
            ? Math.max(existingData?.best_streak || 0, (existingData?.current_streak || 0) + 1)
            : existingData?.best_streak || 0,
          last_encountered_at: new Date().toISOString(),
          next_review_at: updatedData.nextReview.toISOString(),
          spaced_repetition_interval: updatedData.interval,
          spaced_repetition_ease_factor: updatedData.easeFactor,
          mastery_level: masteryLevel,
          difficulty_rating: this.calculateDifficulty(updatedData.easeFactor, responseTime)
        });

      // Also update simplified progress table
      await this.supabase
        .from('user_vocabulary_progress')
        .upsert({
          user_id: userId,
          vocabulary_id: vocabularyId,
          times_seen: (existingData?.total_encounters || 0) + 1,
          times_correct: (existingData?.correct_encounters || 0) + (quality >= 3 ? 1 : 0),
          last_seen: new Date().toISOString(),
          is_learned: masteryLevel >= 3 // Consider learned at mastery level 3+
        });

    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  /**
   * Calculate mastery level (0-5) based on performance
   */
  private calculateMasteryLevel(
    totalEncounters: number,
    correctEncounters: number,
    lastQuality: number,
    easeFactor: number
  ): number {
    const accuracy = totalEncounters > 0 ? correctEncounters / totalEncounters : 0;
    
    // Base mastery on accuracy, encounters, and ease factor
    if (accuracy >= 0.9 && totalEncounters >= 5 && easeFactor >= 2.8) return 5; // Expert
    if (accuracy >= 0.85 && totalEncounters >= 4 && easeFactor >= 2.6) return 4; // Mastered
    if (accuracy >= 0.75 && totalEncounters >= 3 && easeFactor >= 2.4) return 3; // Learned
    if (accuracy >= 0.6 && totalEncounters >= 2) return 2; // Practiced
    if (totalEncounters >= 1) return 1; // Seen
    return 0; // Unknown
  }

  /**
   * Calculate difficulty rating (1-5) based on ease factor and response time
   */
  private calculateDifficulty(easeFactor: number, responseTime: number): number {
    let difficulty = 3; // Default medium
    
    // Adjust based on ease factor
    if (easeFactor >= 2.8) difficulty = 1; // Very easy
    else if (easeFactor >= 2.5) difficulty = 2; // Easy
    else if (easeFactor >= 2.2) difficulty = 3; // Medium
    else if (easeFactor >= 1.8) difficulty = 4; // Hard
    else difficulty = 5; // Very hard
    
    // Adjust based on response time (if provided)
    if (responseTime > 0) {
      if (responseTime < 2000) difficulty = Math.max(1, difficulty - 1); // Very quick
      else if (responseTime > 10000) difficulty = Math.min(5, difficulty + 1); // Very slow
    }
    
    return difficulty;
  }

  /**
   * Get user statistics for dashboard
   */
  async getUserStats(userId: string): Promise<{
    totalWords: number;
    learnedWords: number;
    reviewsDue: number;
    currentStreak: number;
    weeklyProgress: number;
  }> {
    try {
      const [gemData, progressData] = await Promise.all([
        this.supabase
          .from('vocabulary_gem_collection')
          .select('*')
          .eq('student_id', userId),
        this.supabase
          .from('user_vocabulary_progress')
          .select('*')
          .eq('user_id', userId)
      ]);

      const gems = gemData.data || [];
      const progress = progressData.data || [];

      const reviewsDue = gems.filter(g => 
        new Date(g.next_review_at) <= new Date()
      ).length;

      const learnedWords = progress.filter(p => p.is_learned).length;
      const currentStreak = Math.max(...(gems.map(g => g.current_streak) || [0]));
      
      // Calculate weekly progress
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyProgress = progress.filter(p => 
        new Date(p.last_seen) > weekAgo
      ).length;

      return {
        totalWords: gems.length,
        learnedWords,
        reviewsDue,
        currentStreak,
        weeklyProgress
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        totalWords: 0,
        learnedWords: 0,
        reviewsDue: 0,
        currentStreak: 0,
        weeklyProgress: 0
      };
    }
  }
}

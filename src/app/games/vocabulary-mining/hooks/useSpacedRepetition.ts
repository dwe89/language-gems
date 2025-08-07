'use client';

import { useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { SpacedRepetitionService } from '../../../../services/spacedRepetitionService';
import { VocabularyWord } from './useGameLogic';

export const useSpacedRepetition = (supabase: SupabaseClient | null, userId: string | null) => {
  const spacedRepetitionService = supabase ? new SpacedRepetitionService(supabase) : null;

  /**
   * Record word practice with enhanced spaced repetition algorithm
   */
  const recordWordPractice = useCallback(async (
    word: VocabularyWord, 
    correct: boolean, 
    responseTime: number
  ): Promise<{ gemType: string; upgraded: boolean; points: number } | null> => {
    if (!spacedRepetitionService || !userId) {
      console.error('Missing spaced repetition service or user ID');
      return null;
    }

    try {
      // Check authentication status
      if (!supabase) {
        console.error('No supabase client available');
        return null;
      }

      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError) {
        console.error('Authentication error:', authError);
        return null;
      }

      if (!session) {
        console.error('No active session found');
        return null;
      }

      console.log('Recording word practice with enhanced SR:', {
        correct,
        responseTime,
        word: word.spanish || word.word,
        userId,
        wordId: word.id
      });

      // Anti-spam check: Prevent practicing words too frequently
      const now = new Date();
      const minimumInterval = 10 * 60 * 1000; // 10 minutes minimum between practices

      // Get existing gem collection record for anti-spam check
      const { data: existingGemData, error: selectError } = await supabase
        .from('vocabulary_gem_collection')
        .select('last_encountered_at')
        .eq('student_id', userId)
        .eq('vocabulary_item_id', word.id)
        .single();

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error querying gem collection:', selectError);
        return null;
      }

      // Anti-spam check
      if (existingGemData?.last_encountered_at) {
        const lastEncountered = new Date(existingGemData.last_encountered_at);
        const timeSinceLastPractice = now.getTime() - lastEncountered.getTime();
        
        if (timeSinceLastPractice < minimumInterval) {
          console.log('⏰ Skipping practice - too soon since last attempt');
          return null;
        }
      }

      // Use the enhanced spaced repetition service
      const result = await spacedRepetitionService.updateProgress(
        userId,
        word.id, // Use UUID string directly
        correct,
        responseTime
      );

      console.log('✅ Successfully recorded word practice with enhanced SR:', {
        wordId: word.id,
        gemType: result.gemType,
        upgraded: result.upgraded,
        points: result.points
      });

      return result;

    } catch (error) {
      console.error('❌ Error recording word practice:', error);
      return null;
    }
  }, [spacedRepetitionService, userId, supabase]);

  /**
   * Get words due for review based on spaced repetition schedule
   */
  const getWordsForReview = useCallback(async (limit: number = 20): Promise<VocabularyWord[]> => {
    if (!supabase || !userId) return [];

    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('vocabulary_gem_collection')
        .select(`
          vocabulary_item_id,
          next_review_at,
          spaced_repetition_ease_factor,
          mastery_level,
          centralized_vocabulary (
            id,
            spanish,
            english,
            theme,
            topic,
            part_of_speech,
            example_sentence,
            example_translation,
            audio_url
          )
        `)
        .eq('student_id', userId)
        .lte('next_review_at', now)
        .order('next_review_at', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching words for review:', error);
        return [];
      }

      // Transform the data to match VocabularyWord interface
      return data.map(item => ({
        id: item.vocabulary_item_id,
        spanish: item.centralized_vocabulary?.spanish || '',
        english: item.centralized_vocabulary?.english || '',
        theme: item.centralized_vocabulary?.theme || '',
        topic: item.centralized_vocabulary?.topic || '',
        part_of_speech: item.centralized_vocabulary?.part_of_speech || '',
        example_sentence: item.centralized_vocabulary?.example_sentence,
        example_translation: item.centralized_vocabulary?.example_translation,
        audio_url: item.centralized_vocabulary?.audio_url,
        mastery_level: item.mastery_level
      }));

    } catch (error) {
      console.error('Error fetching words for review:', error);
      return [];
    }
  }, [supabase, userId]);

  /**
   * Get review statistics for the user
   */
  const getReviewStats = useCallback(async () => {
    if (!supabase || !userId) return null;

    try {
      const now = new Date().toISOString();
      
      // Get counts for different review categories
      const { data: reviewData, error } = await supabase
        .from('vocabulary_gem_collection')
        .select('next_review_at, mastery_level')
        .eq('student_id', userId);

      if (error) {
        console.error('Error fetching review stats:', error);
        return null;
      }

      const stats = {
        dueToday: 0,
        overdue: 0,
        learned: 0,
        total: reviewData.length
      };

      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      reviewData.forEach(item => {
        const reviewDate = new Date(item.next_review_at);
        
        if (reviewDate <= new Date()) {
          stats.overdue++;
        } else if (reviewDate <= today) {
          stats.dueToday++;
        }
        
        if (item.mastery_level >= 3) {
          stats.learned++;
        }
      });

      return stats;

    } catch (error) {
      console.error('Error fetching review stats:', error);
      return null;
    }
  }, [supabase, userId]);

  return {
    recordWordPractice,
    getWordsForReview,
    getReviewStats
  };
};

'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  language: string;
  context?: string;
  source_video_id?: string;
  source_video_title?: string;
  mastery_level: number;
  last_reviewed?: string;
  next_review?: string;
  srs_level: number;
  review_history: any[];
  created_at?: string;
}

// Spaced repetition intervals in days
const SRS_INTERVALS = [1, 3, 7, 14, 30, 60, 120, 240];

export function useVocabulary() {
  const { user } = useAuth();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWords: 0,
    wordsLearned: 0,
    wordsToReview: 0,
    dayStreak: 0,
    minutesPracticed: 0,
    lastPracticeDate: null as Date | null,
  });

  // Fetch user's vocabulary
  const fetchVocabulary = useCallback(async () => {
    if (!user) {
      setVocabulary([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_vocabulary')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setVocabulary(data || []);
      
      // Calculate stats
      const totalWords = data?.length || 0;
      const wordsLearned = data?.filter(item => item.mastery_level >= 80).length || 0;
      const wordsToReview = data?.filter(item => 
        item.next_review && new Date(item.next_review) <= new Date()
      ).length || 0;
      
      // Fetch user stats for streak information
      const { data: userStats, error: statsError } = await supabase
        .from('user_stats')
        .select('day_streak, minutes_practiced, last_practice_date')
        .eq('user_id', user.id)
        .single();
      
      if (statsError && statsError.code === 'PGRST116') { // PGRST116 is "not found"
        // Create initial user stats record if not found
        const { error: createError } = await supabase
          .from('user_stats')
          .insert({ 
            user_id: user.id,
            day_streak: 0,
            minutes_practiced: 0,
            vocabulary_count: totalWords,
            quiz_count: 0,
            last_practice_date: null
          });
          
        if (createError) {
          console.error('Error creating initial user stats:', createError);
        } else {
          // Set default stats
          setStats({
            totalWords,
            wordsLearned,
            wordsToReview,
            dayStreak: 0,
            minutesPracticed: 0,
            lastPracticeDate: null,
          });
        }
      } else if (statsError) {
        console.error('Error fetching user stats:', statsError);
      } else {
        // Set stats from retrieved data
        setStats({
          totalWords,
          wordsLearned,
          wordsToReview,
          dayStreak: userStats?.day_streak || 0,
          minutesPracticed: userStats?.minutes_practiced || 0,
          lastPracticeDate: userStats?.last_practice_date ? new Date(userStats.last_practice_date) : null,
        });
      }
      
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add word to vocabulary
  const addWord = async (word: string, translation: string, language: string, context?: string, videoId?: string, videoTitle?: string) => {
    if (!user) return null;
    
    try {
      // Check if word already exists
      const { data: existingWords } = await supabase
        .from('user_vocabulary')
        .select('id')
        .eq('user_id', user.id)
        .eq('word', word)
        .eq('language', language);
      
      if (existingWords && existingWords.length > 0) {
        // Word already exists, could update context or return existing
        return existingWords[0].id;
      }
      
      // Calculate next review date (1 day from now for new words)
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + 1);
      
      // Add new word
      const { data, error } = await supabase
        .from('user_vocabulary')
        .insert({
          user_id: user.id,
          word,
          translation,
          language,
          context,
          source_video_id: videoId,
          source_video_title: videoTitle,
          mastery_level: 0,
          srs_level: 0,
          next_review: nextReview.toISOString(),
          review_history: [],
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      // Refresh vocabulary list
      fetchVocabulary();
      
      return data?.id;
    } catch (error) {
      console.error('Error adding word to vocabulary:', error);
      return null;
    }
  };

  // Review a word (spaced repetition)
  const reviewWord = async (id: string, quality: number) => {
    if (!user) return;
    
    try {
      // Get current word data
      const { data: wordData, error: fetchError } = await supabase
        .from('user_vocabulary')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      if (!wordData) return;
      
      // Calculate next SRS level based on quality
      let newSrsLevel = wordData.srs_level;
      let newMasteryLevel = wordData.mastery_level || 0;
      
      if (quality >= 3) {
        // Correct answer, advance SRS level (up to maximum)
        newSrsLevel = Math.min(SRS_INTERVALS.length - 1, wordData.srs_level + 1);
        newMasteryLevel = Math.min(100, newMasteryLevel + (quality * 5));
      } else {
        // Incorrect answer, decrease SRS level (minimum 0)
        newSrsLevel = Math.max(0, wordData.srs_level - 1);
        newMasteryLevel = Math.max(0, newMasteryLevel - 5);
      }
      
      // Calculate next review date
      const nextReview = new Date();
      nextReview.setDate(nextReview.getDate() + SRS_INTERVALS[newSrsLevel]);
      
      // Update review history
      const reviewHistory = wordData.review_history || [];
      reviewHistory.push({
        date: new Date().toISOString(),
        quality,
        srs_level: newSrsLevel
      });
      
      // Update word in database
      const { error: updateError } = await supabase
        .from('user_vocabulary')
        .update({
          mastery_level: newMasteryLevel,
          srs_level: newSrsLevel,
          last_reviewed: new Date().toISOString(),
          next_review: nextReview.toISOString(),
          review_history: reviewHistory
        })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // Refresh vocabulary list
      fetchVocabulary();
      
      // Update user stats
      updateUserStats();
      
    } catch (error) {
      console.error('Error reviewing word:', error);
    }
  };

  // Get words due for review
  const getDueWords = () => {
    const now = new Date();
    return vocabulary.filter(word => 
      word.next_review && new Date(word.next_review) <= now
    );
  };

  // Update user stats after reviewing
  const updateUserStats = async () => {
    if (!user) return;
    
    try {
      const now = new Date();
      let dayStreak = stats.dayStreak;
      const lastPracticeDate = stats.lastPracticeDate;
      
      // Check if we need to update streak
      if (!lastPracticeDate) {
        // First time practicing
        dayStreak = 1;
      } else {
        const lastDate = new Date(lastPracticeDate);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const lastDateStr = lastDate.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (lastDateStr === todayStr) {
          // Already practiced today, no streak update
        } else if (lastDateStr === yesterdayStr) {
          // Practiced yesterday, increment streak
          dayStreak++;
        } else {
          // Break in streak, reset to 1
          dayStreak = 1;
        }
      }
      
      // Update user stats in database
      const { error } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          day_streak: dayStreak,
          last_practice_date: now.toISOString()
        });
      
      if (error) throw error;
      
      // Update local stats
      setStats(prev => ({
        ...prev,
        dayStreak,
        lastPracticeDate: now
      }));
      
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  // Load vocabulary when user changes
  useEffect(() => {
    fetchVocabulary();
  }, [fetchVocabulary, user]);

  return {
    vocabulary,
    loading,
    stats,
    addWord,
    reviewWord,
    getDueWords,
    fetchVocabulary
  };
} 
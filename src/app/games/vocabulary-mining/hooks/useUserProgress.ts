'use client';

import { useState, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { GemType } from '../../../../components/ui/GemIcon';
import { Achievement } from '../../../../services/achievementService';

// =====================================================
// TYPES
// =====================================================

export interface UserStats {
  wordsLearned: number;
  totalWords: number;
  currentStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface GemStats {
  common: number;
  uncommon: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface DailyGoals {
  targetWords: number;
  wordsPracticed: number;
  targetMinutes: number;
  minutesPracticed: number;
  targetAccuracy: number;
  currentAccuracy: number;
}

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useUserProgress = (supabase: SupabaseClient | null, userId: string | null) => {
  // XP and Level system (persistent across sessions)
  const [totalXP, setTotalXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xpToNextLevel, setXpToNextLevel] = useState(100);
  const [showXPGain, setShowXPGain] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);

  // Achievement system
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [gemsByType, setGemsByType] = useState<Record<GemType, number>>({
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0
  });
  const [wordsPracticed, setWordsPracticed] = useState(0);

  // Integrated statistics state
  const [userStats, setUserStats] = useState<UserStats>({
    wordsLearned: 0,
    totalWords: 0,
    currentStreak: 0,
    weeklyGoal: 50,
    weeklyProgress: 0
  });

  const [gemStats, setGemStats] = useState<GemStats>({
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0
  });

  const [dailyGoals, setDailyGoals] = useState<DailyGoals>({
    targetWords: 20,
    wordsPracticed: 0,
    targetMinutes: 30,
    minutesPracticed: 0,
    targetAccuracy: 80,
    currentAccuracy: 0
  });

  // Calculate level from XP
  const calculateLevel = useCallback((xp: number) => {
    let level = 1;
    let xpRequired = 100;
    let totalXpForLevel = 0;

    while (totalXpForLevel + xpRequired <= xp) {
      totalXpForLevel += xpRequired;
      level++;
      xpRequired = Math.floor(100 * Math.pow(1.5, level - 1));
    }

    const xpForNextLevel = Math.floor(100 * Math.pow(1.5, level - 1));
    const xpToNext = xpForNextLevel - (xp - totalXpForLevel);

    return { level, xpToNext, xpForNextLevel };
  }, []);

  // Add XP and handle level ups
  const addXP = useCallback((points: number) => {
    const newTotalXP = totalXP + points;
    const { level: newLevel, xpToNext } = calculateLevel(newTotalXP);
    
    const leveledUp = newLevel > currentLevel;
    
    setTotalXP(newTotalXP);
    setSessionXP(prev => prev + points);
    setCurrentLevel(newLevel);
    setXpToNextLevel(xpToNext);
    
    // Show XP gain animation
    setXpGained(points);
    setShowXPGain(true);
    setTimeout(() => setShowXPGain(false), 2000);
    
    return { leveledUp, newLevel };
  }, [totalXP, currentLevel, calculateLevel]);

  // Load user progress from database
  const loadUserProgress = useCallback(async () => {
    if (!supabase || !userId) return;

    try {
      // Load XP and level data
      const { data: profileData, error: profileError } = await supabase
        .from('student_profiles')
        .select('total_xp, current_level')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error loading user profile:', profileError);
        return;
      }

      if (profileData) {
        const xp = profileData.total_xp || 0;
        const { level, xpToNext } = calculateLevel(xp);
        
        setTotalXP(xp);
        setCurrentLevel(level);
        setXpToNextLevel(xpToNext);
      }

      // Load gem collection stats
      const { data: gemData, error: gemError } = await supabase
        .from('vocabulary_gem_collection')
        .select('gem_level')
        .eq('student_id', userId);

      if (gemError) {
        console.error('Error loading gem data:', gemError);
        return;
      }

      if (gemData) {
        const gemCounts = gemData.reduce((acc, gem) => {
          const gemType = ['common', 'uncommon', 'rare', 'epic', 'legendary'][gem.gem_level - 1] as GemType;
          acc[gemType] = (acc[gemType] || 0) + 1;
          return acc;
        }, {} as Record<GemType, number>);

        setGemsByType(prev => ({ ...prev, ...gemCounts }));
        setGemStats(prev => ({ ...prev, ...gemCounts }));
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  }, [supabase, userId, calculateLevel]);

  // Load integrated statistics
  const loadIntegratedStats = useCallback(async () => {
    if (!supabase || !userId) return;

    try {
      // Load vocabulary statistics
      const { data: vocabStats, error: vocabError } = await supabase
        .from('vocabulary_gem_collection')
        .select('mastery_level, current_streak')
        .eq('student_id', userId);

      if (vocabError) {
        console.error('Error loading vocabulary stats:', vocabError);
        return;
      }

      if (vocabStats) {
        const wordsLearned = vocabStats.filter(item => item.mastery_level >= 3).length;
        const maxStreak = Math.max(...vocabStats.map(item => item.current_streak || 0), 0);
        
        setUserStats(prev => ({
          ...prev,
          wordsLearned,
          totalWords: vocabStats.length,
          currentStreak: maxStreak
        }));
      }

      // Load daily progress
      const today = new Date().toISOString().split('T')[0];
      const { data: dailyData, error: dailyError } = await supabase
        .from('daily_progress')
        .select('words_practiced, minutes_practiced, accuracy_percentage')
        .eq('student_id', userId)
        .eq('date', today)
        .single();

      if (!dailyError && dailyData) {
        setDailyGoals(prev => ({
          ...prev,
          wordsPracticed: dailyData.words_practiced || 0,
          minutesPracticed: dailyData.minutes_practiced || 0,
          currentAccuracy: dailyData.accuracy_percentage || 0
        }));
      }
    } catch (error) {
      console.error('Error loading integrated stats:', error);
    }
  }, [supabase, userId]);

  // Update user profile in database
  const updateUserProfile = useCallback(async (xp: number, level: number) => {
    if (!supabase || !userId) return;

    try {
      const { error } = await supabase
        .from('student_profiles')
        .upsert({
          id: userId,
          total_xp: xp,
          current_level: level,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating user profile:', error);
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  }, [supabase, userId]);

  return {
    // XP and Level
    totalXP,
    currentLevel,
    xpToNextLevel,
    showXPGain,
    xpGained,
    sessionXP,
    setSessionXP,
    addXP,
    calculateLevel,

    // Achievements
    showAchievement,
    setShowAchievement,
    currentAchievement,
    setCurrentAchievement,
    gemsByType,
    setGemsByType,
    wordsPracticed,
    setWordsPracticed,

    // Statistics
    userStats,
    setUserStats,
    gemStats,
    setGemStats,
    dailyGoals,
    setDailyGoals,

    // Database operations
    loadUserProgress,
    loadIntegratedStats,
    updateUserProfile
  };
};

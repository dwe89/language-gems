'use client';

import { useCallback, useEffect, useRef } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { GameState, VocabularyWord } from './useGameLogic';

interface SessionData {
  student_id: string;
  game_type: string;
  session_mode: 'free_play' | 'assignment' | 'practice' | 'challenge';
  started_at: Date;
  ended_at?: Date;
  duration_seconds: number;
  final_score: number;
  max_score_possible: number;
  accuracy_percentage: number;
  completion_percentage: number;
  level_reached: number;
  lives_used: number;
  power_ups_used: any[];
  achievements_earned: string[];
  words_attempted: number;
  words_correct: number;
  unique_words_practiced: number;
  average_response_time_ms: number;
  pause_count: number;
  hint_requests: number;
  retry_attempts: number;
  xp_earned?: number;
  bonus_xp?: number;
  session_data: any;
  device_info: any;
}

export const useSessionSaving = (
  supabase: SupabaseClient | null,
  userId: string | null,
  gameState: GameState,
  vocabulary: VocabularyWord[],
  isDemo: boolean = false
) => {
  const sessionIdRef = useRef<string | null>(null);
  const enhancedGameServiceRef = useRef<EnhancedGameService | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<Date>(new Date());

  // Initialize enhanced game service
  useEffect(() => {
    if (supabase && !enhancedGameServiceRef.current) {
      enhancedGameServiceRef.current = new EnhancedGameService(supabase);
    }
  }, [supabase]);

  // Debounced save function
  const debouncedSave = useCallback((sessionData: Partial<SessionData>, delay: number = 5000) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveSessionData(sessionData);
    }, delay);
  }, []);

  // Save session data to database
  const saveSessionData = useCallback(async (sessionData: Partial<SessionData>) => {
    if (!enhancedGameServiceRef.current || !userId || isDemo) {
      console.log('Skipping session save - no service, user, or demo mode');
      return;
    }

    try {
      const now = new Date();
      
      // Prevent saving too frequently (minimum 30 seconds between saves)
      if (now.getTime() - lastSaveRef.current.getTime() < 30000) {
        console.log('Skipping session save - too frequent');
        return;
      }

      if (sessionIdRef.current) {
        // Update existing session
        await enhancedGameServiceRef.current.updateGameSession(sessionIdRef.current, {
          ...sessionData,
          ended_at: now
        });
        console.log('✅ Session data updated successfully');
      } else {
        // Create new session
        const newSessionId = await enhancedGameServiceRef.current.startGameSession({
          student_id: userId,
          game_type: 'vocabulary-mining',
          session_mode: 'free_play',
          ...sessionData
        });
        sessionIdRef.current = newSessionId;
        console.log('✅ New session created:', newSessionId);
      }

      lastSaveRef.current = now;
    } catch (error) {
      console.error('❌ Error saving session data:', error);
    }
  }, [userId, isDemo]);

  // Create session data from current game state
  const createSessionData = useCallback((): Partial<SessionData> => {
    const totalQuestions = gameState.correctAnswers + gameState.incorrectAnswers;
    const accuracy = totalQuestions > 0 ? (gameState.correctAnswers / totalQuestions) * 100 : 0;
    const completionPercentage = vocabulary.length > 0 ? (gameState.currentWordIndex / vocabulary.length) * 100 : 0;

    // Calculate XP based on performance
    const baseXP = gameState.correctAnswers * 10; // 10 XP per correct answer
    const accuracyBonus = Math.round(accuracy * 0.5); // Bonus for accuracy
    const streakBonus = gameState.maxStreak * 5; // 5 XP per max streak
    const gemBonus = gameState.gemsCollected * 3; // 3 XP per gem collected
    const totalXP = baseXP + accuracyBonus + streakBonus + gemBonus;

    return {
      duration_seconds: gameState.timeSpent,
      final_score: gameState.score,
      max_score_possible: vocabulary.length * 200, // Assuming max legendary gem points
      accuracy_percentage: Math.round(accuracy),
      completion_percentage: Math.round(completionPercentage),
      level_reached: 1, // This would come from user progress
      lives_used: 0,
      power_ups_used: [],
      achievements_earned: [],
      words_attempted: totalQuestions,
      words_correct: gameState.correctAnswers,
      unique_words_practiced: gameState.currentWordIndex,
      average_response_time_ms: gameState.timeSpent > 0 ? (gameState.timeSpent * 1000) / Math.max(totalQuestions, 1) : 0,
      pause_count: 0,
      hint_requests: 0, // This would need to be tracked
      retry_attempts: 0,
      xp_earned: totalXP,
      bonus_xp: accuracyBonus + streakBonus + gemBonus,
      session_data: {
        gameMode: gameState.gameMode,
        currentWordIndex: gameState.currentWordIndex,
        streak: gameState.streak,
        maxStreak: gameState.maxStreak,
        gemsCollected: gameState.gemsCollected,
        currentGemType: gameState.currentGemType,
        miningEfficiency: accuracy,
        gemCollectionRate: gameState.gemsCollected / Math.max(totalQuestions, 1)
      },
      device_info: {
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        platform: typeof window !== 'undefined' ? window.navigator.platform : '',
        language: typeof window !== 'undefined' ? window.navigator.language : ''
      }
    };
  }, [gameState, vocabulary]);

  // Periodic save (every 60 seconds)
  useEffect(() => {
    if (!userId || isDemo) return;

    const interval = setInterval(() => {
      const sessionData = createSessionData();
      debouncedSave(sessionData, 1000); // Save with short delay for periodic saves
    }, 60000); // Every 60 seconds

    return () => clearInterval(interval);
  }, [userId, isDemo, createSessionData, debouncedSave]);

  // Save on game state changes (debounced)
  useEffect(() => {
    if (!userId || isDemo) return;

    const sessionData = createSessionData();
    debouncedSave(sessionData);
  }, [
    gameState.correctAnswers,
    gameState.incorrectAnswers,
    gameState.currentWordIndex,
    gameState.score,
    gameState.streak,
    userId,
    isDemo,
    createSessionData,
    debouncedSave
  ]);

  // Save on page unload
  useEffect(() => {
    if (!userId || isDemo) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const sessionData = createSessionData();
      
      // Use sendBeacon for reliable data sending on page unload
      if (navigator.sendBeacon && enhancedGameServiceRef.current) {
        const data = JSON.stringify({
          sessionId: sessionIdRef.current,
          sessionData: {
            ...sessionData,
            ended_at: new Date()
          }
        });
        
        // Send to a dedicated endpoint that can handle beacon requests
        navigator.sendBeacon('/api/save-session', data);
      }
      
      // Also try immediate save (may not complete)
      saveSessionData({
        ...sessionData,
        ended_at: new Date()
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page is being hidden, save immediately
        const sessionData = createSessionData();
        saveSessionData({
          ...sessionData,
          ended_at: new Date()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, isDemo, createSessionData, saveSessionData]);

  // Final save when component unmounts
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Final save on unmount
      if (userId && !isDemo) {
        const sessionData = createSessionData();
        saveSessionData({
          ...sessionData,
          ended_at: new Date()
        });
      }
    };
  }, [userId, isDemo, createSessionData, saveSessionData]);

  // Manual save function for explicit saves (e.g., on level completion)
  const saveNow = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    const sessionData = createSessionData();
    await saveSessionData({
      ...sessionData,
      ended_at: new Date()
    });
  }, [createSessionData, saveSessionData]);

  return {
    saveNow,
    sessionId: sessionIdRef.current
  };
};

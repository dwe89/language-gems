/**
 * React Hook for Conjugation Duel Game
 * 
 * Provides complete conjugation game functionality with verb selection,
 * challenge generation, answer validation, and gem/FSRS tracking.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { 
  ConjugationDuelService, 
  ConjugationChallenge, 
  ConjugationAttempt, 
  ConjugationResult,
  DuelConfiguration 
} from '@/services/ConjugationDuelService';
import { StandardVocabularyItem } from '@/components/games/templates/GameAssignmentWrapper';

export interface UseConjugationDuelOptions {
  sessionId: string;
  language: 'es' | 'fr' | 'de';
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  tenses?: string[];
  persons?: string[]; // Array of persons to practice
  verbTypes?: string[]; // Array of verb types to practice: 'regular', 'irregular', 'stem_changing'
  challengeCount?: number;
  timeLimit?: number; // seconds per challenge
  assignmentVocabulary?: StandardVocabularyItem[]; // Assignment vocabulary with UUIDs
  assignmentId?: string; // Assignment ID for grammar configuration
}

export interface ConjugationDuelState {
  isLoading: boolean;
  challenges: ConjugationChallenge[];
  currentChallengeIndex: number;
  currentChallenge: ConjugationChallenge | null;
  results: ConjugationResult[];
  totalGems: number;
  totalXP: number;
  correctAnswers: number;
  streakCount: number;
  maxStreak: number;
  timeRemaining: number;
  isComplete: boolean;
  error: string | null;
}

export function useConjugationDuel(options: UseConjugationDuelOptions) {
  const { supabase } = useSupabase();
  const [conjugationService] = useState(() => new ConjugationDuelService(supabase));

  // Memoize options to prevent infinite re-renders
  const stableOptions = useMemo(() => options, [
    options.sessionId,
    options.language,
    JSON.stringify(options.tenses),
    JSON.stringify(options.persons),
    options.difficulty,
    JSON.stringify(options.verbTypes),
    options.challengeCount,
    options.timeLimit,
    options.assignmentId,
    options.assignmentVocabulary?.length
  ]);
  
  const [state, setState] = useState<ConjugationDuelState>({
    isLoading: false,
    challenges: [],
    currentChallengeIndex: 0,
    currentChallenge: null,
    results: [],
    totalGems: 0,
    totalXP: 0,
    correctAnswers: 0,
    streakCount: 0,
    maxStreak: 0,
    timeRemaining: options.timeLimit || 30,
    isComplete: false,
    error: null
  });

  // Timer for time-limited challenges
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  /**
   * Initialize a new duel session
   */
  const startDuel = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const config: DuelConfiguration = {
        language: stableOptions.language,
        tenses: stableOptions.tenses || ['present'],
        persons: stableOptions.persons || ['yo', 'tu', 'el_ella_usted', 'nosotros', 'vosotros', 'ellos_ellas_ustedes'],
        difficulty: stableOptions.difficulty || 'mixed',
        verbTypes: (stableOptions.verbTypes as ('regular' | 'irregular' | 'stem_changing')[]) || ['regular', 'irregular', 'stem_changing'],
        challengeCount: stableOptions.challengeCount || 10,
        timeLimit: stableOptions.timeLimit,
        assignmentVocabulary: stableOptions.assignmentVocabulary
      };

      console.log('🎯 [CONJUGATION DUEL] Starting duel with config:', {
        language: config.language,
        tenses: config.tenses,
        persons: config.persons,
        verbTypes: config.verbTypes,
        difficulty: config.difficulty,
        challengeCount: config.challengeCount,
        hasAssignmentVocabulary: !!config.assignmentVocabulary,
        assignmentVocabularyCount: config.assignmentVocabulary?.length || 0,
        assignmentId: stableOptions.assignmentId
      });

      const challenges = await conjugationService.generateDuelSession(config, options.assignmentId);

      setState(prev => ({
        ...prev,
        isLoading: false,
        challenges,
        currentChallengeIndex: 0,
        currentChallenge: challenges[0] || null,
        results: [],
        totalGems: 0,
        totalXP: 0,
        correctAnswers: 0,
        streakCount: 0,
        maxStreak: 0,
        timeRemaining: options.timeLimit || 30,
        isComplete: false
      }));

      // Start timer if time limit is set (disabled for assignments to prevent infinite loop)
      if (options.timeLimit && !options.assignmentId) {
        startTimer();
      }

    } catch (error) {
      console.error('Error starting duel:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start duel'
      }));
    }
  }, [conjugationService, stableOptions]);

  /**
   * Submit an answer for the current challenge
   */
  const submitAnswer = useCallback(async (
    answer: string,
    responseTimeMs: number,
    hintUsed: boolean = false
  ): Promise<ConjugationResult | null> => {
    if (!state.currentChallenge) return null;

    try {
      const attempt: ConjugationAttempt = {
        sessionId: options.sessionId,
        challengeId: state.currentChallenge.id,
        studentAnswer: answer,
        responseTimeMs,
        hintUsed
      };

      // Use processAttempt instead of validateAttempt to save data and award Grammar Gems
      const result = await conjugationService.processAttempt(
        options.sessionId,
        state.currentChallenge,
        attempt
      );

      setState(prev => {
        const newResults = [...prev.results, result];
        const newCorrectAnswers = prev.correctAnswers + (result.isCorrect ? 1 : 0);
        const newStreakCount = result.isCorrect ? prev.streakCount + 1 : 0;
        const newMaxStreak = Math.max(prev.maxStreak, newStreakCount);
        const newTotalGems = prev.totalGems + (result.gemAwarded ? 1 : 0);
        const newTotalXP = prev.totalXP + (result.gemAwarded?.xpValue || 0);

        return {
          ...prev,
          results: newResults,
          correctAnswers: newCorrectAnswers,
          streakCount: newStreakCount,
          maxStreak: newMaxStreak,
          totalGems: newTotalGems,
          totalXP: newTotalXP
        };
      });

      return result;

    } catch (error) {
      console.error('Error submitting answer:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to submit answer'
      }));
      return null;
    }
  }, [conjugationService, options.sessionId, state.currentChallenge]);

  /**
   * Move to the next challenge
   */
  const nextChallenge = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentChallengeIndex + 1;
      const isComplete = nextIndex >= prev.challenges.length;
      
      return {
        ...prev,
        currentChallengeIndex: nextIndex,
        currentChallenge: isComplete ? null : prev.challenges[nextIndex],
        timeRemaining: options.timeLimit || 30,
        isComplete
      };
    });

    // Restart timer for next challenge (disabled for assignments to prevent infinite loop)
    if (options.timeLimit && !state.isComplete && !options.assignmentId) {
      startTimer();
    } else if (state.isComplete) {
      stopTimer();
    }
  }, [options.timeLimit, state.isComplete]);

  /**
   * Skip current challenge (counts as incorrect)
   */
  const skipChallenge = useCallback(async () => {
    if (state.currentChallenge) {
      await submitAnswer('', 0, false); // Submit empty answer
      nextChallenge();
    }
  }, [state.currentChallenge, submitAnswer, nextChallenge]);

  /**
   * Start the challenge timer
   */
  const startTimer = useCallback(() => {
    if (timerId) clearInterval(timerId);

    const newTimerId = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          // Time's up - auto-skip
          skipChallenge();
          return prev;
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    setTimerId(newTimerId);
  }, [timerId, skipChallenge]);

  /**
   * Stop the challenge timer
   */
  const stopTimer = useCallback(() => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  }, [timerId]);

  /**
   * Reset the duel state
   */
  const resetDuel = useCallback(() => {
    stopTimer();
    setState({
      isLoading: false,
      challenges: [],
      currentChallengeIndex: 0,
      currentChallenge: null,
      results: [],
      totalGems: 0,
      totalXP: 0,
      correctAnswers: 0,
      streakCount: 0,
      maxStreak: 0,
      timeRemaining: options.timeLimit || 30,
      isComplete: false,
      error: null
    });
  }, [stopTimer, options.timeLimit]);

  /**
   * Get available verbs for practice
   */
  const getAvailableVerbs = useCallback(async (limit: number = 50) => {
    try {
      return await conjugationService.getAvailableVerbs(options.language, options.difficulty, limit);
    } catch (error) {
      console.error('Error fetching available verbs:', error);
      return [];
    }
  }, [conjugationService, options.language, options.difficulty]);

  /**
   * Generate a single practice challenge
   */
  const generatePracticeChallenge = useCallback(async (
    verb: { id: string; infinitive: string; translation: string },
    tense?: string
  ) => {
    try {
      return await conjugationService.generateChallenge(verb, options.language, tense);
    } catch (error) {
      console.error('Error generating practice challenge:', error);
      return null;
    }
  }, [conjugationService, options.language]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [timerId]);

  // Computed values
  const progress = state.challenges.length > 0 ? 
    (state.currentChallengeIndex / state.challenges.length) * 100 : 0;
  
  const accuracy = state.results.length > 0 ?
    (state.correctAnswers / state.results.length) * 100 : 0;

  // Debug accuracy calculation
  if (state.results.length > 0) {
    console.log('🎯 [CONJUGATION DUEL] Accuracy calculation:', {
      correctAnswers: state.correctAnswers,
      totalResults: state.results.length,
      accuracy: accuracy.toFixed(1) + '%'
    });
  }

  const averageResponseTime = state.results.length > 0 ?
    state.results.reduce((sum, r) => sum + r.responseTimeMs, 0) / state.results.length : 0;

  return {
    // State
    ...state,
    
    // Actions
    startDuel,
    submitAnswer,
    nextChallenge,
    skipChallenge,
    resetDuel,
    getAvailableVerbs,
    generatePracticeChallenge,
    
    // Timer controls
    startTimer,
    stopTimer,
    
    // Computed values
    progress,
    accuracy,
    averageResponseTime,
    
    // Helper functions
    hasStarted: state.challenges.length > 0,
    canSubmit: state.currentChallenge !== null && !state.isComplete,
    remainingChallenges: state.challenges.length - state.currentChallengeIndex - 1,
    
    // Performance stats
    getPerformanceStats: () => ({
      totalChallenges: state.challenges.length,
      completed: state.currentChallengeIndex,
      correctAnswers: state.correctAnswers,
      accuracy,
      streakCount: state.streakCount,
      maxStreak: state.maxStreak,
      totalGems: state.totalGems,
      totalXP: state.totalXP,
      averageResponseTime
    })
  };
}

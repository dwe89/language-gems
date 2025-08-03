'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import BattleArena from './BattleArena';

interface ConjugationDuelGameWrapperProps {
  language?: string;
  league?: string;
  opponent?: { name: string; difficulty: string };
  onBackToMenu: () => void;
  onGameEnd: (result: { 
    score: number;
    accuracy: number;
    timeSpent: number;
    verbsCompleted: number;
    duelsWon: number;
    verbConjugationAccuracy?: number;
    tenseMasteryTracking?: Record<string, number>;
    competitiveDuelPerformance?: number;
  }) => void;
  assignmentId?: string;
  userId?: string;
}

export default function ConjugationDuelGameWrapper(props: ConjugationDuelGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalConjugations: 0,
    correctConjugations: 0,
    totalResponseTime: 0,
    duelsWon: 0,
    verbsCompleted: 0,
    tenseMastery: {} as Record<string, { correct: number; total: number }>,
    conjugationAttempts: [] as any[],
    competitiveMetrics: {
      averageResponseTime: 0,
      accuracyUnderPressure: 0,
      streakPerformance: 0
    }
  });

  // Initialize game service
  useEffect(() => {
    if (props.userId) {
      const service = new EnhancedGameService(supabaseBrowser);
      setGameService(service);
    }
  }, [props.userId]);

  // Start game session when service is ready
  useEffect(() => {
    if (gameService && props.userId && !gameSessionId) {
      startGameSession();
    }
  }, [gameService, props.userId, gameSessionId]);

  // End session when component unmounts
  useEffect(() => {
    return () => {
      endGameSession();
    };
  }, []);

  const startGameSession = async () => {
    if (!gameService || !props.userId) return;

    try {
      const startTime = new Date();
      const sessionId = await gameService.startGameSession({
        student_id: props.userId,
        assignment_id: props.assignmentId || undefined,
        game_type: 'conjugation-duel',
        session_mode: props.assignmentId ? 'assignment' : 'free_play',
        max_score_possible: 1000, // Base score for conjugation duels
        session_data: {
          language: props.language,
          league: props.league,
          opponent: props.opponent
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log('Conjugation Duel game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start conjugation duel game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameService && gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalConjugations > 0
          ? (sessionStats.correctConjugations / sessionStats.totalConjugations) * 100
          : 0;
        const averageResponseTime = sessionStats.totalConjugations > 0
          ? sessionStats.totalResponseTime / sessionStats.totalConjugations
          : 0;

        // Calculate tense mastery scores
        const tenseMasteryScores = Object.entries(sessionStats.tenseMastery).reduce((acc, [tense, data]) => {
          acc[tense] = data.total > 0 ? (data.correct / data.total) * 100 : 0;
          return acc;
        }, {} as Record<string, number>);

        // Calculate XP based on performance
        const baseXP = sessionStats.correctConjugations * 12; // 12 XP per correct conjugation
        const accuracyBonus = Math.round(accuracy * 0.8); // Bonus for accuracy
        const speedBonus = averageResponseTime < 5000 ? 60 : averageResponseTime < 8000 ? 30 : 0; // Speed bonus
        const duelBonus = sessionStats.duelsWon * 25; // Bonus for each duel won
        const masteryBonus = Object.values(tenseMasteryScores).filter(score => score >= 80).length * 15; // Mastery bonus
        const totalXP = baseXP + accuracyBonus + speedBonus + duelBonus + masteryBonus;

        await gameService.endGameSession(gameSessionId, {
          student_id: props.userId,
          final_score: Math.round(accuracy * 10), // Scale accuracy to score
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalConjugations,
          words_correct: sessionStats.correctConjugations,
          unique_words_practiced: sessionStats.verbsCompleted,
          duration_seconds: sessionDuration,
          average_response_time_ms: averageResponseTime,
          xp_earned: totalXP,
          bonus_xp: accuracyBonus + speedBonus + duelBonus + masteryBonus,
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            averageResponseTime,
            verbConjugationAccuracy: accuracy,
            tenseMasteryTracking: tenseMasteryScores,
            competitiveDuelPerformance: sessionStats.competitiveMetrics.accuracyUnderPressure,
            conjugationAttempts: sessionStats.conjugationAttempts,
            duelsWon: sessionStats.duelsWon,
            verbsCompleted: sessionStats.verbsCompleted
          }
        });

        console.log('Conjugation Duel game session ended successfully with XP:', totalXP);
      } catch (error) {
        console.error('Failed to end conjugation duel game session:', error);
      }
    }
  };

  // Enhanced battle end handler
  const handleEnhancedBattleEnd = async () => {
    // Calculate competitive performance metrics
    const sessionDuration = sessionStartTime ? (Date.now() - sessionStartTime.getTime()) / 1000 : 300;
    const accuracy = sessionStats.totalConjugations > 0
      ? (sessionStats.correctConjugations / sessionStats.totalConjugations) * 100
      : 0;
    
    // Calculate tense mastery scores
    const tenseMasteryScores = Object.entries(sessionStats.tenseMastery).reduce((acc, [tense, data]) => {
      acc[tense] = data.total > 0 ? (data.correct / data.total) * 100 : 0;
      return acc;
    }, {} as Record<string, number>);

    // Update competitive metrics
    const competitivePerformance = (accuracy + (sessionStats.duelsWon / Math.max(sessionStats.verbsCompleted, 1)) * 100) / 2;

    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      competitiveMetrics: {
        ...prev.competitiveMetrics,
        accuracyUnderPressure: accuracy,
        averageResponseTime: prev.totalConjugations > 0 ? prev.totalResponseTime / prev.totalConjugations : 0
      }
    }));

    // End the session
    await endGameSession();

    // Call the original game end handler
    props.onGameEnd({
      score: Math.round(accuracy * 10),
      accuracy: accuracy,
      timeSpent: sessionDuration,
      verbsCompleted: sessionStats.verbsCompleted,
      duelsWon: sessionStats.duelsWon,
      verbConjugationAccuracy: accuracy,
      tenseMasteryTracking: tenseMasteryScores,
      competitiveDuelPerformance: competitivePerformance
    });
  };

  // Log conjugation performance
  const logConjugationPerformance = async (
    verb: string,
    tense: string,
    person: string,
    userAnswer: string,
    correctAnswer: string,
    isCorrect: boolean,
    responseTime: number
  ) => {
    if (gameService && gameSessionId) {
      try {
        await gameService.logWordPerformance({
          session_id: gameSessionId,
          word_id: `${verb}-${tense}-${person}`,
          word: verb,
          translation: correctAnswer,
          is_correct: isCorrect,
          response_time_ms: responseTime,
          attempts: 1,
          error_type: isCorrect ? undefined : 'conjugation_error',
          grammar_concept: `${tense}_conjugation`,
          error_details: isCorrect ? undefined : {
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            tense: tense,
            person: person,
            verb: verb,
            responseTime: responseTime
          }
        });

        // Update session stats
        setSessionStats(prev => ({
          ...prev,
          totalConjugations: prev.totalConjugations + 1,
          correctConjugations: prev.correctConjugations + (isCorrect ? 1 : 0),
          totalResponseTime: prev.totalResponseTime + responseTime,
          tenseMastery: {
            ...prev.tenseMastery,
            [tense]: {
              correct: (prev.tenseMastery[tense]?.correct || 0) + (isCorrect ? 1 : 0),
              total: (prev.tenseMastery[tense]?.total || 0) + 1
            }
          },
          conjugationAttempts: [...prev.conjugationAttempts, {
            verb,
            tense,
            person,
            userAnswer,
            correctAnswer,
            isCorrect,
            responseTime
          }]
        }));
      } catch (error) {
        console.error('Failed to log conjugation performance:', error);
      }
    }
  };

  if (!gameService) {
    return (
      <div className="h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-200">Loading conjugation arena...</p>
        </div>
      </div>
    );
  }

  return (
    <BattleArena
      {...props}
      onBattleEnd={handleEnhancedBattleEnd}
      gameSessionId={gameSessionId}
      gameService={gameService}
      onConjugationComplete={logConjugationPerformance}
    />
  );
}

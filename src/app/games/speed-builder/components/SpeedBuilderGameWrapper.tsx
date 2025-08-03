'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import { GemSpeedBuilder } from './GemSpeedBuilder';

interface GameStats {
  score: number;
  accuracy: number;
  timeSpent: number;
  sentencesCompleted: number;
  streak: number;
  highestStreak: number;
  totalWordsPlaced: number;
  grammarErrors: Record<string, number>;
  powerUpsUsed: Record<string, number>;
  gemsCollected: number;
  bonusMultiplier: number;
}

interface SpeedBuilderGameWrapperProps {
  assignmentId?: string;
  mode?: 'assignment' | 'freeplay';
  theme?: string;
  topic?: string;
  tier?: string;
  vocabularyList?: any[];
  sentenceConfig?: any;
  onOpenSettings?: () => void;
  onBackToMenu?: () => void;
  onGameEnd: (result: { 
    score: number;
    accuracy: number;
    timeSpent: number;
    sentencesCompleted: number;
    totalWordsPlaced: number;
    wordPlacementSpeed?: number;
    sentenceCompletionAccuracy?: number;
    rapidFireVocabularyMetrics?: number;
  }) => void;
  userId?: string;
}

export default function SpeedBuilderGameWrapper(props: SpeedBuilderGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalWordsPlaced: 0,
    correctWordsPlaced: 0,
    totalResponseTime: 0,
    sentencesCompleted: 0,
    wordPlacementAttempts: [] as any[],
    rapidFireMetrics: {
      averageWordsPerMinute: 0,
      peakSpeed: 0,
      consistencyScore: 0
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
        game_type: 'speed-builder',
        session_mode: props.assignmentId ? 'assignment' : 'free_play',
        max_score_possible: 1000, // Base score for speed building
        session_data: {
          mode: props.mode,
          theme: props.theme,
          topic: props.topic,
          tier: props.tier
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log('Speed Builder game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start speed builder game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameService && gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalWordsPlaced > 0
          ? (sessionStats.correctWordsPlaced / sessionStats.totalWordsPlaced) * 100
          : 0;
        const averageResponseTime = sessionStats.totalWordsPlaced > 0
          ? sessionStats.totalResponseTime / sessionStats.totalWordsPlaced
          : 0;

        // Calculate XP based on performance
        const baseXP = sessionStats.correctWordsPlaced * 8; // 8 XP per correct word placement
        const accuracyBonus = Math.round(accuracy * 0.6); // Bonus for accuracy
        const speedBonus = averageResponseTime < 3000 ? 50 : averageResponseTime < 5000 ? 25 : 0; // Speed bonus
        const sentenceBonus = sessionStats.sentencesCompleted * 30; // Bonus for each sentence completed
        const rapidFireBonus = sessionStats.rapidFireMetrics.averageWordsPerMinute > 20 ? 40 : 
                              sessionStats.rapidFireMetrics.averageWordsPerMinute > 15 ? 20 : 0;
        const totalXP = baseXP + accuracyBonus + speedBonus + sentenceBonus + rapidFireBonus;

        await gameService.endGameSession(gameSessionId, {
          student_id: props.userId,
          final_score: Math.round(accuracy * 10), // Scale accuracy to score
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalWordsPlaced,
          words_correct: sessionStats.correctWordsPlaced,
          unique_words_practiced: sessionStats.wordPlacementAttempts.length,
          duration_seconds: sessionDuration,
          average_response_time_ms: averageResponseTime,
          xp_earned: totalXP,
          bonus_xp: accuracyBonus + speedBonus + sentenceBonus + rapidFireBonus,
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            averageResponseTime,
            wordPlacementSpeed: sessionStats.rapidFireMetrics.averageWordsPerMinute,
            sentenceCompletionAccuracy: accuracy,
            rapidFireVocabularyMetrics: sessionStats.rapidFireMetrics,
            wordPlacementAttempts: sessionStats.wordPlacementAttempts
          }
        });

        console.log('Speed Builder game session ended successfully with XP:', totalXP);
      } catch (error) {
        console.error('Failed to end speed builder game session:', error);
      }
    }
  };

  // Enhanced game completion handler
  const handleEnhancedGameEnd = async (stats: GameStats) => {
    // Calculate rapid fire metrics
    const sessionDuration = sessionStartTime ? (Date.now() - sessionStartTime.getTime()) / 1000 : 120;
    const wordsPerMinute = (stats.totalWordsPlaced / sessionDuration) * 60;
    
    // Update session stats
    setSessionStats({
      totalWordsPlaced: stats.totalWordsPlaced,
      correctWordsPlaced: Math.round(stats.totalWordsPlaced * (stats.accuracy / 100)),
      totalResponseTime: stats.timeSpent * 1000, // Convert to ms
      sentencesCompleted: stats.sentencesCompleted,
      wordPlacementAttempts: [], // Will be populated by individual word placement logs
      rapidFireMetrics: {
        averageWordsPerMinute: wordsPerMinute,
        peakSpeed: wordsPerMinute * 1.2, // Estimate peak speed
        consistencyScore: Math.min(100, stats.streak * 5) // Consistency based on streak
      }
    });

    // End the session
    await endGameSession();

    // Call the original game end handler
    props.onGameEnd({
      score: stats.score,
      accuracy: stats.accuracy,
      timeSpent: stats.timeSpent,
      sentencesCompleted: stats.sentencesCompleted,
      totalWordsPlaced: stats.totalWordsPlaced,
      wordPlacementSpeed: wordsPerMinute,
      sentenceCompletionAccuracy: stats.accuracy,
      rapidFireVocabularyMetrics: wordsPerMinute
    });
  };

  if (!gameService) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-200">Loading speed building arena...</p>
        </div>
      </div>
    );
  }

  return (
    <GemSpeedBuilder
      {...props}
      onGameComplete={handleEnhancedGameEnd}
      gameSessionId={gameSessionId}
      gameService={gameService}
    />
  );
}

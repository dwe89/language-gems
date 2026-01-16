'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { getBufferedGameSessionService, BufferedGameSessionService } from '../../../../services/buffered/BufferedGameSessionService';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import { GemSpeedBuilder } from './GemSpeedBuilder';
import { RewardEngine } from '../../../../services/rewards/RewardEngine';

interface GameStats {
  score: number;
  accuracy: number;
  timeSpent: number;
  sentencesCompleted: number;
  streak: number;
  highestStreak: number;
  totalWordsPlaced: number;
  correctWordsPlaced: number; // Track correct words for accurate percentage calculation
  grammarErrors: Record<string, number>;
  powerUpsUsed: Record<string, number>;
  gemsCollected: number;
  bonusMultiplier: number;
}

interface SpeedBuilderGameWrapperProps {
  assignmentId?: string;
  mode?: 'assignment' | 'freeplay';
  isAssignmentMode?: boolean;
  theme?: string;
  topic?: string;
  tier?: string;
  vocabularyList?: any[];
  sentenceConfig?: any;
  gameSessionId?: string | null;
  gameService?: BufferedGameSessionService | null;
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

  // 🎯 Always use wrapper's own session ID (created in useEffect below)
  const effectiveGameSessionId = gameSessionId;

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

  // 🎯 Start game session when component mounts (for both assignment and free play modes)
  useEffect(() => {
    if (props.userId && !gameSessionId) {
      startGameSession();
    }
  }, [props.userId, gameSessionId]);

  // End session when component unmounts
  useEffect(() => {
    return () => {
      endGameSession();
    };
  }, []);

  const startGameSession = async () => {
    if (!props.userId) return;

    try {
      const sessionService = getBufferedGameSessionService();
      const startTime = new Date();
      // Handle demo user ID by mapping to a valid UUID
      const effectiveUserId = props.userId === 'demo-user-id' ? '388c67a4-2202-4214-86e8-3f20481e6cb6' : props.userId;
      const sessionId = await sessionService.startGameSession({
        student_id: effectiveUserId,
        assignment_id: props.isAssignmentMode ? props.assignmentId : undefined,
        game_type: 'speed-builder',
        session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
        max_score_possible: 1000,
        session_data: {
          mode: props.mode,
          theme: props.theme,
          topic: props.topic,
          tier: props.tier
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log(`🔮 [${props.isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Speed Builder game session started:`, sessionId);
    } catch (error) {
      console.error('Failed to start speed builder game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameSessionId && props.userId && sessionStartTime && !props.isAssignmentMode) {
      try {
        const sessionService = getBufferedGameSessionService();
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalWordsPlaced > 0
          ? (sessionStats.correctWordsPlaced / sessionStats.totalWordsPlaced) * 100
          : 0;
        const averageResponseTime = sessionStats.totalWordsPlaced > 0
          ? sessionStats.totalResponseTime / sessionStats.totalWordsPlaced
          : 0;

        const totalXP = sessionStats.correctWordsPlaced * 10; // 10 XP per correct word placement (gems-first)

        // Handle demo user ID by mapping to a valid UUID
        const effectiveUserId = props.userId === 'demo-user-id' ? '388c67a4-2202-4214-86e8-3f20481e6cb6' : props.userId;

        await sessionService.endGameSession(gameSessionId, {
          student_id: effectiveUserId,
          assignment_id: props.isAssignmentMode ? props.assignmentId : undefined,
          game_type: 'speed-builder',
          session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
          final_score: Math.round(accuracy * 10),
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalWordsPlaced,
          words_correct: sessionStats.correctWordsPlaced,
          unique_words_practiced: sessionStats.wordPlacementAttempts.length,
          duration_seconds: sessionDuration,
          average_response_time_ms: averageResponseTime,
          xp_earned: totalXP,
          bonus_xp: 0,
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

        console.log(`🔮 [${props.isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Speed Builder game session ended with XP:`, totalXP);
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

    // End the session (only for free play mode - assignment mode handled by wrapper)
    if (!props.isAssignmentMode) {
      await endGameSession();
    }

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

  return (
    <GemSpeedBuilder
      {...props}
      onGameComplete={handleEnhancedGameEnd}
      gameSessionId={effectiveGameSessionId}
      gameService={null} // We're using EnhancedGameSessionService instead
    />
  );
}

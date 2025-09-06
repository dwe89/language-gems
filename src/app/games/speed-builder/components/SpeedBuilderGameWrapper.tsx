'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
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
  theme?: string;
  topic?: string;
  tier?: string;
  vocabularyList?: any[];
  sentenceConfig?: any;
  gameSessionId?: string | null;
  gameService?: EnhancedGameSessionService | null;
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

  // Use assignment gameSessionId when provided, otherwise use own session
  const effectiveGameSessionId = props.assignmentId ? props.gameSessionId : gameSessionId;

  // Use assignment gameService when provided, otherwise use own service
  const effectiveGameService = props.assignmentId ? props.gameService : gameService;
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

  // Start game session when service is ready (only for free play mode)
  useEffect(() => {
    if (effectiveGameService && props.userId && !gameSessionId && !props.assignmentId) {
      startGameSession();
    }
  }, [effectiveGameService, props.userId, gameSessionId, props.assignmentId]);

  // End session when component unmounts
  useEffect(() => {
    return () => {
      endGameSession();
    };
  }, []);

  const startGameSession = async () => {
    if (!effectiveGameService || !props.userId) return;

    try {
      const startTime = new Date();
      // Handle demo user ID by mapping to a valid UUID
      const effectiveUserId = props.userId === 'demo-user-id' ? '388c67a4-2202-4214-86e8-3f20481e6cb6' : props.userId;
      const sessionId = await effectiveGameService.startGameSession({
        student_id: effectiveUserId,
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
    if (effectiveGameService && gameSessionId && props.userId && sessionStartTime && !props.assignmentId) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalWordsPlaced > 0
          ? (sessionStats.correctWordsPlaced / sessionStats.totalWordsPlaced) * 100
          : 0;
        const averageResponseTime = sessionStats.totalWordsPlaced > 0
          ? sessionStats.totalResponseTime / sessionStats.totalWordsPlaced
          : 0;

        // Use gems-first system: XP calculated from individual vocabulary interactions
        // Remove conflicting XP calculation - gems system handles all scoring through recordWordAttempt()
        const totalXP = sessionStats.correctWordsPlaced * 10; // 10 XP per correct word placement (gems-first)

        // Handle demo user ID by mapping to a valid UUID
        const effectiveUserId = props.userId === 'demo-user-id' ? '388c67a4-2202-4214-86e8-3f20481e6cb6' : props.userId;

        await effectiveGameService.endGameSession(effectiveGameSessionId!, {
          student_id: effectiveUserId,
          game_type: 'speed-builder', // Required field
          session_mode: props.assignmentId ? 'assignment' : 'free_play', // Required field
          final_score: Math.round(accuracy * 10), // Scale accuracy to score
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalWordsPlaced,
          words_correct: sessionStats.correctWordsPlaced,
          unique_words_practiced: sessionStats.wordPlacementAttempts.length,
          duration_seconds: sessionDuration,
          average_response_time_ms: averageResponseTime,
          xp_earned: totalXP,
          bonus_xp: 0, // No bonus XP in gems-first system
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

    // End the session (only for free play mode - assignment mode handled by wrapper)
    if (!props.assignmentId) {
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
      gameSessionId={effectiveGameSessionId}
      gameService={null} // We're using EnhancedGameSessionService instead
    />
  );
}

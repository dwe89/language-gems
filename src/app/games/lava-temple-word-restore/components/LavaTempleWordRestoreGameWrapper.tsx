'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import { RewardEngine } from '../../../../services/rewards/RewardEngine';
import LavaTempleWordRestoreGame, { GameConfig } from './LavaTempleWordRestoreGame';

interface LavaTempleWordRestoreGameWrapperProps {
  gameConfig: GameConfig;
  onBackToLauncher?: () => void;
  onBackToMenu?: () => void;
  onGameEnd: (result: { 
    score: number;
    correctAnswers: number;
    totalAttempts: number;
    accuracy: number;
    duration: number;
    tabletsRestored: number;
    fillInBlankAccuracy?: number;
    contextClueUsage?: number;
    templeProgression?: number;
  }) => void;
  assignmentId?: string | null;
  userId?: string;
}

export default function LavaTempleWordRestoreGameWrapper(props: LavaTempleWordRestoreGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalAttempts: 0,
    correctAnswers: 0,
    totalResponseTime: 0,
    gapFillAttempts: [] as any[],
    contextCluesUsed: 0,
    tabletsRestored: 0
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
        game_type: 'lava-temple-word-restore',
        session_mode: props.assignmentId ? 'assignment' : 'free_play',
        max_score_possible: 100, // Base score for temple restoration
        session_data: {
          gameConfig: props.gameConfig,
          language: props.gameConfig.language,
          category: props.gameConfig.category,
          difficulty: props.gameConfig.difficulty
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log('Lava Temple Word Restore game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start lava temple word restore game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameService && gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalAttempts > 0
          ? (sessionStats.correctAnswers / sessionStats.totalAttempts) * 100
          : 0;
        const averageResponseTime = sessionStats.totalAttempts > 0
          ? sessionStats.totalResponseTime / sessionStats.totalAttempts
          : 0;

        // Use gems-first system: XP calculated from individual vocabulary interactions
        // Remove conflicting XP calculation - gems system handles all scoring through recordWordAttempt()
        const totalXP = sessionStats.correctAnswers * 10; // 10 XP per correct gap fill (gems-first)

        await gameService.endGameSession(gameSessionId, {
          student_id: props.userId,
          final_score: Math.round(accuracy),
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalAttempts,
          words_correct: sessionStats.correctAnswers,
          unique_words_practiced: sessionStats.gapFillAttempts.length,
          duration_seconds: sessionDuration,
          xp_earned: totalXP,
          bonus_xp: 0, // No bonus XP in gems-first system
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            averageResponseTime,
            fillInBlankAccuracy: accuracy,
            contextClueUsage: sessionStats.contextCluesUsed,
            templeProgression: sessionStats.tabletsRestored,
            gapFillAttempts: sessionStats.gapFillAttempts
          }
        });

        console.log('Lava Temple Word Restore game session ended successfully with XP:', totalXP);
      } catch (error) {
        console.error('Failed to end lava temple word restore game session:', error);
      }
    }
  };

  // Enhanced game completion handler
  const handleEnhancedGameEnd = async (result: {
    score: number;
    correctAnswers: number;
    totalAttempts: number;
    accuracy: number;
    duration: number;
    tabletsRestored: number;
    fillInBlankAccuracy?: number;
    contextClueUsage?: number;
    templeProgression?: number;
  }) => {
    // Update session stats
    setSessionStats({
      totalAttempts: result.totalAttempts,
      correctAnswers: result.correctAnswers,
      totalResponseTime: result.duration * 1000, // Convert to ms
      gapFillAttempts: [], // Will be populated by individual gap fill logs
      contextCluesUsed: result.contextClueUsage || 0,
      tabletsRestored: result.tabletsRestored
    });

    // End the session
    await endGameSession();

    // Call the original game end handler
    props.onGameEnd(result);
  };

  if (!gameService) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-red-900 via-orange-900 to-yellow-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-yellow-200">Loading temple restoration chamber...</p>
        </div>
      </div>
    );
  }

  return (
    <LavaTempleWordRestoreGame
      {...props}
      onRestorationComplete={handleEnhancedGameEnd}
      gameSessionId={gameSessionId}
      gameService={gameService}
    />
  );
}

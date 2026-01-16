'use client';

import React, { useState, useEffect } from 'react';
import { getBufferedGameSessionService } from '../../../../services/buffered/BufferedGameSessionService';
import { RewardEngine } from '../../../../services/rewards/RewardEngine';
import LavaTempleWordRestoreGame, { GameConfig } from './LavaTempleWordRestoreGame';
import InGameConfigPanel from '../../../../components/games/InGameConfigPanel';

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
  isAssignmentMode?: boolean;
}

export default function LavaTempleWordRestoreGameWrapper(props: LavaTempleWordRestoreGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalAttempts: 0,
    correctAnswers: 0,
    totalResponseTime: 0,
    gapFillAttempts: [] as any[],
    contextCluesUsed: 0,
    tabletsRestored: 0
  });

  // Settings and mute state
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentGameConfig, setCurrentGameConfig] = useState<GameConfig>(props.gameConfig);

  // Start game session when component mounts
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
      const sessionId = await sessionService.startGameSession({
        student_id: props.userId,
        assignment_id: props.isAssignmentMode ? props.assignmentId : undefined,
        game_type: 'lava-temple-word-restore',
        session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
        max_score_possible: 100,
        session_data: {
          gameConfig: props.gameConfig,
          language: props.gameConfig.language,
          category: props.gameConfig.category,
          difficulty: props.gameConfig.difficulty
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log(`🔮 [${props.isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Lava Temple game session started:`, sessionId);
    } catch (error) {
      console.error('Failed to start lava temple word restore game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionService = getBufferedGameSessionService();
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalAttempts > 0
          ? (sessionStats.correctAnswers / sessionStats.totalAttempts) * 100
          : 0;
        const averageResponseTime = sessionStats.totalAttempts > 0
          ? sessionStats.totalResponseTime / sessionStats.totalAttempts
          : 0;

        const totalXP = sessionStats.correctAnswers * 10; // 10 XP per correct gap fill (gems-first)

        await sessionService.endGameSession(gameSessionId, {
          student_id: props.userId,
          assignment_id: props.isAssignmentMode ? props.assignmentId : undefined,
          game_type: 'lava-temple-word-restore',
          session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
          final_score: Math.round(accuracy),
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalAttempts,
          words_correct: sessionStats.correctAnswers,
          unique_words_practiced: sessionStats.gapFillAttempts.length,
          duration_seconds: sessionDuration,
          xp_earned: totalXP,
          bonus_xp: 0,
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

        console.log(`🔮 [${props.isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Lava Temple game session ended with XP:`, totalXP);
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

  // Settings handlers
  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleConfigChange = (newConfig: GameConfig) => {
    setCurrentGameConfig(newConfig);
    setShowSettings(false);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <LavaTempleWordRestoreGame
        {...props}
        gameConfig={currentGameConfig}
        onRestorationComplete={handleEnhancedGameEnd}
        gameSessionId={gameSessionId}
        onOpenSettings={handleOpenSettings}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {showSettings && (
        <InGameConfigPanel
          isOpen={showSettings}
          onClose={handleCloseSettings}
          currentConfig={currentGameConfig}
          onConfigChange={handleConfigChange}
          gameType="sentence"
        />
      )}
    </>
  );
}

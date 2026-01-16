'use client';

import React, { useState, useEffect } from 'react';
import { getBufferedGameSessionService } from '../../../../services/buffered/BufferedGameSessionService';
import { RewardEngine } from '../../../../services/rewards/RewardEngine';
import CaseFileTranslatorGame from './CaseFileTranslatorGame';

interface CaseFileTranslatorGameWrapperProps {
  settings: {
    caseType: string;
    language: string;
    curriculumLevel: string;
    subcategory?: string;
    difficulty: string;
    // KS4-specific parameters
    examBoard?: 'AQA' | 'edexcel';
    tier?: 'foundation' | 'higher';
  };
  onBackToMenu: () => void;
  onGameEnd: (result: {
    correctAnswers: number;
    totalQuestions: number;
    score: number;
    timeSpent: number;
    accuracy: number;
    translationAccuracy?: number;
    contextUnderstanding?: number;
  }) => void;
  assignmentId?: string | null;
  userId?: string;
  isAssignmentMode?: boolean;
  onOpenSettings?: () => void;
}

export default function CaseFileTranslatorGameWrapper(props: CaseFileTranslatorGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    totalResponseTime: 0,
    translationAttempts: [] as any[]
  });

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
        game_type: 'case-file-translator',
        session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
        max_score_possible: 100,
        session_data: {
          settings: props.settings,
          caseType: props.settings.caseType,
          language: props.settings.language,
          curriculumLevel: props.settings.curriculumLevel
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log(`🔮 [${props.isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Case File Translator game session started:`, sessionId);
    } catch (error) {
      console.error('Failed to start case file translator game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionService = getBufferedGameSessionService();
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalQuestions > 0
          ? (sessionStats.correctAnswers / sessionStats.totalQuestions) * 100
          : 0;
        const averageResponseTime = sessionStats.totalQuestions > 0
          ? sessionStats.totalResponseTime / sessionStats.totalQuestions
          : 0;

        let totalXP = sessionStats.correctAnswers * 10; // 10 XP per correct translation (gems-first)

        if (averageResponseTime < 20000) {
          totalXP += RewardEngine.getXPValue('epic'); // Speed bonus for Case File
        }

        await sessionService.endGameSession(gameSessionId, {
          student_id: props.userId,
          assignment_id: props.isAssignmentMode ? props.assignmentId : undefined,
          game_type: 'case-file-translator',
          session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
          final_score: Math.round(accuracy),
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalQuestions,
          words_correct: sessionStats.correctAnswers,
          unique_words_practiced: sessionStats.translationAttempts.length,
          duration_seconds: sessionDuration,
          xp_earned: totalXP,
          bonus_xp: 0,
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            averageResponseTime,
            translationAccuracy: accuracy,
            contextUnderstanding: accuracy,
            caseType: props.settings.caseType,
            translationAttempts: sessionStats.translationAttempts
          }
        });

        console.log(`🔮 [${props.isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Case File Translator game session ended with XP:`, totalXP);
      } catch (error) {
        console.error('Failed to end case file translator game session:', error);
      }
    }
  };

  // Enhanced game completion handler
  const handleEnhancedGameEnd = async (result: {
    correctAnswers: number;
    totalQuestions: number;
    score: number;
    timeSpent: number;
    accuracy: number;
    translationAccuracy?: number;
    contextUnderstanding?: number;
  }) => {
    // Update session stats
    setSessionStats({
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      totalResponseTime: result.timeSpent * 1000, // Convert to ms
      translationAttempts: [] // Will be populated by individual translation logs
    });

    // End the session
    await endGameSession();

    // Call the original game end handler
    props.onGameEnd(result);
  };

  return (
    <CaseFileTranslatorGame
      {...props}
      onGameComplete={handleEnhancedGameEnd}
      gameSessionId={gameSessionId}
    />
  );
}

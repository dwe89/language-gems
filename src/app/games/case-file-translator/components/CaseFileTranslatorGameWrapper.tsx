'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
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
}

export default function CaseFileTranslatorGameWrapper(props: CaseFileTranslatorGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    totalResponseTime: 0,
    translationAttempts: [] as any[]
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
        game_type: 'case-file-translator',
        session_mode: props.assignmentId ? 'assignment' : 'free_play',
        max_score_possible: 100, // Base score for translation work
        session_data: {
          settings: props.settings,
          caseType: props.settings.caseType,
          language: props.settings.language,
          curriculumLevel: props.settings.curriculumLevel
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log('Case File Translator game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start case file translator game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameService && gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalQuestions > 0
          ? (sessionStats.correctAnswers / sessionStats.totalQuestions) * 100
          : 0;
        const averageResponseTime = sessionStats.totalQuestions > 0
          ? sessionStats.totalResponseTime / sessionStats.totalQuestions
          : 0;

        // Calculate XP based on performance
        const baseXP = sessionStats.correctAnswers * 15; // 15 XP per correct translation
        const accuracyBonus = Math.round(accuracy * 0.4); // Bonus for accuracy
        const speedBonus = averageResponseTime < 30000 ? 30 : averageResponseTime < 60000 ? 15 : 0; // Speed bonus
        const caseBonus = sessionStats.totalQuestions >= 10 ? 35 : 0; // Bonus for completing full case
        const totalXP = baseXP + accuracyBonus + speedBonus + caseBonus;

        await gameService.endGameSession(gameSessionId, {
          student_id: props.userId,
          final_score: Math.round(accuracy),
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalQuestions,
          words_correct: sessionStats.correctAnswers,
          unique_words_practiced: sessionStats.translationAttempts.length,
          duration_seconds: sessionDuration,
          xp_earned: totalXP,
          bonus_xp: accuracyBonus + speedBonus + caseBonus,
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            averageResponseTime,
            translationAccuracy: accuracy,
            contextUnderstanding: accuracy, // For now, same as accuracy
            caseType: props.settings.caseType,
            translationAttempts: sessionStats.translationAttempts
          }
        });

        console.log('Case File Translator game session ended successfully with XP:', totalXP);
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

  if (!gameService) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-amber-200">Loading translation workstation...</p>
        </div>
      </div>
    );
  }

  return (
    <CaseFileTranslatorGame
      {...props}
      onGameComplete={handleEnhancedGameEnd}
      gameSessionId={gameSessionId}
      gameService={gameService}
    />
  );
}

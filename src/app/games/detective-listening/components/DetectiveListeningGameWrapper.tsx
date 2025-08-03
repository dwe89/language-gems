'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { useGameVocabulary } from '../../../../hooks/useGameVocabulary';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import DetectiveListeningGame from './DetectiveListeningGame';

interface DetectiveListeningGameWrapperProps {
  settings: {
    caseType: string;
    language: string;
    difficulty: string;
    category?: string;
    subcategory?: string;
  };
  onBackToMenu: () => void;
  onGameEnd: (result: { 
    correctAnswers: number; 
    totalEvidence: number; 
    evidenceCollected: any[];
    timeSpent?: number;
    averageResponseTime?: number;
  }) => void;
  assignmentId?: string | null;
  userId?: string;
}

export default function DetectiveListeningGameWrapper(props: DetectiveListeningGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalEvidence: 0,
    correctAnswers: 0,
    totalResponseTime: 0,
    evidenceCollected: [] as any[]
  });

  // Map language codes
  const mapLanguage = (language: string): string => {
    const languageMap: Record<string, string> = {
      'spanish': 'es',
      'french': 'fr',
      'english': 'en',
      'german': 'de'
    };
    return languageMap[language] || 'es';
  };

  // Use modern vocabulary hook for evidence generation
  const { vocabulary: vocabularyWords, loading: isLoading, error } = useGameVocabulary({
    language: mapLanguage(props.settings.language),
    categoryId: props.settings.category || props.settings.caseType,
    subcategoryId: props.settings.subcategory,
    limit: 20,
    randomize: true
  });

  // Initialize game service
  useEffect(() => {
    if (props.userId) {
      const service = new EnhancedGameService(supabaseBrowser);
      setGameService(service);
    }
  }, [props.userId]);

  // Start game session when vocabulary is loaded
  useEffect(() => {
    if (gameService && props.userId && vocabularyWords.length > 0 && !gameSessionId) {
      startGameSession();
    }
  }, [gameService, props.userId, vocabularyWords, gameSessionId]);

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
        game_type: 'detective-listening',
        session_mode: props.assignmentId ? 'assignment' : 'free_play',
        max_score_possible: 100, // Base score for detective work
        session_data: {
          settings: props.settings,
          vocabularyCount: vocabularyWords.length,
          caseType: props.settings.caseType,
          language: props.settings.language
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log('Detective Listening game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start detective listening game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameService && gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalEvidence > 0
          ? (sessionStats.correctAnswers / sessionStats.totalEvidence) * 100
          : 0;
        const averageResponseTime = sessionStats.totalEvidence > 0
          ? sessionStats.totalResponseTime / sessionStats.totalEvidence
          : 0;

        // Calculate XP based on performance
        const baseXP = sessionStats.correctAnswers * 12; // 12 XP per correct evidence
        const accuracyBonus = Math.round(accuracy * 0.3); // Bonus for accuracy
        const speedBonus = averageResponseTime < 5000 ? 20 : averageResponseTime < 10000 ? 10 : 0; // Speed bonus
        const caseBonus = sessionStats.totalEvidence >= 10 ? 25 : 0; // Bonus for completing full case
        const totalXP = baseXP + accuracyBonus + speedBonus + caseBonus;

        await gameService.endGameSession(gameSessionId, {
          student_id: props.userId,
          final_score: Math.round(accuracy),
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalEvidence,
          words_correct: sessionStats.correctAnswers,
          unique_words_practiced: sessionStats.evidenceCollected.length,
          duration_seconds: sessionDuration,
          xp_earned: totalXP,
          bonus_xp: accuracyBonus + speedBonus + caseBonus,
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            averageResponseTime,
            listeningAccuracy: accuracy,
            evidenceCollected: sessionStats.evidenceCollected,
            caseType: props.settings.caseType
          }
        });

        console.log('Detective Listening game session ended successfully with XP:', totalXP);
      } catch (error) {
        console.error('Failed to end detective listening game session:', error);
      }
    }
  };

  // Enhanced game completion handler
  const handleEnhancedGameEnd = async (result: {
    correctAnswers: number;
    totalEvidence: number;
    evidenceCollected: any[];
    timeSpent?: number;
    averageResponseTime?: number;
  }) => {
    // Update session stats
    setSessionStats({
      totalEvidence: result.totalEvidence,
      correctAnswers: result.correctAnswers,
      totalResponseTime: (result.averageResponseTime || 0) * result.totalEvidence,
      evidenceCollected: result.evidenceCollected
    });

    // End the session
    await endGameSession();

    // Call the original game end handler
    props.onGameEnd(result);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-amber-200">Loading case files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-400">
          <p>Error loading case files: {error}</p>
          <button 
            onClick={props.onBackToMenu}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <DetectiveListeningGame
      {...props}
      onGameComplete={handleEnhancedGameEnd}
      gameSessionId={gameSessionId}
      gameService={gameService}
      vocabularyWords={vocabularyWords}
    />
  );
}

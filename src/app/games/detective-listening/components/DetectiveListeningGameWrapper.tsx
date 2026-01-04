'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { useGameVocabulary } from '../../../../hooks/useGameVocabulary';
import DetectiveListeningGame from './DetectiveListeningGame';

interface DetectiveListeningGameWrapperProps {
  settings?: {
    caseType: string;
    language: string;
    difficulty: string;
    category?: string;
    subcategory?: string;
    curriculumLevel?: string;
    examBoard?: 'AQA' | 'edexcel';
    tier?: 'foundation' | 'higher';
    theme?: string;
  };
  config?: {
    language: string;
    curriculumLevel?: string;
    categoryId?: string;
    subcategoryId?: string;
  };
  vocabulary?: Array<{
    id: string;
    word: string;
    translation: string;
    category?: string;
    subcategory?: string;
    audio_url?: string;
  }>;
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
  isAssignmentMode?: boolean;
  onOpenSettings?: () => void;
  onThemeChange?: (theme: string) => void;
}

export default function DetectiveListeningGameWrapper(props: DetectiveListeningGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
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

  // Determine settings from either props.settings or props.config
  const effectiveSettings = props.settings || {
    caseType: props.config?.categoryId || 'general',
    language: props.config?.language || 'spanish',
    difficulty: 'beginner',
    category: props.config?.categoryId,
    subcategory: props.config?.subcategoryId,
    curriculumLevel: props.config?.curriculumLevel
  };

  // Use modern vocabulary hook for evidence generation (only if no assignment vocabulary provided)
  const { vocabulary: hookVocabulary, loading: isLoading, error } = useGameVocabulary({
    language: mapLanguage(effectiveSettings.language),
    categoryId: effectiveSettings.category || effectiveSettings.caseType,
    subcategoryId: effectiveSettings.subcategory,
    curriculumLevel: effectiveSettings.curriculumLevel,
    examBoard: effectiveSettings.examBoard,
    tier: effectiveSettings.tier,
    limit: 20,
    randomize: true,
    enabled: !props.vocabulary // Only fetch if no assignment vocabulary provided
  });

  // Use assignment vocabulary if available, otherwise use hook vocabulary
  const vocabularyWords = props.vocabulary || hookVocabulary;

  // Debug vocabulary state
  useEffect(() => {
    console.log('🔍 [VOCABULARY DEBUG] State update:', {
      hasPropsVocabulary: !!props.vocabulary,
      propsVocabularyLength: props.vocabulary?.length || 0,
      hasHookVocabulary: !!hookVocabulary,
      hookVocabularyLength: hookVocabulary?.length || 0,
      finalVocabularyLength: vocabularyWords?.length || 0,
      isLoading,
      error: error,
      settings: props.settings
    });
  }, [props.vocabulary, hookVocabulary, vocabularyWords, isLoading, error]);

  // Start game session when vocabulary is loaded
  useEffect(() => {
    if (props.userId && vocabularyWords.length > 0 && !gameSessionId) {
      startGameSession();
    }
  }, [props.userId, vocabularyWords, gameSessionId]);

  // End session when component unmounts
  useEffect(() => {
    return () => {
      endGameSession();
    };
  }, []);

  const startGameSession = async () => {
    if (!props.userId) return;

    try {
      const sessionService = new EnhancedGameSessionService();
      const startTime = new Date();
      const sessionId = await sessionService.startGameSession({
        student_id: props.userId,
        assignment_id: props.isAssignmentMode ? (props.assignmentId || undefined) : undefined,
        game_type: 'detective-listening',
        session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
        max_score_possible: 100,
        session_data: {
          settings: effectiveSettings,
          vocabularyCount: vocabularyWords.length,
          caseType: effectiveSettings.caseType,
          language: effectiveSettings.language
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log(`🔮 [${props.isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Detective Listening game session started:`, sessionId);
    } catch (error) {
      console.error('Failed to start detective listening game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionService = new EnhancedGameSessionService();
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalEvidence > 0
          ? (sessionStats.correctAnswers / sessionStats.totalEvidence) * 100
          : 0;
        const averageResponseTime = sessionStats.totalEvidence > 0
          ? sessionStats.totalResponseTime / sessionStats.totalEvidence
          : 0;

        const totalXP = sessionStats.correctAnswers * 10; // 10 XP per correct word (gems-first)

        await sessionService.endGameSession(gameSessionId, {
          student_id: props.userId,
          assignment_id: props.isAssignmentMode ? (props.assignmentId || undefined) : undefined,
          game_type: 'detective-listening',
          session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
          final_score: Math.round(accuracy),
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalEvidence,
          words_correct: sessionStats.correctAnswers,
          unique_words_practiced: sessionStats.evidenceCollected.length,
          duration_seconds: sessionDuration,
          xp_earned: totalXP,
          bonus_xp: 0,
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            averageResponseTime,
            listeningAccuracy: accuracy,
            evidenceCollected: sessionStats.evidenceCollected,
            caseType: effectiveSettings.caseType
          }
        });

        console.log(`🔮 [${props.isAssignmentMode ? 'ASSIGNMENT' : 'FREE PLAY'}] Detective Listening game session ended with XP:`, totalXP);
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
      settings={effectiveSettings}
      onGameComplete={handleEnhancedGameEnd}
      gameSessionId={gameSessionId}
      vocabularyWords={vocabularyWords}
    />
  );
}

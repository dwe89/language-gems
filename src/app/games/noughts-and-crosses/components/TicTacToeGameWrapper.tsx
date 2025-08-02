'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { useGameVocabulary } from '../../../../hooks/useGameVocabulary';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import TicTacToeGameThemed from './TicTacToeGameThemed';

interface TicTacToeGameWrapperProps {
  settings: {
    difficulty: string;
    category: string;
    subcategory?: string;
    language: string;
    theme: string;
    playerMark: string;
    computerMark: string;
  };
  onBackToMenu: () => void;
  onGameEnd: (result: { outcome: 'win' | 'loss' | 'tie'; wordsLearned: number; perfectGame?: boolean }) => void;
  assignmentId?: string | null;
  userId?: string;
  onOpenSettings?: () => void;
}

export default function TicTacToeGameWrapper(props: TicTacToeGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalGamesPlayed: 0,
    totalGamesWon: 0,
    totalWordsLearned: 0,
    totalCorrectAnswers: 0,
    totalQuestions: 0
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

  // Use modern vocabulary hook
  const { vocabulary: vocabularyWords, loading: isLoading, error } = useGameVocabulary({
    language: mapLanguage(props.settings.language),
    categoryId: props.settings.category,
    subcategoryId: props.settings.subcategory,
    limit: 50,
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

  // End session when component unmounts (user leaves the game)
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
        game_type: 'noughts-and-crosses',
        session_mode: props.assignmentId ? 'assignment' : 'free_play',
        max_score_possible: 100, // Base score for winning
        session_data: {
          settings: props.settings,
          vocabularyCount: vocabularyWords.length
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log('Game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start game session:', error);
    }
  };

  // Transform vocabulary words to the format expected by TicTacToeGameThemed
  const getFormattedVocabulary = () => {
    const formatted = vocabularyWords.map(word => ({
      word: word.word,
      translation: word.translation,
      difficulty: word.difficulty_level || 'beginner',
      audio_url: word.audio_url,
      // Add audio playback function
      playAudio: () => {
        if (word.audio_url) {
          const audio = new Audio(word.audio_url);
          audio.play().catch(error => {
            console.warn('Failed to play audio:', error);
          });
        }
      }
    }));

    return formatted;
  };

  // Enhanced game completion handler for individual rounds
  const handleEnhancedGameEnd = async (result: {
    outcome: 'win' | 'loss' | 'tie';
    wordsLearned: number;
    perfectGame?: boolean;
    correctAnswers?: number;
    totalQuestions?: number;
    timeSpent?: number;
  }) => {
    // Update session stats for this round
    setSessionStats(prev => ({
      totalGamesPlayed: prev.totalGamesPlayed + 1,
      totalGamesWon: prev.totalGamesWon + (result.outcome === 'win' ? 1 : 0),
      totalWordsLearned: prev.totalWordsLearned + result.wordsLearned,
      totalCorrectAnswers: prev.totalCorrectAnswers + (result.correctAnswers || 0),
      totalQuestions: prev.totalQuestions + (result.totalQuestions || 0)
    }));

    // Don't end the session here - let it continue for multiple rounds
    // The session will be ended when the user leaves the game

    // Call the original game end handler
    props.onGameEnd(result);
  };

  // End the session when the user leaves the game
  const endGameSession = async () => {
    if (gameService && gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalQuestions > 0
          ? (sessionStats.totalCorrectAnswers / sessionStats.totalQuestions) * 100
          : 0;
        const winRate = sessionStats.totalGamesPlayed > 0
          ? (sessionStats.totalGamesWon / sessionStats.totalGamesPlayed) * 100
          : 0;

        await gameService.endGameSession(gameSessionId, {
          student_id: props.userId,
          final_score: Math.round(winRate),
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalQuestions,
          words_correct: sessionStats.totalCorrectAnswers,
          unique_words_practiced: sessionStats.totalWordsLearned,
          duration_seconds: sessionDuration,
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            gamesPlayed: sessionStats.totalGamesPlayed,
            winRate
          }
        });

        console.log('Noughts and crosses game session ended successfully');
      } catch (error) {
        console.error('Failed to end noughts and crosses game session:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading vocabulary...</p>
          <p className="text-white/80 text-sm mt-2">
            {props.settings.language} • {props.settings.category} • {props.settings.difficulty}
          </p>
        </div>
      </div>
    );
  }

  if (error && vocabularyWords.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-pink-900 to-purple-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">⚠️ {error}</p>
          <button
            onClick={() => loadVocabulary()}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors mr-4"
          >
            Retry
          </button>
          <button
            onClick={props.onBackToMenu}
            className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <TicTacToeGameThemed
      {...props}
      vocabularyWords={getFormattedVocabulary()}
      onGameEnd={handleEnhancedGameEnd}
      gameSessionId={gameSessionId}
      isAssignmentMode={!!props.assignmentId}
    />
  );
}

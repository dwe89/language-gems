'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { useGameVocabulary, GameVocabularyWord } from '../../../../hooks/useGameVocabulary';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import { RewardEngine } from '../../../../services/rewards/RewardEngine';
import { VocabBlastGameSettings } from '../page';
import VocabBlastGame from './VocabBlastGame';

interface VocabBlastGameWrapperProps {
  settings: VocabBlastGameSettings;
  onBackToMenu: () => void;
  onBackToAssignment?: () => void; // For assignment mode
  onGameEnd: (result: {
    outcome: 'win' | 'loss' | 'timeout';
    score: number;
    wordsLearned: number;
    correctAnswers?: number;
    incorrectAnswers?: number;
    totalAttempts?: number;
    accuracy?: number;
    timeSpent?: number;
    detailedStats?: any;
  }) => void;
  assignmentId?: string | null;
  userId?: string;
  isAssignmentMode?: boolean;
  categoryVocabulary?: any[]; // Assignment vocabulary
  onOpenSettings?: () => void; // Optional settings callback
  gameSessionId?: string | null;
  // Theme selector props for assignment mode
  assignmentTheme?: string;
  onAssignmentThemeChange?: (theme: string) => void;
  showAssignmentThemeSelector?: boolean;
  onToggleAssignmentThemeSelector?: () => void;
  onThemeChange?: (theme: string) => void;
}

// Language mapping function
const mapLanguage = (language: string): string => {
  const mapping: Record<string, string> = {
    'spanish': 'es',
    'french': 'fr',
    'german': 'de',
    'italian': 'it',
    'portuguese': 'pt'
  };
  return mapping[language] || 'es';
};

// Category mapping function
const mapCategory = (category: string): string => {
  const mapping: Record<string, string> = {
    'animals': 'animals',
    'food': 'food_drink',
    'colors': 'colors',
    'numbers': 'numbers_1_30',
    'family': 'family',
    'body': 'body_parts',
    'clothes': 'clothing',
    'house': 'house_home',
    'school': 'school_education',
    'transport': 'transport',
    'weather': 'weather',
    'time': 'time',
    'sports': 'sports_activities',
    'emotions': 'emotions_feelings'
  };
  return mapping[category] || category;
};

export default function VocabBlastGameWrapper(props: VocabBlastGameWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced game service integration
  const [gameService, setGameService] = useState<EnhancedGameSessionService | null>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const sessionStartedRef = useRef(false); // Prevent duplicate session starts

  // Use assignment gameSessionId when provided, otherwise use own session
  const effectiveGameSessionId = props.assignmentId ? props.gameSessionId : gameSessionId;

  // Initialize game service
  useEffect(() => {
    if (props.userId) {
      const service = new EnhancedGameSessionService(supabaseBrowser);
      setGameService(service);
    }
  }, [props.userId]);

  // Use the unified vocabulary hook
  const { vocabulary, loading: vocabularyLoading, error: vocabularyError } = useGameVocabulary({
    language: mapLanguage(props.settings.language),
    categoryId: mapCategory(props.settings.category),
    subcategoryId: props.settings.subcategory,
    curriculumLevel: props.settings.curriculumLevel,
    examBoard: props.settings.examBoard,
    tier: props.settings.tier,
    limit: 100, // Get more words for variety
    randomize: true,
    hasAudio: false, // Audio not required for vocab blast
    difficultyLevel: 'intermediate' // Fixed difficulty
  });

  // Transform vocabulary for the game
  const [gameVocabulary, setGameVocabulary] = useState<GameVocabularyWord[]>([]);

  useEffect(() => {
    // Use assignment vocabulary if available (assignment mode)
    if (props.categoryVocabulary && props.categoryVocabulary.length > 0) {
      console.log('VocabBlast: Using assignment vocabulary:', props.categoryVocabulary.length, 'words');

      // Transform assignment vocabulary to game format, preserving isCustomVocabulary flag
      const transformedVocabulary = props.categoryVocabulary.map((item: any) => ({
        id: item.id,
        word: item.word,
        translation: item.translation,
        category: item.category,
        subcategory: item.subcategory,
        part_of_speech: item.part_of_speech,
        language: item.language,
        isCustomVocabulary: item.isCustomVocabulary ?? false // ✅ Preserve custom vocab flag
      }));

      setGameVocabulary(transformedVocabulary);
      setIsLoading(false);
      return;
    }

    // Otherwise use regular vocabulary loading
    console.log('VocabBlast: Vocabulary loaded:', vocabulary.length, 'words');
    console.log('VocabBlast: Settings:', {
      language: props.settings.language,
      category: props.settings.category,
      mappedLanguage: mapLanguage(props.settings.language),
      mappedCategory: mapCategory(props.settings.category)
    });

    if (vocabulary && vocabulary.length > 0) {
      // Use all vocabulary without difficulty filtering for now
      const limitedVocabulary = vocabulary.slice(0, 50);

      console.log('VocabBlast: Using vocabulary:', limitedVocabulary.length, 'words');
      setGameVocabulary(limitedVocabulary);
      setIsLoading(false);
    } else if (!vocabularyLoading) {
      console.log('VocabBlast: No vocabulary found, vocabulary loading:', vocabularyLoading);
      setIsLoading(false);
    }
  }, [vocabulary, vocabularyLoading, props.categoryVocabulary]);

  // Start game session when vocabulary is loaded (only for free play mode)
  useEffect(() => {
    if (gameService && props.userId && gameVocabulary.length > 0 && !gameSessionId && !props.assignmentId && !sessionStartedRef.current) {
      sessionStartedRef.current = true;
      startGameSession();
    }
  }, [gameService, props.userId, gameVocabulary.length, gameSessionId, props.assignmentId]);

  const startGameSession = async () => {
    if (!gameService || !props.userId || sessionStartedRef.current === false) return;

    try {
      const sessionId = await gameService.startGameSession({
        student_id: props.userId,
        assignment_id: props.assignmentId || undefined,
        game_type: 'vocab-blast',
        session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
        max_score_possible: 1000, // Adjust based on game settings
        session_data: {
          settings: props.settings,
          vocabularyCount: gameVocabulary.length,
          timeLimit: props.settings.timeLimit || 60
        }
      });
      setGameSessionId(sessionId);
      console.log('Vocab blast game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start vocab blast game session:', error);
      sessionStartedRef.current = false; // Reset on error to allow retry
    }
  };

  useEffect(() => {
    if (vocabularyError) {
      setError(vocabularyError);
      setIsLoading(false);
    }
  }, [vocabularyError]);

  // Enhanced game completion handler
  const handleEnhancedGameEnd = async (result: {
    outcome: 'win' | 'loss' | 'timeout';
    score: number;
    wordsLearned: number;
    correctAnswers?: number;
    incorrectAnswers?: number;
    totalAttempts?: number;
    accuracy?: number;
    timeSpent?: number;
    detailedStats?: any;
  }) => {
    // 🎯 REMOVED: Redundant recordWordAttempt loop.
    // VocabBlastGame already records attempts in real-time via recordWordAttempt.
    // Processing them again here causes double-counting of stats.

    // End game session - this will call updateGameCompletionStatus automatically
    if (gameService && effectiveGameSessionId && props.userId) {
      try {
        const accuracy = result.accuracy || (result.wordsLearned > 0 ? (result.wordsLearned / (result.totalAttempts || gameVocabulary.length)) * 100 : 0);
        const finalScore = result.score;
        const actualTimeSpent = result.timeSpent || props.settings.timeLimit || 60;

        await gameService.endGameSession(effectiveGameSessionId!, {
          student_id: props.userId,
          assignment_id: props.assignmentId || undefined,
          game_type: 'vocab-blast',
          session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
          final_score: finalScore,
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: result.totalAttempts || gameVocabulary.length,
          words_correct: result.correctAnswers || result.wordsLearned,
          unique_words_practiced: result.wordsLearned,
          duration_seconds: actualTimeSpent,
          xp_earned: 0, // XP calculated from gems by service
          session_data: {
            outcome: result.outcome,
            finalScore: result.score,
            wordsLearned: result.wordsLearned,
            correctAnswers: result.correctAnswers || 0,
            incorrectAnswers: result.incorrectAnswers || 0,
            totalAttempts: result.totalAttempts || 0,
            accuracy: accuracy,
            timeSpent: actualTimeSpent,
            gameMode: 'vocab-blast',
            theme: props.settings.theme,
            maxCombo: result.detailedStats?.maxCombo || 0,
            clickAccuracy: accuracy,
            detailedStats: result.detailedStats
          }
        });

        console.log('✅ Vocab blast game session ended - completion status updated');
      } catch (error) {
        console.error('Failed to end vocab blast game session:', error);
      }
    }

    // Call the original game end handler
    props.onGameEnd(result);
  };

  useEffect(() => {
    setIsLoading(vocabularyLoading);
  }, [vocabularyLoading]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading vocabulary...</p>
          <p className="text-slate-400 text-sm mt-2">
            Language: {props.settings.language} | Category: {props.settings.category}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && gameVocabulary.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-pink-900 to-purple-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">⚠️ {error}</p>
          <p className="text-slate-300 mb-6">
            Could not load vocabulary for {props.settings.language} - {props.settings.category}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={props.onBackToMenu}
              className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
            >
              {props.isAssignmentMode ? 'Back to Assignment' : 'Back to Menu'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No vocabulary found
  if (gameVocabulary.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No vocabulary found</p>
          <p className="text-slate-300 mb-6">
            No words available for {props.settings.language} - {props.settings.category}
          </p>
          <button
            onClick={props.onBackToMenu}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-colors"
          >
            {props.isAssignmentMode ? 'Back to Assignment' : 'Back to Menu'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <VocabBlastGame
      settings={props.settings}
      vocabulary={gameVocabulary}
      onBackToMenu={props.onBackToMenu}
      onBackToAssignment={props.onBackToAssignment}
      onGameEnd={handleEnhancedGameEnd}
      gameSessionId={effectiveGameSessionId}
      isAssignmentMode={props.isAssignmentMode}
      onOpenSettings={props.onOpenSettings}
      assignmentTheme={props.assignmentTheme}
      onAssignmentThemeChange={props.onAssignmentThemeChange}
      showAssignmentThemeSelector={props.showAssignmentThemeSelector}
      onToggleAssignmentThemeSelector={props.onToggleAssignmentThemeSelector}
      onThemeChange={props.onThemeChange}
    />
  );
}

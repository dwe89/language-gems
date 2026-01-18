'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getBufferedGameSessionService, BufferedGameSessionService } from '../../../../services/buffered/BufferedGameSessionService';
import { useGameVocabulary, transformVocabularyForGame } from '../../../../hooks/useGameVocabulary';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import HangmanGame from './HangmanGame';
import { createAudio } from '@/utils/audioUtils';
import GameCompletionModal from '@/components/games/GameCompletionModal';
import { GAME_COMPLETION_THRESHOLDS } from '@/services/assignments/GameCompletionService';

interface HangmanGameWrapperProps {
  settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    customWords?: string[];
    subcategory?: string; // Add subcategory to the interface
    categoryVocabulary?: any[]; // From the category selection system
    // KS4-specific parameters
    curriculumLevel?: string;
    examBoard?: 'AQA' | 'edexcel';
    tier?: 'foundation' | 'higher';
  };
  onBackToMenu: () => void;
  onGameEnd?: (result: 'win' | 'lose') => void;
  isFullscreen?: boolean;
  assignmentId?: string | null;
  userId?: string;
  isAssignmentMode?: boolean;
  gameSessionId?: string | null;
  playSFX?: (soundName: string) => void;
  onOpenSettings?: () => void;
  toggleMusic?: () => void;
  isMusicEnabled?: boolean;
  onThemeChange?: (theme: string) => void;
  isMobile?: boolean;
}

interface GameVocabularyWord {
  id: string;
  word: string;
  translation: string;
  category?: string;
  subcategory?: string;
  difficulty_level?: string;
}

interface VocabularyPool {
  [language: string]: {
    [category: string]: {
      [difficulty: string]: GameVocabularyWord[]
    }
  }
}

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

// Map category names to match our vocabulary database
const mapCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'animals': 'animals',
    'food': 'food_drink',
    'food_drink': 'food_drink', // Add direct mapping for food_drink
    'family': 'family_relationships',
    'colors': 'colors',
    'numbers': 'basics_core_language',
    'basics_core_language': 'basics_core_language', // Add direct mapping
    'household': 'home_local_area_environment',
    'transport': 'travel_transport',
    'sports': 'free_time_leisure',
    'body': 'health_body_lifestyle',
    'school': 'school_jobs_future',
    'nature': 'weather_nature',
    'technology': 'technology_media',
    // Add more direct mappings for KS3 categories
    'identity_personal_life': 'identity_personal_life',
    'home_local_area': 'home_local_area',
    'school_jobs_future': 'school_jobs_future',
    'clothes_shopping': 'clothes_shopping',
    'holidays_travel_culture': 'holidays_travel_culture',
    'nature_environment': 'nature_environment'
  };
  return categoryMap[category] || category; // Return the category as-is if no mapping found
};

export default function HangmanGameWrapper(props: HangmanGameWrapperProps) {
  console.log('🚀🚀🚀 HANGMAN GAME WRAPPER CALLED 🚀🚀🚀');
  const [vocabularyPool, setVocabularyPool] = useState<VocabularyPool>({});

  // Get threshold for completion
  const WORDS_TO_WIN = GAME_COMPLETION_THRESHOLDS['hangman'] || 8; // Default to 8 if undefined

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  // Enhanced game service integration
  const [gameService, setGameService] = useState<BufferedGameSessionService | null>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);

  // 🎯 Use assignment session from props if available, otherwise use wrapper's own session
  const effectiveGameSessionId = props.isAssignmentMode && props.gameSessionId
    ? props.gameSessionId
    : gameSessionId;
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalWordsAttempted: 0,
    totalWordsCorrect: 0,
    totalScore: 0
  });

  // Check if threshold is met
  useEffect(() => {
    console.log('🔄 [HANGMAN CHECK] Status:', {
      isAssignmentMode: props.isAssignmentMode,
      wordsCorrect: sessionStats.totalWordsCorrect,
      threshold: WORDS_TO_WIN,
      hasShownModal
    });

    if (props.isAssignmentMode && sessionStats.totalWordsCorrect >= WORDS_TO_WIN && !hasShownModal) {
      setHasShownModal(true);
      setShowCompletionModal(true);
      console.log(`🎉 [HANGMAN] Threshold met! ${sessionStats.totalWordsCorrect}/${WORDS_TO_WIN} words`);
      endGameSession();
    }
  }, [sessionStats.totalWordsCorrect, props.isAssignmentMode, hasShownModal, WORDS_TO_WIN]);

  // Initialize game service
  useEffect(() => {
    if (props.userId) {
      const service = getBufferedGameSessionService();
      setGameService(service);
    }
  }, [props.userId]);

  // Use the unified vocabulary hook - always call but conditionally enable
  const hasAssignmentVocabulary = props.settings.categoryVocabulary && props.settings.categoryVocabulary.length > 0;
  const { vocabulary, loading: isLoading, error } = useGameVocabulary({
    language: mapLanguage(props.settings.language),
    categoryId: mapCategory(props.settings.category),
    subcategoryId: props.settings.subcategory,
    curriculumLevel: props.settings.curriculumLevel,
    examBoard: props.settings.examBoard,
    tier: props.settings.tier,
    limit: 100,
    randomize: true,
    hasAudio: true,
    enabled: !hasAssignmentVocabulary
  });

  console.log('🎯 HangmanGameWrapper - Settings received:', {
    category: props.settings.category,
    subcategory: props.settings.subcategory,
    language: props.settings.language,
    categoryVocabulary: props.settings.categoryVocabulary?.length || 0
  });
  console.log('🎯 HangmanGameWrapper - Category mapping:', {
    originalCategory: props.settings.category,
    mappedCategory: mapCategory(props.settings.category)
  });
  console.log('🎯 HangmanGameWrapper - useGameVocabulary params:', {
    language: mapLanguage(props.settings.language),
    categoryId: props.settings.categoryVocabulary && props.settings.categoryVocabulary.length > 0
      ? undefined
      : mapCategory(props.settings.category),
    subcategoryId: props.settings.categoryVocabulary && props.settings.categoryVocabulary.length > 0
      ? undefined
      : props.settings.subcategory
  });
  console.log('🎯 HangmanGameWrapper - vocabulary from hook:', vocabulary?.length || 0, 'words');

  // Debug: Check assignment vocabulary status
  console.log('🎯 HangmanGameWrapper - Assignment vocabulary check:', {
    hasAssignmentVocabulary,
    assignmentVocabLength: props.settings.categoryVocabulary?.length || 0,
    hookVocabLength: vocabulary?.length || 0,
    willUseFallback: !hasAssignmentVocabulary && (!vocabulary || vocabulary.length === 0)
  });





  // Map difficulty levels  
  const mapDifficulty = (difficulty: string): string => {
    const difficultyMap: Record<string, string> = {
      'beginner': 'beginner',
      'intermediate': 'intermediate',
      'advanced': 'advanced'
    };
    return difficultyMap[difficulty] || 'beginner';
  };

  // Process vocabulary from the hook (only if no assignment vocabulary)
  useEffect(() => {
    // Skip if we have assignment vocabulary
    if (hasAssignmentVocabulary) {
      return;
    }

    if (!vocabulary || vocabulary.length === 0) return;

    console.log('Processing vocabulary from hook:', vocabulary.length, 'words');

    // Transform vocabulary to the expected format
    const transformedVocabulary: GameVocabularyWord[] = vocabulary.map(item => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
      category: item.category || 'general',
      subcategory: item.subcategory || '',
      difficulty_level: item.difficulty_level || 'beginner',
      isCustomVocabulary: (item as any).isCustomVocabulary ?? false // ✅ Preserve custom vocab flag
    }));

    // Organize by difficulty
    const organizedVocabulary: VocabularyPool = {};
    const language = mapLanguage(props.settings.language);
    const category = mapCategory(props.settings.category);

    organizedVocabulary[language] = {
      [category]: {
        beginner: transformedVocabulary.filter(w =>
          !w.difficulty_level || w.difficulty_level === 'beginner' || w.word.length <= 6
        ),
        intermediate: transformedVocabulary.filter(w =>
          w.difficulty_level === 'intermediate' || (w.word.length > 6 && w.word.length <= 10)
        ),
        advanced: transformedVocabulary.filter(w =>
          w.difficulty_level === 'advanced' || w.word.length > 10
        )
      }
    };

    // Ensure each difficulty has at least some words by redistributing if needed
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    difficulties.forEach(diff => {
      if (organizedVocabulary[language][category][diff].length === 0) {
        // Copy from beginner as fallback
        organizedVocabulary[language][category][diff] =
          [...organizedVocabulary[language][category]['beginner']];
      }
    });

    setVocabularyPool(organizedVocabulary);
  }, [vocabulary, props.settings.language, props.settings.category, hasAssignmentVocabulary]);

  // Start game session when vocabulary is loaded (only for free play mode - assignment mode gets session from wrapper)
  useEffect(() => {
    if (gameService && props.userId && Object.keys(vocabularyPool).length > 0 && !effectiveGameSessionId) {
      startGameSession();
    }
  }, [gameService, props.userId, vocabularyPool, effectiveGameSessionId]);

  // End the session when the user leaves the game (works for both free play AND assignment mode)
  const endGameSession = async () => {
    if (gameService && effectiveGameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalWordsAttempted > 0 ?
          (sessionStats.totalWordsCorrect / sessionStats.totalWordsAttempted) * 100 : 0;

        // Use gems-first system: XP calculated from individual vocabulary interactions
        // Remove conflicting XP calculation - gems system handles all scoring through recordWordAttempt()
        const totalXP = sessionStats.totalWordsCorrect * 10; // 10 XP per word (gems-first)

        await gameService.endGameSession(effectiveGameSessionId!, {
          student_id: props.userId,
          assignment_id: props.isAssignmentMode ? (props.assignmentId || undefined) : undefined,
          game_type: 'hangman',
          session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
          final_score: sessionStats.totalScore,
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalWordsAttempted,
          words_correct: sessionStats.totalWordsCorrect,
          unique_words_practiced: sessionStats.totalWordsAttempted, // Each word is unique in hangman
          duration_seconds: sessionDuration,
          xp_earned: totalXP,
          bonus_xp: 0, // No bonus XP in gems-first system
          session_data: {
            gameType: 'hangman',
            totalWords: sessionStats.totalWordsAttempted,
            correctWords: sessionStats.totalWordsCorrect,
            averageTimePerWord: sessionStats.totalWordsAttempted > 0 ?
              sessionDuration / sessionStats.totalWordsAttempted : 0,
            hangmanAccuracy: accuracy
          }
        });

        console.log('Hangman game session ended with XP:', totalXP);
      } catch (error) {
        console.error('Error ending hangman game session:', error);
      }
    }
  };

  // End session when component unmounts (user leaves the game)
  useEffect(() => {
    return () => {
      endGameSession();
    };
  }, [endGameSession]);

  // Transform vocabulary to the format expected by HangmanGame (memoized to prevent infinite re-rendering)
  // MOVED HERE: This must be before any conditional returns to maintain hook order
  const gameVocabulary = useMemo(() => {
    // Priority 1: Use assignment vocabulary if provided
    if (hasAssignmentVocabulary) {
      return props.settings.categoryVocabulary?.map(item => ({
        id: item.id || Math.random().toString(),
        word: item.word,
        translation: item.translation || item.english || '',
        category: item.category || props.settings.category,
        subcategory: item.subcategory || props.settings.subcategory,
        difficulty_level: item.difficulty_level || 'beginner',
        isCustomVocabulary: (item as any).isCustomVocabulary ?? false // ✅ Preserve custom vocab flag
      })) || [];
    }
    // Priority 2: Use vocabulary from hook
    else if (vocabulary && vocabulary.length > 0) {
      return vocabulary.map(item => ({
        id: item.id,
        word: item.word,
        translation: item.translation,
        category: item.category,
        subcategory: item.subcategory,
        difficulty_level: item.difficulty_level || 'beginner',
        isCustomVocabulary: (item as any).isCustomVocabulary ?? false // ✅ Preserve custom vocab flag
      }));
    }
    // Priority 3: Fallback words for testing
    else {
      return [
        { id: '1', word: 'casa', translation: 'house', category: props.settings.category, subcategory: props.settings.subcategory, difficulty_level: 'beginner' },
        { id: '2', word: 'gato', translation: 'cat', category: props.settings.category, subcategory: props.settings.subcategory, difficulty_level: 'beginner' },
        { id: '3', word: 'agua', translation: 'water', category: props.settings.category, subcategory: props.settings.subcategory, difficulty_level: 'beginner' },
        { id: '4', word: 'sol', translation: 'sun', category: props.settings.category, subcategory: props.settings.subcategory, difficulty_level: 'beginner' },
        { id: '5', word: 'libro', translation: 'book', category: props.settings.category, subcategory: props.settings.subcategory, difficulty_level: 'beginner' }
      ];
    }
  }, [hasAssignmentVocabulary, props.settings.categoryVocabulary, vocabulary, props.settings.category, props.settings.subcategory]);

  const startGameSession = async () => {
    if (!gameService || !props.userId) return;

    try {
      const startTime = new Date();
      const sessionId = await gameService.startGameSession({
        student_id: props.userId,
        assignment_id: props.assignmentId || undefined,
        game_type: 'hangman',
        session_mode: props.isAssignmentMode ? 'assignment' : 'free_play',
        max_score_possible: 100,
        session_data: {
          settings: props.settings,
          vocabularyCount: vocabulary?.length || 0
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log('Hangman game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start hangman game session:', error);
    }
  };

  // Legacy function removed - now handled by useGameVocabulary hook

  // Function to get vocabulary for the game  
  const getVocabularyForGame = (): string[] => {
    try {
      const words = vocabularyPool[props.settings.language]?.[props.settings.category]?.[props.settings.difficulty] || [];
      return words.map(w => w.word);
    } catch (error) {
      console.error('Error getting vocabulary for game:', error);
      return ['gato', 'perro', 'casa', 'agua', 'sol']; // Emergency fallback
    }
  };

  // Function to get audio URL for a word
  const getAudioForWord = (word: string): string | undefined => {
    try {
      const words = vocabularyPool[props.settings.language]?.[props.settings.category]?.[props.settings.difficulty] || [];
      const vocabularyWord = words.find(w => w.word.toLowerCase() === word.toLowerCase());
      // Cast to any since audio_url might be enriched later or is missing from strict type
      return (vocabularyWord as any)?.audio_url || undefined;
    } catch (error) {
      console.error('Error getting audio for word:', error);
      return undefined;
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

  if (error && Object.keys(vocabularyPool).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-pink-900 to-purple-900">
        <div className="text-center">
          <p className="text-white text-xl mb-4">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors mr-4"
          >
            Retry
          </button>
          <button
            onClick={props.onBackToMenu}
            className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
          >
            {props.isAssignmentMode ? 'Back to Assignment' : 'Back to Games'}
          </button>
        </div>
      </div>
    );
  }

  console.log('🎯 HangmanGameWrapper - Passing vocabulary to game:', gameVocabulary.length, 'words');

  // Enhanced game completion handler for individual words
  const handleEnhancedGameEnd = async (result: 'win' | 'lose', gameStats?: {
    wordsCompleted?: number;
    totalWords?: number;
    correctGuesses?: number;
    totalGuesses?: number;
    timeSpent?: number;
    currentWord?: string;
    vocabularyId?: string;
    wrongGuesses?: number;
    isCustomVocabulary?: boolean; // TRUE if from enhanced_vocabulary_items
  }) => {
    // Update session stats for this word
    const newStats = {
      totalWordsAttempted: sessionStats.totalWordsAttempted + 1,
      totalWordsCorrect: sessionStats.totalWordsCorrect + (result === 'win' ? 1 : 0),
      totalScore: sessionStats.totalScore + (result === 'win' ? 100 : 0)
    };
    setSessionStats(newStats);

    // Log word performance if we have the necessary data
    if (gameService && effectiveGameSessionId && gameStats?.currentWord) {
      try {
        const responseTime = gameStats.timeSpent || 0;
        const accuracy = gameStats.totalGuesses ?
          ((gameStats.totalGuesses - (gameStats.wrongGuesses || 0)) / gameStats.totalGuesses) :
          (result === 'win' ? 1 : 0);

        // Record word attempt using new gems system (exposure-based for hangman)
        const sessionService = getBufferedGameSessionService();
        await sessionService.recordWordAttempt(effectiveGameSessionId!, 'hangman', {
          // ✅ FIXED: Use correct ID field based on vocabulary source
          vocabularyId: gameStats.isCustomVocabulary ? undefined : gameStats.vocabularyId,
          enhancedVocabularyItemId: gameStats.isCustomVocabulary ? gameStats.vocabularyId : undefined,
          wordText: gameStats.currentWord,
          translationText: '', // Translation not available in hangman context
          responseTimeMs: Math.round(responseTime * 1000),
          wasCorrect: result === 'win',
          hintUsed: false,
          streakCount: newStats.totalWordsCorrect,
          difficultyLevel: 'beginner',
          gameMode: 'word_guessing',
          contextData: {
            isLuckBased: true, // Flag for exposure tracking
            wordLength: gameStats.currentWord.length,
            wrongGuesses: gameStats.wrongGuesses || 0,
            totalGuesses: gameStats.totalGuesses || 0,
            incompleteWord: result === 'lose',
            gameResult: result
          }
        });

        console.log('Hangman word performance logged:', {
          word: gameStats.currentWord,
          result,
          responseTime,
          accuracy
        });
      } catch (error) {
        console.error('Failed to log hangman word performance:', error);
      }
    }

    // Don't end the session here - let it continue for multiple words
    // The session will be ended when the user leaves the game

    // Call the original game end handler
    if (props.onGameEnd) {
      props.onGameEnd(result);
    }
  };



  // Enhanced settings - keep original category, don't force to 'custom'
  const enhancedSettings = {
    ...props.settings,
    // Add audio function for the game to use
    playAudio: (word: string) => {
      const audioUrl = getAudioForWord(word);
      if (audioUrl) {
        const audio = createAudio(audioUrl);
        audio.play().catch(error => {
          console.warn('Failed to play audio:', error);
        });
      }
    }
  };

  return (
    <>
      {/* Completion Modal */}
      {props.isAssignmentMode && (
        <GameCompletionModal
          isOpen={showCompletionModal}
          gameName="Hangman"
          wordsCompleted={sessionStats.totalWordsCorrect}
          threshold={WORDS_TO_WIN}
          accuracy={sessionStats.totalWordsAttempted > 0
            ? (sessionStats.totalWordsCorrect / sessionStats.totalWordsAttempted) * 100
            : 0}
          onBackToAssignment={() => {
            if (props.assignmentId) {
              window.location.href = `/student-dashboard/assignments/${props.assignmentId}`;
            } else {
              props.onBackToMenu();
            }
          }}
          onPlayAgain={() => setShowCompletionModal(false)}
          assignmentId={props.assignmentId || undefined}
        />
      )}

      {/* Progress indicator for assignment mode */}
      {props.isAssignmentMode && (
        <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
          <span className="font-bold">{sessionStats.totalWordsCorrect}/{WORDS_TO_WIN}</span>
          <span className="text-white/70 ml-2">words to complete</span>
        </div>
      )}

      <HangmanGame
        {...props}
        settings={enhancedSettings}
        vocabulary={gameVocabulary}
        onGameEnd={handleEnhancedGameEnd}
        isAssignmentMode={props.isAssignmentMode}
        playSFX={props.playSFX || (() => { })}
        gameSessionId={effectiveGameSessionId || undefined}
        userId={props.userId}
        assignmentId={props.assignmentId} // Pass assignmentId for exposure tracking
        onOpenSettings={props.onOpenSettings}
        toggleMusic={props.toggleMusic}
        isMusicEnabled={props.isMusicEnabled}
        onThemeChange={props.onThemeChange}
        isMobile={props.isMobile}
      />
    </>
  );
}

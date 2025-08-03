'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { useGameVocabulary, transformVocabularyForGame } from '../../../../hooks/useGameVocabulary';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import HangmanGame from './HangmanGame';

interface HangmanGameWrapperProps {
  settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    customWords?: string[];
    subcategory?: string; // Add subcategory to the interface
    categoryVocabulary?: any[]; // From the category selection system
  };
  onBackToMenu: () => void;
  onGameEnd?: (result: 'win' | 'lose') => void;
  isFullscreen?: boolean;
  assignmentId?: string | null;
  userId?: string;
  isAssignmentMode?: boolean;
  playSFX?: (soundName: string) => void;
  onOpenSettings?: () => void;
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

  // Enhanced game service integration
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalWordsAttempted: 0,
    totalWordsCorrect: 0,
    totalScore: 0
  });

  // Initialize game service
  useEffect(() => {
    if (props.userId) {
      const service = new EnhancedGameService(supabaseBrowser);
      setGameService(service);
    }
  }, [props.userId]);

  // Use the unified vocabulary hook - disable if we have assignment vocabulary
  const { vocabulary, loading: isLoading, error } = useGameVocabulary({
    language: mapLanguage(props.settings.language),
    categoryId: mapCategory(props.settings.category),
    subcategoryId: props.settings.subcategory,
    limit: 100,
    randomize: true,
    hasAudio: true,
    enabled: !props.settings.categoryVocabulary || props.settings.categoryVocabulary.length === 0
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
    if (props.settings.categoryVocabulary && props.settings.categoryVocabulary.length > 0) {
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
      difficulty_level: item.difficulty_level || 'beginner'
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
  }, [vocabulary, props.settings.language, props.settings.category, props.settings.categoryVocabulary]);

  // Start game session when vocabulary is loaded
  useEffect(() => {
    if (gameService && props.userId && Object.keys(vocabularyPool).length > 0 && !gameSessionId) {
      startGameSession();
    }
  }, [gameService, props.userId, vocabularyPool, gameSessionId]);

  // End the session when the user leaves the game
  const endGameSession = async () => {
    if (gameService && gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalWordsAttempted > 0 ?
          (sessionStats.totalWordsCorrect / sessionStats.totalWordsAttempted) * 100 : 0;

        // Calculate XP based on performance
        const baseXP = sessionStats.totalWordsCorrect * 15; // 15 XP per word
        const accuracyBonus = Math.round(accuracy * 0.3); // Bonus for accuracy
        const speedBonus = sessionDuration < 120 ? 25 : sessionDuration < 300 ? 15 : 0; // Speed bonus
        const totalXP = baseXP + accuracyBonus + speedBonus;

        await gameService.endGameSession(gameSessionId, {
          student_id: props.userId,
          final_score: sessionStats.totalScore,
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalWordsAttempted,
          words_correct: sessionStats.totalWordsCorrect,
          unique_words_practiced: sessionStats.totalWordsAttempted, // Each word is unique in hangman
          duration_seconds: sessionDuration,
          xp_earned: totalXP,
          bonus_xp: accuracyBonus + speedBonus,
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
      return vocabularyWord?.audio_url || undefined;
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
            onClick={() => loadVocabulary()}
            className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors mr-4"
          >
            Retry
          </button>
          <button 
            onClick={props.onBackToMenu}
            className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  // Transform vocabulary to the format expected by HangmanGame
  let gameVocabulary: GameVocabularyWord[] = [];

  // Priority 1: Use assignment vocabulary if provided
  if (props.settings.categoryVocabulary && props.settings.categoryVocabulary.length > 0) {
    console.log('🎯 HangmanGameWrapper - Using assignment vocabulary:', props.settings.categoryVocabulary.length, 'words');
    gameVocabulary = props.settings.categoryVocabulary.map(item => ({
      id: item.id || Math.random().toString(),
      word: item.word,
      translation: item.translation || item.english || '',
      category: item.category || props.settings.category,
      subcategory: item.subcategory || props.settings.subcategory,
      difficulty_level: item.difficulty_level || 'beginner'
    }));
  }
  // Priority 2: Use vocabulary from hook
  else if (vocabulary && vocabulary.length > 0) {
    console.log('🎯 HangmanGameWrapper - Using vocabulary from hook:', vocabulary.length, 'words');
    gameVocabulary = vocabulary.map(item => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
      category: item.category,
      subcategory: item.subcategory,
      difficulty_level: item.difficulty_level
    }));
  }
  // Priority 3: Fallback words for testing
  else {
    console.log('🎯 HangmanGameWrapper - No vocabulary available, using fallback words');
    gameVocabulary = [
      { id: '1', word: 'casa', translation: 'house', category: props.settings.category, subcategory: props.settings.subcategory, difficulty_level: 'beginner' },
      { id: '2', word: 'gato', translation: 'cat', category: props.settings.category, subcategory: props.settings.subcategory, difficulty_level: 'beginner' },
      { id: '3', word: 'agua', translation: 'water', category: props.settings.category, subcategory: props.settings.subcategory, difficulty_level: 'beginner' },
      { id: '4', word: 'sol', translation: 'sun', category: props.settings.category, subcategory: props.settings.subcategory, difficulty_level: 'beginner' },
      { id: '5', word: 'libro', translation: 'book', category: props.settings.category, subcategory: props.settings.subcategory, difficulty_level: 'beginner' }
    ];
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
    vocabularyId?: number;
    wrongGuesses?: number;
  }) => {
    // Update session stats for this word
    const newStats = {
      totalWordsAttempted: sessionStats.totalWordsAttempted + 1,
      totalWordsCorrect: sessionStats.totalWordsCorrect + (result === 'win' ? 1 : 0),
      totalScore: sessionStats.totalScore + (result === 'win' ? 100 : 0)
    };
    setSessionStats(newStats);

    // Log word performance if we have the necessary data
    if (gameService && gameSessionId && gameStats?.currentWord) {
      try {
        const responseTime = gameStats.timeSpent || 0;
        const accuracy = gameStats.totalGuesses ?
          ((gameStats.totalGuesses - (gameStats.wrongGuesses || 0)) / gameStats.totalGuesses) :
          (result === 'win' ? 1 : 0);

        await gameService.logWordPerformance({
          session_id: gameSessionId,
          vocabulary_id: gameStats.vocabularyId,
          word_text: gameStats.currentWord,
          translation_text: '', // Could be enhanced to include translation
          language_pair: `${props.settings.language}_english`,
          attempt_number: 1,
          response_time_ms: Math.round(responseTime * 1000),
          was_correct: result === 'win',
          confidence_level: result === 'win' ?
            (responseTime < 30 ? 5 : responseTime < 60 ? 4 : 3) :
            (gameStats.wrongGuesses || 0) < 3 ? 2 : 1,
          difficulty_level: props.settings.difficulty,
          hint_used: false,
          streak_count: result === 'win' ? newStats.totalWordsCorrect : 0,
          previous_attempts: 0,
          mastery_level: result === 'win' ? 1 : 0,
          error_type: result === 'lose' ? 'word_completion_failed' : undefined,
          grammar_concept: 'vocabulary_spelling',
          error_details: result === 'lose' ? {
            wrongGuesses: gameStats.wrongGuesses || 0,
            totalGuesses: gameStats.totalGuesses || 0,
            incompleteWord: true
          } : undefined,
          context_data: {
            gameType: 'hangman',
            wordLength: gameStats.currentWord.length,
            wrongGuesses: gameStats.wrongGuesses || 0,
            totalGuesses: gameStats.totalGuesses || 0,
            gameResult: result
          },
          timestamp: new Date()
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
        const audio = new Audio(audioUrl);
        audio.play().catch(error => {
          console.warn('Failed to play audio:', error);
        });
      }
    }
  };

  return (
    <HangmanGame
      {...props}
      settings={enhancedSettings}
      vocabulary={gameVocabulary}
      onGameEnd={handleEnhancedGameEnd}
      isAssignmentMode={props.isAssignmentMode}
      playSFX={props.playSFX || (() => {})}
    />
  );
}

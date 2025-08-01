'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import HangmanGameWrapper from './components/HangmanGameWrapper';
import HangmanAssignmentWrapper from './components/HangmanAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import { useAudio } from './hooks/useAudio';

export default function HangmanPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return <HangmanAssignmentWrapper assignmentId={assignmentId} />;
  }

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    streak: 0,
    bestStreak: 0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Game configuration from unified launcher
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
    theme: string;
  } | null>(null);

  // Initialize the audio hook (assuming sound is enabled by default, or you can add a user preference)
  const { playSFX, startBackgroundMusic, stopBackgroundMusic } = useAudio(true);

  // --- Audio Management for Background Music ---
  useEffect(() => {
    if (gameStarted && gameConfig?.theme) {
      // Map your theme strings to the keys expected by useAudio.ts
      const themeMap: Record<string, 'classic' | 'space-explorer' | 'tokyo-nights' | 'pirate-adventure' | 'lava-temple'> = {
        'default': 'classic',
        'space': 'space-explorer',
        'tokyo': 'tokyo-nights',
        'pirate': 'pirate-adventure',
        'temple': 'lava-temple',
      };
      
      const audioThemeKey = themeMap[gameConfig.theme];
      if (audioThemeKey) {
        startBackgroundMusic(audioThemeKey);
      } else {
        // Fallback for unmapped themes or 'default' if not explicitly handled
        startBackgroundMusic('classic'); 
      }
    } else {
      // Stop music when game is not started (e.g., back to menu)
      stopBackgroundMusic();
    }

    // Cleanup function to stop music when component unmounts or dependencies change
    return () => {
      stopBackgroundMusic();
    };
  }, [gameStarted, gameConfig?.theme, startBackgroundMusic, stopBackgroundMusic]);
  // --- End Audio Management ---

  // Transform vocabulary for hangman game
  const transformVocabularyForHangman = (vocabulary: UnifiedVocabularyItem[]) => {
    return vocabulary.map(item => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
      language: item.language,
      category: item.category,
      subcategory: item.subcategory,
      part_of_speech: item.part_of_speech,
      example_sentence: item.example_sentence,
      example_translation: item.example_translation,
      difficulty_level: item.difficulty_level || 'beginner'
    }));
  };

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    const transformedVocabulary = transformVocabularyForHangman(vocabulary);

    setGameConfig({
      config,
      vocabulary: transformedVocabulary,
      theme: theme || 'default'
    });

    setGameStarted(true);

    console.log('Hangman started with:', {
      config,
      vocabularyCount: vocabulary.length,
      theme,
      transformedCount: transformedVocabulary.length
    });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
    stopBackgroundMusic();
  };

  // Load stats from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('hangmanStats');
      if (savedStats) {
        try {
          setGameStats(JSON.parse(savedStats));
        } catch (error) {
          console.error('Failed to parse saved stats', error);
        }
      }
    }
  }, []);

  // Setup fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Conditional logic after all hooks are initialized
  // Only redirect to login if not in demo mode and not authenticated
  if (!isLoading && !user && !isDemo) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Hangman Game...</p>
        </div>
      </div>
    );
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleGameEnd = (result: 'win' | 'lose') => {
    const newStats = { ...gameStats };
    newStats.gamesPlayed += 1;

    if (result === 'win') {
      newStats.gamesWon += 1;
      newStats.streak += 1;
      if (newStats.streak > newStats.bestStreak) {
        newStats.bestStreak = newStats.streak;
      }
      playSFX('victory');
    } else {
      newStats.gamesLost += 1;
      newStats.streak = 0;
      playSFX('defeat');
    }

    setGameStats(newStats);

    // Save to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hangmanStats', JSON.stringify(newStats));
    }
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Vocabulary Hangman"
        gameDescription="Guess the word letter by letter before the hangman is complete"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={0}
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={true}
        defaultTheme="default"
        requiresAudio={false}
      >
        {/* Game-specific stats display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">Your Stats</h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{gameStats.gamesWon}</div>
              <div className="text-white/70 text-sm">Games Won</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{gameStats.bestStreak}</div>
              <div className="text-white/70 text-sm">Best Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{gameStats.gamesPlayed}</div>
              <div className="text-white/70 text-sm">Total Games</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {gameStats.gamesPlayed > 0 ? Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100) : 0}%
              </div>
              <div className="text-white/70 text-sm">Win Rate</div>
            </div>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    return (
      <div className="fixed inset-0 w-full h-full">
        <HangmanGameWrapper
          settings={{
            difficulty: gameConfig.config.curriculumLevel === 'KS4' ? 'hard' : 'medium',
            category: gameConfig.config.categoryId,
            subcategory: gameConfig.config.subcategoryId,
            language: gameConfig.config.language === 'es' ? 'spanish' :
                     gameConfig.config.language === 'fr' ? 'french' :
                     gameConfig.config.language === 'de' ? 'german' : 'spanish',
            theme: gameConfig.theme,
            customWords: [],
            categoryVocabulary: gameConfig.vocabulary
          }}
          onBackToMenu={handleBackToMenu}
          onGameEnd={handleGameEnd}
          isFullscreen={isFullscreen}
          assignmentId={assignmentId}
          userId={user?.id}
          isAssignmentMode={!!assignmentId}
          playSFX={playSFX}
        />
      </div>
    );
  }

  // Fallback
  return null;
}
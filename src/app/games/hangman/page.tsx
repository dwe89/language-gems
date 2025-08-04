'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import HangmanGameWrapper from './components/HangmanGameWrapper';
import GameAssignmentWrapper, {
  GameProgress,
  calculateStandardScore,
  recordAssignmentProgress
} from '../../../components/games/templates/GameAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import { useAudio } from './hooks/useAudio';
import { useGameAudio } from '../../../hooks/useGlobalAudioContext';

export default function HangmanPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Early assignment mode detection to prevent flash
  const isAssignmentMode = assignmentId && mode === 'assignment';

  // Game state management - ALWAYS initialize hooks first
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    streak: 0,
    bestStreak: 0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize the audio hook (assuming sound is enabled by default, or you can add a user preference)
  const { playSFX, startBackgroundMusic, stopBackgroundMusic } = useAudio(true);

  // Global audio context for assignment mode compatibility
  const globalAudioManager = useGameAudio(true);

  // Enhanced playSFX that works with both audio systems
  const enhancedPlaySFX = useCallback((soundName: string) => {
    // Try the original audio system first
    try {
      playSFX(soundName as any);
    } catch (error) {
      console.warn('Original audio system failed, trying global audio context:', error);
    }

    // Initialize global audio context if needed
    if (!globalAudioManager.state.isInitialized) {
      globalAudioManager.initializeAudio().catch(console.warn);
    }
  }, [playSFX, globalAudioManager]);

  // Assignment mode helper functions
  const formatCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'basics_core_language': 'Basics - Core Language',
      'identity_personal_life': 'Identity - Personal Life',
      'family_relationships': 'Family - Relationships',
      'home_local_area_environment': 'Home - Local Area & Environment',
      'school_jobs_future': 'School - Jobs & Future',
      'free_time_leisure': 'Free Time - Leisure',
      'travel_transport': 'Travel - Transport',
      'health_body_lifestyle': 'Health - Body & Lifestyle',
      'food_drink': 'Food - Drink',
      'technology_media': 'Technology - Media',
      'weather_nature': 'Weather - Nature',
      'animals': 'Animals',
      'colors': 'Colors',
      'numbers': 'Numbers',
      'clothing': 'Clothing',
      'sports': 'Sports',
      'hobbies': 'Hobbies',
      'emotions': 'Emotions',
      'time': 'Time',
      'places': 'Places',
      'assignment': 'Assignment Vocabulary'
    };
    return categoryMap[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatSubcategoryName = (subcategory: string) => {
    const subcategoryMap: Record<string, string> = {
      'months': 'Months',
      'days_of_week': 'Days of the Week',
      'time_expressions': 'Time Expressions',
      'numbers_1_30': 'Numbers 1-30',
      'numbers_40_100': 'Numbers 40-100',
      'family_members': 'Family Members',
      'body_parts': 'Body Parts',
      'clothing_items': 'Clothing Items',
      'food_items': 'Food Items',
      'drinks': 'Drinks',
      'animals_domestic': 'Domestic Animals',
      'animals_wild': 'Wild Animals',
      'colors_basic': 'Basic Colors',
      'colors_advanced': 'Advanced Colors',
      'assignment': 'Assignment Words'
    };
    return subcategoryMap[subcategory] || subcategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Hangman assignment completed:', progress);
    // Show completion message and redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 3000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  // If assignment mode, render assignment wrapper (after all hooks are initialized)
  if (assignmentId && mode === 'assignment') {
    if (!user) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 via-orange-500 to-yellow-500">
        {/* Header - consistent with standalone game */}
        <div className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
          <button
            onClick={handleBackToAssignments}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full transition-all border border-white/30 text-white font-medium"
          >
            ← Back to Assignments
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            🎯 Hangman Game
          </h1>

          <div className="w-48"></div> {/* Spacer for centering */}
        </div>

        <GameAssignmentWrapper
          assignmentId={assignmentId}
          gameId="hangman"
          studentId={user.id}
          onAssignmentComplete={handleAssignmentComplete}
          onBackToAssignments={handleBackToAssignments}
          onBackToMenu={() => router.push('/games/hangman')}
        >
          {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
            // Transform vocabulary to the format expected by HangmanGameWrapper
            const gameVocabulary = vocabulary.map(item => item.word);

            console.log('Hangman Assignment - Vocabulary loaded:', vocabulary.length, 'items');

            const categoryName = vocabulary[0]?.category || 'assignment';
            const subcategoryName = vocabulary[0]?.subcategory || 'assignment';

            return (
              <HangmanGameWrapper
                settings={{
                  difficulty: 'intermediate',
                  category: categoryName,
                  subcategory: subcategoryName,
                  language: 'spanish',
                  theme: 'default',
                  customWords: gameVocabulary,
                  categoryVocabulary: vocabulary
                }}
                isAssignmentMode={true}
                onBackToMenu={() => router.push('/games/hangman')}
                onGameEnd={(result) => {
                  // Calculate score based on result
                  const { score, accuracy, maxScore } = calculateStandardScore(
                    result === 'win' ? 1 : 0,
                    1,
                    Date.now(),
                    100
                  );

                  onProgressUpdate({
                    wordsCompleted: result === 'win' ? 1 : 0,
                    totalWords: vocabulary.length,
                    score,
                    maxScore,
                    accuracy
                  });

                  // If this was the last word, complete the assignment
                  if (vocabulary.length === 1) {
                    const progressData: GameProgress = {
                      assignmentId: assignment.id,
                      gameId: 'hangman',
                      studentId: user.id,
                      wordsCompleted: result === 'win' ? 1 : 0,
                      totalWords: vocabulary.length,
                      score,
                      maxScore,
                      accuracy,
                      timeSpent: 0,
                      completedAt: new Date(),
                      sessionData: { result }
                    };

                    // Record progress using unified function
                    recordAssignmentProgress(
                      assignment.id,
                      'hangman',
                      user.id,
                      progressData
                    ).then(() => {
                      onGameComplete(progressData);
                    }).catch(error => {
                      console.error('Failed to record progress:', error);
                      onGameComplete(progressData); // Still complete even if recording fails
                    });
                  }
                }}
                isFullscreen={true}
                assignmentId={assignmentId}
                userId={user.id}
                playSFX={enhancedPlaySFX}
              />
            );
          }}
        </GameAssignmentWrapper>
      </div>
    );
  }

  // Game configuration from unified launcher
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
    theme: string;
  } | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

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
      example_sentence: item.example_sentence_original || '',
      example_translation: item.example_sentence_translation || '',
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

  // Handle back to games
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
    stopBackgroundMusic();
    router.push('/games');
  };

  // Config panel handlers
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (newConfig: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    console.log('🔄 Updating game configuration:', newConfig, 'Theme:', theme);
    const transformedVocabulary = transformVocabularyForHangman(vocabulary);
    setGameConfig(prev => prev ? {
      ...prev,
      config: newConfig,
      vocabulary,
      theme: theme || prev.theme
    } : null);
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

  if (gameStarted && gameConfig) {
  return (
    // Remove 'fixed inset-0 w-full h-full'. HangmanGameWrapper will handle the full-screen fixed positioning.
    // You might want a simple, unstyled div here or nothing if HangmanGameWrapper handles everything.
    // A simple div ensures the InGameConfigPanel can also be rendered within this context.
    <div className="relative w-full h-full">
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
        playSFX={enhancedPlaySFX}
        onOpenSettings={handleOpenConfigPanel}
      />

      {/* In-game configuration panel (assuming it needs to overlay the game) */}
      <InGameConfigPanel
        currentConfig={gameConfig.config}
        onConfigChange={handleConfigChange}
        supportedLanguages={['es', 'fr', 'de']}
        supportsThemes={true}
        currentTheme={gameConfig.theme}
        isOpen={showConfigPanel}
        onClose={handleCloseConfigPanel}
      />
    </div>
  );
}

  // Fallback
  return null;
}
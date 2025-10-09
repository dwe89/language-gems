'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
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

  // Game configuration from unified launcher - MUST be at top level
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
    theme: string;
  } | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Assignment theme state for background music
  const [assignmentTheme, setAssignmentTheme] = useState<string | null>(null);

  // Assignment audio state (will be overridden by wrapper in assignment mode)
  const [assignmentMusicEnabled, setAssignmentMusicEnabled] = useState<boolean | null>(null);
  const [assignmentToggleMusic, setAssignmentToggleMusic] = useState<(() => void) | null>(null);

  // Initialize the audio hook
  // In assignment mode, use the wrapper's music state; otherwise use local state
  const effectiveMusicEnabled = assignmentMusicEnabled !== null ? assignmentMusicEnabled : true;
  const { playSFX, startBackgroundMusic, stopBackgroundMusic } = useAudio(effectiveMusicEnabled);

  // Local music toggle for non-assignment mode
  const [localMusicEnabled, setLocalMusicEnabled] = useState(true);
  const localToggleMusic = () => setLocalMusicEnabled(prev => !prev);

  // Use assignment toggle if available, otherwise use local toggle
  const toggleMusic = assignmentToggleMusic || localToggleMusic;
  const isMusicEnabled = assignmentMusicEnabled !== null ? assignmentMusicEnabled : localMusicEnabled;

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

  // --- Audio Management for Background Music (Normal Mode) ---
  useEffect(() => {
    // Only manage music in normal mode (not assignment mode)
    if (!isAssignmentMode && gameStarted && gameConfig?.theme) {
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
    } else if (!isAssignmentMode) {
      // Stop music when game is not started (e.g., back to menu)
      stopBackgroundMusic();
    }

    // Cleanup function to stop music when component unmounts or dependencies change
    return () => {
      if (!isAssignmentMode) {
        stopBackgroundMusic();
      }
    };
  }, [gameStarted, gameConfig?.theme, startBackgroundMusic, stopBackgroundMusic, isAssignmentMode]);

  // --- Audio Management for Background Music (Assignment Mode) ---
  useEffect(() => {
    // Only manage music in assignment mode
    if (isAssignmentMode && assignmentTheme) {
      // Map theme strings to audio keys
      const themeMap: Record<string, 'classic' | 'space-explorer' | 'tokyo-nights' | 'pirate-adventure' | 'lava-temple'> = {
        'default': 'classic',
        'space': 'space-explorer',
        'tokyo': 'tokyo-nights',
        'pirate': 'pirate-adventure',
        'temple': 'lava-temple',
      };

      const audioThemeKey = themeMap[assignmentTheme] || 'classic';
      startBackgroundMusic(audioThemeKey);
    }

    // Cleanup
    return () => {
      if (isAssignmentMode) {
        stopBackgroundMusic();
      }
    };
  }, [assignmentTheme, startBackgroundMusic, stopBackgroundMusic, isAssignmentMode]);

  // --- Background Music for Assignment Mode ---
  // Handle theme-based background music for assignment mode
  useEffect(() => {
    if (isAssignmentMode && assignmentTheme) {
      // Map assignment theme to audio theme
      const themeMap: Record<string, 'classic' | 'space-explorer' | 'tokyo-nights' | 'pirate-adventure' | 'lava-temple'> = {
        'default': 'classic',
        'space': 'space-explorer',
        'tokyo': 'tokyo-nights',
        'pirate': 'pirate-adventure',
        'temple': 'lava-temple',
      };
      
      const audioThemeKey = themeMap[assignmentTheme] || 'classic';
      startBackgroundMusic(audioThemeKey);
      console.log('Assignment music started for theme:', assignmentTheme, '-> audio:', audioThemeKey);
    }
    
    return () => {
      if (isAssignmentMode) {
        stopBackgroundMusic();
      }
    };
  }, [isAssignmentMode, assignmentTheme, startBackgroundMusic, stopBackgroundMusic]);

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
    // Show completion message and redirect to assignment detail page
    setTimeout(() => {
      if (assignmentId) {
        router.push(`/student-dashboard/assignments/${assignmentId}`);
      } else {
        router.push('/student-dashboard/assignments');
      }
    }, 3000);
  };

  const handleBackToAssignments = () => {
    // If we have an assignmentId, go back to that specific assignment
    // Otherwise go to the assignments list
    if (assignmentId) {
      router.push(`/student-dashboard/assignments/${assignmentId}`);
    } else {
      router.push('/student-dashboard/assignments');
    }
  };

  // Show loading while authenticating (applies to both modes)
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

  // If assignment mode, render assignment wrapper (after all hooks are initialized)
  if (isAssignmentMode) {
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
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="hangman"
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={() => router.push('/games/hangman')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete, gameSessionId, selectedTheme, toggleMusic: wrapperToggleMusic, isMusicEnabled: wrapperMusicEnabled }) => {
          // Transform vocabulary to the format expected by HangmanGameWrapper
          const gameVocabulary = vocabulary.map(item => item.word);

          console.log('Hangman Assignment - Vocabulary loaded:', vocabulary.length, 'items');
          console.log('Hangman Assignment - Selected theme:', selectedTheme);

          // Update assignment theme state when selectedTheme changes (without using hooks)
          if (assignmentTheme !== selectedTheme) {
            setAssignmentTheme(selectedTheme || null);
          }

          // Update assignment music state from wrapper
          if (assignmentMusicEnabled !== wrapperMusicEnabled) {
            setAssignmentMusicEnabled(wrapperMusicEnabled ?? true);
          }
          if (assignmentToggleMusic !== wrapperToggleMusic) {
            setAssignmentToggleMusic(() => wrapperToggleMusic);
          }

          const categoryName = vocabulary[0]?.category || 'assignment';
          const subcategoryName = vocabulary[0]?.subcategory || 'assignment';

          // Use selectedTheme from wrapper, fallback to 'default'
          const gameTheme = selectedTheme || 'default';

          return (
              <HangmanGameWrapper
                settings={{
                  difficulty: 'intermediate',
                  category: categoryName,
                  subcategory: subcategoryName,
                  language: 'spanish',
                  theme: gameTheme,
                  customWords: gameVocabulary,
                  categoryVocabulary: vocabulary
                }}
                isAssignmentMode={true}
                gameSessionId={gameSessionId}
                onBackToMenu={handleBackToAssignments}
                toggleMusic={toggleMusic}
                isMusicEnabled={isMusicEnabled}
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
    );
  }

  // Transform vocabulary for hangman game
  const transformVocabularyForHangman = (vocabulary: UnifiedVocabularyItem[]) => {
    return vocabulary.map(item => {
      // For Hangman, we only need the Spanish word (first part before dash/comma)
      // Handle cases where user entered "casa house" or "casa - house"
      let spanishWord = item.word;
      if (spanishWord.includes(' - ') || spanishWord.includes(' ')) {
        // Split by dash first, then by space if no dash
        const parts = spanishWord.includes(' - ')
          ? spanishWord.split(' - ')
          : spanishWord.split(' ');
        spanishWord = parts[0].trim();
      }

      return {
        id: item.id,
        word: spanishWord, // Only the Spanish word for guessing
        translation: item.translation,
        language: item.language,
        category: item.category,
        subcategory: item.subcategory,
        part_of_speech: item.part_of_speech,
        example_sentence: item.example_sentence_original || '',
        example_translation: item.example_sentence_translation || '',
        difficulty_level: item.difficulty_level || 'beginner'
      };
    });
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

  // Auto-start game if URL parameters are present (from Content First flow)
  useEffect(() => {
    if (!gameStarted && !isAssignmentMode && searchParams) {
      const lang = searchParams.get('lang');
      const level = searchParams.get('level');
      const cat = searchParams.get('cat');
      const theme = searchParams.get('theme');
      const custom = searchParams.get('custom');

      // If we have the basic parameters, auto-start the game
      if (lang && level && cat) {
        console.log('🚀 [HANGMAN] Auto-starting from URL parameters:', {
          lang, level, cat, theme, custom
        });

        const config: UnifiedSelectionConfig = {
          language: lang as 'es' | 'fr' | 'de',
          curriculumLevel: level as 'KS2' | 'KS3' | 'KS4' | 'KS5',
          categoryId: cat,
          subcategoryId: searchParams.get('subcat') || undefined,
          examBoard: searchParams.get('examBoard') as 'AQA' | 'edexcel' || undefined,
          tier: searchParams.get('tier') as 'foundation' | 'higher' || undefined,
          customMode: custom === 'true',
          customContentType: searchParams.get('customType') as 'vocabulary' | 'sentences' | 'mixed' || undefined,
          customVocabulary: custom === 'true' && searchParams.get('customData')
            ? JSON.parse(searchParams.get('customData')!)
            : undefined
        };

        // Use a timeout to ensure the component is fully mounted
        setTimeout(() => {
          handleGameStart(config, [], theme || 'default');
        }, 100);
      }
    }
  }, [searchParams, gameStarted, isAssignmentMode]);

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
  // Only redirect to login if not in demo mode and not authenticated (but not in assignment mode)
  if (!isLoading && !user && !isDemo && !isAssignmentMode) {
    router.push('/auth/login');
    return null;
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
    <>
      <Head>
        <title>Hangman Game | GCSE Vocabulary Practice | Language Gems</title>
        <meta name="description" content="Play Hangman with GCSE Spanish, French, and German vocabulary. Test your spelling and vocabulary knowledge with this classic word guessing game." />
        <meta name="keywords" content="Hangman game, GCSE vocabulary, Spanish hangman, French hangman, German hangman, spelling practice, vocabulary games, language learning" />
        <link rel="canonical" href="https://languagegems.com/games/hangman" />
      </Head>
      {/* Remove 'fixed inset-0 w-full h-full'. HangmanGameWrapper will handle the full-screen fixed positioning.
      You might want a simple, unstyled div here or nothing if HangmanGameWrapper handles everything.
      A simple div ensures the InGameConfigPanel can also be rendered within this context. */}
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
        toggleMusic={toggleMusic}
        isMusicEnabled={isMusicEnabled}
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
    </>
  );
}

  // Fallback
  return null;
}
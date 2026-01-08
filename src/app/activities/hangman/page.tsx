'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import HangmanGameWrapper from './components/HangmanGameWrapper';
import { useAssignmentVocabulary } from '../../../hooks/useAssignmentVocabulary';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import AssignmentThemeSelector from '../../../components/games/AssignmentThemeSelector';
import { useAudio } from './hooks/useAudio';
import { useGameAudio } from '../../../hooks/useGlobalAudioContext';
import { EnhancedGameService } from '../../../services/enhancedGameService';
import { useSharedVocabulary, SharedVocabularyToast } from '../../../components/games/ShareVocabularyButton';
import { GameProgressData } from '../../../interfaces/UnifiedAssignmentInterface';

export default function HangmanPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Early assignment mode detection to prevent flash
  const isAssignmentMode = assignmentId && mode === 'assignment';

  // 🔗 Shared vocabulary detection
  const { sharedVocabulary, isFromSharedLink, clearSharedVocabulary } = useSharedVocabulary();
  const [showSharedToast, setShowSharedToast] = useState(false);

  // Always initialize assignment hook to keep hooks order stable
  // filterOutstanding=true filters out mastered words (accuracy ≥ 80% AND encounters ≥ 3)
  const { assignment, vocabulary: assignmentVocabulary, loading: assignmentLoading, error: assignmentError } =
    useAssignmentVocabulary(assignmentId || '', 'hangman', true);

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
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Assignment theme state for background music
  const [assignmentTheme, setAssignmentTheme] = useState<string | null>('default');

  // Assignment game session state
  const [assignmentGameSessionId, setAssignmentGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);

  // Initialize game service
  useEffect(() => {
    const service = new EnhancedGameService();
    setGameService(service);
    console.log('🎮 [HANGMAN] Game service initialized');
  }, []);

  // 🔗 Handle shared vocabulary auto-start
  useEffect(() => {
    if (isFromSharedLink && sharedVocabulary && sharedVocabulary.items.length > 0 && !gameStarted && !isAssignmentMode) {
      console.log('📎 [HANGMAN] Loading shared vocabulary:', sharedVocabulary.items.length, 'items');

      // Transform shared vocabulary to Hangman format
      const transformedVocabulary: UnifiedVocabularyItem[] = sharedVocabulary.items.map((item, index) => ({
        id: `shared-${index}`,
        word: item.term,
        translation: item.translation,
        language: sharedVocabulary.language || 'spanish',
        category: 'Shared',
        subcategory: 'Custom',
        difficulty: 'intermediate'
      }));

      // Set up game config for shared vocabulary
      const sharedConfig: UnifiedSelectionConfig = {
        language: sharedVocabulary.language || 'es',
        curriculumLevel: 'KS3',
        categoryId: 'custom',
        customMode: true,
        customContentType: sharedVocabulary.contentType || 'vocabulary',
      };

      setGameConfig({
        config: sharedConfig,
        vocabulary: transformedVocabulary,
        theme: 'default'
      });
      setGameStarted(true);
      setShowSharedToast(true);

      // Clear the URL param without reloading
      clearSharedVocabulary();
    }
  }, [isFromSharedLink, sharedVocabulary, gameStarted, isAssignmentMode, clearSharedVocabulary]);

  // Create game session for assignment mode
  useEffect(() => {
    const createAssignmentSession = async () => {
      if (isAssignmentMode && gameService && user?.id && assignmentVocabulary?.length > 0 && !assignmentGameSessionId) {
        try {
          console.log('🎮 [HANGMAN] Creating assignment game session...');
          const sessionId = await gameService.startGameSession({
            student_id: user.id,
            assignment_id: assignmentId!,
            game_type: 'hangman',
            session_mode: 'assignment',
            session_data: {
              vocabularyCount: assignmentVocabulary.length,
              assignmentId: assignmentId
            }
          });
          setAssignmentGameSessionId(sessionId);
          console.log('✅ [HANGMAN] Assignment game session created:', sessionId);
        } catch (error) {
          console.error('🚨 [HANGMAN] Failed to create assignment game session:', error);
        }
      }
    };

    createAssignmentSession();
  }, [isAssignmentMode, gameService, user?.id, assignmentVocabulary, assignmentGameSessionId, assignmentId]);

  // Assignment audio state (will be overridden by wrapper in assignment mode)
  const [assignmentMusicEnabled, setAssignmentMusicEnabled] = useState<boolean | null>(true);
  const [assignmentToggleMusic, setAssignmentToggleMusic] = useState<(() => void) | null>(null);

  // Initialize the audio hook
  // In assignment mode, use the wrapper's music state; otherwise use local state
  const effectiveMusicEnabled = assignmentMusicEnabled !== null ? assignmentMusicEnabled : true;
  const { playSFX, startBackgroundMusic, stopBackgroundMusic } = useAudio(effectiveMusicEnabled);

  // Local music toggle for non-assignment mode
  const [localMusicEnabled, setLocalMusicEnabled] = useState(true);
  const localToggleMusic = () => setLocalMusicEnabled(prev => !prev);

  // Set up assignment toggle music function after audio hooks are initialized
  const memoizedToggleMusic = React.useMemo(() => {
    if (isAssignmentMode) {
      return () => {
        setAssignmentMusicEnabled(prev => {
          const newValue = !prev;
          if (newValue) {
            // Unmuting - restart background music
            if (assignmentTheme) {
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
          } else {
            // Muting - stop background music
            stopBackgroundMusic();
          }
          return newValue;
        });
      };
    }
    return localToggleMusic;
  }, [isAssignmentMode, assignmentTheme, startBackgroundMusic, stopBackgroundMusic, localToggleMusic]);

  // Use assignment toggle if available, otherwise use local toggle
  const toggleMusic = memoizedToggleMusic;
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
      // Initialize global audio context first
      if (!globalAudioManager.state.isInitialized) {
        globalAudioManager.initializeAudio().catch(console.warn);
      }

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
  }, [gameStarted, gameConfig?.theme, startBackgroundMusic, stopBackgroundMusic, isAssignmentMode, globalAudioManager]);

  // --- Audio Management for Background Music (Assignment Mode) ---
  useEffect(() => {
    // Only manage music in assignment mode
    if (isAssignmentMode && assignmentTheme) {
      // Initialize global audio context first
      if (!globalAudioManager.state.isInitialized) {
        globalAudioManager.initializeAudio().catch(console.warn);
      }

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
      console.log('Assignment music started for theme:', assignmentTheme, '-> audio:', audioThemeKey);
    }

    // Cleanup
    return () => {
      if (isAssignmentMode) {
        stopBackgroundMusic();
      }
    };
  }, [assignmentTheme, startBackgroundMusic, stopBackgroundMusic, isAssignmentMode, globalAudioManager]);

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

  const handleAssignmentComplete = async (progress: GameProgressData) => {
    console.log('Hangman assignment completed:', progress);
    // Show completion message and redirect to assignment detail page
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (assignmentId) {
      router.push(`/student-dashboard/assignments/${assignmentId}`);
      setTimeout(() => router.refresh(), 100);
    } else {
      router.push('/student-dashboard/assignments');
      setTimeout(() => router.refresh(), 100);
    }
  };

  const handleBackToAssignments = () => {
    // If we have an assignmentId, go back to that specific assignment
    // Otherwise go to the assignments list
    if (assignmentId) {
      router.push(`/student-dashboard/assignments/${assignmentId}`);
      setTimeout(() => router.refresh(), 100);
    } else {
      router.push('/student-dashboard/assignments');
      setTimeout(() => router.refresh(), 100);
    }
  };


  // Placeholder for assignment-mode content (set below; returned at end)
  let assignmentJSX: JSX.Element | null = null;

  // If assignment mode, render assignment wrapper (after all hooks are initialized)
  if (isAssignmentMode) {
    if (!user) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      );
    } else if (assignmentLoading) {
      assignmentJSX = (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading assignment…</p>
          </div>
        </div>
      );
    } else if (assignmentError || !assignmentVocabulary?.length) {
      assignmentJSX = (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-pink-900 to-purple-900">
          <div className="text-white text-center">
            <p className="text-lg font-semibold mb-2">Unable to load assignment vocabulary.</p>
            <p className="text-sm opacity-80">{assignmentError || 'This assignment has no vocabulary.'}</p>
          </div>
        </div>
      );
    } else {
      const categoryName = assignmentVocabulary[0]?.category || 'assignment';
      const subcategoryName = assignmentVocabulary[0]?.subcategory || 'assignment';

      // Derive a minimal config for the in-game settings panel in assignment mode
      const assignmentUiConfig: UnifiedSelectionConfig = {
        language: 'es',
        curriculumLevel: 'KS3',
        categoryId: categoryName,
        subcategoryId: subcategoryName
      };

      assignmentJSX = (
        <div className="relative w-full h-full">
          <HangmanGameWrapper
            settings={{
              difficulty: 'intermediate',
              category: categoryName,
              subcategory: subcategoryName,
              language: 'spanish',
              theme: assignmentTheme || 'default',
              customWords: assignmentVocabulary.map(v => v.word),
              categoryVocabulary: assignmentVocabulary
            }}
            isAssignmentMode={true}
            assignmentId={assignmentId!}
            userId={user.id}
            gameSessionId={assignmentGameSessionId}
            onBackToMenu={() => router.push(`/student-dashboard/assignments/${assignmentId}`)}
            playSFX={enhancedPlaySFX}
            onOpenSettings={() => setShowThemeSelector(true)}
            toggleMusic={toggleMusic}
            isMusicEnabled={isMusicEnabled}
            isFullscreen={isFullscreen}
          />

          {/* In-game configuration panel (read-only topics for assignments; theme/music still useful) */}
          <InGameConfigPanel
            currentConfig={assignmentUiConfig}
            onConfigChange={(newConfig, _vocab, theme) => {
              if (theme) setAssignmentTheme(theme);
            }}
            supportedLanguages={['es', 'fr', 'de']}
            supportsThemes={true}
            currentTheme={assignmentTheme || 'default'}
            isOpen={showConfigPanel}
            onClose={() => setShowConfigPanel(false)}
          />

          {/* Assignment theme selector */}
          <AssignmentThemeSelector
            currentTheme={assignmentTheme || 'default'}
            onThemeChange={setAssignmentTheme}
            isOpen={showThemeSelector}
            onClose={() => setShowThemeSelector(false)}
          />
        </div>
      );
    }

    // Do not return here; we will return assignmentJSX at the end to preserve hook order
  }

  // Transform vocabulary for hangman game
  const transformVocabularyForHangman = (vocabulary: UnifiedVocabularyItem[]) => {
    return vocabulary.map(item => {
      // For Hangman, we only need the Spanish word.
      // We check for " - " to handle legacy data where translation might be in the word field.
      // We DO NOT split by space anymore, to allow phrases like "Buenos dias" or "Comment allez-vous".
      let spanishWord = item.word;
      if (spanishWord.includes(' - ')) {
        spanishWord = spanishWord.split(' - ')[0].trim();
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

  // Global loading state (applies to both modes)
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

  // Show unified launcher if game not started (only in free-play mode)
  if (!isAssignmentMode && !gameStarted) {
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

  // Free-play render path
  if (!isAssignmentMode && gameStarted && gameConfig) {
    return (
      <>
        <Head>
          <title>Hangman Game | GCSE Vocabulary Practice | Language Gems</title>
          <meta name="description" content="Play Hangman with GCSE Spanish, French, and German vocabulary. Test your spelling and vocabulary knowledge with this classic word guessing game." />
          <meta name="keywords" content="Hangman game, GCSE vocabulary, Spanish hangman, French hangman, German hangman, spelling practice, vocabulary games, language learning" />
          <link rel="canonical" href="https://languagegems.com/games/hangman" />

        </Head>
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
            isAssignmentMode={false}
            playSFX={enhancedPlaySFX}
            onOpenSettings={handleOpenConfigPanel}
            toggleMusic={toggleMusic}
            isMusicEnabled={isMusicEnabled}
            onThemeChange={(newTheme) => {
              setGameConfig(prev => prev ? { ...prev, theme: newTheme } : null);
            }}
          />

          <InGameConfigPanel
            currentConfig={gameConfig.config}
            onConfigChange={handleConfigChange}
            supportedLanguages={['es', 'fr', 'de']}
            supportsThemes={true}
            currentTheme={gameConfig.theme}
            isOpen={showConfigPanel}
            onClose={handleCloseConfigPanel}
            currentVocabulary={gameConfig.vocabulary}
            gameName="Hangman"
          />

          {/* Show toast when vocabulary is loaded from shared link */}
          {showSharedToast && (
            <SharedVocabularyToast
              vocabularyCount={gameConfig.vocabulary.length}
              onDismiss={() => setShowSharedToast(false)}
            />
          )}
        </div>
      </>
    );
  }

  // Assignment-mode final return
  if (isAssignmentMode) {
    return assignmentJSX;
  }

  // Fallback
  return null;
}
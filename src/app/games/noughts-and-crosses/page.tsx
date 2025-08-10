'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import { ThemeProvider } from './components/ThemeProvider';
import TicTacToeGameWrapper from './components/TicTacToeGameWrapper';
import NoughtsAndCrossesAssignmentWrapper from './components/NoughtsAssignmentWrapper';
import UniversalGameWrapper from '../../../utils/universalGameWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem, loadVocabulary } from '../../../hooks/useUnifiedVocabulary';
import { useAudio } from './hooks/useAudio';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';

export default function UnifiedNoughtsAndCrossesPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ALWAYS initialize hooks first to prevent "more hooks than previous render" error
  const [soundEnabled] = useState(true);
  const { playSFX } = useAudio(soundEnabled);

  // Check for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  console.log('🎯 [Noughts] Assignment mode check [DEBUG-v2]:', {
    assignmentId,
    mode,
    hasUser: !!user,
    userId: user?.id,
    timestamp: new Date().toISOString()
  });

  // Assignment mode handlers
  const handleAssignmentComplete = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  // If assignment mode, use the assignment wrapper directly
  // Wait for auth to load before making the decision
  if (assignmentId && mode === 'assignment') {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading assignment...</p>
          </div>
        </div>
      );
    }

    if (user) {
      return (
        <NoughtsAndCrossesAssignmentWrapper assignmentId={assignmentId} />
      );
    }
  }

  // Use universal game wrapper for regular mode
  return (
    <UniversalGameWrapper gameId="noughts-and-crosses">
      {({ settings, isAssignmentMode, assignmentId: assignmentIdFromWrapper, userId, loading, error }) => {
        console.log('🎯 [Noughts] Universal wrapper result:', {
          isAssignmentMode,
          hasSettings: !!settings,
          loading,
          error,
          timestamp: new Date().toISOString()
        });

        if (loading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-lg">Loading assignment...</p>
              </div>
            </div>
          );
        }

        if (error) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Assignment</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Try Again
                </button>
              </div>
            </div>
          );
        }

        if (!settings) {
          return <div>No settings available</div>;
        }

        // Convert settings to the format expected by TicTacToeGameWrapper
        const gameSettings = {
          language: settings.language || 'spanish',
          difficulty: settings.difficulty || 'medium',
          category: settings.category || 'basics_core_language',
          subcategory: settings.subcategory || 'greetings_introductions',
          curriculumLevel: settings.curriculumLevel || 'KS3',
          examBoard: settings.examBoard,
          tier: settings.tier,
          theme: settings.theme || 'classic',
          timeLimit: settings.timeLimit || 120
        };

        return (
          <ThemeProvider theme={gameSettings.theme}>
            <TicTacToeGameWrapper
              settings={gameSettings}
              assignmentId={assignmentIdFromWrapper}
              userId={userId}
              onBackToMenu={() => router.push('/games/noughts-and-crosses')}
              onGameEnd={(result) => {
                console.log('Noughts and Crosses game ended:', result);
                if (isAssignmentMode) {
                  // TODO: Handle assignment completion
                  console.log('Assignment mode game completed');
                }
                router.push('/games/noughts-and-crosses');
              }}
            />
          </ThemeProvider>
        );
      }}
    </UniversalGameWrapper>
  );

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration from unified launcher
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
    theme: string;
  } | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Check for URL parameters from games page navigation
  const [urlParamsChecked, setUrlParamsChecked] = useState(false);

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    const transformedVocabulary = transformVocabularyForTicTacToe(vocabulary);

    setGameConfig({
      config,
      vocabulary: transformedVocabulary,
      theme: theme || 'default'
    });

    setGameStarted(true);

    console.log('Noughts and Crosses started with:', {
      config,
      vocabularyCount: vocabulary.length,
      theme,
      transformedCount: transformedVocabulary.length
    });
  };

  // Check for URL parameters and auto-start game
  useEffect(() => {
    const checkUrlParams = async () => {
      console.log('🔍 [Noughts&Crosses] Checking URL params...', {
        urlParamsChecked,
        gameStarted,
        assignmentId,
        mode,
        isLoading,
        user: !!user,
        isDemo
      });

      if (urlParamsChecked || gameStarted || (assignmentId && mode === 'assignment')) {
        console.log('❌ [Noughts&Crosses] Skipping URL param check:', { urlParamsChecked, gameStarted, assignmentId, mode });
        return;
      }

      const lang = searchParams?.get('lang');
      const level = searchParams?.get('level') as 'KS2' | 'KS3' | 'KS4' | 'KS5';
      const cat = searchParams?.get('cat');
      const subcat = searchParams?.get('subcat');
      const theme = searchParams?.get('theme') || 'default';
      const examBoard = searchParams?.get('examBoard') as 'AQA' | 'edexcel';
      const tier = searchParams?.get('tier') as 'foundation' | 'higher';

      console.log('📋 [Noughts&Crosses] URL Parameters:', { lang, level, cat, subcat, theme, examBoard, tier });

      if (lang && level && cat) {
        try {
          const config: UnifiedSelectionConfig = {
            language: lang,
            curriculumLevel: level,
            categoryId: cat,
            subcategoryId: subcat || undefined,
            // KS4-specific parameters
            examBoard: examBoard || undefined,
            tier: tier || undefined
          };

          console.log('🚀 [Noughts&Crosses] Auto-loading game with config:', config);

          const vocabulary = await loadVocabulary(config);
          console.log('📚 [Noughts&Crosses] Vocabulary loaded:', { count: vocabulary?.length, vocabulary: vocabulary?.slice(0, 3) });

          if (vocabulary && vocabulary.length > 0) {
            console.log('✅ [Noughts&Crosses] Starting game automatically...');
            handleGameStart(config, vocabulary, theme);
          } else {
            console.warn('⚠️ [Noughts&Crosses] No vocabulary loaded for config:', config);
          }
        } catch (error) {
          console.error('❌ [Noughts&Crosses] Error auto-loading game:', error);
        }
      } else {
        console.log('❌ [Noughts&Crosses] Missing required URL parameters:', { lang, level, cat });
      }

      setUrlParamsChecked(true);
    };

    if (!isLoading && (user || isDemo)) {
      console.log('✅ [Noughts&Crosses] Auth ready, checking URL params...');
      checkUrlParams();
    } else {
      console.log('⏳ [Noughts&Crosses] Waiting for auth...', { isLoading, user: !!user, isDemo });
    }
  }, [searchParams, isLoading, user, isDemo, urlParamsChecked, gameStarted, assignmentId, mode]);

  // Authentication check
  if (!isLoading && !user && !isDemo) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Vocabulary Tic-Tac-Toe...</p>
        </div>
      </div>
    );
  }

  // Transform unified vocabulary to noughts and crosses format
  const transformVocabularyForTicTacToe = (vocabulary: UnifiedVocabularyItem[]) => {
    return vocabulary.map(item => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
      language: item.language,
      category: item.category,
      subcategory: item.subcategory,
      part_of_speech: item.part_of_speech,
      example_sentence_original: item.example_sentence_original,
      example_sentence_translation: item.example_sentence_translation
    }));
  };



  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Handle game end
  const handleGameEnd = (result: { outcome: 'win' | 'loss' | 'tie'; wordsLearned: number; perfectGame?: boolean }) => {
    console.log('Game ended:', result);

    // If in assignment mode, redirect back to assignments
    if (assignmentId) {
      setTimeout(() => {
        router.push('/student-dashboard/assignments');
      }, 3000);
    }
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
    const transformedVocabulary = transformVocabularyForTicTacToe(vocabulary);
    setGameConfig(prev => prev ? {
      ...prev,
      config: newConfig,
      vocabulary: transformedVocabulary,
      theme: theme || prev.theme
    } : null);
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Vocabulary Tic-Tac-Toe"
        gameDescription="Answer vocabulary questions correctly"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={1} // Can work with minimal vocabulary
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={true}
        defaultTheme="default"
        requiresAudio={false}
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Answer vocabulary questions correctly to claim squares</p>
            <p>• Get three squares in a row to win</p>
            <p>• Choose your adventure theme for immersive gameplay</p>
            <p>• Compete against the AI in themed environments</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    // Convert unified config to legacy tic-tac-toe settings format
    const legacySettings = {
      difficulty: 'beginner', // Default difficulty
      category: gameConfig.config.categoryId,
      subcategory: gameConfig.config.subcategoryId,
      language: gameConfig.config.language === 'es' ? 'spanish' : 
                gameConfig.config.language === 'fr' ? 'french' : 
                gameConfig.config.language === 'de' ? 'german' : 'spanish',
      theme: gameConfig.theme,
      playerMark: 'X',
      computerMark: 'O'
    };

    return (
      <ThemeProvider themeId={gameConfig.theme}>
        <div className="w-full h-screen">
          <TicTacToeGameWrapper
            settings={legacySettings}
            onBackToMenu={handleBackToMenu}
            onGameEnd={handleGameEnd}
            assignmentId={assignmentId}
            userId={user?.id}
            onOpenSettings={handleOpenConfigPanel}
          />

          {/* In-game configuration panel */}
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
      </ThemeProvider>
    );
  }

  // Fallback
  return null;
}

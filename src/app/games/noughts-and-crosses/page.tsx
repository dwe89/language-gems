'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import { ThemeProvider } from './components/ThemeProvider';
import TicTacToeGameWrapper from './components/TicTacToeGameWrapper';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
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

  // Assignment mode handlers
  const handleAssignmentComplete = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  // Assignment mode: wrap with GameAssignmentWrapper (after all hooks are initialized)
  if (assignmentId && mode === 'assignment' && user) {
    return (
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="noughts-and-crosses"
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={() => router.push('/games/noughts-and-crosses')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          // Convert assignment vocabulary to unified config format
          const assignmentConfig: UnifiedSelectionConfig = {
            language: assignment.vocabulary_criteria?.language || 'spanish',
            curriculumLevel: (assignment.curriculum_level as 'KS2' | 'KS3' | 'KS4' | 'KS5') || 'KS3',
            categoryId: assignment.vocabulary_criteria?.category || 'basics_core_language',
            subcategoryId: assignment.vocabulary_criteria?.subcategory || 'greetings_introductions',
            theme: assignment.game_config?.theme || 'classic'
          };

          // Transform vocabulary for TicTacToe format
          const transformedVocabulary = vocabulary.map(item => ({
            id: item.id,
            word: item.word,
            translation: item.translation,
            language: item.language,
            part_of_speech: item.part_of_speech,
            difficulty: 'medium' as const,
            category: item.category || 'general'
          }));

          return (
            <ThemeProvider theme={assignmentConfig.theme}>
              <TicTacToeGameWrapper
                config={assignmentConfig}
                vocabulary={transformedVocabulary}
                theme={assignmentConfig.theme}
                onBackToMenu={() => router.push('/games/noughts-and-crosses')}
                onGameComplete={onGameComplete}
                assignmentMode={true}
              />
            </ThemeProvider>
          );
        }}
      </GameAssignmentWrapper>
    );
  }

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

      console.log('📋 [Noughts&Crosses] URL Parameters:', { lang, level, cat, subcat, theme });

      if (lang && level && cat) {
        try {
          const config: UnifiedSelectionConfig = {
            language: lang,
            curriculumLevel: level,
            categoryId: cat,
            subcategoryId: subcat || undefined
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

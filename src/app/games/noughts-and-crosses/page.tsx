'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import { ThemeProvider } from './components/ThemeProvider';
import TicTacToeGameWrapper from './components/TicTacToeGameWrapper';
import NoughtsAndCrossesAssignmentWrapper from './components/NoughtsAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import { useAudio } from './hooks/useAudio';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';

export default function UnifiedNoughtsAndCrossesPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ALWAYS initialize ALL hooks first to prevent "more hooks than previous render" error
  const [soundEnabled] = useState(true);
  const { playSFX } = useAudio(soundEnabled);
  
  // Game state management - must be initialized BEFORE any conditional returns
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration from unified launcher - must be initialized BEFORE any conditional returns
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
    theme: string;
  } | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [gameMode, setGameMode] = useState<'computer' | '2-player'>('computer');

  // Check for assignment mode
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // If assignment mode, render assignment wrapper (after all hooks are initialized)
  if (assignmentId && mode === 'assignment') {
    return <NoughtsAndCrossesAssignmentWrapper assignmentId={assignmentId} />;
  }

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
    console.log('🔄 Updating noughts and crosses configuration:', newConfig, 'Theme:', theme);
    const transformedVocabulary = transformVocabularyForTicTacToe(vocabulary);
    setGameConfig(prev => prev ? {
      ...prev,
      config: newConfig,
      vocabulary: transformedVocabulary,
      theme: theme || prev.theme // Update theme if provided, otherwise keep current
    } : null);
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Vocabulary Tic-Tac-Toe"
        gameDescription="Answer vocabulary questions correctly to claim squares and get three in a row"
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
      computerMark: 'O',
      gameMode: gameMode // Use the state variable
    };

    return (
      <ThemeProvider themeId={gameConfig.theme}>
        <div className="w-full h-screen">
          <TicTacToeGameWrapper
            settings={legacySettings}
            vocabulary={gameConfig.vocabulary} // Pass the custom vocabulary
            onBackToMenu={handleBackToMenu}
            onGameEnd={handleGameEnd}
            assignmentId={assignmentId}
            userId={user?.id}
            onOpenSettings={handleOpenConfigPanel}
            onGameModeChange={setGameMode}
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

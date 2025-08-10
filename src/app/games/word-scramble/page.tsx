'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import WordScrambleGameEnhanced from './components/WordScrambleGameEnhanced';
import WordScrambleAssignmentWrapper from './components/WordScrambleAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';

// Game configuration types
type GameMode = 'classic' | 'blitz' | 'marathon' | 'timed_attack' | 'word_storm' | 'zen';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface GameSettings {
  difficulty: Difficulty;
  category: string;
  subcategory: string | null;
  language: string;
  gameMode: GameMode;
}

export default function WordScramblePage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Assignment mode handlers
  const handleAssignmentComplete = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  // Assignment mode: use dedicated assignment wrapper
  if (assignmentId && mode === 'assignment' && user) {
    return (
      <WordScrambleAssignmentWrapper 
        assignmentId={assignmentId}
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={() => router.push('/games/word-scramble')}
      />
    );
  }

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration from unified launcher
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
  } | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

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
          <p className="text-xl">Loading Word Scramble...</p>
        </div>
      </div>
    );
  }

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    setGameConfig({
      config,
      vocabulary
    });

    setGameStarted(true);

    console.log('Word Scramble started with:', {
      config,
      vocabularyCount: vocabulary.length
    });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Config panel handlers
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (newConfig: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    console.log('🔄 Updating game configuration:', newConfig);
    setGameConfig(prev => prev ? {
      ...prev,
      config: newConfig,
      vocabulary
    } : null);
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Word Scramble"
        gameDescription="Unscramble letters to form vocabulary words as quickly as possible"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={1}
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false}
        requiresAudio={false}
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Unscramble the letters to form the correct word</p>
            <p>• Use hints if you get stuck</p>
            <p>• Complete words quickly for bonus points</p>
            <p>• Build streaks for multiplier bonuses</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    // Convert unified config to legacy word scramble format
    const legacySettings: GameSettings = {
      difficulty: gameConfig.config.curriculumLevel === 'KS4' ? 'hard' : 'medium',
      category: gameConfig.config.categoryId,
      subcategory: gameConfig.config.subcategoryId || null,
      language: gameConfig.config.language === 'es' ? 'spanish' :
                gameConfig.config.language === 'fr' ? 'french' :
                gameConfig.config.language === 'de' ? 'german' : 'spanish',
      gameMode: 'classic'
    };

    return (
      <div className="min-h-screen">
        <WordScrambleGameEnhanced
          settings={legacySettings}
          onBackToMenu={handleBackToMenu}
          onGameEnd={(result) => {
            console.log('Word Scramble ended:', result);
            if (assignmentId) {
              setTimeout(() => {
                router.push('/student-dashboard/assignments');
              }, 3000);
            }
          }}
          categoryVocabulary={gameConfig.vocabulary || []}
          assignmentId={assignmentId}
          userId={user?.id}
          isAssignmentMode={!!assignmentId}
          onOpenSettings={handleOpenConfigPanel}
        />

        {/* In-game configuration panel */}
        <InGameConfigPanel
          currentConfig={gameConfig.config}
          onConfigChange={handleConfigChange}
          supportedLanguages={['es', 'fr', 'de']}
          supportsThemes={false}
          isOpen={showConfigPanel}
          onClose={handleCloseConfigPanel}
        />
      </div>
    );
  }

  // Fallback
  return null;
}
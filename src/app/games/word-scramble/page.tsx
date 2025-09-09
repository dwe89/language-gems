'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import WordScrambleAssignmentWrapper from './components/WordScrambleAssignmentWrapper';
import WordScrambleFreePlayWrapper from './components/WordScrambleFreePlayWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';

interface GameConfig {
  config: UnifiedSelectionConfig;
  vocabulary: UnifiedVocabularyItem[];
  theme?: string;
}

export default function WordScramblePage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Handle assignment mode
  if (assignmentId && mode === 'assignment') {
    return (
      <WordScrambleAssignmentWrapper
        assignmentId={assignmentId}
        studentId={user?.id || ''}
        onAssignmentComplete={(progress) => {
          console.log('Assignment completed:', progress);
          router.push('/student-dashboard/assignments');
        }}
        onBackToAssignments={() => router.push('/student-dashboard/assignments')}
        onBackToMenu={() => router.push('/games/word-scramble')}
      />
    );
  }

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    setGameConfig({ config, vocabulary, theme: theme || 'classic' });
    setGameStarted(true);
    console.log('Word Scramble started with:', { config, vocabularyCount: vocabulary.length, theme });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Handle config panel
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    setGameConfig({
      config,
      vocabulary,
      theme: theme || gameConfig?.theme || 'classic'
    });
    setShowConfigPanel(false);
  };

  // Show unified launcher if game not started
  if (!gameStarted || !gameConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <UnifiedGameLauncher
          gameId="word-scramble"
          gameTitle="Word Scramble"
          gameDescription="Unscramble letters to form words and improve your vocabulary!"
          supportedLanguages={['es', 'fr', 'de']}
          supportedCurriculumLevels={['KS3', 'KS4']}
          onGameStart={handleGameStart}
          onBackToGames={() => router.push('/games')}
          requiresVocabulary={true}
          minVocabularyCount={5}
          maxVocabularyCount={50}
          defaultVocabularyCount={20}
        />
      </div>
    );
  }

  // Show game with selected configuration
  return (
    <>
      <div className="min-h-screen">
        <WordScrambleFreePlayWrapper
          vocabulary={gameConfig.vocabulary}
          userId={user?.id}
          language={gameConfig.config.language}
          difficulty={gameConfig.config.curriculumLevel === 'KS4' ? 'hard' : 'medium'}
          onBackToMenu={handleBackToMenu}
          onGameComplete={(result) => {
            console.log('Word Scramble ended:', result);
            handleBackToMenu();
          }}
          onOpenSettings={handleOpenConfigPanel}
        />
      </div>

      {/* In-game configuration panel */}
      <InGameConfigPanel
        currentConfig={gameConfig?.config}
        onConfigChange={handleConfigChange}
        supportedLanguages={['es', 'fr', 'de']}
        supportsThemes={true}
        currentTheme={gameConfig?.theme}
        isOpen={showConfigPanel}
        onClose={handleCloseConfigPanel}
        showCustomMode={false}
      />
    </>
  );
}

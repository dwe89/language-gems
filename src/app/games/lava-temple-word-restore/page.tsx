'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UnifiedSentenceCategorySelector, { SentenceSelectionConfig } from '../../../components/games/UnifiedSentenceCategorySelector';
import LavaTempleWordRestoreGame from './components/LavaTempleWordRestoreGame';

export default function LavaTempleWordRestorePage() {
  const router = useRouter();
  const [gameConfig, setGameConfig] = useState<SentenceSelectionConfig | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const handleSelectionComplete = (config: SentenceSelectionConfig) => {
    console.log('Lava Temple Word Restore starting with config:', config);
    setGameConfig(config);
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
    router.push('/games');
  };

  const handleBackToLauncher = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Show sentence category selector if game not started
  if (!gameStarted) {
    return (
      <UnifiedSentenceCategorySelector
        gameName="Lava Temple: Word Restore"
        title="Lava Temple: Word Restore - Select Content"
        supportedLanguages={['spanish', 'french', 'german']}
        showCustomMode={false} // Uses pre-generated sentence database
        onSelectionComplete={handleSelectionComplete}
        onBack={() => router.push('/games')}
      />
    );
  }

  // Game started - show the actual game
  if (gameConfig) {
    // Convert SentenceSelectionConfig to the format expected by LavaTempleWordRestoreGame
    const legacyGameConfig = {
      language: gameConfig.language as 'spanish' | 'french' | 'german',
      category: gameConfig.categoryId,
      subcategory: gameConfig.subcategoryId || '',
      difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
    };

    return (
      <LavaTempleWordRestoreGame
        gameConfig={legacyGameConfig}
        onBackToLauncher={handleBackToLauncher}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  // Fallback
  return null;
}

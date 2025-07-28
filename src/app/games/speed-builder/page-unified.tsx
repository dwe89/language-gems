'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { GemSpeedBuilder } from './components/GemSpeedBuilder';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';

export default function UnifiedSpeedBuilderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration from unified launcher
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
  } | null>(null);

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    setGameConfig({
      config,
      vocabulary
    });
    
    setGameStarted(true);
    
    console.log('Speed Builder started with:', {
      config,
      vocabularyCount: vocabulary.length
    });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Speed Builder"
        gameDescription="Build sentences quickly by arranging words in the correct order"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={false} // Speed Builder uses sentence data, not vocabulary
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
            <p>• Drag and drop words to build correct sentences</p>
            <p>• Complete sentences as quickly as possible</p>
            <p>• Earn points for speed and accuracy</p>
            <p>• Progress through increasingly complex sentences</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    // Convert unified config to legacy speed builder format
    const legacyLanguage = gameConfig.config.language === 'es' ? 'spanish' : 
                          gameConfig.config.language === 'fr' ? 'french' : 
                          gameConfig.config.language === 'de' ? 'german' : 'spanish';

    const legacyCurriculumType = gameConfig.config.curriculumLevel === 'KS4' ? 'gcse' : 'ks3';
    const legacyTier = gameConfig.config.curriculumLevel === 'KS4' ? 'foundation' : 'core';
    const legacyTheme = gameConfig.config.categoryId || 'general';
    const legacyTopic = gameConfig.config.subcategoryId || 'basic';

    return (
      <div className="min-h-screen">
        <GemSpeedBuilder
          language={legacyLanguage}
          curriculumType={legacyCurriculumType}
          tier={legacyTier}
          theme={legacyTheme}
          topic={legacyTopic}
          onBackToMenu={handleBackToMenu}
          assignmentId={assignmentId}
          userId={user?.id}
        />
      </div>
    );
  }

  // Fallback
  return null;
}

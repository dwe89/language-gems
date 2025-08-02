'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';

export default function UnifiedGemCollectorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
  } | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    setGameConfig({ config, vocabulary });
    setGameStarted(true);
    console.log('Gem Collector started with:', { config, vocabularyCount: vocabulary.length });
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
        gameName="Gem Collector"
        gameDescription="Collect gems by answering vocabulary questions correctly"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={1}
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false}
        requiresAudio={false}
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Answer vocabulary questions to collect gems</p>
            <p>• Different gem types give different points</p>
            <p>• Build streaks for bonus gems</p>
            <p>• Complete collections for achievements</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Placeholder game implementation
  if (gameStarted && gameConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Gem Collector</h2>
          <p className="mb-4">Game integration in progress...</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleOpenConfigPanel}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={handleBackToMenu}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors"
            >
              Back to Selection
            </button>
          </div>
        </div>

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

  return null;
}

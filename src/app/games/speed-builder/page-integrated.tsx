'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { GemSpeedBuilder } from './components/GemSpeedBuilder';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';

export default function SpeedBuilderPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<UnifiedSelectionConfig | null>(null);

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    setSelectedConfig(config);
    setGameStarted(true);
    
    console.log('Speed Builder started with unified config:', {
      config,
      vocabularyCount: vocabulary.length
    });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setSelectedConfig(null);
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Speed Builder"
        gameDescription="Build sentences quickly by arranging words in the correct order"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={false} // Speed Builder uses sentence data, not vocabulary
        minVocabularyRequired={0} // Uses sentence data
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
            <p>• Use power-ups to boost your performance</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show full GemSpeedBuilder with all original features
  if (gameStarted && selectedConfig) {
    // Convert unified config to legacy speed builder format
    const legacyLanguage = selectedConfig.language === 'es' ? 'spanish' : 
                          selectedConfig.language === 'fr' ? 'french' : 
                          selectedConfig.language === 'de' ? 'german' : 'spanish';

    const legacyCurriculumType = selectedConfig.curriculumLevel === 'KS4' ? 'gcse' : 'ks3';
    const legacyTier = selectedConfig.curriculumLevel === 'KS4' ? 'foundation' : 'core';
    const legacyTheme = selectedConfig.categoryId || 'general';
    const legacyTopic = selectedConfig.subcategoryId || 'basic';

    return (
      <div className="min-h-screen">
        {/* Back button */}
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={handleBackToMenu}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors backdrop-blur-sm"
          >
            <svg className="h-5 w-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Back to Games
          </button>
        </div>

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

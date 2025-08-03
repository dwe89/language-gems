'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import UnifiedSentenceCategorySelector, { SentenceSelectionConfig } from '../../../components/games/UnifiedSentenceCategorySelector';
import CaseFileTranslatorGameWrapper from './components/CaseFileTranslatorGameWrapper';

export default function CaseFileTranslatorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration from sentence selector
  const [gameConfig, setGameConfig] = useState<SentenceSelectionConfig | null>(null);

  const handleSelectionComplete = (config: SentenceSelectionConfig) => {
    console.log('Case File Translator starting with config:', config);
    setGameConfig(config);
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameConfig(null);
  };

  // Show sentence category selector if game not started
  if (!gameStarted) {
    return (
      <UnifiedSentenceCategorySelector
        gameName="Case File Translator"
        title="Case File Translator - Select Content"
        supportedLanguages={['spanish', 'french', 'german']}
        showCustomMode={false} // Uses pre-generated sentence database
        onSelectionComplete={handleSelectionComplete}
        onBack={() => router.push('/games')}
      />
    );
  }

  // Game started - show the actual game
  if (gameConfig) {
    // Convert sentence config to legacy settings format
    const legacySettings = {
      caseType: gameConfig.categoryId,
      language: gameConfig.language,
      curriculumLevel: gameConfig.curriculumLevel,
      subcategory: gameConfig.subcategoryId,
      difficulty: 'beginner' // Default difficulty
    };

    return (
      <div className="min-h-screen">
        <CaseFileTranslatorGameWrapper
          settings={legacySettings}
          onBackToMenu={handleBackToMenu}
          onGameEnd={(result) => {
            console.log('Case File Translator ended:', result);
            if (assignmentId) {
              setTimeout(() => {
                router.push('/student-dashboard/assignments');
              }, 3000);
            }
          }}
          assignmentId={assignmentId}
          userId={user?.id}
        />
      </div>
    );
  }

  // Fallback
  return null;
}

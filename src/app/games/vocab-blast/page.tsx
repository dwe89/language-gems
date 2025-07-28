'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import VocabBlastGameWrapper from './components/VocabBlastGameWrapper';
import VocabBlastAssignmentWrapper from './components/VocabBlastAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import { ThemeProvider } from '../noughts-and-crosses/components/ThemeProvider';

export type GameState = 'menu' | 'settings' | 'playing' | 'completed' | 'paused';

export interface VocabBlastGameSettings {
  difficulty: string;
  category: string;
  language: string;
  theme: string;
  subcategory?: string;
  timeLimit: number;
  mode: 'categories' | 'custom';
  customWords?: string[];
}

export default function VocabBlastPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get URL parameters for assignment mode
  const assignmentId = searchParams?.get('assignment');

  // If assignment mode, render assignment wrapper
  if (assignmentId) {
    return <VocabBlastAssignmentWrapper assignmentId={assignmentId} studentId={user?.id || ''} />;
  }

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration from unified launcher
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
    theme: string;
  } | null>(null);

  // Transform vocabulary for vocab blast game
  const transformVocabularyForVocabBlast = (vocabulary: UnifiedVocabularyItem[]) => {
    return vocabulary.map(item => ({
      id: item.id,
      word: item.word,
      translation: item.translation,
      language: item.language,
      category: item.category,
      subcategory: item.subcategory,
      part_of_speech: item.part_of_speech,
      difficulty_level: item.difficulty_level || 'intermediate'
    }));
  };

  // Conditional logic after all hooks are initialized
  // Only redirect to login if not in demo mode and not authenticated
  if (!isLoading && !user && !isDemo) {
    router.push('/auth/login');
    return null;
  }

  // Show loading while authenticating
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading Vocab Blast...</p>
        </div>
      </div>
    );
  }

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    const transformedVocabulary = transformVocabularyForVocabBlast(vocabulary);

    setGameConfig({
      config,
      vocabulary: transformedVocabulary,
      theme: theme || 'default'
    });

    setGameStarted(true);

    console.log('Vocab Blast started with:', {
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

  const handleGameEnd = (result: { outcome: 'win' | 'loss' | 'timeout'; score: number; wordsLearned: number }) => {
    console.log('Game ended:', result);
    if (assignmentId) {
      setTimeout(() => {
        router.push('/student-dashboard/assignments');
      }, 3000);
    }
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Vocab Blast"
        gameDescription="Click vocabulary gems to pop and translate them quickly"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={1}
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
            <p>• Click on vocabulary gems as they appear</p>
            <p>• Type or click the correct translation</p>
            <p>• Build combos for bonus points</p>
            <p>• Complete as many words as possible before time runs out</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    // Convert unified config to legacy vocab blast format
    const legacySettings: VocabBlastGameSettings = {
      difficulty: gameConfig.config.curriculumLevel === 'KS4' ? 'hard' : 'intermediate',
      category: gameConfig.config.categoryId,
      subcategory: gameConfig.config.subcategoryId,
      language: gameConfig.config.language === 'es' ? 'spanish' :
                gameConfig.config.language === 'fr' ? 'french' :
                gameConfig.config.language === 'de' ? 'german' : 'spanish',
      theme: gameConfig.theme,
      timeLimit: 60,
      mode: 'categories' as const
    };

    return (
      <ThemeProvider themeId={gameConfig.theme}>
        <div className="min-h-screen">
          <VocabBlastGameWrapper
            settings={legacySettings}
            onBackToMenu={handleBackToMenu}
            onGameEnd={handleGameEnd}
            assignmentId={assignmentId}
            userId={user?.id}
            categoryVocabulary={gameConfig.vocabulary}
          />
        </div>
      </ThemeProvider>
    );
  }

  // Fallback
  return null;
}

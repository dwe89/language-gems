'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import WordScrambleGameEnhanced from './components/WordScrambleGameEnhanced';
import WordScrambleAssignmentWrapper from './components/WordScrambleAssignmentWrapper';
import GameSettingsEnhanced from './components/GameSettingsEnhanced';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';

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

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return <WordScrambleAssignmentWrapper assignmentId={assignmentId} />;
  }

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<UnifiedSelectionConfig | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);

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
    setSelectedConfig(config);
    setShowSettings(true);
    
    console.log('Word Scramble started with unified config:', {
      config,
      vocabularyCount: vocabulary.length
    });
  };

  // Handle settings complete
  const handleSettingsComplete = (settings: GameSettings) => {
    setGameSettings(settings);
    setShowSettings(false);
    setGameStarted(true);
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setSelectedConfig(null);
    setShowSettings(false);
    setGameSettings(null);
  };

  // Show unified launcher if game not started
  if (!gameStarted && !showSettings) {
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
            <p>• Choose from different game modes for variety</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show settings if config selected but settings not complete
  if (showSettings && selectedConfig) {
    // Convert unified config to legacy word scramble format
    const legacySettings: GameSettings = {
      difficulty: selectedConfig.curriculumLevel === 'KS4' ? 'hard' : 'medium',
      category: selectedConfig.categoryId,
      subcategory: selectedConfig.subcategoryId,
      language: selectedConfig.language === 'es' ? 'spanish' : 
                selectedConfig.language === 'fr' ? 'french' : 
                selectedConfig.language === 'de' ? 'german' : 'spanish',
      gameMode: 'classic'
    };

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

        <GameSettingsEnhanced
          initialSettings={legacySettings}
          onSettingsComplete={handleSettingsComplete}
          onBack={handleBackToMenu}
        />
      </div>
    );
  }

  // Show game if started and settings complete
  if (gameStarted && gameSettings && selectedConfig) {
    return (
      <div className="min-h-screen">
        <WordScrambleGameEnhanced
          settings={gameSettings}
          onBackToMenu={handleBackToMenu}
          onGameEnd={(result) => {
            console.log('Word Scramble ended:', result);
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

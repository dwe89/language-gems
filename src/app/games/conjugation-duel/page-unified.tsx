'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import ConjugationDuelAssignmentWrapper from './components/ConjugationDuelAssignmentWrapper';
import BattleArena from './components/BattleArena';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';

export default function UnifiedConjugationDuelPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return <ConjugationDuelAssignmentWrapper assignmentId={assignmentId} />;
  }

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
    
    console.log('Conjugation Duel started with:', {
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
        gameName="Conjugation Duel"
        gameDescription="Battle opponents by conjugating verbs correctly in fast-paced duels"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={false} // Conjugation Duel uses verb conjugation data
        minVocabularyRequired={0} // Uses verb data, not vocabulary
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false}
        requiresAudio={false}
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Choose your league and opponent</p>
            <p>• Conjugate verbs correctly to attack</p>
            <p>• Defeat opponents to advance leagues</p>
            <p>• Master all verb tenses to become champion</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    // Convert unified config to legacy conjugation duel format
    const legacyLanguage = gameConfig.config.language === 'es' ? 'spanish' : 
                          gameConfig.config.language === 'fr' ? 'french' : 
                          gameConfig.config.language === 'de' ? 'german' : 'spanish';

    return (
      <div className="min-h-screen">
        <BattleArena
          language={legacyLanguage}
          league="beginner" // Default league
          opponent={{ name: "AI Challenger", difficulty: "medium" }} // Default opponent
          onBackToMenu={handleBackToMenu}
          onGameEnd={(result) => {
            console.log('Conjugation Duel ended:', result);
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

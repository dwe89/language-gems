'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import VocabMasterGameWrapper from './components/VocabMasterGameWrapper';
import VocabMasterLauncher from './components/VocabMasterLauncher';

export default function VocabMasterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSession, setGameSession] = useState<{
    mode: string;
    vocabulary: any[];
    config: Record<string, any>;
  } | null>(null);

  // Handle game start from launcher
  const handleGameStart = (mode: string, vocabulary: any[], config: Record<string, any>) => {
    setGameSession({ mode, vocabulary, config });
    setGameStarted(true);
    console.log('Vocab Master started with:', { mode, vocabularyCount: vocabulary.length, config });
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameSession(null);
  };

  // Handle game completion
  const handleGameComplete = (results: any) => {
    console.log('Vocab Master game completed with results:', results);
    // Could show results screen here or navigate back
    handleBackToMenu();
  };

  // Show launcher if game not started
  if (!gameStarted) {
    return (
      <VocabMasterLauncher
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
      />
    );
  }

  // Show game with analytics wrapper if started
  if (gameStarted && gameSession) {
    return (
      <VocabMasterGameWrapper
        mode={gameSession.mode}
        vocabulary={gameSession.vocabulary}
        config={gameSession.config}
        onComplete={handleGameComplete}
        onExit={handleBackToMenu}
        userId={user?.id}
      />
    );
  }

  return null;
}

'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UnifiedSentenceCategorySelector, { SentenceSelectionConfig } from '../../../components/games/UnifiedSentenceCategorySelector';
import LavaTempleWordRestoreGameWrapper from './components/LavaTempleWordRestoreGameWrapper';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
import { useAuth } from '../../../components/auth/AuthProvider';
import Link from 'next/link';

export default function LavaTempleWordRestorePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');
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

  // If assignment mode, use GameAssignmentWrapper
  if (assignmentId && mode === 'assignment') {
    return (
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="lava-temple-word-restore"
        studentId={user?.id}
        onAssignmentComplete={(progress) => {
          console.log('Lava Temple Word Restore assignment completed:', progress);
          router.push('/student-dashboard');
        }}
        onBackToAssignments={() => router.push('/student-dashboard')}
        onBackToMenu={() => router.push('/games/lava-temple-word-restore')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          const handleGameComplete = (gameResult: any) => {
            // Calculate standardized progress metrics
            const wordsCompleted = gameResult.correctAnswers || 0;
            const totalWords = gameResult.totalAttempts || vocabulary.length;
            const score = gameResult.score || 0;
            const accuracy = gameResult.accuracy || 0;

            // Update progress
            onProgressUpdate({
              wordsCompleted,
              totalWords,
              score,
              maxScore: totalWords * 100, // 100 points per word
              accuracy
            });

            // Complete assignment
            onGameComplete({
              assignmentId: assignment.id,
              gameId: 'lava-temple-word-restore',
              studentId: user?.id || '',
              wordsCompleted,
              totalWords,
              score,
              maxScore: totalWords * 100,
              accuracy,
              timeSpent: gameResult.duration || 0,
              completedAt: new Date(),
              sessionData: gameResult
            });
          };

          const handleBackToAssignments = () => {
            router.push('/student-dashboard');
          };

          // For sentence-based games like Lava Temple, we use the assignment's vocabulary criteria
          // to configure the game rather than passing individual vocabulary items
          const gameConfig = {
            language: (assignment.vocabulary_criteria?.language || 'spanish') as 'spanish' | 'french' | 'german',
            category: assignment.vocabulary_criteria?.category || 'assignment',
            subcategory: assignment.vocabulary_criteria?.subcategory || 'assignment',
            difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
          };

          return (
            <LavaTempleWordRestoreGameWrapper
              gameConfig={gameConfig}
              onBackToLauncher={handleBackToAssignments}
              onBackToMenu={handleBackToAssignments}
              onGameEnd={handleGameComplete}
              assignmentId={assignment.id}
              userId={user?.id}
            />
          );
        }}
      </GameAssignmentWrapper>
    );
  }

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
      <LavaTempleWordRestoreGameWrapper
        gameConfig={legacyGameConfig}
        onBackToLauncher={handleBackToLauncher}
        onBackToMenu={handleBackToMenu}
        onGameEnd={(result) => {
          console.log('Lava Temple Word Restore ended:', result);
          // Could add navigation logic here if needed
        }}
        userId={user?.id}
      />
    );
  }

  // Fallback
  return null;
}

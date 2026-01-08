'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';
import LavaTempleWordRestoreGameWrapper from './components/LavaTempleWordRestoreGameWrapper';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
import { useAuth } from '../../../components/auth/AuthProvider';
import { GameConfig } from './components/LavaTempleWordRestoreGame';

export default function LavaTempleWordRestorePage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');
  
  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);

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
            console.log('Lava Temple Word Restore assignment game completed:', gameResult);
            
            // Update progress with the game results
            onProgressUpdate({
              score: gameResult.score || 0,
              accuracy: gameResult.accuracy || 0,
              timeSpent: gameResult.timeSpent || 0
            });

            // Complete the assignment
            onGameComplete({
              assignmentId: assignmentId || '',
              gameId: 'lava-temple-word-restore',
              studentId: user?.id || '',
              wordsCompleted: gameResult.correctAnswers || 0,
              totalWords: gameResult.totalAttempts || 10,
              score: gameResult.score || 0,
              maxScore: (gameResult.totalAttempts || 10) * 100,
              accuracy: gameResult.accuracy || 0,
              timeSpent: gameResult.timeSpent || 0,
              completedAt: new Date(),
              sessionData: gameResult
            });
          };

          // For sentence-based games like Lava Temple, we use the assignment's vocabulary criteria
          // to configure the game rather than passing individual vocabulary items
          const legacyGameConfig: GameConfig = {
            language: (assignment.vocabulary_criteria?.language || 'spanish') as 'spanish' | 'french' | 'german',
            category: assignment.vocabulary_criteria?.category || 'assignment',
            subcategory: assignment.vocabulary_criteria?.subcategory || 'assignment',
            difficulty: 'beginner'
          };

          return (
            <LavaTempleWordRestoreGameWrapper
              gameConfig={legacyGameConfig}
              onBackToMenu={() => router.push('/games/lava-temple-word-restore')}
              onGameEnd={handleGameComplete}
              assignmentId={assignmentId}
              userId={user?.id}
            />
          );
        }}
      </GameAssignmentWrapper>
    );
  }

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    // Convert unified config to legacy game config format
    const legacyGameConfig: GameConfig = {
      language: config.language === 'es' ? 'spanish' :
                config.language === 'fr' ? 'french' :
                config.language === 'de' ? 'german' : 'spanish',
      category: config.categoryId || 'general',
      subcategory: config.subcategoryId || 'general',
      difficulty: 'beginner' // Default difficulty
    };
    
    setGameConfig(legacyGameConfig);
    setGameStarted(true);
    
    console.log('Lava Temple Word Restore started with config:', legacyGameConfig);
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

  // Handle game end
  const handleGameEnd = (result: any) => {
    console.log('Game ended:', result);

    // If in assignment mode, redirect back to assignments
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
        gameName="Lava Temple Word Restore"
        gameDescription="Restore ancient vocabulary words in the mystical lava temple"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={false} // Custom vocab not yet supported - needs sentence database integration
        minVocabularyRequired={5}
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false}
        requiresAudio={false}
        gameCompatibility={{
          supportsVocabulary: true,
          supportsSentences: true,
          supportsMixed: false,
          minItems: 5,
          maxItems: 50
        }}
        preferredContentType="sentences"
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Explore the ancient lava temple</p>
            <p>• Restore broken sentences and vocabulary</p>
            <p>• Navigate through challenging puzzles</p>
            <p>• Collect treasures and ancient knowledge</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    return (
      <div className="w-full h-screen">
        <LavaTempleWordRestoreGameWrapper
          gameConfig={gameConfig}
          onBackToMenu={handleBackToLauncher}
          onGameEnd={handleGameEnd}
          assignmentId={assignmentId}
          userId={user?.id}
        />
      </div>
    );
  }

  // Fallback - shouldn't reach here
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-yellow-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Lava Temple Word Restore</h1>
        <p className="mb-4">Something went wrong. Please try again.</p>
        <button 
          onClick={() => router.push('/games')}
          className="inline-block px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
        >
          Back to Games
        </button>
      </div>
    </div>
  );
}

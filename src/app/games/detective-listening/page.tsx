'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import DetectiveListeningGameWrapper from './components/DetectiveListeningGameWrapper';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem } from '../../../hooks/useUnifiedVocabulary';

export default function UnifiedDetectiveListeningPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // ALWAYS initialize hooks first to prevent "more hooks than previous render" error
  const [gameStarted, setGameStarted] = useState(false);

  // Game configuration from unified launcher
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
  } | null>(null);

  // Assignment mode handlers
  const handleAssignmentComplete = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  // Assignment mode: wrap with GameAssignmentWrapper (after all hooks are initialized)
  if (assignmentId && mode === 'assignment' && user) {
    return (
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="detective-listening"
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={() => router.push('/games/detective-listening')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          // Convert assignment vocabulary to unified config format
          const assignmentConfig: UnifiedSelectionConfig = {
            language: assignment.vocabulary_criteria?.language || 'spanish',
            curriculumLevel: (assignment.curriculum_level as 'KS2' | 'KS3' | 'KS4' | 'KS5') || 'KS3',
            categoryId: assignment.vocabulary_criteria?.category || 'basics_core_language',
            subcategoryId: assignment.vocabulary_criteria?.subcategory || 'greetings_introductions'
          };

          return (
            <DetectiveListeningGameWrapper
              config={assignmentConfig}
              vocabulary={vocabulary}
              onBackToMenu={() => router.push('/games/detective-listening')}
              onGameComplete={(result) => {
                console.log('Detective Listening assignment ended:', result);
                const gameProgress = {
                  assignmentId: assignmentId,
                  gameId: 'detective-listening',
                  studentId: user.id,
                  wordsCompleted: result.wordsCompleted || 0,
                  totalWords: vocabulary.length,
                  score: result.score || 0,
                  maxScore: vocabulary.length * 100,
                  timeSpent: result.timeSpent || 0,
                  accuracy: result.accuracy || 0,
                  completedAt: new Date(),
                  sessionData: {
                    gameResult: result,
                    config: assignmentConfig,
                    vocabulary: vocabulary
                  }
                };
                onGameComplete(gameProgress);
              }}
              assignmentMode={true}
            />
          );
        }}
      </GameAssignmentWrapper>
    );
  }

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[]) => {
    setGameConfig({
      config,
      vocabulary
    });
    
    setGameStarted(true);
    
    console.log('Detective Listening started with:', {
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
        gameName="Detective Listening"
        gameDescription="Solve mysteries by listening to audio clues and answering questions"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={false} // Detective Listening uses pre-recorded audio content
        minVocabularyRequired={0} // Uses audio content, not vocabulary
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false}
        requiresAudio={true}
      >
        {/* Game-specific instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto">
          <h4 className="text-white font-semibold mb-3 text-center">How to Play</h4>
          <div className="text-white/80 text-sm space-y-2">
            <p>• Listen carefully to audio clues and testimonies</p>
            <p>• Answer questions about what you heard</p>
            <p>• Solve the mystery by gathering evidence</p>
            <p>• Use headphones for the best experience</p>
          </div>
        </div>
      </UnifiedGameLauncher>
    );
  }

  // Show game if started and config is available
  if (gameStarted && gameConfig) {
    // Convert unified config to detective listening format
    const gameSettings = {
      caseType: gameConfig.config.categoryId || 'general',
      language: gameConfig.config.language === 'es' ? 'spanish' :
                gameConfig.config.language === 'fr' ? 'french' :
                gameConfig.config.language === 'de' ? 'german' : 'spanish',
      difficulty: gameConfig.config.curriculumLevel === 'KS4' ? 'hard' : 'normal',
      category: gameConfig.config.categoryId,
      subcategory: gameConfig.config.subcategoryId
    };

    return (
      <div className="min-h-screen">
        <DetectiveListeningGameWrapper
          settings={gameSettings}
          onBackToMenu={handleBackToMenu}
          onGameEnd={(result) => {
            console.log('Detective Listening ended:', result);
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

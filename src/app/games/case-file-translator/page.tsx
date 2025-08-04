'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import UnifiedSentenceCategorySelector, { SentenceSelectionConfig } from '../../../components/games/UnifiedSentenceCategorySelector';
import CaseFileTranslatorGameWrapper from './components/CaseFileTranslatorGameWrapper';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
import Link from 'next/link';

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

  // If assignment mode, use GameAssignmentWrapper
  if (assignmentId && mode === 'assignment') {
    return (
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="case-file-translator"
        studentId={user?.id}
        onAssignmentComplete={(progress) => {
          console.log('Case File Translator assignment completed:', progress);
          router.push('/student-dashboard');
        }}
        onBackToAssignments={() => router.push('/student-dashboard')}
        onBackToMenu={() => router.push('/games/case-file-translator')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          const handleGameComplete = (gameResult: any) => {
            // Calculate standardized progress metrics
            const wordsCompleted = gameResult.correctAnswers || 0;
            const totalWords = gameResult.totalQuestions || vocabulary.length;
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
              gameId: 'case-file-translator',
              studentId: user?.id || '',
              wordsCompleted,
              totalWords,
              score,
              maxScore: totalWords * 100,
              accuracy,
              timeSpent: gameResult.timeSpent || 0,
              completedAt: new Date(),
              sessionData: gameResult
            });
          };

          const handleBackToAssignments = () => {
            router.push('/student-dashboard');
          };

          // For sentence-based games like Case File Translator, we use the assignment's vocabulary criteria
          // to configure the game rather than passing individual vocabulary items
          const legacySettings = {
            caseType: assignment.vocabulary_criteria?.category || 'assignment',
            language: assignment.vocabulary_criteria?.language || 'spanish',
            curriculumLevel: (assignment.curriculum_level as string) || 'KS3',
            subcategory: assignment.vocabulary_criteria?.subcategory || 'assignment',
            difficulty: 'beginner' // Default difficulty
          };

          return (
            <div className="min-h-screen">
              <CaseFileTranslatorGameWrapper
                settings={legacySettings}
                onBackToMenu={handleBackToAssignments}
                onGameEnd={handleGameComplete}
                assignmentId={assignment.id}
                userId={user?.id}
              />
            </div>
          );
        }}
      </GameAssignmentWrapper>
    );
  }

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

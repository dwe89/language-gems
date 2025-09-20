'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import WordBlastGameWrapper from './components/WordBlastGameWrapper';
import VocabBlastGame from '../vocab-blast/components/VocabBlastGame';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
import InGameConfigPanel from '../../../components/games/InGameConfigPanel';
import UnifiedGameLauncher from '../../../components/games/UnifiedGameLauncher';
import { UnifiedSelectionConfig, UnifiedVocabularyItem, loadVocabulary } from '../../../hooks/useUnifiedVocabulary';
import Link from 'next/link';

export default function WordBlastPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment') || searchParams?.get('assignmentId') || null;
  const mode = searchParams?.get('mode');

  // Game state management
  const [gameStarted, setGameStarted] = useState(false);
  const [gameConfig, setGameConfig] = useState<{
    config: UnifiedSelectionConfig;
    vocabulary: UnifiedVocabularyItem[];
    theme: string;
  } | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  // If assignment mode, use GameAssignmentWrapper
  if (assignmentId && mode === 'assignment') {
    return (
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="word-blast"
        studentId={user?.id}
        onAssignmentComplete={(progress) => {
          console.log('Word Blast assignment completed:', progress);
          router.push('/student-dashboard');
        }}
        onBackToAssignments={() => router.push('/student-dashboard')}
        onBackToMenu={() => router.push('/games/word-blast')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          // Convert assignment vocabulary to Word Blast format
          const wordBlastVocabulary = vocabulary.map(item => ({
            id: item.id,
            word: item.word,
            translation: item.translation,
            language: item.language || assignment.vocabulary_criteria?.language || 'spanish',
            category: item.category || 'assignment',
            subcategory: item.subcategory || 'assignment',
            part_of_speech: item.part_of_speech || 'noun',
            difficulty: 1, // Default difficulty for assignment mode
            theme: 'classic' // Default theme for assignment mode
          }));

          const handleGameComplete = (gameResult: any) => {
            // Calculate standardized progress metrics
            const wordsCompleted = gameResult.correctAnswers || 0;
            const totalWords = vocabulary.length;
            const score = gameResult.score || 0;
            const accuracy = gameResult.accuracy || (totalWords > 0 ? (wordsCompleted / totalWords) * 100 : 0);

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
              gameId: 'word-blast',
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

          return (
            <WordBlastGameWrapper
              onBackToMenu={handleBackToAssignments}
              onGameComplete={handleGameComplete}
              assignmentMode={true}
              assignmentConfig={{
                assignmentId: assignment.id,
                vocabulary: wordBlastVocabulary,
                difficulty: 'medium',
                category: assignment.vocabulary_criteria?.category || 'assignment',
                language: assignment.vocabulary_criteria?.language || 'spanish',
                theme: 'classic',
                subcategory: assignment.vocabulary_criteria?.subcategory || 'assignment',
                timeLimit: 120
              }}
              userId={user?.id}
            />
          );
        }}
      </GameAssignmentWrapper>
    );
  }

  // Handle game start from unified launcher
  const handleGameStart = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    setGameConfig({
      config,
      vocabulary,
      theme: theme || 'classic'
    });
    setGameStarted(true);
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    if (gameStarted) {
      setGameStarted(false);
      setGameConfig(null);
    } else {
      window.history.back();
    }
  };

  // Handle game completion
  const handleGameComplete = (results: any) => {
    console.log('Word Blast game completed with results:', results);
    setGameStarted(false);
    setGameConfig(null);
  };

  // Handle config panel
  const handleOpenConfigPanel = () => {
    setShowConfigPanel(true);
  };

  const handleCloseConfigPanel = () => {
    setShowConfigPanel(false);
  };

  const handleConfigChange = (config: UnifiedSelectionConfig, vocabulary: UnifiedVocabularyItem[], theme?: string) => {
    setGameConfig({
      config,
      vocabulary,
      theme: theme || gameConfig?.theme || 'classic'
    });
    setShowConfigPanel(false);
  };

  // Show unified launcher if game not started
  if (!gameStarted) {
    return (
      <UnifiedGameLauncher
        gameName="Word Blast"
        gameDescription="Blast through sentence challenges and collect vocabulary gems"
        supportedLanguages={['es', 'fr', 'de']}
        showCustomMode={true}
        minVocabularyRequired={1}
        onGameStart={handleGameStart}
        onBack={() => router.push('/games')}
        supportsThemes={false}
        requiresAudio={false}
      />
    );
  }

  return (
    <>
      <WordBlastGameWrapper
        onBackToMenu={handleBackToMenu}
        onGameComplete={handleGameComplete}
        assignmentMode={!!(assignmentId && mode === 'assignment')}
        assignmentConfig={assignmentId ? { assignmentId } : undefined}
        userId={user?.id}
        onOpenSettings={handleOpenConfigPanel}
        preselectedConfig={gameConfig ? {
          language: gameConfig.config.language,
          category: gameConfig.config.categoryId || '',
          subcategory: gameConfig.config.subcategoryId || '',
          curriculumLevel: gameConfig.config.curriculumLevel || 'KS3',
          examBoard: gameConfig.config.examBoard,
          tier: gameConfig.config.tier,
          vocabulary: gameConfig.vocabulary
        } : undefined}
        selectedTheme={gameConfig?.theme}
      />

      {/* In-game configuration panel */}
      <InGameConfigPanel
        currentConfig={gameConfig?.config}
        onConfigChange={handleConfigChange}
        supportedLanguages={['es', 'fr', 'de']}
        supportsThemes={true}
        currentTheme={gameConfig?.theme}
        isOpen={showConfigPanel}
        onClose={handleCloseConfigPanel}
        showCustomMode={false}
      />
    </>
  );
}

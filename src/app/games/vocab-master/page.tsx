'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import VocabMasterGameWrapper from './components/VocabMasterGameWrapper';
import VocabMasterLauncher from './components/VocabMasterLauncher';
import VocabMasterGame from './components/VocabMasterGame';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
import Link from 'next/link';

export default function VocabMasterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

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

  // If assignment mode, use GameAssignmentWrapper
  if (assignmentId && mode === 'assignment') {
    return (
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="vocab-master"
        studentId={user?.id}
        onAssignmentComplete={(progress) => {
          console.log('Vocab Master assignment completed:', progress);
          router.push('/student-dashboard');
        }}
        onBackToAssignments={() => router.push('/student-dashboard')}
        onBackToMenu={() => router.push('/games/vocab-master')}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          // Convert assignment vocabulary to VocabMaster format
          const vocabMasterWords = vocabulary.map(item => ({
            id: item.id,
            spanish: item.word, // VocabMaster expects 'spanish' property
            english: item.translation, // VocabMaster expects 'english' property
            word: item.word,
            translation: item.translation,
            language: item.language || assignment.vocabulary_criteria?.language || 'spanish',
            category: item.category || 'assignment',
            subcategory: item.subcategory || 'assignment',
            part_of_speech: item.part_of_speech || 'noun',
            gender: item.gender || null,
            article: item.article || null,
            display_word: item.display_word || item.word,
            audio_url: item.audio_url || null,
            difficulty: 1, // Default difficulty for assignment mode
            mastery_level: 0,
            last_seen: null,
            next_review: new Date(),
            review_count: 0,
            correct_count: 0,
            incorrect_count: 0,
            streak: 0,
            ease_factor: 2.5,
            interval: 1,
            is_learning: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));

          const handleGameComplete = (gameResult: any) => {
            // Calculate standardized progress metrics
            const wordsCompleted = gameResult.wordsCompleted || gameResult.correctAnswers || 0;
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
              gameId: 'vocab-master',
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
            <VocabMasterGame
              mode="learn" // Default to learn mode for assignments
              vocabulary={vocabMasterWords}
              config={{
                language: assignment.vocabulary_criteria?.language || 'spanish',
                category: assignment.vocabulary_criteria?.category || 'assignment',
                subcategory: assignment.vocabulary_criteria?.subcategory || 'assignment',
                curriculum_level: (assignment.curriculum_level as 'KS3' | 'KS4') || 'KS3'
              }}
              onComplete={handleGameComplete}
              onExit={handleBackToAssignments}
            />
          );
        }}
      </GameAssignmentWrapper>
    );
  }

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

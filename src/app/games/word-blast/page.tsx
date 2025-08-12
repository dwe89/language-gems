'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import WordBlastGameWrapper from './components/WordBlastGameWrapper';
import VocabBlastGame from '../vocab-blast/components/VocabBlastGame';
import GameAssignmentWrapper from '../../../components/games/templates/GameAssignmentWrapper';
import Link from 'next/link';

export default function WordBlastPage() {
  const { user, isLoading, isDemo } = useUnifiedAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment') || searchParams?.get('assignmentId') || null;
  const mode = searchParams?.get('mode');

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

  // Handle back to menu
  const handleBackToMenu = () => {
    window.history.back();
  };

  // Handle game completion
  const handleGameComplete = (results: any) => {
    console.log('Word Blast game completed with results:', results);
  };

  return (
    <WordBlastGameWrapper
      onBackToMenu={handleBackToMenu}
      onGameComplete={handleGameComplete}
      assignmentMode={!!(assignmentId && mode === 'assignment')}
      assignmentConfig={assignmentId ? { assignmentId } : undefined}
      userId={user?.id}
    />
  );
}

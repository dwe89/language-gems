'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import GameAssignmentWrapper, {
  GameProgress,
  calculateStandardScore
} from '../../../../components/games/templates/GameAssignmentWrapper';

interface WordBlastAssignmentWrapperProps {
  assignmentId: string;
}

export default function WordBlastAssignmentWrapper({
  assignmentId
}: WordBlastAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Word Blast assignment completed:', progress);
    // No auto-redirect - let completion screen handle navigation
  };

  const handleBackToAssignments = () => {
    router.push(`/student-dashboard/assignments/${assignmentId}`);
  };

  const handleBackToMenu = () => {
    router.push('/games/word-blast');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <GameAssignmentWrapper
      assignmentId={assignmentId}
      gameId="word-blast"
      studentId={user.id}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    >
      {({ assignment, vocabulary, onProgressUpdate, onGameComplete, gameSessionId }) => {
        console.log('Word Blast Assignment - Vocabulary loaded:', vocabulary.length, 'items');

        // Transform vocabulary to the format expected by word-blast
        const gameVocabulary = vocabulary.map(item => ({
          id: item.id,
          word: item.word,
          translation: item.translation,
          correct: false,
          points: 10,
          category: 'noun'
        }));

        const handleGameComplete = (result: any) => {
          // Calculate standardized progress metrics
          const correctAnswers = result.correctAnswers || 0;
          const totalAttempts = result.totalAttempts || vocabulary.length;
          const score = correctAnswers * 10; // 10 points per correct answer
          const accuracy = totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0;
          const maxScore = vocabulary.length * 10;

          // Update assignment progress
          onProgressUpdate({
            wordsCompleted: correctAnswers,
            totalWords: vocabulary.length,
            score,
            maxScore,
            accuracy,
            timeSpent: result.timeSpent || 0
          });

          // Complete the assignment
          onGameComplete({
            assignmentId: assignment.id,
            gameId: 'word-blast',
            studentId: user.id,
            wordsCompleted: correctAnswers,
            totalWords: vocabulary.length,
            score,
            maxScore,
            accuracy,
            timeSpent: result.timeSpent || 0,
            completedAt: new Date(),
            sessionData: { result }
          });
        };

        // Import and use the actual WordBlastGame component
        const WordBlastGame = require('./WordBlastGame').default;

        return (
          <WordBlastGame
            gameSessionId={gameSessionId}
            userId={user.id}
            assignmentMode={true}
            assignmentConfig={{
              assignmentId: assignment.id,
              assignmentTitle: assignment.title,
              vocabulary: gameVocabulary,
              onProgressUpdate
            }}
            onGameComplete={handleGameComplete}
            onBackToMenu={handleBackToAssignments}
          />
        );
      }}
    </GameAssignmentWrapper>
  );
}

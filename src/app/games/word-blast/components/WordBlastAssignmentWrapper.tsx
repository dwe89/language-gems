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
    router.push('/student-dashboard/assignments');
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
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
      {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
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

        // Import the actual Word Blast game component
        const WordBlastGame = React.lazy(() => import('../GemWordBlastGame'));

        return (
          <React.Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading Word Blast...</p>
              </div>
            </div>
          }>
            <WordBlastGame
              assignmentMode={true}
              assignmentVocabulary={gameVocabulary}
              onGameComplete={(result) => {
                const { score, accuracy, maxScore } = calculateStandardScore(
                  result.correctAnswers || 0,
                  result.totalAttempts || 1,
                  Date.now(),
                  100
                );

                onGameComplete({
                  assignmentId: assignment.id,
                  gameId: 'word-blast',
                  studentId: user.id,
                  wordsCompleted: result.correctAnswers || 0,
                  totalWords: vocabulary.length,
                  score,
                  maxScore,
                  accuracy,
                  timeSpent: result.timeSpent || 0,
                  completedAt: new Date(),
                  sessionData: result
                });
              }}
              onBackToMenu={handleBackToMenu}
            />
          </React.Suspense>
        );
      }}
    </GameAssignmentWrapper>
  );
}

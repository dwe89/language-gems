'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import GameAssignmentWrapper, { 
  StandardVocabularyItem, 
  AssignmentData, 
  GameProgress,
  calculateStandardScore 
} from '../../../../components/games/templates/GameAssignmentWrapper';
import TicTacToeGameWrapper from './TicTacToeGameWrapper';

interface NoughtsAndCrossesAssignmentWrapperProps {
  assignmentId: string;
}

export default function NoughtsAndCrossesAssignmentWrapper({ 
  assignmentId 
}: NoughtsAndCrossesAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Noughts and Crosses assignment completed:', progress);
    
    // Show completion message and redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 3000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/games/noughts-and-crosses');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <GameAssignmentWrapper
      assignmentId={assignmentId}
      gameId="noughts-and-crosses"
      studentId={user.id}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    >
      {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
        // Get language from assignment vocabulary criteria or vocabulary items
        const assignmentLanguage = assignment.vocabulary_criteria?.language || vocabulary[0]?.language || 'spanish';

        // Convert language codes to game format
        const gameLanguage = assignmentLanguage === 'fr' ? 'french' :
                            assignmentLanguage === 'de' ? 'german' :
                            assignmentLanguage === 'es' ? 'spanish' : 'spanish';

        return (
          <TicTacToeGameWrapper
            settings={{
              difficulty: 'medium',
              category: vocabulary[0]?.category || 'assignment',
              subcategory: vocabulary[0]?.subcategory || 'assignment',
              language: gameLanguage,
              theme: 'default',
              playerMark: 'X',
              computerMark: 'O'
            }}
            onBackToMenu={handleBackToMenu}
            onGameEnd={(result) => {
              const { score, accuracy, maxScore } = calculateStandardScore(
                result.wordsLearned || 0,
                vocabulary.length,
                Date.now(),
                100
              );

              onGameComplete({
                assignmentId: assignment.id,
                gameId: 'noughts-and-crosses',
                studentId: user.id,
                wordsCompleted: result.wordsLearned || 0,
                totalWords: vocabulary.length,
                score,
                maxScore,
                accuracy,
                timeSpent: 0, // Will be calculated by wrapper
                completedAt: new Date(),
                sessionData: result
              });
            }}
            assignmentId={assignmentId}
            userId={user.id}
          />
        );
      }}
    </GameAssignmentWrapper>
  );
}

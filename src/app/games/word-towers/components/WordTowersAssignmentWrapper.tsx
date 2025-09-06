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

// Import the main game component
import WordTowersPage from '../page';

interface WordTowersAssignmentWrapperProps {
  assignmentId: string;
}

export default function WordTowersAssignmentWrapper({ assignmentId }: WordTowersAssignmentWrapperProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleAssignmentComplete = (finalProgress: GameProgress) => {
    console.log('Word Towers Assignment completed:', finalProgress);
    // Navigate back to assignments
    router.push('/student-dashboard/assignments');
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/games');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-300">Please log in to access this assignment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="word-towers"
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={handleBackToMenu}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          console.log('Word Towers Assignment - Vocabulary loaded:', vocabulary.length, 'items');

          return (
            <WordTowersPage />
          );
        }}
      </GameAssignmentWrapper>
    </div>
  );
}

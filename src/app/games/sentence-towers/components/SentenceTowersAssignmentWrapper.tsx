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

// Import the main game component (we'll need to extract it from the main page)
import { SentenceTowersMainGame } from './SentenceTowersMainGame';

interface SentenceTowersAssignmentWrapperProps {
  assignmentId: string;
}

export default function SentenceTowersAssignmentWrapper({ 
  assignmentId 
}: SentenceTowersAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Sentence Towers assignment completed:', progress);
    
    // Show completion message and redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 3000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/games/sentence-towers');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header - consistent with other games */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToAssignments}
                className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
              >
                <span className="font-medium">← Back to Assignments</span>
              </button>
              <div className="h-6 w-px bg-white/30"></div>
              <h1 className="text-2xl font-bold text-white">
                🏗️ Sentence Towers
              </h1>
            </div>
          </div>
        </div>
      </div>

      <GameAssignmentWrapper
        assignmentId={assignmentId}
        gameId="sentence-towers"
        studentId={user.id}
        onAssignmentComplete={handleAssignmentComplete}
        onBackToAssignments={handleBackToAssignments}
        onBackToMenu={handleBackToMenu}
      >
        {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
          console.log('Sentence Towers Assignment - Vocabulary loaded:', vocabulary.length, 'items');

          return (
            <SentenceTowersMainGame
              onBackToMenu={handleBackToMenu}
              assignmentMode={{
                vocabulary,
                onProgressUpdate,
                onGameComplete
              }}
              isFullscreen={false}
            />
          );
        }}
      </GameAssignmentWrapper>
    </div>
  );
}

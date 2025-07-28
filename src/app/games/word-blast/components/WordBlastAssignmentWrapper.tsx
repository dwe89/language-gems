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

        // Create a simplified Word Blast assignment interface
        return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            <div className="container mx-auto px-4 py-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Word Blast Assignment
                </h1>
                <p className="text-white/80">
                  Assignment: {assignment.title}
                </p>
                <p className="text-white/60 text-sm">
                  Vocabulary words: {vocabulary.length}
                </p>
              </div>
              
              <div className="text-center text-white">
                <p className="text-lg mb-4">Word Blast assignment mode coming soon!</p>
                <p className="text-sm text-white/80 mb-6">
                  This assignment contains {vocabulary.length} vocabulary words to practice.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleBackToAssignments}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Back to Assignments
                  </button>
                  
                  <div>
                    <button
                      onClick={handleBackToMenu}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Play Regular Word Blast
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </GameAssignmentWrapper>
  );
}

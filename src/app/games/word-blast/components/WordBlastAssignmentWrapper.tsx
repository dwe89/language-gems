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

        // For now, return a simple message indicating the game needs integration
        // The word-blast game would need to be modified to accept assignment vocabulary
        return (
          <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Word Blast Assignment Mode</h2>
              <p className="mb-4">Assignment vocabulary loaded: {vocabulary.length} words</p>
              <p className="text-sm opacity-75">
                This game needs to be integrated with the assignment system.
                <br />
                Vocabulary: {vocabulary.slice(0, 3).map(v => v.word).join(', ')}...
              </p>
              <div className="mt-6 space-x-4">
                <button
                  onClick={handleBackToAssignments}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Back to Assignments
                </button>
                <button
                  onClick={handleBackToMenu}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Back to Game Menu
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </GameAssignmentWrapper>
  );
}

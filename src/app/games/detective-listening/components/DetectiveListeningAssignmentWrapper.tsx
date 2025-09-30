'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import GameAssignmentWrapper, {
  StandardVocabularyItem,
  AssignmentData,
  GameProgress
} from '../../../../components/games/templates/GameAssignmentWrapper';
import DetectiveListeningGameWrapper from './DetectiveListeningGameWrapper';

interface DetectiveListeningAssignmentWrapperProps {
  assignmentId: string;
}

export default function DetectiveListeningAssignmentWrapper({ 
  assignmentId 
}: DetectiveListeningAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Detective Listening assignment completed:', progress);
    // No auto-redirect - let completion screen handle navigation
  };

  const handleBackToAssignments = () => {
    router.push(`/student-dashboard/assignments/${assignmentId}`);
  };

  const handleBackToMenu = () => {
    router.push('/games/detective-listening');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header - consistent with standalone game */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToAssignments}
                className="flex items-center space-x-2 text-amber-700 hover:text-amber-900 transition-colors"
              >
                <span className="font-medium">← Back to Assignments</span>
              </button>
              <div className="h-6 w-px bg-amber-300"></div>
              <h1 className="text-2xl font-bold text-amber-900">
                🕵️ Detective Listening Game
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <GameAssignmentWrapper
          assignmentId={assignmentId}
          gameId="detective-listening"
          studentId={user.id}
          onAssignmentComplete={handleAssignmentComplete}
          onBackToAssignments={handleBackToAssignments}
          onBackToMenu={handleBackToMenu}
        >
          {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
            // Get language from assignment vocabulary criteria or vocabulary items
            const assignmentLanguage = assignment.vocabulary_criteria?.language || vocabulary[0]?.language || 'es';

            return (
              <DetectiveListeningGameWrapper
                settings={{
                  caseType: 'assignment', // Special assignment mode
                  language: assignmentLanguage, // Use assignment language
                  difficulty: 'normal',
                  category: vocabulary[0]?.category || 'assignment',
                  subcategory: vocabulary[0]?.subcategory || 'assignment'
                }}
                vocabulary={vocabulary} // Pass assignment vocabulary with UUIDs
                assignmentId={assignmentId}
                userId={user?.id}
                onBackToMenu={handleBackToMenu}
                onGameEnd={(result) => {
                  console.log('Detective Listening assignment game ended:', result);
                  // Handle assignment completion through the wrapper
                  onGameComplete({
                    correctAnswers: result.correctAnswers,
                    totalQuestions: result.totalEvidence,
                    timeSpent: result.timeSpent || 0,
                    score: Math.round((result.correctAnswers / result.totalEvidence) * 100)
                  });
                }}
              />
            );
          }}
        </GameAssignmentWrapper>
      </div>
    </div>
  );
}




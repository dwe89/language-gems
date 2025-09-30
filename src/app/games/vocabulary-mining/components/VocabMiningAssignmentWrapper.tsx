'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import GameAssignmentWrapper, {
  GameProgress,
  calculateStandardScore
} from '../../../../components/games/templates/GameAssignmentWrapper';
import VocabularyMiningGame from './VocabularyMiningGame';

interface VocabularyMiningAssignmentWrapperProps {
  assignmentId: string;
  isPreview?: boolean;
}

export default function VocabularyMiningAssignmentWrapper({
  assignmentId,
  isPreview = false
}: VocabularyMiningAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Vocabulary Mining assignment completed:', progress);
    // No auto-redirect - let completion screen handle navigation
  };

  const handleBackToAssignments = () => {
    if (isPreview) {
      router.push(`/student-dashboard/assignments/${assignmentId}?preview=true`);
    } else {
      router.push(`/student-dashboard/assignments/${assignmentId}`);
    }
  };

  const handleBackToMenu = () => {
    router.push('/games/vocabulary-mining');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-600 via-orange-600 to-red-700 flex items-center justify-center">
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
      gameId="vocabulary-mining"
      studentId={user.id}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    >
      {({ assignment, vocabulary, onGameComplete }) => {
        // Transform vocabulary to the format expected by VocabularyMiningGame
        const gameVocabulary = vocabulary.map(item => ({
          id: item.id,
          spanish: item.word,        // Map word to spanish
          english: item.translation, // Map translation to english
          theme: item.category,      // Map category to theme
          topic: item.subcategory,   // Map subcategory to topic
          part_of_speech: item.part_of_speech,
          language: item.language,
          audio_url: item.audio_url  // Include audio URL for listening activities
        }));

        return (
          <VocabularyMiningGame
            mode="assignment"
            vocabulary={gameVocabulary}
            config={{
              assignmentMode: true,
              assignmentTitle: assignment.title,
              assignmentId: assignment.id,
              enableAudio: true
            }}
            onComplete={(results: any) => {
              const { score, accuracy, maxScore } = calculateStandardScore(
                results.correctAnswers || 0,
                results.totalWords || vocabulary.length,
                results.timeSpent || 0,
                100
              );

              onGameComplete({
                assignmentId: assignment.id,
                gameId: 'vocabulary-mining',
                studentId: user.id,
                wordsCompleted: results.correctAnswers || 0,
                totalWords: vocabulary.length,
                score,
                maxScore,
                accuracy,
                timeSpent: results.timeSpent || 0,
                completedAt: new Date(),
                sessionData: results
              });
            }}
            onExit={handleBackToAssignments}
          />
        );
      }}
    </GameAssignmentWrapper>
  );
}

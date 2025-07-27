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
import MemoryGameMain from './MemoryGameMain';
import { WordPair } from './CustomWordsModal';

interface MemoryGameAssignmentWrapperProps {
  assignmentId: string;
}

export default function MemoryGameAssignmentWrapper({ 
  assignmentId 
}: MemoryGameAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Memory Game assignment completed:', progress);
    
    // Show completion message and redirect
    setTimeout(() => {
      router.push('/dashboard/assignments');
    }, 3000);
  };

  const handleBackToAssignments = () => {
    router.push('/dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/games/memory-game');
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
      gameId="memory-game"
      studentId={user.id}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    >
      {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => {
        // Transform vocabulary to WordPair format for Memory Game
        const wordPairs: WordPair[] = vocabulary.map((vocab: StandardVocabularyItem) => ({
          id: vocab.id,
          term: vocab.word,
          translation: vocab.translation,
          type: 'word' as const,
          category: vocab.category,
          subcategory: vocab.subcategory
        }));

        console.log('Memory Game Assignment - Vocabulary loaded:', vocabulary.length, 'items');
        console.log('Memory Game Assignment - Word pairs:', wordPairs);

        return (
          <MemoryGameMain
            language={vocabulary[0]?.language || "spanish"}
            topic="Assignment"
            difficulty="medium"
            onBackToSettings={handleBackToMenu}
            customWords={wordPairs}
            isAssignmentMode={true}
            assignmentTitle={assignment.title}
            assignmentId={assignmentId}
            userId={user.id}
            onProgress={(progressData: any) => {
              // Update progress
              const { score, accuracy, maxScore } = calculateStandardScore(
                progressData.correctMatches || 0,
                progressData.totalAttempts || 1,
                Date.now(),
                100
              );

              onProgressUpdate({
                wordsCompleted: progressData.correctMatches || 0,
                totalWords: vocabulary.length,
                score,
                maxScore,
                accuracy,
                sessionData: progressData
              });
            }}
            onComplete={(finalData: any) => {
              // Game completion
              const { score, accuracy, maxScore } = calculateStandardScore(
                finalData.correctMatches || 0,
                finalData.totalAttempts || 1,
                Date.now(),
                100
              );

              onGameComplete({
                assignmentId: assignment.id,
                gameId: 'memory-game',
                studentId: user.id,
                wordsCompleted: finalData.correctMatches || 0,
                totalWords: vocabulary.length,
                score,
                maxScore,
                accuracy,
                timeSpent: finalData.timeSpent || 0,
                completedAt: new Date(),
                sessionData: finalData
              });
            }}
          />
        );
      }}
    </GameAssignmentWrapper>
  );
}

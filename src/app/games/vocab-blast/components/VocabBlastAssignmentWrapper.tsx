'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import GameAssignmentWrapper from '../../../../components/games/templates/GameAssignmentWrapper';
import VocabBlastGameWrapper from './VocabBlastGameWrapper';

interface VocabBlastAssignmentWrapperProps {
  assignmentId: string;
  studentId: string;
  onAssignmentComplete: (progress: any) => void;
  onBackToAssignments: () => void;
  onBackToMenu: () => void;
}

export default function VocabBlastAssignmentWrapper({
  assignmentId,
  studentId,
  onAssignmentComplete,
  onBackToAssignments,
  onBackToMenu
}: VocabBlastAssignmentWrapperProps) {
  const { user } = useAuth();


  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center">
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
      gameId="vocab-blast"
      studentId={studentId}
      onAssignmentComplete={onAssignmentComplete}
      onBackToAssignments={onBackToAssignments}
      onBackToMenu={onBackToMenu}
    >
      {({ assignment, vocabulary, onProgressUpdate, onGameComplete, gameSessionId, selectedTheme }) => {
        console.log('Vocab Blast Assignment - Vocabulary loaded:', vocabulary.length, 'items');

        return (
          <VocabBlastGameWrapper
              settings={{
                difficulty: 'medium',
                category: vocabulary[0]?.category || 'assignment',
                language: vocabulary[0]?.language || 'spanish',
                theme: selectedTheme,
                subcategory: vocabulary[0]?.subcategory || 'assignment',
                mode: 'categories' as const,
                customWords: vocabulary.map(v => v.word)
              }}
              gameSessionId={gameSessionId}
              categoryVocabulary={vocabulary} // Pass the assignment vocabulary
            onBackToMenu={onBackToMenu}
            onGameEnd={(result) => {
              // Use gems-first scoring: 10 XP per correct answer
              const correctAnswers = result.correctAnswers || 0;
              const score = correctAnswers * 10;
              const accuracy = result.totalAttempts ? (correctAnswers / result.totalAttempts) * 100 : 0;
              const maxScore = vocabulary.length * 10;

              onProgressUpdate({
                wordsCompleted: correctAnswers,
                totalWords: vocabulary.length,
                score,
                maxScore,
                accuracy
              });

              // Complete the assignment
              onGameComplete({
                assignmentId: assignment.id,
                gameId: 'vocab-blast',
                studentId: studentId,
                wordsCompleted: result.correctAnswers || 0,
                totalWords: vocabulary.length,
                score,
                maxScore,
                accuracy,
                timeSpent: result.timeSpent || 0,
                completedAt: new Date(),
                sessionData: { result }
              });
            }}
            assignmentId={assignmentId}
            userId={studentId}
            isAssignmentMode={true}
          />
        );
      }}
    </GameAssignmentWrapper>
  );
}

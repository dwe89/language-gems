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
  const [selectedTheme, setSelectedTheme] = useState('space');

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
      {({ assignment, vocabulary, onProgressUpdate, onGameComplete, gameSessionId }) => {
        console.log('Vocab Blast Assignment - Vocabulary loaded:', vocabulary.length, 'items');

        return (
          <div className="min-h-screen">
            {/* Simple Theme Selector */}
            <div className="bg-black/20 backdrop-blur-sm border-b border-white/20 p-3">
              <div className="container mx-auto flex items-center justify-between">
                <div className="text-white">
                  <span className="text-sm font-medium">{vocabulary.length} words</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">Theme:</span>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="bg-white/20 text-white border border-white/30 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option value="tokyo" className="text-gray-800">🌃 Neon Hack</option>
                    <option value="pirate" className="text-gray-800">🏴‍☠️ Cannon Clash</option>
                    <option value="space" className="text-gray-800">🚀 Comet Catch</option>
                    <option value="temple" className="text-gray-800">🔥 Rising Lava</option>
                  </select>
                </div>
              </div>
            </div>

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
          </div>
        );
      }}
    </GameAssignmentWrapper>
  );
}

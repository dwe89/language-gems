'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import GameAssignmentWrapper, {
  StandardVocabularyItem,
  AssignmentData,
  GameProgress
} from '../../../../components/games/templates/GameAssignmentWrapper';
import TicTacToeGameWrapper from './TicTacToeGameWrapper';

interface NoughtsAndCrossesAssignmentWrapperProps {
  assignmentId: string;
}

const REQUIRED_WINS = 5; // Number of wins required to complete assignment

export default function NoughtsAndCrossesAssignmentWrapper({
  assignmentId
}: NoughtsAndCrossesAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Track game progress across multiple rounds
  const [gameStats, setGameStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    wordsLearned: 0
  });

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
          <div className="relative">
            {/* Progress Indicator */}
            <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">Assignment Progress</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {gameStats.wins}/{REQUIRED_WINS}
                </div>
                <div className="text-xs text-gray-500">Wins Required</div>
                <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(gameStats.wins / REQUIRED_WINS) * 100}%` }}
                  ></div>
                </div>
                {gameStats.wins < REQUIRED_WINS && (
                  <div className="text-xs text-gray-500 mt-1">
                    {REQUIRED_WINS - gameStats.wins} more wins needed
                  </div>
                )}
              </div>
            </div>

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
              vocabulary={vocabulary} // Pass assignment vocabulary with UUIDs
              onBackToMenu={handleBackToMenu}
            onGameEnd={(result) => {
              // Update game stats
              const newStats = {
                totalGames: gameStats.totalGames + 1,
                wins: gameStats.wins + (result.outcome === 'win' ? 1 : 0),
                losses: gameStats.losses + (result.outcome === 'loss' ? 1 : 0),
                ties: gameStats.ties + (result.outcome === 'tie' ? 1 : 0),
                wordsLearned: gameStats.wordsLearned + (result.wordsLearned || 0)
              };
              setGameStats(newStats);

              console.log(`Tic Tac Toe round completed. Wins: ${newStats.wins}/${REQUIRED_WINS}`, result);

              // Only complete assignment after 5 wins
              if (newStats.wins >= REQUIRED_WINS) {
                // Calculate actual questions asked and correct answers
                const totalQuestionsAsked = result.totalQuestions || 0;
                const correctAnswersGiven = result.correctAnswers || 0;

                // Use gems-first scoring: 10 XP per correct answer
                const score = correctAnswersGiven * 10;
                const accuracy = totalQuestionsAsked > 0 ? (correctAnswersGiven / totalQuestionsAsked) * 100 : 0;
                const maxScore = totalQuestionsAsked * 10;

                onGameComplete({
                  assignmentId: assignment.id,
                  gameId: 'noughts-and-crosses',
                  studentId: user.id,
                  wordsCompleted: correctAnswersGiven, // Use correct answers, not words learned
                  totalWords: totalQuestionsAsked, // Use actual questions asked
                  score,
                  maxScore,
                  accuracy,
                  timeSpent: 0, // Will be calculated by wrapper
                  completedAt: new Date(),
                  sessionData: {
                    ...result,
                    totalGames: newStats.totalGames,
                    totalWins: newStats.wins,
                    totalLosses: newStats.losses,
                    totalTies: newStats.ties,
                    completionReason: `${REQUIRED_WINS} wins achieved`
                  }
                });
              }
              // If not enough wins yet, continue playing (don't call onGameComplete)
            }}
            assignmentId={assignmentId}
            userId={user.id === 'demo-user-id' ? '388c67a4-2202-4214-86e8-3f20481e6cb6' : user.id} // Temporary fix for demo auth issue
          />
          </div>
        );
      }}
    </GameAssignmentWrapper>
  );
}

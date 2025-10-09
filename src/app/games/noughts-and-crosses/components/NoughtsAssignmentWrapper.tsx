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
import ErrorBoundary from '../../../../components/ErrorBoundary';

interface NoughtsAndCrossesAssignmentWrapperProps {
  assignmentId: string;
}

const REQUIRED_WINS = 5; // Number of wins required to complete assignment

export default function NoughtsAndCrossesAssignmentWrapper({
  assignmentId
}: NoughtsAndCrossesAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Add comprehensive logging for debugging Windows issue
  console.log('🎮 [NOUGHTS WRAPPER] Component mounted:', {
    assignmentId,
    hasUser: !!user,
    userId: user?.id,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
    timestamp: new Date().toISOString()
  });

  // Track game progress across multiple rounds
  const [gameStats, setGameStats] = useState({
    totalGames: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    wordsLearned: 0
  });

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('✅ [NOUGHTS] Assignment completed:', progress);
    // No auto-redirect - let completion screen handle navigation
  };

  const handleBackToAssignments = () => {
    console.log('⬅️ [NOUGHTS] Navigating back to assignments:', assignmentId);
    router.push(`/student-dashboard/assignments/${assignmentId}`);
  };

  const handleBackToMenu = () => {
    console.log('🏠 [NOUGHTS] Navigating back to menu');
    router.push('/games/noughts-and-crosses');
  };

  if (!user) {
    console.log('⏳ [NOUGHTS] Waiting for user authentication...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('✅ [NOUGHTS] User authenticated, rendering GameAssignmentWrapper');

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('❌ [NOUGHTS] Error in assignment wrapper:', {
          error,
          errorInfo,
          assignmentId,
          userId: user.id
        });
      }}
    >
      <GameAssignmentWrapper
      assignmentId={assignmentId}
      gameId="noughts-and-crosses"
      studentId={user.id}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
      assignmentProgress={{
        current: gameStats.wins,
        required: REQUIRED_WINS,
        label: 'Wins'
      }}
    >
      {({ assignment, vocabulary, onProgressUpdate, onGameComplete, gameSessionId, selectedTheme, toggleMusic, isMusicEnabled, onBackToMenu }) => {
        console.log('🎯 [NOUGHTS] GameAssignmentWrapper render callback:', {
          hasAssignment: !!assignment,
          vocabularyCount: vocabulary?.length || 0,
          gameSessionId,
          selectedTheme,
          assignmentLanguage: assignment?.vocabulary_criteria?.language,
          firstVocabItem: vocabulary?.[0]
        });

        // Get language from assignment vocabulary criteria or vocabulary items
        const assignmentLanguage = assignment.vocabulary_criteria?.language || vocabulary[0]?.language || 'spanish';

        // Convert language codes to game format
        const gameLanguage = assignmentLanguage === 'fr' ? 'french' :
                            assignmentLanguage === 'de' ? 'german' :
                            assignmentLanguage === 'es' ? 'spanish' : 'spanish';

        console.log('🌍 [NOUGHTS] Language configuration:', {
          assignmentLanguage,
          gameLanguage
        });

        return (
          <div className="relative">
            <TicTacToeGameWrapper
              settings={{
                difficulty: 'medium',
                category: vocabulary[0]?.category || 'assignment',
                subcategory: vocabulary[0]?.subcategory || 'assignment',
                language: gameLanguage,
                theme: selectedTheme || 'default',
                playerMark: 'X',
                computerMark: 'O'
              }}
              vocabulary={vocabulary} // Pass assignment vocabulary with UUIDs
              gameSessionId={gameSessionId}
              onBackToMenu={onBackToMenu || handleBackToMenu}
              toggleMusic={toggleMusic}
              isMusicEnabled={isMusicEnabled}
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
    </ErrorBoundary>
  );
}

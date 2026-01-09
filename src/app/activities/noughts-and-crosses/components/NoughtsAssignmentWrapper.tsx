'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, supabaseBrowser } from '../../../../components/auth/AuthProvider';
import GameAssignmentWrapper, {
  StandardVocabularyItem,
  AssignmentData,
  GameProgress
} from '../../../../components/games/templates/GameAssignmentWrapper';
import TicTacToeGameWrapper from './TicTacToeGameWrapper';
import ErrorBoundary from '../../../../components/ErrorBoundary';
import GameCompletionModal from '../../../../components/games/GameCompletionModal';
import { GAME_COMPLETION_THRESHOLDS } from '../../../../services/assignments/GameCompletionService';

interface NoughtsAndCrossesAssignmentWrapperProps {
  assignmentId: string;
}

// Use threshold from GameCompletionService
const WORDS_TO_WIN = GAME_COMPLETION_THRESHOLDS['noughts-and-crosses']; // 9 words

export default function NoughtsAndCrossesAssignmentWrapper({
  assignmentId
}: NoughtsAndCrossesAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = supabaseBrowser;

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
    wordsLearned: 0  // Total unique words learned across all rounds
  });

  // Track actual assignment word exposure
  const [exposedWordCount, setExposedWordCount] = useState(0);

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);

  // Fetch current word exposure count from database
  const fetchWordExposureCount = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('assignment_word_exposure')
        .select('vocabulary_id', { count: 'exact', head: false })
        .eq('assignment_id', assignmentId)
        .eq('student_id', user.id);

      if (error) {
        console.error('❌ [NOUGHTS] Error fetching word exposure:', error);
        return;
      }

      const uniqueWordIds = new Set((data || []).map(record => record.vocabulary_id));
      const count = uniqueWordIds.size;
      
      console.log(`📊 [NOUGHTS] Fetched word exposure: ${count} unique words`);
      setExposedWordCount(count);
    } catch (error) {
      console.error('❌ [NOUGHTS] Exception fetching word exposure:', error);
    }
  };

  // Fetch word exposure count on mount and periodically
  useEffect(() => {
    if (user?.id) {
      fetchWordExposureCount();
      
      // Poll every 2 seconds during active gameplay
      const interval = setInterval(fetchWordExposureCount, 2000);
      return () => clearInterval(interval);
    }
  }, [user?.id, assignmentId]);

  // Check if threshold is met based on assignment word exposure
  useEffect(() => {
    console.log(`🔍 [NOUGHTS] Checking completion: ${exposedWordCount}/${WORDS_TO_WIN} words exposed, hasShownModal: ${hasShownModal}`);
    if (exposedWordCount >= WORDS_TO_WIN && !hasShownModal) {
      setHasShownModal(true);
      setShowCompletionModal(true);
      console.log(`🎉 [NOUGHTS] Threshold met! ${exposedWordCount}/${WORDS_TO_WIN} words`);
    }
  }, [exposedWordCount, hasShownModal]);

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('✅ [NOUGHTS] Assignment completed:', progress);
    // No auto-redirect - let completion screen handle navigation
  };

  const handleBackToAssignments = () => {
    console.log('⬅️ [NOUGHTS] Navigating back to assignments:', assignmentId);
    router.push(`/student-dashboard/assignments/${assignmentId}`);
    // Force refresh to load updated game completion status
    setTimeout(() => router.refresh(), 100);
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
      {/* Completion Modal */}
      <GameCompletionModal
        isOpen={showCompletionModal}
        gameName="Noughts & Crosses"
        wordsCompleted={exposedWordCount}
        threshold={WORDS_TO_WIN}
        onBackToAssignment={handleBackToAssignments}
        onPlayAgain={() => setShowCompletionModal(false)}
        assignmentId={assignmentId}
      />

      <GameAssignmentWrapper
      assignmentId={assignmentId}
      gameId="noughts-and-crosses"
      studentId={user.id}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
      assignmentProgress={{
        current: gameStats.wordsLearned,
        required: WORDS_TO_WIN,
        label: 'Words'
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
            {/* Progress indicator */}
            <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
              <span className="font-bold">{exposedWordCount}/{WORDS_TO_WIN}</span>
              <span className="text-white/70 ml-2">words to complete</span>
            </div>

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
              // Update game stats - accumulate words learned across rounds
              const newStats = {
                totalGames: gameStats.totalGames + 1,
                wins: gameStats.wins + (result.outcome === 'win' ? 1 : 0),
                losses: gameStats.losses + (result.outcome === 'loss' ? 1 : 0),
                ties: gameStats.ties + (result.outcome === 'tie' ? 1 : 0),
                wordsLearned: gameStats.wordsLearned + (result.wordsLearned || 0)
              };
              setGameStats(newStats);

              console.log(`🎮 [NOUGHTS] Round completed. Words: ${newStats.wordsLearned}/${WORDS_TO_WIN}`, result);

              // Check if threshold met (also handled in useEffect)
              if (newStats.wordsLearned >= WORDS_TO_WIN) {
                const totalQuestionsAsked = result.totalQuestions || 0;
                const correctAnswersGiven = result.correctAnswers || 0;
                const score = correctAnswersGiven * 10;
                const accuracy = totalQuestionsAsked > 0 ? (correctAnswersGiven / totalQuestionsAsked) * 100 : 0;

                onGameComplete({
                  assignmentId: assignment.id,
                  gameId: 'noughts-and-crosses',
                  studentId: user.id,
                  wordsCompleted: newStats.wordsLearned,
                  totalWords: WORDS_TO_WIN,
                  score,
                  maxScore: WORDS_TO_WIN * 10,
                  accuracy,
                  timeSpent: 0,
                  completedAt: new Date(),
                  sessionData: {
                    ...result,
                    totalGames: newStats.totalGames,
                    totalWins: newStats.wins,
                    completionReason: `${WORDS_TO_WIN} words learned`
                  }
                });
              }
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

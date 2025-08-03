'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import VocabMasterGame from './VocabMasterGame';

interface VocabMasterGameWrapperProps {
  mode: string;
  vocabulary: any[];
  config?: Record<string, any>;
  onComplete?: (results: any) => void;
  onExit?: () => void;
  userId?: string;
}

export default function VocabMasterGameWrapper(props: VocabMasterGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    vocabularyMasteryProgression: {
      wordsLearned: 0,
      wordsReviewed: 0,
      masteryLevelsGained: 0,
      spacedRepetitionUpdates: 0,
      retentionRate: 0
    },
    spacedRepetitionEffectiveness: {
      totalReviews: 0,
      successfulReviews: 0,
      averageRetentionInterval: 0,
      difficultyAdjustments: 0,
      optimalReviewTiming: 0
    },
    learningCurveAnalysis: {
      initialAccuracy: 0,
      finalAccuracy: 0,
      improvementRate: 0,
      learningVelocity: 0,
      plateauDetection: false,
      strugglingWords: [] as string[],
      masteredWords: [] as string[]
    },
    gameModePerformance: {
      learnModeAccuracy: 0,
      recallModeAccuracy: 0,
      speedModeAccuracy: 0,
      listeningModeAccuracy: 0,
      typingModeAccuracy: 0,
      clozeTestAccuracy: 0,
      multipleChoiceAccuracy: 0
    },
    responseTimeAnalysis: {
      averageResponseTime: 0,
      fastestResponse: Infinity,
      slowestResponse: 0,
      responseTimeImprovement: 0,
      cognitiveLoadIndicators: []
    },
    wordAttempts: [] as any[]
  });

  // Initialize game service
  useEffect(() => {
    if (props.userId) {
      const service = new EnhancedGameService(supabaseBrowser);
      setGameService(service);
    }
  }, [props.userId]);

  // Start game session when service is ready
  useEffect(() => {
    if (gameService && props.userId && !gameSessionId) {
      startGameSession();
    }
  }, [gameService, props.userId, gameSessionId]);

  // End session when component unmounts
  useEffect(() => {
    return () => {
      endGameSession();
    };
  }, []);

  const startGameSession = async () => {
    if (!gameService || !props.userId) return;

    try {
      const startTime = new Date();
      const sessionId = await gameService.startGameSession({
        student_id: props.userId,
        game_type: 'vocab-master',
        session_mode: 'vocabulary_mastery',
        max_score_possible: props.vocabulary.length * 200, // Base score calculation
        session_data: {
          mode: props.mode,
          vocabularyCount: props.vocabulary.length,
          config: props.config
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log('Vocab Master game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start vocab master game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameService && gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const totalAttempts = sessionStats.wordAttempts.length;
        const correctAttempts = sessionStats.wordAttempts.filter(attempt => attempt.isCorrect).length;
        const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

        // Calculate XP based on comprehensive performance
        const baseXP = correctAttempts * 25; // 25 XP per correct answer
        const accuracyBonus = Math.round(accuracy * 2); // Accuracy bonus
        const masteryBonus = sessionStats.vocabularyMasteryProgression.masteryLevelsGained * 100; // 100 XP per mastery level
        const spacedRepetitionBonus = sessionStats.spacedRepetitionEffectiveness.successfulReviews * 15; // 15 XP per successful review
        const improvementBonus = sessionStats.learningCurveAnalysis.improvementRate > 0 ? 150 : 0; // Learning improvement bonus
        const speedBonus = sessionStats.responseTimeAnalysis.averageResponseTime < 3000 ? 100 : 
                          sessionStats.responseTimeAnalysis.averageResponseTime < 5000 ? 50 : 0; // Speed bonus
        const totalXP = baseXP + accuracyBonus + masteryBonus + spacedRepetitionBonus + improvementBonus + speedBonus;

        await gameService.endGameSession(gameSessionId, {
          student_id: props.userId,
          final_score: Math.round(accuracy * 10), // Scale accuracy to score
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: totalAttempts,
          words_correct: correctAttempts,
          unique_words_practiced: new Set(sessionStats.wordAttempts.map(a => a.word)).size,
          duration_seconds: sessionDuration,
          average_response_time_ms: sessionStats.responseTimeAnalysis.averageResponseTime,
          xp_earned: totalXP,
          bonus_xp: accuracyBonus + masteryBonus + spacedRepetitionBonus + improvementBonus + speedBonus,
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            vocabularyMasteryProgression: sessionStats.vocabularyMasteryProgression,
            spacedRepetitionEffectiveness: sessionStats.spacedRepetitionEffectiveness,
            learningCurveAnalysis: sessionStats.learningCurveAnalysis,
            gameModePerformance: sessionStats.gameModePerformance,
            responseTimeAnalysis: sessionStats.responseTimeAnalysis,
            wordAttempts: sessionStats.wordAttempts
          }
        });

        console.log('Vocab Master game session ended successfully with XP:', totalXP);
      } catch (error) {
        console.error('Failed to end vocab master game session:', error);
      }
    }
  };

  // Enhanced game completion handler
  const handleEnhancedGameComplete = async (results: any) => {
    // Update session stats with final results
    setSessionStats(prev => ({
      ...prev,
      vocabularyMasteryProgression: {
        ...prev.vocabularyMasteryProgression,
        wordsLearned: results.wordsLearned || 0,
        wordsReviewed: results.wordsReviewed || 0,
        retentionRate: results.accuracy || 0
      },
      learningCurveAnalysis: {
        ...prev.learningCurveAnalysis,
        finalAccuracy: results.accuracy || 0,
        masteredWords: results.strengthsGained || [],
        strugglingWords: results.weaknessesIdentified || []
      }
    }));

    // End the session
    await endGameSession();

    // Call the original game completion handler
    if (props.onComplete) {
      props.onComplete({
        ...results,
        vocabularyMasteryProgression: sessionStats.vocabularyMasteryProgression,
        spacedRepetitionEffectiveness: sessionStats.spacedRepetitionEffectiveness,
        learningCurveAnalysis: sessionStats.learningCurveAnalysis,
        gameModePerformance: sessionStats.gameModePerformance,
        responseTimeAnalysis: sessionStats.responseTimeAnalysis
      });
    }
  };

  // Log vocabulary mastery performance
  const logVocabularyMasteryPerformance = async (
    word: string,
    translation: string,
    userAnswer: string,
    isCorrect: boolean,
    responseTime: number,
    gameMode: string,
    masteryLevel?: number,
    spacedRepetitionUpdate?: boolean
  ) => {
    if (gameService && gameSessionId) {
      try {
        await gameService.logWordPerformance({
          session_id: gameSessionId,
          word_id: word,
          word: word,
          translation: translation,
          is_correct: isCorrect,
          response_time_ms: responseTime,
          attempts: 1,
          error_type: isCorrect ? undefined : 'vocabulary_mastery_error',
          grammar_concept: `${gameMode}_mode`,
          error_details: isCorrect ? undefined : {
            userAnswer: userAnswer,
            correctAnswer: translation,
            word: word,
            responseTime: responseTime,
            gameMode: gameMode,
            masteryLevel: masteryLevel
          }
        });

        // Update session stats
        setSessionStats(prev => {
          const newWordAttempts = [...prev.wordAttempts, {
            word,
            translation,
            userAnswer,
            isCorrect,
            responseTime,
            gameMode,
            masteryLevel,
            timestamp: Date.now()
          }];

          // Calculate learning curve metrics
          const totalAttempts = newWordAttempts.length;
          const correctAttempts = newWordAttempts.filter(a => a.isCorrect).length;
          const currentAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
          
          // Calculate improvement rate
          const firstHalfAttempts = newWordAttempts.slice(0, Math.floor(totalAttempts / 2));
          const secondHalfAttempts = newWordAttempts.slice(Math.floor(totalAttempts / 2));
          const firstHalfAccuracy = firstHalfAttempts.length > 0 ? 
            (firstHalfAttempts.filter(a => a.isCorrect).length / firstHalfAttempts.length) * 100 : 0;
          const secondHalfAccuracy = secondHalfAttempts.length > 0 ? 
            (secondHalfAttempts.filter(a => a.isCorrect).length / secondHalfAttempts.length) * 100 : 0;
          const improvementRate = secondHalfAccuracy - firstHalfAccuracy;

          // Update response time analysis
          const responseTimes = newWordAttempts.map(a => a.responseTime);
          const averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
          const fastestResponse = Math.min(...responseTimes);
          const slowestResponse = Math.max(...responseTimes);

          return {
            ...prev,
            vocabularyMasteryProgression: {
              ...prev.vocabularyMasteryProgression,
              wordsReviewed: prev.vocabularyMasteryProgression.wordsReviewed + 1,
              wordsLearned: prev.vocabularyMasteryProgression.wordsLearned + (isCorrect ? 1 : 0),
              masteryLevelsGained: prev.vocabularyMasteryProgression.masteryLevelsGained + (masteryLevel ? 1 : 0),
              spacedRepetitionUpdates: prev.vocabularyMasteryProgression.spacedRepetitionUpdates + (spacedRepetitionUpdate ? 1 : 0),
              retentionRate: currentAccuracy
            },
            spacedRepetitionEffectiveness: {
              ...prev.spacedRepetitionEffectiveness,
              totalReviews: prev.spacedRepetitionEffectiveness.totalReviews + (spacedRepetitionUpdate ? 1 : 0),
              successfulReviews: prev.spacedRepetitionEffectiveness.successfulReviews + (spacedRepetitionUpdate && isCorrect ? 1 : 0)
            },
            learningCurveAnalysis: {
              ...prev.learningCurveAnalysis,
              initialAccuracy: prev.learningCurveAnalysis.initialAccuracy || currentAccuracy,
              finalAccuracy: currentAccuracy,
              improvementRate: improvementRate,
              learningVelocity: totalAttempts > 1 ? improvementRate / totalAttempts : 0,
              strugglingWords: isCorrect ? prev.learningCurveAnalysis.strugglingWords : 
                [...prev.learningCurveAnalysis.strugglingWords.filter(w => w !== word), word],
              masteredWords: isCorrect ? 
                [...prev.learningCurveAnalysis.masteredWords.filter(w => w !== word), word] : 
                prev.learningCurveAnalysis.masteredWords.filter(w => w !== word)
            },
            gameModePerformance: {
              ...prev.gameModePerformance,
              [`${gameMode}ModeAccuracy`]: currentAccuracy
            },
            responseTimeAnalysis: {
              ...prev.responseTimeAnalysis,
              averageResponseTime: averageResponseTime,
              fastestResponse: fastestResponse,
              slowestResponse: slowestResponse,
              responseTimeImprovement: responseTimes.length > 1 ? 
                responseTimes[0] - responseTimes[responseTimes.length - 1] : 0
            },
            wordAttempts: newWordAttempts
          };
        });
      } catch (error) {
        console.error('Failed to log vocabulary mastery performance:', error);
      }
    }
  };

  if (!gameService) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-200">Loading vocabulary mastery system...</p>
        </div>
      </div>
    );
  }

  return (
    <VocabMasterGame
      {...props}
      onComplete={handleEnhancedGameComplete}
      gameSessionId={gameSessionId}
      gameService={gameService}
      onVocabularyMastery={logVocabularyMasteryPerformance}
    />
  );
}

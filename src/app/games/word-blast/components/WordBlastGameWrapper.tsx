'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import WordBlastGame from './WordBlastGame';
import { GameStats, SentenceChallenge } from '../types';

interface WordBlastGameWrapperProps {
  onBackToMenu?: () => void;
  onGameComplete?: (results: any) => void;
  assignmentMode?: boolean;
  assignmentConfig?: any;
  userId?: string;
}

export default function WordBlastGameWrapper(props: WordBlastGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    explosiveWordMatches: 0,
    correctMatches: 0,
    incorrectMatches: 0,
    totalResponseTime: 0,
    chainReactions: 0,
    maxChainLength: 0,
    blastCombos: 0,
    maxCombo: 0,
    wordMatchingAccuracy: 0,
    chainReactionMetrics: {
      totalChains: 0,
      averageChainLength: 0,
      longestChain: 0,
      chainEfficiency: 0
    },
    blastComboTracking: {
      totalCombos: 0,
      maxComboReached: 0,
      comboBreaks: 0,
      averageComboLength: 0
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
        assignment_id: props.assignmentConfig?.assignmentId || undefined,
        game_type: 'word-blast',
        session_mode: props.assignmentMode ? 'assignment' : 'free_play',
        max_score_possible: 5000, // Base score for word blast
        session_data: {
          assignmentMode: props.assignmentMode
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log('Word Blast game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start word blast game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameService && gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.explosiveWordMatches > 0
          ? (sessionStats.correctMatches / sessionStats.explosiveWordMatches) * 100
          : 0;
        const averageResponseTime = sessionStats.explosiveWordMatches > 0
          ? sessionStats.totalResponseTime / sessionStats.explosiveWordMatches
          : 0;

        // Calculate XP based on performance
        const baseXP = sessionStats.correctMatches * 18; // 18 XP per correct match
        const accuracyBonus = Math.round(accuracy * 1.2); // Accuracy bonus
        const comboBonus = sessionStats.blastCombos * 35; // 35 XP per combo
        const chainBonus = sessionStats.chainReactions * 25; // 25 XP per chain reaction
        const speedBonus = averageResponseTime < 3000 ? 80 : averageResponseTime < 5000 ? 40 : 0; // Speed bonus
        const explosiveBonus = sessionStats.explosiveWordMatches * 5; // Explosive matching bonus
        const totalXP = baseXP + accuracyBonus + comboBonus + chainBonus + speedBonus + explosiveBonus;

        await gameService.endGameSession(gameSessionId, {
          student_id: props.userId,
          final_score: Math.round(accuracy * 50), // Scale accuracy to score
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.explosiveWordMatches,
          words_correct: sessionStats.correctMatches,
          unique_words_practiced: sessionStats.wordAttempts.length,
          duration_seconds: sessionDuration,
          average_response_time_ms: averageResponseTime,
          xp_earned: totalXP,
          bonus_xp: accuracyBonus + comboBonus + chainBonus + speedBonus + explosiveBonus,
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            averageResponseTime,
            explosiveWordMatchingAccuracy: accuracy,
            chainReactionMetrics: sessionStats.chainReactionMetrics,
            blastComboTracking: sessionStats.blastComboTracking,
            wordAttempts: sessionStats.wordAttempts
          }
        });

        console.log('Word Blast game session ended successfully with XP:', totalXP);
      } catch (error) {
        console.error('Failed to end word blast game session:', error);
      }
    }
  };

  // Enhanced game completion handler
  const handleEnhancedGameComplete = async (results: any) => {
    // Update session stats with final results
    setSessionStats(prev => ({
      ...prev,
      explosiveWordMatches: results.totalAttempts || prev.explosiveWordMatches,
      correctMatches: results.correctAnswers || prev.correctMatches,
      incorrectMatches: results.incorrectAnswers || prev.incorrectMatches,
      maxCombo: Math.max(prev.maxCombo, results.maxCombo || 0),
      blastCombos: results.totalCombos || prev.blastCombos,
      chainReactions: results.chainReactions || prev.chainReactions,
      maxChainLength: Math.max(prev.maxChainLength, results.maxChainLength || 0)
    }));

    // End the session
    await endGameSession();

    // Call the original game completion handler
    if (props.onGameComplete) {
      props.onGameComplete({
        ...results,
        explosiveWordMatchingAccuracy: sessionStats.wordMatchingAccuracy,
        chainReactionMetrics: sessionStats.chainReactionMetrics,
        blastComboTracking: sessionStats.blastComboTracking
      });
    }
  };

  // Log word matching performance
  const logWordMatchPerformance = async (
    word: string,
    translation: string,
    userAnswer: string,
    isCorrect: boolean,
    responseTime: number,
    comboLevel: number,
    chainPosition?: number
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
          error_type: isCorrect ? undefined : 'word_matching_error',
          grammar_concept: 'vocabulary_matching',
          error_details: isCorrect ? undefined : {
            userAnswer: userAnswer,
            correctAnswer: translation,
            word: word,
            responseTime: responseTime,
            comboLevel: comboLevel,
            chainPosition: chainPosition
          }
        });

        // Update session stats
        setSessionStats(prev => ({
          ...prev,
          explosiveWordMatches: prev.explosiveWordMatches + 1,
          correctMatches: prev.correctMatches + (isCorrect ? 1 : 0),
          incorrectMatches: prev.incorrectMatches + (isCorrect ? 0 : 1),
          totalResponseTime: prev.totalResponseTime + responseTime,
          wordMatchingAccuracy: prev.explosiveWordMatches > 0 
            ? ((prev.correctMatches + (isCorrect ? 1 : 0)) / (prev.explosiveWordMatches + 1)) * 100 
            : 0,
          wordAttempts: [...prev.wordAttempts, {
            word,
            translation,
            userAnswer,
            isCorrect,
            responseTime,
            comboLevel,
            chainPosition,
            timestamp: Date.now()
          }]
        }));
      } catch (error) {
        console.error('Failed to log word match performance:', error);
      }
    }
  };

  // Log chain reaction events
  const logChainReaction = async (chainLength: number, wordsInChain: string[], totalScore: number) => {
    setSessionStats(prev => ({
      ...prev,
      chainReactions: prev.chainReactions + 1,
      maxChainLength: Math.max(prev.maxChainLength, chainLength),
      chainReactionMetrics: {
        totalChains: prev.chainReactionMetrics.totalChains + 1,
        averageChainLength: ((prev.chainReactionMetrics.averageChainLength * prev.chainReactionMetrics.totalChains) + chainLength) / (prev.chainReactionMetrics.totalChains + 1),
        longestChain: Math.max(prev.chainReactionMetrics.longestChain, chainLength),
        chainEfficiency: totalScore / chainLength // Score per word in chain
      }
    }));
  };

  // Log blast combo events
  const logBlastCombo = async (comboLevel: number, comboScore: number, comboBroken: boolean) => {
    setSessionStats(prev => ({
      ...prev,
      blastCombos: prev.blastCombos + (comboBroken ? 0 : 1),
      maxCombo: Math.max(prev.maxCombo, comboLevel),
      blastComboTracking: {
        totalCombos: prev.blastComboTracking.totalCombos + (comboBroken ? 0 : 1),
        maxComboReached: Math.max(prev.blastComboTracking.maxComboReached, comboLevel),
        comboBreaks: prev.blastComboTracking.comboBreaks + (comboBroken ? 1 : 0),
        averageComboLength: comboBroken ? prev.blastComboTracking.averageComboLength : 
          ((prev.blastComboTracking.averageComboLength * prev.blastComboTracking.totalCombos) + comboLevel) / (prev.blastComboTracking.totalCombos + 1)
      }
    }));
  };

  if (!gameService) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-pink-200">Loading word blast arena...</p>
        </div>
      </div>
    );
  }

  return (
    <WordBlastGame
      {...props}
      onGameComplete={handleEnhancedGameComplete}
      gameSessionId={gameSessionId}
      gameService={gameService}
      onWordMatch={logWordMatchPerformance}
      onChainReaction={logChainReaction}
      onBlastCombo={logBlastCombo}
    />
  );
}

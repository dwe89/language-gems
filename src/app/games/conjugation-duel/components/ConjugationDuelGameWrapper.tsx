'use client';

import React, { useState, useEffect } from 'react';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { ConjugationDuelService } from '../../../../services/ConjugationDuelService';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import BattleArena from './BattleArena';
import { useGameStore } from '../../../../store/gameStore';
import { StandardVocabularyItem } from '../../../../components/games/templates/GameAssignmentWrapper';

interface GrammarConfig {
  language?: string;
  tenses?: string[];
  verbTypes?: string[];
  difficulty?: string;
  verbCount?: number;
  persons?: string[]; // Add person/pronoun selection
}

interface ConjugationDuelGameWrapperProps {
  language?: string;
  league?: string;
  opponent?: { name: string; difficulty: string };
  onBackToMenu: () => void;
  onGameEnd: (result: {
    score: number;
    accuracy: number;
    timeSpent: number;
    verbsCompleted: number;
    duelsWon: number;
    verbConjugationAccuracy?: number;
    tenseMasteryTracking?: Record<string, number>;
    competitiveDuelPerformance?: number;
  }) => void;
  assignmentId?: string;
  userId?: string;
  assignmentVocabulary?: StandardVocabularyItem[];
  grammarConfig?: GrammarConfig;
}

export default function ConjugationDuelGameWrapper(props: ConjugationDuelGameWrapperProps) {
  const { startBattle, setPlayerStats, playerStats, battleState, leagues, verbs } = useGameStore();
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalConjugations: 0,
    correctConjugations: 0,
    totalResponseTime: 0,
    duelsWon: 0,
    verbsCompleted: 0,
    tenseMastery: {} as Record<string, { correct: number; total: number }>,
    conjugationAttempts: [] as any[],
    competitiveMetrics: {
      averageResponseTime: 0,
      accuracyUnderPressure: 0,
      streakPerformance: 0
    }
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

    // Initialize battle when data is ready - but only once or when key props change
  useEffect(() => {
    const leagueId = (props.league as string) || 'bronze_arena';
    
    // In assignment mode, we don't need static leagues/verbs data since useConjugationDuel handles everything
    const isAssignmentMode = !!props.grammarConfig;
    const hasLeagues = isAssignmentMode || (Array.isArray(leagues) && leagues.length > 0);
    const hasVerbs = isAssignmentMode || (verbs && Object.keys(verbs).length > 0);
    
    if (!props.opponent || !props.league || !hasLeagues || !hasVerbs) {
      console.log('Conjugation Duel: missing data', {
        opponent: props.opponent,
        league: props.league,
        leagues,
        verbs: verbs,
        isAssignment: isAssignmentMode,
        hasLeagues,
        hasVerbs
      });
      return;
    }
    
    console.log('🎯 [CONJUGATION DUEL] Battle initialization ready:', {
      isAssignmentMode,
      opponent: props.opponent.name,
      league: leagueId,
      hasGrammarConfig: !!props.grammarConfig,
      currentLeague: playerStats.currentLeague,
      isInBattle: battleState.isInBattle
    });
    
    // Only update if currentLeague is not already set to leagueId
    if (playerStats.currentLeague !== leagueId) {
      setPlayerStats({ currentLeague: leagueId });
    }
    // Only start battle if not already in battle
    if (!battleState.isInBattle) {
      startBattle({
        id: props.opponent.name.toLowerCase().replace(/\s+/g, '_'),
        name: props.opponent.name,
        sprite: 'training_dummy.png',
        health: 120,
        difficulty: props.opponent.difficulty === 'hard' ? 3 : props.opponent.difficulty === 'easy' ? 1 : 2,
        weapons: ['practice_sword'],
        description: 'Challenge opponent'
      } as any);
    }
  // Only depend on props and state values, not functions that can change
  }, [props.opponent?.name, props.league, props.grammarConfig, playerStats.currentLeague, battleState.isInBattle, leagues, verbs]);

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
        assignment_id: props.assignmentId || undefined,
        game_type: 'conjugation-duel',
        session_mode: props.assignmentId ? 'assignment' : 'free_play',
        max_score_possible: 1000, // Base score for conjugation duels
        session_data: {
          language: props.language,
          league: props.league,
          opponent: props.opponent
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log('Conjugation Duel game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start conjugation duel game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameService && gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.totalConjugations > 0
          ? (sessionStats.correctConjugations / sessionStats.totalConjugations) * 100
          : 0;
        const averageResponseTime = sessionStats.totalConjugations > 0
          ? sessionStats.totalResponseTime / sessionStats.totalConjugations
          : 0;

        // Calculate tense mastery scores
        const tenseMasteryScores = Object.entries(sessionStats.tenseMastery).reduce((acc, [tense, data]) => {
          acc[tense] = data.total > 0 ? (data.correct / data.total) * 100 : 0;
          return acc;
        }, {} as Record<string, number>);

        // Use gems-first system: XP calculated from individual vocabulary interactions
        // Remove conflicting XP calculation - gems system handles all scoring through recordWordAttempt()
        const totalXP = sessionStats.correctConjugations * 10; // 10 XP per correct conjugation (gems-first)

        await gameService.endGameSession(gameSessionId, {
          student_id: props.userId,
          final_score: Math.round(accuracy * 10), // Scale accuracy to score
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.totalConjugations,
          words_correct: sessionStats.correctConjugations,
          unique_words_practiced: sessionStats.verbsCompleted,
          duration_seconds: sessionDuration,
          average_response_time_ms: averageResponseTime,
          xp_earned: totalXP,
          bonus_xp: 0, // No bonus XP in gems-first system
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            averageResponseTime,
            verbConjugationAccuracy: accuracy,
            tenseMasteryTracking: tenseMasteryScores,
            competitiveDuelPerformance: sessionStats.competitiveMetrics.accuracyUnderPressure,
            conjugationAttempts: sessionStats.conjugationAttempts,
            duelsWon: sessionStats.duelsWon,
            verbsCompleted: sessionStats.verbsCompleted
          }
        });

        console.log('Conjugation Duel game session ended successfully with XP:', totalXP);
      } catch (error) {
        console.error('Failed to end conjugation duel game session:', error);
      }
    }
  };

  // Enhanced battle end handler
  const handleEnhancedBattleEnd = async () => {
    // Calculate competitive performance metrics
    const sessionDuration = sessionStartTime ? (Date.now() - sessionStartTime.getTime()) / 1000 : 300;
    const accuracy = sessionStats.totalConjugations > 0
      ? (sessionStats.correctConjugations / sessionStats.totalConjugations) * 100
      : 0;
    
    // Calculate tense mastery scores
    const tenseMasteryScores = Object.entries(sessionStats.tenseMastery).reduce((acc, [tense, data]) => {
      acc[tense] = data.total > 0 ? (data.correct / data.total) * 100 : 0;
      return acc;
    }, {} as Record<string, number>);

    // Update competitive metrics
    const competitivePerformance = (accuracy + (sessionStats.duelsWon / Math.max(sessionStats.verbsCompleted, 1)) * 100) / 2;

    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      competitiveMetrics: {
        ...prev.competitiveMetrics,
        accuracyUnderPressure: accuracy,
        averageResponseTime: prev.totalConjugations > 0 ? prev.totalResponseTime / prev.totalConjugations : 0
      }
    }));

    // End the session
    await endGameSession();

    // Call the original game end handler
    props.onGameEnd({
      score: Math.round(accuracy * 10),
      accuracy: accuracy,
      timeSpent: sessionDuration,
      verbsCompleted: sessionStats.verbsCompleted,
      duelsWon: sessionStats.duelsWon,
      verbConjugationAccuracy: accuracy,
      tenseMasteryTracking: tenseMasteryScores,
      competitiveDuelPerformance: competitivePerformance
    });
  };

  // Log conjugation performance
  const logConjugationPerformance = async (
    verb: string,
    tense: string,
    person: string,
    answer: string,
    correctAnswer: string,
    isCorrect: boolean,
    responseTime: number
  ) => {
    if (gameService && gameSessionId) {
      try {
        // Record vocabulary interaction using gems-first system
        const sessionService = new EnhancedGameSessionService();
        const gemEvent = await sessionService.recordWordAttempt(gameSessionId, 'conjugation-duel', {
          vocabularyId: undefined, // Conjugation-duel uses dynamic verbs
          wordText: verb,
          translationText: correctAnswer,
          responseTimeMs: responseTime,
          wasCorrect: isCorrect,
          hintUsed: false, // No hints in conjugation-duel
          streakCount: sessionStats.correctConjugations,
          masteryLevel: isCorrect ? 2 : 0, // Higher mastery for correct conjugations
          maxGemRarity: 'epic', // Allow epic gems for verb mastery
          gameMode: 'verb_conjugation',
          difficultyLevel: 'intermediate'
        });

        // Show gem feedback if gem was awarded
        if (gemEvent && isCorrect) {
          console.log(`🔮 Conjugation Duel earned ${gemEvent.rarity} gem (${gemEvent.xpValue} XP) for "${verb}" (${tense})`);
        }

        // Record grammar practice attempt if this is a grammar assignment
        if (props.grammarConfig) {
          try {
            // Create a separate ConjugationDuelService instance for grammar recording
            const grammarService = new ConjugationDuelService(supabaseBrowser);

            // Get student ID from session (use enhanced_game_sessions table)
            const { data: session } = await supabaseBrowser.from('enhanced_game_sessions')
              .select('student_id')
              .eq('id', gameSessionId)
              .single();

            if (session?.student_id) {
              await grammarService.recordGrammarPracticeAttempt(
                session.student_id,
                gameSessionId,  // Add session ID
                props.assignmentId || null,
                verb,
                tense,
                person,
                answer,
                correctAnswer,
                isCorrect,
                responseTime,
                props.grammarConfig.language || 'spanish'
              );
            }
          } catch (error) {
            console.error('❌ [GRAMMAR] Error recording grammar practice:', error);
          }
        }

        await gameService.logWordPerformance({
          session_id: gameSessionId,
          // leave vocabulary ids undefined for dynamic verbs
          word_text: verb,
          translation_text: correctAnswer,
          language_pair: props.language === 'french' ? 'english_french' : props.language === 'german' ? 'english_german' : 'english_spanish',
          attempt_number: 1,
          response_time_ms: responseTime,
          was_correct: isCorrect,
          difficulty_level: 'intermediate',
          hint_used: false,
          streak_count: sessionStats.correctConjugations,
          previous_attempts: 0,
          mastery_level: isCorrect ? 2 : 0,
          error_type: isCorrect ? undefined : 'conjugation_error',
          grammar_concept: `${tense}_conjugation`,
          error_details: isCorrect ? undefined : {
            answer: answer,
            correctAnswer: correctAnswer,
            tense: tense,
            person: person,
            verb: verb,
            responseTime: responseTime
          },
          context_data: {
            verb,
            tense,
            person,
            userAnswer: answer,
            correctAnswer,
            conjugationType: `${tense}_${person}`,
            gameType: 'conjugation-duel'
          },
          timestamp: new Date()
        });

        // Update session stats
        setSessionStats(prev => ({
          ...prev,
          totalConjugations: prev.totalConjugations + 1,
          correctConjugations: prev.correctConjugations + (isCorrect ? 1 : 0),
          totalResponseTime: prev.totalResponseTime + responseTime,
          tenseMastery: {
            ...prev.tenseMastery,
            [tense]: {
              correct: (prev.tenseMastery[tense]?.correct || 0) + (isCorrect ? 1 : 0),
              total: (prev.tenseMastery[tense]?.total || 0) + 1
            }
          },
          conjugationAttempts: [...prev.conjugationAttempts, {
            verb,
            tense,
            person,
            userAnswer: answer,
            correctAnswer,
            isCorrect,
            responseTime
          }]
        }));
      } catch (error) {
        console.error('Failed to log conjugation performance:', error);
      }
    }
  };

  if (!gameService) {
    return (
      <div className="h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-200">Loading conjugation arena...</p>
        </div>
      </div>
    );
  }

  return (
    <BattleArena
      {...props}
      onBattleEnd={handleEnhancedBattleEnd}
      gameSessionId={gameSessionId}
      gameService={gameService}
      assignmentVocabulary={props.assignmentVocabulary}
      grammarConfig={props.grammarConfig}
      onConjugationComplete={logConjugationPerformance}
    />
  );
}

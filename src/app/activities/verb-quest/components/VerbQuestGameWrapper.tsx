'use client';

import React, { useState, useEffect } from 'react';
import { getBufferedGameSessionService, BufferedGameSessionService } from '../../../../services/buffered/BufferedGameSessionService';
import { supabaseBrowser } from '../../../../components/auth/AuthProvider';
import VerbQuestGame from './VerbQuestGame';
import { Character } from './Character';
import { QuestSystem } from './QuestSystem';

interface VerbQuestGameWrapperProps {
  character: Character;
  questSystem: QuestSystem;
  onBackToMenu?: () => void;
  soundEnabled?: boolean;
  onGameComplete?: (results: any) => void;
  assignmentMode?: boolean;
  assignmentConfig?: any;
  userId?: string;
}

export default function VerbQuestGameWrapper(props: VerbQuestGameWrapperProps) {
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const [gameService, setGameService] = useState<BufferedGameSessionService | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({
    questsCompleted: 0,
    battlesWon: 0,
    verbsConjugated: 0,
    correctConjugations: 0,
    totalResponseTime: 0,
    questProgression: [] as any[],
    verbMasteryLevels: {} as Record<string, { level: number; accuracy: number; attempts: number }>,
    adventureMetrics: {
      regionsExplored: 0,
      enemiesDefeated: 0,
      experienceGained: 0,
      levelUps: 0,
      achievementsUnlocked: 0
    }
  });

  // Initialize game service
  useEffect(() => {
    if (props.userId) {
      const service = getBufferedGameSessionService();
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
        game_type: 'verb-quest',
        session_mode: props.assignmentMode ? 'assignment' : 'free_play',
        max_score_possible: 2000, // Base score for quest completion
        session_data: {
          characterName: props.character.stats.name,
          characterClass: props.character.stats.characterClass,
          characterLevel: props.character.stats.level,
          currentRegion: props.character.stats.currentRegion,
          assignmentMode: props.assignmentMode
        }
      });
      setGameSessionId(sessionId);
      setSessionStartTime(startTime);
      console.log('Verb Quest game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start verb quest game session:', error);
    }
  };

  const endGameSession = async () => {
    if (gameService && gameSessionId && props.userId && sessionStartTime) {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        const accuracy = sessionStats.verbsConjugated > 0
          ? (sessionStats.correctConjugations / sessionStats.verbsConjugated) * 100
          : 0;
        const averageResponseTime = sessionStats.verbsConjugated > 0
          ? sessionStats.totalResponseTime / sessionStats.verbsConjugated
          : 0;

        // Calculate verb mastery scores
        const verbMasteryScores = Object.entries(sessionStats.verbMasteryLevels).reduce((acc, [verb, data]) => {
          acc[verb] = data.attempts > 0 ? (data.accuracy / data.attempts) * 100 : 0;
          return acc;
        }, {} as Record<string, number>);

        // Calculate XP based on performance
        const baseXP = sessionStats.correctConjugations * 15; // 15 XP per correct conjugation
        const questBonus = sessionStats.questsCompleted * 50; // 50 XP per quest completed
        const battleBonus = sessionStats.battlesWon * 30; // 30 XP per battle won
        const accuracyBonus = Math.round(accuracy * 1.0); // Accuracy bonus
        const adventureBonus = sessionStats.adventureMetrics.experienceGained * 0.1; // Adventure progression bonus
        const masteryBonus = Object.values(verbMasteryScores).filter(score => score >= 85).length * 20; // Mastery bonus
        const totalXP = baseXP + questBonus + battleBonus + accuracyBonus + adventureBonus + masteryBonus;

        await gameService.endGameSession(gameSessionId, {
          student_id: props.userId,
          final_score: Math.round(accuracy * 20), // Scale accuracy to score
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: sessionStats.verbsConjugated,
          words_correct: sessionStats.correctConjugations,
          unique_words_practiced: Object.keys(sessionStats.verbMasteryLevels).length,
          duration_seconds: sessionDuration,
          average_response_time_ms: averageResponseTime,
          xp_earned: totalXP,
          bonus_xp: questBonus + battleBonus + accuracyBonus + adventureBonus + masteryBonus,
          session_data: {
            sessionStats,
            totalSessionTime: sessionDuration,
            averageResponseTime,
            questProgression: sessionStats.questProgression,
            verbMasteryLevels: verbMasteryScores,
            adventureBasedLearningAnalytics: sessionStats.adventureMetrics,
            characterProgression: {
              level: props.character.stats.level,
              experience: props.character.stats.experience,
              skillPoints: props.character.stats.skillPoints,
              unlockedTenses: props.character.stats.unlockedTenses,
              masteredTenses: Array.from(props.character.stats.masteredTenses),
              achievements: Array.from(props.character.stats.achievements),
              defeatedEnemies: Array.from(props.character.stats.defeatedEnemies),
              unlockedRegions: props.character.stats.unlockedRegions,
              currentRegion: props.character.stats.currentRegion,
              completedQuests: props.character.stats.completedQuests
            }
          }
        });

        console.log('Verb Quest game session ended successfully with XP:', totalXP);
      } catch (error) {
        console.error('Failed to end verb quest game session:', error);
      }
    }
  };

  // Enhanced game completion handler
  const handleEnhancedGameComplete = async (results: any) => {
    // Update session stats with final results
    setSessionStats(prev => ({
      ...prev,
      questsCompleted: results.questsCompleted || prev.questsCompleted,
      battlesWon: results.battlesWon || prev.battlesWon,
      adventureMetrics: {
        ...prev.adventureMetrics,
        experienceGained: results.experienceGained || prev.adventureMetrics.experienceGained,
        levelUps: results.levelUps || prev.adventureMetrics.levelUps,
        achievementsUnlocked: results.achievementsUnlocked || prev.adventureMetrics.achievementsUnlocked
      }
    }));

    // End the session
    await endGameSession();

    // Call the original game completion handler
    if (props.onGameComplete) {
      props.onGameComplete({
        ...results,
        questProgression: sessionStats.questProgression,
        verbMasteryLevels: sessionStats.verbMasteryLevels,
        adventureBasedLearningAnalytics: sessionStats.adventureMetrics
      });
    }
  };

  // Log verb conjugation performance
  const logVerbPerformance = async (
    verb: string,
    tense: string,
    person: string,
    userAnswer: string,
    correctAnswer: string,
    isCorrect: boolean,
    responseTime: number,
    battleContext?: any
  ) => {
    if (gameService && gameSessionId) {
      try {
        await gameService.logWordPerformance({
          session_id: gameSessionId,
          word_id: `${verb}-${tense}-${person}`,
          word: verb,
          translation: correctAnswer,
          is_correct: isCorrect,
          response_time_ms: responseTime,
          attempts: 1,
          error_type: isCorrect ? undefined : 'verb_conjugation_error',
          grammar_concept: `${tense}_conjugation`,
          error_details: isCorrect ? undefined : {
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            tense: tense,
            person: person,
            verb: verb,
            responseTime: responseTime,
            battleContext: battleContext
          }
        });

        // Update session stats
        setSessionStats(prev => ({
          ...prev,
          verbsConjugated: prev.verbsConjugated + 1,
          correctConjugations: prev.correctConjugations + (isCorrect ? 1 : 0),
          totalResponseTime: prev.totalResponseTime + responseTime,
          verbMasteryLevels: {
            ...prev.verbMasteryLevels,
            [verb]: {
              level: (prev.verbMasteryLevels[verb]?.level || 1) + (isCorrect ? 0.1 : 0),
              accuracy: (prev.verbMasteryLevels[verb]?.accuracy || 0) + (isCorrect ? 1 : 0),
              attempts: (prev.verbMasteryLevels[verb]?.attempts || 0) + 1
            }
          }
        }));
      } catch (error) {
        console.error('Failed to log verb performance:', error);
      }
    }
  };

  // Log quest progression
  const logQuestProgression = async (questId: string, questType: string, progress: number, completed: boolean) => {
    setSessionStats(prev => ({
      ...prev,
      questsCompleted: prev.questsCompleted + (completed ? 1 : 0),
      questProgression: [...prev.questProgression, {
        questId,
        questType,
        progress,
        completed,
        timestamp: Date.now()
      }]
    }));
  };

  // Log battle results
  const logBattleResult = async (enemy: any, victory: boolean, expGained: number) => {
    setSessionStats(prev => ({
      ...prev,
      battlesWon: prev.battlesWon + (victory ? 1 : 0),
      adventureMetrics: {
        ...prev.adventureMetrics,
        enemiesDefeated: prev.adventureMetrics.enemiesDefeated + (victory ? 1 : 0),
        experienceGained: prev.adventureMetrics.experienceGained + expGained
      }
    }));
  };

  if (!gameService) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-purple-200">Loading quest realm...</p>
        </div>
      </div>
    );
  }

  return (
    <VerbQuestGame
      {...props}
      onGameComplete={handleEnhancedGameComplete}
      gameSessionId={gameSessionId}
      gameService={gameService}
      onVerbConjugation={logVerbPerformance}
      onQuestProgress={logQuestProgression}
      onBattleResult={logBattleResult}
    />
  );
}

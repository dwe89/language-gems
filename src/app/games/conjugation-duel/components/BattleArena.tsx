'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../../../store/gameStore';
import { useBattle } from '../../../../hooks/useBattle';
import { useBattleAudio } from '../../../../hooks/useBattleAudio';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { useConjugationDuel } from '../../../../hooks/useConjugationDuel';
import HealthBar from './HealthBar';
import CharacterSprite from './CharacterSprite';
import { StandardVocabularyItem } from '../../../../components/games/templates/GameAssignmentWrapper';

interface GrammarConfig {
  language?: string;
  tenses?: string[];
  verbTypes?: string[];
  difficulty?: string;
  verbCount?: number;
  persons?: string[]; // Add person/pronoun selection
}

interface BattleArenaProps {
  onBattleEnd: () => void;
  language?: string;
  league?: string;
  opponent?: { name: string; difficulty: string };
  onBackToMenu?: () => void;
  onGameEnd?: (result: any) => void;
  assignmentId?: string;
  userId?: string;
  gameSessionId?: string | null;
  gameService?: EnhancedGameService | null;
  assignmentVocabulary?: StandardVocabularyItem[];
  grammarConfig?: GrammarConfig;
  onConjugationComplete?: (
    verb: string,
    tense: string,
    person: string,
    answer: string,
    correctAnswer: string,
    isCorrect: boolean,
    responseTime: number
  ) => void;
}

export default function BattleArena({
  onBattleEnd,
  language = 'spanish',
  league,
  opponent,
  onBackToMenu,
  onGameEnd,
  assignmentId,
  userId,
  gameSessionId,
  gameService,
  assignmentVocabulary,
  grammarConfig,
  onConjugationComplete
}: BattleArenaProps) {
  console.log('🎯 [BATTLE ARENA] Initializing with grammar config:', grammarConfig);

  // Validate grammar config is provided for assignments
  if (assignmentId && !grammarConfig) {
    throw new Error('❌ [BATTLE ARENA] Grammar config is required for assignments but was not provided');
  }

  // Memoize game configuration to prevent infinite re-renders
  const gameConfig = React.useMemo(() => {
    const gameLanguage = grammarConfig?.language || language;
    const gameTenses = grammarConfig?.tenses || (assignmentId ? [] : ['present', 'preterite']);
    const gamePersons = grammarConfig?.persons || (assignmentId ? [] : ['yo', 'tu', 'el_ella_usted', 'nosotros', 'vosotros', 'ellos_ellas_ustedes']);
    const gameVerbTypes = grammarConfig?.verbTypes || (assignmentId ? [] : ['regular', 'irregular', 'stem_changing']);
    const gameDifficulty = (grammarConfig?.difficulty ||
      (opponent?.difficulty === 'hard' ? 'advanced' : opponent?.difficulty === 'easy' ? 'beginner' : 'intermediate')) as 'advanced' | 'beginner' | 'intermediate';
    const gameVerbCount = grammarConfig?.verbCount || 10;

    return {
      gameLanguage,
      gameTenses,
      gamePersons,
      gameVerbTypes,
      gameDifficulty,
      gameVerbCount
    };
  }, [
    grammarConfig?.language,
    grammarConfig?.tenses,
    grammarConfig?.persons,
    grammarConfig?.verbTypes,
    grammarConfig?.difficulty,
    grammarConfig?.verbCount,
    language,
    assignmentId,
    opponent?.difficulty
  ]);

  console.log('🎯 [BATTLE ARENA] Final game configuration:', {
    ...gameConfig,
    isAssignment: !!assignmentId
  });

  // Validate configuration for assignments
  if (assignmentId) {
    if (!gameConfig.gameTenses || gameConfig.gameTenses.length === 0) {
      throw new Error('❌ [BATTLE ARENA] Assignment must have at least one tense configured');
    }
    if (!gameConfig.gamePersons || gameConfig.gamePersons.length === 0) {
      throw new Error('❌ [BATTLE ARENA] Assignment must have at least one person configured');
    }
  }

  // Create stable fallback sessionId to prevent infinite re-renders
  const stableSessionId = React.useMemo(() => {
    return gameSessionId || `conjugation-duel-fallback-${Math.random().toString(36).substr(2, 9)}`;
  }, [gameSessionId]);

  // Use ref to store stable options and only update when necessary
  const conjugationDuelOptionsRef = React.useRef<any>(null);

  // Only update options if they've actually changed
  const conjugationDuelOptions = React.useMemo(() => {
    const newOptions = {
      sessionId: stableSessionId,
      language: (gameConfig.gameLanguage === 'spanish' ? 'es' : gameConfig.gameLanguage === 'french' ? 'fr' : 'de') as 'es' | 'fr' | 'de',
      difficulty: gameConfig.gameDifficulty,
      tenses: gameConfig.gameTenses,
      persons: gameConfig.gamePersons,
      verbTypes: gameConfig.gameVerbTypes,
      challengeCount: gameConfig.gameVerbCount,
      timeLimit: assignmentId ? 0 : 15, // Disable timer for assignments to prevent infinite loop
      assignmentVocabulary: assignmentVocabulary,
      assignmentId: assignmentId
    };

    // Only update if options have actually changed
    if (!conjugationDuelOptionsRef.current ||
        JSON.stringify(conjugationDuelOptionsRef.current) !== JSON.stringify(newOptions)) {
      conjugationDuelOptionsRef.current = newOptions;
    }

    return conjugationDuelOptionsRef.current;
  }, [
    stableSessionId,
    gameConfig.gameLanguage,
    gameConfig.gameDifficulty,
    JSON.stringify(gameConfig.gameTenses),
    JSON.stringify(gameConfig.gamePersons),
    JSON.stringify(gameConfig.gameVerbTypes),
    gameConfig.gameVerbCount,
    JSON.stringify(assignmentVocabulary),
    assignmentId
  ]);

  // Initialize conjugation duel service for enhanced vocabulary tracking
  const conjugationDuel = useConjugationDuel(conjugationDuelOptions);

  // Auto-start the duel when component initializes and we have valid config
  useEffect(() => {
    if (!conjugationDuel.hasStarted && !conjugationDuel.isLoading && !conjugationDuel.error) {
      console.log('🚀 [BATTLE ARENA] Auto-starting conjugation duel...');
      conjugationDuel.startDuel();
    }
    // Only depend on hasStarted, isLoading, and error to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conjugationDuel.hasStarted, conjugationDuel.isLoading, conjugationDuel.error]);

  // Log duel status for debugging
  useEffect(() => {
    console.log('🎯 [BATTLE ARENA] Conjugation duel state:', {
      hasStarted: conjugationDuel.hasStarted,
      isLoading: conjugationDuel.isLoading,
      error: conjugationDuel.error,
      currentChallenge: !!conjugationDuel.currentChallenge,
      challengesCount: conjugationDuel.challenges.length
    });
  }, [conjugationDuel.hasStarted, conjugationDuel.isLoading, conjugationDuel.error, conjugationDuel.currentChallenge, conjugationDuel.challenges.length]);

  const {
    battleState,
    playerStats,
    leagues,
    settings,
    setBattleState,
    setSettings,
    takeDamage,
    addBattleLog
  } = useGameStore();

  // Pass timeLimit=0 for assignments to disable timer
  const timeLimit = assignmentId ? 0 : 15;
  const { timeLeft, isAnswering, submitAnswer } = useBattle(language, timeLimit);

  // Show timer only if timeLimit > 0 (not in assignment mode)
  const showTimer = timeLimit > 0;
  const { playSound, playMusic, stopMusic } = useBattleAudio();

  const battleLogRef = useRef<HTMLDivElement>(null);
  const [conjugationStartTime, setConjugationStartTime] = React.useState<number>(0);

  // Get current league for theming
  const currentLeague = leagues.find(l => l.id === playerStats.currentLeague);
  
  // Play battle music when battle starts
  useEffect(() => {
    if (battleState.isInBattle) {
      playMusic();
    } else {
      stopMusic();
    }

    return () => stopMusic();
  }, [battleState.isInBattle]); // Removed playMusic and stopMusic from dependencies

  // Auto-scroll battle log
  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [battleState.battleLog]);

  // Set conjugation start time when new question appears
  useEffect(() => {
    if (battleState.currentQuestion && battleState.isInBattle) {
      setConjugationStartTime(Date.now());
    }
  }, [battleState.currentQuestion, battleState.isInBattle]);

  // Handle battle end
  useEffect(() => {
    if (!battleState.isInBattle && (battleState.playerHealth === 0 || battleState.opponentHealth === 0)) {
      const won = battleState.opponentHealth === 0;
      console.log('🏁 Battle ended:', { won, playerHealth: battleState.playerHealth, opponentHealth: battleState.opponentHealth });
      playSound(won ? 'victory' : 'defeat');
      setTimeout(() => {
        console.log('🏁 Calling onBattleEnd...');
        onBattleEnd();
      }, 1000); // Reduced from 2000ms to 1000ms for faster completion
    }
  }, [battleState, onBattleEnd, playSound]);

  const handleAnswerClick = async (answer: string) => {
    if (!conjugationDuel.currentChallenge || conjugationDuel.isLoading) return;

    const responseTime = conjugationStartTime > 0 ? Date.now() - conjugationStartTime : 0;

    // Process the answer with the conjugation duel service
    try {
      const result = await conjugationDuel.submitAnswer(answer, responseTime, false);

      if (result) {
        const isCorrect = result.isCorrect;
        
        playSound(isCorrect ? 'correct_answer' : 'wrong_answer');

        if (isCorrect) {
          playSound('sword_clash');
          // Apply damage to opponent for correct answer
          takeDamage('opponent', 20);
        } else {
          // Apply damage to player for wrong answer  
          takeDamage('player', 15);
        }

        console.log(`⚔️ Conjugation Duel: Processed "${conjugationDuel.currentChallenge.infinitive}" conjugation`);
        console.log(`✅ Correct: ${result.isCorrect}`);
        console.log(`💎 Gem awarded: ${result.gemAwarded ? result.gemAwarded.rarity : 'none'}`);
        console.log(`⭐ XP earned: ${result.gemAwarded?.xpValue || 0}`);
        console.log(`🔥 Streak: ${result.streakCount}`);

        if (result.gemAwarded) {
          console.log(`🎯 Gem details: ${result.gemAwarded.rarity} gem (+${result.gemAwarded.xpValue} XP)`);
        }

        // Log conjugation performance if callback is available
        if (onConjugationComplete) {
          const challenge = conjugationDuel.currentChallenge;
          onConjugationComplete(
            challenge.infinitive,
            challenge.tense,
            challenge.person,
            answer,
            challenge.expectedAnswer,
            isCorrect,
            responseTime
          );
        }

        // Add battle log entry
        addBattleLog(
          isCorrect 
            ? `Correct! "${answer}" is the right conjugation!`
            : `Wrong! The correct answer was "${result.expectedAnswer}"`
        );

        // Move to next challenge after a shorter delay for better responsiveness
        setTimeout(() => {
          if (!conjugationDuel.isComplete) {
            conjugationDuel.nextChallenge();
          } else {
            // End the duel when all challenges are complete
            console.log('🏆 All challenges complete, ending duel...');
            setBattleState(prev => ({ ...prev, opponentHealth: 0, isInBattle: false })); // Force victory
            // Trigger battle end callback
            setTimeout(() => {
              onBattleEnd();
            }, 500);
          }
        }, 800); // Reduced from 1500ms to 800ms
      }
    } catch (error) {
      console.error('Error processing conjugation:', error);
      playSound('wrong_answer');
    }
  };

  if (!battleState.isInBattle || !battleState.currentOpponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-300 mb-4">Conjugation Duel Cannot Start</h2>
          <p className="text-lg text-white mb-6">Missing or invalid data. Please check that you have selected a valid league and opponent.</p>
          <button
            className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onBackToMenu}
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // Show loading while duel is starting
  if (conjugationDuel.isLoading || (!conjugationDuel.hasStarted && !conjugationDuel.error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-300 mb-4">Preparing Conjugation Duel</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300 mx-auto mb-4"></div>
          <p className="text-lg text-white mb-6">Loading verbs and generating challenges...</p>
        </div>
      </div>
    );
  }

  // Show error if duel failed to start
  if (conjugationDuel.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-300 mb-4">Conjugation Duel Error</h2>
          <p className="text-lg text-white mb-6">{conjugationDuel.error}</p>
          <button
            className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onBackToMenu}
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // Show message if no current challenge
  if (!conjugationDuel.currentChallenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-300 mb-4">No Challenges Available</h2>
          <p className="text-lg text-white mb-6">No conjugation challenges could be generated with the current configuration.</p>
          <button
            className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onBackToMenu}
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: currentLeague?.background 
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/images/battle/${currentLeague.background})`
          : `linear-gradient(135deg, ${currentLeague ? currentLeague.theme.gradient : 'from-gray-800 to-gray-900'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      {/* Header with Timer and Level */}
      <div className="relative z-10 flex justify-between items-center p-4 bg-black/20">
        <div className="text-white">
          <h2 className="text-2xl font-bold">{currentLeague?.name}</h2>
          <p className="text-sm opacity-80">Level {playerStats.level}</p>
        </div>
        {showTimer && (
          <div className="text-center">
            <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {timeLeft}
            </div>
            <p className="text-xs text-white/80">seconds</p>
          </div>
        )}
        <div className="flex items-center gap-4">
          {/* Mute Button - Only show in assignment mode */}
          {assignmentId && (
            <button
              onClick={() => {
                const newSoundEnabled = !settings.soundEnabled;
                setSettings({ soundEnabled: newSoundEnabled, musicEnabled: newSoundEnabled });
                if (!newSoundEnabled) {
                  stopMusic();
                }
              }}
              className="p-2 rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
              title={settings.soundEnabled ? "Mute audio" : "Unmute audio"}
            >
              {settings.soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          )}

          <div className="text-white text-right">
            <p className="text-sm">XP: {playerStats.experience}</p>
            <p className="text-xs opacity-80">Accuracy: {playerStats.accuracy.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Main Battle Area */}
      <div className="flex-1 flex">
        {/* Left Side - Player */}
        <div className="w-1/3 flex flex-col items-center justify-center p-4">
          <div className="mb-4">
            <CharacterSprite 
              type="player" 
              health={battleState.playerHealth}
              maxHealth={100}
              isAttacking={false}
            />
          </div>
          <HealthBar
            current={battleState.playerHealth}
            max={100}
            label="You"
            color="green"
          />
        </div>

        {/* Center - Question Area */}
        <div className="w-1/3 flex flex-col justify-center p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${conjugationDuel.currentChallenge.infinitive}-${conjugationDuel.currentChallenge.person}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white/95 rounded-xl p-6 shadow-xl backdrop-blur-sm"
            >
              {/* Question */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Conjugate the verb:
                </h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {conjugationDuel.currentChallenge.infinitive}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  ({conjugationDuel.currentChallenge.translation})
                </div>
                <div className="text-xl text-gray-800">
                  <span className="font-semibold">{conjugationDuel.currentChallenge.person}</span>
                  <span className="mx-2">_______</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Tense: {conjugationDuel.currentChallenge.tense}
                </div>
              </div>

              {/* Answer Input */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Type your conjugation here..."
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-center"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const target = e.target as HTMLInputElement;
                      if (target.value.trim()) {
                        handleAnswerClick(target.value.trim());
                        target.value = '';
                      }
                    }
                  }}
                  disabled={isAnswering}
                />
                <div className="text-center">
                  <p className="text-sm text-gray-600">Press Enter to submit your answer</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side - Opponent */}
        <div className="w-1/3 flex flex-col items-center justify-center p-4">
          <div className="mb-4">
            <CharacterSprite 
              type="opponent" 
              opponent={battleState.currentOpponent}
              health={battleState.opponentHealth}
              maxHealth={battleState.currentOpponent.health}
              isAttacking={false}
            />
          </div>
          <HealthBar
            current={battleState.opponentHealth}
            max={battleState.currentOpponent.health}
            label={battleState.currentOpponent.name}
            color="red"
          />
        </div>
      </div>

      {/* Battle Log */}
      <div className="relative z-10 bg-black/40 backdrop-blur-sm p-4 max-h-32 overflow-hidden">
        <div 
          ref={battleLogRef}
          className="h-20 overflow-y-auto text-white text-sm space-y-1 scrollbar-thin scrollbar-thumb-white/30"
        >
          {battleState.battleLog.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <span className="text-blue-300 mr-2">›</span>
              {log}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../../../store/gameStore';
import { useBattle } from '../../../../hooks/useBattle';
import { useBattleAudio } from '../../../../hooks/useBattleAudio';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { useUnifiedSpacedRepetition } from '../../../../hooks/useUnifiedSpacedRepetition';
import HealthBar from './HealthBar';
import CharacterSprite from './CharacterSprite';

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
  onConjugationComplete?: (
    verb: string,
    tense: string,
    person: string,
    userAnswer: string,
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
  onConjugationComplete
}: BattleArenaProps) {
  // Initialize FSRS spaced repetition system
  const { recordWordPractice, algorithm } = useUnifiedSpacedRepetition('conjugation-duel');

  const {
    battleState,
    playerStats,
    leagues,
    setBattleState
  } = useGameStore();

  const { timeLeft, isAnswering, submitAnswer } = useBattle(language);
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
      playSound(won ? 'victory' : 'defeat');
      setTimeout(() => {
        onBattleEnd();
      }, 2000);
    }
  }, [battleState, onBattleEnd, playSound]);

  const handleAnswerClick = (answer: string) => {
    if (isAnswering) return;

    const isCorrect = answer === battleState.currentQuestion?.correctAnswer;
    const responseTime = conjugationStartTime > 0 ? Date.now() - conjugationStartTime : 0;

    playSound(isCorrect ? 'correct_answer' : 'wrong_answer');

    if (isCorrect) {
      playSound('sword_clash');
    }

    // Record conjugation practice with FSRS system
    if (!assignmentId && battleState.currentQuestion) {
      try {
        const question = battleState.currentQuestion;
        const wordData = {
          id: `${question.verb?.infinitive || 'unknown'}-${question.tense}-${question.pronoun}`,
          word: question.verb?.infinitive || 'unknown',
          translation: `${question.pronoun} ${question.correctAnswer}`, // Conjugated form as translation
          language: language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'en'
        };

        // Calculate confidence based on conjugation accuracy and response time
        let confidence = 0.8; // High base confidence for conjugation practice

        // Adjust for response time (conjugations should be quick once learned)
        if (responseTime < 3000) confidence += 0.1;
        else if (responseTime > 8000) confidence -= 0.2;

        // Adjust for tense complexity
        if (question.tense === 'subjunctive' || question.tense === 'conditional') {
          confidence += 0.1; // Bonus for complex tenses
        }

        confidence = Math.max(0.1, Math.min(0.95, confidence));

        // Record practice with FSRS
        recordWordPractice(
          wordData,
          isCorrect,
          responseTime,
          confidence
        ).then(fsrsResult => {
          if (fsrsResult) {
            console.log(`FSRS recorded for conjugation "${question.verb?.infinitive}" (${question.tense}):`, {
              algorithm: fsrsResult.algorithm,
              points: fsrsResult.points,
              nextReview: fsrsResult.nextReviewDate,
              interval: fsrsResult.interval,
              masteryLevel: fsrsResult.masteryLevel
            });
          }
        }).catch(error => {
          console.error('Error recording FSRS conjugation practice:', error);
        });
      } catch (error) {
        console.error('Error setting up FSRS recording for conjugation:', error);
      }
    }

    // Log conjugation performance if callback is available
    if (onConjugationComplete && battleState.currentQuestion) {
      const question = battleState.currentQuestion;
      onConjugationComplete(
        question.verb?.infinitive || 'unknown',
        question.tense || 'present',
        question.pronoun || 'yo',
        answer,
        question.correctAnswer,
        isCorrect,
        responseTime
      );
    }

    submitAnswer(answer);
  };

  if (!battleState.isInBattle || !battleState.currentOpponent || !battleState.currentQuestion) {
    return null;
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
        
        <div className="text-center">
          <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {timeLeft}
          </div>
          <p className="text-xs text-white/80">seconds</p>
        </div>

        <div className="text-white text-right">
          <p className="text-sm">XP: {playerStats.experience}</p>
          <p className="text-xs opacity-80">Accuracy: {playerStats.accuracy.toFixed(1)}%</p>
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
              key={`${battleState.currentQuestion.verb.infinitive}-${battleState.currentQuestion.pronoun}`}
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
                  {battleState.currentQuestion.verb.infinitive}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  ({battleState.currentQuestion.verb.english})
                </div>
                <div className="text-xl text-gray-800">
                  <span className="font-semibold">{battleState.currentQuestion.pronoun}</span>
                  <span className="mx-2">_______</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Tense: {battleState.currentQuestion.tense}
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-3">
                {battleState.currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={`${option}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAnswerClick(option)}
                    disabled={isAnswering}
                    className={`p-4 rounded-lg font-medium transition-colors ${
                      isAnswering 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
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

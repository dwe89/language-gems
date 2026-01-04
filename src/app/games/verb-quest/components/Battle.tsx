'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomVerb, getRandomPronoun, generateWrongAnswers, getVerbConjugation } from './VerbDataEnhanced';
import { Character } from './Character';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';

interface BattleProps {
  enemy: {
    id: string;
    name: string;
    emoji: string;
    health: number;
    difficulty: string;
    verbTypes: string[];
    tenseTypes: string[];
    experience: number;
    description: string;
    minLevel: number;
    attackPatterns: string[];
    resistances?: string[];
    weaknesses?: string[];
  };
  region: string;
  character: Character;
  onBattleEnd: (victory: boolean, expGained?: number) => void;
  soundEnabled: boolean;
  onVerbConjugation?: (
    verb: string,
    tense: string,
    person: string,
    answer: string,
    correctAnswer: string,
    isCorrect: boolean,
    responseTime: number,
    battleContext?: any
  ) => void;
}

interface BattleQuestion {
  verb: {
    infinitive: string;
    english: string;
  };
  pronoun: string;
  tense: string;
  correctAnswer: string;
  options: string[];
}

export default function Battle({ enemy, region, character, onBattleEnd, soundEnabled, onVerbConjugation }: BattleProps) {
  // Initialize FSRS spaced repetition system

  const [enemyHealth, setEnemyHealth] = useState(enemy.health);
  const [playerHealth, setPlayerHealth] = useState(character.stats.health);
  const [currentQuestion, setCurrentQuestion] = useState<BattleQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isAnswering, setIsAnswering] = useState(true);
  const [battlePhase, setBattlePhase] = useState<'question' | 'result' | 'enemy_attack'>('question');
  const [showDamage, setShowDamage] = useState<{ type: 'player' | 'enemy'; amount: number } | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  const battleLogRef = useRef<HTMLDivElement>(null);

  // Initialize first question
  useEffect(() => {
    generateNewQuestion();
  }, []);

  // Auto-scroll battle log
  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [battleLog]);

  // Set question start time when new question appears
  useEffect(() => {
    if (currentQuestion && battlePhase === 'question') {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestion, battlePhase]);

  const generateNewQuestion = () => {
    const enemyTenseTypes = enemy.tenseTypes || ['present.regular'];
    const verb = getRandomVerb(enemy.verbTypes, enemyTenseTypes);
    if (!verb) return;

    const pronoun = getRandomPronoun();
    const tenseType = enemyTenseTypes[Math.floor(Math.random() * enemyTenseTypes.length)];

    // Get correct answer using VerbDataEnhanced functions
    const correctAnswer = getVerbConjugation(verb, tenseType, pronoun);
    if (!correctAnswer) return;

    // Generate wrong answers using the enhanced system
    const wrongAnswers = generateWrongAnswers(correctAnswer, verb, tenseType, pronoun);

    const options = [correctAnswer, ...wrongAnswers]
      .slice(0, 4)
      .sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      verb: {
        infinitive: verb.infinitive,
        english: verb.english
      },
      pronoun,
      tense: tenseType,
      correctAnswer,
      options
    });

    setSelectedAnswer(null);
    setBattlePhase('question');
    setIsAnswering(true);
  };

  const playSound = (soundName: string) => {
    if (soundEnabled) {
      const audio = new Audio(`/games/verb-quest/sounds/${soundName}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(e => console.error(`Error playing ${soundName}:`, e));
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (!isAnswering || !currentQuestion) return;

    setSelectedAnswer(answer);
    setIsAnswering(false);
    setBattlePhase('result');

    const isCorrect = answer === currentQuestion.correctAnswer;
    const responseTime = questionStartTime > 0 ? Date.now() - questionStartTime : 0;

    // Record verb conjugation practice with FSRS system
    if (currentQuestion) {
      (async () => {
        try {
          const wordData = {
            id: `${currentQuestion.verb.infinitive}-${currentQuestion.tense}-${currentQuestion.pronoun}`,
            word: currentQuestion.verb.infinitive,
            translation: currentQuestion.verb.english,
            language: 'es' // Assuming Spanish
          };

          // Calculate confidence based on response time, enemy difficulty, and character level
          const baseConfidence = isCorrect ? 0.8 : 0.2;
          const speedBonus = responseTime < 5000 ? 0.1 : responseTime < 10000 ? 0.05 : 0;
          const difficultyBonus = enemy.difficulty === 'hard' ? 0.1 : enemy.difficulty === 'medium' ? 0.05 : 0;
          const levelBonus = character.stats.level > 5 ? 0.05 : 0;
          const confidence = Math.max(0.1, Math.min(0.95, baseConfidence + speedBonus + difficultyBonus + levelBonus));

          // Record practice with FSRS

          console.log(`🔍 [FSRS] Recorded verb-quest conjugation for ${currentQuestion.verb.infinitive}:`, {
            tense: currentQuestion.tense,
            pronoun: currentQuestion.pronoun,
            isCorrect,
            confidence,
            responseTime
          });
        } catch (error) {
          console.error('Error recording FSRS practice for verb-quest:', error);
        }
      })();
    }

    // Log verb conjugation performance if callback is available
    if (onVerbConjugation && currentQuestion) {
      onVerbConjugation(
        currentQuestion.verb.infinitive,
        currentQuestion.tense,
        currentQuestion.pronoun,
        answer,
        currentQuestion.correctAnswer,
        isCorrect,
        responseTime,
        {
          enemy: enemy.name,
          region: region,
          playerHealth: playerHealth,
          enemyHealth: enemyHealth,
          battlePhase: battlePhase
        }
      );
    }

    if (isCorrect) {
      playSound('correct');
      // Player attacks enemy - scale damage based on enemy health and character level
      const baseDamage = Math.floor(enemy.health * 0.15); // 15% of enemy health
      const levelBonus = character.stats.level * 2;
      const damage = baseDamage + levelBonus + Math.floor(Math.random() * 10);
      const newEnemyHealth = Math.max(0, enemyHealth - damage);
      setEnemyHealth(newEnemyHealth);
      setShowDamage({ type: 'enemy', amount: damage });

      addToBattleLog(`✅ Correct! You cast "${answer}" and deal ${damage} damage!`);

      if (newEnemyHealth <= 0) {
        playSound('victory');
        setTimeout(() => {
          addToBattleLog(`🎉 Victory! You defeated the ${enemy.name}!`);
          setTimeout(() => onBattleEnd(true, enemy.experience), 2000);
        }, 1000);
        return;
      }
    } else {
      playSound('wrong');
      addToBattleLog(`❌ Wrong! The correct answer was "${currentQuestion.correctAnswer}".`);
    }

    // Enemy attacks after a delay - scale damage based on player health
    setTimeout(() => {
      setBattlePhase('enemy_attack');
      playSound('damage');
      const baseDamage = Math.floor(character.stats.maxHealth * 0.12); // 12% of player max health
      const enemyDamage = baseDamage + Math.floor(Math.random() * 10);
      const newPlayerHealth = Math.max(0, playerHealth - enemyDamage);
      setPlayerHealth(newPlayerHealth);
      setShowDamage({ type: 'player', amount: enemyDamage });

      addToBattleLog(`🗡️ ${enemy.name} attacks you for ${enemyDamage} damage!`);

      if (newPlayerHealth <= 0) {
        playSound('defeat');
        setTimeout(() => {
          addToBattleLog(`💀 Defeat! You have been vanquished!`);
          setTimeout(() => onBattleEnd(false), 2000);
        }, 1000);
        return;
      }

      // Generate new question after enemy attack
      setTimeout(() => {
        setShowDamage(null);
        generateNewQuestion();
      }, 2000);
    }, 2000);
  };

  const addToBattleLog = (message: string) => {
    setBattleLog(prev => [...prev, message]);
  };

  // Clear damage indicator after showing
  useEffect(() => {
    if (showDamage) {
      const timer = setTimeout(() => setShowDamage(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [showDamage]);

  if (!currentQuestion) {
    return <div className="flex items-center justify-center h-full text-white">Loading...</div>;
  }

  return (
    <div className="h-full text-white relative overflow-hidden flex flex-col">
      {/* Battle Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/games/verb-quest/backgrounds/battle.jpg')`
        }}
      />

      {/* Dark overlay for better UI readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      {/* Ambient battle effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 flex flex-col h-full p-4">
        {/* Compact Header with Health Bars */}
        <div className="flex items-center justify-between mb-4 px-4">
          {/* Player Health */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl shadow-lg border-2 border-blue-400/50">
              ⚔️
            </div>
            <div>
              <div className="text-sm font-semibold text-blue-300">You</div>
              <div className="w-40 h-5 bg-gray-900/80 rounded-full overflow-hidden relative border border-gray-600/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 via-green-400 to-emerald-400"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(playerHealth / character.stats.maxHealth) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold drop-shadow-lg">
                  {playerHealth}/{character.stats.maxHealth}
                </div>
              </div>
            </div>
            {showDamage?.type === 'player' && (
              <motion.div
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ y: -40, opacity: 0, scale: 1.5 }}
                className="absolute ml-16 text-red-400 font-bold text-2xl drop-shadow-lg"
              >
                -{showDamage.amount}
              </motion.div>
            )}
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg">
              ⚔️ Battle Arena ⚔️
            </h1>
          </div>

          {/* Enemy Health */}
          <div className="flex items-center gap-3 flex-row-reverse relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-2xl shadow-lg border-2 border-red-400/50">
              💀
            </div>
            <div>
              <div className="text-sm font-semibold text-red-300 text-right">{enemy.name}</div>
              <div className="w-40 h-5 bg-gray-900/80 rounded-full overflow-hidden relative border border-gray-600/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-600 via-red-500 to-orange-400"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(enemyHealth / enemy.health) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold drop-shadow-lg">
                  {enemyHealth}/{enemy.health}
                </div>
              </div>
            </div>
            {showDamage?.type === 'enemy' && (
              <motion.div
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ y: -40, opacity: 0, scale: 1.5 }}
                className="absolute right-16 text-yellow-400 font-bold text-2xl drop-shadow-lg"
              >
                -{showDamage.amount}
              </motion.div>
            )}
          </div>
        </div>

        {/* Main Battle Area - Horizontal Layout */}
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Left Side - Large Enemy Display */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              animate={{
                scale: battlePhase === 'enemy_attack' ? [1, 1.15, 1] : 1,
                rotate: battlePhase === 'enemy_attack' ? [0, -8, 8, -4, 4, 0] : 0,
                y: battlePhase === 'enemy_attack' ? [0, -15, 0] : 0
              }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Glow effect behind enemy */}
              <div className="absolute inset-0 bg-gradient-radial from-red-500/30 via-orange-500/10 to-transparent rounded-full blur-2xl scale-125"></div>

              {/* Enemy Image - MUCH BIGGER */}
              <img
                src={`/games/verb-quest/enemies/${enemy.id}.png`}
                alt={enemy.name}
                className="w-[26rem] h-[26rem] object-contain drop-shadow-2xl relative z-10"
                style={{ filter: 'drop-shadow(0 0 50px rgba(255, 100, 50, 0.6))' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'text-[18rem] leading-none';
                  fallback.textContent = enemy.emoji;
                  (e.target as HTMLImageElement).parentNode?.appendChild(fallback);
                }}
              />

              {/* Attack indicator */}
              {battlePhase === 'enemy_attack' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 flex items-center justify-center text-8xl"
                >
                  💥
                </motion.div>
              )}
            </motion.div>

            {/* Enemy Name & Description */}
            <div className="mt-4 text-center">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{enemy.name}</h2>
              <p className="text-gray-300 text-sm mt-1 max-w-xs">{enemy.description}</p>
            </div>
          </div>

          {/* Center - Question & Answers */}
          <div className="w-80 flex flex-col">
            {/* Question Card */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl flex-1 flex flex-col">
              <div className="text-center mb-3">
                <div className="inline-block px-3 py-1 bg-yellow-500/20 rounded-full border border-yellow-500/30 mb-2">
                  <span className="text-yellow-400 text-xs font-semibold">⚔️ Conjugate to Attack!</span>
                </div>
                <div className="text-xl text-gray-200 mb-1">
                  <span className="text-white font-bold">{currentQuestion.verb.infinitive}</span>
                  <span className="text-gray-400"> ({currentQuestion.verb.english})</span>
                </div>
                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                  {currentQuestion.pronoun} + ?
                </div>
              </div>

              {/* Answer Options - Compact Grid */}
              <div className="grid grid-cols-2 gap-2 flex-1">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const isWrong = isSelected && !isCorrect;

                  let buttonClass = "p-2 rounded-lg font-semibold text-base transition-all duration-300 border-2 flex items-center justify-center ";

                  if (battlePhase === 'question') {
                    buttonClass += "bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border-blue-400/50 hover:border-blue-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105";
                  } else if (isCorrect) {
                    buttonClass += "bg-gradient-to-br from-green-500 to-green-600 text-white border-green-300 shadow-lg shadow-green-500/30";
                  } else if (isWrong) {
                    buttonClass += "bg-gradient-to-br from-red-500 to-red-600 text-white border-red-300 shadow-lg shadow-red-500/30";
                  } else {
                    buttonClass += "bg-gray-700/50 text-gray-400 border-gray-600/50";
                  }

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={!isAnswering}
                      className={buttonClass}
                      whileHover={isAnswering ? { scale: 1.05 } : {}}
                      whileTap={isAnswering ? { scale: 0.95 } : {}}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Retreat Button */}
            <button
              onClick={() => onBattleEnd(false)}
              className="mt-3 px-4 py-2 bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white rounded-lg transition-all text-sm border border-gray-600/50 hover:border-gray-500"
            >
              🏃 Retreat
            </button>
          </div>

          {/* Right Side - Battle Log */}
          <div className="w-72 bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-200">
              📜 Battle Log
            </h3>
            <div
              ref={battleLogRef}
              className="flex-1 overflow-y-auto space-y-2 text-sm scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            >
              {battleLog.length === 0 ? (
                <div className="text-gray-500 italic text-center py-4">
                  The battle begins...
                </div>
              ) : (
                battleLog.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2 bg-gray-800/50 rounded-lg text-gray-300 border border-gray-700/50"
                  >
                    {message}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

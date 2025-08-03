'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomVerb, getRandomPronoun, generateWrongAnswers, getVerbConjugation } from './VerbDataEnhanced';
import { Character } from './Character';

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
    userAnswer: string,
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

    // Log verb conjugation performance if callback is available
    if (onVerbConjugation && currentQuestion) {
      onVerbConjugation(
        currentQuestion.verb.infinitive,
        currentQuestion.tenseType,
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
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Battle Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/games/verb-quest/backgrounds/battle.jpg')`
        }}
      />
      
      {/* Dark overlay for better UI readability */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Battle effects overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-red-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Battle Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Battle Arena</h1>
          <p className="text-red-200">Defeat your enemy with correct verb conjugations!</p>
        </div>

        {/* Health Bars */}
        <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
          {/* Player Health */}
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">You</h3>
            <div className="w-64 h-6 bg-gray-700 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                initial={{ width: '100%' }}
                animate={{ width: `${(playerHealth / character.stats.maxHealth) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {playerHealth}/{character.stats.maxHealth}
              </div>
            </div>
            {showDamage?.type === 'player' && (
              <motion.div
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -30, opacity: 0 }}
                className="absolute text-red-400 font-bold text-xl"
              >
                -{showDamage.amount}
              </motion.div>
            )}
          </div>

          {/* VS */}
          <div className="text-4xl font-bold text-yellow-400">⚔️</div>

          {/* Enemy Health */}
          <div className="text-center relative">
            <h3 className="text-lg font-bold mb-2">{enemy.name}</h3>
            <div className="w-64 h-6 bg-gray-700 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-red-400"
                initial={{ width: '100%' }}
                animate={{ width: `${(enemyHealth / enemy.health) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {enemyHealth}/{enemy.health}
              </div>
            </div>
            {showDamage?.type === 'enemy' && (
              <motion.div
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -30, opacity: 0 }}
                className="absolute text-yellow-400 font-bold text-xl"
              >
                -{showDamage.amount}
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Battle Arena (Enemy) */}
          <div className="lg:col-span-2">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-6">
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: battlePhase === 'enemy_attack' ? 1.1 : 1,
                    rotate: battlePhase === 'enemy_attack' ? [0, -5, 5, 0] : 0
                  }}
                  className="mb-4 flex justify-center"
                >
                  <img 
                    src={`/games/verb-quest/enemies/${enemy.id}.png`}
                    alt={enemy.name}
                    className="w-32 h-32 object-contain drop-shadow-lg"
                    onError={(e) => {
                      // Fallback to emoji if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'text-8xl';
                      fallback.textContent = enemy.emoji;
                      (e.target as HTMLImageElement).parentNode?.appendChild(fallback);
                    }}
                  />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">{enemy.name}</h2>
                <p className="text-gray-300 text-sm">{enemy.description}</p>
              </div>
            </div>

            {/* Question Area */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-center">Conjugate the Verb</h3>
              
              <div className="text-center mb-6">
                <div className="text-lg text-gray-300 mb-2">
                  <strong>Verb:</strong> {currentQuestion.verb.infinitive} ({currentQuestion.verb.english})
                </div>
                <div className="text-2xl font-bold text-yellow-400 mb-4">
                  {currentQuestion.pronoun} + ?
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const isWrong = isSelected && !isCorrect;
                  
                  let buttonClass = "p-4 rounded-lg font-semibold transition-all duration-300 ";
                  
                  if (battlePhase === 'question') {
                    buttonClass += "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105";
                  } else if (isCorrect) {
                    buttonClass += "bg-green-600 text-white";
                  } else if (isWrong) {
                    buttonClass += "bg-red-600 text-white";
                  } else {
                    buttonClass += "bg-gray-600 text-gray-300";
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
          </div>

          {/* Battle Log */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-lg font-bold mb-4">Battle Log</h3>
            <div 
              ref={battleLogRef}
              className="h-64 overflow-y-auto space-y-2 text-sm"
            >
              {battleLog.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2 bg-gray-800/50 rounded"
                >
                  {message}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Retreat Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => onBattleEnd(false)}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Retreat
          </button>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

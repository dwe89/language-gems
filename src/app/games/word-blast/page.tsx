'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  RocketIcon, Clock, RefreshCw, Star, CheckCircle2, 
  Zap, SnowflakeIcon, Award, Shield
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { WordItem, PowerUp, GameState, GameSettings } from './types';
import './word-blast.css';

// Sample vocabulary for demo purposes
const sampleVocabulary = [
  { id: '1', word: 'dog', translation: 'perro', correct: false, points: 10 },
  { id: '2', word: 'cat', translation: 'gato', correct: false, points: 10 },
  { id: '3', word: 'house', translation: 'casa', correct: false, points: 10 },
  { id: '4', word: 'car', translation: 'coche', correct: false, points: 10 },
  { id: '5', word: 'book', translation: 'libro', correct: false, points: 10 },
  { id: '6', word: 'tree', translation: 'árbol', correct: false, points: 15 },
  { id: '7', word: 'sun', translation: 'sol', correct: false, points: 10 },
  { id: '8', word: 'moon', translation: 'luna', correct: false, points: 10 },
  { id: '9', word: 'water', translation: 'agua', correct: false, points: 10 },
  { id: '10', word: 'food', translation: 'comida', correct: false, points: 10 },
  { id: '11', word: 'friend', translation: 'amigo', correct: false, points: 15 },
  { id: '12', word: 'school', translation: 'escuela', correct: false, points: 15 },
  { id: '13', word: 'teacher', translation: 'profesor', correct: false, points: 15 },
  { id: '14', word: 'student', translation: 'estudiante', correct: false, points: 15 },
  { id: '15', word: 'computer', translation: 'ordenador', correct: false, points: 20 },
];

// Power-ups
const powerUps: PowerUp[] = [
  {
    id: 'superBoost',
    type: 'superBoost',
    icon: '⚡',
    active: false,
    cooldown: 0,
    description: 'Instantly launches one correct rocket'
  },
  {
    id: 'timeFreeze',
    type: 'timeFreeze',
    icon: '❄️',
    active: false,
    cooldown: 0,
    description: 'Freezes time for 5 seconds'
  },
  {
    id: 'doublePoints',
    type: 'doublePoints',
    icon: '🌟',
    active: false,
    cooldown: 0,
    description: 'Doubles points for next 3 correct answers'
  }
];

// Rocket animation component
const Rocket = ({ 
  word, 
  isCorrect,
  onComplete 
}: { 
  word: WordItem, 
  isCorrect: boolean,
  onComplete: () => void 
}) => {
  return (
    <motion.div
      className={`
        p-4 rounded-lg flex flex-col items-center
        ${isCorrect ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gray-700'}
      `}
      initial={{ y: 300, opacity: 1 }}
      animate={isCorrect 
        ? { y: -500, opacity: 0, scale: 0.7 } 
        : { y: 50, opacity: 0.8, scale: 0.9 }}
      transition={isCorrect
        ? { duration: 1, ease: "easeOut" }
        : { duration: 0.5, ease: "easeIn" }}
      onAnimationComplete={onComplete}
    >
      <svg 
        className={`w-12 h-12 ${isCorrect ? 'text-white' : 'text-gray-400'}`} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M12 2L9 9H15L12 16M12 16V22M5 9L2 6M19 9L22 6" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M7 14C5.34315 14 4 12.6569 4 11V11C4 9.34315 5.34315 8 7 8" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <path 
          d="M17 14C18.6569 14 20 12.6569 20 11V11C20 9.34315 18.6569 8 17 8" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>
      <div className={`mt-2 text-lg font-bold ${isCorrect ? 'text-white' : 'text-gray-300'}`}>
        {word.word}
      </div>
    </motion.div>
  );
};

export default function WordBlastGame() {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 60,
    survivalMode: false,
    powerUpsEnabled: false,
    vocabularyId: null
  });
  const [vocabulary, setVocabulary] = useState<WordItem[]>([]);
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameSettings.timeLimit);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [availablePowerUps, setAvailablePowerUps] = useState<PowerUp[]>([]);
  const [doublePointsActive, setDoublePointsActive] = useState(false);
  const [doublePointsCount, setDoublePointsCount] = useState(0);
  const [rockets, setRockets] = useState<{id: string, word: WordItem, isCorrect: boolean}[]>([]);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Initialize game
  useEffect(() => {
    // Check if this is launched from an assignment
    const assignmentIdParam = searchParams?.get('assignment');
    if (assignmentIdParam) {
      setAssignmentId(assignmentIdParam);
      loadAssignmentSettings(assignmentIdParam);
    }
    
    // Load vocabulary
    setVocabulary(sampleVocabulary);
    // Set power ups if enabled
    if (gameSettings.powerUpsEnabled) {
      setAvailablePowerUps(powerUps);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [searchParams, gameSettings.powerUpsEnabled]);
  
  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up
            clearInterval(timerRef.current!);
            setGameState('timeout');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);
  
  // Effect to handle levels in survival mode
  useEffect(() => {
    if (gameSettings.survivalMode && gameState === 'playing' && streak > 0 && streak % 5 === 0) {
      // Increase level every 5 correct answers in a row
      setLevel(prev => prev + 1);
    }
  }, [streak, gameSettings.survivalMode, gameState]);
  
  // Effect to handle double points power-up
  useEffect(() => {
    if (doublePointsActive && doublePointsCount >= 3) {
      setDoublePointsActive(false);
      setDoublePointsCount(0);
    }
  }, [doublePointsActive, doublePointsCount]);
  
  // Load assignment settings
  const loadAssignmentSettings = async (id: string) => {
    // In a real app, we would fetch the assignment settings from Supabase
    // const { data, error } = await supabase
    //   .from('assignments')
    //   .select('*')
    //   .eq('id', id)
    //   .single();
    
    // if (data) {
    //   setGameSettings({
    //     timeLimit: data.time_limit * 60, // convert minutes to seconds
    //     survivalMode: data.game_config.survivalMode || false,
    //     powerUpsEnabled: data.game_config.powerUps || false,
    //     vocabularyId: data.vocabulary_list_id
    //   });
    //   
    //   // Load custom vocabulary if provided
    //   if (data.vocabulary_list_id) {
    //     loadVocabulary(data.vocabulary_list_id);
    //   }
    // }
    
    // For now, simulate loading settings
    setGameSettings({
      timeLimit: 60,
      survivalMode: Math.random() > 0.5, // randomly enable/disable
      powerUpsEnabled: Math.random() > 0.5, // randomly enable/disable
      vocabularyId: null
    });
    
    setTimeLeft(60);
    
    if (Math.random() > 0.5) {
      setAvailablePowerUps(powerUps);
    }
  };
  
  // Load vocabulary (in a real app, this would come from Supabase)
  const loadVocabulary = async (vocabularyId: string) => {
    // const { data, error } = await supabase
    //   .from('custom_wordlists')
    //   .select('words')
    //   .eq('id', vocabularyId)
    //   .single();
    
    // if (data && data.words) {
    //   const wordList = data.words.map((word: any, index: number) => ({
    //     id: `word-${index}`,
    //     word: word.term,
    //     translation: word.definition,
    //     correct: false,
    //     points: 10 + (index % 3 === 0 ? 5 : 0) // Some words worth more points
    //   }));
    //   
    //   setVocabulary(wordList);
    // }
  };
  
  // Start the game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setLives(3);
    setStreak(0);
    setDoublePointsActive(false);
    setDoublePointsCount(0);
    setTimeLeft(gameSettings.timeLimit);
    nextWord();
  };
  
  // Get next word and options
  const nextWord = () => {
    // Pick a random word from vocabulary that hasn't been used yet
    const unusedWords = vocabulary.filter(word => !word.correct);
    
    if (unusedWords.length === 0) {
      // All words used, game completed
      setGameState('completed');
      triggerConfetti();
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * unusedWords.length);
    const selectedWord = unusedWords[randomIndex];
    setCurrentWord(selectedWord);
    
    // Generate options - one correct and 3 incorrect
    const correctTranslation = selectedWord.translation;
    const incorrectOptions = vocabulary
      .filter(w => w.translation !== correctTranslation)
      .map(w => w.translation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [...incorrectOptions, correctTranslation]
      .sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
  };
  
  // Handle option selection
  const handleOptionSelect = (translation: string) => {
    if (!currentWord || gameState !== 'playing') return;
    
    const isCorrect = translation === currentWord.translation;
    
    // Launch rocket animation
    const rocketId = `rocket-${Date.now()}`;
    setRockets(prev => [...prev, {
      id: rocketId,
      word: currentWord,
      isCorrect
    }]);
    
    if (isCorrect) {
      // Update word as correct
      setVocabulary(prev => 
        prev.map(word => 
          word.id === currentWord.id ? { ...word, correct: true } : word
        )
      );
      
      // Update score
      const points = currentWord.points * (doublePointsActive ? 2 : 1) * level;
      setScore(prev => prev + points);
      
      // Update streak and double points count
      setStreak(prev => prev + 1);
      if (doublePointsActive) {
        setDoublePointsCount(prev => prev + 1);
      }
      
      // Schedule next word
      setTimeout(nextWord, 1000);
    } else {
      // Reset streak
      setStreak(0);
      
      // Deduct life in survival mode
      if (gameSettings.survivalMode) {
        setLives(prev => {
          if (prev <= 1) {
            // Game over
            setGameState('timeout');
            return 0;
          }
          return prev - 1;
        });
      }
      
      // In non-survival mode or if still has lives, continue with next word
      if (!gameSettings.survivalMode || lives > 1) {
        setTimeout(nextWord, 1000);
      }
    }
  };
  
  // Remove rocket when animation completes
  const handleRocketAnimationComplete = (rocketId: string) => {
    setRockets(prev => prev.filter(rocket => rocket.id !== rocketId));
  };
  
  // Handle power-up activation
  const activatePowerUp = (powerUpId: string) => {
    if (gameState !== 'playing') return;
    
    const powerUp = availablePowerUps.find(p => p.id === powerUpId);
    if (!powerUp || powerUp.cooldown > 0) return;
    
    switch (powerUp.type) {
      case 'superBoost':
        if (currentWord) {
          // Automatically select correct option
          handleOptionSelect(currentWord.translation);
        }
        break;
      case 'timeFreeze':
        // Pause timer for 5 seconds
        if (timerRef.current) {
          clearInterval(timerRef.current);
          
          setTimeout(() => {
            if (gameState === 'playing') {
              timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                  if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setGameState('timeout');
                    return 0;
                  }
                  return prev - 1;
                });
              }, 1000);
            }
          }, 5000);
        }
        break;
      case 'doublePoints':
        // Enable double points for next 3 correct answers
        setDoublePointsActive(true);
        setDoublePointsCount(0);
        break;
    }
    
    // Set cooldown
    setAvailablePowerUps(prev => 
      prev.map(p => 
        p.id === powerUpId ? { ...p, cooldown: 30 } : p
      )
    );
  };
  
  // Reset cooldowns
  useEffect(() => {
    if (gameState === 'playing') {
      const cooldownInterval = setInterval(() => {
        setAvailablePowerUps(prev => 
          prev.map(p => 
            p.cooldown > 0 ? { ...p, cooldown: p.cooldown - 1 } : p
          )
        );
      }, 1000);
      
      return () => clearInterval(cooldownInterval);
    }
  }, [gameState]);
  
  // Reset the game
  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setLives(3);
    setStreak(0);
    setDoublePointsActive(false);
    setDoublePointsCount(0);
    setTimeLeft(gameSettings.timeLimit);
    setGameState('ready');
    setVocabulary(sampleVocabulary.map(word => ({ ...word, correct: false })));
  };
  
  // Confetti effect on completion
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="bg-slate-800/80 rounded-xl shadow-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between backdrop-blur-sm border border-slate-700/50">
          <div className="flex items-center mb-4 md:mb-0">
            <svg 
              className="text-orange-500 mr-2 w-8 h-8" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 2L9 9H15L12 16M12 16V22M5 9L2 6M19 9L22 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <h1 className="text-2xl font-bold text-white">Word Blast</h1>
          </div>
          
          <div className="flex space-x-4 items-center">
            <div className="bg-indigo-900/50 px-3 py-1 rounded-full flex items-center border border-indigo-700">
              <Star className="text-yellow-500 mr-1" size={18} />
              <span className="font-bold text-white">{score}</span>
            </div>
            
            <div className="bg-blue-900/50 px-3 py-1 rounded-full flex items-center border border-blue-700">
              <Clock className="text-blue-400 mr-1" size={18} />
              <span className="font-bold text-white">{timeLeft}s</span>
            </div>
            
            {gameSettings.survivalMode && (
              <div className="bg-red-900/50 px-3 py-1 rounded-full flex items-center border border-red-700">
                <Shield className="text-red-400 mr-1" size={18} />
                <span className="font-bold text-white">{lives}</span>
              </div>
            )}
          </div>
        </header>
        
        {/* Game Container */}
        <div className="bg-slate-800/70 rounded-xl shadow-lg p-6 mb-6 backdrop-blur-sm border border-slate-700/50">
          {gameState === 'ready' && (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-white mb-4">Ready for Word Blast?</h2>
              <p className="text-slate-300 mb-6">
                Launch rockets with correct word translations before time runs out!
                {gameSettings.survivalMode && (
                  <span className="block mt-2 text-amber-400 font-medium">
                    Survival Mode enabled! You have {lives} lives.
                  </span>
                )}
                {gameSettings.powerUpsEnabled && (
                  <span className="block mt-2 text-cyan-400 font-medium">
                    Power-ups enabled! Use them wisely.
                  </span>
                )}
              </p>
              <button
                onClick={startGame}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-colors"
              >
                Start Game
              </button>
            </div>
          )}
          
          {gameState === 'playing' && (
            <div>
              {/* Word Display */}
              <div className="mb-8 text-center">
                <div className="mb-2 flex justify-between items-center">
                  <p className="text-sm text-slate-400">Level {level}</p>
                  <p className="text-sm text-slate-400">
                    Streak: <span className="text-amber-400">{streak}</span>
                  </p>
                </div>
                
                {currentWord && (
                  <div className="p-6 bg-indigo-900/30 rounded-lg border border-indigo-700/50 mb-8">
                    <p className="text-3xl font-bold text-white">{currentWord.word}</p>
                  </div>
                )}
                
                {/* Options */}
                <div className="grid grid-cols-2 gap-4">
                  {options.map((option, index) => (
                    <button
                      key={`option-${index}`}
                      onClick={() => handleOptionSelect(option)}
                      className="p-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-white font-medium transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Power-ups (if enabled) */}
              {gameSettings.powerUpsEnabled && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Power-ups:</h3>
                  <div className="flex justify-center gap-4">
                    {availablePowerUps.map(powerUp => (
                      <button
                        key={powerUp.id}
                        onClick={() => activatePowerUp(powerUp.id)}
                        disabled={powerUp.cooldown > 0}
                        className={`
                          p-4 rounded-full w-12 h-12 flex items-center justify-center relative
                          ${powerUp.cooldown > 0 
                            ? 'bg-slate-700 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 cursor-pointer'}
                        `}
                        title={powerUp.description}
                      >
                        <span className="text-xl">{powerUp.icon}</span>
                        {powerUp.cooldown > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {powerUp.cooldown}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Rockets animation area */}
          <div className="fixed bottom-0 left-0 right-0 h-screen pointer-events-none overflow-hidden">
            <AnimatePresence>
              {rockets.map(rocket => (
                <motion.div
                  key={rocket.id}
                  className="absolute bottom-0"
                  style={{ 
                    left: `${Math.random() * 80 + 10}%`,
                  }}
                >
                  <Rocket 
                    word={rocket.word} 
                    isCorrect={rocket.isCorrect}
                    onComplete={() => handleRocketAnimationComplete(rocket.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {gameState === 'timeout' && (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-orange-500 mb-4">
                {gameSettings.survivalMode && lives === 0 ? "Out of Lives!" : "Time's Up!"}
              </h2>
              <p className="text-slate-300 mb-4">
                You scored {score} points and reached level {level}.
              </p>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-colors flex items-center mx-auto"
              >
                <RefreshCw className="mr-2" size={18} />
                Play Again
              </button>
            </div>
          )}
          
          {gameState === 'completed' && (
            <div className="text-center py-10">
              <CheckCircle2 className="text-green-500 w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-4">All Words Mastered!</h2>
              <p className="text-slate-300 mb-4">
                Congratulations! You completed all words and scored {score} points.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <button
                  onClick={() => resetGame()}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="mr-2" size={18} />
                  Play Again
                </button>
                
                <Link href="/games" className="px-6 py-3 border border-indigo-600 text-indigo-300 rounded-lg font-medium hover:bg-indigo-950/50 transition-colors">
                  Return to Games
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Controls and Info */}
        <div className="bg-slate-800/80 rounded-xl shadow-md p-4 backdrop-blur-sm border border-slate-700/50">
          <div className="flex justify-between">
            <Link
              href={assignmentId ? `/dashboard/assignments/${assignmentId}` : '/games'}
              className="text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              {assignmentId ? 'Back to Assignment' : 'Back to Games'}
            </Link>
            
            {(gameState === 'playing' || gameState === 'completed' || gameState === 'timeout') && (
              <button
                onClick={resetGame}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Save Progress
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
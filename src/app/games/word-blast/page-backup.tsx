'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Star, 
  CheckCircle2, 
  Zap, 
  Shield,
  Award,
  Settings,
  Home,
  Gem
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WordItem, 
  PowerUp, 
  GameState, 
  GameSettings, 
  GameStats, 
  FallingGem, 
  GemType 
} from './types';
import { GemBlastEngine } from './components/GemBlastEngine';
import { GemUI } from './components/GemUI';

// Enhanced vocabulary with categories
const enhancedVocabulary: WordItem[] = [
  { id: '1', word: 'dog', translation: 'perro', correct: false, points: 10, category: 'noun' },
  { id: '2', word: 'run', translation: 'correr', correct: false, points: 15, category: 'verb' },
  { id: '3', word: 'beautiful', translation: 'hermoso', correct: false, points: 20, category: 'adjective' },
  { id: '4', word: 'quickly', translation: 'rápidamente', correct: false, points: 25, category: 'adverb' },
  { id: '5', word: 'I like horror films', translation: 'Me gustan las películas de terror', correct: false, points: 30, category: 'phrase' },
  { id: '6', word: 'cat', translation: 'gato', correct: false, points: 10, category: 'noun' },
  { id: '7', word: 'house', translation: 'casa', correct: false, points: 10, category: 'noun' },
  { id: '8', word: 'eat', translation: 'comer', correct: false, points: 15, category: 'verb' },
  { id: '9', word: 'happy', translation: 'feliz', correct: false, points: 20, category: 'adjective' },
  { id: '10', word: 'slowly', translation: 'lentamente', correct: false, points: 25, category: 'adverb' },
  { id: '11', word: 'How are you?', translation: '¿Cómo estás?', correct: false, points: 30, category: 'phrase' },
  { id: '12', word: 'book', translation: 'libro', correct: false, points: 10, category: 'noun' },
  { id: '13', word: 'write', translation: 'escribir', correct: false, points: 15, category: 'verb' },
  { id: '14', word: 'interesting', translation: 'interesante', correct: false, points: 20, category: 'adjective' },
  { id: '15', word: 'carefully', translation: 'cuidadosamente', correct: false, points: 25, category: 'adverb' },
];

// Enhanced power-ups with gem themes
const gemPowerUps: PowerUp[] = [
  {
    id: 'gemFreeze',
    type: 'gemFreeze',
    icon: '❄️',
    active: false,
    cooldown: 0,
    duration: 5000,
    description: 'Freezes all falling gems for 5 seconds',
    gemType: 'diamond'
  },
  {
    id: 'doubleGems',
    type: 'doubleGems',
    icon: '💎',
    active: false,
    cooldown: 0,
    duration: 10000,
    description: 'Doubles gem value for 10 seconds',
    gemType: 'ruby'
  },
  {
    id: 'slowMotion',
    type: 'slowMotion',
    icon: '⏰',
    active: false,
    cooldown: 0,
    duration: 8000,
    description: 'Slows down gem falling speed',
    gemType: 'sapphire'
  },
  {
    id: 'gemMagnet',
    type: 'gemMagnet',
    icon: '🧲',
    active: false,
    cooldown: 0,
    duration: 6000,
    description: 'Attracts correct gems to cursor',
    gemType: 'emerald'
  }
];

// Sample sentences for translation challenges
const challengeSentences = [
  "I like horror films",
  "The cat is sleeping",
  "We eat breakfast",
  "She runs very fast",
  "The book is interesting",
  "How are you today?",
  "The house is beautiful",
  "I write a letter",
  "They speak Spanish",
  "The weather is nice"
];

export default function GemWordBlastGame() {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 60,
    survivalMode: false,
    powerUpsEnabled: true,
    vocabularyId: null,
    difficulty: 'medium',
    gemSpeed: 100,
    maxGems: 8,
    comboMultiplier: 1.5
  });
  
  const [vocabulary, setVocabulary] = useState<WordItem[]>(enhancedVocabulary);
  const [currentSentence, setCurrentSentence] = useState<string>(challengeSentences[0]);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    gemsCollected: 0,
    gemsMissed: 0,
    accuracy: 0,
    fastestResponse: Infinity,
    totalPlayTime: 0,
    gemsByType: {
      ruby: 0,
      sapphire: 0,
      emerald: 0,
      diamond: 0,
      amethyst: 0,
      topaz: 0
    }
  });
  
  const [timeLeft, setTimeLeft] = useState(gameSettings.timeLimit);
  const [lives, setLives] = useState(3);
  const [availablePowerUps, setAvailablePowerUps] = useState<PowerUp[]>(gemPowerUps);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Initialize game
  useEffect(() => {
    const assignmentIdParam = searchParams?.get('assignment');
    if (assignmentIdParam) {
      setAssignmentId(assignmentIdParam);
      loadAssignmentSettings(assignmentIdParam);
    }
    
    // Set random sentence
    setCurrentSentence(challengeSentences[Math.floor(Math.random() * challengeSentences.length)]);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [searchParams]);
  
  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeUp();
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
  }, [gameState, isPaused]);
  
  // Load assignment settings
  const loadAssignmentSettings = async (id: string) => {
    // Simulate loading assignment settings
    setGameSettings(prev => ({
      ...prev,
      timeLimit: 90,
      survivalMode: Math.random() > 0.5,
      powerUpsEnabled: true,
      difficulty: 'medium'
    }));
    
    setTimeLeft(90);
  };
  
  // Start the game
  const startGame = () => {
    setGameState('playing');
    setGameStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      gemsCollected: 0,
      gemsMissed: 0,
      accuracy: 0,
      fastestResponse: Infinity,
      totalPlayTime: 0,
      gemsByType: {
        ruby: 0,
        sapphire: 0,
        emerald: 0,
        diamond: 0,
        amethyst: 0,
        topaz: 0
      }
    });
    setLives(3);
    setTimeLeft(gameSettings.timeLimit);
    setVocabulary(enhancedVocabulary.map(word => ({ ...word, correct: false })));
    setCurrentSentence(challengeSentences[Math.floor(Math.random() * challengeSentences.length)]);
    setIsPaused(false);
  };
  
  // Handle gem click from Phaser engine
  const handleGemClick = (gem: FallingGem) => {
    if (gem.isCorrect) {
      // Trigger success effects
      triggerSuccessEffects();
      
      // Change sentence after correct answer
      setTimeout(() => {
        setCurrentSentence(challengeSentences[Math.floor(Math.random() * challengeSentences.length)]);
      }, 1000);
    }
  };
  
  // Handle game stats update from Phaser engine
  const handleGameUpdate = (stats: GameStats) => {
    setGameStats(stats);
  };
  
  // Handle time up
  const handleTimeUp = () => {
    if (gameState === 'playing') {
      setGameState('timeout');
      if (gameStats.score > 0) {
        triggerConfetti();
      }
    }
  };
  
  // Handle power-up usage
  const handlePowerUpUse = (powerUpId: string) => {
    const powerUp = availablePowerUps.find(p => p.id === powerUpId);
    if (!powerUp || powerUp.cooldown > 0) return;
    
    // Activate power-up
    setAvailablePowerUps(prev => 
      prev.map(p => 
        p.id === powerUpId 
          ? { ...p, active: true, cooldown: 30 }
          : p
      )
    );
    
    // Deactivate after duration
    setTimeout(() => {
      setAvailablePowerUps(prev => 
        prev.map(p => 
          p.id === powerUpId 
            ? { ...p, active: false }
            : p
        )
      );
    }, powerUp.duration);
  };
  
  // Cooldown management
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
  
  // Pause/Resume game
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState('ready');
    setGameStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      gemsCollected: 0,
      gemsMissed: 0,
      accuracy: 0,
      fastestResponse: Infinity,
      totalPlayTime: 0,
      gemsByType: {
        ruby: 0,
        sapphire: 0,
        emerald: 0,
        diamond: 0,
        amethyst: 0,
        topaz: 0
      }
    });
    setLives(3);
    setTimeLeft(gameSettings.timeLimit);
    setIsPaused(false);
    setVocabulary(enhancedVocabulary.map(word => ({ ...word, correct: false })));
    setAvailablePowerUps(gemPowerUps.map(p => ({ ...p, active: false, cooldown: 0 })));
  };
  
  // Success effects
  const triggerSuccessEffects = () => {
    // Trigger subtle confetti
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1']
    });
  };
  
  // Completion confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#98FB98']
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            animate={{
              x: [0, Math.random() * 100],
              y: [0, Math.random() * 100],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Gem className="text-orange-500 w-8 h-8" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Gem Word Blast
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {gameState === 'playing' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePause}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  {isPaused ? <Play size={20} className="text-white" /> : <Pause size={20} className="text-white" />}
                </motion.button>
              )}
              
              <Link
                href={assignmentId ? `/dashboard/assignments/${assignmentId}` : '/games'}
                className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Home size={20} />
                <span>{assignmentId ? 'Back to Assignment' : 'Back to Games'}</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Game Area */}
        <div className="pt-20 h-screen">
          {gameState === 'ready' && (
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-2xl mx-auto px-6"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-8"
                >
                  <Gem className="w-24 h-24 text-orange-500 mx-auto" />
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white mb-4">
                  Ready for Gem Word Blast?
                </h2>
                
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  Catch falling gems with correct translations to build epic combos! 
                  Each gem type represents different word categories.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
                  {[
                    { type: 'ruby', label: 'Nouns', color: 'text-red-500' },
                    { type: 'sapphire', label: 'Verbs', color: 'text-blue-500' },
                    { type: 'emerald', label: 'Adjectives', color: 'text-green-500' },
                    { type: 'amethyst', label: 'Adverbs', color: 'text-purple-500' },
                    { type: 'diamond', label: 'Phrases', color: 'text-white' },
                    { type: 'topaz', label: 'Others', color: 'text-yellow-500' }
                  ].map((gem, index) => (
                    <motion.div
                      key={gem.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-3 border border-slate-700"
                    >
                      <Gem className={`w-5 h-5 ${gem.color}`} />
                      <span className="text-slate-300 text-sm">{gem.label}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  {gameSettings.powerUpsEnabled && (
                    <p className="text-cyan-400 font-medium">
                      💎 Power-ups enabled! Use them strategically.
                    </p>
                  )}
                  
                  {gameSettings.survivalMode && (
                    <p className="text-amber-400 font-medium">
                      ⚡ Survival Mode: You have {lives} lives!
                    </p>
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="mt-8 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                >
                  <Play className="inline mr-2" size={24} />
                  Start Gem Blast
                </motion.button>
              </motion.div>
            </div>
          )}
          
          {gameState === 'playing' && (
            <div className="relative h-full">
              {/* Phaser Game Engine */}
              <GemBlastEngine
                gameSettings={gameSettings}
                vocabulary={vocabulary}
                currentSentence={currentSentence}
                onGemClick={handleGemClick}
                onGameUpdate={handleGameUpdate}
                onTimeUp={handleTimeUp}
                isPaused={isPaused}
                gameActive={true}
              />
              
              {/* Game UI Overlay */}
              <GemUI
                gameStats={gameStats}
                timeLeft={timeLeft}
                currentSentence={currentSentence}
                powerUps={availablePowerUps}
                onPowerUpUse={handlePowerUpUse}
                combo={gameStats.combo}
                lives={gameSettings.survivalMode ? lives : undefined}
                survivalMode={gameSettings.survivalMode}
              />
              
              {/* Pause Overlay */}
              <AnimatePresence>
                {isPaused && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30"
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="bg-slate-900 rounded-xl p-8 text-center border border-slate-700"
                    >
                      <Pause className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-4">Game Paused</h3>
                      <button
                        onClick={togglePause}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Resume Game
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Game Over States */}
          {(gameState === 'timeout' || gameState === 'completed') && (
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-2xl mx-auto px-6"
              >
                {gameState === 'completed' ? (
                  <CheckCircle2 className="text-green-500 w-24 h-24 mx-auto mb-6" />
                ) : (
                  <Award className="text-orange-500 w-24 h-24 mx-auto mb-6" />
                )}
                
                <h2 className="text-4xl font-bold text-white mb-4">
                  {gameState === 'completed' ? 'All Gems Collected!' : 'Time\'s Up!'}
                </h2>
                
                <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-yellow-500">
                        {gameStats.score.toLocaleString()}
                      </div>
                      <div className="text-slate-400">Score</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-500">
                        {gameStats.maxCombo}x
                      </div>
                      <div className="text-slate-400">Max Combo</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-500">
                        {gameStats.accuracy.toFixed(1)}%
                      </div>
                      <div className="text-slate-400">Accuracy</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-500">
                        {gameStats.gemsCollected}
                      </div>
                      <div className="text-slate-400">Gems</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetGame}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center"
                  >
                    <RefreshCw className="mr-2" size={18} />
                    Play Again
                  </motion.button>
                  
                  <Link 
                    href={assignmentId ? `/dashboard/assignments/${assignmentId}` : '/games'}
                    className="px-6 py-3 border border-indigo-600 text-indigo-300 rounded-lg font-medium hover:bg-indigo-950/50 transition-colors flex items-center justify-center"
                  >
                    <Home className="mr-2" size={18} />
                    {assignmentId ? 'Back to Assignment' : 'Back to Games'}
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
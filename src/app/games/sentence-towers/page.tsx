'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Flame, Clock, Trophy, Star, Settings, 
  Volume2, VolumeX, Pause, Play, RotateCcw
} from 'lucide-react';

// Enhanced Types
interface TowerBlock {
  id: string;
  type: 'standard' | 'bonus' | 'challenge' | 'fragile';
  word: string;
  translation: string;
  points: number;
  position: number;
  isShaking: boolean;
  createdAt: number;
}

interface GameState {
  status: 'ready' | 'playing' | 'paused' | 'completed' | 'failed';
  score: number;
  blocksPlaced: number;
  blocksFallen: number;
  currentHeight: number;
  maxHeight: number;
  currentLevel: number;
  accuracy: number;
  streak: number;
  multiplier: number;
  timeLeft: number;
  wordsCompleted: number;
  totalWords: number;
}

interface WordOption {
  id: string;
  word: string;
  translation: string;
  isCorrect: boolean;
  difficulty: number;
}

interface ParticleEffect {
  id: string;
  type: 'success' | 'error' | 'placement' | 'destruction' | 'combo';
  position: { x: number; y: number };
  intensity: number;
  timestamp: number;
}

interface GameSettings {
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  towerFalling: boolean;
  soundEnabled: boolean;
  showHints: boolean;
  animationSpeed: number;
}

// Enhanced vocabulary with difficulty levels
const enhancedVocabulary = [
  { id: '1', word: 'hello', translation: 'hola', difficulty: 1 },
  { id: '2', word: 'goodbye', translation: 'adiós', difficulty: 1 },
  { id: '3', word: 'thank you', translation: 'gracias', difficulty: 2 },
  { id: '4', word: 'please', translation: 'por favor', difficulty: 2 },
  { id: '5', word: 'beautiful', translation: 'hermoso', difficulty: 3 },
  { id: '6', word: 'understand', translation: 'entender', difficulty: 3 },
  { id: '7', word: 'important', translation: 'importante', difficulty: 4 },
  { id: '8', word: 'restaurant', translation: 'restaurante', difficulty: 4 },
];

// Enhanced Particle System Component
const ParticleSystem = ({ effects }: { effects: ParticleEffect[] }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {effects.map((effect) => (
        <motion.div
          key={effect.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute"
          style={{
            left: effect.position.x,
            top: effect.position.y,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {effect.type === 'success' && (
            <div className="text-green-400 text-4xl font-bold animate-bounce">
              +{effect.intensity * 10}
            </div>
          )}
          {effect.type === 'error' && (
            <div className="text-red-400 text-3xl font-bold animate-pulse">
              ❌
            </div>
          )}
          {effect.type === 'combo' && (
            <div className="text-yellow-400 text-5xl font-bold animate-pulse">
              🔥 COMBO x{effect.intensity}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced Crane Component
const AnimatedCrane = ({ 
  isLifting, 
  liftedWord, 
  onComplete,
  towerHeight 
}: {
  isLifting: boolean;
  liftedWord: string;
  onComplete: () => void;
  towerHeight: number;
}) => {
  const [phase, setPhase] = useState<'idle' | 'descending' | 'lifting' | 'moving' | 'dropping'>('idle');

  useEffect(() => {
    if (isLifting) {
      setPhase('descending');
      const sequence = async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        setPhase('lifting');
        await new Promise(resolve => setTimeout(resolve, 600));
        setPhase('moving');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPhase('dropping');
        await new Promise(resolve => setTimeout(resolve, 400));
        setPhase('idle');
        onComplete();
      };
      sequence();
    }
  }, [isLifting, onComplete]);

  return (
    <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-40">
      <motion.div
        className="relative"
        animate={{
          x: phase === 'moving' ? 0 : phase === 'descending' || phase === 'lifting' ? -120 : 0
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Crane base and mast */}
        <div className="relative">
          <div className="w-6 h-32 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-t-lg shadow-2xl border-2 border-yellow-700"></div>
          
          {/* Crane jib (horizontal arm) */}
          <div className="absolute top-4 left-6 w-32 h-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-r-lg shadow-lg border border-yellow-700"></div>
          
          {/* Crane counterweight */}
          <div className="absolute top-4 right-0 w-4 h-6 bg-gradient-to-b from-gray-600 to-gray-800 rounded shadow-lg"></div>
          
          {/* Operator cabin */}
          <div className="absolute top-8 left-2 w-8 h-4 bg-gradient-to-b from-blue-400 to-blue-600 rounded shadow-lg border border-blue-700"></div>
        </div>
        
        {/* Crane cable */}
        <motion.div
          className="absolute top-6 left-32 w-1 bg-gray-800 shadow-sm"
          animate={{
            height: phase === 'descending' ? 100 + (towerHeight * 17) : 
                   phase === 'lifting' || phase === 'moving' ? 80 + (towerHeight * 17) : 
                   50 + (towerHeight * 17)
          }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Crane hook with word */}
        <motion.div
          className="absolute left-31 bg-gray-700 w-3 h-3 rounded-full shadow-lg border border-gray-900"
          animate={{
            top: phase === 'descending' ? 106 + (towerHeight * 17) : 
                phase === 'lifting' || phase === 'moving' ? 86 + (towerHeight * 17) : 
                56 + (towerHeight * 17)
          }}
          transition={{ duration: 0.6 }}
        >
          {liftedWord && (phase === 'lifting' || phase === 'moving') && (
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-2xl border border-blue-800">
              {liftedWord}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

// Enhanced Background Component
const DynamicBackground = ({ 
  level, 
  timeOfDay, 
  weather 
}: {
  level: number;
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  weather: 'clear' | 'cloudy' | 'rain';
}) => {
  const getOverlayColor = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'bg-orange-400/20';
      case 'day':
        return 'bg-blue-400/10';
      case 'evening':
        return 'bg-orange-500/30';
      case 'night':
        return 'bg-purple-900/40';
      default:
        return 'bg-blue-400/10';
    }
  };

  return (
    <div className="absolute inset-0">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/games/sentence-towers/background.png)'
        }}
      />
      
      {/* Dynamic time overlay */}
      <div className={`absolute inset-0 ${getOverlayColor()} transition-all duration-1000`} />
      
      {/* Weather effects */}
      {weather === 'rain' && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-6 bg-blue-300/60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`
              }}
              animate={{
                y: ['0vh', '110vh']
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ImprovedSentenceTowers() {
  // Enhanced game state
  const [gameState, setGameState] = useState<GameState>({
    status: 'ready',
    score: 0,
    blocksPlaced: 0,
    blocksFallen: 0,
    currentHeight: 0,
    maxHeight: 0,
    currentLevel: 1,
    accuracy: 1,
    streak: 0,
    multiplier: 1,
    timeLeft: 120,
    wordsCompleted: 0,
    totalWords: enhancedVocabulary.length
  });

  const [settings, setSettings] = useState<GameSettings>({
    timeLimit: 120,
    difficulty: 'medium',
    towerFalling: true,
    soundEnabled: true,
    showHints: true,
    animationSpeed: 1
  });

  const [towerBlocks, setTowerBlocks] = useState<TowerBlock[]>([]);
  const [fallingBlocks, setFallingBlocks] = useState<string[]>([]);
  const [wordOptions, setWordOptions] = useState<WordOption[]>([]);
  const [currentTargetWord, setCurrentTargetWord] = useState<WordOption | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState<'correct' | 'incorrect' | null>(null);
  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);
  const [vocabulary, setVocabulary] = useState(enhancedVocabulary.map(word => ({ ...word, correct: false })));
  const [showSettings, setShowSettings] = useState(false);
  const [craneLifting, setCraneLifting] = useState(false);
  const [craneWord, setCraneWord] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const effectIdRef = useRef(0);

  // Enhanced particle effect system
  const addParticleEffect = useCallback((
    type: ParticleEffect['type'],
    position: { x: number; y: number },
    intensity: number = 1
  ) => {
    const newEffect: ParticleEffect = {
      id: `effect-${effectIdRef.current++}`,
      type,
      position,
      intensity,
      timestamp: Date.now()
    };
    
    setParticleEffects(prev => [...prev, newEffect]);
    
    // Auto-remove effect after animation
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(e => e.id !== newEffect.id));
    }, 2000);
  }, []);

  // Enhanced timer with pause functionality
  useEffect(() => {
    if (gameState.status === 'playing') {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            clearInterval(timerRef.current!);
            return { ...prev, status: 'failed', timeLeft: 0 };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.status]);

  // Enhanced word generation with difficulty scaling
  const generateWordOptions = useCallback(() => {
    const unusedWords = vocabulary.filter(word => !word.correct);
    
    // Check if all words are completed (8 words = game completion)
    if (unusedWords.length === 0 || gameState.wordsCompleted >= 8) {
      setGameState(prev => ({ ...prev, status: 'completed' }));
      return;
    }
    
    // Select words based on current level difficulty
    const levelDifficulty = Math.min(5, Math.floor(gameState.currentLevel / 2) + 1);
    const availableWords = unusedWords.filter(word => 
      word.difficulty <= levelDifficulty + 1 && word.difficulty >= levelDifficulty - 1
    );
    
    const targetWords = availableWords.length > 0 ? availableWords : unusedWords;
    const shuffled = [...targetWords].sort(() => Math.random() - 0.5);
    const targetWord = shuffled[0];
    
    setCurrentTargetWord({
      id: targetWord.id,
      word: targetWord.word,
      translation: targetWord.translation,
      isCorrect: true,
      difficulty: targetWord.difficulty
    });
    
    const incorrectOptions = shuffled.slice(1, 4);
    const allOptions = [targetWord, ...incorrectOptions].sort(() => Math.random() - 0.5);
    
    setWordOptions(allOptions.map(word => ({
      id: word.id,
      word: word.word,
      translation: word.translation,
      isCorrect: word.id === targetWord.id,
      difficulty: word.difficulty
    })));
  }, [vocabulary, gameState.currentLevel]);

  // Enhanced correct answer handling
  const handleCorrectAnswer = useCallback((option: WordOption) => {
    setVocabulary(prev => 
      prev.map(word => 
        word.id === option.id ? { ...word, correct: true } : word
      )
    );

    // Enhanced scoring with multipliers
    const basePoints = 10 + (option.difficulty * 5);
    const streakBonus = Math.floor(gameState.streak / 3) * 5;
    const levelBonus = gameState.currentLevel * 2;
    const totalPoints = Math.floor((basePoints + streakBonus + levelBonus) * gameState.multiplier);

    const newBlock: TowerBlock = {
      id: `block-${Date.now()}`,
      type: getBlockType(option.difficulty),
      word: option.word,
      translation: option.translation,
      points: totalPoints,
      position: towerBlocks.length,
      isShaking: false,
      createdAt: Date.now()
    };

    // Trigger enhanced animations
    setCraneLifting(true);
    setCraneWord(option.word);
    
    setTimeout(() => {
      setTowerBlocks(prev => [...prev, newBlock]);
      addParticleEffect('success', { x: window.innerWidth / 2, y: window.innerHeight / 2 }, gameState.multiplier);
      
      if (gameState.streak > 0 && gameState.streak % 5 === 0) {
        addParticleEffect('combo', { x: window.innerWidth / 2, y: window.innerHeight / 3 }, gameState.streak / 5);
      }
    }, 1500);

    // Update game state
    setGameState(prev => {
      const newWordsCompleted = prev.wordsCompleted + 1;
      const updatedState = {
        ...prev,
        score: prev.score + totalPoints,
        blocksPlaced: prev.blocksPlaced + 1,
        currentHeight: prev.currentHeight + 1,
        maxHeight: Math.max(prev.maxHeight, prev.currentHeight + 1),
        streak: prev.streak + 1,
        multiplier: Math.min(3, 1 + Math.floor(prev.streak / 10) * 0.5),
        wordsCompleted: newWordsCompleted,
        currentLevel: Math.floor(prev.blocksPlaced / 5) + 1
      };
      
      // Check for completion after updating
      if (newWordsCompleted >= 8) {
        return { ...updatedState, status: 'completed' };
      }
      
      return updatedState;
    });
  }, [gameState, towerBlocks, addParticleEffect]);

  // Enhanced incorrect answer handling
  const handleIncorrectAnswer = useCallback(() => {
    if (settings.towerFalling && towerBlocks.length > 0) {
      const fallCount = getDifficultySettings(settings.difficulty).fallCount;
      const blocksToFall = Math.min(fallCount, towerBlocks.length);
      const fallingIds = towerBlocks.slice(-blocksToFall).map(block => block.id);
      
      setFallingBlocks(fallingIds);
      addParticleEffect('destruction', { x: window.innerWidth / 2, y: window.innerHeight / 2 + 100 });
      
      setTimeout(() => {
        setTowerBlocks(prev => prev.filter(block => !fallingIds.includes(block.id)));
        setFallingBlocks([]);
        
        setGameState(prev => ({
          ...prev,
          blocksFallen: prev.blocksFallen + blocksToFall,
          currentHeight: prev.currentHeight - blocksToFall,
          streak: 0,
          multiplier: 1,
          accuracy: prev.blocksPlaced > 0 ? (prev.blocksPlaced - prev.blocksFallen) / prev.blocksPlaced : 1
        }));
      }, 1000);
    } else {
      addParticleEffect('error', { x: window.innerWidth / 2, y: window.innerHeight / 2 });
      setGameState(prev => ({ ...prev, streak: 0, multiplier: 1 }));
    }
  }, [settings, towerBlocks, addParticleEffect]);

  // Enhanced option selection
  const handleSelectOption = useCallback((option: WordOption) => {
    if (gameState.status !== 'playing' || selectedOption) return;
    
    setSelectedOption(option.id);
    setFeedbackVisible(option.isCorrect ? 'correct' : 'incorrect');
    
    if (option.isCorrect) {
      handleCorrectAnswer(option);
    } else {
      handleIncorrectAnswer();
    }
    
    setTimeout(() => {
      setSelectedOption(null);
      setFeedbackVisible(null);
      generateWordOptions();
    }, option.isCorrect ? 3000 : 1500);
  }, [gameState.status, selectedOption, handleCorrectAnswer, handleIncorrectAnswer, generateWordOptions]);

  // Utility functions
  const getBlockType = (difficulty: number): TowerBlock['type'] => {
    if (difficulty >= 4) return 'challenge';
    if (difficulty >= 3) return 'bonus';
    if (difficulty <= 1) return 'fragile';
    return 'standard';
  };

  const getDifficultySettings = (difficulty: GameSettings['difficulty']) => {
    const settings = {
      easy: { fallCount: 1, timeBonus: 30, optionCount: 3 },
      medium: { fallCount: 2, timeBonus: 0, optionCount: 4 },
      hard: { fallCount: 3, timeBonus: -30, optionCount: 4 },
      expert: { fallCount: 4, timeBonus: -60, optionCount: 5 }
    };
    return settings[difficulty];
  };

  const getBlockStyle = (type: TowerBlock['type'], isShaking: boolean = false) => {
    const baseStyle = isShaking ? 'animate-pulse' : '';
    const styles = {
      standard: `${baseStyle} bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-600 shadow-cyan-500/50`,
      bonus: `${baseStyle} bg-gradient-to-r from-orange-400 to-yellow-500 border-orange-600 shadow-orange-500/50`,
      challenge: `${baseStyle} bg-gradient-to-r from-red-400 to-pink-500 border-red-600 shadow-red-500/50`,
      fragile: `${baseStyle} bg-gradient-to-r from-gray-400 to-gray-600 border-gray-700 shadow-gray-500/50`
    };
    return styles[type];
  };

  const startGame = () => {
    setGameState({
      status: 'playing',
      score: 0,
      blocksPlaced: 0,
      blocksFallen: 0,
      currentHeight: 0,
      maxHeight: 0,
      currentLevel: 1,
      accuracy: 1,
      streak: 0,
      multiplier: 1,
      timeLeft: settings.timeLimit,
      wordsCompleted: 0,
      totalWords: enhancedVocabulary.length
    });
    setTowerBlocks([]);
    setFallingBlocks([]);
    setParticleEffects([]);
    setVocabulary(enhancedVocabulary.map(word => ({ ...word, correct: false })));
    generateWordOptions();
  };

  const pauseGame = () => {
    setGameState(prev => ({ 
      ...prev, 
      status: prev.status === 'playing' ? 'paused' : 'playing' 
    }));
  };

  const resetGame = () => {
    setGameState(prev => ({ ...prev, status: 'ready' }));
    setTowerBlocks([]);
    setFallingBlocks([]);
    setParticleEffects([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize word options
  useEffect(() => {
    if (gameState.status === 'playing' && wordOptions.length === 0) {
      generateWordOptions();
    }
  }, [gameState.status, wordOptions.length, generateWordOptions]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <DynamicBackground 
        level={gameState.currentLevel}
        timeOfDay={gameState.currentLevel <= 5 ? 'day' : gameState.currentLevel <= 10 ? 'evening' : 'night'}
        weather={gameState.streak > 10 ? 'clear' : 'cloudy'}
      />

      {/* Particle Effects */}
      <ParticleSystem effects={particleEffects} />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <button 
          onClick={() => window.history.back()}
          className="p-3 bg-black/30 hover:bg-black/50 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
            Sentence Towers
          </h1>
          <div className="text-sm text-white/80 mt-1">
            Level {gameState.currentLevel} • {gameState.wordsCompleted}/{gameState.totalWords} Words
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
            className="p-3 bg-black/30 hover:bg-black/50 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300"
          >
            {settings.soundEnabled ? (
              <Volume2 className="h-5 w-5 text-white" />
            ) : (
              <VolumeX className="h-5 w-5 text-white" />
            )}
          </button>
          
          {gameState.status === 'playing' && (
            <button
              onClick={pauseGame}
              className="p-3 bg-black/30 hover:bg-black/50 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300"
            >
              <Pause className="h-5 w-5 text-white" />
            </button>
          )}
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-black/30 hover:bg-black/50 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300"
          >
            <Settings className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Enhanced Game HUD */}
      <div className="relative z-20 px-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-orange-500/30">
            <div className="text-orange-400 text-sm font-bold mb-1">SCORE</div>
            <div className="text-2xl font-bold text-white">{gameState.score.toLocaleString()}</div>
            {gameState.multiplier > 1 && (
              <div className="text-xs text-yellow-400">×{gameState.multiplier.toFixed(1)} multiplier</div>
            )}
          </div>

          <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-blue-500/30">
            <div className="text-blue-400 text-sm font-bold mb-1 text-center">TIME</div>
            <div className={`text-2xl font-bold text-center ${
              gameState.timeLeft <= 30 ? 'text-red-400' : 
              gameState.timeLeft <= 60 ? 'text-orange-400' : 'text-green-400'
            }`}>
              {formatTime(gameState.timeLeft)}
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-purple-500/30">
            <div className="text-purple-400 text-sm font-bold mb-1">PROGRESS</div>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${(gameState.wordsCompleted / gameState.totalWords) * 100}%` }}
              />
            </div>
            <div className="text-white text-sm mt-1">Height: {gameState.currentHeight}</div>
          </div>

          {gameState.streak > 0 && (
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-red-500/30">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-red-400" />
                <div>
                  <div className="text-red-400 text-sm font-bold">STREAK</div>
                  <div className="text-white font-bold">{gameState.streak}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative z-10 flex justify-center items-end h-80 mb-8">
        {/* Target Word Display */}
        {currentTargetWord && gameState.status === 'playing' && (
          <div className="absolute -top-16 left-8">
            <motion.div
              key={currentTargetWord.id}
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl p-6 shadow-2xl border-4 border-orange-300"
            >
              <div className="text-center">
                <div className="text-sm font-semibold text-orange-100 mb-2">
                  Translate:
                </div>
                <div className="text-3xl font-bold text-white">
                  {currentTargetWord.word}
                </div>
                <div className="text-xs text-orange-200 mt-1">
                  Difficulty: {currentTargetWord.difficulty}/5
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Enhanced Tower with Crane */}
        <div className="flex flex-col-reverse items-center space-y-reverse space-y-1 relative">
          <AnimatedCrane
            isLifting={craneLifting}
            liftedWord={craneWord}
            towerHeight={towerBlocks.length}
            onComplete={() => {
              setCraneLifting(false);
              setCraneWord('');
            }}
          />
          
          {/* Tower Blocks */}
          {towerBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ y: -200, opacity: 0, scale: 0, rotate: -10 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                scale: 1,
                rotate: fallingBlocks.includes(block.id) ? (Math.random() > 0.5 ? 45 : -45) : 0,
                x: fallingBlocks.includes(block.id) ? (Math.random() > 0.5 ? 300 : -300) : 0
              }}
              exit={{ 
                y: 500, 
                opacity: 0, 
                scale: 0.5,
                rotate: Math.random() * 360,
                transition: { duration: 1 }
              }}
              transition={{ 
                duration: 0.8,
                delay: index * 0.1,
                type: "spring", 
                stiffness: 100 
              }}
              className={`w-48 h-16 rounded-lg border-4 shadow-2xl backdrop-blur-md relative overflow-hidden ${getBlockStyle(block.type, block.isShaking)}`}
              style={{ zIndex: towerBlocks.length - index }}
            >
              {/* Block content */}
              <div className="absolute inset-0 flex items-center justify-between p-3">
                <div className="flex-1">
                  <div className="text-white font-bold text-lg">{block.word}</div>
                  <div className="text-white/80 text-sm">{block.translation}</div>
                </div>
                <div className="text-right">
                  <div className="text-white/60 text-xs uppercase font-semibold">
                    {block.type}
                  </div>
                  <div className="text-yellow-300 font-bold">+{block.points}</div>
                </div>
              </div>
              
              {/* Block type indicator */}
              <div className="absolute top-1 right-1">
                {block.type === 'bonus' && (
                  <Star className="h-4 w-4 text-yellow-300" />
                )}
                {block.type === 'challenge' && (
                  <Trophy className="h-4 w-4 text-red-300" />
                )}
                {block.type === 'fragile' && (
                  <div className="h-3 w-3 bg-gray-400 rounded-full" />
                )}
              </div>
              
              {/* Particle trails for falling blocks */}
              {fallingBlocks.includes(block.id) && (
                <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
              )}
            </motion.div>
          ))}
          
          {/* Tower base */}
          <div className="w-60 h-8 bg-gradient-to-r from-stone-600 to-stone-800 rounded-lg border-4 border-stone-700 shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent rounded-md" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-stone-200 font-bold text-sm">
              FOUNDATION
            </div>
          </div>
        </div>
        
        {/* Tower height indicator */}
        {towerBlocks.length > 0 && (
          <div className="absolute -right-4 -top-16 bg-black/50 backdrop-blur-md rounded-xl p-4 border border-green-500/30">
            <div className="text-green-400 text-sm font-bold mb-2 text-center">HEIGHT</div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{gameState.currentHeight}</div>
              <div className="text-xs text-white/60">blocks</div>
            </div>
            {gameState.maxHeight > gameState.currentHeight && (
              <div className="text-xs text-green-400 mt-1">
                Best: {gameState.maxHeight}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Word Options */}
      {gameState.status === 'playing' && wordOptions.length > 0 && (
        <div className="relative z-20 px-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center space-x-4"
          >
            {wordOptions.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectOption(option)}
                disabled={selectedOption !== null}
                className={`
                  relative px-6 py-4 rounded-2xl border-4 backdrop-blur-md shadow-2xl transition-all duration-300 min-w-32 group
                  ${selectedOption === option.id 
                    ? option.isCorrect 
                      ? 'bg-green-500/30 border-green-400 scale-110' 
                      : 'bg-red-500/30 border-red-400 scale-110'
                    : 'bg-white/20 border-white/30 hover:bg-white/30 hover:border-white/50 hover:scale-105'
                  }
                  ${selectedOption && selectedOption !== option.id ? 'opacity-50' : ''}
                `}
              >
                <div className="text-center">
                  <div className="text-white font-bold text-lg group-hover:scale-110 transition-transform">
                    {option.translation}
                  </div>
                  {settings.showHints && (
                    <div className="text-white/60 text-xs mt-1">
                      Difficulty: {option.difficulty}/5
                    </div>
                  )}
                </div>
                
                {/* Selection feedback */}
                {selectedOption === option.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 rounded-2xl bg-white/20 border-4 border-white/50"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
          
          {/* Feedback display */}
          <AnimatePresence>
            {feedbackVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
              >
                <div className={`
                  text-6xl font-bold px-8 py-6 rounded-3xl backdrop-blur-md border-4 shadow-2xl
                  ${feedbackVisible === 'correct' 
                    ? 'text-green-400 bg-green-500/20 border-green-400' 
                    : 'text-red-400 bg-red-500/20 border-red-400'
                  }
                `}>
                  {feedbackVisible === 'correct' ? '✓ Correct!' : '✗ Wrong!'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Game State Overlays */}
      <AnimatePresence>
        {/* Start Screen */}
        {gameState.status === 'ready' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-md rounded-3xl p-12 border-4 border-orange-400/50 text-center max-w-lg mx-4"
            >
              <div className="mb-8">
                <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 mb-4">
                  Sentence Towers
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Build your tower by translating words correctly! Each correct answer adds a block to your tower. 
                  Wrong answers make blocks fall. How high can you build?
                </p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-white/70">
                  <span>Difficulty:</span>
                  <span className="capitalize font-semibold">{settings.difficulty}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Time Limit:</span>
                  <span className="font-semibold">{formatTime(settings.timeLimit)}</span>
                </div>
                <div className="flex items-center justify-between text-white/70">
                  <span>Words to Learn:</span>
                  <span className="font-semibold">{enhancedVocabulary.length}</span>
                </div>
              </div>
              
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                Start Building! 🏗️
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Pause Screen */}
        {gameState.status === 'paused' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-3xl p-8 border-4 border-blue-400/50 text-center"
            >
              <Pause className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-6">Game Paused</h2>
              <div className="space-y-4">
                <button
                  onClick={pauseGame}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Resume Game
                </button>
                <button
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Restart Game
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Completion Screen */}
        {gameState.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-3xl p-12 border-4 border-green-400/50 text-center max-w-lg mx-4"
            >
              <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-4">
                Congratulations!
              </h2>
              <p className="text-white/80 text-lg mb-8">
                You've completed all the words and built an amazing tower!
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-yellow-400 text-sm font-bold">FINAL SCORE</div>
                  <div className="text-2xl font-bold text-white">{gameState.score.toLocaleString()}</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-green-400 text-sm font-bold">MAX HEIGHT</div>
                  <div className="text-2xl font-bold text-white">{gameState.maxHeight}</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-blue-400 text-sm font-bold">ACCURACY</div>
                  <div className="text-2xl font-bold text-white">{Math.round(gameState.accuracy * 100)}%</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-purple-400 text-sm font-bold">TIME LEFT</div>
                  <div className="text-2xl font-bold text-white">{formatTime(gameState.timeLeft)}</div>
                </div>
              </div>
              
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                Play Again! 🎮
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Failure Screen */}
        {gameState.status === 'failed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl p-12 border-4 border-red-400/50 text-center max-w-lg mx-4"
            >
              <Clock className="h-20 w-20 text-red-400 mx-auto mb-6" />
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-4">
                Time's Up!
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Your tower reached {gameState.currentHeight} blocks high! Great effort!
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-yellow-400 text-sm font-bold">FINAL SCORE</div>
                  <div className="text-2xl font-bold text-white">{gameState.score.toLocaleString()}</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-green-400 text-sm font-bold">WORDS LEARNED</div>
                  <div className="text-2xl font-bold text-white">{gameState.wordsCompleted}</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-blue-400 text-sm font-bold">ACCURACY</div>
                  <div className="text-2xl font-bold text-white">{Math.round(gameState.accuracy * 100)}%</div>
                </div>
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="text-purple-400 text-sm font-bold">BEST STREAK</div>
                  <div className="text-2xl font-bold text-white">{gameState.streak}</div>
                </div>
              </div>
              
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 hover:scale-105 shadow-2xl"
              >
                Try Again! 🔄
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md rounded-3xl p-8 border-4 border-gray-600/50 max-w-md mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={settings.difficulty}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      difficulty: e.target.value as GameSettings['difficulty'] 
                    }))}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="easy">Easy (1 block falls)</option>
                    <option value="medium">Medium (2 blocks fall)</option>
                    <option value="hard">Hard (3 blocks fall)</option>
                    <option value="expert">Expert (4 blocks fall)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Time Limit (seconds)
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="300"
                    step="30"
                    value={settings.timeLimit}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      timeLimit: parseInt(e.target.value) 
                    }))}
                    className="w-full"
                  />
                  <div className="text-center text-white/60 text-sm mt-1">
                    {formatTime(settings.timeLimit)}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between">
                    <span className="text-white/80 text-sm font-semibold">Tower Falling</span>
                    <input
                      type="checkbox"
                      checked={settings.towerFalling}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        towerFalling: e.target.checked 
                      }))}
                      className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-white/80 text-sm font-semibold">Show Hints</span>
                    <input
                      type="checkbox"
                      checked={settings.showHints}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        showHints: e.target.checked 
                      }))}
                      className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-white/80 text-sm font-semibold">Sound Effects</span>
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={(e) => setSettings(prev => ({ 
                        ...prev, 
                        soundEnabled: e.target.checked 
                      }))}
                      className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
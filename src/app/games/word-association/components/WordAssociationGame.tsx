'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Link from 'next/link';

// Game Modes
type GameMode = 'classic' | 'speed' | 'chain' | 'memory' | 'battle' | 'survival';

// Power-ups
type PowerUp = 'freeze_time' | 'reveal_hint' | 'double_points' | 'skip_round' | 'word_magnet';

interface WordAssociationGameProps {
  difficulty: string;
  category: string;
  language: string;
  gameMode: GameMode;
  customWords?: string;
  onBackToMenu: () => void;
  onGameComplete: (score: number) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface GameStats {
  score: number;
  streak: number;
  multiplier: number;
  combo: number;
  powerUps: PowerUp[];
  achievements: Achievement[];
  timeBonus: number;
  perfectRounds: number;
}

// Enhanced word database with semantic relationships and difficulty ratings
const ENHANCED_WORD_ASSOCIATIONS = {
  general: {
    english: [
      {
        prompt: 'ocean',
        related: {
          strong: ['water', 'waves', 'sea', 'blue'],
          medium: ['fish', 'salt', 'deep', 'swim'],
          weak: ['vacation', 'boat', 'beach', 'horizon']
        },
        unrelated: ['desert', 'mountain', 'computer', 'library', 'pizza', 'telephone', 'bicycle', 'rainbow'],
        difficulty: 0.6,
        themes: ['nature', 'water', 'environment']
      },
      {
        prompt: 'fire',
        related: {
          strong: ['flame', 'heat', 'burn', 'red'],
          medium: ['smoke', 'ash', 'warm', 'light'],
          weak: ['camping', 'candle', 'dragon', 'energy']
        },
        unrelated: ['ice', 'ocean', 'book', 'telephone', 'bicycle', 'flower', 'cloud', 'music'],
        difficulty: 0.5,
        themes: ['elements', 'energy', 'danger']
      },
      {
        prompt: 'music',
        related: {
          strong: ['sound', 'song', 'rhythm', 'melody'],
          medium: ['dance', 'beat', 'harmony', 'instrument'],
          weak: ['concert', 'radio', 'emotion', 'art']
        },
        unrelated: ['silence', 'book', 'computer', 'food', 'car', 'mountain', 'telephone', 'bicycle'],
        difficulty: 0.7,
        themes: ['art', 'sound', 'entertainment']
      },
      {
        prompt: 'dream',
        related: {
          strong: ['sleep', 'night', 'mind', 'fantasy'],
          medium: ['imagination', 'subconscious', 'vision', 'hope'],
          weak: ['pillow', 'story', 'future', 'wish']
        },
        unrelated: ['reality', 'computer', 'food', 'bicycle', 'telephone', 'mountain', 'ocean', 'fire'],
        difficulty: 0.8,
        themes: ['psychology', 'abstract', 'mind']
      },
      {
        prompt: 'time',
        related: {
          strong: ['clock', 'hour', 'minute', 'second'],
          medium: ['past', 'future', 'present', 'duration'],
          weak: ['history', 'age', 'schedule', 'deadline']
        },
        unrelated: ['space', 'color', 'taste', 'texture', 'weight', 'temperature', 'sound', 'smell'],
        difficulty: 0.9,
        themes: ['abstract', 'physics', 'concept']
      }
    ]
  },
  // Add more categories...
};

// Achievement definitions
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_perfect',
    title: 'Perfect Vision',
    description: 'Get a perfect score on your first round',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a round in under 5 seconds',
    icon: '⚡',
    unlocked: false
  },
  {
    id: 'chain_master',
    title: 'Chain Master',
    description: 'Create a 10-word association chain',
    icon: '🔗',
    unlocked: false
  },
  {
    id: 'combo_king',
    title: 'Combo King',
    description: 'Achieve a 5x combo multiplier',
    icon: '👑',
    unlocked: false
  },
  {
    id: 'power_user',
    title: 'Power User',
    description: 'Use all power-ups in a single game',
    icon: '💎',
    unlocked: false
  }
];

// Power-up effects
const POWER_UPS = {
  freeze_time: {
    name: 'Time Freeze',
    icon: '❄️',
    description: 'Freezes the timer for 10 seconds',
    cost: 50
  },
  reveal_hint: {
    name: 'Word Hint',
    icon: '💡',
    description: 'Reveals one correct association',
    cost: 30
  },
  double_points: {
    name: 'Double Points',
    icon: '2️⃣',
    description: 'Double points for next round',
    cost: 75
  },
  skip_round: {
    name: 'Skip Round',
    icon: '⏭️',
    description: 'Skip to the next round',
    cost: 100
  },
  word_magnet: {
    name: 'Word Magnet',
    icon: '🧲',
    description: 'Attracts correct words visually',
    cost: 40
  }
};

// Particle effects system
const createParticleEffect = (type: 'success' | 'combo' | 'perfect' | 'powerup', element?: HTMLElement) => {
  const particleConfigs = {
    success: {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#34D399', '#6EE7B7']
    },
    combo: {
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
      shapes: ['star']
    },
    perfect: {
      particleCount: 200,
      spread: 120,
      origin: { y: 0.4 },
      colors: ['#F59E0B', '#FBBF24', '#FCD34D'],
      gravity: 0.5,
      drift: 1
    },
    powerup: {
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#EF4444', '#F87171', '#FCA5A5'],
      scalar: 1.2
    }
  };

  const config = particleConfigs[type];
  confetti(config);
};

// Sound system
class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    const soundFiles = {
      select: '/sounds/select.mp3',
      correct: '/sounds/correct.mp3',
      wrong: '/sounds/wrong.mp3',
      combo: '/sounds/combo.mp3',
      powerup: '/sounds/powerup.mp3',
      perfect: '/sounds/perfect.mp3',
      tick: '/sounds/tick.mp3'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      this.sounds[key] = new Audio(path);
      this.sounds[key].volume = 0.3;
    });
  }

  play(sound: string) {
    if (this.sounds[sound]) {
      this.sounds[sound].currentTime = 0;
      this.sounds[sound].play().catch(() => {
        // Ignore audio play errors
      });
    }
  }
}

// Enhanced word option component with advanced animations
const EnhancedWordOption = React.memo(({ 
  word, 
  isSelected, 
  isCorrect,
  isRevealed,
  strength,
  onSelect,
  disabled,
  magnetEffect 
}: { 
  word: string; 
  isSelected: boolean;
  isCorrect?: boolean;
  isRevealed?: boolean;
  strength?: 'strong' | 'medium' | 'weak';
  onSelect: (word: string) => void;
  disabled?: boolean;
  magnetEffect?: boolean;
}) => {
  const variants = {
    initial: { scale: 0.9, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    selected: { scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
    correct: { scale: 1.1, backgroundColor: '#10B981', color: 'white' },
    incorrect: { scale: 0.95, backgroundColor: '#EF4444', color: 'white' },
    magnet: { scale: 1.1, boxShadow: '0 0 30px rgba(249, 115, 22, 0.8)' }
  };

  return (
    <motion.button
      onClick={() => !disabled && onSelect(word)}
      className={`
        relative word-option p-4 rounded-xl font-medium transition-all duration-300
        ${isSelected ? 'bg-purple-500 text-white' : 'bg-white text-gray-700 hover:bg-purple-50'}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-lg'}
        ${isRevealed && isCorrect ? 'bg-green-500 text-white' : ''}
        ${isRevealed && !isCorrect ? 'bg-red-500 text-white' : ''}
        ${strength === 'strong' ? 'border-2 border-green-400' : ''}
        ${strength === 'medium' ? 'border-2 border-yellow-400' : ''}
        ${strength === 'weak' ? 'border-2 border-orange-400' : ''}
      `}
      variants={variants}
      initial="initial"
      animate={
        magnetEffect ? 'magnet' :
        isRevealed && isCorrect ? 'correct' :
        isRevealed && !isCorrect ? 'incorrect' :
        isSelected ? 'selected' : 'animate'
      }
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {word}
      {isRevealed && isCorrect && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
});

EnhancedWordOption.displayName = 'EnhancedWordOption';
export default function WordAssociationGame({ 
  difficulty, 
  category, 
  language,
  gameMode = 'classic', 
  customWords,
  onBackToMenu, 
  onGameComplete 
}: WordAssociationGameProps) {
  // Enhanced game state
  const [currentRound, setCurrentRound] = useState(0);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    multiplier: 1,
    combo: 0,
    powerUps: [],
    achievements: [...ACHIEVEMENTS],
    timeBonus: 0,
    perfectRounds: 0
  });
  const [promptWord, setPromptWord] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [correctWords, setCorrectWords] = useState<{ word: string; strength: 'strong' | 'medium' | 'weak' }[]>([]);
  const [gamePhase, setGamePhase] = useState<'playing' | 'feedback' | 'complete' | 'powerup'>('playing');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePowerUp, setActivePowerUp] = useState<PowerUp | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [magnetEffect, setMagnetEffect] = useState(false);
  const [frozenTime, setFrozenTime] = useState(false);
  const [chainWords, setChainWords] = useState<string[]>([]);
  
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const soundManager = useRef(new SoundManager());

  const MAX_ROUNDS = gameMode === 'survival' ? 999 : 15;
  const BASE_TIME = gameMode === 'speed' ? 15 : gameMode === 'survival' ? 45 : 30;

  // Dynamic difficulty scaling
  const getDifficultyMultiplier = () => {
    const baseMultipliers = { easy: 0.8, medium: 1.0, hard: 1.3 };
    const streakBonus = Math.min(gameStats.streak * 0.1, 0.5);
    return baseMultipliers[difficulty as keyof typeof baseMultipliers] + streakBonus;
  };

  // Enhanced word selection logic
  const getPromptAndOptions = useCallback(() => {
    const wordSets = ENHANCED_WORD_ASSOCIATIONS.general.english;
    const randomWord = wordSets[Math.floor(Math.random() * wordSets.length)];
    
    // Adjust difficulty based on game progression
    const difficultyMultiplier = getDifficultyMultiplier();
    const filteredWords = wordSets.filter(w => w.difficulty <= difficultyMultiplier);
    
    const selectedWord = filteredWords.length > 0 
      ? filteredWords[Math.floor(Math.random() * filteredWords.length)]
      : randomWord;
    
    return selectedWord;
  }, [difficulty, gameStats.streak]);

  // Timer system with freeze capability
  useEffect(() => {
    if (gamePhase === 'playing' && timeLeft > 0 && !frozenTime) {
      const newTimer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endRound();
            return 0;
          }
          
          // Warning sound at 5 seconds
          if (prev === 6) {
            soundManager.current.play('tick');
          }
          
          return prev - 1;
        });
      }, 1000);
      
      setTimer(newTimer);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, gamePhase, frozenTime]);

  // Initialize game
  useEffect(() => {
    resetRound();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const resetRound = useCallback(() => {
    const wordData = getPromptAndOptions();
    
    setPromptWord(wordData.prompt);
    setSelectedOptions([]);
    setGamePhase('playing');
    setTimeLeft(BASE_TIME);
    setShowHint(false);
    setMagnetEffect(false);
    
    // Create word options with strength ratings
    const strongWords = Object.entries(wordData.related.strong).map(([word]) => ({ word, strength: 'strong' as const }));
    const mediumWords = Object.entries(wordData.related.medium).map(([word]) => ({ word, strength: 'medium' as const }));
    const weakWords = Object.entries(wordData.related.weak).map(([word]) => ({ word, strength: 'weak' as const }));
    
    const correctWordsList = [...strongWords, ...mediumWords, ...weakWords];
    setCorrectWords(correctWordsList);
    
    // Select words based on difficulty and game mode
    const numCorrect = gameMode === 'speed' ? 3 : gameMode === 'chain' ? 4 : difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
    const selectedCorrect = correctWordsList.slice(0, numCorrect);
    
    // Add unrelated words
    const unrelatedWords = wordData.unrelated.slice(0, 8 - numCorrect);
    
    const allOptions = [
      ...selectedCorrect.map(w => w.word),
      ...unrelatedWords
    ].sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
  }, [gameMode, difficulty, BASE_TIME, getPromptAndOptions]);

  // Enhanced word selection
  const handleWordSelect = useCallback((word: string) => {
    if (gamePhase !== 'playing') return;
    
    soundManager.current.play('select');
    
    setSelectedOptions(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      }
      
      const maxSelections = gameMode === 'speed' ? 3 : gameMode === 'chain' ? 4 : difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
      
      if (prev.length < maxSelections) {
        return [...prev, word];
      }
      return prev;
    });
  }, [gamePhase, difficulty, gameMode]);

  // Power-up system
  const usePowerUp = useCallback((powerUp: PowerUp) => {
    if (!gameStats.powerUps.includes(powerUp) || activePowerUp) return;
    
    soundManager.current.play('powerup');
    setActivePowerUp(powerUp);
    
    switch (powerUp) {
      case 'freeze_time':
        setFrozenTime(true);
        setTimeout(() => setFrozenTime(false), 10000);
        break;
      case 'reveal_hint':
        setShowHint(true);
        break;
      case 'double_points':
        setGameStats(prev => ({ ...prev, multiplier: prev.multiplier * 2 }));
        break;
      case 'word_magnet':
        setMagnetEffect(true);
        setTimeout(() => setMagnetEffect(false), 5000);
        break;
      case 'skip_round':
        nextRound();
        break;
    }
    
    // Remove used power-up
    setGameStats(prev => ({
      ...prev,
      powerUps: prev.powerUps.filter(p => p !== powerUp)
    }));
    
    setTimeout(() => setActivePowerUp(null), 2000);
  }, [gameStats.powerUps, activePowerUp]);

  // Enhanced scoring system
  const calculateScore = (correctCount: number, timeBonus: number, isChain: boolean = false) => {
    const baseScore = correctCount * 10;
    const multiplierBonus = baseScore * (gameStats.multiplier - 1);
    const streakBonus = gameStats.streak * 5;
    const chainBonus = isChain ? correctCount * 20 : 0;
    
    return Math.round(baseScore + multiplierBonus + timeBonus + streakBonus + chainBonus);
  };

  // Enhanced round completion
  const endRound = useCallback(() => {
    setGamePhase('feedback');
    
    const correctlySelected = selectedOptions.filter(word => 
      correctWords.some(cw => cw.word === word)
    );
    
    const timeBonus = Math.max(0, timeLeft * 2);
    const isPerfect = correctlySelected.length === correctWords.length && selectedOptions.length === correctWords.length;
    const isChain = gameMode === 'chain' && correctlySelected.length >= 3;
    
    const roundScore = calculateScore(correctlySelected.length, timeBonus, isChain);
    
    // Update game stats
    setGameStats(prev => ({
      ...prev,
      score: prev.score + roundScore,
      streak: correctlySelected.length > 0 ? prev.streak + 1 : 0,
      combo: isPerfect ? prev.combo + 1 : 0,
      perfectRounds: isPerfect ? prev.perfectRounds + 1 : prev.perfectRounds,
      timeBonus: prev.timeBonus + timeBonus
    }));

    // Chain mode logic
    if (gameMode === 'chain' && correctlySelected.length > 0) {
      setChainWords(prev => [...prev, ...correctlySelected]);
    }

    // Play appropriate sound and effects
    if (isPerfect) {
      soundManager.current.play('perfect');
      createParticleEffect('perfect');
    } else if (correctlySelected.length > 0) {
      soundManager.current.play('correct');
      createParticleEffect('success');
      
      if (gameStats.combo > 2) {
        soundManager.current.play('combo');
        createParticleEffect('combo');
      }
    } else {
      soundManager.current.play('wrong');
    }

    // Award power-ups based on performance
    if (isPerfect && Math.random() < 0.3) {
      const availablePowerUps = Object.keys(POWER_UPS) as PowerUp[];
      const randomPowerUp = availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];
      setGameStats(prev => ({
        ...prev,
        powerUps: [...prev.powerUps, randomPowerUp]
      }));
      createParticleEffect('powerup');
    }

    // Continue to next round
    setTimeout(() => {
      nextRound();
    }, 3000);
  }, [selectedOptions, correctWords, timeLeft, gameMode, gameStats.combo, calculateScore]);

  const nextRound = () => {
    if (currentRound >= MAX_ROUNDS - 1 || (gameMode === 'survival' && gameStats.streak === 0 && currentRound > 5)) {
      endGame();
    } else {
      setCurrentRound(prev => prev + 1);
      resetRound();
    }
  };

  const endGame = () => {
    setGamePhase('complete');
    onGameComplete(gameStats.score);
    
    soundManager.current.play('perfect');
    
    // Massive celebration for high scores
    if (gameStats.score > 500) {
      setTimeout(() => createParticleEffect('perfect'), 0);
      setTimeout(() => createParticleEffect('combo'), 500);
      setTimeout(() => createParticleEffect('success'), 1000);
    }
  };

  const playAgain = () => {
    setCurrentRound(0);
    setGameStats({
      score: 0,
      streak: 0,
      multiplier: 1,
      combo: 0,
      powerUps: [],
      achievements: [...ACHIEVEMENTS],
      timeBonus: 0,
      perfectRounds: 0
    });
    setChainWords([]);
    resetRound();
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      gameContainerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={gameContainerRef} className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500 rounded-full blur-xl"
          animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link href="#" onClick={onBackToMenu} className="flex items-center text-white/80 hover:text-white transition-colors">
            <span className="mr-2">←</span> Back to Menu
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium bg-white/10 px-3 py-1 rounded-full">
              {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Mode
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white/80 hover:text-white transition-colors"
            >
              {isFullscreen ? '⤋' : '⤢'}
            </button>
          </div>
        </div>

        {/* Enhanced HUD */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm opacity-80">Score</div>
            <div className="text-2xl font-bold text-yellow-400">{gameStats.score.toLocaleString()}</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm opacity-80">Streak</div>
            <div className="text-2xl font-bold text-green-400">{gameStats.streak}</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm opacity-80">Multiplier</div>
            <div className="text-2xl font-bold text-purple-400">{gameStats.multiplier}x</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-sm opacity-80">Time</div>
            <div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
              {frozenTime ? '❄️' : timeLeft}s
            </div>
          </motion.div>
        </div>

        {/* Power-ups Bar */}
        {gameStats.powerUps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm opacity-80 mb-2 text-center">Power-ups</div>
              <div className="flex gap-2">
                {gameStats.powerUps.map((powerUp, index) => (
                  <motion.button
                    key={`${powerUp}-${index}`}
                    onClick={() => usePowerUp(powerUp)}
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={activePowerUp !== null}
                  >
                    {POWER_UPS[powerUp].icon}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Game Content */}
        <AnimatePresence mode="wait">
          {gamePhase === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              {/* Chain Mode - Show chain */}
              {gameMode === 'chain' && chainWords.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm opacity-80 mb-2">Word Chain:</div>
                  <div className="flex justify-center items-center gap-2 flex-wrap">
                    {chainWords.map((word, index) => (
                      <React.Fragment key={word}>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{word}</span>
                        {index < chainWords.length - 1 && <span className="text-purple-400">→</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Find words related to:
              </h2>
              
              <motion.div 
                className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-8"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {promptWord}
              </motion.div>

              {/* Word Options Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
                {options.map((word, index) => {
                  const correctWord = correctWords.find(cw => cw.word === word);
                  const isCorrect = !!correctWord;
                  const shouldShowHint = showHint && isCorrect;
                  const shouldMagnet = magnetEffect && isCorrect;
                  
                  return (
                    <motion.div
                      key={word}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EnhancedWordOption
                        word={word}
                        isSelected={selectedOptions.includes(word)}
                        isCorrect={isCorrect}
                        isRevealed={shouldShowHint}
                        strength={correctWord?.strength}
                        onSelect={handleWordSelect}
                        disabled={gamePhase !== 'playing'}
                        magnetEffect={shouldMagnet}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={endRound}
                disabled={selectedOptions.length === 0}
                className={`
                  px-8 py-4 rounded-xl font-bold text-xl transition-all duration-300
                  ${selectedOptions.length > 0 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 shadow-lg hover:shadow-xl' 
                    : 'bg-gray-600 cursor-not-allowed opacity-50'}
                `}
                whileHover={selectedOptions.length > 0 ? { scale: 1.05 } : {}}
                whileTap={selectedOptions.length > 0 ? { scale: 0.95 } : {}}
              >
                Submit Answers {selectedOptions.length > 0 && `(${selectedOptions.length})`}
              </motion.button>
            </motion.div>
          )}

          {gamePhase === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-3xl font-bold mb-4">Round Complete!</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-sm opacity-80">Correct</div>
                    <div className="text-2xl font-bold text-green-400">
                      {selectedOptions.filter(word => correctWords.some(cw => cw.word === word)).length}
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-sm opacity-80">Time Bonus</div>
                    <div className="text-2xl font-bold text-blue-400">+{Math.max(0, timeLeft * 2)}</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-sm opacity-80">Round Score</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {calculateScore(
                        selectedOptions.filter(word => correctWords.some(cw => cw.word === word)).length,
                        Math.max(0, timeLeft * 2)
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <p className="text-lg mb-2">Correct associations:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {correctWords.map(({ word, strength }) => (
                      <span
                        key={word}
                        className={`px-3 py-1 rounded-full text-sm ${
                          strength === 'strong' ? 'bg-green-500' :
                          strength === 'medium' ? 'bg-yellow-500' : 'bg-orange-500'
                        }`}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {gamePhase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h2 className="text-4xl font-bold mb-6">Game Complete! 🎉</h2>
                
                <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-6">
                  {gameStats.score.toLocaleString()}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-sm opacity-80">Best Streak</div>
                    <div className="text-xl font-bold text-green-400">{gameStats.streak}</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-sm opacity-80">Perfect Rounds</div>
                    <div className="text-xl font-bold text-purple-400">{gameStats.perfectRounds}</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-sm opacity-80">Time Bonus</div>
                    <div className="text-xl font-bold text-blue-400">{gameStats.timeBonus}</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-sm opacity-80">Accuracy</div>
                    <div className="text-xl font-bold text-yellow-400">
                      {Math.round((gameStats.score / (MAX_ROUNDS * 100)) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Chain Mode Summary */}
                {gameMode === 'chain' && chainWords.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-3">Your Word Chain:</h3>
                    <div className="flex justify-center items-center gap-2 flex-wrap">
                      {chainWords.map((word, index) => (
                        <React.Fragment key={`${word}-${index}`}>
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-sm font-medium">
                            {word}
                          </span>
                          {index < chainWords.length - 1 && <span className="text-purple-400">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <motion.button
                    onClick={playAgain}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 px-8 py-3 rounded-xl font-bold transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Play Again
                  </motion.button>
                  <motion.button
                    onClick={onBackToMenu}
                    className="bg-white/20 hover:bg-white/30 px-8 py-3 rounded-xl font-bold transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back to Menu
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="fixed bottom-0 left-0 right-0 h-2 bg-black/20">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${(currentRound / MAX_ROUNDS) * 100}%` }}
            layoutId="progress"
          />
        </div>

        {/* Active Power-up Indicator */}
        <AnimatePresence>
          {activePowerUp && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-8 z-50"
            >
              <div className="text-6xl">{POWER_UPS[activePowerUp].icon}</div>
              <div className="text-xl font-bold text-center mt-2">{POWER_UPS[activePowerUp].name}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
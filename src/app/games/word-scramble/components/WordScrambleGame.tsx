'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Link from 'next/link';

// Game Modes
type GameMode = 'classic' | 'blitz' | 'marathon' | 'timed_attack' | 'word_storm' | 'zen';

// Power-ups
type PowerUp = 'shuffle_letters' | 'reveal_vowels' | 'show_length' | 'freeze_time' | 'double_points' | 'word_hints';

// Game Difficulties
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface GameSettings {
  difficulty: Difficulty;
  category: string;
  language: string;
  gameMode: GameMode;
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
  wordsCompleted: number;
  perfectWords: number;
  powerUps: PowerUp[];
  achievements: Achievement[];
  timeBonus: number;
  consecutiveCorrect: number;
  letterAccuracy: number;
  avgSolveTime: number;
}

// Enhanced word database with categories, difficulties, and themes
const ENHANCED_WORD_DATABASE = {
  animals: {
    english: [
      { word: 'elephant', hint: 'Large gray mammal with trunk', difficulty: 0.7, theme: 'safari', points: 80 },
      { word: 'butterfly', hint: 'Colorful flying insect', difficulty: 0.8, theme: 'insects', points: 90 },
      { word: 'penguin', hint: 'Black and white bird from Antarctica', difficulty: 0.6, theme: 'birds', points: 70 },
      { word: 'octopus', hint: 'Eight-armed sea creature', difficulty: 0.8, theme: 'ocean', points: 80 },
      { word: 'kangaroo', hint: 'Hopping Australian animal', difficulty: 0.9, theme: 'marsupials', points: 90 },
      { word: 'dolphin', hint: 'Intelligent marine mammal', difficulty: 0.7, theme: 'ocean', points: 70 },
      { word: 'tiger', hint: 'Orange striped big cat', difficulty: 0.5, theme: 'cats', points: 50 },
      { word: 'giraffe', hint: 'Tallest land animal', difficulty: 0.7, theme: 'safari', points: 70 }
    ],
    spanish: [
      { word: 'elefante', hint: 'Mamífero grande y gris con trompa', difficulty: 0.7, theme: 'safari', points: 80 },
      { word: 'mariposa', hint: 'Insecto colorido que vuela', difficulty: 0.8, theme: 'insects', points: 90 },
      { word: 'pingüino', hint: 'Ave blanca y negra de la Antártida', difficulty: 0.8, theme: 'birds', points: 80 },
      { word: 'pulpo', hint: 'Criatura marina de ocho brazos', difficulty: 0.6, theme: 'ocean', points: 60 },
      { word: 'canguro', hint: 'Animal australiano que salta', difficulty: 0.8, theme: 'marsupials', points: 80 },
      { word: 'delfín', hint: 'Mamífero marino inteligente', difficulty: 0.7, theme: 'ocean', points: 70 },
      { word: 'tigre', hint: 'Felino grande con rayas naranjas', difficulty: 0.6, theme: 'cats', points: 60 },
      { word: 'jirafa', hint: 'Animal terrestre más alto', difficulty: 0.7, theme: 'safari', points: 70 }
    ]
  },
  space: {
    english: [
      { word: 'galaxy', hint: 'Collection of billions of stars', difficulty: 0.7, theme: 'cosmos', points: 70 },
      { word: 'asteroid', hint: 'Rocky object orbiting the sun', difficulty: 0.8, theme: 'objects', points: 80 },
      { word: 'nebula', hint: 'Colorful cloud of gas in space', difficulty: 0.9, theme: 'phenomena', points: 90 },
      { word: 'satellite', hint: 'Object orbiting a planet', difficulty: 0.8, theme: 'technology', points: 80 },
      { word: 'comet', hint: 'Icy body with a tail', difficulty: 0.6, theme: 'objects', points: 60 },
      { word: 'planet', hint: 'Large body orbiting a star', difficulty: 0.5, theme: 'bodies', points: 50 },
      { word: 'meteor', hint: 'Shooting star', difficulty: 0.7, theme: 'phenomena', points: 70 },
      { word: 'universe', hint: 'Everything that exists', difficulty: 0.8, theme: 'cosmos', points: 80 }
    ]
  },
  technology: {
    english: [
      { word: 'algorithm', hint: 'Step-by-step problem-solving process', difficulty: 0.9, theme: 'programming', points: 100 },
      { word: 'database', hint: 'Organized collection of information', difficulty: 0.8, theme: 'data', points: 80 },
      { word: 'internet', hint: 'Global network of computers', difficulty: 0.7, theme: 'network', points: 70 },
      { word: 'software', hint: 'Computer programs and applications', difficulty: 0.7, theme: 'programming', points: 70 },
      { word: 'artificial', hint: 'Man-made intelligence', difficulty: 0.9, theme: 'ai', points: 90 },
      { word: 'quantum', hint: 'Smallest unit of energy', difficulty: 1.0, theme: 'physics', points: 110 },
      { word: 'blockchain', hint: 'Distributed ledger technology', difficulty: 1.0, theme: 'crypto', points: 120 },
      { word: 'cybersecurity', hint: 'Protection from digital attacks', difficulty: 1.0, theme: 'security', points: 130 }
    ]
  }
};

// Achievement definitions
const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_word', title: 'First Steps', description: 'Solve your first word', icon: '🎯', unlocked: false },
  { id: 'speed_demon', title: 'Lightning Fast', description: 'Solve a word in under 3 seconds', icon: '⚡', unlocked: false },
  { id: 'perfect_streak', title: 'Perfect Run', description: 'Get 10 words correct in a row', icon: '🔥', unlocked: false },
  { id: 'power_master', title: 'Power User', description: 'Use every power-up type', icon: '💎', unlocked: false },
  { id: 'word_wizard', title: 'Word Wizard', description: 'Solve 100 words total', icon: '🧙‍♂️', unlocked: false },
  { id: 'time_master', title: 'Time Master', description: 'Survive 5 minutes in marathon mode', icon: '⏰', unlocked: false },
  { id: 'combo_king', title: 'Combo Master', description: 'Achieve 5x score multiplier', icon: '👑', unlocked: false }
];

// Power-up definitions
const POWER_UPS = {
  shuffle_letters: { name: 'Shuffle', icon: '🔄', description: 'Shuffle scrambled letters', cost: 20 },
  reveal_vowels: { name: 'Vowels', icon: '🅰️', description: 'Highlight all vowels', cost: 30 },
  show_length: { name: 'Length', icon: '📏', description: 'Show word length', cost: 25 },
  freeze_time: { name: 'Freeze', icon: '❄️', description: 'Pause timer for 10 seconds', cost: 50 },
  double_points: { name: 'Double', icon: '2️⃣', description: 'Double points for next word', cost: 40 },
  word_hints: { name: 'Hint', icon: '💡', description: 'Show word category hint', cost: 35 }
};

// Enhanced letter component with animations
const AnimatedLetter = React.memo(({ 
  letter, 
  index, 
  isVowelRevealed,
  onClick,
  isSelected,
  canMove = true
}: {
  letter: string;
  index: number;
  isVowelRevealed?: boolean;
  onClick?: (index: number) => void;
  isSelected?: boolean;
  canMove?: boolean;
}) => {
  const isVowel = 'aeiouAEIOU'.includes(letter);
  
  return (
    <motion.button
      onClick={() => onClick?.(index)}
      className={`
        relative inline-block mx-1 px-3 py-2 text-2xl font-bold rounded-lg shadow-lg cursor-pointer
        ${isSelected ? 'bg-purple-500 text-white scale-110' : 'bg-white text-gray-800 hover:bg-gray-100'}
        ${isVowelRevealed && isVowel ? 'bg-yellow-300 text-black ring-4 ring-yellow-500' : ''}
        ${!canMove ? 'cursor-not-allowed opacity-50' : ''}
      `}
      variants={{
        initial: { scale: 0, rotate: -180, opacity: 0 },
        animate: { scale: 1, rotate: 0, opacity: 1 },
        selected: { scale: 1.1, backgroundColor: '#8B5CF6' },
        bounce: { 
          scale: [1, 1.2, 1], 
          transition: { duration: 0.3 }
        }
      }}
      initial="initial"
      animate={isSelected ? 'selected' : 'animate'}
      transition={{ delay: index * 0.1 }}
      whileHover={canMove ? { scale: 1.05 } : {}}
      whileTap={canMove ? { scale: 0.95 } : {}}
    >
      {letter.toUpperCase()}
      {isVowelRevealed && isVowel && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full"
        />
      )}
    </motion.button>
  );
});

AnimatedLetter.displayName = 'AnimatedLetter';

// Sound system
class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    const soundFiles = {
      correct: '/sounds/correct.mp3',
      wrong: '/sounds/wrong.mp3',
      powerup: '/sounds/powerup.mp3',
      complete: '/sounds/perfect.mp3',
      tick: '/sounds/tick.mp3',
      select: '/sounds/select.mp3',
      shuffle: '/sounds/select.mp3'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      this.sounds[key] = new Audio(path);
      this.sounds[key].volume = 0.4;
    });
  }

  play(sound: string) {
    if (this.sounds[sound]) {
      this.sounds[sound].currentTime = 0;
      this.sounds[sound].play().catch(() => {});
    }
  }
}

// Particle system
const createParticleEffect = (type: 'success' | 'perfect' | 'powerup' | 'streak') => {
  const configs = {
    success: {
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10B981', '#34D399', '#6EE7B7']
    },
    perfect: {
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#FBBF24', '#FCD34D']
    },
    powerup: {
      particleCount: 30,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#8B5CF6', '#A78BFA', '#C4B5FD']
    },
    streak: {
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#EF4444', '#F87171', '#FCA5A5']
    }
  };

  confetti(configs[type]);
};

// Game mode configurations
const GAME_MODE_CONFIGS = {
  classic: {
    timeLimit: 120,
    wordLimit: 20,
    description: 'Classic word scramble with time limit',
    icon: '📝'
  },
  blitz: {
    timeLimit: 60,
    wordLimit: 15,
    description: 'Fast-paced word solving',
    icon: '⚡'
  },
  marathon: {
    timeLimit: 300,
    wordLimit: 50,
    description: 'Long endurance challenge',
    icon: '🏃'
  },
  timed_attack: {
    timeLimit: 30,
    wordLimit: 10,
    description: 'Quick burst challenges',
    icon: '💥'
  },
  word_storm: {
    timeLimit: 90,
    wordLimit: 25,
    description: 'Rapid word changes',
    icon: '🌪️'
  },
  zen: {
    timeLimit: 0,
    wordLimit: 0,
    description: 'Relaxed, no pressure',
    icon: '🧘'
  }
};

// Difficulty settings
const DIFFICULTY_CONFIGS = {
  easy: { multiplier: 1, maxHints: 3, shuffleCount: 2, extraTime: 30 },
  medium: { multiplier: 1.5, maxHints: 2, shuffleCount: 3, extraTime: 15 },
  hard: { multiplier: 2, maxHints: 1, shuffleCount: 4, extraTime: 0 },
  expert: { multiplier: 3, maxHints: 0, shuffleCount: 5, extraTime: -15 }
};

interface WordScrambleGameProps {
  settings: GameSettings;
  onBackToMenu: () => void;
  onGameEnd: (result: { won: boolean; score: number; stats: GameStats }) => void;
}

type WordScrambleGameProps = {
  settings: GameSettings;
  onBackToMenu: () => void;
  onGameEnd: (result: { won: boolean; score: number; streak?: number }) => void;
};

export default function WordScrambleGame({ settings, onBackToMenu, onGameEnd }: WordScrambleGameProps) {
  // Game state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [remainingGuesses, setRemainingGuesses] = useState(DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].maxGuesses);
  const [remainingHints, setRemainingHints] = useState(DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].maxHints);
  const [timeRemaining, setTimeRemaining] = useState(DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].timeLimit);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  // Word state
  const [currentWord, setCurrentWord] = useState("");
  const [currentHint, setCurrentHint] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  
  // Audio references
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Refs for timer and fullscreen
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize game
  useEffect(() => {
    // Create audio elements
    correctSoundRef.current = new Audio('/sounds/correct.mp3');
    wrongSoundRef.current = new Audio('/sounds/wrong.mp3');
    gameOverSoundRef.current = new Audio('/sounds/gameover.mp3');
    
    // Set initial game state
    const difficultySettings = DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS];
    setRemainingGuesses(difficultySettings.maxGuesses);
    setRemainingHints(difficultySettings.maxHints);
    setTimeRemaining(difficultySettings.timeLimit);
    
    // Get the first word
    getNewWord();
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleGameOver(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Focus on input
    if (inputRef.current) inputRef.current.focus();
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  // Get a new word based on settings
  const getNewWord = () => {
    const wordList = WORD_LISTS[settings.category as keyof typeof WORD_LISTS][settings.language as 'spanish' | 'english'];
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const { word, hint } = wordList[randomIndex];
    
    setCurrentWord(word.toLowerCase());
    setCurrentHint(hint);
    setScrambledWord(scrambleWord(word.toLowerCase()));
    setUserInput("");
    setShowHint(false);
  };
  
  // Scramble a word
  const scrambleWord = (word: string): string => {
    const letters = word.split('');
    
    // Shuffle the letters
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    const scrambled = letters.join('');
    
    // If the scrambled word is the same as the original, scramble again
    return scrambled === word ? scrambleWord(word) : scrambled;
  };
  
  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value.toLowerCase());
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      // Correct answer
      if (correctSoundRef.current) correctSoundRef.current.play().catch(e => console.log("Sound play failed"));
      setScore(prev => prev + (10 * (settings.difficulty === 'advanced' ? 3 : settings.difficulty === 'intermediate' ? 2 : 1)));
      setStreak(prev => prev + 1);
      setShowCongrats(true);
      
      // Show congratulations briefly then get new word
      setTimeout(() => {
        setShowCongrats(false);
        getNewWord();
      }, 1500);
    } else {
      // Wrong answer
      if (wrongSoundRef.current) wrongSoundRef.current.play().catch(e => console.log("Sound play failed"));
      setRemainingGuesses(prev => prev - 1);
      
      if (remainingGuesses <= 1) {
        handleGameOver(false);
      }
    }
    
    setUserInput("");
  };
  
  // Handle hint button click
  const handleHint = () => {
    if (remainingHints > 0) {
      setShowHint(true);
      setRemainingHints(prev => prev - 1);
    }
  };
  
  // Handle skip button click
  const handleSkip = () => {
    setScore(prev => Math.max(0, prev - 5)); // Penalty for skipping
    getNewWord();
  };
  
  // Handle game over
  const handleGameOver = (won: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setGameOver(true);
    setGameWon(won);
    
    if (won) {
      if (correctSoundRef.current) correctSoundRef.current.play().catch(e => console.log("Sound play failed"));
    } else {
      if (gameOverSoundRef.current) gameOverSoundRef.current.play().catch(e => console.log("Sound play failed"));
    }
    
    // Report game results
    onGameEnd({
      won,
      score,
      streak
    });
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 shadow-lg rounded-lg p-6 relative" ref={gameContainerRef}>
      <div className="absolute top-4 right-4 z-10">
        <FullscreenToggle containerRef={gameContainerRef} />
      </div>
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-green-600">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Streak</p>
            <p className="text-2xl font-bold text-purple-600">{streak}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Guesses</p>
            <p className="text-2xl font-bold text-orange-600">{remainingGuesses}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Time</p>
            <p className={`text-2xl font-bold ${timeRemaining < 10 ? 'text-red-600' : 'text-blue-600'}`}>
              {formatTime(timeRemaining)}
            </p>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-center py-4 mb-6"
          >
            <h2 className="text-3xl font-bold text-green-600">Correct!</h2>
            <p className="text-gray-600">+10 points</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!gameOver ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-lg text-gray-700 mb-2">Unscramble the word:</h2>
            <motion.div
              key={scrambledWord}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-wider mb-4 min-h-16"
            >
              {scrambledWord.split('').map((letter, index) => (
                <span key={index} className="inline-block mx-1 text-green-700 bg-green-50 px-2 py-1 rounded shadow-sm">
                  {letter.toUpperCase()}
                </span>
              ))}
            </motion.div>
            
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4"
              >
                <p className="text-yellow-800">Hint: {currentHint}</p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="mb-4">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-xl"
                autoComplete="off"
              />
              <button
                type="submit"
                className="w-full mt-3 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Submit
              </button>
            </form>
            
            <div className="flex justify-between">
              <button
                onClick={handleHint}
                disabled={remainingHints <= 0}
                className={`px-4 py-2 rounded-lg font-medium ${
                  remainingHints > 0
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Hint ({remainingHints})
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
              >
                Skip (-5 pts)
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold mb-4 text-center">
            {gameWon ? (
              <span className="text-green-600">You Win!</span>
            ) : (
              <span className="text-red-600">Game Over</span>
            )}
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-xl mb-2">Final Score: <span className="font-bold text-green-600">{score}</span></p>
            <p className="text-xl">Longest Streak: <span className="font-bold text-purple-600">{streak}</span></p>
            
            {!gameWon && currentWord && (
              <p className="mt-4 text-gray-700">
                The word was: <span className="font-bold text-green-700">{currentWord.toUpperCase()}</span>
              </p>
            )}
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setScore(0);
                setStreak(0);
                setGameOver(false);
                setGameWon(false);
                
                const difficultySettings = DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS];
                setRemainingGuesses(difficultySettings.maxGuesses);
                setRemainingHints(difficultySettings.maxHints);
                setTimeRemaining(difficultySettings.timeLimit);
                
                getNewWord();
                
                timerRef.current = setInterval(() => {
                  setTimeRemaining(prev => {
                    if (prev <= 1) {
                      handleGameOver(false);
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onBackToMenu}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
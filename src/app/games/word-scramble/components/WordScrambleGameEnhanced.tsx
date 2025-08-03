'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { createClient } from '@supabase/supabase-js';
import { EnhancedGameService } from 'gems/services/enhancedGameService';
import { useGameVocabulary, GameVocabularyWord } from '../../../../hooks/useGameVocabulary';

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
  subcategory?: string;
  curriculumLevel?: 'KS3' | 'KS4';
}

interface WordScrambleGameEnhancedProps {
  settings: GameSettings;
  onGameEnd: (result: any) => void;
  onBackToMenu: () => void;
  vocabulary?: GameVocabularyWord[];
  isAssignmentMode?: boolean;
  assignmentId?: string;
  onOpenSettings?: () => void;
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

interface GameVocabularyWord {
  id: string;
  word: string;
  translation: string;
  category?: string;
  subcategory?: string;
}

interface WordScrambleGameProps {
  settings: GameSettings;
  onBackToMenu: () => void;
  onGameEnd: (result: { won: boolean; score: number; stats: GameStats }) => void;
  categoryVocabulary?: GameVocabularyWord[];
  assignmentId?: string | null;
  userId?: string;
  isAssignmentMode?: boolean;
  onOpenSettings?: () => void;
}

// Helper function to calculate letter placement accuracy
const calculateLetterAccuracy = (attempted: string, correct: string): number => {
  if (!attempted || !correct) return 0;

  const maxLength = Math.max(attempted.length, correct.length);
  let matches = 0;

  for (let i = 0; i < maxLength; i++) {
    if (attempted[i]?.toLowerCase() === correct[i]?.toLowerCase()) {
      matches++;
    }
  }

  return Math.round((matches / maxLength) * 100);
};

export default function WordScrambleGameEnhanced({
  settings,
  onBackToMenu,
  onGameEnd,
  categoryVocabulary,
  assignmentId,
  userId,
  isAssignmentMode,
  onOpenSettings
}: WordScrambleGameProps) {
  // Game state
  const [currentWordData, setCurrentWordData] = useState<any>(null);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    multiplier: 1,
    wordsCompleted: 0,
    perfectWords: 0,
    powerUps: [],
    achievements: [...ACHIEVEMENTS],
    timeBonus: 0,
    consecutiveCorrect: 0,
    letterAccuracy: 100,
    avgSolveTime: 0
  });
  
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'completed' | 'failed'>('playing');
  const [timeRemaining, setTimeRemaining] = useState(GAME_MODE_CONFIGS[settings.gameMode].timeLimit);
  const [showHint, setShowHint] = useState(false);
  const [usedPowerUps, setUsedPowerUps] = useState<Set<PowerUp>>(new Set());
  const [isVowelRevealed, setIsVowelRevealed] = useState(false);
  const [showWordLength, setShowWordLength] = useState(false);
  const [freezeTimeRemaining, setFreezeTimeRemaining] = useState(0);
  const [doublePointsActive, setDoublePointsActive] = useState(false);
  const [wordStartTime, setWordStartTime] = useState(Date.now());
  const [solveHistory, setSolveHistory] = useState<number[]>([]);
  const [comboCount, setComboCount] = useState(0);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  // Enhanced game service integration
  const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);

  // Modern vocabulary integration
  const { vocabulary: gameVocabulary, loading: vocabularyLoading } = useGameVocabulary({
    language: settings.language === 'spanish' ? 'es' : settings.language === 'french' ? 'fr' : 'en',
    categoryId: settings.category,
    subcategoryId: settings.subcategory,
    limit: 100,
    randomize: true,
    curriculumLevel: settings.curriculumLevel || 'KS3'
  });

  // Refs
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const soundManager = useRef<SoundManager>(new SoundManager());

  // Initialize game service
  useEffect(() => {
    if (userId) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const service = new EnhancedGameService(supabase);
      setGameService(service);
    }
  }, [userId]);

  // Start game session when game service is ready
  useEffect(() => {
    if (gameService && userId && !gameSessionId) {
      startGameSession();
    }
  }, [gameService, userId, gameSessionId]);

  const startGameSession = async () => {
    if (!gameService || !userId) return;

    try {
      const sessionId = await gameService.startGameSession({
        student_id: userId,
        assignment_id: assignmentId || undefined,
        game_type: 'word-scramble',
        session_mode: isAssignmentMode ? 'assignment' : 'free_play',
        max_score_possible: 1000, // Adjust based on game mode
        session_data: {
          settings,
          gameMode: settings.gameMode,
          difficulty: settings.difficulty
        }
      });
      setGameSessionId(sessionId);
      console.log('Word scramble game session started:', sessionId);
    } catch (error) {
      console.error('Failed to start word scramble game session:', error);
    }
  };

  // Get current word list
  const currentWordList = useMemo(() => {
    // Priority 1: Use provided category vocabulary (for assignment mode)
    if (categoryVocabulary && categoryVocabulary.length > 0) {
      return categoryVocabulary.map(item => ({
        word: item.word,
        hint: `Translation: ${item.translation}`,
        difficulty: 0.6,
        theme: item.category || 'general',
        points: Math.max(30, item.word.length * 10)
      }));
    }

    // Priority 2: Use modern vocabulary system
    if (gameVocabulary && gameVocabulary.length > 0) {
      return gameVocabulary.map(item => ({
        word: item.word,
        hint: `Translation: ${item.translation}`,
        difficulty: 0.6,
        theme: item.category || 'general',
        points: Math.max(30, item.word.length * 10)
      }));
    }

    // Priority 3: Fallback to hardcoded database
    const categoryData = ENHANCED_WORD_DATABASE[settings.category as keyof typeof ENHANCED_WORD_DATABASE];
    if (!categoryData) return ENHANCED_WORD_DATABASE.animals.english;

    const languageData = categoryData[settings.language as keyof typeof categoryData];
    return languageData || categoryData.english || ENHANCED_WORD_DATABASE.animals.english;
  }, [settings.category, settings.language, categoryVocabulary, gameVocabulary]);

  // Scramble word function
  const scrambleWord = useCallback((word: string): string[] => {
    const letters = word.split('');
    const difficulty = DIFFICULTY_CONFIGS[settings.difficulty];
    
    // Multiple shuffles based on difficulty
    for (let i = 0; i < difficulty.shuffleCount; i++) {
      for (let j = letters.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [letters[j], letters[k]] = [letters[k], letters[j]];
      }
    }
    
    return letters;
  }, [settings.difficulty]);

  // Enhanced game completion handler
  const handleEnhancedGameEnd = async (result: { won: boolean; score: number; stats: GameStats }) => {
    // End game session if it exists
    if (gameService && gameSessionId && userId) {
      try {
        const accuracy = result.stats.wordsCompleted > 0 ?
          (result.stats.perfectWords / result.stats.wordsCompleted) * 100 : 0;

        // Calculate XP based on performance
        const baseXP = result.stats.wordsCompleted * 18; // 18 XP per word completed
        const accuracyBonus = Math.round(accuracy * 0.5); // Bonus for accuracy
        const streakBonus = result.stats.streak * 3; // Bonus for streak
        const perfectBonus = result.stats.perfectWords * 10; // Bonus for perfect words
        const totalXP = baseXP + accuracyBonus + streakBonus + perfectBonus;

        await gameService.endGameSession(gameSessionId, {
          student_id: userId,
          final_score: result.score,
          accuracy_percentage: accuracy,
          completion_percentage: 100,
          words_attempted: result.stats.wordsCompleted,
          words_correct: result.stats.perfectWords,
          unique_words_practiced: result.stats.wordsCompleted,
          duration_seconds: Math.floor((Date.now() - wordStartTime) / 1000),
          xp_earned: totalXP,
          bonus_xp: accuracyBonus + streakBonus + perfectBonus,
          session_data: {
            gameMode: settings.gameMode,
            difficulty: settings.difficulty,
            finalStats: result.stats,
            averageSolveTime: result.stats.avgSolveTime,
            letterAccuracy: result.stats.letterAccuracy,
            streakCount: result.stats.streak,
            perfectWords: result.stats.perfectWords
          }
        });

        console.log('Word scramble game session ended successfully with XP:', totalXP);
      } catch (error) {
        console.error('Failed to end word scramble game session:', error);
      }
    }

    // Call the original game end handler
    onGameEnd(result);
  };

  // Initialize new word
  const initializeNewWord = useCallback(() => {
    if (!currentWordList || currentWordList.length === 0) return;
    
    const randomWord = currentWordList[Math.floor(Math.random() * currentWordList.length)];
    setCurrentWordData(randomWord);
    setScrambledLetters(scrambleWord(randomWord.word));
    setSelectedLetters([]);
    setUserAnswer('');
    setShowHint(false);
    setIsVowelRevealed(false);
    setShowWordLength(false);
    setWordStartTime(Date.now());
  }, [currentWordList, scrambleWord]);

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing' || settings.gameMode === 'zen' || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      if (freezeTimeRemaining > 0) {
        setFreezeTimeRemaining(prev => prev - 1);
        return;
      }

      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGameState('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeRemaining, freezeTimeRemaining, settings.gameMode]);

  // Handle game failure
  useEffect(() => {
    if (gameState === 'failed') {
      handleEnhancedGameEnd({
        won: false,
        score: gameStats.score,
        stats: gameStats
      });
    }
  }, [gameState, gameStats]);

  // Initialize game
  useEffect(() => {
    initializeNewWord();
  }, [initializeNewWord]);

  // Handle letter selection
  const handleLetterClick = useCallback((index: number) => {
    if (gameState !== 'playing') return;
    
    soundManager.current.play('select');
    
    setSelectedLetters(prev => {
      const newSelected = [...prev];
      const selectedIndex = newSelected.indexOf(index);
      
      if (selectedIndex >= 0) {
        newSelected.splice(selectedIndex, 1);
      } else {
        newSelected.push(index);
      }
      
      return newSelected;
    });
  }, [gameState]);

  // Update user answer based on selected letters
  useEffect(() => {
    const answer = selectedLetters.map(index => scrambledLetters[index]).join('');
    setUserAnswer(answer);
  }, [selectedLetters, scrambledLetters]);

  // Check answer
  const checkAnswer = useCallback(() => {
    if (!currentWordData || userAnswer.toLowerCase() !== currentWordData.word.toLowerCase()) {
      return false;
    }

    const solveTime = (Date.now() - wordStartTime) / 1000;
    setSolveHistory(prev => [...prev, solveTime]);

    // Calculate points
    const difficultyConfig = DIFFICULTY_CONFIGS[settings.difficulty];
    const basePoints = currentWordData.points || 50;
    let points = Math.floor(basePoints * difficultyConfig.multiplier);
    
    // Time bonus
    const timeBonus = Math.max(0, Math.floor((30 - solveTime) * 2));
    points += timeBonus;
    
    // Streak bonus
    if (gameStats.streak > 0) {
      points += gameStats.streak * 5;
    }
    
    // Double points power-up
    if (doublePointsActive) {
      points *= 2;
      setDoublePointsActive(false);
    }

    // Perfect word bonus (solved quickly)
    const isPerfect = solveTime < 5;
    if (isPerfect) {
      points += 50;
      setGameStats(prev => ({ ...prev, perfectWords: prev.perfectWords + 1 }));
      createParticleEffect('perfect');
    }

    // Update game stats
    setGameStats(prev => ({
      ...prev,
      score: prev.score + points,
      streak: prev.streak + 1,
      wordsCompleted: prev.wordsCompleted + 1,
      consecutiveCorrect: prev.consecutiveCorrect + 1,
      multiplier: Math.min(5, Math.floor(prev.streak / 3) + 1),
      timeBonus: prev.timeBonus + timeBonus,
      avgSolveTime: (prev.avgSolveTime * prev.wordsCompleted + solveTime) / (prev.wordsCompleted + 1)
    }));

    // Log word performance for analytics
    if (gameService && gameSessionId && !isAssignmentMode) {
      gameService.logWordPerformance({
        session_id: gameSessionId,
        vocabulary_id: currentWordData.id ? parseInt(currentWordData.id) : undefined,
        word_text: currentWordData.word,
        translation_text: currentWordData.translation || '',
        language_pair: `${settings.language}_english`,
        attempt_number: 1,
        response_time_ms: Math.round(solveTime * 1000),
        was_correct: true,
        confidence_level: isPerfect ? 5 : solveTime < 10 ? 4 : solveTime < 20 ? 3 : 2,
        difficulty_level: settings.difficulty,
        hint_used: false,
        streak_count: gameStats.streak + 1,
        previous_attempts: 0,
        mastery_level: isPerfect ? 2 : 1,
        grammar_concept: 'word_reconstruction',
        context_data: {
          gameType: 'word-scramble',
          gameMode: settings.gameMode,
          scrambledWord: scrambledLetters.join(''),
          letterPlacementAccuracy: 100, // Since answer was correct
          solveTime: solveTime,
          isPerfect: isPerfect,
          pointsEarned: points
        },
        timestamp: new Date()
      }).catch(error => {
        console.error('Failed to log word performance:', error);
      });
    }

    // Combo system
    setComboCount(prev => prev + 1);
    if (gameStats.streak > 0 && gameStats.streak % 5 === 0) {
      createParticleEffect('streak');
    }

    // Check achievements
    checkAndUnlockAchievements(solveTime, isPerfect);

    soundManager.current.play('correct');
    createParticleEffect('success');

    return true;
  }, [currentWordData, userAnswer, wordStartTime, settings.difficulty, gameStats, doublePointsActive]);

  // Achievement checker
  const checkAndUnlockAchievements = useCallback((solveTime: number, isPerfect: boolean) => {
    setGameStats(prev => {
      const newAchievements = [...prev.achievements];
      let hasNewAchievement = false;

      // First word
      if (prev.wordsCompleted === 0) {
        const achievement = newAchievements.find(a => a.id === 'first_word');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          setShowAchievement(achievement);
          hasNewAchievement = true;
        }
      }

      // Speed demon
      if (solveTime < 3) {
        const achievement = newAchievements.find(a => a.id === 'speed_demon');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          setShowAchievement(achievement);
          hasNewAchievement = true;
        }
      }

      // Perfect streak
      if (prev.streak >= 9) {
        const achievement = newAchievements.find(a => a.id === 'perfect_streak');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          setShowAchievement(achievement);
          hasNewAchievement = true;
        }
      }

      // Word wizard
      if (prev.wordsCompleted >= 99) {
        const achievement = newAchievements.find(a => a.id === 'word_wizard');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          setShowAchievement(achievement);
          hasNewAchievement = true;
        }
      }

      // Combo master
      if (prev.multiplier >= 5) {
        const achievement = newAchievements.find(a => a.id === 'combo_king');
        if (achievement && !achievement.unlocked) {
          achievement.unlocked = true;
          setShowAchievement(achievement);
          hasNewAchievement = true;
        }
      }

      if (hasNewAchievement) {
        soundManager.current.play('powerup');
        createParticleEffect('powerup');
      }

      return { ...prev, achievements: newAchievements };
    });
  }, []);

  // Submit answer
  const submitAnswer = useCallback(() => {
    if (gameState !== 'playing' || !userAnswer.trim()) return;

    if (checkAnswer()) {
      // Check if game should continue
      const modeConfig = GAME_MODE_CONFIGS[settings.gameMode];
      const shouldContinue = (modeConfig.wordLimit === 0 || gameStats.wordsCompleted < modeConfig.wordLimit - 1) &&
                            (timeRemaining > 0 || settings.gameMode === 'zen');

      if (shouldContinue) {
        setTimeout(() => {
          initializeNewWord();
        }, 1500);
      } else {
        setTimeout(() => {
          setGameState('completed');
          handleEnhancedGameEnd({
            won: true,
            score: gameStats.score,
            stats: gameStats
          });
        }, 2000);
      }
    } else {
      // Wrong answer - log performance for analytics
      if (gameService && gameSessionId && !isAssignmentMode && currentWordData) {
        const attemptTime = (Date.now() - wordStartTime) / 1000;
        gameService.logWordPerformance({
          session_id: gameSessionId,
          vocabulary_id: currentWordData.id ? parseInt(currentWordData.id) : undefined,
          word_text: currentWordData.word,
          translation_text: currentWordData.translation || '',
          language_pair: `${settings.language}_english`,
          attempt_number: 1,
          response_time_ms: Math.round(attemptTime * 1000),
          was_correct: false,
          confidence_level: 1, // Low confidence for wrong answer
          difficulty_level: settings.difficulty,
          hint_used: false,
          streak_count: 0,
          previous_attempts: 0,
          mastery_level: 0,
          error_type: 'letter_placement',
          grammar_concept: 'word_reconstruction',
          error_details: {
            gameMode: settings.gameMode,
            attemptedAnswer: userAnswer,
            correctAnswer: currentWordData.word,
            scrambledWord: scrambledLetters.join(''),
            letterAccuracy: calculateLetterAccuracy(userAnswer, currentWordData.word)
          },
          context_data: {
            gameType: 'word-scramble',
            gameMode: settings.gameMode,
            scrambledWord: scrambledLetters.join(''),
            attemptedReconstruction: userAnswer,
            attemptTime: attemptTime
          },
          timestamp: new Date()
        }).catch(error => {
          console.error('Failed to log word performance:', error);
        });
      }

      soundManager.current.play('wrong');
      setGameStats(prev => ({
        ...prev,
        streak: 0,
        consecutiveCorrect: 0,
        multiplier: 1
      }));
      setComboCount(0);

      // Clear selection to let player try again
      setSelectedLetters([]);
      setUserAnswer('');
    }
  }, [gameState, userAnswer, checkAnswer, settings.gameMode, gameStats.wordsCompleted, timeRemaining, initializeNewWord, onGameEnd, gameStats]);

  // Power-up handlers
  const usePowerUp = useCallback((powerUp: PowerUp) => {
    if (usedPowerUps.has(powerUp) || gameStats.score < POWER_UPS[powerUp].cost) return;

    setGameStats(prev => ({ ...prev, score: prev.score - POWER_UPS[powerUp].cost }));
    setUsedPowerUps(prev => new Set([...prev, powerUp]));
    soundManager.current.play('powerup');

    switch (powerUp) {
      case 'shuffle_letters':
        if (currentWordData) {
          setScrambledLetters(scrambleWord(currentWordData.word));
          setSelectedLetters([]);
          setUserAnswer('');
        }
        break;
      case 'reveal_vowels':
        setIsVowelRevealed(true);
        break;
      case 'show_length':
        setShowWordLength(true);
        break;
      case 'freeze_time':
        setFreezeTimeRemaining(10);
        break;
      case 'double_points':
        setDoublePointsActive(true);
        break;
      case 'word_hints':
        setShowHint(true);
        break;
    }
  }, [usedPowerUps, gameStats.score, currentWordData, scrambleWord]);

  // Skip word (if available)
  const skipWord = useCallback(() => {
    if (gameState !== 'playing') return;
    
    setGameStats(prev => ({
      ...prev,
      streak: 0,
      multiplier: 1
    }));
    initializeNewWord();
  }, [gameState, initializeNewWord]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center text-white shadow-2xl"
        >
          <div className="text-6xl mb-4">⏰</div>
          <h2 className="text-3xl font-bold mb-4">Time's Up!</h2>
          <div className="space-y-2 mb-6">
            <p className="text-xl">Final Score: <span className="font-bold text-yellow-300">{gameStats.score.toLocaleString()}</span></p>
            <p>Words Completed: {gameStats.wordsCompleted}</p>
            <p>Best Streak: {gameStats.streak}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
            >
              Play Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackToMenu}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Main Menu
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden" ref={gameContainerRef}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/10"></div>
      
      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-4 rounded-lg shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{showAchievement.icon}</div>
              <div>
                <div className="font-bold">Achievement Unlocked!</div>
                <div className="text-sm">{showAchievement.title}</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setShowAchievement(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
            >
              ×
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToMenu}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
          >
            ← Back
          </motion.button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Epic Word Scramble
            </h1>
            <p className="text-white/80 text-sm">
              {GAME_MODE_CONFIGS[settings.gameMode].icon} {settings.gameMode.replace('_', ' ').toUpperCase()} • {settings.difficulty.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenSettings && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenSettings}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
              >
                ⚙️
              </motion.button>
            )}
            <div className="text-right text-white">
              {settings.gameMode !== 'zen' && (
                <>
                  <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
                  <div className="text-sm text-white/70">Time Left</div>
                  {freezeTimeRemaining > 0 && (
                    <div className="text-blue-300 text-xs">Frozen: {freezeTimeRemaining}s</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-blue-400/30">
            <div className="text-xl font-bold text-yellow-300">{gameStats.score.toLocaleString()}</div>
            <div className="text-xs text-white/70">Score</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-green-400/30">
            <div className="text-xl font-bold">{gameStats.streak}</div>
            <div className="text-xs text-white/70">Streak</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-purple-400/30">
            <div className="text-xl font-bold">{gameStats.multiplier}x</div>
            <div className="text-xs text-white/70">Multiplier</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-orange-400/30">
            <div className="text-xl font-bold">{gameStats.wordsCompleted}</div>
            <div className="text-xs text-white/70">Words</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-pink-400/30">
            <div className="text-xl font-bold">{gameStats.perfectWords}</div>
            <div className="text-xs text-white/70">Perfect</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-indigo-400/30">
            <div className="text-xl font-bold">{Math.floor(gameStats.avgSolveTime * 10) / 10}s</div>
            <div className="text-xs text-white/70">Avg Time</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative z-10 px-6 flex-1 flex flex-col items-center">
        <div className="max-w-4xl w-full mx-auto">
          
          {/* Current Word Info */}
          <div className="text-center mb-8">
            <motion.div
              key={currentWordData?.word}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4"
            >
              {showWordLength && (
                <div className="text-white/70 mb-2">
                  Word Length: {currentWordData?.word.length} letters
                </div>
              )}
              
              {/* Hint Display */}
              <AnimatePresence>
                {showHint && currentWordData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-lg p-4 mb-4 text-white border border-yellow-400/30"
                  >
                    <div className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">💡</span>
                      <span>{currentWordData.hint}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Scrambled Letters Display */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-6 min-h-[80px] items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {scrambledLetters.map((letter, index) => (
                <AnimatedLetter
                  key={index}
                  letter={letter}
                  index={index}
                  isVowelRevealed={isVowelRevealed}
                  onClick={handleLetterClick}
                  isSelected={selectedLetters.includes(index)}
                  canMove={gameState === 'playing'}
                />
              ))}
            </motion.div>

            {/* User's Answer Display */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-white text-lg mb-2">Your Answer:</div>
              <div className="text-4xl font-bold text-white bg-black/20 backdrop-blur-sm rounded-lg p-4 min-h-[60px] flex items-center justify-center border border-white/20">
                {userAnswer.toUpperCase() || '...'}
              </div>
            </motion.div>
          </div>

          {/* Power-ups Panel */}
          <div className="mb-8">
            <h3 className="text-white text-xl font-bold mb-4 text-center">⚡ Power-ups</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {Object.entries(POWER_UPS).map(([key, powerUp]) => {
                const powerUpKey = key as PowerUp;
                const isUsed = usedPowerUps.has(powerUpKey);
                const canAfford = gameStats.score >= powerUp.cost;
                const isActive = 
                  (powerUpKey === 'reveal_vowels' && isVowelRevealed) ||
                  (powerUpKey === 'show_length' && showWordLength) ||
                  (powerUpKey === 'word_hints' && showHint) ||
                  (powerUpKey === 'double_points' && doublePointsActive) ||
                  (powerUpKey === 'freeze_time' && freezeTimeRemaining > 0);
                
                return (
                  <motion.button
                    key={key}
                    whileHover={canAfford && !isUsed ? { scale: 1.05 } : {}}
                    whileTap={canAfford && !isUsed ? { scale: 0.95 } : {}}
                    onClick={() => canAfford && !isUsed && usePowerUp(powerUpKey)}
                    className={`
                      p-3 rounded-lg text-center transition-all border
                      ${isActive 
                        ? 'bg-green-500/30 border-green-400 text-green-300' 
                        : canAfford && !isUsed
                          ? 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
                          : 'bg-gray-600/20 border-gray-600 text-gray-400 cursor-not-allowed'
                      }
                    `}
                    disabled={!canAfford || isUsed}
                  >
                    <div className="text-2xl mb-1">{powerUp.icon}</div>
                    <div className="text-xs font-semibold">{powerUp.name}</div>
                    <div className="text-xs">{powerUp.cost}pts</div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={submitAnswer}
              disabled={!userAnswer.trim() || gameState !== 'playing'}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl shadow-lg transition-all disabled:cursor-not-allowed"
            >
              ✨ Submit Answer
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipWord}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              ⏭️ Skip Word
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedLetters([]);
                setUserAnswer('');
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              🔄 Clear
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

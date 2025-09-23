'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Lightbulb, Volume2, Settings, PartyPopper, Sparkles, SkipForward, Undo2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';

// Simple sound manager for audio feedback
class SoundManager {
  play(type: 'correct' | 'wrong' | 'select') {
    // Simple audio feedback - can be enhanced later
    if (typeof window !== 'undefined') {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        let frequency = 261.63; // Default C4
        
        switch (type) {
          case 'correct':
            frequency = 523.25; // C5
            break;
          case 'wrong':
            frequency = 220.00; // A3
            break;
          case 'select':
            frequency = 293.66; // D4
            break;
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.log('Audio not available');
      }
    }
  }
}

// Enhanced letter component with animations

// Particle system (using a simple confetti library if available)
const confetti = (options: any) => {
  // A dummy confetti function to prevent errors if the library isn't loaded
  console.log('Confetti effect:', options.particleCount, 'particles');
};

// Type definitions

interface GameStats {
  score: number;
  streak: number;
  wordsCompleted: number;
  hintsUsed: number;
  timeElapsed: number;
  avgSolveTime: number;
}

interface GameVocabularyWord {
  id: string;
  word: string;
  translation: string;
  category?: string;
  subcategory?: string;
  language?: string;
  part_of_speech?: string;
  audio_url?: string;
}

interface WordScrambleGameProps {
  vocabulary: GameVocabularyWord[];
  onBackToMenu: () => void;
  onGameEnd?: (result: { won: boolean; score: number; stats: GameStats }) => void;
  onGameComplete?: (result: any) => void;
  gameSessionId?: string;
  isAssignmentMode?: boolean;
  assignmentId?: string;
  assignmentTitle?: string;
  userId?: string;
  language?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  onProgressUpdate?: (progress: any) => void;
  onOpenSettings?: () => void;
}


const createParticleEffect = (type: 'success') => {
  const configs = {
    success: {
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10B981', '#34D399', '#6EE7B7']
    },
    powerup: {
      particleCount: 30,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#8B5CF6', '#A78BFA', '#C4B5FD']
    },
  };
  confetti(configs[type]);
};

// Enhanced letter component with animations
const AnimatedLetter = React.memo(({
  letter,
  index,
  isVowelRevealed,
  isLetterRevealed,
  onClick,
  canMove = true,
  isUsed = false
}: {
  letter: string;
  index: number;
  isVowelRevealed?: boolean;
  isLetterRevealed?: boolean;
  onClick?: (index: number) => void;
  canMove?: boolean;
  isUsed?: boolean;
}) => {
  const isVowel = 'aeiouAEIOUáéíóúÁÉÍÓÚ'.includes(letter);

  return (
    <motion.button
      onClick={() => onClick?.(index)}
      className={`
        relative inline-block mx-0.5 md:mx-1 px-2 md:px-3 lg:px-4 py-1.5 md:py-2 lg:py-3
        text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold rounded-lg shadow-lg
        transition-all duration-200 min-w-[40px] md:min-w-[50px] lg:min-w-[60px]
        ${isUsed
          ? 'bg-gray-400/50 text-gray-600 cursor-not-allowed opacity-30 scale-90'
          : letter === ' '
            ? 'bg-gray-600/70 text-white hover:bg-gray-500/70 cursor-pointer'
            : 'bg-white text-gray-800 hover:bg-gray-100 cursor-pointer hover:shadow-xl'
        }
        ${(isVowelRevealed && isVowel) || isLetterRevealed ? 'bg-yellow-300 text-black ring-4 ring-yellow-500' : ''}
        ${!canMove ? 'cursor-not-allowed opacity-50' : ''}
      `}
      variants={{
        initial: { scale: 0, rotate: -180, opacity: 0 },
        animate: { scale: isUsed ? 0.9 : 1, rotate: 0, opacity: isUsed ? 0.3 : 1 },
        bounce: {
          scale: [1, 1.2, 1],
          transition: { duration: 0.3 }
        }
      }}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.1 }}
      whileHover={canMove && !isUsed ? { scale: 1.05 } : {}}
      whileTap={canMove && !isUsed ? { scale: 0.95 } : {}}
      disabled={!canMove || isUsed}
    >
      {letter === ' ' ? '␣' : letter.toUpperCase()}
      {(isVowelRevealed && isVowel) || isLetterRevealed && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-yellow-500 rounded-full"
        />
      )}
    </motion.button>
  );
});

AnimatedLetter.displayName = 'AnimatedLetter';

export default function WordScrambleGame({
  vocabulary,
  onBackToMenu,
  onGameEnd,
  onGameComplete,
  gameSessionId,
  isAssignmentMode = false,
  assignmentId,
  assignmentTitle,
  userId,
  language = 'es',
  difficulty = 'medium',
  onProgressUpdate,
  onOpenSettings
}: WordScrambleGameProps) {

  const [currentWordData, setCurrentWordData] = useState<GameVocabularyWord | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [usedLetterIndices, setUsedLetterIndices] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    streak: 0,
    wordsCompleted: 0,
    hintsUsed: 0,
    timeElapsed: 0,
    avgSolveTime: 0,
  });

  const [gameState, setGameState] = useState<'playing' | 'completed' | 'failed'>('playing');
  const [wordStartTime, setWordStartTime] = useState(Date.now());
  const [solveHistory, setSolveHistory] = useState<number[]>([]);
  const [showIncorrectModal, setShowIncorrectModal] = useState(false);
  const [incorrectAnswerData, setIncorrectAnswerData] = useState<{word: string, translation: string} | null>(null);

  // Track completed words and current word index for proper completion logic
  const [completedWordIds, setCompletedWordIds] = useState<Set<string>>(new Set());
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [remainingWords, setRemainingWords] = useState<GameVocabularyWord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Destructure commonly used values from gameStats
  const { score, streak } = gameStats;

  // Refs
  const soundManager = useRef<SoundManager>(new SoundManager());
  const inputRef = useRef<HTMLInputElement>(null);
  const hasSubmittedRef = useRef<string>(''); // Track last submitted answer to prevent duplicates

  // Scramble word function - Fixed to ensure all original letters are preserved
  const scrambleWord = useCallback((word: string): string[] => {
    if (!word || word.trim().length === 0) {
      return [];
    }
    
    // Convert to array and ensure we preserve all original letters, including spaces
    const letters = word.trim().split('');
    
    // Separate letters and spaces - spaces should stay in their original positions
    const nonSpaceIndices: number[] = [];
    
    letters.forEach((letter, index) => {
      if (letter !== ' ') {
        nonSpaceIndices.push(index);
      }
    });
    
    // For words with spaces, only shuffle non-space characters
    const nonSpaceLetters = nonSpaceIndices.map(i => letters[i]);
    
    // Fisher-Yates shuffle algorithm to properly randomize
    for (let i = nonSpaceLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [nonSpaceLetters[i], nonSpaceLetters[j]] = [nonSpaceLetters[j], nonSpaceLetters[i]];
    }
    
    // Reconstruct with spaces in original positions
    const result = [...letters];
    let letterIndex = 0;
    for (let i = 0; i < result.length; i++) {
      if (result[i] !== ' ') {
        result[i] = nonSpaceLetters[letterIndex++];
      }
    }
    
    // Ensure the scrambled word is not the same as the original, unless it's a single letter word
    if (result.join('') === word.trim() && word.trim().length > 1) {
      // If identical, perform one more swap to ensure it's different
      const idx1 = 0;
      const idx2 = 1;
      [result[idx1], result[idx2]] = [result[idx2], result[idx1]];
    }
    
    return result;
  }, []);

  // Initialize remaining words when vocabulary loads
  useEffect(() => {
    if (vocabulary && vocabulary.length > 0) {
      // Initialize remaining words list (shuffle for variety but ensure all words are used)
      const shuffledVocabulary = [...vocabulary].sort(() => Math.random() - 0.5);
      setRemainingWords(shuffledVocabulary);
      setCurrentWordIndex(0);
      setCompletedWordIds(new Set());
    }
  }, [vocabulary]);

  // Initialize new word - Enhanced with validation
  const initializeNewWord = useCallback(() => {
    if (!remainingWords || remainingWords.length === 0) {
      // Handle case with no vocabulary
      setGameState('completed');
      return;
    }

    // Check if all words have been completed
    if (currentWordIndex >= remainingWords.length) {
      setGameState('completed');

      // Call completion handlers
      if (onGameComplete) {
        onGameComplete({
          won: true,
          score: score,
          stats: gameStats,
          wordsCompleted: completedWordIds.size,
          totalWords: remainingWords.length
        });
      }
      if (onGameEnd) {
        onGameEnd({
          won: true,
          score: score,
          stats: gameStats
        });
      }
      return;
    }

    // Get the next word in sequence
    const nextWord = remainingWords[currentWordIndex];
    
    // Validate the word before proceeding
    if (!nextWord || !nextWord.word || nextWord.word.trim().length === 0) {
      // Skip this word and try the next one
      setCurrentWordIndex(prev => prev + 1);
      return;
    }
    
    const cleanWord = nextWord.word.trim();

    setCurrentWordData(nextWord);
    const scrambled = scrambleWord(cleanWord);
    setScrambledLetters(scrambled);
    
    // CRITICAL: Reset all selection state when starting new word
    setUsedLetterIndices([]);
    setUserAnswer('');
    setWordStartTime(Date.now());
    
    // Reset submission tracking for new word
    hasSubmittedRef.current = '';
  }, [remainingWords, currentWordIndex, completedWordIds, gameStats, onGameComplete, onGameEnd, scrambleWord]);

  // Initial game setup - start first word when remaining words are ready
  useEffect(() => {
    if (remainingWords.length > 0 && !currentWordData && currentWordIndex === 0) {
      initializeNewWord();
    }
  }, [remainingWords, currentWordData, currentWordIndex, initializeNewWord]);

  // Handle letter selection
  const handleLetterClick = useCallback((index: number) => {
    if (gameState !== 'playing' || usedLetterIndices.includes(index)) {
      return;
    }

    soundManager.current.play('select');

    const letter = scrambledLetters[index];
    setUserAnswer(prev => prev + letter);
    setUsedLetterIndices(prev => [...prev, index]);
  }, [gameState, scrambledLetters, usedLetterIndices]);



  // Undo last letter
  const undoLastSelection = useCallback(() => {
    if (gameState !== 'playing' || !userAnswer) return;
    
    soundManager.current.play('select');
    
    setUserAnswer(prev => prev.slice(0, -1));
    setUsedLetterIndices(prev => prev.slice(0, -1));
  }, [gameState, userAnswer]);

  // Check answer
  const checkAnswer = useCallback(() => {
    if (!currentWordData || !currentWordData.word || !userAnswer) {
      return false;
    }
    
    const correctWord = currentWordData.word.trim().toLowerCase();
    const submittedAnswer = userAnswer.trim().toLowerCase();
    
    return correctWord === submittedAnswer;
  }, [currentWordData, userAnswer]);

  // Submit answer
  const submitAnswer = useCallback(async () => {
    if (gameState !== 'playing' || !userAnswer.trim() || isSubmitting) {
      console.log('🚫 [SUBMIT] Blocked submission:', { gameState, hasAnswer: !!userAnswer.trim(), isSubmitting });
      return;
    }

    console.log('🎯 [SUBMIT] Starting submission for word:', currentWordData?.word, 'answer:', userAnswer.trim());
    setIsSubmitting(true);
    
    const solveTime = (Date.now() - wordStartTime) / 1000;
    const isCorrect = checkAnswer();

    if (isCorrect) {
      soundManager.current.play('correct');
      createParticleEffect('success');

      const points = Math.floor(Math.max(30, currentWordData!.word.length * 10) * (1 + streak * 0.1));

      setGameStats(prev => ({
        ...prev,
        score: prev.score + points,
        streak: prev.streak + 1,
        wordsCompleted: prev.wordsCompleted + 1,
        avgSolveTime: (prev.avgSolveTime * prev.wordsCompleted + solveTime) / (prev.wordsCompleted + 1),
      }));

      if (currentWordData) {
        setCompletedWordIds(prev => new Set([...prev, currentWordData.id]));
        setCurrentWordIndex(prev => prev + 1);
      }      setTimeout(() => {
        initializeNewWord();
      }, 1500);
    } else {
      soundManager.current.play('wrong');
      setGameStats(prev => ({
        ...prev,
        streak: 0,
      }));
      
      if (currentWordData) {
        setIncorrectAnswerData({
          word: currentWordData.word,
          translation: currentWordData.translation
        });
        setShowIncorrectModal(true);
        
        setTimeout(() => {
          setShowIncorrectModal(false);
          setIncorrectAnswerData(null);
          setCompletedWordIds(prev => new Set([...prev, currentWordData.id]));
          setCurrentWordIndex(prev => prev + 1);
          setTimeout(() => {
            initializeNewWord();
          }, 500);
        }, 3000);
      }
    }

    if (currentWordData && gameSessionId) {
      setTimeout(async () => {
        try {
          const sessionService = new EnhancedGameSessionService();
          await sessionService.recordWordAttempt(gameSessionId, 'word-scramble', {
            vocabularyId: currentWordData.id,
            wordText: currentWordData.word,
            translationText: currentWordData.translation,
            responseTimeMs: Math.round(solveTime * 1000),
            wasCorrect: isCorrect,
            hintUsed: gameStats.hintsUsed > 0,
            streakCount: streak + (isCorrect ? 1 : 0),
            masteryLevel: isCorrect ? 2 : 1,
            maxGemRarity: isCorrect ? (streak > 5 ? 'rare' : 'uncommon') : 'common',
            gameMode: 'word_scramble',
            difficultyLevel: difficulty
          });
        } catch (error) {
          console.error('Error recording vocabulary interaction:', error);
        }
      }, 0);
    }

    // Reset submitting state after completion
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  }, [gameState, userAnswer, checkAnswer, currentWordData, gameStats, initializeNewWord, wordStartTime, userId, language, gameSessionId, isAssignmentMode, streak, difficulty, isSubmitting]);

  // Auto-submit when answer is correct
  useEffect(() => {
    if (userAnswer && currentWordData && gameState === 'playing' && !isSubmitting) {
      const correctWord = currentWordData.word.trim().toLowerCase();
      const submittedAnswer = userAnswer.trim().toLowerCase();
      
      console.log('🔍 [AUTO-SUBMIT] Checking:', { 
        userAnswer, 
        correctWord, 
        isMatch: correctWord === submittedAnswer,
        hasSubmitted: hasSubmittedRef.current,
        alreadySubmittedThis: hasSubmittedRef.current === correctWord
      });
      
      // Check if this is a correct answer and we haven't already submitted this exact word
      if (correctWord === submittedAnswer && hasSubmittedRef.current !== correctWord) {
        console.log('✅ [AUTO-SUBMIT] Scheduling submission for:', correctWord);
        // Mark this word as submitted to prevent duplicates
        hasSubmittedRef.current = correctWord;
        
        // Small delay to let user see the completed word before auto-submitting
        const timeoutId = setTimeout(() => {
          if (!isSubmitting && hasSubmittedRef.current === correctWord) {
            console.log('🚀 [AUTO-SUBMIT] Executing submission');
            submitAnswer();
          } else {
            console.log('🚫 [AUTO-SUBMIT] Canceled submission:', { isSubmitting, hasSubmittedRef: hasSubmittedRef.current, correctWord });
          }
        }, 500);
        
        return () => {
          console.log('🧹 [AUTO-SUBMIT] Cleaning up timeout for:', correctWord);
          clearTimeout(timeoutId);
        };
      }
    }
  }, [userAnswer, currentWordData, gameState, isSubmitting]);

  // Handle keyboard input
  const handleKeyboardInput = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing' || !currentWordData) return;

    const key = e.key.toLowerCase();

    // Handle backspace
    if (key === 'backspace') {
      e.preventDefault();
      undoLastSelection();
      return;
    }

    // Handle enter to submit
    if (key === 'enter') {
      e.preventDefault();
      if (userAnswer.trim() && !isSubmitting) {
        submitAnswer();
      }
      return;
    }

    // Handle letter input
    if (key.length === 1 && /[a-záéíóúñü¿?¡!\s]/i.test(key)) {
      e.preventDefault();

      // Find the first unused letter that matches the typed key
      const matchingIndex = scrambledLetters.findIndex((letter, index) =>
        letter.toLowerCase() === key && !usedLetterIndices.includes(index)
      );

      if (matchingIndex !== -1) {
        handleLetterClick(matchingIndex);
      }
    }
  }, [gameState, currentWordData, userAnswer, scrambledLetters, usedLetterIndices, undoLastSelection, submitAnswer, handleLetterClick, isSubmitting]);

  // Add keyboard event listener and focus management
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardInput);

    // Focus the input ref to ensure keyboard events work
    if (inputRef.current) {
      inputRef.current.focus();
    }

    return () => window.removeEventListener('keydown', handleKeyboardInput);
  }, [handleKeyboardInput]);

  // Refocus when game state changes
  useEffect(() => {
    if (gameState === 'playing' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, currentWordData]);

  // Skip word
  const skipWord = useCallback(() => {
    if (gameState !== 'playing') return;
    
    setGameStats(prev => ({
      ...prev,
      streak: 0,
    }));
    initializeNewWord();
  }, [gameState, initializeNewWord]);

  // Game completion screen
  if (gameState === 'completed') {
    const accuracy = gameStats.wordsCompleted > 0 ?
      Math.round((gameStats.wordsCompleted / (gameStats.wordsCompleted + gameStats.hintsUsed)) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white p-4">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md w-full">
          <div className="text-6xl mb-4"><PartyPopper size={64} /></div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Assignment Complete!
          </h2>
          <p className="text-white/70 mb-6">
            You've successfully completed all {remainingWords.length} words!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-300">{score.toLocaleString()}</div>
              <div className="text-xs text-white/70">Final Score</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-300">{accuracy}%</div>
              <div className="text-xs text-white/70">Accuracy</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-300">{gameStats.wordsCompleted}</div>
              <div className="text-xs text-white/70">Words Completed</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-300">{Math.round(gameStats.avgSolveTime)}s</div>
              <div className="text-xs text-white/70">Avg Time</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToMenu}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-lg font-semibold transition-all"
          >
            Back to Menu
          </motion.button>
        </div>
      </div>
    );
  }

  if (!vocabulary || vocabulary.length === 0 || !currentWordData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white p-4">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">No Words Available</h2>
          <p className="text-white/70 mb-4">Please provide a vocabulary list to play.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToMenu}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            Main Menu
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/10"></div>
      
      {/* Container with proper spacing */}
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-6xl">
        
        {/* Header - Compact and responsive */}
        <div className="flex justify-between items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToMenu}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white font-semibold transition-all"
          >
            ← Back
          </motion.button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-white bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Word Scramble
            </h1>
          </div>
          
          {onOpenSettings && (
            <motion.button
              onClick={onOpenSettings}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold flex items-center gap-2 transition-all shadow-lg border-2 border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline">Settings</span>
            </motion.button>
          )}
        </div>

        {/* Stats Bar - More compact grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-blue-400/30">
            <div className="text-xl font-bold text-yellow-300">{score.toLocaleString()}</div>
            <div className="text-sm text-white/70">Score</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-green-400/30">
            <div className="text-xl font-bold">{streak}</div>
            <div className="text-sm text-white/70">Streak</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-orange-400/30">
            <div className="text-xl font-bold">{gameStats.wordsCompleted}</div>
            <div className="text-sm text-white/70">Words</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-purple-400/30">
            <div className="text-xl font-bold">{currentWordIndex + 1}/{remainingWords.length}</div>
            <div className="text-sm text-white/70">Progress</div>
          </div>
        </div>

        {/* Game Content - Centered and responsive */}
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Current Word to Translate */}
          <div className="text-center">
            <motion.div
              key={currentWordData.word}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="text-white text-lg font-semibold mb-2">
                Translate to Spanish:
              </div>
              <div className="text-white text-2xl lg:text-3xl font-bold text-yellow-300">
                {currentWordData.translation}
              </div>
            </motion.div>
          </div>

          {/* Scrambled Letters - Responsive grid */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="text-white text-center text-sm mb-3">Click letters to build your answer:</div>
            <motion.div
              className="flex flex-wrap justify-center gap-2 min-h-[80px] items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {scrambledLetters.map((letter, index) => (
                <AnimatedLetter
                  key={index}
                  letter={letter}
                  index={index}
                  isLetterRevealed={false}
                  onClick={handleLetterClick}
                  canMove={gameState === 'playing' && !usedLetterIndices.includes(index)}
                  isUsed={usedLetterIndices.includes(index)}
                />
              ))}
            </motion.div>
          </div>

          {/* User's Answer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-white text-center text-sm mb-3">Your Answer:</div>
            <div className="text-2xl lg:text-3xl font-bold text-white text-center bg-black/20 rounded-xl p-4 min-h-[60px] flex items-center justify-center border border-white/10">
              {userAnswer.toUpperCase() || 'Click letters above...'}
            </div>
            <div className="text-center text-xs text-white/60 mt-3">
              {userAnswer.length > 0 ? 
                '💡 Use "Undo" to remove letters or "Clear" to start over' :
                '💡 Tip: Click letters above or type on your keyboard'
              }
            </div>
          </div>

          {/* Action Buttons - Responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={submitAnswer}
              disabled={!userAnswer.trim() || gameState !== 'playing' || checkAnswer() || isSubmitting}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl shadow-lg transition-all disabled:cursor-not-allowed opacity-75"
            >
              <Sparkles size={16} className="inline mr-1" /> {isSubmitting ? 'Submitting...' : 'Submit'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={undoLastSelection}
              disabled={!userAnswer || gameState !== 'playing'}
              className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl shadow-lg transition-all disabled:cursor-not-allowed"
            >
              <Undo2 size={16} className="inline mr-1" /> Undo
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setUserAnswer('');
                setUsedLetterIndices([]);
              }}
              disabled={!userAnswer || gameState !== 'playing'}
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl shadow-lg transition-all disabled:cursor-not-allowed"
            >
              <RotateCcw size={16} className="inline mr-1" /> Clear
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={skipWord}
              className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              <SkipForward size={16} className="inline mr-1" /> Skip
            </motion.button>
          </div>
        </div>
        
        {/* Hidden input for keyboard focus */}
        <input
          ref={inputRef}
          type="text"
          className="absolute -left-[9999px] opacity-0 pointer-events-none"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      {/* Incorrect Answer Modal */}
      <AnimatePresence>
        {showIncorrectModal && incorrectAnswerData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">
                Incorrect!
              </h2>
              <p className="text-lg text-gray-700 mb-2">
                The correct answer was:
              </p>
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                {incorrectAnswerData.word.toUpperCase()}
              </div>
              <div className="text-lg text-gray-600 mb-4">
                ({incorrectAnswerData.translation})
              </div>
              <p className="text-sm text-gray-500">
                Moving to next word...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Lightbulb, Volume2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useUnifiedSpacedRepetition } from '../../../../hooks/useUnifiedSpacedRepetition';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';

// Type definitions
type PowerUp = 'shuffle_letters' | 'reveal_vowels' | 'show_length' | 'reveal_letter';

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
}

// Power-up definitions (simplified)
const POWER_UPS = {
  shuffle_letters: { name: 'Shuffle', icon: '�', description: 'Shuffle scrambled letters', cost: 20 },
  reveal_vowels: { name: 'Vowels', icon: '🅰️', description: 'Highlight all vowels', cost: 30 },
  show_length: { name: 'Length', icon: '📏', description: 'Show word length', cost: 25 },
  reveal_letter: { name: 'Reveal Letter', icon: '🔍', description: 'Reveal one correct letter', cost: 35 }
};

// Sound system
class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    const soundFiles = {
      correct: 'https://cdn.jsdelivr.net/gh/devdattagupta/sounds@main/correct.mp3',
      wrong: 'https://cdn.jsdelivr.net/gh/devdattagupta/sounds@main/wrong.mp3',
      powerup: 'https://cdn.jsdelivr.net/gh/devdattagupta/sounds@main/powerup.mp3',
      select: 'https://cdn.jsdelivr.net/gh/devdattagupta/sounds@main/select.mp3',
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

// Particle system (using a simple confetti library if available)
const confetti = (options: any) => {
  // A dummy confetti function to prevent errors if the library isn't loaded
  if (typeof window !== 'undefined' && typeof window.confetti === 'function') {
    (window.confetti as any)(options);
  } else {
    console.warn("Confetti library not available. Install https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js");
  }
};

const createParticleEffect = (type: 'success' | 'powerup') => {
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
  isSelected,
  canMove = true
}: {
  letter: string;
  index: number;
  isVowelRevealed?: boolean;
  isLetterRevealed?: boolean;
  onClick?: (index: number) => void;
  isSelected?: boolean;
  canMove?: boolean;
}) => {
  const isVowel = 'aeiouAEIOUáéíóúÁÉÍÓÚ'.includes(letter);
  
  return (
    <motion.button
      onClick={() => onClick?.(index)}
      className={`
        relative inline-block mx-1 px-3 py-2 text-2xl font-bold rounded-lg shadow-lg
        ${isSelected ? 'bg-purple-500 text-white scale-110' : 'bg-white text-gray-800 hover:bg-gray-100'}
        ${(isVowelRevealed && isVowel) || isLetterRevealed ? 'bg-yellow-300 text-black ring-4 ring-yellow-500' : ''}
        ${!canMove ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
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
      {(isVowelRevealed && isVowel) || isLetterRevealed && (
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
  onProgressUpdate
}: WordScrambleGameProps) {
  // Initialize FSRS spaced repetition system
  const { recordWordPractice, algorithm } = useUnifiedSpacedRepetition('word-scramble');
  const [currentWordData, setCurrentWordData] = useState<GameVocabularyWord | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
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
  const [isVowelRevealed, setIsVowelRevealed] = useState(false);
  const [showWordLength, setShowWordLength] = useState(false);
  const [usedRevealLetter, setUsedRevealLetter] = useState(false);
  const [wordStartTime, setWordStartTime] = useState(Date.now());
  const [solveHistory, setSolveHistory] = useState<number[]>([]);

  // Track completed words and current word index for proper completion logic
  const [completedWordIds, setCompletedWordIds] = useState<Set<string>>(new Set());
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [remainingWords, setRemainingWords] = useState<GameVocabularyWord[]>([]);

  // Refs
  const soundManager = useRef<SoundManager>(new SoundManager());

  // Scramble word function
  const scrambleWord = useCallback((word: string): string[] => {
    const letters = word.split('');
    // Simple shuffle for a single difficulty level
    for (let i = letters.length - 1; i > 0; i--) {
      const k = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[k]] = [letters[k], letters[i]];
    }
    return letters;
  }, []);

  // Initialize remaining words when vocabulary loads
  useEffect(() => {
    if (vocabulary && vocabulary.length > 0) {
      // Initialize remaining words list (shuffle for variety but ensure all words are used)
      const shuffledVocabulary = [...vocabulary].sort(() => Math.random() - 0.5);
      setRemainingWords(shuffledVocabulary);
      setCurrentWordIndex(0);
      setCompletedWordIds(new Set());
      console.log('🎯 [WORD SCRAMBLE] Initialized with', vocabulary.length, 'words to complete');
    }
  }, [vocabulary]);

  // Initialize new word
  const initializeNewWord = useCallback(() => {
    if (!remainingWords || remainingWords.length === 0) {
      // Handle case with no vocabulary
      setGameState('completed');
      console.log('🎯 [WORD SCRAMBLE] Game completed - no more words');
      return;
    }

    // Check if all words have been completed
    if (currentWordIndex >= remainingWords.length) {
      setGameState('completed');
      console.log('🎯 [WORD SCRAMBLE] Game completed - all', remainingWords.length, 'words finished');

      // Call completion handlers
      if (onGameComplete) {
        onGameComplete({
          won: true,
          score: gameStats.score,
          stats: gameStats,
          wordsCompleted: completedWordIds.size,
          totalWords: remainingWords.length
        });
      }
      if (onGameEnd) {
        onGameEnd({
          won: true,
          score: gameStats.score,
          stats: gameStats
        });
      }
      return;
    }

    // Get the next word in sequence
    const nextWord = remainingWords[currentWordIndex];
    setCurrentWordData(nextWord);
    setScrambledLetters(scrambleWord(nextWord.word));
    setSelectedLetters([]);
    setUserAnswer('');
    setIsVowelRevealed(false);
    setShowWordLength(false);
    setUsedRevealLetter(false);
    setWordStartTime(Date.now());

    console.log('🎯 [WORD SCRAMBLE] Word', currentWordIndex + 1, 'of', remainingWords.length, ':', nextWord.word);
  }, [remainingWords, currentWordIndex, completedWordIds, gameStats, onGameComplete, onGameEnd, scrambleWord]);

  // Initial game setup - start first word when remaining words are ready
  useEffect(() => {
    if (remainingWords.length > 0 && !currentWordData && currentWordIndex === 0) {
      initializeNewWord();
    }
  }, [remainingWords, currentWordData, currentWordIndex, initializeNewWord]);

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
    return true;
  }, [currentWordData, userAnswer]);

  // Submit answer
  const submitAnswer = useCallback(async () => {
    if (gameState !== 'playing' || !userAnswer.trim()) return;

    const solveTime = (Date.now() - wordStartTime) / 1000;
    const isCorrect = checkAnswer();

    // Record word practice with FSRS system (for both assignment and free play modes)
    if (currentWordData && userId) {
      try {
        // 🔍 INSTRUMENTATION: Debug vocabulary ID passing
        console.log('🔍 [FSRS DEBUG] Current word data:', {
          currentWordId: currentWordData.id,
          currentWordIdType: typeof currentWordData.id,
          currentWordWord: currentWordData.word,
          currentWordTranslation: currentWordData.translation
        });

        // Ensure vocabulary ID is properly preserved - use multiple fallbacks
        const vocabularyId = currentWordData.id ||
                           (currentWordData as any).vocabularyId ||
                           (currentWordData as any).centralized_vocabulary_id ||
                           null;

        if (!vocabularyId) {
          console.error('🚨 [FSRS ERROR] No vocabulary ID found for word:', {
            currentWordData,
            currentWordDataKeys: Object.keys(currentWordData)
          });
        }

        const wordData = {
          id: vocabularyId,
          word: currentWordData.word,
          translation: currentWordData.translation,
          language: language === 'spanish' ? 'es' : language === 'french' ? 'fr' : language === 'german' ? 'de' : 'es'
        };

        console.log('🔍 [FSRS DEBUG] Word data being passed to FSRS:', wordData);

        // Only proceed with FSRS if we have a valid vocabulary ID
        if (!vocabularyId) {
          console.error('🚨 [FSRS ERROR] Skipping FSRS - no vocabulary ID available');
        } else {
          // Calculate confidence for word scramble game (higher confidence than luck-based games)
          const baseConfidence = isCorrect ? 0.7 : 0.3; // Higher confidence for skill-based game
          const speedBonus = solveTime < 5 ? 0.1 : solveTime < 10 ? 0.05 : 0;
          const streakBonus = gameStats.streak > 3 ? 0.05 : 0;
          const confidence = Math.max(0.1, Math.min(0.9, baseConfidence + speedBonus + streakBonus));

          // Record practice with FSRS (works in both assignment and free play modes)
          const fsrsResult = await recordWordPractice(
            wordData,
            isCorrect,
            solveTime * 1000, // Convert to milliseconds
            confidence
          );

          if (fsrsResult) {
            console.log(`FSRS recorded for ${currentWordData.word}:`, {
              algorithm: fsrsResult.algorithm,
              points: fsrsResult.points,
              nextReview: fsrsResult.nextReviewDate,
              interval: fsrsResult.interval,
              masteryLevel: fsrsResult.masteryLevel
            });
          }
        }
      } catch (error) {
        console.error('Error recording FSRS practice:', error);
      }

      // Record vocabulary interaction using gems-first system
      if (gameSessionId) {
        try {
          // 🔍 INSTRUMENTATION: Log vocabulary tracking details
          console.log('🔍 [VOCAB TRACKING] Starting vocabulary tracking for word:', {
            wordId: currentWordData.id,
            wordIdType: typeof currentWordData.id,
            word: currentWordData.word,
            translation: currentWordData.translation,
            isCorrect: isCorrect,
            gameSessionId,
            responseTimeMs: solveTime * 1000
          });

          // Only record gems directly if NOT in assignment mode
          // In assignment mode, the wrapper handles gem recording to avoid duplicates
          if (!isAssignmentMode) {
            try {
              // Use EnhancedGameSessionService for gems-first vocabulary tracking
              // Skip spaced repetition since FSRS is already handling it
              const sessionService = new EnhancedGameSessionService();
              const gemEvent = await sessionService.recordWordAttempt(gameSessionId, 'word-scramble', {
                vocabularyId: currentWordData.id, // Use UUID directly
                wordText: currentWordData.word,
                translationText: currentWordData.translation,
                responseTimeMs: Math.round(solveTime * 1000),
                wasCorrect: isCorrect,
                hintUsed: gameStats.hintsUsed > 0, // Track if hints were used this session
                streakCount: gameStats.streak + (isCorrect ? 1 : 0),
                masteryLevel: isCorrect ? 2 : 1, // Higher mastery for skill-based game
                maxGemRarity: isCorrect ? (gameStats.streak > 5 ? 'rare' : 'uncommon') : 'common',
                gameMode: 'word_scramble',
                difficultyLevel: difficulty
              });

              if (gemEvent) {
                console.log('🔍 [VOCAB TRACKING] Gem awarded:', {
                  rarity: gemEvent.rarity,
                  xpValue: gemEvent.xpValue,
                  wordText: gemEvent.wordText
                });
              }
            } catch (error) {
              console.error('Error recording vocabulary interaction:', error);
            }
          }
        } catch (error) {
          console.error('Error in vocabulary tracking:', error);
        }
      }

    if (isCorrect) {
      soundManager.current.play('correct');
      createParticleEffect('success');

      const points = Math.floor(Math.max(30, currentWordData!.word.length * 10) * (1 + gameStats.streak * 0.1));

      setGameStats(prev => ({
        ...prev,
        score: prev.score + points,
        streak: prev.streak + 1,
        wordsCompleted: prev.wordsCompleted + 1,
        avgSolveTime: (prev.avgSolveTime * prev.wordsCompleted + solveTime) / (prev.wordsCompleted + 1),
      }));

      // Mark current word as completed and advance to next word
      if (currentWordData) {
        setCompletedWordIds(prev => new Set([...prev, currentWordData.id]));
        setCurrentWordIndex(prev => prev + 1);

        console.log('🎯 [WORD SCRAMBLE] Word completed:', currentWordData.word,
                   '- Progress:', currentWordIndex + 1, '/', remainingWords.length);
      }

      setTimeout(() => {
        initializeNewWord();
      }, 1500);
    } else {
      soundManager.current.play('wrong');
      setGameStats(prev => ({
        ...prev,
        streak: 0,
      }));
      setSelectedLetters([]);
      setUserAnswer('');
    }
  }, [gameState, userAnswer, checkAnswer, currentWordData, gameStats, initializeNewWord, wordStartTime, userId, language, recordWordPractice]);

  // Power-up handlers
  const usePowerUp = useCallback((powerUp: PowerUp) => {
    if (!currentWordData) return;

    // A power-up can only be used once per word
    const isUsedForWord = (powerUp === 'reveal_letter' && usedRevealLetter) ||
                          (powerUp === 'reveal_vowels' && isVowelRevealed) ||
                          (powerUp === 'show_length' && showWordLength);
    
    if (isUsedForWord || gameStats.score < POWER_UPS[powerUp].cost) return;

    setGameStats(prev => ({ 
      ...prev, 
      score: prev.score - POWER_UPS[powerUp].cost, 
      hintsUsed: prev.hintsUsed + 1 
    }));
    soundManager.current.play('powerup');
    createParticleEffect('powerup');

    switch (powerUp) {
      case 'shuffle_letters':
        setScrambledLetters(scrambleWord(currentWordData.word));
        setSelectedLetters([]);
        setUserAnswer('');
        break;
      case 'reveal_vowels':
        setIsVowelRevealed(true);
        break;
      case 'show_length':
        setShowWordLength(true);
        break;
      case 'reveal_letter':
        // Reveal a single correct letter
        setUsedRevealLetter(true);
        const correctWord = currentWordData.word.toLowerCase();
        const currentAnswerLetters = selectedLetters.map(idx => scrambledLetters[idx].toLowerCase());

        let revealedIndex = -1;
        for (let i = 0; i < correctWord.length; i++) {
            if (currentAnswerLetters[i] !== correctWord[i]) {
                const targetLetter = correctWord[i];
                const availableScrambledIndices = scrambledLetters
                    .map((_, i) => i)
                    .filter(i => !selectedLetters.includes(i));
                
                for (const idx of availableScrambledIndices) {
                    if (scrambledLetters[idx].toLowerCase() === targetLetter) {
                        revealedIndex = idx;
                        break;
                    }
                }
                if (revealedIndex !== -1) break;
            }
        }
        
        if (revealedIndex !== -1) {
            setSelectedLetters(prev => {
                const newSelected = [...prev];
                newSelected.push(revealedIndex);
                return newSelected;
            });
        }
        break;
    }
  }, [gameStats.score, currentWordData, scrambleWord, usedRevealLetter, isVowelRevealed, showWordLength, selectedLetters, scrambledLetters]);

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
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Assignment Complete!
          </h2>
          <p className="text-white/70 mb-6">
            You've successfully completed all {remainingWords.length} words!
          </p>

          {/* Final Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-300">{gameStats.score.toLocaleString()}</div>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex flex-col justify-between">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/10"></div>
      
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
              Word Scramble
            </h1>
          </div>
          
          <div className="flex items-center gap-3 invisible"> {/* Spacer to align title */}
            <motion.button className="px-4 py-2">⚙️</motion.button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-blue-400/30">
            <div className="text-xl font-bold text-yellow-300">{gameStats.score.toLocaleString()}</div>
            <div className="text-xs text-white/70">Score</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-green-400/30">
            <div className="text-xl font-bold">{gameStats.streak}</div>
            <div className="text-xs text-white/70">Streak</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-orange-400/30">
            <div className="text-xl font-bold">{gameStats.wordsCompleted}</div>
            <div className="text-xs text-white/70">Words</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-3 text-center text-white border border-purple-400/30">
            <div className="text-xl font-bold">{currentWordIndex + 1} / {remainingWords.length}</div>
            <div className="text-xs text-white/70">Progress</div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative z-10 px-6 flex-1 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full mx-auto">
          
          {/* Current Word Info - Always show translation */}
          <div className="text-center mb-8">
            <motion.div
              key={currentWordData.word}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4"
            >
              <div className="text-white text-lg font-semibold mb-2">
                Translation: <span className="text-yellow-300">{currentWordData.translation}</span>
              </div>
              {showWordLength && (
                <div className="text-white/70 mb-2">
                  Word Length: {currentWordData.word.length} letters
                </div>
              )}
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
                  isLetterRevealed={false} // Removed this logic for simplification
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
                {userAnswer.toUpperCase() || 'Click letters to build the word...'}
              </div>
            </motion.div>
          </div>

          {/* Power-ups Panel */}
          <div className="mb-8">
            <h3 className="text-white text-xl font-bold mb-4 text-center">⚡ Power-ups</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(POWER_UPS).map(([key, powerUp]) => {
                const powerUpKey = key as PowerUp;
                const canAfford = gameStats.score >= powerUp.cost;
                const isUsedForWord = (powerUpKey === 'reveal_letter' && usedRevealLetter) ||
                                      (powerUpKey === 'reveal_vowels' && isVowelRevealed) ||
                                      (powerUpKey === 'show_length' && showWordLength);
                
                const isDisabled = !canAfford || isUsedForWord;

                return (
                  <motion.button
                    key={key}
                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    onClick={() => !isDisabled && usePowerUp(powerUpKey)}
                    className={`
                      p-3 rounded-lg text-center transition-all border
                      ${isUsedForWord
                        ? 'bg-green-500/30 border-green-400 text-green-300'
                        : !isDisabled
                          ? 'bg-white/10 hover:bg-white/20 border-white/30 text-white'
                          : 'bg-gray-600/20 border-gray-600 text-gray-400 cursor-not-allowed'
                      }
                    `}
                    disabled={isDisabled}
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

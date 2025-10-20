'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Pause, Play, Volume2, VolumeX, Settings } from 'lucide-react';
import { GameVocabularyWord } from '../../../../hooks/useGameVocabulary';
import { VocabBlastGameSettings } from '../page';
import { useTheme } from '../../noughts-and-crosses/components/ThemeProvider';
import { useAudio } from '../../vocab-blast/hooks/useAudio';
import VocabBlastEngine from './VocabBlastEngine';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import UniversalThemeSelector from '../../../../components/games/UniversalThemeSelector';
import { assignmentExposureService } from '../../../../services/assignments/AssignmentExposureService';

interface VocabBlastGameProps {
  settings: VocabBlastGameSettings;
  vocabulary: GameVocabularyWord[];
  onBackToMenu: () => void;
  onBackToAssignment?: () => void; // For assignment mode
  onGameEnd: (result: {
    outcome: 'win' | 'loss' | 'timeout';
    score: number;
    wordsLearned: number;
    correctAnswers: number;
    incorrectAnswers: number;
    totalAttempts: number;
    accuracy: number;
    timeSpent: number;
    detailedStats: {
      wordAttempts: Array<{
        word: string;
        translation: string;
        isCorrect: boolean;
        responseTime: number;
        timestamp: number;
      }>;
    };
  }) => void;
  gameSessionId?: string | null;
  isAssignmentMode?: boolean;
  onOpenSettings?: () => void;
  // Theme selector props for assignment mode
  assignmentTheme?: string;
  onAssignmentThemeChange?: (theme: string) => void;
  showAssignmentThemeSelector?: boolean;
  onToggleAssignmentThemeSelector?: () => void;
}

export interface VocabItem {
  id: string;
  word: string;
  translation: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
  type: 'correct' | 'decoy';
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  wordsLearned: number;
  accuracy: number;
  lives: number;
  totalAttempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startTime: number;
  // New win condition fields
  targetScore: number;
  targetWordsLearned: number;
  targetCombo: number;
  progressPercentage: number;
}

interface WordAttempt {
  word: string;
  translation: string;
  isCorrect: boolean;
  responseTime: number;
  timestamp: number;
}

export default function VocabBlastGame({
  settings,
  vocabulary,
  onBackToMenu,
  onBackToAssignment,
  onGameEnd,
  gameSessionId,
  isAssignmentMode,
  onOpenSettings,
  assignmentTheme,
  onAssignmentThemeChange,
  showAssignmentThemeSelector,
  onToggleAssignmentThemeSelector
}: VocabBlastGameProps) {
  const { themeClasses } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const { playSFX, playThemeSFX, startBackgroundMusic, stopBackgroundMusic } = useAudio(soundEnabled);

  // Story modal state - for audio initiation and game start
  const [storyDismissed, setStoryDismissed] = useState(false);

  // Theme selection state
  const [showThemeSelector, setShowThemeSelector] = useState(!settings.theme || settings.theme === 'default');
  const [selectedTheme, setSelectedTheme] = useState(settings.theme || 'default');

  // Initialize FSRS spaced repetition system

  // Start music on first user interaction
  const startMusicOnInteraction = () => {
    if (!musicStarted && soundEnabled) {
      startBackgroundMusic(settings.theme);
      setMusicStarted(true);
    }
  };

  // Game state - using refs for values that don't need to trigger re-renders
  const [gameActive, setGameActive] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | 'timeout' | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWord, setCurrentWord] = useState<GameVocabularyWord | null>(null);
  const currentWordStartTimeRef = useRef<number>(0);

  // Calculate win condition targets - fixed values as requested
  const targets = useMemo(() => ({
    targetScore: 1500,
    targetWordsLearned: 15,
    targetCombo: 7
  }), []);

  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    wordsLearned: 0,
    accuracy: 0,
    lives: 3,
    totalAttempts: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    startTime: Date.now(),
    targetScore: targets.targetScore,
    targetWordsLearned: targets.targetWordsLearned,
    targetCombo: targets.targetCombo,
    progressPercentage: 0
  });

  // Detailed analytics tracking
  const [wordAttempts, setWordAttempts] = useState<WordAttempt[]>([]);

  // Vocabulary management - use refs for non-rendering state
  const usedWordsRef = useRef<Set<string>>(new Set());
  const [availableWords, setAvailableWords] = useState<GameVocabularyWord[]>([]);

  // 🎯 LAYER 1: Session deduplication - track words used in this session (assignment mode only)
  const usedWordsThisSessionRef = useRef<Set<string>>(new Set());

  // Game timers (removed main countdown timer)
  const wordSpawnRef = useRef<NodeJS.Timeout | null>(null);
  const winCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Refs for preventing race conditions
  const gameStatsRef = useRef(gameStats);
  const isProcessingAnswerRef = useRef(false);
  const gameEndedRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    gameStatsRef.current = gameStats;
  }, [gameStats]);

  useEffect(() => {
    gameEndedRef.current = gameEnded;
  }, [gameEnded]);

  // 🎯 LAYER 2: Record word exposures on unmount (assignment mode only)
  useEffect(() => {
    return () => {
      if (isAssignmentMode && gameSessionId) {
        // Extract assignmentId from gameSessionId or use a prop
        const exposedWordIds = Array.from(usedWordsThisSessionRef.current);
        if (exposedWordIds.length > 0) {
          console.log('📝 [LAYER 2] Recording word exposures on unmount:', {
            gameSessionId,
            wordCount: exposedWordIds.length
          });

          // Note: We need assignmentId - this should be passed as a prop
          // For now, we'll log this and handle it when we have the assignmentId available
          console.warn('⚠️ [LAYER 2] assignmentId needed for exposure recording');
        }
      }
    };
  }, [isAssignmentMode, gameSessionId]);

  // Initialize game
  useEffect(() => {
    if (vocabulary.length > 0) {
      setAvailableWords([...vocabulary]);
      selectNextWord();
      setGameActive(true);
      startWordSpawning();
      startWinConditionCheck();
      // Don't start background music immediately - wait for user interaction
    }

    return () => {
      if (wordSpawnRef.current) {
        clearInterval(wordSpawnRef.current);
      }
      if (winCheckRef.current) {
        clearInterval(winCheckRef.current);
      }
      stopBackgroundMusic();
    };
  }, [vocabulary]);

  // Check win conditions periodically
  const startWinConditionCheck = () => {
    if (winCheckRef.current) {
      clearInterval(winCheckRef.current);
    }

    winCheckRef.current = setInterval(() => {
      setGameStats(prev => {
        // Calculate progress percentage based on multiple criteria
        const scoreProgress = Math.min(prev.score / prev.targetScore, 1);
        const wordsProgress = Math.min(prev.wordsLearned / prev.targetWordsLearned, 1);
        const comboProgress = Math.min(prev.maxCombo / prev.targetCombo, 1);

        // Use weighted average (score 50%, words 30%, combo 20%)
        const progressPercentage = (scoreProgress * 0.5) + (wordsProgress * 0.3) + (comboProgress * 0.2);

        // Check for win condition (any of the targets reached)
        const hasWon = prev.score >= prev.targetScore ||
          prev.wordsLearned >= prev.targetWordsLearned ||
          prev.maxCombo >= prev.targetCombo;

        if (hasWon && !gameEnded) {
          setTimeout(() => endGame('win'), 0);
        }

        return { ...prev, progressPercentage: progressPercentage * 100 };
      });
    }, 1000);
  };

  // Removed automatic word spawning - words should only change when answered
  const startWordSpawning = () => {
    // No longer automatically spawn new words on a timer
    // Words will only change when handleCorrectAnswer or handleIncorrectAnswer is called
    if (wordSpawnRef.current) {
      clearInterval(wordSpawnRef.current);
      wordSpawnRef.current = null;
    }
  };

  const selectNextWord = useCallback(() => {
    try {
      // 🛑 CRITICAL: Don't select words if game has ended (prevents crash on win)
      if (gameEndedRef.current || !gameActive) {
        console.log('🛑 [WORD SELECT] Game ended or inactive, skipping word selection');
        return;
      }

      if (!availableWords || availableWords.length === 0) {
        console.warn('No available words to select from');
        return;
      }

      const unused = availableWords.filter(word => word && word.id && !usedWordsRef.current.has(word.id));

      let selectedWord: GameVocabularyWord;

      if (unused.length === 0) {
        // Reset if we've used all words
        console.log('🔄 All words used, resetting pool');
        usedWordsRef.current = new Set();
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        selectedWord = availableWords[randomIndex];
      } else {
        const randomIndex = Math.floor(Math.random() * unused.length);
        selectedWord = unused[randomIndex];
      }

      // Always set the word, even if it doesn't have an ID (log warning)
      if (!selectedWord || !selectedWord.id) {
        console.error('⚠️ Selected word is invalid:', selectedWord);
        // Fallback to first available word with an ID
        selectedWord = availableWords.find(w => w && w.id) || availableWords[0];
      }

      if (selectedWord) {
        console.log('✅ Next word selected:', selectedWord.word);
        setCurrentWord(selectedWord);
        currentWordStartTimeRef.current = Date.now();
      } else {
        console.error('❌ CRITICAL: No valid words available!');
      }
    } catch (error) {
      console.error('Error selecting next word:', error);
      // Fallback to first available word
      if (availableWords && availableWords.length > 0) {
        const fallbackWord = availableWords[0];
        console.log('🔧 Using fallback word:', fallbackWord?.word);
        setCurrentWord(fallbackWord);
        currentWordStartTimeRef.current = Date.now();
      }
    }
  }, [availableWords, gameActive]);

  const handleCorrectAnswer = useCallback(async (word: GameVocabularyWord) => {
    try {
      // Prevent duplicate processing
      if (isProcessingAnswerRef.current) {
        console.log('⚠️ Already processing an answer, skipping');
        return;
      }

      if (!word || !word.id) {
        console.warn('Invalid word object passed to handleCorrectAnswer');
        return;
      }

      isProcessingAnswerRef.current = true;

      startMusicOnInteraction(); // Start music on first interaction
      playSFX('correct-answer');
      playThemeSFX(settings.theme);

      const responseTime = Date.now() - currentWordStartTimeRef.current;

      // Track detailed word attempt
      const attempt: WordAttempt = {
        word: word.word,
        translation: word.translation,
        isCorrect: true,
        responseTime,
        timestamp: Date.now()
      };
      setWordAttempts(prev => [...prev, attempt]);

      // Update stats immediately
      setGameStats(prev => {
        const newWordsLearned = prev.wordsLearned + 1;
        const newTotalAttempts = prev.totalAttempts + 1;
        const newCorrectAnswers = prev.correctAnswers + 1;

        return {
          ...prev,
          score: prev.score + (10 * (prev.combo + 1)),
          combo: prev.combo + 1,
          maxCombo: Math.max(prev.maxCombo, prev.combo + 1),
          wordsLearned: newWordsLearned,
          totalAttempts: newTotalAttempts,
          correctAnswers: newCorrectAnswers,
          accuracy: (newCorrectAnswers / newTotalAttempts) * 100
        };
      });

      usedWordsRef.current.add(word.id);

      // 🎯 LAYER 1: Mark word as used in this session (assignment mode only)
      if (isAssignmentMode && word.id) {
        usedWordsThisSessionRef.current.add(word.id);
        console.log(`🎯 [LAYER 1] Marked word as used: ${word.id} (total: ${usedWordsThisSessionRef.current.size})`);
      }

      // ⚡ INSTANT: Move to next word immediately
      selectNextWord();

      // Reset processing flag
      isProcessingAnswerRef.current = false;

      // Background processing - don't await, let it run async
      Promise.resolve().then(async () => {
        // Record gems in both assignment and free play modes
        if (gameSessionId && word.id) {
          try {
            const sessionService = new EnhancedGameSessionService();
            const gemEvent = await sessionService.recordWordAttempt(gameSessionId, 'vocab-blast', {
              vocabularyId: word.id,
              wordText: word.word,
              translationText: word.translation,
              responseTimeMs: responseTime,
              wasCorrect: true,
              hintUsed: false,
              streakCount: gameStatsRef.current.combo,
              masteryLevel: 1,
              maxGemRarity: 'rare',
              gameMode: 'action_click',
              difficultyLevel: settings.difficulty
            }, true); // Skip FSRS for instant feedback

            if (gemEvent) {
              console.log(`🔮 Vocab Blast earned ${gemEvent.rarity} gem (${gemEvent.xpValue} XP) for "${word.word}"`);
            }
          } catch (error) {
            console.error('Failed to record vocabulary interaction:', error);
          }
        }
      }).catch(error => {
        console.error('Error in background processing:', error);
      });
    } catch (error) {
      console.error('Error handling correct answer:', error);
      // Continue game flow even if there's an error
      isProcessingAnswerRef.current = false;
      selectNextWord();
    }
  }, [selectNextWord, playSFX, playThemeSFX, settings.theme, settings.difficulty, settings.language, gameSessionId, isAssignmentMode, startMusicOnInteraction]);

  const handleIncorrectAnswer = useCallback(async () => {
    try {
      startMusicOnInteraction(); // Start music on first interaction
      playSFX('wrong-answer');

      const responseTime = Date.now() - currentWordStartTimeRef.current;

      // Record word practice with FSRS system for incorrect answer (works in both assignment and free play modes)
      if (currentWord) {
        try {
          const wordData = {
            id: currentWord.id || `${currentWord.word}-${currentWord.translation}`,
            word: currentWord.word,
            translation: currentWord.translation,
            language: settings.language === 'spanish' ? 'es' : settings.language === 'french' ? 'fr' : 'en'
          };

          // Record gem for incorrect answer using EnhancedGameSessionService
          if (gameSessionId && currentWord.id) {
            console.log('🎮 [VOCAB BLAST] Attempting to record INCORRECT answer gem:', {
              vocabularyId: currentWord.id,
              gameSessionId,
              word: currentWord.word,
              isCorrect: false
            });

            try {
              const { EnhancedGameSessionService } = await import('../../../../services/rewards/EnhancedGameSessionService');
              const sessionService = new EnhancedGameSessionService();

              const gemEvent = await sessionService.recordWordAttempt(gameSessionId, 'vocab-blast', {
                vocabularyId: currentWord.id,
                wordText: currentWord.word,
                translationText: currentWord.translation,
                responseTimeMs: responseTime,
                wasCorrect: false, // INCORRECT ANSWER
                hintUsed: false,
                streakCount: 0, // Reset streak on incorrect
                masteryLevel: 1,
                maxGemRarity: 'common',
                gameMode: 'typing',
                difficultyLevel: settings.difficulty
              }, true); // Skip FSRS for speed

              if (gemEvent) {
                console.log('✅ [VOCAB BLAST] Incorrect answer recorded successfully:', gemEvent);
              } else {
                console.warn('⚠️ [VOCAB BLAST] No gem event returned for incorrect answer');
              }
            } catch (error) {
              console.error('🚨 [VOCAB BLAST] Gem recording failed for incorrect answer:', error);
            }
          } else {
            console.warn('⚠️ [VOCAB BLAST] Skipping incorrect answer gem recording:', {
              hasGameSessionId: !!gameSessionId,
              hasVocabularyId: !!currentWord.id,
              gameSessionId,
              vocabularyId: currentWord.id
            });
          }
        } catch (error) {
          console.error('Error recording FSRS failed practice:', error);
        }
      }

      // Track detailed word attempt for incorrect answer
      if (currentWord) {
        const attempt: WordAttempt = {
          word: currentWord.word,
          translation: currentWord.translation,
          isCorrect: false,
          responseTime,
          timestamp: Date.now()
        };
        setWordAttempts(prev => [...prev, attempt]);
      }

      setGameStats(prev => {
        const newLives = prev.lives - 1;
        const newTotalAttempts = prev.totalAttempts + 1;
        const newIncorrectAnswers = prev.incorrectAnswers + 1;

        // Check if game should end due to no lives
        if (newLives <= 0 && !gameEnded) {
          setTimeout(() => endGame('loss'), 100);
        }

        return {
          ...prev,
          combo: 0,
          lives: newLives,
          totalAttempts: newTotalAttempts,
          incorrectAnswers: newIncorrectAnswers,
          accuracy: prev.correctAnswers > 0 ? (prev.correctAnswers / newTotalAttempts) * 100 : 0
        };
      });

      // Continue spawning new words even after wrong answer
      if (gameStatsRef.current.lives > 1) {
        selectNextWord();
      }
    } catch (error) {
      console.error('Error handling incorrect answer:', error);
      // Continue game flow even if there's an error
      if (gameStatsRef.current.lives > 1) {
        selectNextWord();
      }
    }
  }, [selectNextWord, playSFX, currentWord, settings.language, gameSessionId, startMusicOnInteraction]);

  const togglePause = () => {
    setIsPaused(!isPaused);

    if (!isPaused) {
      if (winCheckRef.current) {
        clearInterval(winCheckRef.current);
      }
    } else {
      startWinConditionCheck();
    }
  };

  const restartGame = useCallback(() => {
    // Reset all game state
    setGameEnded(false);
    gameEndedRef.current = false;
    setGameResult(null);
    setGameActive(true);
    setIsPaused(false);

    // Reset game stats
    setGameStats({
      score: 0,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      wordsLearned: 0,
      accuracy: 100,
      startTime: Date.now(),
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalAttempts: 0,
      progressPercentage: 0,
      ...targets
    });

    // Reset word tracking
    usedWordsRef.current = new Set();
    setAvailableWords([...vocabulary]);
    setWordAttempts([]);

    // Select new word and restart game loops
    selectNextWord();
    startWordSpawning();
    startWinConditionCheck();
  }, [vocabulary, targets, selectNextWord]);

  const endGame = (outcome: 'win' | 'loss' | 'timeout') => {
    // Prevent multiple calls to endGame
    if (gameEnded) {
      console.log('Game already ended, ignoring duplicate endGame call');
      return;
    }

    setGameEnded(true);
    setGameResult(outcome);
    setGameActive(false);
    if (winCheckRef.current) {
      clearInterval(winCheckRef.current);
    }
    if (wordSpawnRef.current) {
      clearInterval(wordSpawnRef.current);
    }
    stopBackgroundMusic();

    const timeSpent = Math.round((Date.now() - gameStats.startTime) / 1000);

    onGameEnd({
      outcome,
      score: gameStats.score,
      wordsLearned: gameStats.wordsLearned,
      correctAnswers: gameStats.correctAnswers,
      incorrectAnswers: gameStats.incorrectAnswers,
      totalAttempts: gameStats.totalAttempts,
      accuracy: gameStats.accuracy,
      timeSpent,
      detailedStats: {
        wordAttempts
      }
    });
  };

  const getThemeTitle = () => {
    switch (settings.theme) {
      case 'tokyo':
        return '🌃 Neon Hack';
      case 'pirate':
        return '🏴‍☠️ Cannon Clash';
      case 'space':
        return '🚀 Comet Catch';
      case 'temple':
        return '🔥 Rising Lava Quiz';
      default:
        return '💎 Vocab Blast';
    }
  };

  const getThemeInstruction = () => {
    switch (settings.theme) {
      case 'tokyo':
        return 'Click the data packet with the correct translation';
      case 'pirate':
        return 'Fire at the ship with the correct translation';
      case 'space':
        return 'Collect the comet with the correct translation';
      case 'temple':
        return 'Click the stone tablet with the correct translation';
      default:
        return 'Click the gem with the correct translation';
    }
  };

  const getWinConditionText = () => {
    const conditions = [];
    if (gameStats.score < gameStats.targetScore) {
      conditions.push(`${gameStats.targetScore} points`);
    }
    if (gameStats.wordsLearned < gameStats.targetWordsLearned) {
      conditions.push(`${gameStats.targetWordsLearned} words`);
    }
    if (gameStats.maxCombo < gameStats.targetCombo) {
      conditions.push(`${gameStats.targetCombo} combo`);
    }

    if (conditions.length === 0) return 'Victory achieved!';
    return `Win by reaching: ${conditions.join(' OR ')}`;
  };

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Game UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Top Menu Bar - Single Line Layout */}
        <div className="flex items-center justify-between p-3 md:p-4 pointer-events-auto bg-black/40 backdrop-blur-sm border-b border-white/10">
          {/* Left Section: Menu, Pause, Settings */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={isAssignmentMode ? onBackToAssignment : onBackToMenu}
              className="flex items-center gap-1 md:gap-2 bg-black/60 hover:bg-black/80 text-white px-3 py-2 md:px-4 rounded-lg transition-all duration-200 text-sm md:text-base border border-white/20"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{isAssignmentMode ? 'Back' : 'Menu'}</span>
            </button>

            {!isAssignmentMode && (
              <button
                onClick={togglePause}
                className="flex items-center gap-1 md:gap-2 bg-black/60 hover:bg-black/80 text-white px-3 py-2 md:px-4 rounded-lg transition-all duration-200 text-sm md:text-base border border-white/20"
              >
                <Pause className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Pause</span>
              </button>
            )}

            {/* Settings button */}
            {onOpenSettings && (
              <motion.button
                onClick={() => {
                  playSFX('button-click');
                  if (isAssignmentMode && onToggleAssignmentThemeSelector) {
                    onToggleAssignmentThemeSelector();
                  } else {
                    onOpenSettings();
                  }
                }}
                className="relative px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm md:text-base font-semibold flex items-center gap-2 md:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isAssignmentMode ? "Change Theme" : "Customize your game: Change Language, Level, Topic & Theme"}
              >
                <Settings className="h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden md:inline">Game Settings</span>
                <span className="md:hidden">Settings</span>
              </motion.button>
            )}
          </div>

          {/* Center Section: Title */}
          <div className="text-center">
            <h1 className="text-lg md:text-xl font-bold text-white">{getThemeTitle()}</h1>
          </div>

          {/* Right Section: Stats and Controls - Spread out */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* Progress Stats - Spread out horizontally */}
            <div className="flex items-center gap-4 md:gap-6 text-white">
              <motion.div
                className="text-lg md:text-xl font-bold flex items-center gap-2"
                animate={{
                  scale: gameStats.progressPercentage >= 80 ? [1, 1.05, 1] : 1,
                  color: gameStats.progressPercentage >= 80 ? '#10B981' : '#FFFFFF'
                }}
                transition={{ duration: 0.5, repeat: gameStats.progressPercentage >= 80 ? Infinity : 0 }}
              >
                🎯 {Math.round(gameStats.progressPercentage)}%
              </motion.div>

              <div className="text-sm md:text-base font-medium">
                Score: {gameStats.score}/{gameStats.targetScore}
              </div>

              <div className="text-sm md:text-base font-medium">
                Words: {gameStats.wordsLearned}/{gameStats.targetWordsLearned}
              </div>

              <div className="flex items-center gap-2 text-sm md:text-base font-medium">
                <span>Lives:</span>
                <div className="flex gap-1">
                  {Array.from({ length: gameStats.lives }, (_, i) => (
                    <motion.span
                      key={`heart-${i}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-red-500"
                    >
                      ❤️
                    </motion.span>
                  ))}
                  {Array.from({ length: 3 - gameStats.lives }, (_, i) => (
                    <motion.span
                      key={`empty-${i}`}
                      initial={{ scale: 1 }}
                      animate={{ scale: 0.8, opacity: 0.5 }}
                      className="text-gray-500"
                    >
                      🖤
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mute Button */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1 md:gap-2 bg-black/60 hover:bg-black/80 text-white px-3 py-2 md:px-4 rounded-lg transition-all duration-200 text-sm md:text-base border border-white/20"
            >
              {soundEnabled ? <Volume2 className="w-3 h-3 md:w-4 md:h-4" /> : <VolumeX className="w-3 h-3 md:w-4 md:h-4" />}
            </button>
          </div>
        </div>

        {/* Current Word Display */}
        {currentWord && (
          <div className="absolute top-32 left-1/2 transform -translate-x-1/2 pointer-events-auto z-20">
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-black/80 backdrop-blur-sm text-white px-6 py-3 md:px-8 md:py-4 rounded-xl text-center border border-white/30 shadow-2xl"
            >
              <div className="text-xs md:text-sm text-slate-300 mb-1">Translate:</div>
              <div className="text-2xl md:text-3xl font-bold">{currentWord.word}</div>

              {/* Pulse animation for urgency */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-blue-400/50"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.02, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        )}

        {/* Game Stats with Progress Bar */}
        <div className="absolute bottom-4 left-4 text-white pointer-events-auto">
          <motion.div
            className="bg-black/60 backdrop-blur-sm p-3 md:p-4 rounded-lg min-w-[180px] md:min-w-[200px] border border-white/20"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-xs md:text-sm space-y-2">
              <motion.div
                animate={{
                  scale: gameStats.combo > 0 ? [1, 1.1, 1] : 1,
                  color: gameStats.combo >= 5 ? '#10B981' : '#FFFFFF'
                }}
                transition={{ duration: 0.3 }}
              >
                Combo: {gameStats.combo}x (Max: {gameStats.maxCombo})
              </motion.div>
              <div>Words Learned: {gameStats.wordsLearned}</div>
              <div>Accuracy: {Math.round(gameStats.accuracy)}%</div>

              {/* Enhanced Progress Bar */}
              <div className="mt-3">
                <div className="text-xs mb-1 flex justify-between">
                  <span>Progress to Win</span>
                  <span className="font-bold">{Math.round(gameStats.progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.min(gameStats.progressPercentage, 100)}%`,
                      background: gameStats.progressPercentage >= 80
                        ? 'linear-gradient(90deg, #10B981, #059669)'
                        : gameStats.progressPercentage >= 50
                          ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                          : 'linear-gradient(90deg, #3B82F6, #1D4ED8)'
                    }}
                    animate={{
                      boxShadow: gameStats.progressPercentage >= 80
                        ? ['0 0 0px #10B981', '0 0 10px #10B981', '0 0 0px #10B981']
                        : 'none'
                    }}
                    transition={{ duration: 1, repeat: gameStats.progressPercentage >= 80 ? Infinity : 0 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Game Engine */}
      {currentWord && (
        <VocabBlastEngine
          theme={settings.theme}
          currentWord={currentWord}
          vocabulary={availableWords}
          onCorrectAnswer={handleCorrectAnswer}
          onIncorrectAnswer={handleIncorrectAnswer}
          isPaused={isPaused}
          gameActive={gameActive}
          difficulty={settings.difficulty}
          playSFX={playSFX as (sound: string) => void}
        />
      )}

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && !isAssignmentMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Game Paused</h2>
              <button
                onClick={togglePause}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
              >
                Resume Game
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Modal */}
      <AnimatePresence>
        {gameEnded && gameResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl p-8 max-w-md w-full text-center text-white shadow-2xl"
            >
              {/* Result Icon and Title */}
              <div className="mb-6">
                {gameResult === 'win' ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 360] }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="text-7xl mb-4"
                    >
                      🏆
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-2">Victory!</h2>
                    <p className="text-lg text-white/90">Great job! You completed the game!</p>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="text-7xl mb-4"
                    >
                      💔
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-2">Game Over</h2>
                    <p className="text-lg text-white/90">Better luck next time!</p>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="bg-black/30 rounded-xl p-6 mb-6 space-y-3">
                <div className="flex justify-between text-lg">
                  <span>Score:</span>
                  <span className="font-bold">{gameStats.score}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Words Learned:</span>
                  <span className="font-bold">{gameStats.wordsLearned}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Max Combo:</span>
                  <span className="font-bold">{gameStats.maxCombo}x</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Accuracy:</span>
                  <span className="font-bold">{Math.round(gameStats.accuracy)}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    playSFX('button-click');
                    restartGame();
                  }}
                  className="w-full bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors text-lg"
                >
                  Play Again
                </button>

                <button
                  onClick={() => {
                    playSFX('button-click');
                    if (isAssignmentMode && onBackToAssignment) {
                      onBackToAssignment();
                    } else {
                      onBackToMenu();
                    }
                  }}
                  className="w-full bg-white/20 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/30 transition-colors text-lg"
                >
                  {isAssignmentMode ? 'Back to Assignment' : 'Back to Menu'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

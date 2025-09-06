'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Pause, Play, Volume2, VolumeX, Settings } from 'lucide-react';
import { GameVocabularyWord } from '../../../../hooks/useGameVocabulary';
import { VocabBlastGameSettings } from '../page';
import { useTheme } from '../../noughts-and-crosses/components/ThemeProvider';
import { useAudio } from '../../vocab-blast/hooks/useAudio';
import VocabBlastEngine from './VocabBlastEngine';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import UniversalThemeSelector from '../../../../components/games/UniversalThemeSelector';

interface VocabBlastGameProps {
  settings: VocabBlastGameSettings;
  vocabulary: GameVocabularyWord[];
  onBackToMenu: () => void;
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
  onGameEnd,
  gameSessionId,
  isAssignmentMode,
  onOpenSettings
}: VocabBlastGameProps) {
  const { themeClasses } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const { playSFX, playThemeSFX, startBackgroundMusic, stopBackgroundMusic } = useAudio(soundEnabled);

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

  // Game state
  const [gameActive, setGameActive] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWord, setCurrentWord] = useState<GameVocabularyWord | null>(null);
  const [currentWordStartTime, setCurrentWordStartTime] = useState<number>(0);
  // Calculate win condition targets based on difficulty and vocabulary size
  const calculateTargets = () => {
    const vocabSize = vocabulary.length;
    const difficultyMultiplier = settings.difficulty === 'easy' ? 0.8 :
      settings.difficulty === 'medium' ? 1.0 : 1.2;

    return {
      targetScore: Math.max(500, Math.floor(vocabSize * 50 * difficultyMultiplier)),
      targetWordsLearned: Math.max(10, Math.floor(vocabSize * 0.6)),
      targetCombo: Math.max(5, Math.floor(vocabSize * 0.3))
    };
  };

  const targets = calculateTargets();

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

  // Vocabulary management
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [availableWords, setAvailableWords] = useState<GameVocabularyWord[]>([]);

  // Game timers (removed main countdown timer)
  const wordSpawnRef = useRef<NodeJS.Timeout | null>(null);
  const winCheckRef = useRef<NodeJS.Timeout | null>(null);

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

  const selectNextWord = () => {
    try {
      if (!availableWords || availableWords.length === 0) {
        console.warn('No available words to select from');
        return;
      }

      const unused = availableWords.filter(word => word && word.id && !usedWords.has(word.id));

      if (unused.length === 0) {
        // Reset if we've used all words
        setUsedWords(new Set());
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const selectedWord = availableWords[randomIndex];
        if (selectedWord && selectedWord.id) {
          setCurrentWord(selectedWord);
        }
      } else {
        const randomIndex = Math.floor(Math.random() * unused.length);
        const nextWord = unused[randomIndex];
        if (nextWord && nextWord.id) {
          setCurrentWord(nextWord);
        }
      }
      setCurrentWordStartTime(Date.now());
    } catch (error) {
      console.error('Error selecting next word:', error);
      // Fallback to first available word
      if (availableWords && availableWords.length > 0 && availableWords[0]) {
        setCurrentWord(availableWords[0]);
        setCurrentWordStartTime(Date.now());
      }
    }
  };

  const handleCorrectAnswer = async (word: GameVocabularyWord) => {
    try {
      if (!word || !word.id) {
        console.warn('Invalid word object passed to handleCorrectAnswer');
        return;
      }

      startMusicOnInteraction(); // Start music on first interaction
      playSFX('correct-answer');
      playThemeSFX(settings.theme);

      const responseTime = Date.now() - currentWordStartTime;

      // Record word practice with FSRS system (works in both assignment and free play modes)
      if (word) {
        try {
          const wordData = {
            id: word.id || `${word.word}-${word.translation}`,
            word: word.word,
            translation: word.translation,
            language: settings.language === 'spanish' ? 'es' : settings.language === 'french' ? 'fr' : 'en'
          };

          // ✅ VOCABULARY TRACKING: Handled by GameAssignmentWrapper in assignment mode
          console.log('✅ [VOCAB BLAST] Vocabulary tracking handled by unified system');
        } catch (error) {
          console.error('Error in vocabulary tracking:', error);
        }
      }

      // Record gems in both assignment and free play modes
      if (gameSessionId) {
        try {
          // 🔍 INSTRUMENTATION: Log vocabulary tracking details
          console.log('🔍 [VOCAB TRACKING] Starting vocabulary tracking for word:', {
            wordId: word.id,
            wordIdType: typeof word.id,
            word: word.word,
            translation: word.translation,
            isCorrect: true,
            gameSessionId,
            responseTimeMs: responseTime
          });

          const sessionService = new EnhancedGameSessionService();
          const gemEvent = await sessionService.recordWordAttempt(gameSessionId, 'vocab-blast', {
            vocabularyId: word.id, // Use UUID directly, not parseInt
            wordText: word.word,
            translationText: word.translation,
            responseTimeMs: responseTime,
            wasCorrect: true,
            hintUsed: false, // No hints in vocab-blast
            streakCount: gameStats.combo + 1, // Use combo as streak
            masteryLevel: 1, // Default mastery for action games
            maxGemRarity: 'rare', // Cap at rare for fast-paced games
            gameMode: 'action_click',
            difficultyLevel: settings.difficulty
          }, true); // 🚀 FAST: Skip FSRS processing for instant feedback

          // 🔍 INSTRUMENTATION: Log gem event result
          console.log('🔍 [VOCAB TRACKING] Gem event result:', {
            gemEventExists: !!gemEvent,
            gemEvent: gemEvent ? {
              rarity: gemEvent.rarity,
              xpValue: gemEvent.xpValue,
              vocabularyId: gemEvent.vocabularyId,
              wordText: gemEvent.wordText
            } : null,
            wasCorrect: true
          });

          // Show gem feedback if gem was awarded
          if (gemEvent) {
            console.log(`🔮 Vocab Blast earned ${gemEvent.rarity} gem (${gemEvent.xpValue} XP) for "${word.word}"`);
          }
        } catch (error) {
          console.error('Failed to record vocabulary interaction:', error);
        }
      } else if (isAssignmentMode) {
        console.log('🔍 [VOCAB TRACKING] Skipping direct gem recording - assignment mode (wrapper will handle gems)');
      } else {
        console.log('🔍 [SRS UPDATE] Skipping SRS update - no gameSessionId provided:', {
          hasGameSessionId: !!gameSessionId,
          gameSessionId
        });
      }

      // Record vocabulary interaction for assignment mode
      if (isAssignmentMode && typeof window !== 'undefined' && (window as any).recordVocabularyInteraction) {
        try {
          await (window as any).recordVocabularyInteraction(
            word.word,
            word.translation,
            true, // wasCorrect
            responseTime, // responseTimeMs
            false, // hintUsed
            gameStats.combo + 1 // streakCount
          );
        } catch (error) {
          console.error('Failed to record vocabulary interaction for assignment:', error);
        }
      }

      // Track detailed word attempt
      const attempt: WordAttempt = {
        word: word.word,
        translation: word.translation,
        isCorrect: true,
        responseTime,
        timestamp: Date.now()
      };
      setWordAttempts(prev => [...prev, attempt]);

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

      setUsedWords(prev => new Set([...prev, word.id]));
      selectNextWord();
    } catch (error) {
      console.error('Error handling correct answer:', error);
      // Continue game flow even if there's an error
      selectNextWord();
    }
  };

  const handleIncorrectAnswer = async () => {
    try {
      startMusicOnInteraction(); // Start music on first interaction
      playSFX('wrong-answer');

      const responseTime = Date.now() - currentWordStartTime;

      // Record word practice with FSRS system for incorrect answer (works in both assignment and free play modes)
      if (currentWord) {
        try {
          const wordData = {
            id: currentWord.id || `${currentWord.word}-${currentWord.translation}`,
            word: currentWord.word,
            translation: currentWord.translation,
            language: settings.language === 'spanish' ? 'es' : settings.language === 'french' ? 'fr' : 'en'
          };

          // Record failed attempt with FSRS

          if (fsrsResult) {
            console.log(`FSRS recorded failed attempt for ${currentWord.word}:`, {
              algorithm: fsrsResult.algorithm,
              nextReview: fsrsResult.nextReviewDate,
              interval: fsrsResult.interval
            });
          }
        } catch (error) {
          console.error('Error recording FSRS failed practice:', error);
        }
      }

      // FSRS now handles incorrect answer tracking above - no duplicate legacy system needed

      // Record vocabulary interaction for assignment mode
      if (isAssignmentMode && currentWord && typeof window !== 'undefined' && (window as any).recordVocabularyInteraction) {
        try {
          await (window as any).recordVocabularyInteraction(
            currentWord.word,
            currentWord.translation,
            false, // wasCorrect
            responseTime, // responseTimeMs
            false, // hintUsed
            0 // streakCount (reset on incorrect)
          );
        } catch (error) {
          console.error('Failed to record vocabulary interaction for assignment:', error);
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
      if (gameStats.lives > 1) {
        selectNextWord();
      }
    } catch (error) {
      console.error('Error handling incorrect answer:', error);
      // Continue game flow even if there's an error
      if (gameStats.lives > 1) {
        selectNextWord();
      }
    }
  };

  const togglePause = () => {
    startMusicOnInteraction(); // Start music on first interaction
    playSFX('button-click');
    setIsPaused(!isPaused);

    if (!isPaused) {
      if (winCheckRef.current) {
        clearInterval(winCheckRef.current);
      }
    } else {
      startWinConditionCheck();
    }
  };

  const endGame = (outcome: 'win' | 'loss' | 'timeout') => {
    // Prevent multiple calls to endGame
    if (gameEnded) {
      console.log('Game already ended, ignoring duplicate endGame call');
      return;
    }

    setGameEnded(true);
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
      score: score,
      wordsLearned: gameStats.wordsLearned,
      correctAnswers: correctAnswers,
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
        {/* Top Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center p-3 md:p-4 pointer-events-auto gap-3 md:gap-0">
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <button
              onClick={onBackToMenu}
              className="flex items-center gap-1 md:gap-2 bg-black/60 hover:bg-black/80 text-white px-3 py-2 md:px-4 rounded-lg transition-all duration-200 text-sm md:text-base border border-white/20"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Menu</span>
            </button>

            <button
              onClick={togglePause}
              className="flex items-center gap-1 md:gap-2 bg-black/60 hover:bg-black/80 text-white px-3 py-2 md:px-4 rounded-lg transition-all duration-200 text-sm md:text-base border border-white/20"
            >
              {isPaused ? <Play className="w-3 h-3 md:w-4 md:h-4" /> : <Pause className="w-3 h-3 md:w-4 md:h-4" />}
              <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1 md:gap-2 bg-black/60 hover:bg-black/80 text-white px-3 py-2 md:px-4 rounded-lg transition-all duration-200 text-sm md:text-base border border-white/20"
            >
              {soundEnabled ? <Volume2 className="w-3 h-3 md:w-4 md:h-4" /> : <VolumeX className="w-3 h-3 md:w-4 md:h-4" />}
            </button>

            {/* Settings button - only show if not in assignment mode */}
            {!isAssignmentMode && onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="flex items-center gap-1 md:gap-2 bg-black/60 hover:bg-black/80 text-white px-3 py-2 md:px-4 rounded-lg transition-all duration-200 text-sm md:text-base border border-white/20"
              >
                <Settings className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            )}
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">{getThemeTitle()}</h1>
            <p className="text-sm text-slate-300">{getThemeInstruction()}</p>
            <p className="text-xs text-slate-400 mt-1">{getWinConditionText()}</p>
          </div>

          <div className="text-right text-white order-first md:order-last">
            <motion.div
              className="text-xl md:text-2xl font-bold"
              animate={{
                scale: gameStats.progressPercentage >= 80 ? [1, 1.05, 1] : 1,
                color: gameStats.progressPercentage >= 80 ? '#10B981' : '#FFFFFF'
              }}
              transition={{ duration: 0.5, repeat: gameStats.progressPercentage >= 80 ? Infinity : 0 }}
            >
              🎯 {Math.round(gameStats.progressPercentage)}%
            </motion.div>
            <div className="text-xs md:text-sm">Score: {gameStats.score}/{gameStats.targetScore}</div>
            <div className="text-xs md:text-sm">Words: {gameStats.wordsLearned}/{gameStats.targetWordsLearned}</div>
            <div className="text-xs md:text-sm flex items-center gap-1 justify-end">
              <span>Lives:</span>
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

        {/* Current Word Display */}
        {currentWord && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 pointer-events-auto z-20">
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
          playSFX={playSFX}
        />
      )}

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
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
    </div>
  );
}

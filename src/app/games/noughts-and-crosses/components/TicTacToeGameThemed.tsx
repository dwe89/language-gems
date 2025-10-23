'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { Brain, ArrowLeft, Volume2, VolumeX, Settings, Users, Monitor, Target, Moon, Skull, Rocket, Flame, X, Circle, Trophy, Frown, Handshake, Gamepad2, Home, RotateCcw, Clock, Award, BookOpen, TrendingUp, Zap, Volume1 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAudio } from '../hooks/useAudio';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { assignmentExposureService } from '../../../../services/assignments/AssignmentExposureService';
import AssignmentThemeSelector from '../../../../components/games/AssignmentThemeSelector';

// Dynamic imports for theme animations - only load the theme being used
// This prevents loading all 5 themes (~2000 lines) when only 1 is needed
const ClassicAnimation = lazy(() => import('./themes/ClassicAnimation'));
const LavaTempleAnimation = lazy(() => import('./themes/LavaTempleAnimation'));
const TokyoNightsAnimation = lazy(() => import('./themes/TokyoNightsAnimation'));
const SpaceExplorerAnimation = lazy(() => import('./themes/SpaceExplorerAnimation'));
const PirateAdventureAnimation = lazy(() => import('./themes/PirateAdventureAnimation'));

type CellContent = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'lost' | 'tie';

interface TicTacToeGameProps {
  settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    playerMark: string;
    computerMark: string;
    gameMode?: 'computer' | '2-player'; // Add game mode option
  };
  onBackToMenu: () => void;
  onGameModeChange?: (gameMode: 'computer' | '2-player') => void;
  onGameEnd: (result: {
    outcome: 'win' | 'loss' | 'tie';
    wordsLearned: number;
    perfectGame?: boolean;
    correctAnswers?: number;
    totalQuestions?: number;
    timeSpent?: number;
  }) => void;
  vocabularyWords?: Array<{
    id?: string;
    word: string;
    translation: string;
    difficulty: string;
    audio_url?: string;
    playAudio?: () => void;
  }>;
  gameSessionId?: string | null;
  isAssignmentMode?: boolean;
  assignmentId?: string | null; // For exposure tracking
  onOpenSettings?: () => void;
  gameService?: EnhancedGameService | null;
  userId?: string;
  toggleMusic?: () => void;
  isMusicEnabled?: boolean;
  // Theme selector props for assignment mode
  assignmentTheme?: string;
  onAssignmentThemeChange?: (theme: string) => void;
  showAssignmentThemeSelector?: boolean;
  onCloseAssignmentThemeSelector?: () => void;
  onToggleAssignmentThemeSelector?: () => void;
}

const generateWrongOptions = (correctTranslation: string, vocabulary: any[]) => {
  if (!vocabulary || vocabulary.length === 0) return [];

  const otherTranslations = vocabulary
    .filter((item: any) => item.translation !== correctTranslation)
    .map((item: any) => item.translation);

  // Shuffle and take 3 random wrong options
  const shuffled = otherTranslations.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

// Get special characters keyboard layout based on language
const getSpecialCharacters = (language: string): string[] => {
  switch (language) {
    case 'french':
      return ['à', 'â', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ù', 'û', 'ü', 'ç', 'œ', 'æ', 'ÿ'];
    case 'spanish':
      return ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'];
    case 'german':
      return ['ä', 'ö', 'ü', 'ß'];
    case 'portuguese':
      return ['á', 'â', 'ã', 'à', 'é', 'ê', 'í', 'ó', 'ô', 'õ', 'ú', 'ç'];
    default:
      return [];
  }
};

export default function TicTacToeGame({
  settings,
  onBackToMenu,
  onGameEnd,
  vocabularyWords,
  gameSessionId,
  isAssignmentMode,
  assignmentId,
  onOpenSettings,
  onGameModeChange,
  gameService,
  userId,
  toggleMusic,
  isMusicEnabled,
  assignmentTheme,
  onAssignmentThemeChange,
  showAssignmentThemeSelector,
  onCloseAssignmentThemeSelector,
  onToggleAssignmentThemeSelector
}: TicTacToeGameProps) {


  const { themeClasses, themeId } = useTheme();

  // Audio state - use wrapper's state in assignment mode, local state otherwise
  const [localSoundEnabled, setLocalSoundEnabled] = useState(true);
  const effectiveSoundEnabled = isMusicEnabled !== undefined ? isMusicEnabled : localSoundEnabled;
  const { playSFX, playThemeSFX, startBackgroundMusic, stopBackgroundMusic } = useAudio(effectiveSoundEnabled);
  
  const [board, setBoard] = useState<CellContent[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [winner, setWinner] = useState<'X' | 'O' | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [showVocabQuestion, setShowVocabQuestion] = useState(false);
  const [pendingMove, setPendingMove] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Cumulative counters that persist across rounds (don't get reset)
  const [cumulativeCorrectAnswers, setCumulativeCorrectAnswers] = useState(0);
  const [cumulativeTotalQuestions, setCumulativeTotalQuestions] = useState(0);
  const [cumulativeWordsLearned, setCumulativeWordsLearned] = useState(0);

  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [storyDismissed, setStoryDismissed] = useState(false);

  // Typing mode state
  const [typingMode, setTypingMode] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');

  // Start timer when story is dismissed
  useEffect(() => {
    if (storyDismissed && !gameStartTime) {
      setGameStartTime(new Date());
    }
  }, [storyDismissed, gameStartTime]);

  // Audio effects - Start background music when story is dismissed
  useEffect(() => {
    if (storyDismissed) {
      startBackgroundMusic(themeId);
    }
    
    // Cleanup - stop music when component unmounts
    return () => {
      stopBackgroundMusic();
    };
  }, [storyDismissed, themeId, startBackgroundMusic, stopBackgroundMusic]);
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameState('playing');
    setWinner(null);
    setWinningLine([]);
    setShowVocabQuestion(false);
    setPendingMove(null);
    setCurrentQuestion(null);
    setWordsLearned(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setGameStartTime(new Date()); // Reset timer
  };

  // LAYER 1: Session Deduplication - Track words used in THIS game session
  // This prevents "el arroz" from appearing multiple times in the same 3-question game
  // Reset when game restarts (onBackToMenu or new game)
  const [usedWordsThisSession, setUsedWordsThisSession] = useState<Set<string>>(new Set());

  // Get vocabulary for current settings
  const getVocabulary = () => {
    // Use vocabularyWords prop if available, otherwise return empty array
    if (vocabularyWords && vocabularyWords.length > 0) {
      return vocabularyWords;
    }

    return [];
  };

  const generateVocabularyQuestion = () => {
    const vocabulary = getVocabulary();
    if (vocabulary.length === 0) return null;

    // LAYER 1: Filter out words already used in this session
    const availableWords = vocabulary.filter(word => {
      const wordId = (word as any).id || word.id;
      return wordId && !usedWordsThisSession.has(wordId);
    });

    // If all words have been used, reset the session filter
    const wordsToUse = availableWords.length > 0 ? availableWords : vocabulary;

    const randomWord = wordsToUse[Math.floor(Math.random() * wordsToUse.length)];

    const wrongOptions = generateWrongOptions(randomWord.translation, vocabulary);
    
    // Create 4 options: 1 correct + 3 wrong, then shuffle
    const options = [randomWord.translation, ...wrongOptions].sort(() => 0.5 - Math.random());
    const correctIndex = options.indexOf(randomWord.translation);
    
    // Ensure vocabulary ID is properly preserved
    const vocabularyId = (randomWord as any).id || randomWord.id;

    // LAYER 1: Mark this word as used in this session
    if (vocabularyId) {
      setUsedWordsThisSession(prev => new Set([...prev, vocabularyId]));
      console.log('🎯 [SESSION DEDUP] Word marked as used:', {
        word: randomWord.word,
        id: vocabularyId,
        totalUsedThisSession: usedWordsThisSession.size + 1
      });
    }

    const question = {
      id: vocabularyId, // Include UUID for vocabulary tracking
      word: randomWord.word,
      translation: randomWord.translation,
      options: options,
      correctIndex: correctIndex,
      language: settings.language,
      audio_url: (randomWord as any).audio_url, // Include audio URL if available
      playAudio: (randomWord as any).playAudio, // Include playAudio function if available
      vocabularyWord: randomWord // Include full vocabulary word for audio playback
    };

    return question;
  };

  const checkWinner = (squares: CellContent[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a] as 'X' | 'O', line };
      }
    }
    
    // Check for tie
    if (squares.every(cell => cell !== null)) {
      return { winner: 'tie' as const, line: [] };
    }
    
    return { winner: null, line: [] };
  };

  const handleCellClick = (index: number) => {
    // In 2-player mode, both players can click. In computer mode, only when it's player X's turn
    if (settings.gameMode === '2-player') {
      if (board[index] || gameState !== 'playing') return;
    } else {
      if (board[index] || gameState !== 'playing' || currentPlayer !== 'X') return;
    }
    
    // Play square select sound
    playSFX('square-select');
    
    // Generate and show vocabulary question
    const question = generateVocabularyQuestion();
    if (!question) {
      // Fallback if no vocabulary available
      makeMove(index);
      return;
    }
    
    setCurrentQuestion(question);
    setPendingMove(index);
    setTotalQuestions(prev => prev + 1);
    setCumulativeTotalQuestions(prev => prev + 1); // Track cumulative questions
    setQuestionStartTime(Date.now());
    setShowVocabQuestion(true);
  };

  const handleTypedAnswer = async () => {
    if (!currentQuestion || pendingMove === null || !typedAnswer.trim()) return;

    // Normalize both strings for comparison (lowercase, trim)
    const normalizedTyped = typedAnswer.trim().toLowerCase();
    const normalizedCorrect = currentQuestion.translation.trim().toLowerCase();
    const isCorrect = normalizedTyped === normalizedCorrect;

    // Clear typed answer and hide question
    setTypedAnswer('');
    setShowVocabQuestion(false);

    await processAnswer(isCorrect);
  };

  const handleVocabAnswer = async (selectedIndex: number) => {
    setShowVocabQuestion(false);

    if (!currentQuestion || pendingMove === null) return;

    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    await processAnswer(isCorrect);
  };

  const processAnswer = async (isCorrect: boolean) => {
    if (!currentQuestion || pendingMove === null) return;
    const responseTime = (Date.now() - questionStartTime) / 1000;

    // Record word practice with FSRS system (for both assignment and free play modes)
    // BUT ONLY if this is NOT a retry question to avoid double recording
    if (currentQuestion && !(currentQuestion as any).isRetryQuestion) {
      try {
        // Ensure vocabulary ID is properly preserved - use multiple fallbacks
        const vocabularyId = currentQuestion.id ||
                           (currentQuestion as any).vocabularyId ||
                           (currentQuestion.vocabularyWord as any)?.id ||
                           null;

        if (!vocabularyId) {
          console.error('🚨 [FSRS ERROR] No vocabulary ID found for word:', {
            currentQuestion,
            currentQuestionKeys: Object.keys(currentQuestion),
            vocabularyWord: (currentQuestion as any).vocabularyWord
          });
        }

        const wordData = {
          id: vocabularyId,
          word: currentQuestion.word,
          translation: currentQuestion.translation,
          language: settings.language === 'spanish' ? 'es' : settings.language === 'french' ? 'fr' : 'en'
        };

        // Lightweight gem recording without FSRS to avoid delays
        if (vocabularyId && gameSessionId && isCorrect) {
          console.log('🎮 [NOUGHTS] Attempting to record gem:', {
            vocabularyId,
            gameSessionId,
            word: currentQuestion.word,
            isCorrect
          });

          try {
            const sessionService = new EnhancedGameSessionService();
            // Record gem with minimal processing - skip FSRS to avoid delays
            // Don't await - let this run in background to avoid blocking UI
            sessionService.recordWordAttempt(gameSessionId, 'noughts-and-crosses', {
              vocabularyId: vocabularyId,
              wordText: currentQuestion.word,
              translationText: currentQuestion.translation,
              responseTimeMs: responseTime * 1000,
              wasCorrect: isCorrect,
              hintUsed: false,
              streakCount: correctAnswers,
              masteryLevel: 1,
              maxGemRarity: 'common',
              gameMode: 'multiple_choice',
              difficultyLevel: 'beginner'
            }, true).then(gemEvent => {
              if (gemEvent) {
                console.log('✅ [NOUGHTS] Gem awarded successfully:', gemEvent);
              } else {
                console.warn('⚠️ [NOUGHTS] No gem event returned');
              }
            }).catch(error => {
              console.error('🚨 [NOUGHTS] Gem recording failed:', error);
            }); // Skip FSRS = true for speed
          } catch (error) {
            console.error('🚨 [NOUGHTS] Gem recording exception:', error);
          }
        } else {
          console.warn('⚠️ [NOUGHTS] Skipping gem recording:', {
            hasVocabularyId: !!vocabularyId,
            hasGameSessionId: !!gameSessionId,
            isCorrect
          });
        }
      } catch (error) {
        console.error('Error recording FSRS practice for noughts-and-crosses:', error);
      }
    } else if ((currentQuestion as any).isRetryQuestion) {
      // Skipping FSRS recording for retry question to avoid double counting
    }

    // 🚀 FAST VOCABULARY TRACKING: Lightweight tracking without heavy analytics
    if (gameService && gameSessionId && !(currentQuestion as any).isRetryQuestion && !isAssignmentMode) {
      // Only do essential word performance logging - skip complex analytics (non-blocking)
      gameService.logWordPerformance({
          session_id: gameSessionId,
          vocabulary_id: currentQuestion.id ? currentQuestion.id : undefined,
          word_text: currentQuestion.word,
          translation_text: currentQuestion.translation,
          language_pair: `${settings.language === 'spanish' ? 'es' : settings.language === 'french' ? 'fr' : 'en'}_english`,
          attempt_number: 1,
          response_time_ms: Math.round(responseTime * 1000),
          was_correct: isCorrect,
          confidence_level: 3,
          difficulty_level: 'beginner',
          hint_used: false,
          streak_count: correctAnswers + (isCorrect ? 1 : 0),
          previous_attempts: 0,
          mastery_level: 1,
          error_type: isCorrect ? undefined : 'incorrect_selection',
          grammar_concept: 'vocabulary_exposure',
          context_data: {
            gameType: 'noughts-and-crosses',
            isLuckBased: true,
            gameState: board.join(''),
            totalQuestions: totalQuestions + 1,
            correctAnswers: correctAnswers + (isCorrect ? 1 : 0)
          },
          timestamp: new Date()
        }).then(() => {
        }).catch(error => {
          console.error('🚀 [FAST] Vocabulary tracking failed:', error);
        });
    }

    // FSRS and Gem Recording are separate systems - both should run independently

    if (isCorrect) {
      // Play correct answer sound
      playSFX('correct-answer');
      setWordsLearned(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);

      // Track cumulative stats
      setCumulativeCorrectAnswers(prev => prev + 1);
      setCumulativeWordsLearned(prev => prev + 1);
      
      // Play audio for the vocabulary word
      if (currentQuestion.playAudio) {
        setTimeout(() => {
          currentQuestion.playAudio();
        }, 300); // Delay slightly to let the correct sound effect play first
      } else if (currentQuestion.audio_url) {
        setTimeout(() => {
          const audio = new Audio(currentQuestion.audio_url);
          audio.play().catch(error => {
            console.warn('Failed to play vocabulary audio:', error);
          });
        }, 300);
      }
      
      makeMove(pendingMove);
    } else {
      // Play wrong answer sound
      playSFX('wrong-answer');
      
      // Wrong answer - handle based on game mode
      
      // Record the wrong answer attempt
      if (gameSessionId && currentQuestion) {
        console.log('🎮 [NOUGHTS] Recording wrong answer:', {
          vocabularyId: currentQuestion.id,
          gameSessionId,
          word: currentQuestion.word
        });

        try {
          const sessionService = new EnhancedGameSessionService();
          sessionService.recordWordAttempt(gameSessionId, 'noughts-and-crosses', {
            vocabularyId: currentQuestion.id,
            wordText: currentQuestion.word,
            translationText: currentQuestion.translation,
            wasCorrect: false,
            responseTimeMs: responseTime * 1000,
            hintUsed: false,
            streakCount: 0
          }, true).then(gemEvent => {
            console.log('✅ [NOUGHTS] Wrong answer recorded:', gemEvent);
          }).catch(error => {
            console.error('🚨 [NOUGHTS] Wrong answer recording failed:', error);
          });
        } catch (error) {
          console.error('🚨 [NOUGHTS] Failed to record wrong answer:', error);
        }
      } else {
        console.warn('⚠️ [NOUGHTS] Skipping wrong answer recording:', {
          hasGameSessionId: !!gameSessionId,
          hasCurrentQuestion: !!currentQuestion
        });
      }
      
      // In 2-player mode, just switch turns. In computer mode, computer gets the move
      if (settings.gameMode === '2-player') {
        // Just switch to the other player (already handled by the makeMove logic)
      } else {
        // Computer gets to make a move immediately
        makeComputerMove();
      }
    }
    
    setPendingMove(null);
    setCurrentQuestion(null);
  };

  const makeMove = (index: number) => {
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result.winner) {
      handleGameEnd(result.winner, result.line);
    } else {
      // Check if we need to make computer move BEFORE switching currentPlayer
      const wasPlayerX = currentPlayer === 'X';
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      
      if (wasPlayerX && settings.gameMode !== '2-player') {
        // After player's move, computer moves (only in computer mode)
        setTimeout(() => {
          makeComputerMove(newBoard);
        }, 1000);
      } else if (settings.gameMode === '2-player') {
        // In 2-player mode, just wait for the next player to make their move
      }
    }
  };

  // Minimax algorithm with alpha-beta pruning for intelligent AI
  const minimax = (
    board: CellContent[], 
    depth: number, 
    isMaximizing: boolean, 
    alpha: number = -Infinity, 
    beta: number = Infinity
  ): { score: number; move?: number } => {
    const computerMark = settings.computerMark as 'X' | 'O';
    const playerMark = settings.playerMark as 'X' | 'O';
    
    const result = checkWinner(board);
    
    // Terminal states
    if (result.winner === computerMark) return { score: 10 - depth };
    if (result.winner === playerMark) return { score: depth - 10 };
    if (board.every(cell => cell !== null)) return { score: 0 };
    
    const availableMoves = board
      .map((cell, index) => cell === null ? index : null)
      .filter(val => val !== null) as number[];
    
    if (isMaximizing) {
      let maxScore = -Infinity;
      let bestMove = availableMoves[0];
      
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = computerMark;
        
        const { score } = minimax(newBoard, depth + 1, false, alpha, beta);
        
        if (score > maxScore) {
          maxScore = score;
          bestMove = move;
        }
        
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      
      return { score: maxScore, move: bestMove };
    } else {
      let minScore = Infinity;
      let bestMove = availableMoves[0];
      
      for (const move of availableMoves) {
        const newBoard = [...board];
        newBoard[move] = playerMark;
        
        const { score } = minimax(newBoard, depth + 1, true, alpha, beta);
        
        if (score < minScore) {
          minScore = score;
          bestMove = move;
        }
        
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      
      return { score: minScore, move: bestMove };
    }
  };

  // Enhanced AI with strategic patterns and fork detection
  const getStrategicMove = (board: CellContent[]): number | null => {
    const computerMark = settings.computerMark as 'X' | 'O';
    const playerMark = settings.playerMark as 'X' | 'O';
    
    const availableCells = board
      .map((cell, index) => cell === null ? index : null)
      .filter(val => val !== null) as number[];
    
    // Helper to check if a move creates a fork (two ways to win)
    const createsFork = (testBoard: CellContent[], mark: 'X' | 'O', position: number): boolean => {
      const newBoard = [...testBoard];
      newBoard[position] = mark;
      
      let winningMoves = 0;
      for (const pos of availableCells) {
        if (pos === position) continue;
        const testBoard2 = [...newBoard];
        testBoard2[pos] = mark;
        if (checkWinner(testBoard2).winner === mark) {
          winningMoves++;
        }
      }
      return winningMoves >= 2;
    };
    
    // 1. Win immediately if possible
    for (const pos of availableCells) {
      const testBoard = [...board];
      testBoard[pos] = computerMark;
      if (checkWinner(testBoard).winner === computerMark) {
        return pos;
      }
    }
    
    // 2. Block opponent's winning move
    for (const pos of availableCells) {
      const testBoard = [...board];
      testBoard[pos] = playerMark;
      if (checkWinner(testBoard).winner === playerMark) {
        return pos;
      }
    }
    
    // 3. Create a fork
    for (const pos of availableCells) {
      if (createsFork(board, computerMark, pos)) {
        return pos;
      }
    }
    
    // 4. Block opponent's fork
    for (const pos of availableCells) {
      if (createsFork(board, playerMark, pos)) {
        return pos;
      }
    }
    
    // 5. Take center if available
    if (availableCells.includes(4)) {
      return 4;
    }
    
    // 6. Take opposite corner if opponent is in corner
    const corners = [0, 2, 6, 8];
    const oppositeCorners = { 0: 8, 2: 6, 6: 2, 8: 0 };
    
    for (const corner of corners) {
      if (board[corner] === playerMark) {
        const opposite = oppositeCorners[corner as keyof typeof oppositeCorners];
        if (availableCells.includes(opposite)) {
          return opposite;
        }
      }
    }
    
    // 7. Take any corner
    const availableCorners = corners.filter(pos => availableCells.includes(pos));
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }
    
    // 8. Take any side
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(pos => availableCells.includes(pos));
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)];
    }
    
    return null;
  };

  const makeComputerMove = (currentBoard = board) => {
    const availableCells = currentBoard
      .map((cell, index) => cell === null ? index : null)
      .filter(val => val !== null) as number[];
    
    if (availableCells.length === 0) {
      return;
    }
    
    const computerMark = settings.computerMark as 'X' | 'O';
    let bestMove: number;
    
    // Difficulty-based AI with much smarter logic
    if (settings.difficulty === 'advanced') {
      // Use minimax for perfect play
      const result = minimax(currentBoard, 0, true);
      bestMove = result.move ?? availableCells[0];
    } else if (settings.difficulty === 'intermediate') {
      // 85% strategic moves, 15% random for some unpredictability
      if (Math.random() < 0.85) {
        const strategicMove = getStrategicMove(currentBoard);
        bestMove = strategicMove ?? availableCells[Math.floor(Math.random() * availableCells.length)];
      } else {
        bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
      }
    } else {
      // Beginner: 60% strategic moves, 40% random (much smarter than before)
      if (Math.random() < 0.6) {
        const strategicMove = getStrategicMove(currentBoard);
        bestMove = strategicMove ?? availableCells[Math.floor(Math.random() * availableCells.length)];
      } else {
        bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
      }
    }
    
    const newBoard = [...currentBoard];
    newBoard[bestMove] = computerMark;
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result.winner) {
      handleGameEnd(result.winner, result.line);
    } else {
      setCurrentPlayer('X');
    }
  };

  const handleGameEnd = (gameWinner: 'X' | 'O' | 'tie', line: number[]) => {
    if (gameWinner === 'tie') {
      setGameState('tie');
      setWinner(null);
      playSFX('tie-game');
    } else {
      setWinner(gameWinner);
      setWinningLine(line);
      
      if (gameWinner === 'X') {
        setGameState('won');
        playSFX('victory');
        playThemeSFX(settings.theme);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setGameState('lost');
        playSFX('defeat');
      }
    }
    
    // LAYER 2: Record word exposures for assignment progress
    // This must happen BEFORE calling onGameEnd so progress is updated
    if (isAssignmentMode && assignmentId && userId) {
      const exposedWordIds = Array.from(usedWordsThisSession);
      if (exposedWordIds.length > 0) {
        console.log('📝 [LAYER 2] Recording word exposures:', {
          assignmentId,
          studentId: userId,
          wordCount: exposedWordIds.length
        });

        assignmentExposureService.recordWordExposures(
          assignmentId,
          userId,
          exposedWordIds
        ).then(result => {
          if (result.success) {
            console.log('✅ [LAYER 2] Exposures recorded successfully');
          } else {
            console.error('❌ [LAYER 2] Failed to record exposures:', result.error);
          }
        });
      }
    }

    // Call parent callback with enhanced results
    setTimeout(() => {
      const perfectGame = correctAnswers === wordsLearned && wordsLearned >= 3;
      const timeSpent = gameStartTime ? Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000) : 0;

      onGameEnd({
        outcome: gameWinner === 'X' ? 'win' : gameWinner === 'tie' ? 'tie' : 'loss',
        wordsLearned: cumulativeWordsLearned, // Use cumulative stats
        perfectGame,
        correctAnswers: cumulativeCorrectAnswers, // Use cumulative stats
        totalQuestions: cumulativeTotalQuestions, // Use cumulative stats
        timeSpent
      });
    }, 2000);
  };

  const renderThemeAnimation = () => {
    const animationProps = { 
      board, 
      gameState, 
      storyDismissed,
      onStoryDismiss: () => setStoryDismissed(true)
    };
    
    // Loading fallback for theme animations
    const ThemeLoadingFallback = () => (
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Loading theme...</p>
        </div>
      </div>
    );
    
    // Wrap each theme component in Suspense for lazy loading
    switch (themeId) {
      case 'tokyo':
        return (
          <Suspense fallback={<ThemeLoadingFallback />}>
            <TokyoNightsAnimation {...animationProps} />
          </Suspense>
        );
      case 'pirate':
        return (
          <Suspense fallback={<ThemeLoadingFallback />}>
            <PirateAdventureAnimation {...animationProps} />
          </Suspense>
        );
      case 'space':
        return (
          <Suspense fallback={<ThemeLoadingFallback />}>
            <SpaceExplorerAnimation {...animationProps} />
          </Suspense>
        );
      case 'temple':
        return (
          <Suspense fallback={<ThemeLoadingFallback />}>
            <LavaTempleAnimation {...animationProps} />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<ThemeLoadingFallback />}>
            <ClassicAnimation {...animationProps} />
          </Suspense>
        );
    }
  };

  const getThemeTitle = () => {
    switch (themeId) {
      case 'tokyo':
        return <><Moon className="inline w-5 h-5 mr-2" />Tokyo Nights Hack</>;
      case 'pirate':
        return <><Skull className="inline w-5 h-5 mr-2" />Pirate Adventure</>;
      case 'space':
        return <><Rocket className="inline w-5 h-5 mr-2" />Space Explorer</>;
      case 'temple':
        return <><Flame className="inline w-5 h-5 mr-2" />Lava Temple</>;
      default:
        return <><Target className="inline w-5 h-5 mr-2" />Classic Challenge</>;
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      
      {/* Full-Screen Immersive Theme Background */}
      <div className="absolute inset-0">
        {renderThemeAnimation()}
      </div>

      {/* Header Overlay - Always show controls */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex justify-between items-center p-4 md:p-6">
          <motion.button
            onClick={() => {
              playSFX('button-click');
              onBackToMenu();
            }}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 md:px-6 py-2 md:py-3 rounded-full transition-all shadow-lg border border-white/20"
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium text-sm md:text-base">Back</span>
          </motion.button>
          
          {/* Themed Title */}
          <motion.div
            className="flex-1 text-center px-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 
              className="text-lg md:text-2xl lg:text-3xl font-bold text-white"
              style={{
                textShadow: '3px 3px 0px rgba(0, 0, 0, 0.8), -1px -1px 0px rgba(0, 0, 0, 0.8), 1px -1px 0px rgba(0, 0, 0, 0.8), -1px 1px 0px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              <span className="hidden sm:inline">{getThemeTitle()}</span>
              <span className="sm:hidden flex items-center justify-center">
                <Target className="w-4 h-4 mr-1" />Classic
              </span>
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-1 md:gap-3">
            {/* Settings button for free-play mode, AssignmentThemeSelector for assignment mode */}
            {isAssignmentMode ? (
              onToggleAssignmentThemeSelector && (
                <motion.button
                  onClick={() => {
                    playSFX('button-click');
                    onToggleAssignmentThemeSelector();
                  }}
                  className="relative p-2 md:px-4 md:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold flex items-center gap-1 md:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Change Theme"
                >
                  <Settings className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline text-sm md:text-base">Theme</span>
                </motion.button>
              )
            ) : (
              onOpenSettings && (
                <motion.button
                  onClick={() => {
                    playSFX('button-click');
                    onOpenSettings();
                  }}
                  className="relative p-2 md:px-4 md:py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold flex items-center gap-1 md:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Game Settings"
                >
                  <Settings className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline text-sm md:text-base">Settings</span>
                </motion.button>
              )
            )}
            <motion.button
              onClick={() => {
                playSFX('button-click');
                resetGame();
              }}
              className="relative p-2 md:px-4 md:py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold flex items-center gap-1 md:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Reset Game"
            >
              <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden md:inline text-sm md:text-base">Reset</span>
            </motion.button>
            
            {/* Game Mode Toggle Button - Hide on mobile for space */}
            {onGameModeChange && (
              <motion.button
                onClick={() => {
                  playSFX('button-click');
                  const newMode = settings.gameMode === 'computer' ? '2-player' : 'computer';
                  onGameModeChange(newMode);
                }}
                className={`hidden sm:flex relative px-3 md:px-4 py-2 md:py-2.5 rounded-xl ${
                  settings.gameMode === '2-player' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' 
                    : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                } text-white text-sm md:text-base font-semibold items-center gap-2 md:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/20`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={settings.gameMode === 'computer' ? 'Switch to 2-Player Mode' : 'Switch to Computer Mode'}
              >
                {settings.gameMode === '2-player' ? (
                  <Users className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <Monitor className="h-5 w-5 md:h-6 md:w-6" />
                )}
                <span className="hidden md:inline">
                  {settings.gameMode === '2-player' ? '2-Player' : 'vs Computer'}
                </span>
                <span className="md:hidden">
                  {settings.gameMode === '2-player' ? '2P' : 'PC'}
                </span>
              </motion.button>
            )}
            <motion.button
              onClick={() => {
                playSFX('button-click');
                if (toggleMusic) {
                  toggleMusic();
                } else {
                  setLocalSoundEnabled(!localSoundEnabled);
                }
              }}
              className="p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all shadow-lg border border-white/20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {effectiveSoundEnabled ? <Volume2 className="w-4 h-4 md:w-5 md:h-5" /> : <VolumeX className="w-4 h-4 md:w-5 md:h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Game Content - Split Layout: Board Left, Theme Right - Only show after story dismissed */}
      {storyDismissed && (
        <div className={`absolute inset-0 pt-24 pb-4 flex items-start justify-center z-10`}>
          {/* Desktop Layout for Classic Mode */}
          {(!themeId || themeId === 'classic' || !['tokyo', 'pirate', 'space', 'temple'].includes(themeId)) ? (
            <>
              {/* Desktop Layout */}
              <div className="hidden lg:flex w-full max-w-7xl mx-auto px-8 items-start gap-8 mt-2">
                
                {/* Left Side - Game Board */}
                <div className="flex-shrink-0">
                  <motion.div 
                    className="bg-black/40 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-4 shadow-2xl"
                    initial={{ scale: 0.8, opacity: 0, x: -50 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                  >
                    <div className="grid grid-cols-3 gap-6 aspect-square w-[28rem] mx-auto mb-2">
                      {board.map((cell, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleCellClick(index)}
                          disabled={!!cell || gameState !== 'playing' || (settings.gameMode !== '2-player' && currentPlayer !== 'X')}
                          className={`
                            aspect-square rounded-2xl border-3 flex flex-col items-center justify-center text-6xl font-bold transition-all duration-300 relative
                            backdrop-blur-md bg-white/15 border-white/40 shadow-lg
                            ${winningLine.includes(index) 
                              ? 'bg-yellow-400/40 border-yellow-400 shadow-xl shadow-yellow-400/50 scale-105'
                              : cell 
                                ? cell === 'X' 
                                  ? 'bg-blue-500/40 border-blue-400 text-blue-100 shadow-xl shadow-blue-400/50' 
                                  : 'bg-red-500/40 border-red-400 text-red-100 shadow-xl shadow-red-400/50'
                                : 'hover:bg-white/25 hover:border-white/60 cursor-pointer'
                            }
                            ${!cell && gameState === 'playing' && (settings.gameMode === '2-player' || currentPlayer === 'X') ? 'transform hover:scale-110' : ''}
                          `}
                          whileHover={!cell && gameState === 'playing' && (settings.gameMode === '2-player' || currentPlayer === 'X') ? { 
                            scale: 1.1, 
                            y: -4,
                            boxShadow: "0 10px 25px rgba(255, 255, 255, 0.3)" 
                          } : {}}
                          whileTap={!cell && gameState === 'playing' && (settings.gameMode === '2-player' || currentPlayer === 'X') ? { scale: 0.95 } : {}}
                        >
                          {/* Fixed glyph for each square */}
                          <div className="absolute top-1 left-1 text-white/25 text-xs font-bold select-none bg-black/20 rounded-full w-5 h-5 flex items-center justify-center">
                            {index + 1}
                          </div>
                          
                          <AnimatePresence>
                            {cell && (
                              <motion.span
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className={`drop-shadow-2xl ${cell === 'X' ? 'text-blue-300' : 'text-red-300'}`}
                              >
                                {cell}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      ))}
                    </div>

                    {/* Game Status - Simplified */}
                    <div className="text-center min-h-[60px] flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        
                        
                        {gameState === 'tie' && (
                          <motion.div
                            key="tie"
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                            className="space-y-4"
                          >
                            <div className="text-2xl font-bold text-yellow-300 drop-shadow-lg bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3 border border-yellow-400/50">
                              <Handshake className="inline w-6 h-6 mr-2" />Stalemate
                            </div>
                            <div className="text-sm text-white bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                              Words learned: {wordsLearned}
                            </div>
                            <div className="flex gap-3 justify-center mt-3">
                              <motion.button
                                onClick={() => {
                                  playSFX('button-click');
                                  resetGame();
                                }}
                                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-full transition-all shadow-lg text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Target className="inline w-4 h-4 mr-2" />Rematch
                              </motion.button>
                              <motion.button
                                onClick={() => {
                                  playSFX('button-click');
                                  onBackToMenu();
                                }}
                                className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold rounded-full transition-all shadow-lg border border-white/20 text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Home className="inline w-4 h-4 mr-2" />Menu
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Playing State - Show current player in 2-player mode */}
                        {gameState === 'playing' && settings.gameMode === '2-player' && (
                          <motion.div
                            key="playing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                          >
                            <div className="text-xl font-bold text-white drop-shadow-lg bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                              {currentPlayer === 'X' ? <X className="inline w-6 h-6 mr-2" /> : <Circle className="inline w-6 h-6 mr-2" />} Player {currentPlayer}'s Turn
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Removed computer thinking message to save space */}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>

                {/* Right Side - Statistics Panel (Desktop Only) */}
                <div className="flex-1 h-full relative">
                  <motion.div
                    className="bg-black/40 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-6 shadow-2xl max-w-sm mx-auto mt-4"
                    initial={{ scale: 0.8, opacity: 0, x: 50 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
                  >
                    <div className="space-y-6">
                      {/* Game Statistics */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-5 h-5 text-blue-400" />
                          <h3 className="text-lg font-bold text-white">Game Progress</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center bg-black/30 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-green-400" />
                              <span className="text-white text-sm">Words Learned</span>
                            </div>
                            <span className="text-green-400 font-bold">{cumulativeWordsLearned}</span>
                          </div>
                          <div className="flex justify-between items-center bg-black/30 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-blue-400" />
                              <span className="text-white text-sm">Accuracy</span>
                            </div>
                            <span className="text-blue-400 font-bold">
                              {cumulativeTotalQuestions > 0 ? Math.round((cumulativeCorrectAnswers / cumulativeTotalQuestions) * 100) : 0}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center bg-black/30 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-yellow-400" />
                              <span className="text-white text-sm">Current Streak</span>
                            </div>
                            <span className="text-yellow-400 font-bold">{correctAnswers}</span>
                          </div>
                          <div className="flex justify-between items-center bg-black/30 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-purple-400" />
                              <span className="text-white text-sm">Time Elapsed</span>
                            </div>
                            <span className="text-purple-400 font-bold">
                              {gameStartTime ? Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000 / 60) : 0}m
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Current Question Info */}
                      {currentQuestion && showVocabQuestion && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Brain className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-bold text-white">Current Challenge</h3>
                          </div>
                          <div className="bg-black/30 rounded-lg p-4">
                            <div className="text-center">
                              <div className="text-sm text-purple-400 mb-2">Translate</div>
                              <div className="text-xl font-bold text-white mb-3">"{currentQuestion.word}"</div>
                              {currentQuestion.audio_url && (
                                <motion.button
                                  onClick={() => {
                                    const audio = new Audio(currentQuestion.audio_url);
                                    audio.play().catch(error => console.warn('Audio play failed:', error));
                                  }}
                                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-full text-sm mx-auto transition-all"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Volume1 className="w-4 h-4" />
                                  Play Audio
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Achievement Progress */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Award className="w-5 h-5 text-orange-400" />
                          <h3 className="text-lg font-bold text-white">Achievements</h3>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-black/30 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white text-sm">First Victory</span>
                              <span className="text-orange-400 text-xs">
                                {gameState === 'won' ? 'Complete!' : 'In Progress'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: gameState === 'won' ? '100%' : '0%' }}
                              ></div>
                            </div>
                          </div>
                          <div className="bg-black/30 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-white text-sm">Learning Streak</span>
                              <span className="text-green-400 text-xs">
                                {cumulativeWordsLearned}/10
                              </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-400 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min((cumulativeWordsLearned / 10) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden w-full px-4 space-y-4">
                
                {/* Mobile Game Board */}
                <motion.div 
                  className="bg-black/40 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-3 shadow-2xl mx-auto max-w-sm"
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                >
                  <div className="grid grid-cols-3 gap-3 aspect-square w-full mb-2">
                    {board.map((cell, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleCellClick(index)}
                        disabled={!!cell || gameState !== 'playing' || (settings.gameMode !== '2-player' && currentPlayer !== 'X')}
                        className={`
                          aspect-square rounded-xl border-2 flex flex-col items-center justify-center text-4xl font-bold transition-all duration-300 relative
                          backdrop-blur-md bg-white/15 border-white/40 shadow-lg
                          ${winningLine.includes(index) 
                            ? 'bg-yellow-400/40 border-yellow-400 shadow-xl shadow-yellow-400/50 scale-105'
                            : cell 
                              ? cell === 'X' 
                                ? 'bg-blue-500/40 border-blue-400 text-blue-100 shadow-xl shadow-blue-400/50' 
                                : 'bg-red-500/40 border-red-400 text-red-100 shadow-xl shadow-red-400/50'
                              : 'hover:bg-white/25 hover:border-white/60 cursor-pointer active:scale-95'
                          }
                        `}
                        whileTap={!cell && gameState === 'playing' && (settings.gameMode === '2-player' || currentPlayer === 'X') ? { scale: 0.9 } : {}}
                      >
                        {/* Mobile number indicators - smaller */}
                        <div className="absolute top-0.5 left-0.5 text-white/25 text-xs font-bold select-none bg-black/20 rounded-full w-4 h-4 flex items-center justify-center">
                          {index + 1}
                        </div>
                        
                        <AnimatePresence>
                          {cell && (
                            <motion.span
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                              className={`drop-shadow-2xl ${cell === 'X' ? 'text-blue-300' : 'text-red-300'}`}
                            >
                              {cell}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))}
                  </div>

                  {/* Mobile Game Status */}
                  <div className="text-center min-h-[40px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {gameState === 'tie' && (
                        <motion.div
                          key="tie-mobile"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="text-center"
                        >
                          <div className="text-lg font-bold text-yellow-300 drop-shadow-lg bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 border border-yellow-400/50">
                            <Handshake className="inline w-5 h-5 mr-2" />Stalemate
                          </div>
                        </motion.div>
                      )}
                      
                      {gameState === 'playing' && settings.gameMode === '2-player' && (
                        <motion.div
                          key="playing-mobile"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="text-center"
                        >
                          <div className="text-lg font-bold text-white drop-shadow-lg bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
                            {currentPlayer === 'X' ? <X className="inline w-5 h-5 mr-2" /> : <Circle className="inline w-5 h-5 mr-2" />} Player {currentPlayer}'s Turn
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Mobile Statistics Panel - Horizontal Scrolling Cards */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {/* Quick Stats Row */}
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    <div className="bg-black/40 backdrop-blur-lg border border-white/30 rounded-xl p-3 min-w-[120px] flex-shrink-0">
                      <div className="text-center">
                        <BookOpen className="w-5 h-5 text-green-400 mx-auto mb-1" />
                        <div className="text-green-400 font-bold text-lg">{cumulativeWordsLearned}</div>
                        <div className="text-white text-xs">Words</div>
                      </div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-lg border border-white/30 rounded-xl p-3 min-w-[120px] flex-shrink-0">
                      <div className="text-center">
                        <Target className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                        <div className="text-blue-400 font-bold text-lg">
                          {cumulativeTotalQuestions > 0 ? Math.round((cumulativeCorrectAnswers / cumulativeTotalQuestions) * 100) : 0}%
                        </div>
                        <div className="text-white text-xs">Accuracy</div>
                      </div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-lg border border-white/30 rounded-xl p-3 min-w-[120px] flex-shrink-0">
                      <div className="text-center">
                        <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                        <div className="text-yellow-400 font-bold text-lg">{correctAnswers}</div>
                        <div className="text-white text-xs">Streak</div>
                      </div>
                    </div>
                    <div className="bg-black/40 backdrop-blur-lg border border-white/30 rounded-xl p-3 min-w-[120px] flex-shrink-0">
                      <div className="text-center">
                        <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                        <div className="text-purple-400 font-bold text-lg">
                          {gameStartTime ? Math.floor((new Date().getTime() - gameStartTime.getTime()) / 1000 / 60) : 0}m
                        </div>
                        <div className="text-white text-xs">Time</div>
                      </div>
                    </div>
                  </div>

                  {/* Current Challenge Card (Mobile) */}
                  {currentQuestion && showVocabQuestion && (
                    <div className="bg-black/40 backdrop-blur-lg border border-white/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-5 h-5 text-purple-400" />
                        <h3 className="text-lg font-bold text-white">Current Challenge</h3>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-purple-400 mb-2">Translate</div>
                        <div className="text-2xl font-bold text-white mb-3">"{currentQuestion.word}"</div>
                        {currentQuestion.audio_url && (
                          <motion.button
                            onClick={() => {
                              const audio = new Audio(currentQuestion.audio_url);
                              audio.play().catch(error => console.warn('Audio play failed:', error));
                            }}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm mx-auto transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Volume1 className="w-4 h-4" />
                            Play Audio
                          </motion.button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </>
          ) : (
            /* Original layout for other themes - Now responsive */
            <>
              {/* Desktop Layout */}
              <div className="hidden lg:flex w-full max-w-7xl mx-auto px-8 items-start gap-8 mt-2">
            
                {/* Left Side - Game Board */}
                <div className="flex-shrink-0">
                  <motion.div 
                    className="bg-black/40 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-4 shadow-2xl"
                    initial={{ scale: 0.8, opacity: 0, x: -50 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                  >
                    <div className="grid grid-cols-3 gap-6 aspect-square w-[28rem] mx-auto mb-2">
                    {board.map((cell, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleCellClick(index)}
                        disabled={!!cell || gameState !== 'playing' || (settings.gameMode !== '2-player' && currentPlayer !== 'X')}
                        className={`
                          aspect-square rounded-2xl border-3 flex flex-col items-center justify-center text-6xl font-bold transition-all duration-300 relative
                          backdrop-blur-md bg-white/15 border-white/40 shadow-lg
                          ${winningLine.includes(index) 
                            ? 'bg-yellow-400/40 border-yellow-400 shadow-xl shadow-yellow-400/50 scale-105'
                            : cell 
                              ? cell === 'X' 
                                ? 'bg-blue-500/40 border-blue-400 text-blue-100 shadow-xl shadow-blue-400/50' 
                                : 'bg-red-500/40 border-red-400 text-red-100 shadow-xl shadow-red-400/50'
                              : 'hover:bg-white/25 hover:border-white/60 cursor-pointer'
                          }
                          ${!cell && gameState === 'playing' && (settings.gameMode === '2-player' || currentPlayer === 'X') ? 'transform hover:scale-110' : ''}
                        `}
                        whileHover={!cell && gameState === 'playing' && (settings.gameMode === '2-player' || currentPlayer === 'X') ? { 
                          scale: 1.1, 
                          y: -4,
                          boxShadow: "0 10px 25px rgba(255, 255, 255, 0.3)" 
                        } : {}}
                        whileTap={!cell && gameState === 'playing' && (settings.gameMode === '2-player' || currentPlayer === 'X') ? { scale: 0.95 } : {}}
                      >
                        {/* Fixed glyph for each square */}
                        <div className="absolute top-1 left-1 text-white/25 text-xs font-bold select-none bg-black/20 rounded-full w-5 h-5 flex items-center justify-center">
                          {index + 1}
                        </div>
                        
                        <AnimatePresence>
                          {cell && (
                            <motion.span
                              initial={{ scale: 0, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                              className={`drop-shadow-2xl ${cell === 'X' ? 'text-blue-300' : 'text-red-300'}`}
                            >
                              {cell}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))}
                  </div>

                  {/* Game Status - Simplified */}
                  <div className="text-center min-h-[60px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      
                      
                      {gameState === 'tie' && (
                        <motion.div
                          key="tie"
                          initial={{ opacity: 0, y: 20, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.8 }}
                          className="space-y-4"
                        >
                          <div className="text-2xl font-bold text-yellow-300 drop-shadow-lg bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3 border border-yellow-400/50">
                            <Handshake className="inline w-6 h-6 mr-2" />Stalemate
                          </div>
                          <div className="text-sm text-white bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                            Words learned: {wordsLearned}
                          </div>
                          <div className="flex gap-3 justify-center mt-3">
                            <motion.button
                              onClick={() => {
                                playSFX('button-click');
                                resetGame();
                              }}
                              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-full transition-all shadow-lg text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Target className="inline w-4 h-4 mr-2" />Rematch
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                playSFX('button-click');
                                onBackToMenu();
                              }}
                              className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold rounded-full transition-all shadow-lg border border-white/20 text-sm"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Home className="inline w-4 h-4 mr-2" />Menu
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Playing State - Show current player in 2-player mode */}
                      {gameState === 'playing' && settings.gameMode === '2-player' && (
                        <motion.div
                          key="playing"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="text-center"
                        >
                          <div className="text-xl font-bold text-white drop-shadow-lg bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                            {currentPlayer === 'X' ? <X className="inline w-6 h-6 mr-2" /> : <Circle className="inline w-6 h-6 mr-2" />} Player {currentPlayer}'s Turn
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Removed computer thinking message to save space */}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - Theme Area (ship, treasure, etc.) */}
              <div className="flex-1 h-full relative">
                {/* Other themes: Reserved for theme-specific elements */}
                {themeId && ['tokyo', 'pirate', 'space', 'temple'].includes(themeId) && (
                  <div>
                    {/* This area is reserved for theme-specific elements like ships and treasures */}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Layout for Other Themes */}
            <div className="lg:hidden w-full px-4">
              <motion.div 
                className="bg-black/40 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-3 shadow-2xl mx-auto max-w-sm"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              >
                <div className="grid grid-cols-3 gap-3 aspect-square w-full mb-2">
                  {board.map((cell, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleCellClick(index)}
                      disabled={!!cell || gameState !== 'playing' || (settings.gameMode !== '2-player' && currentPlayer !== 'X')}
                      className={`
                        aspect-square rounded-xl border-2 flex flex-col items-center justify-center text-4xl font-bold transition-all duration-300 relative
                        backdrop-blur-md bg-white/15 border-white/40 shadow-lg
                        ${winningLine.includes(index) 
                          ? 'bg-yellow-400/40 border-yellow-400 shadow-xl shadow-yellow-400/50 scale-105'
                          : cell 
                            ? cell === 'X' 
                              ? 'bg-blue-500/40 border-blue-400 text-blue-100 shadow-xl shadow-blue-400/50' 
                              : 'bg-red-500/40 border-red-400 text-red-100 shadow-xl shadow-red-400/50'
                            : 'hover:bg-white/25 hover:border-white/60 cursor-pointer active:scale-95'
                        }
                      `}
                      whileTap={!cell && gameState === 'playing' && (settings.gameMode === '2-player' || currentPlayer === 'X') ? { scale: 0.9 } : {}}
                    >
                      {/* Mobile number indicators - smaller */}
                      <div className="absolute top-0.5 left-0.5 text-white/25 text-xs font-bold select-none bg-black/20 rounded-full w-4 h-4 flex items-center justify-center">
                        {index + 1}
                      </div>
                      
                      <AnimatePresence>
                        {cell && (
                          <motion.span
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className={`drop-shadow-2xl ${cell === 'X' ? 'text-blue-300' : 'text-red-300'}`}
                          >
                            {cell}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>

                {/* Mobile Game Status */}
                <div className="text-center min-h-[40px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {gameState === 'tie' && (
                      <motion.div
                        key="tie-mobile-other"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center"
                      >
                        <div className="text-lg font-bold text-yellow-300 drop-shadow-lg bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2 border border-yellow-400/50">
                          <Handshake className="inline w-5 h-5 mr-2" />Stalemate
                        </div>
                      </motion.div>
                    )}
                    
                    {gameState === 'playing' && settings.gameMode === '2-player' && (
                      <motion.div
                        key="turn-mobile-other"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center"
                      >
                        <div className="text-sm font-bold text-white drop-shadow-lg bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                          <span className={currentPlayer === 'X' ? 'text-blue-300' : 'text-red-300'}>
                            Player {currentPlayer}
                          </span>
                          <span className="text-white">'s Turn</span>
                        </div>
                      </motion.div>
                    )}
                    
                    {gameState === 'playing' && settings.gameMode === 'computer' && (
                      <motion.div
                        key="vs-computer-mobile-other"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center"
                      >
                        <div className="text-sm font-bold drop-shadow-lg bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                          <span className="text-blue-300">Your Turn</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
            </>
          )}
        </div>
      )}

      {/* Vocabulary Question Modal */}
      <AnimatePresence>
        {showVocabQuestion && currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Vocabulary Challenge</h3>
                <p className="text-gray-600">Answer correctly to make your move!</p>

                {/* Mode Toggle */}
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() => {
                      setTypingMode(false);
                      setTypedAnswer('');
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      !typingMode
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Multiple Choice
                  </button>
                  <button
                    onClick={() => {
                      setTypingMode(true);
                      setTypedAnswer('');
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      typingMode
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Type Answer
                  </button>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-sm text-purple-600 font-medium mb-2">
                  {currentQuestion.language} → English
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  "{currentQuestion.word}"
                </div>
              </div>

              {/* Multiple Choice Mode */}
              {!typingMode && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option: string, index: number) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        playSFX('button-click');
                        handleVocabAnswer(index);
                      }}
                      className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all font-medium"
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-purple-600 font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                      <span className="text-gray-800">{option}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Typing Mode */}
              {typingMode && (
                <div className="space-y-4">
                  {/* Text Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && typedAnswer.trim()) {
                          handleTypedAnswer();
                        }
                      }}
                      placeholder="Type your answer..."
                      className="w-full p-4 text-lg rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none transition-all"
                      autoFocus
                    />
                  </div>

                  {/* Special Characters Keyboard */}
                  {getSpecialCharacters(settings.language).length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-xs text-gray-600 font-medium mb-2 text-center">Special Characters</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {getSpecialCharacters(settings.language).map((char) => (
                          <button
                            key={char}
                            onClick={() => {
                              playSFX('button-click');
                              setTypedAnswer(prev => prev + char);
                            }}
                            className="w-10 h-10 bg-white hover:bg-purple-50 border-2 border-gray-200 hover:border-purple-300 rounded-lg font-bold text-lg transition-all active:scale-95"
                          >
                            {char}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    onClick={handleTypedAnswer}
                    disabled={!typedAnswer.trim()}
                    className={`w-full p-4 rounded-xl font-bold text-white transition-all ${
                      typedAnswer.trim()
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                    whileHover={typedAnswer.trim() ? { scale: 1.02, y: -2 } : {}}
                    whileTap={typedAnswer.trim() ? { scale: 0.98 } : {}}
                  >
                    Submit Answer
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory Modal */}
      <AnimatePresence>
        {gameState === 'won' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Victory Achieved!</h3>
                <p className="text-gray-600">Congratulations on your win!</p>
              </div>

              <div className="text-center mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-lg font-semibold text-gray-800 mb-2">Game Statistics</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Words learned: <span className="font-bold text-green-600">{wordsLearned}</span></div>
                    <div>Accuracy: <span className="font-bold text-green-600">{Math.round((correctAnswers / Math.max(wordsLearned, 1)) * 100)}%</span></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    playSFX('button-click');
                    resetGame();
                  }}
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Gamepad2 className="inline w-5 h-5 mr-2" />Play Again
                </motion.button>
                <motion.button
                  onClick={() => {
                    playSFX('button-click');
                    onBackToMenu();
                  }}
                  className="w-full p-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all shadow-lg border border-gray-200"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="inline w-5 h-5 mr-2" />{isAssignmentMode ? 'Back to Assignment' : 'Back to Menu'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Defeat Modal */}
      <AnimatePresence>
        {gameState === 'lost' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Frown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Mission Failed</h3>
                <p className="text-gray-600">Better luck next time!</p>
              </div>

              <div className="text-center mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-lg font-semibold text-gray-800 mb-2">Game Statistics</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Words learned: <span className="font-bold text-red-600">{wordsLearned}</span></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  onClick={() => {
                    playSFX('button-click');
                    resetGame();
                  }}
                  className="w-full p-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="inline w-5 h-5 mr-2" />Try Again
                </motion.button>
                <motion.button
                  onClick={() => {
                    playSFX('button-click');
                    onBackToMenu();
                  }}
                  className="w-full p-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all shadow-lg border border-gray-200"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="inline w-5 h-5 mr-2" />{isAssignmentMode ? 'Back to Assignment' : 'Back to Menu'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

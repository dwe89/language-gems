'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Castle, Clock, Star, RefreshCw, PlayIcon, PauseIcon, 
  CheckCircle2, Trophy, AlertCircle, ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import './sentence-towers.css';

// Import types and components
import { 
  BlockType, TowerBlock as TowerBlockType, 
  GameState, GameSettings, GameStats, TowerLevel,
  GameMode, TranslationDirection
} from './types';
import { Tower } from './components/Tower';
import { WordOptions } from './components/WordOptions';
import { GameStats as GameStatsComponent } from './components/GameStats';
import { TargetWord } from './components/TargetWord';
import { TypingInput } from './components/TypingInput';

// Sample vocabulary for testing
const sampleVocabulary = [
  { id: '1', word: 'hello', translation: 'hola', correct: false },
  { id: '2', word: 'goodbye', translation: 'adiós', correct: false },
  { id: '3', word: 'thank you', translation: 'gracias', correct: false },
  { id: '4', word: 'please', translation: 'por favor', correct: false },
  { id: '5', word: 'yes', translation: 'sí', correct: false },
  { id: '6', word: 'no', translation: 'no', correct: false },
  { id: '7', word: 'excuse me', translation: 'disculpe', correct: false },
  { id: '8', word: 'sorry', translation: 'lo siento', correct: false },
  { id: '9', word: 'good morning', translation: 'buenos días', correct: false },
  { id: '10', word: 'good night', translation: 'buenas noches', correct: false },
  { id: '11', word: 'water', translation: 'agua', correct: false },
  { id: '12', word: 'food', translation: 'comida', correct: false },
  { id: '13', word: 'money', translation: 'dinero', correct: false },
  { id: '14', word: 'friend', translation: 'amigo', correct: false },
  { id: '15', word: 'family', translation: 'familia', correct: false },
];

// Block type probabilities
const blockTypeProbabilities = {
  standard: 0.7,
  bonus: 0.15,
  challenge: 0.1,
  fragile: 0.05
};

// Points by block type
const pointsByBlockType = {
  standard: 10,
  bonus: 25,
  challenge: 50,
  fragile: 15
};

export default function SentenceTowersGame() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 120, // 2 minutes
    towerFalling: true,
    wordMode: 'vocabulary',
    difficulty: 'medium',
    vocabularyId: null,
    gameMode: 'multiple-choice', // Default to multiple choice
    translationDirection: 'fromNative' // Default to translating from native language
  });
  
  // Tower state
  const [towerBlocks, setTowerBlocks] = useState<TowerBlockType[]>([]);
  const [fallingBlocks, setFallingBlocks] = useState<string[]>([]);
  const [wordOptions, setWordOptions] = useState<{id: string; word: string; translation: string; isCorrect: boolean}[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  
  // Game stats
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    blocksPlaced: 0,
    blocksFallen: 0,
    currentHeight: 0,
    maxHeight: 0,
    currentLevel: 1,
    accuracy: 1
  });
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(gameSettings.timeLimit);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Game settings
  const [vocabulary, setVocabulary] = useState(sampleVocabulary);
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  const [currentTargetWord, setCurrentTargetWord] = useState<{
    id: string;
    word: string;
    translation: string;
  } | null>(null);
  
  // Initialize game
  useEffect(() => {
    const assignmentIdParam = searchParams?.get('assignmentId');
    if (assignmentIdParam) {
      setAssignmentId(assignmentIdParam);
      loadAssignmentSettings(assignmentIdParam);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [searchParams]);
  
  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleGameOver();
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
  }, [gameState]);
  
  // Load assignment settings (would connect to Supabase in a real app)
  const loadAssignmentSettings = async (id: string) => {
    // In a real app, we would fetch assignment settings from Supabase
    // For now, use sample settings with random gameMode
    const useTypingMode = Math.random() > 0.5;
    
    setGameSettings({
      timeLimit: 120,
      towerFalling: Math.random() > 0.5,
      wordMode: 'vocabulary',
      difficulty: Math.random() > 0.7 ? 'hard' : Math.random() > 0.4 ? 'medium' : 'easy',
      vocabularyId: null,
      gameMode: useTypingMode ? 'typing' : 'multiple-choice',
      translationDirection: Math.random() > 0.5 ? 'fromNative' : 'toNative'
    });
    
    setTimeLeft(120);
    setVocabulary(sampleVocabulary);
  };
  
  // Start the game
  const startGame = () => {
    setGameState('playing');
    setStats({
      score: 0,
      blocksPlaced: 0,
      blocksFallen: 0,
      currentHeight: 0,
      maxHeight: 0,
      currentLevel: 1,
      accuracy: 1
    });
    setTowerBlocks([]);
    setFallingBlocks([]);
    setCurrentLevel(1);
    generateWordOptions();
  };
  
  // Generate options for the current level
  const generateWordOptions = () => {
    const unusedWords = vocabulary.filter(word => !word.correct);
    
    if (unusedWords.length === 0) {
      handleLevelCompleted();
      return;
    }
    
    // Select a random word as the target
    const shuffledWords = [...unusedWords].sort(() => Math.random() - 0.5);
    const targetWord = shuffledWords[0];
    setCurrentTargetWord(targetWord);
    
    if (gameSettings.gameMode === 'multiple-choice') {
      // For multiple choice, select additional options (3 wrong answers)
      const otherWords = shuffledWords.slice(1).slice(0, 3);
      
      // Create options array with 1 correct and 3 incorrect options
      const allOptions = [targetWord, ...otherWords].sort(() => Math.random() - 0.5);
      
      const options = allOptions.map(word => ({
        id: word.id,
        word: word.word,
        translation: word.translation,
        isCorrect: word.id === targetWord.id
      }));
      
      setWordOptions(options);
    }
    // For typing mode, we don't need additional options, just the target word
  };
  
  // Handle correct answer (common logic for both multiple choice and typing)
  const handleCorrectAnswer = (selectedWordId: string) => {
    if (!currentTargetWord) return;
    
    // Mark the word as correct in vocabulary
    setVocabulary(prev => 
      prev.map(word => 
        word.id === selectedWordId ? { ...word, correct: true } : word
      )
    );
    
    // Generate a new block type based on probabilities
    const blockType = generateBlockType();
    
    // Add a new block to the tower
    const newBlock: TowerBlockType = {
      id: `block-${Date.now()}`,
      type: blockType,
      word: currentTargetWord.word,
      translation: currentTargetWord.translation,
      correct: true,
      points: pointsByBlockType[blockType],
      position: towerBlocks.length,
      isShaking: false
    };
    
    setTowerBlocks(prev => [...prev, newBlock]);
    
    // Update score
    setStats(prev => ({
      ...prev,
      score: prev.score + pointsByBlockType[blockType],
      blocksPlaced: prev.blocksPlaced + 1,
      currentHeight: prev.currentHeight + 1,
      maxHeight: Math.max(prev.maxHeight, prev.currentHeight + 1)
    }));
    
    // Check if level completed
    if (currentLevel * 5 <= towerBlocks.length + 1) {
      setCurrentLevel(prev => prev + 1);
      handleLevelCompleted();
    }
  };
  
  // Handle option selection for multiple choice mode
  const handleSelectOption = (option: {id: string; word: string; translation: string; isCorrect: boolean}) => {
    if (gameState !== 'playing') return;
    
    // Handle correct/incorrect selection
    if (option.isCorrect) {
      handleCorrectAnswer(option.id);
    } else {
      handleIncorrectAnswer();
    }
    
    // Update stats
    updateStats(option.isCorrect);
    
    // Generate new options after a short delay
    setTimeout(() => {
      generateWordOptions();
    }, option.isCorrect ? 1000 : 1500); // Longer delay after incorrect to watch blocks fall
  };
  
  // Handle typing mode submission
  const handleTypingSubmit = () => {
    if (gameState !== 'playing' || !currentTargetWord) return;
    
    handleCorrectAnswer(currentTargetWord.id);
    updateStats(true);
    
    // Generate new word after a short delay
    setTimeout(() => {
      generateWordOptions();
    }, 1000);
  };
  
  // Handle typing mode errors
  const handleTypingError = () => {
    if (gameState !== 'playing') return;
    
    handleIncorrectAnswer();
    updateStats(false);
  };
  
  // Handle incorrect answer
  const handleIncorrectAnswer = () => {
    // If tower falling is enabled, make some blocks fall
    if (gameSettings.towerFalling && towerBlocks.length > 0) {
      let numBlocksToFall = 0;
      
      // Determine how many blocks should fall based on difficulty
      switch (gameSettings.difficulty) {
        case 'easy':
          numBlocksToFall = 1;
          break;
        case 'medium':
          numBlocksToFall = Math.min(2, towerBlocks.length);
          break;
        case 'hard':
          numBlocksToFall = Math.min(3, towerBlocks.length);
          break;
      }
      
      // Get the topmost blocks to fall
      const blocksToFall = towerBlocks
        .slice(-numBlocksToFall)
        .map(block => block.id);
        
      setFallingBlocks(blocksToFall);
      
      // Wait for animation then remove the blocks
      setTimeout(() => {
        setTowerBlocks(prev => prev.filter(block => !blocksToFall.includes(block.id)));
        setFallingBlocks([]);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          blocksFallen: prev.blocksFallen + numBlocksToFall,
          currentHeight: prev.currentHeight - numBlocksToFall
        }));
      }, 1000);
    }
  };
  
  // Generate block type based on probabilities
  const generateBlockType = (): BlockType => {
    const rand = Math.random();
    if (rand < blockTypeProbabilities.standard) return 'standard';
    if (rand < blockTypeProbabilities.standard + blockTypeProbabilities.bonus) return 'bonus';
    if (rand < blockTypeProbabilities.standard + blockTypeProbabilities.bonus + blockTypeProbabilities.challenge) return 'challenge';
    return 'fragile';
  };
  
  // Update game stats
  const updateStats = (isCorrect: boolean) => {
    setStats(prev => {
      const totalAttempts = prev.blocksPlaced + prev.blocksFallen + (isCorrect ? 1 : 0);
      const totalCorrect = prev.blocksPlaced + (isCorrect ? 1 : 0);
      const newAccuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 1;
      
      return {
        ...prev,
        currentLevel,
        accuracy: newAccuracy
      };
    });
  };
  
  // Handle level completed
  const handleLevelCompleted = () => {
    if (gameState !== 'playing') return;
    
    setGameState('levelCompleted');
    
    // Check if all words are used
    const unusedWords = vocabulary.filter(word => !word.correct);
    
    if (unusedWords.length === 0) {
      // Game completed
      setTimeout(() => {
        handleGameCompleted();
      }, 2000);
    } else {
      // Continue to next level
      setTimeout(() => {
        setGameState('playing');
        generateWordOptions();
      }, 2000);
    }
  };
  
  // Handle game completed
  const handleGameCompleted = () => {
    setGameState('completed');
    triggerConfetti();
    
    // Save progress if from assignment
    if (assignmentId) {
      saveProgress();
    }
  };
  
  // Handle game over (time's up)
  const handleGameOver = () => {
    setGameState('failed');
    
    // Save progress if from assignment
    if (assignmentId) {
      saveProgress();
    }
  };
  
  // Trigger confetti effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };
  
  // Save progress to Supabase (would be implemented in a real app)
  const saveProgress = async () => {
    if (!assignmentId) return;
    
    try {
      const userId = supabase.auth.getUser().then(({ data }) => data.user?.id);
      
      // Calculate accuracy
      const { blocksPlaced, blocksFallen, score, accuracy } = stats;
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('assignment_progress')
        .upsert({
          assignment_id: assignmentId,
          student_id: await userId,
          score,
          accuracy,
          attempts: 1,
          time_spent: gameSettings.timeLimit - timeLeft,
          metrics: {
            blocks_placed: blocksPlaced,
            blocks_fallen: blocksFallen,
            max_height: stats.maxHeight,
            final_level: currentLevel,
            final_state: gameState
          },
          status: gameState === 'completed' ? 'completed' : 'in_progress',
          completed_at: gameState === 'completed' ? new Date().toISOString() : null,
        })
        .select();
        
      if (error) {
        console.error('Error saving progress:', error);
      } else {
        console.log('Progress saved successfully:', data);
      }
    } catch (err) {
      console.error('Failed to save progress:', err);
    }
  };
  
  // Restart the game
  const restartGame = () => {
    setTowerBlocks([]);
    setFallingBlocks([]);
    setTimeLeft(gameSettings.timeLimit);
    setCurrentLevel(1);
    setVocabulary(sampleVocabulary.map(word => ({ ...word, correct: false })));
    startGame();
  };
  
  // Pause/resume game
  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
    }
  };

  // Toggle game mode
  const toggleGameMode = () => {
    if (gameState !== 'ready') return;
    
    setGameSettings(prev => ({
      ...prev,
      gameMode: prev.gameMode === 'multiple-choice' ? 'typing' : 'multiple-choice'
    }));
  };
  
  // Toggle translation direction
  const toggleTranslationDirection = () => {
    if (gameState !== 'ready') return;
    
    setGameSettings(prev => ({
      ...prev,
      translationDirection: prev.translationDirection === 'fromNative' ? 'toNative' : 'fromNative'
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-amber-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="bg-slate-800/80 rounded-xl shadow-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between backdrop-blur-sm border border-slate-700/50">
          <div className="flex items-center mb-4 md:mb-0">
            <Castle className="text-amber-500 mr-2" size={28} />
            <h1 className="text-2xl font-bold text-white">Sentence Towers</h1>
          </div>
          
          <div className="flex space-x-4 items-center">
            <div className="bg-indigo-900/50 px-3 py-1 rounded-full flex items-center border border-indigo-700">
              <Star className="text-yellow-500 mr-1" size={18} />
              <span className="font-bold text-white">{stats.score}</span>
            </div>
            
            <div className={`${timeLeft < 30 ? 'bg-red-900/50 border-red-700 timer-display low' : 'bg-blue-900/50 border-blue-700'} px-3 py-1 rounded-full flex items-center border`}>
              <Clock className="text-blue-400 mr-1" size={18} />
              <span className="font-bold text-white">{timeLeft}s</span>
            </div>
            
            <div className="bg-purple-900/50 px-3 py-1 rounded-full flex items-center border border-purple-700">
              <span className="font-bold text-white">Level {currentLevel}</span>
            </div>
          </div>
        </header>
        
        {/* Game Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Game area - 8 columns on desktop */}
          <div className="md:col-span-8 bg-slate-800/70 rounded-xl shadow-lg p-4 backdrop-blur-sm border border-slate-700/50 min-h-[500px] flex flex-col">
            {/* Game states */}
            {gameState === 'ready' && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Castle className="text-amber-500 mb-4" size={60} />
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Build Your Tower?</h2>
                <p className="text-slate-300 mb-6 max-w-md">
                  Select the correct translations to build your tower. Be careful - wrong answers might make your tower fall!
                  {gameSettings.towerFalling && (
                    <span className="block mt-2 text-amber-400 font-medium">
                      Tower Falling mode is enabled!
                    </span>
                  )}
                </p>
                
                <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Game Mode</div>
                    <button 
                      onClick={toggleGameMode}
                      className="bg-indigo-800/50 px-3 py-1 rounded-lg text-white hover:bg-indigo-700/50 transition-colors"
                    >
                      {gameSettings.gameMode === 'typing' ? 'Typing Mode' : 'Multiple Choice Mode'}
                    </button>
                  </div>
                  
                  <div className="bg-slate-700 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Translation Direction</div>
                    <button 
                      onClick={toggleTranslationDirection}
                      className="bg-indigo-800/50 px-3 py-1 rounded-lg text-white hover:bg-indigo-700/50 transition-colors"
                    >
                      {gameSettings.translationDirection === 'fromNative' 
                        ? 'Native → Target' 
                        : 'Target → Native'}
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-colors"
                >
                  Start Building
                </button>
              </div>
            )}
            
            {(gameState === 'playing' || gameState === 'paused') && (
              <div className="flex flex-col h-full">
                {/* Game controls */}
                <div className="game-controls">
                  <div className="level-badge">Level {currentLevel}</div>
                  {gameState === 'playing' ? (
                    <button 
                      onClick={togglePause} 
                      className="bg-slate-700 hover:bg-slate-600 p-2 rounded-full"
                    >
                      <PauseIcon className="text-white" size={16} />
                    </button>
                  ) : (
                    <button 
                      onClick={togglePause} 
                      className="bg-green-700 hover:bg-green-600 p-2 rounded-full"
                    >
                      <PlayIcon className="text-white" size={16} />
                    </button>
                  )}
                </div>
                
                {/* Target word to translate */}
                {currentTargetWord && (
                  <TargetWord 
                    word={currentTargetWord.word} 
                    translation={currentTargetWord.translation}
                    translationDirection={gameSettings.translationDirection}
                  />
                )}
                
                {/* Tower area */}
                <div className="flex-1 flex items-end justify-center my-4">
                  <Tower blocks={towerBlocks} fallingBlocks={fallingBlocks} />
                </div>
                
                {/* Word options or typing input */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-slate-400 mb-2">
                    {gameSettings.gameMode === 'multiple-choice' 
                      ? 'Select the correct translation:' 
                      : 'Type the correct translation:'}
                  </h3>
                  
                  {gameSettings.gameMode === 'multiple-choice' ? (
                    <WordOptions 
                      options={wordOptions} 
                      onSelectOption={handleSelectOption} 
                      disabled={gameState === 'paused' || fallingBlocks.length > 0}
                    />
                  ) : (
                    currentTargetWord && (
                      <TypingInput
                        expectedAnswer={gameSettings.translationDirection === 'fromNative' 
                          ? currentTargetWord.translation 
                          : currentTargetWord.word}
                        onCorrectAnswer={handleTypingSubmit}
                        onIncorrectAnswer={handleTypingError}
                        disabled={gameState === 'paused' || fallingBlocks.length > 0}
                      />
                    )
                  )}
                </div>
              </div>
            )}
            
            {gameState === 'levelCompleted' && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle2 className="text-green-500 mb-4" size={60} />
                  <h2 className="text-2xl font-bold text-white mb-4">Level {currentLevel - 1} Completed!</h2>
                  <p className="text-slate-300 mb-2">
                    Your tower reached {stats.currentHeight} blocks high.
                  </p>
                  <p className="text-slate-400 mb-6">
                    Starting Level {currentLevel} soon...
                  </p>
                </motion.div>
              </div>
            )}
            
            {gameState === 'completed' && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Trophy className="text-yellow-500 mb-4" size={60} />
                  <h2 className="text-2xl font-bold text-green-400 mb-4">Tower Completed!</h2>
                  <p className="text-slate-300 mb-6">
                    Congratulations! You've completed all the levels and scored {stats.score} points.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={restartGame}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-colors flex items-center justify-center"
                    >
                      <RefreshCw className="mr-2" size={18} />
                      Play Again
                    </button>
                    
                    <Link href="/games" className="px-6 py-3 border border-indigo-600 text-indigo-300 rounded-lg font-medium hover:bg-indigo-950/50 transition-colors">
                      Back to Games
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
            
            {gameState === 'failed' && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <AlertCircle className="text-red-500 mb-4" size={60} />
                  <h2 className="text-2xl font-bold text-red-400 mb-4">Time's Up!</h2>
                  <p className="text-slate-300 mb-4">
                    You scored {stats.score} points and reached level {currentLevel}.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={restartGame}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-colors flex items-center justify-center"
                    >
                      <RefreshCw className="mr-2" size={18} />
                      Try Again
                    </button>
                    
                    <Link href="/games" className="px-6 py-3 border border-indigo-600 text-indigo-300 rounded-lg font-medium hover:bg-indigo-950/50 transition-colors">
                      Back to Games
                    </Link>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
          
          {/* Stats sidebar - 4 columns on desktop */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-slate-800/70 rounded-xl shadow-lg p-4 backdrop-blur-sm border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Tower Stats</h3>
              <GameStatsComponent stats={stats} />
            </div>
            
            <div className="bg-slate-800/70 rounded-xl shadow-lg p-4 backdrop-blur-sm border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Block Types</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-800 to-blue-600 rounded mr-2"></div>
                  <span className="text-white">Standard: {pointsByBlockType.standard} points</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-indigo-800 to-indigo-600 rounded mr-2"></div>
                  <span className="text-white">Bonus: {pointsByBlockType.bonus} points</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-800 to-red-600 rounded mr-2"></div>
                  <span className="text-white">Challenge: {pointsByBlockType.challenge} points</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-700 to-yellow-500 rounded mr-2"></div>
                  <span className="text-white">Fragile: {pointsByBlockType.fragile} points</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/70 rounded-xl shadow-lg p-4 backdrop-blur-sm border border-slate-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Game Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Game Mode:</span>
                  <span className="text-indigo-300">
                    {gameSettings.gameMode === 'typing' ? 'Typing' : 'Multiple Choice'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Translation:</span>
                  <span className="text-indigo-300">
                    {gameSettings.translationDirection === 'fromNative' 
                      ? 'Native → Target' 
                      : 'Target → Native'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Difficulty:</span>
                  <span className={
                    gameSettings.difficulty === 'easy' ? 'text-green-300' :
                    gameSettings.difficulty === 'medium' ? 'text-amber-300' :
                    'text-red-300'
                  }>
                    {gameSettings.difficulty.charAt(0).toUpperCase() + gameSettings.difficulty.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tower Falling:</span>
                  <span className={gameSettings.towerFalling ? 'text-red-300' : 'text-green-300'}>
                    {gameSettings.towerFalling ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Controls and Info */}
        <div className="bg-slate-800/80 rounded-xl shadow-md p-4 backdrop-blur-sm border border-slate-700/50 mt-6">
          <div className="flex justify-between">
            <Link
              href={assignmentId ? `/dashboard/assignments/${assignmentId}` : '/games'}
              className="text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              <ArrowLeft className="mr-1" size={16} />
              {assignmentId ? 'Back to Assignment' : 'Back to Games'}
            </Link>
            
            {(gameState === 'playing' || gameState === 'completed' || gameState === 'failed') && (
              <button
                onClick={saveProgress}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Save Progress
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
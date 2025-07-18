'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Flame, Clock, Trophy, Star
} from 'lucide-react';

// Import types
import { 
  BlockType, TowerBlock as TowerBlockType, 
  GameState, GameSettings, GameStats
} from './types';

// Sample vocabulary
const sampleVocabulary = [
  { id: '1', word: 'hello', translation: 'hola', correct: false },
  { id: '2', word: 'goodbye', translation: 'adiós', correct: false },
  { id: '3', word: 'thank you', translation: 'gracias', correct: false },
  { id: '4', word: 'please', translation: 'por favor', correct: false },
  { id: '5', word: 'yes', translation: 'sí', correct: false },
  { id: '6', word: 'no', translation: 'no', correct: false },
  { id: '7', word: 'excuse me', translation: 'disculpe', correct: false },
  { id: '8', word: 'sorry', translation: 'lo siento', correct: false },
  { id: '9', word: 'water', translation: 'agua', correct: false },
  { id: '10', word: 'food', translation: 'comida', correct: false },
];

export default function SentenceTowersGame() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 120,
    towerFalling: true,
    wordMode: 'vocabulary',
    difficulty: 'medium',
    vocabularyId: null,
    gameMode: 'multiple-choice',
    translationDirection: 'fromNative'
  });
  
  // Tower state
  const [towerBlocks, setTowerBlocks] = useState<TowerBlockType[]>([]);
  const [fallingBlocks, setFallingBlocks] = useState<string[]>([]);
  const [wordOptions, setWordOptions] = useState<{id: string; word: string; translation: string; isCorrect: boolean}[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  
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
  const [timeLeft, setTimeLeft] = useState(120);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Game settings
  const [vocabulary, setVocabulary] = useState(sampleVocabulary);
  const [currentTargetWord, setCurrentTargetWord] = useState<{
    id: string;
    word: string;
    translation: string;
  } | null>(null);

  // Block configuration
  const blockTypeProbabilities = {
    standard: 0.7,
    bonus: 0.15,
    challenge: 0.1,
    fragile: 0.05
  };

  const pointsByBlockType = {
    standard: 10,
    bonus: 25,
    challenge: 50,
    fragile: 15
  };

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
    setStreak(0);
    setTimeLeft(120);
    setVocabulary(sampleVocabulary.map(word => ({ ...word, correct: false })));
    generateWordOptions();
  };

  // Generate word options
  const generateWordOptions = () => {
    const unusedWords = vocabulary.filter(word => !word.correct);
    
    if (unusedWords.length === 0) {
      handleGameCompleted();
      return;
    }
    
    const shuffledWords = [...unusedWords].sort(() => Math.random() - 0.5);
    const targetWord = shuffledWords[0];
    setCurrentTargetWord(targetWord);
    
    const otherWords = shuffledWords.slice(1).slice(0, 3);
    const allOptions = [targetWord, ...otherWords].sort(() => Math.random() - 0.5);
    
    const options = allOptions.map(word => ({
      id: word.id,
      word: word.word,
      translation: word.translation,
      isCorrect: word.id === targetWord.id
    }));
    
    setWordOptions(options);
  };

  // Handle option selection
  const handleSelectOption = (option: {id: string; word: string; translation: string; isCorrect: boolean}) => {
    if (gameState !== 'playing') return;
    
    if (option.isCorrect) {
      handleCorrectAnswer(option.id);
      setStreak(prev => prev + 1);
    } else {
      handleIncorrectAnswer();
      setStreak(0);
    }
    
    setTimeout(() => {
      generateWordOptions();
    }, option.isCorrect ? 1000 : 1500);
  };

  // Handle correct answer
  const handleCorrectAnswer = (selectedWordId: string) => {
    if (!currentTargetWord) return;
    
    setVocabulary(prev => 
      prev.map(word => 
        word.id === selectedWordId ? { ...word, correct: true } : word
      )
    );
    
    const blockType = generateBlockType();
    
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
    
    setStats(prev => ({
      ...prev,
      score: prev.score + pointsByBlockType[blockType],
      blocksPlaced: prev.blocksPlaced + 1,
      currentHeight: prev.currentHeight + 1,
      maxHeight: Math.max(prev.maxHeight, prev.currentHeight + 1)
    }));
    
    // Level progression
    if (towerBlocks.length > 0 && (towerBlocks.length + 1) % 5 === 0) {
      setCurrentLevel(prev => prev + 1);
    }
  };

  // Handle incorrect answer
  const handleIncorrectAnswer = () => {
    if (gameSettings.towerFalling && towerBlocks.length > 0) {
      let numBlocksToFall = 1;
      
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
      
      const blocksToFall = towerBlocks
        .slice(-numBlocksToFall)
        .map(block => block.id);
        
      setFallingBlocks(blocksToFall);
      
      setTimeout(() => {
        setTowerBlocks(prev => prev.filter(block => !blocksToFall.includes(block.id)));
        setFallingBlocks([]);
        
        setStats(prev => ({
          ...prev,
          blocksFallen: prev.blocksFallen + numBlocksToFall,
          currentHeight: prev.currentHeight - numBlocksToFall
        }));
      }, 1000);
    }
  };

  // Generate block type
  const generateBlockType = (): BlockType => {
    const rand = Math.random();
    if (rand < blockTypeProbabilities.standard) return 'standard';
    if (rand < blockTypeProbabilities.standard + blockTypeProbabilities.bonus) return 'bonus';
    if (rand < blockTypeProbabilities.standard + blockTypeProbabilities.bonus + blockTypeProbabilities.challenge) return 'challenge';
    return 'fragile';
  };

  // Handle game completed
  const handleGameCompleted = () => {
    setGameState('completed');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Handle game over
  const handleGameOver = () => {
    setGameState('failed');
  };

  // Get block style based on type
  const getBlockStyle = (type: BlockType) => {
    switch (type) {
      case 'standard':
        return 'bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-600';
      case 'bonus':
        return 'bg-gradient-to-r from-orange-400 to-yellow-500 border-orange-600';
      case 'challenge':
        return 'bg-gradient-to-r from-red-400 to-pink-500 border-red-600';
      case 'fragile':
        return 'bg-gradient-to-r from-gray-400 to-gray-600 border-gray-700';
      default:
        return 'bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-600';
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'url(/games/sentence-towers/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <Link href="/games" className="p-3 bg-black/30 hover:bg-black/50 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300">
          <ArrowLeft className="h-6 w-6 text-white" />
        </Link>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
            Sentence Towers
          </h1>
        </div>

        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Game HUD */}
      <div className="relative z-20 px-6 mb-6">
        <div className="flex justify-between items-center">
          {/* Score */}
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-orange-500/30">
            <div className="text-orange-400 text-sm font-bold mb-1">SCORE</div>
            <div className="text-2xl font-bold text-white">{stats.score}</div>
          </div>

          {/* Timer */}
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-blue-500/30">
            <div className="text-blue-400 text-sm font-bold mb-1 text-center">TIME</div>
            <div className={`text-2xl font-bold text-center ${
              timeLeft <= 30 ? 'text-red-400' : timeLeft <= 60 ? 'text-orange-400' : 'text-green-400'
            }`}>
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Level & Height */}
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-purple-500/30">
            <div className="text-purple-400 text-sm font-bold mb-1">LEVEL {currentLevel}</div>
            <div className="text-white text-lg font-bold">Height: {stats.currentHeight}</div>
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-red-500/30">
              <div className="flex items-center space-x-2">
                <Flame className="h-5 w-5 text-red-400" />
                <span className="text-white font-bold">{streak} STREAK</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative z-10 flex justify-center items-end h-96 mb-8">
        {/* Current word to translate */}
        {currentTargetWord && gameState === 'playing' && (
          <div className="absolute top-0 left-8">
            <motion.div
              key={currentTargetWord.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-2xl p-6 shadow-2xl border-4 border-orange-300"
            >
              <div className="text-center">
                <div className="text-sm font-semibold text-orange-100 mb-2">
                  Translate to target language:
                </div>
                <div className="text-3xl font-bold text-white">
                  {currentTargetWord.word}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Tower */}
        <div className="flex flex-col-reverse items-center space-y-reverse space-y-1">
          {/* Tower blocks */}
          {towerBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ y: -100, opacity: 0, scale: 0 }}
              animate={{ 
                y: 0, 
                opacity: 1,
                scale: 1,
                x: fallingBlocks.includes(block.id) ? (Math.random() > 0.5 ? 200 : -200) : 0,
                rotate: fallingBlocks.includes(block.id) ? (Math.random() > 0.5 ? 45 : -45) : 0
              }}
              transition={{ 
                duration: fallingBlocks.includes(block.id) ? 1.5 : 0.5,
                delay: fallingBlocks.includes(block.id) ? 0 : index * 0.1,
                type: "spring"
              }}
              className={`
                w-32 h-16 rounded-lg border-4 shadow-xl flex items-center justify-center relative
                ${getBlockStyle(block.type)}
                ${fallingBlocks.includes(block.id) ? 'z-0' : `z-${10 + index}`}
              `}
            >
              <span className="text-white font-bold text-sm text-center px-2">
                {block.word}
              </span>
              
              {/* Special effects for different block types */}
              {block.type === 'bonus' && (
                <Star className="absolute -top-2 -right-2 h-4 w-4 text-yellow-300 animate-pulse" />
              )}
              {block.type === 'challenge' && (
                <div className="absolute inset-0 rounded-lg border-2 border-red-300 animate-pulse" />
              )}
            </motion.div>
          ))}

          {/* Foundation */}
          <div className="w-40 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg border-4 border-gray-500 shadow-lg mt-2"></div>
        </div>

        {/* Stats panel */}
        <div className="absolute top-0 right-8 space-y-3">
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-3 border border-cyan-500/30">
            <div className="text-cyan-400 text-xs font-bold mb-1">ACCURACY</div>
            <div className="text-lg font-bold text-white">{(stats.accuracy * 100).toFixed(1)}%</div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-3 border border-green-500/30">
            <div className="text-green-400 text-xs font-bold mb-1">PLACED</div>
            <div className="text-lg font-bold text-white">{stats.blocksPlaced}</div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-3 border border-red-500/30">
            <div className="text-red-400 text-xs font-bold mb-1">FALLEN</div>
            <div className="text-lg font-bold text-white">{stats.blocksFallen}</div>
          </div>
        </div>
      </div>

      {/* Word Options - The core game interaction */}
      {gameState === 'playing' && (
        <div className="relative z-20 p-6">
          <div className="flex justify-center space-x-4 max-w-4xl mx-auto">
            {wordOptions.map((option, index) => (
              <motion.button
                key={`${option.id}-${index}`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectOption(option)}
                className={`
                  px-6 py-4 rounded-xl font-bold text-white text-lg min-w-32 border-4 shadow-lg
                  transition-all duration-200 backdrop-blur-md
                  ${option.isCorrect 
                    ? 'bg-blue-600/80 border-blue-400 hover:bg-blue-500/90' 
                    : 'bg-slate-700/80 border-slate-500 hover:bg-slate-600/90'
                  }
                `}
              >
                {option.translation}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Block type legend */}
      <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-md rounded-xl p-4 border border-gray-600/50">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded border"></div>
            <span className="text-white">STANDARD</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-yellow-500 rounded border"></div>
            <span className="text-white">BONUS</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded border"></div>
            <span className="text-white">CHALLENGE</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded border"></div>
            <span className="text-white">FRAGILE</span>
          </div>
        </div>
      </div>

      {/* Game status */}
      <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md rounded-xl p-4 border border-blue-500/30">
        <div className="flex items-center space-x-4 text-sm text-white">
          <div>Game Mode: <span className="text-blue-400">Multiple Choice</span></div>
          <div>Difficulty: <span className="text-yellow-400">{gameSettings.difficulty}</span></div>
          <div>Tower Falling: <span className="text-green-400">{gameSettings.towerFalling ? 'Enabled' : 'Disabled'}</span></div>
        </div>
      </div>

      {/* Game State Overlays */}
      <AnimatePresence>
        {/* Start screen */}
        {gameState === 'ready' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black/70 backdrop-blur-md rounded-3xl p-8 max-w-md w-full mx-4 border border-orange-500/50 text-center"
            >
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-4 text-orange-400">Ready to Build?</h2>
                <p className="text-gray-300 mb-6">
                  Translate words correctly to build your tower. Wrong answers may cause blocks to fall!
                </p>
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-400 hover:to-yellow-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  🚀 Start Building
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Victory screen */}
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black/70 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full mx-4 border border-green-500/50 text-center"
            >
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-green-400">Victory!</h2>
              <div className="space-y-2 mb-6 text-white">
                <div>Final Score: <span className="text-green-400 font-bold">{stats.score}</span></div>
                <div>Tower Height: <span className="text-green-400 font-bold">{stats.maxHeight}</span></div>
                <div>Accuracy: <span className="text-green-400 font-bold">{(stats.accuracy * 100).toFixed(1)}%</span></div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Play Again
                </button>
                <Link href="/games">
                  <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200">
                    Main Menu
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Game Over screen */}
        {gameState === 'failed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black/70 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full mx-4 border border-red-500/50 text-center"
            >
              <Clock className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-red-400">Time's Up!</h2>
              <div className="space-y-2 mb-6 text-white">
                <div>Final Score: <span className="text-red-400 font-bold">{stats.score}</span></div>
                <div>Tower Height: <span className="text-red-400 font-bold">{stats.maxHeight}</span></div>
                <div>Blocks Placed: <span className="text-red-400 font-bold">{stats.blocksPlaced}</span></div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Try Again
                </button>
                <Link href="/games">
                  <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200">
                    Main Menu
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

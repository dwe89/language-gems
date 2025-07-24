'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Flame, Settings, Home
} from 'lucide-react';

// Import types
import { 
  BlockType, TowerBlock as TowerBlockType, 
  GameState, GameSettings, GameStats
} from './types';

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
    setTimeLeft(120);
    generateWordOptions();
  };

  // Generate options for the current level
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
    } else {
      handleIncorrectAnswer();
    }
    
    setTimeout(() => {
      generateWordOptions();
    }, 1500);
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
    
    if (currentLevel * 5 <= towerBlocks.length + 1) {
      setCurrentLevel(prev => prev + 1);
    }
  };

  // Handle incorrect answer
  const handleIncorrectAnswer = () => {
    if (gameSettings.towerFalling && towerBlocks.length > 0) {
      let numBlocksToFall = 1;
      
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
        return 'bg-gradient-to-r from-gray-400 to-gray-600 border-gray-700';
      case 'fragile':
        return 'bg-gradient-to-r from-gray-300 to-gray-500 border-gray-600';
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700 relative overflow-hidden">
      {/* Animated city skyline background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* City buildings silhouettes */}
        <svg 
          className="absolute bottom-0 w-full h-80" 
          viewBox="0 0 1200 400" 
          preserveAspectRatio="none"
        >
          {/* Building layers */}
          <rect x="0" y="200" width="150" height="200" fill="#1a1a2e" opacity="0.8"/>
          <rect x="120" y="150" width="180" height="250" fill="#16213e" opacity="0.9"/>
          <rect x="270" y="180" width="120" height="220" fill="#0f0f1e" opacity="0.8"/>
          <rect x="360" y="120" width="160" height="280" fill="#1a1a2e" opacity="0.9"/>
          <rect x="490" y="160" width="140" height="240" fill="#16213e" opacity="0.8"/>
          <rect x="600" y="100" width="200" height="300" fill="#0f0f1e" opacity="0.9"/>
          <rect x="770" y="140" width="130" height="260" fill="#1a1a2e" opacity="0.8"/>
          <rect x="870" y="180" width="150" height="220" fill="#16213e" opacity="0.9"/>
          <rect x="990" y="120" width="180" height="280" fill="#0f0f1e" opacity="0.8"/>
          
          {/* Building windows */}
          {Array.from({length: 50}, (_, i) => (
            <rect 
              key={i}
              x={20 + (i * 23) % 1200} 
              y={140 + (i * 17) % 200} 
              width="8" 
              height="12" 
              fill="#FFA500" 
              opacity={Math.random() > 0.6 ? 0.8 : 0.2}
            />
          ))}
        </svg>

        {/* Construction crane */}
        <div className="absolute top-10 right-20">
          <svg width="200" height="300" viewBox="0 0 200 300">
            {/* Crane mast */}
            <line x1="100" y1="50" x2="100" y2="280" stroke="#FF8C00" strokeWidth="6"/>
            
            {/* Horizontal jib */}
            <line x1="20" y1="80" x2="180" y2="80" stroke="#FF8C00" strokeWidth="4"/>
            
            {/* Support cables */}
            <line x1="100" y1="50" x2="40" y2="80" stroke="#FF8C00" strokeWidth="2"/>
            <line x1="100" y1="50" x2="160" y2="80" stroke="#FF8C00" strokeWidth="2"/>
            
            {/* Hook and load */}
            <line x1="130" y1="80" x2="130" y2="120" stroke="#FF8C00" strokeWidth="2"/>
            
            {/* Animated construction block */}
            <motion.g
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <rect x="118" y="115" width="24" height="16" fill="#FF6B35" stroke="#FF8C00" strokeWidth="2"/>
              <rect x="120" y="117" width="8" height="4" fill="#FFE5B4"/>
              <rect x="130" y="117" width="8" height="4" fill="#FFE5B4"/>
              <rect x="120" y="123" width="8" height="4" fill="#FFE5B4"/>
              <rect x="130" y="123" width="8" height="4" fill="#FFE5B4"/>
            </motion.g>
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <Link href="/games" className="p-3 bg-black/20 hover:bg-black/30 rounded-full backdrop-blur-md border border-white/10 transition-all duration-300">
          <ArrowLeft className="h-6 w-6 text-white" />
        </Link>
        
        <div className="text-white text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
            Word Towers
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6 text-white/70" />
        </div>
      </div>

      {/* Game Area */}
      <div className="relative z-10 flex-1 flex">
        {/* Left side - Current word to translate */}
        <div className="w-1/3 p-6 flex flex-col justify-center">
          {currentTargetWord && (
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
          )}
        </div>

        {/* Center - Tower */}
        <div className="flex-1 flex flex-col items-center justify-end p-6">
          {/* Tower building label */}
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg mb-4 font-bold border-2 border-green-400">
            🏗️ BUILDING
          </div>

          {/* Tower blocks */}
          <div className="flex flex-col-reverse items-center space-y-reverse space-y-1 mb-8">
            {towerBlocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ y: -100, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  x: fallingBlocks.includes(block.id) ? (Math.random() > 0.5 ? 100 : -100) : 0,
                  rotate: fallingBlocks.includes(block.id) ? (Math.random() > 0.5 ? 45 : -45) : 0
                }}
                transition={{ 
                  duration: fallingBlocks.includes(block.id) ? 1 : 0.5,
                  delay: index * 0.1 
                }}
                className={`
                  w-32 h-16 rounded-lg border-4 shadow-lg flex items-center justify-center
                  ${getBlockStyle(block.type)}
                  ${fallingBlocks.includes(block.id) ? 'z-0' : `z-${10 + index}`}
                `}
              >
                <span className="text-white font-bold text-sm text-center px-2">
                  {block.word}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Foundation */}
          <div className="w-40 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-lg border-4 border-gray-500 shadow-lg"></div>
        </div>

        {/* Right side - Score and Level */}
        <div className="w-1/4 p-6 space-y-4">
          {/* Score */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-600">
            <div className="text-white text-center">
              <div className="text-sm text-slate-300 mb-1">SCORE</div>
              <div className="text-3xl font-bold text-orange-400">{stats.score}</div>
            </div>
          </div>

          {/* Level */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-600">
            <div className="text-white text-center">
              <div className="text-2xl font-bold">{stats.currentHeight}</div>
              <div className="text-sm text-slate-300">LEVEL</div>
              <div className="text-2xl font-bold">1</div>
            </div>
          </div>

          {/* Streak indicator */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-600">
            <div className="flex items-center justify-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-white font-bold">STREAK 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Word options */}
      {gameState === 'playing' && (
        <div className="relative z-10 p-6">
          <div className="flex justify-center space-x-4 max-w-6xl mx-auto">
            {wordOptions.map((option, index) => (
              <motion.button
                key={`${option.id}-${index}`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectOption(option)}
                className={`
                  px-8 py-4 rounded-xl font-bold text-white text-lg min-w-32 border-4 shadow-lg
                  transition-all duration-200 hover:scale-105 hover:shadow-xl
                  ${option.isCorrect 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-400 hover:from-blue-400 hover:to-cyan-500' 
                    : 'bg-gradient-to-r from-slate-600 to-slate-700 border-slate-500 hover:from-slate-500 hover:to-slate-600'
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
      <div className="absolute bottom-6 left-6 bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-600">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded border"></div>
            <span className="text-white">STANDARD</span>
            <span className="text-cyan-300 font-bold">STANDARD</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-yellow-500 rounded border"></div>
            <span className="text-white">BONUS</span>
            <span className="text-orange-300 font-bold">BONUS</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded border"></div>
            <span className="text-white">CHALLENGE</span>
            <span className="text-gray-300 font-bold">FRAGILE</span>
          </div>
        </div>
      </div>

      {/* Game status overlay */}
      <div className="absolute top-4 right-6 bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-600">
        <div className="flex items-center space-x-4 text-sm text-white">
          <div className="flex items-center space-x-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="font-bold">STREAK 3</span>
          </div>
          <div>Game Mode: <span className="text-blue-400">Multiple Choice</span></div>
          <div>Translation: <span className="text-green-400">Medium</span></div>
          <div>Difficulty: <span className="text-yellow-400">Enabled</span></div>
        </div>
      </div>

      {/* Start screen */}
      {gameState === 'ready' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-600"
          >
            <div className="text-center text-white">
              <h2 className="text-3xl font-bold mb-4 text-orange-400">Ready to Build?</h2>
              <p className="text-slate-300 mb-6">
                Translate words correctly to build your tower. Wrong answers may cause blocks to fall!
              </p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-400 hover:to-yellow-500 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105"
              >
                Start Building
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

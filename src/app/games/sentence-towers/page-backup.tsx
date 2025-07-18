'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, Flame, Settings, Zap, Star, Trophy, 
  Volume2, VolumeX, Pause, Play, RotateCcw, Home
} from 'lucide-react';

// Import our amazing Pixi component
import { PixiTowerGame } from './components/PixiTowerGame';

// Import types
import { 
  BlockType, TowerBlock as TowerBlockType, 
  GameState, GameSettings, GameStats
} from './types';

// Enhanced vocabulary with more exciting words
const sampleVocabulary = [
  { id: '1', word: 'adventure', translation: 'aventura', correct: false },
  { id: '2', word: 'mystery', translation: 'misterio', correct: false },
  { id: '3', word: 'victory', translation: 'victoria', correct: false },
  { id: '4', word: 'magic', translation: 'magia', correct: false },
  { id: '5', word: 'treasure', translation: 'tesoro', correct: false },
  { id: '6', word: 'legend', translation: 'leyenda', correct: false },
  { id: '7', word: 'warrior', translation: 'guerrero', correct: false },
  { id: '8', word: 'dragon', translation: 'dragón', correct: false },
  { id: '9', word: 'castle', translation: 'castillo', correct: false },
  { id: '10', word: 'freedom', translation: 'libertad', correct: false },
  { id: '11', word: 'destiny', translation: 'destino', correct: false },
  { id: '12', word: 'courage', translation: 'coraje', correct: false },
];

export default function SentenceTowersUltimate() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 180, // 3 minutes for more epic gameplay
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
  const [combo, setCombo] = useState(1);
  
  // Enhanced game stats
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    blocksPlaced: 0,
    blocksFallen: 0,
    currentHeight: 0,
    maxHeight: 0,
    currentLevel: 1,
    accuracy: 1
  });
  
  // Timer and effects
  const [timeLeft, setTimeLeft] = useState(180);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Game settings
  const [vocabulary, setVocabulary] = useState(sampleVocabulary);
  const [currentTargetWord, setCurrentTargetWord] = useState<{
    id: string;
    word: string;
    translation: string;
  } | null>(null);

  // Enhanced block system
  const blockTypeProbabilities = {
    standard: 0.5,
    bonus: 0.25,
    challenge: 0.15,
    fragile: 0.1
  };

  const pointsByBlockType = {
    standard: 100,
    bonus: 250,
    challenge: 500,
    fragile: 150
  };

  // Timer effect with pause functionality
  useEffect(() => {
    if (gameState === 'playing' && !isGamePaused) {
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
  }, [gameState, isGamePaused]);

  // Enhanced start game with epic intro
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
    setCombo(1);
    setTimeLeft(180);
    setVocabulary(sampleVocabulary.map(word => ({ ...word, correct: false })));
    generateWordOptions();
    
    // Epic start sound and effects
    if (soundEnabled) {
      playEpicStartSound();
    }
  };

  // Generate word options with enhanced logic
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

  // Enhanced option selection with combo system
  const handleSelectOption = (option: {id: string; word: string; translation: string; isCorrect: boolean}) => {
    if (gameState !== 'playing' || isGamePaused) return;
    
    if (option.isCorrect) {
      handleCorrectAnswer(option.id);
      setStreak(prev => prev + 1);
      
      // Combo system - more points for consecutive correct answers
      if (streak >= 2) {
        setCombo(prev => Math.min(prev + 0.5, 5)); // Max 5x combo
      }
      
      // Epic effects for streaks
      if (streak >= 4) {
        triggerStreakEffect();
      }
      
    } else {
      handleIncorrectAnswer();
      setStreak(0);
      setCombo(1);
    }
    
    setTimeout(() => {
      generateWordOptions();
    }, option.isCorrect ? 1000 : 2000);
  };

  // Enhanced correct answer handling
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
      points: Math.floor(pointsByBlockType[blockType] * combo),
      position: towerBlocks.length,
      isShaking: false
    };
    
    setTowerBlocks(prev => [...prev, newBlock]);
    
    // Enhanced scoring with combo multipliers
    const earnedPoints = Math.floor(pointsByBlockType[blockType] * combo);
    
    setStats(prev => ({
      ...prev,
      score: prev.score + earnedPoints,
      blocksPlaced: prev.blocksPlaced + 1,
      currentHeight: prev.currentHeight + 1,
      maxHeight: Math.max(prev.maxHeight, prev.currentHeight + 1)
    }));
    
    // Level progression
    if (towerBlocks.length > 0 && (towerBlocks.length + 1) % 5 === 0) {
      setCurrentLevel(prev => prev + 1);
      triggerLevelUpEffect();
    }
    
    // Play success sound
    if (soundEnabled) {
      playSuccessSound(blockType, combo);
    }
  };

  // Enhanced incorrect answer with epic falling effects
  const handleIncorrectAnswer = () => {
    if (gameSettings.towerFalling && towerBlocks.length > 0) {
      let numBlocksToFall = Math.min(2, towerBlocks.length);
      
      // Harder difficulties make more blocks fall
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
      }, 1500);
    }
    
    // Play failure sound
    if (soundEnabled) {
      playFailureSound();
    }
  };

  // Generate enhanced block types
  const generateBlockType = (): BlockType => {
    const rand = Math.random();
    
    // Streak bonuses - higher chance of special blocks with streaks
    const streakBonus = streak * 0.05;
    
    if (rand < blockTypeProbabilities.standard - streakBonus) return 'standard';
    if (rand < blockTypeProbabilities.standard + blockTypeProbabilities.bonus) return 'bonus';
    if (rand < blockTypeProbabilities.standard + blockTypeProbabilities.bonus + blockTypeProbabilities.challenge + streakBonus) return 'challenge';
    return 'fragile';
  };

  // Enhanced game completion
  const handleGameCompleted = () => {
    setGameState('completed');
    triggerEpicVictoryEffect();
    
    if (soundEnabled) {
      playVictorySound();
    }
  };

  // Game over
  const handleGameOver = () => {
    setGameState('failed');
    
    if (soundEnabled) {
      playGameOverSound();
    }
  };

  // Epic effects
  const triggerEpicVictoryEffect = () => {
    // Multi-stage confetti
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: Math.random(), y: Math.random() * 0.8 },
        colors: ['#ff6b35', '#f7931e', '#ffd700', '#32cd32', '#1e90ff', '#9370db']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const triggerStreakEffect = () => {
    confetti({
      particleCount: 50,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#ff6b35', '#ffd700']
    });
  };

  const triggerLevelUpEffect = () => {
    confetti({
      particleCount: 25,
      spread: 30,
      origin: { y: 0.7 },
      colors: ['#32cd32', '#00ff00']
    });
  };

  // Sound effects (placeholders - you can add actual audio files)
  const playEpicStartSound = () => {
    // Add epic start sound
    console.log('🎵 Epic start sound!');
  };

  const playSuccessSound = (blockType: BlockType, comboLevel: number) => {
    console.log(`🎵 Success sound! Type: ${blockType}, Combo: ${comboLevel}x`);
  };

  const playFailureSound = () => {
    console.log('🎵 Failure sound with block falling effects');
  };

  const playVictorySound = () => {
    console.log('🎵 Epic victory fanfare!');
  };

  const playGameOverSound = () => {
    console.log('🎵 Dramatic game over sound');
  };

  // Pause/Resume functionality
  const togglePause = () => {
    setIsGamePaused(prev => !prev);
  };

  // Format time with warning colors
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 30) return 'text-red-400';
    if (timeLeft <= 60) return 'text-orange-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header with enhanced controls */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <Link href="/games" className="p-3 bg-black/30 hover:bg-black/50 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105">
            <ArrowLeft className="h-6 w-6 text-white" />
          </Link>
          
          {gameState === 'playing' && (
            <button
              onClick={togglePause}
              className="p-3 bg-blue-600/80 hover:bg-blue-600 rounded-xl backdrop-blur-md border border-blue-400/50 transition-all duration-300 hover:scale-105"
            >
              {isGamePaused ? <Play className="h-6 w-6 text-white" /> : <Pause className="h-6 w-6 text-white" />}
            </button>
          )}
        </div>
        
        <motion.div
          className="text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
        >
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-600">
            TOWER LEGENDS
          </h1>
          <div className="text-orange-300 font-bold text-lg">Ultimate Edition</div>
        </motion.div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-3 rounded-xl backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
              soundEnabled 
                ? 'bg-green-600/80 hover:bg-green-600 border-green-400/50' 
                : 'bg-red-600/80 hover:bg-red-600 border-red-400/50'
            }`}
          >
            {soundEnabled ? <Volume2 className="h-6 w-6 text-white" /> : <VolumeX className="h-6 w-6 text-white" />}
          </button>
          
          <Settings className="h-6 w-6 text-white/70 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Enhanced HUD */}
      <div className="relative z-20 px-6">
        <div className="flex justify-between items-start">
          {/* Left side - Game stats */}
          <div className="space-y-4">
            {/* Score with combo multiplier */}
            <motion.div
              className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-orange-500/30"
              animate={{
                boxShadow: combo > 1 ? [
                  "0 0 20px rgba(249, 115, 22, 0.5)",
                  "0 0 40px rgba(249, 115, 22, 0.8)",
                  "0 0 20px rgba(249, 115, 22, 0.5)"
                ] : "0 0 0px rgba(249, 115, 22, 0)"
              }}
              transition={{ duration: 1, repeat: combo > 1 ? Infinity : 0 }}
            >
              <div className="text-orange-400 text-sm font-bold mb-2">SCORE</div>
              <div className="text-4xl font-black text-white">{stats.score.toLocaleString()}</div>
              {combo > 1 && (
                <motion.div 
                  className="text-orange-300 text-sm font-bold mt-1"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {combo.toFixed(1)}x COMBO!
                </motion.div>
              )}
            </motion.div>

            {/* Streak indicator */}
            {streak > 0 && (
              <motion.div
                className="bg-gradient-to-r from-red-600/80 to-orange-600/80 backdrop-blur-md rounded-xl p-4 border border-red-400/30"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Flame className="h-6 w-6 text-white" />
                  <span className="text-white font-bold text-lg">{streak} STREAK</span>
                  {streak >= 5 && <Star className="h-5 w-5 text-yellow-400" />}
                </div>
              </motion.div>
            )}
          </div>

          {/* Center - Timer */}
          <motion.div
            className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30"
            animate={{
              borderColor: timeLeft <= 30 ? ["rgba(239, 68, 68, 0.3)", "rgba(239, 68, 68, 0.8)", "rgba(239, 68, 68, 0.3)"] : "rgba(59, 130, 246, 0.3)"
            }}
            transition={{ duration: 1, repeat: timeLeft <= 30 ? Infinity : 0 }}
          >
            <div className="text-blue-400 text-sm font-bold mb-2 text-center">TIME REMAINING</div>
            <div className={`text-4xl font-black text-center ${getTimeColor()}`}>
              {formatTime(timeLeft)}
            </div>
          </motion.div>

          {/* Right side - Level and height */}
          <div className="space-y-4">
            <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
              <div className="text-purple-400 text-sm font-bold mb-2">LEVEL</div>
              <div className="text-4xl font-black text-white">{currentLevel}</div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 border border-green-500/30">
              <div className="text-green-400 text-sm font-bold mb-2">HEIGHT</div>
              <div className="text-4xl font-black text-white">{stats.currentHeight}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main game area */}
      <div className="relative z-10 flex-1 flex mt-8">
        {/* Left side - Current word with epic styling */}
        <div className="w-1/4 p-6 flex flex-col justify-center">
          {currentTargetWord && gameState === 'playing' && (
            <motion.div
              key={currentTargetWord.id}
              initial={{ opacity: 0, x: -100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.8 }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl p-8 shadow-2xl border-4 border-orange-300/50 relative overflow-hidden"
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              
              <div className="relative z-10 text-center">
                <motion.div 
                  className="text-orange-100 font-bold mb-4 text-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡ TRANSLATE THIS WORD ⚡
                </motion.div>
                <motion.div 
                  className="text-5xl font-black text-white drop-shadow-lg"
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 40px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentTargetWord.word}
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Center - Amazing Pixi.js Tower */}
        <div className="flex-1 relative">
          <PixiTowerGame
            blocks={towerBlocks}
            onBlockAdded={(block) => {}}
            onBlockFallen={(blockId) => {}}
            gameState={gameState === 'paused' || gameState === 'levelCompleted' ? 'playing' : gameState}
          />
        </div>

        {/* Right side - Performance stats */}
        <div className="w-1/4 p-6 space-y-4">
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-cyan-500/30">
            <div className="text-cyan-400 text-sm font-bold mb-2">ACCURACY</div>
            <div className="text-2xl font-bold text-white">{(stats.accuracy * 100).toFixed(1)}%</div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-green-500/30">
            <div className="text-green-400 text-sm font-bold mb-2">BLOCKS PLACED</div>
            <div className="text-2xl font-bold text-white">{stats.blocksPlaced}</div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-md rounded-xl p-4 border border-red-500/30">
            <div className="text-red-400 text-sm font-bold mb-2">BLOCKS FALLEN</div>
            <div className="text-2xl font-bold text-white">{stats.blocksFallen}</div>
          </div>
        </div>
      </div>

      {/* Bottom - Enhanced word options */}
      {gameState === 'playing' && !isGamePaused && (
        <div className="relative z-20 p-6">
          <div className="flex justify-center space-x-6 max-w-6xl mx-auto">
            {wordOptions.map((option, index) => (
              <motion.button
                key={`${option.id}-${index}`}
                initial={{ y: 100, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                onClick={() => handleSelectOption(option)}
                className={`
                  px-8 py-6 rounded-2xl font-black text-white text-xl min-w-40 border-4 shadow-2xl
                  transition-all duration-300 relative overflow-hidden
                  ${option.isCorrect 
                    ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-600 border-blue-400 hover:from-blue-400 hover:via-purple-500 hover:to-cyan-500' 
                    : 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 border-slate-500 hover:from-slate-500 hover:via-slate-600 hover:to-slate-700'
                  }
                `}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <span className="relative z-10">{option.translation}</span>
                
                {/* Extra glow for correct answer */}
                {option.isCorrect && (
                  <motion.div
                    className="absolute inset-0 bg-blue-400/30 rounded-2xl"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Game state overlays */}
      <AnimatePresence>
        {/* Start screen */}
        {gameState === 'ready' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "backOut" }}
              className="bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-3xl p-12 max-w-2xl w-full mx-4 border-4 border-orange-500/50 shadow-2xl relative overflow-hidden"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-purple-600/10" />
              
              <div className="relative z-10 text-center text-white">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="text-8xl mb-6"
                >
                  🏗️
                </motion.div>
                
                <h2 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                  TOWER LEGENDS
                </h2>
                
                <p className="text-slate-300 mb-8 text-xl leading-relaxed">
                  Build the ultimate tower by translating words correctly! 
                  <br />
                  Wrong answers cause epic block collapses! 
                  <br />
                  <span className="text-orange-400 font-bold">Reach streak combos for massive scores!</span>
                </p>
                
                <motion.button
                  onClick={startGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-400 hover:via-red-400 hover:to-pink-500 text-white font-black py-4 px-12 rounded-2xl text-2xl transition-all duration-300 shadow-2xl border-2 border-orange-400/50 relative overflow-hidden"
                >
                  <span className="relative z-10">🚀 START BUILDING 🚀</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Pause overlay */}
        {isGamePaused && gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-800 rounded-2xl p-8 text-center border border-blue-500/50"
            >
              <Pause className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-4">GAME PAUSED</h3>
              <button
                onClick={togglePause}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200"
              >
                Resume Game
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Victory screen */}
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-800/90 to-teal-900/90 backdrop-blur-lg flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: "backOut" }}
              className="bg-gradient-to-br from-emerald-800 via-green-900 to-teal-900 rounded-3xl p-12 max-w-2xl w-full mx-4 border-4 border-green-400/50 shadow-2xl text-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="text-8xl mb-6"
              >
                🏆
              </motion.div>
              
              <h2 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                LEGENDARY VICTORY!
              </h2>
              
              <div className="space-y-4 mb-8 text-white">
                <div className="text-2xl">Final Score: <span className="text-green-400 font-bold">{stats.score.toLocaleString()}</span></div>
                <div className="text-xl">Tower Height: <span className="text-green-400 font-bold">{stats.maxHeight}</span></div>
                <div className="text-xl">Accuracy: <span className="text-green-400 font-bold">{(stats.accuracy * 100).toFixed(1)}%</span></div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <RotateCcw className="mr-2 inline h-5 w-5" />
                  Play Again
                </button>
                
                <Link href="/games">
                  <button className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 hover:scale-105">
                    <Home className="mr-2 inline h-5 w-5" />
                    Main Menu
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Epic power indicators */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30 space-y-3">
        <motion.div
          className="bg-orange-500/80 backdrop-blur-md rounded-full p-4 border border-orange-300/50"
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(249, 115, 22, 0.5)",
              "0 0 40px rgba(249, 115, 22, 0.8)",
              "0 0 20px rgba(249, 115, 22, 0.5)"
            ],
            rotate: [0, 360]
          }}
          transition={{ 
            boxShadow: { duration: 2, repeat: Infinity },
            rotate: { duration: 8, repeat: Infinity, ease: "linear" }
          }}
        >
          <Flame className="h-8 w-8 text-white" />
        </motion.div>
        
        <motion.div
          className="bg-blue-500/80 backdrop-blur-md rounded-full p-4 border border-blue-300/50"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -360]
          }}
          transition={{ 
            scale: { duration: 1.5, repeat: Infinity },
            rotate: { duration: 6, repeat: Infinity, ease: "linear" }
          }}
        >
          <Zap className="h-8 w-8 text-white" />
        </motion.div>
        
        <motion.div
          className="bg-purple-500/80 backdrop-blur-md rounded-full p-4 border border-purple-300/50"
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Star className="h-8 w-8 text-white" />
        </motion.div>
      </div>
    </div>
  );
}

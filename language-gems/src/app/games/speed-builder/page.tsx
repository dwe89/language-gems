'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Lightbulb, RefreshCw, Clock, Trophy, AlertCircle, ArrowLeft, Shuffle, ZapOff, Building2, Star, Eye, EyeOff, Zap, HeartPulse, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import './speed-builder.css';

// Import components and types
import { DraggableWord } from './components/DraggableWord';
import { WordTarget } from './components/WordTarget';
import { PowerUpButton } from './components/PowerUpButton';
import { ThemeSelector } from './components/ThemeSelector';
import { DifficultySelector } from './components/DifficultySelector';
import { SoundProvider, SoundControls, useSound } from './components/SoundManager';
import { 
  WordItem, GameState, GameSettings, GameStats, PowerUp, 
  ThemeType, DifficultyLevel, TranslationDirection, SentenceData 
} from './types';

// Example bilingual sentences for translation practice - in a real app, these would come from the API/database
const sampleSentences: SentenceData[] = [
  {
    id: "1",
    originalText: "The cat sleeps on the soft blanket",
    translatedText: "El gato duerme sobre la manta suave",
    language: "Spanish",
    difficulty: "easy"
  },
  {
    id: "2",
    originalText: "She plays piano every morning before breakfast",
    translatedText: "Ella toca el piano todas las mañanas antes del desayuno",
    language: "Spanish",
    difficulty: "medium"
  },
  {
    id: "3",
    originalText: "They visited the museum on Tuesday afternoon",
    translatedText: "Ellos visitaron el museo el martes por la tarde",
    language: "Spanish",
    difficulty: "easy"
  },
  {
    id: "4",
    originalText: "I enjoy reading books about ancient history",
    translatedText: "Me gusta leer libros sobre historia antigua",
    language: "Spanish",
    difficulty: "medium"
  },
  {
    id: "5",
    originalText: "We should meet at the coffee shop tomorrow",
    translatedText: "Deberíamos encontrarnos en la cafetería mañana",
    language: "Spanish",
    difficulty: "medium"
  },
  {
    id: "6",
    originalText: "The children built a sandcastle at the beach",
    translatedText: "Los niños construyeron un castillo de arena en la playa",
    language: "Spanish",
    difficulty: "medium"
  },
  {
    id: "7",
    originalText: "He forgot his keys on the kitchen counter",
    translatedText: "Olvidó sus llaves en la encimera de la cocina",
    language: "Spanish",
    difficulty: "hard"
  },
  {
    id: "8",
    originalText: "The students studied for their final exams",
    translatedText: "Los estudiantes estudiaron para sus exámenes finales",
    language: "Spanish",
    difficulty: "easy"
  },
  {
    id: "9",
    originalText: "The dog barked at the mailman yesterday",
    translatedText: "El perro le ladró al cartero ayer",
    language: "Spanish",
    difficulty: "easy"
  },
  {
    id: "10",
    originalText: "My brother works at a hospital downtown",
    translatedText: "Mi hermano trabaja en un hospital del centro",
    language: "Spanish",
    difficulty: "medium"
  },
];

// Default power-ups
const defaultPowerUps: PowerUp[] = [
  {
    id: 'shuffle',
    type: 'shuffle',
    active: false,
    cooldown: 10, // seconds
    description: 'Rearranges words if stuck',
    icon: 'shuffle'
  },
  {
    id: 'hint',
    type: 'hint',
    active: false,
    cooldown: 15, // seconds
    description: 'Briefly highlights the next correct word',
    icon: 'lightbulb'
  },
  {
    id: 'glow',
    type: 'glow',
    active: false,
    cooldown: 20, // seconds
    description: 'Shows the full sentence briefly',
    icon: 'sparkles'
  },
  {
    id: 'timeBoost',
    type: 'timeBoost',
    active: false,
    cooldown: 30, // seconds
    description: 'Adds 15 seconds to the timer',
    icon: 'zap'
  }
];

// Main Game Component
function SpeedBuilderGameInner() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 120, // 2 minutes
    ghostMode: false,
    ghostDuration: 3, // 3 seconds
    theme: 'default' as ThemeType,
    difficulty: 'medium' as DifficultyLevel,
    powerUpsEnabled: true,
    vocabularyId: null,
    translationDirection: 'fromNative' as TranslationDirection,
    soundEffects: true,
    backgroundMusic: true
  });
  
  // Word state
  const [currentSentence, setCurrentSentence] = useState<SentenceData | null>(null);
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [placedWords, setPlacedWords] = useState<(WordItem | null)[]>([]);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);
  
  // Game progress
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    wordsPlaced: 0,
    accuracy: 1,
    timeSpent: 0,
    streak: 0,
    highestStreak: 0,
    completedLevels: 0
  });
  const [levelIndex, setLevelIndex] = useState(0);
  const [powerUps, setPowerUps] = useState<PowerUp[]>(defaultPowerUps);
  
  // UI state
  const [isGhostActive, setIsGhostActive] = useState(false);
  const [showSentence, setShowSentence] = useState(true);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const [sentenceFlashActive, setSentenceFlashActive] = useState(false);
  
  // Refs and hooks
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const ghostTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const { playSound, setCurrentTheme } = useSound();
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(gameSettings.timeLimit);
  
  // Initialize game
  useEffect(() => {
    // Check if this is launched from an assignment
    const assignmentIdParam = searchParams?.get('assignmentId');
    if (assignmentIdParam) {
      setAssignmentId(assignmentIdParam);
      loadAssignmentSettings(assignmentIdParam);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);
    };
  }, [searchParams]);
  
  // Effect for updating the theme in sound provider
  useEffect(() => {
    setCurrentTheme(gameSettings.theme);
  }, [gameSettings.theme, setCurrentTheme]);
  
  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up
            clearInterval(timerRef.current!);
            setGameState('timeout');
            playSound('gameOver');
            return 0;
          }
          // Warning sounds at 30, 20, 10 seconds
          if (prev === 30 || prev === 20 || prev === 10) {
            playSound('ui');
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
  }, [gameState, playSound]);
  
  // Ghost mode effect
  useEffect(() => {
    if (gameState === 'playing' && gameSettings.ghostMode && showSentence) {
      if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);
      
      ghostTimerRef.current = setTimeout(() => {
        setShowSentence(false);
        setIsGhostActive(true);
      }, gameSettings.ghostDuration * 1000);
      
      return () => {
        if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);
      };
    }
  }, [gameState, gameSettings.ghostMode, gameSettings.ghostDuration, showSentence, currentSentence]);
  
  // Load assignment settings
  const loadAssignmentSettings = async (id: string) => {
    // In a real app, we would fetch the assignment settings from Supabase
    // For now, simulate loading settings
    
    // Get ghostMode based on difficulty
    const difficulty: DifficultyLevel = Math.random() > 0.7 
      ? 'hard' 
      : (Math.random() > 0.4 ? 'medium' : 'easy');
    
    const ghostMode = difficulty === 'hard';
    const ghostDuration = difficulty === 'medium' ? 3 : 0;
    const timeLimit = difficulty === 'easy' ? 180 : difficulty === 'medium' ? 120 : 90;
    
    setGameSettings({
      timeLimit,
      ghostMode,
      ghostDuration,
      theme: 'default',
      difficulty,
      powerUpsEnabled: true,
      vocabularyId: null,
      translationDirection: Math.random() > 0.5 ? 'fromNative' : 'toNative',
      soundEffects: true,
      backgroundMusic: true
    });
    
    setTimeLeft(timeLimit);
    
    // Load first sentence
    loadNewSentence(0);
  };
  
  // Apply settings based on difficulty
  const applyDifficultySettings = (difficulty: DifficultyLevel) => {
    let newSettings = { ...gameSettings, difficulty };
    
    switch (difficulty) {
      case 'easy':
        newSettings.ghostMode = false;
        newSettings.ghostDuration = 0;
        newSettings.timeLimit = 180; // 3 minutes
        break;
      case 'medium':
        newSettings.ghostMode = true;
        newSettings.ghostDuration = 3; // 3 seconds flash
        newSettings.timeLimit = 120; // 2 minutes
        break;
      case 'hard':
        newSettings.ghostMode = true;
        newSettings.ghostDuration = 1; // 1 second flash
        newSettings.timeLimit = 90; // 1.5 minutes
        break;
    }
    
    setGameSettings(newSettings);
    setTimeLeft(newSettings.timeLimit);
  };
  
  // Load a new sentence level
  const loadNewSentence = (index: number) => {
    if (index >= sampleSentences.length) {
      // Game completed
      setGameState('completed');
      triggerConfetti();
      playSound('levelComplete');
      return;
    }
    
    const sentenceData = sampleSentences[index];
    setCurrentSentence(sentenceData);
    
    // Determine which text to show based on translation direction
    const textToShow = gameSettings.translationDirection === 'fromNative' 
      ? sentenceData.originalText 
      : sentenceData.translatedText;
    
    // Split and shuffle words
    const words = textToShow.split(' ').map((word, i) => ({
      id: `word-${index}-${i}`,
      text: word,
      translation: '', // We don't need individual translations since we're working with full sentences
      index: i,
      correct: false
    }));
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...words];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setShuffledWords(shuffled);
    setPlacedWords(Array(words.length).fill(null));
    setShowSentence(true);
    setIsGhostActive(false);
    setHighlightedWordIndex(null);
    setSentenceFlashActive(false);
  };
  
  // Handle dropping a word
  const handleWordDrop = (wordId: string, targetIndex: number): boolean => {
    // Find the word in shuffled words
    const draggedWordIndex = shuffledWords.findIndex(w => w.id === wordId);
    if (draggedWordIndex === -1) return false;
    
    const draggedWord = shuffledWords[draggedWordIndex];
    
    // Check if this is the correct placement
    const expectedWordId = `word-${levelIndex}-${targetIndex}`;
    const isCorrect = draggedWord.id.split('-')[2] === String(targetIndex);
    
    // Update the placed words
    const newPlacedWords = [...placedWords];
    newPlacedWords[targetIndex] = {
      ...draggedWord,
      correct: isCorrect
    };
    setPlacedWords(newPlacedWords);
    
    // Remove from shuffled words
    const newShuffledWords = shuffledWords.filter((_, i) => i !== draggedWordIndex);
    setShuffledWords(newShuffledWords);
    
    // Update stats
    updateStats(isCorrect);
    
    // Check if sentence is complete
    if (newShuffledWords.length === 0) {
      // Check if the overall order is correct
      const allCorrect = newPlacedWords.every(word => word && word.correct);
      
      if (allCorrect) {
        // Award speed bonus
        const speedBonus = Math.round(timeLeft * 0.5);
        
        // Calculate streak bonus
        const streak = stats.streak + 1;
        const streakBonus = Math.round(stats.streak * 10);
        
        // Calculate total score
        const levelScore = 100 + speedBonus + streakBonus;
        
        setStats(prev => ({
          ...prev,
          score: prev.score + levelScore,
          streak: streak,
          highestStreak: Math.max(prev.highestStreak, streak),
          completedLevels: prev.completedLevels + 1
        }));
        
        // Move to next level
        setLevelIndex(prev => prev + 1);
        playSound('levelComplete');
        
        setTimeout(() => {
          loadNewSentence(levelIndex + 1);
        }, 1500);
      } else {
        // Reset the current level and break the streak
        setStats(prev => ({
          ...prev,
          streak: 0
        }));
        
        playSound('incorrect');
        
        setTimeout(() => {
          loadNewSentence(levelIndex);
        }, 1500);
      }
    } else if (isCorrect) {
      playSound('correct');
    } else {
      playSound('incorrect');
    }
    
    return isCorrect;
  };
  
  // Update game stats
  const updateStats = (isCorrect: boolean) => {
    setStats(prev => {
      const newWordsPlaced = prev.wordsPlaced + 1;
      let correctCount = isCorrect ? 1 : 0;
      if (placedWords) {
        for (const word of placedWords) {
          if (word && word.correct) correctCount++;
        }
      }
      
      return {
        ...prev,
        wordsPlaced: newWordsPlaced,
        accuracy: correctCount / newWordsPlaced
      };
    });
  };
  
  // Start the game
  const startGame = () => {
    setGameState('playing');
    loadNewSentence(0);
    setLevelIndex(0);
    setStats({
      score: 0,
      wordsPlaced: 0,
      accuracy: 1,
      timeSpent: 0,
      streak: 0,
      highestStreak: 0,
      completedLevels: 0
    });
    setTimeLeft(gameSettings.timeLimit);
    playSound('bgMusic');
  };
  
  // Reset the game
  const resetGame = () => {
    setStats(prev => ({
      ...prev,
      score: 0,
    }));
    setLevelIndex(0);
    setTimeLeft(gameSettings.timeLimit);
    setGameState('ready');
    setIsGhostActive(false);
    setShowSentence(true);
    setShuffledWords([]);
    setPlacedWords([]);
    setStats({
      score: 0,
      wordsPlaced: 0,
      accuracy: 1,
      timeSpent: 0,
      streak: 0,
      highestStreak: 0,
      completedLevels: 0
    });
    setPowerUps(defaultPowerUps);
  };
  
  // Save game progress (in a real app)
  const saveProgress = async () => {
    if (!assignmentId) return;
    
    // In a real app, we would save the progress to Supabase
    // const { data, error } = await supabase
    //   .from('assignment_progress')
    //   .upsert({
    //     assignment_id: assignmentId,
    //     student_id: 'current-user-id', // would be the actual user ID
    //     score: score,
    //     accuracy: placedWords.length > 0 ? score / (levelIndex * 100) : 0,
    //     attempts: 1,
    //     time_spent: 60 - timeLeft,
    //     metrics: {
    //       levels_completed: levelIndex,
    //       final_state: gameState
    //     },
    //     status: gameState === 'completed' ? 'completed' : 'in_progress',
    //     completed_at: gameState === 'completed' ? new Date().toISOString() : null,
    //   })
    //   .select();
  };
  
  // Confetti effect on completion
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-r from-teal-50 to-cyan-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Building2 className="text-teal-600 mr-2" size={28} />
              <h1 className="text-2xl font-bold text-teal-800">Speed Builder</h1>
            </div>
            
            <div className="flex space-x-4 items-center">
              <div className="bg-teal-100 px-3 py-1 rounded-full flex items-center">
                <Star className="text-yellow-500 mr-1" size={18} />
                <span className="font-bold text-teal-800">{stats.score}</span>
              </div>
              
              <div className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                <Clock className="text-blue-500 mr-1" size={18} />
                <span className="font-bold text-blue-800">{timeLeft}s</span>
              </div>
              
              {gameSettings.ghostMode && (
                <button 
                  onClick={() => setIsGhostActive(!isGhostActive)}
                  className="bg-purple-100 px-3 py-1 rounded-full flex items-center"
                >
                  {isGhostActive ? (
                    <Eye className="text-purple-500" size={18} />
                  ) : (
                    <EyeOff className="text-purple-500" size={18} />
                  )}
                </button>
              )}
            </div>
          </header>
          
          {/* Game Container */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            {gameState === 'ready' && (
              <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-teal-800 mb-4">Ready to Build?</h2>
                <p className="text-gray-600 mb-6">
                  Drag and drop the words to form the correct sentence before time runs out!
                  {gameSettings.ghostMode && (
                    <span className="block mt-2 text-purple-600 font-medium">
                      Ghost mode enabled! The sentence will disappear after 3 seconds.
                    </span>
                  )}
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  Start Game
                </button>
              </div>
            )}
            
            {(gameState === 'playing' || gameState === 'paused') && (
              <div>
                {/* Sentence display */}
                <div className="mb-8 text-center">
                  <p className="text-sm text-gray-500 mb-2">Level {levelIndex + 1} of {sampleSentences.length}</p>
                  {(!gameSettings.ghostMode || !isGhostActive) && (
                    <div className="p-4 bg-teal-50 rounded-lg">
                      <p className="text-teal-800 font-medium">
                        {currentSentence 
                          ? (gameSettings.translationDirection === 'fromNative' 
                              ? currentSentence.originalText 
                              : currentSentence.translatedText)
                          : ''}
                      </p>
                    </div>
                  )}
                  {(gameSettings.ghostMode && isGhostActive) && (
                    <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <EyeOff className="text-gray-400 mr-2" size={18} />
                      <p className="text-gray-400 italic">Sentence hidden (ghost mode)</p>
                    </div>
                  )}
                </div>
                
                {/* Target area */}
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Build your sentence:</h3>
                  <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg min-h-16">
                    {placedWords.map((word, index) => (
                      <WordTarget 
                        key={`target-${index}`} 
                        index={index} 
                        onDrop={handleWordDrop}
                        isOccupied={word !== null}
                        theme={gameSettings.theme}
                      >
                        {word && (
                          <div className="p-2 bg-white border border-teal-500 rounded-md shadow text-center text-teal-800 font-medium">
                            {word.text}
                          </div>
                        )}
                      </WordTarget>
                    ))}
                  </div>
                </div>
                
                {/* Word bank */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Available words:</h3>
                  <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-lg">
                    {shuffledWords.map((word, index) => (
                      <DraggableWord 
                        key={word.id} 
                        word={word} 
                        index={index} 
                        theme={gameSettings.theme}
                        onCorrectPlacement={() => {}}
                        onIncorrectPlacement={() => {}}
                        playSound={(type) => playSound(type)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {gameState === 'timeout' && (
              <div className="text-center py-10">
                <AlertCircle className="text-orange-500 w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-orange-600 mb-4">Time's Up!</h2>
                <p className="text-gray-600 mb-4">You completed {levelIndex} levels and scored {stats.score} points.</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center mx-auto"
                >
                  <RefreshCw className="mr-2" size={18} />
                  Play Again
                </button>
              </div>
            )}
            
            {gameState === 'completed' && (
              <div className="text-center py-10">
                <Trophy className="text-green-500 w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-teal-800 mb-4">Game Complete!</h2>
                <p className="text-gray-600 mb-4">
                  Congratulations! You completed all {sampleSentences.length} levels
                  and scored {stats.score} points.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <button
                    onClick={resetGame}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
                  >
                    <RefreshCw className="mr-2" size={18} />
                    Play Again
                  </button>
                  
                  <Link href="/games" className="px-6 py-3 border border-teal-600 text-teal-700 rounded-lg font-medium hover:bg-teal-50 transition-colors">
                    Return to Games
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Controls and Info */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between">
              <Link
                href={assignmentId ? `/dashboard/assignments/${assignmentId}` : '/games'}
                className="text-teal-600 hover:text-teal-800 flex items-center"
              >
                {assignmentId ? 'Back to Assignment' : 'Back to Games'}
              </Link>
              
              {(gameState === 'playing' || gameState === 'completed' || gameState === 'timeout') && (
                <button
                  onClick={saveProgress}
                  className="text-teal-600 hover:text-teal-800"
                >
                  Save Progress
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

// Main export with DndProvider and SoundProvider
export default function SpeedBuilderGame() {
  return (
    <DndProvider backend={HTML5Backend}>
      <SoundProvider>
        <SpeedBuilderGameInner />
      </SoundProvider>
    </DndProvider>
  );
} 
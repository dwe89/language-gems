'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, ArrowLeft, Clock, Settings, Award, 
  HelpCircle, Share2
} from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

// Import components and types
import CurrencyDisplay from './components/CurrencyDisplay';
import StatsBar from './components/StatsBar';
import TranslationChallenge from './components/TranslationChallenge';
import CityView from './components/CityView';
import Shop from './components/Shop';
import { SoundProvider, SoundControls, useSound } from './components/SoundManager';
import { 
  GameState, GameSettings, GameStats, PowerUp, 
  BuildingUpgrade, VocabularyItem, DifficultyLevel,
  ThemeType, TranslationDirection, Building
} from './types';

// Sample vocabulary for testing - in a real app, this would come from the database
const sampleVocabulary: VocabularyItem[] = [
  {
    id: "1",
    originalText: "cat",
    translatedText: "gato",
    difficulty: "easy"
  },
  {
    id: "2",
    originalText: "dog",
    translatedText: "perro",
    difficulty: "easy"
  },
  {
    id: "3",
    originalText: "house",
    translatedText: "casa",
    difficulty: "easy"
  },
  {
    id: "4",
    originalText: "tree",
    translatedText: "árbol",
    difficulty: "easy"
  },
  {
    id: "5",
    originalText: "computer",
    translatedText: "computadora",
    difficulty: "medium"
  },
  {
    id: "6",
    originalText: "language",
    translatedText: "idioma",
    difficulty: "medium"
  },
  {
    id: "7",
    originalText: "dictionary",
    translatedText: "diccionario",
    difficulty: "medium"
  },
  {
    id: "8",
    originalText: "translation",
    translatedText: "traducción",
    difficulty: "hard",
    isChallenge: true
  },
  {
    id: "9",
    originalText: "vocabulary",
    translatedText: "vocabulario",
    difficulty: "hard"
  },
  {
    id: "10",
    originalText: "pronunciation",
    translatedText: "pronunciación",
    difficulty: "hard",
    isChallenge: true
  }
];

// Default buildings
const defaultBuildings: BuildingUpgrade[] = [
  {
    id: 'school',
    name: 'Language School',
    description: 'Earn more coins for correct translations',
    price: 50,
    incomeMultiplier: 1.2,
    icon: 'school',
    purchased: false,
    level: 1,
    maxLevel: 5
  },
  {
    id: 'library',
    name: 'Library',
    description: 'Passive income every 30 seconds',
    price: 100,
    incomeMultiplier: 1,
    icon: 'library',
    purchased: false,
    level: 1,
    maxLevel: 5
  },
  {
    id: 'university',
    name: 'University',
    description: 'Bonus coins for challenge words',
    price: 200,
    incomeMultiplier: 1.5,
    icon: 'university',
    purchased: false,
    level: 1,
    maxLevel: 5
  },
  {
    id: 'translator',
    name: 'Translation Office',
    description: 'Streak bonuses are worth more',
    price: 300,
    incomeMultiplier: 2,
    icon: 'translator',
    purchased: false,
    level: 1,
    maxLevel: 5
  }
];

// Default power-ups
const defaultPowerUps: PowerUp[] = [
  {
    id: 'hint',
    type: 'hint',
    name: 'Hint System',
    description: 'Gives you the first letter of the answer',
    price: 75,
    effect: 'hint',
    icon: 'lightbulb',
    purchased: false,
    active: false,
    cooldown: 15
  },
  {
    id: 'timeBonus',
    type: 'timeBonus',
    name: 'Time Extension',
    description: 'Adds 30 seconds to the timer',
    price: 150,
    effect: 'time',
    icon: 'clock',
    purchased: false,
    active: false,
    cooldown: 30
  },
  {
    id: 'doubleCoins',
    type: 'doubleCoins',
    name: 'Double Coins',
    description: 'Earn double coins for 60 seconds',
    price: 250,
    effect: 'coins',
    icon: 'coins',
    purchased: false,
    active: false,
    cooldown: 60
  }
];

// Main Game Component
function TranslationTycoonGameInner() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 180, // 3 minutes
    theme: 'default' as ThemeType,
    difficulty: 'medium' as DifficultyLevel,
    powerUpsEnabled: true,
    vocabularyId: null,
    challengeWordsEnabled: true,
    translationDirection: 'fromNative' as TranslationDirection,
    soundEffects: true,
    backgroundMusic: true,
    startingCurrency: 50
  });
  
  // Game progress and stats
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    currency: gameSettings.startingCurrency,
    translationsCompleted: 0,
    accuracy: 1,
    timeSpent: 0,
    streak: 0,
    highestStreak: 0,
    upgrades: [],
    challengeWordsCompleted: 0
  });
  
  // Previous currency value for animation
  const [prevCurrency, setPrevCurrency] = useState<number>(gameSettings.startingCurrency);
  
  // Vocabulary and current item
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [currentVocabItem, setCurrentVocabItem] = useState<VocabularyItem | null>(null);
  
  // Buildings and power-ups
  const [buildings, setBuildings] = useState<BuildingUpgrade[]>(defaultBuildings);
  const [powerUps, setPowerUps] = useState<PowerUp[]>(defaultPowerUps);
  
  // Double coins effect
  const [doubleCoinsActive, setDoubleCoinsActive] = useState(false);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(gameSettings.timeLimit);
  
  // Refs and hooks
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const passiveIncomeRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  const { playSound } = useSound();
  
  // Add feedback state
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  // Initialize game
  useEffect(() => {
    // Check if this is launched from an assignment
    const assignmentIdParam = searchParams?.get('assignmentId');
    if (assignmentIdParam) {
      loadAssignmentSettings(assignmentIdParam);
    } else {
      // Load sample vocabulary for testing
      setVocabulary(sampleVocabulary);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (passiveIncomeRef.current) clearInterval(passiveIncomeRef.current);
    };
  }, [searchParams]);
  
  // Load assignment settings from database
  const loadAssignmentSettings = async (assignmentId: string) => {
    try {
      // This would be replaced with actual database call
      // const { data, error } = await supabase
      //   .from('assignments')
      //   .select('*')
      //   .eq('id', assignmentId)
      //   .single();
      
      // if (error) throw error;
      
      // For now, use sample data
      console.log(`Loading assignment ${assignmentId}`);
      setVocabulary(sampleVocabulary);
    } catch (error) {
      console.error('Error loading assignment:', error);
    }
  };
  
  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up
            clearInterval(timerRef.current!);
            setGameState('timeout');
            playSound('ui');
            return 0;
          }
          
          setStats(prev => ({
            ...prev,
            timeSpent: prev.timeSpent + 1
          }));
          
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
  
  // Passive income effect
  useEffect(() => {
    if (gameState === 'playing') {
      const libraryBuilding = buildings.find(b => b.id === 'library');
      
      if (libraryBuilding?.purchased) {
        passiveIncomeRef.current = setInterval(() => {
          const passiveAmount = Math.round(5 * libraryBuilding.level * libraryBuilding.incomeMultiplier);
          
          addCurrency(passiveAmount);
          playSound('coin');
        }, 30000); // Every 30 seconds
      }
    } else if (passiveIncomeRef.current) {
      clearInterval(passiveIncomeRef.current);
    }
    
    return () => {
      if (passiveIncomeRef.current) clearInterval(passiveIncomeRef.current);
    };
  }, [gameState, buildings, playSound]);
  
  // Load next vocabulary item
  useEffect(() => {
    if (gameState === 'playing' && vocabulary.length > 0 && !currentVocabItem) {
      const randomIndex = Math.floor(Math.random() * vocabulary.length);
      setCurrentVocabItem(vocabulary[randomIndex]);
    }
  }, [gameState, vocabulary, currentVocabItem]);
  
  // Handle correct answer
  const handleCorrectAnswer = (item: VocabularyItem, timeTaken: number) => {
    const baseReward = 10;
    const timeBonus = Math.max(0, 30 - timeTaken);
    const streakBonus = stats.streak * 2;
    
    // Calculate building multipliers
    const schoolMultiplier = buildings.find(b => b.id === 'school')?.level || 1;
    const universityMultiplier = buildings.find(b => b.id === 'university')?.level || 1;
    const translatorMultiplier = buildings.find(b => b.id === 'translator')?.level || 1;
    
    // Apply multipliers
    let reward = baseReward;
    reward *= schoolMultiplier;
    if (item.isChallenge) {
      reward *= universityMultiplier;
    }
    reward *= translatorMultiplier;
    
    // Add bonuses
    reward += timeBonus + streakBonus;
    
    // Double coins if active
    if (doubleCoinsActive) {
      reward *= 2;
    }
    
    addCurrency(reward);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      translationsCompleted: prev.translationsCompleted + 1,
      streak: prev.streak + 1,
      highestStreak: Math.max(prev.highestStreak, prev.streak + 1),
      accuracy: (prev.accuracy * prev.translationsCompleted + 1) / (prev.translationsCompleted + 1),
      timeSpent: prev.timeSpent + timeTaken
    }));
    
    // Play success sound
    playSound('correct');
    
    // Show success message
    setFeedback({
      type: 'success',
      message: `Correct! +${reward} coins`
    });
    
    // Load next word
    loadNextVocabularyItem(item);
  };
  
  // Handle incorrect answer
  const handleIncorrectAnswer = (item: VocabularyItem, userAnswer: string) => {
    playSound('incorrect');
    
    // Reset streak
    setStats(prev => {
      const newAccuracy = (prev.accuracy * prev.translationsCompleted) / (prev.translationsCompleted + 1);
      return {
        ...prev,
        accuracy: newAccuracy,
        streak: 0,
        translationsCompleted: prev.translationsCompleted + 1
      };
    });
    
    // Load next vocabulary item after a delay
    setTimeout(() => {
      loadNextVocabularyItem(item);
    }, 2000);
  };
  
  // Load next vocabulary item
  const loadNextVocabularyItem = (currentItem: VocabularyItem) => {
    // Filter out the current item to prevent repeats
    const remainingItems = vocabulary.filter(item => item.id !== currentItem.id);
    
    if (remainingItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingItems.length);
      setCurrentVocabItem(remainingItems[randomIndex]);
    } else {
      // If we've gone through all items, reset and shuffle
      setCurrentVocabItem(null);
    }
  };
  
  // Add currency with animation
  const addCurrency = (amount: number) => {
    setPrevCurrency(stats.currency);
    setStats(prev => ({
      ...prev,
      currency: prev.currency + amount
    }));
  };
  
  // Purchase a building
  const handlePurchaseBuilding = (building: BuildingUpgrade) => {
    const upgradePrice = Math.round(building.price * Math.pow(1.5, building.level - 1));
    
    if (stats.currency >= upgradePrice) {
      setStats(prev => ({
        ...prev,
        currency: prev.currency - upgradePrice
      }));
      
      setBuildings(prev => prev.map(b => {
        if (b.id === building.id) {
          return {
            ...b,
            level: b.level + 1,
            price: upgradePrice
          };
        }
        return b;
      }));

      // Play sound effect
      playSound('purchase');
      
      // Show success message
      setFeedback({
        type: 'success',
        message: `${building.name} upgraded to level ${building.level + 1}!`
      });
    }
  };
  
  // Purchase a power-up
  const handlePurchasePowerUp = (powerUp: PowerUp) => {
    // Check if player has enough currency
    if (stats.currency < powerUp.price) return;
    
    playSound('purchase');
    
    // Update power-ups
    setPowerUps(prev => prev.map(p => {
      if (p.id === powerUp.id) {
        return {
          ...p,
          purchased: true
        };
      }
      return p;
    }));
    
    // Deduct currency
    setStats(prev => ({
      ...prev,
      currency: prev.currency - powerUp.price,
      upgrades: [...prev.upgrades, powerUp.id]
    }));
    
    // Special effects for double coins
    if (powerUp.id === 'doubleCoins') {
      setDoubleCoinsActive(true);
      setTimeout(() => {
        setDoubleCoinsActive(false);
      }, 60000); // 60 seconds
    }
  };
  
  // Start game
  const startGame = () => {
    setGameState('playing');
    setTimeLeft(gameSettings.timeLimit);
    setStats({
      score: 0,
      currency: gameSettings.startingCurrency,
      translationsCompleted: 0,
      accuracy: 1,
      timeSpent: 0,
      streak: 0,
      highestStreak: 0,
      upgrades: [],
      challengeWordsCompleted: 0
    });
    playSound('ui');
  };
  
  // Reset game
  const resetGame = () => {
    setGameState('ready');
    setCurrentVocabItem(null);
    setTimeLeft(gameSettings.timeLimit);
    setDoubleCoinsActive(false);
    setBuildings(defaultBuildings);
    setPowerUps(defaultPowerUps);
  };
  
  // Save progress to database
  const saveProgress = async () => {
    try {
      // This would be replaced with actual database call
      // const { data, error } = await supabase
      //   .from('assignment_progress')
      //   .upsert({
      //     assignment_id: assignmentId,
      //     student_id: user.id,
      //     score: stats.score,
      //     accuracy: stats.accuracy,
      //     attempts: 1,
      //     time_spent: stats.timeSpent,
      //     metrics: {
      //       currency: stats.currency,
      //       translationsCompleted: stats.translationsCompleted,
      //       highestStreak: stats.highestStreak,
      //       upgrades: stats.upgrades,
      //       challengeWordsCompleted: stats.challengeWordsCompleted
      //     },
      //     status: 'completed',
      //     completed_at: new Date().toISOString()
      //   })
      //   .select();
      
      // if (error) throw error;
      
      console.log('Progress saved:', stats);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };
  
  // Trigger confetti effect
  const triggerConfetti = () => {
    if (typeof window !== 'undefined' && confetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };
  
  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Render different game screens based on state
  const renderGameContent = () => {
    switch (gameState) {
      case 'ready':
        return (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <h1 className="text-4xl font-bold text-emerald-800 mb-6">Translation Tycoon</h1>
            <p className="text-xl text-emerald-700 mb-8 text-center max-w-2xl">
              Build your translation empire! Earn coins by translating words correctly, 
              then invest in buildings and upgrades to grow your business.
            </p>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">How to Play</h2>
              <ul className="list-disc list-inside space-y-2 text-emerald-900">
                <li>Translate words correctly to earn coins</li>
                <li>Purchase buildings to increase your income</li>
                <li>Buy power-ups to get advantages</li>
                <li>Challenge words give extra coins</li>
                <li>Build your translation business empire!</li>
              </ul>
            </div>
            
            <button
              className="px-8 py-4 bg-emerald-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-emerald-700 transition-colors"
              onClick={startGame}
            >
              Start Game
            </button>
          </div>
        );
      
      case 'playing':
        return (
          <div className="tycoon-main">
            <div className="stats-bar">
              <div className="flex gap-4 items-center">
                <CurrencyDisplay currency={stats.currency} prevCurrency={prevCurrency} />
                <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full flex items-center">
                  <Clock size={16} className="mr-1" />
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              <SoundControls />
            </div>
            
            <StatsBar stats={stats} />
            
            {feedback && (
              <div className={`feedback-message ${feedback.type}`}>
                {feedback.message}
              </div>
            )}
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="game-board md:w-2/3">
                <CityView
                  buildings={buildings}
                  onBuildingClick={handlePurchaseBuilding}
                />
                
                {currentVocabItem && (
                  <TranslationChallenge
                    vocabularyItem={currentVocabItem}
                    onCorrectAnswer={handleCorrectAnswer}
                    onIncorrectAnswer={handleIncorrectAnswer}
                    translationDirection={gameSettings.translationDirection}
                    difficulty={gameSettings.difficulty}
                  />
                )}
              </div>
              
              <div className="md:w-1/3">
                <Shop
                  currency={stats.currency}
                  buildings={buildings}
                  powerUps={powerUps}
                  onPurchaseBuilding={handlePurchaseBuilding}
                  onPurchasePowerUp={handlePurchasePowerUp}
                />
              </div>
            </div>
            
            {doubleCoinsActive && (
              <div className="fixed bottom-4 right-4 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg shadow-md animate-pulse">
                Double Coins Active!
              </div>
            )}
          </div>
        );
      
      case 'timeout':
      case 'completed':
        // Save progress when game ends
        saveProgress();
        
        return (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <h1 className="text-4xl font-bold text-emerald-800 mb-6">
              {gameState === 'timeout' ? 'Time\'s Up!' : 'Game Completed!'}
            </h1>
            
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-emerald-700 mb-4">Your Results</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">Score:</span>
                  <span className="text-xl font-bold text-emerald-600">{stats.score}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">Final Empire Value:</span>
                  <span className="text-xl font-bold text-amber-500">${stats.currency}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">Translations:</span>
                  <span>{stats.translationsCompleted}</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">Accuracy:</span>
                  <span>{Math.round(stats.accuracy * 100)}%</span>
                </div>
                
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-semibold">Highest Streak:</span>
                  <span>{stats.highestStreak}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Challenge Words:</span>
                  <span>{stats.challengeWordsCompleted}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:bg-emerald-700 transition-colors"
                onClick={resetGame}
              >
                Play Again
              </button>
              
              <Link 
                href="/dashboard" 
                className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg shadow-lg hover:bg-gray-300 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="tycoon-container">
      <header className="tycoon-header">
        <Link href="/dashboard" className="flex items-center text-white hover:text-gray-200">
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <CurrencyDisplay currency={stats.currency} prevCurrency={prevCurrency} />
          <button
            onClick={() => setGameState('paused')}
            className="text-white hover:text-gray-200"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>
      
      {renderGameContent()}
      
      <footer className="tycoon-footer">
        <p>© Language Gems - Translation Tycoon Game</p>
      </footer>
    </div>
  );
}

// Wrap the game with the sound provider
export default function TranslationTycoonGame() {
  return (
    <SoundProvider>
      <TranslationTycoonGameInner />
    </SoundProvider>
  );
} 
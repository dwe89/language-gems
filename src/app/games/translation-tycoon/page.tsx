'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, ArrowLeft, Clock, Settings, Award, Building2, Zap,
  HelpCircle, Share2
} from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

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
  const [gameState, setGameState] = useState<'initial' | 'playing' | 'paused' | 'timeout' | 'completed'>('initial');
  const [timeLeft, setTimeLeft] = useState(0);
  const [doubleCoinsActive, setDoubleCoinsActive] = useState(false);
  const [buildings, setBuildings] = useState<BuildingUpgrade[]>(defaultBuildings);
  const [powerUps, setPowerUps] = useState<PowerUp[]>(defaultPowerUps);
  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([]);
  const [currentVocabItem, setCurrentVocabItem] = useState<VocabularyItem | null>(null);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    currency: 0,
    translationsCompleted: 0,
    accuracy: 1,
    timeSpent: 0,
    streak: 0,
    highestStreak: 0,
    upgrades: [],
    challengeWordsCompleted: 0
  });
  const [prevCurrency, setPrevCurrency] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [gameSettings, setGameSettings] = useState({
    timeLimit: 180, // 3 minutes
    startingCurrency: 50,
    translationDirection: 'fromEnglish' as TranslationDirection,
    difficulty: 'medium' as DifficultyLevel,
    language: 'spanish',
    chanceOfChallenge: 0.3
  });
  const [isShopSectionOpen, setIsShopSectionOpen] = useState(false);

  // Use router for navigation
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Sound effects
  const { 
    playSound, 
    soundEnabled, 
    toggleSound 
  } = useSound();
  
  // Refs and hooks
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const passiveIncomeRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClientComponentClient();
  
  // Initialize game
  useEffect(() => {
    // Check if this is launched from an assignment
    const assignmentIdParam = searchParams?.get('assignmentId');
    if (assignmentIdParam) {
      loadAssignmentSettings(assignmentIdParam);
    } else {
      // Load sample vocabulary for testing
      setVocabularyItems(sampleVocabulary);
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
      setVocabularyItems(sampleVocabulary);
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
    if (gameState === 'playing' && vocabularyItems.length > 0 && !currentVocabItem) {
      const randomIndex = Math.floor(Math.random() * vocabularyItems.length);
      setCurrentVocabItem(vocabularyItems[randomIndex]);
    }
  }, [gameState, vocabularyItems, currentVocabItem]);
  
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
    const remainingItems = vocabularyItems.filter(item => item.id !== currentItem.id);
    
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
    setGameState('initial');
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
  
  // Function to toggle shop visibility
  const toggleShopSection = () => {
    setIsShopSectionOpen(!isShopSectionOpen);
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
    return (
      <div className="flex flex-col h-full game-area">
        {/* Header Section */}
        <header className="tycoon-header">
          <div className="flex items-center justify-between w-full">
            <Link href="/games" className="back-button">
              <ArrowLeft size={20} />
            </Link>
            <StatsBar stats={stats} className="flex-grow mx-4" /> 
            {/* Add Shop Toggle Button */}
            <button 
              onClick={toggleShopSection} 
              className="p-2 rounded-md hover:bg-emerald-100 transition-colors"
              aria-label="Toggle Shop"
            >
              <Building2 size={24} className="text-emerald-700" />
            </button>
            <SoundControls /> 
            {/* Consider adding Settings/Help/Share buttons here later */}
          </div>
          {/* Conditionally Render Shop Dropdown */}
          {isShopSectionOpen && (
            <div className="shop-dropdown-wrapper"> {/* Wrapper for positioning */}
              <Shop
                currency={stats.currency}
                buildings={buildings}
                powerUps={powerUps}
                onPurchaseBuilding={handlePurchaseBuilding}
                onPurchasePowerUp={handlePurchasePowerUp}
                className="header-shop-dropdown" // Class for styling the content
              />
            </div>
          )}
        </header>

        {/* Main Game Area */}
        <main className="flex-grow overflow-auto p-4 relative tycoon-main-content">
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`absolute top-4 right-4 p-3 rounded-md shadow-md text-white ${
                  feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* City View - Background element */}
          <CityView 
            buildings={buildings} 
            onBuildingClick={handlePurchaseBuilding}
          />

          {/* Gameplay elements centered */}
          <div className="gameplay-focus">
            {gameState === 'playing' && currentVocabItem && (
              <TranslationChallenge
                vocabularyItem={currentVocabItem}
                translationDirection={gameSettings.translationDirection}
                onCorrectAnswer={handleCorrectAnswer}
                onIncorrectAnswer={handleIncorrectAnswer}
                difficulty={gameSettings.difficulty}
              />
            )}

            {gameState === 'initial' && (
              <button onClick={startGame} className="start-button">
                Start Game ({formatTime(gameSettings.timeLimit)})
              </button>
            )}
            
            {gameState === 'timeout' && (
              <div className="game-over-message">
                <h2>Time\'s Up!</h2>
                <p>Final Score: {stats.score}</p>
                <button onClick={resetGame} className="restart-button">Play Again</button>
                <button onClick={() => router.push('/games')} className="secondary-button">Back to Games</button>
              </div>
            )}
            
            {/* Add other game state views (paused, completed) here */}
          </div>
        </main>

        {/* Footer/Input Area */}
        {/* This section might need adjustment depending on where input should be */}
        {/* Example: If input is part of TranslationChallenge, it's already handled */}
        {/* If input needs to be separate, add it here */}
        {/* <footer className="tycoon-footer"> Input Area </footer> */}
      </div>
    );
  };
  
  return (
    <div className="tycoon-container">
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
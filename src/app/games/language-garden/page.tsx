'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Droplets,
  ShoppingCart,
  Star,
  Trophy,
  Zap,
  Sun,
  Crown,
  Gem,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Leaf,
  Cloud,
  CloudRain,
  Rainbow,
  Heart,
  Volume2,
  VolumeX,
  HelpCircle
} from 'lucide-react';

// Enhanced Components
import { GlassmorphismCard } from './components/GlassmorphismCard';
import { useParticleSystem } from './components/ParticleSystem';


// =====================================================
// ENHANCED TYPES WITH COMBINED FEATURES
// =====================================================

interface VocabularyItem {
  id: string;
  originalText: string;
  translatedText: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  contextSentence?: string;
  audioUrl?: string;
  imageUrl?: string;
  masteryLevel: number; // 0-5 for spaced repetition
  lastReviewed: Date;
  reviewCount: number;
  reviewInterval: number;
  easeFactor: number;
}

interface Plant {
  id: string;
  vocabCategory: string;
  vocabWords: VocabularyItem[];
  stage: 'seed' | 'sprout' | 'bloom' | 'tree' | 'magical';
  correctAnswers: number;
  requiredAnswers: number;
  lastWatered: Date;
  position: { row: number; col: number };
  isWilting: boolean;
  soilType?: string;
  health: number;
  maxHealth: number;
  magicalProperties?: {
    glowing: boolean;
    produces: string;
    specialAbility: string;
  };
  plantedDate: Date;
  harvestReady: boolean;
}

interface GardenerStats {
  level: number;
  xp: number;
  gems: number;
  plantsGrown: number;
  totalCorrectAnswers: number;
  streak: number;
  highestStreak: number;
  gardenerClass?: string;
  skills?: {
    cultivation: number;
    linguistics: number;
    memory: number;
    weatherMagic: number;
    enchantment: number;
  };
  skillPoints?: number;
  unlockedAreas?: string[];
  achievements?: Set<string>;
  tools?: string[];
  currentWeather: Weather;
  weatherEndsAt?: Date;
}

interface Weather {
  type: 'sunny' | 'rainy' | 'cloudy' | 'rainbow';
  emoji: string;
  effect: string;
  growthModifier: number;
  duration?: number;
}

interface GameState {
  mode: 'garden' | 'challenge' | 'shop' | 'settings' | 'achievements';
  isLoading: boolean;
  error: string | null;
  soundEnabled?: boolean;
  animationsEnabled?: boolean;
}

// =====================================================
// PLANT STAGES AND DESIGN CONSTANTS
// =====================================================

const PLANT_STAGES = {
  seed: { name: 'Seed', emoji: '🌱', requiredAnswers: 5 },
  sprout: { name: 'Sprout', emoji: '🌿', requiredAnswers: 10 },
  bloom: { name: 'Bloom', emoji: '🌸', requiredAnswers: 15 },
  tree: { name: 'Tree', emoji: '🌳', requiredAnswers: 25 },
  magical: { name: 'Magical Tree', emoji: '✨🌳', requiredAnswers: 50 }
};

const getHealthColor = (health: number): string => {
  if (health >= 80) return '#10b981'; // green-500
  if (health >= 60) return '#f59e0b'; // amber-500
  if (health >= 40) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
};

// =====================================================
// ENHANCED SAMPLE DATA WITH BETTER STRUCTURE
// =====================================================

const weatherTypes: Weather[] = [
  { type: 'sunny', emoji: '☀️', effect: 'Perfect growing weather', growthModifier: 1.0, duration: 300000 },
  { type: 'rainy', emoji: '🌧️', effect: 'Extra growth boost', growthModifier: 1.2, duration: 180000 },
  { type: 'cloudy', emoji: '☁️', effect: 'Slower but steady growth', growthModifier: 0.8, duration: 240000 },
  { type: 'rainbow', emoji: '🌈', effect: 'Magical growth enhancement', growthModifier: 1.5, duration: 120000 }
];

const sampleVocabulary: Record<string, VocabularyItem[]> = {
  'Spanish Basics': [
    {
      id: '1',
      originalText: 'Hello',
      translatedText: 'Hola',
      difficulty: 'easy',
      category: 'Spanish Basics',
      contextSentence: 'Hola, ¿cómo estás?',
      masteryLevel: 0,
      lastReviewed: new Date(Date.now() - 86400000),
      reviewCount: 0,
      reviewInterval: 1,
      easeFactor: 2.5
    },
    {
      id: '2',
      originalText: 'Thank you',
      translatedText: 'Gracias',
      difficulty: 'easy',
      category: 'Spanish Basics',
      contextSentence: 'Gracias por tu ayuda.',
      masteryLevel: 1,
      lastReviewed: new Date(Date.now() - 172800000),
      reviewCount: 2,
      reviewInterval: 2,
      easeFactor: 2.6
    },
    {
      id: '3',
      originalText: 'Good morning',
      translatedText: 'Buenos días',
      difficulty: 'medium',
      category: 'Spanish Basics',
      contextSentence: 'Buenos días, señora García.',
      masteryLevel: 0,
      lastReviewed: new Date(Date.now() - 259200000),
      reviewCount: 1,
      reviewInterval: 1,
      easeFactor: 2.5
    }
  ],
  'French Essentials': [
    {
      id: '4',
      originalText: 'Hello',
      translatedText: 'Bonjour',
      difficulty: 'easy',
      category: 'French Essentials',
      contextSentence: 'Bonjour, comment allez-vous?',
      masteryLevel: 0,
      lastReviewed: new Date(Date.now() - 86400000),
      reviewCount: 0,
      reviewInterval: 1,
      easeFactor: 2.5
    },
    {
      id: '5',
      originalText: 'Please',
      translatedText: 'S\'il vous plaît',
      difficulty: 'medium',
      category: 'French Essentials',
      contextSentence: 'Un café, s\'il vous plaît.',
      masteryLevel: 1,
      lastReviewed: new Date(Date.now() - 172800000),
      reviewCount: 3,
      reviewInterval: 3,
      easeFactor: 2.7
    }
  ],
  'German Basics': [
    {
      id: '6',
      originalText: 'Hello',
      translatedText: 'Hallo',
      difficulty: 'easy',
      category: 'German Basics',
      contextSentence: 'Hallo, wie geht es dir?',
      masteryLevel: 0,
      lastReviewed: new Date(Date.now() - 86400000),
      reviewCount: 0,
      reviewInterval: 1,
      easeFactor: 2.5
    }
  ]
};

// =====================================================
// MAIN ENHANCED COMPONENT
// =====================================================

export default function EnhancedLanguageGarden() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { createParticles, ParticleRenderer } = useParticleSystem();

  // Enhanced State Management
  const [gameState, setGameState] = useState<GameState>({
    mode: 'garden',
    isLoading: false,
    error: null,
    soundEnabled: true,
    animationsEnabled: true
  });

  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [currentVocabItem, setCurrentVocabItem] = useState<VocabularyItem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState<{
    type: 'correct' | 'incorrect' | null;
    message: string;
    show: boolean;
  }>({ type: null, message: '', show: false });

  // Enhanced Player Stats with Better Defaults
  const [playerStats, setPlayerStats] = useState<GardenerStats>({
    level: 1,
    xp: 0,
    gems: 50, // Start with more gems for better UX
    plantsGrown: 0,
    totalCorrectAnswers: 0,
    streak: 0,
    highestStreak: 0,
    gardenerClass: 'botanist',
    skills: {
      cultivation: 1,
      linguistics: 1,
      memory: 1,
      weatherMagic: 1,
      enchantment: 1
    },
    skillPoints: 3,
    unlockedAreas: ['basic_garden'],
    achievements: new Set(),
    tools: ['basic_watering_can'],
    currentWeather: weatherTypes[0],
    weatherEndsAt: new Date(Date.now() + 300000)
  });

  // Enhanced Plant Positions with Responsive Layout
  const plantPositions = useMemo(() => [
    { id: 1, x: '15%', y: '40%', name: 'Left Front', accessible: true },
    { id: 2, x: '30%', y: '30%', name: 'Left Center', accessible: true },
    { id: 3, x: '50%', y: '25%', name: 'Center', accessible: true },
    { id: 4, x: '70%', y: '30%', name: 'Right Center', accessible: true },
    { id: 5, x: '85%', y: '40%', name: 'Right Front', accessible: true },
    { id: 6, x: '25%', y: '60%', name: 'Left Back', accessible: playerStats.level >= 3 },
    { id: 7, x: '50%', y: '55%', name: 'Center Back', accessible: playerStats.level >= 5 },
    { id: 8, x: '75%', y: '60%', name: 'Right Back', accessible: playerStats.level >= 7 }
  ], [playerStats.level]);

  // =====================================================
  // ENHANCED GAME LOGIC WITH BETTER ERROR HANDLING
  // =====================================================

  const handleError = useCallback((error: string) => {
    setGameState(prev => ({ ...prev, error }));
    setTimeout(() => {
      setGameState(prev => ({ ...prev, error: null }));
    }, 5000);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setGameState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  // Enhanced plant creation with better validation
  const createPlant = useCallback(async (category: string, position: number, soilType: string = 'basic') => {
    try {
      setLoading(true);

      const words = sampleVocabulary[category];
      if (!words || words.length === 0) {
        throw new Error(`No vocabulary found for category: ${category}`);
      }

      const positionData = plantPositions[position - 1];
      if (!positionData?.accessible) {
        throw new Error('This garden area is not yet unlocked!');
      }

      // Check if position is already occupied
      const existingPlant = plants.find(p => p.position.row === position);
      if (existingPlant) {
        throw new Error('This spot is already occupied!');
      }

      // Check if player has enough gems
      if (playerStats.gems < 10) {
        throw new Error('Not enough gems to plant a seed!');
      }

      const newPlant: Plant = {
        id: `plant-${Date.now()}`,
        vocabCategory: category,
        vocabWords: words.map(word => ({ ...word })),
        stage: 'seed',
        correctAnswers: 0,
        requiredAnswers: 5,
        lastWatered: new Date(),
        position: { row: position, col: 1 },
        isWilting: false,
        soilType,
        health: 100,
        maxHealth: 100,
        plantedDate: new Date(),
        harvestReady: false
      };

      setPlants(prev => [...prev, newPlant]);

      // Create planting particles
      const pos = plantPositions[position - 1];
      createParticles('growth', {
        x: window.innerWidth * (parseFloat(pos.x) / 100),
        y: window.innerHeight * (parseFloat(pos.y) / 100)
      }, { count: 15, spread: 80 });

      // Update player stats
      setPlayerStats((prev: GardenerStats) => ({
        ...prev,
        gems: prev.gems - 10, // Cost to plant
        plantsGrown: prev.plantsGrown + 1
      }));

      setGameState(prev => ({ ...prev, mode: 'garden' }));
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Failed to create plant');
    } finally {
      setLoading(false);
    }
  }, [plants, plantPositions, createParticles, setLoading, handleError, playerStats.gems]);

  // Start challenge with better word selection
  const startChallenge = useCallback((plant: Plant) => {
    setSelectedPlant(plant);
    
    // Get words that haven't been mastered yet
    const availableWords = plant.vocabWords.filter(word => word.masteryLevel < 3);
    
    if (availableWords.length > 0) {
      // Select a random word for variety
      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      setCurrentVocabItem(randomWord);
      setGameState(prev => ({ ...prev, mode: 'challenge' }));
      setUserAnswer('');
      setShowFeedback({ type: null, message: '', show: false });
    } else {
      // All words mastered - plant is ready for harvest!
      setPlants(prev => prev.map(p => 
        p.id === plant.id 
          ? { ...p, harvestReady: true, stage: 'magical' as const }
          : p
      ));
      handleError('🎉 This plant has mastered all words! It\'s ready for harvest!');
    }
  }, [handleError]);

  // Enhanced answer submission with proper plant growth logic
  const submitAnswer = useCallback(() => {
    if (!currentVocabItem || !selectedPlant) return;

    const isCorrect = userAnswer.toLowerCase().trim() === currentVocabItem.translatedText.toLowerCase().trim();
    
    if (isCorrect) {
      // Update the specific word's mastery
      const updatedWords = selectedPlant.vocabWords.map(word => 
        word.id === currentVocabItem.id 
          ? { ...word, masteryLevel: Math.min(word.masteryLevel + 1, 3) }
          : word
      );

      // Calculate new plant progress
      const totalMastery = updatedWords.reduce((sum, word) => sum + word.masteryLevel, 0);
      const maxMastery = updatedWords.length * 3;
      const newCorrectAnswers = selectedPlant.correctAnswers + 1;
      
      // Determine new plant stage based on progress
      let newStage: Plant['stage'] = 'seed';
      if (totalMastery >= maxMastery) {
        newStage = 'magical';
      } else if (totalMastery >= maxMastery * 0.8) {
        newStage = 'tree';
      } else if (totalMastery >= maxMastery * 0.6) {
        newStage = 'bloom';
      } else if (totalMastery >= maxMastery * 0.3) {
        newStage = 'sprout';
      }

      setShowFeedback({
        type: 'correct',
        message: `Excellent! Your plant is growing! ${newStage !== selectedPlant.stage ? `🎉 Evolved to ${newStage}!` : ''}`,
        show: true
      });

      // Update plant
      setPlants(prev => prev.map(plant => 
        plant.id === selectedPlant.id 
          ? { 
              ...plant, 
              correctAnswers: newCorrectAnswers,
              vocabWords: updatedWords,
              stage: newStage,
              lastWatered: new Date(),
              harvestReady: newStage === 'magical',
              health: Math.min(plant.health + 10, 100) // Restore health when watered correctly
            }
          : plant
      ));

      // Update player stats with better rewards
      const baseXP = 10;
      const streakBonus = Math.min(playerStats.streak * 2, 50);
      const stageBonus = newStage !== selectedPlant.stage ? 25 : 0;
      const totalXP = baseXP + streakBonus + stageBonus;

      setPlayerStats((prev: GardenerStats) => {
        const newXP = prev.xp + totalXP;
        const newLevel = Math.floor(newXP / 100) + 1;
        const leveledUp = newLevel > prev.level;
        
        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          totalCorrectAnswers: prev.totalCorrectAnswers + 1,
          streak: prev.streak + 1,
          highestStreak: Math.max(prev.highestStreak, prev.streak + 1),
          gems: prev.gems + (leveledUp ? 10 : 2) // Bonus gems for leveling up
        };
      });

      // Create success particles
      createParticles('success', { x: window.innerWidth / 2, y: window.innerHeight / 2 });

    } else {
      setShowFeedback({
        type: 'incorrect',
        message: `Not quite right. The correct answer is "${currentVocabItem.translatedText}". Try again!`,
        show: true
      });

      setPlayerStats((prev: GardenerStats) => ({ ...prev, streak: 0 }));
      
      // Plant health decreases slightly with wrong answers
      setPlants(prev => prev.map(plant => 
        plant.id === selectedPlant.id 
          ? { ...plant, health: Math.max(plant.health - 5, 0) }
          : plant
      ));
    }

    setTimeout(() => {
      setShowFeedback({ type: null, message: '', show: false });
      setGameState(prev => ({ ...prev, mode: 'garden' }));
      setSelectedPlant(null);
      setCurrentVocabItem(null);
      setUserAnswer('');
    }, 3000); // Show feedback longer
  }, [currentVocabItem, selectedPlant, userAnswer, createParticles, playerStats.streak]);

  // Harvest ready plants for gems and rewards
  const harvestPlant = useCallback((plant: Plant) => {
    if (!plant.harvestReady) return;

    const harvestReward = 25; // Base gem reward
    const bonusReward = plant.vocabWords.length * 5; // Bonus based on vocabulary size
    const totalReward = harvestReward + bonusReward;

    setPlayerStats((prev: GardenerStats) => ({
      ...prev,
      gems: prev.gems + totalReward,
      xp: prev.xp + 50 // Harvest XP bonus
    }));

    // Remove the harvested plant
    setPlants(prev => prev.filter(p => p.id !== plant.id));

    // Create celebration particles
    const position = plantPositions.find(pos => pos.id === plant.position.row);
    if (position) {
      createParticles('success', {
        x: window.innerWidth * (parseFloat(position.x) / 100),
        y: window.innerHeight * (parseFloat(position.y) / 100)
      }, { count: 30, spread: 120 });
    }

    handleError(`🎉 Harvested! +${totalReward} gems! Plant a new seed in this spot.`);
  }, [plantPositions, createParticles, handleError]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Garden Image */}
      <div className="absolute inset-0">
        {/* Garden background image as primary background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{
            backgroundImage: `url('/games/language-garden/gardenbackground.png')`
          }}
        />
        
        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/20 via-transparent to-green-100/30" />
        
        {/* Add some atmospheric depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10" />
      </div>

      {/* Particle System */}
      <ParticleRenderer />

      {/* Enhanced Error Display */}
      <AnimatePresence>
        {gameState.error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <GlassmorphismCard
              variant="error"
              className="px-6 py-3 flex items-center gap-3"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{gameState.error}</span>
            </GlassmorphismCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Loading State */}
      {gameState.isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <GlassmorphismCard className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4" />
            <p className="text-white font-medium">Loading...</p>
          </GlassmorphismCard>
        </div>
      )}

      {/* Enhanced Header with Better Navigation */}
      <motion.header
        className="relative z-30 p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Back Button */}
          <motion.button
            onClick={() => router.push('/games')}
            className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to games"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </motion.button>

          {/* Enhanced Title */}
          <GlassmorphismCard className="px-6 py-3 flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-2 rounded-full shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white drop-shadow-lg">
                Language Garden
              </h1>
              <p className="text-white/80 text-xs">
                Grow your vocabulary naturally
              </p>
            </div>
          </GlassmorphismCard>

          {/* Enhanced Stats Display */}
          <div className="flex items-center gap-3">
            {/* Level & XP */}
            <GlassmorphismCard className="px-4 py-2 flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-400" />
              <span className="text-white font-semibold">Lv.{playerStats.level}</span>
              <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(playerStats.xp % 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </GlassmorphismCard>

            {/* Gems */}
            <GlassmorphismCard className="px-4 py-2 flex items-center gap-2">
              <Gem className="h-4 w-4 text-cyan-400" />
              <span className="text-white font-semibold">{playerStats.gems}</span>
            </GlassmorphismCard>

            {/* Streak */}
            <GlassmorphismCard className="px-4 py-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-400" />
              <span className="text-white font-semibold">{playerStats.streak}</span>
            </GlassmorphismCard>

            {/* Settings */}
            <motion.button
              onClick={() => setGameState(prev => ({ ...prev, mode: 'settings' as const }))}
              className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Settings"
            >
              <Settings className="h-5 w-5 text-white" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Weather Display */}
      <motion.div
        className="absolute top-20 right-4 z-20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassmorphismCard className="p-4 text-center min-w-[140px] border border-white/30 shadow-lg">
          <div className="text-3xl mb-2">{playerStats.currentWeather.emoji}</div>
          <div className="text-white font-medium text-sm mb-1">
            {playerStats.currentWeather.type.charAt(0).toUpperCase() + playerStats.currentWeather.type.slice(1)}
          </div>
          <div className="text-white/70 text-xs mb-2">
            {playerStats.currentWeather.effect}
          </div>
          <div className="text-emerald-300 text-xs font-medium">
            +{Math.round((playerStats.currentWeather.growthModifier - 1) * 100)}% Growth
          </div>
          <div className="mt-2 w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{
                duration: (playerStats.currentWeather.duration || 300000) / 1000,
                ease: 'linear'
              }}
            />
          </div>
        </GlassmorphismCard>
      </motion.div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Garden View */}
          {gameState.mode === 'garden' && (
            <GardenView
              plants={plants}
              plantPositions={plantPositions}
              onPlantClick={startChallenge}
              onCreatePlant={() => setGameState(prev => ({ ...prev, mode: 'shop' }))}
              onHarvestPlant={harvestPlant}
            />
          )}

          {/* Challenge View */}
          {gameState.mode === 'challenge' && selectedPlant && currentVocabItem && (
            <ChallengeView
              plant={selectedPlant}
              vocabItem={currentVocabItem}
              userAnswer={userAnswer}
              showFeedback={showFeedback}
              playerStats={playerStats}
              onAnswerChange={setUserAnswer}
              onSubmitAnswer={submitAnswer}
              onBackToGarden={() => setGameState(prev => ({ ...prev, mode: 'garden' }))}
              inputRef={inputRef}
            />
          )}

          {/* Shop View */}
          {gameState.mode === 'shop' && (
            <ShopView
              playerStats={playerStats}
              availableCategories={Object.keys(sampleVocabulary)}
              onCreatePlant={createPlant}
              onBackToGarden={() => setGameState(prev => ({ ...prev, mode: 'garden' }))}
            />
          )}

          {/* Settings View */}
          {gameState.mode === 'settings' && (
            <div className="min-h-[70vh]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.button
                    onClick={() => setGameState(prev => ({ ...prev, mode: 'garden' }))}
                    className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="h-5 w-5 text-white" />
                  </motion.button>

                  <h1 className="text-3xl font-bold text-white">⚙️ Settings</h1>

                  <div className="w-[52px]" /> {/* Spacer for centering */}
                </div>
              </motion.div>

              <div className="max-w-2xl mx-auto space-y-6">
                <GlassmorphismCard className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Audio & Visual
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Sound Effects</span>
                      <button
                        onClick={() => setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ${
                          gameState.soundEnabled ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${
                          gameState.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Animations</span>
                      <button
                        onClick={() => setGameState(prev => ({ ...prev, animationsEnabled: !prev.animationsEnabled }))}
                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ${
                          gameState.animationsEnabled ? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${
                          gameState.animationsEnabled ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </GlassmorphismCard>

                <GlassmorphismCard className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Game Information
                  </h2>

                  <div className="text-white/80 text-sm space-y-2">
                    <p>🌱 Plant seeds by purchasing vocabulary categories</p>
                    <p>💧 Water your plants by answering vocabulary questions correctly</p>
                    <p>🌸 Watch your plants grow as you master new words</p>
                    <p>💎 Earn gems by maintaining streaks and completing challenges</p>
                  </div>
                </GlassmorphismCard>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// =====================================================
// VIEW COMPONENTS
// =====================================================

interface GardenViewProps {
  plants: Plant[];
  plantPositions: Array<{ id: number; x: string; y: string; name: string; accessible: boolean }>;
  onPlantClick: (plant: Plant) => void;
  onCreatePlant: () => void;
  onHarvestPlant: (plant: Plant) => void;
}

const GardenView: React.FC<GardenViewProps> = ({
  plants,
  plantPositions,
  onPlantClick,
  onCreatePlant,
  onHarvestPlant
}) => {
  return (
    <div className="relative w-full h-[70vh] rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
      {/* Garden floor with rich, natural styling */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-300/20 via-green-400/30 to-amber-600/40" />
      
      {/* Rich soil base */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-amber-800/60 via-amber-700/40 to-transparent" />
      
      {/* Grass texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,_rgba(34,197,94,0.2)_0%,_transparent_50%)]" />
      
      {plantPositions.map((position) => {
        const plant = plants.find(p => p.position.row === position.id);

        return (
          <motion.div
            key={position.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: position.x, top: position.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: position.id * 0.1 }}
          >
            {plant ? (
              <PlantDisplay 
                plant={plant} 
                onClick={() => plant.harvestReady ? onHarvestPlant(plant) : onPlantClick(plant)} 
              />
            ) : (
              <EmptySpot
                position={position}
                onClick={onCreatePlant}
                accessible={position.accessible}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

const PlantDisplay: React.FC<{ plant: Plant; onClick: () => void }> = ({ plant, onClick }) => {
  const plantConfig = PLANT_STAGES[plant.stage];
  const healthColor = getHealthColor(plant.health);
  
  // Calculate progress based on word mastery rather than just correct answers
  const totalMastery = plant.vocabWords.reduce((sum, word) => sum + word.masteryLevel, 0);
  const maxMastery = plant.vocabWords.length * 3;
  const progress = (totalMastery / maxMastery) * 100;

  // Calculate how many words are fully mastered
  const masteredWords = plant.vocabWords.filter(word => word.masteryLevel >= 3).length;

  return (
    <motion.div
      className={`relative cursor-pointer group ${plant.harvestReady ? 'animate-pulse' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Plant Visual */}
      <div className="relative">
        {/* Enhanced plant animation with size based on stage */}
        <motion.div
          className={`filter drop-shadow-lg ${
            plant.stage === 'seed' ? 'text-3xl' :
            plant.stage === 'sprout' ? 'text-4xl' :
            plant.stage === 'bloom' ? 'text-5xl' :
            plant.stage === 'tree' ? 'text-6xl' :
            'text-7xl'
          }`}
          animate={{
            y: [0, -3, 0],
            rotate: [0, 2, -2, 0],
            scale: plant.harvestReady ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: plant.harvestReady ? 1 : 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {plantConfig.emoji}
        </motion.div>

        {/* Health Indicator */}
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
             style={{ backgroundColor: healthColor }} />

        {/* Magical Glow for Advanced Plants */}
        {plant.stage === 'magical' && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/50 to-blue-400/50"
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Harvest Ready Indicator */}
        {plant.harvestReady && (
          <motion.div
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl"
            animate={{
              y: [0, -5, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ✨
          </motion.div>
        )}

        {/* Water effect when recently watered */}
        {Date.now() - plant.lastWatered.getTime() < 10000 && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -20 }}
            transition={{ duration: 2 }}
          >
            💧
          </motion.div>
        )}
      </div>

      {/* Enhanced Info Card */}
      <motion.div
        className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        style={{ minWidth: '220px' }}
      >
        <GlassmorphismCard className="p-4 text-center" variant="secondary">
          <div className="text-2xl mb-2">{plantConfig.emoji}</div>
          <div className="font-bold text-sm mb-2 text-white">{plantConfig.name}</div>
          <div className="text-xs text-white/80 mb-3">{plant.vocabCategory}</div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
            <motion.div
              className={`h-full ${
                plant.harvestReady ? 'bg-gradient-to-r from-gold-400 to-yellow-500' :
                'bg-gradient-to-r from-green-400 to-emerald-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="text-xs text-white/70 mb-2">
            {masteredWords}/{plant.vocabWords.length} words mastered
          </div>

          <div className="text-xs text-white/60">
            Health: {plant.health}% • Stage: {plant.stage}
          </div>

          {/* Action hint */}
          <div className="mt-2 text-xs font-medium">
            {plant.harvestReady ? (
              <span className="text-yellow-300">🌟 Click to harvest! 🌟</span>
            ) : (
              <span className="text-blue-300">💧 Click to water</span>
            )}
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center gap-2 mt-2">
            {plant.health < 50 && (
              <div className="flex items-center gap-1 text-red-300">
                <AlertCircle className="h-3 w-3" />
                <span className="text-xs">Low health</span>
              </div>
            )}
            {plant.harvestReady && (
              <div className="flex items-center gap-1 text-yellow-300">
                <Star className="h-3 w-3" />
                <span className="text-xs">Ready!</span>
              </div>
            )}
          </div>
        </GlassmorphismCard>
      </motion.div>
    </motion.div>
  );
};

const EmptySpot: React.FC<{
  position: { id: number; x: string; y: string; name: string; accessible: boolean };
  onClick: () => void;
  accessible: boolean;
}> = ({ position, onClick, accessible }) => {
  return (
    <motion.div
      className={`relative group ${accessible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={accessible ? onClick : undefined}
      whileHover={accessible ? { scale: 1.05 } : {}}
      whileTap={accessible ? { scale: 0.95 } : {}}
    >
      {/* Empty Spot Visual */}
      <div className={`w-20 h-20 rounded-full border-3 border-dashed flex items-center justify-center shadow-lg backdrop-blur-sm
        ${accessible
          ? 'border-emerald-300/80 hover:border-emerald-200 bg-emerald-100/30 hover:bg-emerald-100/50'
          : 'border-gray-300/60 bg-gray-200/20'
        } transition-all duration-300`}>
        {accessible ? (
          <motion.div
            animate={{ 
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <Sparkles className={`h-8 w-8 ${accessible ? 'text-emerald-500 drop-shadow-lg' : 'text-gray-400/50'}`} />
          </motion.div>
        ) : (
          <Crown className="h-8 w-8 text-amber-500/70 drop-shadow-md" />
        )}
      </div>

      {/* Info Card */}
      <motion.div
        className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ minWidth: '180px' }}
      >
        <GlassmorphismCard className="p-4 text-center">
          <div className="text-2xl mb-2">🌱</div>
          <div className="font-bold text-sm mb-2 text-white">
            {accessible ? 'Plant New Seed' : 'Locked Area'}
          </div>
          <div className="text-xs text-white/80 mb-2">
            {accessible
              ? `${Object.keys(sampleVocabulary).length} categories available`
              : `Unlock at level ${Math.ceil((position?.id || 1) / 2)}`
            }
          </div>
          <div className="text-xs text-emerald-200">
            {accessible ? 'From 10 gems' : 'Keep learning!'}
          </div>
        </GlassmorphismCard>
      </motion.div>
    </motion.div>
  );
};

interface ChallengeViewProps {
  plant: Plant;
  vocabItem: VocabularyItem;
  userAnswer: string;
  showFeedback: { type: 'correct' | 'incorrect' | null; message: string; show: boolean };
  playerStats: GardenerStats;
  onAnswerChange: (answer: string) => void;
  onSubmitAnswer: () => void;
  onBackToGarden: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ChallengeView: React.FC<ChallengeViewProps> = ({
  plant,
  vocabItem,
  userAnswer,
  showFeedback,
  playerStats,
  onAnswerChange,
  onSubmitAnswer,
  onBackToGarden,
  inputRef
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <GlassmorphismCard className="p-6">
            <div className="text-4xl mb-4">{PLANT_STAGES[plant.stage].emoji}</div>
            <h2 className="text-2xl font-bold text-white mb-2">Water your {plant.vocabCategory.toLowerCase()} plant!</h2>
            <p className="text-white/80 mb-4">Answer correctly to help it grow!</p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-400" />
                <span className="text-white text-sm">
                  Progress: {Math.round(((plant.vocabWords.reduce((sum, word) => sum + word.masteryLevel, 0)) / (plant.vocabWords.length * 3)) * 100)}%
                </span>
              </div>
              <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((plant.vocabWords.reduce((sum, word) => sum + word.masteryLevel, 0)) / (plant.vocabWords.length * 3)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </GlassmorphismCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassmorphismCard className="p-8" variant="primary">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Translate this word:
              </h3>
              <motion.div 
                className="text-3xl font-bold text-white mb-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {vocabItem.originalText}
              </motion.div>

              {vocabItem.contextSentence && (
                <motion.div 
                  className="text-white/70 text-sm italic mb-4 bg-white/5 p-3 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-white/50 text-xs block mb-1">Context:</span>
                  "{vocabItem.contextSentence}"
                </motion.div>
              )}

              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-6 ${
                vocabItem.difficulty === 'easy' ? 'bg-green-500/20 text-green-300' :
                vocabItem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {vocabItem.difficulty.toUpperCase()} • {vocabItem.category}
                <span className="ml-2 text-xs">
                  Mastery: {'★'.repeat(vocabItem.masteryLevel)}{'☆'.repeat(3 - vocabItem.masteryLevel)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSubmitAnswer()}
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                placeholder="Type your answer here..."
                autoComplete="off"
                autoFocus
              />

              <div className="flex gap-3">
                <motion.button
                  onClick={onBackToGarden}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="h-4 w-4 inline mr-2" />
                  Back to Garden
                </motion.button>

                <motion.button
                  onClick={onSubmitAnswer}
                  disabled={!userAnswer.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 rounded-xl text-white font-medium transition-all duration-200"
                  whileHover={{ scale: userAnswer.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: userAnswer.trim() ? 0.98 : 1 }}
                >
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  Submit Answer
                </motion.button>
              </div>
            </div>
          </GlassmorphismCard>
        </motion.div>

        <AnimatePresence>
          {showFeedback.show && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="mt-6"
            >
              <GlassmorphismCard
                variant={showFeedback.type === 'correct' ? 'success' : 'error'}
                className="p-6 text-center"
              >
                <motion.div 
                  className="flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                  {showFeedback.type === 'correct' ? (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-400" />
                  )}
                </motion.div>
                <motion.div 
                  className="text-lg font-semibold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {showFeedback.type === 'correct' ? 'Excellent! 🌱' : 'Not quite right 🤔'}
                </motion.div>
                <motion.div 
                  className="text-white/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {showFeedback.message}
                </motion.div>
                {showFeedback.type === 'correct' && (
                  <motion.div
                    className="mt-3 text-sm text-green-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    +10 XP • Streak: {playerStats.streak}
                  </motion.div>
                )}
              </GlassmorphismCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface ShopViewProps {
  playerStats: GardenerStats;
  availableCategories: string[];
  onCreatePlant: (category: string, position: number) => void;
  onBackToGarden: () => void;
}

const ShopView: React.FC<ShopViewProps> = ({
  playerStats,
  availableCategories,
  onCreatePlant,
  onBackToGarden
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handlePlantCreation = () => {
    if (selectedCategory) {
      onCreatePlant(selectedCategory, 1); // Default to position 1
    }
  };

  const canAfford = playerStats.gems >= 10;

  return (
    <div className="min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <motion.button
            onClick={onBackToGarden}
            className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </motion.button>

          <h1 className="text-3xl font-bold text-white">🛍️ Garden Shop</h1>

          <div className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-cyan-400" />
            <span className="text-white font-bold text-lg">{playerStats.gems} gems</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassmorphismCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Choose Your Seeds
            </h2>

            <div className="space-y-3">
              {availableCategories.map((category) => {
                const words = sampleVocabulary[category];
                const isSelected = selectedCategory === category;

                return (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-green-400 bg-green-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{category}</div>
                        <div className="text-white/70 text-sm">
                          {words.length} vocabulary words
                        </div>
                      </div>
                      <div className="text-2xl">🌱</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </GlassmorphismCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassmorphismCard className="p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Plant Your Seed
            </h2>

            <div className="mb-6 p-4 bg-white/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Seed cost:</span>
                <span className={`font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                  10 gems
                </span>
              </div>
            </div>

            <motion.button
              onClick={handlePlantCreation}
              disabled={!selectedCategory || !canAfford}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 ${
                selectedCategory && canAfford
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  : 'bg-gray-500/50 cursor-not-allowed'
              }`}
              whileHover={selectedCategory && canAfford ? { scale: 1.02 } : {}}
              whileTap={selectedCategory && canAfford ? { scale: 0.98 } : {}}
            >
              {!selectedCategory ? 'Select a seed category' :
               !canAfford ? 'Not enough gems' :
               '🌱 Plant Your Seed'}
            </motion.button>

            {!canAfford && (
              <div className="mt-3 text-center text-red-300 text-sm">
                You need {10 - playerStats.gems} more gems
              </div>
            )}
          </GlassmorphismCard>
        </motion.div>
      </div>
    </div>
  );
};

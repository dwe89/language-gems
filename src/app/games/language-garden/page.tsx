'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Flower, ArrowLeft, Droplets, Sun, Sparkles, ShoppingBag,
  Trophy, Sprout
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// =====================================================
// TYPES
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
}

interface SoilType {
  id: string;
  name: string;
  emoji: string;
  growthMultiplier: number;
  specialEffect: string;
  cost: number;
}

interface Weather {
  type: 'sunny' | 'rainy' | 'cloudy' | 'stormy' | 'rainbow';
  emoji: string;
  effect: string;
  growthModifier: number;
  duration: number;
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
  soilType: string;
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

interface GardenerClass {
  id: string;
  name: string;
  description: string;
  emoji: string;
  bonuses: {
    learningSpeed: number;
    plantGrowth: number;
    gemGeneration: number;
    weatherResistance: number;
  };
  specialAbility: string;
}

interface GardenerStats {
  level: number;
  xp: number;
  gems: number;
  plantsGrown: number;
  totalCorrectAnswers: number;
  streak: number;
  highestStreak: number;
  gardenerClass: string;
  skills: {
    cultivation: number;    // Affects plant growth speed
    linguistics: number;    // Affects learning efficiency  
    memory: number;         // Affects spaced repetition
    weatherMagic: number;   // Affects weather control
    enchantment: number;    // Affects magical plant creation
  };
  skillPoints: number;
  unlockedAreas: string[];
  achievements: Set<string>;
  tools: string[];
  currentWeather: Weather;
  weatherEndsAt: Date;
}

// =====================================================
// SAMPLE DATA
// =====================================================

const gardenerClasses: { [key: string]: GardenerClass } = {
  botanist: {
    id: 'botanist',
    name: 'Master Botanist',
    description: 'Expert in plant cultivation and growth',
    emoji: '🌿',
    bonuses: {
      learningSpeed: 1.0,
      plantGrowth: 1.5,
      gemGeneration: 1.0,
      weatherResistance: 1.2
    },
    specialAbility: 'Plants grow 50% faster'
  },
  linguist: {
    id: 'linguist',
    name: 'Word Whisperer',
    description: 'Master of languages and quick learning',
    emoji: '📚',
    bonuses: {
      learningSpeed: 1.8,
      plantGrowth: 1.0,
      gemGeneration: 1.3,
      weatherResistance: 1.0
    },
    specialAbility: 'Learn vocabulary 80% faster'
  },
  explorer: {
    id: 'explorer',
    name: 'Garden Explorer',
    description: 'Discovers magical garden secrets',
    emoji: '🗺️',
    bonuses: {
      learningSpeed: 1.2,
      plantGrowth: 1.2,
      gemGeneration: 1.5,
      weatherResistance: 1.1
    },
    specialAbility: 'Find rare seeds and magical areas'
  },
  scholar: {
    id: 'scholar',
    name: 'Memory Scholar',
    description: 'Expert in retention and recall',
    emoji: '🎓',
    bonuses: {
      learningSpeed: 1.4,
      plantGrowth: 1.1,
      gemGeneration: 1.2,
      weatherResistance: 1.0
    },
    specialAbility: 'Perfect memory - never forget learned words'
  }
};

const soilTypes: { [key: string]: SoilType } = {
  basic: {
    id: 'basic',
    name: 'Garden Soil',
    emoji: '🟤',
    growthMultiplier: 1.0,
    specialEffect: 'Standard growth rate',
    cost: 0
  },
  fertile: {
    id: 'fertile',
    name: 'Fertile Soil',
    emoji: '🟫',
    growthMultiplier: 1.3,
    specialEffect: 'Faster growth',
    cost: 20
  },
  magical: {
    id: 'magical',
    name: 'Enchanted Soil',
    emoji: '✨',
    growthMultiplier: 1.8,
    specialEffect: 'Magical plant evolution',
    cost: 50
  },
  crystal: {
    id: 'crystal',
    name: 'Crystal Soil',
    emoji: '💎',
    growthMultiplier: 2.0,
    specialEffect: 'Gem generation boost',
    cost: 100
  }
};

const weatherTypes: Weather[] = [
  { type: 'sunny', emoji: '☀️', effect: 'Plants grow normally', growthModifier: 1.0, duration: 300000 },
  { type: 'rainy', emoji: '🌧️', effect: 'Plants grow faster', growthModifier: 1.4, duration: 180000 },
  { type: 'cloudy', emoji: '☁️', effect: 'Slower growth', growthModifier: 0.8, duration: 240000 },
  { type: 'stormy', emoji: '⛈️', effect: 'Plants may wilt', growthModifier: 0.5, duration: 120000 },
  { type: 'rainbow', emoji: '🌈', effect: 'Magical boost!', growthModifier: 2.0, duration: 60000 }
];

const createVocabItem = (id: string, originalText: string, translatedText: string, difficulty: "easy" | "medium" | "hard", category: string, contextSentence?: string): VocabularyItem => ({
  id,
  originalText,
  translatedText,
  difficulty,
  category,
  contextSentence,
  masteryLevel: 0,
  lastReviewed: new Date(),
  reviewCount: 0
});

const sampleVocabulary: { [category: string]: VocabularyItem[] } = {
  Food: [
    createVocabItem("1", "apple", "manzana", "easy", "Food", "I eat an apple every day."),
    createVocabItem("2", "bread", "pan", "easy", "Food", "We buy fresh bread from the bakery."),
    createVocabItem("3", "chicken", "pollo", "easy", "Food", "The chicken is very tasty."),
    createVocabItem("4", "restaurant", "restaurante", "medium", "Food", "Let's go to that new restaurant."),
    createVocabItem("5", "delicious", "delicioso", "medium", "Food", "This meal is absolutely delicious."),
    createVocabItem("6", "breakfast", "desayuno", "medium", "Food", "Breakfast is the most important meal."),
  ],
  Travel: [
    createVocabItem("7", "airport", "aeropuerto", "medium", "Travel", "The airport is very busy today."),
    createVocabItem("8", "hotel", "hotel", "easy", "Travel", "Our hotel room has a beautiful view."),
    createVocabItem("9", "passport", "pasaporte", "medium", "Travel", "Don't forget your passport!"),
    createVocabItem("10", "vacation", "vacaciones", "medium", "Travel", "We're planning summer vacations."),
    createVocabItem("11", "suitcase", "maleta", "easy", "Travel", "Pack your suitcase the night before."),
    createVocabItem("12", "adventure", "aventura", "hard", "Travel", "Every trip is a new adventure."),
  ],
  Animals: [
    createVocabItem("13", "cat", "gato", "easy", "Animals", "The cat is sleeping on the sofa."),
    createVocabItem("14", "dog", "perro", "easy", "Animals", "My dog loves to play fetch."),
    createVocabItem("15", "elephant", "elefante", "medium", "Animals", "Elephants are very intelligent animals."),
    createVocabItem("16", "butterfly", "mariposa", "hard", "Animals", "The colorful butterfly landed on the flower."),
    createVocabItem("17", "dolphin", "delfín", "medium", "Animals", "Dolphins are playful sea creatures."),
    createVocabItem("18", "rhinoceros", "rinoceronte", "hard", "Animals", "The rhinoceros has thick skin."),
  ],
  Nature: [
    createVocabItem("19", "forest", "bosque", "easy", "Nature", "We walked through the peaceful forest."),
    createVocabItem("20", "mountain", "montaña", "easy", "Nature", "The mountain peak is covered in snow."),
    createVocabItem("21", "ocean", "océano", "medium", "Nature", "The ocean waves are very powerful."),
    createVocabItem("22", "rainbow", "arcoíris", "medium", "Nature", "A beautiful rainbow appeared after the rain."),
    createVocabItem("23", "earthquake", "terremoto", "hard", "Nature", "The earthquake shook the entire city."),
    createVocabItem("24", "constellation", "constelación", "hard", "Nature", "We can see many constellations tonight."),
  ]
};

// =====================================================
// MAIN COMPONENT
// =====================================================

function LanguageGarden() {
  const router = useRouter();

  // Game state
  const [gameState, setGameState] = useState<'garden' | 'challenge' | 'shop'>('garden');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [currentVocabItem, setCurrentVocabItem] = useState<VocabularyItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({ type: null, message: '' });

  // Shop state (moved to main component level)
  const [selectedSoilType, setSelectedSoilType] = useState('basic');
  const [shopTab, setShopTab] = useState<'seeds' | 'soil' | 'tools'>('seeds');

  // Player stats
  const [playerStats, setPlayerStats] = useState<GardenerStats>({
    level: 1,
    xp: 0,
    gems: 25,
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
    currentWeather: weatherTypes[0], // sunny
    weatherEndsAt: new Date(Date.now() + 300000) // 5 minutes
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // =====================================================
  // INITIALIZATION
  // =====================================================

  useEffect(() => {
    // Start with one sample plant - only on client side
    if (typeof window !== 'undefined' && plants.length === 0) {
      plantSeed('Food', { row: 1, col: 1 }, 'basic');
    }
  }, [plants.length]);

  // =====================================================
  // WEATHER SYSTEM
  // =====================================================

  const generateRandomWeather = (): Weather => {
    const random = Math.random();
    if (random < 0.4) return weatherTypes[0]; // sunny
    if (random < 0.6) return weatherTypes[1]; // rainy  
    if (random < 0.8) return weatherTypes[2]; // cloudy
    if (random < 0.95) return weatherTypes[3]; // stormy
    return weatherTypes[4]; // rainbow (rare)
  };

  const checkWeatherChange = () => {
    const now = new Date();
    if (now > playerStats.weatherEndsAt) {
      const newWeather = generateRandomWeather();
      setPlayerStats((prev: GardenerStats) => ({
        ...prev,
        currentWeather: newWeather,
        weatherEndsAt: new Date(now.getTime() + newWeather.duration)
      }));
    }
  };

  // Check weather every minute
  useEffect(() => {
    const weatherInterval = setInterval(checkWeatherChange, 60000);
    return () => clearInterval(weatherInterval);
  }, [playerStats.weatherEndsAt]);

  // =====================================================
  // PLANT MANAGEMENT (Enhanced)
  // =====================================================

  const getStageRequirements = (stage: Plant['stage']): number => {
    switch (stage) {
      case 'seed': return 3;
      case 'sprout': return 8;
      case 'bloom': return 15;
      case 'tree': return 25;
      case 'magical': return 40;
      default: return 0;
    }
  };

  const calculateGrowthMultiplier = (plant: Plant): number => {
    const soilMultiplier = soilTypes[plant.soilType]?.growthMultiplier || 1.0;
    const weatherMultiplier = playerStats.currentWeather.growthModifier;
    const classMultiplier = gardenerClasses[playerStats.gardenerClass].bonuses.plantGrowth;
    const skillMultiplier = 1 + (playerStats.skills.cultivation - 1) * 0.1;

    return soilMultiplier * weatherMultiplier * classMultiplier * skillMultiplier;
  };

  const checkForMagicalEvolution = (plant: Plant): boolean => {
    if (plant.stage === 'tree' && plant.soilType === 'magical') {
      const magicSkill = playerStats.skills.enchantment;
      const chance = 0.1 + (magicSkill - 1) * 0.05; // 10% base + 5% per enchantment level
      return Math.random() < chance;
    }
    return false;
  };

  const plantSeed = (category: string, position: { row: number; col: number }, soilType: string = 'basic') => {
    const vocabWords = sampleVocabulary[category] || [];
    if (vocabWords.length === 0) return;

    const newPlant: Plant = {
      id: `plant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      vocabCategory: category,
      vocabWords,
      stage: 'seed',
      correctAnswers: 0,
      requiredAnswers: getStageRequirements('seed'),
      lastWatered: new Date(),
      position,
      isWilting: false,
      soilType,
      health: 100,
      maxHealth: 100,
      plantedDate: new Date(),
      harvestReady: false
    };

    setPlants(prev => [...prev, newPlant]);

    const soilCost = soilTypes[soilType]?.cost || 0;
    const totalCost = 5 + soilCost; // Base seed cost + soil cost

    setPlayerStats((prev: GardenerStats) => ({
      ...prev,
      gems: prev.gems - totalCost,
      plantsGrown: prev.plantsGrown + 1
    }));
  };

  const waterPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setCurrentQuestionIndex(0);
    loadNextQuestion(plant);
    setGameState('challenge');
  };

  const loadNextQuestion = (plant: Plant) => {
    if (plant.vocabWords.length > 0) {
      const selectedWord = selectOptimalWord(plant);
      setCurrentVocabItem(selectedWord);
      setUserAnswer('');
      setShowFeedback({ type: null, message: '' });

      // Focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // =====================================================
  // ENHANCED LEARNING SYSTEM
  // =====================================================

  const getSpacedRepetitionWords = (plant: Plant): VocabularyItem[] => {
    const now = new Date();
    const memorySkill = playerStats.skills.memory;

    return plant.vocabWords.filter(word => {
      const daysSinceReview = Math.floor((now.getTime() - word.lastReviewed.getTime()) / (1000 * 60 * 60 * 24));
      const intervalNeeded = Math.pow(2, word.masteryLevel) * Math.max(1, 4 - memorySkill);
      return daysSinceReview >= intervalNeeded || word.reviewCount === 0;
    });
  };

  const selectOptimalWord = (plant: Plant): VocabularyItem => {
    const spacedWords = getSpacedRepetitionWords(plant);

    if (spacedWords.length > 0) {
      // Prioritize words that need review
      const sortedByUrgency = spacedWords.sort((a, b) => {
        const urgencyA = (new Date().getTime() - a.lastReviewed.getTime()) / (a.masteryLevel + 1);
        const urgencyB = (new Date().getTime() - b.lastReviewed.getTime()) / (b.masteryLevel + 1);
        return urgencyB - urgencyA;
      });
      return sortedByUrgency[0];
    }

    // Fallback to random selection
    return plant.vocabWords[Math.floor(Math.random() * plant.vocabWords.length)];
  };

  const updateWordMastery = (word: VocabularyItem, correct: boolean): VocabularyItem => {
    const updatedWord = { ...word };
    updatedWord.lastReviewed = new Date();
    updatedWord.reviewCount++;

    if (correct) {
      updatedWord.masteryLevel = Math.min(5, updatedWord.masteryLevel + 1);
    } else {
      updatedWord.masteryLevel = Math.max(0, updatedWord.masteryLevel - 1);
    }

    return updatedWord;
  };

  // =====================================================
  // CHALLENGE LOGIC (Enhanced)
  // =====================================================

  const handleAnswerSubmit = () => {
    if (!currentVocabItem || !selectedPlant || userAnswer.trim() === '') return;

    // Get the current plant data from the plants array
    const currentPlant = plants.find(p => p.id === selectedPlant.id);
    if (!currentPlant) return;

    const correctAnswer = currentVocabItem.translatedText.toLowerCase();
    const userAnswerLower = userAnswer.trim().toLowerCase();
    const isCorrect = userAnswerLower === correctAnswer;

    // Update word mastery
    const updatedWord = updateWordMastery(currentVocabItem, isCorrect);

    // Update the word in the plant's vocabulary
    setPlants(prev => prev.map(p => {
      if (p.id === selectedPlant.id) {
        const updatedVocab = p.vocabWords.map(word =>
          word.id === updatedWord.id ? updatedWord : word
        );
        return { ...p, vocabWords: updatedVocab };
      }
      return p;
    }));

    if (isCorrect) {
      const growthMultiplier = calculateGrowthMultiplier(currentPlant);
      const bonusMessage = growthMultiplier > 1.5 ? ' ✨ Magical growth boost!' : '';

      setShowFeedback({
        type: 'correct',
        message: `🌱 Perfect! Your plant is growing!${bonusMessage}`
      });

      // Update plant with growth calculations
      setPlants(prev => prev.map(p => {
        if (p.id === selectedPlant.id) {
          const effectiveGrowth = Math.ceil(1 * growthMultiplier);
          const newCorrectAnswers = p.correctAnswers + effectiveGrowth;
          let newStage = p.stage;
          let newRequiredAnswers = p.requiredAnswers;

          // Check for stage progression
          if (newCorrectAnswers >= p.requiredAnswers) {
            switch (p.stage) {
              case 'seed':
                newStage = 'sprout';
                newRequiredAnswers = getStageRequirements('sprout');
                break;
              case 'sprout':
                newStage = 'bloom';
                newRequiredAnswers = getStageRequirements('bloom');
                break;
              case 'bloom':
                newStage = 'tree';
                newRequiredAnswers = getStageRequirements('tree');
                break;
              case 'tree':
                if (checkForMagicalEvolution(p)) {
                  newStage = 'magical';
                  newRequiredAnswers = getStageRequirements('magical');
                }
                break;
            }
          }

          return {
            ...p,
            correctAnswers: newCorrectAnswers,
            stage: newStage,
            requiredAnswers: newRequiredAnswers,
            lastWatered: new Date(),
            isWilting: false,
            health: Math.min(p.maxHealth, p.health + 10), // Heal plant
            harvestReady: newStage === 'tree' || newStage === 'magical',
            ...(newStage === 'magical' && {
              magicalProperties: {
                glowing: true,
                produces: 'language_gems',
                specialAbility: 'Perfect translation memory'
              }
            })
          };
        }
        return p;
      }));

      // Calculate XP with class bonuses
      const baseXP = 10 + (updatedWord.masteryLevel * 2); // More XP for harder mastered words
      const finalXP = baseXP * gardenerClasses[playerStats.gardenerClass].bonuses.learningSpeed;

      // Update player stats
      setPlayerStats((prev: GardenerStats) => ({
        ...prev,
        totalCorrectAnswers: prev.totalCorrectAnswers + 1,
        streak: prev.streak + 1,
        highestStreak: Math.max(prev.highestStreak, prev.streak + 1),
        xp: prev.xp + finalXP,
        level: Math.floor((prev.xp + finalXP) / 100) + 1,
        gems: prev.gems + Math.floor(growthMultiplier) // Bonus gems for good growth
      }));

    } else {
      // Incorrect answer
      setShowFeedback({
        type: 'incorrect',
        message: `Not quite! The correct answer is "${currentVocabItem.translatedText}". ${currentVocabItem.contextSentence || ''}`
      });

      // Reset streak
      setPlayerStats((prev: GardenerStats) => ({
        ...prev,
        streak: 0
      }));

      // Plant loses some health in bad weather
      if (playerStats.currentWeather.type === 'stormy') {
        setPlants(prev => prev.map(p => {
          if (p.id === selectedPlant.id) {
            return {
              ...p,
              health: Math.max(0, p.health - 5),
              isWilting: p.health <= 20
            };
          }
          return p;
        }));
      }
    }

    // Continue to next question or return to garden
    setTimeout(() => {
      // Get the updated plant from the current state
      setPlants(currentPlants => {
        const updatedPlant = currentPlants.find(p => p.id === selectedPlant.id);
        if (updatedPlant && updatedPlant.correctAnswers < updatedPlant.requiredAnswers) {
          // Still need more answers, continue with next question
          loadNextQuestion(updatedPlant);
        } else {
          // Finished or reached requirement, return to garden
          setGameState('garden');
          setSelectedPlant(null);
          setCurrentVocabItem(null);
        }
        return currentPlants; // Return unchanged since we're just reading
      });
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnswerSubmit();
    }
  };

  // =====================================================
  // RENDER FUNCTIONS
  // =====================================================

  const getPlantEmoji = (plant: Plant): string => {
    if (plant.isWilting) return '🥀';

    // Special magical plant display
    if (plant.stage === 'magical') {
      return plant.magicalProperties?.glowing ? '🌟🌳✨' : '🌳✨';
    }

    // Soil type affects appearance
    const soilEffect = plant.soilType === 'magical' ? '✨' :
      plant.soilType === 'crystal' ? '💎' : '';

    let baseEmoji: string;
    switch (plant.stage) {
      case 'seed': baseEmoji = '🌱'; break;
      case 'sprout': baseEmoji = '🌿'; break;
      case 'bloom': baseEmoji = '🌸'; break;
      case 'tree': baseEmoji = '🌳'; break;
      default: baseEmoji = '🌱';
    }

    return baseEmoji + soilEffect;
  };

  const getPlantHealthBar = (plant: Plant) => {
    const healthPercent = (plant.health / plant.maxHealth) * 100;
    const healthColor = healthPercent > 70 ? 'bg-green-400' :
      healthPercent > 40 ? 'bg-yellow-400' : 'bg-red-400';

    return (
      <div className="w-full bg-gray-800/50 rounded-full h-1 mb-2">
        <div
          className={`${healthColor} h-1 rounded-full transition-all duration-500 shadow-sm`}
          style={{ width: `${healthPercent}%` }}
        />
      </div>
    );
  };

  const getProgressPercentage = (plant: Plant): number => {
    return Math.min((plant.correctAnswers / plant.requiredAnswers) * 100, 100);
  };

  const renderGarden = () => (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-indigo-900 via-blue-900 to-green-900">
      {/* Starry night sky background */}
      <div className="absolute inset-0">
        {/* Stars - fixed positions to avoid hydration mismatch */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${(i * 7) % 100}%`,
              top: `${(i * 3) % 40}%`,
              animationDelay: `${(i * 0.1) % 3}s`,
              animationDuration: `${2 + (i * 0.05) % 2}s`
            }}
          />
        ))}

        {/* Larger twinkling stars - fixed positions */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-2 h-2 bg-yellow-200 rounded-full animate-ping"
            style={{
              left: `${(i * 13) % 100}%`,
              top: `${(i * 5) % 30}%`,
              animationDelay: `${(i * 0.2) % 4}s`,
              animationDuration: `${3 + (i * 0.1) % 3}s`
            }}
          />
        ))}

        {/* Magical floating particles - fixed positions */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-green-300 rounded-full animate-bounce"
            style={{
              left: `${(i * 11) % 100}%`,
              top: `${50 + (i * 7) % 40}%`,
              animationDelay: `${(i * 0.15) % 2}s`,
              animationDuration: `${4 + (i * 0.08) % 2}s`
            }}
          />
        ))}
      </div>

      {/* Background trees silhouettes */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-green-800/50 to-transparent">
        {/* Tree silhouettes */}
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path
            d="M0,400 L0,200 Q100,150 200,200 L200,180 Q300,120 400,180 L400,160 Q500,100 600,160 L600,140 Q700,80 800,140 L800,120 Q900,60 1000,120 L1000,100 Q1100,40 1200,100 L1200,400 Z"
            fill="rgba(34, 197, 94, 0.2)"
          />
          <path
            d="M0,400 L0,250 Q150,200 300,250 L300,230 Q450,180 600,230 L600,210 Q750,160 900,210 L900,190 Q1050,140 1200,190 L1200,400 Z"
            fill="rgba(21, 128, 61, 0.3)"
          />
        </svg>
      </div>

      {/* Header - floating in the night sky */}
      <div className="relative z-10 flex items-center justify-between mb-8 p-4">
        <Link href="/games" className="p-3 bg-green-600/80 hover:bg-green-600 rounded-full transition-all duration-300 backdrop-blur-md border border-green-400/30">
          <ArrowLeft className="h-6 w-6 text-white" />
        </Link>

        <div className="flex items-center space-x-4">
          {/* Weather Display */}
          <div className="flex items-center space-x-2 bg-blue-600/80 backdrop-blur-md px-4 py-2 rounded-full border border-blue-400/30">
            <span className="text-2xl">{playerStats.currentWeather.emoji}</span>
            <div className="text-xs text-white">
              <div className="font-medium">{playerStats.currentWeather.effect}</div>
            </div>
          </div>

          {/* Class Display */}
          <div className="flex items-center space-x-2 bg-purple-600/80 backdrop-blur-md px-4 py-2 rounded-full border border-purple-400/30">
            <span className="text-xl">{gardenerClasses[playerStats.gardenerClass].emoji}</span>
            <div className="text-xs text-white">
              <div className="font-medium">{gardenerClasses[playerStats.gardenerClass].name}</div>
              <div>Level {playerStats.level}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-yellow-600/80 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-400/30">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="font-bold text-white">{playerStats.xp} XP</span>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-600/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-400/30">
            <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
            <span className="font-bold text-white">{playerStats.gems}</span>
          </div>

          <div className="flex items-center space-x-2 bg-orange-600/80 backdrop-blur-md px-4 py-2 rounded-full border border-orange-400/30">
            <Trophy className="h-4 w-4 text-white" />
            <span className="font-bold text-white">{playerStats.streak}</span>
          </div>
        </div>
      </div>

      {/* Garden Title */}
      <div className="relative z-10 text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-2xl">
          🌻 Your Language Garden
        </h1>
        <p className="text-green-200 text-lg drop-shadow-lg">
          {gardenerClasses[playerStats.gardenerClass].description}
        </p>
      </div>

      {/* Magical Garden Grid */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-3 gap-8">
          {plants.map((plant, index) => (
            <motion.div
              key={plant.id}
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => waterPlant(plant)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Magical glow effect around healthy plants */}
              {!plant.isWilting && (
                <div
                  className="absolute inset-0 rounded-full scale-150 animate-pulse"
                  style={{
                    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 50%, transparent 100%)'
                  }}
                />
              )}

              {/* Plant container with soil mound */}
              <div className="relative">
                {/* Soil mound */}
                <div className="w-32 h-20 bg-gradient-to-t from-amber-800 via-amber-700 to-amber-600 rounded-full relative overflow-hidden shadow-2xl">
                  {/* Soil texture */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent" />

                  {/* Soil type effects */}
                  {plant.soilType === 'magical' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 via-purple-400/20 to-transparent animate-pulse" />
                  )}
                  {plant.soilType === 'crystal' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 via-cyan-400/20 to-transparent">
                      {/* Crystal sparkles - fixed positions */}
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-ping"
                          style={{
                            left: `${20 + (i * 7) % 60}%`,
                            top: `${20 + (i * 9) % 60}%`,
                            animationDelay: `${(i * 0.25) % 2}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {plant.soilType === 'fertile' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-green-700/30 via-green-500/20 to-transparent" />
                  )}

                  {/* Small scattered stones/details - fixed positions */}
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-amber-900 rounded-full"
                      style={{
                        left: `${10 + (i * 13) % 80}%`,
                        top: `${30 + (i * 7) % 40}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Plant growing from soil */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    {/* Magical orb/light effect */}
                    {!plant.isWilting && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-8 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"
                          style={{
                            background: 'radial-gradient(circle, #fde047 0%, #facc15 50%, #eab308 100%)'
                          }}>
                          {/* Inner glow */}
                          <div className="absolute inset-1 rounded-full"
                            style={{
                              background: 'radial-gradient(circle, #fef3c7 0%, #fed7aa 100%)'
                            }} />
                          {/* Sparkle effect - fixed positions */}
                          <div className="absolute -inset-2">
                            {[...Array(6)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-0.5 h-0.5 bg-yellow-200 rounded-full animate-ping"
                                style={{
                                  left: `${(i * 17) % 100}%`,
                                  top: `${(i * 19) % 100}%`,
                                  animationDelay: `${(i * 0.3) % 2}s`
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* The actual plant */}
                    <div className="text-6xl filter drop-shadow-lg transform transition-transform group-hover:scale-110">
                      {getPlantEmoji(plant)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Plant info panel */}
              <div className="mt-12 bg-gradient-to-r from-green-600/90 via-green-700/90 to-green-800/90 backdrop-blur-md rounded-2xl px-6 py-4 min-w-[200px] border border-green-400/30 shadow-2xl">
                <h3 className="font-bold text-white text-center mb-2">{plant.vocabCategory}</h3>

                {/* Stage info */}
                <div className="bg-orange-500 text-white text-sm font-medium px-3 py-1 rounded-full text-center mb-3">
                  Stage: {plant.stage} • {plant.correctAnswers}/{plant.requiredAnswers}
                </div>

                {/* Health bar */}
                {getPlantHealthBar(plant)}

                {/* Progress bar */}
                <div className="w-full bg-green-900/50 rounded-full h-2 mb-3">
                  <div
                    className="bg-gradient-to-r from-green-300 to-green-400 h-2 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${getProgressPercentage(plant)}%` }}
                  />
                </div>

                {/* Special status */}
                {plant.magicalProperties && (
                  <div className="text-xs text-purple-200 mb-2 text-center">
                    ✨ {plant.magicalProperties.specialAbility}
                  </div>
                )}

                {plant.harvestReady && (
                  <div className="text-xs text-orange-200 mb-2 font-medium text-center">
                    🎯 Ready to harvest!
                  </div>
                )}

                {/* Water button */}
                <button className="w-full py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg">
                  <Droplets className="h-4 w-4" />
                  <span>{plant.isWilting ? 'Heal Plant' : 'Water Plant'}</span>
                </button>
              </div>
            </motion.div>
          ))}

          {/* Add new plant - magical planting spot */}
          {plants.length < 9 && (
            <motion.div
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => setGameState('shop')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Magical glow for planting spot */}
              <div
                className="absolute inset-0 rounded-full scale-150 animate-pulse"
                style={{
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%)'
                }}
              />

              {/* Empty soil mound */}
              <div className="relative">
                <div className="w-32 h-20 bg-gradient-to-t from-amber-800 via-amber-700 to-amber-600 rounded-full relative overflow-hidden shadow-2xl border-4 border-dashed border-green-400/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent" />

                  {/* Plus sign in the soil */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl text-green-400 font-bold">+</div>
                  </div>
                </div>
              </div>

              {/* Planting info */}
              <div className="mt-12 bg-gradient-to-r from-emerald-600/90 via-emerald-700/90 to-emerald-800/90 backdrop-blur-md rounded-2xl px-6 py-4 min-w-[200px] border border-emerald-400/30 shadow-2xl">
                <div className="text-center text-white">
                  <div className="text-3xl mb-2">🌱</div>
                  <div className="font-medium mb-2">Plant New Seed</div>
                  <div className="text-sm text-emerald-200 mb-3">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-emerald-300"></div>
                      <span>5+ gems</span>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-all duration-300 shadow-lg">
                    Open Shop
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  const renderChallenge = () => {
    // Always get the current plant data from the plants array
    const currentPlant = selectedPlant ? plants.find(p => p.id === selectedPlant.id) : null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {currentPlant && currentVocabItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8"
            >
              {/* Weather effect overlay */}
              {playerStats.currentWeather.type === 'rainbow' && (
                <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-2xl opacity-30 pointer-events-none" />
              )}

              {/* Plant info */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{getPlantEmoji(currentPlant)}</div>
                <h2 className="text-2xl font-bold text-gray-800">{currentPlant.vocabCategory} Garden</h2>
                <div className="text-sm text-gray-600">
                  Progress: {currentPlant.correctAnswers}/{currentPlant.requiredAnswers} •
                  Health: {currentPlant.health}/{currentPlant.maxHealth}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Weather Bonus: {Math.round((playerStats.currentWeather.growthModifier - 1) * 100)}%
                </div>
              </div>

              {/* Word mastery indicator */}
              <div className="text-center mb-4">
                <div className="flex justify-center items-center space-x-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div
                      key={level}
                      className={`w-2 h-2 rounded-full ${level <= currentVocabItem.masteryLevel ? 'bg-yellow-400' : 'bg-gray-200'
                        }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Mastery Level: {currentVocabItem.masteryLevel}/5
                  {currentVocabItem.reviewCount > 0 && ` • Reviewed ${currentVocabItem.reviewCount} times`}
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-8">
                <h3 className="text-4xl font-bold text-gray-800 mb-4">
                  {currentVocabItem.originalText}
                </h3>
                <p className="text-gray-600 mb-2">Translate to Spanish:</p>

                {/* Context sentence if available */}
                {currentVocabItem.contextSentence && (
                  <div className="bg-blue-50 p-3 rounded-lg mt-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Context:</span> {currentVocabItem.contextSentence}
                    </p>
                  </div>
                )}

                {/* Difficulty indicator */}
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentVocabItem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    currentVocabItem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {currentVocabItem.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {showFeedback.type && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`mb-6 p-4 rounded-xl text-center font-medium ${showFeedback.type === 'correct'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                  >
                    {showFeedback.message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input */}
              {!showFeedback.type && (
                <div className="space-y-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your answer..."
                  />

                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={userAnswer.trim() === ''}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      Submit Answer
                    </button>

                    <button
                      onClick={() => setGameState('garden')}
                      className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Back to Garden
                    </button>
                  </div>

                  {/* Learning tip */}
                  <div className="text-center text-xs text-gray-500 mt-2">
                    💡 Tip: {gardenerClasses[playerStats.gardenerClass].specialAbility}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  const renderShop = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 bg-white/70 backdrop-blur-md rounded-xl p-4 shadow-lg">
            <button
              onClick={() => setGameState('garden')}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-purple-700" />
            </button>
            <h1 className="text-2xl font-bold text-purple-800">🛍️ Magical Garden Shop</h1>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              <span className="font-bold text-purple-800">{playerStats.gems} gems</span>
            </div>
          </div>

          {/* Shop tabs */}
          <div className="flex justify-center mb-6 bg-white/50 rounded-xl p-2">
            {[
              { id: 'seeds', name: 'Seeds', emoji: '🌱' },
              { id: 'soil', name: 'Soil Types', emoji: '🟫' },
              { id: 'tools', name: 'Tools & Classes', emoji: '🛠️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setShopTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${shopTab === tab.id
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-700 hover:bg-purple-100'
                  }`}
              >
                {tab.emoji} {tab.name}
              </button>
            ))}
          </div>

          {/* Seeds Tab */}
          {shopTab === 'seeds' && (
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4">
                <h3 className="text-lg font-bold text-purple-800 mb-3">Choose Soil Type:</h3>
                <div className="grid grid-cols-4 gap-3">
                  {Object.values(soilTypes).map(soil => (
                    <button
                      key={soil.id}
                      onClick={() => setSelectedSoilType(soil.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${selectedSoilType === soil.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-purple-300'
                        }`}
                    >
                      <div className="text-2xl mb-1">{soil.emoji}</div>
                      <div className="text-sm font-medium">{soil.name}</div>
                      <div className="text-xs text-gray-600">{soil.specialEffect}</div>
                      <div className="text-xs font-bold text-purple-600">+{soil.cost} gems</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(sampleVocabulary).map(([category, words]) => {
                  const totalCost = 5 + (soilTypes[selectedSoilType]?.cost || 0);
                  const canAfford = playerStats.gems >= totalCost;
                  const alreadyPlanted = plants.some(p => p.vocabCategory === category);

                  return (
                    <motion.div
                      key={category}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                      whileHover={{ scale: canAfford && !alreadyPlanted ? 1.02 : 1.0 }}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-4">🌱</div>
                        <h3 className="text-xl font-bold text-purple-800 mb-2">{category} Seeds</h3>
                        <p className="text-purple-600 mb-2">
                          {words.length} vocabulary words
                        </p>
                        <div className="text-sm text-gray-600 mb-4">
                          Difficulties: {words.filter(w => w.difficulty === 'easy').length} easy, {' '}
                          {words.filter(w => w.difficulty === 'medium').length} medium, {' '}
                          {words.filter(w => w.difficulty === 'hard').length} hard
                        </div>
                        <div className="text-sm font-medium text-purple-700 mb-4">
                          Total Cost: {totalCost} gems
                          <br />
                          <span className="text-xs">
                            (5 seed + {soilTypes[selectedSoilType]?.cost || 0} soil)
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (canAfford && !alreadyPlanted) {
                              const nextPosition = {
                                row: Math.floor(plants.length / 3) + 1,
                                col: (plants.length % 3) + 1
                              };
                              plantSeed(category, nextPosition, selectedSoilType);
                              setGameState('garden');
                            }
                          }}
                          disabled={!canAfford || alreadyPlanted}
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                          {alreadyPlanted
                            ? 'Already Planted'
                            : canAfford
                              ? `Plant with ${soilTypes[selectedSoilType]?.name}`
                              : 'Not enough gems'
                          }
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Soil Tab */}
          {shopTab === 'soil' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(soilTypes).map(soil => (
                <motion.div
                  key={soil.id}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-center">
                    <div className="text-6xl mb-4">{soil.emoji}</div>
                    <h3 className="text-xl font-bold text-purple-800 mb-2">{soil.name}</h3>
                    <p className="text-purple-600 mb-4">{soil.specialEffect}</p>
                    <div className="text-lg font-bold text-green-600 mb-4">
                      Growth Multiplier: {soil.growthMultiplier}x
                    </div>
                    <div className="text-sm text-gray-600">
                      {soil.cost === 0 ? 'Free with any seed' : `+${soil.cost} gems per plant`}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Tools & Classes Tab */}
          {shopTab === 'tools' && (
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4">Your Gardener Class</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.values(gardenerClasses).map(cls => (
                    <motion.div
                      key={cls.id}
                      className={`p-4 rounded-xl border-2 transition-all ${playerStats.gardenerClass === cls.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-white'
                        }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{cls.emoji}</div>
                        <h4 className="font-bold text-purple-800 mb-2">{cls.name}</h4>
                        <p className="text-sm text-purple-600 mb-3">{cls.description}</p>
                        <div className="text-xs space-y-1">
                          <div>Learning: {Math.round(cls.bonuses.learningSpeed * 100)}%</div>
                          <div>Growth: {Math.round(cls.bonuses.plantGrowth * 100)}%</div>
                          <div>Gems: {Math.round(cls.bonuses.gemGeneration * 100)}%</div>
                        </div>
                        {playerStats.gardenerClass === cls.id && (
                          <div className="mt-2 text-xs text-green-600 font-medium">
                            ✓ Current Class
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4">Skills (Available Points: {playerStats.skillPoints})</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {Object.entries(playerStats.skills).map(([skill, level]) => (
                    <div key={skill} className="bg-white rounded-lg p-4 text-center">
                      <h4 className="font-medium text-gray-800 mb-2 capitalize">{skill}</h4>
                      <div className="text-2xl font-bold text-purple-600 mb-2">{level}</div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full mx-0.5 ${i <= level ? 'bg-purple-500' : 'bg-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          if (playerStats.skillPoints > 0 && level < 5) {
                            setPlayerStats((prev: GardenerStats) => ({
                              ...prev,
                              skillPoints: prev.skillPoints - 1,
                              skills: {
                                ...prev.skills,
                                [skill]: level + 1
                              }
                            }));
                          }
                        }}
                        disabled={playerStats.skillPoints === 0 || level >= 5}
                        className="px-3 py-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white text-xs rounded disabled:cursor-not-allowed"
                      >
                        +1 Skill
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  switch (gameState) {
    case 'challenge':
      return renderChallenge();
    case 'shop':
      return renderShop();
    default:
      return renderGarden();
  }
}

export default LanguageGarden;

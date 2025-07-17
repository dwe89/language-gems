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
}

interface Plant {
  id: string;
  vocabCategory: string;
  vocabWords: VocabularyItem[];
  stage: 'seed' | 'sprout' | 'bloom' | 'tree';
  correctAnswers: number;
  requiredAnswers: number;
  lastWatered: Date;
  position: { row: number; col: number };
  isWilting: boolean;
}

interface PlayerStats {
  level: number;
  xp: number;
  gems: number;
  plantsGrown: number;
  totalCorrectAnswers: number;
  streak: number;
  highestStreak: number;
}

// =====================================================
// SAMPLE DATA
// =====================================================

const sampleVocabulary: { [category: string]: VocabularyItem[] } = {
  Food: [
    { id: "1", originalText: "apple", translatedText: "manzana", difficulty: "easy", category: "Food" },
    { id: "2", originalText: "bread", translatedText: "pan", difficulty: "easy", category: "Food" },
    { id: "3", originalText: "chicken", translatedText: "pollo", difficulty: "easy", category: "Food" },
    { id: "4", originalText: "restaurant", translatedText: "restaurante", difficulty: "medium", category: "Food" },
  ],
  Travel: [
    { id: "5", originalText: "airport", translatedText: "aeropuerto", difficulty: "medium", category: "Travel" },
    { id: "6", originalText: "hotel", translatedText: "hotel", difficulty: "easy", category: "Travel" },
    { id: "7", originalText: "passport", translatedText: "pasaporte", difficulty: "medium", category: "Travel" },
    { id: "8", originalText: "vacation", translatedText: "vacaciones", difficulty: "medium", category: "Travel" },
  ],
  Animals: [
    { id: "9", originalText: "cat", translatedText: "gato", difficulty: "easy", category: "Animals" },
    { id: "10", originalText: "dog", translatedText: "perro", difficulty: "easy", category: "Animals" },
    { id: "11", originalText: "elephant", translatedText: "elefante", difficulty: "medium", category: "Animals" },
    { id: "12", originalText: "butterfly", translatedText: "mariposa", difficulty: "hard", category: "Animals" },
  ]
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function LanguageGarden() {
  const router = useRouter();
  
  // Game state
  const [gameState, setGameState] = useState<'garden' | 'challenge' | 'shop'>('garden');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [currentVocabItem, setCurrentVocabItem] = useState<VocabularyItem | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState<{ type: 'correct' | 'incorrect' | null; message: string }>({ type: null, message: '' });
  
  // Player stats
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    xp: 0,
    gems: 25,
    plantsGrown: 0,
    totalCorrectAnswers: 0,
    streak: 0,
    highestStreak: 0
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // =====================================================
  // INITIALIZATION
  // =====================================================

  useEffect(() => {
    // Start with one sample plant
    if (plants.length === 0) {
      plantSeed('Food', { row: 1, col: 1 });
    }
  }, []);

  // =====================================================
  // PLANT MANAGEMENT
  // =====================================================

  const getStageRequirements = (stage: Plant['stage']): number => {
    switch (stage) {
      case 'seed': return 3;
      case 'sprout': return 8;
      case 'bloom': return 15;
      case 'tree': return 25;
      default: return 0;
    }
  };

  const plantSeed = (category: string, position: { row: number; col: number }) => {
    const vocabWords = sampleVocabulary[category] || [];
    if (vocabWords.length === 0) return;

    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      vocabCategory: category,
      vocabWords,
      stage: 'seed',
      correctAnswers: 0,
      requiredAnswers: getStageRequirements('seed'),
      lastWatered: new Date(),
      position,
      isWilting: false
    };

    setPlants(prev => [...prev, newPlant]);
    setPlayerStats(prev => ({ ...prev, gems: prev.gems - 5 })); // Cost to plant
  };

  const waterPlant = (plant: Plant) => {
    setSelectedPlant(plant);
    setCurrentQuestionIndex(0);
    loadNextQuestion(plant);
    setGameState('challenge');
  };

  const loadNextQuestion = (plant: Plant) => {
    if (plant.vocabWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * plant.vocabWords.length);
      setCurrentVocabItem(plant.vocabWords[randomIndex]);
      setUserAnswer('');
      setShowFeedback({ type: null, message: '' });
      
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // =====================================================
  // CHALLENGE LOGIC
  // =====================================================

  const handleAnswerSubmit = () => {
    if (!currentVocabItem || !selectedPlant || userAnswer.trim() === '') return;

    const correctAnswer = currentVocabItem.translatedText.toLowerCase();
    const userAnswerLower = userAnswer.trim().toLowerCase();
    const isCorrect = userAnswerLower === correctAnswer;

    if (isCorrect) {
      // Correct answer
      setShowFeedback({
        type: 'correct',
        message: '🌱 Perfect! Your plant is growing!'
      });

      // Update plant
      setPlants(prev => prev.map(p => {
        if (p.id === selectedPlant.id) {
          const newCorrectAnswers = p.correctAnswers + 1;
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
            }
          }

          return {
            ...p,
            correctAnswers: newCorrectAnswers,
            stage: newStage,
            requiredAnswers: newRequiredAnswers,
            lastWatered: new Date(),
            isWilting: false
          };
        }
        return p;
      }));

      // Update player stats
      setPlayerStats(prev => ({
        ...prev,
        totalCorrectAnswers: prev.totalCorrectAnswers + 1,
        streak: prev.streak + 1,
        highestStreak: Math.max(prev.highestStreak, prev.streak + 1),
        xp: prev.xp + 10,
        level: Math.floor((prev.xp + 10) / 100) + 1
      }));

    } else {
      // Incorrect answer
      setShowFeedback({
        type: 'incorrect',
        message: `Not quite! The correct answer is "${currentVocabItem.translatedText}"`
      });

      // Reset streak
      setPlayerStats(prev => ({
        ...prev,
        streak: 0
      }));
    }

    // Continue to next question or return to garden
    setTimeout(() => {
      if (selectedPlant && selectedPlant.correctAnswers < selectedPlant.requiredAnswers - 1) {
        loadNextQuestion(selectedPlant);
      } else {
        // Return to garden
        setGameState('garden');
        setSelectedPlant(null);
        setCurrentVocabItem(null);
      }
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
    
    switch (plant.stage) {
      case 'seed': return '🌱';
      case 'sprout': return '🌿';
      case 'bloom': return '🌸';
      case 'tree': return '🌳';
      default: return '🌱';
    }
  };

  const getProgressPercentage = (plant: Plant): number => {
    return Math.min((plant.correctAnswers / plant.requiredAnswers) * 100, 100);
  };

  const renderGarden = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white/70 backdrop-blur-md rounded-xl p-4 shadow-lg">
        <Link href="/games" className="p-2 hover:bg-green-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-green-700" />
        </Link>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="font-bold text-green-800">Level {playerStats.level}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            <span className="font-bold text-green-800">{playerStats.gems} gems</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            <span className="font-bold text-green-800">Streak: {playerStats.streak}</span>
          </div>
        </div>
      </div>

      {/* Garden Grid */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
          🌻 Your Language Garden 🌻
        </h1>
        
        <div className="grid grid-cols-3 gap-6 mb-8">
          {plants.map((plant) => (
            <motion.div
              key={plant.id}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-green-200 hover:border-green-400"
              onClick={() => waterPlant(plant)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{getPlantEmoji(plant)}</div>
                <h3 className="font-bold text-green-800 mb-2">{plant.vocabCategory}</h3>
                <div className="text-sm text-green-600 mb-3">
                  Stage: {plant.stage} • {plant.correctAnswers}/{plant.requiredAnswers}
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-green-100 rounded-full h-2 mb-3">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getProgressPercentage(plant)}%` }}
                  ></div>
                </div>
                
                <button className="flex items-center justify-center space-x-2 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  <Droplets className="h-4 w-4" />
                  <span>Water Plant</span>
                </button>
              </div>
            </motion.div>
          ))}
          
          {/* Add new plant button */}
          {plants.length < 9 && (
            <motion.div
              className="bg-green-100/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-dashed border-green-300 hover:border-green-500 flex items-center justify-center"
              onClick={() => setGameState('shop')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">➕</div>
                <div className="text-green-700 font-medium">Plant New Seed</div>
                <div className="text-sm text-green-600">5 gems</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  const renderChallenge = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {selectedPlant && currentVocabItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            {/* Plant info */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{getPlantEmoji(selectedPlant)}</div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedPlant.vocabCategory} Garden</h2>
              <div className="text-sm text-gray-600">
                Progress: {selectedPlant.correctAnswers}/{selectedPlant.requiredAnswers}
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-gray-800 mb-4">
                {currentVocabItem.originalText}
              </h3>
              <p className="text-gray-600">Translate to Spanish:</p>
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback.type && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`mb-6 p-4 rounded-xl text-center font-medium ${
                    showFeedback.type === 'correct' 
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
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );

  const renderShop = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 bg-white/70 backdrop-blur-md rounded-xl p-4 shadow-lg">
          <button 
            onClick={() => setGameState('garden')}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-purple-700" />
          </button>
          <h1 className="text-2xl font-bold text-purple-800">🛍️ Seed Shop</h1>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            <span className="font-bold text-purple-800">{playerStats.gems} gems</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.keys(sampleVocabulary).map((category) => (
            <motion.div
              key={category}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-purple-800 mb-2">{category} Seeds</h3>
                <p className="text-purple-600 mb-4">
                  {sampleVocabulary[category].length} vocabulary words
                </p>
                <button
                  onClick={() => {
                    if (playerStats.gems >= 5) {
                      const nextPosition = { row: Math.floor(plants.length / 3) + 1, col: (plants.length % 3) + 1 };
                      plantSeed(category, nextPosition);
                      setGameState('garden');
                    }
                  }}
                  disabled={playerStats.gems < 5 || plants.some(p => p.vocabCategory === category)}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {plants.some(p => p.vocabCategory === category) 
                    ? 'Already Planted' 
                    : playerStats.gems >= 5 
                      ? 'Plant for 5 gems' 
                      : 'Not enough gems'
                  }
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

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

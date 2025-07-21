'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Star, 
  CheckCircle2, 
  Zap, 
  Shield,
  Award,
  Settings,
  Home,
  Gem,
  BookOpen
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import CategorySelector from '../../../components/games/CategorySelector';
import { useVocabularyByCategory } from '../../../hooks/useVocabulary';
import { KS3_SPANISH_CATEGORIES, getCategoryById } from '../../../utils/categories';
import { 
  WordItem, 
  PowerUp, 
  GameState, 
  GameSettings, 
  GameStats, 
  FallingGem, 
  GemType 
} from './types';

// Enhanced vocabulary with Spanish translations broken into words
const enhancedVocabulary: WordItem[] = [
  { id: '1', word: 'dog', translation: 'perro', correct: false, points: 10, category: 'noun' },
  { id: '2', word: 'run', translation: 'correr', correct: false, points: 15, category: 'verb' },
  { id: '3', word: 'beautiful', translation: 'hermoso', correct: false, points: 20, category: 'adjective' },
  { id: '4', word: 'quickly', translation: 'rápidamente', correct: false, points: 25, category: 'adverb' },
  { id: '5', word: 'cat', translation: 'gato', correct: false, points: 10, category: 'noun' },
  { id: '6', word: 'house', translation: 'casa', correct: false, points: 10, category: 'noun' },
  { id: '7', word: 'eat', translation: 'comer', correct: false, points: 15, category: 'verb' },
  { id: '8', word: 'happy', translation: 'feliz', correct: false, points: 20, category: 'adjective' },
  { id: '9', word: 'slowly', translation: 'lentamente', correct: false, points: 25, category: 'adverb' },
  { id: '10', word: 'book', translation: 'libro', correct: false, points: 10, category: 'noun' },
];

// Translation challenges with their Spanish word breakdowns
const translationChallenges = [
  {
    english: "I like horror films",
    spanish: "Me gustan las películas de terror",
    words: ["me", "gustan", "las", "películas", "de", "terror"]
  },
  {
    english: "The cat is sleeping",
    spanish: "El gato está durmiendo", 
    words: ["el", "gato", "está", "durmiendo"]
  },
  {
    english: "We eat breakfast",
    spanish: "Comemos el desayuno",
    words: ["comemos", "el", "desayuno"]
  },
  {
    english: "She runs very fast",
    spanish: "Ella corre muy rápido",
    words: ["ella", "corre", "muy", "rápido"]
  },
  {
    english: "The book is interesting",
    spanish: "El libro es interesante",
    words: ["el", "libro", "es", "interesante"]
  },
  {
    english: "They are watching a scary movie",
    spanish: "Están viendo una película de miedo",
    words: ["están", "viendo", "una", "película", "de", "miedo"]
  },
  {
    english: "My friends are tall",
    spanish: "Mis amigos son altos",
    words: ["mis", "amigos", "son", "altos"]
  },
  {
    english: "The dog drinks water",
    spanish: "El perro bebe agua",
    words: ["el", "perro", "bebe", "agua"]
  }
];

// Smart decoy words that are grammatically challenging
const getSmartDecoys = (correctWords: string[]) => {
  const baseDecoys = [
    "perro", "casa", "agua", "comida", "mesa", "silla", "verde", "azul", "rojo",
    "grande", "pequeño", "nuevo", "viejo", "bueno", "malo", "alto", "bajo",
    "caminar", "hablar", "escuchar", "mirar", "jugar", "trabajar", "estudiar",
    "hoy", "mañana", "ayer", "siempre", "nunca", "aquí", "allí", "donde",
    "cuando", "como", "porque", "pero", "y", "o", "si", "no"
  ];
  
  // Add challenging grammatical variations based on correct words
  const smartDecoys = [...baseDecoys];
  
  correctWords.forEach(word => {
    switch (word) {
      case "gustan":
        smartDecoys.push("gusta"); // singular vs plural
        break;
      case "están":
        smartDecoys.push("es", "son", "estoy"); // different forms of "to be"
        break;
      case "viendo":
        smartDecoys.push("vemos", "ver", "veo"); // different verb forms
        break;
      case "una":
        smartDecoys.push("un", "uno"); // gender variations
        break;
      case "película":
        smartDecoys.push("películas"); // singular vs plural
        break;
      case "el":
        smartDecoys.push("la", "los", "las"); // article variations
        break;
      case "gato":
        smartDecoys.push("gata", "gatos"); // gender/number variations
        break;
      case "amigos":
        smartDecoys.push("amigo", "amigas"); // gender/number variations
        break;
      case "son":
        smartDecoys.push("es", "están", "somos"); // different forms of "to be"
        break;
      case "altos":
        smartDecoys.push("alto", "alta", "altas"); // gender/number variations
        break;
      case "mis":
        smartDecoys.push("mi", "tu", "sus"); // possessive variations
        break;
      case "bebe":
        smartDecoys.push("beber", "bebemos", "bebes"); // verb variations
        break;
      case "perro":
        smartDecoys.push("perra", "perros"); // gender/number variations
        break;
    }
  });
  
  return smartDecoys.filter(decoy => !correctWords.includes(decoy.toLowerCase()));
};

// Interactive Gem Game Component
interface InteractiveGemGameProps {
  currentChallenge: typeof translationChallenges[0];
  onCorrectAnswer: (points: number) => void;
  onIncorrectAnswer: () => void;
  onChallengeComplete: () => void;
  isPaused: boolean;
}

const InteractiveGemGame: React.FC<InteractiveGemGameProps> = ({
  currentChallenge,
  onCorrectAnswer,
  onIncorrectAnswer,
  onChallengeComplete,
  isPaused
}) => {
  const [fallingGems, setFallingGems] = useState<Array<{
    id: string;
    word: string;
    isCorrect: boolean;
    gemType: GemType;
    position: { x: number; y: number };
  }>>([]);
  
  const [collectedWords, setCollectedWords] = useState<string[]>([]);
  const [nextGemId, setNextGemId] = useState(0);
  const [challengeStartTime, setChallengeStartTime] = useState<number>(Date.now());
  const [gemSpeed, setGemSpeed] = useState(8); // Initial fall duration in seconds
  
  // Get random gem type for visual variety
  const getRandomGemType = (): GemType => {
    const types: GemType[] = ['ruby', 'sapphire', 'emerald', 'amethyst', 'diamond', 'topaz'];
    return types[Math.floor(Math.random() * types.length)];
  };
  
  // Check if challenge is complete
  useEffect(() => {
    const allCorrectWords = currentChallenge.words;
    const hasAllWords = allCorrectWords.every(word => 
      collectedWords.includes(word.toLowerCase())
    );
    
    if (hasAllWords && collectedWords.length > 0) {
      // Calculate completion time and speed bonus
      const completionTime = (Date.now() - challengeStartTime) / 1000;
      const speedBonus = completionTime < 10 ? 50 : completionTime < 20 ? 25 : 0;
      
      setTimeout(() => {
        onChallengeComplete();
        setCollectedWords([]);
        setChallengeStartTime(Date.now());
        // Increase difficulty - gems fall faster
        setGemSpeed(prev => Math.max(4, prev - 0.2));
      }, 1000);
    }
  }, [collectedWords, currentChallenge.words, onChallengeComplete, challengeStartTime]);
  
  // Generate falling gems
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      // Mix correct words from translation with decoy words
      const correctWords = currentChallenge.words;
      const availableDecoys = getSmartDecoys(correctWords);
      
      // 40% chance of correct word, 60% chance of decoy
      let selectedWord: string;
      let isCorrect: boolean;
      
      if (Math.random() < 0.4 && correctWords.length > 0) {
        // Select a correct word that hasn't been collected yet
        const unCollectedCorrect = correctWords.filter(word => 
          !collectedWords.includes(word.toLowerCase())
        );
        
        if (unCollectedCorrect.length > 0) {
          selectedWord = unCollectedCorrect[Math.floor(Math.random() * unCollectedCorrect.length)];
          isCorrect = true;
        } else {
          // All correct words collected, use decoy
          selectedWord = availableDecoys[Math.floor(Math.random() * availableDecoys.length)];
          isCorrect = false;
        }
      } else {
        // Select random decoy word
        selectedWord = availableDecoys[Math.floor(Math.random() * availableDecoys.length)];
        isCorrect = false;
      }
      
      const newGem = {
        id: `gem-${nextGemId}`,
        word: selectedWord,
        isCorrect,
        gemType: getRandomGemType(),
        position: { 
          x: Math.random() * 80 + 10, // 10-90% from left
          y: -10 // Start above screen
        }
      };
      
      setFallingGems(prev => [...prev, newGem]);
      setNextGemId(prev => prev + 1);
      
      // Remove gem after falling
      setTimeout(() => {
        setFallingGems(prev => prev.filter(gem => gem.id !== newGem.id));
      }, 8000);
    }, 1500); // Spawn gems every 1.5 seconds
    
    return () => clearInterval(interval);
  }, [currentChallenge, isPaused, nextGemId, collectedWords]);
  
  // Handle gem click
  const handleGemClick = (gem: typeof fallingGems[0]) => {
    const isActuallyCorrect = currentChallenge.words.includes(gem.word.toLowerCase());
    
    if (isActuallyCorrect && !collectedWords.includes(gem.word.toLowerCase())) {
      // Correct word clicked
      setCollectedWords(prev => [...prev, gem.word.toLowerCase()]);
      onCorrectAnswer(20);
    } else {
      // Wrong word clicked or word already collected
      onIncorrectAnswer();
    }
    
    // Remove clicked gem
    setFallingGems(prev => prev.filter(g => g.id !== gem.id));
  };
  
  const gemColors = {
    ruby: 'from-red-500 to-red-700 border-red-400',
    sapphire: 'from-blue-500 to-blue-700 border-blue-400',
    emerald: 'from-green-500 to-green-700 border-green-400',
    diamond: 'from-white to-gray-200 border-gray-300',
    amethyst: 'from-purple-500 to-purple-700 border-purple-400',
    topaz: 'from-yellow-500 to-yellow-700 border-yellow-400'
  };
  
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 overflow-hidden">
      {/* Crystal cavern background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-purple-900/30 to-blue-900/30" />
      
      {/* Falling Gems */}
      {fallingGems.map((gem) => (
        <motion.div
          key={gem.id}
          initial={{ y: -100 }}
          animate={{ y: window.innerHeight + 100 }}
          transition={{ duration: gemSpeed, ease: "linear" }}
          className="absolute cursor-pointer"
          style={{ 
            left: `${gem.position.x}%`,
            top: `${gem.position.y}%`
          }}
          onClick={() => handleGemClick(gem)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Gem Shape */}
          <div className={`
            w-20 h-20 relative transform rotate-45 rounded-lg
            bg-gradient-to-br ${gemColors[gem.gemType]}
            border-2 shadow-lg hover:shadow-xl
            transition-all duration-200
          `}>
            {/* Sparkle effect */}
            <div className="absolute inset-2 bg-white/30 rounded-sm transform -rotate-45" />
            <div className="absolute top-1 left-3 w-2 h-2 bg-white/60 rounded-full" />
            <div className="absolute bottom-2 right-1 w-1 h-1 bg-white/40 rounded-full" />
          </div>
          
          {/* Spanish Word Text */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-slate-900/90 rounded-lg px-2 py-1 text-white text-xs font-bold whitespace-nowrap">
              {gem.word}
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Progress Display */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <p className="text-white text-sm mb-3">
            Translate: <span className="font-bold text-orange-400">"{currentChallenge.english}"</span>
          </p>
          <p className="text-slate-300 text-xs mb-3">
            Click the correct Spanish words to form the translation
          </p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs text-slate-400">Progress:</span>
            <div className="flex gap-1">
              {currentChallenge.words.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index < collectedWords.length
                      ? 'bg-green-500'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400">
              {collectedWords.length}/{currentChallenge.words.length}
            </span>
          </div>
          
          {/* Collected Words (without revealing the full answer) */}
          {collectedWords.length > 0 && (
            <div className="text-xs text-green-400">
              Collected: {collectedWords.join(" • ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function GemWordBlastGame() {
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 60,
    survivalMode: false,
    powerUpsEnabled: true,
    vocabularyId: null,
    difficulty: 'medium',
    gemSpeed: 100,
    maxGems: 8,
    comboMultiplier: 1.5
  });
  
  const [currentChallenge, setCurrentChallenge] = useState(translationChallenges[0]);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    maxCombo: 0,
    gemsCollected: 0,
    gemsMissed: 0,
    accuracy: 0,
    fastestResponse: Infinity,
    totalPlayTime: 0,
    gemsByType: {
      ruby: 0,
      sapphire: 0,
      emerald: 0,
      diamond: 0,
      amethyst: 0,
      topaz: 0
    }
  });
  
  // Category selection state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  
  // Use category-based vocabulary when categories are selected
  const { 
    vocabulary: categoryVocabulary, 
    loading: categoryLoading, 
    error: categoryError 
  } = useVocabularyByCategory({
    language: 'spanish',
    categoryId: selectedCategory || undefined,
    subcategoryId: selectedSubcategory || undefined
  });
  
  const [timeLeft, setTimeLeft] = useState(gameSettings.timeLimit);
  const [lives, setLives] = useState(3);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Generate challenges from vocabulary
  const generateVocabularyChallenge = (vocabulary: any[]) => {
    if (!vocabulary || vocabulary.length === 0) return null;
    
    // Select 3-5 random words for this challenge
    const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
    const selectedWords = shuffled.slice(0, Math.min(4, vocabulary.length));
    
    return {
      english: `Collect the Spanish words: ${selectedWords.map(w => w.translation).join(', ')}`,
      spanish: selectedWords.map(w => w.word).join(' '),
      words: selectedWords.map(w => w.word.toLowerCase())
    };
  };

  // Update currentChallenge when vocabulary changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== '' && categoryVocabulary && categoryVocabulary.length > 0) {
      const newChallenge = generateVocabularyChallenge(categoryVocabulary);
      if (newChallenge) {
        setCurrentChallenge(newChallenge);
      }
    }
  }, [selectedCategory, selectedSubcategory, categoryVocabulary]);
  const [isClient, setIsClient] = useState(false);
  const [backgroundParticles, setBackgroundParticles] = useState<Array<{
    id: number;
    left: string;
    top: string;
    animationDuration: number;
  }>>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
    
    // Generate background particles only on client
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: Math.random() * 10 + 5,
    }));
    
    setBackgroundParticles(particles);
  }, []);
  
  // Initialize game
  useEffect(() => {
    const assignmentIdParam = searchParams?.get('assignment');
    if (assignmentIdParam) {
      setAssignmentId(assignmentIdParam);
    }
    
    setCurrentChallenge(translationChallenges[Math.floor(Math.random() * translationChallenges.length)]);
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [searchParams]);
  
  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeUp();
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
  }, [gameState, isPaused]);
  
  // Check for game over when lives reach 0
  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') {
      handleTimeUp();
    }
  }, [lives, gameState]);
  
  // Start the game
  const startGame = () => {
    setGameState('playing');
    setGameStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      gemsCollected: 0,
      gemsMissed: 0,
      accuracy: 0,
      fastestResponse: Infinity,
      totalPlayTime: 0,
      gemsByType: {
        ruby: 0,
        sapphire: 0,
        emerald: 0,
        diamond: 0,
        amethyst: 0,
        topaz: 0
      }
    });
    setLives(3);
    setTimeLeft(gameSettings.timeLimit);
    setCurrentChallenge(translationChallenges[Math.floor(Math.random() * translationChallenges.length)]);
    setIsPaused(false);
  };
  
  // Handle time up
  const handleTimeUp = () => {
    if (gameState === 'playing') {
      setGameState('timeout');
      if (gameStats.score > 0) {
        triggerConfetti();
      }
    }
  };
  
  // Pause/Resume game
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState('ready');
    setGameStats({
      score: 0,
      combo: 0,
      maxCombo: 0,
      gemsCollected: 0,
      gemsMissed: 0,
      accuracy: 0,
      fastestResponse: Infinity,
      totalPlayTime: 0,
      gemsByType: {
        ruby: 0,
        sapphire: 0,
        emerald: 0,
        diamond: 0,
        amethyst: 0,
        topaz: 0
      }
    });
    setLives(3);
    setTimeLeft(gameSettings.timeLimit);
    setIsPaused(false);
    setCurrentChallenge(translationChallenges[Math.floor(Math.random() * translationChallenges.length)]);
  };
  
  // Handle challenge completion
  const handleChallengeComplete = () => {
    // Bonus points for completing the challenge
    setGameStats(prev => ({
      ...prev,
      score: prev.score + 100,
      combo: prev.combo + 3
    }));
    
    triggerSuccessEffects();
    
    // Move to next challenge
    setTimeout(() => {
      setCurrentChallenge(translationChallenges[Math.floor(Math.random() * translationChallenges.length)]);
    }, 1500);
  };
  
  // Success effects
  const triggerSuccessEffects = () => {
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1']
    });
  };
  
  // Completion confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#98FB98']
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated background particles - only render on client */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden">
          {backgroundParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              animate={{
                x: [0, 100],
                y: [0, 100],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: particle.animationDuration,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: particle.left,
                top: particle.top
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-20 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Gem className="text-orange-500 w-8 h-8" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Gem Word Blast
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {gameState === 'playing' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePause}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  {isPaused ? <Play size={20} className="text-white" /> : <Pause size={20} className="text-white" />}
                </motion.button>
              )}
              
              <Link
                href={assignmentId ? `/dashboard/assignments/${assignmentId}` : '/games'}
                className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Home size={20} />
                <span>{assignmentId ? 'Back to Assignment' : 'Back to Games'}</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Category Selection */}
        {gameState === 'ready' && (
          <div className="absolute top-20 left-0 right-0 z-10 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-white">Choose Topics</h3>
                  {selectedCategory && selectedCategory !== '' && (
                    <div className="flex items-center space-x-3 px-3 py-1 bg-orange-500/20 rounded-lg border border-orange-500/30">
                      <span className="text-sm font-medium text-orange-200">
                        {getCategoryById(selectedCategory)?.name || selectedCategory}
                      </span>
                      {selectedSubcategory && selectedSubcategory !== '' && (
                        <>
                          <span className="text-orange-400">→</span>
                          <span className="text-sm text-orange-300">{selectedSubcategory}</span>
                        </>
                      )}
                      <div className="text-xs text-orange-300 bg-orange-500/20 px-2 py-0.5 rounded-full">
                        {categoryLoading ? 'Loading...' : `${categoryVocabulary?.length || 0} words`}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowCategorySelector(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Select Topics</span>
                  </button>
                  
                  {selectedCategory && selectedCategory !== '' && (
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setSelectedSubcategory('');
                      }}
                      className="px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Game Area */}
        <div className={`h-screen ${gameState === 'ready' ? 'pt-32' : 'pt-20'}`}>
          {gameState === 'ready' && (
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-2xl mx-auto px-6"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-8"
                >
                  <Gem className="w-24 h-24 text-orange-500 mx-auto" />
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white mb-4">
                  Ready for Gem Word Blast?
                </h2>
                
                <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                  Translate English sentences by clicking the correct Spanish words! 
                  Falling gems show Spanish words - click only the ones needed for the translation.
                </p>
                
                <div className="bg-slate-800/50 rounded-xl p-4 mb-8 border border-slate-700">
                  <h3 className="text-lg font-bold text-orange-400 mb-2">How to Play:</h3>
                  <div className="text-left text-slate-300 space-y-1">
                    <p>• Read the English sentence at the top</p>
                    <p>• Click Spanish word gems that form the translation</p>
                    <p>• Avoid decoy words that aren't part of the translation</p>
                    <p>• Complete the translation to get bonus points!</p>
                    <p>• You have 3 lives - wrong clicks cost a life</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                  className="mt-8 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                >
                  <Play className="inline mr-2" size={24} />
                  Start Gem Blast
                </motion.button>
              </motion.div>
            </div>
          )}
          
          {gameState === 'playing' && (
            <div className="relative h-full">
              {/* Interactive Gem Game */}
              <InteractiveGemGame 
                currentChallenge={currentChallenge}
                onCorrectAnswer={(points) => {
                  setGameStats(prev => ({
                    ...prev,
                    score: prev.score + points,
                    combo: prev.combo + 1,
                    maxCombo: Math.max(prev.maxCombo, prev.combo + 1),
                    gemsCollected: prev.gemsCollected + 1
                  }));
                  triggerSuccessEffects();
                }}
                onIncorrectAnswer={() => {
                  setGameStats(prev => ({ ...prev, combo: 0, gemsMissed: prev.gemsMissed + 1 }));
                  setLives(prev => Math.max(0, prev - 1));
                }}
                onChallengeComplete={handleChallengeComplete}
                isPaused={isPaused}
              />
              
              {/* Game UI Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {/* Top Bar */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  {/* Current Sentence */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 max-w-md pointer-events-auto"
                  >
                    <div className="text-sm text-slate-400 mb-1">Translate:</div>
                    <div className="text-xl font-bold text-white">{currentChallenge.english}</div>
                  </motion.div>

                  {/* Stats */}
                  <div className="flex flex-col items-end space-y-3">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30 flex items-center space-x-2"
                    >
                      <Star className="text-yellow-500" size={20} />
                      <span className="text-2xl font-bold text-white">{gameStats.score.toLocaleString()}</span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-3 border border-blue-500/30 flex items-center space-x-2"
                    >
                      <span className="text-lg font-bold text-white">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </motion.div>
                    
                    {/* Combo Display */}
                    {gameStats.combo > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-3 border border-orange-500/30 flex items-center space-x-2"
                      >
                        <Zap className="text-orange-500" size={20} />
                        <span className="text-lg font-bold text-white">{gameStats.combo}x</span>
                      </motion.div>
                    )}
                    
                    {/* Lives */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/20 backdrop-blur-sm rounded-xl p-3 border border-red-500/30 flex items-center space-x-2"
                    >
                      <span className="text-lg font-bold text-white">♥ {lives}</span>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Pause Overlay */}
              <AnimatePresence>
                {isPaused && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30"
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="bg-slate-900 rounded-xl p-8 text-center border border-slate-700"
                    >
                      <Pause className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-4">Game Paused</h3>
                      <button
                        onClick={togglePause}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Resume Game
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Game Over States */}
          {(gameState === 'timeout' || gameState === 'completed') && (
            <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-2xl mx-auto px-6"
              >
                {gameState === 'completed' ? (
                  <CheckCircle2 className="text-green-500 w-24 h-24 mx-auto mb-6" />
                ) : (
                  <Award className="text-orange-500 w-24 h-24 mx-auto mb-6" />
                )}
                
                <h2 className="text-4xl font-bold text-white mb-4">
                  {gameState === 'completed' ? 'All Gems Collected!' : 'Time\'s Up!'}
                </h2>
                
                <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-yellow-500">
                        {gameStats.score.toLocaleString()}
                      </div>
                      <div className="text-slate-400">Score</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-orange-500">
                        {gameStats.maxCombo}x
                      </div>
                      <div className="text-slate-400">Max Combo</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-500">
                        {gameStats.accuracy.toFixed(1)}%
                      </div>
                      <div className="text-slate-400">Accuracy</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-500">
                        {gameStats.gemsCollected}
                      </div>
                      <div className="text-slate-400">Gems</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetGame}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center"
                  >
                    <RefreshCw className="mr-2" size={18} />
                    Play Again
                  </motion.button>
                  
                  <Link 
                    href={assignmentId ? `/dashboard/assignments/${assignmentId}` : '/games'}
                    className="px-6 py-3 border border-indigo-600 text-indigo-300 rounded-lg font-medium hover:bg-indigo-950/50 transition-colors flex items-center justify-center"
                  >
                    <Home className="mr-2" size={18} />
                    {assignmentId ? 'Back to Assignment' : 'Back to Games'}
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



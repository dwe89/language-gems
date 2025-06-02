'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface WordAssociationGameProps {
  difficulty: string;
  category: string;
  language: string;
  customWords?: string;
  onBackToMenu: () => void;
  onGameComplete: (score: number) => void;
}

// Word pairs by category with related and unrelated words
// In a real app, this would be much more extensive and possibly fetched from an API
const WORD_ASSOCIATIONS = {
  general: {
    english: [
      {
        prompt: 'water',
        related: ['ocean', 'river', 'lake', 'swim', 'liquid', 'drink'],
        unrelated: ['fire', 'desert', 'computer', 'book', 'telephone', 'pizza']
      },
      {
        prompt: 'book',
        related: ['read', 'library', 'author', 'page', 'story', 'novel'],
        unrelated: ['swim', 'drive', 'mountain', 'dinner', 'cloud', 'dance']
      },
      {
        prompt: 'car',
        related: ['drive', 'road', 'wheel', 'vehicle', 'journey', 'travel'],
        unrelated: ['swim', 'flower', 'pencil', 'rainbow', 'bread', 'melody']
      },
      {
        prompt: 'house',
        related: ['home', 'roof', 'door', 'room', 'family', 'building'],
        unrelated: ['ocean', 'sky', 'pencil', 'banana', 'concert', 'dolphin']
      },
      {
        prompt: 'food',
        related: ['eat', 'cook', 'restaurant', 'kitchen', 'meal', 'hungry'],
        unrelated: ['telephone', 'mountain', 'bicycle', 'pencil', 'radio', 'planet']
      }
    ],
    spanish: [
      {
        prompt: 'agua',
        related: ['océano', 'río', 'lago', 'nadar', 'líquido', 'beber'],
        unrelated: ['fuego', 'desierto', 'computadora', 'libro', 'teléfono', 'pizza']
      },
      {
        prompt: 'libro',
        related: ['leer', 'biblioteca', 'autor', 'página', 'historia', 'novela'],
        unrelated: ['nadar', 'conducir', 'montaña', 'cena', 'nube', 'bailar']
      },
      {
        prompt: 'coche',
        related: ['conducir', 'carretera', 'rueda', 'vehículo', 'viaje', 'viajar'],
        unrelated: ['nadar', 'flor', 'lápiz', 'arcoíris', 'pan', 'melodía']
      },
      {
        prompt: 'casa',
        related: ['hogar', 'techo', 'puerta', 'habitación', 'familia', 'edificio'],
        unrelated: ['océano', 'cielo', 'lápiz', 'plátano', 'concierto', 'delfín']
      },
      {
        prompt: 'comida',
        related: ['comer', 'cocinar', 'restaurante', 'cocina', 'comida', 'hambriento'],
        unrelated: ['teléfono', 'montaña', 'bicicleta', 'lápiz', 'radio', 'planeta']
      }
    ],
    french: [
      {
        prompt: 'eau',
        related: ['océan', 'rivière', 'lac', 'nager', 'liquide', 'boire'],
        unrelated: ['feu', 'désert', 'ordinateur', 'livre', 'téléphone', 'pizza']
      },
      {
        prompt: 'livre',
        related: ['lire', 'bibliothèque', 'auteur', 'page', 'histoire', 'roman'],
        unrelated: ['nager', 'conduire', 'montagne', 'dîner', 'nuage', 'danser']
      },
      {
        prompt: 'voiture',
        related: ['conduire', 'route', 'roue', 'véhicule', 'voyage', 'voyager'],
        unrelated: ['nager', 'fleur', 'crayon', 'arc-en-ciel', 'pain', 'mélodie']
      },
      {
        prompt: 'maison',
        related: ['foyer', 'toit', 'porte', 'pièce', 'famille', 'bâtiment'],
        unrelated: ['océan', 'ciel', 'crayon', 'banane', 'concert', 'dauphin']
      },
      {
        prompt: 'nourriture',
        related: ['manger', 'cuisiner', 'restaurant', 'cuisine', 'repas', 'faim'],
        unrelated: ['téléphone', 'montagne', 'bicyclette', 'crayon', 'radio', 'planète']
      }
    ]
  },
  academic: {
    english: [
      {
        prompt: 'research',
        related: ['study', 'investigate', 'discover', 'science', 'analysis', 'data'],
        unrelated: ['dance', 'beach', 'cake', 'mountain', 'song', 'soccer']
      },
      {
        prompt: 'university',
        related: ['college', 'professor', 'student', 'degree', 'campus', 'education'],
        unrelated: ['kitchen', 'garden', 'movie', 'airplane', 'dinosaur', 'recipe']
      },
      {
        prompt: 'thesis',
        related: ['dissertation', 'research', 'academic', 'professor', 'argument', 'study'],
        unrelated: ['beach', 'concert', 'garden', 'bicycle', 'pizza', 'movie']
      },
      {
        prompt: 'mathematics',
        related: ['numbers', 'algebra', 'geometry', 'calculation', 'equation', 'statistics'],
        unrelated: ['poetry', 'hiking', 'garden', 'recipe', 'soccer', 'dance']
      },
      {
        prompt: 'literature',
        related: ['book', 'novel', 'author', 'poetry', 'reading', 'character'],
        unrelated: ['chemistry', 'basketball', 'computer', 'bicycle', 'planet', 'mountain']
      }
    ]
  },
  business: {
    english: [
      {
        prompt: 'marketing',
        related: ['advertisement', 'promotion', 'brand', 'customer', 'sales', 'strategy'],
        unrelated: ['flower', 'mountain', 'bicycle', 'poem', 'painting', 'astronaut']
      },
      {
        prompt: 'finance',
        related: ['money', 'investment', 'budget', 'banking', 'profit', 'account'],
        unrelated: ['bicycle', 'poetry', 'garden', 'painting', 'astronomy', 'recipe']
      },
      {
        prompt: 'meeting',
        related: ['conference', 'discussion', 'agenda', 'presentation', 'collaboration', 'schedule'],
        unrelated: ['swimming', 'poetry', 'dinosaur', 'gardening', 'astronomy', 'cooking']
      },
      {
        prompt: 'management',
        related: ['leadership', 'organization', 'planning', 'strategy', 'supervision', 'administration'],
        unrelated: ['swimming', 'recipe', 'dinosaur', 'poetry', 'gardening', 'planet']
      },
      {
        prompt: 'startup',
        related: ['entrepreneur', 'innovation', 'venture', 'business', 'funding', 'growth'],
        unrelated: ['dinosaur', 'poetry', 'swimming', 'recipe', 'astronomy', 'gardening']
      }
    ]
  },
  technology: {
    english: [
      {
        prompt: 'computer',
        related: ['software', 'hardware', 'programming', 'digital', 'internet', 'technology'],
        unrelated: ['garden', 'cooking', 'poetry', 'painting', 'swimming', 'forest']
      },
      {
        prompt: 'algorithm',
        related: ['programming', 'code', 'software', 'calculation', 'process', 'logic'],
        unrelated: ['poetry', 'cooking', 'garden', 'beach', 'painting', 'dinosaur']
      },
      {
        prompt: 'database',
        related: ['storage', 'information', 'data', 'server', 'query', 'record'],
        unrelated: ['poetry', 'cooking', 'garden', 'swimming', 'dinosaur', 'painting']
      },
      {
        prompt: 'cloud',
        related: ['storage', 'server', 'computing', 'online', 'network', 'service'],
        unrelated: ['kitchen', 'garden', 'poetry', 'dinosaur', 'recipe', 'basketball']
      },
      {
        prompt: 'interface',
        related: ['design', 'user', 'interaction', 'display', 'control', 'navigate'],
        unrelated: ['recipe', 'poetry', 'swimming', 'dinosaur', 'cooking', 'garden']
      }
    ]
  },
  nature: {
    english: [
      {
        prompt: 'forest',
        related: ['trees', 'woods', 'plants', 'wildlife', 'ecosystem', 'vegetation'],
        unrelated: ['computer', 'calculator', 'business', 'factory', 'office', 'smartphone']
      },
      {
        prompt: 'mountain',
        related: ['peak', 'climb', 'range', 'valley', 'hiking', 'altitude'],
        unrelated: ['computer', 'office', 'factory', 'smartphone', 'business', 'algorithm']
      },
      {
        prompt: 'ocean',
        related: ['sea', 'water', 'wave', 'beach', 'marine', 'tide'],
        unrelated: ['desert', 'computer', 'factory', 'office', 'algorithm', 'smartphone']
      },
      {
        prompt: 'climate',
        related: ['weather', 'temperature', 'environment', 'atmosphere', 'conditions', 'seasonal'],
        unrelated: ['computer', 'office', 'algorithm', 'smartphone', 'database', 'calculator']
      },
      {
        prompt: 'wildlife',
        related: ['animals', 'habitat', 'ecosystem', 'species', 'conservation', 'biodiversity'],
        unrelated: ['computer', 'office', 'calculator', 'factory', 'algorithm', 'smartphone']
      }
    ]
  }
};

// Add utility function for array shuffling
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Add memoized word option component
const WordOption = React.memo(({ 
  word, 
  isSelected, 
  onSelect 
}: { 
  word: string; 
  isSelected: boolean; 
  onSelect: (word: string) => void;
}) => {
  return (
    <motion.button
      onClick={() => onSelect(word)}
      className={`word-option ${isSelected ? 'selected' : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {word}
    </motion.button>
  );
});

WordOption.displayName = 'WordOption';

export default function WordAssociationGame({ 
  difficulty, 
  category, 
  language, 
  customWords,
  onBackToMenu, 
  onGameComplete 
}: WordAssociationGameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [promptWord, setPromptWord] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [gamePhase, setGamePhase] = useState<'playing' | 'feedback' | 'complete'>('playing');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [correctRelatedWords, setCorrectRelatedWords] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  const MAX_ROUNDS = 10;
  const ROUND_TIME = 30; // seconds per round

  // Number of related words to find based on difficulty
  const RELATED_WORDS_COUNT = {
    easy: 2,
    medium: 3,
    hard: 4
  };
  
  useEffect(() => {
    // Initialize game
    resetRound();
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (gameContainerRef.current && gameContainerRef.current.requestFullscreen) {
        gameContainerRef.current.requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(err => console.error(err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch(err => console.error(err));
      }
    }
  };

  // Function to handle the fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const getPromptAndOptions = useCallback(() => {
    let wordData;
    
    if (category === 'custom' && customWords) {
      // Handle custom words
      const customWordsList = customWords.split(',').map(word => word.trim());
      if (customWordsList.length < 5) {
        // Not enough custom words, fallback to general category
        wordData = WORD_ASSOCIATIONS.general[language as keyof typeof WORD_ASSOCIATIONS.general] || 
                   WORD_ASSOCIATIONS.general.english;
      } else {
        // Create a random prompt from custom words
        const randomIndex = Math.floor(Math.random() * customWordsList.length);
        const prompt = customWordsList[randomIndex];
        
        // Create related and unrelated words from the remaining words
        const remainingWords = customWordsList.filter((_, index) => index !== randomIndex);
        
        return {
          prompt,
          related: remainingWords.slice(0, 6), // Use first 6 remaining words as related
          unrelated: remainingWords.slice(6)    // Use the rest as unrelated
        };
      }
    } else {
      // Use predefined word associations
      const categoryData = WORD_ASSOCIATIONS[category as keyof typeof WORD_ASSOCIATIONS] || 
                           WORD_ASSOCIATIONS.general;
      
      wordData = categoryData[language as keyof typeof categoryData] || 
                 categoryData.english;
    }
    
    if (!wordData || wordData.length === 0) {
      // Fallback to general English if no data for selected category/language
      wordData = WORD_ASSOCIATIONS.general.english;
    }
    
    // Pick a random prompt
    const randomIndex = Math.floor(Math.random() * wordData.length);
    return wordData[randomIndex];
  }, [category, language, customWords]);

  const resetRound = useCallback(() => {
    const { prompt, related, unrelated } = getPromptAndOptions();
    
    setPromptWord(prompt);
    setCorrectRelatedWords(related);
    setSelectedOptions([]);
    setGamePhase('playing');
    setTimeLeft(ROUND_TIME);
    
    // Select related words based on difficulty
    const relatedWords = [...related]
      .sort(() => Math.random() - 0.5)
      .slice(0, RELATED_WORDS_COUNT[difficulty as keyof typeof RELATED_WORDS_COUNT]);
    
    // Select unrelated words to fill the options
    const unrelatedWords = [...unrelated]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8 - RELATED_WORDS_COUNT[difficulty as keyof typeof RELATED_WORDS_COUNT]);
    
    // Combine and shuffle
    const allOptions = [...relatedWords, ...unrelatedWords].sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
  }, [difficulty, getPromptAndOptions]);

  // Memoize word selection handler
  const handleWordSelect = useCallback((word: string) => {
    if (gamePhase !== 'playing') return;
    
    setSelectedOptions(prev => {
      if (prev.includes(word)) {
        return prev.filter(w => w !== word);
      }
      if (prev.length < RELATED_WORDS_COUNT[difficulty as keyof typeof RELATED_WORDS_COUNT]) {
        return [...prev, word];
      }
      return prev;
    });
  }, [gamePhase, difficulty]);

  // Memoize word options
  const wordOptions = useMemo(() => {
    if (!promptWord) return [];
    return shuffleArray([...options.filter(word => correctRelatedWords.includes(word)), ...selectedOptions.filter(word => !correctRelatedWords.includes(word))]);
  }, [promptWord, options, correctRelatedWords, selectedOptions]);

  // Memoize game progress calculation
  const gameProgress = useMemo(() => {
    return (currentRound / MAX_ROUNDS) * 100;
  }, [currentRound]);

  const submitAnswers = () => {
    if (gamePhase === 'playing' && selectedOptions.length < RELATED_WORDS_COUNT[difficulty as keyof typeof RELATED_WORDS_COUNT]) return;
    
    endRound();
  };

  const endRound = () => {
    setGamePhase('feedback');
    
    // Calculate correct answers
    const correctlySelected = selectedOptions.filter(option => correctRelatedWords.includes(option));
    const correctCount = correctlySelected.length;
    
    // Determine result
    let result: 'correct' | 'partial' | 'incorrect';
    
    if (correctCount === RELATED_WORDS_COUNT[difficulty as keyof typeof RELATED_WORDS_COUNT]) {
      result = 'correct';
      setScore(prev => prev + 10);
      
      // Play success sound
      const audio = new Audio('/sounds/correct.mp3');
      audio.volume = 0.3;
      audio.play();
      
      // Trigger confetti for correct answers
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 5
      };
      
      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }
      
      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      
      fire(0.2, {
        spread: 60,
      });
      
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } else if (correctCount > 0) {
      result = 'partial';
      setScore(prev => prev + (correctCount * 2));
      
      // Play partial sound
      const audio = new Audio('/sounds/partial.mp3');
      audio.volume = 0.3;
      audio.play();
    } else {
      result = 'incorrect';
      
      // Play incorrect sound
      const audio = new Audio('/sounds/wrong.mp3');
      audio.volume = 0.3;
      audio.play();
    }
    
    // Update game state
    setCorrectRelatedWords(correctRelatedWords);
    
    // After 3 seconds, move to the next round
    setTimeout(() => {
      setCurrentRound(prev => prev + 1);
      if (currentRound < MAX_ROUNDS - 1) {
        resetRound();
      } else {
        endGame();
      }
    }, 3000);
  };

  const endGame = () => {
    setGamePhase('complete');
    onGameComplete(score);
    
    // Play victory sound
    const audio = new Audio('/sounds/victory.mp3');
    audio.volume = 0.4;
    audio.play();
  };

  const playAgain = () => {
    setCurrentRound(0);
    setScore(0);
    resetRound();
  };

  return (
    <div ref={gameContainerRef} className="w-full bg-white rounded-xl shadow-lg p-4 md:p-6 pb-8 text-gray-700 relative">
      <div className="flex justify-between items-center mb-4">
        <Link href="#" onClick={onBackToMenu} className="text-purple-600 hover:text-purple-800 transition-colors">
          ← Back to Settings
        </Link>
        
        <button
          onClick={toggleFullscreen}
          className="p-2 text-purple-600 hover:text-purple-800 transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a1 1 0 0 0-1 1v4a1 1 0 0 1-2 0V5a3 3 0 0 1 3-3h4a1 1 0 0 1 0 2H5zm10 10a1 1 0 0 0 1-1v-4a1 1 0 1 1 2 0v1.586l2.293-2.293a1 1 0 1 1 1.414 1.414L15.414 15H14a1 1 0 1 1 0-2h4a1 1 0 0 1 1 1v4zM5 14a1 1 0 0 0 1 1h4a1 1 0 1 1 0 2H6a3 3 0 0 1-3-3v-4a1 1 0 1 1 2 0v4zm10-10a1 1 0 0 0-1-1H10a1 1 0 1 1 0-2h4a3 3 0 0 1 3 3v4a1 1 0 1 1-2 0V4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2H6.414l2.293 2.293a1 1 0 1 1-1.414 1.414L5 6.414V8a1 1 0 0 1-2 0V4zm13 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V6.414l-2.293 2.293a1 1 0 1 1-1.414-1.414L13.586 5H12a1 1 0 1 1 0-2h4zm-13 13a1 1 0 0 1-1-1v-4a1 1 0 1 1 2 0v1.586l2.293-2.293a1 1 0 1 1 1.414 1.414L5.414 15H8a1 1 0 1 1 0 2H4zm13-1a1 1 0 0 1-1 1h-4a1 1 0 1 1 0-2h1.586l-2.293-2.293a1 1 0 1 1 1.414-1.414L15.586 13H14a1 1 0 1 1 0-2h4a1 1 0 0 1 1 1v4z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 bg-gray-100 p-2 rounded-lg mb-8 text-sm md:text-base">
        <div className="bg-white p-2 rounded shadow">
          <span className="text-gray-500">Round:</span> {currentRound}/{MAX_ROUNDS}
        </div>
        <div className="bg-white p-2 rounded shadow">
          <span className="text-gray-500">Score:</span> {score}
        </div>
        <div className="bg-white p-2 rounded shadow">
          <span className="text-gray-500">Time:</span> {timeLeft}s
        </div>
      </div>
      
      {gamePhase === 'playing' && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">
            Find {RELATED_WORDS_COUNT[difficulty as keyof typeof RELATED_WORDS_COUNT]} words related to:
          </h2>
          <div className="text-4xl font-bold text-center text-purple-600 mb-6">
            {promptWord}
          </div>
          <p className="text-center text-gray-500 mb-4">
            Select {RELATED_WORDS_COUNT[difficulty as keyof typeof RELATED_WORDS_COUNT]} words that are most closely associated with the prompt word.
          </p>
          
          <div className="word-options-grid">
            {wordOptions.map((word: string) => (
              <WordOption
                key={word}
                word={word}
                isSelected={selectedOptions.includes(word)}
                onSelect={handleWordSelect}
              />
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <button 
              onClick={submitAnswers}
              disabled={selectedOptions.length < RELATED_WORDS_COUNT[difficulty as keyof typeof RELATED_WORDS_COUNT]}
              className={`
                py-2 px-6 rounded-full font-medium transition-colors
                ${selectedOptions.length >= RELATED_WORDS_COUNT[difficulty as keyof typeof RELATED_WORDS_COUNT]
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-300 cursor-not-allowed text-gray-500'}
              `}
            >
              Submit Answers
            </button>
          </div>
        </div>
      )}
      
      {gamePhase === 'feedback' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="feedback-container"
        >
          <p>
            {selectedOptions.length > 0
              ? selectedOptions.length === RELATED_WORDS_COUNT[difficulty as keyof typeof RELATED_WORDS_COUNT]
                ? 'You found all the correct associations!'
                : `You found ${selectedOptions.filter(option => correctRelatedWords.includes(option)).length} correct associations out of ${RELATED_WORDS_COUNT[difficulty as keyof typeof RELATED_WORDS_COUNT]}.`
              : 'None of your selections were correct associations.'}
          </p>
          <div className="mt-2">
            <p className="font-medium">The correct associations were:</p>
            <p className="italic">{correctRelatedWords.join(', ')}</p>
          </div>
        </motion.div>
      )}
      
      {gamePhase === 'complete' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-purple-50 rounded-lg"
        >
          <h2 className="text-3xl font-bold text-purple-700 mb-3">Game Complete!</h2>
          <p className="text-xl mb-6">Your final score: <span className="font-bold text-purple-700">{score}</span> points</p>
          
          <div className="mb-8">
            <h3 className="font-medium text-lg mb-2">Performance Summary</h3>
            <div className="inline-block bg-white rounded-lg shadow p-4">
              <div className="text-3xl font-bold text-purple-600">{Math.round((score / (MAX_ROUNDS * 10)) * 100)}%</div>
              <div className="text-gray-500">Accuracy</div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={playAgain}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onBackToMenu}
              className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-lg transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </motion.div>
      )}
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${gameProgress}%` }}
        />
      </div>
    </div>
  );
} 
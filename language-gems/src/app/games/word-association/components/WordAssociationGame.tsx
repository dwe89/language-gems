'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface WordAssociationGameProps {
  difficulty: string;
  category: string;
  language: string;
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

export default function WordAssociationGame({ 
  difficulty, 
  category, 
  language, 
  onBackToMenu, 
  onGameComplete 
}: WordAssociationGameProps) {
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(10);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [correctOptions, setCorrectOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(true);
  const [roundActive, setRoundActive] = useState(true);
  const [roundResult, setRoundResult] = useState<'correct' | 'partial' | 'incorrect' | null>(null);
  const [usedPrompts, setUsedPrompts] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  // Determine number of related words based on difficulty
  const relatedWordsCount = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
  
  // Initialize the game
  useEffect(() => {
    startNewRound();
  }, []);

  // Timer
  useEffect(() => {
    if (!roundActive || !gameActive) return;
    
    if (timeLeft <= 0) {
      endRound();
      return;
    }
    
    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft, roundActive, gameActive]);

  // Check for game completion
  useEffect(() => {
    if (currentRound > totalRounds && gameActive) {
      endGame();
    }
  }, [currentRound, totalRounds, gameActive]);

  const getAvailablePrompts = useCallback(() => {
    const categoryData = WORD_ASSOCIATIONS[category as keyof typeof WORD_ASSOCIATIONS] || WORD_ASSOCIATIONS.general;
    const languageData = categoryData[language as keyof typeof categoryData] || categoryData.english;
    
    return languageData.filter(item => !usedPrompts.includes(item.prompt));
  }, [category, language, usedPrompts]);

  const startNewRound = useCallback(() => {
    const availablePrompts = getAvailablePrompts();
    
    if (availablePrompts.length === 0) {
      // If we've used all prompts, end the game
      endGame();
      return;
    }
    
    // Select a random prompt
    const randomPromptIndex = Math.floor(Math.random() * availablePrompts.length);
    const promptData = availablePrompts[randomPromptIndex];
    
    // Add prompt to used prompts
    setUsedPrompts(prev => [...prev, promptData.prompt]);
    
    // Set current prompt
    setCurrentPrompt(promptData.prompt);
    
    // Select related words based on difficulty
    const relatedWords = [...promptData.related]
      .sort(() => Math.random() - 0.5)
      .slice(0, relatedWordsCount);
    
    // Select unrelated words to fill the options
    const unrealatedWords = [...promptData.unrelated]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8 - relatedWordsCount);
    
    // Combine and shuffle
    const allOptions = [...relatedWords, ...unrealatedWords].sort(() => Math.random() - 0.5);
    
    setOptions(allOptions);
    setCorrectOptions(relatedWords);
    setSelectedOptions([]);
    setRoundResult(null);
    setShowFeedback(false);
    setRoundActive(true);
    setTimeLeft(30);
  }, [getAvailablePrompts, relatedWordsCount]);

  const selectOption = (option: string) => {
    if (!roundActive) return;
    
    if (selectedOptions.includes(option)) {
      // Deselect
      setSelectedOptions(prev => prev.filter(item => item !== option));
    } else {
      // Select, but limit to the required number of selections
      if (selectedOptions.length < relatedWordsCount) {
        setSelectedOptions(prev => [...prev, option]);
      }
    }
  };

  const submitAnswers = () => {
    if (!roundActive || selectedOptions.length < relatedWordsCount) return;
    
    endRound();
  };

  const endRound = () => {
    setRoundActive(false);
    
    // Calculate correct answers
    const correctAnswers = selectedOptions.filter(option => correctOptions.includes(option));
    const correctCount = correctAnswers.length;
    
    // Determine result
    let result: 'correct' | 'partial' | 'incorrect';
    
    if (correctCount === relatedWordsCount) {
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
    
    setRoundResult(result);
    setShowFeedback(true);
    
    // After 3 seconds, move to the next round
    setTimeout(() => {
      setCurrentRound(prev => prev + 1);
      if (currentRound < totalRounds) {
        startNewRound();
      }
    }, 3000);
  };

  const endGame = () => {
    setGameActive(false);
    onGameComplete(score);
    
    // Play victory sound
    const audio = new Audio('/sounds/victory.mp3');
    audio.volume = 0.4;
    audio.play();
  };

  const playAgain = () => {
    setCurrentRound(1);
    setScore(0);
    setUsedPrompts([]);
    setGameActive(true);
    startNewRound();
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full p-6"
      >
        {gameActive ? (
          <>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-lg bg-purple-100 border-purple-300 border">
                  <span className="font-medium">Round:</span> {currentRound}/{totalRounds}
                </div>
                <div className="px-4 py-2 rounded-lg bg-purple-100 border-purple-300 border">
                  <span className="font-medium">Score:</span> {score}
                </div>
                <div className={`px-4 py-2 rounded-lg ${
                  timeLeft <= 10 
                    ? 'bg-red-100 border-red-300' 
                    : 'bg-green-100 border-green-300'
                } border`}>
                  <span className="font-medium">Time:</span> {timeLeft}s
                </div>
              </div>
              
              <button
                onClick={onBackToMenu}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg transition-colors"
              >
                Menu
              </button>
            </div>
            
            <div className="mb-8 text-center">
              <h2 className="text-xl mb-2 text-gray-600">Find {relatedWordsCount} words related to:</h2>
              <div className="text-4xl font-bold text-purple-700 mb-4">{currentPrompt}</div>
              <p className="text-gray-500">
                Select {relatedWordsCount} words that are most closely associated with the prompt word.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => selectOption(option)}
                  disabled={!roundActive || (selectedOptions.length >= relatedWordsCount && !selectedOptions.includes(option))}
                  className={`p-4 rounded-lg border-2 transition text-center ${
                    !roundActive && correctOptions.includes(option)
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : selectedOptions.includes(option)
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                  } ${
                    !roundActive && !correctOptions.includes(option) && selectedOptions.includes(option)
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : ''
                  } ${
                    (!roundActive || (selectedOptions.length >= relatedWordsCount && !selectedOptions.includes(option)))
                      ? 'opacity-70'
                      : ''
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={submitAnswers}
                disabled={!roundActive || selectedOptions.length < relatedWordsCount}
                className={`py-3 px-8 rounded-lg transition ${
                  !roundActive || selectedOptions.length < relatedWordsCount
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                Submit Answers
              </button>
            </div>
            
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-6 p-4 rounded-lg text-center ${
                    roundResult === 'correct'
                      ? 'bg-green-100 text-green-800'
                      : roundResult === 'partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  <h3 className="font-bold text-xl mb-2">
                    {roundResult === 'correct'
                      ? 'Excellent!'
                      : roundResult === 'partial'
                        ? 'Good effort!'
                        : 'Try again!'}
                  </h3>
                  <p>
                    {roundResult === 'correct'
                      ? 'You found all the correct associations!'
                      : roundResult === 'partial'
                        ? `You found ${selectedOptions.filter(option => correctOptions.includes(option)).length} correct associations out of ${relatedWordsCount}.`
                        : 'None of your selections were correct associations.'}
                  </p>
                  <div className="mt-2">
                    <p className="font-medium">The correct associations were:</p>
                    <p className="italic">{correctOptions.join(', ')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
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
                <div className="text-3xl font-bold text-purple-600">{Math.round((score / (totalRounds * 10)) * 100)}%</div>
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
      </motion.div>
    </div>
  );
} 
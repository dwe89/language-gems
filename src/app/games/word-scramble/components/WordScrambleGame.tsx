'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FullscreenToggle from '../../../components/FullscreenToggle';

// Word lists for each category
const WORD_LISTS = {
  fruits: {
    spanish: [
      { word: "manzana", hint: "Red fruit" },
      { word: "plátano", hint: "Yellow curved fruit" },
      { word: "naranja", hint: "Orange citrus" },
      { word: "piña", hint: "Tropical spiky fruit" },
      { word: "uva", hint: "Small purple fruit" },
      { word: "mango", hint: "Sweet tropical fruit" },
      { word: "pera", hint: "Green teardrop fruit" },
      { word: "fresa", hint: "Red berry" }
    ],
    english: [
      { word: "apple", hint: "Red fruit" },
      { word: "banana", hint: "Yellow curved fruit" },
      { word: "orange", hint: "Orange citrus" },
      { word: "pineapple", hint: "Tropical spiky fruit" },
      { word: "grape", hint: "Small purple fruit" },
      { word: "mango", hint: "Sweet tropical fruit" },
      { word: "pear", hint: "Green teardrop fruit" },
      { word: "strawberry", hint: "Red berry" }
    ]
  },
  animals: {
    spanish: [
      { word: "perro", hint: "Man's best friend" },
      { word: "gato", hint: "Independent pet" },
      { word: "león", hint: "King of jungle" },
      { word: "tigre", hint: "Striped big cat" },
      { word: "oso", hint: "Large forest animal" },
      { word: "mono", hint: "Playful primate" },
      { word: "pájaro", hint: "Flying creature" },
      { word: "pez", hint: "Lives in water" }
    ],
    english: [
      { word: "dog", hint: "Man's best friend" },
      { word: "cat", hint: "Independent pet" },
      { word: "lion", hint: "King of jungle" },
      { word: "tiger", hint: "Striped big cat" },
      { word: "bear", hint: "Large forest animal" },
      { word: "monkey", hint: "Playful primate" },
      { word: "bird", hint: "Flying creature" },
      { word: "fish", hint: "Lives in water" }
    ]
  },
  colors: {
    spanish: [
      { word: "rojo", hint: "Color of fire" },
      { word: "azul", hint: "Color of sky" },
      { word: "verde", hint: "Color of grass" },
      { word: "amarillo", hint: "Color of sun" },
      { word: "negro", hint: "Darkest color" },
      { word: "blanco", hint: "Color of snow" },
      { word: "morado", hint: "Color of royalty" },
      { word: "gris", hint: "Color of clouds" }
    ],
    english: [
      { word: "red", hint: "Color of fire" },
      { word: "blue", hint: "Color of sky" },
      { word: "green", hint: "Color of grass" },
      { word: "yellow", hint: "Color of sun" },
      { word: "black", hint: "Darkest color" },
      { word: "white", hint: "Color of snow" },
      { word: "purple", hint: "Color of royalty" },
      { word: "gray", hint: "Color of clouds" }
    ]
  }
};

// Game difficulty settings
const DIFFICULTY_SETTINGS = {
  beginner: {
    timeLimit: 90,
    maxGuesses: 5,
    maxHints: 3
  },
  intermediate: {
    timeLimit: 60,
    maxGuesses: 3,
    maxHints: 2
  },
  advanced: {
    timeLimit: 45,
    maxGuesses: 2,
    maxHints: 1
  }
};

type GameSettings = {
  difficulty: string;
  category: string;
  language: string;
};

type WordScrambleGameProps = {
  settings: GameSettings;
  onBackToMenu: () => void;
  onGameEnd: (result: { won: boolean; score: number; streak?: number }) => void;
};

export default function WordScrambleGame({ settings, onBackToMenu, onGameEnd }: WordScrambleGameProps) {
  // Game state
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [remainingGuesses, setRemainingGuesses] = useState(DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].maxGuesses);
  const [remainingHints, setRemainingHints] = useState(DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].maxHints);
  const [timeRemaining, setTimeRemaining] = useState(DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].timeLimit);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  // Word state
  const [currentWord, setCurrentWord] = useState("");
  const [currentHint, setCurrentHint] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  
  // Audio references
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Refs for timer and fullscreen
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize game
  useEffect(() => {
    // Create audio elements
    correctSoundRef.current = new Audio('/sounds/correct.mp3');
    wrongSoundRef.current = new Audio('/sounds/wrong.mp3');
    gameOverSoundRef.current = new Audio('/sounds/gameover.mp3');
    
    // Set initial game state
    const difficultySettings = DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS];
    setRemainingGuesses(difficultySettings.maxGuesses);
    setRemainingHints(difficultySettings.maxHints);
    setTimeRemaining(difficultySettings.timeLimit);
    
    // Get the first word
    getNewWord();
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleGameOver(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Focus on input
    if (inputRef.current) inputRef.current.focus();
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  // Get a new word based on settings
  const getNewWord = () => {
    const wordList = WORD_LISTS[settings.category as keyof typeof WORD_LISTS][settings.language as 'spanish' | 'english'];
    const randomIndex = Math.floor(Math.random() * wordList.length);
    const { word, hint } = wordList[randomIndex];
    
    setCurrentWord(word.toLowerCase());
    setCurrentHint(hint);
    setScrambledWord(scrambleWord(word.toLowerCase()));
    setUserInput("");
    setShowHint(false);
  };
  
  // Scramble a word
  const scrambleWord = (word: string): string => {
    const letters = word.split('');
    
    // Shuffle the letters
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    const scrambled = letters.join('');
    
    // If the scrambled word is the same as the original, scramble again
    return scrambled === word ? scrambleWord(word) : scrambled;
  };
  
  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value.toLowerCase());
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      // Correct answer
      if (correctSoundRef.current) correctSoundRef.current.play().catch(e => console.log("Sound play failed"));
      setScore(prev => prev + (10 * (settings.difficulty === 'advanced' ? 3 : settings.difficulty === 'intermediate' ? 2 : 1)));
      setStreak(prev => prev + 1);
      setShowCongrats(true);
      
      // Show congratulations briefly then get new word
      setTimeout(() => {
        setShowCongrats(false);
        getNewWord();
      }, 1500);
    } else {
      // Wrong answer
      if (wrongSoundRef.current) wrongSoundRef.current.play().catch(e => console.log("Sound play failed"));
      setRemainingGuesses(prev => prev - 1);
      
      if (remainingGuesses <= 1) {
        handleGameOver(false);
      }
    }
    
    setUserInput("");
  };
  
  // Handle hint button click
  const handleHint = () => {
    if (remainingHints > 0) {
      setShowHint(true);
      setRemainingHints(prev => prev - 1);
    }
  };
  
  // Handle skip button click
  const handleSkip = () => {
    setScore(prev => Math.max(0, prev - 5)); // Penalty for skipping
    getNewWord();
  };
  
  // Handle game over
  const handleGameOver = (won: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    setGameOver(true);
    setGameWon(won);
    
    if (won) {
      if (correctSoundRef.current) correctSoundRef.current.play().catch(e => console.log("Sound play failed"));
    } else {
      if (gameOverSoundRef.current) gameOverSoundRef.current.play().catch(e => console.log("Sound play failed"));
    }
    
    // Report game results
    onGameEnd({
      won,
      score,
      streak
    });
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 shadow-lg rounded-lg p-6 relative" ref={gameContainerRef}>
      <div className="absolute top-4 right-4 z-10">
        <FullscreenToggle containerRef={gameContainerRef} />
      </div>
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-2xl font-bold text-green-600">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Streak</p>
            <p className="text-2xl font-bold text-purple-600">{streak}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Guesses</p>
            <p className="text-2xl font-bold text-orange-600">{remainingGuesses}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Time</p>
            <p className={`text-2xl font-bold ${timeRemaining < 10 ? 'text-red-600' : 'text-blue-600'}`}>
              {formatTime(timeRemaining)}
            </p>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-center py-4 mb-6"
          >
            <h2 className="text-3xl font-bold text-green-600">Correct!</h2>
            <p className="text-gray-600">+10 points</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!gameOver ? (
        <>
          <div className="text-center mb-8">
            <h2 className="text-lg text-gray-700 mb-2">Unscramble the word:</h2>
            <motion.div
              key={scrambledWord}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold tracking-wider mb-4 min-h-16"
            >
              {scrambledWord.split('').map((letter, index) => (
                <span key={index} className="inline-block mx-1 text-green-700 bg-green-50 px-2 py-1 rounded shadow-sm">
                  {letter.toUpperCase()}
                </span>
              ))}
            </motion.div>
            
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-4"
              >
                <p className="text-yellow-800">Hint: {currentHint}</p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="mb-4">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-xl"
                autoComplete="off"
              />
              <button
                type="submit"
                className="w-full mt-3 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                Submit
              </button>
            </form>
            
            <div className="flex justify-between">
              <button
                onClick={handleHint}
                disabled={remainingHints <= 0}
                className={`px-4 py-2 rounded-lg font-medium ${
                  remainingHints > 0
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Hint ({remainingHints})
              </button>
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
              >
                Skip (-5 pts)
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold mb-4 text-center">
            {gameWon ? (
              <span className="text-green-600">You Win!</span>
            ) : (
              <span className="text-red-600">Game Over</span>
            )}
          </h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-xl mb-2">Final Score: <span className="font-bold text-green-600">{score}</span></p>
            <p className="text-xl">Longest Streak: <span className="font-bold text-purple-600">{streak}</span></p>
            
            {!gameWon && currentWord && (
              <p className="mt-4 text-gray-700">
                The word was: <span className="font-bold text-green-700">{currentWord.toUpperCase()}</span>
              </p>
            )}
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setScore(0);
                setStreak(0);
                setGameOver(false);
                setGameWon(false);
                
                const difficultySettings = DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS];
                setRemainingGuesses(difficultySettings.maxGuesses);
                setRemainingHints(difficultySettings.maxHints);
                setTimeRemaining(difficultySettings.timeLimit);
                
                getNewWord();
                
                timerRef.current = setInterval(() => {
                  setTimeRemaining(prev => {
                    if (prev <= 1) {
                      handleGameOver(false);
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
              }}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={onBackToMenu}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
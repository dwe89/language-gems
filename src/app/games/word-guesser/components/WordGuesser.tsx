'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WordGuesserSettings, LetterState, GuessRow } from '../types';
import { motion } from 'framer-motion';
import { X, RotateCcw, HelpCircle } from 'lucide-react';

interface WordGuesserProps {
  settings: WordGuesserSettings;
  onBackToMenu: () => void;
  onGameEnd?: (result: 'win' | 'lose') => void;
}

// Word lists for different languages and categories - this would be expanded in a real app
// This is a simplified version for the prototype
const WORD_LISTS: Record<string, Record<string, Record<string, string[]>>> = {
  english: {
    animals: {
      beginner: ['cat', 'dog', 'bird', 'fish', 'lion'],
      intermediate: ['tiger', 'horse', 'sheep', 'whale', 'panda'],
      advanced: ['elephant', 'giraffe', 'penguin', 'dolphin', 'squirrel']
    },
    food: {
      beginner: ['rice', 'meat', 'fish', 'milk', 'cake'],
      intermediate: ['bread', 'pasta', 'apple', 'steak', 'sugar'],
      advanced: ['yogurt', 'banana', 'potato', 'tomato', 'chicken']
    },
    colors: {
      beginner: ['red', 'blue', 'gray', 'pink', 'gold'],
      intermediate: ['green', 'black', 'white', 'brown', 'purple'],
      advanced: ['yellow', 'orange', 'violet', 'indigo', 'maroon']
    },
    numbers: {
      beginner: ['one', 'two', 'five', 'nine', 'zero'],
      intermediate: ['three', 'seven', 'eight', 'forty', 'sixty'],
      advanced: ['eleven', 'twelve', 'thirty', 'ninety', 'fifteen']
    },
    family: {
      beginner: ['mom', 'dad', 'son', 'aunt', 'wife'],
      intermediate: ['father', 'mother', 'sister', 'cousin', 'nephew'],
      advanced: ['brother', 'daughter', 'grandma', 'grandpa', 'husband']
    }
  },
  spanish: {
    animals: {
      beginner: ['gato', 'perro', 'pato', 'vaca', 'rana'],
      intermediate: ['cabra', 'cerdo', 'tigre', 'lobo', 'zorro'],
      advanced: ['elefante', 'ballena', 'jirafa', 'cocodrilo', 'mariposa']
    },
    food: {
      beginner: ['pan', 'arroz', 'leche', 'agua', 'sopa'],
      intermediate: ['huevo', 'carne', 'fruta', 'pollo', 'queso'],
      advanced: ['naranja', 'tomate', 'cebolla', 'lechuga', 'plátano']
    },
    colors: {
      beginner: ['rojo', 'azul', 'gris', 'rosa', 'oro'],
      intermediate: ['verde', 'negro', 'blanco', 'marrón', 'morado'],
      advanced: ['amarillo', 'naranja', 'violeta', 'índigo', 'marrón']
    },
    numbers: {
      beginner: ['uno', 'dos', 'tres', 'cinco', 'cero'],
      intermediate: ['cuatro', 'siete', 'ocho', 'diez', 'veinte'],
      advanced: ['quince', 'treinta', 'catorce', 'noventa', 'sesenta']
    }
  },
  french: {
    animals: {
      beginner: ['chat', 'chien', 'vache', 'loup', 'lion'],
      intermediate: ['tigre', 'poule', 'mouton', 'ours', 'singe'],
      advanced: ['éléphant', 'girafe', 'crocodile', 'dauphin', 'papillon']
    },
    food: {
      beginner: ['pain', 'lait', 'eau', 'vin', 'sel'],
      intermediate: ['viande', 'poulet', 'pomme', 'sucre', 'beurre'],
      advanced: ['fromage', 'poisson', 'tomate', 'banane', 'orange']
    }
  },
  german: {
    animals: {
      beginner: ['hund', 'katze', 'maus', 'kuh', 'pferd'],
      intermediate: ['vogel', 'tiger', 'wolf', 'schaf', 'hase'],
      advanced: ['elefant', 'giraffe', 'krokodil', 'delphin', 'pinguin']
    },
    food: {
      beginner: ['brot', 'milch', 'salz', 'wein', 'eis'],
      intermediate: ['käse', 'wurst', 'apfel', 'fleisch', 'suppe'],
      advanced: ['tomate', 'banane', 'orange', 'gemüse', 'zwiebel']
    }
  }
};

// Ensure each language has a fallback for unknown categories
Object.keys(WORD_LISTS).forEach(language => {
  if (language !== 'english') {
    const categories = Object.keys(WORD_LISTS.english);
    categories.forEach(category => {
      if (!WORD_LISTS[language][category]) {
        WORD_LISTS[language][category] = WORD_LISTS.english[category];
      }
    });
  }
});

export default function WordGuesser({ settings, onBackToMenu, onGameEnd }: WordGuesserProps) {
  // Game state
  const [targetWord, setTargetWord] = useState<string>('');
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [guessStates, setGuessStates] = useState<GuessRow[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [keyStates, setKeyStates] = useState<Record<string, LetterState>>({});
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [revealedHint, setRevealedHint] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [theme, setTheme] = useState<'default' | 'dark' | 'forest'>('forest');
  const [fallingLeaves, setFallingLeaves] = useState<{id: number, left: string, delay: number}[]>([]);
  
  // Initialize falling leaves for forest theme
  useEffect(() => {
    if (theme === 'forest') {
      const leaves = [];
      for (let i = 0; i < 15; i++) {
        leaves.push({
          id: i,
          left: `${Math.random() * 100}%`,
          delay: Math.random() * 5
        });
      }
      setFallingLeaves(leaves);
    }
  }, [theme]);
  
  // Language-specific special characters
  const specialCharacters: Record<string, string[]> = {
    spanish: ['Ñ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ü'],
    french: ['É', 'È', 'Ê', 'Ë', 'À', 'Â', 'Ç', 'Î', 'Ï', 'Ô', 'Û', 'Ù'],
    german: ['Ä', 'Ö', 'Ü', 'ß'],
    italian: ['À', 'È', 'É', 'Ì', 'Ò', 'Ù'],
    portuguese: ['Ã', 'Õ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Â', 'Ê', 'Ô', 'Ç'],
  };
  
  // Keyboard layouts for different languages
  const keyboardLayouts: Record<string, string[][]> = {
    default: [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ],
    spanish: [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
      ['Á', 'É', 'Í', 'Ó', 'Ú', 'Ü']
    ],
    french: [
      ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
      ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'BACKSPACE'],
      ['É', 'È', 'Ê', 'À', 'Ç', 'Ù', 'Î', 'Ï', 'Ô']
    ],
    german: [
      ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä'],
      ['ENTER', 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
      ['ß']
    ],
    italian: [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
      ['À', 'È', 'É', 'Ì', 'Ò', 'Ù']
    ],
    portuguese: [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
      ['Ã', 'Õ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Â', 'Ê', 'Ô']
    ]
  };
  
  // Get the appropriate keyboard layout
  const getKeyboardLayout = () => {
    return keyboardLayouts[settings.language] || keyboardLayouts.default;
  };
  
  // Initialize the game with a random word
  const initializeGame = useCallback(() => {
    // Pick a random word based on language, category, and difficulty
    const language = settings.language in WORD_LISTS ? settings.language : 'english';
    const category = settings.category in WORD_LISTS[language] ? settings.category : 'animals';
    const difficulty = settings.difficulty in WORD_LISTS[language][category] ? settings.difficulty : 'beginner';
    
    const words = WORD_LISTS[language][category][difficulty];
    const randomWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    
    setTargetWord(randomWord);
    setCurrentGuess('');
    setGuesses([]);
    setGuessStates([]);
    setGameStatus('playing');
    setKeyStates({});
    setHintsUsed(0);
    setScore(0);
    setShowHint(false);
    setRevealedHint('');
  }, [settings]);
  
  // Initialize the game on settings change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  // Handle user input
  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== 'playing') return;
    
    if (key === 'ENTER') {
      // Submit guess
      if (currentGuess.length !== targetWord.length) {
        // Word is not complete
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
        return;
      }
      
      // Check if the guess is a valid word
      // In a real app, you would validate against a dictionary
      // For this prototype, we'll accept any word of the right length
      
      // Record the guess
      const newGuesses = [...guesses, currentGuess];
      setGuesses(newGuesses);
      
      // Check the guess
      const newGuessState: GuessRow = [];
      const letterCounts: Record<string, number> = {};
      
      // Count letters in the target word
      for (const letter of targetWord) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      }
      
      // First pass: mark correct positions
      for (let i = 0; i < currentGuess.length; i++) {
        const letter = currentGuess[i];
        
        if (letter === targetWord[i]) {
          newGuessState.push({ letter, state: 'correct' });
          letterCounts[letter]--;
        } else {
          newGuessState.push({ letter, state: 'absent' });
        }
      }
      
      // Second pass: mark present letters
      for (let i = 0; i < currentGuess.length; i++) {
        const letter = currentGuess[i];
        
        if (letter !== targetWord[i] && letterCounts[letter] > 0) {
          newGuessState[i].state = 'present';
          letterCounts[letter]--;
        }
      }
      
      // Update guess states
      setGuessStates([...guessStates, newGuessState]);
      
      // Update keyboard states
      const newKeyStates = { ...keyStates };
      for (const { letter, state } of newGuessState) {
        // Only upgrade the key state
        if (!newKeyStates[letter] || 
            (state === 'correct') || 
            (state === 'present' && newKeyStates[letter] === 'absent')) {
          newKeyStates[letter] = state;
        }
      }
      setKeyStates(newKeyStates);
      
      // Check game state
      if (currentGuess === targetWord) {
        // Win
        setGameStatus('won');
        calculateScore(newGuesses.length);
        if (onGameEnd) onGameEnd('win');
      } else if (newGuesses.length >= settings.maxAttempts) {
        // Loss
        setGameStatus('lost');
        if (onGameEnd) onGameEnd('lose');
      }
      
      // Reset current guess
      setCurrentGuess('');
    } else if (key === 'BACKSPACE') {
      // Delete last character
      setCurrentGuess(prev => prev.slice(0, -1));
    } else {
      // Add letter if we have room
      if (currentGuess.length < targetWord.length) {
        setCurrentGuess(prev => prev + key);
      }
    }
  }, [currentGuess, gameStatus, guesses, guessStates, keyStates, onGameEnd, settings.maxAttempts, targetWord]);
  
  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        handleKeyPress('BACKSPACE');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyPress]);
  
  // Show a hint
  const handleHint = () => {
    if (hintsUsed >= 2 || gameStatus !== 'playing') return;
    
    let hintIndex: number;
    if (hintsUsed === 0) {
      // First hint: reveal a random letter that hasn't been guessed correctly
      const unrevealedIndices: number[] = [];
      
      for (let i = 0; i < targetWord.length; i++) {
        const isRevealed = guessStates.some(
          row => row[i]?.state === 'correct'
        );
        
        if (!isRevealed) {
          unrevealedIndices.push(i);
        }
      }
      
      if (unrevealedIndices.length === 0) return;
      
      hintIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    } else {
      // Second hint: reveal another random letter
      const unrevealedIndices: number[] = [];
      
      for (let i = 0; i < targetWord.length; i++) {
        const isRevealed = guessStates.some(
          row => row[i]?.state === 'correct'
        ) || revealedHint.includes(`${i}:${targetWord[i]}`);
        
        if (!isRevealed) {
          unrevealedIndices.push(i);
        }
      }
      
      if (unrevealedIndices.length === 0) return;
      
      hintIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    }
    
    const newRevealedHint = revealedHint + 
      (revealedHint ? ',' : '') + 
      `${hintIndex}:${targetWord[hintIndex]}`;
    
    setRevealedHint(newRevealedHint);
    setHintsUsed(prev => prev + 1);
    setShowHint(true);
  };
  
  // Calculate score based on number of attempts and hints used
  const calculateScore = (attempts: number) => {
    const baseScore = 1000;
    const attemptPenalty = 100 * (attempts - 1);
    const hintPenalty = 200 * hintsUsed;
    const finalScore = Math.max(baseScore - attemptPenalty - hintPenalty, 100);
    
    setScore(finalScore);
  };
  
  // Get the letter state for the displayed grid
  const getLetterState = (rowIndex: number, colIndex: number): LetterState => {
    if (rowIndex >= guessStates.length) return 'unused';
    if (colIndex >= guessStates[rowIndex].length) return 'unused';
    
    return guessStates[rowIndex][colIndex].state;
  };
  
  // Start a new game
  const handleNewGame = () => {
    initializeGame();
  };
  
  // Cycle through themes
  const cycleTheme = () => {
    if (theme === 'default') setTheme('dark');
    else if (theme === 'dark') setTheme('forest');
    else setTheme('default');
  };
  
  // Render the guess grid
  const renderGrid = () => {
    const rows = [];
    const gridStyle = {
      gridTemplateColumns: `repeat(${targetWord.length}, 1fr)`
    };
    
    for (let i = 0; i < settings.maxAttempts; i++) {
      const row = [];
      const isCurrentRow = i === guesses.length;
      const rowWord = isCurrentRow ? currentGuess : (guesses[i] || '');
      
      for (let j = 0; j < targetWord.length; j++) {
        const letter = rowWord[j] || '';
        const state = getLetterState(i, j);
        const isFilled = letter !== '';
        const isRevealed = i < guesses.length;
        
        // Check if this is a hint letter
        const isHintLetter = showHint && 
          isCurrentRow && 
          revealedHint.includes(`${j}:${targetWord[j]}`);
        
        const hintLetter = isHintLetter ? targetWord[j] : letter;
        
        row.push(
          <div
            key={`cell-${i}-${j}`}
            className={`letter-box ${isFilled ? 'filled' : ''} ${
              isRevealed ? state : ''
            } ${isHintLetter ? 'correct' : ''} ${
              isRevealed ? `flip flip-delay-${Math.min(j, 5)}` : ''
            }`}
          >
            {isHintLetter ? hintLetter : letter}
          </div>
        );
      }
      
      rows.push(
        <div 
          key={`row-${i}`} 
          className={`guess-row ${isCurrentRow && isShaking ? 'shake' : ''}`}
          style={gridStyle}
        >
          {row}
        </div>
      );
    }
    
    return <div className="guesses-grid">{rows}</div>;
  };
  
  // Render keyboard
  const renderKeyboard = () => {
    const layout = getKeyboardLayout();
    
    return (
      <div className="keyboard">
        {layout.map((row, rowIndex) => (
          <div key={`keyboard-row-${rowIndex}`} className="keyboard-row">
            {row.map((key) => {
              let buttonClass = "key";
              
              // Check for special keys
              if (key === 'ENTER') {
                buttonClass += " large";
                return (
                  <button
                    key={`key-${key}`}
                    className={buttonClass}
                    onClick={() => handleKeyPress(key)}
                  >
                    <span className="hidden sm:inline">ENTER</span>
                    <span className="sm:hidden">↵</span>
                  </button>
                );
              }
              
              if (key === 'BACKSPACE') {
                buttonClass += " large";
                return (
                  <button
                    key={`key-${key}`}
                    className={buttonClass}
                    onClick={() => handleKeyPress(key)}
                  >
                    ⌫
                  </button>
                );
              }
              
              // Apply state styling for regular keys
              if (keyStates[key]) {
                buttonClass += ` ${keyStates[key]}`;
              }
              
              return (
                <button
                  key={`key-${key}`}
                  className={buttonClass}
                  onClick={() => handleKeyPress(key)}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className={`word-guesser-container theme-${theme}`}>
      {theme === 'forest' && (
        <>
          <div className="forest-background"></div>
          <div className="forest-overlay"></div>
          <div className="leaves-top"></div>
          <div className="leaves-bottom"></div>
          <div className="sunbeam"></div>
          {fallingLeaves.map(leaf => (
            <div 
              key={leaf.id} 
              className="falling-leaf" 
              style={{
                left: leaf.left,
                animationDelay: `${leaf.delay}s`
              }}
            ></div>
          ))}
        </>
      )}
      
      <div className="game-header">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors text-gray-800"
            onClick={onBackToMenu}
            title="Back to menu"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="game-info-bar">
            <div className="font-medium">{settings.language} • {settings.category} • {settings.difficulty}</div>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" /> {2 - hintsUsed}/{2}
            </div>
            <div className="flex items-center gap-2">
              <span>{guesses.length}/{settings.maxAttempts}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {hintsUsed < 2 && gameStatus === 'playing' && (
            <button
              className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors text-white"
              onClick={handleHint}
              title="Get a hint"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          )}
          
          <button 
            className="p-2 rounded-full bg-teal-600 hover:bg-teal-500 transition-colors text-white"
            onClick={cycleTheme}
            title="Change theme"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </button>
          
          <button 
            className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors text-white"
            onClick={handleNewGame}
            title="New game"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Game status message */}
      {gameStatus !== 'playing' && (
        <div className={`game-message ${gameStatus === 'won' ? 'message-success' : 'message-error'}`}>
          {gameStatus === 'won' ? (
            <>
              <p>Congratulations! You guessed the word!</p>
              <p className="text-sm mt-1">Score: {score} points</p>
            </>
          ) : (
            <p>The word was: {targetWord}</p>
          )}
        </div>
      )}
      
      <div className="game-content-wrapper">
        <div className="game-content">
          {/* Main game grid */}
          {renderGrid()}
        </div>
        
        <div className="keyboard-container">
          {/* Keyboard */}
          {renderKeyboard()}
        </div>
      </div>
      
      {/* Game info footer (visible only on mobile) */}
      <div className="game-footer">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" /> Hints: {2 - hintsUsed}/{2}
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" /> Attempts: {guesses.length}/{settings.maxAttempts}
        </div>
      </div>
    </div>
  );
} 
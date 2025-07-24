'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WordGuesserSettings, LetterState, GuessRow } from '../types';
import { motion } from 'framer-motion';
import { X, RotateCcw, HelpCircle } from 'lucide-react';
import { useVocabularyByCategory } from '../../../../hooks/useVocabulary';

interface WordGuesserProps {
  settings: WordGuesserSettings & {
    selectedCategory: string;
    selectedSubcategory: string | null;
    theme: string;
  };
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
  const [fallingLeaves, setFallingLeaves] = useState<{id: number, left: string, delay: number}[]>([]);

  // Map language for vocabulary loading
  const mapLanguageForVocab = (lang: string) => {
    const mapping: Record<string, string> = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de'
    };
    return mapping[lang] || 'es';
  };

  // Load vocabulary using the category system
  const { vocabulary, loading: vocabularyLoading } = useVocabularyByCategory({
    language: mapLanguageForVocab(settings.language),
    categoryId: settings.selectedCategory,
    subcategoryId: settings.selectedSubcategory,
    difficultyLevel: settings.difficulty,
    curriculumLevel: 'KS3'
  });
  
  // Initialize theme effects
  useEffect(() => {
    if (settings.theme === 'forest') {
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
  }, [settings.theme]);
  
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
    if (vocabulary && vocabulary.length > 0) {
      // Filter words by difficulty (word length)
      let filteredWords = vocabulary;

      if (settings.difficulty === 'beginner') {
        filteredWords = vocabulary.filter(item => item.word.length >= 3 && item.word.length <= 4);
      } else if (settings.difficulty === 'intermediate') {
        filteredWords = vocabulary.filter(item => item.word.length >= 5 && item.word.length <= 6);
      } else if (settings.difficulty === 'advanced') {
        filteredWords = vocabulary.filter(item => item.word.length >= 7);
      }

      // Fallback to all words if no words match the difficulty
      if (filteredWords.length === 0) {
        filteredWords = vocabulary;
      }

      const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
      setTargetWord(randomWord.word.toUpperCase());
      setRevealedHint(randomWord.translation || '');
    } else {
      // Fallback word if no vocabulary is loaded
      setTargetWord('WORD');
      setRevealedHint('A sequence of letters');
    }

    setCurrentGuess('');
    setGuesses([]);
    setGuessStates([]);
    setGameStatus('playing');
    setKeyStates({});
    setHintsUsed(0);
    setScore(0);
    setShowHint(false);
  }, [vocabulary, settings.difficulty]);
  
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
  
  // Get theme classes
  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'tokyo':
        return {
          container: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950',
          text: 'text-cyan-50',
          accent: 'bg-pink-600',
          button: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700',
          grid: 'bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30',
          cell: 'bg-slate-700/50 border border-cyan-500/20 text-cyan-50',
          keyboard: 'bg-slate-800/50 backdrop-blur-sm'
        };
      case 'neon':
        return {
          container: 'bg-black',
          text: 'text-green-400',
          accent: 'bg-green-500',
          button: 'bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600',
          grid: 'bg-gray-900/80 backdrop-blur-sm border border-green-500/50',
          cell: 'bg-gray-800/50 border border-green-500/30 text-green-400',
          keyboard: 'bg-gray-900/80 backdrop-blur-sm'
        };
      case 'space':
        return {
          container: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-950',
          text: 'text-purple-50',
          accent: 'bg-purple-600',
          button: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700',
          grid: 'bg-purple-800/30 backdrop-blur-sm border border-purple-500/30',
          cell: 'bg-purple-700/30 border border-purple-500/20 text-purple-50',
          keyboard: 'bg-purple-800/30 backdrop-blur-sm'
        };
      default: // forest
        return {
          container: 'bg-gradient-to-br from-green-800 via-green-700 to-emerald-800',
          text: 'text-green-50',
          accent: 'bg-green-600',
          button: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
          grid: 'bg-green-800/30 backdrop-blur-sm border border-green-500/30',
          cell: 'bg-green-700/30 border border-green-500/20 text-green-50',
          keyboard: 'bg-green-800/30 backdrop-blur-sm'
        };
    }
  };

  const themeClasses = getThemeClasses();
  
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
        
        const getCellClasses = () => {
          let classes = `w-12 h-12 border-2 rounded flex items-center justify-center font-bold text-lg transition-all duration-300 ${themeClasses.cell}`;

          if (isRevealed) {
            if (state === 'correct') {
              classes += ` ${themeClasses.accent} text-white`;
            } else if (state === 'present') {
              classes += ' bg-yellow-500 text-white border-yellow-500';
            } else if (state === 'absent') {
              classes += ' bg-gray-500 text-white border-gray-500';
            }
          } else if (isFilled) {
            classes += ' border-opacity-60';
          }

          if (isHintLetter) {
            classes += ` ${themeClasses.accent} text-white`;
          }

          return classes;
        };

        row.push(
          <motion.div
            key={`cell-${i}-${j}`}
            className={getCellClasses()}
            initial={isRevealed ? { rotateY: 0 } : false}
            animate={isRevealed ? { rotateY: [0, 90, 0] } : false}
            transition={{ duration: 0.6, delay: j * 0.1 }}
          >
            {isHintLetter ? hintLetter : letter}
          </motion.div>
        );
      }
      
      rows.push(
        <motion.div
          key={`row-${i}`}
          className={`grid gap-2 ${isCurrentRow && isShaking ? 'animate-pulse' : ''}`}
          style={gridStyle}
          animate={isCurrentRow && isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {row}
        </motion.div>
      );
    }

    return <div className="space-y-2">{rows}</div>;
  };
  
  // Render keyboard
  const renderKeyboard = () => {
    return <div>Keyboard placeholder</div>;
  };
  
  return (
    <div className={`min-h-screen ${themeClasses.container} ${themeClasses.text} relative overflow-hidden`}>
      {/* Theme-specific background effects */}
      {settings.theme === 'forest' && (
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

      {settings.theme === 'tokyo' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(236,72,153,0.1)_0%,_transparent_50%)]"></div>
        </>
      )}

      {settings.theme === 'neon' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-cyan-500/5 to-green-500/5"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,_rgba(34,197,94,0.1)_0%,_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,_rgba(6,182,212,0.1)_0%,_transparent_50%)]"></div>
        </>
      )}

      {settings.theme === 'space' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(147,51,234,0.1)_0%,_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(79,70,229,0.1)_0%,_transparent_50%)]"></div>
        </>
      )}
      
      <div className={`relative z-10 p-4 ${themeClasses.keyboard} border-b border-white/10`}>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              className={`p-2 rounded-full ${themeClasses.button} transition-colors`}
              onClick={onBackToMenu}
              title="Back to menu"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4 text-sm">
              <div className="font-medium">{settings.language} • {settings.difficulty}</div>
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
                className={`p-2 rounded-full ${themeClasses.accent} hover:opacity-80 transition-opacity text-white`}
                onClick={handleHint}
                title="Get a hint"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            )}

            <button
              className={`p-2 rounded-full ${themeClasses.button} transition-colors`}
              onClick={handleNewGame}
              title="New game"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Game status message */}
      {gameStatus !== 'playing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative z-10 mx-auto max-w-md p-6 m-4 rounded-xl ${themeClasses.grid} text-center`}
        >
          {gameStatus === 'won' ? (
            <>
              <p className="text-xl font-bold mb-2">Congratulations! 🎉</p>
              <p className="text-sm opacity-75">Score: {score} points</p>
            </>
          ) : (
            <>
              <p className="text-xl font-bold mb-2">Game Over</p>
              <p className="text-sm opacity-75">The word was: <span className="font-bold">{targetWord}</span></p>
            </>
          )}
        </motion.div>
      )}

      {/* Hint display */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative z-10 mx-auto max-w-md p-4 m-4 rounded-xl ${themeClasses.grid} text-center`}
        >
          <p className="text-sm opacity-75 mb-1">Hint:</p>
          <p className="font-medium">{revealedHint}</p>
        </motion.div>
      )}

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
          {/* Main game grid */}
          <div className={`p-6 rounded-xl ${themeClasses.grid}`}>
            {renderGrid()}
          </div>

          {/* Keyboard */}
          <div className={`p-4 rounded-xl ${themeClasses.keyboard}`}>
            {renderKeyboard()}
          </div>
        </div>
      </div>
    </div>
  );
} 
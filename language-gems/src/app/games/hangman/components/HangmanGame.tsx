'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, useTheme } from './ThemeProvider';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Zap, Volume2, VolumeX } from 'lucide-react';
import TokyoNightsAnimation from './themes/TokyoNightsAnimation';
import LavaTempleAnimation from './themes/LavaTempleAnimation';
import SpaceExplorerAnimation from './themes/SpaceExplorerAnimation';
import PirateAdventureAnimation from './themes/PirateAdventureAnimation';
import SoundEffects from './SoundEffects';
import TempleGuardianModal from './TempleGuardianModal';
import TokyoNightsModal from './TokyoNightsModal';
import SpaceExplorerModal from './SpaceExplorerModal';

interface HangmanGameProps {
  settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    customWords?: string[];
  };
  onBackToMenu: () => void;
  onGameEnd?: (result: 'win' | 'lose') => void;
  isFullscreen?: boolean;
}

// Mock word lists based on categories and difficulties
const WORD_LISTS = {
  // Basics categories
  numbers: {
    beginner: ['uno', 'dos', 'tres', 'cuatro', 'cinco'],
    intermediate: ['seis', 'siete', 'ocho', 'nueve', 'diez'],
    advanced: ['once', 'doce', 'trece', 'catorce', 'quince']
  },
  colors: {
    beginner: ['rojo', 'azul', 'verde', 'negro', 'blanco'],
    intermediate: ['amarillo', 'morado', 'naranja', 'gris', 'rosa'],
    advanced: ['violeta', 'turquesa', 'marrón', 'dorado', 'plateado']
  },
  days: {
    beginner: ['lunes', 'martes', 'viernes', 'sábado', 'domingo'],
    intermediate: ['miércoles', 'jueves', 'semana', 'hoy', 'mañana'],
    advanced: ['pasado mañana', 'anteayer', 'fin de semana', 'laboral', 'festivo']
  },
  months: {
    beginner: ['enero', 'mayo', 'julio', 'junio', 'marzo'],
    intermediate: ['febrero', 'abril', 'agosto', 'octubre', 'diciembre'],
    advanced: ['noviembre', 'septiembre', 'primavera', 'verano', 'invierno']
  },
  greetings: {
    beginner: ['hola', 'adios', 'gracias', 'buenos días', 'buenas noches'],
    intermediate: ['buenas tardes', 'hasta luego', 'encantado', 'bienvenido', 'por favor'],
    advanced: ['hasta pronto', 'mucho gusto', 'igualmente', 'disculpe', 'felicidades']
  },
  phrases: {
    beginner: ['bien', 'mal', 'sí', 'no', 'quizás'],
    intermediate: ['tal vez', 'posiblemente', 'seguramente', 'probablemente', 'ciertamente'],
    advanced: ['sin embargo', 'por supuesto', 'de hecho', 'en realidad', 'a propósito']
  },
  
  // People & Relationships categories
  family: {
    beginner: ['padre', 'madre', 'hijo', 'hija', 'hermano'],
    intermediate: ['hermana', 'abuelo', 'abuela', 'tío', 'tía'],
    advanced: ['sobrino', 'sobrina', 'cuñado', 'cuñada', 'yerno']
  },
  physicaltraits: {
    beginner: ['alto', 'bajo', 'fuerte', 'débil', 'guapo'],
    intermediate: ['delgado', 'gordo', 'rubio', 'moreno', 'calvo'],
    advanced: ['musculoso', 'atlético', 'corpulento', 'esbelto', 'robusto']
  },
  personality: {
    beginner: ['feliz', 'triste', 'enojado', 'tranquilo', 'nervioso'],
    intermediate: ['amable', 'generoso', 'paciente', 'impaciente', 'tímido'],
    advanced: ['comprensivo', 'confiable', 'temperamental', 'impulsivo', 'perseverante']
  },
  professions: {
    beginner: ['doctor', 'maestro', 'cocinero', 'policía', 'bombero'],
    intermediate: ['abogado', 'ingeniero', 'enfermero', 'arquitecto', 'piloto'],
    advanced: ['carpintero', 'electricista', 'fontanero', 'contable', 'psicólogo']
  },
  
  // Original categories for backward compatibility
  animals: {
    beginner: ['gato', 'perro', 'pez', 'vaca', 'pato'],
    intermediate: ['elefante', 'cocodrilo', 'mariposa', 'murciélago', 'jirafa'],
    advanced: ['ornitorrinco', 'rinoceronte', 'hipopótamo', 'chimpancé', 'armadillo']
  },
  food: {
    beginner: ['pan', 'café', 'leche', 'miel', 'arroz'],
    intermediate: ['tortilla', 'ensalada', 'pescado', 'chocolate', 'naranja'],
    advanced: ['espaguetis', 'guacamole', 'champiñones', 'berenjena', 'calabacín']
  },
  countries: {
    beginner: ['españa', 'francia', 'china', 'japón', 'italia'],
    intermediate: ['alemania', 'portugal', 'rusia', 'canadá', 'méxico'],
    advanced: ['australia', 'sudáfrica', 'argentina', 'colombia', 'marruecos']
  },
  sports: {
    beginner: ['fútbol', 'tenis', 'baloncesto', 'natación', 'golf'],
    intermediate: ['voleibol', 'rugby', 'ciclismo', 'atletismo', 'boxeo'],
    advanced: ['esgrima', 'equitación', 'waterpolo', 'gimnasia', 'halterofilia']
  },
  
  // Additional categories from hierarchical structure
  household: {
    beginner: ['mesa', 'silla', 'cama', 'sofá', 'puerta'],
    intermediate: ['ventana', 'cocina', 'nevera', 'lámpara', 'espejo'],
    advanced: ['lavadora', 'microondas', 'aspiradora', 'calefacción', 'cortina']
  },
  rooms: {
    beginner: ['salón', 'cocina', 'baño', 'dormitorio', 'comedor'],
    intermediate: ['despacho', 'garaje', 'terraza', 'jardín', 'sótano'],
    advanced: ['vestíbulo', 'lavandería', 'biblioteca', 'gimnasio', 'trastero']
  },
  foods: {
    beginner: ['pan', 'queso', 'huevo', 'pollo', 'pasta'],
    intermediate: ['carne', 'pescado', 'verdura', 'fruta', 'postre'],
    advanced: ['marisco', 'legumbre', 'salsa', 'condimento', 'especias']
  },
  bodyparts: {
    beginner: ['cabeza', 'brazo', 'pierna', 'mano', 'pie'],
    intermediate: ['hombro', 'codo', 'rodilla', 'dedo', 'cuello'],
    advanced: ['tobillo', 'muñeca', 'pecho', 'espalda', 'abdomen']
  },
  verbs: {
    beginner: ['ser', 'estar', 'ir', 'tener', 'hacer'],
    intermediate: ['poder', 'querer', 'decir', 'ver', 'saber'],
    advanced: ['poner', 'salir', 'venir', 'seguir', 'conocer']
  },
  adjectives: {
    beginner: ['grande', 'pequeño', 'bueno', 'malo', 'bonito'],
    intermediate: ['precioso', 'horrible', 'interesante', 'aburrido', 'difícil'],
    advanced: ['extraordinario', 'espectacular', 'insignificante', 'indescriptible', 'incomparable']
  },
  
  // Fallback for testing only - should not be used in production
  places: {
    beginner: ['casa', 'calle', 'playa', 'parque', 'hotel'],
    intermediate: ['biblioteca', 'restaurante', 'hospital', 'mercado', 'estación'],
    advanced: ['universidad', 'aeropuerto', 'acantilado', 'cementerio', 'catedral']
  }
};

// Different language word lists
const LANGUAGE_WORD_LISTS: Record<string, Partial<typeof WORD_LISTS>> = {
  spanish: WORD_LISTS,
  english: {
    // Basic categories
    numbers: {
      beginner: ['one', 'two', 'three', 'four', 'five'],
      intermediate: ['six', 'seven', 'eight', 'nine', 'ten'],
      advanced: ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen']
    },
    colors: {
      beginner: ['red', 'blue', 'green', 'black', 'white'],
      intermediate: ['yellow', 'purple', 'orange', 'gray', 'pink'],
      advanced: ['violet', 'turquoise', 'brown', 'golden', 'silver']
    },
    days: {
      beginner: ['monday', 'tuesday', 'friday', 'saturday', 'sunday'],
      intermediate: ['wednesday', 'thursday', 'week', 'today', 'tomorrow'],
      advanced: ['day after tomorrow', 'yesterday', 'weekend', 'weekday', 'holiday']
    },
    // Original categories
    animals: {
      beginner: ['cat', 'dog', 'fish', 'cow', 'duck'],
      intermediate: ['elephant', 'crocodile', 'butterfly', 'bat', 'giraffe'],
      advanced: ['platypus', 'rhinoceros', 'hippopotamus', 'chimpanzee', 'armadillo']
    },
    food: {
      beginner: ['bread', 'coffee', 'milk', 'honey', 'rice'],
      intermediate: ['omelet', 'salad', 'fish', 'chocolate', 'orange'],
      advanced: ['spaghetti', 'guacamole', 'mushrooms', 'eggplant', 'zucchini']
    },
    // People categories
    family: {
      beginner: ['father', 'mother', 'son', 'daughter', 'brother'],
      intermediate: ['sister', 'grandfather', 'grandmother', 'uncle', 'aunt'],
      advanced: ['nephew', 'niece', 'brother-in-law', 'sister-in-law', 'son-in-law']
    },
    professions: {
      beginner: ['doctor', 'teacher', 'cook', 'police', 'firefighter'],
      intermediate: ['lawyer', 'engineer', 'nurse', 'architect', 'pilot'],
      advanced: ['carpenter', 'electrician', 'plumber', 'accountant', 'psychologist']
    }
  },
  french: {
    numbers: {
      beginner: ['un', 'deux', 'trois', 'quatre', 'cinq'],
      intermediate: ['six', 'sept', 'huit', 'neuf', 'dix'],
      advanced: ['onze', 'douze', 'treize', 'quatorze', 'quinze']
    },
    colors: {
      beginner: ['rouge', 'bleu', 'vert', 'noir', 'blanc'],
      intermediate: ['jaune', 'violet', 'orange', 'gris', 'rose'],
      advanced: ['pourpre', 'turquoise', 'marron', 'doré', 'argenté']
    },
    animals: {
      beginner: ['chat', 'chien', 'poisson', 'vache', 'canard'],
      intermediate: ['éléphant', 'crocodile', 'papillon', 'chauve-souris', 'girafe'],
      advanced: ['ornithorynque', 'rhinocéros', 'hippopotame', 'chimpanzé', 'tatou']
    },
    family: {
      beginner: ['père', 'mère', 'fils', 'fille', 'frère'],
      intermediate: ['soeur', 'grand-père', 'grand-mère', 'oncle', 'tante'],
      advanced: ['neveu', 'nièce', 'beau-frère', 'belle-soeur', 'gendre']
    }
  },
  german: {
    numbers: {
      beginner: ['eins', 'zwei', 'drei', 'vier', 'fünf'],
      intermediate: ['sechs', 'sieben', 'acht', 'neun', 'zehn'],
      advanced: ['elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn']
    },
    colors: {
      beginner: ['rot', 'blau', 'grün', 'schwarz', 'weiß'],
      intermediate: ['gelb', 'lila', 'orange', 'grau', 'rosa'],
      advanced: ['violett', 'türkis', 'braun', 'golden', 'silbern']
    },
    animals: {
      beginner: ['katze', 'hund', 'fisch', 'kuh', 'ente'],
      intermediate: ['elefant', 'krokodil', 'schmetterling', 'fledermaus', 'giraffe'],
      advanced: ['schnabeltier', 'nashorn', 'nilpferd', 'schimpanse', 'gürteltier']
    }
  }
};

// Ensure each language has a fallback for all categories
Object.keys(LANGUAGE_WORD_LISTS).forEach(language => {
  if (language !== 'english' && language !== 'spanish') {
    // English is our base fallback language
    LANGUAGE_WORD_LISTS[language] = {
      ...LANGUAGE_WORD_LISTS[language]
    };
  }
});

const MAX_ATTEMPTS = 6;

// Update the ExtendedThemeContextType interface
type ExtendedThemeContextType = {
  themeId: string;
  themeClasses: {
    background: string;
    accent: string;
    text: string;
    button: string;
    dangerText: string;
    winMessage: string;
    loseMessage: string;
  };
};

function GameContent({ settings, onBackToMenu, onGameEnd, isFullscreen }: HangmanGameProps) {
  const { themeId, themeClasses } = useTheme() as ExtendedThemeContextType;
  const [themeClassesState, setThemeClassesState] = useState(themeClasses);
  const [word, setWord] = useState('');
  const [wordLetters, setWordLetters] = useState<string[]>([]);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(() => {
    return parseInt(localStorage.getItem('hangmanTotalScore') || '0', 10);
  });
  const [hints, setHints] = useState(3);
  const [showPowerupEffect, setShowPowerupEffect] = useState(false);
  const [animation, setAnimation] = useState<'correct' | 'wrong' | null>(null);
  
  const [soundEffectTriggers, setSoundEffectTriggers] = useState({
    correctLetter: false,
    incorrectLetter: false,
    gameWon: false,
    gameLost: false,
    hintUsed: false
  });
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Add a state to track correct guesses for the Tokyo Nights theme
  const [correctLetterCounter, setCorrectLetterCounter] = useState(0);

  const [showTempleGuardianModal, setShowTempleGuardianModal] = useState(false);
  const [showTokyoNightsModal, setShowTokyoNightsModal] = useState(false);
  const [showSpaceExplorerModal, setShowSpaceExplorerModal] = useState(false);

  // Initialize game
  useEffect(() => {
    const getRandomWord = () => {
      // Check if we're using custom words
      if (settings.category === 'custom' && settings.customWords && settings.customWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * settings.customWords.length);
        return settings.customWords[randomIndex];
      }
      
      try {
        // Get language-specific word lists
        const languageWordLists = LANGUAGE_WORD_LISTS[settings.language] || LANGUAGE_WORD_LISTS.english || {};
        
        // First try to get the category from the selected language
        const categoryWords = languageWordLists[settings.category as keyof typeof WORD_LISTS];
        
        // If category doesn't exist in selected language, try English
        if (!categoryWords && settings.language !== 'english') {
          const englishCategoryWords = LANGUAGE_WORD_LISTS.english?.[settings.category as keyof typeof WORD_LISTS];
          
          if (englishCategoryWords) {
            const difficultyWords = englishCategoryWords[settings.difficulty as keyof (typeof englishCategoryWords)] || 
                                   englishCategoryWords.beginner;
            
            if (difficultyWords && difficultyWords.length > 0) {
              const randomIndex = Math.floor(Math.random() * difficultyWords.length);
              return difficultyWords[randomIndex];
            }
          }
        }
        
        // If we have a valid category, get words for the difficulty
        if (categoryWords) {
          const difficultyWords = categoryWords[settings.difficulty as keyof (typeof categoryWords)] || 
                                 categoryWords.beginner;
          
          if (difficultyWords && difficultyWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * difficultyWords.length);
            return difficultyWords[randomIndex];
          }
        }
        
        // If still no match, use animals as fallback
        console.warn(`Category '${settings.category}' not found, falling back to 'animals'`);
        const animalWords = languageWordLists.animals || LANGUAGE_WORD_LISTS.english?.animals;
        
        if (animalWords) {
          const difficultyWords = animalWords[settings.difficulty as keyof (typeof animalWords)] || 
                                 animalWords.beginner;
          
          if (difficultyWords && difficultyWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * difficultyWords.length);
            return difficultyWords[randomIndex];
          }
        }
        
        // Last resort fallback
        return 'fallback';
      } catch (error) {
        console.error('Error selecting word:', error);
        return 'fallback'; // Emergency fallback word
      }
    };
    
    const newWord = getRandomWord().toLowerCase();
    setWord(newWord);
    setWordLetters([...new Set(newWord.split(''))]);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
    setTimer(0);
    
    // Start the timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [settings]);
  
  // Check win/lose conditions
  useEffect(() => {
    if (gameStatus !== 'playing' || guessedLetters.length === 0) return;
    
    // Check if all letters in the word have been guessed
    const hasWon = wordLetters.every(letter => 
      letter === ' ' || letter === '-' || guessedLetters.includes(letter)
    );
    
    if (hasWon) {
      setGameStatus('won');
      setSoundEffectTriggers(prev => ({...prev, gameWon: true}));
      
      // Stop timer
      if (timerInterval) clearInterval(timerInterval);
      
      // Trigger confetti
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 300);
      
      if (onGameEnd) onGameEnd('win');
    } else if (wrongGuesses >= MAX_ATTEMPTS) {
      setGameStatus('lost');
      setSoundEffectTriggers(prev => ({...prev, gameLost: true}));
      
      // Stop timer
      if (timerInterval) clearInterval(timerInterval);
      
      if (onGameEnd) onGameEnd('lose');
    }
  }, [guessedLetters, wordLetters, wrongGuesses, gameStatus, timerInterval, onGameEnd]);
  
  const handleLetterGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter.toLowerCase())) {
      return;
    }
    
    const lowerLetter = letter.toLowerCase();
    const newGuessedLetters = [...guessedLetters, lowerLetter];
    setGuessedLetters(newGuessedLetters);
    
    if (word.includes(lowerLetter)) {
      // Correct guess
      setSoundEffectTriggers(prev => ({...prev, correctLetter: true}));
      setTimeout(() => setSoundEffectTriggers(prev => ({...prev, correctLetter: false})), 10);
      
      // Increment correct letter counter for the Tokyo Nights theme
      if (themeId === 'tokyo') {
        setCorrectLetterCounter(prev => prev + 1);
      }
      
      // Check if the player has won
      const isWin = wordLetters.every(letter => newGuessedLetters.includes(letter));
      if (isWin) {
        setSoundEffectTriggers(prev => ({...prev, gameWon: true}));
        setTimeout(() => setSoundEffectTriggers(prev => ({...prev, gameWon: false})), 10);
        
        setGameStatus('won');
        const newScore = calculateScore();
        setScore(newScore);
        
        // Add the newScore to totalScore
        const currentTotal = parseInt(localStorage.getItem('hangmanTotalScore') || '0', 10);
        const updatedTotal = currentTotal + newScore;
        localStorage.setItem('hangmanTotalScore', updatedTotal.toString());
        
        // Save the score to localStorage
        const savedScores = JSON.parse(localStorage.getItem('hangmanScores') || '[]');
        const newSavedScores = [
          ...savedScores,
          {
            date: new Date().toISOString(),
            category: settings.category,
            difficulty: settings.difficulty,
            score: newScore,
            word: word
          }
        ];
        localStorage.setItem('hangmanScores', JSON.stringify(newSavedScores));
      }
    } else {
      // Wrong guess
      setSoundEffectTriggers(prev => ({...prev, incorrectLetter: true}));
      setTimeout(() => setSoundEffectTriggers(prev => ({...prev, incorrectLetter: false})), 10);
      
      setWrongGuesses(prev => prev + 1);
      
      // Check if the player has lost
      if (wrongGuesses + 1 >= MAX_ATTEMPTS) {
        setSoundEffectTriggers(prev => ({...prev, gameLost: true}));
        setTimeout(() => setSoundEffectTriggers(prev => ({...prev, gameLost: false})), 10);
        
        setGameStatus('lost');
      }
    }
  };
  
  const handleHint = () => {
    if (hints <= 0 || gameStatus !== 'playing') return;
    
    const unguessedLetters = wordLetters.filter(letter => !guessedLetters.includes(letter));
    if (unguessedLetters.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * unguessedLetters.length);
    const hintLetter = unguessedLetters[randomIndex];
    
    setHints(prev => prev - 1);
    setSoundEffectTriggers(prev => ({...prev, hintUsed: true}));
    setTimeout(() => setSoundEffectTriggers(prev => ({...prev, hintUsed: false})), 10);
    setShowPowerupEffect(true);
    setTimeout(() => setShowPowerupEffect(false), 800);
    handleLetterGuess(hintLetter);
  };
  
  const resetGame = () => {
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
    setTimer(0);
    setScore(0);
    
    const getRandomWord = () => {
      // Check if we're using custom words
      if (settings.category === 'custom' && settings.customWords && settings.customWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * settings.customWords.length);
        return settings.customWords[randomIndex];
      }
      
      try {
        // Get language-specific word lists
        const languageWordLists = LANGUAGE_WORD_LISTS[settings.language] || LANGUAGE_WORD_LISTS.english || {};
        
        // First try to get the category from the selected language
        const categoryWords = languageWordLists[settings.category as keyof typeof WORD_LISTS];
        
        // If category doesn't exist in selected language, try English
        if (!categoryWords && settings.language !== 'english') {
          const englishCategoryWords = LANGUAGE_WORD_LISTS.english?.[settings.category as keyof typeof WORD_LISTS];
          
          if (englishCategoryWords) {
            const difficultyWords = englishCategoryWords[settings.difficulty as keyof (typeof englishCategoryWords)] || 
                                   englishCategoryWords.beginner;
            
            if (difficultyWords && difficultyWords.length > 0) {
              const randomIndex = Math.floor(Math.random() * difficultyWords.length);
              return difficultyWords[randomIndex];
            }
          }
        }
        
        // If we have a valid category, get words for the difficulty
        if (categoryWords) {
          const difficultyWords = categoryWords[settings.difficulty as keyof (typeof categoryWords)] || 
                                 categoryWords.beginner;
          
          if (difficultyWords && difficultyWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * difficultyWords.length);
            return difficultyWords[randomIndex];
          }
        }
        
        // If still no match, use animals as fallback
        console.warn(`Category '${settings.category}' not found, falling back to 'animals'`);
        const animalWords = languageWordLists.animals || LANGUAGE_WORD_LISTS.english?.animals;
        
        if (animalWords) {
          const difficultyWords = animalWords[settings.difficulty as keyof (typeof animalWords)] || 
                                 animalWords.beginner;
          
          if (difficultyWords && difficultyWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * difficultyWords.length);
            return difficultyWords[randomIndex];
          }
        }
        
        // Last resort fallback
        return 'fallback';
      } catch (error) {
        console.error('Error selecting word:', error);
        return 'fallback'; // Emergency fallback word
      }
    };
    
    const newWord = getRandomWord().toLowerCase();
    setWord(newWord);
    setWordLetters([...new Set(newWord.split(''))]);
    
    // Restart the timer
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };
  
  const calculateScore = () => {
    // Base score based on difficulty
    let baseScore = 100;
    if (settings.difficulty === 'intermediate') baseScore = 200;
    if (settings.difficulty === 'advanced') baseScore = 300;
    if (settings.difficulty === 'expert') baseScore = 400;
    
    // Decrease score based on wrong guesses and time
    const wrongGuessPenalty = wrongGuesses * 10;
    const timePenalty = Math.floor(timer / 10);
    
    return Math.max(baseScore - wrongGuessPenalty - timePenalty, 50);
  };
  
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const renderThematicAnimation = () => {
    if (themeId === 'tokyo') {
      return <TokyoNightsAnimation
        mistakes={wrongGuesses}
        maxMistakes={MAX_ATTEMPTS}
      />;
    }
    
    if (themeId === 'temple') {
      return <LavaTempleAnimation mistakes={wrongGuesses} maxMistakes={MAX_ATTEMPTS} />;
    }
    
    if (themeId === 'space') {
      return <SpaceExplorerAnimation mistakes={wrongGuesses} maxMistakes={MAX_ATTEMPTS} />;
    }
    
    // Default pirate theme animation
    return <PirateAdventureAnimation mistakes={wrongGuesses} maxMistakes={MAX_ATTEMPTS} />;
  };
  
  const renderKeyboard = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    return (
      <div className="flex flex-wrap justify-center gap-1 mt-6">
        {alphabet.map((letter) => {
          const isUsed = guessedLetters.includes(letter.toLowerCase());
          const isCorrect = isUsed && word.includes(letter.toLowerCase());
          const isWrong = isUsed && !word.includes(letter.toLowerCase());
          
          let buttonClass = "w-10 h-12 text-lg font-semibold rounded-lg";
          
          if (isCorrect) {
            // Apply theme-specific styles for correct letters
            buttonClass += ` ${themeClassesState.accent} text-white`;
          } else if (isWrong) {
            // Apply styles for wrong letters
            buttonClass += " bg-red-600 text-white";
          } else if (!isUsed) {
            // Apply styles for unused letters
            buttonClass += " bg-violet-500 hover:bg-violet-600 text-white";
          } else {
            // Fallback style
            buttonClass += " bg-gray-300 text-gray-500";
          }
          
          return (
            <button
              key={letter}
              onClick={() => handleLetterGuess(letter)}
              disabled={isUsed || gameStatus !== 'playing'}
              className={buttonClass}
            >
              {letter}
            </button>
          );
        })}
      </div>
    );
  };
  
  const renderWord = () => {
    return (
      <div className="flex justify-center space-x-2 my-6">
        {word.split('').map((letter, index) => (
          <div key={index} className="text-center">
            <div className={`w-10 h-14 flex items-center justify-center rounded-lg ${
              guessedLetters.includes(letter) 
                ? themeClassesState.accent + ' text-white'
                : 'bg-gray-800 bg-opacity-50'
            }`}>
              <span className="text-2xl font-bold">
                {guessedLetters.includes(letter) ? letter.toUpperCase() : ''}
              </span>
            </div>
            <div className="w-10 h-1 mt-1 bg-white bg-opacity-30 rounded"></div>
          </div>
        ))}
      </div>
    );
  };
  
  // Customize text based on theme
  useEffect(() => {
    if (themeId === 'tokyo') {
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-slate-900',
        text: 'text-cyan-50',
        accent: 'bg-pink-600',
        button: 'bg-cyan-600 hover:bg-cyan-700',
        dangerText: 'Password Attempts'
      });
    } else if (themeId === 'temple') {
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-amber-900',
        text: 'text-amber-50',
        accent: 'bg-amber-600',
        button: 'bg-amber-700 hover:bg-amber-800',
        dangerText: 'Escape Chances'
      });
    } else if (themeId === 'space') {
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-slate-800',
        text: 'text-purple-50',
        accent: 'bg-purple-600',
        button: 'bg-purple-700 hover:bg-purple-800',
        dangerText: 'Oxygen Level'
      });
    } else {
      // Default pirate theme
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-blue-900',
        text: 'text-amber-50',
        accent: 'bg-amber-600',
        button: 'bg-amber-700 hover:bg-amber-800',
        dangerText: 'Lives Remaining'
      });
    }
  }, [themeId, themeClasses]);

  // Initialize background music
  useEffect(() => {
    // Create audio element for background music
    if (typeof window !== 'undefined') {
      backgroundMusicRef.current = new Audio();
      
      // Set the music based on theme
      if (themeId === 'tokyo') {
        backgroundMusicRef.current.src = '/games/hangman/sounds/songs/tokyonights.mp3';
      } else if (themeId === 'temple') {
        backgroundMusicRef.current.src = '/games/hangman/sounds/songs/lavatemple.mp3';
      } else if (themeId === 'space') {
        backgroundMusicRef.current.src = '/games/hangman/sounds/songs/spacevoyager.mp3';
      } else {
        backgroundMusicRef.current.src = '/games/hangman/sounds/songs/pirateadventure.mp3';
      }
      
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.3;
      
      // Try to autoplay (may be rejected by browser)
      backgroundMusicRef.current.play().then(() => {
        setMusicEnabled(true);
      }).catch(e => {
        console.log("Autoplay prevented. Music will play on first user interaction.");
        // Will play on first user interaction
      });
    }
    
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, [themeId]);

  // Toggle background music
  const toggleMusic = () => {
    if (!backgroundMusicRef.current) return;
    
    if (musicEnabled) {
      backgroundMusicRef.current.pause();
    } else {
      backgroundMusicRef.current.play().catch(e => console.error("Error playing music:", e));
    }
    
    setMusicEnabled(prev => !prev);
  };
  
  // Enable playing music on first user interaction
  useEffect(() => {
    const playMusicOnInteraction = () => {
      if (backgroundMusicRef.current && !musicEnabled) {
        backgroundMusicRef.current.play().then(() => {
          setMusicEnabled(true);
        }).catch(e => console.error("Error playing music:", e));
      }
      
      // Remove event listeners after first interaction
      document.removeEventListener('click', playMusicOnInteraction);
      document.removeEventListener('keydown', playMusicOnInteraction);
    };
    
    document.addEventListener('click', playMusicOnInteraction);
    document.addEventListener('keydown', playMusicOnInteraction);
    
    return () => {
      document.removeEventListener('click', playMusicOnInteraction);
      document.removeEventListener('keydown', playMusicOnInteraction);
    };
  }, [musicEnabled]);

  // Add an effect to show the theme-specific modals when theme is selected
  useEffect(() => {
    if (settings.theme === 'lava-temple') {
      // Check if it's the first time showing this modal in this session
      const hasSeenModal = sessionStorage.getItem('has-seen-temple-guardian-modal');
      if (!hasSeenModal) {
        setShowTempleGuardianModal(true);
        sessionStorage.setItem('has-seen-temple-guardian-modal', 'true');
      }
    }
    
    // Show Tokyo Nights modal when theme is tokyo
    if (settings.theme === 'tokyo') {
      // Check if it's the first time showing this modal in this session
      const hasSeenModal = sessionStorage.getItem('has-seen-tokyo-nights-modal');
      if (!hasSeenModal) {
        setShowTokyoNightsModal(true);
        sessionStorage.setItem('has-seen-tokyo-nights-modal', 'true');
      }
    }
    
    // Show Space Explorer modal when theme is space
    if (settings.theme === 'space') {
      // Check if it's the first time showing this modal in this session
      const hasSeenModal = sessionStorage.getItem('has-seen-space-explorer-modal');
      if (!hasSeenModal) {
        setShowSpaceExplorerModal(true);
        sessionStorage.setItem('has-seen-space-explorer-modal', 'true');
      }
    }
  }, [settings.theme]);

  return (
    <div className={`relative ${themeClassesState.background} ${themeClassesState.text} p-6 rounded-xl shadow-lg ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
      {/* Sound effects component */}
      <SoundEffects
        theme={settings.theme}
        onCorrect={soundEffectTriggers.correctLetter}
        onIncorrect={soundEffectTriggers.incorrectLetter}
        onWin={soundEffectTriggers.gameWon}
        onLose={soundEffectTriggers.gameLost}
        onHint={soundEffectTriggers.hintUsed}
        muted={!soundEnabled}
      />
      
      {/* Top navigation and info bar */}
      <div className="flex justify-between items-center mb-4">
        {!isFullscreen && (
          <button 
            onClick={onBackToMenu}
            className="px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center"
          >
            Back to Menu
          </button>
        )}
        
        {/* Game info in a single line */}
        <div className="flex-1 flex items-center justify-center gap-4">
          <div className="text-sm font-medium">
            {settings.category.charAt(0).toUpperCase() + settings.category.slice(1)} - {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)}
          </div>
          
          <div className="text-sm opacity-75">
            {formatTime(timer)}
          </div>
          
          <div className="text-sm">
            <span className="opacity-75">
              {themeClassesState.dangerText}:
            </span> {MAX_ATTEMPTS - wrongGuesses}/{MAX_ATTEMPTS}
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="flex items-center space-x-2">
          {/* Sound toggle button */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            title={soundEnabled ? "Mute sound effects" : "Unmute sound effects"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
          
          {/* Music toggle button */}
          <button
            onClick={toggleMusic}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            title={musicEnabled ? "Mute music" : "Play music"}
          >
            {musicEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          
          {/* Hint button */}
          <button 
            onClick={handleHint}
            disabled={hints <= 0 || gameStatus !== 'playing'}
            className={`
              relative flex items-center gap-1 px-3 py-1 rounded-lg
              ${hints > 0 && gameStatus === 'playing' 
                ? `${themeClassesState.button}`
                : 'bg-gray-400 opacity-50'
              }
              text-white text-sm font-medium
            `}
          >
            <Zap size={16} />
            Hint
            <span className="ml-1">({hints})</span>
            
            {showPowerupEffect && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 2], opacity: [0, 1, 0] }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 rounded-lg bg-white bg-opacity-30 pointer-events-none"
              />
            )}
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-6">
        <div 
          className="h-full rounded-full transition-all duration-500" 
          style={{ 
            width: `${100 - (wrongGuesses / MAX_ATTEMPTS * 100)}%`,
            backgroundColor: wrongGuesses > 4 ? 'red' : wrongGuesses > 2 ? 'orange' : 'green',
          }}
        ></div>
      </div>
      
      {renderThematicAnimation()}
      
      <div className={`${isFullscreen ? 'flex-grow flex flex-col justify-center' : ''}`}>
        {gameStatus === 'playing' ? (
          <div className={`transition-all duration-300 ${animation === 'wrong' ? 'scale-105' : animation === 'correct' ? 'scale-95' : ''}`}>
            {renderWord()}
            {renderKeyboard()}
          </div>
        ) : (
          <div className="text-center my-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {gameStatus === 'won' 
                ? (themeClassesState.winMessage) 
                : (themeClassesState.loseMessage)}
            </h2>
            
            <p className="text-xl mb-4">
              {gameStatus === 'won' 
                ? `Great job! You guessed the word correctly.` 
                : `The word was: ${word.toUpperCase()}`}
            </p>
            
            {gameStatus === 'won' && (
              <div className="my-4 text-lg">
                <p>Score: <span className="font-bold">{calculateScore()}</span></p>
              </div>
            )}
            
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={resetGame}
                className={`${themeClassesState.button} py-3 px-6 rounded-lg font-bold text-white`}
              >
                Play Again
              </button>
              
              <button
                onClick={onBackToMenu}
                className="bg-gray-700 hover:bg-gray-600 py-3 px-6 rounded-lg font-bold text-white"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Theme-specific Modals */}
      <TempleGuardianModal 
        isOpen={showTempleGuardianModal} 
        onClose={() => setShowTempleGuardianModal(false)} 
      />
      
      <TokyoNightsModal 
        isOpen={showTokyoNightsModal} 
        onClose={() => setShowTokyoNightsModal(false)} 
      />
      
      <SpaceExplorerModal 
        isOpen={showSpaceExplorerModal} 
        onClose={() => setShowSpaceExplorerModal(false)} 
      />
    </div>
  );
}

export default function HangmanGame(props: HangmanGameProps) {
  return (
    <ThemeProvider themeId={props.settings.theme}>
      <GameContent {...props} />
    </ThemeProvider>
  );
} 
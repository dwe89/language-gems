'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './ThemeProvider';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import TokyoNightsAnimation from './themes/TokyoNightsAnimation';
import LavaTempleAnimation from './themes/LavaTempleAnimation';
import SpaceExplorerAnimation from './themes/SpaceExplorerAnimation';
import PirateAdventureAnimation from './themes/PirateAdventureAnimation';
import SoundEffects from './SoundEffects';

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
  places: {
    beginner: ['casa', 'calle', 'playa', 'parque', 'hotel'],
    intermediate: ['biblioteca', 'restaurante', 'hospital', 'mercado', 'estación'],
    advanced: ['universidad', 'aeropuerto', 'acantilado', 'cementerio', 'catedral']
  }
};

// Different language word lists
const LANGUAGE_WORD_LISTS: Record<string, typeof WORD_LISTS> = {
  spanish: WORD_LISTS,
  english: {
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
    places: {
      beginner: ['house', 'street', 'beach', 'park', 'hotel'],
      intermediate: ['library', 'restaurant', 'hospital', 'market', 'station'],
      advanced: ['university', 'airport', 'cliff', 'cemetery', 'cathedral']
    }
  },
  french: {
    animals: {
      beginner: ['chat', 'chien', 'poisson', 'vache', 'canard'],
      intermediate: ['éléphant', 'crocodile', 'papillon', 'chauve-souris', 'girafe'],
      advanced: ['ornithorynque', 'rhinocéros', 'hippopotame', 'chimpanzé', 'tatou']
    },
    food: {
      beginner: ['pain', 'café', 'lait', 'miel', 'riz'],
      intermediate: ['omelette', 'salade', 'poisson', 'chocolat', 'orange'],
      advanced: ['spaghetti', 'guacamole', 'champignons', 'aubergine', 'courgette']
    },
    places: {
      beginner: ['maison', 'rue', 'plage', 'parc', 'hôtel'],
      intermediate: ['bibliothèque', 'restaurant', 'hôpital', 'marché', 'gare'],
      advanced: ['université', 'aéroport', 'falaise', 'cimetière', 'cathédrale']
    }
  },
  german: {
    animals: {
      beginner: ['katze', 'hund', 'fisch', 'kuh', 'ente'],
      intermediate: ['elefant', 'krokodil', 'schmetterling', 'fledermaus', 'giraffe'],
      advanced: ['schnabeltier', 'nashorn', 'nilpferd', 'schimpanse', 'gürteltier']
    },
    food: {
      beginner: ['brot', 'kaffee', 'milch', 'honig', 'reis'],
      intermediate: ['omelett', 'salat', 'fisch', 'schokolade', 'orange'],
      advanced: ['spaghetti', 'guacamole', 'pilze', 'aubergine', 'zucchini']
    },
    places: {
      beginner: ['haus', 'straße', 'strand', 'park', 'hotel'],
      intermediate: ['bibliothek', 'restaurant', 'krankenhaus', 'markt', 'bahnhof'],
      advanced: ['universität', 'flughafen', 'klippe', 'friedhof', 'kathedrale']
    }
  },
  italian: {
    animals: {
      beginner: ['gatto', 'cane', 'pesce', 'mucca', 'anatra'],
      intermediate: ['elefante', 'coccodrillo', 'farfalla', 'pipistrello', 'giraffa'],
      advanced: ['ornitorinco', 'rinoceronte', 'ippopotamo', 'scimpanzé', 'armadillo']
    },
    food: {
      beginner: ['pane', 'caffè', 'latte', 'miele', 'riso'],
      intermediate: ['frittata', 'insalata', 'pesce', 'cioccolato', 'arancia'],
      advanced: ['spaghetti', 'guacamole', 'funghi', 'melanzana', 'zucchina']
    },
    places: {
      beginner: ['casa', 'strada', 'spiaggia', 'parco', 'albergo'],
      intermediate: ['biblioteca', 'ristorante', 'ospedale', 'mercato', 'stazione'],
      advanced: ['università', 'aeroporto', 'scogliera', 'cimitero', 'cattedrale']
    }
  },
  japanese: {
    animals: {
      beginner: ['inu', 'neko', 'sakana', 'uma', 'tori'],
      intermediate: ['kitsune', 'tanuki', 'saru', 'kuma', 'kaeru'],
      advanced: ['fukurou', 'kabutomushi', 'rikugame', 'raion', 'hakucho']
    },
    food: {
      beginner: ['gohan', 'miso', 'nori', 'sushi', 'ramen'],
      intermediate: ['tempura', 'onigiri', 'mochi', 'yakitori', 'udon'],
      advanced: ['okonomiyaki', 'takoyaki', 'sukiyaki', 'shabu shabu', 'yakiniku']
    },
    places: {
      beginner: ['ie', 'mise', 'eki', 'koen', 'gakko'],
      intermediate: ['toshokan', 'byoin', 'shima', 'mura', 'shiro'],
      advanced: ['daigaku', 'jinja', 'onsen', 'suizokukan', 'bijutsukan']
    }
  },
  mandarin: {
    animals: {
      beginner: ['gou', 'mao', 'yu', 'niu', 'ya'],
      intermediate: ['xiong', 'she', 'xiongmao', 'hou', 'yang'],
      advanced: ['haixing', 'daxiang', 'feiniu', 'haigui', 'tuoniao']
    },
    food: {
      beginner: ['fan', 'cha', 'mian', 'jiao', 'yu'],
      intermediate: ['jiaozi', 'chaofan', 'huntun', 'doufu', 'baozi'],
      advanced: ['pekingyazi', 'huoguou', 'chashao', 'dongporou', 'tangyuan']
    },
    places: {
      beginner: ['jia', 'lu', 'dian', 'yuan', 'xue'],
      intermediate: ['tushuguan', 'yiyuan', 'gongyuan', 'shangdian', 'jiuba'],
      advanced: ['bowuguan', 'gongyuan', 'youleyuan', 'ditiezhan', 'daxue']
    }
  },
  portuguese: {
    animals: {
      beginner: ['gato', 'cao', 'peixe', 'vaca', 'pato'],
      intermediate: ['elefante', 'jacare', 'borboleta', 'morcego', 'girafa'],
      advanced: ['ornitorrinco', 'rinoceronte', 'hipopotamo', 'chimpanze', 'tatu']
    },
    food: {
      beginner: ['pao', 'cafe', 'leite', 'mel', 'arroz'],
      intermediate: ['omelete', 'salada', 'peixe', 'chocolate', 'laranja'],
      advanced: ['espaguete', 'guacamole', 'cogumelos', 'berinjela', 'abobrinha']
    },
    places: {
      beginner: ['casa', 'rua', 'praia', 'parque', 'hotel'],
      intermediate: ['biblioteca', 'restaurante', 'hospital', 'mercado', 'estacao'],
      advanced: ['universidade', 'aeroporto', 'penhasco', 'cemiterio', 'catedral']
    }
  },
  arabic: {
    animals: {
      beginner: ['qitt', 'kalb', 'samak', 'baqara', 'batta'],
      intermediate: ['feel', 'timsah', 'farasha', 'watwat', 'zarafa'],
      advanced: ['karkadann', 'faras', 'qird', 'thuraya', 'nasir']
    },
    food: {
      beginner: ['khobz', 'qahwa', 'halib', 'asal', 'ruz'],
      intermediate: ['hummus', 'falafel', 'shawarma', 'tabbouleh', 'fattoush'],
      advanced: ['baklava', 'kunafa', 'mansaf', 'maqluba', 'muhammara']
    },
    places: {
      beginner: ['bayt', 'sharia', 'shati', 'hadeeqa', 'funduq'],
      intermediate: ['maktaba', 'matam', 'mustashfa', 'suq', 'mahatta'],
      advanced: ['jamia', 'matar', 'qala', 'maqbara', 'masjid']
    }
  },
  russian: {
    animals: {
      beginner: ['kot', 'sobaka', 'ryba', 'korova', 'utka'],
      intermediate: ['slon', 'krokodil', 'babochka', 'letuchaya mysh', 'zhiraf'],
      advanced: ['utkonos', 'nosorog', 'begemot', 'shimpanze', 'bronenosts']
    },
    food: {
      beginner: ['khleb', 'kofe', 'moloko', 'myod', 'ris'],
      intermediate: ['omlet', 'salat', 'ryba', 'shokolad', 'apelsin'],
      advanced: ['borshch', 'pelmeni', 'bliny', 'pirogi', 'olivier']
    },
    places: {
      beginner: ['dom', 'ulitsa', 'plyazh', 'park', 'gostinitsa'],
      intermediate: ['biblioteka', 'restoran', 'bolnitsa', 'rynok', 'stantsiya'],
      advanced: ['universitet', 'aeroport', 'utyes', 'kladbishche', 'sobor']
    }
  }
};

const MAX_ATTEMPTS = 6;

function GameContent({ settings, onBackToMenu, onGameEnd, isFullscreen }: HangmanGameProps) {
  const { themeId, themeClasses } = useTheme();
  const [word, setWord] = useState('');
  const [wordLetters, setWordLetters] = useState<string[]>([]);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [hints, setHints] = useState(3);
  const [score, setScore] = useState(0);
  const [showPowerupEffect, setShowPowerupEffect] = useState(false);
  const [animation, setAnimation] = useState<'correct' | 'wrong' | null>(null);
  
  const [soundEffects, setSoundEffects] = useState({
    correctLetter: false,
    incorrectLetter: false,
    gameWon: false,
    gameLost: false,
    hintUsed: false
  });
  
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize game
  useEffect(() => {
    const getRandomWord = () => {
      // Check if we're using custom words
      if (settings.category === 'custom' && settings.customWords && settings.customWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * settings.customWords.length);
        return settings.customWords[randomIndex];
      }
      
      // Get language-specific word lists
      const languageWordLists = LANGUAGE_WORD_LISTS[settings.language] || LANGUAGE_WORD_LISTS.english;
      
      // Get category and difficulty word lists
      const categoryWords = languageWordLists[settings.category as keyof typeof WORD_LISTS] || languageWordLists.animals;
      const difficultyWords = categoryWords[settings.difficulty as keyof typeof categoryWords] || categoryWords.beginner;
      
      const randomIndex = Math.floor(Math.random() * difficultyWords.length);
      return difficultyWords[randomIndex];
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
      setSoundEffects(prev => ({...prev, gameWon: true}));
      
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
      setSoundEffects(prev => ({...prev, gameLost: true}));
      
      // Stop timer
      if (timerInterval) clearInterval(timerInterval);
      
      if (onGameEnd) onGameEnd('lose');
    }
  }, [guessedLetters, wordLetters, wrongGuesses, gameStatus, timerInterval, onGameEnd]);
  
  const handleLetterGuess = (letter: string) => {
    if (guessedLetters.includes(letter.toLowerCase()) || gameStatus !== 'playing') {
      return;
    }
    
    const lowerLetter = letter.toLowerCase();
    const newGuessedLetters = [...guessedLetters, lowerLetter];
    setGuessedLetters(newGuessedLetters);
    
    const isCorrectGuess = word.includes(lowerLetter);
    
    // Reset previous sound effects
    setSoundEffects({
      correctLetter: false,
      incorrectLetter: false,
      gameWon: false,
      gameLost: false,
      hintUsed: false
    });
    
    if (isCorrectGuess) {
      setAnimation('correct');
      setTimeout(() => setAnimation(null), 300);
      setSoundEffects(prev => ({...prev, correctLetter: true}));
    } else {
      setAnimation('wrong');
      setTimeout(() => setAnimation(null), 300);
      setSoundEffects(prev => ({...prev, incorrectLetter: true}));
      setWrongGuesses(prev => prev + 1);
    }
  };
  
  const getHint = () => {
    if (hints <= 0 || gameStatus !== 'playing') return;
    
    // Find a letter that is in the word but not guessed yet
    const unguessedLetters = wordLetters.filter(char => 
      !guessedLetters.includes(char) && char !== ' ' && char !== '-'
    );
    
    if (unguessedLetters.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * unguessedLetters.length);
    const hintLetter = unguessedLetters[randomIndex];
    
    // Don't subtract hints if the letter is already guessed
    if (guessedLetters.includes(hintLetter)) return;
    
    setHints(prev => prev - 1);
    setSoundEffects(prev => ({...prev, hintUsed: true}));
    setShowPowerupEffect(true);
    setTimeout(() => setShowPowerupEffect(false), 800);
    handleLetterGuess(hintLetter);
  };
  
  const resetGame = () => {
    // Get a new word
    const getRandomWord = () => {
      // Check if we're using custom words
      if (settings.category === 'custom' && settings.customWords && settings.customWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * settings.customWords.length);
        return settings.customWords[randomIndex];
      }
      
      // Get language-specific word lists
      const languageWordLists = LANGUAGE_WORD_LISTS[settings.language] || LANGUAGE_WORD_LISTS.english;
      
      // Get category and difficulty word lists
      const categoryWords = languageWordLists[settings.category as keyof typeof WORD_LISTS] || languageWordLists.animals;
      const difficultyWords = categoryWords[settings.difficulty as keyof typeof categoryWords] || categoryWords.beginner;
      
      const randomIndex = Math.floor(Math.random() * difficultyWords.length);
      return difficultyWords[randomIndex];
    };
    
    const newWord = getRandomWord().toLowerCase();
    setWord(newWord);
    setWordLetters([...new Set(newWord.split(''))]);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
    setTimer(0);
    
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
      return <TokyoNightsAnimation mistakes={wrongGuesses} maxMistakes={MAX_ATTEMPTS} />;
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
            buttonClass += ` ${themeClasses.accent} text-white`;
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
                ? themeClasses.accent + ' text-white'
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
  
  return (
    <div className={`relative ${themeClasses.background} ${themeClasses.text} p-6 rounded-xl shadow-lg ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
      {/* Sound effects component */}
      <SoundEffects
        theme={settings.theme}
        onCorrect={soundEffects.correctLetter}
        onIncorrect={soundEffects.incorrectLetter}
        onWin={soundEffects.gameWon}
        onLose={soundEffects.gameLost}
        onHint={soundEffects.hintUsed}
        muted={!soundEnabled}
      />
      
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={onBackToMenu}
          className={`${themeClasses.button} px-4 py-2 rounded-lg text-white`}
        >
          Back to Menu
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
            title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={getHint}
            disabled={hints <= 0 || gameStatus !== 'playing'}
            className={`
              relative flex items-center gap-1 px-3 py-1 rounded-lg
              ${hints > 0 && gameStatus === 'playing' 
                ? `${themeClasses.button}`
                : 'bg-gray-400 opacity-50'
              }
              text-white
            `}
          >
            <Zap size={16} />
            <span>Hint</span>
            <span className="ml-1">({hints})</span>
            
            {showPowerupEffect && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-yellow-400 rounded-lg"
                style={{ zIndex: -1 }}
              />
            )}
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="text-center mb-2">
          <h2 className="text-lg md:text-xl">{settings.category.charAt(0).toUpperCase() + settings.category.slice(1)} - {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)}</h2>
          <p className="text-sm opacity-75">{formatTime(timer)}</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm">
            <span className="opacity-75">
              {themeClasses.dangerText}:
            </span> {MAX_ATTEMPTS - wrongGuesses}/{MAX_ATTEMPTS}
          </div>
          
          <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ 
                width: `${100 - (wrongGuesses / MAX_ATTEMPTS * 100)}%`,
                backgroundColor: wrongGuesses > 4 ? 'red' : wrongGuesses > 2 ? 'orange' : 'green',
              }}
            ></div>
          </div>
        </div>
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
                ? (themeClasses.winMessage) 
                : (themeClasses.loseMessage)}
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
                className={`${themeClasses.button} py-3 px-6 rounded-lg font-bold text-white`}
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
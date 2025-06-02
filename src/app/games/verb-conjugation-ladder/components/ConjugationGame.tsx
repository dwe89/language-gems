'use client';

import React, { useState, useEffect, useRef, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ConjugationGameProps {
  settings: {
    difficulty: string;
    language: string;
    tense: string;
    theme: string;
  };
  onBackToMenu: () => void;
  onGameEnd?: (stats: {
    correctAnswers: number;
    incorrectAnswers: number;
    levelReached: number;
    timeTaken: number;
  }) => void;
  isFullscreen?: boolean;
}

// Sample verb data - in a real app, this would be much more extensive
const VERBS = {
  spanish: {
    present: [
      { infinitive: 'hablar', pronoun: 'yo', conjugated: 'hablo' },
      { infinitive: 'hablar', pronoun: 'tú', conjugated: 'hablas' },
      { infinitive: 'hablar', pronoun: 'él/ella', conjugated: 'habla' },
      { infinitive: 'hablar', pronoun: 'nosotros', conjugated: 'hablamos' },
      { infinitive: 'hablar', pronoun: 'vosotros', conjugated: 'habláis' },
      { infinitive: 'hablar', pronoun: 'ellos/ellas', conjugated: 'hablan' },
      { infinitive: 'comer', pronoun: 'yo', conjugated: 'como' },
      { infinitive: 'comer', pronoun: 'tú', conjugated: 'comes' },
      { infinitive: 'comer', pronoun: 'él/ella', conjugated: 'come' },
      { infinitive: 'comer', pronoun: 'nosotros', conjugated: 'comemos' },
      { infinitive: 'comer', pronoun: 'vosotros', conjugated: 'coméis' },
      { infinitive: 'comer', pronoun: 'ellos/ellas', conjugated: 'comen' },
      { infinitive: 'vivir', pronoun: 'yo', conjugated: 'vivo' },
      { infinitive: 'vivir', pronoun: 'tú', conjugated: 'vives' },
      { infinitive: 'vivir', pronoun: 'él/ella', conjugated: 'vive' },
      { infinitive: 'vivir', pronoun: 'nosotros', conjugated: 'vivimos' },
      { infinitive: 'vivir', pronoun: 'vosotros', conjugated: 'vivís' },
      { infinitive: 'vivir', pronoun: 'ellos/ellas', conjugated: 'viven' },
      { infinitive: 'ser', pronoun: 'yo', conjugated: 'soy' },
      { infinitive: 'ser', pronoun: 'tú', conjugated: 'eres' },
      { infinitive: 'ser', pronoun: 'él/ella', conjugated: 'es' },
      { infinitive: 'ser', pronoun: 'nosotros', conjugated: 'somos' },
      { infinitive: 'ser', pronoun: 'vosotros', conjugated: 'sois' },
      { infinitive: 'ser', pronoun: 'ellos/ellas', conjugated: 'son' },
      { infinitive: 'ir', pronoun: 'yo', conjugated: 'voy' },
      { infinitive: 'ir', pronoun: 'tú', conjugated: 'vas' },
      { infinitive: 'ir', pronoun: 'él/ella', conjugated: 'va' },
      { infinitive: 'ir', pronoun: 'nosotros', conjugated: 'vamos' },
      { infinitive: 'ir', pronoun: 'vosotros', conjugated: 'vais' },
      { infinitive: 'ir', pronoun: 'ellos/ellas', conjugated: 'van' },
    ],
    past: [
      { infinitive: 'hablar', pronoun: 'yo', conjugated: 'hablé' },
      { infinitive: 'hablar', pronoun: 'tú', conjugated: 'hablaste' },
      { infinitive: 'hablar', pronoun: 'él/ella', conjugated: 'habló' },
      { infinitive: 'hablar', pronoun: 'nosotros', conjugated: 'hablamos' },
      { infinitive: 'hablar', pronoun: 'vosotros', conjugated: 'hablasteis' },
      { infinitive: 'hablar', pronoun: 'ellos/ellas', conjugated: 'hablaron' },
      { infinitive: 'comer', pronoun: 'yo', conjugated: 'comí' },
      { infinitive: 'comer', pronoun: 'tú', conjugated: 'comiste' },
      { infinitive: 'comer', pronoun: 'él/ella', conjugated: 'comió' },
      { infinitive: 'comer', pronoun: 'nosotros', conjugated: 'comimos' },
      { infinitive: 'comer', pronoun: 'vosotros', conjugated: 'comisteis' },
      { infinitive: 'comer', pronoun: 'ellos/ellas', conjugated: 'comieron' },
    ],
    future: [
      { infinitive: 'hablar', pronoun: 'yo', conjugated: 'hablaré' },
      { infinitive: 'hablar', pronoun: 'tú', conjugated: 'hablarás' },
      { infinitive: 'hablar', pronoun: 'él/ella', conjugated: 'hablará' },
      { infinitive: 'hablar', pronoun: 'nosotros', conjugated: 'hablaremos' },
      { infinitive: 'hablar', pronoun: 'vosotros', conjugated: 'hablaréis' },
      { infinitive: 'hablar', pronoun: 'ellos/ellas', conjugated: 'hablarán' },
    ],
  },
  french: {
    present: [
      { infinitive: 'parler', pronoun: 'je', conjugated: 'parle' },
      { infinitive: 'parler', pronoun: 'tu', conjugated: 'parles' },
      { infinitive: 'parler', pronoun: 'il/elle', conjugated: 'parle' },
      { infinitive: 'parler', pronoun: 'nous', conjugated: 'parlons' },
      { infinitive: 'parler', pronoun: 'vous', conjugated: 'parlez' },
      { infinitive: 'parler', pronoun: 'ils/elles', conjugated: 'parlent' },
      { infinitive: 'finir', pronoun: 'je', conjugated: 'finis' },
      { infinitive: 'finir', pronoun: 'tu', conjugated: 'finis' },
      { infinitive: 'finir', pronoun: 'il/elle', conjugated: 'finit' },
      { infinitive: 'finir', pronoun: 'nous', conjugated: 'finissons' },
      { infinitive: 'finir', pronoun: 'vous', conjugated: 'finissez' },
      { infinitive: 'finir', pronoun: 'ils/elles', conjugated: 'finissent' },
    ],
    past: [
      { infinitive: 'parler', pronoun: 'j\'', conjugated: 'ai parlé' },
      { infinitive: 'parler', pronoun: 'tu', conjugated: 'as parlé' },
      { infinitive: 'parler', pronoun: 'il/elle', conjugated: 'a parlé' },
      { infinitive: 'parler', pronoun: 'nous', conjugated: 'avons parlé' },
      { infinitive: 'parler', pronoun: 'vous', conjugated: 'avez parlé' },
      { infinitive: 'parler', pronoun: 'ils/elles', conjugated: 'ont parlé' },
    ],
  },
  english: {
    present: [
      { infinitive: 'to speak', pronoun: 'I', conjugated: 'speak' },
      { infinitive: 'to speak', pronoun: 'you', conjugated: 'speak' },
      { infinitive: 'to speak', pronoun: 'he/she', conjugated: 'speaks' },
      { infinitive: 'to speak', pronoun: 'we', conjugated: 'speak' },
      { infinitive: 'to speak', pronoun: 'you (pl)', conjugated: 'speak' },
      { infinitive: 'to speak', pronoun: 'they', conjugated: 'speak' },
      { infinitive: 'to go', pronoun: 'I', conjugated: 'go' },
      { infinitive: 'to go', pronoun: 'you', conjugated: 'go' },
      { infinitive: 'to go', pronoun: 'he/she', conjugated: 'goes' },
      { infinitive: 'to go', pronoun: 'we', conjugated: 'go' },
      { infinitive: 'to go', pronoun: 'you (pl)', conjugated: 'go' },
      { infinitive: 'to go', pronoun: 'they', conjugated: 'go' },
    ],
    past: [
      { infinitive: 'to speak', pronoun: 'I', conjugated: 'spoke' },
      { infinitive: 'to speak', pronoun: 'you', conjugated: 'spoke' },
      { infinitive: 'to speak', pronoun: 'he/she', conjugated: 'spoke' },
      { infinitive: 'to speak', pronoun: 'we', conjugated: 'spoke' },
      { infinitive: 'to speak', pronoun: 'you (pl)', conjugated: 'spoke' },
      { infinitive: 'to speak', pronoun: 'they', conjugated: 'spoke' },
    ],
  },
};

const DIFFICULTY_SETTINGS = {
  beginner: {
    initialTime: 30,
    timeDecrement: 0,
    timeBonus: 5,
    timePenalty: 3,
    promptDelay: 1500,
  },
  intermediate: {
    initialTime: 25,
    timeDecrement: 1,
    timeBonus: 4,
    timePenalty: 5,
    promptDelay: 1200,
  },
  advanced: {
    initialTime: 20,
    timeDecrement: 2,
    timeBonus: 3,
    timePenalty: 7,
    promptDelay: 1000,
  },
};

const THEME_COLORS = {
  default: {
    background: 'from-blue-100 to-indigo-100',
    ladder: 'bg-amber-700',
    rung: 'bg-amber-600',
    player: 'bg-blue-500',
    correct: 'bg-green-500',
    incorrect: 'bg-red-500',
  },
  space: {
    background: 'from-slate-900 to-purple-900',
    ladder: 'bg-slate-700',
    rung: 'bg-slate-600',
    player: 'bg-violet-500',
    correct: 'bg-emerald-500',
    incorrect: 'bg-rose-500',
  },
  ocean: {
    background: 'from-cyan-100 to-blue-500',
    ladder: 'bg-cyan-700',
    rung: 'bg-cyan-600',
    player: 'bg-yellow-400',
    correct: 'bg-green-400',
    incorrect: 'bg-red-400',
  },
  mountain: {
    background: 'from-slate-100 to-slate-400',
    ladder: 'bg-stone-700',
    rung: 'bg-stone-600',
    player: 'bg-red-500',
    correct: 'bg-green-500',
    incorrect: 'bg-red-700',
  },
};

export default function ConjugationGame({
  settings,
  onBackToMenu,
  onGameEnd,
  isFullscreen,
}: ConjugationGameProps) {
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [currentVerb, setCurrentVerb] = useState<{
    infinitive: string;
    pronoun: string;
    conjugated: string;
  } | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [remainingTime, setRemainingTime] = useState(
    DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].initialTime
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [showStartPrompt, setShowStartPrompt] = useState(true);
  const [gameStats, setGameStats] = useState({
    correctAnswers: 0,
    incorrectAnswers: 0,
    levelReached: 1,
    startTime: Date.now(),
  });
  const [playerPosition, setPlayerPosition] = useState(0); // 0 to 10 for ladder position
  const [ladderHeight, setLadderHeight] = useState(10); // Number of rungs
  const [shake, setShake] = useState(false);
  const [themeElements, setThemeElements] = useState<JSX.Element[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const themeColors = THEME_COLORS[settings.theme as keyof typeof THEME_COLORS] || THEME_COLORS.default;

  // Get verbs for the current language and tense
  const getVerbs = () => {
    const languageVerbs = VERBS[settings.language as keyof typeof VERBS] || VERBS.spanish;
    const tenseVerbs = settings.tense === 'mixed' 
      ? Object.values(languageVerbs).flat() 
      : (languageVerbs[settings.tense as keyof typeof languageVerbs] || languageVerbs.present);
    
    return tenseVerbs;
  };

  // Select a random verb
  const getRandomVerb = () => {
    const verbs = getVerbs();
    if (verbs.length === 0) return null;
    return verbs[Math.floor(Math.random() * verbs.length)];
  };

  // Start the game
  const startGame = () => {
    setShowStartPrompt(false);
    setGameStarted(true);
    setCurrentVerb(getRandomVerb());
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Check the user's answer
  const checkAnswer = () => {
    if (!currentVerb) return;
    
    const isCorrect = userAnswer.toLowerCase().trim() === currentVerb.conjugated.toLowerCase().trim();
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      // Correct answer
      setScore(score + 10 * level);
      setGameStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
      }));
      
      // Add time bonus
      setRemainingTime(prev => prev + DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].timeBonus);
      
      // Move player up if not at top
      if (playerPosition < ladderHeight - 1) {
        setPlayerPosition(prev => prev + 1);
      } else {
        // Player reached the top, advance level
        nextLevel();
      }
      
      // Play confetti for correct answer
      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } else {
      // Incorrect answer
      setGameStats(prev => ({
        ...prev,
        incorrectAnswers: prev.incorrectAnswers + 1,
      }));
      
      // Time penalty
      setRemainingTime(prev => Math.max(0, prev - DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].timePenalty));
      
      // Move player down if not at bottom
      if (playerPosition > 0) {
        setPlayerPosition(prev => prev - 1);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }
    
    // Clear input and show next verb after delay
    setUserAnswer('');
    
    setTimeout(() => {
      setFeedback(null);
      setCurrentVerb(getRandomVerb());
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].promptDelay);
  };

  // Advance to next level
  const nextLevel = () => {
    setLevel(level + 1);
    setPlayerPosition(0); // Reset player to bottom of ladder
    setLadderHeight(10 + Math.floor(level / 3)); // Increase ladder height as levels progress
    
    // Update highest level reached
    setGameStats(prev => ({
      ...prev,
      levelReached: Math.max(prev.levelReached, level + 1),
    }));
    
    // Decrease time per level based on difficulty
    setRemainingTime(prev => 
      Math.max(
        10, 
        prev - DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].timeDecrement
      )
    );
  };

  // End the game
  const endGame = () => {
    setGameOver(true);
    
    if (onGameEnd) {
      onGameEnd({
        correctAnswers: gameStats.correctAnswers,
        incorrectAnswers: gameStats.incorrectAnswers,
        levelReached: gameStats.levelReached,
        timeTaken: Math.floor((Date.now() - gameStats.startTime) / 1000),
      });
    }
  };

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameStarted && !gameOver && currentVerb) {
      checkAnswer();
    }
  };

  // Handle keyboard input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showStartPrompt && !gameOver) {
      checkAnswer();
    } else if (e.key === 'Enter' && showStartPrompt) {
      startGame();
    }
  };

  // Initialize theme elements
  useEffect(() => {
    if (!gameStarted) return;
    
    // Create theme-specific background elements
    const createThemeElements = () => {
      switch(settings.theme) {
        case 'space':
          return [
            <div key="space-planet-1" className="space-planet space-planet-1">
              <div className="absolute rounded-full bg-orange-500 w-16 h-16 opacity-80 
                            shadow-lg shadow-orange-300"></div>
            </div>,
            <div key="space-planet-2" className="space-planet space-planet-2">
              <div className="absolute rounded-full bg-blue-400 w-24 h-24 opacity-70
                            shadow-lg shadow-blue-300"></div>
            </div>,
            <div key="space-station" className="space-station">
              <div className="absolute top-1/4 right-1/3 w-32 h-12 bg-gray-300 
                            rounded-lg rotate-12 opacity-90 shadow-md"></div>
            </div>,
            <div key="space-wormhole" className="space-wormhole">
              <div className="absolute top-1/2 left-1/6 w-40 h-40 rounded-full bg-purple-800
                          opacity-60 shadow-[inset_0_0_20px_rgba(139,92,246,0.8)] animate-pulse"></div>
            </div>,
            <div key="space-stars" className="space-stars absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_10%_20%,#ffffff,rgba(0,0,0,0)),
                          radial-gradient(2px_2px_at_30%_50%,#aaaaff,rgba(0,0,0,0)),
                          radial-gradient(1px_1px_at_70%_10%,#ffffff,rgba(0,0,0,0)),]"></div>
            </div>
          ];
        case 'ocean':
          return [
            <div key="ocean-fish-group" className="ocean-fish-group">
              <div className="ocean-fish ocean-fish-1"></div>
              <div className="ocean-fish ocean-fish-2"></div>
              <div className="ocean-fish ocean-fish-3"></div>
            </div>,
            <div key="ocean-coral-1" className="ocean-coral ocean-coral-1"></div>,
            <div key="ocean-coral-2" className="ocean-coral ocean-coral-2"></div>,
            <div key="ocean-bubbles" className="ocean-bubbles">
              <div className="ocean-bubble" style={{ left: '20%', bottom: '5%', animationDuration: '8s' }}></div>
              <div className="ocean-bubble" style={{ left: '40%', bottom: '15%', animationDuration: '12s' }}></div>
              <div className="ocean-bubble" style={{ left: '70%', bottom: '10%', animationDuration: '6s' }}></div>
              <div className="ocean-bubble" style={{ left: '85%', bottom: '25%', animationDuration: '10s' }}></div>
              <div className="ocean-bubble" style={{ left: '30%', bottom: '40%', animationDuration: '14s' }}></div>
              <div className="ocean-bubble" style={{ left: '60%', bottom: '60%', animationDuration: '9s' }}></div>
              <div className="ocean-bubble" style={{ left: '15%', bottom: '75%', animationDuration: '11s' }}></div>
            </div>,
            <div key="ocean-seaweed" className="ocean-seaweed">
              <div className="absolute left-1/5 bottom-0 w-16 h-40 bg-green-700 opacity-60 
                            mask-image-[linear-gradient(0deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)]"></div>
              <div className="absolute left-4/5 bottom-0 w-12 h-32 bg-green-600 opacity-50
                            mask-image-[linear-gradient(0deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_100%)]"></div>
            </div>
          ];
        case 'mountain':
          return [
            <div key="mountain-cloud-1" className="mountain-cloud mountain-cloud-1"></div>,
            <div key="mountain-cloud-2" className="mountain-cloud mountain-cloud-2"></div>,
            <div key="mountain-cloud-3" className="mountain-cloud mountain-cloud-3"></div>,
            <div key="mountain-peak" className="mountain-peak">
              <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-stone-700 to-stone-500"></div>
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/4 bg-white rounded-t-full opacity-80"></div>
            </div>,
            <div key="mountain-trees" className="mountain-trees">
              <div className="absolute bottom-10 left-1/6 w-8 h-16 bg-green-800 rounded-t-full opacity-80"></div>
              <div className="absolute bottom-14 left-1/4 w-10 h-20 bg-green-900 rounded-t-full opacity-70"></div>
              <div className="absolute bottom-8 right-1/5 w-8 h-12 bg-green-800 rounded-t-full opacity-75"></div>
            </div>
          ];
        default:
          return [];
      }
    };
    
    setThemeElements(createThemeElements());
  }, [settings.theme, gameStarted]);

  // Get player class based on theme
  const getPlayerClass = () => {
    switch(settings.theme) {
      case 'space':
        return 'player-astronaut';
      case 'ocean':
        return 'player-diver';
      case 'mountain':
        return 'player-climber';
      default:
        return 'player-default';
    }
  };

  // Get theme background class
  const getThemeBackgroundClass = () => {
    switch(settings.theme) {
      case 'space':
        return 'space-bg';
      case 'ocean':
        return 'ocean-bg';
      case 'mountain':
        return 'mountain-bg';
      default:
        return `classic-bg`;
    }
  };

  // Render the ladder
  const renderLadder = () => {
    const themeLabels = {
      space: { structure: "Navigation Path", points: "Checkpoint" },
      ocean: { structure: "Depth Trail", points: "Depth Marker" },
      mountain: { structure: "Climbing Route", points: "Climbing Hold" },
      default: { structure: "Ladder", points: "Rung" }
    };
    
    const currentTheme = settings.theme as keyof typeof themeLabels;
    const labels = themeLabels[currentTheme] || themeLabels.default;
    
    return (
      <div className="relative h-full w-24 mx-auto">
        {/* Left pole - theme specific */}
        <div className={`ladder-pole ladder-pole-left ${themeColors.ladder} rounded-t-lg`} 
             aria-label={`${labels.structure} left side`}></div>
        
        {/* Right pole - theme specific */}
        <div className={`ladder-pole ladder-pole-right ${themeColors.ladder} rounded-t-lg`} 
             aria-label={`${labels.structure} right side`}></div>
        
        {/* Rungs - theme specific */}
        {Array.from({ length: ladderHeight }).map((_, index) => (
          <div 
            key={index}
            className={`ladder-rung ${themeColors.rung}`}
            style={{ bottom: `${(index / (ladderHeight - 1)) * 100}%` }}
            aria-label={`${labels.points} ${index + 1}`}
          ></div>
        ))}
        
        {/* Player */}
        <motion.div
          className={`absolute ${getPlayerClass()} left-1/2 -ml-4`}
          animate={{ 
            bottom: `calc(${(playerPosition / (ladderHeight - 1)) * 100}% - 20px)`,
            x: shake ? [-5, 5, -5, 5, 0] : 0 
          }}
          transition={{ 
            bottom: { type: 'spring', stiffness: 300, damping: 20 },
            x: { duration: 0.5 }
          }}
        />
      </div>
    );
  };

  // Add a function to get theme-specific prompt text
  const getThemePrompt = () => {
    switch(settings.theme) {
      case 'space':
        return {
          title: "Ready to Explore Space?",
          description: "Conjugate verbs correctly to navigate through space. Make a mistake and you'll drift off course!"
        };
      case 'ocean':
        return {
          title: "Ready to Dive Deep?",
          description: "Conjugate verbs correctly to explore the ocean depths. Make a mistake and you'll float back up!"
        };
      case 'mountain':
        return {
          title: "Ready to Climb the Peak?",
          description: "Conjugate verbs correctly to scale the mountain. Make a mistake and you'll slip down!"
        };
      default:
        return {
          title: "Ready to Start?",
          description: "Conjugate verbs correctly to climb the ladder. Make a mistake and you'll slide down!"
        };
    }
  };

  return (
    <div className={`min-h-screen w-full ${isFullscreen ? 'fullscreen-game' : 'p-4'}`}>
      <div className={`game-container rounded-xl overflow-hidden ${getThemeBackgroundClass()} 
        ${isFullscreen ? 'rounded-none' : 'shadow-xl'} relative`}
      >
        {/* Theme elements */}
        {themeElements}
        
        {/* Game header */}
        <div className="flex justify-between items-center p-4 bg-black bg-opacity-20 z-10">
          <div className="flex flex-col">
            <div className="text-lg font-bold">Level {level}</div>
            <div className="text-sm opacity-80">
              {settings.language} - {settings.tense === 'mixed' ? 'Mixed Tenses' : `${settings.tense} Tense`}
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              Score: {score}
            </div>
            <div className={`px-3 py-1 rounded-full font-bold ${
              remainingTime <= 5 ? 'bg-red-500 time-critical' : 'bg-white bg-opacity-20'
            }`}>
              Time: {remainingTime}s
            </div>
          </div>
        </div>
        
        {/* Main game area */}
        <div className="game-content relative z-10">
          <AnimatePresence mode="wait">
            {showStartPrompt ? (
              <motion.div 
                key="start"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center mb-12 max-w-md mx-auto"
              >
                <h2 className="text-3xl font-bold mb-6">{getThemePrompt().title}</h2>
                <p className="text-lg mb-8">
                  {getThemePrompt().description}
                </p>
                <button
                  onClick={startGame}
                  className="game-button bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold"
                >
                  Start Game
                </button>
              </motion.div>
            ) : gameOver ? (
              <motion.div 
                key="gameover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center mb-12 max-w-md mx-auto"
              >
                <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
                <div className="text-lg mb-6">
                  <p className="mb-2">You reached Level {gameStats.levelReached}</p>
                  <p className="text-xl font-bold">Final Score: {score}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8 max-w-xs mx-auto">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{gameStats.correctAnswers}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Correct</div>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{gameStats.incorrectAnswers}</div>
                    <div className="text-sm text-red-700 dark:text-red-300">Incorrect</div>
                  </div>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setGameOver(false);
                      setGameStarted(false);
                      setShowStartPrompt(true);
                      setScore(0);
                      setLevel(1);
                      setPlayerPosition(0);
                      setLadderHeight(10);
                      setRemainingTime(DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].initialTime);
                      setGameStats({
                        correctAnswers: 0,
                        incorrectAnswers: 0,
                        levelReached: 1,
                        startTime: Date.now(),
                      });
                    }}
                    className="game-button bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={onBackToMenu}
                    className="game-button bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Back to Menu
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="split-view"
              >
                {/* Ladder visualization */}
                <div className="ladder-container">
                  {renderLadder()}
                </div>
                
                {/* Conjugation challenge */}
                <div className="challenge-container">
                  {currentVerb && (
                    <>
                      <div className="text-center mb-6">
                        <div className="text-xl font-medium mb-2">
                          Conjugate the verb:
                        </div>
                        <div className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-400">
                          {currentVerb.infinitive}
                        </div>
                        <div className="text-2xl">
                          {currentVerb.pronoun} _________
                        </div>
                      </div>
                      
                      <form onSubmit={handleSubmit} className="w-full max-w-sm">
                        <div className="relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your answer..."
                            className={`w-full px-4 py-3 rounded-lg text-lg font-medium text-center border-2 ${
                              feedback === 'correct' 
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                                : feedback === 'incorrect' 
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/30'
                                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white'
                            } transition-colors`}
                            disabled={!!feedback}
                            autoComplete="off"
                          />
                          
                          {feedback && (
                            <div 
                              className={`absolute inset-0 flex items-center justify-center rounded-lg ${
                                feedback === 'correct' 
                                  ? 'bg-green-100 bg-opacity-70 dark:bg-green-900/50 correct-answer' 
                                  : 'bg-red-100 bg-opacity-70 dark:bg-red-900/50 incorrect-answer'
                              }`}
                            >
                              <span className={`font-bold text-lg ${
                                feedback === 'correct' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                              }`}>
                                {feedback === 'correct' ? 'Correct!' : `Incorrect! It's "${currentVerb.conjugated}"`}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-6 text-center">
                          <button
                            type="submit"
                            className="game-button bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!!feedback || !userAnswer}
                          >
                            Check Answer
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Game footer */}
        <div className="p-4 bg-black bg-opacity-20 flex justify-between z-10">
          <button
            onClick={onBackToMenu}
            className="game-button bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white text-sm py-2 px-4"
          >
            Exit Game
          </button>
          
          {gameStarted && !gameOver && (
            <div className="text-white text-sm flex items-center">
              <span className="mr-3">{gameStats.correctAnswers} correct</span>
              <span>{gameStats.incorrectAnswers} incorrect</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
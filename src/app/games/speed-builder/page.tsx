'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Lightbulb, RefreshCw, Clock, Trophy, AlertCircle, ArrowLeft, Shuffle, ZapOff, Building2, Star, Eye, EyeOff, Zap, HeartPulse, Sparkles, Play } from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import './speed-builder.css';

// Import components and types
import { DraggableWord } from './components/DraggableWord';
import { WordTarget } from './components/WordTarget';
import { PowerUpButton } from './components/PowerUpButton';
import { ThemeSelector } from './components/ThemeSelector';
import { SoundProvider, SoundControls, useSound } from './components/SoundManager';
import { ModeSelector } from './components/ModeSelector';
import { CurriculumDisplay } from './components/CurriculumDisplay';
import { LanguageToggle } from './components/LanguageToggle';
import { 
  WordItem, GameState, GameSettings, GameStats, PowerUp, 
  ThemeType, DifficultyLevel, TranslationDirection, SentenceData,
  GameMode, CurriculumMetadata, GCSETier, FreePlayConfig, AssignmentData
} from './types';

// Available sentences will be fetched from API
const DEFAULT_SENTENCE: SentenceData = { 
  id: 'loading', 
  text: 'Cargando...', 
  originalText: 'Loading...', 
  translatedText: 'Cargando...', 
  language: 'es',
  curriculum: {
    tier: 'Foundation',
    theme: 'People and lifestyle',
    topic: 'Identity and relationships'
  }
};

// Default power-ups
const defaultPowerUps: PowerUp[] = [
  { id: 'shuffle', type: 'shuffle', active: false, cooldown: 10, description: 'Rearranges words', icon: 'shuffle' },
  { id: 'hint', type: 'hint', active: false, cooldown: 15, description: 'Highlights next word', icon: 'lightbulb' },
  { id: 'glow', type: 'glow', active: false, cooldown: 20, description: 'Shows full sentence', icon: 'sparkles' },
  { id: 'timeBoost', type: 'timeBoost', active: false, cooldown: 30, description: '+15 seconds', icon: 'zap' }
];


// Main Game Component
function SpeedBuilderGameInner() {
  // State variables...
  const [gameState, setGameState] = useState<GameState>('ready');
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 120, ghostMode: false, ghostDuration: 3, theme: 'default', difficulty: 'medium', 
    powerUpsEnabled: true, vocabularyId: null, translationDirection: 'fromNative', 
    soundEffects: true, backgroundMusic: true, persistCustomSentence: false,
    gameMode: 'freeplay',
    assignmentId: null,
    curriculum: undefined,
    adaptiveLearning: false,
    showExplanations: true
  });
  const [currentSentence, setCurrentSentence] = useState<SentenceData | null>(null);
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [placedWords, setPlacedWords] = useState<(WordItem | null)[]>([]);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number | null>(null);
  const [customSentenceInput, setCustomSentenceInput] = useState<string>("");
  const [useCustomSentence, setUseCustomSentence] = useState<boolean>(false);
  const [stats, setStats] = useState<GameStats>({ score: 0, wordsPlaced: 0, accuracy: 1, timeSpent: 0, streak: 0, highestStreak: 0, completedLevels: 0 });
  const [levelIndex, setLevelIndex] = useState(0);
  const [powerUps, setPowerUps] = useState<PowerUp[]>(defaultPowerUps.map(p => ({ ...p }))); // Ensure fresh copy
  const [isGhostActive, setIsGhostActive] = useState(false);
  const [sentenceFlashActive, setSentenceFlashActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const ghostTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { playSound } = useSound();
  const searchParams = useSearchParams();
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const [availableSentences, setAvailableSentences] = useState<SentenceData[]>([]);
  const [isLoadingSentences, setIsLoadingSentences] = useState(false);
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(null);
  const [freePlayConfig, setFreePlayConfig] = useState<FreePlayConfig>({
    selectedTier: 'Foundation',
    enableStars: true,
    enableLeaderboard: true,
    enableAdaptiveLearning: false
  });
  const supabase = createBrowserClient();

  // --- Utility Functions (Defined First) ---
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const updateStats = useCallback((isCorrect: boolean) => {
    setStats(prev => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newWordsPlaced = prev.wordsPlaced + 1;
      const prevTotalCorrect = prev.accuracy * (newWordsPlaced - 1);
      // Ensure accuracy calculation is safe
      const newAccuracy = newWordsPlaced > 0 
          ? (isCorrect ? (prevTotalCorrect + 1) / newWordsPlaced : prevTotalCorrect / newWordsPlaced)
          : 1; 
      const scoreIncrement = isCorrect ? (10 + newStreak * 2) : -5;
      return {
        ...prev,
        score: Math.max(0, prev.score + scoreIncrement),
        wordsPlaced: newWordsPlaced,
        accuracy: isNaN(newAccuracy) ? 1 : newAccuracy, 
        streak: newStreak,
        highestStreak: Math.max(prev.highestStreak, newStreak)
      };
    });
  }, []);

  // --- API Functions ---
  const fetchSentences = useCallback(async () => {
    setIsLoadingSentences(true);
    try {
      const requestBody = {
        mode: gameSettings.gameMode,
        assignmentId: gameSettings.assignmentId,
        theme: freePlayConfig.selectedTheme,
        topic: freePlayConfig.selectedTopic,
        tier: freePlayConfig.selectedTier,
        grammarFocus: freePlayConfig.grammarFocus,
        count: 10,
        difficulty: gameSettings.difficulty
      };

      const response = await fetch('/api/games/speed-builder/sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sentences');
      }

      const data = await response.json();
      setAvailableSentences(data.sentences || []);
    } catch (error) {
      console.error('Error fetching sentences:', error);
      // Fallback to default sentence
      setAvailableSentences([DEFAULT_SENTENCE]);
    } finally {
      setIsLoadingSentences(false);
    }
  }, [gameSettings.gameMode, gameSettings.assignmentId, gameSettings.difficulty, freePlayConfig]);

  // Initialize game on mount and when params change
  useEffect(() => {
    const initializeGame = async () => {
      // Check URL params for assignment mode
      if (searchParams) {
        const assignmentParam = searchParams.get('assignment');
        const modeParam = searchParams.get('mode');
        
        if (assignmentParam) {
          setGameSettings(prev => ({
            ...prev,
            gameMode: 'assignment',
            assignmentId: assignmentParam
          }));
          setAssignmentId(assignmentParam);
        } else if (modeParam === 'assignment') {
          setGameSettings(prev => ({ ...prev, gameMode: 'assignment' }));
        }
      }

      // Fetch initial sentences
      await fetchSentences();
    };

    initializeGame();
  }, [searchParams, fetchSentences]);

  // Fetch sentences when game mode or config changes
  useEffect(() => {
    if (gameState !== 'ready') return;
    fetchSentences();
  }, [gameSettings.gameMode, gameSettings.assignmentId, freePlayConfig, fetchSentences, gameState]);

  // --- Core Game Logic Callbacks ---
  const loadNewSentence = useCallback((index: number) => {
    let sentenceData: SentenceData | null = null;
    let sentenceTextToUse: string | null = null;

    if (useCustomSentence && customSentenceInput.trim()) {
        sentenceTextToUse = customSentenceInput.trim();
        sentenceData = {
            id: `custom-${Date.now()}`,
            text: sentenceTextToUse,
            originalText: sentenceTextToUse,
            translatedText: sentenceTextToUse,
            language: 'custom'
        };
    } else {
        if (availableSentences.length > 0) {
            const sentenceIndex = index % availableSentences.length;
            sentenceData = availableSentences[sentenceIndex];
            sentenceTextToUse = gameSettings.translationDirection === 'toNative' 
                                ? sentenceData.originalText  // English (original)
                                : sentenceData.translatedText; // Spanish (translated)
            // Ensure the 'text' property aligns with the text being used
            sentenceData = { ...sentenceData, text: sentenceTextToUse }; 
        }
    }

    if (sentenceData && sentenceTextToUse) {
      setCurrentSentence(sentenceData);
      // Ensure the map creates objects matching WordItem structure
      const words: WordItem[] = sentenceTextToUse.split(/\s+/).map((word, i) => ({
         id: `${sentenceData!.id}-word-${i}`,
         text: word,
         index: i,
       }));
      setShuffledWords(shuffleArray(words));
      setPlacedWords(new Array(words.length).fill(null));
      setHighlightedWordIndex(null); 
      console.log("Loaded sentence:", sentenceData.text, "Words:", words);
    } else {
      console.error("Failed to load a sentence.");
      setGameState('error');
    }
  }, [shuffleArray, customSentenceInput, useCustomSentence, gameSettings.translationDirection, availableSentences]);

  const handleWordDrop = useCallback((wordId: string, targetIndex: number): boolean => {
      const wordBeingDropped = shuffledWords.find(w => w.id === wordId) || placedWords.find(w => w?.id === wordId);

      if (!wordBeingDropped || !currentSentence) {
          console.warn("Drop failed: Word or sentence missing");
          return false; 
      }
      
      const sentenceWords = currentSentence.text.split(/\s+/);
      if (targetIndex < 0 || targetIndex >= sentenceWords.length) {
          console.warn("Drop failed: Invalid target index", targetIndex);
          return false;
      }

      const correctWordAtIndex = sentenceWords[targetIndex];
      const isPlacementCorrect = wordBeingDropped.text === correctWordAtIndex;
      
      let newPlacedWords = [...placedWords];
      let newShuffledWords = [...shuffledWords];
      const sourceShuffledIndex = newShuffledWords.findIndex(w => w.id === wordId);
      const sourcePlacedIndex = newPlacedWords.findIndex(w => w?.id === wordId);
      const wordCurrentlyAtTarget = newPlacedWords[targetIndex];

      // --- Logic for placing/swapping ---
      if (sourceShuffledIndex !== -1) {
          newShuffledWords.splice(sourceShuffledIndex, 1); // Remove from source
      } else if (sourcePlacedIndex !== -1) {
          newPlacedWords[sourcePlacedIndex] = null; // Clear source slot
      }

      newPlacedWords[targetIndex] = wordBeingDropped; // Place at target

      if (wordCurrentlyAtTarget && wordCurrentlyAtTarget.id !== wordBeingDropped.id) {
          newShuffledWords.push(wordCurrentlyAtTarget); // Move swapped word to shuffled
      }

      setPlacedWords(newPlacedWords);
      setShuffledWords(shuffleArray(newShuffledWords)); // Re-shuffle remaining

      // --- Feedback & Stats ---
      if (typeof playSound === 'function') {
        playSound(isPlacementCorrect ? 'correct' : 'incorrect');
      }
      updateStats(isPlacementCorrect);

      // --- Check Completion ---
      const isSentenceComplete = newPlacedWords.every(w => w !== null) && 
                                newPlacedWords.map(w => w!.text).join(' ') === currentSentence.text;

      if (isSentenceComplete) {
          console.log("Sentence completed!");
          if (typeof playSound === 'function') {
            playSound('levelComplete');
          }
          setStats(prev => ({ ...prev, completedLevels: prev.completedLevels + 1 }));
          setGameState('completed'); // Move to completed state
          triggerConfetti();
          // Do not automatically load next level here, let user click button
      }

      return true; // Indicate drop was handled successfully

  }, [shuffledWords, placedWords, currentSentence, playSound, updateStats, shuffleArray]); // Removed dependencies that might cause stale closures if not needed


  const startGame = () => {
    console.log("Starting game...");
    setGameState('playing');
    // Reset time-specific stats
    setStats(prev => ({ 
        ...prev, 
        timeSpent: 0, 
        // Keep score, streak etc. if starting next level, reset if starting fresh?
        // For now, reset most things except maybe highest streak?
        score: 0,
        wordsPlaced: 0,
        accuracy: 1,
        streak: 0,
        // highestStreak: prev.highestStreak // Optionally keep highest streak
    })); 
    loadNewSentence(levelIndex); // Load sentence (custom or sample)
    
    if (!gameSettings.persistCustomSentence && useCustomSentence) {
        // If custom isn't persisted, maybe clear input for next game?
        // setUseCustomSentence(false); // Reset flag here? Or in resetGame?
    }

    // Clear existing timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);

    timerRef.current = setInterval(() => {
      setStats(prev => {
        const newTime = prev.timeSpent + 1;
        if (newTime >= gameSettings.timeLimit) {
          clearInterval(timerRef.current!); // Clear timer immediately
          setGameState('timeout'); // Use 'timeout' state?
          if (typeof playSound === 'function') {
            playSound('gameOver');    // Use correct sound name
          }
          // triggerConfetti(); // Confetti on timeout?
          // saveProgress();
          console.log("Time out!");
          return { ...prev, timeSpent: gameSettings.timeLimit };
        }
        return { ...prev, timeSpent: newTime };
      });
    }, 1000);

    if (gameSettings.ghostMode) {
      setIsGhostActive(true);
      ghostTimerRef.current = setTimeout(() => {
        setIsGhostActive(false);
      }, gameSettings.ghostDuration * 1000);
    }
    if (typeof playSound === 'function') {
      playSound('ui');
    }
  };

  const resetGame = (keepCustom: boolean = false) => {
    console.log("Resetting game...");
    if (timerRef.current) clearInterval(timerRef.current);
    if (ghostTimerRef.current) clearTimeout(ghostTimerRef.current);
    setLevelIndex(0);
    setGameState('ready');
    setCurrentSentence(null);
    setShuffledWords([]);
    setPlacedWords([]);
    setStats({ score: 0, wordsPlaced: 0, accuracy: 1, timeSpent: 0, streak: 0, highestStreak: 0, completedLevels: 0 });
    setPowerUps(defaultPowerUps.map(p => ({ ...p, active: false }))); // Reset cooldowns/active state
    setIsGhostActive(false);
    setSentenceFlashActive(false);
    if (!keepCustom) {
        setUseCustomSentence(false);
        // setCustomSentenceInput(""); // Optionally clear input on full reset
    }
  };

  const handleUseCustomSentence = () => {
    const sentence = customSentenceInput.trim();
    if (sentence.split(/\s+/).length >= 3) {
        console.log("Using custom sentence and starting game");
        setUseCustomSentence(true);
        setLevelIndex(0); // Start custom sentence from level 0
        // Ensure game is ready before starting
        setGameState('ready'); 
        // Use a timeout to allow state update before starting
        setTimeout(() => startGame(), 0); 
    } else {
        console.warn("Custom sentence input needs at least 3 words.");
        // Add visual feedback?
    }
  };

  const handleNextLevel = () => {
      if (gameState === 'completed') { // Only proceed if completed
          const nextLevel = levelIndex + 1;
          // Check if next level exists (for sample sentences)
          if (!useCustomSentence && nextLevel >= availableSentences.length) {
              console.log("All sample sentences completed.");
              // Maybe show a final completion message?
              resetGame(); // Or go back to ready state
              return;
          }
          console.log(`Starting next level: ${nextLevel}`);
          setLevelIndex(nextLevel);
          // Reset specific states needed for the new level
          setPlacedWords([]); 
          setShuffledWords([]);
          setCurrentSentence(null);
          setHighlightedWordIndex(null);
          setIsGhostActive(false);
          setSentenceFlashActive(false);
          // Ensure gameState allows starting
          setGameState('ready'); 
          // Use timeout to allow state updates before startGame
          setTimeout(() => startGame(), 0);
      }
  };

  const triggerConfetti = () => { 
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } }); 
  };
  const saveProgress = async () => { console.log("Saving progress..."); }; // Placeholder

  // --- Mode and Config Handlers ---
  const handleModeChange = useCallback((mode: GameMode) => {
    setGameSettings(prev => ({ ...prev, gameMode: mode }));
    if (mode === 'freeplay') {
      setAssignmentId(null);
      setAssignmentData(null);
    }
  }, []);

  const handleFreePlayConfigChange = useCallback((config: Partial<FreePlayConfig>) => {
    setFreePlayConfig(prev => ({ ...prev, ...config }));
  }, []);

  const handleToggleExplanations = useCallback(() => {
    setGameSettings(prev => ({ ...prev, showExplanations: !prev.showExplanations }));
  }, []);

  const handleTranslationDirectionChange = useCallback((direction: TranslationDirection) => {
    setGameSettings(prev => ({ ...prev, translationDirection: direction }));
    // Reload current sentence with new direction
    if (availableSentences.length > 0) {
      loadNewSentence(levelIndex);
    }
  }, [availableSentences.length, levelIndex, loadNewSentence]);

  // --- Power-up Handlers ---
  const activatePowerUp = (id: string) => {
      const powerUpIndex = powerUps.findIndex(p => p.id === id);
      if (powerUpIndex === -1 || powerUps[powerUpIndex].active || stats.timeSpent < powerUps[powerUpIndex].cooldown) { // Check if active or on cooldown
          console.log(`Power-up ${id} not ready or already active.`);
          return; 
      }

      const powerUp = powerUps[powerUpIndex];
      console.log("Activating power-up:", id);
      if (typeof playSound === 'function') {
        playSound('powerup');
      }

      // Apply effect
      switch (powerUp.type) {
          case 'shuffle':
              setShuffledWords(prev => shuffleArray([...prev]));
              break;
          case 'hint':
              // Find first empty slot or incorrect word
              const firstEmptyIndex = placedWords.findIndex(w => w === null);
              if (firstEmptyIndex !== -1) {
                  setHighlightedWordIndex(firstEmptyIndex);
                  setTimeout(() => setHighlightedWordIndex(null), 1500); // Highlight duration
              } // Else: maybe highlight first misplaced word?
              break;
          case 'glow':
              setSentenceFlashActive(true);
              setTimeout(() => setSentenceFlashActive(false), 2000); // Flash duration
              break;
          case 'timeBoost':
              setStats(prev => ({ ...prev, timeSpent: Math.max(0, prev.timeSpent - 15) }));
              break;
      }

      // Set power-up to active (for visual feedback) and start cooldown timer
      const newPowerUps = [...powerUps];
      newPowerUps[powerUpIndex] = { ...powerUp, active: true };
      setPowerUps(newPowerUps);

      // Reset active state after a short delay (visual effect) and manage cooldown
      setTimeout(() => {
          const updatedPowerUps = powerUps.map(p => p.id === id ? { ...p, active: false } : p);
          setPowerUps(updatedPowerUps);
          // Here you would ideally track cooldown end times properly
      }, 500); 

  };

  // --- Memoized values ---
  const remainingTime = useMemo(() => Math.max(0, gameSettings.timeLimit - stats.timeSpent), [gameSettings.timeLimit, stats.timeSpent]);
  const timerProgress = useMemo(() => (remainingTime / gameSettings.timeLimit) * 100, [remainingTime, gameSettings.timeLimit]);
  const timerColorClass = useMemo(() => {
    if (remainingTime <= 0) return 'danger'; // Ensure danger at 0
    if (remainingTime <= 10) return 'danger';
    if (remainingTime <= 30) return 'warning';
    return '';
  }, [remainingTime]);

  // --- JSX Rendering --- 
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`speed-builder-game theme-${gameSettings.theme} state-${gameState} flex flex-col min-h-screen p-4 md:p-8`}>
        <header className="flex justify-between items-center mb-4 md:mb-8">
          <Link href="/games" className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Back to games">
             <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold text-center flex-grow mx-4">Speed Builder</h1>
          <SoundControls />
        </header>

        {/* Mode Selector - only show in ready state */}
        {gameState === 'ready' && (
          <ModeSelector
            gameMode={gameSettings.gameMode}
            onModeChange={handleModeChange}
            freePlayConfig={freePlayConfig}
            onFreePlayConfigChange={handleFreePlayConfigChange}
            isAssignmentMode={gameSettings.gameMode === 'assignment' && !!assignmentData}
            assignmentData={assignmentData || undefined}
          />
        )}

        {/* Language Toggle - show in ready state and free play mode */}
        {gameState === 'ready' && gameSettings.gameMode === 'freeplay' && (
          <LanguageToggle
            translationDirection={gameSettings.translationDirection}
            onDirectionChange={handleTranslationDirectionChange}
            currentSentence={availableSentences[levelIndex] || null}
          />
        )}

        {/* Curriculum Display - show when playing and sentence has curriculum info */}
        {(gameState === 'playing' || gameState === 'paused') && currentSentence?.curriculum && (
          <CurriculumDisplay
            currentSentence={currentSentence}
            showExplanations={gameSettings.showExplanations || false}
            gameMode={gameSettings.gameMode}
            onToggleExplanations={handleToggleExplanations}
          />
        )}

        {/* Custom Sentence Input (Ready State - Free Play Only) */} 
        {gameState === 'ready' && gameSettings.gameMode === 'freeplay' && (
          <div className="custom-sentence-area mb-6 p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-md max-w-2xl mx-auto w-full">
            <h3 className="text-lg font-semibold mb-3 text-center text-gray-700 dark:text-gray-300">Create Your Own Challenge</h3>
            <textarea
              placeholder="Type or paste your sentence here (at least 3 words)..."
              value={customSentenceInput}
              onChange={(e) => setCustomSentenceInput(e.target.value)}
              className="w-full mb-3 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              aria-label="Custom sentence input"
            />
            <button 
              onClick={handleUseCustomSentence}
              disabled={customSentenceInput.trim().split(/\s+/).length < 3}
              className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded shadow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Use This Sentence & Start
            </button>
          </div>
        )}

        {/* Start Game Button - for pre-loaded sentences */}
        {gameState === 'ready' && !useCustomSentence && availableSentences.length > 0 && (
          <div className="text-center mb-6">
            <motion.button
              onClick={startGame}
              disabled={isLoadingSentences}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-xl rounded-lg shadow-lg transition-colors flex items-center gap-3 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoadingSentences ? (
                <>
                  <motion.div
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Loading...
                </>
              ) : (
                <>
                  <Play className="h-6 w-6" />
                  Start Game
                </>
              )}
            </motion.button>
            {availableSentences.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Ready with {availableSentences.length} sentences!
              </p>
            )}
          </div>
        )}

        {/* Main Game Content (Playing, Completed, Paused, Timeout) */} 
        {(gameState === 'playing' || gameState === 'completed' || gameState === 'paused' || gameState === 'timeout') && (
            <div className="game-content flex-grow flex flex-col items-center w-full max-w-4xl mx-auto relative"> {/* Added relative positioning for overlay */} 
               {/* Top Bar: Stats & Timer */} 
                <div className="game-info-bar w-full flex justify-between items-center mb-6 p-3 bg-white/60 dark:bg-black/50 backdrop-blur-sm rounded-lg shadow">
                    <div className="text-lg">Score: <span className="font-bold text-blue-600 dark:text-blue-400">{stats.score}</span></div>
                    <div 
                        className={`timer ${timerColorClass}`}
                        style={{ '--progress': `${100 - timerProgress}%` } as React.CSSProperties}
                        aria-label={`Time remaining: ${remainingTime} seconds`}
                    >
                        {remainingTime}s
                    </div>
                    <div className="text-lg">Streak: <span className="font-bold text-amber-600 dark:text-amber-400">{stats.streak}</span></div>
                </div>

                {/* Sentence Display Area */} 
                {currentSentence && (
                    <div className="sentence-display w-full mb-8 p-4 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-lg shadow-md min-h-[80px] flex items-center justify-center relative">
                        <p className="text-center text-xl font-medium text-gray-800 dark:text-gray-200">
                           {currentSentence.text} 
                        </p>
                        {/* Ghost/Flash Overlays */} 
                        {isGhostActive && <div className="ghost-sentence visible" aria-hidden="true">{currentSentence.text}</div>}
                        {sentenceFlashActive && <div className="flash-sentence" aria-hidden="true">{currentSentence.text}</div>}
                    </div>
                )}

                {/* Word Targets (Drop Area) */} 
                <div className="word-targets-container w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8">
                    {placedWords.map((word, index) => {
                        // The WordTarget requires expectedWordId
                        const expectedWordId = currentSentence ? 
                          `${currentSentence.id}-word-${index}` : null;
                        
                        return (
                            <WordTarget
                                key={`target-${index}`}
                                index={index}
                                expectedWordId={expectedWordId}
                                onDrop={handleWordDrop}
                                isOccupied={!!word}
                                placedWord={word}
                                highlightAsNext={highlightedWordIndex === index}
                                theme={gameSettings.theme}
                            >
                                {/* WordTarget doesn't accept children based on the interface */}
                            </WordTarget>
                        );
                    })}
                </div>

                {/* Draggable Words (Source Area) */} 
                <div className="draggable-words-container w-full flex flex-wrap justify-center gap-3 p-4 bg-white/50 dark:bg-black/40 backdrop-blur-sm rounded-lg shadow min-h-[100px]">
                    {shuffledWords.map((word) => (
                        <DraggableWord 
                            key={word.id} 
                            word={word}
                            index={word.index}
                            theme={gameSettings.theme}
                        />
                    ))}
                </div>

                {/* Power-ups Area */} 
                {gameSettings.powerUpsEnabled && (
                     <div className="power-ups-container flex justify-center gap-3 mt-8">
                        {powerUps.map(powerUp => {
                            // Import the correct icon dynamically
                            const IconComponent = 
                              powerUp.icon === 'shuffle' ? Shuffle :
                              powerUp.icon === 'lightbulb' ? Lightbulb :
                              powerUp.icon === 'sparkles' ? Sparkles :
                              powerUp.icon === 'zap' ? Zap : 
                              Sparkles; // Default fallback
                            
                            return (
                                <PowerUpButton 
                                    key={powerUp.id}
                                    powerUp={powerUp}
                                    theme={gameSettings.theme}
                                    onClick={() => activatePowerUp(powerUp.id)}
                                    icon={IconComponent}
                                />
                            );
                        })}
                    </div>
                )}

                {/* --- Overlays --- */} 
                
                {/* Game Completed Overlay */} 
                {gameState === 'completed' && (
                    <div className="game-overlay absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-20 rounded-lg">
                        <Trophy size={64} className="text-yellow-400 mb-4 animate-pulse" />
                        <h2 className="text-4xl font-bold mb-2">Sentence Built!</h2>
                        <p className="text-xl mb-4">Score: {stats.score} | Accuracy: {Math.round(stats.accuracy * 100)}%</p>
                        <div className="flex gap-4">
                            {/* Show 'Next' only if not custom OR if more sample sentences exist */} 
                            {(!useCustomSentence && availableSentences.length > levelIndex + 1) && (
                                <button onClick={handleNextLevel} className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded shadow text-lg transition-colors">Next Sentence</button>
                            )}
                            <button onClick={() => resetGame()} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow text-lg transition-colors">Play Again</button>
                        </div>
                    </div>
                )}
                
                {/* Timeout Overlay */} 
                {gameState === 'timeout' && (
                    <div className="game-overlay absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-20 rounded-lg">
                        <Clock size={64} className="text-red-400 mb-4 animate-ping" />
                        <h2 className="text-4xl font-bold mb-2">Time's Up!</h2>
                        <p className="text-xl mb-4">Final Score: {stats.score}</p>
                        <button onClick={() => resetGame()} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded shadow text-lg transition-colors">Try Again</button>
                    </div>
                )}

            </div>
        )}

        {/* Initial Ready State Screen (Before first start) */} 
        {gameState === 'ready' && !currentSentence && (
          <div className="flex-grow flex flex-col items-center justify-center">
            {(!useCustomSentence) && ( // Show if not using custom OR custom input is empty
                <>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-700 dark:text-gray-300">Ready to Build?</h2>
                    <button 
                        onClick={startGame} 
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out"
                        aria-label="Start game with a random sentence"
                    >
                        Start Random Sentence!
                    </button>
                </>
            )}
          </div>
        )}

        {/* Error State Screen */} 
        {gameState === 'error' && (
           <div className="flex-grow flex flex-col items-center justify-center text-red-600">
              <AlertCircle size={60} className="mb-4" />
              <h2 className="text-2xl font-bold mb-2">Oops! Something Went Wrong</h2>
              <p className="text-lg mb-4">Could not load game data or encountered an error.</p>
              <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow">
                Refresh Page
              </button>
           </div>
        )}

        {/* Footer: Theme Selector (Show when not playing) */} 
        {(gameState === 'ready' || gameState === 'completed' || gameState === 'timeout' || gameState === 'error') && (
            <footer className="settings-controls mt-auto pt-6 flex flex-wrap justify-center items-center gap-4">
                <ThemeSelector currentTheme={gameSettings.theme} onSelectTheme={(theme) => setGameSettings(s => ({...s, theme}))} />
            </footer>
        )}
      </div>
    </DndProvider>
  );
}

// Wrapper component for SoundProvider
export default function SpeedBuilderGame() {
  return (
    <SoundProvider>
      <SpeedBuilderGameInner />
    </SoundProvider>
  );
} 
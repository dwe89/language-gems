'use client';

import React, { useState, useEffect } from 'react'; // Removed useRef as backgroundMusicRef is gone
import { ThemeProvider, useTheme } from './ThemeProvider';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Zap, Volume2, VolumeX } from 'lucide-react';
import TokyoNightsAnimation from './themes/TokyoNightsAnimation';
import LavaTempleAnimation from './themes/LavaTempleAnimation';
import SpaceExplorerAnimation from './themes/SpaceExplorerAnimation';
import PirateAdventureAnimation from './themes/PirateAdventureAnimation';
import ClassicHangmanAnimation from './themes/ClassicHangmanAnimation';
import TempleGuardianModal from './TempleGuardianModal';
import TokyoNightsModal from './TokyoNightsModal';
import SpaceExplorerModal from './SpaceExplorerModal';
import PirateAdventureModal from './PirateAdventureModal'; // Confirm this path and component name
import { CentralizedVocabularyService, CentralizedVocabularyWord } from 'gems/services/centralizedVocabularyService';
import { createClient } from '@supabase/supabase-js';
// Removed: import { useAudio } from '../hooks/useAudio'; // This hook is used in the parent now

// Defined here so GameContent can use it
interface AudioFiles {
  themes: {
    'tokyo-nights': string;
    'pirate-adventure': string;
    'space-explorer': string;
    'lava-temple': string;
    'classic': string;
  };
  sfx: {
    'button-click': string;
    'correct-answer': string;
    'wrong-answer': string;
    'victory': string;
    'defeat': string;
    'tokyo-hack': string;
    'pirate-treasure': string;
    'space-docking': string;
    'temple-power': string;
  };
}

interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  category?: string;
  subcategory?: string;
  difficulty_level?: string;
  audio_url?: string;
}

interface HangmanGameProps {
  settings: {
    difficulty: string;
    category: string;
    subcategory?: string;
    language: string;
    theme: string;
    customWords?: string[];
    playAudio?: (word: string) => void;
  };
  vocabulary?: VocabularyItem[];
  onBackToMenu: () => void;
  onGameEnd?: (result: 'win' | 'lose') => void;
  isFullscreen?: boolean;
  isAssignmentMode?: boolean;
  playSFX: (soundName: keyof AudioFiles['sfx']) => void; // Passed from parent (HangmanPage.tsx)
  onOpenSettings?: () => void;
}

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

export function GameContent({ settings, vocabulary, onBackToMenu, onGameEnd, isFullscreen, isAssignmentMode, playSFX, onOpenSettings }: HangmanGameProps) {
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

  const [musicEnabled, setMusicEnabled] = useState(true); // Default to true, as background music is handled by parent

  // Add a state to track correct guesses for the Tokyo Nights theme
  const [correctLetterCounter, setCorrectLetterCounter] = useState(0);

  const [showTempleGuardianModal, setShowTempleGuardianModal] = useState(false);
  const [showTokyoNightsModal, setShowTokyoNightsModal] = useState(false);
  const [showSpaceExplorerModal, setShowSpaceExplorerModal] = useState(false);
  const [showPirateAdventureModal, setShowPirateAdventureModal] = useState(false);

  // Helper functions for exact letter matching (no accent normalization)
  const isLetterGuessed = (letter: string, guessedLetters: string[]): boolean => {
    const lowerLetter = letter.toLowerCase();
    return guessedLetters.includes(lowerLetter);
  };

  const doesWordContainLetter = (word: string, letter: string): boolean => {
    const lowerWord = word.toLowerCase();
    const lowerLetter = letter.toLowerCase();
    return lowerWord.includes(lowerLetter);
  };

  // Initialize game
  useEffect(() => {
    const getRandomWord = () => {
      // Check if we're using custom words
      if (settings.customWords && settings.customWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * settings.customWords.length);
        return settings.customWords[randomIndex];
      }

      // Use vocabulary from category selector if available
      if (vocabulary && vocabulary.length > 0) {
        console.log('Using vocabulary from category selector:', vocabulary.length, 'words');
        const randomIndex = Math.floor(Math.random() * vocabulary.length);
        const selectedItem = vocabulary[randomIndex];
        // Use the word in the target language
        return selectedItem.word || 'fallback';
      }

      // Fallback if no vocabulary is loaded
      console.warn('No vocabulary available, using fallback word');
      return 'fallback';
    };

    const newWord = getRandomWord().toLowerCase();
    setWord(newWord);
    // Get unique letters excluding spaces and normalize for comparison
    const uniqueLetters = [...new Set(newWord.split('').filter((char: string) => char !== ' '))] as string[];
    setWordLetters(uniqueLetters);
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
  }, [settings, vocabulary]);

  // Check win/lose conditions
  useEffect(() => {
    if (gameStatus !== 'playing' || guessedLetters.length === 0) return;

    // Check if all letters in the word have been guessed
    const hasWon = wordLetters.every(letter =>
      letter === ' ' || letter === '-' || isLetterGuessed(letter, guessedLetters)
    );

    if (hasWon) {
      setGameStatus('won');
      playSFX('victory'); // Use passed-in playSFX

      // Play audio for the completed word
      if (settings.playAudio) {
        setTimeout(() => {
          settings.playAudio!(word);
        }, 500); // Delay slightly to let the confetti start
      }

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
      playSFX('defeat'); // Use passed-in playSFX

      // Stop timer
      if (timerInterval) clearInterval(timerInterval);

      if (onGameEnd) onGameEnd('lose');
    }
  }, [guessedLetters, wordLetters, wrongGuesses, gameStatus, timerInterval, onGameEnd, playSFX, settings.playAudio, word]);

  const handleLetterGuess = (letter: string) => {
    const lowerLetter = letter.toLowerCase();

    if (gameStatus !== 'playing' || guessedLetters.includes(lowerLetter)) {
      return;
    }

    const newGuessedLetters = [...guessedLetters, lowerLetter];
    setGuessedLetters(newGuessedLetters);

    if (doesWordContainLetter(word, lowerLetter)) {
      // Correct guess
      playSFX('correct-answer'); // Use passed-in playSFX

      // Increment correct letter counter for the Tokyo Nights theme
      if (themeId === 'tokyo') {
        setCorrectLetterCounter(prev => prev + 1);
      }

      // Check if the player has won - check if all non-space letters are guessed
      const isWin = wordLetters.every(letter => isLetterGuessed(letter, newGuessedLetters));
      if (isWin) {
        playSFX('victory'); // Use passed-in playSFX
        setGameStatus('won');
        const newScore = calculateScore();
        setScore(newScore);

        // Play audio for the completed word
        if (settings.playAudio) {
          setTimeout(() => {
            settings.playAudio!(word);
          }, 500); // Delay slightly to let the win sound effects play first
        }

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
      playSFX('wrong-answer'); // Use passed-in playSFX

      setWrongGuesses(prev => prev + 1);

      // Check if the player has lost
      if (wrongGuesses + 1 >= MAX_ATTEMPTS) {
        playSFX('defeat'); // Use passed-in playSFX
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
    playSFX('button-click'); // Use passed-in playSFX
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
      if (settings.customWords && settings.customWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * settings.customWords.length);
        return settings.customWords[randomIndex];
      }

      // Use vocabulary from category selector if available
      if (vocabulary && vocabulary.length > 0) {
        console.log('Restart: Using vocabulary from category selector:', vocabulary.length, 'words');
        const randomIndex = Math.floor(Math.random() * vocabulary.length);
        const selectedItem = vocabulary[randomIndex];
        // Use the word in the target language
        return selectedItem.word || 'fallback';
      }

      // Fallback if no vocabulary is loaded
      console.warn('No vocabulary available, using fallback word');
      return 'fallback';
    };

    const newWord = getRandomWord().toLowerCase();
    setWord(newWord);
    setWordLetters([...new Set(newWord.split('').filter((char: string) => char !== ' '))] as string[]);

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

  // Removed toggleSound as it's now handled by the parent useAudio hook via playSFX
  // and music mute is also handled by the parent `useAudio` if passed in

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderThematicAnimation = () => {
    if (themeId === 'default') {
      return <ClassicHangmanAnimation mistakes={wrongGuesses} maxMistakes={MAX_ATTEMPTS} />;
    }

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

    // Pirate theme animation
    return <PirateAdventureAnimation mistakes={wrongGuesses} maxMistakes={MAX_ATTEMPTS} />;
  };


  const renderKeyboard = () => {
    // Two-row layout with accented letters based on language
    const getKeyboardLayout = () => {
      const baseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      let accentedLetters: string[] = [];

      // Add accented letters based on language
      switch (settings.language) {
        case 'spanish':
          accentedLetters = ['Á', 'É', 'Í', 'Ó', 'Ú', 'Ñ'];
          break;
        case 'french':
          accentedLetters = ['É', 'È', 'Ê', 'À', 'Ç'];
          break;
        case 'german':
          accentedLetters = ['Ä', 'Ö', 'Ü', 'ß'];
          break;
        case 'portuguese':
          accentedLetters = ['Á', 'É', 'Í', 'Ó', 'Ú', 'Ã', 'Ç'];
          break;
        default:
          accentedLetters = [];
      }

      const allLetters = [...baseAlphabet, ...accentedLetters];

      // Split into two rows
      const midPoint = Math.ceil(allLetters.length / 2);
      return {
        row1: allLetters.slice(0, midPoint),
        row2: allLetters.slice(midPoint)
      };
    };

    const { row1, row2 } = getKeyboardLayout();

    const renderRow = (letters: string[]) => (
      <div className="flex flex-wrap justify-center gap-1 md:gap-3">
        {letters.map((letter) => {
          const lowerLetter = letter.toLowerCase();
          const isUsed = guessedLetters.includes(lowerLetter);
          const isCorrect = isUsed && doesWordContainLetter(word, lowerLetter);
          const isWrong = isUsed && !doesWordContainLetter(word, lowerLetter);

          let buttonClass = "w-10 h-10 md:w-16 md:h-16 text-lg md:text-2xl font-bold rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95";

          if (isCorrect) {
            // Apply theme-specific styles for correct letters
            if (themeId === 'tokyo') {
              buttonClass += ` ${themeClassesState.accent} text-white shadow-lg shadow-pink-500/50 ring-2 ring-pink-400/50`;
            } else if (themeId === 'space') {
              buttonClass += ` ${themeClassesState.accent} text-white shadow-lg shadow-purple-500/50 ring-2 ring-purple-400/50`;
            } else if (themeId === 'temple') {
              buttonClass += ` ${themeClassesState.accent} text-white shadow-lg shadow-orange-500/50 ring-2 ring-orange-400/50`;
            } else if (themeId === 'pirate') {
              buttonClass += ` ${themeClassesState.accent} text-white shadow-lg shadow-amber-500/50 ring-2 ring-amber-400/50`;
            } else {
              buttonClass += ` ${themeClassesState.accent} text-white shadow-lg`;
            }
          } else if (isWrong) {
            // Apply styles for wrong letters
            buttonClass += " bg-red-600 text-white shadow-lg";
          } else if (!isUsed) {
            // Apply styles for unused letters
            buttonClass += " bg-white/90 hover:bg-white text-gray-800 shadow-md border border-white/50 backdrop-blur-sm";
          } else {
            // Fallback style
            buttonClass += " bg-gray-400 text-gray-600 shadow-sm";
          }

          return (
            <button
              key={letter}
              onClick={() => {
                playSFX('button-click'); // Use passed-in playSFX
                handleLetterGuess(letter);
              }}
              disabled={isUsed || gameStatus !== 'playing'}
              className={buttonClass}
            >
              {letter}
            </button>
          );
        })}
      </div>
    );

    return (
      <div className="space-y-2 md:space-y-6 mt-2 md:mt-4">
        {renderRow(row1)}
        {renderRow(row2)}
      </div>
    );
  };

  const renderWord = () => {
    return (
      <div className="flex justify-center flex-wrap gap-2 md:gap-4">
        {word.split('').map((letter, index) => {
          if (letter === ' ') {
            // Render a space character
            return (
              <div key={index} className="w-4 md:w-6 flex items-end justify-center">
                <div className="w-4 h-4 md:w-6 md:h-6"></div>
              </div>
            );
          }

          const isRevealed = isLetterGuessed(letter, guessedLetters);

          // Enhanced theme-specific glow effects for word squares
          let squareClass = 'w-10 h-12 md:w-14 md:h-16 flex items-center justify-center rounded-xl transition-all duration-300 backdrop-blur-sm';

          if (isRevealed) {
            // Theme-specific styling for revealed letters
            if (themeId === 'tokyo') {
              squareClass += ' bg-pink-600/90 text-white shadow-2xl shadow-pink-500/60 ring-2 ring-pink-400/70 glow-pink';
            } else if (themeId === 'space') {
              squareClass += ' bg-purple-600/90 text-white shadow-2xl shadow-purple-500/60 ring-2 ring-purple-400/70 glow-purple';
            } else if (themeId === 'temple') {
              squareClass += ' bg-orange-600/90 text-white shadow-2xl shadow-orange-500/60 ring-2 ring-orange-400/70 glow-orange';
            } else if (themeId === 'pirate') {
              squareClass += ' bg-amber-600/90 text-white shadow-2xl shadow-amber-500/60 ring-2 ring-amber-400/70 glow-amber';
            } else {
              squareClass += ' bg-blue-600/90 text-white shadow-2xl shadow-blue-500/60 ring-2 ring-blue-400/70';
            }
          } else {
            // Unrevealed letter styling with subtle theme hints
            if (themeId === 'tokyo') {
              squareClass += ' bg-white/70 border-2 border-pink-300/50 shadow-lg shadow-pink-500/20';
            } else if (themeId === 'space') {
              squareClass += ' bg-white/70 border-2 border-purple-300/50 shadow-lg shadow-purple-500/20';
            } else if (themeId === 'temple') {
              squareClass += ' bg-white/70 border-2 border-orange-300/50 shadow-lg shadow-orange-500/20';
            } else if (themeId === 'pirate') {
              squareClass += ' bg-white/70 border-2 border-amber-300/50 shadow-lg shadow-amber-500/20';
            } else {
              squareClass += ' bg-white/70 border-2 border-blue-300/50 shadow-lg shadow-blue-500/20';
            }
          }

          return (
            <div key={index} className="text-center">
              <div className={squareClass}>
                <span className="text-lg md:text-2xl font-bold">
                  {isRevealed ? letter.toUpperCase() : ''}
                </span>
              </div>
            </div>
          );
        })}
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
        dangerText: 'Password Attempts',
        winMessage: 'Hack Successful!',
        loseMessage: 'System Breached!'
      });
    } else if (themeId === 'temple') {
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-amber-900',
        text: 'text-amber-50',
        accent: 'bg-amber-600',
        button: 'bg-amber-700 hover:bg-amber-800',
        dangerText: 'Escape Chances',
        winMessage: 'Ancient Secret Unlocked!',
        loseMessage: 'Trapped in the Temple!'
      });
    } else if (themeId === 'space') {
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-slate-800',
        text: 'text-purple-50',
        accent: 'bg-purple-600',
        button: 'bg-purple-700 hover:bg-purple-800',
        dangerText: 'Oxygen Level',
        winMessage: 'Mission Accomplished!',
        loseMessage: 'Lost in Space!'
      });
    } else if (themeId === 'pirate') {
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-blue-900',
        text: 'text-amber-50',
        accent: 'bg-amber-600',
        button: 'bg-amber-700 hover:bg-amber-800',
        dangerText: 'Lives Remaining',
        winMessage: 'Treasure Found!',
        loseMessage: 'Walk the Plank!'
      });
    } else { // Default / Classic theme
      setThemeClassesState({
        ...themeClasses,
        background: 'bg-gray-800',
        text: 'text-white',
        accent: 'bg-blue-600',
        button: 'bg-blue-700 hover:bg-blue-800',
        dangerText: 'Lives Remaining',
        winMessage: 'You Won!',
        loseMessage: 'Game Over!'
      });
    }
  }, [themeId, themeClasses]);

  // Add an effect to show the theme-specific modals when theme is selected
  useEffect(() => {
    // Only show modal once per session
    const showModalOnce = (modalKey: string, setShowModal: (state: boolean) => void) => {
      const hasSeenModal = sessionStorage.getItem(modalKey);
      if (!hasSeenModal) {
        setShowModal(true);
        sessionStorage.setItem(modalKey, 'true');
      }
    };

    if (settings.theme === 'lava-temple') {
      showModalOnce('has-seen-temple-guardian-modal', setShowTempleGuardianModal);
    } else if (settings.theme === 'tokyo') {
      showModalOnce('has-seen-tokyo-nights-modal', setShowTokyoNightsModal);
    } else if (settings.theme === 'space') {
      showModalOnce('has-seen-space-explorer-modal', setShowSpaceExplorerModal);
    } else if (settings.theme === 'pirate') {
      showModalOnce('has-seen-pirate-adventure-modal', setShowPirateAdventureModal);
    }
  }, [settings.theme]);

  return (
    <div className={`fixed inset-0 ${themeClassesState.background} ${themeClassesState.text} flex flex-col overflow-hidden z-40`}>
      {/* Custom CSS for glow effects */}
      <style jsx>{`
        .glow-pink {
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.6), 0 0 40px rgba(236, 72, 153, 0.4), 0 0 60px rgba(236, 72, 153, 0.2);
        }
        .glow-purple {
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.6), 0 0 40px rgba(147, 51, 234, 0.4), 0 0 60px rgba(147, 51, 234, 0.2);
        }
        .glow-orange {
          box-shadow: 0 0 20px rgba(234, 88, 12, 0.6), 0 0 40px rgba(234, 88, 12, 0.4), 0 0 60px rgba(234, 88, 12, 0.2);
        }
        .glow-amber {
          box-shadow: 0 0 20px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.2);
        }
      `}</style>

      {/* Background video/animation fills entire screen */}
      <div className="absolute inset-0">
        {renderThematicAnimation()}
      </div>

      {/* Top navigation and info bar - fixed above game content */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-3 md:p-4 bg-black/30 backdrop-blur-sm">
        {!isFullscreen && (
          <button
            onClick={onBackToMenu}
            className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center text-sm md:text-base"
          >
            <span className="md:hidden">←</span>
            <span className="hidden md:inline">Back to Games</span>
          </button>
        )}

        {/* Game info - responsive layout */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4 mx-2 md:mx-4">
          {!isAssignmentMode && (
            <div className="text-xs md:text-sm font-medium text-center">
              {settings.category.charAt(0).toUpperCase() + settings.category.slice(1)} - {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)}
            </div>
          )}

          <div className="text-xs md:text-sm opacity-75">
            {formatTime(timer)}
          </div>

          {/* Lives remaining in top bar */}
          {gameStatus === 'playing' && (
            <div className="text-xs md:text-sm font-medium">
              <span className="opacity-75">Lives:</span> {MAX_ATTEMPTS - wrongGuesses}/{MAX_ATTEMPTS}
            </div>
          )}
        </div>

        {/* Control buttons */}
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Settings button */}
          {onOpenSettings && (
            <button
              onClick={() => {
                playSFX('button-click');
                onOpenSettings();
              }}
              className="p-1.5 md:p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
              title="Settings"
            >
              ⚙️
            </button>
          )}

          {/* Music toggle button (now controls UI icon, actual music by parent) */}
          <button
            onClick={() => {
              playSFX('button-click'); // SFX for the button click itself
              setMusicEnabled(prev => !prev); // Toggle local state for icon change
              // If you want this button to control the parent's background music,
              // you'd need to pass a `toggleMusic` prop from HangmanPage.tsx here.
            }}
            className="p-1.5 md:p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            title={musicEnabled ? "Mute music" : "Play music"}
          >
            {musicEnabled ? <Volume2 size={14} className="md:w-4 md:h-4" /> : <VolumeX size={14} className="md:w-4 md:h-4" />}
          </button>

          {/* Hint button */}
          <button
            onClick={() => {
              playSFX('button-click'); // Use passed-in playSFX
              handleHint();
            }}
            disabled={hints <= 0 || gameStatus !== 'playing'}
            className={`
              relative flex items-center gap-1 px-2 md:px-3 py-1 rounded-lg
              ${hints > 0 && gameStatus === 'playing'
                ? `${themeClassesState.button}`
                : 'bg-gray-400 opacity-50'
              }
              text-white text-xs md:text-sm font-medium
            `}
          >
            <Zap size={14} className="md:w-4 md:h-4" />
            <span className="hidden md:inline">Hint</span>
            <span className="md:ml-1">({hints})</span>

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

      {/* Progress bar - fixed below navigation */}
      <div className="fixed top-16 md:top-20 left-0 right-0 z-50 px-3 md:px-4 pb-3 md:pb-4">
        <div className="w-full h-2 md:h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${100 - (wrongGuesses / MAX_ATTEMPTS * 100)}%`,
              backgroundColor: wrongGuesses > 4 ? 'red' : wrongGuesses > 2 ? 'orange' : 'green',
            }}
          ></div>
        </div>
      </div>

      {/* Main game content area - positioned below fixed UI */}
      <div className="relative z-40 flex-1 flex flex-col pt-24 md:pt-28 pb-4">        <div className="flex-1"></div>



        {/* Word display positioned much lower */}
        {gameStatus === 'playing' && (
          <div className="px-2 md:px-4 pb-4 md:pb-8">
            {renderWord()}
          </div>
        )}

        {/* Keyboard area positioned at bottom with more space for larger letters */}
        <div className="px-2 md:px-4 pb-4 md:pb-8">
          {gameStatus === 'playing' ? (
            <div className={`transition-all duration-300 ${animation === 'wrong' ? 'scale-105' : animation === 'correct' ? 'scale-95' : ''}`}>
              {renderKeyboard()}
            </div>
          ) : (
            <div className="text-center">
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
                  onClick={() => {
                    playSFX('button-click'); // Use passed-in playSFX
                    resetGame();
                  }}
                  className={`${themeClassesState.button} py-3 px-6 rounded-lg font-bold text-white`}
                >
                  Play Again
                </button>

                <button
                  onClick={() => {
                    playSFX('button-click'); // Use passed-in playSFX
                    onBackToMenu();
                  }}
                  className="bg-gray-700 hover:bg-gray-600 py-3 px-6 rounded-lg font-bold text-white"
                >
                  Back to Games
                </button>
              </div>
            </div>
          )}
        </div>
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

      <PirateAdventureModal
        isOpen={showPirateAdventureModal}
        onClose={() => setShowPirateAdventureModal(false)}
      />
    </div>
  );
}

export default function HangmanGame({ playSFX, ...props }: HangmanGameProps) { // <--- FIXED HERE
  return (
    <ThemeProvider themeId={props.settings.theme}>
      <GameContent playSFX={playSFX} {...props} /> {/* <--- FIXED HERE */}
    </ThemeProvider>
  );
}
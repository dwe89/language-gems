'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBackOutline, IoExpandOutline, IoContractOutline } from 'react-icons/io5';
import WordGuesser from './components/WordGuesser';
import GameSettings from './components/GameSettings';
import { WordGuesserSettings, GameStats } from './types';
import './word-guesser.css';

// For image preloading
const FOREST_BG_URL = '/images/forest-bg.jpg';

export default function WordGuesserPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<(WordGuesserSettings & {
    selectedCategory: string;
    selectedSubcategory: string | null;
    theme: string;
  }) | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    currentStreak: 0,
    maxStreak: 0,
    winDistribution: [0, 0, 0, 0, 0, 0, 0]
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [forestTheme, setForestTheme] = useState(true);

  // Preload forest background image
  useEffect(() => {
    const img = new Image();
    img.src = FOREST_BG_URL;
  }, []);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Load stats from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('wordGuesserStats');
      if (savedStats) {
        try {
          setGameStats(JSON.parse(savedStats));
        } catch (error) {
          console.error('Failed to parse saved stats', error);
        }
      }
    }
  }, []);

  // Setup fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Toggle forest theme
  const toggleTheme = () => {
    setForestTheme(prev => !prev);
  };

  // Handle start game with selected settings
  const handleStartGame = (selectedSettings: WordGuesserSettings & {
    selectedCategory: string;
    selectedSubcategory: string | null;
    theme: string;
  }) => {
    setSettings(selectedSettings);
    setGameStarted(true);
  };

  // Handle back to settings menu
  const handleBackToMenu = () => {
    setGameStarted(false);
  };

  // Handle game end and update stats
  const handleGameEnd = (result: 'win' | 'lose') => {
    const newStats = { ...gameStats };
    newStats.gamesPlayed += 1;
    
    if (result === 'win') {
      newStats.gamesWon += 1;
      newStats.currentStreak += 1;
      if (newStats.currentStreak > newStats.maxStreak) {
        newStats.maxStreak = newStats.currentStreak;
      }
    } else {
      newStats.gamesLost += 1;
      newStats.currentStreak = 0;
    }
    
    setGameStats(newStats);
    
    // Save to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('wordGuesserStats', JSON.stringify(newStats));
    }
  };

  // Get theme-based styling
  const getContainerClasses = () => {
    if (settings?.theme === 'tokyo') {
      return 'min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950';
    } else if (settings?.theme === 'neon') {
      return 'min-h-screen bg-black';
    } else if (settings?.theme === 'space') {
      return 'min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-950';
    } else {
      return `min-h-screen ${forestTheme ? '' : 'bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900'}`;
    }
  };

  return (
    <div className={`${getContainerClasses()} ${isFullscreen ? 'fullscreen-active' : ''}`}>
      {(forestTheme || settings?.theme === 'forest') && (
        <>
          <div className="forest-background"></div>
          <div className="forest-overlay"></div>
          <div className="leaves-top"></div>
          <div className="leaves-bottom"></div>
          <div className="sunbeam"></div>
        </>
      )}
      
      <div className={`container mx-auto ${isFullscreen ? 'h-screen flex flex-col p-0' : 'px-4 py-4 md:p-6'} relative z-10`}>
        {!isFullscreen && (
          <header className={`flex justify-between items-center mb-4 ${forestTheme ? 'bg-white/80 backdrop-blur-sm' : 'bg-white dark:bg-slate-700'} p-4 rounded-lg shadow-sm`}>
            <div className="flex items-center gap-2">
              <Link 
                href="/games" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <IoChevronBackOutline className="mr-1" />
                <span className={isMobile ? 'sr-only' : ''}>Games</span>
              </Link>
              <h1 className="text-xl md:text-2xl font-bold ml-2 md:ml-4 text-gray-800 dark:text-white">Word Guesser</h1>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-green-600 hover:bg-green-700 text-white"
                aria-label="Toggle theme"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              
              <button
                onClick={toggleFullscreen}
                className={`p-2 rounded-full ${forestTheme ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-white'}`}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <IoContractOutline size={20} /> : <IoExpandOutline size={20} />}
              </button>
            </div>
          </header>
        )}
        
        {isFullscreen && gameStarted && (
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-full ${forestTheme ? 'bg-green-600 bg-opacity-80 hover:bg-opacity-100' : 'bg-gray-800 bg-opacity-50 hover:bg-opacity-70'} text-white`}
              aria-label="Exit fullscreen"
            >
              <IoContractOutline size={20} />
            </button>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {!gameStarted ? (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`${isFullscreen ? 'flex-grow flex items-center justify-center' : ''}`}
            >
              <div className={`max-w-3xl mx-auto ${isFullscreen ? 'w-full' : ''} ${forestTheme ? 'theme-forest-settings p-6' : ''}`}>
                <GameSettings onStartGame={handleStartGame} />
                
                {/* Game Stats Display */}
                {gameStats.gamesPlayed > 0 && !isFullscreen && (
                  <div className={`mt-6 ${forestTheme ? 'bg-white/85 backdrop-blur-sm' : 'bg-white dark:bg-slate-700'} rounded-lg shadow-md p-4`}>
                    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Your Stats</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className={`text-xl md:text-2xl font-bold ${forestTheme ? 'text-green-700' : 'text-purple-600 dark:text-purple-400'}`}>{gameStats.gamesPlayed}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Games</div>
                      </div>
                      <div>
                        <div className={`text-xl md:text-2xl font-bold ${forestTheme ? 'text-green-700' : 'text-green-600 dark:text-green-400'}`}>{gameStats.gamesWon}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Wins</div>
                      </div>
                      <div>
                        <div className={`text-xl md:text-2xl font-bold ${forestTheme ? 'text-green-700' : 'text-blue-600 dark:text-blue-400'}`}>{gameStats.currentStreak}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Streak</div>
                      </div>
                      <div>
                        <div className={`text-xl md:text-2xl font-bold ${forestTheme ? 'text-green-700' : 'text-amber-600 dark:text-amber-400'}`}>{gameStats.maxStreak}</div>
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Best Streak</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            settings && (
              <motion.div 
                key="game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`${isFullscreen ? 'flex-grow w-full h-full flex items-center justify-center' : `${forestTheme ? 'bg-white/75 backdrop-blur-sm' : 'bg-white dark:bg-slate-700'} rounded-xl p-4 shadow-lg`} relative z-10`}
              >
                <WordGuesser 
                  settings={settings} 
                  onBackToMenu={handleBackToMenu} 
                  onGameEnd={handleGameEnd}
                />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBackOutline, IoExpandOutline, IoContractOutline } from 'react-icons/io5';
import HangmanGame from './components/HangmanGame';
import GameSettings from './components/GameSettings';

export default function HangmanPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    difficulty: 'beginner',
    category: 'animals',
    language: 'spanish',
    theme: 'default',
    customWords: [] as string[],
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    streak: 0,
    bestStreak: 0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [setupStage, setSetupStage] = useState<'language' | 'category' | 'difficulty'>('language');

  // Load stats from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('hangmanStats');
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

  const handleLanguageSelect = (language: string) => {
    setSettings(prev => ({ ...prev, language }));
    setSetupStage('category');
  };

  const handleCategorySelect = (category: string, customWords?: string[]) => {
    if (category === 'custom' && !customWords) {
      // Don't proceed until custom words are provided
      return;
    }
    
    const newSettings = { ...settings, category };
    if (customWords) {
      newSettings.customWords = customWords;
    }
    
    setSettings(newSettings);
    setSetupStage('difficulty');
  };

  const handleDifficultySelect = (difficulty: string, theme: string) => {
    setSettings(prev => ({ ...prev, difficulty, theme }));
    startGame();
  };

  const handleStartGame = (settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    customWords: string[];
  }) => {
    setSettings(settings);
    startGame();
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
    setSetupStage('language');
  };

  const handleGameEnd = (result: 'win' | 'lose') => {
    const newStats = { ...gameStats };
    newStats.gamesPlayed += 1;
    
    if (result === 'win') {
      newStats.gamesWon += 1;
      newStats.streak += 1;
      if (newStats.streak > newStats.bestStreak) {
        newStats.bestStreak = newStats.streak;
      }
    } else {
      newStats.gamesLost += 1;
      newStats.streak = 0;
    }
    
    setGameStats(newStats);
    
    // Save to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hangmanStats', JSON.stringify(newStats));
    }
  };

  return (
    <div className={`min-h-screen ${isFullscreen ? 'bg-gray-100 dark:bg-gray-900' : ''}`}>
      <div className={`container mx-auto ${isFullscreen ? 'h-screen flex flex-col p-0' : 'p-4 md:p-8'}`}>
        {!isFullscreen && (
          <header className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Link 
                href="/games" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <IoChevronBackOutline className="mr-1" />
                <span>Games</span>
              </Link>
              <h1 className="text-2xl font-bold ml-4">Hangman</h1>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
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
              className="p-2 rounded-full bg-gray-800 bg-opacity-50 hover:bg-opacity-70 text-white"
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
              <div className={`max-w-3xl mx-auto ${isFullscreen ? 'w-full' : ''}`}>
                <GameSettings 
                  onStartGame={handleStartGame}
                  setupStage={setupStage}
                  onLanguageSelect={handleLanguageSelect}
                  onCategorySelect={handleCategorySelect}
                  onDifficultySelect={handleDifficultySelect}
                />
                
                {/* Game Stats Display */}
                {gameStats.gamesPlayed > 0 && !isFullscreen && (
                  <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-semibold mb-2 text-gray-800">Your Stats</h2>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{gameStats.gamesPlayed}</div>
                        <div className="text-sm text-gray-600">Games</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{gameStats.gamesWon}</div>
                        <div className="text-sm text-gray-600">Wins</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{gameStats.streak}</div>
                        <div className="text-sm text-gray-600">Streak</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-amber-600">{gameStats.bestStreak}</div>
                        <div className="text-sm text-gray-600">Best Streak</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${isFullscreen ? 'flex-grow w-full h-full' : ''}`}
            >
              <HangmanGame 
                settings={settings} 
                onBackToMenu={handleBackToMenu} 
                onGameEnd={handleGameEnd}
                isFullscreen={isFullscreen}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBackOutline, IoExpandOutline, IoContractOutline } from 'react-icons/io5';
import { useVocabularyByCategory } from '../../../hooks/useVocabulary';
import HangmanGameWrapper from './components/HangmanGameWrapper';
import GameSettings from './components/GameSettings';

export default function HangmanPage() {
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

  // Category selection state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  
  // Use category-based vocabulary when categories are selected
  const {
    vocabulary: categoryVocabulary
  } = useVocabularyByCategory({
    language: 'spanish',
    categoryId: selectedCategory || undefined,
    subcategoryId: selectedSubcategory || undefined
  });

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
    <div className={`min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 ${isFullscreen ? 'flex flex-col' : 'p-6'}`}>
      <div className={`${isFullscreen ? 'flex-grow flex flex-col' : 'max-w-6xl mx-auto'}`}>
        
        {/* Header with Navigation */}
        {!isFullscreen && (
          <div className="flex items-center justify-between mb-8">
            <Link href="/games" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
              <IoChevronBackOutline size={24} />
              <span className="font-medium">Games</span>
            </Link>
            
            <button
              onClick={toggleFullscreen}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              aria-label="Toggle fullscreen"
            >
              <IoExpandOutline size={20} />
              <span>Fullscreen</span>
            </button>
          </div>
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
              <div className="w-full">
                <GameSettings
                  onStartGame={handleStartGame}
                  selectedCategory={selectedCategory}
                  selectedSubcategory={selectedSubcategory}
                  onCategoryChange={setSelectedCategory}
                  onSubcategoryChange={setSelectedSubcategory}
                  categoryVocabulary={categoryVocabulary}
                />
                
                {/* Game Stats Display */}
                {gameStats.gamesPlayed > 0 && !isFullscreen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg p-6 mt-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                          <div className="text-2xl">🎮</div>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {gameStats.gamesPlayed}
                        </div>
                        <div className="text-sm text-gray-500">Games Played</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                          <div className="text-2xl">🏆</div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {gameStats.gamesWon}
                        </div>
                        <div className="text-sm text-gray-500">Games Won</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                          <div className="text-2xl">🔥</div>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                          {streak}
                        </div>
                        <div className="text-sm text-gray-500">Current Streak</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                          <div className="text-2xl">⭐</div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {gameStats.bestStreak}
                        </div>
                        <div className="text-sm text-gray-500">Best Streak</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${isFullscreen ? 'flex-grow w-full h-full' : 'w-full'}`}
            >
              <HangmanGameWrapper 
                settings={{
                  ...settings,
                  categoryVocabulary: selectedCategory && selectedCategory !== '' ? categoryVocabulary : undefined
                }} 
                onBackToMenu={handleBackToMenu} 
                onGameEnd={handleGameEnd}
                isFullscreen={isFullscreen}
              />
            </motion.div>
          )}
        </AnimatePresence>
                
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
                        <div className="text-2xl font-bold text-blue-600">{streak}</div>
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
              <HangmanGameWrapper 
                settings={{
                  ...settings,
                  categoryVocabulary: selectedCategory && selectedCategory !== '' ? categoryVocabulary : undefined
                }} 
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
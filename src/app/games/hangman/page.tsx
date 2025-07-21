'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBackOutline, IoExpandOutline, IoContractOutline } from 'react-icons/io5';
import { BookOpen } from 'lucide-react';
import CategorySelector from '../../../components/games/CategorySelector';
import { useVocabularyByCategory } from '../../../hooks/useVocabulary';
import { KS3_SPANISH_CATEGORIES, getCategoryById } from '../../../utils/categories';
import HangmanGameWrapper from './components/HangmanGameWrapper';
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
  
  // Category selection state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  
  // Use category-based vocabulary when categories are selected
  const { 
    vocabulary: categoryVocabulary, 
    loading: categoryLoading, 
    error: categoryError 
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
                {/* Category Selection */}
                <div className="mb-6 bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Choose Topics</h3>
                    <button
                      onClick={() => setShowCategorySelector(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Select Topics</span>
                    </button>
                  </div>
                  
                  {selectedCategory && selectedCategory !== '' && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-purple-800">
                            {getCategoryById(selectedCategory)?.name || selectedCategory}
                          </span>
                          {selectedSubcategory && selectedSubcategory !== '' && (
                            <>
                              <span className="text-purple-600">→</span>
                              <span className="text-sm text-purple-700">{selectedSubcategory}</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
                          {categoryLoading ? 'Loading...' : `${categoryVocabulary?.length || 0} words`}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategory('');
                          setSelectedSubcategory('');
                        }}
                        className="text-purple-600 hover:text-purple-800 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  
                  {(!selectedCategory || selectedCategory === '') && (
                    <div className="text-center py-4 text-gray-500">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>Select topics to practice specific vocabulary</p>
                      <p className="text-sm">or continue with default categories</p>
                    </div>
                  )}
                </div>

                <GameSettings 
                  onStartGame={handleStartGame}
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

        {/* Category Selection Modal */}
        {showCategorySelector && (
          <CategorySelector 
            onCategorySelect={(categoryId, subcategoryId) => {
              setSelectedCategory(categoryId);
              setSelectedSubcategory(subcategoryId || '');
              setShowCategorySelector(false);
            }}
            selectedLanguage="es"
          />
        )}
      </div>
    </div>
  );
} 
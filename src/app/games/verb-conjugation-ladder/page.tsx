'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBackOutline, IoExpandOutline, IoContractOutline } from 'react-icons/io5';
import ConjugationGame from './components/ConjugationGame';
import GameSettings from './components/GameSettings';
import './styles.css';

export default function VerbConjugationPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    difficulty: 'beginner',
    language: 'spanish',
    tense: 'present',
    theme: 'default',
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    highestLevel: 0,
    bestTime: null as number | null,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [setupStage, setSetupStage] = useState<'language' | 'difficulty' | 'tense'>('language');

  // Load stats from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStats = localStorage.getItem('conjugationLadderStats');
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
    setSetupStage('difficulty');
  };

  const handleDifficultySelect = (difficulty: string) => {
    setSettings(prev => ({ ...prev, difficulty }));
    setSetupStage('tense');
  };

  const handleTenseSelect = (tense: string, theme: string) => {
    setSettings(prev => ({ ...prev, tense, theme }));
    startGame();
  };

  const handleStartGame = (settings: {
    difficulty: string;
    language: string;
    tense: string;
    theme: string;
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

  const handleGameEnd = (stats: {
    correctAnswers: number;
    incorrectAnswers: number;
    levelReached: number;
    timeTaken: number;
  }) => {
    const newStats = { ...gameStats };
    newStats.gamesPlayed += 1;
    newStats.correctAnswers += stats.correctAnswers;
    newStats.incorrectAnswers += stats.incorrectAnswers;
    
    if (stats.levelReached > newStats.highestLevel) {
      newStats.highestLevel = stats.levelReached;
    }
    
    if (newStats.bestTime === null || stats.timeTaken < newStats.bestTime) {
      newStats.bestTime = stats.timeTaken;
    }
    
    setGameStats(newStats);
    
    // Save to local storage
    if (typeof window !== 'undefined') {
      localStorage.setItem('conjugationLadderStats', JSON.stringify(newStats));
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
              <h1 className="text-2xl font-bold ml-4">Verb Adventure</h1>
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
                  onDifficultySelect={handleDifficultySelect}
                  onTenseSelect={handleTenseSelect}
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
                        <div className="text-2xl font-bold text-green-600">{gameStats.correctAnswers}</div>
                        <div className="text-sm text-gray-600">Correct</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">{gameStats.highestLevel}</div>
                        <div className="text-sm text-gray-600">Highest Level</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {gameStats.bestTime ? `${Math.floor(gameStats.bestTime / 60)}:${(gameStats.bestTime % 60).toString().padStart(2, '0')}` : '-'}
                        </div>
                        <div className="text-sm text-gray-600">Best Time</div>
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
              <ConjugationGame 
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
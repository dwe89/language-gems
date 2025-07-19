'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ThemeProvider } from './components/ThemeProvider';
import GameSettings from './components/GameSettings';
import TicTacToeGameThemed from './components/TicTacToeGameThemed';
import { useAudio } from './hooks/useAudio';

export default function NoughtsAndCrossesPage() {
  const [soundEnabled] = useState(true);
  const { playSFX } = useAudio(soundEnabled);
  
  const [gameStarted, setGameStarted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [gameSettings, setGameSettings] = useState({
    difficulty: 'beginner',
    category: 'animals',
    language: 'spanish',
    theme: 'default',
    playerMark: 'X',
    computerMark: 'O'
  });

  const startGame = (settings: { 
    difficulty: string; 
    category: string; 
    language: string;
    theme: string;
    playerMark: string;
    computerMark: string;
  }) => {
    setGameSettings(settings);
    setGameStarted(true);
  };

  const backToMenu = () => {
    setGameStarted(false);
    setShowIntro(true);
  };

  const closeIntro = () => {
    setShowIntro(false);
  };

  const handleGameEnd = (result: { outcome: 'win' | 'loss' | 'tie'; wordsLearned: number }) => {
    // Don't automatically return to intro - let player choose to play again or exit
    console.log('Game ended:', result);
  };

  return (
    <ThemeProvider themeId={gameSettings.theme}>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        
        {/* Introductory Modal */}
        <AnimatePresence>
          {showIntro && !gameStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-200 overflow-hidden mx-auto"
                style={{ maxHeight: '90vh' }}
              >
                {/* Header with game preview */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white text-center">
                  <motion.div
                    initial={{ scale: 0.5, rotate: 45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-5xl mb-3"
                  >
                    🎯
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    Vocabulary Tic-Tac-Toe
                  </h1>
                  <p className="text-lg text-purple-100 max-w-xl mx-auto">
                    Master languages through strategic gameplay! Answer vocabulary questions to make your moves.
                  </p>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* How to Play */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                        <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">1</span>
                        How to Play
                      </h3>
                      <ul className="space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          Choose your settings and theme
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          Answer vocabulary questions correctly
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          Get three in a row to win!
                        </li>
                      </ul>
                    </div>
                    
                    {/* Features */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                        <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-2">✨</span>
                        Features
                      </h3>
                      <ul className="space-y-2 text-gray-600 text-sm">
                        <li className="flex items-start">
                          <span className="text-pink-500 mr-2">•</span>
                          Immersive themed adventures
                        </li>
                        <li className="flex items-start">
                          <span className="text-pink-500 mr-2">•</span>
                          Spanish & French vocabulary
                        </li>
                        <li className="flex items-start">
                          <span className="text-pink-500 mr-2">•</span>
                          Adaptive difficulty levels
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4">
                    <motion.button
                      onClick={closeIntro}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full text-lg shadow-xl hover:shadow-2xl transition-all"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🚀 Let's Play!
                    </motion.button>
                    
                    <Link href="/games">
                      <motion.button
                        className="px-8 py-3 bg-gray-100 text-gray-600 font-bold rounded-full text-lg border border-gray-200 hover:bg-gray-50 transition-all"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ← Back to Games
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Game Area - Full Width */}
        <div className="w-full">
          {/* Header - Only show when intro is closed and not in game */}
          {!showIntro && !gameStarted && (
            <motion.div 
              className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href="/games" className="text-white hover:text-white/80 transition-colors">
                <motion.div
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-3 rounded-full transition-all border border-white/30"
                  whileHover={{ scale: 1.05, x: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Games</span>
                </motion.div>
              </Link>
              
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-white text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                🎯 Vocabulary Tic-Tac-Toe
              </motion.h1>
              
              <div className="w-32"></div> {/* Spacer for centering */}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!gameStarted ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                {!showIntro && (
                  <GameSettings onStartGame={startGame} />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-screen"
              >
                <TicTacToeGameThemed 
                  settings={gameSettings}
                  onBackToMenu={backToMenu}
                  onGameEnd={handleGameEnd}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ThemeProvider>
  );
}
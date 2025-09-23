'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../../components/auth/AuthProvider';
import LanguageSelection from './LanguageSelection';
import TempleRestoration from './TempleRestoration';
import TabletCompleted from './TabletCompleted';
import { EnhancedGameService } from '../../../../services/enhancedGameService';

export interface GameConfig {
  language: 'spanish' | 'french' | 'german';
  category: string;
  subcategory: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LavaTempleWordRestoreGameProps {
  gameConfig: GameConfig;
  onBackToLauncher?: () => void;
  onBackToMenu?: () => void;
  onRestorationComplete?: (result: {
    score: number;
    correctAnswers: number;
    totalAttempts: number;
    accuracy: number;
    duration: number;
    tabletsRestored: number;
    fillInBlankAccuracy?: number;
    contextClueUsage?: number;
    templeProgression?: number;
  }) => void;
  gameSessionId?: string | null;
  gameService?: EnhancedGameService | null;
  onOpenSettings?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

type GameState = 'temple-restoration' | 'tablet-completed';

export default function LavaTempleWordRestoreGame({
  gameConfig,
  onBackToLauncher,
  onBackToMenu,
  onRestorationComplete,
  gameSessionId,
  gameService,
  onOpenSettings,
  isMuted,
  onToggleMute
}: LavaTempleWordRestoreGameProps) {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>('temple-restoration');
  const [gameResults, setGameResults] = useState<any>(null);

  // Handle temple restoration completion
  const handleRestorationComplete = (results: any) => {
    setGameResults(results);

    // Call the enhanced restoration completion handler if provided
    if (onRestorationComplete) {
      onRestorationComplete({
        score: results.score || 0,
        correctAnswers: results.correctAnswers || 0,
        totalAttempts: results.totalAttempts || 0,
        accuracy: results.accuracy || 0,
        duration: results.duration || 0,
        tabletsRestored: results.tabletsRestored || 0,
        fillInBlankAccuracy: results.accuracy || 0,
        contextClueUsage: results.contextClueUsage || 0,
        templeProgression: results.tabletsRestored || 0
      });
    }

    setGameState('tablet-completed');
  };

  // Handle play again
  const handlePlayAgain = () => {
    if (onBackToLauncher) {
      onBackToLauncher();
    }
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    if (onBackToMenu) {
      onBackToMenu();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 via-orange-900 to-yellow-900 relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/games/noughts-and-crosses/images/lava-temple/lava-temple-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Video overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
      </div>

      {/* Game Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {gameState === 'temple-restoration' && (
            <motion.div
              key="temple-restoration"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <TempleRestoration
                gameConfig={gameConfig}
                onRestorationComplete={handleRestorationComplete}
                onBackToMenu={handleBackToMenu}
                gameSessionId={gameSessionId}
                gameService={gameService}
                onOpenSettings={onOpenSettings}
                isMuted={isMuted}
                onToggleMute={onToggleMute}
              />
            </motion.div>
          )}

          {gameState === 'tablet-completed' && (
            <motion.div
              key="tablet-completed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.6 }}
            >
              <TabletCompleted
                results={gameResults}
                onPlayAgain={handlePlayAgain}
                onBackToMenu={handleBackToMenu}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

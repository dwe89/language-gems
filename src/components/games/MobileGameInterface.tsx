// Mobile-Optimized Game Interface Component
// Provides consistent mobile experience across all LanguageGems games

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Home,
  Settings,
  Trophy,
  Star,
  Zap,
  Heart,
  Timer
} from 'lucide-react';

interface MobileGameInterfaceProps {
  // Game State
  gameTitle: string;
  currentScore: number;
  currentLevel?: number;
  timeRemaining?: number;
  lives?: number;
  streak?: number;
  
  // Game Controls
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
  onToggleSound: () => void;
  
  // Game Status
  isPaused: boolean;
  isGameOver: boolean;
  soundEnabled: boolean;
  
  // Mobile-specific props
  showTimer?: boolean;
  showLives?: boolean;
  showStreak?: boolean;
  customActions?: Array<{
    icon: React.ReactNode;
    label: string;
    action: () => void;
    color?: string;
  }>;
  
  children: React.ReactNode;
}

export default function MobileGameInterface({
  gameTitle,
  currentScore,
  currentLevel,
  timeRemaining,
  lives,
  streak,
  onPause,
  onResume,
  onRestart,
  onExit,
  onToggleSound,
  isPaused,
  isGameOver,
  soundEnabled,
  showTimer = false,
  showLives = false,
  showStreak = false,
  customActions = [],
  children
}: MobileGameInterfaceProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);

  // Detect orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // Prevent zoom on double tap
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    let lastTouchEnd = 0;
    const preventZoom = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchend', preventZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('touchend', preventZoom);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      onResume();
    } else {
      onPause();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col relative overflow-hidden">
      {/* Mobile Game Header */}
      <div className="bg-white/10 backdrop-blur-sm text-white p-3 flex items-center justify-between relative z-20">
        {/* Left Side - Back Button */}
        <button
          onClick={onExit}
          className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Center - Game Title & Score */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold truncate">{gameTitle}</h1>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-300" />
              <span>{currentScore.toLocaleString()}</span>
            </div>
            {currentLevel && (
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-orange-300" />
                <span>L{currentLevel}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Game Controls */}
        <div className="flex items-center space-x-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          {/* Pause/Resume */}
          <button
            onClick={handlePauseToggle}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            {isPaused ? (
              <Play className="w-5 h-5" />
            ) : (
              <Pause className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Game Stats Bar */}
      <div className="bg-white/5 backdrop-blur-sm text-white px-3 py-2 flex items-center justify-between text-sm relative z-20">
        {/* Timer */}
        {showTimer && timeRemaining !== undefined && (
          <div className="flex items-center space-x-1">
            <Timer className="w-4 h-4" />
            <span className={timeRemaining <= 10 ? 'text-red-300 font-bold' : ''}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}

        {/* Lives */}
        {showLives && lives !== undefined && (
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-red-300" />
            <span>{lives}</span>
          </div>
        )}

        {/* Streak */}
        {showStreak && streak !== undefined && streak > 0 && (
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-yellow-300" />
            <span>{streak}</span>
          </div>
        )}

        {/* Custom Actions */}
        {customActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`flex items-center space-x-1 px-2 py-1 rounded ${action.color || 'text-white/80'}`}
          >
            {action.icon}
            <span className="text-xs">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Game Content Area */}
      <div className="flex-1 relative">
        {children}

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30"
            >
              <div className="bg-white rounded-2xl p-6 mx-4 text-center max-w-sm w-full">
                <Pause className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Game Paused</h3>
                <p className="text-gray-600 mb-6">Take a break! Resume when you're ready.</p>
                
                <div className="space-y-3">
                  <button
                    onClick={onResume}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Resume Game</span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={onRestart}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restart</span>
                    </button>
                    
                    <button
                      onClick={onExit}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                    >
                      <Home className="w-4 h-4" />
                      <span>Exit</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30"
            >
              <div className="bg-white rounded-2xl p-6 mx-4 text-center max-w-sm w-full">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Game Complete!</h3>
                <p className="text-gray-600 mb-2">Final Score</p>
                <p className="text-3xl font-bold text-blue-600 mb-6">{currentScore.toLocaleString()}</p>
                
                <div className="space-y-3">
                  <button
                    onClick={onRestart}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Play Again</span>
                  </button>
                  
                  <button
                    onClick={onExit}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                  >
                    <Home className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .game-content {
            touch-action: manipulation;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            user-select: none;
          }
        }
      `}</style>
    </div>
  );
}

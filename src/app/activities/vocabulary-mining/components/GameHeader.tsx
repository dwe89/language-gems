'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Volume2, VolumeX } from 'lucide-react';

type GemType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface GameHeaderProps {
  onExit: () => void;
  assignmentTitle?: string;
  isAssignmentMode?: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentLevel: number;
  totalXP: number;
  xpToNextLevel: number;
  sessionXP: number;
  gemsCollected: number;
  currentGemType: GemType;
  progress: number;
  totalWords: number;
  streak: number;
  maxStreak: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  onExit,
  assignmentTitle,
  isAssignmentMode,
  soundEnabled,
  onToggleSound,
  currentLevel,
  totalXP,
  xpToNextLevel,
  sessionXP,
  gemsCollected,
  currentGemType,
  progress,
  totalWords,
  streak,
  maxStreak
}) => {
  // Calculate XP bar width
  const xpForCurrentLevel = Math.floor(100 * Math.pow(1.5, currentLevel - 1));
  const xpProgress = Math.max(5, Math.min(95, ((xpForCurrentLevel - xpToNextLevel) / xpForCurrentLevel) * 100));

  return (
    <div className="flex items-center justify-between py-2 px-4 bg-black/20 backdrop-blur-sm border-b border-white/10 text-white text-sm">
      {/* Left side - Exit */}
      <button
        onClick={onExit}
        className="flex items-center space-x-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors text-xs"
      >
        <Home className="w-3 h-3" />
        <span>Exit</span>
      </button>

      {/* Center - Compact Stats */}
      <div className="flex items-center space-x-4 text-xs">
        <span>Progress: {progress}/{totalWords}</span>
        <span>Streak: {streak}</span>
        <span>Gems: {gemsCollected}</span>
        <span>Level {currentLevel} (+{sessionXP} XP)</span>
      </div>

      {/* Right side - Sound Toggle */}
      <button
        onClick={onToggleSound}
        className="p-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
        title={soundEnabled ? 'Disable Sound' : 'Enable Sound'}
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
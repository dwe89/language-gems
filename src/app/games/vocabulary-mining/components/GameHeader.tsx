'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Volume2, VolumeX, Trophy, Star } from 'lucide-react';
import GemIcon, { GemType } from '../../../../components/ui/GemIcon';

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
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      {/* Left side - Exit and Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onExit}
          className="flex items-center space-x-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-medium">Exit Mining</span>
        </button>
        
        {isAssignmentMode && assignmentTitle && (
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="font-semibold">{assignmentTitle}</span>
          </div>
        )}
      </div>

      {/* Center - Progress and Stats */}
      <div className="flex items-center space-x-6">
        {/* Progress */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Progress:</span>
          <div className="bg-white/20 rounded-full px-3 py-1">
            <span className="text-sm font-bold">{progress}/{totalWords}</span>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-300" />
          <span className="text-sm font-medium">Streak: {streak}</span>
          {maxStreak > streak && (
            <span className="text-xs text-white/70">(Best: {maxStreak})</span>
          )}
        </div>

        {/* Gems Collected */}
        <div className="flex items-center space-x-2">
          <GemIcon type={currentGemType} size="sm" />
          <span className="text-sm font-medium">Gems: {gemsCollected}</span>
        </div>
      </div>

      {/* Right side - Level, XP, and Sound */}
      <div className="flex items-center space-x-4">
        {/* Level and XP */}
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Level {currentLevel}</span>
            <div className="text-xs text-white/70">
              (+{sessionXP} XP this session)
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden mt-1">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="text-xs text-white/70 mt-1">
            {xpToNextLevel} XP to next level
          </div>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          title={soundEnabled ? 'Disable Sound' : 'Enable Sound'}
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

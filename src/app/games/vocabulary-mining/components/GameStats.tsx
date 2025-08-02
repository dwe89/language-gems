'use client';

import React from 'react';
import { Star, Zap } from 'lucide-react';
import GemIcon, { GemType } from '../../../../components/ui/GemIcon';

interface GameStatsProps {
  gameState: {
    currentWordIndex: number;
    totalWords: number;
    correctAnswers: number;
    incorrectAnswers: number;
    streak: number;
    gemsCollected: number;
    currentGemType: GemType;
  };
  gemStats: {
    common: number;
    uncommon: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  currentLevel: number;
  sessionXP: number;
  xpToNextLevel: number;
  calculateXPForLevel: (level: number) => number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  gameState,
  gemStats,
  currentLevel,
  sessionXP,
  xpToNextLevel,
  calculateXPForLevel
}) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {/* Gem Collection */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 h-32 flex flex-col">
        <div className="text-center mb-3">
          <div className="text-white text-sm font-semibold flex items-center justify-center">
            <span className="text-lg mr-2">💎</span>
            Gems Collected
          </div>
        </div>
        <div className="flex justify-center space-x-2 flex-1 items-center">
          {[
            { type: 'common', name: 'Common', color: 'bg-blue-500', count: gemStats.common },
            { type: 'uncommon', name: 'Uncommon', color: 'bg-green-500', count: gemStats.uncommon },
            { type: 'rare', name: 'Rare', color: 'bg-purple-500', count: gemStats.rare },
            { type: 'epic', name: 'Epic', color: 'bg-pink-500', count: gemStats.epic },
            { type: 'legendary', name: 'Legendary', color: 'bg-yellow-500', count: gemStats.legendary }
          ].map((gem) => (
            <div key={gem.type} className="text-center">
              <div className={`w-6 h-6 ${gem.color} rounded-full flex items-center justify-center text-white font-bold text-xs mb-1`}>
                {gem.count}
              </div>
              <div className="text-white text-xs">{gem.name.charAt(0)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 h-32 flex flex-col">
        <div className="text-center mb-3">
          <div className="text-white text-sm font-semibold">Session Stats</div>
        </div>
        <div className="space-y-1 text-xs flex-1 flex flex-col justify-center">
          <div className="flex justify-between text-white">
            <span>Correct:</span>
            <span className="font-bold">{gameState.correctAnswers}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Streak:</span>
            <span className="font-bold">{gameState.streak}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Accuracy:</span>
            <span className="font-bold">
              {gameState.correctAnswers + gameState.incorrectAnswers > 0
                ? Math.round((gameState.correctAnswers / (gameState.correctAnswers + gameState.incorrectAnswers)) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* XP Progress Chart */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 h-32 flex flex-col">
        <div className="text-center mb-3">
          <div className="text-white text-sm font-semibold">XP Progress</div>
        </div>
        <div className="text-center flex-1 flex flex-col justify-center">
          <div className="text-lg font-bold text-white mb-2">Level {currentLevel}</div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(5, Math.min(95,
                  ((calculateXPForLevel(currentLevel + 1) - xpToNextLevel) / calculateXPForLevel(currentLevel + 1)) * 100
                ))}%`
              }}
            />
          </div>
          <div className="text-xs text-yellow-200">+{sessionXP} XP this session</div>
          <div className="text-xs text-blue-200 mt-1 truncate">{xpToNextLevel} XP to Level {currentLevel + 1}</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 h-32 flex flex-col">
        <div className="text-center mb-3">
          <div className="text-white text-sm font-semibold">Mining Progress</div>
        </div>
        <div className="text-center flex-1 flex flex-col justify-center">
          <div className="text-lg font-bold text-white mb-2">{gameState.currentWordIndex + 1} / {gameState.totalWords}</div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((gameState.currentWordIndex + 1) / gameState.totalWords) * 100}%` }}
            />
          </div>
          <div className="text-xs text-emerald-200">{Math.round(((gameState.currentWordIndex + 1) / gameState.totalWords) * 100)}% Complete</div>
        </div>
      </div>
    </div>
  );
};

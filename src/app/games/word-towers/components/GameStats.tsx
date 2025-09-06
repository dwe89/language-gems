'use client';

import React from 'react';
import { GameStats as GameStatsType } from '../types';
import { Trophy, ArrowUp, ArrowDown, Target, BarChart3 } from 'lucide-react';

interface GameStatsProps {
  stats: GameStatsType;
}

export const GameStats: React.FC<GameStatsProps> = ({ stats }) => {
  const {
    score,
    blocksPlaced,
    blocksFallen,
    currentHeight,
    maxHeight,
    currentLevel,
    accuracy
  } = stats;

  return (
    <div className="tower-info">
      <div className="tower-stat">
        <div className="tower-stat-label">Score</div>
        <div className="tower-stat-value flex items-center">
          <Trophy className="w-4 h-4 text-yellow-400 mr-1" />
          {score}
        </div>
      </div>
      
      <div className="tower-stat">
        <div className="tower-stat-label">Level</div>
        <div className="tower-stat-value">{currentLevel}</div>
      </div>
      
      <div className="tower-stat">
        <div className="tower-stat-label">Current Height</div>
        <div className="tower-stat-value flex items-center">
          <ArrowUp className="w-4 h-4 text-blue-400 mr-1" />
          {currentHeight}
        </div>
      </div>
      
      <div className="tower-stat">
        <div className="tower-stat-label">Max Height</div>
        <div className="tower-stat-value flex items-center">
          <ArrowUp className="w-4 h-4 text-green-400 mr-1" />
          {maxHeight}
        </div>
      </div>
      
      <div className="tower-stat">
        <div className="tower-stat-label">Blocks Placed</div>
        <div className="tower-stat-value">{blocksPlaced}</div>
      </div>
      
      <div className="tower-stat">
        <div className="tower-stat-label">Blocks Fallen</div>
        <div className="tower-stat-value flex items-center">
          <ArrowDown className="w-4 h-4 text-red-400 mr-1" />
          {blocksFallen}
        </div>
      </div>
      
      <div className="tower-stat">
        <div className="tower-stat-label">Accuracy</div>
        <div className="tower-stat-value flex items-center">
          <Target className="w-4 h-4 text-indigo-400 mr-1" />
          {Math.round(accuracy * 100)}%
        </div>
      </div>
    </div>
  );
}; 
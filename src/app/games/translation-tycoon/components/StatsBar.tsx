'use client';

import React from 'react';
import { Clock, CheckCircle, BarChart2, Zap, Award } from 'lucide-react';
import { GameStats } from '../types';

interface StatsBarProps {
  stats: GameStats;
  className?: string;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats, className }) => {
  // Format accuracy as percentage
  const formatAccuracy = (accuracy: number): string => {
    return `${Math.round(accuracy * 100)}%`;
  };
  
  // Format time in minutes and seconds
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Combine base class with optional className
  const combinedClassName = `stats-bar ${className || ''}`.trim();

  return (
    <div className={combinedClassName}>
      <div className="stat-item">
        <CheckCircle size={16} className="text-emerald-600" />
        <div className="flex flex-col items-center md:flex-row md:gap-1">
          <span className="stat-value">{stats.translationsCompleted}</span>
          <span className="stat-label md:hidden">Completed</span>
        </div>
      </div>
      
      <div className="stat-item">
        <BarChart2 size={16} className="text-blue-600" />
        <div className="flex flex-col items-center md:flex-row md:gap-1">
          <span className="stat-value">{formatAccuracy(stats.accuracy)}</span>
          <span className="stat-label md:hidden">Accuracy</span>
        </div>
      </div>
      
      <div className="stat-item">
        <Clock size={16} className="text-amber-600" />
        <div className="flex flex-col items-center md:flex-row md:gap-1">
          <span className="stat-value">{formatTime(stats.timeSpent)}</span>
          <span className="stat-label md:hidden">Time</span>
        </div>
      </div>
      
      <div className="stat-item">
        <Zap size={16} className="text-purple-600" />
        <div className="flex flex-col items-center md:flex-row md:gap-1">
          <span className="stat-value">{stats.streak}</span>
          <span className="stat-label md:hidden">Streak</span>
        </div>
      </div>
      
      <div className="stat-item">
        <Award size={16} className="text-rose-600" />
        <div className="flex flex-col items-center md:flex-row md:gap-1">
          <span className="stat-value">{stats.challengeWordsCompleted}</span>
          <span className="stat-label md:hidden">Challenges</span>
        </div>
      </div>
    </div>
  );
};

export default StatsBar; 
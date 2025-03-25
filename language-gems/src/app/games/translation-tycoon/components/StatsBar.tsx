'use client';

import React from 'react';
import { Clock, CheckCircle, BarChart2, Zap, Award } from 'lucide-react';
import { GameStats } from '../types';

interface StatsBarProps {
  stats: GameStats;
}

const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
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
  
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <CheckCircle size={16} className="text-emerald-600" />
        <span className="stat-value">{stats.translationsCompleted}</span>
        <span className="stat-label">Completed</span>
      </div>
      
      <div className="stat-item">
        <BarChart2 size={16} className="text-blue-600" />
        <span className="stat-value">{formatAccuracy(stats.accuracy)}</span>
        <span className="stat-label">Accuracy</span>
      </div>
      
      <div className="stat-item">
        <Clock size={16} className="text-amber-600" />
        <span className="stat-value">{formatTime(stats.timeSpent)}</span>
        <span className="stat-label">Time</span>
      </div>
      
      <div className="stat-item">
        <Zap size={16} className="text-purple-600" />
        <span className="stat-value">{stats.streak}</span>
        <span className="stat-label">Streak</span>
      </div>
      
      <div className="stat-item">
        <Award size={16} className="text-rose-600" />
        <span className="stat-value">{stats.challengeWordsCompleted}</span>
        <span className="stat-label">Challenges</span>
      </div>
    </div>
  );
};

export default StatsBar; 
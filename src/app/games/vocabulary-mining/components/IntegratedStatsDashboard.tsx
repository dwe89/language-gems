'use client';

import React from 'react';
import { GemType } from '../../../../components/ui/GemIcon';

interface IntegratedStatsDashboardProps {
  userStats: {
    wordsLearned: number;
    totalWords: number;
    currentStreak: number;
    weeklyGoal: number;
    weeklyProgress: number;
  };
  gemStats: {
    common: number;
    uncommon: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  dailyGoals: {
    targetWords: number;
    wordsPracticed: number;
    targetMinutes: number;
    minutesPracticed: number;
    targetAccuracy: number;
    currentAccuracy: number;
  };
  gameState: any; // You might want to define this interface more strictly
}

export const IntegratedStatsDashboard: React.FC<IntegratedStatsDashboardProps> = ({
  userStats,
  gemStats,
  dailyGoals,
  gameState
}) => {
  return (
    <div className="bg-black/10 backdrop-blur-sm border-b border-white/5 p-3">
      <div className="max-w-4xl mx-auto">
        {/* Compact Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{userStats.wordsLearned}</div>
            <div className="text-xs text-blue-200">Words Learned</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{userStats.currentStreak}</div>
            <div className="text-xs text-blue-200">Day Streak</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{Math.round((userStats.weeklyProgress / userStats.weeklyGoal) * 100)}%</div>
            <div className="text-xs text-blue-200">Weekly Goal</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{dailyGoals.wordsPracticed}/{dailyGoals.targetWords}</div>
            <div className="text-xs text-blue-200">Daily Words</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{dailyGoals.minutesPracticed}/{dailyGoals.targetMinutes}</div>
            <div className="text-xs text-blue-200">Daily Minutes</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center border border-white/10">
            <div className="text-lg font-bold text-white">{dailyGoals.currentAccuracy}%</div>
            <div className="text-xs text-blue-200">Accuracy</div>
          </div>
        </div>

        {/* Compact Gem Collection */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm font-semibold flex items-center">
              <span className="text-lg mr-2">💎</span>
              Gem Collection
            </div>
            <div className="flex items-center space-x-2">
              {[
                { type: 'common', name: 'Common', color: 'bg-blue-500', count: gemStats.common },
                { type: 'uncommon', name: 'Uncommon', color: 'bg-green-500', count: gemStats.uncommon },
                { type: 'rare', name: 'Rare', color: 'bg-purple-500', count: gemStats.rare },
                { type: 'epic', name: 'Epic', color: 'bg-pink-500', count: gemStats.epic },
                { type: 'legendary', name: 'Legendary', color: 'bg-yellow-500', count: gemStats.legendary }
              ].map((gem) => (
                <div key={gem.type} className="flex items-center">
                  <div className={`w-4 h-4 ${gem.color} rounded-full flex items-center justify-center text-white font-bold text-xs mr-1`}>
                    {gem.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

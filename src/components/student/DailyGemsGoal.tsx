/**
 * Daily Gems Goal Component
 * Shows student's daily gem collection progress with motivational elements
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Gem, Star, Crown, Flame, Sparkles, CheckCircle, Lightbulb } from 'lucide-react';

interface DailyGemsGoalProps {
  dailyGoal: number;
  gemsEarnedToday: number;
  gemsByRarityToday: Record<string, number>;
  className?: string;
}

const GEM_ICONS = {
  new_discovery: Lightbulb,
  common: Gem,
  uncommon: Sparkles,
  rare: Flame,
  epic: Star,
  legendary: Crown
};

const GEM_COLORS = {
  new_discovery: 'text-yellow-600',
  common: 'text-gray-500',
  uncommon: 'text-green-500',
  rare: 'text-orange-500',
  epic: 'text-purple-500',
  legendary: 'text-yellow-500'
};

export default function DailyGemsGoal({
  dailyGoal,
  gemsEarnedToday,
  gemsByRarityToday,
  className = ''
}: DailyGemsGoalProps) {
  const progress = Math.min((gemsEarnedToday / dailyGoal) * 100, 100);
  const isGoalReached = gemsEarnedToday >= dailyGoal;
  const gemsRemaining = Math.max(dailyGoal - gemsEarnedToday, 0);

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Daily Goal</h3>
            <p className="text-sm text-gray-600">Collect {dailyGoal} gems today</p>
          </div>
        </div>
        
        {isGoalReached && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Goal Reached!</span>
          </motion.div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {gemsEarnedToday} / {dailyGoal} gems
          </span>
          <span className="text-sm text-gray-500">{progress.toFixed(0)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            className={`h-4 rounded-full ${
              isGoalReached 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        {!isGoalReached && (
          <p className="text-xs text-gray-500 mt-1">
            {gemsRemaining} more gems to reach your goal
          </p>
        )}
      </div>

      {/* Today's Gem Collection */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Today's Collection</h4>
        <div className="grid grid-cols-5 gap-3">
          {Object.entries(GEM_ICONS).map(([rarity, Icon]) => {
            const count = gemsByRarityToday[rarity] || 0;
            const colorClass = GEM_COLORS[rarity as keyof typeof GEM_COLORS];
            
            return (
              <div key={rarity} className="text-center">
                <div className={`flex items-center justify-center h-10 w-10 rounded-lg bg-gray-50 mx-auto mb-1 ${
                  count > 0 ? 'ring-2 ring-offset-1 ring-blue-500' : ''
                }`}>
                  <Icon className={`h-5 w-5 ${colorClass}`} />
                </div>
                <div className="text-xs font-medium text-gray-900">{count}</div>
                <div className="text-xs text-gray-500 capitalize">{rarity}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <p className="text-sm text-center text-gray-700">
          {isGoalReached ? (
            <span className="font-medium text-green-700">
              🎉 Amazing work! You've reached your daily goal. Keep learning to earn bonus gems!
            </span>
          ) : progress >= 75 ? (
            <span className="font-medium text-blue-700">
              🔥 You're almost there! Just {gemsRemaining} more gems to go!
            </span>
          ) : progress >= 50 ? (
            <span className="font-medium text-purple-700">
              💪 Great progress! You're halfway to your goal!
            </span>
          ) : progress >= 25 ? (
            <span className="font-medium text-indigo-700">
              ⭐ Good start! Keep playing games to collect more gems!
            </span>
          ) : (
            <span className="font-medium text-gray-700">
              🚀 Ready to start collecting gems? Play any game to begin!
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

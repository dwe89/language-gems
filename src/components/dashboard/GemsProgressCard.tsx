/**
 * Gems Progress Card
 * Displays student's gem collection and rarity breakdown
 */

import React from 'react';
import { Gem, Sparkles, Crown, Flame, Star } from 'lucide-react';
import { GEM_TYPES, type GemRarity } from '../../services/rewards/RewardEngine';

interface GemsProgressCardProps {
  totalGems: number;
  gemsByRarity: Record<GemRarity, number>;
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  className?: string;
}

const GEM_ICONS: Record<GemRarity, React.ComponentType<any>> = {
  common: Gem,
  uncommon: Sparkles,
  rare: Flame,
  epic: Star,
  legendary: Crown
};

export default function GemsProgressCard({
  totalGems,
  gemsByRarity,
  totalXP,
  currentLevel,
  xpToNextLevel,
  className = ''
}: GemsProgressCardProps) {
  const xpProgress = totalXP > 0 ? ((totalXP % 1000) / 1000) * 100 : 0; // Simplified level calculation
  
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Language Gems</h3>
          <p className="text-gray-600">Your vocabulary collection</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{totalGems}</div>
          <div className="text-sm text-gray-500">Total Gems</div>
        </div>
      </div>
      
      {/* Level Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Level {currentLevel}</span>
          <span className="text-sm text-gray-500">{totalXP} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {xpToNextLevel > 0 ? `${xpToNextLevel} XP to next level` : 'Max level reached!'}
        </div>
      </div>
      
      {/* Gem Rarity Breakdown */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 mb-3">Gem Collection</h4>
        
        {Object.entries(GEM_TYPES).map(([rarity, info]) => {
          const count = gemsByRarity[rarity as GemRarity] || 0;
          const IconComponent = GEM_ICONS[rarity as GemRarity];
          const percentage = totalGems > 0 ? (count / totalGems) * 100 : 0;
          
          return (
            <div key={rarity} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${info.color}`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 capitalize">{rarity}</div>
                  <div className="text-xs text-gray-500">{info.points} XP each</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* XP Breakdown */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">XP from Gems:</span>
          <span className="font-semibold text-gray-900">
            {Object.entries(gemsByRarity).reduce((total, [rarity, count]) => {
              return total + (count * GEM_TYPES[rarity as GemRarity].points);
            }, 0)} XP
          </span>
        </div>
      </div>
      
      {/* Recent Achievement Badge */}
      {totalGems > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="font-medium text-yellow-800">Gem Collector</div>
              <div className="text-xs text-yellow-600">
                {totalGems >= 100 ? 'Master Collector' : 
                 totalGems >= 50 ? 'Dedicated Collector' : 
                 totalGems >= 10 ? 'Active Collector' : 'New Collector'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Gems Progress Card
 * Displays student's gem collection and rarity breakdown
 */

import React from 'react';
import { Gem, Sparkles, Crown, Flame, Star, Lightbulb, Zap, BookOpen, Trophy } from 'lucide-react';
import { GEM_TYPES, type GemRarity } from '../../services/rewards/RewardEngine';
import { type XPBreakdown } from '../../services/rewards/DualTrackAnalyticsService';

interface GemsProgressCardProps {
  totalGems: number;
  gemsByRarity: Record<GemRarity, number>;
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  className?: string;
  // Dual-track system props
  xpBreakdown?: XPBreakdown;
  activityGemsToday?: number;
  masteryGemsToday?: number;
}

const GEM_ICONS: Record<GemRarity, React.ComponentType<any>> = {
  new_discovery: Lightbulb,
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
  className = '',
  xpBreakdown,
  activityGemsToday = 0,
  masteryGemsToday = 0
}: GemsProgressCardProps) {
  const xpProgress = totalXP > 0 ? ((totalXP % 1000) / 1000) * 100 : 0; // Simplified level calculation

  // Calculate percentages for dual-track display
  const masteryPercentage = xpBreakdown && xpBreakdown.totalXP > 0 ? (xpBreakdown.masteryXP / xpBreakdown.totalXP) * 100 : 0;
  const activityPercentage = xpBreakdown && xpBreakdown.totalXP > 0 ? (xpBreakdown.activityXP / xpBreakdown.totalXP) * 100 : 0;

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header with Dual-Track Info */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Language Gems</h3>
          <p className="text-gray-600">
            {xpBreakdown ? 'Mastery & Activity Rewards' : 'Your vocabulary collection'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{totalGems}</div>
          <div className="text-sm text-gray-500">Total Gems</div>
          {xpBreakdown && (
            <div className="text-xs text-gray-400 mt-1">
              {xpBreakdown.totalMasteryGems} mastery + {xpBreakdown.totalActivityGems} activity
            </div>
          )}
        </div>
      </div>

      {/* Dual-Track XP Breakdown */}
      {xpBreakdown && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">XP Breakdown</h4>
            <div className="text-lg font-bold text-gray-900">
              {xpBreakdown.totalXP.toLocaleString()} XP
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-3">
            <div className="h-full flex">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-1000"
                style={{ width: `${masteryPercentage}%` }}
                title={`Mastery XP: ${xpBreakdown.masteryXP}`}
              />
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-1000"
                style={{ width: `${activityPercentage}%` }}
                title={`Activity XP: ${xpBreakdown.activityXP}`}
              />
            </div>
          </div>

          {/* XP Type Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-sm font-medium text-purple-600">
                  {xpBreakdown.masteryXP.toLocaleString()} XP
                </div>
                <div className="text-xs text-gray-500">Mastery Gems</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-500" />
              <div>
                <div className="text-sm font-medium text-green-600">
                  {xpBreakdown.activityXP.toLocaleString()} XP
                </div>
                <div className="text-xs text-gray-500">Activity Gems</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
      
      {/* Gem Collection - Show only Mastery Gems (Vocabulary Collection) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Vocabulary Collection</h4>
          <div className="text-sm text-gray-500">Mastery Gems Only</div>
        </div>

        {Object.entries(GEM_TYPES).map(([rarity, info]) => {
          const count = gemsByRarity[rarity as GemRarity] || 0;
          const IconComponent = GEM_ICONS[rarity as GemRarity];
          // Use mastery gems total for percentage calculation (not total gems)
          const masteryGemsTotal = xpBreakdown?.totalMasteryGems || totalGems;
          const percentage = masteryGemsTotal > 0 ? (count / masteryGemsTotal) * 100 : 0;

          // Only show rarities that have gems or are relevant for mastery
          if (count === 0 && !['new_discovery', 'common', 'uncommon'].includes(rarity)) {
            return null;
          }

          return (
            <div key={rarity} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${info.color}`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 capitalize">
                    {rarity === 'new_discovery' ? 'New Discovery' : rarity}
                  </div>
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

        {/* Show message if no mastery gems yet */}
        {(!xpBreakdown || xpBreakdown.totalMasteryGems === 0) && (
          <div className="text-center py-4 text-gray-500">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No vocabulary mastered yet</p>
            <p className="text-xs">Keep practicing to earn Mastery Gems!</p>
          </div>
        )}
      </div>
      
      {/* XP Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Total XP from All Gems:</span>
          <span className="font-semibold text-gray-900">
            {xpBreakdown ? xpBreakdown.totalXP.toLocaleString() : totalXP.toLocaleString()} XP
          </span>
        </div>
        {xpBreakdown && (
          <div className="mt-2 text-xs text-gray-500">
            {xpBreakdown.masteryXP.toLocaleString()} from vocabulary + {xpBreakdown.activityXP.toLocaleString()} from activities
          </div>
        )}
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

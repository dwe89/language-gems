'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, BookOpen, TrendingUp } from 'lucide-react';

interface XPBreakdown {
  totalXP: number;
  masteryXP: number;
  activityXP: number;
  totalMasteryGems: number;
  totalActivityGems: number;
  totalGems: number;
}

interface ConsolidatedXPDisplayProps {
  xpData: XPBreakdown;
  showBreakdown?: boolean;
  className?: string;
}

export default function ConsolidatedXPDisplay({
  xpData,
  showBreakdown = true,
  className = ''
}: ConsolidatedXPDisplayProps) {
  const masteryPercentage = xpData.totalXP > 0 ? (xpData.masteryXP / xpData.totalXP) * 100 : 0;
  const activityPercentage = xpData.totalXP > 0 ? (xpData.activityXP / xpData.totalXP) * 100 : 0;

  return (
    <div className={`bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 ${className}`}>
      {/* Total XP Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Total XP</h3>
            <p className="text-gray-400 text-sm">Experience Points</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-yellow-400">
            {xpData.totalXP.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">
            {xpData.totalGems} gems collected
          </div>
        </div>
      </div>

      {showBreakdown && xpData.totalXP > 0 && (
        <>
          {/* XP Breakdown Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>XP Breakdown</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div className="h-full flex">
                {/* Mastery XP */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${masteryPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full"
                />
                {/* Activity XP */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${activityPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full"
                />
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mastery XP */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300">Mastery XP</h4>
                  <p className="text-xs text-gray-400">Vocabulary Collection</p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-purple-300">
                    {xpData.masteryXP.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    {xpData.totalMasteryGems} gems
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-purple-300">
                    {masteryPercentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">of total</div>
                </div>
              </div>
            </motion.div>

            {/* Activity XP */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-300">Activity XP</h4>
                  <p className="text-xs text-gray-400">Performance Rewards</p>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold text-green-300">
                    {xpData.activityXP.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">
                    {xpData.totalActivityGems} gems
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-300">
                    {activityPercentage.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">of total</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400"
          >
            <TrendingUp className="w-4 h-4" />
            <span>
              Earning XP through both vocabulary mastery and active practice
            </span>
          </motion.div>
        </>
      )}
    </div>
  );
}

// Simplified version for in-game display
export function CompactXPDisplay({ xpData, className = '' }: ConsolidatedXPDisplayProps) {
  return (
    <div className={`bg-gray-800/80 rounded-lg px-4 py-2 border border-gray-700/50 ${className}`}>
      <div className="flex items-center gap-3">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <div className="flex items-center gap-4">
          <div>
            <span className="text-yellow-400 font-bold text-lg">
              {xpData.totalXP.toLocaleString()}
            </span>
            <span className="text-gray-400 text-sm ml-1">XP</span>
          </div>
          <div className="text-xs text-gray-400">
            <span className="text-purple-300">{xpData.masteryXP}</span> mastery + 
            <span className="text-green-300 ml-1">{xpData.activityXP}</span> activity
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PlayerStatsProps {
  stats: {
    level: number;
    experience: number;
    completedQuests: number;
    currentRegion?: string;
    unlockedRegions: string[];
    defeatedEnemies: Set<string>;
  };
}

export default function PlayerStats({ stats }: PlayerStatsProps) {
  const experienceToNextLevel = (stats.level * 100) - stats.experience;
  const experienceProgress = (stats.experience % 100) / 100 * 100;

  return (
    <div className="flex items-center gap-6 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
      {/* Level */}
      <div className="text-center">
        <div className="text-lg font-bold text-yellow-400">Lv.{stats.level}</div>
        <div className="text-xs text-gray-300">Level</div>
      </div>

      {/* Experience Bar */}
      <div className="flex flex-col items-center">
        <div className="text-sm text-blue-300 mb-1">EXP</div>
        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${experienceProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {stats.experience % 100}/100
        </div>
      </div>

      {/* Quests Completed */}
      <div className="text-center">
        <div className="text-lg font-bold text-green-400">{stats.completedQuests}</div>
        <div className="text-xs text-gray-300">Quests</div>
      </div>

      {/* Enemies Defeated */}
      <div className="text-center">
        <div className="text-lg font-bold text-red-400">{stats.defeatedEnemies.size}</div>
        <div className="text-xs text-gray-300">Defeated</div>
      </div>

      {/* Regions Unlocked */}
      <div className="text-center">
        <div className="text-lg font-bold text-purple-400">{stats.unlockedRegions.length}</div>
        <div className="text-xs text-gray-300">Regions</div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../../../store/gameStore';

interface LeagueSelectionProps {
  onLeagueSelect: (leagueId: string) => void;
}

export default function LeagueSelection({ onLeagueSelect }: LeagueSelectionProps) {
  const { leagues, playerStats } = useGameStore();

  const isLeagueUnlocked = (league: any) => {
    return playerStats.level >= league.minLevel;
  };

  const getLeagueStatusText = (league: any) => {
    if (!isLeagueUnlocked(league)) {
      return `Requires Level ${league.minLevel}`;
    }
    if (league.id === playerStats.currentLeague) {
      return 'Current League';
    }
    return 'Available';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            ⚔️ Conjugation Duel ⚔️
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Choose Your Battle Arena
          </p>
          <div className="text-lg text-gray-400">
            Level {playerStats.level} • {playerStats.totalWins} Wins • {playerStats.accuracy.toFixed(1)}% Accuracy
          </div>
        </motion.div>

        {/* Leagues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leagues.map((league: any, index: number) => {
            const unlocked = isLeagueUnlocked(league);
            const isCurrent = league.id === playerStats.currentLeague;
            
            return (
              <motion.div
                key={league.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={unlocked ? { scale: 1.05, y: -5 } : {}}
                className={`relative overflow-hidden rounded-xl ${
                  unlocked
                    ? 'cursor-pointer shadow-2xl hover:shadow-3xl'
                    : 'cursor-not-allowed opacity-60'
                }`}
                onClick={() => unlocked && onLeagueSelect(league.id)}
              >
                {/* League Card Background */}
                <div 
                  className="h-80 relative"
                  style={{
                    background: `linear-gradient(135deg, ${league.theme.gradient})`
                  }}
                >
                  {/* League Badge */}
                  <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl backdrop-blur-sm">
                    {getLeagueEmoji(league.id)}
                  </div>

                  {/* Current League Indicator */}
                  {isCurrent && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                        CURRENT
                      </div>
                    </div>
                  )}

                  {/* League Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/30 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {league.name}
                    </h3>
                    <p className="text-gray-200 text-sm mb-3 line-clamp-2">
                      {league.description}
                    </p>
                    
                    {/* League Stats */}
                    <div className="flex justify-between items-center text-xs text-gray-300">
                      <span>Level {league.minLevel}-{league.maxLevel}</span>
                      <span className={`font-medium ${
                        unlocked 
                          ? isCurrent 
                            ? 'text-yellow-400' 
                            : 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {getLeagueStatusText(league)}
                      </span>
                    </div>

                    {/* Verb Types */}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {league.verbTypes.map((type: string) => (
                        <span 
                          key={type}
                          className="px-2 py-1 bg-white/20 rounded text-xs text-white"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Lock Overlay for Locked Leagues */}
                  {!unlocked && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-2">🔒</div>
                        <div className="text-sm font-medium">
                          Reach Level {league.minLevel}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Glow Effect */}
                {unlocked && (
                  <div 
                    className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${league.theme.gradient})`,
                      filter: 'blur(8px)'
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Player Stats Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Battle Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{playerStats.totalWins}</div>
              <div className="text-sm text-gray-300">Victories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{playerStats.totalLosses}</div>
              <div className="text-sm text-gray-300">Defeats</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{playerStats.currentWinStreak}</div>
              <div className="text-sm text-gray-300">Win Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{playerStats.experience}</div>
              <div className="text-sm text-gray-300">Experience</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function getLeagueEmoji(leagueId: string): string {
  switch (leagueId) {
    case 'bronze': return '🥉';
    case 'silver': return '🥈';
    case 'gold': return '🥇';
    case 'diamond': return '💎';
    default: return '⚔️';
  }
}

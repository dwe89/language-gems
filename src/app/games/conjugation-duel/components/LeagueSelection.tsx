'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe } from 'lucide-react';
import { useGameStore } from '../../../../store/gameStore';

interface LeagueSelectionProps {
  onLeagueSelect: (leagueId: string) => void;
  onBackToLanguages?: () => void;
  selectedLanguage?: string;
}

export default function LeagueSelection({
  onLeagueSelect,
  onBackToLanguages,
  selectedLanguage = 'spanish'
}: LeagueSelectionProps) {
  const { leagues, playerStats } = useGameStore();

  const isLeagueUnlocked = (league: any) => {
    return true; // All leagues are now available
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
    <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 py-3">
        {/* Back Button */}
        {onBackToLanguages && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBackToLanguages}
            className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Language Selection
          </motion.button>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            ⚔️ Conjugation Duel ⚔️
          </h1>
          <div className="flex items-center justify-center mb-1">
            <Globe className="text-blue-400 mr-2" size={18} />
            <span className="text-lg text-blue-400 font-semibold capitalize">
              {selectedLanguage} Conjugations
            </span>
          </div>
          <p className="text-lg text-gray-300">
            Choose Your Battle Arena
          </p>
        </motion.div>

        {/* Leagues Grid */}
        <div className="flex-1 grid grid-cols-4 gap-4 min-h-0">
          {leagues.map((league: any, index: number) => {
            const unlocked = isLeagueUnlocked(league);
            const isCurrent = league.id === playerStats.currentLeague;

            return (
              <motion.div
                key={league.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={unlocked ? { scale: 1.02 } : {}}
                className={`relative overflow-hidden rounded-xl ${unlocked
                    ? 'cursor-pointer shadow-xl hover:shadow-2xl'
                    : 'cursor-not-allowed opacity-60'
                  }`}
                onClick={() => unlocked && onLeagueSelect(league.id)}
              >
                {/* League Card Background */}
                <div
                  className="h-full relative flex flex-col"
                  style={{
                    background: `linear-gradient(135deg, ${league.theme.gradient})`
                  }}
                >
                  {/* League Badge */}
                  <div className="absolute top-2 left-2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">
                    {getLeagueEmoji(league.id)}
                  </div>

                  {/* Current League Indicator */}
                  {isCurrent && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-yellow-500 text-black px-2 py-0.5 rounded-full text-[10px] font-bold">
                        CURRENT
                      </div>
                    </div>
                  )}

                  {/* League Content */}
                  <div className="mt-auto p-4 bg-black/30 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {league.name}
                    </h3>
                    <p className="text-gray-200 text-xs mb-2 line-clamp-2">
                      {league.description}
                    </p>

                    {/* Verb Types */}
                    <div className="flex flex-wrap gap-1">
                      {league.verbTypes.slice(0, 2).map((type: string) => (
                        <span
                          key={type}
                          className="px-1.5 py-0.5 bg-white/20 rounded text-[10px] text-white"
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
                        <div className="text-2xl mb-1">🔒</div>
                        <div className="text-xs font-medium">
                          Level {league.minLevel}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>


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

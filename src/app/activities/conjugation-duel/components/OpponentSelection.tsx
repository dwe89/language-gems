'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGameStore } from '../../../../store/gameStore';
import CharacterSprite from './CharacterSprite';

interface OpponentSelectionProps {
  leagueId: string;
  onOpponentSelect: (opponent: any) => void;
  onBack: () => void;
}

export default function OpponentSelection({
  leagueId,
  onOpponentSelect,
  onBack
}: OpponentSelectionProps) {
  const { leagues, playerStats } = useGameStore();

  const currentLeague = leagues.find((l: any) => l.id === leagueId);

  if (!currentLeague) {
    return null;
  }

  return (
    <div
      className="h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: currentLeague?.background
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(/images/battle/${currentLeague.background})`
          : `linear-gradient(135deg, ${currentLeague.theme.gradient})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="flex-1 flex flex-col max-w-6xl mx-auto relative z-10 px-4 py-3 overflow-hidden">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-3"
        >
          <button
            onClick={onBack}
            className="mr-4 p-2 bg-black/20 hover:bg-black/30 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {currentLeague.name}
            </h1>
            <p className="text-sm text-gray-200">
              {currentLeague.description}
            </p>
          </div>
        </motion.div>

        {/* League Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/20 backdrop-blur-sm rounded-xl p-3 mb-3"
        >
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <h3 className="font-semibold text-white mb-1">Verb Types</h3>
              <div className="flex flex-wrap gap-1 justify-center">
                {currentLeague.verbTypes.map((type: string) => (
                  <span
                    key={type}
                    className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Tenses</h3>
              <div className="flex flex-wrap gap-1 justify-center">
                {currentLeague.tenses.map((tense: string) => (
                  <span
                    key={tense}
                    className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white"
                  >
                    {tense}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Your Progress</h3>
              <div className="text-white">
                <div className="text-lg font-bold">Level {playerStats.level}</div>
                <div className="text-xs opacity-80">{playerStats.experience} XP</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Opponents Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-hidden"
        >
          <h2 className="text-lg font-bold text-white mb-3 text-center">
            Choose Your Opponent
          </h2>

          <div className="grid grid-cols-2 gap-4 h-[calc(100%-2rem)]">
            {currentLeague.opponents.map((opponent: any, index: number) => (
              <motion.div
                key={opponent.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onOpponentSelect(opponent)}
                className="bg-gradient-to-br from-orange-600/80 to-orange-800/80 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:from-orange-500/80 hover:to-orange-700/80 transition-colors border border-white/20 flex flex-col"
              >
                <div className="flex items-start space-x-4">
                  {/* Opponent Sprite */}
                  <div className="flex-shrink-0 w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">🗡️</span>
                  </div>

                  {/* Opponent Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏅</span>
                      <h3 className="text-lg font-bold text-white">
                        {opponent.name}
                      </h3>
                    </div>
                    <p className="text-gray-200 text-xs mb-2 line-clamp-2">
                      {opponent.description}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-4 text-xs">
                      <div>
                        <span className="text-gray-300">Health:</span>
                        <span className="text-white font-medium ml-1">{opponent.health}</span>
                      </div>
                      <div>
                        <span className="text-gray-300">Difficulty:</span>
                        <span className="text-white font-medium ml-1">{getDifficultyText(opponent.difficulty)}</span>
                      </div>
                    </div>

                    {/* Weapons */}
                    <div className="mt-2">
                      <span className="text-gray-300 text-xs">Weapons:</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {opponent.weapons.slice(0, 2).map((weapon: string) => (
                          <span
                            key={weapon}
                            className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-white"
                          >
                            {getWeaponEmoji(weapon)} {weapon.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Battle Button */}
                <div className="mt-auto pt-3">
                  <div className="text-center">
                    <span className="inline-block px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm">
                      ⚔️ Challenge to Battle
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

function getDifficultyText(difficulty: number): string {
  switch (difficulty) {
    case 1: return 'Novice';
    case 2: return 'Skilled';
    case 3: return 'Expert';
    case 4: return 'Master';
    case 5: return 'Legendary';
    default: return 'Unknown';
  }
}

function getWeaponEmoji(weapon: string): string {
  switch (weapon) {
    case 'sword': return '⚔️';
    case 'shield': return '🛡️';
    case 'magic_staff': return '🔮';
    case 'spell_book': return '📖';
    case 'bow': return '🏹';
    case 'spear': return '🗿';
    case 'energy_blade': return '⚡';
    case 'force_shield': return '🌟';
    case 'cosmic_staff': return '🌌';
    case 'reality_gem': return '💎';
    default: return '⚔️';
  }
}

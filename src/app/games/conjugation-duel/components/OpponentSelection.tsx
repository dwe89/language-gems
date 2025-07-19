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
      className="min-h-screen p-8 relative overflow-hidden"
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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-8"
        >
          <button
            onClick={onBack}
            className="mr-6 p-2 bg-black/20 hover:bg-black/30 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {currentLeague.name}
            </h1>
            <p className="text-lg text-gray-200">
              {currentLeague.description}
            </p>
          </div>
        </motion.div>

        {/* League Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black/20 backdrop-blur-sm rounded-xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Verb Types</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {currentLeague.verbTypes.map((type: string) => (
                  <span 
                    key={type}
                    className="px-3 py-1 bg-white/20 rounded-full text-sm text-white"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Tenses</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {currentLeague.tenses.map((tense: string) => (
                  <span 
                    key={tense}
                    className="px-3 py-1 bg-white/20 rounded-full text-sm text-white"
                  >
                    {tense}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Your Progress</h3>
              <div className="text-white">
                <div className="text-2xl font-bold">Level {playerStats.level}</div>
                <div className="text-sm opacity-80">{playerStats.experience} XP</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Opponents Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Choose Your Opponent
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentLeague.opponents.map((opponent: any, index: number) => (
              <motion.div
                key={opponent.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpponentSelect(opponent)}
                className="bg-black/30 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-black/40 transition-colors border border-white/20"
              >
                <div className="flex items-center space-x-6">
                  {/* Opponent Sprite */}
                  <div className="flex-shrink-0">
                    <CharacterSprite
                      type="opponent"
                      opponent={opponent}
                      health={opponent.health}
                      maxHealth={opponent.health}
                      isAttacking={false}
                    />
                  </div>

                  {/* Opponent Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {opponent.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {opponent.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Health:</span>
                        <span className="text-white font-medium ml-2">
                          {opponent.health}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Difficulty:</span>
                        <span className="text-white font-medium ml-2">
                          {getDifficultyText(opponent.difficulty)}
                        </span>
                      </div>
                    </div>

                    {/* Weapons */}
                    <div className="mt-3">
                      <span className="text-gray-400 text-sm">Weapons:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {opponent.weapons.map((weapon: string) => (
                          <span 
                            key={weapon}
                            className="px-2 py-1 bg-white/10 rounded text-xs text-white"
                          >
                            {getWeaponEmoji(weapon)} {weapon.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Battle Button */}
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="text-center">
                    <span className="inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
                      🗡️ Challenge to Battle
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Battle Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/20 backdrop-blur-sm rounded-xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-3">💡 Battle Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div>
              <span className="text-yellow-400">⚡ Speed:</span> Answer quickly to deal more damage
            </div>
            <div>
              <span className="text-green-400">🎯 Accuracy:</span> Correct answers heal you and hurt enemies
            </div>
            <div>
              <span className="text-blue-400">🧠 Strategy:</span> Higher difficulty opponents give more XP
            </div>
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

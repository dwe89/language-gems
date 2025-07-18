'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { regions, isRegionUnlocked } from './VerbData';

interface WorldMapProps {
  stats: {
    level: number;
    experience: number;
    completedQuests: number;
    currentRegion?: string;
    unlockedRegions: string[];
    defeatedEnemies: Set<string>;
    masteredTenses?: Set<string>;
  };
  onStartBattle: (enemy: any, region: string) => void;
  onUpdateStats: (stats: any) => void;
  soundEnabled?: boolean;
}

export default function WorldMap({ stats, onStartBattle, onUpdateStats, soundEnabled = true }: WorldMapProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const playSound = (soundName: string) => {
    if (soundEnabled) {
      const audio = new Audio(`/games/verb-quest/sounds/${soundName}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(e => console.error(`Error playing ${soundName}:`, e));
    }
  };

  const getRegionBackgroundImage = (regionId: string): string => {
    const backgroundMap: Record<string, string> = {
      'forest_of_beginnings': 'forest_of_beginnings.jpg',
      'temple_of_chaos': 'temple_of_chaos.jpg',
      'cave_of_memories': 'cave_of_memories.jpg',
      'lair_of_legends': 'temple_of_chaos.jpg', // Reuse temple for now
      'swamp_of_habits': 'forest.jpg', // Fallback to forest
      'skyward_spire': 'palace_of_possibilities.png',
      'palace_of_possibilities': 'palace_of_possibilities.png',
      'dungeon_of_commands': 'dungeon_of_commands.png',
      'shrine_of_perfection': 'palace_of_possibilities.png', // Reuse palace
      'castle_of_conjugations': 'dungeon_of_commands.png' // Reuse dungeon
    };
    return backgroundMap[regionId] || 'forest.jpg';
  };

  const handleRegionClick = (regionId: string) => {
    if (isRegionUnlocked(regionId, stats)) {
      playSound('click');
      setSelectedRegion(regionId);
    }
  };

  const handleStartBattle = (enemy: any) => {
    if (selectedRegion) {
      playSound('click');
      onStartBattle(enemy, selectedRegion);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* World Map Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/games/verb-quest/backgrounds/World_map.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Additional atmospheric effects */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-pulse opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">World Map</h1>
          <p className="text-purple-200">Choose your destination, brave adventurer!</p>
        </div>

        {/* Regions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.values(regions).map((region, index) => {
            const unlocked = isRegionUnlocked(region.id, stats);
            const isCurrent = stats.currentRegion === region.id || 
                             (!stats.currentRegion && region.id === 'forest_of_beginnings');
            
            // Debug logging
            if (region.id === 'temple_of_chaos' || region.id === 'cave_of_memories') {
              console.log(`Region ${region.id}:`, {
                unlocked,
                isCurrent,
                currentRegion: stats.currentRegion,
                level: stats.level,
                defeatedEnemies: Array.from(stats.defeatedEnemies)
              });
            }
            
            return (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`relative cursor-pointer ${unlocked ? 'hover:scale-105' : 'cursor-not-allowed'}`}
                onClick={() => handleRegionClick(region.id)}
              >
                <div className={`
                  relative overflow-hidden rounded-xl border-2 transition-all duration-300 h-72
                  ${unlocked 
                    ? 'border-yellow-500 shadow-lg shadow-yellow-500/20' 
                    : 'border-gray-600 opacity-50'
                  }
                  ${isCurrent ? 'ring-4 ring-blue-400' : ''}
                  ${selectedRegion === region.id ? 'ring-4 ring-green-400' : ''}
                `}>
                  {/* Region Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url('/games/verb-quest/backgrounds/${getRegionBackgroundImage(region.id)}')`,
                      filter: unlocked ? 'none' : 'grayscale(100%) brightness(0.3)'
                    }}
                  />
                  
                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Region Header */}
                  <div className="relative z-10 p-6 text-center h-full flex flex-col justify-end">
                    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{region.name}</h3>
                    <p className="text-sm text-gray-200 leading-relaxed drop-shadow line-clamp-3">{region.description}</p>
                  </div>

                  {/* Lock Overlay */}
                  {!unlocked && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-4xl mb-2">🔒</div>
                        <div className="text-sm">
                          {region.unlockRequirement && (
                            <div>Level {region.unlockRequirement.level} required</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Current Region Indicator */}
                  {isCurrent && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                      CURRENT
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enemy Selection Modal */}
        <AnimatePresence>
          {selectedRegion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedRegion(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {regions[selectedRegion as keyof typeof regions].name}
                  </h2>
                  <p className="text-gray-300">Choose your opponent:</p>
                </div>

                <div className="grid gap-4">
                  {regions[selectedRegion as keyof typeof regions].enemies.map((enemy) => {
                    const isDefeated = stats.defeatedEnemies.has(enemy.id);
                    
                    return (
                      <motion.div
                        key={enemy.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${isDefeated 
                            ? 'bg-green-900/30 border-green-500 opacity-75' 
                            : 'bg-red-900/30 border-red-500 hover:bg-red-900/50'
                          }
                        `}
                        onClick={() => handleStartBattle(enemy)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 flex items-center justify-center">
                              <img 
                                src={`/games/verb-quest/enemies/${enemy.id}.png`}
                                alt={enemy.name}
                                className="w-12 h-12 object-contain"
                                onError={(e) => {
                                  // Fallback to emoji if image fails to load
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const fallback = document.createElement('div');
                                  fallback.className = 'text-3xl';
                                  fallback.textContent = enemy.emoji;
                                  (e.target as HTMLImageElement).parentNode?.appendChild(fallback);
                                }}
                              />
                            </div>
                            <div>
                              <h3 className="font-bold text-white">{enemy.name}</h3>
                              <p className="text-sm text-gray-300">{enemy.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs">
                                <span className="text-red-400">❤️ {enemy.health}</span>
                                <span className="text-blue-400">⭐ {enemy.experience} EXP</span>
                                <span className="text-yellow-400">📊 {enemy.difficulty}</span>
                              </div>
                            </div>
                          </div>
                          {isDefeated && (
                            <div className="text-green-400 font-bold">
                              ✓ DEFEATED
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setSelectedRegion(null)}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

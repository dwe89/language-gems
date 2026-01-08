'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { characterClasses, CharacterClass } from './Character';

interface CharacterCreationProps {
  onCharacterCreated: (name: string, characterClass: string) => void;
  onBack?: () => void;
  soundEnabled?: boolean;
}

export default function CharacterCreation({ onCharacterCreated, onBack, soundEnabled }: CharacterCreationProps) {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showClassDetails, setShowClassDetails] = useState<string | null>(null);

  const handleCreateCharacter = () => {
    if (name.trim() && selectedClass) {
      onCharacterCreated(name.trim(), selectedClass);
    }
  };

  const classCards = Object.values(characterClasses);

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/games/verb-quest/backgrounds/hero_rise.jpg')`
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Atmospheric effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-full flex flex-col p-4">
        {/* Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">
            Create Your Hero
          </h1>
          <p className="text-sm text-gray-200 drop-shadow">
            Choose your class and begin your journey to master verbs!
          </p>
        </motion.div>

        {/* Character Name Input - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 max-w-sm mx-auto">
            <label className="block text-white text-sm font-semibold mb-2">
              Hero Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your hero's name..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
              maxLength={20}
            />
          </div>
        </motion.div>

        {/* Character Classes - Compact Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 flex flex-col min-h-0"
        >
          <h2 className="text-xl font-bold text-white text-center mb-3">
            Choose Your Class
          </h2>

          <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto w-full flex-1">
            {classCards.map((characterClass, index) => (
              <motion.div
                key={characterClass.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`
                  relative cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                  ${selectedClass === characterClass.id
                    ? 'ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/30'
                    : 'hover:ring-1 hover:ring-white/50'
                  }
                `}
                onClick={() => setSelectedClass(characterClass.id)}
                onMouseEnter={() => setShowClassDetails(characterClass.id)}
                onMouseLeave={() => setShowClassDetails(null)}
              >
                <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-white/10 h-full flex flex-col">
                  {/* Class Icon */}
                  <div className="text-center mb-2">
                    <div className="text-4xl mb-1">{characterClass.emoji}</div>
                    <h3 className="text-lg font-bold text-white">{characterClass.name}</h3>
                  </div>

                  {/* Base Stats - Horizontal */}
                  <div className="flex justify-center gap-4 mb-2 text-xs">
                    <div className="text-center">
                      <div className="text-gray-400">HP</div>
                      <div className="text-white font-bold">{characterClass.baseHealth}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">+HP/Lv</div>
                      <div className="text-white font-bold">{characterClass.healthPerLevel}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400">DMG</div>
                      <div className="text-white font-bold">{Math.round(characterClass.damageMultiplier * 100)}%</div>
                    </div>
                  </div>

                  {/* Class Description */}
                  <p className="text-gray-300 text-xs leading-snug mb-2 flex-1 line-clamp-2">
                    {characterClass.description}
                  </p>

                  {/* Special Ability */}
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                    <div className="text-yellow-400 font-semibold text-xs mb-0.5">
                      Special Ability
                    </div>
                    <div className="text-yellow-200 text-[10px] line-clamp-2">
                      {characterClass.specialAbility}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedClass === characterClass.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-sm">✓</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-4"
        >
          <button
            onClick={handleCreateCharacter}
            disabled={!name.trim() || !selectedClass}
            className={`
              px-6 py-3 rounded-lg font-bold text-base transition-all duration-300 transform
              ${name.trim() && selectedClass
                ? 'bg-yellow-500 hover:bg-yellow-400 text-black hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            Begin Your Quest
          </button>
        </motion.div>

        {/* Class Details Tooltip */}
        {showClassDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-4 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-3 max-w-xs border border-white/20 z-50"
          >
            {(() => {
              const classData = characterClasses[showClassDetails];
              return (
                <>
                  <h4 className="text-white font-bold mb-1 text-sm">{classData.name}</h4>
                  <p className="text-gray-300 text-xs mb-2">{classData.description}</p>
                  <div className="text-yellow-400 text-xs font-semibold mb-0.5">
                    Special Ability:
                  </div>
                  <p className="text-yellow-200 text-xs">
                    {classData.specialAbility}
                  </p>
                </>
              );
            })()}
          </motion.div>
        )}
      </div>
    </div>
  );
}

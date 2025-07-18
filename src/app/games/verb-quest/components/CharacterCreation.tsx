'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { characterClasses, CharacterClass } from './Character';

interface CharacterCreationProps {
  onCharacterCreated: (name: string, characterClass: string) => void;
}

export default function CharacterCreation({ onCharacterCreated }: CharacterCreationProps) {
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/games/verb-quest/backgrounds/hero_rise.jpg')`
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Atmospheric effects */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Create Your Hero
            </h1>
            <p className="text-xl text-gray-200 drop-shadow">
              Choose your class and begin your journey through the Spanish language realms
            </p>
          </motion.div>

          {/* Character Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <label className="block text-white text-lg font-semibold mb-3">
                Hero Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your hero's name..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                maxLength={20}
              />
            </div>
          </motion.div>

          {/* Character Classes */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              Choose Your Class
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classCards.map((characterClass, index) => (
                <motion.div
                  key={characterClass.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.2 }}
                  className={`
                    relative cursor-pointer transition-all duration-300 transform hover:scale-105
                    ${selectedClass === characterClass.id 
                      ? 'ring-4 ring-yellow-500 shadow-lg shadow-yellow-500/30' 
                      : 'hover:ring-2 hover:ring-white/50'
                    }
                  `}
                  onClick={() => setSelectedClass(characterClass.id)}
                  onMouseEnter={() => setShowClassDetails(characterClass.id)}
                  onMouseLeave={() => setShowClassDetails(null)}
                >
                  <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    {/* Class Icon */}
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2">{characterClass.emoji}</div>
                      <h3 className="text-xl font-bold text-white">{characterClass.name}</h3>
                    </div>

                    {/* Base Stats */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Base Health:</span>
                        <span className="text-white font-semibold">{characterClass.baseHealth}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">HP per Level:</span>
                        <span className="text-white font-semibold">+{characterClass.healthPerLevel}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Damage:</span>
                        <span className="text-white font-semibold">{Math.round(characterClass.damageMultiplier * 100)}%</span>
                      </div>
                    </div>

                    {/* Class Description */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {characterClass.description}
                    </p>

                    {/* Special Ability */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                      <div className="text-yellow-400 font-semibold text-sm mb-1">
                        Special Ability
                      </div>
                      <div className="text-yellow-200 text-xs">
                        {characterClass.specialAbility}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {selectedClass === characterClass.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 right-3 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-lg">✓</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Create Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-center"
          >
            <button
              onClick={handleCreateCharacter}
              disabled={!name.trim() || !selectedClass}
              className={`
                px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform
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
              className="fixed top-4 right-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 max-w-sm border border-white/20 z-50"
            >
              {(() => {
                const classData = characterClasses[showClassDetails];
                return (
                  <>
                    <h4 className="text-white font-bold mb-2">{classData.name}</h4>
                    <p className="text-gray-300 text-sm mb-3">{classData.description}</p>
                    <div className="text-yellow-400 text-sm font-semibold mb-1">
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
    </div>
  );
}

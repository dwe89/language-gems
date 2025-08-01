'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameConfig } from './LavaTempleWordRestoreGame';

interface LanguageSelectionProps {
  gameConfig: GameConfig;
  onLanguageSelected: (config: GameConfig) => void;
  onBackToMenu: () => void;
}

const LANGUAGES = [
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸', color: 'from-red-600 to-yellow-600' },
  { code: 'french', name: 'French', flag: '🇫🇷', color: 'from-blue-600 to-red-600' },
  { code: 'german', name: 'German', flag: '🇩🇪', color: 'from-black to-red-600' }
];

const DIFFICULTIES = [
  { 
    level: 'beginner', 
    name: 'Novice Archaeologist', 
    description: 'Simple inscriptions with basic vocabulary',
    icon: '🔍'
  },
  { 
    level: 'intermediate', 
    name: 'Temple Explorer', 
    description: 'Complex texts with challenging grammar',
    icon: '⚡'
  },
  { 
    level: 'advanced', 
    name: 'Master Linguist', 
    description: 'Ancient prophecies with advanced structures',
    icon: '🔥'
  }
];

export default function LanguageSelection({
  gameConfig,
  onLanguageSelected,
  onBackToMenu
}: LanguageSelectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(gameConfig.language);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(gameConfig.difficulty);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(selectedLanguage && selectedDifficulty ? true : false);
  }, [selectedLanguage, selectedDifficulty]);

  const handleStartRestoration = () => {
    if (!isReady) return;

    const config: GameConfig = {
      ...gameConfig,
      language: selectedLanguage as 'spanish' | 'french' | 'german',
      difficulty: selectedDifficulty as 'beginner' | 'intermediate' | 'advanced'
    };

    onLanguageSelected(config);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
            🏛️ Lava Temple
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-orange-200 mb-6">
            Word Restore
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto leading-relaxed">
            Ancient inscriptions have been damaged by time and volcanic activity. 
            Restore the missing words to unlock the secrets of the temple!
          </p>
        </motion.div>

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            Choose Your Ancient Language
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LANGUAGES.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedLanguage === lang.code
                    ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/30'
                    : 'border-orange-600/50 bg-black/30 hover:border-orange-400 hover:bg-orange-400/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-4xl mb-3">{lang.flag}</div>
                <h4 className="text-xl font-bold text-white mb-2">{lang.name}</h4>
                <div className={`h-2 rounded-full bg-gradient-to-r ${lang.color} opacity-70`}></div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Difficulty Selection */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            Select Your Archaeological Rank
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIFFICULTIES.map((diff) => (
              <motion.button
                key={diff.level}
                onClick={() => setSelectedDifficulty(diff.level)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedDifficulty === diff.level
                    ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/30'
                    : 'border-orange-600/50 bg-black/30 hover:border-orange-400 hover:bg-orange-400/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-3xl mb-3">{diff.icon}</div>
                <h4 className="text-lg font-bold text-white mb-2">{diff.name}</h4>
                <p className="text-sm text-orange-200">{diff.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={handleStartRestoration}
            disabled={!isReady}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              isReady
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400 shadow-lg hover:shadow-xl'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
            whileHover={isReady ? { scale: 1.05 } : {}}
            whileTap={isReady ? { scale: 0.95 } : {}}
          >
            🏛️ Begin Restoration
          </motion.button>

          <motion.button
            onClick={onBackToMenu}
            className="px-6 py-3 rounded-xl bg-black/50 text-orange-200 border border-orange-600/50 hover:bg-orange-600/20 hover:border-orange-400 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Games
          </motion.button>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-black/40 rounded-xl p-6 max-w-2xl mx-auto border border-orange-600/30">
            <h4 className="text-lg font-bold text-yellow-400 mb-3">How to Play</h4>
            <div className="text-orange-200 text-sm space-y-2">
              <p>• Ancient tablets appear with missing words marked as gaps</p>
              <p>• Select the correct word from the glowing rune options</p>
              <p>• Complete the inscription to unlock temple secrets</p>
              <p>• Restore multiple tablets to become a master archaeologist!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';
import FlagIcon from '@/components/ui/FlagIcon';

interface Language {
  id: string;
  name: string;
  flag: string;
  description: string;
  available: boolean;
}

interface LanguageSelectionProps {
  onLanguageSelect: (languageId: string) => void;
}

const languages: Language[] = [
  {
    id: 'spanish',
    name: 'Spanish',
    flag: 'ES',
    description: 'Master Spanish verb conjugations through epic battles',
    available: true
  },
  {
    id: 'french',
    name: 'French',
    flag: 'FR',
    description: 'Conquer French verb forms in medieval arenas',
    available: true // Now available
  },
  {
    id: 'german',
    name: 'German',
    flag: 'DE',
    description: 'Battle German verb conjugations in ancient castles',
    available: true // Now available
  }
];

export default function LanguageSelection({ onLanguageSelect }: LanguageSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Globe className="text-blue-400 mr-4" size={48} />
            <h1 className="text-5xl font-bold text-white">
              ⚔️ Conjugation Duel ⚔️
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-2">
            Choose Your Language
          </p>
          <p className="text-lg text-gray-400">
            Select a language to begin your conjugation battles
          </p>
        </motion.div>

        {/* Languages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {languages.map((language, index) => (
            <motion.div
              key={language.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-xl ${
                language.available
                  ? 'bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 cursor-pointer transform hover:scale-105'
                  : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 cursor-not-allowed opacity-60'
              } backdrop-blur-sm border border-white/20 transition-all duration-300`}
              onClick={() => language.available && onLanguageSelect(language.id)}
            >
              <div className="p-8 text-center">
                {/* Flag */}
                <div className="mb-4 flex justify-center">
                  <FlagIcon countryCode={language.flag} size="xl" />
                </div>

                {/* Language Name */}
                <h3 className="text-2xl font-bold text-white mb-3">
                  {language.name}
                </h3>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {language.description}
                </p>

                {/* Status/Button */}
                {language.available ? (
                  <div className="flex items-center justify-center text-blue-400 font-semibold">
                    <span className="mr-2">Start Battle</span>
                    <ArrowRight size={20} />
                  </div>
                ) : (
                  <div className="bg-gray-700/50 text-gray-400 px-4 py-2 rounded-lg font-semibold">
                    Coming Soon
                  </div>
                )}
              </div>

              {/* Hover Effect */}
              {language.available && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ opacity: 1 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-2">
              🎯 What You'll Practice
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
              <div>
                <strong className="text-blue-400">Verb Tenses</strong>
                <br />
                Present, Past, Future & More
              </div>
              <div>
                <strong className="text-purple-400">Conjugations</strong>
                <br />
                All Persons & Numbers
              </div>
              <div>
                <strong className="text-green-400">Battle System</strong>
                <br />
                RPG-Style Progression
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

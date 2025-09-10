'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Languages, Globe, FileText } from 'lucide-react';
import FlagIcon from '@/components/ui/FlagIcon';

interface LanguageSelectionProps {
  selectedCase: string;
  onLanguageSelect: (language: string) => void;
  onBack: () => void;
}

const LANGUAGES = [
  {
    code: 'es',
    name: 'Spanish',
    flag: 'ES',
    description: 'Intercept Spanish communications',
    difficulty: 'Beginner Friendly',
    color: 'from-red-500 to-yellow-500'
  },
  {
    code: 'fr',
    name: 'French',
    flag: 'FR',
    description: 'Decode French transmissions',
    difficulty: 'Intermediate',
    color: 'from-blue-500 to-red-500'
  },
  {
    code: 'de',
    name: 'German',
    flag: 'DE',
    description: 'Translate German intelligence',
    difficulty: 'Advanced',
    color: 'from-red-600 to-yellow-400'
  }
];

export default function LanguageSelection({ selectedCase, onLanguageSelect, onBack }: LanguageSelectionProps) {
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Cases
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-400 mb-2">Language Selection</h1>
            <p className="text-amber-300/70">Choose your translation frequency</p>
          </div>

          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Case info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-lg p-6 mb-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-amber-400" />
              <h2 className="text-xl font-semibold text-amber-400">Case File: {selectedCase}</h2>
            </div>
            <p className="text-slate-300">
              Select the language frequency to begin intercepting and translating communications.
              Each language presents different challenges and complexity levels.
            </p>
          </motion.div>

          {/* Language options */}
          <div className="grid md:grid-cols-3 gap-6">
            {LANGUAGES.map((language, index) => (
              <motion.div
                key={language.code}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredLanguage(language.code)}
                onMouseLeave={() => setHoveredLanguage(null)}
              >
                <button
                  onClick={() => onLanguageSelect(language.code)}
                  className="w-full h-full group"
                >
                  <div className={`
                    relative bg-gradient-to-br ${language.color} p-1 rounded-xl
                    transform transition-all duration-300 hover:scale-105 hover:rotate-1
                    ${hoveredLanguage === language.code ? 'shadow-2xl shadow-amber-500/20' : 'shadow-lg'}
                  `}>
                    <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-6 h-full">
                      {/* Language flag and name */}
                      <div className="text-center mb-4">
                        <div className="mb-3 flex justify-center">
                          <FlagIcon countryCode={language.flag} size="xl" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">{language.name}</h3>
                        <div className="text-amber-400 text-sm font-semibold">{language.difficulty}</div>
                      </div>

                      {/* Description */}
                      <div className="text-center mb-6">
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {language.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <Languages className="h-3 w-3" />
                          <span>Real-world sentences</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3" />
                          <span>Cultural context</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          <span>Detective scenarios</span>
                        </div>
                      </div>

                      {/* Hover effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                    </div>
                  </div>
                </button>

                {/* Animated border effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-amber-500/50 opacity-0"
                  animate={{
                    opacity: hoveredLanguage === language.code ? 1 : 0,
                    scale: hoveredLanguage === language.code ? 1.02 : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-600/50 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-amber-400 font-semibold mb-3">Detective Instructions</h3>
              <div className="text-slate-300 text-sm space-y-2">
                <p>• Each language frequency contains intercepted communications</p>
                <p>• Translate sentences accurately to gather evidence</p>
                <p>• Flexible matching allows for natural translation variations</p>
                <p>• Complete all translations to solve the case</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

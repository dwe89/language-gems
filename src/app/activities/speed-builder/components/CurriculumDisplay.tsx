'use client';

import React from 'react';
import { Book, Target, Star, Info, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SentenceData, CurriculumMetadata } from '../types';

interface CurriculumDisplayProps {
  currentSentence: SentenceData | null;
  showExplanations: boolean;
  gameMode: 'assignment' | 'freeplay';
  onToggleExplanations: () => void;
}

export const CurriculumDisplay: React.FC<CurriculumDisplayProps> = ({
  currentSentence,
  showExplanations,
  gameMode,
  onToggleExplanations
}) => {
  if (!currentSentence || !currentSentence.curriculum) {
    return null;
  }

  const { curriculum, explanation, hints } = currentSentence;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-2 border-purple-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Book className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">GCSE Spanish Context</h3>
        </div>
        
        {gameMode === 'freeplay' && (
          <motion.button
            onClick={onToggleExplanations}
            className="flex items-center gap-1 px-3 py-1 bg-white rounded-lg border border-purple-200 hover:border-purple-300 transition-colors text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Info className="h-4 w-4" />
            {showExplanations ? 'Hide' : 'Show'} Help
          </motion.button>
        )}
      </div>

      {/* Curriculum Metadata */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div className="bg-white p-2 rounded">
          <span className="text-xs text-gray-500 block">Tier</span>
          <span className="font-semibold text-purple-900">{curriculum.tier}</span>
        </div>
        <div className="bg-white p-2 rounded">
          <span className="text-xs text-gray-500 block">Theme</span>
          <span className="font-semibold text-purple-900 text-sm">{curriculum.theme}</span>
        </div>
        <div className="bg-white p-2 rounded">
          <span className="text-xs text-gray-500 block">Topic</span>
          <span className="font-semibold text-purple-900 text-sm">{curriculum.topic}</span>
        </div>
        {curriculum.grammarFocus && (
          <div className="bg-white p-2 rounded">
            <span className="text-xs text-gray-500 block">Grammar</span>
            <span className="font-semibold text-purple-900 text-sm">
              {curriculum.grammarFocus.replace('-', ' ')}
            </span>
          </div>
        )}
      </div>

      {/* Translation Display */}
      <div className="bg-white p-3 rounded-lg mb-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <span className="text-xs text-gray-500 block mb-1">🇪🇸 Spanish</span>
            <p className="font-medium text-gray-900">{currentSentence.translatedText}</p>
          </div>
          <div>
            <span className="text-xs text-gray-500 block mb-1">🇬🇧 English</span>
            <p className="font-medium text-gray-900">{currentSentence.originalText}</p>
          </div>
        </div>
      </div>

      {/* Explanations and Hints */}
      <AnimatePresence>
        {showExplanations && (explanation || hints) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {explanation && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">Grammar Focus</span>
                </div>
                <p className="text-blue-800 text-sm">{explanation}</p>
              </div>
            )}

            {hints && hints.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <span className="font-semibold text-yellow-900">Helpful Hints</span>
                </div>
                <ul className="space-y-1">
                  {hints.map((hint, index) => (
                    <li key={index} className="text-yellow-800 text-sm flex items-start gap-2">
                      <Star className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                      {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 
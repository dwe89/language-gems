'use client';

import React from 'react';
import { Languages, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { TranslationDirection } from '../types';

interface LanguageToggleProps {
  translationDirection: TranslationDirection;
  onDirectionChange: (direction: TranslationDirection) => void;
  currentSentence?: {
    originalText: string;
    translatedText: string;
  } | null;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  translationDirection,
  onDirectionChange,
  currentSentence
}) => {
  const isSpanishToEnglish = translationDirection === 'toNative';

  return (
    <div className="language-toggle bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-200 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-900">Language Direction</h3>
        </div>
        
        <motion.button
          onClick={() => onDirectionChange(isSpanishToEnglish ? 'fromNative' : 'toNative')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-indigo-200 hover:border-indigo-300 transition-colors text-sm font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowRightLeft className="h-4 w-4" />
          Switch
        </motion.button>
      </div>

      {/* Direction Display */}
      <div className="grid grid-cols-3 gap-3 items-center">
        <div className={`text-center p-3 rounded-lg border-2 transition-all ${
          !isSpanishToEnglish 
            ? 'bg-green-100 border-green-300 text-green-900' 
            : 'bg-white border-gray-200 text-gray-600'
        }`}>
          <div className="text-lg font-bold">🇪🇸</div>
          <div className="text-sm font-medium">Spanish</div>
          {!isSpanishToEnglish && <div className="text-xs text-green-700 mt-1">Build from this</div>}
        </div>

        <div className="text-center">
          <ArrowRightLeft className={`h-6 w-6 mx-auto transition-transform ${
            isSpanishToEnglish ? 'rotate-180' : ''
          }`} />
        </div>

        <div className={`text-center p-3 rounded-lg border-2 transition-all ${
          isSpanishToEnglish 
            ? 'bg-green-100 border-green-300 text-green-900' 
            : 'bg-white border-gray-200 text-gray-600'
        }`}>
          <div className="text-lg font-bold">🇬🇧</div>
          <div className="text-sm font-medium">English</div>
          {isSpanishToEnglish && <div className="text-xs text-green-700 mt-1">Build from this</div>}
        </div>
      </div>

      {/* Current Translation Preview */}
      {currentSentence && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
          <div className="text-xs text-gray-500 mb-1">You will build:</div>
          <div className="font-medium text-gray-900">
            {isSpanishToEnglish ? currentSentence.originalText : currentSentence.translatedText}
          </div>
          <div className="text-xs text-gray-500 mt-1">Translation reference:</div>
          <div className="text-sm text-gray-700">
            {isSpanishToEnglish ? currentSentence.translatedText : currentSentence.originalText}
          </div>
        </div>
      )}
    </div>
  );
}; 
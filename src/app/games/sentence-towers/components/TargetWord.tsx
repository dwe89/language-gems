'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TranslationDirection } from '../types';

interface TargetWordProps {
  word: string;
  translation: string;
  translationDirection: TranslationDirection;
}

export const TargetWord: React.FC<TargetWordProps> = ({ 
  word, 
  translation,
  translationDirection
}) => {
  // Determine which word to show based on translation direction
  const targetWord = translationDirection === 'fromNative' ? word : translation;
  
  return (
    <motion.div
      className="p-6 bg-indigo-900/40 rounded-lg border border-indigo-700/50 mb-8 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-2 text-sm text-indigo-300">
        {translationDirection === 'fromNative' ? 'Translate to target language:' : 'Translate to your language:'}
      </div>
      <p className="text-3xl font-bold text-white active-word">{targetWord}</p>
    </motion.div>
  );
}; 
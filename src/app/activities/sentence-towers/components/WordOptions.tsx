'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WordOptionsProps {
  options: {
    id: string;
    word: string;
    translation: string;
    isCorrect: boolean;
  }[];
  onSelectOption: (option: { id: string; word: string; translation: string; isCorrect: boolean }) => void;
  disabled: boolean;
}

export const WordOptions: React.FC<WordOptionsProps> = ({ options, onSelectOption, disabled }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((option, index) => (
        <motion.div
          key={option.id}
          className={`word-option ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !disabled && onSelectOption(option)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={!disabled ? { scale: 1.03 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-white font-medium">{option.word}</span>
            <span className="text-slate-300 text-sm mt-1">{option.translation}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}; 
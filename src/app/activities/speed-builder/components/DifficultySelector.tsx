'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DifficultyLevel } from '../types';
import { Smile, Meh, Frown } from 'lucide-react';

interface DifficultySelectorProps {
  currentDifficulty: DifficultyLevel;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  playSound?: (soundType: 'ui') => void;
}

const difficulties: Array<{
  id: DifficultyLevel;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
}> = [
  {
    id: 'easy',
    name: 'Easy',
    icon: Smile,
    description: 'Sentence remains visible',
    color: 'text-green-500'
  },
  {
    id: 'medium',
    name: 'Medium',
    icon: Meh,
    description: 'Sentence flashes briefly',
    color: 'text-amber-500'
  },
  {
    id: 'hard',
    name: 'Hard',
    icon: Frown,
    description: 'Ghost mode active',
    color: 'text-red-500'
  }
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  playSound
}) => {
  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    if (playSound) playSound('ui');
    onSelectDifficulty(difficulty);
  };
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-3">Select Difficulty</h3>
      <div className="grid grid-cols-3 gap-3">
        {difficulties.map((difficulty) => {
          const Icon = difficulty.icon;
          const isActive = currentDifficulty === difficulty.id;
          
          return (
            <motion.button
              key={difficulty.id}
              className={`p-4 rounded-lg border ${
                isActive 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              } flex flex-col items-center text-center relative`}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleDifficultyChange(difficulty.id)}
            >
              <Icon size={28} className={`mb-2 ${difficulty.color}`} />
              <span className="font-medium">{difficulty.name}</span>
              <span className="text-xs text-gray-500 mt-1">{difficulty.description}</span>
              
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-indigo-500"
                  layoutId="activeDifficulty"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}; 
'use client';

import React from 'react';
import { Brain, Mic, CreditCard, Zap, Target, Headphones, Keyboard } from 'lucide-react';
import { GameModeType } from '../utils/gameConstants';

interface GameModeInlineProps {
  currentMode: GameModeType;
  onModeChange: (mode: GameModeType) => void;
  onModeChangeCallback?: (mode: GameModeType, currentWord: any) => void;
  currentWord?: any;
}

const gameModes = [
  { mode: 'learn' as GameModeType, icon: <Brain className="h-5 w-5" />, label: 'Learn', description: 'Guided practice with hints' },
  { mode: 'dictation' as GameModeType, icon: <Mic className="h-5 w-5" />, label: 'Dictation', description: 'Listen and write what you hear' },
  { mode: 'flashcards' as GameModeType, icon: <CreditCard className="h-5 w-5" />, label: 'Flashcards', description: 'Quick review with cards' },
  { mode: 'speed' as GameModeType, icon: <Zap className="h-5 w-5" />, label: 'Speed', description: 'Quick-fire practice' },
  { mode: 'multiple_choice' as GameModeType, icon: <Target className="h-5 w-5" />, label: 'Multiple Choice', description: 'Choose the correct translation' },
  { mode: 'listening' as GameModeType, icon: <Headphones className="h-5 w-5" />, label: 'Listening', description: 'Audio recognition practice' },
  { mode: 'typing' as GameModeType, icon: <Keyboard className="h-5 w-5" />, label: 'Typing', description: 'Pure typing practice - double points!' }
];

export const GameModeInline: React.FC<GameModeInlineProps> = ({
  currentMode,
  onModeChange,
  onModeChangeCallback,
  currentWord
}) => {
  const handleModeChange = (mode: GameModeType) => {
    onModeChange(mode);
    if (onModeChangeCallback && currentWord) {
      onModeChangeCallback(mode, currentWord);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-white text-lg font-medium mr-6">Mode:</span>
        <div className="flex bg-white/10 rounded-xl p-2 space-x-2">
          {gameModes.map(({ mode, icon, label, description }) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                currentMode === mode
                  ? 'bg-white text-purple-900 shadow-lg scale-105'
                  : 'text-white hover:bg-white/20 hover:scale-105'
              }`}
              title={description}
            >
              {icon}
              <span className="ml-2">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

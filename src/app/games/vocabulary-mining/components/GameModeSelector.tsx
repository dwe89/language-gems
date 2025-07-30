'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, Target, Zap, BookOpen, Headphones, 
  PenTool, Keyboard, CreditCard, Info 
} from 'lucide-react';

interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface GameModeSelectorProps {
  currentMode: string;
  onModeSelect: (mode: string) => void;
  disabled?: boolean;
}

const GAME_MODES: GameMode[] = [
  {
    id: 'learn',
    name: 'Learn',
    description: 'Study new words with hints and examples. Perfect for first-time learning.',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'recall',
    name: 'Recall',
    description: 'Test your memory without hints. Challenge yourself to remember.',
    icon: <Target className="w-5 h-5" />,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'speed',
    name: 'Speed',
    description: 'Answer quickly before time runs out. 10 seconds per word!',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'multiple_choice',
    name: 'Multiple Choice',
    description: 'Choose the correct answer from 4 options. Great for recognition practice.',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'listening',
    name: 'Listening',
    description: 'Listen to pronunciation and type the English translation.',
    icon: <Headphones className="w-5 h-5" />,
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'dictation',
    name: 'Dictation',
    description: 'Listen and type what you hear in the target language.',
    icon: <PenTool className="w-5 h-5" />,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'typing',
    name: 'Typing',
    description: 'Type the translation for double points. More challenging but rewarding!',
    icon: <Keyboard className="w-5 h-5" />,
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'flashcards',
    name: 'Flashcards',
    description: 'Self-assess your knowledge. Click "I knew it" or "I didn\'t know".',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'from-red-500 to-red-600'
  }
];

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  currentMode,
  onModeSelect,
  disabled = false
}) => {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-lg font-bold text-gray-800">Choose Game Mode</h3>
        <div className="group relative">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
            Hover over modes to see descriptions
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {GAME_MODES.map((mode) => (
          <div key={mode.id} className="relative">
            <motion.button
              onClick={() => !disabled && onModeSelect(mode.id)}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
              disabled={disabled}
              className={`
                w-full p-3 rounded-lg text-white font-medium text-sm
                transition-all duration-200 relative overflow-hidden
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
                ${currentMode === mode.id ? 'ring-2 ring-white ring-offset-2' : ''}
              `}
              style={{
                background: `linear-gradient(135deg, ${mode.color.split(' ')[0].replace('from-', '')}, ${mode.color.split(' ')[2].replace('to-', '')})`
              }}
              whileHover={!disabled ? { scale: 1.05 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
            >
              <div className="flex flex-col items-center space-y-2">
                {mode.icon}
                <span>{mode.name}</span>
              </div>
              
              {currentMode === mode.id && (
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
            
            {/* Tooltip */}
            {hoveredMode === mode.id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-20 w-48"
              >
                <div className="font-medium mb-1">{mode.name}</div>
                <div className="text-gray-300">{mode.description}</div>
                
                {/* Arrow */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      {currentMode && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <strong>Current mode:</strong> {GAME_MODES.find(m => m.id === currentMode)?.description}
          </div>
        </div>
      )}
    </div>
  );
};

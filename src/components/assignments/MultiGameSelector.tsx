'use client';

import React from 'react';
import { 
  CheckCircle, 
  Gamepad2, 
  Brain, 
  Zap, 
  Target, 
  Star, 
  DollarSign,
  Rocket,
  Puzzle,
  Type,
  Layers,
  RefreshCw,
  Shuffle,
  Castle,
  Pickaxe,
  Gem
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GameOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'vocabulary' | 'grammar' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  features: string[];
  type: 'vocabulary' | 'sentence' | 'mixed';
}

const AVAILABLE_GAMES: GameOption[] = [
  {
    id: 'vocabulary-mining',
    name: 'Vocabulary Mining',
    description: 'Mine rare vocabulary gems through intelligent spaced repetition and adaptive learning',
    icon: <Star className="h-5 w-5" />,
    color: 'from-yellow-500 to-orange-500',
    category: 'vocabulary',
    difficulty: 'beginner',
    estimatedTime: '3-8 min',
    features: ['Gem collection', 'Spaced repetition', 'Adaptive difficulty'],
    type: 'vocabulary'
  },
  {
    id: 'translation-tycoon',
    name: 'Translation Tycoon',
    description: 'Build your business empire by making correct translations and smart investments',
    icon: <DollarSign className="h-5 w-5" />,
    color: 'from-green-500 to-emerald-500',
    category: 'vocabulary',
    difficulty: 'intermediate',
    estimatedTime: '8-15 min',
    features: ['Strategy gameplay', 'Economic simulation', 'Progress tracking'],
    type: 'vocabulary'
  },
  {
    id: 'speed-builder',
    name: 'Speed Builder',
    description: 'Build sentences by dragging words into the correct order',
    icon: <Zap className="h-5 w-5" />,
    color: 'from-yellow-500 to-orange-500',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '5-10 min',
    features: ['Drag & drop', 'Grammar focus', 'Sentence construction'],
    type: 'sentence'
  },
  {
    id: 'sentence-towers',
    name: 'Sentence Towers',
    description: 'Stack sentence components to build towering grammatical structures',
    icon: <Castle className="h-5 w-5" />,
    color: 'from-indigo-500 to-purple-500',
    category: 'grammar',
    difficulty: 'advanced',
    estimatedTime: '6-12 min',
    features: ['Tower building', 'Complex grammar', 'Strategic thinking'],
    type: 'sentence'
  },
  {
    id: 'conjugation-duel',
    name: 'Conjugation Duel',
    description: 'Epic verb conjugation battles in different arenas and leagues',
    icon: <Layers className="h-5 w-5" />,
    color: 'from-red-500 to-orange-500',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '10-20 min',
    features: ['Battle system', 'League progression', 'Real-time combat'],
    type: 'sentence'
  },
  {
    id: 'word-blast',
    name: 'Word Blast',
    description: 'Launch rockets by selecting correct translations',
    icon: <Rocket className="h-5 w-5" />,
    color: 'from-orange-500 to-red-500',
    category: 'vocabulary',
    difficulty: 'beginner',
    estimatedTime: '5-12 min',
    features: ['Action gameplay', 'Visual effects', 'Score multipliers'],
    type: 'vocabulary'
  }
];

interface MultiGameSelectorProps {
  selectedGames: string[];
  onSelectionChange: (selectedGames: string[]) => void;
  maxSelections?: number;
}

export default function MultiGameSelector({
  selectedGames,
  onSelectionChange,
  maxSelections = 5
}: MultiGameSelectorProps) {

  const toggleGameSelection = (gameId: string) => {
    if (selectedGames.includes(gameId)) {
      onSelectionChange(selectedGames.filter(id => id !== gameId));
    } else if (selectedGames.length < maxSelections) {
      onSelectionChange([...selectedGames, gameId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gamepad2 className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Games</h3>
        <p className="text-gray-600 mb-4">Select up to {maxSelections} games for this assignment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AVAILABLE_GAMES.map((game) => {
          const isSelected = selectedGames.includes(game.id);
          const canSelect = selectedGames.length < maxSelections || isSelected;
          
          return (
            <motion.div
              key={game.id}
              whileHover={canSelect ? { scale: 1.02 } : {}}
              whileTap={canSelect ? { scale: 0.98 } : {}}
              className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                  : canSelect
                  ? 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => canSelect && toggleGameSelection(game.id)}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
              )}

              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${game.color} flex items-center justify-center text-white mb-4`}>
                {game.icon}
              </div>

              <h4 className="text-lg font-bold text-gray-800 mb-2">{game.name}</h4>
              <p className="text-gray-600 text-sm mb-4">{game.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{game.estimatedTime}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 
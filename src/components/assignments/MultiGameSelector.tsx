'use client';

import React from 'react';
import {
  CheckCircle,
  Gamepad2,
  Zap,
  Headphones,
  Shuffle,
  Grid3X3,
  Crown,
  Brain,
  Puzzle,
  Rocket,
  Building2,
  Castle,
  Layers,
  FileText,
  Flame,
  Sword,
  Pickaxe
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GameOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'vocabulary' | 'grammar' | 'mixed' | 'listening';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  estimatedTime: string;
  features: string[];
  type: 'vocabulary' | 'sentence' | 'mixed';
}

const AVAILABLE_GAMES: GameOption[] = [
  // Games with confirmed assignment support
  {
    id: 'noughts-and-crosses',
    name: 'Tic-Tac-Toe Vocabulary',
    description: 'Win tic-tac-toe by answering vocabulary questions correctly',
    icon: <Grid3X3 className="h-5 w-5" />,
    color: 'from-green-500 to-emerald-500',
    category: 'vocabulary',
    difficulty: 'beginner',
    estimatedTime: '3-8 min',
    features: ['Strategic gameplay', 'Quick questions', 'Competitive'],
    type: 'vocabulary'
  },
  {
    id: 'detective-listening',
    name: 'Detective Listening',
    description: 'Solve cases by listening to radio transmissions and identifying evidence',
    icon: <Headphones className="h-5 w-5" />,
    color: 'from-amber-600 to-yellow-500',
    category: 'listening',
    difficulty: 'intermediate',
    estimatedTime: '8-15 min',
    features: ['Audio comprehension', 'Detective theme', 'Evidence collection'],
    type: 'vocabulary'
  },
  {
    id: 'vocab-blast',
    name: 'Vocab Blast',
    description: 'Fast-paced vocabulary action with themed adventures',
    icon: <Zap className="h-5 w-5" />,
    color: 'from-yellow-500 to-orange-500',
    category: 'vocabulary',
    difficulty: 'intermediate',
    estimatedTime: '5-12 min',
    features: ['Themed adventures', 'Fast-paced action', 'Power-ups'],
    type: 'vocabulary'
  },
  {
    id: 'vocab-master',
    name: 'VocabMaster',
    description: 'Comprehensive vocabulary learning with multiple game modes',
    icon: <Crown className="h-5 w-5" />,
    color: 'from-purple-500 to-indigo-500',
    category: 'vocabulary',
    difficulty: 'adaptive',
    estimatedTime: '10-20 min',
    features: ['Multiple modes', 'Adaptive difficulty', 'Comprehensive learning'],
    type: 'vocabulary'
  },
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    description: 'Unscramble letters to form vocabulary words',
    icon: <Shuffle className="h-5 w-5" />,
    color: 'from-violet-500 to-purple-500',
    category: 'vocabulary',
    difficulty: 'beginner',
    estimatedTime: '4-8 min',
    features: ['Letter manipulation', 'Spelling practice', 'Timed challenges'],
    type: 'vocabulary'
  },
  {
    id: 'memory-game',
    name: 'Memory Match',
    description: 'Match vocabulary words with their translations in this classic memory game',
    icon: <Brain className="h-5 w-5" />,
    color: 'from-blue-500 to-indigo-500',
    category: 'vocabulary',
    difficulty: 'beginner',
    estimatedTime: '5-10 min',
    features: ['Memory training', 'Visual learning', 'Pattern recognition'],
    type: 'vocabulary'
  },
  {
    id: 'hangman',
    name: 'Hangman',
    description: 'Classic word guessing game with vocabulary practice',
    icon: <Puzzle className="h-5 w-5" />,
    color: 'from-cyan-500 to-blue-500',
    category: 'vocabulary',
    difficulty: 'beginner',
    estimatedTime: '3-7 min',
    features: ['Classic gameplay', 'Letter guessing', 'Hint system'],
    type: 'vocabulary'
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
  },

  // Grammar Games with Assignment Support
  {
    id: 'speed-builder',
    name: 'Speed Builder',
    description: 'Build sentences by dragging words into the correct order',
    icon: <Building2 className="h-5 w-5" />,
    color: 'from-indigo-500 to-blue-500',
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
    color: 'from-amber-500 to-orange-500',
    category: 'grammar',
    difficulty: 'intermediate',
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
    id: 'case-file-translator',
    name: 'Case File Translator',
    description: 'Translate case files and evidence to solve mysteries',
    icon: <FileText className="h-5 w-5" />,
    color: 'from-gray-600 to-amber-600',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '8-15 min',
    features: ['Translation practice', 'Mystery theme', 'Case solving'],
    type: 'sentence'
  },
  {
    id: 'lava-temple-word-restore',
    name: 'Lava Temple: Word Restore',
    description: 'Restore ancient stone tablets by filling in missing words',
    icon: <Flame className="h-5 w-5" />,
    color: 'from-red-600 to-orange-500',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '8-15 min',
    features: ['Fill-in-the-blank', 'Temple theme', 'Word restoration'],
    type: 'sentence'
  },
  {
    id: 'sentence-builder',
    name: 'Sentence Builder',
    description: 'Construct sentences by selecting and arranging words in the correct order',
    icon: <Building2 className="h-5 w-5" />,
    color: 'from-emerald-500 to-green-500',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '6-12 min',
    features: ['Sentence construction', 'Word ordering', 'Grammar practice'],
    type: 'sentence'
  },
  {
    id: 'verb-quest',
    name: 'Verb Quest',
    description: 'Embark on an epic RPG adventure to master verb conjugations',
    icon: <Sword className="h-5 w-5" />,
    color: 'from-violet-500 to-purple-500',
    category: 'grammar',
    difficulty: 'advanced',
    estimatedTime: '12-20 min',
    features: ['RPG adventure', 'Verb conjugation', 'Character progression'],
    type: 'sentence'
  },
  {
    id: 'vocabulary-mining',
    name: 'Vocabulary Mining',
    description: 'Mine for vocabulary gems in underground caverns',
    icon: <Pickaxe className="h-5 w-5" />,
    color: 'from-stone-500 to-gray-600',
    category: 'vocabulary',
    difficulty: 'beginner',
    estimatedTime: '5-10 min',
    features: ['Mining theme', 'Gem collection', 'Progressive difficulty'],
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
  maxSelections = 15
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
        <p className="text-gray-600 mb-4">Select games for this assignment (up to {maxSelections} games)</p>
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
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
  Pickaxe,
  RefreshCw,
  Target,
  Gem,
  Map,
  Type
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GameOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'vocabulary' | 'grammar' | 'mixed' | 'listening' | 'spelling';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  estimatedTime: string;
  features: string[];
  type: 'vocabulary' | 'sentence' | 'mixed' | 'grammar';
}

const AVAILABLE_GAMES: GameOption[] = [
  {
    id: 'noughts-and-crosses',
    name: 'Tic-Tac-Toe Vocabulary',
    description: 'Play tic-tac-toe while practicing language terms',
    icon: <Grid3X3 className="h-5 w-5" />,
    color: 'from-green-500 to-emerald-500',
    category: 'vocabulary',
    difficulty: 'beginner',
    estimatedTime: '3-8 min',
    features: ['Strategic gameplay', 'Quick questions', 'Competitive'],
    type: 'vocabulary'
  },
  {
    id: 'vocab-blast',
    name: 'Vocab Blast',
    description: 'Click vocabulary gems to pop and translate them quickly',
    icon: <Zap className="h-5 w-5" />,
    color: 'from-yellow-500 to-orange-500',
    category: 'vocabulary',
    difficulty: 'intermediate',
    estimatedTime: '5-12 min',
    features: ['Themed adventures', 'Fast-paced action', 'Power-ups'],
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
    id: 'memory-game',
    name: 'Memory Match',
    description: 'Match pairs of cards to build vocabulary and memory skills',
    icon: <Brain className="h-5 w-5" />,
    color: 'from-blue-500 to-indigo-500',
    category: 'vocabulary',
    difficulty: 'beginner',
    estimatedTime: '5-10 min',
    features: ['Memory training', 'Visual learning', 'Pattern recognition'],
    type: 'vocabulary'
  },
  {
    id: 'word-towers',
    name: 'Word Towers',
    description: 'Build towers by matching vocabulary words to translations. Wrong answers make towers fall!',
    icon: <Castle className="h-5 w-5" />,
    color: 'from-amber-500 to-orange-500',
    category: 'vocabulary',
    difficulty: 'intermediate',
    estimatedTime: '6-12 min',
    features: ['Tower building', 'Vocabulary practice', 'Strategic thinking'],
    type: 'vocabulary'
  },
  {
    id: 'sentence-towers',
    name: 'Sentence Towers',
    description: 'Build towers by matching full sentences to translations. Practice sentence comprehension!',
    icon: <Castle className="h-5 w-5" />,
    color: 'from-purple-500 to-pink-500',
    category: 'grammar',
    difficulty: 'advanced',
    estimatedTime: '8-15 min',
    features: ['Tower building', 'Sentence practice', 'Grammar comprehension'],
    type: 'sentence'
  },
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    description: 'Unscramble jumbled words to improve spelling and word recognition',
    icon: <Shuffle className="h-5 w-5" />,
    color: 'from-violet-500 to-purple-500',
    category: 'spelling',
    difficulty: 'beginner',
    estimatedTime: '4-8 min',
    features: ['Letter manipulation', 'Spelling practice', 'Timed challenges'],
    type: 'vocabulary'
  },
  // VocabMaster moved to its own dedicated tab
  {
    id: 'detective-listening',
    name: 'Detective Listening Game',
    description: 'Solve cases by identifying evidence through listening to words in Spanish, French, or German and finding their English translations',
    icon: <Headphones className="h-5 w-5" />,
    color: 'from-amber-600 to-yellow-500',
    category: 'listening',
    difficulty: 'intermediate',
    estimatedTime: '8-15 min',
    features: ['Audio comprehension', 'Detective theme', 'Evidence collection'],
    type: 'mixed' // use 'mixed' to represent listening-focused activity
  },

  {
    id: 'speed-builder',
    name: 'Sentence Sprint',
    description: 'Drag and drop words to build sentences correctly before time runs out',
    icon: <Building2 className="h-5 w-5" />,
    color: 'from-indigo-500 to-blue-500',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '5-10 min',
    features: ['Drag & drop', 'Grammar focus', 'Sentence construction'],
    type: 'sentence'
  },
  {
    id: 'case-file-translator',
    name: 'Case File Translator',
    description: 'Solve detective cases by translating intercepted communications from Spanish, French, or German to English',
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
    description: 'Restore ancient inscriptions by filling in missing words. Become a linguistic archaeologist and unlock temple secrets!',
    icon: <Flame className="h-5 w-5" />,
    color: 'from-red-600 to-orange-500',
    category: 'grammar',
    difficulty: 'intermediate',
    estimatedTime: '8-15 min',
    features: ['Fill-in-the-blank', 'Temple theme', 'Word restoration'],
    type: 'sentence'
  },
];

interface MultiGameSelectorProps {
  selectedGames: string[];
  onSelectionChange: (selectedGames: string[]) => void;
  gameRequirements?: { [gameId: string]: { minSessions: number } };
  onRequirementsChange?: (requirements: { [gameId: string]: { minSessions: number } }) => void;
  maxSelections?: number;
}

export default function MultiGameSelector({
  selectedGames,
  onSelectionChange,
  gameRequirements = {},
  onRequirementsChange,
  maxSelections = 15
}: MultiGameSelectorProps) {
  console.log('🎮 [MULTI GAME SELECTOR] Component rendered with:', {
    selectedGames,
    gameRequirements,
    hasOnRequirementsChange: !!onRequirementsChange
  });

  const toggleGameSelection = (gameId: string) => {
    if (selectedGames.includes(gameId)) {
      onSelectionChange(selectedGames.filter(id => id !== gameId));
      // Remove requirements when game is deselected
      if (onRequirementsChange && gameRequirements[gameId]) {
        const newRequirements = { ...gameRequirements };
        delete newRequirements[gameId];
        onRequirementsChange(newRequirements);
      }
    } else if (selectedGames.length < maxSelections) {
      onSelectionChange([...selectedGames, gameId]);
    }
  };

  const handleRequirementChange = (gameId: string, minSessions: number) => {
    if (!onRequirementsChange) return;

    const newRequirements = { ...gameRequirements };
    if (minSessions === 0) {
      // Remove requirement if set to 0 (optional)
      delete newRequirements[gameId];
    } else {
      newRequirements[gameId] = { minSessions };
    }
    onRequirementsChange(newRequirements);
  };

  // Group games by their 'type'
  const gamesByType = AVAILABLE_GAMES.reduce((acc, game) => {
    // Correct the display name for 'sentence' to 'sentences'
    const typeKey = game.type === 'sentence' ? 'sentences' : game.type;
    if (!acc[typeKey]) {
      acc[typeKey] = [];
    }
    acc[typeKey].push(game);
    return acc;
  }, {} as Record<string, GameOption[]>);

  // Define the order of headings
  const orderedTypes: ('vocabulary' | 'listening' | 'sentences' | 'grammar' | 'spelling' | 'mixed')[] = [
    'vocabulary',
    'listening',
    'sentences',
    'grammar',
    'spelling',
    'mixed'
  ];

  // Map type keys to user-friendly headings
  const typeHeadings: Record<typeof orderedTypes[number], string> = {
    'vocabulary': 'Vocabulary Learning',
    'listening': 'Listening',
    'sentences': 'Sentence Building',
    'grammar': 'Grammar',
    'spelling': 'Spelling',
    'mixed': 'Mixed Skills'
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

      {orderedTypes.map((typeKey) => {
        const gamesInType = gamesByType[typeKey];
        if (!gamesInType || gamesInType.length === 0) {
          return null; // Don't render section if no games of this type exist
        }

        return (
          <div key={typeKey} className="mb-8">
            <h4 className="text-xl font-bold text-gray-800 mt-6 mb-4 capitalize">
              {typeHeadings[typeKey]}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gamesInType.map((game) => {
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

                    {/* Minimum Sessions Requirement (only show if game is selected) */}
                    {(() => {
                      console.log('🎮 [GAME SELECTOR] Checking dropdown for:', game.id, 'isSelected:', isSelected, 'hasCallback:', !!onRequirementsChange);
                      return isSelected && onRequirementsChange;
                    })() && (
                      <div className="mt-4 pt-4 border-t border-indigo-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Require minimum sessions:
                        </label>
                        <select
                          value={gameRequirements[game.id]?.minSessions || 0}
                          onChange={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleRequirementChange(game.id, parseInt(e.target.value));
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevent card click
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        >
                          <option value="0">0 (Optional)</option>
                          <option value="1">1 session</option>
                          <option value="2">2 sessions</option>
                          <option value="3">3 sessions</option>
                          <option value="4">4 sessions</option>
                          <option value="5">5 sessions</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          {gameRequirements[game.id]?.minSessions > 0
                            ? `Students must play this game at least ${gameRequirements[game.id].minSessions} time${gameRequirements[game.id].minSessions > 1 ? 's' : ''}`
                            : 'This game is optional for students'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
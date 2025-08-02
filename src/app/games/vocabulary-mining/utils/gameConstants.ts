export type GemType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type GameModeType = 'learn' | 'recall' | 'speed' | 'multiple_choice' | 'listening' | 'cloze' | 'typing' | 'match_up' | 'match' | 'dictation' | 'flashcards';

export interface GemTypeInfo {
  name: string;
  iconName: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  description: string;
  points: number;
  masteryLevel: number;
}

// Gem types and their properties - Progressive mastery system
export const GEM_TYPES: Record<GemType, GemTypeInfo> = {
  common: {
    name: 'Common Gems',
    iconName: 'Gem',
    color: 'from-blue-400 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'First exposure - everyday vocabulary gems',
    points: 10,
    masteryLevel: 0
  },
  uncommon: {
    name: 'Uncommon Gems',
    iconName: 'Sparkles',
    color: 'from-green-400 to-green-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: '1st correct review - useful vocabulary gems',
    points: 25,
    masteryLevel: 1
  },
  rare: {
    name: 'Rare Gems',
    iconName: 'Star',
    color: 'from-purple-400 to-purple-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: '2nd correct review - valuable vocabulary gems',
    points: 50,
    masteryLevel: 2
  },
  epic: {
    name: 'Epic Gems',
    iconName: 'Diamond',
    color: 'from-pink-400 to-pink-600',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: '3rd correct review - powerful vocabulary gems',
    points: 100,
    masteryLevel: 3
  },
  legendary: {
    name: 'Legendary Gems',
    iconName: 'Crown',
    color: 'from-yellow-400 to-yellow-600',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    description: '4+ correct reviews - legendary mastery',
    points: 200,
    masteryLevel: 4
  }
};

// Helper function to handle different vocabulary data structures
export const getWordProperty = (word: any, property: 'spanish' | 'english'): string => {
  if (property === 'spanish') {
    return word.spanish || word.word || '';
  } else {
    return word.english || word.translation || '';
  }
};

// Calculate XP required for next level (exponential growth)
export const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

/**
 * Unified Reward Engine for LanguageGems
 * Implements gems-first reward system with consistent rarity calculation
 */

export type GemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface GemTypeInfo {
  name: string;
  points: number;
  color: string;
  description: string;
  masteryLevel: number;
}

export interface GemEvent {
  rarity: GemRarity;
  xpValue: number;
  vocabularyId?: number;
  wordText?: string;
  translationText?: string;
  responseTimeMs: number;
  streakCount: number;
  hintUsed: boolean;
  gameType: string;
  gameMode?: string;
  difficultyLevel?: string;
}

export interface PerformanceContext {
  responseTimeMs: number;
  streakCount: number;
  hintUsed: boolean;
  isTypingMode: boolean;
  isDictationMode: boolean;
  masteryLevel?: number;
  maxGemRarity?: GemRarity;
}

export interface GameTypeConfig {
  name: string;
  baseResponseTime: number; // Expected response time for "normal" performance
  speedThresholds: {
    fast: number;    // Under this = rare tier
    normal: number;  // Under this = uncommon tier
  };
  streakThresholds: {
    epic: number;     // Streak needed for epic
    legendary: number; // Streak needed for legendary
  };
  typingBonus: boolean;    // Whether typing mode gets +1 rarity tier
  dictationBonus: boolean; // Whether dictation mode gets +1 rarity tier
}

// Unified gem type definitions (matches existing GEM_TYPES)
export const GEM_TYPES: Record<GemRarity, GemTypeInfo> = {
  common: {
    name: 'Common Gems',
    points: 10,
    color: 'from-blue-400 to-blue-600',
    description: 'Standard performance - everyday vocabulary gems',
    masteryLevel: 0
  },
  uncommon: {
    name: 'Uncommon Gems',
    points: 25,
    color: 'from-green-400 to-green-600',
    description: 'Good performance - useful vocabulary gems',
    masteryLevel: 1
  },
  rare: {
    name: 'Rare Gems',
    points: 50,
    color: 'from-purple-400 to-purple-600',
    description: 'Fast response - valuable vocabulary gems',
    masteryLevel: 2
  },
  epic: {
    name: 'Epic Gems',
    points: 100,
    color: 'from-orange-400 to-orange-600',
    description: 'Streak performance - powerful vocabulary gems',
    masteryLevel: 3
  },
  legendary: {
    name: 'Legendary Gems',
    points: 200,
    color: 'from-yellow-400 to-yellow-600',
    description: 'Exceptional mastery - legendary vocabulary gems',
    masteryLevel: 4
  }
};

// Game-specific configurations
export const GAME_CONFIGS: Record<string, GameTypeConfig> = {
  'vocab-master': {
    name: 'VocabMaster',
    baseResponseTime: 4000,
    speedThresholds: { fast: 2000, normal: 4000 },
    streakThresholds: { epic: 5, legendary: 10 },
    typingBonus: true,
    dictationBonus: true
  },
  'vocabulary-mining': {
    name: 'Vocabulary Mining',
    baseResponseTime: 3000,
    speedThresholds: { fast: 2000, normal: 3000 },
    streakThresholds: { epic: 5, legendary: 10 },
    typingBonus: false,
    dictationBonus: false
  },
  'memory-game': {
    name: 'Memory Game',
    baseResponseTime: 2000,
    speedThresholds: { fast: 1000, normal: 2000 },
    streakThresholds: { epic: 3, legendary: 6 }, // Shorter streaks for memory
    typingBonus: false,
    dictationBonus: false
  },
  'word-towers': {
    name: 'Word Towers',
    baseResponseTime: 5000,
    speedThresholds: { fast: 3000, normal: 5000 },
    streakThresholds: { epic: 5, legendary: 10 },
    typingBonus: true,
    dictationBonus: false
  },
  'lava-temple': {
    name: 'Lava Temple',
    baseResponseTime: 15000, // Longer reading time
    speedThresholds: { fast: 10000, normal: 15000 },
    streakThresholds: { epic: 3, legendary: 6 },
    typingBonus: false,
    dictationBonus: false
  },
  'pirate-ship': {
    name: 'Pirate Ship',
    baseResponseTime: 3000,
    speedThresholds: { fast: 2000, normal: 3000 },
    streakThresholds: { epic: 5, legendary: 10 },
    typingBonus: false,
    dictationBonus: false
  },
  'default': {
    name: 'Default Game',
    baseResponseTime: 4000,
    speedThresholds: { fast: 2000, normal: 4000 },
    streakThresholds: { epic: 5, legendary: 10 },
    typingBonus: false,
    dictationBonus: false
  }
};

export class RewardEngine {
  /**
   * Calculate gem rarity based on performance context
   */
  static calculateGemRarity(
    gameType: string,
    context: PerformanceContext
  ): GemRarity {
    const config = GAME_CONFIGS[gameType] || GAME_CONFIGS.default;
    
    // Start with base rarity
    let rarity: GemRarity = 'common';
    
    // If hint was used, cap at common
    if (context.hintUsed) {
      return this.capRarityByMastery('common', context.maxGemRarity);
    }
    
    // Speed-based rarity upgrade
    if (context.responseTimeMs <= config.speedThresholds.fast) {
      rarity = 'rare';
    } else if (context.responseTimeMs <= config.speedThresholds.normal) {
      rarity = 'uncommon';
    }
    
    // Streak-based rarity upgrade (overrides speed if higher)
    if (context.streakCount >= config.streakThresholds.legendary) {
      rarity = 'legendary';
    } else if (context.streakCount >= config.streakThresholds.epic) {
      rarity = 'epic';
    }
    
    // Mode-based bonuses
    if (config.typingBonus && context.isTypingMode) {
      rarity = this.upgradeRarity(rarity);
    }
    
    if (config.dictationBonus && context.isDictationMode) {
      rarity = this.upgradeRarity(rarity);
    }
    
    // Cap by mastery level to prevent grinding
    return this.capRarityByMastery(rarity, context.maxGemRarity);
  }
  
  /**
   * Upgrade rarity by one tier
   */
  private static upgradeRarity(rarity: GemRarity): GemRarity {
    const rarityOrder: GemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const currentIndex = rarityOrder.indexOf(rarity);
    return rarityOrder[Math.min(currentIndex + 1, rarityOrder.length - 1)];
  }
  
  /**
   * Cap rarity based on mastery level
   */
  private static capRarityByMastery(
    rarity: GemRarity, 
    maxGemRarity?: GemRarity
  ): GemRarity {
    if (!maxGemRarity) return rarity;
    
    const rarityOrder: GemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const rarityIndex = rarityOrder.indexOf(rarity);
    const maxIndex = rarityOrder.indexOf(maxGemRarity);
    
    return rarityOrder[Math.min(rarityIndex, maxIndex)];
  }
  
  /**
   * Get XP value for a gem rarity
   */
  static getXPValue(rarity: GemRarity): number {
    return GEM_TYPES[rarity].points;
  }
  
  /**
   * Create a gem event from performance data
   */
  static createGemEvent(
    gameType: string,
    context: PerformanceContext,
    vocabularyData?: {
      id?: number;
      word?: string;
      translation?: string;
    },
    gameMode?: string,
    difficultyLevel?: string
  ): GemEvent {
    const rarity = this.calculateGemRarity(gameType, context);
    const xpValue = this.getXPValue(rarity);
    
    return {
      rarity,
      xpValue,
      vocabularyId: vocabularyData?.id,
      wordText: vocabularyData?.word,
      translationText: vocabularyData?.translation,
      responseTimeMs: context.responseTimeMs,
      streakCount: context.streakCount,
      hintUsed: context.hintUsed,
      gameType,
      gameMode,
      difficultyLevel
    };
  }
  
  /**
   * Calculate total XP from gem events
   */
  static calculateTotalXP(gemEvents: GemEvent[]): number {
    return gemEvents.reduce((total, event) => total + event.xpValue, 0);
  }
  
  /**
   * Group gem events by rarity
   */
  static groupGemsByRarity(gemEvents: GemEvent[]): Record<GemRarity, number> {
    const counts: Record<GemRarity, number> = {
      common: 0,
      uncommon: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };
    
    gemEvents.forEach(event => {
      counts[event.rarity]++;
    });
    
    return counts;
  }
  
  /**
   * Get max gem rarity based on mastery level
   */
  static getMaxGemRarityForMastery(masteryLevel: number): GemRarity {
    if (masteryLevel <= 1) return 'rare';      // New/learning words
    if (masteryLevel <= 3) return 'epic';      // Practiced words
    return 'legendary';                        // Mastered words
  }
}

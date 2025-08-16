/**
 * Unified Reward Engine for LanguageGems
 * Implements gems-first reward system with consistent rarity calculation
 */

export type GemRarity = 'new_discovery' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface GemTypeInfo {
  name: string;
  points: number;
  color: string;
  description: string;
  masteryLevel: number;
}

export type GemType = 'mastery' | 'activity' | 'grammar';

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
  gemType?: GemType;
  // Grammar-specific fields
  conjugationId?: string;
  baseVerbId?: string;
  tense?: string;
  person?: string;
  verbType?: 'regular' | 'irregular' | 'stem_changing';
}

export interface PerformanceContext {
  responseTimeMs: number;
  streakCount: number;
  hintUsed: boolean;
  isTypingMode: boolean;
  isDictationMode: boolean;
  masteryLevel?: number;
  maxGemRarity?: GemRarity;
  isFirstTime?: boolean; // 🆕 DUAL-TRACK: Whether this is the first time learning this word
  // Grammar-specific context
  tense?: string;
  verbType?: 'regular' | 'irregular' | 'stem_changing';
  complexityScore?: number; // 1-5 difficulty rating
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
  new_discovery: {
    name: 'New Discovery',
    points: 5,
    color: 'from-yellow-400 to-orange-500',
    description: 'First correct answer - new vocabulary discovered!',
    masteryLevel: 0
  },
  common: {
    name: 'Common Gems',
    points: 10,
    color: 'from-blue-400 to-blue-600',
    description: 'Standard performance - everyday vocabulary gems',
    masteryLevel: 1
  },
  uncommon: {
    name: 'Uncommon Gems',
    points: 25,
    color: 'from-green-400 to-green-600',
    description: 'Good performance - useful vocabulary gems',
    masteryLevel: 2
  },
  rare: {
    name: 'Rare Gems',
    points: 50,
    color: 'from-purple-400 to-purple-600',
    description: 'Fast response - valuable vocabulary gems',
    masteryLevel: 3
  },
  epic: {
    name: 'Epic Gems',
    points: 100,
    color: 'from-orange-400 to-orange-600',
    description: 'Streak performance - powerful vocabulary gems',
    masteryLevel: 4
  },
  legendary: {
    name: 'Legendary Gems',
    points: 200,
    color: 'from-yellow-400 to-yellow-600',
    description: 'Exceptional mastery - legendary vocabulary gems',
    masteryLevel: 5
  }
};

// Activity Gem XP values (immediate performance rewards)
export const ACTIVITY_GEM_XP: Record<GemRarity, number> = {
  new_discovery: 2, // Not typically used for activity gems
  common: 2,        // Standard correct answer
  uncommon: 3,      // Good performance
  rare: 5,          // Fast response or streak bonus
  epic: 5,          // High streak performance
  legendary: 5      // Exceptional performance
};

// Grammar Gem XP values (conjugation mastery rewards)
export const GRAMMAR_GEM_XP: Record<GemRarity, number> = {
  new_discovery: 5,  // First correct conjugation of a verb
  common: 8,         // Regular verb, simple tense
  uncommon: 12,      // Irregular verb or complex tense
  rare: 18,          // Fast conjugation or difficult verb
  epic: 25,          // Perfect streak with complex grammar
  legendary: 35      // Exceptional grammar mastery
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
  'conjugation-duel': {
    name: 'Conjugation Duel',
    baseResponseTime: 6000, // Grammar requires more thinking time
    speedThresholds: { fast: 3000, normal: 6000 },
    streakThresholds: { epic: 4, legendary: 8 }, // Grammar streaks are harder
    typingBonus: true, // Always typing in conjugation
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

    // 🆕 DUAL-TRACK FIX: Check if this is a first-time word discovery
    if (context.isFirstTime) {
      console.log('🆕 [REWARD ENGINE] First-time word detected - awarding New Discovery');
      return 'new_discovery'; // Always award New Discovery for first correct answer
    }

    console.log('🔄 [REWARD ENGINE] Subsequent review - calculating performance-based rarity');

    // Start with base rarity for subsequent reviews
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
    const rarityOrder: GemRarity[] = ['new_discovery', 'common', 'uncommon', 'rare', 'epic', 'legendary'];
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

    const rarityOrder: GemRarity[] = ['new_discovery', 'common', 'uncommon', 'rare', 'epic', 'legendary'];
    const rarityIndex = rarityOrder.indexOf(rarity);
    const maxIndex = rarityOrder.indexOf(maxGemRarity);

    return rarityOrder[Math.min(rarityIndex, maxIndex)];
  }
  
  /**
   * Get XP value for a gem rarity (Mastery Gems)
   */
  static getXPValue(rarity: GemRarity): number {
    return GEM_TYPES[rarity].points;
  }

  /**
   * Get XP value for Activity Gems
   */
  static getActivityGemXP(rarity: GemRarity): number {
    return ACTIVITY_GEM_XP[rarity];
  }

  /**
   * Get XP value for Grammar Gems
   */
  static getGrammarGemXP(rarity: GemRarity): number {
    return GRAMMAR_GEM_XP[rarity];
  }

  /**
   * Calculate Activity Gem rarity based on performance
   * Activity Gems are immediate rewards with simpler logic
   */
  static calculateActivityGemRarity(
    gameType: string,
    context: PerformanceContext
  ): GemRarity {
    const config = GAME_CONFIGS[gameType] || GAME_CONFIGS.default;

    // Start with common (standard correct answer)
    let rarity: GemRarity = 'common';

    // Performance bonuses for Activity Gems
    if (context.streakCount >= 5) {
      rarity = 'rare'; // Perfect streak bonus
    } else if (context.responseTimeMs <= config.speedThresholds.fast) {
      rarity = 'rare'; // Fast response bonus
    } else if (context.responseTimeMs <= config.speedThresholds.normal && context.streakCount >= 2) {
      rarity = 'uncommon'; // Good performance with some streak
    }

    // Mode bonuses (smaller than Mastery Gems)
    if ((config.typingBonus && context.isTypingMode) ||
        (config.dictationBonus && context.isDictationMode)) {
      if (rarity === 'common') rarity = 'uncommon';
      else if (rarity === 'uncommon') rarity = 'rare';
    }

    return rarity;
  }

  /**
   * Calculate Grammar Gem rarity based on conjugation performance
   * Grammar Gems reward grammatical skill demonstration
   */
  static calculateGrammarGemRarity(
    gameType: string,
    context: PerformanceContext
  ): GemRarity {
    const config = GAME_CONFIGS[gameType] || GAME_CONFIGS.default;

    // Check if this is a first-time conjugation of this verb
    if (context.isFirstTime) {
      return 'new_discovery'; // First correct conjugation of any verb
    }

    // Start with base rarity based on verb type and tense complexity
    let rarity: GemRarity = this.getBaseGrammarRarity(context);

    // If hint was used, cap at common
    if (context.hintUsed) {
      return 'common';
    }

    // Speed-based upgrades (grammar requires more thinking time)
    if (context.responseTimeMs <= config.speedThresholds.fast) {
      rarity = this.upgradeRarity(rarity); // Fast grammar response is impressive
    }

    // Streak-based upgrades (grammar streaks are harder to maintain)
    if (context.streakCount >= config.streakThresholds.legendary) {
      rarity = 'legendary';
    } else if (context.streakCount >= config.streakThresholds.epic) {
      rarity = this.upgradeRarity(rarity);
    }

    // Complexity bonus - harder grammar gets better rewards
    if (context.complexityScore && context.complexityScore >= 4) {
      rarity = this.upgradeRarity(rarity); // Complex tenses/irregular verbs
    }

    return rarity;
  }

  /**
   * Get base Grammar Gem rarity based on verb type and tense
   */
  private static getBaseGrammarRarity(context: PerformanceContext): GemRarity {
    // Irregular verbs are inherently more difficult
    if (context.verbType === 'irregular') {
      return 'uncommon'; // Start higher for irregular verbs
    }

    // Stem-changing verbs are moderately difficult
    if (context.verbType === 'stem_changing') {
      return 'uncommon';
    }

    // Complex tenses deserve higher base rarity
    const complexTenses = ['preterite', 'imperfect', 'conditional', 'subjunctive', 'future'];
    if (context.tense && complexTenses.includes(context.tense.toLowerCase())) {
      return 'uncommon';
    }

    // Regular verbs in simple tenses start at common
    return 'common';
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
    difficultyLevel?: string,
    gemType: GemType = 'mastery',
    grammarData?: {
      conjugationId?: string;
      baseVerbId?: string;
      tense?: string;
      person?: string;
      verbType?: 'regular' | 'irregular' | 'stem_changing';
    }
  ): GemEvent {
    let rarity: GemRarity;
    let xpValue: number;

    // Calculate rarity and XP based on gem type
    switch (gemType) {
      case 'activity':
        rarity = this.calculateActivityGemRarity(gameType, context);
        xpValue = this.getActivityGemXP(rarity);
        break;
      case 'grammar':
        rarity = this.calculateGrammarGemRarity(gameType, context);
        xpValue = this.getGrammarGemXP(rarity);
        break;
      case 'mastery':
      default:
        rarity = this.calculateGemRarity(gameType, context);
        xpValue = this.getXPValue(rarity);
        break;
    }

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
      difficultyLevel,
      gemType,
      // Grammar-specific fields
      conjugationId: grammarData?.conjugationId,
      baseVerbId: grammarData?.baseVerbId,
      tense: grammarData?.tense,
      person: grammarData?.person,
      verbType: grammarData?.verbType
    };
  }

  /**
   * Create an Activity Gem event (immediate performance reward)
   */
  static createActivityGemEvent(
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
    return this.createGemEvent(gameType, context, vocabularyData, gameMode, difficultyLevel, 'activity');
  }

  /**
   * Create a Mastery Gem event (FSRS-driven vocabulary collection)
   */
  static createMasteryGemEvent(
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
    return this.createGemEvent(gameType, context, vocabularyData, gameMode, difficultyLevel, 'mastery');
  }

  /**
   * Create a Grammar Gem event (conjugation mastery reward)
   */
  static createGrammarGemEvent(
    gameType: string,
    context: PerformanceContext,
    vocabularyData: {
      id?: number;
      word?: string;
      translation?: string;
    },
    grammarData: {
      conjugationId?: string;
      baseVerbId?: string;
      tense: string;
      person: string;
      verbType: 'regular' | 'irregular' | 'stem_changing';
    },
    gameMode?: string,
    difficultyLevel?: string
  ): GemEvent {
    return this.createGemEvent(
      gameType,
      context,
      vocabularyData,
      gameMode,
      difficultyLevel,
      'grammar',
      grammarData
    );
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
      new_discovery: 0,
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

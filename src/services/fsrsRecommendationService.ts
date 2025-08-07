// FSRS-Powered Word Recommendation Service
// Provides intelligent word selection based on memory states and learning patterns

import { SupabaseClient } from '@supabase/supabase-js';
import { FSRSService } from './fsrsService';

export interface WordRecommendation {
  wordId: string;
  word: string;
  translation: string;
  language: string;
  priority: number; // 1-10, higher = more urgent
  reason: 'due_review' | 'struggling' | 'new_learning' | 'reinforcement' | 'mastery_check';
  memoryState: {
    difficulty: number;
    stability: number;
    retrievability: number;
    daysSinceLastReview: number;
    reviewCount: number;
  };
  recommendedGameTypes: string[];
  estimatedStudyTime: number; // minutes
}

export interface RecommendationFilters {
  maxWords?: number;
  includeNewWords?: boolean;
  includeReviews?: boolean;
  includeStrugglingWords?: boolean;
  gameType?: string;
  difficultyRange?: [number, number];
  timeAvailable?: number; // minutes
}

export class FSRSRecommendationService {
  private supabase: SupabaseClient;
  private fsrsService: FSRSService;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
    this.fsrsService = new FSRSService(supabase);
  }

  /**
   * Get personalized word recommendations for a student
   */
  async getWordRecommendations(
    studentId: string,
    filters: RecommendationFilters = {}
  ): Promise<WordRecommendation[]> {
    try {
      const {
        maxWords = 20,
        includeNewWords = true,
        includeReviews = true,
        includeStrugglingWords = true,
        gameType,
        difficultyRange = [1, 10],
        timeAvailable = 30
      } = filters;

      // Get student's FSRS data
      const { data: fsrsData, error } = await this.supabase
        .from('vocabulary_gem_collection')
        .select(`
          *,
          centralized_vocabulary!inner(word, translation, language, part_of_speech)
        `)
        .eq('student_id', studentId)
        .not('fsrs_difficulty', 'is', null)
        .gte('fsrs_difficulty', difficultyRange[0])
        .lte('fsrs_difficulty', difficultyRange[1]);

      if (error) throw error;

      const recommendations: WordRecommendation[] = [];
      const now = new Date();

      // Process each word for recommendations
      for (const item of fsrsData || []) {
        const daysSinceLastReview = item.last_reviewed 
          ? Math.floor((now.getTime() - new Date(item.last_reviewed).getTime()) / (1000 * 60 * 60 * 24))
          : 999;

        const retrievability = this.calculateRetrievability(
          item.fsrs_stability || 1,
          daysSinceLastReview
        );

        // Determine recommendation priority and reason
        const recommendation = this.analyzeWordForRecommendation(
          item,
          daysSinceLastReview,
          retrievability,
          gameType
        );

        if (recommendation) {
          recommendations.push(recommendation);
        }
      }

      // Add new words if requested
      if (includeNewWords) {
        const newWords = await this.getNewWordRecommendations(
          studentId,
          Math.min(5, maxWords - recommendations.length),
          difficultyRange
        );
        recommendations.push(...newWords);
      }

      // Sort by priority and apply filters
      const sortedRecommendations = recommendations
        .sort((a, b) => b.priority - a.priority)
        .filter(rec => {
          if (!includeReviews && rec.reason === 'due_review') return false;
          if (!includeStrugglingWords && rec.reason === 'struggling') return false;
          return true;
        });

      // Apply time constraint
      const timeConstrainedRecommendations = this.applyTimeConstraint(
        sortedRecommendations,
        timeAvailable
      );

      return timeConstrainedRecommendations.slice(0, maxWords);

    } catch (error) {
      console.error('Error generating word recommendations:', error);
      return [];
    }
  }

  /**
   * Get game-specific word recommendations
   */
  async getGameSpecificRecommendations(
    studentId: string,
    gameType: string,
    maxWords: number = 10
  ): Promise<WordRecommendation[]> {
    const gameTypeMapping = {
      'vocab-master': ['due_review', 'struggling', 'new_learning'],
      'hangman': ['struggling', 'reinforcement'],
      'memory-game': ['new_learning', 'reinforcement'],
      'detective-listening': ['due_review', 'mastery_check'],
      'conjugation-duel': ['struggling', 'due_review'],
      'speed-builder': ['reinforcement', 'mastery_check']
    };

    const preferredReasons = gameTypeMapping[gameType as keyof typeof gameTypeMapping] || 
                           ['due_review', 'struggling', 'new_learning'];

    const allRecommendations = await this.getWordRecommendations(studentId, {
      maxWords: maxWords * 2, // Get more to filter from
      gameType
    });

    // Prioritize words that match the game type's learning objectives
    return allRecommendations
      .filter(rec => preferredReasons.includes(rec.reason))
      .slice(0, maxWords);
  }

  /**
   * Calculate current retrievability based on FSRS algorithm
   */
  private calculateRetrievability(stability: number, daysSinceReview: number): number {
    // FSRS retrievability formula: R = exp(-t/S)
    return Math.exp(-daysSinceReview / stability);
  }

  /**
   * Analyze a word to determine if it should be recommended
   */
  private analyzeWordForRecommendation(
    item: any,
    daysSinceLastReview: number,
    retrievability: number,
    gameType?: string
  ): WordRecommendation | null {
    const difficulty = item.fsrs_difficulty || 5;
    const stability = item.fsrs_stability || 1;
    const reviewCount = item.review_count || 0;

    let priority = 0;
    let reason: WordRecommendation['reason'] = 'reinforcement';

    // Due for review (high priority)
    if (retrievability < 0.8 && daysSinceLastReview >= stability * 0.8) {
      priority = 8 + (1 - retrievability) * 2; // 8-10 priority
      reason = 'due_review';
    }
    // Struggling words (high difficulty, low stability)
    else if (difficulty > 7 && stability < 3) {
      priority = 7 + (difficulty - 7) * 0.5; // 7-8.5 priority
      reason = 'struggling';
    }
    // Mastery check for well-learned words
    else if (stability > 30 && retrievability > 0.9 && daysSinceLastReview > 7) {
      priority = 4 + Math.min(2, stability / 30); // 4-6 priority
      reason = 'mastery_check';
    }
    // Reinforcement for moderately learned words
    else if (reviewCount >= 3 && retrievability > 0.7 && retrievability < 0.9) {
      priority = 3 + retrievability * 2; // 3-5 priority
      reason = 'reinforcement';
    }
    else {
      return null; // Not recommended at this time
    }

    // Adjust priority based on game type suitability
    const recommendedGameTypes = this.getRecommendedGameTypes(difficulty, stability, reason);
    if (gameType && !recommendedGameTypes.includes(gameType)) {
      priority *= 0.7; // Reduce priority if not ideal for requested game type
    }

    return {
      wordId: item.vocabulary_item_id,
      word: item.centralized_vocabulary.word,
      translation: item.centralized_vocabulary.translation,
      language: item.centralized_vocabulary.language,
      priority: Math.round(priority * 10) / 10,
      reason,
      memoryState: {
        difficulty,
        stability,
        retrievability: Math.round(retrievability * 100) / 100,
        daysSinceLastReview,
        reviewCount
      },
      recommendedGameTypes,
      estimatedStudyTime: this.estimateStudyTime(difficulty, reason)
    };
  }

  /**
   * Get new word recommendations for learning
   */
  private async getNewWordRecommendations(
    studentId: string,
    maxWords: number,
    difficultyRange: [number, number]
  ): Promise<WordRecommendation[]> {
    try {
      // Get words not yet learned by the student
      const { data: newWords, error } = await this.supabase
        .from('centralized_vocabulary')
        .select('*')
        .not('id', 'in', 
          this.supabase
            .from('vocabulary_gem_collection')
            .select('vocabulary_item_id')
            .eq('student_id', studentId)
        )
        .limit(maxWords);

      if (error) throw error;

      return (newWords || []).map(word => ({
        wordId: word.id,
        word: word.word,
        translation: word.translation,
        language: word.language,
        priority: 6, // Medium priority for new words
        reason: 'new_learning' as const,
        memoryState: {
          difficulty: 5, // Default difficulty for new words
          stability: 0,
          retrievability: 0,
          daysSinceLastReview: 0,
          reviewCount: 0
        },
        recommendedGameTypes: ['vocab-master', 'memory-game', 'hangman'],
        estimatedStudyTime: 3
      }));

    } catch (error) {
      console.error('Error getting new word recommendations:', error);
      return [];
    }
  }

  /**
   * Get recommended game types based on word characteristics
   */
  private getRecommendedGameTypes(
    difficulty: number,
    stability: number,
    reason: WordRecommendation['reason']
  ): string[] {
    const gameTypes: string[] = [];

    // High difficulty words benefit from focused practice
    if (difficulty > 7) {
      gameTypes.push('vocab-master', 'hangman', 'conjugation-duel');
    }

    // Low stability words need reinforcement
    if (stability < 5) {
      gameTypes.push('memory-game', 'word-scramble', 'speed-builder');
    }

    // Well-learned words can handle complex games
    if (stability > 15) {
      gameTypes.push('detective-listening', 'case-file-translator', 'sentence-towers');
    }

    // Reason-based recommendations
    switch (reason) {
      case 'due_review':
        gameTypes.push('vocab-master', 'detective-listening');
        break;
      case 'struggling':
        gameTypes.push('hangman', 'memory-game', 'vocab-master');
        break;
      case 'new_learning':
        gameTypes.push('vocab-master', 'memory-game', 'word-scramble');
        break;
      case 'reinforcement':
        gameTypes.push('speed-builder', 'noughts-and-crosses', 'word-blast');
        break;
      case 'mastery_check':
        gameTypes.push('detective-listening', 'case-file-translator', 'conjugation-duel');
        break;
    }

    return [...new Set(gameTypes)]; // Remove duplicates
  }

  /**
   * Estimate study time needed for a word
   */
  private estimateStudyTime(difficulty: number, reason: WordRecommendation['reason']): number {
    const baseTime = {
      'due_review': 2,
      'struggling': 5,
      'new_learning': 3,
      'reinforcement': 2,
      'mastery_check': 1
    };

    const difficultyMultiplier = 1 + (difficulty - 5) * 0.2; // 0.2 to 1.8 multiplier
    return Math.round(baseTime[reason] * difficultyMultiplier);
  }

  /**
   * Apply time constraint to recommendations
   */
  private applyTimeConstraint(
    recommendations: WordRecommendation[],
    timeAvailable: number
  ): WordRecommendation[] {
    const result: WordRecommendation[] = [];
    let totalTime = 0;

    for (const rec of recommendations) {
      if (totalTime + rec.estimatedStudyTime <= timeAvailable) {
        result.push(rec);
        totalTime += rec.estimatedStudyTime;
      }
    }

    return result;
  }
}

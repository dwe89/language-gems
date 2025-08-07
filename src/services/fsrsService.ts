// FSRS (Free Spaced Repetition Scheduler) Service for LanguageGems
// Based on the FSRS algorithm - a modern, efficient alternative to SuperMemo SM-2
// Optimized for 11-16 year old students with invisible complexity

import { SupabaseClient } from '@supabase/supabase-js';

// ============================================================================
// FSRS CORE INTERFACES
// ============================================================================

export interface FSRSParameters {
  // 19 parameters learned from spaced repetition research
  w: number[];
  requestRetention: number;  // Target retention rate (0.9 = 90%)
  maximumInterval: number;   // Max days between reviews (365)
  enableFuzz: boolean;       // Add randomness to intervals
  decayFactor: number;       // Memory decay rate (-0.5)
  factorFactor: number;      // Difficulty adjustment (1.9)
}

export interface FSRSCard {
  // Three-component memory model
  difficulty: number;        // D: How hard this word is for this student (1-10)
  stability: number;         // S: How long the memory will last (days)
  retrievability: number;    // R: Current probability of recall (0-1)

  // Review tracking
  lastReview: Date;
  reviewCount: number;
  lapseCount: number;        // Number of times forgotten
  state: 'new' | 'learning' | 'review' | 'relearning';

  // Metadata
  vocabularyId: string;      // UUID reference to centralized_vocabulary
  studentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FSRSReviewResult {
  card: FSRSCard;
  nextReviewDate: Date;
  interval: number;          // Days until next review
  studyTime: number;         // Estimated study time in seconds
  confidence: number;        // Algorithm confidence (0-1)
}

export interface FSRSGrade {
  AGAIN: 1;    // Incorrect/forgot - needs immediate review
  HARD: 2;     // Correct but difficult - shorter interval
  GOOD: 3;     // Correct with normal effort - standard interval
  EASY: 4;     // Correct and easy - longer interval
}

// Grade constants for easy reference
export const FSRS_GRADES: FSRSGrade = {
  AGAIN: 1,
  HARD: 2,
  GOOD: 3,
  EASY: 4
};

// ============================================================================
// FSRS SERVICE CLASS
// ============================================================================

export class FSRSService {
  private parameters: FSRSParameters;

  constructor(private supabase: SupabaseClient) {
    this.parameters = this.getOptimizedParameters();
  }

  /**
   * Get optimized FSRS parameters for language learning
   * These parameters are tuned for vocabulary acquisition in 11-16 year olds
   */
  private getOptimizedParameters(): FSRSParameters {
    return {
      // Optimized weights for vocabulary learning (based on FSRS research)
      w: [
        0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0234, 1.616,
        0.1544, 1.0824, 1.9813, 0.0953, 0.2975, 2.2042, 0.2407, 2.9466, 0.5034, 0.6567
      ],
      requestRetention: 0.9,      // 90% retention target
      maximumInterval: 365,       // Max 1 year between reviews
      enableFuzz: true,           // Add slight randomness
      decayFactor: -0.5,          // Standard decay rate
      factorFactor: 1.9           // Difficulty adjustment factor
    };
  }

  /**
   * Convert game performance to FSRS grade
   * This function makes FSRS invisible to students - they just play games
   */
  convertGamePerformanceToGrade(
    correct: boolean,
    responseTime: number,
    confidence?: number,
    previousDifficulty?: number
  ): number {
    if (!correct) {
      return FSRS_GRADES.AGAIN;
    }

    // Use response time and confidence to determine difficulty level
    // Faster responses with high confidence = easier
    // Slower responses or low confidence = harder

    const timeThresholds = {
      veryFast: 1500,   // < 1.5 seconds
      fast: 3000,       // < 3 seconds
      normal: 6000,     // < 6 seconds
      slow: 10000       // < 10 seconds
    };

    const confidenceScore = confidence || 0.5; // Default neutral confidence
    const difficultyBonus = previousDifficulty ? (10 - previousDifficulty) / 10 : 0.5;

    // Calculate composite ease score
    let easeScore = 0;

    // Time component (40% weight)
    if (responseTime < timeThresholds.veryFast) {
      easeScore += 0.4;
    } else if (responseTime < timeThresholds.fast) {
      easeScore += 0.3;
    } else if (responseTime < timeThresholds.normal) {
      easeScore += 0.2;
    } else if (responseTime < timeThresholds.slow) {
      easeScore += 0.1;
    }

    // Confidence component (30% weight)
    easeScore += confidenceScore * 0.3;

    // Previous difficulty component (30% weight)
    easeScore += difficultyBonus * 0.3;

    // Map ease score to FSRS grade
    if (easeScore >= 0.75) return FSRS_GRADES.EASY;
    if (easeScore >= 0.5) return FSRS_GRADES.GOOD;
    return FSRS_GRADES.HARD;
  }

  /**
   * Calculate memory state using FSRS algorithm
   * This is the core FSRS calculation
   */
  calculateMemoryState(card: FSRSCard, grade: number, elapsed: number): FSRSCard {
    const { w } = this.parameters;

    // Calculate new difficulty
    let newDifficulty = card.difficulty;
    if (card.state === 'new') {
      newDifficulty = w[4] - Math.exp(w[5] * (grade - 1)) + 1;
    } else {
      newDifficulty = card.difficulty - w[6] * (grade - 3);
    }

    // Clamp difficulty between 1 and 10
    newDifficulty = Math.max(1, Math.min(10, newDifficulty));

    // Calculate new stability
    let newStability: number;

    if (card.state === 'new') {
      // Initial stability for new cards
      newStability = w[grade - 1];
    } else if (card.state === 'review' || card.state === 'relearning') {
      if (grade === FSRS_GRADES.AGAIN) {
        // Lapse - reduce stability
        newStability = w[11] * Math.pow(card.difficulty, -w[12]) *
                      (Math.pow(card.stability + 1, w[13]) - 1) *
                      Math.exp(w[14] * (1 - card.retrievability));
      } else {
        // Successful review - increase stability
        const successFactor = w[8] * Math.exp(w[9] * (grade - 3)) *
                              Math.pow(card.difficulty, -w[10]) *
                              (Math.pow(card.stability, -w[11]) - 1);
        newStability = card.stability * (1 + successFactor);
      }
    } else {
      newStability = card.stability;
    }

    // Calculate retrievability at review time
    const retrievability = Math.exp(Math.log(0.9) * elapsed / card.stability);

    // Determine new state
    let newState: FSRSCard['state'];
    if (card.state === 'new') {
      newState = grade === FSRS_GRADES.AGAIN ? 'learning' : 'review';
    } else if (grade === FSRS_GRADES.AGAIN) {
      newState = 'relearning';
    } else {
      newState = 'review';
    }

    // Update review and lapse counts
    const newReviewCount = card.reviewCount + 1;
    const newLapseCount = card.lapseCount + (grade === FSRS_GRADES.AGAIN ? 1 : 0);

    return {
      ...card,
      difficulty: newDifficulty,
      stability: newStability,
      retrievability,
      reviewCount: newReviewCount,
      lapseCount: newLapseCount,
      state: newState,
      lastReview: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Schedule next review date based on FSRS algorithm
   */
  scheduleNextReview(card: FSRSCard): Date {
    const { requestRetention, maximumInterval, enableFuzz } = this.parameters;

    // Calculate optimal interval for target retention
    let interval = card.stability * (Math.log(requestRetention) / Math.log(0.9));

    // Apply maximum interval limit
    interval = Math.min(interval, maximumInterval);

    // Ensure minimum interval of 1 day for review cards
    if (card.state === 'review' && interval < 1) {
      interval = 1;
    }

    // Add fuzz to prevent review clustering
    if (enableFuzz && interval > 1) {
      const fuzzRange = Math.max(1, Math.min(0.25 * interval, 4));
      const fuzz = (Math.random() - 0.5) * 2 * fuzzRange;
      interval = Math.max(1, interval + fuzz);
    }

    // Calculate next review date
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + Math.round(interval));

    return nextReview;
  }

  /**
   * Estimate study time for a word based on difficulty and state
   */
  estimateStudyTime(card: FSRSCard): number {
    // Base study time in seconds
    let baseTime = 30;

    // Adjust based on difficulty (1-10 scale)
    const difficultyMultiplier = 0.5 + (card.difficulty / 10) * 1.5; // 0.6x to 2.0x

    // Adjust based on state
    const stateMultipliers = {
      'new': 1.5,        // New words take longer
      'learning': 1.2,   // Learning words need more time
      'review': 1.0,     // Standard review time
      'relearning': 1.3  // Relearning takes extra time
    };

    const stateMultiplier = stateMultipliers[card.state] || 1.0;

    // Adjust based on lapse count (more lapses = more time needed)
    const lapseMultiplier = 1 + (card.lapseCount * 0.1);

    return Math.round(baseTime * difficultyMultiplier * stateMultiplier * lapseMultiplier);
  }

  /**
   * Get or create FSRS card for a vocabulary word
   */
  async getOrCreateCard(studentId: string, vocabularyId: string): Promise<FSRSCard> {
    try {
      // Try to get existing card from vocabulary_gem_collection
      const { data: existingCard } = await this.supabase
        .from('vocabulary_gem_collection')
        .select('*')
        .eq('student_id', studentId)
        .eq('vocabulary_item_id', vocabularyId)
        .single();

      if (existingCard) {
        // Convert existing SM-2 data to FSRS format
        return this.convertSM2ToFSRS(existingCard);
      } else {
        // Create new FSRS card
        return this.createNewCard(studentId, vocabularyId);
      }
    } catch (error) {
      console.error('Error getting/creating FSRS card:', error);
      // Return default new card on error
      return this.createNewCard(studentId, vocabularyId);
    }
  }

  /**
   * Convert existing SM-2 data to FSRS format
   * This enables smooth transition from SM-2 to FSRS
   */
  private convertSM2ToFSRS(sm2Data: any): FSRSCard {
    const now = new Date();

    // Convert SM-2 ease factor and interval to FSRS difficulty and stability
    const easeFactor = sm2Data.spaced_repetition_ease_factor || 2.5;
    const interval = sm2Data.spaced_repetition_interval || 1;
    const repetitions = sm2Data.correct_encounters || 0;

    // Map SM-2 ease factor to FSRS difficulty (inverse relationship)
    // Higher ease factor = lower difficulty
    const difficulty = Math.max(1, Math.min(10, 11 - (easeFactor * 3)));

    // Map SM-2 interval to FSRS stability
    const stability = Math.max(0.1, interval);

    // Estimate retrievability based on time since last review
    const lastReview = sm2Data.last_encountered_at ? new Date(sm2Data.last_encountered_at) : now;
    const daysSinceReview = (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24);
    const retrievability = Math.max(0.1, Math.exp(Math.log(0.9) * daysSinceReview / stability));

    // Determine state based on SM-2 data
    let state: FSRSCard['state'] = 'new';
    if (repetitions === 0) {
      state = 'new';
    } else if (repetitions < 3) {
      state = 'learning';
    } else {
      state = 'review';
    }

    return {
      difficulty,
      stability,
      retrievability,
      lastReview,
      reviewCount: repetitions,
      lapseCount: sm2Data.incorrect_encounters || 0,
      state,
      vocabularyId: sm2Data.vocabulary_item_id,
      studentId: sm2Data.student_id,
      createdAt: sm2Data.first_learned_at ? new Date(sm2Data.first_learned_at) : now,
      updatedAt: now
    };
  }

  /**
   * Create a new FSRS card for a vocabulary word
   */
  private createNewCard(studentId: string, vocabularyId: string): FSRSCard {
    const now = new Date();

    return {
      difficulty: 5.0,           // Default difficulty (middle of 1-10 scale)
      stability: 1.0,            // Initial stability (1 day)
      retrievability: 1.0,       // Perfect initial retrievability
      lastReview: now,
      reviewCount: 0,
      lapseCount: 0,
      state: 'new',
      vocabularyId,
      studentId,
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Update student progress using FSRS algorithm
   * This is the main method called by games
   */
  async updateProgress(
    studentId: string,
    vocabularyId: string,
    correct: boolean,
    responseTime: number = 3000,
    confidence?: number
  ): Promise<FSRSReviewResult> {
    try {
      // Get or create FSRS card
      const card = await this.getOrCreateCard(studentId, vocabularyId);

      // Convert game performance to FSRS grade
      const grade = this.convertGamePerformanceToGrade(
        correct,
        responseTime,
        confidence,
        card.difficulty
      );

      // Calculate elapsed time since last review
      const elapsed = (Date.now() - card.lastReview.getTime()) / (1000 * 60 * 60 * 24);

      // Update memory state using FSRS algorithm
      const updatedCard = this.calculateMemoryState(card, grade, elapsed);

      // Schedule next review
      const nextReviewDate = this.scheduleNextReview(updatedCard);

      // Calculate interval and study time
      const interval = Math.round((nextReviewDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const studyTime = this.estimateStudyTime(updatedCard);

      // Save updated card to database
      await this.saveCard(updatedCard, nextReviewDate);

      // Calculate algorithm confidence based on stability and retrievability
      const confidence_score = Math.min(1.0, updatedCard.stability * updatedCard.retrievability / 10);

      return {
        card: updatedCard,
        nextReviewDate,
        interval: Math.max(1, interval),
        studyTime,
        confidence: confidence_score
      };

    } catch (error) {
      console.error('Error updating FSRS progress:', error);
      throw error;
    }
  }

  /**
   * Save FSRS card data to database
   * Updates the vocabulary_gem_collection table with FSRS data
   */
  private async saveCard(card: FSRSCard, nextReviewDate: Date): Promise<void> {
    try {
      // Prepare data for vocabulary_gem_collection table
      const cardData = {
        student_id: card.studentId,
        vocabulary_item_id: card.vocabularyId,

        // FSRS-specific fields (will be added by migration)
        fsrs_difficulty: card.difficulty,
        fsrs_stability: card.stability,
        fsrs_retrievability: card.retrievability,
        fsrs_last_review: card.lastReview.toISOString(),
        fsrs_review_count: card.reviewCount,
        fsrs_lapse_count: card.lapseCount,
        fsrs_state: card.state,

        // Legacy fields for backward compatibility
        total_encounters: card.reviewCount,
        correct_encounters: card.reviewCount - card.lapseCount,
        incorrect_encounters: card.lapseCount,
        last_encountered_at: card.lastReview.toISOString(),
        next_review_at: nextReviewDate.toISOString(),

        // Convert FSRS data back to SM-2 format for compatibility
        spaced_repetition_interval: Math.round(card.stability),
        spaced_repetition_ease_factor: Math.max(1.3, Math.min(3.0, 4.0 - (card.difficulty / 10) * 2.7)),

        // Update mastery level based on FSRS state
        mastery_level: this.calculateMasteryLevel(card),

        // Update timestamps
        updated_at: new Date().toISOString()
      };

      // Upsert the card data with proper conflict resolution
      const { error } = await this.supabase
        .from('vocabulary_gem_collection')
        .upsert(cardData, {
          onConflict: 'student_id,vocabulary_item_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('FSRS saveCard error:', error);
        console.error('Card data:', cardData);
        throw error;
      }

    } catch (error) {
      console.error('Error saving FSRS card:', error);
      throw error;
    }
  }

  /**
   * Calculate mastery level based on FSRS card state
   */
  private calculateMasteryLevel(card: FSRSCard): number {
    // Map FSRS state and metrics to mastery level (0-5)
    if (card.state === 'new') return 0;
    if (card.state === 'learning') return 1;
    if (card.state === 'relearning') return 2;

    // For review state, use stability and difficulty
    if (card.stability >= 30 && card.difficulty <= 3) return 5; // Mastered
    if (card.stability >= 14 && card.difficulty <= 5) return 4; // Advanced
    if (card.stability >= 7 && card.difficulty <= 7) return 3;  // Intermediate
    return 2; // Basic
  }

  /**
   * Get words due for review
   */
  async getWordsForReview(studentId: string, limit: number = 20): Promise<FSRSCard[]> {
    try {
      const { data, error } = await this.supabase
        .from('vocabulary_gem_collection')
        .select(`
          *,
          centralized_vocabulary!inner(word, translation, language)
        `)
        .eq('student_id', studentId)
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return data?.map(item => this.convertSM2ToFSRS(item)) || [];
    } catch (error) {
      console.error('Error getting words for review:', error);
      return [];
    }
  }
}
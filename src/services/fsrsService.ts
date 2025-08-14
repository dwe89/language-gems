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

    const updatedCard = {
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

    // 🔍 INSTRUMENTATION: Debug card vocabulary ID preservation
    console.log('🔍 [FSRS CALC] calculateMemoryState result:', {
      inputCardVocabId: card.vocabularyId,
      inputCardStudentId: card.studentId,
      outputCardVocabId: updatedCard.vocabularyId,
      outputCardStudentId: updatedCard.studentId,
      hasVocabId: !!updatedCard.vocabularyId,
      hasStudentId: !!updatedCard.studentId
    });

    return updatedCard;
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
      // 🔍 INSTRUMENTATION: Debug getOrCreateCard input
      console.log('🔍 [FSRS GET] getOrCreateCard called with:', {
        studentId,
        vocabularyId,
        vocabularyIdType: typeof vocabularyId,
        hasVocabId: !!vocabularyId,
        hasStudentId: !!studentId
      });

      // Try to get existing card from vocabulary_gem_collection using both ID systems
      // First try centralized vocabulary ID
      let existingCard = null;

      const { data: centralizedData } = await this.supabase
        .from('vocabulary_gem_collection')
        .select('*')
        .eq('student_id', studentId)
        .eq('centralized_vocabulary_id', vocabularyId)
        .maybeSingle();

      if (centralizedData) {
        existingCard = centralizedData;
      } else {
        // Try legacy vocabulary_item_id
        const { data: legacyData } = await this.supabase
          .from('vocabulary_gem_collection')
          .select('*')
          .eq('student_id', studentId)
          .eq('vocabulary_item_id', vocabularyId)
          .maybeSingle();

        existingCard = legacyData;
      }

      if (existingCard) {
        // Convert existing SM-2 data to FSRS format
        return this.convertSM2ToFSRS(existingCard);
      } else {
        // Create new FSRS card
        console.log('🔍 [FSRS GET] No existing card found, creating new card');
        const newCard = this.createNewCard(studentId, vocabularyId);
        console.log('🔍 [FSRS GET] New card created:', {
          vocabularyId: newCard.vocabularyId,
          studentId: newCard.studentId,
          hasVocabId: !!newCard.vocabularyId,
          hasStudentId: !!newCard.studentId
        });
        return newCard;
      }
    } catch (error) {
      console.error('🚨 [FSRS GET] Error getting/creating FSRS card:', error);
      // Return default new card on error
      console.log('🔍 [FSRS GET] Error occurred, creating fallback card');
      const fallbackCard = this.createNewCard(studentId, vocabularyId);
      console.log('🔍 [FSRS GET] Fallback card created:', {
        vocabularyId: fallbackCard.vocabularyId,
        studentId: fallbackCard.studentId,
        hasVocabId: !!fallbackCard.vocabularyId,
        hasStudentId: !!fallbackCard.studentId
      });
      return fallbackCard;
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

    // Handle both ID systems - prioritize centralized_vocabulary_id
    const vocabularyId = sm2Data.centralized_vocabulary_id || sm2Data.vocabulary_item_id;

    return {
      difficulty,
      stability,
      retrievability,
      lastReview,
      reviewCount: repetitions,
      lapseCount: sm2Data.incorrect_encounters || 0,
      state,
      vocabularyId,
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
      // 🔍 INSTRUMENTATION: Debug vocabulary ID received by FSRS
      console.log('🔍 [FSRS SERVICE] updateProgress called with:', {
        studentId,
        vocabularyId,
        vocabularyIdType: typeof vocabularyId,
        vocabularyIdValue: vocabularyId,
        correct,
        responseTime,
        confidence
      });
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
   * Updates the vocabulary_gem_collection table with FSRS data using atomic operations
   */
  private async saveCard(card: FSRSCard, nextReviewDate: Date): Promise<void> {
    try {
      // 🔍 INSTRUMENTATION: Debug saveCard input
      console.log('🔍 [FSRS SAVE] saveCard called with:', {
        cardVocabId: card.vocabularyId,
        cardStudentId: card.studentId,
        cardVocabIdType: typeof card.vocabularyId,
        cardStudentIdType: typeof card.studentId,
        hasVocabId: !!card.vocabularyId,
        hasStudentId: !!card.studentId,
        cardKeys: Object.keys(card)
      });

      // Use atomic function to prevent race conditions
      // CRITICAL: This prevents the negative values bug
      let vocabularyItemId = null;
      let centralizedVocabularyId = null;

      if (typeof card.vocabularyId === 'string' && card.vocabularyId.includes('-')) {
        // UUID format - use centralized_vocabulary_id
        centralizedVocabularyId = card.vocabularyId;
      } else {
        // Integer format - use legacy vocabulary_item_id
        vocabularyItemId = card.vocabularyId;
      }

      // ✅ FIX: Use the original correct parameter, don't derive from card state
      const wasCorrect = correct;

      console.log('🔍 [FSRS SAVE] Using atomic function:', {
        studentId: card.studentId,
        vocabularyItemId,
        centralizedVocabularyId,
        wasCorrect,
        reviewCount: card.reviewCount,
        lapseCount: card.lapseCount
      });

      // Use atomic database function to prevent race conditions
      const { data, error } = await this.supabase.rpc('update_vocabulary_gem_collection_atomic', {
        p_student_id: card.studentId,
        p_vocabulary_item_id: vocabularyItemId,
        p_centralized_vocabulary_id: centralizedVocabularyId,
        p_was_correct: wasCorrect
      });

      if (error) {
        console.error('FSRS saveCard atomic function error:', error);
        throw error;
      }

      // Now update FSRS-specific fields in a separate operation
      // The atomic function returns a single object, not an array
      if (data) {
        const recordId = data.id;
        
        const fsrsData = {
          algorithm_version: 'fsrs',
          fsrs_difficulty: card.difficulty,
          fsrs_stability: card.stability,
          fsrs_retrievability: card.retrievability,
          fsrs_last_review: card.lastReview.toISOString(),
          fsrs_review_count: card.reviewCount,
          fsrs_lapse_count: card.lapseCount,
          fsrs_state: card.state,
          next_review_at: nextReviewDate.toISOString(),
          spaced_repetition_interval: Math.max(1, Math.min(365, Math.round(card.stability))),
          spaced_repetition_ease_factor: Math.max(1.3, Math.min(3.0, 4.0 - (card.difficulty / 10) * 2.7)),
          mastery_level: this.calculateMasteryLevel(card),
          updated_at: new Date().toISOString()
        };

        const { error: fsrsError } = await this.supabase
          .from('vocabulary_gem_collection')
          .update(fsrsData)
          .eq('id', recordId);

        if (fsrsError) {
          console.error('FSRS saveCard FSRS data update error:', fsrsError);
          // Don't throw here - the base data was saved successfully
        }
      }

      console.log('✅ FSRS card saved successfully using atomic function:', {
        vocabularyId: card.vocabularyId,
        studentId: card.studentId,
        state: card.state,
        difficulty: card.difficulty,
        stability: card.stability,
        lapseCount: card.lapseCount,
        reviewCount: card.reviewCount
      });

    } catch (error) {
      console.error('Error in FSRS saveCard:', error);
      throw error;
    }
  }

  /**
   * Calculate mastery level based on FSRS card state
   */
  private calculateMasteryLevel(card: FSRSCard): number {
    // SIMPLIFIED PROGRESSION SYSTEM:
    // Level 0: "New discovery" - First correct answer (reviewCount = 1, lapseCount = 0)
    // Level 1: "Common gem" - Second correct answer or basic performance
    // Level 2: "Uncommon gem" - Consistent performance (3+ reviews)
    // Level 3: "Rare gem" - Strong performance (high stability)
    // Level 4: "Epic gem" - Excellent performance
    // Level 5: "Legendary gem" - Mastered

    // Convert to numbers to handle any type issues
    const reviewCount = Number(card.reviewCount);
    const lapseCount = Number(card.lapseCount);
    const stability = Number(card.stability);
    const difficulty = Number(card.difficulty);

    // Words that haven't been answered correctly yet
    if (card.state === 'new') {
      return 0; // Use 0 instead of -1 (database constraint doesn't allow negative)
    }

    if (card.state === 'learning' && lapseCount > 0) {
      return 0; // Wrong first attempt - use 0 instead of -1
    }

    // EXPLICIT CHECK: First correct answer = "New discovery" (Level 0)
    if (reviewCount === 1 && lapseCount === 0) {
      return 0; // ✅ NEW DISCOVERY - First correct answer
    }

    // Relearning after lapses
    if (card.state === 'relearning') {
      return 0; // Back to discovery after forgetting
    }

    // Progressive mastery based on review count and stability
    if (stability >= 30 && difficulty <= 3) {
      return 5; // Legendary - Mastered
    }
    if (stability >= 14 && difficulty <= 5) {
      return 4; // Epic - Advanced
    }
    if (stability >= 7 && difficulty <= 7) {
      return 3;  // Rare - Intermediate
    }
    if (reviewCount >= 3) {
      return 2;  // Uncommon - Consistent (3+ reviews)
    }

    return 1; // Common gem - Basic review level
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
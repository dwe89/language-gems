// Unified Spaced Repetition Hook for LanguageGems
// Supports both SM-2 (legacy) and FSRS (modern) algorithms
// Provides seamless transition between algorithms

import { useState, useCallback } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { supabaseBrowser } from '../components/auth/AuthProvider';
import { SpacedRepetitionService } from '../services/spacedRepetitionService';
import { FSRSService } from '../services/fsrsService';

// ============================================================================
// INTERFACES
// ============================================================================

export interface UnifiedSpacedRepetitionResult {
  success: boolean;
  algorithm: 'sm2' | 'fsrs';
  points: number;
  gemType?: string;
  upgraded?: boolean;
  nextReviewDate: Date;
  interval: number;
  confidence: number;
  masteryLevel: number;
  error?: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  language?: string;
  category?: string;
  difficulty?: number;
}

// ============================================================================
// UNIFIED SPACED REPETITION HOOK
// ============================================================================

export const useUnifiedSpacedRepetition = (gameType: string) => {
  const { user } = useAuth();
  const [algorithm, setAlgorithm] = useState<'sm2' | 'fsrs'>('fsrs'); // Default to FSRS
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize services
  const [sm2Service] = useState(() => new SpacedRepetitionService(supabaseBrowser));
  const [fsrsService] = useState(() => new FSRSService(supabaseBrowser));

  /**
   * Record word practice using the selected algorithm
   * This is the main method called by games
   */
  const recordWordPractice = useCallback(async (
    word: VocabularyWord,
    correct: boolean,
    responseTime: number = 3000,
    confidence?: number
  ): Promise<UnifiedSpacedRepetitionResult | null> => {
    if (!user?.id) {
      console.warn('No user ID available for spaced repetition');
      return null;
    }

    if (isProcessing) {
      console.warn('Already processing spaced repetition request');
      return null;
    }

    setIsProcessing(true);

    try {
      // Determine which algorithm to use
      const useAlgorithm = await determineAlgorithm(user.id, word.id);

      if (useAlgorithm === 'fsrs') {
        return await recordWithFSRS(word, correct, responseTime, confidence);
      } else {
        return await recordWithSM2(word, correct, responseTime);
      }

    } catch (error) {
      console.error('Error recording word practice:', error);
      return {
        success: false,
        algorithm,
        points: 0,
        nextReviewDate: new Date(),
        interval: 1,
        confidence: 0,
        masteryLevel: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setIsProcessing(false);
    }
  }, [user?.id, algorithm, isProcessing]);

  /**
   * Determine which algorithm to use for a specific word
   * FSRS for new words, SM-2 for existing SM-2 data (until migrated)
   */
  const determineAlgorithm = async (userId: string, vocabularyId: string): Promise<'sm2' | 'fsrs'> => {
    try {
      // Check if word already has data in vocabulary_gem_collection
      const { data: existingData } = await supabaseBrowser
        .from('vocabulary_gem_collection')
        .select('algorithm_version, fsrs_difficulty')
        .eq('student_id', userId)
        .eq('vocabulary_item_id', vocabularyId)
        .single();

      if (existingData) {
        // Use existing algorithm or default to FSRS
        return existingData.algorithm_version || 'fsrs';
      } else {
        // New word - use FSRS
        return 'fsrs';
      }
    } catch (error) {
      // Default to FSRS for new words
      return 'fsrs';
    }
  };

  /**
   * Record practice using FSRS algorithm
   */
  const recordWithFSRS = async (
    word: VocabularyWord,
    correct: boolean,
    responseTime: number,
    confidence?: number
  ): Promise<UnifiedSpacedRepetitionResult> => {
    try {
      const result = await fsrsService.updateProgress(
        user!.id,
        word.id,
        correct,
        responseTime,
        confidence
      );

      // Calculate points based on FSRS metrics
      const points = calculateFSRSPoints(result.card, correct);

      // Determine gem type based on FSRS state
      const gemType = mapFSRSStateToGemType(result.card.state, result.card.difficulty);

      return {
        success: true,
        algorithm: 'fsrs',
        points,
        gemType,
        upgraded: result.card.reviewCount === 1, // First time learning
        nextReviewDate: result.nextReviewDate,
        interval: result.interval,
        confidence: result.confidence,
        masteryLevel: mapFSRSStateToMasteryLevel(result.card.state, result.card.stability),
      };

    } catch (error) {
      console.error('Error with FSRS recording:', error);
      throw error;
    }
  };

  /**
   * Record practice using SM-2 algorithm (legacy support)
   */
  const recordWithSM2 = async (
    word: VocabularyWord,
    correct: boolean,
    responseTime: number
  ): Promise<UnifiedSpacedRepetitionResult> => {
    try {
      const result = await sm2Service.updateProgress(
        user!.id,
        word.id,
        correct,
        responseTime
      );

      // Get next review date from database
      const { data: gemData } = await supabaseBrowser
        .from('vocabulary_gem_collection')
        .select('next_review_at, spaced_repetition_interval, mastery_level')
        .eq('student_id', user!.id)
        .eq('vocabulary_item_id', word.id)
        .single();

      const nextReviewDate = gemData?.next_review_at ? new Date(gemData.next_review_at) : new Date();
      const interval = gemData?.spaced_repetition_interval || 1;
      const masteryLevel = gemData?.mastery_level || 0;

      return {
        success: true,
        algorithm: 'sm2',
        points: result.points,
        gemType: result.gemType,
        upgraded: result.upgraded,
        nextReviewDate,
        interval,
        confidence: 0.8, // Default confidence for SM-2
        masteryLevel,
      };

    } catch (error) {
      console.error('Error with SM-2 recording:', error);
      throw error;
    }
  };

  /**
   * Calculate points based on FSRS metrics
   */
  const calculateFSRSPoints = (card: any, correct: boolean): number => {
    if (!correct) return 5; // Small points for attempting

    // Base points
    let points = 20;

    // Difficulty bonus (harder words = more points)
    points += Math.round(card.difficulty * 2);

    // State bonus
    const stateBonus = {
      'new': 10,        // Bonus for learning new words
      'learning': 5,    // Small bonus for learning
      'review': 15,     // Good bonus for successful review
      'relearning': 8   // Moderate bonus for relearning
    };
    points += stateBonus[card.state as keyof typeof stateBonus] || 0;

    // Stability bonus (long-term retention = more points)
    if (card.stability > 30) points += 20;
    else if (card.stability > 14) points += 10;
    else if (card.stability > 7) points += 5;

    return points;
  };

  /**
   * Map FSRS state to gem type for visual feedback
   */
  const mapFSRSStateToGemType = (state: string, difficulty: number): string => {
    if (state === 'new') return 'common';
    if (state === 'learning') return 'uncommon';
    if (state === 'relearning') return 'uncommon';

    // For review state, use difficulty
    if (difficulty <= 2) return 'legendary';
    if (difficulty <= 4) return 'epic';
    if (difficulty <= 6) return 'rare';
    return 'uncommon';
  };

  /**
   * Map FSRS state to mastery level (0-5)
   */
  const mapFSRSStateToMasteryLevel = (state: string, stability: number): number => {
    if (state === 'new') return 0;
    if (state === 'learning') return 1;
    if (state === 'relearning') return 2;

    // For review state, use stability
    if (stability >= 30) return 5;
    if (stability >= 14) return 4;
    if (stability >= 7) return 3;
    return 2;
  };

  /**
   * Get words due for review using the appropriate algorithm
   */
  const getWordsForReview = useCallback(async (limit: number = 20) => {
    if (!user?.id) return [];

    try {
      if (algorithm === 'fsrs') {
        return await fsrsService.getWordsForReview(user.id, limit);
      } else {
        // Use SM-2 service for legacy data
        return await sm2Service.getWordsForReview(user.id, limit);
      }
    } catch (error) {
      console.error('Error getting words for review:', error);
      return [];
    }
  }, [user?.id, algorithm]);

  return {
    recordWordPractice,
    getWordsForReview,
    algorithm,
    setAlgorithm,
    isProcessing
  };
};
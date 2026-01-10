/**
 * Unified Vocabulary Tracking Hook
 * 
 * SINGLE SYSTEM: Uses only EnhancedGameSessionService for all vocabulary tracking
 * Replaces the fragmented useUnifiedSpacedRepetition system that caused double recording
 */

import { useCallback } from 'react';
import { EnhancedGameSessionService } from '../services/rewards/EnhancedGameSessionService';

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  language?: string;
  isCustomVocabulary?: boolean; // TRUE if from enhanced_vocabulary_items (custom/teacher vocabulary)
}

export interface VocabularyTrackingResult {
  success: boolean;
  gemEvent?: any;
  error?: string;
}

export const useVocabularyTracking = (gameSessionId: string, gameType: string) => {
  const recordWordAttempt = useCallback(async (
    word: VocabularyWord,
    wasCorrect: boolean,
    responseTimeMs: number,
    options: {
      hintUsed?: boolean;
      streakCount?: number;
      masteryLevel?: number;
      maxGemRarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
      gameMode?: string;
      difficultyLevel?: string;
    } = {}
  ): Promise<VocabularyTrackingResult> => {
    try {
      if (!gameSessionId) {
        return { success: false, error: 'No game session ID provided' };
      }

      const sessionService = new EnhancedGameSessionService();
      const gemEvent = await sessionService.recordWordAttempt(gameSessionId, gameType, {
        // ✅ FIXED: Use correct ID field based on vocabulary source
        vocabularyId: word.isCustomVocabulary ? undefined : word.id,
        enhancedVocabularyItemId: word.isCustomVocabulary ? word.id : undefined,
        wordText: word.word,
        translationText: word.translation,
        responseTimeMs,
        wasCorrect,
        hintUsed: options.hintUsed || false,
        streakCount: options.streakCount || 0,
        masteryLevel: options.masteryLevel || 1,
        maxGemRarity: options.maxGemRarity || 'rare',
        gameMode: options.gameMode || 'standard',
        difficultyLevel: options.difficultyLevel || 'beginner'
      });

      return { success: true, gemEvent };
    } catch (error) {
      console.error(`Error recording vocabulary attempt for ${gameType}:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, [gameSessionId, gameType]);

  return {
    recordWordAttempt
  };
};

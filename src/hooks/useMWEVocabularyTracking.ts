/**
 * Enhanced Vocabulary Tracking Hook with MWE Support
 * 
 * Integrates MWE parsing with existing FSRS and gem tracking systems
 */

import { useCallback, useMemo } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { MWEVocabularyTrackingService, MWEVocabularyMatch, SentenceParsingResult } from '../services/MWEVocabularyTrackingService';
import { EnhancedGameSessionService } from '../services/rewards/EnhancedGameSessionService';

export interface MWETrackingOptions {
  gameSessionId: string;
  gameType: string;
  language?: string;
  trackOnlyMWEs?: boolean;
  maxGemRarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface MWETrackingResult {
  success: boolean;
  parsingResult: SentenceParsingResult;
  trackedVocabulary: MWEVocabularyMatch[];
  gemEvents: any[];
  errors: string[];
}

export const useMWEVocabularyTracking = (options: MWETrackingOptions) => {
  const supabase = useSupabaseClient();
  
  // Create service instance
  const mweService = useMemo(() => {
    return new MWEVocabularyTrackingService(supabase);
  }, [supabase]);

  /**
   * Parse a sentence and track all identified vocabulary
   */
  const trackSentenceVocabulary = useCallback(async (
    sentence: string,
    wasCorrect: boolean,
    responseTimeMs: number,
    additionalOptions: {
      hintUsed?: boolean;
      streakCount?: number;
      masteryLevel?: number;
      gameMode?: string;
      difficultyLevel?: string;
    } = {}
  ): Promise<MWETrackingResult> => {
    const errors: string[] = [];
    const gemEvents: any[] = [];
    
    try {
      // Parse sentence for vocabulary matches
      const parsingResult = await mweService.parseSentenceForVocabulary(
        sentence,
        options.language || 'es'
      );

      console.log('🔍 [MWE TRACKING] Sentence parsing result:', {
        sentence,
        totalMatches: parsingResult.vocabularyMatches.length,
        coverage: parsingResult.coveragePercentage,
        mweCount: parsingResult.vocabularyMatches.filter(m => m.is_mwe).length
      });

      // Get trackable vocabulary (respects should_track_for_fsrs flag)
      const trackableVocabulary = parsingResult.vocabularyMatches.filter(match => 
        match.should_track_for_fsrs && 
        (!options.trackOnlyMWEs || match.is_mwe)
      );

      console.log('📊 [MWE TRACKING] Trackable vocabulary:', {
        total: trackableVocabulary.length,
        mwes: trackableVocabulary.filter(v => v.is_mwe).map(v => v.word),
        singleWords: trackableVocabulary.filter(v => !v.is_mwe).map(v => v.word)
      });

      // Track each vocabulary item
      if (options.gameSessionId && trackableVocabulary.length > 0) {
        const sessionService = new EnhancedGameSessionService();

        for (const vocabMatch of trackableVocabulary) {
          try {
            console.log(`🎯 [MWE TRACKING] Recording attempt for: "${vocabMatch.word}" (MWE: ${vocabMatch.is_mwe})`);
            
            const gemEvent = await sessionService.recordWordAttempt(
              options.gameSessionId,
              options.gameType,
              {
                vocabularyId: vocabMatch.id,
                wordText: vocabMatch.word,
                translationText: vocabMatch.translation,
                responseTimeMs,
                wasCorrect,
                hintUsed: additionalOptions.hintUsed || false,
                streakCount: additionalOptions.streakCount || 0,
                masteryLevel: additionalOptions.masteryLevel || 1,
                maxGemRarity: options.maxGemRarity || 'rare',
                gameMode: additionalOptions.gameMode || 'sentence_building',
                difficultyLevel: additionalOptions.difficultyLevel || 'intermediate'
              }
            );

            if (gemEvent) {
              gemEvents.push({
                vocabularyId: vocabMatch.id,
                word: vocabMatch.word,
                isMWE: vocabMatch.is_mwe,
                gemEvent
              });
            }
          } catch (error) {
            const errorMsg = `Failed to track vocabulary "${vocabMatch.word}": ${error}`;
            console.error('❌ [MWE TRACKING]', errorMsg);
            errors.push(errorMsg);
          }
        }
      }

      return {
        success: errors.length === 0,
        parsingResult,
        trackedVocabulary: trackableVocabulary,
        gemEvents,
        errors
      };

    } catch (error) {
      const errorMsg = `Failed to parse sentence: ${error}`;
      console.error('❌ [MWE TRACKING]', errorMsg);
      return {
        success: false,
        parsingResult: {
          originalSentence: sentence,
          vocabularyMatches: [],
          unmatchedWords: sentence.split(' '),
          totalWords: sentence.split(' ').length,
          matchedWords: 0,
          coveragePercentage: 0
        },
        trackedVocabulary: [],
        gemEvents: [],
        errors: [errorMsg]
      };
    }
  }, [mweService, options]);

  /**
   * Parse a sentence without tracking (for preview/analysis)
   */
  const parseSentence = useCallback(async (
    sentence: string,
    language?: string
  ): Promise<SentenceParsingResult> => {
    return mweService.parseSentenceForVocabulary(
      sentence,
      language || options.language || 'es'
    );
  }, [mweService, options.language]);

  /**
   * Get trackable vocabulary from a sentence without recording attempts
   */
  const getTrackableVocabulary = useCallback(async (
    sentence: string,
    language?: string
  ): Promise<MWEVocabularyMatch[]> => {
    return mweService.getTrackableVocabulary(
      sentence,
      language || options.language || 'es'
    );
  }, [mweService, options.language]);

  /**
   * Track individual vocabulary word (for non-sentence games)
   */
  const trackIndividualWord = useCallback(async (
    word: {
      id: string;
      word: string;
      translation: string;
      language?: string;
    },
    wasCorrect: boolean,
    responseTimeMs: number,
    additionalOptions: {
      hintUsed?: boolean;
      streakCount?: number;
      masteryLevel?: number;
      gameMode?: string;
      difficultyLevel?: string;
    } = {}
  ): Promise<{ success: boolean; gemEvent?: any; error?: string }> => {
    try {
      if (!options.gameSessionId) {
        return { success: false, error: 'No game session ID provided' };
      }

      const sessionService = new EnhancedGameSessionService();
      const gemEvent = await sessionService.recordWordAttempt(
        options.gameSessionId,
        options.gameType,
        {
          vocabularyId: word.id,
          wordText: word.word,
          translationText: word.translation,
          responseTimeMs,
          wasCorrect,
          hintUsed: additionalOptions.hintUsed || false,
          streakCount: additionalOptions.streakCount || 0,
          masteryLevel: additionalOptions.masteryLevel || 1,
          maxGemRarity: options.maxGemRarity || 'rare',
          gameMode: additionalOptions.gameMode || 'individual_word',
          difficultyLevel: additionalOptions.difficultyLevel || 'intermediate'
        }
      );

      return { success: true, gemEvent };
    } catch (error) {
      console.error(`Error tracking individual word "${word.word}":`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, [options]);

  /**
   * Get parsing statistics for a set of sentences
   */
  const getParsingStats = useCallback(async (
    sentences: string[],
    language?: string
  ) => {
    return mweService.getParsingStats(
      sentences,
      language || options.language || 'es'
    );
  }, [mweService, options.language]);

  /**
   * Clear vocabulary cache (useful when vocabulary is updated)
   */
  const clearCache = useCallback(() => {
    mweService.clearCache();
  }, [mweService]);

  return {
    // Main tracking functions
    trackSentenceVocabulary,
    trackIndividualWord,
    
    // Analysis functions
    parseSentence,
    getTrackableVocabulary,
    getParsingStats,
    
    // Utility functions
    clearCache
  };
};

/**
 * React Hook for Sentence Games
 * 
 * Provides easy integration with sentence-based games for vocabulary tracking and gem awarding.
 * Handles the complete flow: sentence parsing → vocabulary matching → gem awarding → FSRS updates
 */

import { useState, useCallback } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { SentenceGameService, SentenceGameAttempt, SentenceGameResult } from '@/services/SentenceGameService';

export interface UseSentenceGameOptions {
  gameType: string;
  sessionId: string;
  language: string;
  gameMode?: 'listening' | 'translation' | 'completion' | 'dictation';
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  assignmentId?: string; // 🎯 NEW: For Layer 2 exposure tracking
  studentId?: string; // 🎯 NEW: For Layer 2 exposure tracking
}

export interface SentenceGameState {
  isProcessing: boolean;
  lastResult: SentenceGameResult | null;
  totalGems: number;
  totalXP: number;
  processedSentences: number;
  error: string | null;
}

export function useSentenceGame(options: UseSentenceGameOptions) {
  const { supabase } = useSupabase();
  const [sentenceGameService] = useState(() => new SentenceGameService(supabase));
  
  const [state, setState] = useState<SentenceGameState>({
    isProcessing: false,
    lastResult: null,
    totalGems: 0,
    totalXP: 0,
    processedSentences: 0,
    error: null
  });

  /**
   * Process a sentence attempt and award gems for recognized vocabulary
   */
  const processSentence = useCallback(async (
    sentence: string,
    isCorrect: boolean,
    responseTimeMs: number,
    hintUsed: boolean = false,
    sentenceId?: string
  ): Promise<SentenceGameResult | null> => {
    console.log(`🎯 useSentenceGame: START - Processing sentence "${sentence}" (${options.language})`);
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      // Reduced logging: Skip detailed attempt object logging
      // console.log(`🎯 useSentenceGame: Creating attempt object...`);

      const attempt: SentenceGameAttempt = {
        sessionId: options.sessionId,
        gameType: options.gameType,
        sentenceId,
        originalSentence: sentence,
        language: options.language,
        isCorrect,
        responseTimeMs,
        hintUsed,
        gameMode: options.gameMode,
        difficultyLevel: options.difficultyLevel,
        assignmentId: options.assignmentId, // 🎯 Pass through for Layer 2
        studentId: options.studentId // 🎯 Pass through for Layer 2
      };

      // console.log(`🎯 useSentenceGame: About to call sentenceGameService.processSentenceAttempt with:`, attempt);
      const result = await sentenceGameService.processSentenceAttempt(attempt);
      console.log(`🎯 useSentenceGame: Got result:`, result);

      setState(prev => ({
        ...prev,
        isProcessing: false,
        lastResult: result,
        totalGems: prev.totalGems + result.totalGems,
        totalXP: prev.totalXP + result.totalXP,
        processedSentences: prev.processedSentences + 1
      }));

      return result;

    } catch (error) {
      console.error('Error processing sentence:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Failed to process sentence'
      }));
      return null;
    }
  }, [sentenceGameService, options]);

  /**
   * Analyze sentence vocabulary without processing (for preview/difficulty assessment)
   */
  const analyzeSentence = useCallback(async (sentence: string) => {
    try {
      return await sentenceGameService.analyzeSentenceVocabulary(sentence, options.language);
    } catch (error) {
      console.error('Error analyzing sentence:', error);
      return null;
    }
  }, [sentenceGameService, options.language]);

  /**
   * Process multiple sentences in batch (useful for assessments)
   */
  const processBatchSentences = useCallback(async (
    sentences: Array<{
      sentence: string;
      isCorrect: boolean;
      responseTimeMs: number;
      hintUsed?: boolean;
      sentenceId?: string;
    }>
  ) => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const attempts: SentenceGameAttempt[] = sentences.map(s => ({
        sessionId: options.sessionId,
        gameType: options.gameType,
        sentenceId: s.sentenceId,
        originalSentence: s.sentence,
        language: options.language,
        isCorrect: s.isCorrect,
        responseTimeMs: s.responseTimeMs,
        hintUsed: s.hintUsed || false,
        gameMode: options.gameMode,
        difficultyLevel: options.difficultyLevel,
        assignmentId: options.assignmentId, // 🎯 Pass through for Layer 2
        studentId: options.studentId // 🎯 Pass through for Layer 2
      }));

      const batchResult = await sentenceGameService.processBatchSentences(attempts);

      setState(prev => ({
        ...prev,
        isProcessing: false,
        lastResult: null, // Batch doesn't have single result
        totalGems: prev.totalGems + batchResult.summary.totalGems,
        totalXP: prev.totalXP + batchResult.summary.totalXP,
        processedSentences: prev.processedSentences + sentences.length
      }));

      return batchResult;

    } catch (error) {
      console.error('Error processing batch sentences:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Failed to process sentences'
      }));
      return null;
    }
  }, [sentenceGameService, options]);

  /**
   * Reset the game state
   */
  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      lastResult: null,
      totalGems: 0,
      totalXP: 0,
      processedSentences: 0,
      error: null
    });
  }, []);

  /**
   * Get vocabulary statistics for the last processed sentence
   */
  const getLastVocabularyStats = useCallback(() => {
    if (!state.lastResult) return null;

    return {
      totalMatches: state.lastResult.vocabularyMatches.length,
      mweCount: state.lastResult.vocabularyMatches.filter(m => m.is_mwe).length,
      coveragePercentage: state.lastResult.coveragePercentage,
      unmatchedWords: state.lastResult.unmatchedWords,
      recognizedVocabulary: state.lastResult.vocabularyMatches.map(m => ({
        word: m.word,
        translation: m.translation,
        isMWE: m.is_mwe,
        confidence: m.lemmatizationConfidence
      }))
    };
  }, [state.lastResult]);

  return {
    // State
    ...state,
    
    // Actions
    processSentence,
    analyzeSentence,
    processBatchSentences,
    resetState,
    
    // Computed values
    getLastVocabularyStats,
    
    // Helper functions
    hasProcessedSentences: state.processedSentences > 0,
    averageGemsPerSentence: state.processedSentences > 0 ? state.totalGems / state.processedSentences : 0,
    averageXPPerSentence: state.processedSentences > 0 ? state.totalXP / state.processedSentences : 0
  };
}

/**
 * Hook specifically for listening games (Detective Listening, etc.)
 */
export function useListeningGame(sessionId: string, language: string, assignmentId?: string, studentId?: string) {
  return useSentenceGame({
    gameType: 'detective_listening',
    sessionId,
    language,
    gameMode: 'listening',
    difficultyLevel: 'intermediate',
    assignmentId, // 🎯 Pass through for Layer 2
    studentId // 🎯 Pass through for Layer 2
  });
}

/**
 * Hook specifically for translation games (Case File Translator, etc.)
 */
export function useTranslationGame(sessionId: string, language: string, assignmentId?: string, studentId?: string) {
  return useSentenceGame({
    gameType: 'case_file_translator',
    sessionId,
    language,
    gameMode: 'translation',
    difficultyLevel: 'intermediate',
    assignmentId, // 🎯 Pass through for Layer 2
    studentId // 🎯 Pass through for Layer 2
  });
}

/**
 * Hook specifically for dictation games (Lava Temple Word Restore, etc.)
 */
export function useDictationGame(sessionId: string, language: string, assignmentId?: string, studentId?: string) {
  return useSentenceGame({
    gameType: 'lava_temple_word_restore',
    sessionId,
    language,
    gameMode: 'dictation',
    difficultyLevel: 'advanced',
    assignmentId, // 🎯 Pass through for Layer 2
    studentId // 🎯 Pass through for Layer 2
  });
}

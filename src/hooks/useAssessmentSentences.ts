/**
 * React Hook for Assessment Sentences
 * 
 * Provides easy access to sentence loading and validation for assessment creation.
 */

import { useState, useCallback, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { 
  AssessmentSentenceService, 
  SentenceFilter, 
  AssessmentSentence, 
  SentenceStats 
} from '@/services/AssessmentSentenceService';

export interface UseAssessmentSentencesOptions {
  language: 'spanish' | 'french' | 'german';
  category?: string;
  subcategory?: string;
  theme?: string;
  topic?: string;
  autoLoad?: boolean;
}

export interface AssessmentSentencesState {
  sentences: AssessmentSentence[];
  stats: SentenceStats | null;
  availableCategories: string[];
  availableSubcategories: string[];
  isLoading: boolean;
  isValidating: boolean;
  error: string | null;
  validation: {
    isValid: boolean;
    sentenceCount: number;
    issues: string[];
    recommendations: string[];
  } | null;
}

export function useAssessmentSentences(options: UseAssessmentSentencesOptions) {
  const { supabase } = useSupabase();
  const [sentenceService] = useState(() => new AssessmentSentenceService(supabase));
  
  const [state, setState] = useState<AssessmentSentencesState>({
    sentences: [],
    stats: null,
    availableCategories: [],
    availableSubcategories: [],
    isLoading: false,
    isValidating: false,
    error: null,
    validation: null
  });

  /**
   * Load sentences based on current filter
   */
  const loadSentences = useCallback(async (filter?: Partial<SentenceFilter>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const sentenceFilter: SentenceFilter = {
        language: options.language,
        category: options.category,
        subcategory: options.subcategory,
        theme: options.theme,
        topic: options.topic,
        limit: 50,
        ...filter
      };

      const [sentences, stats] = await Promise.all([
        sentenceService.loadSentences(sentenceFilter),
        sentenceService.getSentenceStats(sentenceFilter)
      ]);

      setState(prev => ({
        ...prev,
        sentences,
        stats,
        isLoading: false
      }));

      return sentences;

    } catch (error) {
      console.error('Error loading sentences:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load sentences'
      }));
      return [];
    }
  }, [sentenceService, options]);

  /**
   * Load available categories for the current language
   */
  const loadCategories = useCallback(async () => {
    try {
      const categories = await sentenceService.getAvailableCategories(options.language);
      setState(prev => ({ ...prev, availableCategories: categories }));
      return categories;
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }, [sentenceService, options.language]);

  /**
   * Load available subcategories for the current language and category
   */
  const loadSubcategories = useCallback(async (category?: string) => {
    try {
      const subcategories = await sentenceService.getAvailableSubcategories(
        options.language,
        category || options.category
      );
      setState(prev => ({ ...prev, availableSubcategories: subcategories }));
      return subcategories;
    } catch (error) {
      console.error('Error loading subcategories:', error);
      return [];
    }
  }, [sentenceService, options.language, options.category]);

  /**
   * Validate current sentence configuration
   */
  const validateConfiguration = useCallback(async (filter?: Partial<SentenceFilter>) => {
    setState(prev => ({ ...prev, isValidating: true }));

    try {
      const sentenceFilter: SentenceFilter = {
        language: options.language,
        category: options.category,
        subcategory: options.subcategory,
        theme: options.theme,
        topic: options.topic,
        ...filter
      };

      const validation = await sentenceService.validateSentenceConfig(sentenceFilter);
      
      setState(prev => ({
        ...prev,
        validation,
        isValidating: false
      }));

      return validation;

    } catch (error) {
      console.error('Error validating configuration:', error);
      setState(prev => ({
        ...prev,
        isValidating: false,
        validation: {
          isValid: false,
          sentenceCount: 0,
          issues: ['Failed to validate configuration'],
          recommendations: []
        }
      }));
      return null;
    }
  }, [sentenceService, options]);

  /**
   * Generate assessment-ready sentence set
   */
  const generateAssessmentSet = useCallback(async (
    assessmentType: 'listening' | 'reading',
    questionCount: number = 10,
    filter?: Partial<SentenceFilter>
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const sentenceFilter: SentenceFilter = {
        language: options.language,
        category: options.category,
        subcategory: options.subcategory,
        theme: options.theme,
        topic: options.topic,
        ...filter
      };

      const result = await sentenceService.generateAssessmentSentenceSet(
        sentenceFilter,
        assessmentType,
        questionCount
      );

      setState(prev => ({
        ...prev,
        sentences: result.sentences,
        isLoading: false
      }));

      return result;

    } catch (error) {
      console.error('Error generating assessment set:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate assessment set'
      }));
      return null;
    }
  }, [sentenceService, options]);

  /**
   * Get sentence count for current configuration
   */
  const getSentenceCount = useCallback(async (filter?: Partial<SentenceFilter>) => {
    try {
      const sentenceFilter: SentenceFilter = {
        language: options.language,
        category: options.category,
        subcategory: options.subcategory,
        theme: options.theme,
        topic: options.topic,
        ...filter
      };

      const stats = await sentenceService.getSentenceStats(sentenceFilter);
      return stats.totalSentences;

    } catch (error) {
      console.error('Error getting sentence count:', error);
      return 0;
    }
  }, [sentenceService, options]);

  /**
   * Check if current configuration is valid for assessment creation
   */
  const isConfigurationValid = useCallback(() => {
    return state.validation?.isValid === true && state.validation.sentenceCount >= 5;
  }, [state.validation]);

  /**
   * Get configuration status for display
   */
  const getConfigurationStatus = useCallback(() => {
    if (state.isValidating) {
      return { status: 'validating', message: 'Validating...' };
    }

    if (!state.validation) {
      return { status: 'needs_validation', message: 'Needs validation' };
    }

    if (state.validation.isValid && state.validation.sentenceCount >= 5) {
      return { 
        status: 'valid', 
        message: `✓ ${state.validation.sentenceCount} sentences available` 
      };
    }

    if (state.validation.sentenceCount === 0) {
      return { status: 'no_content', message: '⚠ No sentences found' };
    }

    if (state.validation.sentenceCount < 5) {
      return { 
        status: 'insufficient', 
        message: `⚠ Only ${state.validation.sentenceCount} sentences (min 5 needed)` 
      };
    }

    return { status: 'invalid', message: '⚠ Configuration issues' };
  }, [state.validation, state.isValidating]);

  // Auto-load data when options change
  useEffect(() => {
    if (options.autoLoad !== false) {
      loadCategories();
      
      if (options.category || options.subcategory || options.theme || options.topic) {
        loadSentences();
        validateConfiguration();
      }
      
      if (options.category) {
        loadSubcategories();
      }
    }
  }, [options, loadCategories, loadSentences, loadSubcategories, validateConfiguration]);

  return {
    // State
    ...state,
    
    // Actions
    loadSentences,
    loadCategories,
    loadSubcategories,
    validateConfiguration,
    generateAssessmentSet,
    getSentenceCount,
    
    // Computed values
    isConfigurationValid,
    getConfigurationStatus,
    
    // Helper functions
    hasContent: state.sentences.length > 0,
    hasSufficientContent: state.validation?.sentenceCount >= 5,
    sentenceCount: state.validation?.sentenceCount || 0
  };
}

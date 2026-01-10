'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '../components/auth/AuthProvider';
import type { UnifiedSelectionConfig } from '../components/games/UnifiedCategorySelector';

// Re-export the config type for convenience
export type { UnifiedSelectionConfig };

export interface UnifiedVocabularyItem {
  id: string;
  word: string;
  translation: string;
  language: string;
  category: string;
  subcategory?: string;
  part_of_speech?: string;
  example_sentence_original?: string;
  example_sentence_translation?: string;
  difficulty_level?: string;
  audio_url?: string;
  enhancedVocabularyItemId?: string; // For custom vocabulary - tracks to enhanced_vocabulary_items
  isCustomVocabulary?: boolean; // TRUE if from enhanced_vocabulary_items (custom/teacher vocabulary)
}

export interface UseUnifiedVocabularyOptions {
  config?: UnifiedSelectionConfig;
  limit?: number;
  randomize?: boolean;
  hasAudio?: boolean;
  customVocabulary?: UnifiedVocabularyItem[];
}

export interface UseUnifiedVocabularyReturn {
  vocabulary: UnifiedVocabularyItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  isEmpty: boolean;
}

/**
 * Unified vocabulary hook that works with the new UnifiedCategorySelector
 * Handles loading vocabulary from the centralized_vocabulary table based on
 * language, curriculum level, category, and subcategory selections
 */
export function useUnifiedVocabulary({
  config,
  limit = 50,
  randomize = true,
  hasAudio = false,
  customVocabulary
}: UseUnifiedVocabularyOptions = {}): UseUnifiedVocabularyReturn {
  const [vocabulary, setVocabulary] = useState<UnifiedVocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVocabulary = async () => {
    // Handle custom vocabulary mode
    if (config?.customMode) {
      // If custom list ID is provided, load from database
      if (config.customListId) {
        setLoading(true);
        try {
          const supabase = supabaseBrowser;

          // Load vocabulary items from the custom list (including audio_url)
          const { data: items, error } = await supabase
            .from('enhanced_vocabulary_items')
            .select(`
              id,
              term,
              translation,
              part_of_speech,
              context_sentence,
              context_translation,
              difficulty_level,
              audio_url
            `)
            .eq('list_id', config.customListId);

          if (error) throw error;

          if (!items || items.length === 0) {
            setError('No vocabulary found in selected list');
            setVocabulary([]);
            return;
          }

          // Transform to unified format - include enhancedVocabularyItemId for progress tracking
          const transformedVocabulary: UnifiedVocabularyItem[] = items.map(item => ({
            id: item.id,
            word: item.term,
            translation: item.translation || '',
            language: config.language || 'es',
            category: 'custom',
            subcategory: undefined,
            part_of_speech: item.part_of_speech,
            example_sentence_original: item.context_sentence,
            example_sentence_translation: item.context_translation,
            difficulty_level: item.difficulty_level,
            audio_url: item.audio_url,
            enhancedVocabularyItemId: item.id // Set this so games can track progress to enhanced_vocabulary_items
          }));


          setVocabulary(transformedVocabulary);
          setLoading(false);
          setError(null);
          return;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load custom vocabulary list';
          setError(errorMessage);
          setVocabulary([]);
          setLoading(false);
          return;
        }
      }

      // If custom vocabulary array is provided
      if (customVocabulary && customVocabulary.length > 0) {
        setVocabulary(customVocabulary);
        setLoading(false);
        setError(null);
        return;
      } else {
        // Custom mode but no vocabulary provided - this is expected initially
        setVocabulary([]);
        setLoading(false);
        setError(null);
        return;
      }
    }

    // Don't fetch if no config provided
    if (!config) {
      setVocabulary([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = supabaseBrowser;

      // Build the query
      let query = supabase
        .from('centralized_vocabulary')
        .select(`
          id,
          word,
          translation,
          language,
          part_of_speech,
          example_sentence,
          example_translation,
          category,
          subcategory,
          tier,
          curriculum_level,
          is_required,
          audio_url
        `)
        .in('language', mapLanguageCodes(config.language)); // Use helper to get all possible language codes

      // Filter by curriculum level
      if (config.curriculumLevel === 'KS3') {
        // For KS3, use curriculum_level or tier
        query = query.or('curriculum_level.eq.KS3,tier.in.(Foundation,Core)');
      } else if (config.curriculumLevel === 'KS4') {
        // For KS4, use curriculum_level
        query = query.eq('curriculum_level', 'KS4');

        // Add KS4-specific filters
        if (config.examBoard) {
          query = query.eq('exam_board_code', config.examBoard);
        }
        if (config.tier) {
          query = query.like('tier', `%${config.tier}%`);
        }
      }

      // Handle category filtering differently for KS4 vs other levels
      if (config.categoryId && config.categoryId !== 'custom') {
        if (config.curriculumLevel === 'KS4') {
          // For KS4, map categoryId to theme_name
          const themeMapping: Record<string, string> = {
            'aqa_general': 'General',
            'aqa_communication': 'Communication and the world around us',
            'aqa_people_lifestyle': 'People and lifestyle',
            'aqa_popular_culture': 'Popular culture',
            'aqa_cultural_items': 'Cultural items',
            'edexcel_general': 'General',
            'edexcel_personal_world': 'My personal world',
            'edexcel_neighborhood': 'My neighborhood',
            'edexcel_studying_future': 'Studying and my future',
            'edexcel_travel_tourism': 'Travel and tourism',
            'edexcel_media_technology': 'Media and technology',
            'edexcel_cultural': 'Cultural'
          };

          const themeName = themeMapping[config.categoryId] || config.categoryId;
          query = query.like('theme_name', `%${themeName}%`);
        } else {
          // For other levels, use category field
          query = query.eq('category', config.categoryId);
        }
      }

      // Handle subcategory filtering differently for KS4 vs other levels
      if (config.subcategoryId) {
        if (config.curriculumLevel === 'KS4') {
          // For KS4, subcategoryId is the unit_name
          query = query.like('unit_name', `%${config.subcategoryId}%`);
        } else {
          // For other levels, use subcategory field
          query = query.eq('subcategory', config.subcategoryId);
        }
      }

      // Apply limit
      if (limit > 0) {
        query = query.limit(limit);
      }

      // Execute query
      const { data, error: queryError } = await query;

      if (queryError) {
        throw new Error(`Failed to load vocabulary: ${queryError.message}`);
      }

      if (!data || data.length === 0) {
        setError(`No vocabulary found for ${config.language} - ${config.categoryId}`);
        setVocabulary([]);
        return;
      }

      // Transform data to unified format
      let transformedVocabulary: UnifiedVocabularyItem[] = data.map(item => ({
        id: item.id,
        word: item.word,
        translation: item.translation,
        language: item.language,
        category: item.category || config.categoryId, // Use database category or fallback to config
        subcategory: item.subcategory || config.subcategoryId, // Use database subcategory or fallback to config
        part_of_speech: item.part_of_speech,
        example_sentence_original: item.example_sentence,
        example_sentence_translation: item.example_translation,
        difficulty_level: item.tier?.toLowerCase() || item.curriculum_level?.toLowerCase(),
        audio_url: item.audio_url // Use the actual audio URL from the database
      }));

      // Filter by subcategory if specified
      if (config.subcategoryId) {
        // This would require additional logic to map subcategories to specific vocabulary
        // For now, we'll use all vocabulary from the category
      }

      // Randomize if requested
      if (randomize) {
        transformedVocabulary = transformedVocabulary.sort(() => Math.random() - 0.5);
      }

      // Filter by audio requirement
      if (hasAudio) {
        transformedVocabulary = transformedVocabulary.filter(item => item.audio_url);
      }

      setVocabulary(transformedVocabulary);
      console.log(`Loaded ${transformedVocabulary.length} vocabulary items for ${config.language} - ${config.categoryId}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error loading vocabulary:', err);
      setVocabulary([]);
    } finally {
      setLoading(false);
    }
  };

  // Refetch function
  const refetch = () => {
    fetchVocabulary();
  };

  // Effect to load vocabulary when config changes
  useEffect(() => {
    fetchVocabulary();
  }, [
    config?.language,
    config?.curriculumLevel,
    config?.categoryId,
    config?.subcategoryId,
    config?.customMode,
    config?.customListId,
    limit,
    randomize,
    hasAudio,
    customVocabulary
  ]);

  return {
    vocabulary,
    loading,
    error,
    refetch,
    isEmpty: vocabulary.length === 0 && !loading
  };
}

/**
 * Get all possible language codes for a given language (handles variants)
 */
function mapLanguageCodes(languageCode: string): string[] {
  const languageVariantsMap: Record<string, string[]> = {
    'es': ['es', 'ES', 'spanish'], // Spanish has multiple variants in the database
    'fr': ['fr', 'french'],
    'de': ['de', 'german'],
    'en': ['en', 'english']
  };

  return languageVariantsMap[languageCode] || [languageCode];
}

/**
 * Helper hook for games that need to show a loading state while vocabulary loads
 */
export function useVocabularyWithLoadingGate(
  config?: UnifiedSelectionConfig,
  options?: Omit<UseUnifiedVocabularyOptions, 'config'>
) {
  const { vocabulary, loading, error, refetch, isEmpty } = useUnifiedVocabulary({
    config,
    ...options
  });

  const canStartGame = !loading && vocabulary.length > 0;
  const shouldShowLoadingGate = loading || (config && !config.customMode && isEmpty);

  return {
    vocabulary,
    loading,
    error,
    refetch,
    isEmpty,
    canStartGame,
    shouldShowLoadingGate,
    loadingMessage: loading
      ? 'Loading vocabulary...'
      : isEmpty
        ? 'No vocabulary found for selected criteria'
        : ''
  };
}

/**
 * Standalone function to load vocabulary for a given configuration
 * Used for URL parameter auto-loading in game pages
 */
export async function loadVocabulary(config: UnifiedSelectionConfig): Promise<UnifiedVocabularyItem[]> {
  try {
    console.log('🔄 Loading vocabulary for config:', config);

    let query = supabaseBrowser
      .from('centralized_vocabulary')
      .select('*')
      .eq('language', config.language)
      .eq('category', config.categoryId);

    // Add subcategory filter if specified
    if (config.subcategoryId) {
      query = query.eq('subcategory', config.subcategoryId);
    }

    // Add curriculum level filter if needed (for KS4 specific content)
    if (config.curriculumLevel === 'KS4') {
      // For KS4, we might want to filter by specific fields or use different logic
      // For now, we'll use the same query but this can be extended
    }

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('❌ Error loading vocabulary:', error);
      throw error;
    }

    console.log('✅ Vocabulary loaded:', { count: data?.length, data: data?.slice(0, 3) });
    return data || [];
  } catch (error) {
    console.error('❌ Failed to load vocabulary:', error);
    return [];
  }
}

/**
 * Helper function to validate vocabulary before starting a game
 */
export function validateVocabularyForGame(
  vocabulary: UnifiedVocabularyItem[],
  minRequired: number = 1
): { isValid: boolean; message?: string } {
  if (vocabulary.length === 0) {
    return {
      isValid: false,
      message: 'Please wait for vocabulary to load before starting the game.'
    };
  }

  if (vocabulary.length < minRequired) {
    return {
      isValid: false,
      message: `At least ${minRequired} vocabulary items are required to start the game.`
    };
  }

  return { isValid: true };
}

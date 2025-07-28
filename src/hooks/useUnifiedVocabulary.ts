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
    if (config?.customMode && customVocabulary) {
      setVocabulary(customVocabulary);
      setLoading(false);
      setError(null);
      return;
    }

    // Don't fetch if no config provided
    if (!config || config.customMode) {
      setVocabulary([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = supabaseBrowser();
      
      // Build the query
      let query = supabase
        .from('centralized_vocabulary')
        .select(`
          id,
          word,
          translation,
          language,
          part_of_speech,
          example_sentence_original,
          example_sentence_translation,
          theme_name,
          tier,
          is_required
        `)
        .eq('language', mapLanguageCode(config.language));

      // Filter by curriculum level (tier)
      if (config.curriculumLevel === 'KS3') {
        query = query.in('tier', ['Foundation', 'Core']);
      } else if (config.curriculumLevel === 'KS4') {
        query = query.in('tier', ['Foundation', 'Higher', 'Core']);
      }

      // Filter by category (theme_name)
      if (config.categoryId && config.categoryId !== 'custom') {
        const themeName = mapCategoryToTheme(config.categoryId);
        if (themeName) {
          query = query.eq('theme_name', themeName);
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
        category: config.categoryId,
        subcategory: config.subcategoryId,
        part_of_speech: item.part_of_speech,
        example_sentence_original: item.example_sentence_original,
        example_sentence_translation: item.example_sentence_translation,
        difficulty_level: item.tier?.toLowerCase(),
        audio_url: undefined // Audio URLs would need to be generated separately
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
 * Map language codes to database language values
 */
function mapLanguageCode(languageCode: string): string {
  const languageMap: Record<string, string> = {
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'en': 'English'
  };
  
  return languageMap[languageCode] || languageCode;
}

/**
 * Map category IDs to theme names in the database
 */
function mapCategoryToTheme(categoryId: string): string | null {
  const categoryMap: Record<string, string> = {
    'basics_core_language': 'Identity and culture',
    'identity_personal_life': 'Identity and culture',
    'home_local_area': 'Local area, holiday and travel',
    'school_jobs_future': 'School',
    'free_time_leisure': 'Free-time activities',
    'food_drink': 'Food and eating out',
    'clothes_shopping': 'Shopping',
    'technology_media': 'Technology in everyday life'
  };
  
  return categoryMap[categoryId] || null;
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

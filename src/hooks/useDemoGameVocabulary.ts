'use client';

import { useState, useEffect } from 'react';
import { useDemoAuth } from '../components/auth/DemoAuthProvider';
import { supabaseBrowser } from '../components/auth/AuthProvider';
import { createDemoVocabularyService } from '../services/demoVocabularyService';
import { GameVocabularyWord } from './useGameVocabulary';

interface UseDemoGameVocabularyProps {
  language: string;
  categoryId?: string;
  subcategoryId?: string;
  limit?: number;
  randomize?: boolean;
  hasAudio?: boolean;
  difficultyLevel?: string;
  curriculumLevel?: string;
  enabled?: boolean;
}

interface UseDemoGameVocabularyReturn {
  vocabulary: GameVocabularyWord[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => void;
  isDemoRestricted: boolean;
  demoMessage: string;
  availableCategories: string[];
  availableSubcategories: string[];
}

/**
 * Demo-aware vocabulary hook that respects demo mode restrictions
 * while providing full access to authenticated users and admin
 */
export function useDemoGameVocabulary({
  language,
  categoryId,
  subcategoryId,
  limit = 100,
  randomize = true,
  hasAudio = false,
  difficultyLevel,
  curriculumLevel,
  enabled = true
}: UseDemoGameVocabularyProps): UseDemoGameVocabularyReturn {
  const { isDemo, isAdmin } = useDemoAuth();
  const [vocabulary, setVocabulary] = useState<GameVocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Create demo-aware vocabulary service
  const vocabularyService = createDemoVocabularyService(supabaseBrowser, isDemo, isAdmin);

  const loadVocabulary = async () => {
    if (!enabled) {
      setLoading(false);
      setVocabulary([]);
      setTotalCount(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if the requested category/subcategory is available in demo mode
      if (isDemo && !isAdmin) {
        if (categoryId && !vocabularyService.isCategoryAvailable(categoryId)) {
          setError('This category is not available in demo mode. Please sign up for full access.');
          setVocabulary([]);
          setTotalCount(0);
          setLoading(false);
          return;
        }

        if (subcategoryId && categoryId && !vocabularyService.isSubcategoryAvailable(categoryId, subcategoryId)) {
          setError('This subcategory is not available in demo mode. Please sign up for full access.');
          setVocabulary([]);
          setTotalCount(0);
          setLoading(false);
          return;
        }

        if (!vocabularyService.isLanguageAvailable(language)) {
          setError('This language is not available in demo mode. Please sign up for full access.');
          setVocabulary([]);
          setTotalCount(0);
          setLoading(false);
          return;
        }
      }

      // Load vocabulary using the demo-aware service
      const vocabularyData = await vocabularyService.getVocabulary({
        language,
        category: categoryId,
        subcategory: subcategoryId,
        limit,
        randomize,
        hasAudio,
        difficulty_level: difficultyLevel,
        curriculum_level: curriculumLevel
      });

      // Transform to GameVocabularyWord format
      const transformedVocabulary: GameVocabularyWord[] = vocabularyData.map(word => ({
        id: word.id,
        word: word.word,
        translation: word.translation,
        category: word.category,
        subcategory: word.subcategory,
        part_of_speech: word.part_of_speech,
        example_sentence: word.example_sentence,
        example_translation: word.example_translation,
        audio_url: word.audio_url,
        curriculum_level: word.curriculum_level
      }));

      setVocabulary(transformedVocabulary);
      setTotalCount(transformedVocabulary.length);

    } catch (err) {
      console.error('Error loading vocabulary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
      setVocabulary([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    loadVocabulary();
  };

  // Load vocabulary when parameters change
  useEffect(() => {
    loadVocabulary();
  }, [language, categoryId, subcategoryId, limit, randomize, hasAudio, difficultyLevel, curriculumLevel, enabled, isDemo, isAdmin]);

  return {
    vocabulary,
    loading,
    error,
    totalCount,
    refetch,
    isDemoRestricted: isDemo && !isAdmin,
    demoMessage: vocabularyService.getDemoLimitationMessage(),
    availableCategories: vocabularyService.getDemoAvailableCategories(),
    availableSubcategories: categoryId ? vocabularyService.getDemoAvailableSubcategories(categoryId) : []
  };
}

/**
 * Hook to get demo availability information without loading vocabulary
 */
export function useDemoAvailability() {
  const { isDemo, isAdmin } = useDemoAuth();
  const vocabularyService = createDemoVocabularyService(supabaseBrowser, isDemo, isAdmin);

  return {
    isDemoRestricted: isDemo && !isAdmin,
    isCategoryAvailable: (categoryId: string) => vocabularyService.isCategoryAvailable(categoryId),
    isSubcategoryAvailable: (categoryId: string, subcategoryId: string) => 
      vocabularyService.isSubcategoryAvailable(categoryId, subcategoryId),
    isLanguageAvailable: (languageCode: string) => vocabularyService.isLanguageAvailable(languageCode),
    getDemoStats: () => vocabularyService.getDemoStats(),
    getDemoMessage: () => vocabularyService.getDemoLimitationMessage(),
    getAvailableCategories: () => vocabularyService.getDemoAvailableCategories(),
    getAvailableSubcategories: (categoryId: string) => vocabularyService.getDemoAvailableSubcategories(categoryId)
  };
}

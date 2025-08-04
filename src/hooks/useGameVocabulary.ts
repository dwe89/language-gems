'use client';

import { useState, useEffect } from 'react';
import { useVocabularyByCategory } from './useVocabulary';
import { supabaseBrowser } from '../components/auth/AuthProvider';

export interface GameVocabularyWord {
  id: string;
  word: string;
  translation: string;
  category?: string;
  subcategory?: string;
  part_of_speech?: string;
  example_sentence?: string;
  example_translation?: string;
  audio_url?: string;
  curriculum_level?: string;
}

interface UseGameVocabularyProps {
  language: string;
  categoryId?: string;
  subcategoryId?: string;
  limit?: number;
  randomize?: boolean;
  hasAudio?: boolean;
  difficultyLevel?: string;
  curriculumLevel?: string;
  enabled?: boolean; // Allow disabling the hook
}

interface UseGameVocabularyReturn {
  vocabulary: GameVocabularyWord[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => void;
}

/**
 * Unified hook for games to get vocabulary with category filtering
 * This replaces the individual vocabulary loading logic in each game
 */
export function useGameVocabulary({
  language,
  categoryId,
  subcategoryId,
  limit = 100,
  randomize = true,
  hasAudio = false,
  difficultyLevel,
  curriculumLevel,
  enabled = true
}: UseGameVocabularyProps): UseGameVocabularyReturn {
  const [vocabulary, setVocabulary] = useState<GameVocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Use the existing category hook when category is selected
  const {
    vocabulary: categoryVocabulary,
    loading: categoryLoading,
    error: categoryError
  } = useVocabularyByCategory({
    language,
    categoryId: categoryId || undefined,
    subcategoryId: subcategoryId || undefined,
    difficultyLevel,
    curriculumLevel
  });

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
      // If category is selected, use the hook result
      if (categoryId && categoryVocabulary) {
        const transformedVocabulary: GameVocabularyWord[] = categoryVocabulary
          .filter(item => item.word && item.translation)
          .filter(item => !hasAudio || item.audio_url) // Filter by audio if required
          .map(item => ({
            id: item.id,
            word: item.word || '',
            translation: item.translation || '',
            category: item.category,
            subcategory: item.subcategory,
            part_of_speech: item.part_of_speech,
            example_sentence: item.example_sentence,
            example_translation: item.example_translation,
            audio_url: item.audio_url,
            curriculum_level: item.curriculum_level
          }));

        // Randomize if requested
        if (randomize) {
          transformedVocabulary.sort(() => Math.random() - 0.5);
        }

        // Apply limit
        const limitedVocabulary = transformedVocabulary.slice(0, limit);

        setVocabulary(limitedVocabulary);
        setTotalCount(transformedVocabulary.length);
        setLoading(false);
        return;
      }

      // If no category selected, load vocabulary for the language with proper limits
      let query = supabaseBrowser
        .from('centralized_vocabulary')
        .select('*', { count: 'exact' })
        .eq('language', language)
        .not('word', 'is', null)
        .not('translation', 'is', null);

      // Apply filters
      if (hasAudio) {
        query = query.not('audio_url', 'is', null);
      }

      // Note: difficulty_level column doesn't exist in centralized_vocabulary
      // Difficulty filtering is handled by curriculum_level instead

      if (curriculumLevel) {
        query = query.or(`curriculum_level.ilike.%${curriculumLevel}%,curriculum_level.is.null`);
      }

      // Apply limit and ordering
      if (randomize) {
        // For randomization, get a reasonable sample size (max 1000) then randomize
        const sampleSize = Math.min(1000, limit * 10); // Get 10x the needed amount for better randomization
        const { data: sampleData, error: sampleError, count } = await query.limit(sampleSize);

        if (sampleError) throw sampleError;

        if (sampleData) {
          // Randomize and limit
          const randomizedData = sampleData.sort(() => Math.random() - 0.5).slice(0, limit);
          
          const transformedVocabulary: GameVocabularyWord[] = randomizedData.map(item => ({
            id: item.id,
            word: item.word || '',
            translation: item.translation || '',
            category: item.category,
            subcategory: item.subcategory,
            part_of_speech: item.part_of_speech,
            example_sentence: item.example_sentence,
            example_translation: item.example_translation,
            audio_url: item.audio_url,
            curriculum_level: item.curriculum_level
          }));

          setVocabulary(transformedVocabulary);
          setTotalCount(count || 0);
        }
      } else {
        // Non-randomized query with limit
        const { data, error: queryError, count } = await query.limit(limit);
        
        if (queryError) throw queryError;
        
        if (data) {
          const transformedVocabulary: GameVocabularyWord[] = data.map(item => ({
            id: item.id,
            word: item.word || '',
            translation: item.translation || '',
            category: item.category,
            subcategory: item.subcategory,
            part_of_speech: item.part_of_speech,
            example_sentence: item.example_sentence,
            example_translation: item.example_translation,
            audio_url: item.audio_url,
            curriculum_level: item.curriculum_level
          }));

          setVocabulary(transformedVocabulary);
          setTotalCount(count || 0);
        }
      }

    } catch (err) {
      console.error('Error loading vocabulary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
      
      // Fallback to Spanish animals if everything fails
      try {
        const { data: fallbackData } = await supabaseBrowser
          .from('centralized_vocabulary')
          .select('*')
          .eq('language', 'es')
          .eq('category', 'animals')
          .limit(20);
          
        if (fallbackData) {
          const fallbackVocabulary: GameVocabularyWord[] = fallbackData.map(item => ({
            id: item.id,
            word: item.word || '',
            translation: item.translation || '',
            category: item.category,
            subcategory: item.subcategory,
            part_of_speech: item.part_of_speech,
            example_sentence: item.example_sentence,
            example_translation: item.example_translation,
            audio_url: item.audio_url,
            curriculum_level: item.curriculum_level
          }));
          
          setVocabulary(fallbackVocabulary);
          setTotalCount(fallbackVocabulary.length);
        }
      } catch (fallbackError) {
        console.error('Fallback vocabulary loading failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load vocabulary when parameters change
  useEffect(() => {
    loadVocabulary();
  }, [language, categoryId, subcategoryId, limit, randomize, hasAudio, difficultyLevel, curriculumLevel, enabled]);

  // Handle category hook updates
  useEffect(() => {
    if (categoryId && !categoryLoading && categoryVocabulary) {
      loadVocabulary();
    }
  }, [categoryVocabulary, categoryLoading]);

  // Handle category hook errors
  useEffect(() => {
    if (categoryError) {
      setError(categoryError);
      setLoading(false);
    }
  }, [categoryError]);

  const refetch = () => {
    loadVocabulary();
  };

  return {
    vocabulary,
    loading: loading || (categoryId ? categoryLoading : false),
    error: error || categoryError,
    totalCount,
    refetch
  };
}

/**
 * Helper function to transform vocabulary for specific game needs
 */
export function transformVocabularyForGame(
  vocabulary: GameVocabularyWord[],
  gameType: 'hangman' | 'memory' | 'scramble' | 'association' | 'guesser'
): any[] {
  switch (gameType) {
    case 'hangman':
      return vocabulary.map(word => word.word);
      
    case 'memory':
      return vocabulary.map(word => ({
        spanish: word.word,
        english: word.translation,
        audio_url: word.audio_url
      }));
      
    case 'scramble':
      return vocabulary.map(word => ({
        word: word.word,
        translation: word.translation,
        difficulty: word.curriculum_level || 'beginner'
      }));
      
    case 'association':
      return vocabulary.map(word => ({
        prompt: word.word,
        translation: word.translation,
        category: word.category
      }));
      
    case 'guesser':
      return vocabulary.map(word => word.word);
      
    default:
      return vocabulary;
  }
}

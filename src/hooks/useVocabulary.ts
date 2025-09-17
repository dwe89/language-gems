import { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '../components/auth/AuthProvider';
import { useAuth } from '@/components/auth/AuthProvider';

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  language: string;
  category: string;
  subcategory?: string;
  part_of_speech?: string;
  difficulty_level?: string;
  curriculum_level?: string;
  example_sentence?: string;
  example_translation?: string;
  audio_url?: string;
  phonetic?: string;
  gender?: string;
  tags?: string[];
  article?: string;
  base_word?: string;
}

export interface UseVocabularyFiltersParams {
  language: string;
  categoryId?: string;
  subcategoryId?: string;
  difficultyLevel?: string;
  curriculumLevel?: string;
  examBoard?: string;
  tier?: string;
}

export function useVocabularyByCategory({
  language,
  categoryId,
  subcategoryId,
  difficultyLevel = 'beginner',
  curriculumLevel = 'KS3',
  examBoard,
  tier
}: UseVocabularyFiltersParams) {


  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!language) {
      return;
    }

    const fetchVocabulary = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabaseBrowser
          .from('centralized_vocabulary')
          .select('*')
          .eq('language', language);

        // Handle KS4 filtering differently - use theme_name and unit_name
        if (curriculumLevel === 'KS4') {
          // For KS4, map categoryId to theme_name
          if (categoryId) {
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

            const themeName = themeMapping[categoryId] || categoryId;
            query = query.like('theme_name', `%${themeName}%`);
          }

          // For KS4, subcategoryId is the unit_name
          if (subcategoryId) {
            query = query.like('unit_name', `%${subcategoryId}%`);
          }
        } else {
          // For KS3 and other levels, use category and subcategory fields
          if (categoryId) {
            query = query.eq('category', categoryId);
          }

          if (subcategoryId) {
            query = query.eq('subcategory', subcategoryId);
          }
        }
        // Note: If no subcategory is specified, we get all items from the category

        // Note: difficulty_level column doesn't exist in database, skipping difficulty filter
        // if (difficultyLevel && difficultyLevel !== 'beginner') {
        //   query = query.eq('difficulty_level', difficultyLevel);
        // }

        // Add curriculum level filter if specified (use ilike for partial matches)
        // Note: Skip curriculum level filtering for now as database uses different format (A1, A2) vs KS3
        if (curriculumLevel && curriculumLevel !== 'KS3') {
          query = query.or(`curriculum_level.ilike.%${curriculumLevel}%,curriculum_level.is.null`);
        }

        // Add KS4-specific filters
        if (curriculumLevel === 'KS4') {
          if (examBoard) {
            query = query.eq('exam_board_code', examBoard);
          }
          if (tier) {
            query = query.like('tier', `%${tier}%`);
          }
        }

        const { data, error: fetchError } = await query.limit(10000);

        console.log('🔍 [useVocabularyByCategory] Query debug:', {
          language,
          categoryId,
          subcategoryId,
          curriculumLevel,
          examBoard,
          tier,
          resultCount: data?.length || 0,
          error: fetchError,
          sampleResults: data?.slice(0, 3)?.map(item => ({
            category: item.category,
            subcategory: item.subcategory,
            word: item.word
          }))
        });

        if (fetchError) {
          console.error('❌ Database query error:', fetchError);
          throw fetchError;
        }
        
        setVocabulary(data || []);

        // If no results found and we have both category and subcategory, try fallback to category only
        if ((data?.length || 0) === 0 && categoryId && subcategoryId && curriculumLevel !== 'KS4') {
          console.log('🔄 [useVocabularyByCategory] No results found, trying category only fallback');
          
          let fallbackQuery = supabaseBrowser
            .from('centralized_vocabulary')
            .select('*')
            .eq('language', language)
            .eq('category', categoryId);

          const { data: fallbackData, error: fallbackError } = await fallbackQuery.limit(10000);
          
          if (!fallbackError && fallbackData && fallbackData.length > 0) {
            console.log('✅ [useVocabularyByCategory] Fallback found results:', {
              categoryOnly: categoryId,
              resultCount: fallbackData.length,
              availableSubcategories: [...new Set(fallbackData.map(item => item.subcategory).filter(Boolean))]
            });
            setVocabulary(fallbackData);
          }
        }
      } catch (err) {
        console.error('Error fetching vocabulary:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vocabulary');
        setVocabulary([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, [language, categoryId, subcategoryId, difficultyLevel, curriculumLevel, examBoard, tier]);

  return { vocabulary, loading, error, refetch: () => {
    // Trigger refetch by incrementing a dependency
  }};
}

export function useVocabularyStats(language: string = 'es') {
  const [stats, setStats] = useState<{
    totalWords: number;
    withAudio: number;
    byCategory: Record<string, number>;
  }>({
    totalWords: 0,
    withAudio: 0,
    byCategory: {}
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Get total words and audio count
        const { data: totalData } = await supabaseBrowser
          .from('centralized_vocabulary')
          .select('id, audio_url, category')
          .eq('language', language);

        if (totalData) {
          const totalWords = totalData.length;
          const withAudio = totalData.filter(item => item.audio_url).length;
          
          // Count by category
          const byCategory: Record<string, number> = {};
          totalData.forEach(item => {
            byCategory[item.category] = (byCategory[item.category] || 0) + 1;
          });

          setStats({
            totalWords,
            withAudio,
            byCategory
          });
        }
      } catch (error) {
        console.error('Error fetching vocabulary stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [language]);

  return { stats, loading };
}

// Extended VocabularyItem interface for flashcards
export interface FlashcardVocabularyItem extends VocabularyItem {
  srs_level: number;
  next_review: string;
  created_at: string;
  updated_at: string;
}

interface VocabularyStats {
  total: number;
  due: number;
  learned: number;
  mastered: number;
}

// Main useVocabulary hook for flashcards and SRS
export function useVocabulary() {
  const { user } = useAuth();
  const [vocabulary, setVocabulary] = useState<FlashcardVocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<VocabularyStats>({
    total: 0,
    due: 0,
    learned: 0,
    mastered: 0
  });

  // Load vocabulary from database
  const loadVocabulary = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabaseBrowser
        .from('user_flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match FlashcardVocabularyItem interface
      const transformedData: FlashcardVocabularyItem[] = (data || []).map(item => ({
        id: item.id,
        word: item.term || '',
        translation: item.definition || '',
        language: item.language || 'spanish',
        category: item.source_type || 'manual',
        example_sentence: item.example || undefined,
        srs_level: item.srs_level || 0,
        next_review: item.next_review || new Date().toISOString(),
        created_at: item.created_at,
        updated_at: item.updated_at || item.created_at
      }));

      setVocabulary(transformedData);

      // Calculate stats
      const now = new Date();
      const newStats = {
        total: transformedData.length,
        due: transformedData.filter(item => new Date(item.next_review) <= now).length,
        learned: transformedData.filter(item => item.srs_level > 0).length,
        mastered: transformedData.filter(item => item.srs_level >= 5).length
      };
      setStats(newStats);

    } catch (err: any) {
      console.error('Error loading vocabulary:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Add new word to vocabulary
  const addWord = useCallback(async (word: string, translation: string, language: string = 'spanish', context?: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabaseBrowser
        .from('user_flashcards')
        .insert({
          user_id: user.id,
          term: word,
          definition: translation,
          language: language,
          example: context || null,
          source_type: 'manual',
          srs_level: 0,
          next_review: new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newItem: FlashcardVocabularyItem = {
        id: data.id,
        word: data.term,
        translation: data.definition,
        language: data.language,
        category: 'manual',
        example_sentence: data.example || undefined,
        srs_level: 0,
        next_review: data.next_review,
        created_at: data.created_at,
        updated_at: data.created_at
      };

      setVocabulary(prev => [newItem, ...prev]);
      setStats(prev => ({ ...prev, total: prev.total + 1 }));

      return newItem;
    } catch (err: any) {
      console.error('Error adding word:', err);
      setError(err.message);
      return null;
    }
  }, [user]);

  // Review a word (update SRS level)
  const reviewWord = useCallback(async (wordId: string, correct: boolean) => {
    if (!user) return;

    try {
      const word = vocabulary.find(w => w.id === wordId);
      if (!word) return;

      let newLevel = word.srs_level;
      let nextReview = new Date();

      if (correct) {
        newLevel = Math.min(word.srs_level + 1, 10);
        // Calculate next review based on SRS algorithm
        const intervals = [1, 3, 7, 14, 30, 60, 120, 240, 480, 960]; // days
        const intervalDays = intervals[Math.min(newLevel - 1, intervals.length - 1)] || 1;
        nextReview.setDate(nextReview.getDate() + intervalDays);
      } else {
        newLevel = Math.max(word.srs_level - 1, 0);
        nextReview.setDate(nextReview.getDate() + 1); // Review again tomorrow
      }

      const { error } = await supabaseBrowser
        .from('user_flashcards')
        .update({
          srs_level: newLevel,
          next_review: nextReview.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', wordId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setVocabulary(prev => prev.map(item =>
        item.id === wordId
          ? { ...item, srs_level: newLevel, next_review: nextReview.toISOString() }
          : item
      ));

    } catch (err: any) {
      console.error('Error reviewing word:', err);
      setError(err.message);
    }
  }, [user, vocabulary]);

  // Get words that are due for review
  const getDueWords = useCallback(() => {
    const now = new Date();
    return vocabulary.filter(item => new Date(item.next_review) <= now);
  }, [vocabulary]);

  // Load vocabulary on mount and when user changes
  useEffect(() => {
    loadVocabulary();
  }, [loadVocabulary]);

  return {
    vocabulary,
    loading,
    error,
    stats,
    addWord,
    reviewWord,
    getDueWords,
    reload: loadVocabulary
  };
}

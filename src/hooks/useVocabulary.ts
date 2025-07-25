import { useState, useEffect } from 'react';
import { supabaseBrowser } from '../components/auth/AuthProvider';

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
}

export function useVocabularyByCategory({
  language,
  categoryId,
  subcategoryId,
  difficultyLevel = 'beginner',
  curriculumLevel = 'KS3'
}: UseVocabularyFiltersParams) {
  console.log('🔥🔥🔥 VOCABULARY HOOK CALLED 🔥🔥🔥', {
    language,
    categoryId,
    subcategoryId,
    difficultyLevel,
    curriculumLevel
  });

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!language) {
      console.log('useVocabularyByCategory: No language provided');
      return;
    }

    const fetchVocabulary = async () => {
      console.log('useVocabularyByCategory: Starting fetch with params:', {
        language,
        categoryId,
        subcategoryId,
        difficultyLevel,
        curriculumLevel
      });

      setLoading(true);
      setError(null);

      try {
        let query = supabaseBrowser
          .from('centralized_vocabulary')
          .select('*')
          .eq('language', language);

        // Add category filter if specified
        if (categoryId) {
          console.log('Adding category filter:', categoryId);
          query = query.eq('category', categoryId);
        }

        // Add subcategory filter if specified
        if (subcategoryId) {
          console.log('Adding subcategory filter:', subcategoryId);
          query = query.eq('subcategory', subcategoryId);
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

        console.log('🔍 About to execute query with filters:', {
          language,
          categoryId,
          subcategoryId,
          curriculumLevel,
          difficultyLevel
        });

        const { data, error: fetchError } = await query.limit(10000);

        if (fetchError) {
          console.error('❌ Database query error:', fetchError);
          throw fetchError;
        }

        console.log('✅ Fetched vocabulary:', data?.length || 0, 'items for language:', language, 'category:', categoryId, 'subcategory:', subcategoryId);
        
        setVocabulary(data || []);
      } catch (err) {
        console.error('Error fetching vocabulary:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vocabulary');
        setVocabulary([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, [language, categoryId, subcategoryId, difficultyLevel, curriculumLevel]);

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

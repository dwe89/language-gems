'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '../lib/supabase-client';

export interface SentenceItem {
  id: string;
  source_sentence: string;
  english_translation: string;
  source_language: string;
  category: string;
  subcategory: string;
  difficulty_level: string;
  curriculum_level: string;
  word_count: number;
  complexity_score: number;
}

interface UseSentencesParams {
  language: string;
  category?: string;
  subcategory?: string;
  curriculumLevel?: string;
  limit?: number;
}

interface UseSentencesReturn {
  sentences: SentenceItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to load sentences from the sentences table
 * Used by Sentence Towers game for free play mode
 */
export function useSentences({
  language,
  category,
  subcategory,
  curriculumLevel,
  limit = 50
}: UseSentencesParams): UseSentencesReturn {
  const [sentences, setSentences] = useState<SentenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSentences = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const supabase = createBrowserClient();

        // Map language codes to full names
        const languageMap: Record<string, string> = {
          'es': 'spanish',
          'fr': 'french',
          'de': 'german',
          'spanish': 'spanish',
          'french': 'french',
          'german': 'german'
        };
        const sourceLang = languageMap[language.toLowerCase()] || language;

        let query = supabase
          .from('sentences')
          .select('*')
          .eq('is_active', true)
          .eq('source_language', sourceLang);

        // Apply optional filters
        if (category) {
          query = query.eq('category', category);
        }

        if (subcategory) {
          query = query.eq('subcategory', subcategory);
        }

        if (curriculumLevel) {
          query = query.eq('curriculum_level', curriculumLevel);
        }

        // Limit results
        query = query.limit(limit);

        const { data, error: queryError } = await query;

        if (queryError) {
          console.error('❌ Error loading sentences:', queryError);
          throw queryError;
        }

        console.log(`✅ Loaded ${data?.length || 0} sentences for ${sourceLang}`);
        setSentences(data || []);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to load sentences:', err);
        setError(err instanceof Error ? err.message : 'Failed to load sentences');
        setSentences([]);
      } finally {
        setLoading(false);
      }
    };

    if (language) {
      loadSentences();
    }
  }, [language, category, subcategory, curriculumLevel, limit]);

  return { sentences, loading, error };
}


import { SupabaseClient } from '@supabase/supabase-js';

export interface CentralizedVocabularyWord {
  id: string;
  language: string; // 'es', 'fr', 'de'
  word: string;
  translation: string;
  audio_url?: string;
  category?: string; // 'animals', 'food', 'family', etc.
  difficulty_level?: string;
  part_of_speech?: string;
  metadata?: Record<string, any>; // Gender, IPA, etc.
  created_at?: string;
  updated_at?: string;
}

export interface VocabularyQuery {
  language?: string;
  category?: string;
  difficulty_level?: string;
  limit?: number;
  offset?: number;
  part_of_speech?: string;
  search?: string;
  excludeIds?: string[];
  randomize?: boolean;
  hasAudio?: boolean;
}

/**
 * Enhanced centralized vocabulary service for all Language Gems games
 * Works with the new centralized_vocabulary table supporting multiple languages
 */
export class CentralizedVocabularyService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get vocabulary words based on query parameters
   */
  async getVocabulary(query: VocabularyQuery = {}): Promise<CentralizedVocabularyWord[]> {
    try {
      let supabaseQuery = this.supabase
        .from('centralized_vocabulary')
        .select('*');

      // Apply filters
      if (query.language) {
        supabaseQuery = supabaseQuery.eq('language', query.language);
      }
      
      if (query.category) {
        supabaseQuery = supabaseQuery.eq('category', query.category);
      }
      
      if (query.difficulty_level) {
        supabaseQuery = supabaseQuery.eq('difficulty_level', query.difficulty_level);
      }
      
      if (query.part_of_speech) {
        supabaseQuery = supabaseQuery.eq('part_of_speech', query.part_of_speech);
      }

      if (query.hasAudio !== undefined) {
        if (query.hasAudio) {
          supabaseQuery = supabaseQuery.not('audio_url', 'is', null);
        } else {
          supabaseQuery = supabaseQuery.is('audio_url', null);
        }
      }
      
      if (query.search) {
        // Search in both word and translation
        supabaseQuery = supabaseQuery.or(
          `word.ilike.%${query.search}%,translation.ilike.%${query.search}%`
        );
      }

      if (query.excludeIds && query.excludeIds.length > 0) {
        supabaseQuery = supabaseQuery.not('id', 'in', `(${query.excludeIds.join(',')})`);
      }

      // Apply ordering (randomize if requested)
      if (query.randomize) {
        // Use PostgreSQL random() function for true randomization
        supabaseQuery = supabaseQuery.order('id', { ascending: false }); // Fallback ordering
      } else {
        supabaseQuery = supabaseQuery.order('word');
      }

      // Apply pagination
      if (query.limit) {
        supabaseQuery = supabaseQuery.limit(query.limit);
      } else {
        // Set a high default limit to avoid Supabase's 1000 row default limit
        supabaseQuery = supabaseQuery.limit(10000);
      }

      if (query.offset) {
        supabaseQuery = supabaseQuery.range(query.offset, query.offset + (query.limit || 20) - 1);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error('Vocabulary query error:', error);
        throw error;
      }

      // If randomize was requested and we have data, shuffle it
      if (query.randomize && data) {
        return this.shuffleArray([...data]);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching centralized vocabulary:', error);
      throw error;
    }
  }

  /**
   * Get vocabulary for a specific language and category
   */
  async getVocabularyByLanguageAndCategory(
    language: string, 
    category: string, 
    options: Omit<VocabularyQuery, 'language' | 'category'> = {}
  ): Promise<CentralizedVocabularyWord[]> {
    return this.getVocabulary({ ...options, language, category });
  }

  /**
   * Get vocabulary for Detective Listening Game (any language)
   */
  async getDetectiveListeningVocabulary(
    language: string = 'es', 
    count: number = 10
  ): Promise<CentralizedVocabularyWord[]> {
    return this.getVocabulary({
      language,
      category: 'animals', // Good for audio recognition
      limit: count,
      randomize: true,
      difficulty_level: 'beginner',
      hasAudio: true // Detective Listening requires audio
    });
  }

  /**
   * Get vocabulary for Memory Game (any language)
   */
  async getMemoryGameVocabulary(
    language: string = 'es', 
    count: number = 16
  ): Promise<CentralizedVocabularyWord[]> {
    return this.getVocabulary({
      language,
      limit: count,
      randomize: true,
      difficulty_level: 'beginner'
    });
  }

  /**
   * Get vocabulary for Speed Builder (any language)
   */
  async getSpeedBuilderVocabulary(
    language: string = 'es', 
    count: number = 20
  ): Promise<CentralizedVocabularyWord[]> {
    return this.getVocabulary({
      language,
      limit: count,
      randomize: true,
      difficulty_level: 'beginner'
    });
  }

  /**
   * Get available languages
   */
  async getAvailableLanguages(): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('centralized_vocabulary')
        .select('language')
        .not('language', 'is', null);

      if (error) {
        console.error('Error fetching languages:', error);
        throw error;
      }

      // Get unique languages
      const languages = [...new Set(data?.map(item => item.language).filter(Boolean))];
      return languages.sort();
    } catch (error) {
      console.error('Error getting available languages:', error);
      throw error;
    }
  }

  /**
   * Get available categories for a language
   */
  async getCategoriesForLanguage(language: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('centralized_vocabulary')
        .select('category')
        .eq('language', language)
        .not('category', 'is', null);

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      // Get unique categories
      const categories = [...new Set(data?.map(item => item.category).filter(Boolean))];
      return categories.sort();
    } catch (error) {
      console.error('Error getting categories for language:', error);
      throw error;
    }
  }

  /**
   * Add or update vocabulary word
   */
  async upsertVocabulary(vocabularyData: Omit<CentralizedVocabularyWord, 'id' | 'created_at' | 'updated_at'>): Promise<CentralizedVocabularyWord> {
    try {
      const { data, error } = await this.supabase
        .from('centralized_vocabulary')
        .upsert(vocabularyData)
        .select()
        .single();

      if (error) {
        console.error('Error upserting vocabulary:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error upserting vocabulary:', error);
      throw error;
    }
  }

  /**
   * Update audio URL for a vocabulary word
   */
  async updateAudioUrl(id: string, audioUrl: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('centralized_vocabulary')
        .update({ audio_url: audioUrl })
        .eq('id', id);

      if (error) {
        console.error('Error updating audio URL:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating audio URL:', error);
      throw error;
    }
  }

  /**
   * Get words that need audio generation
   */
  async getWordsNeedingAudio(language?: string): Promise<CentralizedVocabularyWord[]> {
    return this.getVocabulary({
      language,
      hasAudio: false,
      limit: 100 // Process in batches
    });
  }

  /**
   * Get comprehensive vocabulary statistics
   */
  async getVocabularyStats() {
    try {
      const { count: totalWords } = await this.supabase
        .from('centralized_vocabulary')
        .select('*', { count: 'exact', head: true });

      const { data: languageData } = await this.supabase
        .from('centralized_vocabulary')
        .select('language');

      const { data: categoryData } = await this.supabase
        .from('centralized_vocabulary')
        .select('category')
        .not('category', 'is', null);

      const { count: wordsWithAudio } = await this.supabase
        .from('centralized_vocabulary')
        .select('*', { count: 'exact', head: true })
        .not('audio_url', 'is', null);

      const languages = [...new Set(languageData?.map(item => item.language).filter(Boolean))];
      const categories = [...new Set(categoryData?.map(item => item.category).filter(Boolean))];

      // Get language-specific counts
      const languageStats = await Promise.all(
        languages.map(async (language) => {
          const { count } = await this.supabase
            .from('centralized_vocabulary')
            .select('*', { count: 'exact', head: true })
            .eq('language', language);
          
          const { count: audioCount } = await this.supabase
            .from('centralized_vocabulary')
            .select('*', { count: 'exact', head: true })
            .eq('language', language)
            .not('audio_url', 'is', null);

          return {
            language,
            wordCount: count || 0,
            audioCount: audioCount || 0
          };
        })
      );

      return {
        totalWords: totalWords || 0,
        totalLanguages: languages.length,
        totalCategories: categories.length,
        wordsWithAudio: wordsWithAudio || 0,
        languages,
        categories,
        languageStats
      };
    } catch (error) {
      console.error('Error getting vocabulary stats:', error);
      throw error;
    }
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

/**
 * Helper function to create a centralized vocabulary service instance
 */
export function createCentralizedVocabularyService(supabase: SupabaseClient): CentralizedVocabularyService {
  return new CentralizedVocabularyService(supabase);
}

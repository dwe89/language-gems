import { SupabaseClient } from '@supabase/supabase-js';

export interface VocabularyWord {
  id: number;
  theme?: string;
  topic?: string;
  part_of_speech?: string;
  spanish?: string;
  english?: string;
  gem_type?: string;
  gem_color?: string;
  frequency_score?: number;
  difficulty_level?: string;
}

export interface VocabularyQuery {
  theme?: string;
  topic?: string;
  difficulty_level?: string;
  gem_type?: string;
  limit?: number;
  offset?: number;
  part_of_speech?: string;
  search?: string;
  language_pair?: 'spanish_english' | 'french_english' | 'german_english';
  excludeIds?: number[];
  randomize?: boolean;
}

/**
 * Centralized vocabulary service for all Language Gems games
 * Provides consistent access to vocabulary data across Detective Listening,
 * Memory Game, Speed Builder, and other games
 */
export class VocabularyService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get vocabulary words based on query parameters
   */
  async getVocabulary(query: VocabularyQuery = {}): Promise<VocabularyWord[]> {
    try {
      let supabaseQuery = this.supabase
        .from('vocabulary')
        .select('*');

      // Apply filters
      if (query.theme) {
        supabaseQuery = supabaseQuery.eq('theme', query.theme);
      }
      
      if (query.topic) {
        supabaseQuery = supabaseQuery.eq('topic', query.topic);
      }
      
      if (query.difficulty_level) {
        supabaseQuery = supabaseQuery.eq('difficulty_level', query.difficulty_level);
      }
      
      if (query.gem_type) {
        supabaseQuery = supabaseQuery.eq('gem_type', query.gem_type);
      }
      
      if (query.part_of_speech) {
        supabaseQuery = supabaseQuery.eq('part_of_speech', query.part_of_speech);
      }
      
      if (query.search) {
        // Search in both Spanish and English words
        supabaseQuery = supabaseQuery.or(
          `spanish.ilike.%${query.search}%,english.ilike.%${query.search}%`
        );
      }

      if (query.excludeIds && query.excludeIds.length > 0) {
        supabaseQuery = supabaseQuery.not('id', 'in', `(${query.excludeIds.join(',')})`);
      }

      // Apply ordering (randomize if requested)
      if (query.randomize) {
        // Use a simple random ordering
        supabaseQuery = supabaseQuery.order('id', { ascending: false });
      }

      // Apply pagination
      if (query.limit) {
        supabaseQuery = supabaseQuery.limit(query.limit);
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
      console.error('Error fetching vocabulary:', error);
      throw error;
    }
  }

  /**
   * Get vocabulary for specific themes (animals, colors, etc.)
   */
  async getVocabularyByTheme(theme: string, options: Omit<VocabularyQuery, 'theme'> = {}): Promise<VocabularyWord[]> {
    return this.getVocabulary({ ...options, theme });
  }

  /**
   * Get vocabulary for Detective Listening Game
   * Focuses on themes like animals, household items, etc.
   */
  async getDetectiveListeningVocabulary(count: number = 10): Promise<VocabularyWord[]> {
    return this.getVocabulary({
      theme: 'Animals', // Popular theme for detective listening
      limit: count,
      randomize: true,
      difficulty_level: 'beginner' // Start with easier words
    });
  }

  /**
   * Get vocabulary for Memory Game
   * Good mix of difficulty levels and themes
   */
  async getMemoryGameVocabulary(count: number = 16): Promise<VocabularyWord[]> {
    return this.getVocabulary({
      limit: count,
      randomize: true,
      difficulty_level: 'intermediate'
    });
  }

  /**
   * Get vocabulary for Speed Builder
   * Focus on common words for sentence building
   */
  async getSpeedBuilderVocabulary(count: number = 20): Promise<VocabularyWord[]> {
    return this.getVocabulary({
      gem_type: 'common',
      limit: count,
      randomize: true
    });
  }

  /**
   * Get unique themes available in vocabulary
   */
  async getAvailableThemes(): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('vocabulary')
        .select('theme')
        .not('theme', 'is', null);

      if (error) {
        console.error('Error fetching themes:', error);
        throw error;
      }

      // Get unique themes
      const themes = [...new Set(data?.map(item => item.theme).filter(Boolean))];
      return themes.sort();
    } catch (error) {
      console.error('Error getting available themes:', error);
      throw error;
    }
  }

  /**
   * Get unique topics for a given theme
   */
  async getTopicsForTheme(theme: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from('vocabulary')
        .select('topic')
        .eq('theme', theme)
        .not('topic', 'is', null);

      if (error) {
        console.error('Error fetching topics:', error);
        throw error;
      }

      // Get unique topics
      const topics = [...new Set(data?.map(item => item.topic).filter(Boolean))];
      return topics.sort();
    } catch (error) {
      console.error('Error getting topics for theme:', error);
      throw error;
    }
  }

  /**
   * Get vocabulary statistics
   */
  async getVocabularyStats() {
    try {
      const { count: totalWords } = await this.supabase
        .from('vocabulary')
        .select('*', { count: 'exact', head: true });

      const { data: themeData } = await this.supabase
        .from('vocabulary')
        .select('theme')
        .not('theme', 'is', null);

      const { data: difficultyData } = await this.supabase
        .from('vocabulary')
        .select('difficulty_level')
        .not('difficulty_level', 'is', null);

      const themes = [...new Set(themeData?.map(item => item.theme).filter(Boolean))];
      const difficulties = [...new Set(difficultyData?.map(item => item.difficulty_level).filter(Boolean))];

      return {
        totalWords,
        totalThemes: themes.length,
        themes,
        difficulties
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
 * Helper function to create a vocabulary service instance
 */
export function createVocabularyService(supabase: SupabaseClient): VocabularyService {
  return new VocabularyService(supabase);
}

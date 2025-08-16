/**
 * Assessment Sentence Service
 * 
 * Handles loading and managing sentences for assessment creation.
 * Integrates with the sentences table to provide content for listening and reading assessments.
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface SentenceFilter {
  language: 'spanish' | 'french' | 'german';
  category?: string;
  subcategory?: string;
  theme?: string;
  topic?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  minLength?: number;
  maxLength?: number;
  limit?: number;
}

export interface AssessmentSentence {
  id: string;
  source_sentence: string;
  english_translation: string;
  source_language: string;
  category: string;
  subcategory: string;
  difficulty_level: string;
  word_count: number;
  complexity_score: number;
  audio_url?: string;
  created_at: string;
}

export interface SentenceStats {
  totalSentences: number;
  averageLength: number;
  difficultyDistribution: Record<string, number>;
  categories: string[];
  subcategories: string[];
}

export class AssessmentSentenceService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Load sentences for assessment creation based on filters
   */
  async loadSentences(filter: SentenceFilter): Promise<AssessmentSentence[]> {
    try {
      let query = this.supabase
        .from('sentences')
        .select('*')
        .eq('is_active', true)
        .eq('is_public', true);

      // Apply language filter
      const languageMap = {
        'spanish': 'spanish',
        'french': 'french', 
        'german': 'german'
      };
      query = query.eq('source_language', languageMap[filter.language]);

      // Apply category/subcategory filters
      if (filter.category) {
        query = query.eq('category', filter.category);
      }

      if (filter.subcategory) {
        query = query.eq('subcategory', filter.subcategory);
      }

      // Apply difficulty filter
      if (filter.difficulty) {
        query = query.eq('difficulty_level', filter.difficulty);
      }

      // Apply length filters
      if (filter.minLength) {
        query = query.gte('word_count', filter.minLength);
      }

      if (filter.maxLength) {
        query = query.lte('word_count', filter.maxLength);
      }

      // Apply limit
      if (filter.limit) {
        query = query.limit(filter.limit);
      }

      // Order by complexity for better assessment progression
      query = query.order('complexity_score', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error loading sentences:', error);
        throw new Error(`Failed to load sentences: ${error.message}`);
      }

      return data || [];

    } catch (error) {
      console.error('AssessmentSentenceService.loadSentences error:', error);
      throw error;
    }
  }

  /**
   * Get sentence statistics for a given filter
   */
  async getSentenceStats(filter: Omit<SentenceFilter, 'limit'>): Promise<SentenceStats> {
    try {
      let query = this.supabase
        .from('sentences')
        .select('word_count, difficulty_level, category, subcategory')
        .eq('is_active', true)
        .eq('is_public', true);

      // Apply language filter
      const languageMap = {
        'spanish': 'spanish',
        'french': 'french',
        'german': 'german'
      };
      query = query.eq('source_language', languageMap[filter.language]);

      // Apply category/subcategory filters
      if (filter.category) {
        query = query.eq('category', filter.category);
      }

      if (filter.subcategory) {
        query = query.eq('subcategory', filter.subcategory);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to get sentence stats: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return {
          totalSentences: 0,
          averageLength: 0,
          difficultyDistribution: {},
          categories: [],
          subcategories: []
        };
      }

      // Calculate statistics
      const totalSentences = data.length;
      const averageLength = data.reduce((sum, s) => sum + (s.word_count || 0), 0) / totalSentences;
      
      const difficultyDistribution = data.reduce((acc, s) => {
        const difficulty = s.difficulty_level || 'unknown';
        acc[difficulty] = (acc[difficulty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const categories = [...new Set(data.map(s => s.category).filter(Boolean))];
      const subcategories = [...new Set(data.map(s => s.subcategory).filter(Boolean))];

      return {
        totalSentences,
        averageLength: Math.round(averageLength * 10) / 10,
        difficultyDistribution,
        categories,
        subcategories
      };

    } catch (error) {
      console.error('AssessmentSentenceService.getSentenceStats error:', error);
      throw error;
    }
  }

  /**
   * Get available categories for a language
   */
  async getAvailableCategories(language: 'spanish' | 'french' | 'german'): Promise<string[]> {
    try {
      const languageMap = {
        'spanish': 'spanish',
        'french': 'french',
        'german': 'german'
      };

      const { data, error } = await this.supabase
        .from('sentences')
        .select('category')
        .eq('is_active', true)
        .eq('is_public', true)
        .eq('source_language', languageMap[language]);

      if (error) {
        throw new Error(`Failed to get categories: ${error.message}`);
      }

      const categories = [...new Set(data?.map(s => s.category).filter(Boolean) || [])];
      return categories.sort();

    } catch (error) {
      console.error('AssessmentSentenceService.getAvailableCategories error:', error);
      return [];
    }
  }

  /**
   * Get available subcategories for a language and category
   */
  async getAvailableSubcategories(
    language: 'spanish' | 'french' | 'german',
    category?: string
  ): Promise<string[]> {
    try {
      const languageMap = {
        'spanish': 'spanish',
        'french': 'french',
        'german': 'german'
      };

      let query = this.supabase
        .from('sentences')
        .select('subcategory')
        .eq('is_active', true)
        .eq('is_public', true)
        .eq('source_language', languageMap[language]);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to get subcategories: ${error.message}`);
      }

      const subcategories = [...new Set(data?.map(s => s.subcategory).filter(Boolean) || [])];
      return subcategories.sort();

    } catch (error) {
      console.error('AssessmentSentenceService.getAvailableSubcategories error:', error);
      return [];
    }
  }

  /**
   * Validate sentence configuration for assessment creation
   */
  async validateSentenceConfig(filter: SentenceFilter): Promise<{
    isValid: boolean;
    sentenceCount: number;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const sentences = await this.loadSentences({ ...filter, limit: 100 });
      const stats = await this.getSentenceStats(filter);

      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check minimum sentence count
      if (sentences.length === 0) {
        issues.push('No sentences found for the selected criteria');
      } else if (sentences.length < 5) {
        issues.push(`Only ${sentences.length} sentences found - minimum 5 recommended for assessments`);
      }

      // Check difficulty distribution
      const difficulties = Object.keys(stats.difficultyDistribution);
      if (difficulties.length === 1) {
        recommendations.push('Consider including multiple difficulty levels for better assessment progression');
      }

      // Check sentence length variety
      if (stats.averageLength < 3) {
        recommendations.push('Sentences are quite short - consider including longer sentences for reading comprehension');
      } else if (stats.averageLength > 15) {
        recommendations.push('Sentences are quite long - consider including shorter sentences for variety');
      }

      return {
        isValid: issues.length === 0,
        sentenceCount: sentences.length,
        issues,
        recommendations
      };

    } catch (error) {
      console.error('AssessmentSentenceService.validateSentenceConfig error:', error);
      return {
        isValid: false,
        sentenceCount: 0,
        issues: ['Failed to validate sentence configuration'],
        recommendations: []
      };
    }
  }

  /**
   * Generate assessment-ready sentence sets
   */
  async generateAssessmentSentenceSet(
    filter: SentenceFilter,
    assessmentType: 'listening' | 'reading',
    questionCount: number = 10
  ): Promise<{
    sentences: AssessmentSentence[];
    metadata: {
      totalAvailable: number;
      averageDifficulty: string;
      estimatedTime: number;
      skillsFocused: string[];
    };
  }> {
    try {
      // Load more sentences than needed for selection
      const allSentences = await this.loadSentences({
        ...filter,
        limit: questionCount * 3
      });

      if (allSentences.length === 0) {
        throw new Error('No sentences available for assessment generation');
      }

      // Select best sentences for assessment
      let selectedSentences: AssessmentSentence[];

      if (assessmentType === 'listening') {
        // For listening: prefer shorter, clearer sentences
        selectedSentences = allSentences
          .filter(s => s.word_count <= 12)
          .sort((a, b) => a.complexity_score - b.complexity_score)
          .slice(0, questionCount);
      } else {
        // For reading: allow longer, more complex sentences
        selectedSentences = allSentences
          .sort((a, b) => a.complexity_score - b.complexity_score)
          .slice(0, questionCount);
      }

      // Calculate metadata
      const avgComplexity = selectedSentences.reduce((sum, s) => sum + s.complexity_score, 0) / selectedSentences.length;
      const averageDifficulty = avgComplexity < 2 ? 'beginner' : avgComplexity < 4 ? 'intermediate' : 'advanced';
      
      const estimatedTime = assessmentType === 'listening' 
        ? questionCount * 2 // 2 minutes per listening question
        : questionCount * 1.5; // 1.5 minutes per reading question

      const skillsFocused = assessmentType === 'listening' 
        ? ['Audio Comprehension', 'Vocabulary Recognition', 'Listening Skills']
        : ['Reading Comprehension', 'Text Analysis', 'Vocabulary Understanding'];

      return {
        sentences: selectedSentences,
        metadata: {
          totalAvailable: allSentences.length,
          averageDifficulty,
          estimatedTime: Math.round(estimatedTime),
          skillsFocused
        }
      };

    } catch (error) {
      console.error('AssessmentSentenceService.generateAssessmentSentenceSet error:', error);
      throw error;
    }
  }
}

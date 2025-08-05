/**
 * Unified Vocabulary Analytics Service
 * Single source of truth for all vocabulary statistics and analysis
 * Uses word_performance_logs as the primary data source
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  language: string;
  category?: string;
  subcategory?: string;
  curriculum_level?: string;
  part_of_speech?: string;
  example_sentence?: string;
  
  // Performance metrics
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  averageResponseTime: number;
  lastPracticed: Date;
  masteryLevel: number;
  
  // Classification
  isWeak: boolean;
  isStrong: boolean;
  needsReview: boolean;
}

export interface VocabularyStats {
  totalWords: number;
  weakWords: number;
  strongWords: number;
  averageAccuracy: number;
  totalAttempts: number;
  totalCorrectAttempts: number;
  averageResponseTime: number;
  lastActivity: Date | null;
  
  // Breakdown by categories
  byLanguage: Record<string, VocabularyLanguageStats>;
  byCategory: Record<string, VocabularyCategoryStats>;
  byCurriculumLevel: Record<string, VocabularyCurriculumStats>;
}

export interface VocabularyLanguageStats {
  totalWords: number;
  weakWords: number;
  strongWords: number;
  averageAccuracy: number;
  totalAttempts: number;
}

export interface VocabularyCategoryStats {
  totalWords: number;
  weakWords: number;
  strongWords: number;
  averageAccuracy: number;
  totalAttempts: number;
}

export interface VocabularyCurriculumStats {
  totalWords: number;
  weakWords: number;
  strongWords: number;
  averageAccuracy: number;
  totalAttempts: number;
}

export interface VocabularyFilters {
  language?: string;
  category?: string;
  subcategory?: string;
  curriculum_level?: string;
  minAttempts?: number;
  accuracyRange?: [number, number];
  dateRange?: [Date, Date];
}

export interface VocabularyRecommendation {
  type: 'practice' | 'review' | 'challenge';
  title: string;
  description: string;
  targetWords: string[];
  recommendedGames: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number; // minutes
}

// =====================================================
// UNIFIED VOCABULARY ANALYTICS SERVICE
// =====================================================

export class UnifiedVocabularyAnalytics {
  private supabase: SupabaseClient;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }

  // =====================================================
  // CORE ANALYTICS METHODS
  // =====================================================

  /**
   * Get comprehensive vocabulary statistics for a student
   */
  async getVocabularyStats(studentId: string, filters?: VocabularyFilters): Promise<VocabularyStats> {
    const cacheKey = `stats_${studentId}_${JSON.stringify(filters || {})}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Get all word performance data for the student
      const words = await this.getVocabularyWords(studentId, filters);
      
      // Calculate overall statistics
      const totalWords = words.length;
      const weakWords = words.filter(w => w.isWeak).length;
      const strongWords = words.filter(w => w.isStrong).length;
      const totalAttempts = words.reduce((sum, w) => sum + w.totalAttempts, 0);
      const totalCorrectAttempts = words.reduce((sum, w) => sum + w.correctAttempts, 0);
      const averageAccuracy = totalWords > 0 ? Math.round(words.reduce((sum, w) => sum + w.accuracy, 0) / totalWords) : 0;
      const averageResponseTime = totalWords > 0 ? Math.round(words.reduce((sum, w) => sum + w.averageResponseTime, 0) / totalWords) : 0;
      const lastActivity = words.length > 0 ? new Date(Math.max(...words.map(w => w.lastPracticed.getTime()))) : null;

      // Calculate breakdowns
      const byLanguage = this.calculateLanguageBreakdown(words);
      const byCategory = this.calculateCategoryBreakdown(words);
      const byCurriculumLevel = this.calculateCurriculumBreakdown(words);

      const stats: VocabularyStats = {
        totalWords,
        weakWords,
        strongWords,
        averageAccuracy,
        totalAttempts,
        totalCorrectAttempts,
        averageResponseTime,
        lastActivity,
        byLanguage,
        byCategory,
        byCurriculumLevel
      };

      this.setCachedData(cacheKey, stats);
      return stats;
    } catch (error) {
      console.error('Error getting vocabulary stats:', error);
      throw error;
    }
  }

  /**
   * Get detailed vocabulary words with performance data
   */
  async getVocabularyWords(studentId: string, filters?: VocabularyFilters): Promise<VocabularyWord[]> {
    const cacheKey = `words_${studentId}_${JSON.stringify(filters || {})}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Build the query to get word performance data
      let query = this.supabase
        .from('word_performance_logs')
        .select(`
          word_text,
          translation_text,
          language,
          curriculum_level,
          was_correct,
          response_time_ms,
          timestamp,
          vocabulary_id,
          enhanced_game_sessions!inner(student_id)
        `)
        .eq('enhanced_game_sessions.student_id', studentId);

      // Apply filters
      if (filters?.language) {
        query = query.eq('language', filters.language);
      }
      if (filters?.curriculum_level) {
        query = query.eq('curriculum_level', filters.curriculum_level);
      }
      if (filters?.dateRange) {
        query = query.gte('timestamp', filters.dateRange[0].toISOString())
                   .lte('timestamp', filters.dateRange[1].toISOString());
      }

      const { data: performanceData, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch performance data: ${error.message}`);
      }

      if (!performanceData || performanceData.length === 0) {
        return [];
      }

      // Group by word and calculate statistics
      const wordMap = new Map<string, any>();
      
      performanceData.forEach(record => {
        const key = `${record.word_text}_${record.language}`;
        if (!wordMap.has(key)) {
          wordMap.set(key, {
            word_text: record.word_text,
            translation_text: record.translation_text,
            language: record.language,
            curriculum_level: record.curriculum_level,
            vocabulary_id: record.vocabulary_id,
            attempts: [],
            response_times: []
          });
        }
        
        const wordData = wordMap.get(key);
        wordData.attempts.push(record.was_correct);
        wordData.response_times.push(record.response_time_ms);
        wordData.last_practiced = new Date(Math.max(
          wordData.last_practiced ? wordData.last_practiced.getTime() : 0,
          new Date(record.timestamp).getTime()
        ));
      });

      // Get vocabulary metadata for enrichment
      const vocabularyIds = Array.from(wordMap.values())
        .map(w => w.vocabulary_id)
        .filter(Boolean);

      let vocabularyMetadata = new Map();
      if (vocabularyIds.length > 0) {
        const { data: vocabData } = await this.supabase
          .from('centralized_vocabulary')
          .select('id, category, subcategory, part_of_speech, example_sentence')
          .in('id', vocabularyIds);

        if (vocabData) {
          vocabData.forEach(vocab => {
            vocabularyMetadata.set(vocab.id, vocab);
          });
        }
      }

      // Convert to VocabularyWord objects
      const words: VocabularyWord[] = Array.from(wordMap.values())
        .map(wordData => {
          const totalAttempts = wordData.attempts.length;
          const correctAttempts = wordData.attempts.filter(Boolean).length;
          const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
          const averageResponseTime = wordData.response_times.length > 0 
            ? Math.round(wordData.response_times.reduce((sum: number, time: number) => sum + time, 0) / wordData.response_times.length)
            : 0;

          const metadata = vocabularyMetadata.get(wordData.vocabulary_id) || {};

          // Apply minimum attempts filter
          if (filters?.minAttempts && totalAttempts < filters.minAttempts) {
            return null;
          }

          // Apply accuracy range filter
          if (filters?.accuracyRange && (accuracy < filters.accuracyRange[0] || accuracy > filters.accuracyRange[1])) {
            return null;
          }

          return {
            id: wordData.vocabulary_id || `${wordData.word_text}_${wordData.language}`,
            word: wordData.word_text,
            translation: wordData.translation_text,
            language: wordData.language,
            category: metadata.category,
            subcategory: metadata.subcategory,
            curriculum_level: wordData.curriculum_level,
            part_of_speech: metadata.part_of_speech,
            example_sentence: metadata.example_sentence,
            
            totalAttempts,
            correctAttempts,
            accuracy,
            averageResponseTime,
            lastPracticed: wordData.last_practiced || new Date(),
            masteryLevel: this.calculateMasteryLevel(accuracy, totalAttempts),
            
            isWeak: accuracy < 70,
            isStrong: accuracy >= 70,
            needsReview: this.needsReview(wordData.last_practiced, accuracy)
          } as VocabularyWord;
        })
        .filter(Boolean) as VocabularyWord[];

      // Apply category/subcategory filters after enrichment
      let filteredWords = words;
      if (filters?.category) {
        filteredWords = filteredWords.filter(w => w.category === filters.category);
      }
      if (filters?.subcategory) {
        filteredWords = filteredWords.filter(w => w.subcategory === filters.subcategory);
      }

      this.setCachedData(cacheKey, filteredWords);
      return filteredWords;
    } catch (error) {
      console.error('Error getting vocabulary words:', error);
      throw error;
    }
  }

  /**
   * Get weak words (accuracy < 70%) for targeted practice
   */
  async getWeakWords(studentId: string, filters?: VocabularyFilters, limit: number = 20): Promise<VocabularyWord[]> {
    const words = await this.getVocabularyWords(studentId, filters);
    return words
      .filter(w => w.isWeak)
      .sort((a, b) => a.accuracy - b.accuracy) // Weakest first
      .slice(0, limit);
  }

  /**
   * Get strong words (accuracy >= 70%) for review or challenge
   */
  async getStrongWords(studentId: string, filters?: VocabularyFilters, limit: number = 20): Promise<VocabularyWord[]> {
    const words = await this.getVocabularyWords(studentId, filters);
    return words
      .filter(w => w.isStrong)
      .sort((a, b) => b.accuracy - a.accuracy) // Strongest first
      .slice(0, limit);
  }

  /**
   * Get words that need review based on time since last practice and accuracy
   */
  async getWordsNeedingReview(studentId: string, filters?: VocabularyFilters): Promise<VocabularyWord[]> {
    const words = await this.getVocabularyWords(studentId, filters);
    return words
      .filter(w => w.needsReview)
      .sort((a, b) => a.lastPracticed.getTime() - b.lastPracticed.getTime()); // Oldest first
  }

  /**
   * Get AI-powered recommendations for vocabulary practice
   */
  async getRecommendations(studentId: string, filters?: VocabularyFilters): Promise<VocabularyRecommendation[]> {
    const stats = await this.getVocabularyStats(studentId, filters);
    const weakWords = await this.getWeakWords(studentId, filters, 10);
    const reviewWords = await this.getWordsNeedingReview(studentId, filters);

    const recommendations: VocabularyRecommendation[] = [];

    // High priority: Focus on weakest words
    if (weakWords.length > 0) {
      recommendations.push({
        type: 'practice',
        title: 'Focus on Weak Words',
        description: `Practice your ${weakWords.length} weakest words to improve overall accuracy`,
        targetWords: weakWords.slice(0, 5).map(w => w.word),
        recommendedGames: ['Word Scramble', 'Speed Builder', 'Conjugation Duel'],
        priority: 'high',
        estimatedTime: 15
      });
    }

    // Medium priority: Review old words
    if (reviewWords.length > 0) {
      recommendations.push({
        type: 'review',
        title: 'Review Previous Words',
        description: `Review ${reviewWords.length} words you haven't practiced recently`,
        targetWords: reviewWords.slice(0, 5).map(w => w.word),
        recommendedGames: ['Memory Match', 'Vocab Master'],
        priority: 'medium',
        estimatedTime: 10
      });
    }

    // Low priority: Challenge with strong words
    if (stats.strongWords > 10) {
      recommendations.push({
        type: 'challenge',
        title: 'Challenge Mode',
        description: 'Test your mastery with advanced vocabulary challenges',
        targetWords: [],
        recommendedGames: ['Word Towers', 'Detective Games'],
        priority: 'low',
        estimatedTime: 20
      });
    }

    return recommendations;
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  /**
   * Calculate mastery level based on accuracy and attempts
   */
  private calculateMasteryLevel(accuracy: number, attempts: number): number {
    if (attempts < 3) return 0; // Not enough data
    if (accuracy >= 90 && attempts >= 5) return 3; // Mastered
    if (accuracy >= 70 && attempts >= 3) return 2; // Proficient
    if (accuracy >= 50) return 1; // Learning
    return 0; // Struggling
  }

  /**
   * Determine if a word needs review
   */
  private needsReview(lastPracticed: Date, accuracy: number): boolean {
    if (!lastPracticed) return true;

    const daysSinceLastPractice = (Date.now() - lastPracticed.getTime()) / (1000 * 60 * 60 * 24);

    // Review schedule based on accuracy
    if (accuracy >= 90) return daysSinceLastPractice > 14; // 2 weeks
    if (accuracy >= 70) return daysSinceLastPractice > 7;  // 1 week
    if (accuracy >= 50) return daysSinceLastPractice > 3;  // 3 days
    return daysSinceLastPractice > 1; // 1 day for weak words
  }

  /**
   * Calculate language breakdown statistics
   */
  private calculateLanguageBreakdown(words: VocabularyWord[]): Record<string, VocabularyLanguageStats> {
    const breakdown: Record<string, VocabularyLanguageStats> = {};

    words.forEach(word => {
      if (!breakdown[word.language]) {
        breakdown[word.language] = {
          totalWords: 0,
          weakWords: 0,
          strongWords: 0,
          averageAccuracy: 0,
          totalAttempts: 0
        };
      }

      const stats = breakdown[word.language];
      stats.totalWords++;
      stats.totalAttempts += word.totalAttempts;
      if (word.isWeak) stats.weakWords++;
      if (word.isStrong) stats.strongWords++;
    });

    // Calculate average accuracy for each language
    Object.keys(breakdown).forEach(language => {
      const languageWords = words.filter(w => w.language === language);
      const totalAccuracy = languageWords.reduce((sum, w) => sum + w.accuracy, 0);
      breakdown[language].averageAccuracy = languageWords.length > 0
        ? Math.round(totalAccuracy / languageWords.length)
        : 0;
    });

    return breakdown;
  }

  /**
   * Calculate category breakdown statistics
   */
  private calculateCategoryBreakdown(words: VocabularyWord[]): Record<string, VocabularyCategoryStats> {
    const breakdown: Record<string, VocabularyCategoryStats> = {};

    words.forEach(word => {
      const category = word.category || 'Uncategorized';
      if (!breakdown[category]) {
        breakdown[category] = {
          totalWords: 0,
          weakWords: 0,
          strongWords: 0,
          averageAccuracy: 0,
          totalAttempts: 0
        };
      }

      const stats = breakdown[category];
      stats.totalWords++;
      stats.totalAttempts += word.totalAttempts;
      if (word.isWeak) stats.weakWords++;
      if (word.isStrong) stats.strongWords++;
    });

    // Calculate average accuracy for each category
    Object.keys(breakdown).forEach(category => {
      const categoryWords = words.filter(w => (w.category || 'Uncategorized') === category);
      const totalAccuracy = categoryWords.reduce((sum, w) => sum + w.accuracy, 0);
      breakdown[category].averageAccuracy = categoryWords.length > 0
        ? Math.round(totalAccuracy / categoryWords.length)
        : 0;
    });

    return breakdown;
  }

  /**
   * Calculate curriculum level breakdown statistics
   */
  private calculateCurriculumBreakdown(words: VocabularyWord[]): Record<string, VocabularyCurriculumStats> {
    const breakdown: Record<string, VocabularyCurriculumStats> = {};

    words.forEach(word => {
      const level = word.curriculum_level || 'Unknown';
      if (!breakdown[level]) {
        breakdown[level] = {
          totalWords: 0,
          weakWords: 0,
          strongWords: 0,
          averageAccuracy: 0,
          totalAttempts: 0
        };
      }

      const stats = breakdown[level];
      stats.totalWords++;
      stats.totalAttempts += word.totalAttempts;
      if (word.isWeak) stats.weakWords++;
      if (word.isStrong) stats.strongWords++;
    });

    // Calculate average accuracy for each curriculum level
    Object.keys(breakdown).forEach(level => {
      const levelWords = words.filter(w => (w.curriculum_level || 'Unknown') === level);
      const totalAccuracy = levelWords.reduce((sum, w) => sum + w.accuracy, 0);
      breakdown[level].averageAccuracy = levelWords.length > 0
        ? Math.round(totalAccuracy / levelWords.length)
        : 0;
    });

    return breakdown;
  }

  // =====================================================
  // CACHING METHODS
  // =====================================================

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Clear all cached data
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cached data for a specific student
   */
  public clearStudentCache(studentId: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => key.includes(studentId));
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

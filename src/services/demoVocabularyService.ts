'use client';

import { CentralizedVocabularyService, VocabularyQuery, CentralizedVocabularyWord } from './centralizedVocabularyService';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  getDemoVocabulary,
  getDemoAvailableLanguages,
  getDemoAvailableSubcategories,
  getDemoStats
} from '@/data/demoVocabulary';

// Define which categories are available in demo mode
// Selected "Basics & Core Language" as it's universally appealing and foundational
const DEMO_AVAILABLE_CATEGORIES = [
  'basics_core_language'
];

// Define which subcategories are available in demo mode for each category
// Selected 4 high-quality subcategories with good vocabulary coverage:
// - Greetings & Introductions: Essential for beginners (16-20 words per language)
// - Common Phrases: Practical everyday language (10-12 words per language)
// - Numbers 1-30: Universal and useful (21-39 words per language)
// - Colours: Visual and engaging (11-13 words per language)
const DEMO_AVAILABLE_SUBCATEGORIES: Record<string, string[]> = {
  'basics_core_language': [
    'greetings_introductions',
    'common_phrases',
    'numbers_1_30',
    'colours'
  ]
};

// Languages available in demo mode - ES, FR, DE all have excellent vocabulary coverage
const DEMO_AVAILABLE_LANGUAGES = getDemoAvailableLanguages();

export class DemoVocabularyService extends CentralizedVocabularyService {
  private isDemo: boolean;
  private isAdmin: boolean;

  constructor(supabase: SupabaseClient, isDemo: boolean = false, isAdmin: boolean = false) {
    super(supabase);
    this.isDemo = isDemo;
    this.isAdmin = isAdmin;
  }

  /**
   * Override the getVocabulary method to apply demo restrictions
   * For demo users, return local vocabulary data instead of database calls
   */
  async getVocabulary(query: VocabularyQuery = {}): Promise<CentralizedVocabularyWord[]> {
    // Admin users get unrestricted access
    if (this.isAdmin) {
      return super.getVocabulary(query);
    }

    // Non-demo users get unrestricted access
    if (!this.isDemo) {
      return super.getVocabulary(query);
    }

    // For demo users, use local vocabulary data
    return this.getDemoVocabularyLocal(query);
  }

  /**
   * Get vocabulary from local demo data (no database calls)
   */
  private getDemoVocabularyLocal(query: VocabularyQuery = {}): CentralizedVocabularyWord[] {
    const language = query.language || 'es';
    const subcategory = query.subcategory;

    // Check if language is available in demo
    if (!DEMO_AVAILABLE_LANGUAGES.includes(language)) {
      return [];
    }

    // Get demo vocabulary for the language
    const demoWords = getDemoVocabulary(language, subcategory);

    // Convert to CentralizedVocabularyWord format
    const convertedWords: CentralizedVocabularyWord[] = demoWords.map(demoWord => ({
      id: demoWord.id,
      word: demoWord.term, // CentralizedVocabularyWord uses 'word' not 'term'
      translation: demoWord.translation,
      language: demoWord.language,
      category: demoWord.category,
      subcategory: demoWord.subcategory,
      difficulty_level: demoWord.difficulty,
      // Optional fields
      audio_url: undefined,
      part_of_speech: undefined,
      example_sentence: undefined,
      example_translation: undefined,
      curriculum_level: undefined,
      tier: undefined,
      exam_board_code: undefined,
      theme_name: undefined,
      unit_name: undefined,
      metadata: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Apply limit if specified
    const limit = query.limit || 25;
    return convertedWords.slice(0, limit);
  }



  /**
   * Get available categories for demo mode
   */
  getDemoAvailableCategories(): string[] {
    if (this.isAdmin || !this.isDemo) {
      // Return all categories for non-demo users
      return [];
    }
    return DEMO_AVAILABLE_CATEGORIES;
  }

  /**
   * Get available subcategories for a category in demo mode
   */
  getDemoAvailableSubcategories(_categoryId: string): string[] {
    if (this.isAdmin || !this.isDemo) {
      // Return all subcategories for non-demo users
      return [];
    }
    return getDemoAvailableSubcategories('es'); // Use helper function
  }

  /**
   * Check if a category is available in demo mode
   */
  isCategoryAvailable(categoryId: string): boolean {
    if (this.isAdmin || !this.isDemo) {
      return true;
    }
    return DEMO_AVAILABLE_CATEGORIES.includes(categoryId);
  }

  /**
   * Check if a subcategory is available in demo mode
   */
  isSubcategoryAvailable(categoryId: string, subcategoryId: string): boolean {
    if (this.isAdmin || !this.isDemo) {
      return true;
    }
    const availableSubcategories = DEMO_AVAILABLE_SUBCATEGORIES[categoryId];
    return availableSubcategories?.includes(subcategoryId) || false;
  }

  /**
   * Check if a language is available in demo mode
   */
  isLanguageAvailable(languageCode: string): boolean {
    if (this.isAdmin || !this.isDemo) {
      return true;
    }
    return DEMO_AVAILABLE_LANGUAGES.includes(languageCode);
  }

  /**
   * Get demo limitation message for UI display
   */
  getDemoLimitationMessage(): string {
    if (!this.isDemo) {
      return '';
    }
    return 'Demo mode: Explore basic vocabulary in Spanish, French & German. Sign up for full access to 14+ categories and all languages!';
  }

  /**
   * Get demo statistics for display
   */
  getDemoStats(): {
    availableCategories: number;
    totalCategories: number;
    availableLanguages: number;
    totalLanguages: number;
    maxWordsPerSession: number;
  } {
    const stats = getDemoStats();
    return {
      availableCategories: stats.categories,
      totalCategories: 14, // Approximate total categories
      availableLanguages: stats.languages,
      totalLanguages: 4, // ES, FR, DE, IT
      maxWordsPerSession: 25
    };
  }
}

/**
 * Factory function to create a demo-aware vocabulary service
 */
export function createDemoVocabularyService(
  supabase: SupabaseClient, 
  isDemo: boolean = false, 
  isAdmin: boolean = false
): DemoVocabularyService {
  return new DemoVocabularyService(supabase, isDemo, isAdmin);
}

/**
 * Hook to create demo-aware vocabulary service with auth context
 */
export function useDemoVocabularyService(supabase: SupabaseClient) {
  // This would be used in components that need demo-aware vocabulary
  // The demo/admin status would be passed from the component's auth context
  return {
    createService: (isDemo: boolean, isAdmin: boolean) => 
      createDemoVocabularyService(supabase, isDemo, isAdmin)
  };
}

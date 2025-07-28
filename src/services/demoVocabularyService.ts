'use client';

import { CentralizedVocabularyService, VocabularyQuery, CentralizedVocabularyWord } from './centralizedVocabularyService';
import { SupabaseClient } from '@supabase/supabase-js';

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
// Total demo vocabulary: ES=77 words, FR=67 words, DE=59 words
const DEMO_AVAILABLE_LANGUAGES = ['es', 'fr', 'de'];

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

    // Apply demo restrictions
    const restrictedQuery = this.applyDemoRestrictions(query);
    
    // If the query is completely restricted, return empty array
    if (!restrictedQuery) {
      return [];
    }

    return super.getVocabulary(restrictedQuery);
  }

  /**
   * Apply demo restrictions to a vocabulary query
   */
  private applyDemoRestrictions(query: VocabularyQuery): VocabularyQuery | null {
    const restrictedQuery = { ...query };

    // Restrict language
    if (query.language && !DEMO_AVAILABLE_LANGUAGES.includes(query.language)) {
      return null; // Language not available in demo
    }
    
    // If no language specified, default to Spanish for demo
    if (!restrictedQuery.language) {
      restrictedQuery.language = 'es';
    }

    // Restrict category
    if (query.category) {
      if (!DEMO_AVAILABLE_CATEGORIES.includes(query.category)) {
        return null; // Category not available in demo
      }
    } else {
      // If no category specified, restrict to demo categories
      restrictedQuery.category = DEMO_AVAILABLE_CATEGORIES[0];
    }

    // Restrict subcategory
    if (query.subcategory && query.category) {
      const availableSubcategories = DEMO_AVAILABLE_SUBCATEGORIES[query.category];
      if (!availableSubcategories || !availableSubcategories.includes(query.subcategory)) {
        return null; // Subcategory not available in demo
      }
    }

    // Limit the number of words in demo mode to provide a good sample
    // while encouraging users to sign up for full access
    const demoLimit = Math.min(query.limit || 25, 25); // Max 25 words in demo
    restrictedQuery.limit = demoLimit;

    return restrictedQuery;
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
  getDemoAvailableSubcategories(categoryId: string): string[] {
    if (this.isAdmin || !this.isDemo) {
      // Return all subcategories for non-demo users
      return [];
    }
    return DEMO_AVAILABLE_SUBCATEGORIES[categoryId] || [];
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
    return {
      availableCategories: DEMO_AVAILABLE_CATEGORIES.length,
      totalCategories: 14, // Approximate total categories
      availableLanguages: DEMO_AVAILABLE_LANGUAGES.length,
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

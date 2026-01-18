/**
 * VocabularyStore - Offline-first vocabulary loading
 * 
 * This service provides vocabulary data for games with the following priority:
 * 1. Bundled JSON files (always available offline)
 * 2. Cached remote data (if previously fetched)
 * 3. Remote Supabase data (if online)
 */

export interface VocabularyWord {
    id: string;
    word: string;
    translation: string;
    gender?: 'm' | 'f' | 'n';
    example?: string;
    audioUrl?: string;
    category?: string;
    subcategory?: string;
}

export interface VocabularySubcategory {
    id: string;
    name: string;
    words: VocabularyWord[];
}

export interface VocabularyCategory {
    id: string;
    name: string;
    subcategories: VocabularySubcategory[];
}

export interface VocabularyBundle {
    language: string;
    tier: 'foundation' | 'higher' | 'all';
    lastUpdated: string;
    categories: VocabularyCategory[];
}

// Supported languages
export type SupportedLanguage = 'spanish' | 'french' | 'german';

// Cache for loaded vocabulary
const vocabularyCache: Map<string, VocabularyBundle> = new Map();

/**
 * Load bundled vocabulary from JSON files
 */
export async function loadBundledVocabulary(
    language: SupportedLanguage,
    tier: 'foundation' | 'higher' | 'all' = 'all'
): Promise<VocabularyBundle | null> {
    const cacheKey = `${language}-${tier}`;

    // Check cache first
    if (vocabularyCache.has(cacheKey)) {
        return vocabularyCache.get(cacheKey)!;
    }

    try {
        // Load from bundled JSON file
        const response = await fetch(`/data/vocabulary/${language}/${tier}.json`);

        if (!response.ok) {
            console.warn(`[VocabularyStore] No bundled vocabulary for ${language}/${tier}`);
            return null;
        }

        const data: VocabularyBundle = await response.json();

        // Cache it
        vocabularyCache.set(cacheKey, data);

        console.log(`[VocabularyStore] Loaded ${language} ${tier} vocabulary (${countWords(data)} words)`);

        return data;
    } catch (error) {
        console.error(`[VocabularyStore] Failed to load bundled vocabulary:`, error);
        return null;
    }
}

/**
 * Get vocabulary for a specific category
 */
export async function getVocabularyForCategory(
    language: SupportedLanguage,
    categoryId: string,
    subcategoryId?: string,
    tier: 'foundation' | 'higher' | 'all' = 'all'
): Promise<VocabularyWord[]> {
    const bundle = await loadBundledVocabulary(language, tier);

    if (!bundle) {
        console.warn(`[VocabularyStore] No vocabulary bundle found for ${language}`);
        return [];
    }

    const category = bundle.categories.find(c => c.id === categoryId);

    if (!category) {
        console.warn(`[VocabularyStore] Category ${categoryId} not found`);
        return [];
    }

    if (subcategoryId) {
        const subcategory = category.subcategories.find(s => s.id === subcategoryId);
        return subcategory?.words || [];
    }

    // Return all words from all subcategories
    return category.subcategories.flatMap(sub => sub.words);
}

/**
 * Get random vocabulary words for quick games
 */
export async function getRandomVocabulary(
    language: SupportedLanguage,
    count: number = 10,
    tier: 'foundation' | 'higher' | 'all' = 'all'
): Promise<VocabularyWord[]> {
    const bundle = await loadBundledVocabulary(language, tier);

    if (!bundle) {
        return [];
    }

    // Collect all words
    const allWords = bundle.categories.flatMap(cat =>
        cat.subcategories.flatMap(sub => sub.words)
    );

    // Shuffle and take first N
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Get all categories for a language
 */
export async function getCategories(
    language: SupportedLanguage,
    tier: 'foundation' | 'higher' | 'all' = 'all'
): Promise<VocabularyCategory[]> {
    const bundle = await loadBundledVocabulary(language, tier);
    return bundle?.categories || [];
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): SupportedLanguage[] {
    return ['spanish', 'french', 'german'];
}

/**
 * Count total words in a bundle
 */
function countWords(bundle: VocabularyBundle): number {
    return bundle.categories.reduce((total, cat) =>
        total + cat.subcategories.reduce((subTotal, sub) =>
            subTotal + sub.words.length, 0
        ), 0
    );
}

// Complete bundle cache
let completeBundleCache: CentralizedVocabularyWord[] | null = null;

export interface CentralizedVocabularyWord {
    id: string;
    language: string;
    word: string;
    translation: string;
    category?: string;
    subcategory?: string;
    curriculum_level?: string;
    tier?: string;
    exam_board_code?: string;
}

export interface FilterOptions {
    language: SupportedLanguage;
    curriculumLevel?: 'KS3' | 'KS4';
    tier?: 'foundation' | 'higher'; // For KS4
    examBoard?: string; // For KS4
    category?: string;
    subcategory?: string;
}

/**
 * Load the complete vocabulary bundle
 */
export async function loadCompleteBundle(): Promise<CentralizedVocabularyWord[]> {
    if (completeBundleCache) return completeBundleCache;

    try {
        const response = await fetch('/data/vocabulary/complete_bundle.json');
        if (!response.ok) throw new Error('Failed to load bundle');
        completeBundleCache = await response.json();
        return completeBundleCache || [];
    } catch (error) {
        console.error('[VocabularyStore] Failed to load complete bundle:', error);
        return [];
    }
}

/**
 * Get filtered vocabulary using the complete bundle
 */
export async function getFilteredVocabulary(filters: FilterOptions): Promise<VocabularyWord[]> {
    const allWords = await loadCompleteBundle();

    // Map supported language to DB code
    const langMap: Record<string, string> = { 'spanish': 'es', 'french': 'fr', 'german': 'de' };
    const langCode = langMap[filters.language];

    const filtered = allWords.filter(word => {
        // Language check
        if (word.language !== langCode) return false;

        // Curriculum Level
        if (filters.curriculumLevel && word.curriculum_level !== filters.curriculumLevel) return false;

        // Tier (only applies if tier is specified in word)
        // Note: Some words might be 'both' or null.
        if (filters.tier && word.tier && word.tier !== 'both' && !word.tier.includes(filters.tier)) return false;

        // Exam Board
        if (filters.examBoard && word.exam_board_code && word.exam_board_code !== filters.examBoard) return false;

        // Category
        if (filters.category && word.category !== filters.category) return false;

        // Subcategory
        if (filters.subcategory && word.subcategory !== filters.subcategory) return false;

        return true;
    });

    // Map to App VocabularyWord format
    return filtered.map(w => ({
        id: w.id,
        word: w.word,
        translation: w.translation,
        category: w.category,
        subcategory: w.subcategory,
    }));
}

/**
 * Get available categories for filters
 */
export async function getAvailableCategories(
    language: SupportedLanguage,
    curriculumLevel?: 'KS3' | 'KS4'
): Promise<string[]> {
    const allWords = await loadCompleteBundle();
    const langMap: Record<string, string> = { 'spanish': 'es', 'french': 'fr', 'german': 'de' };
    const langCode = langMap[language];

    const specificWords = allWords.filter(w =>
        w.language === langCode &&
        (!curriculumLevel || w.curriculum_level === curriculumLevel)
    );

    return Array.from(new Set(specificWords.map(w => w.category).filter(Boolean) as string[])).sort();
}

/**
 * Get available subcategories
 */
export async function getAvailableSubcategories(
    language: SupportedLanguage,
    category: string
): Promise<string[]> {
    const allWords = await loadCompleteBundle();
    const langMap: Record<string, string> = { 'spanish': 'es', 'french': 'fr', 'german': 'de' };
    const langCode = langMap[language];

    const specificWords = allWords.filter(w =>
        w.language === langCode &&
        w.category === category
    );

    return Array.from(new Set(specificWords.map(w => w.subcategory).filter(Boolean) as string[])).sort();
}

/**
 * Clear vocabulary cache (useful for testing/updates)
 */
export function clearVocabularyCache(): void {
    vocabularyCache.clear();
    completeBundleCache = null;
}

/**
 * Shareable Vocabulary Utilities
 * 
 * This module provides functions to encode and decode custom vocabulary
 * for shareable URLs. Users can share their custom vocabulary sets via
 * a link, which when opened will automatically load the vocabulary.
 * 
 * Format: The vocabulary is compressed using LZ-String and encoded as
 * base64 for URL-safe transport.
 */

import LZString from 'lz-string';

// Types
export interface ShareableVocabularyItem {
    t: string;  // term (shortened key for compact URLs)
    r: string;  // translation (r = "result" or "response")
    p?: string; // part of speech (optional)
    c?: string; // context sentence (optional)
}

export interface ShareableVocabularyData {
    v: number;  // version for future compatibility
    l?: string; // language code (optional)
    ct?: 'vocabulary' | 'sentences' | 'mixed'; // content type
    items: ShareableVocabularyItem[];
}

export interface DecodedVocabulary {
    language?: string;
    contentType?: 'vocabulary' | 'sentences' | 'mixed';
    items: Array<{
        term: string;
        translation: string;
        partOfSpeech?: string;
        contextSentence?: string;
    }>;
}

/**
 * Map game display names to their actual URL slugs
 * This ensures shareable links work correctly
 * 
 * Keys should be the DISPLAY NAME (what you pass to ShareVocabularyButton)
 * Values should be the actual URL path in /src/app/games/
 */
export const GAME_SLUG_MAP: Record<string, string> = {
    // Memory Match variations -> memory-game
    'memory match': 'memory-game',
    'memory-match': 'memory-game',
    'memorymatch': 'memory-game',

    // Hangman variations -> hangman
    'hangman': 'hangman',
    'vocabulary hangman': 'hangman',
    'vocabulary-hangman': 'hangman',
    'vocab hangman': 'hangman',
    'vocab-hangman': 'hangman',

    // Word Towers -> word-towers
    'word towers': 'word-towers',
    'word-towers': 'word-towers',
    'wordtowers': 'word-towers',

    // Sentence Towers -> sentence-towers
    'sentence towers': 'sentence-towers',
    'sentence-towers': 'sentence-towers',
    'sentencetowers': 'sentence-towers',

    // Vocab Blast -> vocab-blast
    'vocab blast': 'vocab-blast',
    'vocab-blast': 'vocab-blast',
    'vocabblast': 'vocab-blast',

    // Word Blast -> word-blast
    'word blast': 'word-blast',
    'word-blast': 'word-blast',
    'wordblast': 'word-blast',

    // Speed Builder / Sentence Sprint -> speed-builder
    'speed builder': 'speed-builder',
    'speed-builder': 'speed-builder',
    'speedbuilder': 'speed-builder',
    'sentence sprint': 'speed-builder',
    'sentence-sprint': 'speed-builder',
    'sentencesprint': 'speed-builder',

    // Noughts and Crosses / Tic Tac Toe -> noughts-and-crosses
    'noughts and crosses': 'noughts-and-crosses',
    'noughts-and-crosses': 'noughts-and-crosses',
    'noughtsandcrosses': 'noughts-and-crosses',
    'tic tac toe': 'noughts-and-crosses',
    'tic-tac-toe': 'noughts-and-crosses',
    'tictactoe': 'noughts-and-crosses',
    'vocabulary tic tac toe': 'noughts-and-crosses',
    'vocabulary-tic-tac-toe': 'noughts-and-crosses',

    // Conjugation Duel -> conjugation-duel
    'conjugation duel': 'conjugation-duel',
    'conjugation-duel': 'conjugation-duel',
    'conjugationduel': 'conjugation-duel',

    // Vocabulary Mining -> vocabulary-mining
    'vocabulary mining': 'vocabulary-mining',
    'vocabulary-mining': 'vocabulary-mining',
    'vocabularymining': 'vocabulary-mining',
    'vocab mining': 'vocabulary-mining',

    // Word Scramble -> word-scramble
    'word scramble': 'word-scramble',
    'word-scramble': 'word-scramble',
    'wordscramble': 'word-scramble',

    // Verb Quest -> verb-quest
    'verb quest': 'verb-quest',
    'verb-quest': 'verb-quest',
    'verbquest': 'verb-quest',

    // Lava Temple Word Restore -> lava-temple-word-restore
    'lava temple word restore': 'lava-temple-word-restore',
    'lava-temple-word-restore': 'lava-temple-word-restore',

    // Detective Listening -> detective-listening
    'detective listening': 'detective-listening',
    'detective-listening': 'detective-listening',

    // Case File Translator -> case-file-translator
    'case file translator': 'case-file-translator',
    'case-file-translator': 'case-file-translator',
};

/**
 * Convert a game name to its correct URL slug
 */
export function getGameSlug(gameName: string): string {
    // First try direct lookup
    const lowercaseName = gameName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    if (GAME_SLUG_MAP[lowercaseName]) {
        return GAME_SLUG_MAP[lowercaseName];
    }

    // Try without hyphens
    const noHyphens = lowercaseName.replace(/-/g, '');
    if (GAME_SLUG_MAP[noHyphens]) {
        return GAME_SLUG_MAP[noHyphens];
    }

    // Fallback to the processed name
    return lowercaseName;
}

/**
 * Encode vocabulary items into a shareable URL-safe string
 */
export function encodeVocabulary(
    items: Array<{ term: string; translation: string; partOfSpeech?: string; contextSentence?: string }>,
    options?: {
        language?: string;
        contentType?: 'vocabulary' | 'sentences' | 'mixed';
    }
): string {
    const data: ShareableVocabularyData = {
        v: 1, // Version 1
        items: items.map(item => ({
            t: item.term,
            r: item.translation,
            ...(item.partOfSpeech && { p: item.partOfSpeech }),
            ...(item.contextSentence && { c: item.contextSentence }),
        })),
        ...(options?.language && { l: options.language }),
        ...(options?.contentType && { ct: options.contentType }),
    };

    // Convert to JSON, compress with LZ-String, and encode as URL-safe base64
    const json = JSON.stringify(data);
    const compressed = LZString.compressToEncodedURIComponent(json);

    return compressed;
}

/**
 * Decode a shareable vocabulary string back into vocabulary items
 */
export function decodeVocabulary(encoded: string): DecodedVocabulary | null {
    try {
        // Decompress from URL-safe base64
        const json = LZString.decompressFromEncodedURIComponent(encoded);

        if (!json) {
            console.error('[ShareableVocabulary] Failed to decompress vocabulary data');
            return null;
        }

        const data: ShareableVocabularyData = JSON.parse(json);

        // Validate version
        if (data.v !== 1) {
            console.warn('[ShareableVocabulary] Unknown version:', data.v);
            // Still try to parse, but warn
        }

        // Convert short keys back to full property names
        return {
            language: data.l,
            contentType: data.ct,
            items: data.items.map(item => ({
                term: item.t,
                translation: item.r,
                partOfSpeech: item.p,
                contextSentence: item.c,
            })),
        };
    } catch (error) {
        console.error('[ShareableVocabulary] Failed to decode vocabulary:', error);
        return null;
    }
}

/**
 * Generate a full shareable URL for a game with vocabulary
 */
export function generateShareableUrl(
    gameSlug: string,
    items: Array<{ term: string; translation: string; partOfSpeech?: string; contextSentence?: string }>,
    options?: {
        language?: string;
        contentType?: 'vocabulary' | 'sentences' | 'mixed';
        baseUrl?: string;
    }
): string {
    const encoded = encodeVocabulary(items, {
        language: options?.language,
        contentType: options?.contentType,
    });

    const baseUrl = options?.baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');

    // Build URL with query parameter
    const url = new URL(`/games/${gameSlug}`, baseUrl);
    url.searchParams.set('vocab', encoded);

    if (options?.language) {
        url.searchParams.set('lang', options.language);
    }

    return url.toString();
}

/**
 * Parse vocabulary from URL search params
 */
export function parseVocabularyFromUrl(searchParams: URLSearchParams): DecodedVocabulary | null {
    const vocabParam = searchParams.get('vocab');

    if (!vocabParam) {
        return null;
    }

    return decodeVocabulary(vocabParam);
}

/**
 * Copy shareable link to clipboard and show toast
 */
export async function copyShareableLink(
    gameSlug: string,
    items: Array<{ term: string; translation: string }>,
    options?: {
        language?: string;
        contentType?: 'vocabulary' | 'sentences' | 'mixed';
        onSuccess?: () => void;
        onError?: (error: any) => void;
    }
): Promise<boolean> {
    try {
        const url = generateShareableUrl(gameSlug, items, {
            language: options?.language,
            contentType: options?.contentType,
        });

        await navigator.clipboard.writeText(url);

        options?.onSuccess?.();
        return true;
    } catch (error) {
        console.error('[ShareableVocabulary] Failed to copy to clipboard:', error);
        options?.onError?.(error);
        return false;
    }
}

/**
 * Check if current URL has shared vocabulary
 */
export function hasSharedVocabulary(): boolean {
    if (typeof window === 'undefined') return false;

    const params = new URLSearchParams(window.location.search);
    return params.has('vocab');
}

/**
 * Get vocabulary item count from a shared link (without fully decoding)
 * Useful for showing preview info
 */
export function getSharedVocabularyPreview(encoded: string): { itemCount: number; language?: string } | null {
    try {
        const decoded = decodeVocabulary(encoded);
        if (!decoded) return null;

        return {
            itemCount: decoded.items.length,
            language: decoded.language,
        };
    } catch {
        return null;
    }
}

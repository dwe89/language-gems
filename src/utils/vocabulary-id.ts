const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ParsedVocabularyIdentifier {
  raw: string | null;
  vocabularyItemId: number | null;
  centralizedVocabularyId: string | null;
  isUUID: boolean;
  isValid: boolean;
}

/**
 * Normalizes vocabulary identifiers that may arrive as legacy integers or UUID strings.
 * Provides both representations so downstream callers can safely interact with Supabase RPC functions.
 */
export const parseVocabularyIdentifier = (
  value: string | number | null | undefined
): ParsedVocabularyIdentifier => {
  if (value === null || value === undefined) {
    return {
      raw: null,
      vocabularyItemId: null,
      centralizedVocabularyId: null,
      isUUID: false,
      isValid: false
    };
  }

  const raw = value.toString().trim();

  if (!raw) {
    return {
      raw: null,
      vocabularyItemId: null,
      centralizedVocabularyId: null,
      isUUID: false,
      isValid: false
    };
  }

  if (UUID_REGEX.test(raw)) {
    return {
      raw,
      vocabularyItemId: null,
      centralizedVocabularyId: raw,
      isUUID: true,
      isValid: true
    };
  }

  const numeric = Number(raw);
  if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
    return {
      raw,
      vocabularyItemId: Math.trunc(numeric),
      centralizedVocabularyId: null,
      isUUID: false,
      isValid: true
    };
  }

  return {
    raw,
    vocabularyItemId: null,
    centralizedVocabularyId: null,
    isUUID: false,
    isValid: false
  };
};

// Game compatibility definitions for Language Gems
// This defines what type of content each game supports

export interface GameCompatibilityInfo {
  supportsVocabulary: boolean;
  supportsSentences: boolean;
  supportsMixed: boolean;
  minItems?: number;
  maxItems?: number;
  preferredContentType: 'vocabulary' | 'sentences' | 'mixed';
  requiresAudio?: boolean;
  description?: string;
}

// Game compatibility matrix based on actual game implementations
export const GAME_COMPATIBILITY: Record<string, GameCompatibilityInfo> = {
  // Vocabulary Games - work with individual words
  'vocab-master': {
    supportsVocabulary: true,
    supportsSentences: false,
    supportsMixed: false,
    preferredContentType: 'vocabulary',
    minItems: 1,
    maxItems: 200,
    requiresAudio: false,
    description: 'Vocabulary learning with spaced repetition'
  },
  
  'memory-game': {
    supportsVocabulary: true,
    supportsSentences: false,
    supportsMixed: false,
    preferredContentType: 'vocabulary',
    minItems: 8,
    maxItems: 20,
    requiresAudio: false,
    description: 'Memory matching with word pairs'
  },
  
  'hangman': {
    supportsVocabulary: true,
    supportsSentences: false,
    supportsMixed: false,
    preferredContentType: 'vocabulary',
    minItems: 10,
    maxItems: 100,
    requiresAudio: false,
    description: 'Word guessing game'
  },
  
  'word-blast': {
    supportsVocabulary: true,
    supportsSentences: false,
    supportsMixed: false,
    preferredContentType: 'vocabulary',
    minItems: 20,
    maxItems: 100,
    requiresAudio: false,
    description: 'Fast-paced vocabulary shooting game'
  },
  
  'noughts-and-crosses': {
    supportsVocabulary: true,
    supportsSentences: false,
    supportsMixed: false,
    preferredContentType: 'vocabulary',
    minItems: 9,
    maxItems: 50,
    requiresAudio: false,
    description: 'Tic-tac-toe with vocabulary questions'
  },
  
  'word-scramble': {
    supportsVocabulary: true,
    supportsSentences: false,
    supportsMixed: false,
    preferredContentType: 'vocabulary',
    minItems: 10,
    maxItems: 50,
    requiresAudio: false,
    description: 'Unscramble letters to form words'
  },
  
  'vocab-blast': {
    supportsVocabulary: true,
    supportsSentences: false,
    supportsMixed: false,
    preferredContentType: 'vocabulary',
    minItems: 20,
    maxItems: 100,
    requiresAudio: false,
    description: 'Vocabulary blasting game'
  },
  
  'detective-listening': {
    supportsVocabulary: true,
    supportsSentences: false,
    supportsMixed: false,
    preferredContentType: 'vocabulary',
    minItems: 10,
    maxItems: 30,
    requiresAudio: true,
    description: 'Audio-based vocabulary detective game'
  },
  
  'word-towers': {
    supportsVocabulary: true,
    supportsSentences: false,
    supportsMixed: false,
    preferredContentType: 'vocabulary',
    minItems: 20,
    maxItems: 100,
    requiresAudio: false,
    description: 'Build towers with vocabulary matches'
  },
  
  // Sentence Games - work with complete sentences
  'speed-builder': {
    supportsVocabulary: false,
    supportsSentences: true,
    supportsMixed: false,
    preferredContentType: 'sentences',
    minItems: 10,
    maxItems: 50,
    requiresAudio: false,
    description: 'Build sentences by dragging words'
  },
  
  'sentence-towers': {
    supportsVocabulary: false,
    supportsSentences: true,
    supportsMixed: false,
    preferredContentType: 'sentences',
    minItems: 20,
    maxItems: 100,
    requiresAudio: false,
    description: 'Build towers with sentence construction'
  },
  
  'case-file-translator': {
    supportsVocabulary: false,
    supportsSentences: true,
    supportsMixed: false,
    preferredContentType: 'sentences',
    minItems: 10,
    maxItems: 30,
    requiresAudio: false,
    description: 'Translate sentences in detective scenarios'
  },
  
  'lava-temple-word-restore': {
    supportsVocabulary: false,
    supportsSentences: true,
    supportsMixed: false,
    preferredContentType: 'sentences',
    minItems: 10,
    maxItems: 50,
    requiresAudio: false,
    description: 'Restore missing words in sentences'
  },
  
  // Grammar Games - special category
  'conjugation-duel': {
    supportsVocabulary: false,
    supportsSentences: false,
    supportsMixed: false,
    preferredContentType: 'vocabulary', // Uses verb vocabulary
    minItems: 10,
    maxItems: 50,
    requiresAudio: false,
    description: 'Verb conjugation practice'
  }
};

/**
 * Get compatibility information for a specific game
 */
export function getGameCompatibility(gameId: string): GameCompatibilityInfo | null {
  return GAME_COMPATIBILITY[gameId] || null;
}

/**
 * Check if a game supports a specific content type
 */
export function gameSupportsContentType(
  gameId: string, 
  contentType: 'vocabulary' | 'sentences' | 'mixed'
): boolean {
  const compatibility = getGameCompatibility(gameId);
  if (!compatibility) return false;
  
  switch (contentType) {
    case 'vocabulary':
      return compatibility.supportsVocabulary;
    case 'sentences':
      return compatibility.supportsSentences;
    case 'mixed':
      return compatibility.supportsMixed;
    default:
      return false;
  }
}

/**
 * Get all games that support a specific content type
 */
export function getGamesByContentType(contentType: 'vocabulary' | 'sentences' | 'mixed'): string[] {
  return Object.keys(GAME_COMPATIBILITY).filter(gameId => 
    gameSupportsContentType(gameId, contentType)
  );
}

/**
 * Get the preferred content type for a game
 */
export function getPreferredContentType(gameId: string): 'vocabulary' | 'sentences' | 'mixed' {
  const compatibility = getGameCompatibility(gameId);
  return compatibility?.preferredContentType || 'vocabulary';
}

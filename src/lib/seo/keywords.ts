// SEO Keywords and Content Strategy for Language Gems

// Primary Keywords (High Volume, High Intent)
export const PRIMARY_KEYWORDS = [
  'language learning games',
  'GCSE language learning',
  'interactive vocabulary games',
  'educational language games',
  'Spanish learning games',
  'French learning games',
  'German learning games',
  'vocabulary practice games',
  'language learning platform',
  'gamified language learning'
];

// Secondary Keywords (Medium Volume, Specific Intent)
export const SECONDARY_KEYWORDS = [
  'GCSE Spanish vocabulary',
  'GCSE French vocabulary',
  'GCSE German vocabulary',
  'language learning for schools',
  'vocabulary memory games',
  'conjugation practice games',
  'language learning activities',
  'MFL teaching resources',
  'interactive language exercises',
  'language learning software'
];

// Long-tail Keywords (Lower Volume, High Conversion)
export const LONG_TAIL_KEYWORDS = [
  'best language learning games for GCSE students',
  'interactive Spanish vocabulary games for schools',
  'gamified French learning platform for teachers',
  'GCSE language learning games with progress tracking',
  'vocabulary memory games for language learners',
  'conjugation practice games for Spanish students',
  'language learning platform for UK schools',
  'interactive German vocabulary exercises',
  'gamified language learning for secondary schools',
  'MFL games for classroom use'
];

// Game-Specific Keywords
export const GAME_KEYWORDS = {
  'vocabulary-mining': [
    'vocabulary mining game',
    'spaced repetition vocabulary',
    'adaptive vocabulary learning',
    'vocabulary gem collection game'
  ],
  'memory-match': [
    'vocabulary memory game',
    'language memory matching',
    'vocabulary card matching game',
    'memory games for language learning'
  ],
  'hangman': [
    'language hangman game',
    'vocabulary hangman',
    'educational hangman game',
    'Spanish hangman game'
  ],
  'word-scramble': [
    'vocabulary word scramble',
    'language word puzzle',
    'vocabulary unscramble game',
    'word scramble for language learning'
  ],
  'conjugation-duel': [
    'verb conjugation game',
    'Spanish conjugation practice',
    'French verb conjugation game',
    'interactive conjugation exercises'
  ],
  'detective-listening': [
    'language listening game',
    'detective listening exercise',
    'audio comprehension game',
    'listening skills practice'
  ]
};

// Educational Keywords
export const EDUCATIONAL_KEYWORDS = [
  'GCSE preparation',
  'secondary school language learning',
  'MFL resources',
  'language teaching tools',
  'classroom language games',
  'student engagement tools',
  'language learning assessment',
  'progress tracking language learning',
  'differentiated language instruction',
  'language learning analytics'
];

// Competitor Keywords (What users search when looking for alternatives)
export const COMPETITOR_KEYWORDS = [
  'alternative to Duolingo for schools',
  'better than Babbel for education',
  'classroom language learning software',
  'school language learning platform',
  'educational language games vs consumer apps',
  'language learning with teacher dashboard',
  'GCSE specific language learning',
  'UK curriculum language learning'
];

// Location-Based Keywords
export const LOCATION_KEYWORDS = [
  'UK language learning platform',
  'British GCSE language learning',
  'language learning for UK schools',
  'English schools language software',
  'UK MFL teaching resources'
];

// Feature-Based Keywords
export const FEATURE_KEYWORDS = [
  'language learning with progress tracking',
  'gamified vocabulary learning',
  'spaced repetition language learning',
  'adaptive language learning games',
  'language learning analytics',
  'classroom management language learning',
  'student dashboard language learning',
  'teacher dashboard language platform'
];

// Content Topic Keywords
export const CONTENT_KEYWORDS = [
  'how to learn vocabulary effectively',
  'gamification in language learning',
  'spaced repetition for vocabulary',
  'GCSE language learning tips',
  'engaging language learning activities',
  'technology in language teaching',
  'student motivation language learning',
  'language learning best practices'
];

// Seasonal Keywords
export const SEASONAL_KEYWORDS = {
  'back-to-school': [
    'back to school language learning',
    'new term language resources',
    'September language learning prep'
  ],
  'exam-season': [
    'GCSE language exam preparation',
    'language exam revision games',
    'GCSE vocabulary revision'
  ],
  'new-year': [
    'new year language learning goals',
    'language learning resolutions',
    'start learning language 2024'
  ]
};

// Keyword Difficulty Mapping (1-10 scale)
export const KEYWORD_DIFFICULTY = {
  'language learning games': 8,
  'GCSE language learning': 6,
  'interactive vocabulary games': 5,
  'educational language games': 7,
  'vocabulary practice games': 4,
  'language learning platform': 9,
  'gamified language learning': 5,
  'GCSE Spanish vocabulary': 4,
  'language learning for schools': 6,
  'vocabulary memory games': 3
};

// Search Intent Mapping
export const SEARCH_INTENT = {
  informational: [
    'how to learn vocabulary effectively',
    'gamification in language learning',
    'spaced repetition for vocabulary'
  ],
  navigational: [
    'Language Gems login',
    'Language Gems games',
    'Language Gems pricing'
  ],
  transactional: [
    'buy language learning software',
    'language learning platform for schools',
    'GCSE language learning subscription'
  ],
  commercial: [
    'best language learning games',
    'language learning platform comparison',
    'GCSE language learning tools'
  ]
};

// Helper function to get keywords for a specific page
export const getKeywordsForPage = (pageType: string, gameId?: string): string[] => {
  switch (pageType) {
    case 'home':
      return [...PRIMARY_KEYWORDS.slice(0, 5), ...SECONDARY_KEYWORDS.slice(0, 3)];
    case 'games':
      return [...PRIMARY_KEYWORDS, ...GAME_KEYWORDS[gameId as keyof typeof GAME_KEYWORDS] || []];
    case 'pricing':
      return ['language learning platform pricing', 'GCSE language learning cost', 'school language software pricing'];
    case 'about':
      return ['Daniel Etienne language teacher', 'Language Gems founder', 'MFL teacher platform'];
    case 'schools':
      return [...EDUCATIONAL_KEYWORDS, ...LOCATION_KEYWORDS];
    default:
      return PRIMARY_KEYWORDS.slice(0, 3);
  }
};

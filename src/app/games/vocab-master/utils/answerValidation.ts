/**
 * Enhanced Answer Validation System for VocabMaster
 * Handles synonyms, regional variations, and flexible answer matching
 */

import { VocabularyWord, GameMode, ClozeExercise } from '../types';

export interface ValidationResult {
  isCorrect: boolean;
  missingAccents: boolean;
}

// Regional variations mapping (British vs American English)
const REGIONAL_VARIATIONS: Record<string, Record<string, string>> = {
  en: {
    // British to American
    'grey': 'gray',
    'colour': 'color',
    'flavour': 'flavor',
    'analyse': 'analyze',
    'centre': 'center',
    'theatre': 'theater',
    'programme': 'program',
    'practise': 'practice', // verb form
    'licence': 'license', // noun form
    'defence': 'defense',
    'offence': 'offense',
    'realise': 'realize',
    'organise': 'organize',
    'recognise': 'recognize',
    'criticise': 'criticize',
    'emphasise': 'emphasize',
    'specialise': 'specialize',
    'travelling': 'traveling',
    'modelling': 'modeling',
    'cancelled': 'canceled',
    'jewellery': 'jewelry',
    'marvellous': 'marvelous',
    'honour': 'honor',
    'favour': 'favor',
    'neighbour': 'neighbor',
    'behaviour': 'behavior',
    'rumour': 'rumor',
    'humour': 'humor',
    'labour': 'labor',
    'parlour': 'parlor'
  }
};

// Common synonyms for educational vocabulary
const SYNONYMS: Record<string, Record<string, string[]>> = {
  en: {
    'happy': ['joyful', 'cheerful', 'glad', 'pleased', 'content'],
    'sad': ['unhappy', 'miserable', 'down', 'upset', 'depressed'],
    'big': ['large', 'huge', 'enormous', 'giant', 'massive', 'great'],
    'small': ['little', 'tiny', 'mini', 'miniature', 'petite'],
    'good': ['great', 'excellent', 'wonderful', 'fantastic', 'amazing'],
    'bad': ['awful', 'terrible', 'horrible', 'dreadful', 'poor'],
    'fast': ['quick', 'rapid', 'speedy', 'swift'],
    'slow': ['sluggish', 'gradual', 'leisurely'],
    'smart': ['intelligent', 'clever', 'bright', 'brilliant'],
    'stupid': ['dumb', 'foolish', 'silly', 'ignorant'],
    'beautiful': ['pretty', 'lovely', 'gorgeous', 'attractive', 'stunning'],
    'ugly': ['hideous', 'unattractive', 'unsightly'],
    'rich': ['wealthy', 'affluent', 'prosperous'],
    'poor': ['broke', 'impoverished', 'needy'],
    'old': ['elderly', 'aged', 'ancient'],
    'young': ['youthful', 'juvenile'],
    'hot': ['warm', 'boiling', 'scorching'],
    'cold': ['chilly', 'freezing', 'icy', 'cool'],
    'easy': ['simple', 'effortless', 'straightforward'],
    'difficult': ['hard', 'challenging', 'tough', 'complex'],
    'funny': ['hilarious', 'amusing', 'comical', 'humorous'],
    'scary': ['frightening', 'terrifying', 'spooky', 'creepy'],
    'angry': ['mad', 'furious', 'annoyed', 'irritated'],
    'tired': ['exhausted', 'weary', 'sleepy', 'fatigued'],
    'hungry': ['starving', 'famished'],
    'thirsty': ['parched'],
    'clean': ['spotless', 'pristine', 'tidy'],
    'dirty': ['filthy', 'messy', 'grimy', 'soiled'],
    'loud': ['noisy', 'deafening', 'booming'],
    'quiet': ['silent', 'peaceful', 'hushed'],
    'strong': ['powerful', 'mighty', 'robust'],
    'weak': ['feeble', 'frail', 'fragile'],
    'brave': ['courageous', 'fearless', 'bold'],
    'scared': ['afraid', 'frightened', 'terrified'],
    'kind': ['nice', 'gentle', 'caring', 'compassionate'],
    'mean': ['cruel', 'nasty', 'unkind', 'harsh']
  },
  es: {
    'bonito': ['hermoso', 'lindo', 'bello'],
    'rápido': ['veloz', 'ligero'],
    'casa': ['hogar', 'vivienda'],
    'coche': ['carro', 'auto', 'automóvil'],
    'trabajo': ['empleo', 'ocupación'],
    'dinero': ['plata', 'efectivo'],
    'comida': ['alimento', 'alimentos'],
    'agua': ['líquido'],
    'grande': ['enorme', 'gigante'],
    'pequeño': ['chico', 'diminuto'],
    'bueno': ['excelente', 'estupendo'],
    'malo': ['terrible', 'horrible'],
    'feliz': ['contento', 'alegre'],
    'triste': ['deprimido', 'melancólico']
  },
  fr: {
    'bon': ['bien', 'excellent'],
    'mauvais': ['terrible', 'horrible'],
    'grand': ['énorme', 'immense'],
    'petit': ['minuscule', 'tiny'],
    'beau': ['joli', 'magnifique'],
    'laid': ['horrible', 'affreux'],
    'rapide': ['vite', 'véloce'],
    'lent': ['lentement'],
    'heureux': ['content', 'joyeux'],
    'triste': ['malheureux', 'déprimé']
  }
};

/**
 * Normalize regional variations to a consistent form (American English)
 */
function normalizeRegionalVariations(text: string, language: string): string {
  if (language !== 'en') return text;

  let normalizedText = text;
  const variations = REGIONAL_VARIATIONS.en;

  for (const [british, american] of Object.entries(variations)) {
    // Use word boundaries to avoid replacing parts of other words
    const regex = new RegExp(`\\b${british}\\b`, 'gi');
    normalizedText = normalizedText.replace(regex, american);

    // Also handle the reverse (American to British normalization)
    const reverseRegex = new RegExp(`\\b${american}\\b`, 'gi');
    normalizedText = normalizedText.replace(reverseRegex, american); // Keep American as standard
  }

  return normalizedText;
}

/**
 * Get all possible synonyms for a word
 */
function getSynonyms(word: string, language: string): string[] {
  const langSynonyms = SYNONYMS[language];
  if (!langSynonyms) return [];

  const normalizedWord = word.toLowerCase().trim();
  return langSynonyms[normalizedWord] || [];
}

/**
 * Enhanced answer validation with synonyms and regional variations
 */
export function validateAnswerEnhanced(
  userAnswer: string,
  correctAnswer: string,
  language: string = 'en',
  allowSynonyms: boolean = true
): ValidationResult {
  if (!userAnswer || !correctAnswer) {
    return { isCorrect: false, missingAccents: false };
  }

  // Clean and normalize text for comparison
  const cleanText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove common punctuation
      .replace(/[.,!?;:'"()[\]{}]/g, '')
      // Handle contractions
      .replace(/n't/g, ' not')
      .replace(/'ll/g, ' will')
      .replace(/'re/g, ' are')
      .replace(/'ve/g, ' have')
      .replace(/'d/g, ' would')
      .replace(/'m/g, ' am')
      .replace(/'s/g, ' is')
      .trim();
  };

  // Remove accents for comparison
  const removeAccents = (text: string): string => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  // Extract content from parentheses and create variations
  const extractParentheticalVariations = (text: string): string[] => {
    const variations: string[] = [text];

    // Handle parenthetical content like "ATHLETE (FEMALE)" -> ["ATHLETE (FEMALE)", "ATHLETE"]
    const parenthesesMatch = text.match(/^(.+?)\s*\([^)]+\)$/);
    if (parenthesesMatch) {
      variations.push(parenthesesMatch[1].trim());
    }

    // Handle content with slashes like "HE/SHE" -> ["HE/SHE", "HE", "SHE"]
    if (text.includes('/')) {
      const parts = text.split('/').map(part => part.trim());
      variations.push(...parts);
    }

    // Handle content with "OR" like "CAT OR DOG" -> ["CAT OR DOG", "CAT", "DOG"]
    if (text.toUpperCase().includes(' OR ')) {
      const parts = text.split(/\s+or\s+/i).map(part => part.trim());
      variations.push(...parts);
    }

    return variations;
  };

  // Get all possible correct answer variations
  const correctVariations = extractParentheticalVariations(correctAnswer);
  const allPossibleAnswers: string[] = [];

  // Process each variation
  for (const variation of correctVariations) {
    // Add the original variation
    allPossibleAnswers.push(variation);

    // Add synonyms if enabled
    if (allowSynonyms) {
      const synonyms = getSynonyms(variation, language);
      allPossibleAnswers.push(...synonyms);
    }
  }

  // Clean and normalize all possible answers
  const normalizedPossibleAnswers = allPossibleAnswers.map(answer => {
    const cleaned = cleanText(answer);
    return normalizeRegionalVariations(cleaned, language);
  });

  // Clean and normalize user answer
  const userAnswerCleaned = cleanText(userAnswer);
  const userAnswerNormalized = normalizeRegionalVariations(userAnswerCleaned, language);

  // Check for missing accents
  const userAnswerNoAccents = removeAccents(userAnswerCleaned);
  const correctAnswerNoAccents = removeAccents(normalizedPossibleAnswers[0] || '');
  const missingAccents = userAnswerCleaned !== userAnswerNoAccents && userAnswerNoAccents === correctAnswerNoAccents;

  // Check for exact matches
  const isCorrect = normalizedPossibleAnswers.some(possibleAnswer =>
    possibleAnswer === userAnswerNormalized
  );

  return { isCorrect, missingAccents };
}

/**
 * Legacy validation function for backward compatibility
 */
export function validateAnswer(userAnswer: string, correctAnswer: string): ValidationResult {
  // Use the enhanced validation with synonyms disabled for backward compatibility
  return validateAnswerEnhanced(userAnswer, correctAnswer, 'en', false);
}

/**
 * Get placeholder text for different game modes
 */
export function getPlaceholderText(mode: string): string {
  const placeholders: Record<string, string> = {
    'learn': 'Type the English translation...',
    'recall': 'Type what you remember...',
    'typing': 'Type the translation...',
    'dictation': 'Type what you hear...',
    'listening': 'Type the English translation...',
    'cloze': 'Type the missing word...',
    'speed': 'Type fast!',
    'mixed': 'Type your answer...'
  };

  return placeholders[mode] || 'Type your answer...';
}

/**
 * Check if an answer is partially correct (for hints/feedback)
 */
export function getAnswerSimilarity(userAnswer: string, correctAnswer: string): number {
  const cleanText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[.,!?;:'"()[\]{}]/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const userClean = cleanText(userAnswer);
  const correctClean = cleanText(correctAnswer);

  if (userClean === correctClean) return 1.0;
  if (userClean.length === 0) return 0.0;

  // Simple similarity based on common characters
  const commonChars = userClean.split('').filter(char => correctClean.includes(char)).length;
  return commonChars / Math.max(userClean.length, correctClean.length);
}

/**
 * Gets the correct answer based on game mode and current word
 */
export function getCorrectAnswer(
  gameMode: GameMode,
  currentWord: VocabularyWord | null,
  clozeExercise?: ClozeExercise | null,
  sentenceData?: any
): string {
  if (!currentWord) return '';

  switch (gameMode) {
    case 'dictation':
      return currentWord.spanish || currentWord.word || '';

    case 'listening':
      return currentWord.english || currentWord.translation || '';

    case 'cloze':
      if (sentenceData?.target_word) {
        return sentenceData.target_word;
      }
      return clozeExercise?.correctAnswer || currentWord.spanish || currentWord.word || '';

    default:
      return currentWord.english || currentWord.translation || '';
  }
}

/**
 * Validates answer based on game mode
 */
export function validateGameAnswer(
  userAnswer: string,
  gameMode: GameMode,
  currentWord: VocabularyWord | null,
  clozeExercise?: ClozeExercise | null,
  sentenceData?: any
): ValidationResult {
  const correctAnswer = getCorrectAnswer(gameMode, currentWord, clozeExercise, sentenceData);
  return validateAnswerEnhanced(userAnswer, correctAnswer, 'en', true);
}

/**
 * Gets appropriate prompt text for game mode
 */
export function getPromptText(gameMode: GameMode): string {
  switch (gameMode) {
    case 'dictation':
      return "🎧 Listen and Type What You Hear";
    case 'listening':
      return "🎧 Listen and Type the Translation";
    case 'cloze':
      return "📝 Fill in the Missing Word";
    case 'match':
      return "🔗 Match Words with Translations";
    case 'speed':
      return "⚡ Speed Challenge";
    case 'multiple_choice':
      return "Choose the correct translation:";
    case 'flashcards':
      return "Do you know this word?";
    default:
      return "Translate this word:";
  }
}

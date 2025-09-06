/**
 * Enhanced Answer Validation System for VocabMaster
 * Merged logic for synonyms, regional variations, contractions, number words, and flexible answer matching.
 */

import { VocabularyWord, GameMode, ClozeExercise } from '../types';

export interface ValidationResult {
  isCorrect: boolean;
  missingAccents: boolean;
}

// --- DATA MAPPINGS ---

// Regional variations mapping (British vs American English)
const REGIONAL_VARIATIONS: Record<string, Record<string, string>> = {
  en: {
    'grey': 'gray', 'colour': 'color', 'flavour': 'flavor', 'analyse': 'analyze', 'centre': 'center',
    'theatre': 'theater', 'programme': 'program', 'practise': 'practice', 'licence': 'license',
    'defence': 'defense', 'offence': 'offense', 'realise': 'realize', 'organise': 'organize',
    'recognise': 'recognize', 'criticise': 'criticize', 'emphasise': 'emphasize', 'specialise': 'specialize',
    'travelling': 'traveling', 'modelling': 'modeling', 'cancelled': 'canceled', 'jewellery': 'jewelry',
    'marvellous': 'marvelous', 'honour': 'honor', 'favour': 'favor', 'neighbour': 'neighbor',
    'behaviour': 'behavior', 'rumour': 'rumor', 'humour': 'humor', 'labour': 'labor', 'parlour': 'parlor'
  }
};

// Common synonyms for educational vocabulary
const SYNONYMS: Record<string, Record<string, string[]>> = {
  en: {
    'happy': ['joyful', 'cheerful', 'glad', 'pleased', 'content'], 'sad': ['unhappy', 'miserable', 'down', 'upset'],
    'big': ['large', 'huge', 'enormous', 'giant', 'massive', 'great'], 'small': ['little', 'tiny', 'mini'],
    'good': ['great', 'excellent', 'wonderful', 'fantastic', 'amazing'], 'bad': ['awful', 'terrible', 'horrible', 'dreadful'],
    'fast': ['quick', 'rapid', 'speedy', 'swift'], 'slow': ['sluggish', 'gradual', 'leisurely'],
    'smart': ['intelligent', 'clever', 'bright', 'brilliant'], 'beautiful': ['pretty', 'lovely', 'gorgeous', 'attractive'],
    'rich': ['wealthy', 'affluent'], 'poor': ['broke', 'impoverished', 'needy'], 'old': ['elderly', 'aged', 'ancient'],
    'easy': ['simple', 'effortless'], 'difficult': ['hard', 'challenging', 'tough', 'complex'],
    'funny': ['hilarious', 'amusing', 'comical', 'humorous'], 'angry': ['mad', 'furious', 'annoyed', 'irritated'],
    'tired': ['exhausted', 'weary', 'sleepy', 'fatigued'], 'clean': ['spotless', 'pristine', 'tidy'], 'dirty': ['filthy', 'messy', 'grimy'],
    'loud': ['noisy', 'deafening'], 'quiet': ['silent', 'peaceful'], 'strong': ['powerful', 'mighty'], 'weak': ['feeble', 'frail'],
    'brave': ['courageous', 'fearless', 'bold'], 'scared': ['afraid', 'frightened', 'terrified'],
    'kind': ['nice', 'gentle', 'caring', 'compassionate'], 'mean': ['cruel', 'nasty', 'unkind']
  },
  es: {
    'bonito': ['hermoso', 'lindo', 'bello'], 'rápido': ['veloz', 'ligero'], 'casa': ['hogar', 'vivienda'],
    'coche': ['carro', 'auto', 'automóvil'], 'trabajo': ['empleo', 'ocupación'], 'dinero': ['plata'],
    'comida': ['alimento'], 'grande': ['enorme', 'gigante'], 'pequeño': ['chico', 'diminuto'], 'bueno': ['excelente', 'estupendo'],
    'malo': ['terrible', 'horrible'], 'feliz': ['contento', 'alegre'], 'triste': ['deprimido', 'melancólico']
  },
  fr: {
    'bon': ['bien', 'excellent'], 'mauvais': ['terrible'], 'grand': ['énorme', 'immense'], 'petit': ['minuscule'],
    'beau': ['joli', 'magnifique'], 'laid': ['horrible', 'affreux'], 'rapide': ['vite', 'véloce'], 'heureux': ['content', 'joyeux'],
    'triste': ['malheureux', 'déprimé']
  }
};

// Contraction mapping
const CONTRACTION_MAP: Record<string, string> = {
  "i'm": "i am", "you're": "you are", "he's": "he is", "she's": "she is", "it's": "it is", "we're": "we are",
  "they're": "they are", "i'll": "i will", "you'll": "you will", "he'll": "he will", "she'll": "she will",
  "it'll": "it will", "we'll": "we will", "they'll": "they will", "won't": "will not", "can't": "cannot",
  "don't": "do not", "doesn't": "does not", "didn't": "did not", "isn't": "is not", "aren't": "are not",
  "wasn't": "was not", "weren't": "were not", "haven't": "have not", "hasn't": "has not", "hadn't": "had not"
};

// Number word to digit mapping
const NUMBER_MAP: Record<string, string> = {
  'cero': '0', 'uno': '1', 'dos': '2', 'tres': '3', 'cuatro': '4', 'cinco': '5', 'seis': '6', 'siete': '7', 'ocho': '8', 'nueve': '9', 'diez': '10', 'once': '11', 'doce': '12', 'trece': '13', 'catorce': '14', 'quince': '15', 'dieciséis': '16', 'diecisiete': '17', 'dieciocho': '18', 'diecinueve': '19', 'veinte': '20', 'veintiuno': '21', 'treinta': '30', 'cuarenta': '40', 'cincuenta': '50', 'sesenta': '60', 'setenta': '70', 'ochenta': '80', 'noventa': '90', 'cien': '100', 'ciento': '100',
  'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13', 'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17', 'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30', 'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70', 'eighty': '80', 'ninety': '90', 'hundred': '100',
};
const REVERSE_NUMBER_MAP = Object.entries(NUMBER_MAP).reduce((acc, [word, digit]) => {
  if (!acc[digit]) acc[digit] = [];
  acc[digit].push(word);
  return acc;
}, {} as Record<string, string[]>);

// --- HELPER FUNCTIONS ---

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
 * Normalize regional variations to a consistent form (American English)
 */
function normalizeRegionalVariations(text: string, language: string): string {
  if (language !== 'en') return text;
  let normalizedText = text;
  const variations = REGIONAL_VARIATIONS.en;
  for (const [british, american] of Object.entries(variations)) {
    const regex = new RegExp(`\\b${british}\\b`, 'gi');
    normalizedText = normalizedText.replace(regex, american);
  }
  return normalizedText;
}


// --- CORE VALIDATION LOGIC ---

/**
 * Enhanced answer validation with synonyms, regional variations, contractions, and number words.
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

  // --- Helper Functions for Cleaning and Normalization ---
  const removeAccents = (text: string): string => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  const cleanAndNormalize = (text: string): string => {
    let newText = text.toLowerCase();
    // Remove content in parentheses, but keep words outside of them
    newText = newText.replace(/\s*\([^)]+\)/g, ' ').trim();
    // Remove common punctuation, but keep hyphen as it can be part of words (e.g., twenty-one)
    newText = newText.replace(/[¿¡?!.,;:()[\]{}«»]/g, '');
    // Normalize regional variations (e.g., 'colour' -> 'color')
    newText = normalizeRegionalVariations(newText, language);
    // Standardize whitespace and trim
    return newText.replace(/\s+/g, ' ').trim();
  };

  // --- 1. Generate All Possible Correct Answer Variations ---
  
  // Start by splitting answers with multiple delimiters: , ; / | I or and
  // This is where we need to adjust for the new patterns
  let baseAnswers = correctAnswer
    .split(/[,|;\/]|\s+I\s+|\s+and\s+|\s+or\s+/i)
    .flatMap(ans => {
        ans = ans.trim();
        if (ans.length === 0) return [];

        // Handle patterns like "(to) recycle" -> "to recycle", "recycle"
        const optionalPrefixMatch = ans.match(/^\(([^)]+)\)\s*(.+)$/);
        if (optionalPrefixMatch) {
            const optionalPart = optionalPrefixMatch[1];
            const mainPart = optionalPrefixMatch[2];
            // If the optional part is "to", consider both "to X" and "X"
            if (optionalPart.toLowerCase() === 'to') {
                return [`${optionalPart} ${mainPart}`, mainPart];
            }
            // For other optional parts (e.g., "(you) play"), include both with and without
            return [`${optionalPart} ${mainPart}`, mainPart];
        }

        // Handle patterns like "Pleasure, amusement" where each is a valid answer
        // This is implicitly handled by the initial split, but ensures each part is treated individually
        return [ans];
    })
    .filter(ans => ans.length > 0);

  // Expand with synonyms if enabled
  if (allowSynonyms) {
    // Collect synonyms for each base answer and flatten the array
    const synonyms = baseAnswers.flatMap(answer => getSynonyms(answer, language));
    baseAnswers.push(...synonyms);
  }

  // Use a Set to store final variations to avoid duplicates
  const possibleAnswers = new Set<string>();

  // For each base answer, generate all cleaned/normalized variations
  baseAnswers.forEach(answer => {
    const cleaned = cleanAndNormalize(answer);
    if (cleaned) {
        possibleAnswers.add(cleaned);

        // Add contraction variations (both ways)
        // Ensure that contractions are handled for both 'cleaned' and 'expansion' forms.
        Object.entries(CONTRACTION_MAP).forEach(([contraction, expansion]) => {
            if (cleaned.includes(contraction)) {
                possibleAnswers.add(cleaned.replace(contraction, expansion));
            }
            if (cleaned.includes(expansion)) {
                possibleAnswers.add(cleaned.replace(expansion, contraction));
            }
        });
    }
  });
  
  const finalPossibleAnswers = Array.from(possibleAnswers);

  // --- 2. Clean and Normalize User's Answer ---
  let userClean = cleanAndNormalize(userAnswer);
  
  // Expand user's contractions for matching (e.g., "don't" -> "do not")
  // Only expand the user's answer, don't generate contraction variants of the user's answer
  Object.entries(CONTRACTION_MAP).forEach(([contraction, expansion]) => {
    // Use regex with word boundaries to avoid partial matches (e.g., "cant" in "cantilever")
    const contractionRegex = new RegExp(`\\b${contraction.replace(/'/g, '\\\'')}\\b`, 'gi');
    userClean = userClean.replace(contractionRegex, expansion);
  });
  
  const userCleanNoAccents = removeAccents(userClean);

  // --- 3. Perform Validation Checks ---

  // A. Direct check (accent-insensitive)
  let isCorrect = finalPossibleAnswers.some(pa => removeAccents(pa) === userCleanNoAccents);

  // B. Number word vs. digit check (if direct check fails)
  if (!isCorrect) {
    const isUserAnswerDigit = /^\d+$/.test(userClean);
    if (isUserAnswerDigit) {
      // User typed a digit (e.g., "21"), check if it matches a number word (e.g., "twenty-one")
      isCorrect = finalPossibleAnswers.some(pa => NUMBER_MAP[pa] === userClean);
    } else {
      // User typed a word (e.g., "twenty-one"), check if it matches a digit (e.g., "21")
      // Need to iterate through the reverse map's arrays
      isCorrect = finalPossibleAnswers.some(pa => {
        const correspondingWords = REVERSE_NUMBER_MAP[pa];
        return correspondingWords && correspondingWords.includes(userClean);
      });
    }
  }

  // C. Determine if accents were missing
  let missingAccents = false;
  if (isCorrect) {
    // If correct, check if a perfect (accent-sensitive) match exists.
    // If not, it means the accent-less match was used, so accents were missing.
    const perfectMatch = finalPossibleAnswers.some(pa => pa === userClean);
    if (!perfectMatch) {
      missingAccents = true;
    }
  }

  return { isCorrect, missingAccents };
}

// --- LEGACY AND GAME-SPECIFIC FUNCTIONS ---

/**
 * Legacy validation function for backward compatibility
 */
export function validateAnswer(userAnswer: string, correctAnswer: string): ValidationResult {
  // Use the enhanced validation with synonyms disabled for backward compatibility
  return validateAnswerEnhanced(userAnswer, correctAnswer, 'en', false);
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
    case 'dictation': return currentWord.spanish || currentWord.word || '';
    case 'listening': return currentWord.english || currentWord.translation || '';
    case 'cloze':
      if (sentenceData?.target_word) return sentenceData.target_word;
      return clozeExercise?.correctAnswer || currentWord.spanish || currentWord.word || '';
    default: return currentWord.english || currentWord.translation || '';
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
  // If VocabularyWord has a 'language' property, use it; otherwise, default to 'en'
  // For now, default to 'en' since 'language' does not exist on VocabularyWord
  const language = 'en';
  return validateAnswerEnhanced(userAnswer, correctAnswer, language, true);
}

/**
 * Get placeholder text for different game modes
 */
export function getPlaceholderText(mode: string): string {
  const placeholders: Record<string, string> = {
    'learn': 'Type the English translation...', 'recall': 'Type what you remember...',
    'typing': 'Type the translation...', 'dictation': 'Type what you hear...',
    'listening': 'Type the English translation...', 'cloze': 'Type the missing word...',
    'speed': 'Type fast!', 'mixed': 'Type your answer...'
  };
  return placeholders[mode] || 'Type your answer...';
}

/**
 * Check if an answer is partially correct (for hints/feedback) using Levenshtein distance
 */
export function getAnswerSimilarity(userAnswer: string, correctAnswer: string): number {
    const clean = (text: string) => text.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const userClean = clean(userAnswer);
    const correctClean = clean(correctAnswer);

    const longer = userClean.length > correctClean.length ? userClean : correctClean;
    const shorter = userClean.length > correctClean.length ? correctClean : userClean;

    if (longer.length === 0) return 1.0;

    const levenshteinDistance = (s1: string, s2: string) => {
        const costs = Array(s2.length + 1).fill(0).map((_, i) => i);
        for (let i = 1; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 1; j <= s2.length; j++) {
                const newValue = (s1[i - 1] === s2[j - 1]) ? costs[j - 1] : Math.min(costs[j - 1], lastValue, costs[j]) + 1;
                costs[j - 1] = costs[j]; // costs[j] is the value of costs[j-1] in the previous iteration
                costs[j] = newValue;
            }
        }
        return costs[s2.length];
    };

    const distance = levenshteinDistance(shorter, longer);
    return (longer.length - distance) / longer.length;
}


/**
 * Gets appropriate prompt text for game mode
 */
export function getPromptText(gameMode: GameMode): string {
  switch (gameMode) {
    case 'dictation': return "🎧 Listen and Type What You Hear";
    case 'listening': return "🎧 Listen and Type the Translation";
    case 'cloze': return "📝 Fill in the Missing Word";
    case 'match': return "🔗 Match Words with Translations";
    case 'speed': return "⚡ Speed Challenge";
    case 'multiple_choice': return "Choose the correct translation:";
    case 'flashcards': return "Do you know this word?";
    default: return "Translate this word:";
  }
}
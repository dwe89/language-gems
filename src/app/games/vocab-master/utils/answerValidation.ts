import { VocabularyWord, GameMode, ClozeExercise } from '../types';

export interface ValidationResult {
  isCorrect: boolean;
  missingAccents: boolean;
}

/**
 * Validates user answer against the correct answer with flexible matching
 */
export function validateAnswer(userAnswer: string, correctAnswer: string): ValidationResult {
  const normalizedUser = userAnswer.toLowerCase().trim();
  const normalizedCorrect = correctAnswer.toLowerCase().trim();
  
  // Direct match
  if (normalizedUser === normalizedCorrect) {
    return { isCorrect: true, missingAccents: false };
  }
  
  // Check for accent issues (Spanish characters)
  const withoutAccents = (str: string) => 
    str.normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
       .replace(/ñ/g, 'n')
       .replace(/Ñ/g, 'N');
  
  const userWithoutAccents = withoutAccents(normalizedUser);
  const correctWithoutAccents = withoutAccents(normalizedCorrect);
  
  if (userWithoutAccents === correctWithoutAccents) {
    return { isCorrect: true, missingAccents: true };
  }
  
  // Check for partial matches (handle comma-separated alternatives)
  const correctOptions = normalizedCorrect.split(',').map(opt => opt.trim());
  const isPartialMatch = correctOptions.some(option => 
    normalizedUser === option || userWithoutAccents === withoutAccents(option)
  );
  
  if (isPartialMatch) {
    return { isCorrect: true, missingAccents: false };
  }
  
  return { isCorrect: false, missingAccents: false };
}

/**
 * Gets the correct answer based on game mode and current word
 */
export function getCorrectAnswer(
  gameMode: GameMode, 
  currentWord: VocabularyWord | null, 
  clozeExercise?: ClozeExercise | null,
  sentenceData?: any // New parameter for sentence-based cloze
): string {
  if (!currentWord) return '';
  
  switch (gameMode) {
    case 'dictation':
      return currentWord.spanish || currentWord.word || '';
    
    case 'listening':
      return currentWord.english || currentWord.translation || '';
    
    case 'cloze':
      // New approach: use sentence data if available, otherwise fall back to old approach
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
  sentenceData?: any // New parameter for sentence-based cloze
): ValidationResult {
  const correctAnswer = getCorrectAnswer(gameMode, currentWord, clozeExercise, sentenceData);
  return validateAnswer(userAnswer, correctAnswer);
}

/**
 * Gets appropriate placeholder text for input based on game mode
 */
export function getPlaceholderText(gameMode: GameMode): string {
  switch (gameMode) {
    case 'dictation':
      return "Type what you heard in Spanish...";
    case 'listening':
      return "Type the English translation...";
    case 'cloze':
      return "Type the missing Spanish word...";
    case 'typing':
      return "Type the English translation...";
    case 'speed':
      return "Quick! Type the translation...";
    default:
      return "Type your answer...";
  }
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

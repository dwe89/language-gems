// Export all worksheet generators

export { generateReadingComprehensionHTML } from './reading-comprehension';
export { generateWorksheetHTML } from './standard-worksheet';
export { generateVocabularyPracticeHTML } from './vocabulary-practice';
export { generateGrammarExercisesHTML } from './grammar-exercises';
export { generateListeningComprehensionHTML } from './listening-comprehension';
export { generateWritingPracticeHTML } from './writing-practice';
export { generateCrosswordHTML } from './crossword';

// Re-export types for convenience
export type {
  WorksheetData,
  ReadingComprehensionContent,
  VocabularyPracticeContent,
  GrammarExerciseContent,
  ListeningComprehensionContent,
  WritingPracticeContent,
  HTMLGeneratorOptions
} from '../shared/types';

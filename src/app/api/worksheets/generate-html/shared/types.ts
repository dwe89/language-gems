// TypeScript interfaces for worksheet generation

export interface WorksheetData {
  id: string;
  title: string;
  subject: string;
  topic?: string;
  difficulty?: string;
  estimated_time_minutes?: number;
  template_id?: string;
  instructions?: string | string[];
  language?: string;
  answerKey?: any;
  content?: any;
  rawContent?: any;
  metadata?: {
    template?: string;
    [key: string]: any;
  };
}

export interface WorksheetSection {
  title?: string;
  instructions?: string;
  questions?: WorksheetQuestion[];
}

export interface WorksheetQuestion {
  id?: number;
  text?: string;
  question?: string;
  type?: 'multiple-choice' | 'true-false' | 'fill-in-the-blank' | 'translation' | 'matching';
  options?: string[] | MultipleChoiceOption[];
  answer?: string;
  points?: number;
}

export interface MultipleChoiceOption {
  letter: string;
  text: string;
}

export interface ReadingComprehensionContent {
  topic_title?: string;
  article_title?: string;
  article_paragraphs_html?: string;
  true_false_questions?: TrueFalseQuestion[];
  multiple_choice_questions?: MultipleChoiceQuestion[];
  word_hunt_words?: WordHuntItem[];
  tense_detective_prompt?: string;
  tense_detective_prompts?: string[];
  vocabulary_writing?: VocabularyItem[];
  unscramble_sentences?: UnscrambleItem[];
  translation_sentences?: TranslationItem[];
}

export interface TrueFalseQuestion {
  id: number;
  statement: string;
  answer?: boolean;
}

export interface MultipleChoiceQuestion {
  id: number;
  question: string;
  options?: MultipleChoiceOption[];
  answer?: string;
}

export interface WordHuntItem {
  word: string;
  definition?: string;
}

export interface VocabularyItem {
  word?: string;
  definition: string;
  translation?: string;
}

export interface UnscrambleItem {
  scrambled: string;
  correct: string;
}

export interface TranslationItem {
  source: string;
  target?: string;
  language?: string;
}

export interface VocabularyPracticeContent {
  vocabulary_items?: VocabularyItem[];
  exercises?: VocabularyExercise[];
  word_bank?: string[];
}

export interface VocabularyExercise {
  type: 'matching' | 'fill-in-blank' | 'translation' | 'definition' | 'wordsearch' | 'crossword';
  instructions?: string;
  items?: any[];
  title?: string;
  grid_size?: number;
  words?: string[];
  grid?: string[][];
  clues?: {
    across?: Array<{number: number, clue: string, answer: string, position: [number, number]}>;
    down?: Array<{number: number, clue: string, answer: string, position: [number, number]}>;
  };
}

export interface GrammarExerciseContent {
  grammar_topic?: string;
  explanation?: string;
  examples?: GrammarExample[];
  exercises?: GrammarExercise[];
  instructions?: string | string[];
}

export interface GrammarExample {
  correct: string;
  incorrect?: string;
  explanation?: string;
}

export interface GrammarExercise {
  type: 'conjugation' | 'sentence-completion' | 'transformation' | 'error-correction';
  instructions?: string;
  items?: any[];
  title?: string;
  difficulty?: string;
}

export interface ListeningComprehensionContent {
  audio_title?: string;
  audio_url?: string;
  transcript?: string;
  questions?: WorksheetQuestion[];
  vocabulary_support?: VocabularyItem[];
}

export interface WritingPracticeContent {
  writing_prompt?: string;
  word_limit?: number;
  vocabulary_support?: VocabularyItem[];
  structure_guide?: string[];
  assessment_criteria?: string[];
}

export interface HTMLGeneratorOptions {
  includeAnswerKey?: boolean;
  printOptimized?: boolean;
  language?: 'spanish' | 'french' | 'german';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  canvaFriendly?: boolean; // Simplified styling for Canva import compatibility
}

export interface GeneratedHTML {
  html: string;
  metadata?: {
    wordCount?: number;
    estimatedTime?: number;
    difficulty?: string;
  };
}

/**
 * TypeScript types for AQA Reading Admin Panel
 * Based on existing aqa_reading_assessments and aqa_reading_questions tables
 */

export interface AQAReadingPaper {
  id?: string;
  title: string;
  description?: string;
  level: 'foundation' | 'higher'; // Maps to 'tier' in UI
  language: 'es' | 'fr' | 'de';
  identifier: string; // e.g., "paper-1", "paper-2"
  version?: string;
  total_questions?: number;
  time_limit_minutes: number; // Auto-set: 45 for foundation, 60 for higher
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Computed fields
  tier?: 'foundation' | 'higher'; // Alias for level
  paper_number?: string; // Alias for identifier
  total_marks?: number; // Calculated from questions
}

export interface AQAReadingQuestion {
  id?: string;
  assessment_id?: string;
  question_number: number;
  sub_question_number?: string | null;
  question_type: QuestionType;
  title: string;
  instructions: string;
  reading_text?: string | null;
  question_data: QuestionData;
  marks: number;
  theme: AQATheme;
  topic: AQATopic;
  difficulty_rating?: number; // 1-5
  created_at?: string;
  updated_at?: string;
}

// Question Types (9 types supported)
export type QuestionType =
  | 'letter-matching'
  | 'multiple-choice'
  | 'student-grid'
  | 'open-response'
  | 'time-sequence'
  | 'sentence-completion'
  | 'headline-matching'
  | 'translation'
  | 'opinion-rating';

// AQA Themes
export type AQATheme =
  | 'Theme 1: People and lifestyle'
  | 'Theme 2: Popular culture'
  | 'Theme 3: Communication and the world around us';

// AQA Topics
export type AQATopic =
  | 'Identity and relationships with others'
  | 'Healthy living and lifestyle'
  | 'Education and work'
  | 'Free-time activities'
  | 'Customs, festivals and celebrations'
  | 'Celebrity culture'
  | 'Travel and tourism, including places of interest'
  | 'Media and technology'
  | 'The environment and where people live';

// Question Data Types (JSONB structure for each question type)

export interface LetterMatchingData {
  options: Array<{ letter: string; subject: string }>;
  statements: Array<{ number: number; statement: string; correctAnswer: string }>;
}

export interface MultipleChoiceData {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export interface StudentGridData {
  students: Array<{ name: string; letter: string }>;
  questions: Array<{ question: string; correctAnswer: string }>;
}

export interface OpenResponseData {
  questions: Array<{
    question: string;
    acceptableAnswers: string[];
    keywords?: string[];
  }>;
}

export interface TimeSequenceData {
  events: Array<{ letter: string; event: string }>;
  correctOrder: string[]; // Array of letters in correct order
}

export interface SentenceCompletionData {
  sentences: Array<{
    number: number;
    sentenceStart: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export interface HeadlineMatchingData {
  headlines: Array<{ letter: string; headline: string }>;
  articles: Array<{ number: number; article: string; correctAnswer: string }>;
}

export interface TranslationData {
  sentences: Array<{
    number: number;
    sourceText: string;
    correctTranslation: string;
    alternativeTranslations?: string[];
  }>;
}

export interface OpinionRatingData {
  scale: {
    positive: string;
    negative: string;
    positiveNegative: string;
  };
  statements: Array<{
    number: number;
    statement: string;
    correctAnswer: 'positive' | 'negative' | 'positive-negative';
  }>;
}

// Union type for all question data types
export type QuestionData =
  | LetterMatchingData
  | MultipleChoiceData
  | StudentGridData
  | OpenResponseData
  | TimeSequenceData
  | SentenceCompletionData
  | HeadlineMatchingData
  | TranslationData
  | OpinionRatingData;

// API Response Types
export interface ListPapersResponse {
  success: boolean;
  papers: AQAReadingPaper[];
}

export interface GetPaperResponse {
  success: boolean;
  paper: AQAReadingPaper & { questions: AQAReadingQuestion[] };
}

export interface GetNextIdentifierResponse {
  success: boolean;
  next_identifier: string;
  next_number: number;
  existing_count: number;
  existing_identifiers: string[];
}

export interface CreatePaperResponse {
  success: boolean;
  paper: AQAReadingPaper;
}

export interface UpdatePaperResponse {
  success: boolean;
  message: string;
}

export interface DeletePaperResponse {
  success: boolean;
  message: string;
  soft_delete: boolean;
}


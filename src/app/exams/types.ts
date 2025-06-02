// Exam Board and Education Level Types
export type ExamBoard = 'AQA' | 'Edexcel' | 'OCR' | 'WJEC' | 'CIE';
export type EducationLevel = 'Primary' | 'KS3' | 'KS4_GCSE' | 'KS5_ALevel';
export type Language = 'Spanish' | 'French' | 'German' | 'Italian' | 'Chinese';
export type ThemeCategory = 'Theme1' | 'Theme2' | 'Theme3';
export type AssessmentType = 'Reading' | 'Writing' | 'Speaking' | 'Listening';
export type DifficultyLevel = 'Foundation' | 'Higher';

// Theme structure
export type Theme = {
  id: string;
  name: string;
  code: ThemeCategory;
  description: string;
  topics: Topic[];
};

// Topic structure
export type Topic = {
  id: string;
  name: string;
  description: string;
  themeId: string;
};

// Question types
export type QuestionType = 
  | 'MultipleChoice' 
  | 'Matching' 
  | 'FillInTheBlank'
  | 'Translation'
  | 'TrueOrFalse';

// Base question interface
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  difficulty: DifficultyLevel;
}

// Multiple choice question
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'MultipleChoice';
  options: string[];
  correctAnswer: string;
}

// Matching question
export interface MatchingQuestion extends BaseQuestion {
  type: 'Matching';
  items: { item: string, label: string }[];
  correctMatches: { item: string, label: string }[];
}

// Fill in the blank question
export interface FillInTheBlankQuestion extends BaseQuestion {
  type: 'FillInTheBlank';
  blanks: number;
  correctAnswers: string[];
}

// Translation question
export interface TranslationQuestion extends BaseQuestion {
  type: 'Translation';
  targetLanguage: Language;
  correctTranslation: string;
}

// True or false question
export interface TrueOrFalseQuestion extends BaseQuestion {
  type: 'TrueOrFalse';
  statements: string[];
  correctAnswers: boolean[];
}

// Union type for all question types
export type Question = 
  | MultipleChoiceQuestion
  | MatchingQuestion
  | FillInTheBlankQuestion
  | TranslationQuestion
  | TrueOrFalseQuestion;

// Assessment structure
export type Assessment = {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  level: DifficultyLevel;
  theme: ThemeCategory;
  topicId: string;
  timeLimit: number; // in minutes
  questions: Question[];
};

// User assessment progress
export type UserAssessmentProgress = {
  id: string;
  userId: string;
  assessmentId: string;
  score: number;
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
  answers: Record<string, any>; // User's answers keyed by question ID
};

// Exam Board structure
export type ExamBoardInfo = {
  id: string;
  name: ExamBoard;
  code: string;
  description: string;
  logoUrl?: string;
};

// Vocabulary item for exam prep
export type VocabularyItem = {
  id: string;
  term: string;
  translation: string;
  contextSentence?: string;
  topicId: string;
  themeId: string;
  difficulty: DifficultyLevel;
};

// Grammar item for exam prep
export type GrammarItem = {
  id: string;
  rule: string;
  explanation: string;
  examples: string[];
  difficulty: DifficultyLevel;
};

// Assignment model (for teacher assigning exams to students)
export type ExamAssignment = {
  id: string;
  teacherId: string;
  assessmentId: string;
  classId?: string;
  studentIds?: string[];
  dueDate?: Date;
  createdAt: Date;
  active: boolean;
  instructions?: string;
}; 
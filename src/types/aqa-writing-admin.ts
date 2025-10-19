/**
 * TypeScript types for GCSE Writing Admin Panel
 * Supports both AQA and Edexcel exam boards
 * Based on existing aqa_writing_assessments and aqa_writing_questions tables
 */

export type ExamBoard = 'aqa' | 'edexcel';

export interface AQAWritingPaper {
  id?: string;
  exam_board: ExamBoard; // 'aqa' or 'edexcel'
  title: string;
  description?: string;
  level: 'foundation' | 'higher'; // Maps to 'tier' in UI
  language: 'es' | 'fr' | 'de';
  identifier: string; // e.g., "paper-1", "paper-2"
  version?: string;
  total_questions?: number;
  time_limit_minutes: number; // AQA: 70/75, Edexcel: 75/80
  total_marks: number; // Always 50
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;

  // Computed fields
  tier?: 'foundation' | 'higher'; // Alias for level
  paper_number?: string; // Alias for identifier
}

export interface AQAWritingQuestion {
  id?: string;
  assessment_id?: string;
  question_number: number;
  sub_question_number?: string | null;
  question_type: QuestionType;
  title: string;
  instructions: string;
  question_data: QuestionData;
  marks: number;
  word_count_requirement?: number; // For writing tasks (50 words, 90 words, etc.)
  theme: AQATheme;
  topic: AQATopic;
  difficulty_rating?: number; // 1-5
  created_at?: string;
  updated_at?: string;
}

// Question Types
// AQA Foundation: photo-description, short-message, gap-fill, translation, extended-writing
// AQA Higher: translation, overlap-writing, open-writing
// Edexcel Foundation: photo-description, choice-writing (2 options), choice-writing (2 options), translation
// Edexcel Higher: choice-writing, choice-writing, paragraph-translation
export type QuestionType =
  | 'photo-description'    // AQA F-Q1 / Edexcel F-Q1: Describe photo
  | 'short-message'        // AQA F-Q2: Short message with bullet points
  | 'gap-fill'             // AQA F-Q3: Fill in the gaps
  | 'translation'          // AQA F-Q4 / AQA H-Q1 / Edexcel F-Q4: Translate sentences
  | 'extended-writing'     // AQA F-Q5: Extended writing with bullet points
  | 'overlap-writing'      // AQA H-Q2: 90-word writing with 3 bullet points (choice of 2)
  | 'open-writing'         // AQA H-Q3: 150-word writing with 2 bullets (choice of 2)
  | 'choice-writing'       // Edexcel: Choice between 2(a) or 2(b) with different prompts
  | 'paragraph-translation'; // Edexcel H-Q3: Translate a paragraph

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

/**
 * Q1: Photo Description
 * Student writes 5 sentences describing a photo
 */
export interface PhotoDescriptionData {
  photoUrl: string; // URL to photo in Supabase storage
  photoPrompt?: string; // Optional prompt text
}

/**
 * Q2: Short Message
 * Student writes ~50 words mentioning all bullet points
 */
export interface ShortMessageData {
  prompt: string; // e.g., "Write a short message to your friend about your holidays"
  wordCount: number; // e.g., 50
  bulletPoints: string[]; // e.g., ["city", "hotel", "food", "weather", "beach"]
}

/**
 * Q3: Gap Fill
 * Student selects the correct word to fill in the gap from 4 options
 */
export interface GapFillData {
  sentences: Array<{
    number: number;
    completeSentence: string; // e.g., "ME GUSTA IR AL CINE"
    gapPosition: number; // Which word is missing (1-based index, e.g., 3 for "IR")
    options: string[]; // 4 multiple choice options (e.g., ["ir", "ser", "estar", "hacer"])
    correctAnswer: string; // The correct option (e.g., "ir")
  }>;
}

/**
 * Q4: Translation
 * Student translates sentences from English to target language
 */
export interface TranslationData {
  sentences: Array<{
    number: number;
    englishText: string; // English sentence to translate
    correctTranslation: string; // Correct translation in target language
    alternativeTranslations?: string[]; // Optional alternative correct translations
  }>;
}

/**
 * Q5: Extended Writing (Foundation)
 * Student writes ~90 words addressing all bullet points
 */
export interface ExtendedWritingData {
  prompt: string; // e.g., "You are writing an article about your daily life and aspirations"
  wordCount: number; // e.g., 90
  bulletPoints: string[]; // e.g., ["What you did yesterday (past tense)", ...]
}

/**
 * Higher Q2: Overlap Writing
 * Student writes ~90 words addressing 3 bullet points
 * Choice of 2 questions
 */
export interface OverlapWritingData {
  option1: {
    prompt: string; // e.g., "Write about your school life"
    wordCount: number; // 90
    bulletPoints: string[]; // 3 bullet points
  };
  option2: {
    prompt: string; // e.g., "Write about your hobbies"
    wordCount: number; // 90
    bulletPoints: string[]; // 3 bullet points
  };
}

/**
 * Higher Q3: Open Writing
 * Student writes ~150 words addressing 2 bullets
 * Choice of 2 questions (or just 1 as per user preference)
 */
export interface OpenWritingData {
  option1: {
    prompt: string; // e.g., "Write about your future plans"
    wordCount: number; // 150
    bulletPoints: string[]; // 2 bullet points
  };
  option2?: {
    prompt: string; // e.g., "Write about a memorable experience"
    wordCount: number; // 150
    bulletPoints: string[]; // 2 bullet points
  };
}

/**
 * Edexcel: Choice Writing
 * Student chooses between option (a) or option (b)
 * Each option has different prompt and bullet points
 */
export interface ChoiceWritingData {
  optionA: {
    prompt: string; // e.g., "Write an article about a music group you know"
    wordCount: number; // e.g., 40-50 for Foundation Q2, 80-90 for Foundation Q3
    bulletPoints: string[]; // e.g., 3 bullet points for Foundation Q2, 4 for Q3
    marks: number; // e.g., 14 for Foundation Q2, 18 for Foundation Q3
  };
  optionB: {
    prompt: string;
    wordCount: number;
    bulletPoints: string[];
    marks: number;
  };
}

/**
 * Edexcel Higher Q3: Paragraph Translation
 * Student translates a full paragraph from English to target language
 */
export interface ParagraphTranslationData {
  englishParagraph: string; // The full paragraph in English
  correctTranslation: string; // Expected translation (for teacher reference)
  marks: number; // Always 10 marks
}

// Union type for all question data types
export type QuestionData =
  | PhotoDescriptionData
  | ShortMessageData
  | GapFillData
  | TranslationData
  | ExtendedWritingData
  | OverlapWritingData
  | OpenWritingData
  | ChoiceWritingData
  | ParagraphTranslationData;

// API Response Types
export interface ListPapersResponse {
  success: boolean;
  papers: AQAWritingPaper[];
}

export interface GetPaperResponse {
  success: boolean;
  paper: AQAWritingPaper & { questions: AQAWritingQuestion[] };
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
  paper: AQAWritingPaper;
  error?: string;
}

export interface UpdatePaperResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface DeletePaperResponse {
  success: boolean;
  message: string;
  soft_delete: boolean;
}

// Photo upload response
export interface PhotoUploadResponse {
  success: boolean;
  photoUrl?: string;
  error?: string;
}


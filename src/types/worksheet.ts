export type ExerciseType =
  | 'fill_in_blanks'
  | 'multiple_choice'
  | 'error_correction'
  | 'translation'
  | 'matching'
  | 'word_order'
  | 'translation_both_ways';

export interface StudentInfo {
  nameField: boolean;
  dateField: boolean;
  classField: boolean;
}

export interface ConjugationTable {
  verb: string;
  type: string;
  english: string;
  conjugations?: { [pronoun: string]: string };
}

export interface EndingPattern {
  type: string;
  endings: string[];
  color: 'yellow' | 'blue' | 'green';
}

export interface ReferenceSection {
  title: string;
  conjugationTables?: ConjugationTable[];
  content?: string;
  endingPatterns?: EndingPattern[];
}

export interface QuestionItem {
  spanish?: string;
  english?: string;
  sentence?: string;
}

export interface Question {
  number?: number;
  sentence?: string;
  verb?: string;
  options?: string[];
  answer?: string;
  english?: string;
  spanish?: string;
  incorrect?: string;
  correct?: string;
  scrambled?: string;
  section?: string; // used in translation_both_ways
  items?: QuestionItem[]; // used in translation_both_ways
  original?: string; // For error correction
  error?: string; // For error correction
  text?: string; // For error correction
}

export interface Exercise {
  type: ExerciseType;
  title: string;
  instructions: string;
  questions: Question[];
}

export interface WorksheetContent {
  title: string;
  language?: string;
  level?: string;
  studentInfo: StudentInfo;
  introductoryExplanation?: {
    title: string;
    content: string;
  };
  referenceSection?: ReferenceSection;
  exercises: Exercise[];
}


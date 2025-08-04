// Shared types for assignment creation components

export interface VocabularyConfig {
  source: 'category' | 'theme' | 'topic' | 'custom' | 'create' | '';
  language?: string;
  categories?: string[]; // Support multiple categories
  subcategories?: string[]; // Support multiple subcategories
  category?: string; // Keep for backward compatibility
  subcategory?: string; // Keep for backward compatibility
  theme?: string;
  topic?: string;
  customListId?: string;
  customList?: any;
  wordCount?: number;
  difficulty?: string;
  curriculumLevel?: 'KS3' | 'KS4';
}

export interface SentenceConfig {
  source: 'theme' | 'topic' | 'custom' | 'create' | '';
  theme?: string;
  topic?: string;
  customSetId?: string;
  customSet?: any;
  sentenceCount?: number;
  difficulty?: string;
  grammarFocus?: string;
}

export interface GrammarConfig {
  language: 'spanish' | 'french' | 'german';
  verbTypes: ('regular' | 'irregular' | 'stem-changing')[];
  tenses: ('present' | 'preterite' | 'imperfect' | 'future' | 'conditional' | 'subjunctive')[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  verbCount?: number;
  focusAreas?: ('conjugation' | 'recognition' | 'translation')[];
}

export interface AssessmentConfig {
  selectedAssessments: Array<{
    id: string;
    type: string;
    name: string;
    estimatedTime: string;
    skills: string[];
    instanceConfig?: {
      language?: 'spanish' | 'french' | 'german';
      level?: 'KS3' | 'KS4';
      difficulty?: 'foundation' | 'higher';
      examBoard?: 'AQA' | 'Edexcel' | 'Eduqas' | 'General';
      category?: string;
      subcategory?: string;
      timeLimit?: number;
      maxAttempts?: number;
      autoGrade?: boolean;
      feedbackEnabled?: boolean;
    };
  }>;
  generalLanguage: 'spanish' | 'french' | 'german';
  generalLevel: 'KS3' | 'KS4';
  generalDifficulty: 'foundation' | 'higher';
  generalExamBoard: 'AQA' | 'Edexcel' | 'Eduqas' | 'General';
  generalTimeLimit: number;
  generalMaxAttempts: number;
  generalAutoGrade: boolean;
  generalFeedbackEnabled: boolean;
  assessmentCategory: string;
  assessmentSubcategory: string;
}

export interface UnifiedGameConfig {
  selectedGames: string[]; // List of game IDs to match existing structure
  vocabularyConfig: VocabularyConfig;
  sentenceConfig: SentenceConfig;
  grammarConfig: GrammarConfig;
  difficulty: string;
  timeLimit: number;
  maxAttempts: number;
  powerUpsEnabled: boolean;
  hintsAllowed: boolean;
  autoGrade: boolean;
  feedbackEnabled: boolean;
}

export interface AssignmentDetails {
  title: string;
  description: string;
  dueDate: string;
  selectedClasses: string[];
  estimatedTime: number;
  instructions: string;
  allowLateSubmissions: boolean;
  maxAttempts: number;
  showResults: boolean;
  randomizeOrder: boolean;
}

export interface AssignmentStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export interface StepProps {
  assignmentDetails: AssignmentDetails;
  setAssignmentDetails: React.Dispatch<React.SetStateAction<AssignmentDetails>>;
  gameConfig: UnifiedGameConfig;
  setGameConfig: React.Dispatch<React.SetStateAction<UnifiedGameConfig>>;
  assessmentConfig: AssessmentConfig;
  setAssessmentConfig: React.Dispatch<React.SetStateAction<AssessmentConfig>>;
  onStepComplete: (stepId: string, completed: boolean) => void;
  classes: Array<{ id: string; name: string; student_count: number }>;
  loading?: boolean;
  error?: string | null;
}

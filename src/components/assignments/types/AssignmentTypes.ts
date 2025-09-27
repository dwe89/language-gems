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
  // KS4 specific fields
  themes?: string[]; // Support multiple themes for KS4
  units?: string[]; // Support multiple units for KS4
  examBoard?: 'AQA' | 'Edexcel';
  tier?: 'foundation' | 'higher';
  // Other fields
  customListId?: string;
  customList?: any;
  wordCount?: number;
  difficulty?: string;
  curriculumLevel?: 'KS3' | 'KS4';
  // New vocabulary options
  useAllWords?: boolean;
  shuffleWords?: boolean;
}

export interface SentenceConfig {
  source: 'category' | 'subcategory' | 'custom' | 'create' | '';
  category?: string;
  subcategory?: string;
  customSetId?: string;
  customSet?: any;
  sentenceCount?: number;
  difficulty?: string;
  grammarFocus?: string;
}

export interface GrammarConfig {
  // Legacy conjugation-specific config (for backward compatibility)
  language: 'spanish' | 'french' | 'german';
  verbTypes: ('regular' | 'irregular' | 'stem-changing' | 'reflexive')[];
  tenses: (
    // Simple tenses
    'present' | 'preterite' | 'imperfect' | 'future' | 'conditional' |
    'present_subjunctive' | 'imperfect_subjunctive' |
    // Compound tenses
    'present_perfect' | 'past_perfect' | 'future_perfect' | 'conditional_perfect' |
    'present_perfect_subjunctive' | 'past_perfect_subjunctive'
  )[];
  persons: ('yo' | 'tu' | 'el_ella_usted' | 'nosotros' | 'vosotros' | 'ellos_ellas_ustedes')[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  verbCount?: number;
  focusAreas?: ('conjugation' | 'recognition' | 'translation')[];

  // New comprehensive grammar config
  grammarType?: 'conjugation' | 'comprehensive';
  selectedTopics?: string[]; // Grammar topic IDs
  selectedContent?: string[]; // Grammar content IDs
  contentTypes?: ('lesson' | 'quiz' | 'practice')[];
  curriculumLevel?: 'KS3' | 'KS4';
  difficultyFilter?: ('beginner' | 'intermediate' | 'advanced')[];
  timeLimit?: number;
  maxAttempts?: number;
  showHints?: boolean;
  randomizeQuestions?: boolean;
}

export interface SkillsConfig {
  selectedSkills: Array<{
    id: string;
    type: string;
    name: string;
    estimatedTime: string;
    skills: string[];
    instanceConfig?: {
      language?: 'spanish' | 'french' | 'german';
      level?: 'KS3' | 'KS4';
      category?: string;
      topicIds?: string[];
      contentTypes?: ('lesson' | 'quiz' | 'practice')[];
      timeLimit?: number;
      maxAttempts?: number;
      showHints?: boolean;
      randomizeQuestions?: boolean;
    };
  }>;
  generalLanguage: 'spanish' | 'french' | 'german';
  generalLevel: 'KS3' | 'KS4';
  generalTimeLimit: number;
  generalMaxAttempts: number;
  generalShowHints: boolean;
  generalRandomizeQuestions: boolean;
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

export interface VocabularyTestConfig {
  test_id?: string; // For existing tests
  title?: string; // For new tests
  description?: string;
  language: string;
  curriculum_level: 'KS3' | 'KS4';
  test_type: 'translation_to_english' | 'translation_to_target' | 'multiple_choice' | 'spelling_audio' | 'mixed';
  vocabulary_source: 'category' | 'custom_list' | 'assignment_vocabulary';
  vocabulary_criteria: any;
  word_count: number;
  time_limit_minutes: number;
  max_attempts: number;
  randomize_questions: boolean;
  show_immediate_feedback: boolean;
  allow_hints: boolean;
  passing_score_percentage: number;
  points_per_question: number;
  time_bonus_enabled: boolean;
}

export interface UnifiedGameConfig {
  selectedGames: string[]; // List of game IDs to match existing structure
  vocabularyConfig: VocabularyConfig;
  sentenceConfig: SentenceConfig;
  grammarConfig: GrammarConfig;
  vocabularyTestConfig?: VocabularyTestConfig; // Add vocabulary test config
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
  curriculum_level?: 'KS3' | 'KS4';
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
  skillsConfig: SkillsConfig;
  setSkillsConfig: React.Dispatch<React.SetStateAction<SkillsConfig>>;
  onStepComplete: (stepId: string, completed: boolean) => void;
  classes: Array<{ id: string; name: string; student_count: number }>;
  loading?: boolean;
  error?: string | null;
}

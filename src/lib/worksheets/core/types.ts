// Define shared types for the worksheet generation system

export interface WorksheetRequest {
  // Template-specific fields
  template?: string; // Template ID (vocabulary_builder, verb_conjugation, etc.)

  // Core fields
  subject: string;
  generateSeoAndTags?: boolean;
  subjectObject?: any;
  topic?: string;
  subSubject?: string;
  subtopic?: string;
  difficulty?: string;
  gradeLevel?: number;
  targetQuestionCount?: number;
  questionTypes?: string[];
  additionalInstructions?: string;
  customPrompt?: string;
  customVocabulary?: string;
  targetLanguage?: string;
  languageSkillFocus?: string[];
  skill?: string;
  curriculum?: string;
  examBoard?: string;

  // Vocabulary system integration
  curriculumLevel?: 'KS3' | 'KS4';
  tier?: 'foundation' | 'higher';
  category?: string;
  subcategory?: string;
  responseAreaType?: ResponseAreaType;
  theme?: string;
  graphPaperStyle?: 'none' | 'small_grid' | 'large_grid' | 'dots';
  useSeedQuestions?: boolean;
  advancedOptions?: {
    // Generic options
    responseSpaceSize?: string;
    bookSelection?: string;
    includeReadingPassage?: boolean;
    includeWritingPrompt?: boolean;
    responseAreaType?: string;
    calculatorAllowed?: boolean;
    formulaSheetIncluded?: boolean;

    // GCSE Math Specific
    includeMarks?: boolean;
    startMarksAt?: number;

    // Science Specific
    experimentType?: string;
    includeDiagrams?: boolean;
    includeDataTables?: boolean;
    scienceField?: string;
    biologyTopic?: string;
    chemistryTopic?: string;
    physicsTopic?: string;
    earthScienceTopic?: string;
    environmentalTopic?: string;
    astronomyTopic?: string;
    geneticsTopic?: string;
    dataScienceTopic?: string;
    scienceSpecificConcepts?: string;
    scienceQuestionTypes?: string[];

    // Computer Science Specific
    csSpecificOptions?: string[];
    showExampleCode?: boolean;
    showDiagrams?: boolean;

    // Design & Technology Specific
    designTechFocus?: string;
    designTechProjectType?: string;
    includeDrawingSpace?: boolean;

    // English Specific
    englishTopic?: string;
    englishSubtopic?: string;
    englishSpecificConcepts?: string;
    readingTextType?: string;
    customText?: string;
    readingQuestionTypes?: string[];
    comprehensionSkills?: string[];
    grammarExerciseTypes?: string[];
    vocabExerciseTypes?: string[];
    vocabularyFocus?: string | string[];
    topic?: string;

    // Vocabulary specific
    vocabularyTheme?: string;
    includeVocabImages?: boolean;
    includeVocabExamples?: boolean;
    customVocabulary?: string;

    // Foreign Language Specific
    includeVocabularyList?: boolean;
    targetLanguage?: string;
    languageSkillFocus?: string[];
    questionsInTargetLanguage?: boolean;
    includeGrammarExplanations?: boolean;
    includeExampleSentences?: boolean;
    includeWritingPrompts?: boolean;
    includeConjugationTable?: boolean;
    verbTense?: string;
    verbType?: string;
    includeTranslations?: boolean;
    includeAudio?: boolean;
    includeGrammer?: boolean;
    includeVisualAids?: boolean;
  };
  gradeDisplayName?: string;
  convertedGradeLevel?: string;
  layout?: WorksheetLayout;
  customReadingText?: string;
  jobId?: string;
  originalSubject?: string;
  proficiencyBand?: number;
  language?: string;
  userId?: string; // For error logging and user tracking


  // Methods added by extendWorksheetRequest
  getTopicNameById?: (topicId: string) => string;
  includes?: (type: string) => boolean;

  // English writing specific options
  writingType?: string;
  writingPrompt?: string;
  includePlanningSection?: boolean;
  includeWritingChecklist?: boolean;
  englishWorksheetType?: string;

  // Function to extend the request
  extend?: (extension: Partial<WorksheetRequest>) => WorksheetRequest;
}

// Add this extension to the WorksheetRequest interface
export function extendWorksheetRequest(request: WorksheetRequest): WorksheetRequest {
  // Add method to check if a question type is included
  request.includes = function(type: string): boolean {
    return this.questionTypes?.includes(type) || false;
  };

  return request;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  answer?: string;
  marks?: number;
  difficulty?: string;
  imageUrl?: string;
  explanation?: string;
  subQuestions?: Question[];
  image?: string;
  audio?: string;
  metadata?: Record<string, any>;
  suggestedResponseSize?: 'small' | 'medium' | 'large' | number;
}

export type QuestionType =
  | 'multiple_choice'
  | 'short_answer'
  | 'short_answer_math'
  | 'long_answer'
  | 'fill_in_blank'
  | 'matching'
  | 'true_false'
  | 'scenario_analysis'
  | 'calculation'
  | 'wordProblem'
  | 'essay'
  | 'ordering'
  | 'translation'
  | 'data_analysis'
  | 'experiment_design'
  | 'case_study'
  | 'diagram_interpretation'
  | 'timeline'
  | 'map_labeling'
  | 'primary_source'
  | 'comparison'
  | 'step_by_step'
  | 'practical_task'
  | 'design_task';

export interface WorksheetMetadata {
  title: string;
  subject: string;
  difficulty?: string;
  gradeLevel?: string;
  curriculum?: string;
  examBoard?: string;
  learningObjectives?: string[];
  responseAreaType?: ResponseAreaType;
  template?: string;
  vocabularySource?: string;
  curriculumLevel?: string;
  tier?: string;
  grammarFocus?: string | string[];
  targetLanguage?: string;

  // English writing specific options
  writingPrompt?: string;
  includePlanningSection?: boolean;
  includeWritingChecklist?: boolean;
  englishWorksheetType?: string;
}

export type ResponseAreaType =
  | 'standard'
  | 'grid_small'
  | 'grid_large'
  | 'coordinate_plane'
  | 'number_line'
  | 'equation_space'
  | 'short_answer_math'
  | 'coordinate'
  | 'equation';

export interface WorksheetLayout {
  format: 'single-column' | 'two-column' | 'grid';
  orientation: 'portrait' | 'landscape';
  theme: string;
  fontSize: 'small' | 'medium' | 'large';
  responseAreaType?: ResponseAreaType;
  questionLayout?: 'single-column' | 'two-column';
}

export interface WorksheetQuestion {
  id?: string;
  type: string;
  text: string;
  prompt?: string;
  options?: string[];
  answer?: string | string[];
  explanation?: string;
  image?: string;
  imageUrl?: string;
  marks?: number;
  responseAreaType?: ResponseAreaType;
  responseLines?: number;
  pairs?: Array<{ left: string; right: string; id?: string }>;
  rightColumnShuffled?: boolean;
  shuffledRightColumn?: string[];
  transformationWord?: string; // Added to fix another TS error
}

export interface WorksheetSection {
  title: string;
  description?: string;
  content?: string;
  instructions?: string;
  type?: string;
  questions: WorksheetQuestion[];
  responseAreaType?: ResponseAreaType;
}

export interface Worksheet {
  id: string;
  title: string;
  subject: string;
  topic?: string;
  difficulty?: string;
  instructions?: string;
  introduction?: string;
  sections: WorksheetSection[];
  metadata?: WorksheetMetadata;
  language?: string;
  revision?: number;
  version?: string;
  estimatedTimeMinutes?: number;
  tags?: string[];
  seo_description?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  layout?: WorksheetLayout;
  paperSize?: string;
  studentName?: boolean;
  dateField?: boolean;
  includeSolutions?: boolean;
  schoolName?: string;
  logoUrl?: string;
  teacherName?: string;
  classPeriod?: string;
  footerText?: string;
  showPageNumbers?: boolean;
  watermarkUrl?: string;
  backgroundImageUrl?: string;

  // Structured fields for English filtering
  worksheet_type?: string; // reading, writing, grammar, vocabulary, literature

  // Raw content for special templates (like reading comprehension)
  rawContent?: any;

  // SEO and answer key fields
  seo_keywords?: string;
  answerKey?: any;
  passage_category?: string; // fiction, nonfiction, poetry, functional
  passage_type?: string; // short_story, informational, etc.
  literature_work?: string; // Macbeth, etc.
  grammar_focus?: string; // Present Perfect, etc.
  vocabulary_theme?: string; // Animals, etc.

  // Support for reading passages in the worksheet
  readingPassage?: {
    title?: string;
    text: string;
    language?: string;
  } | string;

  // English writing specific options
  writingPrompt?: string;
  includePlanningSection?: boolean;
  includeWritingChecklist?: boolean;
}

export interface WorksheetResponse {
  worksheet: Worksheet;
  markdown: string;
  usage?: any; // OpenAI token usage object
}

export interface SubjectConfig {
  id: string;
  name: string;
  topics: TopicConfig[];
  supportedExamBoards?: string[];
  supportedGradeLevels: number[];
  defaultQuestionTypes: QuestionType[];
}

export interface TopicConfig {
  id: string;
  name: string;
  subtopics?: TopicConfig[];
  skills?: string[];
}

export interface ExamBoardConfig {
  id: string;
  name: string;
  country: string;
  subjects: {
    [subjectId: string]: {
      specifications: {
        id: string;
        name: string;
        topics: string[];
        skills?: string[];
      }[]
    }
  };
}

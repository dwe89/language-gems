/**
 * Comprehensive Assessment Type Registry
 * Defines all assessment types supported in the teacher dashboard
 * Created: 2025-01-09
 */

export type AssessmentType = 
  | 'reading-comprehension'
  | 'aqa-reading'
  | 'aqa-listening'
  | 'aqa-writing'
  | 'aqa-dictation'
  | 'four-skills'
  | 'exam-style'
  | 'vocabulary-game'
  | 'grammar-practice';

export interface AssessmentTypeConfig {
  type: AssessmentType;
  tableName: string;
  displayName: string;
  icon: string;
  color: string;
  supportsOverride: boolean;
  supportsDetailedBreakdown: boolean;
  resultColumns: string[];
  scoreField: string;
  maxScoreField: string;
  timeField: string;
  responseField?: string;
  studentIdField: string; // Different tables use user_id vs student_id
}

export interface NormalizedAssessmentResult {
  id: string;
  assessmentType: AssessmentType;
  studentId: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  passed: boolean;
  completedAt: string;
  responses: any;
  gcseGrade?: number | null;
  status: string;
  rawData: any;
}

export const ASSESSMENT_TYPE_REGISTRY: Record<AssessmentType, AssessmentTypeConfig> = {
  'reading-comprehension': {
    type: 'reading-comprehension',
    tableName: 'reading_comprehension_results',
    displayName: 'Reading Comprehension',
    icon: 'BookOpen',
    color: 'blue',
    supportsOverride: true,
    supportsDetailedBreakdown: true,
    resultColumns: [
      'id',
      'user_id',
      'score',
      'total_questions',
      'correct_answers',
      'time_spent',
      'passed',
      'question_results',
      'assignment_id',
      'completed_at'
    ],
    scoreField: 'score',
    maxScoreField: 'total_questions',
    timeField: 'time_spent',
    responseField: 'question_results',
    studentIdField: 'user_id'
  },
  'aqa-reading': {
    type: 'aqa-reading',
    tableName: 'aqa_reading_results',
    displayName: 'AQA Reading',
    icon: 'FileText',
    color: 'indigo',
    supportsOverride: true,
    supportsDetailedBreakdown: true,
    resultColumns: [
      'id',
      'student_id',
      'assessment_id',
      'assignment_id',
      'percentage_score',
      'raw_score',
      'total_possible_score',
      'total_time_seconds',
      'status',
      'gcse_grade',
      'responses',
      'performance_by_question_type',
      'completion_time'
    ],
    scoreField: 'percentage_score',
    maxScoreField: 'total_possible_score',
    timeField: 'total_time_seconds',
    responseField: 'responses',
    studentIdField: 'student_id'
  },
  'aqa-listening': {
    type: 'aqa-listening',
    tableName: 'aqa_listening_results',
    displayName: 'AQA Listening',
    icon: 'Headphones',
    color: 'purple',
    supportsOverride: true,
    supportsDetailedBreakdown: true,
    resultColumns: [
      'id',
      'student_id',
      'assessment_id',
      'assignment_id',
      'percentage_score',
      'raw_score',
      'total_possible_score',
      'total_time_seconds',
      'status',
      'gcse_grade',
      'responses',
      'audio_play_counts',
      'performance_by_question_type',
      'completion_time'
    ],
    scoreField: 'percentage_score',
    maxScoreField: 'total_possible_score',
    timeField: 'total_time_seconds',
    responseField: 'responses',
    studentIdField: 'student_id'
  },
  'aqa-writing': {
    type: 'aqa-writing',
    tableName: 'aqa_writing_results',
    displayName: 'AQA Writing',
    icon: 'PenTool',
    color: 'green',
    supportsOverride: true,
    supportsDetailedBreakdown: true,
    resultColumns: [
      'id',
      'student_id',
      'assessment_id',
      'assignment_id',
      'percentage_score',
      'total_score',
      'max_score',
      'time_spent_seconds',
      'is_completed',
      'gcse_grade',
      'completed_at'
    ],
    scoreField: 'percentage_score',
    maxScoreField: 'max_score',
    timeField: 'time_spent_seconds',
    studentIdField: 'student_id'
  },
  'aqa-dictation': {
    type: 'aqa-dictation',
    tableName: 'aqa_dictation_results',
    displayName: 'Dictation',
    icon: 'Mic',
    color: 'orange',
    supportsOverride: true,
    supportsDetailedBreakdown: true,
    resultColumns: [
      'id',
      'student_id',
      'assessment_id',
      'assignment_id',
      'percentage_score',
      'raw_score',
      'total_possible_score',
      'total_time_seconds',
      'status',
      'responses',
      'audio_play_counts',
      'completion_time'
    ],
    scoreField: 'percentage_score',
    maxScoreField: 'total_possible_score',
    timeField: 'total_time_seconds',
    responseField: 'responses',
    studentIdField: 'student_id'
  },
  'four-skills': {
    type: 'four-skills',
    tableName: 'four_skills_assessment_results',
    displayName: 'Four Skills',
    icon: 'Star',
    color: 'yellow',
    supportsOverride: true,
    supportsDetailedBreakdown: true,
    resultColumns: [
      'id',
      'user_id',
      'language',
      'level',
      'difficulty',
      'exam_board',
      'total_score',
      'max_score',
      'percentage',
      'time_spent',
      'passed',
      'assignment_id',
      'completed_at'
    ],
    scoreField: 'percentage',
    maxScoreField: 'max_score',
    timeField: 'time_spent',
    studentIdField: 'user_id'
  },
  'exam-style': {
    type: 'exam-style',
    tableName: 'exam_style_results',
    displayName: 'Exam Style',
    icon: 'Clipboard',
    color: 'red',
    supportsOverride: true,
    supportsDetailedBreakdown: true,
    resultColumns: [
      'id',
      'user_id',
      'question_id',
      'user_answer',
      'score',
      'max_score',
      'time_spent',
      'feedback',
      'assignment_id',
      'completed_at'
    ],
    scoreField: 'score',
    maxScoreField: 'max_score',
    timeField: 'time_spent',
    responseField: 'user_answer',
    studentIdField: 'user_id'
  },
  'vocabulary-game': {
    type: 'vocabulary-game',
    tableName: 'enhanced_game_sessions',
    displayName: 'Vocabulary Game',
    icon: 'Gamepad2',
    color: 'cyan',
    supportsOverride: false,
    supportsDetailedBreakdown: false,
    resultColumns: [
      'id',
      'student_id',
      'assignment_id',
      'game_type',
      'final_score',
      'max_score_possible',
      'accuracy_percentage',
      'completion_status',
      'words_attempted',
      'words_correct',
      'duration_seconds',
      'ended_at'
    ],
    scoreField: 'accuracy_percentage',
    maxScoreField: 'max_score_possible',
    timeField: 'duration_seconds',
    studentIdField: 'student_id'
  },
  'grammar-practice': {
    type: 'grammar-practice',
    tableName: 'grammar_assignment_sessions',
    displayName: 'Grammar Practice',
    icon: 'BookMarked',
    color: 'pink',
    supportsOverride: false,
    supportsDetailedBreakdown: true,
    resultColumns: [
      'id',
      'student_id',
      'assignment_id',
      'topic_id',
      'session_type',
      'accuracy_percentage',
      'questions_correct',
      'total_questions',
      'duration_seconds',
      'completion_status',
      'ended_at'
    ],
    scoreField: 'accuracy_percentage',
    maxScoreField: 'total_questions',
    timeField: 'duration_seconds',
    studentIdField: 'student_id'
  }
};

/**
 * Get configuration for a specific assessment type
 */
export function getAssessmentConfig(type: AssessmentType): AssessmentTypeConfig {
  return ASSESSMENT_TYPE_REGISTRY[type];
}

/**
 * Get all assessment types that support detailed breakdown
 */
export function getDetailedBreakdownTypes(): AssessmentType[] {
  return Object.values(ASSESSMENT_TYPE_REGISTRY)
    .filter(config => config.supportsDetailedBreakdown)
    .map(config => config.type);
}

/**
 * Get all assessment types that support teacher override
 */
export function getOverrideableTypes(): AssessmentType[] {
  return Object.values(ASSESSMENT_TYPE_REGISTRY)
    .filter(config => config.supportsOverride)
    .map(config => config.type);
}

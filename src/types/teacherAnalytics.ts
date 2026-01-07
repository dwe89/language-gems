// =====================================================
// TEACHER INTELLIGENCE DASHBOARD - TYPE DEFINITIONS
// =====================================================

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type EfficacyLevel = 'high' | 'medium' | 'low';
export type TrendDirection = 'up' | 'down' | 'stable';
export type TimeRange = 'last_7_days' | 'last_30_days' | 'current_term' | 'all_time';

// =====================================================
// TIER 1: CLASS SUMMARY
// =====================================================

export interface ClassSummaryData {
  topMetrics: TopMetrics;
  urgentInterventions: UrgentIntervention[];
  studentsNeverLoggedIn: UrgentIntervention[];
  topClassWeakness: ClassWeakness | null;
  recentAssignments: RecentAssignment[];
}

export interface TopMetrics {
  averageScore: number;
  assignmentsOverdue: number;
  currentStreak: number;
  trendPercentage: number;
  trendDirection: TrendDirection;
  activeStudents?: number;
  totalStudents?: number;
  studentsNeverLoggedIn?: number;
}

export interface UrgentIntervention {
  studentId: string;
  studentName: string;
  riskLevel: RiskLevel;
  riskScore: number;
  averageScore: number;
  lastActive: Date | null;
  riskFactors: string[];
}

export interface ClassWeakness {
  skillName: string;
  skillType: 'vocabulary' | 'grammar' | 'general';
  studentsAffected: number;
  totalStudents: number;
  failureRate: number;
  commonError: string;
  recentOccurrences: number; // How many recent assignments tested this
}

export interface RecentAssignment {
  assignmentId: string;
  assignmentName: string;
  averageScore: number;
  efficacy: EfficacyLevel;
  status: 'complete' | 'in-progress' | 'overdue';
  completedCount: number;
  totalStudents: number;
  dueDate: Date | null;
}

// =====================================================
// TIER 2: STUDENT DRILL-DOWN
// =====================================================

export interface StudentProfileData {
  studentInfo: StudentInfo;
  performanceTrend: PerformanceTrend;
  vocabularyMastery: VocabularyMastery[];
  grammarMastery: GrammarMastery[];
  weakSkills: WeakSkills;
  engagementLog: EngagementLog;
}

export interface StudentInfo {
  studentId: string;
  studentName: string;
  email: string;
  className: string;
  classId: string | null;
  lastActive: Date;
}

export interface PerformanceTrend {
  weeklyScores: Array<{
    week: string;
    score: number;
    date: Date;
  }>;
  classAverage: number;
  trendDirection: TrendDirection;
  trendPercentage: number;
}

export interface VocabularyMastery {
  category: string;
  percentage: number;
  current: number;
  total: number;
  classAverage: number;
  riskLevel: RiskLevel;
}

export interface GrammarMastery {
  skillName: string;
  percentage: number;
  correct: number;
  total: number;
  classAverage: number;
  riskLevel: RiskLevel;
}

export interface WeakSkills {
  grammar: Array<{
    skillName: string;
    errorCount: number;
    totalAttempts: number;
    examples: string[];
  }>;
  vocabulary: Array<{
    word: string;
    translation: string;
    correctCount: number;
    totalAttempts: number;
    accuracy: number;
  }>;
}

export interface EngagementLog {
  timeOnTask: number; // seconds
  loginFrequency: number; // count
  gamesPlayed: number; // count
  dailyActivity: Array<{
    day: string;
    date: Date;
    active: boolean;
    minutesSpent: number;
  }>;
  masteryStagnation: boolean; // No VocabMaster progress for 7+ days
  daysSinceLastProgress: number;
}

// =====================================================
// TIER 3: ASSIGNMENT ANALYSIS
// =====================================================

export interface AssignmentAnalysisData {
  assignmentInfo: AssignmentInfo;
  questionBreakdown?: QuestionBreakdown[]; // Optional - only for quiz-style assignments
  distractorAnalysis?: DistractorAnalysis[]; // Optional - only for quiz-style assignments
  timeDistribution: TimeDistribution;
}

export interface AssignmentInfo {
  assignmentId: string;
  assignmentName: string;
  description: string | null;
  completedCount: number;
  totalStudents: number;
  averageScore: number;
  efficacy: EfficacyLevel;
  dueDate: Date | null;
  createdAt: Date;
}

export interface QuestionBreakdown {
  questionId: string;
  questionNumber: number;
  questionPreview: string;
  questionType: 'multiple_choice' | 'fill_blank' | 'short_answer';
  skillArea: string | null;
  accuracy: number;
  correctCount: number;
  totalAttempts: number;
  riskLevel: RiskLevel;
}

export interface DistractorAnalysis {
  questionId: string;
  questionText: string;
  correctAnswer: string;
  distractors: Array<{
    answer: string;
    percentage: number;
    count: number;
    isCorrect: boolean;
  }>;
  insight: string;
  misconceptionDetected: boolean;
}

export interface TimeDistribution {
  median: number;
  min: number;
  max: number;
  average: number;
  buckets: Array<{
    range: string; // "5-10 min"
    minMinutes: number;
    maxMinutes: number;
    count: number;
  }>;
  wideDistribution: boolean; // Range > 20 minutes
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ClassSummaryResponse {
  success: boolean;
  data: ClassSummaryData;
  timeRange: TimeRange;
  generatedAt: Date;
}

export interface StudentProfileResponse {
  success: boolean;
  data: StudentProfileData;
  timeRange: TimeRange;
  generatedAt: Date;
}

export interface AssignmentAnalysisResponse {
  success: boolean;
  data: AssignmentAnalysisData;
  generatedAt: Date;
}

// =====================================================
// FILTER & SORT OPTIONS
// =====================================================

export interface AnalyticsFilters {
  timeRange: TimeRange;
  classId?: string;
  riskLevel?: RiskLevel;
  sortBy?: 'risk' | 'score' | 'activity' | 'name';
  sortDirection?: 'asc' | 'desc';
}

// =====================================================
// CHART DATA TYPES
// =====================================================

export interface TrendChartData {
  labels: string[];
  studentData: number[];
  classAverageData: number[];
  trendLine?: number[];
}

export interface ProgressBarData {
  label: string;
  percentage: number;
  current: number;
  total: number;
  classAverage: number;
  color: string;
}

export interface HistogramData {
  buckets: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  median: number;
  average: number;
}


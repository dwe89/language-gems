/**
 * Teacher Vocabulary Analytics Types
 * 
 * Uses simple 3-tier Proficiency Level system for teacher-facing analytics:
 * 🔴 Struggling: Accuracy < 60% OR total_encounters < 3
 * 🟡 Learning: Accuracy 60-89% AND total_encounters >= 3
 * 🟢 Proficient: Accuracy >= 90% AND total_encounters >= 5
 * 
 * Note: FSRS mastery_level (0-5) is kept in vocabulary_gem_collection for
 * VocabMaster spaced repetition but hidden from teacher dashboards.
 */

export type ProficiencyLevel = 'struggling' | 'learning' | 'proficient';

export interface StudentVocabularyProgress {
  studentId: string;
  studentName: string;
  totalWords: number;
  proficientWords: number;  // Replaces masteredWords
  learningWords: number;     // NEW
  strugglingWords: number;
  overdueWords: number;
  averageAccuracy: number;
  lastActivity: string | null;
  classId: string;
  className: string;
}

export interface ClassVocabularyStats {
  totalStudents: number;
  totalWords: number;
  proficientWords: number;   // Replaces averageMasteredWords
  learningWords: number;      // NEW
  strugglingWords: number;    // NEW (was just a count, now class-wide)
  averageAccuracy: number;
  studentsWithOverdueWords: number;
  topPerformingStudents: StudentVocabularyProgress[];
  strugglingStudents: StudentVocabularyProgress[];
  totalWordsReadyForReview: number;
}

export interface TopicAnalysis {
  category: string;
  subcategory: string | null;
  theme: string | null;
  language: string;
  curriculumLevel: string;
  totalStudents: number;
  studentsEngaged: number;
  averageAccuracy: number;
  totalWords: number;
  proficientWords: number;   // Replaces masteredWords
  learningWords: number;      // NEW
  strugglingWords: number;
  isWeakTopic: boolean;
  isStrongTopic: boolean;
  recommendedAction: string;
}

export interface VocabularyTrend {
  date: string;
  totalWords: number;
  proficientWords: number;   // Replaces masteredWords
  learningWords: number;      // NEW
  strugglingWords: number;    // NEW
  averageAccuracy: number;
  activeStudents: number;
  wordsLearned: number;
}

export interface WordDetail {
  word: string;
  translation: string;
  category: string;
  subcategory: string | null;
  language: string;
  totalEncounters: number;
  correctEncounters: number;
  accuracy: number;
  proficiencyLevel: ProficiencyLevel;  // Replaces masteryLevel number
  studentsStruggling: number;
  studentsProficient: number;  // Replaces studentsMastered
  studentsLearning: number;     // NEW
  commonErrors: string[];
}

export interface StudentWordDetail {
  studentId: string;
  studentName: string;
  strongWords: Array<{
    word: string;
    translation: string;
    accuracy: number;
    proficiencyLevel: ProficiencyLevel;  // Replaces masteryLevel number
    category: string;
  }>;
  weakWords: Array<{
    word: string;
    translation: string;
    accuracy: number;
    totalEncounters: number;
    category: string;
    errorPattern?: string;
  }>;
  recentProgress: Array<{
    word: string;
    beforeAccuracy: number;
    afterAccuracy: number;
    improvement: number;
  }>;
}

export interface TeacherVocabularyAnalytics {
  classStats: ClassVocabularyStats;
  studentProgress: StudentVocabularyProgress[];
  topicAnalysis: TopicAnalysis[];
  trends: VocabularyTrend[];
  insights: {
    weakestTopics: TopicAnalysis[];
    strongestTopics: TopicAnalysis[];
    studentsNeedingAttention: StudentVocabularyProgress[];
    classRecommendations: string[];
  };
  detailedWords?: WordDetail[];
  studentWordDetails?: StudentWordDetail[];
}

/**
 * Calculate proficiency level based on accuracy and exposure
 * 
 * @param accuracy - Percentage (0-100)
 * @param totalEncounters - Number of times word was encountered
 * @returns ProficiencyLevel - 'struggling', 'learning', or 'proficient'
 */
export function calculateProficiencyLevel(
  accuracy: number,
  totalEncounters: number
): ProficiencyLevel {
  // 🔴 Struggling: Low accuracy OR insufficient exposure
  if (accuracy < 60 || totalEncounters < 3) {
    return 'struggling';
  }
  
  // 🟢 Proficient: High accuracy AND sufficient exposure
  if (accuracy >= 90 && totalEncounters >= 5) {
    return 'proficient';
  }
  
  // 🟡 Learning: Everything in between
  return 'learning';
}

/**
 * Get proficiency level emoji for display
 */
export function getProficiencyEmoji(level: ProficiencyLevel): string {
  switch (level) {
    case 'struggling':
      return '🔴';
    case 'learning':
      return '🟡';
    case 'proficient':
      return '🟢';
  }
}

/**
 * Get proficiency level label for display
 */
export function getProficiencyLabel(level: ProficiencyLevel): string {
  switch (level) {
    case 'struggling':
      return 'Struggling';
    case 'learning':
      return 'Learning';
    case 'proficient':
      return 'Proficient';
  }
}

/**
 * Get proficiency level color for UI
 */
export function getProficiencyColor(level: ProficiencyLevel): string {
  switch (level) {
    case 'struggling':
      return 'red';
    case 'learning':
      return 'yellow';
    case 'proficient':
      return 'green';
  }
}


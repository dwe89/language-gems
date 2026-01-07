import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Simple 3-tier proficiency system for teacher-facing analytics
 * 🔴 Struggling: Accuracy < 60% OR total_encounters < 3
 * 🟡 Learning: Accuracy 60-89% AND total_encounters >= 3
 * 🟢 Proficient: Accuracy >= 90% AND total_encounters >= 5
 */
export type ProficiencyLevel = 'struggling' | 'learning' | 'proficient';

/**
 * Calculate proficiency level based on accuracy and exposure
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

export interface StudentVocabularyProgress {
  studentId: string;
  studentName: string;
  totalWords: number;
  proficientWords: number;  // Changed from masteredWords
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
  proficientWords: number;   // Changed from averageMasteredWords
  learningWords: number;      // NEW
  strugglingWords: number;    // NEW
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
  proficientWords: number;   // Changed from masteredWords
  learningWords: number;      // NEW
  strugglingWords: number;
  isWeakTopic: boolean;
  isStrongTopic: boolean;
  recommendedAction: string;
}

export interface VocabularyTrend {
  date: string;
  totalWords: number;
  proficientWords: number;   // Changed from masteredWords
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
  masteryLevel: number;  // Average mastery level across all students (0-5 scale)
  proficiencyLevel: ProficiencyLevel;  // Changed from masteryLevel
  studentsStruggling: number;
  studentsProficient: number;  // Changed from studentsMastered
  studentsLearning: number;     // NEW
  commonErrors: string[];
  strugglingCount: number;
  mistakeCount?: number;
}

export interface StudentWordDetail {
  studentId: string;
  studentName: string;
  strongWords: Array<{
    word: string;
    translation: string;
    accuracy: number;
    proficiencyLevel: ProficiencyLevel;  // Changed from masteryLevel
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
  detailedWordAnalytics?: WordDetail[];
  studentWordDetails?: StudentWordDetail[];
}

export class TeacherVocabularyAnalyticsService {
  constructor(private supabase: SupabaseClient) { }

  /**
   * Get comprehensive vocabulary analytics for all classes taught by a teacher
   */
  async getTeacherVocabularyAnalytics(
    teacherId: string,
    classId?: string,
    dateRange?: { from: string; to: string },
    sections: string[] = ['stats', 'students', 'trends', 'topics', 'words'] // Default to all for backward compatibility
  ): Promise<TeacherVocabularyAnalytics> {
    console.log('🔍 [TEACHER VOCAB ANALYTICS] Getting analytics for teacher:', teacherId, 'Sections:', sections);

    try {
      // Get teacher's classes
      const classes = await this.getTeacherClasses(teacherId, classId);
      console.log('📚 [TEACHER VOCAB ANALYTICS] Found classes:', classes.length);

      if (classes.length === 0) {
        return this.getEmptyAnalytics();
      }

      // Get all students from these classes
      const students = await this.getStudentsFromClasses(classes.map(c => c.id));
      console.log('👥 [TEACHER VOCAB ANALYTICS] Found students:', students.length);

      if (students.length === 0) {
        return this.getEmptyAnalytics();
      }

      // 1. Always fetch basic student progress as it's needed for stats
      const studentProgress = await this.getStudentVocabularyProgress(students, classes);

      // 2. Conditionally fetch other sections
      let topicAnalysis: TopicAnalysis[] = [];
      if (sections.includes('topics')) {
        console.log('📊 [TOPICS] Fetching topic analysis for', students.length, 'students');
        topicAnalysis = await this.getTopicAnalysis(students.map(s => s.id));
        console.log('📊 [TOPICS] Result:', topicAnalysis.length, 'topics found');
      }

      let trends: VocabularyTrend[] = [];
      if (sections.includes('trends')) {
        console.log('📈 [TRENDS] Fetching trends for', students.length, 'students');
        trends = await this.getVocabularyTrends(students.map(s => s.id), dateRange);
        console.log('📈 [TRENDS] Result:', trends.length, 'trend points found');
      }

      let detailedWords: WordDetail[] = [];
      if (sections.includes('words')) {
        console.log('📝 [WORDS] Fetching detailed words for', students.length, 'students');
        detailedWords = await this.getDetailedWordAnalytics(students.map(s => s.id));
        console.log('📝 [WORDS] Result:', detailedWords.length, 'words found');
      }

      let studentWordDetails: StudentWordDetail[] = [];
      // Fetch student details if requested OR if we need them for "words" view (though usually separate)
      if (sections.includes('students_detailed')) {
        studentWordDetails = await this.getStudentWordDetails(students);
      }

      // Calculate class stats
      // Note: If detailedWords is empty (not fetched), totalWords might be less accurate but fallback to student data
      const totalUniqueWords = detailedWords.length > 0
        ? detailedWords.length
        : studentProgress.reduce((acc, s) => acc + s.totalWords, 0); // Approximation if detailed not fetched

      const classStats = this.calculateClassStats(studentProgress, totalUniqueWords);

      console.log('📊 [CLASS STATS DEBUG]', {
        totalStudents: classStats.totalStudents,
        totalWords: classStats.totalWords,
        proficientWords: classStats.proficientWords,
        learningWords: classStats.learningWords,
        averageAccuracy: classStats.averageAccuracy,
        uniqueWordsFromDetailed: detailedWords.length,
        sampleStudentProgress: studentProgress.slice(0, 3).map(s => ({
          name: s.studentName,
          totalWords: s.totalWords,
          proficientWords: s.proficientWords,
          accuracy: s.averageAccuracy
        }))
      });

      // Generate insights if we have topic analysis
      const insights = this.generateInsights(studentProgress, topicAnalysis);

      return {
        classStats,
        studentProgress,
        topicAnalysis,
        trends,
        insights,
        detailedWordAnalytics: detailedWords,
        studentWordDetails
      };

    } catch (error) {
      console.error('❌ [TEACHER VOCAB ANALYTICS] Error getting analytics:', error);
      throw error;
    }
  }

  /**
   * Get teacher's classes
   */
  private async getTeacherClasses(teacherId: string, classId?: string) {
    let query = this.supabase
      .from('classes')
      .select('id, name, description')
      .eq('teacher_id', teacherId);

    if (classId) {
      query = query.eq('id', classId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  /**
   * Get students from classes
   */
  private async getStudentsFromClasses(classIds: string[]) {
    const { data, error } = await this.supabase
      .from('class_enrollments')
      .select(`
        student_id,
        class_id,
        classes!inner(
          id,
          name
        )
      `)
      .in('class_id', classIds)
      .eq('status', 'active');

    if (error) throw error;

    // Get student names from user_profiles
    const studentIds = (data || []).map(item => item.student_id);
    if (studentIds.length === 0) return [];

    const { data: profileData, error: profileError } = await this.supabase
      .from('user_profiles')
      .select('user_id, display_name, email')
      .in('user_id', studentIds);

    if (profileError) throw profileError;

    const profileMap = new Map((profileData || []).map(p => [p.user_id, p]));

    return (data || []).map(item => {
      const profile = profileMap.get(item.student_id);
      // Type assertion needed because Supabase's type inference doesn't handle joins well
      const classes = item.classes as unknown as { id: string; name: string };
      return {
        id: item.student_id,
        name: profile?.display_name || profile?.email || 'Unknown Student',
        classId: item.class_id,
        className: classes.name
      };
    });
  }

  /**
   * Get vocabulary progress for all students
   * OPTIMIZED: Single bulk query instead of N queries
   */
  private async getStudentVocabularyProgress(
    students: Array<{ id: string; name: string; classId: string; className: string }>,
    classes: Array<{ id: string; name: string }>
  ): Promise<StudentVocabularyProgress[]> {
    if (students.length === 0) return [];

    const progress: StudentVocabularyProgress[] = [];
    const studentIds = students.map(s => s.id);

    try {
      // OPTIMIZED: Single query for all students instead of N queries
      console.log('🚀 [OPTIMIZATION] Fetching vocabulary data for', studentIds.length, 'students in one query');

      // 🔥 CRITICAL: Fetch from BOTH tables - vocabulary_gem_collection AND assignment_vocabulary_progress
      // BATCHED Fetching to prevent payload size errors
      const gemData: any[] = [];
      const assignmentVocabData: any[] = [];
      const batchSize = 5;
      const batches = this.chunkArray(studentIds, batchSize);

      console.log(`Processing ${batches.length} batches for vocabulary data...`);

      for (const batch of batches) {
        // Add small delay
        await this.delay(20);

        const [gemResult, assignmentVocabResult] = await Promise.all([
          this.supabase
            .from('vocabulary_gem_collection')
            .select(`
              student_id,
              vocabulary_item_id,
              centralized_vocabulary_id,
              total_encounters,
              correct_encounters,
              mastery_level,
              last_encountered_at,
              next_review_at,
              fsrs_retrievability
            `)
            .in('student_id', batch),

          this.supabase
            .from('assignment_vocabulary_progress')
            .select(`
              student_id,
              vocab_id,
              seen_count,
              correct_count,
              last_seen_at
            `)
            .in('student_id', batch)
        ]);

        if (gemResult.error) {
          console.error('Error getting gem vocabulary data batch:', gemResult.error);
        } else if (gemResult.data) {
          gemData.push(...gemResult.data);
        }

        if (assignmentVocabResult.error) {
          console.error('Error getting assignment vocabulary data batch:', assignmentVocabResult.error);
        } else if (assignmentVocabResult.data) {
          assignmentVocabData.push(...assignmentVocabResult.data);
        }
      }

      if (!gemData && !assignmentVocabData) {
        console.error('No vocabulary data from either source');
        return [];
      }

      // Group gems by student ID for efficient processing
      const gemsByStudent = new Map<string, typeof gemData>();
      (gemData || []).forEach(gem => {
        if (!gemsByStudent.has(gem.student_id)) {
          gemsByStudent.set(gem.student_id, []);
        }
        gemsByStudent.get(gem.student_id)!.push(gem);
      });

      // 🔥 CRITICAL: Group assignment vocabulary by student ID
      const assignmentVocabByStudent = new Map<string, typeof assignmentVocabData>();
      (assignmentVocabData || []).forEach(vocab => {
        if (!assignmentVocabByStudent.has(vocab.student_id)) {
          assignmentVocabByStudent.set(vocab.student_id, []);
        }
        assignmentVocabByStudent.get(vocab.student_id)!.push(vocab);
      });

      console.log('📊 [VOCAB DATA] Loaded:', {
        gemsStudents: gemsByStudent.size,
        assignmentVocabStudents: assignmentVocabByStudent.size,
        totalGems: gemData?.length || 0,
        totalAssignmentVocab: assignmentVocabData?.length || 0
      });

      // 🔥 CRITICAL: Fetch assignment progress for ALL students upfront
      // This ensures we catch students who have assignment activity but no vocabulary gems
      console.log('📋 [CRITICAL] Fetching assignment progress for', studentIds.length, 'students');
      const { data: allAssignmentProgress } = await this.supabase
        .from('enhanced_assignment_progress')
        .select('student_id, completed_at, last_attempt_at, created_at')
        .in('student_id', studentIds);

      const assignmentProgressByStudent = new Map<string, typeof allAssignmentProgress>();
      (allAssignmentProgress || []).forEach(assignment => {
        if (!assignmentProgressByStudent.has(assignment.student_id)) {
          assignmentProgressByStudent.set(assignment.student_id, []);
        }
        assignmentProgressByStudent.get(assignment.student_id)!.push(assignment);
      });

      // FALLBACK: Get last activity from game sessions for students with no vocabulary collection
      // This fixes the "Last active: never" issue when students play games but don't have vocab items
      const studentsWithoutVocab = studentIds.filter(id => !gemsByStudent.has(id) || gemsByStudent.get(id)!.length === 0);
      let gameSessionsByStudent = new Map<string, string>(); // student_id -> last_game_session_date

      if (studentsWithoutVocab.length > 0) {
        console.log('🔍 [FALLBACK] Checking game sessions for', studentsWithoutVocab.length, 'students without vocabulary data');
        const { data: gameSessions } = await this.supabase
          .from('enhanced_game_sessions')
          .select('student_id, created_at')
          .in('student_id', studentsWithoutVocab)
          .order('created_at', { ascending: false });

        (gameSessions || []).forEach(session => {
          if (!gameSessionsByStudent.has(session.student_id)) {
            gameSessionsByStudent.set(session.student_id, session.created_at);
          }
        });
      }

      const now = new Date();

      // Process each student's data
      for (const student of students) {
        const gems = gemsByStudent.get(student.id) || [];
        const assignmentVocab = assignmentVocabByStudent.get(student.id) || [];

        // 🔥 CRITICAL: Merge data from BOTH sources
        // Total words = unique words from gems + unique assignment vocab
        const uniqueVocabIds = new Set([
          ...gems.map(g => g.vocabulary_item_id || g.centralized_vocabulary_id || ''),
          ...assignmentVocab.map(v => v.vocab_id || v.vocabulary_id || '')
        ].filter(Boolean));

        const totalWords = uniqueVocabIds.size;

        const masteredWords = gems.filter(g => g.mastery_level >= 4).length;
        const strugglingWords = gems.filter(g => {
          const accuracy = g.total_encounters > 0 ? g.correct_encounters / g.total_encounters : 0;
          return accuracy < 0.7 && g.total_encounters > 0;
        }).length;

        const overdueWords = gems.filter(g =>
          g.next_review_at && new Date(g.next_review_at) < now
        ).length;

        // 🔥 CRITICAL: Calculate accuracy from BOTH sources
        let totalEncounters = gems.reduce((sum, g) => sum + g.total_encounters, 0);
        let totalCorrect = gems.reduce((sum, g) => sum + g.correct_encounters, 0);

        // Add assignment vocabulary to totals
        totalEncounters += assignmentVocab.reduce((sum, v) => sum + (v.seen_count || 0), 0);
        totalCorrect += assignmentVocab.reduce((sum, v) => sum + (v.correct_count || 0), 0);

        const averageAccuracy = totalEncounters > 0 ? (totalCorrect / totalEncounters) * 100 : 0;

        const memoryStrength = gems.length > 0
          ? gems.reduce((sum, g) => sum + (g.fsrs_retrievability || 0), 0) / gems.length * 100
          : 0;

        const wordsReadyForReview = gems.filter(g => {
          if (!g.next_review_at) return false;
          const reviewDate = new Date(g.next_review_at);
          const today = new Date();
          today.setHours(23, 59, 59, 999);
          return reviewDate <= today;
        }).length;

        // 🔥 CRITICAL: Get last activity from BOTH gem collection AND assignment vocabulary
        let lastActivity: string | null = null;

        if (gems.length > 0) {
          lastActivity = gems.reduce((latest, g) => {
            const gDate = g.last_encountered_at ? new Date(g.last_encountered_at) : null;
            if (!gDate) return latest;
            return !latest || gDate > new Date(latest) ? g.last_encountered_at : latest;
          }, null as string | null);
        }

        // Check assignment vocabulary for more recent activity
        if (assignmentVocab.length > 0) {
          const assignmentLastActivity = assignmentVocab.reduce((latest, v) => {
            const vDate = v.last_seen_at ? new Date(v.last_seen_at) : null;
            if (!vDate) return latest;
            return !latest || vDate > new Date(latest) ? v.last_seen_at : latest;
          }, null as string | null);

          if (assignmentLastActivity) {
            if (!lastActivity || new Date(assignmentLastActivity) > new Date(lastActivity)) {
              lastActivity = assignmentLastActivity;
            }
          }
        }

        // Fallback to game sessions and assignment progress
        if (!lastActivity) {
          lastActivity = gameSessionsByStudent.get(student.id) || this.getLatestAssignmentDate(assignmentProgressByStudent.get(student.id)) || null;
        }

        // Data validation: catch impossible combinations
        if (totalWords === 0 && (averageAccuracy > 0 || overdueWords > 0 || strugglingWords > 0)) {
          console.warn('⚠️ [DATA ANOMALY]', {
            student: student.name,
            totalWords: 0,
            averageAccuracy,
            overdueWords,
            strugglingWords,
            gemsCount: gems.length,
            assignmentVocabCount: assignmentVocab.length,
            uniqueVocabIds: uniqueVocabIds.size
          });
        }

        progress.push({
          studentId: student.id,
          studentName: student.name,
          totalWords,
          proficientWords: masteredWords,
          learningWords: Math.max(0, totalWords - masteredWords - strugglingWords),
          strugglingWords,
          overdueWords,
          averageAccuracy: Math.round(averageAccuracy * 10) / 10,
          memoryStrength: Math.round(memoryStrength * 10) / 10,
          wordsReadyForReview,
          lastActivity,
          classId: student.classId,
          className: student.className
        });
      }

      console.log('✅ [OPTIMIZATION] Processed', progress.length, 'students successfully');
      return progress;

    } catch (error) {
      console.error('❌ Error processing student vocabulary progress:', error);
      return [];
    }
  }

  /**
   * Get the latest activity date from assignment progress
   * 🔥 CRITICAL: Used to identify students with assignment activity but no vocabulary gems
   */
  private getLatestAssignmentDate(
    assignments: Array<{ completed_at: string | null; last_attempt_at: string | null; created_at: string }> | undefined
  ): string | null {
    if (!assignments || assignments.length === 0) return null;

    const dates = assignments
      .map(a => a.completed_at || a.last_attempt_at || a.created_at)
      .filter(Boolean) as string[];

    if (dates.length === 0) return null;

    return dates.reduce((latest, date) => {
      const latestDate = new Date(latest);
      const currentDate = new Date(date);
      return currentDate > latestDate ? date : latest;
    });
  }

  /**
   * Get empty analytics structure
   */
  private getEmptyAnalytics(): TeacherVocabularyAnalytics {
    return {
      classStats: {
        totalStudents: 0,
        totalWords: 0,
        averageMasteredWords: 0,
        averageAccuracy: 0,
        studentsWithOverdueWords: 0,
        topPerformingStudents: [],
        strugglingStudents: [],
        classAverageMemoryStrength: 0,
        totalWordsReadyForReview: 0
      },
      studentProgress: [],
      topicAnalysis: [],
      trends: [],
      insights: {
        weakestTopics: [],
        strongestTopics: [],
        studentsNeedingAttention: [],
        classRecommendations: []
      }
    };
  }

  /**
   * Helper to chunk array into batches
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Calculate class-wide statistics
   */
  private calculateClassStats(studentProgress: StudentVocabularyProgress[], detailedWordsCount?: number): ClassVocabularyStats {
    if (studentProgress.length === 0) {
      return {
        totalStudents: 0,
        totalWords: 0,
        proficientWords: 0,
        learningWords: 0,
        strugglingWords: 0,
        averageAccuracy: 0,
        studentsWithOverdueWords: 0,
        topPerformingStudents: [],
        strugglingStudents: [],
        totalWordsReadyForReview: 0
      };
    }

    const totalStudents = studentProgress.length;

    // Only include students with vocabulary data for accuracy calculations
    const studentsWithVocab = studentProgress.filter(s => s.totalWords > 0);
    const studentsWithVocabCount = studentsWithVocab.length;

    const totalWords = studentProgress.reduce((sum, s) => sum + s.totalWords, 0);

    // Calculate proficient/learning/struggling words from student data
    const proficientWords = studentProgress.reduce((sum, s) => sum + s.proficientWords, 0);
    const strugglingWordsTotal = studentProgress.reduce((sum, s) => sum + s.strugglingWords, 0);
    // Learning words = total words - (proficient + struggling)
    const learningWords = Math.max(0, totalWords - proficientWords - strugglingWordsTotal);

    // Only average accuracy for students who have vocabulary data
    const averageAccuracy = studentsWithVocabCount > 0
      ? Math.round((studentsWithVocab.reduce((sum, s) => sum + s.averageAccuracy, 0) / studentsWithVocabCount) * 10) / 10
      : 0;

    const studentsWithOverdueWords = studentProgress.filter(s => s.overdueWords > 0).length;

    const totalWordsReadyForReview = studentProgress.reduce((sum, s) => sum + s.wordsReadyForReview, 0);

    // Sort students by performance
    const sortedByPerformance = [...studentProgress].sort((a, b) => {
      const scoreA = (a.averageAccuracy * 0.4) + (a.proficientWords * 0.3) + (a.memoryStrength * 0.3);
      const scoreB = (b.averageAccuracy * 0.4) + (b.proficientWords * 0.3) + (b.memoryStrength * 0.3);
      return scoreB - scoreA;
    });

    const topPerformingStudents = sortedByPerformance.slice(0, 5);
    const strugglingStudents = sortedByPerformance.slice(-5).reverse();

    console.log('📊 [CLASS STATS CALCULATED]', {
      totalStudents,
      totalWords,
      proficientWords,
      learningWords,
      strugglingWords: strugglingWordsTotal,
      averageAccuracy,
      studentsWithVocab: studentsWithVocabCount
    });

    return {
      totalStudents,
      totalWords,
      proficientWords,
      learningWords,
      strugglingWords: strugglingWordsTotal,
      averageAccuracy,
      studentsWithOverdueWords,
      topPerformingStudents,
      strugglingStudents,
      totalWordsReadyForReview
    };
  }

  /**
   * Helper to add delay between batches
   */
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get topic analysis across all students
   */
  private async getTopicAnalysis(studentIds: string[]): Promise<TopicAnalysis[]> {
    if (studentIds.length === 0) return [];

    try {
      // Get vocabulary gem collection data with vocabulary details
      // BATCHED FETCHING
      const gemData: any[] = [];
      const batchSize = 5;
      const batches = this.chunkArray(studentIds, batchSize);

      for (const batch of batches) {
        // Add small delay to prevent rate limiting/connection issues
        await this.delay(20);

        const { data, error } = await this.supabase
          .from('vocabulary_gem_collection')
          .select(`
            student_id,
            centralized_vocabulary_id,
            vocabulary_item_id,
            total_encounters,
            correct_encounters,
            mastery_level
          `)
          .in('student_id', batch);

        if (error) {
          console.error('Error fetching batch topic data', error);
          continue;
        }
        if (data) gemData.push(...data);
      }

      console.log('🔍 [TOPIC ANALYSIS] Gem data fetched:', gemData.length, 'records for', studentIds.length, 'students');

      // Get centralized vocabulary details - use both ID fields
      const centralizedIds = [...new Set(
        (gemData || [])
          .map(g => g.centralized_vocabulary_id || g.vocabulary_item_id)
          .filter(Boolean)
      )];

      let vocabularyDetails: Array<{
        id: string;
        word: string;
        translation: string;
        category: string | null;
        subcategory: string | null;
        curriculum_level: string | null;
        language: string;
        theme_name: string | null;
        unit_name: string | null;
      }> = [];

      if (centralizedIds.length > 0) {
        console.log('🔍 [TOPIC ANALYSIS] Looking up', centralizedIds.length, 'unique vocabulary IDs');

        // BATCH the vocabulary lookup to avoid overwhelming the database with 1000+ IDs
        const vocabBatchSize = 100;
        const vocabBatches = this.chunkArray(centralizedIds, vocabBatchSize);

        for (const batch of vocabBatches) {
          const { data: vocabData, error: vocabError } = await this.supabase
            .from('centralized_vocabulary')
            .select('id, word, translation, category, subcategory, curriculum_level, language, theme_name, unit_name')
            .in('id', batch);

          if (vocabError) {
            console.error('Error fetching vocabulary batch for topics:', vocabError);
            continue;
          }
          if (vocabData) vocabularyDetails.push(...vocabData);
        }

        console.log('🔍 [TOPIC ANALYSIS] Vocabulary details fetched:', vocabularyDetails.length, 'items');
      }

      // Create vocabulary lookup map
      const vocabMap = new Map(vocabularyDetails.map(v => [v.id, v]));

      // Group by topic (category + subcategory + theme + language + curriculum_level)
      const topicGroups = new Map<string, {
        category: string;
        subcategory: string | null;
        theme: string | null;
        language: string;
        curriculumLevel: string;
        studentData: Map<string, { totalWords: number; masteredWords: number; totalEncounters: number; correctEncounters: number }>;
      }>();

      (gemData || []).forEach(gem => {
        const vocabId = gem.centralized_vocabulary_id || gem.vocabulary_item_id;
        const vocab = vocabMap.get(vocabId);
        if (!vocab) return;

        // Skip vocabulary items without required category or curriculum level
        if (!vocab.category || !vocab.curriculum_level) {
          return;
        }

        const topicKey = `${vocab.category}_${vocab.subcategory || 'none'}_${vocab.theme_name || 'none'}_${vocab.language}_${vocab.curriculum_level}`;

        if (!topicGroups.has(topicKey)) {
          topicGroups.set(topicKey, {
            category: vocab.category,
            subcategory: vocab.subcategory,
            theme: vocab.theme_name,
            language: vocab.language,
            curriculumLevel: vocab.curriculum_level,
            studentData: new Map()
          });
        }

        const topic = topicGroups.get(topicKey)!;
        if (!topic.studentData.has(gem.student_id)) {
          topic.studentData.set(gem.student_id, {
            totalWords: 0,
            masteredWords: 0,
            totalEncounters: 0,
            correctEncounters: 0
          });
        }

        const studentData = topic.studentData.get(gem.student_id)!;
        studentData.totalWords++;
        if (gem.mastery_level >= 4) studentData.masteredWords++;
        studentData.totalEncounters += gem.total_encounters;
        studentData.correctEncounters += gem.correct_encounters;
      });

      // Convert to TopicAnalysis array
      const topicAnalysis: TopicAnalysis[] = [];

      topicGroups.forEach((topic, key) => {
        const studentsEngaged = topic.studentData.size;
        const totalWords = Array.from(topic.studentData.values()).reduce((sum, s) => sum + s.totalWords, 0);
        const masteredWords = Array.from(topic.studentData.values()).reduce((sum, s) => sum + s.masteredWords, 0);
        const strugglingWords = totalWords - masteredWords;

        const totalEncounters = Array.from(topic.studentData.values()).reduce((sum, s) => sum + s.totalEncounters, 0);
        const correctEncounters = Array.from(topic.studentData.values()).reduce((sum, s) => sum + s.correctEncounters, 0);
        const averageAccuracy = totalEncounters > 0 ? (correctEncounters / totalEncounters) * 100 : 0;

        const isWeakTopic = averageAccuracy < 60;
        const isStrongTopic = averageAccuracy >= 80;

        let recommendedAction = 'Continue current approach';
        if (isWeakTopic) {
          recommendedAction = 'Focus on additional practice and review';
        } else if (isStrongTopic) {
          recommendedAction = 'Consider advancing to more challenging content';
        }

        topicAnalysis.push({
          category: topic.category,
          subcategory: topic.subcategory,
          theme: topic.theme,
          language: topic.language,
          curriculumLevel: topic.curriculumLevel,
          totalStudents: studentIds.length,
          studentsEngaged,
          averageAccuracy: Math.round(averageAccuracy * 10) / 10,
          totalWords,
          masteredWords,
          strugglingWords,
          isWeakTopic,
          isStrongTopic,
          recommendedAction
        });
      });

      return topicAnalysis.sort((a, b) => b.studentsEngaged - a.studentsEngaged);

    } catch (error) {
      console.error('Error getting topic analysis:', error);
      return [];
    }
  }

  /**
   * Get vocabulary trends over time
   */
  private async getVocabularyTrends(
    studentIds: string[],
    dateRange?: { from: string; to: string }
  ): Promise<VocabularyTrend[]> {
    if (studentIds.length === 0) return [];

    try {
      // Use provided date range or default to 30 days
      const startDate = dateRange?.from
        ? new Date(dateRange.from)
        : (() => {
          const date = new Date();
          date.setDate(date.getDate() - 30);
          return date;
        })();

      // BATCHED FETCHING for session data
      const sessionData: any[] = [];
      const batchSize = 5;
      const batches = this.chunkArray(studentIds, batchSize);

      for (const batch of batches) {
        await this.delay(20);

        const { data, error } = await this.supabase
          .from('enhanced_game_sessions')
          .select('student_id, created_at')
          .in('student_id', batch)
          .gte('created_at', startDate.toISOString());

        if (error) {
          console.error('Error fetching batch session data for trends', error);
          continue;
        }
        if (data) sessionData.push(...data);
      }

      // Get vocabulary data with last_encountered_at for accuracy trends
      const vocabData: any[] = [];
      // Batches already defined above
      for (const batch of batches) {
        const { data, error } = await this.supabase
          .from('vocabulary_gem_collection')
          .select('student_id, last_encountered_at, total_encounters, correct_encounters, mastery_level')
          .in('student_id', batch)
          .gte('last_encountered_at', startDate.toISOString());

        if (error) {
          console.error('Error fetching batch vocabulary trends', error);
          continue;
        }
        if (data) vocabData.push(...data);
      }

      // Group by date with proficiency tracking
      const trendsByDate = new Map<string, {
        activeStudents: Set<string>;
        totalEncounters: number;
        correctEncounters: number;
        proficientWords: Set<string>;
        learningWords: Set<string>;
        strugglingWords: Set<string>;
      }>();

      // Process game sessions for active students
      (sessionData || []).forEach(session => {
        const date = session.created_at.split('T')[0];
        if (!trendsByDate.has(date)) {
          trendsByDate.set(date, {
            activeStudents: new Set(),
            totalEncounters: 0,
            correctEncounters: 0,
            proficientWords: new Set(),
            learningWords: new Set(),
            strugglingWords: new Set()
          });
        }
        trendsByDate.get(date)!.activeStudents.add(session.student_id);
      });

      // Process vocabulary data for accuracy and proficiency
      (vocabData || []).forEach(vocab => {
        const date = vocab.last_encountered_at.split('T')[0];
        if (!trendsByDate.has(date)) {
          trendsByDate.set(date, {
            activeStudents: new Set(),
            totalEncounters: 0,
            correctEncounters: 0,
            proficientWords: new Set(),
            learningWords: new Set(),
            strugglingWords: new Set()
          });
        }
        const trend = trendsByDate.get(date)!;
        trend.totalEncounters += vocab.total_encounters;
        trend.correctEncounters += vocab.correct_encounters;

        // Calculate accuracy and categorize by proficiency level
        const accuracy = vocab.total_encounters > 0
          ? (vocab.correct_encounters / vocab.total_encounters) * 100
          : 0;
        const wordKey = `${vocab.student_id}-${date}`;

        if (accuracy >= 90 && vocab.total_encounters >= 5) {
          trend.proficientWords.add(wordKey);
        } else if (accuracy >= 60 && vocab.total_encounters >= 3) {
          trend.learningWords.add(wordKey);
        } else {
          trend.strugglingWords.add(wordKey);
        }
      });

      // Convert to array and fill in missing dates
      const trends: VocabularyTrend[] = [];
      const today = new Date();

      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayData = trendsByDate.get(dateStr);

        trends.push({
          date: dateStr,
          totalWords: 0,
          proficientWords: dayData ? dayData.proficientWords.size : 0,
          learningWords: dayData ? dayData.learningWords.size : 0,
          strugglingWords: dayData ? dayData.strugglingWords.size : 0,
          averageAccuracy: dayData && dayData.totalEncounters > 0
            ? Math.round((dayData.correctEncounters / dayData.totalEncounters) * 100)
            : 0,
          activeStudents: dayData ? dayData.activeStudents.size : 0,
          wordsLearned: 0
        });
      }

      return trends;
    } catch (error) {
      console.error('Error getting vocabulary trends:', error);
      return [];
    }
  }

  /**
   * Generate insights and recommendations
   */
  private generateInsights(
    studentProgress: StudentVocabularyProgress[],
    topicAnalysis: TopicAnalysis[]
  ) {
    const weakestTopics = topicAnalysis
      .filter(t => t.isWeakTopic)
      .sort((a, b) => a.averageAccuracy - b.averageAccuracy)
      .slice(0, 5);

    const strongestTopics = topicAnalysis
      .filter(t => t.isStrongTopic)
      .sort((a, b) => b.averageAccuracy - a.averageAccuracy)
      .slice(0, 5);

    // Only include students who have actually attempted vocabulary (totalWords > 0)
    // This filters out students who have never logged in
    const studentsNeedingAttention = studentProgress
      .filter(s => s.totalWords > 0 && (s.averageAccuracy < 60 || s.overdueWords > 10))
      .sort((a, b) => a.averageAccuracy - b.averageAccuracy)
      .slice(0, 10);

    const classRecommendations: string[] = [];

    if (weakestTopics.length > 0) {
      classRecommendations.push(`Focus on ${weakestTopics[0].category} - class average accuracy is ${weakestTopics[0].averageAccuracy}%`);
    }

    if (studentsNeedingAttention.length > 0) {
      classRecommendations.push(`${studentsNeedingAttention.length} students need additional support`);
    }

    const avgOverdueWords = studentProgress.reduce((sum, s) => sum + s.overdueWords, 0) / studentProgress.length;
    if (avgOverdueWords > 5) {
      classRecommendations.push('Schedule review sessions - many students have overdue vocabulary');
    }

    return {
      weakestTopics,
      strongestTopics,
      studentsNeedingAttention,
      classRecommendations
    };
  }

  /**
   * Get detailed word-level analytics for the class
   */
  async getDetailedWordAnalytics(studentIds: string[]): Promise<WordDetail[]> {
    if (studentIds.length === 0) return [];

    try {
      // BATCHED FETCHING
      const gemData: any[] = [];
      const batchSize = 5;
      const batches = this.chunkArray(studentIds, batchSize);

      for (const batch of batches) {
        await this.delay(20);

        const { data, error } = await this.supabase
          .from('vocabulary_gem_collection')
          .select(`
            centralized_vocabulary_id,
            vocabulary_item_id,
            total_encounters,
            correct_encounters,
            mastery_level,
            student_id
          `)
          .in('student_id', batch);

        if (error) {
          console.error('Error fetching batch detailed words', error);
          continue;
        }
        if (data) gemData.push(...data);
      }

      console.log('🔍 [DETAILED WORDS] Gem data fetched:', gemData.length, 'records for', studentIds.length, 'students');

      // Get vocabulary details - use both ID fields
      const centralizedIds = [...new Set(
        (gemData || [])
          .map(g => g.centralized_vocabulary_id || g.vocabulary_item_id)
          .filter(Boolean)
      )];

      if (centralizedIds.length === 0) return [];

      console.log('🔍 [DETAILED WORDS] Looking up', centralizedIds.length, 'unique vocabulary IDs');

      // BATCH the vocabulary lookup to avoid overwhelming the database with 1000+ IDs
      const vocabData: any[] = [];
      const vocabBatchSize = 100; // Fetch 100 vocabulary items at a time
      const vocabBatches = this.chunkArray(centralizedIds, vocabBatchSize);

      for (const batch of vocabBatches) {
        const { data, error: vocabError } = await this.supabase
          .from('centralized_vocabulary')
          .select('id, word, translation, category, subcategory, language')
          .in('id', batch);

        if (vocabError) {
          console.error('Error fetching vocabulary batch:', vocabError);
          continue;
        }
        if (data) vocabData.push(...data);
      }

      console.log('🔍 [DETAILED WORDS] Vocabulary details fetched:', vocabData.length, 'items');

      const vocabMap = new Map((vocabData || []).map(v => [v.id, v]));

      // Group by word and calculate stats
      const wordGroups = new Map<string, {
        vocab: any;
        totalEncounters: number;
        correctEncounters: number;
        masteryLevels: number[];
        studentData: Map<string, { encounters: number; correct: number; mastery: number }>;
      }>();

      (gemData || []).forEach(gem => {
        const vocabId = gem.centralized_vocabulary_id || gem.vocabulary_item_id;
        const vocab = vocabMap.get(vocabId);
        if (!vocab) return;

        const key = vocabId;
        if (!wordGroups.has(key)) {
          wordGroups.set(key, {
            vocab,
            totalEncounters: 0,
            correctEncounters: 0,
            masteryLevels: [],
            studentData: new Map()
          });
        }

        const group = wordGroups.get(key)!;
        group.totalEncounters += gem.total_encounters;
        group.correctEncounters += gem.correct_encounters;
        group.masteryLevels.push(gem.mastery_level);
        group.studentData.set(gem.student_id, {
          encounters: gem.total_encounters,
          correct: gem.correct_encounters,
          mastery: gem.mastery_level
        });
      });

      const wordDetails: WordDetail[] = [];

      wordGroups.forEach((group, key) => {
        const accuracy = group.totalEncounters > 0
          ? (group.correctEncounters / group.totalEncounters) * 100
          : 0;

        // Calculate proficiency level for the word (class-wide)
        const proficiencyLevel = calculateProficiencyLevel(accuracy, group.totalEncounters);

        // Count students by proficiency level
        let studentsStruggling = 0;
        let studentsLearning = 0;
        let studentsProficient = 0;

        Array.from(group.studentData.values()).forEach(s => {
          const studentAccuracy = s.encounters > 0 ? (s.correct / s.encounters) * 100 : 0;
          const studentProficiency = calculateProficiencyLevel(studentAccuracy, s.encounters);

          if (studentProficiency === 'struggling') studentsStruggling++;
          else if (studentProficiency === 'learning') studentsLearning++;
          else if (studentProficiency === 'proficient') studentsProficient++;
        });

        // Calculate average mastery level
        const masteryLevel = group.masteryLevels.length > 0
          ? Math.round((group.masteryLevels.reduce((sum: number, level: number) => sum + level, 0) / group.masteryLevels.length) * 10) / 10
          : 0;

        wordDetails.push({
          word: group.vocab.word,
          translation: group.vocab.translation,
          category: group.vocab.category,
          subcategory: group.vocab.subcategory,
          language: group.vocab.language,
          totalEncounters: group.totalEncounters,
          correctEncounters: group.correctEncounters,
          accuracy: Math.round(accuracy * 10) / 10,
          masteryLevel,
          proficiencyLevel,  // NEW: Simple 3-tier system
          studentsStruggling,
          studentsLearning,   // NEW
          studentsProficient, // Replaces studentsMastered
          commonErrors: [], // Could be enhanced with error tracking
          strugglingCount: studentsStruggling,
          mistakeCount: group.totalEncounters - group.correctEncounters
        });
      });

      return wordDetails.sort((a, b) => a.accuracy - b.accuracy);

    } catch (error) {
      console.error('Error getting detailed word analytics:', error);
      return [];
    }
  }

  /**
   * Get detailed word analytics for each student
   */
  async getStudentWordDetails(
    students: Array<{ id: string; name: string }>
  ): Promise<StudentWordDetail[]> {
    const studentWordDetails: StudentWordDetail[] = [];

    try {
      // Fetch all vocabulary data for all students in one query (BATCHED)
      const studentIds = students.map(s => s.id);
      const gemData: any[] = [];
      const batchSize = 5;
      const batches = this.chunkArray(studentIds, batchSize);

      for (const batch of batches) {
        await this.delay(20);

        const { data, error } = await this.supabase
          .from('vocabulary_gem_collection')
          .select(`
            student_id,
            centralized_vocabulary_id,
            vocabulary_item_id,
            total_encounters,
            correct_encounters,
            mastery_level
          `)
          .in('student_id', batch);

        if (error) {
          console.error('Error fetching batch student word details', error);
          continue;
        }
        if (data) gemData.push(...data);
      }

      // Get vocabulary details - use both ID fields
      const centralizedIds = [...new Set(
        (gemData || [])
          .map(g => g.centralized_vocabulary_id || g.vocabulary_item_id)
          .filter(Boolean)
      )];

      if (centralizedIds.length === 0) {
        return students.map(s => ({
          studentId: s.id,
          studentName: s.name,
          strongWords: [],
          weakWords: [],
          recentProgress: []
        }));
      }

      // BATCH the vocabulary lookup to avoid overwhelming the database with 1000+ IDs
      const vocabData: any[] = [];
      const vocabBatchSize = 100;
      const vocabBatches = this.chunkArray(centralizedIds, vocabBatchSize);

      for (const batch of vocabBatches) {
        const { data, error: vocabError } = await this.supabase
          .from('centralized_vocabulary')
          .select('id, word, translation, category')
          .in('id', batch);

        if (vocabError) {
          console.error('Error fetching vocabulary batch for student details:', vocabError);
          continue;
        }
        if (data) vocabData.push(...data);
      }

      const vocabMap = new Map((vocabData || []).map(v => [v.id, v]));

      // Group by student
      const gemsByStudent = new Map<string, typeof gemData>();
      (gemData || []).forEach(gem => {
        if (!gemsByStudent.has(gem.student_id)) {
          gemsByStudent.set(gem.student_id, []);
        }
        gemsByStudent.get(gem.student_id)!.push(gem);
      });

      // Process each student
      for (const student of students) {
        const gems = gemsByStudent.get(student.id) || [];

        // Calculate strong words (high mastery, high accuracy)
        const strongWords = gems
          .filter(g => {
            const vocabId = g.centralized_vocabulary_id || g.vocabulary_item_id;
            const vocab = vocabMap.get(vocabId);
            if (!vocab) return false;
            const accuracy = g.total_encounters > 0 ? g.correct_encounters / g.total_encounters : 0;
            return g.mastery_level >= 4 || (accuracy >= 0.9 && g.total_encounters >= 3);
          })
          .sort((a, b) => b.mastery_level - a.mastery_level)
          .slice(0, 10)
          .map(g => {
            const vocabId = g.centralized_vocabulary_id || g.vocabulary_item_id;
            const vocab = vocabMap.get(vocabId);
            const accuracy = g.total_encounters > 0 ? (g.correct_encounters / g.total_encounters) * 100 : 0;
            const proficiencyLevel = calculateProficiencyLevel(accuracy, g.total_encounters);
            return {
              word: vocab?.word || '',
              translation: vocab?.translation || '',
              accuracy: Math.round(accuracy * 10) / 10,
              proficiencyLevel,
              category: vocab?.category || ''
            };
          });

        // Calculate weak words (low accuracy, multiple attempts)
        const weakWords = gems
          .filter(g => {
            const vocabId = g.centralized_vocabulary_id || g.vocabulary_item_id;
            const vocab = vocabMap.get(vocabId);
            if (!vocab) return false;
            const accuracy = g.total_encounters > 0 ? g.correct_encounters / g.total_encounters : 0;
            return accuracy < 0.6 && g.total_encounters >= 2;
          })
          .sort((a, b) => {
            const accA = a.total_encounters > 0 ? a.correct_encounters / a.total_encounters : 0;
            const accB = b.total_encounters > 0 ? b.correct_encounters / b.total_encounters : 0;
            return accA - accB;
          })
          .slice(0, 10)
          .map(g => {
            const vocabId = g.centralized_vocabulary_id || g.vocabulary_item_id;
            const vocab = vocabMap.get(vocabId);
            const accuracy = g.total_encounters > 0 ? (g.correct_encounters / g.total_encounters) * 100 : 0;
            return {
              word: vocab?.word || '',
              translation: vocab?.translation || '',
              accuracy: Math.round(accuracy * 10) / 10,
              totalEncounters: g.total_encounters,
              category: vocab?.category || '',
              errorPattern: accuracy < 0.3 ? 'Frequent mistakes' : accuracy < 0.5 ? 'Moderate difficulty' : 'Needs more practice'
            };
          });

        studentWordDetails.push({
          studentId: student.id,
          studentName: student.name,
          strongWords,
          weakWords,
          recentProgress: [] // Could be enhanced with historical data
        });
      }

      return studentWordDetails;

    } catch (error) {
      console.error('Error getting student word details:', error);
      return students.map(s => ({
        studentId: s.id,
        studentName: s.name,
        strongWords: [],
        weakWords: [],
        recentProgress: []
      }));
    }
  }
}

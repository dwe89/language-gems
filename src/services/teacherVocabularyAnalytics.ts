import { SupabaseClient } from '@supabase/supabase-js';

export interface StudentVocabularyProgress {
  studentId: string;
  studentName: string;
  totalWords: number;
  masteredWords: number;
  strugglingWords: number;
  overdueWords: number;
  averageAccuracy: number;
  memoryStrength: number;
  wordsReadyForReview: number;
  lastActivity: string | null;
  classId: string;
  className: string;
}

export interface ClassVocabularyStats {
  totalStudents: number;
  totalWords: number;
  averageMasteredWords: number;
  averageAccuracy: number;
  studentsWithOverdueWords: number;
  topPerformingStudents: StudentVocabularyProgress[];
  strugglingStudents: StudentVocabularyProgress[];
  classAverageMemoryStrength: number;
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
  masteredWords: number;
  strugglingWords: number;
  isWeakTopic: boolean;
  isStrongTopic: boolean;
  recommendedAction: string;
}

export interface VocabularyTrend {
  date: string;
  totalWords: number;
  masteredWords: number;
  averageAccuracy: number;
  activeStudents: number;
  wordsLearned: number;
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
}

export class TeacherVocabularyAnalyticsService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get comprehensive vocabulary analytics for all classes taught by a teacher
   */
  async getTeacherVocabularyAnalytics(
    teacherId: string,
    classId?: string,
    dateRange?: { from: string; to: string }
  ): Promise<TeacherVocabularyAnalytics> {
    console.log('🔍 [TEACHER VOCAB ANALYTICS] Getting analytics for teacher:', teacherId);

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

      // Get vocabulary progress for all students
      const studentProgress = await this.getStudentVocabularyProgress(students, classes);
      
      // Get topic analysis across all students
      const topicAnalysis = await this.getTopicAnalysis(students.map(s => s.id));
      
      // Get trends data
      const trends = await this.getVocabularyTrends(students.map(s => s.id), dateRange);
      
      // Calculate class stats
      const classStats = this.calculateClassStats(studentProgress);
      
      // Generate insights
      const insights = this.generateInsights(studentProgress, topicAnalysis);

      return {
        classStats,
        studentProgress,
        topicAnalysis,
        trends,
        insights
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
      return {
        id: item.student_id,
        name: profile?.display_name || profile?.email || 'Unknown Student',
        classId: item.class_id,
        className: item.classes.name
      };
    });
  }

  /**
   * Get vocabulary progress for all students
   */
  private async getStudentVocabularyProgress(
    students: Array<{ id: string; name: string; classId: string; className: string }>,
    classes: Array<{ id: string; name: string }>
  ): Promise<StudentVocabularyProgress[]> {
    const progress: StudentVocabularyProgress[] = [];

    for (const student of students) {
      try {
        // Get vocabulary gem collection data for this student
        const { data: gemData, error } = await this.supabase
          .from('vocabulary_gem_collection')
          .select(`
            total_encounters,
            correct_encounters,
            mastery_level,
            last_encountered_at,
            next_review_at,
            fsrs_retrievability
          `)
          .eq('student_id', student.id);

        if (error) {
          console.error(`Error getting data for student ${student.id}:`, error);
          continue;
        }

        const gems = gemData || [];
        const totalWords = gems.length;
        const masteredWords = gems.filter(g => g.mastery_level >= 4).length;
        const strugglingWords = gems.filter(g => {
          const accuracy = g.total_encounters > 0 ? g.correct_encounters / g.total_encounters : 0;
          return accuracy < 0.7 && g.total_encounters > 0;
        }).length;

        const now = new Date();
        const overdueWords = gems.filter(g => 
          g.next_review_at && new Date(g.next_review_at) < now
        ).length;

        const totalEncounters = gems.reduce((sum, g) => sum + g.total_encounters, 0);
        const totalCorrect = gems.reduce((sum, g) => sum + g.correct_encounters, 0);
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

        const lastActivity = gems.length > 0 
          ? gems.reduce((latest, g) => {
              const gDate = g.last_encountered_at ? new Date(g.last_encountered_at) : null;
              if (!gDate) return latest;
              return !latest || gDate > new Date(latest) ? g.last_encountered_at : latest;
            }, null as string | null)
          : null;

        progress.push({
          studentId: student.id,
          studentName: student.name,
          totalWords,
          masteredWords,
          strugglingWords,
          overdueWords,
          averageAccuracy: Math.round(averageAccuracy * 10) / 10,
          memoryStrength: Math.round(memoryStrength * 10) / 10,
          wordsReadyForReview,
          lastActivity,
          classId: student.classId,
          className: student.className
        });

      } catch (error) {
        console.error(`Error processing student ${student.id}:`, error);
      }
    }

    return progress;
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
   * Calculate class-wide statistics
   */
  private calculateClassStats(studentProgress: StudentVocabularyProgress[]): ClassVocabularyStats {
    if (studentProgress.length === 0) {
      return {
        totalStudents: 0,
        totalWords: 0,
        averageMasteredWords: 0,
        averageAccuracy: 0,
        studentsWithOverdueWords: 0,
        topPerformingStudents: [],
        strugglingStudents: [],
        classAverageMemoryStrength: 0,
        totalWordsReadyForReview: 0
      };
    }

    const totalStudents = studentProgress.length;
    const totalWords = studentProgress.reduce((sum, s) => sum + s.totalWords, 0);
    const averageMasteredWords = Math.round(
      studentProgress.reduce((sum, s) => sum + s.masteredWords, 0) / totalStudents
    );
    const averageAccuracy = Math.round(
      (studentProgress.reduce((sum, s) => sum + s.averageAccuracy, 0) / totalStudents) * 10
    ) / 10;
    const studentsWithOverdueWords = studentProgress.filter(s => s.overdueWords > 0).length;
    const classAverageMemoryStrength = Math.round(
      (studentProgress.reduce((sum, s) => sum + s.memoryStrength, 0) / totalStudents) * 10
    ) / 10;
    const totalWordsReadyForReview = studentProgress.reduce((sum, s) => sum + s.wordsReadyForReview, 0);

    // Sort students by performance
    const sortedByPerformance = [...studentProgress].sort((a, b) => {
      const scoreA = (a.averageAccuracy * 0.4) + (a.masteredWords * 0.3) + (a.memoryStrength * 0.3);
      const scoreB = (b.averageAccuracy * 0.4) + (b.masteredWords * 0.3) + (b.memoryStrength * 0.3);
      return scoreB - scoreA;
    });

    const topPerformingStudents = sortedByPerformance.slice(0, 5);
    const strugglingStudents = sortedByPerformance.slice(-5).reverse();

    return {
      totalStudents,
      totalWords,
      averageMasteredWords,
      averageAccuracy,
      studentsWithOverdueWords,
      topPerformingStudents,
      strugglingStudents,
      classAverageMemoryStrength,
      totalWordsReadyForReview
    };
  }

  /**
   * Get topic analysis across all students
   */
  private async getTopicAnalysis(studentIds: string[]): Promise<TopicAnalysis[]> {
    if (studentIds.length === 0) return [];

    try {
      // Get vocabulary gem collection data with vocabulary details
      const { data: gemData, error } = await this.supabase
        .from('vocabulary_gem_collection')
        .select(`
          student_id,
          centralized_vocabulary_id,
          vocabulary_item_id,
          total_encounters,
          correct_encounters,
          mastery_level
        `)
        .in('student_id', studentIds);

      if (error) throw error;

      // Get centralized vocabulary details
      const centralizedIds = [...new Set(
        (gemData || [])
          .filter(g => g.centralized_vocabulary_id)
          .map(g => g.centralized_vocabulary_id)
      )];

      let vocabularyDetails = [];
      if (centralizedIds.length > 0) {
        const { data: vocabData, error: vocabError } = await this.supabase
          .from('centralized_vocabulary')
          .select('id, word, translation, category, subcategory, curriculum_level, language, theme_name, unit_name')
          .in('id', centralizedIds);

        if (vocabError) throw vocabError;
        vocabularyDetails = vocabData || [];
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
        const vocab = vocabMap.get(gem.centralized_vocabulary_id);
        if (!vocab) return;

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
      // For now, return mock trend data - in a real implementation,
      // you'd query historical data from game sessions or vocabulary tracking
      const trends: VocabularyTrend[] = [];
      const days = 30;
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        trends.push({
          date: date.toISOString().split('T')[0],
          totalWords: Math.floor(Math.random() * 100) + 50,
          masteredWords: Math.floor(Math.random() * 50) + 20,
          averageAccuracy: Math.floor(Math.random() * 30) + 60,
          activeStudents: Math.floor(Math.random() * studentIds.length) + 1,
          wordsLearned: Math.floor(Math.random() * 10) + 1
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

    const studentsNeedingAttention = studentProgress
      .filter(s => s.averageAccuracy < 60 || s.overdueWords > 10)
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
}

import { SupabaseClient } from '@supabase/supabase-js';

export interface TeacherGrammarAnalytics {
  classStats: {
    totalStudents: number;
    totalAttempts: number;
    averageAccuracy: number;
    totalTopicsTracked: number;
    totalTensesTracked?: number; // Backwards compatibility
    activeStudentsLast7Days: number;
  };
  topicPerformance: TopicPerformance[];
  tensePerformance?: TensePerformance[]; // Backwards compatibility
  studentProgress: StudentGrammarProgress[];
  insights: {
    studentsNeedingAttention: Array<{
      studentId: string;
      studentName: string;
      accuracy: number;
      attemptsCount: number;
      weakestTopic: string;
      weakestTense?: string; // Backwards compatibility
    }>;
    strongestTopics: string[];
    strongestTenses?: string[]; // Backwards compatibility
    weakestTopics: string[];
    weakestTenses?: string[]; // Backwards compatibility
    recentTrend: 'improving' | 'declining' | 'stable';
  };
}

export interface TopicPerformance {
  topicId: string;
  topicTitle: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  studentsAttempted: number;
  averageResponseTime: number;
}

// Keep tense for backwards compatibility
export interface TensePerformance {
  tense: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  studentsAttempted: number;
  averageResponseTime: number;
}

export interface StudentGrammarProgress {
  studentId: string;
  studentName: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  topicsMastered: number;
  topicsInProgress: number;
  tensesMastered: number; // Keep for backwards compatibility
  tensesInProgress: number; // Keep for backwards compatibility
  lastActive: Date | null;
  tenseBreakdown: Array<{
    tense: string;
    attempts: number;
    correct: number;
    accuracy: number;
  }>;
  topicBreakdown: Array<{
    topicId: string;
    topicTitle: string;
    attempts: number;
    correct: number;
    accuracy: number;
  }>;
}

export class TeacherGrammarAnalyticsService {
  constructor(private supabase: SupabaseClient) { }

  async getTeacherGrammarAnalytics(
    teacherId: string,
    classId?: string,
    dateRange?: { from: string; to: string }
  ): Promise<TeacherGrammarAnalytics> {
    try {
      // Get teacher's classes
      let classQuery = this.supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', teacherId);

      if (classId) {
        classQuery = classQuery.eq('id', classId);
      }

      const { data: classes, error: classError } = await classQuery;
      if (classError) throw classError;

      const classIds = classes?.map(c => c.id) || [];
      if (classIds.length === 0) {
        return this.getEmptyAnalytics();
      }

      // Get students in these classes
      const { data: enrollments, error: enrollError } = await this.supabase
        .from('class_enrollments')
        .select('student_id')
        .in('class_id', classIds)
        .eq('status', 'active');

      if (enrollError) throw enrollError;

      const studentIds = enrollments?.map(e => e.student_id) || [];
      if (studentIds.length === 0) {
        return this.getEmptyAnalytics();
      }

      // Get student profiles
      const { data: profiles, error: profileError } = await this.supabase
        .from('user_profiles')
        .select('user_id, display_name')
        .in('user_id', studentIds);

      if (profileError) throw profileError;

      const studentMap = new Map(
        (profiles || []).map(p => [p.user_id, p.display_name])
      );

      // Get grammar_assignment_sessions (the PRIMARY source of grammar data)
      let sessionsQuery = this.supabase
        .from('grammar_assignment_sessions')
        .select(`
          id,
          student_id,
          assignment_id,
          topic_id,
          session_type,
          questions_attempted,
          questions_correct,
          accuracy_percentage,
          duration_seconds,
          completion_status,
          session_data,
          created_at,
          ended_at
        `)
        .in('student_id', studentIds);

      if (dateRange) {
        sessionsQuery = sessionsQuery
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to);
      }

      const { data: sessions, error: sessionsError } = await sessionsQuery;
      if (sessionsError) {
        console.error('Error fetching grammar sessions:', sessionsError);
        throw sessionsError;
      }

      const allSessions = sessions || [];

      // Get topic titles for mapping
      const topicIds = [...new Set(allSessions.map(s => s.topic_id).filter(Boolean))];
      let topicMap = new Map<string, string>();

      if (topicIds.length > 0) {
        const { data: topics } = await this.supabase
          .from('grammar_topics')
          .select('id, title')
          .in('id', topicIds);

        if (topics) {
          topicMap = new Map(topics.map(t => [t.id, t.title]));
        }
      }

      // Calculate class stats from sessions
      const totalQuestions = allSessions.reduce((sum, s) => sum + (s.questions_attempted || 0), 0);
      const correctQuestions = allSessions.reduce((sum, s) => sum + (s.questions_correct || 0), 0);
      const averageAccuracy = totalQuestions > 0 ? (correctQuestions / totalQuestions) * 100 : 0;

      const uniqueTopics = new Set(allSessions.map(s => s.topic_id).filter(Boolean));
      const totalTopicsTracked = uniqueTopics.size;

      // Active students in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const activeStudents = new Set(
        allSessions
          .filter(s => new Date(s.created_at) >= sevenDaysAgo)
          .map(s => s.student_id)
      );

      // Calculate topic performance
      const topicStatsMap = new Map<string, {
        total: number;
        correct: number;
        students: Set<string>;
        responseTimes: number[];
      }>();

      allSessions.forEach(session => {
        if (!session.topic_id) return;

        if (!topicStatsMap.has(session.topic_id)) {
          topicStatsMap.set(session.topic_id, {
            total: 0,
            correct: 0,
            students: new Set(),
            responseTimes: []
          });
        }

        const topicData = topicStatsMap.get(session.topic_id)!;
        topicData.total += session.questions_attempted || 0;
        topicData.correct += session.questions_correct || 0;
        topicData.students.add(session.student_id);

        if (session.duration_seconds && session.questions_attempted) {
          const avgResponseTime = (session.duration_seconds * 1000) / session.questions_attempted;
          topicData.responseTimes.push(avgResponseTime);
        }
      });

      const topicPerformance: TopicPerformance[] = Array.from(topicStatsMap.entries())
        .map(([topicId, data]) => ({
          topicId,
          topicTitle: topicMap.get(topicId) || 'Unknown Topic',
          totalAttempts: data.total,
          correctAttempts: data.correct,
          accuracyPercentage: data.total > 0 ? (data.correct / data.total) * 100 : 0,
          studentsAttempted: data.students.size,
          averageResponseTime: data.responseTimes.length > 0
            ? data.responseTimes.reduce((a, b) => a + b, 0) / data.responseTimes.length
            : 0
        }))
        .sort((a, b) => b.accuracyPercentage - a.accuracyPercentage);

      // Convert to tensePerformance for backwards compatibility
      const tensePerformance: TensePerformance[] = topicPerformance.map(tp => ({
        tense: tp.topicTitle,
        totalAttempts: tp.totalAttempts,
        correctAttempts: tp.correctAttempts,
        accuracyPercentage: tp.accuracyPercentage,
        studentsAttempted: tp.studentsAttempted,
        averageResponseTime: tp.averageResponseTime
      }));

      // Calculate student progress
      const studentProgress: StudentGrammarProgress[] = studentIds.map(studentId => {
        const studentSessions = allSessions.filter(s => s.student_id === studentId);
        const totalAttempts = studentSessions.reduce((sum, s) => sum + (s.questions_attempted || 0), 0);
        const correctAttempts = studentSessions.reduce((sum, s) => sum + (s.questions_correct || 0), 0);
        const studentAccuracy = totalAttempts > 0
          ? (correctAttempts / totalAttempts) * 100
          : 0;

        // Topic breakdown for this student
        const studentTopicMap = new Map<string, { attempts: number; correct: number }>();
        studentSessions.forEach(session => {
          if (!session.topic_id) return;

          if (!studentTopicMap.has(session.topic_id)) {
            studentTopicMap.set(session.topic_id, { attempts: 0, correct: 0 });
          }
          const topicData = studentTopicMap.get(session.topic_id)!;
          topicData.attempts += session.questions_attempted || 0;
          topicData.correct += session.questions_correct || 0;
        });

        const topicBreakdown = Array.from(studentTopicMap.entries()).map(([topicId, data]) => ({
          topicId,
          topicTitle: topicMap.get(topicId) || 'Unknown Topic',
          attempts: data.attempts,
          correct: data.correct,
          accuracy: data.attempts > 0 ? (data.correct / data.attempts) * 100 : 0
        }));

        // Convert to tenseBreakdown for backwards compatibility
        const tenseBreakdown = topicBreakdown.map(tb => ({
          tense: tb.topicTitle,
          attempts: tb.attempts,
          correct: tb.correct,
          accuracy: tb.accuracy
        }));

        const topicsMastered = topicBreakdown.filter(t => t.accuracy >= 80).length;
        const topicsInProgress = topicBreakdown.filter(t => t.accuracy < 80 && t.accuracy >= 50).length;

        const lastSession = studentSessions.length > 0
          ? new Date(Math.max(...studentSessions.map(s => new Date(s.created_at).getTime())))
          : null;

        return {
          studentId,
          studentName: studentMap.get(studentId) || 'Unknown Student',
          totalAttempts,
          correctAttempts,
          accuracyPercentage: studentAccuracy,
          topicsMastered,
          topicsInProgress,
          tensesMastered: topicsMastered, // For backwards compatibility
          tensesInProgress: topicsInProgress, // For backwards compatibility
          lastActive: lastSession,
          tenseBreakdown,
          topicBreakdown
        };
      }).sort((a, b) => b.accuracyPercentage - a.accuracyPercentage);

      // Generate insights
      const studentsNeedingAttention = studentProgress
        .filter(s => s.accuracyPercentage < 60 || s.totalAttempts < 10)
        .slice(0, 10)
        .map(s => {
          const weakestTopic = s.topicBreakdown.length > 0
            ? s.topicBreakdown.sort((a, b) => a.accuracy - b.accuracy)[0].topicTitle
            : 'N/A';

          return {
            studentId: s.studentId,
            studentName: s.studentName,
            accuracy: s.accuracyPercentage,
            attemptsCount: s.totalAttempts,
            weakestTopic,
            weakestTense: weakestTopic // For backwards compatibility
          };
        });

      const strongestTopics = topicPerformance
        .filter(t => t.accuracyPercentage >= 75)
        .slice(0, 3)
        .map(t => t.topicTitle);

      const weakestTopics = topicPerformance
        .filter(t => t.accuracyPercentage < 60)
        .slice(0, 3)
        .map(t => t.topicTitle);

      // Calculate trend (simplified)
      const recentTrend: 'improving' | 'declining' | 'stable' = 'stable';

      return {
        classStats: {
          totalStudents: studentIds.length,
          totalAttempts: totalQuestions,
          averageAccuracy,
          totalTensesTracked: totalTopicsTracked, // For backwards compatibility
          totalTopicsTracked,
          activeStudentsLast7Days: activeStudents.size
        },
        tensePerformance, // For backwards compatibility
        topicPerformance,
        studentProgress,
        insights: {
          studentsNeedingAttention,
          strongestTenses: strongestTopics, // For backwards compatibility
          strongestTopics,
          weakestTenses: weakestTopics, // For backwards compatibility
          weakestTopics,
          recentTrend
        }
      };
    } catch (error) {
      console.error('Error fetching teacher grammar analytics:', error);
      throw error;
    }
  }

  private getEmptyAnalytics(): TeacherGrammarAnalytics {
    return {
      classStats: {
        totalStudents: 0,
        totalAttempts: 0,
        averageAccuracy: 0,
        totalTensesTracked: 0,
        totalTopicsTracked: 0,
        activeStudentsLast7Days: 0
      },
      tensePerformance: [],
      topicPerformance: [],
      studentProgress: [],
      insights: {
        studentsNeedingAttention: [],
        strongestTenses: [],
        strongestTopics: [],
        weakestTenses: [],
        weakestTopics: [],
        recentTrend: 'stable'
      }
    };
  }
}

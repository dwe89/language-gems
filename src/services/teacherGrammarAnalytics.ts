import { SupabaseClient } from '@supabase/supabase-js';

export interface TeacherGrammarAnalytics {
  classStats: {
    totalStudents: number;
    totalAttempts: number;
    averageAccuracy: number;
    totalTensesTracked: number;
    activeStudentsLast7Days: number;
  };
  tensePerformance: TensePerformance[];
  studentProgress: StudentGrammarProgress[];
  insights: {
    studentsNeedingAttention: Array<{
      studentId: string;
      studentName: string;
      accuracy: number;
      attemptsCount: number;
      weakestTense: string;
    }>;
    strongestTenses: string[];
    weakestTenses: string[];
    recentTrend: 'improving' | 'declining' | 'stable';
  };
}

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
  tensesMastered: number;
  tensesInProgress: number;
  lastActive: Date | null;
  tenseBreakdown: Array<{
    tense: string;
    attempts: number;
    correct: number;
    accuracy: number;
  }>;
}

export class TeacherGrammarAnalyticsService {
  constructor(private supabase: SupabaseClient) {}

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

      // Get grammar practice attempts
      let attemptsQuery = this.supabase
        .from('grammar_practice_attempts')
        .select('*')
        .in('student_id', studentIds);

      if (dateRange) {
        attemptsQuery = attemptsQuery
          .gte('created_at', dateRange.from)
          .lte('created_at', dateRange.to);
      }

      const { data: attempts, error: attemptsError } = await attemptsQuery;
      if (attemptsError) throw attemptsError;

      const allAttempts = attempts || [];

      // Calculate class stats
      const totalAttempts = allAttempts.length;
      const correctAttempts = allAttempts.filter(a => a.is_correct).length;
      const averageAccuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

      const uniqueTenses = new Set(allAttempts.map(a => a.tense));
      const totalTensesTracked = uniqueTenses.size;

      // Active students in last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const activeStudents = new Set(
        allAttempts
          .filter(a => new Date(a.created_at) >= sevenDaysAgo)
          .map(a => a.student_id)
      );

      // Calculate tense performance
      const tenseMap = new Map<string, {
        total: number;
        correct: number;
        students: Set<string>;
        responseTimes: number[];
      }>();

      allAttempts.forEach(attempt => {
        if (!tenseMap.has(attempt.tense)) {
          tenseMap.set(attempt.tense, {
            total: 0,
            correct: 0,
            students: new Set(),
            responseTimes: []
          });
        }

        const tenseData = tenseMap.get(attempt.tense)!;
        tenseData.total++;
        if (attempt.is_correct) tenseData.correct++;
        tenseData.students.add(attempt.student_id);
        if (attempt.response_time_ms) {
          tenseData.responseTimes.push(attempt.response_time_ms);
        }
      });

      const tensePerformance: TensePerformance[] = Array.from(tenseMap.entries())
        .map(([tense, data]) => ({
          tense,
          totalAttempts: data.total,
          correctAttempts: data.correct,
          accuracyPercentage: (data.correct / data.total) * 100,
          studentsAttempted: data.students.size,
          averageResponseTime: data.responseTimes.length > 0
            ? data.responseTimes.reduce((a, b) => a + b, 0) / data.responseTimes.length
            : 0
        }))
        .sort((a, b) => b.accuracyPercentage - a.accuracyPercentage);

      // Calculate student progress
      const studentProgress: StudentGrammarProgress[] = studentIds.map(studentId => {
        const studentAttempts = allAttempts.filter(a => a.student_id === studentId);
        const studentCorrect = studentAttempts.filter(a => a.is_correct).length;
        const studentAccuracy = studentAttempts.length > 0
          ? (studentCorrect / studentAttempts.length) * 100
          : 0;

        // Tense breakdown for this student
        const studentTenseMap = new Map<string, { attempts: number; correct: number }>();
        studentAttempts.forEach(attempt => {
          if (!studentTenseMap.has(attempt.tense)) {
            studentTenseMap.set(attempt.tense, { attempts: 0, correct: 0 });
          }
          const tenseData = studentTenseMap.get(attempt.tense)!;
          tenseData.attempts++;
          if (attempt.is_correct) tenseData.correct++;
        });

        const tenseBreakdown = Array.from(studentTenseMap.entries()).map(([tense, data]) => ({
          tense,
          attempts: data.attempts,
          correct: data.correct,
          accuracy: (data.correct / data.attempts) * 100
        }));

        const tensesMastered = tenseBreakdown.filter(t => t.accuracy >= 80).length;
        const tensesInProgress = tenseBreakdown.filter(t => t.accuracy < 80 && t.accuracy >= 50).length;

        const lastAttempt = studentAttempts.length > 0
          ? new Date(Math.max(...studentAttempts.map(a => new Date(a.created_at).getTime())))
          : null;

        return {
          studentId,
          studentName: studentMap.get(studentId) || 'Unknown Student',
          totalAttempts: studentAttempts.length,
          correctAttempts: studentCorrect,
          accuracyPercentage: studentAccuracy,
          tensesMastered,
          tensesInProgress,
          lastActive: lastAttempt,
          tenseBreakdown
        };
      }).sort((a, b) => b.accuracyPercentage - a.accuracyPercentage);

      // Generate insights
      const studentsNeedingAttention = studentProgress
        .filter(s => s.accuracyPercentage < 60 || s.totalAttempts < 10)
        .slice(0, 10)
        .map(s => {
          const weakestTense = s.tenseBreakdown.length > 0
            ? s.tenseBreakdown.sort((a, b) => a.accuracy - b.accuracy)[0].tense
            : 'N/A';

          return {
            studentId: s.studentId,
            studentName: s.studentName,
            accuracy: s.accuracyPercentage,
            attemptsCount: s.totalAttempts,
            weakestTense
          };
        });

      const strongestTenses = tensePerformance
        .filter(t => t.accuracyPercentage >= 75)
        .slice(0, 3)
        .map(t => t.tense);

      const weakestTenses = tensePerformance
        .filter(t => t.accuracyPercentage < 60)
        .slice(0, 3)
        .map(t => t.tense);

      // Calculate trend (simplified)
      const recentTrend: 'improving' | 'declining' | 'stable' = 'stable';

      return {
        classStats: {
          totalStudents: studentIds.length,
          totalAttempts,
          averageAccuracy,
          totalTensesTracked,
          activeStudentsLast7Days: activeStudents.size
        },
        tensePerformance,
        studentProgress,
        insights: {
          studentsNeedingAttention,
          strongestTenses,
          weakestTenses,
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
        activeStudentsLast7Days: 0
      },
      tensePerformance: [],
      studentProgress: [],
      insights: {
        studentsNeedingAttention: [],
        strongestTenses: [],
        weakestTenses: [],
        recentTrend: 'stable'
      }
    };
  }
}


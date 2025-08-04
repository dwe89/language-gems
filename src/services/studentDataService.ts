import { createClient } from '@supabase/supabase-js';
import type { Database } from '../lib/database.types';

// Initialize Supabase client with service role for server-side operations
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface RealTimeStudentData {
  student_id: string;
  student_name: string;
  email: string;
  class_id: string;
  class_name: string;
  last_active: string;
  
  // Performance metrics from assignment_progress
  assignments_completed: number;
  assignments_total: number;
  average_score: number;
  average_accuracy: number;
  total_time_spent: number;
  
  // Game session data from enhanced_game_sessions
  recent_sessions: Array<{
    game_type: string;
    final_score: number;
    accuracy_percentage: number;
    completion_percentage: number;
    duration_seconds: number;
    ended_at: string;
  }>;
  
  // Vocabulary progress from student_vocabulary_assignment_progress
  vocabulary_stats: {
    words_attempted: number;
    words_mastered: number;
    retention_rate: number;
    struggling_words: string[];
  };
  
  // Engagement metrics
  login_frequency: number;
  current_streak: number;
  session_duration_avg: number;
  
  // Risk indicators
  is_at_risk: boolean;
  risk_factors: string[];
}

export interface ClassAnalytics {
  class_id: string;
  class_name: string;
  total_students: number;
  active_students: number;
  at_risk_students: number;
  average_performance: number;
  engagement_score: number;
  common_struggles: string[];
  top_performers: string[];
}

export class StudentDataService {
  
  /**
   * Get comprehensive student data for AI analysis
   */
  async getStudentAnalyticsData(teacherId: string): Promise<RealTimeStudentData[]> {
    try {
      // Get all students enrolled in teacher's classes
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('class_enrollments')
        .select(`
          student_id,
          class_id,
          classes!inner(
            id,
            name,
            teacher_id
          )
        `)
        .eq('classes.teacher_id', teacherId)
        .eq('status', 'active');

      if (enrollmentError) throw enrollmentError;

      const studentData: RealTimeStudentData[] = [];

      for (const enrollment of enrollments || []) {
        const studentId = enrollment.student_id;
        const classId = enrollment.class_id;
        const className = enrollment.classes?.name || 'Unknown Class';



        // Get student profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('display_name, user_id')
          .eq('user_id', studentId)
          .single();

        // Get user email
        const { data: user } = await supabase
          .from('auth.users')
          .select('email')
          .eq('id', studentId)
          .single();

        // Get assignment progress
        const { data: assignmentProgress } = await supabase
          .from('assignment_progress')
          .select('*')
          .eq('student_id', studentId);

        // Get recent game sessions
        const { data: gameSessions } = await supabase
          .from('enhanced_game_sessions')
          .select('*')
          .eq('student_id', studentId)
          .not('ended_at', 'is', null)
          .order('ended_at', { ascending: false })
          .limit(10);

        // Get vocabulary progress
        const { data: vocabProgress } = await supabase
          .from('student_vocabulary_assignment_progress')
          .select('*')
          .eq('student_id', studentId);

        // Calculate metrics
        const assignments = assignmentProgress || [];
        const sessions = gameSessions || [];
        const vocab = vocabProgress || [];

        const assignmentsCompleted = assignments.filter(a => a.status === 'completed').length;
        const assignmentsTotal = assignments.length;
        const averageScore = assignments.length > 0 
          ? assignments.reduce((sum, a) => sum + a.score, 0) / assignments.length 
          : 0;
        const averageAccuracy = assignments.length > 0
          ? assignments.reduce((sum, a) => sum + a.accuracy, 0) / assignments.length
          : 0;
        const totalTimeSpent = assignments.reduce((sum, a) => sum + a.time_spent, 0);

        // Calculate vocabulary stats
        const wordsAttempted = vocab.length;
        const wordsMastered = vocab.filter(v => v.mastery_level === 'mastered').length;
        const retentionRate = wordsAttempted > 0 ? (wordsMastered / wordsAttempted) * 100 : 0;
        const strugglingWords = vocab
          .filter(v => v.correct_attempts < v.attempts * 0.5)
          .map(v => `Vocab ID: ${v.vocabulary_id}`)
          .slice(0, 5);

        // Calculate engagement metrics
        const recentSessions = sessions.slice(0, 7); // Last 7 sessions
        const loginFrequency = recentSessions.length; // Sessions per week approximation
        const sessionDurationAvg = sessions.length > 0
          ? sessions.reduce((sum, s) => sum + s.duration_seconds, 0) / sessions.length / 60
          : 0;

        // Determine risk factors
        const riskFactors: string[] = [];
        let isAtRisk = false;

        if (averageScore < 60) {
          riskFactors.push('Low average score');
          isAtRisk = true;
        }
        if (averageAccuracy < 70) {
          riskFactors.push('Low accuracy');
          isAtRisk = true;
        }
        if (assignmentsCompleted / Math.max(assignmentsTotal, 1) < 0.5) {
          riskFactors.push('Low completion rate');
          isAtRisk = true;
        }
        if (loginFrequency < 2) {
          riskFactors.push('Infrequent activity');
          isAtRisk = true;
        }
        if (retentionRate < 50) {
          riskFactors.push('Poor vocabulary retention');
          isAtRisk = true;
        }

        // Get last activity
        const lastActivity = sessions.length > 0 
          ? sessions[0].ended_at 
          : assignments.length > 0 
            ? assignments[assignments.length - 1].updated_at
            : new Date().toISOString();

        studentData.push({
          student_id: studentId,
          student_name: profile?.display_name || 'Unknown Student',
          email: user?.email || 'No email',
          class_id: classId,
          class_name: className,
          last_active: lastActivity,
          assignments_completed: assignmentsCompleted,
          assignments_total: assignmentsTotal,
          average_score: Math.round(averageScore),
          average_accuracy: Math.round(averageAccuracy),
          total_time_spent: Math.round(totalTimeSpent),
          recent_sessions: sessions.slice(0, 5).map(s => ({
            game_type: s.game_type || 'Unknown',
            final_score: s.final_score || 0,
            accuracy_percentage: s.accuracy_percentage || 0,
            completion_percentage: s.completion_percentage || 0,
            duration_seconds: s.duration_seconds || 0,
            ended_at: s.ended_at || ''
          })),
          vocabulary_stats: {
            words_attempted: wordsAttempted,
            words_mastered: wordsMastered,
            retention_rate: Math.round(retentionRate),
            struggling_words: strugglingWords
          },
          login_frequency: loginFrequency,
          current_streak: 0, // Would need streak tracking
          session_duration_avg: Math.round(sessionDurationAvg),
          is_at_risk: isAtRisk,
          risk_factors: riskFactors
        });
      }

      return studentData;
    } catch (error) {
      console.error('Error fetching student analytics data:', error);
      return [];
    }
  }

  /**
   * Get class-level analytics
   */
  async getClassAnalytics(teacherId: string): Promise<ClassAnalytics[]> {
    try {
      const { data: classes, error } = await supabase
        .from('classes')
        .select(`
          id,
          name,
          class_enrollments!inner(
            student_id,
            status
          )
        `)
        .eq('teacher_id', teacherId);

      if (error) throw error;

      const classAnalytics: ClassAnalytics[] = [];

      for (const classData of classes || []) {
        const activeEnrollments = classData.class_enrollments?.filter(e => e.status === 'active') || [];
        const totalStudents = activeEnrollments.length;

        // Get student data for this class
        const studentData = await this.getStudentAnalyticsData(teacherId);
        const classStudents = studentData.filter(s => s.class_id === classData.id);

        const atRiskStudents = classStudents.filter(s => s.is_at_risk).length;
        const averagePerformance = classStudents.length > 0
          ? classStudents.reduce((sum, s) => sum + s.average_score, 0) / classStudents.length
          : 0;

        // Calculate engagement score based on activity
        const engagementScore = classStudents.length > 0
          ? classStudents.reduce((sum, s) => sum + s.login_frequency, 0) / classStudents.length * 10
          : 0;

        // Find common struggles
        const allRiskFactors = classStudents.flatMap(s => s.risk_factors);
        const factorCounts = allRiskFactors.reduce((acc, factor) => {
          acc[factor] = (acc[factor] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const commonStruggles = Object.entries(factorCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([factor]) => factor);

        // Find top performers
        const topPerformers = classStudents
          .filter(s => !s.is_at_risk && s.average_score > 80)
          .sort((a, b) => b.average_score - a.average_score)
          .slice(0, 3)
          .map(s => s.student_name);

        classAnalytics.push({
          class_id: classData.id,
          class_name: classData.name,
          total_students: totalStudents,
          active_students: classStudents.filter(s => 
            new Date(s.last_active) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
          at_risk_students: atRiskStudents,
          average_performance: Math.round(averagePerformance),
          engagement_score: Math.min(100, Math.round(engagementScore)),
          common_struggles: commonStruggles,
          top_performers: topPerformers
        });
      }

      return classAnalytics;
    } catch (error) {
      console.error('Error fetching class analytics:', error);
      return [];
    }
  }

  /**
   * Get vocabulary difficulty analysis across all classes
   */
  async getVocabularyDifficultyAnalysis(teacherId: string): Promise<any[]> {
    try {
      const { data: vocabData, error } = await supabase
        .from('student_vocabulary_assignment_progress')
        .select(`
          vocabulary_id,
          attempts,
          correct_attempts,
          assignments!inner(
            created_by
          )
        `)
        .eq('assignments.created_by', teacherId);

      if (error) throw error;

      // Group by vocabulary_id and calculate difficulty metrics
      const vocabStats = (vocabData || []).reduce((acc, item) => {
        const vocabId = item.vocabulary_id;
        if (!acc[vocabId]) {
          acc[vocabId] = {
            vocabulary_id: vocabId,
            total_attempts: 0,
            correct_attempts: 0,
            student_count: 0
          };
        }
        
        acc[vocabId].total_attempts += item.attempts;
        acc[vocabId].correct_attempts += item.correct_attempts;
        acc[vocabId].student_count += 1;
        
        return acc;
      }, {} as Record<string, any>);

      return Object.values(vocabStats).map(stat => ({
        ...stat,
        accuracy_rate: stat.total_attempts > 0 ? (stat.correct_attempts / stat.total_attempts) * 100 : 0,
        difficulty_score: stat.total_attempts > 0 ? 1 - (stat.correct_attempts / stat.total_attempts) : 0
      }));
    } catch (error) {
      console.error('Error fetching vocabulary difficulty analysis:', error);
      return [];
    }
  }
}

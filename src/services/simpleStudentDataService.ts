import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface SimpleStudentData {
  student_id: string;
  student_name: string;
  email: string;
  class_id: string | null;
  class_name: string;
  last_active: string;
  
  // Performance metrics from enhanced_game_sessions
  total_sessions: number;
  average_accuracy: number;
  total_xp: number;
  average_session_duration: number;
  
  // Recent activity
  recent_sessions: Array<{
    game_type: string;
    accuracy_percentage: number;
    xp_earned: number;
    duration_seconds: number;
    created_at: string;
  }>;
  
  // Risk assessment
  is_at_risk: boolean;
  risk_factors: string[];
  risk_score: number;

  // Enhanced metrics based on real data
  current_streak: number;
  longest_streak: number;
  assignments_completed: number;
  improvement_rate: number; // percentage change in accuracy over time
  words_learned: number;
  words_mastered: number;
  last_struggle_area: string;
}

export interface SimpleClassAnalytics {
  class_id: string;
  class_name: string;
  total_students: number;
  active_students: number;
  at_risk_students: number;
  average_performance: number;
  engagement_score: number;
  common_struggles: string[];
}

export class SimpleStudentDataService {

  /**
   * Calculate current and longest streak based on session dates
   */
  private calculateStreaks(sessions: any[]): { current: number, longest: number } {
    if (sessions.length === 0) return { current: 0, longest: 0 };

    // Sort sessions by date (newest first)
    const sortedSessions = sessions
      .map(s => ({ ...s, date: new Date(s.created_at).toDateString() }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Get unique dates
    const uniqueDates = [...new Set(sortedSessions.map(s => s.date))];

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak (consecutive days from today)
    const today = new Date().toDateString();
    let checkDate = new Date();

    for (let i = 0; i < 30; i++) { // Check last 30 days
      const dateStr = checkDate.toDateString();
      if (uniqueDates.includes(dateStr)) {
        if (i === 0 || currentStreak > 0) currentStreak++;
      } else if (i > 0) {
        break; // Break streak
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak
    let previousDate: Date | null = null;
    for (const dateStr of uniqueDates) {
      const currentDate = new Date(dateStr);

      if (previousDate === null) {
        tempStreak = 1;
      } else {
        const daysDiff = Math.abs((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff <= 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      previousDate = currentDate;
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { current: currentStreak, longest: longestStreak };
  }

  /**
   * Calculate improvement rate based on accuracy trend
   */
  private calculateImprovementRate(sessions: any[]): number {
    if (sessions.length < 5) return 0; // Need at least 5 sessions for trend

    // Sort by date (oldest first)
    const sortedSessions = sessions
      .filter(s => s.accuracy_percentage != null)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    if (sortedSessions.length < 5) return 0;

    // Compare first 5 sessions with last 5 sessions
    const firstFive = sortedSessions.slice(0, 5);
    const lastFive = sortedSessions.slice(-5);

    const firstAvg = firstFive.reduce((sum, s) => sum + parseFloat(s.accuracy_percentage?.toString() || '0'), 0) / firstFive.length;
    const lastAvg = lastFive.reduce((sum, s) => sum + parseFloat(s.accuracy_percentage?.toString() || '0'), 0) / lastFive.length;

    return Math.round(((lastAvg - firstAvg) / firstAvg) * 100 * 100) / 100; // Percentage improvement
  }

  /**
   * Determine the area where student struggles most
   */
  private getLastStruggleArea(sessions: any[]): string {
    if (sessions.length === 0) return 'No data available';

    // Group by game type and find lowest accuracy
    const gameAccuracy: Record<string, { total: number, count: number }> = {};

    sessions.forEach(session => {
      const gameType = session.game_type || 'Unknown';
      const accuracy = parseFloat(session.accuracy_percentage?.toString() || '0');

      if (!gameAccuracy[gameType]) {
        gameAccuracy[gameType] = { total: 0, count: 0 };
      }
      gameAccuracy[gameType].total += accuracy;
      gameAccuracy[gameType].count += 1;
    });

    // Find game type with lowest average accuracy
    let lowestAccuracy = 100;
    let struggleArea = 'No specific area';

    Object.entries(gameAccuracy).forEach(([gameType, data]) => {
      const avgAccuracy = data.total / data.count;
      if (avgAccuracy < lowestAccuracy && data.count >= 2) { // At least 2 sessions
        lowestAccuracy = avgAccuracy;
        struggleArea = gameType;
      }
    });

    return struggleArea;
  }
  
  /**
   * Get student data using our current schema (user_profiles with teacher_id)
   */
  async getStudentAnalyticsData(teacherId: string): Promise<SimpleStudentData[]> {
    try {
      console.log(`Fetching student data for teacher: ${teacherId}`);
      
      // Get all students for this teacher
      const { data: students, error: studentsError } = await supabase
        .from('user_profiles')
        .select('user_id, display_name, email')
        .eq('teacher_id', teacherId)
        .eq('role', 'student');

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        return [];
      }

      if (!students || students.length === 0) {
        console.log('No students found for teacher');
        return [];
      }

      console.log(`Found ${students.length} students`);

      const studentData: SimpleStudentData[] = [];

      for (const student of students) {
        const studentId = student.user_id;

        // Get class enrollment for this student
        const { data: enrollment, error: enrollmentError } = await supabase
          .from('class_enrollments')
          .select(`
            class_id,
            classes!inner(
              id,
              name
            )
          `)
          .eq('student_id', studentId)
          .eq('status', 'active')
          .single();

        let classId = null;
        let className = 'Default Class';

        if (!enrollmentError && enrollment) {
          classId = enrollment.class_id;
          className = enrollment.classes?.name || 'Default Class';
        }

        // Get game sessions for this student
        const { data: gameSessions, error: sessionsError } = await supabase
          .from('enhanced_game_sessions')
          .select('*')
          .eq('student_id', studentId)
          .order('created_at', { ascending: false });

        if (sessionsError) {
          console.error(`Error fetching sessions for student ${studentId}:`, sessionsError);
          continue;
        }

        const sessions = gameSessions || [];
        console.log(`Student ${student.display_name}: ${sessions.length} sessions`);

        // Calculate metrics
        const totalSessions = sessions.length;
        const averageAccuracy = sessions.length > 0 
          ? sessions.reduce((sum, s) => sum + (parseFloat(s.accuracy_percentage?.toString() || '0')), 0) / sessions.length
          : 0;
        const totalXP = sessions.reduce((sum, s) => sum + (s.xp_earned || 0), 0);
        const averageSessionDuration = sessions.length > 0
          ? sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length
          : 0;

        // Get recent sessions (last 5)
        const recentSessions = sessions.slice(0, 5).map(s => ({
          game_type: s.game_type || 'unknown',
          accuracy_percentage: parseFloat(s.accuracy_percentage?.toString() || '0'),
          xp_earned: s.xp_earned || 0,
          duration_seconds: s.duration_seconds || 0,
          created_at: s.created_at || new Date().toISOString()
        }));

        // Calculate risk factors
        const riskFactors: string[] = [];
        let riskScore = 0;

        if (averageAccuracy < 70) {
          riskFactors.push('Low accuracy rate');
          riskScore += 0.3;
        }
        if (totalSessions < 5) {
          riskFactors.push('Low engagement');
          riskScore += 0.2;
        }
        if (averageSessionDuration < 120) { // Less than 2 minutes
          riskFactors.push('Short session duration');
          riskScore += 0.2;
        }
        
        // Check for declining performance
        if (sessions.length >= 3) {
          const recentAccuracy = sessions.slice(0, 3).reduce((sum, s) => sum + parseFloat(s.accuracy_percentage?.toString() || '0'), 0) / 3;
          const olderAccuracy = sessions.slice(-3).reduce((sum, s) => sum + parseFloat(s.accuracy_percentage?.toString() || '0'), 0) / 3;
          
          if (recentAccuracy < olderAccuracy - 10) {
            riskFactors.push('Declining performance');
            riskScore += 0.3;
          }
        }

        const isAtRisk = riskScore > 0.4;
        const lastActive = sessions.length > 0 ? sessions[0].created_at : new Date().toISOString();

        // Calculate enhanced metrics
        const streaks = this.calculateStreaks(sessions);
        const improvementRate = this.calculateImprovementRate(sessions);
        const lastStruggleArea = this.getLastStruggleArea(sessions);

        // Calculate assignments completed (count unique game sessions as assignments)
        const assignmentsCompleted = sessions.filter(s => s.completion_percentage >= 80).length;

        // Estimate words learned/mastered from XP (rough approximation)
        const wordsLearned = Math.floor(totalXP / 8); // Assuming ~8 XP per word learned
        const wordsMastered = Math.floor(totalXP / 15); // Assuming ~15 XP per word mastered

        studentData.push({
          student_id: studentId,
          student_name: student.display_name || 'Unknown Student',
          email: student.email || 'No email',
          class_id: classId,
          class_name: className,
          last_active: lastActive || new Date().toISOString(),
          total_sessions: totalSessions,
          average_accuracy: Math.round(averageAccuracy * 100) / 100,
          total_xp: totalXP,
          average_session_duration: Math.round(averageSessionDuration),
          recent_sessions: recentSessions,
          is_at_risk: isAtRisk,
          risk_factors: riskFactors,
          risk_score: Math.round(riskScore * 100) / 100,

          // Enhanced metrics based on real data
          current_streak: streaks.current,
          longest_streak: streaks.longest,
          assignments_completed: assignmentsCompleted,
          improvement_rate: improvementRate,
          words_learned: wordsLearned,
          words_mastered: wordsMastered,
          last_struggle_area: lastStruggleArea
        });
      }

      console.log(`Processed ${studentData.length} students with analytics data`);
      return studentData;

    } catch (error) {
      console.error('Error in getStudentAnalyticsData:', error);
      return [];
    }
  }

  /**
   * Calculate learning patterns for a teacher's students
   */
  async getLearningPatterns(teacherId: string): Promise<{
    peakLearningTime: string;
    averageSessionDuration: number;
    streakMaintenanceRate: number;
  }> {
    try {
      const studentData = await this.getStudentAnalyticsData(teacherId);

      if (studentData.length === 0) {
        return {
          peakLearningTime: 'No data available',
          averageSessionDuration: 0,
          streakMaintenanceRate: 0
        };
      }

      // Calculate peak learning time by analyzing session times
      const hourCounts: Record<number, number> = {};
      let totalSessionDuration = 0;
      let totalSessions = 0;
      let studentsWithStreaks = 0;

      for (const student of studentData) {
        // Count sessions by hour
        student.recent_sessions.forEach(session => {
          const hour = new Date(session.created_at).getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
          totalSessionDuration += session.duration_seconds;
          totalSessions++;
        });

        // Count students with current streaks
        if (student.current_streak > 0) {
          studentsWithStreaks++;
        }
      }

      // Find peak hour
      let peakHour = 12; // Default to noon
      let maxSessions = 0;
      Object.entries(hourCounts).forEach(([hour, count]) => {
        if (count > maxSessions) {
          maxSessions = count;
          peakHour = parseInt(hour);
        }
      });

      // Format peak time
      const peakTime = peakHour === 0 ? '12:00 AM' :
                      peakHour < 12 ? `${peakHour}:00 AM` :
                      peakHour === 12 ? '12:00 PM' :
                      `${peakHour - 12}:00 PM`;

      // Calculate averages
      const avgSessionDuration = totalSessions > 0 ? Math.round(totalSessionDuration / totalSessions / 60) : 0;
      const streakMaintenanceRate = studentData.length > 0 ? Math.round((studentsWithStreaks / studentData.length) * 100) : 0;

      return {
        peakLearningTime: maxSessions > 0 ? peakTime : 'No data available',
        averageSessionDuration: avgSessionDuration,
        streakMaintenanceRate: streakMaintenanceRate
      };

    } catch (error) {
      console.error('Error calculating learning patterns:', error);
      return {
        peakLearningTime: 'Error loading data',
        averageSessionDuration: 0,
        streakMaintenanceRate: 0
      };
    }
  }

  /**
   * Get class analytics using our current schema
   */
  async getClassAnalytics(teacherId: string): Promise<SimpleClassAnalytics[]> {
    try {
      console.log(`Fetching class analytics for teacher: ${teacherId}`);
      
      // Get student data first
      const studentData = await this.getStudentAnalyticsData(teacherId);
      
      if (studentData.length === 0) {
        console.log('No student data available for class analytics');
        return [];
      }

      // Since we don't have proper class structure, create a single "class" with all students
      const totalStudents = studentData.length;
      const atRiskStudents = studentData.filter(s => s.is_at_risk).length;
      const activeStudents = studentData.filter(s => {
        const lastActiveDate = new Date(s.last_active);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return lastActiveDate > weekAgo;
      }).length;

      const averagePerformance = studentData.length > 0
        ? studentData.reduce((sum, s) => sum + s.average_accuracy, 0) / studentData.length
        : 0;

      const engagementScore = studentData.length > 0
        ? (studentData.reduce((sum, s) => sum + s.total_sessions, 0) / studentData.length) * 10
        : 0;

      // Find common struggles
      const allRiskFactors = studentData.flatMap(s => s.risk_factors);
      const factorCounts = allRiskFactors.reduce((acc, factor) => {
        acc[factor] = (acc[factor] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const commonStruggles = Object.entries(factorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([factor]) => factor);

      const classAnalytics: SimpleClassAnalytics = {
        class_id: '7565cca8-9c14-469f-961e-35decf890563',
        class_name: 'All Students',
        total_students: totalStudents,
        active_students: activeStudents,
        at_risk_students: atRiskStudents,
        average_performance: Math.round(averagePerformance),
        engagement_score: Math.min(100, Math.round(engagementScore)),
        common_struggles: commonStruggles
      };

      console.log(`Class analytics: ${totalStudents} students, ${atRiskStudents} at risk, ${Math.round(averagePerformance)}% avg performance`);
      
      return [classAnalytics];

    } catch (error) {
      console.error('Error in getClassAnalytics:', error);
      return [];
    }
  }

  /**
   * Get summary statistics for debugging
   */
  async getDebugSummary(teacherId: string): Promise<any> {
    try {
      const { data: students } = await supabase
        .from('user_profiles')
        .select('user_id, display_name')
        .eq('teacher_id', teacherId)
        .eq('role', 'student');

      const { data: sessions } = await supabase
        .from('enhanced_game_sessions')
        .select('student_id, game_type, accuracy_percentage, xp_earned')
        .in('student_id', (students || []).map(s => s.user_id));

      return {
        teacher_id: teacherId,
        students_found: students?.length || 0,
        sessions_found: sessions?.length || 0,
        students: students?.map(s => s.display_name) || [],
        session_summary: sessions ? {
          total_sessions: sessions.length,
          unique_students: new Set(sessions.map(s => s.student_id)).size,
          game_types: [...new Set(sessions.map(s => s.game_type))],
          avg_accuracy: sessions.reduce((sum, s) => sum + parseFloat(s.accuracy_percentage?.toString() || '0'), 0) / sessions.length,
          total_xp: sessions.reduce((sum, s) => sum + (s.xp_earned || 0), 0)
        } : null
      };
    } catch (error) {
      console.error('Error in getDebugSummary:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

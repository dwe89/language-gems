import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =====================================================
// TYPES AND INTERFACES
// =====================================================

export interface StudentAggregatedMetrics {
  student_id: string;
  class_id: string;
  // Session metrics (last 7 days)
  total_sessions_weekly: number;
  total_time_spent_weekly: number; // in seconds
  average_session_duration: number; // in seconds
  average_accuracy_weekly: number; // percentage
  total_xp_earned_weekly: number;
  
  // Performance trends
  accuracy_trend: 'improving' | 'declining' | 'stable';
  engagement_trend: 'increasing' | 'decreasing' | 'stable';
  learning_velocity: number; // words mastered per hour
  
  // At-risk indicators
  is_at_risk: boolean;
  risk_factors: string[];
  risk_score: number; // 0-100, higher = more at risk
  
  // Skill breakdown (from assessments)
  listening_score_avg: number;
  reading_score_avg: number;
  writing_score_avg: number;
  speaking_score_avg: number;
  vocabulary_comprehension_avg: number;
  grammar_accuracy_avg: number;
  
  // Vocabulary performance
  words_attempted_weekly: number;
  words_mastered_weekly: number;
  vocabulary_retention_rate: number; // percentage
  difficult_words: string[]; // word IDs of consistently missed words
  
  // Engagement metrics
  last_active_timestamp: string;
  login_streak_current: number;
  login_streak_best: number;
  
  // Calculated at
  calculated_at: string;
}

export interface ClassAggregatedMetrics {
  class_id: string;
  teacher_id: string;
  
  // Class overview
  total_students: number;
  active_students_weekly: number; // students who had sessions in last 7 days
  average_class_accuracy: number;
  average_class_engagement: number;
  
  // At-risk analysis
  at_risk_students_count: number;
  at_risk_percentage: number;
  
  // Skill performance distribution
  skill_performance: {
    listening: { average: number; below_threshold: number };
    reading: { average: number; below_threshold: number };
    writing: { average: number; below_threshold: number };
    speaking: { average: number; below_threshold: number };
    vocabulary: { average: number; below_threshold: number };
    grammar: { average: number; below_threshold: number };
  };
  
  // Common weaknesses
  common_weakness_areas: string[];
  struggling_vocabulary_themes: string[];
  
  // Progress indicators
  class_progress_trend: 'improving' | 'declining' | 'stable';
  
  calculated_at: string;
}

export interface GamePerformanceMetrics {
  game_id: string;
  // Usage statistics
  total_sessions_weekly: number;
  total_players_weekly: number;
  average_session_duration: number;
  
  // Performance metrics
  average_accuracy: number;
  average_xp_per_session: number;
  completion_rate: number; // percentage of sessions completed vs abandoned
  
  // Difficulty analysis
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  
  // Common errors
  common_error_types: string[];
  most_difficult_words: string[];
  
  calculated_at: string;
}

// =====================================================
// REAL-TIME ANALYTICS SERVICE
// =====================================================

export class RealTimeAnalyticsService {
  
  // =====================================================
  // STUDENT METRICS AGGREGATION
  // =====================================================
  
  async aggregateStudentMetrics(studentId: string): Promise<StudentAggregatedMetrics | null> {
    try {
      console.log(`Aggregating metrics for student: ${studentId}`);
      
      // Get student basic info
      const { data: student } = await supabase
        .from('students')
        .select('id, class_id')
        .eq('id', studentId)
        .single();
      
      if (!student) {
        console.error(`Student not found: ${studentId}`);
        return null;
      }
      
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Get game sessions from last 7 days
      const { data: gameSessions } = await supabase
        .from('enhanced_game_sessions')
        .select('*')
        .eq('student_id', studentId)
        .gte('session_start', weekAgo.toISOString())
        .order('session_start', { ascending: false });
      
      // Get word performance from last 7 days
      const { data: wordPerformance } = await supabase
        .from('word_performance_logs')
        .select('*')
        .eq('student_id', studentId)
        .gte('created_at', weekAgo.toISOString());
      
      // Get assessment skill breakdowns from last 30 days
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const { data: assessmentSkills } = await supabase
        .from('assessment_skill_breakdown')
        .select('*')
        .eq('student_id', studentId)
        .gte('created_at', monthAgo.toISOString())
        .order('created_at', { ascending: false });
      
      // Calculate session metrics
      const sessionMetrics = this.calculateSessionMetrics(gameSessions || []);
      
      // Calculate word performance metrics
      const wordMetrics = this.calculateWordPerformanceMetrics(wordPerformance || []);
      
      // Calculate skill averages from assessments
      const skillAverages = this.calculateSkillAverages(assessmentSkills || []);
      
      // Calculate trends and risk factors
      const trends = this.calculateTrends(gameSessions || [], wordPerformance || []);
      const riskAssessment = this.calculateRiskAssessment(sessionMetrics, wordMetrics, trends);
      
      // Calculate engagement metrics
      const engagementMetrics = this.calculateEngagementMetrics(gameSessions || []);
      
      const aggregatedMetrics: StudentAggregatedMetrics = {
        student_id: studentId,
        class_id: student.class_id,
        
        // Session metrics
        total_sessions_weekly: sessionMetrics.totalSessions,
        total_time_spent_weekly: sessionMetrics.totalTimeSpent,
        average_session_duration: sessionMetrics.averageSessionDuration,
        average_accuracy_weekly: sessionMetrics.averageAccuracy,
        total_xp_earned_weekly: sessionMetrics.totalXpEarned,
        
        // Performance trends
        accuracy_trend: trends.accuracyTrend,
        engagement_trend: trends.engagementTrend,
        learning_velocity: wordMetrics.learningVelocity,
        
        // At-risk indicators
        is_at_risk: riskAssessment.isAtRisk,
        risk_factors: riskAssessment.riskFactors,
        risk_score: riskAssessment.riskScore,
        
        // Skill breakdown
        listening_score_avg: skillAverages.listening,
        reading_score_avg: skillAverages.reading,
        writing_score_avg: skillAverages.writing,
        speaking_score_avg: skillAverages.speaking,
        vocabulary_comprehension_avg: skillAverages.vocabulary,
        grammar_accuracy_avg: skillAverages.grammar,
        
        // Vocabulary performance
        words_attempted_weekly: wordMetrics.wordsAttempted,
        words_mastered_weekly: wordMetrics.wordsMastered,
        vocabulary_retention_rate: wordMetrics.retentionRate,
        difficult_words: wordMetrics.difficultWords,
        
        // Engagement metrics
        last_active_timestamp: engagementMetrics.lastActive,
        login_streak_current: engagementMetrics.currentStreak,
        login_streak_best: engagementMetrics.bestStreak,
        
        calculated_at: now.toISOString()
      };
      
      // Save aggregated metrics to database
      await this.saveStudentMetrics(aggregatedMetrics);
      
      return aggregatedMetrics;

    } catch (error) {
      console.error('Error aggregating student metrics:', error);
      return null;
    }
  }

  // =====================================================
  // CLASS METRICS AGGREGATION
  // =====================================================

  async aggregateClassMetrics(classId: string): Promise<ClassAggregatedMetrics | null> {
    try {
      console.log(`Aggregating metrics for class: ${classId}`);

      // Get class info and teacher
      const { data: classInfo } = await supabase
        .from('classes')
        .select('id, teacher_id')
        .eq('id', classId)
        .single();

      if (!classInfo) {
        console.error(`Class not found: ${classId}`);
        return null;
      }

      // Get all students in the class
      const { data: students } = await supabase
        .from('students')
        .select('id')
        .eq('class_id', classId);

      if (!students || students.length === 0) {
        console.log(`No students found in class: ${classId}`);
        return null;
      }

      const studentIds = students.map(s => s.id);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get aggregated student metrics for all students in class
      const studentMetrics = await Promise.all(
        studentIds.map(id => this.getLatestStudentMetrics(id))
      );

      const validMetrics = studentMetrics.filter(m => m !== null) as StudentAggregatedMetrics[];

      // Calculate class-level aggregations
      const classMetrics = this.calculateClassAggregations(validMetrics);

      const aggregatedClassMetrics: ClassAggregatedMetrics = {
        class_id: classId,
        teacher_id: classInfo.teacher_id,

        total_students: students.length,
        active_students_weekly: classMetrics.activeStudents,
        average_class_accuracy: classMetrics.averageAccuracy,
        average_class_engagement: classMetrics.averageEngagement,

        at_risk_students_count: classMetrics.atRiskCount,
        at_risk_percentage: classMetrics.atRiskPercentage,

        skill_performance: classMetrics.skillPerformance,
        common_weakness_areas: classMetrics.commonWeaknesses,
        struggling_vocabulary_themes: classMetrics.strugglingThemes,

        class_progress_trend: classMetrics.progressTrend,
        calculated_at: now.toISOString()
      };

      // Save class metrics to database
      await this.saveClassMetrics(aggregatedClassMetrics);

      return aggregatedClassMetrics;

    } catch (error) {
      console.error('Error aggregating class metrics:', error);
      return null;
    }
  }

  // =====================================================
  // CALCULATION HELPER METHODS
  // =====================================================

  private calculateSessionMetrics(sessions: any[]) {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalTimeSpent: 0,
        averageSessionDuration: 0,
        averageAccuracy: 0,
        totalXpEarned: 0
      };
    }

    const totalSessions = sessions.length;
    const totalTimeSpent = sessions.reduce((sum, session) => {
      if (session.session_start && session.session_end) {
        const start = new Date(session.session_start);
        const end = new Date(session.session_end);
        return sum + (end.getTime() - start.getTime()) / 1000;
      }
      return sum;
    }, 0);

    const averageSessionDuration = totalSessions > 0 ? totalTimeSpent / totalSessions : 0;
    const averageAccuracy = sessions.reduce((sum, session) =>
      sum + (session.accuracy_percentage || 0), 0) / totalSessions;
    const totalXpEarned = sessions.reduce((sum, session) =>
      sum + (session.xp_earned || 0) + (session.bonus_xp || 0), 0);

    return {
      totalSessions,
      totalTimeSpent,
      averageSessionDuration,
      averageAccuracy,
      totalXpEarned
    };
  }

  private calculateWordPerformanceMetrics(wordLogs: any[]) {
    if (wordLogs.length === 0) {
      return {
        wordsAttempted: 0,
        wordsMastered: 0,
        retentionRate: 0,
        learningVelocity: 0,
        difficultWords: []
      };
    }

    const wordsAttempted = wordLogs.length;
    const wordsMastered = wordLogs.filter(log => log.is_correct).length;
    const retentionRate = (wordsMastered / wordsAttempted) * 100;

    // Calculate learning velocity (words mastered per hour)
    const totalTimeHours = wordLogs.reduce((sum, log) =>
      sum + (log.response_time_ms || 0), 0) / (1000 * 60 * 60);
    const learningVelocity = totalTimeHours > 0 ? wordsMastered / totalTimeHours : 0;

    // Find difficult words (consistently incorrect)
    const wordErrorCounts: { [wordId: string]: { errors: number; total: number } } = {};
    wordLogs.forEach(log => {
      if (!wordErrorCounts[log.word_id]) {
        wordErrorCounts[log.word_id] = { errors: 0, total: 0 };
      }
      wordErrorCounts[log.word_id].total++;
      if (!log.is_correct) {
        wordErrorCounts[log.word_id].errors++;
      }
    });

    const difficultWords = Object.entries(wordErrorCounts)
      .filter(([_, counts]) => counts.total >= 3 && (counts.errors / counts.total) > 0.6)
      .map(([wordId, _]) => wordId)
      .slice(0, 10);

    return {
      wordsAttempted,
      wordsMastered,
      retentionRate,
      learningVelocity,
      difficultWords
    };
  }

  private calculateSkillAverages(assessments: any[]) {
    if (assessments.length === 0) {
      return {
        listening: 0,
        reading: 0,
        writing: 0,
        speaking: 0,
        vocabulary: 0,
        grammar: 0
      };
    }

    const recentAssessments = assessments.slice(0, 5); // Last 5 assessments

    const averages = {
      listening: this.calculateAverage(recentAssessments, 'listening_score'),
      reading: this.calculateAverage(recentAssessments, 'reading_score'),
      writing: this.calculateAverage(recentAssessments, 'writing_score'),
      speaking: this.calculateAverage(recentAssessments, 'speaking_score'),
      vocabulary: this.calculateAverage(recentAssessments, 'vocabulary_comprehension'),
      grammar: this.calculateAverage(recentAssessments, 'grammar_accuracy')
    };

    return averages;
  }

  private calculateAverage(items: any[], field: string): number {
    const validItems = items.filter(item => item[field] !== null && item[field] !== undefined);
    if (validItems.length === 0) return 0;

    const sum = validItems.reduce((total, item) => total + (item[field] || 0), 0);
    return sum / validItems.length;
  }

  private calculateTrends(sessions: any[], wordLogs: any[]) {
    // Calculate accuracy trend over time
    const accuracyTrend = this.calculateAccuracyTrend(sessions);

    // Calculate engagement trend based on session frequency
    const engagementTrend = this.calculateEngagementTrend(sessions);

    return {
      accuracyTrend,
      engagementTrend
    };
  }

  private calculateAccuracyTrend(sessions: any[]): 'improving' | 'declining' | 'stable' {
    if (sessions.length < 3) return 'stable';

    // Split sessions into first half and second half
    const midPoint = Math.floor(sessions.length / 2);
    const firstHalf = sessions.slice(midPoint);
    const secondHalf = sessions.slice(0, midPoint);

    const firstHalfAvg = firstHalf.reduce((sum, s) => sum + (s.accuracy_percentage || 0), 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, s) => sum + (s.accuracy_percentage || 0), 0) / secondHalf.length;

    const difference = secondHalfAvg - firstHalfAvg;

    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  private calculateEngagementTrend(sessions: any[]): 'increasing' | 'decreasing' | 'stable' {
    if (sessions.length < 4) return 'stable';

    // Compare session frequency in recent days vs earlier days
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    const recentSessions = sessions.filter(s => new Date(s.session_start) >= threeDaysAgo);
    const olderSessions = sessions.filter(s => new Date(s.session_start) < threeDaysAgo);

    const recentFreq = recentSessions.length / 3; // sessions per day
    const olderFreq = olderSessions.length / 4; // sessions per day

    const difference = recentFreq - olderFreq;

    if (difference > 0.5) return 'increasing';
    if (difference < -0.5) return 'decreasing';
    return 'stable';
  }

  private calculateRiskAssessment(sessionMetrics: any, wordMetrics: any, trends: any) {
    const riskFactors: string[] = [];
    let riskScore = 0;

    // Low engagement risk factors
    if (sessionMetrics.totalSessions < 3) {
      riskFactors.push('Low session frequency');
      riskScore += 25;
    }

    if (sessionMetrics.averageSessionDuration < 300) { // Less than 5 minutes
      riskFactors.push('Very short session duration');
      riskScore += 20;
    }

    // Performance risk factors
    if (sessionMetrics.averageAccuracy < 60) {
      riskFactors.push('Low accuracy performance');
      riskScore += 30;
    }

    if (wordMetrics.retentionRate < 50) {
      riskFactors.push('Poor vocabulary retention');
      riskScore += 25;
    }

    // Trend risk factors
    if (trends.accuracyTrend === 'declining') {
      riskFactors.push('Declining accuracy trend');
      riskScore += 20;
    }

    if (trends.engagementTrend === 'decreasing') {
      riskFactors.push('Decreasing engagement');
      riskScore += 15;
    }

    // Learning velocity risk
    if (wordMetrics.learningVelocity < 5) { // Less than 5 words per hour
      riskFactors.push('Slow learning velocity');
      riskScore += 15;
    }

    const isAtRisk = riskScore >= 50; // Threshold for at-risk classification

    return {
      isAtRisk,
      riskFactors,
      riskScore: Math.min(riskScore, 100) // Cap at 100
    };
  }

  private calculateEngagementMetrics(sessions: any[]) {
    const lastActive = sessions.length > 0 ? sessions[0].session_start : new Date().toISOString();

    // Calculate login streaks (simplified - would need more sophisticated logic)
    const currentStreak = this.calculateCurrentStreak(sessions);
    const bestStreak = this.calculateBestStreak(sessions);

    return {
      lastActive,
      currentStreak,
      bestStreak
    };
  }

  private calculateCurrentStreak(sessions: any[]): number {
    // Simplified streak calculation - count consecutive days with sessions
    if (sessions.length === 0) return 0;

    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 7; i++) { // Check last 7 days
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasSessionThisDay = sessions.some(session => {
        const sessionDate = new Date(session.session_start);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });

      if (hasSessionThisDay) {
        streak++;
      } else {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  private calculateBestStreak(sessions: any[]): number {
    // Simplified - would need more sophisticated streak tracking
    return Math.max(this.calculateCurrentStreak(sessions), 0);
  }

  private calculateClassAggregations(studentMetrics: StudentAggregatedMetrics[]) {
    if (studentMetrics.length === 0) {
      return {
        activeStudents: 0,
        averageAccuracy: 0,
        averageEngagement: 0,
        atRiskCount: 0,
        atRiskPercentage: 0,
        skillPerformance: {
          listening: { average: 0, below_threshold: 0 },
          reading: { average: 0, below_threshold: 0 },
          writing: { average: 0, below_threshold: 0 },
          speaking: { average: 0, below_threshold: 0 },
          vocabulary: { average: 0, below_threshold: 0 },
          grammar: { average: 0, below_threshold: 0 }
        },
        commonWeaknesses: [],
        strugglingThemes: [],
        progressTrend: 'stable' as const
      };
    }

    const activeStudents = studentMetrics.filter(m => m.total_sessions_weekly > 0).length;
    const averageAccuracy = studentMetrics.reduce((sum, m) => sum + m.average_accuracy_weekly, 0) / studentMetrics.length;
    const averageEngagement = studentMetrics.reduce((sum, m) => sum + m.total_sessions_weekly, 0) / studentMetrics.length;

    const atRiskStudents = studentMetrics.filter(m => m.is_at_risk);
    const atRiskCount = atRiskStudents.length;
    const atRiskPercentage = (atRiskCount / studentMetrics.length) * 100;

    // Calculate skill performance
    const skillThresholds = { listening: 70, reading: 70, writing: 65, speaking: 65, vocabulary: 75, grammar: 70 };
    const skillPerformance = {
      listening: {
        average: studentMetrics.reduce((sum, m) => sum + m.listening_score_avg, 0) / studentMetrics.length,
        below_threshold: studentMetrics.filter(m => m.listening_score_avg < skillThresholds.listening).length
      },
      reading: {
        average: studentMetrics.reduce((sum, m) => sum + m.reading_score_avg, 0) / studentMetrics.length,
        below_threshold: studentMetrics.filter(m => m.reading_score_avg < skillThresholds.reading).length
      },
      writing: {
        average: studentMetrics.reduce((sum, m) => sum + m.writing_score_avg, 0) / studentMetrics.length,
        below_threshold: studentMetrics.filter(m => m.writing_score_avg < skillThresholds.writing).length
      },
      speaking: {
        average: studentMetrics.reduce((sum, m) => sum + m.speaking_score_avg, 0) / studentMetrics.length,
        below_threshold: studentMetrics.filter(m => m.speaking_score_avg < skillThresholds.speaking).length
      },
      vocabulary: {
        average: studentMetrics.reduce((sum, m) => sum + m.vocabulary_comprehension_avg, 0) / studentMetrics.length,
        below_threshold: studentMetrics.filter(m => m.vocabulary_comprehension_avg < skillThresholds.vocabulary).length
      },
      grammar: {
        average: studentMetrics.reduce((sum, m) => sum + m.grammar_accuracy_avg, 0) / studentMetrics.length,
        below_threshold: studentMetrics.filter(m => m.grammar_accuracy_avg < skillThresholds.grammar).length
      }
    };

    // Identify common weaknesses
    const commonWeaknesses: string[] = [];
    Object.entries(skillPerformance).forEach(([skill, performance]) => {
      const strugglingPercentage = (performance.below_threshold / studentMetrics.length) * 100;
      if (strugglingPercentage > 40) { // More than 40% struggling
        commonWeaknesses.push(skill);
      }
    });

    // Calculate progress trend based on accuracy trends
    const improvingCount = studentMetrics.filter(m => m.accuracy_trend === 'improving').length;
    const decliningCount = studentMetrics.filter(m => m.accuracy_trend === 'declining').length;

    let progressTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (improvingCount > decliningCount * 1.5) {
      progressTrend = 'improving';
    } else if (decliningCount > improvingCount * 1.5) {
      progressTrend = 'declining';
    }

    return {
      activeStudents,
      averageAccuracy,
      averageEngagement,
      atRiskCount,
      atRiskPercentage,
      skillPerformance,
      commonWeaknesses,
      strugglingThemes: [], // Would need vocabulary theme analysis
      progressTrend
    };
  }

  // =====================================================
  // DATABASE OPERATIONS
  // =====================================================

  private async saveStudentMetrics(metrics: StudentAggregatedMetrics): Promise<void> {
    try {
      // Save detailed metrics to analytics cache table
      const { error } = await this.supabase
        .from('student_analytics_cache')
        .upsert({
          student_id: metrics.student_id,
          metrics_data: metrics,
          calculated_at: metrics.calculated_at
        });

      if (error) {
        console.error('Error saving student metrics to cache:', error);
      }

    } catch (error) {
      console.error('Error in saveStudentMetrics:', error);
    }
  }

  private async saveClassMetrics(metrics: ClassAggregatedMetrics): Promise<void> {
    try {
      await this.supabase
        .from('class_analytics_cache')
        .upsert({
          class_id: metrics.class_id,
          teacher_id: metrics.teacher_id,
          metrics_data: metrics,
          calculated_at: metrics.calculated_at
        });
    } catch (error) {
      console.error('Error saving class metrics:', error);
    }
  }

  private async getLatestStudentMetrics(studentId: string): Promise<StudentAggregatedMetrics | null> {
    try {
      // Try to get from cache first
      const { data: cached } = await this.supabase
        .from('student_analytics_cache')
        .select('metrics_data')
        .eq('student_id', studentId)
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

      if (cached && cached.metrics_data) {
        const cacheAge = Date.now() - new Date(cached.metrics_data.calculated_at).getTime();
        if (cacheAge < 30 * 60 * 1000) { // Less than 30 minutes old
          return cached.metrics_data;
        }
      }

      // If no recent cache, calculate fresh metrics
      return await this.aggregateStudentMetrics(studentId);
    } catch (error) {
      console.error('Error getting student metrics:', error);
      return null;
    }
  }

  // =====================================================
  // PUBLIC METHODS FOR BATCH PROCESSING
  // =====================================================

  async aggregateAllStudentsInClass(classId: string): Promise<void> {
    try {
      const { data: enrollments } = await this.supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', classId)
        .eq('status', 'active');

      if (!enrollments) return;

      // Process students in batches to avoid overwhelming the system
      const batchSize = 5;
      for (let i = 0; i < enrollments.length; i += batchSize) {
        const batch = enrollments.slice(i, i + batchSize);
        await Promise.all(
          batch.map(enrollment => this.aggregateStudentMetrics(enrollment.student_id))
        );

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // After all students are processed, aggregate class metrics
      const teacherId = await this.getClassTeacherId(classId);
      if (teacherId) {
        await this.aggregateClassMetrics(classId, teacherId);
      }

    } catch (error) {
      console.error('Error aggregating all students in class:', error);
    }
  }

  async aggregateAllClassesForTeacher(teacherId: string): Promise<void> {
    try {
      const { data: classes } = await this.supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', teacherId);

      if (!classes) return;

      for (const classInfo of classes) {
        await this.aggregateAllStudentsInClass(classInfo.id);
      }

    } catch (error) {
      console.error('Error aggregating all classes for teacher:', error);
    }
  }

  private async getClassTeacherId(classId: string): Promise<string | null> {
    try {
      const { data, error } = await this.supabase
        .from('classes')
        .select('teacher_id')
        .eq('id', classId)
        .single();

      if (error || !data) {
        console.error('Error getting class teacher ID:', error);
        return null;
      }

      return data.teacher_id;
    } catch (error) {
      console.error('Error in getClassTeacherId:', error);
      return null;
    }
  }
}

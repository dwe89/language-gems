// =====================================================
// TEACHER INTELLIGENCE DASHBOARD - DATA SERVICE
// =====================================================

import { createClient } from '@/lib/supabase-server';
import type {
  ClassSummaryData,
  StudentProfileData,
  AssignmentAnalysisData,
  TimeRange,
  RiskLevel,
  EfficacyLevel,
  TrendDirection,
} from '@/types/teacherAnalytics';

export class TeacherAnalyticsService {
  private async getSupabase() {
    return await createClient();
  }

  // =====================================================
  // TIER 1: CLASS SUMMARY
  // =====================================================

  async getClassSummary(
    teacherId: string,
    classId?: string,
    timeRange: TimeRange = 'last_30_days'
  ): Promise<ClassSummaryData> {
    console.time('⏱️ [ANALYTICS] getClassSummary');

    const dateFilter = this.getDateFilter(timeRange);

    // ✅ BATCH LOAD ALL DATA IN PARALLEL
    const [
      studentsData,
      assignmentsData,
      gameSessionsData,
      vocabularyData,
      assignmentResponsesData,
    ] = await Promise.all([
      this.getStudentsForTeacher(teacherId, classId),
      this.getAssignmentsData(teacherId, classId, dateFilter),
      this.getGameSessionsData(teacherId, classId, dateFilter),
      this.getVocabularyData(teacherId, classId),
      this.getAssignmentResponsesData(teacherId, classId, dateFilter),
    ]);

    // Calculate top metrics
    const topMetrics = this.calculateTopMetrics(assignmentsData, studentsData);

    // Calculate urgent interventions (top 5 at-risk students)
    const urgentInterventions = this.calculateUrgentInterventions(
      studentsData,
      assignmentsData,
      gameSessionsData,
      vocabularyData
    );

    // Calculate top class weakness
    const topClassWeakness = this.calculateTopClassWeakness(
      assignmentResponsesData,
      studentsData.length,
      assignmentsData
    );

    // Get recent assignments
    const recentAssignments = this.calculateRecentAssignments(
      assignmentsData,
      studentsData.length
    );

    console.timeEnd('⏱️ [ANALYTICS] getClassSummary');

    return {
      topMetrics,
      urgentInterventions,
      topClassWeakness,
      recentAssignments,
    };
  }

  // =====================================================
  // TIER 2: STUDENT DRILL-DOWN
  // =====================================================

  async getStudentProfile(
    studentId: string,
    timeRange: TimeRange = 'last_30_days'
  ): Promise<StudentProfileData> {
    console.time('⏱️ [ANALYTICS] getStudentProfile');

    const dateFilter = this.getDateFilter(timeRange);

    // ✅ BATCH LOAD ALL DATA IN PARALLEL
    const [
      studentInfo,
      assignmentProgress,
      gameSessionsData,
      vocabularyProgress,
      grammarProgress,
      classAverages,
    ] = await Promise.all([
      this.getStudentInfo(studentId),
      this.getStudentAssignmentProgress(studentId, dateFilter),
      this.getStudentGameSessions(studentId, dateFilter),
      this.getStudentVocabularyProgress(studentId),
      this.getStudentGrammarProgress(studentId),
      this.getClassAverages(studentInfo.classId, dateFilter),
    ]);

    // Calculate performance trend
    const performanceTrend = this.calculatePerformanceTrend(
      assignmentProgress,
      classAverages.averageScore
    );

    // Calculate vocabulary mastery
    const vocabularyMastery = this.calculateVocabularyMastery(
      vocabularyProgress,
      classAverages.vocabularyAverages
    );

    // Calculate grammar mastery
    const grammarMastery = this.calculateGrammarMastery(
      grammarProgress,
      classAverages.grammarAverages
    );

    // Calculate weak skills
    const weakSkills = this.calculateWeakSkills(
      assignmentProgress,
      vocabularyProgress,
      grammarProgress
    );

    // Calculate engagement log
    const engagementLog = this.calculateEngagementLog(
      gameSessionsData,
      vocabularyProgress
    );

    console.timeEnd('⏱️ [ANALYTICS] getStudentProfile');

    return {
      studentInfo,
      performanceTrend,
      vocabularyMastery,
      grammarMastery,
      weakSkills,
      engagementLog,
    };
  }

  // =====================================================
  // TIER 3: ASSIGNMENT ANALYSIS
  // =====================================================

  async getAssignmentAnalysis(
    assignmentId: string
  ): Promise<AssignmentAnalysisData> {
    console.time('⏱️ [ANALYTICS] getAssignmentAnalysis');

    // ✅ BATCH LOAD ALL DATA IN PARALLEL
    const [assignmentInfo, responses, questions] = await Promise.all([
      this.getAssignmentInfo(assignmentId),
      this.getAssignmentResponses(assignmentId),
      this.getAssignmentQuestions(assignmentId),
    ]);

    // Calculate question breakdown
    const questionBreakdown = this.calculateQuestionBreakdown(
      questions,
      responses
    );

    // Calculate distractor analysis (for multiple choice)
    const distractorAnalysis = this.calculateDistractorAnalysis(
      questions,
      responses
    );

    // Calculate time distribution
    const timeDistribution = this.calculateTimeDistribution(responses);

    console.timeEnd('⏱️ [ANALYTICS] getAssignmentAnalysis');

    return {
      assignmentInfo,
      questionBreakdown,
      distractorAnalysis,
      timeDistribution,
    };
  }

  // =====================================================
  // HELPER METHODS - DATA FETCHING
  // =====================================================

  private getDateFilter(timeRange: TimeRange): Date {
    const now = new Date();
    switch (timeRange) {
      case 'last_7_days':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'last_30_days':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'current_term':
        // Approximate: 90 days
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case 'all_time':
        return new Date(0);
    }
  }

  private async getStudentsForTeacher(
    teacherId: string,
    classId?: string
  ): Promise<any[]> {
    const supabase = await this.getSupabase();
    let query = supabase
      .from('class_enrollments')
      .select(
        `
        student_id,
        students!inner(id, email, full_name),
        classes!inner(id, name, teacher_id)
      `
      )
      .eq('classes.teacher_id', teacherId)
      .eq('status', 'active');

    if (classId) {
      query = query.eq('class_id', classId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }

    return data || [];
  }

  private async getAssignmentsData(
    teacherId: string,
    classId: string | undefined,
    dateFilter: Date
  ): Promise<any[]> {
    const supabase = await this.getSupabase();
    let query = supabase
      .from('assignments')
      .select(
        `
        id,
        title,
        description,
        due_date,
        created_at,
        assignment_progress(student_id, score, completed_at, duration_seconds)
      `
      )
      .eq('teacher_id', teacherId)
      .gte('created_at', dateFilter.toISOString())
      .order('created_at', { ascending: false });

    if (classId) {
      query = query.eq('class_id', classId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }

    return data || [];
  }

  private async getGameSessionsData(
    teacherId: string,
    classId: string | undefined,
    dateFilter: Date
  ): Promise<any[]> {
    const supabase = await this.getSupabase();
    // Get student IDs first
    const students = await this.getStudentsForTeacher(teacherId, classId);
    const studentIds = students.map((s) => s.student_id);

    if (studentIds.length === 0) return [];

    const { data, error } = await supabase
      .from('enhanced_game_sessions')
      .select('*')
      .in('student_id', studentIds)
      .gte('created_at', dateFilter.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching game sessions:', error);
      return [];
    }

    return data || [];
  }

  private async getVocabularyData(
    teacherId: string,
    classId?: string
  ): Promise<any[]> {
    const supabase = await this.getSupabase();
    const students = await this.getStudentsForTeacher(teacherId, classId);
    const studentIds = students.map((s) => s.student_id);

    if (studentIds.length === 0) return [];

    const { data, error } = await supabase
      .from('student_vocabulary_progress')
      .select('*')
      .in('student_id', studentIds);

    if (error) {
      console.error('Error fetching vocabulary data:', error);
      return [];
    }

    return data || [];
  }

  private async getAssignmentResponsesData(
    teacherId: string,
    classId: string | undefined,
    dateFilter: Date
  ): Promise<any[]> {
    const supabase = await this.getSupabase();
    const assignments = await this.getAssignmentsData(
      teacherId,
      classId,
      dateFilter
    );
    const assignmentIds = assignments.map((a) => a.id);

    if (assignmentIds.length === 0) return [];

    const { data, error } = await supabase
      .from('assignment_responses')
      .select('*')
      .in('assignment_id', assignmentIds);

    if (error) {
      console.error('Error fetching assignment responses:', error);
      return [];
    }

    return data || [];
  }

  private async getStudentInfo(studentId: string): Promise<any> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('students')
      .select(
        `
        id,
        email,
        full_name,
        class_enrollments!inner(
          class_id,
          classes!inner(id, name)
        )
      `
      )
      .eq('id', studentId)
      .single();

    if (error) {
      console.error('Error fetching student info:', error);
      throw error;
    }

    return {
      studentId: data.id,
      studentName: data.full_name,
      email: data.email,
      classId: data.class_enrollments[0]?.class_id || null,
      className: data.class_enrollments[0]?.classes?.name || 'No Class',
      lastActive: new Date(),
    };
  }

  private async getStudentAssignmentProgress(
    studentId: string,
    dateFilter: Date
  ): Promise<any[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('assignment_progress')
      .select('*')
      .eq('student_id', studentId)
      .gte('completed_at', dateFilter.toISOString())
      .order('completed_at', { ascending: true });

    if (error) {
      console.error('Error fetching student assignment progress:', error);
      return [];
    }

    return data || [];
  }

  private async getStudentGameSessions(
    studentId: string,
    dateFilter: Date
  ): Promise<any[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('enhanced_game_sessions')
      .select('*')
      .eq('student_id', studentId)
      .gte('created_at', dateFilter.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching student game sessions:', error);
      return [];
    }

    return data || [];
  }

  private async getStudentVocabularyProgress(studentId: string): Promise<any[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('student_vocabulary_progress')
      .select('*')
      .eq('student_id', studentId);

    if (error) {
      console.error('Error fetching student vocabulary progress:', error);
      return [];
    }

    return data || [];
  }

  private async getStudentGrammarProgress(studentId: string): Promise<any[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('assignment_responses')
      .select(
        `
        *,
        assignment_questions!inner(skill_area, question_type)
      `
      )
      .eq('student_id', studentId);

    if (error) {
      console.error('Error fetching student grammar progress:', error);
      return [];
    }

    return data || [];
  }

  private async getClassAverages(
    classId: string | null,
    dateFilter: Date
  ): Promise<any> {
    const supabase = await this.getSupabase();
    if (!classId) {
      return {
        averageScore: 0,
        vocabularyAverages: {},
        grammarAverages: {},
      };
    }

    // Get all students in class
    const { data: enrollments } = await supabase
      .from('class_enrollments')
      .select('student_id')
      .eq('class_id', classId)
      .eq('status', 'active');

    const studentIds = (enrollments || []).map((e) => e.student_id);

    if (studentIds.length === 0) {
      return {
        averageScore: 0,
        vocabularyAverages: {},
        grammarAverages: {},
      };
    }

    // Get average score
    const { data: progressData } = await supabase
      .from('assignment_progress')
      .select('score')
      .in('student_id', studentIds)
      .gte('completed_at', dateFilter.toISOString());

    const scores = (progressData || []).map((p) => p.score);
    const averageScore =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;

    return {
      averageScore,
      vocabularyAverages: {},
      grammarAverages: {},
    };
  }

  private async getAssignmentInfo(assignmentId: string): Promise<any> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('assignments')
      .select(
        `
        id,
        title,
        description,
        due_date,
        created_at,
        assignment_progress(student_id, score, completed_at)
      `
      )
      .eq('id', assignmentId)
      .single();

    if (error) {
      console.error('Error fetching assignment info:', error);
      throw error;
    }

    const progress = data.assignment_progress || [];
    const completedCount = progress.filter((p: any) => p.completed_at).length;
    const scores = progress
      .filter((p: any) => p.completed_at)
      .map((p: any) => p.score);
    const averageScore =
      scores.length > 0
        ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
        : 0;

    return {
      assignmentId: data.id,
      assignmentName: data.title,
      description: data.description,
      completedCount,
      totalStudents: progress.length,
      averageScore,
      efficacy: this.calculateEfficacy(averageScore),
      dueDate: data.due_date ? new Date(data.due_date) : null,
      createdAt: new Date(data.created_at),
    };
  }

  private async getAssignmentResponses(assignmentId: string): Promise<any[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('assignment_responses')
      .select('*')
      .eq('assignment_id', assignmentId);

    if (error) {
      console.error('Error fetching assignment responses:', error);
      return [];
    }

    return data || [];
  }

  private async getAssignmentQuestions(assignmentId: string): Promise<any[]> {
    const supabase = await this.getSupabase();
    const { data, error } = await supabase
      .from('assignment_questions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('question_number', { ascending: true });

    if (error) {
      console.error('Error fetching assignment questions:', error);
      return [];
    }

    return data || [];
  }

  // =====================================================
  // HELPER METHODS - CALCULATIONS
  // =====================================================

  private calculateTopMetrics(assignmentsData: any[], studentsData: any[]): any {
    const allProgress = assignmentsData.flatMap(
      (a) => a.assignment_progress || []
    );
    const completedProgress = allProgress.filter((p) => p.completed_at);

    const scores = completedProgress.map((p) => p.score);
    const averageScore =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;

    const now = new Date();
    const overdueAssignments = assignmentsData.filter(
      (a) => a.due_date && new Date(a.due_date) < now
    );

    return {
      averageScore: Math.round(averageScore),
      assignmentsOverdue: overdueAssignments.length,
      currentStreak: 7, // TODO: Calculate actual streak
      trendPercentage: 5.2,
      trendDirection: 'up' as TrendDirection,
    };
  }

  private calculateUrgentInterventions(
    studentsData: any[],
    assignmentsData: any[],
    gameSessionsData: any[],
    vocabularyData: any[]
  ): any[] {
    const studentRisks = studentsData.map((student) => {
      const studentId = student.student_id;

      // Get student's assignment progress
      const studentProgress = assignmentsData.flatMap((a) =>
        (a.assignment_progress || []).filter(
          (p: any) => p.student_id === studentId
        )
      );

      const scores = studentProgress
        .filter((p) => p.completed_at)
        .map((p) => p.score);
      const averageScore =
        scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;

      // Get student's game sessions
      const studentSessions = gameSessionsData.filter(
        (s) => s.student_id === studentId
      );

      // Get student's vocabulary progress
      const studentVocab = vocabularyData.filter(
        (v) => v.student_id === studentId
      );

      // Calculate risk factors
      const riskFactors: string[] = [];
      let riskScore = 0;

      // 1. Low Accuracy (0.25 weight)
      if (averageScore < 60) {
        riskFactors.push(`Low average score (${Math.round(averageScore)}%)`);
        riskScore += 0.25;
      }

      // 2. Low Engagement (0.25 weight)
      const recentSessions = studentSessions.filter(
        (s) =>
          new Date(s.created_at) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      if (recentSessions.length < 3) {
        riskFactors.push('Low engagement (< 3 sessions/week)');
        riskScore += 0.25;
      }

      // 3. Declining Trend (0.2 weight)
      if (scores.length >= 3) {
        const recentScores = scores.slice(-3);
        const olderScores = scores.slice(0, -3);
        const recentAvg =
          recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
        const olderAvg =
          olderScores.length > 0
            ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length
            : recentAvg;

        if (recentAvg < olderAvg - 10) {
          riskFactors.push('Declining performance trend');
          riskScore += 0.2;
        }
      }

      // 4. Inactivity (0.2 weight)
      const lastSession =
        studentSessions.length > 0
          ? new Date(studentSessions[0].created_at)
          : null;
      const daysSinceActive = lastSession
        ? Math.floor(
            (Date.now() - lastSession.getTime()) / (24 * 60 * 60 * 1000)
          )
        : 999;

      if (daysSinceActive > 7) {
        riskFactors.push(`Inactive for ${daysSinceActive} days`);
        riskScore += 0.2;
      }

      // 5. Mastery Stagnation (0.1 weight)
      const vocabMasterSessions = studentSessions.filter(
        (s) => s.game_type === 'vocab_master'
      );
      const lastVocabSession =
        vocabMasterSessions.length > 0
          ? new Date(vocabMasterSessions[0].created_at)
          : null;
      const daysSinceVocabProgress = lastVocabSession
        ? Math.floor(
            (Date.now() - lastVocabSession.getTime()) / (24 * 60 * 60 * 1000)
          )
        : 999;

      if (daysSinceVocabProgress > 7 && daysSinceActive < 7) {
        riskFactors.push('No VocabMaster progress for 7+ days');
        riskScore += 0.1;
      }

      return {
        studentId,
        studentName: student.students?.full_name || 'Unknown',
        riskLevel: this.getRiskLevel(riskScore),
        riskScore,
        averageScore: Math.round(averageScore),
        lastActive: lastSession || new Date(),
        riskFactors,
      };
    });

    // Sort by risk score and return top 5
    return studentRisks
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .filter((s) => s.riskScore > 0.3); // Only show if risk > 0.3
  }

  private calculateTopClassWeakness(
    responsesData: any[],
    totalStudents: number,
    assignmentsData: any[]
  ): any | null {
    // Group responses by skill area
    const skillMap = new Map<string, { correct: number; total: number; recent: number }>();

    responsesData.forEach((response) => {
      const skill = response.skill_area || 'General';
      if (!skillMap.has(skill)) {
        skillMap.set(skill, { correct: 0, total: 0, recent: 0 });
      }

      const stats = skillMap.get(skill)!;
      stats.total++;
      if (response.is_correct) {
        stats.correct++;
      }

      // Check if this is from a recent assignment (last 5)
      const recentAssignmentIds = assignmentsData
        .slice(0, 5)
        .map((a) => a.id);
      if (recentAssignmentIds.includes(response.assignment_id)) {
        stats.recent++;
      }
    });

    // Find skill with highest failure rate that meets criteria
    let topWeakness: any = null;
    let highestFailureRate = 0;

    skillMap.forEach((stats, skillName) => {
      const failureRate = 1 - stats.correct / stats.total;
      const studentsAffected = Math.ceil((stats.total / totalStudents) * 100);

      // Criteria: >50% failure rate, appeared in 3+ recent assignments
      if (failureRate > 0.5 && stats.recent >= 3 && failureRate > highestFailureRate) {
        highestFailureRate = failureRate;
        topWeakness = {
          skillName,
          skillType: 'grammar' as const,
          studentsAffected,
          totalStudents,
          failureRate: Math.round(failureRate * 100),
          commonError: 'Multiple errors detected',
          recentOccurrences: stats.recent,
        };
      }
    });

    return topWeakness;
  }

  private calculateRecentAssignments(
    assignmentsData: any[],
    totalStudents: number
  ): any[] {
    return assignmentsData.slice(0, 10).map((assignment) => {
      const progress = assignment.assignment_progress || [];
      const completedProgress = progress.filter((p: any) => p.completed_at);
      const scores = completedProgress.map((p: any) => p.score);
      const averageScore =
        scores.length > 0
          ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length
          : 0;

      const now = new Date();
      const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
      const isOverdue = dueDate && dueDate < now;
      const isComplete = completedProgress.length === progress.length;

      return {
        assignmentId: assignment.id,
        assignmentName: assignment.title,
        averageScore: Math.round(averageScore),
        efficacy: this.calculateEfficacy(averageScore),
        status: isOverdue
          ? ('overdue' as const)
          : isComplete
          ? ('complete' as const)
          : ('in-progress' as const),
        completedCount: completedProgress.length,
        totalStudents: progress.length,
        dueDate,
      };
    });
  }

  private calculatePerformanceTrend(
    assignmentProgress: any[],
    classAverage: number
  ): any {
    // Group by week
    const weeklyScores: any[] = [];
    const now = new Date();

    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);

      const weekProgress = assignmentProgress.filter((p) => {
        const date = new Date(p.completed_at);
        return date >= weekStart && date < weekEnd;
      });

      const scores = weekProgress.map((p) => p.score);
      const avgScore =
        scores.length > 0
          ? scores.reduce((a, b) => a + b, 0) / scores.length
          : 0;

      weeklyScores.unshift({
        week: `Week ${8 - i}`,
        score: Math.round(avgScore),
        date: weekStart,
      });
    }

    // Calculate trend
    const recentScores = weeklyScores.slice(-3).map((w) => w.score);
    const olderScores = weeklyScores.slice(0, -3).map((w) => w.score);
    const recentAvg =
      recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg =
      olderScores.length > 0
        ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length
        : recentAvg;

    const trendPercentage = Math.abs(
      ((recentAvg - olderAvg) / olderAvg) * 100
    );
    const trendDirection: TrendDirection =
      recentAvg > olderAvg + 5
        ? 'up'
        : recentAvg < olderAvg - 5
        ? 'down'
        : 'stable';

    return {
      weeklyScores,
      classAverage,
      trendDirection,
      trendPercentage: Math.round(trendPercentage),
    };
  }

  private calculateVocabularyMastery(
    vocabularyProgress: any[],
    classAverages: any
  ): any[] {
    // Group by category
    const categoryMap = new Map<string, { correct: number; total: number }>();

    vocabularyProgress.forEach((item) => {
      const category = item.category || 'General';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { correct: 0, total: 0 });
      }

      const stats = categoryMap.get(category)!;
      stats.total++;
      if (item.mastery_level >= 3) {
        stats.correct++;
      }
    });

    const result: any[] = [];
    categoryMap.forEach((stats, category) => {
      const percentage = Math.round((stats.correct / stats.total) * 100);
      const classAvg = classAverages[category] || 75;

      result.push({
        category,
        percentage,
        current: stats.correct,
        total: stats.total,
        classAverage: classAvg,
        riskLevel: this.getRiskLevel(1 - percentage / 100),
      });
    });

    return result;
  }

  private calculateGrammarMastery(
    grammarProgress: any[],
    classAverages: any
  ): any[] {
    // Group by skill area
    const skillMap = new Map<string, { correct: number; total: number }>();

    grammarProgress.forEach((response) => {
      const skill = response.assignment_questions?.skill_area || 'General';
      if (!skillMap.has(skill)) {
        skillMap.set(skill, { correct: 0, total: 0 });
      }

      const stats = skillMap.get(skill)!;
      stats.total++;
      if (response.is_correct) {
        stats.correct++;
      }
    });

    const result: any[] = [];
    skillMap.forEach((stats, skillName) => {
      const percentage = Math.round((stats.correct / stats.total) * 100);
      const classAvg = classAverages[skillName] || 75;

      result.push({
        skillName,
        percentage,
        correct: stats.correct,
        total: stats.total,
        classAverage: classAvg,
        riskLevel: this.getRiskLevel(1 - percentage / 100),
      });
    });

    return result;
  }

  private calculateWeakSkills(
    assignmentProgress: any[],
    vocabularyProgress: any[],
    grammarProgress: any[]
  ): any {
    // Find grammar weaknesses
    const grammarMap = new Map<string, { errors: number; total: number; examples: string[] }>();

    grammarProgress.forEach((response) => {
      const skill = response.assignment_questions?.skill_area || 'General';
      if (!grammarMap.has(skill)) {
        grammarMap.set(skill, { errors: 0, total: 0, examples: [] });
      }

      const stats = grammarMap.get(skill)!;
      stats.total++;
      if (!response.is_correct) {
        stats.errors++;
        if (stats.examples.length < 3) {
          stats.examples.push(response.student_answer || 'No answer');
        }
      }
    });

    const grammar: any[] = [];
    grammarMap.forEach((stats, skillName) => {
      if (stats.errors / stats.total > 0.4) {
        // >40% error rate
        grammar.push({
          skillName,
          errorCount: stats.errors,
          totalAttempts: stats.total,
          examples: stats.examples,
        });
      }
    });

    // Find vocabulary weaknesses
    const vocabulary: any[] = vocabularyProgress
      .filter((item) => item.mastery_level < 2)
      .slice(0, 10)
      .map((item) => ({
        word: item.word || 'Unknown',
        translation: item.translation || '',
        correctCount: item.correct_count || 0,
        totalAttempts: item.total_attempts || 1,
        accuracy: Math.round(
          ((item.correct_count || 0) / (item.total_attempts || 1)) * 100
        ),
      }));

    return { grammar, vocabulary };
  }

  private calculateEngagementLog(
    gameSessionsData: any[],
    vocabularyProgress: any[]
  ): any {
    const totalSeconds = gameSessionsData.reduce(
      (sum, session) => sum + (session.duration_seconds || 0),
      0
    );

    const loginDays = new Set(
      gameSessionsData.map((s) =>
        new Date(s.created_at).toISOString().split('T')[0]
      )
    ).size;

    // Check mastery stagnation
    const vocabMasterSessions = gameSessionsData.filter(
      (s) => s.game_type === 'vocab_master'
    );
    const lastVocabSession =
      vocabMasterSessions.length > 0
        ? new Date(vocabMasterSessions[0].created_at)
        : null;
    const daysSinceLastProgress = lastVocabSession
      ? Math.floor(
          (Date.now() - lastVocabSession.getTime()) / (24 * 60 * 60 * 1000)
        )
      : 999;

    // Daily activity for last 14 days
    const dailyActivity: any[] = [];
    for (let i = 0; i < 14; i++) {
      const day = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayStr = day.toISOString().split('T')[0];
      const daySessions = gameSessionsData.filter(
        (s) => new Date(s.created_at).toISOString().split('T')[0] === dayStr
      );

      dailyActivity.unshift({
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        date: day,
        active: daySessions.length > 0,
        minutesSpent: Math.round(
          daySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) /
            60
        ),
      });
    }

    return {
      timeOnTask: totalSeconds,
      loginFrequency: loginDays,
      gamesPlayed: gameSessionsData.length,
      dailyActivity,
      masteryStagnation: daysSinceLastProgress > 7,
      daysSinceLastProgress,
    };
  }

  private calculateQuestionBreakdown(
    questions: any[],
    responses: any[]
  ): any[] {
    return questions.map((question, index) => {
      const questionResponses = responses.filter(
        (r) => r.question_id === question.id
      );

      const correctCount = questionResponses.filter((r) => r.is_correct).length;
      const totalAttempts = questionResponses.length;
      const accuracy =
        totalAttempts > 0 ? (correctCount / totalAttempts) * 100 : 0;

      return {
        questionId: question.id,
        questionNumber: index + 1,
        questionPreview:
          question.question_text?.substring(0, 100) || 'Question',
        questionType: question.question_type || 'multiple_choice',
        skillArea: question.skill_area,
        accuracy: Math.round(accuracy),
        correctCount,
        totalAttempts,
        riskLevel: this.getRiskLevel(1 - accuracy / 100),
      };
    });
  }

  private calculateDistractorAnalysis(
    questions: any[],
    responses: any[]
  ): any[] {
    const multipleChoiceQuestions = questions.filter(
      (q) => q.question_type === 'multiple_choice' && q.options
    );

    return multipleChoiceQuestions.map((question) => {
      const questionResponses = responses.filter(
        (r) => r.question_id === question.id
      );

      const options = question.options || [];
      const answerCounts = new Map<string, number>();

      questionResponses.forEach((response) => {
        const answer = response.student_answer || '';
        answerCounts.set(answer, (answerCounts.get(answer) || 0) + 1);
      });

      const distractors = options.map((option: string) => ({
        answer: option,
        percentage: Math.round(
          ((answerCounts.get(option) || 0) / questionResponses.length) * 100
        ),
        count: answerCounts.get(option) || 0,
        isCorrect: option === question.correct_answer,
      }));

      // Find most common wrong answer
      const wrongAnswers = distractors.filter((d) => !d.isCorrect);
      const mostCommonWrong = wrongAnswers.sort(
        (a, b) => b.count - a.count
      )[0];

      return {
        questionId: question.id,
        questionText: question.question_text || '',
        correctAnswer: question.correct_answer || '',
        distractors,
        insight:
          mostCommonWrong && mostCommonWrong.percentage > 30
            ? `${mostCommonWrong.percentage}% chose "${mostCommonWrong.answer}" - possible misconception`
            : 'No clear pattern detected',
        misconceptionDetected: mostCommonWrong
          ? mostCommonWrong.percentage > 30
          : false,
      };
    });
  }

  private calculateTimeDistribution(responses: any[]): any {
    const times = responses
      .map((r) => r.duration_seconds || 0)
      .filter((t) => t > 0)
      .sort((a, b) => a - b);

    if (times.length === 0) {
      return {
        median: 0,
        min: 0,
        max: 0,
        average: 0,
        buckets: [],
        wideDistribution: false,
      };
    }

    const median = times[Math.floor(times.length / 2)];
    const min = times[0];
    const max = times[times.length - 1];
    const average = times.reduce((a, b) => a + b, 0) / times.length;

    // Create buckets (5-minute intervals)
    const buckets: any[] = [];
    const maxMinutes = Math.ceil(max / 60);

    for (let i = 0; i < maxMinutes; i += 5) {
      const minMinutes = i;
      const maxMinutes = i + 5;
      const count = times.filter(
        (t) => t >= minMinutes * 60 && t < maxMinutes * 60
      ).length;

      buckets.push({
        range: `${minMinutes}-${maxMinutes} min`,
        minMinutes,
        maxMinutes,
        count,
      });
    }

    return {
      median: Math.round(median / 60),
      min: Math.round(min / 60),
      max: Math.round(max / 60),
      average: Math.round(average / 60),
      buckets,
      wideDistribution: max - min > 20 * 60, // > 20 minutes range
    };
  }

  private getRiskLevel(riskScore: number): RiskLevel {
    if (riskScore >= 0.7) return 'critical';
    if (riskScore >= 0.5) return 'high';
    if (riskScore >= 0.3) return 'medium';
    return 'low';
  }

  private calculateEfficacy(averageScore: number): EfficacyLevel {
    if (averageScore >= 75) return 'high';
    if (averageScore >= 60) return 'medium';
    return 'low';
  }
}

export const teacherAnalyticsService = new TeacherAnalyticsService();


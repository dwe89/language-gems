import { SupabaseClient } from '@supabase/supabase-js';

export interface AssignmentOverviewMetrics {
  assignmentId: string;
  assignmentTitle: string;
  className: string;
  totalStudents: number;
  completedStudents: number;
  inProgressStudents: number;
  notStartedStudents: number;
  completionRate: number;
  averageTimeMinutes: number;
  expectedTimeMinutes: number;
  classSuccessScore: number; // (strong + weak retrieval) / total attempts
  studentsNeedingHelp: number;
}

export interface StudentProgress {
  studentId: string;
  studentName: string;
  status: 'completed' | 'in_progress' | 'not_started';
  timeSpentMinutes: number;
  successScore: number;
  weakRetrievalPercent: number;
  failureRate: number;
  keyStruggleWords: string[];
  interventionFlag?: 'high_failure' | 'unusually_long' | 'stopped_midway' | null;
  lastAttempt: string | null;
}

export interface WordDifficulty {
  rank: number;
  wordText: string;
  translationText: string;
  totalAttempts: number;
  failureCount: number;
  failureRate: number;
  strongRetrievalCount: number; // rare, epic, legendary
  weakRetrievalCount: number; // uncommon, common
  actionableInsight: string;
  insightLevel: 'success' | 'monitor' | 'review' | 'problem';
}

export interface StudentWordStruggle {
  studentId: string;
  studentName: string;
  exposures: number;
  correct: number;
  incorrect: number;
  failureRate: number;
  lastAttempt: string;
  recommendedIntervention: string;
}

export class TeacherAssignmentAnalyticsService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Get assignment overview metrics for the triage zone
   */
  async getAssignmentOverview(assignmentId: string): Promise<AssignmentOverviewMetrics> {
    console.log('📊 [ASSIGNMENT ANALYTICS] Getting overview for:', assignmentId);
    console.log('📊 [ASSIGNMENT ANALYTICS] Supabase client:', !!this.supabase);

    try {
      // Get assignment details
      const { data: assignment, error: assignmentError } = await this.supabase
        .from('assignments')
        .select('id, title, class_id')
        .eq('id', assignmentId)
        .single();

      if (assignmentError) {
        console.error('❌ Error fetching assignment:', assignmentError);
        throw assignmentError;
      }

      if (!assignment) {
        console.error('❌ No assignment found for ID:', assignmentId);
        throw new Error('Assignment not found');
      }

      console.log('📋 Assignment data:', assignment);

      if (!assignment.class_id) {
        console.error('❌ Assignment has no class_id:', assignment);
        throw new Error('Assignment has no class_id');
      }

      // Get class name separately
      const { data: classData } = await this.supabase
        .from('classes')
        .select('name')
        .eq('id', assignment.class_id)
        .single();

      const className = classData?.name || 'Unknown Class';

      // Get class enrollment count
      const { data: enrollments, error: enrollmentError } = await this.supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', (assignment as any).class_id)
        .eq('status', 'active');

      if (enrollmentError) throw enrollmentError;

      const totalStudents = enrollments?.length || 0;

      // Get game sessions to determine actual student activity
      const { data: sessions } = await this.supabase
        .from('enhanced_game_sessions')
        .select('id, student_id, duration_seconds, ended_at, completion_status')
        .eq('assignment_id', assignmentId);

      console.log('📊 Sessions found:', sessions?.length);

      // Calculate completion from actual sessions (not from enhanced_assignment_progress which may be stale)
      const studentsWithSessions = new Set(sessions?.map(s => s.student_id) || []);
      const completedSessions = sessions?.filter(s => s.completion_status === 'completed' || s.ended_at) || [];
      const studentsCompleted = new Set(completedSessions.map(s => s.student_id));

      const completedStudents = studentsCompleted.size;
      const inProgressStudents = studentsWithSessions.size - studentsCompleted.size;
      const notStartedStudents = totalStudents - studentsWithSessions.size;

      console.log('📊 Completion stats:', { completedStudents, inProgressStudents, notStartedStudents });

      // Calculate average time from sessions
      const averageTimeSeconds = completedSessions.length > 0
        ? completedSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / completedSessions.length
        : 0;

      // Get class success score from gem_events
      const sessionIds = sessions?.map(s => s.id) || [];

      let classSuccessScore = 0;
      let studentsNeedingHelp = 0;

      if (sessionIds.length > 0) {
        const gemData = await this.fetchGemEvents<{
          session_id: string;
          gem_rarity: string;
          student_id: string;
        }>(sessionIds, 'session_id, gem_rarity, student_id');

        console.log('📊 Gem events found:', gemData.length);

        const totalGems = gemData.length;
        const strongWeakGems = gemData.filter(g =>
          ['uncommon', 'rare', 'epic', 'legendary'].includes(g.gem_rarity)
        ).length;
        classSuccessScore = totalGems > 0 ? Math.round((strongWeakGems / totalGems) * 100) : 0;

        console.log('📊 Success score:', classSuccessScore, '% (', strongWeakGems, '/', totalGems, ')');

        // Count students with high failure rate
        const studentFailureRates = new Map<string, { total: number; failures: number }>();
        gemData.forEach(gem => {
          if (!gem.student_id) return;
          const current = studentFailureRates.get(gem.student_id) || { total: 0, failures: 0 };
          current.total++;
          if (gem.gem_rarity === 'common') current.failures++;
          studentFailureRates.set(gem.student_id, current);
        });

        studentsNeedingHelp = Array.from(studentFailureRates.values())
          .filter(stats => stats.total > 0 && (stats.failures / stats.total) > 0.3)
          .length;

        console.log('📊 Students needing help:', studentsNeedingHelp);
      }

      return {
        assignmentId,
        assignmentTitle: assignment.title,
        className,
        totalStudents,
        completedStudents,
        inProgressStudents,
        notStartedStudents,
        completionRate: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0,
        averageTimeMinutes: Math.round(averageTimeSeconds / 60),
        expectedTimeMinutes: 30, // TODO: Get from assignment config
        classSuccessScore,
        studentsNeedingHelp
      };
    } catch (error: any) {
      console.error('❌ Error getting assignment overview:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error code:', error?.code);
      console.error('❌ Error details:', error?.details);
      console.error('❌ Error hint:', error?.hint);
      throw error;
    }
  }

  /**
   * Get word difficulty ranking for the lesson planner
   */
  async getWordDifficultyRanking(assignmentId: string): Promise<WordDifficulty[]> {
    console.log('📚 [WORD DIFFICULTY] Getting ranking for:', assignmentId);

    try {
      // Use manual query directly (no RPC)
      return this.getWordDifficultyManual(assignmentId);
    } catch (error) {
      console.error('Error getting word difficulty:', error);
      return [];
    }
  }

  /**
   * Manual fallback for word difficulty ranking
   * Uses two-tier system: High Confidence (≥5 attempts) and Emerging Problems (<5 attempts)
   */
  private async getWordDifficultyManual(assignmentId: string): Promise<WordDifficulty[]> {
    // Get all gem events for this assignment
    const { data: sessions } = await this.supabase
      .from('enhanced_game_sessions')
      .select('id')
      .eq('assignment_id', assignmentId);

    const sessionIds = sessions?.map(s => s.id) || [];

    if (sessionIds.length === 0) return [];

    const gemEvents = await this.fetchGemEvents<{
      session_id: string;
      centralized_vocabulary_id: string | null;
      gem_rarity: string;
      word_text: string | null;
      translation_text: string | null;
    }>(
      sessionIds,
      'session_id, centralized_vocabulary_id, gem_rarity, word_text, translation_text'
    );

    // Group by vocabulary
    const wordMap = new Map<string, {
      wordText: string;
      translationText: string;
      total: number;
      failures: number;
      strongRetrieval: number;
      weakRetrieval: number;
    }>();

    gemEvents?.forEach(gem => {
      if (!gem.centralized_vocabulary_id) return;

      const key = gem.centralized_vocabulary_id;
      const current = wordMap.get(key) || {
        wordText: gem.word_text || '',
        translationText: gem.translation_text || '',
        total: 0,
        failures: 0,
        strongRetrieval: 0,
        weakRetrieval: 0
      };

      current.total++;
      if (gem.gem_rarity === 'common') current.failures++;
      if (['rare', 'epic', 'legendary'].includes(gem.gem_rarity)) current.strongRetrieval++;
      if (['uncommon', 'common'].includes(gem.gem_rarity)) current.weakRetrieval++;

      wordMap.set(key, current);
    });

    // Convert to array with failure rates
    const words = Array.from(wordMap.values())
      .map(word => ({
        ...word,
        failureRate: word.total > 0 ? Math.round((word.failures / word.total) * 100) : 0
      }));

    // TIER 1: High Confidence Problems (≥5 attempts)
    // Sort by: Failure Rate DESC, then Attempts DESC (tie-breaker)
    const highConfidence = words
      .filter(w => w.total >= 5)
      .sort((a, b) => {
        if (b.failureRate !== a.failureRate) {
          return b.failureRate - a.failureRate; // Primary: failure rate
        }
        return b.total - a.total; // Tie-breaker: more attempts = higher priority
      });

    // TIER 2: Emerging Problems (<5 attempts AND ≥50% failure rate)
    // Sort by: Attempts DESC, then Failure Rate DESC
    const emergingProblems = words
      .filter(w => w.total < 5 && w.failureRate >= 50)
      .sort((a, b) => {
        if (b.total !== a.total) {
          return b.total - a.total; // Primary: more attempts = more reliable
        }
        return b.failureRate - a.failureRate; // Tie-breaker: failure rate
      });

    // TIER 3: Low Priority (everything else)
    const lowPriority = words
      .filter(w => w.total < 5 && w.failureRate < 50)
      .sort((a, b) => b.failureRate - a.failureRate);

    // Combine all tiers in order
    const sortedWords = [...highConfidence, ...emergingProblems, ...lowPriority];

    return sortedWords.map((word, index) => ({
      rank: index + 1,
      wordText: word.wordText,
      translationText: word.translationText,
      totalAttempts: word.total,
      failureCount: word.failures,
      failureRate: word.failureRate,
      strongRetrievalCount: word.strongRetrieval,
      weakRetrievalCount: word.weakRetrieval,
      actionableInsight: this.getActionableInsight(word.failureRate, word.total),
      insightLevel: this.getInsightLevel(word.failureRate, word.total)
    }));
  }

  private getActionableInsight(failureRate: number, attempts: number): string {
    // Tier 1: High Confidence (≥5 attempts)
    if (attempts >= 5) {
      if (failureRate >= 70) return '🛑 Major Class Problem. Requires full lesson.';
      if (failureRate >= 50) return '⚠️ Significant Issue. Plan intervention.';
      if (failureRate >= 30) return '📊 Monitor Closely. Review if needed.';
      return '✅ Class Performing Well.';
    }

    // Tier 2: Emerging Problems (<5 attempts, ≥50% failure)
    if (failureRate >= 50) {
      return `⚠️ Emerging Problem (${attempts} attempt${attempts === 1 ? '' : 's'}). Limited data.`;
    }

    // Tier 3: Low Priority
    return `📋 Insufficient Data (${attempts} attempt${attempts === 1 ? '' : 's'}).`;
  }

  private async fetchGemEvents<T extends Record<string, any>>(
    sessionIds: string[],
    selectColumns: string,
    chunkSize = 50
  ): Promise<T[]> {
    if (sessionIds.length === 0) return [];

    const results: T[] = [];

    for (let i = 0; i < sessionIds.length; i += chunkSize) {
      const chunk = sessionIds.slice(i, i + chunkSize);
      const { data, error } = await this.supabase
        .from('gem_events')
        .select(selectColumns)
        .in('session_id', chunk);

      if (error) {
        console.error('❌ Error fetching gem events chunk:', error);
        throw error;
      }

      if (data && Array.isArray(data)) {
        results.push(...(data as unknown as T[]));
      }
    }

    return results;
  }

  private getInsightLevel(failureRate: number, attempts: number): 'success' | 'monitor' | 'review' | 'problem' {
    // Tier 1: High Confidence (≥5 attempts)
    if (attempts >= 5) {
      if (failureRate >= 70) return 'problem';
      if (failureRate >= 50) return 'review';
      if (failureRate >= 30) return 'monitor';
      return 'success';
    }

    // Tier 2: Emerging Problems (<5 attempts, ≥50% failure)
    if (failureRate >= 50) return 'review';

    // Tier 3: Low Priority
    return 'monitor';
  }

  /**
   * Get student roster with intervention flags
   */
  async getStudentRoster(assignmentId: string): Promise<StudentProgress[]> {
    console.log('👥 [STUDENT ROSTER] Getting roster for:', assignmentId);

    try {
      // Get assignment class
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('class_id')
        .eq('id', assignmentId)
        .single();

      if (!assignment) return [];

      // Get all students in class
      const { data: enrollments, error: enrollmentError } = await this.supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', (assignment as any).class_id)
        .eq('status', 'active');

      if (enrollmentError) {
        console.error('Error fetching enrollments:', enrollmentError);
        return [];
      }

      if (!enrollments || enrollments.length === 0) {
        console.log('No enrollments found for class');
        return [];
      }

      // Get student names
      const studentIds = enrollments.map(e => e.student_id);
      const { data: profiles } = await this.supabase
        .from('user_profiles')
        .select('user_id, display_name')
        .in('user_id', studentIds);

      const nameMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);

      // Get progress for each student
      const studentProgress: StudentProgress[] = [];

      for (const enrollment of enrollments) {
        const studentId = enrollment.student_id;
        const studentName = nameMap.get(studentId) || 'Unknown';

        // Get game sessions for this student to determine status
        const { data: studentSessions } = await this.supabase
          .from('enhanced_game_sessions')
          .select('id, duration_seconds, ended_at, completion_status')
          .eq('assignment_id', assignmentId)
          .eq('student_id', studentId);

        // Determine status from actual sessions
        let status: 'completed' | 'in_progress' | 'not_started' = 'not_started';
        let timeSpentMinutes = 0;

        if (studentSessions && studentSessions.length > 0) {
          const hasCompleted = studentSessions.some(s => s.completion_status === 'completed' || s.ended_at);
          status = hasCompleted ? 'completed' : 'in_progress';
          timeSpentMinutes = Math.round(
            studentSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60
          );
        }

        // Get gem events for this student's sessions
        const studentSessionIds = studentSessions?.map(s => s.id) || [];

        let successScore = 0;
        let weakRetrievalPercent = 0;
        let failureRate = 0;
        let keyStruggleWords: string[] = [];
        let lastAttempt: string | null = null;

        if (studentSessionIds.length > 0) {
          const gems = await this.fetchGemEvents<{
            session_id: string;
            gem_rarity: string;
            word_text: string | null;
            created_at: string;
          }>(studentSessionIds, 'session_id, gem_rarity, word_text, created_at');

          if (gems.length > 0) {
            gems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            const total = gems.length;
            const strongWeak = gems.filter(g => ['uncommon', 'rare', 'epic', 'legendary'].includes(g.gem_rarity)).length;
            const weak = gems.filter(g => ['uncommon', 'common'].includes(g.gem_rarity)).length;
            const failures = gems.filter(g => g.gem_rarity === 'common').length;

            successScore = Math.round((strongWeak / total) * 100);
            weakRetrievalPercent = Math.round((weak / total) * 100);
            failureRate = Math.round((failures / total) * 100);
            lastAttempt = gems[0].created_at;

            // Get struggle words (words with high failure rate)
            const wordFailures = new Map<string, { total: number; failures: number }>();
            gems.forEach(gem => {
              if (!gem.word_text) return;
              const current = wordFailures.get(gem.word_text) || { total: 0, failures: 0 };
              current.total++;
              if (gem.gem_rarity === 'common') current.failures++;
              wordFailures.set(gem.word_text, current);
            });

            keyStruggleWords = Array.from(wordFailures.entries())
              .filter(([_, stats]) => stats.total >= 2 && (stats.failures / stats.total) > 0.5)
              .sort((a, b) => (b[1].failures / b[1].total) - (a[1].failures / a[1].total))
              .slice(0, 3)
              .map(([word]) => word);
          }
        }

        // Determine intervention flag
        let interventionFlag: StudentProgress['interventionFlag'] = null;
        if (failureRate > 30) {
          interventionFlag = 'high_failure';
        } else if (status === 'in_progress' && timeSpentMinutes > 60) {
          interventionFlag = 'unusually_long';
        } else if (status === 'in_progress' && timeSpentMinutes > 10 && !lastAttempt) {
          interventionFlag = 'stopped_midway';
        }

        studentProgress.push({
          studentId,
          studentName,
          status: status as any,
          timeSpentMinutes,
          successScore,
          weakRetrievalPercent,
          failureRate,
          keyStruggleWords,
          interventionFlag,
          lastAttempt
        });
      }

      // Sort by failure rate (highest first) to prioritize intervention
      return studentProgress.sort((a, b) => b.failureRate - a.failureRate);
    } catch (error) {
      console.error('Error getting student roster:', error);
      return [];
    }
  }

  /**
   * Get students struggling with a specific word
   */
  async getStudentWordStruggles(
    assignmentId: string,
    vocabularyId: string
  ): Promise<StudentWordStruggle[]> {
    console.log('🔍 [WORD STRUGGLES] Getting struggles for word:', vocabularyId);

    try {
      const { data: sessions } = await this.supabase
        .from('enhanced_game_sessions')
        .select('id, student_id')
        .eq('assignment_id', assignmentId);

      if (!sessions) return [];

      const sessionIds = sessions.map(s => s.id);

      const { data: gems } = await this.supabase
        .from('gem_events')
        .select('student_id, gem_rarity, created_at')
        .in('session_id', sessionIds)
        .eq('centralized_vocabulary_id', vocabularyId);

      if (!gems) return [];

      // Group by student
      const studentMap = new Map<string, { correct: number; incorrect: number; lastAttempt: string }>();
      gems.forEach(gem => {
        const current = studentMap.get(gem.student_id) || { correct: 0, incorrect: 0, lastAttempt: gem.created_at };
        if (['uncommon', 'rare', 'epic', 'legendary'].includes(gem.gem_rarity)) {
          current.correct++;
        } else {
          current.incorrect++;
        }
        if (new Date(gem.created_at) > new Date(current.lastAttempt)) {
          current.lastAttempt = gem.created_at;
        }
        studentMap.set(gem.student_id, current);
      });

      // Get student names
      const studentIds = Array.from(studentMap.keys());
      const { data: profiles } = await this.supabase
        .from('user_profiles')
        .select('user_id, display_name')
        .in('user_id', studentIds);

      const nameMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);

      // Build result
      const struggles: StudentWordStruggle[] = Array.from(studentMap.entries())
        .map(([studentId, stats]) => {
          const exposures = stats.correct + stats.incorrect;
          const failureRate = Math.round((stats.incorrect / exposures) * 100);

          return {
            studentId,
            studentName: nameMap.get(studentId) || 'Unknown',
            exposures,
            correct: stats.correct,
            incorrect: stats.incorrect,
            failureRate,
            lastAttempt: stats.lastAttempt,
            recommendedIntervention: this.getRecommendedIntervention(failureRate)
          };
        })
        .sort((a, b) => b.failureRate - a.failureRate);

      return struggles;
    } catch (error) {
      console.error('Error getting student word struggles:', error);
      return [];
    }
  }

  private getRecommendedIntervention(failureRate: number): string {
    if (failureRate > 60) return 'Individual re-assignment of this word only';
    if (failureRate > 40) return 'Small group work on this concept';
    return 'Monitor progress';
  }
}


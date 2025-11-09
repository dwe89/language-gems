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
        .select('id, title, class_id, game_type, game_config')
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
      // Add cache-busting by using a timestamp filter that's always true
      // This forces PostgREST to bypass cache and fetch fresh data
      
      console.log('🔍 [DEBUG] Fetching sessions for assignment:', assignmentId);
      console.log('🔍 [DEBUG] Is assessment type:', assignment?.game_type === 'assessment');
      
      let { data: sessions, error: sessionError } = await this.supabase
        .from('enhanced_game_sessions')
        .select('id, student_id, duration_seconds, started_at, ended_at, completion_status, accuracy_percentage')
        .eq('assignment_id', assignmentId);

      console.log('🔍 [DEBUG] Sessions query result - error:', sessionError);
      console.log('🔍 [DEBUG] Sessions found:', sessions?.length);
      console.log('🔍 [DEBUG] First few sessions:', JSON.stringify(sessions?.slice(0, 3), null, 2));

      if (sessionError) {
        console.error('❌ Error fetching sessions:', sessionError);
        throw sessionError;
      }

      // 🎯 FALLBACK: For assessment-type assignments, also check reading_comprehension_results
      // if sessions are empty (in case sessions weren't created properly)
      const isAssessmentType = assignment?.game_type === 'assessment' ||
                               assignment?.game_config?.assessmentConfig;

      if (isAssessmentType && (!sessions || sessions.length === 0)) {
        console.log('📊 [ASSESSMENT FALLBACK] No sessions found, checking reading_comprehension_results');
        
        const { data: results, error: resultsError } = await this.supabase
          .from('reading_comprehension_results')
          .select('id, student_id, user_id, score_percentage, score, time_spent_seconds, time_spent, completed_at, submitted_at')
          .eq('assignment_id', assignmentId);

        if (!resultsError && results && results.length > 0) {
          console.log('📊 [ASSESSMENT FALLBACK] Found', results.length, 'results, using those instead');
          
          // Map results to session-like structure
          const mappedSessions = results.map(r => ({
            id: r.id ? `result-${r.id}` : `result-${r.student_id || r.user_id}`,
            student_id: r.student_id || r.user_id,
            duration_seconds: (r.time_spent_seconds ?? r.time_spent) || 0,
            started_at: r.completed_at || r.submitted_at,
            ended_at: r.completed_at || r.submitted_at,
            completion_status: 'completed' as const,
            accuracy_percentage: (r.score_percentage ?? r.score) || 0
          }));

          // Use mapped results as sessions
          sessions = mappedSessions as any;
          console.log('📊 [ASSESSMENT FALLBACK] Converted to sessions:', sessions?.length || 0);
        }
      }

      // Calculate completion from actual sessions (not from enhanced_assignment_progress which may be stale)
      const studentsWithSessions = new Set(sessions?.map(s => s.student_id) || []);
      const completedSessions = sessions?.filter(s => s.completion_status === 'completed' || s.ended_at) || [];
      console.log('🔍 [DEBUG] Completed sessions count:', completedSessions.length);
      console.log('🔍 [DEBUG] Completed sessions:', JSON.stringify(completedSessions.slice(0, 2), null, 2));
      
      const studentsCompleted = new Set(completedSessions.map(s => s.student_id));

      const completedStudents = studentsCompleted.size;
      const inProgressStudents = studentsWithSessions.size - studentsCompleted.size;
      const notStartedStudents = totalStudents - studentsWithSessions.size;

      console.log('📊 Completion stats:', { completedStudents, inProgressStudents, notStartedStudents });

      // Calculate average time PER STUDENT (not per session)
      // Group sessions by student and sum their time
      const studentTimeMap = new Map<string, number>();

      completedSessions.forEach(s => {
        const sessionData = s as any;
        let sessionSeconds = 0;

        // If duration_seconds is available and non-zero, use it
        if (sessionData.duration_seconds && sessionData.duration_seconds > 0) {
          sessionSeconds = sessionData.duration_seconds;
        }
        // Otherwise, calculate from timestamps if both are available
        else if (sessionData.started_at && sessionData.ended_at) {
          const startTime = new Date(sessionData.started_at).getTime();
          const endTime = new Date(sessionData.ended_at).getTime();
          sessionSeconds = Math.round((endTime - startTime) / 1000);
        }

        // Add to student's total time
        const currentTime = studentTimeMap.get(sessionData.student_id) || 0;
        studentTimeMap.set(sessionData.student_id, currentTime + sessionSeconds);
      });

      // Calculate average time per student
      const totalStudentTimeSeconds = Array.from(studentTimeMap.values()).reduce((sum, time) => sum + time, 0);
      const averageTimeSeconds = studentTimeMap.size > 0
        ? totalStudentTimeSeconds / studentTimeMap.size
        : 0;

      // Get class success score from gem_events OR assessment scores
      const sessionIds = sessions?.map(s => s.id) || [];

      let classSuccessScore = 0;
      let studentsNeedingHelp = 0;

      // Check if this is an assessment assignment (game_type === 'assessment')
      const isAssessmentAssignment = assignment &&
        ((assignment as any).game_type === 'assessment' ||
        (assignment as any).game_config?.assessmentConfig);

      if (sessionIds.length > 0) {
        if (isAssessmentAssignment) {
          // For assessments, calculate success from accuracy_percentage in sessions
          console.log('📊 [ASSESSMENT] Calculating success from session accuracy');

          const sessionsWithAccuracy = sessions?.filter(s => s.ended_at) || [];
          if (sessionsWithAccuracy.length > 0) {
            const totalAccuracy = sessionsWithAccuracy.reduce((sum, s) => {
              const sessionData = s as any;
              return sum + (sessionData.accuracy_percentage || 0);
            }, 0);
            classSuccessScore = Math.round(totalAccuracy / sessionsWithAccuracy.length);

            // Students needing help: accuracy < 50%
            const studentAccuracyMap = new Map<string, number[]>();
            sessionsWithAccuracy.forEach(s => {
              const sessionData = s as any;
              const accuracies = studentAccuracyMap.get(s.student_id) || [];
              accuracies.push(sessionData.accuracy_percentage || 0);
              studentAccuracyMap.set(s.student_id, accuracies);
            });

            studentsNeedingHelp = Array.from(studentAccuracyMap.values()).filter(accuracies => {
              const avgAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
              return avgAccuracy < 50;
            }).length;
          }

          console.log('📊 [ASSESSMENT] Success score:', classSuccessScore, '%');
          console.log('📊 [ASSESSMENT] Students needing help:', studentsNeedingHelp);
        } else {
          // For games, use gem_events
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

      // Fetch all sessions for this assignment at once
      const { data: allSessions } = await this.supabase
        .from('enhanced_game_sessions')
        .select('id, student_id, duration_seconds, started_at, ended_at, completion_status, accuracy_percentage')
        .eq('assignment_id', assignmentId);

      // Group sessions by student
      const sessionsByStudent = new Map<string, any[]>();
      allSessions?.forEach(session => {
        const existing = sessionsByStudent.get(session.student_id) || [];
        existing.push(session);
        sessionsByStudent.set(session.student_id, existing);
      });

      // Get assignment type once
      const { data: assignmentCheckData } = await this.supabase
        .from('assignments')
        .select('game_type, game_config')
        .eq('id', assignmentId)
        .single();

      const isAssessmentType = assignmentCheckData &&
        (assignmentCheckData.game_type === 'assessment' || assignmentCheckData.game_config?.assessmentConfig);

      // Get progress for each student
      const studentProgress: StudentProgress[] = [];

      for (const enrollment of enrollments) {
        const studentId = enrollment.student_id;
        const studentName = nameMap.get(studentId) || 'Unknown';

        // Get sessions for this student from our map
        let studentSessions = sessionsByStudent.get(studentId) || [];

        // Determine status from actual sessions
        let status: 'completed' | 'in_progress' | 'not_started' = 'not_started';
        let timeSpentMinutes = 0;

        if (studentSessions && studentSessions.length > 0) {
          const hasCompleted = studentSessions.some(s => s.completion_status === 'completed' || s.ended_at);
          status = hasCompleted ? 'completed' : 'in_progress';

          // Calculate total time - use duration_seconds if available, otherwise calculate from timestamps
          const totalSeconds = studentSessions.reduce((sum, s) => {
            const sessionData = s as any;

            // If duration_seconds is available and non-zero, use it
            if (sessionData.duration_seconds && sessionData.duration_seconds > 0) {
              return sum + sessionData.duration_seconds;
            }

            // Otherwise, calculate from timestamps if both are available
            if (sessionData.started_at && sessionData.ended_at) {
              const startTime = new Date(sessionData.started_at).getTime();
              const endTime = new Date(sessionData.ended_at).getTime();
              const calculatedSeconds = Math.round((endTime - startTime) / 1000);
              return sum + calculatedSeconds;
            }

            return sum;
          }, 0);

          timeSpentMinutes = Math.round(totalSeconds / 60);
        }

        // Get performance metrics - either from gem events (games) or session data (assessments)
        const studentSessionIds = studentSessions?.map(s => s.id) || [];

        let successScore = 0;
        let weakRetrievalPercent = 0;
        let failureRate = 0;
        let keyStruggleWords: string[] = [];
        let lastAttempt: string | null = null;

        // Check if this is an assessment
        const { data: assignmentData } = await this.supabase
          .from('assignments')
          .select('type, game_type, game_config')
          .eq('id', assignmentId)
          .single();

        const isAssessmentAssignment = assignmentData &&
          (assignmentData.game_type === 'assessment' || assignmentData.game_config?.assessmentConfig);

        if (studentSessionIds.length > 0) {
          if (isAssessmentAssignment) {
            // For assessments, use accuracy_percentage from sessions
            const sessionsWithData = studentSessions?.filter(s => s.ended_at) || [];
            if (sessionsWithData.length > 0) {
              const latestSession = sessionsWithData[sessionsWithData.length - 1] as any;
              successScore = Math.round(latestSession.accuracy_percentage || 0);
              failureRate = 100 - successScore;
              weakRetrievalPercent = failureRate;
              lastAttempt = latestSession.ended_at;
            }
          } else {
            // For games, use gem events
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


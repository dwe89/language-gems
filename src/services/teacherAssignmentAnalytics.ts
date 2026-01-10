import { SupabaseClient } from '@supabase/supabase-js';
import {
  AssessmentType,
  AssessmentTypeConfig,
  NormalizedAssessmentResult,
  ASSESSMENT_TYPE_REGISTRY,
  getAssessmentConfig
} from '@/types/assessmentTypes';
import { detectAssessmentTypes, AssignmentMetadata } from '@/utils/assignmentTypeDetector';

export type AssessmentCategory =
  | 'gcse-reading'
  | 'gcse-listening'
  | 'gcse-writing'
  | 'gcse-dictation'
  | 'edexcel-listening'
  | 'reading-comprehension';

export interface AssessmentTypeSummary {
  assessmentType: AssessmentCategory;
  paperCount: number;
  attempts: number;
  completedAttempts: number;
  avgScore: number;
  avgTimeMinutes: number;
}

export interface AssessmentPerformanceSnapshot {
  correct?: number;
  total?: number;
  accuracy?: number;
  averageTimeSeconds?: number;
  scorePercentage?: number;
  percentage?: number;
}

export interface CategoryPerformanceAggregate {
  key: string;
  attempts: number;
  correct: number;
  accuracy: number;
  averageTimeSeconds: number;
  averageScore: number;
}

export interface GradeDistributionEntry {
  grade: number;
  count: number;
  percentage: number;
}

export interface AssessmentPerformanceBreakdown {
  attempts: number;
  averageScore: number;
  averageTimeSeconds: number;
  gradeDistribution: GradeDistributionEntry[];
  byQuestionType: CategoryPerformanceAggregate[];
  byTheme: CategoryPerformanceAggregate[];
  byTopic: CategoryPerformanceAggregate[];
}

export interface AssessmentResultDetail {
  resultId: string;
  studentId: string;
  studentName: string;
  assessmentType: AssessmentCategory;
  examBoard: string | null;
  paperIdentifier: string | null;
  paperTitle: string | null;
  tier: string | null;
  language: string | null;
  attemptNumber: number;
  status: string;
  scorePercentage: number;
  rawScore: number;
  maxScore: number;
  timeSpentSeconds: number;
  completedAt: string | null;
  gcseGrade?: number | null;
  performanceByQuestionType?: Record<string, AssessmentPerformanceSnapshot> | null;
  performanceByTheme?: Record<string, AssessmentPerformanceSnapshot> | null;
  performanceByTopic?: Record<string, AssessmentPerformanceSnapshot> | null;
  isOverridden?: boolean;
  originalScore?: number;
  originalPercentage?: number;
}

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
  isAssessmentAssignment: boolean;
  isSkillsAssignment?: boolean;
  assessmentSummary?: AssessmentTypeSummary[];
  assessmentPerformanceBreakdown?: AssessmentPerformanceBreakdown;
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
  isCustomVocabulary?: boolean; // ✅ NEW: true if from enhanced_vocabulary_items
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

interface PreloadedData {
  preloadedReadingComprehensionResults?: any[];
}

export class TeacherAssignmentAnalyticsService {
  // Cache is now cleared on each instantiation to prevent stale data in dev mode
  private assessmentResultsCache = new Map<string, AssessmentResultDetail[]>();
  private preloadedData: PreloadedData;

  constructor(private supabase: SupabaseClient, preloadedData: PreloadedData = {}) {
    // Clear cache on each instantiation to ensure fresh data
    this.assessmentResultsCache.clear();
    this.preloadedData = preloadedData;
    if (preloadedData.preloadedReadingComprehensionResults?.length) {
      console.log('📊 [SERVICE] Received preloaded reading comprehension data:', preloadedData.preloadedReadingComprehensionResults.length, 'results');
    }
  }

  /**
   * Check if a student's score has been overridden by a teacher
   * and return the override details if it exists
   */
  private async getScoreOverride(
    assignmentId: string,
    studentId: string,
    assessmentType: string
  ): Promise<{ overrideScore: number; overridePercentage: number; originalScore: number; originalPercentage: number } | null> {
    try {
      const { data: override, error } = await this.supabase
        .from('teacher_score_overrides')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .eq('assessment_type', assessmentType)
        .order('overridden_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !override) {
        return null;
      }

      return {
        overrideScore: override.override_score,
        overridePercentage: Math.round((override.override_score / override.override_max_score) * 100),
        originalScore: override.original_score,
        originalPercentage: Math.round((override.original_score / override.original_max_score) * 100)
      };
    } catch (error) {
      console.error('Error fetching score override:', error);
      return null;
    }
  }

  /**
   * Apply score overrides to a list of assessment results
   */
  private async applyScoreOverrides(
    assignmentId: string,
    results: AssessmentResultDetail[]
  ): Promise<AssessmentResultDetail[]> {
    const overridePromises = results.map(async (result) => {
      const override = await this.getScoreOverride(
        assignmentId,
        result.studentId,
        result.assessmentType
      );

      if (override) {
        return {
          ...result,
          isOverridden: true,
          originalScore: override.originalScore,
          originalPercentage: override.originalPercentage,
          rawScore: override.overrideScore,
          scorePercentage: override.overridePercentage
        };
      }

      return result;
    });

    return Promise.all(overridePromises);
  }

  /**
   * Get assignment overview metrics for the triage zone
   */
  async getAssignmentOverview(assignmentId: string): Promise<AssignmentOverviewMetrics> {
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
        .eq('class_id', assignment.class_id)
        .eq('status', 'active');

      if (enrollmentError) {
        console.error('❌ Error fetching class enrollments:', enrollmentError);
        throw enrollmentError;
      }

      const totalStudents = enrollments?.length || 0;

      const isAssessmentType = assignment?.game_type === 'assessment' ||
        assignment?.game_config?.assessmentConfig;

      // Check if this is a skills (grammar) assignment
      const isSkillsType = assignment?.game_type === 'skills' ||
        assignment?.game_config?.skillsConfig;

      let completedStudents = 0;
      let inProgressStudents = 0;
      let notStartedStudents = totalStudents;
      let averageTimeSeconds = 0;
      let classSuccessScore = 0;
      let studentsNeedingHelp = 0;
      let assessmentSummary: AssessmentTypeSummary[] | undefined;
      let assessmentPerformanceBreakdown: AssessmentPerformanceBreakdown | undefined;

      if (isAssessmentType) {
        const assessmentResults = await this.getAssessmentResults(assignmentId);
        assessmentSummary = this.buildAssessmentSummary(assessmentResults);
        assessmentPerformanceBreakdown = this.buildAssessmentPerformanceBreakdown(assessmentResults);

        const studentsWithAttempts = new Set(assessmentResults.map(r => r.studentId));
        const studentBestMap = new Map<string, { bestScore: number; status: string; timeSeconds: number; completedAt: string | null }>();

        assessmentResults.forEach(result => {
          const entry = studentBestMap.get(result.studentId);
          const roundedScore = Math.round(result.scorePercentage || 0);
          const shouldReplace = !entry || roundedScore > entry.bestScore || (
            roundedScore === entry.bestScore &&
            (result.completedAt || '') > (entry.completedAt || '')
          );

          if (shouldReplace) {
            studentBestMap.set(result.studentId, {
              bestScore: roundedScore,
              status: result.status,
              timeSeconds: result.timeSpentSeconds || 0,
              completedAt: result.completedAt
            });
          }
        });

        completedStudents = Array.from(studentBestMap.values()).filter(value => {
          const normalizedStatus = value.status?.toLowerCase() || '';
          return ['completed', 'complete'].includes(normalizedStatus);
        }).length;
        inProgressStudents = studentsWithAttempts.size - completedStudents;
        notStartedStudents = Math.max(0, totalStudents - studentsWithAttempts.size);

        if (studentBestMap.size > 0) {
          classSuccessScore = Math.round(
            Array.from(studentBestMap.values()).reduce((sum, item) => sum + item.bestScore, 0) /
            studentBestMap.size
          );
          averageTimeSeconds = Array.from(studentBestMap.values()).reduce((sum, item) => sum + item.timeSeconds, 0) /
            studentBestMap.size;
          studentsNeedingHelp = Array.from(studentBestMap.values()).filter(item => item.bestScore < 50).length;
        }
      } else if (isSkillsType) {
        // Skills (Grammar) assignments - fetch from grammar_assignment_sessions
        // 🔧 FIX: For mixed-mode assignments, also check vocabulary game sessions
        console.log('🔍 [SKILLS] Fetching grammar sessions for assignment:', assignmentId);

        const { data: grammarSessions, error: grammarSessionError } = await this.supabase
          .from('grammar_assignment_sessions')
          .select(`
            id,
            student_id,
            topic_id,
            session_type,
            questions_attempted,
            questions_correct,
            accuracy_percentage,
            duration_seconds,
            completion_status,
            created_at,
            ended_at
          `)
          .eq('assignment_id', assignmentId);

        if (grammarSessionError) {
          console.error('❌ Error fetching grammar sessions:', grammarSessionError);
          throw grammarSessionError;
        }

        console.log('🔍 [SKILLS] Grammar sessions found:', grammarSessions?.length || 0);

        // 🔧 FIX: For mixed-mode assignments (game_type === 'mixed-mode'), also check vocabulary games
        let vocabSessions: any[] = [];
        if (assignment?.game_type === 'mixed-mode') {
          console.log('🔍 [MIXED-MODE] Also fetching vocabulary game sessions');
          // 🔧 FIX: Use RPC function with SECURITY DEFINER to bypass RLS
          const { data: vocabData, error: vocabError } = await this.supabase
            .rpc('get_game_sessions_admin', { p_assignment_id: assignmentId });

          if (!vocabError && vocabData) {
            vocabSessions = vocabData;
            console.log('🔍 [MIXED-MODE] Vocabulary sessions found:', vocabSessions.length);
          }
        }

        // Group sessions by student (combine grammar + vocabulary for mixed-mode)
        const allStudentsWithSessions = new Set([
          ...(grammarSessions?.map(s => s.student_id) || []),
          ...(vocabSessions?.map((s: any) => s.student_id) || [])
        ]);

        // A student is completed if they have at least one completed session (grammar or vocab)
        const studentsCompleted = new Set([
          ...(grammarSessions?.filter(s => s.completion_status === 'completed').map(s => s.student_id) || []),
          ...(vocabSessions?.filter((s: any) => s.completion_status === 'completed' || s.ended_at).map((s: any) => s.student_id) || [])
        ]);

        completedStudents = studentsCompleted.size;
        inProgressStudents = allStudentsWithSessions.size - studentsCompleted.size;
        notStartedStudents = Math.max(0, totalStudents - allStudentsWithSessions.size);

        console.log('📊 [SKILLS] Completion stats:', { completedStudents, inProgressStudents, notStartedStudents });

        // Calculate average time (combine grammar + vocab sessions)
        const grammarTimes = grammarSessions?.filter(s => s.duration_seconds && s.duration_seconds > 0) || [];
        const vocabTimes = vocabSessions?.filter((s: any) => s.duration_seconds && s.duration_seconds > 0) || [];
        const allSessionTimes = [...grammarTimes, ...vocabTimes];

        if (allSessionTimes.length > 0) {
          averageTimeSeconds = allSessionTimes.reduce((sum, s: any) => sum + (s.duration_seconds || 0), 0) / allSessionTimes.length;
        }

        // Calculate class success score from accuracy (combine grammar + vocab)
        const grammarAccuracy = grammarSessions?.filter(s =>
          s.questions_attempted && s.questions_attempted > 0
        ) || [];
        const vocabAccuracy = vocabSessions?.filter((s: any) =>
          s.words_attempted && s.words_attempted > 0
        ) || [];

        let totalCorrect = 0;
        let totalAttempts = 0;

        // Grammar sessions
        grammarAccuracy.forEach(s => {
          totalAttempts += s.questions_attempted || 0;
          totalCorrect += s.questions_correct || 0;
        });

        // Vocabulary sessions
        vocabAccuracy.forEach((s: any) => {
          totalAttempts += s.words_attempted || 0;
          totalCorrect += s.words_correct || 0;
        });

        if (totalAttempts > 0) {
          classSuccessScore = Math.round((totalCorrect / totalAttempts) * 100);
          console.log('📊 [MIXED-MODE] Success score:', classSuccessScore, '% (', totalCorrect, '/', totalAttempts, ')');
        }

        // Calculate students needing help (accuracy < 50%)
        const studentAccuracyMap = new Map<string, { total: number; correct: number }>();

        // Include grammar sessions
        grammarSessions?.forEach(session => {
          const current = studentAccuracyMap.get(session.student_id) || { total: 0, correct: 0 };
          current.total += session.questions_attempted || 0;
          current.correct += session.questions_correct || 0;
          studentAccuracyMap.set(session.student_id, current);
        });

        // Include vocabulary sessions
        vocabSessions?.forEach((session: any) => {
          const current = studentAccuracyMap.get(session.student_id) || { total: 0, correct: 0 };
          current.total += session.words_attempted || 0;
          current.correct += session.words_correct || 0;
          studentAccuracyMap.set(session.student_id, current);
        });

        studentsNeedingHelp = Array.from(studentAccuracyMap.values()).filter(stats => {
          const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
          return accuracy < 50;
        }).length;

        console.log('📊 [MIXED-MODE] Students needing help:', studentsNeedingHelp);
      } else {
        console.log('🔥🔥 [OVERVIEW] VOCABULARY ASSIGNMENT - Fetching sessions for:', assignmentId);
        console.log('🔍 [DEBUG] Fetching sessions for assignment:', assignmentId);
        console.log('🔍 [DEBUG] Is assessment type:', assignment?.game_type === 'assessment');

        // 🔧 FIX: Use RPC function with SECURITY DEFINER to bypass RLS
        // This is more reliable than relying on service role key alone
        let { data: sessions, error: sessionError } = await this.supabase
          .rpc('get_game_sessions_admin', { p_assignment_id: assignmentId });

        console.log('🔍 [DEBUG] Sessions from RPC:', sessions?.length, 'error:', sessionError?.message);

        // 🔥 CRITICAL DEBUG: Store immediately after query
        (this as any)._vocabQueryError = sessionError?.message || null;
        (this as any)._vocabQuerySessionsRaw = sessions?.length || 0;

        console.log('🔍 [DEBUG] Sessions query result - error:', sessionError);
        console.log('🔍 [DEBUG] Sessions found:', sessions?.length);
        console.log('🔍 [DEBUG] First 2 sessions:', JSON.stringify(sessions?.slice(0, 2), null, 2));

        if (sessionError) {
          console.error('❌ Error fetching sessions:', sessionError);
          throw sessionError;
        }

        // 🎯 FALLBACK: For assessment-type assignments, also check reading_comprehension_results
        // if sessions are empty (in case sessions weren't created properly)
        if (isAssessmentType && (!sessions || sessions.length === 0)) {
          console.log('📊 [ASSESSMENT FALLBACK] No sessions found, checking reading_comprehension_results');

          const { data: results, error: resultsError } = await this.supabase
            .from('reading_comprehension_results')
            .select('id, student_id, user_id, score_percentage, score, time_spent_seconds, time_spent, completed_at, submitted_at')
            .eq('assignment_id', assignmentId);

          if (!resultsError && results && results.length > 0) {
            console.log('📊 [ASSESSMENT FALLBACK] Found', results.length, 'results, using those instead');

            const mappedSessions = results.map(r => ({
              id: r.id ? `result-${r.id}` : `result-${r.student_id || r.user_id}`,
              student_id: r.student_id || r.user_id,
              duration_seconds: (r.time_spent_seconds ?? r.time_spent) || 0,
              started_at: r.completed_at || r.submitted_at,
              ended_at: r.completed_at || r.submitted_at,
              completion_status: 'completed' as const,
              accuracy_percentage: (r.score_percentage ?? r.score) || 0
            }));

            sessions = mappedSessions as any;
            console.log('📊 [ASSESSMENT FALLBACK] Converted to sessions:', sessions?.length || 0);
          }
        }

        const studentsWithSessions = new Set(sessions?.map((s: any) => s.student_id) || []);
        const completedSessions = sessions?.filter((s: any) => s.completion_status === 'completed' || s.ended_at) || [];
        console.log('🔍 [DEBUG] Completed sessions count:', completedSessions.length);
        console.log('🔍 [DEBUG] Completed sessions:', JSON.stringify(completedSessions.slice(0, 2), null, 2));

        const studentsCompleted = new Set(completedSessions.map((s: any) => s.student_id));

        completedStudents = studentsCompleted.size;
        inProgressStudents = studentsWithSessions.size - studentsCompleted.size;
        notStartedStudents = totalStudents - studentsWithSessions.size;

        console.log('📊 Completion stats:', { completedStudents, inProgressStudents, notStartedStudents });

        const studentTimeMap = new Map<string, number>();

        completedSessions.forEach((s: any) => {
          const sessionData = s as any;
          let sessionSeconds = 0;

          if (sessionData.duration_seconds && sessionData.duration_seconds > 0) {
            sessionSeconds = sessionData.duration_seconds;
          } else if (sessionData.started_at && sessionData.ended_at) {
            const startTime = new Date(sessionData.started_at).getTime();
            const endTime = new Date(sessionData.ended_at).getTime();
            sessionSeconds = Math.round((endTime - startTime) / 1000);
          }

          const currentTime = studentTimeMap.get(sessionData.student_id) || 0;
          studentTimeMap.set(sessionData.student_id, currentTime + sessionSeconds);
        });

        const totalStudentTimeSeconds = Array.from(studentTimeMap.values()).reduce((sum, time) => sum + time, 0);
        averageTimeSeconds = studentTimeMap.size > 0
          ? totalStudentTimeSeconds / studentTimeMap.size
          : 0;

        const sessionIds = sessions?.map((s: any) => s.id) || [];

        if (sessionIds.length > 0) {
          if (isAssessmentType) {
            console.log('📊 [ASSESSMENT] Calculating success from session accuracy');

            // Include completed sessions AND in-progress sessions that have actual attempts
            const sessionsWithAccuracy = sessions?.filter((s: any) =>
              s.ended_at ||
              (s.words_attempted && s.words_attempted > 0)
            ) || [];

            if (sessionsWithAccuracy.length > 0) {
              const totalAccuracy = sessionsWithAccuracy.reduce((sum: number, s: any) => {
                const sessionData = s as any;
                return sum + (sessionData.accuracy_percentage || 0);
              }, 0);
              classSuccessScore = Math.round(totalAccuracy / sessionsWithAccuracy.length);

              const studentAccuracyMap = new Map<string, number[]>();
              sessionsWithAccuracy.forEach((s: any) => {
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
            // For standard games, calculate success from session stats
            // 🔧 FIXED: Use session metrics (correct/attempted) instead of gem rarity
            // All gems are correct, but we want true accuracy including failed attempts

            let totalCorrect = 0;
            let totalAttempted = 0;
            const studentAccuracies = new Map<string, { correct: number; attempted: number }>();

            sessions?.forEach((s: any) => {
              const attempted = s.words_attempted || 0;
              const correct = s.words_correct || 0;
              if (attempted > 0) {
                totalCorrect += correct;
                totalAttempted += attempted;

                const current = studentAccuracies.get(s.student_id) || { correct: 0, attempted: 0 };
                current.correct += correct;
                current.attempted += attempted;
                studentAccuracies.set(s.student_id, current);
              }
            });

            if (totalAttempted > 0) {
              classSuccessScore = Math.round((totalCorrect / totalAttempted) * 100);
            } else {
              // Fallback if no word stats (e.g. old data): use completed/accurate sessions
              // But since we fixed data, this should be rare. Default to 0?
              // Or maybe 100 if completed? No, 0 is safer fallback.
              classSuccessScore = 0;

              // Try to infer from gems if session stats missing?
              // No, let's stick to session stats which are now reliable via RPC
            }

            console.log('📊 Success score:', classSuccessScore, '% (', totalCorrect, '/', totalAttempted, ')');

            studentsNeedingHelp = Array.from(studentAccuracies.values())
              .filter(stats => {
                const accuracy = stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 0;
                return accuracy < 50;
              })
              .length;

            console.log('📊 Students needing help:', studentsNeedingHelp);
          }
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
        studentsNeedingHelp,
        isAssessmentAssignment: isAssessmentType,
        isSkillsAssignment: isSkillsType,
        assessmentSummary,
        assessmentPerformanceBreakdown
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

  private async getAssessmentResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    const cached = this.assessmentResultsCache.get(assignmentId);
    if (cached) {
      return cached;
    }

    try {
      // Fetch assignment metadata to detect types
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('game_type, type, game_config')
        .eq('id', assignmentId)
        .single();

      if (!assignment) {
        console.error('❌ Assignment not found:', assignmentId);
        return [];
      }

      // Map the assignment data to AssignmentMetadata format
      const metadata: AssignmentMetadata = {
        game_type: assignment.game_type,
        content_type: assignment.type, // 'type' column is the content_type
        game_config: assignment.game_config
      };

      // Detect which assessment types are present
      const assessmentTypes = detectAssessmentTypes(metadata);

      console.log(`🔍 Detected assessment types for ${assignmentId}:`, assessmentTypes);

      // Fetch all relevant assessment types in parallel
      const fetchPromises = assessmentTypes.map(type => {
        switch (type) {
          case 'reading-comprehension':
            return this.fetchReadingComprehensionResults(assignmentId);
          case 'aqa-reading':
            return this.fetchAQAReadingResults(assignmentId);
          case 'aqa-listening':
            return this.fetchAQAListeningResults(assignmentId);
          case 'aqa-dictation':
            return this.fetchAQADictationResults(assignmentId);
          case 'aqa-writing':
            return this.fetchAQAWritingResults(assignmentId);
          case 'four-skills':
            return this.fetchFourSkillsResults(assignmentId);
          case 'exam-style':
            return this.fetchExamStyleResults(assignmentId);
          case 'vocabulary-game':
            return this.fetchVocabularyGameResults(assignmentId);
          case 'grammar-practice':
            return this.fetchGrammarPracticeResults(assignmentId);
          default:
            console.warn(`⚠️ Unknown assessment type: ${type}`);
            return Promise.resolve([]);
        }
      });

      const resultArrays = await Promise.all(fetchPromises);
      const combined = resultArrays.flat();

      // Enrich with student names
      if (combined.length > 0) {
        const studentIds = Array.from(new Set(combined.map(result => result.studentId).filter(Boolean)));
        if (studentIds.length > 0) {
          const { data: profiles } = await this.supabase
            .from('user_profiles')
            .select('user_id, display_name')
            .in('user_id', studentIds);

          const nameMap = new Map(profiles?.map(profile => [profile.user_id, profile.display_name]) || []);
          combined.forEach(result => {
            result.studentName = nameMap.get(result.studentId) || result.studentName || 'Unknown Student';
          });
        }
      }

      // Apply score overrides
      const resultsWithOverrides = await this.applyScoreOverrides(assignmentId, combined);

      this.assessmentResultsCache.set(assignmentId, resultsWithOverrides);
      return resultsWithOverrides;
    } catch (error) {
      console.error('❌ Error aggregating assessment results:', error);
      return [];
    }
  }

  private buildAssessmentSummary(results: AssessmentResultDetail[]): AssessmentTypeSummary[] | undefined {
    if (!results || results.length === 0) {
      return undefined;
    }

    const summaryMap = new Map<AssessmentCategory, {
      paperIds: Set<string>;
      attempts: number;
      completed: number;
      totalScore: number;
      totalTimeSeconds: number;
    }>();

    results.forEach(result => {
      const category = result.assessmentType;
      if (!category) return;

      const current = summaryMap.get(category) || {
        paperIds: new Set<string>(),
        attempts: 0,
        completed: 0,
        totalScore: 0,
        totalTimeSeconds: 0
      };

      if (result.paperIdentifier) {
        current.paperIds.add(result.paperIdentifier);
      }

      current.attempts += 1;
      const status = (result.status || '').toLowerCase();
      if (status.includes('complete') || status === 'passed' || status === 'graded') {
        current.completed += 1;
      }

      current.totalScore += result.scorePercentage || 0;
      current.totalTimeSeconds += result.timeSpentSeconds || 0;

      summaryMap.set(category, current);
    });

    return Array.from(summaryMap.entries()).map(([category, data]) => ({
      assessmentType: category,
      paperCount: data.paperIds.size,
      attempts: data.attempts,
      completedAttempts: data.completed,
      avgScore: data.attempts > 0 ? Math.round(data.totalScore / data.attempts) : 0,
      avgTimeMinutes: data.completed > 0 ? Math.round((data.totalTimeSeconds / data.completed) / 60) : 0
    }));
  }

  private buildAssessmentPerformanceBreakdown(results: AssessmentResultDetail[]): AssessmentPerformanceBreakdown | undefined {
    if (!results || results.length === 0) {
      return undefined;
    }

    const hasCategoryData = results.some(result =>
      result.performanceByQuestionType || result.performanceByTheme || result.performanceByTopic
    );

    const dataset = hasCategoryData
      ? results.filter(result =>
        result.performanceByQuestionType || result.performanceByTheme || result.performanceByTopic
      )
      : results;

    const gradeDistribution = this.buildGradeDistribution(results);

    if (dataset.length === 0 && gradeDistribution.length === 0) {
      return undefined;
    }

    const attempts = dataset.length;
    const averageScore = attempts > 0
      ? Math.round(dataset.reduce((sum, item) => sum + (item.scorePercentage || 0), 0) / attempts)
      : 0;

    const timeSamples = dataset.filter(item => (item.timeSpentSeconds || 0) > 0);
    const averageTimeSeconds = timeSamples.length > 0
      ? Math.round(timeSamples.reduce((sum, item) => sum + (item.timeSpentSeconds || 0), 0) / timeSamples.length)
      : 0;

    return {
      attempts,
      averageScore,
      averageTimeSeconds,
      gradeDistribution,
      byQuestionType: hasCategoryData ? this.aggregateCategoryPerformance(dataset, 'performanceByQuestionType') : [],
      byTheme: hasCategoryData ? this.aggregateCategoryPerformance(dataset, 'performanceByTheme') : [],
      byTopic: hasCategoryData ? this.aggregateCategoryPerformance(dataset, 'performanceByTopic') : []
    };
  }

  private aggregateCategoryPerformance(
    results: AssessmentResultDetail[],
    accessor: 'performanceByQuestionType' | 'performanceByTheme' | 'performanceByTopic'
  ): CategoryPerformanceAggregate[] {
    const categoryMap = new Map<string, {
      attempts: number;
      correct: number;
      totalTimeSeconds: number;
      timeSamples: number;
      scoreSum: number;
      scoreSamples: number;
    }>();

    results.forEach(result => {
      const performance = result[accessor];
      if (!performance) return;

      Object.entries(performance).forEach(([key, snapshot]) => {
        if (!snapshot) return;
        const entry = categoryMap.get(key) || {
          attempts: 0,
          correct: 0,
          totalTimeSeconds: 0,
          timeSamples: 0,
          scoreSum: 0,
          scoreSamples: 0
        };

        const total = snapshot.total ?? 0;
        const correct = snapshot.correct ?? 0;
        entry.attempts += total;
        entry.correct += correct;

        const avgTime = snapshot.averageTimeSeconds;
        const timeMultiplier = total > 0 ? total : 1;
        if (typeof avgTime === 'number' && avgTime > 0) {
          entry.totalTimeSeconds += avgTime * timeMultiplier;
          entry.timeSamples += timeMultiplier;
        }

        const scoreValue = snapshot.scorePercentage ?? snapshot.accuracy ?? snapshot.percentage;
        if (typeof scoreValue === 'number' && !Number.isNaN(scoreValue)) {
          entry.scoreSum += scoreValue;
          entry.scoreSamples += 1;
        }

        categoryMap.set(key, entry);
      });
    });

    return Array.from(categoryMap.entries()).map(([key, stats]) => ({
      key,
      attempts: stats.attempts,
      correct: stats.correct,
      accuracy: stats.attempts > 0 ? Math.round((stats.correct / Math.max(stats.attempts, 1)) * 100) : 0,
      averageTimeSeconds: stats.timeSamples > 0 ? Number((stats.totalTimeSeconds / stats.timeSamples).toFixed(1)) : 0,
      averageScore: stats.scoreSamples > 0 ? Number((stats.scoreSum / stats.scoreSamples).toFixed(1)) : 0
    })).sort((a, b) => b.attempts - a.attempts);
  }

  private buildGradeDistribution(results: AssessmentResultDetail[]): GradeDistributionEntry[] {
    const gradeCounts = new Map<number, number>();

    results.forEach(result => {
      if (typeof result.gcseGrade === 'number') {
        gradeCounts.set(result.gcseGrade, (gradeCounts.get(result.gcseGrade) || 0) + 1);
      }
    });

    const total = Array.from(gradeCounts.values()).reduce((sum, count) => sum + count, 0);
    if (total === 0) {
      return [];
    }

    return Array.from(gradeCounts.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([grade, count]) => ({
        grade,
        count,
        percentage: Math.round((count / total) * 100)
      }));
  }

  private async fetchAqaReadingResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    try {
      const assignmentFilters = await this.buildAssignmentFilterIds('aqa_reading_assignments', assignmentId);
      const { data, error } = await this.supabase
        .from('aqa_reading_results')
        .select('id, student_id, assessment_id, assignment_id, attempt_number, raw_score, total_possible_score, percentage_score, total_time_seconds, completion_time, status, gcse_grade, performance_by_question_type, performance_by_theme, performance_by_topic')
        .in('assignment_id', assignmentFilters);

      if (error) {
        console.error('❌ Error fetching AQA reading results:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      const assessmentIds = Array.from(new Set(data.map(row => row.assessment_id)));
      const metadata = await this.fetchAssessmentMetadata('aqa_reading_assessments', assessmentIds, ['title', 'level', 'language']);

      return data.map(row => {
        const meta = metadata.get(row.assessment_id);
        return {
          resultId: row.id,
          studentId: row.student_id,
          studentName: 'Unknown Student',
          assessmentType: 'gcse-reading',
          examBoard: 'AQA',
          paperIdentifier: meta?.title || row.assessment_id,
          paperTitle: meta?.title || null,
          tier: meta?.level || null,
          language: meta?.language || null,
          attemptNumber: row.attempt_number ?? 1,
          status: row.status || 'completed',
          scorePercentage: this.resolvePercentage(row.percentage_score, row.raw_score, row.total_possible_score),
          rawScore: row.raw_score ?? 0,
          maxScore: row.total_possible_score ?? 0,
          timeSpentSeconds: row.total_time_seconds ?? 0,
          completedAt: row.completion_time || null,
          gcseGrade: row.gcse_grade ?? null,
          performanceByQuestionType: row.performance_by_question_type || null,
          performanceByTheme: row.performance_by_theme || null,
          performanceByTopic: row.performance_by_topic || null
        };
      });
    } catch (error) {
      console.error('❌ Unexpected error fetching AQA reading results:', error);
      return [];
    }
  }

  private async fetchAqaListeningResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    try {
      const assignmentFilters = await this.buildAssignmentFilterIds('aqa_listening_assignments', assignmentId);
      const { data, error } = await this.supabase
        .from('aqa_listening_results')
        .select('id, student_id, assessment_id, assignment_id, attempt_number, raw_score, total_possible_score, percentage_score, total_time_seconds, completion_time, status, gcse_grade, performance_by_question_type, performance_by_theme, performance_by_topic')
        .in('assignment_id', assignmentFilters);

      if (error) {
        console.error('❌ Error fetching AQA listening results:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      const assessmentIds = Array.from(new Set(data.map(row => row.assessment_id)));
      const metadata = await this.fetchAssessmentMetadata('aqa_listening_assessments', assessmentIds, ['title', 'identifier', 'level', 'language']);

      return data.map(row => {
        const meta = metadata.get(row.assessment_id);
        return {
          resultId: row.id,
          studentId: row.student_id,
          studentName: 'Unknown Student',
          assessmentType: 'gcse-listening',
          examBoard: 'AQA',
          paperIdentifier: meta?.identifier || meta?.title || row.assessment_id,
          paperTitle: meta?.title || null,
          tier: meta?.level || null,
          language: meta?.language || null,
          attemptNumber: row.attempt_number ?? 1,
          status: row.status || 'completed',
          scorePercentage: this.resolvePercentage(row.percentage_score, row.raw_score, row.total_possible_score),
          rawScore: row.raw_score ?? 0,
          maxScore: row.total_possible_score ?? 0,
          timeSpentSeconds: row.total_time_seconds ?? 0,
          completedAt: row.completion_time || null,
          gcseGrade: row.gcse_grade ?? null,
          performanceByQuestionType: row.performance_by_question_type || null,
          performanceByTheme: row.performance_by_theme || null,
          performanceByTopic: row.performance_by_topic || null
        };
      });
    } catch (error) {
      console.error('❌ Unexpected error fetching AQA listening results:', error);
      return [];
    }
  }

  private async fetchAqaDictationResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    try {
      const assignmentFilters = await this.buildAssignmentFilterIds('aqa_dictation_assignments', assignmentId);
      const { data, error } = await this.supabase
        .from('aqa_dictation_results')
        .select('id, student_id, assessment_id, assignment_id, attempt_number, raw_score, total_possible_score, percentage_score, total_time_seconds, completion_time, status')
        .in('assignment_id', assignmentFilters);

      if (error) {
        console.error('❌ Error fetching AQA dictation results:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      const assessmentIds = Array.from(new Set(data.map(row => row.assessment_id)));
      const metadata = await this.fetchAssessmentMetadata('aqa_dictation_assessments', assessmentIds, ['title', 'identifier', 'level', 'language']);

      return data.map(row => {
        const meta = metadata.get(row.assessment_id);
        return {
          resultId: row.id,
          studentId: row.student_id,
          studentName: 'Unknown Student',
          assessmentType: 'gcse-dictation',
          examBoard: 'AQA',
          paperIdentifier: meta?.identifier || meta?.title || row.assessment_id,
          paperTitle: meta?.title || null,
          tier: meta?.level || null,
          language: meta?.language || null,
          attemptNumber: row.attempt_number ?? 1,
          status: row.status || 'completed',
          scorePercentage: this.resolvePercentage(row.percentage_score, row.raw_score, row.total_possible_score),
          rawScore: row.raw_score ?? 0,
          maxScore: row.total_possible_score ?? 0,
          timeSpentSeconds: row.total_time_seconds ?? 0,
          completedAt: row.completion_time || null
        };
      });
    } catch (error) {
      console.error('❌ Unexpected error fetching AQA dictation results:', error);
      return [];
    }
  }

  private async fetchAqaWritingResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    try {
      const assignmentFilters = await this.buildAssignmentFilterIds('aqa_writing_assignments', assignmentId);
      const { data, error } = await this.supabase
        .from('aqa_writing_results')
        .select('id, student_id, assessment_id, assignment_id, total_score, max_score, percentage_score, time_spent_seconds, completed_at, is_completed, gcse_grade')
        .in('assignment_id', assignmentFilters);

      if (error) {
        console.error('❌ Error fetching AQA writing results:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      const assessmentIds = Array.from(new Set(data.map(row => row.assessment_id)));
      const metadata = await this.fetchAssessmentMetadata('aqa_writing_assessments', assessmentIds, ['title', 'identifier', 'level', 'language']);

      return data.map(row => {
        const meta = metadata.get(row.assessment_id);
        return {
          resultId: row.id,
          studentId: row.student_id,
          studentName: 'Unknown Student',
          assessmentType: 'gcse-writing',
          examBoard: 'AQA',
          paperIdentifier: meta?.identifier || meta?.title || row.assessment_id,
          paperTitle: meta?.title || null,
          tier: meta?.level || null,
          language: meta?.language || null,
          attemptNumber: 1,
          status: row.is_completed ? 'completed' : 'in_progress',
          scorePercentage: this.resolvePercentage(row.percentage_score, row.total_score, row.max_score),
          rawScore: row.total_score ?? 0,
          maxScore: row.max_score ?? 0,
          timeSpentSeconds: row.time_spent_seconds ?? 0,
          completedAt: row.completed_at || null,
          gcseGrade: row.gcse_grade ?? null
        };
      });
    } catch (error) {
      console.error('❌ Unexpected error fetching AQA writing results:', error);
      return [];
    }
  }

  /**
   * Fetch reading comprehension results using direct REST API call
   * NOTE: We use direct fetch instead of Supabase JS client due to caching/connection 
   * issues observed in Next.js where the JS client intermittently returns empty results
   */
  private async fetchReadingComprehensionResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    try {
      let data: any[] | null = null;
      let error: any = null;

      // Use preloaded data if available
      if (this.preloadedData.preloadedReadingComprehensionResults?.length) {
        data = this.preloadedData.preloadedReadingComprehensionResults.filter(r => r.assignment_id === assignmentId);
      } else {
        // Direct fetch to Supabase REST API (bypasses JS client caching issues)
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
          const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

          const url = `${supabaseUrl}/rest/v1/reading_comprehension_results?assignment_id=eq.${assignmentId}&select=id,user_id,assignment_id,text_id,total_questions,correct_answers,score,time_spent,passed,completed_at`;

          const response = await fetch(url, {
            headers: {
              'apikey': serviceRoleKey,
              'Authorization': `Bearer ${serviceRoleKey}`,
              'Content-Type': 'application/json'
            },
            cache: 'no-store'
          });

          if (response.ok) {
            data = await response.json();
          } else {
            error = { message: `HTTP ${response.status}`, details: await response.text() };
          }
        } catch (fetchError) {
          console.error('❌ Error fetching reading comprehension results:', fetchError);
          error = fetchError;
        }
      }
      if (error) {
        console.error('❌ Error fetching reading comprehension results:', error);
        return [];
      }

      if (!data || data.length === 0) {
        // Fallback: Try to find results by querying students in the class
        // This handles potential issues with direct assignment_id lookups (e.g. UUID casting quirks)
        try {
          const { data: assign } = await this.supabase
            .from('assignments')
            .select('class_id')
            .eq('id', assignmentId)
            .single();

          if (assign?.class_id) {
            const { data: students } = await this.supabase
              .from('class_enrollments')
              .select('student_id')
              .eq('class_id', assign.class_id);

            const studentIds = students?.map(s => s.student_id) || [];

            if (studentIds.length > 0) {
              const { data: userResults } = await this.supabase
                .from('reading_comprehension_results')
                .select('id, user_id, assignment_id, text_id, total_questions, correct_answers, score, time_spent, passed, completed_at')
                .in('user_id', studentIds);

              // Filter in memory to be safe
              const validResults = userResults?.filter(r => r.assignment_id === assignmentId) || [];

              if (validResults.length > 0) {
                console.log('✅ [READING COMP] Found results via student lookup fallback:', validResults.length);
                data = validResults;
              }
            }
          }
        } catch (fallbackError) {
          console.warn('⚠️ Fallback lookup failed:', fallbackError);
        }
      }

      if (!data || data.length === 0) {
        return [];
      }

      // Get task details to enrich results
      const textIds = [...new Set(data.map(r => r.text_id).filter(Boolean))];
      const { data: tasks } = await this.supabase
        .from('reading_comprehension_tasks')
        .select('id, title, difficulty, language')
        .in('id', textIds);

      const taskMap = new Map(tasks?.map(t => [t.id, t]) || []);

      return data.map(result => {
        const task = taskMap.get(result.text_id);
        return {
          resultId: result.id,
          studentId: result.user_id,
          studentName: 'Unknown', // Will be populated later
          assessmentType: 'reading-comprehension',
          examBoard: null,
          paperIdentifier: result.text_id,
          paperTitle: task?.title || 'Unknown Text',
          tier: task?.difficulty || null,
          language: task?.language || null,
          attemptNumber: 1,
          status: result.completed_at ? 'completed' : 'in_progress',
          scorePercentage: result.score,
          rawScore: result.correct_answers,
          maxScore: result.total_questions,
          timeSpentSeconds: result.time_spent,
          completedAt: result.completed_at
        };
      });
    } catch (error) {
      console.error('❌ Error in fetchReadingComprehensionResults:', error);
      return [];
    }
  }

  /**
   * Generic assessment result fetcher - works with any assessment type from the registry
   * Uses direct REST API to avoid Supabase JS client caching issues
   */
  private async fetchAssessmentResults(
    assignmentId: string,
    assessmentType: AssessmentType
  ): Promise<AssessmentResultDetail[]> {
    try {
      const config = getAssessmentConfig(assessmentType);
      if (!config) {
        console.error(`❌ Unknown assessment type: ${assessmentType}`);
        return [];
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !serviceRoleKey) {
        console.error('❌ Missing Supabase credentials');
        return [];
      }

      // Build select clause from config
      const selectFields = config.resultColumns.join(',');

      // Direct fetch to Supabase REST API (bypasses JS client caching)
      const url = `${supabaseUrl}/rest/v1/${config.tableName}?assignment_id=eq.${assignmentId}&select=${selectFields}`;

      const response = await fetch(url, {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Prevent Next.js caching
      });

      if (!response.ok) {
        console.error(`❌ REST API error for ${assessmentType}:`, response.status);
        return [];
      }

      const data = await response.json();

      // Normalize results using the config
      return this.normalizeAssessmentResults(data, config);
    } catch (error) {
      console.error(`❌ Error fetching ${assessmentType} results:`, error);
      return [];
    }
  }

  /**
   * Normalizes assessment results from different table schemas into a unified format
   * Returns complete AssessmentResultDetail objects for dashboard consumption
   */
  private normalizeAssessmentResults(
    data: any[],
    config: AssessmentTypeConfig
  ): AssessmentResultDetail[] {
    return data.map((result) => {
      // Handle different score field types
      const rawScore = result[config.scoreField] ?? result.raw_score ?? 0;
      const maxScore = result[config.maxScoreField] ?? result.total_possible_score ?? result.max_score ?? 100;

      // Calculate percentage - some tables store it directly
      let percentageScore = result.percentage_score ?? result.score ?? 0;
      if (typeof percentageScore === 'string') {
        percentageScore = parseFloat(percentageScore) || 0;
      }
      // If percentage not stored, calculate from raw/max
      if (!percentageScore && rawScore && maxScore > 0) {
        percentageScore = Math.round((rawScore / maxScore) * 100);
      }

      // Determine student ID field - varies by table schema
      const studentId = result.student_id ?? result.user_id ?? '';

      // Determine status
      const status = result.status ?? (result.completed_at || result.completion_time ? 'completed' : 'in_progress');

      return {
        resultId: result.id,
        studentId: studentId,
        studentName: 'Unknown Student', // Populated later by getAssessmentResults
        assessmentType: config.type as AssessmentCategory,
        examBoard: result.exam_board ?? config.displayName.includes('AQA') ? 'AQA' : null,
        paperIdentifier: result.assessment_id ?? result.text_id ?? null,
        paperTitle: result.title ?? null,
        tier: result.tier ?? result.level ?? null,
        language: result.language ?? null,
        attemptNumber: result.attempt_number ?? 1,
        status: status,
        scorePercentage: Math.round(percentageScore),
        rawScore: rawScore,
        maxScore: maxScore,
        timeSpentSeconds: result[config.timeField] ?? result.total_time_seconds ?? result.time_spent ?? 0,
        completedAt: result.completion_time ?? result.completed_at ?? null,
        gcseGrade: result.gcse_grade ?? null,
        performanceByQuestionType: result.performance_by_question_type ?? null,
        performanceByTheme: result.performance_by_theme ?? null,
        performanceByTopic: result.performance_by_topic ?? null
      };
    });
  }

  /**
   * Fetch AQA Reading assessment results
   */
  private async fetchAQAReadingResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    return this.fetchAssessmentResults(assignmentId, 'aqa-reading');
  }

  /**
   * Fetch AQA Listening assessment results
   */
  private async fetchAQAListeningResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    return this.fetchAssessmentResults(assignmentId, 'aqa-listening');
  }

  /**
   * Fetch AQA Dictation assessment results
   */
  private async fetchAQADictationResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    return this.fetchAssessmentResults(assignmentId, 'aqa-dictation');
  }

  /**
   * Fetch AQA Writing assessment results
   */
  private async fetchAQAWritingResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    return this.fetchAssessmentResults(assignmentId, 'aqa-writing');
  }

  /**
   * Fetch Four Skills assessment results
   */
  private async fetchFourSkillsResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    return this.fetchAssessmentResults(assignmentId, 'four-skills');
  }

  /**
   * Fetch Exam Style assessment results
   */
  private async fetchExamStyleResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    return this.fetchAssessmentResults(assignmentId, 'exam-style');
  }

  /**
   * Fetch Vocabulary Game results
   */
  private async fetchVocabularyGameResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    return this.fetchAssessmentResults(assignmentId, 'vocabulary-game');
  }

  /**
   * Fetch Grammar Practice results
   */
  private async fetchGrammarPracticeResults(assignmentId: string): Promise<AssessmentResultDetail[]> {
    return this.fetchAssessmentResults(assignmentId, 'grammar-practice');
  }

  private async buildAssignmentFilterIds(bridgeTable: string, assignmentId: string): Promise<string[]> {
    const ids = new Set<string>([assignmentId]);
    try {
      const { data, error } = await this.supabase
        .from(bridgeTable)
        .select('id')
        .eq('assignment_id', assignmentId);

      if (!error && data) {
        data.forEach(record => {
          if (record.id) {
            ids.add(record.id);
          }
        });
      }
    } catch (error) {
      console.warn(`⚠️ Unable to resolve assignment bridge for ${bridgeTable}:`, error);
    }

    return Array.from(ids);
  }

  private async fetchAssessmentMetadata(table: string, ids: string[], extraColumns: string[]): Promise<Map<string, any>> {
    if (!ids || ids.length === 0) {
      return new Map();
    }

    const uniqueIds = Array.from(new Set(ids.filter(Boolean)));
    if (uniqueIds.length === 0) {
      return new Map();
    }

    const selectColumns = ['id', ...extraColumns].join(', ');
    const { data, error } = await this.supabase
      .from(table)
      .select(selectColumns)
      .in('id', uniqueIds);

    if (error || !data) {
      if (error) {
        console.warn(`⚠️ Unable to fetch assessment metadata from ${table}:`, error);
      }
      return new Map();
    }

    return new Map((data as any[]).map(record => [record.id, record]));
  }

  private async fetchReadingTaskMetadata(taskIds: string[]): Promise<Map<string, any>> {
    if (!taskIds || taskIds.length === 0) {
      return new Map();
    }

    const { data, error } = await this.supabase
      .from('reading_comprehension_tasks')
      .select('id, title, difficulty, exam_board, language')
      .in('id', taskIds);

    if (error || !data) {
      if (error) {
        console.warn('⚠️ Unable to fetch reading comprehension task metadata:', error);
      }
      return new Map();
    }

    return new Map(data.map(task => [task.id, task]));
  }

  private resolvePercentage(
    storedPercentage?: number | string | null,
    rawScore?: number | null,
    maxScore?: number | null
  ): number {
    if (storedPercentage !== null && storedPercentage !== undefined) {
      const numeric = typeof storedPercentage === 'number'
        ? storedPercentage
        : Number(storedPercentage);

      if (!Number.isNaN(numeric)) {
        return Math.round(numeric);
      }
    }

    if (typeof rawScore === 'number' && typeof maxScore === 'number' && maxScore > 0) {
      return Math.round((rawScore / maxScore) * 100);
    }

    return 0;
  }

  private normalizeExamBoardName(value?: string | null): string | null {
    if (!value) return null;
    const normalized = value.toString().trim();
    if (!normalized) return null;
    if (normalized.toLowerCase() === 'aqa') return 'AQA';
    if (normalized.toLowerCase() === 'edexcel') return 'Edexcel';
    return normalized;
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
    // 🔧 FIX: Use RPC function with SECURITY DEFINER to bypass RLS
    const { data: sessions, error: sessionsError } = await this.supabase
      .rpc('get_game_sessions_admin', { p_assignment_id: assignmentId });

    if (sessionsError) {
      console.error('❌ [WORD DIFFICULTY] Error fetching sessions:', sessionsError);
    }

    const sessionIds = sessions?.map((s: any) => s.id) || [];

    if (sessionIds.length === 0) return [];

    const gemEvents = await this.fetchGemEvents<{
      session_id: string;
      centralized_vocabulary_id: string | null;
      enhanced_vocabulary_item_id: string | null; // ✅ Support custom vocabulary
      gem_rarity: string;
      word_text: string | null;
      translation_text: string | null;
    }>(
      sessionIds,
      'session_id, centralized_vocabulary_id, enhanced_vocabulary_item_id, gem_rarity, word_text, translation_text'
    );

    // Group by vocabulary (supports both centralized and custom vocabulary)
    const wordMap = new Map<string, {
      wordText: string;
      translationText: string;
      total: number;
      failures: number;
      strongRetrieval: number;
      weakRetrieval: number;
      isCustomVocabulary: boolean; // ✅ Track source
    }>();

    gemEvents?.forEach(gem => {
      // ✅ Support both centralized and enhanced vocabulary IDs
      const vocabId = gem.centralized_vocabulary_id || gem.enhanced_vocabulary_item_id;
      if (!vocabId) return;

      const isCustom = !gem.centralized_vocabulary_id && !!gem.enhanced_vocabulary_item_id;
      const key = vocabId;
      const current = wordMap.get(key) || {
        wordText: gem.word_text || '',
        translationText: gem.translation_text || '',
        total: 0,
        failures: 0,
        strongRetrieval: 0,
        weakRetrieval: 0,
        isCustomVocabulary: isCustom
      };

      current.total++;
      // 🔧 FIXED: All gems represent CORRECT answers
      // The gem_rarity just indicates XP value, not correctness
      // Mastery gems = stronger retrieval, Activity gems = weaker retrieval, but both are CORRECT
      if (gem.gem_rarity === 'common') current.weakRetrieval++;
      if (['rare', 'epic', 'legendary'].includes(gem.gem_rarity)) current.strongRetrieval++;
      if (gem.gem_rarity === 'uncommon') current.weakRetrieval++;
      // NO failures from gems - failures would need to come from 
      // incorrect attempts which don't generate gems at all

      wordMap.set(key, current);
    });

    // Convert to array with failure rates
    // 🔧 FIXED: Since all gems = correct, failure rate based on gem_rarity doesn't make sense
    // Instead, we'll use the "weak retrieval" (common/uncommon gems) as a proxy for "needs review"
    const words = Array.from(wordMap.values())
      .map(word => ({
        ...word,
        // Failure rate now means "weak retrieval rate" - percentage of attempts where 
        // the student got it but showed weak retention (common/uncommon gems)
        failureRate: word.total > 0 ? Math.round((word.weakRetrieval / word.total) * 100) : 0,
        failures: word.weakRetrieval // Rename for compatibility
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
      insightLevel: this.getInsightLevel(word.failureRate, word.total),
      isCustomVocabulary: word.isCustomVocabulary // ✅ Include source type
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
      // 🔧 FIX: Use RPC function with SECURITY DEFINER to bypass RLS
      console.log('🔍 [STUDENT ROSTER] Fetching sessions for assignment:', assignmentId);

      const { data: allSessions, error: sessionsError } = await this.supabase
        .rpc('get_game_sessions_admin', { p_assignment_id: assignmentId });

      if (sessionsError) {
        console.error('❌ Error fetching sessions:', sessionsError);
      }

      console.log('🔍 [STUDENT ROSTER] Sessions query result:', {
        error: sessionsError,
        sessionCount: allSessions?.length || 0,
        sampleSession: allSessions?.[0] || null
      });

      // Group sessions by student
      const sessionsByStudent = new Map<string, any[]>();
      allSessions?.forEach((session: any) => {
        const existing = sessionsByStudent.get(session.student_id) || [];
        existing.push(session);
        sessionsByStudent.set(session.student_id, existing);
      });

      console.log('🔍 [STUDENT ROSTER] Sessions grouped by student:', sessionsByStudent.size, 'students with sessions');

      // Get assignment type once
      const { data: assignmentCheckData } = await this.supabase
        .from('assignments')
        .select('game_type, game_config')
        .eq('id', assignmentId)
        .single();

      const isAssessmentType = assignmentCheckData &&
        (assignmentCheckData.game_type === 'assessment' || assignmentCheckData.game_config?.assessmentConfig);

      const isSkillsType = assignmentCheckData &&
        (assignmentCheckData.game_type === 'skills' || assignmentCheckData.game_config?.skillsConfig);

      // For skills assignments, also fetch grammar sessions
      let grammarSessionsByStudent = new Map<string, any[]>();
      if (isSkillsType) {
        const { data: grammarSessions } = await this.supabase
          .from('grammar_assignment_sessions')
          .select(`
            id,
            student_id,
            topic_id,
            session_type,
            questions_attempted,
            questions_correct,
            accuracy_percentage,
            duration_seconds,
            completion_status,
            created_at,
            ended_at
          `)
          .eq('assignment_id', assignmentId);

        grammarSessions?.forEach(session => {
          const existing = grammarSessionsByStudent.get(session.student_id) || [];
          existing.push(session);
          grammarSessionsByStudent.set(session.student_id, existing);
        });
      }

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

        const isSkillsAssignment = assignmentData &&
          (assignmentData.game_type === 'skills' || assignmentData.game_config?.skillsConfig);

        if (isSkillsAssignment) {
          // For skills (grammar) assignments, use grammar_assignment_sessions
          const studentGrammarSessions = grammarSessionsByStudent.get(studentId) || [];

          // 🔧 FIX: For mixed-mode, also calculate vocabulary game performance
          let totalCorrect = 0;
          let totalAttempts = 0;
          let hasVocabData = false;

          // Grammar session metrics
          if (studentGrammarSessions.length > 0) {
            totalAttempts += studentGrammarSessions.reduce((sum, s) => sum + (s.questions_attempted || 0), 0);
            totalCorrect += studentGrammarSessions.reduce((sum, s) => sum + (s.questions_correct || 0), 0);

            // Calculate time from grammar
            const totalGrammarSeconds = studentGrammarSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
            if (totalGrammarSeconds > 0) {
              timeSpentMinutes = Math.round(totalGrammarSeconds / 60);
            }

            // Get last attempt from grammar
            const sortedSessions = [...studentGrammarSessions]
              .filter(s => s.created_at)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            if (sortedSessions.length > 0) {
              lastAttempt = sortedSessions[0].ended_at || sortedSessions[0].created_at;
            }

            // Update status based on grammar sessions
            const hasCompleted = studentGrammarSessions.some(s => s.completion_status === 'completed');
            if (hasCompleted) status = 'completed';
          }

          // For mixed-mode, also include vocabulary game performance
          if (assignmentData?.game_type === 'mixed-mode' && studentSessions && studentSessions.length > 0) {
            // Get vocabulary session metrics
            const vocabAttempts = studentSessions.reduce((sum, s) => sum + (s.words_attempted || 0), 0);
            const vocabCorrect = studentSessions.reduce((sum, s) => sum + (s.words_correct || 0), 0);

            if (vocabAttempts > 0) {
              totalAttempts += vocabAttempts;
              totalCorrect += vocabCorrect;
              hasVocabData = true;

              // If no grammar time, use vocab time
              if (timeSpentMinutes === 0) {
                const totalVocabSeconds = studentSessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
                timeSpentMinutes = Math.round(totalVocabSeconds / 60);
              }

              // Update last attempt if vocab is more recent
              const vocabSorted = [...studentSessions]
                .filter(s => s.started_at)
                .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
              if (vocabSorted.length > 0) {
                const vocabLastAttempt = vocabSorted[0].ended_at || vocabSorted[0].started_at;
                if (!lastAttempt || (vocabLastAttempt && new Date(vocabLastAttempt) > new Date(lastAttempt))) {
                  lastAttempt = vocabLastAttempt;
                }
              }
            }
          }

          // Calculate combined success score
          if (totalAttempts > 0) {
            successScore = Math.round((totalCorrect / totalAttempts) * 100);
            failureRate = 100 - successScore;
            weakRetrievalPercent = failureRate;
          }
        } else if (isAssessmentAssignment) {
          // For assessments, ALWAYS fetch actual results from the results tables first
          // This ensures we catch results even if sessions are missing or RLS hides them

          // Check Reading Comprehension results first
          const { data: rcResults } = await this.supabase
            .from('reading_comprehension_results')
            .select('score, correct_answers, total_questions, time_spent, completed_at')
            .eq('assignment_id', assignmentId)
            .eq('user_id', studentId)
            .order('completed_at', { ascending: false })
            .limit(1);

          if (rcResults && rcResults.length > 0) {
            const result = rcResults[0];
            successScore = result.score || 0;
            failureRate = 100 - successScore;
            weakRetrievalPercent = failureRate;
            lastAttempt = result.completed_at;
            status = result.completed_at ? 'completed' : 'in_progress';

            // Update time spent if we have it
            if (result.time_spent) {
              timeSpentMinutes = Math.round(result.time_spent / 60);
            }
          }

          // Check GCSE Reading results (AQA)
          if (status === 'not_started') {
            const { data: grResults } = await this.supabase
              .from('aqa_reading_results')
              .select('percentage_score, raw_score, total_possible_score, total_time_seconds, completion_time, status')
              .eq('assignment_id', assignmentId)
              .eq('student_id', studentId)
              .order('created_at', { ascending: false })
              .limit(1);

            if (grResults && grResults.length > 0) {
              const result = grResults[0];
              successScore = Math.round(result.percentage_score || 0);
              failureRate = 100 - successScore;
              weakRetrievalPercent = failureRate;
              lastAttempt = result.completion_time;
              status = result.status === 'completed' ? 'completed' : 'in_progress';
              if (result.total_time_seconds) {
                timeSpentMinutes = Math.round(result.total_time_seconds / 60);
              }
            }
          }

          // Check GCSE Listening results (AQA)
          if (status === 'not_started') {
            const { data: glResults } = await this.supabase
              .from('aqa_listening_results')
              .select('percentage_score, raw_score, total_possible_score, total_time_seconds, completion_time, status')
              .eq('assignment_id', assignmentId)
              .eq('student_id', studentId)
              .order('created_at', { ascending: false })
              .limit(1);

            if (glResults && glResults.length > 0) {
              const result = glResults[0];
              successScore = Math.round(result.percentage_score || 0);
              failureRate = 100 - successScore;
              weakRetrievalPercent = failureRate;
              lastAttempt = result.completion_time;
              status = result.status === 'completed' ? 'completed' : 'in_progress';
              if (result.total_time_seconds) {
                timeSpentMinutes = Math.round(result.total_time_seconds / 60);
              }
            }
          }

          // Check GCSE Writing results (AQA)
          if (status === 'not_started') {
            const { data: gwResults } = await this.supabase
              .from('aqa_writing_results')
              .select('percentage_score, total_score, max_score, time_spent_seconds, completed_at, is_completed')
              .eq('assignment_id', assignmentId)
              .eq('student_id', studentId)
              .order('created_at', { ascending: false })
              .limit(1);

            if (gwResults && gwResults.length > 0) {
              const result = gwResults[0];
              successScore = Math.round(result.percentage_score || 0);
              failureRate = 100 - successScore;
              weakRetrievalPercent = failureRate;
              lastAttempt = result.completed_at;
              status = result.is_completed ? 'completed' : 'in_progress';
              if (result.time_spent_seconds) {
                timeSpentMinutes = Math.round(result.time_spent_seconds / 60);
              }
            }
          }

          // Check GCSE Speaking results (AQA)
          if (status === 'not_started') {
            const { data: gsResults } = await this.supabase
              .from('aqa_speaking_results')
              .select('percentage_score, total_score, max_score, time_spent_seconds, completed_at')
              .eq('assignment_id', assignmentId)
              .eq('student_id', studentId)
              .order('created_at', { ascending: false })
              .limit(1);

            if (gsResults && gsResults.length > 0) {
              const result = gsResults[0];
              successScore = Math.round(result.percentage_score || 0);
              failureRate = 100 - successScore;
              weakRetrievalPercent = failureRate;
              lastAttempt = result.completed_at;
              status = result.completed_at ? 'completed' : 'in_progress';
              if (result.time_spent_seconds) {
                timeSpentMinutes = Math.round(result.time_spent_seconds / 60);
              }
            }
          }

          // Check Dictation results (AQA)
          if (status === 'not_started') {
            const { data: dictResults } = await this.supabase
              .from('aqa_dictation_results')
              .select('percentage_score, raw_score, total_possible_score, total_time_seconds, completion_time, status')
              .eq('assignment_id', assignmentId)
              .eq('student_id', studentId)
              .order('created_at', { ascending: false })
              .limit(1);

            if (dictResults && dictResults.length > 0) {
              const result = dictResults[0];
              successScore = Math.round(result.percentage_score || 0);
              failureRate = 100 - successScore;
              weakRetrievalPercent = failureRate;
              lastAttempt = result.completion_time;
              status = result.status === 'completed' ? 'completed' : 'in_progress';
              if (result.total_time_seconds) {
                timeSpentMinutes = Math.round(result.total_time_seconds / 60);
              }
            }
          }

          // Fallback to session data if no results found but sessions exist
          if (status === 'not_started' && studentSessionIds.length > 0) {
            const sessionsWithData = studentSessions?.filter(s => s.ended_at) || [];
            if (sessionsWithData.length > 0) {
              const latestSession = sessionsWithData[sessionsWithData.length - 1] as any;
              successScore = Math.round(latestSession.accuracy_percentage || 0);
              failureRate = 100 - successScore;
              weakRetrievalPercent = failureRate;
              lastAttempt = latestSession.ended_at;
              status = 'in_progress';
            }
          }
        } else if (studentSessionIds.length > 0) {
          // For games, use gem events
          const gems = await this.fetchGemEvents<{
            session_id: string;
            gem_rarity: string;
            word_text: string | null;
            created_at: string;
          }>(studentSessionIds, 'session_id, gem_rarity, word_text, created_at');

          if (gems.length > 0) {
            gems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            // 🔧 FIXED: All gems represent CORRECT answers
            // Rarity indicates XP value, not correctness:
            // - 'common', 'uncommon' = weak retrieval (student was slower or less confident)
            // - 'rare', 'epic', 'legendary' = strong retrieval (quick and confident)
            // Since ALL gems = correct, successScore is 100% if any gems exist
            // Failure rate = 0% (no failures generate gems)
            const total = gems.length;
            const strongRetrievals = gems.filter(g => ['rare', 'epic', 'legendary'].includes(g.gem_rarity)).length;
            const weakRetrievals = gems.filter(g => ['uncommon', 'common'].includes(g.gem_rarity)).length;

            successScore = 100; // All gems = correct answers
            weakRetrievalPercent = Math.round((weakRetrievals / total) * 100);
            failureRate = 0; // No failures - all gems are correct answers
            lastAttempt = gems[0].created_at;

            // For struggle words, we now look at weak retrieval patterns
            // (words where the student usually got common gems instead of rare)
            const wordRetrievalStrength = new Map<string, { total: number; weak: number }>();
            gems.forEach(gem => {
              if (!gem.word_text) return;
              const current = wordRetrievalStrength.get(gem.word_text) || { total: 0, weak: 0 };
              current.total++;
              if (['common', 'uncommon'].includes(gem.gem_rarity)) current.weak++;
              wordRetrievalStrength.set(gem.word_text, current);
            });

            // Get words with high "weak retrieval" rate (student needs more practice)
            keyStruggleWords = Array.from(wordRetrievalStrength.entries())
              .filter(([_, stats]) => stats.total >= 2 && (stats.weak / stats.total) > 0.5)
              .sort((a, b) => (b[1].weak / b[1].total) - (a[1].weak / a[1].total))
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
      // 🔧 FIX: Use RPC function with SECURITY DEFINER to bypass RLS
      const { data: sessions, error: sessionsError } = await this.supabase
        .rpc('get_game_sessions_admin', { p_assignment_id: assignmentId });

      if (sessionsError) {
        console.error('❌ [WORD STRUGGLES] Error fetching sessions:', sessionsError);
      }

      if (!sessions) return [];

      const sessionIds = sessions.map((s: any) => s.id);

      const { data: gems } = await this.supabase
        .from('gem_events')
        .select('student_id, gem_rarity, created_at')
        .in('session_id', sessionIds)
        .eq('centralized_vocabulary_id', vocabularyId);

      if (!gems) return [];

      // Group by student
      // 🔧 FIXED: All gems represent CORRECT answers
      // The rarity just indicates retrieval strength, not correctness
      const studentMap = new Map<string, {
        strong: number;  // rare, epic, legendary = strong retrieval
        weak: number;    // common, uncommon = weak retrieval (but still correct!)
        lastAttempt: string
      }>();
      gems.forEach(gem => {
        const current = studentMap.get(gem.student_id) || { strong: 0, weak: 0, lastAttempt: gem.created_at };
        if (['rare', 'epic', 'legendary'].includes(gem.gem_rarity)) {
          current.strong++;
        } else {
          // common and uncommon = weaker retrieval (but still correct answers!)
          current.weak++;
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
      // 🔧 FIXED: "failures" now means "weak retrievals" - student needs more practice
      // but they ARE getting the answers correct
      const struggles: StudentWordStruggle[] = Array.from(studentMap.entries())
        .map(([studentId, stats]) => {
          const exposures = stats.strong + stats.weak;
          // "Failure rate" now means "weak retrieval rate" - how often they needed help/were slow
          const weakRetrievalRate = Math.round((stats.weak / exposures) * 100);

          return {
            studentId,
            studentName: nameMap.get(studentId) || 'Unknown',
            exposures,
            correct: exposures, // All gems = correct answers!
            incorrect: 0, // No incorrect - gems only track correct answers
            failureRate: weakRetrievalRate, // Repurposed: now means "weak retrieval rate"  
            lastAttempt: stats.lastAttempt,
            recommendedIntervention: this.getRecommendedIntervention(weakRetrievalRate)
          };
        })
        .sort((a, b) => b.failureRate - a.failureRate); // Sort by weak retrieval rate

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


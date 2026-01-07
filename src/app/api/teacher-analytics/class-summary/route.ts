// =====================================================
// API ROUTE: CLASS SUMMARY (TIER 1)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';
import type { TimeRange, ClassSummaryData } from '@/types/teacherAnalytics';

// Create service role client for API routes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to get date filter based on time range
function getDateFilter(timeRange: TimeRange): Date {
  const now = new Date();
  switch (timeRange) {
    case 'last_7_days':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'last_30_days':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'current_term':
      // Approximate: 12 weeks
      return new Date(now.getTime() - 84 * 24 * 60 * 60 * 1000);
    case 'all_time':
      return new Date(0);
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

// Helper to chunk array
function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Helper to calculate top class weakness
async function calculateTopClassWeakness(
  supabaseClient: any,
  studentIds: string[],
  dateFilter: Date
): Promise<any> {
  if (studentIds.length === 0) return null;

  // Get all game sessions with category/subcategory data
  // 🔧 FIXED: Include words_correct and words_attempted for proper accuracy calculation
  const sessions: any[] = [];
  const batches = chunkArray(studentIds, 20);

  for (const batch of batches) {
    const { data: batchData, error } = await supabaseClient
      .from('enhanced_game_sessions')
      .select('category, subcategory, game_type, words_attempted, words_correct, created_at, student_id')
      .in('student_id', batch)
      .gte('created_at', dateFilter.toISOString())
      .not('category', 'is', null)
      .limit(50000);

    if (!error && batchData) {
      sessions.push(...batchData);
    }
  }

  if (sessions.length === 0) {
    return null;
  }

  // Group by category/subcategory and calculate metrics
  const weaknessMap = new Map<string, {
    category: string;
    subcategory: string | null;
    totalAttempts: number;
    failedAttempts: number;
    avgAccuracy: number;
    recentAppearances: number;
    affectedStudents: Set<string>;
  }>();

  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

  sessions.forEach((session: any) => {
    const key = `${session.category}|${session.subcategory || 'general'}`;

    if (!weaknessMap.has(key)) {
      weaknessMap.set(key, {
        category: session.category,
        subcategory: session.subcategory,
        totalAttempts: 0,
        failedAttempts: 0,
        avgAccuracy: 0,
        recentAppearances: 0,
        affectedStudents: new Set(),
      });
    }

    const weakness = weaknessMap.get(key)!;
    weakness.totalAttempts++;
    weakness.affectedStudents.add(session.student_id);

    // 🔧 FIXED: Calculate accuracy from words_correct/words_attempted instead of using accuracy_percentage
    const wordsAttempted = session.words_attempted || 0;
    const wordsCorrect = session.words_correct || 0;
    const accuracy = wordsAttempted > 0 ? (wordsCorrect / wordsAttempted) * 100 : 0;
    if (accuracy < 60) {
      weakness.failedAttempts++;
    }

    // Check if recent (last 5 days)
    if (new Date(session.created_at) >= fiveDaysAgo) {
      weakness.recentAppearances++;
    }
  });

  // Calculate average accuracy and failure rate for each weakness
  const weaknesses = Array.from(weaknessMap.values()).map((w) => {
    const failureRate = w.totalAttempts > 0 ? (w.failedAttempts / w.totalAttempts) * 100 : 0;
    return {
      ...w,
      failureRate,
      affectedStudentCount: w.affectedStudents.size,
    };
  });

  // Filter: >50% failure rate, appeared in 3+ recent sessions
  const qualifyingWeaknesses = weaknesses.filter(
    (w) => w.failureRate > 50 && w.recentAppearances >= 3
  );

  if (qualifyingWeaknesses.length === 0) {
    return null;
  }

  // Sort by: failure rate DESC, then recent appearances DESC
  qualifyingWeaknesses.sort((a, b) => {
    if (Math.abs(b.failureRate - a.failureRate) > 5) {
      return b.failureRate - a.failureRate;
    }
    return b.recentAppearances - a.recentAppearances;
  });

  const topWeakness = qualifyingWeaknesses[0];

  // Format category name for display
  const categoryName = topWeakness.category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const subcategoryName = topWeakness.subcategory
    ? topWeakness.subcategory
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    : null;

  return {
    skillName: subcategoryName ? `${categoryName}: ${subcategoryName}` : categoryName,
    failureRate: Math.round(topWeakness.failureRate),
    affectedStudents: topWeakness.affectedStudentCount,
    recentOccurrences: topWeakness.recentAppearances,
  };
}

export async function GET(request: NextRequest) {
  try {


    const searchParams = request.nextUrl.searchParams;
    const teacherId = searchParams.get('teacherId');
    const classId = searchParams.get('classId') || undefined;
    const timeRange = (searchParams.get('timeRange') as TimeRange) || 'last_30_days';
    const viewScope = searchParams.get('viewScope') || 'my';
    const schoolCode = searchParams.get('schoolCode') || undefined;



    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    const dateFilter = getDateFilter(timeRange);


    // STEP 1: Get all students for this teacher or school
    let classesQuery;

    if (viewScope === 'school' && schoolCode) {
      // Get all classes in the school
      // Include both 'teacher' and 'admin' roles (admins can also have classes)
      const { data: teacherProfiles } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('school_code', schoolCode)
        .in('role', ['teacher', 'admin']);

      const teacherIds = teacherProfiles?.map(t => t.user_id) || [];

      classesQuery = supabase
        .from('classes')
        .select('id')
        .in('teacher_id', teacherIds);
    } else {
      // Get classes for this teacher only
      classesQuery = supabase
        .from('classes')
        .select('id')
        .eq('teacher_id', teacherId);
    }

    if (classId) {
      classesQuery = classesQuery.eq('id', classId);
    }

    const { data: classes, error: classesError } = await classesQuery;

    if (classesError) {
      console.error('Error fetching classes:', classesError);
      throw new Error('Failed to fetch classes');
    }

    const classIds = classes?.map((c: any) => c.id) || [];


    if (classIds.length === 0) {
      // No classes found, return empty data
      const emptyData: ClassSummaryData = {
        topMetrics: {
          averageScore: 0,
          assignmentsOverdue: 0,
          currentStreak: 0,
          trendPercentage: 0,
          trendDirection: 'stable',
        },
        urgentInterventions: [],
        studentsNeverLoggedIn: [],
        topClassWeakness: null,
        recentAssignments: [],
      };


      return NextResponse.json({
        success: true,
        data: emptyData,
        timeRange,
        generatedAt: new Date(),
      });
    }

    // Now get enrollments for these classes
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('class_enrollments')
      .select('student_id')
      .in('class_id', classIds)
      .eq('status', 'active');

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
      throw new Error('Failed to fetch enrollments');
    }

    const studentIds = enrollments?.map((e: any) => e.student_id) || [];
    const totalStudents = studentIds.length;


    // STEP 1.5: Get student profiles (names + created_at)
    const { data: studentProfiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('user_id, display_name, email, created_at')
      .in('user_id', studentIds);

    if (profilesError) {
      console.error('Error fetching student profiles:', profilesError);
    }

    // Create a map for quick lookup
    const studentProfileMap = new Map(
      (studentProfiles || []).map((p: any) => [p.user_id, p])
    );

    // STEP 2: Get game sessions for these students
    // NOTE: Supabase has a default limit of 1000 rows. We need to increase this for large classes.
    // FILTER OUT abandoned sessions (0% accuracy AND 0 words attempted) - these are sessions where student quit immediately
    // FILTER OUT abandoned sessions (0% accuracy AND 0 words attempted) - these are sessions where student quit immediately
    const gameSessions: any[] = [];
    const studentBatches = chunkArray(studentIds, 20);

    for (const batch of studentBatches) {
      // 🔧 FIXED: Added words_correct to SELECT for proper accuracy calculation
      const { data: batchSessions, error: sessionsError } = await supabase
        .from('enhanced_game_sessions')
        .select('student_id, final_score, words_attempted, words_correct, created_at, duration_seconds, game_type')
        .in('student_id', batch)
        .gte('created_at', dateFilter.toISOString())
        .order('created_at', { ascending: false })
        .limit(50000);

      if (sessionsError) {
        console.error('Error fetching game sessions batch:', sessionsError);
      } else if (batchSessions) {
        gameSessions.push(...batchSessions);
      }
    }

    // Filter out:
    // 1. Abandoned sessions (student quit immediately without playing)
    // 2. Memory game sessions (luck-based, not skill-based)
    // 🔧 FIXED: Use words_attempted > 0 instead of accuracy_percentage (which is never set)
    const activeSessions = gameSessions?.filter((s: any) =>
      (s.words_attempted > 0) &&
      s.game_type !== 'memory-game'
    ) || [];





    // STEP 3: Get assignments
    let assignmentsQuery = supabase
      .from('assignments')
      .select(`
        id,
        title,
        due_date,
        created_at,
        enhanced_assignment_progress(student_id, best_score, status, completed_at)
      `)
      .eq('created_by', teacherId)
      .gte('created_at', dateFilter.toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (classId) {
      assignmentsQuery = assignmentsQuery.eq('class_id', classId);
    }

    const { data: assignments, error: assignmentsError } = await assignmentsQuery;

    if (assignmentsError) {
      console.error('Error fetching assignments:', assignmentsError);
    }

    // STEP 4: Calculate metrics (using only active sessions, not abandoned ones)
    const sessions = activeSessions;

    // Count active students (played in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeStudentIds = new Set(
      sessions.filter((s: any) => new Date(s.created_at) >= sevenDaysAgo).map((s: any) => s.student_id)
    );
    const activeStudentCount = activeStudentIds.size;

    // Count overdue assignments
    const now = new Date();
    const overdueCount = (assignments || []).filter((a: any) => {
      if (!a.due_date) return false;
      return new Date(a.due_date) < now;
    }).length;

    // Calculate class-wide streak (consecutive days with ANY student activity)
    const sortedDates = sessions
      .map((s: any) => new Date(s.created_at).toDateString())
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index); // unique dates

    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    // Only count streak if there was activity today or yesterday
    if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
      let streakDate = new Date();
      while (sortedDates.includes(streakDate.toDateString())) {
        currentStreak++;
        streakDate = new Date(streakDate.getTime() - 24 * 60 * 60 * 1000);
      }
    }

    // STEP 5: Calculate risk scores for each student
    // First, batch-fetch assignment_vocabulary_progress for all students (efficient single query)
    // First, batch-fetch assignment_vocabulary_progress for all students (efficient single query)
    const allVocabProgress: any[] = [];
    // Reuse batches from above (studentBatches)
    for (const batch of studentBatches) {
      const { data: batchData, error } = await supabase
        .from('assignment_vocabulary_progress')
        .select('student_id, assignment_id, seen_count, correct_count, last_seen_at, created_at')
        .in('student_id', batch)
        .gte('created_at', dateFilter.toISOString())
        .limit(10000);

      if (!error && batchData) allVocabProgress.push(...batchData);
    }

    // Batch-fetch enhanced_assignment_progress (assignments students have worked on)
    // Batch-fetch enhanced_assignment_progress (assignments students have worked on)
    const allAssignmentProgress: any[] = [];
    for (const batch of studentBatches) {
      const { data: batchData, error } = await supabase
        .from('enhanced_assignment_progress')
        .select('student_id, assignment_id, status, completed_at, created_at, best_score, best_accuracy')
        .in('student_id', batch)
        .gte('created_at', dateFilter.toISOString())
        .limit(10000);

      if (!error && batchData) allAssignmentProgress.push(...batchData);
    }

    // Build a map of vocab progress by student
    const vocabProgressByStudent = new Map<string, typeof allVocabProgress>();
    (allVocabProgress || []).forEach((v: any) => {
      if (!vocabProgressByStudent.has(v.student_id)) {
        vocabProgressByStudent.set(v.student_id, []);
      }
      vocabProgressByStudent.get(v.student_id)!.push(v);
    });

    // Build a map of assignment progress by student
    const assignmentProgressByStudent = new Map<string, typeof allAssignmentProgress>();
    (allAssignmentProgress || []).forEach((a: any) => {
      if (!assignmentProgressByStudent.has(a.student_id)) {
        assignmentProgressByStudent.set(a.student_id, []);
      }
      assignmentProgressByStudent.get(a.student_id)!.push(a);
    });

    const studentsWithRawSessions = new Set((gameSessions || []).map((s: any) => s.student_id));

    // Build map of last raw session date to ensure we catch activity even if filtered out
    const lastRawSessionDateMap = new Map<string, Date>();
    (gameSessions || []).forEach((s: any) => {
      const d = new Date(s.created_at);
      const existing = lastRawSessionDateMap.get(s.student_id);
      if (!existing || d > existing) {
        lastRawSessionDateMap.set(s.student_id, d);
      }
    });

    const studentRiskScores = await Promise.all(studentIds.map(async (studentId: string) => {
      const studentSessions = sessions.filter((s: any) => s.student_id === studentId);
      const profile = studentProfileMap.get(studentId);
      const studentVocabProgress = vocabProgressByStudent.get(studentId) || [];
      const studentAssignmentProgress = assignmentProgressByStudent.get(studentId) || [];



      // Debug for Edward (a311...) AND Oscar (c854...)


      // Calculate vocab progress stats
      const totalVocabExposures = studentVocabProgress.reduce((sum, v: any) => sum + (v.seen_count || 0), 0);
      const totalVocabCorrect = studentVocabProgress.reduce((sum, v: any) => sum + (v.correct_count || 0), 0);
      const lastVocabActivity = studentVocabProgress.length > 0
        ? new Date(Math.max(...studentVocabProgress.map((v: any) => new Date(v.last_seen_at || v.created_at).getTime())))
        : null;

      // Calculate assignment progress stats
      // Calculate assignment progress stats
      // FIX: Don't use created_at as it's just when assignment was assigned, not student activity
      const lastAssignmentActivity = studentAssignmentProgress.length > 0
        ? new Date(Math.max(...studentAssignmentProgress
          .filter((a: any) => a.last_attempt_at || a.completed_at || a.status !== 'not_started')
          .map((a: any) => new Date(a.last_attempt_at || a.completed_at || a.updated_at || 0).getTime())))
        : null;

      // Filter out invalid dates (e.g. from 0)
      const validLastAssignmentActivity = lastAssignmentActivity && lastAssignmentActivity.getTime() > 0
        ? lastAssignmentActivity
        : null;

      // Debug raw sessions before we lose them


      // Check if student has ANY activity (game sessions OR vocab progress OR assignment progress)
      // 🔥 CRITICAL FIX: Include ALL activity types, not just game sessions!
      // Check if student has ANY activity (game sessions OR vocab progress OR assignment progress)
      // 🔥 CRITICAL FIX: Include ALL activity types, not just game sessions!
      // FIX: Use validLastAssignmentActivity (excludes 'not_started')
      // FIX: Use raw sessions to catch students who logged in but quit immediately (abandoned sessions)
      const hasAnyActivity = studentsWithRawSessions.has(studentId) || totalVocabExposures > 0 || validLastAssignmentActivity !== null;

      if (!hasAnyActivity) {
        // Check if student was created recently (within last 7 days)
        const studentCreatedAt = profile?.created_at ? new Date(profile.created_at) : null;
        const daysSinceCreation = studentCreatedAt
          ? (Date.now() - studentCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
          : 999;

        // If student was created within last 7 days and has no activity, don't flag as high risk
        if (daysSinceCreation <= 7) {
          return {
            studentId,
            studentName: profile?.display_name || 'Unknown Student',
            riskScore: 0.1, // Low risk - account is new
            riskLevel: 'low' as const,
            averageScore: 0,
            lastActive: null,
            riskFactors: ['New student account (no activity yet)'],
          };
        }

        // No activity and account is old = high risk
        return {
          studentId,
          studentName: profile?.display_name || 'Unknown Student',
          riskScore: 0.8,
          riskLevel: 'high' as const,
          averageScore: 0,
          lastActive: null,
          riskFactors: ['No activity in selected time period'],
        };
      }

      // Student has some activity - calculate accuracy
      let avgStudentAccuracy = 0;
      let lastActiveDate: Date | null = null;
      let sessionCount = studentSessions.length;

      if (studentSessions.length > 0) {
        // 🔧 FIXED: Calculate accuracy from words_correct / words_attempted
        // This matches how the student dashboard calculates accuracy correctly
        const totalWordsAttempted = studentSessions.reduce((sum: number, s: any) => sum + (s.words_attempted || 0), 0);
        const totalWordsCorrect = studentSessions.reduce((sum: number, s: any) => sum + (s.words_correct || 0), 0);
        avgStudentAccuracy = totalWordsAttempted > 0
          ? (totalWordsCorrect / totalWordsAttempted) * 100
          : 0;

        const lastSession = studentSessions.sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        lastActiveDate = new Date(lastSession.created_at);
      }

      // Use vocab progress as supplement/fallback
      if (avgStudentAccuracy === 0 && totalVocabExposures > 0) {
        avgStudentAccuracy = (totalVocabCorrect / totalVocabExposures) * 100;
        sessionCount = new Set(studentVocabProgress.map((v: any) => v.assignment_id)).size;
      }

      // Use assignment progress as final fallback
      if (avgStudentAccuracy === 0 && studentAssignmentProgress.length > 0) {
        const completedAssignments = studentAssignmentProgress.filter((a: any) =>
          (a.status === 'completed' || parseFloat(a.best_accuracy) > 0)
        );

        if (completedAssignments.length > 0) {
          avgStudentAccuracy = completedAssignments.reduce((sum: number, a: any) =>
            sum + (parseFloat(a.best_accuracy) || parseFloat(a.best_score) || 0), 0) / completedAssignments.length;
        }
      }

      // Determine last active from ALL sources (games, vocab, assignments)
      // 🔥 CRITICAL FIX: Check ALL activity types to get accurate last active date
      if (!lastActiveDate && lastVocabActivity) {
        lastActiveDate = lastVocabActivity;
      } else if (lastActiveDate && lastVocabActivity && lastVocabActivity > lastActiveDate) {
        lastActiveDate = lastVocabActivity;
      }

      if (!lastActiveDate && validLastAssignmentActivity) {
        lastActiveDate = validLastAssignmentActivity;
      } else if (lastActiveDate && validLastAssignmentActivity && validLastAssignmentActivity > lastActiveDate) {
        lastActiveDate = validLastAssignmentActivity;
      }

      // Final fallback: Use raw session date if we have one (for abandoned sessions)
      if (!lastActiveDate) {
        const rawDate = lastRawSessionDateMap.get(studentId);
        if (rawDate) lastActiveDate = rawDate;
      }

      // At this point lastActiveDate should not be null since we verified hasAnyActivity above
      const daysSinceActive = lastActiveDate
        ? (Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
        : 30;

      // Calculate risk factors (0-1 scale)
      const lowAccuracy = avgStudentAccuracy < 60 ? (60 - avgStudentAccuracy) / 60 : 0;

      // Low engagement: Use combined session count (game sessions + vocab activities + completed assignments)
      const completedAssignmentCount = studentAssignmentProgress.filter((a: any) => a.status === 'completed').length;
      const effectiveSessionCount = Math.max(studentSessions.length, sessionCount, completedAssignmentCount);
      const lowEngagement = effectiveSessionCount < 3 ? (3 - effectiveSessionCount) / 3 : 0;

      const inactivity = daysSinceActive > 7 ? Math.min(daysSinceActive / 30, 1) : 0;

      // Declining trend (compare first half vs second half)
      // Only calculate if student has at least 4 sessions (need 2+ in each half for meaningful comparison)
      // 🔧 FIXED: Calculate trend from words_correct / words_attempted instead of accuracy_percentage
      let decliningTrend = 0;
      if (studentSessions.length >= 4) {
        const midpoint = Math.floor(studentSessions.length / 2);
        const firstHalf = studentSessions.slice(0, midpoint);
        const secondHalf = studentSessions.slice(midpoint);

        // Calculate accuracy for first half
        const firstHalfAttempted = firstHalf.reduce((sum: number, s: any) => sum + (s.words_attempted || 0), 0);
        const firstHalfCorrect = firstHalf.reduce((sum: number, s: any) => sum + (s.words_correct || 0), 0);
        const firstHalfAvg = firstHalfAttempted > 0 ? (firstHalfCorrect / firstHalfAttempted) * 100 : 0;

        // Calculate accuracy for second half
        const secondHalfAttempted = secondHalf.reduce((sum: number, s: any) => sum + (s.words_attempted || 0), 0);
        const secondHalfCorrect = secondHalf.reduce((sum: number, s: any) => sum + (s.words_correct || 0), 0);
        const secondHalfAvg = secondHalfAttempted > 0 ? (secondHalfCorrect / secondHalfAttempted) * 100 : 0;

        decliningTrend = firstHalfAvg > secondHalfAvg ? (firstHalfAvg - secondHalfAvg) / 100 : 0;
      }

      // Mastery stagnation (TODO: requires VocabMaster data)
      const masteryStagnation = 0;

      // Calculate weighted risk score
      // Increased weight for low accuracy (0.4) to prioritize struggling students
      const riskScore = (
        lowAccuracy * 0.4 +
        lowEngagement * 0.2 +
        decliningTrend * 0.2 +
        inactivity * 0.15 +
        masteryStagnation * 0.05
      );

      // Determine risk level
      let riskLevel: 'critical' | 'high' | 'medium' | 'low';
      if (riskScore >= 0.7) riskLevel = 'critical';
      else if (riskScore >= 0.5) riskLevel = 'high';
      else if (riskScore >= 0.15) riskLevel = 'medium';  // Lowered to 0.15 to catch students with <40% accuracy
      else riskLevel = 'low';

      // Build risk factors list
      const riskFactors: string[] = [];
      if (lowAccuracy > 0.3) riskFactors.push(`Low accuracy (${Math.round(avgStudentAccuracy)}%)`);
      if (lowEngagement > 0.3) riskFactors.push(`Low engagement (${effectiveSessionCount} activities)`);
      if (inactivity > 0.3) riskFactors.push(`Inactive for ${Math.round(daysSinceActive)} days`);
      if (decliningTrend > 0.1) riskFactors.push('Declining performance trend');



      return {
        studentId,
        studentName: profile?.display_name || 'Unknown Student',
        riskScore,
        riskLevel,
        averageScore: Math.round(avgStudentAccuracy),
        lastActive: lastActiveDate,
        riskFactors,
      };
    }));

    // Separate students into two groups:
    // 1. Students who have NEVER logged in (no sessions at all)
    // 2. Students who ARE active but struggling (low accuracy, declining performance, etc.)

    const studentsNeverLoggedIn = studentRiskScores.filter((s: any) => s.lastActive === null);
    const activeStudentsAtRisk = studentRiskScores
      .filter((s: any) => s.lastActive !== null && s.riskScore >= 0.3) // Has sessions AND medium+ risk
      .sort((a: any, b: any) => b.riskScore - a.riskScore)
      .slice(0, 5);



    // Calculate class average from student averages (not session averages)
    const studentsWithSessions = studentRiskScores.filter((s: any) => s.averageScore > 0);
    const classAverage = studentsWithSessions.length > 0
      ? Math.round(studentsWithSessions.reduce((sum: number, s: any) => sum + s.averageScore, 0) / studentsWithSessions.length)
      : 0;

    // Build response data
    const data: ClassSummaryData = {
      topMetrics: {
        averageScore: classAverage,
        assignmentsOverdue: overdueCount,
        currentStreak: currentStreak,
        trendPercentage: 0, // TODO: Calculate trend
        trendDirection: 'stable',
        activeStudents: activeStudentCount,
        totalStudents: studentIds.length,
        studentsNeverLoggedIn: studentsNeverLoggedIn.length,
      },
      urgentInterventions: activeStudentsAtRisk,
      studentsNeverLoggedIn: studentsNeverLoggedIn,
      topClassWeakness: await calculateTopClassWeakness(supabase, studentIds, dateFilter),
      recentAssignments: (assignments || []).map((a: any) => {
        const progress = a.enhanced_assignment_progress || [];
        const completed = progress.filter((p: any) => p.status === 'completed').length;
        const avgScore = progress.length > 0
          ? progress.reduce((sum: number, p: any) => sum + (parseFloat(p.best_score) || 0), 0) / progress.length
          : 0;

        return {
          assignmentId: a.id,
          assignmentName: a.title,
          averageScore: Math.round(avgScore),
          efficacy: avgScore >= 75 ? 'high' as const : avgScore >= 60 ? 'medium' as const : 'low' as const,
          status: completed === totalStudents ? 'complete' as const : 'in-progress' as const,
          completedCount: completed,
          totalStudents: totalStudents,
          dueDate: a.due_date ? new Date(a.due_date) : null,
        };
      }),
    };



    return NextResponse.json({
      success: true,
      data,
      timeRange,
      generatedAt: new Date(),

    });
  } catch (error) {
    console.error('Error in class-summary API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


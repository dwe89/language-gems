// =====================================================
// API ROUTE: CLASS SUMMARY (TIER 1)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
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

// Helper to calculate top class weakness
async function calculateTopClassWeakness(
  supabaseClient: any,
  studentIds: string[],
  dateFilter: Date
): Promise<any> {
  if (studentIds.length === 0) return null;

  // Get all game sessions with category/subcategory data
  const { data: sessions, error } = await supabaseClient
    .from('enhanced_game_sessions')
    .select('category, subcategory, game_type, accuracy_percentage, created_at, student_id')
    .in('student_id', studentIds)
    .gte('created_at', dateFilter.toISOString())
    .not('category', 'is', null);

  if (error || !sessions || sessions.length === 0) {
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

    const accuracy = parseFloat(session.accuracy_percentage) || 0;
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
    console.time('⏱️ [API] class-summary');

    const searchParams = request.nextUrl.searchParams;
    const teacherId = searchParams.get('teacherId');
    const classId = searchParams.get('classId') || undefined;
    const timeRange = (searchParams.get('timeRange') as TimeRange) || 'last_30_days';

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    const dateFilter = getDateFilter(timeRange);

    // STEP 1: Get all students for this teacher
    // First get classes for this teacher
    let classesQuery = supabase
      .from('classes')
      .select('id')
      .eq('teacher_id', teacherId);

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
        topClassWeakness: null,
        recentAssignments: [],
      };

      console.timeEnd('⏱️ [API] class-summary');
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
    const { data: gameSessions, error: sessionsError } = await supabase
      .from('enhanced_game_sessions')
      .select('student_id, final_score, accuracy_percentage, created_at, duration_seconds')
      .in('student_id', studentIds)
      .gte('created_at', dateFilter.toISOString());

    if (sessionsError) {
      console.error('Error fetching game sessions:', sessionsError);
    }

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

    // STEP 4: Calculate metrics
    const sessions = gameSessions || [];
    const avgScore = sessions.length > 0
      ? sessions.reduce((sum: number, s: any) => sum + (s.final_score || 0), 0) / sessions.length
      : 0;

    const avgAccuracy = sessions.length > 0
      ? sessions.reduce((sum: number, s: any) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / sessions.length
      : 0;

    // Count active students (played in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeStudents = new Set(
      sessions.filter((s: any) => new Date(s.created_at) >= sevenDaysAgo).map((s: any) => s.student_id)
    ).size;

    // Count overdue assignments
    const now = new Date();
    const overdueCount = (assignments || []).filter((a: any) => {
      if (!a.due_date) return false;
      return new Date(a.due_date) < now;
    }).length;

    // Calculate streak (simplified - days with activity)
    const uniqueDays = new Set(
      sessions.map((s: any) => new Date(s.created_at).toDateString())
    );
    const currentStreak = uniqueDays.size;

    // STEP 5: Calculate risk scores for each student
    const studentRiskScores = studentIds.map((studentId: string) => {
      const studentSessions = sessions.filter((s: any) => s.student_id === studentId);
      const profile = studentProfileMap.get(studentId);

      if (studentSessions.length === 0) {
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

      // Calculate metrics
      const avgStudentAccuracy = studentSessions.reduce((sum: number, s: any) =>
        sum + (parseFloat(s.accuracy_percentage) || 0), 0) / studentSessions.length;

      const lastSession = studentSessions.sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      const lastActiveDate = new Date(lastSession.created_at);
      const daysSinceActive = (Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24);

      // Calculate risk factors (0-1 scale)
      const lowAccuracy = avgStudentAccuracy < 60 ? (60 - avgStudentAccuracy) / 60 : 0;
      const lowEngagement = studentSessions.length < 5 ? (5 - studentSessions.length) / 5 : 0;
      const inactivity = daysSinceActive > 7 ? Math.min(daysSinceActive / 30, 1) : 0;

      // Declining trend (compare first half vs second half)
      const midpoint = Math.floor(studentSessions.length / 2);
      const firstHalf = studentSessions.slice(0, midpoint);
      const secondHalf = studentSessions.slice(midpoint);
      const firstHalfAvg = firstHalf.length > 0
        ? firstHalf.reduce((sum: number, s: any) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / firstHalf.length
        : 0;
      const secondHalfAvg = secondHalf.length > 0
        ? secondHalf.reduce((sum: number, s: any) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / secondHalf.length
        : 0;
      const decliningTrend = firstHalfAvg > secondHalfAvg ? (firstHalfAvg - secondHalfAvg) / 100 : 0;

      // Mastery stagnation (TODO: requires VocabMaster data)
      const masteryStagnation = 0;

      // Calculate weighted risk score
      const riskScore = (
        lowAccuracy * 0.25 +
        lowEngagement * 0.25 +
        decliningTrend * 0.2 +
        inactivity * 0.2 +
        masteryStagnation * 0.1
      );

      // Determine risk level
      let riskLevel: 'critical' | 'high' | 'medium' | 'low';
      if (riskScore >= 0.7) riskLevel = 'critical';
      else if (riskScore >= 0.5) riskLevel = 'high';
      else if (riskScore >= 0.3) riskLevel = 'medium';
      else riskLevel = 'low';

      // Build risk factors list
      const riskFactors: string[] = [];
      if (lowAccuracy > 0.3) riskFactors.push(`Low accuracy (${Math.round(avgStudentAccuracy)}%)`);
      if (lowEngagement > 0.3) riskFactors.push(`Low engagement (${studentSessions.length} sessions)`);
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
    });

    // Get top 5 urgent interventions (highest risk scores)
    const urgentInterventions = studentRiskScores
      .filter((s: any) => s.riskScore >= 0.3) // Only show medium+ risk
      .sort((a: any, b: any) => b.riskScore - a.riskScore)
      .slice(0, 5);

    // Build response data
    const data: ClassSummaryData = {
      topMetrics: {
        averageScore: Math.round(avgAccuracy),
        assignmentsOverdue: overdueCount,
        currentStreak: currentStreak,
        trendPercentage: 0, // TODO: Calculate trend
        trendDirection: 'stable',
      },
      urgentInterventions: urgentInterventions,
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

    console.timeEnd('⏱️ [API] class-summary');

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


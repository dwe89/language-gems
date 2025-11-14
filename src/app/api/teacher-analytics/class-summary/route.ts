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
    const viewScope = searchParams.get('viewScope') || 'my';
    const schoolCode = searchParams.get('schoolCode') || undefined;

    console.log(`📊 [DEBUG] API called with teacherId: ${teacherId}, classId: ${classId || 'all'}, timeRange: ${timeRange}, viewScope: ${viewScope}, schoolCode: ${schoolCode}`);

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
    console.log(`📊 [DEBUG] Found ${classIds.length} classes for teacher ${teacherId}:`, classIds);

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
    console.log(`📊 [DEBUG] Found ${totalStudents} students enrolled in these classes`);
    console.log(`📊 [DEBUG] Is Asher in studentIds?`, studentIds.includes('ac794722-1818-4cd1-8c19-2abbe0b16d88'));

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
    const { data: gameSessions, error: sessionsError } = await supabase
      .from('enhanced_game_sessions')
      .select('student_id, final_score, accuracy_percentage, created_at, duration_seconds, words_attempted, game_type')
      .in('student_id', studentIds)
      .gte('created_at', dateFilter.toISOString())
      .order('created_at', { ascending: false })
      .limit(50000); // Increase limit to handle large classes (165 students * ~300 sessions each)

    // Filter out:
    // 1. Abandoned sessions (student quit immediately without playing)
    // 2. Memory game sessions (luck-based, not skill-based)
    const activeSessions = gameSessions?.filter((s: any) =>
      (s.accuracy_percentage > 0 || s.words_attempted > 0) &&
      s.game_type !== 'memory-game'
    ) || [];

    if (sessionsError) {
      console.error('Error fetching game sessions:', sessionsError);
    }

    console.log(`📊 [DEBUG] Fetched ${gameSessions?.length || 0} total sessions, ${activeSessions.length} active sessions (filtered out abandoned) for ${studentIds.length} students`);

    // Check specifically for Asher
    const asherSessions = activeSessions.filter(s => s.student_id === 'ac794722-1818-4cd1-8c19-2abbe0b16d88');
    console.log(`📊 [DEBUG] Asher Bannatyne active sessions:`, asherSessions.length, asherSessions.map(s => ({ created_at: s.created_at, accuracy: s.accuracy_percentage })));

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
    const studentRiskScores = await Promise.all(studentIds.map(async (studentId: string) => {
      const studentSessions = sessions.filter((s: any) => s.student_id === studentId);
      const profile = studentProfileMap.get(studentId);

      const isAsher = studentId === 'ac794722-1818-4cd1-8c19-2abbe0b16d88';
      if (isAsher) {
        console.log(`🔍 [ASHER DEBUG] Found ${studentSessions.length} sessions for Asher`);
        console.log(`🔍 [ASHER DEBUG] Sessions:`, studentSessions.map(s => ({ created_at: s.created_at, accuracy: s.accuracy_percentage })));
      }

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

      // Calculate metrics from sessions
      let avgStudentAccuracy = studentSessions.reduce((sum: number, s: any) =>
        sum + (parseFloat(s.accuracy_percentage) || 0), 0) / studentSessions.length;

      if (isAsher) {
        console.log(`🔍 [ASHER DEBUG] Initial avgStudentAccuracy from sessions: ${avgStudentAccuracy}%`);
      }

      // FALLBACK: If all sessions have 0% accuracy (broken sessions), use vocabulary_gem_collection data
      if (avgStudentAccuracy === 0) {
        const { data: vocabData } = await supabase
          .from('vocabulary_gem_collection')
          .select('total_encounters, correct_encounters')
          .eq('student_id', studentId)
          .gte('last_encountered_at', dateFilter);

        if (isAsher) {
          console.log(`🔍 [ASHER DEBUG] Vocab fallback data:`, vocabData);
        }

        if (vocabData && vocabData.length > 0) {
          const totalEncounters = vocabData.reduce((sum, v) => sum + (v.total_encounters || 0), 0);
          const correctEncounters = vocabData.reduce((sum, v) => sum + (v.correct_encounters || 0), 0);
          if (totalEncounters > 0) {
            avgStudentAccuracy = (correctEncounters / totalEncounters) * 100;
            if (isAsher) {
              console.log(`🔍 [ASHER DEBUG] Calculated accuracy from vocab: ${avgStudentAccuracy}% (${correctEncounters}/${totalEncounters})`);
            }
          }
        }
      }

      const lastSession = studentSessions.sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      const lastActiveDate = new Date(lastSession.created_at);
      const daysSinceActive = (Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24);

      // Calculate risk factors (0-1 scale)
      const lowAccuracy = avgStudentAccuracy < 60 ? (60 - avgStudentAccuracy) / 60 : 0;

      // Low engagement: Only flag if < 3 sessions (students with 1-2 sessions are just new)
      const lowEngagement = studentSessions.length < 3 ? (3 - studentSessions.length) / 3 : 0;

      const inactivity = daysSinceActive > 7 ? Math.min(daysSinceActive / 30, 1) : 0;

      // Declining trend (compare first half vs second half)
      // Only calculate if student has at least 4 sessions (need 2+ in each half for meaningful comparison)
      let decliningTrend = 0;
      if (studentSessions.length >= 4) {
        const midpoint = Math.floor(studentSessions.length / 2);
        const firstHalf = studentSessions.slice(0, midpoint);
        const secondHalf = studentSessions.slice(midpoint);
        const firstHalfAvg = firstHalf.length > 0
          ? firstHalf.reduce((sum: number, s: any) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / firstHalf.length
          : 0;
        const secondHalfAvg = secondHalf.length > 0
          ? secondHalf.reduce((sum: number, s: any) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / secondHalf.length
          : 0;
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
      if (lowEngagement > 0.3) riskFactors.push(`Low engagement (${studentSessions.length} sessions)`);
      if (inactivity > 0.3) riskFactors.push(`Inactive for ${Math.round(daysSinceActive)} days`);
      if (decliningTrend > 0.1) riskFactors.push('Declining performance trend');

      if (isAsher) {
        console.log(`🔍 [ASHER DEBUG] Final risk calculation:`, {
          avgStudentAccuracy,
          riskScore,
          riskLevel,
          riskFactors,
          lastActive: lastActiveDate,
        });
      }

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

    console.log(`📊 [DEBUG] Students never logged in: ${studentsNeverLoggedIn.length}`);
    console.log(`📊 [DEBUG] Active students at risk: ${activeStudentsAtRisk.length}`);

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

    console.timeEnd('⏱️ [API] class-summary');

    return NextResponse.json({
      success: true,
      data,
      timeRange,
      generatedAt: new Date(),
      debug: {
        teacherId,
        classId: classId || 'all',
        totalClasses: classIds.length,
        totalStudents: studentIds.length,
        totalSessions: gameSessions?.length || 0,
        dateFilter: dateFilter.toISOString(),
      },
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


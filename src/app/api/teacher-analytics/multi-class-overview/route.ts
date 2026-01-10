// =====================================================
// API ROUTE: MULTI-CLASS OVERVIEW
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ClassHealthMetrics {
  classId: string;
  className: string;
  totalStudents: number;
  activeStudents: number;
  averageScore: number;
  completionRate: number;
  studentsNeverLoggedIn: number;
  status: 'healthy' | 'warning' | 'critical';
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teacherId = searchParams.get('teacherId');
    const viewScope = searchParams.get('viewScope') || 'my';
    const schoolCode = searchParams.get('schoolCode') || undefined;

    if (!teacherId) {
      return NextResponse.json(
        { success: false, error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    // STEP 1: Get all classes for this teacher or school
    let classesQuery;

    if (viewScope === 'school' && schoolCode) {
      // Get all classes in the school
      const { data: teacherProfiles } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('school_code', schoolCode)
        .in('role', ['teacher', 'admin']);

      const teacherIds = teacherProfiles?.map(t => t.user_id) || [];

      classesQuery = supabase
        .from('classes')
        .select('id, name, teacher_id')
        .in('teacher_id', teacherIds);
    } else {
      // Get classes for this teacher only
      classesQuery = supabase
        .from('classes')
        .select('id, name, teacher_id')
        .eq('teacher_id', teacherId);
    }

    const { data: classes, error: classesError } = await classesQuery;

    if (classesError) {
      console.error('Error fetching classes:', classesError);
      throw new Error('Failed to fetch classes');
    }

    if (!classes || classes.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          totalStudents: 0,
          totalActiveStudents: 0,
          overallAverageScore: 0,
          overallCompletionRate: 0,
          totalStudentsNeverLoggedIn: 0,
          totalClassesWithIssues: 0,
          classes: [],
        },
      });
    }

    const classIds = classes.map(c => c.id);

    // STEP 2: Get enrollments for all classes
    const { data: enrollments } = await supabase
      .from('class_enrollments')
      .select('class_id, student_id')
      .in('class_id', classIds)
      .eq('status', 'active');

    const allStudentIds = enrollments?.map(e => e.student_id) || [];

    // STEP 3: Get activity data (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get game sessions for activity
    const { data: gameSessions } = await supabase
      .from('enhanced_game_sessions')
      .select('student_id, accuracy_percentage, words_attempted, created_at')
      .in('student_id', allStudentIds)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .gt('words_attempted', 0);

    // Get assignment progress
    const { data: assignmentProgress } = await supabase
      .from('enhanced_assignment_progress')
      .select('student_id, status, best_score')
      .in('student_id', allStudentIds);

    // STEP 4: Calculate metrics for each class
    const classMetrics: ClassHealthMetrics[] = classes.map(classInfo => {
      // Get students for this class
      const classEnrollments = enrollments?.filter(e => e.class_id === classInfo.id) || [];
      const classStudentIds = classEnrollments.map(e => e.student_id);
      const totalStudents = classStudentIds.length;

      if (totalStudents === 0) {
        return {
          classId: classInfo.id,
          className: classInfo.name,
          totalStudents: 0,
          activeStudents: 0,
          averageScore: 0,
          completionRate: 0,
          studentsNeverLoggedIn: 0,
          status: 'warning' as const,
        };
      }

      // Active students (played in last 30 days)
      const classStudentIdSet = new Set(classStudentIds);
      const activeStudentIds = new Set(
        gameSessions?.filter(s => classStudentIdSet.has(s.student_id)).map(s => s.student_id) || []
      );
      const activeStudents = activeStudentIds.size;

      // Students who never logged in
      const studentsWithActivity = new Set([
        ...activeStudentIds,
        ...(assignmentProgress?.filter(p => classStudentIdSet.has(p.student_id)).map(p => p.student_id) || [])
      ]);
      const studentsNeverLoggedIn = totalStudents - studentsWithActivity.size;

      // Average score from game sessions
      const classGameSessions = gameSessions?.filter(s => classStudentIdSet.has(s.student_id)) || [];
      const averageScore = classGameSessions.length > 0
        ? Math.round(
          classGameSessions.reduce((sum, s) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / classGameSessions.length
        )
        : 0;

      // Completion rate from assignments
      const classAssignmentProgress = assignmentProgress?.filter(p => classStudentIdSet.has(p.student_id)) || [];
      const completedAssignments = classAssignmentProgress.filter(p => p.status === 'completed').length;
      const completionRate = classAssignmentProgress.length > 0
        ? Math.round((completedAssignments / classAssignmentProgress.length) * 100)
        : 0;

      // Determine status
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (studentsNeverLoggedIn > totalStudents * 0.5 || activeStudents < totalStudents * 0.3) {
        status = 'critical';
      } else if (
        studentsNeverLoggedIn > 0 ||
        activeStudents < totalStudents * 0.6 ||
        averageScore < 60 ||
        completionRate < 50
      ) {
        status = 'warning';
      }

      return {
        classId: classInfo.id,
        className: classInfo.name,
        totalStudents,
        activeStudents,
        averageScore,
        completionRate,
        studentsNeverLoggedIn,
        status,
      };
    });

    // STEP 5: Calculate overall metrics
    const totalStudents = classMetrics.reduce((sum, c) => sum + c.totalStudents, 0);
    const totalActiveStudents = classMetrics.reduce((sum, c) => sum + c.activeStudents, 0);
    const totalStudentsNeverLoggedIn = classMetrics.reduce((sum, c) => sum + c.studentsNeverLoggedIn, 0);
    const totalClassesWithIssues = classMetrics.filter(c => c.status === 'warning' || c.status === 'critical').length;

    // Weighted average score
    const totalScoreWeight = classMetrics.reduce((sum, c) => sum + (c.averageScore * c.totalStudents), 0);
    const overallAverageScore = totalStudents > 0 ? Math.round(totalScoreWeight / totalStudents) : 0;

    // Weighted completion rate
    const totalCompletionWeight = classMetrics.reduce((sum, c) => sum + (c.completionRate * c.totalStudents), 0);
    const overallCompletionRate = totalStudents > 0 ? Math.round(totalCompletionWeight / totalStudents) : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalActiveStudents,
        overallAverageScore,
        overallCompletionRate,
        totalStudentsNeverLoggedIn,
        totalClassesWithIssues,
        classes: classMetrics,
      },
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error in multi-class-overview API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// API ROUTE: ASSIGNMENT ANALYSIS (TIER 3)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { 
  TimeRange, 
  AssignmentAnalysisData, 
  QuestionBreakdown, 
  DistractorAnalysis 
} from '@/types/teacherAnalytics';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getDateFilter(timeRange: TimeRange): Date {
  const now = new Date();
  switch (timeRange) {
    case 'last_7_days': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'last_30_days': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'current_term': return new Date(now.getTime() - 84 * 24 * 60 * 60 * 1000);
    case 'all_time': return new Date(0);
    default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

export async function GET(request: NextRequest) {
  console.time('⏱️ [API] assignment-analysis');
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const timeRange = (searchParams.get('timeRange') as TimeRange) || 'last_30_days';

    if (!assignmentId) {
      return NextResponse.json({ success: false, error: 'assignmentId is required' }, { status: 400 });
    }

    const dateFilter = getDateFilter(timeRange);

    // Fetch assignment details
    const { data: assignment } = await supabase
      .from('assignments')
      .select('id, title, created_at, game_type, type, class_id')
      .eq('id', assignmentId)
      .single();

    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });
    }

    // Get ALL enrolled students from the class, not just those who started
    const { data: enrolledStudents } = await supabase
      .from('class_enrollments')
      .select('student_id')
      .eq('class_id', assignment.class_id)
      .eq('status', 'active');

    const allStudentIds = enrolledStudents?.map(e => e.student_id) || [];

    // Fetch assignment progress for all students
    const { data: progress } = await supabase
      .from('enhanced_assignment_progress')
      .select('student_id, status, score, time_spent_seconds, attempts, created_at, updated_at')
      .eq('assignment_id', assignmentId)
      .gte('created_at', dateFilter.toISOString());

    const allProgress = progress || [];
    const completedProgress = allProgress.filter(p => p.status === 'completed');

    // Create a map of student progress
    const progressMap = new Map(allProgress.map(p => [p.student_id, p]));

    // Fetch student names for ALL enrolled students
    const { data: students } = await supabase
      .from('user_profiles')
      .select('user_id, display_name')
      .in('user_id', allStudentIds);

    const studentMap = new Map(students?.map(s => [s.user_id, s.display_name]) || []);

    // Calculate summary metrics with ALL enrolled students
    const totalStudents = allStudentIds.length;
    const completedCount = completedProgress.length;
    const completionRate = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;
    const averageScore = completedProgress.length > 0
      ? Math.round(completedProgress.reduce((sum, p) => sum + (p.score || 0), 0) / completedProgress.length)
      : 0;
    const averageTimeMinutes = completedProgress.length > 0
      ? Math.round(completedProgress.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0) / completedProgress.length / 60)
      : 0;
    const strugglingStudents = completedProgress.filter(p => (p.score || 0) < 60).length;

    // Build student performance list for ALL enrolled students
    const studentPerformance = allStudentIds.map(studentId => {
      const studentProgress = allProgress.filter(p => p.student_id === studentId);
      const latestProgress = studentProgress.length > 0
        ? studentProgress.sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          )[0]
        : null;

      return {
        studentId,
        studentName: studentMap.get(studentId) || 'Unknown Student',
        status: latestProgress ? latestProgress.status as 'not-started' | 'in-progress' | 'completed' : 'not-started',
        score: latestProgress && latestProgress.status === 'completed' ? latestProgress.score : null,
        timeSpentMinutes: latestProgress && latestProgress.time_spent_seconds
          ? Math.round(latestProgress.time_spent_seconds / 60) 
          : null,
        attempts: studentProgress.length,
        lastAttempt: latestProgress ? new Date(latestProgress.updated_at) : null
      };
    }).sort((a, b) => {
      // Sort: completed first, then by score descending
      if (a.status === 'completed' && b.status !== 'completed') return -1;
      if (a.status !== 'completed' && b.status === 'completed') return 1;
      return (b.score || 0) - (a.score || 0);
    });

    // Question breakdown - only include for quiz-style assignments with actual questions
    // For vocabulary/multi-game assignments, this data doesn't apply
    // TODO: Implement real question tracking for quiz assignments
    let questionBreakdown: QuestionBreakdown[] | undefined;
    const distractorAnalysis: DistractorAnalysis[] = [];

    const data: AssignmentAnalysisData = {
      assignmentInfo: {
        assignmentId,
        assignmentName: assignment.title,
        description: null,
        completedCount,
        totalStudents,
        averageScore,
        efficacy: averageScore >= 75 ? 'high' : averageScore >= 60 ? 'medium' : 'low',
        dueDate: null,
        createdAt: new Date(assignment.created_at)
      },
      questionBreakdown,
      distractorAnalysis,
      timeDistribution: {
        buckets: [],
        average: averageTimeMinutes,
        median: averageTimeMinutes,
        min: 0,
        max: 0,
        wideDistribution: false
      }
    };

    // Add backward compatibility fields for the UI
    const compatibilityData: Record<string, any> = {
      ...data,
      assignmentId,
      assignmentName: assignment.title,
      totalStudents,
      completedCount,
      completionRate,
      averageScore,
      averageTimeMinutes,
      strugglingStudents,
      studentPerformance
    };

    // Only include questionBreakdown if it exists (quiz-style assignments)
    if (questionBreakdown && questionBreakdown.length > 0) {
      compatibilityData.questionBreakdown = questionBreakdown.map((q: QuestionBreakdown) => ({
        ...q,
        questionText: q.questionPreview,
        successRate: q.accuracy,
        averageTimeSeconds: 45,
        minTimeSeconds: 20,
        maxTimeSeconds: 120,
        distractorAnalysis: [
          { answer: 'Common wrong answer 1', count: 3, percentage: 15 },
          { answer: 'Common wrong answer 2', count: 2, percentage: 10 }
        ]
      }));
    }

    console.timeEnd('⏱️ [API] assignment-analysis');
    return NextResponse.json({ success: true, data: compatibilityData, timeRange, generatedAt: new Date() });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

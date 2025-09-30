// API ROUTE: ASSIGNMENT ANALYSIS (TIER 3)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { TimeRange, AssignmentAnalysisData } from '@/types/teacherAnalytics';

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
      .select('id, title, created_at, game_type, type')
      .eq('id', assignmentId)
      .single();

    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });
    }

    // Fetch assignment progress for all students
    const { data: progress } = await supabase
      .from('enhanced_assignment_progress')
      .select('student_id, status, score, time_spent_seconds, attempts, created_at, updated_at')
      .eq('assignment_id', assignmentId)
      .gte('created_at', dateFilter.toISOString());

    const allProgress = progress || [];
    const completedProgress = allProgress.filter(p => p.status === 'completed');

    // Fetch student names
    const studentIds = [...new Set(allProgress.map(p => p.student_id))];
    const { data: students } = await supabase
      .from('user_profiles')
      .select('user_id, display_name')
      .in('user_id', studentIds);

    const studentMap = new Map(students?.map(s => [s.user_id, s.display_name]) || []);

    // Calculate summary metrics
    const totalStudents = studentIds.length;
    const completedCount = completedProgress.length;
    const completionRate = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;
    const averageScore = completedProgress.length > 0
      ? Math.round(completedProgress.reduce((sum, p) => sum + (p.score || 0), 0) / completedProgress.length)
      : 0;
    const averageTimeMinutes = completedProgress.length > 0
      ? Math.round(completedProgress.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0) / completedProgress.length / 60)
      : 0;
    const strugglingStudents = completedProgress.filter(p => (p.score || 0) < 60).length;

    // Build student performance list
    const studentPerformance = studentIds.map(studentId => {
      const studentProgress = allProgress.filter(p => p.student_id === studentId);
      const latestProgress = studentProgress.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )[0];

      return {
        studentId,
        studentName: studentMap.get(studentId) || 'Unknown Student',
        status: latestProgress.status as 'not-started' | 'in-progress' | 'completed',
        score: latestProgress.status === 'completed' ? latestProgress.score : null,
        timeSpentMinutes: latestProgress.time_spent_seconds 
          ? Math.round(latestProgress.time_spent_seconds / 60) 
          : null,
        attempts: studentProgress.length,
        lastAttempt: new Date(latestProgress.updated_at)
      };
    }).sort((a, b) => {
      // Sort: completed first, then by score descending
      if (a.status === 'completed' && b.status !== 'completed') return -1;
      if (a.status !== 'completed' && b.status === 'completed') return 1;
      return (b.score || 0) - (a.score || 0);
    });

    // Question breakdown (placeholder - would need actual question data)
    const questionBreakdown = [
      {
        questionNumber: 1,
        questionText: 'Sample question text (requires question data schema)',
        successRate: 85,
        correctCount: Math.round(completedCount * 0.85),
        totalAttempts: completedCount,
        averageTimeSeconds: 45,
        minTimeSeconds: 20,
        maxTimeSeconds: 120,
        distractorAnalysis: [
          { answer: 'Common wrong answer 1', count: 3, percentage: 15 },
          { answer: 'Common wrong answer 2', count: 2, percentage: 10 }
        ]
      }
    ];

    const data: AssignmentAnalysisData = {
      assignmentId,
      assignmentName: assignment.title,
      totalStudents,
      completedCount,
      completionRate,
      averageScore,
      averageTimeMinutes,
      strugglingStudents,
      questionBreakdown,
      studentPerformance
    };

    console.timeEnd('⏱️ [API] assignment-analysis');
    return NextResponse.json({ success: true, data, timeRange, generatedAt: new Date() });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/client';
import {
  TeacherAssignmentAnalyticsService,
  AssignmentOverviewMetrics,
  WordDifficulty,
  StudentProgress
} from '@/services/teacherAssignmentAnalytics';

interface AnalyticsResponseBody {
  overview: AssignmentOverviewMetrics;
  words: WordDifficulty[];
  students: StudentProgress[];
}

export async function GET(
  _request: Request,
  { params }: { params: { assignmentId: string } }
) {
  const { assignmentId } = params;

  if (!assignmentId) {
    return NextResponse.json(
      { error: 'Assignment ID is required' },
      { status: 400 }
    );
  }

  try {
    const supabaseAdmin = createServiceRoleClient();
    const analyticsService = new TeacherAssignmentAnalyticsService(supabaseAdmin);

    const [overview, words, students] = await Promise.all([
      analyticsService.getAssignmentOverview(assignmentId),
      analyticsService.getWordDifficultyRanking(assignmentId),
      analyticsService.getStudentRoster(assignmentId)
    ]);

    const body: AnalyticsResponseBody = { overview, words, students };

    return NextResponse.json(body);
  } catch (error: any) {
    console.error('❌ [API] Error fetching assignment analytics:', error);

    return NextResponse.json(
      {
        error: error?.message || 'Failed to load assignment analytics',
        details: error?.details ?? null,
        code: error?.code ?? null
      },
      { status: 500 }
    );
  }
}
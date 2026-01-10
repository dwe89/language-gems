import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
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
  const assignmentId = params.assignmentId?.trim();

  console.log('🔍 [API] Analytics request for assignment:', assignmentId);

  if (!assignmentId) {
    return NextResponse.json(
      { error: 'Assignment ID is required' },
      { status: 400 }
    );
  }

  try {
    const supabaseAdmin = createServiceRoleClient();
    const analyticsService = new TeacherAssignmentAnalyticsService(supabaseAdmin);

    // Check if this is an assessment assignment
    const { data: assignmentData } = await supabaseAdmin
      .from('assignments')
      .select('game_type, game_config')
      .eq('id', assignmentId)
      .single();

    const isAssessmentAssignment = assignmentData &&
      ((assignmentData as any).game_type === 'assessment' || (assignmentData as any).game_config?.assessmentConfig);

    const [overview, words, students] = await Promise.all([
      analyticsService.getAssignmentOverview(assignmentId),
      isAssessmentAssignment ? Promise.resolve([]) : analyticsService.getWordDifficultyRanking(assignmentId),
      analyticsService.getStudentRoster(assignmentId)
    ]);

    const body: AnalyticsResponseBody = {
      overview,
      words,
      students
    };

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
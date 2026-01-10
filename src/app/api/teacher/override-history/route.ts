import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');
    const assessmentType = searchParams.get('assessmentType');

    // Build query
    let query = supabase
      .from('teacher_score_overrides')
      .select(`
        id,
        assignment_id,
        student_id,
        assessment_type,
        original_score,
        original_max_score,
        override_score,
        override_max_score,
        reason,
        overridden_by,
        overridden_at,
        teacher:user_profiles!teacher_score_overrides_overridden_by_fkey(display_name)
      `)
      .order('overridden_at', { ascending: false });

    // Apply filters
    if (assignmentId) {
      query = query.eq('assignment_id', assignmentId);
    }
    if (studentId) {
      query = query.eq('student_id', studentId);
    }
    if (assessmentType) {
      query = query.eq('assessment_type', assessmentType);
    }

    const { data: overrides, error } = await query;

    if (error) {
      console.error('Error fetching override history:', error);
      throw error;
    }

    // Format the response
    const history = (overrides || []).map((override: any) => ({
      id: override.id,
      originalScore: override.original_score,
      originalMaxScore: override.original_max_score,
      originalPercentage: override.original_max_score > 0 
        ? Math.round((override.original_score / override.original_max_score) * 100)
        : 0,
      overrideScore: override.override_score,
      overrideMaxScore: override.override_max_score,
      overridePercentage: override.override_max_score > 0
        ? Math.round((override.override_score / override.override_max_score) * 100)
        : 0,
      reason: override.reason,
      overriddenBy: (override.teacher as any)?.display_name || 'Unknown Teacher',
      overriddenAt: override.overridden_at,
      assessmentType: override.assessment_type
    }));

    return NextResponse.json({
      success: true,
      history,
      count: history.length
    });

  } catch (error) {
    console.error('Error fetching override history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch override history' },
      { status: 500 }
    );
  }
}

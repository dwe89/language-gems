import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

interface OverrideScoreRequest {
  assignmentId: string;
  studentId: string;
  assessmentType: string;
  newScore: number;
  maxScore?: number;
  reason: string;
}

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body: OverrideScoreRequest = await request.json();
    const { assignmentId, studentId, assessmentType, newScore, maxScore = 100, reason } = body;

    // Validate required fields
    if (!assignmentId || !studentId || !assessmentType || newScore === undefined || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate score range
    if (newScore < 0 || newScore > maxScore) {
      return NextResponse.json(
        { error: `Score must be between 0 and ${maxScore}` },
        { status: 400 }
      );
    }

    // Validate reason length
    if (reason.trim().length < 10) {
      return NextResponse.json(
        { error: 'Reason must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Get current score from appropriate assessment table based on type
    let originalScore = 0;
    let originalMaxScore = maxScore;
    
    const tableConfig: Record<string, { table: string; scoreField: string; maxScoreField: string; idField: string }> = {
      'reading-comprehension': {
        table: 'reading_comprehension_results',
        scoreField: 'score',
        maxScoreField: 'total_questions',
        idField: 'user_id'
      },
      'aqa-reading': {
        table: 'aqa_reading_results',
        scoreField: 'raw_score',
        maxScoreField: 'total_possible_score',
        idField: 'student_id'
      },
      'aqa-listening': {
        table: 'aqa_listening_results',
        scoreField: 'raw_score',
        maxScoreField: 'total_possible_score',
        idField: 'student_id'
      },
      'aqa-dictation': {
        table: 'aqa_dictation_results',
        scoreField: 'total_points_earned',
        maxScoreField: 'total_points_possible',
        idField: 'student_id'
      }
    };

    const config = tableConfig[assessmentType];
    if (config) {
      const { data: resultData } = await supabase
        .from(config.table)
        .select(`${config.scoreField}, ${config.maxScoreField}`)
        .eq('assignment_id', assignmentId)
        .eq(config.idField, studentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (resultData) {
        originalScore = (resultData as any)[config.scoreField] || 0;
        originalMaxScore = (resultData as any)[config.maxScoreField] || maxScore;
      }
    }

    // Check for existing override
    const { data: existingOverride } = await supabase
      .from('teacher_score_overrides')
      .select('id')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .eq('assessment_type', assessmentType)
      .single();

    let overrideData;

    if (existingOverride) {
      // Update existing override
      const { data, error } = await supabase
        .from('teacher_score_overrides')
        .update({
          override_score: newScore,
          override_max_score: maxScore,
          reason,
          overridden_by: user.id,
          overridden_at: new Date().toISOString()
        })
        .eq('id', existingOverride.id)
        .select()
        .single();

      if (error) throw error;
      overrideData = data;
    } else {
      // Create new override
      const { data, error } = await supabase
        .from('teacher_score_overrides')
        .insert({
          assignment_id: assignmentId,
          student_id: studentId,
          assessment_type: assessmentType,
          original_score: originalScore,
          original_max_score: originalMaxScore,
          override_score: newScore,
          override_max_score: maxScore,
          reason,
          overridden_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      overrideData = data;
    }

    // Calculate percentages
    const originalPercentage = originalMaxScore > 0 
      ? Math.round((originalScore / originalMaxScore) * 100) 
      : 0;
    const overridePercentage = maxScore > 0 
      ? Math.round((newScore / maxScore) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      override: {
        id: overrideData.id,
        originalScore,
        originalMaxScore,
        originalPercentage,
        overrideScore: newScore,
        overrideMaxScore: maxScore,
        overridePercentage,
        reason,
        overriddenAt: overrideData.overridden_at
      }
    });

  } catch (error) {
    console.error('Error creating score override:', error);
    return NextResponse.json(
      { error: 'Failed to create score override' },
      { status: 500 }
    );
  }
}

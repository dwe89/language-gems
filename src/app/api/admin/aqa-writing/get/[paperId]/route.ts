import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/aqa-writing/get/[paperId]
 * Get a specific AQA writing paper with all its questions
 * Admin only endpoint
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { paperId: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { paperId } = params;

    if (!paperId) {
      return NextResponse.json(
        { error: 'Missing paperId parameter' },
        { status: 400 }
      );
    }

    // Get paper with all questions
    const { data: paper, error: paperError } = await supabase
      .from('aqa_writing_assessments')
      .select(`
        *,
        aqa_writing_questions (
          *
        )
      `)
      .eq('id', paperId)
      .single();

    if (paperError || !paper) {
      console.error('Error fetching paper:', paperError);
      return NextResponse.json(
        { error: 'Paper not found', details: paperError?.message },
        { status: 404 }
      );
    }

    // Calculate total marks
    const totalMarks = paper.aqa_writing_questions?.reduce(
      (sum: number, q: any) => sum + (q.marks || 0),
      0
    ) || paper.total_marks || 50;

    // Map database fields to expected API fields
    const paperWithStats = {
      ...paper,
      tier: paper.level,
      paper_number: paper.identifier,
      total_marks: totalMarks,
      questions: paper.aqa_writing_questions || []
    };

    return NextResponse.json({
      success: true,
      paper: paperWithStats
    });

  } catch (error: any) {
    console.error('Error in GET /api/admin/aqa-writing/get/[paperId]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


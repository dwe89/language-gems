import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/aqa-listening/get/[id]
 * Get a single AQA listening paper with all questions
 * Admin only endpoint
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;

    // Get paper
    const { data: paper, error: paperError } = await supabase
      .from('aqa_listening_assessments')
      .select('*')
      .eq('id', id)
      .single();

    if (paperError || !paper) {
      return NextResponse.json(
        { success: false, error: 'Paper not found' },
        { status: 404 }
      );
    }

    // Get questions
    const { data: questions, error: questionsError } = await supabase
      .from('aqa_listening_questions')
      .select('*')
      .eq('assessment_id', id)
      .order('question_number');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch questions', details: questionsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paper,
      questions: questions || [],
    });
  } catch (error: any) {
    console.error('Error in get endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


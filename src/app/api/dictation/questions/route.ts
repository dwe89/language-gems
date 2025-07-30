import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const assessmentId = request.nextUrl.searchParams.get('assessment_id');

    if (!assessmentId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Assessment ID is required' 
        },
        { status: 400 }
      );
    }

    // Build query to get questions for the assessment
    const { data: questions, error } = await supabase
      .from('aqa_dictation_questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('question_number');

    if (error) {
      console.error('Error fetching dictation questions:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch dictation questions',
          details: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      questions: questions || []
    });

  } catch (error) {
    console.error('Unexpected error in dictation questions API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

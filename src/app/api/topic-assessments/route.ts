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
    const language = request.nextUrl.searchParams.get('language');
    const level = request.nextUrl.searchParams.get('level');
    const theme = request.nextUrl.searchParams.get('theme');
    const topic = request.nextUrl.searchParams.get('topic');

    // Build query
    let query = supabase
      .from('aqa_topic_assessments')
      .select('*')
      .order('language')
      .order('level')
      .order('theme')
      .order('topic')
      .order('identifier');

    // Apply filters if provided
    if (language) {
      query = query.eq('language', language);
    }

    if (level) {
      query = query.eq('level', level);
    }

    if (theme) {
      query = query.eq('theme', theme);
    }

    if (topic) {
      query = query.eq('topic', topic);
    }

    // Filter by type if provided
    const type = request.nextUrl.searchParams.get('type');
    if (type) {
      query = query.eq('type', type);
    }

    // Filter by curriculum_level if provided
    const curriculum_level = request.nextUrl.searchParams.get('curriculum_level');
    if (curriculum_level) {
      query = query.eq('curriculum_level', curriculum_level);
    }

    const { data: assessments, error } = await query;

    if (error) {
      console.error('Error fetching topic assessments:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch topic assessments',
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      assessments: assessments || []
    });

  } catch (error) {
    console.error('Unexpected error in topic assessments API:', error);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questions, ...assessmentData } = body;

    // Insert assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('aqa_topic_assessments')
      .insert([assessmentData])
      .select()
      .single();

    if (assessmentError) {
      console.error('Error creating topic assessment:', assessmentError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create topic assessment',
          details: assessmentError.message
        },
        { status: 500 }
      );
    }

    // Insert questions if provided
    if (questions && Array.isArray(questions) && questions.length > 0) {
      const questionsWithId = questions.map((q: any) => ({
        ...q,
        assessment_id: assessment.id
      }));

      const { error: questionsError } = await supabase
        .from('aqa_topic_questions')
        .insert(questionsWithId);

      if (questionsError) {
        console.error('Error creating topic questions:', questionsError);
        // Note: Assessment was created but questions failed. 
        // We could delete the assessment here to be atomic, or just report error.
        return NextResponse.json(
          {
            success: true, // Assessment created
            assessment: assessment,
            warning: 'Assessment created but failed to save questions',
            details: questionsError.message
          },
          { status: 201 } // Created
        );
      }
    }

    return NextResponse.json({
      success: true,
      assessment: assessment
    });

  } catch (error) {
    console.error('Unexpected error in topic assessment creation:', error);
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

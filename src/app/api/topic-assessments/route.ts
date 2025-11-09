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

    const { data, error } = await supabase
      .from('aqa_topic_assessments')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error creating topic assessment:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to create topic assessment',
          details: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      assessment: data
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

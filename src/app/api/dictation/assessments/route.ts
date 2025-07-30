import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const level = searchParams.get('level');
    const identifier = searchParams.get('identifier');

    // Build query
    let query = supabase
      .from('aqa_dictation_assessments')
      .select('*')
      .eq('is_active', true)
      .order('language')
      .order('level')
      .order('identifier');

    // Apply filters if provided
    if (language) {
      query = query.eq('language', language);
    }
    
    if (level) {
      query = query.eq('level', level);
    }
    
    if (identifier) {
      query = query.eq('identifier', identifier);
    }

    const { data: assessments, error } = await query;

    if (error) {
      console.error('Error fetching dictation assessments:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to fetch dictation assessments',
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
    console.error('Unexpected error in dictation assessments API:', error);
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

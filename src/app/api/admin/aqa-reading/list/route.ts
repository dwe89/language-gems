import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/aqa-reading/list
 * List all AQA reading papers with optional filtering
 * Admin only endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language');
    const tier = searchParams.get('tier');
    const includeInactive = searchParams.get('include_inactive') === 'true';

    // Build query
    let query = supabase
      .from('aqa_reading_assessments')
      .select(`
        *,
        aqa_reading_questions (
          id,
          question_number,
          sub_question_number,
          question_type,
          marks
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (language) {
      query = query.eq('language', language);
    }
    if (tier) {
      query = query.eq('level', tier); // tier maps to 'level' in database
    }
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching AQA reading papers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch papers', details: error.message },
        { status: 500 }
      );
    }

    // Calculate total questions and marks for each paper
    const papersWithStats = data?.map(paper => ({
      ...paper,
      tier: paper.level, // Map level to tier for frontend
      paper_number: paper.identifier, // Map identifier to paper_number
      total_questions: paper.aqa_reading_questions?.length || 0,
      total_marks: paper.aqa_reading_questions?.reduce(
        (sum: number, q: any) => sum + (q.marks || 0),
        0
      ) || 0
    })) || [];

    return NextResponse.json({
      success: true,
      papers: papersWithStats
    });

  } catch (error: any) {
    console.error('Error in GET /api/admin/aqa-reading/list:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


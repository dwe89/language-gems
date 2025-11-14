import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/aqa-writing/list
 * List all AQA writing papers with optional filtering
 * Admin only endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const language = searchParams.get('language');
    const tier = searchParams.get('tier');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Build query - using existing aqa_writing_assessments table
    let query = supabase
      .from('aqa_writing_assessments')
      .select(`
        *,
        aqa_writing_questions (
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
      console.error('Error fetching writing papers:', error);
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
      total_questions: paper.aqa_writing_questions?.length || 0,
      total_marks: paper.aqa_writing_questions?.reduce(
        (sum: number, q: any) => sum + (q.marks || 0),
        0
      ) || paper.total_marks || 50
    })) || [];

    return NextResponse.json({
      success: true,
      papers: papersWithStats
    });

  } catch (error: any) {
    console.error('Error in GET /api/admin/aqa-writing/list:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/admin/aqa-writing/delete
 * Delete an AQA writing paper
 * If the paper has student results, it will be soft-deleted (is_active = false)
 * Otherwise, it will be hard-deleted
 * Admin only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    const { paperId } = body;

    if (!paperId) {
      return NextResponse.json(
        { error: 'Missing required field: paperId' },
        { status: 400 }
      );
    }

    // Check if paper has any student results
    const { data: results, error: resultsError } = await supabase
      .from('aqa_writing_results')
      .select('id')
      .eq('assessment_id', paperId)
      .limit(1);

    if (resultsError) {
      console.error('Error checking for student results:', resultsError);
      return NextResponse.json(
        { error: 'Failed to check for student results', details: resultsError.message },
        { status: 500 }
      );
    }

    // If paper has student results, soft delete
    if (results && results.length > 0) {
      const { error: updateError } = await supabase
        .from('aqa_writing_assessments')
        .update({ is_active: false })
        .eq('id', paperId);

      if (updateError) {
        console.error('Error soft-deleting paper:', updateError);
        return NextResponse.json(
          { error: 'Failed to deactivate paper', details: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Paper deactivated (has student results)',
        soft_delete: true
      });
    }

    // Otherwise, hard delete (questions will be cascade deleted)
    const { error: deleteError } = await supabase
      .from('aqa_writing_assessments')
      .delete()
      .eq('id', paperId);

    if (deleteError) {
      console.error('Error deleting paper:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete paper', details: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Paper deleted successfully',
      soft_delete: false
    });

  } catch (error: any) {
    console.error('Error in POST /api/admin/aqa-writing/delete:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


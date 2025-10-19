import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * DELETE /api/admin/aqa-listening/delete
 * Delete an AQA listening paper and all its questions
 * Admin only endpoint
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    const paperId = searchParams.get('id');

    if (!paperId) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    // Check if paper exists
    const { data: existingPaper, error: fetchError } = await supabase
      .from('aqa_listening_assessments')
      .select('id')
      .eq('id', paperId)
      .single();

    if (fetchError || !existingPaper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    // Delete the paper (questions will be deleted automatically due to CASCADE)
    const { error: deleteError } = await supabase
      .from('aqa_listening_assessments')
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
    });
  } catch (error: any) {
    console.error('Error in delete endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: taskId' },
        { status: 400 }
      );
    }

    // Delete the reading comprehension task (questions will be deleted via CASCADE)
    const { error: deleteError } = await supabase
      .from('reading_comprehension_tasks')
      .delete()
      .eq('id', taskId);

    if (deleteError) {
      console.error('Error deleting reading comprehension task:', deleteError);
      return NextResponse.json(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Reading comprehension task deleted successfully',
    });
  } catch (error: any) {
    console.error('Error in delete reading comprehension API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


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
    const { taskId, updates, questions } = body;

    if (!taskId || !updates) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: taskId, updates' },
        { status: 400 }
      );
    }

    // Sanitize updates: convert empty strings to null for optional fields
    const sanitizedUpdates = { ...updates };
    const optionalFields = ['curriculum_level', 'exam_board', 'theme_topic', 'category', 'subcategory'];
    optionalFields.forEach(field => {
      if (sanitizedUpdates[field] === '') {
        sanitizedUpdates[field] = null;
      }
    });

    // Update the reading comprehension task
    const { data: task, error: taskError } = await supabase
      .from('reading_comprehension_tasks')
      .update({
        ...sanitizedUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single();

    if (taskError) {
      console.error('Error updating reading comprehension task:', taskError);
      return NextResponse.json(
        { success: false, error: taskError.message },
        { status: 500 }
      );
    }

    // Update questions if provided
    if (questions !== undefined) {
      // Delete existing questions
      await supabase
        .from('reading_comprehension_questions')
        .delete()
        .eq('task_id', taskId);

      // Insert new questions
      if (questions && questions.length > 0) {
        const questionsToInsert = questions.map((q: any, index: number) => ({
          task_id: taskId,
          question_number: index + 1,
          question: q.question,
          type: q.type,
          options: q.options || null,
          correct_answer: q.correct_answer,
          points: q.points || 1,
          explanation: q.explanation || null,
        }));

        const { error: questionsError } = await supabase
          .from('reading_comprehension_questions')
          .insert(questionsToInsert);

        if (questionsError) {
          console.error('Error updating questions:', questionsError);
          return NextResponse.json(
            { success: false, error: 'Failed to update questions' },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: task,
      message: 'Reading comprehension task updated successfully',
    });
  } catch (error: any) {
    console.error('Error in update reading comprehension API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


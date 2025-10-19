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
    const {
      title,
      language,
      curriculum_level,
      exam_board,
      theme_topic,
      category,
      subcategory,
      difficulty,
      content,
      word_count,
      estimated_reading_time,
      questions,
    } = body;

    if (!title || !language || !difficulty || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, language, difficulty, content' },
        { status: 400 }
      );
    }

    // Create the reading comprehension task
    const { data: task, error: taskError } = await supabase
      .from('reading_comprehension_tasks')
      .insert({
        title,
        language,
        curriculum_level: curriculum_level || null,
        exam_board: exam_board || null,
        theme_topic: theme_topic || null,
        category: category || null,
        subcategory: subcategory || null,
        difficulty,
        content,
        word_count: word_count || content.split(' ').length,
        estimated_reading_time: estimated_reading_time || Math.ceil(content.split(' ').length / 200),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (taskError) {
      console.error('Error creating reading comprehension task:', taskError);
      return NextResponse.json(
        { success: false, error: taskError.message },
        { status: 500 }
      );
    }

    // Create questions if provided
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q: any, index: number) => ({
        task_id: task.id,
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
        console.error('Error creating questions:', questionsError);
        // Delete the task if questions failed
        await supabase
          .from('reading_comprehension_tasks')
          .delete()
          .eq('id', task.id);

        return NextResponse.json(
          { success: false, error: 'Failed to create questions' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: task,
      message: 'Reading comprehension task created successfully',
    });
  } catch (error: any) {
    console.error('Error in create reading comprehension API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


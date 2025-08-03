import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    console.log('Reading Comprehension API - Received parameters:', {
      language: searchParams.get('language'),
      curriculum_level: searchParams.get('curriculum_level'),
      exam_board: searchParams.get('exam_board'),
      category: searchParams.get('category'),
      subcategory: searchParams.get('subcategory'),
      difficulty: searchParams.get('difficulty'),
      theme_topic: searchParams.get('theme_topic'),
      limit: searchParams.get('limit'),
      random: searchParams.get('random')
    });
    
    let query = supabase
      .from('reading_comprehension_tasks')
      .select(`
        *,
        reading_comprehension_questions(*)
      `);

    // Apply filters
    const language = searchParams.get('language');
    const curriculumLevel = searchParams.get('curriculum_level');
    const examBoard = searchParams.get('exam_board');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const difficulty = searchParams.get('difficulty');
    const themeTopic = searchParams.get('theme_topic');
    const limit = searchParams.get('limit');
    const random = searchParams.get('random') === 'true';

    if (language) query = query.eq('language', language);
    if (curriculumLevel) query = query.eq('curriculum_level', curriculumLevel);
    if (examBoard) query = query.eq('exam_board', examBoard);
    if (category) query = query.eq('category', category);
    if (subcategory) query = query.eq('subcategory', subcategory);
    if (difficulty) query = query.eq('difficulty', difficulty);
    if (themeTopic) query = query.eq('theme_topic', themeTopic);

    console.log('Reading Comprehension API - Applied filters:', {
      language: language || 'none',
      curriculum_level: curriculumLevel || 'none',
      exam_board: examBoard || 'none',
      category: category || 'none',
      subcategory: subcategory || 'none',
      difficulty: difficulty || 'none',
      theme_topic: themeTopic || 'none'
    });

    // Order and limit
    query = query.order('created_at', { ascending: false });
    if (limit) query = query.limit(parseInt(limit));

    const { data: tasks, error } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }

    // If random is requested and we have results, shuffle them
    let finalTasks = tasks || [];
    if (random && finalTasks.length > 0) {
      finalTasks = finalTasks.sort(() => Math.random() - 0.5);
      if (limit) {
        finalTasks = finalTasks.slice(0, parseInt(limit));
      }
    }

    return NextResponse.json({ tasks: finalTasks });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
      created_by
    } = body;

    // Create the reading task
    const { data: task, error: taskError } = await supabase
      .from('reading_comprehension_tasks')
      .insert({
        title,
        language,
        curriculum_level,
        exam_board,
        theme_topic,
        category,
        subcategory,
        difficulty,
        content,
        word_count: word_count || content.split(' ').length,
        estimated_reading_time: estimated_reading_time || Math.ceil(content.split(' ').length / 200),
        created_by,
      })
      .select()
      .single();

    if (taskError) {
      console.error('Task creation error:', taskError);
      return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }

    // Create questions if provided
    if (questions && questions.length > 0) {
      const questionsWithTaskId = questions.map((q: any, index: number) => ({
        task_id: task.id,
        question_number: index + 1,
        question: q.question,
        type: q.type,
        options: q.options || null,
        correct_answer: q.correct_answer,
        points: q.points || 1,
        explanation: q.explanation || null,
      }));

      const { data: createdQuestions, error: questionsError } = await supabase
        .from('reading_comprehension_questions')
        .insert(questionsWithTaskId)
        .select();

      if (questionsError) {
        console.error('Questions creation error:', questionsError);
        return NextResponse.json({ error: 'Failed to create questions' }, { status: 500 });
      }

      task.reading_comprehension_questions = createdQuestions;
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, textId, results, assignmentMode } = body;

    if (!userId || !textId || !results) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save the main result
    const { data: result, error: resultError } = await supabase
      .from('reading_comprehension_results')
      .insert({
        task_id: textId,
        student_id: userId,
        assignment_id: assignmentMode ? results.assignmentId : null,
        total_questions: results.totalQuestions,
        correct_answers: results.correctAnswers,
        score_percentage: results.score,
        time_spent_seconds: results.timeSpent,
        passed: results.passed,
      })
      .select()
      .single();

    if (resultError) {
      console.error('Result save error:', resultError);
      return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
    }

    // Save individual question results
    if (results.questionResults && results.questionResults.length > 0) {
      const questionResultsWithId = results.questionResults.map((qr: any) => ({
        result_id: result.id,
        question_id: qr.questionId,
        user_answer: qr.userAnswer,
        correct_answer: qr.correctAnswer,
        is_correct: qr.isCorrect,
        points_earned: qr.points,
        time_spent: qr.timeSpent || 0,
      }));

      const { error: questionResultsError } = await supabase
        .from('reading_comprehension_question_results')
        .insert(questionResultsWithId);

      if (questionResultsError) {
        console.error('Question results save error:', questionResultsError);
        // Don't fail the whole request for this
      }
    }

    // Update assignment progress if this was part of an assignment
    if (assignmentMode && results.assignmentId) {
      await supabase
        .from('assignment_progress')
        .upsert({
          assignment_id: results.assignmentId,
          student_id: userId,
          score: results.score,
          accuracy: (results.correctAnswers / results.totalQuestions) * 100,
          time_spent: results.timeSpent,
          completed: true,
          updated_at: new Date().toISOString(),
        });
    }

    return NextResponse.json({ success: true, result_id: result.id });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    let query = supabase
      .from('reading_comprehension_results')
      .select(`
        *,
        reading_comprehension_tasks(*),
        user_profiles!student_id(first_name, last_name)
      `);

    // Apply filters
    const studentId = searchParams.get('student_id');
    const taskId = searchParams.get('task_id');
    const language = searchParams.get('language');
    const difficulty = searchParams.get('difficulty');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const limit = searchParams.get('limit');

    if (studentId) query = query.eq('student_id', studentId);
    if (taskId) query = query.eq('task_id', taskId);
    if (language) query = query.eq('reading_comprehension_tasks.language', language);
    if (difficulty) query = query.eq('reading_comprehension_tasks.difficulty', difficulty);
    if (dateFrom) query = query.gte('completed_at', dateFrom);
    if (dateTo) query = query.lte('completed_at', dateTo);

    query = query.order('completed_at', { ascending: false });
    if (limit) query = query.limit(parseInt(limit));

    const { data: results, error } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
    }

    return NextResponse.json({ results: results || [] });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
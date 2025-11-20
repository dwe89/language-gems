import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, assessmentId, results, assignmentMode, assignmentId } = body;

    console.log('Saving reading comprehension results:', {
      userId,
      assessmentId, // This maps to text_id
      assignmentId,
      score: results.score,
      passed: results.passed
    });

    // Save to reading_comprehension_results table
    const { data, error } = await supabase
      .from('reading_comprehension_results')
      .insert({
        user_id: userId,
        text_id: assessmentId,
        assignment_id: assignmentId,
        score: results.score,
        total_questions: results.totalQuestions,
        correct_answers: results.correctAnswers,
        time_spent: results.timeSpent,
        passed: results.passed,
        question_results: results.detailedResults,
        assignment_mode: assignmentMode || false,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving reading comprehension result:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, result: data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
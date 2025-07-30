import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, assessmentId, results, assignmentMode } = body;

    // For now, just log the results since the table doesn't exist yet
    console.log('Assessment results:', {
      userId,
      assessmentId,
      score: results.score,
      totalQuestions: results.totalQuestions,
      correctAnswers: results.correctAnswers,
      timeSpent: results.timeSpent,
      passed: results.passed,
      assignmentMode
    });

    // Try to save the assessment result, but handle gracefully if table doesn't exist
    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .insert({
          user_id: userId,
          assessment_id: assessmentId,
          assessment_type: 'reading-comprehension',
          score: results.score,
          total_questions: results.totalQuestions,
          correct_answers: results.correctAnswers,
          time_spent: results.timeSpent,
          passed: results.passed,
          detailed_results: results.detailedResults,
          assignment_mode: assignmentMode || false,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving assessment result:', error);
        // Don't fail the request if we can't save to DB
        return NextResponse.json({ success: true, warning: 'Results not saved to database' });
      }

      return NextResponse.json({ success: true, result: data });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return success even if DB save fails
      return NextResponse.json({ success: true, warning: 'Results not saved to database' });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
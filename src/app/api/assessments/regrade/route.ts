import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { regradeQuestion, isAnswerCorrect } from '@/utils/answerMatching';

export const dynamic = 'force-dynamic';

/**
 * API endpoint to regrade reading comprehension results with smart answer matching
 * POST /api/assessments/regrade
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { resultId, assignmentId } = body;

    if (!resultId && !assignmentId) {
      return NextResponse.json(
        { error: 'Either resultId or assignmentId is required' },
        { status: 400 }
      );
    }

    let resultsToRegrade: any[] = [];

    // Fetch result(s) to regrade
    if (resultId) {
      const { data, error } = await supabase
        .from('reading_comprehension_results')
        .select('*')
        .eq('id', resultId)
        .single();

      if (error) throw error;
      resultsToRegrade = data ? [data] : [];
    } else if (assignmentId) {
      const { data, error } = await supabase
        .from('reading_comprehension_results')
        .select('*')
        .eq('assignment_id', assignmentId);

      if (error) throw error;
      resultsToRegrade = data || [];
    }

    if (resultsToRegrade.length === 0) {
      return NextResponse.json(
        { error: 'No results found to regrade' },
        { status: 404 }
      );
    }

    let updatedCount = 0;
    const regradeSummary: any[] = [];

    for (const result of resultsToRegrade) {
      const questionResults = result.question_results || [];
      let totalCorrect = 0;
      let totalScore = 0;
      let totalPoints = 0;

      const regradedQuestions = questionResults.map((q: any) => {
        const regradeResult = regradeQuestion(
          q.userAnswer,
          q.correctAnswer,
          q.points
        );

        totalPoints += q.points;
        totalScore += regradeResult.score;
        
        if (regradeResult.isCorrect) {
          totalCorrect++;
        }

        return {
          ...q,
          isCorrect: regradeResult.isCorrect,
          score: regradeResult.score,
          feedback: regradeResult.feedback,
          wasRegraded: true
        };
      });

      const newPercentage = totalPoints > 0 
        ? Math.round((totalScore / totalPoints) * 100)
        : 0;

      const oldScore = result.score;
      const oldCorrect = result.correct_answers;

      // Update the result
      const { error: updateError } = await supabase
        .from('reading_comprehension_results')
        .update({
          question_results: regradedQuestions,
          correct_answers: totalCorrect,
          score: newPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('id', result.id);

      if (!updateError) {
        updatedCount++;
        regradeSummary.push({
          resultId: result.id,
          studentId: result.user_id,
          oldScore: oldScore,
          newScore: newPercentage,
          oldCorrect: oldCorrect,
          newCorrect: totalCorrect,
          scoreChange: newPercentage - oldScore,
          questionsRegraded: regradedQuestions.length
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully regraded ${updatedCount} result(s)`,
      regradeSummary
    });

  } catch (error: any) {
    console.error('Error regrading results:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to regrade results' },
      { status: 500 }
    );
  }
}

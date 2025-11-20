import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * API endpoint to manually override reading comprehension question results
 * Allows teachers to mark answers as correct/incorrect manually
 */
export async function POST(request: NextRequest) {
    try {
        // Get the user from authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify user is authenticated and is a teacher
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify user is a teacher
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        if (profile?.role !== 'teacher') {
            return NextResponse.json({ error: 'Only teachers can override answers' }, { status: 403 });
        }

        const body = await request.json();
        const { resultId, questionId, manuallyMarkedCorrect } = body;

        if (!resultId || !questionId || typeof manuallyMarkedCorrect !== 'boolean') {
            return NextResponse.json(
                { error: 'Missing required fields: resultId, questionId, manuallyMarkedCorrect' },
                { status: 400 }
            );
        }

        console.log('🔄 [MANUAL OVERRIDE]', {
            resultId,
            questionId,
            manuallyMarkedCorrect,
            teacherId: user.id
        });

        // Fetch current result
        const { data: currentResult, error: fetchError } = await supabase
            .from('reading_comprehension_results')
            .select('question_results, total_questions, correct_answers, score')
            .eq('id', resultId)
            .single();

        if (fetchError || !currentResult) {
            return NextResponse.json({ error: 'Result not found' }, { status: 404 });
        }

        // Update question_results with manual override
        let questionResults = currentResult.question_results || [];
        const questionIndex = questionResults.findIndex((q: any) => q.questionId === questionId);

        if (questionIndex === -1) {
            return NextResponse.json({ error: 'Question not found in results' }, { status: 404 });
        }

        // Store the original isCorrect value if not already stored
        const question = questionResults[questionIndex];
        if (!question.hasOwnProperty('originalIsCorrect')) {
            question.originalIsCorrect = question.isCorrect;
        }

        // Apply manual override
        question.manuallyMarkedCorrect = manuallyMarkedCorrect;
        question.isCorrect = manuallyMarkedCorrect;
        question.manuallyOverriddenBy = user.id;
        question.manuallyOverriddenAt = new Date().toISOString();

        // Recalculate score
        const correctCount = questionResults.filter((q: any) => q.isCorrect).length;
        const totalQuestions = currentResult.total_questions || questionResults.length;
        const newScore = Math.round((correctCount / totalQuestions) * 100);
        const passed = newScore >= 60; // Assuming 60% pass threshold

        // Update the result
        const { error: updateError } = await supabase
            .from('reading_comprehension_results')
            .update({
                question_results: questionResults,
                correct_answers: correctCount,
                score: newScore,
                passed
            })
            .eq('id', resultId);

        if (updateError) {
            console.error('❌ [OVERRIDE ERROR]', updateError);
            return NextResponse.json({ error: 'Failed to update result' }, { status: 500 });
        }

        console.log('✅ [OVERRIDE SUCCESS]', {
            oldScore: currentResult.score,
            newScore,
            correctCount,
            totalQuestions
        });

        return NextResponse.json({
            success: true,
            newScore,
            correctCount,
            totalQuestions,
            passed
        });
    } catch (error) {
        console.error('❌ [OVERRIDE ERROR]', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { VocabularyTestService, VocabularyTestResponse } from '../../../../../services/vocabularyTestService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const { testId } = params;
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['result_id', 'responses', 'total_time_seconds'];
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate responses array
    if (!Array.isArray(body.responses)) {
      return NextResponse.json(
        { error: 'Responses must be an array' },
        { status: 400 }
      );
    }

    // Validate each response object
    const requiredResponseFields = [
      'question_id', 'question_number', 'question_type', 
      'student_answer', 'correct_answer', 'is_correct', 
      'points_awarded', 'time_spent_seconds', 'hint_used'
    ];

    for (let i = 0; i < body.responses.length; i++) {
      const response = body.responses[i];
      for (const field of requiredResponseFields) {
        if (response[field] === undefined || response[field] === null) {
          return NextResponse.json(
            { error: `Missing required field '${field}' in response ${i + 1}` },
            { status: 400 }
          );
        }
      }
    }

    // Validate numeric fields
    if (typeof body.total_time_seconds !== 'number' || body.total_time_seconds < 0) {
      return NextResponse.json(
        { error: 'Total time seconds must be a non-negative number' },
        { status: 400 }
      );
    }

    // Create vocabulary test service
    const testService = new VocabularyTestService(supabase);

    // Verify the result exists and belongs to the test
    const { data: resultData, error: resultError } = await supabase
      .from('vocabulary_test_results')
      .select('id, test_id, student_id, status')
      .eq('id', body.result_id)
      .eq('test_id', testId)
      .single();

    if (resultError || !resultData) {
      return NextResponse.json(
        { error: 'Test result not found or does not belong to this test' },
        { status: 404 }
      );
    }

    if (resultData.status === 'completed') {
      return NextResponse.json(
        { error: 'Test has already been submitted' },
        { status: 400 }
      );
    }

    // Process and validate responses
    const processedResponses: VocabularyTestResponse[] = body.responses.map((response: any) => ({
      question_id: response.question_id,
      question_number: parseInt(response.question_number),
      question_type: response.question_type,
      student_answer: String(response.student_answer || '').trim(),
      correct_answer: String(response.correct_answer || '').trim(),
      is_correct: Boolean(response.is_correct),
      points_awarded: Math.max(0, parseInt(response.points_awarded) || 0),
      time_spent_seconds: Math.max(0, parseInt(response.time_spent_seconds) || 0),
      hint_used: Boolean(response.hint_used),
      error_type: response.error_type || undefined,
      error_details: response.error_details || undefined
    }));

    // Additional validation: check if responses match test questions
    const testData = await testService.getTestWithQuestions(testId);
    if (!testData) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    if (processedResponses.length !== testData.questions.length) {
      return NextResponse.json(
        { error: `Expected ${testData.questions.length} responses, got ${processedResponses.length}` },
        { status: 400 }
      );
    }

    // Verify question IDs match
    const testQuestionIds = new Set(testData.questions.map(q => q.id));
    const responseQuestionIds = new Set(processedResponses.map(r => r.question_id));
    
    if (testQuestionIds.size !== responseQuestionIds.size || 
        ![...testQuestionIds].every(id => responseQuestionIds.has(id))) {
      return NextResponse.json(
        { error: 'Response question IDs do not match test questions' },
        { status: 400 }
      );
    }

    // Submit the test results
    const success = await testService.submitTestResults(
      body.result_id,
      processedResponses,
      body.total_time_seconds
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to submit test results' },
        { status: 500 }
      );
    }

    // Get the updated result to return final scores
    const { data: finalResult, error: finalError } = await supabase
      .from('vocabulary_test_results')
      .select('*')
      .eq('id', body.result_id)
      .single();

    if (finalError || !finalResult) {
      return NextResponse.json(
        { error: 'Failed to retrieve final results' },
        { status: 500 }
      );
    }

    // Calculate summary statistics
    const totalQuestions = processedResponses.length;
    const correctAnswers = processedResponses.filter(r => r.is_correct).length;
    const incorrectAnswers = processedResponses.filter(r => !r.is_correct).length;
    const skippedQuestions = processedResponses.filter(r => !r.student_answer.trim()).length;
    const hintsUsed = processedResponses.filter(r => r.hint_used).length;
    const totalPoints = processedResponses.reduce((sum, r) => sum + r.points_awarded, 0);
    const maxPossiblePoints = testData.test.points_per_question * totalQuestions;
    const percentageScore = (totalPoints / maxPossiblePoints) * 100;
    const passed = percentageScore >= testData.test.passing_score_percentage;

    // Return comprehensive results
    return NextResponse.json({
      success: true,
      message: 'Test submitted successfully',
      result: {
        id: finalResult.id,
        test_id: testId,
        student_id: finalResult.student_id,
        attempt_number: finalResult.attempt_number,
        total_time_seconds: body.total_time_seconds,
        raw_score: totalPoints,
        total_possible_score: maxPossiblePoints,
        percentage_score: percentageScore,
        passed: passed,
        questions_correct: correctAnswers,
        questions_incorrect: incorrectAnswers,
        questions_skipped: skippedQuestions,
        hints_used: hintsUsed,
        status: 'completed',
        completion_time: finalResult.completion_time
      },
      summary: {
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        incorrect_answers: incorrectAnswers,
        skipped_questions: skippedQuestions,
        hints_used: hintsUsed,
        accuracy_percentage: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
        time_per_question: totalQuestions > 0 ? body.total_time_seconds / totalQuestions : 0,
        passing_score_required: testData.test.passing_score_percentage,
        result_status: passed ? 'PASSED' : 'FAILED'
      }
    });

  } catch (error: any) {
    console.error('Error submitting vocabulary test:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { VocabularyTestService } from '../../../../../services/vocabularyTestService';

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
    if (!body.student_id) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Validate test ID format
    if (!testId || typeof testId !== 'string') {
      return NextResponse.json(
        { error: 'Valid test ID is required' },
        { status: 400 }
      );
    }

    // Create vocabulary test service
    const testService = new VocabularyTestService(supabase);

    // Check if test exists and is active
    const testData = await testService.getTestWithQuestions(testId);
    if (!testData) {
      return NextResponse.json(
        { error: 'Test not found or inactive' },
        { status: 404 }
      );
    }

    if (testData.test.status !== 'active') {
      return NextResponse.json(
        { error: 'Test is not currently active' },
        { status: 400 }
      );
    }

    // Check if student has already reached maximum attempts
    const existingResults = await testService.getStudentResults(testId, body.student_id);
    if (existingResults.length >= testData.test.max_attempts) {
      return NextResponse.json(
        { error: 'Maximum attempts reached for this test' },
        { status: 400 }
      );
    }

    // Check if student has an in-progress attempt
    const inProgressAttempt = existingResults.find(result => result.status === 'in_progress');
    if (inProgressAttempt) {
      return NextResponse.json(
        { 
          success: true,
          result_id: inProgressAttempt.id,
          message: 'Resuming existing attempt',
          test: testData.test,
          questions: testData.questions,
          attempt_number: inProgressAttempt.attempt_number
        }
      );
    }

    // Start new test attempt
    const resultId = await testService.startTestAttempt(
      testId, 
      body.student_id, 
      body.assignment_id
    );

    if (!resultId) {
      return NextResponse.json(
        { error: 'Failed to start test attempt' },
        { status: 500 }
      );
    }

    // Return test data and result ID
    return NextResponse.json({
      success: true,
      result_id: resultId,
      test: testData.test,
      questions: testData.questions,
      attempt_number: existingResults.length + 1,
      message: 'Test attempt started successfully'
    });

  } catch (error: any) {
    console.error('Error starting vocabulary test:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { testId: string } }
) {
  try {
    const { testId } = params;
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Create vocabulary test service
    const testService = new VocabularyTestService(supabase);

    // Get test data
    const testData = await testService.getTestWithQuestions(testId);
    if (!testData) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      );
    }

    // Get student's existing results
    const studentResults = await testService.getStudentResults(testId, studentId);

    // Check for in-progress attempt
    const inProgressAttempt = studentResults.find(result => result.status === 'in_progress');

    return NextResponse.json({
      success: true,
      test: testData.test,
      questions: testData.questions,
      student_results: studentResults,
      can_start_new_attempt: studentResults.length < testData.test.max_attempts && !inProgressAttempt,
      in_progress_attempt: inProgressAttempt || null,
      attempts_remaining: Math.max(0, testData.test.max_attempts - studentResults.length)
    });

  } catch (error: any) {
    console.error('Error fetching test data:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { VocabularyTestService, TestCreationData } from '../../../../services/vocabularyTestService';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'language', 'curriculum_level', 'test_type', 'vocabulary_source', 'word_count'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get user from session
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Extract user ID from auth header or session
    // This would typically be done through proper auth middleware
    const userId = body.teacher_id; // For now, assuming it's passed in body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 401 }
      );
    }

    // Validate vocabulary criteria based on source
    if (body.vocabulary_source === 'category' && !body.vocabulary_criteria?.category) {
      return NextResponse.json(
        { error: 'Category is required when vocabulary_source is "category"' },
        { status: 400 }
      );
    }

    // Create test data object
    const testData: TestCreationData = {
      title: body.title,
      description: body.description || '',
      language: body.language,
      curriculum_level: body.curriculum_level,
      test_type: body.test_type,
      vocabulary_source: body.vocabulary_source,
      vocabulary_criteria: body.vocabulary_criteria || {},
      word_count: parseInt(body.word_count) || 20,
      time_limit_minutes: parseInt(body.time_limit_minutes) || 30,
      max_attempts: parseInt(body.max_attempts) || 3,
      randomize_questions: body.randomize_questions !== false,
      show_immediate_feedback: body.show_immediate_feedback === true,
      allow_hints: body.allow_hints === true,
      passing_score_percentage: parseInt(body.passing_score_percentage) || 70,
      points_per_question: parseInt(body.points_per_question) || 5,
      time_bonus_enabled: body.time_bonus_enabled !== false
    };

    // Validate numeric fields
    if (testData.word_count < 1 || testData.word_count > 100) {
      return NextResponse.json(
        { error: 'Word count must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (testData.time_limit_minutes < 5 || testData.time_limit_minutes > 180) {
      return NextResponse.json(
        { error: 'Time limit must be between 5 and 180 minutes' },
        { status: 400 }
      );
    }

    if (testData.passing_score_percentage < 0 || testData.passing_score_percentage > 100) {
      return NextResponse.json(
        { error: 'Passing score must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Create vocabulary test service
    const testService = new VocabularyTestService(supabase);

    // Create the test
    const testId = await testService.createTest(userId, testData);

    if (!testId) {
      return NextResponse.json(
        { error: 'Failed to create vocabulary test' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      test_id: testId,
      message: 'Vocabulary test created successfully'
    });

  } catch (error: any) {
    console.error('Error creating vocabulary test:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacher_id');

    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }

    // Create vocabulary test service
    const testService = new VocabularyTestService(supabase);

    // Get tests by teacher
    const tests = await testService.getTestsByTeacher(teacherId);

    return NextResponse.json({
      success: true,
      tests
    });

  } catch (error: any) {
    console.error('Error fetching vocabulary tests:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AssessmentResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  passed: boolean;
  detailedResults: QuestionResult[];
}

interface QuestionResult {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  points: number;
  timeSpent: number;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, assessmentId, results, assignmentMode } = await request.json();

    // Validate input
    if (!userId || !assessmentId || !results) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save assessment results to database
    const { data: savedResult, error: saveError } = await supabase
      .from('reading_assessment_results')
      .insert({
        user_id: userId,
        assessment_id: assessmentId,
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

    if (saveError) {
      console.error('Error saving assessment results:', saveError);
      return NextResponse.json(
        { error: 'Failed to save results' },
        { status: 500 }
      );
    }

    // If this is part of an assignment, update assignment progress
    if (assignmentMode) {
      await updateAssignmentProgress(userId, assessmentId, results);
    }

    // Update user statistics
    await updateUserStats(userId, results);

    return NextResponse.json({
      success: true,
      resultId: savedResult.id,
      message: 'Results saved successfully'
    });

  } catch (error) {
    console.error('Error processing assessment results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateAssignmentProgress(userId: string, assessmentId: string, results: AssessmentResults) {
  try {
    // Find the assignment associated with this assessment
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('id')
      .eq('assessment_id', assessmentId)
      .single();

    if (assignmentError || !assignment) {
      console.log('No assignment found for assessment:', assessmentId);
      return;
    }

    // Update or create assignment progress
    const { error: progressError } = await supabase
      .from('assignment_progress')
      .upsert({
        assignment_id: assignment.id,
        student_id: userId,
        status: results.passed ? 'completed' : 'in_progress',
        score: results.score,
        accuracy: Math.round((results.correctAnswers / results.totalQuestions) * 100),
        time_spent: results.timeSpent,
        completed_at: results.passed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      });

    if (progressError) {
      console.error('Error updating assignment progress:', progressError);
    }

  } catch (error) {
    console.error('Error in updateAssignmentProgress:', error);
  }
}

async function updateUserStats(userId: string, results: AssessmentResults) {
  try {
    // Get current user stats
    const { data: currentStats, error: statsError } = await supabase
      .from('user_reading_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      console.error('Error fetching user stats:', statsError);
      return;
    }

    const now = new Date().toISOString();
    
    if (currentStats) {
      // Update existing stats
      const newStats = {
        total_assessments: currentStats.total_assessments + 1,
        total_questions_answered: currentStats.total_questions_answered + results.totalQuestions,
        total_correct_answers: currentStats.total_correct_answers + results.correctAnswers,
        total_time_spent: currentStats.total_time_spent + results.timeSpent,
        assessments_passed: currentStats.assessments_passed + (results.passed ? 1 : 0),
        average_score: Math.round(
          ((currentStats.average_score * currentStats.total_assessments) + results.score) / 
          (currentStats.total_assessments + 1)
        ),
        best_score: Math.max(currentStats.best_score, results.score),
        updated_at: now
      };

      const { error: updateError } = await supabase
        .from('user_reading_stats')
        .update(newStats)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating user stats:', updateError);
      }
    } else {
      // Create new stats record
      const newStats = {
        user_id: userId,
        total_assessments: 1,
        total_questions_answered: results.totalQuestions,
        total_correct_answers: results.correctAnswers,
        total_time_spent: results.timeSpent,
        assessments_passed: results.passed ? 1 : 0,
        average_score: results.score,
        best_score: results.score,
        created_at: now,
        updated_at: now
      };

      const { error: insertError } = await supabase
        .from('user_reading_stats')
        .insert(newStats);

      if (insertError) {
        console.error('Error creating user stats:', insertError);
      }
    }

  } catch (error) {
    console.error('Error in updateUserStats:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const assessmentId = searchParams.get('assessmentId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('reading_assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (assessmentId) {
      query = query.eq('assessment_id', assessmentId);
    }

    const { data: results, error } = await query;

    if (error) {
      console.error('Error fetching assessment results:', error);
      return NextResponse.json(
        { error: 'Failed to fetch results' },
        { status: 500 }
      );
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Error in GET assessment results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

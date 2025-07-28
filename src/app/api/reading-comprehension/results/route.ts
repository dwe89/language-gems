import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TaskResults {
  textId: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  questionResults: QuestionResult[];
  passed: boolean;
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
    const { userId, textId, results, assignmentMode } = await request.json();

    // Validate input
    if (!userId || !textId || !results) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save reading comprehension results to database
    const { data: savedResult, error: saveError } = await supabase
      .from('reading_comprehension_results')
      .insert({
        user_id: userId,
        text_id: textId,
        score: results.score,
        total_questions: results.totalQuestions,
        correct_answers: results.correctAnswers,
        time_spent: results.timeSpent,
        passed: results.passed,
        question_results: results.questionResults,
        assignment_mode: assignmentMode || false,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving reading comprehension results:', saveError);
      return NextResponse.json(
        { error: 'Failed to save results' },
        { status: 500 }
      );
    }

    // Update user reading comprehension statistics
    await updateUserReadingStats(userId, results);

    // If this is part of an assignment, update assignment progress
    if (assignmentMode) {
      await updateAssignmentProgress(userId, textId, results);
    }

    return NextResponse.json({
      success: true,
      resultId: savedResult.id,
      message: 'Results saved successfully'
    });

  } catch (error) {
    console.error('Error processing reading comprehension results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function updateUserReadingStats(userId: string, results: TaskResults) {
  try {
    // Get current user reading stats
    const { data: currentStats, error: statsError } = await supabase
      .from('user_reading_comprehension_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') {
      console.error('Error fetching user reading stats:', statsError);
      return;
    }

    const now = new Date().toISOString();
    
    if (currentStats) {
      // Update existing stats
      const newStats = {
        total_tasks: currentStats.total_tasks + 1,
        total_questions_answered: currentStats.total_questions_answered + results.totalQuestions,
        total_correct_answers: currentStats.total_correct_answers + results.correctAnswers,
        total_time_spent: currentStats.total_time_spent + results.timeSpent,
        tasks_passed: currentStats.tasks_passed + (results.passed ? 1 : 0),
        average_score: Math.round(
          ((currentStats.average_score * currentStats.total_tasks) + results.score) / 
          (currentStats.total_tasks + 1)
        ),
        best_score: Math.max(currentStats.best_score, results.score),
        current_streak: results.passed ? currentStats.current_streak + 1 : 0,
        best_streak: results.passed ? 
          Math.max(currentStats.best_streak, currentStats.current_streak + 1) : 
          currentStats.best_streak,
        updated_at: now
      };

      const { error: updateError } = await supabase
        .from('user_reading_comprehension_stats')
        .update(newStats)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating user reading stats:', updateError);
      }
    } else {
      // Create new stats record
      const newStats = {
        user_id: userId,
        total_tasks: 1,
        total_questions_answered: results.totalQuestions,
        total_correct_answers: results.correctAnswers,
        total_time_spent: results.timeSpent,
        tasks_passed: results.passed ? 1 : 0,
        average_score: results.score,
        best_score: results.score,
        current_streak: results.passed ? 1 : 0,
        best_streak: results.passed ? 1 : 0,
        created_at: now,
        updated_at: now
      };

      const { error: insertError } = await supabase
        .from('user_reading_comprehension_stats')
        .insert(newStats);

      if (insertError) {
        console.error('Error creating user reading stats:', insertError);
      }
    }

  } catch (error) {
    console.error('Error in updateUserReadingStats:', error);
  }
}

async function updateAssignmentProgress(userId: string, textId: string, results: TaskResults) {
  try {
    // Find the assignment associated with this reading comprehension task
    const { data: assignment, error: assignmentError } = await supabase
      .from('reading_comprehension_assignments')
      .select('assignment_id')
      .eq('text_id', textId)
      .single();

    if (assignmentError || !assignment) {
      console.log('No assignment found for reading comprehension text:', textId);
      return;
    }

    // Update or create assignment progress
    const { error: progressError } = await supabase
      .from('assignment_progress')
      .upsert({
        assignment_id: assignment.assignment_id,
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const textId = searchParams.get('textId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('reading_comprehension_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (textId) {
      query = query.eq('text_id', textId);
    }

    const { data: results, error } = await query;

    if (error) {
      console.error('Error fetching reading comprehension results:', error);
      return NextResponse.json(
        { error: 'Failed to fetch results' },
        { status: 500 }
      );
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Error in GET reading comprehension results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

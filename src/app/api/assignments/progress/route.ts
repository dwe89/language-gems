import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '../../../../lib/database.types';

interface AssignmentProgressRequest {
  assignmentId: string;
  completed: boolean;
  timeSpent: number; // in seconds
  score: number; // percentage
  studentId?: string; // For demo users
  metadata?: {
    matches: number;
    attempts: number;
    gameType: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set(name, value, options);
          },
          remove(name, options) {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );
    
    // Verify authentication (allow demo users)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Progress API - Auth check:', { user: user?.id, authError });

    const body: AssignmentProgressRequest = await request.json();
    const { assignmentId, completed, timeSpent, score, metadata, studentId } = body;

    // Determine the actual user ID (authenticated user or demo user)
    let actualUserId = user?.id;

    // If no authenticated user but studentId is provided, check if it's a demo user
    if (!user && studentId) {
      // Check if this is a known demo user
      const { data: demoUser } = await supabase
        .from('demo_users')
        .select('id')
        .or(`id.eq.${studentId},demo_user_id.eq.${studentId}`)
        .single();

      if (demoUser) {
        actualUserId = studentId;
        console.log('Progress API - Using demo user:', studentId);
      }
    }

    if (!actualUserId) {
      console.log('Progress API - No valid user (authenticated or demo)');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the assignment exists and user has access
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('id, class_id, created_by, vocabulary_assignment_list_id')
      .eq('id', assignmentId)
      .single();

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Check if user is a student in the class (skip for demo users)
    if (user) {
      const { data: enrollment } = await supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', assignment.class_id)
        .eq('student_id', actualUserId)
        .single();

      if (!enrollment) {
        return NextResponse.json(
          { error: 'Access denied - not enrolled in this class' },
          { status: 403 }
        );
      }
    }

    // Update or create assignment progress in the main table
    const progressData = {
      assignment_id: assignmentId,
      student_id: actualUserId,
      status: completed ? 'completed' : 'in_progress',
      best_score: score,
      best_accuracy: accuracy || score, // Use provided accuracy or fallback to score
      attempts_count: metadata?.attempts || 1,
      total_time_spent: timeSpent,
      updated_at: new Date().toISOString(),
      ...(completed && { completed_at: new Date().toISOString() })
    };

    const { data: updatedProgress, error: progressError } = await supabase
      .from('enhanced_assignment_progress')
      .upsert([progressData], {
        onConflict: 'assignment_id,student_id'
      })
      .select()
      .single();

    if (progressError) {
      console.error('Error updating assignment progress:', progressError);
      return NextResponse.json(
        { error: 'Failed to update assignment progress' },
        { status: 500 }
      );
    }

    // Also update game-specific progress if gameId is provided
    if (gameId) {
      const gameProgressData = {
        assignment_id: assignmentId,
        student_id: actualUserId,
        game_id: gameId,
        status: completed ? 'completed' : 'in_progress',
        score: score,
        accuracy: accuracy || score,
        time_spent: timeSpent,
        words_completed: wordsCompleted || 0,
        total_words: totalWords || 0,
        session_data: sessionData || {},
        updated_at: new Date().toISOString(),
        ...(completed && { completed_at: new Date().toISOString() })
      };

      const { error: gameProgressError } = await supabase
        .from('assignment_game_progress')
        .upsert([gameProgressData]);

      if (gameProgressError) {
        console.error('Error updating game progress:', gameProgressError);
        // Don't fail the request, just log the error
      }
    }



    // Create game session record
    if (metadata) {
      const gameSessionData = {
        student_id: actualUserId,
        assignment_id: assignmentId,
        game_type: metadata.gameType,
        session_data: {
          matches: metadata.matches,
          attempts: metadata.attempts,
          timeSpent: timeSpent
        },
        score: score,
        accuracy: score,
        time_spent_seconds: timeSpent,
        vocabulary_practiced: [], // Memory game doesn't track individual words yet
        completed_at: completed ? new Date().toISOString() : null
      };

      const { error: sessionError } = await supabase
        .from('assignment_game_sessions')
        .insert([gameSessionData]);

      if (sessionError) {
        console.error('Error creating game session:', sessionError);
      }
    }

    return NextResponse.json({
      success: true,
      progress: updatedProgress
    });

  } catch (error) {
    console.error('Assignment progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

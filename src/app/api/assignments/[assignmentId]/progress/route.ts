import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '../../../../../lib/database.types';

interface ProgressUpdateRequest {
  status: 'started' | 'in_progress' | 'completed';
  score?: number;
  accuracy?: number;
  timeSpent?: number; // in seconds
  attempts?: number;
  gameSession?: {
    sessionData: Record<string, any>;
    vocabularyPracticed: number[];
    wordsCorrect: number;
    wordsAttempted: number;
    powerUpsUsed?: string[];
    achievements?: string[];
  };
  vocabularyProgress?: Array<{
    vocabularyId: number;
    attempts: number;
    correctAttempts: number;
    responseTime?: number;
    wasCorrect: boolean;
    hintUsed?: boolean;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
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
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assignmentId } = await params;
    const body: ProgressUpdateRequest = await request.json();

    // Verify the assignment exists and user has access
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('id, class_id, created_by, vocabulary_assignment_list_id, type')
      .eq('id', parseInt(assignmentId))
      .single();

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Check if user is a student in this class
    const { data: enrollment } = await supabase
      .from('class_enrollments')
      .select('student_id')
      .eq('class_id', assignment.class_id)
      .eq('student_id', user.id)
      .single();
    
    if (!enrollment && assignment.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Create game session record directly (this is the main progress tracking)
    if (body.gameSession) {
      const gameSessionData = {
        student_id: user.id,
        assignment_id: parseInt(assignmentId),
        game_type: assignment.type || 'memory-game',
        session_data: body.gameSession.sessionData,
        score: body.score || 0,
        accuracy: body.accuracy || 0,
        time_spent_seconds: body.timeSpent || 0,
        vocabulary_practiced: body.gameSession.vocabularyPracticed,
        completed_at: body.status === 'completed' ? new Date().toISOString() : null
      };

      const { data: gameSession, error: sessionError } = await supabase
        .from('assignment_game_sessions')
        .insert(gameSessionData)
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating game session:', sessionError);
        return NextResponse.json(
          { error: 'Failed to create game session', details: sessionError.message },
          { status: 500 }
        );
      }

      // Update individual vocabulary progress if provided
      if (body.vocabularyProgress && body.vocabularyProgress.length > 0) {
        const vocabularyUpdates = body.vocabularyProgress.map(vocab => ({
          student_id: user.id,
          assignment_id: parseInt(assignmentId),
          vocabulary_id: vocab.vocabularyId,
          attempts: vocab.attempts,
          correct_attempts: vocab.correctAttempts,
          last_attempted_at: new Date().toISOString(),
          mastery_level: vocab.correctAttempts > 0 ? 
            Math.min(5, Math.floor((vocab.correctAttempts / vocab.attempts) * 5)) : 0
        }));

        const { error: vocabError } = await supabase
          .from('student_vocabulary_assignment_progress')
          .upsert(vocabularyUpdates);

        if (vocabError) {
          console.error('Error updating vocabulary progress:', vocabError);
          return NextResponse.json(
            { error: 'Failed to update vocabulary progress', details: vocabError.message },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        gameSession: gameSession
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Progress saved successfully'
      });
    }

  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve current progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
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
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { assignmentId } = await params;

    // Get assignment and verify ownership
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('id, class_id, created_by, vocabulary_assignment_list_id')
      .eq('id', parseInt(assignmentId))
      .single();

    if (assignmentError || !assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }

    // Check if user is the teacher or a student in the class
    let hasAccess = false;

    if (assignment.created_by === user.id) {
      hasAccess = true;
    } else {
      // Check if user is a student in this class
      const { data: enrollment } = await supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', assignment.class_id)
        .eq('student_id', user.id)
        .single();
      
      if (enrollment) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get game sessions for this assignment
    const { data: gameSessions, error: sessionsError } = await supabase
      .from('assignment_game_sessions')
      .select('*')
      .eq('assignment_id', parseInt(assignmentId))
      .order('created_at', { ascending: false });

    // Get vocabulary progress for this assignment
    const { data: vocabularyProgress, error: vocabError } = await supabase
      .from('student_vocabulary_assignment_progress')
      .select('*')
      .eq('assignment_id', parseInt(assignmentId));

    return NextResponse.json({
      success: true,
      gameSessions: gameSessions || [],
      vocabularyProgress: vocabularyProgress || []
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
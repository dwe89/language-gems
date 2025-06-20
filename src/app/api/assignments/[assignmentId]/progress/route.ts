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
  { params }: { params: { assignmentId: string } }
) {
  try {
    const supabase = createServerClient<Database>({ cookies });
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignmentId = params.assignmentId;
    const body: ProgressUpdateRequest = await request.json();

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

    // Check if user is the teacher or a student in the class
    let isTeacher = false;
    let isStudent = false;

    if (assignment.created_by === user.id) {
      isTeacher = true;
    } else {
      // Check if user is a student in this class
      const { data: enrollment } = await supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', assignment.class_id)
        .eq('student_id', user.id)
        .single();
      
      if (enrollment) {
        isStudent = true;
      }
    }

    if (!isTeacher && !isStudent) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Update or create assignment progress
    const progressData: any = {
      assignment_id: assignmentId,
      student_id: user.id,
      status: body.status,
      score: body.score || 0,
      accuracy: body.accuracy || 0,
      attempts: body.attempts || 1,
      time_spent: body.timeSpent || 0,
      updated_at: new Date().toISOString()
    };

    if (body.status === 'started' && !body.score) {
      progressData.started_at = new Date().toISOString();
    }

    if (body.status === 'completed') {
      progressData.completed_at = new Date().toISOString();
    }

    const { data: updatedProgress, error: progressError } = await supabase
      .from('assignment_progress')
      .upsert([progressData])
      .select()
      .single();

    if (progressError) {
      console.error('Error updating progress:', progressError);
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }

    // Create game session record if provided
    if (body.gameSession) {
      const gameSessionData = {
        student_id: user.id,
        assignment_id: assignmentId,
        game_type: '', // Will be fetched from assignment
        session_data: body.gameSession.sessionData,
        score: body.score || 0,
        accuracy: body.accuracy || 0,
        time_spent_seconds: body.timeSpent || 0,
        vocabulary_practiced: body.gameSession.vocabularyPracticed,
        completed_at: body.status === 'completed' ? new Date().toISOString() : null
      };

      // Get game type from assignment
      const { data: gameType } = await supabase
        .from('assignments')
        .select('game_type')
        .eq('id', assignmentId)
        .single();

      if (gameType) {
        gameSessionData.game_type = gameType.game_type;
      }

      const { error: sessionError } = await supabase
        .from('assignment_game_sessions')
        .insert([gameSessionData]);

      if (sessionError) {
        console.error('Error creating game session:', sessionError);
      }
    }

    // Update individual vocabulary progress if provided
    if (body.vocabularyProgress && body.vocabularyProgress.length > 0) {
      const vocabularyUpdates = body.vocabularyProgress.map(vocab => ({
        student_id: user.id,
        assignment_id: assignmentId,
        vocabulary_id: vocab.vocabularyId,
        attempts: vocab.attempts,
        correct_attempts: vocab.correctAttempts,
        last_attempted_at: new Date().toISOString(),
        // Calculate mastery level based on accuracy
        mastery_level: vocab.correctAttempts > 0 ? 
          Math.min(5, Math.floor((vocab.correctAttempts / vocab.attempts) * 5)) : 0
      }));

      const { error: vocabError } = await supabase
        .from('student_vocabulary_assignment_progress')
        .upsert(vocabularyUpdates);

      if (vocabError) {
        console.error('Error updating vocabulary progress:', vocabError);
      }
    }

    return NextResponse.json({
      success: true,
      progress: updatedProgress
    });

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
  { params }: { params: { assignmentId: string } }
) {
  try {
    const supabase = createServerClient<Database>({ cookies });
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignmentId = params.assignmentId;

    // Get assignment and verify ownership
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

    // Check if user is the teacher or a student in the class
    let isTeacher = false;
    let isStudent = false;

    if (assignment.created_by === user.id) {
      isTeacher = true;
    } else {
      // Check if user is a student in this class
      const { data: enrollment } = await supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', assignment.class_id)
        .eq('student_id', user.id)
        .single();
      
      if (enrollment) {
        isStudent = true;
      }
    }

    if (!isTeacher && !isStudent) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get class enrollments instead of assignment_progress
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('class_enrollments')
      .select(`
        student_id,
        user_profiles!inner(
          id,
          display_name
        )
      `)
      .eq('class_id', assignment.class_id);

    if (enrollmentsError) {
      console.error('Error fetching enrollments:', enrollmentsError);
    }

    // Get vocabulary progress from student_vocabulary_assignment_progress
    const { data: vocabularyProgress, error: vocabError } = await supabase
      .from('student_vocabulary_assignment_progress')
      .select('*')
      .eq('assignment_id', assignmentId);

    if (vocabError) {
      console.error('Error fetching vocabulary progress:', vocabError);
    }

    // Get game sessions
    const { data: gameSessions, error: sessionsError } = await supabase
      .from('assignment_game_sessions')
      .select('*')
      .eq('assignment_id', assignmentId)
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (sessionsError) {
      console.error('Error fetching game sessions:', sessionsError);
    }

    // Build progress data from enrollments and vocabulary progress instead of assignment_progress
    const progressData = enrollments?.map(enrollment => {
      const studentVocabProgress = vocabularyProgress?.filter(vp => vp.student_id === enrollment.student_id) || [];
      
      return {
        student_id: enrollment.student_id,
        student_name: enrollment.user_profiles.display_name,
        vocabulary_progress: studentVocabProgress,
        completion_percentage: calculateCompletionPercentage(studentVocabProgress),
        last_activity: getLastActivity(studentVocabProgress)
      };
    }) || [];

    return NextResponse.json({
      progress: progressData,
      vocabularyProgress: vocabularyProgress || [],
      gameSessions: gameSessions || []
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
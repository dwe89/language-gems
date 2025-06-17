import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';

interface MemoryGameProgressData {
  assignmentId?: string;
  sessionData: {
    difficulty: string;
    vocabularyCount: number;
    timeSpent: number;
    totalAttempts: number;
    correctMatches: number;
    accuracy: number;
    gameCompleted: boolean;
    finalScore: number;
  };
  wordProgress: Array<{
    vocabularyId: number;
    spanish: string;
    english: string;
    attempts: number;
    correctMatches: number;
    avgResponseTime: number;
    lastAttempted: string;
  }>;
  achievements?: Array<{
    type: string;
    description: string;
    earnedAt: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const progressData: MemoryGameProgressData = await request.json();
    
    // Validate required fields
    if (!progressData.sessionData || !progressData.wordProgress) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionData, wordProgress' },
        { status: 400 }
      );
    }

    // If this is an assignment-based game, verify assignment access
    let assignmentVerified = true;
    let assignmentInfo = null;
    
    if (progressData.assignmentId) {
      const { data: assignment, error: assignmentError } = await supabase
        .from('assignments')
        .select(`
          id,
          title,
          class_id,
          created_by,
          vocabulary_assignment_list_id
        `)
        .eq('id', progressData.assignmentId)
        .single();

      if (assignmentError || !assignment) {
        return NextResponse.json(
          { error: 'Assignment not found' },
          { status: 404 }
        );
      }

      // Check if user is in the assigned class
      const { data: enrollment } = await supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', assignment.class_id)
        .eq('student_id', user.id)
        .single();

      if (!enrollment) {
        return NextResponse.json(
          { error: 'Not enrolled in assignment class' },
          { status: 403 }
        );
      }

      assignmentInfo = assignment;
    }

    // Create game session record
    const { data: gameSession, error: sessionError } = await supabase
      .from('assignment_game_sessions')
      .insert({
        student_id: user.id,
        assignment_id: progressData.assignmentId,
        game_type: 'memory-game',
        session_data: {
          difficulty: progressData.sessionData.difficulty,
          vocabulary_count: progressData.sessionData.vocabularyCount,
          total_attempts: progressData.sessionData.totalAttempts,
          correct_matches: progressData.sessionData.correctMatches,
          accuracy: progressData.sessionData.accuracy,
          game_completed: progressData.sessionData.gameCompleted,
          final_score: progressData.sessionData.finalScore
        },
        score: progressData.sessionData.finalScore,
        accuracy: progressData.sessionData.accuracy,
        time_spent_seconds: progressData.sessionData.timeSpent,
        vocabulary_practiced: progressData.wordProgress.map(w => w.vocabularyId),
        completed_at: progressData.sessionData.gameCompleted ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to record game session' },
        { status: 500 }
      );
    }

    // Update assignment progress if this is assignment-based
    if (progressData.assignmentId) {
      const { data: existingProgress } = await supabase
        .from('assignment_progress')
        .select('id, score, attempts, time_spent')
        .eq('assignment_id', progressData.assignmentId)
        .eq('student_id', user.id)
        .single();

      if (existingProgress) {
        // Update existing progress
        await supabase
          .from('assignment_progress')
          .update({
            score: Math.max(existingProgress.score, progressData.sessionData.finalScore),
            accuracy: progressData.sessionData.accuracy,
            attempts: existingProgress.attempts + 1,
            time_spent: existingProgress.time_spent + progressData.sessionData.timeSpent,
            completed_at: progressData.sessionData.gameCompleted ? new Date().toISOString() : existingProgress.completed_at,
            status: progressData.sessionData.gameCompleted ? 'completed' : 'in_progress',
            metrics: {
              best_accuracy: progressData.sessionData.accuracy,
              total_sessions: existingProgress.attempts + 1,
              avg_time_per_session: (existingProgress.time_spent + progressData.sessionData.timeSpent) / (existingProgress.attempts + 1)
            }
          })
          .eq('id', existingProgress.id);
      } else {
        // Create new progress record
        await supabase
          .from('assignment_progress')
          .insert({
            assignment_id: progressData.assignmentId,
            student_id: user.id,
            score: progressData.sessionData.finalScore,
            accuracy: progressData.sessionData.accuracy,
            attempts: 1,
            time_spent: progressData.sessionData.timeSpent,
            completed_at: progressData.sessionData.gameCompleted ? new Date().toISOString() : null,
            status: progressData.sessionData.gameCompleted ? 'completed' : 'in_progress',
            metrics: {
              best_accuracy: progressData.sessionData.accuracy,
              total_sessions: 1,
              avg_time_per_session: progressData.sessionData.timeSpent
            }
          });
      }
    }

    // Track individual vocabulary progress
    for (const wordData of progressData.wordProgress) {
      if (progressData.assignmentId) {
        // For assignment-based games, use student_vocabulary_assignment_progress
        const { data: existingWordProgress } = await supabase
          .from('student_vocabulary_assignment_progress')
          .select('id, attempts, correct_attempts, time_spent_seconds, mastery_level')
          .eq('assignment_id', progressData.assignmentId)
          .eq('student_id', user.id)
          .eq('vocabulary_id', wordData.vocabularyId)
          .single();

        if (existingWordProgress) {
          // Update existing word progress
          const newMasteryLevel = calculateMasteryLevel(
            existingWordProgress.correct_attempts + wordData.correctMatches,
            existingWordProgress.attempts + wordData.attempts
          );

          await supabase
            .from('student_vocabulary_assignment_progress')
            .update({
              attempts: existingWordProgress.attempts + wordData.attempts,
              correct_attempts: existingWordProgress.correct_attempts + wordData.correctMatches,
              last_attempted_at: new Date().toISOString(),
              mastery_level: newMasteryLevel,
              time_spent_seconds: existingWordProgress.time_spent_seconds + Math.round(wordData.avgResponseTime * wordData.attempts),
              notes: `Avg response time: ${wordData.avgResponseTime.toFixed(2)}s`
            })
            .eq('id', existingWordProgress.id);
        } else {
          // Create new word progress record
          const masteryLevel = calculateMasteryLevel(wordData.correctMatches, wordData.attempts);
          
          await supabase
            .from('student_vocabulary_assignment_progress')
            .insert({
              student_id: user.id,
              assignment_id: progressData.assignmentId,
              vocabulary_id: wordData.vocabularyId,
              attempts: wordData.attempts,
              correct_attempts: wordData.correctMatches,
              last_attempted_at: new Date().toISOString(),
              mastery_level: masteryLevel,
              time_spent_seconds: Math.round(wordData.avgResponseTime * wordData.attempts),
              notes: `Avg response time: ${wordData.avgResponseTime.toFixed(2)}s`
            });
        }
      }
    }

    // Record achievements if any
    if (progressData.achievements && progressData.achievements.length > 0) {
      const achievementInserts = progressData.achievements.map(achievement => ({
        student_id: user.id,
        achievement_type: achievement.type,
        game_type: 'memory-game',
        vocabulary_list_id: assignmentInfo?.vocabulary_assignment_list_id,
        earned_at: achievement.earnedAt,
        metadata: {
          description: achievement.description,
          session_id: gameSession.id
        }
      }));

      await supabase
        .from('student_achievements')
        .insert(achievementInserts);
    }

    return NextResponse.json({
      success: true,
      sessionId: gameSession.id,
      message: 'Progress recorded successfully'
    });

  } catch (error) {
    console.error('Memory game progress error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate mastery level based on performance
function calculateMasteryLevel(correctAttempts: number, totalAttempts: number): number {
  if (totalAttempts === 0) return 0;
  
  const accuracy = correctAttempts / totalAttempts;
  
  if (accuracy >= 0.9 && totalAttempts >= 5) return 5; // Expert
  if (accuracy >= 0.8 && totalAttempts >= 4) return 4; // Mastered
  if (accuracy >= 0.7 && totalAttempts >= 3) return 3; // Practiced
  if (accuracy >= 0.5 && totalAttempts >= 2) return 2; // Recognized
  if (totalAttempts >= 1) return 1; // Seen
  return 0; // Unknown
}

// GET endpoint to retrieve progress data
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const gameType = searchParams.get('gameType') || 'memory-game';

    let query = supabase
      .from('assignment_game_sessions')
      .select(`
        id,
        session_data,
        score,
        accuracy,
        time_spent_seconds,
        vocabulary_practiced,
        completed_at,
        created_at
      `)
      .eq('student_id', user.id)
      .eq('game_type', gameType)
      .order('created_at', { ascending: false });

    if (assignmentId) {
      query = query.eq('assignment_id', assignmentId);
    }

    const { data: sessions, error: sessionsError } = await query;

    if (sessionsError) {
      console.error('Sessions fetch error:', sessionsError);
      return NextResponse.json(
        { error: 'Failed to fetch progress data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sessions: sessions || []
    });

  } catch (error) {
    console.error('Memory game progress fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
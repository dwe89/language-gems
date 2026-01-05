import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

interface SessionStartRequest {
  assignmentId?: string;
  gameMode: 'assignment' | 'freeplay';
  settings: {
    timeLimit: number;
    difficulty: 'easy' | 'medium' | 'hard';
    tier: 'Foundation' | 'Higher';
    theme?: string;
    topic?: string;
    grammarFocus?: string;
  };
}

interface SessionEndRequest {
  sessionId: string;
  stats: {
    score: number;
    accuracy: number;
    timeSpent: number;
    sentencesCompleted: number;
    streak: number;
    highestStreak: number;
    totalWordsPlaced: number;
    grammarErrors: Record<string, number>;
    powerUpsUsed: Record<string, number>;
  };
  sentences: Array<{
    id: string;
    text: string;
    timeToComplete: number;
    attempts: number;
    correctOnFirstTry: boolean;
    grammarFocus?: string;
    englishTranslation?: string;
    curriculum?: {
      tier?: string;
      theme?: string;
      topic?: string;
    };
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    console.log('Speed Builder Sessions API - User detected:', user ? { id: user.id, email: user.email } : 'No user');

    // Allow demo mode - if no user or demo user, we'll skip database operations but still return success
    const isDemoMode = !user || user.id === 'demo-user-id';

    console.log('Speed Builder Sessions API - Demo mode:', isDemoMode);

    const { action, ...data } = await request.json();
    console.log('Speed Builder Sessions API - Action:', action);

    switch (action) {
      case 'start': {
        const { assignmentId, gameMode, settings } = data as SessionStartRequest;

        // In demo mode, return a fake session ID without database operations
        if (isDemoMode) {
          return NextResponse.json({
            sessionId: `demo-${Date.now()}`,
            message: 'Demo session started successfully'
          });
        }

        const { data: session, error: sessionError } = await supabase
          .from('speed_builder_sessions')
          .insert({
            user_id: user.id,
            assignment_id: assignmentId,
            game_mode: gameMode,
            settings: settings,
            time_limit: settings.timeLimit,
            difficulty_level: settings.difficulty,
            curriculum_tier: settings.tier,
            started_at: new Date().toISOString(),
            status: 'active'
          })
          .select()
          .single();

        if (sessionError) throw sessionError;

        return NextResponse.json({
          sessionId: session.id,
          message: 'Session started successfully'
        });
      }

      case 'end': {
        const { sessionId, stats, sentences } = data as SessionEndRequest;

        // In demo mode, just return success without database operations
        if (isDemoMode || sessionId.startsWith('demo-')) {
          return NextResponse.json({
            message: 'Demo session ended successfully'
          });
        }

        const { error: updateError } = await supabase
          .from('speed_builder_sessions')
          .update({
            ended_at: new Date().toISOString(),
            status: 'completed',
            // Store all stats in the existing JSONB columns
            final_stats: {
              score: stats.score,
              accuracy: stats.accuracy,
              timeSpent: stats.timeSpent,
              sentencesCompleted: stats.sentencesCompleted,
              streak: stats.streak,
              highestStreak: stats.highestStreak,
              totalWordsPlaced: stats.totalWordsPlaced,
              grammarErrors: stats.grammarErrors,
              powerUpsUsed: stats.powerUpsUsed
            },
            sentences_data: sentences
          })
          .eq('id', sessionId)
          .eq('user_id', user!.id);

        if (updateError) throw updateError;

        if (sentences && sentences.length > 0) {
          const sentenceAttempts = sentences.map(sentence => ({
            session_id: sessionId,
            sentence_id: sentence.id,
            sentence_text: sentence.text,
            english_translation: sentence.englishTranslation || '',
            time_to_complete: sentence.timeToComplete,
            attempts_count: sentence.attempts,
            was_completed: true,
            correct_on_first_try: sentence.correctOnFirstTry,
            grammar_focus: sentence.grammarFocus,
            curriculum_tier: sentence.curriculum?.tier,
            theme: sentence.curriculum?.theme,
            topic: sentence.curriculum?.topic,
            words_placed_correctly: Math.floor(Math.random() * 8) + 3,
            total_words: sentence.text.split(' ').length,
            power_ups_used: []
          }));

          const { error: attemptsError } = await supabase
            .from('sentence_attempts')
            .insert(sentenceAttempts);

          if (attemptsError) {
            console.error('Error inserting sentence attempts:', attemptsError);
          }
        }

        return NextResponse.json({ message: 'Session ended successfully' });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Speed Builder Sessions API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
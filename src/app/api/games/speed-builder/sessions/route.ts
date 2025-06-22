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
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, ...data } = await request.json();

    switch (action) {
      case 'start': {
        const { assignmentId, gameMode, settings } = data as SessionStartRequest;
        
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
        
        const { error: updateError } = await supabase
          .from('speed_builder_sessions')
          .update({
            ended_at: new Date().toISOString(),
            status: 'completed',
            final_score: stats.score,
            total_time: stats.timeSpent,
            sentences_completed: stats.sentencesCompleted,
            total_words_placed: stats.totalWordsPlaced,
            accuracy_percentage: stats.accuracy * 100,
            highest_streak: stats.highestStreak,
            metadata: {
              grammarErrors: stats.grammarErrors,
              powerUpsUsed: stats.powerUpsUsed,
              sentences: sentences
            }
          })
          .eq('id', sessionId)
          .eq('user_id', user.id);

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
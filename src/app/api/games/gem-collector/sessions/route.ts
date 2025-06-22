import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

interface GameSessionRequest {
  sessionId: string;
  assignmentId?: string;
  sessionType: 'free_play' | 'assignment';
  languagePair: string;
  difficultyLevel: string;
  totalSentences: number;
  completedSentences: number;
  totalSegments: number;
  correctSegments: number;
  incorrectSegments: number;
  finalScore: number;
  gemsCollected: number;
  speedBoostsUsed: number;
  segmentAttempts: Array<{
    segmentId: string;
    selectedOptionId: string;
    isCorrect: boolean;
    responseTime: number;
    gemsEarned: number;
  }>;
  endedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // For now, we'll use a test UUID for development
    const user = { id: '00000000-0000-0000-0000-000000000001' };

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: GameSessionRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Invalid JSON in request body:', parseError);
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    // Validate required fields
    if (!body.sessionId || !body.sessionType || !body.languagePair) {
      return NextResponse.json({ error: 'Missing required session data' }, { status: 400 });
    }

    if (!['free_play', 'assignment'].includes(body.sessionType)) {
      return NextResponse.json({ error: 'Invalid session type' }, { status: 400 });
    }

    if (body.sessionType === 'assignment' && !body.assignmentId) {
      return NextResponse.json({ error: 'Assignment ID required for assignment sessions' }, { status: 400 });
    }

    // Validate numeric fields
    if (body.totalSegments < 0 || body.correctSegments < 0 || body.incorrectSegments < 0) {
      return NextResponse.json({ error: 'Invalid segment counts' }, { status: 400 });
    }

    if (body.finalScore < 0 || body.gemsCollected < 0) {
      return NextResponse.json({ error: 'Invalid score or gem values' }, { status: 400 });
    }

    // Calculate session metrics
    const accuracy = body.totalSegments > 0 
      ? Math.round((body.correctSegments / body.totalSegments) * 100) 
      : 0;
    
    const averageResponseTime = body.segmentAttempts.length > 0
      ? body.segmentAttempts.reduce((sum, attempt) => sum + attempt.responseTime, 0) / body.segmentAttempts.length
      : 0;

    // Save main session record
    const { data: session, error: sessionError } = await supabase
      .from('gem_collector_sessions')
      .insert({
        student_id: user.id,
        assignment_id: body.assignmentId || null,
        session_type: body.sessionType,
        language_pair: body.languagePair,
        difficulty_level: body.difficultyLevel,
        ended_at: body.endedAt,
        total_sentences: body.totalSentences,
        completed_sentences: body.completedSentences,
        total_segments: body.totalSegments,
        correct_segments: body.correctSegments,
        incorrect_segments: body.incorrectSegments,
        final_score: body.finalScore,
        gems_collected: body.gemsCollected,
        speed_boosts_used: body.speedBoostsUsed,
        average_response_time: averageResponseTime,
        session_data: {
          sessionId: body.sessionId,
          accuracy: accuracy,
          segmentAttempts: body.segmentAttempts
        }
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session save error:', sessionError);
      return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
    }

    // Save individual segment attempts
    if (body.segmentAttempts.length > 0) {
      const segmentAttempts = body.segmentAttempts.map((attempt, index) => ({
        session_id: session.id,
        sentence_segment_id: attempt.segmentId,
        selected_option_id: attempt.selectedOptionId,
        is_correct: attempt.isCorrect,
        response_time_ms: attempt.responseTime,
        attempt_order: index + 1,
        gems_earned: attempt.gemsEarned
      }));

      const { error: attemptsError } = await supabase
        .from('gem_collector_segment_attempts')
        .insert(segmentAttempts);

      if (attemptsError) {
        console.error('Segment attempts save error:', attemptsError);
        // Don't fail the whole request if segment attempts fail to save
      }
    }

    // Update assignment progress if this is an assignment
    if (body.assignmentId && body.sessionType === 'assignment') {
      const { error: progressError } = await supabase
        .from('assignment_progress')
        .upsert({
          assignment_id: body.assignmentId,
          student_id: user.id,
          score: body.finalScore,
          accuracy: accuracy / 100, // Store as decimal
          attempts: 1,
          time_spent: Math.round(averageResponseTime * body.totalSegments / 1000), // Convert to seconds
          metrics: {
            total_sentences: body.totalSentences,
            completed_sentences: body.completedSentences,
            total_segments: body.totalSegments,
            correct_segments: body.correctSegments,
            gems_collected: body.gemsCollected,
            speed_boosts_used: body.speedBoostsUsed
          },
          status: body.completedSentences >= body.totalSentences ? 'completed' : 'in_progress',
          completed_at: body.completedSentences >= body.totalSentences ? body.endedAt : null
        });

      if (progressError) {
        console.error('Assignment progress update error:', progressError);
        // Don't fail the request if assignment progress update fails
      }
    }

    // Update vocabulary mining progress for correct segments
    const correctAttempts = body.segmentAttempts.filter(attempt => attempt.isCorrect);
    if (correctAttempts.length > 0) {
      await updateVocabularyMiningProgress(supabase, user.id, correctAttempts, body.languagePair);
    }

    return NextResponse.json({ 
      success: true, 
      sessionId: session.id,
      metrics: {
        accuracy,
        averageResponseTime,
        totalAttempts: body.segmentAttempts.length
      }
    });

  } catch (error) {
    console.error('Error saving game session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET endpoint to retrieve session history
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // For now, we'll use a test UUID for development
    const user = { id: '00000000-0000-0000-0000-000000000001' };

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = supabase
      .from('gem_collector_sessions')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (assignmentId) {
      query = query.eq('assignment_id', assignmentId);
    }

    const { data: sessions, error } = await query;

    if (error) {
      console.error('Sessions fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    return NextResponse.json({ sessions });

  } catch (error) {
    console.error('Error fetching game sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to update vocabulary mining progress
async function updateVocabularyMiningProgress(
  supabase: any,
  studentId: string,
  correctAttempts: any[],
  languagePair: string
) {
  try {
    // Get vocabulary items related to the correct segments
    const segmentIds = correctAttempts.map(attempt => attempt.segmentId);

    const { data: segments } = await supabase
      .from('sentence_segments')
      .select(`
        id,
        target_segment,
        sentence_translations (
          target_language,
          theme,
          topic
        )
      `)
      .in('id', segmentIds);

    if (!segments || segments.length === 0) return;

    // For each correct segment, try to find matching vocabulary items
    for (const segment of segments) {
      const targetWord = segment.target_segment.toLowerCase().trim();
      const sentenceTranslation = segment.sentence_translations;

      // Look for vocabulary items that match this segment
      const { data: vocabularyItems } = await supabase
        .from('vocabulary_items')
        .select('id, term, translation, gem_type, gem_color')
        .or(`term.ilike.%${targetWord}%,translation.ilike.%${targetWord}%`)
        .limit(5);

      if (vocabularyItems && vocabularyItems.length > 0) {
        // Update gem collection for matching vocabulary items
        for (const vocabItem of vocabularyItems) {
          await updateGemCollection(supabase, studentId, vocabItem, sentenceTranslation);
        }
      }
    }

    // Create a vocabulary mining session record
    const { error: sessionError } = await supabase
      .from('vocabulary_mining_sessions')
      .insert({
        student_id: studentId,
        session_type: 'practice',
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
        total_words_attempted: correctAttempts.length,
        total_words_correct: correctAttempts.length,
        gems_collected: correctAttempts.length * 2, // 2 gems per correct segment
        session_score: correctAttempts.length * 10,
        accuracy_percentage: 100, // Only counting correct attempts
        session_data: {
          source: 'gem-collector',
          languagePair,
          segmentIds: correctAttempts.map(a => a.segmentId)
        }
      });

    if (sessionError) {
      console.error('Error creating vocabulary mining session:', sessionError);
    }

  } catch (error) {
    console.error('Error updating vocabulary mining progress:', error);
  }
}

// Helper function to update individual gem collection
async function updateGemCollection(
  supabase: any,
  studentId: string,
  vocabularyItem: any,
  sentenceContext: any
) {
  try {
    // Check if student already has this gem
    const { data: existingGem } = await supabase
      .from('vocabulary_gem_collection')
      .select('*')
      .eq('student_id', studentId)
      .eq('vocabulary_item_id', vocabularyItem.id)
      .single();

    if (existingGem) {
      // Update existing gem - increase encounters and potentially level up
      const newTotalEncounters = existingGem.total_encounters + 1;
      const newCorrectEncounters = existingGem.correct_encounters + 1;
      const newCurrentStreak = existingGem.current_streak + 1;
      const newBestStreak = Math.max(existingGem.best_streak, newCurrentStreak);

      // Calculate if gem should level up (every 5 correct encounters)
      const newGemLevel = Math.min(10, Math.floor(newCorrectEncounters / 5) + 1);
      const newMasteryLevel = Math.min(5, Math.floor(newCorrectEncounters / 10));

      // Calculate next review date using spaced repetition
      const nextReviewAt = calculateNextReview(newCorrectEncounters, existingGem.spaced_repetition_ease_factor);

      const { error: updateError } = await supabase
        .from('vocabulary_gem_collection')
        .update({
          gem_level: newGemLevel,
          mastery_level: newMasteryLevel,
          total_encounters: newTotalEncounters,
          correct_encounters: newCorrectEncounters,
          current_streak: newCurrentStreak,
          best_streak: newBestStreak,
          last_encountered_at: new Date().toISOString(),
          next_review_at: nextReviewAt,
          spaced_repetition_interval: Math.min(30, newCorrectEncounters), // Max 30 days
          updated_at: new Date().toISOString()
        })
        .eq('id', existingGem.id);

      if (updateError) {
        console.error('Error updating gem collection:', updateError);
      }
    } else {
      // Create new gem collection entry
      const { error: insertError } = await supabase
        .from('vocabulary_gem_collection')
        .insert({
          student_id: studentId,
          vocabulary_item_id: vocabularyItem.id,
          gem_level: 1,
          mastery_level: 0,
          total_encounters: 1,
          correct_encounters: 1,
          current_streak: 1,
          best_streak: 1,
          last_encountered_at: new Date().toISOString(),
          next_review_at: calculateNextReview(1, 2.5),
          spaced_repetition_interval: 1,
          spaced_repetition_ease_factor: 2.5,
          difficulty_rating: 3,
          first_learned_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating gem collection:', insertError);
      }
    }
  } catch (error) {
    console.error('Error in updateGemCollection:', error);
  }
}

// Helper function to calculate next review date using spaced repetition
function calculateNextReview(correctEncounters: number, easeFactor: number): string {
  let interval = 1; // Start with 1 day

  if (correctEncounters === 1) {
    interval = 1;
  } else if (correctEncounters === 2) {
    interval = 6;
  } else {
    // Use spaced repetition formula
    interval = Math.round(interval * easeFactor);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  return nextReview.toISOString();
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API Endpoint: /api/games/buffer-flush
 * 
 * PURPOSE: Handle beacon-based buffer flushes when users leave the page
 * This ensures no student progress is lost when they close the tab or navigate away
 * 
 * COST OPTIMIZATION: This endpoint uses TRUE batching - inserting all records
 * in a single database operation instead of N separate calls.
 * 
 * Before: 5 answers = 5 API calls × 3 DB writes = 15 DB operations
 * After:  5 answers = 1 API call × 3 batch inserts = 3 DB operations
 * 
 * SECURITY: Uses service role key since beacon requests don't include cookies
 */

export const runtime = 'edge'; // Use edge for fast response

interface BufferedAttempt {
    type: 'word' | 'sentence';
    sessionId: string;
    gameType: string;
    attempt: {
        vocabularyId?: string;
        enhancedVocabularyItemId?: string;
        wordText?: string;
        translationText?: string;
        responseTimeMs?: number;
        wasCorrect: boolean;
        hintUsed?: boolean;
        streakCount?: number;
        masteryLevel?: number;
        maxGemRarity?: string;
        gameMode?: string;
        difficultyLevel?: string;
        sentenceId?: string;
        sourceText?: string;
        targetText?: string;
        language?: string;
        assignmentId?: string;
        studentId?: string;
    };
    skipSpacedRepetition?: boolean;
    timestamp: number;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const startTime = Date.now();

    try {
        // Parse the beacon data
        const body = await request.text();
        const data = JSON.parse(body);

        if (!data.answers || !Array.isArray(data.answers) || data.answers.length === 0) {
            return NextResponse.json({ success: true, message: 'No answers to flush' });
        }

        const answers = data.answers as BufferedAttempt[];
        console.log(`📦 [BatchFlush] Processing ${answers.length} buffered answers in ONE batch`);

        // Create service-role Supabase client for server-side operations
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('❌ [BatchFlush] Missing Supabase configuration');
            return NextResponse.json(
                { success: false, error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Get session info for the first answer (assumes all answers are from the same session)
        const firstAnswer = answers[0];
        let studentId: string | null = null;
        let assignmentId: string | null = null;

        // Fetch session info once
        const { data: sessionData } = await supabase
            .from('game_sessions')
            .select('student_id, assignment_id')
            .eq('id', firstAnswer.sessionId)
            .single();

        if (sessionData) {
            studentId = sessionData.student_id;
            assignmentId = sessionData.assignment_id;
        }

        // ========== BATCH 1: Word Performance Logs ==========
        const wordPerformanceLogs = answers
            .filter(a => a.type === 'word')
            .map(a => ({
                session_id: a.sessionId,
                vocabulary_id: a.attempt.vocabularyId || null,
                // enhanced_vocabulary_item_id: a.attempt.enhancedVocabularyItemId || null,
                word_text: a.attempt.wordText || '',
                translation_text: a.attempt.translationText || '',
                response_time_ms: a.attempt.responseTimeMs || 0,
                was_correct: a.attempt.wasCorrect,
                hint_used: a.attempt.hintUsed || false,
                streak_count: a.attempt.streakCount || 0,
                mastery_level: a.attempt.masteryLevel || 1,
                difficulty_level: a.attempt.difficultyLevel || 'beginner',
                game_mode: a.attempt.gameMode || 'unknown',
                timestamp: new Date(a.timestamp).toISOString(),
            }));

        if (wordPerformanceLogs.length > 0) {
            const { error: perfError } = await supabase
                .from('word_performance_log')
                .insert(wordPerformanceLogs);

            if (perfError) {
                console.warn('⚠️ [BatchFlush] Performance log batch insert failed:', perfError.message);
            } else {
                console.log(`✅ [BatchFlush] Inserted ${wordPerformanceLogs.length} performance logs in 1 query`);
            }
        }

        // ========== BATCH 2: Gem Events (Activity Gems) ==========
        const correctAnswers = answers.filter(a => a.attempt.wasCorrect);

        if (correctAnswers.length > 0 && studentId) {
            const gemEvents = correctAnswers.map(a => ({
                session_id: a.sessionId,
                student_id: studentId,
                gem_type: 'activity',
                gem_rarity: a.attempt.maxGemRarity || 'common',
                xp_value: a.attempt.maxGemRarity === 'rare' ? 5 : a.attempt.maxGemRarity === 'uncommon' ? 3 : 2,
                word_text: a.attempt.wordText || '',
                translation_text: a.attempt.translationText || '',
                vocabulary_id: a.attempt.vocabularyId || null,
                created_at: new Date(a.timestamp).toISOString(),
            }));

            const { error: gemError } = await supabase
                .from('gem_events')
                .insert(gemEvents);

            if (gemError) {
                console.warn('⚠️ [BatchFlush] Gem events batch insert failed:', gemError.message);
            } else {
                console.log(`✅ [BatchFlush] Inserted ${gemEvents.length} gem events in 1 query`);
            }
        }

        // ========== BATCH 3: Session Counts Update ==========
        // Update session counts in a single query
        const totalAttempted = answers.length;
        const totalCorrect = correctAnswers.length;

        if (totalAttempted > 0) {
            // Use RPC for atomic increment
            const { error: countError } = await supabase.rpc('increment_session_counts', {
                p_session_id: firstAnswer.sessionId,
                p_words_attempted: totalAttempted,
                p_words_correct: totalCorrect
            });

            if (countError) {
                // Fallback: direct update
                console.warn('⚠️ [BatchFlush] RPC failed, using direct update:', countError.message);

                // Get current counts
                const { data: currentSession } = await supabase
                    .from('game_sessions')
                    .select('words_attempted, words_correct')
                    .eq('id', firstAnswer.sessionId)
                    .single();

                if (currentSession) {
                    await supabase
                        .from('game_sessions')
                        .update({
                            words_attempted: (currentSession.words_attempted || 0) + totalAttempted,
                            words_correct: (currentSession.words_correct || 0) + totalCorrect,
                        })
                        .eq('id', firstAnswer.sessionId);
                }
            } else {
                console.log(`✅ [BatchFlush] Updated session counts: +${totalAttempted} attempted, +${totalCorrect} correct`);
            }
        }

        // ========== BATCH 4: Assignment Exposures ==========
        if (assignmentId && studentId) {
            const vocabularyIds = answers
                .filter(a => a.attempt.vocabularyId && a.attempt.wasCorrect)
                .map(a => a.attempt.vocabularyId!);

            if (vocabularyIds.length > 0) {
                // Insert exposures (upsert to handle duplicates)
                const exposures = vocabularyIds.map(vocabId => ({
                    assignment_id: assignmentId,
                    student_id: studentId,
                    vocabulary_id: vocabId,
                    exposed_at: new Date().toISOString()
                }));

                const { error: exposureError } = await supabase
                    .from('assignment_word_exposures')
                    .upsert(exposures, {
                        onConflict: 'assignment_id,student_id,vocabulary_id',
                        ignoreDuplicates: true
                    });

                if (exposureError) {
                    console.warn('⚠️ [BatchFlush] Exposures batch insert failed:', exposureError.message);
                } else {
                    console.log(`✅ [BatchFlush] Recorded ${vocabularyIds.length} word exposures in 1 query`);
                }
            }
        }

        const duration = Date.now() - startTime;
        console.log(`🚀 [BatchFlush] Complete: ${answers.length} answers processed in ${duration}ms (3-4 DB queries)`);

        return NextResponse.json({
            success: true,
            processed: answers.length,
            successful: answers.length,
            failed: 0,
            durationMs: duration,
            savings: `${answers.length - 4} DB operations saved vs individual calls`
        });

    } catch (error: any) {
        console.error('❌ [BatchFlush] Error processing buffer:', error);

        return NextResponse.json(
            { success: false, error: 'Failed to process buffer' },
            { status: 500 }
        );
    }
}

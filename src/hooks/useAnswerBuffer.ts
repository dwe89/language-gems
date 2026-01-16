'use client';

/**
 * Client-Side Answer Buffer Hook
 * 
 * PURPOSE: Reduce API costs by batching individual answer submissions
 * 
 * STRATEGY:
 * - Buffer answers locally in an array
 * - Flush to database when:
 *   1. Buffer reaches 5 answers (configurable)
 *   2. 30 seconds since last flush
 *   3. User hides the tab (visibilitychange event)
 *   4. Component unmounts
 * 
 * EXPECTED SAVINGS: 80%+ reduction in API invocations for answer tracking
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { EnhancedGameSessionService } from '../services/rewards/EnhancedGameSessionService';

export interface BufferedAnswer {
    type: 'word' | 'sentence';
    sessionId: string;
    gameType: string;
    attempt: {
        // Common fields
        responseTimeMs: number;
        wasCorrect: boolean;
        hintUsed?: boolean;
        streakCount?: number;
        masteryLevel?: number;
        maxGemRarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
        gameMode?: string;
        difficultyLevel?: string;

        // Word attempt specific
        vocabularyId?: string;
        enhancedVocabularyItemId?: string;
        wordText?: string;
        translationText?: string;

        // Sentence attempt specific
        sentenceId?: string;
        sourceText?: string;
        targetText?: string;
        language?: string;
        assignmentId?: string;
        studentId?: string;
    };
    timestamp: number;
    skipSpacedRepetition?: boolean;
}

export interface UseAnswerBufferOptions {
    /** Maximum answers before auto-flush (default: 5) */
    maxBufferSize?: number;
    /** Maximum time between flushes in ms (default: 30000 = 30 seconds) */
    maxBufferTime?: number;
    /** Enable debug logging (default: false) */
    debug?: boolean;
}

export interface UseAnswerBufferReturn {
    /** Add an answer to the buffer */
    bufferAnswer: (answer: Omit<BufferedAnswer, 'timestamp'>) => void;
    /** Manually flush the buffer */
    flushBuffer: () => Promise<void>;
    /** Current buffer size */
    bufferSize: number;
    /** Whether a flush is in progress */
    isFlushing: boolean;
    /** Total answers buffered this session */
    totalBuffered: number;
    /** Total flushes this session */
    totalFlushes: number;
}

export function useAnswerBuffer(
    options: UseAnswerBufferOptions = {}
): UseAnswerBufferReturn {
    const {
        maxBufferSize = 5,
        maxBufferTime = 30000, // 30 seconds
        debug = false
    } = options;

    // Buffer state
    const bufferRef = useRef<BufferedAnswer[]>([]);
    const [bufferSize, setBufferSize] = useState(0);
    const [isFlushing, setIsFlushing] = useState(false);
    const [totalBuffered, setTotalBuffered] = useState(0);
    const [totalFlushes, setTotalFlushes] = useState(0);

    // Timing refs
    const lastFlushTimeRef = useRef<number>(Date.now());
    const flushTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Service ref
    const sessionServiceRef = useRef<EnhancedGameSessionService | null>(null);

    // Initialize session service
    useEffect(() => {
        if (!sessionServiceRef.current) {
            sessionServiceRef.current = new EnhancedGameSessionService();
        }
    }, []);

    // Log helper
    const log = useCallback((message: string, data?: any) => {
        if (debug) {
            console.log(`📦 [AnswerBuffer] ${message}`, data || '');
        }
    }, [debug]);

    // Flush the buffer to the database
    const flushBuffer = useCallback(async () => {
        if (bufferRef.current.length === 0) {
            log('Skipping flush - buffer is empty');
            return;
        }

        if (isFlushing) {
            log('Skipping flush - already in progress');
            return;
        }

        const answers = [...bufferRef.current];
        bufferRef.current = [];
        setBufferSize(0);
        setIsFlushing(true);

        log(`Flushing ${answers.length} answers`, {
            types: answers.map(a => a.type),
            games: [...new Set(answers.map(a => a.gameType))]
        });

        try {
            const service = sessionServiceRef.current;
            if (!service) {
                console.error('❌ [AnswerBuffer] Session service not initialized');
                // Put answers back in buffer
                bufferRef.current = [...answers, ...bufferRef.current];
                setBufferSize(bufferRef.current.length);
                return;
            }

            // Process each answer
            const results = await Promise.allSettled(
                answers.map(async (answer) => {
                    if (answer.type === 'word') {
                        return service.recordWordAttempt(
                            answer.sessionId,
                            answer.gameType,
                            {
                                vocabularyId: answer.attempt.vocabularyId,
                                enhancedVocabularyItemId: answer.attempt.enhancedVocabularyItemId,
                                wordText: answer.attempt.wordText || '',
                                translationText: answer.attempt.translationText || '',
                                responseTimeMs: answer.attempt.responseTimeMs,
                                wasCorrect: answer.attempt.wasCorrect,
                                hintUsed: answer.attempt.hintUsed || false,
                                streakCount: answer.attempt.streakCount || 0,
                                masteryLevel: answer.attempt.masteryLevel,
                                maxGemRarity: answer.attempt.maxGemRarity,
                                gameMode: answer.attempt.gameMode,
                                difficultyLevel: answer.attempt.difficultyLevel,
                            },
                            answer.skipSpacedRepetition
                        );
                    } else {
                        return service.recordSentenceAttempt(
                            answer.sessionId,
                            answer.gameType,
                            {
                                sentenceId: answer.attempt.sentenceId,
                                sourceText: answer.attempt.sourceText || '',
                                targetText: answer.attempt.targetText || '',
                                responseTimeMs: answer.attempt.responseTimeMs,
                                wasCorrect: answer.attempt.wasCorrect,
                                hintUsed: answer.attempt.hintUsed || false,
                                streakCount: answer.attempt.streakCount || 0,
                                masteryLevel: answer.attempt.masteryLevel,
                                maxGemRarity: answer.attempt.maxGemRarity,
                                gameMode: answer.attempt.gameMode,
                                difficultyLevel: answer.attempt.difficultyLevel,
                                language: answer.attempt.language,
                                assignmentId: answer.attempt.assignmentId,
                                studentId: answer.attempt.studentId,
                            }
                        );
                    }
                })
            );

            // Log results
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;

            log(`Flush complete: ${successful} successful, ${failed} failed`);

            if (failed > 0) {
                console.warn('⚠️ [AnswerBuffer] Some answers failed to save:',
                    results.filter(r => r.status === 'rejected').map(r => (r as PromiseRejectedResult).reason)
                );
            }

            setTotalFlushes(prev => prev + 1);
            lastFlushTimeRef.current = Date.now();

        } catch (error) {
            console.error('❌ [AnswerBuffer] Error flushing buffer:', error);
            // Put answers back in buffer for retry
            bufferRef.current = [...answers, ...bufferRef.current];
            setBufferSize(bufferRef.current.length);
        } finally {
            setIsFlushing(false);
        }
    }, [isFlushing, log]);

    // Add an answer to the buffer
    const bufferAnswer = useCallback((answer: Omit<BufferedAnswer, 'timestamp'>) => {
        const bufferedAnswer: BufferedAnswer = {
            ...answer,
            timestamp: Date.now()
        };

        bufferRef.current.push(bufferedAnswer);
        const newSize = bufferRef.current.length;
        setBufferSize(newSize);
        setTotalBuffered(prev => prev + 1);

        log(`Answer buffered (${newSize}/${maxBufferSize})`, {
            type: answer.type,
            game: answer.gameType,
            correct: answer.attempt.wasCorrect
        });

        // Check if we should flush
        if (newSize >= maxBufferSize) {
            log('Buffer full - triggering flush');
            flushBuffer();
        }
    }, [maxBufferSize, flushBuffer, log]);

    // Set up timed flush
    useEffect(() => {
        // Clear any existing timer
        if (flushTimerRef.current) {
            clearInterval(flushTimerRef.current);
        }

        // Set up interval to check for time-based flush
        flushTimerRef.current = setInterval(() => {
            const timeSinceLastFlush = Date.now() - lastFlushTimeRef.current;

            if (bufferRef.current.length > 0 && timeSinceLastFlush >= maxBufferTime) {
                log(`Time-based flush triggered (${Math.round(timeSinceLastFlush / 1000)}s since last flush)`);
                flushBuffer();
            }
        }, 5000); // Check every 5 seconds

        return () => {
            if (flushTimerRef.current) {
                clearInterval(flushTimerRef.current);
            }
        };
    }, [maxBufferTime, flushBuffer, log]);

    // Handle visibility change - flush when tab is hidden
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && bufferRef.current.length > 0) {
                log('Tab hidden - flushing buffer');

                // Use sendBeacon for reliability on tab hide
                if (navigator.sendBeacon && bufferRef.current.length > 0) {
                    const data = JSON.stringify({
                        answers: bufferRef.current,
                        timestamp: Date.now()
                    });

                    // Try to send via beacon (fire and forget)
                    const beaconSent = navigator.sendBeacon('/api/games/buffer-flush', data);

                    if (beaconSent) {
                        log('Beacon sent successfully');
                        bufferRef.current = [];
                        setBufferSize(0);
                        lastFlushTimeRef.current = Date.now();
                    } else {
                        // Fall back to regular flush
                        flushBuffer();
                    }
                } else {
                    flushBuffer();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [flushBuffer, log]);

    // Flush on unmount
    useEffect(() => {
        return () => {
            if (bufferRef.current.length > 0) {
                log('Component unmounting - flushing buffer');
                // Note: This is a best-effort flush on unmount
                // The async nature means it may not complete
                flushBuffer();
            }
        };
    }, [flushBuffer, log]);

    return {
        bufferAnswer,
        flushBuffer,
        bufferSize,
        isFlushing,
        totalBuffered,
        totalFlushes
    };
}

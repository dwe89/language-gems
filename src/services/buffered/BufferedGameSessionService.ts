/**
 * Buffered Game Session Service
 * 
 * PURPOSE: Drop-in replacement for EnhancedGameSessionService that batches
 * answer submissions to reduce API costs by 80%+
 * 
 * USAGE:
 * - Replace: const sessionService = new EnhancedGameSessionService();
 * - With:    const sessionService = useBufferedGameSession(gameSessionId);
 * 
 * BATCHING STRATEGY:
 * - Buffers up to 5 answers locally
 * - Flushes every 30 seconds
 * - Flushes when tab is hidden (visibilitychange)
 * - Flushes on component unmount
 * 
 * The buffered calls are still recorded to the same database tables,
 * just in batches instead of individual API calls.
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EnhancedGameSessionService } from '../rewards/EnhancedGameSessionService';

// Types
interface BufferedAttempt {
    type: 'word' | 'sentence';
    sessionId: string;
    gameType: string;
    attempt: any;
    skipSpacedRepetition?: boolean;
    timestamp: number;
}

interface BufferStats {
    totalBuffered: number;
    totalFlushed: number;
    currentBufferSize: number;
    lastFlushTime: number | null;
}

// Configuration
const CONFIG = {
    MAX_BUFFER_SIZE: 5,        // Flush after 5 answers
    FLUSH_INTERVAL_MS: 30000,  // Auto-flush every 30 seconds
    MIN_FLUSH_INTERVAL_MS: 1000, // Don't flush more than once per second
};

/**
 * Buffered Game Session Service Class
 * Can be used in non-hook contexts (class components, callbacks)
 */
export class BufferedGameSessionService {
    private buffer: BufferedAttempt[] = [];
    private innerService: EnhancedGameSessionService;
    private lastFlushTime: number = 0;
    private flushTimer: NodeJS.Timeout | null = null;
    private stats: BufferStats = {
        totalBuffered: 0,
        totalFlushed: 0,
        currentBufferSize: 0,
        lastFlushTime: null,
    };
    private debug: boolean;

    constructor(innerService?: EnhancedGameSessionService, debug: boolean = false) {
        this.innerService = innerService || new EnhancedGameSessionService();
        this.debug = debug;
        this.setupAutoFlush();
        this.setupVisibilityHandler();
    }

    private log(message: string, data?: any) {
        if (this.debug) {
            console.log(`📦 [BufferedSession] ${message}`, data || '');
        }
    }

    private setupAutoFlush() {
        // Set up interval for time-based flushing
        this.flushTimer = setInterval(() => {
            if (this.buffer.length > 0) {
                this.log(`Auto-flush triggered (${this.buffer.length} items)`);
                this.flush();
            }
        }, CONFIG.FLUSH_INTERVAL_MS);
    }

    private setupVisibilityHandler() {
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
        }
    }

    private handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && this.buffer.length > 0) {
            this.log('Tab hidden - flushing buffer immediately');
            this.flushSync();
        }
    };

    /**
     * Buffer a word attempt instead of sending immediately
     */
    async recordWordAttempt(
        sessionId: string,
        gameType: string,
        attempt: any,
        skipSpacedRepetition: boolean = false
    ): Promise<any> {
        const bufferedAttempt: BufferedAttempt = {
            type: 'word',
            sessionId,
            gameType,
            attempt,
            skipSpacedRepetition,
            timestamp: Date.now(),
        };

        this.buffer.push(bufferedAttempt);
        this.stats.totalBuffered++;
        this.stats.currentBufferSize = this.buffer.length;

        this.log(`Word buffered (${this.buffer.length}/${CONFIG.MAX_BUFFER_SIZE})`, {
            word: attempt.wordText,
            correct: attempt.wasCorrect,
        });

        // Check if we should flush
        if (this.buffer.length >= CONFIG.MAX_BUFFER_SIZE) {
            this.log('Buffer full - triggering flush');
            await this.flush();
        }

        // Return a mock gem event for UI feedback (immediate response)
        // The actual gem will be recorded during flush
        if (attempt.wasCorrect) {
            return {
                rarity: 'common',
                xpValue: 2,
                vocabularyId: attempt.vocabularyId,
                wordText: attempt.wordText,
                translationText: attempt.translationText,
                buffered: true, // Flag to indicate this is a preview
            };
        }
        return null;
    }

    /**
     * Buffer a sentence attempt instead of sending immediately
     */
    async recordSentenceAttempt(
        sessionId: string,
        gameType: string,
        attempt: any
    ): Promise<any> {
        const bufferedAttempt: BufferedAttempt = {
            type: 'sentence',
            sessionId,
            gameType,
            attempt,
            timestamp: Date.now(),
        };

        this.buffer.push(bufferedAttempt);
        this.stats.totalBuffered++;
        this.stats.currentBufferSize = this.buffer.length;

        this.log(`Sentence buffered (${this.buffer.length}/${CONFIG.MAX_BUFFER_SIZE})`, {
            sentence: attempt.sourceText?.substring(0, 30),
            correct: attempt.wasCorrect,
        });

        // Check if we should flush
        if (this.buffer.length >= CONFIG.MAX_BUFFER_SIZE) {
            this.log('Buffer full - triggering flush');
            await this.flush();
        }

        // Return a mock gem event for UI feedback
        if (attempt.wasCorrect) {
            return {
                rarity: 'common',
                xpValue: 2,
                sentenceId: attempt.sentenceId,
                buffered: true,
            };
        }
        return null;
    }

    /**
     * Flush all buffered attempts to the database
     * 
     * CRITICAL: This uses a SINGLE API call for all buffered items
     * instead of firing N parallel requests (which was the bug)
     */
    async flush(): Promise<void> {
        if (this.buffer.length === 0) {
            return;
        }

        // Rate limiting
        const now = Date.now();
        if (now - this.lastFlushTime < CONFIG.MIN_FLUSH_INTERVAL_MS) {
            this.log('Skipping flush - too soon');
            return;
        }

        const itemsToFlush = [...this.buffer];
        this.buffer = [];
        this.stats.currentBufferSize = 0;

        this.log(`🚀 Flushing ${itemsToFlush.length} buffered items in ONE API call`);

        try {
            // FIXED: Send ALL items in ONE request, not N parallel requests
            const response = await fetch('/api/games/buffer-flush', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answers: itemsToFlush.map(item => ({
                        type: item.type,
                        sessionId: item.sessionId,
                        gameType: item.gameType,
                        attempt: item.attempt,
                        skipSpacedRepetition: item.skipSpacedRepetition,
                        timestamp: item.timestamp,
                    })),
                    timestamp: Date.now(),
                }),
            });

            if (!response.ok) {
                throw new Error(`Flush API returned ${response.status}`);
            }

            const result = await response.json();

            this.stats.totalFlushed += result.successful || itemsToFlush.length;
            this.stats.lastFlushTime = now;
            this.lastFlushTime = now;

            this.log(`✅ Flush complete: ${result.successful || itemsToFlush.length} items in ${result.durationMs || 0}ms`);

        } catch (error) {
            console.error('❌ [BufferedSession] Flush error:', error);
            // Put items back in buffer for retry
            this.buffer = [...itemsToFlush, ...this.buffer];
            this.stats.currentBufferSize = this.buffer.length;
        }
    }


    /**
     * Synchronous flush using sendBeacon (for page unload)
     */
    flushSync(): void {
        if (this.buffer.length === 0) return;

        try {
            const data = JSON.stringify({
                answers: this.buffer.map(item => ({
                    type: item.type,
                    sessionId: item.sessionId,
                    gameType: item.gameType,
                    attempt: item.attempt,
                    skipSpacedRepetition: item.skipSpacedRepetition,
                    timestamp: item.timestamp,
                })),
                timestamp: Date.now(),
            });

            const beaconSent = navigator.sendBeacon('/api/games/buffer-flush', data);

            if (beaconSent) {
                this.log(`Beacon sent with ${this.buffer.length} items`);
                this.buffer = [];
                this.stats.currentBufferSize = 0;
            } else {
                console.warn('⚠️ [BufferedSession] Beacon failed, data may be lost');
            }
        } catch (error) {
            console.error('❌ [BufferedSession] FlushSync error:', error);
        }
    }

    /**
     * Get current buffer statistics
     */
    getStats(): BufferStats {
        return { ...this.stats };
    }

    /**
     * Cleanup - call on component unmount
     */
    destroy(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }

        if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        }

        // Final flush
        if (this.buffer.length > 0) {
            this.flushSync();
        }
    }

    // Passthrough methods for non-buffered operations
    async startGameSession(sessionData: any): Promise<string> {
        return this.innerService.startGameSession(sessionData);
    }

    async endGameSession(sessionId: string, finalData: any): Promise<void> {
        // Flush before ending session
        await this.flush();
        return this.innerService.endGameSession(sessionId, finalData);
    }

    async getSessionStatistics(sessionId: string): Promise<any> {
        return this.innerService.getSessionStatistics(sessionId);
    }

    // Note: incrementSessionWordCounts is handled internally by recordWordAttempt
    // so we don't need to expose it here
}


/**
 * React Hook version for easy use in functional components
 */
export function useBufferedGameSession(debug: boolean = false) {
    const serviceRef = useRef<BufferedGameSessionService | null>(null);
    const [stats, setStats] = useState<BufferStats>({
        totalBuffered: 0,
        totalFlushed: 0,
        currentBufferSize: 0,
        lastFlushTime: null,
    });

    useEffect(() => {
        // Create service on mount
        serviceRef.current = new BufferedGameSessionService(undefined, debug);

        // Cleanup on unmount
        return () => {
            if (serviceRef.current) {
                serviceRef.current.destroy();
            }
        };
    }, [debug]);

    const recordWordAttempt = useCallback(async (
        sessionId: string,
        gameType: string,
        attempt: any,
        skipSpacedRepetition: boolean = false
    ) => {
        if (!serviceRef.current) return null;
        const result = await serviceRef.current.recordWordAttempt(
            sessionId,
            gameType,
            attempt,
            skipSpacedRepetition
        );
        setStats(serviceRef.current.getStats());
        return result;
    }, []);

    const recordSentenceAttempt = useCallback(async (
        sessionId: string,
        gameType: string,
        attempt: any
    ) => {
        if (!serviceRef.current) return null;
        const result = await serviceRef.current.recordSentenceAttempt(
            sessionId,
            gameType,
            attempt
        );
        setStats(serviceRef.current.getStats());
        return result;
    }, []);

    const flush = useCallback(async () => {
        if (!serviceRef.current) return;
        await serviceRef.current.flush();
        setStats(serviceRef.current.getStats());
    }, []);

    return {
        recordWordAttempt,
        recordSentenceAttempt,
        flush,
        stats,
        service: serviceRef.current,
    };
}

// Export a singleton for use across components
let globalBufferedService: BufferedGameSessionService | null = null;

export function getBufferedGameSessionService(debug: boolean = false): BufferedGameSessionService {
    if (!globalBufferedService) {
        globalBufferedService = new BufferedGameSessionService(undefined, debug);
    }
    return globalBufferedService;
}

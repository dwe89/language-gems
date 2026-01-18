/**
 * LocalProgressService - Save game progress locally
 * 
 * This service handles all local storage of game progress:
 * - Works offline (no network required)
 * - Generates guest IDs for anonymous users
 * - Prepares data for sync when user signs in
 */

// Guest session stored locally
export interface GuestProgress {
    guestId: string;           // UUID for this device/guest
    createdAt: string;         // When guest session started
    gamesPlayed: number;
    totalXP: number;
    wordsLearned: string[];    // Word IDs that were answered correctly
    streak: number;            // Current day streak
    lastPlayedAt?: string;     // ISO timestamp
    sessions: LocalGameSession[];
}

// Individual game session
export interface LocalGameSession {
    id: string;
    gameType: string;          // 'hangman', 'memory-match', etc.
    language: string;
    categoryId?: string;
    subcategoryId?: string;
    score: number;
    accuracy: number;
    wordsCorrect: number;
    wordsTotal: number;
    xpEarned: number;
    duration: number;          // Seconds
    completedAt: string;       // ISO timestamp
    synced: boolean;           // Has this been synced to cloud?
}

// Storage keys
const GUEST_PROGRESS_KEY = 'language_gems_guest_progress';
const SYNC_QUEUE_KEY = 'language_gems_sync_queue';

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique guest ID
 */
function generateGuestId(): string {
    return 'guest_' + uuidv4();
}

/**
 * Get or create guest progress
 */
export function getGuestProgress(): GuestProgress {
    if (typeof window === 'undefined') {
        return createEmptyProgress();
    }

    const stored = localStorage.getItem(GUEST_PROGRESS_KEY);

    if (stored) {
        try {
            return JSON.parse(stored);
        } catch {
            console.warn('[LocalProgressService] Corrupted progress data, resetting');
        }
    }

    // Create new guest progress
    const newProgress = createEmptyProgress();
    saveGuestProgress(newProgress);
    return newProgress;
}

/**
 * Create empty progress object
 */
function createEmptyProgress(): GuestProgress {
    return {
        guestId: generateGuestId(),
        createdAt: new Date().toISOString(),
        gamesPlayed: 0,
        totalXP: 0,
        wordsLearned: [],
        streak: 0,
        sessions: [],
    };
}

/**
 * Save guest progress to local storage
 */
export function saveGuestProgress(progress: GuestProgress): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
}

/**
 * Record a completed game session
 */
export function recordGameSession(session: Omit<LocalGameSession, 'id' | 'synced'>): LocalGameSession {
    const progress = getGuestProgress();

    const fullSession: LocalGameSession = {
        ...session,
        id: uuidv4(),
        synced: false,
    };

    // Update progress
    progress.gamesPlayed += 1;
    progress.totalXP += session.xpEarned;
    progress.lastPlayedAt = session.completedAt;
    progress.sessions.push(fullSession);

    // Update streak (simple version - check if played today)
    const today = new Date().toDateString();
    const lastPlayed = progress.lastPlayedAt ? new Date(progress.lastPlayedAt).toDateString() : null;

    if (lastPlayed !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastPlayed === yesterday.toDateString()) {
            progress.streak += 1;
        } else {
            progress.streak = 1;
        }
    }

    // Track words learned (unique)
    // This would need word IDs passed in - for now just count

    // Keep only last 100 sessions locally to prevent bloat
    if (progress.sessions.length > 100) {
        progress.sessions = progress.sessions.slice(-100);
    }

    saveGuestProgress(progress);

    console.log(`[LocalProgressService] Recorded session: ${session.gameType}, XP: ${session.xpEarned}`);

    return fullSession;
}

/**
 * Get stats summary for display
 */
export function getProgressStats(): {
    gamesPlayed: number;
    totalXP: number;
    streak: number;
    accuracy: number;
    level: number;
} {
    const progress = getGuestProgress();

    // Calculate average accuracy from sessions
    const accuracy = progress.sessions.length > 0
        ? Math.round(
            progress.sessions.reduce((sum, s) => sum + s.accuracy, 0) / progress.sessions.length
        )
        : 0;

    // Simple level calculation (100 XP per level)
    const level = Math.floor(progress.totalXP / 100) + 1;

    return {
        gamesPlayed: progress.gamesPlayed,
        totalXP: progress.totalXP,
        streak: progress.streak,
        accuracy,
        level,
    };
}

/**
 * Get recent game sessions
 */
export function getRecentSessions(count: number = 10): LocalGameSession[] {
    const progress = getGuestProgress();
    return progress.sessions.slice(-count).reverse();
}

/**
 * Get unsynced sessions (for cloud sync)
 */
export function getUnsyncedSessions(): LocalGameSession[] {
    const progress = getGuestProgress();
    return progress.sessions.filter(s => !s.synced);
}

/**
 * Mark sessions as synced
 */
export function markSessionsSynced(sessionIds: string[]): void {
    const progress = getGuestProgress();

    progress.sessions = progress.sessions.map(session =>
        sessionIds.includes(session.id)
            ? { ...session, synced: true }
            : session
    );

    saveGuestProgress(progress);
}

/**
 * Clear all local progress (for logout or reset)
 */
export function clearLocalProgress(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(GUEST_PROGRESS_KEY);
    localStorage.removeItem(SYNC_QUEUE_KEY);
}

/**
 * Migrate guest progress to authenticated user
 * Call this when a guest signs in
 */
export function getProgressForMigration(): GuestProgress | null {
    const progress = getGuestProgress();

    // Only migrate if there's actual progress
    if (progress.gamesPlayed === 0) {
        return null;
    }

    return progress;
}

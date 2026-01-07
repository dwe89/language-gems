/**
 * LearnerProgressService
 * 
 * Comprehensive service for tracking and managing independent learner progress.
 * Aggregates data from enhanced_game_sessions and maintains learner_progress records.
 * 
 * This powers the learner dashboard with real data similar to the teacher dashboard.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// XP thresholds for each level
const LEVEL_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    800,    // Level 5
    1200,   // Level 6
    1700,   // Level 7
    2300,   // Level 8
    3000,   // Level 9
    4000,   // Level 10
    5200,   // Level 11
    6600,   // Level 12
    8200,   // Level 13
    10000,  // Level 14
    12000,  // Level 15
    14500,  // Level 16
    17500,  // Level 17
    21000,  // Level 18
    25000,  // Level 19
    30000,  // Level 20
];

// Base XP rewards for different activities
const XP_REWARDS = {
    GAME_COMPLETION: 25,      // Complete any game
    WORD_CORRECT: 5,          // Each correct word
    PERFECT_ACCURACY: 50,     // 100% accuracy bonus
    GREAT_ACCURACY: 25,       // 90%+ accuracy bonus
    STREAK_BONUS: 10,         // Per day streak maintained
    DAILY_LOGIN: 10,          // Just for logging in each day
    FIRST_GAME_OF_DAY: 15,    // Bonus for first game each day
    TIME_BONUS_PER_MINUTE: 2, // XP per minute of study time
};

export interface LearnerStats {
    level: number;
    xp: number;
    xpToNextLevel: number;
    xpProgress: number; // 0-100 percentage
    streak: number;
    longestStreak: number;
    wordsLearned: number;
    gamesPlayed: number;
    accuracy: number;
    totalTimeMinutes: number;
    lastActivityDate: string | null;
}

export interface RecentActivity {
    id: string;
    gameType: string;
    score: number;
    accuracy: number;
    wordsCorrect: number;
    duration: number;
    xpEarned: number;
    createdAt: string;
    category?: string;
}

export interface LearnerAchievement {
    id: string;
    key: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
}

export interface DailyChallenge {
    id: string;
    type: 'games' | 'words' | 'time' | 'accuracy';
    title: string;
    description: string;
    target: number;
    current: number;
    xpReward: number;
    completed: boolean;
}

class LearnerProgressService {
    private supabase;

    constructor() {
        this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    }

    /**
     * Calculate level from total XP
     */
    calculateLevel(totalXp: number): { level: number; xpToNextLevel: number; xpProgress: number } {
        let level = 1;
        for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (totalXp >= LEVEL_THRESHOLDS[i]) {
                level = i + 1;
                break;
            }
        }

        const currentLevelThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
        const nextLevelThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 5000;
        const xpInCurrentLevel = totalXp - currentLevelThreshold;
        const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
        const xpProgress = Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);

        return {
            level,
            xpToNextLevel: nextLevelThreshold - totalXp,
            xpProgress
        };
    }

    /**
     * Get comprehensive stats for a learner
     */
    async getLearnerStats(userId: string): Promise<LearnerStats> {
        try {
            // First, try to get the existing learner_progress record
            const { data: progress, error: progressError } = await this.supabase
                .from('learner_progress')
                .select('*')
                .eq('user_id', userId)
                .single();

            // Get aggregated data from enhanced_game_sessions
            const { data: sessions, error: sessionsError } = await this.supabase
                .from('enhanced_game_sessions')
                .select('*')
                .eq('student_id', userId)
                .order('created_at', { ascending: false });

            if (sessionsError && sessionsError.code !== 'PGRST116') {
                console.error('Error fetching game sessions:', sessionsError);
            }

            // Calculate stats from sessions
            const totalGames = sessions?.length || 0;
            const totalXp = sessions?.reduce((sum, s) => sum + (s.xp_earned || 0) + (s.bonus_xp || 0), 0) || 0;
            const totalWordsCorrect = sessions?.reduce((sum, s) => sum + (s.words_correct || 0), 0) || 0;
            const totalWordsAttempted = sessions?.reduce((sum, s) => sum + (s.words_attempted || 0), 0) || 0;
            const totalDuration = sessions?.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) || 0;
            const avgAccuracy = totalWordsAttempted > 0 ? (totalWordsCorrect / totalWordsAttempted) * 100 : 0;

            // Calculate streak
            const { streak, longestStreak } = this.calculateStreak(sessions || []);

            // Get last activity date
            const lastActivityDate = sessions && sessions.length > 0
                ? sessions[0].created_at
                : null;

            // Calculate level info
            const levelInfo = this.calculateLevel(totalXp);

            // Update learner_progress record with aggregated data
            if (progress) {
                await this.supabase
                    .from('learner_progress')
                    .update({
                        total_xp: totalXp,
                        current_level: levelInfo.level,
                        current_streak: streak,
                        longest_streak: Math.max(longestStreak, progress.longest_streak || 0),
                        words_learned: totalWordsCorrect,
                        games_played: totalGames,
                        total_study_time: Math.round(totalDuration / 60),
                        last_activity_date: lastActivityDate ? new Date(lastActivityDate).toISOString().split('T')[0] : null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId);
            } else {
                // Create initial record
                await this.supabase
                    .from('learner_progress')
                    .insert({
                        user_id: userId,
                        total_xp: totalXp,
                        current_level: levelInfo.level,
                        current_streak: streak,
                        longest_streak: longestStreak,
                        words_learned: totalWordsCorrect,
                        games_played: totalGames,
                        total_study_time: Math.round(totalDuration / 60),
                        last_activity_date: lastActivityDate ? new Date(lastActivityDate).toISOString().split('T')[0] : null
                    });
            }

            return {
                level: levelInfo.level,
                xp: totalXp,
                xpToNextLevel: levelInfo.xpToNextLevel,
                xpProgress: levelInfo.xpProgress,
                streak,
                longestStreak: Math.max(longestStreak, progress?.longest_streak || 0),
                wordsLearned: totalWordsCorrect,
                gamesPlayed: totalGames,
                accuracy: Math.round(avgAccuracy),
                totalTimeMinutes: Math.round(totalDuration / 60),
                lastActivityDate
            };
        } catch (error) {
            console.error('Error getting learner stats:', error);
            return {
                level: 1,
                xp: 0,
                xpToNextLevel: 100,
                xpProgress: 0,
                streak: 0,
                longestStreak: 0,
                wordsLearned: 0,
                gamesPlayed: 0,
                accuracy: 0,
                totalTimeMinutes: 0,
                lastActivityDate: null
            };
        }
    }

    /**
     * Calculate streak from game sessions
     */
    private calculateStreak(sessions: any[]): { streak: number; longestStreak: number } {
        if (!sessions || sessions.length === 0) {
            return { streak: 0, longestStreak: 0 };
        }

        // Get unique dates with activity
        const uniqueDates = new Set<string>();
        sessions.forEach(session => {
            const date = new Date(session.created_at).toISOString().split('T')[0];
            uniqueDates.add(date);
        });

        const sortedDates = Array.from(uniqueDates).sort().reverse();

        // Check current streak
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Current streak must include today or yesterday to be active
        if (sortedDates[0] === today || sortedDates[0] === yesterday) {
            let checkDate = new Date(sortedDates[0]);

            for (const dateStr of sortedDates) {
                const sessionDate = new Date(dateStr);
                const diffDays = Math.floor((checkDate.getTime() - sessionDate.getTime()) / 86400000);

                if (diffDays <= 1) {
                    currentStreak++;
                    checkDate = sessionDate;
                } else {
                    break;
                }
            }
        }

        // Calculate longest streak
        let lastDate: Date | null = null;
        for (const dateStr of sortedDates.slice().reverse()) {
            const sessionDate = new Date(dateStr);

            if (lastDate === null) {
                tempStreak = 1;
            } else {
                const diffDays = Math.floor((sessionDate.getTime() - lastDate.getTime()) / 86400000);
                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
            lastDate = sessionDate;
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        return { streak: currentStreak, longestStreak };
    }

    /**
     * Get recent activity for a learner
     */
    async getRecentActivity(userId: string, limit: number = 10): Promise<RecentActivity[]> {
        try {
            const { data: sessions, error } = await this.supabase
                .from('enhanced_game_sessions')
                .select('id, game_type, final_score, accuracy_percentage, words_correct, duration_seconds, xp_earned, created_at, category')
                .eq('student_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Error fetching recent activity:', error);
                return [];
            }

            return (sessions || []).map(s => ({
                id: s.id,
                gameType: s.game_type,
                score: s.final_score || 0,
                accuracy: parseFloat(s.accuracy_percentage) || 0,
                wordsCorrect: s.words_correct || 0,
                duration: s.duration_seconds || 0,
                xpEarned: s.xp_earned || 0,
                createdAt: s.created_at,
                category: s.category
            }));
        } catch (error) {
            console.error('Error getting recent activity:', error);
            return [];
        }
    }

    /**
     * Get daily challenges for a learner
     */
    async getDailyChallenges(userId: string): Promise<DailyChallenge[]> {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Get today's sessions
            const { data: todaySessions, error } = await this.supabase
                .from('enhanced_game_sessions')
                .select('*')
                .eq('student_id', userId)
                .gte('created_at', `${today}T00:00:00`)
                .lt('created_at', `${today}T23:59:59`);

            if (error) {
                console.error('Error fetching today sessions:', error);
            }

            const sessions = todaySessions || [];
            const gamesPlayed = sessions.length;
            const wordsCorrect = sessions.reduce((sum, s) => sum + (s.words_correct || 0), 0);
            const totalMinutes = Math.round(sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / 60);
            const avgAccuracy = sessions.length > 0
                ? sessions.reduce((sum, s) => sum + (parseFloat(s.accuracy_percentage) || 0), 0) / sessions.length
                : 0;

            // Generate daily challenges
            const challenges: DailyChallenge[] = [
                {
                    id: 'daily-games',
                    type: 'games',
                    title: 'Play 3 Games',
                    description: 'Complete any 3 games today',
                    target: 3,
                    current: Math.min(gamesPlayed, 3),
                    xpReward: 50,
                    completed: gamesPlayed >= 3
                },
                {
                    id: 'daily-words',
                    type: 'words',
                    title: 'Learn 20 Words',
                    description: 'Get 20 words correct across all games',
                    target: 20,
                    current: Math.min(wordsCorrect, 20),
                    xpReward: 75,
                    completed: wordsCorrect >= 20
                },
                {
                    id: 'daily-time',
                    type: 'time',
                    title: 'Study for 15 Minutes',
                    description: 'Spend 15 minutes learning today',
                    target: 15,
                    current: Math.min(totalMinutes, 15),
                    xpReward: 40,
                    completed: totalMinutes >= 15
                },
                {
                    id: 'daily-accuracy',
                    type: 'accuracy',
                    title: 'Achieve 80% Accuracy',
                    description: 'Maintain 80% accuracy across your games',
                    target: 80,
                    current: Math.round(avgAccuracy),
                    xpReward: 60,
                    completed: avgAccuracy >= 80 && gamesPlayed > 0
                }
            ];

            return challenges;
        } catch (error) {
            console.error('Error getting daily challenges:', error);
            return [];
        }
    }

    /**
     * Get achievements earned by a learner
     */
    async getAchievements(userId: string): Promise<LearnerAchievement[]> {
        try {
            const { data: achievements, error } = await this.supabase
                .from('achievements')
                .select('id, achievement_key, achieved_at, achievement_data')
                .eq('user_id', userId)
                .order('achieved_at', { ascending: false });

            if (error) {
                console.error('Error fetching achievements:', error);
                return [];
            }

            // Map achievement keys to display info
            const achievementInfo: Record<string, { name: string; description: string; icon: string }> = {
                'first_game': { name: 'First Steps', description: 'Complete your first game', icon: '🎮' },
                'perfect_score': { name: 'Perfectionist', description: 'Achieve 100% accuracy in a game', icon: '⭐' },
                '10_games': { name: 'Dedicated Learner', description: 'Complete 10 games', icon: '🏆' },
                '50_games': { name: 'Language Pro', description: 'Complete 50 games', icon: '🎖️' },
                '100_words': { name: 'Vocabulary Builder', description: 'Learn 100 words', icon: '📚' },
                '500_words': { name: 'Word Master', description: 'Learn 500 words', icon: '📖' },
                '7_day_streak': { name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥' },
                '30_day_streak': { name: 'Month Champion', description: 'Maintain a 30-day streak', icon: '💪' },
                'level_5': { name: 'Rising Star', description: 'Reach level 5', icon: '⬆️' },
                'level_10': { name: 'Language Expert', description: 'Reach level 10', icon: '🌟' },
            };

            return (achievements || []).map(a => ({
                id: a.id,
                key: a.achievement_key,
                name: achievementInfo[a.achievement_key]?.name || a.achievement_key,
                description: achievementInfo[a.achievement_key]?.description || '',
                icon: achievementInfo[a.achievement_key]?.icon || '🏅',
                earnedAt: a.achieved_at
            }));
        } catch (error) {
            console.error('Error getting achievements:', error);
            return [];
        }
    }

    /**
     * Award XP to a learner after completing a game
     * Called by games when they complete
     */
    async awardGameXP(userId: string, sessionData: {
        score: number;
        accuracy: number;
        wordsCorrect: number;
        durationSeconds: number;
        isFirstGameToday?: boolean;
    }): Promise<{ xpEarned: number; bonusXp: number; newLevel: number; leveledUp: boolean }> {
        try {
            // Calculate XP
            let xpEarned = XP_REWARDS.GAME_COMPLETION;
            let bonusXp = 0;

            // Words correct bonus
            xpEarned += sessionData.wordsCorrect * XP_REWARDS.WORD_CORRECT;

            // Accuracy bonus
            if (sessionData.accuracy >= 100) {
                bonusXp += XP_REWARDS.PERFECT_ACCURACY;
            } else if (sessionData.accuracy >= 90) {
                bonusXp += XP_REWARDS.GREAT_ACCURACY;
            }

            // Time bonus (cap at 30 minutes)
            const studyMinutes = Math.min(30, Math.floor(sessionData.durationSeconds / 60));
            bonusXp += studyMinutes * XP_REWARDS.TIME_BONUS_PER_MINUTE;

            // First game of day bonus
            if (sessionData.isFirstGameToday) {
                bonusXp += XP_REWARDS.FIRST_GAME_OF_DAY;
            }

            // Get current progress
            const { data: progress } = await this.supabase
                .from('learner_progress')
                .select('total_xp, current_level')
                .eq('user_id', userId)
                .single();

            const currentXp = progress?.total_xp || 0;
            const currentLevel = progress?.current_level || 1;
            const newTotalXp = currentXp + xpEarned + bonusXp;
            const newLevelInfo = this.calculateLevel(newTotalXp);
            const leveledUp = newLevelInfo.level > currentLevel;

            // Update progress
            await this.supabase
                .from('learner_progress')
                .upsert({
                    user_id: userId,
                    total_xp: newTotalXp,
                    current_level: newLevelInfo.level,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });

            return {
                xpEarned,
                bonusXp,
                newLevel: newLevelInfo.level,
                leveledUp
            };
        } catch (error) {
            console.error('Error awarding XP:', error);
            return { xpEarned: 0, bonusXp: 0, newLevel: 1, leveledUp: false };
        }
    }

    /**
     * Get stats by language for a learner
     */
    async getStatsByLanguage(userId: string): Promise<Record<string, { gamesPlayed: number; wordsLearned: number; avgAccuracy: number }>> {
        try {
            const { data: sessions, error } = await this.supabase
                .from('enhanced_game_sessions')
                .select('category, words_correct, words_attempted, accuracy_percentage')
                .eq('student_id', userId);

            if (error) {
                console.error('Error fetching sessions by language:', error);
                return {};
            }

            const stats: Record<string, { gamesPlayed: number; wordsLearned: number; totalAccuracy: number }> = {};

            (sessions || []).forEach(session => {
                const language = session.category?.toLowerCase() || 'other';
                if (!stats[language]) {
                    stats[language] = { gamesPlayed: 0, wordsLearned: 0, totalAccuracy: 0 };
                }
                stats[language].gamesPlayed++;
                stats[language].wordsLearned += session.words_correct || 0;
                stats[language].totalAccuracy += parseFloat(session.accuracy_percentage) || 0;
            });

            // Calculate averages
            const result: Record<string, { gamesPlayed: number; wordsLearned: number; avgAccuracy: number }> = {};
            Object.entries(stats).forEach(([lang, data]) => {
                result[lang] = {
                    gamesPlayed: data.gamesPlayed,
                    wordsLearned: data.wordsLearned,
                    avgAccuracy: Math.round(data.totalAccuracy / data.gamesPlayed)
                };
            });

            return result;
        } catch (error) {
            console.error('Error getting stats by language:', error);
            return {};
        }
    }
}

// Export singleton instance
export const learnerProgressService = new LearnerProgressService();
export default learnerProgressService;

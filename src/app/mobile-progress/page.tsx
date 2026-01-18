'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Target,
    BookOpen,
    Gamepad2,
    Clock,
    Flame,
    BarChart3,
    Trophy,
    ChevronRight,
    Zap,
    LogIn,
    Sparkles
} from 'lucide-react';
import { useAuth, supabaseBrowser } from '../../components/auth/AuthProvider';
import Link from 'next/link';
import { MobilePageWrapper, PullToRefresh } from '../../components/capacitor';
import { GemsAnalyticsService } from '../../services/analytics/GemsAnalyticsService';

// Types
interface LearnerStats {
    level: number;
    xp: number;
    xpToNextLevel: number;
    xpProgress: number;
    streak: number;
    longestStreak: number;
    wordsLearned: number;
    gamesPlayed: number;
    accuracy: number;
    totalTimeMinutes: number;
    lastActivityDate: string | null;
}

interface RecentActivity {
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

const GAME_DISPLAY_NAMES: Record<string, string> = {
    'vocab-master': 'VocabMaster',
    'memory-match': 'Memory Match',
    'hangman': 'Hangman',
    'conjugation-duel': 'Conjugation Duel',
    'word-scramble': 'Word Scramble',
    'sentence-builder': 'Sentence Builder',
    'speed-builder': 'Speed Builder',
    'word-guesser': 'Word Guesser',
    'vocab-blast': 'Vocab Blast',
    'tic-tac-toe': 'Tic Tac Toe',
    'sentence-towers': 'Sentence Towers',
    'word-towers': 'Word Towers'
};

export default function MobileProgressPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<LearnerStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [weeklyData, setWeeklyData] = useState<{ date: string; xp: number; games: number }[]>([]);

    const isGuest = !user;

    useEffect(() => {
        if (user) {
            fetchProgressData();
        } else {
            // Fetch guest local progress
            import('../../lib/mobile').then(({ getProgressStats, getRecentSessions }) => {
                const guestStats = getProgressStats();
                const guestSessions = getRecentSessions(50); // get more to populate weekly graph

                // Map to LearnerStats
                setStats({
                    level: guestStats.level,
                    xp: guestStats.totalXP,
                    xpToNextLevel: 100 - (guestStats.totalXP % 100),
                    xpProgress: guestStats.totalXP % 100,
                    streak: guestStats.streak,
                    longestStreak: guestStats.streak,
                    wordsLearned: 0,
                    gamesPlayed: guestStats.gamesPlayed,
                    accuracy: guestStats.accuracy,
                    totalTimeMinutes: 0,
                    lastActivityDate: new Date().toISOString()
                });

                // Map to RecentActivity
                const activity = guestSessions.map(s => ({
                    id: s.id,
                    gameType: s.gameType,
                    score: s.score,
                    accuracy: s.accuracy,
                    wordsCorrect: s.wordsCorrect,
                    duration: s.duration,
                    xpEarned: s.xpEarned,
                    createdAt: s.completedAt,
                    category: s.categoryId
                }));

                setRecentActivity(activity);
                generateWeeklyData(activity);
                setLoading(false);
            });
        }
    }, [user]);

    const fetchProgressData = async () => {
        if (!user) return;

        try {
            setLoading(true);

            // Fetch directly from enhanced_game_sessions for accurate data
            const { data: sessions, error: sessionsError } = await supabaseBrowser
                .from('enhanced_game_sessions')
                .select('*')
                .eq('student_id', user.id)
                .order('created_at', { ascending: false })
                .order('created_at', { ascending: false });

            if (sessionsError) {
                console.error('Error fetching sessions:', sessionsError);
            }

            if (sessions && sessions.length > 0) {
                // Calculate stats from sessions
                const totalXp = sessions.reduce((sum, s) => sum + (s.xp_earned || 0) + (s.bonus_xp || 0), 0);
                const totalCorrect = sessions.reduce((sum, s) => sum + (s.words_correct || 0), 0);
                const totalAttempted = sessions.reduce((sum, s) => sum + (s.words_attempted || 0), 0);
                let accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

                // Fallback to accuracy_percentage if no words data
                if (accuracy === 0 && sessions.length > 0) {
                    const accPercentages = sessions.map(s => parseFloat(s.accuracy_percentage) || 0).filter(a => a > 0);
                    if (accPercentages.length > 0) {
                        accuracy = Math.round(accPercentages.reduce((a, b) => a + b, 0) / accPercentages.length);
                    }
                }

                // Calculate words learned (unique words attempted)
                const wordsLearned = totalCorrect;

                // Calculate total time (sum all durations)
                const totalTimeMs = sessions.reduce((sum, s) => sum + ((s.duration_seconds || s.time_elapsed || 0) * 1000), 0);
                const totalTimeMinutes = Math.round(totalTimeMs / 60000);

                // Calculate streak from session dates
                const uniqueDates = new Set<string>();
                sessions.forEach(s => {
                    uniqueDates.add(new Date(s.created_at).toISOString().split('T')[0]);
                });
                const sortedDates = Array.from(uniqueDates).sort().reverse();
                let streak = 0;
                let longestStreak = 0;
                const today = new Date().toISOString().split('T')[0];
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                if (sortedDates.length > 0 && (sortedDates[0] === today || sortedDates[0] === yesterday)) {
                    let checkDate = new Date(sortedDates[0]);
                    for (const dateStr of sortedDates) {
                        const sessionDate = new Date(dateStr);
                        const diffDays = Math.floor((checkDate.getTime() - sessionDate.getTime()) / 86400000);
                        if (diffDays <= 1) {
                            streak++;
                            checkDate = sessionDate;
                        } else break;
                    }
                    longestStreak = Math.max(streak, longestStreak);
                }

                // Fetch authoritative stats from GemsAnalyticsService
                let authoritativeLevel = 1;
                let authoritativeXP = totalXp;
                let authoritativeXPToNext = 1000 - (totalXp % 1000);
                let authoritativeProgress = (totalXp % 1000) / 10; // Percentage of 1000

                try {
                    const gemsService = new GemsAnalyticsService(supabaseBrowser);
                    const gemsData = await gemsService.getStudentGemsAnalytics(user.id);
                    if (gemsData) {
                        authoritativeXP = gemsData.totalXP;
                        authoritativeLevel = gemsData.currentLevel;
                        authoritativeXPToNext = gemsData.xpToNextLevel;
                        authoritativeProgress = (gemsData.totalXP % 1000) / 10; // (XP % 1000) / 1000 * 100
                    }
                } catch (e) {
                    console.error('Failed to fetch authoritative gems data', e);
                }

                setStats({
                    level: authoritativeLevel,
                    xp: authoritativeXP,
                    xpToNextLevel: authoritativeXPToNext,
                    xpProgress: authoritativeProgress,
                    streak,
                    longestStreak,
                    wordsLearned,
                    gamesPlayed: sessions.length,
                    accuracy,
                    totalTimeMinutes,
                    lastActivityDate: sessions[0]?.created_at || null
                });

                // Map to RecentActivity format
                const activity: RecentActivity[] = sessions.slice(0, 20).map(s => ({
                    id: s.id,
                    gameType: s.game_type || 'unknown',
                    score: s.final_score || 0,
                    accuracy: Math.min(100, parseFloat(s.accuracy_percentage) || 0),
                    wordsCorrect: s.words_correct || 0,
                    duration: (s.duration_seconds || s.time_elapsed || 0) * 1000,
                    xpEarned: (s.xp_earned || 0) + (s.bonus_xp || 0),
                    createdAt: s.created_at,
                    category: s.category_id
                }));

                setRecentActivity(activity);
                generateWeeklyData(activity);
            } else {
                // No sessions found - set empty state
                setStats({
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
                });
                setRecentActivity([]);
                generateEmptyWeeklyData();
            }
        } catch (error) {
            console.error('Error fetching progress data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (user) {
            await fetchProgressData();
        }
    };

    const generateWeeklyData = (activity: RecentActivity[]) => {
        const weekData: { date: string; xp: number; games: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const dayActivities = activity.filter(a =>
                a.createdAt.startsWith(dateStr)
            );

            const dayXP = dayActivities.reduce((sum, a) => sum + (a.xpEarned || 0), 0);
            const dayGames = dayActivities.length;

            weekData.push({ date: dayName, xp: dayXP, games: dayGames });
        }

        setWeeklyData(weekData);
    };

    const generateEmptyWeeklyData = () => {
        const weekData: { date: string; xp: number; games: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            weekData.push({ date: dayName, xp: 0, games: 0 });
        }
        setWeeklyData(weekData);
    };

    const formatTimeAgo = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} days ago`;
    };

    const maxWeeklyXP = Math.max(...weeklyData.map(d => d.xp), 1);

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true}>
            <PullToRefresh onRefresh={handleRefresh}>
                <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0f0f1a]">
                    {/* Ambient background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-40 -left-20 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-20 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 px-5 pt-4 pb-32">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <h1 className="text-2xl font-bold text-white">Progress</h1>
                            <p className="text-white/50 text-sm">Track your learning journey</p>
                        </motion.div>

                        {/* Guest State */}
                        {isGuest ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {/* Sign in prompt */}
                                <div className="bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-3xl p-6 border border-purple-500/20 backdrop-blur-sm mb-6">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 border-2 border-white/10 flex items-center justify-center mb-4">
                                            <Trophy className="w-8 h-8 text-purple-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-white mb-2">Track Your Progress</h2>
                                        <p className="text-white/60 text-sm mb-4">
                                            Sign in to save your scores and track improvement over time
                                        </p>
                                        <motion.button
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => router.push('/auth/login')}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/30"
                                        >
                                            <LogIn className="w-5 h-5" />
                                            Sign In
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Preview stats (greyed out) */}
                                <div className="opacity-40">
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {[
                                            { icon: Flame, label: 'Streak', value: '-', color: 'text-orange-400' },
                                            { icon: BookOpen, label: 'Words', value: '-', color: 'text-green-400' },
                                            { icon: Target, label: 'Accuracy', value: '-', color: 'text-pink-400' },
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                                                <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2 opacity-50`} />
                                                <p className="text-xl font-bold text-white/30">{stat.value}</p>
                                                <p className="text-white/20 text-xs">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Empty chart preview */}
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <h3 className="font-bold text-white/40 flex items-center mb-4">
                                            <BarChart3 className="w-5 h-5 mr-2" />
                                            Weekly Activity
                                        </h3>
                                        <div className="flex items-end justify-between h-20 px-2">
                                            {weeklyData.map((day, index) => (
                                                <div key={index} className="flex flex-col items-center flex-1">
                                                    <div className="w-5 h-2 bg-white/10 rounded-t-md" />
                                                    <p className="text-xs text-white/20 mt-2">{day.date}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Call to action */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-6"
                                >
                                    <div
                                        onClick={() => router.push('/activities')}
                                        className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 backdrop-blur-sm cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                                <Gamepad2 className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-white">Start Playing!</p>
                                                <p className="text-xs text-white/50">You can still play games without signing in</p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-emerald-400" />
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) : (
                            /* Authenticated User Progress */
                            <>
                                {/* Level & XP Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 rounded-3xl p-6 mb-6 relative overflow-hidden shadow-2xl shadow-purple-500/20"
                                >
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl -ml-8 -mb-8" />

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                                    <Trophy className="w-7 h-7 text-yellow-300" />
                                                </div>
                                                <div>
                                                    <p className="text-white/70 text-xs uppercase tracking-wider">Level</p>
                                                    <p className="text-3xl font-bold text-white">{stats?.level || 1}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white/70 text-xs uppercase tracking-wider">Total XP</p>
                                                <p className="text-2xl font-bold text-white">{stats?.xp?.toLocaleString() || 0}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white/70">Next Level</span>
                                                <span className="font-medium text-white">{stats?.xpProgress?.toFixed(0) || 0}%</span>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-2.5">
                                                <div
                                                    className="bg-white h-2.5 rounded-full transition-all duration-500"
                                                    style={{ width: `${stats?.xpProgress || 0}%` }}
                                                />
                                            </div>
                                            <p className="text-white/50 text-xs">{stats?.xpToNextLevel || 100} XP to level {(stats?.level || 1) + 1}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {[
                                        { icon: Flame, label: 'Streak', value: stats?.streak || 0, color: 'text-orange-400', bg: 'bg-orange-500/20' },
                                        { icon: BookOpen, label: 'Words', value: stats?.wordsLearned || 0, color: 'text-green-400', bg: 'bg-green-500/20' },
                                        { icon: Target, label: 'Accuracy', value: `${stats?.accuracy || 0}%`, color: 'text-pink-400', bg: 'bg-pink-500/20' },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05 }}
                                            className={`${stat.bg} backdrop-blur-sm rounded-2xl p-3 text-center border border-white/5`}
                                        >
                                            <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
                                            <p className="text-lg font-bold text-white">{stat.value}</p>
                                            <p className="text-white/40 text-[10px] uppercase">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Secondary Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-3 border border-white/5"
                                    >
                                        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                                            <Gamepad2 className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-white">{stats?.gamesPlayed || 0}</p>
                                            <p className="text-white/40 text-xs">Games Played</p>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-3 border border-white/5"
                                    >
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-white">{stats?.totalTimeMinutes || 0}m</p>
                                            <p className="text-white/40 text-xs">Study Time</p>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Weekly Activity Chart */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/5"
                                >
                                    <h3 className="font-bold text-white flex items-center mb-4">
                                        <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                                        Weekly Activity
                                    </h3>

                                    <div className="flex items-end justify-between h-24 px-1">
                                        {weeklyData.map((day, index) => (
                                            <div key={index} className="flex flex-col items-center flex-1">
                                                <div
                                                    className="w-6 bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-md transition-all duration-300"
                                                    style={{
                                                        height: `${Math.max((day.xp / maxWeeklyXP) * 100, 8)}%`,
                                                        minHeight: day.xp > 0 ? '8px' : '4px',
                                                        opacity: day.xp > 0 ? 1 : 0.2
                                                    }}
                                                />
                                                <p className="text-[10px] text-white/40 mt-2">{day.date}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Recent Activity */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-white">Recent Games</h3>
                                        <Link
                                            href="/learner-dashboard/progress"
                                            className="text-purple-400 text-xs font-medium flex items-center hover:text-purple-300"
                                        >
                                            View All <ChevronRight className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>

                                    {recentActivity.length > 0 ? (
                                        <div className="space-y-3">
                                            {recentActivity.slice(0, 5).map((activity) => (
                                                <div
                                                    key={activity.id}
                                                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-3 border border-white/5"
                                                >
                                                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                                        <Gamepad2 className="w-5 h-5 text-purple-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-white truncate">
                                                            {GAME_DISPLAY_NAMES[activity.gameType] || activity.gameType}
                                                        </p>
                                                        <div className="flex items-center space-x-2 text-xs text-white/50">
                                                            <span className={`font-medium ${activity.accuracy >= 90 ? 'text-green-400' :
                                                                activity.accuracy >= 70 ? 'text-yellow-400' : 'text-red-400'
                                                                }`}>
                                                                {Math.round(activity.accuracy)}%
                                                            </span>
                                                            <span>·</span>
                                                            <span>{activity.wordsCorrect} correct</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-purple-400 font-bold text-sm">+{activity.xpEarned}</p>
                                                        <p className="text-white/30 text-[10px]">{formatTimeAgo(activity.createdAt)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/5">
                                            <Sparkles className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                            <p className="text-white/50 mb-3">No games played yet</p>
                                            <Link
                                                href="/activities"
                                                className="inline-flex items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium text-white text-sm transition-colors"
                                            >
                                                <Zap className="w-4 h-4 mr-2" />
                                                Start Playing
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
            </PullToRefresh>
        </MobilePageWrapper>
    );
}

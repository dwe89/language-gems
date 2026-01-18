'use client';

import { useAuth, supabaseBrowser } from '../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import {
    Gamepad2, Trophy, ArrowRight, Star, Flame, Target,
    Sparkles, Zap, BookOpen, Globe2, User, LogIn, ClipboardList, Gem
} from 'lucide-react';
import { GemsAnalyticsService } from '../../services/analytics/GemsAnalyticsService';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobilePageWrapper, PullToRefresh } from '../../components/capacitor';

// Game categories for the home screen
const gameCategories = [
    {
        id: 'vocab',
        title: 'Vocabulary',
        subtitle: 'Master new words',
        icon: BookOpen,
        gradient: 'from-purple-600 via-violet-600 to-indigo-700',
        href: '/mobile-games', // Updated to mobile route
        featured: true,
    },
    {
        id: 'assessments',
        title: 'Assessments',
        subtitle: 'Tests & Quizzes',
        icon: ClipboardList,
        gradient: 'from-pink-500 via-rose-500 to-red-600',
        href: '/mobile-assignments',
    },
    {
        id: 'vocab-master',
        title: 'Vocab Master',
        subtitle: 'Challenge mode',
        icon: Trophy,
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        href: '/mobile-games', // Placeholder until mobile VM is ready
    },
    {
        id: 'grammar',
        title: 'Grammar',
        subtitle: 'Learn the rules',
        icon: Globe2,
        gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
        href: '/mobile-grammar',
    },
];

// Languages supported
const languages = [
    { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { code: 'french', name: 'French', flag: '🇫🇷' },
    { code: 'german', name: 'German', flag: '🇩🇪' },
];

export default function MobileHomePage() {
    const { user, isTeacher, isLoading } = useAuth();
    const router = useRouter();
    const [greeting, setGreeting] = useState('Welcome');
    const [selectedLanguage, setSelectedLanguage] = useState('spanish');
    const [refreshing, setRefreshing] = useState(false);

    const isGuest = !user;
    const [dbDisplayName, setDbDisplayName] = useState('');
    const [studentStats, setStudentStats] = useState({ streak: 0, xp: 0, accuracy: 0, gems: 0, level: 1 });

    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            const { data } = await supabaseBrowser
                .from('user_profiles')
                .select('display_name')
                .eq('user_id', user.id)
                .single();
            if (data?.display_name) setDbDisplayName(data.display_name);
        };
        fetchProfile();
    }, [user]);

    // Fetch real student stats
    // Fetch real student stats using consistent service
    useEffect(() => {
        if (!user || isTeacher) return;
        const fetchStats = async () => {
            try {
                // 1. Get XP, Level, Gems from GemsAnalyticsService (Same as Desktop)
                const gemsService = new GemsAnalyticsService(supabaseBrowser);
                const gemsData = await gemsService.getStudentGemsAnalytics(user.id);

                console.log('[mobile-home] Gems Data:', gemsData);

                // 2. Calculate Streak manually from sessions (Same as Desktop)
                let streak = 0;
                let accuracy = 0;

                const { data: sessions } = await supabaseBrowser
                    .from('enhanced_game_sessions')
                    .select('created_at, accuracy_percentage, words_correct, words_attempted')
                    .eq('student_id', user.id)
                    .order('created_at', { ascending: false })
                    .order('created_at', { ascending: false }); // Fetch enough for streak and recent accuracy

                if (sessions && sessions.length > 0) {
                    // Calculate accuracy
                    const totalCorrect = sessions.reduce((sum: number, s: any) => sum + (s.words_correct || 0), 0);
                    const totalAttempted = sessions.reduce((sum: number, s: any) => sum + (s.words_attempted || 0), 0);
                    accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

                    // Fallback accuracy
                    if (accuracy === 0) {
                        const accPercentages = sessions.map((s: any) => parseFloat(s.accuracy_percentage) || 0).filter((a: number) => a > 0);
                        if (accPercentages.length > 0) {
                            accuracy = Math.round(accPercentages.reduce((a: number, b: number) => a + b, 0) / accPercentages.length);
                        }
                    }

                    // Calculate streak
                    const uniqueDates = new Set<string>();
                    sessions.forEach((s: any) => {
                        uniqueDates.add(new Date(s.created_at).toISOString().split('T')[0]);
                    });
                    const sortedDates = Array.from(uniqueDates).sort().reverse();

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
                            } else {
                                break;
                            }
                        }
                    }
                } else {
                    // Fallback to learner_progress for streak if no sessions found (legacy)
                    const { data: learnerProgress } = await supabaseBrowser
                        .from('learner_progress')
                        .select('current_streak')
                        .eq('user_id', user.id)
                        .single();

                    if (learnerProgress) {
                        streak = learnerProgress.current_streak || 0;
                    }
                }

                setStudentStats({
                    streak,
                    xp: gemsData.totalXP,
                    accuracy,
                    gems: gemsData.totalGems,
                    level: gemsData.currentLevel
                });

            } catch (error) {
                console.error('Error fetching student stats:', error);
            }
        };
        fetchStats();
    }, [user, isTeacher]);

    const userName = dbDisplayName || user?.user_metadata?.first_name || '';

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    // Redirect teachers to their home page
    useEffect(() => {
        if (!isLoading && isTeacher) {
            router.replace('/mobile-teacher-home');
        }
    }, [isLoading, isTeacher, router]);

    const handleRefresh = async () => {
        setRefreshing(true);
        // Uses the same logic as the main useEffect via simpler reload or refetch
        if (user && !isTeacher) {
            try {
                const gemsService = new GemsAnalyticsService(supabaseBrowser);
                const gemsData = await gemsService.getStudentGemsAnalytics(user.id);

                const { data: sessions } = await supabaseBrowser
                    .from('enhanced_game_sessions')
                    .select('created_at, accuracy_percentage, words_correct, words_attempted')
                    .eq('student_id', user.id)
                    .order('created_at', { ascending: false })
                    .order('created_at', { ascending: false });

                let streak = 0;
                let accuracy = 0;

                if (sessions && sessions.length > 0) {
                    const totalCorrect = sessions.reduce((sum: number, s: any) => sum + (s.words_correct || 0), 0);
                    const totalAttempted = sessions.reduce((sum: number, s: any) => sum + (s.words_attempted || 0), 0);
                    accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

                    // Streak
                    const uniqueDates = new Set<string>();
                    sessions.forEach((s: any) => {
                        uniqueDates.add(new Date(s.created_at).toISOString().split('T')[0]);
                    });
                    const sortedDates = Array.from(uniqueDates).sort().reverse();

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
                    }
                }

                setStudentStats({
                    streak,
                    xp: gemsData.totalXP,
                    accuracy,
                    gems: gemsData.totalGems,
                    level: gemsData.currentLevel
                });

            } catch (e) { console.error(e); }
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        setRefreshing(false);
    };

    // Format XP display
    const formatXP = (xp: number) => {
        if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
        return xp.toString();
    };

    // Stats for logged-in users - now connected to real data using consistent service
    const stats = [
        { icon: Flame, label: 'Streak', value: studentStats.streak.toString(), color: 'text-orange-400', bg: 'bg-orange-500/20' },
        { icon: Star, label: 'XP', value: formatXP(studentStats.xp), color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
        { icon: Gem, label: 'Gems', value: studentStats.gems.toString(), color: 'text-blue-400', bg: 'bg-blue-500/20' },
        { icon: Target, label: 'Accuracy', value: `${studentStats.accuracy}%`, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    ];

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true}>
            <PullToRefresh onRefresh={handleRefresh}>
                <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0f0f1a]">
                    {/* Ambient background effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
                        <div className="absolute top-40 -right-20 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 px-5 pt-4 pb-32">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-between items-start mb-6"
                        >
                            <div className="flex-1">
                                <p className="text-white/50 text-xs font-medium uppercase tracking-widest mb-1">
                                    {greeting}
                                </p>
                                <h1 className="text-2xl font-bold text-white">
                                    {isGuest ? (
                                        <span className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-purple-400" />
                                            Let's Play!
                                        </span>
                                    ) : (
                                        userName
                                    )}
                                </h1>
                            </div>

                            {isGuest ? (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push('/auth/login')}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-sm font-medium text-white/90 hover:bg-white/15 transition-colors"
                                >
                                    <LogIn className="w-4 h-4" />
                                    Sign In
                                </motion.button>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push('/mobile-profile')}
                                    className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-white/20 shadow-lg shadow-purple-500/20 flex items-center justify-center"
                                >
                                    <User className="w-5 h-5 text-white" />
                                </motion.button>
                            )}
                        </motion.div>

                        {/* Stats Row - Only for authenticated users */}
                        <AnimatePresence>
                            {!isGuest && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="grid grid-cols-4 gap-2 mb-6"
                                >
                                    {stats.map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`${stat.bg} backdrop-blur-sm rounded-2xl p-3 border border-white/5 flex flex-col items-center`}
                                        >
                                            <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
                                            <span className="text-lg font-bold text-white">{stat.value}</span>
                                            <span className="text-[10px] text-white/40 uppercase tracking-wide">{stat.label}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Guest welcome card */}
                        {isGuest && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/20 backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-purple-300" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white/90">Play for free!</p>
                                        <p className="text-xs text-white/50">Sign in to save your progress</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}



                        {/* Featured Game Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/mobile-games')} // Updated to mobile route
                            className="w-full h-44 rounded-3xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 p-5 relative overflow-hidden shadow-2xl shadow-purple-500/30 mb-6"
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-xl -ml-8 -mb-8" />
                            <div className="absolute bottom-4 right-4">
                                <Zap className="w-20 h-20 text-white/10" />
                            </div>

                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
                                        <Gamepad2 className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white">
                                        Start Here ✨
                                    </span>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Play Games</h2>
                                    <p className="text-white/70 text-sm">Learn vocabulary through fun challenges</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Game Categories Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-white">Explore</h3>
                                <button
                                    onClick={() => router.push('/mobile-games')} // Updated to mobile route
                                    className="text-xs text-purple-400 font-semibold flex items-center gap-1 hover:text-purple-300 transition-colors"
                                >
                                    View All <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {gameCategories.filter(c => !c.featured).map((category, i) => (
                                    <motion.button
                                        key={category.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => router.push(category.href)}
                                        className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/5 text-left hover:bg-white/10 transition-all group"
                                    >
                                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-3 shadow-lg group-hover:scale-105 transition-transform`}>
                                            <category.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className="font-semibold text-white mb-0.5">{category.title}</h4>
                                        <p className="text-xs text-white/40">{category.subtitle}</p>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>


                    </div>
                </div>
            </PullToRefresh>
        </MobilePageWrapper>
    );
}

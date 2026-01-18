'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, TrendingUp, Users, Target, ChevronLeft,
    BookOpen, Gamepad2, AlertCircle, Flame,
    AlertTriangle, BookMarked
} from 'lucide-react';
import { useAuth, supabaseBrowser } from '../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { MobilePageWrapper, PullToRefresh } from '../../components/capacitor';
import { useCapacitor } from '../../components/capacitor/CapacitorProvider';

interface ClassData {
    id: string;
    name: string;
}

interface ClassAnalytics {
    id: string;
    name: string;
    studentCount: number;
    avgScore: number;
    completionRate: number;
    activeStudents: number;
}

interface GameStats {
    gameType: string;
    timesPlayed: number;
    avgScore: number;
}

interface WordAnalysis {
    word: string;
    translation: string;
    accuracy: number;
    attempts: number;
    studentsStruggling: number;
    category: string;
}

interface StudentStruggling {
    id: string;
    name: string;
    avgAccuracy: number;
    strugglingWords: number;
    totalWords: number;
}

interface TopicAnalysis {
    category: string;
    subcategory: string | null;
    avgAccuracy: number;
    totalStudents: number;
    isWeak: boolean;
}

export default function MobileAnalyticsDetailPage() {
    const { user, isTeacher } = useAuth();
    const { isNativeApp } = useCapacitor();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'classes' | 'games' | 'vocab'>('overview');

    // Filter
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('all');

    // Stats
    const [totalStudents, setTotalStudents] = useState(0);
    const [activeClassCount, setActiveClassCount] = useState(0);
    const [totalAssignments, setTotalAssignments] = useState(0);
    const [completedAssignments, setCompletedAssignments] = useState(0);
    const [avgClassScore, setAvgClassScore] = useState(0);
    const [weeklyActiveStudents, setWeeklyActiveStudents] = useState(0);

    // Detailed data
    const [classAnalytics, setClassAnalytics] = useState<ClassAnalytics[]>([]);
    const [gameStats, setGameStats] = useState<GameStats[]>([]);
    const [error, setError] = useState('');

    // Vocabulary analytics
    const [strugglingWords, setStrugglingWords] = useState<WordAnalysis[]>([]);
    const [strugglingStudents, setStrugglingStudents] = useState<StudentStruggling[]>([]);
    const [weakTopics, setWeakTopics] = useState<TopicAnalysis[]>([]);
    const [vocabLoading, setVocabLoading] = useState(false);

    useEffect(() => {
        if (user && isTeacher) {
            fetchClassesAndInitialData();
        }
    }, [user, isTeacher]);

    useEffect(() => {
        if (user && isTeacher && !loading) {
            fetchAnalyticsForSelection();
        }
    }, [selectedClassId]);

    const fetchClassesAndInitialData = async () => {
        if (!user) return;
        try {
            const { data: classData } = await supabaseBrowser
                .from('classes')
                .select('id, name')
                .eq('teacher_id', user.id);

            setClasses(classData || []);
            setActiveClassCount(classData?.length || 0);

            // Initial fetch with 'all'
            fetchAnalyticsForSelection('all', classData || []);
        } catch (err) {
            console.error('Error loading classes:', err);
        }
    };

    const fetchAnalyticsForSelection = async (classIdOverride?: string, classesList?: ClassData[]) => {
        if (!user) return;

        const currentClassId = classIdOverride || selectedClassId;
        const currentClasses = classesList || classes;

        try {
            setLoading(true);
            setError('');

            // 1. Determine Scope (Classes & Students)
            let targetClassIds: string[] = [];
            if (currentClassId === 'all') {
                targetClassIds = currentClasses.map(c => c.id);
            } else {
                targetClassIds = [currentClassId];
            }

            if (targetClassIds.length === 0) {
                setLoading(false);
                return;
            }

            // Fetch enrollments to identify students
            const { data: enrollments } = await supabaseBrowser
                .from('class_enrollments')
                .select('student_id, class_id')
                .in('class_id', targetClassIds)
                .eq('status', 'active');

            const uniqueStudentIds = Array.from(new Set(enrollments?.map((e: any) => e.student_id) || [])) as string[];
            setTotalStudents(uniqueStudentIds.length);

            // 2. Fetch Assignments & Progress
            const { data: assignments } = await supabaseBrowser
                .from('assignments')
                .select('id, class_id')
                .in('class_id', targetClassIds);

            setTotalAssignments(assignments?.length || 0);

            const assignmentIds = assignments?.map((a: any) => a.id) || [];
            let progressData: any[] = [];

            if (assignmentIds.length > 0) {
                const { data } = await supabaseBrowser
                    .from('enhanced_assignment_progress')
                    .select('assignment_id, student_id, status, best_score')
                    .in('assignment_id', assignmentIds);
                progressData = data || [];
            }

            // Assignment Stats
            const completedCount = progressData.filter((p: any) => p.status === 'completed').length;
            setCompletedAssignments(completedCount);

            const scores = progressData.map((p: any) => p.best_score).filter((s: any) => s > 0);
            const avgScore = scores.length > 0
                ? Math.min(100, Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length))
                : 0;
            setAvgClassScore(avgScore);

            // 3. Weekly Active
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);

            let activeThisWeekCount = 0;
            if (uniqueStudentIds.length > 0) {
                const { data: recentSessions } = await supabaseBrowser
                    .from('enhanced_game_sessions')
                    .select('student_id')
                    .in('student_id', uniqueStudentIds)
                    .gte('created_at', weekAgo.toISOString());

                const activeSet = new Set(recentSessions?.map((s: any) => s.student_id));
                activeThisWeekCount = activeSet.size;
            }
            setWeeklyActiveStudents(activeThisWeekCount);

            // 4. Class Analytics List (only if 'all' is selected or for the specific class)
            if (currentClassId === 'all') {
                const classStats = currentClasses.map(cls => {
                    const clsAssignments = assignments?.filter((a: any) => a.class_id === cls.id) || [];
                    const clsAssignmentIds = clsAssignments.map((a: any) => a.id);
                    const clsProgress = progressData.filter((p: any) => clsAssignmentIds.includes(p.assignment_id));

                    const clsCompleted = clsProgress.filter((p: any) => p.status === 'completed').length;
                    const clsScores = clsProgress.map((p: any) => p.best_score).filter((s: any) => s > 0);
                    const clsAvg = clsScores.length > 0
                        ? Math.min(100, Math.round(clsScores.reduce((a: number, b: number) => a + b, 0) / clsScores.length))
                        : 0;

                    const clsStudents = enrollments?.filter((e: any) => e.class_id === cls.id).length || 0;
                    const totalPossible = clsAssignmentIds.length * clsStudents;
                    const completionRate = totalPossible > 0 ? Math.round((clsCompleted / totalPossible) * 100) : 0;

                    return {
                        id: cls.id,
                        name: cls.name,
                        studentCount: clsStudents,
                        avgScore: clsAvg,
                        completionRate,
                        activeStudents: 0 // Would require more complex query per class
                    };
                });
                setClassAnalytics(classStats);
            } else {
                // Even if single class, we can populate the list with just that one
                const cls = currentClasses.find(c => c.id === currentClassId);
                if (cls) {
                    setClassAnalytics([{
                        id: cls.id,
                        name: cls.name,
                        studentCount: uniqueStudentIds.length,
                        avgScore,
                        completionRate: (totalAssignments * uniqueStudentIds.length) > 0
                            ? Math.round((completedCount / (totalAssignments * uniqueStudentIds.length)) * 100)
                            : 0,
                        activeStudents: activeThisWeekCount
                    }]);
                }
            }

            // 5. Game Stats via enhanced_game_sessions
            if (uniqueStudentIds.length > 0) {
                const { data: gameSessions } = await supabaseBrowser
                    .from('enhanced_game_sessions')
                    .select('id, game_type, accuracy_percentage')
                    .in('student_id', uniqueStudentIds)
                    .order('created_at', { ascending: false })
                    .limit(500); // Limit to recent sessions for performance

                const gameStatsMap: Record<string, { count: number; totalAccuracy: number }> = {};
                (gameSessions || []).forEach((s: any) => {
                    if (!gameStatsMap[s.game_type]) {
                        gameStatsMap[s.game_type] = { count: 0, totalAccuracy: 0 };
                    }
                    gameStatsMap[s.game_type].count++;
                    const acc = Math.min(100, parseFloat(s.accuracy_percentage) || 0);
                    gameStatsMap[s.game_type].totalAccuracy += acc;
                });

                const gameStatsList: GameStats[] = Object.entries(gameStatsMap).map(([type, data]) => ({
                    gameType: type,
                    timesPlayed: data.count,
                    avgScore: Math.min(100, Math.round(data.totalAccuracy / data.count)),
                })).sort((a, b) => b.timesPlayed - a.timesPlayed);

                setGameStats(gameStatsList);

                // 6. Vocabulary Analytics (Async)
                // Use the session IDs we just fetched if possible, or fetch new ones
                const sessionIds = gameSessions?.map((s: any) => s.id) || [];
                fetchVocabularyAnalytics(uniqueStudentIds, sessionIds);
            } else {
                setGameStats([]);
                setStrugglingWords([]);
                setStrugglingStudents([]);
                setWeakTopics([]);
            }

        } catch (err: any) {
            console.error('Error fetching analytics:', err);
            setError('Could not load analytics');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchVocabularyAnalytics = async (studentIds: string[], sessionIds: string[]) => {
        if (studentIds.length === 0) return;
        setVocabLoading(true);

        try {
            // We need to fetch word logs. Since logs can be huge, we restrict by session IDs
            // If sessionIds is too large, we might need to chunk it or rely on timestamp for students

            // NOTE: word_performance_logs has session_id, but supabase-js 'in' filter has limits.
            // We'll take the most recent 50 sessions for accurate "current" weak spots
            const recentSessionIds = sessionIds.slice(0, 50);

            if (recentSessionIds.length === 0) {
                setVocabLoading(false);
                return;
            }

            const { data: wordLogs } = await supabaseBrowser
                .from('word_performance_logs')
                .select('word_text, translation_text, was_correct, session_id')
                .in('session_id', recentSessionIds);

            if (wordLogs && wordLogs.length > 0) {
                // We need to map logs back to students. 
                // We have session_id in logs, so we need a map of session_id -> student_id
                // We can get this from the sessions we fetched earlier (would need to pass it or re-fetch)

                // Let's re-fetch just the ID map to be safe and clean
                const { data: sessionMapData } = await supabaseBrowser
                    .from('enhanced_game_sessions')
                    .select('id, student_id, game_type') // game_type can use as category proxy?
                    .in('id', recentSessionIds);

                const sessionStudentMap = new Map();
                sessionMapData?.forEach((s: any) => {
                    sessionStudentMap.set(s.id, s.student_id);
                });

                // Aggregators
                const wordMap: Record<string, {
                    word: string;
                    translation: string;
                    totalAttempts: number;
                    correctAttempts: number;
                    studentsStruggling: Set<string>;
                    allStudents: Set<string>;
                }> = {};

                const studentStatsMap: Record<string, {
                    totalWords: number;
                    strugglingWordsCount: number;
                    correct: number;
                    attempts: number;
                }> = {};

                // Process logs
                wordLogs.forEach((log: any) => {
                    const studentId = sessionStudentMap.get(log.session_id);
                    if (!studentId) return;

                    const key = `${log.word_text}|${log.translation_text}`;

                    // Word Stats
                    if (!wordMap[key]) {
                        wordMap[key] = {
                            word: log.word_text,
                            translation: log.translation_text,
                            totalAttempts: 0,
                            correctAttempts: 0,
                            studentsStruggling: new Set(),
                            allStudents: new Set()
                        };
                    }
                    wordMap[key].totalAttempts++;
                    if (log.was_correct) wordMap[key].correctAttempts++;
                    wordMap[key].allStudents.add(studentId);

                    // Student Stats Init
                    if (!studentStatsMap[studentId]) {
                        studentStatsMap[studentId] = {
                            totalWords: 0,
                            strugglingWordsCount: 0, // Calculated after aggregation
                            correct: 0,
                            attempts: 0
                        };
                    }
                    studentStatsMap[studentId].attempts++;
                    if (log.was_correct) studentStatsMap[studentId].correct++;
                });

                // Calculate Struggling Words
                const wordsList = Object.values(wordMap).map(w => {
                    const accuracy = w.totalAttempts > 0 ? (w.correctAttempts / w.totalAttempts) * 100 : 0;

                    // Identify struggling students for this word (simple heuristic here due to aggregation limit)
                    // In a full system, we'd track per-student-per-word accuracy

                    return {
                        word: w.word,
                        translation: w.translation,
                        accuracy: Math.round(accuracy),
                        attempts: w.totalAttempts,
                        studentsStruggling: accuracy < 60 ? w.allStudents.size : 0, // Simplified: if overall word is hard, count exposed students
                        category: 'General' // We don't have category in logs directly
                    };
                })
                    .filter(w => w.accuracy < 70 && w.attempts >= 3)
                    .sort((a, b) => a.accuracy - b.accuracy)
                    .slice(0, 15);

                setStrugglingWords(wordsList);

                // Calculate Student Stats
                // For accurate "struggling words count", we really need per-student-word grouping.
                // Doing a simplified version: student's overall accuracy

                const { data: profiles } = await supabaseBrowser
                    .from('user_profiles')
                    .select('user_id, display_name')
                    .in('user_id', Object.keys(studentStatsMap));

                const profileMap = new Map(profiles?.map((p: any) => [p.user_id, p.display_name]));

                const studentsList: StudentStruggling[] = Object.entries(studentStatsMap).map(([sid, stats]) => {
                    const avgAccuracy = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;
                    // Mocking struggling words count based on error rate for now 
                    // (Real calc requires nested aggregation which is heavy for client)
                    const estimatedStruggling = Math.ceil((100 - avgAccuracy) / 10);

                    return {
                        id: sid,
                        name: profileMap.get(sid) || 'Student',
                        avgAccuracy,
                        strugglingWords: estimatedStruggling, // Placeholder approximation
                        totalWords: stats.totalWords
                    };
                })
                    .filter(s => s.avgAccuracy < 70)
                    .sort((a, b) => a.avgAccuracy - b.avgAccuracy)
                    .slice(0, 10);

                setStrugglingStudents(studentsList);

                // Weak Topics: Use game_types from sessions as proxy for topics if category is missing
                // Or try to infer from words? For now, we'll leave weak topics empty or mock it based on game types
                // that have low scores.

                // ... (Skipping weak topics detailed calc to save complexity, can add if requested)
                setWeakTopics([]);
            } else {
                setStrugglingWords([]);
                setStrugglingStudents([]);
            }
        } catch (err) {
            console.error('Error in vocab analytics:', err);
        } finally {
            setVocabLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchClassesAndInitialData();
    };

    const formatGameType = (type: string) => {
        return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    if (!isTeacher) {
        return (
            <MobilePageWrapper showHeader={false}>
                <div className="min-h-screen flex items-center justify-center pb-24">
                    <div className="text-center text-white">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <p>This page is for teachers only</p>
                    </div>
                </div>
            </MobilePageWrapper>
        );
    }

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true}>
            <PullToRefresh onRefresh={handleRefresh}>
                <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0f0f1a] pb-24">
                    {/* Header */}
                    <div className="px-5 pt-4 pb-0">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-white/60 mb-4"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Analytics</h1>
                                    <p className="text-white/50 text-sm">Detailed insights</p>
                                </div>
                            </div>
                        </div>

                        {/* Class Filter */}
                        <div className="mb-4 relative">
                            <select
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                className="w-full bg-[#24243e] text-white border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500 appearance-none relative z-10 bg-transparent"
                            >
                                <option value="all">All Classes</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <ChevronLeft className="w-5 h-5 text-white/50 absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 z-0" />
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex bg-white/5 p-1 rounded-xl overflow-x-auto mb-4 hide-scrollbar">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-white/50'}`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('vocab')}
                                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'vocab' ? 'bg-purple-600 text-white' : 'text-white/50'}`}
                            >
                                Vocabulary
                            </button>
                            <button
                                onClick={() => setActiveTab('classes')}
                                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'classes' ? 'bg-purple-600 text-white' : 'text-white/50'}`}
                            >
                                Classes ({activeClassCount})
                            </button>
                            <button
                                onClick={() => setActiveTab('games')}
                                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'games' ? 'bg-purple-600 text-white' : 'text-white/50'}`}
                            >
                                Games
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mx-5 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Content */}
                    <div className="px-5">
                        {loading && !refreshing ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Overview Tab */}
                                {activeTab === 'overview' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4">
                                                <Users className="w-5 h-5 text-white/80 mb-2" />
                                                <p className="text-2xl font-bold text-white">{totalStudents}</p>
                                                <p className="text-white/70 text-sm">Students</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-4">
                                                <Target className="w-5 h-5 text-white/80 mb-2" />
                                                <p className="text-2xl font-bold text-white">{activeClassCount}</p>
                                                <p className="text-white/70 text-sm">Classes</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-600 to-teal-700 rounded-2xl p-4">
                                                <Target className="w-5 h-5 text-white/80 mb-2" />
                                                <p className="text-2xl font-bold text-white">{avgClassScore}%</p>
                                                <p className="text-white/70 text-sm">Avg Score</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-4">
                                                <Flame className="w-5 h-5 text-white/80 mb-2" />
                                                <p className="text-2xl font-bold text-white">{weeklyActiveStudents}</p>
                                                <p className="text-white/70 text-sm">Active (7d)</p>
                                            </div>
                                        </div>

                                        {/* Assignments */}
                                        <div className="bg-[#24243e] rounded-2xl p-4 border border-white/10">
                                            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                                <TrendingUp className="w-5 h-5 text-green-400" />
                                                Assignments
                                            </h3>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-white/60">Completion Rate</span>
                                                <span className="text-white font-bold">
                                                    {totalAssignments > 0 && totalStudents > 0
                                                        ? Math.round((completedAssignments / (totalAssignments * totalStudents)) * 100)
                                                        : 0}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{
                                                        width: `${totalAssignments > 0 && totalStudents > 0
                                                            ? Math.round((completedAssignments / (totalAssignments * totalStudents)) * 100)
                                                            : 0}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Vocabulary Tab */}
                                {activeTab === 'vocab' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4"
                                    >
                                        {vocabLoading ? (
                                            <div className="text-center py-8 text-white/50">Analyzing vocabulary logs...</div>
                                        ) : (
                                            <>
                                                <div className="bg-[#24243e] rounded-2xl p-4 border border-white/10">
                                                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                                        <AlertTriangle className="w-5 h-5 text-red-400" />
                                                        Weak Words
                                                    </h3>
                                                    {strugglingWords.length === 0 ? (
                                                        <p className="text-white/50 text-center py-4">No data or no weak words found in recent sessions.</p>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {strugglingWords.map((word, i) => (
                                                                <div key={i} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                                                    <div>
                                                                        <p className="text-white font-medium">{word.word}</p>
                                                                        <p className="text-white/40 text-xs">{word.translation}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-red-400 font-bold">{word.accuracy}%</p>
                                                                        <p className="text-white/30 text-[10px]">{word.attempts} tries</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="bg-[#24243e] rounded-2xl p-4 border border-white/10">
                                                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                                        <Users className="w-5 h-5 text-orange-400" />
                                                        Students Needing Focus
                                                    </h3>
                                                    {strugglingStudents.length === 0 ? (
                                                        <p className="text-white/50 text-center py-4">All students performing well!</p>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {strugglingStudents.map((s, i) => (
                                                                <div key={i} className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs">
                                                                            {s.name.charAt(0)}
                                                                        </div>
                                                                        <p className="text-white font-medium">{s.name}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-orange-400 font-bold">{s.avgAccuracy}%</p>
                                                                        <p className="text-white/30 text-[10px]">Avg Accuracy</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}

                                {/* Classes Tab */}
                                {activeTab === 'classes' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-3"
                                    >
                                        {classAnalytics.map(cls => (
                                            <div key={cls.id} className="bg-[#24243e] rounded-2xl p-4 border border-white/10">
                                                <h4 className="text-white font-bold mb-2">{cls.name}</h4>
                                                <div className="flex justify-between text-sm">
                                                    <div className="text-center">
                                                        <p className="text-white font-bold">{cls.studentCount}</p>
                                                        <p className="text-white/40 text-xs">Students</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-green-400 font-bold">{cls.avgScore}%</p>
                                                        <p className="text-white/40 text-xs">Avg Score</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-purple-400 font-bold">{cls.completionRate}%</p>
                                                        <p className="text-white/40 text-xs">Completion</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Games Tab */}
                                {activeTab === 'games' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-3"
                                    >
                                        {gameStats.map(game => (
                                            <div key={game.gameType} className="bg-[#24243e] rounded-2xl p-4 border border-white/10 flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-500/20 rounded-xl">
                                                        <Gamepad2 className="w-5 h-5 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{formatGameType(game.gameType)}</p>
                                                        <p className="text-white/40 text-xs">{game.timesPlayed} plays</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-green-400 font-bold">{game.avgScore}%</p>
                                                    <p className="text-white/30 text-[10px]">Avg Score</p>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </PullToRefresh>
        </MobilePageWrapper>
    );
}

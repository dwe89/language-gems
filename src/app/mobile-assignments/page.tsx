'use client';

import React, { useState, useEffect } from 'react';
import { Hexagon, Clock, CheckCircle, BookOpen, Gamepad2, ArrowRight, Target, Trophy, Percent, Sparkles, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, supabaseBrowser } from '../../components/auth/AuthProvider';
import { MobilePageWrapper, PullToRefresh } from '../../components/capacitor';
import { logError } from '../../lib/utils';

// Types
type Assignment = {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    status: 'completed' | 'in-progress' | 'not-started';
    gemType: 'purple' | 'blue' | 'yellow' | 'green' | 'red';
    gameCount?: number;
    activities?: string[];
    className?: string;
    points?: number;
    type?: string;
    curriculum_level?: 'KS3' | 'KS4';
    vocabulary_count?: number;
    progress?: {
        bestScore: number;
        bestAccuracy: number;
        completedAt: string | null;
        attemptsCount: number;
        totalTimeSpent: number;
        completedGames: number;
        totalGames: number;
    } | null;
};

const MobileAssignmentCard = ({ assignment, isPastDue }: { assignment: Assignment, isPastDue: boolean }) => {
    const router = useRouter();

    const gemColors = {
        'purple': 'from-purple-500 to-indigo-600',
        'blue': 'from-blue-500 to-cyan-600',
        'yellow': 'from-amber-400 to-orange-500',
        'green': 'from-emerald-500 to-green-600',
        'red': 'from-red-500 to-rose-600'
    };

    const statusColors = {
        'completed': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        'not-started': 'bg-white/10 text-white/60 border-white/10'
    };

    const statusText = {
        'completed': 'Completed',
        'in-progress': 'In Progress',
        'not-started': 'Not Started'
    };

    const progressPercentage = assignment.progress && assignment.progress.totalGames > 0
        ? (assignment.progress.completedGames / assignment.progress.totalGames) * 100
        : 0;

    const handleCardClick = () => {
        const path = assignment.type === 'vocabulary-test'
            ? `/student/test/${assignment.id}`
            : `/student-dashboard/assignments/${assignment.id}`;
        router.push(path);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCardClick}
            className={`relative overflow-hidden rounded-2xl bg-[#24243e] border border-white/10 mb-4 shadow-lg ${isPastDue ? 'opacity-80' : ''}`}
        >
            {/* Left Accent Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${gemColors[assignment.gemType]}`} />

            <div className="p-4 pl-6">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 leading-snug">{assignment.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                            {assignment.className && (
                                <span className="bg-white/5 px-2 py-0.5 rounded text-white/70">{assignment.className}</span>
                            )}
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className={isPastDue ? 'text-red-400 font-medium' : ''}>
                                    Due {assignment.dueDate}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 ${statusColors[assignment.status]}`}>
                        {assignment.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                        {statusText[assignment.status]}
                    </span>

                    {!!assignment.points && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                            <Trophy className="w-3 h-3" />
                            {assignment.points} pts
                        </span>
                    )}

                    {!!assignment.gameCount && (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
                            <Gamepad2 className="w-3 h-3" />
                            {assignment.gameCount} Activities
                        </span>
                    )}
                </div>

                {/* Progress Bar (if active) */}
                {assignment.status === 'in-progress' && (
                    <div className="mt-3">
                        <div className="flex justify-between text-xs text-white/50 mb-1.5">
                            <span>Progress</span>
                            <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${gemColors[assignment.gemType]}`}
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default function MobileAssignmentsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
    const [error, setError] = useState('');

    const fetchAssignments = async () => {
        if (!user) return;

        try {
            setError('');
            const supabase = supabaseBrowser;

            // 1. Get Enrollments
            const { data: enrollments, error: enrollmentError } = await supabase
                .from('class_enrollments')
                .select('class_id')
                .eq('student_id', user.id);

            if (enrollmentError) throw enrollmentError;
            if (!enrollments?.length) {
                setAssignments([]);
                setLoading(false);
                return;
            }

            const classIds = enrollments.map(e => e.class_id);

            // 2. Fetch Assignments & Progress
            const [
                { data: rawAssignments, error: assignError },
                { data: progressData, error: progError },
                { data: vocabTests, error: vocabError }
            ] = await Promise.all([
                supabase.from('assignments')
                    .select('id, title, description, due_date, points, status, game_type, game_config, class_id, curriculum_level, vocabulary_count')
                    .in('class_id', classIds)
                    .order('created_at', { ascending: false }),
                supabase.from('enhanced_assignment_progress')
                    .select('*')
                    .eq('student_id', user.id),
                supabase.from('vocabulary_test_assignments')
                    .select('*, vocabulary_tests(*)')
                    .in('class_id', classIds)
                    .eq('status', 'assigned')
                    .order('assigned_date', { ascending: false })
            ]);

            if (assignError) throw assignError;

            // 3. Process Assignments
            const progressMap = new Map();
            progressData?.forEach(p => progressMap.set(p.assignment_id, p));

            const processed: Assignment[] = (rawAssignments || []).map((a: any, i) => {
                const progress = progressMap.get(a.id);
                let status: any = 'not-started';

                if (progress) {
                    if (progress.status === 'completed') status = 'completed';
                    else if (progress.status === 'in_progress' || progress.best_score > 0) status = 'in-progress';
                }

                // Determine activity count
                const games = a.game_config?.selectedGames || a.game_config?.gameConfig?.selectedGames || [];
                const assessments = a.game_config?.assessmentConfig?.selectedAssessments || [];
                const skills = a.game_config?.skillsConfig?.selectedSkills || [];
                const count = Math.max(1, games.length + assessments.length + skills.length);

                return {
                    id: a.id,
                    title: a.title,
                    description: a.description,
                    dueDate: a.due_date ? new Date(a.due_date).toLocaleDateString('en-GB') : 'No Date',
                    status,
                    gemType: ['purple', 'blue', 'yellow', 'green', 'red'][i % 5] as any,
                    gameCount: count,
                    points: a.points,
                    type: a.game_type,
                    className: 'Class Task', // Simplified for mobile
                    progress: progress ? {
                        bestScore: progress.best_score || 0,
                        bestAccuracy: progress.best_accuracy || 0,
                        completedAt: progress.completed_at,
                        attemptsCount: progress.session_count || 0,
                        totalTimeSpent: progress.total_time_spent || 0,
                        completedGames: progress.progress_data?.completedActivities || 0,
                        totalGames: count
                    } : null
                };
            });

            // Add Vocab Tests (Logic simplified for mobile brevity)
            // ... (Add vocab test processing if needed, skipping for brevity in this initial pass to ensure main assignments work)

            setAssignments(processed);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError('Could not load assignments');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAssignments();
    };

    useEffect(() => {
        fetchAssignments();
    }, [user]);

    const isPastDue = (dateStr: string) => {
        if (!dateStr || dateStr === 'No Date') return false;
        try {
            const [d, m, y] = dateStr.split('/');
            return new Date(parseInt(y), parseInt(m) - 1, parseInt(d)) < new Date();
        } catch { return false; }
    };

    const currentList = assignments.filter(a => !isPastDue(a.dueDate));
    const pastList = assignments.filter(a => isPastDue(a.dueDate));
    const displayList = activeTab === 'current' ? currentList : pastList;

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true}>
            <PullToRefresh onRefresh={handleRefresh}>
                <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0f0f1a] pb-24">
                    {/* Header */}
                    <div className="px-5 pt-4 pb-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <ClipboardList className="w-6 h-6 text-purple-400" />
                                Tasks
                            </h1>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-white/5 p-1 rounded-xl mb-6">
                            <button
                                onClick={() => setActiveTab('current')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'current' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/50'
                                    }`}
                            >
                                Current ({currentList.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('past')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'past' ? 'bg-purple-600 text-white shadow-lg' : 'text-white/50'
                                    }`}
                            >
                                Past ({pastList.length})
                            </button>
                        </div>

                        {/* Content */}
                        {loading && !refreshing ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
                                <p>{error}</p>
                                <button onClick={fetchAssignments} className="mt-2 text-sm underline">Try Again</button>
                            </div>
                        ) : displayList.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ClipboardList className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-white/60">No {activeTab} assignments found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {displayList.map(item => (
                                    <MobileAssignmentCard
                                        key={item.id}
                                        assignment={item}
                                        isPastDue={isPastDue(item.dueDate)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </PullToRefresh>
        </MobilePageWrapper>
    );
}

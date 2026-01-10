'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Brain, Trophy, TrendingUp, Clock, Users, Target, Zap,
    ChevronDown, ChevronUp, CheckCircle, Circle, AlertCircle, Star, AlertTriangle, Sparkles,
    BarChart3, PieChart, Activity, Award, Gem, GraduationCap,
    BookMarked, Lightbulb, RefreshCw, Download, Filter
} from 'lucide-react';
import { GemCard, GemButton } from '../ui/GemTheme';

// Types for grammar assignment analytics
interface TopicStepProgress {
    topic_id: string;
    topic_name: string;
    lesson_completed: boolean;
    lesson_completed_at?: string;
    practice_completed: boolean;
    practice_best_accuracy: number;
    practice_attempts: number;
    test_completed: boolean;
    test_best_accuracy: number;
    test_passed: boolean;
    topic_mastery_level: 'not_started' | 'in_progress' | 'practicing' | 'testing' | 'mastered';
    total_gems_earned: number;
}

interface StudentGrammarProgress {
    student_id: string;
    student_name: string;
    avatar_url?: string;
    topics_progress: TopicStepProgress[];
    overall_completion: number;
    average_accuracy: number;
    total_time_spent: number;
    total_gems_earned: number;
    mastery_level: string;
    last_activity: string;
}

interface GrammarAssignmentAnalytics {
    assignment_id: string;
    assignment_title: string;
    total_students: number;
    topics: {
        id: string;
        name: string;
        category: string;
    }[];
    completion_stats: {
        lessons_completed: number;
        practice_completed: number;
        tests_completed: number;
        fully_mastered: number;
    };
    accuracy_stats: {
        average_practice_accuracy: number;
        average_test_accuracy: number;
        highest_performer: string;
        needs_attention: string[];
    };
    engagement_stats: {
        total_sessions: number;
        total_time_minutes: number;
        total_gems_awarded: number;
        average_attempts_per_topic: number;
    };
    students: StudentGrammarProgress[];
    common_mistakes?: {
        question: string;
        type: string;
        incorrect_count: number;
        total_attempts: number;
        fail_rate: number;
    }[];
}

interface GrammarAssignmentAnalyticsDashboardProps {
    assignmentId: string;
    assignmentTitle?: string;
    teacherId: string;
}

// Mastery level badges with beautiful styling
const MasteryBadge = ({ level }: { level: string }) => {
    const config: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
        'not_started': {
            bg: 'bg-gray-100',
            text: 'text-gray-500',
            icon: <Circle className="w-3.5 h-3.5" />,
            label: 'Not Started'
        },
        'in_progress': {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            icon: <BookOpen className="w-3.5 h-3.5" />,
            label: 'Reading'
        },
        'practicing': {
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            icon: <Brain className="w-3.5 h-3.5" />,
            label: 'Practicing'
        },
        'testing': {
            bg: 'bg-purple-50',
            text: 'text-purple-600',
            icon: <Target className="w-3.5 h-3.5" />,
            label: 'Testing'
        },
        'mastered': {
            bg: 'bg-gradient-to-r from-emerald-50 to-teal-50',
            text: 'text-emerald-600',
            icon: <Trophy className="w-3.5 h-3.5" />,
            label: 'Mastered'
        }
    };

    const c = config[level] || config['not_started'];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
            {c.icon}
            {c.label}
        </span>
    );
};

// Step completion indicator with animation
const StepIndicator = ({
    completed,
    label,
    accuracy,
    icon
}: {
    completed: boolean;
    label: string;
    accuracy?: number;
    icon: React.ReactNode;
}) => (
    <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${completed
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200'
            : 'bg-gray-50 border border-gray-200'
            }`}
    >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${completed
            ? 'bg-gradient-to-br from-emerald-400 to-green-500 text-white shadow-md'
            : 'bg-gray-200 text-gray-400'
            }`}>
            {completed ? <CheckCircle className="w-4 h-4" /> : icon}
        </div>
        <span className={`text-xs font-medium ${completed ? 'text-emerald-700' : 'text-gray-500'}`}>
            {label}
        </span>
        {accuracy !== undefined && accuracy > 0 && (
            <span className={`text-xs font-semibold ${accuracy >= 80 ? 'text-emerald-600' : accuracy >= 60 ? 'text-amber-600' : 'text-red-500'
                }`}>
                {accuracy.toFixed(0)}%
            </span>
        )}
    </motion.div>
);

// Progress ring component for circular progress
const ProgressRing = ({
    progress,
    size = 60,
    strokeWidth = 6,
    color = 'emerald'
}: {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    const colorClasses: Record<string, string> = {
        'emerald': 'stroke-emerald-500',
        'blue': 'stroke-blue-500',
        'purple': 'stroke-purple-500',
        'amber': 'stroke-amber-500'
    };

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-gray-100"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className={colorClasses[color]}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                        strokeDasharray: circumference
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">{progress.toFixed(0)}%</span>
            </div>
        </div>
    );
};

// Stat card with beautiful gradient
const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    gradient,
    trend
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    gradient: string;
    trend?: { value: number; positive: boolean };
}) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100"
    >
        <div className={`absolute inset-0 opacity-5 ${gradient}`} />
        <div className="relative p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${gradient} shadow-lg`}>
                    <div className="text-white">
                        {icon}
                    </div>
                </div>
            </div>
            {trend && (
                <div className={`mt-3 flex items-center gap-1 text-sm ${trend.positive ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                    {trend.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 rotate-180" />}
                    <span className="font-medium">{trend.value}%</span>
                    <span className="text-gray-500">vs last week</span>
                </div>
            )}
        </div>
    </motion.div>
);

// Student row component with expandable details
const StudentProgressRow = ({
    student,
    topics,
    isExpanded,
    onToggle
}: {
    student: StudentGrammarProgress;
    topics: { id: string; name: string; category: string }[];
    isExpanded: boolean;
    onToggle: () => void;
}) => {
    // Create a map of topic progress for quick lookup
    const progressMap = useMemo(() => {
        const map = new Map<string, TopicStepProgress>();
        student.topics_progress.forEach(p => map.set(p.topic_id, p));
        return map;
    }, [student.topics_progress]);

    return (
        <motion.div
            layout
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
        >
            {/* Main Row */}
            <div
                className="p-4 cursor-pointer flex items-center gap-4"
                onClick={onToggle}
            >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md">
                    {student.student_name.charAt(0).toUpperCase()}
                </div>

                {/* Name and Status */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{student.student_name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <MasteryBadge level={student.mastery_level} />
                        <span className="text-xs text-gray-400">
                            Last active: {new Date(student.last_activity).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-lg font-bold text-gray-900">{student.overall_completion.toFixed(0)}%</p>
                        <p className="text-xs text-gray-500">Complete</p>
                    </div>
                    <div className="text-center">
                        <p className={`text-lg font-bold ${student.average_accuracy >= 80 ? 'text-emerald-600' :
                            student.average_accuracy >= 60 ? 'text-amber-600' : 'text-red-500'
                            }`}>
                            {student.average_accuracy.toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-500">Accuracy</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-purple-600">{student.total_gems_earned}</p>
                        <p className="text-xs text-gray-500">Gems</p>
                    </div>
                </div>

                {/* Expand/Collapse */}
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="text-gray-400"
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100"
                    >
                        <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50">
                            <h5 className="text-sm font-semibold text-gray-700 mb-3">Topic Progress</h5>
                            <div className="space-y-3">
                                {topics.map(topic => {
                                    const progress = progressMap.get(topic.id);
                                    return (
                                        <div
                                            key={topic.id}
                                            className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h6 className="font-medium text-gray-800">{topic.name}</h6>
                                                    <span className="text-xs text-gray-500">{topic.category}</span>
                                                </div>
                                                {progress && (
                                                    <MasteryBadge level={progress.topic_mastery_level} />
                                                )}
                                            </div>

                                            {/* Step Progress */}
                                            <div className="flex items-center gap-2">
                                                <StepIndicator
                                                    completed={progress?.lesson_completed || false}
                                                    label="Lesson"
                                                    icon={<BookOpen className="w-3 h-3" />}
                                                />
                                                <div className="flex-1 h-0.5 bg-gray-200 rounded">
                                                    <div
                                                        className={`h-full rounded ${progress?.lesson_completed ? 'bg-emerald-400' : ''}`}
                                                        style={{ width: progress?.lesson_completed ? '100%' : '0%' }}
                                                    />
                                                </div>
                                                <StepIndicator
                                                    completed={progress?.practice_completed || false}
                                                    label="Practice"
                                                    accuracy={progress?.practice_best_accuracy}
                                                    icon={<Brain className="w-3 h-3" />}
                                                />
                                                <div className="flex-1 h-0.5 bg-gray-200 rounded">
                                                    <div
                                                        className={`h-full rounded ${progress?.practice_completed ? 'bg-emerald-400' : ''}`}
                                                        style={{ width: progress?.practice_completed ? '100%' : '0%' }}
                                                    />
                                                </div>
                                                <StepIndicator
                                                    completed={progress?.test_completed || false}
                                                    label="Test"
                                                    accuracy={progress?.test_best_accuracy}
                                                    icon={<Target className="w-3 h-3" />}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Main dashboard component
export default function GrammarAssignmentAnalyticsDashboard({
    assignmentId,
    assignmentTitle,
    teacherId
}: GrammarAssignmentAnalyticsDashboardProps) {
    const [analytics, setAnalytics] = useState<GrammarAssignmentAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
    const [filterMastery, setFilterMastery] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'completion' | 'accuracy'>('completion');

    // AI Insights State
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [generatingInsight, setGeneratingInsight] = useState(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);

                const response = await fetch(`/api/teacher/grammar-assignment-analytics/${assignmentId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch analytics');
                }

                const data = await response.json();
                setAnalytics(data);
            } catch (err) {
                console.error('Error fetching grammar analytics:', err);
                setError(err instanceof Error ? err.message : 'Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };

        if (assignmentId) {
            fetchAnalytics();
        }
    }, [assignmentId]);

    const handleGenerateInsight = async () => {
        if (!analytics) return;
        setGeneratingInsight(true);
        try {
            const res = await fetch(`/api/teacher/grammar-assignment-analytics/${assignmentId}/ai-insights`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentTitle,
                    completionStats: analytics.completion_stats,
                    accuracyStats: analytics.accuracy_stats,
                    commonMistakes: analytics.common_mistakes
                })
            });
            const data = await res.json();
            if (data.insight) setAiInsight(data.insight);
        } catch (e) {
            console.error(e);
        } finally {
            setGeneratingInsight(false);
        }
    };

    const toggleStudentExpand = (studentId: string) => {
        setExpandedStudents(prev => {
            const next = new Set(prev);
            if (next.has(studentId)) {
                next.delete(studentId);
            } else {
                next.add(studentId);
            }
            return next;
        });
    };

    // Filter and sort students
    const filteredStudents = useMemo(() => {
        if (!analytics) return [];

        let students = [...analytics.students];

        // Filter by mastery level
        if (filterMastery !== 'all') {
            students = students.filter(s => s.mastery_level === filterMastery);
        }

        // Sort
        students.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.student_name.localeCompare(b.student_name);
                case 'accuracy':
                    return b.average_accuracy - a.average_accuracy;
                case 'completion':
                default:
                    return b.overall_completion - a.overall_completion;
            }
        });

        return students;
    }, [analytics, filterMastery, sortBy]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    <RefreshCw className="w-8 h-8 text-purple-600" />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <GemCard className="text-center py-10">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Analytics</h3>
                <p className="text-gray-600">{error}</p>
            </GemCard>
        );
    }

    if (!analytics) {
        return (
            <GemCard className="text-center py-10">
                <BookMarked className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Analytics Data</h3>
                <p className="text-gray-600">No grammar assignment data found.</p>
            </GemCard>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <GraduationCap className="w-7 h-7 text-purple-600" />
                        Grammar Skills Analytics
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {assignmentTitle || analytics.assignment_title}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <GemButton variant="secondary" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export
                    </GemButton>
                    <GemButton variant="gem" gemType="rare" size="sm" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </GemButton>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Students"
                    value={analytics.total_students}
                    subtitle={`${analytics.completion_stats.fully_mastered} mastered`}
                    icon={<Users className="w-6 h-6" />}
                    gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
                />
                <StatCard
                    title="Lessons Completed"
                    value={`${Math.round((analytics.completion_stats.lessons_completed / analytics.total_students) * 100)}%`}
                    subtitle={`${analytics.completion_stats.lessons_completed} students`}
                    icon={<BookOpen className="w-6 h-6" />}
                    gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                />
                <StatCard
                    title="Average Test Score"
                    value={`${analytics.accuracy_stats.average_test_accuracy.toFixed(0)}%`}
                    subtitle="Across all topics"
                    icon={<Target className="w-6 h-6" />}
                    gradient="bg-gradient-to-br from-purple-500 to-violet-600"
                />
                <StatCard
                    title="Total Gems Earned"
                    value={analytics.engagement_stats.total_gems_awarded}
                    subtitle={`${Math.round(analytics.engagement_stats.total_time_minutes)} min total`}
                    icon={<Gem className="w-6 h-6" />}
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                />
            </div>

            {/* Topic Completion Overview */}
            <GemCard className="overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        Topic Completion Overview
                    </h3>
                </div>
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Lesson Progress */}
                        <div className="text-center">
                            <ProgressRing
                                progress={(analytics.completion_stats.lessons_completed / analytics.total_students) * 100}
                                size={100}
                                color="blue"
                            />
                            <h4 className="font-semibold text-gray-800 mt-3">Lessons Read</h4>
                            <p className="text-sm text-gray-500">
                                {analytics.completion_stats.lessons_completed}/{analytics.total_students} students
                            </p>
                        </div>

                        {/* Practice Progress */}
                        <div className="text-center">
                            <ProgressRing
                                progress={(analytics.completion_stats.practice_completed / analytics.total_students) * 100}
                                size={100}
                                color="amber"
                            />
                            <h4 className="font-semibold text-gray-800 mt-3">Practice Complete</h4>
                            <p className="text-sm text-gray-500">
                                {analytics.completion_stats.practice_completed}/{analytics.total_students} students
                            </p>
                        </div>

                        {/* Test Progress */}
                        <div className="text-center">
                            <ProgressRing
                                progress={(analytics.completion_stats.tests_completed / analytics.total_students) * 100}
                                size={100}
                                color="purple"
                            />
                            <h4 className="font-semibold text-gray-800 mt-3">Tests Passed</h4>
                            <p className="text-sm text-gray-500">
                                {analytics.completion_stats.tests_completed}/{analytics.total_students} students
                            </p>
                        </div>
                    </div>
                </div>
            </GemCard>

            {/* Insights Section */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    Deep Insights
                </h2>

                {/* AI Class Coach */}
                <GemCard className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
                    <div className="p-5 flex flex-col md:flex-row md:items-start gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-indigo-100 text-indigo-600 w-fit">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-bold text-indigo-900">AI Class Coach</h3>
                                {aiInsight && (
                                    <button
                                        onClick={() => setAiInsight(null)}
                                        className="text-xs text-indigo-400 hover:text-indigo-600 flex items-center gap-1"
                                    >
                                        <RefreshCw className="w-3 h-3" /> Regenerate
                                    </button>
                                )}
                            </div>

                            {!aiInsight ? (
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <p className="text-indigo-700/80 text-sm">
                                        Generate instant pedagogical analysis and teaching recommendations based on this class's performance.
                                        Our AI analyzes common mistakes and accuracy trends to suggest targeted interventions.
                                    </p>
                                    <button
                                        onClick={handleGenerateInsight}
                                        disabled={generatingInsight}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm shadow-indigo-200 whitespace-nowrap"
                                    >
                                        {generatingInsight ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4" />
                                                Generate Insights
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white/50 rounded-lg p-4 border border-indigo-100/50">
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-gray-800 leading-relaxed text-sm md:text-base font-medium"
                                    >
                                        {aiInsight}
                                    </motion.div>
                                </div>
                            )}
                        </div>
                    </div>
                </GemCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Top Performer */}
                <GemCard className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Top Performer</h4>
                            <p className="text-sm text-gray-500">Highest accuracy</p>
                        </div>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                        {analytics.accuracy_stats.highest_performer || 'No data yet'}
                    </p>
                </GemCard>

                {/* Needs Attention */}
                <GemCard className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">Needs Attention</h4>
                            <p className="text-sm text-gray-500">Students who may need help</p>
                        </div>
                    </div>
                    {analytics.accuracy_stats.needs_attention.length > 0 ? (
                        <ul className="space-y-1">
                            {analytics.accuracy_stats.needs_attention.slice(0, 3).map((name, i) => (
                                <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                    {name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-emerald-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            All students on track!
                        </p>
                    )}
                </GemCard>
            </div>

            {/* Common Mistakes */}
            <GemCard className="overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Common Mistakes
                    </h3>
                </div>
                <div className="p-5">
                    {analytics.common_mistakes && analytics.common_mistakes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {analytics.common_mistakes.map((mistake, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100 hover:shadow-sm transition-shadow">
                                    <div className="w-8 h-8 rounded-full bg-white text-red-500 border border-red-100 flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm line-clamp-2" title={mistake.question.replace(/<[^>]*>/g, '')}>
                                            {mistake.question.replace(/<[^>]*>/g, '')}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                            <span className="bg-white px-2 py-0.5 rounded border border-gray-200 uppercase tracking-wider text-[10px] font-semibold">
                                                {mistake.type}
                                            </span>
                                            <span className="flex items-center gap-1 text-red-600 font-medium">
                                                <AlertCircle className="w-3 h-3" />
                                                {mistake.incorrect_count} failed ({mistake.fail_rate.toFixed(0)}%)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
                            <p className="font-medium text-gray-900">No common mistakes detected yet!</p>
                            <p className="text-sm">Students are performing well on all questions.</p>
                        </div>
                    )}
                </div>
            </GemCard>

            {/* Student Progress List */}
            <GemCard className="overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        Student Progress ({filteredStudents.length})
                    </h3>

                    <div className="flex items-center gap-3">
                        {/* Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filterMastery}
                                onChange={(e) => setFilterMastery(e.target.value)}
                                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="all">All Students</option>
                                <option value="mastered">Mastered</option>
                                <option value="testing">Testing</option>
                                <option value="practicing">Practicing</option>
                                <option value="in_progress">In Progress</option>
                                <option value="not_started">Not Started</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="completion">Sort by Completion</option>
                            <option value="accuracy">Sort by Accuracy</option>
                            <option value="name">Sort by Name</option>
                        </select>
                    </div>
                </div>

                <div className="p-5 space-y-3">
                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No students match the selected filter</p>
                        </div>
                    ) : (
                        filteredStudents.map(student => (
                            <StudentProgressRow
                                key={student.student_id}
                                student={student}
                                topics={analytics.topics}
                                isExpanded={expandedStudents.has(student.student_id)}
                                onToggle={() => toggleStudentExpand(student.student_id)}
                            />
                        ))
                    )}
                </div>
            </GemCard>
        </div>
    );
}

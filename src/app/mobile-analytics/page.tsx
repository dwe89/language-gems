'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, TrendingUp, Users, Target, Award, Clock,
    BookOpen, Gamepad2, AlertCircle, ChevronRight, Percent
} from 'lucide-react';
import { useAuth, supabaseBrowser } from '../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MobilePageWrapper, PullToRefresh } from '../../components/capacitor';
import { useCapacitor } from '../../components/capacitor/CapacitorProvider';

interface AnalyticsData {
    totalStudents: number;
    totalClasses: number;
    totalAssignments: number;
    completedAssignments: number;
    averageScore: number;
    topPerformers: { name: string; score: number }[];
    recentActivity: { type: string; count: number }[];
}

export default function MobileAnalyticsPage() {
    const { user, isTeacher } = useAuth();
    const { isNativeApp } = useCapacitor();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalStudents: 0,
        totalClasses: 0,
        totalAssignments: 0,
        completedAssignments: 0,
        averageScore: 0,
        topPerformers: [],
        recentActivity: [],
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && isTeacher) {
            fetchAnalytics();
        }
    }, [user, isTeacher]);

    const fetchAnalytics = async () => {
        if (!user) return;

        try {
            setError('');

            // Fetch classes
            const { data: classes } = await supabaseBrowser
                .from('classes')
                .select('id')
                .eq('teacher_id', user.id);

            const classIds = classes?.map((c: any) => c.id) || [];

            if (classIds.length === 0) {
                setAnalytics({
                    totalStudents: 0,
                    totalClasses: 0,
                    totalAssignments: 0,
                    completedAssignments: 0,
                    averageScore: 0,
                    topPerformers: [],
                    recentActivity: [],
                });
                setLoading(false);
                return;
            }

            // Fetch enrollments first
            const { data: enrollmentData } = await supabaseBrowser
                .from('class_enrollments')
                .select('student_id')
                .in('class_id', classIds)
                .eq('status', 'active');

            // Fetch assignments
            const { data: assignmentsData } = await supabaseBrowser
                .from('assignments')
                .select('id')
                .eq('created_by', user.id);

            const assignmentIds = assignmentsData?.map((a: any) => a.id) || [];

            // Fetch progress for assignments
            let progressData: any[] = [];
            if (assignmentIds.length > 0) {
                const { data } = await supabaseBrowser
                    .from('enhanced_assignment_progress')
                    .select('status, best_score')
                    .in('assignment_id', assignmentIds);
                progressData = data || [];
            }

            // Calculate stats
            const totalStudents = new Set(enrollmentData?.map((e: any) => e.student_id) || []).size;
            const totalAssignments = assignmentsData?.length || 0;
            const completedCount = progressData.filter((p: any) => p.status === 'completed').length;
            const scores = progressData.map((p: any) => p.best_score).filter((s: any) => s > 0);
            const averageScore = scores.length > 0
                ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
                : 0;

            setAnalytics({
                totalStudents,
                totalClasses: classIds.length,
                totalAssignments,
                completedAssignments: completedCount,
                averageScore,
                topPerformers: [],
                recentActivity: [],
            });
        } catch (err: any) {
            console.error('Error fetching analytics:', err);
            setError('Could not load analytics');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAnalytics();
    };

    // For web, redirect to normal analytics page
    if (!isNativeApp) {
        router.replace('/dashboard/analytics');
        return null;
    }

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

    const statCards = [
        {
            label: 'Students',
            value: analytics.totalStudents,
            icon: Users,
            color: 'from-blue-500 to-indigo-600',
        },
        {
            label: 'Classes',
            value: analytics.totalClasses,
            icon: BookOpen,
            color: 'from-purple-500 to-pink-600',
        },
        {
            label: 'Assignments',
            value: analytics.totalAssignments,
            icon: Target,
            color: 'from-green-500 to-emerald-600',
        },
        {
            label: 'Avg Score',
            value: `${analytics.averageScore}%`,
            icon: Percent,
            color: 'from-amber-500 to-orange-600',
        },
    ];

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true}>
            <PullToRefresh onRefresh={handleRefresh}>
                <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0f0f1a] pb-24">
                    {/* Header */}
                    <div className="px-5 pt-4 pb-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                                <p className="text-white/50 text-sm">Track your classroom performance</p>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Stats Grid */}
                        {loading && !refreshing ? (
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {statCards.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4`}
                                    >
                                        <stat.icon className="w-6 h-6 text-white/80 mb-2" />
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                        <p className="text-white/70 text-sm">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Quick Insights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-[#24243e] rounded-2xl border border-white/10 p-4 mb-4"
                        >
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-400" />
                                Quick Insights
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2 border-b border-white/5">
                                    <span className="text-white/70">Completion Rate</span>
                                    <span className="text-white font-semibold">
                                        {analytics.totalAssignments > 0
                                            ? Math.round((analytics.completedAssignments / analytics.totalAssignments) * 100)
                                            : 0
                                        }%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-white/5">
                                    <span className="text-white/70">Students per Class</span>
                                    <span className="text-white font-semibold">
                                        {analytics.totalClasses > 0
                                            ? Math.round(analytics.totalStudents / analytics.totalClasses)
                                            : 0
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-white/70">Assignments per Class</span>
                                    <span className="text-white font-semibold">
                                        {analytics.totalClasses > 0
                                            ? Math.round(analytics.totalAssignments / analytics.totalClasses)
                                            : 0
                                        }
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* View Details Link */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Link href="/mobile-analytics-detail">
                                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-500/30 flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">View Full Analytics</p>
                                        <p className="text-white/50 text-sm">Detailed reports and charts</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-purple-400" />
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </PullToRefresh>
        </MobilePageWrapper>
    );
}

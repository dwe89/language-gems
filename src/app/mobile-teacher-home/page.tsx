'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    ClipboardList,
    BarChart3,
    BookOpen,
    Plus,
    ChevronRight,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    Gamepad2,
    School
} from 'lucide-react';
import { useAuth } from '../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MobilePageWrapper, PageTransition, PullToRefresh, StatsSkeleton, ListItemSkeleton } from '../../components/capacitor';

interface TeacherStats {
    totalClasses: number;
    totalStudents: number;
    activeAssignments: number;
    completedToday: number;
}

interface RecentActivity {
    id: string;
    type: 'assignment_completed' | 'student_joined' | 'game_played';
    studentName: string;
    className: string;
    details: string;
    timestamp: string;
}

interface ClassSummary {
    id: string;
    name: string;
    studentCount: number;
    pendingAssignments: number;
    averageProgress: number;
}

export default function MobileTeacherHomePage() {
    const { user, isTeacher } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('Welcome back');
    const [stats, setStats] = useState<TeacherStats>({
        totalClasses: 0,
        totalStudents: 0,
        activeAssignments: 0,
        completedToday: 0,
    });
    const [classes, setClasses] = useState<ClassSummary[]>([]);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [displayName, setDisplayName] = useState('');
    const [schoolCode, setSchoolCode] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    useEffect(() => {
        if (user && isTeacher) {
            fetchTeacherData();
        }
    }, [user, isTeacher]);

    const fetchTeacherData = async () => {
        try {
            setLoading(true);

            // Fetch classes
            const { data: classesData, error: classesError } = await supabaseBrowser
                .from('classes')
                .select('id, name')
                .eq('teacher_id', user?.id);

            if (classesError) throw classesError;

            const classIds = classesData?.map(c => c.id) || [];

            // Fetch student count
            let totalStudents = 0;
            const enrollmentCounts: Record<string, number> = {};
            if (classIds.length > 0) {
                const { data: enrollments, count } = await supabaseBrowser
                    .from('class_enrollments')
                    .select('class_id', { count: 'exact' })
                    .in('class_id', classIds)
                    .eq('status', 'active');
                totalStudents = count || 0;

                // Count per class
                (enrollments || []).forEach((e: any) => {
                    enrollmentCounts[e.class_id] = (enrollmentCounts[e.class_id] || 0) + 1;
                });
            }

            // Fetch assignment count
            const { count: assignmentCount } = await supabaseBrowser
                .from('assignments')
                .select('*', { count: 'exact' })
                .eq('created_by', user?.id)
                .eq('status', 'active');

            // Fetch pending assignments per class
            const assignmentCounts: Record<string, number> = {};
            if (classIds.length > 0) {
                const { data: assignments } = await supabaseBrowser
                    .from('assignments')
                    .select('class_id')
                    .in('class_id', classIds)
                    .eq('status', 'active');

                (assignments || []).forEach((a: any) => {
                    assignmentCounts[a.class_id] = (assignmentCounts[a.class_id] || 0) + 1;
                });
            }

            // Fetch completed today count
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const { count: completedTodayCount } = await supabaseBrowser
                .from('enhanced_assignment_progress')
                .select('*', { count: 'exact' })
                .gte('completed_at', today.toISOString())
                .eq('status', 'completed');

            setStats({
                totalClasses: classesData?.length || 0,
                totalStudents,
                activeAssignments: assignmentCount || 0,
                completedToday: completedTodayCount || 0,
            });

            // Calculate average progress per class from enhanced_assignment_progress
            const classProgressData: Record<string, { completed: number; total: number }> = {};
            for (const classId of classIds) {
                // Get assignments for this class
                const { data: classAssignments } = await supabaseBrowser
                    .from('assignments')
                    .select('id')
                    .eq('class_id', classId);

                if (classAssignments && classAssignments.length > 0) {
                    const assignmentIds = classAssignments.map(a => a.id);
                    const studentCount = enrollmentCounts[classId] || 0;
                    const totalPossible = assignmentIds.length * studentCount;

                    // Count completed assignments
                    const { count: completedCount } = await supabaseBrowser
                        .from('enhanced_assignment_progress')
                        .select('*', { count: 'exact' })
                        .in('assignment_id', assignmentIds)
                        .eq('status', 'completed');

                    classProgressData[classId] = {
                        completed: completedCount || 0,
                        total: totalPossible
                    };
                }
            }

            // Map classes with real data including average progress
            const classSummaries: ClassSummary[] = (classesData || []).slice(0, 3).map(c => {
                const progress = classProgressData[c.id];
                const avgProgress = progress && progress.total > 0
                    ? Math.round((progress.completed / progress.total) * 100)
                    : 0;

                return {
                    id: c.id,
                    name: c.name,
                    studentCount: enrollmentCounts[c.id] || 0,
                    pendingAssignments: assignmentCounts[c.id] || 0,
                    averageProgress: avgProgress,
                };
            });

            setClasses(classSummaries);

            // Fetch recent activity (recent game sessions from students in teacher's classes)
            if (classIds.length > 0) {
                const { data: recentSessions } = await supabaseBrowser
                    .from('game_sessions')
                    .select(`
                        id,
                        created_at,
                        game_type,
                        score,
                        accuracy,
                        user_id
                    `)
                    .order('created_at', { ascending: false })
                    .limit(5);

                // We'd need to join with student enrollments - for now show what we have
                setRecentActivity((recentSessions || []).map((s: any) => ({
                    id: s.id,
                    type: 'game_played' as const,
                    studentName: 'Student',
                    className: 'Class',
                    details: `Scored ${s.score || 0} on ${s.game_type || 'game'}`,
                    timestamp: s.created_at
                })));
            }

        } catch (error) {
            console.error('Error fetching teacher data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        await fetchTeacherData();
    };

    // Fetch teacher display name and school code from user_profiles
    useEffect(() => {
        if (!user) return;

        const fetchTeacherProfile = async () => {
            // Fetch from user_profiles - this is where school_code and display_name are stored
            const { data: profileData } = await supabaseBrowser
                .from('user_profiles')
                .select('display_name, school_code, school_initials')
                .eq('user_id', user.id)
                .single();

            if (profileData) {
                if (profileData.display_name) {
                    setDisplayName(profileData.display_name);
                }
                // Use school_code or fall back to school_initials
                const code = profileData.school_code || profileData.school_initials;
                if (code) {
                    setSchoolCode(code);
                }
            }
        };

        fetchTeacherProfile();
    }, [user]);


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

    const quickActions = [
        {
            icon: Plus,
            label: 'New Class',
            color: 'from-blue-500 to-indigo-600',
            href: '/mobile-classes',
        },
        {
            icon: ClipboardList,
            label: 'Assignment',
            color: 'from-green-500 to-emerald-600',
            href: '/mobile-teacher-assignments',
        },
        {
            icon: BarChart3,
            label: 'Analytics',
            color: 'from-purple-500 to-pink-600',
            href: '/mobile-analytics',
        },
        {
            icon: BookOpen,
            label: 'Classes',
            color: 'from-orange-500 to-red-600',
            href: '/mobile-classes',
        },
    ];

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true}>
            <PullToRefresh onRefresh={handleRefresh}>
                <PageTransition>
                    <div className="pb-24">
                        {/* Header */}
                        <div className="px-6 pb-4 pt-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-white/60 text-sm font-medium uppercase tracking-wider">{greeting}</p>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                                        {displayName || user?.user_metadata?.first_name || 'Teacher'}
                                    </h1>
                                </div>
                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push('/mobile-profile')}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white/20 shadow-lg cursor-pointer hover:border-white/40 transition-colors flex items-center justify-center"
                                >
                                    <School className="w-5 h-5 text-white" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        {loading ? (
                            <div className="px-6 mb-6">
                                <StatsSkeleton />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 px-6 mb-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4"
                                >
                                    <Users className="w-6 h-6 text-white/80 mb-2" />
                                    <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                                    <p className="text-white/70 text-sm">Students</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 }}
                                    className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl p-4"
                                >
                                    <BookOpen className="w-6 h-6 text-white/80 mb-2" />
                                    <p className="text-2xl font-bold text-white">{stats.totalClasses}</p>
                                    <p className="text-white/70 text-sm">Classes</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-gradient-to-br from-green-600 to-teal-700 rounded-2xl p-4"
                                >
                                    <ClipboardList className="w-6 h-6 text-white/80 mb-2" />
                                    <p className="text-2xl font-bold text-white">{stats.activeAssignments}</p>
                                    <p className="text-white/70 text-sm">Assignments</p>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-4"
                                >
                                    <TrendingUp className="w-6 h-6 text-white/80 mb-2" />
                                    <p className="text-2xl font-bold text-white">{stats.completedToday}</p>
                                    <p className="text-white/70 text-sm">Completed Today</p>
                                </motion.div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="px-6 mb-6"
                        >
                            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {quickActions.map((action) => (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className="flex flex-col items-center"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 shadow-lg`}>
                                            <action.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-xs text-white/70 text-center">{action.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>

                        {/* Classes Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="px-6 mb-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">Your Classes</h3>
                                <Link
                                    href="/mobile-classes"
                                    className="text-purple-400 text-sm font-medium flex items-center"
                                >
                                    View All <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </div>

                            {loading ? (
                                <ListItemSkeleton />
                            ) : classes.length > 0 ? (
                                <div className="space-y-3">
                                    {classes.map((cls) => (
                                        <Link
                                            key={cls.id}
                                            href={`/mobile-class/${cls.id}`}
                                            className="block bg-[#24243e] rounded-2xl p-4 border border-white/5 active:bg-[#2a2a4a] transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-bold text-lg text-white">{cls.name}</h4>
                                                <ChevronRight className="w-5 h-5 text-white/40" />
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-white/60">
                                                <span className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    {cls.studentCount} students
                                                </span>
                                                <span className="flex items-center">
                                                    <ClipboardList className="w-4 h-4 mr-1" />
                                                    {cls.pendingAssignments} pending
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-white/50">Avg Progress</span>
                                                    <span className="text-white/80">{cls.averageProgress}%</span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-1.5">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
                                                        style={{ width: `${cls.averageProgress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-[#24243e] rounded-2xl border border-white/5">
                                    <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/60 mb-4">No classes yet</p>
                                    <Link
                                        href="/mobile-classes"
                                        className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create Your First Class
                                    </Link>
                                </div>
                            )}
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="px-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                            </div>

                            <div className="bg-[#24243e] rounded-2xl p-4 border border-white/5">
                                {recentActivity.length > 0 ? (
                                    recentActivity.slice(0, 3).map((activity, index) => (
                                        <div
                                            key={activity.id}
                                            className={`flex items-center space-x-3 py-3 ${index < recentActivity.slice(0, 3).length - 1 ? 'border-b border-white/5' : ''}`}
                                        >
                                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                                <Gamepad2 className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-white">{activity.details}</p>
                                                <p className="text-white/50 text-sm">
                                                    {new Date(activity.timestamp).toLocaleDateString('en-GB', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6">
                                        <Gamepad2 className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                        <p className="text-white/50 text-sm">No recent activity yet</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </PageTransition>
            </PullToRefresh>
        </MobilePageWrapper>
    );
}

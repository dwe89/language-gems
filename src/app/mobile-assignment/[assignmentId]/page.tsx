'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ClipboardList, ChevronLeft, Calendar, Users, CheckCircle,
    Clock, Target, BookOpen, AlertCircle, Trophy, XCircle
} from 'lucide-react';
import { useAuth, supabaseBrowser } from '../../../components/auth/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import { MobilePageWrapper, PullToRefresh } from '../../../components/capacitor';
import { useCapacitor } from '../../../components/capacitor/CapacitorProvider';

interface StudentProgress {
    student_id: string;
    student_name: string;
    status: 'not_started' | 'in_progress' | 'completed';
    best_score: number;
    attempts: number;
    completed_at: string | null;
}

interface AssignmentDetail {
    id: string;
    title: string;
    description: string;
    class_name: string;
    class_id: string;
    due_date: string;
    status: string;
    game_type: string;
    category_id: string;
    created_at: string;
}

export default function MobileAssignmentDetailPage() {
    const { user, isTeacher } = useAuth();
    const { isNativeApp } = useCapacitor();
    const router = useRouter();
    const params = useParams();
    const assignmentId = params.assignmentId as string;

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
    const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && assignmentId) {
            // Teachers see full progress
            if (isTeacher) {
                fetchAssignmentDetails();
            } else {
                // For students, redirect to their assignment view
                router.replace(`/student-dashboard/assignments/${assignmentId}`);
            }
        } else if (user === null && !loading) {
            // User not logged in
            setError('Please log in to view assignments');
            setLoading(false);
        }
    }, [user, isTeacher, assignmentId]);

    const fetchAssignmentDetails = async () => {
        if (!user || !assignmentId) return;

        try {
            setError('');

            // Fetch assignment
            const { data: assignmentData, error: assignError } = await supabaseBrowser
                .from('assignments')
                .select(`
                    id, 
                    title, 
                    description,
                    due_date, 
                    status,
                    game_type,
                    category_id,
                    created_at,
                    class_id,
                    classes (id, name)
                `)
                .eq('id', assignmentId)
                .single();

            if (assignError) {
                console.error('Assignment fetch error:', assignError);
                throw assignError;
            }

            if (assignmentData) {
                setAssignment({
                    id: assignmentData.id,
                    title: assignmentData.title,
                    description: assignmentData.description || '',
                    class_name: (assignmentData.classes as any)?.name || 'Unknown Class',
                    class_id: assignmentData.class_id,
                    due_date: assignmentData.due_date,
                    status: assignmentData.status || 'active',
                    game_type: assignmentData.game_type || '',
                    category_id: assignmentData.category_id || '',
                    created_at: assignmentData.created_at,
                });

                // Fetch class students
                const { data: enrollments } = await supabaseBrowser
                    .from('class_enrollments')
                    .select('student_id')
                    .eq('class_id', assignmentData.class_id)
                    .eq('status', 'active');

                const studentIds = enrollments?.map((e: any) => e.student_id) || [];

                if (studentIds.length > 0) {
                    // Fetch student profiles
                    const { data: profiles } = await supabaseBrowser
                        .from('user_profiles')
                        .select('user_id, display_name')
                        .in('user_id', studentIds);

                    // Fetch progress for this assignment
                    const { data: progressData } = await supabaseBrowser
                        .from('enhanced_assignment_progress')
                        .select('student_id, status, best_score, attempts, completed_at')
                        .eq('assignment_id', assignmentId);

                    // Map students with their progress
                    const studentProgressList: StudentProgress[] = studentIds.map((studentId: string) => {
                        const profile = profiles?.find((p: any) => p.user_id === studentId);
                        const progress = progressData?.find((p: any) => p.student_id === studentId);

                        return {
                            student_id: studentId,
                            student_name: profile?.display_name || 'Student',
                            status: progress?.status || 'not_started',
                            best_score: progress?.best_score || 0,
                            attempts: progress?.attempts || 0,
                            completed_at: progress?.completed_at || null,
                        };
                    });

                    // Sort: completed first, then in_progress, then not_started
                    studentProgressList.sort((a, b) => {
                        const order = { completed: 0, in_progress: 1, not_started: 2 };
                        return order[a.status] - order[b.status];
                    });

                    setStudentProgress(studentProgressList);
                }
            }
        } catch (err: any) {
            console.error('Error fetching assignment:', err);
            setError('Could not load assignment');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAssignmentDetails();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-400 bg-green-500/20';
            case 'in_progress': return 'text-yellow-400 bg-yellow-500/20';
            default: return 'text-white/40 bg-white/10';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            case 'in_progress': return <Clock className="w-4 h-4" />;
            default: return <XCircle className="w-4 h-4" />;
        }
    };

    // Stats
    const completedCount = studentProgress.filter(s => s.status === 'completed').length;
    const inProgressCount = studentProgress.filter(s => s.status === 'in_progress').length;
    const notStartedCount = studentProgress.filter(s => s.status === 'not_started').length;
    const avgScore = studentProgress.length > 0
        ? Math.round(studentProgress.reduce((sum, s) => sum + s.best_score, 0) / studentProgress.length)
        : 0;

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
                    <div className="px-5 pt-4 pb-4">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-white/60 mb-4"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button>

                        {loading ? (
                            <div className="space-y-3">
                                <div className="h-8 w-3/4 bg-white/10 rounded-lg animate-pulse" />
                                <div className="h-4 w-1/2 bg-white/5 rounded-lg animate-pulse" />
                            </div>
                        ) : assignment ? (
                            <>
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex-shrink-0">
                                        <ClipboardList className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">{assignment.title}</h1>
                                        <p className="text-white/50 text-sm flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />
                                            {assignment.class_name}
                                        </p>
                                    </div>
                                </div>

                                {/* Assignment Info */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                        <Calendar className="w-4 h-4 text-white/40 mb-1" />
                                        <p className="text-xs text-white/40">Due Date</p>
                                        <p className="text-white font-medium text-sm">
                                            {assignment.due_date
                                                ? new Date(assignment.due_date).toLocaleDateString('en-GB')
                                                : 'No due date'}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                        <Target className="w-4 h-4 text-white/40 mb-1" />
                                        <p className="text-xs text-white/40">Game Type</p>
                                        <p className="text-white font-medium text-sm capitalize">
                                            {assignment.game_type?.replace(/-/g, ' ') || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <div className="px-5 mb-6">
                        <div className="grid grid-cols-4 gap-2">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-500/20 rounded-xl p-3 text-center"
                            >
                                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-1" />
                                <p className="text-lg font-bold text-white">{completedCount}</p>
                                <p className="text-[10px] text-white/50">Done</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                                className="bg-yellow-500/20 rounded-xl p-3 text-center"
                            >
                                <Clock className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                <p className="text-lg font-bold text-white">{inProgressCount}</p>
                                <p className="text-[10px] text-white/50">In Progress</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/10 rounded-xl p-3 text-center"
                            >
                                <XCircle className="w-5 h-5 text-white/40 mx-auto mb-1" />
                                <p className="text-lg font-bold text-white">{notStartedCount}</p>
                                <p className="text-[10px] text-white/50">Not Started</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="bg-purple-500/20 rounded-xl p-3 text-center"
                            >
                                <Trophy className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                                <p className="text-lg font-bold text-white">{avgScore}%</p>
                                <p className="text-[10px] text-white/50">Avg Score</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="px-5">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-white/60" />
                            Student Progress
                        </h3>

                        {loading && !refreshing ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : studentProgress.length === 0 ? (
                            <div className="text-center py-8 bg-white/5 rounded-2xl">
                                <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
                                <p className="text-white/50">No students enrolled</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {studentProgress.map((student, index) => (
                                    <motion.div
                                        key={student.student_id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="bg-[#24243e] rounded-xl p-3 border border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${getStatusColor(student.status)}`}>
                                                {getStatusIcon(student.status)}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{student.student_name}</p>
                                                <p className="text-white/40 text-xs">
                                                    {student.attempts} attempt{student.attempts !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${student.best_score >= 80 ? 'text-green-400' : student.best_score >= 60 ? 'text-yellow-400' : 'text-white/60'}`}>
                                                {student.status === 'not_started' ? '-' : `${student.best_score}%`}
                                            </p>
                                            {student.completed_at && (
                                                <p className="text-[10px] text-white/30">
                                                    {new Date(student.completed_at).toLocaleDateString('en-GB')}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </PullToRefresh>
        </MobilePageWrapper>
    );
}

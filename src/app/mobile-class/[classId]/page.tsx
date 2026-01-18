'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, ChevronLeft, CheckCircle, Clock, Target,
    BookOpen, AlertCircle, Plus, ClipboardList, XCircle, User
} from 'lucide-react';
import { useAuth, supabaseBrowser } from '../../../components/auth/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { MobilePageWrapper, PullToRefresh } from '../../../components/capacitor';

interface ClassDetail {
    id: string;
    name: string;
    language: string;
    studentCount: number;
}

interface Student {
    id: string;
    display_name: string;
    last_activity: string | null;
    assignments_completed: number;
    avg_score: number;
}

interface Assignment {
    id: string;
    title: string;
    due_date: string;
    status: string;
    completed_count: number;
    total_students: number;
}

export default function MobileClassDetailPage() {
    const { user, isTeacher } = useAuth();
    const router = useRouter();
    const params = useParams();
    const classId = params.classId as string;

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [activeTab, setActiveTab] = useState<'students' | 'assignments'>('students');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && classId) {
            fetchClassData();
        }
    }, [user, classId]);

    const fetchClassData = async () => {
        if (!user || !classId) return;

        try {
            setError('');

            // Fetch class details
            const { data: classData, error: classError } = await supabaseBrowser
                .from('classes')
                .select('id, name, language')
                .eq('id', classId)
                .single();

            if (classError) throw classError;

            // Fetch enrolled students
            const { data: enrollments } = await supabaseBrowser
                .from('class_enrollments')
                .select('student_id')
                .eq('class_id', classId)
                .eq('status', 'active');

            const studentIds = enrollments?.map((e: any) => e.student_id) || [];

            if (classData) {
                setClassDetail({
                    id: classData.id,
                    name: classData.name,
                    language: classData.language || 'Language',
                    studentCount: studentIds.length,
                });
            }

            // Fetch student profiles and progress
            if (studentIds.length > 0) {
                const { data: profiles } = await supabaseBrowser
                    .from('user_profiles')
                    .select('user_id, display_name')
                    .in('user_id', studentIds);

                // Fetch class assignments
                const { data: classAssignments } = await supabaseBrowser
                    .from('assignments')
                    .select('id')
                    .eq('class_id', classId);

                const assignmentIds = classAssignments?.map((a: any) => a.id) || [];

                // Fetch progress for all students on class assignments
                let progressData: any[] = [];
                if (assignmentIds.length > 0) {
                    const { data } = await supabaseBrowser
                        .from('enhanced_assignment_progress')
                        .select('student_id, assignment_id, status, best_score')
                        .in('assignment_id', assignmentIds);
                    progressData = data || [];
                }

                // Fetch last activity
                const { data: sessions } = await supabaseBrowser
                    .from('enhanced_game_sessions')
                    .select('student_id, created_at')
                    .in('student_id', studentIds)
                    .order('created_at', { ascending: false });

                const studentList: Student[] = studentIds.map((studentId: string) => {
                    const profile = profiles?.find((p: any) => p.user_id === studentId);
                    const studentProgress = progressData.filter((p: any) => p.student_id === studentId);
                    const completedCount = studentProgress.filter((p: any) => p.status === 'completed').length;
                    const scores = studentProgress.map((p: any) => p.best_score).filter((s: any) => s > 0);
                    const avgScore = scores.length > 0
                        ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
                        : 0;
                    const lastSession = sessions?.find((s: any) => s.student_id === studentId);

                    return {
                        id: studentId,
                        display_name: profile?.display_name || 'Student',
                        last_activity: lastSession?.created_at || null,
                        assignments_completed: completedCount,
                        avg_score: avgScore,
                    };
                });

                setStudents(studentList);
            }

            // Fetch assignments for this class
            const { data: assignmentsData } = await supabaseBrowser
                .from('assignments')
                .select('id, title, due_date, status')
                .eq('class_id', classId)
                .order('due_date', { ascending: false })
                .limit(10);

            if (assignmentsData) {
                // Fetch progress for each assignment
                const assignmentIds = assignmentsData.map((a: any) => a.id);
                const { data: progressData } = await supabaseBrowser
                    .from('enhanced_assignment_progress')
                    .select('assignment_id, status')
                    .in('assignment_id', assignmentIds);

                const assignmentList: Assignment[] = assignmentsData.map((a: any) => {
                    const progress = progressData?.filter((p: any) => p.assignment_id === a.id) || [];
                    const completedCount = progress.filter((p: any) => p.status === 'completed').length;

                    return {
                        id: a.id,
                        title: a.title,
                        due_date: a.due_date,
                        status: a.status || 'active',
                        completed_count: completedCount,
                        total_students: studentIds.length,
                    };
                });

                setAssignments(assignmentList);
            }

        } catch (err: any) {
            console.error('Error fetching class:', err);
            setError('Could not load class');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchClassData();
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Never';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString('en-GB');
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
                        ) : classDetail ? (
                            <>
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex-shrink-0">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-white">{classDetail.name}</h1>
                                        <p className="text-white/50 text-sm flex items-center gap-2">
                                            <Users className="w-3 h-3" />
                                            {classDetail.studentCount} students • {classDetail.language}
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

                        {/* Tab Navigation */}
                        <div className="flex bg-white/5 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab('students')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'students' ? 'bg-purple-600 text-white' : 'text-white/50'
                                    }`}
                            >
                                Students ({students.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('assignments')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'assignments' ? 'bg-purple-600 text-white' : 'text-white/50'
                                    }`}
                            >
                                Assignments ({assignments.length})
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-5">
                        {loading && !refreshing ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Students Tab */}
                                {activeTab === 'students' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-2"
                                    >
                                        {students.length === 0 ? (
                                            <div className="text-center py-12 bg-white/5 rounded-2xl">
                                                <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                                <p className="text-white/50 mb-4">No students enrolled</p>
                                                <Link
                                                    href="/mobile-classes"
                                                    className="inline-flex items-center px-4 py-2 bg-purple-600 rounded-xl text-white text-sm"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Students
                                                </Link>
                                            </div>
                                        ) : (
                                            students.map((student, index) => (
                                                <motion.div
                                                    key={student.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    className="bg-[#24243e] rounded-xl p-3 border border-white/5 flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-purple-500/20 rounded-full">
                                                            <User className="w-4 h-4 text-purple-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium text-sm">{student.display_name}</p>
                                                            <p className="text-white/40 text-xs">
                                                                Last active: {formatDate(student.last_activity)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-bold text-sm ${student.avg_score >= 80 ? 'text-green-400' : student.avg_score >= 60 ? 'text-yellow-400' : 'text-white/60'}`}>
                                                            {student.avg_score > 0 ? `${student.avg_score}%` : '-'}
                                                        </p>
                                                        <p className="text-[10px] text-white/30">
                                                            {student.assignments_completed} completed
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </motion.div>
                                )}

                                {/* Assignments Tab */}
                                {activeTab === 'assignments' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-2"
                                    >
                                        {assignments.length === 0 ? (
                                            <div className="text-center py-12 bg-white/5 rounded-2xl">
                                                <ClipboardList className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                                <p className="text-white/50 mb-4">No assignments yet</p>
                                                <Link
                                                    href="/mobile-teacher-assignments"
                                                    className="inline-flex items-center px-4 py-2 bg-purple-600 rounded-xl text-white text-sm"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create Assignment
                                                </Link>
                                            </div>
                                        ) : (
                                            assignments.map((assignment, index) => (
                                                <Link
                                                    key={assignment.id}
                                                    href={`/mobile-assignment/${assignment.id}`}
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.03 }}
                                                        className="bg-[#24243e] rounded-xl p-3 border border-white/5 flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-green-500/20 rounded-full">
                                                                <ClipboardList className="w-4 h-4 text-green-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-white font-medium text-sm">{assignment.title}</p>
                                                                <p className="text-white/40 text-xs">
                                                                    Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString('en-GB') : 'No date'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-white font-bold text-sm">
                                                                {assignment.completed_count}/{assignment.total_students}
                                                            </p>
                                                            <p className="text-[10px] text-white/30">completed</p>
                                                        </div>
                                                    </motion.div>
                                                </Link>
                                            ))
                                        )}
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

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ClipboardList, Plus, ChevronRight, Search, Calendar,
    Users, CheckCircle, Clock, AlertCircle, BookOpen
} from 'lucide-react';
import { useAuth, supabaseBrowser } from '../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MobilePageWrapper, PullToRefresh } from '../../components/capacitor';
import { useCapacitor } from '../../components/capacitor/CapacitorProvider';

interface AssignmentData {
    id: string;
    title: string;
    class_name: string;
    class_id: string;
    due_date: string;
    status: 'active' | 'closed' | 'draft';
    completion_count: number;
    total_students: number;
}

export default function MobileTeacherAssignmentsPage() {
    const { user, isTeacher } = useAuth();
    const { isNativeApp } = useCapacitor();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [assignments, setAssignments] = useState<AssignmentData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && isTeacher) {
            fetchAssignments();
        }
    }, [user, isTeacher]);

    const fetchAssignments = async () => {
        if (!user) return;

        try {
            setError('');

            // Fetch all assignments created by this teacher
            const { data: assignmentsData, error: assignError } = await supabaseBrowser
                .from('assignments')
                .select(`
                    id, 
                    title, 
                    due_date, 
                    status, 
                    class_id,
                    classes (id, name)
                `)
                .eq('created_by', user.id)
                .order('created_at', { ascending: false });

            if (assignError) throw assignError;

            if (!assignmentsData || assignmentsData.length === 0) {
                setAssignments([]);
                setLoading(false);
                return;
            }

            // Get completion counts from enhanced_assignment_progress
            const assignmentIds = assignmentsData.map((a: any) => a.id);
            const classIds = [...new Set(assignmentsData.map((a: any) => a.class_id))];

            const [progressResult, enrollmentResult] = await Promise.all([
                supabaseBrowser
                    .from('enhanced_assignment_progress')
                    .select('assignment_id, status')
                    .in('assignment_id', assignmentIds),
                supabaseBrowser
                    .from('class_enrollments')
                    .select('class_id')
                    .in('class_id', classIds)
                    .eq('status', 'active')
            ]);

            // Count completions per assignment
            const completionCounts: Record<string, number> = {};
            (progressResult.data || []).forEach((p: any) => {
                if (p.status === 'completed') {
                    completionCounts[p.assignment_id] = (completionCounts[p.assignment_id] || 0) + 1;
                }
            });

            // Count students per class
            const classCounts: Record<string, number> = {};
            (enrollmentResult.data || []).forEach((e: any) => {
                classCounts[e.class_id] = (classCounts[e.class_id] || 0) + 1;
            });

            const processed: AssignmentData[] = assignmentsData.map((a: any) => ({
                id: a.id,
                title: a.title,
                class_name: a.classes?.name || 'Unknown Class',
                class_id: a.class_id,
                due_date: a.due_date,
                status: a.status || 'active',
                completion_count: completionCounts[a.id] || 0,
                total_students: classCounts[a.class_id] || 0,
            }));

            setAssignments(processed);
        } catch (err: any) {
            console.error('Error fetching assignments:', err);
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

    const isPastDue = (dateStr: string) => {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date();
    };

    const activeAssignments = assignments.filter(a => !isPastDue(a.due_date) && a.status === 'active');
    const pastAssignments = assignments.filter(a => isPastDue(a.due_date) || a.status !== 'active');
    const displayList = activeTab === 'active' ? activeAssignments : pastAssignments;

    const filteredAssignments = displayList.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.class_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // For web, redirect to normal assignments page
    if (!isNativeApp) {
        router.replace('/dashboard/assignments');
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

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true}>
            <PullToRefresh onRefresh={handleRefresh}>
                <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0f0f1a] pb-24">
                    {/* Header */}
                    <div className="px-5 pt-4 pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                                    <ClipboardList className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Assignments</h1>
                                    <p className="text-white/50 text-sm">{assignments.length} total</p>
                                </div>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search assignments..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-[#24243e] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-green-500/50"
                            />
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-white/5 p-1 rounded-xl mb-4">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'active'
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'text-white/50'
                                    }`}
                            >
                                Active ({activeAssignments.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('past')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'past'
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'text-white/50'
                                    }`}
                            >
                                Past ({pastAssignments.length})
                            </button>
                        </div>

                        {/* Create Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/dashboard/assignments/new')}
                            className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Create Assignment
                        </motion.button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mx-5 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Assignments List */}
                    <div className="px-5">
                        {loading && !refreshing ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : filteredAssignments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ClipboardList className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-white/60 mb-2">
                                    {searchQuery ? 'No assignments found' : `No ${activeTab} assignments`}
                                </p>
                                <p className="text-white/40 text-sm">
                                    {searchQuery ? 'Try a different search' : 'Create one to get started'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredAssignments.map((assignment, index) => {
                                    const completionPercent = assignment.total_students > 0
                                        ? Math.round((assignment.completion_count / assignment.total_students) * 100)
                                        : 0;

                                    return (
                                        <motion.div
                                            key={assignment.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link href={`/mobile-assignment/${assignment.id}`}>
                                                <div className="bg-[#24243e] rounded-2xl border border-white/10 p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-white text-lg mb-1">{assignment.title}</h3>
                                                            <div className="flex items-center gap-2 text-sm text-white/50">
                                                                <BookOpen className="w-3 h-3" />
                                                                <span>{assignment.class_name}</span>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 text-white/30" />
                                                    </div>

                                                    <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {assignment.due_date
                                                                ? new Date(assignment.due_date).toLocaleDateString('en-GB')
                                                                : 'No due date'
                                                            }
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <CheckCircle className="w-4 h-4" />
                                                            {assignment.completion_count}/{assignment.total_students} done
                                                        </span>
                                                    </div>

                                                    {/* Progress bar */}
                                                    <div>
                                                        <div className="flex justify-between text-xs text-white/40 mb-1">
                                                            <span>Completion</span>
                                                            <span>{completionPercent}%</span>
                                                        </div>
                                                        <div className="w-full bg-white/10 rounded-full h-1.5">
                                                            <div
                                                                className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
                                                                style={{ width: `${completionPercent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </PullToRefresh>
        </MobilePageWrapper>
    );
}

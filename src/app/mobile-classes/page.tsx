'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BookOpen, Plus, ChevronRight, Search, Trash2,
    School, AlertCircle, Clock
} from 'lucide-react';
import { useAuth, supabaseBrowser } from '../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MobilePageWrapper, PullToRefresh } from '../../components/capacitor';
import { useCapacitor } from '../../components/capacitor/CapacitorProvider';

interface ClassData {
    id: string;
    name: string;
    year_group: string;
    created_at: string;
    student_count: number;
    pending_assignments: number;
}

export default function MobileClassesPage() {
    const { user, isTeacher } = useAuth();
    const { isNativeApp } = useCapacitor();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newClass, setNewClass] = useState({ name: '', year_group: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && isTeacher) {
            fetchClasses();
        }
    }, [user, isTeacher]);

    const fetchClasses = async () => {
        if (!user) return;

        try {
            setError('');
            // Fetch classes
            const { data: classesData, error: classError } = await supabaseBrowser
                .from('classes')
                .select('id, name, year_group, created_at')
                .eq('teacher_id', user.id)
                .order('created_at', { ascending: false });

            if (classError) throw classError;

            if (!classesData || classesData.length === 0) {
                setClasses([]);
                setLoading(false);
                return;
            }

            const classIds = classesData.map(c => c.id);

            // Fetch enrollment counts
            const { data: enrollments } = await supabaseBrowser
                .from('class_enrollments')
                .select('class_id')
                .in('class_id', classIds)
                .eq('status', 'active');

            // Fetch pending assignments
            const { data: assignments } = await supabaseBrowser
                .from('assignments')
                .select('class_id')
                .in('class_id', classIds)
                .eq('status', 'active');

            // Count per class
            const studentCounts: Record<string, number> = {};
            const assignmentCounts: Record<string, number> = {};

            (enrollments || []).forEach(e => {
                studentCounts[e.class_id] = (studentCounts[e.class_id] || 0) + 1;
            });

            (assignments || []).forEach(a => {
                assignmentCounts[a.class_id] = (assignmentCounts[a.class_id] || 0) + 1;
            });

            const processedClasses: ClassData[] = classesData.map(c => ({
                id: c.id,
                name: c.name,
                year_group: c.year_group || '',
                created_at: c.created_at,
                student_count: studentCounts[c.id] || 0,
                pending_assignments: assignmentCounts[c.id] || 0,
            }));

            setClasses(processedClasses);
        } catch (err: any) {
            console.error('Error fetching classes:', err);
            setError('Could not load classes');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchClasses();
    };

    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setIsSubmitting(true);
            setError('');

            if (!newClass.name.trim() || !newClass.year_group.trim()) {
                throw new Error('Please fill in all fields');
            }

            const { data, error } = await supabaseBrowser
                .from('classes')
                .insert([{
                    name: newClass.name,
                    year_group: newClass.year_group,
                    teacher_id: user.id,
                    level: 'beginner',
                    created_at: new Date().toISOString()
                }])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                setClasses([{
                    ...data[0],
                    student_count: 0,
                    pending_assignments: 0
                }, ...classes]);
                setNewClass({ name: '', year_group: '' });
                setShowCreateModal(false);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create class');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClass = async (classId: string) => {
        if (!confirm('Delete this class? This will also remove all assignments and enrollments.')) {
            return;
        }

        try {
            await supabaseBrowser.from('class_enrollments').delete().eq('class_id', classId);
            await supabaseBrowser.from('assignments').delete().eq('class_id', classId);
            await supabaseBrowser.from('classes').delete().eq('id', classId);

            setClasses(classes.filter(c => c.id !== classId));
        } catch (err) {
            console.error('Error deleting class:', err);
            setError('Failed to delete class');
        }
    };

    const filteredClasses = classes.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // For web, redirect to normal classes page
    if (!isNativeApp) {
        router.replace('/dashboard/classes');
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
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">My Classes</h1>
                                    <p className="text-white/50 text-sm">{classes.length} classes</p>
                                </div>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search classes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-[#24243e] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50"
                            />
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-white/40" />
                        </div>

                        {/* Create Button */}
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowCreateModal(true)}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-semibold text-white flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Class
                        </motion.button>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mx-5 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {/* Classes List */}
                    <div className="px-5">
                        {loading && !refreshing ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : filteredClasses.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <BookOpen className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-white/60 mb-2">
                                    {searchQuery ? 'No classes found' : 'No classes yet'}
                                </p>
                                <p className="text-white/40 text-sm">
                                    {searchQuery ? 'Try a different search' : 'Create your first class above'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredClasses.map((cls, index) => (
                                    <motion.div
                                        key={cls.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-[#24243e] rounded-2xl border border-white/10 overflow-hidden"
                                    >
                                        <Link href={`/mobile-class/${cls.id}`}>
                                            <div className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                            <BookOpen className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-white text-lg">{cls.name}</h3>
                                                            <p className="text-white/50 text-sm">Year {cls.year_group}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-white/30" />
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-white/60">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {cls.student_count} students
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {cls.pending_assignments} active
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Delete action */}
                                        <div className="px-4 pb-4 flex justify-end">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteClass(cls.id);
                                                }}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </PullToRefresh>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-[#24243e] rounded-t-3xl p-6 pb-10"
                            style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 20px) + 24px)' }}
                        >
                            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Create New Class
                            </h2>

                            <form onSubmit={handleCreateClass} className="space-y-4">
                                <div>
                                    <label className="text-sm text-white/70 mb-2 block">Class Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newClass.name}
                                        onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                                        placeholder="e.g., French Beginners"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-white/70 mb-2 block">Year Group</label>
                                    <input
                                        type="text"
                                        required
                                        value={newClass.year_group}
                                        onChange={(e) => setNewClass({ ...newClass, year_group: e.target.value })}
                                        placeholder="e.g., Year 7"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 py-3 border border-white/20 rounded-xl text-white font-medium"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-semibold text-white disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MobilePageWrapper>
    );
}

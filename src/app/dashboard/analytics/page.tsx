'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useSupabase } from '../../../components/supabase/SupabaseProvider';
import { ClassSummaryDashboard } from '../../../components/dashboard/ClassSummaryDashboard';
import { MultiClassOverview } from '../../../components/dashboard/MultiClassOverview';
import TeacherVocabularyAnalyticsDashboard from '../../../components/teacher/TeacherVocabularyAnalyticsDashboard';
import TeacherGrammarAnalyticsDashboard from '../../../components/teacher/TeacherGrammarAnalyticsDashboard';
import {
    Users,
    BookOpen,
    Brain,
    BarChart3,
    GraduationCap,
    Target,
    Filter,
    School,
    ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';

interface ClassOption {
    id: string;
    name: string;
}

type TabType = 'overview' | 'vocabulary' | 'grammar';
type ViewScope = 'my' | 'school';

export default function AnalyticsHubPage() {
    const { user } = useAuth();
    const { supabase } = useSupabase();
    const searchParams = useSearchParams();
    const router = useRouter();

    // State
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('all'); // Default to All Classes view
    const [viewScope, setViewScope] = useState<ViewScope>('my');
    const [schoolCode, setSchoolCode] = useState<string | null>(null);
    const [hasSchoolAccess, setHasSchoolAccess] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load user profile and classes
    useEffect(() => {
        if (user) {
            loadInitialData();
        }
    }, [user]);

    // Handle URL query params for tab selection
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'vocabulary' || tab === 'grammar' || tab === 'overview') {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Reload classes when scope changes
    useEffect(() => {
        if (user && !loading) {
            loadClasses();
        }
    }, [viewScope]);

    const loadInitialData = async () => {
        try {
            setLoading(true);

            // 1. Get Teacher Profile for School Code
            const { data: profileData } = await supabase
                .from('user_profiles')
                .select('school_code, school_initials, is_school_owner, school_owner_id')
                .eq('user_id', user!.id)
                .single();

            if (profileData) {
                const code = profileData.school_code || profileData.school_initials;
                setSchoolCode(code);
                setHasSchoolAccess(!!(profileData.is_school_owner || profileData.school_owner_id || code));
            }

            // 2. Load Classes (Initial load with default scope 'my')
            await loadClasses();

        } catch (error) {
            console.error('Error loading analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadClasses = async () => {
        try {
            let data;

            if (viewScope === 'school' && schoolCode) {
                // School Scope: fetch classes via API (easier than complex RLS join client-side)
                const response = await fetch('/api/classes/school-filtered?scope=school');
                const result = await response.json();
                if (result.success) {
                    data = result.classes.map((c: any) => ({ id: c.id, name: c.name }));
                }
            } else {
                // My Classes: fetch directly
                const { data: myClasses, error } = await supabase
                    .from('classes')
                    .select('id, name')
                    .eq('teacher_id', user!.id)
                    .order('name');

                if (error) throw error;
                data = myClasses;
            }

            setClasses(data || []);
        } catch (error) {
            console.error('Error loading classes:', error);
        }
    };

    const currentClassId = selectedClassId === 'all' ? undefined : selectedClassId;

    // Render Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading Analytics Hub...</p>
                </div>
            </div>
        );
    }

    // Render Auth Required
    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Login Required</h2>
                    <p className="text-slate-600">Please sign in to view analytics.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Header & Controls */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        {/* Title & Class Info */}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                                <BarChart3 className="mr-2 h-6 w-6 text-indigo-600" />
                                Analytics Hub
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                {selectedClassId === 'all'
                                    ? `Viewing all ${classes.length} class${classes.length !== 1 ? 'es' : ''}`
                                    : `Viewing: ${classes.find(c => c.id === selectedClassId)?.name || 'Selected class'}`}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-wrap items-center gap-3">

                            {/* Scope Toggle */}
                            {hasSchoolAccess && (
                                <div className="bg-slate-100 p-1 rounded-lg flex items-center">
                                    <button
                                        onClick={() => setViewScope('my')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewScope === 'my'
                                            ? 'bg-white text-indigo-700 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        My Classes
                                    </button>
                                    <button
                                        onClick={() => setViewScope('school')}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${viewScope === 'school'
                                            ? 'bg-white text-indigo-700 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        School
                                    </button>
                                </div>
                            )}

                            {/* Class Selector */}
                            <div className="relative">
                                <select
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e.target.value)}
                                    className="pl-3 pr-10 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer min-w-[180px]"
                                >
                                    <option value="all">All Classes</option>
                                    {classes.length === 0 ? (
                                        <option value="" disabled>No classes found</option>
                                    ) : (
                                        classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))
                                    )}
                                </select>
                                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex items-center space-x-1 mt-6 border-b border-slate-200">
                        <TabButton
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            icon={<Target className="h-4 w-4" />}
                            label="Class Pulse"
                        />
                        <TabButton
                            active={activeTab === 'vocabulary'}
                            onClick={() => setActiveTab('vocabulary')}
                            icon={<BookOpen className="h-4 w-4" />}
                            label="Vocabulary"
                        />
                        <TabButton
                            active={activeTab === 'grammar'}
                            onClick={() => setActiveTab('grammar')}
                            icon={<Brain className="h-4 w-4" />}
                            label="Grammar"
                        />
                    </div>

                </div>
            </div>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AnimatePresence mode='wait'>

                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {selectedClassId === 'all' ? (
                                <MultiClassOverview
                                    teacherId={user.id}
                                    viewScope={viewScope}
                                    schoolCode={schoolCode || undefined}
                                    onClassClick={(classId) => setSelectedClassId(classId)}
                                />
                            ) : (
                                <ClassSummaryDashboard
                                    teacherId={user.id}
                                    classId={currentClassId}
                                    viewScope={viewScope}
                                    schoolCode={schoolCode || undefined}
                                    onStudentClick={(id) => router.push(`/dashboard/progress/student/${id}`)}
                                />
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'vocabulary' && (
                        <motion.div
                            key="vocabulary"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TeacherVocabularyAnalyticsDashboard
                                classId={currentClassId}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'grammar' && (
                        <motion.div
                            key="grammar"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <TeacherGrammarAnalyticsDashboard
                                classId={currentClassId}
                            />
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

        </div>
    );
}

// Helper Components
function TabButton({
    active,
    onClick,
    icon,
    label
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <button
            onClick={onClick}
            className={`
        relative flex items-center px-6 py-3 text-sm font-medium transition-colors
        ${active ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
      `}
        >
            <span className="mr-2">{icon}</span>
            {label}
            {active && (
                <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
            )}
        </button>
    );
}

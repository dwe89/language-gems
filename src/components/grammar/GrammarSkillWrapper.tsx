'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, Brain, Target, CheckCircle, Lock,
    ChevronRight, Star, Trophy, ArrowLeft
} from 'lucide-react';
import { GemButton } from '@/components/ui/GemTheme';
import confetti from 'canvas-confetti';

interface TopicStepProgress {
    lesson_completed: boolean;
    practice_completed: boolean;
    test_completed: boolean;
    topic_mastery_level: string;
}

interface GrammarSkillWrapperProps {
    children: React.ReactNode;
    topicId?: string;
    assignmentId: string;
    currentStep: 'lesson' | 'practice' | 'test';
    language: string;
    category: string;
    topicSlug?: string;
    topic?: string;
    topicTitle?: string;
}

export default function GrammarSkillWrapper({
    children,
    topicId,
    assignmentId,
    currentStep,
    language,
    category,
    topicSlug,
    topic,
    topicTitle
}: GrammarSkillWrapperProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [progress, setProgress] = useState<TopicStepProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [localTopicId, setLocalTopicId] = useState<string | null>(topicId || null);

    // Poll for progress updates
    // If we don't have a topicId, resolve it from slug/category/language
    useEffect(() => {
        if (localTopicId) return; // already have it

        const resolveTopicId = async () => {
            try {
                // derive slug from props or pathname fallback
                const slugFromPath = pathname ? pathname.split('/').filter(Boolean).pop()?.split('?')[0] : undefined;
                const slug = topicSlug || topic || slugFromPath;

                // Convert URL language format to database language code
                const languageCodeMap: Record<string, string> = {
                    'spanish': 'es',
                    'french': 'fr',
                    'german': 'de'
                };
                const dbLanguageCode = language ? (languageCodeMap[language.toLowerCase()] || language) : undefined;

                if (!slug) return;

                const { data, error } = await supabase
                    .from('grammar_topics')
                    .select('id')
                    .eq('slug', slug)
                    .eq('category', category)
                    .eq('language', dbLanguageCode)
                    .maybeSingle();

                if (data?.id) {
                    setLocalTopicId(data.id);
                } else {
                    // Set a placeholder to stop retrying
                    setLocalTopicId('__no_topic_found__');
                }
            } catch (err) {
                console.error('Error resolving topic id:', err);
            }
        };

        resolveTopicId();
    }, [localTopicId, topicId, topicSlug, topic, category, language, supabase, pathname]);

    // Poll for progress updates once we have a topic id
    useEffect(() => {
        if (!localTopicId || localTopicId === '__no_topic_found__') return;

        const fetchProgress = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('grammar_topic_step_progress')
                    .select('*')
                    .eq('assignment_id', assignmentId)
                    .eq('student_id', user.id)
                    .eq('topic_id', localTopicId)
                    .maybeSingle();

                if (data) {
                    setProgress(data as TopicStepProgress);
                } else {
                    setProgress({
                        lesson_completed: false,
                        practice_completed: false,
                        test_completed: false,
                        topic_mastery_level: 'not_started'
                    });
                }
            } catch (error) {
                console.error('Error fetching progress:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
        const interval = setInterval(fetchProgress, 5000);
        return () => clearInterval(interval);
    }, [assignmentId, localTopicId, supabase]);

    const steps = [
        { id: 'lesson', label: 'Lesson', icon: BookOpen, path: '' },
        { id: 'practice', label: 'Practice', icon: Brain, path: '/practice' },
        { id: 'test', label: 'Test', icon: Target, path: '/test' }
    ];

    const handleNavigation = (stepId: string, path: string) => {
        if (loading) return;

        // Logic for locking steps
        if (stepId === 'practice' && !progress?.lesson_completed) {
            alert('Please complete the lesson first!');
            return;
        }
        if (stepId === 'test' && !progress?.practice_completed) {
            alert('Please complete the practice first!');
            return;
        }

        const modeParam = searchParams.get('mode') === 'assignment' ? '?mode=assignment&assignment=' + assignmentId : '';
        // Preserve other params if needed
        const previewParam = searchParams.get('preview') ? '&preview=true' : '';

        const slug = topicSlug || topic || '';
        router.push(`/grammar/${language}/${category}/${slug}${path}${modeParam}${previewParam}`);
    };

    const handleExit = () => {
        router.push(`/student-dashboard/assignments/${assignmentId}`);
    };

    const handleMarkComplete = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Determine which field to update based on current step
            const updateField = currentStep === 'lesson' ? 'lesson_completed' :
                currentStep === 'practice' ? 'practice_completed' :
                    'test_completed';

            // First, check if record exists
            const tId = localTopicId;
            if (!tId || tId === '__no_topic_found__') {
                console.warn('⚠️ Topic not in database. Skipping progress tracking but allowing navigation.');
                // Still return to assignment page
                setTimeout(() => {
                    router.push(`/student-dashboard/assignments/${assignmentId}`);
                }, 100);
                return;
            }

            const { data: existingRecord } = await supabase
                .from('grammar_topic_step_progress')
                .select('*')
                .eq('assignment_id', assignmentId)
                .eq('student_id', user.id)
                .eq('topic_id', tId)
                .maybeSingle();

            if (existingRecord) {
                // Update existing record
                const { error } = await supabase
                    .from('grammar_topic_step_progress')
                    .update({
                        [updateField]: true,
                        updated_at: new Date().toISOString()
                    })
                    .eq('assignment_id', assignmentId)
                    .eq('student_id', user.id)
                    .eq('topic_id', tId);

                if (error) {
                    console.error('Error updating progress:', error);
                    alert('Failed to save progress. Please try again.');
                    return;
                }
            } else {
                // Create new record
                const { error } = await supabase
                    .from('grammar_topic_step_progress')
                    .insert({
                        assignment_id: assignmentId,
                        student_id: user.id,
                        topic_id: tId,
                        lesson_completed: currentStep === 'lesson',
                        practice_completed: currentStep === 'practice',
                        test_completed: currentStep === 'test',
                        topic_mastery_level: 'in_progress',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                if (error) {
                    console.error('Error creating progress:', error);
                    alert('Failed to save progress. Please try again.');
                    return;
                }
            }

            console.log(`✅ Marked ${currentStep} as complete for topic ${topicId}`);

            // Return to assignment page to show updated progress in wrapper modal
            setTimeout(() => {
                router.push(`/student-dashboard/assignments/${assignmentId}`);
            }, 500);
        } catch (error) {
            console.error('Error in handleMarkComplete:', error);
            alert('Failed to save progress. Please try again.');
        }
    };

    // Celebration effect on mastery
    useEffect(() => {
        if (progress?.test_completed && currentStep === 'test') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [progress?.test_completed, currentStep]);

    console.log('🎯 [GRAMMAR WRAPPER] Rendering with:', {
        currentStep,
        loading,
        progress,
        topicId: localTopicId,
        assignmentId
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExit}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 hidden md:block">
                                {(topicTitle || topicSlug || topic || '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
                                <Star className="w-3 h-3 fill-current" />
                                Assignment Mode
                            </div>
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center gap-1 md:gap-4">
                        {steps.map((step, index) => {
                            const isCurrent = step.id === currentStep;
                            const isCompleted = step.id === 'lesson' ? progress?.lesson_completed :
                                step.id === 'practice' ? progress?.practice_completed :
                                    progress?.test_completed;
                            const isLocked = step.id === 'practice' ? !progress?.lesson_completed :
                                step.id === 'test' ? !progress?.practice_completed : false;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => handleNavigation(step.id, step.path)}
                                        disabled={isLocked}
                                        className={`
                      relative group flex items-center gap-2 px-3 py-1.5 rounded-full transition-all
                      ${isCurrent ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-100 text-slate-600'}
                      ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                                    >
                                        <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs
                      ${isCurrent ? 'bg-indigo-500' : isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-200'}
                    `}>
                                            {isCompleted && !isCurrent ? <CheckCircle className="w-4 h-4" /> :
                                                isLocked ? <Lock className="w-3 h-3" /> :
                                                    <step.icon className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className={`text-sm font-medium ${isCurrent ? '' : 'hidden md:block'}`}>
                                            {step.label}
                                        </span>
                                    </button>

                                    {index < steps.length - 1 && (
                                        <div className="w-4 md:w-8 h-px bg-gray-200 mx-1 md:mx-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="w-8" /> {/* Spacer for balance */}
                </div>
            </div>

            {/* Main Content */}
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 max-w-5xl mx-auto w-full p-2 md:p-4 pb-20"
            >
                {children}
            </motion.div>

            {/* Footer Navigation - Show only for lesson step */}
            {currentStep === 'lesson' && (
                <div
                    className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-indigo-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-[9999]"
                    style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999 }}
                >
                    <div className="max-w-5xl mx-auto px-4 py-2">
                        {/* Action Buttons */}
                        <div className="flex gap-3 items-center">
                            {/* Back Button */}
                            <button
                                onClick={handleExit}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-gray-700 transition-colors flex items-center gap-2 text-sm"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Back</span>
                            </button>

                            {!progress?.lesson_completed ? (
                                <button
                                    onClick={handleMarkComplete}
                                    className="flex-1 py-2 px-4 text-base font-bold bg-gradient-to-r from-green-500 to-emerald-600 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Complete Lesson & Continue
                                </button>
                            ) : (
                                <>
                                    {/* Return to Activities */}
                                    <button
                                        onClick={handleExit}
                                        className="px-4 py-2 font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                        Return to Activities
                                    </button>
                                    {/* Continue to Practice */}
                                    <button
                                        onClick={() => handleNavigation('practice', '/practice')}
                                        className="flex-1 py-2 px-4 text-base font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
                                    >
                                        <Brain className="w-5 h-5" />
                                        Continue to Practice
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

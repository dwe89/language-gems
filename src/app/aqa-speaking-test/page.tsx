'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
    Mic, 
    ArrowLeft, 
    GraduationCap, 
    Languages, 
    Play, 
    Clock, 
    CheckCircle,
    Volume2,
    AlertCircle,
    Loader2 
} from 'lucide-react';
import { SpeakingAssessment } from '@/components/assessments/speaking';
import { SpeakingAssessmentService, type SpeakingAssessmentDefinition, type Language, type Tier, type SpeakingResult } from '@/services/speakingAssessmentService';

// =====================================================
// Selection Screen Component
// =====================================================

function SelectionScreen({ 
    onStart 
}: { 
    onStart: (language: Language, tier: Tier, identifier: string) => void 
}) {
    const [selectedLanguage, setSelectedLanguage] = useState<Language>('es');
    const [selectedTier, setSelectedTier] = useState<Tier>('foundation');
    const [availableAssessments, setAvailableAssessments] = useState<SpeakingAssessmentDefinition[]>([]);
    const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMicrophone, setHasMicrophone] = useState<boolean | null>(null);

    const languages: { value: Language; label: string; flag: string }[] = [
        { value: 'es', label: 'Spanish', flag: '🇪🇸' },
        { value: 'fr', label: 'French', flag: '🇫🇷' },
        { value: 'de', label: 'German', flag: '🇩🇪' },
    ];

    const tiers: { value: Tier; label: string; description: string }[] = [
        { value: 'foundation', label: 'Foundation', description: '7-12 minutes' },
        { value: 'higher', label: 'Higher', description: '10-12 minutes' },
    ];

    // Check microphone availability
    useEffect(() => {
        const checkMicrophone = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const hasAudioInput = devices.some(device => device.kind === 'audioinput');
                setHasMicrophone(hasAudioInput);
            } catch (error) {
                setHasMicrophone(false);
            }
        };
        checkMicrophone();
    }, []);

    // Load available assessments
    useEffect(() => {
        const loadAssessments = async () => {
            setIsLoading(true);
            try {
                const service = new SpeakingAssessmentService();
                const assessments = await service.getAssessmentsByLevel(selectedTier, selectedLanguage);
                setAvailableAssessments(assessments);
                if (assessments.length > 0) {
                    setSelectedAssessment(assessments[0].identifier);
                } else {
                    setSelectedAssessment(null);
                }
            } catch (error) {
                console.error('Error loading assessments:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadAssessments();
    }, [selectedLanguage, selectedTier]);

    const handleStart = () => {
        if (selectedAssessment) {
            onStart(selectedLanguage, selectedTier, selectedAssessment);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-teal-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl w-full relative z-10"
            >
                {/* Back button */}
                <Link
                    href="/assessments"
                    className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Assessments
                </Link>

                {/* Main Content Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-tr from-red-400 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg"
                    >
                        <Mic className="h-10 w-10 text-white" />
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight text-center">
                        AQA Speaking Assessment
                    </h1>
                    <p className="text-blue-200 text-center mb-8">
                        AI-powered speaking practice with instant feedback
                    </p>

                    {/* Microphone Warning */}
                    {hasMicrophone === false && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-200 font-medium">No microphone detected</p>
                                <p className="text-red-300/80 text-sm mt-1">
                                    Please connect a microphone to use the speaking assessment.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Language Selection */}
                    <div className="mb-6">
                        <label className="block text-white/80 text-sm font-medium mb-3">
                            Select Language
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {languages.map((lang) => (
                                <button
                                    key={lang.value}
                                    onClick={() => setSelectedLanguage(lang.value)}
                                    className={`p-4 rounded-xl border-2 transition-all ${
                                        selectedLanguage === lang.value
                                            ? 'border-white bg-white/20 text-white'
                                            : 'border-white/20 hover:border-white/40 text-white/70'
                                    }`}
                                >
                                    <span className="text-2xl mb-2 block">{lang.flag}</span>
                                    <span className="font-medium">{lang.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tier Selection */}
                    <div className="mb-6">
                        <label className="block text-white/80 text-sm font-medium mb-3">
                            Select Tier
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {tiers.map((tier) => (
                                <button
                                    key={tier.value}
                                    onClick={() => setSelectedTier(tier.value)}
                                    className={`p-4 rounded-xl border-2 transition-all ${
                                        selectedTier === tier.value
                                            ? 'border-white bg-white/20 text-white'
                                            : 'border-white/20 hover:border-white/40 text-white/70'
                                    }`}
                                >
                                    <GraduationCap className="w-6 h-6 mb-2 mx-auto" />
                                    <span className="font-medium block">{tier.label}</span>
                                    <span className="text-sm opacity-70">{tier.description}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Assessment Selection */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    ) : availableAssessments.length > 0 ? (
                        <div className="mb-8">
                            <label className="block text-white/80 text-sm font-medium mb-3">
                                Select Paper
                            </label>
                            <div className="space-y-2">
                                {availableAssessments.map((assessment) => (
                                    <button
                                        key={assessment.id}
                                        onClick={() => setSelectedAssessment(assessment.identifier)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                            selectedAssessment === assessment.identifier
                                                ? 'border-white bg-white/20'
                                                : 'border-white/20 hover:border-white/40'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-white">{assessment.title}</h3>
                                                <p className="text-sm text-white/60 mt-1">
                                                    {assessment.total_marks} marks • {assessment.time_limit_minutes} minutes
                                                </p>
                                            </div>
                                            {selectedAssessment === assessment.identifier && (
                                                <CheckCircle className="w-6 h-6 text-green-400" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 p-6 bg-yellow-500/20 border border-yellow-400/30 rounded-xl text-center">
                            <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                            <p className="text-yellow-200">
                                No assessments available for this combination yet.
                            </p>
                            <p className="text-yellow-300/70 text-sm mt-1">
                                Check back soon or try a different tier/language.
                            </p>
                        </div>
                    )}

                    {/* Exam Info */}
                    <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                        <div className="p-3 bg-white/5 rounded-xl">
                            <Clock className="w-5 h-5 text-blue-300 mx-auto mb-1" />
                            <p className="text-sm text-white/70">
                                {selectedTier === 'higher' ? '10-12' : '7-12'} min
                            </p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl">
                            <Languages className="w-5 h-5 text-purple-300 mx-auto mb-1" />
                            <p className="text-sm text-white/70">4 sections</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl">
                            <Volume2 className="w-5 h-5 text-green-300 mx-auto mb-1" />
                            <p className="text-sm text-white/70">AI graded</p>
                        </div>
                    </div>

                    {/* Start Button */}
                    <button
                        onClick={handleStart}
                        disabled={!selectedAssessment || hasMicrophone === false}
                        className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600
                                 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed
                                 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-[1.02]
                                 shadow-lg flex items-center justify-center gap-2"
                    >
                        <Play className="w-6 h-6" />
                        Start Speaking Assessment
                    </button>

                    {/* Instructions */}
                    <div className="mt-6 p-4 bg-white/5 rounded-xl">
                        <h4 className="text-white font-medium mb-2">Before you begin:</h4>
                        <ul className="space-y-1 text-sm text-white/70">
                            <li>• Ensure your microphone is working properly</li>
                            <li>• Find a quiet place to record your responses</li>
                            <li>• You can verify and edit transcriptions before grading</li>
                            <li>• Each question is graded immediately with feedback</li>
                        </ul>
                    </div>
                </div>

                <p className="mt-6 text-white/40 text-sm text-center">
                    Part of the LanguageGems Premium Suite
                </p>
            </motion.div>
        </div>
    );
}

// =====================================================
// Results Screen Component
// =====================================================

function ResultsScreen({ result, onRetry }: { result: SpeakingResult; onRetry: () => void }) {
    const router = useRouter();
    const percentage = result.percentage_score;

    const getGradeColor = () => {
        if (percentage >= 70) return 'text-green-400';
        if (percentage >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getGradeLabel = () => {
        if (result.gcse_grade) return `Grade ${result.gcse_grade}`;
        if (percentage >= 90) return 'Excellent!';
        if (percentage >= 70) return 'Good';
        if (percentage >= 50) return 'Pass';
        return 'Needs Improvement';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-teal-800 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-white mb-2">Assessment Complete!</h1>
                    <p className="text-blue-200">Here are your results</p>
                </div>

                {/* Main Score */}
                <div className="text-center mb-8">
                    <div className={`text-6xl font-bold ${getGradeColor()}`}>
                        {Math.round(percentage)}%
                    </div>
                    <div className="text-xl text-white mt-2">{getGradeLabel()}</div>
                    <div className="text-white/60 mt-1">
                        {result.total_score} / {result.max_score} marks
                    </div>
                </div>

                {/* Section Breakdown */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {result.roleplay_max > 0 && (
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-white/60 text-sm">Roleplay</p>
                            <p className="text-white font-bold">{result.roleplay_score}/{result.roleplay_max}</p>
                        </div>
                    )}
                    {result.reading_aloud_max > 0 && (
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-white/60 text-sm">Reading Aloud</p>
                            <p className="text-white font-bold">{result.reading_aloud_score}/{result.reading_aloud_max}</p>
                        </div>
                    )}
                    {result.photocard_max > 0 && (
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-white/60 text-sm">Photocard</p>
                            <p className="text-white font-bold">{result.photocard_score}/{result.photocard_max}</p>
                        </div>
                    )}
                    {result.general_conversation_max > 0 && (
                        <div className="p-4 bg-white/5 rounded-xl">
                            <p className="text-white/60 text-sm">Conversation</p>
                            <p className="text-white font-bold">{result.general_conversation_score}/{result.general_conversation_max}</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={onRetry}
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => router.push('/assessments')}
                        className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                    >
                        Back to Assessments
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// =====================================================
// Main Page Component
// =====================================================

type PageState = 'selection' | 'assessment' | 'results';

export default function AqaSpeakingTestPage() {
    const [pageState, setPageState] = useState<PageState>('selection');
    const [assessmentParams, setAssessmentParams] = useState<{
        language: Language;
        tier: Tier;
        identifier: string;
    } | null>(null);
    const [completedResult, setCompletedResult] = useState<SpeakingResult | null>(null);

    const handleStart = (language: Language, tier: Tier, identifier: string) => {
        setAssessmentParams({ language, tier, identifier });
        setPageState('assessment');
    };

    const handleComplete = (result: SpeakingResult) => {
        setCompletedResult(result);
        setPageState('results');
    };

    const handleRetry = () => {
        setCompletedResult(null);
        setPageState('selection');
    };

    if (pageState === 'selection') {
        return <SelectionScreen onStart={handleStart} />;
    }

    if (pageState === 'assessment' && assessmentParams) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => {
                                    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
                                        setPageState('selection');
                                    }
                                }}
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span>Exit Assessment</span>
                            </button>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 rounded-full">
                                    <Mic className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    <span className="text-sm font-medium text-red-700 dark:text-red-300">
                                        Speaking Exam
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
                    <SpeakingAssessment
                        language={assessmentParams.language}
                        level={assessmentParams.tier}
                        identifier={assessmentParams.identifier}
                        onComplete={handleComplete}
                    />
                </main>
            </div>
        );
    }

    if (pageState === 'results' && completedResult) {
        return <ResultsScreen result={completedResult} onRetry={handleRetry} />;
    }

    return <SelectionScreen onStart={handleStart} />;
}

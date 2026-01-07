'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, CheckCircle, XCircle, Clock, Target, TrendingUp,
    Award, AlertCircle, BookOpen, FileText, Brain, Grid3X3,
    MessageSquare, Timer, Mail, ListChecks, Heading, Edit3,
    BarChart3, PieChart, Activity
} from 'lucide-react';
import { supabaseBrowser } from '@/components/auth/AuthProvider';

interface AssessmentResultDetail {
    resultId?: string; // ID of the result record for updates
    assessmentType: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    passed: boolean;
    completedAt: string;
    questionResults?: Array<{
        questionId: string;
        questionText?: string;
        userAnswer: string | string[];
        correctAnswer: string | string[];
        isCorrect: boolean;
        points: number;
        maxPoints?: number;
        timeSpent?: number;
        manuallyMarkedCorrect?: boolean;
        originalIsCorrect?: boolean;
        manuallyOverriddenBy?: string;
        manuallyOverriddenAt?: string;
    }>;
    // Reading comprehension specific
    textId?: string;
    textTitle?: string;
    // GCSE assessment specific
    rawScore?: number;
    maxScore?: number;
    gcseGrade?: number;
    performanceByQuestionType?: Record<string, any>;
    performanceByTheme?: Record<string, any>;
    performanceByTopic?: Record<string, any>;
}

interface AssessmentResultsDetailViewProps {
    assignmentId: string;
    studentId?: string;
    studentName?: string;
    onBack: () => void;
    viewMode?: 'teacher' | 'student';
}

const formatAnswer = (answer: string | string[] | undefined | null) => {
    if (answer === undefined || answer === null || answer === '') return '(No answer)';
    
    if (Array.isArray(answer)) {
        return answer.join(', ');
    }

    // Try to parse as JSON if it looks like an object/array
    if (typeof answer === 'string' && (answer.trim().startsWith('{') || answer.trim().startsWith('['))) {
        try {
            const parsed = JSON.parse(answer);
            if (typeof parsed === 'object' && parsed !== null) {
                // Check if it's a simple key-value map
                const entries = Object.entries(parsed);
                if (entries.length > 0) {
                     return (
                        <div className="flex flex-col gap-1 mt-1 pl-2 border-l-2 border-slate-200">
                            {entries.map(([key, value]) => {
                                // Check if key is a number (index)
                                const displayKey = !isNaN(Number(key)) 
                                    ? `Q${Number(key) + 1}` 
                                    : key;
                                return (
                                    <div key={key} className="flex items-center text-sm">
                                        <span className="font-medium mr-2 min-w-[20px]">{displayKey}:</span>
                                        <span>{String(value)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }
            }
        } catch (e) {
            // Not valid JSON, fall through to return string
        }
    }

    return answer;
};

const formatQuestionType = (type: string) => {
    return type
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const getQuestionTypeIcon = (type: string) => {
    const iconMap: Record<string, any> = {
        'translation': BookOpen,
        'student-grid': Grid3X3,
        'open-response': MessageSquare,
        'time-sequence': Timer,
        'letter-matching': Mail,
        'multiple-choice': ListChecks,
        'headline-matching': Heading,
        'sentence-completion': Edit3,
        'vocabulary': BookOpen,
        'grammar': FileText,
        'listening': Activity,
        'reading': BookOpen
    };
    return iconMap[type] || BarChart3;
};

const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600 bg-green-100';
    if (accuracy >= 60) return 'text-blue-600 bg-blue-100';
    if (accuracy >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
};

export function AssessmentResultsDetailView({
    assignmentId,
    studentId,
    studentName,
    onBack,
    viewMode = 'teacher'
}: AssessmentResultsDetailViewProps) {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<AssessmentResultDetail[]>([]);
    const [assignment, setAssignment] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [overrideLoading, setOverrideLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchResults();
    }, [assignmentId, studentId]);

    const handleManualOverride = async (resultId: string, questionId: string, markAsCorrect: boolean) => {
        try {
            setOverrideLoading(questionId);

            console.log('🔄 [MANUAL OVERRIDE]', {
                resultId,
                questionId,
                markAsCorrect
            });

            const supabase = supabaseBrowser;

            // Fetch current result
            const { data: currentResult, error: fetchError } = await supabase
                .from('reading_comprehension_results')
                .select('question_results, total_questions, correct_answers, score')
                .eq('id', resultId)
                .single();

            if (fetchError || !currentResult) {
                throw new Error('Failed to fetch current result');
            }

            // Update question_results with manual override
            let questionResults = currentResult.question_results || [];
            const questionIndex = questionResults.findIndex((q: any) => q.questionId === questionId);

            if (questionIndex === -1) {
                throw new Error('Question not found in results');
            }

            // Store the original isCorrect value if not already stored
            const question = questionResults[questionIndex];
            if (!question.hasOwnProperty('originalIsCorrect')) {
                question.originalIsCorrect = question.isCorrect;
            }

            // Apply manual override
            question.manuallyMarkedCorrect = markAsCorrect;
            question.isCorrect = markAsCorrect;
            question.manuallyOverriddenAt = new Date().toISOString();

            // Recalculate score
            const correctCount = questionResults.filter((q: any) => q.isCorrect).length;
            const totalQuestions = currentResult.total_questions || questionResults.length;
            const newScore = Math.round((correctCount / totalQuestions) * 100);
            const passed = newScore >= 60;

            // Update the result
            const { error: updateError } = await supabase
                .from('reading_comprehension_results')
                .update({
                    question_results: questionResults,
                    correct_answers: correctCount,
                    score: newScore,
                    passed
                })
                .eq('id', resultId);

            if (updateError) {
                console.error('❌ [OVERRIDE ERROR]', updateError);
                throw new Error('Failed to update result');
            }

            // Also update enhanced_game_sessions to keep it in sync
            // Find the latest session for this assignment and student
            const { data: sessionData } = await supabase
                .from('enhanced_game_sessions')
                .select('id')
                .eq('assignment_id', assignmentId)
                .eq('student_id', studentId!)
                .not('ended_at', 'is', null)
                .order('ended_at', { ascending: false })
                .limit(1);

            if (sessionData && sessionData.length > 0) {
                await supabase
                    .from('enhanced_game_sessions')
                    .update({
                        accuracy_percentage: newScore,
                        final_score: newScore
                    })
                    .eq('id', sessionData[0].id);

                console.log('✅ [SYNC] Updated enhanced_game_sessions with new score');
            }

            console.log('✅ [OVERRIDE SUCCESS]', {
                oldScore: currentResult.score,
                newScore,
                correctCount,
                totalQuestions
            });

            // Refresh results to show updated data
            await fetchResults();
        } catch (err) {
            console.error('❌ [OVERRIDE ERROR]', err);
            alert('Failed to update answer: ' + (err as Error).message);
        } finally {
            setOverrideLoading(null);
        }
    };

    const fetchResults = async () => {
        try {
            setLoading(true);
            const supabase = supabaseBrowser;

            console.log('🔍 [DETAIL VIEW] Fetching results for:', {
                assignmentId,
                studentId,
                studentName,
                viewMode
            });

            // Fetch assignment details
            const { data: assignmentData, error: assignmentError } = await supabase
                .from('assignments')
                .select('id, title, game_config')
                .eq('id', assignmentId)
                .single();

            if (assignmentError) throw assignmentError;
            setAssignment(assignmentData);

            console.log('📋 [ASSIGNMENT DATA]', {
                title: assignmentData.title,
                selectedAssessments: assignmentData?.game_config?.assessmentConfig?.selectedAssessments
            });

            const selectedAssessments = assignmentData?.game_config?.assessmentConfig?.selectedAssessments || [];
            const allResults: AssessmentResultDetail[] = [];

            // Fetch results for each assessment type
            for (const assessment of selectedAssessments) {
                const assessmentType = assessment.type || assessment.id;
                console.log('🔍 [FETCHING]', assessmentType, 'for student', studentId);

                switch (assessmentType) {
                    case 'reading-comprehension':
                        const rcResults = await fetchReadingComprehensionResults(supabase, assignmentId, studentId);
                        console.log('📊 [RC RESULTS]', rcResults.length, 'results found');
                        allResults.push(...rcResults);
                        break;
                    case 'gcse-reading':
                        const grResults = await fetchGcseReadingResults(supabase, assignmentId, studentId);
                        console.log('📊 [GR RESULTS]', grResults.length, 'results found');
                        allResults.push(...grResults);
                        break;
                    case 'gcse-listening':
                        const glResults = await fetchGcseListeningResults(supabase, assignmentId, studentId);
                        console.log('📊 [GL RESULTS]', glResults.length, 'results found');
                        allResults.push(...glResults);
                        break;
                    case 'gcse-writing':
                        const gwResults = await fetchGcseWritingResults(supabase, assignmentId, studentId);
                        console.log('📊 [GW RESULTS]', gwResults.length, 'results found');
                        allResults.push(...gwResults);
                        break;
                }
            }

            console.log('✅ [TOTAL RESULTS]', allResults.length);
            setResults(allResults);
        } catch (err) {
            console.error('❌ [ERROR] fetching assessment results:', err);
            setError('Failed to load assessment results');
        } finally {
            setLoading(false);
        }
    };

    const fetchReadingComprehensionResults = async (supabase: any, assignmentId: string, studentId?: string) => {
        console.log('🔍 [RC FETCH] Query params:', { assignmentId, studentId });

        let query = supabase
            .from('reading_comprehension_results')
            .select('*')
            .eq('assignment_id', assignmentId)
            .order('created_at', { ascending: false });

        if (studentId) {
            query = query.eq('user_id', studentId);
        }

        const { data, error } = await query;

        console.log('📊 [RC FETCH] Result:', {
            dataCount: data?.length || 0,
            error: error,
            firstRow: data?.[0]
        });

        if (error) {
            console.error('❌ [RC FETCH] Error fetching reading comprehension results:', error);
            return [];
        }

        // Fetch task titles separately if we have results
        let taskTitles = new Map<string, string>();
        if (data && data.length > 0) {
            const textIds = [...new Set(data.map((row: any) => row.text_id).filter(Boolean))];
            if (textIds.length > 0) {
                const { data: tasks } = await supabase
                    .from('reading_comprehension_tasks')
                    .select('id, title')
                    .in('id', textIds);

                if (tasks) {
                    tasks.forEach((task: any) => {
                        taskTitles.set(task.id, task.title);
                    });
                }
            }
        }

        return (data || []).map((row: any) => ({
            resultId: row.id,
            assessmentType: 'Reading Comprehension',
            score: row.score || 0,
            totalQuestions: row.total_questions || 0,
            correctAnswers: row.correct_answers || 0,
            timeSpent: row.time_spent || 0,
            passed: row.passed || false,
            completedAt: row.completed_at || row.created_at,
            questionResults: row.question_results || [],
            textId: row.text_id,
            textTitle: taskTitles.get(row.text_id) || 'Reading Comprehension Text'
        }));
    };

    const fetchGcseReadingResults = async (supabase: any, assignmentId: string, studentId?: string) => {
        let query = supabase
            .from('aqa_reading_results')
            .select('*')
            .eq('assignment_id', assignmentId)
            .order('created_at', { ascending: false });

        if (studentId) {
            query = query.eq('student_id', studentId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching GCSE reading results:', error);
            return [];
        }

        // Fetch assessment titles
        let assessmentTitles = new Map<string, string>();
        if (data && data.length > 0) {
            const assessmentIds = [...new Set(data.map((row: any) => row.assessment_id).filter(Boolean))];
            if (assessmentIds.length > 0) {
                const { data: assessments } = await supabase
                    .from('aqa_reading_assessments')
                    .select('id, title')
                    .in('id', assessmentIds);

                if (assessments) {
                    assessments.forEach((assessment: any) => {
                        assessmentTitles.set(assessment.id, assessment.title);
                    });
                }
            }
        }

        // Process results with detailed question responses
        const processedResults = await Promise.all((data || []).map(async (row: any) => {
            // Fetch detailed question responses for this result
            const { data: responses, error: responsesError } = await supabase
                .from('aqa_reading_question_responses')
                .select(`
                    question_id,
                    question_number,
                    student_answer,
                    is_correct,
                    points_awarded,
                    marks_possible,
                    time_spent_seconds,
                    question_type,
                    theme,
                    topic
                `)
                .eq('result_id', row.id)
                .order('question_number', { ascending: true });

            if (responsesError) {
                console.error('Error fetching question responses:', responsesError);
            }

            // Fetch question details to get question text
            let questionDetails = new Map();
            if (responses && responses.length > 0) {
                const questionIds = [...new Set(responses.map((r: any) => r.question_id))];
                const { data: questions } = await supabase
                    .from('aqa_reading_questions')
                    .select('id, title, instructions')
                    .in('id', questionIds);

                if (questions) {
                    questions.forEach((q: any) => {
                        questionDetails.set(q.id, { title: q.title, instructions: q.instructions });
                    });
                }
            }

            const questionResults = (responses || []).map((r: any) => {
                const qDetails = questionDetails.get(r.question_id);
                return {
                    questionId: r.question_id,
                    questionText: qDetails?.title || `Question ${r.question_number}`,
                    userAnswer: r.student_answer,
                    correctAnswer: 'See mark scheme', // AQA doesn't provide correct answers
                    isCorrect: r.is_correct,
                    points: r.points_awarded,
                    maxPoints: r.marks_possible,
                    timeSpent: r.time_spent_seconds,
                    questionType: r.question_type,
                    theme: r.theme,
                    topic: r.topic
                };
            });

            return {
                resultId: row.id,
                assessmentType: 'GCSE Reading',
                score: row.percentage_score || 0,
                totalQuestions: row.total_possible_score || 0,
                correctAnswers: row.raw_score || 0,
                timeSpent: row.total_time_seconds || 0,
                passed: (row.percentage_score || 0) >= 60,
                completedAt: row.completion_time || row.created_at,
                rawScore: row.raw_score,
                maxScore: row.total_possible_score,
                gcseGrade: row.gcse_grade,
                textTitle: assessmentTitles.get(row.assessment_id) || 'GCSE Reading Paper',
                questionResults,
                performanceByQuestionType: row.performance_by_question_type,
                performanceByTheme: row.performance_by_theme,
                performanceByTopic: row.performance_by_topic
            };
        }));

        return processedResults;
    };

    const fetchGcseListeningResults = async (supabase: any, assignmentId: string, studentId?: string) => {
        let query = supabase
            .from('aqa_listening_results')
            .select('*')
            .eq('assignment_id', assignmentId)
            .order('created_at', { ascending: false });

        if (studentId) {
            query = query.eq('student_id', studentId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching GCSE listening results:', error);
            return [];
        }

        // Fetch assessment titles
        let assessmentTitles = new Map<string, string>();
        if (data && data.length > 0) {
            const assessmentIds = [...new Set(data.map((row: any) => row.assessment_id).filter(Boolean))];
            if (assessmentIds.length > 0) {
                const { data: assessments } = await supabase
                    .from('aqa_listening_assessments')
                    .select('id, title')
                    .in('id', assessmentIds);

                if (assessments) {
                    assessments.forEach((assessment: any) => {
                        assessmentTitles.set(assessment.id, assessment.title);
                    });
                }
            }
        }

        return (data || []).map((row: any) => ({
            resultId: row.id,
            assessmentType: 'GCSE Listening',
            score: row.percentage_score || 0,
            totalQuestions: row.total_possible_score || 0,
            correctAnswers: row.raw_score || 0,
            timeSpent: row.total_time_seconds || 0,
            passed: (row.percentage_score || 0) >= 60,
            completedAt: row.completion_time || row.created_at,
            rawScore: row.raw_score,
            maxScore: row.total_possible_score,
            gcseGrade: row.gcse_grade,
            textTitle: assessmentTitles.get(row.assessment_id) || 'GCSE Listening Paper',
            questionResults: (row.responses || []).map((r: any) => ({
                questionId: r.question_id,
                isCorrect: r.is_correct,
                userAnswer: r.student_answer,
                correctAnswer: 'See mark scheme',
                points: r.points_awarded,
                maxPoints: r.marks_possible,
                questionText: `Question ${r.question_number}${r.sub_question_number ? r.sub_question_number : ''}`
            })),
            performanceByQuestionType: row.performance_by_question_type,
            performanceByTheme: row.performance_by_theme,
            performanceByTopic: row.performance_by_topic
        }));
    };

    const fetchGcseWritingResults = async (supabase: any, assignmentId: string, studentId?: string) => {
        let query = supabase
            .from('aqa_writing_results')
            .select('*')
            .eq('assignment_id', assignmentId)
            .order('created_at', { ascending: false });

        if (studentId) {
            query = query.eq('student_id', studentId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching GCSE writing results:', error);
            return [];
        }

        // Fetch assessment titles
        let assessmentTitles = new Map<string, string>();
        if (data && data.length > 0) {
            const assessmentIds = [...new Set(data.map((row: any) => row.assessment_id).filter(Boolean))];
            if (assessmentIds.length > 0) {
                const { data: assessments } = await supabase
                    .from('aqa_writing_assessments')
                    .select('id, title')
                    .in('id', assessmentIds);

                if (assessments) {
                    assessments.forEach((assessment: any) => {
                        assessmentTitles.set(assessment.id, assessment.title);
                    });
                }
            }
        }

        return (data || []).map((row: any) => ({
            resultId: row.id,
            assessmentType: 'GCSE Writing',
            score: row.percentage_score || 0,
            totalQuestions: row.max_score || 0,
            correctAnswers: row.total_score || 0,
            timeSpent: row.time_spent_seconds || 0,
            passed: (row.percentage_score || 0) >= 60,
            completedAt: row.completed_at || row.created_at,
            rawScore: row.total_score,
            maxScore: row.max_score,
            gcseGrade: row.gcse_grade,
            textTitle: assessmentTitles.get(row.assessment_id) || 'GCSE Writing Paper'
        }));
    };

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading results...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl">
                        <p className="font-semibold">{error}</p>
                    </div>
                    <Button onClick={onBack} className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </div>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <Button onClick={onBack} variant="outline" className="mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <Card className="border-2">
                        <CardContent className="p-12 text-center">
                            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Results Yet</h3>
                            <p className="text-gray-600">
                                {studentName || 'The student'} hasn't completed this assessment yet.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Button onClick={onBack} variant="outline" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <h1 className="text-3xl font-bold text-slate-900">
                            {assignment?.title || 'Assessment Results'}
                        </h1>
                        {studentName && viewMode === 'teacher' && (
                            <p className="text-slate-600 mt-1">Student: {studentName}</p>
                        )}
                    </div>
                </div>

                {/* Results for each assessment */}
                {results.map((result, index) => (
                    <Card key={index} className="border-2 border-slate-200 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center text-2xl">
                                    <BookOpen className="h-6 w-6 mr-2 text-indigo-600" />
                                    {result.assessmentType}
                                    {result.textTitle && <span className="text-lg text-slate-600 ml-2">- {result.textTitle}</span>}
                                </CardTitle>
                                <div className="text-right">
                                    <div className={`text-4xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                                        {result.score}%
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        {result.passed ? 'Passed' : 'Not Passed'}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {/* Summary Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                        <span className="text-sm font-semibold text-gray-700">Correct</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {result.correctAnswers}/{result.totalQuestions}
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm font-semibold text-gray-700">Time</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatTime(result.timeSpent)}
                                    </div>
                                </div>

                                {result.gcseGrade !== undefined && (
                                    <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Award className="h-5 w-5 text-purple-600" />
                                            <span className="text-sm font-semibold text-gray-700">GCSE Grade</span>
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900">
                                            {result.gcseGrade}
                                        </div>
                                    </div>
                                )}

                                <div className="bg-indigo-50 rounded-xl p-4 border-2 border-indigo-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Target className="h-5 w-5 text-indigo-600" />
                                        <span className="text-sm font-semibold text-gray-700">Completed</span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {new Date(result.completedAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Question Results */}
                            {result.questionResults && result.questionResults.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                                        <Brain className="h-5 w-5 mr-2 text-indigo-600" />
                                        Question by Question Breakdown
                                    </h3>
                                    <div className="space-y-3">
                                        {result.questionResults.map((question, qIndex) => (
                                            <div
                                                key={qIndex}
                                                className={`p-4 rounded-lg border-2 ${question.isCorrect
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-red-50 border-red-200'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        {question.isCorrect ? (
                                                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                                        )}
                                                        <span className="font-semibold text-slate-900">
                                                            {question.questionText || `Question ${qIndex + 1}`}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-slate-600">
                                                        {question.points} point{question.points !== 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                                <div className="ml-7 space-y-2">
                                                    <div className="text-sm">
                                                        <span className="font-medium text-slate-700">Your answer:</span>{' '}
                                                        <div className={question.isCorrect ? 'text-green-700' : 'text-red-700'}>
                                                            {formatAnswer(question.userAnswer)}
                                                        </div>
                                                    </div>
                                                    {!question.isCorrect && (
                                                        <div className="text-sm">
                                                            <span className="font-medium text-slate-700">Correct answer:</span>{' '}
                                                            <div className="text-green-700">
                                                                {formatAnswer(question.correctAnswer)}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(question as any).manuallyMarkedCorrect !== undefined && (
                                                        <div className="text-xs italic text-indigo-600 mt-1">
                                                            ✏️ Manually overridden by teacher
                                                        </div>
                                                    )}
                                                    {viewMode === 'teacher' && result.resultId && (
                                                        <div className="flex gap-2 mt-2">
                                                            {!question.isCorrect && (
                                                                <Button
                                                                    onClick={() => handleManualOverride(result.resultId!, question.questionId, true)}
                                                                    disabled={overrideLoading === question.questionId}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-xs bg-green-50 hover:bg-green-100 border-green-300 text-green-700"
                                                                >
                                                                    {overrideLoading === question.questionId ? '...' : '✓ Mark Correct'}
                                                                </Button>
                                                            )}
                                                            {question.isCorrect && (question as any).manuallyMarkedCorrect && (
                                                                <Button
                                                                    onClick={() => handleManualOverride(result.resultId!, question.questionId, false)}
                                                                    disabled={overrideLoading === question.questionId}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-xs bg-red-50 hover:bg-red-100 border-red-300 text-red-700"
                                                                >
                                                                    {overrideLoading === question.questionId ? '...' : '✗ Restore Auto-Grade'}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Performance Breakdown for GCSE Assessments */}
                            {result.performanceByQuestionType && Object.keys(result.performanceByQuestionType).length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                                        <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                                        Performance by Question Type
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(result.performanceByQuestionType).map(([type, perf]: [string, any]) => {
                                            const accuracy = perf.accuracy || perf.percentage || 0;
                                            const IconComponent = getQuestionTypeIcon(type);
                                            const colorClass = getAccuracyColor(accuracy);
                                            
                                            return (
                                                <div key={type} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex items-center mb-3">
                                                        <div className={`p-2 rounded-lg mr-3 ${colorClass}`}>
                                                            <IconComponent className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900 text-sm">
                                                                {formatQuestionType(type)}
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                {perf.correct !== undefined && perf.total !== undefined 
                                                                    ? `${perf.correct}/${perf.total} correct`
                                                                    : `${accuracy}% accuracy`
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Progress Bar */}
                                                    <div className="mb-2">
                                                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                                                            <span>Accuracy</span>
                                                            <span className="font-medium">{accuracy}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                                            <div 
                                                                className={`h-2 rounded-full transition-all duration-300 ${
                                                                    accuracy >= 80 ? 'bg-green-500' :
                                                                    accuracy >= 60 ? 'bg-blue-500' :
                                                                    accuracy >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                                style={{ width: `${Math.min(accuracy, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    
                                                    {perf.correct !== undefined && perf.total !== undefined && (
                                                        <div className="text-xs text-slate-500">
                                                            {perf.correct} out of {perf.total} questions answered correctly
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

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
        questionType?: string;
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
        // Writing-specific fields
        feedback?: string;
        ao2Score?: number;
        ao3Score?: number;
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

    // Handle writing score override (numeric scores instead of just correct/incorrect)
    const handleWritingScoreOverride = async (resultId: string, questionId: string, newScore: number, maxScore: number) => {
        try {
            setOverrideLoading(questionId);

            console.log('🔄 [WRITING OVERRIDE]', {
                resultId,
                questionId,
                newScore,
                maxScore
            });

            const supabase = supabaseBrowser;

            // Update the question response score
            const { error: responseError } = await supabase
                .from('aqa_writing_question_responses')
                .update({
                    score: newScore,
                    is_correct: newScore > 0,
                    manually_overridden: true,
                    manually_overridden_at: new Date().toISOString()
                })
                .eq('result_id', resultId)
                .eq('question_id', questionId);

            if (responseError) {
                console.error('❌ [WRITING OVERRIDE] Error updating question response:', responseError);
                throw new Error('Failed to update question score');
            }

            // Recalculate total score for the result
            const { data: allResponses, error: fetchError } = await supabase
                .from('aqa_writing_question_responses')
                .select('score, max_score')
                .eq('result_id', resultId);

            if (fetchError) {
                throw new Error('Failed to fetch question responses');
            }

            const totalScore = allResponses?.reduce((sum: number, r: any) => sum + (r.score || 0), 0) || 0;
            const totalMaxScore = allResponses?.reduce((sum: number, r: any) => sum + (r.max_score || 0), 0) || 50;

            // Update the result record
            const { error: resultError } = await supabase
                .from('aqa_writing_results')
                .update({
                    total_score: totalScore,
                    max_score: totalMaxScore
                    // percentage_score is auto-calculated
                })
                .eq('id', resultId);

            if (resultError) {
                console.error('❌ [WRITING OVERRIDE] Error updating result:', resultError);
                throw new Error('Failed to update result totals');
            }

            console.log('✅ [WRITING OVERRIDE SUCCESS]', {
                questionId,
                oldScore: 'N/A',
                newScore,
                totalScore,
                totalMaxScore
            });

            // Refresh results to show updated data
            await fetchResults();
        } catch (err) {
            console.error('❌ [WRITING OVERRIDE ERROR]', err);
            alert('Failed to update score: ' + (err as Error).message);
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

                // Handle both gcse- and aqa- prefixed types
                if (assessmentType === 'reading-comprehension') {
                    const rcResults = await fetchReadingComprehensionResults(supabase, assignmentId, studentId);
                    console.log('📊 [RC RESULTS]', rcResults.length, 'results found');
                    allResults.push(...rcResults);
                } else if (assessmentType === 'gcse-reading' || assessmentType === 'aqa-reading') {
                    const grResults = await fetchGcseReadingResults(supabase, assignmentId, studentId);
                    console.log('📊 [GR RESULTS]', grResults.length, 'results found');
                    allResults.push(...grResults);
                } else if (assessmentType === 'gcse-listening' || assessmentType === 'aqa-listening') {
                    const glResults = await fetchGcseListeningResults(supabase, assignmentId, studentId);
                    console.log('📊 [GL RESULTS]', glResults.length, 'results found');
                    allResults.push(...glResults);
                } else if (assessmentType === 'gcse-writing' || assessmentType === 'aqa-writing' || assessmentType === 'writing') {
                    const gwResults = await fetchGcseWritingResults(supabase, assignmentId, studentId);
                    console.log('📊 [GW RESULTS]', gwResults.length, 'results found');
                    allResults.push(...gwResults);
                } else if (assessmentType === 'gcse-speaking' || assessmentType === 'aqa-speaking' || assessmentType === 'speaking') {
                    const gsResults = await fetchGcseSpeakingResults(supabase, assignmentId, studentId);
                    console.log('📊 [GS RESULTS]', gsResults.length, 'results found');
                    allResults.push(...gsResults);
                } else if (assessmentType === 'dictation' || assessmentType === 'aqa-dictation' || assessmentType === 'gcse-dictation') {
                    const dictResults = await fetchDictationResults(supabase, assignmentId, studentId);
                    console.log('📊 [DICT RESULTS]', dictResults.length, 'results found');
                    allResults.push(...dictResults);
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
        console.log('🔍 [RC FETCH] SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);

        // Use REST API to bypass caching
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error('❌ Missing Supabase credentials', { supabaseUrl, hasKey: !!supabaseAnonKey });
            return [];
        }

        try {
            // Get the current session token
            const { data: { session } } = await supabase.auth.getSession();
            const accessToken = session?.access_token;

            if (!accessToken) {
                console.error('❌ No access token available');
                return [];
            }

            // Build query
            let url = `${supabaseUrl}/rest/v1/reading_comprehension_results?assignment_id=eq.${assignmentId}&order=created_at.desc&select=*`;

            if (studentId) {
                url += `&user_id=eq.${studentId}`;
            }

            console.log('📡 [RC FETCH] Making request to:', url.substring(0, 100) + '...');

            const response = await fetch(url, {
                headers: {
                    'apikey': supabaseAnonKey,
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });

            console.log('📡 [RC FETCH] Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ [RC FETCH] API error:', response.status, response.statusText, errorText);
                return [];
            }

            const data = await response.json();

            console.log('📊 [RC FETCH] Result:', {
                dataCount: data?.length || 0,
                firstRow: data?.[0],
                fullData: data
            });

            if (!data || data.length === 0) {
                console.warn('⚠️ [RC FETCH] Empty result - Check if logged in as teacher!');
                return [];
            }

            // Fetch task titles separately
            let taskTitles = new Map<string, string>();
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
        } catch (error) {
            console.error('❌ [RC FETCH] Error:', error);
            return [];
        }
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

            // Fetch question details to get question text AND question_data for correct answers
            let questionDetails = new Map();
            if (responses && responses.length > 0) {
                const questionIds = [...new Set(responses.map((r: any) => r.question_id))];
                const { data: questions } = await supabase
                    .from('aqa_reading_questions')
                    .select('id, title, instructions, question_data, question_type')
                    .in('id', questionIds);

                if (questions) {
                    questions.forEach((q: any) => {
                        questionDetails.set(q.id, {
                            title: q.title,
                            instructions: q.instructions,
                            questionData: q.question_data,
                            questionType: q.question_type
                        });
                    });
                }
            }

            // Helper function to extract correct answers from question_data based on question type
            const extractCorrectAnswers = (questionData: any, questionType: string): string => {
                if (!questionData) return 'Answer not available';

                try {
                    switch (questionType) {
                        case 'letter-matching':
                            // data.students[] has correctLetter
                            if (questionData.students && Array.isArray(questionData.students)) {
                                const answers = questionData.students
                                    .filter((s: any) => s.correctLetter || s.correct)
                                    .map((s: any) => `${s.name}: ${s.correctLetter || s.correct}`);
                                return answers.length > 0 ? answers.join(', ') : 'See mark scheme';
                            }
                            break;

                        case 'multiple-choice':
                            // data.questions[] has correctAnswer
                            if (questionData.questions && Array.isArray(questionData.questions)) {
                                const answers = questionData.questions
                                    .map((q: any, i: number) => {
                                        const correct = q.correctAnswer || q.correct;
                                        return correct ? `Q${i + 1}: ${correct}` : null;
                                    })
                                    .filter(Boolean);
                                return answers.length > 0 ? answers.join(', ') : 'See mark scheme';
                            }
                            break;

                        case 'student-grid':
                            // data.questions[] has correctStudent
                            if (questionData.questions && Array.isArray(questionData.questions)) {
                                const answers = questionData.questions
                                    .map((q: any, i: number) => {
                                        const correct = q.correctStudent || q.correct;
                                        return correct ? `Q${i + 1}: ${correct}` : null;
                                    })
                                    .filter(Boolean);
                                return answers.length > 0 ? answers.join(', ') : 'See mark scheme';
                            }
                            break;

                        case 'time-sequence':
                            // data.events[] has correctSequence (P/N/F)
                            if (questionData.events && Array.isArray(questionData.events)) {
                                const answers = questionData.events
                                    .map((e: any, i: number) => {
                                        const correct = e.correctSequence || e.correct;
                                        return correct ? `Q${i + 1}: ${correct}` : null;
                                    })
                                    .filter(Boolean);
                                return answers.length > 0 ? answers.join(', ') : 'See mark scheme';
                            }
                            break;

                        case 'sentence-completion':
                            // data.sentences[] has correctCompletion
                            if (questionData.sentences && Array.isArray(questionData.sentences)) {
                                const answers = questionData.sentences
                                    .map((s: any, i: number) => {
                                        const correct = s.correctCompletion || s.correct;
                                        return correct ? `${i + 1}: ${correct}` : null;
                                    })
                                    .filter(Boolean);
                                return answers.length > 0 ? answers.join('; ') : 'See mark scheme';
                            }
                            break;

                        case 'headline-matching':
                            // data.articles[] has correctHeadline
                            if (questionData.articles && Array.isArray(questionData.articles)) {
                                const answers = questionData.articles
                                    .map((a: any, i: number) => {
                                        const correct = a.correctHeadline || a.correct;
                                        return correct ? `Q${i + 1}: ${correct}` : null;
                                    })
                                    .filter(Boolean);
                                return answers.length > 0 ? answers.join(', ') : 'See mark scheme';
                            }
                            break;

                        case 'open-response':
                            // May have expectedAnswers or acceptableAnswers
                            if (questionData.questions && Array.isArray(questionData.questions)) {
                                const answers = questionData.questions
                                    .map((q: any, i: number) => {
                                        const correct = q.expectedAnswer || q.acceptableAnswers?.join(' / ') || q.correct;
                                        return correct ? `Q${i + 1}: ${correct}` : null;
                                    })
                                    .filter(Boolean);
                                return answers.length > 0 ? answers.join('; ') : 'Requires manual marking';
                            }
                            break;

                        case 'translation':
                            // May have expectedTranslation or acceptableTranslations
                            if (questionData.sentences && Array.isArray(questionData.sentences)) {
                                const answers = questionData.sentences
                                    .map((s: any, i: number) => {
                                        const correct = s.expectedTranslation || s.acceptableTranslations?.[0] || s.english;
                                        return correct ? `${i + 1}: ${correct}` : null;
                                    })
                                    .filter(Boolean);
                                return answers.length > 0 ? answers.join('; ') : 'Requires manual marking';
                            }
                            break;
                    }
                } catch (e) {
                    console.error('Error extracting correct answers:', e);
                }

                return 'See mark scheme';
            };

            const questionResults = (responses || []).map((r: any) => {
                const qDetails = questionDetails.get(r.question_id);
                const correctAnswer = qDetails?.questionData
                    ? extractCorrectAnswers(qDetails.questionData, r.question_type || qDetails.questionType)
                    : 'See mark scheme';

                return {
                    questionId: r.question_id,
                    questionText: qDetails?.title || `Question ${r.question_number}`,
                    userAnswer: r.student_answer,
                    correctAnswer: correctAnswer,
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

        // Helper function to extract correct answers from listening question_data
        const extractListeningCorrectAnswer = (questionData: any, questionType: string): string => {
            if (!questionData) return 'See mark scheme';

            try {
                switch (questionType) {
                    case 'letter-matching':
                        if (questionData.questions && Array.isArray(questionData.questions)) {
                            return questionData.questions
                                .map((q: any, i: number) => {
                                    const correct = q.correctAnswer || q.correct;
                                    return correct ? `${q.label || `Q${i + 1}`}: ${correct}` : null;
                                })
                                .filter(Boolean)
                                .join(', ') || 'See mark scheme';
                        }
                        break;
                    case 'multiple-choice':
                        if (questionData.questions && Array.isArray(questionData.questions)) {
                            return questionData.questions
                                .map((q: any, i: number) => {
                                    const correct = q.correctAnswer || q.correct;
                                    return correct ? `Q${i + 1}: ${correct}` : null;
                                })
                                .filter(Boolean)
                                .join(', ') || 'See mark scheme';
                        }
                        break;
                    case 'lifestyle-grid':
                        if (questionData.speakers && Array.isArray(questionData.speakers)) {
                            return questionData.speakers
                                .map((s: any) => {
                                    const goods = s.correctGood || s.good;
                                    const needs = s.correctNeedsImprovement || s.needsImprovement;
                                    return `${s.name}: Good=${goods || '?'}, Needs=${needs || '?'}`;
                                })
                                .join('; ') || 'See mark scheme';
                        }
                        break;
                    case 'opinion-rating':
                        if (questionData.aspects && Array.isArray(questionData.aspects)) {
                            return questionData.aspects
                                .map((a: any) => {
                                    const correct = a.correctRating || a.correct;
                                    return correct ? `${a.aspect}: ${correct}` : null;
                                })
                                .filter(Boolean)
                                .join(', ') || 'See mark scheme';
                        }
                        break;
                    case 'open-response':
                        if (questionData.questions && Array.isArray(questionData.questions)) {
                            return questionData.questions
                                .map((q: any, i: number) => {
                                    const correct = q.expectedAnswer || q.acceptableAnswers?.join(' / ') || q.correct;
                                    return correct ? `Q${i + 1}: ${correct}` : null;
                                })
                                .filter(Boolean)
                                .join('; ') || 'Requires manual marking';
                        }
                        break;
                    case 'activity-timing':
                        if (questionData.questions && Array.isArray(questionData.questions)) {
                            return questionData.questions
                                .map((q: any, i: number) => {
                                    const activity = q.correctActivity || q.activity;
                                    const timing = q.correctTiming || q.timing;
                                    return `Q${i + 1}: ${activity || '?'} - ${timing || '?'}`;
                                })
                                .join('; ') || 'See mark scheme';
                        }
                        break;
                    case 'dictation':
                        if (questionData.sentences && Array.isArray(questionData.sentences)) {
                            return questionData.sentences
                                .map((s: any, i: number) => `${i + 1}: ${s.text || s.sentence || s}`)
                                .join('; ') || 'See mark scheme';
                        }
                        break;
                }
            } catch (e) {
                console.error('Error extracting listening correct answer:', e);
            }
            return 'See mark scheme';
        };

        // Helper to extract correct answer for a specific sub-question
        const extractListeningSubQuestionCorrectAnswer = (
            questionData: any,
            questionType: string,
            subQuestionId: string | null
        ): string => {
            if (!questionData) return 'See mark scheme';

            try {
                switch (questionType) {
                    case 'letter-matching':
                        if (questionData.questions && Array.isArray(questionData.questions)) {
                            const subQ = questionData.questions.find((q: any) => q.id === subQuestionId);
                            if (subQ) {
                                return subQ.correctAnswer || subQ.correct || '?';
                            }
                        }
                        break;
                    case 'multiple-choice':
                        if (questionData.questions && Array.isArray(questionData.questions)) {
                            const qIndex = parseInt(subQuestionId?.replace('q', '') || '1') - 1;
                            const subQ = questionData.questions[qIndex];
                            if (subQ) {
                                return subQ.correctAnswer || subQ.correct || '?';
                            }
                        }
                        break;
                    case 'lifestyle-grid':
                        if (questionData.speakers && Array.isArray(questionData.speakers)) {
                            const parts = subQuestionId?.split('_') || [];
                            const speakerId = parts[0];
                            const answerType = parts[1];
                            const speaker = questionData.speakers.find((s: any) => s.id === speakerId);
                            if (speaker) {
                                if (answerType === 'good') {
                                    return speaker.correctGood || '?';
                                } else if (answerType === 'needs') {
                                    return speaker.correctNeedsImprovement || '?';
                                }
                            }
                        }
                        break;
                    case 'opinion-rating':
                        if (questionData.aspects && Array.isArray(questionData.aspects)) {
                            const aspect = questionData.aspects.find((a: any) => a.id === subQuestionId);
                            if (aspect) {
                                return aspect.correctAnswer || '?';
                            }
                        }
                        break;
                    case 'open-response':
                        if (questionData.questions && Array.isArray(questionData.questions)) {
                            const subQ = questionData.questions.find((q: any) => q.id === subQuestionId);
                            if (subQ) {
                                return subQ.sampleAnswer || subQ.expectedAnswer || subQ.acceptableAnswers?.join(' / ') || 'See mark scheme';
                            }
                        }
                        break;
                    case 'activity-timing':
                        if (questionData.questions && Array.isArray(questionData.questions)) {
                            const qIndex = parseInt(subQuestionId?.replace('q', '') || '1') - 1;
                            const subQ = questionData.questions[qIndex];
                            if (subQ) {
                                return `Activity: ${subQ.correctActivity}, Time: ${subQ.correctTime}`;
                            }
                        }
                        return 'See mark scheme';
                    case 'multi-part':
                        if (questionData.parts && Array.isArray(questionData.parts)) {
                            const partIndex = parseInt(subQuestionId?.replace('part', '') || '1') - 1;
                            const part = questionData.parts[partIndex];
                            if (part) {
                                return part.correctAnswer || part.correct || '?';
                            }
                        }
                        break;
                    case 'dictation':
                        if (questionData.sentences && Array.isArray(questionData.sentences)) {
                            const sentenceIndex = parseInt(subQuestionId?.replace('sentence', '') || '1') - 1;
                            const sentence = questionData.sentences[sentenceIndex];
                            if (sentence) {
                                return sentence.text || sentence.sentence || sentence;
                            }
                        }
                        break;
                }
            } catch (e) {
                console.error('Error extracting listening sub-question correct answer:', e);
            }
            return 'See mark scheme';
        };

        // Helper to format sub-question label nicely
        const formatSubQuestionLabel = (subQuestionId: string | null, questionType: string): string => {
            if (!subQuestionId) return '';

            const formatted = subQuestionId
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase());

            if (questionType === 'lifestyle-grid') {
                const parts = subQuestionId.split('_');
                const speaker = parts[0]?.charAt(0).toUpperCase() + parts[0]?.slice(1);
                const type = parts[1] === 'good' ? 'Good at' : 'Needs to improve';
                return `${speaker} - ${type}`;
            }

            if (questionType === 'letter-matching') {
                return formatted;
            }

            if (subQuestionId.startsWith('q')) {
                return `Part ${subQuestionId.replace('q', '')}`;
            }

            if (subQuestionId.startsWith('part')) {
                return `Part ${subQuestionId.replace('part', '')}`;
            }

            if (subQuestionId.startsWith('sentence')) {
                return `Sentence ${subQuestionId.replace('sentence', '')}`;
            }

            return formatted;
        };

        // Helper to parse JSON student answers
        const parseStudentAnswer = (answer: string): string => {
            if (!answer) return 'No answer';

            try {
                if (answer.startsWith('{') || answer.startsWith('[')) {
                    const parsed = JSON.parse(answer);
                    if (typeof parsed === 'object' && parsed !== null) {
                        if (Array.isArray(parsed)) {
                            return parsed.join(', ');
                        }
                        // Handle nested object formatting
                        return Object.entries(parsed)
                            .map(([key, value]) => {
                                let formattedValue = value;
                                if (typeof value === 'object' && value !== null) {
                                    // Handle formatting of nested objects like {activity: 3, time: "C"}
                                    if ('activity' in value && 'time' in value) {
                                        formattedValue = `Activity: ${value.activity}, Time: ${value.time}`;
                                    } else {
                                        formattedValue = JSON.stringify(value);
                                    }
                                }

                                // Format keys if they are q1, q2, etc.
                                let formattedKey = key;
                                if (/^q\d+$/.test(key)) {
                                    formattedKey = `Part ${key.substring(1)}`;
                                } else if (/^part\d+$/.test(key)) {
                                    formattedKey = `Part ${key.substring(4)}`;
                                } else if (/^sentence\d+$/.test(key)) {
                                    formattedKey = `Sentence ${key.substring(8)}`;
                                } else {
                                    // Capitalize
                                    formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
                                }

                                return `${formattedKey}: ${formattedValue}`;
                            })
                            .join(', ');
                    }
                    return String(parsed);
                }
            } catch (e) {
                // If parse fails, return original
            }
            return answer;
        };

        // Process each result to fetch question details
        const processedResults = await Promise.all((data || []).map(async (row: any) => {
            // Get unique question IDs from responses
            const responses = row.responses || [];
            const questionIds = [...new Set(responses.map((r: any) => r.question_id).filter(Boolean))];

            // Fetch question details if we have question IDs
            let questionDetailsMap = new Map<string, any>();
            if (questionIds.length > 0) {
                const { data: questions } = await supabase
                    .from('aqa_listening_questions')
                    .select('id, title, question_type, question_data')
                    .in('id', questionIds);

                if (questions) {
                    questions.forEach((q: any) => questionDetailsMap.set(q.id, q));
                }
            }

            // Group responses by question_id to determine sub-question numbering
            const questionGroups = new Map<string, number>();
            responses.forEach((r: any) => {
                const count = questionGroups.get(r.question_id) || 0;
                questionGroups.set(r.question_id, count + 1);
            });

            // Track sub-question index within each question
            const subQuestionCounters = new Map<string, number>();

            const questionResults = responses.flatMap((r: any, index: number) => {
                const qDetails = questionDetailsMap.get(r.question_id);
                const questionType = r.question_type || qDetails?.question_type || 'unknown';

                // Check if this response needs expansion (single row in DB but multiple sub-questions in data)
                // This happens for types like opinion-rating, open-response, etc. when they are stored as one big JSON blobl
                const questionData = qDetails?.question_data;
                const needsExpansion = !r.sub_question_number && questionData && (
                    (questionType === 'opinion-rating' && questionData.aspects) ||
                    (questionType === 'open-response' && questionData.questions) ||
                    (questionType === 'activity-timing' && questionData.questions) ||
                    (questionType === 'multi-part' && questionData.parts) ||
                    (questionType === 'dictation' && questionData.sentences)
                );

                if (needsExpansion) {
                    let parsedAnswer: any = {};
                    try {
                        if (typeof r.student_answer === 'string' && (r.student_answer.startsWith('{') || r.student_answer.startsWith('['))) {
                            parsedAnswer = JSON.parse(r.student_answer);
                        } else {
                            parsedAnswer = r.student_answer;
                        }
                    } catch (e) {
                        parsedAnswer = {};
                    }

                    const expandedQuestions: any[] = [];
                    let localSubIndex = 1;

                    if (questionType === 'opinion-rating' && questionData.aspects) {
                        questionData.aspects.forEach((aspect: any) => {
                            const subId = aspect.id;
                            const studentVal = parsedAnswer[subId];
                            const correctVal = aspect.correctAnswer || aspect.correct || '?';

                            expandedQuestions.push({
                                questionId: `${r.question_id}-${subId}`,
                                isCorrect: String(studentVal) === String(correctVal), // Simple equality check
                                userAnswer: studentVal || 'No answer',
                                correctAnswer: correctVal,
                                points: String(studentVal) === String(correctVal) ? 1 : 0,
                                maxPoints: 1,
                                questionText: `${qDetails?.title || 'Question'} - ${aspect.label || aspect.aspect || 'Aspect'}`,
                                questionType: questionType
                            });
                        });
                    } else if (questionType === 'open-response' && questionData.questions) {
                        questionData.questions.forEach((q: any) => {
                            const subId = q.id || `q${localSubIndex}`;
                            const studentVal = parsedAnswer[subId];
                            const correctVal = q.sampleAnswer || q.expectedAnswer || '?';

                            expandedQuestions.push({
                                questionId: `${r.question_id}-${subId}`,
                                isCorrect: r.is_correct, // Manual marking usually
                                userAnswer: studentVal || 'No answer',
                                correctAnswer: correctVal,
                                points: 0,
                                maxPoints: q.marks || 1,
                                questionText: `${qDetails?.title || 'Question'} - ${q.question || `Part ${localSubIndex}`}`,
                                questionType: questionType
                            });
                            localSubIndex++;
                        });
                    } else if (questionType === 'activity-timing' && questionData.questions) {
                        questionData.questions.forEach((q: any) => {
                            const subId = q.id || `q${localSubIndex}`;
                            const studentVal = parsedAnswer[subId];
                            // Format nested student answer: {activity: 3, time: "C"}
                            let formattedStudentVal = 'No answer';
                            if (studentVal) {
                                if (typeof studentVal === 'object') {
                                    formattedStudentVal = `Activity: ${studentVal.activity}, Time: ${studentVal.time}`;
                                } else {
                                    formattedStudentVal = String(studentVal);
                                }
                            }

                            const correctVal = `Activity: ${q.correctActivity}, Time: ${q.correctTime}`;

                            // Calculate partial points (1 for activity, 1 for time)
                            let points = 0;
                            if (studentVal && typeof studentVal === 'object') {
                                if (String(studentVal.activity) === String(q.correctActivity)) points += 1;
                                if (String(studentVal.time) === String(q.correctTime)) points += 1;
                            }

                            expandedQuestions.push({
                                questionId: `${r.question_id}-${subId}`,
                                isCorrect: points === 2,
                                userAnswer: formattedStudentVal,
                                correctAnswer: correctVal,
                                points: points,
                                maxPoints: 2, // 1 for activity, 1 for time
                                questionText: `${qDetails?.title || 'Question'} - Part ${localSubIndex}`,
                                questionType: questionType
                            });
                            localSubIndex++;
                        });
                    } else if (questionType === 'multi-part' && questionData.parts) {
                        questionData.parts.forEach((p: any) => {
                            const subId = p.id || `part${localSubIndex}`;
                            const studentVal = parsedAnswer[subId];
                            const correctVal = p.correctAnswer || p.correct || '?';

                            expandedQuestions.push({
                                questionId: `${r.question_id}-${subId}`,
                                isCorrect: String(studentVal) === String(correctVal),
                                userAnswer: studentVal || 'No answer',
                                correctAnswer: correctVal,
                                points: String(studentVal) === String(correctVal) ? 1 : 0,
                                maxPoints: 1,
                                questionText: `${qDetails?.title || 'Question'} - ${p.question || `Part ${localSubIndex}`}`,
                                questionType: questionType
                            });
                            localSubIndex++;
                        });
                    } else if (questionType === 'dictation' && questionData.sentences) {
                        questionData.sentences.forEach((s: any) => {
                            const subId = s.id || `sentence${localSubIndex}`;
                            const studentVal = parsedAnswer[subId];
                            const correctVal = s.text || s.sentence || s.correctText || '?';

                            // Loose check since dictation logic is complex
                            let points = 0;
                            const normStudent = String(studentVal || '').trim().toLowerCase();
                            const normCorrect = String(correctVal).trim().toLowerCase();

                            // Perfect match = 2 marks
                            if (normStudent === normCorrect && normStudent.length > 0) {
                                points = 2;
                            } else if (normStudent.length > 5 && normCorrect.includes(normStudent.substring(0, Math.min(10, normStudent.length)))) {
                                // Rough partial match heuristic = 1 mark
                                points = 1;
                            }
                            // Else 0 marks, or fallback to r.is_correct logic if available?

                            expandedQuestions.push({
                                questionId: `${r.question_id}-${subId}`,
                                isCorrect: points === 2,
                                userAnswer: studentVal || 'No answer',
                                correctAnswer: correctVal,
                                points: points,
                                maxPoints: 2,
                                questionText: `${qDetails?.title || 'Dictation'} - Sentence ${localSubIndex}`,
                                questionType: questionType
                            });
                            localSubIndex++;
                        });
                    }

                    if (expandedQuestions.length > 0) {
                        return expandedQuestions;
                    }
                }

                // Standard processing (existing logic)

                // Get or increment sub-question counter for this question
                // Global counter for the questionId map
                const subIndex = (subQuestionCounters.get(r.question_id) || 0) + 1;
                subQuestionCounters.set(r.question_id, subIndex);

                // Get correct answer
                const correctAnswer = r.sub_question_number
                    ? extractListeningSubQuestionCorrectAnswer(
                        qDetails?.question_data,
                        questionType,
                        r.sub_question_number
                    )
                    : extractListeningCorrectAnswer(qDetails?.question_data, questionType);

                // Build question text with sub-question label
                let questionText = qDetails?.title || `Question ${r.question_number || index + 1}`;
                if (r.sub_question_number) {
                    const subLabel = formatSubQuestionLabel(r.sub_question_number, questionType);
                    questionText = `${questionText} - ${subLabel}`;
                }

                // Parse student answer if it's JSON
                const studentAnswer = typeof r.student_answer === 'string' && r.student_answer.startsWith('{')
                    ? parseStudentAnswer(r.student_answer)
                    : r.student_answer || 'No answer';

                return [{
                    questionId: r.sub_question_number
                        ? `${r.question_id}-${r.sub_question_number}`
                        : r.question_id,
                    isCorrect: r.is_correct,
                    userAnswer: studentAnswer,
                    correctAnswer: correctAnswer,
                    points: r.points_awarded,
                    maxPoints: r.marks_possible,
                    questionText: questionText,
                    questionType: questionType
                }];
            });

            return {
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
                questionResults,
                performanceByQuestionType: row.performance_by_question_type,
                performanceByTheme: row.performance_by_theme,
                performanceByTopic: row.performance_by_topic
            };
        }));

        return processedResults;
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

        // Process results with detailed question responses
        const processedResults = await Promise.all((data || []).map(async (row: any) => {
            // Fetch detailed question responses for this result
            const { data: responses, error: responsesError } = await supabase
                .from('aqa_writing_question_responses')
                .select('*')
                .eq('result_id', row.id)
                .order('created_at', { ascending: true });

            if (responsesError) {
                console.error('Error fetching writing question responses:', responsesError);
            }

            // Fetch question details for writing questions
            let questionDetails = new Map();
            if (responses && responses.length > 0) {
                const questionIds = [...new Set(responses.map((r: any) => r.question_id))];
                const { data: questions } = await supabase
                    .from('aqa_writing_questions')
                    .select('id, title, instructions, question_data, question_type, marks, question_number')
                    .in('id', questionIds);

                if (questions) {
                    questions.forEach((q: any) => {
                        questionDetails.set(q.id, {
                            title: q.title,
                            instructions: q.instructions,
                            questionData: q.question_data,
                            questionType: q.question_type,
                            marks: q.marks,
                            questionNumber: q.question_number
                        });
                    });
                }
            }

            // Build question results array
            const questionResults = (responses || []).map((r: any, rIndex: number) => {
                const qDetails = questionDetails.get(r.question_id);
                const questionType = qDetails?.questionType || 'unknown';
                const questionNumber = qDetails?.questionNumber || (rIndex + 1);

                // Format response data for display based on question type
                let formattedResponse: any = '';
                if (r.response_data) {
                    if (typeof r.response_data === 'object') {
                        // Handle different response formats based on question type
                        if (questionType === 'photo-description' && r.response_data.sentences) {
                            // Photo description: Show as Q1.1, Q1.2, etc.
                            formattedResponse = r.response_data.sentences.map((sentence: string, i: number) =>
                                `${questionNumber}.${i + 1}: ${sentence}`
                            ).join('\n');
                        } else if (r.response_data.sentences) {
                            // Generic sentences array
                            formattedResponse = r.response_data.sentences.map((sentence: string, i: number) =>
                                `${i + 1}. ${sentence}`
                            ).join('\n');
                        } else if (r.response_data.message) {
                            // Short message (Q2)
                            formattedResponse = r.response_data.message;
                        } else if (r.response_data.article) {
                            // Extended writing (Q5)
                            formattedResponse = r.response_data.article;
                        } else if (questionType === 'gap-fill') {
                            // Gap-fill: Show as Q3.1, Q3.2, etc.
                            const entries = Object.entries(r.response_data);
                            formattedResponse = entries.map(([key, value]) => {
                                const num = key.replace('question-', '');
                                return `${questionNumber}.${parseInt(num) + 1}: ${value}`;
                            }).join('\n');
                        } else if (questionType === 'translation') {
                            // Translation: Show as Q4.1, Q4.2, etc.
                            const entries = Object.entries(r.response_data);
                            formattedResponse = entries.map(([key, value]) => {
                                if (key.startsWith('translation-')) {
                                    const num = key.replace('translation-', '');
                                    return `${questionNumber}.${parseInt(num) + 1}: ${value}`;
                                }
                                return `${key}: ${value}`;
                            }).join('\n');
                        } else {
                            // Fallback: format key-value pairs
                            const entries = Object.entries(r.response_data);
                            formattedResponse = entries.map(([key, value]) => `${key}: ${value}`).join('\n');
                        }
                    } else {
                        formattedResponse = String(r.response_data);
                    }
                }

                return {
                    questionId: r.question_id,
                    questionText: qDetails?.title || `Question ${qDetails?.questionNumber || '?'}`,
                    questionType: questionType,
                    userAnswer: formattedResponse || r.response_data,
                    correctAnswer: 'AI-marked (see feedback)',
                    isCorrect: r.is_correct,
                    points: r.score,
                    maxPoints: r.max_score,
                    timeSpent: r.time_spent_seconds,
                    feedback: r.ai_feedback || r.feedback,
                    // For writing assessments, include AO2/AO3 breakdown if available
                    ao2Score: r.ao2_score,
                    ao3Score: r.ao3_score
                };
            });

            return {
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
                textTitle: assessmentTitles.get(row.assessment_id) || 'GCSE Writing Paper',
                questionResults
            };
        }));

        return processedResults;
    };

    const fetchGcseSpeakingResults = async (supabase: any, assignmentId: string, studentId?: string) => {
        let query = supabase
            .from('aqa_speaking_results')
            .select('*')
            .eq('assignment_id', assignmentId)
            .order('created_at', { ascending: false });

        if (studentId) {
            query = query.eq('student_id', studentId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching GCSE speaking results:', error);
            return [];
        }

        // Fetch assessment titles
        let assessmentTitles = new Map<string, string>();
        if (data && data.length > 0) {
            const assessmentIds = [...new Set(data.map((row: any) => row.assessment_id).filter(Boolean))];
            if (assessmentIds.length > 0) {
                const { data: assessments } = await supabase
                    .from('aqa_speaking_assessments')
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
            assessmentType: 'GCSE Speaking',
            score: row.percentage_score || 0,
            totalQuestions: row.max_score || 0,
            correctAnswers: row.total_score || 0,
            timeSpent: row.time_spent_seconds || 0,
            passed: (row.percentage_score || 0) >= 60,
            completedAt: row.completed_at || row.created_at,
            rawScore: row.total_score,
            maxScore: row.max_score,
            gcseGrade: row.gcse_grade,
            textTitle: assessmentTitles.get(row.assessment_id) || 'GCSE Speaking Assessment',
            // Speaking assessments are manually graded - no auto-gradeable question results
            questionResults: []
        }));
    };

    const fetchDictationResults = async (supabase: any, assignmentId: string, studentId?: string) => {
        let query = supabase
            .from('aqa_dictation_results')
            .select('*')
            .eq('assignment_id', assignmentId)
            .order('created_at', { ascending: false });

        if (studentId) {
            query = query.eq('student_id', studentId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching dictation results:', error);
            return [];
        }

        // Fetch assessment titles
        let assessmentTitles = new Map<string, string>();
        if (data && data.length > 0) {
            const assessmentIds = [...new Set(data.map((row: any) => row.assessment_id).filter(Boolean))];
            if (assessmentIds.length > 0) {
                const { data: assessments } = await supabase
                    .from('aqa_dictation_assessments')
                    .select('id, title')
                    .in('id', assessmentIds);

                if (assessments) {
                    assessments.forEach((assessment: any) => {
                        assessmentTitles.set(assessment.id, assessment.title);
                    });
                }
            }
        }

        return (data || []).map((row: any) => {
            // Dictation responses have the correct answer as the original sentence
            const questionResults = (row.responses || []).map((r: any) => ({
                questionId: r.question_id,
                questionText: `Sentence ${r.question_number}`,
                userAnswer: r.student_answer || '',
                correctAnswer: r.correct_answer || 'See original sentence',
                isCorrect: r.is_correct,
                points: r.points_awarded,
                maxPoints: r.marks_possible
            }));

            return {
                resultId: row.id,
                assessmentType: 'Dictation',
                score: row.percentage_score || 0,
                totalQuestions: row.total_possible_score || 0,
                correctAnswers: row.raw_score || 0,
                timeSpent: row.total_time_seconds || 0,
                passed: (row.percentage_score || 0) >= 60,
                completedAt: row.completion_time || row.created_at,
                rawScore: row.raw_score,
                maxScore: row.total_possible_score,
                gcseGrade: row.gcse_grade,
                textTitle: assessmentTitles.get(row.assessment_id) || 'Dictation Assessment',
                questionResults,
                performanceByTheme: row.performance_by_theme,
                performanceByTopic: row.performance_by_topic
            };
        });
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
                                        {result.questionResults.map((question, qIndex) => {
                                            const isWritingQuestion = result.assessmentType === 'GCSE Writing';
                                            const scorePct = question.maxPoints ? (question.points / question.maxPoints) * 100 : 0;
                                            const borderColor = scorePct >= 80 ? 'border-green-200' : scorePct >= 60 ? 'border-yellow-200' : scorePct >= 40 ? 'border-orange-200' : 'border-red-200';
                                            const bgColor = scorePct >= 80 ? 'bg-green-50' : scorePct >= 60 ? 'bg-yellow-50' : scorePct >= 40 ? 'bg-orange-50' : 'bg-red-50';

                                            return (
                                                <div
                                                    key={qIndex}
                                                    className={`p-4 rounded-lg border-2 ${isWritingQuestion ? `${bgColor} ${borderColor}` : question.isCorrect
                                                        ? 'bg-green-50 border-green-200'
                                                        : 'bg-red-50 border-red-200'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            {isWritingQuestion ? (
                                                                <Edit3 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                                                            ) : question.isCorrect ? (
                                                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                            ) : (
                                                                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                                                            )}
                                                            <span className="font-semibold text-slate-900">
                                                                {question.questionText || `Question ${qIndex + 1}`}
                                                            </span>
                                                            {question.questionType && (
                                                                <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                                                                    {question.questionType.replace('-', ' ')}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm font-medium text-slate-600">
                                                            {question.points}/{question.maxPoints || 1} mark{(question.maxPoints || 1) !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                    <div className="ml-7 space-y-2">
                                                        {/* Student's Response */}
                                                        <div className="text-sm">
                                                            <span className="font-medium text-slate-700">Student's response:</span>
                                                            <div className="mt-1 p-2 bg-white border rounded text-slate-800 whitespace-pre-wrap">
                                                                {formatAnswer(question.userAnswer)}
                                                            </div>
                                                        </div>

                                                        {/* AI Feedback for Writing */}
                                                        {isWritingQuestion && (question as any).feedback && (
                                                            <div className="text-sm mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                                <div className="flex items-center gap-2 mb-2 text-blue-900 font-semibold">
                                                                    <MessageSquare className="h-4 w-4" />
                                                                    <span>AI Feedback</span>
                                                                </div>
                                                                <div className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                                                                    {(question as any).feedback}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* AO2/AO3 Breakdown for Writing Questions */}
                                                        {isWritingQuestion && ((question as any).ao2Score !== undefined || (question as any).ao3Score !== undefined) && (
                                                            <div className="flex gap-4 text-sm mt-2">
                                                                {(question as any).ao2Score !== undefined && (
                                                                    <div className="px-2 py-1 bg-purple-100 rounded">
                                                                        <span className="font-medium">AO2:</span> {(question as any).ao2Score}
                                                                    </div>
                                                                )}
                                                                {(question as any).ao3Score !== undefined && (
                                                                    <div className="px-2 py-1 bg-purple-100 rounded">
                                                                        <span className="font-medium">AO3:</span> {(question as any).ao3Score}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Correct Answer (for non-writing or gap-fill) */}
                                                        {!isWritingQuestion && !question.isCorrect && (
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

                                                        {/* Teacher Override Controls */}
                                                        {viewMode === 'teacher' && result.resultId && (
                                                            <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-slate-200">
                                                                {isWritingQuestion ? (
                                                                    // Writing-specific score override with numeric options
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-slate-500">Override score:</span>
                                                                        {Array.from({ length: (question.maxPoints || 10) + 1 }, (_, i) => i).map(score => (
                                                                            <Button
                                                                                key={score}
                                                                                onClick={() => handleWritingScoreOverride(result.resultId!, question.questionId, score, question.maxPoints || 10)}
                                                                                disabled={overrideLoading === question.questionId}
                                                                                size="sm"
                                                                                variant="outline"
                                                                                className={`text-xs px-2 ${question.points === score ? 'bg-indigo-100 border-indigo-400' : 'bg-slate-50'}`}
                                                                            >
                                                                                {score}
                                                                            </Button>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    // Standard correct/incorrect toggle
                                                                    <>
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
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                                            // Handle various data structures
                                            const correct = perf.correct ?? perf.correctCount ?? 0;
                                            const total = perf.total ?? perf.totalQuestions ?? perf.totalCount ?? 1;
                                            const accuracy = perf.accuracy ?? perf.percentage ?? (total > 0 ? Math.round((correct / total) * 100) : 0);
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
                                                                {correct !== undefined && total !== undefined
                                                                    ? `${correct}/${total} correct`
                                                                    : `${Math.round(accuracy)}% accuracy`
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
                                                                className={`h-2 rounded-full transition-all duration-300 ${accuracy >= 80 ? 'bg-green-500' :
                                                                    accuracy >= 60 ? 'bg-blue-500' :
                                                                        accuracy >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${Math.min(accuracy, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {correct !== undefined && total !== undefined && (
                                                        <div className="text-xs text-slate-500">
                                                            {correct} out of {total} questions answered correctly
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

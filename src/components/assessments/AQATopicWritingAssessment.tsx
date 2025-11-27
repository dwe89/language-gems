'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Clock,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    Edit3,
    FileText,
    Target,
    Image as ImageIcon
} from 'lucide-react';
import { AQATopicAssessmentService, type AQATopicAssessmentDefinition } from '../../services/aqaTopicAssessmentService';

// Question Types for AQA Topic Writing Assessment
export interface AQATopicWritingQuestion {
    id: string;
    type: 'writing-90-words' | 'writing-150-words' | 'writing-40-words' | 'translation' | 'photocard';
    title: string;
    instructions: string;
    imageUrl?: string; // For photocard
    data: any; // Question-specific data structure
    marks: number; // Total marks for this question
}

interface AQATopicWritingAssessmentProps {
    language: 'es' | 'fr' | 'de';
    level: 'KS4';
    difficulty: 'foundation' | 'higher';
    theme: string;
    topic: string;
    identifier: string;
    studentId?: string;
    assignmentId?: string;
    onComplete: (results: any) => void;
    onQuestionComplete?: (questionId: string, answer: any, timeSpent: number) => void;
}

export default function AQATopicWritingAssessment({
    language,
    difficulty,
    theme,
    topic,
    identifier,
    studentId,
    assignmentId,
    onComplete,
    onQuestionComplete
}: AQATopicWritingAssessmentProps) {
    const [assessmentService] = useState(() => new AQATopicAssessmentService());
    const [assessment, setAssessment] = useState<AQATopicAssessmentDefinition | null>(null);
    const [questions, setQuestions] = useState<AQATopicWritingQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
    const [totalStartTime] = useState<number>(Date.now());
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const loadAssessment = async () => {
            try {
                setLoading(true);
                setError(null);

                const assessmentData = await assessmentService.getAssessmentByIdentifier(
                    language,
                    difficulty,
                    theme,
                    topic,
                    identifier
                );

                if (!assessmentData) {
                    setError('Assessment not found. Please check your selection and try again.');
                    return;
                }

                setAssessment(assessmentData);
                setTimeRemaining(assessmentData.time_limit_minutes * 60);

                const questionsData = await assessmentService.getQuestionsByAssessmentId(assessmentData.id);

                if (!questionsData || questionsData.length === 0) {
                    setError('No questions found for this assessment.');
                    return;
                }

                const transformedQuestions: AQATopicWritingQuestion[] = questionsData.map((q) => ({
                    id: q.id,
                    type: q.question_type as any,
                    title: q.title,
                    instructions: q.instructions,
                    imageUrl: q.question_data?.image_url || q.reading_text, // Fallback
                    data: q.question_data,
                    marks: q.marks
                }));

                setQuestions(transformedQuestions);
                setQuestionStartTime(Date.now());

            } catch (err) {
                console.error('Error loading topic assessment:', err);
                setError('Failed to load assessment. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadAssessment();
    }, [language, difficulty, theme, topic, identifier, assessmentService]);

    useEffect(() => {
        if (timeRemaining > 0 && !isCompleted && !loading) {
            timerRef.current = setTimeout(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleTimeUp();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [timeRemaining, isCompleted, loading]);

    const handleTimeUp = () => {
        setIsCompleted(true);
        setShowResults(true);
        const results = calculateResults();
        onComplete(results);
    };

    const handleAnswerChange = (questionId: string, text: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: text
        }));
    };

    const handleNextQuestion = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

        if (onQuestionComplete) {
            onQuestionComplete(currentQuestion.id, answers[currentQuestion.id], timeSpent);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setQuestionStartTime(Date.now());
        } else {
            setIsCompleted(true);
            setShowResults(true);
            const results = calculateResults();
            onComplete(results);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setQuestionStartTime(Date.now());
        }
    };

    const calculateResults = () => {
        const totalTimeSpent = Math.floor((Date.now() - totalStartTime) / 1000);
        const questionsCompleted = Object.keys(answers).filter(key => answers[key] && answers[key].trim() !== '').length;
        const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

        // Writing can't be auto-graded easily without AI.
        // For now, we just mark as completed if they wrote something.
        // In a real app, this would go to a teacher or AI marking service.

        let score = 0; // Placeholder score
        questions.forEach(q => {
            if (answers[q.id] && answers[q.id].trim().length > 10) {
                // Give full marks if they wrote something substantial (placeholder logic)
                score += q.marks;
            }
        });

        return {
            questionsCompleted,
            totalQuestions: questions.length,
            score: Math.round(score),
            totalMarks,
            percentage: totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0,
            totalTimeSpent,
            timeLimit: assessment?.time_limit_minutes ? assessment.time_limit_minutes * 60 : 0
        };
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const countWords = (text: string) => {
        if (!text) return 0;
        return text.trim().split(/\s+/).length;
    };

    if (loading) return <div>Loading...</div>; // Simplified loading
    if (error) return <div>Error: {error}</div>; // Simplified error
    if (showResults) {
        const results = calculateResults();
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white rounded-xl shadow-lg p-10 max-w-2xl w-full text-center">
                    <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6 animate-bounce" />
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-5">Writing Assessment Submitted!</h2>
                    <p className="text-gray-600 mb-8">Your writing has been saved. It will be reviewed by your teacher or AI marker.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                            <div className="text-4xl font-extrabold text-blue-700">{results.questionsCompleted}</div>
                            <div className="text-sm font-medium text-blue-800 mt-1">Tasks Completed</div>
                        </div>
                        <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
                            <div className="text-4xl font-extrabold text-orange-700">{formatTime(results.totalTimeSpent)}</div>
                            <div className="text-sm font-medium text-orange-800 mt-1">Time Taken</div>
                        </div>
                    </div>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                    >
                        Return to Topics
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg mb-6 p-5 flex flex-col sm:flex-row items-center justify-between border-b-4 border-purple-500">
                    <div className="flex items-center mb-4 sm:mb-0">
                        <Target className="h-6 w-6 text-purple-600 mr-3" />
                        <span className="text-md font-semibold text-gray-800">
                            {assessment?.exam_board === 'Edexcel' ? 'Edexcel' : assessment?.curriculum_level === 'ks3' ? 'KS3' : 'AQA'} Writing - Task {currentQuestionIndex + 1} of {questions.length}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-6 w-6 text-gray-500 mr-3" />
                        <span className={`text-md font-semibold ${timeRemaining < 120 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
                            {formatTime(timeRemaining)} <span className="text-sm font-normal text-gray-500">(Time Left)</span>
                        </span>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border-t-4 border-blue-500">
                    <div className="mb-6 pb-6 border-b border-gray-200">
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{currentQuestion.title}</h2>
                        <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">{currentQuestion.instructions}</p>

                        {currentQuestion.imageUrl && (
                            <div className="mt-4 mb-4">
                                <img src={currentQuestion.imageUrl} alt="Task Prompt" className="max-w-full h-auto rounded-lg shadow-md max-h-64 object-contain" />
                            </div>
                        )}

                        {currentQuestion.data.bullets && (
                            <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-700">
                                {currentQuestion.data.bullets.map((bullet: string, idx: number) => (
                                    <li key={idx}>{bullet}</li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Writing Area */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Response ({countWords(answers[currentQuestion.id] || '')} words)
                        </label>
                        <textarea
                            rows={12}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base leading-relaxed"
                            placeholder="Start writing here..."
                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                            value={answers[currentQuestion.id] || ''}
                        />
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <button
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestionIndex === 0}
                            className="inline-flex items-center px-5 py-2.5 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Previous
                        </button>
                        <button
                            onClick={handleNextQuestion}
                            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-200 font-semibold"
                        >
                            {currentQuestionIndex === questions.length - 1 ? 'Submit Assessment' : 'Next Task'}
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle,
    Check,
    X,
    ArrowRight,
    Trophy,
    Share2,
    RotateCcw,
    Star,
    Sparkles,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface VideoQuestion {
    id: string;
    timestamp: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    type: 'vocabulary' | 'grammar' | 'comprehension';
}

interface QuestionModePlayerProps {
    videoId: string;
    youtubeId: string;
    questions: VideoQuestion[];
    language: string;
    title?: string;
    onComplete?: (results: QuizResults) => void;
}

interface QuizResults {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    timeSpent: number;
    answers: { questionId: string; correct: boolean; userAnswer: string }[];
}

export default function QuestionModePlayer({
    videoId,
    youtubeId,
    questions,
    language,
    title,
    onComplete
}: QuestionModePlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);
    const [startTime] = useState(Date.now());
    const [answers, setAnswers] = useState<{ questionId: string; correct: boolean; userAnswer: string }[]>([]);
    const [linkCopied, setLinkCopied] = useState(false);

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100;

    const handleAnswerSelect = useCallback((answer: string) => {
        if (showResult) return;

        setSelectedAnswer(answer);
        const correct = answer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            setScore(prev => prev + 100 + (streak * 10));
            setStreak(prev => prev + 1);
        } else {
            setStreak(0);
        }

        setAnswers(prev => [...prev, {
            questionId: currentQuestion.id,
            correct,
            userAnswer: answer
        }]);
    }, [showResult, currentQuestion, streak]);

    const handleNext = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            // Quiz complete
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            const correctCount = answers.filter(a => a.correct).length + (isCorrect ? 1 : 0);
            const results: QuizResults = {
                totalQuestions: questions.length,
                correctAnswers: correctCount,
                accuracy: Math.round((correctCount / questions.length) * 100),
                timeSpent,
                answers: [...answers, { questionId: currentQuestion.id, correct: isCorrect, userAnswer: selectedAnswer || '' }]
            };
            setQuizComplete(true);
            onComplete?.(results);
        }
    }, [currentIndex, questions.length, startTime, answers, isCorrect, currentQuestion, selectedAnswer, onComplete]);

    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setStreak(0);
        setQuizComplete(false);
        setAnswers([]);
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/songs/${language}/video/${videoId}?tab=questions`;
        try {
            await navigator.clipboard.writeText(url);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'vocabulary': return 'from-emerald-500 to-emerald-600';
            case 'grammar': return 'from-purple-500 to-purple-600';
            case 'comprehension': return 'from-blue-500 to-blue-600';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    const getTypeBadgeColor = (type: string) => {
        switch (type) {
            case 'vocabulary': return 'bg-emerald-100 text-emerald-700';
            case 'grammar': return 'bg-purple-100 text-purple-700';
            case 'comprehension': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (questions.length === 0) {
        return (
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
                <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">No Questions Available</h3>
                <p className="text-slate-500">Questions haven't been added to this video yet.</p>
            </div>
        );
    }

    // Quiz Complete Screen
    if (quizComplete) {
        const finalCorrect = answers.filter(a => a.correct).length;
        const finalAccuracy = Math.round((finalCorrect / questions.length) * 100);

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="p-8 md:p-12 text-center text-white">
                    {/* Trophy Animation */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', duration: 0.8 }}
                        className="mb-6"
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/30">
                            <Trophy className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Quiz Complete!</h2>
                    <p className="text-purple-200 text-lg mb-8">{title || 'Video Quiz'}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-3xl font-bold">{finalCorrect}/{questions.length}</div>
                            <div className="text-purple-200 text-sm">Correct</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-3xl font-bold">{finalAccuracy}%</div>
                            <div className="text-purple-200 text-sm">Accuracy</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="text-3xl font-bold">{score}</div>
                            <div className="text-purple-200 text-sm">Score</div>
                        </div>
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center gap-2 mb-8">
                        {[1, 2, 3].map(star => (
                            <motion.div
                                key={star}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: finalAccuracy >= star * 33 ? 1 : 0.3,
                                    y: 0
                                }}
                                transition={{ delay: star * 0.2 }}
                            >
                                <Star
                                    className={`w-10 h-10 ${finalAccuracy >= star * 33 ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            onClick={handleRestart}
                            variant="outline"
                            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                        <Button
                            onClick={handleShare}
                            className="bg-white text-purple-700 hover:bg-purple-50"
                        >
                            {linkCopied ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Link Copied!
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share Quiz
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className={`bg-gradient-to-br ${getTypeColor(currentQuestion.type)} rounded-2xl shadow-2xl overflow-hidden`}>
            {/* Header */}
            <div className="p-4 md:p-6 bg-black/20">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Badge className={getTypeBadgeColor(currentQuestion.type)}>
                            {currentQuestion.type}
                        </Badge>
                        <span className="text-white/80 text-sm">
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {streak > 1 && (
                            <div className="flex items-center gap-1 text-yellow-300">
                                <Sparkles className="w-4 h-4" />
                                <span className="font-bold">{streak}x streak!</span>
                            </div>
                        )}
                        <div className="text-white font-bold">
                            Score: {score}
                        </div>
                    </div>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white/60 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
                            {currentQuestion.question}
                        </h2>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = selectedAnswer === option;
                                const isCorrectAnswer = option === currentQuestion.correctAnswer;
                                const showCorrectHighlight = showResult && isCorrectAnswer;
                                const showWrongHighlight = showResult && isSelected && !isCorrectAnswer;

                                return (
                                    <motion.button
                                        key={idx}
                                        onClick={() => handleAnswerSelect(option)}
                                        disabled={showResult}
                                        whileHover={!showResult ? { scale: 1.02 } : {}}
                                        whileTap={!showResult ? { scale: 0.98 } : {}}
                                        className={`
                                            relative p-4 md:p-5 rounded-xl text-left font-medium text-lg
                                            transition-all duration-200
                                            ${!showResult
                                                ? 'bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 hover:border-white/40'
                                                : showCorrectHighlight
                                                    ? 'bg-green-500 text-white border-2 border-green-400'
                                                    : showWrongHighlight
                                                        ? 'bg-red-500 text-white border-2 border-red-400'
                                                        : 'bg-white/5 text-white/50 border-2 border-white/10'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span>{option}</span>
                                        </div>
                                        {showCorrectHighlight && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <Check className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                        {showWrongHighlight && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <X className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Result Feedback */}
                        <AnimatePresence>
                            {showResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 text-center"
                                >
                                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold mb-4 ${isCorrect
                                        ? 'bg-green-500/30 text-green-100'
                                        : 'bg-red-500/30 text-red-100'
                                        }`}>
                                        {isCorrect ? (
                                            <>
                                                <Check className="w-6 h-6" />
                                                Correct! +{100 + ((streak - 1) * 10)} points
                                            </>
                                        ) : (
                                            <>
                                                <X className="w-6 h-6" />
                                                Incorrect
                                            </>
                                        )}
                                    </div>

                                    {currentQuestion.explanation && (
                                        <p className="text-white/80 mb-6 max-w-md mx-auto">
                                            {currentQuestion.explanation}
                                        </p>
                                    )}

                                    <Button
                                        onClick={handleNext}
                                        size="lg"
                                        className="bg-white text-slate-800 hover:bg-slate-100 font-bold"
                                    >
                                        {currentIndex < questions.length - 1 ? (
                                            <>
                                                Next Question
                                                <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        ) : (
                                            <>
                                                See Results
                                                <Trophy className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Share Button */}
            <div className="p-4 bg-black/20 flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                >
                    {linkCopied ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Quiz
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

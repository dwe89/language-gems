'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    SkipForward,
    Volume2,
    VolumeX,
    Mic,
    Music,
    Trophy,
    Star,
    CheckCircle,
    XCircle,
    Zap,
    RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import VideoPlayer, { VideoPlayerHandle } from './VideoPlayer';

// Types
export interface LyricLine {
    id: number;
    timestamp: number; // seconds
    endTimestamp?: number;
    text: string;
    translation?: string;
}

export interface KaraokeQuestion {
    id: string;
    timestamp: number; // When to pause and ask
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    type: 'vocabulary' | 'grammar' | 'comprehension';
}

interface KaraokePlayerProps {
    videoId: string; // Database video ID (not YouTube ID)
    youtubeId: string;
    lyrics: LyricLine[];
    questions?: KaraokeQuestion[];
    language: string;
    title?: string;
    onComplete?: (results: KaraokeResults) => void;
    mode?: 'karaoke' | 'challenge';
}

interface KaraokeResults {
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    completionPercentage: number;
    lyricsFilled: number;
}

type GamePhase = 'intro' | 'playing' | 'paused-question' | 'complete';

export default function KaraokePlayer({
    videoId,
    youtubeId,
    lyrics,
    questions = [],
    language,
    title,
    onComplete,
    mode = 'karaoke'
}: KaraokePlayerProps) {
    // Refs
    const playerRef = useRef<VideoPlayerHandle>(null);
    const progressCheckRef = useRef<NodeJS.Timeout | null>(null);

    // State
    const [gamePhase, setGamePhase] = useState<GamePhase>('intro');
    const [currentTime, setCurrentTime] = useState(0);
    const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
    const [showTranslation, setShowTranslation] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    // Question state
    const [currentQuestion, setCurrentQuestion] = useState<KaraokeQuestion | null>(null);
    const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // Scoring
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [streak, setStreak] = useState(0);

    // Challenge mode - fill in gaps
    const [gapAnswers, setGapAnswers] = useState<Map<number, { word: string; correct: boolean }>>(new Map());
    const [activeGap, setActiveGap] = useState<{ lineId: number; wordIndex: number } | null>(null);

    // Find current lyric based on timestamp
    useEffect(() => {
        if (lyrics.length === 0) return;

        const currentIndex = lyrics.findIndex((line, idx) => {
            const nextLine = lyrics[idx + 1];
            const endTime = line.endTimestamp || (nextLine ? nextLine.timestamp : Infinity);
            return currentTime >= line.timestamp && currentTime < endTime;
        });

        if (currentIndex !== -1 && currentIndex !== activeLyricIndex) {
            setActiveLyricIndex(currentIndex);
        }
    }, [currentTime, lyrics, activeLyricIndex]);

    // Check for questions that need to trigger
    useEffect(() => {
        if (gamePhase !== 'playing' || questions.length === 0) return;

        const upcomingQuestion = questions.find(q =>
            !answeredQuestions.has(q.id) &&
            currentTime >= q.timestamp &&
            currentTime < q.timestamp + 1
        );

        if (upcomingQuestion) {
            // Pause video and show question
            playerRef.current?.pauseVideo();
            setCurrentQuestion(upcomingQuestion);
            setGamePhase('paused-question');
        }
    }, [currentTime, questions, answeredQuestions, gamePhase]);

    // Progress tracking
    const handleProgress = useCallback((seconds: number, percentage: number) => {
        setCurrentTime(seconds);
    }, []);

    // Start the karaoke session
    const startKaraoke = () => {
        setGamePhase('playing');
        playerRef.current?.playVideo();
    };

    // Answer a question
    const handleAnswerSelect = (answer: string) => {
        if (!currentQuestion || showFeedback) return;

        setSelectedAnswer(answer);
        setShowFeedback(true);

        const isCorrect = answer === currentQuestion.correctAnswer;

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            setStreak(prev => prev + 1);
            const bonusPoints = streak >= 3 ? 5 : 0; // Streak bonus
            setScore(prev => prev + 10 + bonusPoints);
        } else {
            setStreak(0);
        }

        setAnsweredQuestions(prev => new Set([...prev, currentQuestion.id]));
    };

    // Continue after question
    const continueVideo = () => {
        setCurrentQuestion(null);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setGamePhase('playing');
        playerRef.current?.playVideo();
    };

    // Reset game
    const resetGame = () => {
        setGamePhase('intro');
        setScore(0);
        setCorrectAnswers(0);
        setStreak(0);
        setAnsweredQuestions(new Set());
        setCurrentQuestion(null);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setActiveLyricIndex(-1);
        setCurrentTime(0);
        setGapAnswers(new Map());
    };

    // Render lyrics with highlighting
    const renderLyrics = () => {
        if (lyrics.length === 0) {
            return (
                <div className="text-center py-8 text-slate-500">
                    <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No lyrics available for this song yet</p>
                </div>
            );
        }

        // Show current line and surrounding context
        const startIdx = Math.max(0, activeLyricIndex - 1);
        const endIdx = Math.min(lyrics.length, activeLyricIndex + 3);
        const visibleLyrics = lyrics.slice(startIdx, endIdx);

        return (
            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {visibleLyrics.map((line, idx) => {
                        const globalIdx = startIdx + idx;
                        const isActive = globalIdx === activeLyricIndex;
                        const isPast = globalIdx < activeLyricIndex;

                        return (
                            <motion.div
                                key={line.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: isPast ? 0.5 : 1,
                                    y: 0,
                                    scale: isActive ? 1.05 : 1
                                }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className={`p-4 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400 shadow-lg'
                                    : isPast
                                        ? 'bg-slate-100/50'
                                        : 'bg-slate-50'
                                    }`}
                            >
                                <p className={`text-lg font-medium ${isActive ? 'text-purple-700' : isPast ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                    {line.text}
                                </p>
                                {showTranslation && line.translation && (
                                    <p className={`text-sm mt-1 ${isActive ? 'text-purple-500' : 'text-slate-400'
                                        }`}>
                                        {line.translation}
                                    </p>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        );
    };

    // Unified Render
    return (
        <div className="space-y-6 relative max-w-4xl mx-auto">
            {/* Intro Overlay - Only shown when gamePhase is intro */}
            {gamePhase === 'intro' && (
                <div className="absolute inset-0 z-50 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 rounded-2xl p-8 text-white flex flex-col items-center justify-center text-center shadow-2xl">
                    <div className="space-y-6 max-w-lg">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                            {mode === 'karaoke' ? (
                                <Mic className="w-10 h-10" />
                            ) : (
                                <Trophy className="w-10 h-10" />
                            )}
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                {mode === 'karaoke' ? '🎤 Karaoke Mode' : '🏆 Sing-Along Challenge'}
                            </h2>
                            {title && <p className="text-xl text-purple-200">{title}</p>}
                        </div>

                        <div className="text-purple-200 space-y-2">
                            <p>🎵 Synced lyrics & interactive questions</p>
                            <p>⭐ Earn points for streaks & accuracy</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Badge className="bg-white/20 text-white px-4 py-2">
                                <Music className="w-4 h-4 mr-2" />
                                {lyrics.length} lyrics
                            </Badge>
                            <Badge className="bg-white/20 text-white px-4 py-2">
                                <Zap className="w-4 h-4 mr-2" />
                                {questions.length} questions
                            </Badge>
                        </div>

                        <Button
                            onClick={startKaraoke}
                            size="lg"
                            className="bg-white text-purple-700 hover:bg-purple-100 font-bold text-lg px-8 py-6 rounded-full shadow-xl hover:scale-105 transition-transform"
                        >
                            <Play className="w-6 h-6 mr-2" />
                            Start {mode === 'karaoke' ? 'Karaoke' : 'Challenge'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Main Game Interface */}
            <div className={`transition-opacity duration-500 ${gamePhase === 'intro' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

                {/* Score bar */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white mb-6 shadow-lg">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Badge className="bg-white/20 text-white border-0">
                                <Star className="w-4 h-4 mr-1 text-yellow-300" />
                                {score}
                            </Badge>
                            <Badge className="bg-white/20 text-white border-0">
                                <CheckCircle className="w-4 h-4 mr-1 text-green-300" />
                                {correctAnswers}/{questions.length}
                            </Badge>
                            {streak >= 2 && (
                                <Badge className="bg-yellow-400 text-yellow-900 border-0 animate-bounce">
                                    🔥 {streak}
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowTranslation(!showTranslation)}
                                className="text-white hover:bg-white/20 h-8"
                            >
                                {showTranslation ? 'Hide' : 'Show'} Trans
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetGame}
                                className="text-white hover:bg-white/20 h-8 w-8 p-0"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Video Player Container with Question Overlay */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video group my-6">
                    <VideoPlayer
                        ref={playerRef}
                        videoId={youtubeId}
                        autoplay={false}
                        onProgress={handleProgress}
                        language={language}
                        // Use w-full h-full to fill container
                        width="100%"
                        height="100%"
                    />

                    {/* Question Overlay */}
                    <AnimatePresence>
                        {gamePhase === 'paused-question' && currentQuestion && (
                            <motion.div
                                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                className="absolute inset-0 z-40 bg-black/80 flex items-center justify-center p-6"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
                                >
                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-white flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-5 h-5" />
                                            <span className="font-bold">Quick Quiz</span>
                                        </div>
                                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                                            {currentQuestion.type || 'Vocabulary'}
                                        </Badge>
                                    </div>

                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold text-slate-800 text-center mb-8">
                                            {currentQuestion.question}
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {currentQuestion.options.map((option, idx) => {
                                                const isSelected = selectedAnswer === option;
                                                const isCorrect = option === currentQuestion.correctAnswer;

                                                let buttonStyle = "p-4 rounded-xl border-2 font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ";

                                                if (showFeedback) {
                                                    if (isCorrect) buttonStyle += "bg-green-100 border-green-500 text-green-700 shadow-green-200";
                                                    else if (isSelected) buttonStyle += "bg-red-100 border-red-500 text-red-700";
                                                    else buttonStyle += "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                                                } else {
                                                    buttonStyle += isSelected
                                                        ? "bg-purple-100 border-purple-500 text-purple-700"
                                                        : "bg-white border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 shadow-sm";
                                                }

                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleAnswerSelect(option)}
                                                        disabled={showFeedback}
                                                        className={buttonStyle}
                                                    >
                                                        {option}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {showFeedback && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-6 text-center"
                                            >
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${selectedAnswer === currentQuestion.correctAnswer
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {selectedAnswer === currentQuestion.correctAnswer
                                                        ? <><CheckCircle className="w-4 h-4" /> Correct!</>
                                                        : <><XCircle className="w-4 h-4" /> Incorrect</>
                                                    }
                                                </div>

                                                {currentQuestion.explanation && (
                                                    <p className="text-slate-600 mb-6 italic">
                                                        {currentQuestion.explanation}
                                                    </p>
                                                )}

                                                <Button
                                                    onClick={continueVideo}
                                                    size="lg"
                                                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 px-12 rounded-full shadow-lg"
                                                >
                                                    Continue Video <Play className="w-5 h-5 ml-2" />
                                                </Button>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Lyrics Display - LyricsTraining Style Below Video */}
                <div className="space-y-4 max-w-2xl mx-auto">
                    {!currentQuestion && gamePhase !== 'intro' && (
                        <Card className="border-t-4 border-t-purple-500 shadow-lg">
                            <CardContent className="p-6 text-center">
                                {renderLyrics()}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

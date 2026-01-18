'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { MobilePageWrapper } from '../../../components/capacitor';
import { getFilteredVocabulary, SupportedLanguage, recordGameSession } from '../../../lib/mobile';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Trophy, Play, Building2, Check, X } from 'lucide-react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

interface SentenceWord {
    id: string;
    word: string;
    translation: string;
}

interface GameState {
    status: 'menu' | 'playing' | 'complete';
    score: number;
    currentIndex: number;
    correct: number;
    incorrect: number;
    streak: number;
    highScore: number;
}

export default function MobileSentenceTowersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const langParam = searchParams.get('lang') as SupportedLanguage;
    const catParam = searchParams.get('cat') || undefined;
    const subParam = searchParams.get('sub') || undefined;
    const levelParam = searchParams.get('level') as 'KS3' | 'KS4' || 'KS3';
    const tierParam = searchParams.get('tier') as 'foundation' | 'higher' | undefined;
    const boardParam = searchParams.get('board') as 'AQA' | 'EDEXCEL' | 'WJEC' | undefined;

    const [language, setLanguage] = useState<SupportedLanguage>(langParam || 'spanish');
    const [vocabulary, setVocabulary] = useState<SentenceWord[]>([]);
    const [loading, setLoading] = useState(true);

    const [gameState, setGameState] = useState<GameState>({
        status: 'menu',
        score: 0,
        currentIndex: 0,
        correct: 0,
        incorrect: 0,
        streak: 0,
        highScore: 0,
    });

    const [currentWord, setCurrentWord] = useState<SentenceWord | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [towerHeight, setTowerHeight] = useState(0);

    // Load vocabulary
    useEffect(() => {
        const loadVocab = async () => {
            setLoading(true);
            try {
                const words = await getFilteredVocabulary({
                    language: langParam || 'spanish',
                    category: catParam,
                    subcategory: subParam,
                    curriculumLevel: levelParam,
                    tier: tierParam,
                    examBoard: boardParam
                });

                const puzzleWords: SentenceWord[] = words.map(w => ({
                    id: w.id,
                    word: w.word,
                    translation: w.translation,
                }));

                const shuffled = puzzleWords.sort(() => 0.5 - Math.random()).slice(0, 20);
                setVocabulary(shuffled);
            } catch (error) {
                console.error('Failed to load vocabulary:', error);
            } finally {
                setLoading(false);
            }
        };

        loadVocab();

        // Load high score
        const saved = localStorage.getItem(`sentence_towers_highscore_${langParam || 'spanish'}`);
        if (saved) {
            setGameState(prev => ({ ...prev, highScore: parseInt(saved) }));
        }
    }, [langParam, catParam, subParam, levelParam, tierParam, boardParam]);

    const generateOptions = useCallback((correctWord: SentenceWord) => {
        const wrongOptions = vocabulary
            .filter(w => w.id !== correctWord.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(w => w.translation);

        const allOptions = [...wrongOptions, correctWord.translation]
            .sort(() => 0.5 - Math.random());

        setOptions(allOptions);
    }, [vocabulary]);

    const startGame = useCallback(() => {
        if (vocabulary.length === 0) return;

        const firstWord = vocabulary[0];
        setCurrentWord(firstWord);
        generateOptions(firstWord);
        setTowerHeight(0);

        setGameState({
            status: 'playing',
            score: 0,
            currentIndex: 0,
            correct: 0,
            incorrect: 0,
            streak: 0,
            highScore: gameState.highScore,
        });

        setSelectedAnswer(null);
        setShowResult(false);

        try { Haptics.impact({ style: ImpactStyle.Medium }); } catch { }
    }, [vocabulary, generateOptions, gameState.highScore]);

    const handleAnswer = useCallback((answer: string) => {
        if (showResult || !currentWord) return;

        setSelectedAnswer(answer);
        setShowResult(true);

        const isCorrect = answer === currentWord.translation;

        if (isCorrect) {
            try { Haptics.impact({ style: ImpactStyle.Heavy }); } catch { }
            setTowerHeight(prev => prev + 1);

            setGameState(prev => ({
                ...prev,
                score: prev.score + 100 + (prev.streak * 20),
                correct: prev.correct + 1,
                streak: prev.streak + 1,
            }));
        } else {
            try { Haptics.notification({ type: NotificationType.Error }); } catch { }

            setGameState(prev => ({
                ...prev,
                incorrect: prev.incorrect + 1,
                streak: 0,
            }));
        }

        // Move to next word after delay
        setTimeout(() => {
            const nextIndex = gameState.currentIndex + 1;

            if (nextIndex >= vocabulary.length) {
                // Game complete
                endGame();
            } else {
                const nextWord = vocabulary[nextIndex];
                setCurrentWord(nextWord);
                generateOptions(nextWord);
                setSelectedAnswer(null);
                setShowResult(false);
                setGameState(prev => ({ ...prev, currentIndex: nextIndex }));
            }
        }, 1500);
    }, [showResult, currentWord, vocabulary, gameState.currentIndex, generateOptions]);

    const endGame = useCallback(() => {
        const finalScore = gameState.score;

        if (finalScore > gameState.highScore) {
            localStorage.setItem(`sentence_towers_highscore_${langParam || 'spanish'}`, finalScore.toString());
        }

        recordGameSession({
            gameType: 'sentence-towers',
            language: langParam || 'spanish',
            score: finalScore,
            accuracy: vocabulary.length > 0 ? Math.round((gameState.correct / vocabulary.length) * 100) : 0,
            wordsCorrect: gameState.correct,
            wordsTotal: vocabulary.length,
            xpEarned: Math.floor(finalScore / 10),
            duration: 0,
            completedAt: new Date().toISOString(),
        });

        setGameState(prev => ({
            ...prev,
            status: 'complete',
            highScore: Math.max(finalScore, prev.highScore),
        }));
    }, [gameState.score, gameState.correct, gameState.highScore, langParam, vocabulary.length]);

    if (loading) {
        return (
            <MobilePageWrapper showHeader={false} safeAreaTop={false} safeAreaBottom={false}>
                <div className="h-screen bg-slate-900 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </MobilePageWrapper>
        );
    }

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true} safeAreaBottom={true}>
            <div className="h-screen bg-gradient-to-b from-slate-900 via-blue-900/50 to-slate-900 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 px-4 pt-2 pb-2 flex items-center justify-between">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/mobile-games')}
                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </motion.button>

                    <div className="flex flex-col items-center">
                        <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Sentence Towers</span>
                        {gameState.status === 'playing' && (
                            <span className="text-white/70 text-xs">
                                {gameState.currentIndex + 1} / {vocabulary.length}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full">
                        <Trophy className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-bold text-white">{gameState.score}</span>
                    </div>
                </div>

                {/* Game Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {gameState.status === 'playing' && currentWord ? (
                        <>
                            {/* Tower visualization */}
                            <div className="flex-shrink-0 h-32 flex items-end justify-center px-4 pb-2">
                                <div className="flex flex-col-reverse items-center">
                                    {[...Array(Math.min(towerHeight, 8))].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, y: 20 }}
                                            animate={{ scale: 1, y: 0 }}
                                            className="w-16 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-sm mb-0.5 shadow-lg"
                                        />
                                    ))}
                                    <div className="w-20 h-2 bg-slate-700 rounded-full" />
                                </div>
                                {towerHeight > 0 && (
                                    <span className="absolute right-4 text-blue-400 font-bold text-lg">
                                        {towerHeight} blocks
                                    </span>
                                )}
                            </div>

                            {/* Question */}
                            <div className="flex-shrink-0 px-6 py-4 text-center">
                                <p className="text-white/50 text-sm mb-2">Translate this word:</p>
                                <motion.p
                                    key={currentWord.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-3xl font-bold text-white"
                                >
                                    {currentWord.word}
                                </motion.p>

                                {gameState.streak >= 3 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="mt-2 inline-block px-3 py-1 bg-amber-500/20 rounded-full"
                                    >
                                        <span className="text-amber-400 text-sm font-bold">🔥 {gameState.streak} streak!</span>
                                    </motion.div>
                                )}
                            </div>

                            {/* Options */}
                            <div className="flex-1 px-4 py-4 flex flex-col justify-center gap-3">
                                {options.map((option, index) => {
                                    const isSelected = selectedAnswer === option;
                                    const isCorrect = option === currentWord.translation;
                                    const showCorrectness = showResult && (isSelected || isCorrect);

                                    return (
                                        <motion.button
                                            key={`${currentWord.id}-${index}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAnswer(option)}
                                            disabled={showResult}
                                            className={`w-full py-4 px-6 rounded-2xl font-semibold text-left transition-all flex items-center justify-between ${showCorrectness
                                                ? isCorrect
                                                    ? 'bg-emerald-500 text-white'
                                                    : isSelected
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-white/10 text-white/50'
                                                : 'bg-white/10 text-white hover:bg-white/20 active:bg-white/30'
                                                }`}
                                        >
                                            <span>{option}</span>
                                            {showCorrectness && isCorrect && (
                                                <Check className="w-6 h-6" />
                                            )}
                                            {showCorrectness && isSelected && !isCorrect && (
                                                <X className="w-6 h-6" />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </>
                    ) : gameState.status === 'menu' ? (
                        <div className="flex-1 flex items-center justify-center p-6">
                            <div className="w-full max-w-sm text-center">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mb-8"
                                >
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-blue-500/30 mb-4">
                                        <Building2 className="w-12 h-12 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-white mb-2">Sentence Towers</h1>
                                    <p className="text-white/60">Build your tower by answering correctly!</p>
                                </motion.div>

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={startGame}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl font-bold text-white text-lg shadow-lg mb-4 flex items-center justify-center gap-2"
                                >
                                    <Play className="w-6 h-6 fill-current" />
                                    Start Building
                                </motion.button>

                                <div className="text-white/40 text-sm">
                                    High Score: <span className="text-white font-mono">{gameState.highScore}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-6">
                            <div className="w-full max-w-sm text-center bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                                <div className="text-6xl mb-4">🏛️</div>
                                <h2 className="text-2xl font-bold text-white mb-2">Tower Complete!</h2>
                                <div className="text-5xl font-bold text-blue-400 mb-2">{gameState.score}</div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/10 rounded-xl p-3">
                                        <div className="text-2xl font-bold text-emerald-400">{gameState.correct}</div>
                                        <div className="text-xs text-white/50">Correct</div>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-3">
                                        <div className="text-2xl font-bold text-rose-400">{gameState.incorrect}</div>
                                        <div className="text-xs text-white/50">Incorrect</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={startGame}
                                        className="w-full py-3 bg-blue-600 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        Build Again
                                    </button>
                                    <button
                                        onClick={() => router.push('/mobile-games')}
                                        className="w-full py-3 bg-white/10 rounded-xl font-bold text-white"
                                    >
                                        Exit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MobilePageWrapper>
    );
}

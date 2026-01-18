'use client';

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import { MobilePageWrapper } from '../../../components/capacitor';
import { SupportedLanguage, getFilteredVocabulary, recordGameSession } from '../../../lib/mobile';

// Import the game components from activities
import { VocabMasterGameEngine } from '../../activities/vocab-master/components/VocabMasterGameEngine';
import { GameCompletionScreen } from '../../activities/vocab-master/components/GameCompletionScreen';
import { GameResult } from '../../activities/vocab-master/types';

interface GameVocabularyWord {
    id: string;
    word: string;
    translation: string;
    spanish?: string;
    english?: string;
    category?: string;
    subcategory?: string;
    part_of_speech?: string;
    language?: string;
    audio_url?: string;
    mastery_level?: number;
    startTime?: number;
}

// Content component that uses useSearchParams
function VocabMasterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isDemo } = useUnifiedAuth();

    // Parse settings from URL
    const langParam = searchParams.get('lang') as SupportedLanguage || 'spanish';
    const catParam = searchParams.get('cat') || undefined;
    const subParam = searchParams.get('sub') || undefined;
    const levelParam = searchParams.get('level') as 'KS3' | 'KS4' || 'KS3';
    const tierParam = searchParams.get('tier') as 'foundation' | 'higher' | undefined;
    const boardParam = searchParams.get('board') as 'AQA' | 'EDEXCEL' | 'WJEC' | undefined;
    const assignmentId = searchParams.get('assignmentId');

    const [loading, setLoading] = useState(true);
    const [vocabulary, setVocabulary] = useState<GameVocabularyWord[]>([]);
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'complete'>('menu');
    const [selectedMode, setSelectedMode] = useState<string>('multiple_choice');
    const [gameResults, setGameResults] = useState<any>(null);

    // Load vocabulary
    useEffect(() => {
        loadVocabulary();
    }, [langParam, catParam, subParam, levelParam, tierParam, boardParam]);

    const loadVocabulary = async () => {
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

            const gameWords: GameVocabularyWord[] = words.map(w => ({
                id: String(w.id),
                word: w.word,
                translation: w.translation,
                spanish: w.word,
                english: w.translation,
                category: w.category || 'general',
                subcategory: w.subcategory || 'general',
                part_of_speech: 'noun',
                language: langParam || 'spanish',
                audio_url: w.audioUrl,
                mastery_level: 0,
                startTime: Date.now()
            }));

            const shuffled = gameWords.sort(() => 0.5 - Math.random()).slice(0, 30);
            setVocabulary(shuffled);
        } catch (error) {
            console.error('Failed to load vocabulary:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = useCallback(() => {
        if (gameState === 'playing') {
            setGameState('menu');
        } else if (assignmentId) {
            router.push('/mobile-assignments');
        } else {
            router.push('/mobile-games');
        }
    }, [router, assignmentId, gameState]);

    const handleStartGame = useCallback((mode: string) => {
        setSelectedMode(mode);
        setGameState('playing');
    }, []);

    const handleGameComplete = useCallback((results: GameResult) => {
        // Record game session
        recordGameSession({
            gameType: 'vocab-master',
            language: langParam || 'spanish',
            score: results.score || 0,
            accuracy: results.accuracy || 0,
            wordsCorrect: results.correctAnswers || 0,
            wordsTotal: results.totalWords || vocabulary.length,
            xpEarned: Math.floor((results.score || 0) / 10),
            duration: results.timeSpent || 0,
            completedAt: new Date().toISOString(),
        });

        setGameResults({
            score: results.score,
            accuracy: results.accuracy,
            totalWords: results.totalWords,
            correctAnswers: results.correctAnswers,
            incorrectAnswers: results.incorrectAnswers,
            timeSpent: results.timeSpent,
            maxStreak: results.maxStreak,
            wordsLearned: results.wordsLearned,
            wordsStruggling: results.wordsStruggling,
            gemsCollected: results.gemsCollected,
            mode: selectedMode
        });
        setGameState('complete');
    }, [langParam, selectedMode, vocabulary.length]);

    const handlePlayAgain = useCallback(() => {
        // Reshuffle vocabulary
        setVocabulary(prev => [...prev].sort(() => 0.5 - Math.random()));
        setGameResults(null);
        setGameState('menu');
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-amber-900 via-slate-900 to-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-amber-200">Loading vocabulary...</p>
                </div>
            </div>
        );
    }

    if (vocabulary.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-amber-900 via-slate-900 to-slate-900 p-6">
                <div className="text-6xl mb-4">👑</div>
                <h2 className="text-xl font-bold text-white mb-2">No Vocabulary Available</h2>
                <p className="text-white/60 text-center mb-6">
                    No words found for the selected options. Try a different category or language.
                </p>
                <button
                    onClick={() => router.push('/mobile-games')}
                    className="px-6 py-3 bg-amber-600 rounded-xl font-semibold text-white"
                >
                    Back to Games
                </button>
            </div>
        );
    }

    // Show game if playing
    if (gameState === 'playing') {
        return (
            <div className="h-full w-full">
                <VocabMasterGameEngine
                    config={{
                        mode: selectedMode,
                        vocabulary: vocabulary,
                        audioEnabled: true,
                        assignmentMode: !!assignmentId
                    }}
                    gameSessionId={`mobile-${Date.now()}`}
                    gameService={null}
                    onGameComplete={handleGameComplete}
                    onExit={handleBack}
                    onWordAttempt={(word, translation, answer, isCorrect, responseTime, gameMode) => {
                        console.log('Word attempt:', { word, isCorrect, responseTime });
                    }}
                    onOpenSettings={() => { }}
                />
            </div>
        );
    }

    // Show completion screen
    if (gameState === 'complete' && gameResults) {
        return (
            <div className="h-full w-full">
                <GameCompletionScreen
                    result={gameResults}
                    onPlayAgain={handlePlayAgain}
                    onBackToMenu={handleBack}
                />
            </div>
        );
    }

    // Show menu
    const gameModes = [
        { id: 'multiple_choice', name: 'Multiple Choice', icon: '🎯', description: 'Pick the correct translation' },
        { id: 'typing', name: 'Typing', icon: '⌨️', description: 'Type the translation' },
        { id: 'speed', name: 'Speed Round', icon: '⚡', description: 'Answer quickly!' },
        { id: 'listening', name: 'Listening', icon: '🎧', description: 'Listen and translate' },
    ];

    return (
        <div className="h-full bg-gradient-to-b from-amber-900 via-slate-900 to-slate-900 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 px-4 pt-4 pb-2">
                <button
                    onClick={() => router.push('/mobile-games')}
                    className="flex items-center gap-2 text-white/70 hover:text-white"
                >
                    <span className="text-lg">←</span>
                    <span className="text-sm">Back</span>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-8">
                {/* Game Header */}
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-amber-500/30 mb-3">
                        <span className="text-4xl">👑</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Vocab Master</h1>
                    <p className="text-white/60 text-sm">Master vocabulary across all modes</p>
                </div>

                {/* Vocabulary Info */}
                <div className="bg-white/10 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white/60 text-xs uppercase tracking-wider">Words Ready</p>
                            <p className="text-white font-bold text-2xl">{vocabulary.length}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/60 text-xs uppercase tracking-wider">Language</p>
                            <p className="text-white font-bold text-lg">
                                {langParam === 'spanish' ? '🇪🇸 Spanish' :
                                    langParam === 'french' ? '🇫🇷 French' : '🇩🇪 German'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Game Modes */}
                <div className="space-y-3">
                    <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-2">Choose a Mode</p>
                    {gameModes.map(mode => (
                        <button
                            key={mode.id}
                            onClick={() => handleStartGame(mode.id)}
                            className="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-2xl">
                                {mode.icon}
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-semibold text-white">{mode.name}</p>
                                <p className="text-white/50 text-sm">{mode.description}</p>
                            </div>
                            <div className="text-amber-400">→</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function MobileVocabMasterPage() {
    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true} safeAreaBottom={true}>
            <div className="h-screen w-full">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full bg-gradient-to-b from-amber-900 via-slate-900 to-slate-900">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    </div>
                }>
                    <VocabMasterContent />
                </Suspense>
            </div>
        </MobilePageWrapper>
    );
}

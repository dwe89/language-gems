'use client';

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { MobilePageWrapper } from '../../../components/capacitor';
import { SupportedLanguage, getFilteredVocabulary, recordGameSession } from '../../../lib/mobile';

// Import the actual game component from activities
import DetectiveListeningGameWrapper from '../../activities/detective-listening/components/DetectiveListeningGameWrapper';

interface GameVocabularyWord {
    id: string | number;
    word: string;
    translation: string;
    language?: string;
    category?: string;
    subcategory?: string;
    part_of_speech?: string;
    audio_url?: string;
    example_sentence_original?: string;
    example_sentence_translation?: string;
    isCustomVocabulary?: boolean;
}

// Content component that uses useSearchParams
function DetectiveListeningContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

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
                id: w.id,
                word: w.word,
                translation: w.translation,
                language: langParam || 'spanish',
                category: w.category || 'general',
                subcategory: w.subcategory || 'general',
                part_of_speech: 'noun',
                audio_url: w.audioUrl,
                isCustomVocabulary: false
            }));

            const shuffled = gameWords.sort(() => 0.5 - Math.random()).slice(0, 20);
            setVocabulary(shuffled);
        } catch (error) {
            console.error('Failed to load vocabulary:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = useCallback(() => {
        if (assignmentId) {
            router.push('/mobile-assignments');
        } else {
            router.push('/mobile-games');
        }
    }, [router, assignmentId]);

    const handleGameEnd = useCallback((result: any) => {
        // Record game session
        recordGameSession({
            gameType: 'detective-listening',
            language: langParam || 'spanish',
            score: result?.correctAnswers ? result.correctAnswers * 100 : 0,
            accuracy: result?.totalEvidence ? Math.round((result.correctAnswers / result.totalEvidence) * 100) : 0,
            wordsCorrect: result?.correctAnswers || 0,
            wordsTotal: result?.totalEvidence || vocabulary.length,
            xpEarned: result?.correctAnswers ? result.correctAnswers * 15 : 0,
            duration: result?.timeSpent || 0,
            completedAt: new Date().toISOString(),
        });

        console.log('Detective Listening game ended:', result);
    }, [langParam, vocabulary.length]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p className="text-amber-200">Loading case files...</p>
                </div>
            </div>
        );
    }

    if (vocabulary.length < 3) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 p-6">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-white mb-2">Not Enough Evidence</h2>
                <p className="text-white/60 text-center mb-6">
                    Need at least 3 words to start an investigation. Try a different category or language.
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

    // Build settings object for the game
    const gameSettings = {
        caseType: catParam || 'basics_core_language',
        language: langParam === 'es' ? 'spanish' :
            langParam === 'fr' ? 'french' :
                langParam === 'de' ? 'german' : langParam || 'spanish',
        difficulty: 'medium',
        category: catParam || 'basics_core_language',
        subcategory: subParam || 'greetings_introductions',
        curriculumLevel: levelParam || 'KS3',
        examBoard: boardParam,
        tier: tierParam,
        theme: 'detective'
    };

    return (
        <div className="h-full w-full">
            <DetectiveListeningGameWrapper
                settings={gameSettings}
                vocabulary={vocabulary}
                onBackToMenu={handleBack}
                onGameEnd={handleGameEnd}
                assignmentId={assignmentId || undefined}
                userId={user?.id}
                onOpenSettings={() => { }}
            />
        </div>
    );
}

export default function MobileDetectiveListeningPage() {
    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={false} safeAreaBottom={false}>
            <div className="h-screen w-full">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                    </div>
                }>
                    <DetectiveListeningContent />
                </Suspense>
            </div>
        </MobilePageWrapper>
    );
}

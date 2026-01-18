'use client';

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { MobilePageWrapper } from '../../../components/capacitor';
import { SupportedLanguage, getFilteredVocabulary, recordGameSession } from '../../../lib/mobile';
import { useSentences } from '../../../hooks/useSentences';

// Import the actual game component from activities
import { ImprovedSentenceTowersGame } from '../../activities/sentence-towers/page';

// Content component that uses useSearchParams
function SentenceTowersContent() {
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
    const [gameVocabulary, setGameVocabulary] = useState<any[]>([]);

    // Map language codes to full names for the sentences hook
    const languageMap: Record<string, string> = {
        'spanish': 'es',
        'french': 'fr',
        'german': 'de',
        'es': 'es',
        'fr': 'fr',
        'de': 'de'
    };

    // Load sentences using the useSentences hook
    const { sentences, loading: sentencesLoading } = useSentences({
        language: languageMap[langParam] || 'es',
        category: catParam,
        subcategory: subParam,
        curriculumLevel: levelParam,
        limit: 30
    });

    // Transform sentences to game format when they load
    useEffect(() => {
        if (!sentencesLoading && sentences.length > 0) {
            const transformedSentences = sentences.map(sentence => ({
                id: sentence.id,
                word: sentence.source_sentence,
                translation: sentence.english_translation,
                language: sentence.source_language,
                category: sentence.category || 'general',
                subcategory: sentence.subcategory || 'general',
                part_of_speech: 'sentence',
                example_sentence_original: sentence.source_sentence,
                example_sentence_translation: sentence.english_translation,
                difficulty_level: sentence.difficulty_level || 'intermediate'
            }));

            // Shuffle and limit
            const shuffled = transformedSentences
                .sort(() => 0.5 - Math.random())
                .slice(0, 20);

            setGameVocabulary(shuffled);
            setLoading(false);
        } else if (!sentencesLoading && sentences.length === 0) {
            // Fallback to vocabulary if no sentences
            loadVocabularyFallback();
        }
    }, [sentences, sentencesLoading]);

    const loadVocabularyFallback = async () => {
        try {
            const words = await getFilteredVocabulary({
                language: langParam || 'spanish',
                category: catParam,
                subcategory: subParam,
                curriculumLevel: levelParam,
                tier: tierParam,
                examBoard: boardParam
            });

            const gameWords = words.map(w => ({
                id: w.id,
                word: w.word,
                translation: w.translation,
                language: langParam,
                category: w.category || 'general',
                subcategory: w.subcategory || 'general',
                part_of_speech: 'noun',
                difficulty_level: 'intermediate'
            }));

            const shuffled = gameWords.sort(() => 0.5 - Math.random()).slice(0, 20);
            setGameVocabulary(shuffled);
        } catch (error) {
            console.error('Failed to load vocabulary fallback:', error);
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

    const handleGameComplete = useCallback((result: any) => {
        // Record game session
        recordGameSession({
            gameType: 'sentence-towers',
            language: langParam || 'spanish',
            score: result?.score || 0,
            accuracy: result?.accuracy || 0,
            wordsCorrect: result?.wordsCompleted || 0,
            wordsTotal: gameVocabulary.length,
            xpEarned: result?.score ? Math.floor(result.score / 10) : 0,
            duration: result?.timeSpent || 0,
            completedAt: new Date().toISOString(),
        });

        console.log('Sentence Towers game completed:', result);
    }, [langParam, gameVocabulary.length]);

    if (loading || sentencesLoading) {
        return (
            <div className="flex items-center justify-center h-full text-white bg-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white/60">Loading sentences...</p>
                </div>
            </div>
        );
    }

    if (gameVocabulary.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-white bg-slate-900 p-6">
                <div className="text-6xl mb-4">🏛️</div>
                <h2 className="text-xl font-bold mb-2">No Content Available</h2>
                <p className="text-white/60 text-center mb-6">
                    No sentences found for the selected options. Try a different category or language.
                </p>
                <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-blue-600 rounded-xl font-semibold"
                >
                    Back to Games
                </button>
            </div>
        );
    }

    // Build config for the game
    const config = {
        language: langParam || 'spanish',
        categoryId: catParam || 'general',
        subcategoryId: subParam || '',
        curriculumLevel: levelParam as 'KS2' | 'KS3' | 'KS4' | 'KS5'
    };

    return (
        <div className="h-full bg-slate-900 flex flex-col">
            <ImprovedSentenceTowersGame
                gameVocabulary={gameVocabulary}
                onBackToMenu={handleBack}
                config={config}
                assignmentMode={!!assignmentId}
                isAssignmentMode={!!assignmentId}
                assignmentId={assignmentId || undefined}
                userId={user?.id}
                onGameComplete={handleGameComplete}
            />
        </div>
    );
}

export default function MobileSentenceTowersPage() {
    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={false} safeAreaBottom={false}>
            <div className="h-screen w-full bg-slate-900">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full text-white bg-slate-900">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                }>
                    <SentenceTowersContent />
                </Suspense>
            </div>
        </MobilePageWrapper>
    );
}

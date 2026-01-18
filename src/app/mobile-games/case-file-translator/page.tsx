'use client';

import React, { Suspense, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { MobilePageWrapper } from '../../../components/capacitor';
import { SupportedLanguage, recordGameSession } from '../../../lib/mobile';
import { useSentences } from '../../../hooks/useSentences';

// Import the actual game component from activities
import CaseFileTranslatorGameWrapper from '../../activities/case-file-translator/components/CaseFileTranslatorGameWrapper';

// Content component that uses useSearchParams
function CaseFileTranslatorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    // Parse settings from URL
    const langParam = searchParams.get('lang') as SupportedLanguage || 'spanish';
    const catParam = searchParams.get('cat') || undefined;
    const subParam = searchParams.get('sub') || undefined;
    const levelParam = searchParams.get('level') as 'KS3' | 'KS4' || 'KS3';
    const assignmentId = searchParams.get('assignmentId');

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
        limit: 20
    });

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
            gameType: 'case-file-translator',
            language: langParam || 'spanish',
            score: result?.score || 0,
            accuracy: result?.accuracy || 0,
            wordsCorrect: result?.correctAnswers || 0,
            wordsTotal: result?.totalCases || sentences.length,
            xpEarned: result?.score ? Math.floor(result.score / 10) : 0,
            duration: result?.timeSpent || 0,
            completedAt: new Date().toISOString(),
        });

        console.log('Case File Translator game ended:', result);
    }, [langParam, sentences.length]);

    if (sentencesLoading) {
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-blue-200">Loading case files...</p>
                </div>
            </div>
        );
    }

    if (sentences.length < 3) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 p-6">
                <div className="text-6xl mb-4">📁</div>
                <h2 className="text-xl font-bold text-white mb-2">Case Files Empty</h2>
                <p className="text-white/60 text-center mb-6">
                    Need at least 3 sentences to start translating. Try a different category or language.
                </p>
                <button
                    onClick={() => router.push('/mobile-games')}
                    className="px-6 py-3 bg-blue-600 rounded-xl font-semibold text-white"
                >
                    Back to Games
                </button>
            </div>
        );
    }

    // Build settings object for the game
    const gameSettings = {
        caseType: catParam || 'basics_core_language',
        language: langParam || 'spanish',
        curriculumLevel: levelParam || 'KS3',
        subcategory: subParam,
        difficulty: 'beginner'
    };

    return (
        <div className="h-full w-full">
            <CaseFileTranslatorGameWrapper
                settings={gameSettings}
                onBackToMenu={handleBack}
                onGameEnd={handleGameEnd}
                assignmentId={assignmentId || undefined}
                userId={user?.id}
                onOpenSettings={() => { }}
            />
        </div>
    );
}

export default function MobileCaseFileTranslatorPage() {
    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={false} safeAreaBottom={false}>
            <div className="h-screen w-full">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                }>
                    <CaseFileTranslatorContent />
                </Suspense>
            </div>
        </MobilePageWrapper>
    );
}

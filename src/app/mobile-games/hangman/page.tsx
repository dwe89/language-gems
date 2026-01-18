'use client';

import React, { Suspense, useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { MobilePageWrapper } from '../../../components/capacitor';
import HangmanGameWrapper from '../../activities/hangman/components/HangmanGameWrapper';
import { useAudio } from '../../activities/hangman/hooks/useAudio';
import { getFilteredVocabulary, SupportedLanguage } from '../../../lib/mobile';

// Separate component to use useSearchParams
function HangmanContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    // Parse settings from URL or usage defaults
    const language = (searchParams.get('lang') || 'spanish') as SupportedLanguage;
    const category = searchParams.get('cat') || 'basics_core_language';
    const difficulty = searchParams.get('diff') || 'beginner';
    const initialTheme = searchParams.get('theme') || 'default';
    const assignmentId = searchParams.get('assignmentId');

    // Extended filters from Setup Modal
    const curriculumLevel = (searchParams.get('level') || 'ks3') as 'KS3' | 'KS4';
    const tier = searchParams.get('tier') as 'foundation' | 'higher' | undefined;
    const examBoard = searchParams.get('board') as 'AQA' | 'EDEXCEL' | 'WJEC' | undefined;
    const subcategory = searchParams.get('sub') || undefined;

    // Local state for specialized vocabulary
    const [categoryVocabulary, setCategoryVocabulary] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial load of vocabulary
    useEffect(() => {
        const loadVocab = async () => {
            setLoading(true);
            try {
                const words = await getFilteredVocabulary({
                    language: language,
                    category: category !== 'basics_core_language' ? category : undefined, // Handle defaults
                    subcategory: subcategory,
                    curriculumLevel: curriculumLevel,
                    tier: tier,
                    examBoard: boardParamToType(examBoard)
                });

                const gameWords = words.map(w => ({
                    id: w.id,
                    word: w.word,
                    translation: w.translation,
                    category: w.category || 'general',
                    subcategory: w.subcategory || 'general',
                    difficulty_level: difficulty, // Use requested difficulty
                    isCustomVocabulary: false
                }));

                const shuffled = gameWords.sort(() => 0.5 - Math.random()).slice(0, 50);
                setCategoryVocabulary(shuffled);
            } catch (error) {
                console.error('Failed to load vocabulary:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!assignmentId) {
            loadVocab();
        } else {
            setLoading(false);
        }
    }, [language, category, subcategory, curriculumLevel, tier, examBoard, difficulty, assignmentId]);

    // Helper to strict cast ExamBoard
    function boardParamToType(b: string | undefined): 'AQA' | 'EDEXCEL' | 'WJEC' | undefined {
        if (b === 'AQA' || b === 'EDEXCEL' || b === 'WJEC') return b;
        return undefined;
    }

    // Local state for theme to allow switching without reload
    const [theme, setTheme] = useState(initialTheme);
    const [isMusicEnabled, setIsMusicEnabled] = useState(true);

    // Initialize Audio Hook
    const { playSFX, startBackgroundMusic, stopBackgroundMusic } = useAudio(isMusicEnabled);

    React.useEffect(() => {
        if (isMusicEnabled && theme) {
            let audioTheme = 'classic';
            switch (theme) {
                case 'tokyo': audioTheme = 'tokyo-nights'; break;
                case 'pirate': audioTheme = 'pirate-adventure'; break;
                case 'space': audioTheme = 'space-explorer'; break;
                case 'temple': audioTheme = 'lava-temple'; break;
                default: audioTheme = 'classic';
            }
            startBackgroundMusic(audioTheme as any);
        } else {
            stopBackgroundMusic();
        }
        return () => stopBackgroundMusic();
    }, [isMusicEnabled, theme, startBackgroundMusic, stopBackgroundMusic]);

    const toggleMusic = useCallback(() => {
        setIsMusicEnabled(prev => !prev);
    }, []);

    const handleBack = useCallback(() => {
        if (assignmentId) {
            router.push('/mobile-assignments');
        } else {
            router.push('/mobile-games');
        }
    }, [router, assignmentId]);

    const handleGameEnd = useCallback((result: 'win' | 'lose') => {
        console.log('Game ended:', result);
    }, []);

    const handleThemeChange = useCallback((newTheme: string) => {
        setTheme(newTheme);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full text-white bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const settings = {
        language,
        category,
        difficulty,
        theme,
        subcategory,
        curriculumLevel,
        tier,
        examBoard: boardParamToType(examBoard) as 'AQA' | 'edexcel' | undefined, // Cast specifically for Wrapper
        categoryVocabulary: categoryVocabulary.length > 0 ? categoryVocabulary : undefined
    };

    return (
        <div className="flex flex-col h-full bg-slate-900">
            <HangmanGameWrapper
                settings={settings}
                onBackToMenu={handleBack}
                onGameEnd={handleGameEnd}
                isAssignmentMode={!!assignmentId}
                assignmentId={assignmentId}
                userId={user?.id}
                isFullscreen={true}
                isMusicEnabled={isMusicEnabled}
                toggleMusic={toggleMusic}
                playSFX={(name) => playSFX(name as any)}
                onThemeChange={handleThemeChange}
                isMobile={true}
            />
        </div>
    );
}

export default function MobileHangmanPage() {
    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true} safeAreaBottom={false}>
            <div className="h-screen bg-slate-900 flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <Suspense fallback={<div className="flex items-center justify-center h-full text-white">Loading Game...</div>}>
                    <HangmanContent />
                </Suspense>
            </div>
        </MobilePageWrapper>
    );
}

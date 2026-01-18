'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import WordScrambleFreePlayWrapper from '../../activities/word-scramble/components/WordScrambleFreePlayWrapper';
import { MobilePageWrapper } from '../../../components/capacitor';
import { getFilteredVocabulary, SupportedLanguage } from '../../../lib/mobile';
import { useGameAudio } from '../../../hooks/useGlobalAudioContext';

export default function MobileWordScramblePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const langParam = searchParams.get('lang') as SupportedLanguage;
    const catParam = searchParams.get('cat') || undefined;
    const subParam = searchParams.get('sub') || undefined;
    const levelParam = searchParams.get('level') as 'KS3' | 'KS4' || 'KS3';
    const tierParam = searchParams.get('tier') as 'foundation' | 'higher' | undefined;
    const boardParam = searchParams.get('board') as 'AQA' | 'EDEXCEL' | 'WJEC' | undefined;

    const [vocabulary, setVocabulary] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const audioManager = useGameAudio(true);

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

                const gameWords = words.map(w => ({
                    id: w.id,
                    word: w.word,
                    translation: w.translation,
                    category: w.category || 'general',
                    subcategory: w.subcategory || 'general',
                    part_of_speech: 'noun', // Default
                    language: langParam || 'spanish',
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

        loadVocab();
    }, [langParam, catParam, subParam, levelParam, tierParam, boardParam]);

    const handleBack = useCallback(() => {
        router.push('/mobile-games');
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={false} safeAreaBottom={false}>
            <div className="h-screen w-full">
                <WordScrambleFreePlayWrapper
                    vocabulary={vocabulary}
                    userId={user?.id}
                    language={langParam === 'spanish' ? 'es' : langParam === 'french' ? 'fr' : 'de'}
                    difficulty="medium"
                    onBackToMenu={handleBack}
                    onGameComplete={(result) => console.log('Game ended:', result)}
                    onOpenSettings={() => { }}
                    isAssignmentMode={false}
                />
            </div>
        </MobilePageWrapper>
    );
}

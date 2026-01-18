'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { getFilteredVocabulary, SupportedLanguage } from '../../../lib/mobile';
import { ImprovedSentenceTowersGame } from '../../../app/activities/word-towers/page';
import { MobilePageWrapper } from '../../../components/capacitor';

// Mobile-specific wrapper for the main Sentence/Word Towers game
export default function MobileWordTowersPage() {
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

    // Initial load
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

                const gameWords = words.map(word => ({
                    id: word.id || Math.random().toString(),
                    word: word.word,
                    translation: word.translation,
                    difficulty_level: 'beginner',
                    isCustomVocabulary: false,
                    category: word.category || 'general',
                    subcategory: word.subcategory || 'general'
                }));

                const shuffled = gameWords.sort(() => 0.5 - Math.random()).slice(0, 50);
                setVocabulary(shuffled);
            } catch (error) {
                console.error('Failed to load vocabulary:', error);
            } finally {
                setLoading(false);
            }
        };

        loadVocab();
    }, [langParam, catParam, subParam, levelParam, tierParam, boardParam]);

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Config for the game
    const gameConfig = {
        language: langParam || 'spanish',
        categoryId: catParam || 'Any',
        subcategoryId: subParam || 'Any',
        curriculumLevel: levelParam || 'KS3',
        customMode: false,
        customContentType: 'vocabulary'
    };

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-slate-900">
            {/* Pass isMobile=true to trigger mobile optimizations in the main component */}
            <ImprovedSentenceTowersGame
                gameVocabulary={vocabulary}
                onBackToMenu={() => router.push('/mobile-games')}
                config={gameConfig as any}
                isMobile={true}
            />
        </div>
    );
}

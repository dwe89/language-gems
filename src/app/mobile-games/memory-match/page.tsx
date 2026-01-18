'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../../hooks/useUnifiedAuth';
import MobileMemoryGame from './components/MobileMemoryGame';
import { WordPair } from '../../activities/memory-game/components/CustomWordsModal';
import { getFilteredVocabulary, SupportedLanguage } from '../../../lib/mobile';

export default function MobileMemoryMatchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isDemo } = useUnifiedAuth();

    const langParam = searchParams.get('lang') as SupportedLanguage;
    const catParam = searchParams.get('cat') || undefined;
    const subParam = searchParams.get('sub') || undefined;
    const levelParam = searchParams.get('level') as 'KS3' | 'KS4' || 'KS3';
    const tierParam = searchParams.get('tier') as 'foundation' | 'higher' | undefined;
    const boardParam = searchParams.get('board') as 'AQA' | 'EDEXCEL' | 'WJEC' | undefined;

    const [vocabulary, setVocabulary] = useState<WordPair[]>([]);
    const [loading, setLoading] = useState(true);

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

                const wordPairs: WordPair[] = words.map(w => ({
                    id: w.id,
                    term: w.word,
                    translation: w.translation,
                    type: 'word' as const,
                    category: w.category || 'general',
                    subcategory: w.subcategory || 'general'
                }));

                const shuffled = wordPairs.sort(() => 0.5 - Math.random()).slice(0, 30);
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
            <div className="fixed inset-0 flex items-center justify-center bg-slate-900">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-full fixed inset-0 overflow-hidden">
            <MobileMemoryGame
                customWords={vocabulary}
                onBack={handleBack}
                userId={user?.id}
                isDemo={isDemo}
            />
        </div>
    );
}

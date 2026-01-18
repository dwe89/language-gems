'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { getFilteredVocabulary, SupportedLanguage } from '../../../lib/mobile';
import VocabBlastGame, { VocabBlastGameSettings } from '../../activities/vocab-blast/components/VocabBlastGame';
import { GameVocabularyWord } from '../../../hooks/useGameVocabulary';
import { MobilePageWrapper } from '../../../components/capacitor';

// Mobile-specific wrapper for the main Vocab Blast game
export default function MobileVocabBlastPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const langParam = searchParams.get('lang') as SupportedLanguage;
    const catParam = searchParams.get('cat') || undefined;
    const subParam = searchParams.get('sub') || undefined;
    const levelParam = searchParams.get('level') as 'KS3' | 'KS4' || 'KS3';
    const tierParam = searchParams.get('tier') as 'foundation' | 'higher' | undefined;
    const boardParam = searchParams.get('board') as 'AQA' | 'EDEXCEL' | 'WJEC' | undefined;

    const [vocabulary, setVocabulary] = useState<GameVocabularyWord[]>([]);
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

                const gameWords: GameVocabularyWord[] = words.map(word => ({
                    id: word.id || Math.random().toString(),
                    word: word.word,
                    translation: word.translation,
                    category: word.category || 'general',
                    subcategory: word.subcategory || 'general',
                    part_of_speech: 'noun', // Default fallback
                    isCustomVocabulary: false
                }));

                // Randomize and take 50
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
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Config for the game
    const gameSettings: VocabBlastGameSettings = {
        difficulty: 'intermediate',
        category: catParam || 'Mobile Review',
        language: langParam || 'spanish',
        theme: 'default',
        mode: 'categories',
        subcategory: subParam || 'Mixed'
    };

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={false}>
            {/* Pass isMobile=true to trigger mobile optimizations in the main component */}
            <VocabBlastGame
                settings={gameSettings}
                vocabulary={vocabulary}
                onBackToMenu={() => router.push('/mobile-games')}
                onGameEnd={(result) => {
                    console.log('Game ended', result);
                }}
                isAssignmentMode={false}
                isMobile={true}
            />
        </MobilePageWrapper>
    );
}

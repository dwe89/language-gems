'use client';

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { MobilePageWrapper } from '../../../components/capacitor';
import { SupportedLanguage, recordGameSession } from '../../../lib/mobile';

// Import the actual game components from activities
import VerbQuestGameWrapper from '../../activities/verb-quest/components/VerbQuestGameWrapper';
import { Character } from '../../activities/verb-quest/components/Character';
import { QuestSystem } from '../../activities/verb-quest/components/QuestSystem';

// Content component that uses useSearchParams
function VerbQuestContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    // Parse settings from URL
    const langParam = searchParams.get('lang') as SupportedLanguage || 'spanish';
    const assignmentId = searchParams.get('assignmentId');

    const [character, setCharacter] = useState<Character | null>(null);
    const [questSystem, setQuestSystem] = useState<QuestSystem | null>(null);
    const [loading, setLoading] = useState(true);
    const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');

    // Load or create character
    useEffect(() => {
        loadCharacter();
    }, []);

    const loadCharacter = () => {
        setLoading(true);
        try {
            // Try to load saved character from localStorage
            if (typeof window !== 'undefined') {
                const saved = localStorage.getItem('verbQuestCharacter');
                if (saved) {
                    const data = JSON.parse(saved);
                    if (data.name && data.characterClass) {
                        const loadedCharacter = new Character(data.name, data.characterClass);
                        setCharacter(loadedCharacter);
                        setQuestSystem(new QuestSystem());
                        setLoading(false);
                        return;
                    }
                }
            }
            // No saved character - will need to create one
            setLoading(false);
        } catch (error) {
            console.error('Error loading character:', error);
            setLoading(false);
        }
    };

    const handleCreateCharacter = useCallback((name: string, characterClass: string) => {
        const newCharacter = new Character(name, characterClass);
        newCharacter.saveProgress();
        setCharacter(newCharacter);
        setQuestSystem(new QuestSystem());
        setGameState('playing');
    }, []);

    const handleStartNewGame = useCallback(() => {
        // Create a default character for quick play
        const defaultName = user?.email?.split('@')[0] || 'Hero';
        const newCharacter = new Character(defaultName, 'warrior');
        newCharacter.saveProgress();
        setCharacter(newCharacter);
        setQuestSystem(new QuestSystem());
        setGameState('playing');
    }, [user]);

    const handleContinueGame = useCallback(() => {
        if (character) {
            setGameState('playing');
        }
    }, [character]);

    const handleBack = useCallback(() => {
        if (gameState === 'playing') {
            setGameState('menu');
        } else if (assignmentId) {
            router.push('/mobile-assignments');
        } else {
            router.push('/mobile-games');
        }
    }, [router, assignmentId, gameState]);

    const handleGameComplete = useCallback((results: any) => {
        // Record game session
        recordGameSession({
            gameType: 'verb-quest',
            language: langParam || 'spanish',
            score: results?.score || 0,
            accuracy: 0, // Verb Quest tracks XP differently
            wordsCorrect: results?.enemiesDefeated || 0,
            wordsTotal: 5, // Number of enemies
            xpEarned: results?.xp || 0,
            duration: 0,
            completedAt: new Date().toISOString(),
        });

        console.log('Verb Quest game completed:', results);
        setGameState('menu');
    }, [langParam]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-purple-200">Loading quest realm...</p>
                </div>
            </div>
        );
    }

    // Show game if playing
    if (gameState === 'playing' && character && questSystem) {
        return (
            <div className="h-full w-full">
                <VerbQuestGameWrapper
                    character={character}
                    questSystem={questSystem}
                    onBackToMenu={handleBack}
                    soundEnabled={true}
                    onGameComplete={handleGameComplete}
                    assignmentMode={!!assignmentId}
                    assignmentConfig={assignmentId ? {
                        assignmentId,
                        language: langParam || 'spanish'
                    } : undefined}
                    userId={user?.id}
                />
            </div>
        );
    }

    // Show menu
    return (
        <div className="h-full bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 flex flex-col">
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

            {/* Menu Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-sm text-center">
                    {/* Game Icon */}
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-purple-500/30 mb-4">
                        <span className="text-5xl">⚔️</span>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-2">Verb Quest</h1>
                    <p className="text-white/60 mb-8">Battle enemies with verb conjugations!</p>

                    {/* Language indicator */}
                    <div className="flex justify-center gap-3 mb-6">
                        <div className={`px-4 py-2 rounded-xl text-2xl bg-white/20 scale-110`}>
                            {langParam === 'spanish' ? '🇪🇸' : langParam === 'french' ? '🇫🇷' : '🇩🇪'}
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3">
                        {character ? (
                            <>
                                <button
                                    onClick={handleContinueGame}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-2"
                                >
                                    ▶️ Continue Adventure
                                </button>

                                {/* Character info */}
                                <div className="p-4 bg-black/30 rounded-xl backdrop-blur-sm text-left">
                                    <h3 className="text-white/80 font-bold mb-1">{character.stats.name}</h3>
                                    <p className="text-white/50 text-sm">
                                        Level {character.stats.level} {character.stats.characterClass}
                                    </p>
                                    <div className="mt-2 h-2 bg-purple-900/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                                            style={{
                                                width: `${(character.stats.experience / character.stats.experienceToNext) * 100}%`
                                            }}
                                        />
                                    </div>
                                    <p className="text-white/40 text-xs mt-1">
                                        {character.stats.experience} / {character.stats.experienceToNext} XP
                                    </p>
                                </div>

                                <button
                                    onClick={handleStartNewGame}
                                    className="w-full py-3 bg-white/10 rounded-xl font-semibold text-white text-base"
                                >
                                    🆕 New Adventure
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleStartNewGame}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-2xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-2"
                            >
                                ⚔️ Begin Quest
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MobileVerbQuestPage() {
    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true} safeAreaBottom={true}>
            <div className="h-screen w-full">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                }>
                    <VerbQuestContent />
                </Suspense>
            </div>
        </MobilePageWrapper>
    );
}

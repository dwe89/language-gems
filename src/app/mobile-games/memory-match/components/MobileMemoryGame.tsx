'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../../activities/memory-game/data/gameConstants';
import { WordPair } from '../../../activities/memory-game/components/CustomWordsModal';
import { createClient } from '../../../../utils/supabase/client';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { getBufferedGameSessionService } from '../../../../services/buffered/BufferedGameSessionService';
import { useGameAudio } from '../../../../hooks/useGlobalAudioContext';
import { createAudio, getAudioUrl } from '../../../../utils/audioUtils';
import { Trophy, RotateCcw, Home, Clock, Volume2, VolumeX, Grid, Image as ImageIcon } from 'lucide-react';
import { useUnifiedAuth } from '../../../../hooks/useUnifiedAuth';

interface MobileMemoryGameProps {
    customWords: WordPair[];
    onBack: () => void;
    userId?: string;
    isDemo?: boolean;
    assignmentId?: string;
    sessionMode?: 'free_play' | 'assignment';
    onGameComplete?: (results: any) => void;
}

export default function MobileMemoryGame({
    customWords,
    onBack,
    userId,
    isDemo = false,
    assignmentId,
    sessionMode,
    onGameComplete
}: MobileMemoryGameProps) {
    // Game State
    const [cards, setCards] = useState<Card[]>([]);
    const [matches, setMatches] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [firstCard, setFirstCard] = useState<Card | null>(null);
    const [secondCard, setSecondCard] = useState<Card | null>(null);
    const [gameWon, setGameWon] = useState(false);
    const [canFlip, setCanFlip] = useState(true);
    const [gameTime, setGameTime] = useState(0);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [gameService, setGameService] = useState<EnhancedGameService | null>(null);
    const [gameSessionId, setGameSessionId] = useState<string | null>(null);
    const [gridSize, setGridSize] = useState<number>(12); // Default to 12 cards (6 pairs)

    // Services
    const audioManager = useGameAudio(true);
    const correctSoundRef = useRef<HTMLAudioElement | null>(null);
    const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
    const winSoundRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Audio
    useEffect(() => {
        if (audioManager && !audioManager.state.isInitialized) {
            audioManager.initializeAudio().catch(console.warn);
        }

        correctSoundRef.current = createAudio('/games/memory-game/sounds/correct.mp3');
        wrongSoundRef.current = createAudio('/games/memory-game/sounds/wrong.mp3');
        winSoundRef.current = createAudio('/games/memory-game/sounds/win.mp3');

        return () => {
            correctSoundRef.current = null;
            wrongSoundRef.current = null;
            winSoundRef.current = null;
        };
    }, []);

    // Initialize Game Service
    useEffect(() => {
        const supabase = createClient();
        if (userId && !isDemo) {
            const service = new EnhancedGameService(supabase);
            setGameService(service);
        }
    }, [userId, isDemo]);

    // Start Game Session
    useEffect(() => {
        const startSession = async () => {
            if (gameService && userId && !isDemo && startTime && !gameSessionId) {
                // If in assignment mode, we might trust the wrapper to handle session, 
                // OR we create a session with assignment_id.
                // Mobile typically doesn't have the wrapper in the component itself unless passed.
                // We'll proceed with creating a session if we have the service.
                try {
                    const sessionId = await gameService.startGameSession({
                        student_id: userId,
                        assignment_id: assignmentId,
                        game_type: 'memory-game',
                        session_mode: sessionMode || 'free_play',
                        max_score_possible: 100,
                        session_data: {
                            gridSize: cards.length,
                            totalPairs: cards.length / 2
                        }
                    });
                    setGameSessionId(sessionId);
                } catch (error) {
                    console.error('Failed to start session:', error);
                }
            }
        };
        startSession();
    }, [gameService, userId, isDemo, startTime, gameSessionId, cards.length, assignmentId, sessionMode]);

    // Timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (startTime && !gameWon) {
            timer = setInterval(() => {
                const now = new Date();
                const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
                setGameTime(elapsed);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [startTime, gameWon]);

    // Initialize Game Logic
    const initializeGame = () => {
        if (!customWords || customWords.length === 0) return;

        setStartTime(new Date());

        // Calculate pairs based on grid size
        const totalPairs = Math.floor(gridSize / 2);

        // Select random words if we have more than needed
        let selectedWords = [...customWords];
        if (selectedWords.length > totalPairs) {
            selectedWords = selectedWords.sort(() => 0.5 - Math.random()).slice(0, totalPairs);
        } else if (selectedWords.length < totalPairs && selectedWords.length > 0) {
            // Repeat words if we don't have enough
            while (selectedWords.length < totalPairs) {
                const remaining = totalPairs - selectedWords.length;
                selectedWords = [...selectedWords, ...customWords.slice(0, Math.min(remaining, customWords.length))];
            }
            selectedWords = selectedWords.slice(0, totalPairs);
        }

        const newCards: Card[] = [];
        selectedWords.forEach((pair, index) => {
            // Card 1 (Term)
            newCards.push({
                id: index * 2,
                value: pair.term,
                isImage: pair.type === 'image',
                flipped: false,
                matched: false,
                pairId: index,
                vocabularyId: pair.id,
                word: pair.term,
                translation: pair.translation
            });

            // Card 2 (Translation)
            newCards.push({
                id: index * 2 + 1,
                value: pair.translation,
                isImage: pair.type === 'image',
                flipped: false,
                matched: false,
                pairId: index,
                vocabularyId: pair.id,
                word: pair.term,
                translation: pair.translation
            });
        });

        // Shuffle
        for (let i = newCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
        }

        setCards(newCards);
        setMatches(0);
        setAttempts(0);
        setFirstCard(null);
        setSecondCard(null);
        setCanFlip(true);
        setGameWon(false);
        setGameTime(0);
    };

    // Card Interaction
    const handleCardClick = async (card: Card) => {
        if (!canFlip || card.flipped || card.matched) return;

        // Flip card
        const updatedCards = cards.map(c =>
            c.id === card.id ? { ...c, flipped: true } : c
        );
        setCards(updatedCards);

        if (!firstCard) {
            setFirstCard(card);
            return;
        }

        setSecondCard(card);
        setCanFlip(false);
        setAttempts(prev => prev + 1);

        // Check match
        if (firstCard.pairId === card.pairId) {
            // Match!
            if (correctSoundRef.current) audioManager.playAudio(correctSoundRef.current).catch(() => { });

            setTimeout(() => {
                const matchedCards = cards.map(c =>
                    c.pairId === firstCard.pairId ? { ...c, matched: true, flipped: true } : c
                );
                setCards(matchedCards);
                setMatches(prev => prev + 1);
                setFirstCard(null);
                setSecondCard(null);
                setCanFlip(true);

                // Check Win
                if (matches + 1 === cards.length / 2) {
                    handleWin();
                }
            }, 600);

            // Record success
            if (!isDemo && gameSessionId && firstCard.vocabularyId) {
                try {
                    const sessionService = getBufferedGameSessionService();
                    await sessionService.recordWordAttempt(gameSessionId, 'memory-game', {
                        vocabularyId: firstCard.vocabularyId,
                        wordText: firstCard.word || '',
                        translationText: firstCard.translation || '',
                        wasCorrect: true,
                        gameMode: 'memory_match'
                    }, false);
                } catch (e) { console.error(e); }
            }

        } else {
            // No Match
            if (wrongSoundRef.current) audioManager.playAudio(wrongSoundRef.current).catch(() => { });

            setTimeout(() => {
                const resetCards = cards.map(c =>
                    (c.id === firstCard.id || c.id === card.id) ? { ...c, flipped: false } : c
                );
                setCards(resetCards);
                setFirstCard(null);
                setSecondCard(null);
                setCanFlip(true);
            }, 1200);
        }
    };

    const handleWin = () => {
        setGameWon(true);
        if (winSoundRef.current) audioManager.playAudio(winSoundRef.current).catch(() => { });

        const accuracy = ((cards.length / 2) / (attempts + 1)) * 100; // approximation
        const results = {
            student_id: userId,
            assignment_id: assignmentId,
            game_type: 'memory-game',
            session_mode: sessionMode || 'free_play',
            final_score: Math.round(accuracy),
            accuracy_percentage: accuracy,
            completion_percentage: 100,
            words_attempted: attempts + 1,
            words_correct: cards.length / 2,
            duration_seconds: gameTime,
            session_data: { matches: cards.length / 2, attempts: attempts + 1 }
        };

        if (gameService && gameSessionId && userId && !isDemo) {
            gameService.endGameSession(gameSessionId, results).catch(console.error);
        }

        if (onGameComplete) {
            onGameComplete(results);
        }
    };

    // Initialize on load
    useEffect(() => {
        initializeGame();
    }, [customWords, gridSize]); // Re-init if vocabulary or grid size changes

    const cycleGridSize = () => {
        const sizes = [6, 12, 16, 20];
        const currentIndex = sizes.indexOf(gridSize);
        const nextSize = sizes[(currentIndex + 1) % sizes.length];
        setGridSize(nextSize);
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-900 text-white relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 z-0"></div>

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-4 py-3 bg-slate-900/50 backdrop-blur-md border-b border-white/10">
                <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
                    <Home size={20} className="text-white" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <Trophy size={16} className="text-yellow-400" />
                        <span className="font-bold text-sm tracking-wider">{matches}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <Clock size={16} className="text-cyan-400" />
                        <span className="font-mono text-sm font-medium">
                            {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                    <button onClick={cycleGridSize} className="px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center gap-1.5 active:bg-indigo-500/40 transition-colors">
                        <Grid size={16} className="text-indigo-300" />
                        <span className="text-xs font-semibold text-indigo-100">{gridSize} Cards</span>
                    </button>
                </div>
            </header>

            {/* Game Grid */}
            <main className="relative z-10 flex-1 flex items-center justify-center p-4 overflow-hidden">
                <div className={`grid gap-3 w-full max-w-lg aspect-[3/4] max-h-full mx-auto transition-all duration-300`}
                    style={{
                        gridTemplateColumns: `repeat(${gridSize <= 6 ? 2 :
                            gridSize <= 12 ? 3 :
                                4
                            }, 1fr)`,
                        gridTemplateRows: `repeat(${gridSize <= 6 ? 3 :
                            gridSize <= 12 ? 4 :
                                gridSize <= 16 ? 4 :
                                    5
                            }, 1fr)`
                    }}
                >
                    {cards.map((card, index) => (
                        <div
                            key={card.id}
                            onClick={() => handleCardClick(card)}
                            className={`group relative w-full h-full cursor-pointer perspective-1000 select-none touch-manipulation`}
                        >
                            <div className={`w-full h-full duration-500 preserve-3d absolute inset-0 transition-transform shadow-xl rounded-xl ${card.flipped ? 'rotate-y-180' : ''}`}>
                                {/* Front (Number/Pattern) */}
                                <div className="backface-hidden absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl border border-white/20 shadow-inner flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white/90 drop-shadow-md">{index + 1}</span>
                                    <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                {/* Back (Content) */}
                                <div className={`backface-hidden rotate-y-180 absolute inset-0 bg-gradient-to-br ${card.matched ? 'from-green-500 to-emerald-600' : 'from-slate-100 to-white'} rounded-xl border-2 ${card.matched ? 'border-green-300' : 'border-indigo-200'} shadow-lg flex items-center justify-center p-2 text-center overflow-hidden`}>
                                    {card.isImage ? (
                                        <img src={card.value} alt="card content" className="w-full h-full object-contain pointer-events-none" />
                                    ) : (
                                        <span className={`font-bold select-none ${card.matched ? 'text-white' : 'text-slate-800'} ${card.value.length > 10 ? 'text-xs' : 'text-sm sm:text-base'}`}>
                                            {card.value}
                                        </span>
                                    )}
                                    {card.matched && (
                                        <div className="absolute top-1 right-1 bg-white/30 rounded-full p-0.5">
                                            <Trophy size={10} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Win Modal */}
            {gameWon && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all scale-100 text-center border-4 border-indigo-100">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6 relative">
                            <Trophy size={40} className="text-yellow-500" />
                            <div className="absolute inset-0 animate-ping rounded-full bg-yellow-200 opacity-25"></div>
                        </div>

                        <h2 className="text-2xl font-black text-slate-800 mb-2">Excellent!</h2>
                        <p className="text-slate-500 mb-8 font-medium">You matched all pairs in {attempts} moves.</p>

                        <div className="space-y-3">
                            <button
                                onClick={initializeGame}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={20} />
                                Play Again
                            </button>
                            <button
                                onClick={onBack}
                                className="w-full py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-colors"
                            >
                                Correct, Back to Menu
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
        </div>
    );
}

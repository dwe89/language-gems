'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { MobilePageWrapper } from '../../../components/capacitor';
import { loadBundledVocabulary, SupportedLanguage, recordGameSession } from '../../../lib/mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Play, Swords, Heart, Shield, Zap, Star, Check, X } from 'lucide-react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// Simplified verb conjugation data for mobile
const SPANISH_VERBS = [
    { infinitive: 'hablar', meaning: 'to speak', conjugations: { yo: 'hablo', tú: 'hablas', él: 'habla', nosotros: 'hablamos', ellos: 'hablan' } },
    { infinitive: 'comer', meaning: 'to eat', conjugations: { yo: 'como', tú: 'comes', él: 'come', nosotros: 'comemos', ellos: 'comen' } },
    { infinitive: 'vivir', meaning: 'to live', conjugations: { yo: 'vivo', tú: 'vives', él: 'vive', nosotros: 'vivimos', ellos: 'viven' } },
    { infinitive: 'tener', meaning: 'to have', conjugations: { yo: 'tengo', tú: 'tienes', él: 'tiene', nosotros: 'tenemos', ellos: 'tienen' } },
    { infinitive: 'ser', meaning: 'to be', conjugations: { yo: 'soy', tú: 'eres', él: 'es', nosotros: 'somos', ellos: 'son' } },
    { infinitive: 'estar', meaning: 'to be', conjugations: { yo: 'estoy', tú: 'estás', él: 'está', nosotros: 'estamos', ellos: 'están' } },
    { infinitive: 'ir', meaning: 'to go', conjugations: { yo: 'voy', tú: 'vas', él: 'va', nosotros: 'vamos', ellos: 'van' } },
    { infinitive: 'querer', meaning: 'to want', conjugations: { yo: 'quiero', tú: 'quieres', él: 'quiere', nosotros: 'queremos', ellos: 'quieren' } },
    { infinitive: 'poder', meaning: 'to be able', conjugations: { yo: 'puedo', tú: 'puedes', él: 'puede', nosotros: 'podemos', ellos: 'pueden' } },
    { infinitive: 'hacer', meaning: 'to do/make', conjugations: { yo: 'hago', tú: 'haces', él: 'hace', nosotros: 'hacemos', ellos: 'hacen' } },
];

const FRENCH_VERBS = [
    { infinitive: 'parler', meaning: 'to speak', conjugations: { je: 'parle', tu: 'parles', il: 'parle', nous: 'parlons', ils: 'parlent' } },
    { infinitive: 'manger', meaning: 'to eat', conjugations: { je: 'mange', tu: 'manges', il: 'mange', nous: 'mangeons', ils: 'mangent' } },
    { infinitive: 'finir', meaning: 'to finish', conjugations: { je: 'finis', tu: 'finis', il: 'finit', nous: 'finissons', ils: 'finissent' } },
    { infinitive: 'avoir', meaning: 'to have', conjugations: { je: 'ai', tu: 'as', il: 'a', nous: 'avons', ils: 'ont' } },
    { infinitive: 'être', meaning: 'to be', conjugations: { je: 'suis', tu: 'es', il: 'est', nous: 'sommes', ils: 'sont' } },
    { infinitive: 'aller', meaning: 'to go', conjugations: { je: 'vais', tu: 'vas', il: 'va', nous: 'allons', ils: 'vont' } },
    { infinitive: 'faire', meaning: 'to do/make', conjugations: { je: 'fais', tu: 'fais', il: 'fait', nous: 'faisons', ils: 'font' } },
    { infinitive: 'vouloir', meaning: 'to want', conjugations: { je: 'veux', tu: 'veux', il: 'veut', nous: 'voulons', ils: 'veulent' } },
];

const PERSONS = {
    spanish: ['yo', 'tú', 'él', 'nosotros', 'ellos'] as const,
    french: ['je', 'tu', 'il', 'nous', 'ils'] as const,
};

interface Enemy {
    name: string;
    emoji: string;
    hp: number;
    maxHp: number;
}

const ENEMIES: Enemy[] = [
    { name: 'Verb Slime', emoji: '🟢', hp: 3, maxHp: 3 },
    { name: 'Conjugation Goblin', emoji: '👺', hp: 4, maxHp: 4 },
    { name: 'Grammar Specter', emoji: '👻', hp: 5, maxHp: 5 },
    { name: 'Tense Troll', emoji: '🧌', hp: 6, maxHp: 6 },
    { name: 'Syntax Dragon', emoji: '🐉', hp: 8, maxHp: 8 },
];

interface GameState {
    status: 'menu' | 'battle' | 'victory' | 'defeat' | 'complete';
    playerHp: number;
    playerMaxHp: number;
    score: number;
    streak: number;
    level: number;
    xp: number;
    enemiesDefeated: number;
    highScore: number;
}

export default function MobileVerbQuestPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const langParam = searchParams.get('lang') as SupportedLanguage;
    const [language, setLanguage] = useState<SupportedLanguage>(langParam || 'spanish');

    const [gameState, setGameState] = useState<GameState>({
        status: 'menu',
        playerHp: 10,
        playerMaxHp: 10,
        score: 0,
        streak: 0,
        level: 1,
        xp: 0,
        enemiesDefeated: 0,
        highScore: 0,
    });

    const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
    const [currentVerb, setCurrentVerb] = useState<any>(null);
    const [currentPerson, setCurrentPerson] = useState<string>('');
    const [options, setOptions] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [battleMessage, setBattleMessage] = useState('');

    // Load high score
    useEffect(() => {
        const saved = localStorage.getItem(`verb_quest_highscore_${language}`);
        if (saved) {
            setGameState(prev => ({ ...prev, highScore: parseInt(saved) }));
        }
    }, [language]);

    const getVerbs = useCallback(() => {
        return language === 'french' ? FRENCH_VERBS : SPANISH_VERBS;
    }, [language]);

    const getPersons = useCallback(() => {
        return language === 'french' ? PERSONS.french : PERSONS.spanish;
    }, [language]);

    const generateQuestion = useCallback(() => {
        const verbs = getVerbs();
        const persons = getPersons();
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const person = persons[Math.floor(Math.random() * persons.length)];
        const correctAnswer = verb.conjugations[person as keyof typeof verb.conjugations];

        // Generate wrong options
        const wrongOptions: string[] = [];
        while (wrongOptions.length < 3) {
            const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
            const randomPerson = persons[Math.floor(Math.random() * persons.length)];
            const wrongAnswer = randomVerb.conjugations[randomPerson as keyof typeof randomVerb.conjugations];
            if (wrongAnswer !== correctAnswer && !wrongOptions.includes(wrongAnswer)) {
                wrongOptions.push(wrongAnswer);
            }
        }

        const allOptions = [...wrongOptions, correctAnswer].sort(() => 0.5 - Math.random());

        setCurrentVerb(verb);
        setCurrentPerson(person);
        setOptions(allOptions);
        setSelectedAnswer(null);
        setShowResult(false);
    }, [getVerbs, getPersons]);

    const startGame = useCallback(() => {
        const firstEnemy = { ...ENEMIES[0] };
        setCurrentEnemy(firstEnemy);

        setGameState({
            status: 'battle',
            playerHp: 10,
            playerMaxHp: 10,
            score: 0,
            streak: 0,
            level: 1,
            xp: 0,
            enemiesDefeated: 0,
            highScore: gameState.highScore,
        });

        generateQuestion();
        setBattleMessage('A wild enemy appears!');

        try { Haptics.impact({ style: ImpactStyle.Medium }); } catch { }
    }, [generateQuestion, gameState.highScore]);

    const handleAnswer = useCallback((answer: string) => {
        if (showResult || !currentVerb || !currentEnemy) return;

        setSelectedAnswer(answer);
        setShowResult(true);

        const correctAnswer = currentVerb.conjugations[currentPerson as keyof typeof currentVerb.conjugations];
        const isCorrect = answer === correctAnswer;

        if (isCorrect) {
            try { Haptics.impact({ style: ImpactStyle.Heavy }); } catch { }

            // Damage enemy
            const damage = 1 + Math.floor(gameState.streak / 3);
            const newEnemyHp = currentEnemy.hp - damage;

            setBattleMessage(`⚔️ You dealt ${damage} damage!`);

            if (newEnemyHp <= 0) {
                // Enemy defeated
                const xpGain = 50 + (gameState.enemiesDefeated * 10);

                setGameState(prev => ({
                    ...prev,
                    score: prev.score + 100 + (prev.streak * 20),
                    streak: prev.streak + 1,
                    xp: prev.xp + xpGain,
                    enemiesDefeated: prev.enemiesDefeated + 1,
                }));

                setTimeout(() => {
                    const nextEnemyIndex = Math.min(gameState.enemiesDefeated + 1, ENEMIES.length - 1);

                    if (gameState.enemiesDefeated + 1 >= ENEMIES.length) {
                        // Game complete
                        endGame(true);
                    } else {
                        // Next enemy
                        const nextEnemy = { ...ENEMIES[nextEnemyIndex] };
                        setCurrentEnemy(nextEnemy);
                        setBattleMessage(`A ${nextEnemy.name} appears!`);
                        generateQuestion();
                    }
                }, 1500);
            } else {
                setCurrentEnemy(prev => prev ? { ...prev, hp: newEnemyHp } : null);

                setGameState(prev => ({
                    ...prev,
                    score: prev.score + 50 + (prev.streak * 10),
                    streak: prev.streak + 1,
                }));

                setTimeout(() => generateQuestion(), 1500);
            }
        } else {
            try { Haptics.notification({ type: NotificationType.Error }); } catch { }

            // Player takes damage
            const damage = 1;
            const newPlayerHp = gameState.playerHp - damage;

            setBattleMessage(`💔 You took ${damage} damage!`);

            setGameState(prev => ({
                ...prev,
                playerHp: newPlayerHp,
                streak: 0,
            }));

            if (newPlayerHp <= 0) {
                setTimeout(() => endGame(false), 1500);
            } else {
                setTimeout(() => generateQuestion(), 1500);
            }
        }
    }, [showResult, currentVerb, currentPerson, currentEnemy, gameState, generateQuestion]);

    const endGame = useCallback((victory: boolean) => {
        const finalScore = gameState.score;

        if (finalScore > gameState.highScore) {
            localStorage.setItem(`verb_quest_highscore_${language}`, finalScore.toString());
        }

        recordGameSession({
            gameType: 'verb-quest',
            language,
            score: finalScore,
            accuracy: 0,
            wordsCorrect: gameState.enemiesDefeated,
            wordsTotal: ENEMIES.length,
            xpEarned: gameState.xp,
            duration: 0,
            completedAt: new Date().toISOString(),
        });

        setGameState(prev => ({
            ...prev,
            status: victory ? 'complete' : 'defeat',
            highScore: Math.max(finalScore, prev.highScore),
        }));
    }, [gameState.score, gameState.highScore, gameState.xp, gameState.enemiesDefeated, language]);

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true} safeAreaBottom={true}>
            <div className="h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 px-4 pt-2 pb-2 flex items-center justify-between">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/mobile-games')}
                        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </motion.button>

                    <div className="flex flex-col items-center">
                        <span className="text-white/50 text-xs font-bold uppercase tracking-wider">Verb Quest</span>
                        {gameState.status === 'battle' && (
                            <span className="text-amber-400 text-xs font-bold">
                                Level {gameState.level} • {gameState.xp} XP
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full">
                        <Star className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-bold text-white">{gameState.score}</span>
                    </div>
                </div>

                {/* Game Area */}
                <div className="flex-1 flex flex-col overflow-hidden relative">
                    {gameState.status === 'battle' && currentEnemy && currentVerb ? (
                        <>
                            {/* Player HP */}
                            <div className="flex-shrink-0 px-4 py-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <Heart className="w-4 h-4 text-red-400" />
                                    <span className="text-white text-sm font-bold">You</span>
                                </div>
                                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-red-500 to-rose-400"
                                        animate={{ width: `${(gameState.playerHp / gameState.playerMaxHp) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Enemy */}
                            <div className="flex-shrink-0 px-4 py-4 text-center">
                                <motion.div
                                    key={currentEnemy.name}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-6xl mb-2"
                                >
                                    {currentEnemy.emoji}
                                </motion.div>
                                <p className="text-white font-bold text-lg">{currentEnemy.name}</p>
                                <div className="w-48 h-3 bg-slate-700 rounded-full overflow-hidden mx-auto mt-2">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                        animate={{ width: `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%` }}
                                    />
                                </div>
                                <p className="text-white/50 text-xs mt-1">{currentEnemy.hp} / {currentEnemy.maxHp} HP</p>
                            </div>

                            {/* Battle message */}
                            {battleMessage && (
                                <motion.div
                                    key={battleMessage}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex-shrink-0 text-center px-4"
                                >
                                    <span className="text-amber-400 font-bold">{battleMessage}</span>
                                </motion.div>
                            )}

                            {/* Question */}
                            <div className="flex-shrink-0 px-4 py-4 text-center">
                                <p className="text-white/50 text-sm mb-1">Conjugate in present tense:</p>
                                <p className="text-2xl font-bold text-white">
                                    <span className="text-purple-400">{currentPerson}</span> + <span className="text-cyan-400">{currentVerb.infinitive}</span>
                                </p>
                                <p className="text-white/50 text-xs mt-1">({currentVerb.meaning})</p>

                                {gameState.streak >= 3 && (
                                    <div className="mt-2 inline-block px-3 py-1 bg-amber-500/20 rounded-full">
                                        <span className="text-amber-400 text-sm font-bold">🔥 {gameState.streak} streak!</span>
                                    </div>
                                )}
                            </div>

                            {/* Options */}
                            <div className="flex-1 px-4 py-2 flex flex-col justify-center gap-3">
                                {options.map((option, index) => {
                                    const isSelected = selectedAnswer === option;
                                    const isCorrect = option === currentVerb.conjugations[currentPerson as keyof typeof currentVerb.conjugations];
                                    const showCorrectness = showResult && (isSelected || isCorrect);

                                    return (
                                        <motion.button
                                            key={`${currentVerb.infinitive}-${index}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAnswer(option)}
                                            disabled={showResult}
                                            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all flex items-center justify-between ${showCorrectness
                                                    ? isCorrect
                                                        ? 'bg-emerald-500 text-white'
                                                        : isSelected
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-white/10 text-white/50'
                                                    : 'bg-white/10 text-white hover:bg-white/20 active:bg-white/30'
                                                }`}
                                        >
                                            <span>{option}</span>
                                            {showCorrectness && isCorrect && <Check className="w-6 h-6" />}
                                            {showCorrectness && isSelected && !isCorrect && <X className="w-6 h-6" />}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </>
                    ) : gameState.status === 'menu' ? (
                        <div className="flex-1 flex items-center justify-center p-6">
                            <div className="w-full max-w-sm text-center">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mb-8"
                                >
                                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-purple-500/30 mb-4">
                                        <Swords className="w-12 h-12 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-white mb-2">Verb Quest</h1>
                                    <p className="text-white/60">Battle enemies with verb conjugations!</p>
                                </motion.div>

                                {/* Language selector */}
                                <div className="flex justify-center gap-3 mb-6">
                                    {(['spanish', 'french'] as const).map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => setLanguage(lang)}
                                            className={`px-4 py-2 rounded-xl text-2xl transition-all ${language === lang ? 'bg-white/20 scale-110' : 'bg-white/5 opacity-60'
                                                }`}
                                        >
                                            {lang === 'spanish' ? '🇪🇸' : '🇫🇷'}
                                        </button>
                                    ))}
                                </div>

                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={startGame}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-2xl font-bold text-white text-lg shadow-lg mb-4 flex items-center justify-center gap-2"
                                >
                                    <Play className="w-6 h-6 fill-current" />
                                    Begin Quest
                                </motion.button>

                                <div className="text-white/40 text-sm">
                                    High Score: <span className="text-white font-mono">{gameState.highScore}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-6">
                            <div className="w-full max-w-sm text-center bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
                                <div className="text-6xl mb-4">
                                    {gameState.status === 'complete' ? '🏆' : '💀'}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {gameState.status === 'complete' ? 'Quest Complete!' : 'Defeated!'}
                                </h2>
                                <div className="text-5xl font-bold text-purple-400 mb-2">{gameState.score}</div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-white/10 rounded-xl p-3">
                                        <div className="text-2xl font-bold text-amber-400">{gameState.xp}</div>
                                        <div className="text-xs text-white/50">XP Earned</div>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-3">
                                        <div className="text-2xl font-bold text-emerald-400">{gameState.enemiesDefeated}</div>
                                        <div className="text-xs text-white/50">Enemies</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={startGame}
                                        className="w-full py-3 bg-purple-600 rounded-xl font-bold text-white flex items-center justify-center gap-2"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        New Quest
                                    </button>
                                    <button
                                        onClick={() => router.push('/mobile-games')}
                                        className="w-full py-3 bg-white/10 rounded-xl font-bold text-white"
                                    >
                                        Exit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MobilePageWrapper>
    );
}

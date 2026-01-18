'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2, Trophy, Zap, BookOpen, Globe2, Brain,
    Sparkles, ArrowRight, Clock, Star, Users, Wifi, WifiOff
} from 'lucide-react';
import { MobilePageWrapper, PullToRefresh } from '../../components/capacitor';
import { useNetworkStatus, getCategories, type SupportedLanguage, type VocabularyCategory } from '../../lib/mobile';
import MobileGameSetupModal, { type GameFilters } from './components/MobileGameSetupModal';

// Game definitions for mobile
const mobileGames = [
    {
        id: 'hangman',
        name: 'Hangman',
        description: 'Guess the word letter by letter',
        icon: '🎯',
        gradient: 'from-purple-600 via-violet-600 to-indigo-700',
        path: '/mobile-games/hangman',
        category: 'vocabulary',
        difficulty: 'Easy',
        duration: '2-3 min',
        available: true,
    },
    {
        id: 'memory-match',
        name: 'Memory Match',
        description: 'Find matching word pairs',
        icon: '🧠',
        gradient: 'from-pink-500 via-rose-500 to-red-600',
        path: '/mobile-games/memory-match',
        category: 'vocabulary',
        difficulty: 'Easy',
        duration: '2-4 min',
        available: true,
    },
    {
        id: 'word-scramble',
        name: 'Word Scramble',
        description: 'Unscramble the letters',
        icon: '🔤',
        gradient: 'from-cyan-500 via-blue-500 to-indigo-600',
        path: '/mobile-games/word-scramble',
        category: 'spelling',
        difficulty: 'Medium',
        duration: '2-4 min',
        available: true,
    },
    {
        id: 'word-towers',
        name: 'Word Towers',
        description: 'Stack blocks by matching translations',
        icon: '🏗️',
        gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
        path: '/mobile-games/word-towers',
        category: 'vocabulary',
        difficulty: 'Medium',
        duration: '3-5 min',
        available: true,
    },
    {
        id: 'vocab-blast',
        name: 'Vocab Blast',
        description: 'Pop gems and translate fast',
        icon: '💎',
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        path: '/mobile-games/vocab-blast',
        category: 'vocabulary',
        difficulty: 'Medium',
        duration: '3-5 min',
        available: true,
    },
    {
        id: 'sentence-towers',
        name: 'Sentence Towers',
        description: 'Build sentences word by word',
        icon: '🏛️',
        gradient: 'from-blue-500 via-indigo-500 to-purple-600',
        path: '/mobile-games/sentence-towers',
        category: 'sentences',
        difficulty: 'Hard',
        duration: '4-6 min',
        available: true,
    },
    {
        id: 'verb-quest',
        name: 'Verb Quest',
        description: 'Conjugate verbs in epic battles',
        icon: '⚔️',
        gradient: 'from-red-500 via-orange-500 to-yellow-600',
        path: '/mobile-games/verb-quest',
        category: 'grammar',
        difficulty: 'Hard',
        duration: '5-10 min',
        available: true,
    },
    {
        id: 'speed-builder',
        name: 'Speed Builder',
        description: 'Build sentences against the clock',
        icon: '🚀',
        gradient: 'from-violet-500 via-purple-500 to-indigo-600',
        path: '/mobile-games/speed-builder',
        category: 'sentences',
        difficulty: 'Hard',
        duration: '3-5 min',
        available: true,
    },
    {
        id: 'vocab-master',
        name: 'Vocab Master',
        description: 'Master vocabulary across all modes',
        icon: '👑',
        gradient: 'from-yellow-500 via-orange-500 to-red-600',
        path: '/mobile-games/vocab-master',
        category: 'vocabulary',
        difficulty: 'All Levels',
        duration: '5-10 min',
        available: true,
    },
    {
        id: 'detective-listening',
        name: 'Detective Listening',
        description: 'Solve mysteries with audio clues',
        icon: '🔍',
        gradient: 'from-slate-600 via-amber-600 to-orange-600',
        path: '/mobile-games/detective-listening',
        category: 'listening',
        difficulty: 'Medium',
        duration: '4-6 min',
        available: true,
    },
    {
        id: 'case-file-translator',
        name: 'Case File Translator',
        description: 'Translate sentences to solve cases',
        icon: '📁',
        gradient: 'from-slate-700 via-blue-600 to-indigo-700',
        path: '/mobile-games/case-file-translator',
        category: 'sentences',
        difficulty: 'Medium',
        duration: '4-6 min',
        available: true,
    },
];

// Category filters
const categories = [
    { id: 'all', name: 'All Games', icon: Gamepad2 },
    { id: 'vocabulary', name: 'Vocabulary', icon: BookOpen },
    { id: 'sentences', name: 'Sentences', icon: Globe2 },
    { id: 'listening', name: 'Listening', icon: Globe2 },
    { id: 'spelling', name: 'Spelling', icon: Brain },
];

// Languages
const languages: { code: SupportedLanguage; name: string; flag: string }[] = [
    { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { code: 'french', name: 'French', flag: '🇫🇷' },
    { code: 'german', name: 'German', flag: '🇩🇪' },
];

export default function MobileGamesPage() {
    const router = useRouter();
    const { isOnline } = useNetworkStatus();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('spanish');

    // Modal State
    const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<typeof mobileGames[0] | null>(null);

    const [refreshing, setRefreshing] = useState(false);
    const [vocabCount, setVocabCount] = useState(0);

    // Load vocab count for selected language
    useEffect(() => {
        loadVocabCount();
    }, [selectedLanguage]);

    const loadVocabCount = async () => {
        const cats = await getCategories(selectedLanguage);
        const count = cats.reduce((total, cat) =>
            total + cat.subcategories.reduce((subTotal, sub) =>
                subTotal + sub.words.length, 0
            ), 0
        );
        setVocabCount(count);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadVocabCount();
        await new Promise(resolve => setTimeout(resolve, 500));
        setRefreshing(false);
    };

    const filteredGames = mobileGames.filter(game =>
        selectedCategory === 'all' || game.category === selectedCategory
    );

    const handleGameTap = (game: typeof mobileGames[0]) => {
        if (!game.available) {
            // Could show a "coming soon" toast
            return;
        }
        setSelectedGame(game);
        setIsSetupModalOpen(true);
    };

    const handleStartGame = (filters: GameFilters) => {
        if (!selectedGame) return;

        const params = new URLSearchParams();
        params.append('lang', filters.language);
        params.append('level', filters.curriculumLevel);

        if (filters.tier) params.append('tier', filters.tier);
        if (filters.examBoard) params.append('board', filters.examBoard);
        if (filters.category) params.append('cat', filters.category);
        if (filters.subcategory) params.append('sub', filters.subcategory);

        setIsSetupModalOpen(false);
        router.push(`${selectedGame.path}?${params.toString()}`);
    };

    return (
        <MobilePageWrapper showHeader={false} safeAreaTop={true}>
            <PullToRefresh onRefresh={handleRefresh}>
                <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0f0f1a]">
                    {/* Ambient background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl" />
                        <div className="absolute bottom-40 -right-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 px-5 pt-4 pb-32">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between mb-6"
                        >
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Gamepad2 className="w-6 h-6 text-purple-400" />
                                    Games
                                </h1>
                                <p className="text-white/50 text-sm">Play and learn offline</p>
                            </div>

                            {/* Network status indicator */}
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isOnline
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                                }`}>
                                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                                {isOnline ? 'Online' : 'Offline'}
                            </div>
                        </motion.div>



                        {/* Category Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex gap-2 mb-6 overflow-x-auto no-scrollbar"
                        >
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${selectedCategory === cat.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                                        }`}
                                >
                                    <cat.icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{cat.name}</span>
                                </button>
                            ))}
                        </motion.div>

                        {/* Games Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-2 gap-2"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredGames.map((game, index) => (
                                    <motion.div
                                        key={game.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileTap={{ scale: game.available ? 0.98 : 1 }}
                                        onClick={() => handleGameTap(game)}
                                        className={`relative overflow-hidden rounded-xl ${game.available
                                            ? 'cursor-pointer'
                                            : 'opacity-60 cursor-not-allowed'
                                            } h-28`}
                                    >
                                        {/* Gradient background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${game.gradient} opacity-90`} />

                                        {/* Glass overlay */}
                                        <div className="absolute inset-0 bg-white/5" />

                                        {/* Content */}
                                        <div className="relative z-10 p-3 h-full flex flex-col justify-between">
                                            {/* Top Row: Availability Badge (if needed) & Name */}
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-white text-md leading-tight max-w-[85%]">{game.name}</h3>
                                                {!game.available && (
                                                    <span className="px-1.5 py-0.5 bg-black/30 rounded text-[9px] font-medium text-white/90">
                                                        Soon
                                                    </span>
                                                )}
                                            </div>

                                            {/* Middle: Description (Hidden on very small cards if needed, or kept brief) */}
                                            {/* <p className="text-white/70 text-[10px] line-clamp-2 mt-1">{game.description}</p> */}

                                            {/* Bottom Row: Stats */}
                                            <div className="flex items-center justify-between mt-auto pt-2">
                                                <div className="flex items-center gap-2 text-[10px] text-white/60">
                                                    <span className="flex items-center gap-0.5">
                                                        <Clock className="w-3 h-3" />
                                                        {game.duration.replace(' min', 'm')}
                                                    </span>
                                                </div>

                                                {/* Optional: Difficulty dot */}
                                                <div className="flex items-center gap-1 text-[9px] text-white/50 bg-black/10 px-1.5 py-0.5 rounded-md">
                                                    {game.difficulty}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Quick Play Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-6"
                        >
                            <div
                                onClick={() => {
                                    // Pick a random available game
                                    const available = mobileGames.filter(g => g.available);
                                    const random = available[Math.floor(Math.random() * available.length)];
                                    if (random) handleGameTap(random);
                                }}
                                className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/20 backdrop-blur-sm cursor-pointer hover:from-purple-500/25 hover:to-indigo-500/25 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-white">Quick Play</p>
                                        <p className="text-xs text-white/50">Jump into a random game</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-purple-400" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Offline notice */}
                        {!isOnline && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center"
                            >
                                <p className="text-amber-400 text-xs">
                                    <WifiOff className="w-3 h-3 inline mr-1" />
                                    You're offline. Games work with bundled vocabulary!
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </PullToRefresh>

            <MobileGameSetupModal
                isOpen={isSetupModalOpen}
                onClose={() => setIsSetupModalOpen(false)}
                gameName={selectedGame?.name || 'Game'}
                onStartGame={handleStartGame}
                initialLanguage={selectedLanguage}
            />
        </MobilePageWrapper>
    );
}

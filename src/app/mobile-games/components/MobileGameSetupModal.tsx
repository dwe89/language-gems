'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, ChevronRight, Check, BookOpen, Layers, GraduationCap,
    School, Globe2, AlertCircle, Play, ChevronLeft
} from 'lucide-react';
import {
    type SupportedLanguage,
    getAvailableCategories,
    getAvailableSubcategories,
    getFilteredVocabulary
} from '../../../lib/mobile/VocabularyStore';

interface MobileGameSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameName: string;
    onStartGame: (filters: GameFilters) => void;
}

export interface GameFilters {
    language: SupportedLanguage;
    curriculumLevel: 'KS3' | 'KS4';
    tier?: 'foundation' | 'higher';
    examBoard?: 'AQA' | 'EDEXCEL' | 'WJEC';
    category?: string;
    subcategory?: string;
}

const LANGUAGES: { code: SupportedLanguage; name: string; flag: string }[] = [
    { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { code: 'french', name: 'French', flag: '🇫🇷' },
    { code: 'german', name: 'German', flag: '🇩🇪' },
];

export default function MobileGameSetupModal({
    isOpen,
    onClose,
    gameName,
    onStartGame,
    initialLanguage = 'spanish'
}: MobileGameSetupModalProps & { initialLanguage?: SupportedLanguage }) {
    const [wordCount, setWordCount] = useState<number | null>(null);
    const [loadingCount, setLoadingCount] = useState(false);

    // Filter State
    const [filters, setFilters] = useState<GameFilters>({
        language: initialLanguage,
        curriculumLevel: 'KS3',
    });

    // Reset filters when modal opens or initialLanguage changes
    useEffect(() => {
        if (isOpen) {
            setFilters(prev => ({ ...prev, language: initialLanguage }));
        }
    }, [isOpen, initialLanguage]);

    // Content State
    const [categories, setCategories] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<string[]>([]);

    // Load word count whenever filters change
    useEffect(() => {
        if (!isOpen) return;

        const updateCount = async () => {
            setLoadingCount(true);
            try {
                const words = await getFilteredVocabulary(filters);
                setWordCount(words.length);
            } catch (e) {
                console.error('Failed to count words', e);
            } finally {
                setLoadingCount(false);
            }
        };

        const timer = setTimeout(updateCount, 300); // Debounce
        return () => clearTimeout(timer);
    }, [filters, isOpen]);

    // Load categories based on language/level
    useEffect(() => {
        if (!isOpen) return;
        getAvailableCategories(filters.language, filters.curriculumLevel).then(setCategories);
    }, [filters.language, filters.curriculumLevel, isOpen]);

    // Load subcategories based on category
    useEffect(() => {
        if (!isOpen || !filters.category) {
            setSubcategories([]);
            return;
        }
        getAvailableSubcategories(filters.language, filters.category).then(setSubcategories);
    }, [filters.language, filters.category, isOpen]);

    // Helper to format category names (snake_case -> Title Case)
    const formatName = (str: string) => str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
                    />

                    {/* Modal - positioned above tab bar */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed left-0 right-0 z-[70] bg-[#1a1a2e] rounded-t-3xl border-t border-white/10 flex flex-col"
                        style={{ bottom: '80px', maxHeight: 'calc(100vh - 160px)' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/5 shrink-0">
                            <div>
                                <h3 className="text-white font-bold text-lg">{gameName}</h3>
                                <p className="text-white/40 text-xs">Setup your game</p>
                            </div>
                            <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-white/60">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-5">

                            {/* Language */}
                            <div>
                                <label className="text-white/60 text-xs uppercase font-bold mb-2 block flex items-center gap-2">
                                    <Globe2 className="w-3 h-3" /> Language
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => setFilters({ ...filters, language: lang.code })}
                                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${filters.language === lang.code
                                                ? 'bg-purple-600/20 border-purple-500 text-white'
                                                : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                                                }`}
                                        >
                                            <span className="text-2xl">{lang.flag}</span>
                                            <span className="text-xs font-medium">{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Level */}
                            <div>
                                <label className="text-white/60 text-xs uppercase font-bold mb-2 block flex items-center gap-2">
                                    <GraduationCap className="w-3 h-3" /> Level
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['KS3', 'KS4'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setFilters({ ...filters, curriculumLevel: level as 'KS3' | 'KS4' })}
                                            className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${filters.curriculumLevel === level
                                                ? 'bg-indigo-600/20 border-indigo-500 text-white'
                                                : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${filters.curriculumLevel === level ? 'bg-indigo-500' : 'bg-white/10'
                                                }`}>
                                                {level === 'KS3' ? '3' : '4'}
                                            </div>
                                            <div className="text-left">
                                                <span className="block font-bold text-sm">{level === 'KS3' ? 'Key Stage 3' : 'GCSE (KS4)'}</span>
                                                <span className="text-[10px] opacity-60">
                                                    {level === 'KS3' ? 'Years 7-9' : 'Years 10-11'}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Exam Board & Tier (Only for KS4) */}
                            {filters.curriculumLevel === 'KS4' && (
                                <>
                                    <div>
                                        <label className="text-white/60 text-xs uppercase font-bold mb-2 block flex items-center gap-2">
                                            <School className="w-3 h-3" /> Exam Board
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['AQA', 'EDEXCEL', 'WJEC'].map(board => (
                                                <button
                                                    key={board}
                                                    onClick={() => setFilters({ ...filters, examBoard: board as any })}
                                                    className={`py-2.5 px-2 rounded-xl border text-sm font-medium transition-all ${filters.examBoard === board
                                                        ? 'bg-purple-600/20 border-purple-500 text-white'
                                                        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {board}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-white/60 text-xs uppercase font-bold mb-2 block flex items-center gap-2">
                                            <Layers className="w-3 h-3" /> Tier
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { id: 'foundation', label: 'Foundation', desc: 'Grades 1-5' },
                                                { id: 'higher', label: 'Higher', desc: 'Grades 4-9' }
                                            ].map(tier => (
                                                <button
                                                    key={tier.id}
                                                    onClick={() => setFilters({ ...filters, tier: tier.id as any })}
                                                    className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${filters.tier === tier.id
                                                        ? 'bg-blue-600/20 border-blue-500 text-white'
                                                        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${filters.tier === tier.id ? 'border-blue-500 bg-blue-500' : 'border-white/30'
                                                        }`}>
                                                        {filters.tier === tier.id && <Check className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                    <div className="text-left">
                                                        <span className="block font-medium text-sm">{tier.label}</span>
                                                        <span className="text-[10px] opacity-60">{tier.desc}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Topic / Category */}
                            <div>
                                <label className="text-white/60 text-xs uppercase font-bold mb-2 block flex items-center gap-2">
                                    <BookOpen className="w-3 h-3" /> Topic (Optional)
                                </label>
                                <div
                                    className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pb-4"
                                    style={{
                                        maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                                    }}
                                >
                                    <button
                                        onClick={() => setFilters({ ...filters, category: undefined, subcategory: undefined })}
                                        className={`p-2.5 rounded-lg text-left text-sm transition-all border ${!filters.category
                                            ? 'bg-emerald-600/20 border-emerald-500 text-white'
                                            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="font-bold flex items-center gap-2">
                                            <Layers className="w-4 h-4" /> All Topics
                                        </span>
                                    </button>

                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFilters({ ...filters, category: cat, subcategory: undefined })}
                                            className={`p-2.5 rounded-lg text-left text-sm transition-all border flex items-center justify-between ${filters.category === cat
                                                ? 'bg-purple-600/20 border-purple-500 text-white'
                                                : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            <span>{formatName(cat)}</span>
                                            {filters.category === cat && <Check className="w-4 h-4 text-purple-400" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Subcategory (if category selected) */}
                            {filters.category && subcategories.length > 0 && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                    <label className="text-white/60 text-xs uppercase font-bold mb-2 block">
                                        Sub-topic
                                    </label>
                                    <div
                                        className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto pb-4"
                                        style={{
                                            maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                                            WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                                        }}
                                    >
                                        <button
                                            onClick={() => setFilters({ ...filters, subcategory: undefined })}
                                            className={`p-2.5 rounded-lg text-left text-sm transition-all border ${!filters.subcategory
                                                ? 'bg-emerald-600/20 border-emerald-500 text-white'
                                                : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            <span className="font-bold">All Sub-topics</span>
                                        </button>

                                        {subcategories.map(sub => (
                                            <button
                                                key={sub}
                                                onClick={() => setFilters({ ...filters, subcategory: sub })}
                                                className={`p-2.5 rounded-lg text-left text-sm transition-all border flex items-center justify-between ${filters.subcategory === sub
                                                    ? 'bg-blue-600/20 border-blue-500 text-white'
                                                    : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                                                    }`}
                                            >
                                                <span>{formatName(sub)}</span>
                                                {filters.subcategory === sub && <Check className="w-4 h-4 text-blue-400" />}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Footer / Action Bar - Always Visible */}
                        <div className="p-4 border-t border-white/5 bg-[#1a1a2e] shrink-0 rounded-b-3xl">
                            {/* Stats */}
                            <div className="flex justify-between items-center text-xs mb-3">
                                <span className="text-white/40">Vocabulary Set</span>
                                {loadingCount ? (
                                    <span className="text-white/40 animate-pulse">Calculating...</span>
                                ) : (
                                    <span className={`font-medium ${wordCount && wordCount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {wordCount?.toLocaleString() || 0} words found
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => onStartGame(filters)}
                                disabled={!wordCount || wordCount === 0}
                                className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
                            >
                                <Play className="w-5 h-5 fill-current" /> Start Game
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

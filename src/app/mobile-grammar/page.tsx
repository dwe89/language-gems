'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Users, Star, ChevronRight, Zap, Languages, Brain } from 'lucide-react';
import Link from 'next/link';
import { MobilePageWrapper } from '../../components/capacitor';
import FlagIcon from '../../components/ui/FlagIcon';

const languages = [
    {
        code: 'spanish',
        name: 'Spanish',
        countryCode: 'ES',
        color: 'from-orange-500 to-red-600',
        description: 'Master Spanish grammar with comprehensive guides.',
        topics: 25,
        difficulty: 'Beginner+'
    },
    {
        code: 'french',
        name: 'French',
        countryCode: 'FR',
        color: 'from-blue-500 to-indigo-600',
        description: 'Learn French grammar rules and conjugations.',
        topics: 22,
        difficulty: 'Beginner+'
    },
    {
        code: 'german',
        name: 'German',
        countryCode: 'DE',
        color: 'from-gray-800 to-yellow-500',
        description: 'Navigate German grammar and cases.',
        topics: 18,
        difficulty: 'Intermediate'
    }
];

export default function MobileGrammarPage() {
    return (
        <MobilePageWrapper title="Grammar" showBackButton={true} safeAreaTop={true}>
            <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] via-[#16162a] to-[#0f0f1a] px-5 pb-24 pt-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-lg">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Grammar Guides</h1>
                    </div>
                    <p className="text-white/60 text-sm">Master language structure across Spanish, French, and German</p>
                </motion.div>

                <div className="grid grid-cols-1 gap-4">
                    {languages.map((language, index) => (
                        <motion.div
                            key={language.code}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/grammar/${language.code}`}>
                                <div className="relative overflow-hidden rounded-2xl bg-[#24243e] border border-white/10 p-5 shadow-lg group active:scale-95 transition-all">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${language.color} opacity-10 blur-xl rounded-full -mr-8 -mt-8`} />

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3 z-10">
                                            <FlagIcon countryCode={language.countryCode} size="lg" className="rounded-md shadow-sm" />
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{language.name}</h3>
                                                <div className="flex items-center gap-1 text-xs text-white/50">
                                                    <Star className="w-3 h-3 text-yellow-500" />
                                                    <span>{language.topics} Topics</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-white/30" />
                                    </div>

                                    <p className="text-white/70 text-sm mb-4 leading-relaxed relative z-10">
                                        {language.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <span className="text-xs font-medium text-white/40 bg-white/5 px-2 py-1 rounded">
                                            {language.difficulty}
                                        </span>
                                        <span className="text-sm font-semibold text-purple-400 flex items-center gap-1">
                                            Start Learning <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </MobilePageWrapper>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

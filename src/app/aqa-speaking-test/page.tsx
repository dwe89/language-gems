'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mic, ArrowLeft, Sparkles, GraduationCap, Languages } from 'lucide-react';

export default function AqaSpeakingTestPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-teal-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Decorative Elements */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl w-full text-center relative z-10"
            >
                {/* Main Content Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">

                    <motion.div
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            delay: 0.2
                        }}
                        className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg transform rotate-3"
                    >
                        <Mic className="h-12 w-12 text-white" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        AQA Speaking Test Simulator
                    </h1>

                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200 text-sm font-semibold mb-8 uppercase tracking-wider backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Coming Soon
                    </div>

                    <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                        Prepare for your GCSE French, Spanish, and German speaking exams with our AI-powered simulator. Practice role-plays, photo cards, and general conversation in a stress-free environment.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
                        <FeatureItem icon={<GraduationCap />} text="Exact Exam Format" />
                        <FeatureItem icon={<Mic />} text="AI Pronunciation Feedback" />
                        <FeatureItem icon={<Languages />} text="Role Play Scenarios" />
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                </div>

                <p className="mt-8 text-white/40 text-sm">
                    Part of the LanguageGems Premium Suite
                </p>

            </motion.div>
        </div>
    );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="mr-3 text-yellow-400">
                {React.cloneElement(icon as React.ReactElement, { size: 20 })}
            </div>
            <span className="text-white/90 text-sm font-medium">{text}</span>
        </div>
    );
}

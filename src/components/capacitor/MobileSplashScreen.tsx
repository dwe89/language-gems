'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SplashScreen } from '@capacitor/splash-screen';

interface Props {
    platform?: 'ios' | 'android' | 'web';
}

/**
 * Animated splash screen for native app loading
 */
export function MobileSplashScreen({ platform }: Props) {
    // Hide native splash screen once this component mounts
    // This ensures a seamless transition from Native Splash -> JS Splash
    useEffect(() => {
        const hideNativeSplash = async () => {
            try {
                await SplashScreen.hide({ fadeOutDuration: 200 });
            } catch (e) {
                // Ignore errors on web/if already hidden
            }
        };
        hideNativeSplash();
    }, []);

    return (
        <div
            className="fixed inset-0 bg-[#1a1a2e] flex flex-col items-center justify-center z-[99999]"
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 -left-32 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-indigo-600/30 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            {/* Logo and branding */}
            <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Gem Icon */}
                <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 10 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                    }}
                    className="w-24 h-24 mb-6"
                >
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                        <Sparkles className="w-12 h-12 text-white" />
                    </div>
                </motion.div>

                {/* App Name */}
                <motion.h1
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-3xl font-bold text-white mb-2"
                >
                    Language Gems
                </motion.h1>

                <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-white/60 text-sm"
                >
                    Learn languages through play
                </motion.p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-20 flex flex-col items-center"
            >
                <div className="flex space-x-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.15,
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

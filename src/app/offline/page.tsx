'use client';

import { useEffect } from 'react';

export default function OfflinePage() {
    useEffect(() => {
        // Auto-reload when connection is restored
        const handleOnline = () => {
            window.location.href = '/';
        };

        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex flex-col items-center justify-center p-5 text-white text-center">
            <div className="max-w-md animate-fade-in">
                {/* Gem Icon */}
                <div className="w-32 h-32 mx-auto mb-8 relative">
                    <div
                        className="w-full h-full bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-700 flex items-center justify-center shadow-2xl animate-pulse"
                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                    >
                        {/* WiFi Off Icon */}
                        <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="1" y1="1" x2="23" y2="23" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" stroke="white" strokeLinecap="round" />
                            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" stroke="white" strokeLinecap="round" />
                            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" stroke="white" strokeLinecap="round" />
                            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" stroke="white" strokeLinecap="round" />
                            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" stroke="white" strokeLinecap="round" />
                            <circle cx="12" cy="20" r="1" fill="white" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    You&apos;re Offline
                </h1>

                {/* Description */}
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                    It looks like you&apos;ve lost your internet connection. Don&apos;t worry, your progress is safe!
                </p>

                {/* Retry Button */}
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-3 px-7 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl active:translate-y-0"
                    style={{ boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)' }}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M23 4v6h-6M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    Try Again
                </button>

                {/* Tips */}
                <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10">
                    <h2 className="text-sm text-white/60 uppercase tracking-wider mb-3 font-medium">
                        Quick fixes
                    </h2>
                    <ul className="text-left space-y-3">
                        {[
                            'Check your WiFi or mobile data connection',
                            'Move closer to your router',
                            'Try switching between WiFi and mobile data',
                            'Check if airplane mode is enabled',
                        ].map((tip, i) => (
                            <li key={i} className="text-sm text-white/70 flex items-center gap-3">
                                <span className="text-purple-400 text-xl">•</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Brand Footer */}
            <div className="absolute bottom-8 text-sm text-white/40">
                Powered by <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">Language Gems</span>
            </div>
        </div>
    );
}

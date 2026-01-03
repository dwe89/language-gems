'use client';

import React from 'react';
import { ComingSoonOverlay } from '@/components/ui/ComingSoonOverlay';

// Types
export interface LyricLine {
    id: number;
    timestamp: number;
    endTimestamp?: number;
    text: string;
    translation?: string;
}

export interface KaraokeQuestion {
    id: string;
    timestamp: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    type: 'vocabulary' | 'grammar' | 'comprehension';
}

interface LyricsTrainingPlayerProps {
    videoId: string;
    youtubeId: string;
    lyrics: LyricLine[];
    questions?: KaraokeQuestion[];
    language: string;
    title?: string;
    onComplete?: (results: any) => void;
    difficulty?: 'beginner' | 'intermediate' | 'expert';
}

export default function LyricsTrainingPlayer({
    title
}: LyricsTrainingPlayerProps) {
    return (
        <div className="relative bg-[#1a3a4a] rounded-xl overflow-hidden shadow-2xl aspect-video">
            <ComingSoonOverlay
                featureName={title || "Lyrics Training Mode"}
                description="We are putting the final touches on our interactive lyrics training mode. Get ready to sing perfectly!"
            />
        </div>
    );
}

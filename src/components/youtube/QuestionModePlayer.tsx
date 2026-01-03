'use client';

import React from 'react';
import { ComingSoonOverlay } from '@/components/ui/ComingSoonOverlay';

export interface VideoQuestion {
    id: string;
    timestamp: number;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
    type: 'vocabulary' | 'grammar' | 'comprehension';
}

interface QuestionModePlayerProps {
    videoId: string;
    youtubeId: string;
    questions: VideoQuestion[];
    language: string;
    title?: string;
    onComplete?: (results: any) => void;
}

export default function QuestionModePlayer({
    title
}: QuestionModePlayerProps) {
    return (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 aspect-video">
            <ComingSoonOverlay
                featureName={title || "Question Mode"}
                description="Our interactive video quiz mode is almost ready. Challenge yourself soon!"
            />
        </div>
    );
}

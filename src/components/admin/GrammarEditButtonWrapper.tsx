'use client';

import dynamic from 'next/dynamic';

// Dynamically import the GrammarEditButton to ensure it only renders on the client
const GrammarEditButton = dynamic(() => import('./GrammarEditButton'), {
  ssr: false,
  loading: () => null,
});

interface GrammarEditButtonWrapperProps {
  language: string;
  category: string;
  topicSlug: string;
  initialData: {
    title: string;
    description: string;
    difficulty: string;
    estimated_time: number;
    youtube_video_id?: string | null;
    sections: any[];
    related_topics?: any[] | null;
    practice_url?: string | null;
    quiz_url?: string | null;
  };
}

export default function GrammarEditButtonWrapper(props: GrammarEditButtonWrapperProps) {
  return <GrammarEditButton {...props} />;
}


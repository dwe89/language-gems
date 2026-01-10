'use client';

import { useSearchParams } from 'next/navigation';
import GrammarPageTemplate from './GrammarPageTemplate';
import GrammarLessonTracker from './GrammarLessonTracker';
import GrammarEditButton from '../admin/GrammarEditButton';

interface Section {
  title: string;
  content?: string;
  examples?: any[];
  conjugationTable?: any;
  subsections?: any[];
}

interface GrammarPageContentProps {
  page: {
    language: string;
    category: string;
    topic_slug: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimated_time: number;
    sections: Section[];
    back_url?: string;
    practice_url?: string;
    quiz_url?: string;
    song_url?: string;
    youtube_video_id?: string;
    related_topics?: {
      title: string;
      url: string;
      difficulty: string;
    }[];
  };
  topicData?: { id: string };
  contentData?: { id: string };
  isAdmin: boolean;
  languageMap: Record<string, string>;
}

export default function GrammarPageContent({
  page,
  topicData,
  contentData,
  isAdmin,
  languageMap
}: GrammarPageContentProps) {
  const searchParams = useSearchParams();
  const isAssignmentMode = !!searchParams.get('assignment');

  console.log('📄 [PAGE CONTENT] Rendering with assignment mode:', isAssignmentMode);

  return (
    <>
      {/* Assignment Tracker (invisible, only tracks when in assignment mode) */}
      {topicData && contentData && (
        <GrammarLessonTracker
          topicId={topicData.id}
          contentId={contentData.id}
        />
      )}

      <GrammarPageTemplate
        language={languageMap[page.language] || page.language}
        category={page.category}
        topic={page.topic_slug}
        title={page.title}
        description={page.description}
        difficulty={page.difficulty}
        estimatedTime={page.estimated_time}
        sections={page.sections}
        backUrl={page.back_url || `/grammar/${page.language}`}
        practiceUrl={page.practice_url}
        quizUrl={page.quiz_url}
        songUrl={page.song_url}
        youtubeVideoId={page.youtube_video_id}
        relatedTopics={page.related_topics || []}
        isAssignmentMode={isAssignmentMode}
      />

      {/* Admin Edit Button (only visible to danieletienne89@gmail.com) */}
      {isAdmin && topicData && (
        <GrammarEditButton
          topicId={topicData.id}
          initialData={{
            title: page.title,
            description: page.description,
            difficulty: page.difficulty,
            estimated_time: page.estimated_time,
            sections: page.sections,
            practice_url: page.practice_url,
            quiz_url: page.quiz_url,
            song_url: page.song_url,
            youtube_video_id: page.youtube_video_id,
            related_topics: page.related_topics,
          }}
        />
      )}
    </>
  );
}

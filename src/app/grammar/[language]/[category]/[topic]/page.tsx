import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import GrammarPageTemplate from '@/components/grammar/GrammarPageTemplate';
import GrammarEditButton from '@/components/admin/GrammarEditButton';
import GrammarLessonTracker from '@/components/grammar/GrammarLessonTracker';

interface PageProps {
  params: {
    language: string;
    category: string;
    topic: string;
  };
}

// Generate static params for all grammar pages (for static generation)
// Note: This runs at build time, so we use a direct Supabase client (not cookies-based)
export async function generateStaticParams() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: pages } = await supabase
    .from('grammar_pages')
    .select('language, category, topic_slug');

  if (!pages) return [];

  return pages.map((page) => ({
    language: page.language,
    category: page.category,
    topic: page.topic_slug,
  }));
}

// Generate metadata dynamically from database
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();

  const { data: page } = await supabase
    .from('grammar_pages')
    .select('title, description')
    .eq('language', params.language)
    .eq('category', params.category)
    .eq('topic_slug', params.topic)
    .single();

  if (!page) {
    return {
      title: 'Grammar Topic Not Found - Language Gems',
      description: 'The requested grammar topic could not be found.',
    };
  }

  return {
    title: `${page.title} - Language Gems`,
    description: page.description,
    keywords: `${params.language} grammar, ${params.category}, ${params.topic}, language learning`,
  };
}

export default async function DynamicGrammarPage({ params }: PageProps) {
  const supabase = await createClient();

  // Check if current user is admin (server-side)
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === 'danieletienne89@gmail.com';

  // Fetch page data from database
  const { data: page, error } = await supabase
    .from('grammar_pages')
    .select('*')
    .eq('language', params.language)
    .eq('category', params.category)
    .eq('topic_slug', params.topic)
    .single();

  // Fetch topic ID and content ID for assignment tracking
  const { data: topicData } = await supabase
    .from('grammar_topics')
    .select('id')
    .eq('slug', params.topic)
    .eq('category', params.category)
    .eq('language', params.language)
    .single();

  const { data: contentData } = await supabase
    .from('grammar_content')
    .select('id')
    .eq('topic_id', topicData?.id)
    .eq('content_type', 'lesson')
    .maybeSingle();

  // Handle not found - show different message for admin vs regular users
  if (error || !page) {
    console.error('Error fetching grammar page:', error);

    // Import the client component for "no content" page
    const { GrammarNoContentPage } = await import('@/components/grammar/GrammarNoContentPage');
    return <GrammarNoContentPage params={params} isAdmin={isAdmin} />;
  }

  // Map language codes to full names
  const languageMap: Record<string, string> = {
    spanish: 'spanish',
    french: 'french',
    german: 'german',
  };

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
      />

      {/* Admin Edit Button (only visible to danieletienne89@gmail.com) */}
      {isAdmin && (
        <GrammarEditButton
          language={params.language}
          category={params.category}
          topicSlug={params.topic}
          initialData={{
            title: page.title,
            description: page.description,
            difficulty: page.difficulty,
            estimated_time: page.estimated_time,
            youtube_video_id: page.youtube_video_id,
            sections: page.sections,
            related_topics: page.related_topics,
            practice_url: page.practice_url,
            quiz_url: page.quiz_url,
          }}
        />
      )}
    </>
  );
}

// Enable ISR (Incremental Static Regeneration) with on-demand revalidation
export const revalidate = 3600; // Revalidate every hour, or use on-demand revalidation


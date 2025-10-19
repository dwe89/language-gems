import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import GrammarPageTemplate from '@/components/grammar/GrammarPageTemplate';

interface PageProps {
  params: {
    language: string;
    category: string;
    topic: string;
  };
}

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
      title: 'Page not found',
    };
  }

  return {
    title: `${page.title} | Language Gems`,
    description: page.description,
  };
}

export default async function DynamicGrammarPage({ params }: PageProps) {
  const supabase = await createClient();

  const { data: page, error } = await supabase
    .from('grammar_pages')
    .select('*')
    .eq('language', params.language)
    .eq('category', params.category)
    .eq('topic_slug', params.topic)
    .single();

  if (error || !page) {
    notFound();
  }

  return (
    <GrammarPageTemplate
      page={page}
      language={params.language}
      category={params.category}
      topic={params.topic}
    />
  );
}


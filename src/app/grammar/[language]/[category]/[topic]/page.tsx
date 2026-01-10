import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import GrammarPageTemplate from '@/components/grammar/GrammarPageTemplate';
import GrammarEditButton from '@/components/admin/GrammarEditButton';
import GrammarLessonTracker from '@/components/grammar/GrammarLessonTracker';
import GrammarClientWrapper from '@/components/grammar/GrammarClientWrapper';
import GrammarPageContent from '@/components/grammar/GrammarPageContent';

interface PageProps {
  params: {
    language: string;
    category: string;
    topic: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
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

// Generate metadata dynamically from database with SEO optimization
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();

  const { data: page } = await supabase
    .from('grammar_pages')
    .select('title, description, seo_title, seo_description, seo_keywords')
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

  // Use SEO-optimized fields if available, otherwise fallback to regular fields
  const title = page.seo_title || `${page.title} - Language Gems`;
  const description = page.seo_description || page.description;
  const keywords = page.seo_keywords?.length > 0
    ? page.seo_keywords
    : [`${params.language} grammar`, params.category, params.topic, 'language learning'];

  const canonicalUrl = `https://languagegems.com/grammar/${params.language}/${params.category}/${params.topic}`;

  return {
    title,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Language Gems',
      type: 'article',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
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

  // Handle not found - return proper 404 for regular users, show editor for admin
  if (error || !page) {
    // For non-admin users, return a proper 404 (not a soft 404)
    // This fixes Google Search Console soft 404 issues
    if (!isAdmin) {
      notFound();
    }

    // Admin users can still see the page creation interface
    const { GrammarNoContentPage } = await import('@/components/grammar/GrammarNoContentPage');
    return <GrammarNoContentPage params={params} isAdmin={isAdmin} />;
  }

  // Map language codes to full names
  const languageMap: Record<string, string> = {
    spanish: 'spanish',
    french: 'french',
    german: 'german',
  };

  const languageDisplayNames: Record<string, string> = {
    spanish: 'Spanish',
    french: 'French',
    german: 'German',
  };

  // Generate JSON-LD structured data for SEO
  const canonicalUrl = `https://languagegems.com/grammar/${params.language}/${params.category}/${params.topic}`;

  // Breadcrumb schema for better navigation in search results
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Grammar',
        item: 'https://languagegems.com/grammar',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${languageDisplayNames[params.language] || params.language} Grammar`,
        item: `https://languagegems.com/grammar/${params.language}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: params.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        item: `https://languagegems.com/grammar/${params.language}#${params.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: page.title,
        item: canonicalUrl,
      },
    ],
  };

  // FAQ schema for rich snippets (if FAQ items exist)
  const faqSchema = page.faq_items && page.faq_items.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq_items.map((faq: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null;

  // Article schema for the educational content
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.seo_title || page.title,
    description: page.seo_description || page.description,
    author: {
      '@type': 'Organization',
      name: 'Language Gems',
      url: 'https://languagegems.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Language Gems',
      logo: {
        '@type': 'ImageObject',
        url: 'https://languagegems.com/favicon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    dateModified: page.updated_at,
    datePublished: page.created_at,
    educationalLevel: page.difficulty === 'beginner' ? 'beginner' : page.difficulty === 'intermediate' ? 'intermediate' : 'advanced',
    learningResourceType: 'lesson',
    inLanguage: 'en',
    about: {
      '@type': 'Thing',
      name: `${languageDisplayNames[params.language] || params.language} ${params.category.replace(/-/g, ' ')}`,
    },
  };

  // Always wrap with GrammarClientWrapper - it detects assignment mode client-side
  return (
    <GrammarClientWrapper
      topicId={topicData?.id || ''}
      topicTitle={page.title}
      language={params.language}
      category={params.category}
      topic={params.topic}
    >
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <GrammarPageContent
        page={page}
        topicData={topicData}
        contentData={contentData}
        isAdmin={isAdmin}
        languageMap={languageMap}
      />
    </GrammarClientWrapper>
  );
}

// Enable ISR (Incremental Static Regeneration) with on-demand revalidation
export const revalidate = 3600; // Revalidate every hour, or use on-demand revalidation


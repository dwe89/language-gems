import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSideClient } from '@/utils/supabase/client';
import { Calendar, Clock, Tag, ArrowLeft, BookOpen, User } from 'lucide-react';
import { cookies } from 'next/headers';
import BlogPostClient from './BlogPostClient';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  publish_date: string;
  seo_title: string | null;
  seo_description: string | null;
  reading_time_minutes: number;
}

// Fetch blog post data
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const cookieStore = cookies();
  const supabase = createServerSideClient(cookieStore);
  const now = new Date().toISOString();

  // Try to fetch published post
  let { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .eq('status', 'published')
    .maybeSingle();

  // If not found, try scheduled post
  if (!post) {
    const result = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .eq('status', 'scheduled')
      .lte('scheduled_for', now)
      .maybeSingle();
    
    post = result.data;
  }

  return post as BlogPost | null;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.'
    };
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      type: 'article',
      publishedTime: post.publish_date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-8">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <time dateTime={post.publish_date}>
                {formatDate(post.publish_date)}
              </time>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{post.reading_time_minutes} min read</span>
            </div>
          </div>

          <div className="flex gap-4">
            <BlogPostClient title={post.title} excerpt={post.excerpt} />
          </div>
        </header>

        {/* Article Content */}
        <div 
          className="prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-slate-900
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-slate-900 prose-strong:font-semibold
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-slate-600 prose-li:my-2
            prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-slate-900 prose-pre:text-slate-100
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Back to Blog CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Explore More Articles
          </h3>
          <p className="text-blue-100 mb-6">
            Discover more insights on language learning and exam preparation
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            View All Posts
          </Link>
        </div>
      </div>
    </div>
  );
}

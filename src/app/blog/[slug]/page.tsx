import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSideClient } from '@/utils/supabase/client';
import { Calendar, Clock, Tag, ArrowLeft, BookOpen, User } from 'lucide-react';
import { cookies } from 'next/headers';
import ReadingProgress from '@/components/blog/ReadingProgress';
import SocialShare from '@/components/blog/SocialShare';
import RelatedPosts from '@/components/blog/RelatedPosts';
import BlogSubscriptionSafe from '@/components/blog/BlogSubscriptionSafe';
import BlogSubscriptionModal from '@/components/blog/BlogSubscriptionModal';
import BlogEditButton from '@/components/admin/BlogEditButton';
import { getRelatedPosts } from '@/utils/blog/getRelatedPosts';
import { getColorScheme } from '@/lib/blog/colorSchemes';
import * as LucideIcons from 'lucide-react';

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
  category: string | null;
  color_scheme: string | null;
  icon_name: string | null;
  keywords: string[] | null;
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

  // Check if current user is admin (server-side)
  const cookieStore = await cookies();
  const supabase = createServerSideClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === 'danieletienne89@gmail.com';

  // Fetch related posts
  const relatedPosts = await getRelatedPosts(post.id, post.tags || [], 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get color scheme for this post
  const colorScheme = getColorScheme(post.color_scheme);

  // Get icon component dynamically
  const IconComponent = post.icon_name && (LucideIcons as any)[post.icon_name]
    ? (LucideIcons as any)[post.icon_name]
    : BookOpen;

  return (
    <>
      {/* Subscription Modal - triggers on both exit-intent and 50% scroll */}
      <BlogSubscriptionModal />

      {/* Reading Progress Bar */}
      <ReadingProgress />

      <div className={`min-h-screen bg-gradient-to-br ${colorScheme.gradient}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className={`inline-flex items-center ${colorScheme.accentColor} ${colorScheme.accentHover} font-medium transition-colors duration-200`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Link>
              <SocialShare
                title={post.title}
                url={`/blog/${post.slug}`}
                excerpt={post.excerpt}
              />
            </div>
          </div>
        </header>

        {/* Main Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Article */}
            <article className="lg:col-span-12">
              {/* Article Header */}
              <header className="mb-12 bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                {/* Icon and Title Section */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`${colorScheme.iconBg} p-3 rounded-lg flex-shrink-0`}>
                    <IconComponent className={`w-8 h-8 ${colorScheme.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                      {post.title}
                    </h1>
                    {post.category && (
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colorScheme.tagBg} ${colorScheme.tagText}`}>
                        {post.category}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorScheme.tagBg} ${colorScheme.tagText}`}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-6">
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
              </header>

              {/* Article Content */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-8">
                <div
                  className="prose prose-lg prose-slate max-w-none
                    prose-headings:font-bold prose-headings:text-slate-900
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:scroll-mt-24
                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:scroll-mt-24
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
              </div>

              {/* Newsletter Subscription */}
              <div className="mb-8">
                <BlogSubscriptionSafe variant="card" />
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mb-8">
                  <RelatedPosts
                    posts={relatedPosts}
                    currentSlug={post.slug}
                  />
                </div>
              )}

              {/* Final CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Transform Your Language Teaching?
                </h3>
                <p className="text-blue-100 mb-6">
                  Join thousands of teachers using LanguageGems to engage students and boost results
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg"
                  >
                    Start Free Trial
                  </Link>
                  <Link
                    href="/games"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all duration-200"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Explore Games
                  </Link>
                </div>
              </div>
            </article>


          </div>
        </div>
      </div>

      {/* Admin Edit Button - Only visible to admin users */}
      {isAdmin && (
        <BlogEditButton
          postId={post.id}
          slug={post.slug}
          initialData={{
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt,
            author: post.author,
            tags: post.tags || [],
            seo_title: post.seo_title,
            seo_description: post.seo_description,
            reading_time_minutes: post.reading_time_minutes,
          }}
        />
      )}
    </>
  );
}

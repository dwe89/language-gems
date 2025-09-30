import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSideClient } from '@/utils/supabase/client';
import { Calendar, Clock, Tag, ArrowLeft, Share2, BookOpen, User } from 'lucide-react';
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
  created_at: string;
  publish_date: string;
  seo_title: string | null;
  seo_description: string | null;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const now = new Date().toISOString();

  // Try to fetch the post
  let { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .eq('status', 'published')
    .maybeSingle();

  if (!post) {
    const result = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', params.slug)
      .eq('is_published', true)
      .eq('status', 'scheduled')
      .lte('scheduled_for', now)
      .maybeSingle();
    
    post = result.data;
  }

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

// Table of Contents Component
const TableOfContents = ({ content }: { content: string }) => {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);

  useEffect(() => {
    const extractHeadings = () => {
      const headingRegex = /^(#{1,3})\s+(.+)$/gm;
      const matches = Array.from(content.matchAll(headingRegex));
      
      const extractedHeadings = matches.map((match, index) => ({
        id: `heading-${index}`,
        text: match[2].replace(/\*/g, ''), // Remove markdown formatting
        level: match[1].length,
      }));
      
      setHeadings(extractedHeadings);
    };

    extractHeadings();
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-slate-50 rounded-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
        <BookOpen className="w-5 h-5 mr-2" />
        Table of Contents
      </h3>
      <nav className="space-y-2">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`block text-slate-600 hover:text-indigo-600 transition-colors ${
              heading.level === 1 ? 'font-medium' : 
              heading.level === 2 ? 'pl-4' : 'pl-8'
            }`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
};

// Custom markdown components with enhanced styling
const MarkdownComponents = {
  h1: ({ children, ...props }: any) => {
    const id = `heading-${Math.random().toString(36).substring(2)}`;
    return (
      <h1 id={id} className="text-3xl font-bold text-slate-900 mb-6 mt-8 scroll-mt-20" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }: any) => {
    const id = `heading-${Math.random().toString(36).substring(2)}`;
    return (
      <h2 id={id} className="text-2xl font-semibold text-slate-800 mb-4 mt-8 scroll-mt-20" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: any) => {
    const id = `heading-${Math.random().toString(36).substring(2)}`;
    return (
      <h3 id={id} className="text-xl font-semibold text-slate-800 mb-3 mt-6 scroll-mt-20" {...props}>
        {children}
      </h3>
    );
  },
  p: ({ children, ...props }: any) => (
    <p className="text-slate-600 leading-relaxed mb-4" {...props}>
      {children}
    </p>
  ),
  a: ({ children, href, ...props }: any) => (
    <a 
      href={href} 
      className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors" 
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ children, ...props }: any) => (
    <strong className="font-semibold text-slate-800" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic text-slate-700" {...props}>
      {children}
    </em>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-600" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 text-slate-600" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-indigo-300 bg-indigo-50 pl-4 pr-4 py-3 my-6 italic text-slate-700" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }: any) => {
    const isInline = !className;
    
    if (isInline) {
      return (
        <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    }
    
    return (
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto mb-6">
        <code className="text-sm font-mono" {...props}>
          {children}
        </code>
      </pre>
    );
  },
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse border border-slate-200 rounded-lg overflow-hidden" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th className="bg-slate-50 px-4 py-3 text-left font-semibold text-slate-800 border-b border-slate-200" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-4 py-3 text-slate-600 border-b border-slate-100" {...props}>
      {children}
    </td>
  ),
};

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [readingStats, setReadingStats] = useState<{ text: string; minutes: number; words: number } | null>(null);

  useEffect(() => {
    if (params?.slug) {
      fetchPost(params.slug as string);
    }
  }, [params?.slug]);

  const fetchPost = async (slug: string) => {
    try {
      const now = new Date().toISOString();
      
      // First try to get a published post
      let { data: postData, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .eq('status', 'published')
        .maybeSingle();

      // If not found, try to get a scheduled post that should be published
      if (!postData) {
        const result = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .eq('status', 'scheduled')
          .lte('scheduled_for', now)
          .maybeSingle();
        
        postData = result.data;
        error = result.error;
      }

      if (error) throw error;
      if (!postData) throw new Error('Post not found');
      
      const data = postData as BlogPost;
      setPost(data);

      // Calculate reading time
      if (data.content) {
        const stats = readingTime(data.content);
        setReadingStats(stats);
      }

      // Fetch related posts
      if (data.tags && data.tags.length > 0) {
        // Get published posts
        const { data: publishedRelated } = await supabase
          .from('blog_posts')
          .select('*')
          .neq('id', data.id)
          .eq('is_published', true)
          .eq('status', 'published')
          .limit(3);

        // Get scheduled posts that should be visible
        const { data: scheduledRelated } = await supabase
          .from('blog_posts')
          .select('*')
          .neq('id', data.id)
          .eq('is_published', true)
          .eq('status', 'scheduled')
          .lte('scheduled_for', now)
          .limit(3);

        // Combine and limit to 3
        const combined = [...(publishedRelated || []), ...(scheduledRelated || [])];
        setRelatedPosts(combined.slice(0, 3) as BlogPost[]);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const isHTMLContent = (content: string) => {
    return /<[^>]*>/g.test(content);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Post Not Found</h1>
            <p className="text-slate-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link
              href="/blog"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Background Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                {post.author && (
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                    <User className="h-4 w-4 mr-2" />
                    {post.author}
                  </div>
                )}
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(post.created_at)}
                </div>
                {readingStats && (
                  <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                    <Clock className="h-4 w-4 mr-2" />
                    {readingStats.text} • {readingStats.words} words
                  </div>
                )}
              </div>
              
              <button
                onClick={handleShare}
                className="inline-flex items-center px-6 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full transition-all duration-200 border border-white/30 hover:scale-105"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <article>
            {/* Content Card */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-16 mb-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-30 -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-100 to-indigo-100 rounded-full blur-3xl opacity-30 translate-y-16 -translate-x-16"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {isHTMLContent(post.content) ? (
                    // Enhanced HTML rendering with better typography
                    <div 
                      className="prose prose-xl prose-slate max-w-none formatted-content blog-content"
                      dangerouslySetInnerHTML={{ 
                        __html: post.content
                          .replace(/<h2>/g, '<h2 class="text-3xl font-bold mb-6 mt-12 text-slate-800 border-b border-slate-100 pb-4">')
                          .replace(/<h3>/g, '<h3 class="text-2xl font-semibold mb-4 mt-8 text-slate-800">')
                          .replace(/<h4>/g, '<h4 class="text-xl font-semibold mb-3 mt-6 text-slate-800">')
                          .replace(/<p>/g, '<p class="text-slate-700 leading-relaxed mb-6 text-lg">')
                          .replace(/<ul>/g, '<ul class="list-none pl-0 mb-6 space-y-3">')
                          .replace(/<ol>/g, '<ol class="list-none pl-0 mb-6 space-y-3 counter-reset-custom">')
                          .replace(/<li>/g, '<li class="leading-relaxed text-slate-700 pl-8 relative before:content-[\'•\'] before:text-indigo-500 before:font-bold before:absolute before:left-0">')
                          .replace(/<a /g, '<a class="text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors decoration-2 underline-offset-2" ')
                          .replace(/<strong>/g, '<strong class="font-bold text-slate-900">')
                          .replace(/<em>/g, '<em class="italic text-slate-800">')
                          .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-indigo-400 bg-gradient-to-r from-indigo-50 to-purple-50 pl-6 pr-6 py-4 my-8 italic text-slate-800 rounded-r-lg shadow-sm">')
                          .replace(/<code>/g, '<code class="bg-slate-100 text-slate-900 px-3 py-1 rounded-md text-sm font-mono border">')
                          .replace(/<pre>/g, '<pre class="bg-slate-900 text-slate-100 p-6 rounded-xl overflow-auto mb-8 shadow-lg border">')
                          .replace(/<table>/g, '<div class="overflow-x-auto mb-8 rounded-lg shadow-sm border border-slate-200"><table class="w-full border-collapse">')
                          .replace(/<\/table>/g, '</table></div>')
                          .replace(/<th>/g, '<th class="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 text-left font-bold text-slate-800 border-b-2 border-slate-200">')
                          .replace(/<td>/g, '<td class="px-6 py-4 text-slate-700 border-b border-slate-100">')
                          .replace(/<img /g, '<img class="rounded-xl shadow-lg my-8 w-full h-auto" ')
                      }}
                    />
                  ) : (
                    // Fallback for plain text content
                    <div className="prose prose-xl prose-slate max-w-none">
                      <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                        {post.content}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Continue Reading</h2>
                <p className="text-slate-600 text-lg">Discover more insights and tips</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="p-8">
                      <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6"></div>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-3 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(relatedPost.created_at)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Additional CSS for enhanced styling */}
      <style jsx>{`
        .blog-content img {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          margin: 2rem 0;
        }
        
        .blog-content h2:first-child {
          margin-top: 0;
        }
        
        .counter-reset-custom {
          counter-reset: custom-counter;
        }
        
        .counter-reset-custom li {
          counter-increment: custom-counter;
        }
        
        .counter-reset-custom li:before {
          content: counter(custom-counter) '.';
          color: #6366f1;
          font-weight: bold;
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
} 
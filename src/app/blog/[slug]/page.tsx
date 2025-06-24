'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { Calendar, Clock, Tag, ArrowLeft, Share2, BookOpen, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import readingTime from 'reading-time';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  created_at: string;
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
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;
      setPost(data);

      // Calculate reading time
      if (data?.content) {
        const stats = readingTime(data.content);
        setReadingStats(stats);
      }

      // Fetch related posts
      if (data?.tags && data.tags.length > 0) {
        const { data: related } = await supabase
          .from('blog_posts')
          .select('*')
          .neq('id', data.id)
          .eq('is_published', true)
          .limit(3);

        setRelatedPosts(related || []);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Article */}
          <article>
            {/* Header */}
            <header className="mb-12">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
                <div className="flex items-center space-x-6 text-slate-600">
                  {post.author && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {post.author}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(post.created_at)}
                  </div>
                  {readingStats && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {readingStats.text} • {readingStats.words} words
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </header>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Table of Contents */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <div className="sticky top-8">
                  <TableOfContents content={post.content} />
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-12">
                  {isHTMLContent(post.content) ? (
                    // Enhanced HTML rendering with better typography
                    <div 
                      className="prose prose-lg prose-slate max-w-none formatted-content"
                      dangerouslySetInnerHTML={{ 
                        __html: post.content
                          .replace(/<h2>/g, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-slate-800">')
                          .replace(/<h3>/g, '<h3 class="text-xl font-semibold mb-3 mt-6 text-slate-800">')
                          .replace(/<h4>/g, '<h4 class="text-lg font-semibold mb-2 mt-4 text-slate-800">')
                          .replace(/<p>/g, '<p class="text-slate-600 leading-relaxed mb-4">')
                          .replace(/<ul>/g, '<ul class="list-disc pl-6 mb-4 space-y-2 text-slate-600">')
                          .replace(/<ol>/g, '<ol class="list-decimal pl-6 mb-4 space-y-2 text-slate-600">')
                          .replace(/<li>/g, '<li class="leading-relaxed">')
                          .replace(/<a /g, '<a class="text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-colors" ')
                          .replace(/<strong>/g, '<strong class="font-semibold text-slate-800">')
                          .replace(/<em>/g, '<em class="italic text-slate-700">')
                          .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-indigo-300 bg-indigo-50 pl-4 pr-4 py-3 my-6 italic text-slate-700">')
                          .replace(/<code>/g, '<code class="bg-slate-100 text-slate-800 px-2 py-1 rounded text-sm font-mono">')
                          .replace(/<pre>/g, '<pre class="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto mb-6">')
                          .replace(/<table>/g, '<div class="overflow-x-auto mb-6"><table class="w-full border-collapse border border-slate-200 rounded-lg overflow-hidden">')
                          .replace(/<\/table>/g, '</table></div>')
                          .replace(/<th>/g, '<th class="bg-slate-50 px-4 py-3 text-left font-semibold text-slate-800 border-b border-slate-200">')
                          .replace(/<td>/g, '<td class="px-4 py-3 text-slate-600 border-b border-slate-100">')
                      }}
                    />
                  ) : (
                    // Enhanced Markdown rendering with custom components
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={MarkdownComponents}
                      className="prose prose-lg prose-slate max-w-none"
                    >
                      {post.content}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="h-3 w-3 mr-1" />
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
    </div>
  );
} 
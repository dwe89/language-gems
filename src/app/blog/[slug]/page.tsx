'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
    }
  }, [params.slug]);

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

  const getReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(' ').length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
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

        {/* Article */}
        <article className="max-w-4xl mx-auto">
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
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(post.created_at)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {getReadingTime(post.content)}
                </div>
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

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-12">
            <div className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-800 prose-ul:text-slate-600 prose-ol:text-slate-600">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({children}) => <h1 className="text-3xl font-bold mb-6 text-slate-800">{children}</h1>,
                  h2: ({children}) => <h2 className="text-2xl font-semibold mb-4 text-slate-800">{children}</h2>,
                  h3: ({children}) => <h3 className="text-xl font-medium mb-3 text-slate-800">{children}</h3>,
                  p: ({children}) => <p className="mb-4 text-slate-600 leading-relaxed">{children}</p>,
                  ul: ({children}) => <ul className="mb-4 space-y-2">{children}</ul>,
                  ol: ({children}) => <ol className="mb-4 space-y-2">{children}</ol>,
                  li: ({children}) => <li className="text-slate-600 ml-4">{children}</li>,
                  strong: ({children}) => <strong className="font-semibold text-slate-800">{children}</strong>,
                  em: ({children}) => <em className="italic text-slate-600">{children}</em>,
                  blockquote: ({children}) => <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-slate-600 my-6">{children}</blockquote>,
                  code: ({children}) => <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800">{children}</code>,
                  pre: ({children}) => <pre className="bg-slate-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">{children}</pre>,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Author Info */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-12">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-6">
                {post.author.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {post.author}
                </h3>
                <p className="text-slate-600">
                  Expert in Modern Foreign Language Education
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Tags */}
                  {relatedPost.tags && relatedPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {relatedPost.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
                        >
                          {tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {relatedPost.title}
                  </h3>
                  
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                    {relatedPost.excerpt}
                  </p>
                  
                  <div className="text-xs text-slate-500">
                    {formatDate(relatedPost.created_at)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Call to Action */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-xl font-bold mb-4">Ready to Put This Into Practice?</h3>
            <p className="text-indigo-100 mb-6">
              Start using LanguageGems to implement these strategies in your classroom today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/blog"
                className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                More Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
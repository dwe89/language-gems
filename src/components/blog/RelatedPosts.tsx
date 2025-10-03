'use client';

import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

interface RelatedPost {
  title: string;
  excerpt: string;
  slug: string;
  reading_time_minutes: number;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  currentSlug: string;
}

export default function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  // Filter out current post
  const relatedPosts = posts.filter(post => post.slug !== currentSlug).slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Related Articles</h2>
        <p className="text-slate-600">Continue learning with these related posts</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-blue-300"
          >
            <div className="flex items-start justify-between mb-3">
              <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-slate-500">{post.reading_time_minutes} min</span>
            </div>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            
            <p className="text-sm text-slate-600 mb-4 line-clamp-3">
              {post.excerpt}
            </p>
            
            <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
              Read more
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

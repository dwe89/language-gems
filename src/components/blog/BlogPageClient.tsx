'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight, BookOpen, Target, Brain, Languages, Gamepad2, Film, Users } from 'lucide-react';
import BlogCategoryFilter from './BlogCategoryFilter';

const categoryIcons: Record<string, any> = {
  'Exam Preparation': Target,
  'Study Tips': Brain,
  'Teaching Strategies': Users,
  'Learning Science': Brain,
  'Spanish Grammar': Languages,
  'French Grammar': Languages,
  'German Grammar': Languages,
  'Educational Technology': BookOpen,
  'Cultural Learning': Film,
  'speaking exam': Target,
  'default': BookOpen
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  tags: string[];
  publish_date: string;
  reading_time_minutes: number;
}

interface BlogPageClientProps {
  initialPosts: BlogPost[];
  categories: { name: string; count: number; color: string }[];
}

export default function BlogPageClient({ initialPosts, categories }: BlogPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(initialPosts);
    } else {
      setFilteredPosts(initialPosts.filter(post => post.tags?.includes(selectedCategory)));
    }
  }, [selectedCategory, initialPosts]);

  return (
    <>
      <BlogCategoryFilter
        categories={categories}
        totalPosts={initialPosts.length}
        onCategoryChange={setSelectedCategory}
      />

      {/* Blog Posts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {selectedCategory === 'All' 
                ? `All Articles (${filteredPosts.length})`
                : `${selectedCategory} (${filteredPosts.length})`
              }
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {selectedCategory === 'All' 
                ? 'In-depth guides and research-backed strategies for language learning success'
                : `Articles focused on ${selectedCategory.toLowerCase()}`
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPosts.map((post) => {
                const category = post.tags?.[0] || 'Blog';
                const IconComponent = categoryIcons[category] || categoryIcons['default'];
                const publishDate = new Date(post.publish_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                });
                
                return (
                  <article key={post.id} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {category}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600 transition-colors duration-200"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed mb-6">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-500 space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{publishDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.reading_time_minutes} min read</span>
                        </div>
                      </div>
                      
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
    </>
  );
}


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, Tag, ArrowRight, Search } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  tags: string[];
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
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

  const getAllTags = () => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Enhanced Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                <Tag className="h-4 w-4 mr-2" />
                Latest Insights
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
              LanguageGems 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Blog
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Discover cutting-edge strategies, expert insights, and proven techniques for 
              <span className="font-semibold"> modern language education</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <span className="text-white/90">📚 {posts.length} Articles Published</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <span className="text-white/90">🌟 Expert Education Content</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        {/* Enhanced Search and Filter Section */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Find Your Next Read</h2>
              <p className="text-slate-600">Search through our collection of educational insights</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Enhanced Search Bar */}
              <div className="relative flex-1 max-w-lg mx-auto lg:mx-0">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles, topics, strategies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg placeholder-slate-400 bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              {/* Enhanced Tag Filter */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all transform hover:scale-105 ${
                    !selectedTag
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  All Topics
                </button>
                {getAllTags().slice(0, 6).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all transform hover:scale-105 ${
                      selectedTag === tag
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {tag.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
              <div className="text-indigo-400 text-5xl">📝</div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">No articles found</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">Try adjusting your search terms or browse all topics to discover our latest content</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTag(null);
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Show All Articles
            </button>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8">
              <p className="text-slate-600 text-lg">
                Showing <span className="font-semibold text-indigo-600">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'article' : 'articles'}
                {selectedTag && (
                  <span> in <span className="font-semibold text-purple-600">{selectedTag.replace('-', ' ')}</span></span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <article
                  key={post.id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:border-indigo-200 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header with Gradient */}
                  <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                  
                  <div className="p-8">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag.replace('-', ' ')}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                            +{post.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                          {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-purple-500" />
                          {getReadingTime(post.excerpt || '')}
                        </div>
                      </div>
                      {post.author && (
                        <div className="bg-slate-50 px-3 py-1 rounded-full">
                          <span className="text-slate-700 font-medium">{post.author}</span>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Read More Link */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group/link inline-flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Enhanced Call to Action */}
        <div className="mt-24">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl translate-y-10 -translate-x-10"></div>
            
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Language Teaching?</h3>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Join thousands of educators using LanguageGems to create engaging, effective language learning experiences.
                <span className="block mt-2 font-semibold">Start your journey today.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  href="/dashboard"
                  className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all transform hover:scale-105 hover:shadow-xl"
                >
                  🚀 Start Teaching Now
                </Link>
                <Link
                  href="/shop"
                  className="border-2 border-white text-white px-10 py-4 rounded-2xl font-bold hover:bg-white hover:text-indigo-600 transition-all transform hover:scale-105"
                >
                  🛍️ Browse Resources
                </Link>
              </div>
              
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">10,000+</div>
                  <div className="text-white/80">Active Teachers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">50+</div>
                  <div className="text-white/80">Languages Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">1M+</div>
                  <div className="text-white/80">Students Engaged</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
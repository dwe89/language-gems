'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Eye, EyeOff, Calendar, Tag, User, ExternalLink } from 'lucide-react';
import { supabaseBrowser } from '../auth/AuthProvider';
import Link from 'next/link';

interface BlogAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  author: string | null;
  tags: string[] | null;
  is_published: boolean;
  status: string;
  publish_date: string;
  created_at: string;
  updated_at: string;
}

export default function BlogAdminModal({ isOpen, onClose, onRefresh }: BlogAdminModalProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    if (isOpen) {
      fetchPosts();
    }
  }, [isOpen]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabaseBrowser
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      setError(err.message || 'Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const { error: deleteError } = await supabaseBrowser
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchPosts();
      onRefresh();
    } catch (err: any) {
      console.error('Error deleting blog post:', err);
      alert(`Error deleting blog post: ${err.message}`);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error: updateError } = await supabaseBrowser
        .from('blog_posts')
        .update({ 
          is_published: !currentStatus,
          status: !currentStatus ? 'published' : 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchPosts();
      onRefresh();
    } catch (err: any) {
      console.error('Error updating blog post status:', err);
      alert(`Error updating blog post: ${err.message}`);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'published') return post.is_published;
    if (filterStatus === 'draft') return !post.is_published;
    return true;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Blog Posts Management</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage all blog posts from the database
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Link>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All ({posts.length})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'published'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Published ({posts.filter(p => p.is_published).length})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'draft'
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Drafts ({posts.filter(p => !p.is_published).length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12 text-red-600">
              <p>{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <p className="text-lg font-medium mb-2">No blog posts found</p>
              <p className="text-sm">Create your first blog post to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {post.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            post.is_published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      {post.excerpt && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author || 'LanguageGems Team'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.publish_date || post.created_at).toLocaleDateString()}</span>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>{post.tags.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/blog?edit=${post.id}`}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit post"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => togglePublished(post.id, post.is_published)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title={post.is_published ? 'Unpublish' : 'Publish'}
                      >
                        {post.is_published ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Total: {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


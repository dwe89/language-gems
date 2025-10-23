'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser, useAuth } from '../../../components/auth/AuthProvider';
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, Calendar, Tag, User, Send, Loader2, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author: string | null;
  tags: string[] | null;
  is_published: boolean;
  status?: string;
  email_sent?: boolean;
  email_sent_at?: string;
  created_at: string;
  updated_at: string;
}

interface EditBlogData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string;
  is_published: boolean;
}

export default function AdminBlogPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [previewingPost, setPreviewingPost] = useState<BlogPost | null>(null);
  const [publishingPostId, setPublishingPostId] = useState<string | null>(null);
  const [editData, setEditData] = useState<EditBlogData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    tags: '',
    is_published: true,
  });

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabaseBrowser
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingPost) return;

    try {
      const postData = {
        title: editData.title,
        slug: editData.slug,
        content: editData.content,
        excerpt: editData.excerpt || null,
        author: editData.author || 'LanguageGems Team',
        tags: editData.tags ? editData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : null,
        is_published: editData.is_published,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabaseBrowser
        .from('blog_posts')
        .update(postData)
        .eq('id', editingPost?.id);

      if (error) throw error;

      // Reset form and refresh
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Error saving blog post. Please try again.');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setEditData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      author: post.author || 'LanguageGems Team',
      tags: post.tags ? post.tags.join(', ') : '',
      is_published: post.is_published,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const { error } = await supabaseBrowser
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Error deleting blog post. Please try again.');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabaseBrowser
        .from('blog_posts')
        .update({
          is_published: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error updating blog post status:', error);
      alert('Error updating blog post status. Please try again.');
    }
  };

  const publishAndNotifyNow = async (post: BlogPost) => {
    if (!confirm(`Publish "${post.title}" immediately and send email notifications to all subscribers?`)) {
      return;
    }

    setPublishingPostId(post.id);

    try {
      const response = await fetch('/api/blog/publish-now', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: post.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to publish post');
      }

      // Show success message with email status
      const emailStatus = result.emailSent
        ? `✅ Published and ${result.emailDetails?.results?.[0]?.sentTo || 0} emails sent!`
        : '✅ Published! (Email notifications may have failed - check logs)';

      alert(`${emailStatus}\n\nPost: ${result.post.title}`);

      // Refresh the posts list
      fetchPosts();
    } catch (error: any) {
      console.error('Error publishing post:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setPublishingPostId(null);
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setEditData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      author: '',
      tags: '',
      is_published: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleTitleChange = (title: string) => {
    setEditData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Blog Posts Management</h1>
          <p className="text-slate-600 mt-2">Create, edit, and manage blog posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Blog Post
        </Link>
      </div>

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Edit Blog Post</h2>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter blog post title"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={editData.slug}
                  onChange={(e) => setEditData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="url-friendly-slug"
                />
              </div>

              {/* Author & Published Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={editData.author}
                    onChange={(e) => setEditData(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Author name"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-published"
                    checked={editData.is_published}
                    onChange={(e) => setEditData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="edit-published" className="text-sm font-medium text-slate-700">
                    Published
                  </label>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={editData.excerpt}
                  onChange={(e) => setEditData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief summary or excerpt"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={editData.tags}
                  onChange={(e) => setEditData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="tag1, tag2, tag3"
                />
                <p className="text-xs text-slate-500 mt-1">Separate tags with commas</p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Content *
                </label>
                <textarea
                  value={editData.content}
                  onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  placeholder="Write your blog post content here... (Markdown supported)"
                />
                <p className="text-xs text-slate-500 mt-1">Markdown formatting is supported</p>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Blog Post Preview</h2>
                <p className="text-sm text-slate-600 mt-1">How this post will appear when published</p>
              </div>
              <button
                onClick={() => setPreviewingPost(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-full">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                  <div className="container mx-auto px-6 py-12">
                    {/* Tags */}
                    {previewingPost.tags && previewingPost.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {previewingPost.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                          >
                            {tag.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                      {previewingPost.title}
                    </h1>
                    
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-white/80">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{previewingPost.author || 'LanguageGems Team'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(previewingPost.created_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        <span>2 min read • 308 words</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-6 py-12">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
                      {/* Excerpt */}
                      {previewingPost.excerpt && (
                        <div className="text-xl text-slate-600 leading-relaxed mb-8 pb-8 border-b border-slate-200">
                          {previewingPost.excerpt}
                        </div>
                      )}
                      
                      {/* Content */}
                      <div 
                        className="prose prose-lg prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: previewingPost.content
                            .replace(/<h2>/g, '<h2 class="text-2xl font-semibold mb-4 mt-8 text-slate-800">')
                            .replace(/<h3>/g, '<h3 class="text-xl font-semibold mb-3 mt-6 text-slate-800">')
                            .replace(/<h4>/g, '<h4 class="text-lg font-semibold mb-2 mt-4 text-slate-800">')
                            .replace(/<p>/g, '<p class="text-slate-600 leading-relaxed mb-4">')
                            .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 text-slate-600">')
                            .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 text-slate-600">')
                            .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-indigo-500 bg-indigo-50 pl-6 py-4 my-6 italic text-slate-700">')
                            .replace(/<a /g, '<a class="text-indigo-600 hover:text-indigo-800 underline" ')
                            .replace(/<code>/g, '<code class="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800">')
                            .replace(/<pre>/g, '<pre class="bg-slate-900 text-white p-4 rounded-lg overflow-x-auto my-6">')
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  Preview of how this post will appear on your blog
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      window.open(`/blog/${previewingPost.slug}`, '_blank');
                    }}
                    className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Live
                  </button>
                  <button
                    onClick={() => setPreviewingPost(null)}
                    className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Title</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Author</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Tags</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-600">Created</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-slate-500">
                      <div className="text-4xl mb-4">📝</div>
                      <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
                      <p className="text-sm">Create your first blog post to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-900 mb-1">
                          {post.title}
                        </div>
                        <div className="text-sm text-slate-500">
                          /{post.slug}
                        </div>
                        {post.excerpt && (
                          <div className="text-sm text-slate-600 mt-1 line-clamp-2">
                            {post.excerpt}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <User className="h-4 w-4 mr-1" />
                        {post.author || 'LanguageGems Team'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => togglePublished(post.id, post.is_published)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            post.is_published
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {post.is_published ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Draft
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {post.tags && post.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-xs text-slate-500">
                              +{post.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">No tags</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Publish & Notify Now Button - Only show for unpublished posts */}
                        {(!post.is_published || post.status !== 'published') && (
                          <button
                            onClick={() => publishAndNotifyNow(post)}
                            disabled={publishingPostId === post.id}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Publish & send email notifications now"
                          >
                            {publishingPostId === post.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        {/* Email sent indicator */}
                        {post.email_sent && (
                          <div className="p-2 text-emerald-600" title={`Email sent: ${post.email_sent_at ? new Date(post.email_sent_at).toLocaleString() : 'Yes'}`}>
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}

                        <button
                          onClick={() => setPreviewingPost(post)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Preview post"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit post"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {posts.length > 0 && (
        <div className="mt-6 text-center text-sm text-slate-500">
          Showing {posts.length} blog post{posts.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
} 
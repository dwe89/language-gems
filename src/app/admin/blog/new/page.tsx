'use client';

import { useState } from 'react';
import { supabaseBrowser, useAuth } from '../../../../components/auth/AuthProvider';
import { Save, ArrowLeft, Eye, FileText, User, Tag, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string;
  is_published: boolean;
}

export default function NewBlogPostPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: 'LanguageGems Team',
    tags: '',
    is_published: true,
  });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim('-'); // Remove leading/trailing hyphens
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields (Title, Slug, and Content).');
      return;
    }

    setLoading(true);

    try {
      // Prepare post data
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || null,
        author: formData.author.trim() || 'LanguageGems Team',
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : null,
        is_published: formData.is_published,
      };

      const { data, error } = await supabaseBrowser
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();

      if (error) throw error;

      // Redirect to blog posts list
      router.push('/admin/blog');
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      
      if (error.code === '23505' && error.message.includes('slug')) {
        alert('A blog post with this slug already exists. Please use a different slug.');
      } else {
        alert('Error creating blog post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting for preview
    return content
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^\s*(.+)$/gm, '<p class="mb-4">$1</p>')
      .replace(/<\/p><p class="mb-4"><li/g, '</p><ul><li')
      .replace(/li><\/p>/g, 'li></ul>');
  };

  if (authLoading) {
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/blog"
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Create New Blog Post</h1>
            <p className="text-slate-600 mt-1">Write and publish a new blog post</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
              showPreview
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Eye className="h-4 w-4" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-slate-800">Post Details</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your blog post title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="url-friendly-slug"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    This will be used in the URL: /blog/{formData.slug || 'your-slug'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Brief summary or excerpt that will appear in blog listings"
                  />
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Content</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500">Markdown supported</span>
                </div>
              </div>

              {showPreview ? (
                <div className="border border-slate-300 rounded-lg p-4 min-h-[400px] bg-slate-50">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Preview:</h3>
                  <div 
                    className="prose prose-slate max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: formData.content ? formatContent(formData.content) : '<p class="text-slate-400 italic">Start writing to see preview...</p>' 
                    }}
                  />
                </div>
              ) : (
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={16}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  placeholder="Write your blog post content here...

# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- Bullet points
- Another point

This supports basic Markdown formatting."
                  required
                />
              )}

              {!showPreview && (
                <div className="mt-2 text-xs text-slate-500">
                  <strong>Markdown Tips:</strong> Use # for headings, **bold**, *italic*, - for bullet points
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-slate-800">Publishing</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_published: e.target.checked }))}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="is_published" className="text-sm font-medium text-slate-700">
                    Publish immediately
                  </label>
                </div>
                <p className="text-xs text-slate-500">
                  {formData.is_published 
                    ? 'This post will be visible to all visitors'
                    : 'This post will be saved as a draft'
                  }
                </p>
              </div>
            </div>

            {/* Author */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-slate-800">Author</h2>
              </div>

              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Author name"
              />
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <Tag className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-slate-800">Tags</h2>
              </div>

              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="education, spanish, learning"
              />
              <p className="text-xs text-slate-500 mt-2">
                Separate tags with commas
              </p>
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-lg border p-6">
              <button
                type="submit"
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  loading || !formData.title.trim() || !formData.content.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {formData.is_published ? 'Publish Post' : 'Save Draft'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 
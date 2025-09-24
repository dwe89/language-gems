'use client';

import { useState } from 'react';
import { supabaseBrowser, useAuth } from '../../../../components/auth/AuthProvider';
import { Save, ArrowLeft, FileText, User, Tag, Calendar, Eye, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TiptapEditor from '../../../../components/editor/TiptapEditor';

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string;
  is_published: boolean;
  scheduled_for: string;
  seo_title: string;
  seo_description: string;
  featured_image_url: string;
  reading_time_minutes: number;
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
    is_published: false,
    scheduled_for: '',
    seo_title: '',
    seo_description: '',
    featured_image_url: '',
    reading_time_minutes: 5,
  });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.slug.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields (Title, Slug, and Content).');
      return;
    }

    // Validate scheduled date if provided
    if (formData.scheduled_for && new Date(formData.scheduled_for) <= new Date()) {
      alert('Scheduled date must be in the future.');
      return;
    }

    setLoading(true);

    try {
      // Prepare post data for the new scheduling API
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || null,
        author: formData.author.trim() || 'LanguageGems Team',
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        scheduled_for: formData.scheduled_for || null,
        seo_title: formData.seo_title.trim() || formData.title.trim(),
        seo_description: formData.seo_description.trim() || formData.excerpt.trim(),
        featured_image_url: formData.featured_image_url.trim() || null,
        reading_time_minutes: formData.reading_time_minutes,
      };

      const response = await fetch('/api/blog/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create blog post');
      }

      alert(result.message);
      router.push('/admin/blog');
    } catch (error: any) {
      console.error('Error creating blog post:', error);

      if (error.message.includes('slug already exists')) {
        alert('A blog post with this slug already exists. Please use a different slug.');
      } else {
        alert(`Error creating blog post: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
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
            <p className="text-slate-600 mt-1">Write and publish a new blog post with our WYSIWYG editor</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
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

            {/* WYSIWYG Content Editor */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Content *</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500">WYSIWYG Editor with Image Upload</span>
                </div>
              </div>

              <TiptapEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Start writing your blog post... You can drag and drop images directly into the editor!"
                className="border-slate-300"
              />
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Schedule for later (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduled_for}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduled_for: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.scheduled_for
                      ? `Will be published on ${new Date(formData.scheduled_for).toLocaleString()}`
                      : 'Leave empty to save as draft'
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Reading Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.reading_time_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, reading_time_minutes: parseInt(e.target.value) || 5 }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
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

            {/* SEO Settings */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center mb-4">
                <Eye className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-lg font-semibold text-slate-800">SEO</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={formData.seo_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_title: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Leave empty to use post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SEO Description
                  </label>
                  <textarea
                    value={formData.seo_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, seo_description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Leave empty to use excerpt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Editor Features Info */}
            <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-6">
              <h3 className="text-sm font-semibold text-indigo-800 mb-3">Editor Features</h3>
              <ul className="text-xs text-indigo-700 space-y-1">
                <li>• Drag & drop images</li>
                <li>• Rich text formatting</li>
                <li>• Headings & lists</li>
                <li>• Code blocks & quotes</li>
                <li>• Links & tables</li>
                <li>• Undo/redo support</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-lg border p-6 space-y-3">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                disabled={!formData.title.trim() || !formData.content.trim()}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  !formData.title.trim() || !formData.content.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-600 text-white hover:bg-slate-700'
                }`}
              >
                <Eye className="h-4 w-4" />
                Preview Post
              </button>
              
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

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Blog Post Preview</h2>
                <p className="text-sm text-slate-600 mt-1">How this post will appear when published</p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
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
                    {formData.tags && formData.tags.trim() && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {formData.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                          >
                            {tag.trim().replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                      {formData.title || 'Untitled Post'}
                    </h1>
                    
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-6 text-white/80">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{formData.author || 'LanguageGems Team'}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date().toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        <span>New post • {Math.ceil(formData.content.length / 200)} min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-6 py-12">
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
                      {/* Excerpt */}
                      {formData.excerpt && (
                        <div className="text-xl text-slate-600 leading-relaxed mb-8 pb-8 border-b border-slate-200">
                          {formData.excerpt}
                        </div>
                      )}
                      
                      {/* Content */}
                      <div 
                        className="prose prose-lg prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: formData.content
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
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
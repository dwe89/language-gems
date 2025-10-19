'use client';

import { useState } from 'react';
import { X, Save, Loader2, AlertCircle, CheckCircle, FileText, User, Tag, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '../editor/TiptapEditor';

interface BlogEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  slug: string;
  initialData: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    tags: string[];
    seo_title: string | null;
    seo_description: string | null;
    reading_time_minutes: number;
    featured_image_url?: string | null;
  };
}

export default function BlogEditModal({
  isOpen,
  onClose,
  postId,
  slug,
  initialData,
}: BlogEditModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData.title,
    slug: initialData.slug,
    content: initialData.content,
    excerpt: initialData.excerpt,
    author: initialData.author,
    tags: initialData.tags.join(', '),
    seo_title: initialData.seo_title || '',
    seo_description: initialData.seo_description || '',
    reading_time_minutes: initialData.reading_time_minutes,
    featured_image_url: initialData.featured_image_url || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      const postData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || null,
        author: formData.author.trim() || 'LanguageGems Team',
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        seo_title: formData.seo_title.trim() || formData.title.trim(),
        seo_description: formData.seo_description.trim() || formData.excerpt.trim(),
        reading_time_minutes: formData.reading_time_minutes,
        featured_image_url: formData.featured_image_url.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const response = await fetch('/api/blog/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          updates: postData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save changes');
      }

      setSaveStatus('success');
      
      // Close modal after 1.5 seconds and refresh the page
      setTimeout(() => {
        router.refresh();
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error saving blog post:', error);
      setSaveStatus('error');
      setErrorMessage(error.message || 'An error occurred while saving');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Blog Post</h2>
            <p className="text-sm text-gray-600 mt-1">
              {slug}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            disabled={isSaving}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2" />
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter blog post title"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 mr-2" />
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="blog-post-slug"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of the blog post"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Content
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <TiptapEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </div>

            {/* Author and Tags Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Study Tips, GCSE, Spanish"
                />
              </div>
            </div>

            {/* Reading Time */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Reading Time (minutes)
              </label>
              <input
                type="number"
                value={formData.reading_time_minutes}
                onChange={(e) => setFormData({ ...formData, reading_time_minutes: parseInt(e.target.value) || 5 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>

            {/* SEO Fields */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leave empty to use post title"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    SEO Description
                  </label>
                  <textarea
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Leave empty to use excerpt"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {/* Status Messages */}
          {saveStatus === 'success' && (
            <div className="mb-4 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span>Changes saved successfully!</span>
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !formData.title.trim() || !formData.content.trim()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


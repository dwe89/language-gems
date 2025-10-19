'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff, History, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { EditablePagesService, type EditablePage } from '@/services/editablePagesService';
import { useSupabase } from '@/components/supabase/SupabaseProvider';

interface PageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageSlug: string;
  onSave?: () => void;
}

export default function PageEditorModal({
  isOpen,
  onClose,
  pageSlug,
  onSave
}: PageEditorModalProps) {
  const { supabase } = useSupabase();
  const [page, setPage] = useState<EditablePage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'meta' | 'history'>('content');

  // Form state
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [pageDataJson, setPageDataJson] = useState('');
  const [metaDataJson, setMetaDataJson] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Create service instance with authenticated client
  const editablePagesService = new EditablePagesService(supabase);

  useEffect(() => {
    if (isOpen && pageSlug) {
      loadPage();
    }
  }, [isOpen, pageSlug]);

  const loadPage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const pageData = await editablePagesService.getPageBySlug(pageSlug);

      if (!pageData) {
        setError('Page not found');
        setIsLoading(false);
        return;
      }

      setPage(pageData);
      setPageTitle(pageData.page_title);
      setPageDescription(pageData.page_description || '');
      setPageDataJson(JSON.stringify(pageData.page_data, null, 2));
      setMetaDataJson(JSON.stringify(pageData.meta_data || {}, null, 2));
      setIsPublished(pageData.is_published);
    } catch (err) {
      console.error('Error loading page:', err);
      setError('Failed to load page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate JSON
      let parsedPageData;
      let parsedMetaData;

      try {
        parsedPageData = JSON.parse(pageDataJson);
      } catch (e) {
        throw new Error('Invalid JSON in page data');
      }

      try {
        parsedMetaData = JSON.parse(metaDataJson);
      } catch (e) {
        throw new Error('Invalid JSON in meta data');
      }

      console.log('🔍 Updating page:', pageSlug, {
        page_title: pageTitle,
        page_description: pageDescription,
        page_data: parsedPageData,
        meta_data: parsedMetaData,
        is_published: isPublished,
      });

      // Update page
      const success = await editablePagesService.updatePage(pageSlug, {
        page_title: pageTitle,
        page_description: pageDescription,
        page_data: parsedPageData,
        meta_data: parsedMetaData,
        is_published: isPublished,
      });

      console.log('✅ Update result:', success);

      if (!success) {
        throw new Error('Failed to update page');
      }

      setSuccess(true);
      
      // Reload page data
      await loadPage();

      // Call onSave callback
      if (onSave) {
        onSave();
      }

      // Auto-close after 2 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error('Error saving page:', err);
      setError(err.message || 'Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(pageDataJson);
      setPageDataJson(JSON.stringify(parsed, null, 2));
    } catch (e) {
      setError('Invalid JSON - cannot format');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Edit Page: {pageSlug}
              </h2>
              {page && (
                <p className="text-sm text-gray-500 mt-1">
                  Version {page.version} • Last updated: {new Date(page.updated_at).toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'content'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab('meta')}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'meta'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              SEO & Meta
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <History className="w-4 h-4 inline mr-2" />
              Version History
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : error && !page ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Content Tab */}
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    {/* Page Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Title
                      </label>
                      <input
                        type="text"
                        value={pageTitle}
                        onChange={(e) => setPageTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Page Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Description
                      </label>
                      <textarea
                        value={pageDescription}
                        onChange={(e) => setPageDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Page Data JSON */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Page Content (JSON)
                        </label>
                        <button
                          onClick={formatJson}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Format JSON
                        </button>
                      </div>
                      <textarea
                        value={pageDataJson}
                        onChange={(e) => setPageDataJson(e.target.value)}
                        rows={20}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        spellCheck={false}
                      />
                    </div>

                    {/* Published Status */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is-published"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="is-published" className="ml-2 text-sm font-medium text-gray-700">
                        Published (visible to public)
                      </label>
                    </div>
                  </div>
                )}

                {/* Meta Tab */}
                {activeTab === 'meta' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO & Meta Data (JSON)
                      </label>
                      <p className="text-sm text-gray-500 mb-2">
                        Include: title, description, keywords, og:image, etc.
                      </p>
                      <textarea
                        value={metaDataJson}
                        onChange={(e) => setMetaDataJson(e.target.value)}
                        rows={15}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <div>
                    <p className="text-gray-500 text-center py-8">
                      Version history coming soon...
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div>
              {error && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Page saved successfully!
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


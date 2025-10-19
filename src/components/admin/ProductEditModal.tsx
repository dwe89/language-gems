'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Trash2, AlertCircle, CheckCircle, Loader, Image as ImageIcon } from 'lucide-react';
import { useSupabase } from '@/components/supabase/SupabaseProvider';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  stripe_price_id: string | null;
  tags: string[];
  file_path: string | null;
  thumbnail_url: string | null;
  preview_images: string[] | null;
  sample_content: string | null;
  learning_objectives: string[] | null;
  target_audience: string | null;
  difficulty_level: string | null;
  page_count: number | null;
  file_size: string | null;
  table_of_contents: string[] | null;
  is_active: boolean;
  category_id: string | null;
  display_order: number;
}

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  onSave?: () => void;
}

export default function ProductEditModal({
  isOpen,
  onClose,
  productId,
  onSave
}: ProductEditModalProps) {
  const { supabase } = useSupabase();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'media'>('basic');
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingPreview, setUploadingPreview] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [priceCents, setPriceCents] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [fileSize, setFileSize] = useState('');
  const [sampleContent, setSampleContent] = useState('');
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [learningObjectivesInput, setLearningObjectivesInput] = useState('');
  const [tableOfContents, setTableOfContents] = useState<string[]>([]);
  const [tableOfContentsInput, setTableOfContentsInput] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewImageInput, setPreviewImageInput] = useState('');

  useEffect(() => {
    if (isOpen && productId) {
      loadProduct();
    }
  }, [isOpen, productId]);

  const loadProduct = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;

      setProduct(data);
      setName(data.name);
      setSlug(data.slug);
      setDescription(data.description || '');
      setPriceCents(data.price_cents || 0);
      setTags(data.tags || []);
      setTagsInput((data.tags || []).join(', '));
      setTargetAudience(data.target_audience || '');
      setDifficultyLevel(data.difficulty_level || '');
      setPageCount(data.page_count);
      setFileSize(data.file_size || '');
      setSampleContent(data.sample_content || '');
      setLearningObjectives(data.learning_objectives || []);
      setLearningObjectivesInput((data.learning_objectives || []).join('\n'));
      setTableOfContents(data.table_of_contents || []);
      setTableOfContentsInput((data.table_of_contents || []).join('\n'));
      setThumbnailUrl(data.thumbnail_url || '');
      setPreviewImages(data.preview_images || []);
      setPreviewImageInput((data.preview_images || []).join('\n'));
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (file: File, folder: 'thumbnails' | 'previews'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `products/${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    setError(null);

    try {
      const url = await uploadImage(file, 'thumbnails');
      setThumbnailUrl(url);
    } catch (err) {
      console.error('Error uploading thumbnail:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload thumbnail');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handlePreviewUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingPreview(true);
    setError(null);

    try {
      const uploadPromises = files.map(file => uploadImage(file, 'previews'));
      const urls = await Promise.all(uploadPromises);

      const currentUrls = previewImageInput.split('\n').filter(Boolean);
      const newUrls = [...currentUrls, ...urls];
      setPreviewImageInput(newUrls.join('\n'));
    } catch (err) {
      console.error('Error uploading preview images:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload preview images');
    } finally {
      setUploadingPreview(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Parse arrays from text inputs
      const parsedTags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const parsedObjectives = learningObjectivesInput.split('\n').map(t => t.trim()).filter(Boolean);
      const parsedTOC = tableOfContentsInput.split('\n').map(t => t.trim()).filter(Boolean);
      const parsedPreviewImages = previewImageInput.split('\n').map(t => t.trim()).filter(Boolean);

      const updates = {
        name,
        slug,
        description,
        price_cents: priceCents,
        tags: parsedTags,
        target_audience: targetAudience || null,
        difficulty_level: difficultyLevel || null,
        page_count: pageCount,
        file_size: fileSize || null,
        sample_content: sampleContent || null,
        learning_objectives: parsedObjectives.length > 0 ? parsedObjectives : null,
        table_of_contents: parsedTOC.length > 0 ? parsedTOC : null,
        thumbnail_url: thumbnailUrl || null,
        preview_images: parsedPreviewImages.length > 0 ? parsedPreviewImages : null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        if (onSave) onSave();
      }, 1000);
    } catch (err) {
      console.error('Error saving product:', err);
      setError('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'basic'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'content'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Content Details
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'media'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Media & Images
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Spanish GCSE Vocabulary Pack"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., spanish-gcse-vocab-pack"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe the product..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Price (£)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={(priceCents / 100).toFixed(2)}
                        onChange={(e) => setPriceCents(Math.round(parseFloat(e.target.value) * 100))}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Difficulty Level
                      </label>
                      <select
                        value={difficultyLevel}
                        onChange={(e) => setDifficultyLevel(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select...</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Spanish, GCSE, Vocabulary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., GCSE Students, KS3 Learners"
                    />
                  </div>
                </div>
              )}

              {/* Content Details Tab */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Page Count
                      </label>
                      <input
                        type="number"
                        value={pageCount || ''}
                        onChange={(e) => setPageCount(e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., 25"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        File Size
                      </label>
                      <input
                        type="text"
                        value={fileSize}
                        onChange={(e) => setFileSize(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., 2.5 MB"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Learning Objectives (one per line)
                    </label>
                    <textarea
                      value={learningObjectivesInput}
                      onChange={(e) => setLearningObjectivesInput(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                      placeholder="Master present tense conjugations&#10;Learn 100+ essential vocabulary words&#10;Practice conversation skills"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Table of Contents (one per line)
                    </label>
                    <textarea
                      value={tableOfContentsInput}
                      onChange={(e) => setTableOfContentsInput(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                      placeholder="Introduction&#10;Chapter 1: Greetings&#10;Chapter 2: Numbers&#10;Chapter 3: Colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Sample Content (Markdown supported)
                    </label>
                    <textarea
                      value={sampleContent}
                      onChange={(e) => setSampleContent(e.target.value)}
                      rows={8}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                      placeholder="Preview of the content..."
                    />
                  </div>
                </div>
              )}

              {/* Media & Images Tab */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* Thumbnail Section */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Thumbnail Image
                    </label>

                    {/* Upload Button */}
                    <div className="mb-3">
                      <label className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingThumbnail ? 'Uploading...' : 'Upload Thumbnail'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          disabled={uploadingThumbnail}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-slate-500 mt-1">Or paste URL below</p>
                    </div>

                    {/* URL Input */}
                    <input
                      type="text"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://..."
                    />

                    {/* Preview */}
                    {thumbnailUrl && (
                      <div className="mt-3">
                        <img
                          src={thumbnailUrl}
                          alt="Thumbnail preview"
                          className="w-48 h-48 object-cover rounded-lg border border-slate-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Preview Images Section */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Preview Images
                    </label>

                    {/* Upload Button */}
                    <div className="mb-3">
                      <label className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingPreview ? 'Uploading...' : 'Upload Images'}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePreviewUpload}
                          disabled={uploadingPreview}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-slate-500 mt-1">Select multiple images or paste URLs below</p>
                    </div>

                    {/* URL Textarea */}
                    <textarea
                      value={previewImageInput}
                      onChange={(e) => setPreviewImageInput(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                      placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                    />

                    {/* Preview Grid */}
                    {previewImageInput && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {previewImageInput.split('\n').filter(Boolean).map((url, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={url.trim()}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-slate-300"
                            />
                            <button
                              onClick={() => {
                                const urls = previewImageInput.split('\n').filter(Boolean);
                                urls.splice(idx, 1);
                                setPreviewImageInput(urls.join('\n'));
                              }}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Info Box */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-800 font-medium text-sm">Direct Upload Enabled</p>
                        <p className="text-green-600 text-sm mt-1">
                          Images are automatically uploaded to Supabase Storage. You can also paste URLs directly if you prefer.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <div>
            {success && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Saved successfully!</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


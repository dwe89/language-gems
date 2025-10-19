'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, Upload, Loader, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import AdminModal from '../ui/AdminModal';

interface ProductAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  file_path: string | null;
  thumbnail_url: string | null;
  tags: string[] | null;
  is_active: boolean;
  language: string | null;
  key_stage: string | null;
  category_type: string | null;
  topic_slug: string | null;
  theme_number: number | null;
  topic_number: number | null;
  created_at: string;
}

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  language: string;
  key_stage: string;
  resource_type: string;
  exam_board: string;
  category: string;
  subcategory: string;
  theme: string;
  topic: string;
  tags: string;
  is_active: boolean;
  file: File | null;
  thumbnail: File | null;
  create_stripe_product: boolean;
}

const LANGUAGES = [
  { value: '', label: 'All Languages' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' }
];

const KEY_STAGES = [
  { value: 'ks3', label: 'KS3 (Years 7-9)' },
  { value: 'ks4', label: 'KS4 (GCSE)' },
  { value: 'ks5', label: 'KS5 (A-Level)' }
];

const RESOURCE_TYPES = [
  { value: 'exam-practice', label: 'Exam Practice Materials' },
  { value: 'assessment-tools', label: 'Assessment Tools' },
  { value: 'booklets-guides', label: 'Booklets & Guides' },
  { value: 'worksheets', label: 'Worksheets' },
  { value: 'knowledge-organisers', label: 'Knowledge Organisers' },
  { value: 'lesson-resources', label: 'Lesson Resources' },
  { value: 'audio-video', label: 'Audio/Video Resources' },
  { value: 'interactive', label: 'Interactive Resources' }
];

const EXAM_BOARDS = [
  { value: 'aqa', label: 'AQA' },
  { value: 'edexcel', label: 'Edexcel' }
];

export default function ProductAdminModal({ isOpen, onClose, onRefresh }: ProductAdminModalProps) {
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'edit'>('list');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    price_cents: 0,
    language: '',
    key_stage: '',
    resource_type: '',
    exam_board: '',
    category: '',
    subcategory: '',
    theme: '',
    topic: '',
    tags: '',
    is_active: true,
    file: null,
    thumbnail: null,
    create_stripe_product: true
  });

  useEffect(() => {
    if (isOpen && viewMode === 'list') {
      loadProducts();
    }
  }, [isOpen, viewMode]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabaseBrowser
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedProduct(null);
    setError(null);
    setSuccess(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      price_cents: 0,
      language: '',
      key_stage: '',
      resource_type: '',
      exam_board: '',
      category: '',
      subcategory: '',
      theme: '',
      topic: '',
      tags: '',
      is_active: true,
      file: null,
      thumbnail: null,
      create_stripe_product: true
    });
    setViewMode('create');
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setError(null);
    setSuccess(null);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price_cents: product.price_cents,
      language: product.language || '',
      key_stage: product.key_stage || '',
      resource_type: product.category_type || '',
      exam_board: '',
      category: '',
      subcategory: '',
      theme: '',
      topic: '',
      tags: product.tags?.join(', ') || '',
      is_active: product.is_active,
      file: null,
      thumbnail: null
    });
    setViewMode('edit');
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabaseBrowser
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setSuccess('Product deleted successfully');
      setLoading(false);

      // Reload products after a small delay
      setTimeout(() => {
        loadProducts();
        setSuccess(null);
      }, 1500);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product');
      setLoading(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  const toggleActive = async (product: Product) => {
    setLoading(true);
    try {
      const { error } = await supabaseBrowser
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;

      setSuccess(`Product ${!product.is_active ? 'activated' : 'deactivated'} successfully`);
      setLoading(false);

      // Reload products after a small delay
      setTimeout(() => {
        loadProducts();
        setSuccess(null);
      }, 1500);
    } catch (err) {
      console.error('Error toggling product status:', err);
      setError('Failed to update product status');
      setLoading(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabaseBrowser.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabaseBrowser.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const createStripeProduct = async (name: string, description: string, price_cents: number): Promise<string | null> => {
    try {
      const response = await fetch('/api/stripe/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: price_cents,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Stripe product');
      }

      const result = await response.json();
      return result.priceId;
    } catch (error) {
      console.error('Stripe product creation failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Validate required fields
      if (!formData.name || !formData.slug) {
        throw new Error('Name and slug are required');
      }

      setUploadProgress(10);

      // Upload files if provided
      let filePath = selectedProduct?.file_path || null;
      let thumbnailUrl = selectedProduct?.thumbnail_url || null;

      if (formData.file) {
        setUploadProgress(30);
        filePath = await uploadFile(formData.file, 'files');
        setUploadProgress(50);
      }

      if (formData.thumbnail) {
        setUploadProgress(60);
        thumbnailUrl = await uploadFile(formData.thumbnail, 'thumbnails');
        setUploadProgress(70);
      }

      // Parse tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      setUploadProgress(75);

      // Create Stripe product if requested and price > 0
      let stripePriceId = selectedProduct?.stripe_price_id || null;
      if (formData.create_stripe_product && formData.price_cents > 0) {
        stripePriceId = await createStripeProduct(
          formData.name,
          formData.description,
          formData.price_cents
        );
      }

      // Prepare product data
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price_cents: formData.price_cents,
        file_path: filePath,
        thumbnail_url: thumbnailUrl,
        stripe_price_id: stripePriceId,
        tags,
        is_active: formData.is_active,
        language: formData.language || null,
        key_stage: formData.key_stage || null,
        category_type: formData.resource_type || null,
        updated_at: new Date().toISOString()
      };

      setUploadProgress(85);

      if (viewMode === 'create') {
        const { error } = await supabaseBrowser
          .from('products')
          .insert({ ...productData, created_at: new Date().toISOString() });

        if (error) throw error;
        setSuccess('Product created successfully!');
      } else if (viewMode === 'edit' && selectedProduct) {
        const { error } = await supabaseBrowser
          .from('products')
          .update(productData)
          .eq('id', selectedProduct.id);

        if (error) throw error;
        setSuccess('Product updated successfully!');
      }

      setUploadProgress(100);

      // Close modal immediately to prevent DOM conflicts
      onClose();

      // Refresh parent after modal is closed
      setTimeout(() => {
        onRefresh();
      }, 300);

    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Failed to save product');
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const formatPrice = (priceCents: number) => {
    return `£${(priceCents / 100).toFixed(2)}`;
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={viewMode === 'list' ? 'Manage Products' : viewMode === 'create' ? 'Create New Product' : 'Edit Product'}
      size="5xl"
    >
      <div className="p-6">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Uploading...</span>
              <span className="text-sm text-slate-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-600">
                {products.length} product{products.length !== 1 ? 's' : ''} total
              </p>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create New Product
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-4">No products found</p>
                <button
                  onClick={handleCreateNew}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Create your first product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Language</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Level</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                            <p className="text-sm text-slate-500">{product.slug}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {formatPrice(product.price_cents)}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-slate-600 capitalize">
                            {product.language || '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-slate-600 uppercase">
                            {product.key_stage || '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-slate-600">
                            {product.category_type ? product.category_type.replace('-', ' ') : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleActive(product)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                              product.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {product.is_active ? (
                              <>
                                <Eye className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Form */}
        {(viewMode === 'create' || viewMode === 'edit') && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setSuccess(null);
                setViewMode('list');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to list
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Basic Information</h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      // Auto-generate slug
                      if (viewMode === 'create') {
                        const slug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-|-$/g, '');
                        setFormData(prev => ({ ...prev, slug }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-1">URL-friendly identifier</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={(formData.price_cents / 100).toFixed(2)}
                    onChange={(e) => setFormData({ ...formData, price_cents: Math.round(parseFloat(e.target.value) * 100) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Set to 0 for free resources</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="grammar, verbs, present-tense"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Comma-separated tags</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                    Active (visible to users)
                  </label>
                </div>
              </div>

              {/* Categorization */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Categorization</h3>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select language</option>
                    {LANGUAGES.map(lang => (
                      <option key={lang.value} value={lang.value}>{lang.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Key Stage / Level
                  </label>
                  <select
                    value={formData.key_stage}
                    onChange={(e) => setFormData({ ...formData, key_stage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select level</option>
                    {KEY_STAGES.map(ks => (
                      <option key={ks.value} value={ks.value}>{ks.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={formData.resource_type}
                    onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select type</option>
                    {RESOURCE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                {formData.key_stage === 'ks4' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Exam Board (KS4 only)
                    </label>
                    <select
                      value={formData.exam_board}
                      onChange={(e) => setFormData({ ...formData, exam_board: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select exam board</option>
                      {EXAM_BOARDS.map(board => (
                        <option key={board.value} value={board.value}>{board.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800">Files</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product File (PDF, etc.)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp3,.mp4"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">
                        {formData.file ? formData.file.name : 'Click to upload file'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PDF, DOC, PPT, MP3, MP4
                      </p>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Thumbnail Image
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.files?.[0] || null })}
                      className="hidden"
                      id="thumbnail-upload"
                      accept="image/*"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">
                        {formData.thumbnail ? formData.thumbnail.name : 'Click to upload image'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        JPG, PNG, WebP
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Stripe Integration */}
            {viewMode === 'create' && formData.price_cents > 0 && (
              <div className="flex items-center space-x-2 border-t pt-6">
                <input
                  type="checkbox"
                  id="create-stripe"
                  checked={formData.create_stripe_product}
                  onChange={(e) => setFormData({ ...formData, create_stripe_product: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  disabled={loading}
                />
                <label htmlFor="create-stripe" className="text-sm font-medium text-slate-700">
                  Create product in Stripe for payments (£{(formData.price_cents / 100).toFixed(2)})
                </label>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t pt-6">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  setViewMode('list');
                }}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {viewMode === 'create' ? 'Create Product' : 'Update Product'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminModal>
  );
}


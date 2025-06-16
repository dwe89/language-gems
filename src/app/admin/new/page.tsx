'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Upload, Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price_cents: number; // in pence - matching database schema
  file: File | null;
  createStripeProduct: boolean;
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    slug: '',
    description: '',
    price_cents: 0,
    file: null,
    createStripeProduct: false,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - support PDF and DOC files
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(['Please select a PDF, DOC, or DOCX file.']);
        return;
      }
      
      // Validate file size (50MB max to match bucket limit)
      if (file.size > 50 * 1024 * 1024) {
        setErrors(['File size must be less than 50MB.']);
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
      setErrors([]);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const createStripeProduct = async (productData: any) => {
    try {
      const response = await fetch('/api/stripe/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          price: productData.price_cents,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Stripe product');
      }

      const result = await response.json();
      return {
        stripe_product_id: result.productId,
        stripe_price_id: result.priceId,
      };
    } catch (error) {
      console.error('Stripe product creation failed:', error);
      return {
        stripe_product_id: null,
        stripe_price_id: null,
      };
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push('Product name is required.');
    }

    if (!formData.slug.trim()) {
      newErrors.push('Slug is required.');
    }

    if (formData.price_cents <= 0) {
      newErrors.push('Price must be greater than 0.');
    }

    if (!formData.file) {
      newErrors.push('Document file (PDF, DOC, or DOCX) is required.');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);
    setErrors([]);

    try {
      // Upload file
      setUploadProgress(25);
      const fileUrl = await uploadFile(formData.file!);
      
      setUploadProgress(50);

      // Prepare product data
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price_cents: formData.price_cents,
        file_url: fileUrl,
        is_active: true,
      };

      setUploadProgress(75);

      // Create Stripe product if requested
      let stripeData = {};
      if (formData.createStripeProduct) {
        stripeData = await createStripeProduct(productData);
      }

      // Insert into Supabase
      const { error } = await supabase
        .from('products')
        .insert({
          ...productData,
          ...stripeData,
        });

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      setUploadProgress(100);
      setSuccess(true);

      // Reset form after success
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);

    } catch (error: any) {
      console.error('Error creating product:', error);
      setErrors([error.message || 'An unexpected error occurred.']);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const formatPrice = (pricePence: number) => {
    return `£${(pricePence / 100).toFixed(2)}`;
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-slate-600 hover:text-slate-800 p-2 -ml-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Add New Product</h1>
            <p className="text-slate-600 mt-2">Upload a new educational document (PDF, DOC, or DOCX) and add product information</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Product created successfully!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">Redirecting to products list...</p>
          </div>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-red-800 font-medium">Please fix the following errors:</h3>
                <ul className="text-red-700 text-sm mt-1 list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {loading && uploadProgress > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-800 font-medium">Creating product...</span>
              <span className="text-blue-600 text-sm">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., French Grammar Essentials"
                required
                disabled={loading}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="french-grammar-essentials"
                required
                disabled={loading}
              />
              <p className="text-sm text-slate-500 mt-1">
                This will be the URL: /product/{formData.slug}
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe what this product teaches and who it's for..."
                disabled={loading}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price (in pence) *
              </label>
              <input
                type="number"
                value={formData.price_cents}
                onChange={(e) => setFormData(prev => ({ ...prev, price_cents: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="999"
                min="1"
                required
                disabled={loading}
              />
              <p className="text-sm text-slate-500 mt-1">
                Display price: {formatPrice(formData.price_cents)}
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Document File *
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={loading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <div className="text-sm text-slate-600">
                    {formData.file ? (
                      <div>
                        <p className="font-medium text-slate-800">{formData.file.name}</p>
                        <p className="text-slate-500">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Click to upload document</p>
                        <p className="text-slate-500">PDF, DOC, or DOCX files</p>
                        <p className="text-xs text-slate-400 mt-1">Max file size: 50MB</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Stripe Integration */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="create-stripe"
                checked={formData.createStripeProduct}
                onChange={(e) => setFormData(prev => ({ ...prev, createStripeProduct: e.target.checked }))}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                disabled={loading}
              />
              <label htmlFor="create-stripe" className="text-sm font-medium text-slate-700">
                Create product in Stripe for payments
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
                disabled={loading || !formData.file}
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Creating...' : 'Create Product'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 
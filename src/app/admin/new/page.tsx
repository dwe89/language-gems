'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, supabaseBrowser } from '../../../components/auth/AuthProvider';
import { Upload, Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price_cents: number; // in pence - matching database schema
  file: File | null;
  thumbnail: File | null;
  tags: string[];
  createStripeProduct: boolean;
  // Enhanced fields
  target_audience: string;
  difficulty_level: string;
  page_count: number;
  file_size: string;
  learning_objectives: string[];
  table_of_contents: string[];
  sample_content: string;
  preview_images: File[];
  // Curriculum categorization
  language: string;
  key_stage: string;
  category_type: string;
  topic_slug: string;
  theme_number: number | null;
  topic_number: number | null;
}

export default function AdminNewProductPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    slug: '',
    description: '',
    price_cents: 0,
    file: null,
    thumbnail: null,
    tags: [],
    createStripeProduct: false,
    // Enhanced fields
    target_audience: '',
    difficulty_level: '',
    page_count: 0,
    file_size: '',
    learning_objectives: [],
    table_of_contents: [],
    sample_content: '',
    preview_images: [],
    // Curriculum categorization
    language: '',
    key_stage: '',
    category_type: 'topic',
    topic_slug: '',
    theme_number: null,
    topic_number: null,
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
      // Validate file type - support PDF, DOC, and PowerPoint files
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(['Please select a PDF, DOC, DOCX, PPT, or PPTX file.']);
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

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - support common image formats
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(['Please select a JPG, PNG, GIF, or WebP image file.']);
        return;
      }
      
      // Validate file size (5MB max for images)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(['Thumbnail image size must be less than 5MB.']);
        return;
      }
      
      setFormData(prev => ({ ...prev, thumbnail: file }));
      setErrors([]);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...prev.tags, trimmedTag] 
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  // Helper functions for enhanced fields
  const addLearningObjective = (objective: string) => {
    const trimmed = objective.trim();
    if (trimmed && !formData.learning_objectives.includes(trimmed)) {
      setFormData(prev => ({ 
        ...prev, 
        learning_objectives: [...prev.learning_objectives, trimmed] 
      }));
    }
  };

  const removeLearningObjective = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      learning_objectives: prev.learning_objectives.filter((_, i) => i !== index) 
    }));
  };

  const addTableOfContentsItem = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !formData.table_of_contents.includes(trimmed)) {
      setFormData(prev => ({ 
        ...prev, 
        table_of_contents: [...prev.table_of_contents, trimmed] 
      }));
    }
  };

  const removeTableOfContentsItem = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      table_of_contents: prev.table_of_contents.filter((_, i) => i !== index) 
    }));
  };

  const handlePreviewImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Validate each file
      const validFiles: File[] = [];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      for (const file of files) {
        if (!allowedTypes.includes(file.type)) {
          setErrors(['Preview images must be JPG, PNG, GIF, or WebP files.']);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setErrors(['Preview images must be less than 5MB each.']);
          return;
        }
        validFiles.push(file);
      }
      
      // Limit to 10 images maximum
      if (validFiles.length > 10) {
        setErrors(['Maximum 10 preview images allowed.']);
        return;
      }
      
      setFormData(prev => ({ ...prev, preview_images: validFiles }));
      setErrors([]);
    }
  };

  const uploadFile = async (file: File, folder: string = 'documents'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `products/${folder}/${fileName}`;

    const { error: uploadError } = await supabaseBrowser.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const { data } = supabaseBrowser.storage
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
        stripe_price_id: result.priceId,
      };
    } catch (error) {
      console.error('Stripe product creation failed:', error);
      return {
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

    if (formData.price_cents < 0) {
      newErrors.push('Price must be 0 or greater.');
    }

    if (!formData.file) {
      newErrors.push('Document file (PDF, DOC, DOCX, PPT, or PPTX) is required.');
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
      // Upload document file
      setUploadProgress(15);
      const fileUrl = await uploadFile(formData.file!, 'documents');
      
      setUploadProgress(30);

      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (formData.thumbnail) {
        thumbnailUrl = await uploadFile(formData.thumbnail, 'thumbnails');
        setUploadProgress(45);
      }

      // Upload preview images if provided
      const previewImageUrls: string[] = [];
      if (formData.preview_images.length > 0) {
        for (const [index, image] of formData.preview_images.entries()) {
          const imageUrl = await uploadFile(image, 'previews');
          previewImageUrls.push(imageUrl);
          setUploadProgress(45 + (index + 1) * (10 / formData.preview_images.length));
        }
      }

      // Prepare product data
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price_cents: formData.price_cents,
        file_path: fileUrl,
        thumbnail_url: thumbnailUrl,
        tags: formData.tags,
        is_active: true,
        // Enhanced fields
        target_audience: formData.target_audience || null,
        difficulty_level: formData.difficulty_level || null,
        page_count: formData.page_count || null,
        file_size: formData.file_size || null,
        learning_objectives: formData.learning_objectives.length > 0 ? formData.learning_objectives : null,
        table_of_contents: formData.table_of_contents.length > 0 ? formData.table_of_contents : null,
        sample_content: formData.sample_content || null,
        preview_images: previewImageUrls.length > 0 ? previewImageUrls : null,
        // Curriculum categorization
        language: formData.language,
        key_stage: formData.key_stage,
        category_type: formData.category_type,
        topic_slug: formData.topic_slug,
        theme_number: formData.theme_number,
        topic_number: formData.topic_number,
      };

      setUploadProgress(60);

      // Create Stripe product if requested
      let stripeData = {};
      if (formData.createStripeProduct) {
        stripeData = await createStripeProduct(productData);
      }

      // Insert into Supabase
      const { error } = await supabaseBrowser
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

  // Get topic options based on selected key stage
  const getTopicOptions = () => {
    if (!formData.key_stage) return [];

    const topicMappings = {
      ks3: [
        { value: 'basics-core-language', label: 'Basics & Core Language', theme_number: null, topic_number: null },
        { value: 'identity-personal-life', label: 'Identity & Personal Life', theme_number: null, topic_number: null },
        { value: 'home-local-area', label: 'Home & Local Area', theme_number: null, topic_number: null },
        { value: 'school-education', label: 'School & Education', theme_number: null, topic_number: null },
        { value: 'free-time-leisure', label: 'Free Time & Leisure', theme_number: null, topic_number: null },
        { value: 'food-drink', label: 'Food & Drink', theme_number: null, topic_number: null },
        { value: 'clothes-shopping', label: 'Clothes & Shopping', theme_number: null, topic_number: null },
        { value: 'technology-communication', label: 'Technology & Communication', theme_number: null, topic_number: null },
        { value: 'health-lifestyle', label: 'Health & Lifestyle', theme_number: null, topic_number: null },
        { value: 'holidays-travel', label: 'Holidays & Travel', theme_number: null, topic_number: null },
        { value: 'jobs-future-plans', label: 'Jobs & Future Plans', theme_number: null, topic_number: null },
        { value: 'nature-environment', label: 'Nature & Environment', theme_number: null, topic_number: null },
        { value: 'culture-festivals', label: 'Culture & Festivals', theme_number: null, topic_number: null },
      ],
      ks4: [
        // Theme 1: People and lifestyle
        { value: 'identity-and-relationships-with-others', label: 'Theme 1: Identity and relationships with others', theme_number: 1, topic_number: 1 },
        { value: 'healthy-living-and-lifestyle', label: 'Theme 1: Healthy living and lifestyle', theme_number: 1, topic_number: 2 },
        { value: 'education-and-work', label: 'Theme 1: Education and work', theme_number: 1, topic_number: 3 },
        // Theme 2: Popular culture
        { value: 'free-time-activities', label: 'Theme 2: Free-time activities', theme_number: 2, topic_number: 1 },
        { value: 'customs-festivals-and-celebrations', label: 'Theme 2: Customs, festivals and celebrations', theme_number: 2, topic_number: 2 },
        { value: 'celebrity-culture', label: 'Theme 2: Celebrity culture', theme_number: 2, topic_number: 3 },
        // Theme 3: Communication and the world around us
        { value: 'travel-and-tourism-including-places-of-interest', label: 'Theme 3: Travel and tourism, including places of interest', theme_number: 3, topic_number: 1 },
        { value: 'media-and-technology', label: 'Theme 3: Media and technology', theme_number: 3, topic_number: 2 },
        { value: 'the-environment-and-where-people-live', label: 'Theme 3: The environment and where people live', theme_number: 3, topic_number: 3 }
      ],
      ks5: [
        { value: 'literature', label: 'Literature & Arts', theme_number: null, topic_number: null },
        { value: 'politics-society', label: 'Politics & Society', theme_number: null, topic_number: null },
        { value: 'business-economics', label: 'Business & Economics', theme_number: null, topic_number: null },
        { value: 'science-technology', label: 'Science & Technology', theme_number: null, topic_number: null }
      ]
    };

    return topicMappings[formData.key_stage as keyof typeof topicMappings] || [];
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (layout will handle it)
  if (!user) {
    return null;
  }

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
            <p className="text-slate-600 mt-2">Upload a new educational document (PDF, DOC, DOCX, PPT, or PPTX) and add product information</p>
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
                rows={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                placeholder="Describe what this product teaches and who it's for...

Line breaks, tabs, and formatting will be preserved.

Use double line breaks for paragraphs.
    Use tabs or spaces for indentation."
                disabled={loading}
                style={{ whiteSpace: 'pre-wrap' }}
              />
              <p className="text-sm text-slate-500 mt-1">
                Formatting will be preserved exactly as you type it (line breaks, tabs, indentation, etc.)
              </p>
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
                placeholder="0 for free, 999 for £9.99"
                min="0"
                required
                disabled={loading}
              />
              <p className="text-sm text-slate-500 mt-1">
                Display price: {formData.price_cents === 0 ? 'FREE' : formatPrice(formData.price_cents)}
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
                  accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
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
                        <p className="text-slate-500">PDF, DOC, DOCX, PPT, or PPTX files</p>
                        <p className="text-xs text-slate-400 mt-1">Max file size: 50MB</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Thumbnail Image (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  id="thumbnail-upload"
                  disabled={loading}
                />
                <label htmlFor="thumbnail-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-sm text-slate-600">
                    {formData.thumbnail ? (
                      <div>
                        <p className="font-medium text-slate-800">{formData.thumbnail.name}</p>
                        <p className="text-slate-500">
                          {(formData.thumbnail.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setFormData(prev => ({ ...prev, thumbnail: null }));
                          }}
                          className="text-red-600 hover:text-red-700 text-xs mt-1"
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Click to upload thumbnail</p>
                        <p className="text-slate-500">JPG, PNG, GIF, or WebP files</p>
                        <p className="text-xs text-slate-400 mt-1">Max file size: 5MB</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Preview Images Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Preview Images (Optional)
              </label>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
                    onChange={handlePreviewImagesChange}
                    className="hidden"
                    id="preview-images-upload"
                    multiple
                    disabled={loading}
                  />
                  <label htmlFor="preview-images-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">
                      <p className="font-medium">Click to upload preview images</p>
                      <p className="text-slate-500">JPG, PNG, GIF, or WebP files</p>
                      <p className="text-xs text-slate-400 mt-1">Max 10 images, 5MB each</p>
                    </div>
                  </label>
                </div>

                {/* Preview Images Grid */}
                {formData.preview_images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.preview_images.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              preview_images: prev.preview_images.filter((_, i) => i !== index)
                            }));
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={loading}
                        >
                          ×
                        </button>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Curriculum Categorization */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Curriculum Categorization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Language *
                  </label>
                  <select
                    value={formData.language || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value, key_stage: '', category_type: 'topic', topic_slug: '' }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={loading}
                  >
                    <option value="">Select Language</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                  </select>
                </div>

                {/* Key Stage */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Key Stage *
                  </label>
                  <select
                    value={formData.key_stage || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, key_stage: e.target.value, category_type: 'topic', topic_slug: '' }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={loading || !formData.language}
                  >
                    <option value="">Select Key Stage</option>
                    <option value="ks3">KS3 (Years 7-9)</option>
                    <option value="ks4">KS4 (Years 10-11)</option>
                    <option value="ks5">KS5 (Years 12-13)</option>
                  </select>
                </div>
              </div>

              {/* Category Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category Type *
                </label>
                <select
                  value={formData.category_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_type: e.target.value, topic_slug: '', theme_number: null, topic_number: null }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={loading || !formData.key_stage}
                >
                  <option value="topic">Curriculum Topics</option>
                  <option value="grammar">Grammar</option>
                  <option value="exam-practice">Exam Practice</option>
                  <option value="core-skills">Core Skills</option>
                  <option value="knowledge-organisers">Knowledge Organisers</option>
                </select>
                <p className="text-sm text-slate-500 mt-1">
                  {formData.category_type === 'topic' 
                    ? 'Resources tied to specific curriculum topics' 
                    : 'General skill-based resources not tied to specific topics'
                  }
                </p>
              </div>

              {/* Topic Selection (only for topic category) */}
              {formData.category_type === 'topic' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Topic *
                  </label>
                  <select
                    value={formData.topic_slug || ''}
                    onChange={(e) => {
                      const selectedTopic = getTopicOptions().find(t => t.value === e.target.value);
                      setFormData(prev => ({ 
                        ...prev, 
                        topic_slug: e.target.value,
                        theme_number: selectedTopic?.theme_number || null,
                        topic_number: selectedTopic?.topic_number || null
                      }));
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    disabled={loading || !formData.key_stage}
                  >
                    <option value="">Select Topic</option>
                    {getTopicOptions().map(topic => (
                      <option key={topic.value} value={topic.value}>
                        {topic.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <p className="text-sm text-slate-500 mt-2">
                This determines where your resource will appear in the curriculum structure.
              </p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Additional Tags (Optional)
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a tag and press Enter"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        addTag(target.value);
                        target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a tag and press Enter"]') as HTMLInputElement;
                      if (input) {
                        addTag(input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50"
                    disabled={loading}
                  >
                    Add
                  </button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-indigo-600 hover:text-indigo-800"
                          disabled={loading}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-slate-500">
                  Additional tags for search and filtering (e.g., grammar, vocabulary, exam-prep).
                </p>
              </div>
            </div>

            {/* Enhanced Product Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Enhanced Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={formData.target_audience}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Intermediate Spanish learners, ages 16+"
                    disabled={loading}
                  />
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty_level: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={loading}
                  >
                    <option value="">Select level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Elementary">Elementary</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Upper-Intermediate">Upper-Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Proficiency">Proficiency</option>
                  </select>
                </div>

                {/* Page Count */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Page Count
                  </label>
                  <input
                    type="number"
                    value={formData.page_count || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, page_count: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 25"
                    min="1"
                    disabled={loading}
                  />
                </div>

                {/* File Size */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={formData.file_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, file_size: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 2.5 MB"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Sample Content */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sample Content
                </label>
                <textarea
                  value={formData.sample_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, sample_content: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  placeholder="Provide a sample or excerpt from the content...

Example formatting that will be preserved:

Chapter 1: Introduction
    • Learn basic greetings
    • Understand pronunciation

Grammar Rules:
    1. Verb conjugations
    2. Noun genders
        - Masculine: el, un
        - Feminine: la, una

All tabs, spaces, and line breaks will be preserved exactly as typed."
                  disabled={loading}
                  style={{ whiteSpace: 'pre-wrap' }}
                />
                <p className="text-sm text-slate-500 mt-1">
                  Formatting will be preserved exactly as you type it (line breaks, tabs, indentation, bullet points, etc.)
                </p>
              </div>

              {/* Learning Objectives */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Learning Objectives
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a learning objective and press Enter"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const target = e.target as HTMLInputElement;
                          addLearningObjective(target.value);
                          target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a learning objective and press Enter"]') as HTMLInputElement;
                        if (input) {
                          addLearningObjective(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50"
                      disabled={loading}
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.learning_objectives.length > 0 && (
                    <div className="space-y-2">
                      {formData.learning_objectives.map((objective, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <span className="text-slate-800">{objective}</span>
                          <button
                            type="button"
                            onClick={() => removeLearningObjective(index)}
                            className="text-red-600 hover:text-red-800"
                            disabled={loading}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Table of Contents */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Table of Contents
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Add a section/chapter and press Enter"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const target = e.target as HTMLInputElement;
                          addTableOfContentsItem(target.value);
                          target.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a section/chapter and press Enter"]') as HTMLInputElement;
                        if (input) {
                          addTableOfContentsItem(input.value);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 disabled:opacity-50"
                      disabled={loading}
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.table_of_contents.length > 0 && (
                    <div className="space-y-2">
                      {formData.table_of_contents.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <span className="text-slate-800">
                            <span className="text-indigo-600 font-medium mr-2">{index + 1}.</span>
                            {item}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTableOfContentsItem(index)}
                            className="text-red-600 hover:text-red-800"
                            disabled={loading}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Images */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preview Images (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
                    onChange={handlePreviewImagesChange}
                    className="hidden"
                    id="preview-images-upload"
                    multiple
                    disabled={loading}
                  />
                  <label htmlFor="preview-images-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-sm text-slate-600">
                      {formData.preview_images.length > 0 ? (
                        <div>
                          <p className="font-medium text-slate-800">
                            {formData.preview_images.length} preview image{formData.preview_images.length !== 1 ? 's' : ''} selected
                          </p>
                          <p className="text-slate-500">
                            Total size: {(formData.preview_images.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData(prev => ({ ...prev, preview_images: [] }));
                            }}
                            className="text-red-600 hover:text-red-700 text-xs mt-1"
                            disabled={loading}
                          >
                            Remove all
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">Click to upload preview images</p>
                          <p className="text-slate-500">Show customers what's inside your product</p>
                          <p className="text-xs text-slate-400 mt-1">JPG, PNG, GIF, or WebP files • Max 5MB each</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Stripe Integration */}
            <div className="flex items-center space-x-2 border-t pt-6">
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
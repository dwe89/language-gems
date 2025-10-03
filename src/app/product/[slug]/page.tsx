'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, Star, Download, Shield, Clock, Tag, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ImageModal from '../../../components/ui/ImageModal';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  stripe_price_id: string;
  tags: string[];
  file_path: string;
  thumbnail_url?: string;
  created_at: string;
  preview_images?: string[];
  sample_content?: string;
  learning_objectives?: string[];
  target_audience?: string;
  difficulty_level?: string;
  page_count?: number;
  file_size?: string;
  table_of_contents?: string[];
}

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    if (params?.slug) {
      fetchProduct(params.slug as string);
    }
  }, [params?.slug]);

  const fetchProduct = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceCents: number) => {
    return `£${(priceCents / 100).toFixed(2)}`;
  };

  const openModal = (images: string[], startIndex: number = 0) => {
    setModalImages(images);
    setModalIndex(startIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImages([]);
    setModalIndex(0);
  };

  const previousImage = () => {
    setModalIndex((prev) => (prev > 0 ? prev - 1 : modalImages.length - 1));
  };

  const nextImage = () => {
    setModalIndex((prev) => (prev < modalImages.length - 1 ? prev + 1 : 0));
  };

  const handleTagClick = (tag: string) => {
    // Shop page is deprecated; do nothing or show a message
    // router.push(`/shop?tag=${encodeURIComponent(tag)}`);
  };

  const handlePurchase = async () => {
    if (!product) return;

    setPurchasing(true);

    try {
      // Handle free products
      if (product.price_cents === 0) {
        // For free products, directly provide download
        const response = await fetch('/api/products/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: product.id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get download link');
        }

        const data = await response.json();

        if (data.download_url) {
          // Create a temporary link element to trigger download with proper filename
          const link = document.createElement('a');
          link.href = data.download_url;
          link.download = data.product_name || 'download.pdf';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Show success message
          alert(`✅ Download started! Check your downloads folder for "${data.product_name}"`);
        } else {
          throw new Error('No download URL received');
        }
        return;
      }

      // Handle paid products with Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            product_id: product.id,
            quantity: 1
          }],
          customer_email: null // Guest checkout for now
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Use the checkout URL directly
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <div className="container mx-auto px-6 py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Product Not Found</h1>
            <p className="text-slate-600 mb-8">The product you're looking for doesn't exist or is no longer available.</p>
            <Link
              href="/shop"
              className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="container mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images/Preview */}
            <div className="space-y-6">
              {/* Main Product Image */}
              <div 
                className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl overflow-hidden cursor-pointer group relative"
                onClick={() => {
                  const allImages = product.thumbnail_url 
                    ? [product.thumbnail_url, ...(product.preview_images || [])]
                    : (product.preview_images || []);
                  if (allImages.length > 0) {
                    openModal(allImages, 0);
                  }
                }}
              >
                {product.thumbnail_url ? (
                  <>
                    <img 
                      src={product.thumbnail_url} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium px-3 py-1 bg-black bg-opacity-50 rounded-full">
                        Click to enlarge
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-12 flex items-center justify-center">
                    <div className="text-indigo-600 text-8xl">📚</div>
                  </div>
                )}
              </div>

              {/* Preview Images Gallery */}
              {product.preview_images && product.preview_images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Preview Images ({product.preview_images.length})
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.preview_images.map((image, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-xl p-2 shadow-lg cursor-pointer group relative hover:shadow-xl transition-shadow duration-300"
                        onClick={() => {
                          const allImages = product.thumbnail_url 
                            ? [product.thumbnail_url, ...product.preview_images!]
                            : product.preview_images!;
                          const imageIndex = product.thumbnail_url ? index + 1 : index;
                          openModal(allImages, imageIndex);
                        }}
                      >
                        <img 
                          src={image} 
                          alt={`${product.name} preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center rounded-xl">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium px-2 py-1 bg-black bg-opacity-50 rounded">
                            View larger
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Details */}
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">File Details</h3>
                <div className="space-y-2">
                  {product.page_count && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Pages:</span>
                      <span className="font-medium">{product.page_count}</span>
                    </div>
                  )}
                  {product.file_size && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">File Size:</span>
                      <span className="font-medium">{product.file_size}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-600">Format:</span>
                    <span className="font-medium">PDF</span>
                  </div>
                  {product.difficulty_level && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Level:</span>
                      <span className="font-medium">{product.difficulty_level}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                  <Download className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-800">Instant Download</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-lg">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-800">Secure Payment</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full hover:bg-indigo-200 hover:text-indigo-800 transition-colors cursor-pointer"
                      title={`See other products tagged with "${tag}"`}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="text-4xl font-bold text-indigo-600">
                {formatPrice(product.price_cents)}
              </div>

              {/* Description */}
              <div className="prose prose-slate max-w-none prose-lg text-slate-600">
                <div style={{ whiteSpace: 'pre-wrap' }} className="font-medium leading-relaxed">
                  {product.description}
                </div>
              </div>

              {/* Target Audience */}
              {product.target_audience && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Who This Is For</h3>
                  <p className="text-slate-600">{product.target_audience}</p>
                </div>
              )}

              {/* Learning Objectives */}
              {product.learning_objectives && product.learning_objectives.length > 0 && (
                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Learning Objectives</h3>
                  <ul className="space-y-2">
                    {product.learning_objectives.map((objective, index) => (
                      <li key={index} className="flex items-start text-slate-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Table of Contents */}
              {product.table_of_contents && product.table_of_contents.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">What's Inside</h3>
                  <ul className="space-y-2">
                    {product.table_of_contents.map((item, index) => (
                      <li key={index} className="flex items-center text-slate-600">
                        <span className="text-indigo-600 font-medium mr-3">{index + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Content */}
              {product.sample_content && (
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Sample Content</h3>
                  <div className="prose prose-sm text-slate-600 max-w-none">
                    <div style={{ whiteSpace: 'pre-wrap' }} className="font-mono text-sm leading-relaxed">
                      {product.sample_content}
                    </div>
                  </div>
                </div>
              )}

              {/* Purchase Button */}
              <div className="space-y-4">
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || (product.price_cents > 0 && !product.stripe_price_id)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {purchasing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      {product.price_cents === 0 ? 'Downloading...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      {product.price_cents === 0 ? (
                        <>
                          <Download className="mr-3 h-5 w-5" />
                          Download Free
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-3 h-5 w-5" />
                          Buy Now - {formatPrice(product.price_cents)}
                        </>
                      )}
                    </>
                  )}
                </button>
                
                <p className="text-sm text-slate-500 text-center">
                  Secure checkout powered by Stripe
                </p>
              </div>

              {/* What's Included */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">What's Included:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    High-quality digital resource file
                  </li>
                  <li className="flex items-center text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Immediate download access
                  </li>
                  <li className="flex items-center text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Lifetime access to your purchase
                  </li>
                  <li className="flex items-center text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Compatible with all devices
                  </li>
                </ul>
              </div>

              {/* Guarantee */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center mb-3">
                  <Shield className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-800">30-Day Money-Back Guarantee</h3>
                </div>
                <p className="text-slate-600">
                  Not satisfied with your purchase? Get a full refund within 30 days, no questions asked.
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                ⚡
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Instant Access</h3>
              <p className="text-slate-600">
                Download your resource immediately after purchase completion.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                🎯
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Expert Quality</h3>
              <p className="text-slate-600">
                Created by experienced educators and curriculum specialists.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                🏆
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Proven Results</h3>
              <p className="text-slate-600">
                Trusted by thousands of educators worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={closeModal}
        images={modalImages}
        currentIndex={modalIndex}
        onPrevious={previousImage}
        onNext={nextImage}
        title={product.name}
      />
    </div>
  );
} 
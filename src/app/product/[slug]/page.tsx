'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabase';
import { ArrowLeft, Star, Download, Shield, Clock, Tag, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

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

  const handlePurchase = async () => {
    if (!product) return;
    
    setPurchasing(true);
    
    try {
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
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl overflow-hidden">
                {product.thumbnail_url ? (
                  <img 
                    src={product.thumbnail_url} 
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                ) : (
                  <div className="p-12 flex items-center justify-center">
                    <div className="text-indigo-600 text-8xl">📚</div>
                  </div>
                )}
              </div>

              {/* Preview Images Gallery */}
              {product.preview_images && product.preview_images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800">Preview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {product.preview_images.slice(0, 4).map((image, index) => (
                      <div key={index} className="bg-white rounded-xl p-2 shadow-lg">
                        <img 
                          src={image} 
                          alt={`${product.name} preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                  {product.preview_images.length > 4 && (
                    <p className="text-sm text-slate-500 text-center">
                      +{product.preview_images.length - 4} more preview images
                    </p>
                  )}
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
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag.replace('-', ' ')}
                    </span>
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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {product.description}
                </ReactMarkdown>
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {product.sample_content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Purchase Button */}
              <div className="space-y-4">
                <button
                  onClick={handlePurchase}
                  disabled={purchasing || !product.stripe_price_id}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {purchasing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-3 h-5 w-5" />
                      Buy Now - {formatPrice(product.price_cents)}
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
    </div>
  );
} 
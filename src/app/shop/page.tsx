'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Star, Download, ArrowRight, ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  tags: string[];
  is_active: boolean;
  created_at: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceCents: number) => {
    return `£${(priceCents / 100).toFixed(2)}`;
  };

  const getAllTags = () => {
    const tagSet = new Set<string>();
    products.forEach(product => {
      product.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || product.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Digital Resources Shop
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-8">
              Premium teaching materials, lesson plans, and resources to enhance your MFL classroom
            </p>
            <div className="flex items-center justify-center space-x-8 text-indigo-100">
              <div className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                <span>Instant Download</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedTag
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All Resources
              </button>
              {getAllTags().map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tag.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-400 text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Product Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="text-indigo-600 text-4xl">📚</div>
                </div>

                <div className="p-6">
                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {product.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full"
                        >
                          {tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-indigo-600">
                      {formatPrice(product.price_cents)}
                    </div>
                    <Link
                      href={`/product/${product.slug}`}
                      className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all group-hover:scale-105"
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose Our Resources?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Professionally crafted materials designed by experienced educators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                ⚡
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Instant Access</h3>
              <p className="text-slate-600">
                Download immediately after purchase. No waiting, no delays.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                🎯
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Curriculum Aligned</h3>
              <p className="text-slate-600">
                All resources align with current MFL curriculum standards and exam requirements.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
                🏆
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Expert Created</h3>
              <p className="text-slate-600">
                Developed by experienced MFL teachers and education specialists.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Enhance Your Teaching?</h3>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of educators who trust LanguageGems for their teaching resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Create Account
              </Link>
              <Link
                href="/blog"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Read Our Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, CheckCircle, BookOpen, FileText, Sparkles, Mail, ShoppingCart, Filter } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import Footer from '../../components/layout/Footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  language?: string;
  key_stage?: string;
  file_path: string;
  is_active: boolean;
}

export default function FreeResourcesPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());

  // Fetch free products from database
  useEffect(() => {
    async function fetchFreeProducts() {
      try {
        const response = await fetch('/api/products/free');
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching free products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFreeProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    setAddedToCart(prev => new Set(prev).add(product.id));

    // Remove the "added" state after 2 seconds
    setTimeout(() => {
      setAddedToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    if (selectedLanguage !== 'all' && product.language !== selectedLanguage) return false;
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    return true;
  });

  // Get unique languages and categories
  const languages = Array.from(new Set(products.map(p => p.language).filter(Boolean)));
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
            <Sparkles className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Free Language Learning Resources
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-6">
            High-quality worksheets, guides, and templates for language teachers.
            Add to cart and checkout with your email to download instantly.
          </p>

          {/* CTA to Cart */}
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/cart"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              View Cart & Checkout
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-slate-600 mr-2" />
                <span className="font-semibold text-slate-700">Filter by:</span>
              </div>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Languages</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <div className="ml-auto text-sm text-slate-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'resource' : 'resources'}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-16">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
              <p className="text-slate-600">Loading free resources...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
              <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No resources found</h3>
              <p className="text-slate-600">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-all hover:border-green-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-green-600 mr-3" />
                      <span className="text-xs font-semibold text-green-600 uppercase tracking-wide bg-green-50 px-2 py-1 rounded">
                        FREE
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {product.name}
                  </h3>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
                    {product.language && (
                      <span className="bg-slate-100 px-2 py-1 rounded">
                        {product.language}
                      </span>
                    )}
                    {product.key_stage && (
                      <span className="bg-slate-100 px-2 py-1 rounded">
                        {product.key_stage.toUpperCase()}
                      </span>
                    )}
                    {product.category && (
                      <span className="bg-slate-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addedToCart.has(product.id)}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${
                      addedToCart.has(product.id)
                        ? 'bg-green-100 text-green-700 border-2 border-green-300'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {addedToCart.has(product.id) ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Why Teachers Love Our Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Curriculum-Aligned</h3>
                <p className="text-slate-600">All resources align with UK national curriculum standards</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Ready to Use</h3>
                <p className="text-slate-600">Print and use immediately - no preparation needed</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Expertly Designed</h3>
                <p className="text-slate-600">Created by experienced language teachers</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Completely Free</h3>
                <p className="text-slate-600">No hidden costs or credit card required</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


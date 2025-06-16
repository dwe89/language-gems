'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import { CartSidebar } from '../../components/cart/CartSidebar';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import { Product } from '../../types/ecommerce';
import { ShoppingCart, Search, Filter, Star, ExternalLink } from 'lucide-react';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { addItem, toggleCart, getTotalItems } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseBrowser
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
    const tags = new Set<string>();
    products.forEach(product => {
      product.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || product.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Educational Resources Shop</h1>
              <p className="text-slate-600 mt-2">Premium materials to enhance your language learning journey</p>
            </div>
            
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Tag Filter */}
            <div className="relative">
              <select
                value={selectedTag || ''}
                onChange={(e) => setSelectedTag(e.target.value || null)}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white min-w-[200px]"
              >
                <option value="">All Categories</option>
                {getAllTags().map(tag => (
                  <option key={tag} value={tag}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-medium text-slate-600 mb-2">
              {searchTerm || selectedTag ? 'No products found' : 'No products available'}
            </h3>
            <p className="text-slate-500">
              {searchTerm || selectedTag 
                ? 'Try adjusting your search or filter criteria'
                : 'Check back soon for new educational resources'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                {/* Clickable Product Image and Title */}
                <Link href={`/product/${product.slug}`} className="block">
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 relative overflow-hidden">
                    {product.thumbnail_url ? (
                      <img 
                        src={product.thumbnail_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">📚</span>
                    )}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ExternalLink className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>

                  {/* Product Title and Description */}
                  <div className="p-6 pb-2">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-0 line-clamp-3">
                      {product.description}
                    </p>
                  </div>
                </Link>

                {/* Non-clickable content */}
                <div className="px-6 pb-6">
                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {product.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          +{product.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-indigo-600">
                      {formatPrice(product.price_cents)}
                    </div>
                    
                    <button
                      onClick={() => addItem(product)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
} 
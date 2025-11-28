'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '../../components/auth/AuthProvider';
import ResourceFilterSidebar, { FilterState } from '../../components/resources/ResourceFilterSidebar';
import ResourceCard from '../../components/resources/ResourceCard';
import {
  Search, Gift, ShoppingCart, Menu, BookOpen, Loader, Settings
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import Footer from '../../components/layout/Footer';
import { CartSidebar } from '../../components/cart/CartSidebar';
import { isAdmin } from '../../lib/adminCheck';
import { Product } from '../../types/ecommerce';
import { useRouter } from 'next/navigation';

export default function ResourcesPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addItem, toggleCart, getTotalItems } = useCart();

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    language: '',
    keyStage: '',
    examBoard: '',
    category: '',
    subcategory: '',
    theme: '',
    topic: '',
    resourceType: '',
    skill: '',
    priceRange: 'all',
    search: ''
  });

  // Admin functionality
  const userIsAdmin = user?.email && isAdmin(user.email);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      const result = await response.json();
      const products = result.products || [];
      setProducts(products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  const handleClearFilters = () => {
    setFilters({
      language: '',
      keyStage: '',
      examBoard: '',
      category: '',
      subcategory: '',
      theme: '',
      topic: '',
      resourceType: '',
      skill: '',
      priceRange: 'all',
      search: ''
    });
  };



  // Filter products based on current filters
  const filteredProducts = products.filter(product => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Language filter - check both language field and tags
    if (filters.language) {
      const matchesLanguage =
        product.language?.toLowerCase() === filters.language.toLowerCase() ||
        product.tags?.some(tag => tag.toLowerCase() === filters.language.toLowerCase());
      if (!matchesLanguage) return false;
    }

    // Key Stage filter - check both key_stage field and tags
    if (filters.keyStage) {
      const matchesKeyStage =
        product.key_stage?.toLowerCase() === filters.keyStage.toLowerCase() ||
        product.tags?.some(tag => tag.toLowerCase() === filters.keyStage.toLowerCase());
      if (!matchesKeyStage) return false;
    }

    // Category filter (only relevant for KS3)
    if (filters.category && product.tags) {
      if (!product.tags.some(tag => tag.toLowerCase().includes(filters.category.toLowerCase()))) {
        return false;
      }
    }

    // Subcategory filter (only relevant for KS3, within a category)
    if (filters.subcategory && product.tags) {
      if (!product.tags.some(tag => tag.toLowerCase().includes(filters.subcategory.toLowerCase()))) {
        return false;
      }
    }

    // Exam Board filter (only relevant for KS4)
    if (filters.examBoard && product.tags) {
      if (!product.tags.some(tag => tag.toLowerCase() === filters.examBoard.toLowerCase())) {
        return false;
      }
    }

    // Theme filter (only relevant for KS4)
    if (filters.theme && product.tags) {
      if (!product.tags.some(tag => tag.toLowerCase().includes(filters.theme.toLowerCase()))) {
        return false;
      }
    }

    // Topic filter (only relevant for KS4, within a theme)
    if (filters.topic && product.tags) {
      if (!product.tags.some(tag => tag.toLowerCase().includes(filters.topic.toLowerCase()))) {
        return false;
      }
    }

    // Resource Type filter - check category_type field
    if (filters.resourceType) {
      const matchesResourceType =
        product.category_type?.toLowerCase() === filters.resourceType.toLowerCase() ||
        product.tags?.some(tag => tag.toLowerCase().includes(filters.resourceType.toLowerCase()));
      if (!matchesResourceType) return false;
    }

    // Skill filter
    if (filters.skill && product.tags) {
      if (!product.tags.some(tag => tag.toLowerCase().includes(filters.skill.toLowerCase()))) {
        return false;
      }
    }

    // Price filter
    if (filters.priceRange === 'free' && product.price_cents !== 0) {
      return false;
    }
    if (filters.priceRange === 'paid' && product.price_cents === 0) {
      return false;
    }

    return true;
  });

  return (
    <>
      <Head>
        <title>Educational Resources | GCSE Language Learning Materials | Language Gems</title>
        <meta name="description" content="Premium GCSE language learning resources, worksheets, and materials for Spanish, French, and German. Download high-quality educational content for KS3 and KS4 students." />
        <meta name="keywords" content="GCSE language resources, Spanish worksheets, French learning materials, German education resources, KS3 language learning, KS4 MFL resources, language teaching materials" />
        <link rel="canonical" href="https://languagegems.com/resources" />
      </Head>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Educational Resources</h1>
                <p className="text-slate-600 mt-2">Premium materials to enhance your language learning journey</p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/free-resources"
                  className="hidden md:flex px-6 py-3 bg-green-600 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-green-700 transition-colors items-center"
                >
                  <Gift className="h-5 w-5 mr-2" />
                  Free Resources
                </Link>
                <button
                  onClick={toggleCart}
                  className="relative p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <ResourceFilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filter Button + Search */}
              <div className="lg:hidden mb-6 space-y-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                  <span className="font-medium">Filters</span>
                </button>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Desktop Search */}
              <div className="hidden lg:block mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search resources..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-slate-600">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      Loading resources...
                    </span>
                  ) : (
                    <span>
                      Showing <span className="font-semibold text-slate-900">{filteredProducts.length}</span> of{' '}
                      <span className="font-semibold text-slate-900">{products.length}</span> resources
                    </span>
                  )}
                </p>
              </div>

              {/* Product Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader className="h-12 w-12 text-indigo-600 animate-spin" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                  <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No resources found</h3>
                  <p className="text-slate-600 mb-6">Try adjusting your filters or search term</p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ResourceCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      isAuthenticated={!!user}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Modal */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
            <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
              <ResourceFilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={handleClearFilters}
                isMobile={true}
                onClose={() => setShowMobileFilters(false)}
              />
            </div>
          </div>
        )}

        <CartSidebar />
      </div>

      <Footer />
    </>
  );
}

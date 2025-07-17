'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../components/auth/AuthProvider';
import CurriculumNavigator from '../../components/freebies/CurriculumNavigator';
import FreebiesNavTabs from '../../components/freebies/FreebiesNavTabs';
import FreebiesBreadcrumb from '../../components/freebies/FreebiesBreadcrumb';
import { 
  Download, Search, Filter, Star, BookOpen, Users, 
  GraduationCap, Globe, Music, Home, MapPin, Laptop,
  Leaf, Plane, School, User, Calculator, Clock,
  FileText, Gift, Lock, CheckCircle, ShoppingCart, ExternalLink
} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { CartSidebar } from '../../components/cart/CartSidebar';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import { Product } from '../../types/ecommerce';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

// Remove WorksheetCategory and Worksheet interfaces
// Remove YEAR_GROUPS and any worksheet-specific constants
// Remove getAllProducts, getFilteredProducts, featuredProducts, and worksheet logic
// Ensure export default function is ResourcesPage
// Render product grid using only Product properties as previously described

const LANGUAGES = ['Spanish', 'French', 'German', 'All Languages'];

export default function ResourcesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<'hub' | 'curriculum' | 'skills'>('hub');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>('');
  const { addItem, toggleCart, getTotalItems } = useCart();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const router = useRouter();

  // Remove mock categories and worksheets data

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

  const handleDownload = (product: Product) => {
    if (!product.file_path) {
      alert('Product file path is not available.');
      return;
    }

    if (product.price_cents > 0 && !user) {
      setShowAuthPrompt(true);
      return;
    }

    // In production, this would trigger the actual download
    // For now, we'll just show an alert
    if (product.price_cents > 0 && !user) {
      alert('Please sign in to download premium worksheets');
      return;
    }

    // Create download link
    const link = document.createElement('a');
    link.href = product.file_path;
    link.download = `${product.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const breadcrumbItems = [
    { label: 'Resources', active: true }
  ];

  const handleReturnToHub = () => {
    setActiveView('hub');
  };

  const renderHubContent = () => (
    <>
      {/* Featured Resources */}
      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Find Your Perfect Worksheet</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search worksheets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || '')}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {/* Category options will need to be fetched from the database */}
            <option value="themes">Themed Worksheets</option>
            <option value="grammar">Grammar Essentials</option>
            <option value="exam-prep">Exam Preparation</option>
          </select>

          {/* Year Group Filter */}
          <select
            value={selectedLanguage || ''}
            onChange={(e) => setSelectedLanguage(e.target.value || '')}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Language Filter */}
          <select
            value={selectedLanguage || ''}
            onChange={(e) => setSelectedLanguage(e.target.value || '')}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || selectedCategory || selectedLanguage) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedLanguage('');
              }}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200">
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-800 line-clamp-2 flex-1">
                  {product.name}
              </h3>
            </div>
            
            <p className="text-slate-600 mb-4 line-clamp-3 text-sm">
                {product.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                  {(product.tags || []).join(', ')}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  {product.price_cents === 0 ? 'Free' : `$${(product.price_cents / 100).toFixed(2)}`}
              </span>
            </div>
            
            <button
                onClick={() => handleDownload(product)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm ${
                  product.price_cents > 0 && !user
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
                {product.price_cents > 0 && !user ? (
                <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In Required
                </>
              ) : (
                <>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                </>
              )}
            </button>
          </div>
        </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-slate-600 mb-2">
            No worksheets found
          </h3>
          <p className="text-slate-500">
            Try adjusting your search criteria or browse all categories
          </p>
        </div>
      )}
    </>
  );

  // Add formatPrice helper
  const formatPrice = (priceCents: number) => {
    if (priceCents === 0) return 'FREE';
    return `£${(priceCents / 100).toFixed(2)}`;
  };

  // Add getAllTags helper
  const getAllTags = () => {
    const tags = new Set<string>();
    products.forEach((product: Product) => {
      product.tags?.forEach((tag: string) => tags.add(tag));
    });
    return Array.from(tags);
  };

  // Helper to check if a product matches a tag (case-insensitive)
  const hasTag = (product: Product, tag: string) =>
    product.tags?.some((t: string) => t.toLowerCase() === tag.toLowerCase());

  // Add filteredProducts logic
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || hasTag(product, selectedTag);
    const matchesLanguage = !selectedLanguage || hasTag(product, selectedLanguage);
    const matchesCategory = !selectedCategory || hasTag(product, selectedCategory);
    const matchesExamBoard = !selectedExamBoard || hasTag(product, selectedExamBoard);
    return matchesSearch && matchesTag && matchesLanguage && matchesCategory && matchesExamBoard;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Educational Resources</h1>
              <p className="text-slate-600 mt-2">Premium materials to enhance your language learning journey</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/resources"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-green-700 transition-colors"
                style={{ minWidth: 160 }}
              >
                🎁 Freebies
              </Link>
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
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <FreebiesNavTabs 
          activeTab={activeView} 
          onTabChange={(tab) => {
            if (tab === 'skills') {
              router.push('/resources/skills');
            } else {
              setActiveView(tab as 'hub' | 'curriculum' | 'skills');
            }
          }}
          className="mb-8"
        />
      </div>

      {/* Main Content: Curriculum, Hub, or Skills Hub */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'curriculum' ? (
          <CurriculumNavigator onReturnToHub={handleReturnToHub} />
        ) : activeView === 'skills' ? (
          <SkillsHubLanding />
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 flex-wrap">
                {/* Search */}
                <div className="flex-1 relative min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {/* Language Filter */}
                <div className="relative min-w-[160px]">
                  <select
                    value={selectedLanguage}
                    onChange={e => setSelectedLanguage(e.target.value)}
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white w-full"
                  >
                    <option value="">All Languages</option>
                    {['French', 'Spanish', 'German'].map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
                {/* Category Filter */}
                <div className="relative min-w-[160px]">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white w-full"
                  >
                    <option value="">All Types</option>
                    {['Grammar', 'Vocabulary', 'Worksheets', 'Listening', 'Reading', 'Writing', 'Speaking'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
                {/* Exam Board Filter */}
                <div className="relative min-w-[160px]">
                  <select
                    value={selectedExamBoard}
                    onChange={e => setSelectedExamBoard(e.target.value)}
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white w-full"
                  >
                    <option value="">All Exam Boards</option>
                    {['AQA', 'Edexcel', 'OCR', 'WJEC', 'CIE'].map(board => (
                      <option key={board} value={board}>{board}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>
                {/* Tag Filter */}
                <div className="relative min-w-[160px]">
                  <select
                    value={selectedTag || ''}
                    onChange={(e) => setSelectedTag(e.target.value || '')}
                    className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white w-full"
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
                          className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center space-x-2 ${
                            product.price_cents === 0 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-indigo-600 hover:bg-indigo-700'
                          }`}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>{product.price_cents === 0 ? 'Get for FREE' : 'Add to Cart'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
} 

function SkillsHubLanding() {
  const router = useRouter();
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-3xl font-bold mb-2 text-center">Skills Hub</h2>
      <p className="text-slate-600 text-center mb-8">Master core language skills with targeted resources.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Grammar Card */}
        <div className="bg-indigo-50 rounded-lg p-6 shadow text-center flex flex-col items-center cursor-pointer hover:shadow-lg transition" onClick={() => router.push('/resources/skills/grammar')}>
          <BookOpen className="h-10 w-10 text-indigo-500 mb-3" />
          <h3 className="text-xl font-bold mb-2">Grammar</h3>
          <p className="text-slate-700 mb-4">Verb conjugations, tenses, sentence structures</p>
          <span className="inline-block mt-auto px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">Explore Grammar</span>
        </div>
        {/* Vocabulary Card */}
        <div className="bg-green-50 rounded-lg p-6 shadow text-center flex flex-col items-center cursor-pointer hover:shadow-lg transition" onClick={() => router.push('/resources/skills/vocabulary')}>
          <Users className="h-10 w-10 text-green-500 mb-3" />
          <h3 className="text-xl font-bold mb-2">Vocabulary</h3>
          <p className="text-slate-700 mb-4">Word lists, vocab booklets, frequency-based packs</p>
          <span className="inline-block mt-auto px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">Explore Vocabulary</span>
        </div>
        {/* Exam Practice Card */}
        <div className="bg-yellow-50 rounded-lg p-6 shadow text-center flex flex-col items-center cursor-pointer hover:shadow-lg transition" onClick={() => router.push('/resources/skills/exam-practice')}>
          <FileText className="h-10 w-10 text-yellow-500 mb-3" />
          <h3 className="text-xl font-bold mb-2">Exam Practice</h3>
          <p className="text-slate-700 mb-4">Reading, listening, speaking, writing tasks</p>
          <span className="inline-block mt-auto px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors">Explore Exam Practice</span>
        </div>
      </div>
    </div>
  );
} 
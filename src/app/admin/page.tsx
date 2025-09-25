'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth, supabaseBrowser } from '../../components/auth/AuthProvider';
import {
  Package,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  FileText,
  ShoppingCart,
  Calendar,
  Database,
  Volume2,
  Play
} from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalRevenue: number; // This would come from orders/payments
  totalDownloads: number; // This would come from download tracking
  totalBlogPosts: number;
  publishedBlogPosts: number;
}

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalRevenue: 0,
    totalDownloads: 0,
    totalBlogPosts: 0,
    publishedBlogPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      setHasError(false);
      
      // Fetch products stats
      const { data: products, error: productsError } = await supabaseBrowser
        .from('products')
        .select('id, name, price_cents, is_active, created_at');

      if (productsError) {
        console.error('Products error:', productsError);
        throw productsError;
      }

      // Fetch blog posts stats
      const { data: blogPosts, error: blogError } = await supabaseBrowser
        .from('blog_posts')
        .select('id, is_published');

      if (blogError) {
        console.error('Blog posts error:', blogError);
        throw blogError;
      }

      const totalProducts = products?.length || 0;
      const activeProducts = products?.filter(p => p.is_active).length || 0;
      const totalBlogPosts = blogPosts?.length || 0;
      const publishedBlogPosts = blogPosts?.filter(p => p.is_published).length || 0;
      
      // Get recent products (last 5)
      const recent = products
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5) || [];

      setStats({
        totalProducts,
        activeProducts,
        totalRevenue: 0, // Would come from payments/orders table
        totalDownloads: 0, // Would come from downloads tracking
        totalBlogPosts,
        publishedBlogPosts,
      });
      
      setRecentProducts(recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setHasError(true);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [user]);

  useEffect(() => {
    if (user && !authLoading && !isInitialized) {
      fetchDashboardData();
    }
  }, [user, authLoading, isInitialized, fetchDashboardData]);

  const formatPrice = (pricePence: number) => {
    return `£${(pricePence / 100).toFixed(2)}`;
  };

  const quickActions = [
    {
      title: 'AI Worksheet Generator',
      description: 'Create professional worksheets with AI assistance',
      href: '/admin/worksheets',
      icon: FileText,
      color: 'bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600',
    },
    {
      title: 'Vocabulary Management',
      description: 'Manage your centralized vocabulary database and audio files',
      href: '/admin/vocabulary',
      icon: Database,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600',
    },
    {
      title: 'Add New Product',
      description: 'Upload a new educational PDF and create a product',
      href: '/admin/new',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Video Management',
      description: 'Manage YouTube videos, categories, and content organization',
      href: '/admin/videos',
      icon: Play,
      color: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600',
    },
    {
      title: 'Manage Products',
      description: 'View, edit, and manage all your products',
      href: '/admin/products',
      icon: Package,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
  ];

  const upcomingFeatures = [
    {
      title: 'Bulk Audio Generation',
      description: 'Generate audio files for vocabulary in bulk',
      icon: Volume2,
      status: 'Available',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Detailed sales and download analytics',
      icon: TrendingUp,
      status: 'Coming Soon',
    },
    {
      title: 'Customer Management',
      description: 'Manage customer accounts and support',
      icon: Users,
      status: 'Coming Soon',
    },
  ];

  // Show loading state while checking authentication or fetching data
  if (authLoading || (loading && !isInitialized)) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <div className="text-slate-600">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (layout will handle it)
  if (!user) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="flex items-center justify-center">
          <div className="text-slate-600">Please wait...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-4">Error Loading Dashboard</div>
          <div className="text-slate-600 mb-4">There was an error loading your dashboard data.</div>
          <button 
            onClick={fetchDashboardData}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Welcome to your LanguageGems admin panel. Manage your products and monitor your business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Products</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Products</p>
              <p className="text-3xl font-bold text-slate-900">{stats.activeProducts}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <p className="text-3xl font-bold text-slate-900">£{stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Downloads</p>
              <p className="text-3xl font-bold text-slate-900">{stats.totalDownloads}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => (
              <Link
                key={`action-${index}`}
                href={action.href}
                className="flex items-center p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors group"
              >
                <div className={`p-3 rounded-lg ${action.color} transition-colors`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-slate-900 group-hover:text-indigo-600">{action.title}</h3>
                  <p className="text-sm text-slate-600">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Recent Products</h2>
            <Link 
              href="/admin/products"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          
          {recentProducts.length > 0 ? (
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={`product-${product.id}`} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-slate-900">{product.name}</h3>
                    <p className="text-sm text-slate-600">
                      {formatPrice(product.price_cents)} • {product.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(product.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No products yet</p>
              <Link 
                href="/admin/new"
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Add your first product
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Upcoming Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingFeatures.map((feature, index) => (
              <div key={`feature-${index}`} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="bg-slate-100 rounded-lg p-2">
                    <feature.icon className="w-5 h-5 text-slate-600" />
                  </div>
                  <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {feature.status}
                  </span>
                </div>
                <h3 className="font-medium text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
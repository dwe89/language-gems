'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Plus, Home, FileText } from 'lucide-react';
import { useAuth, supabaseBrowser } from '../../components/auth/AuthProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: authLoading, userRole, isAdmin } = useAuth();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  
  // Handle authentication state changes more gracefully
  useEffect(() => {
    if (!authLoading) {
      setIsInitialized(true);
      
      // Show access denied only after auth is fully loaded
      if (user && !isAdmin) {
        setShowAccessDenied(true);
      }
    }
  }, [authLoading, user, isAdmin]);

  const handleSignOut = useCallback(async () => {
    try {
      await supabaseBrowser.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback redirect
      window.location.href = '/';
    }
  }, [router]);

  // Show loading state while auth is initializing
  if (!isInitialized || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-slate-600">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything - middleware will handle redirect
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-slate-600">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  // If not admin, show access denied
  if (showAccessDenied) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-4">Admin Access Required</div>
          <div className="text-slate-600 mb-4">You need admin privileges to access this area.</div>
          <div className="text-sm text-slate-500 mb-6">
            Current role: {userRole || 'none'}
          </div>
          <div className="space-x-4">
            <Link 
              href="/account" 
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Account
            </Link>
            <Link 
              href="/" 
              className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      {/* Admin Navigation */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700">
                <Home className="w-5 h-5" />
                <span className="font-medium">Back to Site</span>
              </Link>
              <div className="flex items-center space-x-6">
                <Link 
                  href="/admin" 
                  className="text-slate-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/admin/products" 
                  className="flex items-center space-x-2 text-slate-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </Link>
                <Link 
                  href="/admin/blog" 
                  className="flex items-center space-x-2 text-slate-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Blog</span>
                </Link>
                <Link 
                  href="/admin/worksheets" 
                  className="flex items-center space-x-2 text-slate-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>AI Worksheets</span>
                </Link>
                <Link 
                  href="/admin/new" 
                  className="flex items-center space-x-2 text-slate-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
} 
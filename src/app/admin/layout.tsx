'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Settings, Package, Plus } from 'lucide-react';
import { supabaseBrowser } from '../../components/auth/AuthProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      
      // Replace with your actual admin email
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@languagegems.com";
      
      if (user && user.email === adminEmail) {
        setIsAuthorized(true);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="flex">
        {/* Admin Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-sm text-slate-600">LanguageGems</p>
          </div>
          
          <nav className="p-4 space-y-2">
            <Link
              href="/admin/products"
              className="flex items-center space-x-3 px-4 py-3 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span>All Products</span>
            </Link>
            
            <Link
              href="/admin/new"
              className="flex items-center space-x-3 px-4 py-3 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Product</span>
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
} 
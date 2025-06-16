'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Settings, Package, Plus, Home } from 'lucide-react';
import { supabaseBrowser } from '../../components/auth/AuthProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const router = useRouter();
  
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabaseBrowser.auth.getUser();
      
      console.log('Admin Auth Debug:', {
        user: user,
        userEmail: user?.email,
        adminEmailEnv: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      });

      setUserEmail(user?.email || null);
      
      if (!user) {
        setDebugInfo('User not authenticated');
        // TODO: Re-enable email check later
        // router.push('/auth/login');
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // TEMPORARY: Allow any authenticated user for testing
      // TODO: Restore email-based authorization later
      setIsAuthorized(true);
      setDebugInfo(`Authenticated as: ${user.email}`);
      
      /* Original email check - temporarily disabled
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
        process.env.ADMIN_EMAIL ||
        "admin@languagegems.com";
      
      if (user.email !== adminEmail) {
        setDebugInfo(`Email mismatch: ${user.email} !== ${adminEmail}`);
        router.push('/');
        return;
      }
      */

    } catch (error) {
      console.error('Auth error:', error);
      setDebugInfo(`Auth error: ${error}`);
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-slate-600">Checking admin access...</div>
          {debugInfo && (
            <div className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Debug: {debugInfo}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-4">Access Denied</div>
          <div className="text-slate-600 mb-4">You need to be logged in to access the admin dashboard.</div>
          <div className="text-sm text-slate-500 mb-6">
            Debug: {debugInfo}
          </div>
          <div className="space-x-4">
            <Link 
              href="/auth/login" 
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Login
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
                  href="/admin/new" 
                  className="flex items-center space-x-2 text-slate-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                Welcome, {userEmail}
              </div>
              <button 
                onClick={async () => {
                  await supabaseBrowser.auth.signOut();
                  router.push('/');
                }}
                className="text-slate-700 hover:text-red-600 font-medium transition-colors"
              >
                Logout
              </button>
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
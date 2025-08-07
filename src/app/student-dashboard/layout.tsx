'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/auth/AuthProvider';
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});



export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hasSubscription, isLoading } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const router = useRouter();
  
  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Add check for teacher/admin role and redirect
  useEffect(() => {
    // Only check after user data is loaded and component is hydrated
    if (!isHydrated || isLoading || !user) return;
    
    // Check if we're on the student subdomain
    const hostname = window.location.hostname;
    const isStudentSubdomain = hostname.startsWith('students.');
    
    // Only apply redirects if we're on the student subdomain
    if (!isStudentSubdomain) {
      console.log('Student dashboard accessed on main domain - allowing access without redirects');
      return;
    }
    
    // Check if user data is loaded and the user is a teacher or admin
    if (user.user_metadata?.role === 'teacher' || user.user_metadata?.role === 'admin') {
      // Allow teachers to access student dashboard if they're in preview mode
      const urlParams = new URLSearchParams(window.location.search);
      const isPreviewMode = urlParams.get('preview') === 'true';
      
      if (!isPreviewMode) {
        console.log('Teacher or admin accessing student dashboard without preview mode, redirecting to teacher dashboard');
        // Use a timeout to prevent rapid navigation
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        console.log('Teacher accessing student dashboard in preview mode - allowing access');
      }
    }
  }, [user, router, isHydrated, isLoading]);

  // Check if we should redirect to preview in production
  useEffect(() => {
    // Only check after hydration and when auth is not loading
    if (!isHydrated || isLoading) return;
    
    // Check if we're on the student subdomain
    const hostname = window.location.hostname;
    const isStudentSubdomain = hostname.startsWith('students.');
    
    // Only apply production redirects if we're on the student subdomain
    if (!isStudentSubdomain) {
      console.log('Student dashboard accessed on main domain - skipping production redirects');
      return;
    }
    
    const isProduction = process.env.NODE_ENV === 'production';
    const isPreviewPage = window.location.pathname === '/student-dashboard/preview';
    
    // In production, redirect to preview unless user has subscription or is already on preview page
    if (isProduction && !hasSubscription && !isPreviewPage) {
      setShouldRedirect(true);
      // Use a timeout to prevent rapid navigation
      setTimeout(() => {
        router.push('/student-dashboard/preview');
      }, 100);
      return;
    }
  }, [hasSubscription, isLoading, router, isHydrated]);

  // Show loading while checking redirect or during auth loading
  if (shouldRedirect || isLoading || !isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  

  
  return (
    <div className={`min-h-screen bg-gray-50 ${montserrat.variable}`}>
      {/* Page Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Preview Mode Banner for Teachers */}
        {isHydrated && user?.user_metadata?.role === 'teacher' && new URLSearchParams(window.location.search).get('preview') === 'true' && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-5 h-5 text-yellow-600 mr-2">👨‍🏫</div>
                <div>
                  <p className="font-medium">Teacher Preview Mode</p>
                  <p className="text-sm">You are viewing this assignment as your students would see it.</p>
                </div>
              </div>
              <Link 
                href="/dashboard/assignments"
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Back to Teacher Dashboard
              </Link>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
} 
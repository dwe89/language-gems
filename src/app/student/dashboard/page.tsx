'use client';

import { useAuth } from '../../../components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StudentDashboardRedirect() {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not authenticated, redirect to student portal login
        router.push('/');
      } else if (userRole === 'student') {
        // Student user, redirect to actual student dashboard
        router.push('/student-dashboard');
      } else {
        // Non-student user, redirect to main site
        const mainSiteUrl = process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/account'
          : 'https://languagegems.com/account';
        window.location.href = mainSiteUrl;
      }
    }
  }, [user, userRole, isLoading, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-xl">Taking you to your dashboard...</p>
      </div>
    </div>
  );
}

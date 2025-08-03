'use client';

import Link from 'next/link';
import { useAuth } from './auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface SmartAuthButtonsProps {
  className?: string;
  variant?: 'default' | 'mobile';
}

export default function SmartAuthButtons({ className = '', variant = 'default' }: SmartAuthButtonsProps) {
  const { user, userRole, isLoading } = useAuth();
  const router = useRouter();

  // Smart redirect based on user role
  const handleDashboardClick = () => {
    if (!user) return;
    
    if (userRole === 'student') {
      router.push('/student-dashboard');
    } else if (userRole === 'teacher' || userRole === 'admin') {
      router.push('/dashboard');
    } else {
      // Fallback for users without defined roles
      router.push('/account');
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="animate-pulse bg-gray-300 rounded-full h-10 w-24"></div>
      </div>
    );
  }

  if (user) {
    if (variant === 'mobile') {
      return (
        <div className={className}>
          <button
            onClick={handleDashboardClick}
            className="block py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full font-bold transition-all duration-200 shadow-lg text-center mb-3 w-full"
          >
            Go to Dashboard
          </button>
        </div>
      );
    }

    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <button
          onClick={handleDashboardClick}
          className="py-2 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Dashboard
        </button>
      </div>
    );
  }

  // Not authenticated - show login/signup
  if (variant === 'mobile') {
    return (
      <div className={className}>
        <Link
          href="/auth/login"
          className="block text-white hover:text-yellow-200 transition-colors mb-3"
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="block py-2 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-900 rounded-full font-bold transition-colors text-center"
        >
          Start Now
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Link
        href="/auth/login"
        className="py-2 px-4 text-white hover:text-yellow-200 transition-colors"
      >
        Login
      </Link>
      <Link
        href="/auth/signup"
        className="py-2 px-6 bg-yellow-400 hover:bg-yellow-300 text-blue-900 rounded-full font-bold transition-colors"
      >
        Start Now
      </Link>
    </div>
  );
}

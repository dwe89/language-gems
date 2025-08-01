'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/auth/AuthProvider';
import { getFeatureFlags } from '../../lib/featureFlags';
import TeacherNavigation from '../../components/TeacherNavigation';
import { supabaseBrowser } from '../../components/auth/AuthProvider';
import { Crown, Lock, Zap } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hasSubscription, isLoading } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Check if we should redirect to preview in production
  useEffect(() => {
    if (!isLoading && user) {
      const flags = getFeatureFlags(user.email);
      const isProduction = process.env.NODE_ENV === 'production';
      const isPreviewPage = window.location.pathname === '/dashboard/preview';
      
      // In production, redirect to preview unless user has subscription, admin access, or is already on preview page
      if (isProduction && !hasSubscription && !flags.customLessons && !isPreviewPage) {
        setShouldRedirect(true);
        router.push('/dashboard/preview');
        return;
      }
    }
  }, [hasSubscription, isLoading, user, router]);

  // Show loading while checking redirect
  if (shouldRedirect || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user, don't render anything - middleware will redirect
  if (!user) {
    return null;
  }

  // Show upgrade banner for free users
  const UpgradeBanner = () => {
    if (hasSubscription || isLoading) return null;

    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">
                You're using the free version of LanguageGems
              </span>
            </div>
            <Link
              href="/account/upgrade"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-full text-sm font-medium transition-colors flex items-center"
            >
              <Zap className="h-4 w-4 mr-1" />
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
      </Head>
      <TeacherNavigation>
        <UpgradeBanner />
        {!hasSubscription && !isLoading && (
          <div className="bg-slate-100 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center text-sm text-slate-600">
                <Lock className="h-4 w-4 mr-2" />
                <span>Some features are locked. </span>
                <Link
                  href="/account/upgrade"
                  className="text-purple-600 hover:text-purple-700 font-medium ml-1"
                >
                  Upgrade to unlock full access →
                </Link>
              </div>
            </div>
          </div>
        )}
        {children}
      </TeacherNavigation>
    </>
  );
}
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Sparkles, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import { useDemoAuth } from '../auth/DemoAuthProvider';

interface DemoBannerProps {
  message?: string;
  showStats?: boolean;
  variant?: 'compact' | 'full' | 'floating';
  className?: string;
  onSignupClick?: () => void;
}

export default function DemoBanner({
  message,
  showStats = false,
  variant = 'compact',
  className = '',
  onSignupClick
}: DemoBannerProps) {
  const { isDemo, isAdmin } = useDemoAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show banner for authenticated users, admin, or if dismissed
  if (!isDemo || isAdmin || isDismissed) {
    return null;
  }

  const defaultMessage = "Open Beta: Exploring vocabulary in Spanish, French & German. Sign up to save your progress!";

  // Check if banner was previously dismissed
  React.useEffect(() => {
    const dismissed = localStorage.getItem('demo-banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleSignupClick = () => {
    if (onSignupClick) {
      onSignupClick();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Store in localStorage to persist dismissal
    localStorage.setItem('demo-banner-dismissed', 'true');
  };

  const renderCompactBanner = () => (
    <div className={`bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 rounded-full p-2">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-blue-800 font-medium text-sm">
              {message || defaultMessage}
            </p>
            {showStats && (
              <p className="text-blue-600 text-xs mt-1">
                Beta Access: All categories and languages unlocked
              </p>
            )}
          </div>
        </div>
        {onSignupClick ? (
          <button
            onClick={handleSignupClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            Sign Up
          </button>
        ) : (
          <Link
            href="/auth/signup"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <span>Sign Up</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );

  const renderFullBanner = () => (
    <div className={`bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 rounded-xl shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white bg-opacity-20 rounded-full p-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">Welcome to Language Gems Demo!</h3>
            <p className="text-blue-100 mb-2">
              {message || "Welcome to the Open Beta! Enjoy full access to our vocabulary collection. Sign up to save your progress!"}
            </p>
            {showStats && (
              <div className="flex items-center space-x-4 text-sm text-blue-200">
                <span>1 category available</span>
                <span>3 languages</span>
                <span>25 words per session</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          {onSignupClick ? (
            <button
              onClick={handleSignupClick}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Crown className="h-5 w-5" />
              <span>Unlock Full Access</span>
            </button>
          ) : (
            <Link
              href="/auth/signup"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Crown className="h-5 w-5" />
              <span>Unlock Full Access</span>
            </Link>
          )}
          <Link
            href="/auth/login"
            className="text-white hover:text-blue-200 text-sm text-center transition-colors"
          >
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );

  const renderFloatingBanner = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed bottom-4 right-4 bg-white shadow-xl rounded-lg p-4 border-l-4 border-orange-500 max-w-sm z-50 ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
          <Star className="h-4 w-4 text-orange-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm">Enjoying the demo?</h4>
          <p className="text-gray-600 text-xs mt-1">
            Sign up to access 14+ categories and all languages!
          </p>
          <div className="flex space-x-2 mt-3">
            {onSignupClick ? (
              <button
                onClick={handleSignupClick}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                Sign Up Free
              </button>
            ) : (
              <Link
                href="/auth/signup"
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                Sign Up Free
              </Link>
            )}
            <button
              onClick={() => {
                // Hide the floating banner (you might want to store this in localStorage)
                const banner = document.querySelector('[data-demo-banner="floating"]');
                if (banner) {
                  banner.remove();
                }
              }}
              className="text-gray-400 hover:text-gray-600 text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  switch (variant) {
    case 'full':
      return renderFullBanner();
    case 'floating':
      return <div data-demo-banner="floating">{renderFloatingBanner()}</div>;
    default:
      return renderCompactBanner();
  }
}

// Specialized demo banners for specific contexts
export function GameDemoBanner({ gameName }: { gameName: string }) {
  return (
    <DemoBanner
      message={`Open Beta: Playing ${gameName}. Sign up to save your progress and compete on leaderboards!`}
      showStats={true}
      variant="compact"
    />
  );
}

export function CategoryDemoBanner() {
  return (
    <DemoBanner
      message="Open Beta: All categories unlocked! Sign up to save your progress."
      variant="compact"
    />
  );
}

export function VocabularyDemoBanner() {
  return (
    <DemoBanner
      message="Open Beta: Full vocabulary access enabled. Sign up to track your learning journey!"
      showStats={true}
      variant="compact"
    />
  );
}

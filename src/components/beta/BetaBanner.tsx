'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ArrowRight,
  Users,
  Gamepad2,
  BookOpen
} from 'lucide-react';
import { useFeatureFlags } from '../../lib/feature-flags';

interface BetaBannerProps {
  message?: string;
  showStats?: boolean;
  variant?: 'top' | 'hero' | 'inline';
  dismissible?: boolean;
  className?: string;
  onSignupClick?: () => void;
}

export default function BetaBanner({
  message,
  showStats = false,
  variant = 'top',
  dismissible = true,
  className = '',
  onSignupClick
}: BetaBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const { isBetaLaunch, betaConfig } = useFeatureFlags();

  // Check if banner was previously dismissed
  React.useEffect(() => {
    const dismissed = localStorage.getItem('beta-banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    // Store in localStorage to persist dismissal
    localStorage.setItem('beta-banner-dismissed', 'true');
  };

  // Early return AFTER all hooks have been called
  if (!isBetaLaunch || isDismissed) {
    return null;
  }

  if (variant === 'hero') {
    return (
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Beta Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold text-sm">{betaConfig.betaBadge}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {betaConfig.heroTagline}
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Be one of the first educators in the UK to bring our new suite of interactive language games to your classroom student engagement.
            </p>

            {/* Feature Highlights */}
            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Gamepad2 className="h-8 w-8 text-green-300" />
                <div className="text-left">
                  <div className="font-semibold">11+ Interactive Games</div>
                  <div className="text-sm text-white/80">Ready to play now</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <BookOpen className="h-8 w-8 text-blue-300" />
                <div className="text-left">
                  <div className="font-semibold">Complete Assessments</div>
                  <div className="text-sm text-white/80">AQA & Edexcel ready</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Users className="h-8 w-8 text-purple-300" />
                <div className="text-left">
                  <div className="font-semibold">Teacher & Student Access</div>
                  <div className="text-sm text-white/80">Full authentication</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/signup"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                {betaConfig.ctaText}
                <ArrowRight className="h-5 w-5" />
              </a>

              <a
                href="/games"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 transition-colors border border-white/30"
              >
                Try Games Now
                <Gamepad2 className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Sparkles className="h-6 w-6 text-purple-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                {betaConfig.betaBadge}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              You're Using the Beta Version
            </h3>

            <p className="text-gray-700 mb-4">
              All games and assessments are fully functional. Advanced dashboard features are coming soon!
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/games"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Explore Games
                <ArrowRight className="h-4 w-4" />
              </a>

              <button className="text-purple-600 hover:text-purple-800 font-medium">
                What's Coming Soon?
              </button>
            </div>
          </div>

          {dismissible && (
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-purple-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default 'top' variant
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white relative z-[200]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-yellow-300" />
            <span className="font-semibold">
              {betaConfig.betaBadge} {betaConfig.topBannerText || "- All Premium features are FREE until February Half-Term 2026!"}
            </span>
            <span className="hidden sm:inline text-white/90">
              - No credit card required.
            </span>
          </div>

          <div className="flex items-center gap-4">
            {onSignupClick ? (
              <button
                onClick={onSignupClick}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                {betaConfig.ctaText}
              </button>
            ) : (
              <a
                href="/auth/signup"
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                {betaConfig.ctaText}
              </a>
            )}

            {dismissible && (
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

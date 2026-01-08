'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../../components/auth/AuthProvider';

export default function StudentGameRedirect() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [countdown, setCountdown] = useState(3);
  const gameId = params?.gameId as string;

  useEffect(() => {
    if (isLoading || !gameId) return;

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameId, isLoading]);

  const handleRedirect = async () => {
    // Get all search parameters
    const urlParams = new URLSearchParams();
    searchParams?.forEach((value, key) => {
      urlParams.set(key, value);
    });

    // Construct the target game URL
    const gameUrl = process.env.NODE_ENV === 'development'
      ? `http://localhost:3000/activities/${gameId}`
      : `https://languagegems.com/activities/${gameId}`;

    const targetUrl = `${gameUrl}?${urlParams.toString()}`;

    // Direct navigation to game - no auth bridge needed
    console.log('🎮 Navigating directly to game:', targetUrl);
    window.location.href = targetUrl;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4">
            <Loader2 className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
          <p className="text-blue-100">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <ExternalLink className="h-16 w-16 text-white mx-auto mb-6" />

          <h1 className="text-3xl font-bold text-white mb-4">Launching {gameId}</h1>

          {user ? (
            <div className="mb-6">
              <p className="text-blue-100 mb-2">Welcome back, {user.email}!</p>
              <p className="text-blue-200 text-sm">Your progress will be saved automatically.</p>
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <AlertCircle className="h-5 w-5 text-yellow-300" />
                <p className="text-yellow-100">Open Beta</p>
              </div>
              <p className="text-blue-200 text-sm">Progress won't be saved. Log in to track your learning!</p>
            </div>
          )}

          <div className="mb-6">
            <div className="text-4xl font-bold text-white mb-2">{countdown}</div>
            <p className="text-blue-100">Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
          </div>

          <button
            onClick={handleRedirect}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Launch Now
          </button>
        </div>
      </div>
    </div>
  );
}
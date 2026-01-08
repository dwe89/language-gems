'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function StudentVocabMaster() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const handleRedirect = async () => {
      if (redirecting) return;
      setRedirecting(true);

      // Check if we have specific parameters, otherwise redirect to game selection
      const hasParams = searchParams && Array.from(searchParams.keys()).length > 0;

      if (!hasParams) {
        // No specific parameters, go to game selection
        router.replace('/student-dashboard/activities?game=vocab-master');
        return;
      }

      // We have parameters, redirect to main domain VocabMaster
      const urlParams = new URLSearchParams();
      searchParams?.forEach((value, key) => {
        urlParams.set(key, value);
      });

      // Construct the target VocabMaster URL
      const gameUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/games/vocab-master'
        : 'https://languagegems.com/games/vocab-master';

      const targetUrl = `${gameUrl}?${urlParams.toString()}`;

      // Direct navigation to game - no auth bridge needed
      window.location.href = targetUrl;
    };

    handleRedirect();
  }, [router, searchParams, session, isLoading, redirecting]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-6">
            <Loader2 className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Loading...</h1>
          <p className="text-blue-100 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-6">
          <Loader2 className="h-16 w-16" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Loading VocabMaster...</h1>
        <p className="text-blue-100 text-lg">Preparing your vocabulary adventure...</p>
      </div>
    </div>
  );
}

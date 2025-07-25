'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VocabMasterRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new vocabulary-mining path
    router.replace('/games/vocabulary-mining');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="text-4xl mb-4">⛏️</div>
        <h1 className="text-2xl font-bold mb-2">Redirecting to Vocabulary Mining...</h1>
        <p className="text-blue-200">VocabMaster is now called Vocabulary Mining!</p>
      </div>
    </div>
  );
}

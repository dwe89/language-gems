'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AQAReadingHigherPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new URL structure
    router.replace('/aqa-reading-test/spanish/higher');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h2>
        <p className="text-gray-600">
          Taking you to the updated assessment page.
        </p>
      </div>
    </div>
  );
}

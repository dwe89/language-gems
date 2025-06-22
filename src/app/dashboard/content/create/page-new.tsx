'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContentCreateRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the vocabulary creation page
    router.replace('/dashboard/vocabulary/create');
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    </div>
  );
}

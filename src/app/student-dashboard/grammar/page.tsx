'use client';


import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';


export default function StudentGrammarPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if on the exact base path (not subroutes)
    if (pathname === '/student-dashboard/grammar') {
      router.push('/grammar');
    }
  }, [router, pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Redirecting to Grammar Hub</h2>
        <p className="text-purple-200">Taking you to the main grammar learning area...</p>
      </div>
    </div>
  );
}

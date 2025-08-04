'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AssessmentsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to assessments page - this should work with middleware
    router.replace('/assessments');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Loading Assessments...</h1>
        <p className="text-indigo-200">Redirecting to assessments page...</p>
      </div>
    </div>
  );
}
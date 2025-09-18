'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DailyChallengeRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the learner dashboard challenges page
    router.replace('/learner-dashboard/challenges');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to challenges...</p>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../components/auth/AuthProvider';

export default function HangmanAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const assignmentId = params.assignmentId as string;

  // Redirect to main hangman page with assignment parameters
  React.useEffect(() => {
    if (assignmentId) {
      router.replace(`/games/hangman?assignment=${assignmentId}&mode=assignment`);
    }
  }, [assignmentId, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Loading Hangman...</p>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../components/auth/AuthProvider';

export default function LavaTempleWordRestoreAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const assignmentId = params.assignmentId as string;

  // Redirect to main lava-temple-word-restore page with assignment parameters
  React.useEffect(() => {
    if (assignmentId) {
      router.replace(`/games/lava-temple-word-restore?assignment=${assignmentId}&mode=assignment`);
    }
  }, [assignmentId, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-800 via-orange-700 to-yellow-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-orange-700 to-yellow-600 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg">Loading Lava Temple...</p>
      </div>
    </div>
  );
}

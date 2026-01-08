'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import DetectiveListeningAssignmentWrapper from '../../components/DetectiveListeningAssignmentWrapper';
import { useAuth } from '../../../../../components/auth/AuthProvider';

export default function DetectiveListeningAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const assignmentId = params.assignmentId as string;

  const handleAssignmentComplete = (progress: any) => {
    console.log('Detective Listening assignment completed:', progress);
    // Show completion message and redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 2000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/games/detective-listening');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DetectiveListeningAssignmentWrapper
      assignmentId={assignmentId}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    />
  );
}

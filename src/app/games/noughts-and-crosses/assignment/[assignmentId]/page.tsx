'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import NoughtsAndCrossesAssignmentWrapper from '../../components/NoughtsAssignmentWrapper';
import { useAuth } from '../../../../../components/auth/AuthProvider';

export default function NoughtsAndCrossesAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const assignmentId = params.assignmentId as string;

  const handleAssignmentComplete = (progress: any) => {
    console.log('Noughts & Crosses assignment completed:', progress);
    // Could show completion modal or redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 2000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/games/noughts-and-crosses');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <NoughtsAndCrossesAssignmentWrapper
      assignmentId={assignmentId}
      studentId={user.id}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    />
  );
}

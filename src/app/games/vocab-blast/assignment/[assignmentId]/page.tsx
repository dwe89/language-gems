'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import VocabBlastAssignmentWrapper from '../../components/VocabBlastAssignmentWrapper';
import { useAuth } from '../../../../../components/auth/AuthProvider';

export default function VocabBlastAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const assignmentId = params.assignmentId as string;

  const handleAssignmentComplete = (progress: any) => {
    console.log('Vocab Blast assignment completed:', progress);
    // Could show completion modal or redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 2000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/games/vocab-blast');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <VocabBlastAssignmentWrapper
      assignmentId={assignmentId}
      studentId={user.id}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    />
  );
}

'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import VocabMasterAssignmentWrapper from '../../components/VocabMasterAssignmentWrapper';
import { useAuth } from '../../../../components/auth/AuthProvider';

export default function VocabMasterAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const assignmentId = params.assignmentId as string;

  const handleAssignmentComplete = () => {
    console.log('VocabMaster assignment completed');
    // Show completion message and redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 2000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/games/vocab-master');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <VocabMasterAssignmentWrapper
      assignmentId={assignmentId}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    />
  );
}

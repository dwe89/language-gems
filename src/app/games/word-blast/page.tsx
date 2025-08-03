'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import WordBlastGameWrapper from './components/WordBlastGameWrapper';

export default function WordBlastPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment') || searchParams?.get('assignmentId') || null;
  const mode = searchParams?.get('mode');

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    // Import the assignment wrapper dynamically
    const WordBlastAssignmentWrapper = React.lazy(() => import('./components/WordBlastAssignmentWrapper'));

    return (
      <React.Suspense fallback={<div>Loading assignment...</div>}>
        <WordBlastAssignmentWrapper assignmentId={assignmentId} />
      </React.Suspense>
    );
  }

  // Handle back to menu
  const handleBackToMenu = () => {
    window.history.back();
  };

  // Handle game completion
  const handleGameComplete = (results: any) => {
    console.log('Word Blast game completed with results:', results);
  };

  return (
    <WordBlastGameWrapper
      onBackToMenu={handleBackToMenu}
      onGameComplete={handleGameComplete}
      assignmentMode={!!(assignmentId && mode === 'assignment')}
      assignmentConfig={assignmentId ? { assignmentId } : undefined}
      userId={user?.id}
    />
  );
}

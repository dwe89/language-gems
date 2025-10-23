'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function FourSkillsPageContent() {
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // Four Skills functionality has been removed
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
      <div className="text-white text-center">
        <h1 className="text-2xl font-bold mb-4">Four Skills Assessment</h1>
        <p className="text-blue-200">This assessment is no longer available.</p>
      </div>
    </div>
  );
}

export default function FourSkillsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading assessment...</p>
        </div>
      </div>
    }>
      <FourSkillsPageContent />
    </Suspense>
  );
}

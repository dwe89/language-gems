'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AQAListeningAssessment from '../../../components/assessments/AQAListeningAssessment';

function AQAListeningPageContent() {
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // If assignment mode was used previously, the wrapper was removed. Show fallback message.
  if (assignmentId && mode === 'assignment') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="text-center text-white max-w-lg p-8">
          <h2 className="text-2xl font-semibold mb-2">Assignment mode unavailable</h2>
          <p className="opacity-90">This assessment was opened in assignment mode, but the assignment wrapper component is not available. Please open the standalone assessment or restore the assignment component.</p>
        </div>
      </div>
    );
  }

  // Otherwise render standalone assessment
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">AQA Listening Assessment</h1>
          <p className="text-blue-200 text-lg">Official AQA-style listening assessment with audio materials</p>
        </div>
        
        <AQAListeningAssessment />
      </div>
    </div>
  );
}

export default function AQAListeningPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading assessment...</p>
        </div>
      </div>
    }>
      <AQAListeningPageContent />
    </Suspense>
  );
}

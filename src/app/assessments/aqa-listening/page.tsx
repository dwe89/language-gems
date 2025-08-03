'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AQAListeningAssessment from '../../../components/assessments/AQAListeningAssessment';
import AQAAssignmentWrapper from '../../../components/assessments/AQAAssignmentWrapper';

function AQAListeningPageContent() {
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return <AQAAssignmentWrapper assignmentId={assignmentId} assessmentType="listening" />;
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

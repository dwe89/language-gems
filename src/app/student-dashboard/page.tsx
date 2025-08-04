'use client';

import React, { Suspense } from 'react';
import ModernStudentDashboard from '../../components/student/ModernStudentDashboard';
import '../../styles/student-theme.css';

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 student-font-body">Loading your dashboard...</p>
    </div>
  </div>
);

export default function StudentDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ModernStudentDashboard initialView="home" />
    </Suspense>
  );
}
// Force client-side rendering to avoid build issues with Supabase
export const dynamic = 'force-dynamic';
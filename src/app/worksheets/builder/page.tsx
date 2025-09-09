'use client';

import React from 'react';
import WorksheetBuilder from '@/components/worksheets/WorksheetBuilder';
import { useAuth } from '@/components/auth/AuthProvider';

export default function WorksheetBuilderPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <WorksheetBuilder />
    </div>
  );
}

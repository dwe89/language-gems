'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useUnifiedAuth } from '../../hooks/useUnifiedAuth';
import UnifiedVocabMasterWrapper from './components/UnifiedVocabMasterWrapper';


export default function VocabMasterPage() {
  const searchParams = useSearchParams();
  const { isLoading } = useUnifiedAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading VocabMaster...</p>
        </div>
      </div>
    );
  }



  // If user IS logged in, show functional dashboard
  // Convert URLSearchParams to plain object for the wrapper
  const searchParamsObj = {
    lang: searchParams?.get('lang') || undefined,
    level: searchParams?.get('level') || undefined,
    cat: searchParams?.get('cat') || undefined,
    subcat: searchParams?.get('subcat') || undefined,
    theme: searchParams?.get('theme') || undefined,
    assignment: searchParams?.get('assignment') || undefined,
    // KS4-specific parameters
    examBoard: searchParams?.get('examBoard') || undefined,
    tier: searchParams?.get('tier') || undefined,
  };

  return <UnifiedVocabMasterWrapper searchParams={searchParamsObj} />;
}



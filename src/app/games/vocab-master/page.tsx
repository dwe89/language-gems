'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import UnifiedVocabMasterWrapper from './components/UnifiedVocabMasterWrapper';

export default function VocabMasterPage() {
  const searchParams = useSearchParams();

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



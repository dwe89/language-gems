'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import UnifiedVocabMasterWrapper from '../games/vocab-master/components/UnifiedVocabMasterWrapper';

export default function VocabMasterStandalonePage() {
  const searchParams = useSearchParams();
  
  // Convert URLSearchParams to plain object for the wrapper
  const searchParamsObj = {
    lang: searchParams?.get('lang') || undefined,
    level: searchParams?.get('level') || undefined,
    cat: searchParams?.get('cat') || undefined,
    subcat: searchParams?.get('subcat') || undefined,
    theme: searchParams?.get('theme') || undefined,
    assignment: searchParams?.get('assignment') || undefined,
    // Flag to indicate this is standalone access
    standalone: 'true'
  };

  return <UnifiedVocabMasterWrapper searchParams={searchParamsObj} />;
}

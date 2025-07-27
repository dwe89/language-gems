"use client";

import { useSearchParams } from 'next/navigation';
import VocabularyMiningLauncher from './components/VocabularyMiningLauncher';
import VocabularyMiningAssignmentWrapper from './components/VocabMiningAssignmentWrapper';

export default function VocabularyMiningPage() {
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');
  const isPreview = searchParams?.get('preview') === 'true';

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return (
      <VocabularyMiningAssignmentWrapper
        assignmentId={assignmentId}
        isPreview={isPreview}
      />
    );
  }

  // Otherwise render normal game
  return <VocabularyMiningLauncher />;
}

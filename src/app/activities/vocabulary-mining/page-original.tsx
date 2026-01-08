"use client";

import { useSearchParams } from 'next/navigation';
import VocabularyMiningLauncher from './components/VocabularyMiningLauncher';
import VocabularyMiningAssignmentWrapper from './components/VocabMiningAssignmentWrapper';
import SEOWrapper from '../../../components/seo/SEOWrapper';
import { generateGameStructuredData } from '../../../components/seo/GamePageSEO';

export default function VocabularyMiningPage() {
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');
  const isPreview = searchParams?.get('preview') === 'true';

  // Generate structured data for the game
  const structuredData = generateGameStructuredData('vocabulary-mining');
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Games', url: '/games' },
    { name: 'Vocabulary Mining', url: '/games/vocabulary-mining' }
  ];

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return (
      <SEOWrapper structuredData={structuredData} breadcrumbs={breadcrumbs}>
        <VocabularyMiningAssignmentWrapper
          assignmentId={assignmentId}
          isPreview={isPreview}
        />
      </SEOWrapper>
    );
  }

  // Otherwise render normal game
  return (
    <SEOWrapper structuredData={structuredData} breadcrumbs={breadcrumbs}>
      <VocabularyMiningLauncher />
    </SEOWrapper>
  );
}

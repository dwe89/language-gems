'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function FrenchAdjectivesPlacementQuizPage() {
  return (
    <GrammarQuizPage
      language="french"
      category="adjectives"
      topic="placement"
      topicTitle="Adjective Placement"
      backUrl="/grammar/french/adjectives/placement"
    />
  );
}

'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function FrenchAdjectivesComparisonQuizPage() {
  return (
    <GrammarQuizPage
      language="french"
      category="adjectives"
      topic="comparison"
      topicTitle="Comparison"
      backUrl="/grammar/french/adjectives/comparison"
    />
  );
}

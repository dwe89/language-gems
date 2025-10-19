'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function SpanishAdjectivesComparisonQuizPage() {
  return (
    <GrammarQuizPage
      language="spanish"
      category="adjectives"
      topic="comparison"
      topicTitle="Comparison"
      backUrl="/grammar/spanish/adjectives/comparison"
    />
  );
}

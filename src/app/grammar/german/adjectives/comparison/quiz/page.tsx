'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function GermanAdjectivesComparisonQuizPage() {
  return (
    <GrammarQuizPage
      language="german"
      category="adjectives"
      topic="comparison"
      topicTitle="Comparison"
      backUrl="/grammar/german/adjectives/comparison"
    />
  );
}

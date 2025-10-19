'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function SpanishArticlesDefiniteQuizPage() {
  return (
    <GrammarQuizPage
      language="spanish"
      category="articles"
      topic="definite"
      topicTitle="Definite Articles"
      backUrl="/grammar/spanish/articles/definite"
    />
  );
}

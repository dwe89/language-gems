'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function SpanishNounsPluralsQuizPage() {
  return (
    <GrammarQuizPage
      language="spanish"
      category="nouns"
      topic="plurals"
      topicTitle="Noun Plurals"
      backUrl="/grammar/spanish/nouns/plurals"
    />
  );
}

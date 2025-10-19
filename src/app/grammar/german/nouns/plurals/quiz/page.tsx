'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function GermanNounsPluralsQuizPage() {
  return (
    <GrammarQuizPage
      language="german"
      category="nouns"
      topic="plurals"
      topicTitle="Noun Plurals"
      backUrl="/grammar/german/nouns/plurals"
    />
  );
}

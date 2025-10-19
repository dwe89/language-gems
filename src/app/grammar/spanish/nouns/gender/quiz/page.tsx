'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function SpanishNounsGenderQuizPage() {
  return (
    <GrammarQuizPage
      language="spanish"
      category="nouns"
      topic="gender"
      topicTitle="Noun Gender"
      backUrl="/grammar/spanish/nouns/gender"
    />
  );
}

'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function SpanishAdjectivesAgreementQuizPage() {
  return (
    <GrammarQuizPage
      language="spanish"
      category="adjectives"
      topic="agreement"
      topicTitle="Adjective Agreement"
      backUrl="/grammar/spanish/adjectives/agreement"
    />
  );
}

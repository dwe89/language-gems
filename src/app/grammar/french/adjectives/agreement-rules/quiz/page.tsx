'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function FrenchAdjectivesAgreementRulesQuizPage() {
  return (
    <GrammarQuizPage
      language="french"
      category="adjectives"
      topic="agreement-rules"
      topicTitle="Adjective Agreement"
      backUrl="/grammar/french/adjectives/agreement-rules"
    />
  );
}

'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function FrenchVerbsImparfaitQuizPage() {
  return (
    <GrammarQuizPage
      language="french"
      category="verbs"
      topic="imparfait"
      topicTitle="Imparfait"
      backUrl="/grammar/french/verbs/imparfait"
    />
  );
}

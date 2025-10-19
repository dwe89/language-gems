'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function FrenchVerbsPasseComposeQuizPage() {
  return (
    <GrammarQuizPage
      language="french"
      category="verbs"
      topic="passe-compose"
      topicTitle="Passé Composé"
      backUrl="/grammar/french/verbs/passe-compose"
    />
  );
}

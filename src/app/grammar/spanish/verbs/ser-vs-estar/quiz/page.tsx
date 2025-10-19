'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function SpanishVerbsSerVsEstarQuizPage() {
  return (
    <GrammarQuizPage
      language="spanish"
      category="verbs"
      topic="ser-vs-estar"
      topicTitle="Ser vs Estar"
      backUrl="/grammar/spanish/verbs/ser-vs-estar"
    />
  );
}

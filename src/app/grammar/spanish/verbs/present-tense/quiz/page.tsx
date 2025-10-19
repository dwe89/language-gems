'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function SpanishVerbsPresentTenseQuizPage() {
  return (
    <GrammarQuizPage
      language="spanish"
      category="verbs"
      topic="present-tense"
      topicTitle="Present Tense"
      backUrl="/grammar/spanish/verbs/present-tense"
    />
  );
}

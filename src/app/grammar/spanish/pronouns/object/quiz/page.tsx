'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function SpanishPronounsObjectQuizPage() {
  return (
    <GrammarQuizPage
      language="spanish"
      category="pronouns"
      topic="object"
      topicTitle="Object Pronouns"
      backUrl="/grammar/spanish/pronouns/object"
    />
  );
}

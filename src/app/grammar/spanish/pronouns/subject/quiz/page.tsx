'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function SpanishPronounsSubjectQuizPage() {
  return (
    <GrammarQuizPage
      language="spanish"
      category="pronouns"
      topic="subject"
      topicTitle="Subject Pronouns"
      backUrl="/grammar/spanish/pronouns/subject"
    />
  );
}

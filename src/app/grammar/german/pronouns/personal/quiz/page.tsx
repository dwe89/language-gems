'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function GermanPronounsPersonalQuizPage() {
  return (
    <GrammarQuizPage
      language="german"
      category="pronouns"
      topic="personal"
      topicTitle="Personal Pronouns"
      backUrl="/grammar/german/pronouns/personal"
    />
  );
}

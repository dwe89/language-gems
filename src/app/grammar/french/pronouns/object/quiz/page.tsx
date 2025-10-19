'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function FrenchPronounsObjectQuizPage() {
  return (
    <GrammarQuizPage
      language="french"
      category="pronouns"
      topic="object"
      topicTitle="Object Pronouns"
      backUrl="/grammar/french/pronouns/object"
    />
  );
}

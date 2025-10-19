'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function FrenchPronounsSubjectQuizPage() {
  return (
    <GrammarQuizPage
      language="french"
      category="pronouns"
      topic="subject"
      topicTitle="Subject Pronouns"
      backUrl="/grammar/french/pronouns/subject"
    />
  );
}

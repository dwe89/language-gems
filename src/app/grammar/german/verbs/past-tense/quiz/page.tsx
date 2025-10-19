'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function GermanVerbsPastTenseQuizPage() {
  return (
    <GrammarQuizPage
      language="german"
      category="verbs"
      topic="past-tense"
      topicTitle="Past Tense"
      backUrl="/grammar/german/verbs/past-tense"
    />
  );
}

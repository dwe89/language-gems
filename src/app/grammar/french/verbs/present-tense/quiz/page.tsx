'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function FrenchVerbsPresentTenseQuizPage() {
  return (
    <GrammarQuizPage
      language="french"
      category="verbs"
      topic="present-tense"
      topicTitle="Present Tense"
      backUrl="/grammar/french/verbs/present-tense"
    />
  );
}

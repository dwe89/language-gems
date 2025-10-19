'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function GermanCasesDativeQuizPage() {
  return (
    <GrammarQuizPage
      language="german"
      category="cases"
      topic="dative"
      topicTitle="Dative Case"
      backUrl="/grammar/german/cases/dative"
    />
  );
}

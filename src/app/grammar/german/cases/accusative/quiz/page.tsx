'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function GermanCasesAccusativeQuizPage() {
  return (
    <GrammarQuizPage
      language="german"
      category="cases"
      topic="accusative"
      topicTitle="Accusative Case"
      backUrl="/grammar/german/cases/accusative"
    />
  );
}

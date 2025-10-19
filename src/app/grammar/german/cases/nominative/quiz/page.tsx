'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function GermanCasesNominativeQuizPage() {
  return (
    <GrammarQuizPage
      language="german"
      category="cases"
      topic="nominative"
      topicTitle="Nominative Case"
      backUrl="/grammar/german/cases/nominative"
    />
  );
}

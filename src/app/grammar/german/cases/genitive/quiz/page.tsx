'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function GermanCasesGenitiveQuizPage() {
  return (
    <GrammarQuizPage
      language="german"
      category="cases"
      topic="genitive"
      topicTitle="Genitive Case"
      backUrl="/grammar/german/cases/genitive"
    />
  );
}

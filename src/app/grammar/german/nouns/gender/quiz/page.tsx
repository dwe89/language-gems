'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function GermanNounsGenderQuizPage() {
  return (
    <GrammarQuizPage
      language="german"
      category="nouns"
      topic="gender"
      topicTitle="Noun Gender"
      backUrl="/grammar/german/nouns/gender"
    />
  );
}

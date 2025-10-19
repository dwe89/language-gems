'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function FrenchNounsGenderQuizPage() {
  return (
    <GrammarQuizPage
      language="french"
      category="nouns"
      topic="gender"
      topicTitle="Noun Gender"
      backUrl="/grammar/french/nouns/gender"
    />
  );
}

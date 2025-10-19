'use client';

import GrammarQuizPage from '@/components/grammar/GrammarQuizPage';

export default function FrenchNounsArticlesQuizPage() {
  return (
    <GrammarQuizPage
      language="french"
      category="nouns"
      topic="articles"
      topicTitle="Articles"
      backUrl="/grammar/french/nouns/articles"
    />
  );
}

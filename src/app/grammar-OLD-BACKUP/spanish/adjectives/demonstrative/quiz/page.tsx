'use client';

import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';



export default function SpanishDemonstrativeAdjectivesQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="adjectives"
      topic="demonstrative"
      title="Spanish Demonstrative Adjectives Quiz"
      description="Test your knowledge of Spanish demonstrative adjectives"
      backUrl="/grammar/spanish/adjectives/demonstrative"
      lessonUrl="/grammar/spanish/adjectives/demonstrative"
      practiceUrl="/grammar/spanish/adjectives/demonstrative/practice"
    />
  );
}

'use client';

import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';



export default function SpanishDemonstrativeAdjectivesPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="adjectives"
      topic="demonstrative"
      title="Spanish Demonstrative Adjectives Practice"
      description="Practice Spanish demonstrative adjectives with interactive exercises"
      backUrl="/grammar/spanish/adjectives/demonstrative"
      lessonUrl="/grammar/spanish/adjectives/demonstrative"
      quizUrl="/grammar/spanish/adjectives/demonstrative/quiz"
    />
  );
}

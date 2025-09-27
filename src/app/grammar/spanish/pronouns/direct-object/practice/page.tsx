'use client';

import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';



export default function SpanishDirectObjectPronounsPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="pronouns"
      topic="direct-object"
      title="Spanish Direct Object Pronouns Practice"
      description="Practice Spanish direct object pronouns with interactive exercises"
      backUrl="/grammar/spanish/pronouns/direct-object"
      lessonUrl="/grammar/spanish/pronouns/direct-object"
      quizUrl="/grammar/spanish/pronouns/direct-object/quiz"
    />
  );
}

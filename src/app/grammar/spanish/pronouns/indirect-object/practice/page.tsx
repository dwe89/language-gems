'use client';

import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';



export default function SpanishIndirectObjectPronounsPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="pronouns"
      topic="indirect-object"
      title="Spanish Indirect Object Pronouns Practice"
      description="Practice Spanish indirect object pronouns with interactive exercises"
      backUrl="/grammar/spanish/pronouns/indirect-object"
      lessonUrl="/grammar/spanish/pronouns/indirect-object"
      quizUrl="/grammar/spanish/pronouns/indirect-object/quiz"
    />
  );
}

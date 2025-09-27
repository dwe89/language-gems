'use client';

import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';



export default function SpanishReflexivePronounsPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="pronouns"
      topic="reflexive"
      title="Spanish Reflexive Pronouns Practice"
      description="Practice Spanish reflexive pronouns with interactive exercises"
      backUrl="/grammar/spanish/pronouns/reflexive"
      lessonUrl="/grammar/spanish/pronouns/reflexive"
      quizUrl="/grammar/spanish/pronouns/reflexive/quiz"
    />
  );
}

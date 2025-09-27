'use client';

import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';



export default function SpanishPossessivePronounsPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="pronouns"
      topic="possessive"
      title="Spanish Possessive Pronouns Practice"
      description="Practice Spanish possessive pronouns with interactive exercises"
      backUrl="/grammar/spanish/pronouns/possessive"
      lessonUrl="/grammar/spanish/pronouns/possessive"
      quizUrl="/grammar/spanish/pronouns/possessive/quiz"
    />
  );
}

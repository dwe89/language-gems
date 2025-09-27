'use client';

import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';



export default function SpanishPersonalPronounsPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="pronouns"
      topic="personal"
      title="Spanish Personal Pronouns Practice"
      description="Practice Spanish personal pronouns with interactive exercises"
      backUrl="/grammar/spanish/pronouns/personal"
      lessonUrl="/grammar/spanish/pronouns/personal"
      quizUrl="/grammar/spanish/pronouns/personal/quiz"
    />
  );
}

'use client';

import { Metadata } from 'next';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';



export default function SpanishAdjectivePositionPracticePage() {
  return (
    <GrammarPractice
      language="spanish"
      category="adjectives"
      topic="position"
      title="Spanish Adjective Position Practice"
      description="Practice Spanish adjective position with interactive exercises"
      backUrl="/grammar/spanish/adjectives/position"
      lessonUrl="/grammar/spanish/adjectives/position"
      quizUrl="/grammar/spanish/adjectives/position/quiz"
    />
  );
}

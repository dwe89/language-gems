'use client';

import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';



export default function SpanishPossessivePronounsQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="pronouns"
      topic="possessive"
      title="Spanish Possessive Pronouns Quiz"
      description="Test your knowledge of Spanish possessive pronouns"
      backUrl="/grammar/spanish/pronouns/possessive"
      lessonUrl="/grammar/spanish/pronouns/possessive"
      practiceUrl="/grammar/spanish/pronouns/possessive/practice"
    />
  );
}

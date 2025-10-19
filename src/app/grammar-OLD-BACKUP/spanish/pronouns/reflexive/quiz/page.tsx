'use client';

import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';



export default function SpanishReflexivePronounsQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="pronouns"
      topic="reflexive"
      title="Spanish Reflexive Pronouns Quiz"
      description="Test your knowledge of Spanish reflexive pronouns"
      backUrl="/grammar/spanish/pronouns/reflexive"
      lessonUrl="/grammar/spanish/pronouns/reflexive"
      practiceUrl="/grammar/spanish/pronouns/reflexive/practice"
    />
  );
}

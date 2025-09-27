'use client';

import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';



export default function SpanishIndirectObjectPronounsQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="pronouns"
      topic="indirect-object"
      title="Spanish Indirect Object Pronouns Quiz"
      description="Test your knowledge of Spanish indirect object pronouns"
      backUrl="/grammar/spanish/pronouns/indirect-object"
      lessonUrl="/grammar/spanish/pronouns/indirect-object"
      practiceUrl="/grammar/spanish/pronouns/indirect-object/practice"
    />
  );
}

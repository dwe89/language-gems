'use client';

import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';



export default function SpanishDirectObjectPronounsQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="pronouns"
      topic="direct-object"
      title="Spanish Direct Object Pronouns Quiz"
      description="Test your knowledge of Spanish direct object pronouns"
      backUrl="/grammar/spanish/pronouns/direct-object"
      lessonUrl="/grammar/spanish/pronouns/direct-object"
      practiceUrl="/grammar/spanish/pronouns/direct-object/practice"
    />
  );
}

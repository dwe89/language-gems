'use client';

import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';



export default function SpanishPersonalPronounsQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="pronouns"
      topic="personal"
      title="Spanish Personal Pronouns Quiz"
      description="Test your knowledge of Spanish personal pronouns"
      backUrl="/grammar/spanish/pronouns/personal"
      lessonUrl="/grammar/spanish/pronouns/personal"
      practiceUrl="/grammar/spanish/pronouns/personal/practice"
    />
  );
}

'use client';

import { Metadata } from 'next';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';



export default function SpanishAdjectivePositionQuizPage() {
  return (
    <GrammarQuiz
      language="spanish"
      category="adjectives"
      topic="position"
      title="Spanish Adjective Position Quiz"
      description="Test your knowledge of Spanish adjective position"
      backUrl="/grammar/spanish/adjectives/position"
      lessonUrl="/grammar/spanish/adjectives/position"
      practiceUrl="/grammar/spanish/adjectives/position/practice"
    />
  );
}

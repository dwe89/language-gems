'use client';

import { Metadata } from 'next';
import GrammarPractice from '@/components/grammar/GrammarPractice';



// Temporary placeholder data - needs proper conversion
const practiceItems = [
  {
    id: "imperfect-1",
    type: "fill_blank" as const,
    question: "This practice page needs data conversion from the old format.",
    answer: "converted",
    hint: "Please convert the original practiceData to this format",
    difficulty: "beginner" as const,
    category: "imperfect"
  }
];

export default function SpanishImperfectPracticePage() {
  return (
    <GrammarPractice 
      language="spanish"
      category="verbs"
      difficulty="mixed"
      practiceItems={practiceItems}
      onComplete={(score, gemsEarned, timeSpent) => {
        console.log('Practice completed:', { score, gemsEarned, timeSpent });
      }}
      onExit={() => {
        window.history.back();
      }}
      gamified={true}
    />
  );
}
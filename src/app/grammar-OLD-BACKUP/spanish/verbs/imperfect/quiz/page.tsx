'use client';

import { Metadata } from 'next';
import GrammarQuiz from '@/components/grammar/GrammarQuiz';



// Temporary placeholder data - needs proper conversion
const quizData = {
  id: "imperfect-quiz",
  title: "Spanish Imperfect Quiz",
  description: "Test your knowledge of Spanish imperfect",
  difficulty_level: "intermediate",
  estimated_duration: 10,
  questions: [
    {
      id: "imperfect-q1",
      question_text: "This quiz needs data conversion from the old format.",
      question_type: "multiple_choice" as const,
      correct_answer: "converted",
      options: ["needs", "data", "conversion", "converted"],
      explanation: "Please convert the original quiz data to this format",
      difficulty_level: "beginner",
      hint_text: "Convert from old format"
    }
  ]
};

export default function SpanishImperfectQuizPage() {
  return (
    <GrammarQuiz 
      quizData={quizData}
      onComplete={(score, answers, timeSpent) => {
        console.log('Quiz completed:', { score, answers, timeSpent });
      }}
      onExit={() => {
        window.history.back();
      }}
      showHints={true}
      timeLimit={600}
    />
  );
}
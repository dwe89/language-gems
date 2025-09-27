import { Metadata } from 'next';
import GrammarQuiz from '@/components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Irregular Verbs Quiz | LanguageGems',
  description: 'Test your knowledge of Spanish irregular verbs with this comprehensive quiz. Covers high-frequency irregular verb conjugations.',
  keywords: 'Spanish irregular verbs quiz, irregular verb test, Spanish irregular conjugation quiz',
  openGraph: {
    title: 'Spanish Irregular Verbs Quiz | LanguageGems',
    description: 'Test your knowledge of Spanish irregular verbs with this comprehensive quiz. Covers high-frequency irregular verb conjugations.',
    url: 'https://languagegems.com/grammar/spanish/verbs/irregular-verbs/quiz',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/irregular-verbs/quiz',
  },
};

const quizData = {
  id: "irregular-verbs-quiz",
  title: "Spanish Irregular Verbs Quiz",
  description: "Test your mastery of Spanish irregular verb conjugations.",
  difficulty_level: "intermediate",
  estimated_duration: 10,
  questions: [
    {
      id: "q1",
      question_text: "What is the correct present form of 'ser' for 'yo'?",
      question_type: "multiple_choice" as const,
      correct_answer: "soy",
      options: ["so", "soy", "es", "eres"],
      explanation: "Ser is irregular: yo soy (I am)",
      difficulty_level: "intermediate"
    },
    {
      id: "q2",
      question_text: "Choose the correct translation: 'We have a new car.'",
      question_type: "multiple_choice" as const,
      correct_answer: "Nosotros tenemos un coche nuevo.",
      options: [
        "Nosotros habemos un coche nuevo.",
        "Nosotros tenemos un coche nuevo.",
        "Nosotros somos un coche nuevo.",
        "Nosotros estamos un coche nuevo."
      ],
      explanation: "Tener is irregular: tenemos (we have)",
      difficulty_level: "intermediate"
    },
    {
      id: "q3",
      question_text: "What is the present form of 'ir' for 'ella'?",
      question_type: "multiple_choice" as const,
      correct_answer: "va",
      options: ["ire", "va", "voy", "vas"],
      explanation: "Ir is irregular: ella va (she goes)",
      difficulty_level: "intermediate"
    },
    {
      id: "q4",
      question_text: "Complete: 'Yo _____ mi tarea todos los días.'",
      question_type: "multiple_choice" as const,
      correct_answer: "hago",
      options: ["haco", "hago", "hace", "hacemos"],
      explanation: "Hacer is irregular in first person: yo hago (I do/make)",
      difficulty_level: "intermediate"
    },
    {
      id: "q5",
      question_text: "What is the present form of 'venir' for 'tú'?",
      question_type: "multiple_choice" as const,
      correct_answer: "vienes",
      options: ["venes", "vienes", "viene", "vengo"],
      explanation: "Venir is irregular: tú vienes (you come)",
      difficulty_level: "intermediate"
    }
  ]
};

export default function SpanishIrregularVerbsQuizPage() {
  return <GrammarQuiz quizData={quizData} onComplete={() => {}} onExit={() => {}} />;
}
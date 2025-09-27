import { Metadata } from 'next';
import GrammarQuiz from '@/components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Ser vs Estar Quiz | LanguageGems',
  description: 'Test your knowledge of Spanish ser vs estar with this comprehensive quiz. Master permanent vs temporary states.',
  keywords: 'Spanish ser vs estar quiz, ser estar test, Spanish to be quiz',
  openGraph: {
    title: 'Spanish Ser vs Estar Quiz | LanguageGems',
    description: 'Test your knowledge of Spanish ser vs estar with this comprehensive quiz. Master permanent vs temporary states.',
    url: 'https://languagegems.com/grammar/spanish/verbs/ser-vs-estar/quiz',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/ser-vs-estar/quiz',
  },
};

const quizData = {
  id: "ser-vs-estar-quiz",
  title: "Spanish Ser vs Estar Quiz",
  description: "Test your mastery of when to use ser vs estar in Spanish.",
  difficulty_level: "intermediate",
  estimated_duration: 10,
  questions: [
    {
      id: "q1",
      question_text: "Which sentence is correct?",
      question_type: "multiple_choice" as const,
      correct_answer: "Mi madre es profesora.",
      options: [
        "Mi madre está profesora.",
        "Mi madre es profesora.",
        "Mi madre son profesora.",
        "Mi madre están profesora."
      ],
      explanation: "Use SER for professions: es profesora (she is a teacher - permanent characteristic)",
      difficulty_level: "intermediate"
    },
    {
      id: "q2",
      question_text: "Choose the correct translation: 'The children are in the garden.'",
      question_type: "multiple_choice" as const,
      correct_answer: "Los niños están en el jardín.",
      options: [
        "Los niños son en el jardín.",
        "Los niños están en el jardín.",
        "Los niños es en el jardín.",
        "Los niños está en el jardín."
      ],
      explanation: "Use ESTAR for location: están (they are - in the garden)",
      difficulty_level: "intermediate"
    },
    {
      id: "q3",
      question_text: "Complete: 'La comida _____ muy salada.'",
      question_type: "multiple_choice" as const,
      correct_answer: "está",
      options: ["es", "está", "son", "están"],
      explanation: "Use ESTAR for taste: está salada (it is salty - temporary condition/taste)",
      difficulty_level: "intermediate"
    },
    {
      id: "q4",
      question_text: "Which sentence uses SER correctly?",
      question_type: "multiple_choice" as const,
      correct_answer: "Yo soy de Colombia.",
      options: [
        "Yo estoy de Colombia.",
        "Yo soy de Colombia.",
        "Yo son de Colombia.",
        "Yo están de Colombia."
      ],
      explanation: "Use SER for origin: soy de Colombia (I am from Colombia - permanent origin)",
      difficulty_level: "intermediate"
    },
    {
      id: "q5",
      question_text: "Complete: 'Ella _____ muy cansada hoy.'",
      question_type: "multiple_choice" as const,
      correct_answer: "está",
      options: ["es", "está", "son", "están"],
      explanation: "Use ESTAR for temporary states: está cansada (she is tired - temporary condition)",
      difficulty_level: "intermediate"
    }
  ]
};

export default function SpanishSerVsEstarQuizPage() {
  return <GrammarQuiz quizData={quizData} onComplete={() => {}} onExit={() => {}} />;
}
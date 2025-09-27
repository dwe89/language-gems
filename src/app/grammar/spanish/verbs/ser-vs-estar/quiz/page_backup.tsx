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
      ],
      explanation: "Use ESTAR for location: están (they are - in the garden)",
      difficulty_level: "intermediate"
    },
    {
      id: "q3",
      question_text: "Complete: 'La comida _____ muy salada.'",
      question_type: "multiple_choice",
      correct_answer: "está",
      options: ["es", "está", "son", "están"],
      explanation: "Use ESTAR for taste: está salada (it is salty - temporary condition/taste)",
      difficulty_level: "intermediate"
    },
    {
      id: "q4",
      question_text: "Which sentence uses SER correctly?",
      question_type: "multiple_choice",
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
      question_type: "multiple_choice",
      correct_answer: "está",
      options: ["es", "está", "son", "están"],
      explanation: "Use ESTAR for temporary states: está cansada (she is tired - temporary condition)",
      difficulty_level: "intermediate"
    },
    {
      id: "q6",
      question_text: "Which sentence is correct for describing personality?",
      question_type: "multiple_choice",
      correct_answer: "Mi hermano es muy simpático.",
      options: [
        "Mi hermano está muy simpático.",
        "Mi hermano es muy simpático.",
        "Mi hermano son muy simpático.",
        "Mi hermano están muy simpático."
      ],
      explanation: "Use SER for personality traits: es simpático (he is nice - permanent characteristic)",
      difficulty_level: "intermediate"
    },
    {
      id: "q7",
      question_text: "Complete: 'La fiesta _____ en casa de María.'",
      question_type: "multiple_choice",
      correct_answer: "es",
      options: ["es", "está", "son", "están"],
      explanation: "Use SER for events and their location: es en casa de María (it is at María's house)",
      difficulty_level: "intermediate"
    },
    {
      id: "q8",
      question_text: "Which sentence uses ESTAR correctly?",
      question_type: "multiple_choice",
      correct_answer: "El café está frío.",
      options: [
        "El café es frío.",
        "El café está frío.",
        "El café son frío.",
        "El café están frío."
      ],
      explanation: "Use ESTAR for temperature: está frío (it is cold - temporary condition)",
      difficulty_level: "intermediate"
    },
    {
      id: "q9",
      question_text: "Complete: 'Nosotros _____ estudiantes universitarios.'",
      question_type: "multiple_choice",
      correct_answer: "somos",
      options: ["somos", "estamos", "es", "está"],
      explanation: "Use SER for roles/professions: somos estudiantes (we are students - role)",
      difficulty_level: "intermediate"
    },
    {
      id: "q10",
      question_text: "Which describes when to use ESTAR?",
      question_type: "multiple_choice",
      correct_answer: "Temporary states and location",
      options: [
        "Permanent characteristics",
        "Professions",
        "Origin",
        "Temporary states and location"
      ],
      explanation: "ESTAR is used for temporary states, emotions, location, and ongoing actions",
      difficulty_level: "intermediate"
    },
    {
      id: "q11",
      question_text: "Complete: 'Tú _____ muy guapo con esa camisa.'",
      question_type: "multiple_choice",
      correct_answer: "estás",
      options: ["eres", "estás", "es", "está"],
      explanation: "Use ESTAR for appearance/how someone looks: estás guapo (you look handsome)",
      difficulty_level: "intermediate"
    },
    {
      id: "q12",
      question_text: "Which sentence is correct?",
      question_type: "multiple_choice",
      correct_answer: "La puerta está abierta.",
      options: [
        "La puerta es abierta.",
        "La puerta está abierta.",
        "La puerta son abierta.",
        "La puerta están abierta."
      ],
      explanation: "Use ESTAR for states/conditions: está abierta (it is open - current state)",
      difficulty_level: "intermediate"
    },
    {
      id: "q13",
      question_text: "Complete: 'Mi coche _____ rojo.'",
      question_type: "multiple_choice",
      correct_answer: "es",
      options: ["es", "está", "son", "están"],
      explanation: "Use SER for color: es rojo (it is red - permanent characteristic)",
      difficulty_level: "intermediate"
    },
    {
      id: "q14",
      question_text: "Which sentence uses SER correctly for time?",
      question_type: "multiple_choice",
      correct_answer: "Son las tres de la tarde.",
      options: [
        "Está las tres de la tarde.",
        "Son las tres de la tarde.",
        "Es las tres de la tarde.",
        "Están las tres de la tarde."
      ],
      explanation: "Use SER for time: son las tres (it is three o'clock - use plural with hours except 'una')",
      difficulty_level: "intermediate"
    },
    {
      id: "q15",
      question_text: "Complete: 'Los estudiantes _____ preparados para el examen.'",
      question_type: "multiple_choice",
      correct_answer: "están",
      options: ["son", "están", "es", "está"],
      explanation: "Use ESTAR for readiness/prepared state: están preparados (they are prepared - temporary state)",
      difficulty_level: "intermediate"
    }
  ]
};

export default function SpanishSerVsEstarQuizPage() {
  return <GrammarQuiz quizData={quizData} onComplete={() => {}} onExit={() => {}} />;
}

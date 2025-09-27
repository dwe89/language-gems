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
      question: "Choose the correct translation: 'We have a new car.'",
      options: [
        "Nosotros habemos un coche nuevo.",
        "Nosotros tenemos un coche nuevo.",
        "Nosotros somos un coche nuevo.",
        "Nosotros estamos un coche nuevo."
      ],
      answer: "Nosotros tenemos un coche nuevo.",
      explanation: "Tener is irregular: tenemos (we have)"
    },
    {
      question: "What is the present form of 'ir' for 'ella'?",
      options: ["ire", "va", "voy", "vas"],
      answer: "va",
      explanation: "Ir is irregular: ella va (she goes)"
    },
    {
      question: "Complete: 'Yo _____ mi tarea todos los días.'",
      options: ["haco", "hago", "hace", "hacemos"],
      answer: "hago",
      explanation: "Hacer is irregular: yo hago (I do/make)"
    },
    {
      question: "Which sentence uses 'estar' correctly?",
      options: [
        "Yo soy en casa.",
        "Yo estoy en casa.",
        "Yo tengo en casa.",
        "Yo voy en casa."
      ],
      answer: "Yo estoy en casa.",
      explanation: "Estar is used for location: estoy (I am) - temporary state/location"
    },
    {
      question: "What is the present form of 'saber' for 'tú'?",
      options: ["sabes", "sabe", "sabo", "sabemos"],
      answer: "sabes",
      explanation: "Saber is irregular: tú sabes (you know)"
    },
    {
      question: "Choose the correct irregular form: 'They come to school by bus.'",
      options: [
        "Ellos venen en autobús a la escuela.",
        "Ellos vienen en autobús a la escuela.",
        "Ellos van en autobús a la escuela.",
        "Ellos están en autobús a la escuela."
      ],
      answer: "Ellos vienen en autobús a la escuela.",
      explanation: "Venir is irregular: vienen (they come)"
    },
    {
      question: "What is the present form of 'poner' for 'ustedes'?",
      options: ["ponen", "ponemos", "pongo", "pones"],
      answer: "ponen",
      explanation: "Poner is irregular: ustedes ponen (you all put/place)"
    },
    {
      question: "Complete: 'Nosotros _____ de la oficina a las cinco.'",
      options: ["salemos", "salimos", "salamos", "salen"],
      answer: "salimos",
      explanation: "Salir is irregular: nosotros salimos (we leave/go out)"
    },
    {
      question: "Which verb is completely irregular in the present tense?",
      options: ["hablar", "comer", "ser", "estudiar"],
      answer: "ser",
      explanation: "Ser is completely irregular: soy, eres, es, somos, sois, son"
    },
    {
      question: "What is the present form of 'decir' for 'yo'?",
      options: ["digo", "dico", "dice", "decimos"],
      answer: "digo",
      explanation: "Decir is irregular: yo digo (I say/tell)"
    },
    {
      question: "Choose the correct sentence:",
      options: [
        "Yo puedo nadar muy bien.",
        "Yo podo nadar muy bien.",
        "Yo pode nadar muy bien.",
        "Yo pudo nadar muy bien."
      ],
      answer: "Yo puedo nadar muy bien.",
      explanation: "Poder is irregular (stem-changing): yo puedo (I can)"
    },
    {
      question: "What is the present form of 'dar' for 'ella'?",
      options: ["da", "doy", "das", "damos"],
      answer: "da",
      explanation: "Dar is irregular: ella da (she gives)"
    },
    {
      question: "Complete: 'Tú _____ la televisión por las noches.'",
      options: ["ves", "vees", "ve", "vemos"],
      answer: "ves",
      explanation: "Ver is irregular: tú ves (you see/watch)"
    },
    {
      question: "Which verb means 'to bring' and is irregular?",
      options: ["llevar", "traer", "tomar", "coger"],
      answer: "traer",
      explanation: "Traer (to bring) is irregular: traigo, traes, trae, traemos, traéis, traen"
    }
  ]
};

export default function SpanishIrregularVerbsQuizPage() {
  return <GrammarQuiz quizData={quizData} onComplete={() => {}} onExit={() => {}} />;
}

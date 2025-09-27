import { Metadata } from 'next';
import { GrammarQuiz } from '@/components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Imperfect Tense Quiz | LanguageGems',
  description: 'Test your knowledge of Spanish imperfect tense with this comprehensive quiz. Covers ongoing past actions and habitual activities.',
  keywords: 'Spanish imperfect quiz, imperfect tense test, Spanish past tense quiz, imperfect conjugation quiz',
  openGraph: {
    title: 'Spanish Imperfect Tense Quiz | LanguageGems',
    description: 'Test your knowledge of Spanish imperfect tense with this comprehensive quiz. Covers ongoing past actions and habitual activities.',
    url: 'https://languagegems.com/grammar/spanish/verbs/imperfect/quiz',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/imperfect/quiz',
  },
};

const quizData = {
  title: "Spanish Imperfect Tense Quiz",
  description: "Test your mastery of Spanish imperfect tense conjugations and usage.",
  questions: [
    {
      question: "What is the correct imperfect form of 'hablar' for 'yo'?",
      options: ["hablo", "hablé", "hablaba", "hablaré"],
      answer: "hablaba",
      explanation: "Regular -ar verbs in imperfect: yo form ends in -aba (hablaba = I was speaking/used to speak)"
    },
    {
      question: "Choose the correct translation: 'We used to go to the beach every summer.'",
      options: [
        "Fuimos a la playa cada verano.",
        "Íbamos a la playa cada verano.",
        "Vamos a la playa cada verano.",
        "Iremos a la playa cada verano."
      ],
      answer: "Íbamos a la playa cada verano.",
      explanation: "Imperfect is used for habitual past actions. Íbamos = we used to go"
    },
    {
      question: "What is the imperfect form of 'ser' for 'ella'?",
      options: ["es", "fue", "era", "será"],
      answer: "era",
      explanation: "Ser is irregular in imperfect: era (she was/used to be)"
    },
    {
      question: "Complete: 'Cuando era niño, _____ mucho.'",
      options: ["jugué", "juego", "jugaba", "jugaré"],
      answer: "jugaba",
      explanation: "Imperfect is used for habitual past actions: jugaba (I used to play)"
    },
    {
      question: "Which sentence uses imperfect correctly?",
      options: [
        "Ayer comí pizza.",
        "Mañana comeré pizza.",
        "Ahora como pizza.",
        "Siempre comía pizza cuando era niño."
      ],
      answer: "Siempre comía pizza cuando era niño.",
      explanation: "Imperfect is used for habitual past actions. 'Siempre' indicates repeated action"
    },
    {
      question: "What is the imperfect form of 'ver' for 'nosotros'?",
      options: ["vemos", "vimos", "veíamos", "veremos"],
      answer: "veíamos",
      explanation: "Ver is irregular in imperfect: veíamos (we were seeing/used to see)"
    },
    {
      question: "Choose the correct imperfect form: 'They were studying when I arrived.'",
      options: [
        "Estudiaron cuando llegué.",
        "Estudiaban cuando llegué.",
        "Estudian cuando llegué.",
        "Estudiarán cuando llegué."
      ],
      answer: "Estudiaban cuando llegué.",
      explanation: "Imperfect shows ongoing past action: estudiaban (they were studying)"
    },
    {
      question: "What is the imperfect form of 'ir' for 'tú'?",
      options: ["vas", "fuiste", "ibas", "irás"],
      answer: "ibas",
      explanation: "Ir is irregular in imperfect: ibas (you were going/used to go)"
    },
    {
      question: "Complete: 'Los domingos nosotros _____ a la iglesia.'",
      options: ["fuimos", "vamos", "íbamos", "iremos"],
      answer: "íbamos",
      explanation: "Imperfect for habitual past action: íbamos (we used to go)"
    },
    {
      question: "Which time expression typically goes with imperfect?",
      options: ["ayer", "anoche", "siempre", "la semana pasada"],
      answer: "siempre",
      explanation: "Siempre (always) indicates habitual action, which uses imperfect tense"
    },
    {
      question: "What is the imperfect form of 'tener' for 'ustedes'?",
      options: ["tienen", "tuvieron", "tenían", "tendrán"],
      answer: "tenían",
      explanation: "Regular -er verb in imperfect: tenían (you all had/used to have)"
    },
    {
      question: "Choose the correct sentence:",
      options: [
        "Mientras estudiaba, sonó el teléfono.",
        "Mientras estudié, sonaba el teléfono.",
        "Mientras estudio, sonó el teléfono.",
        "Mientras estudiaré, sonó el teléfono."
      ],
      answer: "Mientras estudiaba, sonó el teléfono.",
      explanation: "Imperfect for ongoing action (estudiaba) interrupted by completed action (sonó)"
    },
    {
      question: "What is the imperfect form of 'hacer' for 'yo'?",
      options: ["hago", "hice", "hacía", "haré"],
      answer: "hacía",
      explanation: "Regular -er verb in imperfect: hacía (I was doing/used to do)"
    },
    {
      question: "Complete: 'De pequeña, ella _____ muy tímida.'",
      options: ["fue", "es", "era", "será"],
      answer: "era",
      explanation: "Imperfect for past characteristics: era (she was/used to be)"
    },
    {
      question: "Which describes the main use of imperfect tense?",
      options: [
        "Completed past actions",
        "Future actions",
        "Present actions",
        "Ongoing or habitual past actions"
      ],
      answer: "Ongoing or habitual past actions",
      explanation: "Imperfect is used for ongoing past actions, habitual actions, and past descriptions"
    }
  ]
};

export default function SpanishImperfectQuizPage() {
  return <GrammarQuiz {...quizData} />;
}

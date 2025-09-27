import { Metadata } from 'next';
import { GrammarQuiz } from '@/components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Future Tense Quiz | LanguageGems',
  description: 'Test your knowledge of Spanish future tense with this comprehensive quiz. Covers regular and irregular future conjugations.',
  keywords: 'Spanish future quiz, future tense test, Spanish future conjugation quiz',
  openGraph: {
    title: 'Spanish Future Tense Quiz | LanguageGems',
    description: 'Test your knowledge of Spanish future tense with this comprehensive quiz. Covers regular and irregular future conjugations.',
    url: 'https://languagegems.com/grammar/spanish/verbs/future/quiz',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/future/quiz',
  },
};

const quizData = {
  title: "Spanish Future Tense Quiz",
  description: "Test your mastery of Spanish future tense conjugations and usage.",
  questions: [
    {
      question: "What is the correct future form of 'hablar' for 'yo'?",
      options: ["hablo", "hablé", "hablaba", "hablaré"],
      answer: "hablaré",
      explanation: "Regular -ar verbs in future: yo form ends in -é (hablaré = I will speak)"
    },
    {
      question: "Choose the correct translation: 'They will travel to Europe next summer.'",
      options: [
        "Ellos viajan a Europa el próximo verano.",
        "Ellos viajaron a Europa el próximo verano.",
        "Ellos viajarán a Europa el próximo verano.",
        "Ellos viajaban a Europa el próximo verano."
      ],
      answer: "Ellos viajarán a Europa el próximo verano.",
      explanation: "Future tense is used for future actions. Viajarán = they will travel"
    },
    {
      question: "What is the future form of 'tener' for 'ella'?",
      options: ["tiene", "tuvo", "tenía", "tendrá"],
      answer: "tendrá",
      explanation: "Tener is irregular in future: tendr- + á = tendrá (she will have)"
    },
    {
      question: "Complete: 'Mañana nosotros _____ al parque.'",
      options: ["vamos", "fuimos", "iremos", "íbamos"],
      answer: "iremos",
      explanation: "Ir is irregular in future: iremos (we will go). Used for future action"
    },
    {
      question: "Which sentence uses future correctly?",
      options: [
        "Ayer comeré pizza.",
        "Ahora comeré pizza.",
        "Mañana comeré pizza.",
        "Siempre comeré pizza."
      ],
      answer: "Mañana comeré pizza.",
      explanation: "Future tense is used for future actions. 'Mañana' (tomorrow) indicates future"
    },
    {
      question: "What is the future form of 'hacer' for 'tú'?",
      options: ["haces", "hiciste", "harás", "hacías"],
      answer: "harás",
      explanation: "Hacer is irregular in future: har- + ás = harás (you will do/make)"
    },
    {
      question: "Choose the correct future form: 'I will put the books on the table.'",
      options: [
        "Pongo los libros en la mesa.",
        "Puse los libros en la mesa.",
        "Pondré los libros en la mesa.",
        "Ponía los libros en la mesa."
      ],
      answer: "Pondré los libros en la mesa.",
      explanation: "Poner is irregular in future: pondr- + é = pondré (I will put)"
    },
    {
      question: "What is the future form of 'poder' for 'ustedes'?",
      options: ["pueden", "pudieron", "podrán", "podían"],
      answer: "podrán",
      explanation: "Poder is irregular in future: podr- + án = podrán (you all will be able to)"
    },
    {
      question: "Complete: 'Los estudiantes _____ mucho para el examen.'",
      options: ["estudian", "estudiaron", "estudiarán", "estudiaban"],
      answer: "estudiarán",
      explanation: "Regular -ar verb in future: estudiarán (they will study)"
    },
    {
      question: "Which time expression typically goes with future?",
      options: ["ayer", "anoche", "mañana", "la semana pasada"],
      answer: "mañana",
      explanation: "Mañana (tomorrow) indicates future time, which uses future tense"
    },
    {
      question: "What is the future form of 'decir' for 'yo'?",
      options: ["digo", "dije", "diré", "decía"],
      answer: "diré",
      explanation: "Decir is irregular in future: dir- + é = diré (I will say/tell)"
    },
    {
      question: "Choose the correct sentence:",
      options: [
        "El próximo año viviré en Madrid.",
        "El próximo año viví en Madrid.",
        "El próximo año vivo en Madrid.",
        "El próximo año vivía en Madrid."
      ],
      answer: "El próximo año viviré en Madrid.",
      explanation: "Future tense for future plans: viviré (I will live)"
    },
    {
      question: "What is the future form of 'salir' for 'ella'?",
      options: ["sale", "salió", "saldrá", "salía"],
      answer: "saldrá",
      explanation: "Salir is irregular in future: saldr- + á = saldrá (she will leave/go out)"
    },
    {
      question: "Complete: 'Esta noche yo _____ una película muy buena.'",
      options: ["veo", "vi", "veré", "veía"],
      answer: "veré",
      explanation: "Regular -er verb in future: veré (I will see/watch)"
    },
    {
      question: "Which verb has an irregular stem in the future tense?",
      options: ["hablar", "comer", "vivir", "venir"],
      answer: "venir",
      explanation: "Venir has irregular stem in future: vendr- (vendrá, vendrás, etc.)"
    }
  ]
};

export default function SpanishFutureQuizPage() {
  return <GrammarQuiz {...quizData} />;
}

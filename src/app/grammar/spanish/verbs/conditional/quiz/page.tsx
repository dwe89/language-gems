import { Metadata } from 'next';
import { GrammarQuiz } from '@/components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Conditional Tense Quiz | LanguageGems',
  description: 'Test your knowledge of Spanish conditional tense with this comprehensive quiz. Covers hypothetical situations and polite requests.',
  keywords: 'Spanish conditional quiz, conditional tense test, Spanish conditional conjugation quiz',
  openGraph: {
    title: 'Spanish Conditional Tense Quiz | LanguageGems',
    description: 'Test your knowledge of Spanish conditional tense with this comprehensive quiz. Covers hypothetical situations and polite requests.',
    url: 'https://languagegems.com/grammar/spanish/verbs/conditional/quiz',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/conditional/quiz',
  },
};

const quizData = {
  title: "Spanish Conditional Tense Quiz",
  description: "Test your mastery of Spanish conditional tense conjugations and usage.",
  questions: [
    {
      question: "What is the correct conditional form of 'hablar' for 'yo'?",
      options: ["hablo", "hablé", "hablaría", "hablaré"],
      answer: "hablaría",
      explanation: "Regular -ar verbs in conditional: yo form ends in -ía (hablaría = I would speak)"
    },
    {
      question: "Choose the correct translation: 'They would travel if they had money.'",
      options: [
        "Ellos viajan si tienen dinero.",
        "Ellos viajaron si tuvieron dinero.",
        "Ellos viajarían si tuvieran dinero.",
        "Ellos viajarán si tienen dinero."
      ],
      answer: "Ellos viajarían si tuvieran dinero.",
      explanation: "Conditional is used for hypothetical situations. Viajarían = they would travel"
    },
    {
      question: "What is the conditional form of 'tener' for 'ella'?",
      options: ["tiene", "tuvo", "tendría", "tendrá"],
      answer: "tendría",
      explanation: "Tener is irregular in conditional: tendr- + ía = tendría (she would have)"
    },
    {
      question: "Complete: 'Nosotros _____ al cine si tuviéramos tiempo.'",
      options: ["vamos", "fuimos", "iríamos", "iremos"],
      answer: "iríamos",
      explanation: "Ir is irregular in conditional: iríamos (we would go). Used in hypothetical situation"
    },
    {
      question: "Which sentence uses conditional correctly for a polite request?",
      options: [
        "¿Puedes ayudarme?",
        "¿Pudiste ayudarme?",
        "¿Podrías ayudarme?",
        "¿Podrás ayudarme?"
      ],
      answer: "¿Podrías ayudarme?",
      explanation: "Conditional is used for polite requests. Podrías = could you (more polite than puedes)"
    },
    {
      question: "What is the conditional form of 'hacer' for 'tú'?",
      options: ["haces", "hiciste", "harías", "harás"],
      answer: "harías",
      explanation: "Hacer is irregular in conditional: har- + ías = harías (you would do/make)"
    },
    {
      question: "Choose the correct conditional form: 'I would put the keys on the table.'",
      options: [
        "Pongo las llaves en la mesa.",
        "Puse las llaves en la mesa.",
        "Pondría las llaves en la mesa.",
        "Pondré las llaves en la mesa."
      ],
      answer: "Pondría las llaves en la mesa.",
      explanation: "Poner is irregular in conditional: pondr- + ía = pondría (I would put)"
    },
    {
      question: "What is the conditional form of 'poder' for 'ustedes'?",
      options: ["pueden", "pudieron", "podrían", "podrán"],
      answer: "podrían",
      explanation: "Poder is irregular in conditional: podr- + ían = podrían (you all could/would be able to)"
    },
    {
      question: "Complete: 'Los estudiantes _____ más si el profesor fuera más interesante.'",
      options: ["estudian", "estudiaron", "estudiarían", "estudiarán"],
      answer: "estudiarían",
      explanation: "Regular -ar verb in conditional: estudiarían (they would study)"
    },
    {
      question: "Which context typically uses conditional tense?",
      options: ["Completed past actions", "Present facts", "Hypothetical situations", "Future certainties"],
      answer: "Hypothetical situations",
      explanation: "Conditional is used for hypothetical situations, polite requests, and speculation"
    },
    {
      question: "What is the conditional form of 'decir' for 'yo'?",
      options: ["digo", "dije", "diría", "diré"],
      answer: "diría",
      explanation: "Decir is irregular in conditional: dir- + ía = diría (I would say/tell)"
    },
    {
      question: "Choose the correct sentence:",
      options: [
        "Si tuviera dinero, compro un coche.",
        "Si tuviera dinero, compré un coche.",
        "Si tuviera dinero, compraría un coche.",
        "Si tuviera dinero, compraré un coche."
      ],
      answer: "Si tuviera dinero, compraría un coche.",
      explanation: "Conditional is used in the main clause of hypothetical 'si' sentences"
    },
    {
      question: "What is the conditional form of 'salir' for 'ella'?",
      options: ["sale", "salió", "saldría", "saldrá"],
      answer: "saldría",
      explanation: "Salir is irregular in conditional: saldr- + ía = saldría (she would leave/go out)"
    },
    {
      question: "Complete: 'Me _____ ir de vacaciones a la playa.'",
      options: ["gusta", "gustó", "gustaría", "gustará"],
      answer: "gustaría",
      explanation: "Gustar in conditional: gustaría (I would like). Used to express desires politely"
    },
    {
      question: "Which verb has the same irregular stem in both future and conditional?",
      options: ["hablar", "comer", "venir", "estudiar"],
      answer: "venir",
      explanation: "Venir has irregular stem vendr- in both future (vendrá) and conditional (vendría)"
    }
  ]
};

export default function SpanishConditionalQuizPage() {
  return <GrammarQuiz {...quizData} />;
}

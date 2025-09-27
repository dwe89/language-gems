import { Metadata } from 'next';
import { GrammarQuiz } from '@/components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Preterite Tense Quiz | LanguageGems',
  description: 'Test your knowledge of Spanish preterite tense with this comprehensive quiz. Covers regular and irregular preterite conjugations.',
  keywords: 'Spanish preterite quiz, preterite tense test, Spanish past tense quiz, preterite conjugation quiz',
  openGraph: {
    title: 'Spanish Preterite Tense Quiz | LanguageGems',
    description: 'Test your knowledge of Spanish preterite tense with this comprehensive quiz. Covers regular and irregular preterite conjugations.',
    url: 'https://languagegems.com/grammar/spanish/verbs/preterite/quiz',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/preterite/quiz',
  },
};

const quizData = {
  title: "Spanish Preterite Tense Quiz",
  description: "Test your mastery of Spanish preterite tense conjugations and usage.",
  questions: [
    {
      question: "What is the correct preterite form of 'hablar' for 'yo'?",
      options: ["hablo", "hablé", "hablaba", "hablaré"],
      answer: "hablé",
      explanation: "Regular -ar verbs in preterite: yo form ends in -é (hablé = I spoke)"
    },
    {
      question: "Choose the correct translation: 'They ate dinner at 8 PM.'",
      options: [
        "Ellos comen la cena a las 8.",
        "Ellos comían la cena a las 8.",
        "Ellos comieron la cena a las 8.",
        "Ellos comerán la cena a las 8."
      ],
      answer: "Ellos comieron la cena a las 8.",
      explanation: "Preterite is used for completed past actions. Comieron = they ate (completed action)"
    },
    {
      question: "What is the preterite form of 'ser' for 'ella'?",
      options: ["es", "era", "fue", "será"],
      answer: "fue",
      explanation: "Ser is irregular in preterite: fue (she was). Same form as ir (she went)"
    },
    {
      question: "Complete: 'Ayer nosotros _____ al parque.'",
      options: ["vamos", "íbamos", "fuimos", "iremos"],
      answer: "fuimos",
      explanation: "Ir is irregular in preterite: fuimos (we went). Used for completed past action"
    },
    {
      question: "Which sentence uses preterite correctly?",
      options: [
        "Cuando era niño, jugaba fútbol.",
        "Ayer jugué fútbol con mis amigos.",
        "Mañana jugaré fútbol.",
        "Ahora juego fútbol."
      ],
      answer: "Ayer jugué fútbol con mis amigos.",
      explanation: "Preterite is used for completed past actions. 'Ayer' (yesterday) indicates a specific completed action"
    },
    {
      question: "What is the preterite form of 'tener' for 'tú'?",
      options: ["tienes", "tenías", "tuviste", "tendrás"],
      answer: "tuviste",
      explanation: "Tener has irregular stem in preterite: tuv-. Tú form: tuviste (you had)"
    },
    {
      question: "Choose the correct preterite form: 'I made dinner last night.'",
      options: [
        "Hago la cena anoche.",
        "Hacía la cena anoche.",
        "Hice la cena anoche.",
        "Haré la cena anoche."
      ],
      answer: "Hice la cena anoche.",
      explanation: "Hacer is irregular in preterite: hice (I made/did). Used for completed past action"
    },
    {
      question: "What is the preterite form of 'dar' for 'ustedes'?",
      options: ["dan", "daban", "dieron", "darán"],
      answer: "dieron",
      explanation: "Dar is irregular in preterite: dieron (you all gave). Note the -ieron ending"
    },
    {
      question: "Complete: 'Los estudiantes _____ mucho para el examen.'",
      options: ["estudian", "estudiaban", "estudiaron", "estudiarán"],
      answer: "estudiaron",
      explanation: "Regular -ar verb in preterite: estudiaron (they studied). Completed past action"
    },
    {
      question: "Which time expression typically goes with preterite?",
      options: ["siempre", "todos los días", "ayer", "generalmente"],
      answer: "ayer",
      explanation: "Ayer (yesterday) indicates a specific completed past action, which uses preterite tense"
    },
    {
      question: "What is the preterite form of 'poder' for 'yo'?",
      options: ["puedo", "podía", "pude", "podré"],
      answer: "pude",
      explanation: "Poder has irregular stem in preterite: pud-. Yo form: pude (I was able to/could)"
    },
    {
      question: "Choose the correct sentence:",
      options: [
        "Cuando llegué, él ya comía.",
        "Cuando llegué, él ya comió.",
        "Cuando llegaba, él ya comió.",
        "Cuando llego, él ya comió."
      ],
      answer: "Cuando llegué, él ya comió.",
      explanation: "Both actions are completed: llegué (I arrived) and comió (he ate). Both use preterite"
    },
    {
      question: "What is the preterite form of 'decir' for 'ella'?",
      options: ["dice", "decía", "dijo", "dirá"],
      answer: "dijo",
      explanation: "Decir is irregular in preterite: dijo (she said). Irregular stem dij-"
    },
    {
      question: "Complete: 'Anoche yo _____ una película muy buena.'",
      options: ["veo", "veía", "vi", "veré"],
      answer: "vi",
      explanation: "Ver in preterite: vi (I saw). Used for completed past action with 'anoche' (last night)"
    },
    {
      question: "Which verb form indicates a completed past action?",
      options: ["hablaba", "habló", "habla", "hablará"],
      answer: "habló",
      explanation: "Habló is preterite (he/she spoke), indicating a completed past action"
    }
  ]
};

export default function SpanishPreteriteQuizPage() {
  return <GrammarQuiz {...quizData} />;
}

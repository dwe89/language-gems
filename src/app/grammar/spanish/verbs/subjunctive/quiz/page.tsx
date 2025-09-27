import { Metadata } from 'next';
import { GrammarQuiz } from '@/components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Present Subjunctive Quiz | LanguageGems',
  description: 'Test your knowledge of Spanish present subjunctive with this comprehensive quiz. Covers emotions, doubt, and subjunctive triggers.',
  keywords: 'Spanish subjunctive quiz, present subjunctive test, Spanish subjunctive conjugation quiz',
  openGraph: {
    title: 'Spanish Present Subjunctive Quiz | LanguageGems',
    description: 'Test your knowledge of Spanish present subjunctive with this comprehensive quiz. Covers emotions, doubt, and subjunctive triggers.',
    url: 'https://languagegems.com/grammar/spanish/verbs/subjunctive/quiz',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/subjunctive/quiz',
  },
};

const quizData = {
  title: "Spanish Present Subjunctive Quiz",
  description: "Test your mastery of Spanish present subjunctive conjugations and usage.",
  questions: [
    {
      question: "What is the correct subjunctive form of 'hablar' for 'yo'?",
      options: ["hablo", "hablé", "hable", "hablaré"],
      answer: "hable",
      explanation: "Regular -ar verbs in subjunctive: yo form ends in -e (hable = I speak)"
    },
    {
      question: "Choose the correct translation: 'I hope they come to the party.'",
      options: [
        "Espero que ellos vienen a la fiesta.",
        "Espero que ellos vinieron a la fiesta.",
        "Espero que ellos vengan a la fiesta.",
        "Espero que ellos vendrán a la fiesta."
      ],
      answer: "Espero que ellos vengan a la fiesta.",
      explanation: "After 'espero que' use subjunctive. Vengan = they come (subjunctive)"
    },
    {
      question: "What is the subjunctive form of 'ser' for 'ella'?",
      options: ["es", "fue", "sea", "será"],
      answer: "sea",
      explanation: "Ser is irregular in subjunctive: sea (she be)"
    },
    {
      question: "Complete: 'Es importante que nosotros _____ la verdad.'",
      options: ["decimos", "dijimos", "digamos", "diremos"],
      answer: "digamos",
      explanation: "After impersonal expressions use subjunctive: digamos (we tell)"
    },
    {
      question: "Which sentence uses subjunctive correctly?",
      options: [
        "Creo que él viene mañana.",
        "No creo que él viene mañana.",
        "No creo que él venga mañana.",
        "Creo que él venga mañana."
      ],
      answer: "No creo que él venga mañana.",
      explanation: "After negative expressions of belief use subjunctive: venga (he come)"
    },
    {
      question: "What is the subjunctive form of 'tener' for 'tú'?",
      options: ["tienes", "tuviste", "tengas", "tendrás"],
      answer: "tengas",
      explanation: "Tener is irregular in subjunctive: tengas (you have)"
    },
    {
      question: "Choose the correct subjunctive form: 'I want you to do your homework.'",
      options: [
        "Quiero que haces tu tarea.",
        "Quiero que hiciste tu tarea.",
        "Quiero que hagas tu tarea.",
        "Quiero que harás tu tarea."
      ],
      answer: "Quiero que hagas tu tarea.",
      explanation: "After verbs of wanting use subjunctive: hagas (you do)"
    },
    {
      question: "What is the subjunctive form of 'ir' for 'ustedes'?",
      options: ["van", "fueron", "vayan", "irán"],
      answer: "vayan",
      explanation: "Ir is irregular in subjunctive: vayan (you all go)"
    },
    {
      question: "Complete: 'Dudo que los estudiantes _____ el examen.'",
      options: ["pasan", "pasaron", "pasen", "pasarán"],
      answer: "pasen",
      explanation: "After expressions of doubt use subjunctive: pasen (they pass)"
    },
    {
      question: "Which expression typically triggers subjunctive?",
      options: ["Creo que", "Es verdad que", "Es posible que", "Sé que"],
      answer: "Es posible que",
      explanation: "Es posible que (it's possible that) expresses possibility and triggers subjunctive"
    },
    {
      question: "What is the subjunctive form of 'saber' for 'yo'?",
      options: ["sé", "supe", "sepa", "sabré"],
      answer: "sepa",
      explanation: "Saber is irregular in subjunctive: sepa (I know)"
    },
    {
      question: "Choose the correct sentence:",
      options: [
        "Me alegra que tú estás bien.",
        "Me alegra que tú estuviste bien.",
        "Me alegra que tú estés bien.",
        "Me alegra que tú estarás bien."
      ],
      answer: "Me alegra que tú estés bien.",
      explanation: "After expressions of emotion use subjunctive: estés (you are)"
    },
    {
      question: "What is the subjunctive form of 'poder' for 'ella'?",
      options: ["puede", "pudo", "pueda", "podrá"],
      answer: "pueda",
      explanation: "Poder is irregular in subjunctive: pueda (she can/be able to)"
    },
    {
      question: "Complete: 'Ojalá que _____ buen tiempo mañana.'",
      options: ["hace", "hizo", "haga", "hará"],
      answer: "haga",
      explanation: "Ojalá que always triggers subjunctive: haga (it make/be - good weather)"
    },
    {
      question: "Which type of expression does NOT typically use subjunctive?",
      options: [
        "Expressions of doubt",
        "Expressions of emotion",
        "Expressions of certainty",
        "Expressions of desire"
      ],
      answer: "Expressions of certainty",
      explanation: "Expressions of certainty (creo que, sé que, es verdad que) use indicative, not subjunctive"
    }
  ]
};

export default function SpanishSubjunctiveQuizPage() {
  return <GrammarQuiz {...quizData} />;
}

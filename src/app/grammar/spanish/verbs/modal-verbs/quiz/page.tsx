import { Metadata } from 'next';
import GrammarQuiz from '@/components/grammar/GrammarQuiz';

export const metadata: Metadata = {
  title: 'Spanish Modal Verbs Quiz | LanguageGems',
  description: 'Test your knowledge of Spanish modal verbs with this comprehensive quiz.',
  keywords: 'Spanish modal verbs quiz, poder deber querer test, tener que assessment',
};

const quizData = {
  title: "Spanish Modal Verbs Quiz",
  description: "Test your understanding of Spanish modal verbs and their uses.",
  
  questions: [
    {
      question: "What type of verb is 'poder'?",
      options: [
        "Regular -er verb",
        "Irregular stem-changing verb (o→ue)",
        "Irregular stem-changing verb (e→ie)",
        "Completely irregular verb"
      ],
      correct: 1,
      explanation: "'Poder' is an irregular stem-changing verb where 'o' changes to 'ue' in most forms."
    },
    {
      question: "Which modal verb expresses learned ability or skill?",
      options: [
        "Poder",
        "Deber",
        "Saber",
        "Querer"
      ],
      correct: 2,
      explanation: "'Saber' + infinitive expresses learned abilities: 'Sé nadar' (I know how to swim)."
    },
    {
      question: "What does 'Tienes que estudiar' mean?",
      options: [
        "You can study",
        "You want to study",
        "You should study",
        "You have to study"
      ],
      correct: 3,
      explanation: "'Tener que' expresses strong obligation or necessity."
    },
    {
      question: "Which sentence expresses possibility?",
      options: [
        "Debo llegar temprano.",
        "Puede llover mañana.",
        "Quiero viajar.",
        "Tengo que trabajar."
      ],
      correct: 1,
      explanation: "'Puede llover mañana' expresses possibility (it might rain tomorrow)."
    },
    {
      question: "What's the difference between 'deber' and 'tener que'?",
      options: [
        "No difference",
        "'Deber' is stronger obligation than 'tener que'",
        "'Tener que' is stronger obligation than 'deber'",
        "They express different tenses"
      ],
      correct: 2,
      explanation: "'Tener que' expresses stronger necessity/obligation than 'deber'."
    },
    {
      question: "How do you say 'I want to learn Spanish'?",
      options: [
        "Puedo aprender español.",
        "Debo aprender español.",
        "Quiero aprender español.",
        "Sé aprender español."
      ],
      correct: 2,
      explanation: "'Quiero aprender español' uses 'querer' to express desire."
    },
    {
      question: "What does 'Hay que' express?",
      options: [
        "Personal obligation",
        "General obligation for everyone",
        "Ability",
        "Desire"
      ],
      correct: 1,
      explanation: "'Hay que' expresses general obligation or necessity that applies to everyone."
    },
    {
      question: "Which is correct for 'You should eat more'?",
      options: [
        "Puedes comer más.",
        "Quieres comer más.",
        "Debes comer más.",
        "Sabes comer más."
      ],
      correct: 2,
      explanation: "'Debes comer más' uses 'deber' to give advice or express obligation."
    },
    {
      question: "What's the conjugation of 'querer' for 'nosotros'?",
      options: [
        "queremos",
        "quieremos",
        "querimos",
        "quierimos"
      ],
      correct: 0,
      explanation: "'Queremos' is correct - the stem doesn't change in the nosotros form."
    },
    {
      question: "How do you ask 'Can you help me?' in Spanish?",
      options: [
        "¿Debes ayudarme?",
        "¿Quieres ayudarme?",
        "¿Puedes ayudarme?",
        "¿Sabes ayudarme?"
      ],
      correct: 2,
      explanation: "'¿Puedes ayudarme?' uses 'poder' to ask about ability or make a request."
    },
    {
      question: "What does 'No sé conducir' mean?",
      options: [
        "I can't drive",
        "I don't want to drive",
        "I shouldn't drive",
        "I don't know how to drive"
      ],
      correct: 3,
      explanation: "'No sé conducir' means 'I don't know how to drive' (lack of skill)."
    },
    {
      question: "Which modal verb would you use for 'It must be expensive' (probability)?",
      options: [
        "Puede ser caro",
        "Debe de ser caro",
        "Quiere ser caro",
        "Tiene que ser caro"
      ],
      correct: 1,
      explanation: "'Debe de ser caro' expresses probability or assumption."
    },
    {
      question: "How do you say 'We don't have to work tomorrow'?",
      options: [
        "No podemos trabajar mañana.",
        "No queremos trabajar mañana.",
        "No tenemos que trabajar mañana.",
        "No sabemos trabajar mañana."
      ],
      correct: 2,
      explanation: "'No tenemos que trabajar mañana' expresses lack of obligation."
    },
    {
      question: "What's the stem change in 'querer'?",
      options: [
        "o→ue",
        "e→ie",
        "e→i",
        "u→ue"
      ],
      correct: 1,
      explanation: "'Querer' has the stem change e→ie: quiero, quieres, quiere, etc."
    },
    {
      question: "Which sentence expresses permission?",
      options: [
        "Debo entrar.",
        "Quiero entrar.",
        "¿Puedo entrar?",
        "Tengo que entrar."
      ],
      correct: 2,
      explanation: "'¿Puedo entrar?' asks for permission (May I come in?)."
    }
  ]
};

export default function SpanishModalVerbsQuizPage() {
  return <GrammarQuiz {...quizData} />;
}

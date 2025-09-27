import { Metadata } from 'next';
import { GrammarPractice } from '@/components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Preterite Tense Practice | LanguageGems',
  description: 'Practice Spanish preterite tense with interactive exercises. Master regular and irregular preterite conjugations with immediate feedback.',
  keywords: 'Spanish preterite practice, preterite tense exercises, Spanish past tense practice, preterite conjugation practice',
  openGraph: {
    title: 'Spanish Preterite Tense Practice | LanguageGems',
    description: 'Practice Spanish preterite tense with interactive exercises. Master regular and irregular preterite conjugations with immediate feedback.',
    url: 'https://languagegems.com/grammar/spanish/verbs/preterite/practice',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/preterite/practice',
  },
};

const practiceData = {
  title: "Spanish Preterite Tense Practice",
  description: "Practice conjugating Spanish verbs in the preterite tense with these interactive exercises.",
  exercises: [
    {
      type: "conjugation",
      instruction: "Conjugate the verb in parentheses in the preterite tense.",
      items: [
        {
          spanish: "Ayer yo _____ (hablar) con mi madre.",
          english: "Yesterday I spoke with my mother.",
          answer: "hablé",
          explanation: "Regular -ar verbs in preterite: yo form ends in -é"
        },
        {
          spanish: "Ellos _____ (comer) pizza anoche.",
          english: "They ate pizza last night.",
          answer: "comieron",
          explanation: "Regular -er verbs in preterite: ellos form ends in -ieron"
        },
        {
          spanish: "Tú _____ (vivir) en Madrid el año pasado.",
          english: "You lived in Madrid last year.",
          answer: "viviste",
          explanation: "Regular -ir verbs in preterite: tú form ends in -iste"
        },
        {
          spanish: "Nosotros _____ (ir) al cine el sábado.",
          english: "We went to the movies on Saturday.",
          answer: "fuimos",
          explanation: "Ir is irregular in preterite: fuimos (we went)"
        },
        {
          spanish: "Ella _____ (ser) muy amable conmigo.",
          english: "She was very kind to me.",
          answer: "fue",
          explanation: "Ser is irregular in preterite: fue (she was)"
        },
        {
          spanish: "Yo _____ (tener) que trabajar ayer.",
          english: "I had to work yesterday.",
          answer: "tuve",
          explanation: "Tener has irregular stem in preterite: tuv-"
        },
        {
          spanish: "¿Qué _____ (hacer) ustedes el fin de semana?",
          english: "What did you all do on the weekend?",
          answer: "hicieron",
          explanation: "Hacer is irregular in preterite: hicieron (they did)"
        },
        {
          spanish: "Mi hermano _____ (dar) un regalo a su novia.",
          english: "My brother gave a gift to his girlfriend.",
          answer: "dio",
          explanation: "Dar is irregular in preterite: dio (he gave)"
        },
        {
          spanish: "Los estudiantes _____ (estudiar) toda la noche.",
          english: "The students studied all night.",
          answer: "estudiaron",
          explanation: "Regular -ar verbs in preterite: ellos form ends in -aron"
        },
        {
          spanish: "Yo _____ (poder) terminar el proyecto a tiempo.",
          english: "I was able to finish the project on time.",
          answer: "pude",
          explanation: "Poder has irregular stem in preterite: pud-"
        }
      ]
    },
    {
      type: "multiple-choice",
      instruction: "Choose the correct preterite form.",
      items: [
        {
          question: "Yesterday we _____ to the beach.",
          spanish: "Ayer nosotros _____ a la playa.",
          options: ["fuimos", "íbamos", "vamos", "iremos"],
          answer: "fuimos",
          explanation: "Fuimos is the preterite form of ir for nosotros (we went)"
        },
        {
          question: "She _____ the book last week.",
          spanish: "Ella _____ el libro la semana pasada.",
          options: ["leía", "leyó", "lee", "leerá"],
          answer: "leyó",
          explanation: "Leyó is the preterite form of leer for ella (she read)"
        },
        {
          question: "They _____ at the restaurant.",
          spanish: "Ellos _____ en el restaurante.",
          options: ["comían", "comen", "comieron", "comerán"],
          answer: "comieron",
          explanation: "Comieron is the preterite form of comer for ellos (they ate)"
        },
        {
          question: "I _____ my keys yesterday.",
          spanish: "Yo _____ mis llaves ayer.",
          options: ["perdía", "pierdo", "perdí", "perderé"],
          answer: "perdí",
          explanation: "Perdí is the preterite form of perder for yo (I lost)"
        },
        {
          question: "You _____ very well last night.",
          spanish: "Tú _____ muy bien anoche.",
          options: ["dormías", "duermes", "dormiste", "dormirás"],
          answer: "dormiste",
          explanation: "Dormiste is the preterite form of dormir for tú (you slept)"
        }
      ]
    },
    {
      type: "translation",
      instruction: "Translate these sentences using the preterite tense.",
      items: [
        {
          english: "I bought a new car last month.",
          answer: "Compré un coche nuevo el mes pasado.",
          explanation: "Compré is the preterite form of comprar for yo"
        },
        {
          english: "We visited our grandparents on Sunday.",
          answer: "Visitamos a nuestros abuelos el domingo.",
          explanation: "Visitamos is the preterite form of visitar for nosotros"
        },
        {
          english: "They arrived late to the party.",
          answer: "Llegaron tarde a la fiesta.",
          explanation: "Llegaron is the preterite form of llegar for ellos"
        },
        {
          english: "She wrote a letter to her friend.",
          answer: "Escribió una carta a su amiga.",
          explanation: "Escribió is the preterite form of escribir for ella"
        },
        {
          english: "You brought the food for the picnic.",
          answer: "Trajiste la comida para el picnic.",
          explanation: "Trajiste is the preterite form of traer for tú (irregular)"
        }
      ]
    }
  ]
};

export default function SpanishPreteritePracticePage() {
  return <GrammarPractice {...practiceData} />;
}

import { Metadata } from 'next';
import { GrammarPractice } from '@/components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Imperfect Tense Practice | LanguageGems',
  description: 'Practice Spanish imperfect tense with interactive exercises. Master ongoing past actions and habitual activities.',
  keywords: 'Spanish imperfect practice, imperfect tense exercises, Spanish past tense practice, imperfect conjugation practice',
  openGraph: {
    title: 'Spanish Imperfect Tense Practice | LanguageGems',
    description: 'Practice Spanish imperfect tense with interactive exercises. Master ongoing past actions and habitual activities.',
    url: 'https://languagegems.com/grammar/spanish/verbs/imperfect/practice',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/imperfect/practice',
  },
};

const practiceData = {
  title: "Spanish Imperfect Tense Practice",
  description: "Practice conjugating Spanish verbs in the imperfect tense with these interactive exercises.",
  exercises: [
    {
      type: "conjugation",
      instruction: "Conjugate the verb in parentheses in the imperfect tense.",
      items: [
        {
          spanish: "Cuando era niño, yo _____ (jugar) fútbol todos los días.",
          english: "When I was a child, I used to play soccer every day.",
          answer: "jugaba",
          explanation: "Regular -ar verbs in imperfect: yo form ends in -aba"
        },
        {
          spanish: "Mis abuelos _____ (vivir) en una casa grande.",
          english: "My grandparents used to live in a big house.",
          answer: "vivían",
          explanation: "Regular -ir verbs in imperfect: ellos form ends in -ían"
        },
        {
          spanish: "Tú siempre _____ (comer) mucho chocolate.",
          english: "You always used to eat a lot of chocolate.",
          answer: "comías",
          explanation: "Regular -er verbs in imperfect: tú form ends in -ías"
        },
        {
          spanish: "Nosotros _____ (ser) muy buenos amigos.",
          english: "We used to be very good friends.",
          answer: "éramos",
          explanation: "Ser is irregular in imperfect: éramos (we were/used to be)"
        },
        {
          spanish: "Ella _____ (ir) a la escuela en autobús.",
          english: "She used to go to school by bus.",
          answer: "iba",
          explanation: "Ir is irregular in imperfect: iba (she went/used to go)"
        },
        {
          spanish: "Los niños _____ (ver) televisión por las tardes.",
          english: "The children used to watch TV in the afternoons.",
          answer: "veían",
          explanation: "Ver is irregular in imperfect: veían (they watched/used to watch)"
        },
        {
          spanish: "Yo _____ (estudiar) mientras mi hermana dormía.",
          english: "I was studying while my sister was sleeping.",
          answer: "estudiaba",
          explanation: "Imperfect shows ongoing past action: estudiaba (I was studying)"
        },
        {
          spanish: "¿Qué _____ (hacer) ustedes los fines de semana?",
          english: "What did you all used to do on weekends?",
          answer: "hacían",
          explanation: "Regular -er verb in imperfect: hacían (you used to do)"
        },
        {
          spanish: "Mi padre _____ (trabajar) en una oficina.",
          english: "My father used to work in an office.",
          answer: "trabajaba",
          explanation: "Regular -ar verb in imperfect: trabajaba (he used to work)"
        },
        {
          spanish: "Cuando llovía, nosotros _____ (quedarse) en casa.",
          english: "When it rained, we used to stay at home.",
          answer: "nos quedábamos",
          explanation: "Reflexive verb in imperfect: nos quedábamos (we used to stay)"
        }
      ]
    },
    {
      type: "multiple-choice",
      instruction: "Choose the correct imperfect form.",
      items: [
        {
          question: "When I was young, I _____ to the park every day.",
          spanish: "Cuando era joven, yo _____ al parque todos los días.",
          options: ["fui", "iba", "voy", "iré"],
          answer: "iba",
          explanation: "Iba is the imperfect form of ir for yo (I used to go/was going)"
        },
        {
          question: "They _____ very happy in those days.",
          spanish: "Ellos _____ muy felices en esos días.",
          options: ["fueron", "eran", "son", "serán"],
          answer: "eran",
          explanation: "Eran is the imperfect form of ser for ellos (they were/used to be)"
        },
        {
          question: "We _____ TV when the phone rang.",
          spanish: "Nosotros _____ la televisión cuando sonó el teléfono.",
          options: ["vimos", "veíamos", "vemos", "veremos"],
          answer: "veíamos",
          explanation: "Veíamos is the imperfect form showing ongoing action (we were watching)"
        },
        {
          question: "She _____ letters to her grandmother every week.",
          spanish: "Ella _____ cartas a su abuela cada semana.",
          options: ["escribió", "escribía", "escribe", "escribirá"],
          answer: "escribía",
          explanation: "Escribía shows habitual past action (she used to write)"
        },
        {
          question: "You _____ a lot when you were little.",
          spanish: "Tú _____ mucho cuando eras pequeño.",
          options: ["lloraste", "llorabas", "lloras", "llorarás"],
          answer: "llorabas",
          explanation: "Llorabas shows habitual past action (you used to cry)"
        }
      ]
    },
    {
      type: "translation",
      instruction: "Translate these sentences using the imperfect tense.",
      items: [
        {
          english: "I used to read books every night.",
          answer: "Leía libros todas las noches.",
          explanation: "Leía shows habitual past action (I used to read)"
        },
        {
          english: "We were eating when you arrived.",
          answer: "Estábamos comiendo cuando llegaste.",
          explanation: "Estábamos shows ongoing past action (we were eating)"
        },
        {
          english: "They used to live in Mexico.",
          answer: "Vivían en México.",
          explanation: "Vivían shows past state or habitual action (they used to live)"
        },
        {
          english: "She was very tall as a teenager.",
          answer: "Era muy alta cuando era adolescente.",
          explanation: "Era shows past characteristic or state (she was)"
        },
        {
          english: "You always used to help your mother.",
          answer: "Siempre ayudabas a tu madre.",
          explanation: "Ayudabas shows habitual past action (you used to help)"
        }
      ]
    }
  ]
};

export default function SpanishImperfectPracticePage() {
  return <GrammarPractice {...practiceData} />;
}

import { Metadata } from 'next';
import { GrammarPractice } from '@/components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Irregular Verbs Practice | LanguageGems',
  description: 'Practice Spanish irregular verbs with interactive exercises. Master high-frequency irregular verb conjugations.',
  keywords: 'Spanish irregular verbs practice, irregular verb exercises, Spanish irregular conjugation practice',
  openGraph: {
    title: 'Spanish Irregular Verbs Practice | LanguageGems',
    description: 'Practice Spanish irregular verbs with interactive exercises. Master high-frequency irregular verb conjugations.',
    url: 'https://languagegems.com/grammar/spanish/verbs/irregular-verbs/practice',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/irregular-verbs/practice',
  },
};

const practiceData = {
  title: "Spanish Irregular Verbs Practice",
  description: "Practice conjugating Spanish irregular verbs with these interactive exercises.",
  exercises: [
    {
      type: "conjugation",
      instruction: "Conjugate the irregular verb in parentheses in the present tense.",
      items: [
        {
          spanish: "Yo _____ (ser) estudiante de medicina.",
          english: "I am a medical student.",
          answer: "soy",
          explanation: "Ser is irregular: yo soy (I am)"
        },
        {
          spanish: "Nosotros _____ (tener) una casa grande.",
          english: "We have a big house.",
          answer: "tenemos",
          explanation: "Tener is irregular: nosotros tenemos (we have)"
        },
        {
          spanish: "Ella _____ (ir) al trabajo en autobús.",
          english: "She goes to work by bus.",
          answer: "va",
          explanation: "Ir is irregular: ella va (she goes)"
        },
        {
          spanish: "¿Qué _____ (hacer) tú los fines de semana?",
          english: "What do you do on weekends?",
          answer: "haces",
          explanation: "Hacer is irregular: tú haces (you do/make)"
        },
        {
          spanish: "Ellos _____ (estar) en el parque ahora.",
          english: "They are in the park now.",
          answer: "están",
          explanation: "Estar is irregular: ellos están (they are)"
        },
        {
          spanish: "Yo _____ (saber) hablar tres idiomas.",
          english: "I know how to speak three languages.",
          answer: "sé",
          explanation: "Saber is irregular: yo sé (I know)"
        },
        {
          spanish: "Ustedes _____ (venir) a cenar con nosotros.",
          english: "You all come to have dinner with us.",
          answer: "vienen",
          explanation: "Venir is irregular: ustedes vienen (you all come)"
        },
        {
          spanish: "Mi hermano _____ (poner) la mesa para la cena.",
          english: "My brother sets the table for dinner.",
          answer: "pone",
          explanation: "Poner is irregular: él pone (he puts/sets)"
        },
        {
          spanish: "Nosotros _____ (salir) de casa a las ocho.",
          english: "We leave home at eight.",
          answer: "salimos",
          explanation: "Salir is irregular: nosotros salimos (we leave/go out)"
        },
        {
          spanish: "Tú _____ (decir) cosas muy interesantes.",
          english: "You say very interesting things.",
          answer: "dices",
          explanation: "Decir is irregular: tú dices (you say/tell)"
        }
      ]
    },
    {
      type: "multiple-choice",
      instruction: "Choose the correct irregular verb form.",
      items: [
        {
          question: "I can speak Spanish well.",
          spanish: "Yo _____ hablar español bien.",
          options: ["puedo", "podo", "puede", "poden"],
          answer: "puedo",
          explanation: "Poder is irregular: yo puedo (I can)"
        },
        {
          question: "She gives presents to her children.",
          spanish: "Ella _____ regalos a sus hijos.",
          options: ["da", "doy", "das", "dan"],
          answer: "da",
          explanation: "Dar is irregular: ella da (she gives)"
        },
        {
          question: "We see our friends every day.",
          spanish: "Nosotros _____ a nuestros amigos todos los días.",
          options: ["vemos", "veemos", "vimos", "veremos"],
          answer: "vemos",
          explanation: "Ver is irregular: nosotros vemos (we see)"
        },
        {
          question: "You bring your books to class.",
          spanish: "Tú _____ tus libros a clase.",
          options: ["traes", "trais", "traigo", "trae"],
          answer: "traes",
          explanation: "Traer is irregular: tú traes (you bring)"
        },
        {
          question: "They want to travel to Europe.",
          spanish: "Ellos _____ viajar a Europa.",
          options: ["queren", "quieren", "queren", "quiero"],
          answer: "quieren",
          explanation: "Querer is irregular (stem-changing): ellos quieren (they want)"
        }
      ]
    },
    {
      type: "translation",
      instruction: "Translate these sentences using irregular verbs.",
      items: [
        {
          english: "I know the answer to that question.",
          answer: "Sé la respuesta a esa pregunta.",
          explanation: "Saber is irregular: sé (I know)"
        },
        {
          english: "We are very happy today.",
          answer: "Estamos muy felices hoy.",
          explanation: "Estar is irregular: estamos (we are)"
        },
        {
          english: "They have two dogs and a cat.",
          answer: "Tienen dos perros y un gato.",
          explanation: "Tener is irregular: tienen (they have)"
        },
        {
          english: "She goes to the gym every morning.",
          answer: "Va al gimnasio todas las mañanas.",
          explanation: "Ir is irregular: va (she goes)"
        },
        {
          english: "You do your homework after school.",
          answer: "Haces tu tarea después de la escuela.",
          explanation: "Hacer is irregular: haces (you do)"
        }
      ]
    }
  ]
};

export default function SpanishIrregularVerbsPracticePage() {
  return <GrammarPractice {...practiceData} />;
}

import { Metadata } from 'next';
import { GrammarPractice } from '@/components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Future Tense Practice | LanguageGems',
  description: 'Practice Spanish future tense with interactive exercises. Master regular and irregular future conjugations.',
  keywords: 'Spanish future practice, future tense exercises, Spanish future conjugation practice',
  openGraph: {
    title: 'Spanish Future Tense Practice | LanguageGems',
    description: 'Practice Spanish future tense with interactive exercises. Master regular and irregular future conjugations.',
    url: 'https://languagegems.com/grammar/spanish/verbs/future/practice',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/future/practice',
  },
};

const practiceData = {
  title: "Spanish Future Tense Practice",
  description: "Practice conjugating Spanish verbs in the future tense with these interactive exercises.",
  exercises: [
    {
      type: "conjugation",
      instruction: "Conjugate the verb in parentheses in the future tense.",
      items: [
        {
          spanish: "Mañana yo _____ (hablar) con el director.",
          english: "Tomorrow I will speak with the director.",
          answer: "hablaré",
          explanation: "Regular -ar verbs in future: yo form ends in -é"
        },
        {
          spanish: "Ellos _____ (comer) en el restaurante nuevo.",
          english: "They will eat at the new restaurant.",
          answer: "comerán",
          explanation: "Regular -er verbs in future: ellos form ends in -án"
        },
        {
          spanish: "Nosotros _____ (vivir) en España el próximo año.",
          english: "We will live in Spain next year.",
          answer: "viviremos",
          explanation: "Regular -ir verbs in future: nosotros form ends in -emos"
        },
        {
          spanish: "¿Qué _____ (hacer) tú este fin de semana?",
          english: "What will you do this weekend?",
          answer: "harás",
          explanation: "Hacer is irregular in future: har- + ás = harás"
        },
        {
          spanish: "Ella _____ (tener) que estudiar mucho.",
          english: "She will have to study a lot.",
          answer: "tendrá",
          explanation: "Tener is irregular in future: tendr- + á = tendrá"
        },
        {
          spanish: "Ustedes _____ (poder) venir a la fiesta.",
          english: "You all will be able to come to the party.",
          answer: "podrán",
          explanation: "Poder is irregular in future: podr- + án = podrán"
        },
        {
          spanish: "Yo _____ (salir) temprano del trabajo.",
          english: "I will leave work early.",
          answer: "saldré",
          explanation: "Salir is irregular in future: saldr- + é = saldré"
        },
        {
          spanish: "Los estudiantes _____ (venir) a clase mañana.",
          english: "The students will come to class tomorrow.",
          answer: "vendrán",
          explanation: "Venir is irregular in future: vendr- + án = vendrán"
        },
        {
          spanish: "Tú _____ (decir) la verdad, ¿no?",
          english: "You will tell the truth, right?",
          answer: "dirás",
          explanation: "Decir is irregular in future: dir- + ás = dirás"
        },
        {
          spanish: "Mi hermana _____ (poner) la mesa para la cena.",
          english: "My sister will set the table for dinner.",
          answer: "pondrá",
          explanation: "Poner is irregular in future: pondr- + á = pondrá"
        }
      ]
    },
    {
      type: "multiple-choice",
      instruction: "Choose the correct future form.",
      items: [
        {
          question: "Tomorrow we _____ to the movies.",
          spanish: "Mañana nosotros _____ al cine.",
          options: ["vamos", "fuimos", "iremos", "íbamos"],
          answer: "iremos",
          explanation: "Ir is irregular in future: iremos (we will go)"
        },
        {
          question: "She _____ the book next week.",
          spanish: "Ella _____ el libro la próxima semana.",
          options: ["lee", "leyó", "leerá", "leía"],
          answer: "leerá",
          explanation: "Regular -er verb in future: leerá (she will read)"
        },
        {
          question: "They _____ at the hotel.",
          spanish: "Ellos _____ en el hotel.",
          options: ["quedan", "quedaron", "quedarán", "quedaban"],
          answer: "quedarán",
          explanation: "Regular -ar verb in future: quedarán (they will stay)"
        },
        {
          question: "I _____ my homework tonight.",
          spanish: "Yo _____ mi tarea esta noche.",
          options: ["hago", "hice", "haré", "hacía"],
          answer: "haré",
          explanation: "Hacer is irregular in future: haré (I will do)"
        },
        {
          question: "You _____ very well in the exam.",
          spanish: "Tú _____ muy bien en el examen.",
          options: ["sales", "saliste", "saldrás", "salías"],
          answer: "saldrás",
          explanation: "Salir is irregular in future: saldrás (you will do/come out)"
        }
      ]
    },
    {
      type: "translation",
      instruction: "Translate these sentences using the future tense.",
      items: [
        {
          english: "I will buy a new house next year.",
          answer: "Compraré una casa nueva el próximo año.",
          explanation: "Regular -ar verb in future: compraré (I will buy)"
        },
        {
          english: "We will visit our friends on Sunday.",
          answer: "Visitaremos a nuestros amigos el domingo.",
          explanation: "Regular -ar verb in future: visitaremos (we will visit)"
        },
        {
          english: "They will arrive late to the meeting.",
          answer: "Llegarán tarde a la reunión.",
          explanation: "Regular -ar verb in future: llegarán (they will arrive)"
        },
        {
          english: "She will write a letter to her mother.",
          answer: "Escribirá una carta a su madre.",
          explanation: "Regular -ir verb in future: escribirá (she will write)"
        },
        {
          english: "You will know the answer tomorrow.",
          answer: "Sabrás la respuesta mañana.",
          explanation: "Saber is irregular in future: sabrás (you will know)"
        }
      ]
    }
  ]
};

export default function SpanishFuturePracticePage() {
  return <GrammarPractice {...practiceData} />;
}

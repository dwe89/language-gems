import { Metadata } from 'next';
import { GrammarPractice } from '@/components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Ser vs Estar Practice | LanguageGems',
  description: 'Practice Spanish ser vs estar with interactive exercises. Master the difference between permanent and temporary states.',
  keywords: 'Spanish ser vs estar practice, ser estar exercises, Spanish to be practice',
  openGraph: {
    title: 'Spanish Ser vs Estar Practice | LanguageGems',
    description: 'Practice Spanish ser vs estar with interactive exercises. Master the difference between permanent and temporary states.',
    url: 'https://languagegems.com/grammar/spanish/verbs/ser-vs-estar/practice',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/ser-vs-estar/practice',
  },
};

const practiceData = {
  title: "Spanish Ser vs Estar Practice",
  description: "Practice using ser and estar correctly with these interactive exercises.",
  exercises: [
    {
      type: "conjugation",
      instruction: "Choose the correct form of ser or estar.",
      items: [
        {
          spanish: "Mi hermana _____ médica.",
          english: "My sister is a doctor.",
          answer: "es",
          explanation: "Use SER for professions: es (she is - profession)"
        },
        {
          spanish: "Los niños _____ jugando en el parque.",
          english: "The children are playing in the park.",
          answer: "están",
          explanation: "Use ESTAR for ongoing actions: están (they are - temporary action)"
        },
        {
          spanish: "La comida _____ muy rica hoy.",
          english: "The food is very delicious today.",
          answer: "está",
          explanation: "Use ESTAR for taste/condition: está (it is - temporary condition)"
        },
        {
          spanish: "Nosotros _____ de México.",
          english: "We are from Mexico.",
          answer: "somos",
          explanation: "Use SER for origin: somos (we are - permanent origin)"
        },
        {
          spanish: "El libro _____ en la mesa.",
          english: "The book is on the table.",
          answer: "está",
          explanation: "Use ESTAR for location: está (it is - temporary location)"
        },
        {
          spanish: "Ella _____ muy inteligente.",
          english: "She is very intelligent.",
          answer: "es",
          explanation: "Use SER for characteristics: es (she is - permanent trait)"
        },
        {
          spanish: "Yo _____ cansado después del trabajo.",
          english: "I am tired after work.",
          answer: "estoy",
          explanation: "Use ESTAR for temporary states: estoy (I am - temporary condition)"
        },
        {
          spanish: "La fiesta _____ en mi casa.",
          english: "The party is at my house.",
          answer: "es",
          explanation: "Use SER for events/location of events: es (it is - event location)"
        },
        {
          spanish: "Tú _____ muy guapo hoy.",
          english: "You look very handsome today.",
          answer: "estás",
          explanation: "Use ESTAR for appearance/how someone looks: estás (you are - temporary appearance)"
        },
        {
          spanish: "El café _____ caliente.",
          english: "The coffee is hot.",
          answer: "está",
          explanation: "Use ESTAR for temperature: está (it is - temporary condition)"
        }
      ]
    },
    {
      type: "multiple-choice",
      instruction: "Choose ser or estar for each sentence.",
      items: [
        {
          question: "My father is a teacher.",
          spanish: "Mi padre _____ profesor.",
          options: ["es", "está", "son", "están"],
          answer: "es",
          explanation: "Use SER for professions: es profesor (he is a teacher)"
        },
        {
          question: "The students are in the classroom.",
          spanish: "Los estudiantes _____ en el aula.",
          options: ["son", "están", "es", "está"],
          answer: "están",
          explanation: "Use ESTAR for location: están (they are - in the classroom)"
        },
        {
          question: "She is very happy today.",
          spanish: "Ella _____ muy feliz hoy.",
          options: ["es", "está", "son", "están"],
          answer: "está",
          explanation: "Use ESTAR for emotions/temporary states: está feliz (she is happy)"
        },
        {
          question: "The car is blue.",
          spanish: "El coche _____ azul.",
          options: ["es", "está", "son", "están"],
          answer: "es",
          explanation: "Use SER for color/permanent characteristics: es azul (it is blue)"
        },
        {
          question: "We are ready to go.",
          spanish: "Nosotros _____ listos para ir.",
          options: ["somos", "estamos", "es", "está"],
          answer: "estamos",
          explanation: "Use ESTAR for readiness/temporary states: estamos listos (we are ready)"
        }
      ]
    },
    {
      type: "translation",
      instruction: "Translate these sentences using ser or estar correctly.",
      items: [
        {
          english: "I am a student.",
          answer: "Soy estudiante.",
          explanation: "Use SER for professions/roles: soy (I am - permanent role)"
        },
        {
          english: "The door is closed.",
          answer: "La puerta está cerrada.",
          explanation: "Use ESTAR for states/conditions: está cerrada (it is closed)"
        },
        {
          english: "They are from Spain.",
          answer: "Son de España.",
          explanation: "Use SER for origin: son (they are - permanent origin)"
        },
        {
          english: "The soup is cold.",
          answer: "La sopa está fría.",
          explanation: "Use ESTAR for temperature: está fría (it is cold - temporary condition)"
        },
        {
          english: "She is tall and blonde.",
          answer: "Es alta y rubia.",
          explanation: "Use SER for physical characteristics: es (she is - permanent traits)"
        }
      ]
    }
  ]
};

export default function SpanishSerVsEstarPracticePage() {
  return <GrammarPractice {...practiceData} />;
}

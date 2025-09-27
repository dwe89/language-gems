import { Metadata } from 'next';
import { GrammarPractice } from '@/components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Conditional Tense Practice | LanguageGems',
  description: 'Practice Spanish conditional tense with interactive exercises. Master hypothetical situations and polite requests.',
  keywords: 'Spanish conditional practice, conditional tense exercises, Spanish conditional conjugation practice',
  openGraph: {
    title: 'Spanish Conditional Tense Practice | LanguageGems',
    description: 'Practice Spanish conditional tense with interactive exercises. Master hypothetical situations and polite requests.',
    url: 'https://languagegems.com/grammar/spanish/verbs/conditional/practice',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/conditional/practice',
  },
};

const practiceData = {
  title: "Spanish Conditional Tense Practice",
  description: "Practice conjugating Spanish verbs in the conditional tense with these interactive exercises.",
  exercises: [
    {
      type: "conjugation",
      instruction: "Conjugate the verb in parentheses in the conditional tense.",
      items: [
        {
          spanish: "Yo _____ (hablar) con él si tuviera tiempo.",
          english: "I would speak with him if I had time.",
          answer: "hablaría",
          explanation: "Regular -ar verbs in conditional: yo form ends in -ía"
        },
        {
          spanish: "Ellos _____ (comer) más si tuvieran hambre.",
          english: "They would eat more if they were hungry.",
          answer: "comerían",
          explanation: "Regular -er verbs in conditional: ellos form ends in -ían"
        },
        {
          spanish: "Nosotros _____ (vivir) en España si pudiéramos.",
          english: "We would live in Spain if we could.",
          answer: "viviríamos",
          explanation: "Regular -ir verbs in conditional: nosotros form ends in -íamos"
        },
        {
          spanish: "¿Qué _____ (hacer) tú en mi situación?",
          english: "What would you do in my situation?",
          answer: "harías",
          explanation: "Hacer is irregular in conditional: har- + ías = harías"
        },
        {
          spanish: "Ella _____ (tener) más dinero si trabajara más.",
          english: "She would have more money if she worked more.",
          answer: "tendría",
          explanation: "Tener is irregular in conditional: tendr- + ía = tendría"
        },
        {
          spanish: "¿_____ (poder) ustedes ayudarme, por favor?",
          english: "Could you all help me, please?",
          answer: "Podrían",
          explanation: "Poder is irregular in conditional: podr- + ían = podrían (polite request)"
        },
        {
          spanish: "Yo _____ (salir) contigo, pero tengo que estudiar.",
          english: "I would go out with you, but I have to study.",
          answer: "saldría",
          explanation: "Salir is irregular in conditional: saldr- + ía = saldría"
        },
        {
          spanish: "Los niños _____ (venir) si sus padres los dejaran.",
          english: "The children would come if their parents let them.",
          answer: "vendrían",
          explanation: "Venir is irregular in conditional: vendr- + ían = vendrían"
        },
        {
          spanish: "Tú _____ (decir) la verdad, ¿verdad?",
          english: "You would tell the truth, right?",
          answer: "dirías",
          explanation: "Decir is irregular in conditional: dir- + ías = dirías"
        },
        {
          spanish: "Mi hermana _____ (poner) música si tuviera altavoces.",
          english: "My sister would put on music if she had speakers.",
          answer: "pondría",
          explanation: "Poner is irregular in conditional: pondr- + ía = pondría"
        }
      ]
    },
    {
      type: "multiple-choice",
      instruction: "Choose the correct conditional form.",
      items: [
        {
          question: "I would like to travel to Japan.",
          spanish: "Me _____ viajar a Japón.",
          options: ["gusta", "gustó", "gustaría", "gustará"],
          answer: "gustaría",
          explanation: "Gustar in conditional: gustaría (I would like)"
        },
        {
          question: "She would read the book if she had time.",
          spanish: "Ella _____ el libro si tuviera tiempo.",
          options: ["lee", "leyó", "leería", "leerá"],
          answer: "leería",
          explanation: "Regular -er verb in conditional: leería (she would read)"
        },
        {
          question: "They would stay at the hotel.",
          spanish: "Ellos _____ en el hotel.",
          options: ["quedan", "quedaron", "quedarían", "quedarán"],
          answer: "quedarían",
          explanation: "Regular -ar verb in conditional: quedarían (they would stay)"
        },
        {
          question: "Could you help me?",
          spanish: "¿_____ ayudarme?",
          options: ["Puedes", "Pudiste", "Podrías", "Podrás"],
          answer: "Podrías",
          explanation: "Poder in conditional for polite request: podrías (could you)"
        },
        {
          question: "We would know the answer if we studied.",
          spanish: "Nosotros _____ la respuesta si estudiáramos.",
          options: ["sabemos", "supimos", "sabríamos", "sabremos"],
          answer: "sabríamos",
          explanation: "Saber is irregular in conditional: sabríamos (we would know)"
        }
      ]
    },
    {
      type: "translation",
      instruction: "Translate these sentences using the conditional tense.",
      items: [
        {
          english: "I would buy a new car if I had money.",
          answer: "Compraría un coche nuevo si tuviera dinero.",
          explanation: "Regular -ar verb in conditional: compraría (I would buy)"
        },
        {
          english: "Would you visit us next week?",
          answer: "¿Nos visitarías la próxima semana?",
          explanation: "Regular -ar verb in conditional: visitarías (would you visit)"
        },
        {
          english: "They would arrive early if they could.",
          answer: "Llegarían temprano si pudieran.",
          explanation: "Regular -ar verb in conditional: llegarían (they would arrive)"
        },
        {
          english: "She would write more letters if she had time.",
          answer: "Escribiría más cartas si tuviera tiempo.",
          explanation: "Regular -ir verb in conditional: escribiría (she would write)"
        },
        {
          english: "Could you tell me the time?",
          answer: "¿Podrías decirme la hora?",
          explanation: "Poder in conditional for polite request: podrías (could you)"
        }
      ]
    }
  ]
};

export default function SpanishConditionalPracticePage() {
  return <GrammarPractice {...practiceData} />;
}

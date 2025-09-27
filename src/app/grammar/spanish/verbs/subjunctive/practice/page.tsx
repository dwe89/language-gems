import { Metadata } from 'next';
import { GrammarPractice } from '@/components/grammar/GrammarPractice';

export const metadata: Metadata = {
  title: 'Spanish Present Subjunctive Practice | LanguageGems',
  description: 'Practice Spanish present subjunctive with interactive exercises. Master emotions, doubt, and subjunctive triggers.',
  keywords: 'Spanish subjunctive practice, present subjunctive exercises, Spanish subjunctive conjugation practice',
  openGraph: {
    title: 'Spanish Present Subjunctive Practice | LanguageGems',
    description: 'Practice Spanish present subjunctive with interactive exercises. Master emotions, doubt, and subjunctive triggers.',
    url: 'https://languagegems.com/grammar/spanish/verbs/subjunctive/practice',
    siteName: 'LanguageGems',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://languagegems.com/grammar/spanish/verbs/subjunctive/practice',
  },
};

const practiceData = {
  title: "Spanish Present Subjunctive Practice",
  description: "Practice conjugating Spanish verbs in the present subjunctive with these interactive exercises.",
  exercises: [
    {
      type: "conjugation",
      instruction: "Conjugate the verb in parentheses in the present subjunctive.",
      items: [
        {
          spanish: "Espero que tú _____ (hablar) con él pronto.",
          english: "I hope that you speak with him soon.",
          answer: "hables",
          explanation: "Regular -ar verbs in subjunctive: tú form ends in -es (opposite vowel)"
        },
        {
          spanish: "Es importante que ellos _____ (comer) bien.",
          english: "It's important that they eat well.",
          answer: "coman",
          explanation: "Regular -er verbs in subjunctive: ellos form ends in -an (opposite vowel)"
        },
        {
          spanish: "Dudo que nosotros _____ (vivir) allí.",
          english: "I doubt that we live there.",
          answer: "vivamos",
          explanation: "Regular -ir verbs in subjunctive: nosotros form ends in -amos (opposite vowel)"
        },
        {
          spanish: "Quiero que ella _____ (ser) feliz.",
          english: "I want her to be happy.",
          answer: "sea",
          explanation: "Ser is irregular in subjunctive: sea (she be)"
        },
        {
          spanish: "Es necesario que yo _____ (ir) al médico.",
          english: "It's necessary that I go to the doctor.",
          answer: "vaya",
          explanation: "Ir is irregular in subjunctive: vaya (I go)"
        },
        {
          spanish: "Me alegra que ustedes _____ (tener) éxito.",
          english: "I'm glad that you all are successful.",
          answer: "tengan",
          explanation: "Tener is irregular in subjunctive: tengan (you all have)"
        },
        {
          spanish: "Es posible que él _____ (hacer) la tarea.",
          english: "It's possible that he does the homework.",
          answer: "haga",
          explanation: "Hacer is irregular in subjunctive: haga (he do/make)"
        },
        {
          spanish: "Ojalá que _____ (venir) a la fiesta.",
          english: "I hope they come to the party.",
          answer: "vengan",
          explanation: "Venir is irregular in subjunctive: vengan (they come)"
        },
        {
          spanish: "No creo que tú _____ (saber) la respuesta.",
          english: "I don't think you know the answer.",
          answer: "sepas",
          explanation: "Saber is irregular in subjunctive: sepas (you know)"
        },
        {
          spanish: "Es mejor que nosotros _____ (salir) temprano.",
          english: "It's better that we leave early.",
          answer: "salgamos",
          explanation: "Salir is irregular in subjunctive: salgamos (we leave)"
        }
      ]
    },
    {
      type: "multiple-choice",
      instruction: "Choose the correct subjunctive form.",
      items: [
        {
          question: "I hope you have a good time.",
          spanish: "Espero que tú _____ bien.",
          options: ["pasas", "pasaste", "pases", "pasarás"],
          answer: "pases",
          explanation: "After 'espero que' use subjunctive: pases (you have a good time)"
        },
        {
          question: "It's important that she studies.",
          spanish: "Es importante que ella _____.",
          options: ["estudia", "estudió", "estudie", "estudiará"],
          answer: "estudie",
          explanation: "After impersonal expressions use subjunctive: estudie (she study)"
        },
        {
          question: "I doubt they can come.",
          spanish: "Dudo que ellos _____ venir.",
          options: ["pueden", "pudieron", "puedan", "podrán"],
          answer: "puedan",
          explanation: "After expressions of doubt use subjunctive: puedan (they can)"
        },
        {
          question: "I want you to be careful.",
          spanish: "Quiero que tú _____ cuidado.",
          options: ["tienes", "tuviste", "tengas", "tendrás"],
          answer: "tengas",
          explanation: "After verbs of wanting use subjunctive: tengas (you have/be)"
        },
        {
          question: "It's possible that it rains.",
          spanish: "Es posible que _____.",
          options: ["llueve", "llovió", "llueva", "lloverá"],
          answer: "llueva",
          explanation: "After expressions of possibility use subjunctive: llueva (it rain)"
        }
      ]
    },
    {
      type: "translation",
      instruction: "Translate these sentences using the present subjunctive.",
      items: [
        {
          english: "I hope you feel better.",
          answer: "Espero que te sientas mejor.",
          explanation: "After 'espero que' use subjunctive: te sientas (you feel)"
        },
        {
          english: "It's necessary that we work together.",
          answer: "Es necesario que trabajemos juntos.",
          explanation: "After impersonal expressions use subjunctive: trabajemos (we work)"
        },
        {
          english: "I don't think they understand.",
          answer: "No creo que entiendan.",
          explanation: "After negative expressions of belief use subjunctive: entiendan (they understand)"
        },
        {
          english: "She wants him to call her.",
          answer: "Ella quiere que él la llame.",
          explanation: "After verbs of wanting use subjunctive: llame (he call)"
        },
        {
          english: "I'm afraid they might be late.",
          answer: "Tengo miedo de que lleguen tarde.",
          explanation: "After expressions of emotion use subjunctive: lleguen (they arrive)"
        }
      ]
    }
  ]
};

export default function SpanishSubjunctivePracticePage() {
  return <GrammarPractice {...practiceData} />;
}

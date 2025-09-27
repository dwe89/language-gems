import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'causative-verbs',
  title: 'Spanish Causative Verbs',
  description: 'Master Spanish causative verbs including hacer, dejar, mandar, and permitir with comprehensive explanations and usage examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish causative verbs',
    'hacer + infinitive',
    'dejar + infinitive',
    'mandar + infinitive',
    'causative constructions spanish'
  ],
  examples: [
    'Hago estudiar a mi hijo (I make my son study)',
    'Dejo salir a los niños (I let the children go out)',
    'Mando limpiar la casa (I order the house to be cleaned)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Causative Verbs?',
    content: `Spanish causative verbs express the idea that someone causes or allows another person to do something. The main causative verbs are **hacer** (to make/have), **dejar** (to let/allow), **mandar** (to order), and **permitir** (to permit).

These constructions are essential for expressing complex relationships between actions and agents in Spanish.`,
    examples: [
      {
        spanish: 'Hago estudiar a mi hermano.',
        english: 'I make my brother study.',
        highlight: ['Hago estudiar']
      },
      {
        spanish: 'Dejo jugar a los niños.',
        english: 'I let the children play.',
        highlight: ['Dejo jugar']
      },
      {
        spanish: 'Mando arreglar el coche.',
        english: 'I have the car repaired.',
        highlight: ['Mando arreglar']
      }
    ]
  },
  {
    title: 'Hacer + Infinitive (To Make/Have)',
    content: `"Hacer" is the most common causative verb, expressing that someone makes or has someone else do something.`,
    subsections: [
      {
        title: 'Structure: Hacer + Infinitive + Direct Object',
        content: 'When the person doing the action is the direct object:',
        examples: [
          {
            spanish: 'Hago estudiar a María.',
            english: 'I make María study.',
            highlight: ['Hago estudiar a María']
          },
          {
            spanish: 'La hago estudiar.',
            english: 'I make her study.',
            highlight: ['La hago estudiar']
          },
          {
            spanish: 'Hice llorar al niño.',
            english: 'I made the child cry.',
            highlight: ['Hice llorar al niño']
          }
        ]
      },
      {
        title: 'Structure: Hacer + que + Subjunctive',
        content: 'Alternative structure using "que" + subjunctive:',
        examples: [
          {
            spanish: 'Hago que María estudie.',
            english: 'I make María study.',
            highlight: ['Hago que María estudie']
          },
          {
            spanish: 'Hice que el niño llorara.',
            english: 'I made the child cry.',
            highlight: ['Hice que el niño llorara']
          }
        ]
      },
      {
        title: 'Hacer + Infinitive (Things)',
        content: 'When having things done (services):',
        examples: [
          {
            spanish: 'Hago reparar el coche.',
            english: 'I have the car repaired.',
            highlight: ['Hago reparar']
          },
          {
            spanish: 'Hice construir una casa.',
            english: 'I had a house built.',
            highlight: ['Hice construir']
          },
          {
            spanish: 'Haré cortar el pelo.',
            english: 'I will have my hair cut.',
            highlight: ['Haré cortar']
          }
        ]
      }
    ]
  },
  {
    title: 'Dejar + Infinitive (To Let/Allow)',
    content: `"Dejar" expresses permission or allowing someone to do something.`,
    examples: [
      {
        spanish: 'Dejo salir a mi hija.',
        english: 'I let my daughter go out.',
        highlight: ['Dejo salir']
      },
      {
        spanish: 'No me dejan fumar aquí.',
        english: 'They don\'t let me smoke here.',
        highlight: ['No me dejan fumar']
      },
      {
        spanish: 'Dejé que los niños jugaran.',
        english: 'I let the children play.',
        highlight: ['Dejé que los niños jugaran']
      },
      {
        spanish: '¿Me dejas usar tu coche?',
        english: 'Will you let me use your car?',
        highlight: ['Me dejas usar']
      }
    ]
  },
  {
    title: 'Mandar + Infinitive (To Order/Command)',
    content: `"Mandar" expresses ordering or commanding someone to do something.`,
    examples: [
      {
        spanish: 'Mando limpiar la casa.',
        english: 'I order the house to be cleaned.',
        highlight: ['Mando limpiar']
      },
      {
        spanish: 'El jefe mandó trabajar los sábados.',
        english: 'The boss ordered working on Saturdays.',
        highlight: ['mandó trabajar']
      },
      {
        spanish: 'Mandé que vinieran temprano.',
        english: 'I ordered them to come early.',
        highlight: ['Mandé que vinieran']
      },
      {
        spanish: 'Te mando estudiar más.',
        english: 'I order you to study more.',
        highlight: ['Te mando estudiar']
      }
    ]
  },
  {
    title: 'Other Causative Verbs',
    content: `Additional verbs that can function as causatives in Spanish.`,
    subsections: [
      {
        title: 'Permitir (To Permit/Allow)',
        content: 'More formal than "dejar":',
        examples: [
          {
            spanish: 'No permito que fumes en casa.',
            english: 'I don\'t allow smoking in the house.',
            highlight: ['No permito que fumes']
          },
          {
            spanish: 'Permíteme ayudarte.',
            english: 'Let me help you.',
            highlight: ['Permíteme ayudarte']
          }
        ]
      },
      {
        title: 'Obligar (To Force/Oblige)',
        content: 'Stronger than "hacer":',
        examples: [
          {
            spanish: 'Me obligaron a firmar el contrato.',
            english: 'They forced me to sign the contract.',
            highlight: ['Me obligaron a firmar']
          },
          {
            spanish: 'La situación nos obliga a cambiar.',
            english: 'The situation forces us to change.',
            highlight: ['nos obliga a cambiar']
          }
        ]
      },
      {
        title: 'Impedir (To Prevent/Stop)',
        content: 'Negative causative - preventing action:',
        examples: [
          {
            spanish: 'Impido que salgan solos.',
            english: 'I prevent them from going out alone.',
            highlight: ['Impido que salgan']
          },
          {
            spanish: 'La lluvia impidió jugar al fútbol.',
            english: 'The rain prevented playing football.',
            highlight: ['impidió jugar']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun Placement with Causatives',
    content: `Rules for placing pronouns with causative constructions.`,
    examples: [
      {
        spanish: 'Before the causative verb: Lo hago estudiar.',
        english: 'I make him study.',
        highlight: ['Lo hago estudiar']
      },
      {
        spanish: 'After the infinitive: Hago estudiarle. (less common)',
        english: 'I make him study.',
        highlight: ['Hago estudiarle']
      },
      {
        spanish: 'With reflexive: Me hago cortar el pelo.',
        english: 'I have my hair cut.',
        highlight: ['Me hago cortar']
      },
      {
        spanish: 'Double pronoun: Se lo hago hacer.',
        english: 'I make him do it.',
        highlight: ['Se lo hago hacer']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Infinitive Constructions', url: '/grammar/spanish/verbs/infinitive-constructions' },
  { title: 'Present Subjunctive', url: '/grammar/spanish/verbs/subjunctive-present' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs' }
];

export default function SpanishCausativeVerbsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'causative-verbs',
              title: 'Spanish Causative Verbs',
              description: 'Master Spanish causative verbs with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 30
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'causative-verbs',
              title: 'Spanish Causative Verbs'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="causative-verbs"
        title="Spanish Causative Verbs"
        description="Master Spanish causative verbs with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={30}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/causative-verbs/practice"
        quizUrl="/grammar/spanish/verbs/causative-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=causative-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

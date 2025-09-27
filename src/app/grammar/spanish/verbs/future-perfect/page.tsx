import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'future-perfect',
  title: 'Spanish Future Perfect Tense',
  description: 'Master the Spanish future perfect tense with comprehensive explanations, formation rules, and usage examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish future perfect',
    'futuro perfecto',
    'habré hablado',
    'spanish compound tenses',
    'future perfect conjugation'
  ],
  examples: [
    'Habré terminado para las cinco (I will have finished by five)',
    'Habrán llegado antes de la cena (They will have arrived before dinner)',
    'Para entonces ya habremos comido (By then we will have already eaten)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Future Perfect Tense?',
    content: `The Spanish future perfect tense (**futuro perfecto**) expresses actions that will be completed before a specific point in the future. It is formed using the future tense of **haber** + past participle.

This tense is used to express what will have happened by a certain time in the future, and it's also used for speculation about past events.`,
    examples: [
      {
        spanish: 'Para mañana habré terminado el proyecto.',
        english: 'By tomorrow I will have finished the project.',
        highlight: ['habré terminado']
      },
      {
        spanish: 'Cuando llegues, ya habremos cenado.',
        english: 'When you arrive, we will have already had dinner.',
        highlight: ['habremos cenado']
      },
      {
        spanish: 'Habrá sido muy difícil para él.',
        english: 'It must have been very difficult for him. (speculation)',
        highlight: ['Habrá sido']
      }
    ]
  },
  {
    title: 'Formation of the Future Perfect',
    content: `The future perfect is formed with the future tense of haber + past participle.`,
    subsections: [
      {
        title: 'Conjugation of Haber (Future)',
        content: 'The auxiliary verb haber in the future tense:',
        conjugationTable: {
          title: 'Haber - Future Tense',
          conjugations: [
            { pronoun: 'yo', form: 'habré', english: 'I will have' },
            { pronoun: 'tú', form: 'habrás', english: 'you will have' },
            { pronoun: 'él/ella/usted', form: 'habrá', english: 'he/she/you will have' },
            { pronoun: 'nosotros', form: 'habremos', english: 'we will have' },
            { pronoun: 'vosotros', form: 'habréis', english: 'you all will have' },
            { pronoun: 'ellos/ellas/ustedes', form: 'habrán', english: 'they/you all will have' }
          ]
        }
      },
      {
        title: 'Complete Future Perfect Conjugation',
        content: 'Example with hablar (to speak):',
        conjugationTable: {
          title: 'Hablar - Future Perfect',
          conjugations: [
            { pronoun: 'yo', form: 'habré hablado', english: 'I will have spoken' },
            { pronoun: 'tú', form: 'habrás hablado', english: 'you will have spoken' },
            { pronoun: 'él/ella/usted', form: 'habrá hablado', english: 'he/she/you will have spoken' },
            { pronoun: 'nosotros', form: 'habremos hablado', english: 'we will have spoken' },
            { pronoun: 'vosotros', form: 'habréis hablado', english: 'you all will have spoken' },
            { pronoun: 'ellos/ellas/ustedes', form: 'habrán hablado', english: 'they/you all will have spoken' }
          ]
        }
      }
    ]
  },
  {
    title: 'Uses of the Future Perfect',
    content: `The future perfect has several specific uses in Spanish.`,
    subsections: [
      {
        title: 'Actions Completed Before a Future Point',
        content: 'The main use - expressing actions that will be completed before a specific future time:',
        examples: [
          {
            spanish: 'Para el viernes habré terminado el informe.',
            english: 'By Friday I will have finished the report.',
            highlight: ['habré terminado']
          },
          {
            spanish: 'Cuando vuelvas, ya habremos limpiado la casa.',
            english: 'When you return, we will have already cleaned the house.',
            highlight: ['habremos limpiado']
          }
        ]
      },
      {
        title: 'Speculation About Past Events',
        content: 'Used to speculate or make assumptions about past events:',
        examples: [
          {
            spanish: 'Habrá llegado tarde por el tráfico.',
            english: 'He must have arrived late because of traffic.',
            highlight: ['Habrá llegado']
          },
          {
            spanish: 'Se habrán perdido en el camino.',
            english: 'They must have gotten lost on the way.',
            highlight: ['habrán perdido']
          }
        ]
      },
      {
        title: 'Probability in the Past',
        content: 'Expressing probability about past actions:',
        examples: [
          {
            spanish: '¿Habrá recibido mi mensaje?',
            english: 'I wonder if he received my message?',
            highlight: ['Habrá recibido']
          },
          {
            spanish: 'Habrán sido las diez cuando llegó.',
            english: 'It must have been ten o\'clock when he arrived.',
            highlight: ['Habrán sido']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Expressions with Future Perfect',
    content: `Common time expressions used with the future perfect tense.`,
    examples: [
      {
        spanish: 'para + time (by)',
        english: 'Para las seis habré terminado.',
        highlight: ['Para las seis habré terminado']
      },
      {
        spanish: 'cuando + present subjunctive',
        english: 'Cuando llegues, ya habré salido.',
        highlight: ['Cuando llegues, ya habré salido']
      },
      {
        spanish: 'antes de que + subjunctive',
        english: 'Habré comido antes de que vengas.',
        highlight: ['Habré comido antes de que']
      },
      {
        spanish: 'ya (already)',
        english: 'Ya habrán terminado la reunión.',
        highlight: ['Ya habrán terminado']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future' },
  { title: 'Present Perfect', url: '/grammar/spanish/verbs/present-perfect' },
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles' }
];

export default function SpanishFuturePerfectPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'future-perfect',
              title: 'Spanish Future Perfect Tense',
              description: 'Master the Spanish future perfect tense with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 25
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'future-perfect',
              title: 'Spanish Future Perfect Tense'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="future-perfect"
        title="Spanish Future Perfect Tense"
        description="Master the Spanish future perfect tense with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/future-perfect/practice"
        quizUrl="/grammar/spanish/verbs/future-perfect/quiz"
        songUrl="/songs/es?theme=grammar&topic=future-perfect"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

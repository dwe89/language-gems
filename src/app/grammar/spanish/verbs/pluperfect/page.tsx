import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'pluperfect',
  title: 'Spanish Pluperfect Tense',
  description: 'Master the Spanish pluperfect tense (past perfect) with comprehensive explanations, formation rules, and usage examples.',
  difficulty: 'advanced',
  keywords: [
    'spanish pluperfect',
    'past perfect spanish',
    'pluscuamperfecto',
    'había hablado',
    'spanish compound tenses'
  ],
  examples: [
    'Había estudiado antes del examen (I had studied before the exam)',
    'Ya habían llegado cuando llamé (They had already arrived when I called)',
    'Nunca había visto esa película (I had never seen that movie)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Pluperfect Tense?',
    content: `The Spanish pluperfect tense (**pluscuamperfecto**) is equivalent to the English past perfect tense. It expresses actions that were completed before another past action or point in time. It is formed using the imperfect tense of **haber** + past participle.

This tense is essential for expressing the sequence of past events and is commonly used in storytelling and formal writing.`,
    examples: [
      {
        spanish: 'Cuando llegué, ya había terminado.',
        english: 'When I arrived, he had already finished.',
        highlight: ['había terminado']
      },
      {
        spanish: 'Nunca habíamos visto algo así.',
        english: 'We had never seen anything like that.',
        highlight: ['habíamos visto']
      },
      {
        spanish: 'Me dijo que había estudiado mucho.',
        english: 'He told me that he had studied a lot.',
        highlight: ['había estudiado']
      }
    ]
  },
  {
    title: 'Formation of the Pluperfect Tense',
    content: `The pluperfect tense is formed with the imperfect tense of haber + past participle.`,
    subsections: [
      {
        title: 'Conjugation of Haber (Imperfect)',
        content: 'The auxiliary verb haber in the imperfect tense:',
        conjugationTable: {
          title: 'Haber - Imperfect Tense',
          conjugations: [
            { pronoun: 'yo', form: 'había', english: 'I had' },
            { pronoun: 'tú', form: 'habías', english: 'you had' },
            { pronoun: 'él/ella/usted', form: 'había', english: 'he/she/you had' },
            { pronoun: 'nosotros', form: 'habíamos', english: 'we had' },
            { pronoun: 'vosotros', form: 'habíais', english: 'you all had' },
            { pronoun: 'ellos/ellas/ustedes', form: 'habían', english: 'they/you all had' }
          ]
        }
      },
      {
        title: 'Complete Pluperfect Conjugation',
        content: 'Example with hablar (to speak):',
        conjugationTable: {
          title: 'Hablar - Pluperfect Tense',
          conjugations: [
            { pronoun: 'yo', form: 'había hablado', english: 'I had spoken' },
            { pronoun: 'tú', form: 'habías hablado', english: 'you had spoken' },
            { pronoun: 'él/ella/usted', form: 'había hablado', english: 'he/she/you had spoken' },
            { pronoun: 'nosotros', form: 'habíamos hablado', english: 'we had spoken' },
            { pronoun: 'vosotros', form: 'habíais hablado', english: 'you all had spoken' },
            { pronoun: 'ellos/ellas/ustedes', form: 'habían hablado', english: 'they/you all had spoken' }
          ]
        }
      }
    ]
  },
  {
    title: 'Uses of the Pluperfect Tense',
    content: `The pluperfect tense has several specific uses in Spanish.`,
    subsections: [
      {
        title: 'Action Before Another Past Action',
        content: 'The most common use - expressing an action completed before another past action:',
        examples: [
          {
            spanish: 'Cuando llegamos, la película ya había empezado.',
            english: 'When we arrived, the movie had already started.',
            highlight: ['había empezado']
          },
          {
            spanish: 'Me di cuenta de que había olvidado las llaves.',
            english: 'I realized that I had forgotten the keys.',
            highlight: ['había olvidado']
          }
        ]
      },
      {
        title: 'Reported Speech',
        content: 'Used in reported speech to express what someone had done:',
        examples: [
          {
            spanish: 'Dijo que había terminado el trabajo.',
            english: 'He said that he had finished the work.',
            highlight: ['había terminado']
          },
          {
            spanish: 'Nos contó que había viajado por Europa.',
            english: 'He told us that he had traveled through Europe.',
            highlight: ['había viajado']
          }
        ]
      },
      {
        title: 'Expressing Experience',
        content: 'Used with "nunca" or "ya" to express past experience:',
        examples: [
          {
            spanish: 'Nunca había probado comida tailandesa.',
            english: 'I had never tried Thai food.',
            highlight: ['había probado']
          },
          {
            spanish: 'Ya habían visitado ese museo.',
            english: 'They had already visited that museum.',
            highlight: ['habían visitado']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Expressions with Pluperfect',
    content: `Common time expressions used with the pluperfect tense.`,
    examples: [
      {
        spanish: 'ya (already)',
        english: 'Ya había comido cuando llegaste.',
        highlight: ['Ya había comido']
      },
      {
        spanish: 'nunca (never)',
        english: 'Nunca había visto tanta gente.',
        highlight: ['Nunca había visto']
      },
      {
        spanish: 'todavía no (not yet)',
        english: 'Todavía no había terminado.',
        highlight: ['no había terminado']
      },
      {
        spanish: 'antes de que (before)',
        english: 'Había salido antes de que llegaras.',
        highlight: ['Había salido antes de que']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Passive Voice', url: '/grammar/spanish/verbs/passive-voice', difficulty: 'advanced' },
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'Imperative', url: '/grammar/spanish/verbs/imperative', difficulty: 'intermediate' }
];

export default function SpanishPluperfectPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'pluperfect',
              title: 'Spanish Pluperfect Tense',
              description: 'Master the Spanish pluperfect tense with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 25
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'pluperfect',
              title: 'Spanish Pluperfect Tense'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="pluperfect"
        title="Spanish Pluperfect Tense"
        description="Master the Spanish pluperfect tense with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/pluperfect/practice"
        quizUrl="/grammar/spanish/verbs/pluperfect/quiz"
        songUrl="/songs/es?theme=grammar&topic=pluperfect"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'future',
  title: 'Spanish Future Tense',
  description: 'Master Spanish future tense conjugations for expressing future actions and intentions. Learn regular and irregular patterns.',
  difficulty: 'intermediate',
  keywords: [
    'spanish future tense',
    'futuro simple',
    'spanish future conjugation',
    'future tense spanish',
    'spanish grammar',
    'irregular future stems',
    'future probability'
  ],
  examples: [
    'Mañana estudiaré para el examen (Tomorrow I will study for the exam)',
    'Ellos vendrán a la fiesta (They will come to the party)',
    '¿Qué hora será? (What time could it be?)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Future Tense?',
    content: `The Spanish future tense (**futuro simple**) expresses actions that will happen in the future. Unlike English, which uses auxiliary verbs ("will" or "going to"), Spanish uses specific future endings attached to the infinitive form of the verb.

The future tense can also express probability or conjecture about present situations, making it a versatile tense in Spanish communication.`,
    examples: [
      {
        spanish: 'Mañana estudiaré para el examen.',
        english: 'Tomorrow I will study for the exam.',
        highlight: ['estudiaré']
      },
      {
        spanish: 'Ellos vendrán a la fiesta el sábado.',
        english: 'They will come to the party on Saturday.',
        highlight: ['vendrán']
      },
      {
        spanish: '¿Qué hora será? Serán las cinco.',
        english: 'What time could it be? It\'s probably five o\'clock.',
        highlight: ['será', 'Serán']
      }
    ]
  },
  {
    title: 'Regular Future Tense Formation',
    content: `The Spanish future tense is formed by adding specific endings to the **complete infinitive** of the verb. Unlike other tenses, you don't remove the -ar, -er, or -ir endings. All three verb types use the same future endings.`,
    subsections: [
      {
        title: 'Future Tense Endings (All Verbs)',
        content: `**All Spanish verbs** use the same future endings, regardless of whether they're -ar, -er, or -ir verbs:`,
        conjugationTable: {
          title: 'Future Tense Endings',
          conjugations: [
            { pronoun: 'yo', form: '-é', english: 'I will' },
            { pronoun: 'tú', form: '-ás', english: 'you will' },
            { pronoun: 'él/ella/usted', form: '-á', english: 'he/she will, you will' },
            { pronoun: 'nosotros/nosotras', form: '-emos', english: 'we will' },
            { pronoun: 'vosotros/vosotras', form: '-éis', english: 'you all will' },
            { pronoun: 'ellos/ellas/ustedes', form: '-án', english: 'they will, you all will' }
          ]
        },
        examples: [
          {
            spanish: 'Yo hablaré español perfectamente.',
            english: 'I will speak Spanish perfectly.',
            highlight: ['hablaré']
          },
          {
            spanish: 'Tú comerás en el restaurante nuevo.',
            english: 'You will eat at the new restaurant.',
            highlight: ['comerás']
          },
          {
            spanish: 'Nosotros viviremos en Madrid.',
            english: 'We will live in Madrid.',
            highlight: ['viviremos']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Future Stems',
    content: `Some verbs have irregular stems in the future tense, but they still use the same endings. These irregular stems must be memorized, but they follow patterns that make them easier to remember.`,
    subsections: [
      {
        title: 'Drop the Vowel Pattern',
        content: `These verbs **drop the vowel** from their infinitive ending before adding future endings:`,
        conjugationTable: {
          title: 'Drop Vowel Irregular Stems',
          conjugations: [
            { pronoun: 'haber (to have - auxiliary)', form: 'habr-', english: 'habré, habrás, habrá...' },
            { pronoun: 'poder (to be able)', form: 'podr-', english: 'podré, podrás, podrá...' },
            { pronoun: 'querer (to want)', form: 'querr-', english: 'querré, querrás, querrá...' },
            { pronoun: 'saber (to know)', form: 'sabr-', english: 'sabré, sabrás, sabrá...' }
          ]
        },
        examples: [
          {
            spanish: 'No podré ir a la reunión mañana.',
            english: 'I won\'t be able to go to the meeting tomorrow.',
            highlight: ['podré']
          },
          {
            spanish: 'Ella querrá venir con nosotros.',
            english: 'She will want to come with us.',
            highlight: ['querrá']
          }
        ]
      },
      {
        title: 'Replace with "d" Pattern',
        content: `These verbs **replace part of their ending with "d"** before adding future endings:`,
        conjugationTable: {
          title: 'Replace with "d" Irregular Stems',
          conjugations: [
            { pronoun: 'poner (to put)', form: 'pondr-', english: 'pondré, pondrás, pondrá...' },
            { pronoun: 'salir (to leave)', form: 'saldr-', english: 'saldré, saldrás, saldrá...' },
            { pronoun: 'tener (to have)', form: 'tendr-', english: 'tendré, tendrás, tendrá...' },
            { pronoun: 'venir (to come)', form: 'vendr-', english: 'vendré, vendrás, vendrá...' }
          ]
        },
        examples: [
          {
            spanish: 'Tendré más tiempo el próximo mes.',
            english: 'I will have more time next month.',
            highlight: ['Tendré']
          },
          {
            spanish: 'Ellos vendrán a visitarnos pronto.',
            english: 'They will come to visit us soon.',
            highlight: ['vendrán']
          }
        ]
      },
      {
        title: 'Completely Irregular Stems',
        content: `A few verbs have completely irregular future stems:`,
        conjugationTable: {
          title: 'Completely Irregular Stems',
          conjugations: [
            { pronoun: 'decir (to say)', form: 'dir-', english: 'diré, dirás, dirá...' },
            { pronoun: 'hacer (to do/make)', form: 'har-', english: 'haré, harás, hará...' }
          ]
        },
        examples: [
          {
            spanish: 'Te diré la verdad mañana.',
            english: 'I will tell you the truth tomorrow.',
            highlight: ['diré']
          },
          {
            spanish: 'Haremos la tarea juntos.',
            english: 'We will do the homework together.',
            highlight: ['Haremos']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of the Future Tense',
    content: `The Spanish future tense has several important uses beyond simply expressing future actions:

**1. Future actions and events**: The primary use
**2. Probability and conjecture**: Expressing what probably is happening now
**3. Promises and commitments**: Making firm commitments
**4. Predictions and forecasts**: Weather, outcomes, etc.
**5. Commands and instructions**: Formal or emphatic commands`,
    examples: [
      {
        spanish: 'El próximo año viajaré a Europa.',
        english: 'Next year I will travel to Europe. (future action)',
        highlight: ['viajaré']
      },
      {
        spanish: '¿Dónde estará María? Estará en casa.',
        english: 'Where could María be? She\'s probably at home. (probability)',
        highlight: ['estará', 'Estará']
      },
      {
        spanish: 'Te ayudaré con tu proyecto.',
        english: 'I will help you with your project. (promise)',
        highlight: ['ayudaré']
      },
      {
        spanish: 'Mañana lloverá según el pronóstico.',
        english: 'Tomorrow it will rain according to the forecast. (prediction)',
        highlight: ['lloverá']
      }
    ]
  },
  {
    title: 'Alternative Ways to Express Future',
    content: `Spanish has several ways to express future actions, each with slightly different meanings and uses:

**1. Simple Future (futuro simple)**: Formal, distant future, probability
**2. Near Future (ir + a + infinitive)**: Immediate plans, informal
**3. Present Tense**: Scheduled events, very near future

The choice depends on how certain you are about the future action and how formal the context is.`,
    examples: [
      {
        spanish: 'Estudiaré medicina el próximo año.',
        english: 'I will study medicine next year. (simple future - formal)',
        highlight: ['Estudiaré']
      },
      {
        spanish: 'Voy a estudiar esta noche.',
        english: 'I\'m going to study tonight. (near future - immediate plan)',
        highlight: ['Voy a estudiar']
      },
      {
        spanish: 'Mañana trabajo hasta las cinco.',
        english: 'Tomorrow I work until five. (present for scheduled event)',
        highlight: ['trabajo']
      },
      {
        spanish: 'El tren sale a las ocho.',
        english: 'The train leaves at eight. (present for scheduled event)',
        highlight: ['sale']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite', difficulty: 'intermediate' },
  { title: 'Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' }
];

export default function SpanishFuturePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'future',
              title: 'Spanish Future Tense',
              description: 'Master Spanish future tense conjugations for expressing future actions and intentions.',
              difficulty: 'intermediate',
              examples: [
                'Mañana estudiaré para el examen (Tomorrow I will study for the exam)',
                'Ellos vendrán a la fiesta (They will come to the party)',
                '¿Qué hora será? (What time could it be?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'future',
              title: 'Spanish Future Tense'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="future"
        title="Spanish Future Tense"
        description="Master Spanish future tense conjugations for expressing future actions and intentions"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/future/practice"
        quizUrl="/grammar/spanish/verbs/future/quiz"
        songUrl="/songs/es?theme=grammar&topic=future"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

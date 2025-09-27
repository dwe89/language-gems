import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'conditional',
  title: 'Spanish Conditional Tense',
  description: 'Master Spanish conditional tense conjugations for expressing hypothetical situations, polite requests, and probability.',
  difficulty: 'advanced',
  keywords: [
    'spanish conditional tense',
    'condicional simple',
    'spanish conditional conjugation',
    'hypothetical spanish',
    'spanish grammar',
    'conditional mood',
    'polite requests spanish'
  ],
  examples: [
    'Me gustaría viajar a España (I would like to travel to Spain)',
    '¿Podrías ayudarme? (Could you help me?)',
    'Sería mejor estudiar más (It would be better to study more)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Conditional Tense?',
    content: `The Spanish conditional tense (**condicional simple**) expresses actions that would happen under certain conditions. It's equivalent to "would" + verb in English and is used for hypothetical situations, polite requests, and expressing probability about past events.

The conditional is essential for expressing politeness, making suggestions, and discussing hypothetical scenarios in Spanish.`,
    examples: [
      {
        spanish: 'Me gustaría viajar a España el próximo año.',
        english: 'I would like to travel to Spain next year.',
        highlight: ['gustaría']
      },
      {
        spanish: '¿Podrías ayudarme con este problema?',
        english: 'Could you help me with this problem?',
        highlight: ['Podrías']
      },
      {
        spanish: 'En tu lugar, yo estudiaría más.',
        english: 'In your place, I would study more.',
        highlight: ['estudiaría']
      }
    ]
  },
  {
    title: 'Conditional Tense Formation',
    content: `The Spanish conditional tense is formed by adding specific endings to the **complete infinitive** of the verb. Like the future tense, you don't remove the -ar, -er, or -ir endings. All three verb types use the same conditional endings.`,
    subsections: [
      {
        title: 'Regular Conditional Endings',
        content: `**All Spanish verbs** use the same conditional endings, regardless of whether they're -ar, -er, or -ir verbs:`,
        conjugationTable: {
          title: 'Conditional Tense Endings',
          conjugations: [
            { pronoun: 'yo', form: '-ía', english: 'I would' },
            { pronoun: 'tú', form: '-ías', english: 'you would' },
            { pronoun: 'él/ella/usted', form: '-ía', english: 'he/she would, you would' },
            { pronoun: 'nosotros/nosotras', form: '-íamos', english: 'we would' },
            { pronoun: 'vosotros/vosotras', form: '-íais', english: 'you all would' },
            { pronoun: 'ellos/ellas/ustedes', form: '-ían', english: 'they would, you all would' }
          ]
        },
        examples: [
          {
            spanish: 'Yo hablaría español perfectamente.',
            english: 'I would speak Spanish perfectly.',
            highlight: ['hablaría']
          },
          {
            spanish: 'Tú comerías en ese restaurante.',
            english: 'You would eat at that restaurant.',
            highlight: ['comerías']
          },
          {
            spanish: 'Nosotros viviríamos en Barcelona.',
            english: 'We would live in Barcelona.',
            highlight: ['viviríamos']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Conditional Stems',
    content: `The conditional tense uses the same irregular stems as the future tense. These irregular stems must be memorized, but they follow the same patterns as the future tense.`,
    subsections: [
      {
        title: 'Drop the Vowel Pattern',
        content: `These verbs **drop the vowel** from their infinitive ending before adding conditional endings:`,
        conjugationTable: {
          title: 'Drop Vowel Irregular Stems',
          conjugations: [
            { pronoun: 'haber (to have - auxiliary)', form: 'habr-', english: 'habría, habrías, habría...' },
            { pronoun: 'poder (to be able)', form: 'podr-', english: 'podría, podrías, podría...' },
            { pronoun: 'querer (to want)', form: 'querr-', english: 'querría, querrías, querría...' },
            { pronoun: 'saber (to know)', form: 'sabr-', english: 'sabría, sabrías, sabría...' }
          ]
        },
        examples: [
          {
            spanish: 'No podría ir a la reunión mañana.',
            english: 'I wouldn\'t be able to go to the meeting tomorrow.',
            highlight: ['podría']
          },
          {
            spanish: 'Ella querría venir con nosotros.',
            english: 'She would want to come with us.',
            highlight: ['querría']
          }
        ]
      },
      {
        title: 'Replace with "d" Pattern',
        content: `These verbs **replace part of their ending with "d"** before adding conditional endings:`,
        conjugationTable: {
          title: 'Replace with "d" Irregular Stems',
          conjugations: [
            { pronoun: 'poner (to put)', form: 'pondr-', english: 'pondría, pondrías, pondría...' },
            { pronoun: 'salir (to leave)', form: 'saldr-', english: 'saldría, saldrías, saldría...' },
            { pronoun: 'tener (to have)', form: 'tendr-', english: 'tendría, tendrías, tendría...' },
            { pronoun: 'venir (to come)', form: 'vendr-', english: 'vendría, vendrías, vendría...' }
          ]
        },
        examples: [
          {
            spanish: 'Tendría más tiempo si no trabajara tanto.',
            english: 'I would have more time if I didn\'t work so much.',
            highlight: ['Tendría']
          },
          {
            spanish: 'Ellos vendrían a visitarnos si pudieran.',
            english: 'They would come to visit us if they could.',
            highlight: ['vendrían']
          }
        ]
      },
      {
        title: 'Completely Irregular Stems',
        content: `A few verbs have completely irregular conditional stems:`,
        conjugationTable: {
          title: 'Completely Irregular Stems',
          conjugations: [
            { pronoun: 'decir (to say)', form: 'dir-', english: 'diría, dirías, diría...' },
            { pronoun: 'hacer (to do/make)', form: 'har-', english: 'haría, harías, haría...' }
          ]
        },
        examples: [
          {
            spanish: 'Te diría la verdad si me preguntaras.',
            english: 'I would tell you the truth if you asked me.',
            highlight: ['diría']
          },
          {
            spanish: 'Haríamos la tarea juntos.',
            english: 'We would do the homework together.',
            highlight: ['Haríamos']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of the Conditional Tense',
    content: `The Spanish conditional tense has several important uses beyond simply expressing "would":

**1. Hypothetical situations**: What would happen under certain conditions
**2. Polite requests**: Making requests more courteous
**3. Probability about the past**: Expressing what probably happened
**4. Advice and suggestions**: Giving recommendations
**5. Expressing desires**: Polite way to express wants`,
    examples: [
      {
        spanish: 'Si tuviera dinero, compraría una casa.',
        english: 'If I had money, I would buy a house. (hypothetical)',
        highlight: ['compraría']
      },
      {
        spanish: '¿Podrías cerrar la ventana, por favor?',
        english: 'Could you close the window, please? (polite request)',
        highlight: ['Podrías']
      },
      {
        spanish: 'Serían las ocho cuando llegó.',
        english: 'It was probably eight o\'clock when he arrived. (probability)',
        highlight: ['Serían']
      },
      {
        spanish: 'Yo que tú, estudiaría más.',
        english: 'If I were you, I would study more. (advice)',
        highlight: ['estudiaría']
      }
    ]
  },
  {
    title: 'Conditional vs Other Tenses',
    content: `Understanding when to use conditional versus other tenses is crucial:

**Conditional vs Future**: Conditional expresses what would happen (hypothetical), while future expresses what will happen (certain).
**Conditional vs Imperfect**: Conditional expresses hypothetical actions, while imperfect describes past habits or ongoing actions.
**Conditional in "Si" clauses**: Often used with imperfect subjunctive in hypothetical situations.`,
    examples: [
      {
        spanish: 'Iré mañana. / Iría si pudiera.',
        english: 'I will go tomorrow. / I would go if I could. (future vs conditional)',
        highlight: ['Iré', 'Iría']
      },
      {
        spanish: 'Estudiaba cada día. / Estudiaría si tuviera tiempo.',
        english: 'I used to study every day. / I would study if I had time. (imperfect vs conditional)',
        highlight: ['Estudiaba', 'Estudiaría']
      },
      {
        spanish: 'Si fuera rico, viajaría por el mundo.',
        english: 'If I were rich, I would travel around the world. (si clause)',
        highlight: ['fuera', 'viajaría']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' },
  { title: 'Irregular Verbs', url: '/grammar/spanish/verbs/irregular-verbs', difficulty: 'intermediate' }
];

export default function SpanishConditionalPage() {
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
              topic: 'conditional',
              title: 'Spanish Conditional Tense',
              description: 'Master Spanish conditional tense conjugations for expressing hypothetical situations, polite requests, and probability.',
              difficulty: 'advanced',
              examples: [
                'Me gustaría viajar a España (I would like to travel to Spain)',
                '¿Podrías ayudarme? (Could you help me?)',
                'Sería mejor estudiar más (It would be better to study more)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'conditional',
              title: 'Spanish Conditional Tense'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="conditional"
        title="Spanish Conditional Tense"
        description="Master Spanish conditional tense conjugations for expressing hypothetical situations, polite requests, and probability"
        difficulty="advanced"
        estimatedTime={22}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/conditional/practice"
        quizUrl="/grammar/spanish/verbs/conditional/quiz"
        songUrl="/songs/es?theme=grammar&topic=conditional"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'imperfect-vs-preterite',
  title: 'Spanish Imperfect vs Preterite',
  description: 'Master the difference between Spanish imperfect and preterite tenses with clear explanations and practical examples.',
  difficulty: 'intermediate',
  keywords: [
    'spanish imperfect vs preterite',
    'pretérito imperfecto',
    'pretérito indefinido',
    'when to use imperfect',
    'when to use preterite'
  ],
  examples: [
    'Comía cuando llegó (I was eating when he arrived)',
    'Comí a las seis (I ate at six)',
    'Mientras estudiaba, sonó el teléfono (While I was studying, the phone rang)'
  ]
});

const sections = [
  {
    title: 'Imperfect vs Preterite: The Core Difference',
    content: `The imperfect and preterite are the two main past tenses in Spanish. The key difference is **aspect**: the imperfect describes ongoing or habitual actions in the past, while the preterite describes completed actions.

**Imperfect**: Describes what was happening, used to happen, or was in progress
**Preterite**: Describes what happened, was completed, or occurred at a specific time`,
    examples: [
      {
        spanish: 'Comía cuando llegó.',
        english: 'I was eating when he arrived. (imperfect = ongoing action)',
        highlight: ['Comía']
      },
      {
        spanish: 'Comí a las seis.',
        english: 'I ate at six. (preterite = completed action)',
        highlight: ['Comí']
      }
    ]
  },
  {
    title: 'When to Use the Imperfect',
    content: `Use the imperfect for:`,
    subsections: [
      {
        title: 'Habitual or Repeated Actions',
        content: 'Actions that happened regularly in the past:',
        examples: [
          {
            spanish: 'Cada día iba al parque.',
            english: 'Every day I went to the park.',
            highlight: ['iba']
          }
        ]
      },
      {
        title: 'Ongoing Actions (Background)',
        content: 'Actions in progress when something else happened:',
        examples: [
          {
            spanish: 'Mientras estudiaba, sonó el teléfono.',
            english: 'While I was studying, the phone rang.',
            highlight: ['estudiaba']
          }
        ]
      },
      {
        title: 'Descriptions and States',
        content: 'Describing how things were or felt:',
        examples: [
          {
            spanish: 'Era un día hermoso.',
            english: 'It was a beautiful day.',
            highlight: ['Era']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use the Preterite',
    content: `Use the preterite for:`,
    subsections: [
      {
        title: 'Completed Actions',
        content: 'Actions that were finished at a specific time:',
        examples: [
          {
            spanish: 'Ayer comí en un restaurante.',
            english: 'Yesterday I ate at a restaurant.',
            highlight: ['comí']
          }
        ]
      },
      {
        title: 'Specific Events',
        content: 'Events that happened once or at a definite time:',
        examples: [
          {
            spanish: 'El accidente ocurrió a las tres.',
            english: 'The accident happened at three.',
            highlight: ['ocurrió']
          }
        ]
      },
      {
        title: 'Sequence of Events',
        content: 'A series of completed actions:',
        examples: [
          {
            spanish: 'Llegué, comí y me fui.',
            english: 'I arrived, ate, and left.',
            highlight: ['Llegué', 'comí', 'fui']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Patterns and Contrasts',
    content: `Understanding common usage patterns helps distinguish between the two tenses.`,
    examples: [
      {
        spanish: 'Mientras comía, llegó mi amigo.',
        english: 'While I was eating (imperfect), my friend arrived (preterite).',
        highlight: ['comía', 'llegó']
      },
      {
        spanish: 'Cuando era niño, jugaba en el parque.',
        english: 'When I was a child (imperfect), I used to play (imperfect) in the park.',
        highlight: ['era', 'jugaba']
      },
      {
        spanish: 'Viajé a España el año pasado.',
        english: 'I traveled to Spain last year. (completed trip)',
        highlight: ['Viajé']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite-tense', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect-tense', difficulty: 'intermediate' },
  { title: 'Present Perfect', url: '/grammar/spanish/verbs/present-perfect', difficulty: 'intermediate' },
  { title: 'Sequence of Tenses', url: '/grammar/spanish/advanced-constructions/sequence-of-tenses', difficulty: 'advanced' }
];

export default function SpanishImperfectVsPreteritePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'imperfect-vs-preterite',
              title: 'Spanish Imperfect vs Preterite',
              description: 'Master the difference between Spanish imperfect and preterite tenses',
              difficulty: 'intermediate',
              estimatedTime: 20
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'imperfect-vs-preterite',
              title: 'Spanish Imperfect vs Preterite'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="imperfect-vs-preterite"
        title="Spanish Imperfect vs Preterite"
        description="Master the difference between Spanish imperfect and preterite tenses with clear explanations and practical examples"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/imperfect-vs-preterite/practice"
        quizUrl="/grammar/spanish/verbs/imperfect-vs-preterite/quiz"
        songUrl="/songs/es?theme=grammar&topic=imperfect-vs-preterite"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}


import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'numbers',
  topic: 'advanced-time',
  title: 'French Advanced Time Expressions (Depuis with Imperfect, Complex Duration)',
  description: 'Master advanced French time expressions including depuis with imperfect tense, complex duration, and sophisticated temporal relationships.',
  difficulty: 'advanced',
  keywords: [
    'french advanced time expressions',
    'depuis imperfect french',
    'complex duration french',
    'temporal relationships french',
    'advanced time french',
    'sophisticated time expressions'
  ],
  examples: [
    'Depuis qu\'il était petit... (Since he was little...)',
    'Il y avait longtemps que... (It had been a long time since...)',
    'Cela faisait deux ans qu\'il... (It had been two years since he...)',
    'D\'ici là, nous aurons fini. (By then, we will have finished.)'
  ]
});

const sections = [
  {
    title: 'Understanding Advanced French Time Expressions',
    content: `Advanced French time expressions involve **complex temporal relationships**, **sophisticated duration concepts**, and **nuanced tense interactions** that go beyond basic time telling.

**Key advanced concepts:**
- **DEPUIS with imperfect**: Ongoing past states
- **Complex duration**: IL Y AVAIT...QUE, CELA FAISAIT...QUE
- **Future time relationships**: D'ICI, D'ICI À, JUSQU'À
- **Temporal subordination**: Advanced time clauses
- **Aspectual distinctions**: Completed vs ongoing time

**Advanced characteristics:**
- **Tense coordination**: Multiple tenses working together
- **Aspectual precision**: Exact temporal relationships
- **Stylistic sophistication**: Formal and literary expressions
- **Logical complexity**: Cause-effect temporal relationships

These expressions are essential for advanced French proficiency and sophisticated communication.`,
    examples: [
      {
        spanish: 'Depuis qu\'il habitait Paris, il était heureux. (Since he lived in Paris, he was happy.)',
        english: 'Complex temporal relationship with ongoing past state',
        highlight: ['Depuis qu\'il habitait Paris']
      },
      {
        spanish: 'Cela faisait trois ans qu\'elle étudiait le français. (She had been studying French for three years.)',
        english: 'Duration expression with past perfect meaning',
        highlight: ['Cela faisait trois ans qu\'elle étudiait']
      },
      {
        spanish: 'D\'ici demain, tout sera fini. (By tomorrow, everything will be finished.)',
        english: 'Future deadline expression',
        highlight: ['D\'ici demain, tout sera fini']
      }
    ]
  },
  {
    title: 'DEPUIS with Imperfect Tense',
    content: `**DEPUIS with imperfect** expresses **ongoing past states or habits**:`,
    examples: [
      {
        spanish: 'Depuis qu\'il était petit, il aimait les livres. (Since he was little, he loved books.)',
        english: 'Depuis son enfance, il était timide. (Since his childhood, he was shy.)',
        highlight: ['Depuis qu\'il était petit', 'Depuis son enfance, il était timide']
      },
      {
        spanish: 'Depuis qu\'elle habitait ici, elle se sentait mieux. (Since she lived here, she felt better.)',
        english: 'Depuis cette époque, les choses changeaient. (Since that time, things were changing.)',
        highlight: ['Depuis qu\'elle habitait ici', 'Depuis cette époque']
      }
    ],
    subsections: [
      {
        title: 'DEPUIS QUE + Imperfect',
        content: 'Temporal clause with ongoing past:',
        examples: [
          {
            spanish: 'Depuis qu\'il travaillait là, il était content. (Since he worked there, he was happy.)',
            english: 'Expresses ongoing past state or condition',
            highlight: ['Depuis qu\'il travaillait là']
          }
        ]
      },
      {
        title: 'DEPUIS + Time Expression + Imperfect',
        content: 'Duration with past ongoing state:',
        examples: [
          {
            spanish: 'Depuis trois ans, elle étudiait à Paris. (For three years, she had been studying in Paris.)',
            english: 'Ongoing past action with duration',
            highlight: ['Depuis trois ans, elle étudiait']
          }
        ]
      }
    ]
  },
  {
    title: 'Complex Duration Expressions',
    content: `Advanced ways to express **how long something had been happening**:`,
    conjugationTable: {
      title: 'Complex Duration Patterns',
      conjugations: [
        { pronoun: 'Il y avait...que', form: 'It had been...since', english: 'Il y avait deux ans qu\'il partait. (It had been two years since he left.)' },
        { pronoun: 'Cela faisait...que', form: 'It had been...since', english: 'Cela faisait longtemps qu\'elle attendait. (She had been waiting for a long time.)' },
        { pronoun: 'Voilà...que', form: 'It\'s been...since', english: 'Voilà une heure qu\'il dort. (He\'s been sleeping for an hour.)' },
        { pronoun: 'Il y a...que', form: 'It\'s been...since', english: 'Il y a trois jours qu\'il pleut. (It\'s been raining for three days.)' }
      ]
    },
    examples: [
      {
        spanish: 'Il y avait longtemps que nous ne nous étions pas vus. (It had been a long time since we had seen each other.)',
        english: 'Cela faisait des années qu\'elle vivait seule. (She had been living alone for years.)',
        highlight: ['Il y avait longtemps que', 'Cela faisait des années qu\'elle vivait']
      }
    ],
    subsections: [
      {
        title: 'IL Y AVAIT...QUE (Past Perfect Duration)',
        content: 'Expressing duration in the past:',
        examples: [
          {
            spanish: 'Il y avait trois mois qu\'il cherchait du travail. (He had been looking for work for three months.)',
            english: 'Past perfect continuous meaning',
            highlight: ['Il y avait trois mois qu\'il cherchait']
          }
        ]
      },
      {
        title: 'CELA FAISAIT...QUE (Ongoing Past Duration)',
        content: 'Emphasizing the duration:',
        examples: [
          {
            spanish: 'Cela faisait si longtemps qu\'elle n\'était pas venue! (It had been so long since she had come!)',
            english: 'Emotional emphasis on duration',
            highlight: ['Cela faisait si longtemps qu\'elle n\'était pas venue']
          }
        ]
      }
    ]
  },
  {
    title: 'Future Time Relationships',
    content: `Advanced expressions for **future temporal relationships**:`,
    conjugationTable: {
      title: 'Future Time Expressions',
      conjugations: [
        { pronoun: 'd\'ici', form: 'by (deadline)', english: 'D\'ici lundi, je finirai. (By Monday, I\'ll finish.)' },
        { pronoun: 'd\'ici à', form: 'by/between now and', english: 'D\'ici à demain... (By tomorrow...)' },
        { pronoun: 'jusqu\'à', form: 'until', english: 'Jusqu\'à ce qu\'il vienne... (Until he comes...)' },
        { pronoun: 'en attendant', form: 'meanwhile', english: 'En attendant, nous travaillons. (Meanwhile, we work.)' },
        { pronoun: 'désormais', form: 'from now on', english: 'Désormais, tout changera. (From now on, everything will change.)' }
      ]
    },
    examples: [
      {
        spanish: 'D\'ici la fin de l\'année, nous déménagerons. (By the end of the year, we\'ll move.)',
        english: 'Jusqu\'à ce qu\'il comprenne, j\'expliquerai. (Until he understands, I\'ll explain.)',
        highlight: ['D\'ici la fin de l\'année', 'Jusqu\'à ce qu\'il comprenne']
      }
    ]
  },
  {
    title: 'Temporal Subordination',
    content: `Complex **time clauses** with sophisticated relationships:`,
    examples: [
      {
        spanish: 'Aussitôt qu\'il arriva, tout changea. (As soon as he arrived, everything changed.)',
        english: 'Dès que nous aurons fini, nous partirons. (As soon as we finish, we\'ll leave.)',
        highlight: ['Aussitôt qu\'il arriva', 'Dès que nous aurons fini']
      },
      {
        spanish: 'Tant qu\'il vivra, il se souviendra. (As long as he lives, he\'ll remember.)',
        english: 'Chaque fois qu\'elle venait, nous étions heureux. (Every time she came, we were happy.)',
        highlight: ['Tant qu\'il vivra', 'Chaque fois qu\'elle venait']
      }
    ],
    subsections: [
      {
        title: 'Immediate Sequence',
        content: 'Actions happening immediately after:',
        examples: [
          {
            spanish: 'Aussitôt dit, aussitôt fait. (No sooner said than done.)',
            english: 'À peine était-il parti que... (He had barely left when...)',
            highlight: ['Aussitôt dit, aussitôt fait', 'À peine était-il parti que']
          }
        ]
      },
      {
        title: 'Conditional Time',
        content: 'Time relationships with conditions:',
        examples: [
          {
            spanish: 'Au cas où il viendrait plus tôt... (In case he comes earlier...)',
            english: 'Pourvu qu\'il arrive à temps... (Provided he arrives on time...)',
            highlight: ['Au cas où il viendrait', 'Pourvu qu\'il arrive à temps']
          }
        ]
      }
    ]
  },
  {
    title: 'Aspectual Time Distinctions',
    content: `Sophisticated distinctions in **temporal aspect**:`,
    conjugationTable: {
      title: 'Aspectual Distinctions',
      conjugations: [
        { pronoun: 'Punctual', form: 'à ce moment-là', english: 'at that precise moment' },
        { pronoun: 'Durative', form: 'pendant ce temps-là', english: 'during that time' },
        { pronoun: 'Iterative', form: 'à chaque fois', english: 'each time' },
        { pronoun: 'Habitual', form: 'à l\'époque', english: 'at that time (habitually)' },
        { pronoun: 'Inchoative', form: 'dès le début', english: 'from the beginning' },
        { pronoun: 'Terminative', form: 'jusqu\'à la fin', english: 'until the end' }
      ]
    },
    examples: [
      {
        spanish: 'À ce moment précis, tout s\'éclaira. (At that precise moment, everything became clear.)',
        english: 'Pendant tout ce temps, elle attendait. (During all that time, she was waiting.)',
        highlight: ['À ce moment précis', 'Pendant tout ce temps']
      }
    ]
  },
  {
    title: 'Literary and Formal Time Expressions',
    content: `Sophisticated expressions for **formal and literary contexts**:`,
    examples: [
      {
        spanish: 'En ce temps-là, les choses étaient différentes. (In those days, things were different.)',
        english: 'À cette époque révolue... (In that bygone era...)',
        highlight: ['En ce temps-là', 'À cette époque révolue']
      },
      {
        spanish: 'Au temps jadis... (In days of old...)',
        english: 'De nos jours... (Nowadays...)',
        highlight: ['Au temps jadis', 'De nos jours']
      }
    ],
    subsections: [
      {
        title: 'Historical Time References',
        content: 'Formal historical expressions:',
        examples: [
          {
            spanish: 'À l\'époque de Louis XIV... (In the time of Louis XIV...)',
            english: 'Au cours des siècles... (Over the centuries...)',
            highlight: ['À l\'époque de Louis XIV', 'Au cours des siècles']
          }
        ]
      }
    ]
  },
  {
    title: 'Temporal Logical Relationships',
    content: `Time expressions showing **cause, effect, and logical sequence**:`,
    examples: [
      {
        spanish: 'Du moment que vous acceptez... (From the moment you accept...)',
        english: 'Étant donné que le temps presse... (Given that time is pressing...)',
        highlight: ['Du moment que vous acceptez', 'Étant donné que le temps presse']
      },
      {
        spanish: 'Vu le temps qu\'il fait... (Given the weather...)',
        english: 'Compte tenu du délai... (Taking into account the deadline...)',
        highlight: ['Vu le temps qu\'il fait', 'Compte tenu du délai']
      }
    ]
  },
  {
    title: 'Subjunctive with Time Expressions',
    content: `Time expressions requiring **subjunctive mood**:`,
    examples: [
      {
        spanish: 'Avant qu\'il ne parte... (Before he leaves...)',
        english: 'Jusqu\'à ce qu\'elle comprenne... (Until she understands...)',
        highlight: ['Avant qu\'il ne parte', 'Jusqu\'à ce qu\'elle comprenne']
      },
      {
        spanish: 'En attendant qu\'il vienne... (While waiting for him to come...)',
        english: 'Le temps qu\'il arrive... (By the time he arrives...)',
        highlight: ['En attendant qu\'il vienne', 'Le temps qu\'il arrive']
      }
    ],
    subsections: [
      {
        title: 'Future Uncertainty',
        content: 'Subjunctive with uncertain future time:',
        examples: [
          {
            spanish: 'Quand bien même il viendrait... (Even if he were to come...)',
            english: 'Subjunctive expresses uncertainty about future',
            highlight: ['Quand bien même il viendrait']
          }
        ]
      }
    ]
  },
  {
    title: 'Temporal Metaphors and Idioms',
    content: `Idiomatic expressions involving **time concepts**:`,
    examples: [
      {
        spanish: 'Le temps presse. (Time is pressing.)',
        english: 'Il était temps! (It was about time!)',
        highlight: ['Le temps presse', 'Il était temps']
      },
      {
        spanish: 'Prendre son temps (to take one\'s time)',
        english: 'Perdre son temps (to waste one\'s time)',
        highlight: ['Prendre son temps', 'Perdre son temps']
      }
    ],
    subsections: [
      {
        title: 'Time as Resource',
        content: 'Metaphorical uses of time:',
        examples: [
          {
            spanish: 'Gagner du temps (to save time)',
            english: 'Rattraper le temps perdu (to make up for lost time)',
            highlight: ['Gagner du temps', 'Rattraper le temps perdu']
          }
        ]
      }
    ]
  },
  {
    title: 'Register and Style Variations',
    content: `Different **levels of formality** in time expressions:`,
    conjugationTable: {
      title: 'Style Levels',
      conjugations: [
        { pronoun: 'Informal', form: 'Ça fait longtemps...', english: 'It\'s been a long time...' },
        { pronoun: 'Standard', form: 'Il y a longtemps...', english: 'A long time ago...' },
        { pronoun: 'Formal', form: 'Il y a fort longtemps...', english: 'A very long time ago...' },
        { pronoun: 'Literary', form: 'Jadis, naguère...', english: 'Long ago, formerly...' }
      ]
    }
  },
  {
    title: 'Common Advanced Time Mistakes',
    content: `Here are frequent errors with advanced time expressions:

**1. Tense coordination**: Wrong tense combinations
**2. Subjunctive omission**: Missing subjunctive with time clauses
**3. Aspect confusion**: Mixing up aspectual meanings
**4. Register mismatch**: Wrong formality level`,
    examples: [
      {
        spanish: '❌ Depuis qu\'il vient → ✅ Depuis qu\'il est venu/venait',
        english: 'Wrong: need past tense with DEPUIS QUE',
        highlight: ['Depuis qu\'il est venu']
      },
      {
        spanish: '❌ Avant qu\'il part → ✅ Avant qu\'il ne parte',
        english: 'Wrong: need subjunctive after AVANT QUE',
        highlight: ['Avant qu\'il ne parte']
      },
      {
        spanish: '❌ Il y avait que je travaille → ✅ Il y avait...que je travaillais',
        english: 'Wrong: need imperfect with IL Y AVAIT...QUE',
        highlight: ['Il y avait...que je travaillais']
      },
      {
        spanish: '❌ Jadis, ça fait longtemps → ✅ Jadis, il y a fort longtemps',
        english: 'Wrong: register mismatch between literary and informal',
        highlight: ['Jadis, il y a fort longtemps']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Numbers, Dates, Time', url: '/grammar/french/numbers/dates-time', difficulty: 'intermediate' },
  { title: 'French Imperfect Tense', url: '/grammar/french/verbs/imparfait', difficulty: 'intermediate' },
  { title: 'French Subjunctive Mood', url: '/grammar/french/verbs/subjunctive', difficulty: 'advanced' },
  { title: 'French Complex Sentences', url: '/grammar/french/syntax/complex-sentences', difficulty: 'advanced' }
];

export default function FrenchAdvancedTimePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'numbers',
              topic: 'advanced-time',
              title: 'French Advanced Time Expressions (Depuis with Imperfect, Complex Duration)',
              description: 'Master advanced French time expressions including depuis with imperfect tense, complex duration, and sophisticated temporal relationships.',
              difficulty: 'advanced',
              examples: [
                'Depuis qu\'il était petit... (Since he was little...)',
                'Il y avait longtemps que... (It had been a long time since...)',
                'Cela faisait deux ans qu\'il... (It had been two years since he...)',
                'D\'ici là, nous aurons fini. (By then, we will have finished.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'numbers',
              topic: 'advanced-time',
              title: 'French Advanced Time Expressions (Depuis with Imperfect, Complex Duration)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="numbers"
        topic="advanced-time"
        title="French Advanced Time Expressions (Depuis with Imperfect, Complex Duration)"
        description="Master advanced French time expressions including depuis with imperfect tense, complex duration, and sophisticated temporal relationships"
        difficulty="advanced"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/french/numbers"
        practiceUrl="/grammar/french/numbers/advanced-time/practice"
        quizUrl="/grammar/french/numbers/advanced-time/quiz"
        songUrl="/songs/fr?theme=grammar&topic=advanced-time"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

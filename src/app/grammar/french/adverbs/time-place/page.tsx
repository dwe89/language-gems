import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adverbs',
  topic: 'time-place',
  title: 'French Adverbs of Time and Place (Hier, Demain, Ici, Là)',
  description: 'Master French adverbs of time and place including hier, aujourd\'hui, demain, ici, là, partout, and their usage.',
  difficulty: 'beginner',
  keywords: [
    'french adverbs time place',
    'hier demain french',
    'ici là french',
    'aujourd\'hui french',
    'maintenant french',
    'partout french',
    'time place adverbs french'
  ],
  examples: [
    'Hier, j\'ai travaillé. (Yesterday, I worked.)',
    'Demain, nous partons. (Tomorrow, we leave.)',
    'Ici, c\'est ma maison. (Here is my house.)',
    'Là-bas, il y a un café. (Over there, there\'s a café.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Adverbs of Time and Place',
    content: `French adverbs of time and place provide **essential context** for when and where actions occur. They are **invariable** and typically placed at the **beginning or end** of sentences.

**Time adverbs (adverbes de temps):**
- **Past**: hier, avant-hier, autrefois
- **Present**: aujourd'hui, maintenant, actuellement
- **Future**: demain, après-demain, bientôt

**Place adverbs (adverbes de lieu):**
- **Here/There**: ici, là, là-bas
- **Direction**: dehors, dedans, partout
- **Position**: dessus, dessous, devant, derrière

**Key characteristics:**
- **Invariable**: Never change form
- **Flexible position**: Can start or end sentences
- **Essential context**: Provide temporal and spatial reference
- **High frequency**: Used constantly in everyday French

These adverbs are fundamental for expressing when and where actions take place.`,
    examples: [
      {
        spanish: 'Hier, j\'ai rencontré Paul. (Yesterday, I met Paul.)',
        english: 'Time adverb at the beginning for emphasis',
        highlight: ['Hier, j\'ai rencontré Paul']
      },
      {
        spanish: 'Nous habitons ici. (We live here.)',
        english: 'Place adverb at the end for location',
        highlight: ['Nous habitons ici']
      },
      {
        spanish: 'Maintenant, tout va bien. (Now, everything is fine.)',
        english: 'Present time adverb for current state',
        highlight: ['Maintenant, tout va bien']
      }
    ]
  },
  {
    title: 'Time Adverbs: Past',
    content: `Adverbs referring to **past time**:`,
    conjugationTable: {
      title: 'Past Time Adverbs',
      conjugations: [
        { pronoun: 'hier', form: 'yesterday', english: 'Hier, il a plu. (Yesterday, it rained.)' },
        { pronoun: 'avant-hier', form: 'day before yesterday', english: 'Avant-hier, j\'étais malade. (Day before yesterday, I was sick.)' },
        { pronoun: 'autrefois', form: 'formerly, in the past', english: 'Autrefois, c\'était différent. (In the past, it was different.)' },
        { pronoun: 'jadis', form: 'long ago', english: 'Jadis, les gens vivaient différemment. (Long ago, people lived differently.)' },
        { pronoun: 'récemment', form: 'recently', english: 'Récemment, j\'ai déménagé. (Recently, I moved.)' },
        { pronoun: 'dernièrement', form: 'lately', english: 'Dernièrement, il fait beau. (Lately, the weather has been nice.)' }
      ]
    },
    examples: [
      {
        spanish: 'Hier soir, nous avons dîné au restaurant. (Last night, we dined at the restaurant.)',
        english: 'Avant-hier matin, j\'ai fait du sport. (The morning before yesterday, I did sports.)',
        highlight: ['Hier soir', 'Avant-hier matin']
      }
    ],
    subsections: [
      {
        title: 'HIER Expressions',
        content: 'Common phrases with "hier":',
        examples: [
          {
            spanish: 'hier matin (yesterday morning)',
            english: 'hier soir (last night)',
            highlight: ['hier matin', 'hier soir']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Adverbs: Present',
    content: `Adverbs referring to **present time**:`,
    conjugationTable: {
      title: 'Present Time Adverbs',
      conjugations: [
        { pronoun: 'aujourd\'hui', form: 'today', english: 'Aujourd\'hui, c\'est lundi. (Today is Monday.)' },
        { pronoun: 'maintenant', form: 'now', english: 'Maintenant, je comprends. (Now, I understand.)' },
        { pronoun: 'actuellement', form: 'currently', english: 'Actuellement, je travaille ici. (Currently, I work here.)' },
        { pronoun: 'en ce moment', form: 'at this moment', english: 'En ce moment, il pleut. (At this moment, it\'s raining.)' },
        { pronoun: 'à présent', form: 'at present', english: 'À présent, tout va bien. (At present, everything is fine.)' }
      ]
    },
    examples: [
      {
        spanish: 'Aujourd\'hui, il fait beau. (Today, the weather is nice.)',
        english: 'Maintenant, je dois partir. (Now, I have to leave.)',
        highlight: ['Aujourd\'hui, il fait beau', 'Maintenant, je dois partir']
      }
    ],
    subsections: [
      {
        title: 'MAINTENANT vs ACTUELLEMENT',
        content: 'Different uses of "now":',
        examples: [
          {
            spanish: 'Maintenant = right now (immediate)',
            english: 'Actuellement = currently (ongoing period)',
            highlight: ['Maintenant', 'Actuellement']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Adverbs: Future',
    content: `Adverbs referring to **future time**:`,
    conjugationTable: {
      title: 'Future Time Adverbs',
      conjugations: [
        { pronoun: 'demain', form: 'tomorrow', english: 'Demain, nous partons. (Tomorrow, we leave.)' },
        { pronoun: 'après-demain', form: 'day after tomorrow', english: 'Après-demain, c\'est dimanche. (Day after tomorrow is Sunday.)' },
        { pronoun: 'bientôt', form: 'soon', english: 'Bientôt, les vacances! (Soon, vacation!)' },
        { pronoun: 'plus tard', form: 'later', english: 'Plus tard, nous verrons. (Later, we\'ll see.)' },
        { pronoun: 'prochainement', form: 'soon, shortly', english: 'Prochainement, un nouveau film. (Soon, a new movie.)' },
        { pronoun: 'désormais', form: 'from now on', english: 'Désormais, je serai prudent. (From now on, I\'ll be careful.)' }
      ]
    },
    examples: [
      {
        spanish: 'Demain matin, j\'ai rendez-vous. (Tomorrow morning, I have an appointment.)',
        english: 'Bientôt, nous serons en vacances. (Soon, we\'ll be on vacation.)',
        highlight: ['Demain matin', 'Bientôt, nous serons']
      }
    ],
    subsections: [
      {
        title: 'DEMAIN Expressions',
        content: 'Common phrases with "demain":',
        examples: [
          {
            spanish: 'demain matin (tomorrow morning)',
            english: 'demain soir (tomorrow evening)',
            highlight: ['demain matin', 'demain soir']
          }
        ]
      }
    ]
  },
  {
    title: 'Place Adverbs: Here and There',
    content: `Adverbs indicating **proximity and distance**:`,
    conjugationTable: {
      title: 'Here/There Adverbs',
      conjugations: [
        { pronoun: 'ici', form: 'here (close to speaker)', english: 'Ici, c\'est ma maison. (Here is my house.)' },
        { pronoun: 'là', form: 'there (near listener)', english: 'Là, c\'est ton bureau. (There is your office.)' },
        { pronoun: 'là-bas', form: 'over there (far away)', english: 'Là-bas, il y a un café. (Over there, there\'s a café.)' },
        { pronoun: 'là-haut', form: 'up there', english: 'Là-haut, dans les montagnes. (Up there, in the mountains.)' },
        { pronoun: 'là-dedans', form: 'in there', english: 'Là-dedans, il fait chaud. (In there, it\'s hot.)' },
        { pronoun: 'par ici', form: 'this way', english: 'Par ici, s\'il vous plaît. (This way, please.)' }
      ]
    },
    examples: [
      {
        spanish: 'Viens ici! (Come here!)',
        english: 'Regarde là-bas! (Look over there!)',
        highlight: ['Viens ici', 'Regarde là-bas']
      }
    ],
    subsections: [
      {
        title: 'ICI vs LÀ vs LÀ-BAS',
        content: 'Distance distinctions:',
        examples: [
          {
            spanish: 'ICI = near speaker (here)',
            english: 'LÀ = near listener (there)',
            highlight: ['ICI = near speaker', 'LÀ = near listener']
          },
          {
            spanish: 'LÀ-BAS = far from both (over there)',
            english: 'Distance increases: ici → là → là-bas',
            highlight: ['LÀ-BAS = far from both']
          }
        ]
      }
    ]
  },
  {
    title: 'Place Adverbs: Direction and Position',
    content: `Adverbs indicating **direction and spatial relationships**:`,
    conjugationTable: {
      title: 'Direction/Position Adverbs',
      conjugations: [
        { pronoun: 'dehors', form: 'outside', english: 'Il fait froid dehors. (It\'s cold outside.)' },
        { pronoun: 'dedans', form: 'inside', english: 'Reste dedans! (Stay inside!)' },
        { pronoun: 'partout', form: 'everywhere', english: 'Il y a des fleurs partout. (There are flowers everywhere.)' },
        { pronoun: 'nulle part', form: 'nowhere', english: 'Je ne trouve mes clés nulle part. (I can\'t find my keys anywhere.)' },
        { pronoun: 'quelque part', form: 'somewhere', english: 'Il est quelque part dans la maison. (He\'s somewhere in the house.)' },
        { pronoun: 'ailleurs', form: 'elsewhere', english: 'Cherchons ailleurs. (Let\'s look elsewhere.)' }
      ]
    },
    examples: [
      {
        spanish: 'Les enfants jouent dehors. (The children are playing outside.)',
        english: 'J\'ai cherché partout. (I looked everywhere.)',
        highlight: ['jouent dehors', 'cherché partout']
      }
    ],
    subsections: [
      {
        title: 'PARTOUT vs NULLE PART',
        content: 'Opposite meanings:',
        examples: [
          {
            spanish: 'PARTOUT = everywhere (positive)',
            english: 'NULLE PART = nowhere (negative)',
            highlight: ['PARTOUT = everywhere', 'NULLE PART = nowhere']
          }
        ]
      }
    ]
  },
  {
    title: 'Position in Sentences',
    content: `Time and place adverbs have **flexible positioning**:`,
    examples: [
      {
        spanish: 'Hier, j\'ai travaillé. (Yesterday, I worked.) - Beginning',
        english: 'J\'ai travaillé hier. (I worked yesterday.) - End',
        highlight: ['Hier, j\'ai travaillé', 'J\'ai travaillé hier']
      },
      {
        spanish: 'Ici, nous sommes chez nous. (Here, we are at home.) - Beginning',
        english: 'Nous habitons ici. (We live here.) - End',
        highlight: ['Ici, nous sommes', 'Nous habitons ici']
      }
    ],
    subsections: [
      {
        title: 'Beginning Position (Emphasis)',
        content: 'For emphasis or contrast:',
        examples: [
          {
            spanish: 'Hier, il pleuvait. Aujourd\'hui, il fait beau.',
            english: 'Yesterday, it was raining. Today, it\'s nice.',
            highlight: ['Hier, il pleuvait', 'Aujourd\'hui, il fait beau']
          }
        ]
      },
      {
        title: 'End Position (Natural)',
        content: 'More natural, less emphatic:',
        examples: [
          {
            spanish: 'Je travaille maintenant. (I\'m working now.)',
            english: 'Il habite là-bas. (He lives over there.)',
            highlight: ['travaille maintenant', 'habite là-bas']
          }
        ]
      }
    ]
  },
  {
    title: 'Compound Time Expressions',
    content: `Combining time adverbs with other words:`,
    examples: [
      {
        spanish: 'hier soir (last night), demain matin (tomorrow morning)',
        english: 'avant-hier soir (night before last), après-demain matin (morning after tomorrow)',
        highlight: ['hier soir', 'demain matin', 'avant-hier soir']
      }
    ],
    subsections: [
      {
        title: 'Time of Day Combinations',
        content: 'Adding specific times:',
        examples: [
          {
            spanish: 'hier matin (yesterday morning)',
            english: 'demain après-midi (tomorrow afternoon)',
            highlight: ['hier matin', 'demain après-midi']
          }
        ]
      }
    ]
  },
  {
    title: 'Frequency and Duration Adverbs',
    content: `Related adverbs expressing **how often** or **how long**:`,
    conjugationTable: {
      title: 'Frequency/Duration Adverbs',
      conjugations: [
        { pronoun: 'toujours', form: 'always', english: 'Il est toujours en retard. (He\'s always late.)' },
        { pronoun: 'souvent', form: 'often', english: 'Nous venons souvent ici. (We often come here.)' },
        { pronoun: 'parfois', form: 'sometimes', english: 'Parfois, je lis le soir. (Sometimes, I read in the evening.)' },
        { pronoun: 'jamais', form: 'never', english: 'Je ne viens jamais ici. (I never come here.)' },
        { pronoun: 'longtemps', form: 'for a long time', english: 'J\'ai attendu longtemps. (I waited for a long time.)' }
      ]
    }
  },
  {
    title: 'Common Expressions and Idioms',
    content: `Fixed expressions with time and place adverbs:`,
    examples: [
      {
        spanish: 'ici et là (here and there)',
        english: 'de temps en temps (from time to time)',
        highlight: ['ici et là', 'de temps en temps']
      },
      {
        spanish: 'par ici (this way), par là (that way)',
        english: 'd\'ici là (by then), jusque-là (until then)',
        highlight: ['par ici', 'par là', 'd\'ici là']
      }
    ],
    subsections: [
      {
        title: 'Directional Expressions',
        content: 'Giving directions:',
        examples: [
          {
            spanish: 'Par ici, s\'il vous plaît. (This way, please.)',
            english: 'Allez tout droit, puis tournez là-bas. (Go straight, then turn over there.)',
            highlight: ['Par ici, s\'il vous plaît', 'tournez là-bas']
          }
        ]
      }
    ]
  },
  {
    title: 'Negation with Place Adverbs',
    content: `Special negative constructions:`,
    examples: [
      {
        spanish: 'Je ne vais nulle part. (I\'m not going anywhere.)',
        english: 'Il n\'est jamais là. (He\'s never there.)',
        highlight: ['ne vais nulle part', 'n\'est jamais là']
      }
    ],
    subsections: [
      {
        title: 'NULLE PART',
        content: 'Negative place adverb:',
        examples: [
          {
            spanish: 'Je ne trouve mes clés nulle part. (I can\'t find my keys anywhere.)',
            english: 'Requires "ne" for complete negation',
            highlight: ['ne trouve mes clés nulle part']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Time and Place Adverbs',
    content: `Here are frequent errors students make:

**1. Position errors**: Wrong placement in sentences
**2. Confusion between similar adverbs**: Mixing up meanings
**3. Missing negation**: Forgetting "ne" with negative adverbs
**4. Overuse**: Using too many adverbs in one sentence`,
    examples: [
      {
        spanish: '❌ Je vais demain là → ✅ Demain, je vais là-bas',
        english: 'Wrong: awkward word order and missing -bas',
        highlight: ['Demain, je vais là-bas']
      },
      {
        spanish: '❌ Actuellement, je viens → ✅ Maintenant, je viens',
        english: 'Wrong: "actuellement" means "currently" not "now"',
        highlight: ['Maintenant, je viens']
      },
      {
        spanish: '❌ Je vais nulle part → ✅ Je ne vais nulle part',
        english: 'Wrong: missing "ne" with negative adverb',
        highlight: ['Je ne vais nulle part']
      },
      {
        spanish: '❌ Hier maintenant ici → ✅ Hier, j\'étais ici',
        english: 'Wrong: too many adverbs, contradictory time references',
        highlight: ['Hier, j\'étais ici']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Time Expressions', url: '/grammar/french/numbers/dates-time', difficulty: 'intermediate' },
  { title: 'French Frequency Adverbs', url: '/grammar/french/adverbs/frequency', difficulty: 'beginner' },
  { title: 'French Prepositions of Place', url: '/grammar/french/prepositions/location', difficulty: 'intermediate' },
  { title: 'French Negation', url: '/grammar/french/syntax/negation', difficulty: 'intermediate' }
];

export default function FrenchTimePlaceAdverbsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'adverbs',
              topic: 'time-place',
              title: 'French Adverbs of Time and Place (Hier, Demain, Ici, Là)',
              description: 'Master French adverbs of time and place including hier, aujourd\'hui, demain, ici, là, partout, and their usage.',
              difficulty: 'beginner',
              examples: [
                'Hier, j\'ai travaillé. (Yesterday, I worked.)',
                'Demain, nous partons. (Tomorrow, we leave.)',
                'Ici, c\'est ma maison. (Here is my house.)',
                'Là-bas, il y a un café. (Over there, there\'s a café.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adverbs',
              topic: 'time-place',
              title: 'French Adverbs of Time and Place (Hier, Demain, Ici, Là)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adverbs"
        topic="time-place"
        title="French Adverbs of Time and Place (Hier, Demain, Ici, Là)"
        description="Master French adverbs of time and place including hier, aujourd'hui, demain, ici, là, partout, and their usage"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/french/adverbs"
        practiceUrl="/grammar/french/adverbs/time-place/practice"
        quizUrl="/grammar/french/adverbs/time-place/quiz"
        songUrl="/songs/fr?theme=grammar&topic=time-place"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

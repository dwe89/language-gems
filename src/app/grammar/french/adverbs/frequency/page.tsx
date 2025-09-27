import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adverbs',
  topic: 'frequency',
  title: 'French Frequency Adverbs (Toujours, Souvent, Jamais)',
  description: 'Master French frequency adverbs for expressing how often actions occur. Learn toujours, souvent, parfois, jamais, and placement.',
  difficulty: 'beginner',
  keywords: [
    'french frequency adverbs',
    'toujours souvent jamais',
    'parfois quelquefois',
    'how often french',
    'frequency expressions french',
    'time adverbs french'
  ],
  examples: [
    'Je vais toujours au travail (I always go to work)',
    'Elle mange souvent au restaurant (She often eats at restaurants)',
    'Il ne vient jamais (He never comes)',
    'Nous sortons parfois (We sometimes go out)'
  ]
});

const sections = [
  {
    title: 'Understanding Frequency Adverbs',
    content: `French frequency adverbs express **how often** an action occurs. They answer the question "combien de fois?" (how many times?) or "à quelle fréquence?" (how frequently?).

These adverbs are essential for describing habits, routines, and recurring actions in French.

Frequency adverbs have specific placement rules and some require special negation patterns.`,
    examples: [
      {
        spanish: 'Je mange toujours à midi. (I always eat at noon.)',
        english: 'Expressing a regular habit',
        highlight: ['toujours']
      },
      {
        spanish: 'Elle ne sort jamais le soir. (She never goes out in the evening.)',
        english: 'Expressing absence of action',
        highlight: ['ne sort jamais']
      },
      {
        spanish: 'Nous voyageons parfois en été. (We sometimes travel in summer.)',
        english: 'Expressing occasional action',
        highlight: ['parfois']
      }
    ]
  },
  {
    title: 'High Frequency Adverbs',
    content: `Adverbs expressing frequent or constant actions:`,
    subsections: [
      {
        title: 'TOUJOURS (Always)',
        content: 'Expresses actions that happen 100% of the time:',
        examples: [
          {
            spanish: 'Il est toujours en retard. (He is always late.)',
            english: 'Elle dit toujours la vérité. (She always tells the truth.)',
            highlight: ['toujours']
          },
          {
            spanish: 'Nous prenons toujours le métro. (We always take the metro.)',
            english: 'Tu arrives toujours à l\'heure. (You always arrive on time.)',
            highlight: ['toujours']
          }
        ]
      },
      {
        title: 'SOUVENT (Often)',
        content: 'Expresses frequent but not constant actions:',
        examples: [
          {
            spanish: 'Je vais souvent au cinéma. (I often go to the movies.)',
            english: 'Il pleut souvent en automne. (It often rains in autumn.)',
            highlight: ['souvent']
          },
          {
            spanish: 'Elle mange souvent des légumes. (She often eats vegetables.)',
            english: 'Nous parlons souvent français. (We often speak French.)',
            highlight: ['souvent']
          }
        ]
      },
      {
        title: 'FRÉQUEMMENT (Frequently)',
        content: 'More formal way to express frequent actions:',
        examples: [
          {
            spanish: 'Il voyage fréquemment pour le travail. (He frequently travels for work.)',
            english: 'Elle utilise fréquemment l\'ordinateur. (She frequently uses the computer.)',
            highlight: ['fréquemment']
          }
        ]
      }
    ]
  },
  {
    title: 'Medium Frequency Adverbs',
    content: `Adverbs expressing occasional or moderate frequency:`,
    subsections: [
      {
        title: 'PARFOIS (Sometimes)',
        content: 'Expresses occasional actions:',
        examples: [
          {
            spanish: 'Je lis parfois le journal. (I sometimes read the newspaper.)',
            english: 'Il pleut parfois en été. (It sometimes rains in summer.)',
            highlight: ['parfois']
          },
          {
            spanish: 'Nous sortons parfois le weekend. (We sometimes go out on weekends.)',
            english: 'Elle boit parfois du café. (She sometimes drinks coffee.)',
            highlight: ['parfois']
          }
        ]
      },
      {
        title: 'QUELQUEFOIS (Sometimes)',
        content: 'Synonym of parfois, slightly more formal:',
        examples: [
          {
            spanish: 'Il vient quelquefois nous voir. (He sometimes comes to see us.)',
            english: 'Je mange quelquefois au restaurant. (I sometimes eat at restaurants.)',
            highlight: ['quelquefois']
          }
        ]
      },
      {
        title: 'DE TEMPS EN TEMPS (From Time to Time)',
        content: 'Expresses infrequent but regular occurrence:',
        examples: [
          {
            spanish: 'Elle appelle de temps en temps. (She calls from time to time.)',
            english: 'Nous voyageons de temps en temps. (We travel from time to time.)',
            highlight: ['de temps en temps']
          }
        ]
      }
    ]
  },
  {
    title: 'Low Frequency and Negative Adverbs',
    content: `Adverbs expressing rare or absent actions:`,
    subsections: [
      {
        title: 'RAREMENT (Rarely/Seldom)',
        content: 'Expresses infrequent actions:',
        examples: [
          {
            spanish: 'Il sort rarement le soir. (He rarely goes out in the evening.)',
            english: 'Elle mange rarement de la viande. (She rarely eats meat.)',
            highlight: ['rarement']
          },
          {
            spanish: 'Nous voyons rarement nos voisins. (We rarely see our neighbors.)',
            english: 'Tu arrives rarement en retard. (You rarely arrive late.)',
            highlight: ['rarement']
          }
        ]
      },
      {
        title: 'JAMAIS (Never)',
        content: 'Expresses complete absence of action - requires NE:',
        examples: [
          {
            spanish: 'Je ne fume jamais. (I never smoke.)',
            english: 'Elle ne ment jamais. (She never lies.)',
            highlight: ['ne fume jamais', 'ne ment jamais']
          },
          {
            spanish: 'Il n\'arrive jamais à l\'heure. (He never arrives on time.)',
            english: 'Nous ne mangeons jamais de fast-food. (We never eat fast food.)',
            highlight: ['n\'arrive jamais', 'ne mangeons jamais']
          }
        ]
      },
      {
        title: 'NE...PLUS (No Longer/Not Anymore)',
        content: 'Expresses cessation of a previous habit:',
        examples: [
          {
            spanish: 'Je ne fume plus. (I no longer smoke/I don\'t smoke anymore.)',
            english: 'Il ne vient plus nous voir. (He doesn\'t come to see us anymore.)',
            highlight: ['ne fume plus', 'ne vient plus']
          }
        ]
      }
    ]
  },
  {
    title: 'Frequency Scale and Comparison',
    content: `French frequency adverbs on a scale from most to least frequent:`,
    subsections: [
      {
        title: 'Frequency Scale',
        content: 'From always to never:',
        conjugationTable: {
          title: 'Frequency Scale (100% → 0%)',
          conjugations: [
            { pronoun: 'toujours', form: '100%', english: 'always' },
            { pronoun: 'souvent', form: '~80%', english: 'often' },
            { pronoun: 'parfois/quelquefois', form: '~50%', english: 'sometimes' },
            { pronoun: 'de temps en temps', form: '~30%', english: 'from time to time' },
            { pronoun: 'rarement', form: '~10%', english: 'rarely' },
            { pronoun: 'jamais', form: '0%', english: 'never' }
          ]
        }
      },
      {
        title: 'Comparative Examples',
        content: 'Comparing different frequencies:',
        examples: [
          {
            spanish: 'Il mange toujours des légumes, elle en mange souvent. (He always eats vegetables, she often eats them.)',
            english: 'Comparing high frequencies',
            highlight: ['toujours', 'souvent']
          },
          {
            spanish: 'Je sors parfois, mais lui ne sort jamais. (I sometimes go out, but he never goes out.)',
            english: 'Comparing medium and zero frequency',
            highlight: ['parfois', 'ne sort jamais']
          }
        ]
      }
    ]
  },
  {
    title: 'Placement of Frequency Adverbs',
    content: `Frequency adverbs follow standard adverb placement rules:`,
    examples: [
      {
        spanish: 'Simple tenses: Je mange toujours à midi. (I always eat at noon.)',
        english: 'After conjugated verb',
        highlight: ['mange toujours']
      },
      {
        spanish: 'Compound tenses: J\'ai souvent mangé ici. (I have often eaten here.)',
        english: 'Between auxiliary and past participle',
        highlight: ['ai souvent mangé']
      }
    ],
    subsections: [
      {
        title: 'Placement in Different Tenses',
        content: 'How frequency adverbs are placed:',
        examples: [
          {
            spanish: 'Present: Elle vient souvent. (She often comes.)',
            english: 'Imperfect: Elle venait souvent. (She used to come often.)',
            highlight: ['vient souvent', 'venait souvent']
          },
          {
            spanish: 'Passé composé: Elle est souvent venue. (She has often come.)',
            english: 'Future: Elle viendra souvent. (She will often come.)',
            highlight: ['est souvent venue', 'viendra souvent']
          }
        ]
      },
      {
        title: 'Emphasis and Beginning Position',
        content: 'Frequency adverbs can start sentences for emphasis:',
        examples: [
          {
            spanish: 'Souvent, je pense à toi. (Often, I think of you.)',
            english: 'Parfois, il pleut en été. (Sometimes, it rains in summer.)',
            highlight: ['Souvent', 'Parfois']
          }
        ]
      }
    ]
  },
  {
    title: 'Expressions of Specific Frequency',
    content: `More specific ways to express frequency:`,
    examples: [
      {
        spanish: 'une fois par semaine (once a week)',
        english: 'deux fois par mois (twice a month)',
        highlight: ['une fois par semaine', 'deux fois par mois']
      },
      {
        spanish: 'tous les jours (every day)',
        english: 'chaque matin (every morning)',
        highlight: ['tous les jours', 'chaque matin']
      }
    ],
    subsections: [
      {
        title: 'Numerical Frequency',
        content: 'Expressing exact frequency:',
        examples: [
          {
            spanish: 'Je vais au gym trois fois par semaine. (I go to the gym three times a week.)',
            english: 'Il appelle une fois par jour. (He calls once a day.)',
            highlight: ['trois fois par semaine', 'une fois par jour']
          }
        ]
      },
      {
        title: 'Regular Intervals',
        content: 'Expressing regular patterns:',
        examples: [
          {
            spanish: 'tous les lundis (every Monday)',
            english: 'chaque année (every year)',
            highlight: ['tous les lundis', 'chaque année']
          },
          {
            spanish: 'toutes les deux heures (every two hours)',
            english: 'une semaine sur deux (every other week)',
            highlight: ['toutes les deux heures', 'une semaine sur deux']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Frequency Adverb Mistakes',
    content: `Here are frequent errors students make:

**1. Missing negation**: Forgetting ne with jamais
**2. Wrong placement**: Incorrect position in compound tenses  
**3. Overuse of toujours**: Using always when often is more appropriate
**4. Confusion with time**: Mixing frequency and time adverbs`,
    examples: [
      {
        spanish: '❌ Je jamais mange → ✅ Je ne mange jamais',
        english: 'Wrong: must include ne with jamais',
        highlight: ['ne mange jamais']
      },
      {
        spanish: '❌ J\'ai mangé souvent → ✅ J\'ai souvent mangé',
        english: 'Wrong: frequency adverbs go between auxiliary and participle',
        highlight: ['ai souvent mangé']
      },
      {
        spanish: '❌ Je vais toujours au cinéma (once a month) → ✅ Je vais parfois au cinéma',
        english: 'Wrong: toujours means 100% of the time',
        highlight: ['parfois']
      },
      {
        spanish: '❌ Je mange hier souvent → ✅ Hier, j\'ai souvent mangé',
        english: 'Wrong: don\'t mix time (hier) and frequency (souvent)',
        highlight: ['Hier, j\'ai souvent mangé']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Adverb Placement', url: '/grammar/french/adverbs/placement', difficulty: 'intermediate' },
  { title: 'French Negation', url: '/grammar/french/syntax/negation', difficulty: 'intermediate' },
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time', difficulty: 'beginner' },
  { title: 'French Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' }
];

export default function FrenchFrequencyPage() {
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
              topic: 'frequency',
              title: 'French Frequency Adverbs (Toujours, Souvent, Jamais)',
              description: 'Master French frequency adverbs for expressing how often actions occur. Learn toujours, souvent, parfois, jamais, and placement.',
              difficulty: 'beginner',
              examples: [
                'Je vais toujours au travail (I always go to work)',
                'Elle mange souvent au restaurant (She often eats at restaurants)',
                'Il ne vient jamais (He never comes)',
                'Nous sortons parfois (We sometimes go out)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adverbs',
              topic: 'frequency',
              title: 'French Frequency Adverbs (Toujours, Souvent, Jamais)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adverbs"
        topic="frequency"
        title="French Frequency Adverbs (Toujours, Souvent, Jamais)"
        description="Master French frequency adverbs for expressing how often actions occur. Learn toujours, souvent, parfois, jamais, and placement"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/french/adverbs"
        practiceUrl="/grammar/french/adverbs/frequency/practice"
        quizUrl="/grammar/french/adverbs/frequency/quiz"
        songUrl="/songs/fr?theme=grammar&topic=frequency"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

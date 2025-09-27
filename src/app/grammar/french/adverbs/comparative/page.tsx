import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adverbs',
  topic: 'comparative',
  title: 'French Comparative Adverbs (Plus, Moins, Aussi + Adverb)',
  description: 'Master French comparative adverbs for comparing actions. Learn plus...que, moins...que, aussi...que with adverbs and irregular forms.',
  difficulty: 'intermediate',
  keywords: [
    'french comparative adverbs',
    'plus que moins que',
    'aussi que adverbs',
    'comparing adverbs french',
    'mieux pire adverbs',
    'adverb comparisons french'
  ],
  examples: [
    'Il court plus vite que moi (He runs faster than me)',
    'Elle parle moins fort que lui (She speaks less loudly than him)',
    'Tu chantes aussi bien que Marie (You sing as well as Marie)',
    'Je vais mieux maintenant (I\'m doing better now)'
  ]
});

const sections = [
  {
    title: 'Understanding Comparative Adverbs',
    content: `French comparative adverbs allow you to **compare actions** or **degrees of actions** between different subjects. They follow similar patterns to comparative adjectives but modify verbs instead of nouns.

There are three types of adverb comparisons:
**Superiority**: more than (plus...que)
**Inferiority**: less than (moins...que)
**Equality**: as...as (aussi...que)

These comparisons are essential for expressing preferences and making distinctions between how actions are performed.`,
    examples: [
      {
        spanish: 'Il parle plus lentement que moi. (He speaks more slowly than me.)',
        english: 'Superiority comparison with adverbs',
        highlight: ['plus lentement que']
      },
      {
        spanish: 'Elle travaille moins efficacement que lui. (She works less efficiently than him.)',
        english: 'Inferiority comparison with adverbs',
        highlight: ['moins efficacement que']
      },
      {
        spanish: 'Tu chantes aussi bien que Marie. (You sing as well as Marie.)',
        english: 'Equality comparison with adverbs',
        highlight: ['aussi bien que']
      }
    ]
  },
  {
    title: 'Superiority: Plus...Que (More Than)',
    content: `To express that an action is performed **more** intensely or frequently, use **plus + adverb + que**:`,
    examples: [
      {
        spanish: 'Il court plus vite que son frère. (He runs faster than his brother.)',
        english: 'Comparing speed of action',
        highlight: ['plus vite que']
      },
      {
        spanish: 'Elle travaille plus sérieusement que nous. (She works more seriously than us.)',
        english: 'Comparing manner of action',
        highlight: ['plus sérieusement que']
      }
    ],
    subsections: [
      {
        title: 'Formation with Regular Adverbs',
        content: 'How to form superiority comparisons:',
        conjugationTable: {
          title: 'Plus + Adverb + Que',
          conjugations: [
            { pronoun: 'plus vite que', form: 'faster than', english: 'Il court plus vite que moi.' },
            { pronoun: 'plus souvent que', form: 'more often than', english: 'Elle sort plus souvent que lui.' },
            { pronoun: 'plus facilement que', form: 'more easily than', english: 'Tu comprends plus facilement que nous.' },
            { pronoun: 'plus clairement que', form: 'more clearly than', english: 'Il explique plus clairement que le prof.' }
          ]
        }
      },
      {
        title: 'With Long Adverbs',
        content: 'Superiority works well with longer adverbs:',
        examples: [
          {
            spanish: 'Elle parle plus couramment que moi. (She speaks more fluently than me.)',
            english: 'Il travaille plus efficacement que nous. (He works more efficiently than us.)',
            highlight: ['plus couramment que', 'plus efficacement que']
          }
        ]
      }
    ]
  },
  {
    title: 'Inferiority: Moins...Que (Less Than)',
    content: `To express that an action is performed **less** intensely or frequently, use **moins + adverb + que**:`,
    examples: [
      {
        spanish: 'Il parle moins fort que toi. (He speaks less loudly than you.)',
        english: 'Comparing volume of speech',
        highlight: ['moins fort que']
      },
      {
        spanish: 'Elle vient moins souvent que avant. (She comes less often than before.)',
        english: 'Comparing frequency',
        highlight: ['moins souvent que']
      }
    ],
    subsections: [
      {
        title: 'Common Moins...Que Patterns',
        content: 'Frequently used inferiority comparisons:',
        examples: [
          {
            spanish: 'Tu dors moins bien que d\'habitude. (You sleep less well than usual.)',
            english: 'Il mange moins rapidement que sa sœur. (He eats less quickly than his sister.)',
            highlight: ['moins bien que', 'moins rapidement que']
          },
          {
            spanish: 'Nous travaillons moins dur que l\'année dernière. (We work less hard than last year.)',
            english: 'Elle conduit moins prudemment que lui. (She drives less carefully than him.)',
            highlight: ['moins dur que', 'moins prudemment que']
          }
        ]
      }
    ]
  },
  {
    title: 'Equality: Aussi...Que (As...As)',
    content: `To express that actions are performed **equally**, use **aussi + adverb + que**:`,
    examples: [
      {
        spanish: 'Il chante aussi bien que sa mère. (He sings as well as his mother.)',
        english: 'Equal level of singing ability',
        highlight: ['aussi bien que']
      },
      {
        spanish: 'Elle travaille aussi dur que nous. (She works as hard as us.)',
        english: 'Equal level of work intensity',
        highlight: ['aussi dur que']
      }
    ],
    subsections: [
      {
        title: 'Aussi...Que Examples',
        content: 'Common equality comparisons with adverbs:',
        conjugationTable: {
          title: 'Aussi + Adverb + Que',
          conjugations: [
            { pronoun: 'aussi bien que', form: 'as well as', english: 'Tu parles aussi bien que lui.' },
            { pronoun: 'aussi vite que', form: 'as fast as', english: 'Elle court aussi vite que moi.' },
            { pronoun: 'aussi souvent que', form: 'as often as', english: 'Il vient aussi souvent que toi.' },
            { pronoun: 'aussi clairement que', form: 'as clearly as', english: 'Elle explique aussi clairement que le prof.' }
          ]
        }
      }
    ]
  },
  {
    title: 'Irregular Comparative Adverbs',
    content: `Some adverbs have irregular comparative forms that don't use plus/moins/aussi:`,
    subsections: [
      {
        title: 'BIEN → MIEUX (Well → Better)',
        content: 'The adverb "bien" becomes "mieux" in comparisons:',
        examples: [
          {
            spanish: 'Il chante mieux que moi. (He sings better than me.)',
            english: 'Not "plus bien" - use mieux',
            highlight: ['mieux que']
          },
          {
            spanish: 'Elle va mieux aujourd\'hui. (She\'s doing better today.)',
            english: 'Mieux can be used alone',
            highlight: ['va mieux']
          },
          {
            spanish: 'Tu parles français mieux que l\'année dernière. (You speak French better than last year.)',
            english: 'Comparing improvement over time',
            highlight: ['mieux que']
          }
        ]
      },
      {
        title: 'MAL → PIRE/PLUS MAL (Badly → Worse)',
        content: 'The adverb "mal" can become "pire" or use "plus mal":',
        examples: [
          {
            spanish: 'Il chante pire que moi. (He sings worse than me.)',
            english: 'Using pire for worse',
            highlight: ['pire que']
          },
          {
            spanish: 'Elle conduit plus mal que lui. (She drives worse than him.)',
            english: 'Using plus mal for worse',
            highlight: ['plus mal que']
          }
        ]
      },
      {
        title: 'PEU → MOINS (Little → Less)',
        content: 'The adverb "peu" uses "moins" in comparisons:',
        examples: [
          {
            spanish: 'Il dort moins que moi. (He sleeps less than me.)',
            english: 'Not "plus peu" - use moins',
            highlight: ['moins que']
          }
        ]
      }
    ]
  },
  {
    title: 'Comparative Adverbs with Quantities',
    content: `When comparing quantities or amounts with adverbs, use special forms:`,
    examples: [
      {
        spanish: 'Il mange plus que moi. (He eats more than me.)',
        english: 'Comparing quantity of eating',
        highlight: ['mange plus que']
      },
      {
        spanish: 'Elle travaille moins que nous. (She works less than us.)',
        english: 'Comparing amount of work',
        highlight: ['travaille moins que']
      }
    ],
    subsections: [
      {
        title: 'Plus/Moins with Verbs',
        content: 'Using plus/moins directly with verbs:',
        examples: [
          {
            spanish: 'Je dors plus que toi. (I sleep more than you.)',
            english: 'Tu études moins que lui. (You study less than him.)',
            highlight: ['dors plus que', 'études moins que']
          },
          {
            spanish: 'Elle sort autant que nous. (She goes out as much as us.)',
            english: 'Using autant for equal quantities',
            highlight: ['autant que']
          }
        ]
      }
    ]
  },
  {
    title: 'Superlative Adverbs',
    content: `To express the highest or lowest degree, use **le plus/le moins + adverb**:`,
    examples: [
      {
        spanish: 'C\'est lui qui chante le mieux. (He\'s the one who sings the best.)',
        english: 'Superlative with irregular mieux',
        highlight: ['le mieux']
      },
      {
        spanish: 'Elle travaille le plus efficacement. (She works the most efficiently.)',
        english: 'Superlative with regular adverb',
        highlight: ['le plus efficacement']
      }
    ],
    subsections: [
      {
        title: 'Superlative Formation',
        content: 'How to form superlative adverbs:',
        conjugationTable: {
          title: 'Superlative Adverbs',
          conjugations: [
            { pronoun: 'le plus + adverb', form: 'the most', english: 'Il court le plus vite. (He runs the fastest.)' },
            { pronoun: 'le moins + adverb', form: 'the least', english: 'Elle parle le moins fort. (She speaks the least loudly.)' },
            { pronoun: 'le mieux', form: 'the best', english: 'Tu chantes le mieux. (You sing the best.)' },
            { pronoun: 'le pire', form: 'the worst', english: 'Il conduit le pire. (He drives the worst.)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Comparative Expressions and Idioms',
    content: `Common expressions using comparative adverbs:`,
    examples: [
      {
        spanish: 'de mieux en mieux (better and better)',
        english: 'Il parle français de mieux en mieux. (He speaks French better and better.)',
        highlight: ['de mieux en mieux']
      },
      {
        spanish: 'de plus en plus (more and more)',
        english: 'Elle travaille de plus en plus dur. (She works harder and harder.)',
        highlight: ['de plus en plus']
      }
    ],
    subsections: [
      {
        title: 'Progressive Comparisons',
        content: 'Expressions showing progression:',
        examples: [
          {
            spanish: 'de moins en moins (less and less): Il sort de moins en moins. (He goes out less and less.)',
            english: 'de pire en pire (worse and worse): Ça va de pire en pire. (It\'s getting worse and worse.)',
            highlight: ['de moins en moins', 'de pire en pire']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Comparative Adverb Mistakes',
    content: `Here are frequent errors students make:

**1. Using plus bien**: Using plus bien instead of mieux
**2. Wrong structure**: Incorrect word order in comparisons
**3. Missing que**: Forgetting que in comparative structures
**4. Adjective confusion**: Using adjective comparatives with adverbs`,
    examples: [
      {
        spanish: '❌ Il chante plus bien → ✅ Il chante mieux',
        english: 'Wrong: bien becomes mieux, not plus bien',
        highlight: ['mieux']
      },
      {
        spanish: '❌ Il plus vite court → ✅ Il court plus vite',
        english: 'Wrong: adverb goes after verb',
        highlight: ['court plus vite']
      },
      {
        spanish: '❌ Il court plus vite moi → ✅ Il court plus vite que moi',
        english: 'Wrong: must include que in comparisons',
        highlight: ['plus vite que']
      },
      {
        spanish: '❌ Il court plus rapide → ✅ Il court plus rapidement',
        english: 'Wrong: use adverb rapidement, not adjective rapide',
        highlight: ['plus rapidement']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Comparative Adjectives', url: '/grammar/french/adjectives/comparative', difficulty: 'intermediate' },
  { title: 'French Superlative Adjectives', url: '/grammar/french/adjectives/superlative', difficulty: 'intermediate' },
  { title: 'French Adverb Formation', url: '/grammar/french/adverbs/formation', difficulty: 'intermediate' },
  { title: 'French Degree Adverbs', url: '/grammar/french/adverbs/degree', difficulty: 'beginner' }
];

export default function FrenchComparativeAdverbsPage() {
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
              topic: 'comparative',
              title: 'French Comparative Adverbs (Plus, Moins, Aussi + Adverb)',
              description: 'Master French comparative adverbs for comparing actions. Learn plus...que, moins...que, aussi...que with adverbs and irregular forms.',
              difficulty: 'intermediate',
              examples: [
                'Il court plus vite que moi (He runs faster than me)',
                'Elle parle moins fort que lui (She speaks less loudly than him)',
                'Tu chantes aussi bien que Marie (You sing as well as Marie)',
                'Je vais mieux maintenant (I\'m doing better now)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adverbs',
              topic: 'comparative',
              title: 'French Comparative Adverbs (Plus, Moins, Aussi + Adverb)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adverbs"
        topic="comparative"
        title="French Comparative Adverbs (Plus, Moins, Aussi + Adverb)"
        description="Master French comparative adverbs for comparing actions. Learn plus...que, moins...que, aussi...que with adverbs and irregular forms"
        difficulty="intermediate"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/french/adverbs"
        practiceUrl="/grammar/french/adverbs/comparative/practice"
        quizUrl="/grammar/french/adverbs/comparative/quiz"
        songUrl="/songs/fr?theme=grammar&topic=comparative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

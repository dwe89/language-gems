import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adverbs',
  topic: 'placement',
  title: 'French Adverb Placement Rules (Position in Sentences)',
  description: 'Master French adverb placement in simple and compound tenses. Learn where to place adverbs with verbs, adjectives, and other adverbs.',
  difficulty: 'intermediate',
  keywords: [
    'french adverb placement',
    'adverb position french',
    'where to place adverbs',
    'french grammar adverbs',
    'adverb order french',
    'sentence structure french'
  ],
  examples: [
    'Il parle souvent français (He often speaks French)',
    'Elle a bien mangé (She ate well)',
    'Tu es très intelligent (You are very intelligent)',
    'Il conduit assez lentement (He drives quite slowly)'
  ]
});

const sections = [
  {
    title: 'Understanding French Adverb Placement',
    content: `French adverb placement is more flexible than English, but there are important rules to follow. The position depends on:

**1. What the adverb modifies** (verb, adjective, or another adverb)
**2. The type of adverb** (manner, time, frequency, etc.)
**3. The tense** (simple vs compound tenses)

Correct placement is crucial for natural-sounding French.`,
    examples: [
      {
        spanish: 'Il parle bien français. (He speaks French well.)',
        english: 'Adverb after verb in simple tense',
        highlight: ['parle bien']
      },
      {
        spanish: 'Il a bien parlé. (He spoke well.)',
        english: 'Adverb between auxiliary and past participle',
        highlight: ['a bien parlé']
      },
      {
        spanish: 'Elle est très intelligente. (She is very intelligent.)',
        english: 'Adverb before adjective',
        highlight: ['très intelligente']
      }
    ]
  },
  {
    title: 'Adverbs Modifying Verbs - Simple Tenses',
    content: `In simple tenses (present, imperfect, future), adverbs usually go **after** the conjugated verb:`,
    examples: [
      {
        spanish: 'Je mange souvent au restaurant. (I often eat at the restaurant.)',
        english: 'Frequency adverb after verb',
        highlight: ['mange souvent']
      },
      {
        spanish: 'Elle parle lentement. (She speaks slowly.)',
        english: 'Manner adverb after verb',
        highlight: ['parle lentement']
      },
      {
        spanish: 'Nous travaillons beaucoup. (We work a lot.)',
        english: 'Quantity adverb after verb',
        highlight: ['travaillons beaucoup']
      }
    ],
    subsections: [
      {
        title: 'Common Adverbs After Verbs',
        content: 'Frequently used adverbs that follow verbs:',
        conjugationTable: {
          title: 'Verb + Adverb Pattern',
          conjugations: [
            { pronoun: 'Frequency', form: 'souvent, toujours, jamais', english: 'Il vient souvent. (He comes often.)' },
            { pronoun: 'Manner', form: 'bien, mal, vite', english: 'Elle chante bien. (She sings well.)' },
            { pronoun: 'Quantity', form: 'beaucoup, peu, trop', english: 'Tu manges trop. (You eat too much.)' },
            { pronoun: 'Degree', form: 'assez, très, plutôt', english: 'Il dort assez. (He sleeps enough.)' }
          ]
        }
      },
      {
        title: 'Long Adverbs at End',
        content: 'Longer adverbs typically go at the end of the clause:',
        examples: [
          {
            spanish: 'Il parle français couramment. (He speaks French fluently.)',
            english: 'Long manner adverb at end',
            highlight: ['couramment']
          },
          {
            spanish: 'Elle travaille efficacement. (She works efficiently.)',
            english: 'Long manner adverb at end',
            highlight: ['efficacement']
          }
        ]
      }
    ]
  },
  {
    title: 'Adverbs with Compound Tenses',
    content: `In compound tenses (passé composé, plus-que-parfait, etc.), short adverbs usually go **between** the auxiliary and past participle:`,
    examples: [
      {
        spanish: 'J\'ai bien mangé. (I ate well.)',
        english: 'Short adverb between auxiliary and participle',
        highlight: ['ai bien mangé']
      },
      {
        spanish: 'Elle a souvent voyagé. (She has often traveled.)',
        english: 'Frequency adverb in middle position',
        highlight: ['a souvent voyagé']
      },
      {
        spanish: 'Nous avons beaucoup travaillé. (We worked a lot.)',
        english: 'Quantity adverb in middle position',
        highlight: ['avons beaucoup travaillé']
      }
    ],
    subsections: [
      {
        title: 'Short Adverbs in Compound Tenses',
        content: 'Common short adverbs that go between auxiliary and participle:',
        conjugationTable: {
          title: 'Auxiliary + Adverb + Participle',
          conjugations: [
            { pronoun: 'bien/mal', form: 'well/badly', english: 'Il a bien dormi. (He slept well.)' },
            { pronoun: 'souvent/toujours', form: 'often/always', english: 'Elle a souvent ri. (She often laughed.)' },
            { pronoun: 'beaucoup/peu', form: 'much/little', english: 'Tu as beaucoup mangé. (You ate a lot.)' },
            { pronoun: 'déjà/encore', form: 'already/still', english: 'J\'ai déjà fini. (I already finished.)' }
          ]
        }
      },
      {
        title: 'Long Adverbs After Participle',
        content: 'Longer adverbs go after the past participle:',
        examples: [
          {
            spanish: 'Il a parlé lentement. (He spoke slowly.)',
            english: 'Long manner adverb after participle',
            highlight: ['parlé lentement']
          },
          {
            spanish: 'Elle a travaillé efficacement. (She worked efficiently.)',
            english: 'Long manner adverb after participle',
            highlight: ['travaillé efficacement']
          }
        ]
      }
    ]
  },
  {
    title: 'Adverbs Modifying Adjectives',
    content: `Adverbs modifying adjectives go **before** the adjective:`,
    examples: [
      {
        spanish: 'Elle est très intelligente. (She is very intelligent.)',
        english: 'Degree adverb before adjective',
        highlight: ['très intelligente']
      },
      {
        spanish: 'Il est assez grand. (He is quite tall.)',
        english: 'Degree adverb before adjective',
        highlight: ['assez grand']
      },
      {
        spanish: 'C\'est plutôt difficile. (It\'s rather difficult.)',
        english: 'Degree adverb before adjective',
        highlight: ['plutôt difficile']
      }
    ],
    subsections: [
      {
        title: 'Common Degree Adverbs',
        content: 'Adverbs that modify adjectives:',
        conjugationTable: {
          title: 'Adverb + Adjective',
          conjugations: [
            { pronoun: 'très', form: 'very', english: 'très beau (very beautiful)' },
            { pronoun: 'assez', form: 'quite/enough', english: 'assez bon (quite good)' },
            { pronoun: 'plutôt', form: 'rather', english: 'plutôt joli (rather pretty)' },
            { pronoun: 'trop', form: 'too', english: 'trop cher (too expensive)' }
          ]
        }
      },
      {
        title: 'Multiple Modifiers',
        content: 'When multiple adverbs modify an adjective:',
        examples: [
          {
            spanish: 'Elle est très très belle. (She is very, very beautiful.)',
            english: 'Repetition for emphasis',
            highlight: ['très très belle']
          },
          {
            spanish: 'Il est assez plutôt intelligent. (He is quite rather intelligent.)',
            english: 'Multiple degree adverbs (less common)',
            highlight: ['assez plutôt intelligent']
          }
        ]
      }
    ]
  },
  {
    title: 'Adverbs Modifying Other Adverbs',
    content: `Adverbs modifying other adverbs go **before** the adverb they modify:`,
    examples: [
      {
        spanish: 'Il conduit très lentement. (He drives very slowly.)',
        english: 'Degree adverb before manner adverb',
        highlight: ['très lentement']
      },
      {
        spanish: 'Elle parle assez bien français. (She speaks French quite well.)',
        english: 'Degree adverb before manner adverb',
        highlight: ['assez bien']
      },
      {
        spanish: 'Tu travailles plutôt efficacement. (You work rather efficiently.)',
        english: 'Degree adverb before manner adverb',
        highlight: ['plutôt efficacement']
      }
    ],
    subsections: [
      {
        title: 'Adverb + Adverb Combinations',
        content: 'Common combinations of adverbs:',
        examples: [
          {
            spanish: 'très bien (very well)',
            english: 'assez mal (quite badly)',
            highlight: ['très bien', 'assez mal']
          },
          {
            spanish: 'plutôt souvent (rather often)',
            english: 'trop vite (too quickly)',
            highlight: ['plutôt souvent', 'trop vite']
          }
        ]
      }
    ]
  },
  {
    title: 'Time and Place Adverbs',
    content: `Time and place adverbs have flexible placement but follow general patterns:`,
    examples: [
      {
        spanish: 'Hier, j\'ai vu Marie. (Yesterday, I saw Marie.)',
        english: 'Time adverb at beginning for emphasis',
        highlight: ['Hier']
      },
      {
        spanish: 'J\'ai vu Marie hier. (I saw Marie yesterday.)',
        english: 'Time adverb at end (neutral position)',
        highlight: ['hier']
      },
      {
        spanish: 'Il habite ici. (He lives here.)',
        english: 'Place adverb after verb',
        highlight: ['ici']
      }
    ],
    subsections: [
      {
        title: 'Time Adverb Placement',
        content: 'Where to place time adverbs:',
        examples: [
          {
            spanish: 'Beginning: Aujourd\'hui, nous partons. (Today, we\'re leaving.)',
            english: 'End: Nous partons aujourd\'hui. (We\'re leaving today.)',
            highlight: ['Aujourd\'hui', 'aujourd\'hui']
          },
          {
            spanish: 'Beginning: Demain, il pleuvra. (Tomorrow, it will rain.)',
            english: 'End: Il pleuvra demain. (It will rain tomorrow.)',
            highlight: ['Demain', 'demain']
          }
        ]
      },
      {
        title: 'Place Adverb Placement',
        content: 'Where to place place adverbs:',
        examples: [
          {
            spanish: 'After verb: Je vais là-bas. (I\'m going over there.)',
            english: 'After verb: Elle reste ici. (She\'s staying here.)',
            highlight: ['là-bas', 'ici']
          }
        ]
      }
    ]
  },
  {
    title: 'Negative Adverbs',
    content: `Negative adverbs like **jamais**, **plus**, **rien** have special placement rules with **ne**:`,
    examples: [
      {
        spanish: 'Je ne viens jamais. (I never come.)',
        english: 'Ne...jamais around verb',
        highlight: ['ne viens jamais']
      },
      {
        spanish: 'Il n\'a jamais mangé ça. (He has never eaten that.)',
        english: 'Ne...jamais around auxiliary',
        highlight: ['n\'a jamais mangé']
      }
    ],
    subsections: [
      {
        title: 'Negative Adverb Patterns',
        content: 'Common negative adverb constructions:',
        conjugationTable: {
          title: 'Negative Adverbs',
          conjugations: [
            { pronoun: 'ne...jamais', form: 'never', english: 'Je ne sors jamais. (I never go out.)' },
            { pronoun: 'ne...plus', form: 'no longer', english: 'Il ne fume plus. (He no longer smokes.)' },
            { pronoun: 'ne...rien', form: 'nothing', english: 'Elle ne dit rien. (She says nothing.)' },
            { pronoun: 'ne...guère', form: 'hardly', english: 'Tu ne manges guère. (You hardly eat.)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Common Adverb Placement Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong position in compound tenses**: Putting long adverbs between auxiliary and participle
**2. Adjective modification**: Putting adverbs after adjectives instead of before
**3. Negative placement**: Wrong position of negative adverbs
**4. Time adverb confusion**: Unclear about flexible placement options`,
    examples: [
      {
        spanish: '❌ J\'ai lentement mangé → ✅ J\'ai mangé lentement',
        english: 'Wrong: long adverbs go after past participle',
        highlight: ['mangé lentement']
      },
      {
        spanish: '❌ Elle est intelligente très → ✅ Elle est très intelligente',
        english: 'Wrong: adverbs go before adjectives',
        highlight: ['très intelligente']
      },
      {
        spanish: '❌ Je jamais ne viens → ✅ Je ne viens jamais',
        english: 'Wrong: ne comes before verb, jamais after',
        highlight: ['ne viens jamais']
      },
      {
        spanish: '❌ Il a parlé bien → ✅ Il a bien parlé',
        english: 'Wrong: short adverbs go between auxiliary and participle',
        highlight: ['a bien parlé']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Adverb Formation', url: '/grammar/french/adverbs/formation', difficulty: 'intermediate' },
  { title: 'French Negation', url: '/grammar/french/syntax/negation', difficulty: 'intermediate' },
  { title: 'French Passé Composé', url: '/grammar/french/verbs/passe-compose', difficulty: 'intermediate' },
  { title: 'French Sentence Structure', url: '/grammar/french/syntax/sentence-structure', difficulty: 'intermediate' }
];

export default function FrenchAdverbPlacementPage() {
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
              topic: 'placement',
              title: 'French Adverb Placement Rules (Position in Sentences)',
              description: 'Master French adverb placement in simple and compound tenses. Learn where to place adverbs with verbs, adjectives, and other adverbs.',
              difficulty: 'intermediate',
              examples: [
                'Il parle souvent français (He often speaks French)',
                'Elle a bien mangé (She ate well)',
                'Tu es très intelligent (You are very intelligent)',
                'Il conduit assez lentement (He drives quite slowly)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adverbs',
              topic: 'placement',
              title: 'French Adverb Placement Rules (Position in Sentences)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adverbs"
        topic="placement"
        title="French Adverb Placement Rules (Position in Sentences)"
        description="Master French adverb placement in simple and compound tenses. Learn where to place adverbs with verbs, adjectives, and other adverbs"
        difficulty="intermediate"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/french/adverbs"
        practiceUrl="/grammar/french/adverbs/placement/practice"
        quizUrl="/grammar/french/adverbs/placement/quiz"
        songUrl="/songs/fr?theme=grammar&topic=placement"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

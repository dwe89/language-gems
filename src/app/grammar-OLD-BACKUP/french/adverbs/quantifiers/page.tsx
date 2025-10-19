import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adverbs',
  topic: 'quantifiers',
  title: 'French Quantifiers and Intensifiers (Très, Assez, Trop, Beaucoup)',
  description: 'Master French quantifiers and intensifiers including très, assez, trop, beaucoup, peu, plus, moins for expressing degree and quantity.',
  difficulty: 'beginner',
  keywords: [
    'french quantifiers intensifiers',
    'très french very',
    'assez french enough',
    'trop french too much',
    'beaucoup french much',
    'peu french little',
    'french degree adverbs'
  ],
  examples: [
    'Il est très intelligent. (He is very intelligent.)',
    'C\'est assez difficile. (It\'s quite difficult.)',
    'Il fait trop chaud. (It\'s too hot.)',
    'J\'ai beaucoup travaillé. (I worked a lot.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Quantifiers and Intensifiers',
    content: `French quantifiers and intensifiers modify **adjectives, adverbs, and verbs** to express **degree, quantity, and intensity**. They are essential for precise expression and natural speech.

**Main categories:**
- **Intensifiers**: très, assez, plutôt, si
- **Quantity**: beaucoup, peu, trop, moins, plus
- **Sufficiency**: assez, suffisamment, trop
- **Comparison**: plus, moins, aussi, autant

**Key characteristics:**
- **Invariable**: Never change form
- **Position**: Usually before adjectives/adverbs, after verbs
- **Essential**: Fundamental for expressing nuance
- **Frequency**: Used constantly in everyday French

These words allow you to express exactly how much, how many, or to what degree something is true.`,
    examples: [
      {
        spanish: 'Elle est très belle. (She is very beautiful.)',
        english: 'Intensifier "très" modifies adjective "belle"',
        highlight: ['très belle']
      },
      {
        spanish: 'Il mange beaucoup. (He eats a lot.)',
        english: 'Quantifier "beaucoup" modifies verb "mange"',
        highlight: ['mange beaucoup']
      },
      {
        spanish: 'C\'est trop cher. (It\'s too expensive.)',
        english: 'Quantifier "trop" shows excessive degree',
        highlight: ['trop cher']
      }
    ]
  },
  {
    title: 'TRÈS - Very (Intensifier)',
    content: `**TRÈS** is the most common intensifier, meaning **"very"**:`,
    examples: [
      {
        spanish: 'Il est très intelligent. (He is very intelligent.)',
        english: 'Elle parle très bien français. (She speaks French very well.)',
        highlight: ['très intelligent', 'très bien']
      },
      {
        spanish: 'C\'est très important. (It\'s very important.)',
        english: 'Nous sommes très contents. (We are very happy.)',
        highlight: ['très important', 'très contents']
      }
    ],
    subsections: [
      {
        title: 'TRÈS with Adjectives',
        content: 'Most common usage:',
        examples: [
          {
            spanish: 'très grand (very big), très petit (very small)',
            english: 'très beau (very beautiful), très difficile (very difficult)',
            highlight: ['très grand', 'très beau']
          }
        ]
      },
      {
        title: 'TRÈS with Adverbs',
        content: 'Modifying other adverbs:',
        examples: [
          {
            spanish: 'très bien (very well), très mal (very badly)',
            english: 'très souvent (very often), très vite (very quickly)',
            highlight: ['très bien', 'très souvent']
          }
        ]
      },
      {
        title: 'TRÈS Cannot Modify Verbs',
        content: 'Use BEAUCOUP with verbs:',
        examples: [
          {
            spanish: '❌ Je très aime → ✅ J\'aime beaucoup',
            english: 'TRÈS only modifies adjectives and adverbs',
            highlight: ['J\'aime beaucoup']
          }
        ]
      }
    ]
  },
  {
    title: 'BEAUCOUP - A Lot, Much, Many',
    content: `**BEAUCOUP** expresses **large quantity** and can modify verbs and nouns:`,
    examples: [
      {
        spanish: 'J\'aime beaucoup ce film. (I really like this movie.)',
        english: 'Il travaille beaucoup. (He works a lot.)',
        highlight: ['J\'aime beaucoup', 'travaille beaucoup']
      },
      {
        spanish: 'Beaucoup de gens pensent... (Many people think...)',
        english: 'Il y a beaucoup de voitures. (There are many cars.)',
        highlight: ['Beaucoup de gens', 'beaucoup de voitures']
      }
    ],
    subsections: [
      {
        title: 'BEAUCOUP with Verbs',
        content: 'Placed after the verb:',
        examples: [
          {
            spanish: 'Je mange beaucoup. (I eat a lot.)',
            english: 'Elle étudie beaucoup. (She studies a lot.)',
            highlight: ['mange beaucoup', 'étudie beaucoup']
          }
        ]
      },
      {
        title: 'BEAUCOUP DE + Noun',
        content: 'With countable and uncountable nouns:',
        examples: [
          {
            spanish: 'beaucoup d\'amis (many friends)',
            english: 'beaucoup de temps (much time)',
            highlight: ['beaucoup d\'amis', 'beaucoup de temps']
          }
        ]
      }
    ]
  },
  {
    title: 'ASSEZ - Quite, Enough',
    content: `**ASSEZ** has two main meanings: **"quite"** (moderately) and **"enough"** (sufficiently):`,
    examples: [
      {
        spanish: 'C\'est assez difficile. (It\'s quite difficult.) - Moderately',
        english: 'J\'ai assez mangé. (I\'ve eaten enough.) - Sufficiently',
        highlight: ['assez difficile', 'assez mangé']
      },
      {
        spanish: 'Il est assez grand. (He\'s quite tall.)',
        english: 'Assez de questions! (Enough questions!)',
        highlight: ['assez grand', 'Assez de questions']
      }
    ],
    subsections: [
      {
        title: 'ASSEZ = Quite (Moderate Degree)',
        content: 'Less than "très" but more than a little:',
        examples: [
          {
            spanish: 'C\'est assez bon. (It\'s quite good.)',
            english: 'Elle parle assez bien. (She speaks quite well.)',
            highlight: ['assez bon', 'assez bien']
          }
        ]
      },
      {
        title: 'ASSEZ = Enough (Sufficiency)',
        content: 'Expressing adequate amount:',
        examples: [
          {
            spanish: 'J\'ai assez d\'argent. (I have enough money.)',
            english: 'C\'est assez pour moi. (It\'s enough for me.)',
            highlight: ['assez d\'argent', 'assez pour moi']
          }
        ]
      }
    ]
  },
  {
    title: 'TROP - Too Much, Too Many',
    content: `**TROP** expresses **excessive quantity or degree**:`,
    examples: [
      {
        spanish: 'Il fait trop chaud. (It\'s too hot.)',
        english: 'C\'est trop cher. (It\'s too expensive.)',
        highlight: ['trop chaud', 'trop cher']
      },
      {
        spanish: 'Il y a trop de monde. (There are too many people.)',
        english: 'J\'ai trop mangé. (I ate too much.)',
        highlight: ['trop de monde', 'trop mangé']
      }
    ],
    subsections: [
      {
        title: 'TROP with Adjectives/Adverbs',
        content: 'Showing excessive degree:',
        examples: [
          {
            spanish: 'trop grand (too big), trop vite (too fast)',
            english: 'trop difficile (too difficult), trop tard (too late)',
            highlight: ['trop grand', 'trop difficile']
          }
        ]
      },
      {
        title: 'TROP DE + Noun',
        content: 'Excessive quantity:',
        examples: [
          {
            spanish: 'trop de travail (too much work)',
            english: 'trop d\'étudiants (too many students)',
            highlight: ['trop de travail', 'trop d\'étudiants']
          }
        ]
      }
    ]
  },
  {
    title: 'PEU - Little, Few',
    content: `**PEU** expresses **small quantity** (opposite of beaucoup):`,
    examples: [
      {
        spanish: 'Il mange peu. (He eats little.)',
        english: 'Peu de gens le savent. (Few people know it.)',
        highlight: ['mange peu', 'Peu de gens']
      },
      {
        spanish: 'J\'ai peu d\'argent. (I have little money.)',
        english: 'Elle parle peu. (She speaks little.)',
        highlight: ['peu d\'argent', 'parle peu']
      }
    ],
    subsections: [
      {
        title: 'PEU with Verbs',
        content: 'Small degree of action:',
        examples: [
          {
            spanish: 'Je dors peu. (I sleep little.)',
            english: 'Il sort peu. (He goes out little.)',
            highlight: ['dors peu', 'sort peu']
          }
        ]
      },
      {
        title: 'PEU DE + Noun',
        content: 'Small quantity:',
        examples: [
          {
            spanish: 'peu de temps (little time)',
            english: 'peu d\'amis (few friends)',
            highlight: ['peu de temps', 'peu d\'amis']
          }
        ]
      },
      {
        title: 'UN PEU - A Little',
        content: 'Small but positive amount:',
        examples: [
          {
            spanish: 'un peu fatigué (a little tired)',
            english: 'un peu de sucre (a little sugar)',
            highlight: ['un peu fatigué', 'un peu de sucre']
          }
        ]
      }
    ]
  },
  {
    title: 'PLUS and MOINS - More and Less',
    content: `**PLUS** (more) and **MOINS** (less) for **comparison and degree**:`,
    conjugationTable: {
      title: 'Plus/Moins Usage',
      conjugations: [
        { pronoun: 'plus + adjective', form: 'plus grand', english: 'bigger, taller' },
        { pronoun: 'moins + adjective', form: 'moins cher', english: 'less expensive' },
        { pronoun: 'plus de + noun', form: 'plus de temps', english: 'more time' },
        { pronoun: 'moins de + noun', form: 'moins d\'argent', english: 'less money' }
      ]
    },
    examples: [
      {
        spanish: 'Il est plus intelligent. (He is more intelligent.)',
        english: 'C\'est moins difficile. (It\'s less difficult.)',
        highlight: ['plus intelligent', 'moins difficile']
      },
      {
        spanish: 'J\'ai plus de travail. (I have more work.)',
        english: 'Il y a moins de monde. (There are fewer people.)',
        highlight: ['plus de travail', 'moins de monde']
      }
    ],
    subsections: [
      {
        title: 'Comparative Constructions',
        content: 'Used in comparisons:',
        examples: [
          {
            spanish: 'plus grand que... (bigger than...)',
            english: 'moins cher que... (less expensive than...)',
            highlight: ['plus grand que', 'moins cher que']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Important Quantifiers',
    content: `Additional quantifiers for specific contexts:`,
    conjugationTable: {
      title: 'Other Quantifiers',
      conjugations: [
        { pronoun: 'plutôt', form: 'rather, quite', english: 'plutôt sympa (rather nice)' },
        { pronoun: 'si', form: 'so (emphatic)', english: 'si beau (so beautiful)' },
        { pronoun: 'tout à fait', form: 'completely', english: 'tout à fait d\'accord (completely agree)' },
        { pronoun: 'complètement', form: 'completely', english: 'complètement fou (completely crazy)' },
        { pronoun: 'vraiment', form: 'really', english: 'vraiment bien (really good)' },
        { pronoun: 'extrêmement', form: 'extremely', english: 'extrêmement difficile (extremely difficult)' }
      ]
    },
    examples: [
      {
        spanish: 'C\'est plutôt intéressant. (It\'s rather interesting.)',
        english: 'Il est si gentil! (He\'s so kind!)',
        highlight: ['plutôt intéressant', 'si gentil']
      }
    ]
  },
  {
    title: 'Position Rules',
    content: `Quantifiers follow specific **position rules**:`,
    conjugationTable: {
      title: 'Position Rules',
      conjugations: [
        { pronoun: 'Before adjectives', form: 'très + adjective', english: 'très beau, assez grand' },
        { pronoun: 'Before adverbs', form: 'très + adverb', english: 'très bien, assez vite' },
        { pronoun: 'After verbs', form: 'verb + beaucoup/peu', english: 'mange beaucoup, dort peu' },
        { pronoun: 'Before DE + noun', form: 'quantifier + de + noun', english: 'beaucoup de, trop de' }
      ]
    },
    subsections: [
      {
        title: 'With Compound Tenses',
        content: 'Position in passé composé:',
        examples: [
          {
            spanish: 'J\'ai beaucoup mangé. (I ate a lot.)',
            english: 'Il a trop bu. (He drank too much.)',
            highlight: ['ai beaucoup mangé', 'a trop bu']
          }
        ]
      }
    ]
  },
  {
    title: 'Quantifiers in Negation',
    content: `Special rules with **negative constructions**:`,
    examples: [
      {
        spanish: 'Je ne mange pas beaucoup. (I don\'t eat much.)',
        english: 'Il n\'est pas très grand. (He\'s not very tall.)',
        highlight: ['ne mange pas beaucoup', 'n\'est pas très grand']
      },
      {
        spanish: 'Je n\'ai pas assez d\'argent. (I don\'t have enough money.)',
        english: 'Ce n\'est pas trop difficile. (It\'s not too difficult.)',
        highlight: ['n\'ai pas assez d\'argent', 'n\'est pas trop difficile']
      }
    ]
  },
  {
    title: 'Common Expressions and Idioms',
    content: `Fixed expressions with quantifiers:`,
    examples: [
      {
        spanish: 'beaucoup trop (way too much)',
        english: 'un peu trop (a bit too much)',
        highlight: ['beaucoup trop', 'un peu trop']
      },
      {
        spanish: 'très très (very very - emphatic)',
        english: 'trop c\'est trop (too much is too much)',
        highlight: ['très très', 'trop c\'est trop']
      }
    ],
    subsections: [
      {
        title: 'Emphatic Combinations',
        content: 'Intensifying expressions:',
        examples: [
          {
            spanish: 'C\'est beaucoup trop cher! (It\'s way too expensive!)',
            english: 'Il est très très intelligent. (He\'s very very intelligent.)',
            highlight: ['beaucoup trop cher', 'très très intelligent']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Quantifiers',
    content: `Here are frequent errors students make:

**1. Wrong position**: Placing quantifiers incorrectly
**2. TRÈS with verbs**: Using TRÈS instead of BEAUCOUP with verbs
**3. Missing DE**: Forgetting DE with quantity expressions
**4. Confusion**: Mixing up similar quantifiers`,
    examples: [
      {
        spanish: '❌ Je très aime → ✅ J\'aime beaucoup',
        english: 'Wrong: TRÈS cannot modify verbs',
        highlight: ['J\'aime beaucoup']
      },
      {
        spanish: '❌ beaucoup livres → ✅ beaucoup de livres',
        english: 'Wrong: missing DE with quantity + noun',
        highlight: ['beaucoup de livres']
      },
      {
        spanish: '❌ très beaucoup → ✅ beaucoup or très',
        english: 'Wrong: cannot combine TRÈS and BEAUCOUP',
        highlight: ['beaucoup']
      },
      {
        spanish: '❌ Il est assez de grand → ✅ Il est assez grand',
        english: 'Wrong: no DE needed with adjectives',
        highlight: ['Il est assez grand']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Comparative and Superlative', url: '/grammar/french/adjectives/comparative', difficulty: 'intermediate' },
  { title: 'French Adverb Formation', url: '/grammar/french/adverbs/formation', difficulty: 'beginner' },
  { title: 'French Negation', url: '/grammar/french/syntax/negation', difficulty: 'intermediate' },
  { title: 'French Indefinite Adjectives', url: '/grammar/french/adjectives/indefinite-adjectives', difficulty: 'intermediate' }
];

export default function FrenchQuantifiersPage() {
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
              topic: 'quantifiers',
              title: 'French Quantifiers and Intensifiers (Très, Assez, Trop, Beaucoup)',
              description: 'Master French quantifiers and intensifiers including très, assez, trop, beaucoup, peu, plus, moins for expressing degree and quantity.',
              difficulty: 'beginner',
              examples: [
                'Il est très intelligent. (He is very intelligent.)',
                'C\'est assez difficile. (It\'s quite difficult.)',
                'Il fait trop chaud. (It\'s too hot.)',
                'J\'ai beaucoup travaillé. (I worked a lot.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adverbs',
              topic: 'quantifiers',
              title: 'French Quantifiers and Intensifiers (Très, Assez, Trop, Beaucoup)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adverbs"
        topic="quantifiers"
        title="French Quantifiers and Intensifiers (Très, Assez, Trop, Beaucoup)"
        description="Master French quantifiers and intensifiers including très, assez, trop, beaucoup, peu, plus, moins for expressing degree and quantity"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/adverbs"
        practiceUrl="/grammar/french/adverbs/quantifiers/practice"
        quizUrl="/grammar/french/adverbs/quantifiers/quiz"
        songUrl="/songs/fr?theme=grammar&topic=quantifiers"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

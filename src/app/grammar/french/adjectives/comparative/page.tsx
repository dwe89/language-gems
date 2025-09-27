import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adjectives',
  topic: 'comparative',
  title: 'French Comparative Adjectives',
  description: 'Master French comparative adjectives with plus, moins, aussi...que. Learn equality, superiority, and inferiority comparisons.',
  difficulty: 'intermediate',
  keywords: [
    'french comparative',
    'plus que moins que',
    'aussi que french',
    'comparative adjectives french',
    'french comparisons',
    'meilleur pire french'
  ],
  examples: [
    'plus grand que (bigger than)',
    'moins cher que (less expensive than)',
    'aussi intelligent que (as intelligent as)',
    'meilleur que (better than)'
  ]
});

const sections = [
  {
    title: 'Understanding French Comparatives',
    content: `French comparative adjectives allow you to **compare** two or more things. There are three types of comparisons:

**Superiority**: more than (plus...que)
**Inferiority**: less than (moins...que)  
**Equality**: as...as (aussi...que)

These structures are essential for expressing preferences, making choices, and describing differences.`,
    examples: [
      {
        spanish: 'Marie est plus grande que Paul. (Marie is taller than Paul.)',
        english: 'Superiority comparison',
        highlight: ['plus grande que']
      },
      {
        spanish: 'Ce livre est moins cher que celui-là. (This book is less expensive than that one.)',
        english: 'Inferiority comparison',
        highlight: ['moins cher que']
      },
      {
        spanish: 'Elle est aussi intelligente que lui. (She is as intelligent as him.)',
        english: 'Equality comparison',
        highlight: ['aussi intelligente que']
      }
    ]
  },
  {
    title: 'Superiority: Plus...Que (More Than)',
    content: `To express that something has **more** of a quality, use **plus + adjective + que**.

**Structure**: Subject + verb + plus + adjective + que + comparison

The adjective must still agree with the subject in gender and number.`,
    subsections: [
      {
        title: 'Plus...Que Formation',
        content: 'Regular formation with plus...que:',
        conjugationTable: {
          title: 'Superiority Comparisons',
          conjugations: [
            { pronoun: 'plus grand(e)', form: 'que', english: 'bigger than' },
            { pronoun: 'plus intelligent(e)', form: 'que', english: 'more intelligent than' },
            { pronoun: 'plus rapide', form: 'que', english: 'faster than' },
            { pronoun: 'plus intéressant(e)', form: 'que', english: 'more interesting than' }
          ]
        }
      },
      {
        title: 'Examples with Agreement',
        content: 'Notice how adjectives still agree with their subjects:',
        examples: [
          {
            spanish: 'Marie est plus grande que Paul. (Marie is taller than Paul.)',
            english: 'Feminine subject → grande agrees',
            highlight: ['plus grande']
          },
          {
            spanish: 'Ces voitures sont plus chères que celles-là. (These cars are more expensive than those.)',
            english: 'Feminine plural → chères agrees',
            highlight: ['plus chères']
          },
          {
            spanish: 'Il est plus sympathique que son frère. (He is nicer than his brother.)',
            english: 'Masculine subject → sympathique (same form)',
            highlight: ['plus sympathique']
          }
        ]
      }
    ]
  },
  {
    title: 'Inferiority: Moins...Que (Less Than)',
    content: `To express that something has **less** of a quality, use **moins + adjective + que**.

**Structure**: Subject + verb + moins + adjective + que + comparison

This follows the same agreement rules as plus...que.`,
    examples: [
      {
        spanish: 'Cette voiture est moins chère que l\'autre. (This car is less expensive than the other.)',
        english: 'Inferiority with feminine adjective',
        highlight: ['moins chère']
      },
      {
        spanish: 'Il est moins patient que sa sœur. (He is less patient than his sister.)',
        english: 'Inferiority with masculine subject',
        highlight: ['moins patient']
      },
      {
        spanish: 'Ces exercices sont moins difficiles que les autres. (These exercises are less difficult than the others.)',
        english: 'Inferiority with plural',
        highlight: ['moins difficiles']
      }
    ],
    subsections: [
      {
        title: 'Common Moins...Que Patterns',
        content: 'Frequently used inferiority comparisons:',
        conjugationTable: {
          title: 'Inferiority Comparisons',
          conjugations: [
            { pronoun: 'moins cher/chère', form: 'que', english: 'less expensive than' },
            { pronoun: 'moins difficile', form: 'que', english: 'less difficult than' },
            { pronoun: 'moins important(e)', form: 'que', english: 'less important than' },
            { pronoun: 'moins populaire', form: 'que', english: 'less popular than' }
          ]
        }
      }
    ]
  },
  {
    title: 'Equality: Aussi...Que (As...As)',
    content: `To express that two things are **equal** in a quality, use **aussi + adjective + que**.

**Structure**: Subject + verb + aussi + adjective + que + comparison

This structure shows that both items have the same degree of the quality.`,
    examples: [
      {
        spanish: 'Elle est aussi grande que moi. (She is as tall as me.)',
        english: 'Equal height comparison',
        highlight: ['aussi grande que']
      },
      {
        spanish: 'Ce film est aussi intéressant que le livre. (This movie is as interesting as the book.)',
        english: 'Equal interest level',
        highlight: ['aussi intéressant que']
      },
      {
        spanish: 'Ils sont aussi intelligents que nous. (They are as intelligent as us.)',
        english: 'Equal intelligence level',
        highlight: ['aussi intelligents que']
      }
    ],
    subsections: [
      {
        title: 'Aussi...Que in Different Contexts',
        content: 'Various uses of equality comparisons:',
        examples: [
          {
            spanish: 'Physical: Il est aussi fort que son père. (He is as strong as his father.)',
            english: 'Comparing physical qualities',
            highlight: ['aussi fort que']
          },
          {
            spanish: 'Mental: Elle est aussi créative que lui. (She is as creative as him.)',
            english: 'Comparing mental qualities',
            highlight: ['aussi créative que']
          },
          {
            spanish: 'General: Cette solution est aussi bonne que l\'autre. (This solution is as good as the other.)',
            english: 'Comparing general qualities',
            highlight: ['aussi bonne que']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Comparatives',
    content: `Some adjectives have **irregular comparative forms** that don't use plus/moins/aussi:`,
    subsections: [
      {
        title: 'Bon → Meilleur (Good → Better)',
        content: 'The adjective "bon" becomes "meilleur" in comparisons:',
        conjugationTable: {
          title: 'Bon → Meilleur',
          conjugations: [
            { pronoun: 'meilleur', form: 'masculine singular', english: 'Ce vin est meilleur. (This wine is better.)' },
            { pronoun: 'meilleure', form: 'feminine singular', english: 'Cette idée est meilleure. (This idea is better.)' },
            { pronoun: 'meilleurs', form: 'masculine plural', english: 'Ces résultats sont meilleurs. (These results are better.)' },
            { pronoun: 'meilleures', form: 'feminine plural', english: 'Ces notes sont meilleures. (These grades are better.)' }
          ]
        }
      },
      {
        title: 'Mauvais → Pire (Bad → Worse)',
        content: 'The adjective "mauvais" can become "pire" for worse:',
        examples: [
          {
            spanish: 'Cette situation est pire que l\'autre. (This situation is worse than the other.)',
            english: 'Using pire for worse',
            highlight: ['pire que']
          },
          {
            spanish: 'Alternative: Cette situation est plus mauvaise. (This situation is worse.)',
            english: 'Can also use plus mauvais',
            highlight: ['plus mauvaise']
          }
        ]
      },
      {
        title: 'Petit → Plus Petit/Moindre',
        content: 'Small has two comparative forms:',
        examples: [
          {
            spanish: 'Physical size: plus petit(e) que (smaller than)',
            english: 'Il est plus petit que moi. (He is smaller than me.)',
            highlight: ['plus petit que']
          },
          {
            spanish: 'Abstract/importance: moindre que (lesser than)',
            english: 'C\'est un moindre problème. (It\'s a lesser problem.)',
            highlight: ['moindre']
          }
        ]
      }
    ]
  },
  {
    title: 'Comparative Expressions and Idioms',
    content: `Common expressions using comparative structures:`,
    examples: [
      {
        spanish: 'de plus en plus (more and more)',
        english: 'Il devient de plus en plus intelligent. (He becomes more and more intelligent.)',
        highlight: ['de plus en plus']
      },
      {
        spanish: 'de moins en moins (less and less)',
        english: 'Elle est de moins en moins patiente. (She is less and less patient.)',
        highlight: ['de moins en moins']
      },
      {
        spanish: 'le plus...possible (as...as possible)',
        english: 'Soyez le plus rapide possible. (Be as fast as possible.)',
        highlight: ['le plus...possible']
      }
    ],
    subsections: [
      {
        title: 'Comparative with Numbers',
        content: 'Using comparatives with quantities:',
        examples: [
          {
            spanish: 'plus de (more than): plus de dix personnes (more than ten people)',
            english: 'moins de (less than): moins de cinq euros (less than five euros)',
            highlight: ['plus de', 'moins de']
          },
          {
            spanish: 'autant de (as much/many as): autant de livres que toi (as many books as you)',
            english: 'Equality with quantities',
            highlight: ['autant de']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Comparative Mistakes',
    content: `Here are frequent errors students make with French comparatives:

**1. Wrong irregular forms**: Using plus bon instead of meilleur
**2. Agreement errors**: Forgetting adjective agreement in comparisons
**3. Structure confusion**: Wrong word order in comparative phrases
**4. Quantity vs quality**: Confusing plus de with plus...que`,
    examples: [
      {
        spanish: '❌ plus bon → ✅ meilleur',
        english: 'Wrong: must use irregular form',
        highlight: ['meilleur']
      },
      {
        spanish: '❌ Elle est plus grand que lui → ✅ Elle est plus grande que lui',
        english: 'Wrong: adjective must agree with subject',
        highlight: ['plus grande']
      },
      {
        spanish: '❌ plus que intelligent → ✅ plus intelligent que',
        english: 'Wrong: adjective goes between plus and que',
        highlight: ['plus intelligent que']
      },
      {
        spanish: '❌ plus que dix → ✅ plus de dix',
        english: 'Wrong: use "de" with numbers',
        highlight: ['plus de']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Superlative Adjectives', url: '/grammar/french/adjectives/superlative', difficulty: 'intermediate' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'beginner' },
  { title: 'French Irregular Adjectives', url: '/grammar/french/adjectives/irregular-adjectives', difficulty: 'intermediate' },
  { title: 'French Quantities', url: '/grammar/french/expressions/quantities', difficulty: 'intermediate' }
];

export default function FrenchComparativePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'adjectives',
              topic: 'comparative',
              title: 'French Comparative Adjectives',
              description: 'Master French comparative adjectives with plus, moins, aussi...que. Learn equality, superiority, and inferiority comparisons.',
              difficulty: 'intermediate',
              examples: [
                'plus grand que (bigger than)',
                'moins cher que (less expensive than)',
                'aussi intelligent que (as intelligent as)',
                'meilleur que (better than)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adjectives',
              topic: 'comparative',
              title: 'French Comparative Adjectives'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adjectives"
        topic="comparative"
        title="French Comparative Adjectives"
        description="Master French comparative adjectives with plus, moins, aussi...que. Learn equality, superiority, and inferiority comparisons"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/french/adjectives"
        practiceUrl="/grammar/french/adjectives/comparative/practice"
        quizUrl="/grammar/french/adjectives/comparative/quiz"
        songUrl="/songs/fr?theme=grammar&topic=comparative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adjectives',
  topic: 'superlative',
  title: 'French Superlative Adjectives',
  description: 'Master French superlative adjectives with le/la/les plus and le/la/les moins. Learn absolute superlatives and irregular forms.',
  difficulty: 'intermediate',
  keywords: [
    'french superlative',
    'le plus le moins',
    'superlative adjectives french',
    'le meilleur french',
    'le pire french',
    'most least french'
  ],
  examples: [
    'le plus grand (the biggest)',
    'la moins chère (the least expensive)',
    'les plus intelligents (the most intelligent)',
    'le meilleur (the best)'
  ]
});

const sections = [
  {
    title: 'Understanding French Superlatives',
    content: `French superlative adjectives express the **highest** or **lowest** degree of a quality within a group. They answer "which one is the most/least...?"

There are two types of superlatives:
**Relative superlative**: the most/least (compared to others)
**Absolute superlative**: very/extremely (without comparison)

Superlatives are essential for expressing extremes and making definitive statements.`,
    examples: [
      {
        spanish: 'C\'est le plus grand bâtiment de la ville. (It\'s the tallest building in the city.)',
        english: 'Relative superlative - compared to other buildings',
        highlight: ['le plus grand']
      },
      {
        spanish: 'Elle est la moins patiente de la famille. (She is the least patient in the family.)',
        english: 'Relative superlative - compared to family members',
        highlight: ['la moins patiente']
      },
      {
        spanish: 'C\'est très intéressant. (It\'s very interesting.)',
        english: 'Absolute superlative - no comparison',
        highlight: ['très intéressant']
      }
    ]
  },
  {
    title: 'Relative Superlative Formation',
    content: `Relative superlatives use **definite article + plus/moins + adjective**.

**Structure**: le/la/les + plus/moins + adjective + (de + group)

The definite article agrees with the noun being described.`,
    subsections: [
      {
        title: 'Superiority Superlative (The Most)',
        content: 'Using le/la/les plus for "the most":',
        conjugationTable: {
          title: 'Superiority Superlative',
          conjugations: [
            { pronoun: 'le plus grand', form: 'masculine singular', english: 'the biggest (m.s.)' },
            { pronoun: 'la plus grande', form: 'feminine singular', english: 'the biggest (f.s.)' },
            { pronoun: 'les plus grands', form: 'masculine plural', english: 'the biggest (m.p.)' },
            { pronoun: 'les plus grandes', form: 'feminine plural', english: 'the biggest (f.p.)' }
          ]
        }
      },
      {
        title: 'Inferiority Superlative (The Least)',
        content: 'Using le/la/les moins for "the least":',
        conjugationTable: {
          title: 'Inferiority Superlative',
          conjugations: [
            { pronoun: 'le moins cher', form: 'masculine singular', english: 'the least expensive (m.s.)' },
            { pronoun: 'la moins chère', form: 'feminine singular', english: 'the least expensive (f.s.)' },
            { pronoun: 'les moins chers', form: 'masculine plural', english: 'the least expensive (m.p.)' },
            { pronoun: 'les moins chères', form: 'feminine plural', english: 'the least expensive (f.p.)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Superlative with Groups (DE)',
    content: `To specify the group being compared, use **de** after the superlative:

**Pattern**: le/la/les + plus/moins + adjective + de + group

This shows what the subject is being compared against.`,
    examples: [
      {
        spanish: 'C\'est le plus intelligent de la classe. (He\'s the most intelligent in the class.)',
        english: 'Compared to the class group',
        highlight: ['de la classe']
      },
      {
        spanish: 'Elle est la moins timide de ses sœurs. (She\'s the least shy of her sisters.)',
        english: 'Compared to her sisters',
        highlight: ['de ses sœurs']
      },
      {
        spanish: 'Ce sont les plus beaux de tous. (These are the most beautiful of all.)',
        english: 'Compared to all others',
        highlight: ['de tous']
      }
    ],
    subsections: [
      {
        title: 'Common Group Expressions',
        content: 'Typical ways to express the comparison group:',
        examples: [
          {
            spanish: 'de la famille (of the family)',
            english: 'du groupe (of the group)',
            highlight: ['de la famille', 'du groupe']
          },
          {
            spanish: 'de la ville (of the city)',
            english: 'du monde (in the world)',
            highlight: ['de la ville', 'du monde']
          },
          {
            spanish: 'de tous (of all)',
            english: 'de toutes (of all - feminine)',
            highlight: ['de tous', 'de toutes']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Superlatives',
    content: `Some adjectives have irregular superlative forms:`,
    subsections: [
      {
        title: 'Bon → Le Meilleur (Good → The Best)',
        content: 'The adjective "bon" becomes "le meilleur" in superlatives:',
        conjugationTable: {
          title: 'Le Meilleur (The Best)',
          conjugations: [
            { pronoun: 'le meilleur', form: 'masculine singular', english: 'C\'est le meilleur film. (It\'s the best movie.)' },
            { pronoun: 'la meilleure', form: 'feminine singular', english: 'C\'est la meilleure idée. (It\'s the best idea.)' },
            { pronoun: 'les meilleurs', form: 'masculine plural', english: 'Ce sont les meilleurs. (These are the best.)' },
            { pronoun: 'les meilleures', form: 'feminine plural', english: 'Les meilleures notes. (The best grades.)' }
          ]
        }
      },
      {
        title: 'Mauvais → Le Pire (Bad → The Worst)',
        content: 'The adjective "mauvais" can become "le pire":',
        examples: [
          {
            spanish: 'C\'est le pire jour de ma vie. (It\'s the worst day of my life.)',
            english: 'Using le pire for worst',
            highlight: ['le pire']
          },
          {
            spanish: 'Alternative: C\'est le plus mauvais. (It\'s the worst.)',
            english: 'Can also use le plus mauvais',
            highlight: ['le plus mauvais']
          }
        ]
      },
      {
        title: 'Petit → Le Plus Petit/Le Moindre',
        content: 'Small has different superlative forms:',
        examples: [
          {
            spanish: 'Physical: C\'est le plus petit chat. (It\'s the smallest cat.)',
            english: 'For physical size',
            highlight: ['le plus petit']
          },
          {
            spanish: 'Abstract: C\'est le moindre problème. (It\'s the slightest problem.)',
            english: 'For importance/degree',
            highlight: ['le moindre']
          }
        ]
      }
    ]
  },
  {
    title: 'Superlative Position Rules',
    content: `Superlative adjectives follow the same placement rules as regular adjectives, but with the definite article:`,
    examples: [
      {
        spanish: 'BAGS adjectives: la plus belle maison (the most beautiful house)',
        english: 'Beauty adjective stays before noun',
        highlight: ['plus belle maison']
      },
      {
        spanish: 'Regular adjectives: la voiture la plus rapide (the fastest car)',
        english: 'Regular adjective after noun with repeated article',
        highlight: ['la voiture la plus rapide']
      }
    ],
    subsections: [
      {
        title: 'Double Article Pattern',
        content: 'When adjectives go after the noun, repeat the definite article:',
        examples: [
          {
            spanish: 'l\'étudiant le plus intelligent (the most intelligent student)',
            english: 'Article repeated before superlative',
            highlight: ['l\'étudiant le plus']
          },
          {
            spanish: 'la fille la moins timide (the least shy girl)',
            english: 'Article repeated with moins',
            highlight: ['la fille la moins']
          },
          {
            spanish: 'les voitures les plus chères (the most expensive cars)',
            english: 'Plural articles repeated',
            highlight: ['les voitures les plus']
          }
        ]
      }
    ]
  },
  {
    title: 'Absolute Superlatives',
    content: `Absolute superlatives express a very high degree without comparison. French uses several methods:`,
    examples: [
      {
        spanish: 'très + adjective: très intelligent (very intelligent)',
        english: 'Most common absolute superlative',
        highlight: ['très intelligent']
      },
      {
        spanish: 'fort + adjective: fort intéressant (very interesting)',
        english: 'Emphatic absolute superlative',
        highlight: ['fort intéressant']
      },
      {
        spanish: 'extrêmement + adjective: extrêmement difficile (extremely difficult)',
        english: 'Strong absolute superlative',
        highlight: ['extrêmement difficile']
      }
    ],
    subsections: [
      {
        title: 'Other Absolute Superlative Forms',
        content: 'Additional ways to express absolute superlatives:',
        examples: [
          {
            spanish: 'super/hyper (informal): super cool, hyper rapide',
            english: 'Informal intensifiers',
            highlight: ['super', 'hyper']
          },
          {
            spanish: 'tout à fait: tout à fait d\'accord (completely agree)',
            english: 'Complete agreement/degree',
            highlight: ['tout à fait']
          },
          {
            spanish: 'assez: assez grand (quite big)',
            english: 'Moderate degree',
            highlight: ['assez grand']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Superlative Mistakes',
    content: `Here are frequent errors students make with French superlatives:

**1. Missing articles**: Forgetting definite articles in superlatives
**2. Wrong irregular forms**: Using le plus bon instead of le meilleur
**3. Article repetition**: Not repeating articles with post-noun adjectives
**4. Agreement errors**: Wrong gender/number agreement`,
    examples: [
      {
        spanish: '❌ plus grand → ✅ le plus grand',
        english: 'Wrong: must include definite article',
        highlight: ['le plus grand']
      },
      {
        spanish: '❌ le plus bon → ✅ le meilleur',
        english: 'Wrong: must use irregular form',
        highlight: ['le meilleur']
      },
      {
        spanish: '❌ la voiture plus rapide → ✅ la voiture la plus rapide',
        english: 'Wrong: must repeat article after noun',
        highlight: ['la plus rapide']
      },
      {
        spanish: '❌ la plus grand → ✅ la plus grande',
        english: 'Wrong: adjective must agree with feminine noun',
        highlight: ['la plus grande']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Comparative Adjectives', url: '/grammar/french/adjectives/comparative', difficulty: 'intermediate' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'beginner' },
  { title: 'French Adjective Placement', url: '/grammar/french/adjectives/placement', difficulty: 'intermediate' },
  { title: 'French Irregular Adjectives', url: '/grammar/french/adjectives/irregular-adjectives', difficulty: 'intermediate' }
];

export default function FrenchSuperlativePage() {
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
              topic: 'superlative',
              title: 'French Superlative Adjectives',
              description: 'Master French superlative adjectives with le/la/les plus and le/la/les moins. Learn absolute superlatives and irregular forms.',
              difficulty: 'intermediate',
              examples: [
                'le plus grand (the biggest)',
                'la moins chère (the least expensive)',
                'les plus intelligents (the most intelligent)',
                'le meilleur (the best)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adjectives',
              topic: 'superlative',
              title: 'French Superlative Adjectives'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adjectives"
        topic="superlative"
        title="French Superlative Adjectives"
        description="Master French superlative adjectives with le/la/les plus and le/la/les moins. Learn absolute superlatives and irregular forms"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/adjectives"
        practiceUrl="/grammar/french/adjectives/superlative/practice"
        quizUrl="/grammar/french/adjectives/superlative/quiz"
        songUrl="/songs/fr?theme=grammar&topic=superlative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

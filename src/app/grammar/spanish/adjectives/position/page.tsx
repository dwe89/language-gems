import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'adjectives',
  topic: 'position',
  title: 'Spanish Adjective Position',
  description: 'Learn when Spanish adjectives go before or after nouns. Master the rules for adjective placement in Spanish.',
  difficulty: 'intermediate',
  keywords: [
    'spanish adjective position',
    'adjective placement spanish',
    'before after noun spanish',
    'spanish grammar adjectives',
    'posición adjetivos español',
    'adjective order spanish'
  ],
  examples: [
    'una buena idea (a good idea)',
    'un coche rojo (a red car)',
    'una gran mujer (a great woman)'
  ]
});

const sections = [
  {
    title: 'Spanish Adjective Position Overview',
    content: `In Spanish, adjective position is more flexible than in English, but there are important rules to follow. The position of an adjective can change its meaning or emphasis.

**General Rule**: Most descriptive adjectives go **after** the noun, but some common adjectives go **before** the noun.

**Key Concept**: Position affects meaning and style in Spanish.`,
    examples: [
      {
        spanish: 'un coche rojo',
        english: 'a red car (descriptive - after noun)',
        highlight: ['rojo']
      },
      {
        spanish: 'una buena idea',
        english: 'a good idea (evaluative - before noun)',
        highlight: ['buena']
      },
      {
        spanish: 'mi mejor amigo',
        english: 'my best friend (superlative - before noun)',
        highlight: ['mejor']
      }
    ]
  },
  {
    title: 'Adjectives That Go After the Noun',
    content: `Most Spanish adjectives go **after** the noun they modify. This is the default position.`,
    subsections: [
      {
        title: 'Physical Description Adjectives',
        content: `Adjectives describing physical appearance, color, shape, and size typically go after the noun:`,
        examples: [
          {
            spanish: 'una casa blanca',
            english: 'a white house',
            highlight: ['blanca']
          },
          {
            spanish: 'un hombre alto',
            english: 'a tall man',
            highlight: ['alto']
          },
          {
            spanish: 'una mesa redonda',
            english: 'a round table',
            highlight: ['redonda']
          },
          {
            spanish: 'ojos azules',
            english: 'blue eyes',
            highlight: ['azules']
          }
        ]
      },
      {
        title: 'Nationality and Origin Adjectives',
        content: `Adjectives indicating nationality, origin, or group membership always go after the noun:`,
        examples: [
          {
            spanish: 'comida mexicana',
            english: 'Mexican food',
            highlight: ['mexicana']
          },
          {
            spanish: 'vino francés',
            english: 'French wine',
            highlight: ['francés']
          },
          {
            spanish: 'música clásica',
            english: 'classical music',
            highlight: ['clásica']
          },
          {
            spanish: 'literatura española',
            english: 'Spanish literature',
            highlight: ['española']
          }
        ]
      },
      {
        title: 'Technical and Scientific Adjectives',
        content: `Adjectives with technical, scientific, or specific meanings go after the noun:`,
        examples: [
          {
            spanish: 'energía solar',
            english: 'solar energy',
            highlight: ['solar']
          },
          {
            spanish: 'medicina natural',
            english: 'natural medicine',
            highlight: ['natural']
          },
          {
            spanish: 'análisis químico',
            english: 'chemical analysis',
            highlight: ['químico']
          },
          {
            spanish: 'sistema nervioso',
            english: 'nervous system',
            highlight: ['nervioso']
          }
        ]
      }
    ]
  },
  {
    title: 'Adjectives That Go Before the Noun',
    content: `Certain adjectives typically go **before** the noun. These are often common, subjective, or evaluative adjectives.`,
    subsections: [
      {
        title: 'Common Evaluative Adjectives',
        content: `These common adjectives usually go before the noun:

**bueno/a** (good)
**malo/a** (bad)  
**grande** (big/great)
**pequeño/a** (small)
**nuevo/a** (new)
**viejo/a** (old)`,
        examples: [
          {
            spanish: 'una buena película',
            english: 'a good movie',
            highlight: ['buena']
          },
          {
            spanish: 'un mal día',
            english: 'a bad day',
            highlight: ['mal']
          },
          {
            spanish: 'una gran oportunidad',
            english: 'a great opportunity',
            highlight: ['gran']
          },
          {
            spanish: 'mi viejo amigo',
            english: 'my old friend',
            highlight: ['viejo']
          }
        ]
      },
      {
        title: 'Numbers and Quantifiers',
        content: `Numbers, ordinals, and quantifying adjectives go before the noun:`,
        examples: [
          {
            spanish: 'tres libros',
            english: 'three books',
            highlight: ['tres']
          },
          {
            spanish: 'el primer capítulo',
            english: 'the first chapter',
            highlight: ['primer']
          },
          {
            spanish: 'muchas personas',
            english: 'many people',
            highlight: ['muchas']
          },
          {
            spanish: 'pocos estudiantes',
            english: 'few students',
            highlight: ['pocos']
          }
        ]
      },
      {
        title: 'Possessive and Demonstrative Adjectives',
        content: `Possessive and demonstrative adjectives always go before the noun:`,
        examples: [
          {
            spanish: 'mi casa',
            english: 'my house',
            highlight: ['mi']
          },
          {
            spanish: 'tu hermana',
            english: 'your sister',
            highlight: ['tu']
          },
          {
            spanish: 'este libro',
            english: 'this book',
            highlight: ['este']
          },
          {
            spanish: 'aquella montaña',
            english: 'that mountain (over there)',
            highlight: ['aquella']
          }
        ]
      }
    ]
  },
  {
    title: 'Adjectives That Change Meaning by Position',
    content: `Some adjectives have different meanings depending on whether they go before or after the noun. This is a key feature of Spanish adjective position.`,
    subsections: [
      {
        title: 'Grande: Size vs. Greatness',
        content: `**Grande** changes meaning based on position:

**Before noun**: great, important (figurative)
**After noun**: big, large (physical size)`,
        examples: [
          {
            spanish: 'un gran hombre',
            english: 'a great man (important, admirable)',
            highlight: ['gran']
          },
          {
            spanish: 'un hombre grande',
            english: 'a big man (physically large)',
            highlight: ['grande']
          },
          {
            spanish: 'una gran idea',
            english: 'a great idea (excellent)',
            highlight: ['gran']
          },
          {
            spanish: 'una casa grande',
            english: 'a big house (large size)',
            highlight: ['grande']
          }
        ]
      },
      {
        title: 'Viejo: Age vs. Former',
        content: `**Viejo** changes meaning based on position:

**Before noun**: old (long-standing relationship), former
**After noun**: old (age)`,
        examples: [
          {
            spanish: 'mi viejo amigo',
            english: 'my old friend (long-time friend)',
            highlight: ['viejo']
          },
          {
            spanish: 'un hombre viejo',
            english: 'an old man (elderly)',
            highlight: ['viejo']
          },
          {
            spanish: 'el viejo presidente',
            english: 'the former president',
            highlight: ['viejo']
          }
        ]
      },
      {
        title: 'Nuevo: Different vs. Recent',
        content: `**Nuevo** changes meaning based on position:

**Before noun**: new (different, another)
**After noun**: new (recently made/acquired)`,
        examples: [
          {
            spanish: 'mi nuevo coche',
            english: 'my new car (different car, recently acquired)',
            highlight: ['nuevo']
          },
          {
            spanish: 'un coche nuevo',
            english: 'a new car (recently manufactured)',
            highlight: ['nuevo']
          },
          {
            spanish: 'una nueva oportunidad',
            english: 'a new opportunity (different opportunity)',
            highlight: ['nueva']
          }
        ]
      },
      {
        title: 'Pobre: Unfortunate vs. Not Rich',
        content: `**Pobre** changes meaning based on position:

**Before noun**: poor (unfortunate, pitiful)
**After noun**: poor (not wealthy)`,
        examples: [
          {
            spanish: 'el pobre hombre',
            english: 'the poor man (unfortunate man)',
            highlight: ['pobre']
          },
          {
            spanish: 'un hombre pobre',
            english: 'a poor man (not wealthy)',
            highlight: ['pobre']
          },
          {
            spanish: 'la pobre niña',
            english: 'the poor girl (pitiful)',
            highlight: ['pobre']
          }
        ]
      }
    ]
  },
  {
    title: 'Multiple Adjectives Position',
    content: `When using multiple adjectives with one noun, follow these rules:

**Rule 1**: Adjectives that normally go before stay before
**Rule 2**: Adjectives that normally go after stay after  
**Rule 3**: Use "y" (and) to connect adjectives in the same position`,
    examples: [
      {
        spanish: 'una buena película española',
        english: 'a good Spanish movie (buena before, española after)',
        highlight: ['buena', 'española']
      },
      {
        spanish: 'mis tres libros favoritos',
        english: 'my three favorite books (tres before, favoritos after)',
        highlight: ['tres', 'favoritos']
      },
      {
        spanish: 'una casa grande y blanca',
        english: 'a big and white house (both after, connected by y)',
        highlight: ['grande', 'blanca']
      },
      {
        spanish: 'un buen vino francés',
        english: 'a good French wine (buen before, francés after)',
        highlight: ['buen', 'francés']
      }
    ]
  },
  {
    title: 'Stylistic and Emphatic Position',
    content: `Sometimes adjectives can be moved for stylistic effect or emphasis:

**Poetic/Literary Style**: Descriptive adjectives before noun for poetic effect
**Emphasis**: Moving an adjective to unusual position for emphasis
**Subjective Opinion**: Personal opinions often go before noun

This is more advanced and used in literature, poetry, or for special emphasis.`,
    examples: [
      {
        spanish: 'la blanca nieve',
        english: 'the white snow (poetic - normally "nieve blanca")',
        highlight: ['blanca']
      },
      {
        spanish: 'una increíble historia',
        english: 'an incredible story (emphasis - could be "historia increíble")',
        highlight: ['increíble']
      },
      {
        spanish: 'sus hermosos ojos',
        english: 'her beautiful eyes (subjective opinion before noun)',
        highlight: ['hermosos']
      },
      {
        spanish: 'la fría mañana',
        english: 'the cold morning (literary style)',
        highlight: ['fría']
      }
    ]
  },
  {
    title: 'Common Position Mistakes',
    content: `Here are common mistakes Spanish learners make with adjective position:

**Mistake 1**: Putting nationality adjectives before noun
**Mistake 2**: Putting color adjectives before noun  
**Mistake 3**: Not recognizing meaning changes with position
**Mistake 4**: Incorrect multiple adjective order

Learning correct position makes your Spanish sound natural and avoids confusion.`,
    examples: [
      {
        spanish: '❌ la española comida → ✅ la comida española',
        english: 'Wrong: the Spanish food → Right: the Spanish food',
        highlight: ['española comida', 'comida española']
      },
      {
        spanish: '❌ el rojo coche → ✅ el coche rojo',
        english: 'Wrong: the red car → Right: the red car',
        highlight: ['rojo coche', 'coche rojo']
      },
      {
        spanish: '❌ un hombre gran → ✅ un gran hombre (great) / un hombre grande (big)',
        english: 'Wrong: a man great → Right: a great man / a big man',
        highlight: ['hombre gran', 'gran hombre', 'hombre grande']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Spanish Adjective Agreement',
    url: '/grammar/spanish/adjectives/agreement',
    difficulty: 'beginner'
  },
  {
    title: 'Comparative & Superlative',
    url: '/grammar/spanish/adjectives/comparison',
    difficulty: 'intermediate'
  },
  {
    title: 'Demonstrative Adjectives',
    url: '/grammar/spanish/adjectives/demonstrative',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Noun Gender',
    url: '/grammar/spanish/nouns/gender',
    difficulty: 'beginner'
  }
];

export default function SpanishAdjectivePositionPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'adjectives',
              topic: 'position',
              title: 'Spanish Adjective Position',
              description: 'Learn when Spanish adjectives go before or after nouns. Master the rules for adjective placement in Spanish.',
              difficulty: 'intermediate',
              examples: [
                'una buena idea (a good idea)',
                'un coche rojo (a red car)',
                'una gran mujer (a great woman)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'adjectives',
              topic: 'position',
              title: 'Spanish Adjective Position'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="spanish"
        category="adjectives"
        topic="position"
        title="Spanish Adjective Position"
        description="Learn when Spanish adjectives go before or after nouns. Master the rules for adjective placement in Spanish"
        difficulty="intermediate"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/spanish/adjectives"
        practiceUrl="/grammar/spanish/adjectives/position/practice"
        quizUrl="/grammar/spanish/adjectives/position/quiz"
        songUrl="/songs/es?theme=grammar&topic=adjective-position"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

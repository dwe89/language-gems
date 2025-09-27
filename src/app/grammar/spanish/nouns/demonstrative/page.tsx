import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'nouns',
  topic: 'demonstrative',
  title: 'Spanish Demonstrative Adjectives - Este, Ese, Aquel',
  description: 'Master Spanish demonstrative adjectives including este/esta, ese/esa, aquel/aquella with distance and usage rules.',
  difficulty: 'beginner',
  keywords: [
    'spanish demonstrative adjectives',
    'este ese aquel spanish',
    'demonstratives spanish grammar',
    'spanish this that',
    'demonstrative agreement spanish'
  ],
  examples: [
    'Este libro es interesante. (This book is interesting.)',
    'Esa casa es grande. (That house is big.)',
    'Aquellos coches son caros. (Those cars are expensive.)',
    'Esta mesa y esas sillas. (This table and those chairs.)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Demonstrative Adjectives',
    content: `Spanish **demonstrative adjectives** (adjetivos demostrativos) point to specific nouns and indicate their **distance** from the speaker. They must **agree** in gender and number with the nouns they modify.

**Three levels of distance:**
- **este/esta/estos/estas**: This/these (near the speaker)
- **ese/esa/esos/esas**: That/those (near the listener)
- **aquel/aquella/aquellos/aquellas**: That/those (far from both)

**Key features:**
- **Gender agreement**: Masculine (-e/-o) vs feminine (-a)
- **Number agreement**: Singular vs plural (-s)
- **Distance indication**: Physical or temporal proximity
- **Position**: Usually before the noun

**Why demonstratives matter:**
- **Essential communication**: Point to specific objects
- **Spatial awareness**: Show relationships in space
- **Clear reference**: Avoid ambiguity in conversation
- **Natural Spanish**: Required for fluent expression

Understanding demonstrative adjectives is **fundamental** for **basic Spanish communication**.`,
    examples: [
      {
        spanish: 'NEAR: Este coche es mío. (This car is mine.)',
        english: 'MEDIUM: Ese coche es tuyo. (That car is yours.)',
        highlight: ['Este coche', 'Ese coche']
      },
      {
        spanish: 'FAR: Aquel coche es suyo. (That car over there is his.)',
        english: 'PLURAL: Estos coches son nuestros. (These cars are ours.)',
        highlight: ['Aquel coche', 'Estos coches']
      }
    ]
  },
  {
    title: 'Forms of Demonstrative Adjectives',
    content: `**Complete paradigm** of Spanish demonstrative adjectives:`,
    conjugationTable: {
      title: 'Demonstrative Adjective Forms',
      conjugations: [
        { pronoun: 'Masculine Singular', form: 'este, ese, aquel', english: 'this, that, that (far)' },
        { pronoun: 'Feminine Singular', form: 'esta, esa, aquella', english: 'this, that, that (far)' },
        { pronoun: 'Masculine Plural', form: 'estos, esos, aquellos', english: 'these, those, those (far)' },
        { pronoun: 'Feminine Plural', form: 'estas, esas, aquellas', english: 'these, those, those (far)' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE: este libro, ese libro, aquel libro',
        english: 'FEMININE: esta mesa, esa mesa, aquella mesa',
        highlight: ['este libro', 'esta mesa']
      },
      {
        spanish: 'PLURAL M: estos libros, esos libros, aquellos libros',
        english: 'PLURAL F: estas mesas, esas mesas, aquellas mesas',
        highlight: ['estos libros', 'estas mesas']
      }
    ]
  },
  {
    title: 'Distance Levels and Usage',
    content: `**Three distance levels** with specific usage contexts:`,
    conjugationTable: {
      title: 'Distance and Usage',
      conjugations: [
        { pronoun: 'este/esta', form: 'Near speaker', english: 'This (here with me)' },
        { pronoun: 'ese/esa', form: 'Near listener', english: 'That (there with you)' },
        { pronoun: 'aquel/aquella', form: 'Far from both', english: 'That (over there)' }
      ]
    },
    examples: [
      {
        spanish: 'NEAR SPEAKER: Este teléfono que tengo es nuevo. (This phone I have is new.)',
        english: 'NEAR LISTENER: Ese teléfono que tienes es viejo. (That phone you have is old.)',
        highlight: ['Este teléfono', 'Ese teléfono']
      },
      {
        spanish: 'FAR FROM BOTH: Aquel teléfono de allí es caro. (That phone over there is expensive.)',
        english: 'COMPARISON: Este es mío, ese es tuyo, aquel es suyo.',
        highlight: ['Aquel teléfono', 'Este es mío']
      }
    ]
  },
  {
    title: 'Agreement Rules',
    content: `**Demonstrative adjectives** must agree in **gender and number**:`,
    examples: [
      {
        spanish: 'MASCULINE SINGULAR: este hombre, ese problema, aquel día',
        english: 'FEMININE SINGULAR: esta mujer, esa solución, aquella noche',
        highlight: ['este hombre', 'esta mujer']
      },
      {
        spanish: 'MASCULINE PLURAL: estos hombres, esos problemas, aquellos días',
        english: 'FEMININE PLURAL: estas mujeres, esas soluciones, aquellas noches',
        highlight: ['estos hombres', 'estas mujeres']
      }
    ]
  },
  {
    title: 'Temporal Usage',
    content: `**Demonstratives** can also indicate **time relationships**:`,
    examples: [
      {
        spanish: 'PRESENT: Esta semana tengo mucho trabajo. (This week I have a lot of work.)',
        english: 'RECENT PAST: Esa película que vimos ayer. (That movie we saw yesterday.)',
        highlight: ['Esta semana', 'Esa película']
      },
      {
        spanish: 'DISTANT PAST: Aquellos tiempos eran diferentes. (Those times were different.)',
        english: 'FUTURE: Este verano vamos a España. (This summer we\'re going to Spain.)',
        highlight: ['Aquellos tiempos', 'Este verano']
      }
    ]
  },
  {
    title: 'Common Expressions',
    content: `**Fixed expressions** with demonstrative adjectives:`,
    conjugationTable: {
      title: 'Common Expressions',
      conjugations: [
        { pronoun: 'esta noche', form: 'tonight', english: 'Esta noche vamos al cine.' },
        { pronoun: 'este año', form: 'this year', english: 'Este año estudiamos español.' },
        { pronoun: 'esa vez', form: 'that time', english: 'Esa vez tuvimos suerte.' },
        { pronoun: 'aquella época', form: 'that era', english: 'Aquella época fue difícil.' }
      ]
    },
    examples: [
      {
        spanish: 'TIME: Esta mañana, esta tarde, esta noche',
        english: 'FREQUENCY: Esta vez, esa vez, aquella vez',
        highlight: ['Esta mañana', 'Esta vez']
      }
    ]
  },
  {
    title: 'Position and Word Order',
    content: `**Demonstrative adjectives** typically come **before** the noun:`,
    examples: [
      {
        spanish: 'STANDARD: Esta casa es bonita. (This house is pretty.)',
        english: 'WITH ARTICLE: Esta la casa (incorrect - no article needed)',
        highlight: ['Esta casa']
      },
      {
        spanish: 'MULTIPLE ADJECTIVES: Esta casa grande y blanca. (This big white house.)',
        english: 'EMPHASIS: ¡Esta casa sí que es bonita! (This house really is pretty!)',
        highlight: ['Esta casa grande', 'Esta casa sí']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong agreement**: Not matching gender/number
**2. Using articles**: Adding definite articles unnecessarily
**3. Wrong distance**: Confusing este/ese/aquel usage
**4. Position errors**: Placing after the noun`,
    examples: [
      {
        spanish: '❌ este mesa → ✅ esta mesa',
        english: 'Wrong: must agree in gender',
        highlight: ['esta mesa']
      },
      {
        spanish: '❌ esta la casa → ✅ esta casa',
        english: 'Wrong: no article needed with demonstratives',
        highlight: ['esta casa']
      },
      {
        spanish: '❌ casa esta → ✅ esta casa',
        english: 'Wrong: demonstrative comes before noun',
        highlight: ['esta casa']
      },
      {
        spanish: '❌ estos problema → ✅ estos problemas',
        english: 'Wrong: must agree in number',
        highlight: ['estos problemas']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Noun Gender', url: '/grammar/spanish/nouns/gender', difficulty: 'beginner' },
  { title: 'Spanish Articles', url: '/grammar/spanish/nouns/articles', difficulty: 'beginner' },
  { title: 'Spanish Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' },
  { title: 'Spanish Possessive Adjectives', url: '/grammar/spanish/adjectives/possessive', difficulty: 'beginner' }
];

export default function SpanishDemonstrativePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'nouns',
              topic: 'demonstrative',
              title: 'Spanish Demonstrative Adjectives - Este, Ese, Aquel',
              description: 'Master Spanish demonstrative adjectives including este/esta, ese/esa, aquel/aquella with distance and usage rules.',
              difficulty: 'beginner',
              examples: [
                'Este libro es interesante. (This book is interesting.)',
                'Esa casa es grande. (That house is big.)',
                'Aquellos coches son caros. (Those cars are expensive.)',
                'Esta mesa y esas sillas. (This table and those chairs.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'nouns',
              topic: 'demonstrative',
              title: 'Spanish Demonstrative Adjectives - Este, Ese, Aquel'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="nouns"
        topic="demonstrative"
        title="Spanish Demonstrative Adjectives - Este, Ese, Aquel"
        description="Master Spanish demonstrative adjectives including este/esta, ese/esa, aquel/aquella with distance and usage rules"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/spanish/nouns"
        practiceUrl="/grammar/spanish/nouns/demonstrative/practice"
        quizUrl="/grammar/spanish/nouns/demonstrative/quiz"
        songUrl="/songs/es?theme=grammar&topic=demonstrative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

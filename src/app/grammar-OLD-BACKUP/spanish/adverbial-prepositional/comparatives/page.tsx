import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'adverbial-prepositional',
  topic: 'comparatives',
  title: 'Spanish Comparatives - Más Que, Menos Que, Tan Como',
  description: 'Master Spanish comparative structures including más que, menos que, tan como, and irregular comparatives.',
  difficulty: 'intermediate',
  keywords: [
    'spanish comparatives',
    'mas que menos que spanish',
    'tan como spanish',
    'spanish comparison grammar',
    'mejor peor spanish'
  ],
  examples: [
    'María es más alta que Juan. (María is taller than Juan.)',
    'Este libro es menos interesante que ese. (This book is less interesting than that one.)',
    'Pedro es tan inteligente como Ana. (Pedro is as intelligent as Ana.)',
    'Este vino es mejor que el otro. (This wine is better than the other.)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Comparatives',
    content: `Spanish **comparatives** (comparativos) express **relationships of inequality or equality** between people, things, or actions. They are essential for making comparisons and expressing degrees.

**Three types of comparisons:**
- **Superiority**: más... que (more... than)
- **Inferiority**: menos... que (less... than)
- **Equality**: tan... como (as... as)

**Basic structures:**
- **Adjectives**: más/menos + adjective + que
- **Adverbs**: más/menos + adverb + que
- **Nouns**: más/menos + noun + que
- **Verbs**: verb + más/menos + que

**Key features:**
- **Flexible usage**: Work with adjectives, adverbs, nouns, verbs
- **Irregular forms**: Some adjectives have special comparative forms
- **Number agreement**: Más/menos don't change, but adjectives do
- **Than expressions**: Various ways to express "than"

**Why comparatives matter:**
- **Express relationships**: Compare qualities and quantities
- **Natural communication**: Essential for everyday Spanish
- **Descriptive language**: Add nuance to descriptions
- **Advanced expression**: Create sophisticated comparisons

Understanding comparatives is **crucial** for **expressive Spanish communication**.`,
    examples: [
      {
        spanish: 'SUPERIORITY: Madrid es más grande que Barcelona. (Madrid is bigger than Barcelona.)',
        english: 'INFERIORITY: Este coche es menos caro que ese. (This car is less expensive than that one.)',
        highlight: ['más grande que', 'menos caro que']
      },
      {
        spanish: 'EQUALITY: Ana es tan alta como María. (Ana is as tall as María.)',
        english: 'IRREGULAR: Este vino es mejor que el otro. (This wine is better than the other.)',
        highlight: ['tan alta como', 'mejor que']
      }
    ]
  },
  {
    title: 'Superiority Comparisons - Más... Que',
    content: `**Más... que** expresses **superiority** (more... than):`,
    conjugationTable: {
      title: 'Más... Que Structures',
      conjugations: [
        { pronoun: 'Adjectives', form: 'más + adjective + que', english: 'más alto que (taller than)' },
        { pronoun: 'Adverbs', form: 'más + adverb + que', english: 'más rápidamente que (more quickly than)' },
        { pronoun: 'Nouns', form: 'más + noun + que', english: 'más dinero que (more money than)' },
        { pronoun: 'Verbs', form: 'verb + más que', english: 'trabaja más que (works more than)' }
      ]
    },
    examples: [
      {
        spanish: 'ADJECTIVE: Esta casa es más bonita que la otra. (This house is prettier than the other.)',
        english: 'ADVERB: Él habla más claramente que yo. (He speaks more clearly than I.)',
        highlight: ['más bonita que', 'más claramente que']
      },
      {
        spanish: 'NOUN: Tengo más libros que tú. (I have more books than you.)',
        english: 'VERB: María estudia más que Pedro. (María studies more than Pedro.)',
        highlight: ['más libros que', 'estudia más que']
      }
    ]
  },
  {
    title: 'Inferiority Comparisons - Menos... Que',
    content: `**Menos... que** expresses **inferiority** (less... than):`,
    conjugationTable: {
      title: 'Menos... Que Structures',
      conjugations: [
        { pronoun: 'Adjectives', form: 'menos + adjective + que', english: 'menos alto que (less tall than)' },
        { pronoun: 'Adverbs', form: 'menos + adverb + que', english: 'menos frecuentemente que (less frequently than)' },
        { pronoun: 'Nouns', form: 'menos + noun + que', english: 'menos tiempo que (less time than)' },
        { pronoun: 'Verbs', form: 'verb + menos que', english: 'come menos que (eats less than)' }
      ]
    },
    examples: [
      {
        spanish: 'ADJECTIVE: Este ejercicio es menos difícil que el otro. (This exercise is less difficult than the other.)',
        english: 'ADVERB: Ella conduce menos rápidamente que él. (She drives less quickly than he.)',
        highlight: ['menos difícil que', 'menos rápidamente que']
      },
      {
        spanish: 'NOUN: Hay menos estudiantes que profesores. (There are fewer students than teachers.)',
        english: 'VERB: Juan duerme menos que María. (Juan sleeps less than María.)',
        highlight: ['menos estudiantes que', 'duerme menos que']
      }
    ]
  },
  {
    title: 'Equality Comparisons - Tan... Como',
    content: `**Tan... como** expresses **equality** (as... as):`,
    conjugationTable: {
      title: 'Equality Comparison Structures',
      conjugations: [
        { pronoun: 'Adjectives', form: 'tan + adjective + como', english: 'tan alto como (as tall as)' },
        { pronoun: 'Adverbs', form: 'tan + adverb + como', english: 'tan rápidamente como (as quickly as)' },
        { pronoun: 'Nouns', form: 'tanto/a/os/as + noun + como', english: 'tanto dinero como (as much money as)' },
        { pronoun: 'Verbs', form: 'verb + tanto como', english: 'trabaja tanto como (works as much as)' }
      ]
    },
    examples: [
      {
        spanish: 'ADJECTIVE: Pedro es tan inteligente como Ana. (Pedro is as intelligent as Ana.)',
        english: 'ADVERB: Habla tan bien como un nativo. (He speaks as well as a native.)',
        highlight: ['tan inteligente como', 'tan bien como']
      },
      {
        spanish: 'NOUN: Tengo tanto trabajo como tú. (I have as much work as you.)',
        english: 'VERB: Ella estudia tanto como yo. (She studies as much as I.)',
        highlight: ['tanto trabajo como', 'estudia tanto como']
      }
    ]
  },
  {
    title: 'Tanto/a/os/as... Como - Noun Equality',
    content: `**Tanto** agrees in **gender and number** with the noun:`,
    conjugationTable: {
      title: 'Tanto Agreement Forms',
      conjugations: [
        { pronoun: 'tanto + masc. sing.', form: 'tanto dinero como', english: 'as much money as' },
        { pronoun: 'tanta + fem. sing.', form: 'tanta agua como', english: 'as much water as' },
        { pronoun: 'tantos + masc. plur.', form: 'tantos libros como', english: 'as many books as' },
        { pronoun: 'tantas + fem. plur.', form: 'tantas casas como', english: 'as many houses as' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE: Él tiene tanto dinero como ella. (He has as much money as she.)',
        english: 'FEMININE: Bebo tanta agua como tú. (I drink as much water as you.)',
        highlight: ['tanto dinero como', 'tanta agua como']
      },
      {
        spanish: 'PLURAL M: Tengo tantos hermanos como tú. (I have as many brothers as you.)',
        english: 'PLURAL F: Hay tantas sillas como mesas. (There are as many chairs as tables.)',
        highlight: ['tantos hermanos como', 'tantas sillas como']
      }
    ]
  },
  {
    title: 'Irregular Comparatives',
    content: `**Some adjectives** have **irregular comparative forms**:`,
    conjugationTable: {
      title: 'Irregular Comparative Forms',
      conjugations: [
        { pronoun: 'bueno → mejor', form: 'better', english: 'Este libro es mejor que ese. (This book is better than that one.)' },
        { pronoun: 'malo → peor', form: 'worse', english: 'El tiempo está peor que ayer. (The weather is worse than yesterday.)' },
        { pronoun: 'grande → mayor', form: 'older/bigger', english: 'Mi hermano es mayor que yo. (My brother is older than I.)' },
        { pronoun: 'pequeño → menor', form: 'younger/smaller', english: 'Ella es menor que su hermana. (She is younger than her sister.)' }
      ]
    },
    examples: [
      {
        spanish: 'BETTER: Esta película es mejor que la otra. (This movie is better than the other.)',
        english: 'WORSE: Su español es peor que el mío. (His Spanish is worse than mine.)',
        highlight: ['mejor que', 'peor que']
      },
      {
        spanish: 'OLDER: Soy mayor que mi primo. (I am older than my cousin.)',
        english: 'YOUNGER: Es menor de edad. (He/she is a minor.)',
        highlight: ['mayor que', 'menor de edad']
      }
    ]
  },
  {
    title: 'Comparisons with Numbers',
    content: `**With numbers**, use **más/menos de** (not que):`,
    examples: [
      {
        spanish: 'NUMBERS: Tengo más de veinte libros. (I have more than twenty books.)',
        english: 'QUANTITY: Hay menos de cien personas. (There are fewer than one hundred people.)',
        highlight: ['más de veinte', 'menos de cien']
      },
      {
        spanish: 'AGE: Tiene más de treinta años. (He/she is more than thirty years old.)',
        english: 'PRICE: Cuesta menos de cincuenta euros. (It costs less than fifty euros.)',
        highlight: ['más de treinta', 'menos de cincuenta']
      }
    ],
    subsections: [
      {
        title: 'Exception',
        content: 'In negative sentences, use "que" with numbers:',
        examples: [
          {
            spanish: 'NEGATIVE: No tengo más que diez euros. (I only have ten euros.)',
            english: 'MEANING: "No more than" = "only"',
            highlight: ['más que diez']
          }
        ]
      }
    ]
  },
  {
    title: 'Comparative Adverbs',
    content: `**Adverbs** also have comparative forms:`,
    conjugationTable: {
      title: 'Comparative Adverbs',
      conjugations: [
        { pronoun: 'bien → mejor', form: 'better', english: 'Habla mejor que antes. (He speaks better than before.)' },
        { pronoun: 'mal → peor', form: 'worse', english: 'Canta peor que su hermana. (He sings worse than his sister.)' },
        { pronoun: 'mucho → más', form: 'more', english: 'Trabaja más que yo. (He works more than I.)' },
        { pronoun: 'poco → menos', form: 'less', english: 'Duerme menos que necesita. (He sleeps less than he needs.)' }
      ]
    },
    examples: [
      {
        spanish: 'BETTER: Ahora entiendo mejor. (Now I understand better.)',
        english: 'WORSE: Hoy me siento peor. (Today I feel worse.)',
        highlight: ['entiendo mejor', 'me siento peor']
      }
    ]
  },
  {
    title: 'Complex Comparisons',
    content: `**More complex** comparative structures:`,
    examples: [
      {
        spanish: 'DOUBLE COMPARISON: Cuanto más estudias, más aprendes. (The more you study, the more you learn.)',
        english: 'PROGRESSIVE: Cada vez más difícil. (Increasingly difficult.)',
        highlight: ['Cuanto más... más', 'Cada vez más']
      },
      {
        spanish: 'SUPERLATIVE: Es el más inteligente de la clase. (He is the most intelligent in the class.)',
        english: 'ABSOLUTE: Es muy inteligente. / Es inteligentísimo. (He is very intelligent.)',
        highlight: ['el más inteligente', 'inteligentísimo']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Que vs de**: Using "que" with numbers instead of "de"
**2. Tanto agreement**: Not agreeing tanto with the noun
**3. Irregular forms**: Using más bueno instead of mejor
**4. Word order**: Wrong placement of comparative elements`,
    examples: [
      {
        spanish: '❌ más que veinte → ✅ más de veinte',
        english: 'Wrong: use "de" with numbers',
        highlight: ['más de veinte']
      },
      {
        spanish: '❌ tanto libros como → ✅ tantos libros como',
        english: 'Wrong: tanto must agree with noun',
        highlight: ['tantos libros como']
      },
      {
        spanish: '❌ más bueno que → ✅ mejor que',
        english: 'Wrong: use irregular form',
        highlight: ['mejor que']
      },
      {
        spanish: '❌ tan como alto → ✅ tan alto como',
        english: 'Wrong: adjective goes between tan and como',
        highlight: ['tan alto como']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Superlatives', url: '/grammar/spanish/adverbial-prepositional/superlatives', difficulty: 'intermediate' },
  { title: 'Spanish Adjective Agreement', url: '/grammar/spanish/adjectives/agreement', difficulty: 'beginner' },
  { title: 'Spanish Adverb Formation', url: '/grammar/spanish/adverbs/formation', difficulty: 'intermediate' },
  { title: 'Spanish Numbers', url: '/grammar/spanish/numbers/cardinal', difficulty: 'beginner' }
];

export default function SpanishComparativesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'adverbial-prepositional',
              topic: 'comparatives',
              title: 'Spanish Comparatives - Más Que, Menos Que, Tan Como',
              description: 'Master Spanish comparative structures including más que, menos que, tan como, and irregular comparatives.',
              difficulty: 'intermediate',
              examples: [
                'María es más alta que Juan. (María is taller than Juan.)',
                'Este libro es menos interesante que ese. (This book is less interesting than that one.)',
                'Pedro es tan inteligente como Ana. (Pedro is as intelligent as Ana.)',
                'Este vino es mejor que el otro. (This wine is better than the other.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'adverbial-prepositional',
              topic: 'comparatives',
              title: 'Spanish Comparatives - Más Que, Menos Que, Tan Como'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="adverbial-prepositional"
        topic="comparatives"
        title="Spanish Comparatives - Más Que, Menos Que, Tan Como"
        description="Master Spanish comparative structures including más que, menos que, tan como, and irregular comparatives"
        difficulty="intermediate"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/spanish/adverbial-prepositional"
        practiceUrl="/grammar/spanish/adverbial-prepositional/comparatives/practice"
        quizUrl="/grammar/spanish/adverbial-prepositional/comparatives/quiz"
        songUrl="/songs/es?theme=grammar&topic=comparatives"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

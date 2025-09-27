import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'adjectives',
  topic: 'comparative-superlative',
  title: 'German Comparative and Superlative - Formation and Usage Rules',
  description: 'Master German comparative and superlative forms including regular patterns, irregular forms, and comparison structures.',
  difficulty: 'intermediate',
  keywords: [
    'german comparative superlative',
    'german comparison',
    'als wie german',
    'comparative german adjectives',
    'superlative german forms',
    'german adjective comparison'
  ],
  examples: [
    'Das Auto ist schneller als der Bus. (The car is faster than the bus.)',
    'Sie ist so groß wie ihr Bruder. (She is as tall as her brother.)',
    'Das ist das beste Restaurant. (That is the best restaurant.)',
    'Er läuft am schnellsten. (He runs the fastest.)'
  ]
});

const sections = [
  {
    title: 'Understanding German Comparative and Superlative',
    content: `German **comparative and superlative** forms allow you to **compare** things and express **degrees** of qualities. The system is **systematic** but includes important **irregular forms** and **unique structures**.

**Three degrees of comparison:**
- **Positive**: groß (big)
- **Comparative**: größer (bigger)
- **Superlative**: am größten / der größte (biggest)

**Formation patterns:**
- **Regular**: adjective + -er (comparative), adjective + -st/-est (superlative)
- **Umlaut**: Many adjectives add umlaut (a→ä, o→ö, u→ü)
- **Irregular**: Some completely irregular forms (gut→besser→best-)

**Comparison structures:**
- **als**: than (with comparative)
- **so...wie**: as...as (equal comparison)
- **je...desto**: the...the (proportional)

**Why comparisons matter:**
- **Essential communication**: Express preferences and differences
- **Natural German**: Required for fluent expression
- **Precise meaning**: Show exact degrees of comparison
- **Advanced grammar**: Mark intermediate proficiency

**Learning strategy**: Master **regular patterns** first, then learn **common irregular forms**, finally practice **comparison structures**.

Understanding comparative and superlative is **crucial** for **intermediate German** and **expressive communication**.`,
    examples: [
      {
        spanish: 'COMPARATIVE: Mein Auto ist schneller als deins. (My car is faster than yours.)',
        english: 'SUPERLATIVE: Das ist das schnellste Auto. (That is the fastest car.)',
        highlight: ['schneller als', 'das schnellste']
      },
      {
        spanish: 'EQUAL: Er ist so groß wie ich. (He is as tall as I am.)',
        english: 'PROPORTIONAL: Je mehr, desto besser. (The more, the better.)',
        highlight: ['so groß wie', 'Je mehr, desto besser']
      }
    ]
  },
  {
    title: 'Regular Comparative Formation',
    content: `**Regular comparatives** add **-er** to the adjective stem:`,
    conjugationTable: {
      title: 'Regular Comparative Formation',
      conjugations: [
        { pronoun: 'schnell', form: 'schneller', english: 'fast → faster' },
        { pronoun: 'klein', form: 'kleiner', english: 'small → smaller' },
        { pronoun: 'neu', form: 'neuer', english: 'new → newer' },
        { pronoun: 'interessant', form: 'interessanter', english: 'interesting → more interesting' },
        { pronoun: 'schön', form: 'schöner', english: 'beautiful → more beautiful' }
      ]
    },
    examples: [
      {
        spanish: 'SIMPLE: Das Buch ist interessanter. (The book is more interesting.)',
        english: 'COMPARISON: Dieses Auto ist schneller als jenes. (This car is faster than that one.)',
        highlight: ['interessanter', 'schneller als']
      }
    ]
  },
  {
    title: 'Regular Superlative Formation',
    content: `**Regular superlatives** add **-st** or **-est** to the adjective stem:`,
    conjugationTable: {
      title: 'Regular Superlative Formation',
      conjugations: [
        { pronoun: 'schnell', form: 'am schnellsten / der schnellste', english: 'fastest' },
        { pronoun: 'klein', form: 'am kleinsten / der kleinste', english: 'smallest' },
        { pronoun: 'neu', form: 'am neuesten / der neueste', english: 'newest' },
        { pronoun: 'interessant', form: 'am interessantesten / der interessanteste', english: 'most interesting' }
      ]
    },
    examples: [
      {
        spanish: 'PREDICATE: Das Auto ist am schnellsten. (The car is fastest.)',
        english: 'ATTRIBUTIVE: Das ist das schnellste Auto. (That is the fastest car.)',
        highlight: ['am schnellsten', 'das schnellste']
      }
    ],
    subsections: [
      {
        title: '-est Ending',
        content: 'Use -est after -d, -t, -s, -ß, -z sounds:',
        examples: [
          {
            spanish: 'EXAMPLES: laut → am lautesten, heiß → am heißesten',
            english: 'PATTERN: difficult sounds need -est for pronunciation',
            highlight: ['lautesten', 'heißesten']
          }
        ]
      }
    ]
  },
  {
    title: 'Umlaut Changes in Comparison',
    content: `**Many adjectives** add **umlaut** in comparative and superlative:`,
    conjugationTable: {
      title: 'Umlaut Changes',
      conjugations: [
        { pronoun: 'alt', form: 'älter, am ältesten', english: 'old → older, oldest' },
        { pronoun: 'groß', form: 'größer, am größten', english: 'big → bigger, biggest' },
        { pronoun: 'jung', form: 'jünger, am jüngsten', english: 'young → younger, youngest' },
        { pronoun: 'kurz', form: 'kürzer, am kürzesten', english: 'short → shorter, shortest' },
        { pronoun: 'lang', form: 'länger, am längsten', english: 'long → longer, longest' },
        { pronoun: 'stark', form: 'stärker, am stärksten', english: 'strong → stronger, strongest' }
      ]
    },
    examples: [
      {
        spanish: 'UMLAUT: Mein Bruder ist älter als ich. (My brother is older than I am.)',
        english: 'SUPERLATIVE: Das ist das größte Haus. (That is the biggest house.)',
        highlight: ['älter als', 'das größte']
      }
    ]
  },
  {
    title: 'Irregular Comparative and Superlative Forms',
    content: `**Important irregular forms** that must be memorized:`,
    conjugationTable: {
      title: 'Irregular Forms',
      conjugations: [
        { pronoun: 'gut', form: 'besser, am besten', english: 'good → better, best' },
        { pronoun: 'viel', form: 'mehr, am meisten', english: 'much → more, most' },
        { pronoun: 'gern', form: 'lieber, am liebsten', english: 'gladly → rather, most gladly' },
        { pronoun: 'hoch', form: 'höher, am höchsten', english: 'high → higher, highest' },
        { pronoun: 'nah', form: 'näher, am nächsten', english: 'near → nearer, nearest' }
      ]
    },
    examples: [
      {
        spanish: 'IRREGULAR: Das ist besser als erwartet. (That is better than expected.)',
        english: 'PREFERENCE: Ich trinke lieber Tee. (I prefer to drink tea.)',
        highlight: ['besser als', 'lieber']
      },
      {
        spanish: 'QUANTITY: Er hat mehr Geld. (He has more money.)',
        english: 'SUPERLATIVE: Das gefällt mir am besten. (I like that best.)',
        highlight: ['mehr Geld', 'am besten']
      }
    ]
  },
  {
    title: 'Comparison with "als" (Than)',
    content: `Use **als** to express **"than"** with comparative forms:`,
    examples: [
      {
        spanish: 'BASIC: Mein Auto ist schneller als deins. (My car is faster than yours.)',
        english: 'PEOPLE: Sie ist älter als ihr Bruder. (She is older than her brother.)',
        highlight: ['schneller als', 'älter als']
      },
      {
        spanish: 'QUANTITY: Ich habe mehr Bücher als du. (I have more books than you.)',
        english: 'QUALITY: Dieses Restaurant ist besser als das andere. (This restaurant is better than the other.)',
        highlight: ['mehr als', 'besser als']
      }
    ],
    subsections: [
      {
        title: 'Important Note',
        content: 'Never use "wie" with comparative - only "als":',
        examples: [
          {
            spanish: '✅ CORRECT: schneller als (faster than)',
            english: '❌ WRONG: schneller wie',
            highlight: ['schneller als']
          }
        ]
      }
    ]
  },
  {
    title: 'Equal Comparison with "so...wie" (As...As)',
    content: `Use **so...wie** to express **equal comparison**:`,
    examples: [
      {
        spanish: 'EQUAL: Er ist so groß wie sein Vater. (He is as tall as his father.)',
        english: 'NEGATIVE: Sie ist nicht so alt wie ich. (She is not as old as I am.)',
        highlight: ['so groß wie', 'nicht so alt wie']
      },
      {
        spanish: 'ABILITY: Ich kann so gut kochen wie meine Mutter. (I can cook as well as my mother.)',
        english: 'QUANTITY: Er hat so viele Bücher wie ich. (He has as many books as I do.)',
        highlight: ['so gut wie', 'so viele wie']
      }
    ]
  },
  {
    title: 'Attributive vs Predicate Superlatives',
    content: `**Superlatives** have **different forms** depending on their position:`,
    conjugationTable: {
      title: 'Superlative Forms',
      conjugations: [
        { pronoun: 'Predicate', form: 'am + superlative', english: 'Das Auto ist am schnellsten.' },
        { pronoun: 'Attributive', form: 'der/die/das + superlative + ending', english: 'Das ist das schnellste Auto.' },
        { pronoun: 'Predicate', form: 'am besten', english: 'Das gefällt mir am besten.' },
        { pronoun: 'Attributive', form: 'der beste', english: 'Das ist der beste Film.' }
      ]
    },
    examples: [
      {
        spanish: 'PREDICATE: Dieses Buch ist am interessantesten. (This book is most interesting.)',
        english: 'ATTRIBUTIVE: Das ist das interessanteste Buch. (That is the most interesting book.)',
        highlight: ['am interessantesten', 'das interessanteste']
      }
    ]
  },
  {
    title: 'Proportional Comparison: "je...desto"',
    content: `**je...desto** expresses **proportional relationships** (the...the):`,
    examples: [
      {
        spanish: 'BASIC: Je mehr, desto besser. (The more, the better.)',
        english: 'COMPLEX: Je älter ich werde, desto weiser werde ich. (The older I get, the wiser I become.)',
        highlight: ['Je mehr, desto besser', 'Je älter, desto weiser']
      },
      {
        spanish: 'SPEED: Je schneller du fährst, desto gefährlicher wird es. (The faster you drive, the more dangerous it becomes.)',
        english: 'LEARNING: Je mehr du übst, desto besser wirst du. (The more you practice, the better you become.)',
        highlight: ['Je schneller, desto gefährlicher', 'Je mehr, desto besser']
      }
    ]
  },
  {
    title: 'Adjective Endings with Comparatives',
    content: `**Comparative adjectives** take **regular adjective endings** when used attributively:`,
    conjugationTable: {
      title: 'Comparative Adjective Endings',
      conjugations: [
        { pronoun: 'Nominative', form: 'der schnellere Wagen', english: 'the faster car' },
        { pronoun: 'Accusative', form: 'einen schnelleren Wagen', english: 'a faster car' },
        { pronoun: 'Dative', form: 'mit dem schnelleren Wagen', english: 'with the faster car' },
        { pronoun: 'Genitive', form: 'des schnelleren Wagens', english: 'of the faster car' }
      ]
    },
    examples: [
      {
        spanish: 'ATTRIBUTIVE: Ich kaufe ein größeres Auto. (I buy a bigger car.)',
        english: 'PREDICATE: Das Auto ist größer. (The car is bigger.)',
        highlight: ['größeres Auto', 'ist größer']
      }
    ]
  },
  {
    title: 'Intensifying Comparatives',
    content: `**Intensify comparatives** with adverbs:`,
    conjugationTable: {
      title: 'Intensifiers',
      conjugations: [
        { pronoun: 'viel', form: 'much', english: 'viel schneller (much faster)' },
        { pronoun: 'noch', form: 'even', english: 'noch größer (even bigger)' },
        { pronoun: 'etwas', form: 'somewhat', english: 'etwas kleiner (somewhat smaller)' },
        { pronoun: 'bedeutend', form: 'significantly', english: 'bedeutend besser (significantly better)' }
      ]
    },
    examples: [
      {
        spanish: 'INTENSIFIED: Das ist viel besser als erwartet. (That is much better than expected.)',
        english: 'MODERATE: Es ist etwas teurer. (It is somewhat more expensive.)',
        highlight: ['viel besser', 'etwas teurer']
      }
    ]
  },
  {
    title: 'Common Expressions with Comparatives',
    content: `**Fixed expressions** using comparative forms:`,
    conjugationTable: {
      title: 'Common Expressions',
      conjugations: [
        { pronoun: 'immer mehr', form: 'more and more', english: 'Es wird immer mehr.' },
        { pronoun: 'je länger, je lieber', form: 'the longer, the better', english: 'Je länger, je lieber.' },
        { pronoun: 'mehr oder weniger', form: 'more or less', english: 'Das ist mehr oder weniger richtig.' },
        { pronoun: 'um so besser', form: 'all the better', english: 'Um so besser für uns!' }
      ]
    },
    examples: [
      {
        spanish: 'PROGRESSION: Es wird immer schwieriger. (It becomes more and more difficult.)',
        english: 'APPROXIMATION: Das ist mehr oder weniger korrekt. (That is more or less correct.)',
        highlight: ['immer schwieriger', 'mehr oder weniger']
      }
    ]
  },
  {
    title: 'Common Mistakes with Comparatives',
    content: `Here are frequent errors students make:

**1. Wrong comparison word**: Using "wie" instead of "als" with comparatives
**2. Missing umlaut**: Forgetting umlaut in irregular forms
**3. Wrong superlative form**: Confusing attributive and predicate forms
**4. Adjective endings**: Wrong endings on comparative adjectives`,
    examples: [
      {
        spanish: '❌ schneller wie → ✅ schneller als',
        english: 'Wrong: use "als" with comparative, not "wie"',
        highlight: ['schneller als']
      },
      {
        spanish: '❌ alter → ✅ älter',
        english: 'Wrong: must add umlaut in comparative',
        highlight: ['älter']
      },
      {
        spanish: '❌ Das ist der am besten → ✅ Das ist am besten / Das ist der beste',
        english: 'Wrong: don\'t mix attributive and predicate forms',
        highlight: ['am besten', 'der beste']
      },
      {
        spanish: '❌ ein schneller Auto → ✅ ein schnelleres Auto',
        english: 'Wrong: comparative adjectives need proper endings',
        highlight: ['schnelleres Auto']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Adjective Endings', url: '/grammar/german/adjectives/adjective-endings', difficulty: 'intermediate' },
  { title: 'German Adverbs', url: '/grammar/german/adverbs/formation', difficulty: 'intermediate' },
  { title: 'German Word Order', url: '/grammar/german/syntax/word-order', difficulty: 'intermediate' },
  { title: 'German Articles', url: '/grammar/german/nouns/articles', difficulty: 'beginner' }
];

export default function GermanComparativeSuperlativePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'adjectives',
              topic: 'comparative-superlative',
              title: 'German Comparative and Superlative - Formation and Usage Rules',
              description: 'Master German comparative and superlative forms including regular patterns, irregular forms, and comparison structures.',
              difficulty: 'intermediate',
              examples: [
                'Das Auto ist schneller als der Bus. (The car is faster than the bus.)',
                'Sie ist so groß wie ihr Bruder. (She is as tall as her brother.)',
                'Das ist das beste Restaurant. (That is the best restaurant.)',
                'Er läuft am schnellsten. (He runs the fastest.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'adjectives',
              topic: 'comparative-superlative',
              title: 'German Comparative and Superlative - Formation and Usage Rules'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="adjectives"
        topic="comparative-superlative"
        title="German Comparative and Superlative - Formation and Usage Rules"
        description="Master German comparative and superlative forms including regular patterns, irregular forms, and comparison structures"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/german/adjectives"
        practiceUrl="/grammar/german/adjectives/comparative-superlative/practice"
        quizUrl="/grammar/german/adjectives/comparative-superlative/quiz"
        songUrl="/songs/de?theme=grammar&topic=comparative-superlative"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

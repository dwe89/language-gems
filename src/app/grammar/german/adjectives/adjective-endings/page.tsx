import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'adjectives',
  topic: 'adjective-endings',
  title: 'German Adjective Endings - Declension Rules and Patterns',
  description: 'Master German adjective endings including strong, weak, and mixed declension patterns for all cases and genders.',
  difficulty: 'intermediate',
  keywords: [
    'german adjective endings',
    'german adjective declension',
    'strong weak mixed german',
    'adjective agreement german',
    'german adjective cases',
    'der die das adjectives'
  ],
  examples: [
    'der große Mann (the big man)',
    'ein großer Mann (a big man)',
    'großer Mann (big man - no article)',
    'die schöne Frau (the beautiful woman)'
  ]
});

const sections = [
  {
    title: 'Understanding German Adjective Endings',
    content: `German **adjective endings** change based on **gender**, **case**, **number**, and the **type of article** used. This system is **complex** but **highly systematic**, making German adjectives **precise** and **grammatically consistent**.

**Three declension patterns:**
- **Strong declension**: No article or after words like viel, wenig
- **Weak declension**: After definite articles (der, die, das)
- **Mixed declension**: After indefinite articles (ein, eine, kein)

**Factors affecting endings:**
- **Gender**: Masculine, feminine, neuter
- **Case**: Nominative, accusative, dative, genitive
- **Number**: Singular or plural
- **Article type**: Definite, indefinite, or no article

**Key principle**: Adjective endings **show grammatical information** that articles might not provide. When articles are "weak" (don't show clear case/gender), adjectives become "strong" (show more information).

**Why endings matter:**
- **Grammatical precision**: Essential for clear communication
- **Native-like German**: Marks advanced German proficiency
- **Comprehension**: Helps understand relationships in sentences
- **Formal writing**: Required for academic and professional German

**Learning strategy**: Master one pattern at a time, starting with **weak declension** (most common in everyday German).

Understanding adjective endings is **crucial** for **intermediate German** and **grammatical accuracy**.`,
    examples: [
      {
        spanish: 'WEAK: der große Mann, die große Frau, das große Kind',
        english: 'STRONG: großer Mann, große Frau, großes Kind',
        highlight: ['der große', 'die große', 'großer', 'große']
      },
      {
        spanish: 'MIXED: ein großer Mann, eine große Frau, ein großes Kind',
        english: 'CASE CHANGE: den großen Mann (accusative)',
        highlight: ['ein großer', 'eine große', 'den großen']
      }
    ]
  },
  {
    title: 'Weak Declension (After Definite Articles)',
    content: `**Weak declension** is used after **definite articles** (der, die, das) and **demonstratives** (dieser, jener):`,
    conjugationTable: {
      title: 'Weak Declension Endings',
      conjugations: [
        { pronoun: 'Nominative', form: '-e (all genders)', english: 'der große Mann, die große Frau, das große Kind' },
        { pronoun: 'Accusative', form: '-e (fem/neut), -en (masc)', english: 'den großen Mann, die große Frau, das große Kind' },
        { pronoun: 'Dative', form: '-en (all)', english: 'dem großen Mann, der großen Frau, dem großen Kind' },
        { pronoun: 'Genitive', form: '-en (all)', english: 'des großen Mannes, der großen Frau, des großen Kindes' },
        { pronoun: 'Plural (all cases)', form: '-en', english: 'die großen Männer/Frauen/Kinder' }
      ]
    },
    examples: [
      {
        spanish: 'NOMINATIVE: Der neue Student ist hier. (The new student is here.)',
        english: 'ACCUSATIVE: Ich sehe den neuen Studenten. (I see the new student.)',
        highlight: ['Der neue Student', 'den neuen Studenten']
      },
      {
        spanish: 'DATIVE: Ich helfe dem neuen Studenten. (I help the new student.)',
        english: 'PLURAL: Die neuen Studenten sind hier. (The new students are here.)',
        highlight: ['dem neuen Studenten', 'Die neuen Studenten']
      }
    ],
    subsections: [
      {
        title: 'Memory Aid',
        content: 'Weak declension: mostly -e and -en endings:',
        examples: [
          {
            spanish: 'PATTERN: Nominative = -e, everything else mostly -en',
            english: 'EXCEPTION: Accusative feminine/neuter also -e',
            highlight: ['-e', '-en']
          }
        ]
      }
    ]
  },
  {
    title: 'Strong Declension (No Article)',
    content: `**Strong declension** is used when there's **no article** or after words like **viel**, **wenig**, **etwas**:`,
    conjugationTable: {
      title: 'Strong Declension Endings',
      conjugations: [
        { pronoun: 'Nominative', form: '-er (m), -e (f), -es (n)', english: 'großer Mann, große Frau, großes Kind' },
        { pronoun: 'Accusative', form: '-en (m), -e (f), -es (n)', english: 'großen Mann, große Frau, großes Kind' },
        { pronoun: 'Dative', form: '-em (m/n), -er (f)', english: 'großem Mann, großer Frau, großem Kind' },
        { pronoun: 'Genitive', form: '-en (m/n), -er (f)', english: 'großen Mannes, großer Frau, großen Kindes' },
        { pronoun: 'Plural', form: '-e (nom/acc), -en (dat), -er (gen)', english: 'große Männer, großen Männern, großer Männer' }
      ]
    },
    examples: [
      {
        spanish: 'NO ARTICLE: Guter Wein ist teuer. (Good wine is expensive.)',
        english: 'AFTER VIEL: Ich trinke viel kaltes Wasser. (I drink much cold water.)',
        highlight: ['Guter Wein', 'viel kaltes Wasser']
      },
      {
        spanish: 'PLURAL: Kleine Kinder spielen hier. (Small children play here.)',
        english: 'DATIVE: Mit großem Interesse... (With great interest...)',
        highlight: ['Kleine Kinder', 'großem Interesse']
      }
    ]
  },
  {
    title: 'Mixed Declension (After Indefinite Articles)',
    content: `**Mixed declension** is used after **indefinite articles** (ein, eine) and **possessives** (mein, dein, sein):`,
    conjugationTable: {
      title: 'Mixed Declension Endings',
      conjugations: [
        { pronoun: 'Nominative', form: '-er (m), -e (f), -es (n)', english: 'ein großer Mann, eine große Frau, ein großes Kind' },
        { pronoun: 'Accusative', form: '-en (m), -e (f), -es (n)', english: 'einen großen Mann, eine große Frau, ein großes Kind' },
        { pronoun: 'Dative', form: '-en (all)', english: 'einem großen Mann, einer großen Frau, einem großen Kind' },
        { pronoun: 'Genitive', form: '-en (all)', english: 'eines großen Mannes, einer großen Frau, eines großen Kindes' },
        { pronoun: 'Plural', form: '-en (all cases)', english: 'keine großen Männer/Frauen/Kinder' }
      ]
    },
    examples: [
      {
        spanish: 'INDEFINITE: Ein neuer Student kommt. (A new student comes.)',
        english: 'POSSESSIVE: Mein alter Freund ist hier. (My old friend is here.)',
        highlight: ['Ein neuer Student', 'Mein alter Freund']
      },
      {
        spanish: 'ACCUSATIVE: Ich sehe einen neuen Film. (I see a new movie.)',
        english: 'DATIVE: Ich helfe einem alten Mann. (I help an old man.)',
        highlight: ['einen neuen Film', 'einem alten Mann']
      }
    ]
  },
  {
    title: 'Adjective Ending Patterns Summary',
    content: `**Quick reference** for choosing the right pattern:`,
    conjugationTable: {
      title: 'When to Use Each Pattern',
      conjugations: [
        { pronoun: 'Weak (-e/-en)', form: 'After der, die, das', english: 'der große Mann, die schöne Frau' },
        { pronoun: 'Weak (-e/-en)', form: 'After dieser, jener', english: 'dieser neue Student, jene alte Dame' },
        { pronoun: 'Strong (like articles)', form: 'No article', english: 'großer Mann, schöne Frau' },
        { pronoun: 'Strong (like articles)', form: 'After viel, wenig', english: 'viel gutes Essen, wenig freie Zeit' },
        { pronoun: 'Mixed (strong/weak)', form: 'After ein, eine', english: 'ein großer Mann, eine schöne Frau' },
        { pronoun: 'Mixed (strong/weak)', form: 'After possessives', english: 'mein neues Auto, deine alte Jacke' }
      ]
    },
    examples: [
      {
        spanish: 'DEFINITE: der rote Wagen (the red car)',
        english: 'INDEFINITE: ein roter Wagen (a red car)',
        highlight: ['der rote Wagen', 'ein roter Wagen']
      },
      {
        spanish: 'NO ARTICLE: roter Wagen (red car)',
        english: 'POSSESSIVE: mein roter Wagen (my red car)',
        highlight: ['roter Wagen', 'mein roter Wagen']
      }
    ]
  },
  {
    title: 'Multiple Adjectives',
    content: `When **multiple adjectives** modify the same noun, they **all take the same ending**:`,
    examples: [
      {
        spanish: 'WEAK: der große, alte, rote Wagen (the big, old, red car)',
        english: 'STRONG: großer, alter, roter Wagen (big, old, red car)',
        highlight: ['große, alte, rote', 'großer, alter, roter']
      },
      {
        spanish: 'MIXED: ein großer, alter, roter Wagen (a big, old, red car)',
        english: 'DATIVE: mit dem großen, alten, roten Wagen (with the big, old, red car)',
        highlight: ['großer, alter, roter', 'großen, alten, roten']
      }
    ],
    subsections: [
      {
        title: 'Parallel Endings',
        content: 'All adjectives before the same noun have identical endings:',
        examples: [
          {
            spanish: 'CORRECT: die schöne, neue, teure Jacke',
            english: 'WRONG: die schöne, neuer, teure Jacke',
            highlight: ['schöne, neue, teure']
          }
        ]
      }
    ]
  },
  {
    title: 'Predicate Adjectives (No Endings)',
    content: `**Predicate adjectives** (after sein, werden, bleiben) **never take endings**:`,
    examples: [
      {
        spanish: 'PREDICATE: Der Mann ist groß. (The man is big.)',
        english: 'ATTRIBUTIVE: Der große Mann... (The big man...)',
        highlight: ['ist groß', 'große Mann']
      },
      {
        spanish: 'PREDICATE: Die Frau wird müde. (The woman becomes tired.)',
        english: 'ATTRIBUTIVE: Die müde Frau... (The tired woman...)',
        highlight: ['wird müde', 'müde Frau']
      }
    ],
    subsections: [
      {
        title: 'Key Verbs',
        content: 'Adjectives after these verbs take no endings:',
        examples: [
          {
            spanish: 'sein: Das ist schön. (That is beautiful.)',
            english: 'werden: Es wird kalt. (It becomes cold.)',
            highlight: ['ist schön', 'wird kalt']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Cases and Exceptions',
    content: `**Special situations** with adjective endings:`,
    conjugationTable: {
      title: 'Special Cases',
      conjugations: [
        { pronoun: 'alle, beide', form: 'Weak declension', english: 'alle guten Freunde (all good friends)' },
        { pronoun: 'Numbers', form: 'Strong declension', english: 'zwei große Häuser (two big houses)' },
        { pronoun: 'Proper names', form: 'Usually strong', english: 'deutsches Bier (German beer)' },
        { pronoun: 'Colors as nouns', form: 'Strong when alone', english: 'Ich mag Rot. (I like red.)' }
      ]
    },
    examples: [
      {
        spanish: 'NUMBERS: drei kleine Kinder (three small children)',
        english: 'ALLE: alle neuen Studenten (all new students)',
        highlight: ['drei kleine Kinder', 'alle neuen Studenten']
      }
    ]
  },
  {
    title: 'Learning Strategies',
    content: `**Effective methods** for mastering adjective endings:`,
    conjugationTable: {
      title: 'Learning Strategies',
      conjugations: [
        { pronoun: 'Start simple', form: 'Master nominative first', english: 'der große Mann, ein großer Mann' },
        { pronoun: 'Pattern recognition', form: 'Learn by article type', english: 'Group weak/strong/mixed together' },
        { pronoun: 'Frequent phrases', form: 'Memorize common combinations', english: 'guten Tag, schönes Wetter' },
        { pronoun: 'Practice sentences', form: 'Use in context', english: 'Der neue Student ist nett.' },
        { pronoun: 'Color coding', form: 'Visual memory aids', english: 'Different colors for different patterns' }
      ]
    },
    examples: [
      {
        spanish: 'COMMON PHRASES: Guten Morgen! (Good morning!)',
        english: 'PRACTICE: Ich kaufe einen neuen Computer. (I buy a new computer.)',
        highlight: ['Guten Morgen', 'einen neuen Computer']
      }
    ]
  },
  {
    title: 'Common Mistakes with Adjective Endings',
    content: `Here are frequent errors students make:

**1. Wrong declension pattern**: Using strong instead of weak or vice versa
**2. Case confusion**: Wrong ending for the case
**3. Gender errors**: Wrong ending for noun gender
**4. Predicate adjectives**: Adding endings when not needed`,
    examples: [
      {
        spanish: '❌ der großer Mann → ✅ der große Mann',
        english: 'Wrong: weak declension after definite article',
        highlight: ['der große Mann']
      },
      {
        spanish: '❌ einen große Frau → ✅ eine große Frau',
        english: 'Wrong: feminine accusative uses eine, not einen',
        highlight: ['eine große Frau']
      },
      {
        spanish: '❌ Das ist schöne → ✅ Das ist schön',
        english: 'Wrong: predicate adjectives take no endings',
        highlight: ['ist schön']
      },
      {
        spanish: '❌ großer Frau → ✅ große Frau',
        english: 'Wrong: feminine nominative strong ending is -e, not -er',
        highlight: ['große Frau']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Articles', url: '/grammar/german/nouns/articles', difficulty: 'beginner' },
  { title: 'German Cases', url: '/grammar/german/cases/overview', difficulty: 'intermediate' },
  { title: 'German Comparative', url: '/grammar/german/adjectives/comparative', difficulty: 'intermediate' },
  { title: 'German Possessive Adjectives', url: '/grammar/german/adjectives/possessive', difficulty: 'beginner' }
];

export default function GermanAdjectiveEndingsPage() {
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
              topic: 'adjective-endings',
              title: 'German Adjective Endings - Declension Rules and Patterns',
              description: 'Master German adjective endings including strong, weak, and mixed declension patterns for all cases and genders.',
              difficulty: 'intermediate',
              examples: [
                'der große Mann (the big man)',
                'ein großer Mann (a big man)',
                'großer Mann (big man - no article)',
                'die schöne Frau (the beautiful woman)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'adjectives',
              topic: 'adjective-endings',
              title: 'German Adjective Endings - Declension Rules and Patterns'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="adjectives"
        topic="adjective-endings"
        title="German Adjective Endings - Declension Rules and Patterns"
        description="Master German adjective endings including strong, weak, and mixed declension patterns for all cases and genders"
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/german/adjectives"
        practiceUrl="/grammar/german/adjectives/adjective-endings/practice"
        quizUrl="/grammar/german/adjectives/adjective-endings/quiz"
        songUrl="/songs/de?theme=grammar&topic=adjective-endings"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

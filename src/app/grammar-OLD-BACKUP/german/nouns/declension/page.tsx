import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'nouns',
  topic: 'declension',
  title: 'German Noun Declension - Case Endings and Patterns',
  description: 'Master German noun declension including strong, weak, and mixed declension patterns across all four cases.',
  difficulty: 'intermediate',
  keywords: [
    'german noun declension',
    'german case endings',
    'german strong declension',
    'german weak declension',
    'german noun cases'
  ],
  examples: [
    'der Mann → des Mannes (genitive)',
    'der Junge → den Jungen (accusative)',
    'das Herz → dem Herzen (dative)',
    'die Frau → der Frau (genitive)'
  ]
});

const sections = [
  {
    title: 'Understanding German Noun Declension',
    content: `German **noun declension** (Deklination) refers to how **nouns change their endings** depending on their **case, number, and gender**. This is **fundamental** to German grammar.

**Three declension patterns:**
- **Strong declension**: Most masculine and neuter nouns
- **Weak declension**: Some masculine nouns (der Junge, der Herr)
- **Mixed declension**: Few nouns (das Herz, der Name)

**What changes:**
- **Noun endings**: Added to the noun stem
- **Article forms**: der/die/das change by case
- **Adjective endings**: When present, also change

**Four cases affect declension:**
- **Nominative**: Subject case (no ending usually)
- **Accusative**: Direct object (usually no ending)
- **Dative**: Indirect object (-n for plurals)
- **Genitive**: Possession (-s/-es for masc/neut)

**Why declension matters:**
- **Grammatical correctness**: Essential for proper German
- **Clear meaning**: Cases show relationships
- **Natural speech**: Native speakers use automatically
- **Advanced proficiency**: Mark intermediate/advanced level

Understanding declension is **crucial** for **correct German grammar**.`,
    examples: [
      {
        spanish: 'STRONG: der Mann → des Mannes → dem Mann → den Mann',
        english: 'WEAK: der Junge → des Jungen → dem Jungen → den Jungen',
        highlight: ['des Mannes', 'des Jungen']
      },
      {
        spanish: 'FEMININE: die Frau → der Frau → der Frau → die Frau (no noun ending changes)',
        english: 'PLURAL: die Männer → der Männer → den Männern → die Männer',
        highlight: ['der Frau', 'den Männern']
      }
    ]
  },
  {
    title: 'Strong Declension Pattern',
    content: `**Strong declension** applies to **most masculine and neuter nouns**:`,
    conjugationTable: {
      title: 'Strong Declension Endings',
      conjugations: [
        { pronoun: 'Nominative', form: '(no ending)', english: 'der Mann, das Kind' },
        { pronoun: 'Accusative', form: '(no ending)', english: 'den Mann, das Kind' },
        { pronoun: 'Dative', form: '(no ending)', english: 'dem Mann, dem Kind' },
        { pronoun: 'Genitive', form: '-s or -es', english: 'des Mannes, des Kindes' },
        { pronoun: 'Plural Dative', form: '-n (if not already there)', english: 'den Männern, den Kindern' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE: der Tisch → des Tisches → dem Tisch → den Tisch',
        english: 'NEUTER: das Buch → des Buches → dem Buch → das Buch',
        highlight: ['des Tisches', 'des Buches']
      },
      {
        spanish: 'PLURAL: die Tische → der Tische → den Tischen → die Tische',
        english: 'DATIVE PLURAL: den Büchern (adds -n to plural form)',
        highlight: ['den Tischen', 'den Büchern']
      }
    ]
  },
  {
    title: 'Genitive Endings: -s vs -es',
    content: `**Genitive endings** follow specific rules:`,
    conjugationTable: {
      title: 'Genitive Ending Rules',
      conjugations: [
        { pronoun: 'One syllable', form: 'Usually -es', english: 'des Mannes, des Kindes' },
        { pronoun: 'Multiple syllables', form: 'Usually -s', english: 'des Lehrers, des Computers' },
        { pronoun: 'Ends in -s, -ß, -x, -z', form: 'Always -es', english: 'des Hauses, des Platzes' },
        { pronoun: 'Foreign words', form: 'Usually -s', english: 'des Hotels, des Restaurants' }
      ]
    },
    examples: [
      {
        spanish: 'ONE SYLLABLE: der Mann → des Mannes, das Haus → des Hauses',
        english: 'MULTIPLE: der Lehrer → des Lehrers, der Computer → des Computers',
        highlight: ['des Mannes', 'des Lehrers']
      },
      {
        spanish: 'SIBILANT ENDING: der Platz → des Platzes, das Glas → des Glases',
        english: 'FOREIGN: das Hotel → des Hotels, das Restaurant → des Restaurants',
        highlight: ['des Platzes', 'des Hotels']
      }
    ]
  },
  {
    title: 'Weak Declension Pattern',
    content: `**Weak declension** applies to **some masculine nouns** (living beings):`,
    conjugationTable: {
      title: 'Weak Declension Endings',
      conjugations: [
        { pronoun: 'Nominative', form: '(no ending)', english: 'der Junge, der Herr' },
        { pronoun: 'Accusative', form: '-n or -en', english: 'den Jungen, den Herrn' },
        { pronoun: 'Dative', form: '-n or -en', english: 'dem Jungen, dem Herrn' },
        { pronoun: 'Genitive', form: '-n or -en', english: 'des Jungen, des Herrn' }
      ]
    },
    examples: [
      {
        spanish: 'WEAK NOUN: der Junge → des Jungen → dem Jungen → den Jungen',
        english: 'WEAK NOUN: der Student → des Studenten → dem Studenten → den Studenten',
        highlight: ['des Jungen', 'des Studenten']
      },
      {
        spanish: 'PATTERN: All cases except nominative get -n/-en ending',
        english: 'LIVING BEINGS: der Löwe, der Affe, der Kunde, der Kollege',
        highlight: ['-n/-en ending']
      }
    ]
  },
  {
    title: 'Common Weak Declension Nouns',
    content: `**Masculine nouns** that follow weak declension:`,
    conjugationTable: {
      title: 'Common Weak Nouns',
      conjugations: [
        { pronoun: 'der Junge', form: 'boy', english: 'des Jungen, dem Jungen, den Jungen' },
        { pronoun: 'der Student', form: 'student', english: 'des Studenten, dem Studenten, den Studenten' },
        { pronoun: 'der Herr', form: 'gentleman', english: 'des Herrn, dem Herrn, den Herrn' },
        { pronoun: 'der Kunde', form: 'customer', english: 'des Kunden, dem Kunden, den Kunden' },
        { pronoun: 'der Löwe', form: 'lion', english: 'des Löwen, dem Löwen, den Löwen' },
        { pronoun: 'der Kollege', form: 'colleague', english: 'des Kollegen, dem Kollegen, den Kollegen' }
      ]
    },
    examples: [
      {
        spanish: 'PEOPLE: der Junge, der Student, der Kunde, der Kollege',
        english: 'ANIMALS: der Löwe, der Affe, der Hase, der Rabe',
        highlight: ['der Junge', 'der Löwe']
      }
    ]
  },
  {
    title: 'Mixed Declension Pattern',
    content: `**Mixed declension** combines strong and weak patterns (very few nouns):`,
    conjugationTable: {
      title: 'Mixed Declension Examples',
      conjugations: [
        { pronoun: 'das Herz', form: 'heart', english: 'des Herzens, dem Herzen, das Herz' },
        { pronoun: 'der Name', form: 'name', english: 'des Namens, dem Namen, den Namen' },
        { pronoun: 'der Gedanke', form: 'thought', english: 'des Gedankens, dem Gedanken, den Gedanken' },
        { pronoun: 'der Glaube', form: 'belief', english: 'des Glaubens, dem Glauben, den Glauben' }
      ]
    },
    examples: [
      {
        spanish: 'MIXED: das Herz → des Herzens (strong -s) → dem Herzen (weak -n)',
        english: 'MIXED: der Name → des Namens (strong -s) → dem Namen (weak -n)',
        highlight: ['des Herzens', 'des Namens']
      }
    ]
  },
  {
    title: 'Feminine Noun Declension',
    content: `**Feminine nouns** have **no ending changes** in singular:`,
    conjugationTable: {
      title: 'Feminine Declension',
      conjugations: [
        { pronoun: 'Nominative', form: 'die Frau', english: 'the woman' },
        { pronoun: 'Accusative', form: 'die Frau', english: 'the woman' },
        { pronoun: 'Dative', form: 'der Frau', english: 'to/for the woman' },
        { pronoun: 'Genitive', form: 'der Frau', english: 'of the woman' }
      ]
    },
    examples: [
      {
        spanish: 'SINGULAR: die Frau → der Frau → der Frau → die Frau (noun never changes)',
        english: 'PLURAL: die Frauen → der Frauen → den Frauen → die Frauen (dative adds -n)',
        highlight: ['die Frau', 'den Frauen']
      }
    ]
  },
  {
    title: 'Plural Declension Rules',
    content: `**Plural nouns** follow specific declension patterns:`,
    conjugationTable: {
      title: 'Plural Declension',
      conjugations: [
        { pronoun: 'Nominative', form: 'die + plural form', english: 'die Männer, die Frauen' },
        { pronoun: 'Accusative', form: 'die + plural form', english: 'die Männer, die Frauen' },
        { pronoun: 'Dative', form: 'den + plural + n', english: 'den Männern, den Frauen' },
        { pronoun: 'Genitive', form: 'der + plural form', english: 'der Männer, der Frauen' }
      ]
    },
    examples: [
      {
        spanish: 'DATIVE PLURAL: Always add -n if not already there',
        english: 'EXAMPLES: den Kindern, den Häusern, den Autos',
        highlight: ['den Kindern', 'den Häusern']
      },
      {
        spanish: 'ALREADY ENDS IN -N: die Frauen → den Frauen (no extra -n)',
        english: 'ENDS IN -S: die Autos → den Autos (no -n added)',
        highlight: ['den Frauen', 'den Autos']
      }
    ]
  },
  {
    title: 'Proper Nouns and Names',
    content: `**Proper nouns** follow special declension rules:`,
    examples: [
      {
        spanish: 'GENITIVE: Peters Buch (Peter\'s book), Marias Auto (Maria\'s car)',
        english: 'WITH ARTICLE: des kleinen Peters (of little Peter)',
        highlight: ['Peters Buch', 'des kleinen Peters']
      },
      {
        spanish: 'PLACE NAMES: in Deutschland (in Germany), nach Berlin (to Berlin)',
        english: 'COUNTRIES: die Schweiz → der Schweiz, die USA → der USA',
        highlight: ['in Deutschland', 'der Schweiz']
      }
    ]
  },
  {
    title: 'Declension with Adjectives',
    content: `**Adjectives** also decline when modifying nouns:`,
    examples: [
      {
        spanish: 'STRONG NOUN + ADJ: der große Mann → des großen Mannes',
        english: 'WEAK NOUN + ADJ: der kleine Junge → des kleinen Jungen',
        highlight: ['des großen Mannes', 'des kleinen Jungen']
      },
      {
        spanish: 'FEMININE + ADJ: die schöne Frau → der schönen Frau',
        english: 'PLURAL + ADJ: die guten Männer → den guten Männern',
        highlight: ['der schönen Frau', 'den guten Männern']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong genitive ending**: Using -s instead of -es or vice versa
**2. Weak noun confusion**: Not recognizing weak declension nouns
**3. Plural dative**: Forgetting -n in dative plural
**4. Feminine endings**: Adding unnecessary endings to feminine nouns`,
    examples: [
      {
        spanish: '❌ des Mans → ✅ des Mannes',
        english: 'Wrong: one-syllable nouns usually take -es in genitive',
        highlight: ['des Mannes']
      },
      {
        spanish: '❌ den Junge → ✅ den Jungen',
        english: 'Wrong: weak nouns take -n in all cases except nominative',
        highlight: ['den Jungen']
      },
      {
        spanish: '❌ den Kindern → ✅ den Kindern',
        english: 'Correct: dative plural always has -n (Kindern already ends in -n)',
        highlight: ['den Kindern']
      },
      {
        spanish: '❌ der Frauen → ✅ der Frau',
        english: 'Wrong: feminine singular nouns don\'t change endings',
        highlight: ['der Frau']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Cases Overview', url: '/grammar/german/cases/overview', difficulty: 'beginner' },
  { title: 'German Adjective Declension', url: '/grammar/german/adjectives/declension', difficulty: 'advanced' },
  { title: 'German Weak Nouns', url: '/grammar/german/nouns/weak-nouns', difficulty: 'intermediate' },
  { title: 'German Plural Formation', url: '/grammar/german/nouns/plural-formation', difficulty: 'intermediate' }
];

export default function GermanNounDeclensionPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'nouns',
              topic: 'declension',
              title: 'German Noun Declension - Case Endings and Patterns',
              description: 'Master German noun declension including strong, weak, and mixed declension patterns across all four cases.',
              difficulty: 'intermediate',
              examples: [
                'der Mann → des Mannes (genitive)',
                'der Junge → den Jungen (accusative)',
                'das Herz → dem Herzen (dative)',
                'die Frau → der Frau (genitive)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'nouns',
              topic: 'declension',
              title: 'German Noun Declension - Case Endings and Patterns'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="nouns"
        topic="declension"
        title="German Noun Declension - Case Endings and Patterns"
        description="Master German noun declension including strong, weak, and mixed declension patterns across all four cases"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/german/nouns"
        practiceUrl="/grammar/german/nouns/declension/practice"
        quizUrl="/grammar/german/nouns/declension/quiz"
        songUrl="/songs/de?theme=grammar&topic=declension"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

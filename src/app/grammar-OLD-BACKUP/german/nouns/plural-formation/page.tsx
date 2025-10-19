import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'nouns',
  topic: 'plural-formation',
  title: 'German Plural Formation - Rules, Patterns, and Endings',
  description: 'Master German plural formation including -e, -er, -n/-en, -s endings, umlaut changes, and irregular plurals.',
  difficulty: 'beginner',
  keywords: [
    'german plural formation',
    'german plural endings',
    'german plural rules',
    'umlaut plural german',
    'german noun plurals',
    'plural patterns german'
  ],
  examples: [
    'der Tisch → die Tische (table → tables)',
    'das Kind → die Kinder (child → children)',
    'die Frau → die Frauen (woman → women)',
    'das Auto → die Autos (car → cars)'
  ]
});

const sections = [
  {
    title: 'Understanding German Plural Formation',
    content: `German **plural formation** is more complex than English, with **five main patterns** and **umlaut changes**. Unlike English, which mostly adds -s, German uses different endings based on **gender**, **word structure**, and **historical patterns**.

**Five main plural patterns:**
- **-e plurals**: Most common for masculine/neuter (der Tisch → die Tische)
- **-er plurals**: Many masculine/neuter with umlaut (das Kind → die Kinder)
- **-n/-en plurals**: Most feminine nouns (die Frau → die Frauen)
- **-s plurals**: Foreign words and some names (das Auto → die Autos)
- **No change**: Some masculine/neuter (der Lehrer → die Lehrer)

**Key features:**
- **Umlaut changes**: a→ä, o→ö, u→ü in many plurals
- **Gender patterns**: Each gender has preferred plural types
- **Memorization needed**: No single rule covers all cases
- **Article changes**: All plurals use "die" regardless of singular gender

**Why plurals matter:**
- **Communication clarity**: Essential for expressing quantities
- **Grammatical accuracy**: Affects article and adjective agreement
- **Case declension**: Plural forms change in different cases
- **Natural speech**: Required for fluent German

**Learning strategy**: Learn nouns with their **plural forms** from the beginning: der Tisch, die Tische.

Understanding plural patterns is **essential** for **German noun mastery** and **accurate communication**.`,
    examples: [
      {
        spanish: '-E PLURALS: der Tisch → die Tische, der Hund → die Hunde',
        english: '-ER PLURALS: das Kind → die Kinder, das Haus → die Häuser',
        highlight: ['die Tische, die Hunde', 'die Kinder, die Häuser']
      },
      {
        spanish: '-N/-EN PLURALS: die Frau → die Frauen, die Lampe → die Lampen',
        english: '-S PLURALS: das Auto → die Autos, das Hotel → die Hotels',
        highlight: ['die Frauen, die Lampen', 'die Autos, die Hotels']
      }
    ]
  },
  {
    title: '-E Plurals (Most Common)',
    content: `**-e plurals** are the most common pattern, especially for **masculine and neuter** nouns:`,
    conjugationTable: {
      title: '-e Plural Formation',
      conjugations: [
        { pronoun: 'Most masculine', form: 'der Tisch → die Tische', english: 'table → tables' },
        { pronoun: 'Many neuter', form: 'das Jahr → die Jahre', english: 'year → years' },
        { pronoun: 'With umlaut', form: 'der Stuhl → die Stühle', english: 'chair → chairs (a→ä)' },
        { pronoun: 'Monosyllabic', form: 'der Hund → die Hunde', english: 'dog → dogs' },
        { pronoun: 'Some feminine', form: 'die Hand → die Hände', english: 'hand → hands (a→ä)' }
      ]
    },
    examples: [
      {
        spanish: 'REGULAR: der Tag → die Tage (day → days)',
        english: 'WITH UMLAUT: der Ball → die Bälle (ball → balls)',
        highlight: ['die Tage', 'die Bälle']
      },
      {
        spanish: 'NEUTER: das Bein → die Beine (leg → legs)',
        english: 'FEMININE: die Stadt → die Städte (city → cities)',
        highlight: ['die Beine', 'die Städte']
      }
    ],
    subsections: [
      {
        title: 'Umlaut Rules',
        content: 'Many -e plurals add umlaut to the stem vowel:',
        examples: [
          {
            spanish: 'a → ä: der Platz → die Plätze (place → places)',
            english: 'o → ö: der Sohn → die Söhne (son → sons)',
            highlight: ['die Plätze', 'die Söhne']
          }
        ]
      }
    ]
  },
  {
    title: '-ER Plurals with Umlaut',
    content: `**-er plurals** typically add **umlaut** and are common for **masculine and neuter** nouns:`,
    conjugationTable: {
      title: '-er Plural Formation',
      conjugations: [
        { pronoun: 'Neuter common', form: 'das Kind → die Kinder', english: 'child → children' },
        { pronoun: 'With umlaut', form: 'das Haus → die Häuser', english: 'house → houses (a→ä)' },
        { pronoun: 'Masculine', form: 'der Mann → die Männer', english: 'man → men (a→ä)' },
        { pronoun: 'Monosyllabic', form: 'das Buch → die Bücher', english: 'book → books (u→ü)' },
        { pronoun: 'Some without umlaut', form: 'das Bild → die Bilder', english: 'picture → pictures' }
      ]
    },
    examples: [
      {
        spanish: 'COMMON: das Wort → die Wörter (word → words)',
        english: 'PEOPLE: der Geist → die Geister (spirit → spirits)',
        highlight: ['die Wörter', 'die Geister']
      },
      {
        spanish: 'ANIMALS: das Huhn → die Hühner (chicken → chickens)',
        english: 'OBJECTS: das Glas → die Gläser (glass → glasses)',
        highlight: ['die Hühner', 'die Gläser']
      }
    ]
  },
  {
    title: '-N/-EN Plurals (Feminine Pattern)',
    content: `**-n/-en plurals** are the **standard pattern for feminine** nouns:`,
    conjugationTable: {
      title: '-n/-en Plural Formation',
      conjugations: [
        { pronoun: 'Ends in -e', form: 'die Lampe → die Lampen', english: 'lamp → lamps (add -n)' },
        { pronoun: 'Ends in consonant', form: 'die Frau → die Frauen', english: 'woman → women (add -en)' },
        { pronoun: 'Weak masculines', form: 'der Student → die Studenten', english: 'student → students' },
        { pronoun: 'Some neuters', form: 'das Herz → die Herzen', english: 'heart → hearts' },
        { pronoun: 'Foreign words', form: 'die Nation → die Nationen', english: 'nation → nations' }
      ]
    },
    examples: [
      {
        spanish: 'FEMININE -E: die Blume → die Blumen (flower → flowers)',
        english: 'FEMININE CONSONANT: die Wand → die Wände (wall → walls)',
        highlight: ['die Blumen', 'die Wände']
      },
      {
        spanish: 'WEAK MASCULINE: der Junge → die Jungen (boy → boys)',
        english: 'FOREIGN: die Universität → die Universitäten',
        highlight: ['die Jungen', 'die Universitäten']
      }
    ]
  },
  {
    title: '-S Plurals (Foreign Words)',
    content: `**-s plurals** are used for **foreign words** and **modern borrowings**:`,
    conjugationTable: {
      title: '-s Plural Formation',
      conjugations: [
        { pronoun: 'Foreign words', form: 'das Auto → die Autos', english: 'car → cars' },
        { pronoun: 'English borrowings', form: 'der Computer → die Computer', english: 'computer → computers' },
        { pronoun: 'Names/brands', form: 'der BMW → die BMWs', english: 'BMW → BMWs' },
        { pronoun: 'Abbreviations', form: 'die CD → die CDs', english: 'CD → CDs' },
        { pronoun: 'Some family names', form: 'die Müllers', english: 'the Müller family' }
      ]
    },
    examples: [
      {
        spanish: 'VEHICLES: das Taxi → die Taxis, der Bus → die Busse',
        english: 'TECHNOLOGY: das Handy → die Handys, der Laptop → die Laptops',
        highlight: ['die Taxis', 'die Handys']
      }
    ]
  },
  {
    title: 'No Change Plurals',
    content: `**Some nouns** have **identical singular and plural** forms:`,
    conjugationTable: {
      title: 'Unchanged Plurals',
      conjugations: [
        { pronoun: 'Ends in -er', form: 'der Lehrer → die Lehrer', english: 'teacher → teachers' },
        { pronoun: 'Ends in -el', form: 'der Apfel → die Äpfel', english: 'apple → apples (with umlaut)' },
        { pronoun: 'Ends in -en', form: 'der Wagen → die Wagen', english: 'car → cars' },
        { pronoun: 'Diminutives', form: 'das Mädchen → die Mädchen', english: 'girl → girls' },
        { pronoun: 'Some neuters', form: 'das Fenster → die Fenster', english: 'window → windows' }
      ]
    },
    examples: [
      {
        spanish: 'PROFESSIONS: der Arbeiter → die Arbeiter (worker → workers)',
        english: 'OBJECTS: der Hammer → die Hammer (hammer → hammers)',
        highlight: ['die Arbeiter', 'die Hammer']
      },
      {
        spanish: 'WITH UMLAUT: der Vater → die Väter (father → fathers)',
        english: 'DIMINUTIVES: das Kätzchen → die Kätzchen (kitten → kittens)',
        highlight: ['die Väter', 'die Kätzchen']
      }
    ]
  },
  {
    title: 'Umlaut Changes in Plurals',
    content: `**Umlaut changes** (a→ä, o→ö, u→ü) are common in German plurals:`,
    conjugationTable: {
      title: 'Umlaut Patterns',
      conjugations: [
        { pronoun: 'a → ä', form: 'der Vater → die Väter', english: 'father → fathers' },
        { pronoun: 'o → ö', form: 'der Sohn → die Söhne', english: 'son → sons' },
        { pronoun: 'u → ü', form: 'das Buch → die Bücher', english: 'book → books' },
        { pronoun: 'au → äu', form: 'das Haus → die Häuser', english: 'house → houses' },
        { pronoun: 'No umlaut possible', form: 'der Tisch → die Tische', english: 'table → tables (i cannot umlaut)' }
      ]
    },
    examples: [
      {
        spanish: 'FAMILY: die Mutter → die Mütter (mother → mothers)',
        english: 'ANIMALS: die Maus → die Mäuse (mouse → mice)',
        highlight: ['die Mütter', 'die Mäuse']
      }
    ]
  },
  {
    title: 'Gender-Based Plural Tendencies',
    content: `**Different genders** prefer **different plural patterns**:`,
    conjugationTable: {
      title: 'Gender Plural Preferences',
      conjugations: [
        { pronoun: 'Masculine', form: 'Mostly -e, some -er', english: 'der Tisch → die Tische, der Mann → die Männer' },
        { pronoun: 'Feminine', form: 'Mostly -n/-en', english: 'die Frau → die Frauen, die Lampe → die Lampen' },
        { pronoun: 'Neuter', form: 'Mixed: -e, -er, unchanged', english: 'das Jahr → die Jahre, das Kind → die Kinder' },
        { pronoun: 'All genders', form: 'Use "die" in plural', english: 'der/die/das → die (plural article)' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE PATTERN: der Hund → die Hunde, der Stuhl → die Stühle',
        english: 'FEMININE PATTERN: die Katze → die Katzen, die Blume → die Blumen',
        highlight: ['die Hunde, die Stühle', 'die Katzen, die Blumen']
      }
    ]
  },
  {
    title: 'Irregular and Special Plurals',
    content: `**Some nouns** have **irregular or unique** plural forms:`,
    conjugationTable: {
      title: 'Irregular Plurals',
      conjugations: [
        { pronoun: 'das Wort', form: 'die Wörter/Worte', english: 'words (Wörter=individual, Worte=connected)' },
        { pronoun: 'der Kaktus', form: 'die Kakteen', english: 'cactus → cacti (Latin plural)' },
        { pronoun: 'das Datum', form: 'die Daten', english: 'date → dates (Latin plural)' },
        { pronoun: 'der Atlas', form: 'die Atlanten', english: 'atlas → atlases' },
        { pronoun: 'das Genus', form: 'die Genera', english: 'genus → genera (Latin)' }
      ]
    },
    examples: [
      {
        spanish: 'DOUBLE PLURALS: das Wort → die Wörter (individual words) / die Worte (speech)',
        english: 'LATIN FORMS: das Zentrum → die Zentren (center → centers)',
        highlight: ['die Wörter / die Worte', 'die Zentren']
      }
    ]
  },
  {
    title: 'Compound Noun Plurals',
    content: `**Compound nouns** form plurals based on the **final element**:`,
    examples: [
      {
        spanish: 'der Arbeitsplatz → die Arbeitsplätze (workplace → workplaces)',
        english: 'das Schulbuch → die Schulbücher (textbook → textbooks)',
        highlight: ['die Arbeitsplätze', 'die Schulbücher']
      },
      {
        spanish: 'die Haustür → die Haustüren (front door → front doors)',
        english: 'der Autoschlüssel → die Autoschlüssel (car key → car keys)',
        highlight: ['die Haustüren', 'die Autoschlüssel']
      }
    ],
    subsections: [
      {
        title: 'Rule',
        content: 'Only the final element changes for plural:',
        examples: [
          {
            spanish: 'PATTERN: [first element unchanged] + [final element plural]',
            english: 'Example: Haus + Tür → Haus + Türen = Haustüren',
            highlight: ['final element plural']
          }
        ]
      }
    ]
  },
  {
    title: 'Learning Strategies for Plurals',
    content: `**Effective methods** for mastering German plurals:`,
    conjugationTable: {
      title: 'Learning Strategies',
      conjugations: [
        { pronoun: 'Learn together', form: 'der Tisch, die Tische', english: 'Always learn singular + plural' },
        { pronoun: 'Pattern recognition', form: 'Group by endings', english: 'All -tion words → -tionen' },
        { pronoun: 'Gender awareness', form: 'Feminine → mostly -n/-en', english: 'Use gender to predict plural' },
        { pronoun: 'Frequency focus', form: 'Common words first', english: 'Master high-frequency plurals' },
        { pronoun: 'Practice sentences', form: 'Use in context', english: 'Die Bücher sind interessant.' }
      ]
    },
    examples: [
      {
        spanish: 'GOOD PRACTICE: der Stuhl, die Stühle (chair, chairs)',
        english: 'CONTEXT USE: Ich habe drei Bücher. (I have three books.)',
        highlight: ['der Stuhl, die Stühle', 'drei Bücher']
      }
    ]
  },
  {
    title: 'Common Mistakes with Plurals',
    content: `Here are frequent errors students make:

**1. Wrong plural ending**: Using English -s for all plurals
**2. Missing umlaut**: Forgetting umlaut changes
**3. Wrong article**: Not using "die" for all plurals
**4. Overgeneralization**: Applying one pattern to all nouns`,
    examples: [
      {
        spanish: '❌ die Tischs → ✅ die Tische',
        english: 'Wrong: don\'t add -s to German nouns',
        highlight: ['die Tische']
      },
      {
        spanish: '❌ die Vaters → ✅ die Väter',
        english: 'Wrong: must add umlaut in Vater plural',
        highlight: ['die Väter']
      },
      {
        spanish: '❌ der Bücher → ✅ die Bücher',
        english: 'Wrong: all plurals use "die" article',
        highlight: ['die Bücher']
      },
      {
        spanish: '❌ die Fraues → ✅ die Frauen',
        english: 'Wrong: feminine nouns usually add -n/-en',
        highlight: ['die Frauen']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Gender Rules', url: '/grammar/german/nouns/gender-rules', difficulty: 'beginner' },
  { title: 'German Articles', url: '/grammar/german/nouns/articles', difficulty: 'beginner' },
  { title: 'German Compound Nouns', url: '/grammar/german/nouns/compound-nouns', difficulty: 'intermediate' },
  { title: 'German Noun Declension', url: '/grammar/german/nouns/declension', difficulty: 'intermediate' }
];

export default function GermanPluralFormationPage() {
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
              topic: 'plural-formation',
              title: 'German Plural Formation - Rules, Patterns, and Endings',
              description: 'Master German plural formation including -e, -er, -n/-en, -s endings, umlaut changes, and irregular plurals.',
              difficulty: 'beginner',
              examples: [
                'der Tisch → die Tische (table → tables)',
                'das Kind → die Kinder (child → children)',
                'die Frau → die Frauen (woman → women)',
                'das Auto → die Autos (car → cars)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'nouns',
              topic: 'plural-formation',
              title: 'German Plural Formation - Rules, Patterns, and Endings'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="nouns"
        topic="plural-formation"
        title="German Plural Formation - Rules, Patterns, and Endings"
        description="Master German plural formation including -e, -er, -n/-en, -s endings, umlaut changes, and irregular plurals"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/german/nouns"
        practiceUrl="/grammar/german/nouns/plural-formation/practice"
        quizUrl="/grammar/german/nouns/plural-formation/quiz"
        songUrl="/songs/de?theme=grammar&topic=plural-formation"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

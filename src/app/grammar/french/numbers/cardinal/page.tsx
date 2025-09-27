import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'numbers',
  topic: 'cardinal',
  title: 'French Cardinal Numbers (Un, Deux, Trois, Vingt, Cent, Mille)',
  description: 'Master French cardinal numbers from 0 to millions. Learn pronunciation, spelling, agreement rules, and usage of French numbers.',
  difficulty: 'beginner',
  keywords: [
    'french cardinal numbers',
    'french numbers 1-100',
    'un deux trois french',
    'vingt cent mille',
    'french number pronunciation',
    'counting in french'
  ],
  examples: [
    'un, deux, trois (one, two, three)',
    'vingt et un (twenty-one)',
    'quatre-vingts (eighty)',
    'deux cents (two hundred)',
    'mille neuf cent quatre-vingt-dix-neuf (1999)'
  ]
});

const sections = [
  {
    title: 'Understanding French Cardinal Numbers',
    content: `French cardinal numbers express **quantity** and **count**. They answer the question "combien?" (how many?) and are essential for daily communication.

French numbers have specific patterns and rules:
**Agreement**: Some numbers agree with gender
**Pronunciation**: Liaison and elision rules
**Spelling**: Hyphenation and compound forms
**Special forms**: Irregular patterns for certain numbers

Learning French numbers is fundamental for shopping, telling time, dates, and expressing quantities.`,
    examples: [
      {
        spanish: 'J\'ai trois livres. (I have three books.)',
        english: 'Expressing quantity',
        highlight: ['trois livres']
      },
      {
        spanish: 'Il y a vingt étudiants. (There are twenty students.)',
        english: 'Counting people',
        highlight: ['vingt étudiants']
      },
      {
        spanish: 'Ça coûte cent euros. (It costs one hundred euros.)',
        english: 'Expressing price',
        highlight: ['cent euros']
      }
    ]
  },
  {
    title: 'Numbers 0-19 (Basic Numbers)',
    content: `The foundation numbers that must be memorized:`,
    conjugationTable: {
      title: 'Numbers 0-19',
      conjugations: [
        { pronoun: '0-4', form: 'zéro, un, deux, trois, quatre', english: 'zero, one, two, three, four' },
        { pronoun: '5-9', form: 'cinq, six, sept, huit, neuf', english: 'five, six, seven, eight, nine' },
        { pronoun: '10-14', form: 'dix, onze, douze, treize, quatorze', english: 'ten, eleven, twelve, thirteen, fourteen' },
        { pronoun: '15-19', form: 'quinze, seize, dix-sept, dix-huit, dix-neuf', english: 'fifteen, sixteen, seventeen, eighteen, nineteen' }
      ]
    },
    subsections: [
      {
        title: 'UN Agreement',
        content: 'Un changes to une with feminine nouns:',
        examples: [
          {
            spanish: 'un livre (one book - masculine)',
            english: 'une table (one table - feminine)',
            highlight: ['un livre', 'une table']
          },
          {
            spanish: 'vingt et un livres (twenty-one books)',
            english: 'vingt et une tables (twenty-one tables)',
            highlight: ['vingt et un', 'vingt et une']
          }
        ]
      },
      {
        title: 'Pronunciation Notes',
        content: 'Important pronunciation patterns:',
        examples: [
          {
            spanish: 'six: [sis] alone, [si] before consonant, [siz] before vowel',
            english: 'huit: [ɥit] - silent h, liaison with vowels',
            highlight: ['six', 'huit']
          }
        ]
      }
    ]
  },
  {
    title: 'Numbers 20-69 (Tens)',
    content: `Regular tens pattern with special rules:`,
    examples: [
      {
        spanish: 'vingt (20), trente (30), quarante (40)',
        english: 'cinquante (50), soixante (60)',
        highlight: ['vingt', 'trente', 'quarante', 'cinquante', 'soixante']
      }
    ],
    subsections: [
      {
        title: 'Compound Numbers 21-69',
        content: 'How to form compound numbers:',
        conjugationTable: {
          title: 'Compound Numbers',
          conjugations: [
            { pronoun: '21, 31, 41, 51, 61', form: 'et un', english: 'vingt et un, trente et un, etc.' },
            { pronoun: '22-29, 32-39, etc.', form: 'hyphen', english: 'vingt-deux, trente-trois, etc.' },
            { pronoun: 'All others', form: 'hyphen', english: 'vingt-quatre, cinquante-sept' }
          ]
        }
      },
      {
        title: 'ET UN Pattern',
        content: 'Special "et un" for x1 numbers:',
        examples: [
          {
            spanish: 'vingt et un (21), trente et un (31)',
            english: 'quarante et un (41), cinquante et un (51)',
            highlight: ['et un']
          },
          {
            spanish: 'BUT: quatre-vingt-un (81) - no "et"',
            english: 'Exception to the et un rule',
            highlight: ['quatre-vingt-un']
          }
        ]
      }
    ]
  },
  {
    title: 'Numbers 70-99 (Special System)',
    content: `French uses a unique system for 70-99:`,
    examples: [
      {
        spanish: 'soixante-dix (70) = sixty-ten',
        english: 'quatre-vingts (80) = four-twenties',
        highlight: ['soixante-dix', 'quatre-vingts']
      },
      {
        spanish: 'quatre-vingt-dix (90) = four-twenty-ten',
        english: 'Complex but logical system',
        highlight: ['quatre-vingt-dix']
      }
    ],
    subsections: [
      {
        title: '70-79 (Soixante-dix)',
        content: 'Seventy system: 60 + 10-19',
        conjugationTable: {
          title: 'Numbers 70-79',
          conjugations: [
            { pronoun: '70-74', form: 'soixante-dix, -onze, -douze, -treize, -quatorze', english: 'seventy, seventy-one, etc.' },
            { pronoun: '75-79', form: 'soixante-quinze, -seize, -dix-sept, -dix-huit, -dix-neuf', english: 'seventy-five, etc.' }
          ]
        }
      },
      {
        title: '80-89 (Quatre-vingts)',
        content: 'Eighty system: 4 × 20',
        examples: [
          {
            spanish: 'quatre-vingts (80) - with s',
            english: 'quatre-vingt-un (81) - no s when followed by number',
            highlight: ['quatre-vingts', 'quatre-vingt-un']
          },
          {
            spanish: 'quatre-vingt-deux (82), quatre-vingt-dix (90)',
            english: 'No s when compound',
            highlight: ['quatre-vingt-deux', 'quatre-vingt-dix']
          }
        ]
      },
      {
        title: '90-99 (Quatre-vingt-dix)',
        content: 'Ninety system: 4 × 20 + 10-19',
        examples: [
          {
            spanish: 'quatre-vingt-dix (90)',
            english: 'quatre-vingt-dix-neuf (99)',
            highlight: ['quatre-vingt-dix', 'quatre-vingt-dix-neuf']
          }
        ]
      }
    ]
  },
  {
    title: 'Hundreds (Cent)',
    content: `**Cent** (hundred) with agreement rules:`,
    examples: [
      {
        spanish: 'cent (100), deux cents (200)',
        english: 'trois cents (300), quatre cents (400)',
        highlight: ['cent', 'deux cents', 'trois cents']
      }
    ],
    subsections: [
      {
        title: 'CENT Agreement',
        content: 'When cent takes s:',
        examples: [
          {
            spanish: 'cent (100) - no s when alone',
            english: 'deux cents (200) - s when multiplied',
            highlight: ['cent', 'deux cents']
          },
          {
            spanish: 'deux cent un (201) - no s when followed by number',
            english: 'trois cent cinquante (350) - no s when followed',
            highlight: ['deux cent un', 'trois cent cinquante']
          }
        ]
      },
      {
        title: 'Compound Hundreds',
        content: 'Numbers 101-999:',
        conjugationTable: {
          title: 'Hundreds Examples',
          conjugations: [
            { pronoun: '101', form: 'cent un', english: 'one hundred one' },
            { pronoun: '150', form: 'cent cinquante', english: 'one hundred fifty' },
            { pronoun: '200', form: 'deux cents', english: 'two hundred' },
            { pronoun: '250', form: 'deux cent cinquante', english: 'two hundred fifty' }
          ]
        }
      }
    ]
  },
  {
    title: 'Thousands (Mille)',
    content: `**Mille** (thousand) - invariable form:`,
    examples: [
      {
        spanish: 'mille (1,000), deux mille (2,000)',
        english: 'trois mille (3,000), dix mille (10,000)',
        highlight: ['mille', 'deux mille', 'trois mille']
      }
    ],
    subsections: [
      {
        title: 'MILLE Rules',
        content: 'Mille never changes form:',
        examples: [
          {
            spanish: 'mille (1,000) - never "un mille"',
            english: 'deux mille (2,000) - no s on mille',
            highlight: ['mille', 'deux mille']
          },
          {
            spanish: 'mille neuf cent quatre-vingt-dix-neuf (1999)',
            english: 'Complex but follows patterns',
            highlight: ['mille neuf cent quatre-vingt-dix-neuf']
          }
        ]
      },
      {
        title: 'Compound Thousands',
        content: 'Numbers with thousands:',
        examples: [
          {
            spanish: 'deux mille vingt-quatre (2024)',
            english: 'cinq mille trois cent cinquante (5350)',
            highlight: ['deux mille vingt-quatre', 'cinq mille trois cent cinquante']
          }
        ]
      }
    ]
  },
  {
    title: 'Large Numbers',
    content: `Numbers beyond thousands:`,
    subsections: [
      {
        title: 'MILLION and MILLIARD',
        content: 'Million and billion are nouns:',
        examples: [
          {
            spanish: 'un million (1,000,000) - takes un',
            english: 'deux millions (2,000,000) - takes s',
            highlight: ['un million', 'deux millions']
          },
          {
            spanish: 'un milliard (1,000,000,000) - billion',
            english: 'trois milliards (3,000,000,000)',
            highlight: ['un milliard', 'trois milliards']
          }
        ]
      },
      {
        title: 'DE with Large Numbers',
        content: 'Use de after million/milliard:',
        examples: [
          {
            spanish: 'un million de personnes (one million people)',
            english: 'deux millions d\'euros (two million euros)',
            highlight: ['million de personnes', 'millions d\'euros']
          }
        ]
      }
    ]
  },
  {
    title: 'Number Usage and Context',
    content: `How to use numbers in different contexts:`,
    examples: [
      {
        spanish: 'Il a vingt ans. (He is twenty years old.)',
        english: 'Age expression',
        highlight: ['vingt ans']
      },
      {
        spanish: 'Ça coûte quinze euros. (It costs fifteen euros.)',
        english: 'Price expression',
        highlight: ['quinze euros']
      }
    ],
    subsections: [
      {
        title: 'Numbers with Nouns',
        content: 'How numbers interact with nouns:',
        examples: [
          {
            spanish: 'deux livres (two books) - plural noun',
            english: 'un livre (one book) - singular noun',
            highlight: ['deux livres', 'un livre']
          }
        ]
      },
      {
        title: 'Approximate Numbers',
        content: 'Expressing approximate quantities:',
        examples: [
          {
            spanish: 'une dizaine (about ten)',
            english: 'une vingtaine (about twenty)',
            highlight: ['une dizaine', 'une vingtaine']
          },
          {
            spanish: 'une centaine (about a hundred)',
            english: 'des milliers (thousands)',
            highlight: ['une centaine', 'des milliers']
          }
        ]
      }
    ]
  },
  {
    title: 'Number Pronunciation and Liaison',
    content: `Important pronunciation rules:`,
    subsections: [
      {
        title: 'Liaison Rules',
        content: 'When numbers link to following words:',
        examples: [
          {
            spanish: 'deux_amis [dø.za.mi] (two friends)',
            english: 'trois_enfants [trwa.zɑ̃.fɑ̃] (three children)',
            highlight: ['deux_amis', 'trois_enfants']
          }
        ]
      },
      {
        title: 'Final Consonants',
        content: 'When to pronounce final consonants:',
        conjugationTable: {
          title: 'Pronunciation Guide',
          conjugations: [
            { pronoun: 'six, dix', form: '[sis], [dis] alone', english: '[si], [di] before consonant' },
            { pronoun: 'huit', form: '[ɥit] always', english: 'liaison [ɥi.t‿] before vowel' },
            { pronoun: 'vingt', form: '[vɛ̃] usually', english: '[vɛ̃t] in compounds' }
          ]
        }
      }
    ]
  },
  {
    title: 'Common Number Mistakes',
    content: `Here are frequent errors students make:

**1. Quatre-vingts agreement**: Forgetting to remove s in compounds
**2. Et un pattern**: Using et with 81, 91 instead of just 71, etc.
**3. Cent agreement**: Wrong s placement with hundreds
**4. Million/milliard**: Treating them as adjectives instead of nouns`,
    examples: [
      {
        spanish: '❌ quatre-vingts-un → ✅ quatre-vingt-un',
        english: 'Wrong: no s when followed by another number',
        highlight: ['quatre-vingt-un']
      },
      {
        spanish: '❌ quatre-vingt et un → ✅ quatre-vingt-un',
        english: 'Wrong: no et with 81, only with 21, 31, 41, 51, 61, 71',
        highlight: ['quatre-vingt-un']
      },
      {
        spanish: '❌ trois cents cinquante → ✅ trois cent cinquante',
        english: 'Wrong: no s on cent when followed by another number',
        highlight: ['trois cent cinquante']
      },
      {
        spanish: '❌ deux millions personnes → ✅ deux millions de personnes',
        english: 'Wrong: must use de after million/milliard',
        highlight: ['millions de personnes']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Ordinal Numbers', url: '/grammar/french/numbers/ordinal', difficulty: 'beginner' },
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time', difficulty: 'beginner' },
  { title: 'French Dates', url: '/grammar/french/expressions/dates', difficulty: 'beginner' },
  { title: 'French Money and Prices', url: '/grammar/french/expressions/money', difficulty: 'beginner' }
];

export default function FrenchCardinalNumbersPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'numbers',
              topic: 'cardinal',
              title: 'French Cardinal Numbers (Un, Deux, Trois, Vingt, Cent, Mille)',
              description: 'Master French cardinal numbers from 0 to millions. Learn pronunciation, spelling, agreement rules, and usage of French numbers.',
              difficulty: 'beginner',
              examples: [
                'un, deux, trois (one, two, three)',
                'vingt et un (twenty-one)',
                'quatre-vingts (eighty)',
                'deux cents (two hundred)',
                'mille neuf cent quatre-vingt-dix-neuf (1999)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'numbers',
              topic: 'cardinal',
              title: 'French Cardinal Numbers (Un, Deux, Trois, Vingt, Cent, Mille)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="numbers"
        topic="cardinal"
        title="French Cardinal Numbers (Un, Deux, Trois, Vingt, Cent, Mille)"
        description="Master French cardinal numbers from 0 to millions. Learn pronunciation, spelling, agreement rules, and usage of French numbers"
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/french/numbers"
        practiceUrl="/grammar/french/numbers/cardinal/practice"
        quizUrl="/grammar/french/numbers/cardinal/quiz"
        songUrl="/songs/fr?theme=grammar&topic=cardinal"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

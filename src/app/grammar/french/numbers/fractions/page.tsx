import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'numbers',
  topic: 'fractions',
  title: 'French Fractions and Decimals (Un demi, Un tiers, Virgule)',
  description: 'Master French fractions and decimals including un demi, un tiers, un quart. Learn to express parts, percentages, and decimal numbers.',
  difficulty: 'intermediate',
  keywords: [
    'french fractions',
    'un demi un tiers',
    'french decimals',
    'virgule french',
    'percentages french',
    'parts french numbers'
  ],
  examples: [
    'Un demi (one half)',
    'Un tiers (one third)',
    'Trois quarts (three quarters)',
    'Deux virgule cinq (2.5)'
  ]
});

const sections = [
  {
    title: 'Understanding French Fractions and Decimals',
    content: `French **fractions** and **decimals** express **parts of a whole** and **precise quantities**. They are essential for:

**Common uses:**
- **Cooking**: une demi-tasse (half a cup)
- **Time**: une heure et demie (an hour and a half)
- **Measurements**: deux mètres et demi (2.5 meters)
- **Statistics**: un tiers des étudiants (one third of students)
- **Prices**: trois euros cinquante (3.50 euros)

**Key differences from English:**
- **Decimal separator**: virgule (comma) instead of point
- **Fraction formation**: different patterns for common fractions
- **Agreement**: fractions can agree like adjectives

Understanding French fractions and decimals is crucial for precise communication in academic, professional, and everyday contexts.`,
    examples: [
      {
        spanish: 'J\'ai mangé la moitié du gâteau. (I ate half of the cake.)',
        english: 'Expressing parts - portion of a whole',
        highlight: ['la moitié du gâteau']
      },
      {
        spanish: 'Le prix est de quinze euros virgule quatre-vingt-dix. (The price is 15.90 euros.)',
        english: 'Decimal expression - precise amounts',
        highlight: ['quinze euros virgule quatre-vingt-dix']
      },
      {
        spanish: 'Un quart des élèves sont absents. (A quarter of the students are absent.)',
        english: 'Statistical expression - proportional relationships',
        highlight: ['Un quart des élèves']
      }
    ]
  },
  {
    title: 'Common Fractions',
    content: `The most frequently used fractions have special forms:`,
    conjugationTable: {
      title: 'Basic French Fractions',
      conjugations: [
        { pronoun: 'un demi', form: '1/2', english: 'une demi-heure (half an hour)' },
        { pronoun: 'un tiers', form: '1/3', english: 'un tiers du temps (a third of the time)' },
        { pronoun: 'un quart', form: '1/4', english: 'un quart d\'heure (a quarter hour)' },
        { pronoun: 'trois quarts', form: '3/4', english: 'trois quarts d\'heure (three quarters of an hour)' },
        { pronoun: 'un cinquième', form: '1/5', english: 'un cinquième de la population (a fifth of the population)' },
        { pronoun: 'un dixième', form: '1/10', english: 'un dixième de seconde (a tenth of a second)' }
      ]
    },
    subsections: [
      {
        title: 'Special Vocabulary',
        content: 'Alternative words for common fractions:',
        examples: [
          {
            spanish: 'la moitié = un demi (half)',
            english: 'le tiers = un tiers (third)',
            highlight: ['la moitié', 'le tiers']
          },
          {
            spanish: 'le quart = un quart (quarter)',
            english: 'Used as nouns: La moitié est partie.',
            highlight: ['le quart', 'La moitié est partie']
          }
        ]
      }
    ]
  },
  {
    title: 'UN DEMI - Half',
    content: `**UN DEMI** has several forms and uses:`,
    examples: [
      {
        spanish: 'Une demi-heure (half an hour) - hyphenated compound',
        english: 'Une heure et demie (an hour and a half) - separate word',
        highlight: ['demi-heure', 'heure et demie']
      },
      {
        spanish: 'Un demi-litre (half a liter)',
        english: 'Deux litres et demi (two and a half liters)',
        highlight: ['demi-litre', 'litres et demi']
      }
    ],
    subsections: [
      {
        title: 'DEMI as Prefix',
        content: 'Hyphenated compounds with demi-:',
        examples: [
          {
            spanish: 'une demi-bouteille (half bottle)',
            english: 'un demi-kilo (half kilo)',
            highlight: ['demi-bouteille', 'demi-kilo']
          },
          {
            spanish: 'une demi-journée (half day)',
            english: 'un demi-siècle (half century)',
            highlight: ['demi-journée', 'demi-siècle']
          }
        ]
      },
      {
        title: 'ET DEMI after Numbers',
        content: 'Adding "and a half" to quantities:',
        examples: [
          {
            spanish: 'trois heures et demie (three and a half hours)',
            english: 'cinq kilos et demi (five and a half kilos)',
            highlight: ['trois heures et demie', 'cinq kilos et demi']
          }
        ]
      },
      {
        title: 'Agreement Rules',
        content: 'DEMI agreement patterns:',
        examples: [
          {
            spanish: 'Before noun: invariable - une demi-heure',
            english: 'After noun: agrees - une heure et demie',
            highlight: ['demi-heure', 'heure et demie']
          }
        ]
      }
    ]
  },
  {
    title: 'Formation of Other Fractions',
    content: `Most fractions are formed using ordinal numbers:`,
    conjugationTable: {
      title: 'Fraction Formation Pattern',
      conjugations: [
        { pronoun: 'un + ordinal', form: 'fraction', english: 'un cinquième (1/5), un sixième (1/6)' },
        { pronoun: 'deux + ordinal', form: 'fraction', english: 'deux cinquièmes (2/5), trois sixièmes (3/6)' },
        { pronoun: 'numerator + ordinal', form: 'fraction', english: 'sept dixièmes (7/10), neuf centièmes (9/100)' }
      ]
    },
    subsections: [
      {
        title: 'Regular Pattern',
        content: 'Cardinal + ordinal formation:',
        examples: [
          {
            spanish: '2/7 = deux septièmes',
            english: '5/8 = cinq huitièmes',
            highlight: ['deux septièmes', 'cinq huitièmes']
          },
          {
            spanish: '3/10 = trois dixièmes',
            english: '7/100 = sept centièmes',
            highlight: ['trois dixièmes', 'sept centièmes']
          }
        ]
      }
    ]
  },
  {
    title: 'Decimal Numbers',
    content: `French uses **virgule** (comma) as the decimal separator:`,
    examples: [
      {
        spanish: '2,5 = deux virgule cinq (2.5)',
        english: '15,75 = quinze virgule soixante-quinze (15.75)',
        highlight: ['deux virgule cinq', 'quinze virgule soixante-quinze']
      },
      {
        spanish: '0,25 = zéro virgule vingt-cinq (0.25)',
        english: '3,14 = trois virgule quatorze (3.14)',
        highlight: ['zéro virgule vingt-cinq', 'trois virgule quatorze']
      }
    ],
    subsections: [
      {
        title: 'Reading Decimals',
        content: 'How to pronounce decimal numbers:',
        examples: [
          {
            spanish: '1,2 = un virgule deux',
            english: '10,05 = dix virgule zéro cinq',
            highlight: ['un virgule deux', 'dix virgule zéro cinq']
          }
        ]
      },
      {
        title: 'Writing Convention',
        content: 'French decimal notation:',
        examples: [
          {
            spanish: 'French: 3,14 (comma)',
            english: 'English: 3.14 (period)',
            highlight: ['3,14', '3.14']
          }
        ]
      }
    ]
  },
  {
    title: 'Percentages',
    content: `French percentages use **pour cent**:`,
    examples: [
      {
        spanish: '25% = vingt-cinq pour cent',
        english: '50% = cinquante pour cent',
        highlight: ['vingt-cinq pour cent', 'cinquante pour cent']
      },
      {
        spanish: '100% = cent pour cent',
        english: '0,5% = zéro virgule cinq pour cent',
        highlight: ['cent pour cent', 'zéro virgule cinq pour cent']
      }
    ],
    subsections: [
      {
        title: 'Percentage Expressions',
        content: 'Common percentage phrases:',
        examples: [
          {
            spanish: 'Un pourcentage élevé (a high percentage)',
            english: 'Le taux de réussite (the success rate)',
            highlight: ['pourcentage élevé', 'taux de réussite']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Expressions with Fractions',
    content: `Fractions are commonly used with time:`,
    conjugationTable: {
      title: 'Time Fractions',
      conjugations: [
        { pronoun: 'un quart d\'heure', form: '15 minutes', english: 'quarter hour' },
        { pronoun: 'une demi-heure', form: '30 minutes', english: 'half hour' },
        { pronoun: 'trois quarts d\'heure', form: '45 minutes', english: 'three quarters hour' },
        { pronoun: 'une heure et quart', form: '1:15', english: 'quarter past one' },
        { pronoun: 'une heure et demie', form: '1:30', english: 'half past one' },
        { pronoun: 'deux heures moins le quart', form: '1:45', english: 'quarter to two' }
      ]
    },
    subsections: [
      {
        title: 'Clock Time',
        content: 'Telling time with fractions:',
        examples: [
          {
            spanish: 'Il est trois heures et quart. (It\'s quarter past three.)',
            english: 'Il est midi et demi. (It\'s half past noon.)',
            highlight: ['trois heures et quart', 'midi et demi']
          }
        ]
      }
    ]
  },
  {
    title: 'Cooking and Measurements',
    content: `Fractions are essential in cooking and measurements:`,
    examples: [
      {
        spanish: 'Une demi-tasse de farine (half a cup of flour)',
        english: 'Un quart de litre de lait (a quarter liter of milk)',
        highlight: ['demi-tasse de farine', 'quart de litre de lait']
      },
      {
        spanish: 'Deux kilos et demi de pommes (2.5 kilos of apples)',
        english: 'Un tiers de cuillère à café (a third of a teaspoon)',
        highlight: ['kilos et demi', 'tiers de cuillère']
      }
    ],
    subsections: [
      {
        title: 'Recipe Language',
        content: 'Common cooking fractions:',
        examples: [
          {
            spanish: 'une demi-cuillère (half spoon)',
            english: 'un quart de tasse (quarter cup)',
            highlight: ['demi-cuillère', 'quart de tasse']
          }
        ]
      }
    ]
  },
  {
    title: 'Mathematical Operations',
    content: `Expressing mathematical operations with fractions:`,
    examples: [
      {
        spanish: 'Un tiers plus un tiers égale deux tiers. (1/3 + 1/3 = 2/3)',
        english: 'La moitié de huit est quatre. (Half of eight is four.)',
        highlight: ['Un tiers plus un tiers égale deux tiers', 'La moitié de huit est quatre']
      }
    ],
    subsections: [
      {
        title: 'Mathematical Vocabulary',
        content: 'Key terms for fraction operations:',
        examples: [
          {
            spanish: 'plus (plus), moins (minus), fois (times)',
            english: 'divisé par (divided by), égale (equals)',
            highlight: ['plus', 'divisé par']
          }
        ]
      }
    ]
  },
  {
    title: 'Money and Prices',
    content: `Using decimals with currency:`,
    examples: [
      {
        spanish: 'Trois euros cinquante (3.50 euros)',
        english: 'Quinze euros quatre-vingt-dix (15.90 euros)',
        highlight: ['Trois euros cinquante', 'Quinze euros quatre-vingt-dix']
      },
      {
        spanish: 'Un euro vingt-cinq (1.25 euros)',
        english: 'Cent euros pile (exactly 100 euros)',
        highlight: ['Un euro vingt-cinq', 'Cent euros pile']
      }
    ],
    subsections: [
      {
        title: 'Price Expressions',
        content: 'Common ways to express prices:',
        examples: [
          {
            spanish: 'Ça coûte deux euros cinquante. (It costs 2.50 euros.)',
            english: 'Le prix est de quinze euros. (The price is 15 euros.)',
            highlight: ['deux euros cinquante', 'quinze euros']
          }
        ]
      }
    ]
  },
  {
    title: 'Statistics and Proportions',
    content: `Using fractions in statistical contexts:`,
    examples: [
      {
        spanish: 'Un tiers des étudiants réussissent. (One third of students succeed.)',
        english: 'La moitié de la population vote. (Half the population votes.)',
        highlight: ['Un tiers des étudiants', 'La moitié de la population']
      },
      {
        spanish: 'Deux cinquièmes du budget (two fifths of the budget)',
        english: 'Trois quarts du temps (three quarters of the time)',
        highlight: ['Deux cinquièmes du budget', 'Trois quarts du temps']
      }
    ]
  },
  {
    title: 'Common Mistakes with Fractions',
    content: `Here are frequent errors students make:

**1. Decimal separator**: Using period instead of comma
**2. DEMI agreement**: Wrong agreement patterns with demi
**3. Fraction formation**: Incorrect ordinal number usage
**4. Time expressions**: Mixing up fraction time patterns`,
    examples: [
      {
        spanish: '❌ 2.5 → ✅ 2,5',
        english: 'Wrong: French uses comma, not period for decimals',
        highlight: ['2,5']
      },
      {
        spanish: '❌ une demie-heure → ✅ une demi-heure',
        english: 'Wrong: DEMI before noun doesn\'t agree',
        highlight: ['demi-heure']
      },
      {
        spanish: '❌ deux heures et demi → ✅ deux heures et demie',
        english: 'Wrong: DEMI after feminine noun must agree',
        highlight: ['deux heures et demie']
      },
      {
        spanish: '❌ un quatrième → ✅ un quart',
        english: 'Wrong: quarter has special form, not ordinal',
        highlight: ['un quart']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Cardinal Numbers', url: '/grammar/french/numbers/cardinal', difficulty: 'beginner' },
  { title: 'French Ordinal Numbers', url: '/grammar/french/numbers/ordinal', difficulty: 'intermediate' },
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time', difficulty: 'intermediate' },
  { title: 'French Measurements', url: '/grammar/french/expressions/measurements', difficulty: 'intermediate' }
];

export default function FrenchFractionsPage() {
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
              topic: 'fractions',
              title: 'French Fractions and Decimals (Un demi, Un tiers, Virgule)',
              description: 'Master French fractions and decimals including un demi, un tiers, un quart. Learn to express parts, percentages, and decimal numbers.',
              difficulty: 'intermediate',
              examples: [
                'Un demi (one half)',
                'Un tiers (one third)',
                'Trois quarts (three quarters)',
                'Deux virgule cinq (2.5)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'numbers',
              topic: 'fractions',
              title: 'French Fractions and Decimals (Un demi, Un tiers, Virgule)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="numbers"
        topic="fractions"
        title="French Fractions and Decimals (Un demi, Un tiers, Virgule)"
        description="Master French fractions and decimals including un demi, un tiers, un quart. Learn to express parts, percentages, and decimal numbers"
        difficulty="intermediate"
        estimatedTime={13}
        sections={sections}
        backUrl="/grammar/french/numbers"
        practiceUrl="/grammar/french/numbers/fractions/practice"
        quizUrl="/grammar/french/numbers/fractions/quiz"
        songUrl="/songs/fr?theme=grammar&topic=fractions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

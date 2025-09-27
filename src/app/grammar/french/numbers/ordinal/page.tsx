import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'numbers',
  topic: 'ordinal',
  title: 'French Ordinal Numbers (Premier, Deuxième, Troisième)',
  description: 'Master French ordinal numbers for expressing order and sequence. Learn premier, deuxième, troisième with agreement and usage rules.',
  difficulty: 'beginner',
  keywords: [
    'french ordinal numbers',
    'premier deuxième troisième',
    'first second third french',
    'order sequence french',
    'ranking french numbers',
    'french ordinals agreement'
  ],
  examples: [
    'le premier étudiant (the first student)',
    'la deuxième fois (the second time)',
    'au troisième étage (on the third floor)',
    'le vingt et unième siècle (the twenty-first century)'
  ]
});

const sections = [
  {
    title: 'Understanding French Ordinal Numbers',
    content: `French ordinal numbers express **order**, **sequence**, and **ranking**. They answer the question "lequel?" (which one?) or "en quelle position?" (in what position?).

Unlike cardinal numbers, ordinal numbers:
**Agree in gender and number** with the noun they modify
**Use specific forms** for first and second
**Follow regular patterns** for most numbers
**Require definite articles** in most contexts

Ordinal numbers are essential for dates, rankings, floors, and sequential descriptions.`,
    examples: [
      {
        spanish: 'C\'est le premier jour. (It\'s the first day.)',
        english: 'Expressing sequence',
        highlight: ['le premier jour']
      },
      {
        spanish: 'Elle habite au deuxième étage. (She lives on the second floor.)',
        english: 'Describing location',
        highlight: ['au deuxième étage']
      },
      {
        spanish: 'C\'est ma troisième tentative. (It\'s my third attempt.)',
        english: 'Counting attempts',
        highlight: ['troisième tentative']
      }
    ]
  },
  {
    title: 'PREMIER/PREMIÈRE - First',
    content: `**Premier** (first) is irregular and agrees in gender and number:`,
    examples: [
      {
        spanish: 'le premier étudiant (the first student - masculine)',
        english: 'la première étudiante (the first student - feminine)',
        highlight: ['le premier', 'la première']
      },
      {
        spanish: 'les premiers résultats (the first results - masculine plural)',
        english: 'les premières fois (the first times - feminine plural)',
        highlight: ['les premiers', 'les premières']
      }
    ],
    subsections: [
      {
        title: 'PREMIER Agreement',
        content: 'All forms of premier:',
        conjugationTable: {
          title: 'Premier Agreement',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'premier', english: 'le premier livre (the first book)' },
            { pronoun: 'Feminine singular', form: 'première', english: 'la première page (the first page)' },
            { pronoun: 'Masculine plural', form: 'premiers', english: 'les premiers jours (the first days)' },
            { pronoun: 'Feminine plural', form: 'premières', english: 'les premières années (the first years)' }
          ]
        }
      },
      {
        title: 'Common PREMIER Expressions',
        content: 'Frequent uses of premier:',
        examples: [
          {
            spanish: 'au premier étage (on the first floor)',
            english: 'en première classe (in first class)',
            highlight: ['au premier étage', 'en première classe']
          },
          {
            spanish: 'le premier ministre (the prime minister)',
            english: 'la première fois (the first time)',
            highlight: ['le premier ministre', 'la première fois']
          }
        ]
      }
    ]
  },
  {
    title: 'SECOND/SECONDE vs DEUXIÈME',
    content: `French has two words for "second": **second/seconde** and **deuxième**:`,
    examples: [
      {
        spanish: 'la seconde guerre mondiale (World War II)',
        english: 'le deuxième étage (the second floor)',
        highlight: ['la seconde guerre', 'le deuxième étage']
      }
    ],
    subsections: [
      {
        title: 'SECOND vs DEUXIÈME Usage',
        content: 'When to use each form:',
        examples: [
          {
            spanish: 'Second/seconde: when there are only two items total',
            english: 'Deuxième: when there are more than two items or in a series',
            highlight: ['Second/seconde', 'Deuxième']
          },
          {
            spanish: 'la seconde main (the second hand - of two hands)',
            english: 'le deuxième chapitre (the second chapter - of many)',
            highlight: ['la seconde main', 'le deuxième chapitre']
          }
        ]
      },
      {
        title: 'SECOND Agreement',
        content: 'Second agrees like an adjective:',
        conjugationTable: {
          title: 'Second Agreement',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'second', english: 'le second fils (the second son)' },
            { pronoun: 'Feminine singular', form: 'seconde', english: 'la seconde fille (the second daughter)' },
            { pronoun: 'Masculine plural', form: 'seconds', english: 'les seconds rôles (the second roles)' },
            { pronoun: 'Feminine plural', form: 'secondes', english: 'les secondes chances (the second chances)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Regular Ordinal Formation',
    content: `Most ordinal numbers are formed by adding **-ième** to the cardinal number:`,
    examples: [
      {
        spanish: 'trois → troisième (third)',
        english: 'quatre → quatrième (fourth)',
        highlight: ['troisième', 'quatrième']
      },
      {
        spanish: 'cinq → cinquième (fifth)',
        english: 'six → sixième (sixth)',
        highlight: ['cinquième', 'sixième']
      }
    ],
    subsections: [
      {
        title: 'Formation Rules',
        content: 'How to form regular ordinals:',
        examples: [
          {
            spanish: 'Drop final -e: quatre → quatrième (not quatreième)',
            english: 'Add -ième: sept → septième',
            highlight: ['quatrième', 'septième']
          },
          {
            spanish: 'Special changes: cinq → cinquième (add u)',
            english: 'neuf → neuvième (f → v)',
            highlight: ['cinquième', 'neuvième']
          }
        ]
      },
      {
        title: 'Numbers 3-19',
        content: 'Common ordinals to memorize:',
        conjugationTable: {
          title: 'Ordinals 3-19',
          conjugations: [
            { pronoun: '3rd-6th', form: 'troisième, quatrième, cinquième, sixième', english: 'third, fourth, fifth, sixth' },
            { pronoun: '7th-10th', form: 'septième, huitième, neuvième, dixième', english: 'seventh, eighth, ninth, tenth' },
            { pronoun: '11th-15th', form: 'onzième, douzième, treizième, quatorzième, quinzième', english: 'eleventh through fifteenth' },
            { pronoun: '16th-19th', form: 'seizième, dix-septième, dix-huitième, dix-neuvième', english: 'sixteenth through nineteenth' }
          ]
        }
      }
    ]
  },
  {
    title: 'Ordinals 20 and Above',
    content: `Ordinals for larger numbers follow the same -ième pattern:`,
    examples: [
      {
        spanish: 'vingt → vingtième (twentieth)',
        english: 'trente → trentième (thirtieth)',
        highlight: ['vingtième', 'trentième']
      },
      {
        spanish: 'cent → centième (hundredth)',
        english: 'mille → millième (thousandth)',
        highlight: ['centième', 'millième']
      }
    ],
    subsections: [
      {
        title: 'Compound Ordinals',
        content: 'Only the last number becomes ordinal:',
        examples: [
          {
            spanish: 'vingt et un → vingt et unième (twenty-first)',
            english: 'trente-deux → trente-deuxième (thirty-second)',
            highlight: ['vingt et unième', 'trente-deuxième']
          },
          {
            spanish: 'quatre-vingt-dix → quatre-vingt-dixième (ninetieth)',
            english: 'cent un → cent unième (hundred and first)',
            highlight: ['quatre-vingt-dixième', 'cent unième']
          }
        ]
      },
      {
        title: 'Large Number Ordinals',
        content: 'Ordinals with hundreds and thousands:',
        examples: [
          {
            spanish: 'deux cents → deux centième (two hundredth)',
            english: 'trois mille → trois millième (three thousandth)',
            highlight: ['deux centième', 'trois millième']
          }
        ]
      }
    ]
  },
  {
    title: 'Ordinal Agreement Rules',
    content: `Most ordinals are **invariable** (don't change form):`,
    examples: [
      {
        spanish: 'le troisième livre, la troisième page (same form)',
        english: 'les troisième et quatrième chapitres (same forms)',
        highlight: ['troisième livre', 'troisième page']
      }
    ],
    subsections: [
      {
        title: 'Invariable Ordinals',
        content: 'Most ordinals never change:',
        examples: [
          {
            spanish: 'le cinquième jour, la cinquième semaine',
            english: 'les cinquième et sixième mois',
            highlight: ['cinquième jour', 'cinquième semaine']
          }
        ]
      },
      {
        title: 'Variable Ordinals',
        content: 'Only premier and second agree:',
        conjugationTable: {
          title: 'Agreement Summary',
          conjugations: [
            { pronoun: 'premier', form: 'agrees fully', english: 'premier/première/premiers/premières' },
            { pronoun: 'second', form: 'agrees fully', english: 'second/seconde/seconds/secondes' },
            { pronoun: 'all others', form: 'invariable', english: 'troisième, quatrième, etc.' }
          ]
        }
      }
    ]
  },
  {
    title: 'Ordinals in Context',
    content: `Common uses of ordinal numbers:`,
    subsections: [
      {
        title: 'Dates',
        content: 'Ordinals in dates (only for first of month):',
        examples: [
          {
            spanish: 'le premier janvier (January 1st)',
            english: 'le deux janvier (January 2nd - cardinal, not deuxième)',
            highlight: ['le premier janvier', 'le deux janvier']
          }
        ]
      },
      {
        title: 'Floors and Levels',
        content: 'Building floors use ordinals:',
        examples: [
          {
            spanish: 'au rez-de-chaussée (ground floor)',
            english: 'au premier étage (first floor = second floor US)',
            highlight: ['au rez-de-chaussée', 'au premier étage']
          },
          {
            spanish: 'au deuxième étage (second floor = third floor US)',
            english: 'French counting starts from rez-de-chaussée',
            highlight: ['au deuxième étage']
          }
        ]
      },
      {
        title: 'Centuries',
        content: 'Centuries use ordinal numbers:',
        examples: [
          {
            spanish: 'le vingtième siècle (the twentieth century)',
            english: 'le vingt et unième siècle (the twenty-first century)',
            highlight: ['le vingtième siècle', 'le vingt et unième siècle']
          }
        ]
      },
      {
        title: 'Rankings and Competitions',
        content: 'Expressing position in competitions:',
        examples: [
          {
            spanish: 'Il est arrivé premier. (He came first.)',
            english: 'Elle est troisième au classement. (She is third in the ranking.)',
            highlight: ['arrivé premier', 'troisième au classement']
          }
        ]
      }
    ]
  },
  {
    title: 'Fractions and Ordinals',
    content: `Ordinals are used in fractions:`,
    examples: [
      {
        spanish: 'un tiers (one third)',
        english: 'un quart (one quarter)',
        highlight: ['un tiers', 'un quart']
      },
      {
        spanish: 'un cinquième (one fifth)',
        english: 'trois dixièmes (three tenths)',
        highlight: ['un cinquième', 'trois dixièmes']
      }
    ],
    subsections: [
      {
        title: 'Special Fraction Forms',
        content: 'Irregular fraction names:',
        examples: [
          {
            spanish: '1/2: un demi, une demie (not un deuxième)',
            english: '1/3: un tiers (not un troisième)',
            highlight: ['un demi', 'un tiers']
          },
          {
            spanish: '1/4: un quart (not un quatrième)',
            english: 'Regular: un cinquième, un sixième, etc.',
            highlight: ['un quart', 'un cinquième']
          }
        ]
      }
    ]
  },
  {
    title: 'Abbreviations and Writing',
    content: `How to write ordinals in abbreviated form:`,
    examples: [
      {
        spanish: '1er (premier), 1re (première)',
        english: '2e (deuxième), 3e (troisième)',
        highlight: ['1er', '1re', '2e', '3e']
      }
    ],
    subsections: [
      {
        title: 'Abbreviation Rules',
        content: 'Standard abbreviations:',
        conjugationTable: {
          title: 'Ordinal Abbreviations',
          conjugations: [
            { pronoun: '1st', form: '1er (masc), 1re (fem)', english: 'premier, première' },
            { pronoun: '2nd', form: '2e', english: 'deuxième' },
            { pronoun: '3rd+', form: '3e, 4e, 5e, etc.', english: 'troisième, quatrième, cinquième' },
            { pronoun: 'Plural', form: '1ers, 1res, 2es, etc.', english: 'premiers, premières, deuxièmes' }
          ]
        }
      }
    ]
  },
  {
    title: 'Common Ordinal Number Mistakes',
    content: `Here are frequent errors students make:

**1. Agreement errors**: Making all ordinals agree like premier
**2. Formation mistakes**: Adding -ième to wrong forms
**3. Date confusion**: Using ordinals for all dates instead of just first
**4. Floor numbering**: Forgetting French ground floor system`,
    examples: [
      {
        spanish: '❌ la troisièmes fois → ✅ la troisième fois',
        english: 'Wrong: ordinals except premier/second don\'t agree',
        highlight: ['la troisième fois']
      },
      {
        spanish: '❌ quatreième → ✅ quatrième',
        english: 'Wrong: drop final -e before adding -ième',
        highlight: ['quatrième']
      },
      {
        spanish: '❌ le deuxième janvier → ✅ le deux janvier',
        english: 'Wrong: only first of month uses ordinal',
        highlight: ['le deux janvier']
      },
      {
        spanish: '❌ second floor = deuxième étage → ✅ second floor = premier étage',
        english: 'Wrong: French ground floor ≠ first floor',
        highlight: ['premier étage']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Cardinal Numbers', url: '/grammar/french/numbers/cardinal', difficulty: 'beginner' },
  { title: 'French Dates', url: '/grammar/french/expressions/dates', difficulty: 'beginner' },
  { title: 'French Fractions', url: '/grammar/french/numbers/fractions', difficulty: 'intermediate' },
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time', difficulty: 'beginner' }
];

export default function FrenchOrdinalNumbersPage() {
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
              topic: 'ordinal',
              title: 'French Ordinal Numbers (Premier, Deuxième, Troisième)',
              description: 'Master French ordinal numbers for expressing order and sequence. Learn premier, deuxième, troisième with agreement and usage rules.',
              difficulty: 'beginner',
              examples: [
                'le premier étudiant (the first student)',
                'la deuxième fois (the second time)',
                'au troisième étage (on the third floor)',
                'le vingt et unième siècle (the twenty-first century)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'numbers',
              topic: 'ordinal',
              title: 'French Ordinal Numbers (Premier, Deuxième, Troisième)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="numbers"
        topic="ordinal"
        title="French Ordinal Numbers (Premier, Deuxième, Troisième)"
        description="Master French ordinal numbers for expressing order and sequence. Learn premier, deuxième, troisième with agreement and usage rules"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/numbers"
        practiceUrl="/grammar/french/numbers/ordinal/practice"
        quizUrl="/grammar/french/numbers/ordinal/quiz"
        songUrl="/songs/fr?theme=grammar&topic=ordinal"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

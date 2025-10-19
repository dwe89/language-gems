import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'nouns',
  topic: 'noun-agreement-patterns',
  title: 'French Noun Agreement Patterns (Complex Agreement Rules)',
  description: 'Master complex French noun agreement patterns including collective nouns, compound subjects, and special agreement cases.',
  difficulty: 'intermediate',
  keywords: [
    'french noun agreement patterns',
    'complex agreement french',
    'collective nouns french',
    'compound subjects french',
    'agreement rules french',
    'advanced french grammar'
  ],
  examples: [
    'La plupart des étudiants sont... (Most students are...)',
    'Pierre et Marie sont partis. (Pierre and Marie left.)',
    'Une dizaine de personnes étaient... (About ten people were...)',
    'Ni lui ni elle ne vient. (Neither he nor she is coming.)'
  ]
});

const sections = [
  {
    title: 'Understanding Complex Noun Agreement Patterns',
    content: `Beyond basic gender and number agreement, French has **complex agreement patterns** that involve:

**Advanced agreement situations:**
- **Collective nouns**: la plupart, une dizaine, un groupe
- **Compound subjects**: Pierre et Marie, ni...ni, soit...soit
- **Quantity expressions**: beaucoup de, peu de, assez de
- **Fractions and percentages**: la moitié de, 50% des
- **Special cases**: proximity agreement, semantic agreement

These patterns require understanding **meaning-based agreement** versus **grammatical agreement**, and knowing when **proximity** or **logic** determines the agreement.

Mastering these patterns is essential for advanced French proficiency and natural expression.`,
    examples: [
      {
        spanish: 'La plupart des étudiants sont intelligents. (Most students are intelligent.)',
        english: 'Collective noun "plupart" triggers plural agreement',
        highlight: ['La plupart des étudiants sont']
      },
      {
        spanish: 'Pierre et sa sœur sont arrivés. (Pierre and his sister arrived.)',
        english: 'Mixed gender compound subject takes masculine plural',
        highlight: ['Pierre et sa sœur sont arrivés']
      },
      {
        spanish: 'Une dizaine de personnes étaient présentes. (About ten people were present.)',
        english: 'Quantity expression triggers plural agreement',
        highlight: ['Une dizaine de personnes étaient']
      }
    ]
  },
  {
    title: 'Collective Nouns and Agreement',
    content: `Collective nouns can trigger **singular** or **plural** agreement depending on meaning:`,
    conjugationTable: {
      title: 'Collective Noun Agreement Patterns',
      conjugations: [
        { pronoun: 'la plupart de', form: 'plural agreement', english: 'La plupart des gens pensent que...' },
        { pronoun: 'la majorité de', form: 'singular/plural', english: 'La majorité vote/votent' },
        { pronoun: 'un groupe de', form: 'singular/plural', english: 'Un groupe d\'étudiants arrive/arrivent' },
        { pronoun: 'une foule de', form: 'singular/plural', english: 'Une foule de gens crie/crient' },
        { pronoun: 'le reste de', form: 'depends on complement', english: 'Le reste des pommes est/sont...' },
        { pronoun: 'une partie de', form: 'depends on complement', english: 'Une partie des livres est/sont...' }
      ]
    },
    subsections: [
      {
        title: 'LA PLUPART DE - Always Plural',
        content: 'Always triggers plural agreement:',
        examples: [
          {
            spanish: 'La plupart des étudiants sont français. (Most students are French.)',
            english: 'La plupart du temps passe vite. (Most of the time passes quickly.)',
            highlight: ['La plupart des étudiants sont', 'La plupart du temps passe']
          }
        ]
      },
      {
        title: 'Flexible Collective Nouns',
        content: 'Can take singular or plural depending on emphasis:',
        examples: [
          {
            spanish: 'La majorité vote. (The majority votes.) - Focus on group as unit',
            english: 'La majorité votent. (The majority vote.) - Focus on individuals',
            highlight: ['La majorité vote', 'La majorité votent']
          }
        ]
      }
    ]
  },
  {
    title: 'Compound Subjects',
    content: `Multiple subjects connected by conjunctions follow specific agreement rules:`,
    examples: [
      {
        spanish: 'Pierre et Marie sont partis. (Pierre and Marie left.)',
        english: 'Mixed gender takes masculine plural agreement',
        highlight: ['Pierre et Marie sont partis']
      },
      {
        spanish: 'Le père et la mère travaillent. (The father and mother work.)',
        english: 'Multiple subjects = plural agreement',
        highlight: ['Le père et la mère travaillent']
      }
    ],
    subsections: [
      {
        title: 'ET (And) - Plural Agreement',
        content: 'Subjects joined by ET take plural:',
        examples: [
          {
            spanish: 'Paul et Jean sont amis. (Paul and Jean are friends.)',
            english: 'Marie et Sophie sont parties. (Marie and Sophie left.)',
            highlight: ['Paul et Jean sont', 'Marie et Sophie sont parties']
          }
        ]
      },
      {
        title: 'Mixed Gender with ET',
        content: 'Masculine takes precedence:',
        examples: [
          {
            spanish: 'Marie et Pierre sont français. (Marie and Pierre are French.)',
            english: 'Even one masculine makes the group masculine',
            highlight: ['Marie et Pierre sont français']
          }
        ]
      }
    ]
  },
  {
    title: 'NI...NI (Neither...Nor) Agreement',
    content: `NI...NI can take **singular** or **plural** agreement:`,
    examples: [
      {
        spanish: 'Ni Pierre ni Marie ne vient. (Neither Pierre nor Marie is coming.) - Singular',
        english: 'Ni Pierre ni Marie ne viennent. (Neither Pierre nor Marie are coming.) - Plural',
        highlight: ['Ni Pierre ni Marie ne vient', 'Ni Pierre ni Marie ne viennent']
      }
    ],
    subsections: [
      {
        title: 'Singular Agreement (Traditional)',
        content: 'Emphasizes individual negation:',
        examples: [
          {
            spanish: 'Ni lui ni elle ne comprend. (Neither he nor she understands.)',
            english: 'Focus on each person individually not understanding',
            highlight: ['Ni lui ni elle ne comprend']
          }
        ]
      },
      {
        title: 'Plural Agreement (Modern)',
        content: 'Treats as compound subject:',
        examples: [
          {
            spanish: 'Ni Paul ni Jean ne viennent. (Neither Paul nor Jean are coming.)',
            english: 'Modern tendency toward plural agreement',
            highlight: ['Ni Paul ni Jean ne viennent']
          }
        ]
      }
    ]
  },
  {
    title: 'Quantity Expressions',
    content: `Expressions of quantity affect agreement patterns:`,
    conjugationTable: {
      title: 'Quantity Expression Agreement',
      conjugations: [
        { pronoun: 'beaucoup de', form: 'plural', english: 'Beaucoup d\'étudiants sont...' },
        { pronoun: 'peu de', form: 'plural', english: 'Peu de gens savent...' },
        { pronoun: 'assez de', form: 'plural', english: 'Assez de personnes viennent...' },
        { pronoun: 'trop de', form: 'plural', english: 'Trop de voitures polluent...' },
        { pronoun: 'une dizaine de', form: 'plural', english: 'Une dizaine de personnes étaient...' },
        { pronoun: 'une centaine de', form: 'plural', english: 'Une centaine d\'étudiants participent...' }
      ]
    },
    subsections: [
      {
        title: 'Adverbial Quantities',
        content: 'Beaucoup, peu, assez, trop + DE:',
        examples: [
          {
            spanish: 'Beaucoup d\'étudiants travaillent. (Many students work.)',
            english: 'Peu de gens comprennent. (Few people understand.)',
            highlight: ['Beaucoup d\'étudiants travaillent', 'Peu de gens comprennent']
          }
        ]
      },
      {
        title: 'Approximate Numbers',
        content: 'Une dizaine, une centaine, etc.:',
        examples: [
          {
            spanish: 'Une vingtaine de personnes sont venues. (About twenty people came.)',
            english: 'Une centaine d\'étudiants participent. (About a hundred students participate.)',
            highlight: ['Une vingtaine de personnes sont venues', 'Une centaine d\'étudiants participent']
          }
        ]
      }
    ]
  },
  {
    title: 'Fractions and Percentages',
    content: `Fractions and percentages follow specific agreement rules:`,
    examples: [
      {
        spanish: 'La moitié des étudiants sont absents. (Half the students are absent.)',
        english: '50% des gens pensent que... (50% of people think that...)',
        highlight: ['La moitié des étudiants sont', '50% des gens pensent']
      },
      {
        spanish: 'Un tiers de la population vote. (A third of the population votes.)',
        english: 'Deux tiers des électeurs ont voté. (Two thirds of voters voted.)',
        highlight: ['Un tiers de la population vote', 'Deux tiers des électeurs ont voté']
      }
    ],
    subsections: [
      {
        title: 'LA MOITIÉ DE',
        content: 'Agreement depends on the complement:',
        examples: [
          {
            spanish: 'La moitié du gâteau est mangée. (Half the cake is eaten.) - Singular complement',
            english: 'La moitié des invités sont partis. (Half the guests left.) - Plural complement',
            highlight: ['La moitié du gâteau est', 'La moitié des invités sont']
          }
        ]
      },
      {
        title: 'Percentages',
        content: 'Usually plural agreement:',
        examples: [
          {
            spanish: '75% des étudiants réussissent. (75% of students succeed.)',
            english: '20% de la population vit... (20% of the population lives...)',
            highlight: ['75% des étudiants réussissent', '20% de la population vit']
          }
        ]
      }
    ]
  },
  {
    title: 'Proximity Agreement',
    content: `Sometimes agreement follows the **nearest noun** rather than grammatical rules:`,
    examples: [
      {
        spanish: 'C\'est moi qui ai raison. (It\'s me who is right.)',
        english: 'Agreement with "moi" (first person) not "qui"',
        highlight: ['C\'est moi qui ai raison']
      },
      {
        spanish: 'C\'est nous qui sommes responsables. (It\'s us who are responsible.)',
        english: 'Agreement with "nous" (first person plural)',
        highlight: ['C\'est nous qui sommes responsables']
      }
    ],
    subsections: [
      {
        title: 'C\'est...qui Constructions',
        content: 'Agreement with the emphasized element:',
        examples: [
          {
            spanish: 'C\'est toi qui as tort. (It\'s you who are wrong.)',
            english: 'C\'est eux qui ont gagné. (It\'s them who won.)',
            highlight: ['C\'est toi qui as tort', 'C\'est eux qui ont gagné']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement with Titles and Proper Nouns',
    content: `Special agreement rules for titles and names:`,
    examples: [
      {
        spanish: '« Les Misérables » est un roman célèbre. (Les Misérables is a famous novel.)',
        english: 'Title treated as singular despite plural form',
        highlight: ['« Les Misérables » est un roman']
      },
      {
        spanish: 'Les États-Unis sont un pays riche. (The United States is a rich country.)',
        english: 'Country name with plural form takes plural agreement',
        highlight: ['Les États-Unis sont un pays']
      }
    ],
    subsections: [
      {
        title: 'Book/Movie Titles',
        content: 'Usually singular agreement:',
        examples: [
          {
            spanish: '« Les Trois Mousquetaires » raconte... (The Three Musketeers tells...)',
            english: 'Title as a unit takes singular verb',
            highlight: ['« Les Trois Mousquetaires » raconte']
          }
        ]
      },
      {
        title: 'Country Names',
        content: 'Agreement matches the form:',
        examples: [
          {
            spanish: 'Les Pays-Bas sont... (The Netherlands is/are...)',
            english: 'Plural form country takes plural agreement',
            highlight: ['Les Pays-Bas sont']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement with Infinitives and Clauses',
    content: `Infinitives and clauses as subjects take singular agreement:`,
    examples: [
      {
        spanish: 'Parler français est difficile. (Speaking French is difficult.)',
        english: 'Infinitive subject = singular agreement',
        highlight: ['Parler français est difficile']
      },
      {
        spanish: 'Que tu viennes me fait plaisir. (That you come pleases me.)',
        english: 'Clause subject = singular agreement',
        highlight: ['Que tu viennes me fait plaisir']
      }
    ]
  },
  {
    title: 'Regional and Stylistic Variations',
    content: `Agreement patterns can vary by region and style:`,
    subsections: [
      {
        title: 'Formal vs Informal',
        content: 'Formal French stricter with agreement:',
        examples: [
          {
            spanish: 'Formal: La majorité des députés vote.',
            english: 'Informal: La majorité des députés votent.',
            highlight: ['La majorité des députés vote', 'La majorité des députés votent']
          }
        ]
      },
      {
        title: 'Regional Differences',
        content: 'Some variation in collective noun agreement:',
        examples: [
          {
            spanish: 'France: Un groupe d\'étudiants arrive.',
            english: 'Quebec: Un groupe d\'étudiants arrivent.',
            highlight: ['Un groupe d\'étudiants arrive', 'Un groupe d\'étudiants arrivent']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Complex Agreement Mistakes',
    content: `Here are frequent errors with complex agreement:

**1. Collective noun confusion**: Wrong agreement with collective nouns
**2. Mixed gender errors**: Not using masculine for mixed groups
**3. Quantity expression mistakes**: Wrong agreement with quantity words
**4. Proximity errors**: Following wrong noun for agreement`,
    examples: [
      {
        spanish: '❌ La plupart des gens pense → ✅ La plupart des gens pensent',
        english: 'Wrong: "plupart" always takes plural agreement',
        highlight: ['La plupart des gens pensent']
      },
      {
        spanish: '❌ Pierre et Marie sont parties → ✅ Pierre et Marie sont partis',
        english: 'Wrong: mixed gender takes masculine plural',
        highlight: ['Pierre et Marie sont partis']
      },
      {
        spanish: '❌ Beaucoup de gens pense → ✅ Beaucoup de gens pensent',
        english: 'Wrong: quantity expressions take plural agreement',
        highlight: ['Beaucoup de gens pensent']
      },
      {
        spanish: '❌ Un groupe d\'étudiants français arrive → ✅ Un groupe d\'étudiants français arrive',
        english: 'Wrong: agreement with "groupe" not "étudiants"',
        highlight: ['Un groupe d\'étudiants français arrive']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Gender and Number', url: '/grammar/french/nouns/gender-number', difficulty: 'beginner' },
  { title: 'French Collective Nouns', url: '/grammar/french/nouns/collective-nouns', difficulty: 'intermediate' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'intermediate' },
  { title: 'French Complex Sentences', url: '/grammar/french/syntax/complex-sentences', difficulty: 'advanced' }
];

export default function FrenchNounAgreementPatternsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'nouns',
              topic: 'noun-agreement-patterns',
              title: 'French Noun Agreement Patterns (Complex Agreement Rules)',
              description: 'Master complex French noun agreement patterns including collective nouns, compound subjects, and special agreement cases.',
              difficulty: 'intermediate',
              examples: [
                'La plupart des étudiants sont... (Most students are...)',
                'Pierre et Marie sont partis. (Pierre and Marie left.)',
                'Une dizaine de personnes étaient... (About ten people were...)',
                'Ni lui ni elle ne vient. (Neither he nor she is coming.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'nouns',
              topic: 'noun-agreement-patterns',
              title: 'French Noun Agreement Patterns (Complex Agreement Rules)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="nouns"
        topic="noun-agreement-patterns"
        title="French Noun Agreement Patterns (Complex Agreement Rules)"
        description="Master complex French noun agreement patterns including collective nouns, compound subjects, and special agreement cases"
        difficulty="intermediate"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/french/nouns"
        practiceUrl="/grammar/french/nouns/noun-agreement-patterns/practice"
        quizUrl="/grammar/french/nouns/noun-agreement-patterns/quiz"
        songUrl="/songs/fr?theme=grammar&topic=noun-agreement-patterns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

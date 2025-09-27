import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'nouns',
  topic: 'gender-number',
  title: 'French Gender and Number Agreement (Masculine, Feminine, Singular, Plural)',
  description: 'Master French gender and number agreement including masculine/feminine patterns, singular/plural formation, and agreement rules.',
  difficulty: 'beginner',
  keywords: [
    'french gender number',
    'masculine feminine french',
    'singular plural french',
    'french noun agreement',
    'gender patterns french',
    'number agreement french'
  ],
  examples: [
    'Un chat noir → Des chats noirs (A black cat → Black cats)',
    'Une voiture rouge → Des voitures rouges (A red car → Red cars)',
    'Le petit garçon → Les petits garçons (The little boy → The little boys)',
    'La grande maison → Les grandes maisons (The big house → The big houses)'
  ]
});

const sections = [
  {
    title: 'Understanding French Gender and Number',
    content: `French nouns have **two genders** (masculine/feminine) and **two numbers** (singular/plural). These characteristics affect **all related words** including articles, adjectives, and sometimes verbs.

**Gender (le genre):**
- **Masculine**: le, un, ce, mon
- **Feminine**: la, une, cette, ma

**Number (le nombre):**
- **Singular**: one item
- **Plural**: multiple items

**Agreement principle:**
All words that modify or relate to a noun must **agree** in gender and number. This creates a **chain of agreement** throughout the sentence.

Understanding gender and number is fundamental to French grammar because it affects every aspect of sentence construction.`,
    examples: [
      {
        spanish: 'Un petit chat noir (A small black cat) - Masculine singular',
        english: 'All words agree: un (masc. sing.), petit (masc. sing.), chat (masc. sing.), noir (masc. sing.)',
        highlight: ['Un petit chat noir']
      },
      {
        spanish: 'Des petites voitures rouges (Small red cars) - Feminine plural',
        english: 'All words agree: des (plural), petites (fem. plural), voitures (fem. plural), rouges (plural)',
        highlight: ['Des petites voitures rouges']
      }
    ]
  },
  {
    title: 'Gender Patterns and Recognition',
    content: `While French gender can seem arbitrary, there are **helpful patterns**:`,
    conjugationTable: {
      title: 'Common Gender Patterns',
      conjugations: [
        { pronoun: 'Masculine endings', form: '-age, -isme, -ment', english: 'le voyage, le tourisme, le moment' },
        { pronoun: 'Feminine endings', form: '-tion, -sion, -té', english: 'la nation, la passion, la beauté' },
        { pronoun: 'Masculine', form: '-eau, -eu', english: 'le bateau, le feu' },
        { pronoun: 'Feminine', form: '-ure, -ence, -ance', english: 'la nature, la science, la chance' },
        { pronoun: 'Usually masculine', form: 'days, months, seasons', english: 'le lundi, janvier, le printemps' },
        { pronoun: 'Usually feminine', form: 'countries ending in -e', english: 'la France, la Chine' }
      ]
    },
    subsections: [
      {
        title: 'Reliable Masculine Patterns',
        content: 'Endings that are almost always masculine:',
        examples: [
          {
            spanish: '-age: le garage, le fromage, le voyage',
            english: '-ment: le moment, le document, le gouvernement',
            highlight: ['le garage', 'le moment']
          }
        ]
      },
      {
        title: 'Reliable Feminine Patterns',
        content: 'Endings that are almost always feminine:',
        examples: [
          {
            spanish: '-tion: la nation, la station, la création',
            english: '-té: la beauté, la liberté, la vérité',
            highlight: ['la nation', 'la beauté']
          }
        ]
      },
      {
        title: 'Exceptions to Learn',
        content: 'Important exceptions to memorize:',
        examples: [
          {
            spanish: 'Feminine -age: la page, la plage, la cage',
            english: 'Masculine -té: le côté, le comité, le traité',
            highlight: ['la page', 'le côté']
          }
        ]
      }
    ]
  },
  {
    title: 'Number Formation: Singular to Plural',
    content: `French plural formation follows **regular patterns** with some exceptions:`,
    conjugationTable: {
      title: 'Plural Formation Rules',
      conjugations: [
        { pronoun: 'Regular', form: '+ s', english: 'chat → chats, maison → maisons' },
        { pronoun: 'Ends in -s, -x, -z', form: 'no change', english: 'fils → fils, prix → prix, nez → nez' },
        { pronoun: 'Ends in -eau, -eu', form: '+ x', english: 'bateau → bateaux, feu → feux' },
        { pronoun: 'Ends in -al', form: '→ -aux', english: 'animal → animaux, journal → journaux' },
        { pronoun: 'Some -ou', form: '→ -oux', english: 'bijou → bijoux, chou → choux' },
        { pronoun: 'Irregular', form: 'special forms', english: 'œil → yeux, monsieur → messieurs' }
      ]
    },
    subsections: [
      {
        title: 'Regular Plural (+s)',
        content: 'Most nouns simply add -s:',
        examples: [
          {
            spanish: 'le livre → les livres (books)',
            english: 'la table → les tables (tables)',
            highlight: ['les livres', 'les tables']
          }
        ]
      },
      {
        title: 'No Change Plurals',
        content: 'Words ending in -s, -x, -z stay the same:',
        examples: [
          {
            spanish: 'le fils → les fils (sons)',
            english: 'le prix → les prix (prices)',
            highlight: ['les fils', 'les prix']
          }
        ]
      },
      {
        title: 'Special Plural Endings',
        content: 'Specific ending changes:',
        examples: [
          {
            spanish: 'le bateau → les bateaux (boats)',
            english: 'l\'animal → les animaux (animals)',
            highlight: ['les bateaux', 'les animaux']
          }
        ]
      }
    ]
  },
  {
    title: 'Article Agreement',
    content: `Articles must agree with noun gender and number:`,
    conjugationTable: {
      title: 'Article Agreement Patterns',
      conjugations: [
        { pronoun: 'Definite', form: 'le/la/les', english: 'le chat, la maison, les chats, les maisons' },
        { pronoun: 'Indefinite', form: 'un/une/des', english: 'un chat, une maison, des chats, des maisons' },
        { pronoun: 'Partitive', form: 'du/de la/des', english: 'du pain, de la confiture, des fruits' },
        { pronoun: 'Demonstrative', form: 'ce/cette/ces', english: 'ce chat, cette maison, ces chats/maisons' },
        { pronoun: 'Possessive', form: 'mon/ma/mes', english: 'mon chat, ma maison, mes chats/maisons' }
      ]
    },
    subsections: [
      {
        title: 'Definite Articles',
        content: 'The most common article pattern:',
        examples: [
          {
            spanish: 'Masculine: le chat → les chats',
            english: 'Feminine: la voiture → les voitures',
            highlight: ['le chat → les chats', 'la voiture → les voitures']
          }
        ]
      },
      {
        title: 'Special Cases',
        content: 'Articles before vowels and h:',
        examples: [
          {
            spanish: 'l\'homme → les hommes (masculine)',
            english: 'l\'école → les écoles (feminine)',
            highlight: ['l\'homme → les hommes', 'l\'école → les écoles']
          }
        ]
      }
    ]
  },
  {
    title: 'Adjective Agreement',
    content: `Adjectives must agree in **both gender and number** with the nouns they modify:`,
    examples: [
      {
        spanish: 'Un chat noir → Des chats noirs (masculine)',
        english: 'Une voiture noire → Des voitures noires (feminine)',
        highlight: ['Un chat noir → Des chats noirs', 'Une voiture noire → Des voitures noires']
      },
      {
        spanish: 'Le petit garçon → Les petits garçons',
        english: 'La petite fille → Les petites filles',
        highlight: ['Le petit garçon → Les petits garçons', 'La petite fille → Les petites filles']
      }
    ],
    subsections: [
      {
        title: 'Regular Adjective Agreement',
        content: 'Standard agreement patterns:',
        conjugationTable: {
          title: 'Adjective Agreement Forms',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'petit', english: 'un petit chat' },
            { pronoun: 'Feminine singular', form: 'petite', english: 'une petite maison' },
            { pronoun: 'Masculine plural', form: 'petits', english: 'des petits chats' },
            { pronoun: 'Feminine plural', form: 'petites', english: 'des petites maisons' }
          ]
        }
      },
      {
        title: 'Irregular Adjective Agreement',
        content: 'Some adjectives have irregular forms:',
        examples: [
          {
            spanish: 'beau → belle → beaux → belles',
            english: 'vieux → vieille → vieux → vieilles',
            highlight: ['beau → belle', 'vieux → vieille']
          }
        ]
      }
    ]
  },
  {
    title: 'Complex Agreement Chains',
    content: `In complex sentences, agreement affects multiple words:`,
    examples: [
      {
        spanish: 'Ces belles voitures rouges sont chères. (These beautiful red cars are expensive.)',
        english: 'All words agree with "voitures" (feminine plural): ces, belles, rouges, chères',
        highlight: ['Ces belles voitures rouges sont chères']
      },
      {
        spanish: 'Mes nouveaux amis français sont sympathiques. (My new French friends are nice.)',
        english: 'All words agree with "amis" (masculine plural): mes, nouveaux, français, sympathiques',
        highlight: ['Mes nouveaux amis français sont sympathiques']
      }
    ],
    subsections: [
      {
        title: 'Multiple Adjectives',
        content: 'When several adjectives modify one noun:',
        examples: [
          {
            spanish: 'Une grande maison blanche et moderne (A big white and modern house)',
            english: 'All adjectives agree with "maison" (feminine singular)',
            highlight: ['Une grande maison blanche et moderne']
          }
        ]
      }
    ]
  },
  {
    title: 'Mixed Gender Agreement',
    content: `When referring to **mixed gender groups**, use **masculine plural**:`,
    examples: [
      {
        spanish: 'Pierre et Marie sont français. (Pierre and Marie are French.)',
        english: 'Masculine plural "français" for mixed group',
        highlight: ['sont français']
      },
      {
        spanish: 'Les étudiants et les étudiantes sont intelligents. (The male and female students are intelligent.)',
        english: 'Masculine plural "intelligents" for mixed group',
        highlight: ['sont intelligents']
      }
    ],
    subsections: [
      {
        title: 'Mixed Group Rule',
        content: 'Masculine takes precedence in mixed groups:',
        examples: [
          {
            spanish: '10 femmes + 1 homme = ils (masculine plural)',
            english: 'Even one masculine element makes the group masculine',
            highlight: ['ils (masculine plural)']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement with Compound Nouns',
    content: `Compound nouns follow specific agreement rules:`,
    examples: [
      {
        spanish: 'des grands-mères (grandmothers) - Both parts agree',
        english: 'des tire-bouchons (corkscrews) - Only noun part agrees',
        highlight: ['des grands-mères', 'des tire-bouchons']
      }
    ],
    subsections: [
      {
        title: 'Noun + Noun Compounds',
        content: 'Both elements usually agree:',
        examples: [
          {
            spanish: 'un grand-père → des grands-pères',
            english: 'une belle-mère → des belles-mères',
            highlight: ['des grands-pères', 'des belles-mères']
          }
        ]
      },
      {
        title: 'Verb + Noun Compounds',
        content: 'Only the noun part agrees:',
        examples: [
          {
            spanish: 'un tire-bouchon → des tire-bouchons',
            english: 'un porte-clés → des porte-clés',
            highlight: ['des tire-bouchons', 'des porte-clés']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement in Different Tenses',
    content: `Gender and number agreement applies across all tenses:`,
    examples: [
      {
        spanish: 'Elle était petite. → Elles étaient petites. (She was small. → They were small.)',
        english: 'Il sera grand. → Ils seront grands. (He will be tall. → They will be tall.)',
        highlight: ['Elle était petite → Elles étaient petites', 'Il sera grand → Ils seront grands']
      }
    ],
    subsections: [
      {
        title: 'Past Participle Agreement',
        content: 'With être, past participles agree:',
        examples: [
          {
            spanish: 'Elle est partie. → Elles sont parties.',
            english: 'Il est venu. → Ils sont venus.',
            highlight: ['Elle est partie → Elles sont parties', 'Il est venu → Ils sont venus']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Agreement Mistakes',
    content: `Here are frequent errors students make:

**1. Forgetting adjective agreement**: Not making adjectives agree with nouns
**2. Wrong plural formation**: Incorrect plural endings
**3. Mixed gender confusion**: Wrong agreement with mixed groups
**4. Article disagreement**: Articles not matching noun gender/number`,
    examples: [
      {
        spanish: '❌ une voiture rouge → ✅ une voiture rouge',
        english: 'Wrong: adjective must agree with feminine noun',
        highlight: ['une voiture rouge']
      },
      {
        spanish: '❌ des animaux → ✅ des animaux',
        english: 'Wrong: -al becomes -aux in plural',
        highlight: ['des animaux']
      },
      {
        spanish: '❌ Pierre et Marie sont françaises → ✅ Pierre et Marie sont français',
        english: 'Wrong: mixed group takes masculine plural',
        highlight: ['sont français']
      },
      {
        spanish: '❌ le maison → ✅ la maison',
        english: 'Wrong: article must match noun gender',
        highlight: ['la maison']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Gender Rules', url: '/grammar/french/nouns/gender-rules', difficulty: 'beginner' },
  { title: 'French Plural Formation', url: '/grammar/french/nouns/plural-formation', difficulty: 'beginner' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'intermediate' },
  { title: 'French Articles', url: '/grammar/french/nouns/definite-articles', difficulty: 'beginner' }
];

export default function FrenchGenderNumberPage() {
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
              topic: 'gender-number',
              title: 'French Gender and Number Agreement (Masculine, Feminine, Singular, Plural)',
              description: 'Master French gender and number agreement including masculine/feminine patterns, singular/plural formation, and agreement rules.',
              difficulty: 'beginner',
              examples: [
                'Un chat noir → Des chats noirs (A black cat → Black cats)',
                'Une voiture rouge → Des voitures rouges (A red car → Red cars)',
                'Le petit garçon → Les petits garçons (The little boy → The little boys)',
                'La grande maison → Les grandes maisons (The big house → The big houses)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'nouns',
              topic: 'gender-number',
              title: 'French Gender and Number Agreement (Masculine, Feminine, Singular, Plural)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="nouns"
        topic="gender-number"
        title="French Gender and Number Agreement (Masculine, Feminine, Singular, Plural)"
        description="Master French gender and number agreement including masculine/feminine patterns, singular/plural formation, and agreement rules"
        difficulty="beginner"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/french/nouns"
        practiceUrl="/grammar/french/nouns/gender-number/practice"
        quizUrl="/grammar/french/nouns/gender-number/quiz"
        songUrl="/songs/fr?theme=grammar&topic=gender-number"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'nouns',
  topic: 'contractions',
  title: 'French Contractions (Au, Du, Des, Aux)',
  description: 'Master French contractions with prepositions à and de. Learn au, du, des, aux formation and usage rules.',
  difficulty: 'intermediate',
  keywords: [
    'french contractions',
    'au du des aux',
    'french prepositions',
    'à de contractions',
    'french grammar contractions',
    'preposition article contractions'
  ],
  examples: [
    'Je vais au cinéma (I go to the cinema)',
    'Il vient du bureau (He comes from the office)',
    'Elle parle aux enfants (She talks to the children)',
    'C\'est le livre des étudiants (It\'s the students\' book)'
  ]
});

const sections = [
  {
    title: 'Understanding French Contractions',
    content: `French contractions are **mandatory combinations** of prepositions with definite articles. When the prepositions **à** (to/at) and **de** (of/from) meet certain definite articles, they must contract.

These contractions are not optional - they are required in French grammar. Using the separate forms (à le, de le) is grammatically incorrect.

The contractions create new words: **au**, **du**, **des**, and **aux**.`,
    examples: [
      {
        spanish: '❌ Je vais à le cinéma → ✅ Je vais au cinéma',
        english: 'Wrong: à le → Right: au (to the cinema)',
        highlight: ['au cinéma']
      },
      {
        spanish: '❌ Il vient de le bureau → ✅ Il vient du bureau',
        english: 'Wrong: de le → Right: du (from the office)',
        highlight: ['du bureau']
      }
    ]
  },
  {
    title: 'Contractions with À (to/at)',
    content: `The preposition **à** contracts with **le** and **les**, but not with **la** or **l\'**.`,
    subsections: [
      {
        title: 'À + Definite Articles',
        content: 'Here are all combinations of à with definite articles:',
        conjugationTable: {
          title: 'À + Article Contractions',
          conjugations: [
            { pronoun: 'à + le', form: '= au', english: 'au restaurant (to the restaurant)' },
            { pronoun: 'à + la', form: '= à la', english: 'à la maison (to the house)' },
            { pronoun: 'à + l\'', form: '= à l\'', english: 'à l\'école (to the school)' },
            { pronoun: 'à + les', form: '= aux', english: 'aux enfants (to the children)' }
          ]
        }
      },
      {
        title: 'Common Uses of À Contractions',
        content: 'These contractions appear in many everyday expressions:',
        examples: [
          {
            spanish: 'aller au cinéma (to go to the cinema)',
            english: 'parler aux professeurs (to talk to the teachers)',
            highlight: ['au cinéma', 'aux professeurs']
          },
          {
            spanish: 'jouer au football (to play soccer)',
            english: 'penser aux vacances (to think about vacation)',
            highlight: ['au football', 'aux vacances']
          },
          {
            spanish: 'être au bureau (to be at the office)',
            english: 'donner aux pauvres (to give to the poor)',
            highlight: ['au bureau', 'aux pauvres']
          }
        ]
      }
    ]
  },
  {
    title: 'Contractions with DE (of/from)',
    content: `The preposition **de** contracts with **le** and **les**, but not with **la** or **l\'**.`,
    subsections: [
      {
        title: 'DE + Definite Articles',
        content: 'Here are all combinations of de with definite articles:',
        conjugationTable: {
          title: 'DE + Article Contractions',
          conjugations: [
            { pronoun: 'de + le', form: '= du', english: 'du pain (some bread)' },
            { pronoun: 'de + la', form: '= de la', english: 'de la musique (some music)' },
            { pronoun: 'de + l\'', form: '= de l\'', english: 'de l\'eau (some water)' },
            { pronoun: 'de + les', form: '= des', english: 'des livres (some books)' }
          ]
        }
      },
      {
        title: 'DE Contractions: Multiple Uses',
        content: 'DE contractions serve different grammatical functions:',
        examples: [
          {
            spanish: 'Partitive: Je mange du chocolat. (I eat chocolate.)',
            english: 'Expressing "some" with uncountable nouns',
            highlight: ['du chocolat']
          },
          {
            spanish: 'Possession: C\'est le livre du professeur. (It\'s the teacher\'s book.)',
            english: 'Showing possession or belonging',
            highlight: ['du professeur']
          },
          {
            spanish: 'Origin: Il vient du Canada. (He comes from Canada.)',
            english: 'Expressing origin or source',
            highlight: ['du Canada']
          },
          {
            spanish: 'Plural indefinite: des enfants (some children)',
            english: 'Plural form of indefinite articles',
            highlight: ['des enfants']
          }
        ]
      }
    ]
  },
  {
    title: 'When NOT to Contract',
    content: `Contractions only occur with **definite articles**. They do not happen with other words that might look similar.`,
    examples: [
      {
        spanish: 'à un ami (to a friend) - no contraction with indefinite',
        english: 'de une heure (from one hour) - no contraction with numbers',
        highlight: ['à un', 'de une']
      },
      {
        spanish: 'à cette école (to this school) - no contraction with demonstrative',
        english: 'de mon père (from my father) - no contraction with possessive',
        highlight: ['à cette', 'de mon']
      }
    ],
    subsections: [
      {
        title: 'No Contraction Examples',
        content: 'These combinations do NOT contract:',
        conjugationTable: {
          title: 'No Contractions',
          conjugations: [
            { pronoun: 'à + un/une', form: 'à un/une', english: 'à un ami (to a friend)' },
            { pronoun: 'de + un/une', form: 'de un/une', english: 'de une heure (from one o\'clock)' },
            { pronoun: 'à + ce/cette', form: 'à ce/cette', english: 'à cette école (to this school)' },
            { pronoun: 'de + mon/ma', form: 'de mon/ma', english: 'de ma mère (from my mother)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Contractions in Context',
    content: `Understanding how contractions work in real sentences and expressions:`,
    examples: [
      {
        spanish: 'Je vais au marché pour acheter des légumes.',
        english: 'I go to the market to buy vegetables.',
        highlight: ['au marché', 'des légumes']
      },
      {
        spanish: 'Les clés du professeur sont sur la table.',
        english: 'The teacher\'s keys are on the table.',
        highlight: ['du professeur']
      },
      {
        spanish: 'Elle parle aux étudiants de l\'université.',
        english: 'She talks to the university students.',
        highlight: ['aux étudiants', 'de l\'université']
      }
    ],
    subsections: [
      {
        title: 'Fixed Expressions with Contractions',
        content: 'Many common expressions use contractions:',
        examples: [
          {
            spanish: 'jouer du piano (to play piano)',
            english: 'avoir besoin des livres (to need books)',
            highlight: ['du piano', 'des livres']
          },
          {
            spanish: 'parler au téléphone (to talk on the phone)',
            english: 'aller aux toilettes (to go to the bathroom)',
            highlight: ['au téléphone', 'aux toilettes']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronunciation of Contractions',
    content: `French contractions have specific pronunciation patterns:

**au** [o] - like "oh"
**du** [dy] - like "due" 
**des** [de] - like "day"
**aux** [o] - like "oh" (same as au)

The pronunciation is different from saying the separate words.`,
    examples: [
      {
        spanish: 'au cinéma [o see-nay-MAH]',
        english: 'du pain [dy pan]',
        highlight: ['au', 'du']
      },
      {
        spanish: 'des livres [day LEE-vruh]',
        english: 'aux enfants [o ahn-FAHN]',
        highlight: ['des', 'aux']
      }
    ]
  },
  {
    title: 'Common Mistakes to Avoid',
    content: `Here are frequent errors students make with French contractions:

**1. Not contracting**: Using à le instead of au
**2. Wrong contractions**: Contracting with wrong articles
**3. Over-contracting**: Trying to contract with indefinite articles
**4. Pronunciation errors**: Mispronouncing contracted forms`,
    examples: [
      {
        spanish: '❌ Je vais à le magasin → ✅ Je vais au magasin',
        english: 'Wrong: must contract à + le = au',
        highlight: ['au magasin']
      },
      {
        spanish: '❌ de la → du → ✅ de la (no change)',
        english: 'Wrong: de + la doesn\'t contract',
        highlight: ['de la']
      },
      {
        spanish: '❌ à une → au → ✅ à une (no change)',
        english: 'Wrong: only contracts with definite articles',
        highlight: ['à une']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Definite Articles', url: '/grammar/french/nouns/definite-articles', difficulty: 'beginner' },
  { title: 'French Partitive Articles', url: '/grammar/french/nouns/partitive-articles', difficulty: 'intermediate' },
  { title: 'French Prepositions', url: '/grammar/french/prepositions/common-prepositions', difficulty: 'intermediate' },
  { title: 'French Possession', url: '/grammar/french/expressions/possession', difficulty: 'intermediate' }
];

export default function FrenchContractionsPage() {
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
              topic: 'contractions',
              title: 'French Contractions (Au, Du, Des, Aux)',
              description: 'Master French contractions with prepositions à and de. Learn au, du, des, aux formation and usage rules.',
              difficulty: 'intermediate',
              examples: [
                'Je vais au cinéma (I go to the cinema)',
                'Il vient du bureau (He comes from the office)',
                'Elle parle aux enfants (She talks to the children)',
                'C\'est le livre des étudiants (It\'s the students\' book)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'nouns',
              topic: 'contractions',
              title: 'French Contractions (Au, Du, Des, Aux)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="nouns"
        topic="contractions"
        title="French Contractions (Au, Du, Des, Aux)"
        description="Master French contractions with prepositions à and de. Learn au, du, des, aux formation and usage rules"
        difficulty="intermediate"
        estimatedTime={8}
        sections={sections}
        backUrl="/grammar/french/nouns"
        practiceUrl="/grammar/french/nouns/contractions/practice"
        quizUrl="/grammar/french/nouns/contractions/quiz"
        songUrl="/songs/fr?theme=grammar&topic=contractions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

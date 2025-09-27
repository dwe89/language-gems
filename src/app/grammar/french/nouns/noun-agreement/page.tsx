import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'nouns',
  topic: 'noun-agreement',
  title: 'French Noun Agreement Rules',
  description: 'Master French noun agreement with articles, adjectives, and verbs. Learn gender and number agreement patterns and exceptions.',
  difficulty: 'intermediate',
  keywords: [
    'french noun agreement',
    'french agreement rules',
    'gender agreement french',
    'number agreement french',
    'french grammar agreement',
    'adjective noun agreement'
  ],
  examples: [
    'une grande maison (a big house)',
    'des petits chats (some small cats)',
    'les nouvelles voitures (the new cars)',
    'cette belle femme (this beautiful woman)'
  ]
});

const sections = [
  {
    title: 'Understanding French Agreement',
    content: `French noun agreement is a fundamental concept where **articles**, **adjectives**, and sometimes **verbs** must match the **gender** (masculine/feminine) and **number** (singular/plural) of the noun they relate to.

This agreement system ensures grammatical harmony throughout the sentence and is essential for correct French.

Unlike English, where adjectives don't change form, French requires constant attention to agreement patterns.`,
    examples: [
      {
        spanish: 'un petit chat (a small cat - masculine singular)',
        english: 'une petite chatte (a small female cat - feminine singular)',
        highlight: ['petit', 'petite']
      },
      {
        spanish: 'des grands arbres (some big trees - masculine plural)',
        english: 'des grandes maisons (some big houses - feminine plural)',
        highlight: ['grands', 'grandes']
      }
    ]
  },
  {
    title: 'Article Agreement with Nouns',
    content: `Articles must always agree with their nouns in gender and number. This is the most basic form of agreement.`,
    subsections: [
      {
        title: 'Definite Article Agreement',
        content: 'Definite articles change based on noun characteristics:',
        conjugationTable: {
          title: 'Definite Article Agreement',
          conjugations: [
            { pronoun: 'Masculine Singular', form: 'le livre', english: 'the book' },
            { pronoun: 'Feminine Singular', form: 'la table', english: 'the table' },
            { pronoun: 'Before Vowel', form: 'l\'ami', english: 'the friend' },
            { pronoun: 'Plural (both)', form: 'les livres/tables', english: 'the books/tables' }
          ]
        }
      },
      {
        title: 'Indefinite Article Agreement',
        content: 'Indefinite articles also change with gender and number:',
        conjugationTable: {
          title: 'Indefinite Article Agreement',
          conjugations: [
            { pronoun: 'Masculine Singular', form: 'un chat', english: 'a cat' },
            { pronoun: 'Feminine Singular', form: 'une chaise', english: 'a chair' },
            { pronoun: 'Plural (both)', form: 'des chats/chaises', english: 'some cats/chairs' }
          ]
        }
      },
      {
        title: 'Partitive Article Agreement',
        content: 'Partitive articles follow the same gender patterns:',
        examples: [
          {
            spanish: 'du pain (some bread - masculine)',
            english: 'de la viande (some meat - feminine)',
            highlight: ['du', 'de la']
          },
          {
            spanish: 'de l\'eau (some water - before vowel)',
            english: 'des légumes (some vegetables - plural)',
            highlight: ['de l\'', 'des']
          }
        ]
      }
    ]
  },
  {
    title: 'Adjective Agreement with Nouns',
    content: `Adjectives must agree in both gender and number with the nouns they modify. This creates four possible forms for most adjectives.`,
    subsections: [
      {
        title: 'Regular Adjective Agreement',
        content: 'Most adjectives follow predictable patterns:',
        conjugationTable: {
          title: 'Regular Adjective Agreement (petit)',
          conjugations: [
            { pronoun: 'Masculine Singular', form: 'un petit chat', english: 'a small cat' },
            { pronoun: 'Feminine Singular', form: 'une petite chatte', english: 'a small female cat' },
            { pronoun: 'Masculine Plural', form: 'des petits chats', english: 'some small cats' },
            { pronoun: 'Feminine Plural', form: 'des petites chattes', english: 'some small female cats' }
          ]
        }
      },
      {
        title: 'Adjective Agreement Patterns',
        content: 'Different adjectives have different agreement patterns:',
        examples: [
          {
            spanish: 'grand/grande/grands/grandes (big)',
            english: 'Regular pattern: add -e for feminine, -s for plural',
            highlight: ['grand', 'grande', 'grands', 'grandes']
          },
          {
            spanish: 'heureux/heureuse/heureux/heureuses (happy)',
            english: '-eux → -euse for feminine',
            highlight: ['heureux', 'heureuse']
          },
          {
            spanish: 'blanc/blanche/blancs/blanches (white)',
            english: '-c → -che for feminine',
            highlight: ['blanc', 'blanche']
          }
        ]
      }
    ]
  },
  {
    title: 'Position and Agreement',
    content: `Adjective agreement works regardless of whether the adjective comes before or after the noun.

**Before the noun**: BAGS adjectives (Beauty, Age, Goodness, Size)
**After the noun**: Most other adjectives

Agreement rules remain the same in both positions.`,
    examples: [
      {
        spanish: 'une belle maison (a beautiful house - before)',
        english: 'une maison moderne (a modern house - after)',
        highlight: ['belle', 'moderne']
      },
      {
        spanish: 'de vieux arbres (some old trees - before)',
        english: 'des arbres verts (some green trees - after)',
        highlight: ['vieux', 'verts']
      },
      {
        spanish: 'les grandes voitures rouges (the big red cars)',
        english: 'Both adjectives agree with feminine plural noun',
        highlight: ['grandes', 'rouges']
      }
    ]
  },
  {
    title: 'Special Agreement Cases',
    content: `Some situations require special attention to agreement rules:`,
    subsections: [
      {
        title: 'Multiple Adjectives',
        content: 'When multiple adjectives modify one noun, each must agree:',
        examples: [
          {
            spanish: 'une petite voiture rouge (a small red car)',
            english: 'Both adjectives agree with feminine singular',
            highlight: ['petite', 'rouge']
          },
          {
            spanish: 'des grandes maisons blanches (some big white houses)',
            english: 'Both adjectives agree with feminine plural',
            highlight: ['grandes', 'blanches']
          }
        ]
      },
      {
        title: 'Compound Nouns',
        content: 'Agreement with compound nouns follows the main noun:',
        examples: [
          {
            spanish: 'une grand-mère gentille (a kind grandmother)',
            english: 'Adjective agrees with the feminine noun',
            highlight: ['gentille']
          }
        ]
      },
      {
        title: 'Invariable Adjectives',
        content: 'Some adjectives never change form:',
        examples: [
          {
            spanish: 'des voitures marron (some brown cars)',
            english: 'Color adjectives like marron don\'t change',
            highlight: ['marron']
          },
          {
            spanish: 'des filles super (some great girls)',
            english: 'Informal adjectives like super don\'t change',
            highlight: ['super']
          }
        ]
      }
    ]
  },
  {
    title: 'Verb Agreement with Nouns',
    content: `Verbs must agree with their subjects in number (and sometimes gender with past participles).`,
    examples: [
      {
        spanish: 'Le chat mange. (The cat eats.)',
        english: 'Les chats mangent. (The cats eat.)',
        highlight: ['mange', 'mangent']
      },
      {
        spanish: 'Elle est partie. (She left.)',
        english: 'Elles sont parties. (They left.)',
        highlight: ['partie', 'parties']
      }
    ],
    subsections: [
      {
        title: 'Past Participle Agreement',
        content: 'Past participles agree in specific situations:',
        examples: [
          {
            spanish: 'Elle est arrivée. (She arrived - with être)',
            english: 'Past participle agrees with subject',
            highlight: ['arrivée']
          },
          {
            spanish: 'Les lettres qu\'il a écrites. (The letters he wrote)',
            english: 'Agreement when direct object precedes',
            highlight: ['écrites']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Agreement Mistakes',
    content: `Here are frequent errors students make with French agreement:

**1. Forgetting feminine forms**: Using masculine adjectives with feminine nouns
**2. Missing plural agreement**: Not making adjectives plural
**3. Wrong article gender**: Using le with feminine nouns
**4. Inconsistent agreement**: Some elements agree, others don't`,
    examples: [
      {
        spanish: '❌ une grand maison → ✅ une grande maison',
        english: 'Wrong: adjective must be feminine',
        highlight: ['grande']
      },
      {
        spanish: '❌ des petit chats → ✅ des petits chats',
        english: 'Wrong: adjective must be plural',
        highlight: ['petits']
      },
      {
        spanish: '❌ le table → ✅ la table',
        english: 'Wrong: table is feminine',
        highlight: ['la']
      },
      {
        spanish: '❌ les grande voitures → ✅ les grandes voitures',
        english: 'Wrong: adjective must agree in number',
        highlight: ['grandes']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Gender Rules', url: '/grammar/french/nouns/gender-rules', difficulty: 'beginner' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'beginner' },
  { title: 'French Articles', url: '/grammar/french/nouns/definite-articles', difficulty: 'beginner' },
  { title: 'French Plural Formation', url: '/grammar/french/nouns/plural-formation', difficulty: 'beginner' }
];

export default function FrenchNounAgreementPage() {
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
              topic: 'noun-agreement',
              title: 'French Noun Agreement Rules',
              description: 'Master French noun agreement with articles, adjectives, and verbs. Learn gender and number agreement patterns and exceptions.',
              difficulty: 'intermediate',
              examples: [
                'une grande maison (a big house)',
                'des petits chats (some small cats)',
                'les nouvelles voitures (the new cars)',
                'cette belle femme (this beautiful woman)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'nouns',
              topic: 'noun-agreement',
              title: 'French Noun Agreement Rules'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="nouns"
        topic="noun-agreement"
        title="French Noun Agreement Rules"
        description="Master French noun agreement with articles, adjectives, and verbs. Learn gender and number agreement patterns and exceptions"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/nouns"
        practiceUrl="/grammar/french/nouns/noun-agreement/practice"
        quizUrl="/grammar/french/nouns/noun-agreement/quiz"
        songUrl="/songs/fr?theme=grammar&topic=noun-agreement"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

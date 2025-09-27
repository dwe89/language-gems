import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'nouns',
  topic: 'definite-articles',
  title: 'French Definite Articles (Le, La, Les)',
  description: 'Master French definite articles le, la, les with gender agreement, contractions, and usage rules. Complete guide with examples.',
  difficulty: 'beginner',
  keywords: [
    'french definite articles',
    'le la les french',
    'french articles',
    'du des au aux',
    'french contractions',
    'french grammar articles'
  ],
  examples: [
    'le livre (the book)',
    'la table (the table)',
    'les enfants (the children)',
    'du pain (some bread - contraction)'
  ]
});

const sections = [
  {
    title: 'Understanding Definite Articles',
    content: `French definite articles correspond to "the" in English, but they must **agree** with the gender and number of the noun they modify.

French has four definite articles: **le** (masculine singular), **la** (feminine singular), **l'** (before vowels), and **les** (plural).

Unlike English "the," French definite articles change form based on the noun's characteristics.`,
    examples: [
      {
        spanish: 'le garçon (the boy - masculine singular)',
        english: 'la fille (the girl - feminine singular)',
        highlight: ['le', 'la']
      },
      {
        spanish: 'les garçons (the boys - masculine plural)',
        english: 'les filles (the girls - feminine plural)',
        highlight: ['les']
      },
      {
        spanish: 'l\'homme (the man - before vowel)',
        english: 'l\'école (the school - before vowel)',
        highlight: ['l\'homme', 'l\'école']
      }
    ]
  },
  {
    title: 'The Four Definite Articles',
    content: `Each definite article has a specific use based on gender and number:`,
    subsections: [
      {
        title: 'Complete Definite Article System',
        content: 'Here are all French definite articles with their uses:',
        conjugationTable: {
          title: 'French Definite Articles',
          conjugations: [
            { pronoun: 'le', form: 'masculine singular', english: 'le livre (the book)' },
            { pronoun: 'la', form: 'feminine singular', english: 'la table (the table)' },
            { pronoun: 'l\'', form: 'before vowel/h', english: 'l\'ami (the friend)' },
            { pronoun: 'les', form: 'plural (both genders)', english: 'les livres (the books)' }
          ]
        }
      },
      {
        title: 'L\' Before Vowels and Silent H',
        content: 'Both le and la become l\' before words starting with vowels or silent h:',
        examples: [
          {
            spanish: 'le + ami = l\'ami (the friend)',
            english: 'la + école = l\'école (the school)',
            highlight: ['l\'ami', 'l\'école']
          },
          {
            spanish: 'le + hôtel = l\'hôtel (the hotel)',
            english: 'la + histoire = l\'histoire (the story)',
            highlight: ['l\'hôtel', 'l\'histoire']
          }
        ]
      }
    ]
  },
  {
    title: 'Contractions with Prepositions',
    content: `French definite articles **contract** (combine) with certain prepositions. This is mandatory, not optional.

The prepositions **à** (to/at) and **de** (of/from) contract with le and les:`,
    subsections: [
      {
        title: 'Contractions with À (to/at)',
        content: 'À contracts with le and les but not with la or l\':',
        conjugationTable: {
          title: 'À + Definite Articles',
          conjugations: [
            { pronoun: 'à + le', form: '= au', english: 'au cinéma (to the cinema)' },
            { pronoun: 'à + la', form: '= à la', english: 'à la maison (to the house)' },
            { pronoun: 'à + l\'', form: '= à l\'', english: 'à l\'école (to the school)' },
            { pronoun: 'à + les', form: '= aux', english: 'aux enfants (to the children)' }
          ]
        }
      },
      {
        title: 'Contractions with DE (of/from)',
        content: 'De contracts with le and les but not with la or l\':',
        conjugationTable: {
          title: 'DE + Definite Articles',
          conjugations: [
            { pronoun: 'de + le', form: '= du', english: 'du pain (some bread)' },
            { pronoun: 'de + la', form: '= de la', english: 'de la musique (some music)' },
            { pronoun: 'de + l\'', form: '= de l\'', english: 'de l\'eau (some water)' },
            { pronoun: 'de + les', form: '= des', english: 'des livres (some books)' }
          ]
        }
      }
    ]
  },
  {
    title: 'When to Use Definite Articles',
    content: `French uses definite articles more frequently than English. They are required in several situations where English omits "the":`,
    examples: [
      {
        spanish: 'J\'aime le chocolat. (I like chocolate.)',
        english: 'General preferences - French requires the article',
        highlight: ['le chocolat']
      },
      {
        spanish: 'Le français est difficile. (French is difficult.)',
        english: 'Languages as subjects - French requires the article',
        highlight: ['Le français']
      },
      {
        spanish: 'Les enfants aiment jouer. (Children like to play.)',
        english: 'General statements - French requires the article',
        highlight: ['Les enfants']
      }
    ],
    subsections: [
      {
        title: 'Specific Uses of Definite Articles',
        content: 'French definite articles are used in these situations:',
        examples: [
          {
            spanish: 'Days: Le lundi, je travaille. (On Mondays, I work.)',
            english: 'Habitual actions on specific days',
            highlight: ['Le lundi']
          },
          {
            spanish: 'Body parts: Je me lave les mains. (I wash my hands.)',
            english: 'Body parts with reflexive verbs',
            highlight: ['les mains']
          },
          {
            spanish: 'Countries: La France est belle. (France is beautiful.)',
            english: 'Most countries (exceptions: en France)',
            highlight: ['La France']
          },
          {
            spanish: 'Abstract concepts: L\'amour est important. (Love is important.)',
            english: 'Abstract nouns in general statements',
            highlight: ['L\'amour']
          }
        ]
      }
    ]
  },
  {
    title: 'When NOT to Use Definite Articles',
    content: `There are specific cases where French omits definite articles:`,
    examples: [
      {
        spanish: 'Je suis professeur. (I am a teacher.)',
        english: 'Professions after être (without adjective)',
        highlight: ['professeur']
      },
      {
        spanish: 'Il habite en France. (He lives in France.)',
        english: 'Feminine countries with en',
        highlight: ['en France']
      },
      {
        spanish: 'Avec plaisir! (With pleasure!)',
        english: 'Fixed expressions',
        highlight: ['avec plaisir']
      },
      {
        spanish: 'Je n\'ai pas de voiture. (I don\'t have a car.)',
        english: 'After negative expressions (de replaces articles)',
        highlight: ['de voiture']
      }
    ]
  },
  {
    title: 'Common Mistakes to Avoid',
    content: `Here are frequent errors students make with definite articles:

**1. Forgetting contractions**: Using "à le" instead of "au"
**2. Wrong gender**: Using "le" with feminine nouns
**3. Missing articles**: Omitting articles where French requires them
**4. Overusing articles**: Adding articles where French omits them`,
    examples: [
      {
        spanish: '❌ Je vais à le cinéma. → ✅ Je vais au cinéma.',
        english: 'Wrong: I go to the cinema → Right: I go to the cinema',
        highlight: ['au cinéma']
      },
      {
        spanish: '❌ Le table est grande. → ✅ La table est grande.',
        english: 'Wrong: The table is big → Right: The table is big',
        highlight: ['La table']
      },
      {
        spanish: '❌ J\'aime chocolat. → ✅ J\'aime le chocolat.',
        english: 'Wrong: I like chocolate → Right: I like chocolate',
        highlight: ['le chocolat']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Gender Rules', url: '/grammar/french/nouns/gender-rules', difficulty: 'beginner' },
  { title: 'French Indefinite Articles', url: '/grammar/french/nouns/indefinite-articles', difficulty: 'beginner' },
  { title: 'French Partitive Articles', url: '/grammar/french/nouns/partitive-articles', difficulty: 'intermediate' },
  { title: 'French Contractions', url: '/grammar/french/nouns/contractions', difficulty: 'intermediate' }
];

export default function FrenchDefiniteArticlesPage() {
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
              topic: 'definite-articles',
              title: 'French Definite Articles (Le, La, Les)',
              description: 'Master French definite articles le, la, les with gender agreement, contractions, and usage rules.',
              difficulty: 'beginner',
              examples: [
                'le livre (the book)',
                'la table (the table)',
                'les enfants (the children)',
                'du pain (some bread - contraction)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'nouns',
              topic: 'definite-articles',
              title: 'French Definite Articles (Le, La, Les)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="nouns"
        topic="definite-articles"
        title="French Definite Articles (Le, La, Les)"
        description="Master French definite articles le, la, les with gender agreement, contractions, and usage rules"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/french/nouns"
        practiceUrl="/grammar/french/nouns/definite-articles/practice"
        quizUrl="/grammar/french/nouns/definite-articles/quiz"
        songUrl="/songs/fr?theme=grammar&topic=definite-articles"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

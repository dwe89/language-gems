import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'nouns',
  topic: 'partitive-articles',
  title: 'French Partitive Articles (Du, De la, Des)',
  description: 'Master French partitive articles du, de la, des for expressing "some" and quantities. Learn usage with food, abstract concepts, and negatives.',
  difficulty: 'intermediate',
  keywords: [
    'french partitive articles',
    'du de la des french',
    'partitive french',
    'some french',
    'french quantities',
    'french food vocabulary'
  ],
  examples: [
    'du pain (some bread)',
    'de la musique (some music)',
    'des légumes (some vegetables)',
    'Je ne mange pas de viande (I don\'t eat meat)'
  ]
});

const sections = [
  {
    title: 'Understanding Partitive Articles',
    content: `Partitive articles express **part of something** or an **unspecified quantity**. They correspond to "some" or "any" in English, but are often omitted in English while being required in French.

Partitive articles are formed by combining **de** + **definite article**: du (de + le), de la, de l', des (de + les).

They're essential for talking about food, drinks, abstract concepts, and uncountable nouns.`,
    examples: [
      {
        spanish: 'Je mange du pain. (I eat some bread.)',
        english: 'Je bois de la limonade. (I drink some lemonade.)',
        highlight: ['du pain', 'de la limonade']
      },
      {
        spanish: 'Il fait de la musique. (He makes music.)',
        english: 'Elle a de la patience. (She has patience.)',
        highlight: ['de la musique', 'de la patience']
      }
    ]
  },
  {
    title: 'The Four Partitive Articles',
    content: `Partitive articles follow the same gender and number patterns as definite articles:`,
    subsections: [
      {
        title: 'Complete Partitive Article System',
        content: 'Each partitive article corresponds to the definite article pattern:',
        conjugationTable: {
          title: 'French Partitive Articles',
          conjugations: [
            { pronoun: 'du', form: 'de + le (masculine)', english: 'du fromage (some cheese)' },
            { pronoun: 'de la', form: 'de + la (feminine)', english: 'de la salade (some salad)' },
            { pronoun: 'de l\'', form: 'de + l\' (vowel/h)', english: 'de l\'eau (some water)' },
            { pronoun: 'des', form: 'de + les (plural)', english: 'des fruits (some fruits)' }
          ]
        }
      },
      {
        title: 'Formation Pattern',
        content: 'Partitive articles are contractions of de + definite article:',
        examples: [
          {
            spanish: 'de + le pain = du pain (some bread)',
            english: 'de + la viande = de la viande (some meat)',
            highlight: ['du pain', 'de la viande']
          },
          {
            spanish: 'de + l\'eau = de l\'eau (some water)',
            english: 'de + les légumes = des légumes (some vegetables)',
            highlight: ['de l\'eau', 'des légumes']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use Partitive Articles',
    content: `Partitive articles are used in several key situations:`,
    examples: [
      {
        spanish: 'Food and drinks: Je veux du café. (I want some coffee.)',
        english: 'Uncountable items you consume',
        highlight: ['du café']
      },
      {
        spanish: 'Abstract concepts: Il a du courage. (He has courage.)',
        english: 'Qualities and abstract nouns',
        highlight: ['du courage']
      },
      {
        spanish: 'Activities: Elle fait de la natation. (She does swimming.)',
        english: 'Sports and activities with faire',
        highlight: ['de la natation']
      }
    ],
    subsections: [
      {
        title: 'Common Categories Using Partitives',
        content: 'These categories typically use partitive articles:',
        examples: [
          {
            spanish: 'Food: du pain, de la viande, des légumes',
            english: 'Bread, meat, vegetables',
            highlight: ['du pain', 'de la viande', 'des légumes']
          },
          {
            spanish: 'Drinks: du vin, de la bière, de l\'eau',
            english: 'Wine, beer, water',
            highlight: ['du vin', 'de la bière', 'de l\'eau']
          },
          {
            spanish: 'Abstract: du temps, de la patience, des idées',
            english: 'Time, patience, ideas',
            highlight: ['du temps', 'de la patience', 'des idées']
          },
          {
            spanish: 'Materials: du bois, de la laine, des métaux',
            english: 'Wood, wool, metals',
            highlight: ['du bois', 'de la laine', 'des métaux']
          }
        ]
      }
    ]
  },
  {
    title: 'Partitive Articles in Negative Sentences',
    content: `In negative sentences, all partitive articles become **de** (or **d\'** before vowels), just like indefinite articles.

**Pattern**: ne + verb + pas + de + noun (no article)

This rule applies to all partitive articles without exception.`,
    examples: [
      {
        spanish: 'Je mange du pain. → Je ne mange pas de pain.',
        english: 'I eat bread. → I don\'t eat bread.',
        highlight: ['du pain', 'de pain']
      },
      {
        spanish: 'Elle boit de la limonade. → Elle ne boit pas de limonade.',
        english: 'She drinks lemonade. → She doesn\'t drink lemonade.',
        highlight: ['de la limonade', 'de limonade']
      },
      {
        spanish: 'Il y a de l\'eau. → Il n\'y a pas d\'eau.',
        english: 'There is water. → There is no water.',
        highlight: ['de l\'eau', 'd\'eau']
      },
      {
        spanish: 'Nous avons des problèmes. → Nous n\'avons pas de problèmes.',
        english: 'We have problems. → We don\'t have problems.',
        highlight: ['des problèmes', 'de problèmes']
      }
    ]
  },
  {
    title: 'Partitive vs Indefinite vs Definite',
    content: `Understanding the difference between article types is crucial:

**Partitive (du/de la/des)**: Some/part of something uncountable
**Indefinite (un/une/des)**: A/an/some countable items  
**Definite (le/la/les)**: The specific item or general statements

The meaning changes significantly with different articles.`,
    examples: [
      {
        spanish: 'Je veux du gâteau. (some cake - part of it)',
        english: 'Je veux un gâteau. (a whole cake)',
        highlight: ['du gâteau', 'un gâteau']
      },
      {
        spanish: 'Il boit de la bière. (some beer - quantity)',
        english: 'Il boit une bière. (one beer - bottle/glass)',
        highlight: ['de la bière', 'une bière']
      },
      {
        spanish: 'J\'aime le chocolat. (chocolate in general)',
        english: 'Je mange du chocolat. (some chocolate)',
        highlight: ['le chocolat', 'du chocolat']
      }
    ]
  },
  {
    title: 'Special Cases and Expressions',
    content: `Some expressions and contexts have special partitive usage:`,
    examples: [
      {
        spanish: 'Faire du sport (to do sports)',
        english: 'Faire de la musique (to make music)',
        highlight: ['du sport', 'de la musique']
      },
      {
        spanish: 'Avoir du mal à (to have trouble)',
        english: 'Avoir de la chance (to be lucky)',
        highlight: ['du mal', 'de la chance']
      }
    ],
    subsections: [
      {
        title: 'Quantity Expressions',
        content: 'With specific quantities, use de without articles:',
        examples: [
          {
            spanish: 'un kilo de pommes (a kilo of apples)',
            english: 'beaucoup de pain (a lot of bread)',
            highlight: ['de pommes', 'de pain']
          },
          {
            spanish: 'un peu de temps (a little time)',
            english: 'assez d\'argent (enough money)',
            highlight: ['de temps', 'd\'argent']
          }
        ]
      },
      {
        title: 'After Certain Verbs',
        content: 'Some verbs require de instead of partitive articles:',
        examples: [
          {
            spanish: 'avoir besoin de (to need)',
            english: 'se servir de (to use)',
            highlight: ['besoin de', 'servir de']
          },
          {
            spanish: 'J\'ai besoin d\'aide. (I need help.)',
            english: 'Il se sert d\'un ordinateur. (He uses a computer.)',
            highlight: ['d\'aide', 'd\'un ordinateur']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Definite Articles', url: '/grammar/french/nouns/definite-articles', difficulty: 'beginner' },
  { title: 'French Indefinite Articles', url: '/grammar/french/nouns/indefinite-articles', difficulty: 'beginner' },
  { title: 'French Quantities', url: '/grammar/french/expressions/quantities', difficulty: 'intermediate' },
  { title: 'French Negation', url: '/grammar/french/verbs/negation', difficulty: 'intermediate' }
];

export default function FrenchPartitiveArticlesPage() {
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
              topic: 'partitive-articles',
              title: 'French Partitive Articles (Du, De la, Des)',
              description: 'Master French partitive articles du, de la, des for expressing "some" and quantities.',
              difficulty: 'intermediate',
              examples: [
                'du pain (some bread)',
                'de la musique (some music)',
                'des légumes (some vegetables)',
                'Je ne mange pas de viande (I don\'t eat meat)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'nouns',
              topic: 'partitive-articles',
              title: 'French Partitive Articles (Du, De la, Des)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="nouns"
        topic="partitive-articles"
        title="French Partitive Articles (Du, De la, Des)"
        description="Master French partitive articles du, de la, des for expressing 'some' and quantities"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/french/nouns"
        practiceUrl="/grammar/french/nouns/partitive-articles/practice"
        quizUrl="/grammar/french/nouns/partitive-articles/quiz"
        songUrl="/songs/fr?theme=grammar&topic=partitive-articles"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

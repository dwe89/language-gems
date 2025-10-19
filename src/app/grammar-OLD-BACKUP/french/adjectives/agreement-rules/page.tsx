import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adjectives',
  topic: 'agreement-rules',
  title: 'French Adjective Agreement Rules',
  description: 'Master French adjective agreement with gender and number. Learn masculine, feminine, singular, and plural adjective forms.',
  difficulty: 'beginner',
  keywords: [
    'french adjective agreement',
    'adjective agreement french',
    'masculine feminine adjectives',
    'plural adjectives french',
    'french grammar adjectives',
    'gender agreement french'
  ],
  examples: [
    'un petit chat (a small cat)',
    'une petite chatte (a small female cat)',
    'des petits chats (some small cats)',
    'des petites chattes (some small female cats)'
  ]
});

const sections = [
  {
    title: 'Understanding Adjective Agreement',
    content: `French adjectives must **agree** with the nouns they modify in both **gender** (masculine/feminine) and **number** (singular/plural). This creates up to four different forms for each adjective.

Unlike English adjectives which never change, French adjectives are like chameleons - they adapt to match their nouns perfectly.

This agreement is fundamental to French grammar and affects pronunciation, spelling, and meaning.`,
    examples: [
      {
        spanish: 'un chat noir (a black cat - masculine singular)',
        english: 'une chatte noire (a black female cat - feminine singular)',
        highlight: ['noir', 'noire']
      },
      {
        spanish: 'des chats noirs (some black cats - masculine plural)',
        english: 'des chattes noires (some black female cats - feminine plural)',
        highlight: ['noirs', 'noires']
      }
    ]
  },
  {
    title: 'The Four Forms of Adjectives',
    content: `Most French adjectives have four possible forms to match all gender and number combinations:`,
    subsections: [
      {
        title: 'Regular Adjective Agreement Pattern',
        content: 'Here\'s how regular adjectives change (using "petit" as example):',
        conjugationTable: {
          title: 'Four Forms of "Petit" (Small)',
          conjugations: [
            { pronoun: 'Masculine Singular', form: 'petit', english: 'un petit chat (a small cat)' },
            { pronoun: 'Feminine Singular', form: 'petite', english: 'une petite chatte (a small female cat)' },
            { pronoun: 'Masculine Plural', form: 'petits', english: 'des petits chats (some small cats)' },
            { pronoun: 'Feminine Plural', form: 'petites', english: 'des petites chattes (some small female cats)' }
          ]
        }
      },
      {
        title: 'Formation Rules',
        content: 'Regular adjectives follow these patterns:',
        examples: [
          {
            spanish: 'Feminine: Add -e to masculine form',
            english: 'grand → grande (big)',
            highlight: ['grand', 'grande']
          },
          {
            spanish: 'Masculine Plural: Add -s to masculine singular',
            english: 'grand → grands (big)',
            highlight: ['grand', 'grands']
          },
          {
            spanish: 'Feminine Plural: Add -s to feminine singular',
            english: 'grande → grandes (big)',
            highlight: ['grande', 'grandes']
          }
        ]
      }
    ]
  },
  {
    title: 'Regular Agreement Patterns',
    content: `Most French adjectives follow predictable patterns for agreement:`,
    subsections: [
      {
        title: 'Standard Pattern: Add -e for Feminine',
        content: 'The most common pattern adds -e for feminine forms:',
        conjugationTable: {
          title: 'Regular -e Feminine Pattern',
          conjugations: [
            { pronoun: 'grand/grande', form: 'grands/grandes', english: 'big' },
            { pronoun: 'intelligent/intelligente', form: 'intelligents/intelligentes', english: 'intelligent' },
            { pronoun: 'français/française', form: 'français/françaises', english: 'French' },
            { pronoun: 'vert/verte', form: 'verts/vertes', english: 'green' }
          ]
        }
      },
      {
        title: 'Adjectives Already Ending in -e',
        content: 'Adjectives ending in -e have the same masculine and feminine forms:',
        conjugationTable: {
          title: 'Same Masculine/Feminine Forms',
          conjugations: [
            { pronoun: 'rouge', form: 'rouge/rouges', english: 'red (same for m/f)' },
            { pronoun: 'jeune', form: 'jeune/jeunes', english: 'young (same for m/f)' },
            { pronoun: 'moderne', form: 'moderne/modernes', english: 'modern (same for m/f)' },
            { pronoun: 'rapide', form: 'rapide/rapides', english: 'fast (same for m/f)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Special Agreement Patterns',
    content: `Some adjectives have special patterns for forming feminine and plural:`,
    subsections: [
      {
        title: 'Double Consonant + -e Pattern',
        content: 'Some adjectives double the final consonant before adding -e:',
        conjugationTable: {
          title: 'Double Consonant Pattern',
          conjugations: [
            { pronoun: 'bon/bonne', form: 'bons/bonnes', english: 'good' },
            { pronoun: 'gros/grosse', form: 'gros/grosses', english: 'big/fat' },
            { pronoun: 'ancien/ancienne', form: 'anciens/anciennes', english: 'old/former' },
            { pronoun: 'européen/européenne', form: 'européens/européennes', english: 'European' }
          ]
        }
      },
      {
        title: '-eux → -euse Pattern',
        content: 'Adjectives ending in -eux change to -euse for feminine:',
        conjugationTable: {
          title: '-eux → -euse Pattern',
          conjugations: [
            { pronoun: 'heureux/heureuse', form: 'heureux/heureuses', english: 'happy' },
            { pronoun: 'sérieux/sérieuse', form: 'sérieux/sérieuses', english: 'serious' },
            { pronoun: 'dangereux/dangereuse', form: 'dangereux/dangereuses', english: 'dangerous' },
            { pronoun: 'nerveux/nerveuse', form: 'nerveux/nerveuses', english: 'nervous' }
          ]
        }
      },
      {
        title: '-er → -ère Pattern',
        content: 'Adjectives ending in -er change to -ère for feminine:',
        examples: [
          {
            spanish: 'premier/première (first)',
            english: 'dernier/dernière (last)',
            highlight: ['premier/première', 'dernier/dernière']
          },
          {
            spanish: 'cher/chère (expensive/dear)',
            english: 'fier/fière (proud)',
            highlight: ['cher/chère', 'fier/fière']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Adjective Agreement',
    content: `Some common adjectives have completely irregular forms that must be memorized:`,
    subsections: [
      {
        title: 'Common Irregular Adjectives',
        content: 'These important adjectives have unique patterns:',
        conjugationTable: {
          title: 'Irregular Adjective Forms',
          conjugations: [
            { pronoun: 'beau/belle', form: 'beaux/belles', english: 'beautiful' },
            { pronoun: 'nouveau/nouvelle', form: 'nouveaux/nouvelles', english: 'new' },
            { pronoun: 'vieux/vieille', form: 'vieux/vieilles', english: 'old' },
            { pronoun: 'blanc/blanche', form: 'blancs/blanches', english: 'white' },
            { pronoun: 'long/longue', form: 'longs/longues', english: 'long' },
            { pronoun: 'fou/folle', form: 'fous/folles', english: 'crazy' }
          ]
        }
      },
      {
        title: 'Special Forms Before Vowels',
        content: 'Some masculine adjectives have special forms before vowel sounds:',
        examples: [
          {
            spanish: 'un beau garçon BUT un bel homme',
            english: 'a handsome boy BUT a handsome man',
            highlight: ['beau', 'bel']
          },
          {
            spanish: 'un nouveau livre BUT un nouvel ami',
            english: 'a new book BUT a new friend',
            highlight: ['nouveau', 'nouvel']
          },
          {
            spanish: 'un vieux chat BUT un vieil homme',
            english: 'an old cat BUT an old man',
            highlight: ['vieux', 'vieil']
          }
        ]
      }
    ]
  },
  {
    title: 'Position and Agreement',
    content: `Adjective agreement works the same whether the adjective comes before or after the noun:`,
    examples: [
      {
        spanish: 'une belle maison (a beautiful house - before noun)',
        english: 'une maison moderne (a modern house - after noun)',
        highlight: ['belle', 'moderne']
      },
      {
        spanish: 'des petites voitures rouges (some small red cars)',
        english: 'Both adjectives agree with feminine plural noun',
        highlight: ['petites', 'rouges']
      }
    ],
    subsections: [
      {
        title: 'Multiple Adjectives',
        content: 'When multiple adjectives modify one noun, each must agree independently:',
        examples: [
          {
            spanish: 'une grande maison blanche (a big white house)',
            english: 'Both adjectives agree with feminine singular',
            highlight: ['grande', 'blanche']
          },
          {
            spanish: 'des petits chats noirs (some small black cats)',
            english: 'Both adjectives agree with masculine plural',
            highlight: ['petits', 'noirs']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement with Mixed Gender Groups',
    content: `When an adjective modifies a group with both masculine and feminine nouns, use the **masculine plural** form:`,
    examples: [
      {
        spanish: 'Le père et la mère sont contents. (The father and mother are happy.)',
        english: 'Mixed group → masculine plural adjective',
        highlight: ['contents']
      },
      {
        spanish: 'Les garçons et les filles sont intelligents. (The boys and girls are intelligent.)',
        english: 'Mixed group → masculine plural adjective',
        highlight: ['intelligents']
      },
      {
        spanish: 'Mon frère et ma sœur sont grands. (My brother and sister are tall.)',
        english: 'Mixed group → masculine plural adjective',
        highlight: ['grands']
      }
    ]
  },
  {
    title: 'Common Agreement Mistakes',
    content: `Here are frequent errors students make with adjective agreement:

**1. Forgetting feminine forms**: Using masculine with feminine nouns
**2. Missing plural agreement**: Not making adjectives plural
**3. Wrong irregular forms**: Using regular patterns for irregular adjectives
**4. Mixed gender confusion**: Wrong agreement with mixed groups`,
    examples: [
      {
        spanish: '❌ une grand maison → ✅ une grande maison',
        english: 'Wrong: must use feminine form',
        highlight: ['grande']
      },
      {
        spanish: '❌ des petit chats → ✅ des petits chats',
        english: 'Wrong: must use plural form',
        highlight: ['petits']
      },
      {
        spanish: '❌ un beau homme → ✅ un bel homme',
        english: 'Wrong: must use special form before vowel',
        highlight: ['bel']
      },
      {
        spanish: '❌ des voitures rouge → ✅ des voitures rouges',
        english: 'Wrong: adjective must be plural',
        highlight: ['rouges']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Gender Rules', url: '/grammar/french/nouns/gender-rules', difficulty: 'beginner' },
  { title: 'French Adjective Placement', url: '/grammar/french/adjectives/placement', difficulty: 'intermediate' },
  { title: 'French Plural Formation', url: '/grammar/french/nouns/plural-formation', difficulty: 'beginner' },
  { title: 'French Irregular Adjectives', url: '/grammar/french/adjectives/irregular-adjectives', difficulty: 'intermediate' }
];

export default function FrenchAdjectiveAgreementPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'adjectives',
              topic: 'agreement-rules',
              title: 'French Adjective Agreement Rules',
              description: 'Master French adjective agreement with gender and number. Learn masculine, feminine, singular, and plural adjective forms.',
              difficulty: 'beginner',
              examples: [
                'un petit chat (a small cat)',
                'une petite chatte (a small female cat)',
                'des petits chats (some small cats)',
                'des petites chattes (some small female cats)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adjectives',
              topic: 'agreement-rules',
              title: 'French Adjective Agreement Rules'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adjectives"
        topic="agreement-rules"
        title="French Adjective Agreement Rules"
        description="Master French adjective agreement with gender and number. Learn masculine, feminine, singular, and plural adjective forms"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/adjectives"
        practiceUrl="/grammar/french/adjectives/agreement-rules/practice"
        quizUrl="/grammar/french/adjectives/agreement-rules/quiz"
        songUrl="/songs/fr?theme=grammar&topic=agreement-rules"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adjectives',
  topic: 'irregular-adjectives',
  title: 'French Irregular Adjectives',
  description: 'Master French irregular adjectives with unique agreement patterns. Learn beau, nouveau, vieux, and other irregular forms.',
  difficulty: 'intermediate',
  keywords: [
    'french irregular adjectives',
    'beau belle nouveau',
    'vieux vieille french',
    'irregular agreement french',
    'special adjective forms',
    'french grammar irregular'
  ],
  examples: [
    'beau/bel/belle/beaux/belles (beautiful)',
    'nouveau/nouvel/nouvelle/nouveaux/nouvelles (new)',
    'vieux/vieil/vieille/vieux/vieilles (old)',
    'blanc/blanche/blancs/blanches (white)'
  ]
});

const sections = [
  {
    title: 'Understanding Irregular Adjectives',
    content: `French irregular adjectives don't follow the standard agreement patterns. They have **unique forms** that must be memorized, and some have **special forms** before vowel sounds.

These adjectives are among the most commonly used in French, making them essential to master.

Many irregular adjectives also have special masculine forms used before words beginning with vowels or silent 'h'.`,
    examples: [
      {
        spanish: 'un beau garçon (a handsome boy)',
        english: 'un bel homme (a handsome man - before vowel)',
        highlight: ['beau', 'bel']
      },
      {
        spanish: 'une belle femme (a beautiful woman)',
        english: 'de beaux enfants (beautiful children)',
        highlight: ['belle', 'beaux']
      }
    ]
  },
  {
    title: 'BEAU (Beautiful/Handsome)',
    content: `**Beau** is one of the most important irregular adjectives with five different forms:`,
    subsections: [
      {
        title: 'All Forms of BEAU',
        content: 'Complete conjugation of beau:',
        conjugationTable: {
          title: 'BEAU Forms',
          conjugations: [
            { pronoun: 'beau', form: 'masculine singular', english: 'un beau livre (a beautiful book)' },
            { pronoun: 'bel', form: 'masculine before vowel', english: 'un bel homme (a handsome man)' },
            { pronoun: 'belle', form: 'feminine singular', english: 'une belle femme (a beautiful woman)' },
            { pronoun: 'beaux', form: 'masculine plural', english: 'de beaux livres (beautiful books)' },
            { pronoun: 'belles', form: 'feminine plural', english: 'de belles femmes (beautiful women)' }
          ]
        }
      },
      {
        title: 'When to Use BEL',
        content: 'Use "bel" before masculine words starting with vowels or silent h:',
        examples: [
          {
            spanish: 'un bel ami (a handsome friend)',
            english: 'un bel hôtel (a beautiful hotel)',
            highlight: ['bel ami', 'bel hôtel']
          },
          {
            spanish: 'un bel appartement (a beautiful apartment)',
            english: 'un bel été (a beautiful summer)',
            highlight: ['bel appartement', 'bel été']
          }
        ]
      }
    ]
  },
  {
    title: 'NOUVEAU (New)',
    content: `**Nouveau** follows the same pattern as beau with five forms:`,
    subsections: [
      {
        title: 'All Forms of NOUVEAU',
        content: 'Complete conjugation of nouveau:',
        conjugationTable: {
          title: 'NOUVEAU Forms',
          conjugations: [
            { pronoun: 'nouveau', form: 'masculine singular', english: 'un nouveau livre (a new book)' },
            { pronoun: 'nouvel', form: 'masculine before vowel', english: 'un nouvel ami (a new friend)' },
            { pronoun: 'nouvelle', form: 'feminine singular', english: 'une nouvelle voiture (a new car)' },
            { pronoun: 'nouveaux', form: 'masculine plural', english: 'de nouveaux livres (new books)' },
            { pronoun: 'nouvelles', form: 'feminine plural', english: 'de nouvelles voitures (new cars)' }
          ]
        }
      },
      {
        title: 'NOUVEL Usage',
        content: 'Use "nouvel" before masculine words starting with vowels or silent h:',
        examples: [
          {
            spanish: 'un nouvel ordinateur (a new computer)',
            english: 'un nouvel hôpital (a new hospital)',
            highlight: ['nouvel ordinateur', 'nouvel hôpital']
          },
          {
            spanish: 'un nouvel étudiant (a new student)',
            english: 'un nouvel an (a new year)',
            highlight: ['nouvel étudiant', 'nouvel an']
          }
        ]
      }
    ]
  },
  {
    title: 'VIEUX (Old)',
    content: `**Vieux** also has five forms following the same pattern:`,
    subsections: [
      {
        title: 'All Forms of VIEUX',
        content: 'Complete conjugation of vieux:',
        conjugationTable: {
          title: 'VIEUX Forms',
          conjugations: [
            { pronoun: 'vieux', form: 'masculine singular', english: 'un vieux livre (an old book)' },
            { pronoun: 'vieil', form: 'masculine before vowel', english: 'un vieil homme (an old man)' },
            { pronoun: 'vieille', form: 'feminine singular', english: 'une vieille dame (an old lady)' },
            { pronoun: 'vieux', form: 'masculine plural', english: 'de vieux livres (old books)' },
            { pronoun: 'vieilles', form: 'feminine plural', english: 'de vieilles dames (old ladies)' }
          ]
        }
      },
      {
        title: 'VIEIL Usage',
        content: 'Use "vieil" before masculine words starting with vowels or silent h:',
        examples: [
          {
            spanish: 'un vieil ami (an old friend)',
            english: 'un vieil hôtel (an old hotel)',
            highlight: ['vieil ami', 'vieil hôtel']
          },
          {
            spanish: 'un vieil arbre (an old tree)',
            english: 'un vieil homme (an old man)',
            highlight: ['vieil arbre', 'vieil homme']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Common Irregular Adjectives',
    content: `Several other adjectives have irregular patterns:`,
    subsections: [
      {
        title: 'BLANC (White)',
        content: 'Blanc changes -c to -che for feminine:',
        conjugationTable: {
          title: 'BLANC Forms',
          conjugations: [
            { pronoun: 'blanc', form: 'masculine singular', english: 'un chat blanc (a white cat)' },
            { pronoun: 'blanche', form: 'feminine singular', english: 'une chatte blanche (a white female cat)' },
            { pronoun: 'blancs', form: 'masculine plural', english: 'des chats blancs (white cats)' },
            { pronoun: 'blanches', form: 'feminine plural', english: 'des chattes blanches (white female cats)' }
          ]
        }
      },
      {
        title: 'LONG (Long)',
        content: 'Long adds -ue for feminine:',
        examples: [
          {
            spanish: 'un long voyage (a long trip)',
            english: 'une longue histoire (a long story)',
            highlight: ['long', 'longue']
          },
          {
            spanish: 'de longs voyages (long trips)',
            english: 'de longues histoires (long stories)',
            highlight: ['longs', 'longues']
          }
        ]
      },
      {
        title: 'FOU (Crazy/Mad)',
        content: 'Fou has completely irregular forms:',
        conjugationTable: {
          title: 'FOU Forms',
          conjugations: [
            { pronoun: 'fou', form: 'masculine singular', english: 'un homme fou (a crazy man)' },
            { pronoun: 'folle', form: 'feminine singular', english: 'une femme folle (a crazy woman)' },
            { pronoun: 'fous', form: 'masculine plural', english: 'des hommes fous (crazy men)' },
            { pronoun: 'folles', form: 'feminine plural', english: 'des femmes folles (crazy women)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Double Consonant Patterns',
    content: `Some adjectives double their final consonant before adding -e for feminine:`,
    subsections: [
      {
        title: 'BON (Good)',
        content: 'Bon doubles the n:',
        conjugationTable: {
          title: 'BON Forms',
          conjugations: [
            { pronoun: 'bon', form: 'masculine singular', english: 'un bon livre (a good book)' },
            { pronoun: 'bonne', form: 'feminine singular', english: 'une bonne idée (a good idea)' },
            { pronoun: 'bons', form: 'masculine plural', english: 'de bons livres (good books)' },
            { pronoun: 'bonnes', form: 'feminine plural', english: 'de bonnes idées (good ideas)' }
          ]
        }
      },
      {
        title: 'GROS (Big/Fat)',
        content: 'Gros doubles the s:',
        examples: [
          {
            spanish: 'un gros chat (a fat cat)',
            english: 'une grosse chatte (a fat female cat)',
            highlight: ['gros', 'grosse']
          },
          {
            spanish: 'de gros problèmes (big problems)',
            english: 'de grosses difficultés (big difficulties)',
            highlight: ['gros', 'grosses']
          }
        ]
      },
      {
        title: 'GENTIL (Nice/Kind)',
        content: 'Gentil doubles the l:',
        examples: [
          {
            spanish: 'un gentil garçon (a nice boy)',
            english: 'une gentille fille (a nice girl)',
            highlight: ['gentil', 'gentille']
          }
        ]
      }
    ]
  },
  {
    title: '-EUX → -EUSE Pattern',
    content: `Adjectives ending in -eux change to -euse for feminine:`,
    subsections: [
      {
        title: 'Common -EUX Adjectives',
        content: 'These adjectives follow the -eux → -euse pattern:',
        conjugationTable: {
          title: '-EUX → -EUSE Pattern',
          conjugations: [
            { pronoun: 'heureux/heureuse', form: 'happy', english: 'Il est heureux. Elle est heureuse.' },
            { pronoun: 'sérieux/sérieuse', form: 'serious', english: 'Un homme sérieux. Une femme sérieuse.' },
            { pronoun: 'dangereux/dangereuse', form: 'dangerous', english: 'Un sport dangereux. Une route dangereuse.' },
            { pronoun: 'nerveux/nerveuse', form: 'nervous', english: 'Un chat nerveux. Une chatte nerveuse.' }
          ]
        }
      },
      {
        title: 'Plural Forms',
        content: 'Masculine plural stays -eux, feminine plural becomes -euses:',
        examples: [
          {
            spanish: 'des hommes heureux (happy men)',
            english: 'des femmes heureuses (happy women)',
            highlight: ['heureux', 'heureuses']
          },
          {
            spanish: 'des étudiants sérieux (serious students)',
            english: 'des étudiantes sérieuses (serious female students)',
            highlight: ['sérieux', 'sérieuses']
          }
        ]
      }
    ]
  },
  {
    title: 'Memory Tips for Irregular Adjectives',
    content: `Strategies for remembering irregular adjective forms:

**1. Group similar patterns**: beau/nouveau/vieux all follow the same pattern
**2. Practice with common nouns**: use frequent noun-adjective combinations
**3. Listen for pronunciation**: many irregular forms sound different
**4. Learn in context**: memorize complete phrases rather than isolated forms`,
    examples: [
      {
        spanish: 'Pattern group: un bel homme, un nouvel ami, un vieil arbre',
        english: 'All use special forms before vowels',
        highlight: ['bel', 'nouvel', 'vieil']
      },
      {
        spanish: 'Common phrases: une bonne idée, une longue histoire, une grosse voiture',
        english: 'Learn adjectives with typical nouns',
        highlight: ['bonne idée', 'longue histoire', 'grosse voiture']
      }
    ]
  },
  {
    title: 'Common Irregular Adjective Mistakes',
    content: `Here are frequent errors students make with irregular adjectives:

**1. Wrong special forms**: Using beau instead of bel before vowels
**2. Feminine formation**: Using regular patterns for irregular adjectives
**3. Plural confusion**: Wrong plural forms for irregular adjectives
**4. Pattern mixing**: Confusing different irregular patterns`,
    examples: [
      {
        spanish: '❌ un beau homme → ✅ un bel homme',
        english: 'Wrong: must use special form before vowel',
        highlight: ['bel homme']
      },
      {
        spanish: '❌ une blanque voiture → ✅ une blanche voiture',
        english: 'Wrong: blanc becomes blanche, not blanque',
        highlight: ['blanche']
      },
      {
        spanish: '❌ des beaus livres → ✅ de beaux livres',
        english: 'Wrong: irregular plural is beaux',
        highlight: ['beaux']
      },
      {
        spanish: '❌ une heureuxe femme → ✅ une femme heureuse',
        english: 'Wrong: -eux becomes -euse, not -euxe',
        highlight: ['heureuse']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'beginner' },
  { title: 'French Adjective Placement', url: '/grammar/french/adjectives/placement', difficulty: 'intermediate' },
  { title: 'French Comparative Adjectives', url: '/grammar/french/adjectives/comparative', difficulty: 'intermediate' },
  { title: 'French Demonstrative Adjectives', url: '/grammar/french/adjectives/demonstrative', difficulty: 'beginner' }
];

export default function FrenchIrregularAdjectivesPage() {
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
              topic: 'irregular-adjectives',
              title: 'French Irregular Adjectives',
              description: 'Master French irregular adjectives with unique agreement patterns. Learn beau, nouveau, vieux, and other irregular forms.',
              difficulty: 'intermediate',
              examples: [
                'beau/bel/belle/beaux/belles (beautiful)',
                'nouveau/nouvel/nouvelle/nouveaux/nouvelles (new)',
                'vieux/vieil/vieille/vieux/vieilles (old)',
                'blanc/blanche/blancs/blanches (white)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adjectives',
              topic: 'irregular-adjectives',
              title: 'French Irregular Adjectives'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adjectives"
        topic="irregular-adjectives"
        title="French Irregular Adjectives"
        description="Master French irregular adjectives with unique agreement patterns. Learn beau, nouveau, vieux, and other irregular forms"
        difficulty="intermediate"
        estimatedTime={14}
        sections={sections}
        backUrl="/grammar/french/adjectives"
        practiceUrl="/grammar/french/adjectives/irregular-adjectives/practice"
        quizUrl="/grammar/french/adjectives/irregular-adjectives/quiz"
        songUrl="/songs/fr?theme=grammar&topic=irregular-adjectives"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

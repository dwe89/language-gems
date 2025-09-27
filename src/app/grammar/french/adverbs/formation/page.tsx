import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adverbs',
  topic: 'formation',
  title: 'French Adverb Formation (-ment, Irregular Forms)',
  description: 'Master French adverb formation from adjectives. Learn -ment endings, irregular forms, and placement rules.',
  difficulty: 'intermediate',
  keywords: [
    'french adverb formation',
    'ment ending french',
    'adverbs from adjectives',
    'french grammar adverbs',
    'irregular adverbs french',
    'adverb rules french'
  ],
  examples: [
    'lent → lentement (slowly)',
    'facile → facilement (easily)',
    'heureux → heureusement (happily)',
    'bon → bien (well - irregular)'
  ]
});

const sections = [
  {
    title: 'Understanding French Adverb Formation',
    content: `French adverbs are formed from adjectives by adding **-ment** (equivalent to English "-ly"). However, the formation rules depend on the ending of the adjective.

Adverbs modify verbs, adjectives, or other adverbs, and they are **invariable** - they never change form.

Most French adverbs follow predictable patterns, but some important ones are irregular.`,
    examples: [
      {
        spanish: 'Il parle lentement. (He speaks slowly.)',
        english: 'Lentement modifies the verb parle',
        highlight: ['lentement']
      },
      {
        spanish: 'Elle est très intelligente. (She is very intelligent.)',
        english: 'Très modifies the adjective intelligente',
        highlight: ['très']
      },
      {
        spanish: 'Il conduit assez prudemment. (He drives quite carefully.)',
        english: 'Assez modifies the adverb prudemment',
        highlight: ['assez prudemment']
      }
    ]
  },
  {
    title: 'Regular Formation: Feminine + -MENT',
    content: `The basic rule: take the **feminine form** of the adjective and add **-ment**:`,
    examples: [
      {
        spanish: 'lent → lente → lentement (slowly)',
        english: 'Use feminine form as base',
        highlight: ['lentement']
      },
      {
        spanish: 'heureux → heureuse → heureusement (happily)',
        english: 'Feminine form + -ment',
        highlight: ['heureusement']
      }
    ],
    subsections: [
      {
        title: 'Step-by-Step Formation',
        content: 'How to form regular adverbs:',
        conjugationTable: {
          title: 'Regular Adverb Formation',
          conjugations: [
            { pronoun: '1. Take adjective', form: 'lent (slow)', english: 'Start with masculine adjective' },
            { pronoun: '2. Make feminine', form: 'lente', english: 'Add -e for feminine form' },
            { pronoun: '3. Add -ment', form: 'lentement', english: 'Add -ment to feminine form' },
            { pronoun: 'Result', form: 'lentement (slowly)', english: 'Complete adverb' }
          ]
        }
      },
      {
        title: 'Common Regular Examples',
        content: 'Frequently used regular adverbs:',
        examples: [
          {
            spanish: 'certain → certaine → certainement (certainly)',
            english: 'normal → normale → normalement (normally)',
            highlight: ['certainement', 'normalement']
          },
          {
            spanish: 'parfait → parfaite → parfaitement (perfectly)',
            english: 'complet → complète → complètement (completely)',
            highlight: ['parfaitement', 'complètement']
          }
        ]
      }
    ]
  },
  {
    title: 'Adjectives Ending in Vowels',
    content: `When the masculine adjective already ends in a **vowel**, simply add **-ment** (no need for feminine form):`,
    examples: [
      {
        spanish: 'facile → facilement (easily)',
        english: 'Ends in -e, just add -ment',
        highlight: ['facilement']
      },
      {
        spanish: 'rapide → rapidement (quickly)',
        english: 'Ends in -e, just add -ment',
        highlight: ['rapidement']
      }
    ],
    subsections: [
      {
        title: 'Vowel-Ending Adjectives',
        content: 'Common adjectives ending in vowels:',
        conjugationTable: {
          title: 'Vowel + -MENT',
          conjugations: [
            { pronoun: 'facile', form: 'facilement', english: 'easily' },
            { pronoun: 'rapide', form: 'rapidement', english: 'quickly' },
            { pronoun: 'simple', form: 'simplement', english: 'simply' },
            { pronoun: 'terrible', form: 'terriblement', english: 'terribly' }
          ]
        }
      },
      {
        title: 'Special Case: -AI, -É, -I, -U',
        content: 'Adjectives ending in other vowels:',
        examples: [
          {
            spanish: 'vrai → vraiment (truly)',
            english: 'Ends in -ai, add -ment',
            highlight: ['vraiment']
          },
          {
            spanish: 'absolu → absolument (absolutely)',
            english: 'Ends in -u, add -ment',
            highlight: ['absolument']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Pattern: -ANT → -AMMENT',
    content: `Adjectives ending in **-ant** form adverbs with **-amment**:`,
    examples: [
      {
        spanish: 'constant → constamment (constantly)',
        english: '-ant becomes -amment',
        highlight: ['constamment']
      },
      {
        spanish: 'élégant → élégamment (elegantly)',
        english: '-ant becomes -amment',
        highlight: ['élégamment']
      }
    ],
    subsections: [
      {
        title: '-ANT → -AMMENT Examples',
        content: 'Common -ant adjectives:',
        conjugationTable: {
          title: '-ANT Adverbs',
          conjugations: [
            { pronoun: 'constant', form: 'constamment', english: 'constantly' },
            { pronoun: 'élégant', form: 'élégamment', english: 'elegantly' },
            { pronoun: 'méchant', form: 'méchamment', english: 'nastily' },
            { pronoun: 'savant', form: 'savamment', english: 'learnedly' }
          ]
        }
      }
    ]
  },
  {
    title: 'Special Pattern: -ENT → -EMMENT',
    content: `Adjectives ending in **-ent** form adverbs with **-emment**:`,
    examples: [
      {
        spanish: 'récent → récemment (recently)',
        english: '-ent becomes -emment',
        highlight: ['récemment']
      },
      {
        spanish: 'fréquent → fréquemment (frequently)',
        english: '-ent becomes -emment',
        highlight: ['fréquemment']
      }
    ],
    subsections: [
      {
        title: '-ENT → -EMMENT Examples',
        content: 'Common -ent adjectives:',
        conjugationTable: {
          title: '-ENT Adverbs',
          conjugations: [
            { pronoun: 'récent', form: 'récemment', english: 'recently' },
            { pronoun: 'fréquent', form: 'fréquemment', english: 'frequently' },
            { pronoun: 'patient', form: 'patiemment', english: 'patiently' },
            { pronoun: 'violent', form: 'violemment', english: 'violently' }
          ]
        }
      },
      {
        title: 'Pronunciation Note',
        content: 'Both -amment and -emment are pronounced the same way:',
        examples: [
          {
            spanish: 'constamment [kɔ̃stamɑ̃] (constantly)',
            english: 'récemment [ʁesamɑ̃] (recently)',
            highlight: ['constamment', 'récemment']
          },
          {
            spanish: 'Both endings sound like [amɑ̃]',
            english: 'Same pronunciation despite different spelling',
            highlight: ['[amɑ̃]']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Adverbs',
    content: `Some important adverbs don't follow the -ment pattern and must be memorized:`,
    subsections: [
      {
        title: 'Most Common Irregular Adverbs',
        content: 'Essential irregular adverbs:',
        conjugationTable: {
          title: 'Irregular Adverbs',
          conjugations: [
            { pronoun: 'bon → bien', form: 'well', english: 'Il chante bien. (He sings well.)' },
            { pronoun: 'mauvais → mal', form: 'badly', english: 'Elle dort mal. (She sleeps badly.)' },
            { pronoun: 'petit → peu', form: 'little', english: 'Il mange peu. (He eats little.)' },
            { pronoun: 'meilleur → mieux', form: 'better', english: 'Je vais mieux. (I\'m feeling better.)' }
          ]
        }
      },
      {
        title: 'Other Important Irregulars',
        content: 'Additional irregular adverbs:',
        examples: [
          {
            spanish: 'vite (quickly) - no adjective form',
            english: 'souvent (often) - no adjective form',
            highlight: ['vite', 'souvent']
          },
          {
            spanish: 'toujours (always) - no adjective form',
            english: 'jamais (never) - no adjective form',
            highlight: ['toujours', 'jamais']
          }
        ]
      }
    ]
  },
  {
    title: 'Adverbs vs Adjectives',
    content: `Important distinction between adverbs and adjectives in French:`,
    examples: [
      {
        spanish: 'Adjective: Elle est lente. (She is slow.)',
        english: 'Adverb: Elle parle lentement. (She speaks slowly.)',
        highlight: ['lente', 'lentement']
      },
      {
        spanish: 'Adjective: C\'est facile. (It\'s easy.)',
        english: 'Adverb: Il le fait facilement. (He does it easily.)',
        highlight: ['facile', 'facilement']
      }
    ],
    subsections: [
      {
        title: 'Usage Differences',
        content: 'When to use adjectives vs adverbs:',
        examples: [
          {
            spanish: 'Adjectives modify nouns: une voiture rapide (a fast car)',
            english: 'Adverbs modify verbs: Il conduit rapidement. (He drives quickly.)',
            highlight: ['rapide', 'rapidement']
          },
          {
            spanish: 'Adjectives agree: Elle est heureuse. (She is happy.)',
            english: 'Adverbs are invariable: Elle chante heureusement. (She sings happily.)',
            highlight: ['heureuse', 'heureusement']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Adverb Formation Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong base form**: Using masculine instead of feminine adjective
**2. Missing patterns**: Not recognizing -ant/-ent special rules
**3. Irregular confusion**: Using regular formation for irregular adverbs
**4. Adjective/adverb mix-up**: Using adjectives where adverbs are needed`,
    examples: [
      {
        spanish: '❌ heureuxment → ✅ heureusement',
        english: 'Wrong: must use feminine base heureuse',
        highlight: ['heureusement']
      },
      {
        spanish: '❌ récentemente → ✅ récemment',
        english: 'Wrong: -ent becomes -emment, not -ement',
        highlight: ['récemment']
      },
      {
        spanish: '❌ bonnement → ✅ bien',
        english: 'Wrong: bon is irregular, becomes bien',
        highlight: ['bien']
      },
      {
        spanish: '❌ Il parle bon français → ✅ Il parle bien français',
        english: 'Wrong: need adverb bien, not adjective bon',
        highlight: ['bien']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Adverb Placement', url: '/grammar/french/adverbs/placement', difficulty: 'intermediate' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'beginner' },
  { title: 'French Comparative Adverbs', url: '/grammar/french/adverbs/comparative', difficulty: 'intermediate' },
  { title: 'French Irregular Adjectives', url: '/grammar/french/adjectives/irregular-adjectives', difficulty: 'intermediate' }
];

export default function FrenchAdverbFormationPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'adverbs',
              topic: 'formation',
              title: 'French Adverb Formation (-ment, Irregular Forms)',
              description: 'Master French adverb formation from adjectives. Learn -ment endings, irregular forms, and placement rules.',
              difficulty: 'intermediate',
              examples: [
                'lent → lentement (slowly)',
                'facile → facilement (easily)',
                'heureux → heureusement (happily)',
                'bon → bien (well - irregular)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adverbs',
              topic: 'formation',
              title: 'French Adverb Formation (-ment, Irregular Forms)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adverbs"
        topic="formation"
        title="French Adverb Formation (-ment, Irregular Forms)"
        description="Master French adverb formation from adjectives. Learn -ment endings, irregular forms, and placement rules"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/adverbs"
        practiceUrl="/grammar/french/adverbs/formation/practice"
        quizUrl="/grammar/french/adverbs/formation/quiz"
        songUrl="/songs/fr?theme=grammar&topic=formation"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

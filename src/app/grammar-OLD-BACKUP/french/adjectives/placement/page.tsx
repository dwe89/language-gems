import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adjectives',
  topic: 'placement',
  title: 'French Adjective Placement Rules',
  description: 'Master French adjective placement with BAGS rule. Learn when adjectives go before or after nouns with examples and exceptions.',
  difficulty: 'intermediate',
  keywords: [
    'french adjective placement',
    'adjective position french',
    'BAGS adjectives french',
    'before after noun french',
    'french grammar placement',
    'adjective order french'
  ],
  examples: [
    'une belle maison (a beautiful house - before)',
    'une maison moderne (a modern house - after)',
    'un petit chat noir (a small black cat - mixed)',
    'une grande voiture rouge (a big red car - mixed)'
  ]
});

const sections = [
  {
    title: 'Understanding French Adjective Placement',
    content: `French adjective placement is more complex than English. While most adjectives come **after** the noun, some important adjectives come **before** the noun.

The key is learning which adjectives go where, and understanding that placement can sometimes change meaning.

The famous **BAGS** rule helps remember the main categories of adjectives that come before nouns.`,
    examples: [
      {
        spanish: 'une voiture rouge (a red car - after noun)',
        english: 'Most adjectives follow this pattern',
        highlight: ['voiture rouge']
      },
      {
        spanish: 'une belle voiture (a beautiful car - before noun)',
        english: 'Some adjectives come before the noun',
        highlight: ['belle voiture']
      },
      {
        spanish: 'une belle voiture rouge (a beautiful red car)',
        english: 'Multiple adjectives can surround the noun',
        highlight: ['belle voiture rouge']
      }
    ]
  },
  {
    title: 'The BAGS Rule: Adjectives Before Nouns',
    content: `**BAGS** is a memory device for adjectives that typically come **before** the noun:

**B**eauty - beautiful, pretty, ugly
**A**ge - young, old, new
**G**oodness - good, bad, better, worse  
**S**ize - big, small, long, short

These adjectives are among the most common and useful in French.`,
    subsections: [
      {
        title: 'Beauty Adjectives (Before Noun)',
        content: 'Adjectives describing beauty and appearance:',
        conjugationTable: {
          title: 'Beauty Adjectives',
          conjugations: [
            { pronoun: 'beau/belle', form: 'beautiful/handsome', english: 'un bel homme (a handsome man)' },
            { pronoun: 'joli/jolie', form: 'pretty', english: 'une jolie fille (a pretty girl)' },
            { pronoun: 'laid/laide', form: 'ugly', english: 'un laid bâtiment (an ugly building)' }
          ]
        }
      },
      {
        title: 'Age Adjectives (Before Noun)',
        content: 'Adjectives describing age and time:',
        conjugationTable: {
          title: 'Age Adjectives',
          conjugations: [
            { pronoun: 'jeune', form: 'young', english: 'un jeune homme (a young man)' },
            { pronoun: 'vieux/vieille', form: 'old', english: 'une vieille dame (an old lady)' },
            { pronoun: 'nouveau/nouvelle', form: 'new', english: 'une nouvelle voiture (a new car)' },
            { pronoun: 'ancien/ancienne', form: 'former/old', english: 'un ancien professeur (a former teacher)' }
          ]
        }
      },
      {
        title: 'Goodness Adjectives (Before Noun)',
        content: 'Adjectives describing quality and moral judgment:',
        examples: [
          {
            spanish: 'bon/bonne (good): un bon livre (a good book)',
            english: 'mauvais/mauvaise (bad): une mauvaise idée (a bad idea)',
            highlight: ['bon livre', 'mauvaise idée']
          },
          {
            spanish: 'meilleur/meilleure (better): un meilleur choix (a better choice)',
            english: 'pire (worse): une pire situation (a worse situation)',
            highlight: ['meilleur choix', 'pire situation']
          }
        ]
      },
      {
        title: 'Size Adjectives (Before Noun)',
        content: 'Adjectives describing physical size:',
        examples: [
          {
            spanish: 'grand/grande (big): une grande maison (a big house)',
            english: 'petit/petite (small): un petit chat (a small cat)',
            highlight: ['grande maison', 'petit chat']
          },
          {
            spanish: 'gros/grosse (fat/big): un gros problème (a big problem)',
            english: 'long/longue (long): une longue histoire (a long story)',
            highlight: ['gros problème', 'longue histoire']
          }
        ]
      }
    ]
  },
  {
    title: 'Adjectives After Nouns (Most Common)',
    content: `The majority of French adjectives come **after** the noun they modify. This includes most descriptive adjectives.`,
    subsections: [
      {
        title: 'Color Adjectives (After Noun)',
        content: 'All color adjectives come after the noun:',
        conjugationTable: {
          title: 'Color Adjectives',
          conjugations: [
            { pronoun: 'rouge', form: 'red', english: 'une voiture rouge (a red car)' },
            { pronoun: 'bleu/bleue', form: 'blue', english: 'un ciel bleu (a blue sky)' },
            { pronoun: 'vert/verte', form: 'green', english: 'des yeux verts (green eyes)' },
            { pronoun: 'noir/noire', form: 'black', english: 'un chat noir (a black cat)' }
          ]
        }
      },
      {
        title: 'Nationality Adjectives (After Noun)',
        content: 'All nationality adjectives come after the noun:',
        examples: [
          {
            spanish: 'un restaurant français (a French restaurant)',
            english: 'une voiture allemande (a German car)',
            highlight: ['restaurant français', 'voiture allemande']
          },
          {
            spanish: 'des étudiants américains (American students)',
            english: 'une famille italienne (an Italian family)',
            highlight: ['étudiants américains', 'famille italienne']
          }
        ]
      },
      {
        title: 'Shape and Physical Description (After Noun)',
        content: 'Most physical descriptions come after the noun:',
        examples: [
          {
            spanish: 'une table ronde (a round table)',
            english: 'un homme mince (a thin man)',
            highlight: ['table ronde', 'homme mince']
          },
          {
            spanish: 'des cheveux bouclés (curly hair)',
            english: 'une femme élégante (an elegant woman)',
            highlight: ['cheveux bouclés', 'femme élégante']
          }
        ]
      }
    ]
  },
  {
    title: 'Multiple Adjectives: Mixed Placement',
    content: `When using multiple adjectives, some may go before the noun and others after, creating a "sandwich" effect.`,
    examples: [
      {
        spanish: 'une belle voiture rouge (a beautiful red car)',
        english: 'Beauty (belle) before + color (rouge) after',
        highlight: ['belle voiture rouge']
      },
      {
        spanish: 'un petit chat noir (a small black cat)',
        english: 'Size (petit) before + color (noir) after',
        highlight: ['petit chat noir']
      },
      {
        spanish: 'une grande maison moderne (a big modern house)',
        english: 'Size (grande) before + style (moderne) after',
        highlight: ['grande maison moderne']
      },
      {
        spanish: 'de nouveaux étudiants français (some new French students)',
        english: 'Age (nouveaux) before + nationality (français) after',
        highlight: ['nouveaux étudiants français']
      }
    ]
  },
  {
    title: 'Adjectives That Change Meaning',
    content: `Some adjectives change meaning depending on whether they come before or after the noun:`,
    subsections: [
      {
        title: 'Common Meaning-Changing Adjectives',
        content: 'These adjectives have different meanings in different positions:',
        conjugationTable: {
          title: 'Position Changes Meaning',
          conjugations: [
            { pronoun: 'ancien', form: 'un ancien ami (former friend)', english: 'un bâtiment ancien (old building)' },
            { pronoun: 'cher', form: 'mon cher ami (dear friend)', english: 'une voiture chère (expensive car)' },
            { pronoun: 'grand', form: 'un grand homme (great man)', english: 'un homme grand (tall man)' },
            { pronoun: 'pauvre', form: 'un pauvre homme (poor/pitiful man)', english: 'un homme pauvre (poor/no money man)' }
          ]
        }
      },
      {
        title: 'More Examples of Meaning Changes',
        content: 'Additional adjectives that change meaning with position:',
        examples: [
          {
            spanish: 'propre: ma propre voiture (my own car) vs une voiture propre (a clean car)',
            english: 'Position determines meaning: ownership vs cleanliness',
            highlight: ['propre voiture', 'voiture propre']
          },
          {
            spanish: 'seul: un seul homme (only one man) vs un homme seul (a lonely man)',
            english: 'Position determines meaning: only vs lonely',
            highlight: ['seul homme', 'homme seul']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Cases and Exceptions',
    content: `Some situations require special attention to adjective placement:`,
    examples: [
      {
        spanish: 'Compound adjectives: une voiture bleu foncé (a dark blue car)',
        english: 'Compound colors stay after the noun',
        highlight: ['bleu foncé']
      },
      {
        spanish: 'Modified adjectives: une très belle maison (a very beautiful house)',
        english: 'Adverbs don\'t change adjective position',
        highlight: ['très belle']
      }
    ],
    subsections: [
      {
        title: 'Invariable Adjectives',
        content: 'Some adjectives never change position or form:',
        examples: [
          {
            spanish: 'des voitures marron (some brown cars)',
            english: 'Color marron never changes',
            highlight: ['marron']
          },
          {
            spanish: 'des filles super (some great girls)',
            english: 'Informal super never changes',
            highlight: ['super']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Placement Mistakes',
    content: `Here are frequent errors students make with adjective placement:

**1. Wrong BAGS placement**: Putting BAGS adjectives after nouns
**2. Color before noun**: Putting colors before nouns
**3. Nationality before noun**: Putting nationalities before nouns
**4. Meaning confusion**: Not recognizing meaning changes with position`,
    examples: [
      {
        spanish: '❌ une voiture belle → ✅ une belle voiture',
        english: 'Wrong: beauty adjectives go before noun',
        highlight: ['belle voiture']
      },
      {
        spanish: '❌ une rouge voiture → ✅ une voiture rouge',
        english: 'Wrong: color adjectives go after noun',
        highlight: ['voiture rouge']
      },
      {
        spanish: '❌ un français restaurant → ✅ un restaurant français',
        english: 'Wrong: nationality adjectives go after noun',
        highlight: ['restaurant français']
      },
      {
        spanish: '❌ un homme grand (great) → ✅ un grand homme (great)',
        english: 'Wrong position changes meaning: tall vs great',
        highlight: ['grand homme']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'beginner' },
  { title: 'French Irregular Adjectives', url: '/grammar/french/adjectives/irregular-adjectives', difficulty: 'intermediate' },
  { title: 'French Comparative Adjectives', url: '/grammar/french/adjectives/comparative', difficulty: 'intermediate' },
  { title: 'French Demonstrative Adjectives', url: '/grammar/french/adjectives/demonstrative', difficulty: 'beginner' }
];

export default function FrenchAdjectivePlacementPage() {
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
              topic: 'placement',
              title: 'French Adjective Placement Rules',
              description: 'Master French adjective placement with BAGS rule. Learn when adjectives go before or after nouns with examples and exceptions.',
              difficulty: 'intermediate',
              examples: [
                'une belle maison (a beautiful house - before)',
                'une maison moderne (a modern house - after)',
                'un petit chat noir (a small black cat - mixed)',
                'une grande voiture rouge (a big red car - mixed)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adjectives',
              topic: 'placement',
              title: 'French Adjective Placement Rules'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adjectives"
        topic="placement"
        title="French Adjective Placement Rules"
        description="Master French adjective placement with BAGS rule. Learn when adjectives go before or after nouns with examples and exceptions"
        difficulty="intermediate"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/french/adjectives"
        practiceUrl="/grammar/french/adjectives/placement/practice"
        quizUrl="/grammar/french/adjectives/placement/quiz"
        songUrl="/songs/fr?theme=grammar&topic=placement"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'nouns',
  topic: 'plural-formation',
  title: 'French Plural Formation Rules',
  description: 'Master French plural formation with regular and irregular patterns. Learn -s, -x endings, exceptions, and special cases.',
  difficulty: 'beginner',
  keywords: [
    'french plural',
    'french plural rules',
    'plural formation french',
    'french noun plurals',
    'french grammar plurals',
    'irregular plurals french'
  ],
  examples: [
    'livre → livres (book → books)',
    'château → châteaux (castle → castles)',
    'œil → yeux (eye → eyes)',
    'enfant → enfants (child → children)'
  ]
});

const sections = [
  {
    title: 'Understanding French Plurals',
    content: `French plural formation follows predictable patterns, though there are important exceptions to learn. Most French nouns form their plural by adding **-s**, but the ending of the singular noun determines the exact rule.

Unlike English, French plural markers affect not just the noun but also articles, adjectives, and sometimes pronunciation.

The key is learning the patterns based on how the singular noun ends.`,
    examples: [
      {
        spanish: 'un livre → des livres (a book → some books)',
        english: 'Regular -s plural with article change',
        highlight: ['livre', 'livres']
      },
      {
        spanish: 'le château → les châteaux (the castle → the castles)',
        english: 'Irregular -x plural with article change',
        highlight: ['château', 'châteaux']
      }
    ]
  },
  {
    title: 'Regular Plural Formation: Add -S',
    content: `The majority of French nouns form their plural by simply adding **-s** to the singular form. This is the default rule.`,
    subsections: [
      {
        title: 'Standard -S Plurals',
        content: 'Most nouns follow this simple pattern:',
        conjugationTable: {
          title: 'Regular Plural Formation',
          conjugations: [
            { pronoun: 'livre', form: 'livres', english: 'book → books' },
            { pronoun: 'table', form: 'tables', english: 'table → tables' },
            { pronoun: 'ami', form: 'amis', english: 'friend → friends' },
            { pronoun: 'voiture', form: 'voitures', english: 'car → cars' },
            { pronoun: 'maison', form: 'maisons', english: 'house → houses' },
            { pronoun: 'enfant', form: 'enfants', english: 'child → children' }
          ]
        }
      },
      {
        title: 'Nouns Already Ending in -S, -X, -Z',
        content: 'Nouns ending in -s, -x, or -z remain unchanged in the plural:',
        conjugationTable: {
          title: 'Unchanged Plurals',
          conjugations: [
            { pronoun: 'le fils', form: 'les fils', english: 'son → sons (no change)' },
            { pronoun: 'la voix', form: 'les voix', english: 'voice → voices (no change)' },
            { pronoun: 'le nez', form: 'les nez', english: 'nose → noses (no change)' },
            { pronoun: 'le prix', form: 'les prix', english: 'price → prices (no change)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Nouns Ending in -AU, -EAU, -EU: Add -X',
    content: `Nouns ending in **-au**, **-eau**, or **-eu** form their plural by adding **-x** instead of -s.

This is a consistent pattern with very few exceptions.`,
    subsections: [
      {
        title: '-EAU Endings (Most Common)',
        content: 'Very common pattern, especially with -eau nouns:',
        conjugationTable: {
          title: '-EAU → -EAUX',
          conjugations: [
            { pronoun: 'château', form: 'châteaux', english: 'castle → castles' },
            { pronoun: 'bureau', form: 'bureaux', english: 'office → offices' },
            { pronoun: 'cadeau', form: 'cadeaux', english: 'gift → gifts' },
            { pronoun: 'bateau', form: 'bateaux', english: 'boat → boats' },
            { pronoun: 'gâteau', form: 'gâteaux', english: 'cake → cakes' },
            { pronoun: 'niveau', form: 'niveaux', english: 'level → levels' }
          ]
        }
      },
      {
        title: '-EU and -AU Endings',
        content: 'Less common but follow the same -x pattern:',
        conjugationTable: {
          title: '-EU/-AU → -EUX/-AUX',
          conjugations: [
            { pronoun: 'jeu', form: 'jeux', english: 'game → games' },
            { pronoun: 'feu', form: 'feux', english: 'fire → fires' },
            { pronoun: 'lieu', form: 'lieux', english: 'place → places' },
            { pronoun: 'tuyau', form: 'tuyaux', english: 'pipe → pipes' }
          ]
        }
      },
      {
        title: 'Important Exceptions',
        content: 'A few nouns ending in -eu add -s instead of -x:',
        examples: [
          {
            spanish: 'pneu → pneus (tire → tires)',
            english: 'bleu → bleus (blue → blues)',
            highlight: ['pneus', 'bleus']
          }
        ]
      }
    ]
  },
  {
    title: 'Nouns Ending in -AL: Change to -AUX',
    content: `Most nouns ending in **-al** change to **-aux** in the plural. This involves changing both the ending and sometimes the pronunciation.`,
    subsections: [
      {
        title: 'Regular -AL → -AUX Pattern',
        content: 'Most -al nouns follow this pattern:',
        conjugationTable: {
          title: '-AL → -AUX',
          conjugations: [
            { pronoun: 'animal', form: 'animaux', english: 'animal → animals' },
            { pronoun: 'journal', form: 'journaux', english: 'newspaper → newspapers' },
            { pronoun: 'hôpital', form: 'hôpitaux', english: 'hospital → hospitals' },
            { pronoun: 'cheval', form: 'chevaux', english: 'horse → horses' },
            { pronoun: 'canal', form: 'canaux', english: 'canal → canals' }
          ]
        }
      },
      {
        title: 'Exceptions: -AL → -ALS',
        content: 'Some -al nouns simply add -s:',
        conjugationTable: {
          title: 'Exceptions: Add -S Only',
          conjugations: [
            { pronoun: 'festival', form: 'festivals', english: 'festival → festivals' },
            { pronoun: 'bal', form: 'bals', english: 'ball/dance → balls' },
            { pronoun: 'carnaval', form: 'carnavals', english: 'carnival → carnivals' },
            { pronoun: 'récital', form: 'récitals', english: 'recital → recitals' }
          ]
        }
      }
    ]
  },
  {
    title: 'Irregular Plurals',
    content: `Some French nouns have completely irregular plural forms that must be memorized:`,
    subsections: [
      {
        title: 'Common Irregular Plurals',
        content: 'These important nouns have unique plural forms:',
        conjugationTable: {
          title: 'Irregular Plural Forms',
          conjugations: [
            { pronoun: 'œil', form: 'yeux', english: 'eye → eyes' },
            { pronoun: 'ciel', form: 'cieux', english: 'sky → skies' },
            { pronoun: 'travail', form: 'travaux', english: 'work → works' },
            { pronoun: 'vitrail', form: 'vitraux', english: 'stained glass → stained glass windows' }
          ]
        }
      },
      {
        title: 'Compound Nouns',
        content: 'Compound nouns have special plural rules:',
        examples: [
          {
            spanish: 'grand-mère → grands-mères (grandmother → grandmothers)',
            english: 'Both parts change when both are variable',
            highlight: ['grands-mères']
          },
          {
            spanish: 'tire-bouchon → tire-bouchons (corkscrew → corkscrews)',
            english: 'Only the noun part changes',
            highlight: ['tire-bouchons']
          },
          {
            spanish: 'après-midi → après-midi (afternoon → afternoons)',
            english: 'Some compound nouns don\'t change',
            highlight: ['après-midi']
          }
        ]
      }
    ]
  },
  {
    title: 'Plural Agreement Rules',
    content: `When nouns become plural, other sentence elements must agree:

**Articles**: le/la → les, un/une → des
**Adjectives**: Must agree in number (and gender)
**Verbs**: May need plural conjugation with plural subjects

This agreement is essential for grammatical correctness.`,
    examples: [
      {
        spanish: 'le petit chat → les petits chats',
        english: 'Article and adjective both become plural',
        highlight: ['les petits chats']
      },
      {
        spanish: 'une grande maison → des grandes maisons',
        english: 'Article and adjective agree with plural noun',
        highlight: ['des grandes maisons']
      },
      {
        spanish: 'Le chat mange. → Les chats mangent.',
        english: 'Verb conjugation changes with plural subject',
        highlight: ['Les chats mangent']
      }
    ]
  },
  {
    title: 'Common Mistakes to Avoid',
    content: `Here are frequent errors students make with French plurals:

**1. Wrong plural ending**: Using -s instead of -x for -eau nouns
**2. Forgetting agreement**: Not making adjectives plural
**3. Irregular forms**: Using regular patterns for irregular nouns
**4. Already plural**: Adding -s to nouns ending in -s/-x/-z`,
    examples: [
      {
        spanish: '❌ châteaus → ✅ châteaux',
        english: 'Wrong: -eau nouns need -x, not -s',
        highlight: ['châteaux']
      },
      {
        spanish: '❌ les petit chats → ✅ les petits chats',
        english: 'Wrong: adjective must agree in plural',
        highlight: ['petits']
      },
      {
        spanish: '❌ œils → ✅ yeux',
        english: 'Wrong: irregular plural must be memorized',
        highlight: ['yeux']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Gender Rules', url: '/grammar/french/nouns/gender-rules', difficulty: 'beginner' },
  { title: 'French Adjective Agreement', url: '/grammar/french/adjectives/agreement-rules', difficulty: 'beginner' },
  { title: 'French Articles', url: '/grammar/french/nouns/definite-articles', difficulty: 'beginner' },
  { title: 'French Noun Agreement', url: '/grammar/french/nouns/noun-agreement', difficulty: 'intermediate' }
];

export default function FrenchPluralFormationPage() {
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
              topic: 'plural-formation',
              title: 'French Plural Formation Rules',
              description: 'Master French plural formation with regular and irregular patterns. Learn -s, -x endings, exceptions, and special cases.',
              difficulty: 'beginner',
              examples: [
                'livre → livres (book → books)',
                'château → châteaux (castle → castles)',
                'œil → yeux (eye → eyes)',
                'enfant → enfants (child → children)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'nouns',
              topic: 'plural-formation',
              title: 'French Plural Formation Rules'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="nouns"
        topic="plural-formation"
        title="French Plural Formation Rules"
        description="Master French plural formation with regular and irregular patterns. Learn -s, -x endings, exceptions, and special cases"
        difficulty="beginner"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/french/nouns"
        practiceUrl="/grammar/french/nouns/plural-formation/practice"
        quizUrl="/grammar/french/nouns/plural-formation/quiz"
        songUrl="/songs/fr?theme=grammar&topic=plural-formation"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

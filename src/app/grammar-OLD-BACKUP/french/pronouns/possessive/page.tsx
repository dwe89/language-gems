import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'possessive',
  title: 'French Possessive Pronouns (Le Mien, La Tienne, Les Nôtres)',
  description: 'Master French possessive pronouns that replace possessive adjectives + nouns. Learn le mien, la tienne, les nôtres, etc.',
  difficulty: 'intermediate',
  keywords: [
    'french possessive pronouns',
    'le mien la mienne',
    'le tien la tienne',
    'le sien la sienne',
    'les nôtres les vôtres',
    'possessive french grammar'
  ],
  examples: [
    'C\'est le mien (It\'s mine)',
    'La tienne est belle (Yours is beautiful)',
    'Les nôtres sont ici (Ours are here)',
    'Je préfère la sienne (I prefer hers)'
  ]
});

const sections = [
  {
    title: 'Understanding Possessive Pronouns',
    content: `French possessive pronouns **replace** possessive adjectives + nouns to avoid repetition. They mean "mine," "yours," "his," "hers," "ours," "theirs."

Unlike possessive adjectives (mon, ton, son), possessive pronouns **stand alone** and agree with the gender and number of the thing possessed.

They always use the definite article (le, la, les) and change form based on what they replace.`,
    examples: [
      {
        spanish: 'C\'est mon livre. → C\'est le mien. (It\'s my book. → It\'s mine.)',
        english: 'Le mien replaces mon livre',
        highlight: ['le mien']
      },
      {
        spanish: 'J\'aime ta voiture. → J\'aime la tienne. (I like your car. → I like yours.)',
        english: 'La tienne replaces ta voiture',
        highlight: ['la tienne']
      }
    ]
  },
  {
    title: 'Complete Possessive Pronoun System',
    content: `French possessive pronouns have different forms for each person and gender:`,
    subsections: [
      {
        title: 'All Possessive Pronoun Forms',
        content: 'Complete system organized by possessor:',
        conjugationTable: {
          title: 'French Possessive Pronouns',
          conjugations: [
            { pronoun: 'le mien/la mienne/les miens/les miennes', form: 'mine', english: 'C\'est le mien. (It\'s mine.)' },
            { pronoun: 'le tien/la tienne/les tiens/les tiennes', form: 'yours (informal)', english: 'C\'est le tien. (It\'s yours.)' },
            { pronoun: 'le sien/la sienne/les siens/les siennes', form: 'his/hers', english: 'C\'est le sien. (It\'s his/hers.)' },
            { pronoun: 'le nôtre/la nôtre/les nôtres', form: 'ours', english: 'C\'est le nôtre. (It\'s ours.)' },
            { pronoun: 'le vôtre/la vôtre/les vôtres', form: 'yours (formal/plural)', english: 'C\'est le vôtre. (It\'s yours.)' },
            { pronoun: 'le leur/la leur/les leurs', form: 'theirs', english: 'C\'est le leur. (It\'s theirs.)' }
          ]
        }
      }
    ]
  },
  {
    title: 'First Person: MIEN (Mine)',
    content: `Le mien, la mienne, les miens, les miennes = "mine"`,
    examples: [
      {
        spanish: 'Ton livre est intéressant, le mien est ennuyeux. (Your book is interesting, mine is boring.)',
        english: 'Le mien replaces mon livre (masculine)',
        highlight: ['le mien']
      },
      {
        spanish: 'Ta voiture est rouge, la mienne est bleue. (Your car is red, mine is blue.)',
        english: 'La mienne replaces ma voiture (feminine)',
        highlight: ['la mienne']
      }
    ],
    subsections: [
      {
        title: 'MIEN Agreement Examples',
        content: 'How mien agrees with the possessed object:',
        examples: [
          {
            spanish: 'Masculine singular: C\'est mon chat. → C\'est le mien. (It\'s my cat. → It\'s mine.)',
            english: 'Feminine singular: C\'est ma maison. → C\'est la mienne. (It\'s my house. → It\'s mine.)',
            highlight: ['le mien', 'la mienne']
          },
          {
            spanish: 'Masculine plural: Ce sont mes livres. → Ce sont les miens. (They\'re my books. → They\'re mine.)',
            english: 'Feminine plural: Ce sont mes voitures. → Ce sont les miennes. (They\'re my cars. → They\'re mine.)',
            highlight: ['les miens', 'les miennes']
          }
        ]
      }
    ]
  },
  {
    title: 'Second Person: TIEN (Yours)',
    content: `Le tien, la tienne, les tiens, les tiennes = "yours" (informal)`,
    examples: [
      {
        spanish: 'Mon chien est petit, le tien est grand. (My dog is small, yours is big.)',
        english: 'Le tien replaces ton chien',
        highlight: ['le tien']
      },
      {
        spanish: 'Ma sœur est médecin, la tienne est professeure. (My sister is a doctor, yours is a teacher.)',
        english: 'La tienne replaces ta sœur',
        highlight: ['la tienne']
      }
    ],
    subsections: [
      {
        title: 'TIEN vs VÔTRE',
        content: 'Informal vs formal/plural "yours":',
        examples: [
          {
            spanish: 'Informal: Ton livre → le tien (your book → yours)',
            english: 'Formal: Votre livre → le vôtre (your book → yours)',
            highlight: ['le tien', 'le vôtre']
          }
        ]
      }
    ]
  },
  {
    title: 'Third Person: SIEN (His/Hers)',
    content: `Le sien, la sienne, les siens, les siennes = "his" or "hers"`,
    examples: [
      {
        spanish: 'Pierre aime son travail, Marie déteste le sien. (Pierre loves his work, Marie hates hers.)',
        english: 'Le sien refers to Marie\'s work',
        highlight: ['le sien']
      },
      {
        spanish: 'Il cherche sa clé, elle a trouvé la sienne. (He\'s looking for his key, she found hers.)',
        english: 'La sienne refers to her key',
        highlight: ['la sienne']
      }
    ],
    subsections: [
      {
        title: 'SIEN Agreement',
        content: 'Sien agrees with the object, not the possessor:',
        examples: [
          {
            spanish: 'Pierre et son livre → Pierre et le sien (Pierre and his book → Pierre and his)',
            english: 'Marie et son livre → Marie et le sien (Marie and her book → Marie and hers)',
            highlight: ['le sien']
          },
          {
            spanish: 'Both use le sien because livre is masculine, regardless of who owns it',
            english: 'Agreement is with the possessed object, not the possessor',
            highlight: ['le sien']
          }
        ]
      }
    ]
  },
  {
    title: 'Plural Possessors: NÔTRE, VÔTRE, LEUR',
    content: `Plural possessive pronouns have simpler patterns:`,
    subsections: [
      {
        title: 'NÔTRE (Ours)',
        content: 'Le nôtre, la nôtre, les nôtres = "ours":',
        examples: [
          {
            spanish: 'Votre maison est grande, la nôtre est petite. (Your house is big, ours is small.)',
            english: 'La nôtre replaces notre maison',
            highlight: ['la nôtre']
          },
          {
            spanish: 'Vos enfants sont sages, les nôtres sont turbulents. (Your children are well-behaved, ours are rowdy.)',
            english: 'Les nôtres replaces nos enfants',
            highlight: ['les nôtres']
          }
        ]
      },
      {
        title: 'VÔTRE (Yours - Formal/Plural)',
        content: 'Le vôtre, la vôtre, les vôtres = "yours" (formal or plural):',
        examples: [
          {
            spanish: 'Notre projet est fini, le vôtre aussi? (Our project is finished, is yours too?)',
            english: 'Le vôtre replaces votre projet',
            highlight: ['le vôtre']
          }
        ]
      },
      {
        title: 'LEUR (Theirs)',
        content: 'Le leur, la leur, les leurs = "theirs":',
        examples: [
          {
            spanish: 'Notre voiture marche, la leur est en panne. (Our car works, theirs is broken.)',
            english: 'La leur replaces leur voiture',
            highlight: ['la leur']
          }
        ]
      }
    ]
  },
  {
    title: 'Usage with Prepositions',
    content: `Possessive pronouns combine with prepositions like other nouns:`,
    examples: [
      {
        spanish: 'Je pense au mien. (I\'m thinking about mine.)',
        english: 'Au = à + le (mien)',
        highlight: ['au mien']
      },
      {
        spanish: 'Elle parle de la sienne. (She\'s talking about hers.)',
        english: 'De + la sienne',
        highlight: ['de la sienne']
      }
    ],
    subsections: [
      {
        title: 'Contractions with Possessive Pronouns',
        content: 'Standard contractions apply:',
        examples: [
          {
            spanish: 'à + le mien = au mien',
            english: 'de + le tien = du tien',
            highlight: ['au mien', 'du tien']
          },
          {
            spanish: 'à + les nôtres = aux nôtres',
            english: 'de + les leurs = des leurs',
            highlight: ['aux nôtres', 'des leurs']
          }
        ]
      }
    ]
  },
  {
    title: 'Possessive Pronouns vs Adjectives',
    content: `Important distinction between possessive adjectives and pronouns:`,
    subsections: [
      {
        title: 'Adjectives vs Pronouns',
        content: 'Key differences in usage:',
        conjugationTable: {
          title: 'Adjectives vs Pronouns',
          conjugations: [
            { pronoun: 'Adjective + Noun', form: 'mon livre', english: 'my book (adjective modifies noun)' },
            { pronoun: 'Pronoun Alone', form: 'le mien', english: 'mine (pronoun replaces adjective + noun)' },
            { pronoun: 'With Article', form: 'le/la/les + pronoun', english: 'possessive pronouns always use articles' },
            { pronoun: 'Without Article', form: 'mon/ton/son + noun', english: 'possessive adjectives never use articles' }
          ]
        }
      },
      {
        title: 'Side-by-Side Examples',
        content: 'Comparing adjectives and pronouns:',
        examples: [
          {
            spanish: 'Adjective: J\'aime mon travail. (I like my work.)',
            english: 'Pronoun: J\'aime le mien. (I like mine.)',
            highlight: ['mon travail', 'le mien']
          },
          {
            spanish: 'Adjective: Tes idées sont bonnes. (Your ideas are good.)',
            english: 'Pronoun: Les tiennes sont bonnes. (Yours are good.)',
            highlight: ['Tes idées', 'Les tiennes']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Possessive Pronoun Mistakes',
    content: `Here are frequent errors students make:

**1. Missing articles**: Forgetting le/la/les before possessive pronouns
**2. Wrong agreement**: Not matching gender/number of possessed object
**3. Confusion with adjectives**: Using adjectives instead of pronouns
**4. Wrong forms**: Using incorrect possessive pronoun forms`,
    examples: [
      {
        spanish: '❌ C\'est mien → ✅ C\'est le mien',
        english: 'Wrong: must include definite article',
        highlight: ['le mien']
      },
      {
        spanish: '❌ Ma voiture et le mien → ✅ Ma voiture et la mienne',
        english: 'Wrong: voiture is feminine, needs la mienne',
        highlight: ['la mienne']
      },
      {
        spanish: '❌ J\'aime le mien livre → ✅ J\'aime mon livre / J\'aime le mien',
        english: 'Wrong: don\'t mix adjectives and pronouns',
        highlight: ['mon livre', 'le mien']
      },
      {
        spanish: '❌ C\'est le notre → ✅ C\'est le nôtre',
        english: 'Wrong: nôtre needs circumflex accent',
        highlight: ['le nôtre']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Possessive Adjectives', url: '/grammar/french/adjectives/possessive', difficulty: 'beginner' },
  { title: 'French Definite Articles', url: '/grammar/french/nouns/definite-articles', difficulty: 'beginner' },
  { title: 'French Gender Agreement', url: '/grammar/french/nouns/gender-rules', difficulty: 'beginner' },
  { title: 'French Demonstrative Pronouns', url: '/grammar/french/pronouns/demonstrative', difficulty: 'intermediate' }
];

export default function FrenchPossessivePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'pronouns',
              topic: 'possessive',
              title: 'French Possessive Pronouns (Le Mien, La Tienne, Les Nôtres)',
              description: 'Master French possessive pronouns that replace possessive adjectives + nouns. Learn le mien, la tienne, les nôtres, etc.',
              difficulty: 'intermediate',
              examples: [
                'C\'est le mien (It\'s mine)',
                'La tienne est belle (Yours is beautiful)',
                'Les nôtres sont ici (Ours are here)',
                'Je préfère la sienne (I prefer hers)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'possessive',
              title: 'French Possessive Pronouns (Le Mien, La Tienne, Les Nôtres)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="possessive"
        title="French Possessive Pronouns (Le Mien, La Tienne, Les Nôtres)"
        description="Master French possessive pronouns that replace possessive adjectives + nouns. Learn le mien, la tienne, les nôtres, etc"
        difficulty="intermediate"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/possessive/practice"
        quizUrl="/grammar/french/pronouns/possessive/quiz"
        songUrl="/songs/fr?theme=grammar&topic=possessive"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'nouns',
  topic: 'collective-nouns',
  title: 'French Collective Nouns',
  description: 'Master French collective nouns and their agreement patterns. Learn singular nouns representing groups and their verb agreement.',
  difficulty: 'intermediate',
  keywords: [
    'french collective nouns',
    'collective nouns french',
    'group nouns french',
    'french noun agreement',
    'singular plural agreement',
    'french grammar collective'
  ],
  examples: [
    'la famille (the family)',
    'l\'équipe (the team)',
    'le groupe (the group)',
    'la foule (the crowd)'
  ]
});

const sections = [
  {
    title: 'Understanding Collective Nouns',
    content: `Collective nouns are **singular nouns** that represent a **group of people, animals, or things**. In French, these nouns are grammatically singular but refer to multiple entities.

French collective nouns typically take **singular agreement** with verbs and adjectives, unlike English where collective nouns can sometimes take plural agreement.

Understanding collective nouns is important for proper verb agreement and natural French expression.`,
    examples: [
      {
        spanish: 'La famille arrive demain. (The family arrives tomorrow.)',
        english: 'Singular verb with collective noun',
        highlight: ['La famille arrive']
      },
      {
        spanish: 'L\'équipe est prête. (The team is ready.)',
        english: 'Singular adjective agreement',
        highlight: ['L\'équipe est prête']
      },
      {
        spanish: 'Le groupe chante bien. (The group sings well.)',
        english: 'Singular verb form with collective subject',
        highlight: ['Le groupe chante']
      }
    ]
  },
  {
    title: 'Common French Collective Nouns',
    content: `Here are the most frequently used collective nouns in French:`,
    subsections: [
      {
        title: 'People and Family Groups',
        content: 'Collective nouns for groups of people:',
        conjugationTable: {
          title: 'People Collective Nouns',
          conjugations: [
            { pronoun: 'la famille', form: 'feminine', english: 'the family' },
            { pronoun: 'l\'équipe', form: 'feminine', english: 'the team' },
            { pronoun: 'le groupe', form: 'masculine', english: 'the group' },
            { pronoun: 'la foule', form: 'feminine', english: 'the crowd' },
            { pronoun: 'le public', form: 'masculine', english: 'the audience/public' },
            { pronoun: 'la classe', form: 'feminine', english: 'the class' }
          ]
        }
      },
      {
        title: 'Animal Groups',
        content: 'Collective nouns for groups of animals:',
        conjugationTable: {
          title: 'Animal Collective Nouns',
          conjugations: [
            { pronoun: 'le troupeau', form: 'masculine', english: 'the herd/flock' },
            { pronoun: 'la meute', form: 'feminine', english: 'the pack (wolves)' },
            { pronoun: 'l\'essaim', form: 'masculine', english: 'the swarm (bees)' },
            { pronoun: 'le banc', form: 'masculine', english: 'the school (fish)' },
            { pronoun: 'la volée', form: 'feminine', english: 'the flock (birds)' }
          ]
        }
      },
      {
        title: 'Object and Abstract Groups',
        content: 'Collective nouns for groups of things or concepts:',
        examples: [
          {
            spanish: 'la collection (the collection)',
            english: 'le mobilier (the furniture)',
            highlight: ['la collection', 'le mobilier']
          },
          {
            spanish: 'l\'ensemble (the set/ensemble)',
            english: 'la série (the series)',
            highlight: ['l\'ensemble', 'la série']
          },
          {
            spanish: 'la majorité (the majority)',
            english: 'la minorité (the minority)',
            highlight: ['la majorité', 'la minorité']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement Rules with Collective Nouns',
    content: `French collective nouns follow **singular agreement** patterns, even though they represent multiple entities.`,
    examples: [
      {
        spanish: 'La famille française est grande. (The French family is big.)',
        english: 'Singular adjective agreement',
        highlight: ['est grande']
      },
      {
        spanish: 'Cette équipe joue bien. (This team plays well.)',
        english: 'Singular verb and demonstrative agreement',
        highlight: ['Cette équipe joue']
      },
      {
        spanish: 'Le groupe entier participe. (The entire group participates.)',
        english: 'Singular adjective and verb agreement',
        highlight: ['entier participe']
      }
    ],
    subsections: [
      {
        title: 'Verb Agreement',
        content: 'Verbs always agree in singular with collective nouns:',
        examples: [
          {
            spanish: '✅ L\'équipe gagne. (The team wins.)',
            english: '❌ L\'équipe gagnent. (Wrong - plural verb)',
            highlight: ['gagne']
          },
          {
            spanish: '✅ La foule applaudit. (The crowd applauds.)',
            english: '❌ La foule applaudissent. (Wrong - plural verb)',
            highlight: ['applaudit']
          }
        ]
      },
      {
        title: 'Adjective Agreement',
        content: 'Adjectives agree with the gender of the collective noun, not the group members:',
        examples: [
          {
            spanish: 'Une équipe féminine (a women\'s team) - feminine adjective',
            english: 'Adjective agrees with équipe (feminine), not the players',
            highlight: ['féminine']
          },
          {
            spanish: 'Un groupe musical (a musical group) - masculine adjective',
            english: 'Adjective agrees with groupe (masculine)',
            highlight: ['musical']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Cases and Exceptions',
    content: `Some collective expressions have special agreement patterns:`,
    examples: [
      {
        spanish: 'La plupart des étudiants sont présents. (Most students are present.)',
        english: 'La plupart + de + plural noun takes plural agreement',
        highlight: ['sont présents']
      },
      {
        spanish: 'Une foule de gens arrivent. (A crowd of people arrive.)',
        english: 'Sometimes plural agreement when emphasizing individuals',
        highlight: ['arrivent']
      }
    ],
    subsections: [
      {
        title: 'Quantity Expressions',
        content: 'Some quantity expressions with collective meaning:',
        examples: [
          {
            spanish: 'La plupart + de + plural noun → plural agreement',
            english: 'La plupart des enfants jouent. (Most children play.)',
            highlight: ['jouent']
          },
          {
            spanish: 'La majorité + de + plural noun → can be singular or plural',
            english: 'La majorité des gens pense/pensent. (Most people think.)',
            highlight: ['pense/pensent']
          },
          {
            spanish: 'Beaucoup + de + plural noun → plural agreement',
            english: 'Beaucoup d\'étudiants étudient. (Many students study.)',
            highlight: ['étudient']
          }
        ]
      }
    ]
  },
  {
    title: 'Collective Nouns in Context',
    content: `Understanding how collective nouns work in real French sentences:`,
    examples: [
      {
        spanish: 'Notre équipe de football a gagné le match.',
        english: 'Our soccer team won the match.',
        highlight: ['équipe', 'a gagné']
      },
      {
        spanish: 'La famille Martin habite près d\'ici.',
        english: 'The Martin family lives nearby.',
        highlight: ['famille', 'habite']
      },
      {
        spanish: 'Ce groupe de musiciens joue très bien.',
        english: 'This group of musicians plays very well.',
        highlight: ['groupe', 'joue']
      }
    ],
    subsections: [
      {
        title: 'With Prepositions',
        content: 'Collective nouns often appear with prepositions:',
        examples: [
          {
            spanish: 'un membre de l\'équipe (a team member)',
            english: 'le chef du groupe (the group leader)',
            highlight: ['de l\'équipe', 'du groupe']
          },
          {
            spanish: 'au sein de la famille (within the family)',
            english: 'parmi la foule (among the crowd)',
            highlight: ['de la famille', 'la foule']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Expressions with Collective Nouns',
    content: `Many fixed expressions use collective nouns:`,
    examples: [
      {
        spanish: 'en famille (as a family/with family)',
        english: 'en équipe (as a team)',
        highlight: ['en famille', 'en équipe']
      },
      {
        spanish: 'esprit d\'équipe (team spirit)',
        english: 'réunion de famille (family reunion)',
        highlight: ['esprit d\'équipe', 'réunion de famille']
      },
      {
        spanish: 'chef de groupe (group leader)',
        english: 'membre de l\'équipe (team member)',
        highlight: ['chef de groupe', 'membre de l\'équipe']
      }
    ]
  },
  {
    title: 'Common Mistakes to Avoid',
    content: `Here are frequent errors students make with collective nouns:

**1. Plural agreement**: Using plural verbs with collective nouns
**2. Wrong gender**: Forgetting the actual gender of the collective noun
**3. Confusion with English**: Applying English collective noun rules
**4. Quantity expressions**: Wrong agreement with expressions like "la plupart"`,
    examples: [
      {
        spanish: '❌ L\'équipe jouent → ✅ L\'équipe joue',
        english: 'Wrong: collective noun takes singular verb',
        highlight: ['joue']
      },
      {
        spanish: '❌ Le équipe → ✅ L\'équipe',
        english: 'Wrong: équipe is feminine',
        highlight: ['L\'équipe']
      },
      {
        spanish: '❌ La plupart des gens pense → ✅ La plupart des gens pensent',
        english: 'Wrong: la plupart + plural takes plural agreement',
        highlight: ['pensent']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Noun Agreement', url: '/grammar/french/nouns/noun-agreement', difficulty: 'intermediate' },
  { title: 'French Verb Agreement', url: '/grammar/french/verbs/verb-agreement', difficulty: 'intermediate' },
  { title: 'French Quantities', url: '/grammar/french/expressions/quantities', difficulty: 'intermediate' },
  { title: 'French Gender Rules', url: '/grammar/french/nouns/gender-rules', difficulty: 'beginner' }
];

export default function FrenchCollectiveNounsPage() {
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
              topic: 'collective-nouns',
              title: 'French Collective Nouns',
              description: 'Master French collective nouns and their agreement patterns. Learn singular nouns representing groups and their verb agreement.',
              difficulty: 'intermediate',
              examples: [
                'la famille (the family)',
                'l\'équipe (the team)',
                'le groupe (the group)',
                'la foule (the crowd)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'nouns',
              topic: 'collective-nouns',
              title: 'French Collective Nouns'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="nouns"
        topic="collective-nouns"
        title="French Collective Nouns"
        description="Master French collective nouns and their agreement patterns. Learn singular nouns representing groups and their verb agreement"
        difficulty="intermediate"
        estimatedTime={10}
        sections={sections}
        backUrl="/grammar/french/nouns"
        practiceUrl="/grammar/french/nouns/collective-nouns/practice"
        quizUrl="/grammar/french/nouns/collective-nouns/quiz"
        songUrl="/songs/fr?theme=grammar&topic=collective-nouns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

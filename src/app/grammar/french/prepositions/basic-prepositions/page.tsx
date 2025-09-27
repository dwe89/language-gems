import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'prepositions',
  topic: 'basic-prepositions',
  title: 'French Basic Prepositions (À, De, Dans, Sur, Avec, Pour)',
  description: 'Master essential French prepositions for location, direction, and relationships. Learn à, de, dans, sur, avec, pour with usage and examples.',
  difficulty: 'beginner',
  keywords: [
    'french prepositions',
    'à de dans sur',
    'avec pour french',
    'basic prepositions french',
    'french grammar prepositions',
    'location prepositions french'
  ],
  examples: [
    'Je vais à Paris (I\'m going to Paris)',
    'Il vient de France (He comes from France)',
    'Le livre est sur la table (The book is on the table)',
    'Je travaille avec Marie (I work with Marie)'
  ]
});

const sections = [
  {
    title: 'Understanding French Prepositions',
    content: `French prepositions are **connecting words** that show relationships between nouns, pronouns, and other words in a sentence. They express concepts like location, direction, time, manner, and purpose.

Prepositions are essential for expressing where things are, where they're going, when things happen, and how actions are performed.

French prepositions often don't translate directly to English, so learning their specific uses is crucial.`,
    examples: [
      {
        spanish: 'Je vais à l\'école. (I go to school.)',
        english: 'À shows direction/destination',
        highlight: ['à l\'école']
      },
      {
        spanish: 'Le chat est sur la table. (The cat is on the table.)',
        english: 'Sur shows location/position',
        highlight: ['sur la table']
      },
      {
        spanish: 'Il travaille avec moi. (He works with me.)',
        english: 'Avec shows accompaniment',
        highlight: ['avec moi']
      }
    ]
  },
  {
    title: 'À - Direction, Location, and Purpose',
    content: `**À** is one of the most important French prepositions with multiple uses:`,
    examples: [
      {
        spanish: 'Je vais à Paris. (I\'m going to Paris.)',
        english: 'Direction/destination',
        highlight: ['à Paris']
      },
      {
        spanish: 'Il habite à Londres. (He lives in London.)',
        english: 'Location (cities)',
        highlight: ['à Londres']
      },
      {
        spanish: 'Je pense à toi. (I think about you.)',
        english: 'About/of (with certain verbs)',
        highlight: ['à toi']
      }
    ],
    subsections: [
      {
        title: 'À with Cities and Places',
        content: 'Using à for cities and specific locations:',
        conjugationTable: {
          title: 'À + Places',
          conjugations: [
            { pronoun: 'à + city', form: 'à Paris, à Londres', english: 'to/in Paris, to/in London' },
            { pronoun: 'à + school/work', form: 'à l\'école, au bureau', english: 'to/at school, to/at the office' },
            { pronoun: 'à + home', form: 'à la maison', english: 'to/at home' },
            { pronoun: 'à + specific places', form: 'à la gare, au cinéma', english: 'to/at the station, to/at the cinema' }
          ]
        }
      },
      {
        title: 'À Contractions',
        content: 'À contracts with definite articles:',
        examples: [
          {
            spanish: 'à + le = au: Je vais au marché. (I\'m going to the market.)',
            english: 'à + les = aux: Il parle aux enfants. (He speaks to the children.)',
            highlight: ['au marché', 'aux enfants']
          },
          {
            spanish: 'à + la = à la: Elle va à la banque. (She goes to the bank.)',
            english: 'à + l\' = à l\': Nous allons à l\'hôpital. (We go to the hospital.)',
            highlight: ['à la banque', 'à l\'hôpital']
          }
        ]
      },
      {
        title: 'À with Verbs',
        content: 'Many verbs require à:',
        examples: [
          {
            spanish: 'penser à (to think about): Je pense à mes vacances. (I think about my vacation.)',
            english: 'parler à (to speak to): Elle parle à son ami. (She speaks to her friend.)',
            highlight: ['penser à', 'parler à']
          }
        ]
      }
    ]
  },
  {
    title: 'DE - Origin, Possession, and Material',
    content: `**De** expresses origin, possession, material, and is used with many verbs:`,
    examples: [
      {
        spanish: 'Je viens de France. (I come from France.)',
        english: 'Origin/source',
        highlight: ['de France']
      },
      {
        spanish: 'C\'est le livre de Marie. (It\'s Marie\'s book.)',
        english: 'Possession',
        highlight: ['de Marie']
      },
      {
        spanish: 'Une table de bois. (A wooden table.)',
        english: 'Material',
        highlight: ['de bois']
      }
    ],
    subsections: [
      {
        title: 'DE Contractions',
        content: 'De contracts with definite articles:',
        examples: [
          {
            spanish: 'de + le = du: Je viens du bureau. (I come from the office.)',
            english: 'de + les = des: Il parle des enfants. (He talks about the children.)',
            highlight: ['du bureau', 'des enfants']
          },
          {
            spanish: 'de + la = de la: Elle sort de la maison. (She leaves the house.)',
            english: 'de + l\' = de l\': Nous venons de l\'école. (We come from school.)',
            highlight: ['de la maison', 'de l\'école']
          }
        ]
      },
      {
        title: 'DE with Verbs',
        content: 'Common verbs that require de:',
        conjugationTable: {
          title: 'Verbs + DE',
          conjugations: [
            { pronoun: 'venir de', form: 'to come from', english: 'Je viens de Paris.' },
            { pronoun: 'parler de', form: 'to talk about', english: 'Il parle de son travail.' },
            { pronoun: 'avoir besoin de', form: 'to need', english: 'J\'ai besoin de repos.' },
            { pronoun: 'avoir peur de', form: 'to be afraid of', english: 'Elle a peur des araignées.' }
          ]
        }
      }
    ]
  },
  {
    title: 'DANS - Inside/Within',
    content: `**Dans** means "in" or "inside" and expresses containment or time periods:`,
    examples: [
      {
        spanish: 'Le livre est dans le sac. (The book is in the bag.)',
        english: 'Physical containment',
        highlight: ['dans le sac']
      },
      {
        spanish: 'Je pars dans une heure. (I\'m leaving in an hour.)',
        english: 'Time (future)',
        highlight: ['dans une heure']
      },
      {
        spanish: 'Il habite dans cette rue. (He lives on this street.)',
        english: 'Within an area',
        highlight: ['dans cette rue']
      }
    ],
    subsections: [
      {
        title: 'DANS vs EN',
        content: 'Important distinction between dans and en:',
        examples: [
          {
            spanish: 'Dans: containment/specific time: dans la boîte (in the box), dans deux jours (in two days)',
            english: 'En: general location/duration: en France (in France), en été (in summer)',
            highlight: ['dans la boîte', 'en France']
          }
        ]
      }
    ]
  },
  {
    title: 'SUR - On/About',
    content: `**Sur** means "on," "upon," or "about" (topic):`,
    examples: [
      {
        spanish: 'Le livre est sur la table. (The book is on the table.)',
        english: 'Physical position on top',
        highlight: ['sur la table']
      },
      {
        spanish: 'Un livre sur l\'histoire. (A book about history.)',
        english: 'Topic/subject',
        highlight: ['sur l\'histoire']
      },
      {
        spanish: 'Il travaille sur un projet. (He\'s working on a project.)',
        english: 'Working on something',
        highlight: ['sur un projet']
      }
    ],
    subsections: [
      {
        title: 'SUR Usage Patterns',
        content: 'Common uses of sur:',
        examples: [
          {
            spanish: 'Position: sur la chaise (on the chair)',
            english: 'Topic: un film sur la guerre (a movie about war)',
            highlight: ['sur la chaise', 'sur la guerre']
          },
          {
            spanish: 'Proportion: trois sur dix (three out of ten)',
            english: 'Internet: sur Internet (on the Internet)',
            highlight: ['trois sur dix', 'sur Internet']
          }
        ]
      }
    ]
  },
  {
    title: 'AVEC - With/Together',
    content: `**Avec** means "with" and expresses accompaniment or means:`,
    examples: [
      {
        spanish: 'Je vais avec Marie. (I\'m going with Marie.)',
        english: 'Accompaniment',
        highlight: ['avec Marie']
      },
      {
        spanish: 'Il écrit avec un stylo. (He writes with a pen.)',
        english: 'Instrument/means',
        highlight: ['avec un stylo']
      },
      {
        spanish: 'Elle est gentille avec moi. (She is kind to me.)',
        english: 'Manner toward someone',
        highlight: ['avec moi']
      }
    ],
    subsections: [
      {
        title: 'AVEC Usage',
        content: 'Different uses of avec:',
        conjugationTable: {
          title: 'AVEC Uses',
          conjugations: [
            { pronoun: 'Accompaniment', form: 'avec des amis', english: 'with friends' },
            { pronoun: 'Instrument', form: 'avec une fourchette', english: 'with a fork' },
            { pronoun: 'Manner', form: 'avec plaisir', english: 'with pleasure' },
            { pronoun: 'Characteristics', form: 'un homme avec des lunettes', english: 'a man with glasses' }
          ]
        }
      }
    ]
  },
  {
    title: 'POUR - For/In Order To',
    content: `**Pour** means "for" and expresses purpose, destination, or duration:`,
    examples: [
      {
        spanish: 'C\'est pour toi. (It\'s for you.)',
        english: 'Intended recipient',
        highlight: ['pour toi']
      },
      {
        spanish: 'Je pars pour Paris. (I\'m leaving for Paris.)',
        english: 'Destination',
        highlight: ['pour Paris']
      },
      {
        spanish: 'Il étudie pour réussir. (He studies in order to succeed.)',
        english: 'Purpose',
        highlight: ['pour réussir']
      }
    ],
    subsections: [
      {
        title: 'POUR vs PENDANT',
        content: 'Distinction between pour and pendant for time:',
        examples: [
          {
            spanish: 'Pour: intended duration: Je pars pour trois jours. (I\'m leaving for three days.)',
            english: 'Pendant: actual duration: J\'ai travaillé pendant trois heures. (I worked for three hours.)',
            highlight: ['pour trois jours', 'pendant trois heures']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Essential Prepositions',
    content: `Additional important basic prepositions:`,
    subsections: [
      {
        title: 'SANS (Without)',
        content: 'Expressing absence or lack:',
        examples: [
          {
            spanish: 'Il part sans moi. (He leaves without me.)',
            english: 'Je bois du café sans sucre. (I drink coffee without sugar.)',
            highlight: ['sans moi', 'sans sucre']
          }
        ]
      },
      {
        title: 'SOUS (Under)',
        content: 'Expressing position below:',
        examples: [
          {
            spanish: 'Le chat est sous la table. (The cat is under the table.)',
            english: 'sous la pluie (in the rain/under the rain)',
            highlight: ['sous la table', 'sous la pluie']
          }
        ]
      },
      {
        title: 'ENTRE (Between)',
        content: 'Expressing position between two things:',
        examples: [
          {
            spanish: 'Je suis entre mes amis. (I am between my friends.)',
            english: 'entre nous (between us)',
            highlight: ['entre mes amis', 'entre nous']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Preposition Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong preposition choice**: Using English logic for French prepositions
**2. Missing contractions**: Not contracting à/de with articles
**3. Literal translation**: Translating English prepositions directly
**4. Verb requirements**: Not knowing which verbs require which prepositions`,
    examples: [
      {
        spanish: '❌ Je vais en Paris → ✅ Je vais à Paris',
        english: 'Wrong: cities use à, not en',
        highlight: ['à Paris']
      },
      {
        spanish: '❌ Je vais à le magasin → ✅ Je vais au magasin',
        english: 'Wrong: must contract à + le = au',
        highlight: ['au magasin']
      },
      {
        spanish: '❌ Je pense sur toi → ✅ Je pense à toi',
        english: 'Wrong: penser requires à, not sur',
        highlight: ['pense à toi']
      },
      {
        spanish: '❌ dans la télévision → ✅ à la télévision',
        english: 'Wrong: use à for "on TV," not dans',
        highlight: ['à la télévision']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Contractions', url: '/grammar/french/nouns/contractions', difficulty: 'beginner' },
  { title: 'French Verbs with À', url: '/grammar/french/verbs/preposition-a', difficulty: 'intermediate' },
  { title: 'French Verbs with DE', url: '/grammar/french/verbs/preposition-de', difficulty: 'intermediate' },
  { title: 'French Location Expressions', url: '/grammar/french/expressions/location', difficulty: 'beginner' }
];

export default function FrenchBasicPrepositionsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'prepositions',
              topic: 'basic-prepositions',
              title: 'French Basic Prepositions (À, De, Dans, Sur, Avec, Pour)',
              description: 'Master essential French prepositions for location, direction, and relationships. Learn à, de, dans, sur, avec, pour with usage and examples.',
              difficulty: 'beginner',
              examples: [
                'Je vais à Paris (I\'m going to Paris)',
                'Il vient de France (He comes from France)',
                'Le livre est sur la table (The book is on the table)',
                'Je travaille avec Marie (I work with Marie)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'prepositions',
              topic: 'basic-prepositions',
              title: 'French Basic Prepositions (À, De, Dans, Sur, Avec, Pour)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="prepositions"
        topic="basic-prepositions"
        title="French Basic Prepositions (À, De, Dans, Sur, Avec, Pour)"
        description="Master essential French prepositions for location, direction, and relationships. Learn à, de, dans, sur, avec, pour with usage and examples"
        difficulty="beginner"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/french/prepositions"
        practiceUrl="/grammar/french/prepositions/basic-prepositions/practice"
        quizUrl="/grammar/french/prepositions/basic-prepositions/quiz"
        songUrl="/songs/fr?theme=grammar&topic=basic-prepositions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

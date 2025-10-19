import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'prepositions',
  topic: 'location',
  title: 'French Location Prepositions (En, Au, Aux, Chez, Devant)',
  description: 'Master French prepositions for expressing location and position. Learn en, au, aux, chez, devant, derrière with countries, places, and positions.',
  difficulty: 'intermediate',
  keywords: [
    'french location prepositions',
    'en au aux french',
    'chez devant derrière',
    'countries prepositions french',
    'position prepositions french',
    'where french grammar'
  ],
  examples: [
    'Je vis en France (I live in France)',
    'Il va au Canada (He goes to Canada)',
    'Elle est chez Marie (She is at Marie\'s)',
    'Le chat est devant la maison (The cat is in front of the house)'
  ]
});

const sections = [
  {
    title: 'Understanding Location Prepositions',
    content: `French location prepositions express **where** something is or **where** someone is going. They are essential for describing positions, destinations, and spatial relationships.

Location prepositions have specific rules depending on:
**Gender and number** of countries
**Type of place** (home, business, institution)
**Spatial relationships** (in front of, behind, next to)

Mastering these prepositions is crucial for giving directions and describing locations.`,
    examples: [
      {
        spanish: 'J\'habite en Espagne. (I live in Spain.)',
        english: 'Feminine country uses en',
        highlight: ['en Espagne']
      },
      {
        spanish: 'Il va au Japon. (He goes to Japan.)',
        english: 'Masculine country uses au',
        highlight: ['au Japon']
      },
      {
        spanish: 'Elle est chez le médecin. (She is at the doctor\'s.)',
        english: 'At someone\'s place uses chez',
        highlight: ['chez le médecin']
      }
    ]
  },
  {
    title: 'Countries and Continents',
    content: `Prepositions with countries depend on their gender and number:`,
    subsections: [
      {
        title: 'EN - Feminine Countries',
        content: 'Use EN with feminine countries (most ending in -e):',
        examples: [
          {
            spanish: 'Je vis en France. (I live in France.)',
            english: 'Elle va en Italie. (She goes to Italy.)',
            highlight: ['en France', 'en Italie']
          },
          {
            spanish: 'Il habite en Espagne. (He lives in Spain.)',
            english: 'Nous voyageons en Allemagne. (We travel to Germany.)',
            highlight: ['en Espagne', 'en Allemagne']
          }
        ]
      },
      {
        title: 'AU - Masculine Countries',
        content: 'Use AU with masculine countries:',
        examples: [
          {
            spanish: 'Il va au Japon. (He goes to Japan.)',
            english: 'Elle habite au Canada. (She lives in Canada.)',
            highlight: ['au Japon', 'au Canada']
          },
          {
            spanish: 'Nous allons au Brésil. (We go to Brazil.)',
            english: 'Il travaille au Mexique. (He works in Mexico.)',
            highlight: ['au Brésil', 'au Mexique']
          }
        ]
      },
      {
        title: 'AUX - Plural Countries',
        content: 'Use AUX with plural countries:',
        examples: [
          {
            spanish: 'Il va aux États-Unis. (He goes to the United States.)',
            english: 'Elle habite aux Pays-Bas. (She lives in the Netherlands.)',
            highlight: ['aux États-Unis', 'aux Pays-Bas']
          }
        ]
      },
      {
        title: 'Country Gender Rules',
        content: 'How to determine country gender:',
        conjugationTable: {
          title: 'Country Prepositions',
          conjugations: [
            { pronoun: 'Feminine (-e)', form: 'en + country', english: 'en France, en Chine, en Russie' },
            { pronoun: 'Masculine', form: 'au + country', english: 'au Japon, au Canada, au Maroc' },
            { pronoun: 'Plural', form: 'aux + country', english: 'aux États-Unis, aux Philippines' },
            { pronoun: 'Islands', form: 'à + island', english: 'à Cuba, à Madagascar' }
          ]
        }
      }
    ]
  },
  {
    title: 'Cities and Regions',
    content: `Different rules apply to cities and regions:`,
    examples: [
      {
        spanish: 'Je vais à Paris. (I go to Paris.)',
        english: 'Cities use à',
        highlight: ['à Paris']
      },
      {
        spanish: 'Il habite à New York. (He lives in New York.)',
        english: 'All cities use à',
        highlight: ['à New York']
      }
    ],
    subsections: [
      {
        title: 'Cities',
        content: 'All cities use À regardless of gender:',
        examples: [
          {
            spanish: 'à Londres (to/in London)',
            english: 'à Tokyo (to/in Tokyo)',
            highlight: ['à Londres', 'à Tokyo']
          },
          {
            spanish: 'à Rome (to/in Rome)',
            english: 'à Berlin (to/in Berlin)',
            highlight: ['à Rome', 'à Berlin']
          }
        ]
      },
      {
        title: 'French Regions',
        content: 'French regions follow country rules:',
        examples: [
          {
            spanish: 'en Provence (feminine region)',
            english: 'en Bretagne (feminine region)',
            highlight: ['en Provence', 'en Bretagne']
          },
          {
            spanish: 'dans le Nord (masculine region with article)',
            english: 'dans les Alpes (plural region)',
            highlight: ['dans le Nord', 'dans les Alpes']
          }
        ]
      }
    ]
  },
  {
    title: 'CHEZ - At Someone\'s Place',
    content: `**Chez** means "at someone\'s place" or "at a professional\'s":`,
    examples: [
      {
        spanish: 'Je vais chez Marie. (I\'m going to Marie\'s place.)',
        english: 'At someone\'s home',
        highlight: ['chez Marie']
      },
      {
        spanish: 'Il est chez le médecin. (He is at the doctor\'s.)',
        english: 'At a professional\'s office',
        highlight: ['chez le médecin']
      },
      {
        spanish: 'Nous mangeons chez mes parents. (We eat at my parents\' place.)',
        english: 'At family\'s home',
        highlight: ['chez mes parents']
      }
    ],
    subsections: [
      {
        title: 'CHEZ Usage Patterns',
        content: 'Common uses of chez:',
        conjugationTable: {
          title: 'CHEZ Uses',
          conjugations: [
            { pronoun: 'People\'s homes', form: 'chez + person', english: 'chez Pierre, chez nous' },
            { pronoun: 'Professionals', form: 'chez le/la + profession', english: 'chez le dentiste, chez la coiffeuse' },
            { pronoun: 'Businesses', form: 'chez + business name', english: 'chez Carrefour, chez McDonald\'s' },
            { pronoun: 'Characteristics', form: 'chez + group', english: 'chez les Français (among the French)' }
          ]
        }
      },
      {
        title: 'CHEZ vs À LA MAISON',
        content: 'Distinction between chez and à la maison:',
        examples: [
          {
            spanish: 'chez moi (at my place - specific person)',
            english: 'à la maison (at home - general concept)',
            highlight: ['chez moi', 'à la maison']
          }
        ]
      }
    ]
  },
  {
    title: 'Position and Direction Prepositions',
    content: `Prepositions expressing spatial relationships:`,
    subsections: [
      {
        title: 'DEVANT (In Front Of)',
        content: 'Expressing position in front:',
        examples: [
          {
            spanish: 'La voiture est devant la maison. (The car is in front of the house.)',
            english: 'Il attend devant l\'école. (He waits in front of the school.)',
            highlight: ['devant la maison', 'devant l\'école']
          }
        ]
      },
      {
        title: 'DERRIÈRE (Behind)',
        content: 'Expressing position behind:',
        examples: [
          {
            spanish: 'Le jardin est derrière la maison. (The garden is behind the house.)',
            english: 'Elle se cache derrière l\'arbre. (She hides behind the tree.)',
            highlight: ['derrière la maison', 'derrière l\'arbre']
          }
        ]
      },
      {
        title: 'À CÔTÉ DE (Next To)',
        content: 'Expressing position beside:',
        examples: [
          {
            spanish: 'La banque est à côté du supermarché. (The bank is next to the supermarket.)',
            english: 'Il s\'assoit à côté de moi. (He sits next to me.)',
            highlight: ['à côté du supermarché', 'à côté de moi']
          }
        ]
      },
      {
        title: 'Other Position Prepositions',
        content: 'Additional spatial prepositions:',
        conjugationTable: {
          title: 'Position Prepositions',
          conjugations: [
            { pronoun: 'près de', form: 'near', english: 'près de la gare (near the station)' },
            { pronoun: 'loin de', form: 'far from', english: 'loin de Paris (far from Paris)' },
            { pronoun: 'en face de', form: 'across from', english: 'en face de l\'école (across from school)' },
            { pronoun: 'au-dessus de', form: 'above', english: 'au-dessus de la table (above the table)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Institutions and Buildings',
    content: `Specific prepositions for institutions and buildings:`,
    examples: [
      {
        spanish: 'à l\'école (at/to school)',
        english: 'à l\'hôpital (at/to the hospital)',
        highlight: ['à l\'école', 'à l\'hôpital']
      },
      {
        spanish: 'à la banque (at/to the bank)',
        english: 'au bureau (at/to the office)',
        highlight: ['à la banque', 'au bureau']
      }
    ],
    subsections: [
      {
        title: 'Common Institutions',
        content: 'Prepositions with common places:',
        examples: [
          {
            spanish: 'à l\'université (at/to university)',
            english: 'à la bibliothèque (at/to the library)',
            highlight: ['à l\'université', 'à la bibliothèque']
          },
          {
            spanish: 'au musée (at/to the museum)',
            english: 'à la poste (at/to the post office)',
            highlight: ['au musée', 'à la poste']
          }
        ]
      },
      {
        title: 'EN vs À with Institutions',
        content: 'Some institutions can use different prepositions:',
        examples: [
          {
            spanish: 'à l\'école (going to/at school - specific)',
            english: 'en classe (in class - general state)',
            highlight: ['à l\'école', 'en classe']
          }
        ]
      }
    ]
  },
  {
    title: 'Transportation and Movement',
    content: `Prepositions with means of transportation:`,
    examples: [
      {
        spanish: 'en voiture (by car)',
        english: 'en train (by train)',
        highlight: ['en voiture', 'en train']
      },
      {
        spanish: 'à pied (on foot)',
        english: 'à vélo (by bike)',
        highlight: ['à pied', 'à vélo']
      }
    ],
    subsections: [
      {
        title: 'Transportation Prepositions',
        content: 'Different prepositions for different transport:',
        conjugationTable: {
          title: 'Transportation',
          conjugations: [
            { pronoun: 'EN + enclosed', form: 'en voiture, en train', english: 'by car, by train' },
            { pronoun: 'À + open/personal', form: 'à pied, à vélo', english: 'on foot, by bike' },
            { pronoun: 'EN + air/sea', form: 'en avion, en bateau', english: 'by plane, by boat' },
            { pronoun: 'Special cases', form: 'dans le bus, dans le métro', english: 'on the bus, on the metro' }
          ]
        }
      }
    ]
  },
  {
    title: 'Common Location Preposition Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong country prepositions**: Using en with masculine countries
**2. City confusion**: Using en with cities instead of à
**3. Chez misuse**: Using chez with places instead of people
**4. Missing contractions**: Not contracting prepositions with articles`,
    examples: [
      {
        spanish: '❌ Je vais en Japon → ✅ Je vais au Japon',
        english: 'Wrong: Japon is masculine, needs au',
        highlight: ['au Japon']
      },
      {
        spanish: '❌ Il habite en Paris → ✅ Il habite à Paris',
        english: 'Wrong: cities always use à',
        highlight: ['à Paris']
      },
      {
        spanish: '❌ Je vais chez l\'école → ✅ Je vais à l\'école',
        english: 'Wrong: chez is for people, not places',
        highlight: ['à l\'école']
      },
      {
        spanish: '❌ à côté de le magasin → ✅ à côté du magasin',
        english: 'Wrong: must contract de + le = du',
        highlight: ['du magasin']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Basic Prepositions', url: '/grammar/french/prepositions/basic-prepositions', difficulty: 'beginner' },
  { title: 'French Countries and Nationalities', url: '/grammar/french/vocabulary/countries', difficulty: 'beginner' },
  { title: 'French Contractions', url: '/grammar/french/nouns/contractions', difficulty: 'beginner' },
  { title: 'French Direction Expressions', url: '/grammar/french/expressions/directions', difficulty: 'intermediate' }
];

export default function FrenchLocationPrepositionsPage() {
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
              topic: 'location',
              title: 'French Location Prepositions (En, Au, Aux, Chez, Devant)',
              description: 'Master French prepositions for expressing location and position. Learn en, au, aux, chez, devant, derrière with countries, places, and positions.',
              difficulty: 'intermediate',
              examples: [
                'Je vis en France (I live in France)',
                'Il va au Canada (He goes to Canada)',
                'Elle est chez Marie (She is at Marie\'s)',
                'Le chat est devant la maison (The cat is in front of the house)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'prepositions',
              topic: 'location',
              title: 'French Location Prepositions (En, Au, Aux, Chez, Devant)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="prepositions"
        topic="location"
        title="French Location Prepositions (En, Au, Aux, Chez, Devant)"
        description="Master French prepositions for expressing location and position. Learn en, au, aux, chez, devant, derrière with countries, places, and positions"
        difficulty="intermediate"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/french/prepositions"
        practiceUrl="/grammar/french/prepositions/location/practice"
        quizUrl="/grammar/french/prepositions/location/quiz"
        songUrl="/songs/fr?theme=grammar&topic=location"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

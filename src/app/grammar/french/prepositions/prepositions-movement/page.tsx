import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'prepositions',
  topic: 'prepositions-movement',
  title: 'French Movement Prepositions (Vers, Chez, À travers, Le long de)',
  description: 'Master French movement and direction prepositions including vers, chez, à travers, le long de. Learn to express motion and direction.',
  difficulty: 'intermediate',
  keywords: [
    'french movement prepositions',
    'vers chez à travers',
    'french direction prepositions',
    'motion prepositions french',
    'le long de french',
    'movement expressions french'
  ],
  examples: [
    'Je vais vers la gare. (I\'m going towards the station.)',
    'Il va chez le médecin. (He\'s going to the doctor\'s.)',
    'Nous marchons à travers le parc. (We\'re walking through the park.)',
    'Elle court le long de la rivière. (She runs along the river.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Movement Prepositions',
    content: `French movement prepositions express **direction**, **motion**, and **spatial relationships** involving movement. They indicate:

**Types of movement:**
- **Direction towards**: vers (towards), en direction de (in the direction of)
- **Destination**: chez (to someone's place), à (to a place)
- **Path through**: à travers (through), par (through/by way of)
- **Movement along**: le long de (along), autour de (around)
- **Movement from**: de (from), depuis (from/since)

These prepositions are essential for describing **where you're going**, **how you're getting there**, and **the path you're taking**. Understanding the nuances helps create precise and natural French expressions.`,
    examples: [
      {
        spanish: 'Je marche vers l\'école. (I\'m walking towards the school.)',
        english: 'Direction - movement in the direction of a place',
        highlight: ['vers l\'école']
      },
      {
        spanish: 'Elle passe par le centre-ville. (She goes through downtown.)',
        english: 'Path - route taken to reach destination',
        highlight: ['par le centre-ville']
      },
      {
        spanish: 'Nous courons le long de la plage. (We run along the beach.)',
        english: 'Parallel movement - following a line or edge',
        highlight: ['le long de la plage']
      }
    ]
  },
  {
    title: 'VERS - Direction Towards',
    content: `**VERS** expresses **direction** or **movement towards** something without necessarily reaching it:`,
    examples: [
      {
        spanish: 'L\'avion vole vers Paris. (The plane is flying towards Paris.)',
        english: 'Il se dirige vers la sortie. (He\'s heading towards the exit.)',
        highlight: ['vers Paris', 'vers la sortie']
      },
      {
        spanish: 'Elle regarde vers le ciel. (She looks towards the sky.)',
        english: 'Nous marchons vers la mer. (We\'re walking towards the sea.)',
        highlight: ['vers le ciel', 'vers la mer']
      }
    ],
    subsections: [
      {
        title: 'VERS vs À',
        content: 'Important distinction:',
        examples: [
          {
            spanish: 'VERS = direction (may not reach): Je vais vers la gare.',
            english: 'À = destination (will reach): Je vais à la gare.',
            highlight: ['vers la gare', 'à la gare']
          }
        ]
      },
      {
        title: 'Time Usage of VERS',
        content: 'VERS also means "around" with time:',
        examples: [
          {
            spanish: 'Il arrive vers 8 heures. (He arrives around 8 o\'clock.)',
            english: 'Vers midi, nous mangeons. (Around noon, we eat.)',
            highlight: ['vers 8 heures', 'Vers midi']
          }
        ]
      }
    ]
  },
  {
    title: 'CHEZ - To Someone\'s Place',
    content: `**CHEZ** means **"to/at someone's place"** or **"to a professional's office"**:`,
    conjugationTable: {
      title: 'CHEZ Usage Patterns',
      conjugations: [
        { pronoun: 'chez + person', form: 'to/at someone\'s place', english: 'chez Marie (to/at Marie\'s place)' },
        { pronoun: 'chez + profession', form: 'to professional\'s office', english: 'chez le médecin (to the doctor\'s)' },
        { pronoun: 'chez + pronoun', form: 'to/at my/your place', english: 'chez moi (to/at my place)' },
        { pronoun: 'chez + company', form: 'at/with company', english: 'chez Renault (at Renault)' }
      ]
    },
    subsections: [
      {
        title: 'Personal Places',
        content: 'Going to someone\'s home:',
        examples: [
          {
            spanish: 'Je vais chez mes parents. (I\'m going to my parents\' place.)',
            english: 'Viens chez moi ce soir. (Come to my place tonight.)',
            highlight: ['chez mes parents', 'chez moi']
          }
        ]
      },
      {
        title: 'Professional Places',
        content: 'Going to professional services:',
        examples: [
          {
            spanish: 'Il va chez le dentiste. (He\'s going to the dentist\'s.)',
            english: 'Elle travaille chez un avocat. (She works at a lawyer\'s office.)',
            highlight: ['chez le dentiste', 'chez un avocat']
          }
        ]
      },
      {
        title: 'Companies and Brands',
        content: 'Working at or shopping at companies:',
        examples: [
          {
            spanish: 'Je travaille chez Google. (I work at Google.)',
            english: 'Nous achetons chez Carrefour. (We shop at Carrefour.)',
            highlight: ['chez Google', 'chez Carrefour']
          }
        ]
      }
    ]
  },
  {
    title: 'À TRAVERS - Through/Across',
    content: `**À TRAVERS** means **"through"** or **"across"**, indicating movement from one side to another:`,
    examples: [
      {
        spanish: 'Nous marchons à travers la forêt. (We walk through the forest.)',
        english: 'La lumière passe à travers la fenêtre. (Light passes through the window.)',
        highlight: ['à travers la forêt', 'à travers la fenêtre']
      },
      {
        spanish: 'Il nage à travers la rivière. (He swims across the river.)',
        english: 'Elle regarde à travers les rideaux. (She looks through the curtains.)',
        highlight: ['à travers la rivière', 'à travers les rideaux']
      }
    ],
    subsections: [
      {
        title: 'Physical Movement',
        content: 'Moving through physical spaces:',
        examples: [
          {
            spanish: 'Le train passe à travers le tunnel. (The train goes through the tunnel.)',
            english: 'Nous voyageons à travers l\'Europe. (We travel through Europe.)',
            highlight: ['à travers le tunnel', 'à travers l\'Europe']
          }
        ]
      },
      {
        title: 'Figurative Usage',
        content: 'Abstract or metaphorical "through":',
        examples: [
          {
            spanish: 'À travers ses yeux, je vois la vérité. (Through his eyes, I see the truth.)',
            english: 'Il apprend à travers l\'expérience. (He learns through experience.)',
            highlight: ['À travers ses yeux', 'à travers l\'expérience']
          }
        ]
      }
    ]
  },
  {
    title: 'LE LONG DE - Along',
    content: `**LE LONG DE** means **"along"**, indicating movement parallel to something:`,
    examples: [
      {
        spanish: 'Nous nous promenons le long de la Seine. (We stroll along the Seine.)',
        english: 'Les arbres poussent le long de la route. (Trees grow along the road.)',
        highlight: ['le long de la Seine', 'le long de la route']
      },
      {
        spanish: 'Il court le long du mur. (He runs along the wall.)',
        english: 'Des fleurs poussent le long du chemin. (Flowers grow along the path.)',
        highlight: ['le long du mur', 'le long du chemin']
      }
    ],
    subsections: [
      {
        title: 'Natural Features',
        content: 'Movement along natural elements:',
        examples: [
          {
            spanish: 'Nous roulons le long de la côte. (We drive along the coast.)',
            english: 'Elle marche le long de la plage. (She walks along the beach.)',
            highlight: ['le long de la côte', 'le long de la plage']
          }
        ]
      },
      {
        title: 'Man-made Structures',
        content: 'Movement along built features:',
        examples: [
          {
            spanish: 'Le bus roule le long de l\'avenue. (The bus drives along the avenue.)',
            english: 'Des magasins s\'alignent le long de la rue. (Shops line up along the street.)',
            highlight: ['le long de l\'avenue', 'le long de la rue']
          }
        ]
      }
    ]
  },
  {
    title: 'PAR - Through/By Way Of',
    content: `**PAR** indicates **the route taken** or **means of passage**:`,
    examples: [
      {
        spanish: 'Je passe par Lyon pour aller à Marseille. (I go through Lyon to get to Marseille.)',
        english: 'Il entre par la porte principale. (He enters through the main door.)',
        highlight: ['par Lyon', 'par la porte principale']
      },
      {
        spanish: 'Nous voyageons par le train. (We travel by train.)',
        english: 'Elle envoie la lettre par la poste. (She sends the letter by mail.)',
        highlight: ['par le train', 'par la poste']
      }
    ],
    subsections: [
      {
        title: 'Route/Path',
        content: 'Specific route taken:',
        examples: [
          {
            spanish: 'Pour aller à Paris, je passe par Reims. (To go to Paris, I go through Reims.)',
            english: 'Il sort par la fenêtre. (He goes out through the window.)',
            highlight: ['par Reims', 'par la fenêtre']
          }
        ]
      },
      {
        title: 'Means of Transport',
        content: 'Method of transportation:',
        examples: [
          {
            spanish: 'Nous partons par avion. (We\'re leaving by plane.)',
            english: 'Il voyage par bateau. (He travels by boat.)',
            highlight: ['par avion', 'par bateau']
          }
        ]
      }
    ]
  },
  {
    title: 'AUTOUR DE - Around',
    content: `**AUTOUR DE** means **"around"**, indicating circular or surrounding movement:`,
    examples: [
      {
        spanish: 'Nous marchons autour du lac. (We walk around the lake.)',
        english: 'Les enfants courent autour de l\'arbre. (The children run around the tree.)',
        highlight: ['autour du lac', 'autour de l\'arbre']
      },
      {
        spanish: 'Il y a un jardin autour de la maison. (There\'s a garden around the house.)',
        english: 'Elle met ses bras autour de lui. (She puts her arms around him.)',
        highlight: ['autour de la maison', 'autour de lui']
      }
    ],
    subsections: [
      {
        title: 'Circular Movement',
        content: 'Moving in a circle:',
        examples: [
          {
            spanish: 'La Terre tourne autour du Soleil. (Earth revolves around the Sun.)',
            english: 'Nous dansons autour du feu. (We dance around the fire.)',
            highlight: ['autour du Soleil', 'autour du feu']
          }
        ]
      },
      {
        title: 'Surrounding Position',
        content: 'Being positioned around something:',
        examples: [
          {
            spanish: 'Des montagnes s\'élèvent autour de la ville. (Mountains rise around the city.)',
            english: 'Il y a des chaises autour de la table. (There are chairs around the table.)',
            highlight: ['autour de la ville', 'autour de la table']
          }
        ]
      }
    ]
  },
  {
    title: 'Movement FROM - DE/DEPUIS',
    content: `Expressing the **starting point** of movement:`,
    conjugationTable: {
      title: 'Movement FROM Prepositions',
      conjugations: [
        { pronoun: 'de', form: 'from (origin)', english: 'Je viens de Paris. (I come from Paris.)' },
        { pronoun: 'depuis', form: 'from (starting point)', english: 'Depuis la gare jusqu\'à l\'hôtel. (From the station to the hotel.)' },
        { pronoun: 'à partir de', form: 'starting from', english: 'À partir de la place centrale. (Starting from the central square.)' }
      ]
    },
    subsections: [
      {
        title: 'Origin Point',
        content: 'Where movement begins:',
        examples: [
          {
            spanish: 'Il arrive de Londres. (He arrives from London.)',
            english: 'Nous partons de la maison. (We leave from the house.)',
            highlight: ['de Londres', 'de la maison']
          }
        ]
      }
    ]
  },
  {
    title: 'Complex Movement Expressions',
    content: `Combining multiple movement prepositions:`,
    examples: [
      {
        spanish: 'De Paris vers Lyon par l\'autoroute. (From Paris towards Lyon via the highway.)',
        english: 'Depuis chez moi jusqu\'à l\'école à travers le parc. (From my place to school through the park.)',
        highlight: ['De Paris vers Lyon par l\'autoroute', 'Depuis chez moi jusqu\'à l\'école à travers le parc']
      }
    ],
    subsections: [
      {
        title: 'Journey Descriptions',
        content: 'Detailed movement descriptions:',
        examples: [
          {
            spanish: 'Nous allons de la gare vers le centre-ville en passant par la rivière. (We go from the station towards downtown passing by the river.)',
            english: 'Il court de chez lui jusqu\'au bureau le long de la Seine. (He runs from his place to the office along the Seine.)',
            highlight: ['de la gare vers le centre-ville en passant par la rivière', 'de chez lui jusqu\'au bureau le long de la Seine']
          }
        ]
      }
    ]
  },
  {
    title: 'Movement Verbs and Prepositions',
    content: `Different verbs require specific movement prepositions:`,
    conjugationTable: {
      title: 'Verbs + Movement Prepositions',
      conjugations: [
        { pronoun: 'aller à/chez/vers', form: 'to go to/towards', english: 'Je vais à Paris/chez Paul/vers la gare.' },
        { pronoun: 'venir de/chez', form: 'to come from', english: 'Il vient de Lyon/chez Marie.' },
        { pronoun: 'passer par/à travers', form: 'to pass through', english: 'Nous passons par/à travers la ville.' },
        { pronoun: 'se diriger vers', form: 'to head towards', english: 'Elle se dirige vers la sortie.' }
      ]
    }
  },
  {
    title: 'Common Mistakes with Movement Prepositions',
    content: `Here are frequent errors students make:

**1. CHEZ vs À confusion**: Using à for people's places instead of chez
**2. VERS vs À**: Not distinguishing direction from destination
**3. Missing contractions**: Forgetting to contract with definite articles
**4. Wrong preposition with verbs**: Using incorrect preposition-verb combinations`,
    examples: [
      {
        spanish: '❌ Je vais à Marie → ✅ Je vais chez Marie',
        english: 'Wrong: use CHEZ for people\'s places, not À',
        highlight: ['chez Marie']
      },
      {
        spanish: '❌ le long de le mur → ✅ le long du mur',
        english: 'Wrong: must contract "de + le" to "du"',
        highlight: ['le long du mur']
      },
      {
        spanish: '❌ Je vais à travers à Paris → ✅ Je vais à Paris',
        english: 'Wrong: don\'t use À TRAVERS for destinations',
        highlight: ['Je vais à Paris']
      },
      {
        spanish: '❌ Il vient vers Paris → ✅ Il vient de Paris',
        english: 'Wrong: use DE for origin, VERS for direction',
        highlight: ['Il vient de Paris']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Location Prepositions', url: '/grammar/french/prepositions/location', difficulty: 'intermediate' },
  { title: 'French Basic Prepositions', url: '/grammar/french/prepositions/basic-prepositions', difficulty: 'beginner' },
  { title: 'French Compound Prepositions', url: '/grammar/french/prepositions/compound-prepositions', difficulty: 'intermediate' },
  { title: 'French Verbs of Movement', url: '/grammar/french/verbs/movement-verbs', difficulty: 'intermediate' }
];

export default function FrenchMovementPrepositionsPage() {
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
              topic: 'prepositions-movement',
              title: 'French Movement Prepositions (Vers, Chez, À travers, Le long de)',
              description: 'Master French movement and direction prepositions including vers, chez, à travers, le long de. Learn to express motion and direction.',
              difficulty: 'intermediate',
              examples: [
                'Je vais vers la gare. (I\'m going towards the station.)',
                'Il va chez le médecin. (He\'s going to the doctor\'s.)',
                'Nous marchons à travers le parc. (We\'re walking through the park.)',
                'Elle court le long de la rivière. (She runs along the river.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'prepositions',
              topic: 'prepositions-movement',
              title: 'French Movement Prepositions (Vers, Chez, À travers, Le long de)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="prepositions"
        topic="prepositions-movement"
        title="French Movement Prepositions (Vers, Chez, À travers, Le long de)"
        description="Master French movement and direction prepositions including vers, chez, à travers, le long de. Learn to express motion and direction"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/french/prepositions"
        practiceUrl="/grammar/french/prepositions/prepositions-movement/practice"
        quizUrl="/grammar/french/prepositions/prepositions-movement/quiz"
        songUrl="/songs/fr?theme=grammar&topic=movement-prepositions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

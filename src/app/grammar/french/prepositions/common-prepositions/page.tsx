import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'prepositions',
  topic: 'common-prepositions',
  title: 'French Common Prepositions (À, De, Dans, Sur, Avec, Pour)',
  description: 'Master French common prepositions including à, de, dans, sur, avec, pour, sans, chez and their essential usage patterns.',
  difficulty: 'beginner',
  keywords: [
    'french common prepositions',
    'à de french prepositions',
    'dans sur french',
    'avec pour french',
    'sans chez french',
    'basic french prepositions'
  ],
  examples: [
    'Je vais à Paris. (I\'m going to Paris.)',
    'Le livre de Marie. (Marie\'s book.)',
    'Il est dans la maison. (He is in the house.)',
    'Avec mes amis. (With my friends.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Common Prepositions',
    content: `French prepositions are **essential connecting words** that show relationships between nouns, pronouns, and other words in sentences. They express **location, direction, time, manner, and possession**.

**Most common French prepositions:**
- **à**: to, at, in
- **de**: of, from, about
- **dans**: in, into
- **sur**: on, upon
- **avec**: with
- **pour**: for, in order to
- **sans**: without
- **chez**: at (someone's place)

**Key characteristics:**
- **Invariable**: Never change form
- **Essential**: Required for proper sentence structure
- **Multiple meanings**: Context determines exact meaning
- **Contractions**: Some combine with articles (du, des, au, aux)

Mastering these prepositions is fundamental for expressing basic relationships and constructing correct French sentences.`,
    examples: [
      {
        spanish: 'Je vais à l\'école avec mes amis. (I go to school with my friends.)',
        english: 'Multiple prepositions showing direction and accompaniment',
        highlight: ['à l\'école', 'avec mes amis']
      },
      {
        spanish: 'Le livre de Paul est sur la table. (Paul\'s book is on the table.)',
        english: 'Prepositions showing possession and location',
        highlight: ['de Paul', 'sur la table']
      },
      {
        spanish: 'Elle travaille dans un bureau pour une entreprise. (She works in an office for a company.)',
        english: 'Prepositions showing location and purpose',
        highlight: ['dans un bureau', 'pour une entreprise']
      }
    ]
  },
  {
    title: 'À - To, At, In',
    content: `**À** is one of the most versatile French prepositions with multiple meanings:`,
    examples: [
      {
        spanish: 'Je vais à Paris. (I\'m going to Paris.) - Direction',
        english: 'Il est à la maison. (He is at home.) - Location',
        highlight: ['à Paris', 'à la maison']
      },
      {
        spanish: 'À trois heures. (At three o\'clock.) - Time',
        english: 'À pied. (On foot.) - Manner',
        highlight: ['À trois heures', 'À pied']
      }
    ],
    subsections: [
      {
        title: 'À + Cities and Places',
        content: 'Direction and location with cities:',
        examples: [
          {
            spanish: 'à Paris, à Londres, à New York',
            english: 'à l\'école, à l\'hôpital, à la gare',
            highlight: ['à Paris', 'à l\'école']
          }
        ]
      },
      {
        title: 'À + Time',
        content: 'Specific times and moments:',
        examples: [
          {
            spanish: 'à midi (at noon), à minuit (at midnight)',
            english: 'à Noël (at Christmas), à Pâques (at Easter)',
            highlight: ['à midi', 'à Noël']
          }
        ]
      },
      {
        title: 'Contractions with À',
        content: 'À combines with definite articles:',
        examples: [
          {
            spanish: 'à + le = au: Je vais au cinéma.',
            english: 'à + les = aux: Il parle aux enfants.',
            highlight: ['au cinéma', 'aux enfants']
          }
        ]
      }
    ]
  },
  {
    title: 'DE - Of, From, About',
    content: `**DE** expresses **possession, origin, material, and topic**:`,
    examples: [
      {
        spanish: 'Le livre de Marie. (Marie\'s book.) - Possession',
        english: 'Je viens de Paris. (I come from Paris.) - Origin',
        highlight: ['de Marie', 'de Paris']
      },
      {
        spanish: 'Une table de bois. (A wooden table.) - Material',
        english: 'Nous parlons de politique. (We talk about politics.) - Topic',
        highlight: ['de bois', 'de politique']
      }
    ],
    subsections: [
      {
        title: 'DE + Possession',
        content: 'Showing ownership or relationship:',
        examples: [
          {
            spanish: 'la voiture de mon père (my father\'s car)',
            english: 'les amis de Paul (Paul\'s friends)',
            highlight: ['de mon père', 'de Paul']
          }
        ]
      },
      {
        title: 'DE + Origin',
        content: 'Where someone/something comes from:',
        examples: [
          {
            spanish: 'Je viens de France. (I come from France.)',
            english: 'Il sort de la maison. (He comes out of the house.)',
            highlight: ['de France', 'de la maison']
          }
        ]
      },
      {
        title: 'Contractions with DE',
        content: 'DE combines with definite articles:',
        examples: [
          {
            spanish: 'de + le = du: Je parle du film.',
            english: 'de + les = des: Il parle des enfants.',
            highlight: ['du film', 'des enfants']
          }
        ]
      }
    ]
  },
  {
    title: 'DANS - In, Into',
    content: `**DANS** indicates **location inside** or **movement into**:`,
    examples: [
      {
        spanish: 'Il est dans la maison. (He is in the house.) - Location',
        english: 'Elle entre dans la voiture. (She gets into the car.) - Movement',
        highlight: ['dans la maison', 'dans la voiture']
      },
      {
        spanish: 'Dans deux heures. (In two hours.) - Future time',
        english: 'Dans ce livre. (In this book.) - Context',
        highlight: ['Dans deux heures', 'Dans ce livre']
      }
    ],
    subsections: [
      {
        title: 'DANS vs EN',
        content: 'Different uses for "in":',
        examples: [
          {
            spanish: 'DANS = inside a space (dans la boîte)',
            english: 'EN = in a country/month (en France, en mai)',
            highlight: ['dans la boîte', 'en France']
          }
        ]
      },
      {
        title: 'DANS + Future Time',
        content: 'Time in the future:',
        examples: [
          {
            spanish: 'dans une heure (in an hour)',
            english: 'dans trois jours (in three days)',
            highlight: ['dans une heure', 'dans trois jours']
          }
        ]
      }
    ]
  },
  {
    title: 'SUR - On, Upon',
    content: `**SUR** indicates **position on top of** or **about a topic**:`,
    examples: [
      {
        spanish: 'Le livre est sur la table. (The book is on the table.) - Position',
        english: 'Un film sur la guerre. (A film about war.) - Topic',
        highlight: ['sur la table', 'sur la guerre']
      },
      {
        spanish: 'Sur Internet. (On the Internet.) - Medium',
        english: 'Compter sur quelqu\'un. (To count on someone.) - Dependence',
        highlight: ['Sur Internet', 'Compter sur']
      }
    ],
    subsections: [
      {
        title: 'SUR + Physical Position',
        content: 'Objects on surfaces:',
        examples: [
          {
            spanish: 'sur la table, sur le lit, sur le mur',
            english: 'Physical contact with surface',
            highlight: ['sur la table', 'sur le lit']
          }
        ]
      },
      {
        title: 'SUR + Topics',
        content: 'About subjects or themes:',
        examples: [
          {
            spanish: 'un livre sur l\'histoire (a book about history)',
            english: 'une conférence sur l\'art (a conference about art)',
            highlight: ['sur l\'histoire', 'sur l\'art']
          }
        ]
      }
    ]
  },
  {
    title: 'AVEC - With',
    content: `**AVEC** expresses **accompaniment, means, or manner**:`,
    examples: [
      {
        spanish: 'Je vais avec mes amis. (I\'m going with my friends.) - Accompaniment',
        english: 'Écrire avec un stylo. (To write with a pen.) - Instrument',
        highlight: ['avec mes amis', 'avec un stylo']
      },
      {
        spanish: 'Avec plaisir! (With pleasure!) - Manner',
        english: 'Avec du sucre. (With sugar.) - Addition',
        highlight: ['Avec plaisir', 'Avec du sucre']
      }
    ],
    subsections: [
      {
        title: 'AVEC + People',
        content: 'Accompaniment with people:',
        examples: [
          {
            spanish: 'avec ma famille (with my family)',
            english: 'avec mes collègues (with my colleagues)',
            highlight: ['avec ma famille', 'avec mes collègues']
          }
        ]
      },
      {
        title: 'AVEC + Instruments',
        content: 'Tools and means:',
        examples: [
          {
            spanish: 'avec un couteau (with a knife)',
            english: 'avec mes mains (with my hands)',
            highlight: ['avec un couteau', 'avec mes mains']
          }
        ]
      }
    ]
  },
  {
    title: 'POUR - For, In Order To',
    content: `**POUR** expresses **purpose, destination, or duration**:`,
    examples: [
      {
        spanish: 'C\'est pour toi. (It\'s for you.) - Recipient',
        english: 'Pour apprendre le français. (In order to learn French.) - Purpose',
        highlight: ['pour toi', 'Pour apprendre']
      },
      {
        spanish: 'Pour deux heures. (For two hours.) - Duration',
        english: 'Le train pour Paris. (The train to Paris.) - Destination',
        highlight: ['Pour deux heures', 'pour Paris']
      }
    ],
    subsections: [
      {
        title: 'POUR + Purpose',
        content: 'Expressing goals and intentions:',
        examples: [
          {
            spanish: 'pour réussir (in order to succeed)',
            english: 'pour comprendre (in order to understand)',
            highlight: ['pour réussir', 'pour comprendre']
          }
        ]
      },
      {
        title: 'POUR vs PENDANT',
        content: 'Different duration meanings:',
        examples: [
          {
            spanish: 'POUR = intended duration (pour trois jours)',
            english: 'PENDANT = actual duration (pendant trois jours)',
            highlight: ['pour trois jours', 'pendant trois jours']
          }
        ]
      }
    ]
  },
  {
    title: 'SANS - Without',
    content: `**SANS** expresses **absence or lack**:`,
    examples: [
      {
        spanish: 'Sans argent. (Without money.)',
        english: 'Sans problème. (Without problem.)',
        highlight: ['Sans argent', 'Sans problème']
      },
      {
        spanish: 'Il part sans dire au revoir. (He leaves without saying goodbye.)',
        english: 'Sans toi, je ne peux pas. (Without you, I can\'t.)',
        highlight: ['sans dire au revoir', 'Sans toi']
      }
    ],
    subsections: [
      {
        title: 'SANS + Noun',
        content: 'Absence of things:',
        examples: [
          {
            spanish: 'sans eau (without water)',
            english: 'sans travail (without work)',
            highlight: ['sans eau', 'sans travail']
          }
        ]
      },
      {
        title: 'SANS + Infinitive',
        content: 'Without doing something:',
        examples: [
          {
            spanish: 'sans parler (without speaking)',
            english: 'sans regarder (without looking)',
            highlight: ['sans parler', 'sans regarder']
          }
        ]
      }
    ]
  },
  {
    title: 'CHEZ - At (Someone\'s Place)',
    content: `**CHEZ** indicates **at someone\'s home, business, or among a group**:`,
    examples: [
      {
        spanish: 'Je vais chez Marie. (I\'m going to Marie\'s place.)',
        english: 'Chez le médecin. (At the doctor\'s.)',
        highlight: ['chez Marie', 'Chez le médecin']
      },
      {
        spanish: 'Chez nous, on mange tard. (At our place, we eat late.)',
        english: 'Chez les Français. (Among the French.)',
        highlight: ['Chez nous', 'Chez les Français']
      }
    ],
    subsections: [
      {
        title: 'CHEZ + People',
        content: 'At someone\'s home or place:',
        examples: [
          {
            spanish: 'chez mes parents (at my parents\' place)',
            english: 'chez mon ami (at my friend\'s place)',
            highlight: ['chez mes parents', 'chez mon ami']
          }
        ]
      },
      {
        title: 'CHEZ + Professionals',
        content: 'At professional locations:',
        examples: [
          {
            spanish: 'chez le dentiste (at the dentist\'s)',
            english: 'chez le coiffeur (at the hairdresser\'s)',
            highlight: ['chez le dentiste', 'chez le coiffeur']
          }
        ]
      }
    ]
  },
  {
    title: 'Preposition Contractions',
    content: `French prepositions **contract** with definite articles:`,
    conjugationTable: {
      title: 'Preposition Contractions',
      conjugations: [
        { pronoun: 'à + le', form: 'au', english: 'Je vais au cinéma. (I\'m going to the cinema.)' },
        { pronoun: 'à + les', form: 'aux', english: 'Il parle aux enfants. (He talks to the children.)' },
        { pronoun: 'de + le', form: 'du', english: 'Je parle du film. (I talk about the film.)' },
        { pronoun: 'de + les', form: 'des', english: 'Il parle des livres. (He talks about the books.)' }
      ]
    },
    subsections: [
      {
        title: 'No Contraction with LA/L\'',
        content: 'À and DE don\'t contract with feminine articles:',
        examples: [
          {
            spanish: 'à la maison, de la voiture',
            english: 'à l\'école, de l\'hôpital',
            highlight: ['à la maison', 'de la voiture']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Prepositional Phrases',
    content: `Fixed expressions with prepositions:`,
    examples: [
      {
        spanish: 'à côté de (next to), en face de (across from)',
        english: 'au lieu de (instead of), à cause de (because of)',
        highlight: ['à côté de', 'en face de', 'au lieu de']
      },
      {
        spanish: 'grâce à (thanks to), quant à (as for)',
        english: 'par rapport à (compared to), à propos de (about)',
        highlight: ['grâce à', 'quant à', 'par rapport à']
      }
    ]
  },
  {
    title: 'Common Mistakes with Prepositions',
    content: `Here are frequent errors students make:

**1. Wrong preposition choice**: Using incorrect preposition for context
**2. Missing contractions**: Not using au/aux/du/des when required
**3. Literal translation**: Translating English prepositions directly
**4. Omitting prepositions**: Leaving out required prepositions`,
    examples: [
      {
        spanish: '❌ Je vais à le cinéma → ✅ Je vais au cinéma',
        english: 'Wrong: must use contraction AU',
        highlight: ['au cinéma']
      },
      {
        spanish: '❌ Je pense à toi → ✅ Je pense à toi',
        english: 'Wrong: different preposition needed in French',
        highlight: ['Je pense à toi']
      },
      {
        spanish: '❌ dans France → ✅ en France',
        english: 'Wrong: use EN with countries',
        highlight: ['en France']
      },
      {
        spanish: '❌ Je vais chez à Marie → ✅ Je vais chez Marie',
        english: 'Wrong: CHEZ doesn\'t need additional preposition',
        highlight: ['chez Marie']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Compound Prepositions', url: '/grammar/french/prepositions/compound-prepositions', difficulty: 'intermediate' },
  { title: 'French Location Prepositions', url: '/grammar/french/prepositions/location', difficulty: 'intermediate' },
  { title: 'French Time Prepositions', url: '/grammar/french/prepositions/prepositions-time', difficulty: 'intermediate' },
  { title: 'French Articles', url: '/grammar/french/nouns/definite-articles', difficulty: 'beginner' }
];

export default function FrenchCommonPrepositionsPage() {
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
              topic: 'common-prepositions',
              title: 'French Common Prepositions (À, De, Dans, Sur, Avec, Pour)',
              description: 'Master French common prepositions including à, de, dans, sur, avec, pour, sans, chez and their essential usage patterns.',
              difficulty: 'beginner',
              examples: [
                'Je vais à Paris. (I\'m going to Paris.)',
                'Le livre de Marie. (Marie\'s book.)',
                'Il est dans la maison. (He is in the house.)',
                'Avec mes amis. (With my friends.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'prepositions',
              topic: 'common-prepositions',
              title: 'French Common Prepositions (À, De, Dans, Sur, Avec, Pour)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="prepositions"
        topic="common-prepositions"
        title="French Common Prepositions (À, De, Dans, Sur, Avec, Pour)"
        description="Master French common prepositions including à, de, dans, sur, avec, pour, sans, chez and their essential usage patterns"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/prepositions"
        practiceUrl="/grammar/french/prepositions/common-prepositions/practice"
        quizUrl="/grammar/french/prepositions/common-prepositions/quiz"
        songUrl="/songs/fr?theme=grammar&topic=common-prepositions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

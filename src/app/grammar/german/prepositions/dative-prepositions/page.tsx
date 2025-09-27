import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'prepositions',
  topic: 'dative-prepositions',
  title: 'German Dative Prepositions - aus, bei, mit, nach, seit, von, zu',
  description: 'Master German dative prepositions including aus, bei, mit, nach, seit, von, zu with usage rules and contractions.',
  difficulty: 'intermediate',
  keywords: [
    'german dative prepositions',
    'aus bei mit nach seit von zu',
    'dative case prepositions',
    'german preposition contractions',
    'dative prepositions german',
    'german grammar prepositions'
  ],
  examples: [
    'Ich komme aus Deutschland. (I come from Germany.)',
    'Er wohnt bei seinen Eltern. (He lives with his parents.)',
    'Wir fahren mit dem Auto. (We drive with the car.)',
    'Sie geht zu ihrer Freundin. (She goes to her friend.)'
  ]
});

const sections = [
  {
    title: 'Understanding German Dative Prepositions',
    content: `German **dative prepositions** always require the **dative case** for the noun or pronoun that follows them. These prepositions are **fixed** - they never change case regardless of context.

**The main dative prepositions:**
- **aus**: out of, from (origin)
- **bei**: at, near, with (location/person)
- **mit**: with, by means of
- **nach**: to, after, according to
- **seit**: since, for (time duration)
- **von**: from, of, by (agent)
- **zu**: to, at (destination/purpose)

**Key characteristics:**
- **Fixed case**: Always dative, no exceptions
- **High frequency**: Used constantly in everyday German
- **Specific meanings**: Each has distinct usage contexts
- **Article changes**: der→dem, die→der, das→dem, ein→einem

**Why dative prepositions matter:**
- **Essential communication**: Express location, time, relationships
- **Grammatical accuracy**: Must use correct case
- **Natural German**: Required for fluent expression
- **Common contractions**: Many form contracted forms (zum, zur, beim)

**Learning strategy**: Memorize the **seven main prepositions** with the mnemonic "**aus bei mit nach seit von zu**" and learn their **contractions**.

Understanding dative prepositions is **crucial** for **intermediate German** and **accurate case usage**.`,
    examples: [
      {
        spanish: 'ORIGIN: aus dem Haus (out of the house)',
        english: 'LOCATION: bei der Arbeit (at work)',
        highlight: ['aus dem Haus', 'bei der Arbeit']
      },
      {
        spanish: 'MEANS: mit dem Bus (by bus)',
        english: 'DIRECTION: nach Hause (home)',
        highlight: ['mit dem Bus', 'nach Hause']
      },
      {
        spanish: 'TIME: seit einem Jahr (for a year)',
        english: 'AGENT: von meinem Vater (from my father)',
        highlight: ['seit einem Jahr', 'von meinem Vater']
      }
    ]
  },
  {
    title: 'aus - Out Of, From (Origin)',
    content: `**aus** expresses **origin**, **source**, and **material**:`,
    conjugationTable: {
      title: 'aus Usage Patterns',
      conjugations: [
        { pronoun: 'Origin/place', form: 'aus Deutschland', english: 'from Germany' },
        { pronoun: 'Out of container', form: 'aus der Flasche', english: 'out of the bottle' },
        { pronoun: 'Material', form: 'aus Holz', english: 'made of wood' },
        { pronoun: 'Reason/motive', form: 'aus Liebe', english: 'out of love' },
        { pronoun: 'Time period', form: 'aus dem 18. Jahrhundert', english: 'from the 18th century' }
      ]
    },
    examples: [
      {
        spanish: 'COUNTRY: Ich komme aus der Schweiz. (I come from Switzerland.)',
        english: 'CONTAINER: Wasser aus dem Glas (water from the glass)',
        highlight: ['aus der Schweiz', 'aus dem Glas']
      },
      {
        spanish: 'MATERIAL: ein Tisch aus Holz (a table made of wood)',
        english: 'MOTIVE: aus Neugier (out of curiosity)',
        highlight: ['aus Holz', 'aus Neugier']
      }
    ]
  },
  {
    title: 'bei - At, Near, With (Person)',
    content: `**bei** expresses **location near**, **staying with someone**, and **during activities**:`,
    conjugationTable: {
      title: 'bei Usage Patterns',
      conjugations: [
        { pronoun: 'With person', form: 'bei meinen Eltern', english: 'at my parents\' (house)' },
        { pronoun: 'Near location', form: 'bei der Bank', english: 'near the bank' },
        { pronoun: 'During activity', form: 'bei der Arbeit', english: 'at work' },
        { pronoun: 'Weather', form: 'bei schönem Wetter', english: 'in nice weather' },
        { pronoun: 'Professional', form: 'beim Arzt', english: 'at the doctor\'s' }
      ]
    },
    examples: [
      {
        spanish: 'PERSON: Ich wohne bei meiner Oma. (I live with my grandma.)',
        english: 'LOCATION: Das Hotel ist bei der Kirche. (The hotel is near the church.)',
        highlight: ['bei meiner Oma', 'bei der Kirche']
      },
      {
        spanish: 'ACTIVITY: bei der Arbeit sein (to be at work)',
        english: 'WEATHER: bei Regen (in the rain)',
        highlight: ['bei der Arbeit', 'bei Regen']
      }
    ]
  },
  {
    title: 'mit - With, By Means Of',
    content: `**mit** expresses **accompaniment**, **means of transport**, and **instruments**:`,
    conjugationTable: {
      title: 'mit Usage Patterns',
      conjugations: [
        { pronoun: 'Accompaniment', form: 'mit meinem Freund', english: 'with my friend' },
        { pronoun: 'Transport', form: 'mit dem Auto', english: 'by car' },
        { pronoun: 'Instrument', form: 'mit dem Messer', english: 'with the knife' },
        { pronoun: 'Age', form: 'mit 18 Jahren', english: 'at 18 years old' },
        { pronoun: 'Manner', form: 'mit Freude', english: 'with joy' }
      ]
    },
    examples: [
      {
        spanish: 'PERSON: Ich gehe mit dir. (I go with you.)',
        english: 'TRANSPORT: mit der Bahn fahren (travel by train)',
        highlight: ['mit dir', 'mit der Bahn']
      },
      {
        spanish: 'TOOL: mit dem Computer arbeiten (work with the computer)',
        english: 'AGE: mit 21 Jahren (at 21 years old)',
        highlight: ['mit dem Computer', 'mit 21 Jahren']
      }
    ]
  },
  {
    title: 'nach - To, After, According To',
    content: `**nach** expresses **direction to places**, **time sequence**, and **according to**:`,
    conjugationTable: {
      title: 'nach Usage Patterns',
      conjugations: [
        { pronoun: 'Cities/countries', form: 'nach Berlin', english: 'to Berlin' },
        { pronoun: 'Home', form: 'nach Hause', english: 'home' },
        { pronoun: 'Time sequence', form: 'nach dem Essen', english: 'after eating' },
        { pronoun: 'According to', form: 'nach meiner Meinung', english: 'in my opinion' },
        { pronoun: 'Directions', form: 'nach links', english: 'to the left' }
      ]
    },
    examples: [
      {
        spanish: 'DESTINATION: Wir fahren nach Italien. (We drive to Italy.)',
        english: 'HOME: Ich gehe nach Hause. (I go home.)',
        highlight: ['nach Italien', 'nach Hause']
      },
      {
        spanish: 'TIME: nach der Schule (after school)',
        english: 'OPINION: nach meiner Ansicht (in my view)',
        highlight: ['nach der Schule', 'nach meiner Ansicht']
      }
    ]
  },
  {
    title: 'seit - Since, For (Duration)',
    content: `**seit** expresses **duration from a starting point** to the present:`,
    conjugationTable: {
      title: 'seit Usage Patterns',
      conjugations: [
        { pronoun: 'Time point', form: 'seit gestern', english: 'since yesterday' },
        { pronoun: 'Duration', form: 'seit zwei Jahren', english: 'for two years' },
        { pronoun: 'Event', form: 'seit dem Unfall', english: 'since the accident' },
        { pronoun: 'Age', form: 'seit meiner Kindheit', english: 'since my childhood' }
      ]
    },
    examples: [
      {
        spanish: 'POINT: seit letzter Woche (since last week)',
        english: 'DURATION: seit drei Monaten (for three months)',
        highlight: ['seit letzter Woche', 'seit drei Monaten']
      },
      {
        spanish: 'EVENT: seit dem Krieg (since the war)',
        english: 'LIFE STAGE: seit der Hochzeit (since the wedding)',
        highlight: ['seit dem Krieg', 'seit der Hochzeit']
      }
    ],
    subsections: [
      {
        title: 'Present Tense Usage',
        content: 'seit + present tense = English present perfect continuous:',
        examples: [
          {
            spanish: 'GERMAN: Ich lerne seit zwei Jahren Deutsch.',
            english: 'ENGLISH: I have been learning German for two years.',
            highlight: ['seit zwei Jahren']
          }
        ]
      }
    ]
  },
  {
    title: 'von - From, Of, By (Agent)',
    content: `**von** expresses **origin**, **possession**, **agent in passive**, and **part of whole**:`,
    conjugationTable: {
      title: 'von Usage Patterns',
      conjugations: [
        { pronoun: 'Origin/source', form: 'von meinem Vater', english: 'from my father' },
        { pronoun: 'Possession', form: 'ein Freund von mir', english: 'a friend of mine' },
        { pronoun: 'Agent (passive)', form: 'von dem Lehrer', english: 'by the teacher' },
        { pronoun: 'Part of whole', form: 'einer von uns', english: 'one of us' },
        { pronoun: 'About/concerning', form: 'von der Liebe', english: 'about love' }
      ]
    },
    examples: [
      {
        spanish: 'ORIGIN: ein Brief von meiner Mutter (a letter from my mother)',
        english: 'POSSESSION: das Auto von meinem Bruder (my brother\'s car)',
        highlight: ['von meiner Mutter', 'von meinem Bruder']
      },
      {
        spanish: 'PASSIVE: Das Buch wurde von Goethe geschrieben. (The book was written by Goethe.)',
        english: 'PART: die meisten von ihnen (most of them)',
        highlight: ['von Goethe', 'von ihnen']
      }
    ]
  },
  {
    title: 'zu - To, At (Destination/Purpose)',
    content: `**zu** expresses **destination to people/places**, **purpose**, and **occasions**:`,
    conjugationTable: {
      title: 'zu Usage Patterns',
      conjugations: [
        { pronoun: 'Person destination', form: 'zu meiner Freundin', english: 'to my girlfriend' },
        { pronoun: 'Place destination', form: 'zur Schule', english: 'to school' },
        { pronoun: 'Purpose', form: 'zum Lernen', english: 'for learning' },
        { pronoun: 'Occasion', form: 'zum Geburtstag', english: 'for the birthday' },
        { pronoun: 'Addition', form: 'zu dem Buch', english: 'in addition to the book' }
      ]
    },
    examples: [
      {
        spanish: 'PERSON: Ich gehe zu meinem Arzt. (I go to my doctor.)',
        english: 'PLACE: zur Universität gehen (go to university)',
        highlight: ['zu meinem Arzt', 'zur Universität']
      },
      {
        spanish: 'PURPOSE: zum Einkaufen (for shopping)',
        english: 'OCCASION: zum Weihnachten (for Christmas)',
        highlight: ['zum Einkaufen', 'zum Weihnachten']
      }
    ]
  },
  {
    title: 'Article Changes with Dative Prepositions',
    content: `**Articles change** to dative case after these prepositions:`,
    conjugationTable: {
      title: 'Article Changes in Dative',
      conjugations: [
        { pronoun: 'Masculine', form: 'der → dem', english: 'mit dem Mann, bei dem Arzt' },
        { pronoun: 'Feminine', form: 'die → der', english: 'von der Frau, zu der Schule' },
        { pronoun: 'Neuter', form: 'das → dem', english: 'aus dem Haus, nach dem Essen' },
        { pronoun: 'Plural', form: 'die → den', english: 'mit den Kindern, bei den Eltern' },
        { pronoun: 'Indefinite masc/neut', form: 'ein → einem', english: 'mit einem Freund, aus einem Buch' },
        { pronoun: 'Indefinite fem', form: 'eine → einer', english: 'zu einer Freundin, bei einer Party' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE: mit dem neuen Auto (with the new car)',
        english: 'FEMININE: bei der alten Dame (at the old lady\'s)',
        highlight: ['mit dem neuen', 'bei der alten']
      }
    ]
  },
  {
    title: 'Common Contractions',
    content: `**Dative prepositions** frequently contract with definite articles:`,
    conjugationTable: {
      title: 'Standard Contractions',
      conjugations: [
        { pronoun: 'bei + dem', form: 'beim', english: 'beim Arzt (at the doctor\'s)' },
        { pronoun: 'von + dem', form: 'vom', english: 'vom Bahnhof (from the station)' },
        { pronoun: 'zu + dem', form: 'zum', english: 'zum Supermarkt (to the supermarket)' },
        { pronoun: 'zu + der', form: 'zur', english: 'zur Schule (to school)' }
      ]
    },
    examples: [
      {
        spanish: 'CONTRACTIONS: beim Friseur (at the hairdresser\'s)',
        english: 'FULL FORMS: bei dem Friseur (at the hairdresser\'s)',
        highlight: ['beim Friseur', 'bei dem Friseur']
      },
      {
        spanish: 'COMMON: vom Arzt (from the doctor), zur Arbeit (to work)',
        english: 'EXPANDED: von dem Arzt, zu der Arbeit',
        highlight: ['vom Arzt, zur Arbeit']
      }
    ]
  },
  {
    title: 'Fixed Expressions with Dative Prepositions',
    content: `**Common expressions** using dative prepositions:`,
    conjugationTable: {
      title: 'Fixed Expressions',
      conjugations: [
        { pronoun: 'nach Hause', form: 'home (direction)', english: 'Ich gehe nach Hause.' },
        { pronoun: 'zu Hause', form: 'at home', english: 'Ich bin zu Hause.' },
        { pronoun: 'bei der Arbeit', form: 'at work', english: 'Er ist bei der Arbeit.' },
        { pronoun: 'mit der Zeit', form: 'with time', english: 'Mit der Zeit wird es besser.' },
        { pronoun: 'von Zeit zu Zeit', form: 'from time to time', english: 'Von Zeit zu Zeit besuche ich sie.' },
        { pronoun: 'seit langem', form: 'for a long time', english: 'Ich kenne ihn seit langem.' }
      ]
    },
    examples: [
      {
        spanish: 'HOME: nach Hause gehen (go home) vs zu Hause sein (be at home)',
        english: 'TIME: von Anfang an (from the beginning)',
        highlight: ['nach Hause', 'zu Hause', 'von Anfang an']
      }
    ]
  },
  {
    title: 'nach vs zu - Direction Differences',
    content: `**nach** and **zu** both express direction but have different uses:`,
    conjugationTable: {
      title: 'nach vs zu Usage',
      conjugations: [
        { pronoun: 'nach', form: 'Cities, countries, home', english: 'nach Berlin, nach Deutschland, nach Hause' },
        { pronoun: 'zu', form: 'People, institutions, events', english: 'zum Arzt, zur Schule, zur Party' },
        { pronoun: 'nach', form: 'Directions', english: 'nach links, nach oben' },
        { pronoun: 'zu', form: 'Purpose', english: 'zum Einkaufen, zum Lernen' }
      ]
    },
    examples: [
      {
        spanish: 'NACH: nach München fahren (drive to Munich)',
        english: 'ZU: zum Bahnhof gehen (go to the station)',
        highlight: ['nach München', 'zum Bahnhof']
      }
    ]
  },
  {
    title: 'Common Mistakes with Dative Prepositions',
    content: `Here are frequent errors students make:

**1. Wrong case**: Using accusative instead of dative
**2. Preposition confusion**: Using nach instead of zu or vice versa
**3. Missing contractions**: Not using standard contractions
**4. Article errors**: Wrong dative article forms`,
    examples: [
      {
        spanish: '❌ mit den Auto → ✅ mit dem Auto',
        english: 'Wrong: mit takes dative, masculine singular = dem',
        highlight: ['mit dem Auto']
      },
      {
        spanish: '❌ zu Berlin → ✅ nach Berlin',
        english: 'Wrong: use nach for cities, zu for people/institutions',
        highlight: ['nach Berlin']
      },
      {
        spanish: '❌ zu dem Arzt → ✅ zum Arzt',
        english: 'Better: use contraction zum instead of zu dem',
        highlight: ['zum Arzt']
      },
      {
        spanish: '❌ seit die Hochzeit → ✅ seit der Hochzeit',
        english: 'Wrong: seit takes dative, feminine = der',
        highlight: ['seit der Hochzeit']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Accusative Prepositions', url: '/grammar/german/prepositions/accusative-prepositions', difficulty: 'intermediate' },
  { title: 'German Two-Way Prepositions', url: '/grammar/german/prepositions/two-way-prepositions', difficulty: 'intermediate' },
  { title: 'German Dative Case', url: '/grammar/german/cases/dative', difficulty: 'intermediate' },
  { title: 'German Articles', url: '/grammar/german/nouns/articles', difficulty: 'beginner' }
];

export default function GermanDativePrepositionsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'prepositions',
              topic: 'dative-prepositions',
              title: 'German Dative Prepositions - aus, bei, mit, nach, seit, von, zu',
              description: 'Master German dative prepositions including aus, bei, mit, nach, seit, von, zu with usage rules and contractions.',
              difficulty: 'intermediate',
              examples: [
                'Ich komme aus Deutschland. (I come from Germany.)',
                'Er wohnt bei seinen Eltern. (He lives with his parents.)',
                'Wir fahren mit dem Auto. (We drive with the car.)',
                'Sie geht zu ihrer Freundin. (She goes to her friend.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'prepositions',
              topic: 'dative-prepositions',
              title: 'German Dative Prepositions - aus, bei, mit, nach, seit, von, zu'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="prepositions"
        topic="dative-prepositions"
        title="German Dative Prepositions - aus, bei, mit, nach, seit, von, zu"
        description="Master German dative prepositions including aus, bei, mit, nach, seit, von, zu with usage rules and contractions"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/german/prepositions"
        practiceUrl="/grammar/german/prepositions/dative-prepositions/practice"
        quizUrl="/grammar/german/prepositions/dative-prepositions/quiz"
        songUrl="/songs/de?theme=grammar&topic=dative-prepositions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

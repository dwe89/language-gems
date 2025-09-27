import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'cases',
  topic: 'two-way-prepositions',
  title: 'German Two-Way Prepositions - Accusative vs Dative Usage',
  description: 'Master German two-way prepositions that take either accusative or dative case depending on movement vs location.',
  difficulty: 'advanced',
  keywords: [
    'german two way prepositions',
    'wechselpräpositionen german',
    'accusative dative prepositions',
    'german movement location',
    'an auf in german'
  ],
  examples: [
    'Ich gehe in die Schule. (I go to school - accusative)',
    'Ich bin in der Schule. (I am at school - dative)',
    'Er hängt das Bild an die Wand. (He hangs the picture on the wall - accusative)',
    'Das Bild hängt an der Wand. (The picture hangs on the wall - dative)'
  ]
});

const sections = [
  {
    title: 'Understanding German Two-Way Prepositions',
    content: `German **two-way prepositions** (Wechselpräpositionen) can take **either accusative or dative case** depending on whether they express **movement** (accusative) or **location** (dative).

**The nine two-way prepositions:**
- **an** (at, on, to)
- **auf** (on, onto)
- **hinter** (behind)
- **in** (in, into)
- **neben** (next to, beside)
- **über** (over, above)
- **unter** (under, below)
- **vor** (in front of, before)
- **zwischen** (between)

**Key rule:**
- **ACCUSATIVE**: Movement, direction, change of location (Wohin? - Where to?)
- **DATIVE**: Location, position, no movement (Wo? - Where?)

**Memory aid:**
- **Accusative**: "Where TO?" - movement, action, change
- **Dative**: "WHERE?" - location, state, no change

**Why two-way prepositions matter:**
- **Precise meaning**: Case shows movement vs. location
- **Common usage**: Essential for daily German
- **Advanced grammar**: Mark sophisticated understanding
- **Natural speech**: Native speakers use automatically

Understanding two-way prepositions is **crucial** for **advanced German proficiency**.`,
    examples: [
      {
        spanish: 'MOVEMENT (ACC): Ich gehe in die Küche. (I go into the kitchen.)',
        english: 'LOCATION (DAT): Ich bin in der Küche. (I am in the kitchen.)',
        highlight: ['in die Küche', 'in der Küche']
      },
      {
        spanish: 'MOVEMENT (ACC): Er stellt das Buch auf den Tisch. (He puts the book on the table.)',
        english: 'LOCATION (DAT): Das Buch liegt auf dem Tisch. (The book lies on the table.)',
        highlight: ['auf den Tisch', 'auf dem Tisch']
      }
    ]
  },
  {
    title: 'The Nine Two-Way Prepositions',
    content: `**Complete list** of German two-way prepositions:`,
    conjugationTable: {
      title: 'Two-Way Prepositions',
      conjugations: [
        { pronoun: 'an', form: 'at, on, to', english: 'an die Wand (to the wall) / an der Wand (on the wall)' },
        { pronoun: 'auf', form: 'on, onto', english: 'auf den Tisch (onto the table) / auf dem Tisch (on the table)' },
        { pronoun: 'hinter', form: 'behind', english: 'hinter das Haus (behind the house) / hinter dem Haus (behind the house)' },
        { pronoun: 'in', form: 'in, into', english: 'in die Stadt (into the city) / in der Stadt (in the city)' },
        { pronoun: 'neben', form: 'next to, beside', english: 'neben den Stuhl (next to the chair) / neben dem Stuhl (next to the chair)' },
        { pronoun: 'über', form: 'over, above', english: 'über den Fluss (over the river) / über dem Fluss (above the river)' },
        { pronoun: 'unter', form: 'under, below', english: 'unter den Tisch (under the table) / unter dem Tisch (under the table)' },
        { pronoun: 'vor', form: 'in front of, before', english: 'vor das Auto (in front of the car) / vor dem Auto (in front of the car)' },
        { pronoun: 'zwischen', form: 'between', english: 'zwischen die Bäume (between the trees) / zwischen den Bäumen (between the trees)' }
      ]
    },
    examples: [
      {
        spanish: 'ACCUSATIVE: Ich hänge das Bild an die Wand. (I hang the picture on the wall.)',
        english: 'DATIVE: Das Bild hängt an der Wand. (The picture hangs on the wall.)',
        highlight: ['an die Wand', 'an der Wand']
      }
    ]
  },
  {
    title: 'Accusative Usage - Movement and Direction',
    content: `**Use accusative** when expressing **movement, direction, or change of location**:`,
    conjugationTable: {
      title: 'Accusative with Two-Way Prepositions',
      conjugations: [
        { pronoun: 'Movement verbs', form: 'gehen, fahren, laufen', english: 'Ich gehe in die Schule. (I go to school.)' },
        { pronoun: 'Placement verbs', form: 'stellen, legen, hängen', english: 'Er stellt das Buch auf den Tisch. (He puts the book on the table.)' },
        { pronoun: 'Direction', form: 'Wohin? (Where to?)', english: 'Sie läuft hinter das Haus. (She runs behind the house.)' },
        { pronoun: 'Change of location', form: 'From A to B', english: 'Wir ziehen in eine neue Wohnung. (We move into a new apartment.)' }
      ]
    },
    examples: [
      {
        spanish: 'GEHEN: Ich gehe in den Park. (I go into the park.)',
        english: 'STELLEN: Sie stellt die Vase auf den Tisch. (She puts the vase on the table.)',
        highlight: ['in den Park', 'auf den Tisch']
      },
      {
        spanish: 'FAHREN: Wir fahren in die Stadt. (We drive into the city.)',
        english: 'LEGEN: Er legt das Buch unter das Bett. (He puts the book under the bed.)',
        highlight: ['in die Stadt', 'unter das Bett']
      }
    ]
  },
  {
    title: 'Dative Usage - Location and Position',
    content: `**Use dative** when expressing **location, position, or state without movement**:`,
    conjugationTable: {
      title: 'Dative with Two-Way Prepositions',
      conjugations: [
        { pronoun: 'Location verbs', form: 'sein, bleiben, wohnen', english: 'Ich bin in der Schule. (I am at school.)' },
        { pronoun: 'Position verbs', form: 'stehen, liegen, hängen', english: 'Das Buch liegt auf dem Tisch. (The book lies on the table.)' },
        { pronoun: 'State', form: 'Wo? (Where?)', english: 'Sie arbeitet hinter dem Haus. (She works behind the house.)' },
        { pronoun: 'No movement', form: 'Static position', english: 'Wir wohnen in einer schönen Wohnung. (We live in a beautiful apartment.)' }
      ]
    },
    examples: [
      {
        spanish: 'SEIN: Ich bin in der Küche. (I am in the kitchen.)',
        english: 'STEHEN: Die Vase steht auf dem Tisch. (The vase stands on the table.)',
        highlight: ['in der Küche', 'auf dem Tisch']
      },
      {
        spanish: 'WOHNEN: Wir wohnen in der Stadt. (We live in the city.)',
        english: 'LIEGEN: Das Buch liegt unter dem Bett. (The book lies under the bed.)',
        highlight: ['in der Stadt', 'unter dem Bett']
      }
    ]
  },
  {
    title: 'Verb Pairs - Movement vs Position',
    content: `**German verb pairs** clearly show the accusative/dative distinction:`,
    conjugationTable: {
      title: 'Movement vs Position Verbs',
      conjugations: [
        { pronoun: 'stellen (put) + ACC', form: 'legen (lay) + ACC', english: 'Er stellt/legt das Buch auf den Tisch. (He puts/lays the book on the table.)' },
        { pronoun: 'stehen (stand) + DAT', form: 'liegen (lie) + DAT', english: 'Das Buch steht/liegt auf dem Tisch. (The book stands/lies on the table.)' },
        { pronoun: 'hängen (hang up) + ACC', form: 'setzen (set) + ACC', english: 'Ich hänge/setze es an die Wand. (I hang/set it on the wall.)' },
        { pronoun: 'hängen (hang) + DAT', form: 'sitzen (sit) + DAT', english: 'Es hängt/sitzt an der Wand. (It hangs/sits on the wall.)' }
      ]
    },
    examples: [
      {
        spanish: 'MOVEMENT: Ich stelle die Flasche in den Kühlschrank. (I put the bottle in the refrigerator.)',
        english: 'POSITION: Die Flasche steht im Kühlschrank. (The bottle stands in the refrigerator.)',
        highlight: ['in den Kühlschrank', 'im Kühlschrank']
      },
      {
        spanish: 'MOVEMENT: Sie hängt das Bild an die Wand. (She hangs the picture on the wall.)',
        english: 'POSITION: Das Bild hängt an der Wand. (The picture hangs on the wall.)',
        highlight: ['an die Wand', 'an der Wand']
      }
    ]
  },
  {
    title: 'Special Cases and Exceptions',
    content: `**Some situations** require careful consideration:`,
    examples: [
      {
        spanish: 'TIME EXPRESSIONS: vor einem Jahr (a year ago - dative)',
        english: 'ABSTRACT: in Gedanken (in thoughts - dative)',
        highlight: ['vor einem Jahr', 'in Gedanken']
      },
      {
        spanish: 'FIGURATIVE: über ein Problem sprechen (to talk about a problem - accusative)',
        english: 'LITERAL: über dem Tisch hängen (to hang above the table - dative)',
        highlight: ['über ein Problem', 'über dem Tisch']
      }
    ],
    subsections: [
      {
        title: 'Fixed Expressions',
        content: 'Some expressions have fixed case usage regardless of movement/location:',
        examples: [
          {
            spanish: 'FIXED DATIVE: auf dem Land (in the countryside)',
            english: 'FIXED ACCUSATIVE: auf die Frage antworten (to answer the question)',
            highlight: ['auf dem Land', 'auf die Frage']
          }
        ]
      }
    ]
  },
  {
    title: 'Question Words - Wo vs Wohin',
    content: `**Question words** help determine which case to use:`,
    conjugationTable: {
      title: 'Question Words and Cases',
      conjugations: [
        { pronoun: 'Wo?', form: 'Where? (location)', english: 'Wo bist du? - Ich bin in der Schule. (dative)' },
        { pronoun: 'Wohin?', form: 'Where to? (direction)', english: 'Wohin gehst du? - Ich gehe in die Schule. (accusative)' },
        { pronoun: 'Woher?', form: 'Where from?', english: 'Woher kommst du? - Ich komme aus der Schule. (dative)' }
      ]
    },
    examples: [
      {
        spanish: 'WO: Wo ist das Auto? - Es steht vor dem Haus. (Where is the car? - It stands in front of the house.)',
        english: 'WOHIN: Wohin fährst du? - Ich fahre vor das Haus. (Where are you driving? - I drive in front of the house.)',
        highlight: ['vor dem Haus', 'vor das Haus']
      }
    ]
  },
  {
    title: 'Contractions with Two-Way Prepositions',
    content: `**Common contractions** with two-way prepositions:`,
    conjugationTable: {
      title: 'Preposition Contractions',
      conjugations: [
        { pronoun: 'an + dem', form: 'am', english: 'am Tisch (at the table - dative)' },
        { pronoun: 'an + das', form: 'ans', english: 'ans Fenster (to the window - accusative)' },
        { pronoun: 'in + dem', form: 'im', english: 'im Haus (in the house - dative)' },
        { pronoun: 'in + das', form: 'ins', english: 'ins Haus (into the house - accusative)' },
        { pronoun: 'auf + das', form: 'aufs', english: 'aufs Dach (onto the roof - accusative)' }
      ]
    },
    examples: [
      {
        spanish: 'DATIVE: Ich bin am Bahnhof. (I am at the train station.)',
        english: 'ACCUSATIVE: Ich gehe ans Fenster. (I go to the window.)',
        highlight: ['am Bahnhof', 'ans Fenster']
      }
    ]
  },
  {
    title: 'Practice Strategies',
    content: `**Effective strategies** for mastering two-way prepositions:`,
    examples: [
      {
        spanish: 'MOVEMENT TEST: Can you add "to" or "into" in English? → Accusative',
        english: 'LOCATION TEST: Can you add "at" or "in" in English? → Dative',
        highlight: ['Movement → Accusative', 'Location → Dative']
      },
      {
        spanish: 'VERB CLUE: Movement verbs (gehen, fahren, stellen) → Accusative',
        english: 'VERB CLUE: Position verbs (sein, bleiben, stehen) → Dative',
        highlight: ['Movement verbs', 'Position verbs']
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong case choice**: Using accusative for location or dative for movement
**2. Verb confusion**: Not recognizing movement vs position verbs
**3. Fixed expressions**: Not learning exceptions and fixed cases
**4. Question word mix-up**: Confusing wo and wohin`,
    examples: [
      {
        spanish: '❌ Ich bin in die Schule → ✅ Ich bin in der Schule',
        english: 'Wrong: "being" is location (dative), not movement',
        highlight: ['in der Schule']
      },
      {
        spanish: '❌ Ich gehe in der Schule → ✅ Ich gehe in die Schule',
        english: 'Wrong: "going" is movement (accusative), not location',
        highlight: ['in die Schule']
      },
      {
        spanish: '❌ Das Buch liegt auf den Tisch → ✅ Das Buch liegt auf dem Tisch',
        english: 'Wrong: "lying" is position (dative), not movement',
        highlight: ['auf dem Tisch']
      },
      {
        spanish: '❌ Er stellt das Buch auf dem Tisch → ✅ Er stellt das Buch auf den Tisch',
        english: 'Wrong: "putting" is movement (accusative), not position',
        highlight: ['auf den Tisch']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Case Prepositions', url: '/grammar/german/cases/prepositions', difficulty: 'intermediate' },
  { title: 'German Accusative Case', url: '/grammar/german/cases/accusative', difficulty: 'beginner' },
  { title: 'German Dative Case', url: '/grammar/german/cases/dative', difficulty: 'beginner' },
  { title: 'German Verb Placement', url: '/grammar/german/syntax/word-order', difficulty: 'intermediate' }
];

export default function GermanTwoWayPrepositionsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'cases',
              topic: 'two-way-prepositions',
              title: 'German Two-Way Prepositions - Accusative vs Dative Usage',
              description: 'Master German two-way prepositions that take either accusative or dative case depending on movement vs location.',
              difficulty: 'advanced',
              examples: [
                'Ich gehe in die Schule. (I go to school - accusative)',
                'Ich bin in der Schule. (I am at school - dative)',
                'Er hängt das Bild an die Wand. (He hangs the picture on the wall - accusative)',
                'Das Bild hängt an der Wand. (The picture hangs on the wall - dative)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'cases',
              topic: 'two-way-prepositions',
              title: 'German Two-Way Prepositions - Accusative vs Dative Usage'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="cases"
        topic="two-way-prepositions"
        title="German Two-Way Prepositions - Accusative vs Dative Usage"
        description="Master German two-way prepositions that take either accusative or dative case depending on movement vs location"
        difficulty="advanced"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/german/cases"
        practiceUrl="/grammar/german/cases/two-way-prepositions/practice"
        quizUrl="/grammar/german/cases/two-way-prepositions/quiz"
        songUrl="/songs/de?theme=grammar&topic=two-way-prepositions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

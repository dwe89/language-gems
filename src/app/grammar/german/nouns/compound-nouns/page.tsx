import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'nouns',
  topic: 'compound-nouns',
  title: 'German Compound Nouns - Formation Rules and Connecting Letters',
  description: 'Master German compound noun formation including connecting letters, gender rules, and common patterns.',
  difficulty: 'intermediate',
  keywords: [
    'german compound nouns',
    'compound formation german',
    'connecting letters german',
    'german word formation',
    'compound gender rules',
    'german noun combinations'
  ],
  examples: [
    'das Haus + die Tür = die Haustür (front door)',
    'die Arbeit + der Platz = der Arbeitsplatz (workplace)',
    'das Auto + der Schlüssel = der Autoschlüssel (car key)',
    'die Schule + das Buch = das Schulbuch (textbook)'
  ]
});

const sections = [
  {
    title: 'Understanding German Compound Nouns',
    content: `German **compound nouns** (Zusammengesetzte Substantive) are formed by combining **two or more words** into a single noun. This is one of German's most **productive** word formation processes, allowing for **precise** and **economical** expression.

**Basic principle**: German compounds are written as **one word** and take the **gender** of the **final element**.

**Formation patterns:**
- **Noun + Noun**: das Haus + die Tür = die Haustür
- **Adjective + Noun**: rot + der Wein = der Rotwein
- **Verb + Noun**: fahren + das Rad = das Fahrrad
- **Multiple elements**: der Hand + der Schuh + der Laden = der Handschuhladen

**Key features:**
- **Final element determines gender**: Always follows last word's gender
- **Connecting letters**: Often -s, -n, -en, -e between elements
- **Stress pattern**: Primary stress on first element
- **Unlimited length**: Theoretically infinite combinations possible

**Why compounds matter:**
- **Precision**: Express complex concepts efficiently
- **Economy**: Avoid long prepositional phrases
- **Native-like German**: Essential for advanced proficiency
- **Vocabulary expansion**: Create new words from known elements

**Learning strategy**: Understand the **logic** of compounds - they usually describe **what something is** or **what it's for**.

Understanding compound formation is **crucial** for **German vocabulary expansion** and **reading comprehension**.`,
    examples: [
      {
        spanish: 'SIMPLE: das Haus + die Tür = die Haustür (house door = front door)',
        english: 'COMPLEX: der Hand + der Schuh = der Handschuh (hand shoe = glove)',
        highlight: ['die Haustür', 'der Handschuh']
      },
      {
        spanish: 'WORKPLACE: die Arbeit + der Platz = der Arbeitsplatz (work place)',
        english: 'VEHICLE: das Feuer + das Wehr = die Feuerwehr (fire defense = fire department)',
        highlight: ['der Arbeitsplatz', 'die Feuerwehr']
      }
    ]
  },
  {
    title: 'Gender Rules for Compounds',
    content: `The **final element** always determines the **gender** of compound nouns:`,
    conjugationTable: {
      title: 'Gender Determination Rules',
      conjugations: [
        { pronoun: 'Final = masculine', form: 'der Arbeitsplatz', english: 'die Arbeit + der Platz = der Arbeitsplatz' },
        { pronoun: 'Final = feminine', form: 'die Haustür', english: 'das Haus + die Tür = die Haustür' },
        { pronoun: 'Final = neuter', form: 'das Schulbuch', english: 'die Schule + das Buch = das Schulbuch' },
        { pronoun: 'Multiple elements', form: 'der Handschuhladen', english: 'der Hand + der Schuh + der Laden = der Laden (final)' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE FINAL: der Autoschlüssel (das Auto + der Schlüssel)',
        english: 'FEMININE FINAL: die Tischlampe (der Tisch + die Lampe)',
        highlight: ['der Autoschlüssel', 'die Tischlampe']
      },
      {
        spanish: 'NEUTER FINAL: das Wohnzimmer (das Wohnen + das Zimmer)',
        english: 'LONG COMPOUND: der Krankenwagenfahrer (final: der Fahrer)',
        highlight: ['das Wohnzimmer', 'der Krankenwagenfahrer']
      }
    ]
  },
  {
    title: 'Connecting Letters (-s, -n, -en)',
    content: `**Connecting letters** (Fugenelemente) link compound elements:`,
    conjugationTable: {
      title: 'Common Connecting Letters',
      conjugations: [
        { pronoun: '-s connection', form: 'Arbeit-s-platz', english: 'die Arbeit + der Platz = der Arbeitsplatz' },
        { pronoun: '-n connection', form: 'Straße-n-bahn', english: 'die Straße + die Bahn = die Straßenbahn' },
        { pronoun: '-en connection', form: 'Herr-en-haus', english: 'der Herr + das Haus = das Herrenhaus' },
        { pronoun: '-e connection', form: 'Hund-e-hütte', english: 'der Hund + die Hütte = die Hundehütte' },
        { pronoun: 'No connection', form: 'Haus-tür', english: 'das Haus + die Tür = die Haustür' }
      ]
    },
    examples: [
      {
        spanish: '-S CONNECTING: der Lieblingssport (der Liebling + der Sport)',
        english: '-N CONNECTING: die Straßenbahn (die Straße + die Bahn)',
        highlight: ['Lieblingssport', 'Straßenbahn']
      },
      {
        spanish: '-EN CONNECTING: das Studentenleben (der Student + das Leben)',
        english: 'NO CONNECTION: der Fußball (der Fuß + der Ball)',
        highlight: ['Studentenleben', 'Fußball']
      }
    ]
  },
  {
    title: 'Noun + Noun Compounds',
    content: `**Noun + Noun** is the most common compound pattern:`,
    conjugationTable: {
      title: 'Noun + Noun Examples',
      conjugations: [
        { pronoun: 'Location', form: 'der Bahnhof', english: 'die Bahn + der Hof = train station' },
        { pronoun: 'Function', form: 'der Kühlschrank', english: 'kühl + der Schrank = refrigerator' },
        { pronoun: 'Material', form: 'das Holzhaus', english: 'das Holz + das Haus = wooden house' },
        { pronoun: 'Time', form: 'der Sommertag', english: 'der Sommer + der Tag = summer day' },
        { pronoun: 'Purpose', form: 'die Kaffeetasse', english: 'der Kaffee + die Tasse = coffee cup' }
      ]
    },
    examples: [
      {
        spanish: 'BUILDING: das Krankenhaus (der Kranke + das Haus = hospital)',
        english: 'TRANSPORT: der Flughafen (das Flug + der Hafen = airport)',
        highlight: ['das Krankenhaus', 'der Flughafen']
      },
      {
        spanish: 'FOOD: das Butterbrot (die Butter + das Brot = sandwich)',
        english: 'CLOTHING: der Wintermantel (der Winter + der Mantel = winter coat)',
        highlight: ['das Butterbrot', 'der Wintermantel']
      }
    ]
  },
  {
    title: 'Adjective + Noun Compounds',
    content: `**Adjectives** can form compounds with nouns:`,
    conjugationTable: {
      title: 'Adjective + Noun Examples',
      conjugations: [
        { pronoun: 'Color', form: 'der Rotwein', english: 'rot + der Wein = red wine' },
        { pronoun: 'Size', form: 'die Kleinstadt', english: 'klein + die Stadt = small town' },
        { pronoun: 'Quality', form: 'das Schnellboot', english: 'schnell + das Boot = speedboat' },
        { pronoun: 'Temperature', form: 'das Warmwasser', english: 'warm + das Wasser = hot water' },
        { pronoun: 'Age', form: 'die Altstadt', english: 'alt + die Stadt = old town' }
      ]
    },
    examples: [
      {
        spanish: 'COLORS: der Schwarzwald (schwarz + der Wald = Black Forest)',
        english: 'QUALITIES: die Hochschule (hoch + die Schule = university)',
        highlight: ['der Schwarzwald', 'die Hochschule']
      }
    ]
  },
  {
    title: 'Verb + Noun Compounds',
    content: `**Verb stems** can combine with nouns:`,
    conjugationTable: {
      title: 'Verb + Noun Examples',
      conjugations: [
        { pronoun: 'Action tool', form: 'das Fahrrad', english: 'fahren + das Rad = bicycle' },
        { pronoun: 'Place of action', form: 'der Spielplatz', english: 'spielen + der Platz = playground' },
        { pronoun: 'Result', form: 'das Backwerk', english: 'backen + das Werk = bakery goods' },
        { pronoun: 'Agent', form: 'der Lehrplan', english: 'lehren + der Plan = curriculum' }
      ]
    },
    examples: [
      {
        spanish: 'TOOLS: die Waschmaschine (waschen + die Maschine = washing machine)',
        english: 'PLACES: der Parkplatz (parken + der Platz = parking lot)',
        highlight: ['die Waschmaschine', 'der Parkplatz']
      }
    ]
  },
  {
    title: 'Long Compound Nouns',
    content: `German allows **very long compounds** by chaining multiple elements:`,
    examples: [
      {
        spanish: 'LONG: der Donaudampfschifffahrtskapitän (Danube steamship captain)',
        english: 'BREAKDOWN: Donau + Dampf + Schiff + Fahrt + Kapitän',
        highlight: ['Donaudampfschifffahrtskapitän']
      },
      {
        spanish: 'PRACTICAL: die Krankenversicherungskarte (health insurance card)',
        english: 'BREAKDOWN: Kranken + Versicherung + Karte',
        highlight: ['Krankenversicherungskarte']
      }
    ],
    subsections: [
      {
        title: 'Reading Strategy',
        content: 'Break long compounds into meaningful parts:',
        examples: [
          {
            spanish: 'STRATEGY: Find the final element first (determines meaning)',
            english: 'THEN: Work backwards through modifying elements',
            highlight: ['final element first']
          }
        ]
      }
    ]
  },
  {
    title: 'Compound Plurals',
    content: `**Only the final element** changes for plural:`,
    conjugationTable: {
      title: 'Compound Plural Formation',
      conjugations: [
        { pronoun: 'Singular', form: 'der Arbeitsplatz', english: 'workplace' },
        { pronoun: 'Plural', form: 'die Arbeitsplätze', english: 'workplaces (Platz → Plätze)' },
        { pronoun: 'Singular', form: 'das Schulbuch', english: 'textbook' },
        { pronoun: 'Plural', form: 'die Schulbücher', english: 'textbooks (Buch → Bücher)' }
      ]
    },
    examples: [
      {
        spanish: 'EXAMPLE: der Autoschlüssel → die Autoschlüssel (Schlüssel unchanged)',
        english: 'EXAMPLE: die Haustür → die Haustüren (Tür → Türen)',
        highlight: ['die Autoschlüssel', 'die Haustüren']
      }
    ]
  },
  {
    title: 'Stress Patterns in Compounds',
    content: `**Primary stress** falls on the **first element**:`,
    examples: [
      {
        spanish: 'STRESS: ˈArbeitsplatz (not Arbeitsˈplatz)',
        english: 'STRESS: ˈHaustür (not Hausˈtür)',
        highlight: ['ˈArbeitsplatz', 'ˈHaustür']
      },
      {
        spanish: 'LONG: ˈKrankenversicherung (stress on first element)',
        english: 'COMPARE: Versicherung (simple noun, stress on -sie-)',
        highlight: ['ˈKrankenversicherung']
      }
    ]
  },
  {
    title: 'Common Compound Patterns',
    content: `**Frequent compound types** in German:`,
    conjugationTable: {
      title: 'Common Patterns',
      conjugations: [
        { pronoun: 'Lieblings-', form: 'der Lieblingssport', english: 'favorite sport' },
        { pronoun: 'Haupt-', form: 'die Hauptstadt', english: 'capital city' },
        { pronoun: '-platz', form: 'der Marktplatz', english: 'market square' },
        { pronoun: '-haus', form: 'das Rathaus', english: 'city hall' },
        { pronoun: '-zimmer', form: 'das Wohnzimmer', english: 'living room' }
      ]
    },
    examples: [
      {
        spanish: 'FAVORITES: das Lieblingsessen (favorite food)',
        english: 'MAIN: der Hauptbahnhof (main train station)',
        highlight: ['Lieblingsessen', 'Hauptbahnhof']
      }
    ]
  },
  {
    title: 'Writing Compound Nouns',
    content: `**Always write compounds as one word** in German:`,
    examples: [
      {
        spanish: '✅ CORRECT: der Arbeitsplatz (one word)',
        english: '❌ WRONG: der Arbeits platz (two words)',
        highlight: ['der Arbeitsplatz']
      },
      {
        spanish: '✅ CORRECT: die Krankenversicherung (one word)',
        english: '❌ WRONG: die Kranken-versicherung (hyphenated)',
        highlight: ['die Krankenversicherung']
      }
    ],
    subsections: [
      {
        title: 'Exception',
        content: 'Hyphens only used for clarity with very long compounds:',
        examples: [
          {
            spanish: 'ACCEPTABLE: Donau-Dampfschifffahrts-Kapitän',
            english: 'PREFERRED: Donaudampfschifffahrtskapitän',
            highlight: ['one word preferred']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Compounds',
    content: `Here are frequent errors students make:

**1. Wrong gender**: Using first element's gender instead of last
**2. Separating words**: Writing as two words instead of one
**3. Missing connecting letters**: Omitting required -s, -n, -en
**4. Wrong stress**: Stressing final element instead of first`,
    examples: [
      {
        spanish: '❌ das Arbeitsplatz → ✅ der Arbeitsplatz',
        english: 'Wrong: final element (Platz) is masculine, so compound is masculine',
        highlight: ['der Arbeitsplatz']
      },
      {
        spanish: '❌ Arbeits platz → ✅ Arbeitsplatz',
        english: 'Wrong: must write as one word',
        highlight: ['Arbeitsplatz']
      },
      {
        spanish: '❌ Arbeitplatz → ✅ Arbeitsplatz',
        english: 'Wrong: need connecting -s- between Arbeit and Platz',
        highlight: ['Arbeitsplatz']
      },
      {
        spanish: '❌ Arbeitsˈplatz → ✅ ˈArbeitsplatz',
        english: 'Wrong: stress first element, not last',
        highlight: ['ˈArbeitsplatz']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Gender Rules', url: '/grammar/german/nouns/gender-rules', difficulty: 'beginner' },
  { title: 'German Plural Formation', url: '/grammar/german/nouns/plural-formation', difficulty: 'beginner' },
  { title: 'German Word Formation', url: '/grammar/german/morphology/word-formation', difficulty: 'intermediate' },
  { title: 'German Vocabulary Building', url: '/grammar/german/vocabulary/building-strategies', difficulty: 'intermediate' }
];

export default function GermanCompoundNounsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'nouns',
              topic: 'compound-nouns',
              title: 'German Compound Nouns - Formation Rules and Connecting Letters',
              description: 'Master German compound noun formation including connecting letters, gender rules, and common patterns.',
              difficulty: 'intermediate',
              examples: [
                'das Haus + die Tür = die Haustür (front door)',
                'die Arbeit + der Platz = der Arbeitsplatz (workplace)',
                'das Auto + der Schlüssel = der Autoschlüssel (car key)',
                'die Schule + das Buch = das Schulbuch (textbook)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'nouns',
              topic: 'compound-nouns',
              title: 'German Compound Nouns - Formation Rules and Connecting Letters'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="nouns"
        topic="compound-nouns"
        title="German Compound Nouns - Formation Rules and Connecting Letters"
        description="Master German compound noun formation including connecting letters, gender rules, and common patterns"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/german/nouns"
        practiceUrl="/grammar/german/nouns/compound-nouns/practice"
        quizUrl="/grammar/german/nouns/compound-nouns/quiz"
        songUrl="/songs/de?theme=grammar&topic=compound-nouns"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

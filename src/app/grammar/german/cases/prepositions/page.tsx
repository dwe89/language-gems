import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'cases',
  topic: 'prepositions',
  title: 'German Prepositions and Cases - Accusative, Dative, Genitive',
  description: 'Master German prepositions that govern specific cases including accusative, dative, and genitive prepositions.',
  difficulty: 'intermediate',
  keywords: [
    'german prepositions cases',
    'accusative prepositions german',
    'dative prepositions german',
    'genitive prepositions german',
    'german case prepositions'
  ],
  examples: [
    'durch den Park (through the park - accusative)',
    'mit dem Auto (with the car - dative)',
    'wegen des Regens (because of the rain - genitive)',
    'für meinen Bruder (for my brother - accusative)'
  ]
});

const sections = [
  {
    title: 'Understanding German Prepositions and Cases',
    content: `German **prepositions** (Präpositionen) **govern specific cases**, meaning they determine which case the following noun must take. This is **fundamental** to German grammar.

**Three main groups:**
- **Accusative prepositions**: Always take accusative case
- **Dative prepositions**: Always take dative case  
- **Genitive prepositions**: Always take genitive case
- **Two-way prepositions**: Take accusative OR dative (separate topic)

**Key principle:**
**Preposition + Case = Correct German**

**Why preposition cases matter:**
- **Correct grammar**: Essential for proper German
- **Clear meaning**: Cases affect meaning and clarity
- **Natural speech**: Native speakers use automatically
- **Advanced proficiency**: Mark intermediate/advanced level

**Learning strategy:**
- **Memorize groups**: Learn prepositions by case
- **Practice phrases**: Use common combinations
- **Check articles**: Articles show the case
- **Build automaticity**: Practice until natural

Understanding preposition cases is **crucial** for **correct German grammar**.`,
    examples: [
      {
        spanish: 'ACCUSATIVE: Ich gehe durch den Park. (I walk through the park.)',
        english: 'DATIVE: Ich fahre mit dem Auto. (I drive with the car.)',
        highlight: ['durch den Park', 'mit dem Auto']
      },
      {
        spanish: 'GENITIVE: Wegen des Regens bleibe ich zu Hause. (Because of the rain, I stay home.)',
        english: 'CASE CHANGE: der Park → durch den Park (nom. → acc.)',
        highlight: ['wegen des Regens', 'durch den Park']
      }
    ]
  },
  {
    title: 'Accusative Prepositions',
    content: `**Accusative prepositions** always require the **accusative case**:`,
    conjugationTable: {
      title: 'Accusative Prepositions',
      conjugations: [
        { pronoun: 'durch', form: 'through', english: 'durch den Park (through the park)' },
        { pronoun: 'für', form: 'for', english: 'für meinen Bruder (for my brother)' },
        { pronoun: 'gegen', form: 'against', english: 'gegen die Wand (against the wall)' },
        { pronoun: 'ohne', form: 'without', english: 'ohne das Buch (without the book)' },
        { pronoun: 'um', form: 'around, at (time)', english: 'um den Tisch (around the table)' },
        { pronoun: 'bis', form: 'until, to', english: 'bis nächsten Montag (until next Monday)' },
        { pronoun: 'entlang', form: 'along', english: 'den Fluss entlang (along the river)' }
      ]
    },
    examples: [
      {
        spanish: 'DURCH: Wir gehen durch den Wald. (We walk through the forest.)',
        english: 'FÜR: Das Geschenk ist für dich. (The gift is for you.)',
        highlight: ['durch den Wald', 'für dich']
      },
      {
        spanish: 'GEGEN: Er läuft gegen den Baum. (He runs against the tree.)',
        english: 'OHNE: Ich gehe ohne meinen Mantel. (I go without my coat.)',
        highlight: ['gegen den Baum', 'ohne meinen Mantel']
      }
    ]
  },
  {
    title: 'Dative Prepositions',
    content: `**Dative prepositions** always require the **dative case**:`,
    conjugationTable: {
      title: 'Dative Prepositions',
      conjugations: [
        { pronoun: 'mit', form: 'with', english: 'mit dem Auto (with the car)' },
        { pronoun: 'nach', form: 'after, to', english: 'nach der Schule (after school)' },
        { pronoun: 'bei', form: 'at, near, with', english: 'bei meiner Oma (at my grandma\'s)' },
        { pronoun: 'von', form: 'from, of', english: 'von dem Lehrer (from the teacher)' },
        { pronoun: 'zu', form: 'to', english: 'zu der Kirche (to the church)' },
        { pronoun: 'aus', form: 'from, out of', english: 'aus dem Haus (out of the house)' },
        { pronoun: 'seit', form: 'since, for', english: 'seit einem Jahr (for a year)' },
        { pronoun: 'außer', form: 'except', english: 'außer mir (except me)' },
        { pronoun: 'gegenüber', form: 'opposite', english: 'dem Bahnhof gegenüber (opposite the station)' }
      ]
    },
    examples: [
      {
        spanish: 'MIT: Ich fahre mit dem Bus. (I travel by bus.)',
        english: 'NACH: Nach dem Essen gehen wir spazieren. (After eating, we go for a walk.)',
        highlight: ['mit dem Bus', 'Nach dem Essen']
      },
      {
        spanish: 'BEI: Ich wohne bei meinen Eltern. (I live with my parents.)',
        english: 'VON: Das Buch ist von einem berühmten Autor. (The book is by a famous author.)',
        highlight: ['bei meinen Eltern', 'von einem berühmten Autor']
      }
    ]
  },
  {
    title: 'Genitive Prepositions',
    content: `**Genitive prepositions** always require the **genitive case**:`,
    conjugationTable: {
      title: 'Genitive Prepositions',
      conjugations: [
        { pronoun: 'wegen', form: 'because of', english: 'wegen des Regens (because of the rain)' },
        { pronoun: 'trotz', form: 'despite', english: 'trotz des schlechten Wetters (despite the bad weather)' },
        { pronoun: 'während', form: 'during', english: 'während der Pause (during the break)' },
        { pronoun: 'statt/anstatt', form: 'instead of', english: 'statt des Autos (instead of the car)' },
        { pronoun: 'außerhalb', form: 'outside of', english: 'außerhalb der Stadt (outside the city)' },
        { pronoun: 'innerhalb', form: 'within', english: 'innerhalb einer Woche (within a week)' },
        { pronoun: 'oberhalb', form: 'above', english: 'oberhalb des Dorfes (above the village)' },
        { pronoun: 'unterhalb', form: 'below', english: 'unterhalb der Brücke (below the bridge)' }
      ]
    },
    examples: [
      {
        spanish: 'WEGEN: Wegen des Streiks fahren keine Züge. (Because of the strike, no trains are running.)',
        english: 'TROTZ: Trotz des Regens gehen wir spazieren. (Despite the rain, we go for a walk.)',
        highlight: ['wegen des Streiks', 'trotz des Regens']
      },
      {
        spanish: 'WÄHREND: Während der Ferien reise ich. (During the holidays, I travel.)',
        english: 'STATT: Statt des Busses nehme ich das Auto. (Instead of the bus, I take the car.)',
        highlight: ['während der Ferien', 'statt des Busses']
      }
    ]
  },
  {
    title: 'Contractions with Prepositions',
    content: `**Common contractions** of prepositions with definite articles:`,
    conjugationTable: {
      title: 'Preposition Contractions',
      conjugations: [
        { pronoun: 'von + dem', form: 'vom', english: 'vom Arzt (from the doctor)' },
        { pronoun: 'zu + dem', form: 'zum', english: 'zum Bahnhof (to the station)' },
        { pronoun: 'zu + der', form: 'zur', english: 'zur Schule (to school)' },
        { pronoun: 'bei + dem', form: 'beim', english: 'beim Friseur (at the hairdresser)' },
        { pronoun: 'in + dem', form: 'im', english: 'im Haus (in the house)' },
        { pronoun: 'an + dem', form: 'am', english: 'am Montag (on Monday)' },
        { pronoun: 'für + das', form: 'fürs', english: 'fürs Auto (for the car)' },
        { pronoun: 'durch + das', form: 'durchs', english: 'durchs Fenster (through the window)' }
      ]
    },
    examples: [
      {
        spanish: 'CONTRACTION: Ich gehe zum Arzt. (I go to the doctor.)',
        english: 'FULL FORM: Ich gehe zu dem Arzt. (Same meaning, less common)',
        highlight: ['zum Arzt', 'zu dem Arzt']
      },
      {
        spanish: 'COMMON: Er kommt vom Supermarkt. (He comes from the supermarket.)',
        english: 'LOCATION: Sie ist beim Zahnarzt. (She is at the dentist.)',
        highlight: ['vom Supermarkt', 'beim Zahnarzt']
      }
    ]
  },
  {
    title: 'Memory Aids for Preposition Cases',
    content: `**Mnemonics** to remember preposition groups:`,
    conjugationTable: {
      title: 'Memory Aids',
      conjugations: [
        { pronoun: 'Accusative', form: 'DOGFU-BE', english: 'Durch, Ohne, Gegen, Für, Um, Bis, Entlang' },
        { pronoun: 'Dative', form: 'MiNaBeiVonZuAusSeit', english: 'Mit, Nach, Bei, Von, Zu, Aus, Seit, Außer, Gegenüber' },
        { pronoun: 'Genitive', form: 'WegenTrotzWährend', english: 'Wegen, Trotz, Während, Statt, Außerhalb, Innerhalb' }
      ]
    },
    examples: [
      {
        spanish: 'ACCUSATIVE PHRASE: "Dogs Often Go For Unusual Bones Eagerly"',
        english: 'DATIVE PHRASE: "My Nice Brother Visits Zoos And Sees Animals"',
        highlight: ['DOGFU-BE', 'MiNaBeiVonZuAusSeit']
      }
    ]
  },
  {
    title: 'Case Changes with Articles',
    content: `**How articles change** with different preposition cases:`,
    conjugationTable: {
      title: 'Article Changes by Case',
      conjugations: [
        { pronoun: 'der Mann (nom.)', form: 'durch den Mann (acc.)', english: 'through the man' },
        { pronoun: 'der Mann (nom.)', form: 'mit dem Mann (dat.)', english: 'with the man' },
        { pronoun: 'der Mann (nom.)', form: 'wegen des Mannes (gen.)', english: 'because of the man' },
        { pronoun: 'die Frau (nom.)', form: 'für die Frau (acc.)', english: 'for the woman' },
        { pronoun: 'die Frau (nom.)', form: 'von der Frau (dat.)', english: 'from the woman' },
        { pronoun: 'die Frau (nom.)', form: 'trotz der Frau (gen.)', english: 'despite the woman' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE: der Hund → durch den Hund → mit dem Hund → wegen des Hundes',
        english: 'FEMININE: die Katze → für die Katze → von der Katze → trotz der Katze',
        highlight: ['durch den Hund', 'von der Katze']
      }
    ]
  },
  {
    title: 'Regional and Colloquial Usage',
    content: `**Variations** in preposition case usage:`,
    examples: [
      {
        spanish: 'STANDARD: wegen des Regens (genitive)',
        english: 'COLLOQUIAL: wegen dem Regen (dative - increasingly common)',
        highlight: ['wegen des Regens', 'wegen dem Regen']
      },
      {
        spanish: 'FORMAL: trotz des schlechten Wetters (genitive)',
        english: 'INFORMAL: trotz dem schlechten Wetter (dative - regional)',
        highlight: ['trotz des schlechten Wetters', 'trotz dem schlechten Wetter']
      }
    ],
    subsections: [
      {
        title: 'Learning Recommendation',
        content: 'Learn the standard forms first, then be aware of colloquial variations:',
        examples: [
          {
            spanish: 'LEARN FIRST: wegen des Wetters (standard genitive)',
            english: 'BE AWARE: wegen dem Wetter (colloquial dative)',
            highlight: ['wegen des Wetters']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong case**: Using wrong case with prepositions
**2. Article confusion**: Not changing articles correctly
**3. Genitive avoidance**: Using dative instead of genitive
**4. Contraction errors**: Wrong or missing contractions`,
    examples: [
      {
        spanish: '❌ mit den Auto → ✅ mit dem Auto',
        english: 'Wrong: mit takes dative, not accusative',
        highlight: ['mit dem Auto']
      },
      {
        spanish: '❌ für der Mann → ✅ für den Mann',
        english: 'Wrong: für takes accusative, not nominative',
        highlight: ['für den Mann']
      },
      {
        spanish: '❌ wegen dem Regen → ✅ wegen des Regens',
        english: 'Wrong: wegen takes genitive (though dative is increasingly common)',
        highlight: ['wegen des Regens']
      },
      {
        spanish: '❌ zu dem Bahnhof → ✅ zum Bahnhof',
        english: 'Better: use contraction when possible',
        highlight: ['zum Bahnhof']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Two-Way Prepositions', url: '/grammar/german/cases/two-way-prepositions', difficulty: 'intermediate' },
  { title: 'German Accusative Case', url: '/grammar/german/cases/accusative', difficulty: 'beginner' },
  { title: 'German Dative Case', url: '/grammar/german/cases/dative', difficulty: 'beginner' },
  { title: 'German Genitive Case', url: '/grammar/german/cases/genitive', difficulty: 'intermediate' }
];

export default function GermanPrepositionCasesPage() {
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
              topic: 'prepositions',
              title: 'German Prepositions and Cases - Accusative, Dative, Genitive',
              description: 'Master German prepositions that govern specific cases including accusative, dative, and genitive prepositions.',
              difficulty: 'intermediate',
              examples: [
                'durch den Park (through the park - accusative)',
                'mit dem Auto (with the car - dative)',
                'wegen des Regens (because of the rain - genitive)',
                'für meinen Bruder (for my brother - accusative)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'cases',
              topic: 'prepositions',
              title: 'German Prepositions and Cases - Accusative, Dative, Genitive'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="cases"
        topic="prepositions"
        title="German Prepositions and Cases - Accusative, Dative, Genitive"
        description="Master German prepositions that govern specific cases including accusative, dative, and genitive prepositions"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/german/cases"
        practiceUrl="/grammar/german/cases/prepositions/practice"
        quizUrl="/grammar/german/cases/prepositions/quiz"
        songUrl="/songs/de?theme=grammar&topic=prepositions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

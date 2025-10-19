import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'prepositions',
  topic: 'accusative-prepositions',
  title: 'German Accusative Prepositions - bis, durch, für, gegen, ohne, um',
  description: 'Master German accusative prepositions including bis, durch, für, gegen, ohne, um with usage rules and examples.',
  difficulty: 'intermediate',
  keywords: [
    'german accusative prepositions',
    'bis durch für gegen ohne um',
    'accusative case prepositions',
    'german preposition rules',
    'prepositions accusative german',
    'german grammar prepositions'
  ],
  examples: [
    'Ich gehe durch den Park. (I go through the park.)',
    'Das Geschenk ist für dich. (The gift is for you.)',
    'Wir fahren um die Stadt. (We drive around the city.)',
    'Er kommt ohne seinen Bruder. (He comes without his brother.)'
  ]
});

const sections = [
  {
    title: 'Understanding German Accusative Prepositions',
    content: `German **accusative prepositions** always require the **accusative case** for the noun or pronoun that follows them. These prepositions are **fixed** - they never change case regardless of context.

**The main accusative prepositions:**
- **bis**: until, to, by (time/place)
- **durch**: through, by means of
- **für**: for, in favor of
- **gegen**: against, towards (time)
- **ohne**: without
- **um**: around, at (time)

**Key characteristics:**
- **Fixed case**: Always accusative, no exceptions
- **High frequency**: Used constantly in everyday German
- **Precise meanings**: Each has specific usage contexts
- **Article changes**: der→den, die→die, das→das, ein→einen

**Why accusative prepositions matter:**
- **Essential communication**: Express location, time, purpose
- **Grammatical accuracy**: Must use correct case
- **Natural German**: Required for fluent expression
- **Sentence structure**: Affect word order and meaning

**Learning strategy**: Memorize the **six main prepositions** first, then learn their **specific meanings** and **common combinations**.

Understanding accusative prepositions is **crucial** for **intermediate German** and **accurate case usage**.`,
    examples: [
      {
        spanish: 'MOVEMENT: durch den Park (through the park)',
        english: 'PURPOSE: für meinen Vater (for my father)',
        highlight: ['durch den Park', 'für meinen Vater']
      },
      {
        spanish: 'TIME: bis nächsten Montag (until next Monday)',
        english: 'OPPOSITION: gegen die Wand (against the wall)',
        highlight: ['bis nächsten Montag', 'gegen die Wand']
      },
      {
        spanish: 'ABSENCE: ohne meine Schwester (without my sister)',
        english: 'AROUND: um das Haus (around the house)',
        highlight: ['ohne meine Schwester', 'um das Haus']
      }
    ]
  },
  {
    title: 'bis - Until, To, By',
    content: `**bis** expresses **time limits**, **destinations**, and **extent**:`,
    conjugationTable: {
      title: 'bis Usage Patterns',
      conjugations: [
        { pronoun: 'Time limit', form: 'bis nächsten Freitag', english: 'until next Friday' },
        { pronoun: 'Destination', form: 'bis zum Bahnhof', english: 'to the train station' },
        { pronoun: 'Extent', form: 'bis zehn Uhr', english: 'until ten o\'clock' },
        { pronoun: 'With numbers', form: 'bis hundert zählen', english: 'count to one hundred' },
        { pronoun: 'Combined prep', form: 'bis zu + dative', english: 'bis zu meinem Haus (to my house)' }
      ]
    },
    examples: [
      {
        spanish: 'TIME: Ich arbeite bis sechs Uhr. (I work until six o\'clock.)',
        english: 'PLACE: Wir gehen bis zur Kirche. (We go to the church.)',
        highlight: ['bis sechs Uhr', 'bis zur Kirche']
      },
      {
        spanish: 'DEADLINE: bis nächsten Montag (by next Monday)',
        english: 'EXTENT: von eins bis zehn (from one to ten)',
        highlight: ['bis nächsten Montag', 'bis zehn']
      }
    ],
    subsections: [
      {
        title: 'Special Note',
        content: 'bis often combines with zu for places:',
        examples: [
          {
            spanish: 'COMMON: bis zum Bahnhof (to the station)',
            english: 'PATTERN: bis zu + dative location',
            highlight: ['bis zum Bahnhof']
          }
        ]
      }
    ]
  },
  {
    title: 'durch - Through, By Means Of',
    content: `**durch** expresses **movement through** and **means/method**:`,
    conjugationTable: {
      title: 'durch Usage Patterns',
      conjugations: [
        { pronoun: 'Through space', form: 'durch den Park', english: 'through the park' },
        { pronoun: 'Through time', form: 'durch die Nacht', english: 'through the night' },
        { pronoun: 'By means of', form: 'durch harte Arbeit', english: 'through hard work' },
        { pronoun: 'Agent (passive)', form: 'durch den Lehrer', english: 'by the teacher' },
        { pronoun: 'Cause', form: 'durch den Regen', english: 'because of the rain' }
      ]
    },
    examples: [
      {
        spanish: 'MOVEMENT: Wir gehen durch den Wald. (We go through the forest.)',
        english: 'METHOD: durch Übung lernen (learn through practice)',
        highlight: ['durch den Wald', 'durch Übung']
      },
      {
        spanish: 'PASSIVE: Das Buch wurde durch den Autor geschrieben. (The book was written by the author.)',
        english: 'CAUSE: durch einen Unfall (due to an accident)',
        highlight: ['durch den Autor', 'durch einen Unfall']
      }
    ]
  },
  {
    title: 'für - For, In Favor Of',
    content: `**für** expresses **purpose**, **benefit**, **duration**, and **exchange**:`,
    conjugationTable: {
      title: 'für Usage Patterns',
      conjugations: [
        { pronoun: 'Beneficiary', form: 'für meinen Vater', english: 'for my father' },
        { pronoun: 'Purpose', form: 'für die Schule', english: 'for school' },
        { pronoun: 'Duration', form: 'für zwei Wochen', english: 'for two weeks' },
        { pronoun: 'Exchange', form: 'für zehn Euro', english: 'for ten euros' },
        { pronoun: 'Support', form: 'für den Frieden', english: 'for peace' },
        { pronoun: 'Instead of', form: 'für mich sprechen', english: 'speak for me' }
      ]
    },
    examples: [
      {
        spanish: 'GIFT: Das Geschenk ist für dich. (The gift is for you.)',
        english: 'PURPOSE: Bücher für die Universität (books for university)',
        highlight: ['für dich', 'für die Universität']
      },
      {
        spanish: 'TIME: für eine Stunde (for one hour)',
        english: 'PRICE: für fünfzig Euro (for fifty euros)',
        highlight: ['für eine Stunde', 'für fünfzig Euro']
      }
    ]
  },
  {
    title: 'gegen - Against, Towards (Time)',
    content: `**gegen** expresses **opposition**, **approximate time**, and **direction**:`,
    conjugationTable: {
      title: 'gegen Usage Patterns',
      conjugations: [
        { pronoun: 'Opposition', form: 'gegen die Wand', english: 'against the wall' },
        { pronoun: 'Approximate time', form: 'gegen acht Uhr', english: 'around eight o\'clock' },
        { pronoun: 'Direction', form: 'gegen Norden', english: 'towards the north' },
        { pronoun: 'Exchange', form: 'gegen Geld', english: 'for money' },
        { pronoun: 'Comparison', form: 'gegen ihn', english: 'compared to him' },
        { pronoun: 'Medicine', form: 'gegen Kopfschmerzen', english: 'for headaches' }
      ]
    },
    examples: [
      {
        spanish: 'PHYSICAL: Er lehnt gegen den Baum. (He leans against the tree.)',
        english: 'TIME: gegen Mittag (around noon)',
        highlight: ['gegen den Baum', 'gegen Mittag']
      },
      {
        spanish: 'OPPOSITION: gegen den Plan (against the plan)',
        english: 'MEDICINE: Tabletten gegen Schmerzen (tablets for pain)',
        highlight: ['gegen den Plan', 'gegen Schmerzen']
      }
    ]
  },
  {
    title: 'ohne - Without',
    content: `**ohne** expresses **absence** or **lack of something**:`,
    conjugationTable: {
      title: 'ohne Usage Patterns',
      conjugations: [
        { pronoun: 'Without person', form: 'ohne meinen Bruder', english: 'without my brother' },
        { pronoun: 'Without thing', form: 'ohne das Auto', english: 'without the car' },
        { pronoun: 'Without action', form: 'ohne zu fragen', english: 'without asking' },
        { pronoun: 'Without quality', form: 'ohne Probleme', english: 'without problems' },
        { pronoun: 'Expressions', form: 'ohne Zweifel', english: 'without doubt' }
      ]
    },
    examples: [
      {
        spanish: 'PERSON: Ich gehe ohne dich. (I go without you.)',
        english: 'THING: Kaffee ohne Zucker (coffee without sugar)',
        highlight: ['ohne dich', 'ohne Zucker']
      },
      {
        spanish: 'INFINITIVE: ohne zu sprechen (without speaking)',
        english: 'EXPRESSION: ohne Frage (without question)',
        highlight: ['ohne zu sprechen', 'ohne Frage']
      }
    ]
  },
  {
    title: 'um - Around, At (Time)',
    content: `**um** expresses **circular movement**, **specific time**, and **concern**:`,
    conjugationTable: {
      title: 'um Usage Patterns',
      conjugations: [
        { pronoun: 'Around place', form: 'um das Haus', english: 'around the house' },
        { pronoun: 'Specific time', form: 'um acht Uhr', english: 'at eight o\'clock' },
        { pronoun: 'Concern/about', form: 'um seine Gesundheit', english: 'about his health' },
        { pronoun: 'Difference', form: 'um zehn Euro', english: 'by ten euros' },
        { pronoun: 'Purpose (um...zu)', form: 'um zu lernen', english: 'in order to learn' }
      ]
    },
    examples: [
      {
        spanish: 'CIRCULAR: Wir gehen um den See. (We walk around the lake.)',
        english: 'TIME: um neun Uhr (at nine o\'clock)',
        highlight: ['um den See', 'um neun Uhr']
      },
      {
        spanish: 'CONCERN: Sorge um die Kinder (worry about the children)',
        english: 'PURPOSE: um Deutsch zu lernen (in order to learn German)',
        highlight: ['um die Kinder', 'um zu lernen']
      }
    ]
  },
  {
    title: 'Article Changes with Accusative Prepositions',
    content: `**Articles change** to accusative case after these prepositions:`,
    conjugationTable: {
      title: 'Article Changes in Accusative',
      conjugations: [
        { pronoun: 'Masculine', form: 'der → den', english: 'durch den Park, für den Mann' },
        { pronoun: 'Feminine', form: 'die → die', english: 'ohne die Frau, um die Stadt' },
        { pronoun: 'Neuter', form: 'das → das', english: 'gegen das Haus, bis das Ende' },
        { pronoun: 'Plural', form: 'die → die', english: 'für die Kinder, ohne die Bücher' },
        { pronoun: 'Indefinite masc', form: 'ein → einen', english: 'durch einen Tunnel, für einen Freund' },
        { pronoun: 'Indefinite fem/neut', form: 'eine/ein → eine/ein', english: 'ohne eine Pause, um ein Haus' }
      ]
    },
    examples: [
      {
        spanish: 'MASCULINE: durch den dunklen Wald (through the dark forest)',
        english: 'INDEFINITE: für einen guten Freund (for a good friend)',
        highlight: ['durch den dunklen', 'für einen guten']
      }
    ]
  },
  {
    title: 'Common Expressions with Accusative Prepositions',
    content: `**Fixed expressions** using accusative prepositions:`,
    conjugationTable: {
      title: 'Common Fixed Expressions',
      conjugations: [
        { pronoun: 'für immer', form: 'forever', english: 'Ich liebe dich für immer.' },
        { pronoun: 'ohne Zweifel', form: 'without doubt', english: 'Das ist ohne Zweifel richtig.' },
        { pronoun: 'um Gottes willen', form: 'for God\'s sake', english: 'Um Gottes willen, sei vorsichtig!' },
        { pronoun: 'gegen den Strom', form: 'against the current', english: 'Er schwimmt gegen den Strom.' },
        { pronoun: 'durch und durch', form: 'through and through', english: 'Er ist durch und durch ehrlich.' },
        { pronoun: 'bis auf weiteres', form: 'until further notice', english: 'Geschlossen bis auf weiteres.' }
      ]
    },
    examples: [
      {
        spanish: 'TIME: um diese Zeit (at this time)',
        english: 'MANNER: ohne Probleme (without problems)',
        highlight: ['um diese Zeit', 'ohne Probleme']
      }
    ]
  },
  {
    title: 'Contractions with Accusative Prepositions',
    content: `Some accusative prepositions **contract** with articles:`,
    conjugationTable: {
      title: 'Common Contractions',
      conjugations: [
        { pronoun: 'für + das', form: 'fürs', english: 'fürs Wochenende (for the weekend)' },
        { pronoun: 'um + das', form: 'ums', english: 'ums Haus (around the house)' },
        { pronoun: 'durch + das', form: 'durchs', english: 'durchs Fenster (through the window)' }
      ]
    },
    examples: [
      {
        spanish: 'CONTRACTION: fürs Leben (for life)',
        english: 'FULL FORM: für das Leben (for life)',
        highlight: ['fürs Leben', 'für das Leben']
      }
    ]
  },
  {
    title: 'Word Order with Accusative Prepositions',
    content: `**Prepositional phrases** can appear in different positions:`,
    examples: [
      {
        spanish: 'NORMAL: Ich gehe durch den Park. (I go through the park.)',
        english: 'FRONTED: Durch den Park gehe ich. (Through the park I go.)',
        highlight: ['durch den Park', 'Durch den Park gehe ich']
      },
      {
        spanish: 'END POSITION: Ich kaufe ein Geschenk für dich. (I buy a gift for you.)',
        english: 'QUESTION: Für wen kaufst du das? (For whom do you buy that?)',
        highlight: ['für dich', 'Für wen']
      }
    ]
  },
  {
    title: 'Common Mistakes with Accusative Prepositions',
    content: `Here are frequent errors students make:

**1. Wrong case**: Using dative instead of accusative
**2. Preposition confusion**: Using wrong preposition for context
**3. Article errors**: Wrong accusative article forms
**4. Word order**: Wrong position of prepositional phrases`,
    examples: [
      {
        spanish: '❌ durch dem Park → ✅ durch den Park',
        english: 'Wrong: durch takes accusative, not dative',
        highlight: ['durch den Park']
      },
      {
        spanish: '❌ für zwei Stunden → ✅ zwei Stunden lang',
        english: 'Better: use lang for duration, für for purpose',
        highlight: ['zwei Stunden lang']
      },
      {
        spanish: '❌ ohne der Hilfe → ✅ ohne die Hilfe',
        english: 'Wrong: ohne takes accusative, not dative',
        highlight: ['ohne die Hilfe']
      },
      {
        spanish: '❌ um dem Haus → ✅ um das Haus',
        english: 'Wrong: um takes accusative, not dative',
        highlight: ['um das Haus']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Dative Prepositions', url: '/grammar/german/prepositions/dative-prepositions', difficulty: 'intermediate' },
  { title: 'German Two-Way Prepositions', url: '/grammar/german/prepositions/two-way-prepositions', difficulty: 'intermediate' },
  { title: 'German Accusative Case', url: '/grammar/german/cases/accusative', difficulty: 'intermediate' },
  { title: 'German Articles', url: '/grammar/german/nouns/articles', difficulty: 'beginner' }
];

export default function GermanAccusativePrepositionsPage() {
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
              topic: 'accusative-prepositions',
              title: 'German Accusative Prepositions - bis, durch, für, gegen, ohne, um',
              description: 'Master German accusative prepositions including bis, durch, für, gegen, ohne, um with usage rules and examples.',
              difficulty: 'intermediate',
              examples: [
                'Ich gehe durch den Park. (I go through the park.)',
                'Das Geschenk ist für dich. (The gift is for you.)',
                'Wir fahren um die Stadt. (We drive around the city.)',
                'Er kommt ohne seinen Bruder. (He comes without his brother.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'prepositions',
              topic: 'accusative-prepositions',
              title: 'German Accusative Prepositions - bis, durch, für, gegen, ohne, um'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="prepositions"
        topic="accusative-prepositions"
        title="German Accusative Prepositions - bis, durch, für, gegen, ohne, um"
        description="Master German accusative prepositions including bis, durch, für, gegen, ohne, um with usage rules and examples"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/german/prepositions"
        practiceUrl="/grammar/german/prepositions/accusative-prepositions/practice"
        quizUrl="/grammar/german/prepositions/accusative-prepositions/quiz"
        songUrl="/songs/de?theme=grammar&topic=accusative-prepositions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

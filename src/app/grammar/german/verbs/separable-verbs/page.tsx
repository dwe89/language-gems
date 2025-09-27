import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'verbs',
  topic: 'separable-verbs',
  title: 'German Separable Verbs - Formation, Word Order, and Usage',
  description: 'Master German separable verbs including prefix separation, word order rules, and common separable verb patterns.',
  difficulty: 'intermediate',
  keywords: [
    'german separable verbs',
    'trennbare verben german',
    'separable prefix german',
    'german verb prefixes',
    'separable verb word order',
    'german verb separation'
  ],
  examples: [
    'Ich stehe um 7 Uhr auf. (I get up at 7 o\'clock.)',
    'Er kommt morgen an. (He arrives tomorrow.)',
    'Wir gehen heute aus. (We go out today.)',
    'Sie macht das Licht an. (She turns on the light.)'
  ]
});

const sections = [
  {
    title: 'Understanding German Separable Verbs',
    content: `German **separable verbs** (trennbare Verben) consist of a **base verb** plus a **separable prefix**. The prefix **separates** from the verb in certain grammatical contexts, creating unique word order patterns.

**Structure**: **Prefix + Base Verb** = Separable Verb
- **aufstehen** = auf (up) + stehen (stand) = to get up
- **ankommen** = an (at) + kommen (come) = to arrive
- **ausgehen** = aus (out) + gehen (go) = to go out

**Key characteristics:**
- **Stressed prefix**: Separable prefixes are always stressed
- **Separates in main clauses**: Prefix goes to end of sentence
- **Stays together**: In subordinate clauses and with modal verbs
- **High frequency**: Very common in everyday German

**Common separable prefixes:**
- **ab-, an-, auf-, aus-, bei-, ein-, mit-, nach-, vor-, zu-**

**Why separable verbs matter:**
- **Essential vocabulary**: Many common verbs are separable
- **Word order impact**: Affect sentence structure significantly
- **Meaning precision**: Prefixes change verb meanings dramatically
- **Natural German**: Required for fluent expression

**Learning strategy**: Learn separable verbs as **complete units** and practice **word order patterns** systematically.

Understanding separable verbs is **crucial** for **intermediate German** and **natural sentence construction**.`,
    examples: [
      {
        spanish: 'SEPARATED: Ich stehe morgen früh auf. (I get up early tomorrow.)',
        english: 'TOGETHER: Ich will morgen früh aufstehen. (I want to get up early tomorrow.)',
        highlight: ['stehe auf', 'aufstehen']
      },
      {
        spanish: 'MAIN CLAUSE: Er kommt um 8 Uhr an. (He arrives at 8 o\'clock.)',
        english: 'SUBORDINATE: Ich weiß, dass er um 8 Uhr ankommt. (I know that he arrives at 8 o\'clock.)',
        highlight: ['kommt an', 'ankommt']
      }
    ]
  },
  {
    title: 'Common Separable Prefixes and Meanings',
    content: `**Separable prefixes** add specific meanings to base verbs:`,
    conjugationTable: {
      title: 'Common Separable Prefixes',
      conjugations: [
        { pronoun: 'auf-', form: 'up, open', english: 'aufstehen (get up), aufmachen (open)' },
        { pronoun: 'an-', form: 'on, at, to', english: 'ankommen (arrive), anrufen (call)' },
        { pronoun: 'aus-', form: 'out, off', english: 'ausgehen (go out), ausmachen (turn off)' },
        { pronoun: 'ein-', form: 'in, into', english: 'einsteigen (get in), einkaufen (shop)' },
        { pronoun: 'ab-', form: 'off, away', english: 'abfahren (depart), abnehmen (lose weight)' },
        { pronoun: 'mit-', form: 'with, along', english: 'mitkommen (come along), mitmachen (participate)' },
        { pronoun: 'vor-', form: 'before, forward', english: 'vorstellen (introduce), vorbereiten (prepare)' },
        { pronoun: 'zu-', form: 'to, closed', english: 'zumachen (close), zuhören (listen)' }
      ]
    },
    examples: [
      {
        spanish: 'DIRECTION: Er geht die Treppe hinauf. (He goes up the stairs.)',
        english: 'ACTION: Sie macht das Fenster auf. (She opens the window.)',
        highlight: ['geht hinauf', 'macht auf']
      },
      {
        spanish: 'ARRIVAL: Der Zug kommt pünktlich an. (The train arrives on time.)',
        english: 'DEPARTURE: Wir fahren morgen ab. (We depart tomorrow.)',
        highlight: ['kommt an', 'fahren ab']
      }
    ]
  },
  {
    title: 'Word Order in Main Clauses',
    content: `In **main clauses**, the **prefix separates** and goes to the **end** of the sentence:`,
    conjugationTable: {
      title: 'Main Clause Word Order',
      conjugations: [
        { pronoun: 'Present tense', form: 'Ich stehe um 7 auf.', english: 'I get up at 7.' },
        { pronoun: 'Past tense', form: 'Er kam gestern an.', english: 'He arrived yesterday.' },
        { pronoun: 'Questions', form: 'Wann stehst du auf?', english: 'When do you get up?' },
        { pronoun: 'Commands', form: 'Steh auf!', english: 'Get up!' }
      ]
    },
    examples: [
      {
        spanish: 'STATEMENT: Wir gehen heute Abend aus. (We go out this evening.)',
        english: 'QUESTION: Gehst du mit uns aus? (Are you going out with us?)',
        highlight: ['gehen aus', 'Gehst du aus']
      },
      {
        spanish: 'TIME: Sie ruft mich später an. (She calls me later.)',
        english: 'COMMAND: Ruf mich an! (Call me!)',
        highlight: ['ruft an', 'Ruf an']
      }
    ],
    subsections: [
      {
        title: 'Pattern',
        content: 'Subject + Conjugated Verb + ... + Separable Prefix',
        examples: [
          {
            spanish: 'PATTERN: Ich [verb] [time/object] [prefix].',
            english: 'EXAMPLE: Ich kaufe morgen Brot ein.',
            highlight: ['kaufe ein']
          }
        ]
      }
    ]
  },
  {
    title: 'Word Order in Subordinate Clauses',
    content: `In **subordinate clauses**, separable verbs **stay together** at the end:`,
    conjugationTable: {
      title: 'Subordinate Clause Word Order',
      conjugations: [
        { pronoun: 'dass-clause', form: '..., dass ich um 7 aufstehe.', english: '..., that I get up at 7.' },
        { pronoun: 'weil-clause', form: '..., weil er gestern ankam.', english: '..., because he arrived yesterday.' },
        { pronoun: 'wenn-clause', form: '..., wenn du mitkommst.', english: '..., if you come along.' },
        { pronoun: 'ob-clause', form: '..., ob sie ausgeht.', english: '..., whether she goes out.' }
      ]
    },
    examples: [
      {
        spanish: 'MAIN: Ich stehe früh auf. → SUBORDINATE: ..., dass ich früh aufstehe.',
        english: 'MAIN: Er kommt mit. → SUBORDINATE: ..., weil er mitkommt.',
        highlight: ['aufstehe', 'mitkommt']
      }
    ]
  },
  {
    title: 'Separable Verbs with Modal Verbs',
    content: `With **modal verbs**, separable verbs **stay together** as infinitives:`,
    conjugationTable: {
      title: 'Modal Verb + Separable Verb',
      conjugations: [
        { pronoun: 'können', form: 'Ich kann früh aufstehen.', english: 'I can get up early.' },
        { pronoun: 'müssen', form: 'Du musst pünktlich ankommen.', english: 'You must arrive on time.' },
        { pronoun: 'wollen', form: 'Wir wollen heute ausgehen.', english: 'We want to go out today.' },
        { pronoun: 'sollen', form: 'Sie soll mich anrufen.', english: 'She should call me.' }
      ]
    },
    examples: [
      {
        spanish: 'MODAL: Ich will das Licht anmachen. (I want to turn on the light.)',
        english: 'COMPARE: Ich mache das Licht an. (I turn on the light.)',
        highlight: ['anmachen', 'mache an']
      }
    ]
  },
  {
    title: 'Perfect Tense with Separable Verbs',
    content: `In **perfect tense**, the prefix comes **before** the past participle:`,
    conjugationTable: {
      title: 'Perfect Tense Formation',
      conjugations: [
        { pronoun: 'aufstehen', form: 'aufgestanden', english: 'Ich bin aufgestanden. (I got up.)' },
        { pronoun: 'ankommen', form: 'angekommen', english: 'Er ist angekommen. (He arrived.)' },
        { pronoun: 'einkaufen', form: 'eingekauft', english: 'Wir haben eingekauft. (We shopped.)' },
        { pronoun: 'anrufen', form: 'angerufen', english: 'Sie hat angerufen. (She called.)' }
      ]
    },
    examples: [
      {
        spanish: 'PERFECT: Ich bin um 7 Uhr aufgestanden. (I got up at 7 o\'clock.)',
        english: 'PERFECT: Er hat mich gestern angerufen. (He called me yesterday.)',
        highlight: ['aufgestanden', 'angerufen']
      }
    ],
    subsections: [
      {
        title: 'Pattern',
        content: 'Prefix + ge + past participle stem + ending',
        examples: [
          {
            spanish: 'PATTERN: auf + ge + stand + en = aufgestanden',
            english: 'PATTERN: an + ge + ruf + en = angerufen',
            highlight: ['aufgestanden', 'angerufen']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Separable Verbs - Daily Activities',
    content: `**Essential separable verbs** for daily activities:`,
    conjugationTable: {
      title: 'Daily Activity Verbs',
      conjugations: [
        { pronoun: 'aufstehen', form: 'get up', english: 'Ich stehe um 7 auf. (I get up at 7.)' },
        { pronoun: 'aufwachen', form: 'wake up', english: 'Er wacht früh auf. (He wakes up early.)' },
        { pronoun: 'anziehen', form: 'put on (clothes)', english: 'Sie zieht die Jacke an. (She puts on the jacket.)' },
        { pronoun: 'ausziehen', form: 'take off (clothes)', english: 'Ich ziehe die Schuhe aus. (I take off the shoes.)' },
        { pronoun: 'einkaufen', form: 'shop', english: 'Wir kaufen ein. (We shop.)' },
        { pronoun: 'fernsehen', form: 'watch TV', english: 'Sie sieht fern. (She watches TV.)' }
      ]
    },
    examples: [
      {
        spanish: 'MORNING: Ich wache auf, stehe auf und ziehe mich an.',
        english: 'EVENING: Wir sehen fern und gehen früh ins Bett.',
        highlight: ['wache auf, stehe auf', 'sehen fern']
      }
    ]
  },
  {
    title: 'Common Separable Verbs - Movement',
    content: `**Movement-related separable verbs**:`,
    conjugationTable: {
      title: 'Movement Verbs',
      conjugations: [
        { pronoun: 'ankommen', form: 'arrive', english: 'Der Zug kommt an. (The train arrives.)' },
        { pronoun: 'abfahren', form: 'depart', english: 'Wir fahren ab. (We depart.)' },
        { pronoun: 'einsteigen', form: 'get in/on', english: 'Sie steigt ein. (She gets in.)' },
        { pronoun: 'aussteigen', form: 'get out/off', english: 'Er steigt aus. (He gets out.)' },
        { pronoun: 'mitkommen', form: 'come along', english: 'Kommst du mit? (Are you coming along?)' },
        { pronoun: 'weggehen', form: 'go away', english: 'Sie geht weg. (She goes away.)' }
      ]
    },
    examples: [
      {
        spanish: 'TRAVEL: Wir steigen in den Bus ein und fahren ab.',
        english: 'ARRIVAL: Er kommt um 8 Uhr an und steigt aus.',
        highlight: ['steigen ein', 'kommt an']
      }
    ]
  },
  {
    title: 'Common Separable Verbs - Communication',
    content: `**Communication-related separable verbs**:`,
    conjugationTable: {
      title: 'Communication Verbs',
      conjugations: [
        { pronoun: 'anrufen', form: 'call (phone)', english: 'Ich rufe dich an. (I call you.)' },
        { pronoun: 'zurückrufen', form: 'call back', english: 'Er ruft zurück. (He calls back.)' },
        { pronoun: 'zuhören', form: 'listen', english: 'Sie hört zu. (She listens.)' },
        { pronoun: 'vorstellen', form: 'introduce', english: 'Ich stelle mich vor. (I introduce myself.)' },
        { pronoun: 'einladen', form: 'invite', english: 'Wir laden euch ein. (We invite you.)' }
      ]
    },
    examples: [
      {
        spanish: 'PHONE: Ich rufe dich später an. (I\'ll call you later.)',
        english: 'MEETING: Er stellt sich vor. (He introduces himself.)',
        highlight: ['rufe an', 'stellt vor']
      }
    ]
  },
  {
    title: 'Separable vs Inseparable Prefixes',
    content: `**Some prefixes** can be both separable and inseparable with different meanings:`,
    conjugationTable: {
      title: 'Separable vs Inseparable',
      conjugations: [
        { pronoun: 'übersetzen (sep)', form: 'ferry across', english: 'Er setzt uns über. (He ferries us across.)' },
        { pronoun: 'übersetzen (insep)', form: 'translate', english: 'Ich übersetze den Text. (I translate the text.)' },
        { pronoun: 'umfahren (sep)', form: 'knock down', english: 'Er fährt den Baum um. (He knocks down the tree.)' },
        { pronoun: 'umfahren (insep)', form: 'drive around', english: 'Wir umfahren die Stadt. (We drive around the city.)' }
      ]
    },
    examples: [
      {
        spanish: 'SEPARABLE: wiederholen → Er holt das Buch wieder. (He fetches the book again.)',
        english: 'INSEPARABLE: wiederholen → Ich wiederhole die Lektion. (I repeat the lesson.)',
        highlight: ['holt wieder', 'wiederhole']
      }
    ]
  },
  {
    title: 'Imperative with Separable Verbs',
    content: `In **commands**, the prefix **separates** and goes to the end:`,
    examples: [
      {
        spanish: 'INFORMAL: Steh auf! (Get up!) Komm mit! (Come along!)',
        english: 'FORMAL: Stehen Sie auf! (Get up!) Kommen Sie mit! (Come along!)',
        highlight: ['Steh auf', 'Komm mit']
      },
      {
        spanish: 'PLURAL: Steht auf! (Get up!) Kommt mit! (Come along!)',
        english: 'POLITE: Rufen Sie mich an! (Call me!)',
        highlight: ['Steht auf', 'Rufen Sie an']
      }
    ]
  },
  {
    title: 'Common Mistakes with Separable Verbs',
    content: `Here are frequent errors students make:

**1. Wrong separation**: Not separating in main clauses
**2. Wrong position**: Wrong placement of separated prefix
**3. Modal verb errors**: Separating with modal verbs
**4. Perfect tense**: Wrong past participle formation`,
    examples: [
      {
        spanish: '❌ Ich aufstehe um 7 → ✅ Ich stehe um 7 auf',
        english: 'Wrong: must separate prefix in main clause',
        highlight: ['stehe auf']
      },
      {
        spanish: '❌ Ich will auf stehen → ✅ Ich will aufstehen',
        english: 'Wrong: don\'t separate with modal verbs',
        highlight: ['aufstehen']
      },
      {
        spanish: '❌ Ich habe gestanden auf → ✅ Ich bin aufgestanden',
        english: 'Wrong: prefix goes before ge- in past participle',
        highlight: ['aufgestanden']
      },
      {
        spanish: '❌ ..., dass ich auf stehe → ✅ ..., dass ich aufstehe',
        english: 'Wrong: don\'t separate in subordinate clauses',
        highlight: ['aufstehe']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Word Order', url: '/grammar/german/syntax/word-order', difficulty: 'intermediate' },
  { title: 'German Modal Verbs', url: '/grammar/german/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'German Perfect Tense', url: '/grammar/german/verbs/perfect-tense', difficulty: 'intermediate' },
  { title: 'German Inseparable Verbs', url: '/grammar/german/verbs/inseparable-verbs', difficulty: 'intermediate' }
];

export default function GermanSeparableVerbsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'german',
              category: 'verbs',
              topic: 'separable-verbs',
              title: 'German Separable Verbs - Formation, Word Order, and Usage',
              description: 'Master German separable verbs including prefix separation, word order rules, and common separable verb patterns.',
              difficulty: 'intermediate',
              examples: [
                'Ich stehe um 7 Uhr auf. (I get up at 7 o\'clock.)',
                'Er kommt morgen an. (He arrives tomorrow.)',
                'Wir gehen heute aus. (We go out today.)',
                'Sie macht das Licht an. (She turns on the light.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'verbs',
              topic: 'separable-verbs',
              title: 'German Separable Verbs - Formation, Word Order, and Usage'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="verbs"
        topic="separable-verbs"
        title="German Separable Verbs - Formation, Word Order, and Usage"
        description="Master German separable verbs including prefix separation, word order rules, and common separable verb patterns"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/german/verbs"
        practiceUrl="/grammar/german/verbs/separable-verbs/practice"
        quizUrl="/grammar/german/verbs/separable-verbs/quiz"
        songUrl="/songs/de?theme=grammar&topic=separable-verbs"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

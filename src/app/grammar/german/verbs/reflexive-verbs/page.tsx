import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'verbs',
  topic: 'reflexive-verbs',
  title: 'German Reflexive Verbs - Sich Waschen, Sich Freuen, Sich Erinnern',
  description: 'Master German reflexive verbs including accusative and dative reflexive pronouns with common verbs.',
  difficulty: 'intermediate',
  keywords: [
    'german reflexive verbs',
    'sich waschen german',
    'german reflexive pronouns',
    'sich freuen german',
    'german reflexive grammar'
  ],
  examples: [
    'Ich wasche mich. (I wash myself.)',
    'Er freut sich. (He is happy.)',
    'Wir erinnern uns. (We remember.)',
    'Sie interessiert sich für Musik. (She is interested in music.)'
  ]
});

const sections = [
  {
    title: 'Understanding German Reflexive Verbs',
    content: `German **reflexive verbs** (reflexive Verben) use **reflexive pronouns** where the subject performs an action **on itself**. They are essential for expressing personal care, emotions, and many daily activities.

**Two types of reflexive verbs:**
- **Accusative reflexive**: Direct object (mich, dich, sich, uns, euch, sich)
- **Dative reflexive**: Indirect object (mir, dir, sich, uns, euch, sich)

**Key features:**
- **Reflexive pronouns**: Must match the subject
- **Position**: Usually after conjugated verb
- **Meaning**: Often different from non-reflexive version
- **Essential verbs**: Many common verbs are reflexive

**Common patterns:**
- **Personal care**: sich waschen (to wash oneself)
- **Emotions**: sich freuen (to be happy)
- **Mental states**: sich erinnern (to remember)
- **Interests**: sich interessieren (to be interested)

**Why reflexive verbs matter:**
- **Daily activities**: Essential for routine actions
- **Natural German**: Required for fluent expression
- **Emotional expression**: Express feelings and states
- **Advanced grammar**: Mark intermediate proficiency

Understanding reflexive verbs is **crucial** for **natural German communication**.`,
    examples: [
      {
        spanish: 'ACCUSATIVE: Ich wasche mich. (I wash myself.)',
        english: 'DATIVE: Ich wasche mir die Hände. (I wash my hands.)',
        highlight: ['wasche mich', 'wasche mir']
      },
      {
        spanish: 'EMOTION: Er freut sich über das Geschenk. (He is happy about the gift.)',
        english: 'MEMORY: Wir erinnern uns an den Urlaub. (We remember the vacation.)',
        highlight: ['freut sich', 'erinnern uns']
      }
    ]
  },
  {
    title: 'Reflexive Pronouns in German',
    content: `**Complete set** of German reflexive pronouns:`,
    conjugationTable: {
      title: 'Reflexive Pronouns',
      conjugations: [
        { pronoun: 'ich', form: 'mich (acc.) / mir (dat.)', english: 'myself' },
        { pronoun: 'du', form: 'dich (acc.) / dir (dat.)', english: 'yourself' },
        { pronoun: 'er/sie/es', form: 'sich (acc./dat.)', english: 'himself/herself/itself' },
        { pronoun: 'wir', form: 'uns (acc./dat.)', english: 'ourselves' },
        { pronoun: 'ihr', form: 'euch (acc./dat.)', english: 'yourselves' },
        { pronoun: 'sie/Sie', form: 'sich (acc./dat.)', english: 'themselves/yourself (formal)' }
      ]
    },
    examples: [
      {
        spanish: 'ACCUSATIVE: Ich wasche mich, du wäschst dich, er wäscht sich',
        english: 'DATIVE: Ich wasche mir, du wäschst dir, er wäscht sich',
        highlight: ['wasche mich', 'wasche mir']
      }
    ]
  },
  {
    title: 'Accusative Reflexive Verbs',
    content: `**Accusative reflexive verbs** use accusative reflexive pronouns:`,
    conjugationTable: {
      title: 'Common Accusative Reflexive Verbs',
      conjugations: [
        { pronoun: 'sich waschen', form: 'to wash oneself', english: 'Ich wasche mich jeden Tag. (I wash myself every day.)' },
        { pronoun: 'sich anziehen', form: 'to get dressed', english: 'Er zieht sich schnell an. (He gets dressed quickly.)' },
        { pronoun: 'sich freuen', form: 'to be happy', english: 'Wir freuen uns auf den Urlaub. (We look forward to the vacation.)' },
        { pronoun: 'sich setzen', form: 'to sit down', english: 'Sie setzt sich auf den Stuhl. (She sits down on the chair.)' },
        { pronoun: 'sich beeilen', form: 'to hurry', english: 'Ihr müsst euch beeilen! (You must hurry!)' },
        { pronoun: 'sich entspannen', form: 'to relax', english: 'Ich entspanne mich am Wochenende. (I relax on the weekend.)' }
      ]
    },
    examples: [
      {
        spanish: 'DAILY ROUTINE: Ich wasche mich, ziehe mich an und gehe zur Arbeit.',
        english: 'EMOTION: Sie freut sich sehr über die guten Nachrichten.',
        highlight: ['wasche mich', 'freut sich']
      }
    ]
  },
  {
    title: 'Dative Reflexive Verbs',
    content: `**Dative reflexive verbs** use dative reflexive pronouns:`,
    conjugationTable: {
      title: 'Common Dative Reflexive Verbs',
      conjugations: [
        { pronoun: 'sich vorstellen', form: 'to imagine', english: 'Ich kann mir das vorstellen. (I can imagine that.)' },
        { pronoun: 'sich ansehen', form: 'to look at', english: 'Wir sehen uns den Film an. (We watch the movie.)' },
        { pronoun: 'sich anhören', form: 'to listen to', english: 'Er hört sich die Musik an. (He listens to the music.)' },
        { pronoun: 'sich merken', form: 'to remember/note', english: 'Ich merke mir die Telefonnummer. (I remember the phone number.)' },
        { pronoun: 'sich wünschen', form: 'to wish for', english: 'Sie wünscht sich ein neues Auto. (She wishes for a new car.)' }
      ]
    },
    examples: [
      {
        spanish: 'IMAGINATION: Ich kann mir nicht vorstellen, dass das stimmt.',
        english: 'MEMORY: Merkst du dir alle Namen? (Do you remember all the names?)',
        highlight: ['kann mir vorstellen', 'merkst du dir']
      }
    ]
  },
  {
    title: 'Body Parts with Reflexive Verbs',
    content: `With **body parts**, German often uses **dative reflexive + accusative object**:`,
    examples: [
      {
        spanish: 'TEETH: Ich putze mir die Zähne. (I brush my teeth.)',
        english: 'HANDS: Er wäscht sich die Hände. (He washes his hands.)',
        highlight: ['putze mir die Zähne', 'wäscht sich die Hände']
      },
      {
        spanish: 'HAIR: Sie kämmt sich die Haare. (She combs her hair.)',
        english: 'FACE: Wir waschen uns das Gesicht. (We wash our faces.)',
        highlight: ['kämmt sich die Haare', 'waschen uns das Gesicht']
      }
    ],
    subsections: [
      {
        title: 'Pattern',
        content: 'Subject + verb + dative reflexive pronoun + accusative body part:',
        examples: [
          {
            spanish: 'STRUCTURE: Ich wasche mir (dative) die Hände (accusative).',
            english: 'NOT: Ich wasche meine Hände. (less common)',
            highlight: ['wasche mir die Hände']
          }
        ]
      }
    ]
  },
  {
    title: 'Reflexive Verbs with Prepositions',
    content: `Many **reflexive verbs** require **specific prepositions**:`,
    conjugationTable: {
      title: 'Reflexive Verbs + Prepositions',
      conjugations: [
        { pronoun: 'sich freuen auf', form: 'to look forward to', english: 'Ich freue mich auf die Ferien. (I look forward to the holidays.)' },
        { pronoun: 'sich freuen über', form: 'to be happy about', english: 'Er freut sich über das Geschenk. (He is happy about the gift.)' },
        { pronoun: 'sich interessieren für', form: 'to be interested in', english: 'Sie interessiert sich für Kunst. (She is interested in art.)' },
        { pronoun: 'sich erinnern an', form: 'to remember', english: 'Wir erinnern uns an den Urlaub. (We remember the vacation.)' },
        { pronoun: 'sich ärgern über', form: 'to be annoyed about', english: 'Ich ärgere mich über den Lärm. (I am annoyed about the noise.)' },
        { pronoun: 'sich gewöhnen an', form: 'to get used to', english: 'Du gewöhnst dich an das Wetter. (You get used to the weather.)' }
      ]
    },
    examples: [
      {
        spanish: 'ANTICIPATION: Wir freuen uns auf das Wochenende. (We look forward to the weekend.)',
        english: 'INTEREST: Er interessiert sich sehr für Geschichte. (He is very interested in history.)',
        highlight: ['freuen uns auf', 'interessiert sich für']
      }
    ]
  },
  {
    title: 'Position of Reflexive Pronouns',
    content: `**Reflexive pronouns** usually come **after the conjugated verb**:`,
    examples: [
      {
        spanish: 'MAIN CLAUSE: Ich wasche mich jeden Morgen. (I wash myself every morning.)',
        english: 'QUESTION: Wäschst du dich jeden Tag? (Do you wash yourself every day?)',
        highlight: ['wasche mich', 'wäschst du dich']
      },
      {
        spanish: 'MODAL VERB: Ich muss mich beeilen. (I must hurry.)',
        english: 'PERFECT: Ich habe mich gewaschen. (I have washed myself.)',
        highlight: ['muss mich beeilen', 'habe mich gewaschen']
      }
    ],
    subsections: [
      {
        title: 'Word Order',
        content: 'In subordinate clauses, reflexive pronoun comes before the verb:',
        examples: [
          {
            spanish: 'SUBORDINATE: Ich weiß, dass er sich freut. (I know that he is happy.)',
            english: 'MAIN: Er freut sich. (He is happy.)',
            highlight: ['dass er sich freut', 'Er freut sich']
          }
        ]
      }
    ]
  },
  {
    title: 'Reflexive vs Non-Reflexive Meanings',
    content: `**Same verbs** can have different meanings when reflexive vs non-reflexive:`,
    conjugationTable: {
      title: 'Meaning Differences',
      conjugations: [
        { pronoun: 'waschen', form: 'to wash (something)', english: 'Ich wasche das Auto. (I wash the car.)' },
        { pronoun: 'sich waschen', form: 'to wash oneself', english: 'Ich wasche mich. (I wash myself.)' },
        { pronoun: 'anziehen', form: 'to put on (someone)', english: 'Ich ziehe das Kind an. (I dress the child.)' },
        { pronoun: 'sich anziehen', form: 'to get dressed', english: 'Ich ziehe mich an. (I get dressed.)' },
        { pronoun: 'freuen', form: 'to make happy', english: 'Das freut mich. (That makes me happy.)' },
        { pronoun: 'sich freuen', form: 'to be happy', english: 'Ich freue mich. (I am happy.)' }
      ]
    },
    examples: [
      {
        spanish: 'NON-REFLEXIVE: Die Mutter zieht das Baby an. (The mother dresses the baby.)',
        english: 'REFLEXIVE: Das Baby kann sich noch nicht anziehen. (The baby can\'t dress itself yet.)',
        highlight: ['zieht das Baby an', 'sich anziehen']
      }
    ]
  },
  {
    title: 'Reciprocal Meaning',
    content: `**Plural reflexive pronouns** can express **reciprocal actions** (each other):`,
    examples: [
      {
        spanish: 'MEET: Wir treffen uns im Café. (We meet each other at the café.)',
        english: 'LOVE: Sie lieben sich sehr. (They love each other very much.)',
        highlight: ['treffen uns', 'lieben sich']
      },
      {
        spanish: 'HELP: Ihr helft euch gegenseitig. (You help each other.)',
        english: 'SEE: Wir sehen uns morgen. (We see each other tomorrow.)',
        highlight: ['helft euch', 'sehen uns']
      }
    ],
    subsections: [
      {
        title: 'Clarification',
        content: 'Add "gegenseitig" (mutually) to clarify reciprocal meaning:',
        examples: [
          {
            spanish: 'CLEAR: Sie helfen sich gegenseitig. (They help each other.)',
            english: 'AMBIGUOUS: Sie helfen sich. (They help themselves/each other.)',
            highlight: ['sich gegenseitig']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong pronoun**: Using wrong reflexive pronoun for person
**2. Missing reflexive**: Forgetting reflexive pronoun with reflexive verbs
**3. Case confusion**: Using accusative instead of dative or vice versa
**4. Position errors**: Wrong placement of reflexive pronoun`,
    examples: [
      {
        spanish: '❌ Ich wasche dich → ✅ Ich wasche mich',
        english: 'Wrong: must use reflexive pronoun matching subject',
        highlight: ['Ich wasche mich']
      },
      {
        spanish: '❌ Ich freue → ✅ Ich freue mich',
        english: 'Wrong: sich freuen requires reflexive pronoun',
        highlight: ['Ich freue mich']
      },
      {
        spanish: '❌ Ich wasche mich die Hände → ✅ Ich wasche mir die Hände',
        english: 'Wrong: with body parts, use dative reflexive',
        highlight: ['wasche mir die Hände']
      },
      {
        spanish: '❌ Ich mich wasche → ✅ Ich wasche mich',
        english: 'Wrong: reflexive pronoun comes after conjugated verb',
        highlight: ['Ich wasche mich']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Present Tense', url: '/grammar/german/verbs/present-tense', difficulty: 'beginner' },
  { title: 'German Accusative Case', url: '/grammar/german/cases/accusative', difficulty: 'beginner' },
  { title: 'German Dative Case', url: '/grammar/german/cases/dative', difficulty: 'beginner' },
  { title: 'German Modal Verbs', url: '/grammar/german/verbs/modal-verbs', difficulty: 'intermediate' }
];

export default function GermanReflexiveVerbsPage() {
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
              topic: 'reflexive-verbs',
              title: 'German Reflexive Verbs - Sich Waschen, Sich Freuen, Sich Erinnern',
              description: 'Master German reflexive verbs including accusative and dative reflexive pronouns with common verbs.',
              difficulty: 'intermediate',
              examples: [
                'Ich wasche mich. (I wash myself.)',
                'Er freut sich. (He is happy.)',
                'Wir erinnern uns. (We remember.)',
                'Sie interessiert sich für Musik. (She is interested in music.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'verbs',
              topic: 'reflexive-verbs',
              title: 'German Reflexive Verbs - Sich Waschen, Sich Freuen, Sich Erinnern'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="verbs"
        topic="reflexive-verbs"
        title="German Reflexive Verbs - Sich Waschen, Sich Freuen, Sich Erinnern"
        description="Master German reflexive verbs including accusative and dative reflexive pronouns with common verbs"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/german/verbs"
        practiceUrl="/grammar/german/verbs/reflexive-verbs/practice"
        quizUrl="/grammar/german/verbs/reflexive-verbs/quiz"
        songUrl="/songs/de?theme=grammar&topic=reflexive-verbs"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'verbs',
  topic: 'modal-verbs',
  title: 'German Modal Verbs',
  description: 'Master German modal verbs: können, müssen, wollen, sollen, dürfen, mögen. Complete guide with conjugations and usage.',
  difficulty: 'intermediate',
  keywords: [
    'german modal verbs',
    'können müssen wollen',
    'modalverben deutsch',
    'german grammar modals',
    'sollen dürfen mögen',
    'german auxiliary verbs',
    'modal verb conjugation'
  ],
  examples: [
    'Ich kann Deutsch sprechen (I can speak German)',
    'Du musst arbeiten (You must work)',
    'Er will nach Hause gehen (He wants to go home)'
  ]
});

const sections = [
  {
    title: 'German Modal Verbs Overview',
    content: `German modal verbs (**Modalverben**) express ability, necessity, permission, obligation, or desire. They are among the most frequently used verbs in German and are essential for expressing nuanced meanings.

The six main German modal verbs are: **können** (can/to be able to), **müssen** (must/to have to), **wollen** (to want to), **sollen** (should/to be supposed to), **dürfen** (may/to be allowed to), and **mögen** (to like/may).

Modal verbs are **irregular** and follow unique conjugation patterns. They are typically used with another verb in the infinitive form.`,
    examples: [
      {
        spanish: 'Ich kann schwimmen.',
        english: 'I can swim. (ability)',
        highlight: ['kann']
      },
      {
        spanish: 'Du musst lernen.',
        english: 'You must study. (necessity)',
        highlight: ['musst']
      },
      {
        spanish: 'Wir wollen ins Kino gehen.',
        english: 'We want to go to the cinema. (desire)',
        highlight: ['wollen']
      }
    ]
  },
  {
    title: 'Können - Can/To Be Able To',
    content: `**Können** expresses ability, possibility, or permission. It's one of the most versatile modal verbs in German.

**Uses:**
- Physical or mental ability: "Ich kann Klavier spielen" (I can play piano)
- Permission: "Du kannst gehen" (You can go)
- Possibility: "Das kann sein" (That could be)`,
    subsections: [
      {
        title: 'Können Conjugation',
        content: `**Können** is highly irregular in the present tense:`,
        conjugationTable: {
          title: 'Können (can/to be able to) - Present Tense',
          conjugations: [
            { pronoun: 'ich', form: 'kann', english: 'I can' },
            { pronoun: 'du', form: 'kannst', english: 'you can' },
            { pronoun: 'er/sie/es', form: 'kann', english: 'he/she/it can' },
            { pronoun: 'wir', form: 'können', english: 'we can' },
            { pronoun: 'ihr', form: 'könnt', english: 'you can' },
            { pronoun: 'sie/Sie', form: 'können', english: 'they/you can' }
          ]
        },
        examples: [
          {
            spanish: 'Ich kann Deutsch sprechen.',
            english: 'I can speak German.',
            highlight: ['kann']
          },
          {
            spanish: 'Kannst du mir helfen?',
            english: 'Can you help me?',
            highlight: ['Kannst']
          },
          {
            spanish: 'Wir können morgen kommen.',
            english: 'We can come tomorrow.',
            highlight: ['können']
          }
        ]
      }
    ]
  },
  {
    title: 'Müssen - Must/To Have To',
    content: `**Müssen** expresses necessity, obligation, or strong recommendation. It indicates that something is required or unavoidable.

**Uses:**
- Necessity: "Ich muss arbeiten" (I have to work)
- Obligation: "Du musst pünktlich sein" (You must be punctual)
- Strong assumption: "Er muss krank sein" (He must be sick)`,
    subsections: [
      {
        title: 'Müssen Conjugation',
        content: `**Müssen** follows a pattern similar to können:`,
        conjugationTable: {
          title: 'Müssen (must/to have to) - Present Tense',
          conjugations: [
            { pronoun: 'ich', form: 'muss', english: 'I must' },
            { pronoun: 'du', form: 'musst', english: 'you must' },
            { pronoun: 'er/sie/es', form: 'muss', english: 'he/she/it must' },
            { pronoun: 'wir', form: 'müssen', english: 'we must' },
            { pronoun: 'ihr', form: 'müsst', english: 'you must' },
            { pronoun: 'sie/Sie', form: 'müssen', english: 'they/you must' }
          ]
        },
        examples: [
          {
            spanish: 'Ich muss früh aufstehen.',
            english: 'I have to get up early.',
            highlight: ['muss']
          },
          {
            spanish: 'Du musst deine Hausaufgaben machen.',
            english: 'You must do your homework.',
            highlight: ['musst']
          },
          {
            spanish: 'Sie müssen einen Pass haben.',
            english: 'They must have a passport.',
            highlight: ['müssen']
          }
        ]
      }
    ]
  },
  {
    title: 'Wollen - To Want To',
    content: `**Wollen** expresses desire, intention, or will. It's used to indicate what someone wants to do or intends to do.

**Uses:**
- Desire: "Ich will Schokolade essen" (I want to eat chocolate)
- Intention: "Wir wollen nach Deutschland fahren" (We want to go to Germany)
- Claims: "Er will Arzt werden" (He wants to become a doctor)`,
    subsections: [
      {
        title: 'Wollen Conjugation',
        content: `**Wollen** has unique forms in the singular:`,
        conjugationTable: {
          title: 'Wollen (to want to) - Present Tense',
          conjugations: [
            { pronoun: 'ich', form: 'will', english: 'I want' },
            { pronoun: 'du', form: 'willst', english: 'you want' },
            { pronoun: 'er/sie/es', form: 'will', english: 'he/she/it wants' },
            { pronoun: 'wir', form: 'wollen', english: 'we want' },
            { pronoun: 'ihr', form: 'wollt', english: 'you want' },
            { pronoun: 'sie/Sie', form: 'wollen', english: 'they/you want' }
          ]
        },
        examples: [
          {
            spanish: 'Ich will nach Hause gehen.',
            english: 'I want to go home.',
            highlight: ['will']
          },
          {
            spanish: 'Willst du mit uns kommen?',
            english: 'Do you want to come with us?',
            highlight: ['Willst']
          },
          {
            spanish: 'Die Kinder wollen spielen.',
            english: 'The children want to play.',
            highlight: ['wollen']
          }
        ]
      }
    ]
  },
  {
    title: 'Sollen - Should/To Be Supposed To',
    content: `**Sollen** expresses obligation, recommendation, or what someone is supposed to do. It often conveys external expectations or advice.

**Uses:**
- Obligation: "Du sollst nicht lügen" (You shall not lie)
- Recommendation: "Sie sollen mehr schlafen" (You should sleep more)
- Reported speech: "Er soll sehr reich sein" (He is said to be very rich)`,
    subsections: [
      {
        title: 'Sollen Conjugation',
        content: `**Sollen** is more regular than other modal verbs:`,
        conjugationTable: {
          title: 'Sollen (should/to be supposed to) - Present Tense',
          conjugations: [
            { pronoun: 'ich', form: 'soll', english: 'I should' },
            { pronoun: 'du', form: 'sollst', english: 'you should' },
            { pronoun: 'er/sie/es', form: 'soll', english: 'he/she/it should' },
            { pronoun: 'wir', form: 'sollen', english: 'we should' },
            { pronoun: 'ihr', form: 'sollt', english: 'you should' },
            { pronoun: 'sie/Sie', form: 'sollen', english: 'they/you should' }
          ]
        },
        examples: [
          {
            spanish: 'Ich soll um 8 Uhr da sein.',
            english: 'I\'m supposed to be there at 8 o\'clock.',
            highlight: ['soll']
          },
          {
            spanish: 'Du sollst mehr Gemüse essen.',
            english: 'You should eat more vegetables.',
            highlight: ['sollst']
          },
          {
            spanish: 'Wir sollen pünktlich sein.',
            english: 'We should be punctual.',
            highlight: ['sollen']
          }
        ]
      }
    ]
  },
  {
    title: 'Dürfen - May/To Be Allowed To',
    content: `**Dürfen** expresses permission or prohibition. It indicates what is allowed or not allowed.

**Uses:**
- Permission: "Du darfst gehen" (You may go)
- Polite requests: "Darf ich fragen?" (May I ask?)
- Prohibition (with nicht): "Du darfst nicht rauchen" (You may not smoke)`,
    subsections: [
      {
        title: 'Dürfen Conjugation',
        content: `**Dürfen** has an umlaut change in the infinitive vs. conjugated forms:`,
        conjugationTable: {
          title: 'Dürfen (may/to be allowed to) - Present Tense',
          conjugations: [
            { pronoun: 'ich', form: 'darf', english: 'I may' },
            { pronoun: 'du', form: 'darfst', english: 'you may' },
            { pronoun: 'er/sie/es', form: 'darf', english: 'he/she/it may' },
            { pronoun: 'wir', form: 'dürfen', english: 'we may' },
            { pronoun: 'ihr', form: 'dürft', english: 'you may' },
            { pronoun: 'sie/Sie', form: 'dürfen', english: 'they/you may' }
          ]
        },
        examples: [
          {
            spanish: 'Darf ich reinkommen?',
            english: 'May I come in?',
            highlight: ['Darf']
          },
          {
            spanish: 'Du darfst nicht zu spät kommen.',
            english: 'You may not come too late.',
            highlight: ['darfst']
          },
          {
            spanish: 'Kinder dürfen hier nicht spielen.',
            english: 'Children are not allowed to play here.',
            highlight: ['dürfen']
          }
        ]
      }
    ]
  },
  {
    title: 'Mögen - To Like/May',
    content: `**Mögen** has two main uses: expressing likes/preferences and expressing possibility (similar to "may" in English).

**Uses:**
- Likes: "Ich mag Schokolade" (I like chocolate)
- Polite wishes: "Möchten Sie Kaffee?" (Would you like coffee?)
- Possibility: "Das mag sein" (That may be)

**Note**: The conditional form **möchten** (would like) is more commonly used than **mögen** for polite requests.`,
    subsections: [
      {
        title: 'Mögen Conjugation',
        content: `**Mögen** follows the typical modal verb pattern:`,
        conjugationTable: {
          title: 'Mögen (to like/may) - Present Tense',
          conjugations: [
            { pronoun: 'ich', form: 'mag', english: 'I like' },
            { pronoun: 'du', form: 'magst', english: 'you like' },
            { pronoun: 'er/sie/es', form: 'mag', english: 'he/she/it likes' },
            { pronoun: 'wir', form: 'mögen', english: 'we like' },
            { pronoun: 'ihr', form: 'mögt', english: 'you like' },
            { pronoun: 'sie/Sie', form: 'mögen', english: 'they/you like' }
          ]
        },
        examples: [
          {
            spanish: 'Ich mag deutsche Musik.',
            english: 'I like German music.',
            highlight: ['mag']
          },
          {
            spanish: 'Magst du Pizza?',
            english: 'Do you like pizza?',
            highlight: ['Magst']
          },
          {
            spanish: 'Sie mögen keine Katzen.',
            english: 'They don\'t like cats.',
            highlight: ['mögen']
          }
        ]
      }
    ]
  },
  {
    title: 'Modal Verb Sentence Structure',
    content: `Modal verbs in German follow a specific sentence structure:

**Formula**: Subject + Modal Verb + ... + Infinitive Verb (at the end)

The infinitive verb goes to the **end of the sentence** in main clauses. This is a key feature of German word order.

**Negation**: "nicht" usually comes before the infinitive verb.
**Questions**: The modal verb moves to the first position.`,
    examples: [
      {
        spanish: 'Ich kann heute nicht kommen.',
        english: 'I can\'t come today. (negation before infinitive)',
        highlight: ['kann', 'kommen']
      },
      {
        spanish: 'Kannst du morgen arbeiten?',
        english: 'Can you work tomorrow? (modal verb first in question)',
        highlight: ['Kannst', 'arbeiten']
      },
      {
        spanish: 'Wir müssen um 8 Uhr in der Schule sein.',
        english: 'We have to be at school at 8 o\'clock. (infinitive at end)',
        highlight: ['müssen', 'sein']
      },
      {
        spanish: 'Sie will mit ihren Freunden ins Kino gehen.',
        english: 'She wants to go to the cinema with her friends.',
        highlight: ['will', 'gehen']
      }
    ]
  },
  {
    title: 'Common Modal Verb Combinations',
    content: `Certain modal verbs are frequently used together or in specific contexts:

**Double modals**: Sometimes two modal verbs appear together
**Fixed expressions**: Some phrases always use specific modal verbs
**Polite forms**: Certain modals are preferred for politeness

Learning these combinations will make your German sound more natural.`,
    examples: [
      {
        spanish: 'Ich möchte gerne kommen.',
        english: 'I would like to come. (polite form with gerne)',
        highlight: ['möchte']
      },
      {
        spanish: 'Du solltest das nicht tun.',
        english: 'You shouldn\'t do that. (sollten = conditional of sollen)',
        highlight: ['solltest']
      },
      {
        spanish: 'Könnte ich bitte...?',
        english: 'Could I please...? (polite request with könnte)',
        highlight: ['Könnte']
      },
      {
        spanish: 'Das müsste funktionieren.',
        english: 'That should work. (müsste = conditional of müssen)',
        highlight: ['müsste']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'German Present Tense',
    url: '/grammar/german/verbs/present-tense',
    difficulty: 'beginner'
  },
  {
    title: 'German Future Tense',
    url: '/grammar/german/verbs/future-tense',
    difficulty: 'intermediate'
  },
  {
    title: 'German Word Order',
    url: '/grammar/german/syntax/word-order',
    difficulty: 'intermediate'
  },
  {
    title: 'German Subjunctive',
    url: '/grammar/german/verbs/subjunctive',
    difficulty: 'advanced'
  }
];

export default function GermanModalVerbsPage() {
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
              topic: 'modal-verbs',
              title: 'German Modal Verbs',
              description: 'Master German modal verbs: können, müssen, wollen, sollen, dürfen, mögen. Complete guide with conjugations and usage.',
              difficulty: 'intermediate',
              examples: [
                'Ich kann Deutsch sprechen (I can speak German)',
                'Du musst arbeiten (You must work)',
                'Er will nach Hause gehen (He wants to go home)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'verbs',
              topic: 'modal-verbs',
              title: 'German Modal Verbs'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="german"
        category="verbs"
        topic="modal-verbs"
        title="German Modal Verbs"
        description="Master German modal verbs: können, müssen, wollen, sollen, dürfen, mögen. Complete guide with conjugations and usage"
        difficulty="intermediate"
        estimatedTime={40}
        sections={sections}
        backUrl="/grammar/german/verbs"
        practiceUrl="/grammar/german/verbs/modal-verbs/practice"
        quizUrl="/grammar/german/verbs/modal-verbs/quiz"
        songUrl="/songs/de?theme=grammar&topic=modal-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

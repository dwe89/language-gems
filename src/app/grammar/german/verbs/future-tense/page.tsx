import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'german',
  category: 'verbs',
  topic: 'future-tense',
  title: 'German Future Tense (Futur I & II) - Formation and Usage',
  description: 'Master German future tense including Futur I, Futur II formation, usage rules, and alternatives with present tense.',
  difficulty: 'intermediate',
  keywords: [
    'german future tense',
    'futur german',
    'werden german',
    'german future formation',
    'futur I futur II',
    'german verb tenses'
  ],
  examples: [
    'Ich werde morgen kommen. (I will come tomorrow.)',
    'Sie wird das Buch lesen. (She will read the book.)',
    'Wir werden nach Berlin fahren. (We will drive to Berlin.)',
    'Er wird es gemacht haben. (He will have done it.)'
  ]
});

const sections = [
  {
    title: 'Understanding German Future Tense',
    content: `German has **two future tenses**: **Futur I** (simple future) and **Futur II** (future perfect). However, German speakers **often use present tense** with time expressions to express future actions, making the future tense **less common** than in English.

**German future tenses:**
- **Futur I**: Simple future (will do)
- **Futur II**: Future perfect (will have done)
- **Present tense**: Often used for future (more common)

**Key characteristics:**
- **Auxiliary verb**: Uses "werden" (to become)
- **Less frequent**: Present tense often preferred for future
- **Formal register**: More common in written German
- **Certainty levels**: Can express different degrees of certainty
- **Modal meanings**: Can express assumptions or probability

**When to use future tense:**
- **Formal contexts**: Official announcements, written German
- **Distant future**: Events far in the future
- **Promises/threats**: Emphatic future statements
- **Assumptions**: Expressing probability or supposition
- **No time context**: When no time expression is present

**Present tense for future:**
- **With time expressions**: "Morgen gehe ich..." (Tomorrow I go...)
- **Immediate future**: Near-future events
- **Casual speech**: Everyday conversations
- **Scheduled events**: Fixed plans and timetables

Understanding German future tense is **important** for **formal German** and **complete grammatical competence**.`,
    examples: [
      {
        spanish: 'FUTUR I: Ich werde morgen arbeiten. (I will work tomorrow.)',
        english: 'PRESENT FOR FUTURE: Ich arbeite morgen. (I work tomorrow.)',
        highlight: ['werde morgen arbeiten', 'arbeite morgen']
      },
      {
        spanish: 'FUTUR II: Ich werde es gemacht haben. (I will have done it.)',
        english: 'ASSUMPTION: Das wird wohl stimmen. (That will probably be true.)',
        highlight: ['werde es gemacht haben', 'wird wohl stimmen']
      }
    ]
  },
  {
    title: 'Futur I Formation',
    content: `**Futur I** is formed with **werden + infinitive**:`,
    conjugationTable: {
      title: 'Werden Conjugation',
      conjugations: [
        { pronoun: 'ich', form: 'werde', english: 'ich werde gehen (I will go)' },
        { pronoun: 'du', form: 'wirst', english: 'du wirst gehen (you will go)' },
        { pronoun: 'er/sie/es', form: 'wird', english: 'er wird gehen (he will go)' },
        { pronoun: 'wir', form: 'werden', english: 'wir werden gehen (we will go)' },
        { pronoun: 'ihr', form: 'werdet', english: 'ihr werdet gehen (you will go)' },
        { pronoun: 'sie/Sie', form: 'werden', english: 'sie werden gehen (they/you will go)' }
      ]
    },
    examples: [
      {
        spanish: 'Ich werde das Buch lesen. (I will read the book.)',
        english: 'Sie wird morgen kommen. (She will come tomorrow.)',
        highlight: ['werde das Buch lesen', 'wird morgen kommen']
      },
      {
        spanish: 'Wir werden nach Deutschland fahren. (We will drive to Germany.)',
        english: 'Ihr werdet die Prüfung bestehen. (You will pass the exam.)',
        highlight: ['werden nach Deutschland fahren', 'werdet die Prüfung bestehen']
      }
    ],
    subsections: [
      {
        title: 'Word Order',
        content: 'Infinitive goes to the end of the sentence:',
        examples: [
          {
            spanish: 'Ich werde morgen [TIME] das Buch [OBJECT] lesen [INFINITIVE].',
            english: 'Standard German word order applies',
            highlight: ['lesen']
          }
        ]
      }
    ]
  },
  {
    title: 'Futur II Formation',
    content: `**Futur II** is formed with **werden + past participle + haben/sein**:`,
    conjugationTable: {
      title: 'Futur II Formation',
      conjugations: [
        { pronoun: 'With haben', form: 'werden + past participle + haben', english: 'ich werde gemacht haben (I will have done)' },
        { pronoun: 'With sein', form: 'werden + past participle + sein', english: 'ich werde gekommen sein (I will have come)' },
        { pronoun: 'Example haben', form: 'werde gelesen haben', english: 'will have read' },
        { pronoun: 'Example sein', form: 'werde gefahren sein', english: 'will have driven' }
      ]
    },
    examples: [
      {
        spanish: 'Ich werde das Buch gelesen haben. (I will have read the book.)',
        english: 'Sie wird nach Hause gekommen sein. (She will have come home.)',
        highlight: ['werde gelesen haben', 'wird gekommen sein']
      },
      {
        spanish: 'Bis morgen werden wir die Arbeit beendet haben. (By tomorrow we will have finished the work.)',
        english: 'Um 8 Uhr wird er angekommen sein. (By 8 o\'clock he will have arrived.)',
        highlight: ['werden beendet haben', 'wird angekommen sein']
      }
    ]
  },
  {
    title: 'Present Tense for Future',
    content: `**German commonly uses present tense** with time expressions to express future:`,
    conjugationTable: {
      title: 'Present vs Future for Future Events',
      conjugations: [
        { pronoun: 'Present (common)', form: 'Morgen gehe ich ins Kino.', english: 'Tomorrow I go to the cinema.' },
        { pronoun: 'Future (formal)', form: 'Morgen werde ich ins Kino gehen.', english: 'Tomorrow I will go to the cinema.' },
        { pronoun: 'Present (natural)', form: 'Nächste Woche fahre ich weg.', english: 'Next week I travel away.' },
        { pronoun: 'Future (emphatic)', form: 'Nächste Woche werde ich wegfahren.', english: 'Next week I will travel away.' }
      ]
    },
    examples: [
      {
        spanish: 'COMMON: Morgen arbeite ich nicht. (Tomorrow I don\'t work.)',
        english: 'FORMAL: Morgen werde ich nicht arbeiten. (Tomorrow I will not work.)',
        highlight: ['arbeite ich nicht', 'werde ich nicht arbeiten']
      }
    ]
  },
  {
    title: 'Modal Meanings of Future Tense',
    content: `German future tense can express **assumptions** and **probability**:`,
    conjugationTable: {
      title: 'Modal Uses of Future Tense',
      conjugations: [
        { pronoun: 'Assumption', form: 'Das wird stimmen.', english: 'That will be true. (I assume)' },
        { pronoun: 'Probability', form: 'Er wird wohl krank sein.', english: 'He will probably be sick.' },
        { pronoun: 'Supposition', form: 'Sie wird etwa 30 sein.', english: 'She will be about 30.' },
        { pronoun: 'Uncertainty', form: 'Das wird schwer werden.', english: 'That will be difficult.' }
      ]
    },
    examples: [
      {
        spanish: 'Das wird wohl richtig sein. (That will probably be correct.)',
        english: 'Er wird etwa 1000 Euro verdienen. (He will earn about 1000 euros.)',
        highlight: ['wird wohl richtig sein', 'wird etwa 1000 Euro verdienen']
      }
    ]
  },
  {
    title: 'Future Tense with Modal Verbs',
    content: `**Modal verbs** in future tense use **double infinitive**:`,
    conjugationTable: {
      title: 'Future with Modal Verbs',
      conjugations: [
        { pronoun: 'können', form: 'werde können', english: 'ich werde kommen können (I will be able to come)' },
        { pronoun: 'müssen', form: 'werde müssen', english: 'ich werde arbeiten müssen (I will have to work)' },
        { pronoun: 'wollen', form: 'werde wollen', english: 'ich werde gehen wollen (I will want to go)' },
        { pronoun: 'sollen', form: 'werde sollen', english: 'ich werde helfen sollen (I will be supposed to help)' }
      ]
    },
    examples: [
      {
        spanish: 'Ich werde morgen arbeiten müssen. (I will have to work tomorrow.)',
        english: 'Sie wird das Buch lesen können. (She will be able to read the book.)',
        highlight: ['werde arbeiten müssen', 'wird lesen können']
      }
    ]
  },
  {
    title: 'Time Expressions with Future',
    content: `**Common time expressions** used with future tense:`,
    conjugationTable: {
      title: 'Future Time Expressions',
      conjugations: [
        { pronoun: 'morgen', form: 'tomorrow', english: 'Morgen werde ich lernen. (Tomorrow I will study.)' },
        { pronoun: 'nächste Woche', form: 'next week', english: 'Nächste Woche werden wir verreisen. (Next week we will travel.)' },
        { pronoun: 'in Zukunft', form: 'in the future', english: 'In Zukunft wird alles anders sein. (In the future everything will be different.)' },
        { pronoun: 'bald', form: 'soon', english: 'Bald werde ich fertig sein. (Soon I will be finished.)' },
        { pronoun: 'später', form: 'later', english: 'Später werden wir essen. (Later we will eat.)' }
      ]
    },
    examples: [
      {
        spanish: 'Nächstes Jahr werde ich nach Japan reisen. (Next year I will travel to Japan.)',
        english: 'In einer Stunde wird der Film beginnen. (In an hour the movie will begin.)',
        highlight: ['Nächstes Jahr werde ich', 'wird der Film beginnen']
      }
    ]
  },
  {
    title: 'Negation in Future Tense',
    content: `**Negation** in future tense follows standard German patterns:`,
    examples: [
      {
        spanish: 'Ich werde nicht kommen. (I will not come.)',
        english: 'Sie wird das Buch nicht lesen. (She will not read the book.)',
        highlight: ['werde nicht kommen', 'wird nicht lesen']
      },
      {
        spanish: 'Wir werden nie aufgeben. (We will never give up.)',
        english: 'Er wird niemanden einladen. (He will invite nobody.)',
        highlight: ['werden nie aufgeben', 'wird niemanden einladen']
      }
    ],
    subsections: [
      {
        title: 'Position of nicht',
        content: 'nicht usually comes before the infinitive:',
        examples: [
          {
            spanish: 'Ich werde das [OBJECT] nicht [NEGATION] machen [INFINITIVE].',
            english: 'Standard negation word order',
            highlight: ['nicht machen']
          }
        ]
      }
    ]
  },
  {
    title: 'Questions in Future Tense',
    content: `**Questions** in future tense use standard German question formation:`,
    conjugationTable: {
      title: 'Future Tense Questions',
      conjugations: [
        { pronoun: 'Yes/No questions', form: 'Wirst du kommen?', english: 'Will you come?' },
        { pronoun: 'W-questions', form: 'Wann wirst du kommen?', english: 'When will you come?' },
        { pronoun: 'Was questions', form: 'Was wirst du machen?', english: 'What will you do?' },
        { pronoun: 'Wo questions', form: 'Wo werdet ihr wohnen?', english: 'Where will you live?' }
      ]
    },
    examples: [
      {
        spanish: 'Wirst du morgen arbeiten? (Will you work tomorrow?)',
        english: 'Was werden Sie studieren? (What will you study?)',
        highlight: ['Wirst du morgen arbeiten', 'Was werden Sie studieren']
      }
    ]
  },
  {
    title: 'Regional and Stylistic Variations',
    content: `**Usage varies** by region and context:`,
    conjugationTable: {
      title: 'Usage Variations',
      conjugations: [
        { pronoun: 'Northern Germany', form: 'More future tense', english: 'Slightly more formal usage' },
        { pronoun: 'Southern Germany', form: 'More present tense', english: 'Prefer present for future' },
        { pronoun: 'Written German', form: 'More future tense', english: 'Formal contexts use future' },
        { pronoun: 'Spoken German', form: 'More present tense', english: 'Casual speech uses present' }
      ]
    },
    examples: [
      {
        spanish: 'WRITTEN: Wir werden uns morgen treffen. (We will meet tomorrow.)',
        english: 'SPOKEN: Wir treffen uns morgen. (We meet tomorrow.)',
        highlight: ['werden uns treffen', 'treffen uns']
      }
    ]
  },
  {
    title: 'Common Mistakes with Future Tense',
    content: `Here are frequent errors students make:

**1. Overusing future tense**: Using future when present is more natural
**2. Wrong auxiliary**: Using haben/sein instead of werden
**3. Word order errors**: Wrong position of infinitive
**4. Modal verb confusion**: Wrong formation with modal verbs`,
    examples: [
      {
        spanish: '❌ Overuse: Morgen werde ich aufstehen → ✅ Morgen stehe ich auf',
        english: 'Better: Use present tense with time expressions',
        highlight: ['stehe ich auf']
      },
      {
        spanish: '❌ Wrong auxiliary: Ich habe gehen → ✅ Ich werde gehen',
        english: 'Wrong: Use werden for future, not haben',
        highlight: ['werde gehen']
      },
      {
        spanish: '❌ Word order: Ich werde gehen morgen → ✅ Ich werde morgen gehen',
        english: 'Wrong: Time expression comes before infinitive',
        highlight: ['werde morgen gehen']
      },
      {
        spanish: '❌ Modal: Ich werde können gehen → ✅ Ich werde gehen können',
        english: 'Wrong: Modal verb comes after main infinitive',
        highlight: ['werde gehen können']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'German Present Tense', url: '/grammar/german/verbs/present-tense', difficulty: 'beginner' },
  { title: 'German Past Tense', url: '/grammar/german/verbs/past-tense', difficulty: 'intermediate' },
  { title: 'German Perfect Tense', url: '/grammar/german/verbs/perfect-tense', difficulty: 'intermediate' },
  { title: 'German Modal Verbs', url: '/grammar/german/verbs/modal-verbs', difficulty: 'intermediate' }
];

export default function GermanFutureTensePage() {
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
              topic: 'future-tense',
              title: 'German Future Tense (Futur I & II) - Formation and Usage',
              description: 'Master German future tense including Futur I, Futur II formation, usage rules, and alternatives with present tense.',
              difficulty: 'intermediate',
              examples: [
                'Ich werde morgen kommen. (I will come tomorrow.)',
                'Sie wird das Buch lesen. (She will read the book.)',
                'Wir werden nach Berlin fahren. (We will drive to Berlin.)',
                'Er wird es gemacht haben. (He will have done it.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'german',
              category: 'verbs',
              topic: 'future-tense',
              title: 'German Future Tense (Futur I & II) - Formation and Usage'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="german"
        category="verbs"
        topic="future-tense"
        title="German Future Tense (Futur I & II) - Formation and Usage"
        description="Master German future tense including Futur I, Futur II formation, usage rules, and alternatives with present tense"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/german/verbs"
        practiceUrl="/grammar/german/verbs/future-tense/practice"
        quizUrl="/grammar/german/verbs/future-tense/quiz"
        songUrl="/songs/de?theme=grammar&topic=future-tense"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

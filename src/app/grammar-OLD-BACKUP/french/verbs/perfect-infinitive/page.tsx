import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'perfect-infinitive',
  title: 'French Perfect Infinitive (Infinitif Passé - Avoir/Être + Past Participle)',
  description: 'Master the French perfect infinitive using avoir/être + past participle. Learn to express completed actions in infinitive form.',
  difficulty: 'advanced',
  keywords: [
    'french perfect infinitive',
    'infinitif passé french',
    'avoir être past participle',
    'french compound infinitive',
    'past infinitive french',
    'advanced french grammar'
  ],
  examples: [
    'Après avoir mangé... (After having eaten...)',
    'Après être parti... (After having left...)',
    'Je regrette d\'avoir dit ça. (I regret having said that.)',
    'Il est content d\'être venu. (He\'s happy to have come.)'
  ]
});

const sections = [
  {
    title: 'Understanding the French Perfect Infinitive',
    content: `The **perfect infinitive** (infinitif passé) expresses a **completed action** in infinitive form. It's formed using the infinitive of the auxiliary verb (**avoir** or **être**) + **past participle**.

**Formation:**
- **AVOIR + Past Participle**: avoir mangé (to have eaten)
- **ÊTRE + Past Participle**: être parti(e)(s) (to have left)

The perfect infinitive is used to show that one action was **completed before** another action. It's commonly found:
- **After prepositions**: Après avoir mangé... (After having eaten...)
- **With certain verbs**: Je regrette d'avoir dit ça. (I regret having said that.)
- **In formal writing**: Pour avoir réussi... (For having succeeded...)

This advanced structure adds sophistication to French expression.`,
    examples: [
      {
        spanish: 'Après avoir fini ses devoirs, il est sorti. (After finishing his homework, he went out.)',
        english: 'Shows sequence: homework finished BEFORE going out',
        highlight: ['Après avoir fini']
      },
      {
        spanish: 'Elle regrette d\'être partie tôt. (She regrets having left early.)',
        english: 'Expresses regret about a completed past action',
        highlight: ['d\'être partie']
      },
      {
        spanish: 'Merci d\'avoir aidé. (Thank you for having helped.)',
        english: 'Gratitude for a completed action',
        highlight: ['d\'avoir aidé']
      }
    ]
  },
  {
    title: 'Formation with AVOIR',
    content: `Most verbs form the perfect infinitive with **AVOIR + past participle**:`,
    conjugationTable: {
      title: 'Perfect Infinitive with AVOIR',
      conjugations: [
        { pronoun: 'avoir mangé', form: 'to have eaten', english: 'Après avoir mangé...' },
        { pronoun: 'avoir fini', form: 'to have finished', english: 'Après avoir fini...' },
        { pronoun: 'avoir vendu', form: 'to have sold', english: 'Après avoir vendu...' },
        { pronoun: 'avoir dit', form: 'to have said', english: 'Je regrette d\'avoir dit...' },
        { pronoun: 'avoir fait', form: 'to have done', english: 'Après avoir fait...' },
        { pronoun: 'avoir vu', form: 'to have seen', english: 'Après avoir vu...' }
      ]
    },
    subsections: [
      {
        title: 'Past Participle Agreement with AVOIR',
        content: 'Agreement rules apply when there\'s a preceding direct object:',
        examples: [
          {
            spanish: 'La lettre qu\'il regrette d\'avoir écrite. (The letter he regrets having written.)',
            english: 'Agreement: écrite agrees with "la lettre"',
            highlight: ['d\'avoir écrite']
          },
          {
            spanish: 'Les livres après les avoir lus. (The books after having read them.)',
            english: 'Agreement: lus agrees with "les livres"',
            highlight: ['les avoir lus']
          }
        ]
      }
    ]
  },
  {
    title: 'Formation with ÊTRE',
    content: `Verbs that use **être** in compound tenses also use **être** in the perfect infinitive:`,
    conjugationTable: {
      title: 'Perfect Infinitive with ÊTRE',
      conjugations: [
        { pronoun: 'être parti(e)(s)', form: 'to have left', english: 'Après être parti...' },
        { pronoun: 'être arrivé(e)(s)', form: 'to have arrived', english: 'Après être arrivé...' },
        { pronoun: 'être venu(e)(s)', form: 'to have come', english: 'Je suis content d\'être venu.' },
        { pronoun: 'être né(e)(s)', form: 'to have been born', english: 'Après être né...' },
        { pronoun: 'être mort(e)(s)', form: 'to have died', english: 'Après être mort...' },
        { pronoun: 'être devenu(e)(s)', form: 'to have become', english: 'Après être devenu...' }
      ]
    },
    subsections: [
      {
        title: 'Past Participle Agreement with ÊTRE',
        content: 'Past participle agrees with the subject:',
        examples: [
          {
            spanish: 'Elle regrette d\'être partie. (She regrets having left.)',
            english: 'Feminine singular: partie',
            highlight: ['d\'être partie']
          },
          {
            spanish: 'Ils sont contents d\'être venus. (They\'re happy to have come.)',
            english: 'Masculine plural: venus',
            highlight: ['d\'être venus']
          },
          {
            spanish: 'Elles regrettent d\'être arrivées en retard. (They regret having arrived late.)',
            english: 'Feminine plural: arrivées',
            highlight: ['d\'être arrivées']
          }
        ]
      }
    ]
  },
  {
    title: 'Reflexive Verbs in Perfect Infinitive',
    content: `Reflexive verbs use **être** and maintain their reflexive pronouns:`,
    examples: [
      {
        spanish: 'Après s\'être levé, il a pris une douche. (After getting up, he took a shower.)',
        english: 'Je regrette de m\'être trompé. (I regret having made a mistake.)',
        highlight: ['s\'être levé', 'de m\'être trompé']
      },
      {
        spanish: 'Elle est fière de s\'être battue. (She\'s proud of having fought.)',
        english: 'Nous regrettons de nous être disputés. (We regret having argued.)',
        highlight: ['de s\'être battue', 'de nous être disputés']
      }
    ],
    subsections: [
      {
        title: 'Agreement with Reflexive Verbs',
        content: 'Past participle agrees with the reflexive pronoun (subject):',
        examples: [
          {
            spanish: 'Elle regrette de s\'être couchée tard. (She regrets having gone to bed late.)',
            english: 'Feminine: couchée agrees with elle',
            highlight: ['de s\'être couchée']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of the Perfect Infinitive',
    content: `The perfect infinitive is used in several contexts:`,
    subsections: [
      {
        title: 'After Prepositions',
        content: 'Especially "après" (after):',
        examples: [
          {
            spanish: 'Après avoir dîné, nous sommes sortis. (After having dinner, we went out.)',
            english: 'Après être rentrés, ils se sont couchés. (After coming home, they went to bed.)',
            highlight: ['Après avoir dîné', 'Après être rentrés']
          }
        ]
      },
      {
        title: 'Expressing Regret or Satisfaction',
        content: 'With verbs of emotion:',
        examples: [
          {
            spanish: 'Je regrette d\'avoir menti. (I regret having lied.)',
            english: 'Il est fier d\'avoir réussi. (He\'s proud of having succeeded.)',
            highlight: ['d\'avoir menti', 'd\'avoir réussi']
          }
        ]
      },
      {
        title: 'Expressing Gratitude',
        content: 'Thanking for completed actions:',
        examples: [
          {
            spanish: 'Merci d\'avoir appelé. (Thank you for having called.)',
            english: 'Je vous remercie d\'être venus. (I thank you for having come.)',
            highlight: ['d\'avoir appelé', 'd\'être venus']
          }
        ]
      }
    ]
  },
  {
    title: 'Perfect Infinitive vs Other Structures',
    content: `Comparing the perfect infinitive with similar structures:`,
    conjugationTable: {
      title: 'Comparison of Structures',
      conjugations: [
        { pronoun: 'Perfect Infinitive', form: 'après avoir mangé', english: 'after having eaten' },
        { pronoun: 'Present Infinitive', form: 'avant de manger', english: 'before eating' },
        { pronoun: 'Past Participle', form: 'ayant mangé', english: 'having eaten (literary)' },
        { pronoun: 'Compound Past', form: 'j\'ai mangé', english: 'I ate/have eaten' }
      ]
    },
    subsections: [
      {
        title: 'When to Use Perfect Infinitive',
        content: 'Specific contexts requiring perfect infinitive:',
        examples: [
          {
            spanish: '✅ Après avoir fini (after completing)',
            english: '❌ Après finir (incorrect - no completion shown)',
            highlight: ['Après avoir fini']
          }
        ]
      }
    ]
  },
  {
    title: 'Negation with Perfect Infinitive',
    content: `To negate the perfect infinitive, place **ne pas** before the auxiliary:`,
    examples: [
      {
        spanish: 'Je regrette de ne pas avoir étudié. (I regret not having studied.)',
        english: 'Il est triste de ne pas être venu. (He\'s sad about not having come.)',
        highlight: ['de ne pas avoir étudié', 'de ne pas être venu']
      },
      {
        spanish: 'Après ne pas avoir dormi... (After not having slept...)',
        english: 'Pour ne pas avoir compris... (For not having understood...)',
        highlight: ['ne pas avoir dormi', 'ne pas avoir compris']
      }
    ],
    subsections: [
      {
        title: 'Other Negative Forms',
        content: 'Using other negative expressions:',
        examples: [
          {
            spanish: 'Je regrette de ne jamais avoir voyagé. (I regret never having traveled.)',
            english: 'Il est déçu de ne rien avoir gagné. (He\'s disappointed about not having won anything.)',
            highlight: ['ne jamais avoir voyagé', 'ne rien avoir gagné']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Expressions with Perfect Infinitive',
    content: `Frequently used phrases and expressions:`,
    examples: [
      {
        spanish: 'Après y avoir réfléchi... (After having thought about it...)',
        english: 'Sans avoir rien dit... (Without having said anything...)',
        highlight: ['Après y avoir réfléchi', 'Sans avoir rien dit']
      },
      {
        spanish: 'Pour avoir osé... (For having dared...)',
        english: 'Avant d\'avoir fini... (Before having finished...)',
        highlight: ['Pour avoir osé', 'Avant d\'avoir fini']
      }
    ],
    subsections: [
      {
        title: 'Formal Expressions',
        content: 'Used in formal or literary contexts:',
        examples: [
          {
            spanish: 'Après avoir longuement hésité... (After having hesitated for a long time...)',
            english: 'Pour avoir bien travaillé... (For having worked well...)',
            highlight: ['Après avoir longuement hésité', 'Pour avoir bien travaillé']
          }
        ]
      }
    ]
  },
  {
    title: 'Perfect Infinitive in Different Tenses',
    content: `The perfect infinitive can be used with verbs in various tenses:`,
    examples: [
      {
        spanish: 'Il regrette d\'avoir menti. (He regrets having lied.) - Present',
        english: 'Il regrettait d\'avoir menti. (He regretted having lied.) - Imperfect',
        highlight: ['regrette d\'avoir menti', 'regrettait d\'avoir menti']
      },
      {
        spanish: 'Il regrettera d\'avoir menti. (He will regret having lied.) - Future',
        english: 'Il aurait regretté d\'avoir menti. (He would have regretted having lied.) - Conditional',
        highlight: ['regrettera d\'avoir menti', 'aurait regretté d\'avoir menti']
      }
    ]
  },
  {
    title: 'Style and Register',
    content: `The perfect infinitive is more common in certain contexts:`,
    subsections: [
      {
        title: 'Formal Writing',
        content: 'Preferred in academic and literary texts:',
        examples: [
          {
            spanish: 'Après avoir analysé les données... (After having analyzed the data...)',
            english: 'Pour avoir contribué à... (For having contributed to...)',
            highlight: ['Après avoir analysé', 'Pour avoir contribué']
          }
        ]
      },
      {
        title: 'Spoken French',
        content: 'Less common but still used:',
        examples: [
          {
            spanish: 'Je regrette d\'avoir dit ça. (I regret having said that.)',
            english: 'Merci d\'être venu. (Thanks for having come.)',
            highlight: ['d\'avoir dit ça', 'd\'être venu']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Perfect Infinitive',
    content: `Here are frequent errors students make:

**1. Wrong auxiliary**: Using avoir instead of être or vice versa
**2. Missing agreement**: Forgetting past participle agreement
**3. Wrong preposition**: Using wrong preposition before perfect infinitive
**4. Negation placement**: Placing negation incorrectly`,
    examples: [
      {
        spanish: '❌ Après avoir parti → ✅ Après être parti',
        english: 'Wrong: partir uses être, not avoir',
        highlight: ['Après être parti']
      },
      {
        spanish: '❌ Elle regrette d\'être parti → ✅ Elle regrette d\'être partie',
        english: 'Wrong: missing feminine agreement',
        highlight: ['d\'être partie']
      },
      {
        spanish: '❌ Je regrette ne pas d\'avoir dit → ✅ Je regrette de ne pas avoir dit',
        english: 'Wrong: negation placement',
        highlight: ['de ne pas avoir dit']
      },
      {
        spanish: '❌ Après d\'avoir mangé → ✅ Après avoir mangé',
        english: 'Wrong: no "de" needed after "après"',
        highlight: ['Après avoir mangé']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Passé Composé', url: '/grammar/french/verbs/passe-compose', difficulty: 'intermediate' },
  { title: 'French Past Participle Agreement', url: '/grammar/french/verbs/past-participle-agreement', difficulty: 'advanced' },
  { title: 'French Prepositions', url: '/grammar/french/prepositions/basic-prepositions', difficulty: 'intermediate' },
  { title: 'French Reflexive Verbs', url: '/grammar/french/verbs/reflexive-verbs', difficulty: 'intermediate' }
];

export default function FrenchPerfectInfinitivePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'verbs',
              topic: 'perfect-infinitive',
              title: 'French Perfect Infinitive (Infinitif Passé - Avoir/Être + Past Participle)',
              description: 'Master the French perfect infinitive using avoir/être + past participle. Learn to express completed actions in infinitive form.',
              difficulty: 'advanced',
              examples: [
                'Après avoir mangé... (After having eaten...)',
                'Après être parti... (After having left...)',
                'Je regrette d\'avoir dit ça. (I regret having said that.)',
                'Il est content d\'être venu. (He\'s happy to have come.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'perfect-infinitive',
              title: 'French Perfect Infinitive (Infinitif Passé - Avoir/Être + Past Participle)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="perfect-infinitive"
        title="French Perfect Infinitive (Infinitif Passé - Avoir/Être + Past Participle)"
        description="Master the French perfect infinitive using avoir/être + past participle. Learn to express completed actions in infinitive form"
        difficulty="advanced"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/perfect-infinitive/practice"
        quizUrl="/grammar/french/verbs/perfect-infinitive/quiz"
        songUrl="/songs/fr?theme=grammar&topic=perfect-infinitive"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

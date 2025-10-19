import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'immediate-future',
  title: 'French Immediate Future (Futur Proche - Aller + Infinitive)',
  description: 'Master the French immediate future tense using aller + infinitive. Learn to express near future actions and intentions.',
  difficulty: 'beginner',
  keywords: [
    'french immediate future',
    'futur proche french',
    'aller plus infinitive',
    'french near future',
    'going to french',
    'french future tense'
  ],
  examples: [
    'Je vais manger. (I\'m going to eat.)',
    'Tu vas partir? (Are you going to leave?)',
    'Il va pleuvoir. (It\'s going to rain.)',
    'Nous allons étudier. (We\'re going to study.)'
  ]
});

const sections = [
  {
    title: 'Understanding the French Immediate Future',
    content: `The **immediate future** (futur proche) is used to express actions that will happen **soon** or in the **near future**. It's formed using the present tense of **ALLER** (to go) + **INFINITIVE**.

**Formation: ALLER (conjugated) + INFINITIVE**

This tense is equivalent to the English "going to" construction and is **more commonly used** in spoken French than the simple future tense. It expresses:
- **Immediate plans**: Je vais sortir. (I'm going to go out.)
- **Near future events**: Il va pleuvoir. (It's going to rain.)
- **Intentions**: Nous allons voyager. (We're going to travel.)

The immediate future is essential for everyday French conversation.`,
    examples: [
      {
        spanish: 'Je vais manger dans cinq minutes. (I\'m going to eat in five minutes.)',
        english: 'Immediate plan - happening very soon',
        highlight: ['Je vais manger']
      },
      {
        spanish: 'Elle va avoir un bébé. (She\'s going to have a baby.)',
        english: 'Near future event - planned or expected',
        highlight: ['Elle va avoir']
      },
      {
        spanish: 'Nous allons apprendre le français. (We\'re going to learn French.)',
        english: 'Intention - decided plan for the future',
        highlight: ['Nous allons apprendre']
      }
    ]
  },
  {
    title: 'Formation: ALLER + Infinitive',
    content: `The immediate future is formed by conjugating **ALLER** in the present tense and adding an **infinitive**:`,
    conjugationTable: {
      title: 'ALLER (to go) - Present Tense',
      conjugations: [
        { pronoun: 'je', form: 'vais', english: 'I am going' },
        { pronoun: 'tu', form: 'vas', english: 'you are going (informal)' },
        { pronoun: 'il/elle/on', form: 'va', english: 'he/she/one is going' },
        { pronoun: 'nous', form: 'allons', english: 'we are going' },
        { pronoun: 'vous', form: 'allez', english: 'you are going (formal/plural)' },
        { pronoun: 'ils/elles', form: 'vont', english: 'they are going' }
      ]
    },
    subsections: [
      {
        title: 'Complete Examples',
        content: 'ALLER + infinitive in action:',
        examples: [
          {
            spanish: 'Je vais parler. (I\'m going to speak.)',
            english: 'Tu vas finir. (You\'re going to finish.)',
            highlight: ['Je vais parler', 'Tu vas finir']
          },
          {
            spanish: 'Il va vendre. (He\'s going to sell.)',
            english: 'Nous allons partir. (We\'re going to leave.)',
            highlight: ['Il va vendre', 'Nous allons partir']
          }
        ]
      }
    ]
  },
  {
    title: 'Using the Immediate Future',
    content: `The immediate future is used in several contexts:`,
    examples: [
      {
        spanish: 'Je vais prendre une douche. (I\'m going to take a shower.)',
        english: 'Immediate action - happening very soon',
        highlight: ['Je vais prendre']
      },
      {
        spanish: 'Il va faire beau demain. (It\'s going to be nice tomorrow.)',
        english: 'Weather prediction - near future',
        highlight: ['Il va faire beau']
      },
      {
        spanish: 'Nous allons déménager l\'année prochaine. (We\'re going to move next year.)',
        english: 'Planned future action - decided intention',
        highlight: ['Nous allons déménager']
      }
    ],
    subsections: [
      {
        title: 'Immediate Actions',
        content: 'Actions happening very soon:',
        examples: [
          {
            spanish: 'Je vais me coucher. (I\'m going to go to bed.)',
            english: 'Tu vas manger maintenant? (Are you going to eat now?)',
            highlight: ['Je vais me coucher', 'Tu vas manger maintenant?']
          }
        ]
      },
      {
        title: 'Plans and Intentions',
        content: 'Decided future plans:',
        examples: [
          {
            spanish: 'Elle va étudier la médecine. (She\'s going to study medicine.)',
            english: 'Ils vont acheter une maison. (They\'re going to buy a house.)',
            highlight: ['Elle va étudier', 'Ils vont acheter']
          }
        ]
      },
      {
        title: 'Predictions',
        content: 'Likely future events:',
        examples: [
          {
            spanish: 'Il va être en retard. (He\'s going to be late.)',
            english: 'Ça va marcher! (It\'s going to work!)',
            highlight: ['Il va être en retard', 'Ça va marcher!']
          }
        ]
      }
    ]
  },
  {
    title: 'Negative Form',
    content: `To make the immediate future negative, place **ne...pas** around the conjugated form of **ALLER**:`,
    examples: [
      {
        spanish: 'Je ne vais pas sortir. (I\'m not going to go out.)',
        english: 'Tu ne vas pas comprendre. (You\'re not going to understand.)',
        highlight: ['Je ne vais pas sortir', 'Tu ne vas pas comprendre']
      },
      {
        spanish: 'Il ne va pas pleuvoir. (It\'s not going to rain.)',
        english: 'Nous n\'allons pas partir. (We\'re not going to leave.)',
        highlight: ['Il ne va pas pleuvoir', 'Nous n\'allons pas partir']
      }
    ],
    subsections: [
      {
        title: 'Other Negative Forms',
        content: 'Using other negative expressions:',
        examples: [
          {
            spanish: 'Je ne vais jamais oublier. (I\'m never going to forget.)',
            english: 'Elle ne va rien dire. (She\'s not going to say anything.)',
            highlight: ['ne vais jamais oublier', 'ne va rien dire']
          }
        ]
      }
    ]
  },
  {
    title: 'Interrogative Form',
    content: `Questions with the immediate future can be formed in three ways:`,
    examples: [
      {
        spanish: 'Tu vas partir? (Are you going to leave?) - Intonation',
        english: 'Est-ce que tu vas partir? (Are you going to leave?) - Est-ce que',
        highlight: ['Tu vas partir?', 'Est-ce que tu vas partir?']
      },
      {
        spanish: 'Vas-tu partir? (Are you going to leave?) - Inversion',
        english: 'All three forms mean the same thing',
        highlight: ['Vas-tu partir?']
      }
    ],
    subsections: [
      {
        title: 'Question Words',
        content: 'Using interrogative words:',
        examples: [
          {
            spanish: 'Où vas-tu aller? (Where are you going to go?)',
            english: 'Quand allez-vous partir? (When are you going to leave?)',
            highlight: ['Où vas-tu aller?', 'Quand allez-vous partir?']
          },
          {
            spanish: 'Qu\'est-ce que tu vas faire? (What are you going to do?)',
            english: 'Comment va-t-elle venir? (How is she going to come?)',
            highlight: ['Qu\'est-ce que tu vas faire?', 'Comment va-t-elle venir?']
          }
        ]
      }
    ]
  },
  {
    title: 'Immediate Future vs Simple Future',
    content: `French has two future tenses with different uses:`,
    conjugationTable: {
      title: 'Immediate Future vs Simple Future',
      conjugations: [
        { pronoun: 'Immediate Future', form: 'je vais manger', english: 'I\'m going to eat (soon/planned)' },
        { pronoun: 'Simple Future', form: 'je mangerai', english: 'I will eat (distant/formal)' },
        { pronoun: 'Usage', form: 'Near future, plans', english: 'Distant future, formal' },
        { pronoun: 'Spoken French', form: 'Very common', english: 'Less common' },
        { pronoun: 'Written French', form: 'Common', english: 'More formal' }
      ]
    },
    subsections: [
      {
        title: 'When to Use Immediate Future',
        content: 'Preferred in these situations:',
        examples: [
          {
            spanish: '✅ Je vais manger dans 5 minutes. (immediate)',
            english: '✅ Nous allons partir demain. (planned)',
            highlight: ['Je vais manger', 'Nous allons partir']
          }
        ]
      },
      {
        title: 'When to Use Simple Future',
        content: 'Preferred for formal or distant future:',
        examples: [
          {
            spanish: '✅ Je mangerai quand j\'aurai faim. (conditional)',
            english: '✅ Il pleuvra peut-être. (uncertain)',
            highlight: ['Je mangerai quand', 'Il pleuvra peut-être']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Expressions with Immediate Future',
    content: `Common time expressions used with the immediate future:`,
    examples: [
      {
        spanish: 'Je vais partir tout de suite. (I\'m going to leave right away.)',
        english: 'Elle va arriver dans une heure. (She\'s going to arrive in an hour.)',
        highlight: ['tout de suite', 'dans une heure']
      },
      {
        spanish: 'Nous allons manger ce soir. (We\'re going to eat tonight.)',
        english: 'Il va pleuvoir demain. (It\'s going to rain tomorrow.)',
        highlight: ['ce soir', 'demain']
      }
    ],
    subsections: [
      {
        title: 'Immediate Time Expressions',
        content: 'For very near future:',
        examples: [
          {
            spanish: 'tout de suite (right away)',
            english: 'dans cinq minutes (in five minutes)',
            highlight: ['tout de suite', 'dans cinq minutes']
          },
          {
            spanish: 'maintenant (now)',
            english: 'bientôt (soon)',
            highlight: ['maintenant', 'bientôt']
          }
        ]
      },
      {
        title: 'Near Future Time Expressions',
        content: 'For planned near future:',
        examples: [
          {
            spanish: 'ce soir (tonight)',
            english: 'demain (tomorrow)',
            highlight: ['ce soir', 'demain']
          },
          {
            spanish: 'la semaine prochaine (next week)',
            english: 'l\'année prochaine (next year)',
            highlight: ['la semaine prochaine', 'l\'année prochaine']
          }
        ]
      }
    ]
  },
  {
    title: 'Reflexive Verbs in Immediate Future',
    content: `Reflexive verbs maintain their reflexive pronouns in the immediate future:`,
    examples: [
      {
        spanish: 'Je vais me lever tôt. (I\'m going to get up early.)',
        english: 'Tu vas te coucher tard? (Are you going to go to bed late?)',
        highlight: ['Je vais me lever', 'Tu vas te coucher']
      },
      {
        spanish: 'Elle va se marier. (She\'s going to get married.)',
        english: 'Nous allons nous amuser. (We\'re going to have fun.)',
        highlight: ['Elle va se marier', 'Nous allons nous amuser']
      }
    ],
    subsections: [
      {
        title: 'Pronoun Placement',
        content: 'Reflexive pronouns go before the infinitive:',
        examples: [
          {
            spanish: 'Je vais me préparer. (I\'m going to get ready.)',
            english: 'Ils vont se rencontrer. (They\'re going to meet.)',
            highlight: ['me préparer', 'se rencontrer']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Expressions with Immediate Future',
    content: `Useful phrases and expressions:`,
    examples: [
      {
        spanish: 'Qu\'est-ce que tu vas faire? (What are you going to do?)',
        english: 'Je vais voir. (I\'m going to see./We\'ll see.)',
        highlight: ['Qu\'est-ce que tu vas faire?', 'Je vais voir']
      },
      {
        spanish: 'Ça va marcher! (It\'s going to work!)',
        english: 'On va y aller. (We\'re going to go.)',
        highlight: ['Ça va marcher!', 'On va y aller']
      }
    ],
    subsections: [
      {
        title: 'Encouraging Expressions',
        content: 'Positive future expressions:',
        examples: [
          {
            spanish: 'Ça va bien se passer! (It\'s going to go well!)',
            english: 'Tu vas réussir! (You\'re going to succeed!)',
            highlight: ['Ça va bien se passer!', 'Tu vas réussir!']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Immediate Future',
    content: `Here are frequent errors students make:

**1. Wrong ALLER conjugation**: Mixing up verb forms
**2. Using past participle**: Using past participle instead of infinitive
**3. Double future**: Using both immediate and simple future
**4. Missing infinitive**: Forgetting the infinitive after aller`,
    examples: [
      {
        spanish: '❌ Je va manger → ✅ Je vais manger',
        english: 'Wrong: incorrect aller conjugation',
        highlight: ['Je vais manger']
      },
      {
        spanish: '❌ Je vais mangé → ✅ Je vais manger',
        english: 'Wrong: past participle instead of infinitive',
        highlight: ['Je vais manger']
      },
      {
        spanish: '❌ Je vais mangerai → ✅ Je vais manger',
        english: 'Wrong: mixing immediate and simple future',
        highlight: ['Je vais manger']
      },
      {
        spanish: '❌ Je vais → ✅ Je vais partir',
        english: 'Wrong: missing infinitive after aller',
        highlight: ['Je vais partir']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Future Tense', url: '/grammar/french/verbs/future', difficulty: 'intermediate' },
  { title: 'French Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' },
  { title: 'French Irregular Verbs', url: '/grammar/french/verbs/irregular-verbs', difficulty: 'intermediate' },
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time', difficulty: 'intermediate' }
];

export default function FrenchImmediateFuturePage() {
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
              topic: 'immediate-future',
              title: 'French Immediate Future (Futur Proche - Aller + Infinitive)',
              description: 'Master the French immediate future tense using aller + infinitive. Learn to express near future actions and intentions.',
              difficulty: 'beginner',
              examples: [
                'Je vais manger. (I\'m going to eat.)',
                'Tu vas partir? (Are you going to leave?)',
                'Il va pleuvoir. (It\'s going to rain.)',
                'Nous allons étudier. (We\'re going to study.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'immediate-future',
              title: 'French Immediate Future (Futur Proche - Aller + Infinitive)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="immediate-future"
        title="French Immediate Future (Futur Proche - Aller + Infinitive)"
        description="Master the French immediate future tense using aller + infinitive. Learn to express near future actions and intentions"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/immediate-future/practice"
        quizUrl="/grammar/french/verbs/immediate-future/quiz"
        songUrl="/songs/fr?theme=grammar&topic=immediate-future"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'impersonal-verbs',
  title: 'French Impersonal Verbs (Il faut, Il pleut, Il y a)',
  description: 'Master French impersonal verbs including il faut, il pleut, il y a, il est. Learn weather expressions and impersonal constructions.',
  difficulty: 'intermediate',
  keywords: [
    'french impersonal verbs',
    'il faut french',
    'il y a french',
    'french weather verbs',
    'il pleut il neige',
    'impersonal expressions french'
  ],
  examples: [
    'Il faut partir. (It\'s necessary to leave.)',
    'Il pleut. (It\'s raining.)',
    'Il y a un problème. (There is a problem.)',
    'Il est important de... (It\'s important to...)'
  ]
});

const sections = [
  {
    title: 'Understanding French Impersonal Verbs',
    content: `French impersonal verbs are used with the **impersonal pronoun "il"** and don't refer to a specific person or thing. The "il" is a **dummy subject** that doesn't translate to "he" but rather to "it" or is often not translated at all.

**Common types of impersonal verbs:**
- **Weather expressions**: Il pleut, il neige, il fait beau
- **Necessity/obligation**: Il faut, il vaut mieux
- **Existence**: Il y a, il existe
- **Time expressions**: Il est tard, il est temps
- **Impersonal judgments**: Il est possible, il semble

These verbs are essential for expressing weather, necessity, existence, and general statements in French.`,
    examples: [
      {
        spanish: 'Il pleut beaucoup. (It\'s raining a lot.)',
        english: 'Weather expression - no specific subject',
        highlight: ['Il pleut beaucoup']
      },
      {
        spanish: 'Il faut étudier. (It\'s necessary to study.)',
        english: 'Necessity expression - general obligation',
        highlight: ['Il faut étudier']
      },
      {
        spanish: 'Il y a trois chats. (There are three cats.)',
        english: 'Existence expression - "there is/are"',
        highlight: ['Il y a trois chats']
      }
    ]
  },
  {
    title: 'IL FAUT - Necessity and Obligation',
    content: `**Il faut** expresses necessity, obligation, or what is needed. It's one of the most important impersonal verbs:`,
    examples: [
      {
        spanish: 'Il faut manger. (It\'s necessary to eat./One must eat.)',
        english: 'Il faut du temps. (It takes time./Time is needed.)',
        highlight: ['Il faut manger', 'Il faut du temps']
      },
      {
        spanish: 'Il faut que tu viennes. (You must come./It\'s necessary that you come.)',
        english: 'Il ne faut pas fumer. (One must not smoke./Smoking is forbidden.)',
        highlight: ['Il faut que tu viennes', 'Il ne faut pas fumer']
      }
    ],
    subsections: [
      {
        title: 'IL FAUT + Infinitive',
        content: 'General necessity or obligation:',
        examples: [
          {
            spanish: 'Il faut partir maintenant. (We/One must leave now.)',
            english: 'Il faut faire attention. (One must be careful.)',
            highlight: ['Il faut partir', 'Il faut faire attention']
          }
        ]
      },
      {
        title: 'IL FAUT + Noun',
        content: 'What is needed:',
        examples: [
          {
            spanish: 'Il faut de l\'argent. (Money is needed.)',
            english: 'Il faut du courage. (Courage is needed.)',
            highlight: ['Il faut de l\'argent', 'Il faut du courage']
          }
        ]
      },
      {
        title: 'IL FAUT QUE + Subjunctive',
        content: 'Specific person obligation:',
        examples: [
          {
            spanish: 'Il faut que je parte. (I must leave.)',
            english: 'Il faut qu\'elle vienne. (She must come.)',
            highlight: ['Il faut que je parte', 'Il faut qu\'elle vienne']
          }
        ]
      }
    ]
  },
  {
    title: 'Weather Expressions',
    content: `French uses many impersonal verbs for weather:`,
    conjugationTable: {
      title: 'Common Weather Expressions',
      conjugations: [
        { pronoun: 'il pleut', form: 'it\'s raining', english: 'Il pleut fort. (It\'s raining hard.)' },
        { pronoun: 'il neige', form: 'it\'s snowing', english: 'Il neige beaucoup. (It\'s snowing a lot.)' },
        { pronoun: 'il fait beau', form: 'it\'s nice weather', english: 'Il fait beau aujourd\'hui. (It\'s nice today.)' },
        { pronoun: 'il fait froid', form: 'it\'s cold', english: 'Il fait très froid. (It\'s very cold.)' },
        { pronoun: 'il fait chaud', form: 'it\'s hot', english: 'Il fait trop chaud. (It\'s too hot.)' },
        { pronoun: 'il y a du vent', form: 'it\'s windy', english: 'Il y a beaucoup de vent. (It\'s very windy.)' }
      ]
    },
    subsections: [
      {
        title: 'FAIRE Weather Expressions',
        content: 'Il fait + adjective/noun:',
        examples: [
          {
            spanish: 'Il fait soleil. (It\'s sunny.)',
            english: 'Il fait mauvais. (The weather is bad.)',
            highlight: ['Il fait soleil', 'Il fait mauvais']
          }
        ]
      },
      {
        title: 'Other Weather Verbs',
        content: 'Specific weather phenomena:',
        examples: [
          {
            spanish: 'Il grêle. (It\'s hailing.)',
            english: 'Il tonne. (It\'s thundering.)',
            highlight: ['Il grêle', 'Il tonne']
          }
        ]
      }
    ]
  },
  {
    title: 'IL Y A - Existence and Presence',
    content: `**Il y a** means "there is" or "there are" and indicates existence or presence:`,
    examples: [
      {
        spanish: 'Il y a un chat dans le jardin. (There is a cat in the garden.)',
        english: 'Il y a des problèmes. (There are problems.)',
        highlight: ['Il y a un chat', 'Il y a des problèmes']
      },
      {
        spanish: 'Il n\'y a pas de pain. (There is no bread.)',
        english: 'Y a-t-il des questions? (Are there any questions?)',
        highlight: ['Il n\'y a pas de pain', 'Y a-t-il des questions?']
      }
    ],
    subsections: [
      {
        title: 'IL Y A for Time Expressions',
        content: 'Expressing "ago":',
        examples: [
          {
            spanish: 'Il y a deux ans. (Two years ago.)',
            english: 'Il y a longtemps. (A long time ago.)',
            highlight: ['Il y a deux ans', 'Il y a longtemps']
          }
        ]
      },
      {
        title: 'Negative and Interrogative',
        content: 'Questions and negations with il y a:',
        examples: [
          {
            spanish: 'Il n\'y a rien. (There is nothing.)',
            english: 'Qu\'est-ce qu\'il y a? (What\'s the matter?)',
            highlight: ['Il n\'y a rien', 'Qu\'est-ce qu\'il y a?']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Expressions',
    content: `Impersonal expressions for time:`,
    examples: [
      {
        spanish: 'Il est tard. (It\'s late.)',
        english: 'Il est tôt. (It\'s early.)',
        highlight: ['Il est tard', 'Il est tôt']
      },
      {
        spanish: 'Il est temps de partir. (It\'s time to leave.)',
        english: 'Il est l\'heure de manger. (It\'s time to eat.)',
        highlight: ['Il est temps de partir', 'Il est l\'heure de manger']
      }
    ],
    subsections: [
      {
        title: 'Clock Time',
        content: 'Telling time with impersonal il est:',
        examples: [
          {
            spanish: 'Il est trois heures. (It\'s three o\'clock.)',
            english: 'Il est midi. (It\'s noon.)',
            highlight: ['Il est trois heures', 'Il est midi']
          }
        ]
      }
    ]
  },
  {
    title: 'Impersonal Judgments and Opinions',
    content: `Expressing general opinions and judgments:`,
    conjugationTable: {
      title: 'Common Impersonal Judgments',
      conjugations: [
        { pronoun: 'il est possible', form: 'it\'s possible', english: 'Il est possible qu\'il vienne.' },
        { pronoun: 'il est important', form: 'it\'s important', english: 'Il est important de réussir.' },
        { pronoun: 'il est difficile', form: 'it\'s difficult', english: 'Il est difficile de comprendre.' },
        { pronoun: 'il est facile', form: 'it\'s easy', english: 'Il est facile d\'apprendre.' },
        { pronoun: 'il semble', form: 'it seems', english: 'Il semble qu\'il soit malade.' },
        { pronoun: 'il vaut mieux', form: 'it\'s better', english: 'Il vaut mieux attendre.' }
      ]
    },
    subsections: [
      {
        title: 'IL EST + Adjective + DE + Infinitive',
        content: 'General statements about actions:',
        examples: [
          {
            spanish: 'Il est nécessaire de travailler. (It\'s necessary to work.)',
            english: 'Il est interdit de fumer. (It\'s forbidden to smoke.)',
            highlight: ['Il est nécessaire de travailler', 'Il est interdit de fumer']
          }
        ]
      },
      {
        title: 'IL EST + Adjective + QUE + Subjunctive',
        content: 'Specific person judgments:',
        examples: [
          {
            spanish: 'Il est important que tu viennes. (It\'s important that you come.)',
            english: 'Il est possible qu\'elle soit là. (It\'s possible that she\'s there.)',
            highlight: ['Il est important que tu viennes', 'Il est possible qu\'elle soit là']
          }
        ]
      }
    ]
  },
  {
    title: 'IL VAUT MIEUX - Preference and Advice',
    content: `**Il vaut mieux** means "it\'s better" and gives advice or preference:`,
    examples: [
      {
        spanish: 'Il vaut mieux partir tôt. (It\'s better to leave early.)',
        english: 'Il vaut mieux ne pas y aller. (It\'s better not to go there.)',
        highlight: ['Il vaut mieux partir tôt', 'Il vaut mieux ne pas y aller']
      }
    ],
    subsections: [
      {
        title: 'IL VAUT MIEUX QUE + Subjunctive',
        content: 'Specific advice for someone:',
        examples: [
          {
            spanish: 'Il vaut mieux que tu restes. (It\'s better that you stay.)',
            english: 'Il vaut mieux qu\'on attende. (It\'s better that we wait.)',
            highlight: ['Il vaut mieux que tu restes', 'Il vaut mieux qu\'on attende']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Common Impersonal Verbs',
    content: `Additional useful impersonal expressions:`,
    examples: [
      {
        spanish: 'Il suffit de... (It\'s enough to.../All you need to do is...)',
        english: 'Il arrive que... (It happens that...)',
        highlight: ['Il suffit de...', 'Il arrive que...']
      },
      {
        spanish: 'Il se peut que... (It\'s possible that...)',
        english: 'Il convient de... (It\'s appropriate to...)',
        highlight: ['Il se peut que...', 'Il convient de...']
      }
    ],
    subsections: [
      {
        title: 'IL SUFFIT DE',
        content: 'Expressing what\'s sufficient:',
        examples: [
          {
            spanish: 'Il suffit de demander. (Just ask./All you need to do is ask.)',
            english: 'Il suffit d\'une minute. (One minute is enough.)',
            highlight: ['Il suffit de demander', 'Il suffit d\'une minute']
          }
        ]
      },
      {
        title: 'IL ARRIVE QUE',
        content: 'Expressing occasional occurrence:',
        examples: [
          {
            spanish: 'Il arrive qu\'il soit en retard. (He\'s sometimes late.)',
            english: 'Il arrive que ça marche. (Sometimes it works.)',
            highlight: ['Il arrive qu\'il soit en retard', 'Il arrive que ça marche']
          }
        ]
      }
    ]
  },
  {
    title: 'Tense Usage with Impersonal Verbs',
    content: `Impersonal verbs can be used in different tenses:`,
    examples: [
      {
        spanish: 'Il a plu hier. (It rained yesterday.)',
        english: 'Il faudra partir. (It will be necessary to leave.)',
        highlight: ['Il a plu hier', 'Il faudra partir']
      },
      {
        spanish: 'Il y avait du monde. (There were people.)',
        english: 'Il ferait beau demain. (It would be nice tomorrow.)',
        highlight: ['Il y avait du monde', 'Il ferait beau demain']
      }
    ],
    subsections: [
      {
        title: 'Past Tenses',
        content: 'Impersonal verbs in past tenses:',
        conjugationTable: {
          title: 'Past Tense Examples',
          conjugations: [
            { pronoun: 'il a fallu', form: 'it was necessary', english: 'Il a fallu attendre.' },
            { pronoun: 'il y a eu', form: 'there was/were', english: 'Il y a eu un accident.' },
            { pronoun: 'il a plu', form: 'it rained', english: 'Il a plu toute la nuit.' },
            { pronoun: 'il faisait beau', form: 'it was nice', english: 'Il faisait beau hier.' }
          ]
        }
      }
    ]
  },
  {
    title: 'Common Mistakes with Impersonal Verbs',
    content: `Here are frequent errors students make:

**1. Using personal pronouns**: Saying "je faut" instead of "il faut"
**2. Wrong agreement**: Trying to make impersonal verbs agree
**3. Missing "il"**: Dropping the impersonal subject
**4. Confusion with personal verbs**: Mixing impersonal and personal uses`,
    examples: [
      {
        spanish: '❌ Je faut partir → ✅ Il faut partir',
        english: 'Wrong: using personal pronoun with impersonal verb',
        highlight: ['Il faut partir']
      },
      {
        spanish: '❌ Faut partir → ✅ Il faut partir',
        english: 'Wrong: missing impersonal subject "il"',
        highlight: ['Il faut partir']
      },
      {
        spanish: '❌ Il pleuvent → ✅ Il pleut',
        english: 'Wrong: impersonal verbs don\'t agree with anything',
        highlight: ['Il pleut']
      },
      {
        spanish: '❌ Il y a trois ans que... → ✅ Il y a trois ans... (ago)',
        english: 'Wrong: confusing "ago" vs "for" time expressions',
        highlight: ['Il y a trois ans... (ago)']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Weather Expressions', url: '/grammar/french/expressions/weather', difficulty: 'beginner' },
  { title: 'French Subjunctive Mood', url: '/grammar/french/verbs/subjunctive', difficulty: 'advanced' },
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time', difficulty: 'intermediate' },
  { title: 'French Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' }
];

export default function FrenchImpersonalVerbsPage() {
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
              topic: 'impersonal-verbs',
              title: 'French Impersonal Verbs (Il faut, Il pleut, Il y a)',
              description: 'Master French impersonal verbs including il faut, il pleut, il y a, il est. Learn weather expressions and impersonal constructions.',
              difficulty: 'intermediate',
              examples: [
                'Il faut partir. (It\'s necessary to leave.)',
                'Il pleut. (It\'s raining.)',
                'Il y a un problème. (There is a problem.)',
                'Il est important de... (It\'s important to...)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'impersonal-verbs',
              title: 'French Impersonal Verbs (Il faut, Il pleut, Il y a)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="impersonal-verbs"
        title="French Impersonal Verbs (Il faut, Il pleut, Il y a)"
        description="Master French impersonal verbs including il faut, il pleut, il y a, il est. Learn weather expressions and impersonal constructions"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/impersonal-verbs/practice"
        quizUrl="/grammar/french/verbs/impersonal-verbs/quiz"
        songUrl="/songs/fr?theme=grammar&topic=impersonal-verbs"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

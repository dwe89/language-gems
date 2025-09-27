import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'adverbs',
  topic: 'time',
  title: 'French Time Adverbs (Hier, Aujourd\'hui, Demain, Maintenant)',
  description: 'Master French time adverbs for expressing when actions occur. Learn hier, aujourd\'hui, demain, maintenant, and temporal expressions.',
  difficulty: 'beginner',
  keywords: [
    'french time adverbs',
    'hier aujourd\'hui demain',
    'maintenant alors',
    'when french adverbs',
    'temporal expressions french',
    'time expressions french'
  ],
  examples: [
    'Hier, j\'ai travaillé (Yesterday, I worked)',
    'Aujourd\'hui, il pleut (Today, it\'s raining)',
    'Demain, nous partons (Tomorrow, we leave)',
    'Maintenant, je comprends (Now, I understand)'
  ]
});

const sections = [
  {
    title: 'Understanding Time Adverbs',
    content: `French time adverbs express **when** an action occurs. They answer the question "quand?" (when?) and help establish the temporal context of events.

Time adverbs are essential for narrating events, describing schedules, and organizing information chronologically.

They have flexible placement and can often be used at the beginning of sentences for emphasis.`,
    examples: [
      {
        spanish: 'Hier, j\'ai vu Marie. (Yesterday, I saw Marie.)',
        english: 'Establishing past time reference',
        highlight: ['Hier']
      },
      {
        spanish: 'Je travaille maintenant. (I\'m working now.)',
        english: 'Expressing current time',
        highlight: ['maintenant']
      },
      {
        spanish: 'Demain, nous partirons. (Tomorrow, we will leave.)',
        english: 'Indicating future time',
        highlight: ['Demain']
      }
    ]
  },
  {
    title: 'Basic Time Reference Points',
    content: `The three fundamental time reference points in French:`,
    subsections: [
      {
        title: 'HIER (Yesterday)',
        content: 'Refers to the day before today:',
        examples: [
          {
            spanish: 'Hier, il a plu. (Yesterday, it rained.)',
            english: 'J\'ai vu Pierre hier. (I saw Pierre yesterday.)',
            highlight: ['Hier', 'hier']
          },
          {
            spanish: 'Hier soir, nous sommes sortis. (Last night, we went out.)',
            english: 'Hier matin, j\'ai couru. (Yesterday morning, I ran.)',
            highlight: ['Hier soir', 'Hier matin']
          }
        ]
      },
      {
        title: 'AUJOURD\'HUI (Today)',
        content: 'Refers to the current day:',
        examples: [
          {
            spanish: 'Aujourd\'hui, c\'est lundi. (Today is Monday.)',
            english: 'Il fait beau aujourd\'hui. (It\'s nice weather today.)',
            highlight: ['Aujourd\'hui', 'aujourd\'hui']
          },
          {
            spanish: 'Aujourd\'hui, je reste à la maison. (Today, I\'m staying home.)',
            english: 'Nous travaillons aujourd\'hui. (We\'re working today.)',
            highlight: ['Aujourd\'hui', 'aujourd\'hui']
          }
        ]
      },
      {
        title: 'DEMAIN (Tomorrow)',
        content: 'Refers to the day after today:',
        examples: [
          {
            spanish: 'Demain, je pars en vacances. (Tomorrow, I\'m going on vacation.)',
            english: 'Il pleuvra demain. (It will rain tomorrow.)',
            highlight: ['Demain', 'demain']
          },
          {
            spanish: 'Demain matin, nous partons. (Tomorrow morning, we leave.)',
            english: 'Demain soir, il y a un concert. (Tomorrow evening, there\'s a concert.)',
            highlight: ['Demain matin', 'Demain soir']
          }
        ]
      }
    ]
  },
  {
    title: 'Present Moment Adverbs',
    content: `Adverbs expressing the current moment or immediate time:`,
    subsections: [
      {
        title: 'MAINTENANT (Now)',
        content: 'Refers to the current moment:',
        examples: [
          {
            spanish: 'Je pars maintenant. (I\'m leaving now.)',
            english: 'Maintenant, je comprends. (Now, I understand.)',
            highlight: ['maintenant', 'Maintenant']
          },
          {
            spanish: 'Il est maintenant trop tard. (It\'s now too late.)',
            english: 'Que fais-tu maintenant? (What are you doing now?)',
            highlight: ['maintenant']
          }
        ]
      },
      {
        title: 'EN CE MOMENT (Right Now/At This Time)',
        content: 'Emphasizes the current period:',
        examples: [
          {
            spanish: 'En ce moment, je travaille beaucoup. (Right now, I\'m working a lot.)',
            english: 'Il pleut en ce moment. (It\'s raining right now.)',
            highlight: ['En ce moment', 'en ce moment']
          }
        ]
      },
      {
        title: 'ACTUELLEMENT (Currently/At Present)',
        content: 'More formal way to express current time:',
        examples: [
          {
            spanish: 'Il habite actuellement à Paris. (He currently lives in Paris.)',
            english: 'Actuellement, nous étudions le français. (Currently, we\'re studying French.)',
            highlight: ['actuellement', 'Actuellement']
          }
        ]
      }
    ]
  },
  {
    title: 'Past Time Adverbs',
    content: `Adverbs referring to various points in the past:`,
    subsections: [
      {
        title: 'Recent Past',
        content: 'Adverbs for recent past events:',
        conjugationTable: {
          title: 'Recent Past Adverbs',
          conjugations: [
            { pronoun: 'tout à l\'heure', form: 'a little while ago', english: 'Je l\'ai vu tout à l\'heure. (I saw him a little while ago.)' },
            { pronoun: 'récemment', form: 'recently', english: 'Il est arrivé récemment. (He arrived recently.)' },
            { pronoun: 'dernièrement', form: 'lately', english: 'J\'ai beaucoup travaillé dernièrement. (I\'ve worked a lot lately.)' }
          ]
        }
      },
      {
        title: 'Distant Past',
        content: 'Adverbs for more distant past:',
        examples: [
          {
            spanish: 'autrefois (formerly/in the past): Autrefois, il habitait ici. (Formerly, he lived here.)',
            english: 'jadis (long ago): Jadis, les gens voyageaient à cheval. (Long ago, people traveled on horseback.)',
            highlight: ['autrefois', 'jadis']
          }
        ]
      },
      {
        title: 'Already/Still in Past',
        content: 'Adverbs expressing completion or continuation:',
        examples: [
          {
            spanish: 'déjà (already): Il est déjà parti. (He has already left.)',
            english: 'encore (still): Il travaille encore. (He\'s still working.)',
            highlight: ['déjà', 'encore']
          }
        ]
      }
    ]
  },
  {
    title: 'Future Time Adverbs',
    content: `Adverbs referring to various points in the future:`,
    subsections: [
      {
        title: 'Near Future',
        content: 'Adverbs for immediate future:',
        examples: [
          {
            spanish: 'tout à l\'heure (in a little while): Je reviens tout à l\'heure. (I\'ll be back in a little while.)',
            english: 'bientôt (soon): Il arrivera bientôt. (He will arrive soon.)',
            highlight: ['tout à l\'heure', 'bientôt']
          },
          {
            spanish: 'dans un moment (in a moment): Je viens dans un moment. (I\'m coming in a moment.)',
            english: 'prochainement (soon/shortly): Le film sortira prochainement. (The movie will be released soon.)',
            highlight: ['dans un moment', 'prochainement']
          }
        ]
      },
      {
        title: 'Distant Future',
        content: 'Adverbs for more distant future:',
        examples: [
          {
            spanish: 'plus tard (later): Nous parlerons plus tard. (We\'ll talk later.)',
            english: 'un jour (one day): Un jour, je visiterai la France. (One day, I\'ll visit France.)',
            highlight: ['plus tard', 'un jour']
          }
        ]
      }
    ]
  },
  {
    title: 'Sequential Time Adverbs',
    content: `Adverbs that show sequence and order of events:`,
    examples: [
      {
        spanish: 'd\'abord (first): D\'abord, je me lève. (First, I get up.)',
        english: 'ensuite (then): Ensuite, je prends le petit déjeuner. (Then, I have breakfast.)',
        highlight: ['d\'abord', 'ensuite']
      },
      {
        spanish: 'puis (then): Puis, je vais au travail. (Then, I go to work.)',
        english: 'enfin (finally): Enfin, je rentre à la maison. (Finally, I go home.)',
        highlight: ['puis', 'enfin']
      }
    ],
    subsections: [
      {
        title: 'Complete Sequence',
        content: 'Common sequence adverbs in order:',
        conjugationTable: {
          title: 'Sequential Adverbs',
          conjugations: [
            { pronoun: 'd\'abord', form: 'first', english: 'D\'abord, nous étudions. (First, we study.)' },
            { pronoun: 'ensuite/puis', form: 'then', english: 'Ensuite, nous mangeons. (Then, we eat.)' },
            { pronoun: 'après', form: 'after', english: 'Après, nous sortons. (After, we go out.)' },
            { pronoun: 'enfin', form: 'finally', english: 'Enfin, nous rentrons. (Finally, we go home.)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Placement of Time Adverbs',
    content: `Time adverbs have flexible placement in French sentences:`,
    examples: [
      {
        spanish: 'Beginning: Hier, j\'ai travaillé. (Yesterday, I worked.)',
        english: 'End: J\'ai travaillé hier. (I worked yesterday.)',
        highlight: ['Hier', 'hier']
      },
      {
        spanish: 'Beginning: Maintenant, je comprends. (Now, I understand.)',
        english: 'Middle: Je comprends maintenant. (I understand now.)',
        highlight: ['Maintenant', 'maintenant']
      }
    ],
    subsections: [
      {
        title: 'Emphasis and Style',
        content: 'Placement affects emphasis:',
        examples: [
          {
            spanish: 'Neutral: Il arrive demain. (He arrives tomorrow.)',
            english: 'Emphatic: Demain, il arrive! (Tomorrow, he arrives!)',
            highlight: ['demain', 'Demain']
          },
          {
            spanish: 'Formal writing often places time adverbs at the beginning',
            english: 'Spoken French often places them at the end',
            highlight: ['beginning', 'end']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Expressions vs Time Adverbs',
    content: `Distinction between single-word adverbs and longer time expressions:`,
    examples: [
      {
        spanish: 'Adverbs: hier, maintenant, demain (single words)',
        english: 'Expressions: la semaine dernière, dans deux jours (phrases)',
        highlight: ['hier', 'la semaine dernière']
      }
    ],
    subsections: [
      {
        title: 'Common Time Expressions',
        content: 'Longer expressions that function like time adverbs:',
        examples: [
          {
            spanish: 'la semaine dernière (last week)',
            english: 'le mois prochain (next month)',
            highlight: ['la semaine dernière', 'le mois prochain']
          },
          {
            spanish: 'il y a deux jours (two days ago)',
            english: 'dans trois semaines (in three weeks)',
            highlight: ['il y a deux jours', 'dans trois semaines']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Time Adverb Mistakes',
    content: `Here are frequent errors students make:

**1. Confusion with frequency**: Mixing time and frequency adverbs
**2. Wrong tense agreement**: Using wrong tense with time adverbs
**3. Placement errors**: Awkward positioning in sentences
**4. False friends**: Confusing actuellement with "actually"`,
    examples: [
      {
        spanish: '❌ Hier, je vais → ✅ Hier, je suis allé',
        english: 'Wrong: hier requires past tense',
        highlight: ['je suis allé']
      },
      {
        spanish: '❌ Demain, j\'ai travaillé → ✅ Demain, je travaillerai',
        english: 'Wrong: demain requires future tense',
        highlight: ['je travaillerai']
      },
      {
        spanish: '❌ Actuellement, c\'est vrai → ✅ En fait, c\'est vrai',
        english: 'Wrong: actuellement ≠ actually (use "en fait")',
        highlight: ['En fait']
      },
      {
        spanish: '❌ Je toujours hier → ✅ Hier, j\'ai toujours fait ça',
        english: 'Wrong: don\'t mix time (hier) and frequency (toujours) incorrectly',
        highlight: ['Hier, j\'ai toujours fait ça']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Frequency Adverbs', url: '/grammar/french/adverbs/frequency', difficulty: 'beginner' },
  { title: 'French Tenses Overview', url: '/grammar/french/verbs/tenses-overview', difficulty: 'intermediate' },
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time', difficulty: 'beginner' },
  { title: 'French Sequence Words', url: '/grammar/french/expressions/sequence', difficulty: 'intermediate' }
];

export default function FrenchTimeAdverbsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'adverbs',
              topic: 'time',
              title: 'French Time Adverbs (Hier, Aujourd\'hui, Demain, Maintenant)',
              description: 'Master French time adverbs for expressing when actions occur. Learn hier, aujourd\'hui, demain, maintenant, and temporal expressions.',
              difficulty: 'beginner',
              examples: [
                'Hier, j\'ai travaillé (Yesterday, I worked)',
                'Aujourd\'hui, il pleut (Today, it\'s raining)',
                'Demain, nous partons (Tomorrow, we leave)',
                'Maintenant, je comprends (Now, I understand)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'adverbs',
              topic: 'time',
              title: 'French Time Adverbs (Hier, Aujourd\'hui, Demain, Maintenant)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="adverbs"
        topic="time"
        title="French Time Adverbs (Hier, Aujourd\'hui, Demain, Maintenant)"
        description="Master French time adverbs for expressing when actions occur. Learn hier, aujourd\'hui, demain, maintenant, and temporal expressions"
        difficulty="beginner"
        estimatedTime={12}
        sections={sections}
        backUrl="/grammar/french/adverbs"
        practiceUrl="/grammar/french/adverbs/time/practice"
        quizUrl="/grammar/french/adverbs/time/quiz"
        songUrl="/songs/fr?theme=grammar&topic=time"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

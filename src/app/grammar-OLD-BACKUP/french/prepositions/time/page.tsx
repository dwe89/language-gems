import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'prepositions',
  topic: 'time',
  title: 'French Time Prepositions (En, Dans, Pendant, Depuis, Pour)',
  description: 'Master French time prepositions for expressing when, how long, and duration. Learn en, dans, pendant, depuis, pour with temporal expressions.',
  difficulty: 'intermediate',
  keywords: [
    'french time prepositions',
    'en dans pendant',
    'depuis pour french',
    'duration prepositions french',
    'when prepositions french',
    'temporal expressions french'
  ],
  examples: [
    'En été, il fait chaud (In summer, it\'s hot)',
    'Je pars dans une heure (I\'m leaving in an hour)',
    'Il a travaillé pendant trois heures (He worked for three hours)',
    'J\'habite ici depuis 2020 (I\'ve lived here since 2020)'
  ]
});

const sections = [
  {
    title: 'Understanding Time Prepositions',
    content: `French time prepositions express **when** actions occur, **how long** they last, and **temporal relationships** between events. They are essential for describing schedules, durations, and time frames.

Different prepositions are used for:
**Seasons and months** (en)
**Future time** (dans)
**Duration** (pendant)
**Starting point** (depuis)
**Intended duration** (pour)

Mastering these distinctions is crucial for accurate temporal expression in French.`,
    examples: [
      {
        spanish: 'En hiver, il neige. (In winter, it snows.)',
        english: 'Seasons use en',
        highlight: ['En hiver']
      },
      {
        spanish: 'Je reviens dans dix minutes. (I\'ll be back in ten minutes.)',
        english: 'Future time uses dans',
        highlight: ['dans dix minutes']
      },
      {
        spanish: 'Il a dormi pendant huit heures. (He slept for eight hours.)',
        english: 'Completed duration uses pendant',
        highlight: ['pendant huit heures']
      }
    ]
  },
  {
    title: 'EN - Seasons, Months, and Years',
    content: `**En** is used with seasons, months, years, and general time periods:`,
    examples: [
      {
        spanish: 'En été, nous voyageons. (In summer, we travel.)',
        english: 'Seasons',
        highlight: ['En été']
      },
      {
        spanish: 'En janvier, il fait froid. (In January, it\'s cold.)',
        english: 'Months',
        highlight: ['En janvier']
      },
      {
        spanish: 'En 2023, j\'ai déménagé. (In 2023, I moved.)',
        english: 'Years',
        highlight: ['En 2023']
      }
    ],
    subsections: [
      {
        title: 'EN with Seasons',
        content: 'All seasons use en except printemps:',
        conjugationTable: {
          title: 'Seasons with EN',
          conjugations: [
            { pronoun: 'en été', form: 'in summer', english: 'En été, il fait chaud.' },
            { pronoun: 'en automne', form: 'in autumn', english: 'En automne, les feuilles tombent.' },
            { pronoun: 'en hiver', form: 'in winter', english: 'En hiver, il neige.' },
            { pronoun: 'au printemps', form: 'in spring', english: 'Au printemps, les fleurs poussent.' }
          ]
        }
      },
      {
        title: 'EN with Months and Years',
        content: 'All months and years use en:',
        examples: [
          {
            spanish: 'en mars (in March), en décembre (in December)',
            english: 'en 1990 (in 1990), en 2025 (in 2025)',
            highlight: ['en mars', 'en 1990']
          }
        ]
      },
      {
        title: 'EN with Duration (How Long It Takes)',
        content: 'En expresses the time needed to complete an action:',
        examples: [
          {
            spanish: 'Je fais mes devoirs en une heure. (I do my homework in one hour.)',
            english: 'Il a lu le livre en deux jours. (He read the book in two days.)',
            highlight: ['en une heure', 'en deux jours']
          }
        ]
      }
    ]
  },
  {
    title: 'DANS - Future Time',
    content: `**Dans** expresses future time - "in" meaning "after a period of time":`,
    examples: [
      {
        spanish: 'Je pars dans une heure. (I\'m leaving in an hour.)',
        english: 'Future time from now',
        highlight: ['dans une heure']
      },
      {
        spanish: 'Il reviendra dans trois jours. (He\'ll come back in three days.)',
        english: 'Future point in time',
        highlight: ['dans trois jours']
      },
      {
        spanish: 'Nous nous marions dans six mois. (We\'re getting married in six months.)',
        english: 'Future event timing',
        highlight: ['dans six mois']
      }
    ],
    subsections: [
      {
        title: 'DANS vs EN',
        content: 'Important distinction between dans and en:',
        examples: [
          {
            spanish: 'Dans: future time from now: Je pars dans une heure. (I\'m leaving in an hour.)',
            english: 'En: time needed to complete: Je fais ça en une heure. (I do this in one hour.)',
            highlight: ['dans une heure', 'en une heure']
          }
        ]
      },
      {
        title: 'Common DANS Expressions',
        content: 'Frequently used future time expressions:',
        conjugationTable: {
          title: 'DANS + Time',
          conjugations: [
            { pronoun: 'dans un moment', form: 'in a moment', english: 'Je viens dans un moment.' },
            { pronoun: 'dans une semaine', form: 'in a week', english: 'Il part dans une semaine.' },
            { pronoun: 'dans longtemps', form: 'in a long time', english: 'Ça arrivera dans longtemps.' },
            { pronoun: 'dans peu de temps', form: 'in a short time', english: 'Elle reviendra dans peu de temps.' }
          ]
        }
      }
    ]
  },
  {
    title: 'PENDANT - Duration (For)',
    content: `**Pendant** expresses the duration of a completed or ongoing action:`,
    examples: [
      {
        spanish: 'Il a travaillé pendant trois heures. (He worked for three hours.)',
        english: 'Completed duration',
        highlight: ['pendant trois heures']
      },
      {
        spanish: 'Je lis pendant le voyage. (I read during the trip.)',
        english: 'Duration of ongoing action',
        highlight: ['pendant le voyage']
      },
      {
        spanish: 'Elle a vécu en France pendant dix ans. (She lived in France for ten years.)',
        english: 'Past duration',
        highlight: ['pendant dix ans']
      }
    ],
    subsections: [
      {
        title: 'PENDANT Usage',
        content: 'Different contexts for pendant:',
        examples: [
          {
            spanish: 'Past actions: J\'ai étudié pendant deux ans. (I studied for two years.)',
            english: 'Ongoing actions: Il dort pendant la journée. (He sleeps during the day.)',
            highlight: ['pendant deux ans', 'pendant la journée']
          }
        ]
      },
      {
        title: 'PENDANT vs POUR',
        content: 'Distinction between actual and intended duration:',
        examples: [
          {
            spanish: 'Pendant: actual duration: J\'ai travaillé pendant trois heures. (I worked for three hours.)',
            english: 'Pour: intended duration: Je pars pour trois jours. (I\'m leaving for three days.)',
            highlight: ['pendant trois heures', 'pour trois jours']
          }
        ]
      }
    ]
  },
  {
    title: 'DEPUIS - Since/For (Starting Point)',
    content: `**Depuis** expresses the starting point of an ongoing action or state:`,
    examples: [
      {
        spanish: 'J\'habite ici depuis 2020. (I\'ve lived here since 2020.)',
        english: 'Starting point (specific time)',
        highlight: ['depuis 2020']
      },
      {
        spanish: 'Il pleut depuis ce matin. (It\'s been raining since this morning.)',
        english: 'Starting point (general time)',
        highlight: ['depuis ce matin']
      },
      {
        spanish: 'Je l\'attends depuis une heure. (I\'ve been waiting for him for an hour.)',
        english: 'Duration from starting point',
        highlight: ['depuis une heure']
      }
    ],
    subsections: [
      {
        title: 'DEPUIS with Specific Times',
        content: 'Using depuis with dates, times, and events:',
        examples: [
          {
            spanish: 'depuis lundi (since Monday)',
            english: 'depuis hier (since yesterday)',
            highlight: ['depuis lundi', 'depuis hier']
          },
          {
            spanish: 'depuis son arrivée (since his arrival)',
            english: 'depuis la guerre (since the war)',
            highlight: ['depuis son arrivée', 'depuis la guerre']
          }
        ]
      },
      {
        title: 'DEPUIS with Durations',
        content: 'Using depuis to express "for" (ongoing):',
        conjugationTable: {
          title: 'DEPUIS + Duration',
          conjugations: [
            { pronoun: 'depuis longtemps', form: 'for a long time', english: 'Je le connais depuis longtemps.' },
            { pronoun: 'depuis peu', form: 'for a short time', english: 'Il habite ici depuis peu.' },
            { pronoun: 'depuis toujours', form: 'forever/always', english: 'Elle aime ça depuis toujours.' },
            { pronoun: 'depuis quand?', form: 'since when?', english: 'Depuis quand tu étudies le français?' }
          ]
        }
      },
      {
        title: 'DEPUIS vs IL Y A',
        content: 'Distinction between ongoing and completed actions:',
        examples: [
          {
            spanish: 'Depuis: ongoing: J\'habite ici depuis trois ans. (I\'ve lived here for three years.)',
            english: 'Il y a: completed: Je suis arrivé il y a trois ans. (I arrived three years ago.)',
            highlight: ['depuis trois ans', 'il y a trois ans']
          }
        ]
      }
    ]
  },
  {
    title: 'POUR - Intended Duration',
    content: `**Pour** expresses intended or planned duration:`,
    examples: [
      {
        spanish: 'Je pars pour trois jours. (I\'m leaving for three days.)',
        english: 'Intended duration',
        highlight: ['pour trois jours']
      },
      {
        spanish: 'Il est en vacances pour une semaine. (He\'s on vacation for a week.)',
        english: 'Planned duration',
        highlight: ['pour une semaine']
      },
      {
        spanish: 'Elle déménage pour toujours. (She\'s moving away forever.)',
        english: 'Permanent duration',
        highlight: ['pour toujours']
      }
    ],
    subsections: [
      {
        title: 'POUR vs PENDANT',
        content: 'Intended vs actual duration:',
        examples: [
          {
            spanish: 'Pour: intended: Je pars pour deux semaines. (I\'m leaving for two weeks.)',
            english: 'Pendant: actual: J\'ai travaillé pendant deux semaines. (I worked for two weeks.)',
            highlight: ['pour deux semaines', 'pendant deux semaines']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Time Prepositions',
    content: `Additional important time prepositions:`,
    subsections: [
      {
        title: 'AVANT (Before)',
        content: 'Expressing time before an event:',
        examples: [
          {
            spanish: 'avant le dîner (before dinner)',
            english: 'avant de partir (before leaving)',
            highlight: ['avant le dîner', 'avant de partir']
          }
        ]
      },
      {
        title: 'APRÈS (After)',
        content: 'Expressing time after an event:',
        examples: [
          {
            spanish: 'après le travail (after work)',
            english: 'après avoir mangé (after eating)',
            highlight: ['après le travail', 'après avoir mangé']
          }
        ]
      },
      {
        title: 'VERS (Around/Towards)',
        content: 'Expressing approximate time:',
        examples: [
          {
            spanish: 'vers midi (around noon)',
            english: 'vers 18h (around 6 PM)',
            highlight: ['vers midi', 'vers 18h']
          }
        ]
      },
      {
        title: 'JUSQU\'À (Until)',
        content: 'Expressing end point in time:',
        examples: [
          {
            spanish: 'jusqu\'à demain (until tomorrow)',
            english: 'jusqu\'à maintenant (until now)',
            highlight: ['jusqu\'à demain', 'jusqu\'à maintenant']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Preposition Summary',
    content: `Quick reference for choosing the right time preposition:`,
    conjugationTable: {
      title: 'Time Preposition Guide',
      conjugations: [
        { pronoun: 'EN', form: 'seasons, months, years', english: 'en été, en mars, en 2023' },
        { pronoun: 'DANS', form: 'future time from now', english: 'dans une heure, dans trois jours' },
        { pronoun: 'PENDANT', form: 'actual duration', english: 'pendant deux heures (worked for)' },
        { pronoun: 'DEPUIS', form: 'starting point (ongoing)', english: 'depuis 2020 (since/for)' },
        { pronoun: 'POUR', form: 'intended duration', english: 'pour trois jours (leaving for)' }
      ]
    }
  },
  {
    title: 'Common Time Preposition Mistakes',
    content: `Here are frequent errors students make:

**1. EN vs DANS confusion**: Using en for future time instead of dans
**2. PENDANT vs POUR**: Using pendant for intended duration
**3. DEPUIS vs IL Y A**: Confusing ongoing vs completed actions
**4. Missing AU with printemps**: Forgetting au printemps exception`,
    examples: [
      {
        spanish: '❌ Je pars en une heure → ✅ Je pars dans une heure',
        english: 'Wrong: use dans for future time from now',
        highlight: ['dans une heure']
      },
      {
        spanish: '❌ Je pars pendant trois jours → ✅ Je pars pour trois jours',
        english: 'Wrong: use pour for intended duration',
        highlight: ['pour trois jours']
      },
      {
        spanish: '❌ J\'habite ici il y a trois ans → ✅ J\'habite ici depuis trois ans',
        english: 'Wrong: use depuis for ongoing states',
        highlight: ['depuis trois ans']
      },
      {
        spanish: '❌ en printemps → ✅ au printemps',
        english: 'Wrong: printemps is the only season that uses au',
        highlight: ['au printemps']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Time Adverbs', url: '/grammar/french/adverbs/time', difficulty: 'beginner' },
  { title: 'French Basic Prepositions', url: '/grammar/french/prepositions/basic-prepositions', difficulty: 'beginner' },
  { title: 'French Tenses Overview', url: '/grammar/french/verbs/tenses-overview', difficulty: 'intermediate' },
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time', difficulty: 'beginner' }
];

export default function FrenchTimePrepositionsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'prepositions',
              topic: 'time',
              title: 'French Time Prepositions (En, Dans, Pendant, Depuis, Pour)',
              description: 'Master French time prepositions for expressing when, how long, and duration. Learn en, dans, pendant, depuis, pour with temporal expressions.',
              difficulty: 'intermediate',
              examples: [
                'En été, il fait chaud (In summer, it\'s hot)',
                'Je pars dans une heure (I\'m leaving in an hour)',
                'Il a travaillé pendant trois heures (He worked for three hours)',
                'J\'habite ici depuis 2020 (I\'ve lived here since 2020)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'prepositions',
              topic: 'time',
              title: 'French Time Prepositions (En, Dans, Pendant, Depuis, Pour)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="prepositions"
        topic="time"
        title="French Time Prepositions (En, Dans, Pendant, Depuis, Pour)"
        description="Master French time prepositions for expressing when, how long, and duration. Learn en, dans, pendant, depuis, pour with temporal expressions"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/french/prepositions"
        practiceUrl="/grammar/french/prepositions/time/practice"
        quizUrl="/grammar/french/prepositions/time/quiz"
        songUrl="/songs/fr?theme=grammar&topic=time"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

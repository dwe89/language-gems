import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'prepositions',
  topic: 'prepositions-time',
  title: 'French Time Prepositions (À, En, Dans, Depuis, Pendant)',
  description: 'Master French time prepositions including à, en, dans, depuis, pendant. Learn to express when, how long, and duration in French.',
  difficulty: 'intermediate',
  keywords: [
    'french time prepositions',
    'à en dans depuis pendant',
    'french temporal prepositions',
    'when how long french',
    'duration french prepositions',
    'time expressions french'
  ],
  examples: [
    'À huit heures (at eight o\'clock)',
    'En été (in summer)',
    'Dans une heure (in an hour)',
    'Depuis lundi (since Monday)',
    'Pendant deux heures (for two hours)'
  ]
});

const sections = [
  {
    title: 'Understanding French Time Prepositions',
    content: `French time prepositions express **when**, **how long**, and **duration** of actions. Each preposition has specific uses and cannot be translated directly from English.

**Main time prepositions:**
- **À**: Specific times (à 8h, à midi)
- **EN**: Months, seasons, years (en janvier, en été)
- **DANS**: Future time from now (dans une heure)
- **DEPUIS**: Starting point continuing to now (depuis lundi)
- **PENDANT**: Duration of completed action (pendant 2 heures)
- **POUR**: Intended duration (pour 3 jours)

Understanding these distinctions is crucial for accurate time expression in French.`,
    examples: [
      {
        spanish: 'Je pars à 9 heures. (I\'m leaving at 9 o\'clock.)',
        english: 'Specific time point - exact moment',
        highlight: ['à 9 heures']
      },
      {
        spanish: 'Il fait froid en hiver. (It\'s cold in winter.)',
        english: 'Season - general time period',
        highlight: ['en hiver']
      },
      {
        spanish: 'Je reviens dans 10 minutes. (I\'ll be back in 10 minutes.)',
        english: 'Future time from now - countdown',
        highlight: ['dans 10 minutes']
      }
    ]
  },
  {
    title: 'À - Specific Times',
    content: `**À** is used for **specific times** and **precise moments**:`,
    conjugationTable: {
      title: 'À with Time Expressions',
      conjugations: [
        { pronoun: 'à + hour', form: 'at (time)', english: 'à huit heures (at eight o\'clock)' },
        { pronoun: 'à + moment', form: 'at (moment)', english: 'à midi (at noon), à minuit (at midnight)' },
        { pronoun: 'à + age', form: 'at (age)', english: 'à 18 ans (at 18 years old)' },
        { pronoun: 'à + festival', form: 'at (celebration)', english: 'à Noël (at Christmas), à Pâques (at Easter)' },
        { pronoun: 'à + beginning/end', form: 'at (start/finish)', english: 'au début (at the beginning), à la fin (at the end)' }
      ]
    },
    subsections: [
      {
        title: 'Clock Times',
        content: 'Expressing specific hours:',
        examples: [
          {
            spanish: 'Le cours commence à 14h30. (The class starts at 2:30 PM.)',
            english: 'Je me lève à 7 heures. (I get up at 7 o\'clock.)',
            highlight: ['à 14h30', 'à 7 heures']
          }
        ]
      },
      {
        title: 'Special Moments',
        content: 'Fixed time points:',
        examples: [
          {
            spanish: 'Nous mangeons à midi. (We eat at noon.)',
            english: 'Les magasins ferment à minuit. (Stores close at midnight.)',
            highlight: ['à midi', 'à minuit']
          }
        ]
      },
      {
        title: 'Life Events',
        content: 'Ages and celebrations:',
        examples: [
          {
            spanish: 'Il s\'est marié à 25 ans. (He got married at 25.)',
            english: 'Nous nous voyons à Noël. (We see each other at Christmas.)',
            highlight: ['à 25 ans', 'à Noël']
          }
        ]
      }
    ]
  },
  {
    title: 'EN - Months, Seasons, Years',
    content: `**EN** is used with **months**, **seasons**, and **years**:`,
    conjugationTable: {
      title: 'EN with Time Periods',
      conjugations: [
        { pronoun: 'en + month', form: 'in (month)', english: 'en janvier (in January), en décembre (in December)' },
        { pronoun: 'en + season', form: 'in (season)', english: 'en été (in summer), en hiver (in winter)' },
        { pronoun: 'en + year', form: 'in (year)', english: 'en 2023 (in 2023), en 1990 (in 1990)' },
        { pronoun: 'en + duration', form: 'in (time taken)', english: 'en 2 heures (in 2 hours - time taken)' }
      ]
    },
    subsections: [
      {
        title: 'Months',
        content: 'All months use EN:',
        examples: [
          {
            spanish: 'Mon anniversaire est en mars. (My birthday is in March.)',
            english: 'Il fait chaud en juillet. (It\'s hot in July.)',
            highlight: ['en mars', 'en juillet']
          }
        ]
      },
      {
        title: 'Seasons',
        content: 'Three seasons use EN (exception: au printemps):',
        examples: [
          {
            spanish: 'En été, nous allons à la plage. (In summer, we go to the beach.)',
            english: 'En automne, les feuilles tombent. (In autumn, leaves fall.)',
            highlight: ['En été', 'En automne']
          },
          {
            spanish: '⚠️ Exception: au printemps (in spring)',
            english: 'Au printemps, les fleurs poussent. (In spring, flowers grow.)',
            highlight: ['au printemps']
          }
        ]
      },
      {
        title: 'Duration to Complete',
        content: 'Time taken to finish something:',
        examples: [
          {
            spanish: 'J\'ai fini en une heure. (I finished in one hour.)',
            english: 'Il a appris le français en 6 mois. (He learned French in 6 months.)',
            highlight: ['en une heure', 'en 6 mois']
          }
        ]
      }
    ]
  },
  {
    title: 'DANS - Future Time from Now',
    content: `**DANS** expresses **future time from the present moment**:`,
    examples: [
      {
        spanish: 'Je pars dans 5 minutes. (I\'m leaving in 5 minutes.)',
        english: 'Le film commence dans une heure. (The movie starts in an hour.)',
        highlight: ['dans 5 minutes', 'dans une heure']
      },
      {
        spanish: 'Nous nous marions dans 3 mois. (We\'re getting married in 3 months.)',
        english: 'Il reviendra dans 2 ans. (He\'ll come back in 2 years.)',
        highlight: ['dans 3 mois', 'dans 2 ans']
      }
    ],
    subsections: [
      {
        title: 'DANS vs EN',
        content: 'Important distinction:',
        examples: [
          {
            spanish: 'DANS = future from now: Je pars dans 1 heure. (I\'m leaving in 1 hour.)',
            english: 'EN = time taken: J\'ai fini en 1 heure. (I finished in 1 hour.)',
            highlight: ['dans 1 heure', 'en 1 heure']
          }
        ]
      }
    ]
  },
  {
    title: 'DEPUIS - Starting Point to Now',
    content: `**DEPUIS** expresses **duration from a starting point** continuing to the present:`,
    examples: [
      {
        spanish: 'J\'habite ici depuis 5 ans. (I\'ve been living here for 5 years.)',
        english: 'Il pleut depuis ce matin. (It\'s been raining since this morning.)',
        highlight: ['depuis 5 ans', 'depuis ce matin']
      },
      {
        spanish: 'Elle étudie le français depuis janvier. (She\'s been studying French since January.)',
        english: 'Nous nous connaissons depuis longtemps. (We\'ve known each other for a long time.)',
        highlight: ['depuis janvier', 'depuis longtemps']
      }
    ],
    subsections: [
      {
        title: 'DEPUIS + Duration',
        content: 'How long something has been happening:',
        examples: [
          {
            spanish: 'Je travaille ici depuis 3 ans. (I\'ve been working here for 3 years.)',
            english: 'Il dort depuis 10 heures. (He\'s been sleeping for 10 hours.)',
            highlight: ['depuis 3 ans', 'depuis 10 heures']
          }
        ]
      },
      {
        title: 'DEPUIS + Starting Point',
        content: 'When something started:',
        examples: [
          {
            spanish: 'Depuis lundi, je fais du sport. (Since Monday, I\'ve been doing sports.)',
            english: 'Depuis son départ, je suis triste. (Since his departure, I\'ve been sad.)',
            highlight: ['Depuis lundi', 'Depuis son départ']
          }
        ]
      }
    ]
  },
  {
    title: 'PENDANT - Duration of Completed Action',
    content: `**PENDANT** expresses the **duration** of a **completed** or **defined** action:`,
    examples: [
      {
        spanish: 'J\'ai étudié pendant 3 heures. (I studied for 3 hours.)',
        english: 'Il a plu pendant toute la nuit. (It rained all night long.)',
        highlight: ['pendant 3 heures', 'pendant toute la nuit']
      },
      {
        spanish: 'Pendant les vacances, nous voyageons. (During the holidays, we travel.)',
        english: 'Pendant qu\'il dormait, j\'ai lu. (While he was sleeping, I read.)',
        highlight: ['Pendant les vacances', 'Pendant qu\'il dormait']
      }
    ],
    subsections: [
      {
        title: 'PENDANT vs DEPUIS',
        content: 'Key difference:',
        examples: [
          {
            spanish: 'PENDANT = completed duration: J\'ai travaillé pendant 8 heures. (I worked for 8 hours.)',
            english: 'DEPUIS = ongoing duration: Je travaille depuis 8 heures. (I\'ve been working for 8 hours.)',
            highlight: ['pendant 8 heures', 'depuis 8 heures']
          }
        ]
      }
    ]
  },
  {
    title: 'POUR - Intended Duration',
    content: `**POUR** expresses **intended** or **planned** duration:`,
    examples: [
      {
        spanish: 'Je pars pour 2 semaines. (I\'m leaving for 2 weeks.)',
        english: 'Il vient pour 3 jours. (He\'s coming for 3 days.)',
        highlight: ['pour 2 semaines', 'pour 3 jours']
      },
      {
        spanish: 'Nous louons la maison pour l\'été. (We\'re renting the house for the summer.)',
        english: 'Elle étudie pour 4 ans. (She\'s studying for 4 years.)',
        highlight: ['pour l\'été', 'pour 4 ans']
      }
    ],
    subsections: [
      {
        title: 'POUR vs PENDANT',
        content: 'Intention vs completion:',
        examples: [
          {
            spanish: 'POUR = intended: Je pars pour 1 mois. (I\'m leaving for 1 month - planned)',
            english: 'PENDANT = actual: J\'ai voyagé pendant 1 mois. (I traveled for 1 month - completed)',
            highlight: ['pour 1 mois', 'pendant 1 mois']
          }
        ]
      }
    ]
  },
  {
    title: 'Other Time Prepositions',
    content: `Additional important time prepositions:`,
    conjugationTable: {
      title: 'Other Time Prepositions',
      conjugations: [
        { pronoun: 'avant', form: 'before', english: 'avant midi (before noon)' },
        { pronoun: 'après', form: 'after', english: 'après le dîner (after dinner)' },
        { pronoun: 'vers', form: 'around/about', english: 'vers 8 heures (around 8 o\'clock)' },
        { pronoun: 'jusqu\'à', form: 'until', english: 'jusqu\'à demain (until tomorrow)' },
        { pronoun: 'dès', form: 'from/as early as', english: 'dès 6 heures (from 6 o\'clock)' },
        { pronoun: 'entre', form: 'between', english: 'entre 2 et 4 heures (between 2 and 4 o\'clock)' }
      ]
    },
    subsections: [
      {
        title: 'Approximate Time',
        content: 'Expressing approximate times:',
        examples: [
          {
            spanish: 'Il arrive vers 19 heures. (He\'s arriving around 7 PM.)',
            english: 'Entre 10 et 11 heures, je suis libre. (Between 10 and 11, I\'m free.)',
            highlight: ['vers 19 heures', 'Entre 10 et 11 heures']
          }
        ]
      }
    ]
  },
  {
    title: 'Days of the Week',
    content: `Special rules for days of the week:`,
    examples: [
      {
        spanish: 'Je pars lundi. (I\'m leaving on Monday.) - Specific Monday',
        english: 'Je pars le lundi. (I leave on Mondays.) - Every Monday',
        highlight: ['lundi', 'le lundi']
      }
    ],
    subsections: [
      {
        title: 'Specific vs Habitual',
        content: 'With or without article:',
        examples: [
          {
            spanish: 'Specific: mardi prochain (next Tuesday)',
            english: 'Habitual: le mardi (on Tuesdays)',
            highlight: ['mardi prochain', 'le mardi']
          }
        ]
      }
    ]
  },
  {
    title: 'Complex Time Expressions',
    content: `Combining multiple time prepositions:`,
    examples: [
      {
        spanish: 'Depuis lundi jusqu\'à vendredi. (From Monday until Friday.)',
        english: 'Entre 9 heures et midi. (Between 9 o\'clock and noon.)',
        highlight: ['Depuis lundi jusqu\'à vendredi', 'Entre 9 heures et midi']
      },
      {
        spanish: 'À partir de demain pour 3 semaines. (Starting tomorrow for 3 weeks.)',
        english: 'Pendant l\'été depuis 5 ans. (During summer for 5 years.)',
        highlight: ['À partir de demain pour 3 semaines', 'Pendant l\'été depuis 5 ans']
      }
    ]
  },
  {
    title: 'Common Mistakes with Time Prepositions',
    content: `Here are frequent errors students make:

**1. Wrong preposition choice**: Using English logic instead of French rules
**2. DANS vs EN confusion**: Mixing up future time vs time taken
**3. DEPUIS vs PENDANT**: Confusing ongoing vs completed duration
**4. Missing articles**: Forgetting le with habitual days`,
    examples: [
      {
        spanish: '❌ Je pars en 5 minutes → ✅ Je pars dans 5 minutes',
        english: 'Wrong: EN is for time taken, DANS is for future time',
        highlight: ['dans 5 minutes']
      },
      {
        spanish: '❌ J\'étudie pendant 2 ans → ✅ J\'étudie depuis 2 ans',
        english: 'Wrong: ongoing action needs DEPUIS, not PENDANT',
        highlight: ['depuis 2 ans']
      },
      {
        spanish: '❌ Je travaille mardi → ✅ Je travaille le mardi',
        english: 'Wrong: habitual action needs definite article',
        highlight: ['le mardi']
      },
      {
        spanish: '❌ en printemps → ✅ au printemps',
        english: 'Wrong: spring is the only season that uses AU',
        highlight: ['au printemps']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Time Expressions', url: '/grammar/french/expressions/time', difficulty: 'intermediate' },
  { title: 'French Basic Prepositions', url: '/grammar/french/prepositions/basic-prepositions', difficulty: 'beginner' },
  { title: 'French Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' },
  { title: 'French Past Tenses', url: '/grammar/french/verbs/passe-compose', difficulty: 'intermediate' }
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
              topic: 'prepositions-time',
              title: 'French Time Prepositions (À, En, Dans, Depuis, Pendant)',
              description: 'Master French time prepositions including à, en, dans, depuis, pendant. Learn to express when, how long, and duration in French.',
              difficulty: 'intermediate',
              examples: [
                'À huit heures (at eight o\'clock)',
                'En été (in summer)',
                'Dans une heure (in an hour)',
                'Depuis lundi (since Monday)',
                'Pendant deux heures (for two hours)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'prepositions',
              topic: 'prepositions-time',
              title: 'French Time Prepositions (À, En, Dans, Depuis, Pendant)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="prepositions"
        topic="prepositions-time"
        title="French Time Prepositions (À, En, Dans, Depuis, Pendant)"
        description="Master French time prepositions including à, en, dans, depuis, pendant. Learn to express when, how long, and duration in French"
        difficulty="intermediate"
        estimatedTime={16}
        sections={sections}
        backUrl="/grammar/french/prepositions"
        practiceUrl="/grammar/french/prepositions/prepositions-time/practice"
        quizUrl="/grammar/french/prepositions/prepositions-time/quiz"
        songUrl="/songs/fr?theme=grammar&topic=time-prepositions"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

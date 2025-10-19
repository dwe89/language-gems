import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'numbers',
  topic: 'dates-time',
  title: 'French Numbers, Dates, and Time Expressions',
  description: 'Master French numbers, dates, and time expressions including telling time, days, months, years, and temporal prepositions.',
  difficulty: 'intermediate',
  keywords: [
    'french numbers dates time',
    'french telling time',
    'french days months',
    'french years dates',
    'quelle heure french',
    'french time expressions'
  ],
  examples: [
    'Il est trois heures. (It\'s three o\'clock.)',
    'Nous sommes le 15 mai. (It\'s May 15th.)',
    'En 2024, je voyage. (In 2024, I travel.)',
    'Depuis deux ans... (For two years...)'
  ]
});

const sections = [
  {
    title: 'Understanding French Numbers, Dates, and Time',
    content: `French numbers, dates, and time expressions are **essential for daily communication** and follow specific patterns and rules.

**Key components:**
- **Time telling**: Il est... (It is...)
- **Dates**: Nous sommes le... (It is...)
- **Days and months**: lundi, janvier, etc.
- **Years**: en 2024, depuis 2020
- **Time prepositions**: à, en, dans, depuis, pendant

**Important characteristics:**
- **Gender and agreement**: Some numbers agree
- **Preposition usage**: Specific prepositions for time
- **Formal vs informal**: Different ways to express time
- **Cultural differences**: 24-hour clock common

These expressions are fundamental for scheduling, planning, and discussing temporal relationships in French.`,
    examples: [
      {
        spanish: 'Il est quinze heures trente. (It\'s 3:30 PM.)',
        english: '24-hour clock commonly used',
        highlight: ['Il est quinze heures trente']
      },
      {
        spanish: 'Nous sommes le mercredi 15 mai 2024. (It\'s Wednesday, May 15th, 2024.)',
        english: 'Complete date expression',
        highlight: ['Nous sommes le mercredi 15 mai 2024']
      },
      {
        spanish: 'Depuis trois ans, j\'habite ici. (For three years, I\'ve lived here.)',
        english: 'Duration with DEPUIS',
        highlight: ['Depuis trois ans']
      }
    ]
  },
  {
    title: 'Telling Time in French',
    content: `French time telling uses **IL EST** + time expression:`,
    conjugationTable: {
      title: 'Basic Time Expressions',
      conjugations: [
        { pronoun: 'Il est une heure', form: '1:00', english: 'It\'s one o\'clock (singular)' },
        { pronoun: 'Il est deux heures', form: '2:00', english: 'It\'s two o\'clock (plural)' },
        { pronoun: 'Il est midi', form: '12:00 PM', english: 'It\'s noon' },
        { pronoun: 'Il est minuit', form: '12:00 AM', english: 'It\'s midnight' },
        { pronoun: 'Il est trois heures et quart', form: '3:15', english: 'It\'s quarter past three' },
        { pronoun: 'Il est quatre heures et demie', form: '4:30', english: 'It\'s half past four' }
      ]
    },
    examples: [
      {
        spanish: 'Quelle heure est-il? (What time is it?)',
        english: 'Il est huit heures du matin. (It\'s 8 AM.)',
        highlight: ['Quelle heure est-il', 'Il est huit heures du matin']
      }
    ],
    subsections: [
      {
        title: 'Minutes Past the Hour',
        content: 'Adding minutes with ET:',
        examples: [
          {
            spanish: 'Il est deux heures cinq. (It\'s 2:05.)',
            english: 'Il est trois heures et quart. (It\'s 3:15.)',
            highlight: ['deux heures cinq', 'trois heures et quart']
          }
        ]
      },
      {
        title: 'Minutes Before the Hour',
        content: 'Using MOINS for minutes before:',
        examples: [
          {
            spanish: 'Il est trois heures moins cinq. (It\'s 2:55.)',
            english: 'Il est midi moins le quart. (It\'s 11:45.)',
            highlight: ['trois heures moins cinq', 'midi moins le quart']
          }
        ]
      }
    ]
  },
  {
    title: '24-Hour Clock (Official Time)',
    content: `French commonly uses **24-hour clock** for official times:`,
    conjugationTable: {
      title: '24-Hour Time Examples',
      conjugations: [
        { pronoun: 'Il est treize heures', form: '13:00', english: '1:00 PM' },
        { pronoun: 'Il est quinze heures trente', form: '15:30', english: '3:30 PM' },
        { pronoun: 'Il est dix-huit heures quarante-cinq', form: '18:45', english: '6:45 PM' },
        { pronoun: 'Il est vingt-deux heures', form: '22:00', english: '10:00 PM' },
        { pronoun: 'Il est zéro heure quinze', form: '00:15', english: '12:15 AM' }
      ]
    },
    examples: [
      {
        spanish: 'Le train part à seize heures. (The train leaves at 4 PM.)',
        english: 'Le film commence à vingt heures. (The movie starts at 8 PM.)',
        highlight: ['à seize heures', 'à vingt heures']
      }
    ]
  },
  {
    title: 'Days of the Week',
    content: `French days of the week are **masculine** and **not capitalized**:`,
    conjugationTable: {
      title: 'Days of the Week',
      conjugations: [
        { pronoun: 'lundi', form: 'Monday', english: 'Je travaille lundi. (I work Monday.)' },
        { pronoun: 'mardi', form: 'Tuesday', english: 'Mardi, j\'ai cours. (Tuesday, I have class.)' },
        { pronoun: 'mercredi', form: 'Wednesday', english: 'Mercredi soir... (Wednesday evening...)' },
        { pronoun: 'jeudi', form: 'Thursday', english: 'Jeudi matin... (Thursday morning...)' },
        { pronoun: 'vendredi', form: 'Friday', english: 'Vendredi après-midi... (Friday afternoon...)' },
        { pronoun: 'samedi', form: 'Saturday', english: 'Samedi, nous sortons. (Saturday, we go out.)' },
        { pronoun: 'dimanche', form: 'Sunday', english: 'Dimanche, je me repose. (Sunday, I rest.)' }
      ]
    },
    subsections: [
      {
        title: 'Specific Day vs Regular Occurrence',
        content: 'With or without LE:',
        examples: [
          {
            spanish: 'lundi = next Monday (specific)',
            english: 'le lundi = on Mondays (regular)',
            highlight: ['lundi', 'le lundi']
          }
        ]
      }
    ]
  },
  {
    title: 'Months of the Year',
    content: `French months are **masculine** and **not capitalized**:`,
    conjugationTable: {
      title: 'Months of the Year',
      conjugations: [
        { pronoun: 'janvier', form: 'January', english: 'en janvier (in January)' },
        { pronoun: 'février', form: 'February', english: 'en février (in February)' },
        { pronoun: 'mars', form: 'March', english: 'en mars (in March)' },
        { pronoun: 'avril', form: 'April', english: 'en avril (in April)' },
        { pronoun: 'mai', form: 'May', english: 'en mai (in May)' },
        { pronoun: 'juin', form: 'June', english: 'en juin (in June)' },
        { pronoun: 'juillet', form: 'July', english: 'en juillet (in July)' },
        { pronoun: 'août', form: 'August', english: 'en août (in August)' },
        { pronoun: 'septembre', form: 'September', english: 'en septembre (in September)' },
        { pronoun: 'octobre', form: 'October', english: 'en octobre (in October)' },
        { pronoun: 'novembre', form: 'November', english: 'en novembre (in November)' },
        { pronoun: 'décembre', form: 'December', english: 'en décembre (in December)' }
      ]
    }
  },
  {
    title: 'Expressing Dates',
    content: `French dates follow the pattern: **LE + number + month + year**:`,
    examples: [
      {
        spanish: 'Nous sommes le 15 mai 2024. (It\'s May 15th, 2024.)',
        english: 'Je suis né le 3 juin 1990. (I was born on June 3rd, 1990.)',
        highlight: ['le 15 mai 2024', 'le 3 juin 1990']
      },
      {
        spanish: 'Quelle est la date aujourd\'hui? (What\'s the date today?)',
        english: 'C\'est le premier janvier. (It\'s January 1st.)',
        highlight: ['Quelle est la date', 'le premier janvier']
      }
    ],
    subsections: [
      {
        title: 'First of the Month',
        content: 'Use PREMIER for the 1st:',
        examples: [
          {
            spanish: 'le premier mai (May 1st)',
            english: 'le premier janvier (January 1st)',
            highlight: ['le premier mai', 'le premier janvier']
          }
        ]
      },
      {
        title: 'Other Dates',
        content: 'Use cardinal numbers for other dates:',
        examples: [
          {
            spanish: 'le deux mars (March 2nd)',
            english: 'le vingt-cinq décembre (December 25th)',
            highlight: ['le deux mars', 'le vingt-cinq décembre']
          }
        ]
      }
    ]
  },
  {
    title: 'Years and Centuries',
    content: `Expressing years and longer time periods:`,
    examples: [
      {
        spanish: 'En 2024, je voyage. (In 2024, I travel.)',
        english: 'Au vingtième siècle... (In the 20th century...)',
        highlight: ['En 2024', 'Au vingtième siècle']
      },
      {
        spanish: 'L\'an 2000 (The year 2000)',
        english: 'Dans les années 90 (In the 90s)',
        highlight: ['L\'an 2000', 'Dans les années 90']
      }
    ],
    subsections: [
      {
        title: 'Year Expressions',
        content: 'Different ways to express years:',
        examples: [
          {
            spanish: 'en 2024 = in 2024',
            english: 'l\'année 2024 = the year 2024',
            highlight: ['en 2024', 'l\'année 2024']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Prepositions',
    content: `Essential prepositions for time expressions:`,
    conjugationTable: {
      title: 'Time Prepositions',
      conjugations: [
        { pronoun: 'à', form: 'at (time)', english: 'à trois heures (at three o\'clock)' },
        { pronoun: 'en', form: 'in (month/year)', english: 'en mai, en 2024 (in May, in 2024)' },
        { pronoun: 'dans', form: 'in (future)', english: 'dans deux heures (in two hours)' },
        { pronoun: 'depuis', form: 'since/for', english: 'depuis lundi (since Monday)' },
        { pronoun: 'pendant', form: 'during/for', english: 'pendant deux heures (for two hours)' },
        { pronoun: 'vers', form: 'around (time)', english: 'vers midi (around noon)' }
      ]
    },
    examples: [
      {
        spanish: 'Je pars à huit heures. (I leave at eight o\'clock.)',
        english: 'Nous voyageons en juillet. (We travel in July.)',
        highlight: ['à huit heures', 'en juillet']
      }
    ]
  },
  {
    title: 'Duration Expressions',
    content: `Expressing **how long** something lasts or has been happening:`,
    examples: [
      {
        spanish: 'Depuis trois ans, j\'habite ici. (For three years, I\'ve lived here.)',
        english: 'Pendant deux heures, nous avons étudié. (For two hours, we studied.)',
        highlight: ['Depuis trois ans', 'Pendant deux heures']
      },
      {
        spanish: 'Il y a une semaine... (A week ago...)',
        english: 'Dans une heure... (In an hour...)',
        highlight: ['Il y a une semaine', 'Dans une heure']
      }
    ],
    subsections: [
      {
        title: 'DEPUIS vs PENDANT',
        content: 'Different duration meanings:',
        examples: [
          {
            spanish: 'DEPUIS = ongoing duration (still happening)',
            english: 'PENDANT = completed duration (finished)',
            highlight: ['DEPUIS', 'PENDANT']
          }
        ]
      },
      {
        title: 'IL Y A vs DANS',
        content: 'Past vs future time reference:',
        examples: [
          {
            spanish: 'IL Y A = ago (past)',
            english: 'DANS = in (future)',
            highlight: ['IL Y A', 'DANS']
          }
        ]
      }
    ]
  },
  {
    title: 'Seasons and Parts of Day',
    content: `Time periods and their prepositions:`,
    conjugationTable: {
      title: 'Seasons and Day Parts',
      conjugations: [
        { pronoun: 'le printemps', form: 'spring', english: 'au printemps (in spring)' },
        { pronoun: 'l\'été', form: 'summer', english: 'en été (in summer)' },
        { pronoun: 'l\'automne', form: 'autumn', english: 'en automne (in autumn)' },
        { pronoun: 'l\'hiver', form: 'winter', english: 'en hiver (in winter)' },
        { pronoun: 'le matin', form: 'morning', english: 'le matin (in the morning)' },
        { pronoun: 'l\'après-midi', form: 'afternoon', english: 'l\'après-midi (in the afternoon)' },
        { pronoun: 'le soir', form: 'evening', english: 'le soir (in the evening)' },
        { pronoun: 'la nuit', form: 'night', english: 'la nuit (at night)' }
      ]
    }
  },
  {
    title: 'Age Expressions',
    content: `Expressing age using **AVOIR**:`,
    examples: [
      {
        spanish: 'J\'ai vingt ans. (I am twenty years old.)',
        english: 'Quel âge as-tu? (How old are you?)',
        highlight: ['J\'ai vingt ans', 'Quel âge as-tu']
      },
      {
        spanish: 'Il a trente-cinq ans. (He is thirty-five years old.)',
        english: 'Elle aura quarante ans demain. (She will be forty tomorrow.)',
        highlight: ['Il a trente-cinq ans', 'Elle aura quarante ans']
      }
    ]
  },
  {
    title: 'Frequency Expressions',
    content: `Expressing **how often** something happens:`,
    examples: [
      {
        spanish: 'une fois par semaine (once a week)',
        english: 'deux fois par mois (twice a month)',
        highlight: ['une fois par semaine', 'deux fois par mois']
      },
      {
        spanish: 'tous les jours (every day)',
        english: 'chaque année (every year)',
        highlight: ['tous les jours', 'chaque année']
      }
    ]
  },
  {
    title: 'Common Time Expressions',
    content: `Useful phrases for time reference:`,
    examples: [
      {
        spanish: 'à l\'heure (on time), en retard (late)',
        english: 'en avance (early), à temps (in time)',
        highlight: ['à l\'heure', 'en retard', 'en avance']
      },
      {
        spanish: 'de temps en temps (from time to time)',
        english: 'tout le temps (all the time)',
        highlight: ['de temps en temps', 'tout le temps']
      }
    ]
  },
  {
    title: 'Common Mistakes with Time Expressions',
    content: `Here are frequent errors students make:

**1. Wrong prepositions**: Using incorrect prepositions with time
**2. Capitalization**: Capitalizing days and months
**3. Agreement errors**: Wrong number agreement with time
**4. Confusion**: Mixing up DEPUIS, PENDANT, IL Y A, DANS`,
    examples: [
      {
        spanish: '❌ à Mai → ✅ en mai',
        english: 'Wrong: use EN with months',
        highlight: ['en mai']
      },
      {
        spanish: '❌ Lundi → ✅ lundi',
        english: 'Wrong: days are not capitalized in French',
        highlight: ['lundi']
      },
      {
        spanish: '❌ Il est une heures → ✅ Il est une heure',
        english: 'Wrong: "une heure" is singular',
        highlight: ['Il est une heure']
      },
      {
        spanish: '❌ Pendant trois ans, j\'habite → ✅ Depuis trois ans, j\'habite',
        english: 'Wrong: use DEPUIS for ongoing duration',
        highlight: ['Depuis trois ans, j\'habite']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Cardinal Numbers', url: '/grammar/french/numbers/cardinal', difficulty: 'beginner' },
  { title: 'French Ordinal Numbers', url: '/grammar/french/numbers/ordinal', difficulty: 'beginner' },
  { title: 'French Prepositions of Time', url: '/grammar/french/prepositions/prepositions-time', difficulty: 'intermediate' },
  { title: 'French Time Adverbs', url: '/grammar/french/adverbs/time-place', difficulty: 'beginner' }
];

export default function FrenchDatesTimePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'numbers',
              topic: 'dates-time',
              title: 'French Numbers, Dates, and Time Expressions',
              description: 'Master French numbers, dates, and time expressions including telling time, days, months, years, and temporal prepositions.',
              difficulty: 'intermediate',
              examples: [
                'Il est trois heures. (It\'s three o\'clock.)',
                'Nous sommes le 15 mai. (It\'s May 15th.)',
                'En 2024, je voyage. (In 2024, I travel.)',
                'Depuis deux ans... (For two years...)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'numbers',
              topic: 'dates-time',
              title: 'French Numbers, Dates, and Time Expressions'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="numbers"
        topic="dates-time"
        title="French Numbers, Dates, and Time Expressions"
        description="Master French numbers, dates, and time expressions including telling time, days, months, years, and temporal prepositions"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/french/numbers"
        practiceUrl="/grammar/french/numbers/dates-time/practice"
        quizUrl="/grammar/french/numbers/dates-time/quiz"
        songUrl="/songs/fr?theme=grammar&topic=dates-time"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

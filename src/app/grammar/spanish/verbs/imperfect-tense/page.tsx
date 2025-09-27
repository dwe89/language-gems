import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'imperfect-tense',
  title: 'Spanish Imperfect Tense (Past Continuous, Habitual Actions, Descriptions)',
  description: 'Master Spanish imperfect tense including formation, uses for ongoing past actions, habitual actions, descriptions, and imperfect vs preterite.',
  difficulty: 'intermediate',
  keywords: [
    'spanish imperfect tense',
    'imperfecto spanish',
    'past continuous spanish',
    'habitual past spanish',
    'imperfect vs preterite',
    'spanish past tense'
  ],
  examples: [
    'Yo hablaba español. (I was speaking Spanish.)',
    'Ella comía cuando llegué. (She was eating when I arrived.)',
    'Nosotros vivíamos en Madrid. (We used to live in Madrid.)',
    'Era un día hermoso. (It was a beautiful day.)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Imperfect Tense',
    content: `The Spanish imperfect tense (pretérito imperfecto) describes **ongoing past actions**, **habitual past actions**, **descriptions in the past**, and **background information**. It's equivalent to English "was/were + -ing" or "used to."

**Uses of Spanish imperfect:**
- **Ongoing past actions**: Hablaba por teléfono (I was talking on the phone)
- **Habitual past actions**: Iba al colegio todos los días (I used to go to school every day)
- **Descriptions**: Era alto y moreno (He was tall and dark)
- **Background information**: Llovía cuando salí (It was raining when I left)
- **Time and age**: Eran las tres, tenía diez años (It was three o'clock, I was ten years old)

**Formation patterns:**
- **-AR verbs**: Remove -ar, add -aba, -abas, -aba, -ábamos, -abais, -aban
- **-ER/-IR verbs**: Remove -er/-ir, add -ía, -ías, -ía, -íamos, -íais, -ían

**Key characteristics:**
- **Very regular**: Only 3 irregular verbs (ser, ir, ver)
- **Descriptive**: Sets the scene for past events
- **Continuous**: Actions without defined endpoints
- **Habitual**: Repeated actions in the past

The imperfect is essential for **storytelling**, **describing past situations**, and **expressing what used to happen**.`,
    examples: [
      {
        spanish: 'Cuando era niño, jugaba fútbol todos los días. (When I was a child, I used to play soccer every day.)',
        english: 'Habitual past action with time reference',
        highlight: ['era', 'jugaba']
      },
      {
        spanish: 'Mientras estudiaba, sonó el teléfono. (While I was studying, the phone rang.)',
        english: 'Ongoing action interrupted by completed action',
        highlight: ['estudiaba', 'sonó']
      },
      {
        spanish: 'La casa era grande y tenía un jardín hermoso. (The house was big and had a beautiful garden.)',
        english: 'Description of past states and characteristics',
        highlight: ['era', 'tenía']
      }
    ]
  },
  {
    title: 'Formation: Regular -AR Verbs',
    content: `**-AR verbs** in the imperfect follow a **consistent pattern**:`,
    conjugationTable: {
      title: 'HABLAR (to speak) - Imperfect Tense',
      conjugations: [
        { pronoun: 'yo', form: 'hablaba', english: 'I was speaking / I used to speak' },
        { pronoun: 'tú', form: 'hablabas', english: 'you were speaking / you used to speak' },
        { pronoun: 'él/ella/usted', form: 'hablaba', english: 'he/she was speaking / you were speaking (formal)' },
        { pronoun: 'nosotros/nosotras', form: 'hablábamos', english: 'we were speaking / we used to speak' },
        { pronoun: 'vosotros/vosotras', form: 'hablabais', english: 'you all were speaking / you all used to speak (Spain)' },
        { pronoun: 'ellos/ellas/ustedes', form: 'hablaban', english: 'they were speaking / they used to speak' }
      ]
    },
    examples: [
      {
        spanish: 'Yo trabajaba en una oficina. (I used to work in an office.)',
        english: 'Tú estudiabas medicina. (You were studying medicine.)',
        highlight: ['trabajaba', 'estudiabas']
      },
      {
        spanish: 'Ella caminaba por el parque. (She was walking through the park.)',
        english: 'Nosotros bailábamos salsa. (We used to dance salsa.)',
        highlight: ['caminaba', 'bailábamos']
      }
    ],
    subsections: [
      {
        title: 'Pattern for All -AR Verbs',
        content: 'Remove -ar, add imperfect endings:',
        examples: [
          {
            spanish: 'caminar → caminaba, caminabas, caminaba...',
            english: 'estudiar → estudiaba, estudiabas, estudiaba...',
            highlight: ['caminaba', 'estudiaba']
          }
        ]
      },
      {
        title: 'Stress Pattern',
        content: 'Note accent on nosotros form:',
        examples: [
          {
            spanish: 'hablábamos (we were speaking)',
            english: 'Only nosotros form has written accent',
            highlight: ['hablábamos']
          }
        ]
      }
    ]
  },
  {
    title: 'Formation: Regular -ER and -IR Verbs',
    content: `**-ER and -IR verbs** share the **same imperfect endings**:`,
    conjugationTable: {
      title: 'COMER (to eat) and VIVIR (to live) - Imperfect Tense',
      conjugations: [
        { pronoun: 'yo', form: 'comía / vivía', english: 'I was eating/living / I used to eat/live' },
        { pronoun: 'tú', form: 'comías / vivías', english: 'you were eating/living / you used to eat/live' },
        { pronoun: 'él/ella/usted', form: 'comía / vivía', english: 'he/she was eating/living / you were eating/living (formal)' },
        { pronoun: 'nosotros/nosotras', form: 'comíamos / vivíamos', english: 'we were eating/living / we used to eat/live' },
        { pronoun: 'vosotros/vosotras', form: 'comíais / vivíais', english: 'you all were eating/living / you all used to eat/live (Spain)' },
        { pronoun: 'ellos/ellas/ustedes', form: 'comían / vivían', english: 'they were eating/living / they used to eat/live' }
      ]
    },
    examples: [
      {
        spanish: 'Yo bebía café todas las mañanas. (I used to drink coffee every morning.)',
        english: 'Tú escribías cartas a tu familia. (You used to write letters to your family.)',
        highlight: ['bebía', 'escribías']
      },
      {
        spanish: 'Él leía el periódico. (He was reading the newspaper.)',
        english: 'Nosotros recibíamos muchas visitas. (We used to receive many visitors.)',
        highlight: ['leía', 'recibíamos']
      }
    ],
    subsections: [
      {
        title: 'Identical Patterns',
        content: '-ER and -IR verbs use same endings:',
        examples: [
          {
            spanish: 'beber → bebía, bebías, bebía...',
            english: 'escribir → escribía, escribías, escribía...',
            highlight: ['bebía', 'escribía']
          }
        ]
      },
      {
        title: 'All Forms Have Accents',
        content: 'Every form has written accent on í:',
        examples: [
          {
            spanish: 'comía, comías, comía, comíamos, comíais, comían',
            english: 'Accent distinguishes from present tense',
            highlight: ['comía, comías, comía']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Verbs in Imperfect',
    content: `Only **three verbs** are irregular in the imperfect tense:`,
    conjugationTable: {
      title: 'Irregular Imperfect Verbs',
      conjugations: [
        { pronoun: 'SER (to be)', form: 'era, eras, era, éramos, erais, eran', english: 'Era profesor. (I was a teacher.)' },
        { pronoun: 'IR (to go)', form: 'iba, ibas, iba, íbamos, ibais, iban', english: 'Iba al colegio. (I used to go to school.)' },
        { pronoun: 'VER (to see)', form: 'veía, veías, veía, veíamos, veíais, veían', english: 'Veía la televisión. (I used to watch TV.)' }
      ]
    },
    examples: [
      {
        spanish: 'Cuando era joven, iba a la playa todos los veranos. (When I was young, I used to go to the beach every summer.)',
        english: 'Combination of SER and IR in imperfect',
        highlight: ['era', 'iba']
      },
      {
        spanish: 'Veíamos películas los sábados. (We used to watch movies on Saturdays.)',
        english: 'VER in imperfect for habitual action',
        highlight: ['Veíamos']
      }
    ],
    subsections: [
      {
        title: 'SER - Descriptions and Identity',
        content: 'Past states and characteristics:',
        examples: [
          {
            spanish: 'Era alto y delgado. (He was tall and thin.)',
            english: 'Éramos muy buenos amigos. (We were very good friends.)',
            highlight: ['Era', 'Éramos']
          }
        ]
      },
      {
        title: 'IR - Habitual Movement',
        content: 'Regular destinations in the past:',
        examples: [
          {
            spanish: 'Íbamos al parque los domingos. (We used to go to the park on Sundays.)',
            english: 'Iba a trabajar en autobús. (I used to go to work by bus.)',
            highlight: ['Íbamos', 'Iba']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses of the Imperfect Tense',
    content: `**Specific uses** of the Spanish imperfect:`,
    examples: [
      {
        spanish: 'Habitual actions: Todos los días desayunaba a las ocho. (Every day I used to have breakfast at eight.)',
        english: 'Ongoing actions: Mientras cocinaba, escuchaba música. (While I was cooking, I listened to music.)',
        highlight: ['desayunaba', 'cocinaba', 'escuchaba']
      },
      {
        spanish: 'Descriptions: La casa era blanca y tenía un jardín grande. (The house was white and had a big garden.)',
        english: 'Time and age: Eran las cinco y tenía veinte años. (It was five o\'clock and I was twenty years old.)',
        highlight: ['era', 'tenía', 'Eran', 'tenía']
      }
    ],
    subsections: [
      {
        title: 'Habitual Actions',
        content: 'Repeated actions in the past:',
        examples: [
          {
            spanish: 'Siempre llegaba tarde. (He always used to arrive late.)',
            english: 'Cada verano visitábamos a los abuelos. (Every summer we used to visit our grandparents.)',
            highlight: ['llegaba', 'visitábamos']
          }
        ]
      },
      {
        title: 'Ongoing Actions',
        content: 'Actions in progress in the past:',
        examples: [
          {
            spanish: 'Llovía cuando salimos. (It was raining when we left.)',
            english: 'Estudiaba cuando me llamaste. (I was studying when you called me.)',
            highlight: ['Llovía', 'Estudiaba']
          }
        ]
      },
      {
        title: 'Descriptions and States',
        content: 'Physical and emotional descriptions:',
        examples: [
          {
            spanish: 'Estaba cansado y tenía hambre. (I was tired and hungry.)',
            english: 'La ciudad era muy bonita. (The city was very beautiful.)',
            highlight: ['Estaba', 'tenía', 'era']
          }
        ]
      }
    ]
  },
  {
    title: 'Imperfect vs Preterite',
    content: `**Key differences** between imperfect and preterite:`,
    conjugationTable: {
      title: 'Imperfect vs Preterite Usage',
      conjugations: [
        { pronoun: 'Imperfect', form: 'Ongoing/Habitual', english: 'Estudiaba español. (I was studying/used to study Spanish.)' },
        { pronoun: 'Preterite', form: 'Completed', english: 'Estudié español. (I studied Spanish - completed action.)' },
        { pronoun: 'Imperfect', form: 'Background', english: 'Llovía cuando llegué. (It was raining when I arrived.)' },
        { pronoun: 'Preterite', form: 'Main events', english: 'Llegué a las tres. (I arrived at three.)' }
      ]
    },
    examples: [
      {
        spanish: 'Mientras caminaba por la calle, vi a mi amigo. (While I was walking down the street, I saw my friend.)',
        english: 'Imperfect for ongoing action, preterite for completed action',
        highlight: ['caminaba', 'vi']
      },
      {
        spanish: 'Todos los días comía en casa, pero ayer comí en un restaurante. (Every day I used to eat at home, but yesterday I ate at a restaurant.)',
        english: 'Imperfect for habitual action, preterite for specific event',
        highlight: ['comía', 'comí']
      }
    ]
  },
  {
    title: 'Time Expressions with Imperfect',
    content: `**Common time expressions** that trigger imperfect:`,
    examples: [
      {
        spanish: 'Siempre: Siempre llegaba temprano. (He always used to arrive early.)',
        english: 'Todos los días: Todos los días estudiaba. (Every day I used to study.)',
        highlight: ['Siempre llegaba', 'Todos los días estudiaba']
      },
      {
        spanish: 'Mientras: Mientras dormía, sonó el teléfono. (While I was sleeping, the phone rang.)',
        english: 'Cuando era niño: Cuando era niño, vivía en México. (When I was a child, I lived in Mexico.)',
        highlight: ['Mientras dormía', 'Cuando era niño, vivía']
      }
    ],
    subsections: [
      {
        title: 'Frequency Expressions',
        content: 'Expressions indicating repetition:',
        examples: [
          {
            spanish: 'frecuentemente, a menudo, cada día',
            english: 'generalmente, normalmente, de vez en cuando',
            highlight: ['frecuentemente', 'generalmente']
          }
        ]
      },
      {
        title: 'Time Frame Expressions',
        content: 'Expressions setting past time context:',
        examples: [
          {
            spanish: 'en aquella época, en esos días, antes',
            english: 'durante mi infancia, mientras tanto',
            highlight: ['en aquella época', 'durante mi infancia']
          }
        ]
      }
    ]
  },
  {
    title: 'Imperfect for Politeness',
    content: `**Imperfect for polite requests** and softened statements:`,
    examples: [
      {
        spanish: 'Quería pedirle un favor. (I wanted to ask you a favor.)',
        english: 'More polite than "Quiero pedirle un favor"',
        highlight: ['Quería pedirle']
      },
      {
        spanish: '¿Podía ayudarme? (Could you help me?)',
        english: 'Softer than "¿Puede ayudarme?"',
        highlight: ['Podía ayudarme']
      }
    ]
  },
  {
    title: 'Storytelling with Imperfect',
    content: `**Using imperfect in narratives** to set the scene:`,
    examples: [
      {
        spanish: 'Era una noche oscura. Llovía mucho y hacía frío. La casa estaba vacía y silenciosa. (It was a dark night. It was raining heavily and it was cold. The house was empty and silent.)',
        english: 'Setting the scene with descriptive imperfect',
        highlight: ['Era', 'Llovía', 'hacía', 'estaba']
      },
      {
        spanish: 'Cuando tenía diez años, vivía con mis abuelos. Ellos tenían una casa grande en el campo. (When I was ten years old, I lived with my grandparents. They had a big house in the countryside.)',
        english: 'Background information for a story',
        highlight: ['tenía', 'vivía', 'tenían']
      }
    ]
  },
  {
    title: 'Common Mistakes with Imperfect',
    content: `Here are frequent errors students make:

**1. Imperfect vs preterite confusion**: Using wrong tense for context
**2. Missing accents**: Forgetting written accents on -ER/-IR verbs
**3. Wrong endings**: Mixing up -AR and -ER/-IR endings
**4. Irregular verb errors**: Using regular patterns for ser, ir, ver`,
    examples: [
      {
        spanish: '❌ Ayer comía en casa → ✅ Ayer comí en casa',
        english: 'Wrong: specific completed action needs preterite',
        highlight: ['Ayer comí en casa']
      },
      {
        spanish: '❌ Vivia en Madrid → ✅ Vivía en Madrid',
        english: 'Wrong: missing accent on imperfect -ER/-IR verbs',
        highlight: ['Vivía']
      },
      {
        spanish: '❌ Yo hablía → ✅ Yo hablaba',
        english: 'Wrong: -AR verbs use -aba endings, not -ía',
        highlight: ['Yo hablaba']
      },
      {
        spanish: '❌ Yo ería → ✅ Yo era',
        english: 'Wrong: SER is irregular in imperfect',
        highlight: ['Yo era']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Preterite Tense', url: '/grammar/spanish/verbs/preterite', difficulty: 'intermediate' },
  { title: 'Spanish Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Spanish Past Tenses Comparison', url: '/grammar/spanish/verbs/past-tenses', difficulty: 'intermediate' },
  { title: 'Spanish Storytelling', url: '/grammar/spanish/syntax/storytelling', difficulty: 'intermediate' }
];

export default function SpanishImperfectTensePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'imperfect-tense',
              title: 'Spanish Imperfect Tense (Past Continuous, Habitual Actions, Descriptions)',
              description: 'Master Spanish imperfect tense including formation, uses for ongoing past actions, habitual actions, descriptions, and imperfect vs preterite.',
              difficulty: 'intermediate',
              examples: [
                'Yo hablaba español. (I was speaking Spanish.)',
                'Ella comía cuando llegué. (She was eating when I arrived.)',
                'Nosotros vivíamos en Madrid. (We used to live in Madrid.)',
                'Era un día hermoso. (It was a beautiful day.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'imperfect-tense',
              title: 'Spanish Imperfect Tense (Past Continuous, Habitual Actions, Descriptions)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="imperfect-tense"
        title="Spanish Imperfect Tense (Past Continuous, Habitual Actions, Descriptions)"
        description="Master Spanish imperfect tense including formation, uses for ongoing past actions, habitual actions, descriptions, and imperfect vs preterite"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/imperfect-tense/practice"
        quizUrl="/grammar/spanish/verbs/imperfect-tense/quiz"
        songUrl="/songs/es?theme=grammar&topic=imperfect-tense"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}

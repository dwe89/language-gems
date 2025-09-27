import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'imperfect',
  title: 'Spanish Imperfect Tense',
  description: 'Master Spanish imperfect tense conjugations for ongoing and habitual past actions. Learn regular and irregular patterns with examples.',
  difficulty: 'intermediate',
  keywords: [
    'spanish imperfect tense',
    'pretérito imperfecto',
    'spanish past tense',
    'imperfect conjugation',
    'spanish grammar',
    'habitual past actions',
    'ongoing past actions'
  ],
  examples: [
    'Cuando era niño, jugaba fútbol (When I was a child, I used to play soccer)',
    'Mientras estudiaba, sonó el teléfono (While I was studying, the phone rang)',
    'La casa era grande y tenía jardín (The house was big and had a garden)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Imperfect Tense?',
    content: `The Spanish imperfect tense (**pretérito imperfecto**) describes ongoing, habitual, or repeated actions in the past. Unlike the preterite tense, which focuses on completed actions, the imperfect sets the scene and provides background information about past events.

The imperfect is essential for storytelling, describing past habits, and expressing what was happening when something else occurred. It's equivalent to "was/were + -ing" or "used to" in English.`,
    examples: [
      {
        spanish: 'Cuando era niño, jugaba fútbol todos los días.',
        english: 'When I was a child, I used to play soccer every day.',
        highlight: ['era', 'jugaba']
      },
      {
        spanish: 'Mientras estudiaba, sonó el teléfono.',
        english: 'While I was studying, the phone rang.',
        highlight: ['estudiaba']
      },
      {
        spanish: 'La casa era grande y tenía un jardín hermoso.',
        english: 'The house was big and had a beautiful garden.',
        highlight: ['era', 'tenía']
      }
    ]
  },
  {
    title: 'Regular Imperfect Conjugations',
    content: `The imperfect tense has very regular conjugation patterns. There are only three irregular verbs in the imperfect tense, making it one of the easiest tenses to learn in Spanish.`,
    subsections: [
      {
        title: '-AR Verbs (like hablar - to speak)',
        content: `**-AR verbs** in the imperfect tense follow a consistent pattern. Remove the **-ar** ending and add the imperfect endings:`,
        conjugationTable: {
          title: 'AR Verb Imperfect Endings',
          conjugations: [
            { pronoun: 'yo', form: '-aba', english: 'I was speaking/used to speak' },
            { pronoun: 'tú', form: '-abas', english: 'you were speaking/used to speak' },
            { pronoun: 'él/ella/usted', form: '-aba', english: 'he/she was speaking, you were speaking' },
            { pronoun: 'nosotros/nosotras', form: '-ábamos', english: 'we were speaking/used to speak' },
            { pronoun: 'vosotros/vosotras', form: '-abais', english: 'you all were speaking/used to speak' },
            { pronoun: 'ellos/ellas/ustedes', form: '-aban', english: 'they were speaking, you all were speaking' }
          ]
        },
        examples: [
          {
            spanish: 'Yo hablaba con mi abuela cada domingo.',
            english: 'I used to talk with my grandmother every Sunday.',
            highlight: ['hablaba']
          },
          {
            spanish: 'Tú caminabas muy despacio.',
            english: 'You were walking very slowly.',
            highlight: ['caminabas']
          },
          {
            spanish: 'Nosotros estudiábamos juntos.',
            english: 'We used to study together.',
            highlight: ['estudiábamos']
          }
        ]
      },
      {
        title: '-ER and -IR Verbs (like comer/vivir)',
        content: `**-ER and -IR verbs** share the same endings in the imperfect tense. Remove the **-er** or **-ir** ending and add:`,
        conjugationTable: {
          title: 'ER/IR Verb Imperfect Endings',
          conjugations: [
            { pronoun: 'yo', form: '-ía', english: 'I was eating/living' },
            { pronoun: 'tú', form: '-ías', english: 'you were eating/living' },
            { pronoun: 'él/ella/usted', form: '-ía', english: 'he/she was eating/living' },
            { pronoun: 'nosotros/nosotras', form: '-íamos', english: 'we were eating/living' },
            { pronoun: 'vosotros/vosotras', form: '-íais', english: 'you all were eating/living' },
            { pronoun: 'ellos/ellas/ustedes', form: '-ían', english: 'they were eating/living' }
          ]
        },
        examples: [
          {
            spanish: 'Yo comía frutas todos los días.',
            english: 'I used to eat fruits every day.',
            highlight: ['comía']
          },
          {
            spanish: 'Ella vivía en Barcelona.',
            english: 'She used to live in Barcelona.',
            highlight: ['vivía']
          },
          {
            spanish: 'Ellos escribían cartas a menudo.',
            english: 'They used to write letters often.',
            highlight: ['escribían']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Verbs in the Imperfect',
    content: `There are only **three irregular verbs** in the Spanish imperfect tense. These must be memorized as they don't follow the regular patterns.`,
    subsections: [
      {
        title: 'Ser (to be) - Permanent States',
        content: `**Ser** in the imperfect describes what someone or something was like in the past:`,
        conjugationTable: {
          title: 'Ser Imperfect Conjugation',
          conjugations: [
            { pronoun: 'yo', form: 'era', english: 'I was' },
            { pronoun: 'tú', form: 'eras', english: 'you were' },
            { pronoun: 'él/ella/usted', form: 'era', english: 'he/she was, you were' },
            { pronoun: 'nosotros/nosotras', form: 'éramos', english: 'we were' },
            { pronoun: 'vosotros/vosotras', form: 'erais', english: 'you all were' },
            { pronoun: 'ellos/ellas/ustedes', form: 'eran', english: 'they were, you all were' }
          ]
        },
        examples: [
          {
            spanish: 'Yo era muy tímido cuando era niño.',
            english: 'I was very shy when I was a child.',
            highlight: ['era']
          },
          {
            spanish: 'Ella era la mejor estudiante.',
            english: 'She was the best student.',
            highlight: ['era']
          }
        ]
      },
      {
        title: 'Ir (to go)',
        content: `**Ir** in the imperfect describes where someone used to go or was going:`,
        conjugationTable: {
          title: 'Ir Imperfect Conjugation',
          conjugations: [
            { pronoun: 'yo', form: 'iba', english: 'I was going/used to go' },
            { pronoun: 'tú', form: 'ibas', english: 'you were going/used to go' },
            { pronoun: 'él/ella/usted', form: 'iba', english: 'he/she was going, you were going' },
            { pronoun: 'nosotros/nosotras', form: 'íbamos', english: 'we were going/used to go' },
            { pronoun: 'vosotros/vosotras', form: 'ibais', english: 'you all were going/used to go' },
            { pronoun: 'ellos/ellas/ustedes', form: 'iban', english: 'they were going, you all were going' }
          ]
        },
        examples: [
          {
            spanish: 'Yo iba al parque cada tarde.',
            english: 'I used to go to the park every afternoon.',
            highlight: ['iba']
          },
          {
            spanish: 'Ellos iban a la escuela juntos.',
            english: 'They used to go to school together.',
            highlight: ['iban']
          }
        ]
      },
      {
        title: 'Ver (to see)',
        content: `**Ver** in the imperfect describes what someone used to see or was seeing:`,
        conjugationTable: {
          title: 'Ver Imperfect Conjugation',
          conjugations: [
            { pronoun: 'yo', form: 'veía', english: 'I was seeing/used to see' },
            { pronoun: 'tú', form: 'veías', english: 'you were seeing/used to see' },
            { pronoun: 'él/ella/usted', form: 'veía', english: 'he/she was seeing, you were seeing' },
            { pronoun: 'nosotros/nosotras', form: 'veíamos', english: 'we were seeing/used to see' },
            { pronoun: 'vosotros/vosotras', form: 'veíais', english: 'you all were seeing/used to see' },
            { pronoun: 'ellos/ellas/ustedes', form: 'veían', english: 'they were seeing, you all were seeing' }
          ]
        },
        examples: [
          {
            spanish: 'Yo veía televisión todas las noches.',
            english: 'I used to watch television every night.',
            highlight: ['veía']
          },
          {
            spanish: 'Nosotros veíamos las estrellas desde el jardín.',
            english: 'We used to see the stars from the garden.',
            highlight: ['veíamos']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use the Imperfect Tense',
    content: `The Spanish imperfect tense is used in specific situations that differ from the preterite tense:

**1. Habitual or repeated actions**: Things that happened regularly in the past
**2. Ongoing actions**: Actions that were in progress (background actions)
**3. Descriptions**: Physical descriptions, mental states, weather, time
**4. Age**: Expressing someone's age in the past
**5. Setting the scene**: Providing context for other past actions`,
    examples: [
      {
        spanish: 'Todos los veranos íbamos a la playa.',
        english: 'Every summer we used to go to the beach. (habitual)',
        highlight: ['íbamos']
      },
      {
        spanish: 'Mientras cocinaba, llegaron los invitados.',
        english: 'While I was cooking, the guests arrived. (ongoing)',
        highlight: ['cocinaba']
      },
      {
        spanish: 'La casa era blanca y tenía flores.',
        english: 'The house was white and had flowers. (description)',
        highlight: ['era', 'tenía']
      },
      {
        spanish: 'Cuando tenía diez años, vivía en México.',
        english: 'When I was ten years old, I lived in Mexico. (age)',
        highlight: ['tenía', 'vivía']
      }
    ]
  },
  {
    title: 'Imperfect vs Preterite: Key Differences',
    content: `Understanding when to use imperfect versus preterite is crucial for Spanish fluency. Here are the key differences:

**Imperfect**: Background, ongoing, habitual, descriptions
**Preterite**: Completed actions, specific events, interruptions

Often, both tenses appear in the same sentence, with the imperfect setting the scene and the preterite describing what happened.`,
    examples: [
      {
        spanish: 'Llovía cuando salí de casa.',
        english: 'It was raining when I left the house.',
        highlight: ['Llovía', 'salí']
      },
      {
        spanish: 'Siempre estudiaba por las noches, pero ayer estudié por la mañana.',
        english: 'I always used to study at night, but yesterday I studied in the morning.',
        highlight: ['estudiaba', 'estudié']
      },
      {
        spanish: 'Mientras caminábamos, vimos un accidente.',
        english: 'While we were walking, we saw an accident.',
        highlight: ['caminábamos', 'vimos']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'Spanish Present Tense',
    url: '/grammar/spanish/verbs/present-tense',
    difficulty: 'beginner'
  },
  {
    title: 'Spanish Past Tense (Preterite)',
    url: '/grammar/spanish/verbs/preterite',
    difficulty: 'intermediate'
  },
  {
    title: 'Preterite vs Imperfect',
    url: '/grammar/spanish/verbs/preterite-vs-imperfect',
    difficulty: 'intermediate'
  },
  {
    title: 'Spanish Future Tense',
    url: '/grammar/spanish/verbs/future',
    difficulty: 'intermediate'
  }
];

export default function SpanishImperfectPage() {
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
              topic: 'imperfect',
              title: 'Spanish Imperfect Tense',
              description: 'Master Spanish imperfect tense conjugations for ongoing and habitual past actions.',
              difficulty: 'intermediate',
              examples: [
                'Cuando era niño, jugaba fútbol (When I was a child, I used to play soccer)',
                'Mientras estudiaba, sonó el teléfono (While I was studying, the phone rang)',
                'La casa era grande y tenía jardín (The house was big and had a garden)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'imperfect',
              title: 'Spanish Imperfect Tense'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="imperfect"
        title="Spanish Imperfect Tense"
        description="Master Spanish imperfect tense conjugations for ongoing and habitual past actions"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/imperfect/practice"
        quizUrl="/grammar/spanish/verbs/imperfect/quiz"
        songUrl="/songs/es?theme=grammar&topic=imperfect"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'present-perfect',
  title: 'Spanish Present Perfect Tense',
  description: 'Master the Spanish present perfect tense (pretérito perfecto). Learn formation with haber + past participle, usage, and examples.',
  difficulty: 'intermediate',
  keywords: [
    'spanish present perfect',
    'pretérito perfecto',
    'haber past participle',
    'spanish perfect tense',
    'spanish grammar rules'
  ],
  examples: [
    'He comido pizza (I have eaten pizza)',
    'Has viajado a España (You have traveled to Spain)',
    'Hemos estudiado mucho (We have studied a lot)'
  ]
});

const sections = [
  {
    title: 'What is the Spanish Present Perfect Tense?',
    content: `The Spanish present perfect tense (**pretérito perfecto**) is used to describe actions that have been completed in the recent past but have relevance to the present moment. It's formed using the auxiliary verb "haber" (to have) plus the past participle of the main verb.

This tense is equivalent to the English present perfect ("I have eaten," "She has traveled") and is commonly used in Spain and some Latin American countries to talk about recent experiences, actions with present consequences, and life experiences.`,
    examples: [
      {
        spanish: 'He comido pizza hoy.',
        english: 'I have eaten pizza today.',
        highlight: ['He comido']
      },
      {
        spanish: 'María ha viajado a Francia.',
        english: 'María has traveled to France.',
        highlight: ['ha viajado']
      },
      {
        spanish: 'Hemos estudiado español por dos años.',
        english: 'We have studied Spanish for two years.',
        highlight: ['Hemos estudiado']
      }
    ]
  },
  {
    title: 'Formation: Haber + Past Participle',
    content: `The Spanish present perfect is formed by combining the present tense of the auxiliary verb **haber** with the past participle of the main verb. The past participle never changes form in compound tenses.

**Formula:** Subject + haber (present) + past participle`,
    subsections: [
      {
        title: 'Haber Conjugation (Present Tense)',
        content: 'The auxiliary verb haber is conjugated in the present tense:',
        conjugationTable: {
          title: 'Haber - Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'he', english: 'I have' },
            { pronoun: 'tú', form: 'has', english: 'you have' },
            { pronoun: 'él/ella/usted', form: 'ha', english: 'he/she/you have' },
            { pronoun: 'nosotros/as', form: 'hemos', english: 'we have' },
            { pronoun: 'vosotros/as', form: 'habéis', english: 'you all have' },
            { pronoun: 'ellos/ellas/ustedes', form: 'han', english: 'they/you all have' }
          ]
        }
      },
      {
        title: 'Past Participle Formation',
        content: 'Regular past participles are formed by adding specific endings to the verb stem:',
        examples: [
          {
            spanish: '-ar verbs: stem + -ado',
            english: 'hablar → hablado (spoken)',
            highlight: ['-ado']
          },
          {
            spanish: '-er verbs: stem + -ido',
            english: 'comer → comido (eaten)',
            highlight: ['-ido']
          },
          {
            spanish: '-ir verbs: stem + -ido',
            english: 'vivir → vivido (lived)',
            highlight: ['-ido']
          }
        ]
      },
      {
        title: 'Irregular Past Participles',
        content: 'Some verbs have irregular past participles that must be memorized:',
        examples: [
          {
            spanish: 'abrir → abierto',
            english: 'to open → opened',
            highlight: ['abierto']
          },
          {
            spanish: 'decir → dicho',
            english: 'to say → said',
            highlight: ['dicho']
          },
          {
            spanish: 'escribir → escrito',
            english: 'to write → written',
            highlight: ['escrito']
          },
          {
            spanish: 'hacer → hecho',
            english: 'to do/make → done/made',
            highlight: ['hecho']
          },
          {
            spanish: 'morir → muerto',
            english: 'to die → died',
            highlight: ['muerto']
          },
          {
            spanish: 'poner → puesto',
            english: 'to put → put',
            highlight: ['puesto']
          },
          {
            spanish: 'romper → roto',
            english: 'to break → broken',
            highlight: ['roto']
          },
          {
            spanish: 'ver → visto',
            english: 'to see → seen',
            highlight: ['visto']
          },
          {
            spanish: 'volver → vuelto',
            english: 'to return → returned',
            highlight: ['vuelto']
          }
        ]
      }
    ]
  },
  {
    title: 'When to Use the Present Perfect',
    content: `The Spanish present perfect is used in several specific situations. Understanding these uses will help you know when to choose this tense over other past tenses like the preterite or imperfect.`,
    subsections: [
      {
        title: 'Recent Past Actions',
        content: 'Actions that happened recently and have relevance to the present moment:',
        examples: [
          {
            spanish: 'He terminado mi tarea.',
            english: 'I have finished my homework.',
            highlight: ['He terminado']
          },
          {
            spanish: '¿Has visto a María hoy?',
            english: 'Have you seen María today?',
            highlight: ['Has visto']
          },
          {
            spanish: 'Hemos comido en ese restaurante.',
            english: 'We have eaten at that restaurant.',
            highlight: ['Hemos comido']
          }
        ]
      },
      {
        title: 'Life Experiences',
        content: 'Experiences in one\'s life, often with words like "nunca" (never), "alguna vez" (ever), "ya" (already):',
        examples: [
          {
            spanish: 'Nunca he estado en París.',
            english: 'I have never been to Paris.',
            highlight: ['Nunca he estado']
          },
          {
            spanish: '¿Has viajado alguna vez a Asia?',
            english: 'Have you ever traveled to Asia?',
            highlight: ['Has viajado']
          },
          {
            spanish: 'Ya hemos visto esa película.',
            english: 'We have already seen that movie.',
            highlight: ['Ya hemos visto']
          }
        ]
      },
      {
        title: 'Actions Continuing to Present',
        content: 'Actions that started in the past and continue to the present:',
        examples: [
          {
            spanish: 'He vivido aquí durante cinco años.',
            english: 'I have lived here for five years.',
            highlight: ['He vivido']
          },
          {
            spanish: 'Han trabajado juntos desde 2020.',
            english: 'They have worked together since 2020.',
            highlight: ['Han trabajado']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Time Expressions',
    content: `Certain time expressions are commonly used with the present perfect tense. These help indicate that the action has relevance to the present moment.`,
    examples: [
      {
        spanish: 'hoy',
        english: 'today',
        highlight: ['hoy']
      },
      {
        spanish: 'esta semana',
        english: 'this week',
        highlight: ['esta semana']
      },
      {
        spanish: 'este mes',
        english: 'this month',
        highlight: ['este mes']
      },
      {
        spanish: 'ya',
        english: 'already',
        highlight: ['ya']
      },
      {
        spanish: 'todavía no',
        english: 'not yet',
        highlight: ['todavía no']
      },
      {
        spanish: 'nunca',
        english: 'never',
        highlight: ['nunca']
      },
      {
        spanish: 'alguna vez',
        english: 'ever',
        highlight: ['alguna vez']
      },
      {
        spanish: 'recientemente',
        english: 'recently',
        highlight: ['recientemente']
      }
    ]
  },
  {
    title: 'Examples in Context',
    content: `Here are some practical examples of the present perfect tense used in everyday Spanish conversations:`,
    examples: [
      {
        spanish: '¿Qué has hecho hoy?',
        english: 'What have you done today?',
        highlight: ['has hecho']
      },
      {
        spanish: 'He perdido mis llaves.',
        english: 'I have lost my keys.',
        highlight: ['He perdido']
      },
      {
        spanish: '¿Has terminado el proyecto?',
        english: 'Have you finished the project?',
        highlight: ['Has terminado']
      },
      {
        spanish: 'No hemos recibido tu mensaje.',
        english: 'We haven\'t received your message.',
        highlight: ['hemos recibido']
      },
      {
        spanish: 'Ella ha llegado tarde otra vez.',
        english: 'She has arrived late again.',
        highlight: ['ha llegado']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense' },
  { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future' }
];

export default function SpanishPresentPerfectPage() {
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
              topic: 'present-perfect',
              title: 'Spanish Present Perfect Tense',
              description: 'Master the Spanish present perfect tense with comprehensive explanations and examples.',
              difficulty: 'intermediate',
              examples: [
                'He comido pizza (I have eaten pizza)',
                'Has viajado a España (You have traveled to Spain)',
                'Hemos estudiado mucho (We have studied a lot)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'present-perfect',
              title: 'Spanish Present Perfect Tense'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="present-perfect"
        title="Spanish Present Perfect Tense"
        description="Master the Spanish present perfect tense with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/present-perfect/practice"
        quizUrl="/grammar/spanish/verbs/present-perfect/quiz"
        songUrl="/songs/es?theme=grammar&topic=present-perfect"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

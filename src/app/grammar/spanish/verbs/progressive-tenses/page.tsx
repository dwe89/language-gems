import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'progressive-tenses',
  title: 'Spanish Progressive Tenses',
  description: 'Master Spanish progressive tenses with comprehensive explanations of estar + gerund constructions and usage examples.',
  difficulty: 'intermediate',
  keywords: [
    'spanish progressive tenses',
    'estar + gerund',
    'spanish continuous tenses',
    'progressive aspect',
    'spanish gerund'
  ],
  examples: [
    'Estoy estudiando español (I am studying Spanish)',
    'Estaba comiendo cuando llegaste (I was eating when you arrived)',
    'Estaré trabajando mañana (I will be working tomorrow)'
  ]
});

const sections = [
  {
    title: 'What are Spanish Progressive Tenses?',
    content: `Spanish progressive tenses express ongoing actions at specific points in time. They are formed using **estar** (to be) + **gerund** (present participle). These tenses emphasize that an action is in progress rather than completed.

Progressive tenses are used less frequently in Spanish than in English, but they are essential for expressing actions happening right now or at specific moments.`,
    examples: [
      {
        spanish: 'Estoy leyendo un libro.',
        english: 'I am reading a book.',
        highlight: ['Estoy leyendo']
      },
      {
        spanish: 'Los niños están jugando en el parque.',
        english: 'The children are playing in the park.',
        highlight: ['están jugando']
      },
      {
        spanish: 'Estábamos viendo la televisión.',
        english: 'We were watching television.',
        highlight: ['Estábamos viendo']
      }
    ]
  },
  {
    title: 'Formation of Progressive Tenses',
    content: `Progressive tenses are formed with estar + gerund. The gerund is formed by adding -ando to -ar verbs and -iendo to -er/-ir verbs.`,
    subsections: [
      {
        title: 'Gerund Formation',
        content: 'Regular gerund formation rules:',
        examples: [
          {
            spanish: '-ar verbs: hablar → hablando',
            english: 'speaking',
            highlight: ['hablando']
          },
          {
            spanish: '-er verbs: comer → comiendo',
            english: 'eating',
            highlight: ['comiendo']
          },
          {
            spanish: '-ir verbs: vivir → viviendo',
            english: 'living',
            highlight: ['viviendo']
          }
        ]
      },
      {
        title: 'Present Progressive',
        content: 'Present tense of estar + gerund:',
        conjugationTable: {
          title: 'Present Progressive - Hablar',
          conjugations: [
            { pronoun: 'yo', form: 'estoy hablando', english: 'I am speaking' },
            { pronoun: 'tú', form: 'estás hablando', english: 'you are speaking' },
            { pronoun: 'él/ella/usted', form: 'está hablando', english: 'he/she/you are speaking' },
            { pronoun: 'nosotros', form: 'estamos hablando', english: 'we are speaking' },
            { pronoun: 'vosotros', form: 'estáis hablando', english: 'you all are speaking' },
            { pronoun: 'ellos/ellas/ustedes', form: 'están hablando', english: 'they/you all are speaking' }
          ]
        }
      },
      {
        title: 'Past Progressive (Imperfect)',
        content: 'Imperfect tense of estar + gerund:',
        conjugationTable: {
          title: 'Past Progressive - Hablar',
          conjugations: [
            { pronoun: 'yo', form: 'estaba hablando', english: 'I was speaking' },
            { pronoun: 'tú', form: 'estabas hablando', english: 'you were speaking' },
            { pronoun: 'él/ella/usted', form: 'estaba hablando', english: 'he/she/you were speaking' },
            { pronoun: 'nosotros', form: 'estábamos hablando', english: 'we were speaking' },
            { pronoun: 'vosotros', form: 'estabais hablando', english: 'you all were speaking' },
            { pronoun: 'ellos/ellas/ustedes', form: 'estaban hablando', english: 'they/you all were speaking' }
          ]
        }
      }
    ]
  },
  {
    title: 'All Progressive Tenses',
    content: `Progressive tenses can be formed with any tense of estar.`,
    subsections: [
      {
        title: 'Future Progressive',
        content: 'Future tense of estar + gerund:',
        examples: [
          {
            spanish: 'Estaré trabajando mañana a las tres.',
            english: 'I will be working tomorrow at three.',
            highlight: ['Estaré trabajando']
          },
          {
            spanish: 'Estaremos viajando todo el verano.',
            english: 'We will be traveling all summer.',
            highlight: ['Estaremos viajando']
          }
        ]
      },
      {
        title: 'Conditional Progressive',
        content: 'Conditional tense of estar + gerund:',
        examples: [
          {
            spanish: 'Estaría durmiendo si no me hubieras llamado.',
            english: 'I would be sleeping if you hadn\'t called me.',
            highlight: ['Estaría durmiendo']
          },
          {
            spanish: 'Estarían estudiando en la biblioteca.',
            english: 'They would be studying in the library.',
            highlight: ['Estarían estudiando']
          }
        ]
      },
      {
        title: 'Perfect Progressive',
        content: 'Perfect tenses of estar + gerund:',
        examples: [
          {
            spanish: 'He estado pensando en ti.',
            english: 'I have been thinking about you.',
            highlight: ['He estado pensando']
          },
          {
            spanish: 'Había estado lloviendo toda la noche.',
            english: 'It had been raining all night.',
            highlight: ['Había estado lloviendo']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Gerunds',
    content: `Some verbs have irregular gerund forms that must be memorized.`,
    examples: [
      {
        spanish: 'Stem-changing -ir verbs: dormir → durmiendo',
        english: 'sleeping',
        highlight: ['durmiendo']
      },
      {
        spanish: 'Stem-changing -ir verbs: pedir → pidiendo',
        english: 'asking for',
        highlight: ['pidiendo']
      },
      {
        spanish: 'Verbs ending in vowel + -er/-ir: leer → leyendo',
        english: 'reading',
        highlight: ['leyendo']
      },
      {
        spanish: 'Irregular: ir → yendo, poder → pudiendo',
        english: 'going, being able',
        highlight: ['yendo', 'pudiendo']
      }
    ]
  },
  {
    title: 'Usage Notes',
    content: `Important differences between Spanish and English progressive usage.`,
    examples: [
      {
        spanish: 'Spanish: Voy a la escuela (habitual)',
        english: 'English: I go to school / I am going to school',
        highlight: ['Voy']
      },
      {
        spanish: 'Spanish: Estoy yendo a la escuela (right now)',
        english: 'English: I am going to school (at this moment)',
        highlight: ['Estoy yendo']
      },
      {
        spanish: 'Spanish: Trabajo aquí (permanent)',
        english: 'English: I work here',
        highlight: ['Trabajo']
      },
      {
        spanish: 'Spanish: Estoy trabajando aquí (temporary)',
        english: 'English: I am working here (temporarily)',
        highlight: ['Estoy trabajando']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Continuous', url: '/grammar/spanish/verbs/present-continuous' },
  { title: 'Gerunds', url: '/grammar/spanish/verbs/gerunds' },
  { title: 'Estar vs Ser', url: '/grammar/spanish/verbs/ser-vs-estar' }
];

export default function SpanishProgressiveTensesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'progressive-tenses',
              title: 'Spanish Progressive Tenses',
              description: 'Master Spanish progressive tenses with comprehensive explanations and examples',
              difficulty: 'intermediate',
              estimatedTime: 25
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'progressive-tenses',
              title: 'Spanish Progressive Tenses'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="progressive-tenses"
        title="Spanish Progressive Tenses"
        description="Master Spanish progressive tenses with comprehensive explanations and examples"
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/progressive-tenses/practice"
        quizUrl="/grammar/spanish/verbs/progressive-tenses/quiz"
        songUrl="/songs/es?theme=grammar&topic=progressive-tenses"
        youtubeVideoId="dQw4w9WgXcQ"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

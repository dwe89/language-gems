import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'verb-aspect',
  title: 'Spanish Verb Aspect',
  description: 'Master Spanish verb aspect including perfective vs imperfective, completed vs ongoing actions, and aspectual distinctions.',
  difficulty: 'advanced',
  keywords: [
    'spanish verb aspect',
    'perfective imperfective spanish',
    'preterite vs imperfect aspect',
    'spanish aspectual system',
    'completed ongoing actions'
  ],
  examples: [
    'Perfective: Escribí una carta (I wrote a letter - completed)',
    'Imperfective: Escribía cartas (I used to write letters - ongoing)',
    'Progressive: Estoy escribiendo (I am writing - in progress)'
  ]
});

const sections = [
  {
    title: 'What is Spanish Verb Aspect?',
    content: `Verb aspect in Spanish refers to how an action is viewed in terms of its completion, duration, or repetition. Unlike tense (which indicates when something happens), aspect indicates **how** the action unfolds over time.

Spanish has a rich aspectual system that helps speakers express subtle differences in meaning about actions and states.`,
    examples: [
      {
        spanish: 'Perfective: Comí una manzana.',
        english: 'I ate an apple. (completed action)',
        highlight: ['Comí']
      },
      {
        spanish: 'Imperfective: Comía manzanas todos los días.',
        english: 'I used to eat apples every day. (habitual action)',
        highlight: ['Comía']
      },
      {
        spanish: 'Progressive: Estoy comiendo una manzana.',
        english: 'I am eating an apple. (ongoing action)',
        highlight: ['Estoy comiendo']
      }
    ]
  },
  {
    title: 'Perfective vs Imperfective Aspect',
    content: `The fundamental aspectual distinction in Spanish is between perfective and imperfective aspect.`,
    subsections: [
      {
        title: 'Perfective Aspect (Preterite)',
        content: 'Views actions as completed wholes with clear boundaries:',
        examples: [
          {
            spanish: 'Escribí tres cartas ayer.',
            english: 'I wrote three letters yesterday.',
            highlight: ['Escribí']
          },
          {
            spanish: 'Llegó a las cinco.',
            english: 'He arrived at five o\'clock.',
            highlight: ['Llegó']
          },
          {
            spanish: 'Vivimos en Madrid cinco años.',
            english: 'We lived in Madrid for five years.',
            highlight: ['Vivimos']
          }
        ]
      },
      {
        title: 'Imperfective Aspect (Imperfect)',
        content: 'Views actions as ongoing, habitual, or without clear boundaries:',
        examples: [
          {
            spanish: 'Escribía cartas todos los días.',
            english: 'I used to write letters every day.',
            highlight: ['Escribía']
          },
          {
            spanish: 'Siempre llegaba tarde.',
            english: 'He always arrived late.',
            highlight: ['llegaba']
          },
          {
            spanish: 'Vivíamos en una casa grande.',
            english: 'We lived in a big house.',
            highlight: ['Vivíamos']
          }
        ]
      }
    ]
  },
  {
    title: 'Progressive Aspect',
    content: `Progressive aspect emphasizes that an action is in progress at a specific moment.`,
    subsections: [
      {
        title: 'Present Progressive',
        content: 'Actions happening right now:',
        examples: [
          {
            spanish: 'Estoy estudiando español.',
            english: 'I am studying Spanish.',
            highlight: ['Estoy estudiando']
          },
          {
            spanish: 'Los niños están jugando en el parque.',
            english: 'The children are playing in the park.',
            highlight: ['están jugando']
          }
        ]
      },
      {
        title: 'Past Progressive',
        content: 'Actions that were in progress in the past:',
        examples: [
          {
            spanish: 'Estaba leyendo cuando llamaste.',
            english: 'I was reading when you called.',
            highlight: ['Estaba leyendo']
          },
          {
            spanish: 'Estuvimos trabajando toda la noche.',
            english: 'We were working all night.',
            highlight: ['Estuvimos trabajando']
          }
        ]
      }
    ]
  },
  {
    title: 'Iterative and Habitual Aspect',
    content: `Spanish expresses repeated or habitual actions through various aspectual markers.`,
    examples: [
      {
        spanish: 'Habitual past: Iba al cine los sábados.',
        english: 'I used to go to the cinema on Saturdays.',
        highlight: ['Iba']
      },
      {
        spanish: 'Repeated action: Solía levantarme temprano.',
        english: 'I used to get up early.',
        highlight: ['Solía levantarme']
      },
      {
        spanish: 'Iterative: Tocaba y tocaba la puerta.',
        english: 'He kept knocking and knocking on the door.',
        highlight: ['Tocaba y tocaba']
      },
      {
        spanish: 'Frequentative: Visitaba a menudo a sus abuelos.',
        english: 'He often visited his grandparents.',
        highlight: ['Visitaba a menudo']
      }
    ]
  },
  {
    title: 'Inchoative and Terminative Aspect',
    content: `Aspects that focus on the beginning or end of actions.`,
    subsections: [
      {
        title: 'Inchoative (Beginning)',
        content: 'Emphasizes the start of an action:',
        examples: [
          {
            spanish: 'Empezó a llover.',
            english: 'It started to rain.',
            highlight: ['Empezó a llover']
          },
          {
            spanish: 'Se puso a estudiar.',
            english: 'He started studying.',
            highlight: ['Se puso a estudiar']
          },
          {
            spanish: 'Rompió a llorar.',
            english: 'She burst into tears.',
            highlight: ['Rompió a llorar']
          }
        ]
      },
      {
        title: 'Terminative (Ending)',
        content: 'Emphasizes the completion or end of an action:',
        examples: [
          {
            spanish: 'Terminó de comer.',
            english: 'He finished eating.',
            highlight: ['Terminó de comer']
          },
          {
            spanish: 'Acabó por aceptar.',
            english: 'He ended up accepting.',
            highlight: ['Acabó por aceptar']
          },
          {
            spanish: 'Dejó de fumar.',
            english: 'He stopped smoking.',
            highlight: ['Dejó de fumar']
          }
        ]
      }
    ]
  },
  {
    title: 'Perfect Aspect',
    content: `Perfect aspect relates a past action to a reference point, often the present.`,
    examples: [
      {
        spanish: 'Present Perfect: He terminado el trabajo.',
        english: 'I have finished the work. (relevant to now)',
        highlight: ['He terminado']
      },
      {
        spanish: 'Past Perfect: Había terminado cuando llegaste.',
        english: 'I had finished when you arrived.',
        highlight: ['Había terminado']
      },
      {
        spanish: 'Future Perfect: Habré terminado para mañana.',
        english: 'I will have finished by tomorrow.',
        highlight: ['Habré terminado']
      },
      {
        spanish: 'Conditional Perfect: Habría terminado si hubiera tenido tiempo.',
        english: 'I would have finished if I had had time.',
        highlight: ['Habría terminado']
      }
    ]
  },
  {
    title: 'Aspectual Verbs and Constructions',
    content: `Verbs and constructions that modify aspectual meaning.`,
    examples: [
      {
        spanish: 'Durative: Sigue trabajando.',
        english: 'He continues working.',
        highlight: ['Sigue trabajando']
      },
      {
        spanish: 'Repetitive: Vuelve a intentarlo.',
        english: 'Try again.',
        highlight: ['Vuelve a intentarlo']
      },
      {
        spanish: 'Gradual: Va mejorando poco a poco.',
        english: 'He\'s gradually improving.',
        highlight: ['Va mejorando']
      },
      {
        spanish: 'Resultative: Tiene escrito el informe.',
        english: 'He has the report written.',
        highlight: ['Tiene escrito']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect' },
  { title: 'Progressive Tenses', url: '/grammar/spanish/verbs/progressive-tenses' }
];

export default function SpanishVerbAspectPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'verb-aspect',
              title: 'Spanish Verb Aspect',
              description: 'Master Spanish verb aspect with comprehensive explanations and examples',
              difficulty: 'advanced',
              estimatedTime: 40
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'verb-aspect',
              title: 'Spanish Verb Aspect'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="verb-aspect"
        title="Spanish Verb Aspect"
        description="Master Spanish verb aspect with comprehensive explanations and examples"
        difficulty="advanced"
        estimatedTime={40}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/verb-aspect/practice"
        quizUrl="/grammar/spanish/verbs/verb-aspect/quiz"
        songUrl="/songs/es?theme=grammar&topic=verb-aspect"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

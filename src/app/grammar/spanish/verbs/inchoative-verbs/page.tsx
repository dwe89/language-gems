import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'inchoative-verbs',
  title: 'Spanish Inchoative Verbs - Beginning and Starting Actions',
  description: 'Learn Spanish inchoative verbs including empezar, comenzar, iniciar, and other verbs expressing the beginning or start of actions and states.',
  difficulty: 'intermediate',
  keywords: ['spanish inchoative verbs', 'beginning verbs', 'empezar', 'comenzar', 'iniciar', 'starting verbs', 'inception verbs'],
  examples: ['Empiezo a trabajar', 'Comienza la clase', 'Inicia el proyecto', 'Se pone a llover']
});

const sections = [
  {
    title: 'Understanding Inchoative Verbs',
    content: 'Inchoative verbs express the **beginning**, **start**, or **inception** of actions, states, or processes. They indicate the moment when something begins to happen.',
    examples: [
      {
        spanish: 'Empiezo a estudiar a las ocho.',
        english: 'I start studying at eight.',
        highlight: ['Empiezo a']
      },
      {
        spanish: 'Comienza la película.',
        english: 'The movie begins.',
        highlight: ['Comienza']
      },
      {
        spanish: 'Se pone a llover.',
        english: 'It starts to rain.',
        highlight: ['Se pone a']
      }
    ]
  },
  {
    title: 'EMPEZAR - Starting/Beginning',
    content: 'The verb **"empezar"** is the most common way to express "to start" or "to begin" in Spanish.',
    examples: [
      {
        spanish: 'Empiezo el trabajo mañana.',
        english: 'I start work tomorrow.',
        highlight: ['Empiezo']
      },
      {
        spanish: 'Empezamos a las nueve.',
        english: 'We start at nine.',
        highlight: ['Empezamos']
      },
      {
        spanish: 'La clase empezó tarde.',
        english: 'The class started late.',
        highlight: ['empezó']
      }
    ],
    subsections: [
      {
        title: 'EMPEZAR Conjugation',
        content: 'EMPEZAR is stem-changing (e→ie) and has spelling changes.',
        conjugationTable: {
          title: 'EMPEZAR Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'empiezo', english: 'I start' },
            { pronoun: 'tú', form: 'empiezas', english: 'you start' },
            { pronoun: 'él/ella', form: 'empieza', english: 'he/she starts' },
            { pronoun: 'nosotros', form: 'empezamos', english: 'we start' },
            { pronoun: 'vosotros', form: 'empezáis', english: 'you all start' },
            { pronoun: 'ellos', form: 'empiezan', english: 'they start' }
          ]
        }
      },
      {
        title: 'EMPEZAR Constructions',
        content: 'Different ways to use empezar.',
        examples: [
          {
            spanish: 'Empezar a + infinitive',
            english: 'Empiezo a trabajar.',
            highlight: ['Empezar a']
          },
          {
            spanish: 'Empezar por + noun/infinitive',
            english: 'Empiezo por el principio.',
            highlight: ['Empezar por']
          },
          {
            spanish: 'Empezar con + noun',
            english: 'Empiezo con una pregunta.',
            highlight: ['Empezar con']
          }
        ]
      }
    ]
  },
  {
    title: 'COMENZAR - Commencing/Starting',
    content: 'The verb **"comenzar"** is more formal than empezar and means "to commence" or "to begin."',
    examples: [
      {
        spanish: 'Comienza la ceremonia.',
        english: 'The ceremony begins.',
        highlight: ['Comienza']
      },
      {
        spanish: 'Comenzamos el proyecto hoy.',
        english: 'We begin the project today.',
        highlight: ['Comenzamos']
      },
      {
        spanish: 'Comenzó a nevar.',
        english: 'It began to snow.',
        highlight: ['Comenzó a']
      }
    ],
    subsections: [
      {
        title: 'COMENZAR vs EMPEZAR',
        content: 'COMENZAR is more formal; EMPEZAR is more common.',
        conjugationTable: {
          title: 'COMENZAR vs EMPEZAR Usage',
          conjugations: [
            { pronoun: 'Formal/Written', form: 'comienza la reunión', english: 'the meeting begins' },
            { pronoun: 'Informal/Spoken', form: 'empieza la reunión', english: 'the meeting starts' },
            { pronoun: 'Official events', form: 'comienza la ceremonia', english: 'the ceremony commences' },
            { pronoun: 'Daily activities', form: 'empieza el trabajo', english: 'work starts' },
            { pronoun: 'Academic', form: 'comienza el curso', english: 'the course begins' },
            { pronoun: 'Casual', form: 'empieza la película', english: 'the movie starts' }
          ]
        }
      }
    ]
  },
  {
    title: 'INICIAR - Initiating/Starting',
    content: 'The verb **"iniciar"** means "to initiate" or "to start" and is often used in formal or technical contexts.',
    examples: [
      {
        spanish: 'Inicia el programa.',
        english: 'Start the program.',
        highlight: ['Inicia']
      },
      {
        spanish: 'Iniciamos las negociaciones.',
        english: 'We initiate the negotiations.',
        highlight: ['Iniciamos']
      },
      {
        spanish: 'Se inició el proceso.',
        english: 'The process was initiated.',
        highlight: ['Se inició']
      }
    ],
    subsections: [
      {
        title: 'INICIAR Usage Patterns',
        content: 'INICIAR is often used in formal, technical, or business contexts.',
        conjugationTable: {
          title: 'INICIAR Usage Contexts',
          conjugations: [
            { pronoun: 'Technology', form: 'iniciar sesión', english: 'log in/start session' },
            { pronoun: 'Business', form: 'iniciar negociaciones', english: 'initiate negotiations' },
            { pronoun: 'Legal', form: 'iniciar proceso', english: 'initiate process' },
            { pronoun: 'Education', form: 'iniciar curso', english: 'start course' },
            { pronoun: 'Projects', form: 'iniciar proyecto', english: 'launch project' },
            { pronoun: 'Procedures', form: 'iniciar trámite', english: 'start procedure' }
          ]
        }
      }
    ]
  },
  {
    title: 'PONERSE A - Starting To (Suddenly)',
    content: 'The expression **"ponerse a"** means "to start to" and implies a **sudden** or **spontaneous** beginning.',
    examples: [
      {
        spanish: 'Se pone a llover.',
        english: 'It starts to rain.',
        highlight: ['Se pone a']
      },
      {
        spanish: 'Me pongo a estudiar.',
        english: 'I start studying.',
        highlight: ['Me pongo a']
      },
      {
        spanish: 'Se pusieron a cantar.',
        english: 'They started singing.',
        highlight: ['Se pusieron a']
      }
    ],
    subsections: [
      {
        title: 'PONERSE A Usage',
        content: 'Used for sudden or spontaneous beginnings.',
        conjugationTable: {
          title: 'PONERSE A Patterns',
          conjugations: [
            { pronoun: 'Sudden weather', form: 'se pone a llover', english: 'it starts raining' },
            { pronoun: 'Spontaneous action', form: 'se pone a bailar', english: 'starts dancing' },
            { pronoun: 'Unexpected behavior', form: 'se pone a gritar', english: 'starts shouting' },
            { pronoun: 'Immediate action', form: 'me pongo a trabajar', english: 'I start working' },
            { pronoun: 'Sudden emotion', form: 'se pone a llorar', english: 'starts crying' },
            { pronoun: 'Quick decision', form: 'nos ponemos a correr', english: 'we start running' }
          ]
        }
      }
    ]
  },
  {
    title: 'ECHARSE A - Starting To (Suddenly)',
    content: 'The expression **"echarse a"** is similar to "ponerse a" and means "to start to" with emphasis on **sudden action**.',
    examples: [
      {
        spanish: 'Se echa a reír.',
        english: 'He bursts out laughing.',
        highlight: ['Se echa a']
      },
      {
        spanish: 'Me echo a correr.',
        english: 'I start running.',
        highlight: ['Me echo a']
      },
      {
        spanish: 'Se echaron a volar.',
        english: 'They took flight.',
        highlight: ['Se echaron a']
      }
    ],
    subsections: [
      {
        title: 'ECHARSE A vs PONERSE A',
        content: 'Both express sudden beginning with slight differences.',
        conjugationTable: {
          title: 'ECHARSE A vs PONERSE A',
          conjugations: [
            { pronoun: 'More dramatic', form: 'se echa a llorar', english: 'bursts into tears' },
            { pronoun: 'More common', form: 'se pone a llorar', english: 'starts crying' },
            { pronoun: 'Sudden movement', form: 'se echa a correr', english: 'takes off running' },
            { pronoun: 'General start', form: 'se pone a correr', english: 'starts running' },
            { pronoun: 'Emotional outburst', form: 'se echa a reír', english: 'bursts out laughing' },
            { pronoun: 'Simple beginning', form: 'se pone a reír', english: 'starts laughing' }
          ]
        }
      }
    ]
  },
  {
    title: 'ARRANCAR - Starting (Engines/Machines)',
    content: 'The verb **"arrancar"** means "to start" engines, machines, or to begin something forcefully.',
    examples: [
      {
        spanish: 'Arranca el coche.',
        english: 'Start the car.',
        highlight: ['Arranca']
      },
      {
        spanish: 'El motor no arranca.',
        english: 'The engine won\'t start.',
        highlight: ['arranca']
      },
      {
        spanish: 'Arrancamos el proyecto.',
        english: 'We kick off the project.',
        highlight: ['Arrancamos']
      }
    ],
    subsections: [
      {
        title: 'ARRANCAR Usage Contexts',
        content: 'Used for mechanical starts and forceful beginnings.',
        conjugationTable: {
          title: 'ARRANCAR Usage',
          conjugations: [
            { pronoun: 'Vehicles', form: 'arrancar el coche', english: 'start the car' },
            { pronoun: 'Machines', form: 'arrancar la máquina', english: 'start the machine' },
            { pronoun: 'Computers', form: 'arrancar el ordenador', english: 'boot the computer' },
            { pronoun: 'Projects', form: 'arrancar el proyecto', english: 'kick off the project' },
            { pronoun: 'Seasons', form: 'arranca la temporada', english: 'the season starts' },
            { pronoun: 'Forceful start', form: 'arrancar de cero', english: 'start from scratch' }
          ]
        }
      }
    ]
  },
  {
    title: 'ROMPER A - Breaking Into (Action)',
    content: 'The expression **"romper a"** means "to break into" an action, expressing **sudden, intense beginning**.',
    examples: [
      {
        spanish: 'Rompe a llorar.',
        english: 'She breaks into tears.',
        highlight: ['Rompe a']
      },
      {
        spanish: 'Rompió a cantar.',
        english: 'He burst into song.',
        highlight: ['Rompió a']
      },
      {
        spanish: 'Rompieron a aplaudir.',
        english: 'They broke into applause.',
        highlight: ['Rompieron a']
      }
    ],
    subsections: [
      {
        title: 'ROMPER A Usage',
        content: 'Used for sudden, intense emotional or physical actions.',
        conjugationTable: {
          title: 'ROMPER A Patterns',
          conjugations: [
            { pronoun: 'Emotional outburst', form: 'rompe a llorar', english: 'breaks into tears' },
            { pronoun: 'Sudden singing', form: 'rompe a cantar', english: 'bursts into song' },
            { pronoun: 'Intense laughter', form: 'rompe a reír', english: 'breaks into laughter' },
            { pronoun: 'Sudden speech', form: 'rompe a hablar', english: 'breaks into speech' },
            { pronoun: 'Physical action', form: 'rompe a correr', english: 'breaks into a run' },
            { pronoun: 'Dawn/daybreak', form: 'rompe el alba', english: 'daybreak comes' }
          ]
        }
      }
    ]
  },
  {
    title: 'METERSE A - Getting Into/Starting',
    content: 'The expression **"meterse a"** means "to get into" or "to start" doing something, often implying involvement.',
    examples: [
      {
        spanish: 'Se mete a estudiar medicina.',
        english: 'He gets into studying medicine.',
        highlight: ['Se mete a']
      },
      {
        spanish: 'Me meto a trabajar.',
        english: 'I get down to work.',
        highlight: ['Me meto a']
      },
      {
        spanish: 'Se metieron a construir.',
        english: 'They got into building.',
        highlight: ['Se metieron a']
      }
    ],
    subsections: [
      {
        title: 'METERSE A vs EMPEZAR A',
        content: 'METERSE A implies deeper involvement than EMPEZAR A.',
        conjugationTable: {
          title: 'METERSE A vs EMPEZAR A',
          conjugations: [
            { pronoun: 'Deep involvement', form: 'se mete a estudiar', english: 'gets into studying' },
            { pronoun: 'Simple start', form: 'empieza a estudiar', english: 'starts studying' },
            { pronoun: 'Commitment', form: 'se mete a trabajar', english: 'gets down to work' },
            { pronoun: 'Beginning', form: 'empieza a trabajar', english: 'starts working' },
            { pronoun: 'Serious engagement', form: 'se mete a investigar', english: 'gets into research' },
            { pronoun: 'Initial action', form: 'empieza a investigar', english: 'starts researching' }
          ]
        }
      }
    ]
  },
  {
    title: 'Inchoative Expressions with Weather',
    content: 'Special expressions for **weather phenomena** beginning.',
    examples: [
      {
        spanish: 'Empieza a llover.',
        english: 'It starts to rain.',
        highlight: ['Empieza a']
      },
      {
        spanish: 'Se pone a nevar.',
        english: 'It starts to snow.',
        highlight: ['Se pone a']
      },
      {
        spanish: 'Comienza a hacer frío.',
        english: 'It begins to get cold.',
        highlight: ['Comienza a']
      }
    ],
    subsections: [
      {
        title: 'Weather Inchoative Patterns',
        content: 'Common patterns for weather beginnings.',
        conjugationTable: {
          title: 'Weather Inchoative Verbs',
          conjugations: [
            { pronoun: 'Rain starting', form: 'empieza a llover', english: 'starts raining' },
            { pronoun: 'Snow beginning', form: 'se pone a nevar', english: 'starts snowing' },
            { pronoun: 'Wind picking up', form: 'empieza a hacer viento', english: 'starts getting windy' },
            { pronoun: 'Getting cold', form: 'comienza a hacer frío', english: 'starts getting cold' },
            { pronoun: 'Clearing up', form: 'empieza a despejarse', english: 'starts clearing up' },
            { pronoun: 'Storm beginning', form: 'se pone tormentoso', english: 'becomes stormy' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' }
];

export default function SpanishInchoativeVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Inchoative Verbs - Beginning and Starting Actions',
            description: 'Learn Spanish inchoative verbs including empezar, comenzar, iniciar, and other verbs expressing the beginning or start of actions and states.',
            keywords: ['spanish inchoative verbs', 'beginning verbs', 'empezar', 'comenzar', 'iniciar', 'starting verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'inchoative-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="inchoative-verbs"
        title="Spanish Inchoative Verbs"
        description="Learn Spanish inchoative verbs including empezar, comenzar, iniciar, and other verbs expressing the beginning or start of actions and states."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/inchoative-verbs/practice"
        quizUrl="/grammar/spanish/verbs/inchoative-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=inchoative-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

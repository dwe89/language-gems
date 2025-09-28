import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'change-verbs',
  title: 'Spanish Change Verbs - Transformation and Becoming',
  description: 'Learn Spanish change verbs including convertirse, volverse, hacerse, and other verbs expressing transformation and becoming.',
  difficulty: 'advanced',
  keywords: ['spanish change verbs', 'transformation verbs', 'convertirse', 'volverse', 'hacerse', 'becoming verbs', 'llegar a ser'],
  examples: ['Se convierte en médico', 'Se vuelve loco', 'Se hace rico', 'Llega a ser famoso']
});

const sections = [
  {
    title: 'Understanding Change Verbs',
    content: 'Spanish change verbs express **transformation**, **becoming**, or **turning into** something different. They describe processes of change in state, condition, profession, or character.',
    examples: [
      {
        spanish: 'Se convierte en mariposa.',
        english: 'It turns into a butterfly.',
        highlight: ['Se convierte en']
      },
      {
        spanish: 'Se vuelve muy difícil.',
        english: 'It becomes very difficult.',
        highlight: ['Se vuelve']
      },
      {
        spanish: 'Se hace médico.',
        english: 'He becomes a doctor.',
        highlight: ['Se hace']
      }
    ]
  },
  {
    title: 'CONVERTIRSE EN - Converting/Transforming',
    content: 'The verb **"convertirse en"** expresses **complete transformation** or conversion from one thing to another.',
    examples: [
      {
        spanish: 'El agua se convierte en hielo.',
        english: 'Water turns into ice.',
        highlight: ['se convierte en']
      },
      {
        spanish: 'Se convirtió en un gran escritor.',
        english: 'He became a great writer.',
        highlight: ['Se convirtió en']
      },
      {
        spanish: 'La oruga se convierte en mariposa.',
        english: 'The caterpillar turns into a butterfly.',
        highlight: ['se convierte en']
      }
    ],
    subsections: [
      {
        title: 'CONVERTIRSE EN Usage',
        content: 'Used for complete transformations and conversions.',
        conjugationTable: {
          title: 'CONVERTIRSE EN Patterns',
          conjugations: [
            { pronoun: 'Physical change', form: 'se convierte en hielo', english: 'turns into ice' },
            { pronoun: 'Professional', form: 'se convierte en médico', english: 'becomes a doctor' },
            { pronoun: 'Religious', form: 'se convierte al cristianismo', english: 'converts to Christianity' },
            { pronoun: 'Complete change', form: 'se convierte en líder', english: 'becomes a leader' },
            { pronoun: 'Transformation', form: 'se convierte en problema', english: 'becomes a problem' },
            { pronoun: 'Evolution', form: 'se convierte en tradición', english: 'becomes a tradition' }
          ]
        }
      }
    ]
  },
  {
    title: 'VOLVERSE - Becoming (Gradual Change)',
    content: 'The verb **"volverse"** expresses **gradual change** in character, behavior, or condition, often with negative connotations.',
    examples: [
      {
        spanish: 'Se vuelve muy impaciente.',
        english: 'He becomes very impatient.',
        highlight: ['Se vuelve']
      },
      {
        spanish: 'La situación se vuelve complicada.',
        english: 'The situation becomes complicated.',
        highlight: ['se vuelve']
      },
      {
        spanish: 'Se volvió loco con el tiempo.',
        english: 'He went crazy over time.',
        highlight: ['Se volvió']
      }
    ],
    subsections: [
      {
        title: 'VOLVERSE Usage Patterns',
        content: 'Used for gradual changes, especially in personality or condition.',
        conjugationTable: {
          title: 'VOLVERSE Patterns',
          conjugations: [
            { pronoun: 'Personality', form: 'se vuelve agresivo', english: 'becomes aggressive' },
            { pronoun: 'Mental state', form: 'se vuelve loco', english: 'goes crazy' },
            { pronoun: 'Condition', form: 'se vuelve difícil', english: 'becomes difficult' },
            { pronoun: 'Behavior', form: 'se vuelve rebelde', english: 'becomes rebellious' },
            { pronoun: 'Situation', form: 'se vuelve peligroso', english: 'becomes dangerous' },
            { pronoun: 'Attitude', form: 'se vuelve pesimista', english: 'becomes pessimistic' }
          ]
        }
      },
      {
        title: 'VOLVERSE Conjugation',
        content: 'VOLVERSE is stem-changing (o→ue).',
        examples: [
          {
            spanish: 'Me vuelvo nervioso antes de los exámenes.',
            english: 'I become nervous before exams.',
            highlight: ['Me vuelvo']
          },
          {
            spanish: 'Te vuelves más sabio con la edad.',
            english: 'You become wiser with age.',
            highlight: ['Te vuelves']
          }
        ]
      }
    ]
  },
  {
    title: 'HACERSE - Becoming (Through Effort)',
    content: 'The verb **"hacerse"** expresses **becoming** something through effort, achievement, or deliberate action.',
    examples: [
      {
        spanish: 'Se hace médico después de estudiar.',
        english: 'He becomes a doctor after studying.',
        highlight: ['Se hace']
      },
      {
        spanish: 'Se hizo rico con su negocio.',
        english: 'He became rich with his business.',
        highlight: ['Se hizo']
      },
      {
        spanish: 'Se hace de noche.',
        english: 'It\'s getting dark.',
        highlight: ['Se hace']
      }
    ],
    subsections: [
      {
        title: 'HACERSE Usage Patterns',
        content: 'Used for changes achieved through effort or natural progression.',
        conjugationTable: {
          title: 'HACERSE Patterns',
          conjugations: [
            { pronoun: 'Profession', form: 'se hace abogado', english: 'becomes a lawyer' },
            { pronoun: 'Wealth/Status', form: 'se hace famoso', english: 'becomes famous' },
            { pronoun: 'Religion/Politics', form: 'se hace católico', english: 'becomes Catholic' },
            { pronoun: 'Time/Weather', form: 'se hace tarde', english: 'it\'s getting late' },
            { pronoun: 'Achievement', form: 'se hace experto', english: 'becomes an expert' },
            { pronoun: 'Social status', form: 'se hace miembro', english: 'becomes a member' }
          ]
        }
      },
      {
        title: 'HACERSE vs Other Change Verbs',
        content: 'HACERSE implies effort or achievement.',
        examples: [
          {
            spanish: 'Se hace médico. (through study/effort)',
            english: 'He becomes a doctor.',
            highlight: ['Se hace']
          },
          {
            spanish: 'Se convierte en médico. (transformation)',
            english: 'He becomes a doctor.',
            highlight: ['Se convierte en']
          }
        ]
      }
    ]
  },
  {
    title: 'LLEGAR A SER - Becoming (Achievement)',
    content: 'The expression **"llegar a ser"** means "to become" or "to end up being," emphasizing the **achievement** or **final result**.',
    examples: [
      {
        spanish: 'Llegó a ser presidente.',
        english: 'He became president.',
        highlight: ['Llegó a ser']
      },
      {
        spanish: 'Puede llegar a ser peligroso.',
        english: 'It can become dangerous.',
        highlight: ['llegar a ser']
      },
      {
        spanish: 'Llegaron a ser buenos amigos.',
        english: 'They became good friends.',
        highlight: ['Llegaron a ser']
      }
    ],
    subsections: [
      {
        title: 'LLEGAR A SER Usage',
        content: 'Emphasizes the achievement or final result of a process.',
        conjugationTable: {
          title: 'LLEGAR A SER Patterns',
          conjugations: [
            { pronoun: 'High achievement', form: 'llega a ser presidente', english: 'becomes president' },
            { pronoun: 'Final result', form: 'llega a ser un problema', english: 'ends up being a problem' },
            { pronoun: 'Success', form: 'llega a ser famoso', english: 'becomes famous' },
            { pronoun: 'Relationship', form: 'llegan a ser amigos', english: 'become friends' },
            { pronoun: 'Potential', form: 'puede llegar a ser', english: 'can become' },
            { pronoun: 'Ultimate goal', form: 'llega a ser experto', english: 'becomes an expert' }
          ]
        }
      }
    ]
  },
  {
    title: 'PONERSE - Becoming (Temporary States)',
    content: 'The verb **"ponerse"** expresses **temporary changes** in physical or emotional states.',
    examples: [
      {
        spanish: 'Se pone rojo de vergüenza.',
        english: 'He turns red with embarrassment.',
        highlight: ['Se pone']
      },
      {
        spanish: 'Me pongo nervioso antes de hablar.',
        english: 'I get nervous before speaking.',
        highlight: ['Me pongo']
      },
      {
        spanish: 'Se puso muy contenta.',
        english: 'She became very happy.',
        highlight: ['Se puso']
      }
    ],
    subsections: [
      {
        title: 'PONERSE Usage Patterns',
        content: 'Used for temporary physical or emotional changes.',
        conjugationTable: {
          title: 'PONERSE Patterns',
          conjugations: [
            { pronoun: 'Color/Physical', form: 'se pone rojo', english: 'turns red' },
            { pronoun: 'Emotions', form: 'se pone triste', english: 'becomes sad' },
            { pronoun: 'Health', form: 'se pone enfermo', english: 'gets sick' },
            { pronoun: 'Weather', form: 'se pone nublado', english: 'becomes cloudy' },
            { pronoun: 'Mood', form: 'se pone de mal humor', english: 'gets in a bad mood' },
            { pronoun: 'Clothing', form: 'se pone el abrigo', english: 'puts on the coat' }
          ]
        }
      },
      {
        title: 'PONERSE vs ESTAR',
        content: 'PONERSE shows change; ESTAR shows state.',
        examples: [
          {
            spanish: 'Se pone enfermo. (becomes sick)',
            english: 'He gets sick.',
            highlight: ['Se pone']
          },
          {
            spanish: 'Está enfermo. (is sick)',
            english: 'He is sick.',
            highlight: ['Está']
          }
        ]
      }
    ]
  },
  {
    title: 'QUEDARSE - Becoming/Remaining',
    content: 'The verb **"quedarse"** can express **becoming** in the sense of ending up in a particular state, often permanently.',
    examples: [
      {
        spanish: 'Se quedó ciego después del accidente.',
        english: 'He became blind after the accident.',
        highlight: ['Se quedó']
      },
      {
        spanish: 'Me quedé sin dinero.',
        english: 'I ended up without money.',
        highlight: ['Me quedé']
      },
      {
        spanish: 'Se quedaron sorprendidos.',
        english: 'They were left surprised.',
        highlight: ['Se quedaron']
      }
    ],
    subsections: [
      {
        title: 'QUEDARSE Usage Patterns',
        content: 'Used for permanent changes or resulting states.',
        conjugationTable: {
          title: 'QUEDARSE Patterns',
          conjugations: [
            { pronoun: 'Physical disability', form: 'se queda ciego', english: 'becomes blind' },
            { pronoun: 'Loss', form: 'se queda sin trabajo', english: 'ends up without work' },
            { pronoun: 'Emotional state', form: 'se queda tranquilo', english: 'becomes calm' },
            { pronoun: 'Surprise', form: 'se queda asombrado', english: 'is left amazed' },
            { pronoun: 'Permanent state', form: 'se queda viudo', english: 'becomes widowed' },
            { pronoun: 'Result', form: 'se queda vacío', english: 'ends up empty' }
          ]
        }
      }
    ]
  },
  {
    title: 'Choosing the Right Change Verb',
    content: 'Different change verbs are used depending on the **type of change**, **duration**, and **cause**.',
    examples: [
      {
        spanish: 'Se hace médico. (effort/achievement)',
        english: 'He becomes a doctor.',
        highlight: ['Se hace']
      },
      {
        spanish: 'Se vuelve agresivo. (gradual/personality)',
        english: 'He becomes aggressive.',
        highlight: ['Se vuelve']
      },
      {
        spanish: 'Se pone nervioso. (temporary/emotional)',
        english: 'He gets nervous.',
        highlight: ['Se pone']
      }
    ],
    subsections: [
      {
        title: 'Change Verb Selection Guide',
        content: 'Guidelines for choosing the appropriate change verb.',
        conjugationTable: {
          title: 'Change Verb Selection',
          conjugations: [
            { pronoun: 'Complete transformation', form: 'convertirse en', english: 'physical/complete change' },
            { pronoun: 'Gradual change', form: 'volverse', english: 'personality/behavior change' },
            { pronoun: 'Through effort', form: 'hacerse', english: 'profession/achievement' },
            { pronoun: 'Final achievement', form: 'llegar a ser', english: 'ultimate goal/success' },
            { pronoun: 'Temporary state', form: 'ponerse', english: 'emotions/physical appearance' },
            { pronoun: 'Permanent result', form: 'quedarse', english: 'lasting consequence' }
          ]
        }
      },
      {
        title: 'Common Mistakes',
        content: 'Avoiding common errors with change verbs.',
        examples: [
          {
            spanish: '✓ Se hace médico. (correct - profession)',
            english: 'He becomes a doctor.',
            highlight: ['Se hace']
          },
          {
            spanish: '✗ Se convierte en médico. (less natural)',
            english: 'He becomes a doctor.',
            highlight: ['Se convierte en']
          },
          {
            spanish: '✓ Se pone enfermo. (correct - temporary)',
            english: 'He gets sick.',
            highlight: ['Se pone']
          },
          {
            spanish: '✗ Se hace enfermo. (incorrect)',
            english: 'He gets sick.',
            highlight: ['Se hace']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' },
  { title: 'Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' },
  { title: 'Irregular Verbs', url: '/grammar/spanish/verbs/irregular-verbs', difficulty: 'intermediate' }
];

export default function SpanishChangeVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Change Verbs - Transformation and Becoming',
            description: 'Learn Spanish change verbs including convertirse, volverse, hacerse, and other verbs expressing transformation and becoming.',
            keywords: ['spanish change verbs', 'transformation verbs', 'convertirse', 'volverse', 'hacerse', 'becoming verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'change-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="change-verbs"
        title="Spanish Change Verbs"
        description="Learn Spanish change verbs including convertirse, volverse, hacerse, and other verbs expressing transformation and becoming."
        difficulty="advanced"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/change-verbs/practice"
        quizUrl="/grammar/spanish/verbs/change-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=change-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

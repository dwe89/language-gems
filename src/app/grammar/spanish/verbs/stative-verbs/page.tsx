import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'stative-verbs',
  title: 'Spanish Stative Verbs - States, Conditions, and Being',
  description: 'Learn Spanish stative verbs including ser, estar, parecer, and other verbs expressing states, conditions, and permanent or temporary characteristics.',
  difficulty: 'intermediate',
  keywords: ['spanish stative verbs', 'state verbs', 'ser', 'estar', 'parecer', 'condition verbs', 'being verbs'],
  examples: ['Es inteligente', 'Está cansado', 'Parece feliz', 'Permanece callado']
});

const sections = [
  {
    title: 'Understanding Stative Verbs',
    content: 'Stative verbs express **states**, **conditions**, **characteristics**, and **being** rather than actions. They describe how someone or something is, rather than what they do.',
    examples: [
      {
        spanish: 'Es muy inteligente.',
        english: 'He is very intelligent.',
        highlight: ['Es']
      },
      {
        spanish: 'Está cansada después del trabajo.',
        english: 'She is tired after work.',
        highlight: ['Está']
      },
      {
        spanish: 'Parece contento hoy.',
        english: 'He seems happy today.',
        highlight: ['Parece']
      }
    ]
  },
  {
    title: 'SER - Permanent States and Identity',
    content: 'The verb **"ser"** expresses **permanent characteristics**, **identity**, **origin**, and **essential qualities**.',
    examples: [
      {
        spanish: 'Soy médico.',
        english: 'I am a doctor.',
        highlight: ['Soy']
      },
      {
        spanish: 'Es de España.',
        english: 'He is from Spain.',
        highlight: ['Es']
      },
      {
        spanish: 'Somos estudiantes.',
        english: 'We are students.',
        highlight: ['Somos']
      }
    ],
    subsections: [
      {
        title: 'SER Conjugation',
        content: 'SER is highly irregular in all tenses.',
        conjugationTable: {
          title: 'SER Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'soy', english: 'I am' },
            { pronoun: 'tú', form: 'eres', english: 'you are' },
            { pronoun: 'él/ella', form: 'es', english: 'he/she is' },
            { pronoun: 'nosotros', form: 'somos', english: 'we are' },
            { pronoun: 'vosotros', form: 'sois', english: 'you all are' },
            { pronoun: 'ellos', form: 'son', english: 'they are' }
          ]
        }
      },
      {
        title: 'Uses of SER',
        content: 'SER is used for permanent characteristics and identity.',
        examples: [
          {
            spanish: 'Es alto y moreno. (physical description)',
            english: 'He is tall and dark-haired.',
            highlight: ['Es']
          },
          {
            spanish: 'Son las tres. (time)',
            english: 'It\'s three o\'clock.',
            highlight: ['Son']
          },
          {
            spanish: 'Es mi hermano. (relationship)',
            english: 'He is my brother.',
            highlight: ['Es']
          }
        ]
      }
    ]
  },
  {
    title: 'ESTAR - Temporary States and Location',
    content: 'The verb **"estar"** expresses **temporary conditions**, **location**, **ongoing actions**, and **changeable states**.',
    examples: [
      {
        spanish: 'Estoy en casa.',
        english: 'I am at home.',
        highlight: ['Estoy']
      },
      {
        spanish: 'Está muy feliz hoy.',
        english: 'She is very happy today.',
        highlight: ['Está']
      },
      {
        spanish: 'Estamos estudiando.',
        english: 'We are studying.',
        highlight: ['Estamos']
      }
    ],
    subsections: [
      {
        title: 'ESTAR Conjugation',
        content: 'ESTAR is irregular with accent marks.',
        conjugationTable: {
          title: 'ESTAR Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'estoy', english: 'I am' },
            { pronoun: 'tú', form: 'estás', english: 'you are' },
            { pronoun: 'él/ella', form: 'está', english: 'he/she is' },
            { pronoun: 'nosotros', form: 'estamos', english: 'we are' },
            { pronoun: 'vosotros', form: 'estáis', english: 'you all are' },
            { pronoun: 'ellos', form: 'están', english: 'they are' }
          ]
        }
      },
      {
        title: 'Uses of ESTAR',
        content: 'ESTAR is used for temporary states and location.',
        examples: [
          {
            spanish: 'Está enfermo. (temporary condition)',
            english: 'He is sick.',
            highlight: ['Está']
          },
          {
            spanish: 'Estamos en Madrid. (location)',
            english: 'We are in Madrid.',
            highlight: ['Estamos']
          },
          {
            spanish: 'Está lloviendo. (ongoing action)',
            english: 'It is raining.',
            highlight: ['Está']
          }
        ]
      }
    ]
  },
  {
    title: 'PARECER - Seeming/Appearing',
    content: 'The verb **"parecer"** means "to seem" or "to appear" and expresses **impressions** or **apparent states**.',
    examples: [
      {
        spanish: 'Parece cansado.',
        english: 'He seems tired.',
        highlight: ['Parece']
      },
      {
        spanish: 'Parecen hermanos.',
        english: 'They seem like brothers.',
        highlight: ['Parecen']
      },
      {
        spanish: 'Me parece una buena idea.',
        english: 'It seems like a good idea to me.',
        highlight: ['Me parece']
      }
    ],
    subsections: [
      {
        title: 'PARECER Constructions',
        content: 'Different ways to use parecer.',
        conjugationTable: {
          title: 'PARECER Usage Patterns',
          conjugations: [
            { pronoun: 'parecer + adjective', form: 'parece feliz', english: 'seems happy' },
            { pronoun: 'parecer + noun', form: 'parece médico', english: 'seems like a doctor' },
            { pronoun: 'parecer que', form: 'parece que llueve', english: 'it seems like it\'s raining' },
            { pronoun: 'me parece', form: 'me parece bien', english: 'it seems fine to me' },
            { pronoun: 'parecerse a', form: 'se parece a su padre', english: 'looks like his father' },
            { pronoun: 'al parecer', form: 'al parecer, es verdad', english: 'apparently, it\'s true' }
          ]
        }
      }
    ]
  },
  {
    title: 'PERMANECER - Remaining/Staying',
    content: 'The verb **"permanecer"** means "to remain" or "to stay" in a particular state or condition.',
    examples: [
      {
        spanish: 'Permanece callado durante la reunión.',
        english: 'He remains quiet during the meeting.',
        highlight: ['Permanece']
      },
      {
        spanish: 'Permanecemos unidos como familia.',
        english: 'We remain united as a family.',
        highlight: ['Permanecemos']
      },
      {
        spanish: 'La situación permanece igual.',
        english: 'The situation remains the same.',
        highlight: ['permanece']
      }
    ],
    subsections: [
      {
        title: 'PERMANECER vs QUEDARSE',
        content: 'PERMANECER is more formal than QUEDARSE.',
        conjugationTable: {
          title: 'PERMANECER vs QUEDARSE',
          conjugations: [
            { pronoun: 'Formal/Written', form: 'permanece en silencio', english: 'remains silent' },
            { pronoun: 'Informal/Spoken', form: 'se queda callado', english: 'stays quiet' },
            { pronoun: 'Official context', form: 'permanece cerrado', english: 'remains closed' },
            { pronoun: 'Casual context', form: 'se queda cerrado', english: 'stays closed' },
            { pronoun: 'Literary', form: 'permanece inmóvil', english: 'remains motionless' },
            { pronoun: 'Everyday', form: 'se queda quieto', english: 'stays still' }
          ]
        }
      }
    ]
  },
  {
    title: 'RESULTAR - Turning Out/Proving To Be',
    content: 'The verb **"resultar"** means "to turn out to be" or "to prove to be" and expresses **outcomes** or **results**.',
    examples: [
      {
        spanish: 'Resulta muy difícil.',
        english: 'It turns out to be very difficult.',
        highlight: ['Resulta']
      },
      {
        spanish: 'Resultó ser un buen médico.',
        english: 'He turned out to be a good doctor.',
        highlight: ['Resultó ser']
      },
      {
        spanish: 'Los exámenes resultaron fáciles.',
        english: 'The exams turned out to be easy.',
        highlight: ['resultaron']
      }
    ],
    subsections: [
      {
        title: 'RESULTAR Usage Patterns',
        content: 'Different constructions with resultar.',
        conjugationTable: {
          title: 'RESULTAR Patterns',
          conjugations: [
            { pronoun: 'resultar + adjective', form: 'resulta caro', english: 'turns out expensive' },
            { pronoun: 'resultar ser', form: 'resulta ser verdad', english: 'turns out to be true' },
            { pronoun: 'resultar que', form: 'resulta que no viene', english: 'it turns out he\'s not coming' },
            { pronoun: 'resultar en', form: 'resulta en problemas', english: 'results in problems' },
            { pronoun: 'resultar de', form: 'resulta de la crisis', english: 'results from the crisis' },
            { pronoun: 'no resultar', form: 'no resulta fácil', english: 'doesn\'t turn out easy' }
          ]
        }
      }
    ]
  },
  {
    title: 'CONTINUAR/SEGUIR - Continuing States',
    content: 'The verbs **"continuar"** and **"seguir"** express **continuing** or **ongoing states**.',
    examples: [
      {
        spanish: 'Continúa enfermo.',
        english: 'He continues to be sick.',
        highlight: ['Continúa']
      },
      {
        spanish: 'Sigue siendo mi amigo.',
        english: 'He continues being my friend.',
        highlight: ['Sigue siendo']
      },
      {
        spanish: 'Continuamos preocupados.',
        english: 'We continue to be worried.',
        highlight: ['Continuamos']
      }
    ],
    subsections: [
      {
        title: 'CONTINUAR vs SEGUIR',
        content: 'Both express continuation with slight differences.',
        conjugationTable: {
          title: 'CONTINUAR vs SEGUIR',
          conjugations: [
            { pronoun: 'More formal', form: 'continúa trabajando', english: 'continues working' },
            { pronoun: 'More common', form: 'sigue trabajando', english: 'keeps working' },
            { pronoun: 'Written style', form: 'continúa siendo', english: 'continues being' },
            { pronoun: 'Spoken style', form: 'sigue siendo', english: 'keeps being' },
            { pronoun: 'Official', form: 'continúa cerrado', english: 'continues closed' },
            { pronoun: 'Informal', form: 'sigue cerrado', english: 'stays closed' }
          ]
        }
      }
    ]
  },
  {
    title: 'Emotional and Mental State Verbs',
    content: 'Verbs that express **emotional** and **mental states**.',
    examples: [
      {
        spanish: 'Se siente feliz.',
        english: 'He feels happy.',
        highlight: ['Se siente']
      },
      {
        spanish: 'Ama a su familia.',
        english: 'She loves her family.',
        highlight: ['Ama']
      },
      {
        spanish: 'Odio las mentiras.',
        english: 'I hate lies.',
        highlight: ['Odio']
      }
    ],
    subsections: [
      {
        title: 'Emotional State Verbs',
        content: 'Common verbs for emotional states.',
        conjugationTable: {
          title: 'Emotional State Verbs',
          conjugations: [
            { pronoun: 'sentirse', form: 'me siento bien', english: 'I feel good' },
            { pronoun: 'amar', form: 'amo la música', english: 'I love music' },
            { pronoun: 'odiar', form: 'odio esperar', english: 'I hate waiting' },
            { pronoun: 'temer', form: 'temo la oscuridad', english: 'I fear darkness' },
            { pronoun: 'admirar', form: 'admiro su valor', english: 'I admire his courage' },
            { pronoun: 'respetar', form: 'respeto sus ideas', english: 'I respect his ideas' }
          ]
        }
      },
      {
        title: 'Mental State Verbs',
        content: 'Verbs expressing mental conditions.',
        examples: [
          {
            spanish: 'Confía en sus amigos.',
            english: 'He trusts his friends.',
            highlight: ['Confía']
          },
          {
            spanish: 'Duda de la respuesta.',
            english: 'She doubts the answer.',
            highlight: ['Duda']
          }
        ]
      }
    ]
  },
  {
    title: 'Physical State Verbs',
    content: 'Verbs that express **physical conditions** and **bodily states**.',
    examples: [
      {
        spanish: 'Mide dos metros.',
        english: 'He measures two meters.',
        highlight: ['Mide']
      },
      {
        spanish: 'Pesa cincuenta kilos.',
        english: 'She weighs fifty kilos.',
        highlight: ['Pesa']
      },
      {
        spanish: 'Contiene vitaminas.',
        english: 'It contains vitamins.',
        highlight: ['Contiene']
      }
    ],
    subsections: [
      {
        title: 'Physical Measurement Verbs',
        content: 'Verbs for physical measurements and properties.',
        conjugationTable: {
          title: 'Physical State Verbs',
          conjugations: [
            { pronoun: 'medir', form: 'mide 1.80m', english: 'measures 1.80m' },
            { pronoun: 'pesar', form: 'pesa 70 kilos', english: 'weighs 70 kilos' },
            { pronoun: 'costar', form: 'cuesta 20 euros', english: 'costs 20 euros' },
            { pronoun: 'valer', form: 'vale mucho', english: 'is worth a lot' },
            { pronoun: 'contener', form: 'contiene azúcar', english: 'contains sugar' },
            { pronoun: 'consistir', form: 'consiste en agua', english: 'consists of water' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Interrogatives', url: '/grammar/spanish/verbs/interrogatives', difficulty: 'beginner' },
  { title: 'Subjunctive Imperfect', url: '/grammar/spanish/verbs/subjunctive-imperfect', difficulty: 'advanced' },
  { title: 'Passive Voice', url: '/grammar/spanish/verbs/passive-voice', difficulty: 'advanced' }
];

export default function SpanishStativeVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Stative Verbs - States, Conditions, and Being',
            description: 'Learn Spanish stative verbs including ser, estar, parecer, and other verbs expressing states, conditions, and permanent or temporary characteristics.',
            keywords: ['spanish stative verbs', 'state verbs', 'ser', 'estar', 'parecer', 'condition verbs', 'being verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'stative-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="stative-verbs"
        title="Spanish Stative Verbs"
        description="Learn Spanish stative verbs including ser, estar, parecer, and other verbs expressing states, conditions, and permanent or temporary characteristics."
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/stative-verbs/practice"
        quizUrl="/grammar/spanish/verbs/stative-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=stative-verbs"
        youtubeVideoId="stative-verbs-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

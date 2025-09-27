import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'perception-verbs',
  title: 'Spanish Perception Verbs - Seeing, Hearing, and Sensing',
  description: 'Learn Spanish perception verbs including ver, oír, sentir, and other verbs expressing the five senses and perception.',
  difficulty: 'intermediate',
  keywords: ['spanish perception verbs', 'senses verbs', 'ver', 'oír', 'sentir', 'five senses', 'sensory verbs'],
  examples: ['Veo la montaña', 'Oigo música', 'Siento el frío', 'Huelo flores']
});

const sections = [
  {
    title: 'Understanding Perception Verbs',
    content: 'Perception verbs express **sensory experiences** through the five senses: sight, hearing, touch, smell, and taste. Spanish has specific verbs for each sense and different levels of perception.',
    examples: [
      {
        spanish: 'Veo las estrellas en el cielo.',
        english: 'I see the stars in the sky.',
        highlight: ['Veo']
      },
      {
        spanish: 'Oigo música en la distancia.',
        english: 'I hear music in the distance.',
        highlight: ['Oigo']
      },
      {
        spanish: 'Siento el viento en mi cara.',
        english: 'I feel the wind on my face.',
        highlight: ['Siento']
      }
    ]
  },
  {
    title: 'VER - Seeing/Watching',
    content: 'The verb **"ver"** means "to see" and is used for visual perception, both active and passive.',
    examples: [
      {
        spanish: 'Veo un pájaro en el árbol.',
        english: 'I see a bird in the tree.',
        highlight: ['Veo']
      },
      {
        spanish: 'Vemos la televisión por la noche.',
        english: 'We watch television at night.',
        highlight: ['Vemos']
      },
      {
        spanish: 'No veo bien sin gafas.',
        english: 'I don\'t see well without glasses.',
        highlight: ['veo']
      }
    ],
    subsections: [
      {
        title: 'VER Conjugation',
        content: 'VER is irregular in several tenses.',
        conjugationTable: {
          title: 'VER Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'veo', english: 'I see' },
            { pronoun: 'tú', form: 'ves', english: 'you see' },
            { pronoun: 'él/ella', form: 've', english: 'he/she sees' },
            { pronoun: 'nosotros', form: 'vemos', english: 'we see' },
            { pronoun: 'vosotros', form: 'veis', english: 'you all see' },
            { pronoun: 'ellos', form: 'ven', english: 'they see' }
          ]
        }
      },
      {
        title: 'VER vs MIRAR',
        content: 'VER is passive seeing; MIRAR is active looking.',
        examples: [
          {
            spanish: 'Veo un accidente. (passive)',
            english: 'I see an accident.',
            highlight: ['Veo']
          },
          {
            spanish: 'Miro el accidente. (active)',
            english: 'I look at the accident.',
            highlight: ['Miro']
          }
        ]
      }
    ]
  },
  {
    title: 'MIRAR - Looking/Watching',
    content: 'The verb **"mirar"** means "to look at" or "to watch" and implies **active, intentional** visual attention.',
    examples: [
      {
        spanish: 'Miro las fotos de vacaciones.',
        english: 'I look at vacation photos.',
        highlight: ['Miro']
      },
      {
        spanish: 'Mira por la ventana.',
        english: 'Look out the window.',
        highlight: ['Mira']
      },
      {
        spanish: 'Miramos el partido de fútbol.',
        english: 'We watch the soccer game.',
        highlight: ['Miramos']
      }
    ],
    subsections: [
      {
        title: 'MIRAR Constructions',
        content: 'Different prepositions with mirar.',
        conjugationTable: {
          title: 'MIRAR Usage Patterns',
          conjugations: [
            { pronoun: 'mirar a', form: 'miro a María', english: 'I look at María' },
            { pronoun: 'mirar por', form: 'miro por la ventana', english: 'I look through the window' },
            { pronoun: 'mirar hacia', form: 'miro hacia arriba', english: 'I look upward' },
            { pronoun: 'mirar de', form: 'miro de reojo', english: 'I look sideways' },
            { pronoun: 'mirar con', form: 'miro con atención', english: 'I look carefully' },
            { pronoun: 'mirarse', form: 'me miro en el espejo', english: 'I look at myself in the mirror' }
          ]
        }
      }
    ]
  },
  {
    title: 'OÍR - Hearing',
    content: 'The verb **"oír"** means "to hear" and refers to **passive auditory perception**.',
    examples: [
      {
        spanish: 'Oigo ruido en la cocina.',
        english: 'I hear noise in the kitchen.',
        highlight: ['Oigo']
      },
      {
        spanish: 'No oye bien del oído derecho.',
        english: 'He doesn\'t hear well from his right ear.',
        highlight: ['oye']
      },
      {
        spanish: 'Oímos truenos a lo lejos.',
        english: 'We hear thunder in the distance.',
        highlight: ['Oímos']
      }
    ],
    subsections: [
      {
        title: 'OÍR Conjugation',
        content: 'OÍR is highly irregular.',
        conjugationTable: {
          title: 'OÍR Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'oigo', english: 'I hear' },
            { pronoun: 'tú', form: 'oyes', english: 'you hear' },
            { pronoun: 'él/ella', form: 'oye', english: 'he/she hears' },
            { pronoun: 'nosotros', form: 'oímos', english: 'we hear' },
            { pronoun: 'vosotros', form: 'oís', english: 'you all hear' },
            { pronoun: 'ellos', form: 'oyen', english: 'they hear' }
          ]
        }
      },
      {
        title: 'OÍR vs ESCUCHAR',
        content: 'OÍR is passive hearing; ESCUCHAR is active listening.',
        examples: [
          {
            spanish: 'Oigo música. (passive)',
            english: 'I hear music.',
            highlight: ['Oigo']
          },
          {
            spanish: 'Escucho música. (active)',
            english: 'I listen to music.',
            highlight: ['Escucho']
          }
        ]
      }
    ]
  },
  {
    title: 'SENTIR - Feeling/Sensing',
    content: 'The verb **"sentir"** means "to feel" and covers **tactile sensations** and **emotional feelings**.',
    examples: [
      {
        spanish: 'Siento el calor del sol.',
        english: 'I feel the heat of the sun.',
        highlight: ['Siento']
      },
      {
        spanish: 'Siente dolor en la espalda.',
        english: 'He feels pain in his back.',
        highlight: ['Siente']
      },
      {
        spanish: 'Sentimos mucha alegría.',
        english: 'We feel great joy.',
        highlight: ['Sentimos']
      }
    ],
    subsections: [
      {
        title: 'SENTIR Conjugation',
        content: 'SENTIR is a stem-changing verb (e→ie, e→i).',
        conjugationTable: {
          title: 'SENTIR Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'siento', english: 'I feel' },
            { pronoun: 'tú', form: 'sientes', english: 'you feel' },
            { pronoun: 'él/ella', form: 'siente', english: 'he/she feels' },
            { pronoun: 'nosotros', form: 'sentimos', english: 'we feel' },
            { pronoun: 'vosotros', form: 'sentís', english: 'you all feel' },
            { pronoun: 'ellos', form: 'sienten', english: 'they feel' }
          ]
        }
      },
      {
        title: 'SENTIR vs SENTIRSE',
        content: 'SENTIR (feel something) vs SENTIRSE (feel a certain way).',
        examples: [
          {
            spanish: 'Siento frío. (feel cold)',
            english: 'I feel cold.',
            highlight: ['Siento']
          },
          {
            spanish: 'Me siento feliz. (feel happy)',
            english: 'I feel happy.',
            highlight: ['Me siento']
          }
        ]
      }
    ]
  },
  {
    title: 'OLER - Smelling',
    content: 'The verb **"oler"** means "to smell" and refers to **olfactory perception**.',
    examples: [
      {
        spanish: 'Huelo flores en el jardín.',
        english: 'I smell flowers in the garden.',
        highlight: ['Huelo']
      },
      {
        spanish: 'Esta comida huele muy bien.',
        english: 'This food smells very good.',
        highlight: ['huele']
      },
      {
        spanish: 'Olemos humo.',
        english: 'We smell smoke.',
        highlight: ['Olemos']
      }
    ],
    subsections: [
      {
        title: 'OLER Conjugation',
        content: 'OLER is stem-changing (o→hue) and adds h- in some forms.',
        conjugationTable: {
          title: 'OLER Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'huelo', english: 'I smell' },
            { pronoun: 'tú', form: 'hueles', english: 'you smell' },
            { pronoun: 'él/ella', form: 'huele', english: 'he/she smells' },
            { pronoun: 'nosotros', form: 'olemos', english: 'we smell' },
            { pronoun: 'vosotros', form: 'oléis', english: 'you all smell' },
            { pronoun: 'ellos', form: 'huelen', english: 'they smell' }
          ]
        }
      },
      {
        title: 'OLER Usage Patterns',
        content: 'Different ways to use oler.',
        examples: [
          {
            spanish: 'Huelo a perfume. (I smell like perfume)',
            english: 'I smell like perfume.',
            highlight: ['Huelo a']
          },
          {
            spanish: 'Huelo el perfume. (I smell the perfume)',
            english: 'I smell the perfume.',
            highlight: ['Huelo']
          }
        ]
      }
    ]
  },
  {
    title: 'SABER - Tasting',
    content: 'The verb **"saber"** means "to taste" when referring to **gustatory perception**, and "to know" in other contexts.',
    examples: [
      {
        spanish: 'Esta sopa sabe a pollo.',
        english: 'This soup tastes like chicken.',
        highlight: ['sabe']
      },
      {
        spanish: 'No sabe bien esta fruta.',
        english: 'This fruit doesn\'t taste good.',
        highlight: ['sabe']
      },
      {
        spanish: 'Sabe dulce.',
        english: 'It tastes sweet.',
        highlight: ['Sabe']
      }
    ],
    subsections: [
      {
        title: 'SABER for Taste',
        content: 'Using saber to express taste.',
        conjugationTable: {
          title: 'SABER Taste Expressions',
          conjugations: [
            { pronoun: 'saber a', form: 'sabe a chocolate', english: 'it tastes like chocolate' },
            { pronoun: 'saber bien', form: 'sabe bien', english: 'it tastes good' },
            { pronoun: 'saber mal', form: 'sabe mal', english: 'it tastes bad' },
            { pronoun: 'saber dulce', form: 'sabe dulce', english: 'it tastes sweet' },
            { pronoun: 'saber salado', form: 'sabe salado', english: 'it tastes salty' },
            { pronoun: 'saber amargo', form: 'sabe amargo', english: 'it tastes bitter' }
          ]
        }
      },
      {
        title: 'PROBAR - Tasting/Trying',
        content: 'PROBAR means to taste or try food.',
        examples: [
          {
            spanish: 'Pruebo la comida.',
            english: 'I taste the food.',
            highlight: ['Pruebo']
          },
          {
            spanish: 'Prueba este postre.',
            english: 'Try this dessert.',
            highlight: ['Prueba']
          }
        ]
      }
    ]
  },
  {
    title: 'TOCAR - Touching',
    content: 'The verb **"tocar"** means "to touch" and refers to **tactile contact**.',
    examples: [
      {
        spanish: 'Toco la superficie suave.',
        english: 'I touch the smooth surface.',
        highlight: ['Toco']
      },
      {
        spanish: 'No toques la estufa caliente.',
        english: 'Don\'t touch the hot stove.',
        highlight: ['toques']
      },
      {
        spanish: 'Tocamos la arena con los pies.',
        english: 'We touch the sand with our feet.',
        highlight: ['Tocamos']
      }
    ],
    subsections: [
      {
        title: 'TOCAR Multiple Meanings',
        content: 'TOCAR has several meanings beyond touching.',
        conjugationTable: {
          title: 'TOCAR Meanings',
          conjugations: [
            { pronoun: 'Touch', form: 'toco la mesa', english: 'I touch the table' },
            { pronoun: 'Play instrument', form: 'toco el piano', english: 'I play the piano' },
            { pronoun: 'Knock', form: 'toco la puerta', english: 'I knock on the door' },
            { pronoun: 'Be one\'s turn', form: 'me toca hablar', english: 'it\'s my turn to speak' },
            { pronoun: 'Ring/sound', form: 'toca el timbre', english: 'the bell rings' },
            { pronoun: 'Concern', form: 'me toca a mí', english: 'it concerns me' }
          ]
        }
      }
    ]
  },
  {
    title: 'Perception Verb Constructions',
    content: 'Special constructions with perception verbs for **indirect perception** and **reported perception**.',
    examples: [
      {
        spanish: 'Veo que está triste.',
        english: 'I see that he\'s sad.',
        highlight: ['Veo que']
      },
      {
        spanish: 'Oigo decir que viene.',
        english: 'I hear (it said) that he\'s coming.',
        highlight: ['Oigo decir que']
      },
      {
        spanish: 'Siento que me observan.',
        english: 'I feel that they\'re watching me.',
        highlight: ['Siento que']
      }
    ],
    subsections: [
      {
        title: 'Perception + QUE Clauses',
        content: 'Using perception verbs with que clauses.',
        conjugationTable: {
          title: 'Perception + QUE Constructions',
          conjugations: [
            { pronoun: 'ver que', form: 'veo que llueve', english: 'I see that it\'s raining' },
            { pronoun: 'oír que', form: 'oigo que cantan', english: 'I hear that they\'re singing' },
            { pronoun: 'sentir que', form: 'siento que vibra', english: 'I feel that it\'s vibrating' },
            { pronoun: 'notar que', form: 'noto que está nervioso', english: 'I notice that he\'s nervous' },
            { pronoun: 'percibir que', form: 'percibo que hay tensión', english: 'I perceive that there\'s tension' },
            { pronoun: 'observar que', form: 'observo que cambia', english: 'I observe that it\'s changing' }
          ]
        }
      },
      {
        title: 'Perception + Infinitive',
        content: 'Using perception verbs with infinitives.',
        examples: [
          {
            spanish: 'Veo llover.',
            english: 'I see it raining.',
            highlight: ['Veo llover']
          },
          {
            spanish: 'Oigo cantar a los pájaros.',
            english: 'I hear the birds singing.',
            highlight: ['Oigo cantar']
          }
        ]
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' },
  { title: 'Reflexive Verbs', url: '/grammar/spanish/verbs/reflexive', difficulty: 'intermediate' },
  { title: 'Present Perfect', url: '/grammar/spanish/verbs/present-perfect', difficulty: 'intermediate' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' }
];

export default function SpanishPerceptionVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Perception Verbs - Seeing, Hearing, and Sensing',
            description: 'Learn Spanish perception verbs including ver, oír, sentir, and other verbs expressing the five senses and perception.',
            keywords: ['spanish perception verbs', 'senses verbs', 'ver', 'oír', 'sentir', 'five senses', 'sensory verbs'],
            language: 'spanish',
            category: 'verbs',
            topic: 'perception-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="perception-verbs"
        title="Spanish Perception Verbs"
        description="Learn Spanish perception verbs including ver, oír, sentir, and other verbs expressing the five senses and perception."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/perception-verbs/practice"
        quizUrl="/grammar/spanish/verbs/perception-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=perception-verbs"
        youtubeVideoId="perception-verbs-spanish"
        relatedTopics={relatedTopics}
      />
    </>
  );
}

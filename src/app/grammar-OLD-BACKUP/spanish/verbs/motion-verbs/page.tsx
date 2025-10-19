import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'motion-verbs',
  title: 'Spanish Motion Verbs - Movement and Direction',
  description: 'Learn Spanish motion verbs including ir, venir, salir, entrar, and other verbs expressing movement, direction, and manner of motion.',
  difficulty: 'intermediate',
  keywords: ['spanish motion verbs', 'movement verbs', 'direction verbs', 'ir', 'venir', 'salir', 'entrar', 'transportation'],
  examples: ['Voy a casa', 'Viene de Madrid', 'Sale del trabajo', 'Entra en la tienda']
});

const sections = [
  {
    title: 'Understanding Motion Verbs',
    content: 'Motion verbs express **movement**, **direction**, and **manner of motion**. Spanish has a rich system of motion verbs that specify not just movement but also direction relative to the speaker.',
    examples: [
      {
        spanish: 'Voy a la escuela.',
        english: 'I go to school.',
        highlight: ['Voy']
      },
      {
        spanish: 'Viene de París.',
        english: 'He comes from Paris.',
        highlight: ['Viene']
      },
      {
        spanish: 'Camina lentamente.',
        english: 'He walks slowly.',
        highlight: ['Camina']
      }
    ]
  },
  {
    title: 'IR - Going Away from Speaker',
    content: 'The verb **"ir"** expresses movement **away from the speaker** or to a destination.',
    examples: [
      {
        spanish: 'Voy al supermercado.',
        english: 'I\'m going to the supermarket.',
        highlight: ['Voy']
      },
      {
        spanish: 'Fueron a España el año pasado.',
        english: 'They went to Spain last year.',
        highlight: ['Fueron']
      },
      {
        spanish: 'Iremos en tren.',
        english: 'We\'ll go by train.',
        highlight: ['Iremos']
      }
    ],
    subsections: [
      {
        title: 'IR Conjugation',
        content: 'IR is highly irregular in most tenses.',
        conjugationTable: {
          title: 'IR Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'voy', english: 'I go' },
            { pronoun: 'tú', form: 'vas', english: 'you go' },
            { pronoun: 'él/ella', form: 'va', english: 'he/she goes' },
            { pronoun: 'nosotros', form: 'vamos', english: 'we go' },
            { pronoun: 'vosotros', form: 'vais', english: 'you all go' },
            { pronoun: 'ellos', form: 'van', english: 'they go' }
          ]
        }
      },
      {
        title: 'IR + A for Future',
        content: 'IR + A + infinitive expresses near future.',
        examples: [
          {
            spanish: 'Voy a estudiar esta noche.',
            english: 'I\'m going to study tonight.',
            highlight: ['Voy a']
          },
          {
            spanish: 'Van a llegar tarde.',
            english: 'They\'re going to arrive late.',
            highlight: ['Van a']
          }
        ]
      }
    ]
  },
  {
    title: 'VENIR - Coming Toward Speaker',
    content: 'The verb **"venir"** expresses movement **toward the speaker** or from an origin.',
    examples: [
      {
        spanish: 'Viene a visitarnos mañana.',
        english: 'He\'s coming to visit us tomorrow.',
        highlight: ['Viene']
      },
      {
        spanish: 'Vengo de la biblioteca.',
        english: 'I come from the library.',
        highlight: ['Vengo']
      },
      {
        spanish: 'Vinieron en autobús.',
        english: 'They came by bus.',
        highlight: ['Vinieron']
      }
    ],
    subsections: [
      {
        title: 'VENIR Conjugation',
        content: 'VENIR is irregular with stem changes.',
        conjugationTable: {
          title: 'VENIR Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'vengo', english: 'I come' },
            { pronoun: 'tú', form: 'vienes', english: 'you come' },
            { pronoun: 'él/ella', form: 'viene', english: 'he/she comes' },
            { pronoun: 'nosotros', form: 'venimos', english: 'we come' },
            { pronoun: 'vosotros', form: 'venís', english: 'you all come' },
            { pronoun: 'ellos', form: 'vienen', english: 'they come' }
          ]
        }
      },
      {
        title: 'IR vs VENIR',
        content: 'The choice depends on the speaker\'s perspective.',
        examples: [
          {
            spanish: 'Voy a tu casa. (I\'m going to your house)',
            english: 'I\'m going to your house.',
            highlight: ['Voy']
          },
          {
            spanish: 'Vengo a tu casa. (I\'m coming to your house)',
            english: 'I\'m coming to your house.',
            highlight: ['Vengo']
          }
        ]
      }
    ]
  },
  {
    title: 'SALIR - Exiting/Leaving',
    content: 'The verb **"salir"** expresses **leaving** or **exiting** from a place.',
    examples: [
      {
        spanish: 'Salgo de casa a las ocho.',
        english: 'I leave home at eight.',
        highlight: ['Salgo']
      },
      {
        spanish: 'Salieron del cine tarde.',
        english: 'They left the cinema late.',
        highlight: ['Salieron']
      },
      {
        spanish: 'El sol sale por el este.',
        english: 'The sun rises in the east.',
        highlight: ['sale']
      }
    ],
    subsections: [
      {
        title: 'SALIR Conjugation',
        content: 'SALIR is irregular in the first person singular.',
        conjugationTable: {
          title: 'SALIR Present Tense',
          conjugations: [
            { pronoun: 'yo', form: 'salgo', english: 'I leave/go out' },
            { pronoun: 'tú', form: 'sales', english: 'you leave/go out' },
            { pronoun: 'él/ella', form: 'sale', english: 'he/she leaves/goes out' },
            { pronoun: 'nosotros', form: 'salimos', english: 'we leave/go out' },
            { pronoun: 'vosotros', form: 'salís', english: 'you all leave/go out' },
            { pronoun: 'ellos', form: 'salen', english: 'they leave/go out' }
          ]
        }
      },
      {
        title: 'SALIR Constructions',
        content: 'Different uses of salir.',
        examples: [
          {
            spanish: 'Salir de (leave from)',
            english: 'Salgo de la oficina.',
            highlight: ['Salir de']
          },
          {
            spanish: 'Salir con (go out with)',
            english: 'Sale con María.',
            highlight: ['Sale con']
          },
          {
            spanish: 'Salir a (go out to)',
            english: 'Salimos a cenar.',
            highlight: ['Salimos a']
          }
        ]
      }
    ]
  },
  {
    title: 'ENTRAR - Entering',
    content: 'The verb **"entrar"** expresses **entering** or **going into** a place.',
    examples: [
      {
        spanish: 'Entro en la tienda.',
        english: 'I enter the store.',
        highlight: ['Entro']
      },
      {
        spanish: 'Entraron por la puerta principal.',
        english: 'They entered through the main door.',
        highlight: ['Entraron']
      },
      {
        spanish: 'No puede entrar sin permiso.',
        english: 'He can\'t enter without permission.',
        highlight: ['entrar']
      }
    ],
    subsections: [
      {
        title: 'ENTRAR Constructions',
        content: 'Different prepositions with entrar.',
        conjugationTable: {
          title: 'ENTRAR Preposition Usage',
          conjugations: [
            { pronoun: 'entrar en', form: 'entro en la casa', english: 'enter the house (Spain)' },
            { pronoun: 'entrar a', form: 'entro a la casa', english: 'enter the house (Latin America)' },
            { pronoun: 'entrar por', form: 'entro por la ventana', english: 'enter through the window' },
            { pronoun: 'entrar sin', form: 'entro sin llamar', english: 'enter without knocking' },
            { pronoun: 'entrar con', form: 'entro con cuidado', english: 'enter carefully' },
            { pronoun: 'entrar hasta', form: 'entro hasta el fondo', english: 'enter all the way to the back' }
          ]
        }
      }
    ]
  },
  {
    title: 'LLEGAR - Arriving',
    content: 'The verb **"llegar"** expresses **arriving** at a destination.',
    examples: [
      {
        spanish: 'Llego a tiempo al trabajo.',
        english: 'I arrive at work on time.',
        highlight: ['Llego']
      },
      {
        spanish: 'Llegaron ayer por la noche.',
        english: 'They arrived last night.',
        highlight: ['Llegaron']
      },
      {
        spanish: 'El tren llega a las tres.',
        english: 'The train arrives at three.',
        highlight: ['llega']
      }
    ],
    subsections: [
      {
        title: 'LLEGAR Constructions',
        content: 'Different uses of llegar.',
        conjugationTable: {
          title: 'LLEGAR Usage Patterns',
          conjugations: [
            { pronoun: 'llegar a', form: 'llego a Madrid', english: 'arrive in Madrid' },
            { pronoun: 'llegar de', form: 'llego de París', english: 'arrive from Paris' },
            { pronoun: 'llegar hasta', form: 'llego hasta la plaza', english: 'reach the square' },
            { pronoun: 'llegar tarde', form: 'llego tarde', english: 'arrive late' },
            { pronoun: 'llegar temprano', form: 'llego temprano', english: 'arrive early' },
            { pronoun: 'llegar a ser', form: 'llego a ser médico', english: 'become a doctor' }
          ]
        }
      }
    ]
  },
  {
    title: 'Manner of Motion Verbs',
    content: 'Verbs that specify **how** movement occurs.',
    examples: [
      {
        spanish: 'Camina por el parque.',
        english: 'He walks through the park.',
        highlight: ['Camina']
      },
      {
        spanish: 'Corre muy rápido.',
        english: 'She runs very fast.',
        highlight: ['Corre']
      },
      {
        spanish: 'Vuela a gran altura.',
        english: 'It flies at great height.',
        highlight: ['Vuela']
      }
    ],
    subsections: [
      {
        title: 'Common Manner of Motion Verbs',
        content: 'Verbs describing how movement happens.',
        conjugationTable: {
          title: 'Manner of Motion Verbs',
          conjugations: [
            { pronoun: 'caminar', form: 'camino', english: 'I walk' },
            { pronoun: 'correr', form: 'corro', english: 'I run' },
            { pronoun: 'volar', form: 'vuelo', english: 'I fly' },
            { pronoun: 'nadar', form: 'nado', english: 'I swim' },
            { pronoun: 'saltar', form: 'salto', english: 'I jump' },
            { pronoun: 'gatear', form: 'gateo', english: 'I crawl' }
          ]
        }
      },
      {
        title: 'Speed and Intensity',
        content: 'Expressing speed and intensity of movement.',
        examples: [
          {
            spanish: 'Camina lentamente.',
            english: 'He walks slowly.',
            highlight: ['lentamente']
          },
          {
            spanish: 'Corre a toda velocidad.',
            english: 'She runs at full speed.',
            highlight: ['a toda velocidad']
          }
        ]
      }
    ]
  },
  {
    title: 'Transportation Verbs',
    content: 'Verbs related to **means of transportation**.',
    examples: [
      {
        spanish: 'Conduce un coche nuevo.',
        english: 'He drives a new car.',
        highlight: ['Conduce']
      },
      {
        spanish: 'Monta en bicicleta.',
        english: 'She rides a bicycle.',
        highlight: ['Monta']
      },
      {
        spanish: 'Navega por el océano.',
        english: 'He sails across the ocean.',
        highlight: ['Navega']
      }
    ],
    subsections: [
      {
        title: 'Transportation Verb Patterns',
        content: 'Verbs for different modes of transport.',
        conjugationTable: {
          title: 'Transportation Verbs',
          conjugations: [
            { pronoun: 'conducir', form: 'conduzco un coche', english: 'I drive a car' },
            { pronoun: 'montar', form: 'monto en bicicleta', english: 'I ride a bicycle' },
            { pronoun: 'navegar', form: 'navego en barco', english: 'I sail by boat' },
            { pronoun: 'viajar', form: 'viajo en tren', english: 'I travel by train' },
            { pronoun: 'pilotear', form: 'piloteo un avión', english: 'I pilot a plane' },
            { pronoun: 'remar', form: 'remo en canoa', english: 'I row a canoe' }
          ]
        }
      }
    ]
  },
  {
    title: 'Directional Motion Verbs',
    content: 'Verbs that specify **direction** of movement.',
    examples: [
      {
        spanish: 'Sube las escaleras.',
        english: 'He goes up the stairs.',
        highlight: ['Sube']
      },
      {
        spanish: 'Baja al sótano.',
        english: 'She goes down to the basement.',
        highlight: ['Baja']
      },
      {
        spanish: 'Cruza la calle.',
        english: 'He crosses the street.',
        highlight: ['Cruza']
      }
    ],
    subsections: [
      {
        title: 'Directional Verb Patterns',
        content: 'Verbs indicating direction of movement.',
        conjugationTable: {
          title: 'Directional Motion Verbs',
          conjugations: [
            { pronoun: 'subir', form: 'subo la montaña', english: 'I go up the mountain' },
            { pronoun: 'bajar', form: 'bajo las escaleras', english: 'I go down the stairs' },
            { pronoun: 'cruzar', form: 'cruzo el río', english: 'I cross the river' },
            { pronoun: 'rodear', form: 'rodeo el edificio', english: 'I go around the building' },
            { pronoun: 'atravesar', form: 'atravieso el parque', english: 'I go through the park' },
            { pronoun: 'seguir', form: 'sigo el camino', english: 'I follow the path' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Interrogatives', url: '/grammar/spanish/verbs/interrogatives', difficulty: 'beginner' },
  { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite', difficulty: 'intermediate' },
  { title: 'Reflexive Verbs', url: '/grammar/spanish/verbs/reflexive', difficulty: 'intermediate' }
];

export default function SpanishMotionVerbsPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Motion Verbs - Movement and Direction',
            description: 'Learn Spanish motion verbs including ir, venir, salir, entrar, and other verbs expressing movement, direction, and manner of motion.',
            keywords: ['spanish motion verbs', 'movement verbs', 'direction verbs', 'ir', 'venir', 'salir', 'entrar'],
            language: 'spanish',
            category: 'verbs',
            topic: 'motion-verbs'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="motion-verbs"
        title="Spanish Motion Verbs"
        description="Learn Spanish motion verbs including ir, venir, salir, entrar, and other verbs expressing movement, direction, and manner of motion."
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/motion-verbs/practice"
        quizUrl="/grammar/spanish/verbs/motion-verbs/quiz"
        songUrl="/songs/es?theme=grammar&topic=motion-verbs"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
